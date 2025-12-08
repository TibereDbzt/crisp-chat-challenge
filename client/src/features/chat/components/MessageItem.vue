<template>
  <div
    :class="[
      'flex gap-3 w-full',
      message.isOwn ? 'flex-row-reverse' : 'justify-start',
      message.isFirstInGroup ? 'mt-6' : 'mt-1',
    ]"
  >
    <Avatar v-if="message.isLastInGroup" class="flex-shrink-0">
      <AvatarFallback class="bg-gray-800 text-white text-sm font-bold">
        {{ avatarInitial }}
      </AvatarFallback>
    </Avatar>
    <div v-else class="w-10 flex-shrink-0"></div>

    <div
      class="flex flex-col max-w-[85%] md:max-w-[75%] lg:max-w-[65%]"
      :class="message.isOwn ? 'items-end' : 'items-start'"
    >
      <div
        v-if="message.isFirstInGroup"
        :class="['px-3 mb-1.5 flex items-center gap-2', message.isOwn ? 'flex-row-reverse' : '']"
      >
        <span class="text-xs font-bold text-gray-700">
          {{ message.username }}
        </span>
      </div>

      <div
        :class="[
          'rounded-2xl px-4 py-2.5 shadow-sm w-fit animate-in fade-in-0 slide-in-from-bottom-2 duration-300',
          message.isOwn
            ? 'bg-[#4963F3] text-white rounded-br-md'
            : 'bg-white border border-gray-200 text-gray-900 rounded-bl-md',
        ]"
      >
        <p class="text-sm leading-relaxed break-words">{{ message.content }}</p>
      </div>

      <div
        v-if="message.isLastInGroup"
        :class="['px-3 mt-1 pb-8', message.isOwn ? 'flex-row-reverse' : '']"
      >
        <span class="text-xs text-gray-500 font-medium">
          {{ formattedTime }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Avatar, AvatarFallback } from '@components/avatar';
import { useDateFormat } from '@chat/composables/useDateFormat';
import type { GroupedMessage } from '@chat/composables/useMessageGrouping';

interface Props {
  message: GroupedMessage;
}

const props = defineProps<Props>();

const { formatMessageTime } = useDateFormat();

const formattedTime = computed(() => formatMessageTime(props.message.timestamp));
const avatarInitial = computed(() => props.message.username[0].toUpperCase());
</script>
