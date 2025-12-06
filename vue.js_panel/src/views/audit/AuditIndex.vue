<template>
  <div class="audit-page">
    <div class="page-header">
      <div class="title-group">
        <h2>📜 لاگ فعالیت‌های سیستم</h2>
        <span class="subtitle">رصد و پیگیری تغییرات داده‌ها</span>
      </div>
      <button @click="fetchLogs" class="btn-refresh" :disabled="loading">
        <span v-if="loading">⏳</span>
        <span v-else>🔄</span>
        بروزرسانی
      </button>
    </div>

    <div v-if="loading && logs.length === 0" class="loading-state">
      <div class="spinner"></div>
      <p>در حال دریافت اطلاعات...</p>
    </div>

    <div v-else class="table-card">
      <div class="table-responsive">
        <table>
          <thead>
            <tr>
              <th style="width: 50px">#</th>
              <th>کاربر</th>
              <th>نوع عملیات</th>
              <th>موجودیت (Entity)</th>
              <th>زمان وقوع</th>
              <th>آدرس IP</th>
              <th style="width: 100px">عملیات</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="log in logs" :key="log.id">
              <td>{{ log.id }}</td>
              
              <td class="user-cell">
                <div class="avatar-circle">{{ (log.userName || '?')[0].toUpperCase() }}</div>
                <span class="username">{{ log.userName }}</span>
              </td>
              
              <td>
                <span :class="['status-badge', getActionClass(log.action)]">
                  {{ getActionLabel(log.action) }}
                </span>
              </td>
              
              <td>
                <span class="entity-name">{{ log.entityName }}</span>
                <span class="entity-id" v-if="log.entityId">ID: {{ log.entityId }}</span>
              </td>
              
              <td class="ltr-cell date-cell">
                {{ new Date(log.timestamp).toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }) }}
                <span class="date-part">{{ new Date(log.timestamp).toLocaleDateString('fa-IR') }}</span>
              </td>
              
              <td class="ltr-cell ip-cell">{{ log.ipAddress }}</td>
              
              <td>
                <button @click="showDetails(log)" class="btn-details" title="مشاهده جزئیات">
                  🔍 جزئیات
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="logs.length === 0 && !loading" class="empty-state">
        <div class="empty-icon">📭</div>
        <p>هیچ فعالیتی ثبت نشده است.</p>
      </div>

      <div class="pagination-bar" v-if="logs.length > 0">
        <button :disabled="page === 1" @click="changePage(-1)" class="page-btn">قبلی</button>
        <span class="page-info">صفحه <b>{{ page }}</b></span>
        <button :disabled="logs.length < pageSize" @click="changePage(1)" class="page-btn">بعدی</button>
      </div>
    </div>

    <transition name="fade">
      <div v-if="selectedLog" class="modal-backdrop" @click.self="selectedLog = null">
        <div class="modal-window">
          <div class="modal-header">
            <div class="modal-title">
              <h3>جزئیات تغییرات</h3>
              <div class="log-meta">
                <span class="meta-item">📝 {{ selectedLog.entityName }}</span>
                <span class="meta-item">👤 {{ selectedLog.userName }}</span>
              </div>
            </div>
            <button @click="selectedLog = null" class="btn-close-icon">✖</button>
          </div>
          
          <div class="modal-body">
            <div class="diff-wrapper">
              <div class="diff-column old-val">
                <div class="col-header">
                  <span class="dot red"></span> مقادیر قبلی (Old)
                </div>
                <div class="code-box">
                  <pre>{{ formatJson(selectedLog.oldValues) }}</pre>
                </div>
              </div>

              <div class="diff-column new-val">
                <div class="col-header">
                  <span class="dot green"></span> مقادیر جدید (New)
                </div>
                <div class="code-box">
                  <pre>{{ formatJson(selectedLog.newValues) }}</pre>
                </div>
              </div>
            </div>

            <div v-if="!selectedLog.oldValues && !selectedLog.newValues" class="no-change-msg">
              هیچ داده JSON برای نمایش وجود ندارد (احتمالا فقط عملیات ثبت شده است).
            </div>
          </div>
          
          <div class="modal-footer">
            <button @click="selectedLog = null" class="btn-close">بستن</button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { auditService } from '@/api/audit.service';

const logs = ref([]);
const loading = ref(false);
const page = ref(1);
const pageSize = 15; // تعداد در هر صفحه
const selectedLog = ref(null);

const fetchLogs = async () => {
  loading.value = true;
  try {
    const data = await auditService.getLogs(page.value, pageSize);
    logs.value = data.items || data || [];
  } catch (err) {
    console.error('Error fetching logs:', err);
  } finally {
    loading.value = false;
  }
};

onMounted(fetchLogs);

const changePage = (delta) => {
  page.value += delta;
  fetchLogs();
};

const getActionClass = (action) => {
  switch (action) {
    case 'Create': return 'create';
    case 'Update': return 'update';
    case 'Delete': return 'delete';
    case 'SoftDelete': return 'soft-delete';
    default: return 'other';
  }
};

const getActionLabel = (action) => {
  const map = {
    'Create': 'ایجاد',
    'Update': 'ویرایش',
    'Delete': 'حذف کامل',
    'SoftDelete': 'حذف نرم',
  };
  return map[action] || action;
};

const showDetails = (log) => { selectedLog.value = log; };

const formatJson = (jsonString) => {
  if (!jsonString) return '---';
  try {
    return JSON.stringify(JSON.parse(jsonString), null, 2);
  } catch (e) {
    return jsonString;
  }
};
</script>

<style scoped>
/* انیمیشن مودال */
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

.audit-page { padding: 30px; font-family: 'Tahoma', sans-serif; max-width: 1400px; margin: 0 auto; }

/* هدر */
.page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px; }
.page-header h2 { margin: 0; color: #2c3e50; font-size: 1.5rem; border-right: 4px solid #3498db; padding-right: 10px; }
.subtitle { display: block; color: #7f8c8d; font-size: 0.9rem; margin-top: 5px; margin-right: 14px; }
.btn-refresh { background: #fff; border: 1px solid #ddd; color: #555; padding: 8px 16px; border-radius: 6px; cursor: pointer; transition: 0.2s; display: flex; align-items: center; gap: 5px; font-weight: 500; }
.btn-refresh:hover { background: #f8f9fa; border-color: #bbb; color: #333; }

/* کارت جدول */
.table-card { background: white; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.04); overflow: hidden; border: 1px solid #eaeaea; }
.table-responsive { overflow-x: auto; }
table { width: 100%; border-collapse: collapse; white-space: nowrap; }

thead th { background: #f8f9fa; color: #666; font-weight: 600; padding: 15px; text-align: right; border-bottom: 2px solid #eee; font-size: 0.9rem; }
tbody td { padding: 12px 15px; border-bottom: 1px solid #f1f1f1; color: #444; font-size: 0.95rem; vertical-align: middle; }
tbody tr:hover { background-color: #fcfcfc; }
tbody tr:last-child td { border-bottom: none; }

/* ستون کاربر */
.user-cell { display: flex; align-items: center; gap: 10px; }
.avatar-circle { width: 32px; height: 32px; background: #e0f2fe; color: #0284c7; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 0.9rem; }
.username { font-weight: 500; }

/* بج‌ها */
.status-badge { padding: 4px 10px; border-radius: 20px; font-size: 0.8rem; font-weight: 600; display: inline-block; min-width: 70px; text-align: center; }
.status-badge.create { background: #dcfce7; color: #166534; }
.status-badge.update { background: #dbeafe; color: #1e40af; }
.status-badge.delete { background: #fee2e2; color: #991b1b; }
.status-badge.soft-delete { background: #ffedd5; color: #9a3412; }
.status-badge.other { background: #f3f4f6; color: #4b5563; }

/* سایر ستون‌ها */
.entity-name { font-weight: bold; display: block; }
.entity-id { font-size: 0.75rem; color: #999; font-family: monospace; }
.ltr-cell { direction: ltr; text-align: left; font-family: 'Segoe UI', monospace; }
.date-cell { display: flex; flex-direction: column; align-items: flex-end; line-height: 1.2; }
.date-part { font-size: 0.8rem; color: #888; }
.ip-cell { color: #666; font-size: 0.9rem; }

/* دکمه جزئیات */
.btn-details { background: transparent; border: 1px solid #3498db; color: #3498db; padding: 5px 12px; border-radius: 6px; cursor: pointer; font-size: 0.85rem; transition: 0.2s; }
.btn-details:hover { background: #3498db; color: white; }

/* صفحه‌بندی */
.pagination-bar { padding: 15px; display: flex; justify-content: center; align-items: center; gap: 15px; border-top: 1px solid #eee; background: #fafafa; }
.page-btn { padding: 6px 14px; border: 1px solid #ddd; background: white; border-radius: 6px; cursor: pointer; color: #555; }
.page-btn:disabled { opacity: 0.5; cursor: not-allowed; }
.page-btn:hover:not(:disabled) { background: #f0f0f0; border-color: #ccc; }

/* مودال */
.modal-backdrop { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.6); backdrop-filter: blur(3px); z-index: 2000; display: flex; align-items: center; justify-content: center; }
.modal-window { background: white; width: 90%; max-width: 1000px; height: 85vh; border-radius: 12px; display: flex; flex-direction: column; box-shadow: 0 15px 50px rgba(0,0,0,0.2); animation: slideUp 0.3s ease-out; }
@keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }

.modal-header { padding: 20px 25px; border-bottom: 1px solid #eee; display: flex; justify-content: space-between; align-items: center; background: #f8f9fa; border-radius: 12px 12px 0 0; }
.modal-title h3 { margin: 0; font-size: 1.2rem; color: #333; }
.log-meta { margin-top: 5px; display: flex; gap: 15px; font-size: 0.9rem; color: #666; }
.btn-close-icon { background: none; border: none; font-size: 1.5rem; color: #999; cursor: pointer; transition: 0.2s; }
.btn-close-icon:hover { color: #555; }

.modal-body { flex: 1; overflow-y: auto; padding: 25px; background: #fff; }
.diff-wrapper { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; height: 100%; }
.diff-column { display: flex; flex-direction: column; height: 100%; }
.col-header { font-weight: bold; margin-bottom: 10px; color: #555; display: flex; align-items: center; gap: 8px; }
.dot { width: 8px; height: 8px; border-radius: 50%; display: inline-block; }
.dot.red { background: #ef4444; }
.dot.green { background: #22c55e; }

.code-box { flex: 1; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 15px; overflow: auto; min-height: 200px; }
.old-val .code-box { background: #fff5f5; border-color: #fee2e2; }
.new-val .code-box { background: #f0fdf4; border-color: #dcfce7; }

pre { margin: 0; font-family: 'Consolas', 'Monaco', monospace; font-size: 0.85rem; line-height: 1.6; direction: ltr; text-align: left; white-space: pre-wrap; word-break: break-all; color: #334155; }

.modal-footer { padding: 15px 25px; border-top: 1px solid #eee; text-align: right; background: #f8f9fa; border-radius: 0 0 12px 12px; }
.btn-close { padding: 8px 25px; background: #64748b; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 0.95rem; }
.btn-close:hover { background: #475569; }
.no-change-msg { text-align: center; color: #999; margin-top: 50px; font-style: italic; }

.loading-state, .empty-state { text-align: center; padding: 60px 0; color: #888; }
.spinner { border: 4px solid #f3f3f3; border-top: 4px solid #3498db; border-radius: 50%; width: 40px; height: 40px; animation: spin 1s linear infinite; margin: 0 auto 15px; }
@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }

@media (max-width: 768px) {
  .diff-wrapper { grid-template-columns: 1fr; }
  .table-responsive { overflow-x: scroll; }
}
</style>