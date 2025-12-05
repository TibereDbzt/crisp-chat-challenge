import type { Server, Socket } from 'socket.io';
import type { IJoinRoomUseCase } from '@/domain/use-cases/join-room.js';
import type { ISendMessageUseCase } from '@/domain/use-cases/send-message.js';
import type { ILeaveRoomUseCase } from '@/domain/use-cases/leave-room.js';
import type { IGetRoomsUseCase } from '@/domain/use-cases/get-rooms.js';

export function createSocketHandlers(
  joinRoomUseCase: IJoinRoomUseCase,
  sendMessageUseCase: ISendMessageUseCase,
  leaveRoomUseCase: ILeaveRoomUseCase,
  getRoomsUseCase: IGetRoomsUseCase
) {
  return function handleConnection(socket: Socket, io: Server): void {
    socket.on('room:join', async (data: { username: string; roomName: string }, callback) => {
      try {
        const { user, room, lastTenMessages, hasMoreMessages } = joinRoomUseCase(
          data.username,
          data.roomName,
          socket.id
        );

        socket.join(room.name);

        callback({ success: true, user });

        socket.emit('room:messages', {
          messages: lastTenMessages,
          hasMoreMessages,
        });

        const usernames = room.users.map((u) => u.username);
        io.to(room.name).emit('room:users', { users: usernames });

        io.emit('rooms:updated');
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to join room';
        callback({ success: false, error: errorMessage });
      }
    });

    socket.on(
      'message:send',
      (data: { content: string; username: string; userId: string; roomName: string }) => {
        try {
          const message = sendMessageUseCase(
            data.content,
            data.username,
            data.userId,
            data.roomName
          );

          io.to(message.room).emit('message:new', message);
        } catch (error) {
          console.error('[Socket] Error sending message:', error);
        }
      }
    );

    socket.on('rooms:list', (callback) => {
      try {
        const rooms = getRoomsUseCase();
        callback({ success: true, rooms });
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to get rooms';
        callback({ success: false, error: errorMessage, rooms: [] });
      }
    });

    socket.on('disconnect', () => {
      try {
        const room = leaveRoomUseCase(socket.id);

        if (room) {
          const usernames = room.users.map((u) => u.username);
          io.to(room.name).emit('room:users', { users: usernames });

          io.emit('rooms:updated');
        }
      } catch (error) {
        console.error('[Socket] Error handling disconnect:', error);
      }
    });
  };
}
