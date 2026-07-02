import http from './http'

/** 用户数据接口 */
export interface User {
  id?: number
  username: string
  password: string
  displayName: string
  school: string
  college: string
  grade: string
  studentId: string
  phone: string
  email: string
  bio: string
  avatar: string
  createdAt: string
}

/**
 * 查询所有用户（用于登录校验）
 * 注意：生产环境中绝不应将密码明文暴露给前端
 */
export function getUsers(): Promise<User[]> {
  return http.get('/users').then(res => res.data)
}

/**
 * 注册新用户
 * @param data 用户数据（不含 id，由 JSON Server 自动生成）
 */
export function createUser(data: Omit<User, 'id'>): Promise<User> {
  return http.post('/users', data).then(res => res.data)
}

/**
 * 根据用户名查询用户
 * @param username 用户名
 */
export function getUserByUsername(username: string): Promise<User[]> {
  return http.get(`/users?username=${encodeURIComponent(username)}`).then(res => res.data)
}
