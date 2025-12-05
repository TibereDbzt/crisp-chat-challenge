import type { User } from '@/domain/entities/User.js';
import type { Message } from '@/domain/entities/Message.js';

export interface Room {
  name: string;
  users: User[];
  messages: Message[];
}
