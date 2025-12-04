import type { User } from '@/domain/entities/User';
import type { RoomRepository } from '@/domain/repositories/RoomRepository';
import type { UserRepository } from '@/domain/repositories/UserRepository';
import { createRoom, addUserToRoom } from '@/domain/room-logic';
import { v4 as uuidv4 } from 'uuid';

export function createJoinRoomUseCase(
  roomRepository: RoomRepository,
  userRepository: UserRepository
) {
  return function joinRoom(username: string, roomName: string, socketId: string): User {
    let room = roomRepository.findByName(roomName);
    if (!room) {
      room = createRoom(roomName);
    }

    const user: User = {
      id: uuidv4(),
      username,
      room: roomName,
      socketId,
    };

    const updatedRoom = addUserToRoom(room, user);

    roomRepository.save(updatedRoom);
    userRepository.save(user);

    return user;
  };
}
