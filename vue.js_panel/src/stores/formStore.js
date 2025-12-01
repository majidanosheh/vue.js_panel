// src/stores/formStore.js
// نسخه اصلاح شده (تغییر title به name)
import { defineStore } from 'pinia';
import { ref } from 'vue';
import { formService } from '@/api/form.service';

export const useFormStore = defineStore('formStore', () => {
  const forms = ref([]);
  const loading = ref(false);
  const error = ref(null);

  // دریافت لیست
  async function fetchForms() {
    loading.value = true;
    error.value = null;
    try {
      const data = await formService.getAll();
      forms.value = data || [];
    } catch (err) {
      console.error(err);
      error.value = 'خطا در دریافت لیست فرم‌ها';
    } finally {
      loading.value = false;
    }
  }

  // ایجاد فرم
  async function createForm(title, slug) {
    loading.value = true;
    error.value = null;

    // تمیزکاری اسلاگ
    const cleanSlug = slug.trim().toLowerCase().replace(/\s+/g, '-');

    try {
      // ⚠️ FIX: تغییر کلید 'title' به 'name' طبق ارور سرور
      const payload = { 
        name: title,        // <--- تغییر حیاتی اینجاست
        apiSlug: cleanSlug 
      };

      console.log('📤 Sending:', payload); // جهت اطمینان در کنسول

      const newForm = await formService.create(payload);
      
      if (newForm) {
        forms.value.unshift(newForm);
      }
      return true;

    } catch (err) {
      console.error('Create Form Error:', err);
      
      // مدیریت هوشمند خطای 500
      if (err.response?.status === 500) {
        // چون تنها دلیل 500 در اینجا تکراری بودن اسلاگ است:
        error.value = 'خطا: این "شناسه (Slug)" قبلاً استفاده شده است. لطفاً یک شناسه دیگر انتخاب کنید.';
      } 
      else if (err.response?.data?.errors) {
        error.value = Object.values(err.response.data.errors).flat().join(' | ');
      } 
      else {
        error.value = err.response?.data?.Message || 'خطا در برقراری ارتباط با سرور';
      }
      return false;
    } finally {
      loading.value = false;
    }
  }

  // حذف فرم
  async function deleteForm(id) {
    if (!confirm('آیا از حذف این فرم اطمینان دارید؟ تمام داده‌های آن حذف خواهد شد.')) return;

    loading.value = true;
    try {
      await formService.delete(id);
      forms.value = forms.value.filter(f => f.Id !== id && f.id !== id);
    } catch (err) {
      console.error(err);
      alert('خطا در حذف فرم');
    } finally {
      loading.value = false;
    }
  }

  return { forms, loading, error, fetchForms, createForm, deleteForm };
});