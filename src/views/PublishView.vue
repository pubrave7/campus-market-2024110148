<script setup lang="ts">
import { ref } from 'vue'

const title = ref('')
const price = ref('')
const description = ref('')
const submitted = ref(false)

function handleSubmit() {
  if (title.value && price.value && description.value) {
    submitted.value = true
    setTimeout(() => {
      submitted.value = false
      title.value = ''
      price.value = ''
      description.value = ''
    }, 3000)
  }
}
</script>

<template>
  <section class="publish-page">
    <h2>发布商品</h2>
    <p class="page-desc">填写信息，发布你的闲置物品</p>

    <form class="publish-form" @submit.prevent="handleSubmit">
      <div class="form-group">
        <label for="title">商品名称</label>
        <input id="title" v-model="title" type="text" placeholder="请输入商品名称" required />
      </div>

      <div class="form-group">
        <label for="price">价格 (¥)</label>
        <input id="price" v-model="price" type="number" placeholder="请输入价格" required min="0" />
      </div>

      <div class="form-group">
        <label for="desc">商品描述</label>
        <textarea id="desc" v-model="description" placeholder="请描述商品状况、使用时间等信息" rows="4" required></textarea>
      </div>

      <button type="submit" class="submit-btn">发布商品</button>
    </form>

    <div v-if="submitted" class="success-msg">
      ✅ 商品发布成功！（模拟）
    </div>
  </section>
</template>

<style scoped>
.publish-page {
  max-width: 500px;
  margin: 0 auto;
}

h2 {
  margin-bottom: 8px;
}

.page-desc {
  color: #666;
  margin-bottom: 24px;
}

.publish-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-group label {
  font-weight: 500;
  color: #333;
}

.form-group input,
.form-group textarea {
  padding: 10px 12px;
  border: 1px solid #d0d0d0;
  border-radius: 6px;
  font-size: 14px;
  font-family: inherit;
  transition: border-color 0.2s;
}

.form-group input:focus,
.form-group textarea:focus {
  border-color: #409eff;
  outline: none;
  box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.15);
}

.submit-btn {
  padding: 12px 24px;
  background: #409eff;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  cursor: pointer;
  transition: background 0.2s;
}

.submit-btn:hover {
  background: #337ecc;
}

.success-msg {
  margin-top: 16px;
  padding: 12px;
  background: #f0f9eb;
  border: 1px solid #c2e7b0;
  border-radius: 6px;
  color: #67c23a;
}
</style>
