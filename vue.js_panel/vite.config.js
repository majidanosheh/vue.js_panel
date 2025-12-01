import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      // این خط حیاتیه: به Vite میگه هر وقت @ دیدی، برو تو پوشه src
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    port: 5173, // پورت پیش‌فرض
    // اگر خواستی پروکسی رو هم ست کنی که CORS اذیت نکنه (فعلا لازم نیست چون باز کردی)
    // proxy: {
    //   '/api': {
    //     target: 'http://localhost:5000',
    //     changeOrigin: true,
    //   }
    // }
  }
})