import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

import {
  createInMemoryRoomRepository,
  createInMemoryUserRepository,
  createSocketHandlers,
} from '@/infrastructure/index.js';
import {
  createJoinRoomUseCase,
  createSendMessageUseCase,
  createLeaveRoomUseCase,
  createGetRoomsUseCase,
} from '@/domain/index.js';

const PORT = Number(process.env.PORT) || 3001;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

const app = express();
const httpServer = createServer(app);

app.use(
  cors({
    origin: CLIENT_URL,
  })
);
app.use(express.json());

const io = new Server(httpServer, {
  cors: {
    origin: CLIENT_URL,
    methods: ['GET', 'POST'],
  },
});

// Composition Root - Dependency Injection
const roomRepository = createInMemoryRoomRepository();
const userRepository = createInMemoryUserRepository();

const joinRoomUseCase = createJoinRoomUseCase(roomRepository, userRepository);
const sendMessageUseCase = createSendMessageUseCase(roomRepository);
const leaveRoomUseCase = createLeaveRoomUseCase(roomRepository, userRepository);
const getRoomsUseCase = createGetRoomsUseCase(roomRepository);

const handleConnection = createSocketHandlers(
  joinRoomUseCase,
  sendMessageUseCase,
  leaveRoomUseCase,
  getRoomsUseCase
);

// Socket.io connection handler
io.on('connection', (socket) => {
  console.log(`[Socket] Client connected: ${socket.id}`);
  handleConnection(socket, io);
});

// Health check endpoint
app.get('/', (_req, res) => {
  res.json({ message: 'Crisp Chat Server is running' });
});

httpServer.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
