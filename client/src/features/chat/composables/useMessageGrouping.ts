import { computed, unref, type ComputedRef, type MaybeRef } from 'vue';
import type { Message, User } from '@chat/types';

export interface GroupedMessage extends Message {
  isOwn: boolean;
  isFirstInGroup: boolean;
  isLastInGroup: boolean;
}

export const useMessageGrouping = (
  messages: MaybeRef<Message[]>,
  currentUserId: MaybeRef<User | null>
): ComputedRef<GroupedMessage[]> => {
  return computed(() => {
    const msgs = unref(messages);
    const userId = unref(currentUserId);

    return msgs.map((message, index) => {
      const prevMessage = msgs[index - 1];
      const nextMessage = msgs[index + 1];

      return {
        ...message,
        isOwn: message.userId === userId?.id,
        isFirstInGroup: index === 0 || prevMessage.userId !== message.userId,
        isLastInGroup: index === msgs.length - 1 || nextMessage?.userId !== message.userId,
      };
    });
  });
};
