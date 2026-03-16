import axios from 'axios'
import type { CharacterVO, IdiomVO, PoemVO, PaginatedVO } from '@hanzi-learning/types'

// 统一响应类型
export interface ApiResponse<T> {
  success: boolean
  data: T
  timestamp: string
}

export interface ApiError {
  success: false
  statusCode: number
  message: string
  error: string
  timestamp: string
}

// 类型别名（兼容旧代码）
export type Character = CharacterVO
export type Idiom = IdiomVO
export type Poem = PoemVO
export type PaginatedResponse<T> = PaginatedVO<T>

// 创建 axios 实例
const api = axios.create({
  baseURL: '/api/v1',
  timeout: 10000,
})

// 添加通用请求头
api.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest'

// 响应拦截器 - 只处理错误，成功直接返回 response
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response) {
      const { statusCode, message } = error.response.data
      console.error(`API Error ${statusCode}:`, message)
    } else if (error.request) {
      console.error('API Error: 网络请求失败')
    } else {
      console.error('API Error:', error.message)
    }
    return Promise.reject(error)
  }
)

export default api

// ==================== 汉字 API ====================

// 类型已在顶部从 @hanzi-learning/types/vo 导入
// Character, Idiom, Poem, PaginatedResponse 均为类型别名

export interface CharacterListParams {
  page?: number
  limit?: number
  search?: string
}

export type CharacterListResponse = PaginatedResponse<Character>

export function getCharacters(params?: CharacterListParams) {
  return api.get<CharacterListResponse>('/characters', { params })
}

export function getCharacter(id: string) {
  return api.get<Character>(`/characters/${id}`)
}

export function getCharacterCount() {
  return api.get<number>('/characters/count')
}

export function getRandomCharacter() {
  return api.get<Character>('/characters/random')
}

export function getCharacterNeighbors(id: string) {
  return api.get<{ prev: Character | null; next: Character | null }>(`/characters/${id}/neighbors`)
}

export function searchCharacters(q: string) {
  return api.get<CharacterListResponse>('/characters/search', { params: { q } })
}

// ==================== 成语 API ====================

// 类型已在顶部从 @hanzi-learning/types/vo 导入

export interface IdiomListParams {
  page?: number
  limit?: number
  search?: string
}

export type IdiomListResponse = PaginatedResponse<Idiom>

export function getIdioms(params?: IdiomListParams) {
  return api.get<IdiomListResponse>('/idioms', { params })
}

export function getIdiom(id: string) {
  return api.get<Idiom>(`/idioms/${id}`)
}

export function getIdiomCount() {
  return api.get<number>('/idioms/count')
}

export function getRandomIdiom() {
  return api.get<Idiom>('/idioms/random')
}

export function getIdiomNeighbors(id: string) {
  return api.get<{ prev: Idiom | null; next: Idiom | null }>(`/idioms/${id}/neighbors`)
}

export function searchIdioms(q: string) {
  return api.get<IdiomListResponse>('/idioms/search', { params: { q } })
}

// ==================== 古诗 API ====================

// 类型已在顶部从 @hanzi-learning/types/vo 导入

export interface PoemListParams {
  page?: number
  limit?: number
  dynasty?: string
  search?: string
}

export type PoemListResponse = PaginatedResponse<Poem>

export function getPoems(params?: PoemListParams) {
  return api.get<PoemListResponse>('/poems', { params })
}

export function getPoem(id: string) {
  return api.get<Poem>(`/poems/${id}`)
}

export function getPoemCount() {
  return api.get<number>('/poems/count')
}

export function getRandomPoem() {
  return api.get<Poem>('/poems/random')
}

export function getPoemNeighbors(id: string) {
  return api.get<{ prev: Poem | null; next: Poem | null }>(`/poems/${id}/neighbors`)
}
