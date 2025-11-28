import apiClient from './index';

export const authService = {
  async login(username, password) {
    const response = await apiClient.post('/api/auth/login', { username, password });
    return response.data;
  },

  async getProfile() {
    const response = await apiClient.get('/api/auth/profile');
    return response.data;
  }
};