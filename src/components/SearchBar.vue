<script setup lang="ts">
/**
 * SearchBar —— 搜索栏组件
 *
 * 用于列表页面的关键词搜索，支持防抖。
 *
 * Props:
 *   modelValue  - 当前搜索关键词 (v-model)
 *   placeholder - 搜索框占位文字
 *
 * Events:
 *   update:modelValue - 搜索关键词变更
 *   search           - 用户主动触发搜索（回车 / 点击搜索按钮）
 *   clear            - 清空搜索
 */
import { ref, watch } from 'vue'

const props = withDefaults(defineProps<{
  modelValue?: string
  placeholder?: string
}>(), {
  modelValue: '',
  placeholder: '搜索关键词...',
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  search: [value: string]
  clear: []
}>()

const keyword = ref(props.modelValue)

// 防抖定时器
let debounceTimer: ReturnType<typeof setTimeout> | null = null

watch(() => props.modelValue, (val) => {
  keyword.value = val
})

function onInput() {
  // 清除之前的定时器
  if (debounceTimer) clearTimeout(debounceTimer)
  // 300ms 防抖后更新
  debounceTimer = setTimeout(() => {
    emit('update:modelValue', keyword.value)
  }, 300)
}

function onSearch() {
  if (debounceTimer) clearTimeout(debounceTimer)
  emit('update:modelValue', keyword.value)
  emit('search', keyword.value)
}

function onClear() {
  keyword.value = ''
  emit('update:modelValue', '')
  emit('clear')
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Enter') {
    onSearch()
  }
}
</script>

<template>
  <div class="search-bar">
    <div class="search-input-wrap">
      <span class="search-icon">🔍</span>
      <input
        v-model="keyword"
        type="text"
        class="search-input"
        :placeholder="placeholder"
        @input="onInput"
        @keydown="onKeydown"
      />
      <button
        v-if="keyword"
        class="search-clear"
        @click="onClear"
        title="清空搜索"
      >
        ✕
      </button>
    </div>
    <button class="search-btn" @click="onSearch">
      搜索
    </button>
  </div>
</template>

<style scoped>
.search-bar {
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
}

.search-input-wrap {
  flex: 1;
  position: relative;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  left: 12px;
  font-size: 15px;
  pointer-events: none;
  color: #aaa;
}

.search-input {
  width: 100%;
  padding: 10px 36px 10px 36px;
  border: 1px solid #d0d0d0;
  border-radius: 8px;
  font-size: 14px;
  font-family: inherit;
  transition: border-color 0.2s;
  background: #fff;
  outline: none;
}

.search-input:focus {
  border-color: #409eff;
  box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.12);
}

.search-input::placeholder {
  color: #bbb;
}

.search-clear {
  position: absolute;
  right: 8px;
  width: 24px;
  height: 24px;
  border: none;
  border-radius: 50%;
  background: #e0e0e0;
  color: #888;
  font-size: 11px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s;
}

.search-clear:hover {
  background: #ccc;
  color: #555;
}

.search-btn {
  padding: 10px 20px;
  background: #409eff;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  flex-shrink: 0;
}

.search-btn:hover {
  background: #337ecc;
  box-shadow: 0 2px 8px rgba(64, 158, 255, 0.3);
}
</style>
