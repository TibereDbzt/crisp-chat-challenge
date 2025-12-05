import type { Message } from './message';

export interface Room {
  name: string;
  messages: Message[];
  users: string[];
  hasMoreMessages: boolean;
}

export interface RoomSummary {
  name: string;
  userCount: number;
}
