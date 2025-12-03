<template>
  <header class="top-header">
    <div class="user-info">
      <span v-if="user">
        👤 {{ user.FullName || user.fullName || user.Email || user.email || 'مدیر سیستم' }}
      </span>
      <span v-else>کاربر مهمان</span>
    </div>
    
    <button @click="handleLogout" class="btn-logout">
      خروج 🚪
    </button>
  </header>
</template>

<script setup>
import { useAuthStore } from '@/stores/authStore';
import { storeToRefs } from 'pinia';

const authStore = useAuthStore();
// استفاده از storeToRefs برای حفظ واکنش‌گرایی
const { user } = storeToRefs(authStore);

const handleLogout = () => {
  authStore.logout();
};
</script>

<style scoped>
.top-header {
  height: 60px;
  background: #fff;
  box-shadow: 0 2px 5px rgba(0,0,0,0.05);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  margin-bottom: 20px;
}
.user-info { font-weight: bold; color: #555; font-size: 0.95rem; }
.btn-logout {
  background: #ff4757; color: white; border: none;
  padding: 6px 15px; border-radius: 4px; cursor: pointer;
  font-size: 0.85rem; transition: 0.2s;
}
.btn-logout:hover { background: #ff6b81; }
</style>