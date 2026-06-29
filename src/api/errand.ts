import http from './http'

export interface ErrandItem {
  id: number
  type: 'delivery' | 'proxy' | 'other'
  title: string
  description: string
  reward: number
  pickupLocation: string
  deliveryLocation: string
  deadline: string
  publisher: string
  status: 'open' | 'claimed' | 'done'
  image?: string
}

export function getErrands(): Promise<ErrandItem[]> {
  return http.get('/errands').then(res => res.data)
}

export function getErrandById(id: number): Promise<ErrandItem | null> {
  return http.get(`/errands/${id}`).then(res => res.data).catch(() => null)
}

export function createErrand(data: Omit<ErrandItem, 'id'>): Promise<ErrandItem> {
  return http.post('/errands', data).then(res => res.data)
}
