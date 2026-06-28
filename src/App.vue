<script setup lang="ts">
import { useRoute } from 'vue-router'

const route = useRoute()
</script>

<template>
  <div class="app">
    <header class="app-header">
      <h1 class="app-title" @click="$router.push('/')">🏫 校园轻集市</h1>
      <nav class="app-nav">
        <router-link to="/" :class="{ active: route.path === '/' }">首页</router-link>
        <router-link to="/list" :class="{ active: route.path.startsWith('/list') }">列表</router-link>
        <router-link to="/publish" :class="{ active: route.path === '/publish' }">发布</router-link>
        <router-link to="/messages" :class="{ active: route.path === '/messages' }">消息</router-link>
        <router-link to="/board" :class="{ active: route.path === '/board' }">看板</router-link>
        <router-link to="/profile" :class="{ active: route.path === '/profile' }">我的</router-link>
      </nav>
    </header>

    <main class="app-main">
      <RouterView />
    </main>

    <footer class="app-footer">
      <p>校园轻集市 © 2026 — AI 辅助前端工程实践</p>
    </footer>
  </div>
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

<style scoped>
.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.app-header {
  background: #fff;
  border-bottom: 1px solid #e8e8e8;
  padding: 0 32px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 56px;
  position: sticky;
  top: 0;
  z-index: 100;
}

.app-title {
  font-size: 18px;
  font-weight: 700;
  color: #409eff;
  cursor: pointer;
  user-select: none;
}

.app-nav {
  display: flex;
  gap: 4px;
}

.app-nav a {
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 14px;
  color: #555;
  transition: all 0.2s;
}

.app-nav a:hover {
  background: #f0f7ff;
  color: #409eff;
}

.app-nav a.active {
  background: #409eff;
  color: #fff;
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
</style>
