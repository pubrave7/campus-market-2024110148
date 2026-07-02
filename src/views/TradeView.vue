<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getTrades, type TradeItem } from '@/api/trade'
import { useFavoriteStore } from '@/stores/favorite'
import ItemCard from '@/components/ItemCard.vue'
import EmptyState from '@/components/EmptyState.vue'
import LoadingState from '@/components/LoadingState.vue'
import ErrorState from '@/components/ErrorState.vue'
import SearchBar from '@/components/SearchBar.vue'

const router = useRouter()
const favoriteStore = useFavoriteStore()

const items = ref<TradeItem[]>([])
const loading = ref(true)
const error = ref(false)
const keyword = ref('')

const categories = ref(['全部', '教材教辅', '数码电子', '生活用品', '出行工具', '文体娱乐'])
const activeCategory = ref('全部')

/** 先按分类过滤，再按关键词搜索 */
function filteredItems() {
  let list = activeCategory.value === '全部' ? items.value : items.value.filter(item => item.category === activeCategory.value)
  if (keyword.value.trim()) {
    const kw = keyword.value.trim().toLowerCase()
    list = list.filter(item =>
      item.title.toLowerCase().includes(kw) ||
      item.seller.toLowerCase().includes(kw) ||
      item.description?.toLowerCase().includes(kw)
    )
  }
  return list
}

/** 搜索结果数量描述 */
const searchInfo = computed(() => {
  if (!keyword.value.trim()) return ''
  const count = filteredItems().length
  return `搜索"${keyword.value}"，找到 ${count} 条结果`
})

function handleFavorite(item: TradeItem, event: Event) {
  event.stopPropagation()
  favoriteStore.toggleFavorite({
    id: item.id,
    type: 'trade',
    title: item.title,
    price: item.price,
    seller: item.seller,
    image: item.image,
  })
}

async function fetchData() {
  loading.value = true
  error.value = false
  try {
    items.value = await getTrades()
  } catch (err) {
    console.error('获取二手交易数据失败:', err)
    error.value = true
  } finally {
    loading.value = false
  }
}

function handleClear() {
  activeCategory.value = '全部'
}

onMounted(() => {
  fetchData()
})
</script>

<template>
  <section class="trade-page">
    <div class="page-header">
      <h2>🛒 二手交易</h2>
      <p class="page-desc">发现校园好物，让闲置流转起来</p>
    </div>

    <!-- 搜索栏 -->
    <SearchBar v-model="keyword" placeholder="搜索商品名称、卖家..." @clear="handleClear" />

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

    <!-- 搜索结果提示 -->
    <p v-if="searchInfo" class="search-info">{{ searchInfo }}</p>

    <!-- 加载状态 -->
    <LoadingState v-if="loading" message="正在加载商品列表..." />

    <!-- 错误状态 -->
    <ErrorState v-else-if="error" message="商品数据加载失败" @retry="fetchData" />

    <!-- 空状态 -->
    <EmptyState v-else-if="filteredItems().length === 0" message="暂无相关商品" />

    <!-- 商品列表 -->
    <div v-else class="trade-grid">
      <ItemCard
        v-for="item in filteredItems()"
        :key="item.id"
        :title="item.title"
        :image="item.image"
        @click="router.push({ path: `/detail/${item.id}`, query: { type: 'trade' } })"
      >
        <template #meta>
          <span class="tag">{{ item.category }}</span>
          <span class="condition">{{ item.condition }}</span>
        </template>
        <template #footer>
          <span class="price">¥{{ item.price }}</span>
          <div class="footer-right">
            <button
              class="fav-btn"
              :class="{ favorited: favoriteStore.isFavorited(item.id, 'trade') }"
              @click="handleFavorite(item, $event)"
              :title="favoriteStore.isFavorited(item.id, 'trade') ? '取消收藏' : '添加收藏'"
            >
              {{ favoriteStore.isFavorited(item.id, 'trade') ? '❤️' : '🤍' }}
            </button>
            <span class="seller">{{ item.seller }}</span>
          </div>
        </template>
      </ItemCard>
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

.search-info {
  margin: 0 0 12px 0;
  font-size: 13px;
  color: #888;
  padding: 6px 12px;
  background: #f0f7ff;
  border-radius: 6px;
  display: inline-block;
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

.tag {
  font-size: 11px;
  padding: 2px 8px;
  background: #f0f7ff;
  color: #409eff;
  border-radius: 4px;
  margin-right: 8px;
}

.condition {
  font-size: 12px;
  color: #999;
}

.price {
  font-size: 18px;
  font-weight: 700;
  color: #e74c3c;
}

.footer-right {
  display: flex;
  align-items: center;
  gap: 8px;
}

.fav-btn {
  background: none;
  border: 1px solid #e8e8e8;
  border-radius: 50%;
  cursor: pointer;
  font-size: 16px;
  padding: 6px;
  transition: all 0.2s;
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

.seller {
  font-size: 12px;
  color: #aaa;
}

@media (max-width: 768px) {
  .trade-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 480px) {
  .trade-grid {
    grid-template-columns: 1fr;
  }
}
</style>
