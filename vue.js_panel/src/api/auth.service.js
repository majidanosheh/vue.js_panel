// src/api/auth.service.js
import apiClient from './index';

// ⚠️ نکته مهم: حتما باید export const باشه
export const authService = {
  async login(username, password) {
    // سرور دات‌نت شما فیلد email می‌خواهد
    return (await apiClient.post('/api/auth/login', { 
      email: username, 
      password: password 
    })).data;
  },

  async getProfile() {
    const response = await apiClient.get('/api/auth/profile');
    return response.data;
  }
};