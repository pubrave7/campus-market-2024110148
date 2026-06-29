<script setup lang="ts">
defineProps<{
  message?: string
}>()
</script>

<template>
  <div class="empty-state">
    <div class="empty-icon">📭</div>
    <p class="empty-text">{{ message || '暂无数据' }}</p>
    <slot />
  </div>
</template>

<style scoped>
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  color: #aaa;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 12px;
}

.empty-text {
  font-size: 15px;
  color: #999;
}
</style>
