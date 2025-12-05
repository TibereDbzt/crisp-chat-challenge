<script setup lang="ts">
import { useChatStore } from '@chat/stores/chatStore';
import JoinRoom from '@chat/views/JoinRoom.vue';
import ChatRoom from '@chat/views/ChatRoom.vue';

const chatStore = useChatStore();
</script>

<template>
  <div id="app">
    <JoinRoom v-if="!chatStore.isInRoom" />
    <ChatRoom v-else />
  </div>
</template>
