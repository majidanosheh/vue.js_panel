// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import MainLayout from '@/layouts/MainLayout.vue';
import LoginView from '@/views/auth/LoginView.vue';
import DashboardView from '@/views/dashboard/DashboardView.vue';
import UsersIndex from '@/views/users/UsersIndex.vue'; 
import UserCreate from '@/views/users/UserCreate.vue';
import UserEdit from '@/views/users/UserEdit.vue';
import RolesIndex from '@/views/roles/RolesIndex.vue';
import RolePermissions from '@/views/roles/RolePermissions.vue';
import FormsIndex from '@/views/forms/FormsIndex.vue';
import FormDesigner from '@/views/forms/FormDesigner.vue';
import FormRenderer from '@/views/public/FormRenderer.vue';
import FormSubmissions from '@/views/forms/FormSubmissions.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: MainLayout,
      meta: { requiresAuth: true },
      children: [
        {
          // ⚠️ نکته کلیدی: پچ خالی یعنی آدرس پیش‌فرض (/)
          path: '', 
          name: 'dashboard',
          component: DashboardView
        },{
          path: 'users',
          name: 'users',
          component: UsersIndex
        },
        {
          path: 'users/create',
          name: 'user-create',
          component: UserCreate
        },
        {
  path: 'forms/design/:id', // آدرس داینامیک با ID
  name: 'form-design',
  component: FormDesigner
},{
  path: 'forms/submissions/:id',
  name: 'form-submissions',
  component: FormSubmissions
},
        // 👇 مسیر جدید ویرایش (با پارامتر id)
        {
          path: 'users/edit/:id',
          name: 'user-edit',
          component: UserEdit
        },
        { 
          path: 'roles', component: RolesIndex 
        },
        { 
          path: 'roles/permissions/:id', component: RolePermissions
         },
        {
          path: 'users',
          name: 'users',
          component: UsersIndex
        },
        {
  path: 'users/create', // آدرس: /users/create
  name: 'user-create',
  component: UserCreate
},
{
  path: 'forms',
  name: 'forms',
  component: FormsIndex
}
      ]
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: { guest: true }
    }
    ,{
  path: '/view/:slug', // آدرس عمومی: localhost:5173/view/contact-us
  name: 'public-form',
  component: FormRenderer,
  meta: { guest: true } // نیازی به لاگین نیست
}
  ]
});

// گاردها (بدون تغییر)
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('accessToken');
  const isAuthenticated = token && token !== 'undefined' && token !== 'null';

  if (to.meta.requiresAuth && !isAuthenticated) next('/login');
  else if (to.path === '/login' && isAuthenticated) next('/');
  else next();
});

export default router;