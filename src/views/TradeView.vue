<script setup lang="ts">
import { ref } from 'vue'

interface TradeItem {
  id: number
  title: string
  price: number
  category: string
  condition: string
  seller: string
  image: string
}

const items = ref<TradeItem[]>([
  { id: 1, title: '二手教材《数据结构》', price: 25, category: '教材教辅', condition: '九成新', seller: '李同学', image: '📚' },
  { id: 2, title: '机械键盘 Cherry MX 红轴', price: 180, category: '数码电子', condition: '八成新', seller: '王同学', image: '⌨️' },
  { id: 3, title: 'LED 护眼台灯', price: 45, category: '生活用品', condition: '九五新', seller: '赵同学', image: '💡' },
  { id: 4, title: '蓝牙耳机', price: 60, category: '数码电子', condition: '八成新', seller: '刘同学', image: '🎧' },
  { id: 5, title: '二手山地自行车', price: 320, category: '出行工具', condition: '七成新', seller: '陈同学', image: '🚲' },
  { id: 6, title: '吉他（雅马哈F310）', price: 450, category: '文体娱乐', condition: '九成新', seller: '孙同学', image: '🎸' },
])

const categories = ref(['全部', '教材教辅', '数码电子', '生活用品', '出行工具', '文体娱乐'])
const activeCategory = ref('全部')

function filteredItems() {
  if (activeCategory.value === '全部') return items.value
  return items.value.filter(item => item.category === activeCategory.value)
}
</script>

<template>
  <section class="trade-page">
    <div class="page-header">
      <h2>🛒 二手交易</h2>
      <p class="page-desc">发现校园好物，让闲置流转起来</p>
    </div>

    <!-- 分类标签 -->
    <div class="category-bar">
      <button
        v-for="cat in categories"
        :key="cat"
        class="cat-tag"
        :class="{ active: activeCategory === cat }"
        @click="activeCategory = cat"
      >
        {{ cat }}
      </button>
    </div>

    <!-- 商品列表 -->
    <div class="trade-grid">
      <div v-for="item in filteredItems()" :key="item.id" class="trade-card">
        <div class="card-image">{{ item.image }}</div>
        <div class="card-body">
          <h3 class="card-title">{{ item.title }}</h3>
          <div class="card-meta">
            <span class="tag">{{ item.category }}</span>
            <span class="condition">{{ item.condition }}</span>
          </div>
          <div class="card-footer">
            <span class="price">¥{{ item.price }}</span>
            <span class="seller">{{ item.seller }}</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.trade-page {
  max-width: 900px;
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

.category-bar {
  display: flex;
  gap: 8px;
  margin-bottom: 24px;
  flex-wrap: wrap;
}

.cat-tag {
  padding: 6px 14px;
  border: 1px solid #d0d0d0;
  border-radius: 16px;
  background: #fff;
  font-size: 13px;
  color: #666;
  cursor: pointer;
  transition: all 0.2s;
}

.cat-tag:hover {
  border-color: #409eff;
  color: #409eff;
}

.cat-tag.active {
  background: #409eff;
  color: #fff;
  border-color: #409eff;
}

.trade-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.trade-card {
  border: 1px solid #e8e8e8;
  border-radius: 10px;
  background: #fff;
  overflow: hidden;
  transition: all 0.2s;
  cursor: pointer;
}

.trade-card:hover {
  border-color: #409eff;
  box-shadow: 0 4px 16px rgba(64, 158, 255, 0.12);
  transform: translateY(-2px);
}

.card-image {
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f7fa;
  font-size: 40px;
}

.card-body {
  padding: 14px 16px;
}

.card-title {
  font-size: 15px;
  margin: 0 0 8px 0;
  color: #333;
}

.card-meta {
  display: flex;
  gap: 8px;
  margin-bottom: 10px;
}

.tag {
  font-size: 11px;
  padding: 2px 8px;
  background: #f0f7ff;
  color: #409eff;
  border-radius: 4px;
}

.condition {
  font-size: 12px;
  color: #999;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.price {
  font-size: 18px;
  font-weight: 700;
  color: #e74c3c;
}

.seller {
  font-size: 12px;
  color: #aaa;
}
</style>
