<template>
  <div class="login-container">
    <h2>ورود به پنل AnosheCMS</h2>
    <form @submit.prevent="handleLogin">
      <div>
        <label>نام کاربری:</label>
        <input v-model="username" type="text" required placeholder="admin" />
      </div>
      <div>
        <label>رمز عبور:</label>
        <input v-model="password" type="password" required />
      </div>
      <button :disabled="loading" type="submit">
        {{ loading ? 'در حال ورود...' : 'ورود' }}
      </button>
      <p v-if="error" class="error">{{ error }}</p>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useAuthStore } from '@/stores/authStore';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();

const username = ref('');
const password = ref('');
const loading = ref(false);
const error = ref('');

const handleLogin = async () => {
  loading.value = true;
  error.value = '';

  try {
    const success = await authStore.login(username.value, password.value);
    
    if (success) {
      // ⚠️ CRITICAL RULE: Force Reload Strategy
      // اگر حس کردید State درست آپدیت نمی‌شود، خط زیر را از کامنت درآورید:
      // window.location.href = '/'; 
      
      // روش استاندارد SPA:
      router.push('/');
    }
  } catch (err) {
    error.value = 'نام کاربری یا رمز عبور اشتباه است.';
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.login-container { max-width: 300px; margin: 100px auto; padding: 20px; border: 1px solid #ccc; border-radius: 8px; }
.error { color: red; margin-top: 10px; }
input { display: block; width: 100%; margin-bottom: 10px; padding: 8px; }
button { width: 100%; padding: 10px; cursor: pointer; }
</style>