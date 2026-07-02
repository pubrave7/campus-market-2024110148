<script setup lang="ts">
import { onMounted } from 'vue'
import AppLayout from '@/components/AppLayout.vue'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()

onMounted(() => {
  // App 启动时尝试从 localStorage 恢复登录状态
  userStore.restoreLogin()
})
</script>

<template>
  <AppLayout />
</template>

<style>
/* 全局重置 */
*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  background: #f5f6f8;
  color: #333;
  line-height: 1.6;
}

a {
  color: inherit;
  text-decoration: none;
}
</style>
