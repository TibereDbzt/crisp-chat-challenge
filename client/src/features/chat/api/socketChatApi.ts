import { io, Socket } from 'socket.io-client';
import type { ChatApi } from '@chat/api/chatApi';
import type { Message, JoinRoomResponse, RoomSummary } from '@chat/types';

export function createSocketChatApi(serverUrl: string): ChatApi {
  let socket: Socket | null = null;

  return {
    connect(): void {
      if (socket?.connected) return;
      socket = io(serverUrl);
    },

    disconnect(): void {
      socket?.disconnect();
      socket = null;
    },

    isConnected(): boolean {
      return socket?.connected || false;
    },

    async getRooms(): Promise<{ success: boolean; rooms: RoomSummary[]; error?: string }> {
      return new Promise((resolve) => {
        if (!socket) {
          resolve({ success: false, rooms: [], error: 'Socket not connected' });
          return;
        }

        socket.emit('rooms:list', (response: { success: boolean; rooms: RoomSummary[]; error?: string }) => {
          resolve(response);
        });
      });
    },

    async joinRoom(username: string, roomName: string): Promise<JoinRoomResponse> {
      return new Promise((resolve) => {
        if (!socket) {
          resolve({ success: false, error: 'Socket not connected' });
          return;
        }

        socket.emit('room:join', { username, roomName }, (response: JoinRoomResponse) => {
          resolve(response);
        });
      });
    },

    sendMessage(content: string, username: string, userId: string, roomName: string): void {
      if (!socket) {
        console.error('[ChatApi] Socket not connected');
        return;
      }
      socket.emit('message:send', { content, username, userId, roomName });
    },

    onMessage(callback: (message: Message) => void): void {
      socket?.on('message:new', callback);
    },

    onUserJoined(callback: (data: { users: string[] }) => void): void {
      socket?.on('room:users', callback);
    },

    onRoomMessages(callback: (data: { messages: Message[]; hasMoreMessages: boolean }) => void): void {
      socket?.on('room:messages', callback);
    },

    offMessage(callback: (message: Message) => void): void {
      socket?.off('message:new', callback);
    },

    offUserJoined(callback: (data: { users: string[] }) => void): void {
      socket?.off('room:users', callback);
    },

    offRoomMessages(callback: (data: { messages: Message[]; hasMoreMessages: boolean }) => void): void {
      socket?.off('room:messages', callback);
    },

    onRoomsUpdated(callback: () => void): void {
      socket?.on('rooms:updated', callback);
    },

    offRoomsUpdated(callback: () => void): void {
      socket?.off('rooms:updated', callback);
    },
  };
}
