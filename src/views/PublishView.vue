<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { createTrade } from '@/api/trade'
import { createErrand } from '@/api/errand'
import { createGroupBuy } from '@/api/groupBuy'
import { createLostFound } from '@/api/lostFound'

// ---- 发布类型 ----
const publishTypes = [
  { key: 'trade', label: '二手交易', icon: '🛒' },
  { key: 'errand', label: '跑腿委托', icon: '🏃' },
  { key: 'groupBuy', label: '拼单搭子', icon: '🤝' },
  { key: 'lostFound', label: '失物招领', icon: '🔍' },
] as const
type PublishType = (typeof publishTypes)[number]['key']

const activeType = ref<PublishType>('trade')

// ---- 图片上传 ----
const imageBase64 = ref('')
const imagePreview = ref('')
const imageName = ref('')

function handleImageUpload(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return

  // 限制图片大小不超过 2MB
  if (file.size > 2 * 1024 * 1024) {
    alert('图片大小不能超过 2MB')
    return
  }

  imageName.value = file.name
  const reader = new FileReader()
  reader.onload = () => {
    imageBase64.value = reader.result as string
    imagePreview.value = reader.result as string
  }
  reader.readAsDataURL(file)
}

function removeImage() {
  imageBase64.value = ''
  imagePreview.value = ''
  imageName.value = ''
}

// ---- 提交状态 ----
const submitting = ref(false)
const submitted = ref(false)
const errorMsg = ref('')

// ---- 切换类型时清除提交状态 ----
watch(activeType, () => {
  submitted.value = false
  errorMsg.value = ''
})

// ---- 表单字段 ----
// 二手交易
const tradeForm = ref({
  title: '',
  price: '',
  category: '教材教辅',
  condition: '九成新',
  description: '',
  location: '',
  seller: '',
})

const tradeCategories = ['教材教辅', '数码电子', '生活用品', '出行工具', '文体娱乐']
const conditions = ['全新', '九五新', '九成新', '八成新', '七成新']

// 跑腿委托
const errandForm = ref({
  type: 'delivery' as 'delivery' | 'proxy' | 'other',
  title: '',
  description: '',
  reward: '',
  pickupLocation: '',
  deliveryLocation: '',
  deadline: '',
  publisher: '',
})

const errandTypes = [
  { key: 'delivery', label: '代取/代送' },
  { key: 'proxy', label: '代办' },
  { key: 'other', label: '其他委托' },
]

// 拼单搭子
const groupBuyForm = ref({
  type: 'group-buy' as 'group-buy' | 'partner' | 'team',
  title: '',
  description: '',
  targetCount: '',
  deadline: '',
  location: '',
  initiator: '',
})

const groupBuyTypes = [
  { key: 'group-buy', label: '拼单' },
  { key: 'partner', label: '找搭子' },
  { key: 'team', label: '组队' },
]

// 失物招领
const lostFoundForm = ref({
  type: 'lost' as 'lost' | 'found',
  title: '',
  itemName: '',
  description: '',
  location: '',
  date: '',
  contact: '',
})

// ---- 表单验证 ----
function isTradeFormValid() {
  return tradeForm.value.title && tradeForm.value.price && tradeForm.value.description && tradeForm.value.seller
}

function isErrandFormValid() {
  return errandForm.value.title && errandForm.value.description && errandForm.value.reward && errandForm.value.publisher
}

function isGroupBuyFormValid() {
  return groupBuyForm.value.title && groupBuyForm.value.description && groupBuyForm.value.targetCount && groupBuyForm.value.initiator
}

function isLostFoundFormValid() {
  return lostFoundForm.value.title && lostFoundForm.value.description && lostFoundForm.value.contact
}

const isFormValid = computed(() => {
  switch (activeType.value) {
    case 'trade': return isTradeFormValid()
    case 'errand': return isErrandFormValid()
    case 'groupBuy': return isGroupBuyFormValid()
    case 'lostFound': return isLostFoundFormValid()
    default: return false
  }
})

// ---- 提交 ----
async function handleSubmit() {
  if (!isFormValid.value) return

  submitting.value = true
  errorMsg.value = ''

  try {
    const image = imageBase64.value || undefined

    switch (activeType.value) {
      case 'trade': {
        const now = new Date().toISOString().slice(0, 10)
        await createTrade({
          title: tradeForm.value.title,
          price: Number(tradeForm.value.price),
          category: tradeForm.value.category,
          condition: tradeForm.value.condition,
          description: tradeForm.value.description,
          seller: tradeForm.value.seller,
          location: tradeForm.value.location || '未指定',
          publishTime: now,
          image: image || '',
          status: 'open',
        })
        break
      }
      case 'errand': {
        await createErrand({
          type: errandForm.value.type,
          title: errandForm.value.title,
          description: errandForm.value.description,
          reward: Number(errandForm.value.reward),
          pickupLocation: errandForm.value.pickupLocation || '未指定',
          deliveryLocation: errandForm.value.deliveryLocation || '未指定',
          deadline: errandForm.value.deadline || '未指定',
          publisher: errandForm.value.publisher,
          status: 'open',
          image,
        })
        break
      }
      case 'groupBuy': {
        await createGroupBuy({
          type: groupBuyForm.value.type,
          title: groupBuyForm.value.title,
          description: groupBuyForm.value.description,
          targetCount: Number(groupBuyForm.value.targetCount),
          currentCount: 1,
          deadline: groupBuyForm.value.deadline || '未指定',
          location: groupBuyForm.value.location || '未指定',
          initiator: groupBuyForm.value.initiator,
          status: 'open',
          image,
        })
        break
      }
      case 'lostFound': {
        await createLostFound({
          type: lostFoundForm.value.type,
          title: lostFoundForm.value.title,
          itemName: lostFoundForm.value.itemName || lostFoundForm.value.title,
          description: lostFoundForm.value.description,
          location: lostFoundForm.value.location || '未指定',
          date: lostFoundForm.value.date || new Date().toISOString().slice(0, 10),
          contact: lostFoundForm.value.contact,
          status: 'open',
          image,
        })
        break
      }
    }

    submitted.value = true
    resetForm()
    setTimeout(() => { submitted.value = false }, 4000)
  } catch (err) {
    console.error('发布失败:', err)
    errorMsg.value = '发布失败，请确保 json-server 已启动 (端口 3001)'
  } finally {
    submitting.value = false
  }
}

function resetForm() {
  tradeForm.value = { title: '', price: '', category: '教材教辅', condition: '九成新', description: '', location: '', seller: '' }
  errandForm.value = { type: 'delivery', title: '', description: '', reward: '', pickupLocation: '', deliveryLocation: '', deadline: '', publisher: '' }
  groupBuyForm.value = { type: 'group-buy', title: '', description: '', targetCount: '', deadline: '', location: '', initiator: '' }
  lostFoundForm.value = { type: 'lost', title: '', itemName: '', description: '', location: '', date: '', contact: '' }
  removeImage()
}
</script>

<template>
  <section class="publish-page">
    <div class="page-header">
      <h2>✏️ 发布信息</h2>
      <p class="page-desc">选择类型，填写详情，让校园生活更便捷</p>
    </div>

    <!-- 类型选择 -->
    <div class="type-tabs">
      <button
        v-for="pt in publishTypes"
        :key="pt.key"
        class="type-tab"
        :class="{ active: activeType === pt.key }"
        @click="activeType = pt.key"
      >
        <span class="tab-icon">{{ pt.icon }}</span>
        <span class="tab-label">{{ pt.label }}</span>
      </button>
    </div>

    <!-- 表单 -->
    <form class="publish-form" @submit.prevent="handleSubmit">
      <!-- ====== 图片上传（通用） ====== -->
      <div class="form-group">
        <label>📷 上传图片 <span class="optional">(选填)</span></label>
        <div class="image-upload-area">
          <template v-if="imagePreview">
            <div class="image-preview-wrap">
              <img :src="imagePreview" alt="预览图" class="image-preview" />
              <button type="button" class="remove-img-btn" @click="removeImage">✕</button>
            </div>
          </template>
          <label v-else class="upload-placeholder">
            <input type="file" accept="image/*" class="file-input" @change="handleImageUpload" />
            <span class="upload-icon">🖼️</span>
            <span class="upload-text">点击上传图片</span>
            <span class="upload-hint">支持 jpg/png/gif，不超过 2MB</span>
          </label>
        </div>
        <p v-if="imageName" class="image-name">已选择: {{ imageName }}</p>
      </div>

      <!-- ====== 二手交易表单 ====== -->
      <template v-if="activeType === 'trade'">
        <div class="form-group">
          <label for="trade-title">商品名称 <span class="required">*</span></label>
          <input id="trade-title" v-model="tradeForm.title" type="text" placeholder="请输入商品名称" required />
        </div>

        <div class="form-row">
          <div class="form-group form-half">
            <label for="trade-price">价格 (¥) <span class="required">*</span></label>
            <input id="trade-price" v-model="tradeForm.price" type="number" placeholder="0" required min="0" step="0.01" />
          </div>
          <div class="form-group form-half">
            <label for="trade-condition">成色</label>
            <select id="trade-condition" v-model="tradeForm.condition">
              <option v-for="c in conditions" :key="c" :value="c">{{ c }}</option>
            </select>
          </div>
        </div>

        <div class="form-group">
          <label for="trade-category">分类</label>
          <select id="trade-category" v-model="tradeForm.category">
            <option v-for="cat in tradeCategories" :key="cat" :value="cat">{{ cat }}</option>
          </select>
        </div>

        <div class="form-group">
          <label for="trade-desc">商品描述 <span class="required">*</span></label>
          <textarea id="trade-desc" v-model="tradeForm.description" placeholder="请描述商品状况、使用时间等信息" rows="4" required></textarea>
        </div>

        <div class="form-row">
          <div class="form-group form-half">
            <label for="trade-location">所在校区</label>
            <input id="trade-location" v-model="tradeForm.location" type="text" placeholder="如：东校区" />
          </div>
          <div class="form-group form-half">
            <label for="trade-seller">发布人 <span class="required">*</span></label>
            <input id="trade-seller" v-model="tradeForm.seller" type="text" placeholder="你的昵称" required />
          </div>
        </div>
      </template>

      <!-- ====== 跑腿委托表单 ====== -->
      <template v-if="activeType === 'errand'">
        <div class="form-group">
          <label for="errand-type">委托类型</label>
          <select id="errand-type" v-model="errandForm.type">
            <option v-for="et in errandTypes" :key="et.key" :value="et.key">{{ et.label }}</option>
          </select>
        </div>

        <div class="form-group">
          <label for="errand-title">标题 <span class="required">*</span></label>
          <input id="errand-title" v-model="errandForm.title" type="text" placeholder="简要描述委托内容" required />
        </div>

        <div class="form-group">
          <label for="errand-desc">详细描述 <span class="required">*</span></label>
          <textarea id="errand-desc" v-model="errandForm.description" placeholder="详细说明委托事项、要求等" rows="3" required></textarea>
        </div>

        <div class="form-row">
          <div class="form-group form-half">
            <label for="errand-reward">酬劳 (¥) <span class="required">*</span></label>
            <input id="errand-reward" v-model="errandForm.reward" type="number" placeholder="0" required min="0" />
          </div>
          <div class="form-group form-half">
            <label for="errand-deadline">截止时间</label>
            <input id="errand-deadline" v-model="errandForm.deadline" type="text" placeholder="如：2026-07-01 18:00" />
          </div>
        </div>

        <div class="form-row">
          <div class="form-group form-half">
            <label for="errand-pickup">取件/起点</label>
            <input id="errand-pickup" v-model="errandForm.pickupLocation" type="text" placeholder="如：校门口快递柜" />
          </div>
          <div class="form-group form-half">
            <label for="errand-delivery">送达/终点</label>
            <input id="errand-delivery" v-model="errandForm.deliveryLocation" type="text" placeholder="如：3号宿舍楼" />
          </div>
        </div>

        <div class="form-group">
          <label for="errand-publisher">发布人 <span class="required">*</span></label>
          <input id="errand-publisher" v-model="errandForm.publisher" type="text" placeholder="你的昵称" required />
        </div>
      </template>

      <!-- ====== 拼单搭子表单 ====== -->
      <template v-if="activeType === 'groupBuy'">
        <div class="form-group">
          <label for="gb-type">拼单类型</label>
          <select id="gb-type" v-model="groupBuyForm.type">
            <option v-for="gt in groupBuyTypes" :key="gt.key" :value="gt.key">{{ gt.label }}</option>
          </select>
        </div>

        <div class="form-group">
          <label for="gb-title">标题 <span class="required">*</span></label>
          <input id="gb-title" v-model="groupBuyForm.title" type="text" placeholder="简要描述拼单/搭子/组队内容" required />
        </div>

        <div class="form-group">
          <label for="gb-desc">详细描述 <span class="required">*</span></label>
          <textarea id="gb-desc" v-model="groupBuyForm.description" placeholder="详细说明拼单物品、搭子要求、组队目标等" rows="3" required></textarea>
        </div>

        <div class="form-row">
          <div class="form-group form-half">
            <label for="gb-count">目标人数 <span class="required">*</span></label>
            <input id="gb-count" v-model="groupBuyForm.targetCount" type="number" placeholder="如：3" required min="2" />
          </div>
          <div class="form-group form-half">
            <label for="gb-deadline">截止时间</label>
            <input id="gb-deadline" v-model="groupBuyForm.deadline" type="text" placeholder="如：2026-07-05" />
          </div>
        </div>

        <div class="form-row">
          <div class="form-group form-half">
            <label for="gb-location">地点</label>
            <input id="gb-location" v-model="groupBuyForm.location" type="text" placeholder="如：东校区" />
          </div>
          <div class="form-group form-half">
            <label for="gb-initiator">发起人 <span class="required">*</span></label>
            <input id="gb-initiator" v-model="groupBuyForm.initiator" type="text" placeholder="你的昵称" required />
          </div>
        </div>
      </template>

      <!-- ====== 失物招领表单 ====== -->
      <template v-if="activeType === 'lostFound'">
        <div class="form-group">
          <label>信息类型</label>
          <div class="toggle-row">
            <button
              type="button"
              class="toggle-btn"
              :class="{ active: lostFoundForm.type === 'lost' }"
              @click="lostFoundForm.type = 'lost'"
            >
              😢 寻物启事
            </button>
            <button
              type="button"
              class="toggle-btn"
              :class="{ active: lostFoundForm.type === 'found' }"
              @click="lostFoundForm.type = 'found'"
            >
              🙌 失物招领
            </button>
          </div>
        </div>

        <div class="form-group">
          <label for="lf-title">标题 <span class="required">*</span></label>
          <input id="lf-title" v-model="lostFoundForm.title" type="text" placeholder="如：黑色双肩包" required />
        </div>

        <div class="form-group">
          <label for="lf-item-name">物品名称</label>
          <input id="lf-item-name" v-model="lostFoundForm.itemName" type="text" placeholder="如：双肩包" />
        </div>

        <div class="form-group">
          <label for="lf-desc">详细描述 <span class="required">*</span></label>
          <textarea id="lf-desc" v-model="lostFoundForm.description" placeholder="描述物品特征、遗失/拾取经过等" rows="3" required></textarea>
        </div>

        <div class="form-row">
          <div class="form-group form-half">
            <label for="lf-location">地点</label>
            <input id="lf-location" v-model="lostFoundForm.location" type="text" placeholder="如：图书馆二楼" />
          </div>
          <div class="form-group form-half">
            <label for="lf-date">日期</label>
            <input id="lf-date" v-model="lostFoundForm.date" type="date" />
          </div>
        </div>

        <div class="form-group">
          <label for="lf-contact">联系方式 <span class="required">*</span></label>
          <input id="lf-contact" v-model="lostFoundForm.contact" type="text" placeholder="如：李同学 138xxxx1234" required />
        </div>
      </template>

      <!-- 提交按钮 -->
      <button type="submit" class="submit-btn" :disabled="!isFormValid || submitting">
        {{ submitting ? '发布中...' : '🚀 立即发布' }}
      </button>
    </form>

    <!-- 成功提示 -->
    <div v-if="submitted" class="success-msg">
      ✅ 发布成功！请前往对应页面查看。
    </div>

    <!-- 错误提示 -->
    <div v-if="errorMsg" class="error-msg">
      ❌ {{ errorMsg }}
    </div>
  </section>
</template>

<style scoped>
.publish-page {
  max-width: 580px;
  margin: 0 auto;
}

.page-header {
  margin-bottom: 20px;
}

.page-header h2 {
  margin-bottom: 6px;
  font-size: 22px;
}

.page-desc {
  color: #888;
  font-size: 14px;
}

/* ---- 类型标签 ---- */
.type-tabs {
  display: flex;
  gap: 8px;
  margin-bottom: 24px;
  flex-wrap: wrap;
}

.type-tab {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 10px 18px;
  border: 1px solid #d0d0d0;
  border-radius: 20px;
  background: #fff;
  font-size: 14px;
  color: #555;
  cursor: pointer;
  transition: all 0.2s;
}

.type-tab:hover {
  border-color: #409eff;
  color: #409eff;
}

.type-tab.active {
  background: #409eff;
  color: #fff;
  border-color: #409eff;
}

.tab-icon {
  font-size: 16px;
}

/* ---- 表单 ---- */
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
  font-size: 14px;
}

.required {
  color: #e74c3c;
}

.optional {
  color: #aaa;
  font-weight: 400;
  font-size: 12px;
}

.form-row {
  display: flex;
  gap: 12px;
}

.form-half {
  flex: 1;
  min-width: 0;
}

input,
textarea,
select {
  padding: 10px 12px;
  border: 1px solid #d0d0d0;
  border-radius: 6px;
  font-size: 14px;
  font-family: inherit;
  transition: border-color 0.2s;
  background: #fff;
}

input:focus,
textarea:focus,
select:focus {
  border-color: #409eff;
  outline: none;
  box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.15);
}

/* ---- 图片上传 ---- */
.image-upload-area {
  border: 2px dashed #d0d0d0;
  border-radius: 8px;
  overflow: hidden;
  transition: border-color 0.2s;
}

.image-upload-area:hover {
  border-color: #409eff;
}

.upload-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 28px 16px;
  cursor: pointer;
}

.file-input {
  display: none;
}

.upload-icon {
  font-size: 36px;
  margin-bottom: 8px;
}

.upload-text {
  font-size: 14px;
  color: #555;
  margin-bottom: 4px;
}

.upload-hint {
  font-size: 12px;
  color: #aaa;
}

.image-preview-wrap {
  position: relative;
  width: 100%;
  max-height: 260px;
  overflow: hidden;
}

.image-preview {
  width: 100%;
  height: auto;
  max-height: 260px;
  object-fit: cover;
  display: block;
}

.remove-img-btn {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 28px;
  height: 28px;
  border: none;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.55);
  color: #fff;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
}

.remove-img-btn:hover {
  background: rgba(0, 0, 0, 0.75);
}

.image-name {
  margin: 0;
  font-size: 12px;
  color: #888;
}

/* ---- 开关按钮 ---- */
.toggle-row {
  display: flex;
  gap: 10px;
}

.toggle-btn {
  flex: 1;
  padding: 10px 16px;
  border: 1px solid #d0d0d0;
  border-radius: 8px;
  background: #fff;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.toggle-btn:hover {
  border-color: #409eff;
}

.toggle-btn.active {
  background: #409eff;
  color: #fff;
  border-color: #409eff;
}

/* ---- 提交按钮 ---- */
.submit-btn {
  margin-top: 8px;
  padding: 14px 24px;
  background: #409eff;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.submit-btn:hover:not(:disabled) {
  background: #337ecc;
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.3);
}

.submit-btn:disabled {
  background: #b0d4f0;
  cursor: not-allowed;
}

/* ---- 提示 ---- */
.success-msg,
.error-msg {
  margin-top: 16px;
  padding: 12px 16px;
  border-radius: 6px;
  font-size: 14px;
}

.success-msg {
  background: #f0f9eb;
  border: 1px solid #c2e7b0;
  color: #67c23a;
}

.error-msg {
  background: #fef0f0;
  border: 1px solid #fbc4c4;
  color: #e74c3c;
}
</style>
