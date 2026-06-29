<script setup lang="ts">
defineProps<{
  title: string
  image?: string
  icon?: string
}>()
</script>

<template>
  <div class="item-card">
    <div class="card-image">
      <img v-if="image" :src="image" :alt="title" class="card-img" />
      <span v-else-if="icon" class="card-icon">{{ icon }}</span>
      <span v-else class="card-icon">📦</span>
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
  border-radius: 10px;
  background: #fff;
  overflow: hidden;
  transition: all 0.2s;
  cursor: pointer;
}

.item-card:hover {
  border-color: #409eff;
  box-shadow: 0 4px 16px rgba(64, 158, 255, 0.12);
  transform: translateY(-2px);
}

.card-image {
  height: 100px;
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

.card-icon {
  font-size: 40px;
}

.card-body {
  padding: 14px 16px;
}

.card-title {
  font-size: 15px;
  margin: 0 0 8px 0;
  color: #333;
}

.card-extra {
  margin-bottom: 10px;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
