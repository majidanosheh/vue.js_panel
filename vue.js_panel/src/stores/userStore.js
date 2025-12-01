import { defineStore } from 'pinia';
import { ref } from 'vue';
import { userService } from '@/api/user.service';

export const useUserStore = defineStore('userStore', () => {
  const users = ref([]);
  const currentUser = ref(null); // برای نگه داشتن کاربری که داریم ویرایش می‌کنیم
  const loading = ref(false);
  const error = ref(null);

  // --- READ (List) ---
  async function fetchUsers() {
    loading.value = true;
    try {
      const data = await userService.getAll();
      users.value = Array.isArray(data) ? data : (data.data || []);
    } catch (err) {
      console.error(err);
      error.value = 'خطا در دریافت کاربران';
    } finally {
      loading.value = false;
    }
  }

  // --- READ (Single) ---
  async function fetchUserById(id) {
    loading.value = true;
    currentUser.value = null; // ریست کردن قبلی
    try {
      const data = await userService.getById(id);
      currentUser.value = data;
      return data;
    } catch (err) {
      console.error(err);
      error.value = 'کاربر یافت نشد';
      return null;
    } finally {
      loading.value = false;
    }
  }

  // --- CREATE ---
  async function createUser(newUser) {
    loading.value = true;
    error.value = null;
    try {
      const createdUser = await userService.create(newUser);
      if (createdUser) users.value.unshift(createdUser);
      return true;
    } catch (err) {
      console.error(err);
      error.value = err.response?.data?.Errors 
                    ? JSON.stringify(err.response.data.Errors) 
                    : 'خطا در ایجاد کاربر';
      return false;
    } finally {
      loading.value = false;
    }
  }

  // --- UPDATE ---
  async function updateUser(id, updatedData) {
    loading.value = true;
    error.value = null;
    try {
      const result = await userService.update(id, updatedData);
      
      // آپدیت کردن یوزر در لیست لوکال (بدون رفرش)
      const index = users.value.findIndex(u => u.Id === id || u.id === id);
      if (index !== -1) {
        // ترکیب اطلاعات قبلی با جدید (چون شاید سرور همه فیلدها را برنگرداند)
        users.value[index] = { ...users.value[index], ...result };
      }
      return true;
    } catch (err) {
      console.error(err);
      error.value = err.response?.data?.Errors 
                    ? JSON.stringify(err.response.data.Errors) 
                    : 'خطا در ویرایش کاربر';
      return false;
    } finally {
      loading.value = false;
    }
  }

  // --- DELETE ---
  async function deleteUser(id) {
    if (!confirm('آیا از حذف این کاربر اطمینان دارید؟ این عملیات غیرقابل بازگشت است.')) return;

    loading.value = true;
    try {
      await userService.delete(id);
      
      // حذف از لیست لوکال
      users.value = users.value.filter(u => u.Id !== id && u.id !== id);
      return true;
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.Errors || 'خطا در حذف کاربر');
      return false;
    } finally {
      loading.value = false;
    }
  }

  return { 
    users, 
    currentUser, 
    loading, 
    error, 
    fetchUsers, 
    fetchUserById, 
    createUser, 
    updateUser, 
    deleteUser 
  };
});