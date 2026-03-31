import { useMutation, useQueryClient } from '@tanstack/react-query';
import { messageApi } from '@/shared/api/message.js';

export const useMessageActions = (channelId) => {
  const queryClient = useQueryClient();

  const createTextMessage = useMutation({
    mutationFn: (text) => messageApi.addTextMessage(channelId, text),
    onSuccess: (message) => {
      queryClient.setQueryData(['messages', channelId], (oldData) => {
        const newPages = [...oldData.pages];
        newPages[0] = {
          ...newPages[0],
          content: [message, ...newPages[0].content],
        };

        return { ...oldData, pages: newPages };
      });
    },
  });

  const updateMessage = useMutation({
    mutationFn: ({ id, content }) => messageApi.update(id, content),
    onSuccess: (updatedMessage, variables) => {
      queryClient.setQueryData(['messages', channelId], (oldData) => {
        const newPages = oldData.pages.map((page) => ({
          ...page,
          content: page.content.map((msg) => (msg.id === variables.id ? updatedMessage : msg)),
        }));

        return { ...oldData, pages: newPages };
      });
    },
  });

  const deleteMessage = useMutation({
    mutationFn: (id) => messageApi.delete(id),
    onSuccess: (_, id) => {
      queryClient.setQueryData(['messages', channelId], (oldData) => {
        const newPages = oldData.pages.map((page) => ({
          ...page,
          content: page.content.filter((msg) => msg.id !== id),
        }));

        return { ...oldData, pages: newPages };
      });
    },
  });

  return { createTextMessage, updateMessage, deleteMessage };
};
