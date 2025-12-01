<template>
  <div class="users-page">
    <div class="header-row">
      <h2>👥 مدیریت کاربران</h2>
      
      <button @click="$router.push('/users/create')" class="btn-add">
        افزودن کاربر جدید +
      </button>
    </div>

    <div v-if="userStore.loading" class="loading-state">
      <span class="loader"></span> در حال دریافت اطلاعات...
    </div>

    <div v-else-if="userStore.error" class="error-state">
      ❌ {{ userStore.error }}
    </div>

    <div v-else class="table-container">
      <table v-if="userStore.users && userStore.users.length > 0">
        <thead>
          <tr>
            <th>#</th>
            <th>نام کاربری</th>
            <th>نام کامل</th>
            <th>ایمیل</th>
            <th>نقش‌ها</th>
            <th>عملیات</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(user, index) in userStore.users" :key="user.id || user.Id || index">
            <td>{{ index + 1 }}</td>
            
            <td class="ltr">{{ user.userName || user.UserName }}</td>
            
            <td>
              {{ user.firstName || user.FirstName }} 
              {{ user.lastName || user.LastName }}
            </td>
            
            <td class="ltr">{{ user.email || user.Email }}</td>

            <td>
              <span v-if="user.roles && user.roles.length" class="badge">
                {{ Array.isArray(user.roles) ? user.roles.join(', ') : user.roles }}
              </span>
              <span v-else class="text-muted">---</span>
            </td>

            <td>
              <button @click="editUser(user.id || user.Id)" class="btn-sm edit">✏️</button>
              <button @click="deleteUser(user.id || user.Id)" class="btn-sm delete">🗑️</button>
            </td>
          </tr>
        </tbody>
      </table>

      <div v-else class="empty-state">
        <p>هیچ کاربری یافت نشد.</p>
      </div>

      </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useUserStore } from '@/stores/userStore';
import { useRouter } from 'vue-router';

const userStore = useUserStore();
const router = useRouter();

onMounted(() => {
  userStore.fetchUsers();
});

const editUser = (id) => {
  router.push(`/users/edit/${id}`);
};

const deleteUser = async (id) => {
  await userStore.deleteUser(id);
};
</script>

<style scoped>
.users-page { padding: 20px; }
.header-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
.btn-add { background: #27ae60; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; }

/* استایل جدول */
.table-container { background: white; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); overflow-x: auto; }
table { width: 100%; border-collapse: collapse; min-width: 600px; }
th, td { padding: 15px; text-align: right; border-bottom: 1px solid #eee; }
th { background: #f8f9fa; color: #555; font-weight: bold; }
tr:hover { background: #f1f1f1; transition: 0.2s; }

.badge { background: #e0f7fa; color: #006064; padding: 4px 8px; border-radius: 12px; font-size: 0.8rem; }
.text-muted { color: #aaa; font-size: 0.8rem; }
.ltr { direction: ltr; text-align: left; font-family: monospace; }

.btn-sm { padding: 5px 10px; margin-left: 5px; border: 1px solid #ddd; border-radius: 4px; cursor: pointer; background: white; }
.btn-sm.edit { color: #f39c12; border-color: #f39c12; }
.btn-sm.delete { color: #e74c3c; border-color: #e74c3c; }

.loading-state, .error-state, .empty-state { text-align: center; padding: 40px; color: #666; }
.error-state { color: crimson; background: #fff5f5; border-radius: 8px; }
</style>