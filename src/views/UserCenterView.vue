<script setup lang="ts">
import { ref } from 'vue'

const user = ref({
  name: '张同学',
  avatar: '',
  school: '某某大学',
  major: '计算机科学与技术',
  studentId: '2024xxxxx',
  phone: '138****8888',
  joinedAt: '2026-06-01',
})

const stats = ref({
  published: 5,
  sold: 3,
  purchased: 2,
  favorited: 12,
  errandsCompleted: 1,
})

const menuSections = ref([
  {
    title: '交易管理',
    items: [
      { icon: '📋', label: '我的发布', desc: '查看已发布的商品、拼单等信息' },
      { icon: '❤️', label: '我的收藏', desc: '收藏的宝贝' },
      { icon: '📦', label: '购买记录', desc: '已购买的物品' },
    ],
  },
  {
    title: '其他服务',
    items: [
      { icon: '🏃', label: '跑腿记录', desc: '我发布的委托和接单记录' },
      { icon: '🔍', label: '失物记录', desc: '我发布的失物与招领信息' },
      { icon: '⚙️', label: '账号设置', desc: '修改密码、绑定手机等' },
    ],
  },
])
</script>

<template>
  <section class="user-page">
    <div class="page-header">
      <h2>👤 个人中心</h2>
      <p class="page-desc">管理您的个人信息与交易记录</p>
    </div>

    <!-- 用户信息卡片 -->
    <div class="profile-card">
      <div class="avatar-section">
        <div class="avatar-placeholder">{{ user.name[0] }}</div>
        <div class="user-basic">
          <h3>{{ user.name }}</h3>
          <p>{{ user.school }} · {{ user.major }}</p>
          <p class="student-id">学号：{{ user.studentId }}</p>
        </div>
      </div>

      <div class="stats-row">
        <div class="stat-item">
          <span class="stat-num">{{ stats.published }}</span>
          <span class="stat-label">已发布</span>
        </div>
        <div class="stat-item">
          <span class="stat-num">{{ stats.sold }}</span>
          <span class="stat-label">已售出</span>
        </div>
        <div class="stat-item">
          <span class="stat-num">{{ stats.purchased }}</span>
          <span class="stat-label">已购买</span>
        </div>
        <div class="stat-item">
          <span class="stat-num">{{ stats.favorited }}</span>
          <span class="stat-label">收藏</span>
        </div>
      </div>

      <div class="info-row">
        <span class="info-label">手机号</span>
        <span class="info-value">{{ user.phone }}</span>
      </div>
      <div class="info-row">
        <span class="info-label">加入时间</span>
        <span class="info-value">{{ user.joinedAt }}</span>
      </div>
    </div>

    <!-- 功能菜单 -->
    <div v-for="section in menuSections" :key="section.title" class="menu-section">
      <h3 class="section-title">{{ section.title }}</h3>
      <div class="menu-grid">
        <div v-for="item in section.items" :key="item.label" class="menu-item">
          <span class="menu-icon">{{ item.icon }}</span>
          <div class="menu-info">
            <span class="menu-label">{{ item.label }}</span>
            <span class="menu-desc">{{ item.desc }}</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.user-page {
  max-width: 650px;
  margin: 0 auto;
}

.page-header {
  margin-bottom: 20px;
}

.page-header h2 {
  margin-bottom: 6px;
  font-size: 22px;
}

.page-desc {
  color: #888;
  font-size: 14px;
}

.profile-card {
  border: 1px solid #e8e8e8;
  border-radius: 12px;
  padding: 24px;
  background: #fff;
  margin-bottom: 24px;
}

.avatar-section {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;
}

.avatar-placeholder {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: linear-gradient(135deg, #409eff, #67c23a);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  font-weight: bold;
  flex-shrink: 0;
}

.user-basic h3 {
  margin: 0 0 4px 0;
  font-size: 20px;
  color: #333;
}

.user-basic p {
  margin: 0;
  color: #888;
  font-size: 14px;
}

.student-id {
  margin-top: 2px !important;
  font-size: 12px !important;
  color: #aaa !important;
}

.stats-row {
  display: flex;
  justify-content: space-around;
  padding: 16px 0;
  border-top: 1px solid #f0f0f0;
  border-bottom: 1px solid #f0f0f0;
  margin-bottom: 16px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.stat-num {
  font-size: 22px;
  font-weight: bold;
  color: #409eff;
}

.stat-label {
  font-size: 13px;
  color: #999;
}

.info-row {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
}

.info-label {
  color: #888;
  font-size: 14px;
}

.info-value {
  color: #333;
  font-size: 14px;
}

.menu-section {
  margin-bottom: 20px;
}

.section-title {
  font-size: 16px;
  color: #333;
  margin-bottom: 12px;
  padding-left: 4px;
}

.menu-grid {
  display: flex;
  flex-direction: column;
  gap: 1px;
  border: 1px solid #e8e8e8;
  border-radius: 10px;
  overflow: hidden;
  background: #eee;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 18px;
  background: #fff;
  cursor: pointer;
  transition: background 0.15s;
}

.menu-item:hover {
  background: #f5f7fa;
}

.menu-icon {
  font-size: 24px;
  width: 36px;
  text-align: center;
  flex-shrink: 0;
}

.menu-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.menu-label {
  font-size: 15px;
  color: #333;
  font-weight: 500;
}

.menu-desc {
  font-size: 12px;
  color: #aaa;
}
</style>
