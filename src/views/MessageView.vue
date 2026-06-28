<script setup lang="ts">
import { ref } from 'vue'

interface Message {
  id: number
  from: string
  content: string
  time: string
  unread: boolean
}

const messages = ref<Message[]>([
  { id: 1, from: '李同学', content: '你好，请问《数据结构》还在吗？', time: '10:30', unread: true },
  { id: 2, from: '王同学', content: '机械键盘能小刀吗？', time: '09:15', unread: true },
  { id: 3, from: '系统通知', content: '您的商品"台灯"审核通过', time: '昨天', unread: false },
  { id: 4, from: '赵同学', content: '好的，明天下午3点图书馆见', time: '昨天', unread: false },
])
</script>

<template>
  <section class="message-page">
    <h2>消息中心</h2>
    <p class="page-desc">查看聊天消息与系统通知</p>

    <div class="message-list">
      <div
        v-for="msg in messages"
        :key="msg.id"
        class="message-item"
        :class="{ unread: msg.unread }"
      >
        <div class="msg-avatar">{{ msg.from[0] }}</div>
        <div class="msg-body">
          <div class="msg-header">
            <span class="msg-from">{{ msg.from }}</span>
            <span class="msg-time">{{ msg.time }}</span>
          </div>
          <p class="msg-content">{{ msg.content }}</p>
        </div>
        <span v-if="msg.unread" class="unread-dot"></span>
      </div>
    </div>
  </section>
</template>

<style scoped>
.message-page {
  max-width: 600px;
  margin: 0 auto;
}

h2 {
  margin-bottom: 8px;
}

.page-desc {
  color: #666;
  margin-bottom: 24px;
}

.message-list {
  display: flex;
  flex-direction: column;
  gap: 1px;
  background: #eee;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
}

.message-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  background: #fff;
  cursor: pointer;
  transition: background 0.15s;
}

.message-item:hover {
  background: #f5f7fa;
}

.message-item.unread {
  background: #f0f7ff;
}

.msg-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #409eff;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 16px;
  flex-shrink: 0;
}

.msg-body {
  flex: 1;
  min-width: 0;
}

.msg-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
}

.msg-from {
  font-weight: 600;
  font-size: 15px;
}

.msg-time {
  color: #aaa;
  font-size: 12px;
}

.msg-content {
  margin: 0;
  color: #666;
  font-size: 14px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.unread-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #e74c3c;
  flex-shrink: 0;
}
</style>
