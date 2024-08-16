import {
  ChangeEvent,
  RefObject,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { format, isSameDay } from "date-fns";

import RequestHandler from "@/helpers/RequestHandler";

import Modal from "@/components/Modal";
import Input from "@/components/Input";
import Button from "@/components/Button";

import { EventContext } from "@/context/EventContext";
import { ChatMessage } from "@/types";
import { AnotherUser } from "./UserView";

interface Props {
  open?: boolean;
  user: AnotherUser;
  onClose?: () => void;
}

const ChatView = (props: Props) => {
  const context = useContext(EventContext);
  const { open, user, onClose } = props;

  const [message, setMessage] = useState<any>("");
  const [messages, setMessages] = useState<any>([]);
  const [loading, setLoading] = useState(false);

  const chatRef: RefObject<HTMLDivElement> = useRef(null);

  const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  };

  const sendMessage = async () => {
    const msg = {
      sender: context.user?._id,
      receiver: user._id,
      message,
      event: context.event?._id,
      readBy: [context.user?._id],
    };
    setLoading(true);
    const _ = await RequestHandler.post(`messages`, msg);
    setMessage("");
    setLoading(false);
    getMessages();
  };

  const getMessages = async () => {
    const messages = await RequestHandler.get(
      `messages/${context.event?._id}/${props.user._id}`
    );
    setMessages(messages);
    setTimeout(() => {
      if (chatRef.current) {
        chatRef.current.scrollTop = chatRef.current.scrollHeight;
      }
    }, 100);
  };

  useEffect(() => {
    getMessages();
  }, []);

  const renderMessage = (message: ChatMessage, index: number) => {
    const user = message.sender;
    const previousMessage = messages[index - 1] || {};
    const sameAsPrevious = previousMessage.sender?._id == user._id;
    const previousDate = previousMessage.createdAt
      ? new Date(previousMessage.createdAt)
      : false;
    const createdAt = new Date(message.createdAt);
    const sameAsPreviousDate = previousDate
      ? isSameDay(createdAt, previousDate)
      : false;
    return (
      <div
        key={message._id}
        className="relative flex items-center justify-start py-1"
      >
        <div
          className={`${
            sameAsPrevious && sameAsPreviousDate ? "opacity-0 h-0" : ""
          } relative h-10 w-10 overflow-hidden rounded-full bg-gray-200 mr-4 flex items-center justify-center`}
        >
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
        <div className="flex-1">
          {(!sameAsPrevious || !sameAsPreviousDate) && (
            <h3 className="font-bold">
              {user.firstName} {user.lastName}
            </h3>
          )}
          <p>{message.message}</p>
        </div>
        <div className="flex flex-col items-end text-xs mr-4 ml-4">
          {(!sameAsPrevious || !sameAsPreviousDate) && (
            <p>{format(createdAt, "dd.MM.yyyy")}</p>
          )}
          <p>{format(createdAt, "HH:mm")}</p>
        </div>
      </div>
    );
  };

  return (
    <Modal
      title={`Conversation with ${user.firstName} ${user.lastName}`}
      open={open}
      fullHeight
      onClose={onClose}
    >
      <div className="flex-1 mt-6 overflow-y-auto" ref={chatRef}>
        {messages.length == 0 ? (
          <div className="flex-1 h-full flex items-center justify-center">
            <p className="text-center text-sm">
              Go ahead and start the conversation – your messages will show up
              here.
            </p>
          </div>
        ) : (
          messages.map(renderMessage)
        )}
      </div>
      <div className="flex items-center flex-shrink-0 mt-4 p-1">
        <Input
          value={message}
          placeholder="Your message..."
          onChange={onInputChange}
        />
        <Button loading={loading} className="ml-4" onClick={sendMessage}>
          Send
        </Button>
      </div>
    </Modal>
  );
};

export default ChatView;
