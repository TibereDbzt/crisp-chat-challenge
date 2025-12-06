<template>
  <div
    class="min-h-screen flex items-center justify-center bg-gray-50 p-4"
  >
    <Card class="w-full max-w-2xl p-8 space-y-6 transition-all duration-300 ease-in-out shadow-lg border-gray-200 bg-white">
      <div class="flex flex-col items-center space-y-2 text-center">
        <div class="flex h-14 w-14 items-center justify-center rounded-xl bg-[#4963F3] shadow-sm">
          <MessageSquare class="h-7 w-7 text-white" />
        </div>
        <h1 class="text-3xl font-bold tracking-tight text-gray-900">Crisp Chat</h1>
        <p class="text-sm text-gray-600">
          Rejoignez un salon existant ou créez-en un nouveau
        </p>
      </div>

      <div class="space-y-6">
        <div class="space-y-2 px-1">
          <label for="username" class="text-sm font-medium leading-none text-gray-900"> Nom d'utilisateur </label>
          <Input
            id="username"
            v-model="username"
            type="text"
            placeholder="Entrez votre nom d'utilisateur"
            :disabled="isLoading"
            required
          />
        </div>

        <div
          :class="[
            'grid transition-all duration-300 ease-in-out',
            username.trim()
              ? 'grid-rows-[1fr] opacity-100 visible'
              : 'grid-rows-[0fr] opacity-0 invisible',
          ]"
          :aria-hidden="!username.trim()"
        >
          <div class="overflow-hidden p-1">
            <div
              :class="[
                'transition-transform duration-300 ease-out',
                username.trim() ? 'translate-y-0' : '-translate-y-2',
              ]"
            >
              <RoomSelect
                v-model="roomName"
                :rooms="rooms"
                :is-loading="isLoading || !username.trim()"
                :is-loading-rooms="isLoadingRooms"
                @select-room="handleJoinRoom"
              />
            </div>
          </div>
        </div>

        <!-- Error Message -->
        <p v-if="chatStore.error" class="text-sm text-red-600 text-center">
          {{ chatStore.error }}
        </p>
      </div>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { MessageSquare } from 'lucide-vue-next';
import { useChatStore } from '@chat/stores/chatStore';
import { createSocketChatApi } from '@chat/api/socketChatApi';
import { Input } from '@components/input';
import { Card } from '@components/card';
import { RoomSelect } from '@chat/components';
import type { RoomSummary } from '@chat/types';

const chatStore = useChatStore();
const SERVER_URL = import.meta.env.VITE_SERVER_URL || 'http://localhost:3001';
const api = createSocketChatApi(SERVER_URL);

const username = ref('');
const roomName = ref('');
const isLoading = ref(false);
const isLoadingRooms = ref(false);
const rooms = ref<RoomSummary[]>([]);

const loadRooms = async () => {
  isLoadingRooms.value = true;
  try {
    const response = await chatStore.getRooms();
    if (response.success) {
      rooms.value = response.rooms;
    }
  } catch (error) {
    console.error('Failed to load rooms:', error);
  } finally {
    isLoadingRooms.value = false;
  }
};

const handleJoinRoom = async (selectedRoomName?: string) => {
  const targetRoom = selectedRoomName || roomName.value.trim();

  if (!username.value.trim() || !targetRoom) return;

  isLoading.value = true;
  const success = await chatStore.joinRoom(username.value.trim(), targetRoom);
  isLoading.value = false;

  if (!success) {
    console.error('Failed to join room:', chatStore.error);
  }
};

const handleRoomsUpdated = () => {
  loadRooms();
};

onMounted(() => {
  api.connect();
  loadRooms();
  api.onRoomsUpdated(handleRoomsUpdated);
});

onUnmounted(() => {
  api.offRoomsUpdated(handleRoomsUpdated);
});
</script>
