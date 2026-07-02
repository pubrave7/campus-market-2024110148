<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { getUsers } from '@/api/user'
import { useUserStore } from '@/stores/user'
import type { User } from '@/api/user'

const router = useRouter()
const userStore = useUserStore()

// ====== 表单 ======
const username = ref('')
const password = ref('')
const loading = ref(false)
const errorMsg = ref('')

// ====== 登录 ======
async function handleLogin() {
  // 前端校验
  if (!username.value.trim()) {
    errorMsg.value = '请输入用户名'
    return
  }
  if (!password.value.trim()) {
    errorMsg.value = '请输入密码'
    return
  }

  loading.value = true
  errorMsg.value = ''

  try {
    // 查询所有用户，匹配用户名
    const users: User[] = await getUsers()
    const matched = users.find(
      (u) => u.username === username.value.trim() && u.password === password.value,
    )

    if (!matched) {
      errorMsg.value = '用户名或密码错误'
      loading.value = false
      return
    }

    // 登录成功，保存到 Store（会自动写入 localStorage）
    userStore.login({
      id: matched.id,
      username: matched.username,
      displayName: matched.displayName,
      avatar: matched.avatar,
      school: matched.school,
      college: matched.college,
      grade: matched.grade,
      studentId: matched.studentId,
      phone: matched.phone,
      email: matched.email,
      bio: matched.bio,
      createdAt: matched.createdAt,
    })

    // 跳转到首页
    router.push('/')
  } catch (err) {
    console.error('登录失败:', err)
    errorMsg.value = '登录失败，请确认已启动 Mock 服务（npm run mock）'
  } finally {
    loading.value = false
  }
}

// ====== 快速填充 ======
function fillDemo() {
  username.value = 'zhangsan'
  password.value = '123456'
}
</script>

<template>
  <section class="auth-page">
    <div class="auth-card">
      <div class="auth-header">
        <h1 class="auth-title">👋 欢迎回来</h1>
        <p class="auth-desc">登录校园轻集市，开始你的校园交易之旅</p>
      </div>

      <form class="auth-form" @submit.prevent="handleLogin" novalidate>
        <div class="form-item">
          <label class="form-label" for="login-username">
            <span class="label-icon">👤</span> 用户名
          </label>
          <input
            id="login-username"
            v-model="username"
            type="text"
            class="form-input"
            placeholder="请输入用户名"
            autocomplete="username"
            :disabled="loading"
          />
        </div>

        <div class="form-item">
          <label class="form-label" for="login-password">
            <span class="label-icon">🔒</span> 密码
          </label>
          <input
            id="login-password"
            v-model="password"
            type="password"
            class="form-input"
            placeholder="请输入密码"
            autocomplete="current-password"
            :disabled="loading"
          />
        </div>

        <!-- 错误提示 -->
        <div v-if="errorMsg" class="form-error">
          ⚠️ {{ errorMsg }}
        </div>

        <!-- 登录按钮 -->
        <button type="submit" class="auth-btn" :disabled="loading">
          {{ loading ? '登录中...' : '🔑 登录' }}
        </button>

        <!-- 测试账号提示 -->
        <button type="button" class="demo-btn" @click="fillDemo" :disabled="loading">
          🧪 快速填充测试账号
        </button>
      </form>

      <div class="auth-footer">
        <p>
          还没有账号？
          <router-link to="/register" class="auth-link">立即注册 →</router-link>
        </p>
        <p class="auth-note">
          <span class="note-icon">💡</span>
          提示：请先在新终端执行 <code>npm run mock</code> 启动 Mock 服务
        </p>
      </div>
    </div>
  </section>
</template>

<style scoped>
.auth-page {
  max-width: 420px;
  margin: 0 auto;
  padding-top: 20px;
}

.auth-card {
  background: #fff;
  border-radius: 16px;
  border: 1px solid #e8e8e8;
  padding: 40px 36px;
  box-shadow: 0 2px 16px rgba(0, 0, 0, 0.04);
}

.auth-header {
  text-align: center;
  margin-bottom: 32px;
}

.auth-title {
  font-size: 26px;
  margin: 0 0 8px 0;
  color: #222;
}

.auth-desc {
  color: #999;
  font-size: 14px;
  margin: 0;
}

/* ---- 表单 ---- */
.auth-form {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.form-item {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-label {
  font-size: 14px;
  font-weight: 600;
  color: #444;
}

.label-icon {
  font-size: 16px;
}

.form-input {
  padding: 12px 14px;
  border: 1px solid #d0d0d0;
  border-radius: 8px;
  font-size: 15px;
  font-family: inherit;
  transition: border-color 0.2s;
  background: #fafafa;
  outline: none;
}

.form-input:focus {
  border-color: #409eff;
  background: #fff;
  box-shadow: 0 0 0 3px rgba(64, 158, 255, 0.1);
}

.form-input:disabled {
  background: #f0f0f0;
  cursor: not-allowed;
}

/* ---- 错误信息 ---- */
.form-error {
  padding: 10px 14px;
  background: #fef0f0;
  border: 1px solid #fbc4c4;
  border-radius: 8px;
  color: #e74c3c;
  font-size: 14px;
}

/* ---- 按钮 ---- */
.auth-btn {
  padding: 13px 24px;
  background: linear-gradient(135deg, #409eff, #5b7fff);
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  margin-top: 4px;
}

.auth-btn:hover:not(:disabled) {
  box-shadow: 0 4px 16px rgba(64, 158, 255, 0.35);
  transform: translateY(-1px);
}

.auth-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.demo-btn {
  background: none;
  border: 1px dashed #d0d0d0;
  border-radius: 8px;
  padding: 10px 16px;
  color: #888;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
}

.demo-btn:hover:not(:disabled) {
  border-color: #409eff;
  color: #409eff;
  background: #f0f7ff;
}

.demo-btn:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

/* ---- 底部 ---- */
.auth-footer {
  margin-top: 28px;
  text-align: center;
}

.auth-footer p {
  margin: 8px 0;
  font-size: 14px;
  color: #888;
}

.auth-link {
  color: #409eff;
  font-weight: 600;
  transition: color 0.2s;
}

.auth-link:hover {
  color: #337ecc;
}

.auth-note {
  font-size: 12px !important;
  color: #bbb !important;
  margin-top: 16px !important;
}

.note-icon {
  margin-right: 4px;
}

.auth-note code {
  background: #f5f5f5;
  padding: 2px 6px;
  border-radius: 3px;
  font-size: 12px;
  color: #666;
}
</style>
