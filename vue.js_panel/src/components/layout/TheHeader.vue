<template>
  <header class="top-header">
    <div class="user-info">
      <span v-if="authStore.user">
        👤 {{ authStore.user.FirstName || authStore.user.firstName || 'کاربر' }} 
        {{ authStore.user.LastName || authStore.user.lastName || '' }}
      </span>
      <span v-else>مدیر سیستم</span>
    </div>
    
    <button @click="handleLogout" class="btn-logout">
      خروج 🚪
    </button>
  </header>
</template>

<script setup>
import { useAuthStore } from '@/stores/authStore';

const authStore = useAuthStore();

const handleLogout = () => {
  authStore.logout();
};
</script>

<style scoped>
.top-header {
  height: 60px;
  background: #fff;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  margin-bottom: 20px;
  box-shadow: 0 1px 2px rgba(0,0,0,0.05);
}

.user-info {
  font-weight: bold;
  color: #555;
  font-size: 0.9rem;
}

.btn-logout {
  background: #ff4757;
  color: white;
  border: none;
  padding: 6px 15px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.85rem;
  transition: background 0.2s;
}

.btn-logout:hover {
  background: #ff6b81;
}
</style>