import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

const STORAGE_KEY = 'campus_market_user'

/** 从 localStorage 读取用户 */
function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      return JSON.parse(raw)
    }
  } catch {
    // ignore parse errors
  }
  return null
}

/** 保存用户到 localStorage */
function saveToStorage(user: Record<string, unknown> | null) {
  try {
    if (user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
    } else {
      localStorage.removeItem(STORAGE_KEY)
    }
  } catch {
    // ignore
  }
}

export const useUserStore = defineStore('user', () => {
  // ====== 初始化：尝试从 localStorage 恢复 ======
  const saved = loadFromStorage()

  // ====== 用户状态 ======
  const id = ref<number | null>(saved?.id ?? null)
  const username = ref<string>(saved?.username ?? '')
  const name = ref<string>(saved?.displayName ?? '')
  const avatar = ref<string>(saved?.avatar ?? '')
  const school = ref<string>(saved?.school ?? '')
  const college = ref<string>(saved?.college ?? '')
  const grade = ref<string>(saved?.grade ?? '')
  const studentId = ref<string>(saved?.studentId ?? '')
  const phone = ref<string>(saved?.phone ?? '')
  const email = ref<string>(saved?.email ?? '')
  const joinedAt = ref<string>(saved?.createdAt ?? '')
  const bio = ref<string>(saved?.bio ?? '')
  const isLoggedIn = ref<boolean>(saved !== null)

  // ====== 统计数据 ======
  const publishedCount = ref(saved?.publishedCount ?? 0)
  const soldCount = ref(saved?.soldCount ?? 0)
  const purchasedCount = ref(saved?.purchasedCount ?? 0)

  // ====== Getters ======
  const displayName = computed(() => name.value || username.value || '未登录')

  const avatarChar = computed(() => {
    const dn = displayName.value
    return dn && dn !== '未登录' ? dn.charAt(0) : '?'
  })

  const schoolInfo = computed(() => {
    if (!school.value && !college.value) return ''
    return `${school.value || ''}${college.value ? ' · ' + college.value : ''}`
  })

  const fullInfo = computed(() => ({
    id: id.value,
    username: username.value,
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

  /** 登录：保存用户信息到 Store 和 localStorage */
  function login(user: {
    id?: number
    username: string
    displayName: string
    avatar?: string
    school?: string
    college?: string
    grade?: string
    studentId?: string
    phone?: string
    email?: string
    bio?: string
    createdAt?: string
    publishedCount?: number
    soldCount?: number
    purchasedCount?: number
  }) {
    id.value = user.id ?? null
    username.value = user.username
    name.value = user.displayName
    avatar.value = user.avatar ?? ''
    school.value = user.school ?? ''
    college.value = user.college ?? ''
    grade.value = user.grade ?? ''
    studentId.value = user.studentId ?? ''
    phone.value = user.phone ?? ''
    email.value = user.email ?? ''
    joinedAt.value = user.createdAt ?? ''
    bio.value = user.bio ?? ''
    isLoggedIn.value = true
    publishedCount.value = user.publishedCount ?? 0
    soldCount.value = user.soldCount ?? 0
    purchasedCount.value = user.purchasedCount ?? 0

    // 持久化到 localStorage
    saveToStorage({
      id: user.id,
      username: user.username,
      displayName: user.displayName,
      avatar: user.avatar ?? '',
      school: user.school ?? '',
      college: user.college ?? '',
      grade: user.grade ?? '',
      studentId: user.studentId ?? '',
      phone: user.phone ?? '',
      email: user.email ?? '',
      createdAt: user.createdAt ?? '',
      bio: user.bio ?? '',
      publishedCount: user.publishedCount ?? 0,
      soldCount: user.soldCount ?? 0,
      purchasedCount: user.purchasedCount ?? 0,
    })
  }

  /** 退出登录：清空 Store 和 localStorage */
  function logout() {
    id.value = null
    username.value = ''
    name.value = ''
    avatar.value = ''
    school.value = ''
    college.value = ''
    grade.value = ''
    studentId.value = ''
    phone.value = ''
    email.value = ''
    joinedAt.value = ''
    bio.value = ''
    isLoggedIn.value = false
    publishedCount.value = 0
    soldCount.value = 0
    purchasedCount.value = 0

    // 清空 localStorage
    saveToStorage(null)
  }

  /** 从 localStorage 恢复登录状态（App 启动时调用） */
  function restoreLogin(): boolean {
    const saved = loadFromStorage()
    if (saved) {
      login(saved)
      return true
    }
    return false
  }

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

    // 同步更新 localStorage
    const saved = loadFromStorage()
    if (saved) {
      if (data.name !== undefined) saved.displayName = data.name
      if (data.phone !== undefined) saved.phone = data.phone
      if (data.email !== undefined) saved.email = data.email
      if (data.bio !== undefined) saved.bio = data.bio
      saveToStorage(saved)
    }
  }

  /** 增加发布计数 */
  function incrementPublished() {
    publishedCount.value++
    // 同步到 localStorage
    const saved = loadFromStorage()
    if (saved) {
      saved.publishedCount = publishedCount.value
      saveToStorage(saved)
    }
  }

  return {
    // state
    id,
    username,
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
    login,
    logout,
    restoreLogin,
    updateProfile,
    incrementPublished,
  }
})
