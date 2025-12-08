<template>
  <div class="flex h-screen bg-gray-50">
    <div class="mt-2 flex-1 flex flex-col max-w-7xl mx-auto w-full">
      <ChatHeader
        :room-name="chatStore.currentRoom?.name"
        :username="chatStore.currentUser?.username"
        @leave-room="chatStore.leaveRoom"
      />

      <div class="flex-1 flex overflow-hidden">
        <div class="flex-1 flex flex-col py-3">
          <Card class="flex-1 flex flex-col overflow-hidden shadow-lg border-gray-200 bg-white">
            <ScrollArea
              class="flex-1 px-4 md:px-6"
              :auto-scroll-trigger="chatStore.messages"
              show-new-content-button
            >
              <div class="space-y-1">
                <div
                  v-if="hasMessages"
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
                  <MessageItem
                    v-for="message in groupedMessages"
                    :key="message.id"
                    :message="message"
                  />
                </div>

                <div
                  v-if="!hasMessages"
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

            <MessageInput @send-message="handleSendMessage" />
          </Card>
        </div>

        <UsersSidebar :users="chatStore.currentRoom?.users ?? []" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Send } from 'lucide-vue-next';
import { useChatStore } from '@chat/stores/chatStore';
import { Card } from '@components/card';
import { ScrollArea } from '@components/scroll-area';
import { Separator } from '@components/separator';
import { ChatHeader, MessageItem, MessageInput, UsersSidebar } from '@chat/components';
import { useMessageGrouping } from '@chat/composables';
import { storeToRefs } from 'pinia';

const chatStore = useChatStore();
const { messages, currentUser } = storeToRefs(chatStore);

const groupedMessages = useMessageGrouping(
  messages,
  currentUser,
);

const hasMessages = computed(() => chatStore.messages.length > 0);

const handleSendMessage = (content: string) => {
  chatStore.sendMessage(content);
};
</script>
