<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  title: string
  image?: string
}>(), {})

/** 无图片时取标题前两个字作为占位符 */
const placeholder = computed(() => {
  const t = props.title.trim()
  return t.slice(0, 2) || 'No'
})

/** 根据标题生成稳定的背景色 */
const bgColor = computed(() => {
  let hash = 0
  for (let i = 0; i < props.title.length; i++) {
    hash = props.title.charCodeAt(i) + ((hash << 5) - hash)
  }
  const hue = Math.abs(hash % 360)
  return `hsl(${hue}, 55%, 88%)`
})

const textColor = computed(() => {
  let hash = 0
  for (let i = 0; i < props.title.length; i++) {
    hash = props.title.charCodeAt(i) + ((hash << 5) - hash)
  }
  const hue = Math.abs(hash % 360)
  return `hsl(${hue}, 50%, 35%)`
})
</script>

<template>
  <div class="item-card">
    <div class="card-image">
      <img v-if="image" :src="image" :alt="title" class="card-img" />
      <div v-else class="card-placeholder" :style="{ background: bgColor, color: textColor }">
        <span class="placeholder-text">{{ placeholder }}</span>
      </div>
    </div>
    <div class="card-body">
      <h3 class="card-title">{{ title }}</h3>
      <div class="card-extra">
        <slot name="meta" />
      </div>
      <div class="card-footer">
        <slot name="footer" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.item-card {
  border: 1px solid #e8e8e8;
  border-radius: 12px;
  background: #fff;
  overflow: hidden;
  transition: all 0.2s;
  cursor: pointer;
}

.item-card:hover {
  border-color: #409eff;
  box-shadow: 0 6px 20px rgba(64, 158, 255, 0.12);
  transform: translateY(-3px);
}

.card-image {
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f7fa;
}

.card-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.card-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  font-weight: 800;
  letter-spacing: 1px;
}

.placeholder-text {
  opacity: 0.8;
}

.card-body {
  padding: 16px;
}

.card-title {
  font-size: 15px;
  margin: 0 0 10px 0;
  color: #222;
  font-weight: 600;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-extra {
  margin-bottom: 12px;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
