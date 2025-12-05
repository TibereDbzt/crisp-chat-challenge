import type { User } from '@/domain/entities/User.js';

export interface UserRepository {
  save(user: User): void;
  findBySocketId(socketId: string): User | null;
  deleteBySocketId(socketId: string): void;
}
