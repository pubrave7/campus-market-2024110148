<script setup lang="ts">
import { useUserStore } from '@/stores/user'
import { useRouter } from 'vue-router'

const router = useRouter()
const userStore = useUserStore()
</script>

<template>
  <header class="app-header">
    <div class="header-left">
      <h1 class="app-title" @click="router.push('/')">🏫 校园轻集市</h1>
      <span class="app-subtitle">二手 · 失物 · 拼单 · 跑腿</span>
    </div>
    <div class="header-right">
      <slot name="nav" />
      <!-- 用户快捷入口 -->
      <div class="user-quick" @click="router.push('/user')" title="个人中心">
        <span class="user-avatar">{{ userStore.avatarChar }}</span>
        <span class="user-name">{{ userStore.displayName }}</span>
      </div>
    </div>
  </header>
</template>

<style scoped>
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
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.app-title {
  font-size: 18px;
  font-weight: 700;
  color: #409eff;
  cursor: pointer;
  user-select: none;
  margin: 0;
}

.app-subtitle {
  font-size: 12px;
  color: #bbb;
  padding-left: 12px;
  border-left: 1px solid #e8e8e8;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

/* ---- 用户快捷入口 ---- */
.user-quick {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 14px 6px 8px;
  border-radius: 22px;
  cursor: pointer;
  transition: all 0.2s;
  background: #f8fafc;
  border: 1px solid transparent;
  flex-shrink: 0;
  margin-left: 12px;
}

.user-quick:hover {
  background: #f0f7ff;
  border-color: #cce0ff;
}

.user-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: linear-gradient(135deg, #409eff, #67c23a);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 700;
  flex-shrink: 0;
}

.user-name {
  font-size: 13px;
  color: #444;
  font-weight: 500;
  white-space: nowrap;
}
</style>
