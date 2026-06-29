<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getTradeById, type TradeItem } from '@/api/trade'
import { getErrandById, type ErrandItem } from '@/api/errand'
import { getGroupBuyById, type GroupBuyItem } from '@/api/groupBuy'
import { getLostFoundById, type LostFoundItem } from '@/api/lostFound'

const route = useRoute()
const router = useRouter()

const itemId = Number(route.params.id)
const itemType = (route.query.type as string) || 'trade'

const loading = ref(true)
const notFound = ref(false)
const item = ref<TradeItem | ErrandItem | GroupBuyItem | LostFoundItem | null>(null)

// 类型中文映射
const typeLabel: Record<string, string> = {
  trade: '二手交易',
  errand: '跑腿委托',
  groupBuy: '拼单搭子',
  lostFound: '失物招领',
}

// 返回列表页路径
const backRoute = computed(() => {
  const map: Record<string, string> = {
    trade: '/trade',
    errand: '/errand',
    groupBuy: '/group-buy',
    lostFound: '/lost-found',
  }
  return map[itemType] || '/'
})

// 是否为指定类型
function isTrade(item: any): item is TradeItem {
  return itemType === 'trade'
}
function isErrand(item: any): item is ErrandItem {
  return itemType === 'errand'
}
function isGroupBuy(item: any): item is GroupBuyItem {
  return itemType === 'groupBuy'
}
function isLostFound(item: any): item is LostFoundItem {
  return itemType === 'lostFound'
}

// 状态标签
function statusLabel(status: string) {
  const map: Record<string, string> = {
    open: '进行中',
    claimed: '已接单',
    done: '已完成',
    closed: '已关闭',
    reserved: '已预定',
  }
  return map[status] || status
}

// 格式化日期
function formatDate(dateStr: string) {
  if (!dateStr) return ''
  return dateStr.replace('T', ' ').slice(0, 16)
}

onMounted(async () => {
  if (!itemId) {
    notFound.value = true
    loading.value = false
    return
  }

  try {
    let result = null
    switch (itemType) {
      case 'trade':
        result = await getTradeById(itemId)
        break
      case 'errand':
        result = await getErrandById(itemId)
        break
      case 'groupBuy':
        result = await getGroupBuyById(itemId)
        break
      case 'lostFound':
        result = await getLostFoundById(itemId)
        break
    }
    if (result) {
      item.value = result
    } else {
      notFound.value = true
    }
  } catch (err) {
    console.error('获取详情失败:', err)
    notFound.value = true
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <section class="detail-page">
    <!-- 加载中 -->
    <div v-if="loading" class="detail-loading">
      <span class="spinner">⏳</span>
      <p>加载中...</p>
    </div>

    <!-- 未找到 -->
    <div v-else-if="notFound" class="detail-empty">
      <span class="empty-icon">🔍</span>
      <h2>内容未找到</h2>
      <p>该{{ typeLabel[itemType] || '内容' }}信息不存在或已被删除</p>
      <router-link :to="backRoute" class="btn-back">← 返回列表</router-link>
    </div>

    <!-- 详细内容 -->
    <template v-else-if="item">
      <!-- 头图 -->
      <div class="detail-hero">
        <img
          v-if="(item as any).image"
          :src="(item as any).image"
          :alt="(item as any).title"
          class="hero-img"
        />
        <div v-else class="hero-placeholder">
          <span class="hero-icon">
            {{ itemType === 'trade' ? '🛒' : itemType === 'errand' ? '🏃' : itemType === 'groupBuy' ? '🤝' : '🔍' }}
          </span>
        </div>
      </div>

      <!-- 基本信息头部 -->
      <div class="detail-head">
        <span class="type-badge">{{ typeLabel[itemType] }}</span>
        <h2>{{ (item as any).title }}</h2>
        <div v-if="isTrade(item)" class="head-price">¥{{ item.price }}</div>
        <div v-else-if="isErrand(item)" class="head-price">¥{{ item.reward }} <span class="unit">酬劳</span></div>
      </div>

      <!-- ====== 二手交易详情 ====== -->
      <div v-if="isTrade(item)" class="detail-card">
        <div class="d-row"><span class="d-label">价格</span><span class="d-value price-highlight">¥{{ item.price }}</span></div>
        <div class="d-row"><span class="d-label">分类</span><span class="d-value">{{ item.category }}</span></div>
        <div class="d-row"><span class="d-label">成色</span><span class="d-value">{{ item.condition }}</span></div>
        <div class="d-row"><span class="d-label">所在校区</span><span class="d-value">{{ item.location }}</span></div>
        <div class="d-row"><span class="d-label">发布者</span><span class="d-value">{{ item.seller }}</span></div>
        <div class="d-row"><span class="d-label">发布时间</span><span class="d-value">{{ item.publishTime }}</span></div>
        <div class="d-row"><span class="d-label">状态</span><span class="d-value status-tag" :class="item.status">{{ statusLabel(item.status) }}</span></div>
        <div v-if="item.description" class="d-row d-col">
          <span class="d-label">描述</span>
          <p class="d-desc">{{ item.description }}</p>
        </div>
      </div>

      <!-- ====== 跑腿委托详情 ====== -->
      <div v-else-if="isErrand(item)" class="detail-card">
        <div class="d-row"><span class="d-label">委托类型</span><span class="d-value">{{ { delivery: '代取/代送', proxy: '代办', other: '其他委托' }[item.type] }}</span></div>
        <div class="d-row"><span class="d-label">酬劳</span><span class="d-value price-highlight">¥{{ item.reward }}</span></div>
        <div class="d-row"><span class="d-label">起点</span><span class="d-value">📍 {{ item.pickupLocation }}</span></div>
        <div class="d-row"><span class="d-label">终点</span><span class="d-value">📍 {{ item.deliveryLocation }}</span></div>
        <div class="d-row"><span class="d-label">截止时间</span><span class="d-value">⏰ {{ item.deadline }}</span></div>
        <div class="d-row"><span class="d-label">发布者</span><span class="d-value">👤 {{ item.publisher }}</span></div>
        <div class="d-row"><span class="d-label">状态</span><span class="d-value status-tag" :class="item.status">{{ statusLabel(item.status) }}</span></div>
        <div class="d-row d-col">
          <span class="d-label">详细描述</span>
          <p class="d-desc">{{ item.description }}</p>
        </div>
      </div>

      <!-- ====== 拼单搭子详情 ====== -->
      <div v-else-if="isGroupBuy(item)" class="detail-card">
        <div class="d-row"><span class="d-label">拼单类型</span><span class="d-value">{{ { 'group-buy': '🛍️ 拼单', 'partner': '🤝 找搭子', 'team': '👥 组队' }[item.type] }}</span></div>
        <div class="d-row">
          <span class="d-label">参与人数</span>
          <span class="d-value">{{ item.currentCount }} / {{ item.targetCount }} 人</span>
        </div>
        <div class="d-row">
          <span class="d-label">进度</span>
          <span class="d-value">
            <div class="mini-progress">
              <div class="mini-fill" :style="{ width: Math.round(item.currentCount / item.targetCount * 100) + '%' }"></div>
            </div>
            <span class="progress-text">{{ Math.round(item.currentCount / item.targetCount * 100) }}%</span>
          </span>
        </div>
        <div class="d-row"><span class="d-label">地点</span><span class="d-value">📍 {{ item.location }}</span></div>
        <div class="d-row"><span class="d-label">截止时间</span><span class="d-value">⏰ {{ item.deadline }}</span></div>
        <div class="d-row"><span class="d-label">发起人</span><span class="d-value">👤 {{ item.initiator }}</span></div>
        <div class="d-row"><span class="d-label">状态</span><span class="d-value status-tag" :class="item.status">{{ statusLabel(item.status) }}</span></div>
        <div class="d-row d-col">
          <span class="d-label">详细描述</span>
          <p class="d-desc">{{ item.description }}</p>
        </div>
      </div>

      <!-- ====== 失物招领详情 ====== -->
      <div v-else-if="isLostFound(item)" class="detail-card">
        <div class="d-row"><span class="d-label">类型</span><span class="d-value">{{ item.type === 'lost' ? '😢 寻物启事' : '🙌 失物招领' }}</span></div>
        <div v-if="item.itemName && item.itemName !== item.title" class="d-row"><span class="d-label">物品名称</span><span class="d-value">{{ item.itemName }}</span></div>
        <div class="d-row"><span class="d-label">地点</span><span class="d-value">📍 {{ item.location }}</span></div>
        <div class="d-row"><span class="d-label">时间</span><span class="d-value">🕐 {{ item.date }}</span></div>
        <div class="d-row"><span class="d-label">联系方式</span><span class="d-value">👤 {{ item.contact }}</span></div>
        <div class="d-row"><span class="d-label">状态</span><span class="d-value status-tag" :class="item.status">{{ statusLabel(item.status) }}</span></div>
        <div class="d-row d-col">
          <span class="d-label">详细描述</span>
          <p class="d-desc">{{ item.description }}</p>
        </div>
      </div>

      <!-- 返回按钮 -->
      <div class="back-link">
        <router-link :to="backRoute">← 返回列表</router-link>
      </div>
    </template>
  </section>
</template>

<style scoped>
.detail-page {
  max-width: 640px;
  margin: 0 auto;
}

/* ---- 加载/空状态 ---- */
.detail-loading,
.detail-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 80px 20px;
  text-align: center;
}

.detail-loading .spinner,
.detail-empty .empty-icon {
  font-size: 48px;
  margin-bottom: 12px;
}

.detail-empty h2 {
  margin-bottom: 8px;
  font-size: 18px;
  color: #666;
}

.detail-empty p {
  color: #999;
  margin-bottom: 20px;
}

.btn-back {
  display: inline-block;
  padding: 10px 20px;
  background: #409eff;
  color: #fff;
  border-radius: 6px;
  text-decoration: none;
  transition: background 0.2s;
}

.btn-back:hover {
  background: #337ecc;
}

/* ---- 头图 ---- */
.detail-hero {
  width: 100%;
  border-radius: 10px;
  overflow: hidden;
  margin-bottom: 20px;
  background: #f5f7fa;
}

.hero-img {
  width: 100%;
  max-height: 320px;
  object-fit: cover;
  display: block;
}

.hero-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 180px;
  background: linear-gradient(135deg, #f5f7fa 0%, #e8ecf1 100%);
}

.hero-icon {
  font-size: 64px;
}

/* ---- 头部信息 ---- */
.detail-head {
  margin-bottom: 20px;
}

.type-badge {
  display: inline-block;
  font-size: 12px;
  padding: 3px 10px;
  background: #f0f7ff;
  color: #409eff;
  border-radius: 4px;
  margin-bottom: 8px;
}

.detail-head h2 {
  margin: 0 0 8px 0;
  font-size: 22px;
  color: #222;
}

.head-price {
  font-size: 28px;
  font-weight: 700;
  color: #e74c3c;
}

.head-price .unit {
  font-size: 14px;
  font-weight: 400;
  color: #999;
  margin-left: 4px;
}

/* ---- 详情卡片 ---- */
.detail-card {
  border: 1px solid #e8e8e8;
  border-radius: 10px;
  background: #fff;
  overflow: hidden;
}

.d-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 14px 20px;
  border-bottom: 1px solid #f5f5f5;
  gap: 20px;
}

.d-row:last-child {
  border-bottom: none;
}

.d-row.d-col {
  flex-direction: column;
  gap: 8px;
}

.d-label {
  font-size: 14px;
  color: #888;
  flex-shrink: 0;
  min-width: 60px;
}

.d-value {
  font-size: 14px;
  color: #333;
  text-align: right;
}

.price-highlight {
  color: #e74c3c;
  font-weight: 700;
}

.d-desc {
  margin: 0;
  font-size: 14px;
  color: #555;
  line-height: 1.8;
  white-space: pre-wrap;
}

/* ---- 状态标签 ---- */
.status-tag {
  font-weight: 500;
}

.status-tag.open { color: #e74c3c; }
.status-tag.claimed { color: #e6a23c; }
.status-tag.done, .status-tag.closed { color: #67c23a; }
.status-tag.reserved { color: #e6a23c; }

/* ---- 进度条 ---- */
.mini-progress {
  display: inline-block;
  width: 100px;
  height: 6px;
  background: #eee;
  border-radius: 3px;
  overflow: hidden;
  vertical-align: middle;
  margin-right: 8px;
}

.mini-fill {
  height: 100%;
  background: linear-gradient(90deg, #67c23a, #409eff);
  border-radius: 3px;
}

.progress-text {
  font-size: 13px;
  color: #888;
  vertical-align: middle;
}

/* ---- 返回 ---- */
.back-link {
  margin-top: 24px;
}

.back-link a {
  color: #409eff;
  text-decoration: none;
  font-size: 14px;
}

.back-link a:hover {
  text-decoration: underline;
}
</style>
