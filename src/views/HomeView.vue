<script setup lang="ts">
const features = [
  { icon: '🛒', title: '二手交易', desc: '买卖闲置物品', color: '#409eff', bg: '#e8f4fd', link: '/trade' },
  { icon: '🔍', title: '失物招领', desc: '寻物与招领', color: '#7c3aed', bg: '#f3f0ff', link: '/lost-found' },
  { icon: '🤝', title: '拼单搭子', desc: '拼单找搭子', color: '#67c23a', bg: '#f0f9eb', link: '/group-buy' },
  { icon: '🏃', title: '跑腿委托', desc: '代取代办代送', color: '#e6a23c', bg: '#fdf6ec', link: '/errand' },
  { icon: '✏️', title: '发布信息', desc: '发布交易信息', color: '#e74c3c', bg: '#fef5f5', link: '/publish' },
  { icon: '💬', title: '消息中心', desc: '私信与通知', color: '#06b6d4', bg: '#ecfeff', link: '/message' },
]

const announcements = [
  '📢 平台试运行期间，所有服务免费使用',
  '🎉 完成新手任务可获得信用积分',
  '⚠️ 交易请注意核实对方身份，谨防诈骗',
]
</script>

<template>
  <section class="home-page">
    <!-- 欢迎横幅 -->
    <div class="hero">
      <div class="hero-card">
        <div class="hero-emoji">🎓</div>
        <h2>校园轻集市</h2>
        <p>二手交易 · 失物招领 · 拼单搭子 · 跑腿委托</p>
        <p class="hero-sub">一站式的校园生活服务平台，让校园生活更便捷 ✨</p>
      </div>
    </div>

    <!-- 功能入口 -->
    <div class="feature-grid">
      <router-link
        v-for="feat in features"
        :key="feat.link"
        :to="feat.link"
        class="feature-card"
      >
        <div class="feat-icon-wrap" :style="{ background: feat.bg }">
          <span class="feat-icon">{{ feat.icon }}</span>
        </div>
        <div class="feat-text">
          <h3 :style="{ color: feat.color }">{{ feat.title }}</h3>
          <p>{{ feat.desc }}</p>
        </div>
        <span class="feat-arrow">→</span>
      </router-link>
    </div>

    <!-- 底部信息 -->
    <div class="bottom-section">
      <div class="tips-card">
        <h3>📌 快速入门</h3>
        <ol>
          <li>注册账号并登录</li>
          <li>浏览感兴趣的校园信息</li>
          <li>发布你的二手、拼单或委托</li>
          <li>收藏关注的信息，随时查看</li>
        </ol>
      </div>

      <div class="announce-card">
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
  max-width: 860px;
  margin: 0 auto;
}

/* ====== 欢迎横幅 ====== */
.hero {
  text-align: center;
  padding: 20px 0 32px;
}

.hero-card {
  background: #fff;
  border-radius: 20px;
  padding: 48px 24px;
  border: 1px solid #e8e8e8;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.03);
}

.hero-emoji {
  font-size: 56px;
  margin-bottom: 16px;
}

.hero-card h2 {
  font-size: 30px;
  margin: 0 0 10px 0;
  color: #222;
  font-weight: 800;
  letter-spacing: -0.5px;
}

.hero-card > p {
  color: #888;
  font-size: 15px;
  margin: 0;
}

.hero-sub {
  margin-top: 8px !important;
  color: #bbb !important;
  font-size: 14px !important;
}

/* ====== 功能入口 ====== */
.feature-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 14px;
  margin-bottom: 32px;
}

.feature-card {
  display: flex;
  align-items: center;
  gap: 14px;
  border: 1px solid #e8e8e8;
  border-radius: 14px;
  padding: 20px;
  background: #fff;
  transition: all 0.25s;
  cursor: pointer;
  text-decoration: none;
  position: relative;
  overflow: hidden;
}

.feature-card:hover {
  border-color: #409eff;
  box-shadow: 0 6px 24px rgba(64, 158, 255, 0.12);
  transform: translateY(-2px);
}

.feat-icon-wrap {
  width: 52px;
  height: 52px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.feat-icon {
  font-size: 28px;
}

.feat-text {
  flex: 1;
  min-width: 0;
}

.feat-text h3 {
  font-size: 16px;
  margin: 0 0 3px 0;
  font-weight: 700;
}

.feat-text p {
  font-size: 13px;
  color: #aaa;
  margin: 0;
}

.feat-arrow {
  font-size: 18px;
  color: #ddd;
  flex-shrink: 0;
  transition: all 0.2s;
}

.feature-card:hover .feat-arrow {
  color: #409eff;
  transform: translateX(3px);
}

/* ====== 底部信息 ====== */
.bottom-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.tips-card,
.announce-card {
  background: #fff;
  border: 1px solid #e8e8e8;
  border-radius: 14px;
  padding: 24px;
}

.tips-card h3,
.announce-card h3 {
  font-size: 16px;
  margin: 0 0 14px 0;
  color: #333;
}

.tips-card ol {
  padding-left: 20px;
  color: #666;
  font-size: 14px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.tips-card li {
  padding: 2px 0;
}

.announce-card ul {
  list-style: none;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.announce-card li {
  font-size: 13px;
  color: #666;
  padding: 8px 12px;
  background: #fafafa;
  border-radius: 8px;
  transition: background 0.15s;
}

.announce-card li:hover {
  background: #f0f7ff;
}

@media (max-width: 700px) {
  .feature-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .bottom-section {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .feature-grid {
    grid-template-columns: 1fr;
  }
}
</style>
