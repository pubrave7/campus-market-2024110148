<script setup lang="ts">
import { ref } from 'vue'

interface GroupItem {
  id: number
  type: 'group-buy' | 'partner' | 'team'
  title: string
  description: string
  target: number
  current: number
  deadline: string
  initiator: string
  icon: string
}

const items = ref<GroupItem[]>([
  { id: 1, type: 'group-buy', title: '水果拼单 — 当季芒果', description: '云南大青芒，5斤装，满3人即可成团', target: 3, current: 2, deadline: '2026-06-30', initiator: '周同学', icon: '🥭' },
  { id: 2, type: 'partner', title: '考研搭子 — 图书馆自习', description: '寻找每天一起泡图书馆的考研搭子，互相监督', target: 4, current: 2, deadline: '2026-07-05', initiator: '吴同学', icon: '📖' },
  { id: 3, type: 'team', title: '组队 — 校园创业大赛', description: '招募前端开发1名、UI设计1名，已有产品+后端', target: 5, current: 3, deadline: '2026-07-10', initiator: '郑同学', icon: '🏆' },
  { id: 4, type: 'group-buy', title: '零食拼单 — 坚果大礼包', description: '三只松鼠坚果礼盒，满5人享受团购价8折', target: 5, current: 3, deadline: '2026-06-29', initiator: '钱同学', icon: '🥜' },
  { id: 5, type: 'partner', title: '运动搭子 — 夜跑/晨跑', description: '寻找一起跑步的小伙伴，配速6-7分钟/公里', target: 2, current: 1, deadline: '2026-07-03', initiator: '冯同学', icon: '🏃' },
  { id: 6, type: 'group-buy', title: '教材团购 — 考研数学', description: '李永乐考研数学复习全书，满10人享7折', target: 10, current: 6, deadline: '2026-07-08', initiator: '褚同学', icon: '📘' },
])

const activeType = ref('all')

const types = [
  { key: 'all', label: '全部', icon: '📋' },
  { key: 'group-buy', label: '拼单', icon: '🛍️' },
  { key: 'partner', label: '找搭子', icon: '🤝' },
  { key: 'team', label: '组队', icon: '👥' },
]

function filteredItems() {
  if (activeType.value === 'all') return items.value
  return items.value.filter(item => item.type === activeType.value)
}

function typeLabel(key: string) {
  const t = types.find(t => t.key === key)
  return t ? t.label : key
}

function progressPercent(item: GroupItem) {
  return Math.round((item.current / item.target) * 100)
}
</script>

<template>
  <section class="group-buy-page">
    <div class="page-header">
      <h2>🤝 拼单搭子</h2>
      <p class="page-desc">拼单团购 · 找学习/运动搭子 · 组队参赛</p>
    </div>

    <!-- 类型筛选 -->
    <div class="type-filter">
      <button
        v-for="t in types"
        :key="t.key"
        class="filter-btn"
        :class="{ active: activeType === t.key }"
        @click="activeType = t.key"
      >
        {{ t.icon }} {{ t.label }}
      </button>
    </div>

    <!-- 拼单列表 -->
    <div class="group-list">
      <div v-for="item in filteredItems()" :key="item.id" class="group-card">
        <div class="gc-left">
          <div class="gc-icon">{{ item.icon }}</div>
        </div>
        <div class="gc-body">
          <div class="gc-header">
            <h3>{{ item.title }}</h3>
            <span class="gc-type-tag">{{ typeLabel(item.type) }}</span>
          </div>
          <p class="gc-desc">{{ item.description }}</p>
          <div class="gc-progress-bar">
            <div class="gc-progress-fill" :style="{ width: progressPercent(item) + '%' }"></div>
          </div>
          <div class="gc-meta">
            <span>👤 {{ item.initiator }}</span>
            <span>👥 {{ item.current }}/{{ item.target }}人</span>
            <span>⏰ {{ item.deadline }}</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.group-buy-page {
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

.type-filter {
  display: flex;
  gap: 8px;
  margin-bottom: 24px;
}

.filter-btn {
  padding: 8px 18px;
  border: 1px solid #d0d0d0;
  border-radius: 20px;
  background: #fff;
  font-size: 14px;
  color: #555;
  cursor: pointer;
  transition: all 0.2s;
}

.filter-btn:hover {
  border-color: #409eff;
  color: #409eff;
}

.filter-btn.active {
  background: #409eff;
  color: #fff;
  border-color: #409eff;
}

.group-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.group-card {
  display: flex;
  gap: 16px;
  padding: 18px 20px;
  border: 1px solid #e8e8e8;
  border-radius: 10px;
  background: #fff;
  transition: box-shadow 0.2s;
}

.group-card:hover {
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
}

.gc-left {
  flex-shrink: 0;
}

.gc-icon {
  font-size: 36px;
  width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f7fa;
  border-radius: 10px;
}

.gc-body {
  flex: 1;
  min-width: 0;
}

.gc-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 6px;
}

.gc-header h3 {
  margin: 0;
  font-size: 16px;
  color: #333;
}

.gc-type-tag {
  font-size: 11px;
  padding: 2px 8px;
  border-radius: 4px;
  background: #f0f7ff;
  color: #409eff;
}

.gc-desc {
  margin: 0 0 10px 0;
  color: #666;
  font-size: 13px;
}

.gc-progress-bar {
  height: 6px;
  background: #eee;
  border-radius: 3px;
  margin-bottom: 10px;
  overflow: hidden;
}

.gc-progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #67c23a, #409eff);
  border-radius: 3px;
  transition: width 0.3s;
}

.gc-meta {
  display: flex;
  gap: 16px;
  font-size: 12px;
  color: #aaa;
}
</style>
