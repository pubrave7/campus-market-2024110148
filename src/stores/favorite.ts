import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

/** 收藏项类型标识 */
export type FavoriteType = 'trade' | 'errand' | 'groupBuy' | 'lostFound'

/** 收藏项 */
export interface FavoriteItem {
  id: number
  type: FavoriteType
  title: string
  price?: string | number
  seller?: string
  publisher?: string
  initiator?: string
  image?: string
  time?: string
}

export const useFavoriteStore = defineStore('favorite', () => {
  // ====== 收藏列表（前端内存状态） ======
  const items = ref<FavoriteItem[]>([])

  // ====== Getters ======
  /** 收藏总数 */
  const count = computed(() => items.value.length)

  /** 按类型筛选收藏 */
  function getByType(type: FavoriteType) {
    return items.value.filter(item => item.type === type)
  }

  /** 判断是否已收藏 */
  function isFavorited(id: number, type: FavoriteType): boolean {
    return items.value.some(item => item.id === id && item.type === type)
  }

  // ====== Actions ======
  /** 添加收藏 */
  function addFavorite(item: FavoriteItem) {
    if (!isFavorited(item.id, item.type)) {
      items.value.push({ ...item })
    }
  }

  /** 取消收藏 */
  function removeFavorite(id: number, type: FavoriteType) {
    const index = items.value.findIndex(
      item => item.id === id && item.type === type,
    )
    if (index !== -1) {
      items.value.splice(index, 1)
    }
  }

  /** 切换收藏状态 */
  function toggleFavorite(item: FavoriteItem) {
    if (isFavorited(item.id, item.type)) {
      removeFavorite(item.id, item.type)
    } else {
      addFavorite(item)
    }
  }

  return {
    // state
    items,
    // getters
    count,
    getByType,
    isFavorited,
    // actions
    addFavorite,
    removeFavorite,
    toggleFavorite,
  }
})
