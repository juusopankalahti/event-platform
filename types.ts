import { AnotherUser } from "./components/UserView";

export interface Event {
  _id: string;
  key: string;
  name: string;
  currentProgram?: Program;
  logo: string;
  streamUrl?: string;
}

export interface Meeting {
  _id: string;
  creator: User;
  receiver: User;
  time: string;
  location: string;
  message?: string;
  status: number;
}

export interface Material {
  _id: string;
  name: string;
  thumbnailUrl: string;
  url?: string;
  link?: string;
  asEmbed?: boolean;
}

export interface Partner {
  _id: string;
  name: string;
  logo: string;
  slogan: string;
  description: string;
  website: string;
  facebook?: string;
  linkedin?: string;
  instagram?: string;
  twitter?: string;
  users?: User[];
  materials?: Material[];
  priority?: number;
}

export interface Program {
  time: string;
  name: string;
  description: string;
  speaker: User;
  break?: boolean;
}

export interface UserDetails {
  picture?: string;
  firstName: string;
  lastName: string;
  company: string;
  title?: string;
  description?: string;
  email: string;
  phone?: string;
  linkedin?: string;
  hidden?: boolean;
  loggedIn?: boolean;
  appDialogSeen?: boolean;
}

export type User = {
  _id: string;
  code: string;
  partner?: Partner;
  partnerAdmin?: boolean;
  interests: string[];
  availableTimes: string[];
  similarInterests?: number;
} & UserDetails;

export interface Interest {
  _id: string;
  name: string;
}

export interface ChatMessage {
  _id: string;
  message: string;
  sender: User;
  createdAt: string;
}

export interface Conversation {
  unread: number;
  user: AnotherUser;
  message: string;
  createdAt: string;
}
