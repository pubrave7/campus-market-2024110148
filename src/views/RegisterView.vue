<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { createUser, getUserByUsername } from '@/api/user'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const userStore = useUserStore()

// ====== 表单 ======
const username = ref('')
const password = ref('')
const confirmPassword = ref('')
const displayName = ref('')
const phone = ref('')
const email = ref('')
const loading = ref(false)
const errorMsg = ref('')
const successMsg = ref('')

// ====== 注册 ======
async function handleRegister() {
  errorMsg.value = ''

  // 表单校验
  if (!username.value.trim()) {
    errorMsg.value = '请输入用户名'
    return
  }
  if (username.value.trim().length < 3) {
    errorMsg.value = '用户名至少需要 3 个字符'
    return
  }
  if (!password.value.trim()) {
    errorMsg.value = '请输入密码'
    return
  }
  if (password.value.length < 6) {
    errorMsg.value = '密码至少需要 6 个字符'
    return
  }
  if (password.value !== confirmPassword.value) {
    errorMsg.value = '两次输入的密码不一致'
    return
  }
  if (!displayName.value.trim()) {
    errorMsg.value = '请输入显示昵称'
    return
  }

  loading.value = true
  errorMsg.value = ''

  try {
    // 检查用户名是否已存在
    const existing = await getUserByUsername(username.value.trim())
    if (existing.length > 0) {
      errorMsg.value = '该用户名已被注册，请换一个'
      loading.value = false
      return
    }

    // 创建新用户
    await createUser({
      username: username.value.trim(),
      password: password.value,
      displayName: displayName.value.trim(),
      school: '某某大学',
      college: '',
      grade: '2024级',
      studentId: '',
      phone: phone.value.trim() || '',
      email: email.value.trim() || '',
      bio: '',
      avatar: '',
      createdAt: new Date().toISOString().slice(0, 10),
    })

    successMsg.value = '注册成功！'

    // 注册成功后自动登录
    const users = await getUserByUsername(username.value.trim())
    const user = users[0]
    if (user) {
      userStore.login({
        id: user.id,
        username: user.username,
        displayName: user.displayName,
        avatar: user.avatar,
        school: user.school,
        college: user.college,
        grade: user.grade,
        studentId: user.studentId,
        phone: user.phone,
        email: user.email,
        bio: user.bio,
        createdAt: user.createdAt,
      })
    }

    // 延迟跳转到首页
    setTimeout(() => {
      router.push('/')
    }, 1500)
  } catch (err) {
    console.error('注册失败:', err)
    errorMsg.value = '注册失败，请确认已启动 Mock 服务（npm run mock）'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <section class="auth-page">
    <div class="auth-card">
      <div class="auth-header">
        <h1 class="auth-title">📝 注册账号</h1>
        <p class="auth-desc">加入校园轻集市，发现校园精彩生活</p>
      </div>

      <!-- 成功提示 -->
      <div v-if="successMsg" class="form-success">
        ✅ {{ successMsg }} 正在跳转到首页...
      </div>

      <form v-else class="auth-form" @submit.prevent="handleRegister" novalidate>
        <div class="form-item">
          <label class="form-label" for="reg-username">
            <span class="label-icon">👤</span> 用户名 <span class="required">*</span>
          </label>
          <input
            id="reg-username"
            v-model="username"
            type="text"
            class="form-input"
            placeholder="至少 3 个字符，用于登录"
            autocomplete="username"
            :disabled="loading"
          />
        </div>

        <div class="form-row">
          <div class="form-item form-half">
            <label class="form-label" for="reg-password">
              <span class="label-icon">🔒</span> 密码 <span class="required">*</span>
            </label>
            <input
              id="reg-password"
              v-model="password"
              type="password"
              class="form-input"
              placeholder="至少 6 个字符"
              autocomplete="new-password"
              :disabled="loading"
            />
          </div>
          <div class="form-item form-half">
            <label class="form-label" for="reg-confirm">
              <span class="label-icon">🔒</span> 确认密码 <span class="required">*</span>
            </label>
            <input
              id="reg-confirm"
              v-model="confirmPassword"
              type="password"
              class="form-input"
              placeholder="再次输入密码"
              autocomplete="new-password"
              :disabled="loading"
            />
          </div>
        </div>

        <div class="form-item">
          <label class="form-label" for="reg-display">
            <span class="label-icon">😊</span> 显示昵称 <span class="required">*</span>
          </label>
          <input
            id="reg-display"
            v-model="displayName"
            type="text"
            class="form-input"
            placeholder="发布和评论时显示的名称"
            :disabled="loading"
          />
        </div>

        <div class="form-row">
          <div class="form-item form-half">
            <label class="form-label" for="reg-phone">
              <span class="label-icon">📱</span> 手机号
            </label>
            <input
              id="reg-phone"
              v-model="phone"
              type="text"
              class="form-input"
              placeholder="选填"
              :disabled="loading"
            />
          </div>
          <div class="form-item form-half">
            <label class="form-label" for="reg-email">
              <span class="label-icon">📧</span> 邮箱
            </label>
            <input
              id="reg-email"
              v-model="email"
              type="email"
              class="form-input"
              placeholder="选填"
              :disabled="loading"
            />
          </div>
        </div>

        <!-- 错误提示 -->
        <div v-if="errorMsg" class="form-error">
          ⚠️ {{ errorMsg }}
        </div>

        <!-- 注册按钮 -->
        <button type="submit" class="auth-btn" :disabled="loading">
          {{ loading ? '注册中...' : '🚀 立即注册' }}
        </button>
      </form>

      <div class="auth-footer">
        <p>
          已有账号？
          <router-link to="/login" class="auth-link">去登录 →</router-link>
        </p>
      </div>
    </div>
  </section>
</template>

<style scoped>
.auth-page {
  max-width: 460px;
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

.form-row {
  display: flex;
  gap: 12px;
}

.form-half {
  flex: 1;
  min-width: 0;
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

.required {
  color: #e74c3c;
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

/* ---- 提示信息 ---- */
.form-error {
  padding: 10px 14px;
  background: #fef0f0;
  border: 1px solid #fbc4c4;
  border-radius: 8px;
  color: #e74c3c;
  font-size: 14px;
}

.form-success {
  padding: 16px 14px;
  background: #f0f9eb;
  border: 1px solid #c2e7b0;
  border-radius: 8px;
  color: #67c23a;
  font-size: 15px;
  text-align: center;
  margin-bottom: 8px;
}

/* ---- 按钮 ---- */
.auth-btn {
  padding: 13px 24px;
  background: linear-gradient(135deg, #67c23a, #409eff);
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
  box-shadow: 0 4px 16px rgba(103, 194, 58, 0.35);
  transform: translateY(-1px);
}

.auth-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
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
</style>
