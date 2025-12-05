import { v4 as uuidv4 } from 'uuid';
import type { User } from '@/domain/entities/User.js';
import type { Room } from '@/domain/entities/Room.js';
import type { Message } from '@/domain/entities/Message.js';
import type { RoomRepository } from '@/domain/repositories/RoomRepository.js';
import type { UserRepository } from '@/domain/repositories/UserRepository.js';

export interface JoinRoomResult {
  user: User;
  room: Room;
  lastTenMessages: Message[];
  hasMoreMessages: boolean;
}

export type IJoinRoomUseCase = (
  username: string,
  roomName: string,
  socketId: string
) => JoinRoomResult;

const MAX_VISIBLE_PREVIOUS_MESSAGES = 10 as const;

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
      };
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
    };

    roomRepository.save(updatedRoom);
    userRepository.save(user);

    const totalMessages = updatedRoom.messages.length;
    const lastTenMessages = updatedRoom.messages.slice(-MAX_VISIBLE_PREVIOUS_MESSAGES);
    const hasMoreMessages = totalMessages > MAX_VISIBLE_PREVIOUS_MESSAGES;

    return {
      user,
      room: updatedRoom,
      lastTenMessages,
      hasMoreMessages,
    };
  };
}
