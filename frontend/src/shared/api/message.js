import { apiClient } from '@/shared/api/apiClient.js';

export const messageApi = {
  getAll: (channelId, page = 0, size = 20) =>
    apiClient.get(`/v1/messages?channelId=${channelId}&page=${page}&size=${size}`).then((res) => res.data),

  addTextMessage: (channelId, text) => {
    return apiClient
      .post(`/v1/messages`, {
        type: 'TEXT',
        content: text,
        channelId: channelId,
      })
      .then((res) => res.data);
  },

  update: (id, content) => {
    return apiClient.patch(`v1/messages/${id}`, { content }).then((res) => res.data);
  },

  delete: (id) => {
    apiClient.delete(`v1/messages/${id}`).then((res) => res.data);
  },
};
