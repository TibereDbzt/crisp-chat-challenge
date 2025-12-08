<template>
  <div class="hidden lg:block w-72 xl:w-80 py-3 pl-3">
    <Card class="h-full flex flex-col shadow-lg border-gray-200 bg-white overflow-hidden">
      <CardHeader class="px-5 py-4 bg-gray-50">
        <div class="flex items-center gap-2.5">
          <Users class="h-5 w-5 text-[#4963F3]" />
          <CardTitle class="text-base">Utilisateurs</CardTitle>
          <Badge class="ml-auto bg-[#4963F3] hover:bg-[#4963F3]/90">
            {{ users.length }}
          </Badge>
        </div>
      </CardHeader>

      <Separator />

      <CardContent class="flex-1 p-3">
        <ScrollArea class="h-full">
          <TransitionGroup name="user" tag="div" class="space-y-2">
            <div
              v-for="user in users"
              :key="user"
              class="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 transition-all duration-200 cursor-pointer group"
            >
              <div class="relative">
                <Avatar>
                  <AvatarFallback class="bg-gray-800 text-white text-sm font-bold">
                    {{ userInitial(user) }}
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

            <div v-if="users.length === 0" class="text-center py-12">
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
</template>

<script setup lang="ts">
import { Users } from 'lucide-vue-next';
import { Card, CardHeader, CardTitle, CardContent } from '@components/card';
import { ScrollArea } from '@components/scroll-area';
import { Avatar, AvatarFallback } from '@components/avatar';
import { Badge } from '@components/badge';
import { Separator } from '@components/separator';

interface Props {
  users: string[];
}

defineProps<Props>();

const userInitial = (user: string) => user[0].toUpperCase();
</script>
