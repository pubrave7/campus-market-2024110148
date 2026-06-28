<script setup lang="ts">
import { ref } from 'vue'

const features = ref([
  { icon: '📋', title: '浏览商品', desc: '发现校园里的好物', link: '/list' },
  { icon: '✏️', title: '发布闲置', desc: '让闲置流转起来', link: '/publish' },
  { icon: '💬', title: '消息互动', desc: '与买卖家实时沟通', link: '/messages' },
  { icon: '📊', title: '数据看板', desc: '了解平台运营动态', link: '/board' },
])
</script>

<template>
  <section class="home-page">
    <div class="hero">
      <h2>欢迎来到校园轻集市 🎉</h2>
      <p>二手交易 · 闲置流转 · 绿色校园</p>
    </div>

    <div class="feature-grid">
      <router-link
        v-for="feat in features"
        :key="feat.link"
        :to="feat.link"
        class="feature-card"
      >
        <span class="feat-icon">{{ feat.icon }}</span>
        <h3>{{ feat.title }}</h3>
        <p>{{ feat.desc }}</p>
      </router-link>
    </div>

    <div class="tips">
      <h3>📌 快速入门</h3>
      <ol>
        <li>点击 <strong>列表</strong> 浏览在售商品</li>
        <li>点击 <strong>发布</strong> 上架你的闲置物品</li>
        <li>点击 <strong>消息</strong> 查看买家/卖家留言</li>
        <li>进入 <strong>我的</strong> 管理个人资料</li>
      </ol>
    </div>
  </section>
</template>

<style scoped>
.home-page {
  max-width: 700px;
  margin: 0 auto;
}

.hero {
  text-align: center;
  padding: 40px 0 20px;
}

.hero h2 {
  font-size: 26px;
  margin-bottom: 8px;
  color: #333;
}

.hero p {
  color: #888;
  font-size: 16px;
}

.feature-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin: 24px 0 32px;
}

.feature-card {
  border: 1px solid #e0e0e0;
  border-radius: 10px;
  padding: 24px 16px;
  text-align: center;
  background: #fff;
  transition: all 0.2s;
  cursor: pointer;
}

.feature-card:hover {
  border-color: #409eff;
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.15);
  transform: translateY(-2px);
}

.feat-icon {
  font-size: 36px;
  display: block;
  margin-bottom: 10px;
}

.feature-card h3 {
  font-size: 15px;
  margin-bottom: 4px;
  color: #333;
}

.feature-card p {
  font-size: 13px;
  color: #999;
  margin: 0;
}

.tips {
  background: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 10px;
  padding: 20px 24px;
}

.tips h3 {
  font-size: 16px;
  margin-bottom: 12px;
}

.tips ol {
  padding-left: 20px;
  color: #555;
  font-size: 14px;
}

.tips li {
  padding: 4px 0;
}

.tips strong {
  color: #409eff;
}
</style>
