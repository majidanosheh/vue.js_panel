<template>
  <div class="create-user-page">
    <h2>➕ افزودن کاربر جدید</h2>
    
    <form @submit.prevent="handleSubmit" class="form-box">
      <div class="form-group">
        <label>نام کاربری</label>
        <input v-model="form.userName" type="text" required />
      </div>

      <div class="form-row">
        <div class="form-group">
          <label>نام</label>
          <input v-model="form.firstName" type="text" required />
        </div>
        <div class="form-group">
          <label>نام خانوادگی</label>
          <input v-model="form.lastName" type="text" required />
        </div>
      </div>

      <div class="form-group">
        <label>ایمیل</label>
        <input v-model="form.email" type="email" required />
      </div>

      <div class="form-group">
        <label>رمز عبور</label>
        <input v-model="form.password" type="password" required minlength="6" />
      </div>

      <div class="actions">
        <button type="button" @click="$router.back()" class="btn-cancel">انصراف</button>
        <button type="submit" class="btn-submit" :disabled="userStore.loading">
          {{ userStore.loading ? 'در حال ثبت...' : 'ذخیره کاربر' }}
        </button>
      </div>

      <p v-if="userStore.error" class="error-msg">{{ userStore.error }}</p>
    </form>
  </div>
</template>

<script setup>
import { reactive } from 'vue';
import { useUserStore } from '@/stores/userStore';
import { useRouter } from 'vue-router';

const userStore = useUserStore();
const router = useRouter();

const form = reactive({
  userName: '',
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  roles: ['Admin'] // فعلاً نقش پیش‌فرض (بعداً داینامیک می‌کنیم)
});

const handleSubmit = async () => {
  console.log('🚀 دکمه زده شد. در حال ارسال دیتا...', form); // تست کلیک

  // کپی گرفتن از دیتا برای شکستن لینک ری‌اکتیو (Best Practice)
  const userData = { ...form };

  const success = await userStore.createUser(userData);
  
  if (success) {
    alert('✅ کاربر با موفقیت ساخته شد!');
    router.push('/users');
  } else {
    console.error('❌ خطا در ساخت کاربر (جزئیات در userStore)');
  }
};
</script>

<style scoped>
.create-user-page { max-width: 600px; margin: 0 auto; padding: 20px; }
.form-box { background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.05); }
.form-group { margin-bottom: 15px; }
.form-row { display: flex; gap: 15px; }
.form-row .form-group { flex: 1; }
label { display: block; margin-bottom: 5px; font-weight: bold; font-size: 0.9rem; }
input { width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px; }
.actions { display: flex; gap: 10px; margin-top: 20px; }
.btn-submit { flex: 2; background: #27ae60; color: white; padding: 10px; border: none; border-radius: 4px; cursor: pointer; }
.btn-cancel { flex: 1; background: #95a5a6; color: white; padding: 10px; border: none; border-radius: 4px; cursor: pointer; }
.error-msg { color: crimson; margin-top: 15px; text-align: center; direction: ltr; }
</style>