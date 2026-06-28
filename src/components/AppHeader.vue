<script setup lang="ts">
</script>

<template>
  <header class="app-header">
    <div class="header-left">
      <h1 class="app-title" @click="$router.push('/')">🏫 校园轻集市</h1>
      <span class="app-subtitle">二手 · 失物 · 拼单 · 跑腿</span>
    </div>
    <div class="header-right">
      <slot name="nav" />
    </div>
  </header>
</template>

<style scoped>
.app-header {
  background: #fff;
  border-bottom: 1px solid #e8e8e8;
  padding: 0 32px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 56px;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.app-title {
  font-size: 18px;
  font-weight: 700;
  color: #409eff;
  cursor: pointer;
  user-select: none;
  margin: 0;
}

.app-subtitle {
  font-size: 12px;
  color: #bbb;
  padding-left: 12px;
  border-left: 1px solid #e8e8e8;
}

.header-right {
  display: flex;
  align-items: center;
}
</style>
