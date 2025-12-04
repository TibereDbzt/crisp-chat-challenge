import type { User } from '@/domain/entities/User';
import type { Message } from '@/domain/entities/Message';

export interface Room {
  name: string;
  users: User[];
  messages: Message[];
}
