// src/directives/permission.js
// نسخه مخصوص دیباگ (با لاگ‌های دقیق)

import { useAuthStore } from '@/stores/authStore';

export const permissionDirective = {
  mounted(el, binding) {
    const { value } = binding; // نام دسترسی مورد نیاز
    const authStore = useAuthStore();
    const user = authStore.user;

    console.log(`🔍 بررسی دسترسی برای: ${value}`);

    if (!user) {
      console.warn('❌ کاربر در استور یافت نشد (User is null).');
      el.parentNode && el.parentNode.removeChild(el);
      return;
    }

    // چاپ محتویات کاربر برای بررسی
    // console.log('👤 اطلاعات کاربر:', JSON.parse(JSON.stringify(user)));

    // بررسی نقش‌ها
    const roles = user.Roles || user.roles || [];
    console.log('🎭 نقش‌های کاربر:', roles);

    // چک کردن سوپر ادمین
    const isSuperAdmin = roles.some(r => String(r).toLowerCase() === 'superadmin');
    
    // بررسی لیست دسترسی‌ها
    const permissions = user.Permissions || user.permissions || [];
    // console.log('🔑 لیست دسترسی‌ها:', permissions);

    const hasPermission = isSuperAdmin || permissions.includes(value);

    console.log(`🛡️ نتیجه: SuperAdmin=${isSuperAdmin}, Access=${hasPermission ? '✅ مجاز' : '⛔ غیرمجاز'}`);
    console.log('------------------------------------------------');

    if (!hasPermission) {
      el.parentNode && el.parentNode.removeChild(el);
    }
  }
};