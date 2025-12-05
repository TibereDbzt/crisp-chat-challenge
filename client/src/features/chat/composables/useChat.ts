import { ref, computed } from 'vue';
import type { ChatApi } from '@chat/api/chatApi';
import type { User, Message, Room } from '@chat/types';

export function useChat(api: ChatApi) {
  const currentUser = ref<User | null>(null);
  const currentRoom = ref<Room | null>(null);
  const error = ref<string>('');
  const isConnected = ref(false);

  const isInRoom = computed(() => !!currentUser.value && !!currentRoom.value);
  
  const sortedMessages = computed(() => {
    if (!currentRoom.value) return [];
    return [...currentRoom.value.messages].sort((a, b) => a.timestamp - b.timestamp);
  });

  const handleNewMessage = (message: Message) => {
    if (currentRoom.value) {
      currentRoom.value.messages.push(message);
    }
  }

  const handleUsersUpdate = (data: { users: string[] }) => {
    if (currentRoom.value) {
      currentRoom.value.users = data.users;
    }
  }

  const handleRoomMessages = (data: { messages: Message[]; hasMoreMessages: boolean; }) => {
    if (currentRoom.value) {
      currentRoom.value.messages = data.messages;
      currentRoom.value.hasMoreMessages = data.hasMoreMessages;
    }
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
      currentRoom.value = {
        name: roomName,
        messages: [],
        users: [],
        hasMoreMessages: false,
      };

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

    api.sendMessage(content, currentUser.value.username, currentUser.value.id, currentRoom.value.name);
  }

  const leaveRoom = () => {
    cleanupListeners();
    api.disconnect();
    
    currentUser.value = null;
    currentRoom.value = null;
    isConnected.value = false;
  }

  return {
    currentUser,
    currentRoom,
    messages: sortedMessages,
    error,
    isConnected,
    isInRoom,
    joinRoom,
    sendMessage,
    leaveRoom,
  };
}
