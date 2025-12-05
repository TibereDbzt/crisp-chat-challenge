import type { Room } from '@/domain/entities/Room.js';
import type { RoomRepository } from '@/domain/repositories/RoomRepository.js';

export function createInMemoryRoomRepository(): RoomRepository {
  const rooms = new Map<string, Room>();

  return {
    findByName(name: string): Room | null {
      return rooms.get(name) || null;
    },

    save(room: Room): void {
      rooms.set(room.name, room);
    },

    findAll(): Room[] {
      return Array.from(rooms.values());
    },
  };
}
