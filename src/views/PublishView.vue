<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { createTrade } from '@/api/trade'
import { createErrand } from '@/api/errand'
import { createGroupBuy } from '@/api/groupBuy'
import { createLostFound } from '@/api/lostFound'
import FormField from '@/components/FormField.vue'

const router = useRouter()

// ---- 发布类型 ----
const publishTypes = [
  { key: 'trade', label: '二手交易', icon: '🛒' },
  { key: 'errand', label: '跑腿委托', icon: '🏃' },
  { key: 'groupBuy', label: '拼单搭子', icon: '🤝' },
  { key: 'lostFound', label: '失物招领', icon: '🔍' },
] as const
type PublishType = (typeof publishTypes)[number]['key']

const activeType = ref<PublishType>('trade')

/** 发布类型对应的路由路径 */
const typeRouteMap: Record<PublishType, string> = {
  trade: '/trade',
  errand: '/errand',
  groupBuy: '/group-buy',
  lostFound: '/lost-found',
}

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

// ---- 表单校验错误 ----
const formErrors = ref<Record<string, string>>({})

function clearErrors() {
  formErrors.value = {}
}

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

// ---- 表单校验函数 ----
function validateTradeForm(): boolean {
  clearErrors()
  const e: Record<string, string> = {}
  if (!tradeForm.value.title.trim()) e.title = '请输入商品名称'
  if (!tradeForm.value.price || Number(tradeForm.value.price) <= 0) e.price = '请输入有效的价格（大于 0）'
  if (!tradeForm.value.description.trim()) e.description = '请输入商品描述'
  if (!tradeForm.value.seller.trim()) e.seller = '请输入发布人昵称'
  formErrors.value = e
  return Object.keys(e).length === 0
}

function validateErrandForm(): boolean {
  clearErrors()
  const e: Record<string, string> = {}
  if (!errandForm.value.title.trim()) e.title = '请输入委托标题'
  if (!errandForm.value.description.trim()) e.description = '请输入详细描述'
  if (!errandForm.value.reward || Number(errandForm.value.reward) <= 0) e.reward = '请输入有效的酬劳金额'
  if (!errandForm.value.publisher.trim()) e.publisher = '请输入发布人昵称'
  formErrors.value = e
  return Object.keys(e).length === 0
}

function validateGroupBuyForm(): boolean {
  clearErrors()
  const e: Record<string, string> = {}
  if (!groupBuyForm.value.title.trim()) e.title = '请输入拼单标题'
  if (!groupBuyForm.value.description.trim()) e.description = '请输入详细描述'
  if (!groupBuyForm.value.targetCount || Number(groupBuyForm.value.targetCount) < 2) e.targetCount = '目标人数至少为 2 人'
  if (!groupBuyForm.value.initiator.trim()) e.initiator = '请输入发起人昵称'
  formErrors.value = e
  return Object.keys(e).length === 0
}

function validateLostFoundForm(): boolean {
  clearErrors()
  const e: Record<string, string> = {}
  if (!lostFoundForm.value.title.trim()) e.title = '请输入标题'
  if (!lostFoundForm.value.description.trim()) e.description = '请输入详细描述'
  if (!lostFoundForm.value.contact.trim()) e.contact = '请输入联系方式'
  formErrors.value = e
  return Object.keys(e).length === 0
}

/** 当前表单是否通过校验 */
const isFormValid = computed(() => {
  switch (activeType.value) {
    case 'trade': return validateTradeForm()
    case 'errand': return validateErrandForm()
    case 'groupBuy': return validateGroupBuyForm()
    case 'lostFound': return validateLostFoundForm()
    default: return false
  }
})

// ---- 切换类型时清除状态和错误，重置表单 ----
watch(activeType, () => {
  submitted.value = false
  errorMsg.value = ''
  clearErrors()
  resetForm()
})

// ---- 提交 ----
async function handleSubmit() {
  // 提交前执行最终校验
  let valid = false
  switch (activeType.value) {
    case 'trade': valid = validateTradeForm(); break
    case 'errand': valid = validateErrandForm(); break
    case 'groupBuy': valid = validateGroupBuyForm(); break
    case 'lostFound': valid = validateLostFoundForm(); break
  }
  if (!valid) return

  submitting.value = true
  errorMsg.value = ''

  try {
    const image = imageBase64.value || undefined

    switch (activeType.value) {
      case 'trade': {
        const now = new Date().toISOString().slice(0, 10)
        await createTrade({
          title: tradeForm.value.title.trim(),
          price: Number(tradeForm.value.price),
          category: tradeForm.value.category,
          condition: tradeForm.value.condition,
          description: tradeForm.value.description.trim(),
          seller: tradeForm.value.seller.trim(),
          location: tradeForm.value.location.trim() || '未指定',
          publishTime: now,
          image: image || '',
          status: 'open',
        })
        break
      }
      case 'errand': {
        await createErrand({
          type: errandForm.value.type,
          title: errandForm.value.title.trim(),
          description: errandForm.value.description.trim(),
          reward: Number(errandForm.value.reward),
          pickupLocation: errandForm.value.pickupLocation.trim() || '未指定',
          deliveryLocation: errandForm.value.deliveryLocation.trim() || '未指定',
          deadline: errandForm.value.deadline.trim() || '未指定',
          publisher: errandForm.value.publisher.trim(),
          status: 'open',
          image,
        })
        break
      }
      case 'groupBuy': {
        await createGroupBuy({
          type: groupBuyForm.value.type,
          title: groupBuyForm.value.title.trim(),
          description: groupBuyForm.value.description.trim(),
          targetCount: Number(groupBuyForm.value.targetCount),
          currentCount: 1,
          deadline: groupBuyForm.value.deadline.trim() || '未指定',
          location: groupBuyForm.value.location.trim() || '未指定',
          initiator: groupBuyForm.value.initiator.trim(),
          status: 'open',
          image,
        })
        break
      }
      case 'lostFound': {
        await createLostFound({
          type: lostFoundForm.value.type,
          title: lostFoundForm.value.title.trim(),
          itemName: lostFoundForm.value.itemName.trim() || lostFoundForm.value.title.trim(),
          description: lostFoundForm.value.description.trim(),
          location: lostFoundForm.value.location.trim() || '未指定',
          date: lostFoundForm.value.date || new Date().toISOString().slice(0, 10),
          contact: lostFoundForm.value.contact.trim(),
          status: 'open',
          image,
        })
        break
      }
    }

    submitted.value = true
    resetForm()
    clearErrors()

    // 提交成功后跳转到对应列表页
    const targetPath = typeRouteMap[activeType.value]
    setTimeout(() => {
      submitted.value = false
      router.push(targetPath)
    }, 1500)
  } catch (err) {
    console.error('发布失败:', err)
    errorMsg.value = '发布失败，请先在新终端执行 npm run mock 启动 Mock 服务，再刷新页面重试'
  } finally {
    submitting.value = false
  }
}

// ---- 重置表单 ----
function resetForm() {
  tradeForm.value = { title: '', price: '', category: '教材教辅', condition: '九成新', description: '', location: '', seller: '' }
  errandForm.value = { type: 'delivery', title: '', description: '', reward: '', pickupLocation: '', deliveryLocation: '', deadline: '', publisher: '' }
  groupBuyForm.value = { type: 'group-buy', title: '', description: '', targetCount: '', deadline: '', location: '', initiator: '' }
  lostFoundForm.value = { type: 'lost', title: '', itemName: '', description: '', location: '', date: '', contact: '' }
  removeImage()
}

// 暴露给模板使用的函数（避免 computed 副作用问题）
function checkFormValid(): boolean {
  switch (activeType.value) {
    case 'trade': return !!tradeForm.value.title && !!tradeForm.value.price && !!tradeForm.value.description && !!tradeForm.value.seller
    case 'errand': return !!errandForm.value.title && !!errandForm.value.description && !!errandForm.value.reward && !!errandForm.value.publisher
    case 'groupBuy': return !!groupBuyForm.value.title && !!groupBuyForm.value.description && !!groupBuyForm.value.targetCount && !!groupBuyForm.value.initiator
    case 'lostFound': return !!lostFoundForm.value.title && !!lostFoundForm.value.description && !!lostFoundForm.value.contact
    default: return false
  }
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
    <form class="publish-form" @submit.prevent="handleSubmit" novalidate>
      <!-- ====== 图片上传（通用） ====== -->
      <FormField label="📷 上传图片">
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
      </FormField>

      <!-- ====== 二手交易表单 ====== -->
      <template v-if="activeType === 'trade'">
        <FormField label="商品名称" field-id="trade-title" required :error="formErrors.title">
          <input id="trade-title" v-model="tradeForm.title" type="text" placeholder="请输入商品名称" />
        </FormField>

        <div class="form-row">
          <FormField label="价格 (¥)" field-id="trade-price" required :error="formErrors.price" class="form-half">
            <input id="trade-price" v-model="tradeForm.price" type="number" placeholder="0" min="0" step="0.01" />
          </FormField>
          <FormField label="成色" field-id="trade-condition" class="form-half">
            <select id="trade-condition" v-model="tradeForm.condition">
              <option v-for="c in conditions" :key="c" :value="c">{{ c }}</option>
            </select>
          </FormField>
        </div>

        <FormField label="分类" field-id="trade-category">
          <select id="trade-category" v-model="tradeForm.category">
            <option v-for="cat in tradeCategories" :key="cat" :value="cat">{{ cat }}</option>
          </select>
        </FormField>

        <FormField label="商品描述" field-id="trade-desc" required :error="formErrors.description">
          <textarea id="trade-desc" v-model="tradeForm.description" placeholder="请描述商品状况、使用时间等信息" rows="4"></textarea>
        </FormField>

        <div class="form-row">
          <FormField label="所在校区" field-id="trade-location" class="form-half">
            <input id="trade-location" v-model="tradeForm.location" type="text" placeholder="如：东校区" />
          </FormField>
          <FormField label="发布人" field-id="trade-seller" required :error="formErrors.seller" class="form-half">
            <input id="trade-seller" v-model="tradeForm.seller" type="text" placeholder="你的昵称" />
          </FormField>
        </div>
      </template>

      <!-- ====== 跑腿委托表单 ====== -->
      <template v-if="activeType === 'errand'">
        <FormField label="委托类型" field-id="errand-type">
          <select id="errand-type" v-model="errandForm.type">
            <option v-for="et in errandTypes" :key="et.key" :value="et.key">{{ et.label }}</option>
          </select>
        </FormField>

        <FormField label="标题" field-id="errand-title" required :error="formErrors.title">
          <input id="errand-title" v-model="errandForm.title" type="text" placeholder="简要描述委托内容" />
        </FormField>

        <FormField label="详细描述" field-id="errand-desc" required :error="formErrors.description">
          <textarea id="errand-desc" v-model="errandForm.description" placeholder="详细说明委托事项、要求等" rows="3"></textarea>
        </FormField>

        <div class="form-row">
          <FormField label="酬劳 (¥)" field-id="errand-reward" required :error="formErrors.reward" class="form-half">
            <input id="errand-reward" v-model="errandForm.reward" type="number" placeholder="0" min="0" />
          </FormField>
          <FormField label="截止时间" field-id="errand-deadline" class="form-half">
            <input id="errand-deadline" v-model="errandForm.deadline" type="text" placeholder="如：2026-07-01 18:00" />
          </FormField>
        </div>

        <div class="form-row">
          <FormField label="取件/起点" field-id="errand-pickup" class="form-half">
            <input id="errand-pickup" v-model="errandForm.pickupLocation" type="text" placeholder="如：校门口快递柜" />
          </FormField>
          <FormField label="送达/终点" field-id="errand-delivery" class="form-half">
            <input id="errand-delivery" v-model="errandForm.deliveryLocation" type="text" placeholder="如：3号宿舍楼" />
          </FormField>
        </div>

        <FormField label="发布人" field-id="errand-publisher" required :error="formErrors.publisher">
          <input id="errand-publisher" v-model="errandForm.publisher" type="text" placeholder="你的昵称" />
        </FormField>
      </template>

      <!-- ====== 拼单搭子表单 ====== -->
      <template v-if="activeType === 'groupBuy'">
        <FormField label="拼单类型" field-id="gb-type">
          <select id="gb-type" v-model="groupBuyForm.type">
            <option v-for="gt in groupBuyTypes" :key="gt.key" :value="gt.key">{{ gt.label }}</option>
          </select>
        </FormField>

        <FormField label="标题" field-id="gb-title" required :error="formErrors.title">
          <input id="gb-title" v-model="groupBuyForm.title" type="text" placeholder="简要描述拼单/搭子/组队内容" />
        </FormField>

        <FormField label="详细描述" field-id="gb-desc" required :error="formErrors.description">
          <textarea id="gb-desc" v-model="groupBuyForm.description" placeholder="详细说明拼单物品、搭子要求、组队目标等" rows="3"></textarea>
        </FormField>

        <div class="form-row">
          <FormField label="目标人数" field-id="gb-count" required :error="formErrors.targetCount" class="form-half">
            <input id="gb-count" v-model="groupBuyForm.targetCount" type="number" placeholder="如：3" min="2" />
          </FormField>
          <FormField label="截止时间" field-id="gb-deadline" class="form-half">
            <input id="gb-deadline" v-model="groupBuyForm.deadline" type="text" placeholder="如：2026-07-05" />
          </FormField>
        </div>

        <div class="form-row">
          <FormField label="地点" field-id="gb-location" class="form-half">
            <input id="gb-location" v-model="groupBuyForm.location" type="text" placeholder="如：东校区" />
          </FormField>
          <FormField label="发起人" field-id="gb-initiator" required :error="formErrors.initiator" class="form-half">
            <input id="gb-initiator" v-model="groupBuyForm.initiator" type="text" placeholder="你的昵称" />
          </FormField>
        </div>
      </template>

      <!-- ====== 失物招领表单 ====== -->
      <template v-if="activeType === 'lostFound'">
        <FormField label="信息类型">
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
        </FormField>

        <FormField label="标题" field-id="lf-title" required :error="formErrors.title">
          <input id="lf-title" v-model="lostFoundForm.title" type="text" placeholder="如：黑色双肩包" />
        </FormField>

        <FormField label="物品名称" field-id="lf-item-name">
          <input id="lf-item-name" v-model="lostFoundForm.itemName" type="text" placeholder="如：双肩包" />
        </FormField>

        <FormField label="详细描述" field-id="lf-desc" required :error="formErrors.description">
          <textarea id="lf-desc" v-model="lostFoundForm.description" placeholder="描述物品特征、遗失/拾取经过等" rows="3"></textarea>
        </FormField>

        <div class="form-row">
          <FormField label="地点" field-id="lf-location" class="form-half">
            <input id="lf-location" v-model="lostFoundForm.location" type="text" placeholder="如：图书馆二楼" />
          </FormField>
          <FormField label="日期" field-id="lf-date" class="form-half">
            <input id="lf-date" v-model="lostFoundForm.date" type="date" />
          </FormField>
        </div>

        <FormField label="联系方式" field-id="lf-contact" required :error="formErrors.contact">
          <input id="lf-contact" v-model="lostFoundForm.contact" type="text" placeholder="如：李同学 138xxxx1234" />
        </FormField>
      </template>

      <!-- 提交按钮 -->
      <button type="submit" class="submit-btn" :disabled="!checkFormValid() || submitting">
        {{ submitting ? '发布中...' : '🚀 立即发布' }}
      </button>
    </form>

    <!-- 成功提示 -->
    <div v-if="submitted" class="success-msg">
      ✅ 发布成功！正在跳转到对应列表页...
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
  margin: 4px 0 0;
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
