import { createRouter, createWebHistory } from 'vue-router';
import LoginView from '../views/auth/LoginView.vue';

// فعلاً یه داشبورد الکی
const DashboardPlaceholder = { template: '<div style="padding:20px"><h1>داشبورد AnosheCMS</h1><p>خوش آمدید!</p></div>' };

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'dashboard',
      component: DashboardPlaceholder,
      meta: { requiresAuth: true }
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: { guest: true }
    }
  ]
});

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('accessToken');
  const isAuthenticated = token && token !== 'undefined' && token !== 'null';

  if (to.meta.requiresAuth && !isAuthenticated) next('/login');
  else if (to.path === '/login' && isAuthenticated) next('/');
  else next();
});

export default router;