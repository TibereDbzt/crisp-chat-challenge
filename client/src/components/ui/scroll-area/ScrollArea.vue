<script setup lang="ts">
import { ScrollAreaCorner, ScrollAreaRoot, ScrollAreaViewport } from 'radix-vue'
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'
import ScrollBar from './ScrollBar.vue'
import { ref, nextTick, watch, onMounted, onUnmounted } from 'vue';
import { ArrowDown } from 'lucide-vue-next';

const props = withDefaults(
  defineProps<{
    class?: HTMLAttributes['class']
    orientation?: 'vertical' | 'horizontal'
    autoScrollTrigger?: unknown
    showNewContentButton?: boolean
  }>(),
  {
    orientation: 'vertical',
    showNewContentButton: false,
  },
)

const scrollAreaRef = ref<any>(null);
const showFloatingButton = ref(false);

const isNearBottom = (): boolean => {
  const viewport = scrollAreaRef.value?.viewport;
  if (!viewport) return false;
  const threshold = 100;
  return viewport.scrollHeight - viewport.scrollTop - viewport.clientHeight < threshold;
}

const scrollToBottom = (smooth = false) => {
  nextTick(() => {
    const viewport = scrollAreaRef.value?.viewport;
    if (viewport) {
      viewport.scrollTo({
        top: viewport.scrollHeight,
        behavior: smooth ? 'smooth' : 'auto',
      });
    }
  });
}

const handleScrollChange = () => {
  if (isNearBottom()) {
    showFloatingButton.value = false;
  }
}

const handleNewContent = () => {
  if (props.showNewContentButton) {
    if (isNearBottom()) {
      scrollToBottom();
    } else {
      showFloatingButton.value = true;
    }
  } else {
    scrollToBottom();
  }
}

const handleButtonClick = () => {
  showFloatingButton.value = false;
  scrollToBottom(true);
}

watch(() => props.autoScrollTrigger, handleNewContent, { deep: true });

onMounted(() => {
  const viewport = scrollAreaRef.value?.viewport;
  if (viewport) {
    viewport.addEventListener('scroll', handleScrollChange);
  }
});

onUnmounted(() => {
  const viewport = scrollAreaRef.value?.viewport;
  if (viewport) {
    viewport.removeEventListener('scroll', handleScrollChange);
  }
});

defineExpose({
  scrollToBottom: (smooth = true) => scrollToBottom(smooth),
});
</script>

<template>
  <ScrollAreaRoot ref="scrollAreaRef" :class="cn('relative overflow-hidden', props.class)">
    <ScrollAreaViewport class="h-full w-full rounded-[inherit]">
      <slot />
    </ScrollAreaViewport>
    <ScrollBar :orientation="orientation" />
    <ScrollAreaCorner />
    
    <Transition
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="opacity-0 translate-y-4 scale-95"
      enter-to-class="opacity-100 translate-y-0 scale-100"
      leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="opacity-100 translate-y-0 scale-100"
      leave-to-class="opacity-0 translate-y-4 scale-95"
    >
      <button
        v-if="showFloatingButton && showNewContentButton"
        @click="handleButtonClick"
        class="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-full shadow-lg hover:bg-primary/90 hover:shadow-xl transition-all duration-200 text-sm font-medium whitespace-nowrap"
      >
        <ArrowDown class="h-4 w-4" />
        Nouveaux messages
      </button>
    </Transition>
  </ScrollAreaRoot>
</template>
