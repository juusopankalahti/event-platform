import { Conversation, Event, User } from "@/types";
import { createContext } from "react";

interface EventContextType {
  event?: Event;
  user?: User;
  showConfirmation?: (title: string, description: string) => boolean;
  waitingMeetings?: number;
  setWaitingMeetings?: (waitingMeetings: number) => void;
  conversations?: Conversation[];
  getConversations?: () => void;
  loadingConversations?: boolean;
  unreadConversations?: number;
}

export const EventContext = createContext<EventContextType>({});
