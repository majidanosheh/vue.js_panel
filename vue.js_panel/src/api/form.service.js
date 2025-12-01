import apiClient from './index';

// طبق کنترلر بک‌اند: Route("api/admin/forms")
const BASE_URL = '/api/admin/forms';

export const formService = {
  // دریافت لیست همه فرم‌ها
  async getAll() {
    const response = await apiClient.get(BASE_URL);
    return response.data;
  },

  // دریافت یک فرم خاص (برای آینده)
  async getById(id) {
    const response = await apiClient.get(`${BASE_URL}/${id}`);
    return response.data;
  },

  // ایجاد فرم جدید
  // ورودی: { title: "...", apiSlug: "..." }
  async create(formData) {
    const response = await apiClient.post(BASE_URL, formData);
    return response.data;
  },

  // حذف فرم
  async delete(id) {
    const response = await apiClient.delete(`${BASE_URL}/${id}`);
    return response.data;
  }
};