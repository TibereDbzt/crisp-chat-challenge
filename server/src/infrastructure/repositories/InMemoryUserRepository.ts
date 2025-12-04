import type { User } from '@/domain/entities/User';
import type { UserRepository } from '@/domain/repositories/UserRepository';

export function createInMemoryUserRepository(): UserRepository {
  const users = new Map<string, User>();

  return {
    save(user: User): void {
      users.set(user.id, user);
    },
  };
}
