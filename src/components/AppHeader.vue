<script setup lang="ts">
import { ref } from 'vue'
import { useUserStore } from '@/stores/user'
import { useRouter } from 'vue-router'

const router = useRouter()
const userStore = useUserStore()

const showUserMenu = ref(false)

function handleLogout() {
  userStore.logout()
  showUserMenu.value = false
  router.push('/')
}

function toggleUserMenu() {
  if (userStore.isLoggedIn) {
    showUserMenu.value = !showUserMenu.value
  } else {
    router.push('/login')
  }
}
</script>

<template>
  <header class="app-header">
    <div class="header-left">
      <h1 class="app-title" @click="router.push('/')">🏫 校园轻集市</h1>
      <span class="app-subtitle">二手 · 失物 · 拼单 · 跑腿</span>
    </div>
    <div class="header-right">
      <slot name="nav" />

      <!-- ====== 登录状态：用户快捷入口 + 退出 ====== -->
      <template v-if="userStore.isLoggedIn">
        <div class="user-quick" @click="toggleUserMenu" title="个人中心">
          <span class="user-avatar">{{ userStore.avatarChar }}</span>
          <span class="user-name">{{ userStore.displayName }}</span>
          <span class="user-arrow">▾</span>
        </div>

        <!-- 下拉菜单 -->
        <div v-if="showUserMenu" class="user-dropdown" @mouseleave="showUserMenu = false">
          <div class="dropdown-item" @click="router.push('/user'); showUserMenu = false">
            <span>👤</span> 个人中心
          </div>
          <div class="dropdown-item" @click="router.push('/publish'); showUserMenu = false">
            <span>✏️</span> 发布信息
          </div>
          <div class="dropdown-divider"></div>
          <div class="dropdown-item logout-item" @click="handleLogout">
            <span>🚪</span> 退出登录
          </div>
        </div>
      </template>

      <!-- ====== 未登录状态：登录 / 注册 ====== -->
      <template v-else>
        <div class="auth-links">
          <button class="auth-link-btn login-link" @click="router.push('/login')">
            登录
          </button>
          <button class="auth-link-btn register-link" @click="router.push('/register')">
            注册
          </button>
        </div>
        <div class="user-quick guest" @click="router.push('/login')" title="点击登录">
          <span class="user-avatar">?</span>
          <span class="user-name">未登录</span>
        </div>
      </template>
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
  position: relative;
}

/* ---- 登录/注册按钮 ---- */
.auth-links {
  display: flex;
  gap: 8px;
  align-items: center;
}

.auth-link-btn {
  padding: 7px 18px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  border: 1px solid transparent;
  background: none;
  font-family: inherit;
}

.login-link {
  color: #409eff;
  border-color: #409eff;
}

.login-link:hover {
  background: #f0f7ff;
}

.register-link {
  background: #409eff;
  color: #fff;
  border-color: #409eff;
}

.register-link:hover {
  background: #337ecc;
  box-shadow: 0 2px 8px rgba(64, 158, 255, 0.3);
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

.user-quick.guest {
  opacity: 0.7;
  margin-left: 0;
}

.user-quick.guest:hover {
  opacity: 1;
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

.guest .user-avatar {
  background: #ccc;
}

.user-name {
  font-size: 13px;
  color: #444;
  font-weight: 500;
  white-space: nowrap;
}

.user-arrow {
  font-size: 10px;
  color: #aaa;
  margin-left: -2px;
}

/* ---- 下拉菜单 ---- */
.user-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 8px;
  background: #fff;
  border: 1px solid #e8e8e8;
  border-radius: 10px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  min-width: 160px;
  padding: 6px;
  z-index: 200;
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  border-radius: 6px;
  font-size: 14px;
  color: #444;
  cursor: pointer;
  transition: background 0.15s;
}

.dropdown-item:hover {
  background: #f5f7fa;
}

.dropdown-divider {
  height: 1px;
  background: #eee;
  margin: 4px 0;
}

.logout-item {
  color: #e74c3c;
}

.logout-item:hover {
  background: #fef5f5;
}
</style>
