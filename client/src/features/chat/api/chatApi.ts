import type { Message, JoinRoomResponse, RoomSummary } from '@chat/types';

export interface ChatApi {
  connect(): void;
  disconnect(): void;
  isConnected(): boolean;
  
  getRooms(): Promise<{ success: boolean; rooms: RoomSummary[]; error?: string }>;
  joinRoom(username: string, roomName: string): Promise<JoinRoomResponse>;
  sendMessage(content: string, username: string, userId: string, roomName: string): void;
  
  onMessage(callback: (message: Message) => void): void;
  onUserJoined(callback: (data: { users: string[] }) => void): void;
  onRoomMessages(callback: (data: { messages: Message[]; hasMoreMessages: boolean }) => void): void;
  
  offMessage(callback: (message: Message) => void): void;
  offUserJoined(callback: (data: { users: string[] }) => void): void;
  offRoomMessages(callback: (data: { messages: Message[]; hasMoreMessages: boolean }) => void): void;
  
  onRoomsUpdated(callback: () => void): void;
  offRoomsUpdated(callback: () => void): void;
}
