<template>
  <div class="dashboard">
    <h1>📊 داشبورد مدیریتی</h1>
    
    <div class="debug-box" style="direction: ltr; text-align: left; background: #333; color: #0f0; padding: 20px; margin: 20px 0; border-radius: 8px;">
      <h3>👮 User Debug Info:</h3>
      <pre>{{ userStore.user }}</pre>
      <hr style="border-color: #555;">
      <p><strong>Is Authenticated:</strong> {{ userStore.isAuthenticated }}</p>
      <p><strong>Detected Roles:</strong> {{ userStore.user?.Roles || userStore.user?.roles || 'NONE' }}</p>
    </div>
    <div class="stats-grid">
      <div class="card">
        <h3>وضعیت سیستم</h3>
        <p>✅ آنلاین</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from '@/stores/authStore';
const userStore = useAuthStore();
</script>