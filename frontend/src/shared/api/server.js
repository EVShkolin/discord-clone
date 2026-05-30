import { apiClient } from './apiClient.js';

const serverApi = {
  getAll: (userId) => apiClient.get(`/v1/servers?userId=${userId}`).then((res) => res.data),

  findAvailable: (userId) => apiClient.get(`/v1/servers/search?userId=${userId}`).then((res) => res.data),

  add: (name, description) => apiClient.post('/v1/servers', { name, description }).then((res) => res.data),

  update: (id, name, description) => apiClient.put(`/v1/servers/${id}`, { name, description }).then((res) => res.data),

  delete: (id) => apiClient.delete(`/v1/servers/${id}`).then((res) => res.data),
};

export default serverApi;
