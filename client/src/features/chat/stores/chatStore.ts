import { defineStore } from 'pinia';
import { createSocketChatApi } from '@chat/api/socketChatApi';
import { useChat } from '@chat/composables/useChat';

const SERVER_URL = import.meta.env.VITE_SERVER_URL || 'http://localhost:3001';

export const useChatStore = defineStore('chat', () => {
  const api = createSocketChatApi(SERVER_URL);
  const chat = useChat(api);

  return {
    ...chat,
  };
});
