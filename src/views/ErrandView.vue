<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getErrands, type ErrandItem } from '@/api/errand'
import { useFavoriteStore } from '@/stores/favorite'
import EmptyState from '@/components/EmptyState.vue'
import LoadingState from '@/components/LoadingState.vue'
import ErrorState from '@/components/ErrorState.vue'
import SearchBar from '@/components/SearchBar.vue'

const router = useRouter()
const favoriteStore = useFavoriteStore()

const tasks = ref<ErrandItem[]>([])
const loading = ref(true)
const error = ref(false)
const activeFilter = ref('all')
const keyword = ref('')

const filters = [
  { key: 'all', label: '全部' },
  { key: 'delivery', label: '代取/代送' },
  { key: 'proxy', label: '代办' },
  { key: 'other', label: '其他委托' },
]

function filteredTasks() {
  let list = activeFilter.value === 'all' ? tasks.value : tasks.value.filter(t => t.type === activeFilter.value)
  if (keyword.value.trim()) {
    const kw = keyword.value.trim().toLowerCase()
    list = list.filter(t =>
      t.title.toLowerCase().includes(kw) ||
      t.description?.toLowerCase().includes(kw) ||
      t.publisher?.toLowerCase().includes(kw)
    )
  }
  return list
}

const searchInfo = computed(() => {
  if (!keyword.value.trim()) return ''
  return `搜索"${keyword.value}"，找到 ${filteredTasks().length} 条结果`
})

function statusLabel(status: string) {
  const map: Record<string, string> = { open: '待接单', claimed: '已接单', done: '已完成' }
  return map[status] || status
}

function handleFavorite(task: ErrandItem, event: Event) {
  event.stopPropagation()
  favoriteStore.toggleFavorite({
    id: task.id,
    type: 'errand',
    title: task.title,
    price: task.reward,
    publisher: task.publisher,
    image: task.image,
    time: task.deadline,
  })
}

async function fetchData() {
  loading.value = true
  error.value = false
  try {
    tasks.value = await getErrands()
  } catch (err) {
    console.error('获取跑腿委托数据失败:', err)
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
  <section class="errand-page">
    <div class="page-header">
      <h2>🏃 跑腿委托</h2>
      <p class="page-desc">代取快递 · 代办事务 · 代买代送，让校园生活更便捷</p>
    </div>

    <!-- 搜索栏 -->
    <SearchBar v-model="keyword" placeholder="搜索跑腿委托..." />

    <!-- 筛选标签 -->
    <div class="filter-bar">
      <button
        v-for="f in filters"
        :key="f.key"
        class="filter-tag"
        :class="{ active: activeFilter === f.key }"
        @click="activeFilter = f.key"
      >
        {{ f.label }}
      </button>
    </div>

    <!-- 搜索结果提示 -->
    <p v-if="searchInfo" class="search-info">{{ searchInfo }}</p>

    <!-- 加载状态 -->
    <LoadingState v-if="loading" message="正在加载跑腿任务..." />

    <!-- 错误状态 -->
    <ErrorState v-else-if="error" message="跑腿数据加载失败" @retry="fetchData" />

    <!-- 空状态 -->
    <EmptyState v-else-if="filteredTasks().length === 0" message="暂无相关委托" />

    <!-- 任务列表 -->
    <div v-else class="task-list">
      <div v-for="task in filteredTasks()" :key="task.id" class="task-card" @click="router.push({ path: `/detail/${task.id}`, query: { type: 'errand' } })">
        <div class="task-left">
          <img v-if="task.image" :src="task.image" :alt="task.title" class="task-img" />
          <div v-else class="task-icon">🏃</div>
        </div>
        <div class="task-body">
          <div class="task-header">
            <h3>{{ task.title }}</h3>
            <span class="task-status" :class="task.status">{{ statusLabel(task.status) }}</span>
          </div>
          <p class="task-desc">{{ task.description }}</p>
          <div class="task-meta">
            <span>📍 {{ task.pickupLocation }} → {{ task.deliveryLocation }}</span>
            <span>⏰ {{ task.deadline }}</span>
            <span>👤 {{ task.publisher }}</span>
          </div>
        </div>
        <div class="task-right">
          <span class="reward">¥{{ task.reward }}</span>
          <span class="reward-label">酬劳</span>
        </div>
        <button
          class="fav-btn"
          :class="{ favorited: favoriteStore.isFavorited(task.id, 'errand') }"
          @click="handleFavorite(task, $event)"
          :title="favoriteStore.isFavorited(task.id, 'errand') ? '取消收藏' : '添加收藏'"
        >
          {{ favoriteStore.isFavorited(task.id, 'errand') ? '❤️' : '🤍' }}
        </button>
      </div>
    </div>
  </section>
</template>

<style scoped>
.errand-page {
  max-width: 800px;
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

.filter-bar {
  display: flex;
  gap: 8px;
  margin-bottom: 24px;
}

.filter-tag {
  padding: 6px 16px;
  border: 1px solid #d0d0d0;
  border-radius: 16px;
  background: #fff;
  font-size: 13px;
  color: #666;
  cursor: pointer;
  transition: all 0.2s;
}

.filter-tag:hover {
  border-color: #409eff;
  color: #409eff;
}

.filter-tag.active {
  background: #409eff;
  color: #fff;
  border-color: #409eff;
}

.task-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.task-card {
  display: flex;
  gap: 16px;
  padding: 18px 20px;
  border: 1px solid #e8e8e8;
  border-radius: 10px;
  background: #fff;
  transition: box-shadow 0.2s;
  align-items: center;
  cursor: pointer;
}

.task-card:hover {
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
}

.task-left {
  flex-shrink: 0;
}

.task-icon {
  font-size: 36px;
  width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f7fa;
  border-radius: 10px;
}

.task-img {
  width: 56px;
  height: 56px;
  object-fit: cover;
  border-radius: 10px;
}

.task-body {
  flex: 1;
  min-width: 0;
}

.task-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 6px;
}

.task-header h3 {
  margin: 0;
  font-size: 16px;
  color: #333;
}

.task-status {
  font-size: 11px;
  padding: 2px 8px;
  border-radius: 4px;
  font-weight: 500;
}

.task-status.open {
  background: #fef0f0;
  color: #e74c3c;
}

.task-status.claimed {
  background: #fdf6ec;
  color: #e6a23c;
}

.task-status.done {
  background: #f0f9eb;
  color: #67c23a;
}

.task-desc {
  margin: 0 0 8px 0;
  color: #666;
  font-size: 13px;
}

.task-meta {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  font-size: 12px;
  color: #aaa;
}

.task-right {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-shrink: 0;
  min-width: 60px;
}

.reward {
  font-size: 22px;
  font-weight: 700;
  color: #e74c3c;
}

.reward-label {
  font-size: 11px;
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
