import type { Room, User, Message } from './entities';

export function createRoom(name: string): Room {
  return {
    name,
    users: [],
    messages: [],
  };
}

export function addUserToRoom(room: Room, user: User): Room {

  return {
    ...room,
    users: [...room.users, user],
  };
}

export function addMessageToRoom(room: Room, message: Message): Room {
  return {
    ...room,
    messages:[...room.messages, message]
  };
}
