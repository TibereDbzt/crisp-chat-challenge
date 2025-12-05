import type { Server, Socket } from 'socket.io';
import type { IJoinRoomUseCase } from '@/domain/use-cases/join-room';
import type { ISendMessageUseCase } from '@/domain/use-cases/send-message';
import type { ILeaveRoomUseCase } from '@/domain/use-cases/leave-room';

export function createSocketHandlers(
  joinRoomUseCase: IJoinRoomUseCase,
  sendMessageUseCase: ISendMessageUseCase,
  leaveRoomUseCase: ILeaveRoomUseCase
) {
  return function handleConnection(socket: Socket, io: Server): void {
    socket.on('room:join', async (data: { username: string; roomName: string }, callback) => {
      try {
        const { user, room, lastTenMessages, hasMoreMessages } = joinRoomUseCase(data.username, data.roomName, socket.id);

        socket.join(room.name);

        callback({ success: true, user: user });

        // Envoyer les messages récents fournis par le use case
        socket.emit('room:messages', { 
          messages: lastTenMessages,
          hasMoreMessages: hasMoreMessages,
        });

        const usernames = room.users.map((u) => u.username);
        io.to(room.name).emit('room:users', { users: usernames });
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

    socket.on('disconnect', () => {
      try {
        const room = leaveRoomUseCase(socket.id);
        
        if (room) {
          const usernames = room.users.map((u) => u.username);
          io.to(room.name).emit('room:users', { users: usernames });
        }
      } catch (error) {
        console.error('[Socket] Error handling disconnect:', error);
      }
    });
  };
}
