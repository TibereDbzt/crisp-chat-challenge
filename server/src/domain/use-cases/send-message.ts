import type { Message } from '@/domain/entities/Message';
import type { RoomRepository } from '@/domain/repositories/RoomRepository';
import { addMessageToRoom } from '@/domain/room-logic';
import { v4 as uuidv4 } from 'uuid';

export type ISendMessageUseCase = (
  content: string,
  username: string,
  userId: string,
  roomName: string
) => Message;

export function createSendMessageUseCase(roomRepository: RoomRepository): ISendMessageUseCase {
  return function sendMessage(
    content: string,
    username: string,
    userId: string,
    roomName: string
  ): Message {
    const room = roomRepository.findByName(roomName);
    if (!room) {
      throw new Error(`Room "${roomName}" not found`);
    }

    const userInRoom = room.users.some((u) => u.id === userId);
    if (!userInRoom) {
      throw new Error('User is not in this room');
    }

    const message: Message = {
      id: uuidv4(),
      content,
      username,
      userId,
      room: roomName,
      timestamp: Date.now(),
    };

    const updatedRoom = addMessageToRoom(room, message);

    roomRepository.save(updatedRoom);

    return message;
  };
}
