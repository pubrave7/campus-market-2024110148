<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getTrades, type TradeItem } from '@/api/trade'
import ItemCard from '@/components/ItemCard.vue'
import EmptyState from '@/components/EmptyState.vue'

const router = useRouter()

const items = ref<TradeItem[]>([])
const loading = ref(true)

const categories = ref(['全部', '教材教辅', '数码电子', '生活用品', '出行工具', '文体娱乐'])
const activeCategory = ref('全部')

function filteredItems() {
  if (activeCategory.value === '全部') return items.value
  return items.value.filter(item => item.category === activeCategory.value)
}

onMounted(async () => {
  try {
    items.value = await getTrades()
  } catch (err) {
    console.error('获取二手交易数据失败:', err)
  } finally {
    loading.value = false
  }
})
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
    <EmptyState v-if="!loading && filteredItems().length === 0" message="暂无相关商品" />

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
          <span class="seller">{{ item.seller }}</span>
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

.seller {
  font-size: 12px;
  color: #aaa;
}
</style>
