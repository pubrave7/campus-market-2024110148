<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getGroupBuys, type GroupBuyItem } from '@/api/groupBuy'
import { useFavoriteStore } from '@/stores/favorite'
import EmptyState from '@/components/EmptyState.vue'
import LoadingState from '@/components/LoadingState.vue'
import ErrorState from '@/components/ErrorState.vue'
import SearchBar from '@/components/SearchBar.vue'

const router = useRouter()
const favoriteStore = useFavoriteStore()

const items = ref<GroupBuyItem[]>([])
const loading = ref(true)
const error = ref(false)
const activeType = ref('all')
const keyword = ref('')

const types = [
  { key: 'all', label: '全部', icon: '📋' },
  { key: 'group-buy', label: '拼单', icon: '🛍️' },
  { key: 'partner', label: '找搭子', icon: '🤝' },
  { key: 'team', label: '组队', icon: '👥' },
]

function filteredItems() {
  let list = activeType.value === 'all' ? items.value : items.value.filter(item => item.type === activeType.value)
  if (keyword.value.trim()) {
    const kw = keyword.value.trim().toLowerCase()
    list = list.filter(item =>
      item.title.toLowerCase().includes(kw) ||
      item.description?.toLowerCase().includes(kw) ||
      item.initiator?.toLowerCase().includes(kw)
    )
  }
  return list
}

const searchInfo = computed(() => {
  if (!keyword.value.trim()) return ''
  return `搜索"${keyword.value}"，找到 ${filteredItems().length} 条结果`
})

function typeLabel(key: string) {
  const t = types.find(t => t.key === key)
  return t ? t.label : key
}

function progressPercent(item: GroupBuyItem) {
  return Math.round((item.currentCount / item.targetCount) * 100)
}

function handleFavorite(item: GroupBuyItem, event: Event) {
  event.stopPropagation()
  favoriteStore.toggleFavorite({
    id: item.id,
    type: 'groupBuy',
    title: item.title,
    initiator: item.initiator,
    image: item.image,
    time: item.deadline,
  })
}

async function fetchData() {
  loading.value = true
  error.value = false
  try {
    items.value = await getGroupBuys()
  } catch (err) {
    console.error('获取拼单搭子数据失败:', err)
    error.value = true
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchData()
})
</script>

<template>
  <section class="group-buy-page">
    <div class="page-header">
      <h2>🤝 拼单搭子</h2>
      <p class="page-desc">拼单团购 · 找学习/运动搭子 · 组队参赛</p>
    </div>

    <!-- 搜索栏 -->
    <SearchBar v-model="keyword" placeholder="搜索拼单、搭子、组队..." />

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

    <!-- 搜索结果提示 -->
    <p v-if="searchInfo" class="search-info">{{ searchInfo }}</p>

    <!-- 加载状态 -->
    <LoadingState v-if="loading" message="正在加载拼单信息..." />

    <!-- 错误状态 -->
    <ErrorState v-else-if="error" message="拼单数据加载失败" @retry="fetchData" />

    <!-- 空状态 -->
    <EmptyState v-else-if="filteredItems().length === 0" message="暂无相关拼单" />

    <!-- 拼单列表 -->
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
        <button
          class="fav-btn"
          :class="{ favorited: favoriteStore.isFavorited(item.id, 'groupBuy') }"
          @click="handleFavorite(item, $event)"
          :title="favoriteStore.isFavorited(item.id, 'groupBuy') ? '取消收藏' : '添加收藏'"
        >
          {{ favoriteStore.isFavorited(item.id, 'groupBuy') ? '❤️' : '🤍' }}
        </button>
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

.search-info {
  margin: 0 0 12px 0;
  font-size: 13px;
  color: #888;
  padding: 6px 12px;
  background: #f0f7ff;
  border-radius: 6px;
  display: inline-block;
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
  align-items: center;
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

/* ---- 收藏按钮 ---- */
.fav-btn {
  background: none;
  border: 1px solid #e8e8e8;
  border-radius: 50%;
  cursor: pointer;
  font-size: 18px;
  padding: 6px;
  transition: all 0.2s;
  flex-shrink: 0;
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.fav-btn:hover {
  transform: scale(1.15);
  border-color: #f0c0c0;
}

.fav-btn.favorited {
  background: #fff5f5;
  border-color: #f0a0a0;
  animation: heartBeat 0.3s ease;
}

@keyframes heartBeat {
  0% { transform: scale(1); }
  50% { transform: scale(1.35); }
  100% { transform: scale(1); }
}
</style>
