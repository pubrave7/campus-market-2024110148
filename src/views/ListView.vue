<script setup lang="ts">
import { ref } from 'vue'

interface Item {
  id: number
  title: string
  price: number
  description: string
}

const items = ref<Item[]>([
  { id: 1, title: '二手教材《数据结构》', price: 25, description: '九成新，几乎无笔记' },
  { id: 2, title: '机械键盘 Cherry MX', price: 180, description: '红轴，使用半年，功能正常' },
  { id: 3, title: '台灯 LED 护眼', price: 45, description: '三档调光，完好无损' },
  { id: 4, title: '蓝牙耳机', price: 60, description: '续航持久，音质清晰' },
  { id: 5, title: '二手自行车', price: 320, description: '26寸，变速正常，送锁' },
])
</script>

<template>
  <section class="list-page">
    <h2>商品列表</h2>
    <p class="page-desc">浏览校园内的二手商品</p>

    <div class="item-grid">
      <div v-for="item in items" :key="item.id" class="item-card">
        <div class="item-info">
          <h3>{{ item.title }}</h3>
          <p class="item-price">¥{{ item.price }}</p>
          <p class="item-desc">{{ item.description }}</p>
        </div>
        <router-link :to="`/detail/${item.id}`" class="item-link">查看详情 →</router-link>
      </div>
    </div>
  </section>
</template>

<style scoped>
.list-page {
  max-width: 900px;
  margin: 0 auto;
}

h2 {
  margin-bottom: 8px;
}

.page-desc {
  color: #666;
  margin-bottom: 24px;
}

.item-grid {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.item-card {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 16px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: box-shadow 0.2s;
}

.item-card:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.item-info h3 {
  margin: 0 0 4px 0;
}

.item-price {
  color: #e74c3c;
  font-size: 18px;
  font-weight: bold;
  margin: 4px 0;
}

.item-desc {
  color: #888;
  margin: 4px 0 0 0;
  font-size: 14px;
}

.item-link {
  color: #409eff;
  text-decoration: none;
  white-space: nowrap;
}

.item-link:hover {
  text-decoration: underline;
}
</style>
