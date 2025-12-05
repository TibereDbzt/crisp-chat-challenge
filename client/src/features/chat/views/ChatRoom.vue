<template>
  <div class="flex h-screen bg-gradient-to-br from-slate-50 to-slate-100">
    <div class="flex-1 flex flex-col max-w-6xl mx-auto w-full">
      <div class="bg-white border-b px-6 py-4 flex items-center justify-between shadow-sm">
        <div class="flex items-center space-x-3">
          <div class="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
            <Users class="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 class="text-xl font-semibold">{{ chatStore.currentRoom }}</h2>
            <p class="text-sm text-muted-foreground">{{ chatStore.currentUser?.username }}</p>
          </div>
        </div>
        <Button variant="destructive" size="sm" @click="chatStore.leaveRoom">
          <LogOut class="h-4 w-4 mr-2" />
          Quitter
        </Button>
      </div>

      <div class="flex-1 flex overflow-hidden">
        <div class="flex-1 flex flex-col p-4">
          <Card class="flex-1 flex flex-col overflow-hidden">
            <ScrollArea class="flex-1 p-4">
              <div ref="messagesContainer" class="space-y-4">
                <div v-if="chatStore.messages.length > 0" class="flex justify-center py-4">
                  <div class="bg-muted/50 rounded-lg px-4 py-2 text-center">
                    <p class="text-xs text-muted-foreground">
                      <span v-if="chatStore.hasMoreMessages">
                        📜 Vous avez rejoint un salon existant. Vous ne voyez que les 10 derniers messages avant votre connexion.
                      </span>
                      <span v-else>
                        🎉 Début de la conversation
                      </span>
                    </p>
                  </div>
                </div>

                <div
                  v-for="message in chatStore.messages"
                  :key="message.id"
                  :class="[
                    'flex',
                    isOwnMessage(message.userId) ? 'justify-end' : 'justify-start',
                  ]"
                >
                  <div
                    :class="[
                      'max-w-[70%] rounded-lg px-4 py-2 shadow-sm',
                      isOwnMessage(message.userId)
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-white border',
                    ]"
                  >
                    <div class="flex items-baseline justify-between gap-2 mb-1">
                      <span
                        :class="[
                          'text-xs font-semibold',
                          isOwnMessage(message.userId)
                            ? 'text-primary-foreground/90'
                            : 'text-foreground',
                        ]"
                      >
                        {{ message.username }}
                      </span>
                      <span
                        :class="[
                          'text-xs',
                          isOwnMessage(message.userId)
                            ? 'text-primary-foreground/70'
                            : 'text-muted-foreground',
                        ]"
                      >
                        {{ formatTime(message.timestamp) }}
                      </span>
                    </div>
                    <p class="text-sm break-words">{{ message.content }}</p>
                  </div>
                </div>

                <div v-if="chatStore.messages.length === 0" class="flex items-center justify-center h-full text-center p-8">
                  <div class="space-y-2">
                    <p class="text-muted-foreground">Aucun message</p>
                    <p class="text-sm text-muted-foreground">Commencez la conversation !</p>
                  </div>
                </div>
              </div>
            </ScrollArea>

            <div class="border-t p-4 bg-muted/30">
              <form @submit.prevent="handleSendMessage" class="flex gap-2">
                <Input
                  v-model="messageInput"
                  type="text"
                  placeholder="Tapez votre message..."
                  class="flex-1"
                />
                <Button type="submit" :disabled="!messageInput.trim()" size="icon">
                  <Send class="h-4 w-4" />
                </Button>
              </form>
            </div>
          </Card>
        </div>

        <div class="w-64 p-4">
          <Card class="h-full flex flex-col">
            <div class="px-4 py-3 border-b">
              <h3 class="font-semibold flex items-center gap-2">
                <Users class="h-4 w-4" />
                Utilisateurs ({{ chatStore.users.length }})
              </h3>
            </div>
            <ScrollArea class="flex-1 p-2">
              <div class="space-y-1">
                <div
                  v-for="user in chatStore.users"
                  :key="user"
                  class="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted/50 transition-colors"
                >
                  <div class="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-white text-sm font-semibold">
                    {{ user[0].toUpperCase() }}
                  </div>
                  <span class="text-sm font-medium truncate">{{ user }}</span>
                </div>
                <div v-if="chatStore.users.length === 0" class="text-center py-8">
                  <p class="text-sm text-muted-foreground">Aucun utilisateur en ligne</p>
                </div>
              </div>
            </ScrollArea>
          </Card>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, watch } from 'vue';
import { Send, Users, LogOut } from 'lucide-vue-next';
import { useChatStore } from '@chat/stores/chatStore';
import { Button } from '@components/button';
import { Input } from '@components/input';
import { Card } from '@components/card';
import { ScrollArea } from '@components/scroll-area';

const chatStore = useChatStore();

const messageInput = ref('');
const messagesContainer = ref<HTMLElement | null>(null);

const scrollToBottom = () => {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
    }
  });
}

watch(() => chatStore.messages, scrollToBottom, { deep: true });

const handleSendMessage = () => {
  const content = messageInput.value.trim();
  if (!content) return;

  chatStore.sendMessage(content);
  messageInput.value = '';
}

const formatTime = (timestamp: number): string => {
  return new Date(timestamp).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

const isOwnMessage = (userId: string): boolean => {
  return userId === chatStore.currentUser?.id;
}
</script>
