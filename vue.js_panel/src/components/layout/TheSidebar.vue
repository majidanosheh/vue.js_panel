<template>
  <aside class="sidebar">
    <div class="sidebar-header">
      <h3>Anoshe CMS</h3>
    </div>
    
    <nav class="sidebar-nav">
      <ul>
        <li>
          <router-link to="/" active-class="active">
            🏠 داشبورد
          </router-link>
        </li>

        <li v-can="PERMISSIONS.VIEW_USERS">
          <router-link to="/users" active-class="active">
            👥 مدیریت کاربران
          </router-link>
        </li>

        <li v-can="PERMISSIONS.VIEW_ROLES">
          <router-link to="/roles" active-class="active">
            🛡️ نقش‌ها و دسترسی‌ها
          </router-link>
        </li>

        <li v-can="PERMISSIONS.VIEW_FORMS">
          <router-link to="/forms" active-class="active">
            📝 فرم‌ساز
          </router-link>
        </li>
      </ul>
    </nav>
  </aside>
</template>

<script setup>
// برای استفاده از PERMISSIONS در تمپلت، باید ایمپورت شود
import { PERMISSIONS } from '@/constants/permissions';
</script>

<style scoped>
.sidebar {
  width: 250px;
  background: #2c3e50;
  color: #ecf0f1;
  height: 100vh;
  position: fixed;
  right: 0;
  top: 0;
  display: flex;
  flex-direction: column;
  z-index: 1000;
  box-shadow: -2px 0 5px rgba(0,0,0,0.1);
}

.sidebar-header {
  padding: 20px;
  text-align: center;
  border-bottom: 1px solid #34495e;
  font-weight: bold;
  font-size: 1.2rem;
  background: #243342;
}

.sidebar-nav {
  flex: 1;
  overflow-y: auto;
  padding-top: 10px;
}

.sidebar-nav ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.sidebar-nav li a {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 20px;
  color: #bdc3c7;
  text-decoration: none;
  transition: all 0.2s ease-in-out;
  border-right: 4px solid transparent;
  font-size: 0.95rem;
}

.sidebar-nav li a:hover {
  background: #34495e;
  color: #fff;
  padding-right: 25px; /* افکت حرکت هنگام هاور */
}

.sidebar-nav li a.active {
  background: #34495e;
  color: #fff;
  border-right-color: #3498db;
  font-weight: bold;
}
</style>