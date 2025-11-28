import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { authService } from '@/api/auth.service';

export const useAuthStore = defineStore('auth', () => {
  const accessToken = ref(localStorage.getItem('accessToken') || null);
  const user = ref(JSON.parse(localStorage.getItem('user')) || null);
  const loading = ref(false);
  const error = ref(null);

  const isAuthenticated = computed(() => !!accessToken.value);

  async function login(username, password) {
    loading.value = true;
    error.value = null;

    try {
      const data = await authService.login(username, password);
      
      // ⚠️ تبدیل PascalCase دات‌نت به متغیرهای فرانت
      const { Token, RefreshToken, User } = data;

      if (Token) {
        accessToken.value = Token;
        user.value = User;

        localStorage.setItem('accessToken', Token);
        if (User) localStorage.setItem('user', JSON.stringify(User));
        
        return true;
      }
      return false;

    } catch (err) {
      console.error('Login Error:', err);
      error.value = err.response?.data?.message || 'خطا در ارتباط با سرور';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  function logout() {
    accessToken.value = null;
    user.value = null;
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    window.location.href = '/login';
  }

  return { accessToken, user, loading, error, isAuthenticated, login, logout };
});