import { apiClient } from './apiClient.js';

export const memberApi = {
  getAll: (serverId) => apiClient.get(`/v1/servers/${serverId}/members`).then((res) => res.data),

  add: (userId, serverId) => apiClient.post(`/v1/servers/${serverId}/members`, { userId, serverId }),

  delete: (memberId, serverId) => apiClient.delete(`/v1/servers/${serverId}/members/${memberId}`),
};
