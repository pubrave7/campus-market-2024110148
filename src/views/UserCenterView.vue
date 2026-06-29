<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// ====== 用户信息 ======
const user = ref({
  name: '张同学',
  avatar: '',
  school: '某某大学',
  major: '计算机科学与技术',
  studentId: '2024xxxxx',
  phone: '138****8888',
  email: 'zhang@example.com',
  joinedAt: '2026-06-01',
  bio: '爱折腾的码农一枚，喜欢淘二手好书 📚',
})

const stats = ref({
  published: 5,
  sold: 3,
  purchased: 2,
  favorited: 12,
  errandsCompleted: 1,
})

// ====== 视图状态 ======
type SubPage = 'main' | 'published' | 'favorites' | 'purchased' | 'errands' | 'lostfounds' | 'settings'
const currentPage = ref<SubPage>('main')
const pageTitle = computed(() => {
  const map: Record<SubPage, string> = {
    main: '个人中心',
    published: '我的发布',
    favorites: '我的收藏',
    purchased: '购买记录',
    errands: '跑腿记录',
    lostfounds: '失物记录',
    settings: '账号设置',
  }
  return map[currentPage.value]
})

function goTo(page: SubPage) {
  currentPage.value = page
}

function goBack() {
  currentPage.value = 'main'
}

// ====== 我的发布 mock ======
const myPublished = ref([
  { id: 1, type: 'trade', title: '二手教材《数据结构》', price: '¥25', status: 'open', time: '2026-06-25', views: 128, image: 'https://placehold.co/60x60/e8f4fd/409eff?text=Book' },
  { id: 2, type: 'errand', title: '代取快递 — 中通×2', price: '¥5', status: 'open', time: '2026-06-28', views: 34, image: '' },
  { id: 3, type: 'groupBuy', title: '水果拼单 — 当季芒果', price: '¥25/人', status: 'open', time: '2026-06-27', views: 56, image: '' },
  { id: 4, type: 'lostFound', title: '黑色双肩包（寻物）', price: '—', status: 'open', time: '2026-06-27', views: 89, image: '' },
  { id: 5, type: 'trade', title: 'LED 护眼台灯', price: '¥45', status: 'closed', time: '2026-06-20', views: 210, image: 'https://placehold.co/60x60/fff7ed/f59e0b?text=Lamp' },
])

// ====== 我的收藏 mock ======
const myFavorites = ref([
  { id: 1, type: 'trade', title: '机械键盘 Cherry MX 红轴', price: '¥180', seller: '王同学', time: '2026-06-26', image: 'https://placehold.co/60x60/f5f0ff/7c3aed?text=KB' },
  { id: 2, type: 'trade', title: '蓝牙耳机（漫步者）', price: '¥60', seller: '刘同学', time: '2026-06-24', image: 'https://placehold.co/60x60/f0fdf4/22c55e?text=EP' },
  { id: 3, type: 'errand', title: '代办 — 教务处盖章', price: '¥15', seller: '张同学', time: '2026-06-29', image: '' },
])

// ====== 购买记录 mock ======
const myPurchases = ref([
  { id: 1, title: '考研数学复习全书', seller: '周同学', price: '¥30', time: '2026-06-22', status: 'done' },
  { id: 2, title: '小型电风扇（桌面USB款）', seller: '吴同学', price: '¥20', time: '2026-06-18', status: 'done' },
])

// ====== 跑腿记录 mock ======
const myErrands = ref([
  { id: 1, role: 'publish', title: '代取快递 — 中通×2', reward: '¥5', status: 'open', time: '2026-06-28', taker: '—' },
  { id: 2, role: 'take', title: '代办 — 图书归还', reward: '¥3', status: 'done', time: '2026-06-27', publisher: '刘同学' },
  { id: 3, role: 'publish', title: '委托 — 帮忙搬宿舍', reward: '¥30', status: 'open', time: '2026-06-26', taker: '—' },
])

// ====== 失物记录 mock ======
const myLostFounds = ref([
  { id: 1, type: 'lost', title: '蓝牙耳机充电仓', status: 'open', time: '2026-06-26', location: '教学楼 A201' },
  { id: 2, type: 'found', title: '校园卡（张XX）', status: 'open', time: '2026-06-28', location: '一食堂门口' },
])

// ====== 账号设置 ======
const settingsForm = ref({
  nickname: '张同学',
  phone: '138****8888',
  email: 'zhang@example.com',
  bio: '爱折腾的码农一枚，喜欢淘二手好书 📚',
})
const settingsSaved = ref(false)

function saveSettings() {
  settingsSaved.value = true
  user.value.name = settingsForm.value.nickname
  user.value.bio = settingsForm.value.bio
  setTimeout(() => { settingsSaved.value = false }, 2500)
}

// ====== 工具函数 ======
function typeLabel(type: string) {
  const map: Record<string, string> = { trade: '二手', errand: '跑腿', groupBuy: '拼单', lostFound: '失物招领' }
  return map[type] || type
}

function statusLabel(status: string) {
  const map: Record<string, string> = { open: '进行中', closed: '已结束', done: '已完成', claimed: '已接单' }
  return map[status] || status
}

function statusClass(status: string) {
  return status === 'open' ? 's-open' : 's-closed'
}

const menuSections = [
  {
    title: '交易管理',
    items: [
      { icon: '📋', label: '我的发布', desc: '查看已发布的商品、拼单等信息', page: 'published' as SubPage, color: '#409eff' },
      { icon: '❤️', label: '我的收藏', desc: '收藏的宝贝', page: 'favorites' as SubPage, color: '#e74c3c' },
      { icon: '📦', label: '购买记录', desc: '已购买的物品', page: 'purchased' as SubPage, color: '#67c23a' },
    ],
  },
  {
    title: '其他服务',
    items: [
      { icon: '🏃', label: '跑腿记录', desc: '我发布的委托和接单记录', page: 'errands' as SubPage, color: '#e6a23c' },
      { icon: '🔍', label: '失物记录', desc: '我发布的失物与招领信息', page: 'lostfounds' as SubPage, color: '#7c3aed' },
      { icon: '⚙️', label: '账号设置', desc: '修改资料、绑定手机等', page: 'settings' as SubPage, color: '#666' },
    ],
  },
]
</script>

<template>
  <section class="user-page">
    <!-- ====== 主页面 ====== -->
    <template v-if="currentPage === 'main'">
      <!-- 头部卡片 -->
      <div class="profile-hero">
        <div class="hero-bg"></div>
        <div class="hero-content">
          <div class="avatar-wrap">
            <div class="avatar-main">张</div>
            <span class="verified-badge">✓</span>
          </div>
          <h2 class="hero-name">{{ user.name }}</h2>
          <p class="hero-school">{{ user.school }} · {{ user.major }}</p>
          <p class="hero-bio">{{ user.bio }}</p>
        </div>
      </div>

      <!-- 数据统计 -->
      <div class="stats-card">
        <div class="stat-item" @click="goTo('published')">
          <span class="stat-num">{{ stats.published }}</span>
          <span class="stat-label">已发布</span>
        </div>
        <div class="stat-divider"></div>
        <div class="stat-item">
          <span class="stat-num">{{ stats.sold }}</span>
          <span class="stat-label">已售出</span>
        </div>
        <div class="stat-divider"></div>
        <div class="stat-item" @click="goTo('purchased')">
          <span class="stat-num">{{ stats.purchased }}</span>
          <span class="stat-label">已购买</span>
        </div>
        <div class="stat-divider"></div>
        <div class="stat-item" @click="goTo('favorites')">
          <span class="stat-num">{{ stats.favorited }}</span>
          <span class="stat-label">收藏</span>
        </div>
      </div>

      <!-- 快捷信息 -->
      <div class="info-card">
        <div class="info-row">
          <span class="info-icon">📱</span>
          <span class="info-label">手机号</span>
          <span class="info-value">{{ user.phone }}</span>
        </div>
        <div class="info-row">
          <span class="info-icon">📧</span>
          <span class="info-label">邮箱</span>
          <span class="info-value">{{ user.email }}</span>
        </div>
        <div class="info-row">
          <span class="info-icon">📅</span>
          <span class="info-label">加入时间</span>
          <span class="info-value">{{ user.joinedAt }}</span>
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
      <button class="logout-btn">🚪 退出登录</button>
    </template>

    <!-- ====== 子页面通用容器 ====== -->
    <template v-else>
      <!-- 头部 -->
      <div class="sub-header">
        <button class="back-btn" @click="goBack">← 返回</button>
        <h2>{{ pageTitle }}</h2>
      </div>

      <!-- ====== 我的发布 ====== -->
      <div v-if="currentPage === 'published'" class="sub-content">
        <div v-for="item in myPublished" :key="item.id" class="list-card" @click="router.push({ path: `/detail/${item.id}`, query: { type: item.type } })">
          <div class="lc-left">
            <img v-if="item.image" :src="item.image" :alt="item.title" class="lc-thumb" />
            <span v-else class="lc-icon">{{ { trade: '🛒', errand: '🏃', groupBuy: '🤝', lostFound: '🔍' }[item.type] }}</span>
          </div>
          <div class="lc-body">
            <div class="lc-top">
              <span class="lc-type">{{ typeLabel(item.type) }}</span>
              <span class="lc-status" :class="statusClass(item.status)">{{ statusLabel(item.status) }}</span>
            </div>
            <h4 class="lc-title">{{ item.title }}</h4>
            <div class="lc-meta">
              <span class="lc-price">{{ item.price }}</span>
              <span>{{ item.time }}</span>
              <span>👁 {{ item.views }}</span>
            </div>
          </div>
        </div>
        <div v-if="myPublished.length === 0" class="empty-tip">暂无发布记录</div>
      </div>

      <!-- ====== 我的收藏 ====== -->
      <div v-if="currentPage === 'favorites'" class="sub-content">
        <div v-for="item in myFavorites" :key="item.id" class="list-card" @click="router.push({ path: `/detail/${item.id}`, query: { type: item.type } })">
          <div class="lc-left">
            <img v-if="item.image" :src="item.image" :alt="item.title" class="lc-thumb" />
            <span v-else class="lc-icon">❤️</span>
          </div>
          <div class="lc-body">
            <div class="lc-top">
              <span class="lc-type">{{ typeLabel(item.type) }}</span>
            </div>
            <h4 class="lc-title">{{ item.title }}</h4>
            <div class="lc-meta">
              <span class="lc-price">{{ item.price }}</span>
              <span>👤 {{ item.seller }}</span>
              <span>{{ item.time }}</span>
            </div>
          </div>
        </div>
        <div v-if="myFavorites.length === 0" class="empty-tip">暂无收藏</div>
      </div>

      <!-- ====== 购买记录 ====== -->
      <div v-if="currentPage === 'purchased'" class="sub-content">
        <div v-for="item in myPurchases" :key="item.id" class="list-card">
          <div class="lc-left">
            <span class="lc-icon">📦</span>
          </div>
          <div class="lc-body">
            <h4 class="lc-title">{{ item.title }}</h4>
            <div class="lc-meta">
              <span class="lc-price">{{ item.price }}</span>
              <span>👤 {{ item.seller }}</span>
              <span>{{ item.time }}</span>
              <span class="done-tag">✓ 已成交</span>
            </div>
          </div>
        </div>
        <div v-if="myPurchases.length === 0" class="empty-tip">暂无购买记录</div>
      </div>

      <!-- ====== 跑腿记录 ====== -->
      <div v-if="currentPage === 'errands'" class="sub-content">
        <div v-for="item in myErrands" :key="item.id" class="list-card" @click="router.push({ path: `/detail/${item.id}`, query: { type: 'errand' } })">
          <div class="lc-left">
            <span class="lc-icon">{{ item.role === 'publish' ? '📤' : '📥' }}</span>
          </div>
          <div class="lc-body">
            <div class="lc-top">
              <span class="lc-type">{{ item.role === 'publish' ? '我发布的' : '我接单的' }}</span>
              <span class="lc-status" :class="statusClass(item.status)">{{ statusLabel(item.status) }}</span>
            </div>
            <h4 class="lc-title">{{ item.title }}</h4>
            <div class="lc-meta">
              <span class="lc-price">{{ item.reward }}</span>
              <span v-if="item.role === 'publish'">接单人: {{ item.taker }}</span>
              <span v-else>发布者: {{ item.publisher }}</span>
              <span>{{ item.time }}</span>
            </div>
          </div>
        </div>
        <div v-if="myErrands.length === 0" class="empty-tip">暂无跑腿记录</div>
      </div>

      <!-- ====== 失物记录 ====== -->
      <div v-if="currentPage === 'lostfounds'" class="sub-content">
        <div v-for="item in myLostFounds" :key="item.id" class="list-card" @click="router.push({ path: `/detail/${item.id}`, query: { type: 'lostFound' } })">
          <div class="lc-left">
            <span class="lc-icon">{{ item.type === 'lost' ? '😢' : '🙌' }}</span>
          </div>
          <div class="lc-body">
            <div class="lc-top">
              <span class="lc-type">{{ item.type === 'lost' ? '寻物启事' : '失物招领' }}</span>
              <span class="lc-status" :class="statusClass(item.status)">{{ statusLabel(item.status) }}</span>
            </div>
            <h4 class="lc-title">{{ item.title }}</h4>
            <div class="lc-meta">
              <span>📍 {{ item.location }}</span>
              <span>{{ item.time }}</span>
            </div>
          </div>
        </div>
        <div v-if="myLostFounds.length === 0" class="empty-tip">暂无失物招领记录</div>
      </div>

      <!-- ====== 账号设置 ====== -->
      <div v-if="currentPage === 'settings'" class="sub-content">
        <form class="settings-form" @submit.prevent="saveSettings">
          <div class="form-group">
            <label>头像</label>
            <div class="avatar-edit">
              <div class="avatar-edit-preview">张</div>
              <button type="button" class="avatar-change-btn">📷 更换头像</button>
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
  max-width: 640px;
  margin: 0 auto;
  padding-bottom: 24px;
}

/* ====== 头部卡片 ====== */
.profile-hero {
  position: relative;
  border-radius: 16px;
  overflow: hidden;
  margin-bottom: 14px;
}

.hero-bg {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, #409eff 0%, #67c23a 100%);
  opacity: 0.08;
}

.hero-content {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 32px 20px 24px;
  text-align: center;
  background: #fff;
  border: 1px solid #e8e8e8;
  border-radius: 16px;
}

.avatar-wrap {
  position: relative;
  margin-bottom: 12px;
}

.avatar-main {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, #409eff, #67c23a);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 34px;
  font-weight: 700;
  box-shadow: 0 4px 16px rgba(64, 158, 255, 0.25);
}

.verified-badge {
  position: absolute;
  bottom: 2px;
  right: 2px;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: #67c23a;
  color: #fff;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid #fff;
}

.hero-name {
  margin: 0 0 4px 0;
  font-size: 22px;
  color: #222;
}

.hero-school {
  margin: 0 0 6px 0;
  color: #888;
  font-size: 14px;
}

.hero-bio {
  margin: 0;
  color: #aaa;
  font-size: 13px;
  font-style: italic;
}

/* ====== 统计卡片 ====== */
.stats-card {
  display: flex;
  align-items: center;
  justify-content: space-around;
  padding: 18px 8px;
  background: #fff;
  border: 1px solid #e8e8e8;
  border-radius: 12px;
  margin-bottom: 14px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  cursor: pointer;
  transition: transform 0.15s;
  padding: 4px 8px;
  border-radius: 8px;
}

.stat-item:hover {
  transform: translateY(-2px);
  background: #f8fafc;
}

.stat-num {
  font-size: 24px;
  font-weight: 700;
  color: #409eff;
}

.stat-label {
  font-size: 12px;
  color: #999;
}

.stat-divider {
  width: 1px;
  height: 30px;
  background: #eee;
}

/* ====== 信息卡片 ====== */
.info-card {
  background: #fff;
  border: 1px solid #e8e8e8;
  border-radius: 12px;
  padding: 6px 0;
  margin-bottom: 18px;
}

.info-row {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 18px;
  border-bottom: 1px solid #f5f5f5;
}

.info-row:last-child {
  border-bottom: none;
}

.info-icon {
  font-size: 16px;
  flex-shrink: 0;
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
}

/* ====== 菜单 ====== */
.menu-section {
  margin-bottom: 16px;
}

.section-title {
  font-size: 15px;
  color: #666;
  margin-bottom: 10px;
  padding-left: 4px;
  font-weight: 600;
}

.menu-grid {
  display: flex;
  flex-direction: column;
  gap: 2px;
  border: 1px solid #e8e8e8;
  border-radius: 12px;
  overflow: hidden;
  background: #eee;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 15px 18px;
  background: #fff;
  cursor: pointer;
  transition: all 0.15s;
}

.menu-item:hover {
  background: #f8fafc;
}

.menu-item:active {
  background: #f0f5ff;
}

.menu-icon-wrap {
  width: 40px;
  height: 40px;
  border-radius: 10px;
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
  font-weight: 500;
  margin-bottom: 2px;
}

.menu-desc {
  display: block;
  font-size: 12px;
  color: #aaa;
}

.menu-arrow {
  font-size: 22px;
  color: #ccc;
  flex-shrink: 0;
  font-weight: 300;
}

/* ====== 退出按钮 ====== */
.logout-btn {
  width: 100%;
  padding: 12px;
  background: #fff;
  border: 1px solid #f0c0c0;
  border-radius: 10px;
  color: #e74c3c;
  font-size: 15px;
  cursor: pointer;
  transition: all 0.2s;
  margin-top: 8px;
  font-weight: 500;
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
  margin-bottom: 18px;
  padding-bottom: 14px;
  border-bottom: 1px solid #eee;
}

.back-btn {
  padding: 6px 14px;
  border: 1px solid #d0d0d0;
  border-radius: 8px;
  background: #fff;
  color: #666;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
  flex-shrink: 0;
}

.back-btn:hover {
  border-color: #409eff;
  color: #409eff;
}

.sub-header h2 {
  margin: 0;
  font-size: 20px;
  color: #222;
}

/* ====== 子页面内容 ====== */
.sub-content {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.list-card {
  display: flex;
  gap: 14px;
  padding: 16px;
  background: #fff;
  border: 1px solid #e8e8e8;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s;
  align-items: center;
}

.list-card:hover {
  border-color: #409eff;
  box-shadow: 0 2px 12px rgba(64, 158, 255, 0.08);
}

.lc-left {
  flex-shrink: 0;
}

.lc-thumb {
  width: 52px;
  height: 52px;
  object-fit: cover;
  border-radius: 8px;
}

.lc-icon {
  width: 52px;
  height: 52px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f7fa;
  border-radius: 8px;
  font-size: 24px;
}

.lc-body {
  flex: 1;
  min-width: 0;
}

.lc-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
}

.lc-type {
  font-size: 11px;
  padding: 2px 7px;
  background: #f0f7ff;
  color: #409eff;
  border-radius: 4px;
}

.lc-status {
  font-size: 11px;
  padding: 2px 7px;
  border-radius: 4px;
}

.s-open {
  background: #fef0f0;
  color: #e74c3c;
}

.s-closed {
  background: #f0f9eb;
  color: #67c23a;
}

.lc-title {
  margin: 0 0 6px 0;
  font-size: 15px;
  color: #333;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.lc-meta {
  display: flex;
  gap: 14px;
  font-size: 12px;
  color: #aaa;
}

.lc-price {
  color: #e74c3c;
  font-weight: 600;
  font-size: 14px;
}

.done-tag {
  color: #67c23a;
  font-weight: 500;
}

.empty-tip {
  text-align: center;
  padding: 48px 20px;
  color: #ccc;
  font-size: 15px;
}

/* ====== 设置表单 ====== */
.settings-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
  background: #fff;
  border: 1px solid #e8e8e8;
  border-radius: 12px;
  padding: 24px;
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
  padding: 10px 14px;
  border: 1px solid #d0d0d0;
  border-radius: 8px;
  font-size: 14px;
  font-family: inherit;
  transition: border-color 0.2s;
  outline: none;
}

.form-group input:focus,
.form-group textarea:focus {
  border-color: #409eff;
  box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.1);
}

.form-group input:disabled {
  background: #f5f5f5;
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
  gap: 16px;
}

.avatar-edit-preview {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: linear-gradient(135deg, #409eff, #67c23a);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  font-weight: 700;
}

.avatar-change-btn {
  padding: 8px 16px;
  border: 1px dashed #d0d0d0;
  border-radius: 8px;
  background: #fafafa;
  color: #666;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
}

.avatar-change-btn:hover {
  border-color: #409eff;
  color: #409eff;
}

.save-btn {
  padding: 12px 24px;
  background: #409eff;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  margin-top: 4px;
}

.save-btn:hover {
  background: #337ecc;
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.3);
}

.save-success {
  margin: 0;
  padding: 8px 14px;
  background: #f0f9eb;
  border-radius: 6px;
  color: #67c23a;
  font-size: 14px;
  text-align: center;
}
</style>
