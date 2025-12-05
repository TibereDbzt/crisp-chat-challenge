<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
    <Card class="w-full max-w-2xl p-8 space-y-6">
      <!-- Header -->
      <div class="flex flex-col items-center space-y-2 text-center">
        <div class="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
          <MessageSquare class="h-7 w-7 text-primary" />
        </div>
        <h1 class="text-3xl font-bold tracking-tight">Crisp Chat</h1>
        <p class="text-sm text-muted-foreground">
          Rejoignez un salon existant ou créez-en un nouveau
        </p>
      </div>

      <div class="space-y-6">
        <!-- Username -->
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

        <!-- Room Selection/Creation -->
        <div v-if="username.trim()" class="space-y-3">
          <label for="roomName" class="text-sm font-medium leading-none">
            Salon
          </label>
          
          <Input
            id="roomName"
            v-model="roomName"
            type="text"
            placeholder="Rechercher ou créer un salon..."
            :disabled="isLoading"
            required
          />

          <!-- Existing Rooms List -->
          <div v-if="!isLoadingRooms && rooms.length > 0" class="space-y-2 max-h-[320px] overflow-y-auto">
            <p class="text-xs text-muted-foreground px-1">
              {{ filteredRooms.length > 0 ? 'Salons disponibles' : 'Aucun salon correspondant' }}
            </p>
            
            <button
              v-for="room in filteredRooms"
              :key="room.name"
              @click.prevent="() => handleJoinRoom(room.name)"
              type="button"
              :disabled="isLoading || !username.trim()"
              :class="[
                'w-full p-3 text-left rounded-lg border transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed',
                isRoomSelected(room.name)
                  ? 'border-primary bg-primary/5 ring-1 ring-primary/20'
                  : 'border-border bg-card hover:border-primary/50 hover:bg-accent'
              ]"
            >
              <div class="flex items-center justify-between">
                <div class="flex-1">
                  <div class="flex items-center gap-2">
                    <p 
                      :class="[
                        'font-semibold text-sm',
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
                      'text-xs mt-0.5',
                      isRoomSelected(room.name) ? 'text-primary/70' : 'text-muted-foreground'
                    ]"
                  >
                    {{ room.userCount }} {{ room.userCount === 1 ? 'utilisateur' : 'utilisateurs' }}
                  </p>
                </div>
                <div 
                  :class="[
                    'flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold',
                    isRoomSelected(room.name)
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-primary/10 text-primary'
                  ]"
                >
                  {{ room.userCount }}
                </div>
              </div>
            </button>

            <!-- New Room Hint -->
            <button 
              v-if="isCreatingNewRoom"
              @click.prevent="() => handleJoinRoom(roomName.trim())"
              type="button"
              :disabled="isLoading || !username.trim()"
              class="w-full p-3 rounded-lg border-2 border-dashed border-primary/30 bg-primary/5 hover:bg-primary/10 hover:border-primary/50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-left"
            >
              <div class="flex items-start gap-2">
                <Plus class="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <p class="text-sm font-semibold text-primary">
                    Créer le salon "{{ roomName.trim() }}"
                  </p>
                  <p class="text-xs text-muted-foreground mt-0.5">
                    Cliquez ici pour créer et rejoindre ce nouveau salon
                  </p>
                </div>
              </div>
            </button>
          </div>

          <div v-else-if="isLoadingRooms" class="flex items-center justify-center py-4">
            <p class="text-sm text-muted-foreground">Chargement des salons...</p>
          </div>
        </div>

        <!-- Error Message -->
        <p v-if="chatStore.error" class="text-sm text-destructive text-center">
          {{ chatStore.error }}
        </p>
      </div>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { MessageSquare, Check, Plus } from 'lucide-vue-next';
import { useChatStore } from '@chat/stores/chatStore';
import { createSocketChatApi } from '@chat/api/socketChatApi';
import { Input } from '@components/input';
import { Card } from '@components/card';
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

// Filtrer les salons selon la recherche
const filteredRooms = computed(() => {
  const search = roomName.value.trim().toLowerCase();
  if (!search) return rooms.value;
  
  return rooms.value.filter(room => 
    room.name.toLowerCase().includes(search)
  );
});

// Vérifier si on crée un nouveau salon
const isCreatingNewRoom = computed(() => {
  const search = roomName.value.trim();
  if (!search) return false;
  
  return !rooms.value.some(room => 
    room.name.toLowerCase() === search.toLowerCase()
  );
});

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

const handleJoinRoom = async (selectedRoomName?: string) => {
  const targetRoom = selectedRoomName || roomName.value.trim();
  
  if (!username.value.trim() || !targetRoom) return;

  isLoading.value = true;
  const success = await chatStore.joinRoom(username.value.trim(), targetRoom);
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
