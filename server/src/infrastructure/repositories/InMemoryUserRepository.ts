import type { User } from '@/domain/entities/User';
import type { UserRepository } from '@/domain/repositories/UserRepository';

export function createInMemoryUserRepository(): UserRepository {
  const users = new Map<string, User>();

  return {
    save(user: User): void {
      users.set(user.id, user);
    },
    
    findBySocketId(socketId: string): User | null {
      for (const user of users.values()) {
        if (user.socketId === socketId) {
          return user;
        }
      }
      return null;
    },
    
    deleteBySocketId(socketId: string): void {
      for (const [userId, user] of users.entries()) {
        if (user.socketId === socketId) {
          users.delete(userId);
          break;
        }
      }
    },
  };
}
