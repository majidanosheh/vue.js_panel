<template>
  <div class="roles-page">
    <div class="header-row">
      <h2>🛡️ مدیریت نقش‌ها</h2>
      
      <button 
        v-can="PERMISSIONS.CREATE_ROLES" 
        @click="openCreateModal" 
        class="btn-add">
        افزودن نقش جدید +
      </button>
    </div>

    <div v-if="roleStore.loading" class="loading">در حال بارگذاری...</div>

    <div v-else class="table-container">
      <table>
        <thead>
          <tr>
            <th>نام نقش</th>
            <th>نام نمایشی</th>
            <th>نوع</th>
            <th>عملیات</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="role in roleStore.roles" :key="role.id || role.Id">
            <td class="ltr">{{ role.name || role.Name }}</td>
            <td>{{ role.displayName || role.DisplayName }}</td>
            <td>
              <span v-if="role.isSystemRole || role.IsSystemRole" class="badge super">سیستمی</span>
              <span v-else class="badge normal">عادی</span>
            </td>
            <td>
              <button 
                @click="goToPermissions(role.id || role.Id)" 
                class="btn-perm" 
                title="تنظیم دسترسی‌ها">
                🔑
              </button>

              <button 
                v-if="!(role.isSystemRole || role.IsSystemRole)"
                v-can="PERMISSIONS.DELETE_ROLES"
                @click="roleStore.deleteRole(role.id || role.Id)" 
                class="btn-delete"
                title="حذف نقش">
                🗑️
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="showCreateModal" class="modal-overlay" @click.self="showCreateModal = false">
      <div class="modal-content">
        <h3>تعریف نقش جدید</h3>
        <form @submit.prevent="handleCreate">
          <div class="form-group">
            <label>نام انگلیسی (مثال: Support)</label>
            <input v-model="newRole.name" required class="ltr-input" placeholder="Letters only" />
          </div>
          <div class="form-group">
            <label>نام فارسی (مثال: پشتیبان)</label>
            <input v-model="newRole.displayName" required placeholder="نام قابل نمایش" />
          </div>
          <div class="modal-actions">
            <button type="button" @click="showCreateModal = false" class="btn-cancel">انصراف</button>
            <button type="submit" class="btn-save">ذخیره</button>
          </div>
        </form>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useRoleStore } from '@/stores/roleStore';
import { useRouter } from 'vue-router';
import { PERMISSIONS } from '@/constants/permissions';

const roleStore = useRoleStore();
const router = useRouter();

const showCreateModal = ref(false);
const newRole = reactive({ name: '', displayName: '' });

onMounted(() => {
  roleStore.fetchRoles();
});

const openCreateModal = () => {
  showCreateModal.value = true;
};

const handleCreate = async () => {
  const success = await roleStore.createRole(newRole.name, newRole.displayName);
  if (success) {
    showCreateModal.value = false;
    newRole.name = '';
    newRole.displayName = '';
  }
};

const goToPermissions = (id) => {
  router.push(`/roles/permissions/${id}`);
};
</script>

<style scoped>
.roles-page { padding: 20px; }
.header-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
.btn-add { background: #27ae60; color: white; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer; }

.table-container { background: white; border-radius: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.05); }
table { width: 100%; border-collapse: collapse; }
th, td { padding: 15px; text-align: right; border-bottom: 1px solid #eee; }
.ltr { direction: ltr; text-align: left; font-family: monospace; }

.btn-perm { background: #f39c12; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer; margin-left: 5px; }
.btn-delete { background: #c0392b; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer; }
.badge { padding: 2px 8px; border-radius: 12px; font-size: 0.8rem; color: white; }
.badge.super { background: #8e44ad; }
.badge.normal { background: #3498db; }

/* استایل مودال */
.modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 2000; }
.modal-content { background: white; padding: 25px; border-radius: 8px; width: 400px; box-shadow: 0 4px 15px rgba(0,0,0,0.2); }
.form-group { margin-bottom: 15px; }
.form-group label { display: block; margin-bottom: 5px; font-weight: bold; }
.form-group input { width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px; box-sizing: border-box; }
.ltr-input { direction: ltr; text-align: left; }
.modal-actions { display: flex; justify-content: flex-end; gap: 10px; margin-top: 20px; }
.btn-save { background: #27ae60; color: white; border: none; padding: 8px 20px; border-radius: 4px; cursor: pointer; }
.btn-cancel { background: #95a5a6; color: white; border: none; padding: 8px 20px; border-radius: 4px; cursor: pointer; }
</style>