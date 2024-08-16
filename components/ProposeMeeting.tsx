import {
  ChangeEvent,
  RefObject,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useSnackbar } from "notistack";

import RequestHandler from "@/helpers/RequestHandler";

import VESDialog from "@/components/VESDialog";

import { User } from "@/types";
import { EventContext } from "@/context/EventContext";
import { AnotherUser } from "./UserView";
import { CustomEvent, Field } from "./Fields";

interface Props {
  open?: boolean;
  user: AnotherUser;
  onClose?: () => void;
}

const ProposeMeeting = (props: Props) => {
  const { open, user, onClose } = props;
  const context = useContext(EventContext);

  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  const [values, setValues] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const focusRef: RefObject<HTMLInputElement> = useRef(null);

  const { enqueueSnackbar } = useSnackbar();

  const fields: Field[] = [
    {
      id: "user",
      label: "User",
      type: "custom",
      component: () => {
        return (
          <div className="flex items-center flex-1 mt-2 mb-3">
            <div className="relative h-10 w-10 overflow-hidden rounded-full bg-gray-200 mr-2 flex items-center justify-center">
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
            <div className="ml-1 flex-1">
              <h3 className="font-bold text-sm">
                {user.firstName} {user.lastName}
              </h3>
              <p className="text-sm">
                {user.title
                  ? `${user.title}, ${user.company}`
                  : `${user.company || ""}`}
              </p>
            </div>
          </div>
        );
      },
    },
    {
      id: "time",
      label: "Time*",
      type: "autofill",
      placeholder: "Select a time...",
      options: () =>
        (availableTimes || []).map((time: string) => ({
          id: time,
          name: time,
        })),
    },
    {
      id: "location",
      label: "Meeting location*",
    },
    {
      id: "message",
      label: "Message",
      type: "textarea",
    },
  ];

  // const getUsers = async () => {
  //   const users = await RequestHandler.get(`users/${context.event?._id}/`);
  //   const mappedUsers = users.map((u: User) => ({
  //     id: u._id,
  //     name: `${u.firstName} ${u.lastName}`,
  //     availableTimes: u.availableTimes,
  //   }));
  //   setUsers(mappedUsers);
  // };

  const getAvailableTimes = async () => {
    const availableTimes = await RequestHandler.get(
      `people/${context.event?._id}/${user._id}/availableTimes`
    );
    setAvailableTimes(availableTimes);
  };

  useEffect(() => {
    getAvailableTimes();
  }, []);

  const onSaveMeeting = async () => {
    setLoading(true);
    const meeting = {
      event: context.event?._id,
      creator: context.user?._id,
      receiver: user._id,
      time: values.time?.id,
      location: values.location,
      message: values.message,
    };
    const _ = await RequestHandler.post(`meetings/`, meeting);
    setLoading(false);
    enqueueSnackbar("Meeting proposal sent!", { variant: "success" });
    onClose && onClose();
  };

  const onInputChange = (e: CustomEvent) => {
    setValues({
      ...values,
      [e.target.name || ""]: e.target.value,
    });
  };

  return (
    <>
      <VESDialog
        initialFocus={focusRef}
        loading={loading}
        onSave={onSaveMeeting}
        fields={fields}
        header="Propose a meeting"
        description="Fill in the meeting details below and send your proposal for the other user to approve."
        open={open}
        onClose={onClose || (() => {})}
        values={values}
        onInputChange={onInputChange}
        saveDisabled={!values.time || !values.location}
      />
      <div ref={focusRef} />
    </>
  );
};

export default ProposeMeeting;
