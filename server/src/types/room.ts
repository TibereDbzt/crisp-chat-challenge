import { Message } from '@/types/message';
import { User } from '@/types/user';

export interface Room {
  name: string;
  users: User[];
  messages: Message[];
}
