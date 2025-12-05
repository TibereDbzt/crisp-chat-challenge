<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
    <div class="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-4">
      <!-- Liste des salons existants -->
      <Card class="p-6 space-y-4">
        <div class="space-y-2">
          <h2 class="text-xl font-semibold flex items-center gap-2">
            <MessageSquare class="h-5 w-5" />
            Salons actifs
          </h2>
          <p class="text-sm text-muted-foreground">
            Cliquez sur un salon pour le rejoindre
          </p>
        </div>

        <div v-if="isLoadingRooms" class="flex items-center justify-center py-8">
          <p class="text-sm text-muted-foreground">Chargement...</p>
        </div>

        <ScrollArea v-else-if="rooms.length > 0" class="h-[400px] pr-4">
          <div class="space-y-2">
            <button
              v-for="room in rooms"
              :key="room.name"
              @click="selectRoom(room.name)"
              :disabled="isLoading"
              :class="[
                'w-full p-4 text-left rounded-lg border transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed',
                isRoomSelected(room.name)
                  ? 'border-primary bg-primary/5 ring-primary/20'
                  : 'border-border bg-card hover:border-primary/50 hover:bg-accent'
              ]"
            >
              <div class="flex items-center justify-between">
                <div class="flex-1">
                  <div class="flex items-center gap-2">
                    <p 
                      :class="[
                        'font-semibold',
                        isRoomSelected(room.name) ? 'text-primary' : 'text-foreground'
                      ]"
                    >
                      {{ room.name }}
                    </p>
                    <Check 
                      v-if="isRoomSelected(room.name)"
                      class="h-4 w-4 text-primary"
                    />
                  </div>
                  <p 
                    :class="[
                      'text-xs mt-1',
                      isRoomSelected(room.name) ? 'text-primary/70' : 'text-muted-foreground'
                    ]"
                  >
                    {{ room.userCount }} {{ room.userCount === 1 ? 'utilisateur' : 'utilisateurs' }}
                  </p>
                </div>
                <div 
                  :class="[
                    'flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold',
                    isRoomSelected(room.name)
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'bg-primary/10 text-primary'
                  ]"
                >
                  {{ room.userCount }}
                </div>
              </div>
            </button>
          </div>
        </ScrollArea>

        <div v-else class="flex flex-col items-center justify-center py-8 text-center">
          <p class="text-sm text-muted-foreground mb-2">Aucun salon actif</p>
          <p class="text-xs text-muted-foreground">Créez-en un nouveau pour commencer !</p>
        </div>
      </Card>

      <!-- Formulaire de création/rejoindre -->
      <Card class="p-8 space-y-6">
      <div class="flex flex-col items-center space-y-2 text-center">
        <div class="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
          <MessageSquare class="h-7 w-7 text-primary" />
        </div>
        <h1 class="text-3xl font-bold tracking-tight">Crisp Chat</h1>
        <p class="text-sm text-muted-foreground">
          Rejoignez un salon pour commencer à discuter
        </p>
      </div>

        <form @submit.prevent="handleJoinRoom" class="space-y-4">
        <div class="space-y-2">
          <label for="username" class="text-sm font-medium leading-none">
            Nom d'utilisateur
          </label>
          <Input
            id="username"
            v-model="username"
            type="text"
            placeholder="Entrez votre nom d'utilisateur"
            :disabled="isLoading"
            required
          />
        </div>

        <div class="space-y-2">
          <label for="roomName" class="text-sm font-medium leading-none">
            Nom du salon
          </label>
          <Input
            id="roomName"
            v-model="roomName"
            type="text"
            placeholder="Entrez le nom du salon"
            :disabled="isLoading"
            required
          />
        </div>

        <Button
          type="submit"
          :disabled="isLoading || !username.trim() || !roomName.trim()"
          class="w-full"
        >
          {{ isLoading ? 'Connexion...' : 'Rejoindre le salon' }}
        </Button>

          <p v-if="chatStore.error" class="text-sm text-destructive text-center">
            {{ chatStore.error }}
          </p>
        </form>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { MessageSquare, Check } from 'lucide-vue-next';
import { useChatStore } from '@chat/stores/chatStore';
import { createSocketChatApi } from '@chat/api/socketChatApi';
import { Button } from '@components/button';
import { Input } from '@components/input';
import { Card } from '@components/card';
import { ScrollArea } from '@components/scroll-area';
import type { RoomSummary } from '@chat/types';

const chatStore = useChatStore();
const SERVER_URL = import.meta.env.VITE_SERVER_URL || 'http://localhost:3001';
const api = createSocketChatApi(SERVER_URL);

const username = ref('');
const roomName = ref('');
const isLoading = ref(false);
const isLoadingRooms = ref(false);
const rooms = ref<RoomSummary[]>([]);

const isRoomSelected = (roomNameToCheck: string): boolean => {
  return roomName.value.trim().toLowerCase() === roomNameToCheck.toLowerCase();
}

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
}

const selectRoom = (selectedRoomName: string) => {
  roomName.value = selectedRoomName;
}

const handleJoinRoom = async () => {
  if (!username.value.trim() || !roomName.value.trim()) return;

  isLoading.value = true;
  const success = await chatStore.joinRoom(username.value.trim(), roomName.value.trim());
  isLoading.value = false;

  if (!success) {
    console.error('Failed to join room:', chatStore.error);
  }
}

const handleRoomsUpdated = () => {
  loadRooms();
}

onMounted(() => {
  api.connect();
  loadRooms();
  api.onRoomsUpdated(handleRoomsUpdated);
});

onUnmounted(() => {
  api.offRoomsUpdated(handleRoomsUpdated);
});
</script>
