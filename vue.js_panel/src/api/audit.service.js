import apiClient from './index';

export const auditService = {
  // دریافت لیست لاگ‌ها
  async getLogs(page = 1, pageSize = 20) {
    const response = await apiClient.get('/api/admin/audit-logs', {
      params: { page, pageSize }
    });
    return response.data; 
  }
};