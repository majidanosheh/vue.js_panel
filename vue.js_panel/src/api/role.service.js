import apiClient from './index';

const BASE_URL = '/api/admin/roles';

export const roleService = {
  // دریافت لیست نقش‌ها
  async getAll() {
    const response = await apiClient.get(BASE_URL);
    return response.data;
  },

  // دریافت لیست تمام دسترسی‌های مجاز سیستم (گروه‌بندی شده)
  async getAllPermissions() {
    const response = await apiClient.get(`${BASE_URL}/permissions`);
    return response.data;
  },

  // دریافت دسترسی‌های فعالِ یک نقش خاص
  async getRolePermissions(roleId) {
    const response = await apiClient.get(`${BASE_URL}/${roleId}/permissions`);
    return response.data;
  },

  // ذخیره دسترسی‌های جدید برای نقش
  async updatePermissions(roleId, permissionNames) {
    // طبق DTO بک‌اند: UpdateRolePermissionsRequest
    const response = await apiClient.put(`${BASE_URL}/${roleId}/permissions`, { 
      permissionNames: permissionNames 
    });
    return response.data;
  }
};