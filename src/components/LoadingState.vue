<script setup lang="ts">
/**
 * LoadingState —— 加载状态组件
 *
 * 用于列表页面请求数据时展示加载状态。
 *
 * Props:
 *   message - 加载提示文字
 *   size    - 加载动画大小: 'small' | 'medium' | 'large'
 */
withDefaults(defineProps<{
  message?: string
  size?: 'small' | 'medium' | 'large'
}>(), {
  message: '加载中...',
  size: 'medium',
})
</script>

<template>
  <div class="loading-state" :class="`size-${size}`">
    <div class="spinner">
      <div class="spinner-ring"></div>
      <div class="spinner-ring spinner-ring-inner"></div>
    </div>
    <p class="loading-text">{{ message }}</p>
  </div>
</template>

<style scoped>
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  color: #999;
}

/* 大小 */
.size-small {
  padding: 24px 20px;
}

.size-small .spinner {
  width: 28px;
  height: 28px;
}

.size-small .loading-text {
  font-size: 13px;
}

.size-large {
  padding: 80px 20px;
}

.size-large .spinner {
  width: 52px;
  height: 52px;
}

.size-large .loading-text {
  font-size: 16px;
}

/* 旋转动画 */
.spinner {
  width: 40px;
  height: 40px;
  position: relative;
  margin-bottom: 16px;
}

.spinner-ring {
  position: absolute;
  inset: 0;
  border: 3px solid #e8e8e8;
  border-radius: 50%;
  border-top-color: #409eff;
  animation: spin 0.8s linear infinite;
}

.spinner-ring-inner {
  inset: 6px;
  border-width: 2px;
  border-top-color: #67c23a;
  animation-duration: 1.2s;
  animation-direction: reverse;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.loading-text {
  margin: 0;
  font-size: 14px;
  color: #aaa;
}
</style>
