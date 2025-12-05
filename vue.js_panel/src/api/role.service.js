import apiClient from './index';
const BASE_URL = '/api/admin/roles';

export const roleService = {
  async getAll() { return (await apiClient.get(BASE_URL)).data; },
  
  // دریافت لیست چک‌باکس‌ها
  async getAllPermissions() { return (await apiClient.get(`${BASE_URL}/permissions`)).data; },
  
  // دریافت تیک‌های زده شده برای یک نقش
  async getRolePermissions(id) { return (await apiClient.get(`${BASE_URL}/${id}/permissions`)).data; },
  
  // ذخیره تیک‌ها
  async updatePermissions(id, perms) { return (await apiClient.put(`${BASE_URL}/${id}/permissions`, { permissionNames: perms })).data; },

  // 👇 متدهای جدید که گم شده بودند
  async create(roleData) {
    return (await apiClient.post(BASE_URL, roleData)).data;
  },

  async delete(id) {
    return (await apiClient.delete(`${BASE_URL}/${id}`)).data;
  }
};