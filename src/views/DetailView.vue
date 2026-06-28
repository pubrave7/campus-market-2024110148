<script setup lang="ts">
import { useRoute } from 'vue-router'

const route = useRoute()
const itemId = route.params.id
</script>

<template>
  <section class="detail-page">
    <h2>商品详情</h2>
    <p class="page-desc">查看商品详细信息（商品 ID：{{ itemId }}）</p>

    <div class="detail-card">
      <div class="detail-row">
        <span class="label">商品名称</span>
        <span class="value">示例商品 #{{ itemId }}</span>
      </div>
      <div class="detail-row">
        <span class="label">价格</span>
        <span class="value price">¥99.00</span>
      </div>
      <div class="detail-row">
        <span class="label">发布者</span>
        <span class="value">张同学</span>
      </div>
      <div class="detail-row">
        <span class="label">描述</span>
        <span class="value">这是一个示例商品详情页面，后续将接入真实数据。</span>
      </div>
      <div class="detail-row">
        <span class="label">发布时间</span>
        <span class="value">2026-06-28</span>
      </div>
    </div>

    <div class="back-link">
      <router-link to="/list">← 返回列表</router-link>
    </div>
  </section>
</template>

<style scoped>
.detail-page {
  max-width: 600px;
  margin: 0 auto;
}

h2 {
  margin-bottom: 8px;
}

.page-desc {
  color: #666;
  margin-bottom: 24px;
}

.detail-card {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 24px;
  background: #fafafa;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px solid #eee;
}

.detail-row:last-child {
  border-bottom: none;
}

.label {
  color: #888;
  font-weight: 500;
}

.value {
  color: #333;
}

.price {
  color: #e74c3c;
  font-weight: bold;
  font-size: 18px;
}

.back-link {
  margin-top: 24px;
}

.back-link a {
  color: #409eff;
  text-decoration: none;
}

.back-link a:hover {
  text-decoration: underline;
}
</style>
