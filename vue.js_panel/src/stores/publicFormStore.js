// src/stores/publicFormStore.js
import { defineStore } from 'pinia';
import { ref } from 'vue';
import { publicFormService } from '@/api/public-form.service';

export const usePublicFormStore = defineStore('publicForm', () => {
  const form = ref(null);
  const loading = ref(false);
  const submitting = ref(false);
  const error = ref(null);
  const successMessage = ref('');
  const validationErrors = ref({}); // برای نمایش خطاهای سمت سرور

  // 1. لود کردن فرم
  async function loadForm(slug) {
    loading.value = true;
    error.value = null;
    form.value = null;
    try {
      const data = await publicFormService.getBySlug(slug);
      
      // نرمال‌سازی فیلدها (تطبیق حروف بزرگ و کوچک احتمالی)
      if (data.fields) {
        data.fields = data.fields.map(f => ({
          ...f,
          // اطمینان از اینکه فیلدها نام استاندارد دارند
          name: f.name || f.Name,
          label: f.label || f.Label,
          fieldType: f.fieldType || f.FieldType,
          isRequired: f.isRequired || f.IsRequired,
          options: f.options || f.Options
        }));
      }
      
      form.value = data;
    } catch (err) {
      console.error(err);
      error.value = err.response?.data?.Message || 'فرم مورد نظر یافت نشد.';
    } finally {
      loading.value = false;
    }
  }

  // 2. ارسال فرم
  async function submitForm(slug, answers) {
    submitting.value = true;
    error.value = null;
    successMessage.value = '';
    validationErrors.value = {};

    try {
      // ⚠️ ساختار دقیق طبق PublicFormSubmissionRequest.cs در بک‌اند
      const payload = {
        submissionData: answers // دیکشنری <string, string>
      };

      const result = await publicFormService.submit(slug, payload);
      
      successMessage.value = result.message || 'اطلاعات با موفقیت ثبت شد.';
      return true;

    } catch (err) {
      console.error(err);
      
      if (err.response?.status === 400 && err.response.data.errors) {
        // اگر خطای ولیدیشن (مثلاً فیلد اجباری) برگشت
        validationErrors.value = err.response.data.errors;
        error.value = 'لطفاً خطاهای فرم را بررسی کنید.';
      } else {
        error.value = err.response?.data?.Message || 'خطا در ثبت اطلاعات.';
      }
      return false;

    } finally {
      submitting.value = false;
    }
  }

  return { 
    form, 
    loading, 
    submitting, 
    error, 
    successMessage, 
    validationErrors,
    loadForm, 
    submitForm 
  };
});