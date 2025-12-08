<template>
  <div
    class="bg-white border border-gray-200 px-6 py-4 rounded-lg flex items-center justify-between shadow-sm transition-all duration-300"
  >
    <div class="flex items-center space-x-4">
      <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-[#4963F3] shadow-sm">
        <Users class="h-6 w-6 text-white" />
      </div>
      <div>
        <h2 class="text-xl font-bold text-gray-900">{{ roomName }}</h2>
        <div class="flex items-center gap-2 mt-0.5">
          <div class="relative flex h-2 w-2">
            <span
              class="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#4963F3] opacity-75"
            ></span>
            <span class="relative inline-flex rounded-full h-2 w-2 bg-[#4963F3]"></span>
          </div>
          <p class="text-sm text-gray-600">{{ username }}</p>
        </div>
      </div>
    </div>
    <Button
      variant="destructive"
      size="sm"
      class="hover:scale-105 transition-transform duration-200 shadow-md hover:shadow-lg"
      @click="$emit('leave-room')"
    >
      <LogOut class="h-4 w-4 mr-2" />
      Quitter
    </Button>
  </div>
</template>

<script setup lang="ts">
import { Users, LogOut } from 'lucide-vue-next';
import { Button } from '@components/button';

interface Props {
  roomName?: string;
  username?: string;
}

interface Emits {
  (e: 'leave-room'): void;
}

defineProps<Props>();
defineEmits<Emits>();
</script>
