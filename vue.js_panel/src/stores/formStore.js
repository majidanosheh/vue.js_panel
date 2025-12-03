// src/stores/formStore.js
// نسخه نهایی و کامل (حل مشکل رفرش + حل مشکل ویرایش)
import { defineStore } from 'pinia';
import { ref } from 'vue';
import { formService } from '@/api/form.service';

export const useFormStore = defineStore('formStore', () => {
  const forms = ref([]);
  const currentForm = ref(null);
  const loading = ref(false);
  const error = ref(null);
const gridData = ref({ headers: [], rows: [] });

  // 1. دریافت لیست فرم‌ها
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

  // 2. دریافت فرم (با حل مشکل رفرش)
  async function fetchFormById(id) {
    loading.value = true;
    currentForm.value = null;
    try {
      const data = await formService.getById(id);
      
      // نرمال‌سازی فیلدها (پشتیبانی از حروف بزرگ و کوچک)
      const rawFields = data.fields || data.Fields || [];
      
      data.fields = rawFields.map(f => ({
        id: f.id || f.Id,
        label: f.label || f.Label || f.title || f.Title,
        name: f.name || f.Name,
        fieldType: f.fieldType || f.FieldType,
        isRequired: f.isRequired || f.IsRequired || false,
        placeholder: f.placeholder || f.Placeholder || '',
        options: f.options || f.Options || '',
        order: f.order || f.Order || 0
      }));

      currentForm.value = data;
    } catch (err) {
      console.error(err);
      error.value = 'خطا در بارگذاری فرم';
    } finally {
      loading.value = false;
    }
  }

  // 3. ایجاد فرم
  async function createForm(title, slug) {
    loading.value = true;
    error.value = null;
    const cleanSlug = slug.trim().toLowerCase().replace(/\s+/g, '-');

    try {
      const newForm = await formService.create({ 
        name: title,
        apiSlug: cleanSlug 
      });
      
      if (newForm) forms.value.unshift(newForm);
      return true;
    } catch (err) {
      if (err.response?.status === 500) error.value = 'خطای داخلی سرور (اسلاگ تکراری).';
      else if (err.response?.data?.errors) error.value = Object.values(err.response.data.errors).flat().join(' | ');
      else error.value = err.response?.data?.Message || 'خطا در ساخت فرم';
      return false;
    } finally {
      loading.value = false;
    }
  }

  // 4. حذف فرم
  async function deleteForm(id) {
    if (!confirm('حذف شود؟')) return;
    loading.value = true;
    try {
      await formService.delete(id);
      forms.value = forms.value.filter(f => f.Id !== id && f.id !== id);
    } catch (e) { alert('خطا در حذف'); } 
    finally { loading.value = false; }
  }

  // 5. افزودن فیلد
async function addFieldToForm(formId, fieldType) {
    try {
      const randomSuffix = Math.floor(Math.random() * 10000);
      const safeName = `${fieldType.toLowerCase()}_${randomSuffix}`;

      // تعیین آپشن‌های پیش‌فرض برای فیلدهای انتخابی
      let defaultOptions = '';
      if (fieldType === 'Select' || fieldType === 'Radio' || fieldType === 'CheckboxGroup') {
        defaultOptions = 'گزینه ۱\nگزینه ۲\nگزینه ۳';
      }

      const payload = {
        label: `سوال جدید ${randomSuffix}`,
        name: safeName, 
        fieldType: fieldType,
        isRequired: false,
        order: (currentForm.value?.fields?.length || 0) + 1,
        options: defaultOptions, // ✅ مقداردهی اولیه هوشمند
        placeholder: '' 
      };

      const newField = await formService.addField(formId, payload);
      
      if (newField) {
        // نرمال‌سازی و افزودن به لیست (همان لاجیک قبلی)
        const normalizedField = {
            id: newField.id || newField.Id,
            label: newField.label || newField.Label,
            name: newField.name || newField.Name,
            fieldType: newField.fieldType || newField.FieldType,
            isRequired: newField.isRequired || newField.IsRequired,
            placeholder: newField.placeholder || newField.Placeholder,
            options: newField.options || newField.Options
        };

        const index = currentForm.value.fields.findIndex(f => f.name === safeName || (f.id && String(f.id).startsWith('temp_')));
        if (index !== -1) currentForm.value.fields[index] = normalizedField;
        else currentForm.value.fields.push(normalizedField);
      }
      return true;
    } catch (err) {
      // ... (همان مدیریت خطای قبلی)
      console.error(err);
      return false;
    }
  }

  // 6. حذف فیلد
  async function deleteField(fieldId) {
    if(!confirm('حذف شود؟')) return;
    try {
      await formService.deleteField(fieldId);
      if (currentForm.value) {
        currentForm.value.fields = currentForm.value.fields.filter(f => f.id !== fieldId && f.Id !== fieldId);
      }
    } catch (e) { console.error(e); }
  }

  // 7. ویرایش فیلد (بخش حیاتی اصلاح شده)
  async function updateFieldProperties(fieldId, updates) {
    try {
      //  پیدا کردن فیلد فعلی برای گرفتن Name و FieldType
      const existingField = currentForm.value.fields.find(f => f.id === fieldId || f.Id === fieldId);
      
      if (!existingField) {
        alert('فیلد پیدا نشد!');
        return false;
      }

      //  ساخت پکیج کامل (فیلدهای اجباری + تغییرات)
      const fullPayload = {
        // فیلدهای اجباری که بک‌اند می‌خواهد (از دیتای موجود می‌خوانیم)
        name: existingField.name,
        fieldType: existingField.fieldType,
        order: existingField.order || 0,
        
        // فیلدهای جدید (از فرم ویرایش می‌آیند)
        label: updates.label,
        isRequired: updates.isRequired,
        placeholder: updates.placeholder,
        options: updates.options
      };

      console.log('📤 Sending Full Update:', fullPayload);

      const updatedField = await formService.updateField(fieldId, fullPayload);
      
      // آپدیت لوکال
      if (currentForm.value && updatedField) {
        const index = currentForm.value.fields.indexOf(existingField);
        if (index !== -1) {
          // مرج کردن پاسخ سرور با دیتای موجود
          currentForm.value.fields[index] = {
             ...existingField,
             label: updatedField.label || updatedField.Label,
             isRequired: updatedField.isRequired || updatedField.IsRequired,
             placeholder: updatedField.placeholder || updatedField.Placeholder,
             options: updatedField.options || updatedField.Options
          };
        }
      }
      return true;
    } catch (err) {
      console.error('Update Error:', err.response?.data);
      if (err.response?.data?.errors) {
         alert(Object.values(err.response.data.errors).flat().join('\n'));
      } else {
         alert(err.response?.data?.Message || 'خطا در ویرایش فیلد');
      }
      return false;
    }
  }
  //8. دریافت ورودی ها 
  async function fetchSubmissions(formId) {
    loading.value = true;
    error.value = null;
    // پاکسازی داده‌های قبلی
    gridData.value = { headers: [], rows: [] };
    
    try {
      const data = await formService.getSubmissions(formId);
      gridData.value = data;
    } catch (err) {
      console.error(err);
      error.value = 'خطا در دریافت ورودی‌ها';
    } finally {
      loading.value = false;
    }
  }
  //9.دانلود خروجی
async function downloadExport(formId) {
    try {
      const blob = await formService.exportCsv(formId);
      // ایجاد لینک دانلود موقت در مرورگر
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `export_${formId}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      alert('خطا در دانلود فایل');
    }
  }
  return { 
    forms, currentForm, loading, error, 
    fetchForms, fetchFormById, 
    createForm, deleteForm, 
    addFieldToForm, deleteField, updateFieldProperties 
  };
});