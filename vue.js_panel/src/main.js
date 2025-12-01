import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import './assets/main.css';

// 1. ایمپورت دایرکتیو
import { permissionDirective } from './directives/permission';

const app = createApp(App);
const pinia = createPinia(); // اول پینیا را بساز

app.use(pinia); // ثبت پینیا
app.use(router);

// 2. ثبت دایرکتیو به نام 'can'
app.directive('can', permissionDirective);

app.mount('#app');