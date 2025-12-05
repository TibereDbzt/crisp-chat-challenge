import type { Room } from '@/domain/entities/Room';
import type { RoomRepository } from '@/domain/repositories/RoomRepository';
import type { UserRepository } from '@/domain/repositories/UserRepository';

export type ILeaveRoomUseCase = (socketId: string) => Room | null;

export function createLeaveRoomUseCase(
  roomRepository: RoomRepository,
  userRepository: UserRepository
): ILeaveRoomUseCase {
  return function leaveRoom(socketId: string): Room | null {
    const user = userRepository.findBySocketId(socketId);
    if (!user) {
      return null;
    }

    const room = roomRepository.findByName(user.room);
    if (!room) {
      return null;
    }

    const updatedRoom = {
      ...room,
      users: room.users.filter((u) => u.id !== user.id),
    };

    roomRepository.save(updatedRoom);
    userRepository.deleteBySocketId(socketId);

    return updatedRoom;
  };
}
