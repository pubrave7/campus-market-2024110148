<script setup lang="ts">
import { ref } from 'vue'

const user = ref({
  name: '张同学',
  avatar: '',
  school: '某某大学',
  major: '计算机科学与技术',
  phone: '138****8888',
  joinedAt: '2026-06-01',
})

const stats = ref({
  published: 5,
  sold: 3,
  favorited: 12,
})
</script>

<template>
  <section class="profile-page">
    <h2>个人中心</h2>
    <p class="page-desc">管理您的个人信息与交易记录</p>

    <div class="profile-card">
      <div class="avatar-section">
        <div class="avatar-placeholder">{{ user.name[0] }}</div>
        <div class="user-basic">
          <h3>{{ user.name }}</h3>
          <p>{{ user.school }} · {{ user.major }}</p>
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
          <span class="stat-num">{{ stats.favorited }}</span>
          <span class="stat-label">收藏</span>
        </div>
      </div>

      <div class="info-list">
        <div class="info-row">
          <span class="info-label">手机号</span>
          <span class="info-value">{{ user.phone }}</span>
        </div>
        <div class="info-row">
          <span class="info-label">加入时间</span>
          <span class="info-value">{{ user.joinedAt }}</span>
        </div>
      </div>

      <button class="edit-btn">编辑资料</button>
    </div>
  </section>
</template>

<style scoped>
.profile-page {
  max-width: 500px;
  margin: 0 auto;
}

h2 {
  margin-bottom: 8px;
}

.page-desc {
  color: #666;
  margin-bottom: 24px;
}

.profile-card {
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  padding: 24px;
  background: #fff;
}

.avatar-section {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
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
}

.user-basic p {
  margin: 0;
  color: #888;
  font-size: 14px;
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

.info-list {
  margin-bottom: 20px;
}

.info-row {
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px solid #f5f5f5;
}

.info-label {
  color: #888;
}

.info-value {
  color: #333;
}

.edit-btn {
  width: 100%;
  padding: 10px;
  background: #fff;
  border: 1px solid #409eff;
  color: #409eff;
  border-radius: 6px;
  font-size: 15px;
  cursor: pointer;
  transition: all 0.2s;
}

.edit-btn:hover {
  background: #409eff;
  color: #fff;
}
</style>
