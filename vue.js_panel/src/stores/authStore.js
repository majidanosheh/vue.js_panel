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
    const stored = localStorage.getItem('user');
    if (stored && stored !== 'undefined') {
      initialUser = JSON.parse(stored);
    }
  } catch (e) {
    console.error('Error parsing stored user', e);
    localStorage.removeItem('user'); // پاکسازی دیتای خراب
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
      console.log('📥 پاسخ سرور:', data); 

      // 2. استخراج توکن (سرور شما accessToken می‌فرستد)
      const token = data.accessToken || data.token; 
      const refreshToken = data.refreshToken;

      if (token) {
        // 3. ساختن آبجکت کاربر از فیلد‌های پخش شده در JSON
        // نکته حیاتی: بک‌اند شما fullName و roles را با حروف کوچک می‌فرستد
        let userData = {
          Id: data.userId || data.uid || data.UserId,
          Email: data.email || data.Email,
          FullName: data.fullName || data.FullName || username,
          
          // ⚠️ FIX: چک کردن هم حروف کوچک و هم بزرگ
          Roles: data.roles || data.Roles || [],
          
          Permissions: [] 
        };

        // لاگ برای اطمینان
        console.log('🔥 نقش‌های دریافت شده در استور:', userData.Roles);

        // 4. تلاش برای استخراج دسترسی‌ها از توکن
        try {
           const decoded = extractPermissions(token);
           // اگر نقش در بادی نبود، از توکن بردار
           if (!userData.Roles || userData.Roles.length === 0) {
             userData.Roles = decoded.roles || [];
           }
           userData.Permissions = decoded.permissions || [];
           
           console.log('🔓 نقش‌های کاربر:', userData.Roles);
        } catch (decodeError) {
           console.error('خطا در دیکود توکن:', decodeError);
        }

        // 5. آپدیت استیت و ذخیره
        accessToken.value = token;
        user.value = userData;

        localStorage.setItem('accessToken', token);
        localStorage.setItem('user', JSON.stringify(userData));
        if (refreshToken) localStorage.setItem('refreshToken', refreshToken);
        
        // 6. ریلود سخت برای اعمال سطح دسترسی‌ها در منو
        window.location.href = '/'; 
        return true;
      } else {
        error.value = 'پاسخ نامعتبر سرور (توکن یافت نشد).';
        return false;
      }

    } catch (err) {
      console.error('Login Error:', err);
      error.value = err.response?.data?.message || 'خطا در برقراری ارتباط';
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