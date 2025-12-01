import { defineStore } from 'pinia';
import { ref } from 'vue';
import { roleService } from '@/api/role.service';

export const useRoleStore = defineStore('roleStore', () => {
  const roles = ref([]);
  const allPermissionGroups = ref([]); // لیست کل دسترسی‌های سیستم
  const rolePermissions = ref([]); // دسترسی‌های نقش انتخاب شده
  const loading = ref(false);

  async function fetchRoles() {
    loading.value = true;
    try {
      const data = await roleService.getAll();
      roles.value = data;
    } finally {
      loading.value = false;
    }
  }

  async function fetchPermissionMatrix(roleId) {
    loading.value = true;
    try {
      // دریافت همزمان (Parallel) لیست کل دسترسی‌ها و دسترسی‌های نقش
      const [allGroups, rolePerms] = await Promise.all([
        roleService.getAllPermissions(),
        roleService.getRolePermissions(roleId)
      ]);
      
      allPermissionGroups.value = allGroups;
      rolePermissions.value = rolePerms; // آرایه‌ای از رشته‌ها مثلا ['Permissions.Users.View']
    } finally {
      loading.value = false;
    }
  }

  async function savePermissions(roleId, selectedPermissions) {
    loading.value = true;
    try {
      await roleService.updatePermissions(roleId, selectedPermissions);
      return true;
    } catch (err) {
      console.error(err);
      alert('خطا در ذخیره دسترسی‌ها');
      return false;
    } finally {
      loading.value = false;
    }
  }

  return { 
    roles, 
    allPermissionGroups, 
    rolePermissions, 
    loading, 
    fetchRoles, 
    fetchPermissionMatrix, 
    savePermissions 
  };
});