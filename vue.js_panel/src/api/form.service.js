import apiClient from './index';

const BASE_URL = '/api/admin/forms';

export const formService = {
  // ... (کدهای قبلی: getAll, getById, create, delete, addField, deleteField) ...
  async getAll() { return (await apiClient.get(BASE_URL)).data; },
  async getById(id) { return (await apiClient.get(`${BASE_URL}/${id}`)).data; },
  async create(data) { return (await apiClient.post(BASE_URL, data)).data; },
  async delete(id) { return (await apiClient.delete(`${BASE_URL}/${id}`)).data; },
  
  async addField(formId, fieldData) {
    return (await apiClient.post(`${BASE_URL}/${formId}/fields`, fieldData)).data;
  },

  async deleteField(fieldId) {
    return (await apiClient.delete(`${BASE_URL}/fields/${fieldId}`)).data;
  },

  // 👇 متد جدید: ویرایش ویژگی‌های فیلد
  // PUT /api/admin/forms/fields/{fieldId}
  async updateField(fieldId, fieldData) {
    const response = await apiClient.put(`${BASE_URL}/fields/${fieldId}`, fieldData);
    return response.data;
  }
};