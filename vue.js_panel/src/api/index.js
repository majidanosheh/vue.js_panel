import axios from 'axios';

// ⚠️ پورت دقیق استخراج شده از launchSettings.json
const BACKEND_URL = 'http://localhost:7021'; 

const apiClient = axios.create({
  baseURL: BACKEND_URL, // <--- اتصال فرانت به پورت ۷۰۲۱
  headers: {
    'Content-Type': 'application/json',
  }
});

// اینترسپتور درخواست (تزریق توکن)
apiClient.interceptors.request.use(config => {
  const token = localStorage.getItem('accessToken');
  // چک کردن دقیق برای جلوگیری از ارسال null/undefined
  if (token && token !== 'undefined' && token !== 'null') {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, error => Promise.reject(error));

// اینترسپتور پاسخ (مدیریت 401)
apiClient.interceptors.response.use(response => response, error => {
  if (error.response && error.response.status === 401) {
    // توکن منقضی شده، خروج اجباری
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    window.location.href = '/login';
  }
  return Promise.reject(error);
});

export default apiClient;