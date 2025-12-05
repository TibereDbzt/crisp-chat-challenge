<script setup lang="ts">
import { ScrollAreaCorner, ScrollAreaRoot, ScrollAreaViewport } from 'radix-vue'
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'
import ScrollBar from './ScrollBar.vue'

const props = withDefaults(
  defineProps<{
    class?: HTMLAttributes['class']
    orientation?: 'vertical' | 'horizontal'
  }>(),
  {
    orientation: 'vertical',
  },
)
</script>

<template>
  <ScrollAreaRoot :class="cn('relative overflow-hidden', props.class)">
    <ScrollAreaViewport class="h-full w-full rounded-[inherit]">
      <slot />
    </ScrollAreaViewport>
    <ScrollBar :orientation="orientation" />
    <ScrollAreaCorner />
  </ScrollAreaRoot>
</template>
