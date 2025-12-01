<template>
  <div class="public-container">
    
    <div v-if="store.loading" class="status-box loading">
      <span class="spinner"></span> در حال دریافت فرم...
    </div>

    <div v-else-if="store.error && !store.form" class="status-box error">
      ⛔ {{ store.error }}
    </div>

    <div v-else-if="store.successMessage" class="status-box success">
      <div class="icon">🎉</div>
      <h3>ثبت شد!</h3>
      <p>{{ store.successMessage }}</p>
      <button @click="reloadPage">ارسال پاسخ جدید</button>
    </div>

    <div v-else-if="store.form" class="form-card">
      <div class="form-header">
        <h1>{{ store.form.name }}</h1>
        </div>

      <form @submit.prevent="handleSubmit">
        
        <div v-for="field in store.form.fields" :key="field.id" class="form-field">
          <label :for="field.name">
            {{ field.label }}
            <span v-if="field.isRequired" class="req">*</span>
          </label>

          <input 
            v-if="field.fieldType === 'Text'"
            type="text" 
            :id="field.name"
            v-model="answers[field.name]"
            :placeholder="field.placeholder"
            :required="field.isRequired"
            class="input-control"
          />

          <textarea 
            v-else-if="field.fieldType === 'TextArea'"
            :id="field.name"
            v-model="answers[field.name]"
            :placeholder="field.placeholder"
            :required="field.isRequired"
            class="input-control"
            rows="4"
          ></textarea>

          <input 
            v-else-if="field.fieldType === 'Number'"
            type="number" 
            :id="field.name"
            v-model="answers[field.name]"
            :required="field.isRequired"
            class="input-control"
          />

          <div v-else-if="field.fieldType === 'Checkbox'" class="checkbox-wrap">
            <input 
              type="checkbox" 
              :id="field.name"
              v-model="boolAnswers[field.name]" 
            />
            <label :for="field.name" class="inline">بله / خیر</label>
          </div>

          <div v-if="store.validationErrors[field.name]" class="field-error">
             {{ store.validationErrors[field.name] }}
          </div>
        </div>

        <div v-if="store.error" class="form-error">
          {{ store.error }}
        </div>

        <div class="form-actions">
          <button type="submit" class="btn-submit" :disabled="store.submitting">
            {{ store.submitting ? 'در حال ارسال...' : (store.form.submitButtonText || 'ارسال') }}
          </button>
        </div>

      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import { usePublicFormStore } from '@/stores/publicFormStore';

const route = useRoute();
const store = usePublicFormStore();
const answers = reactive({});
const boolAnswers = reactive({}); // برای مدیریت چک‌باکس‌ها

onMounted(() => {
  const slug = route.params.slug;
  if (slug) store.loadForm(slug);
});

const handleSubmit = async () => {
  // تبدیل چک‌باکس‌ها به رشته "true"/"false" برای ارسال به سرور
  // چون PublicFormSubmissionRequest دیکشنری <string, string> می‌گیرد
  const finalData = { ...answers };
  
  for (const key in boolAnswers) {
    finalData[key] = boolAnswers[key] ? 'true' : 'false';
  }

  const slug = route.params.slug;
  await store.submitForm(slug, finalData);
};

const reloadPage = () => {
  window.location.reload();
};
</script>

<style scoped>
.public-container { 
  max-width: 800px; margin: 40px auto; padding: 20px; 
  font-family: 'Tahoma', sans-serif; 
}
.form-card { background: white; padding: 40px; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); }
.form-header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #f5f5f5; padding-bottom: 15px; }
.form-header h1 { margin: 0; color: #333; }

.form-field { margin-bottom: 20px; }
.form-field label { display: block; margin-bottom: 8px; font-weight: bold; color: #444; }
.req { color: red; margin-right: 3px; }

.input-control { 
  width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 6px; 
  font-size: 1rem; transition: border 0.3s; font-family: inherit;
}
.input-control:focus { border-color: #3498db; outline: none; }

.checkbox-wrap { display: flex; align-items: center; gap: 10px; }
.checkbox-wrap input { width: 20px; height: 20px; cursor: pointer; }
.inline { margin-bottom: 0 !important; font-weight: normal !important; cursor: pointer; }

.btn-submit { 
  width: 100%; padding: 14px; background: #27ae60; color: white; border: none; 
  border-radius: 6px; font-size: 1.1rem; font-weight: bold; cursor: pointer; margin-top: 10px; 
}
.btn-submit:disabled { background: #ccc; cursor: not-allowed; }

.status-box { text-align: center; padding: 50px; background: white; border-radius: 12px; box-shadow: 0 4px 10px rgba(0,0,0,0.05); }
.status-box.error { color: #c62828; background: #ffebee; }
.status-box.success { color: #2e7d32; background: #e8f5e9; }
.field-error { color: #d32f2f; font-size: 0.85rem; margin-top: 5px; }
.form-error { color: #d32f2f; background: #ffebee; padding: 10px; border-radius: 4px; margin-bottom: 15px; text-align: center; }
</style>