// src/composables/usePermissions.js
import { useAuthStore } from '@/stores/authStore';

export function usePermissions() {
  const authStore = useAuthStore();

  const can = (permissionName) => {
    const user = authStore.user;
    
    // ۱. اگر کاربر سوپر ادمین است، همه کار می‌تواند بکند
    // (فرض بر اینکه نقش سوپر ادمین را در کلاینت داریم)
    if (user?.Roles?.includes('SuperAdmin')) {
      return true;
    }

    // ۲. بررسی لیست دسترسی‌ها
    // بک‌اند شما احتمالا دسترسی‌ها را در آرایه Permissions یا Claims داخل آبجکت User می‌فرستد
    // یا شاید مجبور باشیم توکن را دیکود کنیم. فعلا فرض می‌کنیم در user.Permissions است.
    const userPermissions = user?.Permissions || []; 
    
    return userPermissions.includes(permissionName);
  };

  return { can };
}