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
        <li>
          <router-link to="/users" active-class="active">
            👥 مدیریت کاربران
          </router-link>
        </li>
        <li>
  <router-link to="/forms" active-class="active">
    📝 فرم‌ساز
  </router-link>
</li>
      </ul>
    </nav>
  </aside>
</template>

<style scoped>
/* استایل‌ها همان قبلی‌ها هستند، تغییری لازم نیست */
.sidebar { width: 250px; background: #2c3e50; color: #ecf0f1; height: 100vh; position: fixed; right: 0; top: 0; display: flex; flex-direction: column; z-index: 1000; }
.sidebar-header { padding: 20px; text-align: center; border-bottom: 1px solid #34495e; font-weight: bold; }
.sidebar-nav ul { list-style: none; padding: 0; margin: 0; }
.sidebar-nav li a { display: block; padding: 15px 20px; color: #bdc3c7; text-decoration: none; transition: all 0.3s; border-right: 4px solid transparent;}
.sidebar-nav li a:hover, .sidebar-nav li a.active { background: #34495e; color: #fff; border-right: 4px solid #3498db; }
</style>