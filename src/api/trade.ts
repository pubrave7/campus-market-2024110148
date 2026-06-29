import http from './http'

export interface TradeItem {
  id: number
  title: string
  price: number
  category: string
  condition: string
  description?: string
  seller: string
  publishTime: string
  location: string
  image: string
  status: string
}

export function getTrades(): Promise<TradeItem[]> {
  return http.get('/trades').then(res => res.data)
}

export function getTradeById(id: number): Promise<TradeItem | null> {
  return http.get(`/trades/${id}`).then(res => res.data).catch(() => null)
}

export function createTrade(data: Omit<TradeItem, 'id'>): Promise<TradeItem> {
  return http.post('/trades', data).then(res => res.data)
}
