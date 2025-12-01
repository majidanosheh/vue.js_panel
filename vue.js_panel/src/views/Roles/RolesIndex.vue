<template>
  <div class="roles-page">
    <h2>🛡️ مدیریت نقش‌ها</h2>

    <div v-if="roleStore.loading" class="loading">در حال بارگذاری...</div>

    <div v-else class="table-container">
      <table>
        <thead>
          <tr>
            <th>نام نقش</th>
            <th>نوع</th>
            <th>عملیات</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="role in roleStore.roles" :key="role.id">
            <td>{{ role.displayName || role.name }}</td>
            <td>
              <span v-if="role.name === 'SuperAdmin'" class="badge super">سیستمی (کامل)</span>
              <span v-else class="badge normal">عادی</span>
            </td>
            <td>
              <button 
                v-if="role.name !== 'SuperAdmin'" 
                @click="$router.push(`/roles/permissions/${role.id}`)" 
                class="btn-perm">
                🔑 تنظیم دسترسی‌ها
              </button>
              <span v-else class="text-muted">غیرقابل تغییر</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useRoleStore } from '@/stores/roleStore';

const roleStore = useRoleStore();

onMounted(() => {
  roleStore.fetchRoles();
});
</script>

<style scoped>
.roles-page { padding: 20px; }
table { width: 100%; border-collapse: collapse; background: white; box-shadow: 0 2px 5px rgba(0,0,0,0.05); }
th, td { padding: 15px; text-align: right; border-bottom: 1px solid #eee; }
.badge { padding: 4px 8px; border-radius: 4px; font-size: 0.8rem; }
.badge.super { background: #e74c3c; color: white; }
.badge.normal { background: #3498db; color: white; }
.btn-perm { background: #2c3e50; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer; }
.text-muted { color: #aaa; font-size: 0.9rem; }
</style>