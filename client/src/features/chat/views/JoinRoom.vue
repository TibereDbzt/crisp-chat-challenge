<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
    <Card class="w-full max-w-md p-8 space-y-6">
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
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { MessageSquare } from 'lucide-vue-next';
import { useChatStore } from '@chat/stores/chatStore';
import { Button } from '@components/button';
import { Input } from '@components/input';
import { Card } from '@components/card';

const chatStore = useChatStore();

const username = ref('');
const roomName = ref('');
const isLoading = ref(false);

const handleJoinRoom = async () => {
  if (!username.value.trim() || !roomName.value.trim()) return;

  isLoading.value = true;
  const success = await chatStore.joinRoom(username.value.trim(), roomName.value.trim());
  isLoading.value = false;

  if (!success) {
    console.error('Failed to join room:', chatStore.error);
  }
}
</script>
