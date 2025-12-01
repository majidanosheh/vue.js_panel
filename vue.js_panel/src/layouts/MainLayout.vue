<template>
  <div class="app-wrapper">
    <TheSidebar />

    <div class="main-content">
      <TheHeader />
      
      <div class="page-container">
        <router-view />
        </div>
    </div>
  </div>
</template>

<script setup>
import TheSidebar from '@/components/layout/TheSidebar.vue';
import TheHeader from '@/components/layout/TheHeader.vue';

</script>

<style scoped>
.app-wrapper {
  display: flex;
  min-height: 100vh;
  direction: rtl; /* راست‌چین */
}

.main-content {
  flex: 1;
  background: #f4f6f9;
  /* فاصله از راست به اندازه عرض سایدبار */
  margin-right: 250px; 
  width: calc(100% - 250px);
  min-height: 100vh;
  transition: all 0.3s;
}

.page-container {
  padding: 30px; /* کمی فاصله داخلی برای خوشگلی */
}
</style>