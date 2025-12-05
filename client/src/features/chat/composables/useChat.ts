import { ref, computed } from 'vue';
import type { ChatApi } from '@chat/api/chatApi';
import type { User, Message } from '@chat/types';

export function useChat(api: ChatApi) {
  const currentUser = ref<User | null>(null);
  const currentRoom = ref<string>('');
  const messages = ref<Message[]>([]);
  const users = ref<string[]>([]);
  const error = ref<string>('');
  const isConnected = ref(false);

  const isInRoom = computed(() => !!currentUser.value && !!currentRoom.value);
  
  const sortedMessages = computed(() => {
    return [...messages.value].sort((a, b) => a.timestamp - b.timestamp);
  });

  const handleNewMessage = (message: Message) => {
    messages.value.push(message);
  }

  const handleUsersUpdate = (data: { users: string[] }) => {
    users.value = data.users;
  }

  const handleRoomMessages = (data: { messages: Message[] }) => {
    messages.value = data.messages;
  }

  const setupListeners = () => {
    api.onMessage(handleNewMessage);
    api.onUserJoined(handleUsersUpdate);
    api.onRoomMessages(handleRoomMessages);
  }

  const cleanupListeners = () => {
    api.offMessage(handleNewMessage);
    api.offUserJoined(handleUsersUpdate);
    api.offRoomMessages(handleRoomMessages);
  }

  const joinRoom = async (username: string, roomName: string): Promise<boolean> => {
    try {
      error.value = '';

      api.connect();
      isConnected.value = api.isConnected();

      setupListeners();

      const response = await api.joinRoom(username, roomName);

      if (!response.success) {
        error.value = response.error || 'Failed to join room';
        return false;
      }

      currentUser.value = response.user!;
      currentRoom.value = roomName;

      return true;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Unknown error';
      return false;
    }
  }

  const sendMessage = (content: string) => {
    if (!currentUser.value || !currentRoom.value) {
      console.error('[useChat] Cannot send message: not in a room');
      return;
    }

    api.sendMessage(content, currentUser.value.username, currentUser.value.id, currentRoom.value);
  }

  const leaveRoom = () => {
    cleanupListeners();
    api.disconnect();
    
    currentUser.value = null;
    currentRoom.value = '';
    messages.value = [];
    users.value = [];
    isConnected.value = false;
  }

  return {
    currentUser,
    currentRoom,
    messages: sortedMessages,
    users,
    error,
    isConnected,
    isInRoom,
    joinRoom,
    sendMessage,
    leaveRoom,
  };
}
