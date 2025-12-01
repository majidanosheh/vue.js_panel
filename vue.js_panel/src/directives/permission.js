import { useAuthStore } from '@/stores/authStore';

export const permissionDirective = {
  mounted(el, binding) {
    const { value } = binding; // نام دسترسی (مثلا 'Permissions.Users.Delete')
    const authStore = useAuthStore();
    const user = authStore.user;

    // لاجیک بررسی (مشابه composable)
    const isSuperAdmin = user?.Roles?.includes('SuperAdmin');
    const userPermissions = user?.Permissions || [];
    const hasPermission = isSuperAdmin || userPermissions.includes(value);

    // اگر دسترسی نداشت، المان را از صفحه حذف کن
    if (!hasPermission) {
      el.parentNode && el.parentNode.removeChild(el);
    }
  }
};