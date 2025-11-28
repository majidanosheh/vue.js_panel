<template>
  <div class="login-wrapper">
    <div class="login-box">
      <h2>ورود به سیستم</h2>
      <form @submit.prevent="handleLogin">
        <input v-model="username" type="text" placeholder="نام کاربری" required />
        <input v-model="password" type="password" placeholder="رمز عبور" required />
        <button :disabled="authStore.loading" type="submit">
          {{ authStore.loading ? '...' : 'ورود' }}
        </button>
        <p v-if="authStore.error" class="error">{{ authStore.error }}</p>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useAuthStore } from '@/stores/authStore';

const authStore = useAuthStore();
const username = ref('');
const password = ref('');

const handleLogin = async () => {
  try {
    const success = await authStore.login(username.value, password.value);
    if (success) window.location.href = '/'; // ریلود سخت برای امنیت
  } catch (e) { /* خطا در استور هندل شده */ }
};
</script>

<style scoped>
.login-wrapper { height: 100vh; display: flex; align-items: center; justify-content: center; background: #f0f2f5; }
.login-box { background: white; padding: 2rem; border-radius: 8px; width: 300px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); text-align: center; }
input { width: 100%; padding: 10px; margin: 10px 0; border: 1px solid #ddd; border-radius: 4px; box-sizing: border-box;}
button { width: 100%; padding: 10px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer; }
button:disabled { background: #ccc; }
.error { color: red; margin-top: 10px; font-size: 0.9rem; }
</style>