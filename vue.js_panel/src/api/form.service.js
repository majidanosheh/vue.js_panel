// src/api/form.service.js
import apiClient from './index';

const BASE_URL = '/api/admin/forms';

export const formService = {
  // ... (متدهای قبلی: getAll, getById, create, delete, addField, updateField, deleteField) ...

  async getAll() { return (await apiClient.get(BASE_URL)).data; },
  async getById(id) { return (await apiClient.get(`${BASE_URL}/${id}`)).data; },
  async create(data) { return (await apiClient.post(BASE_URL, data)).data; },
  async delete(id) { return (await apiClient.delete(`${BASE_URL}/${id}`)).data; },
  
  async addField(formId, data) { return (await apiClient.post(`${BASE_URL}/${formId}/fields`, data)).data; },
  async updateField(id, data) { return (await apiClient.put(`${BASE_URL}/fields/${id}`, data)).data; },
  async deleteField(id) { return (await apiClient.delete(`${BASE_URL}/fields/${id}`)).data; },

  // 👇 متد جدید: دریافت داده‌های ثبت شده (Submissions)
  async getSubmissions(formId) {
    const response = await apiClient.get(`${BASE_URL}/${formId}/submissions`);
    return response.data; // { headers: [], rows: [] }
  },
  
  // 👇 متد جدید: دانلود اکسل
  async exportCsv(formId) {
    const response = await apiClient.get(`${BASE_URL}/${formId}/export/csv`, {
      responseType: 'blob' // مهم: چون فایل باینری است
    });
    return response.data;
  }
};