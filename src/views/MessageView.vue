<script setup lang="ts">
import { ref, computed, nextTick, watch } from 'vue'

// ====== 会话列表 ======
interface Conversation {
  id: number
  name: string
  avatar: string
  lastMessage: string
  time: string
  unread: number
  online: boolean
  tag?: string  // 物品标签
  messages: ChatMessage[]
}

interface ChatMessage {
  id: number
  sender: 'me' | 'other'
  text: string
  time: string
}

const conversations = ref<Conversation[]>([
  {
    id: 1,
    name: '李同学',
    avatar: '李',
    lastMessage: '好的，那就这个价格，我下午来取',
    time: '10:32',
    unread: 2,
    online: true,
    tag: '《数据结构》',
    messages: [
      { id: 1, sender: 'other', text: '你好，请问《数据结构》还在吗？', time: '10:15' },
      { id: 2, sender: 'me', text: '在的，九成新，笔记很全', time: '10:18' },
      { id: 3, sender: 'other', text: '能便宜点吗？20出不出？', time: '10:22' },
      { id: 4, sender: 'me', text: '最低23吧，这本很新的', time: '10:25' },
      { id: 5, sender: 'other', text: '好的，那就这个价格，我下午来取', time: '10:32' },
    ],
  },
  {
    id: 2,
    name: '王同学',
    avatar: '王',
    lastMessage: '150吧，诚心要',
    time: '09:15',
    unread: 1,
    online: true,
    tag: '机械键盘',
    messages: [
      { id: 1, sender: 'other', text: '机械键盘能小刀吗？', time: '09:08' },
      { id: 2, sender: 'me', text: '可以小刀，你出多少？', time: '09:10' },
      { id: 3, sender: 'other', text: '150吧，诚心要', time: '09:15' },
    ],
  },
  {
    id: 3,
    name: '系统通知',
    avatar: '系',
    lastMessage: '您的商品"台灯"已通过审核',
    time: '昨天',
    unread: 0,
    online: false,
    tag: '系统',
    messages: [
      { id: 1, sender: 'other', text: '🔔 您的商品"LED护眼台灯"已通过审核，现在其他人可以看到啦！', time: '昨天 14:30' },
      { id: 2, sender: 'other', text: '💡 小提示：完善商品描述和实拍图能提高成交率哦～', time: '昨天 14:30' },
    ],
  },
  {
    id: 4,
    name: '赵同学',
    avatar: '赵',
    lastMessage: '好的，明天下午3点图书馆门口见',
    time: '昨天',
    unread: 0,
    online: false,
    tag: '跑腿-代办',
    messages: [
      { id: 1, sender: 'me', text: '你好，我可以帮忙代办教务处盖章', time: '昨天 10:00' },
      { id: 2, sender: 'other', text: '太好了！需要什么材料？', time: '昨天 10:05' },
      { id: 3, sender: 'me', text: '把需要盖章的材料给我就行，明天下午3点图书馆门口碰头', time: '昨天 10:08' },
      { id: 4, sender: 'other', text: '好的，明天下午3点图书馆门口见', time: '昨天 10:10' },
    ],
  },
  {
    id: 5,
    name: '钱同学',
    avatar: '钱',
    lastMessage: '还差1个人就成团了，快来',
    time: '周一',
    unread: 0,
    online: true,
    tag: '拼单-坚果',
    messages: [
      { id: 1, sender: 'other', text: '嗨！看到你也加了坚果拼单', time: '周一 16:00' },
      { id: 2, sender: 'other', text: '还差1个人就成团了，快来', time: '周一 16:01' },
      { id: 3, sender: 'me', text: '好的，我拉个朋友进来', time: '周一 16:10' },
    ],
  },
  {
    id: 6,
    name: '孙同学',
    avatar: '孙',
    lastMessage: '请问U盘还在吗？',
    time: '周日',
    unread: 0,
    online: false,
    tag: '失物-U盘',
    messages: [
      { id: 1, sender: 'other', text: '你好，看到你发的失物招领，请问是银色金士顿U盘吗？', time: '周日 19:00' },
      { id: 2, sender: 'other', text: '我的U盘上周在机房丢了，32G银色', time: '周日 19:01' },
    ],
  },
])

// ====== 视图状态 ======
const activeView = ref<'list' | 'chat'>('list')
const activeConversation = ref<Conversation | null>(null)
const newMessage = ref('')
const chatContainer = ref<HTMLElement | null>(null)

// 当前会话的消息
const activeMessages = computed(() => activeConversation.value?.messages || [])

// 打开聊天
function openChat(conv: Conversation) {
  activeConversation.value = conv
  conv.unread = 0
  activeView.value = 'chat'
  newMessage.value = ''
  nextTick(scrollToBottom)
}

// 返回列表
function backToList() {
  activeView.value = 'list'
  activeConversation.value = null
}

// 发送消息
function sendMessage() {
  const text = newMessage.value.trim()
  if (!text || !activeConversation.value) return

  const now = new Date()
  const time = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`

  const msg: ChatMessage = {
    id: Date.now(),
    sender: 'me',
    text,
    time,
  }

  activeConversation.value.messages.push(msg)
  activeConversation.value.lastMessage = text
  activeConversation.value.time = time
  newMessage.value = ''
  nextTick(scrollToBottom)

  // 模拟自动回复
  setTimeout(() => {
    if (!activeConversation.value) return
    const autoReply: ChatMessage = {
      id: Date.now() + 1,
      sender: 'other',
      text: '收到消息啦～（自动回复：对方已读）',
      time: `${new Date().getHours().toString().padStart(2, '0')}:${new Date().getMinutes().toString().padStart(2, '0')}`,
    }
    activeConversation.value.messages.push(autoReply)
    activeConversation.value.lastMessage = autoReply.text
    nextTick(scrollToBottom)
  }, 1500)
}

function scrollToBottom() {
  if (chatContainer.value) {
    chatContainer.value.scrollTop = chatContainer.value.scrollHeight
  }
}

// 监听会话切换
watch(activeConversation, () => {
  nextTick(scrollToBottom)
})

// 格式化时间
function formatConvTime(time: string) {
  return time
}
</script>

<template>
  <section class="message-page">
    <!-- ====== 会话列表视图 ====== -->
    <template v-if="activeView === 'list'">
      <div class="page-header">
        <h2>💬 消息中心</h2>
        <p class="page-desc">共 {{ conversations.filter(c => c.unread > 0).length }} 条未读消息</p>
      </div>

      <!-- 搜索框 -->
      <div class="search-box">
        <span class="search-icon">🔍</span>
        <input type="text" placeholder="搜索联系人..." class="search-input" />
      </div>

      <div class="message-list">
        <div
          v-for="conv in conversations"
          :key="conv.id"
          class="message-item"
          :class="{ unread: conv.unread > 0 }"
          @click="openChat(conv)"
        >
          <div class="msg-avatar" :class="{ online: conv.online }">
            {{ conv.avatar }}
            <span v-if="conv.online" class="online-dot"></span>
          </div>
          <div class="msg-body">
            <div class="msg-header">
              <span class="msg-from">
                {{ conv.name }}
                <span v-if="conv.tag" class="msg-tag">{{ conv.tag }}</span>
              </span>
              <span class="msg-time">{{ conv.time }}</span>
            </div>
            <p class="msg-content">{{ conv.lastMessage }}</p>
          </div>
          <span v-if="conv.unread > 0" class="unread-badge">{{ conv.unread }}</span>
        </div>
      </div>
    </template>

    <!-- ====== 聊天详情视图 ====== -->
    <template v-else-if="activeConversation">
      <!-- 聊天头部 -->
      <div class="chat-header">
        <button class="back-btn" @click="backToList">← 返回</button>
        <div class="chat-contact">
          <div class="chat-avatar" :class="{ online: activeConversation.online }">
            {{ activeConversation.avatar }}
            <span v-if="activeConversation.online" class="online-dot-small"></span>
          </div>
          <div class="chat-contact-info">
            <span class="chat-name">{{ activeConversation.name }}</span>
            <span v-if="activeConversation.tag" class="chat-tag">{{ activeConversation.tag }}</span>
            <span class="chat-status">{{ activeConversation.online ? '在线' : '离线' }}</span>
          </div>
        </div>
      </div>

      <!-- 消息气泡区 -->
      <div ref="chatContainer" class="chat-messages">
        <div
          v-for="msg in activeMessages"
          :key="msg.id"
          class="chat-bubble-row"
          :class="msg.sender === 'me' ? 'sent' : 'received'"
        >
          <div class="bubble" :class="msg.sender">
            <p class="bubble-text">{{ msg.text }}</p>
            <span class="bubble-time">{{ msg.time }}</span>
          </div>
        </div>

        <div v-if="activeMessages.length === 0" class="chat-empty">
          <span>💬</span>
          <p>暂无消息，发送第一条消息吧</p>
        </div>
      </div>

      <!-- 输入框 -->
      <div class="chat-input-bar">
        <input
          v-model="newMessage"
          type="text"
          class="chat-input"
          placeholder="输入消息..."
          @keyup.enter="sendMessage"
        />
        <button class="send-btn" :disabled="!newMessage.trim()" @click="sendMessage">
          📨 发送
        </button>
      </div>
    </template>
  </section>
</template>

<style scoped>
.message-page {
  max-width: 640px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  height: calc(100vh - 140px);
  min-height: 500px;
}

/* ---- 页面头部 ---- */
.page-header {
  margin-bottom: 16px;
}

.page-header h2 {
  margin-bottom: 4px;
  font-size: 22px;
}

.page-desc {
  color: #888;
  font-size: 13px;
  margin: 0;
}

/* ---- 搜索框 ---- */
.search-box {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  background: #fff;
  border: 1px solid #e8e8e8;
  border-radius: 10px;
  margin-bottom: 12px;
}

.search-icon {
  font-size: 15px;
  flex-shrink: 0;
}

.search-input {
  flex: 1;
  border: none;
  outline: none;
  font-size: 14px;
  color: #333;
  background: transparent;
}

.search-input::placeholder {
  color: #bbb;
}

/* ---- 会话列表 ---- */
.message-list {
  display: flex;
  flex-direction: column;
  gap: 2px;
  background: #eee;
  border: 1px solid #e8e8e8;
  border-radius: 12px;
  overflow: hidden;
  flex: 1;
  overflow-y: auto;
}

.message-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  background: #fff;
  cursor: pointer;
  transition: all 0.15s;
  position: relative;
}

.message-item:hover {
  background: #f8fafc;
}

.message-item.unread {
  background: #f0f7ff;
}

.message-item:first-child {
  border-radius: 12px 12px 0 0;
}

.message-item:last-child {
  border-radius: 0 0 12px 12px;
}

.msg-avatar {
  width: 46px;
  height: 46px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 18px;
  flex-shrink: 0;
  position: relative;
}

.msg-avatar.online {
  background: linear-gradient(135deg, #409eff, #67c23a);
}

.online-dot {
  position: absolute;
  bottom: 1px;
  right: 1px;
  width: 11px;
  height: 11px;
  border-radius: 50%;
  background: #67c23a;
  border: 2px solid #fff;
}

.msg-body {
  flex: 1;
  min-width: 0;
}

.msg-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 3px;
}

.msg-from {
  font-weight: 600;
  font-size: 15px;
  color: #222;
  display: flex;
  align-items: center;
  gap: 6px;
}

.msg-tag {
  font-size: 10px;
  padding: 1px 6px;
  background: #f0f7ff;
  color: #409eff;
  border-radius: 3px;
  font-weight: 400;
}

.msg-time {
  color: #bbb;
  font-size: 11px;
  flex-shrink: 0;
}

.msg-content {
  margin: 0;
  color: #999;
  font-size: 13px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.unread-badge {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #e74c3c;
  color: #fff;
  font-size: 11px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

/* ====== 聊天详情 ====== */
.chat-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 0 14px 0;
  border-bottom: 1px solid #eee;
  margin-bottom: 4px;
}

.back-btn {
  padding: 6px 12px;
  border: 1px solid #d0d0d0;
  border-radius: 6px;
  background: #fff;
  color: #666;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
  flex-shrink: 0;
}

.back-btn:hover {
  border-color: #409eff;
  color: #409eff;
}

.chat-contact {
  display: flex;
  align-items: center;
  gap: 10px;
}

.chat-avatar {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  background: linear-gradient(135deg, #409eff, #67c23a);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 17px;
  position: relative;
}

.chat-avatar.online {
  background: linear-gradient(135deg, #409eff, #67c23a);
}

.online-dot-small {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #67c23a;
  border: 2px solid #fff;
}

.chat-contact-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.chat-name {
  font-weight: 600;
  font-size: 16px;
  color: #222;
}

.chat-tag {
  font-size: 11px;
  color: #409eff;
}

.chat-status {
  font-size: 11px;
  color: #67c23a;
}

/* ---- 消息区 ---- */
.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 16px 4px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  background: #fafbfc;
  border-radius: 10px;
  margin-bottom: 8px;
}

.chat-bubble-row {
  display: flex;
  max-width: 80%;
}

.chat-bubble-row.sent {
  align-self: flex-end;
  justify-content: flex-end;
}

.chat-bubble-row.received {
  align-self: flex-start;
}

.bubble {
  padding: 10px 14px;
  border-radius: 16px;
  position: relative;
  word-break: break-word;
}

.bubble.me {
  background: linear-gradient(135deg, #409eff, #5b8cff);
  color: #fff;
  border-bottom-right-radius: 4px;
}

.bubble.other {
  background: #fff;
  color: #333;
  border: 1px solid #e8e8e8;
  border-bottom-left-radius: 4px;
}

.bubble-text {
  margin: 0;
  font-size: 14px;
  line-height: 1.6;
}

.bubble-time {
  display: block;
  font-size: 10px;
  margin-top: 4px;
  opacity: 0.7;
  text-align: right;
}

.bubble.other .bubble-time {
  color: #aaa;
}

.chat-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #ccc;
  gap: 8px;
  font-size: 38px;
}

.chat-empty p {
  margin: 0;
  font-size: 14px;
  color: #bbb;
}

/* ---- 输入栏 ---- */
.chat-input-bar {
  display: flex;
  gap: 10px;
  padding: 10px 0 4px 0;
}

.chat-input {
  flex: 1;
  padding: 12px 16px;
  border: 1px solid #e0e0e0;
  border-radius: 22px;
  font-size: 14px;
  font-family: inherit;
  outline: none;
  transition: border-color 0.2s;
  background: #fff;
}

.chat-input:focus {
  border-color: #409eff;
  box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.1);
}

.send-btn {
  padding: 10px 20px;
  background: #409eff;
  color: #fff;
  border: none;
  border-radius: 22px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
  font-weight: 500;
  flex-shrink: 0;
}

.send-btn:hover:not(:disabled) {
  background: #337ecc;
  box-shadow: 0 2px 8px rgba(64, 158, 255, 0.3);
}

.send-btn:disabled {
  background: #c8d9f0;
  cursor: not-allowed;
}
</style>
