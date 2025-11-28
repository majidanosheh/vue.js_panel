import axios from 'axios';

// ایجاد یک نمونه اختصاصی برای کنترل کامل روی هدرها
const apiClient = axios.create({
  baseURL: 'http://localhost:5000', // پورت بک‌اند دات‌نت
  headers: {
    'Content-Type': 'application/json',
  }
});

// اینترسپتور درخواست: تزریق توکن با وسواس زیاد!
apiClient.interceptors.request.use(config => {
  const token = localStorage.getItem('accessToken');
  
  // شرط سفت و سخت برای جلوگیری از باگ‌های عجیب
  if (token && token !== 'undefined' && token !== 'null') {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  return config;
}, error => {
  return Promise.reject(error);
});

// اینترسپتور پاسخ: مدیریت اخراج کاربر (401)
apiClient.interceptors.response.use(response => {
  return response;
}, error => {
  if (error.response && error.response.status === 401) {
    // توکن سوخته، همه چی رو پاک کن و بندازش بیرون
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    window.location.href = '/login';
  }
  return Promise.reject(error);
});

export default apiClient;