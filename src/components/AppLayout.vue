<script setup lang="ts">
import AppHeader from './AppHeader.vue'
import AppNav from './AppNav.vue'
</script>

<template>
  <div class="app-layout">
    <AppHeader>
      <template #nav>
        <AppNav />
      </template>
    </AppHeader>

    <main class="app-main">
      <RouterView />
    </main>

    <footer class="app-footer">
      <p>校园轻集市 © 2026 — 让校园生活更便捷</p>
      <p class="footer-sub">AI 辅助前端工程实践项目</p>
    </footer>
  </div>
</template>

<style scoped>
.app-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.app-main {
  flex: 1;
  padding: 32px;
  max-width: 1100px;
  width: 100%;
  margin: 0 auto;
}

.app-footer {
  text-align: center;
  padding: 16px 32px;
  color: #bbb;
  font-size: 13px;
  border-top: 1px solid #eee;
  background: #fff;
}

.app-footer p {
  margin: 0;
}

.footer-sub {
  font-size: 11px;
  color: #ddd;
  margin-top: 2px !important;
}
</style>
