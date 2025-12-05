import type { RoomRepository } from '@/domain/repositories/RoomRepository.js';

export interface RoomSummary {
  name: string;
  userCount: number;
}

export type IGetRoomsUseCase = () => RoomSummary[];

export function createGetRoomsUseCase(roomRepository: RoomRepository): IGetRoomsUseCase {
  return function getRooms(): RoomSummary[] {
    const rooms = roomRepository.findAll();

    return rooms.map((room) => ({
      name: room.name,
      userCount: room.users.length,
    }));
  };
}
