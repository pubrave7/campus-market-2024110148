<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { useFavoriteStore } from '@/stores/favorite'
import { getTrades, type TradeItem } from '@/api/trade'
import { getErrands, type ErrandItem } from '@/api/errand'
import { getGroupBuys, type GroupBuyItem } from '@/api/groupBuy'
import { getLostFounds, type LostFoundItem } from '@/api/lostFound'
import LoadingState from '@/components/LoadingState.vue'

const router = useRouter()
const userStore = useUserStore()
const favoriteStore = useFavoriteStore()

// ====== 从 API 获取当前用户发布的真实数据 ======
const myTrades = ref<TradeItem[]>([])
const myErrands = ref<ErrandItem[]>([])
const myGroupBuys = ref<GroupBuyItem[]>([])
const myLostFounds = ref<LostFoundItem[]>([])
const loadingPublished = ref(false)

/** 统一格式的发布项 */
interface PublishedItem {
  id: number
  type: 'trade' | 'errand' | 'groupBuy' | 'lostFound'
  title: string
  price: string
  status: string
  time: string
  image?: string
}

const allPublished = computed<PublishedItem[]>(() => {
  const items: PublishedItem[] = [
    ...myTrades.value.map(t => ({
      id: t.id,
      type: 'trade' as const,
      title: t.title,
      price: `¥${t.price}`,
      status: t.status,
      time: t.publishTime,
      image: t.image,
    })),
    ...myErrands.value.map(e => ({
      id: e.id,
      type: 'errand' as const,
      title: e.title,
      price: `¥${e.reward}`,
      status: e.status,
      time: e.deadline,
      image: e.image,
    })),
    ...myGroupBuys.value.map(g => ({
      id: g.id,
      type: 'groupBuy' as const,
      title: g.title,
      price: `${g.currentCount}/${g.targetCount}人`,
      status: g.status,
      time: g.deadline,
      image: g.image,
    })),
    ...myLostFounds.value.map(l => ({
      id: l.id,
      type: 'lostFound' as const,
      title: l.title,
      price: l.type === 'lost' ? '寻物' : '招领',
      status: l.status,
      time: l.date,
      image: l.image,
    })),
  ]
  // 按时间倒序排列
  return items.sort((a, b) => b.time.localeCompare(a.time))
})

async function fetchMyPublished() {
  if (!userStore.isLoggedIn) return
  loadingPublished.value = true
  try {
    const displayName = userStore.displayName
    const [trades, errands, groupBuys, lostFounds] = await Promise.all([
      getTrades().catch(() => [] as TradeItem[]),
      getErrands().catch(() => [] as ErrandItem[]),
      getGroupBuys().catch(() => [] as GroupBuyItem[]),
      getLostFounds().catch(() => [] as LostFoundItem[]),
    ])
    myTrades.value = trades.filter(t => t.seller === displayName)
    myErrands.value = errands.filter(e => e.publisher === displayName)
    myGroupBuys.value = groupBuys.filter(g => g.initiator === displayName)
    myLostFounds.value = lostFounds.filter(l => l.contact === displayName)
  } catch {
    // ignore
  } finally {
    loadingPublished.value = false
  }
}

// 登录状态变化时重新获取
watch(() => userStore.isLoggedIn, (val) => {
  if (val) fetchMyPublished()
})

onMounted(() => {
  if (userStore.isLoggedIn) fetchMyPublished()
})

// ====== 统计数据（来源于真实 API 数据） ======
const stats = computed(() => ({
  published: allPublished.value.length,
  activeTrades: myTrades.value.filter(t => t.status === 'open').length,
  activeErrands: myErrands.value.filter(e => e.status === 'open').length,
  favorited: favoriteStore.count,
}))

// ====== 视图状态 ======
type SubPage = 'main' | 'published' | 'favorites' | 'settings'
const currentPage = ref<SubPage>('main')
const pageTitle = computed(() => {
  const map: Record<SubPage, string> = {
    main: '个人中心',
    published: '我的发布',
    favorites: '我的收藏',
    settings: '账号设置',
  }
  return map[currentPage.value]
})

function goTo(page: SubPage) {
  if (!userStore.isLoggedIn) {
    router.push('/login')
    return
  }
  currentPage.value = page
  if (page === 'published') fetchMyPublished()
}

function goBack() {
  currentPage.value = 'main'
}

// ====== 退出登录 ======
function handleLogout() {
  userStore.logout()
  currentPage.value = 'main'
  // 清空发布数据
  myTrades.value = []
  myErrands.value = []
  myGroupBuys.value = []
  myLostFounds.value = []
  router.push('/')
}

// ====== 账号设置 ======
const settingsForm = ref({
  nickname: userStore.name,
  phone: userStore.phone,
  email: userStore.email,
  bio: userStore.bio,
})
const settingsSaved = ref(false)

function saveSettings() {
  userStore.updateProfile({
    name: settingsForm.value.nickname,
    phone: settingsForm.value.phone,
    email: settingsForm.value.email,
    bio: settingsForm.value.bio,
  })
  settingsSaved.value = true
  setTimeout(() => { settingsSaved.value = false }, 2500)
}

// ====== 工具函数 ======
function typeLabel(type: string) {
  const map: Record<string, string> = { trade: '二手交易', errand: '跑腿委托', groupBuy: '拼单搭子', lostFound: '失物招领' }
  return map[type] || type
}

function typeIcon(type: string) {
  const map: Record<string, string> = { trade: '🛒', errand: '🏃', groupBuy: '🤝', lostFound: '🔍' }
  return map[type] || '📦'
}

function typeColor(type: string) {
  const map: Record<string, string> = { trade: '#409eff', errand: '#e6a23c', groupBuy: '#67c23a', lostFound: '#7c3aed' }
  return map[type] || '#666'
}

function statusLabel(status: string) {
  const map: Record<string, string> = { open: '进行中', closed: '已结束', done: '已完成', claimed: '已接单' }
  return map[status] || status
}

function statusClass(status: string) {
  if (status === 'open') return 's-open'
  if (status === 'closed' || status === 'done' || status === 'claimed') return 's-closed'
  return ''
}

function favDisplayInfo(item: typeof favoriteStore.items[number]) {
  const label = typeLabel(item.type)
  const person = item.seller || item.publisher || item.initiator || '—'
  const price = item.price !== undefined ? (typeof item.price === 'number' ? `¥${item.price}` : String(item.price)) : '—'
  return { label, person, price }
}

const menuSections = computed(() => [
  {
    title: '我的数据',
    items: [
      { icon: '📋', label: '我的发布', desc: `${allPublished.value.length} 条发布记录`, page: 'published' as SubPage, color: '#409eff' },
      { icon: '❤️', label: '我的收藏', desc: `收藏了 ${favoriteStore.count} 个宝贝`, page: 'favorites' as SubPage, color: '#e74c3c' },
    ],
  },
  {
    title: '账号管理',
    items: [
      { icon: '⚙️', label: '账号设置', desc: '修改资料、手机号等', page: 'settings' as SubPage, color: '#666' },
    ],
  },
])
</script>

<template>
  <section class="user-page">
    <!-- ====== 未登录页面 ====== -->
    <template v-if="!userStore.isLoggedIn">
      <div class="login-prompt">
        <div class="prompt-card">
          <div class="prompt-avatar">🔐</div>
          <h2>欢迎来到个人中心</h2>
          <p class="prompt-sub">登录后可以管理你的发布、收藏和账号信息</p>
          <div class="prompt-actions">
            <router-link to="/login" class="prompt-btn primary">
              <span>🔑</span> 登录
            </router-link>
            <router-link to="/register" class="prompt-btn">
              <span>📝</span> 注册
            </router-link>
          </div>
          <p class="prompt-hint">💡 测试账号：zhangsan / 123456</p>
        </div>
      </div>
    </template>

    <!-- ====== 已登录：主页面 ====== -->
    <template v-else-if="currentPage === 'main'">
      <!-- 头部卡片 -->
      <div class="profile-hero">
        <div class="hero-content">
          <div class="avatar-wrap">
            <div class="avatar-main">{{ userStore.avatarChar }}</div>
            <span class="verified-badge">✓</span>
          </div>
          <h2 class="hero-name">{{ userStore.displayName }}</h2>
          <p class="hero-info">{{ userStore.school }}{{ userStore.college ? ' · ' + userStore.college : '' }}{{ userStore.grade ? ' · ' + userStore.grade : '' }}</p>
          <p class="hero-bio">{{ userStore.bio || '这个人很懒，什么都没写...' }}</p>
        </div>
      </div>

      <!-- 数据统计卡片 -->
      <div class="stats-row">
        <div class="stat-card" @click="goTo('published')">
          <div class="stat-icon-wrap" style="background: #e8f4fd;">
            <span class="stat-icon">📋</span>
          </div>
          <div class="stat-info">
            <span class="stat-num">{{ stats.published }}</span>
            <span class="stat-label">全部发布</span>
          </div>
        </div>
        <div class="stat-card" @click="goTo('published')">
          <div class="stat-icon-wrap" style="background: #fff7ed;">
            <span class="stat-icon">🛒</span>
          </div>
          <div class="stat-info">
            <span class="stat-num">{{ stats.activeTrades }}</span>
            <span class="stat-label">二手在售</span>
          </div>
        </div>
        <div class="stat-card" @click="goTo('published')">
          <div class="stat-icon-wrap" style="background: #fef0f0;">
            <span class="stat-icon">🏃</span>
          </div>
          <div class="stat-info">
            <span class="stat-num">{{ stats.activeErrands }}</span>
            <span class="stat-label">跑腿委托</span>
          </div>
        </div>
        <div class="stat-card" @click="goTo('favorites')">
          <div class="stat-icon-wrap" style="background: #fef5f5;">
            <span class="stat-icon">❤️</span>
          </div>
          <div class="stat-info">
            <span class="stat-num">{{ stats.favorited }}</span>
            <span class="stat-label">我的收藏</span>
          </div>
        </div>
      </div>

      <!-- 快捷信息 -->
      <div class="info-card">
        <div class="info-row">
          <span class="info-icon">👤</span>
          <span class="info-label">用户名</span>
          <span class="info-value">{{ userStore.username }}</span>
        </div>
        <div class="info-row">
          <span class="info-icon">📱</span>
          <span class="info-label">手机号</span>
          <span class="info-value">{{ userStore.phone || '未设置' }}</span>
        </div>
        <div class="info-row">
          <span class="info-icon">📧</span>
          <span class="info-label">邮箱</span>
          <span class="info-value">{{ userStore.email || '未设置' }}</span>
        </div>
        <div class="info-row">
          <span class="info-icon">🎓</span>
          <span class="info-label">学号</span>
          <span class="info-value">{{ userStore.studentId || '未设置' }}</span>
        </div>
        <div class="info-row">
          <span class="info-icon">📅</span>
          <span class="info-label">注册时间</span>
          <span class="info-value">{{ userStore.joinedAt || '未知' }}</span>
        </div>
      </div>

      <!-- 功能菜单 -->
      <div v-for="section in menuSections" :key="section.title" class="menu-section">
        <h3 class="section-title">{{ section.title }}</h3>
        <div class="menu-grid">
          <div
            v-for="item in section.items"
            :key="item.label"
            class="menu-item"
            @click="goTo(item.page)"
          >
            <span class="menu-icon-wrap" :style="{ background: item.color + '15', color: item.color }">
              {{ item.icon }}
            </span>
            <div class="menu-info">
              <span class="menu-label">{{ item.label }}</span>
              <span class="menu-desc">{{ item.desc }}</span>
            </div>
            <span class="menu-arrow">›</span>
          </div>
        </div>
      </div>

      <!-- 退出按钮 -->
      <button class="logout-btn" @click="handleLogout">
        <span>🚪</span> 退出登录
      </button>
    </template>

    <!-- ====== 子页面通用容器 ====== -->
    <template v-else>
      <div class="sub-header">
        <button class="back-btn" @click="goBack">← 返回</button>
        <h2>{{ pageTitle }}</h2>
      </div>

      <!-- ====== 我的发布（来自 API 真实数据） ====== -->
      <div v-if="currentPage === 'published'" class="sub-content">
        <LoadingState v-if="loadingPublished" message="正在加载发布记录..." size="small" />

        <template v-else>
          <div
            v-for="item in allPublished"
            :key="`${item.type}-${item.id}`"
            class="list-card"
            @click="router.push({ path: `/detail/${item.id}`, query: { type: item.type } })"
          >
            <div class="lc-left">
              <img v-if="item.image" :src="item.image" :alt="item.title" class="lc-thumb" />
              <span v-else class="lc-icon" :style="{ background: typeColor(item.type) + '18' }">{{ typeIcon(item.type) }}</span>
            </div>
            <div class="lc-body">
              <div class="lc-top">
                <span class="lc-type" :style="{ background: typeColor(item.type) + '18', color: typeColor(item.type) }">
                  {{ typeLabel(item.type) }}
                </span>
                <span class="lc-status" :class="statusClass(item.status)">{{ statusLabel(item.status) }}</span>
              </div>
              <h4 class="lc-title">{{ item.title }}</h4>
              <div class="lc-meta">
                <span class="lc-price">{{ item.price }}</span>
                <span>{{ item.time }}</span>
              </div>
            </div>
          </div>
          <div v-if="allPublished.length === 0 && !loadingPublished" class="empty-tip">
            <span class="empty-icon">📋</span>
            <p>暂无发布记录</p>
            <p class="empty-hint">
              <router-link to="/publish" class="empty-link">✏️ 去发布第一条信息吧</router-link>
            </p>
          </div>
        </template>
      </div>

      <!-- ====== 我的收藏（来自 favoriteStore） ====== -->
      <div v-if="currentPage === 'favorites'" class="sub-content">
        <div
          v-for="item in favoriteStore.items"
          :key="`${item.type}-${item.id}`"
          class="list-card"
          @click="router.push({ path: `/detail/${item.id}`, query: { type: item.type } })"
        >
          <div class="lc-left">
            <img v-if="item.image" :src="item.image" :alt="item.title" class="lc-thumb" />
            <span v-else class="lc-icon" :style="{ background: typeColor(item.type) + '18' }">{{ typeIcon(item.type) }}</span>
          </div>
          <div class="lc-body">
            <div class="lc-top">
              <span class="lc-type" :style="{ background: typeColor(item.type) + '18', color: typeColor(item.type) }">
                {{ favDisplayInfo(item).label }}
              </span>
              <button
                class="unfav-btn"
                @click.stop="favoriteStore.removeFavorite(item.id, item.type)"
                title="取消收藏"
              >
                ✕ 取消收藏
              </button>
            </div>
            <h4 class="lc-title">{{ item.title }}</h4>
            <div class="lc-meta">
              <span class="lc-price">{{ favDisplayInfo(item).price }}</span>
              <span>👤 {{ favDisplayInfo(item).person }}</span>
              <span v-if="item.time">{{ item.time }}</span>
            </div>
          </div>
        </div>
        <div v-if="favoriteStore.items.length === 0" class="empty-tip">
          <span class="empty-icon">💝</span>
          <p>还没有收藏任何内容</p>
          <p class="empty-hint">去各个列表页面逛逛，点击 🤍 收藏感兴趣的内容吧</p>
        </div>
      </div>

      <!-- ====== 账号设置 ====== -->
      <div v-if="currentPage === 'settings'" class="sub-content">
        <form class="settings-form" @submit.prevent="saveSettings">
          <div class="form-group">
            <label>头像</label>
            <div class="avatar-edit">
              <div class="avatar-edit-preview">{{ userStore.avatarChar }}</div>
              <button type="button" class="avatar-change-btn">📷 更换头像（开发中）</button>
            </div>
          </div>
          <div class="form-group">
            <label for="set-nickname">昵称</label>
            <input id="set-nickname" v-model="settingsForm.nickname" type="text" />
          </div>
          <div class="form-group">
            <label for="set-phone">手机号</label>
            <input id="set-phone" v-model="settingsForm.phone" type="text" disabled />
            <span class="form-hint">手机号暂不支持修改</span>
          </div>
          <div class="form-group">
            <label for="set-email">邮箱</label>
            <input id="set-email" v-model="settingsForm.email" type="email" />
          </div>
          <div class="form-group">
            <label for="set-bio">个人简介</label>
            <textarea id="set-bio" v-model="settingsForm.bio" rows="2" placeholder="介绍一下自己吧..."></textarea>
          </div>
          <button type="submit" class="save-btn">💾 保存设置</button>
          <p v-if="settingsSaved" class="save-success">✅ 设置已保存</p>
        </form>
      </div>
    </template>
  </section>
</template>

<style scoped>
.user-page {
  max-width: 680px;
  margin: 0 auto;
  padding-bottom: 32px;
}

/* ====== 未登录提示 ====== */
.login-prompt {
  display: flex;
  justify-content: center;
  padding: 60px 20px;
}

.prompt-card {
  text-align: center;
  background: #fff;
  border-radius: 20px;
  padding: 48px 40px;
  border: 1px solid #e8e8e8;
  box-shadow: 0 2px 16px rgba(0, 0, 0, 0.04);
  max-width: 420px;
  width: 100%;
}

.prompt-avatar {
  font-size: 64px;
  margin-bottom: 20px;
  width: 96px;
  height: 96px;
  line-height: 96px;
  border-radius: 50%;
  background: linear-gradient(135deg, #e8f4fd, #f0f7ff);
  margin: 0 auto 20px;
}

.prompt-card h2 {
  font-size: 22px;
  color: #222;
  margin: 0 0 8px 0;
  font-weight: 700;
}

.prompt-sub {
  color: #999;
  font-size: 14px;
  margin: 0 0 28px 0;
  line-height: 1.6;
}

.prompt-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
  margin-bottom: 24px;
}

.prompt-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 12px 32px;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.2s;
  border: 2px solid #d0d0d0;
  color: #555;
  background: #fff;
}

.prompt-btn:hover {
  border-color: #409eff;
  color: #409eff;
  transform: translateY(-1px);
}

.prompt-btn.primary {
  background: linear-gradient(135deg, #409eff, #5b7fff);
  color: #fff;
  border-color: transparent;
}

.prompt-btn.primary:hover {
  box-shadow: 0 4px 16px rgba(64, 158, 255, 0.35);
}

.prompt-hint {
  margin: 0;
  font-size: 12px;
  color: #ccc;
}

/* ====== 头部卡片 ====== */
.profile-hero {
  margin-bottom: 20px;
}

.hero-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 36px 24px 28px;
  text-align: center;
  background: #fff;
  border: 1px solid #e8e8e8;
  border-radius: 20px;
  position: relative;
  overflow: hidden;
}

.hero-content::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #409eff, #67c23a, #e6a23c, #e74c3c);
}

.avatar-wrap {
  position: relative;
  margin-bottom: 14px;
}

.avatar-main {
  width: 88px;
  height: 88px;
  border-radius: 50%;
  background: linear-gradient(135deg, #409eff, #67c23a);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 36px;
  font-weight: 700;
  box-shadow: 0 6px 20px rgba(64, 158, 255, 0.3);
}

.verified-badge {
  position: absolute;
  bottom: 4px;
  right: 4px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #67c23a;
  color: #fff;
  font-size: 13px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 3px solid #fff;
  font-weight: 700;
}

.hero-name {
  margin: 0 0 6px 0;
  font-size: 24px;
  color: #222;
  font-weight: 700;
}

.hero-info {
  margin: 0 0 8px 0;
  color: #888;
  font-size: 14px;
}

.hero-bio {
  margin: 0;
  color: #bbb;
  font-size: 13px;
  font-style: italic;
  max-width: 300px;
}

/* ====== 数据统计 ====== */
.stats-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  margin-bottom: 20px;
}

.stat-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 18px 8px;
  background: #fff;
  border: 1px solid #e8e8e8;
  border-radius: 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
  border-color: #cce0ff;
}

.stat-icon-wrap {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-icon {
  font-size: 22px;
}

.stat-info {
  text-align: center;
}

.stat-num {
  display: block;
  font-size: 24px;
  font-weight: 800;
  color: #222;
  line-height: 1.2;
}

.stat-label {
  font-size: 12px;
  color: #999;
  font-weight: 500;
}

/* ====== 信息卡片 ====== */
.info-card {
  background: #fff;
  border: 1px solid #e8e8e8;
  border-radius: 14px;
  padding: 6px 0;
  margin-bottom: 20px;
  overflow: hidden;
}

.info-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 13px 20px;
  transition: background 0.15s;
}

.info-row:hover {
  background: #fafbfc;
}

.info-icon {
  font-size: 16px;
  flex-shrink: 0;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: #f5f7fa;
  display: flex;
  align-items: center;
  justify-content: center;
}

.info-label {
  color: #888;
  font-size: 14px;
  flex-shrink: 0;
}

.info-value {
  color: #333;
  font-size: 14px;
  margin-left: auto;
  font-weight: 500;
}

/* ====== 菜单 ====== */
.menu-section {
  margin-bottom: 18px;
}

.section-title {
  font-size: 13px;
  color: #aaa;
  margin-bottom: 10px;
  padding-left: 6px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.menu-grid {
  display: flex;
  flex-direction: column;
  gap: 2px;
  border: 1px solid #eee;
  border-radius: 14px;
  overflow: hidden;
  background: #f5f5f5;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 16px 20px;
  background: #fff;
  cursor: pointer;
  transition: all 0.15s;
}

.menu-item:hover {
  background: #fafbfc;
}

.menu-item:active {
  background: #f0f5ff;
}

.menu-icon-wrap {
  width: 42px;
  height: 42px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  flex-shrink: 0;
}

.menu-info {
  flex: 1;
  min-width: 0;
}

.menu-label {
  display: block;
  font-size: 15px;
  color: #333;
  font-weight: 600;
  margin-bottom: 3px;
}

.menu-desc {
  display: block;
  font-size: 12px;
  color: #aaa;
}

.menu-arrow {
  font-size: 20px;
  color: #ccc;
  flex-shrink: 0;
  font-weight: 300;
}

/* ====== 退出按钮 ====== */
.logout-btn {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 14px;
  background: #fff;
  border: 1px solid #f0c0c0;
  border-radius: 12px;
  color: #e74c3c;
  font-size: 15px;
  cursor: pointer;
  transition: all 0.2s;
  margin-top: 4px;
  font-weight: 500;
  font-family: inherit;
}

.logout-btn:hover {
  background: #fef5f5;
  border-color: #e74c3c;
}

/* ====== 子页面头部 ====== */
.sub-header {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 20px;
  padding-bottom: 14px;
  border-bottom: 1px solid #eee;
}

.back-btn {
  padding: 7px 16px;
  border: 1px solid #d0d0d0;
  border-radius: 8px;
  background: #fff;
  color: #666;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
  flex-shrink: 0;
  font-family: inherit;
}

.back-btn:hover {
  border-color: #409eff;
  color: #409eff;
}

.sub-header h2 {
  margin: 0;
  font-size: 20px;
  color: #222;
  font-weight: 700;
}

/* ====== 子页面内容 ====== */
.sub-content {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.list-card {
  display: flex;
  gap: 16px;
  padding: 18px;
  background: #fff;
  border: 1px solid #e8e8e8;
  border-radius: 14px;
  cursor: pointer;
  transition: all 0.2s;
  align-items: center;
}

.list-card:hover {
  border-color: #409eff;
  box-shadow: 0 4px 16px rgba(64, 158, 255, 0.08);
  transform: translateX(2px);
}

.lc-left {
  flex-shrink: 0;
}

.lc-thumb {
  width: 56px;
  height: 56px;
  object-fit: cover;
  border-radius: 10px;
  background: #f5f7fa;
}

.lc-icon {
  width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  font-size: 26px;
}

.lc-body {
  flex: 1;
  min-width: 0;
}

.lc-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
}

.lc-type {
  font-size: 11px;
  padding: 3px 10px;
  border-radius: 6px;
  font-weight: 600;
}

.lc-status {
  font-size: 11px;
  padding: 3px 10px;
  border-radius: 6px;
  font-weight: 500;
}

.s-open {
  background: #fff7ed;
  color: #e6a23c;
}

.s-closed {
  background: #f0f9eb;
  color: #67c23a;
}

.lc-title {
  margin: 0 0 8px 0;
  font-size: 15px;
  color: #333;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.lc-meta {
  display: flex;
  gap: 16px;
  font-size: 12px;
  color: #aaa;
  flex-wrap: wrap;
  align-items: center;
}

.lc-price {
  color: #e74c3c;
  font-weight: 700;
  font-size: 15px;
}

/* 取消收藏按钮 */
.unfav-btn {
  background: none;
  border: 1px solid #f0c0c0;
  border-radius: 6px;
  color: #e74c3c;
  font-size: 11px;
  padding: 3px 10px;
  cursor: pointer;
  transition: all 0.2s;
  font-family: inherit;
}

.unfav-btn:hover {
  background: #fef5f5;
  border-color: #e74c3c;
}

/* 空状态 */
.empty-tip {
  text-align: center;
  padding: 56px 20px;
}

.empty-icon {
  font-size: 52px;
  display: block;
  margin-bottom: 16px;
  opacity: 0.5;
}

.empty-tip p {
  margin: 6px 0;
  color: #bbb;
  font-size: 15px;
}

.empty-hint {
  font-size: 13px !important;
  color: #ccc !important;
}

.empty-link {
  color: #409eff;
  text-decoration: none;
  font-weight: 500;
}

.empty-link:hover {
  text-decoration: underline;
}

/* ====== 设置表单 ====== */
.settings-form {
  display: flex;
  flex-direction: column;
  gap: 18px;
  background: #fff;
  border: 1px solid #e8e8e8;
  border-radius: 14px;
  padding: 28px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-group label {
  font-weight: 600;
  font-size: 14px;
  color: #444;
}

.form-group input,
.form-group textarea {
  padding: 11px 14px;
  border: 1px solid #d0d0d0;
  border-radius: 8px;
  font-size: 14px;
  font-family: inherit;
  transition: border-color 0.2s;
  outline: none;
  background: #fafafa;
}

.form-group input:focus,
.form-group textarea:focus {
  border-color: #409eff;
  box-shadow: 0 0 0 3px rgba(64, 158, 255, 0.1);
  background: #fff;
}

.form-group input:disabled {
  background: #f0f0f0;
  color: #999;
  cursor: not-allowed;
}

.form-hint {
  font-size: 11px;
  color: #bbb;
}

.avatar-edit {
  display: flex;
  align-items: center;
  gap: 18px;
}

.avatar-edit-preview {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #409eff, #67c23a);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 26px;
  font-weight: 700;
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.25);
}

.avatar-change-btn {
  padding: 8px 18px;
  border: 1px dashed #d0d0d0;
  border-radius: 8px;
  background: #fafafa;
  color: #666;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
  font-family: inherit;
}

.avatar-change-btn:hover {
  border-color: #409eff;
  color: #409eff;
}

.save-btn {
  padding: 13px 24px;
  background: linear-gradient(135deg, #409eff, #5b7fff);
  color: #fff;
  border: none;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  margin-top: 4px;
  font-family: inherit;
}

.save-btn:hover {
  box-shadow: 0 4px 16px rgba(64, 158, 255, 0.3);
  transform: translateY(-1px);
}

.save-success {
  margin: 0;
  padding: 10px 16px;
  background: #f0f9eb;
  border-radius: 8px;
  color: #67c23a;
  font-size: 14px;
  text-align: center;
  font-weight: 500;
}

@media (max-width: 600px) {
  .stats-row {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
