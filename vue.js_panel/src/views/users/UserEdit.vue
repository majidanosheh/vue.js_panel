<template>
  <div class="edit-page">
    <h2>✏️ ویرایش کاربر</h2>

    <div v-if="userStore.loading && !form.email" class="loading">در حال دریافت اطلاعات...</div>

    <form v-else @submit.prevent="handleUpdate" class="form-box">
      <div class="form-group">
        <label>نام کاربری (غیرقابل تغییر)</label>
        <input v-model="form.userName" type="text" disabled class="disabled-input" />
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
      
      <div class="actions">
        <button type="button" @click="$router.back()" class="btn-cancel">بازگشت</button>
        <button type="submit" class="btn-submit" :disabled="userStore.loading">
          {{ userStore.loading ? 'در حال ذخیره...' : 'بروزرسانی تغییرات' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { reactive, onMounted } from 'vue';
import { useUserStore } from '@/stores/userStore';
import { useRoute, useRouter } from 'vue-router';

const userStore = useUserStore();
const route = useRoute();
const router = useRouter();
const userId = route.params.id;

const form = reactive({
  userName: '',
  firstName: '',
  lastName: '',
  email: '',
  roles: []
});

onMounted(async () => {
  // دریافت اطلاعات کاربر از سرور
  const user = await userStore.fetchUserById(userId);
  if (user) {
    // پر کردن فرم
    form.userName = user.UserName || user.userName;
    form.firstName = user.FirstName || user.firstName;
    form.lastName = user.LastName || user.lastName;
    form.email = user.Email || user.email;
    form.roles = user.Roles || [];
  }
});

const handleUpdate = async () => {
  const success = await userStore.updateUser(userId, form);
  if (success) {
    alert('تغییرات ذخیره شد ✅');
    router.push('/users');
  }
};
</script>

<style scoped>
.edit-page { max-width: 600px; margin: 20px auto; }
.form-box { background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.1); }
.form-group { margin-bottom: 15px; }
.form-row { display: flex; gap: 15px; }
.form-row .form-group { flex: 1; }
label { display: block; margin-bottom: 5px; font-weight: bold; }
input { width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px; }
.disabled-input { background: #eee; color: #777; cursor: not-allowed; }
.actions { display: flex; gap: 10px; margin-top: 20px; }
.btn-submit { flex: 2; background: #f39c12; color: white; padding: 10px; border: none; border-radius: 4px; cursor: pointer; }
.btn-cancel { flex: 1; background: #95a5a6; color: white; padding: 10px; border: none; border-radius: 4px; cursor: pointer; }
</style>