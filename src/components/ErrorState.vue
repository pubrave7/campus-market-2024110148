<script setup lang="ts">
/**
 * ErrorState —— 错误状态组件
 *
 * 用于接口请求失败时给出用户可见提示，并支持重试。
 *
 * Props:
 *   message     - 错误提示文字
 *   showRetry   - 是否显示"重新加载"按钮
 *
 * Events:
 *   retry       - 点击重新加载时触发
 */
withDefaults(defineProps<{
  message?: string
  showRetry?: boolean
}>(), {
  message: '数据加载失败，请检查网络连接',
  showRetry: true,
})

const emit = defineEmits<{
  retry: []
}>()

function handleRetry() {
  emit('retry')
}
</script>

<template>
  <div class="error-state">
    <div class="error-icon">⚠️</div>
    <p class="error-text">{{ message }}</p>
    <p v-if="showRetry" class="error-hint">
      请确认已在新终端执行 <code>npm run mock</code> 启动 Mock 服务
    </p>
    <button v-if="showRetry" class="retry-btn" @click="handleRetry">
      🔄 重新加载
    </button>
    <slot />
  </div>
</template>

<style scoped>
.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
}

.error-icon {
  font-size: 48px;
  margin-bottom: 12px;
  opacity: 0.8;
}

.error-text {
  font-size: 15px;
  color: #e74c3c;
  margin: 0 0 8px 0;
  font-weight: 500;
}

.error-hint {
  font-size: 13px;
  color: #aaa;
  margin: 0 0 20px 0;
}

.error-hint code {
  background: #f5f5f5;
  padding: 2px 6px;
  border-radius: 3px;
  font-size: 12px;
  color: #666;
}

.retry-btn {
  padding: 10px 24px;
  background: #409eff;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.retry-btn:hover {
  background: #337ecc;
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.3);
}
</style>
