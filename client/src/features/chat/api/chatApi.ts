import type { Message, JoinRoomResponse } from '@chat/types';

export interface ChatApi {
  connect(): void;
  disconnect(): void;
  isConnected(): boolean;
  
  joinRoom(username: string, roomName: string): Promise<JoinRoomResponse>;
  sendMessage(content: string, username: string, userId: string, roomName: string): void;
  
  onMessage(callback: (message: Message) => void): void;
  onUserJoined(callback: (data: { users: string[] }) => void): void;
  onRoomMessages(callback: (data: { messages: Message[]; hasMoreMessages: boolean }) => void): void;
  
  offMessage(callback: (message: Message) => void): void;
  offUserJoined(callback: (data: { users: string[] }) => void): void;
  offRoomMessages(callback: (data: { messages: Message[]; hasMoreMessages: boolean }) => void): void;
}
