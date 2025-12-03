<template>
  <div class="forms-page">
    <div class="header-row">
      <h2>📝 مدیریت فرم‌ساز</h2>
    </div>

    <div class="create-panel" v-can="PERMISSIONS.CREATE_FORMS">
      <h3>✨ ساخت فرم جدید</h3>
      <div class="input-group">
        <input v-model="newTitle" placeholder="عنوان فرم (مثلا: تماس با ما)" />
        <input v-model="newSlug" placeholder="شناسه یکتا/اسلاگ (مثلا: contact-us)" dir="ltr" />
        <button @click="handleCreate" :disabled="formStore.loading">
          {{ formStore.loading ? '...' : 'افزودن +' }}
        </button>
      </div>
      <p v-if="formStore.error" class="error-msg">{{ formStore.error }}</p>
    </div>

    <div v-if="formStore.loading && formStore.forms.length === 0" class="loading-state">
      <span class="loader"></span> در حال بارگذاری...
    </div>

    <div v-else class="grid-container">
      <div v-for="form in formStore.forms" :key="form.Id || form.id" class="form-card">
        <div class="card-header">
          <div class="icon-box">📄</div>
          <div>
            <h3>{{ form.Title || form.title }}</h3>
            <small class="slug">/api/forms/{{ form.ApiSlug || form.apiSlug }}</small>
          </div>
        </div>
        
        <div class="card-body">
          <div class="meta">
            📅 تاریخ ایجاد: {{ new Date(form.CreatedDate || form.createdDate).toLocaleDateString('fa-IR') }}
          </div>
        </div>

        <div class="card-footer">
          <button 
  v-can="PERMISSIONS.EDIT_FORMS"
  @click="$router.push(`/forms/design/${form.Id || form.id}`)" 
  class="btn-design">
  🎨 طراحی
</button>
          
          <button 
            v-can="PERMISSIONS.VIEW_FORMS"
            @click="$router.push(`/forms/submissions/${form.Id || form.id}`)" 
            class="btn-data">
            📊 ورودی‌ها
          </button>

          <button 
            v-can="PERMISSIONS.DELETE_FORMS"
            @click="formStore.deleteForm(form.Id || form.id)" 
            class="btn-delete"
            title="حذف فرم">
            🗑️
          </button>
        </div>
      </div>
    </div>
    
    <div v-if="!formStore.loading && formStore.forms.length === 0" class="empty-state">
      هنوز هیچ فرمی ساخته نشده است.
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useFormStore } from '@/stores/formStore';
import { PERMISSIONS } from '@/constants/permissions';

const formStore = useFormStore();
const newTitle = ref('');
const newSlug = ref('');
const goToSubmissions = (id) => {
  // فعلا فقط لاگ می‌زند تا بعدا صفحه‌اش را بسازیم
  alert('صفحه نمایش ورودی‌های فرم ' + id + ' در فاز بعدی ساخته می‌شود.');
};
onMounted(() => {
  formStore.fetchForms();
});

const handleCreate = async () => {
  if (!newTitle.value || !newSlug.value) return alert('عنوان و اسلاگ الزامی است');
  
  const success = await formStore.createForm(newTitle.value, newSlug.value);
  if (success) {
    // ریست کردن فیلدها
    newTitle.value = '';
    newSlug.value = '';
  }
};
</script>

<style scoped>
.forms-page { padding: 20px; }

/* باکس ایجاد */
.create-panel { background: white; padding: 20px; border-radius: 8px; margin-bottom: 30px; box-shadow: 0 2px 5px rgba(0,0,0,0.05); border-right: 4px solid #27ae60; }
.create-panel h3 { margin-top: 0; font-size: 1rem; color: #555; margin-bottom: 10px; }
.input-group { display: flex; gap: 10px; flex-wrap: wrap; }
.input-group input { flex: 1; min-width: 200px; padding: 10px; border: 1px solid #ddd; border-radius: 4px; }
.input-group button { background: #27ae60; color: white; border: none; padding: 0 25px; border-radius: 4px; cursor: pointer; font-weight: bold; }
.input-group button:disabled { background: #ccc; }
.error-msg { color: crimson; margin-top: 10px; font-size: 0.9rem; }

/* گرید کارت‌ها */
.grid-container { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 20px; }
.form-card { background: white; border-radius: 8px; padding: 15px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); display: flex; flex-direction: column; transition: transform 0.2s; border: 1px solid #eee; }
.form-card:hover { transform: translateY(-3px); box-shadow: 0 5px 15px rgba(0,0,0,0.1); }

.card-header { display: flex; gap: 10px; margin-bottom: 15px; }
.icon-box { background: #f0f2f5; width: 45px; height: 45px; display: flex; align-items: center; justify-content: center; border-radius: 8px; font-size: 1.2rem; }
.card-header h3 { margin: 0 0 5px 0; font-size: 1rem; color: #2c3e50; }
.slug { font-family: monospace; background: #fafafa; padding: 2px 6px; border-radius: 4px; color: #7f8c8d; font-size: 0.8rem; direction: ltr; display: inline-block; }

.card-body { flex: 1; }
.meta { font-size: 0.8rem; color: #95a5a6; }

.card-footer { display: flex; gap: 8px; margin-top: 15px; border-top: 1px solid #f9f9f9; padding-top: 15px; }
.btn-design { background: #3498db; color: white; flex: 1; border: none; border-radius: 4px; padding: 8px; cursor: pointer; }
.btn-data { background: #f1c40f; color: white; flex: 1; border: none; border-radius: 4px; padding: 8px; cursor: pointer; }
.btn-delete { background: #fff; border: 1px solid #e74c3c; color: #e74c3c; border-radius: 4px; padding: 8px 12px; cursor: pointer; }

.loading-state, .empty-state { text-align: center; padding: 40px; color: #7f8c8d; }
</style>