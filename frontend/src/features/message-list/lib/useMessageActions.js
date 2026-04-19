import { useMutation } from '@tanstack/react-query';
import { messageApi } from '@/shared/api/message.js';
import {
  addMessageToCache,
  deleteMessageFromCache,
  updateMessageInCache,
} from '@/features/message-list/lib/messageCacheUpdater.js';

export const useMessageActions = (channelId) => {
  const createTextMessage = useMutation({
    mutationFn: (text) => messageApi.addTextMessage(channelId, text),
    onSuccess: (message) => addMessageToCache(channelId, message),
  });

  const updateMessage = useMutation({
    mutationFn: ({ id, content }) => messageApi.update(id, content),
    onSuccess: (updatedMessage) => updateMessageInCache(channelId, updatedMessage),
  });

  const deleteMessage = useMutation({
    mutationFn: (id) => messageApi.delete(id),
    onSuccess: (_, id) => deleteMessageFromCache(channelId, id),
  });

  return { createTextMessage, updateMessage, deleteMessage };
};
