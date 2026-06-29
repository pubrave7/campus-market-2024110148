<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getGroupBuys, type GroupBuyItem } from '@/api/groupBuy'
import EmptyState from '@/components/EmptyState.vue'

const router = useRouter()

const items = ref<GroupBuyItem[]>([])
const loading = ref(true)
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

function progressPercent(item: GroupBuyItem) {
  return Math.round((item.currentCount / item.targetCount) * 100)
}

onMounted(async () => {
  try {
    items.value = await getGroupBuys()
  } catch (err) {
    console.error('获取拼单搭子数据失败:', err)
  } finally {
    loading.value = false
  }
})
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
    <EmptyState v-if="!loading && filteredItems().length === 0" message="暂无相关拼单" />

    <div v-else class="group-list">
      <div v-for="item in filteredItems()" :key="item.id" class="group-card" @click="router.push({ path: `/detail/${item.id}`, query: { type: 'groupBuy' } })">
        <div class="gc-left">
          <img v-if="item.image" :src="item.image" :alt="item.title" class="gc-img" />
          <div v-else class="gc-icon">🤝</div>
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
            <span>👥 {{ item.currentCount }}/{{ item.targetCount }}人</span>
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
  cursor: pointer;
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

.gc-img {
  width: 56px;
  height: 56px;
  object-fit: cover;
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
