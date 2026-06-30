<script setup lang="ts">
/**
 * FormField —— 统一表单项组件
 *
 * 用于包裹 input / textarea / select 等表单控件，
 * 统一处理标题、必填标识和错误提示。
 *
 * Props:
 *   label     - 表单项标题
 *   fieldId   - 关联的 input id（点击标题可聚焦）
 *   required  - 是否必填（默认 false，显示红色 *）
 *   error     - 校验错误信息（空字符串时不显示）
 *
 * Slots:
 *   default   - 放置表单控件（input / textarea / select 等）
 */

interface Props {
  label: string
  fieldId?: string
  required?: boolean
  error?: string
}

withDefaults(defineProps<Props>(), {
  fieldId: '',
  required: false,
  error: '',
})
</script>

<template>
  <div class="form-field" :class="{ 'has-error': error }">
    <label v-if="label" :for="fieldId || undefined" class="field-label">
      {{ label }}
      <span v-if="required" class="required-mark">*</span>
      <span v-else class="optional-mark">(选填)</span>
    </label>
    <slot />
    <p v-if="error" class="field-error" role="alert">{{ error }}</p>
  </div>
</template>

<style scoped>
.form-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.field-label {
  font-weight: 500;
  color: #333;
  font-size: 14px;
}

.required-mark {
  color: #e74c3c;
}

.optional-mark {
  color: #aaa;
  font-weight: 400;
  font-size: 12px;
}

.field-error {
  margin: 0;
  font-size: 12px;
  color: #e74c3c;
  line-height: 1.4;
}

/* 错误状态时给子元素中的 input/textarea/select 加红色边框 */
.has-error :deep(input),
.has-error :deep(textarea),
.has-error :deep(select) {
  border-color: #e74c3c;
}

.has-error :deep(input:focus),
.has-error :deep(textarea:focus),
.has-error :deep(select:focus) {
  box-shadow: 0 0 0 2px rgba(231, 76, 60, 0.15);
}
</style>
