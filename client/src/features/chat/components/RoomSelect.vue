<template>
  <div class="space-y-3">
    <label for="roomName" class="text-sm font-medium leading-none"> Salon </label>

    <Input
      id="roomName"
      :model-value="modelValue"
      type="text"
      placeholder="Rechercher ou créer un salon..."
      :disabled="isLoading"
      required
      @update:model-value="(value) => $emit('update:modelValue', String(value))"
    />

    <!-- Existing Rooms List -->
    <div v-if="!isLoadingRooms && rooms.length > 0" class="space-y-2 max-h-[320px] overflow-y-auto">
      <p class="text-xs text-muted-foreground px-1">
        {{ filteredRooms.length > 0 ? 'Salons disponibles' : 'Aucun salon correspondant' }}
      </p>

      <button
        v-for="room in filteredRooms"
        :key="room.name"
        type="button"
        :disabled="isLoading"
        class="w-full p-3 text-left rounded-lg border transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed border-border bg-card hover:border-primary/50 hover:bg-accent"
        @click.prevent="$emit('select-room', room.name)"
      >
        <div class="flex items-center justify-between">
          <div class="flex-1">
            <div class="flex items-center gap-2">
              <p class="font-semibold text-sm text-foreground">
                {{ room.name }}
              </p>
            </div>
            <p class="text-xs mt-0.5 text-muted-foreground">
              {{ room.userCount }} {{ room.userCount === 1 ? 'utilisateur' : 'utilisateurs' }}
            </p>
          </div>
          <div
            class="flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold bg-primary text-primary"
          >
            <ArrowRight class="h-4 w-4 text-primary-foreground" />
          </div>
        </div>
      </button>

      <!-- New Room Hint -->
      <button
        v-if="isCreatingNewRoom"
        type="button"
        :disabled="isLoading"
        class="w-full p-3 rounded-lg border-2 border-dashed border-primary/30 bg-primary/5 hover:bg-primary/10 hover:border-primary/50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-left"
        @click.prevent="$emit('select-room', modelValue.trim())"
      >
        <div class="flex items-start gap-2">
          <Plus class="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
          <div>
            <p class="text-sm font-semibold text-primary">
              Créer le salon "{{ modelValue.trim() }}"
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
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Plus, ArrowRight } from 'lucide-vue-next';
import { Input } from '@components/input';
import type { RoomSummary } from '@chat/types';

interface Props {
  modelValue: string;
  rooms: RoomSummary[];
  isLoading: boolean;
  isLoadingRooms: boolean;
}

interface Emits {
  (e: 'update:modelValue', value: string): void;
  (e: 'select-room', roomName: string): void;
}

const props = defineProps<Props>();
defineEmits<Emits>();

// Filtrer les salons selon la recherche
const filteredRooms = computed(() => {
  const search = props.modelValue.trim().toLowerCase();
  if (!search) return props.rooms;

  return props.rooms.filter((room) => room.name.toLowerCase().includes(search));
});

// Vérifier si on crée un nouveau salon
const isCreatingNewRoom = computed(() => {
  const search = props.modelValue.trim();
  if (!search) return false;

  return !props.rooms.some((room) => room.name.toLowerCase() === search.toLowerCase());
});
</script>
