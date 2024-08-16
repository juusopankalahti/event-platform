import { useContext, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CircularProgress } from "@mui/material";
import {
  CalendarMonth,
  Chat,
  Email,
  LinkedIn,
  Phone,
} from "@mui/icons-material";

import RequestHandler from "@/helpers/RequestHandler";
import { formatLink } from "@/helpers/GeneralHelpers";

import Modal from "@/components/Modal";
import Button from "@/components/Button";
import ProposeMeeting from "@/components/ProposeMeeting";
import ChatView from "@/components/ChatView";

import { Interest, User } from "@/types";
import { EventContext } from "@/context/EventContext";

interface Props {
  open?: boolean;
  userId?: string;
  onClose?: () => void;
}

export type AnotherUser = Omit<User, "interests"> & { interests: Interest[] };

const UserView = (props: Props) => {
  const context = useContext(EventContext);

  const [user, setUser] = useState<AnotherUser | undefined>(undefined);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);

  const userId = props.userId || useSearchParams().get("user");

  const getUser = async () => {
    if (!userId) return;
    const user = await RequestHandler.get(
      `users/${context.event?._id}/${userId}`
    );
    setUser(user);
  };
  useEffect(() => {
    getUser();
  }, []);

  if (!user) {
    return (
      <Modal open={props.open}>
        <div className="h-screen w-full flex items-center justify-center">
          <CircularProgress style={{ color: "#991b1b" }} />
        </div>
      </Modal>
    );
  }
  return (
    <Modal open={props.open} onClose={props.onClose}>
      <div className="flex flex-col lg:flex-row items-center mb-8 lg:mb-16 mt-8">
        <div className="relative h-20 w-20 overflow-hidden rounded-full bg-gray-200 mr-1 flex items-center justify-center">
          {user.picture && (
            <img
              className="object-cover absolute top-0 left-0 w-full h-full"
              src={user.picture}
            />
          )}
          <p className="text-xs">
            {user.firstName[0]}
            {user.lastName[0]}
          </p>
        </div>
        <div className="mt-8 ml-0 lg:ml-8 lg:mt-0 flex-1 text-center lg:text-left">
          <h2 className="font-bold text-2xl">{`${user.firstName} ${user.lastName}`}</h2>
          <p className="text-gray-400 font-semibold">
            {user.title
              ? `${user.title}, ${user.company}`
              : `${user.company || ""}`}
          </p>
          {user.description && (
            <p className="text-xs leading-5 mt-2 text-gray-600">
              {user.description}
            </p>
          )}
          {user.email && (
            <p className="text-xs text-gray-600 mt-2">
              <Email className="mr-2 !h-4 !w-4" />
              <a
                href={`mailto:${user.email}`}
                className="text-wf-violet underline"
              >
                {user.email}
              </a>
            </p>
          )}
          {user.phone && (
            <p className="text-xs text-gray-600 mt-2">
              <Phone className="mr-2 !h-4 !w-4" />
              <a
                href={`tel:${user.phone}`}
                className="text-wf-violet underline"
              >
                {user.phone}
              </a>
            </p>
          )}
          {user.linkedin && (
            <p className="text-xs text-gray-600 mt-2">
              <LinkedIn className="mr-2 !h-4 !w-4" />
              <a
                href={formatLink(user.linkedin)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-wf-violet underline"
              >
                {user.linkedin}
              </a>
            </p>
          )}
        </div>
      </div>
      <div className="mb-12">
        <div className="mb-4">
          <h2 className="font-bold text-xl">Engage with {user.firstName}</h2>
          <p className="font-semibold text-sm text-gray-400">
            Interested? Don't be afraid, connect!
          </p>
        </div>
        <Button
          onClick={() => setDialogOpen(true)}
          className="w-full md:w-[300px] max-w-full"
        >
          <CalendarMonth className="!h-5 !w-5 ml-[-2px] mt-[-3px] mr-2" />
          Propose a meeting
        </Button>
        <Button
          onClick={() => setChatOpen(true)}
          className="w-full md:w-[300px] mt-2"
        >
          <Chat className="!h-5 !w-5 ml-[-2px] mt-[-3px] mr-2" />
          Send a message
        </Button>
      </div>
      <div className="mb-12">
        <div className="mb-4">
          <h2 className="font-bold text-xl">Interests</h2>
          <p className="font-semibold text-sm text-gray-400">
            {user.firstName} is interested about the following topics:
          </p>
        </div>
        <div className="flex flex-wrap gap-1">
          {(user.interests || []).map((interest) => (
            <div
              key={interest._id}
              className={`flex mb-2 items-center bg-wf-violet/20 text-wf-violet font-bold text-xs py-2 px-4 rounded ${
                (context.user?.interests || []).includes(interest._id)
                  ? "!bg-wf-violet !text-white"
                  : ""
              }`}
            >
              {interest.name}
            </div>
          ))}
        </div>
      </div>
      {dialogOpen && (
        <ProposeMeeting
          open={true}
          user={user}
          onClose={() => setDialogOpen(false)}
        />
      )}
      {chatOpen && (
        <ChatView open={true} user={user} onClose={() => setChatOpen(false)} />
      )}
    </Modal>
  );
};

export default UserView;
