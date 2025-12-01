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
        <p v-if="store.form.description" class="desc">{{ store.form.description }}</p>
      </div>

      <form @submit.prevent="handleSubmit">
        
        <div v-for="field in store.form.fields" :key="field.id" class="form-field">
          <label :for="field.name">
            {{ field.label }}
            <span v-if="field.isRequired" class="req">*</span>
          </label>
          
          <div v-if="field.helpText" class="help-text">{{ field.helpText }}</div>

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
            <label :for="field.name" class="inline">{{ field.placeholder || 'بله' }}</label>
          </div>

          <select 
            v-else-if="field.fieldType === 'Select'"
            :id="field.name"
            v-model="answers[field.name]"
            :required="field.isRequired"
            class="input-control"
          >
            <option value="" disabled selected>انتخاب کنید...</option>
            <option 
              v-for="(opt, idx) in (field.options ? field.options.split('\n') : [])" 
              :key="idx" 
              :value="opt.trim()">
              {{ opt.trim() }}
            </option>
          </select>

          <div v-else-if="field.fieldType === 'Radio'" class="radio-group">
            <div 
              v-for="(opt, idx) in (field.options ? field.options.split('\n') : [])" 
              :key="idx" 
              class="radio-item"
            >
              <input 
                type="radio" 
                :name="field.name" 
                :id="`${field.name}_${idx}`" 
                :value="opt.trim()"
                v-model="answers[field.name]"
                :required="field.isRequired"
              />
              <label :for="`${field.name}_${idx}`">{{ opt.trim() }}</label>
            </div>
          </div>

          <input 
            v-else-if="field.fieldType === 'Date'"
            type="date" 
            :id="field.name"
            v-model="answers[field.name]"
            :required="field.isRequired"
            class="input-control"
          />

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
import { reactive, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { usePublicFormStore } from '@/stores/publicFormStore';

const route = useRoute();
const store = usePublicFormStore();
const answers = reactive({});
const boolAnswers = reactive({}); 

onMounted(() => {
  const slug = route.params.slug;
  if (slug) store.loadForm(slug);
});

const handleSubmit = async () => {
  const finalData = { ...answers };
  
  // تبدیل چک‌باکس‌های بولین به رشته برای ارسال
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
  font-family: 'Tahoma', sans-serif; line-height: 1.6;
}
.form-card { background: white; padding: 40px; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); }
.form-header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #f5f5f5; padding-bottom: 15px; }
.form-header h1 { margin: 0 0 10px 0; color: #2c3e50; }
.desc { color: #666; font-size: 0.95rem; }

.form-field { margin-bottom: 25px; }
.form-field label { display: block; margin-bottom: 8px; font-weight: bold; color: #34495e; }
.help-text { font-size: 0.85rem; color: #7f8c8d; margin-top: -5px; margin-bottom: 8px; }
.req { color: #e74c3c; margin-right: 3px; }

.input-control { 
  width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 6px; 
  font-size: 1rem; transition: border 0.3s; font-family: inherit; box-sizing: border-box;
}
.input-control:focus { border-color: #3498db; outline: none; box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1); }

/* استایل چک‌باکس */
.checkbox-wrap { display: flex; align-items: center; gap: 10px; margin-top: 5px; }
.checkbox-wrap input { width: 20px; height: 20px; cursor: pointer; accent-color: #27ae60; }
.inline { margin-bottom: 0 !important; font-weight: normal !important; cursor: pointer; }

/* استایل رادیو باتن */
.radio-group { display: flex; flex-direction: column; gap: 10px; margin-top: 5px; }
.radio-item { display: flex; align-items: center; gap: 8px; }
.radio-item input { width: 18px; height: 18px; cursor: pointer; accent-color: #27ae60; }
.radio-item label { margin-bottom: 0; font-weight: normal; cursor: pointer; }

.btn-submit { 
  width: 100%; padding: 14px; background: #27ae60; color: white; border: none; 
  border-radius: 6px; font-size: 1.1rem; font-weight: bold; cursor: pointer; margin-top: 10px; 
  transition: background 0.2s;
}
.btn-submit:hover { background: #219150; }
.btn-submit:disabled { background: #bdc3c7; cursor: not-allowed; }

.status-box { text-align: center; padding: 50px; background: white; border-radius: 12px; box-shadow: 0 4px 10px rgba(0,0,0,0.05); }
.status-box.error { color: #c62828; background: #ffebee; }
.status-box.success { color: #2e7d32; background: #e8f5e9; }
.icon { font-size: 3rem; margin-bottom: 10px; }

.field-error { color: #e74c3c; font-size: 0.85rem; margin-top: 5px; }
.form-error { color: #c0392b; background: #fadbd8; padding: 10px; border-radius: 4px; margin-bottom: 15px; text-align: center; }
</style>