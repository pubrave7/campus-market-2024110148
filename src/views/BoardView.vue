<script setup lang="ts">
import { ref } from 'vue'

const stats = ref({
  totalUsers: 128,
  totalItems: 56,
  totalOrders: 203,
  todayNew: 8,
})

const recentItems = ref([
  { id: 1, title: '二手教材《数据结构》', price: 25, status: '在售' },
  { id: 2, title: '机械键盘 Cherry MX', price: 180, status: '在售' },
  { id: 3, title: '台灯 LED 护眼', price: 45, status: '已售' },
])
</script>

<template>
  <section class="board-page">
    <h2>数据看板</h2>
    <p class="page-desc">平台运营数据概览</p>

    <div class="stat-cards">
      <div class="stat-card">
        <span class="stat-icon">👤</span>
        <span class="stat-value">{{ stats.totalUsers }}</span>
        <span class="stat-title">注册用户</span>
      </div>
      <div class="stat-card">
        <span class="stat-icon">📦</span>
        <span class="stat-value">{{ stats.totalItems }}</span>
        <span class="stat-title">在售商品</span>
      </div>
      <div class="stat-card">
        <span class="stat-icon">💰</span>
        <span class="stat-value">{{ stats.totalOrders }}</span>
        <span class="stat-title">成交订单</span>
      </div>
      <div class="stat-card highlight">
        <span class="stat-icon">🆕</span>
        <span class="stat-value">{{ stats.todayNew }}</span>
        <span class="stat-title">今日新增</span>
      </div>
    </div>

    <div class="recent-section">
      <h3>最近商品</h3>
      <table class="data-table">
        <thead>
          <tr>
            <th>商品名称</th>
            <th>价格</th>
            <th>状态</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in recentItems" :key="item.id">
            <td>{{ item.title }}</td>
            <td class="price-cell">¥{{ item.price }}</td>
            <td>
              <span class="status-tag" :class="item.status === '在售' ? 'active' : 'sold'">
                {{ item.status }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>

<style scoped>
.board-page {
  max-width: 700px;
  margin: 0 auto;
}

h2 {
  margin-bottom: 8px;
}

.page-desc {
  color: #666;
  margin-bottom: 24px;
}

.stat-cards {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 32px;
}

.stat-card {
  border: 1px solid #e0e0e0;
  border-radius: 10px;
  padding: 20px 16px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  transition: box-shadow 0.2s;
}

.stat-card:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.stat-card.highlight {
  border-color: #409eff;
  background: #f0f7ff;
}

.stat-icon {
  font-size: 28px;
}

.stat-value {
  font-size: 28px;
  font-weight: bold;
  color: #333;
}

.stat-title {
  font-size: 13px;
  color: #999;
}

.recent-section h3 {
  margin-bottom: 12px;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
}

.data-table th,
.data-table td {
  padding: 10px 16px;
  text-align: left;
  border-bottom: 1px solid #eee;
}

.data-table th {
  background: #fafafa;
  font-weight: 600;
  color: #666;
  font-size: 13px;
}

.price-cell {
  color: #e74c3c;
  font-weight: 600;
}

.status-tag {
  padding: 2px 10px;
  border-radius: 12px;
  font-size: 12px;
}

.status-tag.active {
  background: #e8f5e9;
  color: #67c23a;
}

.status-tag.sold {
  background: #f5f5f5;
  color: #999;
}
</style>
