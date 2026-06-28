<script setup lang="ts">
import { useRoute } from 'vue-router'

const route = useRoute()

const navItems = [
  { path: '/', label: '首页', icon: '🏠' },
  { path: '/trade', label: '二手交易', icon: '🛒' },
  { path: '/lost-found', label: '失物招领', icon: '🔍' },
  { path: '/group-buy', label: '拼单搭子', icon: '🤝' },
  { path: '/errand', label: '跑腿委托', icon: '🏃' },
  { path: '/publish', label: '发布', icon: '✏️' },
  { path: '/message', label: '消息', icon: '💬' },
  { path: '/user', label: '我的', icon: '👤' },
]

function isActive(path: string) {
  if (path === '/') return route.path === '/'
  return route.path.startsWith(path)
}
</script>

<template>
  <nav class="app-nav">
    <router-link
      v-for="item in navItems"
      :key="item.path"
      :to="item.path"
      class="nav-item"
      :class="{ active: isActive(item.path) }"
    >
      <span class="nav-icon">{{ item.icon }}</span>
      <span class="nav-label">{{ item.label }}</span>
    </router-link>
  </nav>
</template>

<style scoped>
.app-nav {
  display: flex;
  gap: 4px;
  align-items: center;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 8px 14px;
  border-radius: 6px;
  font-size: 14px;
  color: #555;
  transition: all 0.2s;
  text-decoration: none;
  white-space: nowrap;
}

.nav-item:hover {
  background: #f0f7ff;
  color: #409eff;
}

.nav-item.active {
  background: #409eff;
  color: #fff;
}

.nav-icon {
  font-size: 15px;
}

.nav-label {
  font-size: 14px;
}
</style>
