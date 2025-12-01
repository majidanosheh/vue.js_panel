<template>
  <div class="designer-container">
    
    <aside class="sidebar-panel">
      
      <div v-if="!selectedField" class="toolbox">
        <h3>🧩 جعبه ابزار</h3>
        <p class="hint">برای افزودن بکشید، برای ویرایش روی سوال کلیک کنید.</p>
        
        <VueDraggable 
          class="tools-list" 
          :list="toolItems" 
          :group="{ name: 'fields', pull: 'clone', put: false }" 
          :sort="false"
          :clone="cloneField"
          item-key="fieldType"
        >
          <template #item="{ element }">
            <div class="tool-item">
              <span class="icon">{{ element.icon }}</span>
              <span>{{ element.label }}</span>
            </div>
          </template>
        </VueDraggable>
      </div>

      <div v-else class="properties-panel">
        <div class="panel-header">
          <h3>⚙️ تنظیمات سوال</h3>
          <button @click="selectedField = null" class="btn-close">✖</button>
        </div>

        <form @submit.prevent="saveProperties">
          <div class="form-group">
            <label>عنوان سوال (Label)</label>
            <input v-model="selectedField.label" type="text" required />
          </div>

          <div class="form-group">
            <label>متن راهنما (Placeholder)</label>
            <input v-model="selectedField.placeholder" type="text" />
          </div>

          <div class="form-group checkbox-row">
            <input v-model="selectedField.isRequired" type="checkbox" id="req" />
            <label for="req">پاسخ اجباری باشد</label>
          </div>

          <div v-if="selectedField.fieldType === 'Checkbox' || selectedField.fieldType === 'Select'" class="form-group">
            <label>گزینه‌ها (با کاما جدا کنید)</label>
            <textarea v-model="selectedField.options" placeholder="گزینه ۱, گزینه ۲..."></textarea>
          </div>
<div v-if="['Select', 'Radio'].includes(selectedField.fieldType)" class="form-group">
            <label>گزینه‌ها (هر گزینه در یک خط)</label>
            <textarea 
              v-model="selectedField.options" 
              rows="5" 
              placeholder="مرد&#10;زن&#10;سایر"
              class="options-input"
            ></textarea>
            <small class="hint">برای جدا کردن گزینه‌ها از Enter استفاده کنید.</small>
          </div>
          <div class="actions">
            <button type="submit" class="btn-save">💾 ذخیره تغییرات</button>
          </div>
        </form>
      </div>

    </aside>

    <main class="canvas-area">
      <div class="canvas-header">
        <div v-if="formStore.currentForm">
          <h2>{{ formStore.currentForm.title || formStore.currentForm.Title }}</h2>
        </div>
        <button @click="$router.back()" class="btn-back">بازگشت</button>
      </div>

      <div class="canvas-body" v-if="formStore.currentForm">
        <VueDraggable
          class="drop-zone"
          :list="formStore.currentForm.fields"
          group="fields"
          item-key="id"
          @change="handleChange"
        >
          <template #item="{ element }">
            <div 
              class="form-field-wrapper" 
              :class="{ 'active': selectedField && (selectedField.id === element.id) }"
              @click="selectField(element)"
            >
              
              <div v-if="element.id && String(element.id).startsWith('temp_')" class="saving-indicator">
                🔄 در حال ذخیره...
              </div>

              <div class="field-content">
                <div class="field-label">
                  {{ element.label || element.title || 'عنوان سوال' }}
                  <span v-if="element.isRequired" class="req">*</span>
                </div>
                
                <input v-if="element.fieldType === 'Text'" type="text" disabled :placeholder="element.placeholder || 'پاسخ کوتاه'" />
                
                <textarea v-else-if="element.fieldType === 'TextArea'" disabled :placeholder="element.placeholder || 'پاسخ تشریحی'"></textarea>
                
                <input v-else-if="element.fieldType === 'Number'" type="number" disabled placeholder="0" />
                
                <div v-else-if="element.fieldType === 'Checkbox'">
                  <input type="checkbox" disabled /> <span>{{ element.placeholder || 'موافقم' }}</span>
                </div>

                <select v-else-if="element.fieldType === 'Select'" disabled>
                  <option>انتخاب کنید...</option>
                  <option v-for="opt in (element.options ? element.options.split('\n') : [])" :key="opt">{{ opt }}</option>
                </select>

                <div v-else-if="element.fieldType === 'Radio'" class="radio-group">
                  <div v-for="opt in (element.options ? element.options.split('\n') : ['گزینه ۱', 'گزینه ۲'])" :key="opt" class="radio-item">
                    <input type="radio" disabled /> <label>{{ opt }}</label>
                  </div>
                </div>

                <input v-else-if="element.fieldType === 'Date'" type="date" disabled />
                
                <div class="field-actions">
                  <button @click.stop="handleDelete(element.id)" class="btn-sm delete">🗑️</button>
                </div>
              </div>
            </div>
          </template>
        </VueDraggable>
        
        <div v-if="formStore.currentForm.fields.length === 0" class="empty-canvas">
          سوالات را اینجا بکشید...
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useFormStore } from '@/stores/formStore';
import VueDraggable from 'vuedraggable';

const route = useRoute();
const formStore = useFormStore();
const selectedField = ref(null); // فیلدی که در حال ویرایش است

const toolItems = ref([
  { fieldType: 'Text', label: 'متن تک‌خطی', icon: '📝' },
  { fieldType: 'TextArea', label: 'متن چندخطی', icon: '📄' },
  { fieldType: 'Number', label: 'عدد', icon: '🔢' },
  { fieldType: 'Select', label: 'لیست کشویی', icon: '🔻' }, // جدید
  { fieldType: 'Radio', label: 'رادیو باتن', icon: '🔘' },   // جدید
  { fieldType: 'Checkbox', label: 'چک‌باکس تکی', icon: '☑️' },
  { fieldType: 'Date', label: 'تاریخ', icon: '📅' },         // جدید
  // { fieldType: 'File', label: 'آپلود فایل', icon: 'bh' } // فعلا کامنت تا سرویس آپلود آماده شود
]);

onMounted(() => {
  formStore.fetchFormById(route.params.id);
});

const cloneField = (originItem) => {
  return {
    id: 'temp_' + Date.now(),
    label: originItem.label,
    fieldType: originItem.fieldType,
    isRequired: false,
    placeholder: '',
    name: `${originItem.fieldType.toLowerCase()}_${Math.floor(Math.random() * 1000)}` 
  };
};

const handleChange = async (event) => {
  if (event.added) {
    const newItem = event.added.element;
    await formStore.addFieldToForm(formStore.currentForm.id, newItem.fieldType);
  }
};

const handleDelete = async (fieldId) => {
  if (fieldId && !String(fieldId).startsWith('temp_')) {
    if (selectedField.value?.id === fieldId) selectedField.value = null; // اگر در حال ویرایش بود، ببند
    await formStore.deleteField(fieldId);
  }
};

// انتخاب فیلد برای ویرایش
const selectField = (field) => {
  // کپی گرفتن برای جلوگیری از تغییر مستقیم استور قبل از ذخیره
  selectedField.value = { ...field };
};

// ذخیره تغییرات فیلد
const saveProperties = async () => {
  if (!selectedField.value) return;
  
  const success = await formStore.updateFieldProperties(selectedField.value.id, {
    label: selectedField.value.label,
    isRequired: selectedField.value.isRequired,
    placeholder: selectedField.value.placeholder,
    options: selectedField.value.options
  });

  if (success) {
    // بستن پنل یا نمایش پیام موفقیت
    // selectedField.value = null; // اگر بخواهید پنل بسته شود این را آنکامنت کنید
    alert('تغییرات ذخیره شد ✅');
  }
};
</script>

<style scoped>
.designer-container { display: flex; height: calc(100vh - 60px); background: #f0f2f5; gap: 20px; padding: 20px; }

/* سایدبار هوشمند */
.sidebar-panel { width: 300px; background: white; border-radius: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.05); overflow: hidden; display: flex; flex-direction: column; }
.toolbox, .properties-panel { padding: 20px; height: 100%; overflow-y: auto; }

/* پنل پراپرتیز */
.panel-header { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #eee; padding-bottom: 10px; margin-bottom: 15px; }
.btn-close { background: transparent; border: none; font-size: 1.2rem; cursor: pointer; color: #888; }
.form-group { margin-bottom: 15px; }
.form-group label { display: block; margin-bottom: 5px; font-weight: bold; font-size: 0.9rem; }
.form-group input[type="text"], .form-group textarea { width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; }
.checkbox-row { display: flex; align-items: center; gap: 10px; cursor: pointer; }
.checkbox-row input { width: 18px; height: 18px; }
.btn-save { width: 100%; background: #27ae60; color: white; border: none; padding: 10px; border-radius: 4px; cursor: pointer; margin-top: 10px; }

/* بوم طراحی */
.canvas-area { flex: 1; background: white; border-radius: 8px; display: flex; flex-direction: column; }
.canvas-body { flex: 1; padding: 30px; overflow-y: auto; background: #fafafa; }
.form-field-wrapper { 
  background: white; padding: 20px; border: 1px solid #eee; margin-bottom: 15px; 
  border-radius: 6px; position: relative; cursor: pointer; border-left: 4px solid transparent;
}
.form-field-wrapper:hover { border-color: #ddd; }
.form-field-wrapper.active { border-left-color: #3498db; box-shadow: 0 0 10px rgba(52, 152, 219, 0.1); } /* استایل انتخاب شده */

/* بقیه استایل‌ها (Tool Item, etc) */
.tool-item { padding: 10px; margin-bottom: 10px; background: #f8f9fa; border: 1px solid #ddd; cursor: grab; display: flex; gap: 10px; }
.drop-zone { min-height: 100%; padding-bottom: 50px; }
.field-actions { position: absolute; top: 15px; left: 15px; }
.btn-sm.delete { background: #fff; border: 1px solid red; color: red; padding: 5px 10px; border-radius: 4px; cursor: pointer; }
.saving-indicator { background: #e3f2fd; color: #0d47a1; padding: 5px; text-align: center; font-size: 0.8rem; margin-bottom: 5px; border-radius: 4px; }
input:disabled, textarea:disabled { background: #f9f9f9; }
.req { color: red; }
</style>