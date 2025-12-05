import type { User } from '@/domain/entities/User';
import type { UserRepository } from '@/domain/repositories/UserRepository';

export function createInMemoryUserRepository(): UserRepository {
  const users = new Map<string, User>();

  return {
    save(user: User): void {
      users.set(user.id, user);
    },

    findBySocketId(socketId: string): User | null {
      const user = Array.from(users.values()).find((u) => u.socketId === socketId);
      return user ?? null;
    },

    deleteBySocketId(socketId: string): void {
      const entry = Array.from(users.entries()).find(([, user]) => user.socketId === socketId);
      if (entry) {
        users.delete(entry[0]);
      }
    },
  };
}
