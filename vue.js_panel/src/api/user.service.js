import apiClient from './index';

const BASE_URL = '/api/admin/users';

export const userService = {
  // 1. لیست همه کاربران
  async getAll() {
    const response = await apiClient.get(BASE_URL); 
    return response.data;
  },

  // 2. دریافت یک کاربر خاص (برای ویرایش)
  async getById(id) {
    const response = await apiClient.get(`${BASE_URL}/${id}`);
    return response.data;
  },

  // 3. ایجاد کاربر
  async create(userData) {
    const response = await apiClient.post(BASE_URL, userData);
    return response.data;
  },

  // 4. ویرایش کاربر
  async update(id, userData) {
    const response = await apiClient.put(`${BASE_URL}/${id}`, userData);
    return response.data;
  },

  // 5. حذف کاربر
  async delete(id) {
    // طبق کنترلر شما، حذف خروجی خاصی ندارد (NoContent) یا پیام موفقیت دارد
    const response = await apiClient.delete(`${BASE_URL}/${id}`);
    return response.data;
  }
};