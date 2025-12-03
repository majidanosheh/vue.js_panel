<template>
  <div class="submissions-page">
    <div class="header-row">
      <h2>📊 ورودی‌های فرم</h2>
      <div class="actions">
        <button @click="handleExport" class="btn-export">📥 دانلود اکسل (CSV)</button>
        <button @click="$router.back()" class="btn-back">بازگشت</button>
      </div>
    </div>

    <div v-if="formStore.loading" class="loading">در حال بارگذاری داده‌ها...</div>
    
    <div v-else-if="formStore.gridData.rows.length === 0" class="empty-state">
      هنوز هیچ داده‌ای برای این فرم ثبت نشده است.
    </div>

    <div v-else class="table-responsive">
      <table class="data-table">
        <thead>
          <tr>
            <th v-for="header in formStore.gridData.headers" :key="header.name">
              {{ header.label }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, index) in formStore.gridData.rows" :key="index">
            <td v-for="header in formStore.gridData.headers" :key="header.name">
              {{ row[header.name] || '-' }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useFormStore } from '@/stores/formStore';

const route = useRoute();
const formStore = useFormStore();
const formId = route.params.id;

onMounted(() => {
  formStore.fetchSubmissions(formId);
});

const handleExport = () => {
  formStore.downloadExport(formId);
};
</script>

<style scoped>
.submissions-page { padding: 20px; }
.header-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
.actions { display: flex; gap: 10px; }

.btn-export { background: #27ae60; color: white; border: none; padding: 8px 15px; border-radius: 4px; cursor: pointer; }
.btn-back { background: #95a5a6; color: white; border: none; padding: 8px 15px; border-radius: 4px; cursor: pointer; }

.table-responsive { overflow-x: auto; background: white; border-radius: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.05); }
.data-table { width: 100%; border-collapse: collapse; white-space: nowrap; }
.data-table th, .data-table td { padding: 12px 15px; text-align: right; border-bottom: 1px solid #eee; }
.data-table th { background: #f8f9fa; color: #555; font-weight: bold; }
.data-table tr:hover { background: #f1f1f1; }
.empty-state { text-align: center; padding: 50px; color: #777; background: white; border-radius: 8px; }
.loading { text-align: center; padding: 20px; }
</style>