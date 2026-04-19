import { queryClient } from '@/shared/lib/queryClient.js';

export const addMessageToCache = (channelId, newMessage) => {
  channelId = String(channelId);
  queryClient.setQueryData(['messages', channelId], (oldData) => {
    if (!oldData) return oldData;
    const newPages = [...oldData.pages];
    newPages[0] = {
      ...newPages[0],
      content: [newMessage, ...newPages[0].content],
    };
    return { ...oldData, pages: newPages };
  });
};

export const updateMessageInCache = (channelId, updatedMessage) => {
  channelId = String(channelId);
  queryClient.setQueryData(['messages', channelId], (oldData) => {
    if (!oldData) return oldData;
    const newPages = oldData.pages.map((page) => ({
      ...page,
      content: page.content.map((msg) => (msg.id === updatedMessage.id ? updatedMessage : msg)),
    }));
    return { ...oldData, pages: newPages };
  });
};

export const deleteMessageFromCache = (channelId, id) => {
  channelId = String(channelId);
  queryClient.setQueryData(['messages', channelId], (oldData) => {
    const newPages = oldData.pages.map((page) => ({
      ...page,
      content: page.content.filter((msg) => msg.id !== id),
    }));

    return { ...oldData, pages: newPages };
  });
};
