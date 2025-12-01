// src/api/public-form.service.js
import axios from 'axios';

// کلاینت اختصاصی بدون هدر Authorization (چون این بخش عمومی است)
const publicClient = axios.create({
  baseURL: 'http://localhost:7021', // پورت بک‌اند شما
  headers: { 'Content-Type': 'application/json' }
});

export const publicFormService = {
  // دریافت ساختار فرم با استفاده از اسلاگ
  // GET /api/public/forms/{slug}
  async getBySlug(slug) {
    const response = await publicClient.get(`/api/public/forms/${slug}`);
    return response.data;
  },

  // ارسال پاسخ‌ها
  // POST /api/public/forms/{slug}/submit
  async submit(slug, submissionData) {
    // submissionData باید دقیقاً منطبق بر PublicFormSubmissionRequest در بک‌اند باشد
    const response = await publicClient.post(`/api/public/forms/${slug}/submit`, submissionData);
    return response.data;
  }
};