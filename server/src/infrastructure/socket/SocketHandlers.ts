import type { Server, Socket } from 'socket.io';
import type { IJoinRoomUseCase } from '@/domain/use-cases/join-room';
import type { ISendMessageUseCase } from '@/domain/use-cases/send-message';

export function createSocketHandlers(
  joinRoomUseCase: IJoinRoomUseCase,
  sendMessageUseCase: ISendMessageUseCase
) {
  return function handleConnection(socket: Socket, io: Server): void {
    socket.on('room:join', async (data: { username: string; roomName: string }, callback) => {
      try {
        const user = joinRoomUseCase(data.username, data.roomName, socket.id);

        socket.join(user.room);

        callback({ success: true, user });

        const room = io.sockets.adapter.rooms.get(user.room);
        io.to(user.room).emit('room:users', { users: Array.from(room || []) });
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to join room';
        callback({ success: false, error: errorMessage });
      }
    });

    socket.on(
      'message:send',
      (data: { content: string; username: string; userId: string; roomName: string }) => {
        try {
          const message = sendMessageUseCase(data.content, data.username, data.userId, data.roomName);

          io.to(message.room).emit('message:new', message);
        } catch (error) {
          console.error('[Socket] Error sending message:', error);
        }
      }
    );
  };
}
