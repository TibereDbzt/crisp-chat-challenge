import type { Room } from '@/domain/entities/Room.js';

export interface RoomRepository {
  findByName(name: string): Room | null;
  save(room: Room): void;
  findAll(): Room[];
}
