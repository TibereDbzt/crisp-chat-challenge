<template>
  <div class="flex h-screen bg-gradient-to-br from-slate-50 to-slate-100">
    <div class="flex-1 flex flex-col max-w-6xl mx-auto w-full">
      <div class="bg-white border-b px-6 py-4 flex items-center justify-between shadow-sm">
        <div class="flex items-center space-x-3">
          <div class="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
            <Users class="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 class="text-xl font-semibold">{{ chatStore.currentRoom?.name }}</h2>
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
            <ScrollArea
              class="flex-1 p-4"
              :auto-scroll-trigger="chatStore.messages"
              show-new-content-button
            >
              <div>
                <div v-if="chatStore.messages.length > 0" class="flex justify-center py-4">
                  <div class="bg-muted/50 rounded-lg px-4 py-2 text-center">
                    <p class="text-xs text-muted-foreground">
                      <span v-if="chatStore.currentRoom?.hasMoreMessages">
                        📜 Vous avez rejoint un salon existant. Vous ne voyez que les 10 derniers
                        messages avant votre connexion.
                      </span>
                      <span v-else> 🎉 Début de la conversation </span>
                    </p>
                  </div>
                </div>

                <div
                  v-for="(message, index) in chatStore.messages"
                  :key="message.id"
                  :class="[
                    'flex gap-2 w-full',
                    isOwnMessage(message.userId) ? 'flex-row-reverse' : 'justify-start',
                    isFirstInGroup(index) ? 'mt-4' : 'mt-2',
                  ]"
                >
                  <div
                    :class="[
                      'flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-white text-sm font-semibold flex-shrink-0',
                      isLastInGroup(index) ? 'visible' : 'invisible',
                    ]"
                  >
                    {{ message.username[0].toUpperCase() }}
                  </div>

                  <div
                    class="flex flex-col max-w-[70%]"
                    :class="isOwnMessage(message.userId) ? 'items-end' : 'items-start'"
                  >
                    <div
                      v-if="isFirstInGroup(index)"
                      :class="['px-2 mb-1', isOwnMessage(message.userId) ? 'flex-row-reverse' : '']"
                    >
                      <span class="text-xs font-semibold text-foreground">
                        {{ message.username }}
                      </span>
                    </div>

                    <div
                      :class="[
                        'rounded-lg px-4 py-2 shadow-sm w-fit',
                        isOwnMessage(message.userId)
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-white border',
                      ]"
                    >
                      <p class="text-sm break-words">{{ message.content }}</p>
                    </div>
                    <div
                      v-if="isLastInGroup(index)"
                      :class="['p-1 mb-1', isOwnMessage(message.userId) ? 'flex-row-reverse' : '']"
                    >
                      <span class="text-xs text-muted-foreground">
                        {{ formatTime(message.timestamp) }}
                      </span>
                    </div>
                  </div>
                </div>

                <div
                  v-if="chatStore.messages.length === 0"
                  class="flex items-center justify-center h-full text-center p-8"
                >
                  <div class="space-y-2">
                    <p class="text-muted-foreground">Aucun message</p>
                    <p class="text-sm text-muted-foreground">Commencez la conversation !</p>
                  </div>
                </div>
              </div>
            </ScrollArea>

            <div class="border-t p-4 bg-muted/30">
              <form class="flex gap-2" @submit.prevent="handleSendMessage">
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
                Utilisateurs ({{ chatStore.currentRoom?.users.length ?? 0 }})
              </h3>
            </div>
            <ScrollArea class="flex-1 p-2">
              <div class="space-y-1">
                <div
                  v-for="user in chatStore.currentRoom?.users ?? []"
                  :key="user"
                  class="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted/50 transition-colors"
                >
                  <div
                    class="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-white text-sm font-semibold"
                  >
                    {{ user[0].toUpperCase() }}
                  </div>
                  <span class="text-sm font-medium truncate">{{ user }}</span>
                </div>
                <div v-if="!chatStore.currentRoom?.users.length" class="text-center py-8">
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
import { ref } from 'vue';
import { Send, Users, LogOut } from 'lucide-vue-next';
import { useChatStore } from '@chat/stores/chatStore';
import { Button } from '@components/button';
import { Input } from '@components/input';
import { Card } from '@components/card';
import { ScrollArea } from '@components/scroll-area';

const chatStore = useChatStore();

const messageInput = ref('');

const handleSendMessage = () => {
  const content = messageInput.value.trim();
  if (!content) return;

  chatStore.sendMessage(content);
  messageInput.value = '';
};

const formatTime = (timestamp: number): string => {
  const date = new Date(timestamp);
  const dayName = date.toLocaleDateString('fr-FR', { weekday: 'long' });
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');

  const capitalizedDay = dayName.charAt(0).toUpperCase() + dayName.slice(1);

  return `${capitalizedDay} ${hours}h${minutes}`;
};

const isOwnMessage = (userId: string): boolean => {
  return userId === chatStore.currentUser?.id;
};

const isFirstInGroup = (index: number): boolean => {
  if (index === 0) return true;
  const currentMsg = chatStore.messages[index];
  const prevMsg = chatStore.messages[index - 1];
  return currentMsg.userId !== prevMsg.userId;
};

const isLastInGroup = (index: number): boolean => {
  if (index === chatStore.messages.length - 1) return true;
  const currentMsg = chatStore.messages[index];
  const nextMsg = chatStore.messages[index + 1];
  return currentMsg.userId !== nextMsg.userId;
};
</script>
