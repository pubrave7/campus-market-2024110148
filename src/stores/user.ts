import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useUserStore = defineStore('user', () => {
  // ====== 用户状态（模拟） ======
  const name = ref('张同学')
  const avatar = ref('')
  const school = ref('某某大学')
  const college = ref('计算机科学与技术')
  const grade = ref('2024级')
  const studentId = ref('2024xxxxx')
  const phone = ref('138****8888')
  const email = ref('zhang@example.com')
  const joinedAt = ref('2026-06-01')
  const bio = ref('爱折腾的码农一枚，喜欢淘二手好书 📚')
  const isLoggedIn = ref(true)

  // ====== 统计数据 ======
  const publishedCount = ref(5)
  const soldCount = ref(3)
  const purchasedCount = ref(2)

  // ====== Getters ======
  /** 显示名称（优先使用昵称） */
  const displayName = computed(() => name.value)

  /** 头像首字 */
  const avatarChar = computed(() => name.value.charAt(0))

  /** 学院+年级 */
  const schoolInfo = computed(() => `${school.value} · ${college.value}`)

  /** 完整信息 */
  const fullInfo = computed(() => ({
    name: name.value,
    school: school.value,
    college: college.value,
    grade: grade.value,
    studentId: studentId.value,
    phone: phone.value,
    email: email.value,
    joinedAt: joinedAt.value,
    bio: bio.value,
  }))

  // ====== Actions ======
  /** 更新用户资料 */
  function updateProfile(data: {
    name?: string
    phone?: string
    email?: string
    bio?: string
  }) {
    if (data.name !== undefined) name.value = data.name
    if (data.phone !== undefined) phone.value = data.phone
    if (data.email !== undefined) email.value = data.email
    if (data.bio !== undefined) bio.value = data.bio
  }

  /** 增加发布计数 */
  function incrementPublished() {
    publishedCount.value++
  }

  return {
    // state
    name,
    avatar,
    school,
    college,
    grade,
    studentId,
    phone,
    email,
    joinedAt,
    bio,
    isLoggedIn,
    publishedCount,
    soldCount,
    purchasedCount,
    // getters
    displayName,
    avatarChar,
    schoolInfo,
    fullInfo,
    // actions
    updateProfile,
    incrementPublished,
  }
})
