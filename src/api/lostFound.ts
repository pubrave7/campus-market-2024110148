import http from './http'

export interface LostFoundItem {
  id: number
  type: 'lost' | 'found'
  title: string
  itemName: string
  description: string
  location: string
  date: string
  contact: string
  status: string
  image?: string
}

export function getLostFounds(): Promise<LostFoundItem[]> {
  return http.get('/lostFounds').then(res => res.data)
}

export function getLostFoundById(id: number): Promise<LostFoundItem | null> {
  return http.get(`/lostFounds/${id}`).then(res => res.data).catch(() => null)
}

export function createLostFound(data: Omit<LostFoundItem, 'id'>): Promise<LostFoundItem> {
  return http.post('/lostFounds', data).then(res => res.data)
}
