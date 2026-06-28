<script setup lang="ts">
import { ref } from 'vue'

type ItemType = 'lost' | 'found'

interface LostFoundItem {
  id: number
  type: ItemType
  title: string
  description: string
  location: string
  date: string
  contact: string
  icon: string
}

const items = ref<LostFoundItem[]>([
  { id: 1, type: 'lost', title: '黑色双肩包', description: '内含笔记本电脑和几本教材，包外侧有钥匙扣', location: '图书馆二楼阅览室', date: '2026-06-27', contact: '李同学 138xxxx1234', icon: '🎒' },
  { id: 2, type: 'found', title: '校园卡（张XX）', description: '在一食堂门口捡到，学号 2024xxxx', location: '一食堂门口', date: '2026-06-28', contact: '王同学 139xxxx5678', icon: '💳' },
  { id: 3, type: 'lost', title: '蓝牙耳机充电仓', description: '白色 AirPods 充电仓，带一个蓝色保护套', location: '教学楼 A201', date: '2026-06-26', contact: '赵同学 137xxxx9012', icon: '🎧' },
  { id: 4, type: 'found', title: '钥匙串（3把钥匙）', description: '银色钥匙串，有3把钥匙和一个哆啦A梦挂件', location: '操场跑道旁', date: '2026-06-28', contact: '刘同学 136xxxx3456', icon: '🔑' },
  { id: 5, type: 'lost', title: '雨伞（深蓝色）', description: '折叠伞，深蓝色，品牌天堂伞', location: '二食堂二楼', date: '2026-06-25', contact: '陈同学 135xxxx7890', icon: '🌂' },
  { id: 6, type: 'found', title: 'U盘（32G 金士顿）', description: '银色金属外壳，挂绳上有"数据"字样', location: '计算机学院机房', date: '2026-06-27', contact: '孙同学 134xxxx2345', icon: '💾' },
])

const activeTab = ref<ItemType>('lost')

function filteredItems() {
  return items.value.filter(item => item.type === activeTab.value)
}
</script>

<template>
  <section class="lost-found-page">
    <div class="page-header">
      <h2>🔍 失物招领</h2>
      <p class="page-desc">发布失物或招领信息，互帮互助共建温暖校园</p>
    </div>

    <!-- 类型切换 -->
    <div class="tab-bar">
      <button
        class="tab-btn"
        :class="{ active: activeTab === 'lost' }"
        @click="activeTab = 'lost'"
      >
        😢 寻物启事
      </button>
      <button
        class="tab-btn"
        :class="{ active: activeTab === 'found' }"
        @click="activeTab = 'found'"
      >
        🙌 失物招领
      </button>
    </div>

    <!-- 信息列表 -->
    <div class="lf-list">
      <div v-for="item in filteredItems()" :key="item.id" class="lf-card">
        <div class="lf-icon">{{ item.icon }}</div>
        <div class="lf-body">
          <div class="lf-header">
            <h3>{{ item.title }}</h3>
            <span class="lf-type-badge" :class="item.type">
              {{ item.type === 'lost' ? '寻物' : '招领' }}
            </span>
          </div>
          <p class="lf-desc">{{ item.description }}</p>
          <div class="lf-meta">
            <span>📍 {{ item.location }}</span>
            <span>🕐 {{ item.date }}</span>
            <span>👤 {{ item.contact }}</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.lost-found-page {
  max-width: 750px;
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

.tab-bar {
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
}

.tab-btn {
  flex: 1;
  padding: 12px 20px;
  border: 1px solid #d0d0d0;
  border-radius: 8px;
  background: #fff;
  font-size: 15px;
  cursor: pointer;
  transition: all 0.2s;
}

.tab-btn:hover {
  border-color: #409eff;
}

.tab-btn.active {
  background: #409eff;
  color: #fff;
  border-color: #409eff;
}

.lf-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.lf-card {
  display: flex;
  gap: 16px;
  padding: 18px 20px;
  border: 1px solid #e8e8e8;
  border-radius: 10px;
  background: #fff;
  transition: box-shadow 0.2s;
}

.lf-card:hover {
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
}

.lf-icon {
  font-size: 36px;
  width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f7fa;
  border-radius: 10px;
  flex-shrink: 0;
}

.lf-body {
  flex: 1;
  min-width: 0;
}

.lf-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 6px;
}

.lf-header h3 {
  margin: 0;
  font-size: 16px;
  color: #333;
}

.lf-type-badge {
  font-size: 11px;
  padding: 2px 8px;
  border-radius: 4px;
  font-weight: 500;
}

.lf-type-badge.lost {
  background: #fef0f0;
  color: #e74c3c;
}

.lf-type-badge.found {
  background: #f0f9eb;
  color: #67c23a;
}

.lf-desc {
  margin: 0 0 8px 0;
  color: #666;
  font-size: 14px;
}

.lf-meta {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  font-size: 12px;
  color: #aaa;
}
</style>
