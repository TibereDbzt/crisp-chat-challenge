<template>
  <div class="flex h-screen bg-gray-50">
    <div class="mt-2 flex-1 flex flex-col max-w-7xl mx-auto w-full">
      <div
        class="bg-white border border-gray-200 px-6 py-4 rounded-lg flex items-center justify-between shadow-sm transition-all duration-300"
      >
        <div class="flex items-center space-x-4">
          <div
            class="flex h-12 w-12 items-center justify-center rounded-xl bg-[#4963F3] shadow-sm transform transition-transform"
          >
            <Users class="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 class="text-xl font-bold text-gray-900">{{ chatStore.currentRoom?.name }}</h2>
            <div class="flex items-center gap-2 mt-0.5">
              <div class="relative flex h-2 w-2">
                <span
                  class="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#4963F3] opacity-75"
                ></span>
                <span class="relative inline-flex rounded-full h-2 w-2 bg-[#4963F3]"></span>
              </div>
              <p class="text-sm text-gray-600">{{ chatStore.currentUser?.username }}</p>
            </div>
          </div>
        </div>
        <Button
          variant="destructive"
          size="sm"
          @click="chatStore.leaveRoom"
          class="hover:scale-105 transition-transform duration-200 shadow-md hover:shadow-lg"
        >
          <LogOut class="h-4 w-4 mr-2" />
          Quitter
        </Button>
      </div>

      <div class="flex-1 flex overflow-hidden">
        <div class="flex-1 flex flex-col py-3">
          <Card
            class="flex-1 flex flex-col overflow-hidden shadow-lg border-gray-200 bg-white"
          >
            <ScrollArea
              class="flex-1 px-4 md:px-6"
              :auto-scroll-trigger="chatStore.messages"
              show-new-content-button
            >
              <div class="space-y-1">
                <div
                  v-if="chatStore.messages.length > 0"
                  class="flex justify-center py-6 animate-in fade-in-0 slide-in-from-top-4 duration-500"
                >
                  <div
                    class="bg-gray-100 border border-gray-200 rounded-2xl px-5 py-3 text-center shadow-sm"
                  >
                    <p class="text-xs font-medium text-gray-700">
                      <span v-if="chatStore.currentRoom?.hasMoreMessages">
                        📜 Vous avez rejoint un salon existant. Vous ne voyez que les 10 derniers
                        messages avant votre connexion.
                      </span>
                      <span v-else> 🎉 Début de la conversation </span>
                    </p>
                  </div>
                </div>

                <div class="space-y-1">
                  <div
                    v-for="(message, index) in chatStore.messages"
                    :key="message.id"
                    :class="[
                      'flex gap-3 w-full',
                      isOwnMessage(message.userId) ? 'flex-row-reverse' : 'justify-start',
                      isFirstInGroup(index) ? 'mt-6' : 'mt-1',
                    ]"
                  >
                    <Avatar
                      v-if="isLastInGroup(index)"
                      class="flex-shrink-0"
                    >
                      <AvatarFallback class="bg-gray-800 text-white text-sm font-bold">
                        {{ message.username[0].toUpperCase() }}
                      </AvatarFallback>
                    </Avatar>
                    <div v-else class="w-10 flex-shrink-0"></div>

                    <div
                      class="flex flex-col max-w-[85%] md:max-w-[75%] lg:max-w-[65%]"
                      :class="isOwnMessage(message.userId) ? 'items-end' : 'items-start'"
                    >
                      <div
                        v-if="isFirstInGroup(index)"
                        :class="[
                          'px-3 mb-1.5 flex items-center gap-2',
                          isOwnMessage(message.userId) ? 'flex-row-reverse' : '',
                        ]"
                      >
                        <span class="text-xs font-bold text-gray-700">
                          {{ message.username }}
                        </span>
                      </div>

                      <div
                        :class="[
                          'rounded-2xl px-4 py-2.5 shadow-sm w-fit animate-in fade-in-0 slide-in-from-bottom-2 duration-300',
                          isOwnMessage(message.userId)
                            ? 'bg-[#4963F3] text-white rounded-br-md'
                            : 'bg-white border border-gray-200 text-gray-900 rounded-bl-md',
                        ]"
                      >
                        <p class="text-sm leading-relaxed break-words">{{ message.content }}</p>
                      </div>

                      <div
                        v-if="isLastInGroup(index)"
                        :class="[
                          'px-3 mt-1 pb-8',
                          isOwnMessage(message.userId) ? 'flex-row-reverse' : '',
                        ]"
                      >
                        <span class="text-xs text-gray-500 font-medium">
                          {{ formatTime(message.timestamp) }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div
                  v-if="chatStore.messages.length === 0"
                  class="flex items-center justify-center h-full text-center p-12 animate-in fade-in-0 zoom-in-95 duration-700"
                >
                  <div class="space-y-4">
                    <div
                      class="mx-auto w-20 h-20 rounded-2xl bg-gray-100 flex items-center justify-center"
                    >
                      <Send class="h-10 w-10 text-[#4963F3]" />
                    </div>
                    <div class="space-y-2">
                      <p class="text-lg font-semibold text-gray-900">Aucun message</p>
                      <p class="text-sm text-gray-500">
                        Soyez le premier à démarrer la conversation ! 💬
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollArea>

            <Separator />
            
            <CardFooter class="p-4 md:p-5 bg-gray-50">
              <form class="flex gap-3 w-full" @submit.prevent="handleSendMessage">
                <div class="flex-1 relative">
                  <Input
                    v-model="messageInput"
                    type="text"
                    placeholder="Tapez votre message..."
                    class="w-full pr-4 py-6 rounded-xl border-gray-300 focus:border-[#4963F3] focus:ring-2 focus:ring-[#4963F3]/20 transition-all duration-200 bg-white shadow-sm"
                    @focus="isInputFocused = true"
                    @blur="isInputFocused = false"
                  />
                </div>
                <Button
                  type="submit"
                  :disabled="!messageInput.trim()"
                  size="icon"
                  class="h-12 w-12 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 bg-[#4963F3] hover:bg-[#3952E3] disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-95"
                >
                  <Send class="h-5 w-5" />
                </Button>
              </form>
            </CardFooter>
          </Card>
        </div>

        <div class="hidden lg:block w-72 xl:w-80 py-3 pl-3">
          <Card
            class="h-full flex flex-col shadow-lg border-gray-200 bg-white overflow-hidden"
          >
            <CardHeader class="px-5 py-4 bg-gray-50">
              <div class="flex items-center gap-2.5">
                <Users class="h-5 w-5 text-[#4963F3]" />
                <CardTitle class="text-base">Utilisateurs</CardTitle>
                <Badge class="ml-auto bg-[#4963F3] hover:bg-[#4963F3]/90">
                  {{ chatStore.currentRoom?.users.length ?? 0 }}
                </Badge>
              </div>
            </CardHeader>
            
            <Separator />
            <CardContent class="flex-1 p-3">
              <ScrollArea class="h-full">
                <TransitionGroup name="user" tag="div" class="space-y-2">
                  <div
                    v-for="user in chatStore.currentRoom?.users ?? []"
                    :key="user"
                    class="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 transition-all duration-200 cursor-pointer group"
                  >
                    <div class="relative">
                      <Avatar>
                        <AvatarFallback class="bg-gray-800 text-white text-sm font-bold">
                          {{ user[0].toUpperCase() }}
                        </AvatarFallback>
                      </Avatar>
                      <div
                        class="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-[#4963F3] border-2 border-white shadow-sm"
                      ></div>
                    </div>
                    <span class="text-sm font-semibold text-gray-900 truncate flex-1">
                      {{ user }}
                    </span>
                  </div>
                  <div v-if="!chatStore.currentRoom?.users.length" class="text-center py-12">
                    <div class="space-y-3">
                      <div
                        class="mx-auto w-16 h-16 rounded-xl bg-gray-100 flex items-center justify-center"
                      >
                        <Users class="h-8 w-8 text-gray-400" />
                      </div>
                      <p class="text-sm font-medium text-gray-500">Aucun utilisateur en ligne</p>
                    </div>
                  </div>
                </TransitionGroup>
              </ScrollArea>
            </CardContent>
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
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@components/card';
import { ScrollArea } from '@components/scroll-area';
import { Avatar, AvatarFallback } from '@components/avatar';
import { Badge } from '@components/badge';
import { Separator } from '@components/separator';

const chatStore = useChatStore();

const messageInput = ref('');
const isInputFocused = ref(false);

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

<style scoped>
/* Animations pour les messages */
.message-enter-active {
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.message-leave-active {
  transition: all 0.3s ease-out;
}

.message-enter-from {
  opacity: 0;
  transform: translateY(20px) scale(0.95);
}

.message-leave-to {
  opacity: 0;
  transform: translateX(-30px) scale(0.9);
}

.message-move {
  transition: transform 0.4s ease;
}

/* Animations pour les utilisateurs */
.user-enter-active {
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.user-leave-active {
  transition: all 0.3s ease-out;
}

.user-enter-from {
  opacity: 0;
  transform: translateX(-20px) scale(0.9);
}

.user-leave-to {
  opacity: 0;
  transform: translateX(20px) scale(0.9);
}

.user-move {
  transition: transform 0.4s ease;
}

/* Animation personnalisée pour le bounce hover */
@keyframes bounce-subtle {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

/* Animations Tailwind personnalisées */
@keyframes fade-in-0 {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slide-in-from-top-4 {
  from {
    transform: translateY(-1rem);
  }
  to {
    transform: translateY(0);
  }
}

@keyframes zoom-in-95 {
  from {
    transform: scale(0.95);
  }
  to {
    transform: scale(1);
  }
}

@keyframes slide-in-from-bottom-2 {
  from {
    opacity: 0;
    transform: translateY(0.5rem);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-in {
  animation-fill-mode: both;
}

.fade-in-0 {
  animation: fade-in-0;
}

.slide-in-from-top-4 {
  animation: slide-in-from-top-4;
}

.slide-in-from-bottom-2 {
  animation: slide-in-from-bottom-2;
}

.zoom-in-95 {
  animation: zoom-in-95;
}

.duration-300 {
  animation-duration: 300ms;
}

.duration-500 {
  animation-duration: 500ms;
}

.duration-700 {
  animation-duration: 700ms;
}
</style>
