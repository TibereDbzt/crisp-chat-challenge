<template>
  <CardFooter class="p-4 md:p-5 bg-gray-50">
    <form class="flex gap-3 w-full" @submit.prevent="handleSubmit">
      <div class="flex-1 relative">
        <Input
          v-model="inputValue"
          type="text"
          placeholder="Tapez votre message..."
          :disabled="disabled"
          class="w-full pr-4 py-6 rounded-xl border-gray-300 focus:border-[#4963F3] focus:ring-2 focus:ring-[#4963F3]/20 transition-all duration-200 bg-white shadow-sm"
        />
      </div>
      <Button
        type="submit"
        :disabled="!inputValue.trim() || disabled"
        size="icon"
        class="h-12 w-12 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 bg-[#4963F3] hover:bg-[#3952E3] disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-95"
      >
        <Send class="h-5 w-5" />
      </Button>
    </form>
  </CardFooter>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Send } from 'lucide-vue-next';
import { Button } from '@components/button';
import { Input } from '@components/input';
import { CardFooter } from '@components/card';

interface Props {
  disabled?: boolean;
}

interface Emits {
  (e: 'send-message', content: string): void;
}

defineProps<Props>();
const emit = defineEmits<Emits>();

const inputValue = ref('');

const handleSubmit = () => {
  const content = inputValue.value.trim();
  if (!content) return;

  emit('send-message', content);
  inputValue.value = '';
};
</script>
