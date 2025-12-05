export interface User {
  id: string;
  username: string;
  room: string;
  socketId: string;
}

export interface JoinRoomResponse {
  success: boolean;
  user?: User;
  error?: string;
}
