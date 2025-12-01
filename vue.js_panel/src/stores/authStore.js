// src/stores/authStore.js
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { authService } from '@/api/auth.service';
import { extractPermissions } from '@/utils/jwt';

export const useAuthStore = defineStore('auth', () => {
  const router = useRouter();
  
  // خواندن امن از لوکال استوریج
  const accessToken = ref(localStorage.getItem('accessToken') || null);
  let initialUser = null;
  try {
    initialUser = JSON.parse(localStorage.getItem('user'));
  } catch (e) {
    console.error('Error parsing stored user', e);
  }
  const user = ref(initialUser);
  const loading = ref(false);
  const error = ref(null);

  const isAuthenticated = computed(() => !!accessToken.value);

  async function login(username, password) {
    loading.value = true;
    error.value = null;

    try {
      // 1. دریافت پاسخ از سرور
      const data = await authService.login(username, password);
      console.log('پاسخ سرور:', data); 

      // 2. مپ کردن دقیق فیلدها طبق JSON شما
      // ⚠️ FIX: سرور شما "accessToken" می‌فرستد
      const token = data.accessToken; 
      const refreshToken = data.refreshToken;

      if (token) {
        console.log('✅ توکن دریافت شد.');
        
        // 3. ساختن آبجکت کاربر از فیلد‌های پخش شده
        let userData = {
          Id: data.userId,
          Email: data.email,
          FullName: data.fullName,
          Roles: data.roles || [], // نقش‌ها از بادی پاسخ
          Permissions: [] // فعلا خالی تا از توکن پر شود
        };

        // 4. استخراج دسترسی‌ها از داخل توکن (JWT)
        try {
           const decoded = extractPermissions(token);
           // اگر نقش در بادی نبود، از توکن بردار
           if (!userData.Roles.length) userData.Roles = decoded.roles || [];
           userData.Permissions = decoded.permissions || [];
           
           console.log('🔓 دسترسی‌های استخراج شده:', userData.Permissions);
        } catch (decodeError) {
           console.error('خطا در دیکود توکن:', decodeError);
        }

        // 5. ذخیره‌سازی و آپدیت استیت
        accessToken.value = token;
        user.value = userData;

        localStorage.setItem('accessToken', token);
        localStorage.setItem('user', JSON.stringify(userData));
        if (refreshToken) localStorage.setItem('refreshToken', refreshToken);
        
        // هدایت به داشبورد (ریلود سخت برای اطمینان)
        window.location.href = '/'; 
        return true;
      } else {
        console.error('❌ فیلد accessToken در پاسخ سرور نبود.');
        error.value = 'پاسخ نامعتبر سرور.';
        return false;
      }

    } catch (err) {
      console.error('Login Error:', err);
      error.value = err.response?.data?.message || 'خطا در ورود';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  function logout() {
    accessToken.value = null;
    user.value = null;
    localStorage.clear();
    window.location.href = '/login';
  }

  return { accessToken, user, loading, error, isAuthenticated, login, logout };
});