import { useCallback, useEffect, useState } from "react";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { SnackbarProvider, enqueueSnackbar } from "notistack";

import RequestHandler from "@/helpers/RequestHandler";
import S3Helper from "@/helpers/S3Helper";
import { registerServiceWorker } from "@/helpers/ServiceWorkerHelper";

import SetDetails from "@/components/SetDetails";
import PartnerView from "@/components/PartnerView";
import EditPartner from "@/components/EditPartner";
import LoadingScreen from "@/components/LoadingScreen";
import EditDetails from "@/components/EditDetails";
import { Header, Footer } from "@/components/navigationComponents";
import {
  Login,
  People,
  Partners,
  Lobby,
  Stage,
  Meetings,
} from "@/components/mainPages";
import UserView from "@/components/UserView";
import Conversations from "@/components/Conversations";
import PWAInstructionModal from "@/components/PWAInstructionModal";

import { EventContext } from "@/context/EventContext";
import { Conversation, Event, User, UserDetails } from "@/types";

export type SomeUserDetails = { [K in keyof User]?: User[K] };

const EventPage = () => {
  const [event, setEvent] = useState<Event | undefined>(undefined);
  const [user, setUser] = useState<User | undefined>(undefined);
  const [loadingUser, setLoadingUser] = useState(true);
  const [waitingMeetings, setWaitingMeetings] = useState(0);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loadingConversations, setLoadingConversations] = useState(false);
  const [unreadConversations, setUnreadConversations] = useState(0);
  const [appDialogLoading, setAppDialogLoading] = useState(false);

  const pathname = usePathname();
  const params = useSearchParams();
  const router = useRouter();

  const page = params.get("page");
  const code = params.get("code");
  const edit = params.get("edit");
  const view = params.get("view");
  const partner = params.get("partner");
  const viewUser = params.get("user");

  // These function definitions could in theory use the useCallback hook, but it's not really needed — should avoid premature optimization if the functions are not passed down.
  const getEvent = async () => {
    const paths = pathname.split("/").filter((s) => !!s);
    const eventKey = paths[0];
    if (!eventKey) setEvent(undefined);
    const event = await RequestHandler.get(`events/${eventKey}`);
    setEvent(event);
  };

  const onLogin = useCallback(
    async (code: string) => {
      try {
        const user = await RequestHandler.post("auth/login", { code });
        RequestHandler.setToken(user.accessToken);
        delete user.accessToken;
        setUser(user);
        setLoadingUser(false);
        router.replace(pathname);
        window.scrollTo(0, 0);
      } catch (e) {
        console.error(e);
      }
    },
    [code, pathname]
  );

  const setCurrentUser = async () => {
    if (!event) return;
    try {
      // If a code exists in the URL, the user is logged in with the code
      if (code) {
        onLogin(code);
        return;
      }

      // If a user already exists, let's update the user information
      if (user) {
        const user = await RequestHandler.get(`user`);
        setUser(user);
        setLoadingUser(false);
        return;
      }

      // If a saved token exists, let's load the user info based on the token
      const savedToken = RequestHandler.loadTokenFromLS();
      if (savedToken) {
        RequestHandler.setToken(savedToken);
        const user = await RequestHandler.get(`user`);
        if (user.event != event._id) {
          onLogout();
          setLoadingUser(false);
          return;
        }
        setUser(user);
        setLoadingUser(false);
        return;
      }

      // If no user or token exists, let's just stop the loading
      setLoadingUser(false);
    } catch (e) {
      console.error(e);
    }
  };

  const onNewMessageReceived = (event: MessageEvent<any>) => {
    switch (event.data) {
      case "CHAT": // a new chat message has been received
        getConversations();
        break;
      case "MEETING": // a new meeting invitation has been received
        getWaitingMeetings();
        break;
      default:
        break;
    }
  };

  const setupPushNotifications = async () => {
    if (!user || !user.loggedIn) return;
    if ("serviceWorker" in navigator) {
      const pushSubscription = await registerServiceWorker(
        onNewMessageReceived
      ).catch(console.log);
      const _ = await RequestHandler.patch(`users/${user?._id}`, {
        pushSubscription,
      });
    }
  };

  const isIOS = (): boolean => {
    if ("standalone" in navigator && navigator["standalone"]) {
      //user has already installed the PWA app
      return false;
    }
    const ua = window.navigator.userAgent;
    const isIPad = !!ua.match(/iPad/i);
    const isIPhone = !!ua.match(/iPhone/i);
    return isIPad || isIPhone;
  };

  const getWaitingMeetings = async () => {
    if (!event || !user || !user.loggedIn) return;
    const waitingMeetings = await RequestHandler.get(
      `meetings/${event._id}/waiting`
    );
    setWaitingMeetings((waitingMeetings || []).length);
  };

  const getConversations = useCallback(async () => {
    if (!event || !user || !user.loggedIn) return;
    setLoadingConversations(true);
    const conversations: Conversation[] = await RequestHandler.get(
      `messages/${event?._id}`
    );
    const unreadConversations = conversations.reduce(
      (acc: number, convo) => acc + (convo.unread || 0),
      0
    );
    setConversations(conversations);
    setUnreadConversations(unreadConversations);
    setLoadingConversations(false);
  }, [
    event,
    user,
    setConversations,
    setUnreadConversations,
    setLoadingConversations,
  ]);

  const handleVisibilityChanged = () => {
    // Let's refresh event data when the app is brought to the foreground
    if (document.visibilityState == "visible") {
      getEvent();
    }
  };

  useEffect(() => {
    getEvent();
    document.addEventListener("visibilitychange", handleVisibilityChanged);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChanged);
  }, []);

  useEffect(() => {
    setCurrentUser();
  }, [event]);

  useEffect(() => {
    setupPushNotifications();
    getWaitingMeetings();
    getConversations();
  }, [user]);

  const saveUserDetails = async (
    details: SomeUserDetails,
    noSnackbar = false
  ) => {
    const _ = await RequestHandler.patch(`users/${user?._id}`, details);
    !noSnackbar && enqueueSnackbar("Details saved!", { variant: "success" });
    noSnackbar && window.scrollTo(0, 0);
  };

  const onSaveDetails = useCallback(
    async (details: SomeUserDetails, noSnackbar = false) => {
      try {
        const picture =
          details.picture && typeof details.picture != "string"
            ? await S3Helper.uploadProfilePicture(details.picture)
            : undefined;
        await saveUserDetails(
          {
            ...details,
            loggedIn: true,
            ...(picture ? { picture } : {}),
          },
          noSnackbar
        );
        setCurrentUser();
      } catch (e) {
        console.error(e);
      }
    },
    [setCurrentUser]
  );

  const saveInitialDetails = useCallback(
    (details: SomeUserDetails) => onSaveDetails(details, true),
    [onSaveDetails]
  );

  const onSaveInterests = async (interests: string[]) => {
    try {
      const _ = await RequestHandler.patch(`users/${user?._id}`, {
        interests,
      });
      enqueueSnackbar("Interests saved!", { variant: "success" });
      setCurrentUser();
    } catch (e) {
      console.error(e);
    }
  };

  const setAppDialogSeen = useCallback(() => {
    setAppDialogLoading(true);
    onSaveDetails({ appDialogSeen: true }, true);
  }, [onSaveDetails]);

  const onSaveAvailabilities = async (availableTimes: string[]) => {
    try {
      const _ = await RequestHandler.patch(`users/${user?._id}`, {
        availableTimes,
      });
      enqueueSnackbar("Availability saved!", { variant: "success" });
      setCurrentUser();
    } catch (e) {
      console.error(e);
    }
  };

  const onLogout = useCallback(() => {
    RequestHandler.setToken(undefined);
    setUser(undefined);
  }, [setUser]);

  if (!event) {
    return <LoadingScreen />;
  }

  if (loadingUser) {
    return <LoadingScreen />;
  }

  if (!user) {
    return (
      <EventContext.Provider
        value={{
          event,
        }}
      >
        <Login onLogin={onLogin} />
      </EventContext.Provider>
    );
  }

  if (!user.loggedIn) {
    return (
      <EventContext.Provider
        value={{
          event,
          user,
        }}
      >
        <SetDetails onSaveDetails={saveInitialDetails} />
      </EventContext.Provider>
    );
  }

  // Could use useMemo here to prevent unnecessary renders, but not really needed now – could cause some further issues down the road.
  const renderContent = () => {
    switch (page) {
      case "exhibition":
        return <Partners />;
      case "stage":
        return <Stage />;
      case "people":
        return <People />;
      case "meetings":
        return <Meetings />;
      default:
        return <Lobby />;
    }
  };

  const renderModals = () => {
    return (
      <>
        {!!partner && <PartnerView open={true} />}
        {edit == "partner" && <EditPartner open={true} />}
        {edit == "details" && (
          <EditDetails
            open={true}
            onSaveDetails={onSaveDetails}
            onSaveInterests={onSaveInterests}
            onSaveAvailabilities={onSaveAvailabilities}
          />
        )}
        {!!viewUser && <UserView open={true} />}
        {view == "conversations" && <Conversations open={true} />}
        {isIOS() && !user.appDialogSeen && (
          <PWAInstructionModal
            event={event}
            setAppDialogSeen={setAppDialogSeen}
            appDialogLoading={appDialogLoading}
          />
        )}
      </>
    );
  };

  return (
    <SnackbarProvider classes={{ anchorOriginBottomLeft: "ves-snackbar" }}>
      <EventContext.Provider
        value={{
          event,
          user,
          waitingMeetings,
          setWaitingMeetings,
          conversations,
          getConversations,
          loadingConversations,
          unreadConversations,
        }}
      >
        <main className="flex min-h-screen flex-col items-center justify-between relative">
          <Header onLogout={onLogout} />
          {renderContent()}
          <Footer />
          {renderModals()}
        </main>
      </EventContext.Provider>
    </SnackbarProvider>
  );
};

export default EventPage;
