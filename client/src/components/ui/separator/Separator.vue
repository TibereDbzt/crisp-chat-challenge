<template>
  <Separator
    v-bind="delegatedProps"
    :class="
      cn(
        'shrink-0 bg-border',
        props.orientation === 'horizontal' ? 'h-[1px] w-full' : 'h-full w-[1px]',
        props.class
      )
    "
  />
</template>

<script setup lang="ts">
import { type HTMLAttributes, computed } from 'vue';
import { Separator, type SeparatorProps } from 'radix-vue';
import { cn } from '@/lib/utils';

const props = withDefaults(defineProps<SeparatorProps & { class?: HTMLAttributes['class'] }>(), {
  orientation: 'horizontal',
  decorative: true,
});

const delegatedProps = computed(() => {
  const { ...delegated } = props;
  return delegated;
});
</script>
