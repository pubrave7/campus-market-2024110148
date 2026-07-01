<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getLostFounds, type LostFoundItem } from '@/api/lostFound'
import { useFavoriteStore } from '@/stores/favorite'
import EmptyState from '@/components/EmptyState.vue'

const router = useRouter()
const favoriteStore = useFavoriteStore()

const items = ref<LostFoundItem[]>([])
const loading = ref(true)
const activeTab = ref<'lost' | 'found'>('lost')

function filteredItems() {
  return items.value.filter(item => item.type === activeTab.value)
}

function handleFavorite(item: LostFoundItem, event: Event) {
  event.stopPropagation()
  favoriteStore.toggleFavorite({
    id: item.id,
    type: 'lostFound',
    title: item.title,
    seller: item.contact,
    image: item.image,
    time: item.date,
  })
}

onMounted(async () => {
  try {
    items.value = await getLostFounds()
  } catch (err) {
    console.error('获取失物招领数据失败:', err)
  } finally {
    loading.value = false
  }
})
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
    <EmptyState v-if="!loading && filteredItems().length === 0" message="暂无相关信息" />

    <div v-else class="lf-list">
      <div v-for="item in filteredItems()" :key="item.id" class="lf-card" @click="router.push({ path: `/detail/${item.id}`, query: { type: 'lostFound' } })">
        <img v-if="item.image" :src="item.image" :alt="item.title" class="lf-img" />
        <div v-else class="lf-icon">🔍</div>
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
        <button
          class="fav-btn"
          :class="{ favorited: favoriteStore.isFavorited(item.id, 'lostFound') }"
          @click="handleFavorite(item, $event)"
          :title="favoriteStore.isFavorited(item.id, 'lostFound') ? '取消收藏' : '添加收藏'"
        >
          {{ favoriteStore.isFavorited(item.id, 'lostFound') ? '❤️' : '🤍' }}
        </button>
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
  cursor: pointer;
  align-items: center;
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

.lf-img {
  width: 56px;
  height: 56px;
  object-fit: cover;
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

/* ---- 收藏按钮 ---- */
.fav-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 22px;
  padding: 4px;
  transition: transform 0.2s;
  flex-shrink: 0;
  line-height: 1;
}

.fav-btn:hover {
  transform: scale(1.25);
}

.fav-btn.favorited {
  animation: heartBeat 0.3s ease;
}

@keyframes heartBeat {
  0% { transform: scale(1); }
  50% { transform: scale(1.35); }
  100% { transform: scale(1); }
}
</style>
