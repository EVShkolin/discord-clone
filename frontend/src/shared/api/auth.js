import { apiClient } from './apiClient.js';

const authApi = {
  login: (email, password) =>
    apiClient
      .post('/v1/users/login', null, {
        headers: { Authorization: 'Basic ' + btoa(`${email}:${password}`) },
      })
      .then((res) => res.data),

  register: (name, email, password) => apiClient.post('/v1/users', { name, email, password }).then((res) => res.data),
};

export default authApi;
