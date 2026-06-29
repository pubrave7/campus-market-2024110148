import http from './http'

export interface GroupBuyItem {
  id: number
  type: 'group-buy' | 'partner' | 'team'
  title: string
  description: string
  targetCount: number
  currentCount: number
  deadline: string
  location: string
  initiator: string
  status: string
  image?: string
}

export function getGroupBuys(): Promise<GroupBuyItem[]> {
  return http.get('/groupBuys').then(res => res.data)
}

export function getGroupBuyById(id: number): Promise<GroupBuyItem | null> {
  return http.get(`/groupBuys/${id}`).then(res => res.data).catch(() => null)
}

export function createGroupBuy(data: Omit<GroupBuyItem, 'id'>): Promise<GroupBuyItem> {
  return http.post('/groupBuys', data).then(res => res.data)
}
