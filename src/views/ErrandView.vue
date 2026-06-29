<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getErrands, type ErrandItem } from '@/api/errand'
import EmptyState from '@/components/EmptyState.vue'

const router = useRouter()

const tasks = ref<ErrandItem[]>([])
const loading = ref(true)
const activeFilter = ref('all')

const filters = [
  { key: 'all', label: '全部' },
  { key: 'delivery', label: '代取/代送' },
  { key: 'proxy', label: '代办' },
  { key: 'other', label: '其他委托' },
]

function filteredTasks() {
  if (activeFilter.value === 'all') return tasks.value
  return tasks.value.filter(t => t.type === activeFilter.value)
}

function statusLabel(status: string) {
  const map: Record<string, string> = { open: '待接单', claimed: '已接单', done: '已完成' }
  return map[status] || status
}

onMounted(async () => {
  try {
    tasks.value = await getErrands()
  } catch (err) {
    console.error('获取跑腿委托数据失败:', err)
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <section class="errand-page">
    <div class="page-header">
      <h2>🏃 跑腿委托</h2>
      <p class="page-desc">代取快递 · 代办事务 · 代买代送，让校园生活更便捷</p>
    </div>

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

    <!-- 任务列表 -->
    <EmptyState v-if="!loading && filteredTasks().length === 0" message="暂无相关委托" />

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
</style>
