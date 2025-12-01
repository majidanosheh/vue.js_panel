<template>
  <div class="matrix-page">
    <div class="header">
      <h2>🔑 تنظیم دسترسی‌های نقش</h2>
      <button @click="$router.back()" class="btn-back">بازگشت</button>
    </div>

    <div v-if="roleStore.loading" class="loading">در حال دریافت ماتریس دسترسی‌ها...</div>

    <form v-else @submit.prevent="handleSave">
      <div class="permissions-grid">
        <div v-for="group in roleStore.allPermissionGroups" :key="group.groupName" class="perm-card">
          <h3>{{ group.groupName }}</h3>
          
          <div class="checkbox-list">
            <div v-for="perm in group.permissions" :key="perm.name" class="checkbox-item">
              <label>
                <input 
                  type="checkbox" 
                  :value="perm.name" 
                  v-model="selectedPermissions"
                />
                {{ perm.description }}
              </label>
            </div>
          </div>
        </div>
      </div>

      <div class="actions-bar">
        <button type="submit" class="btn-save" :disabled="roleStore.loading">
          💾 ذخیره تغییرات
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoleStore } from '@/stores/roleStore';
import { useRoute, useRouter } from 'vue-router';

const roleStore = useRoleStore();
const route = useRoute();
const router = useRouter();
const roleId = route.params.id;

const selectedPermissions = ref([]);

onMounted(async () => {
  await roleStore.fetchPermissionMatrix(roleId);
  // پر کردن چک‌باکس‌ها با دسترسی‌های فعلی نقش
  selectedPermissions.value = [...roleStore.rolePermissions];
});

const handleSave = async () => {
  const success = await roleStore.savePermissions(roleId, selectedPermissions.value);
  if (success) {
    alert('دسترسی‌ها با موفقیت بروزرسانی شد! ✅');
    router.push('/roles');
  }
};
</script>

<style scoped>
.matrix-page { padding: 20px; padding-bottom: 80px; }
.header { display: flex; justify-content: space-between; margin-bottom: 20px; }
.permissions-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 20px; }
.perm-card { background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.05); }
.perm-card h3 { margin-top: 0; border-bottom: 2px solid #f1f1f1; padding-bottom: 10px; color: #2c3e50; }
.checkbox-list { display: flex; flex-direction: column; gap: 10px; margin-top: 15px; }
.checkbox-item label { cursor: pointer; display: flex; align-items: center; gap: 10px; }
.checkbox-item input { width: 18px; height: 18px; }

.actions-bar { 
  position: fixed; bottom: 0; left: 0; right: 0; 
  background: white; padding: 15px; 
  box-shadow: 0 -2px 10px rgba(0,0,0,0.1); 
  text-align: left; padding-left: 270px; /* فاصله به اندازه سایدبار */
}
.btn-save { background: #27ae60; color: white; border: none; padding: 10px 30px; border-radius: 4px; font-size: 1rem; cursor: pointer; }
.btn-back { background: #95a5a6; color: white; border: none; padding: 8px 15px; border-radius: 4px; cursor: pointer; }
</style>