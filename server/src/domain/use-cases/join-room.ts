import type { User } from '@/domain/entities/User';
import type { Room } from '@/domain/entities/Room';
import type { RoomRepository } from '@/domain/repositories/RoomRepository';
import type { UserRepository } from '@/domain/repositories/UserRepository';
import { v4 as uuidv4 } from 'uuid';

export interface JoinRoomResult {
  user: User;
  room: Room;
}

export type IJoinRoomUseCase = (
  username: string,
  roomName: string,
  socketId: string
) => JoinRoomResult;

export function createJoinRoomUseCase(
  roomRepository: RoomRepository,
  userRepository: UserRepository
): IJoinRoomUseCase {
  return function joinRoom(username: string, roomName: string, socketId: string): JoinRoomResult {
    let room = roomRepository.findByName(roomName);
    if (!room) {
        room = {
            name: roomName,
            users: [],
            messages: [],
        }
    }

    const user: User = {
      id: uuidv4(),
      username,
      room: roomName,
      socketId,
    };

    const updatedRoom = {
        ...room,
        users: [...room.users, user],
    }

    roomRepository.save(updatedRoom);
    userRepository.save(user);

    return { user, room: updatedRoom };
  };
}
