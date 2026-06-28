<script setup lang="ts">
import { ref } from 'vue'

const features = ref([
  { icon: '🛒', title: '二手交易', desc: '买卖闲置物品，让好物流转起来', link: '/trade' },
  { icon: '🔍', title: '失物招领', desc: '发布寻物与招领，互帮互助', link: '/lost-found' },
  { icon: '🤝', title: '拼单搭子', desc: '团购拼单、找学习运动搭子', link: '/group-buy' },
  { icon: '🏃', title: '跑腿委托', desc: '代取快递、代办事务、代买代送', link: '/errand' },
  { icon: '✏️', title: '发布信息', desc: '发布商品、失物、拼单或委托', link: '/publish' },
  { icon: '💬', title: '消息中心', desc: '查看私信与系统通知', link: '/message' },
])

const announcements = ref([
  '📢 平台试运行期间，所有服务免费使用',
  '🎉 完成新手任务可获得信用积分',
  '⚠️ 交易请注意核实对方身份，谨防诈骗',
])
</script>

<template>
  <section class="home-page">
    <div class="hero">
      <h2>欢迎来到校园轻集市 🎉</h2>
      <p>二手交易 · 失物招领 · 拼单搭子 · 跑腿委托 — 一站式校园生活服务平台</p>
    </div>

    <div class="feature-grid">
      <router-link
        v-for="feat in features"
        :key="feat.link"
        :to="feat.link"
        class="feature-card"
      >
        <span class="feat-icon">{{ feat.icon }}</span>
        <div class="feat-text">
          <h3>{{ feat.title }}</h3>
          <p>{{ feat.desc }}</p>
        </div>
      </router-link>
    </div>

    <div class="info-section">
      <div class="tips">
        <h3>📌 快速入门</h3>
        <ol>
          <li>点击 <strong>二手交易</strong> 浏览校园闲置好物</li>
          <li>点击 <strong>失物招领</strong> 发布或查找失物信息</li>
          <li>点击 <strong>拼单搭子</strong> 发起拼单或寻找搭子</li>
          <li>点击 <strong>跑腿委托</strong> 发布或接受委托任务</li>
          <li>点击 <strong>发布</strong> 发布任何类型的校园信息</li>
        </ol>
      </div>

      <div class="announcements">
        <h3>📣 公告</h3>
        <ul>
          <li v-for="(item, idx) in announcements" :key="idx">{{ item }}</li>
        </ul>
      </div>
    </div>
  </section>
</template>

<style scoped>
.home-page {
  max-width: 800px;
  margin: 0 auto;
}

.hero {
  text-align: center;
  padding: 40px 0 28px;
}

.hero h2 {
  font-size: 28px;
  margin-bottom: 10px;
  color: #333;
}

.hero p {
  color: #888;
  font-size: 15px;
}

.feature-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin: 24px 0 32px;
}

.feature-card {
  border: 1px solid #e0e0e0;
  border-radius: 10px;
  padding: 24px 18px;
  background: #fff;
  transition: all 0.2s;
  cursor: pointer;
  text-align: center;
}

.feature-card:hover {
  border-color: #409eff;
  box-shadow: 0 4px 16px rgba(64, 158, 255, 0.15);
  transform: translateY(-2px);
}

.feat-icon {
  font-size: 40px;
  display: block;
  margin-bottom: 12px;
}

.feat-text h3 {
  font-size: 16px;
  margin-bottom: 4px;
  color: #333;
}

.feat-text p {
  font-size: 13px;
  color: #999;
  margin: 0;
}

.info-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.tips,
.announcements {
  background: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 10px;
  padding: 20px 24px;
}

.tips h3,
.announcements h3 {
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

.announcements ul {
  list-style: none;
  padding: 0;
}

.announcements li {
  font-size: 13px;
  color: #666;
  padding: 6px 0;
  border-bottom: 1px dashed #f0f0f0;
}

.announcements li:last-child {
  border-bottom: none;
}
</style>
