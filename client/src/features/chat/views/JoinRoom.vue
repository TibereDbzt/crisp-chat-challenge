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
              class="w-full p-4 text-left rounded-lg border bg-card hover:bg-accent hover:text-accent-foreground transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div class="flex items-center justify-between">
                <div>
                  <p class="font-medium">{{ room.name }}</p>
                  <p class="text-xs text-muted-foreground mt-1">
                    {{ room.userCount }} {{ room.userCount === 1 ? 'utilisateur' : 'utilisateurs' }}
                  </p>
                </div>
                <div class="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary text-sm font-semibold">
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
import { ref, onMounted } from 'vue';
import { MessageSquare } from 'lucide-vue-next';
import { useChatStore } from '@chat/stores/chatStore';
import { Button } from '@components/button';
import { Input } from '@components/input';
import { Card } from '@components/card';
import { ScrollArea } from '@components/scroll-area';
import type { RoomSummary } from '@chat/types';

const chatStore = useChatStore();

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

onMounted(() => {
  loadRooms();
});
</script>
