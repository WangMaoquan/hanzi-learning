import axios, { AxiosError, AxiosResponse } from 'axios'

// 创建 axios 实例
const api = axios.create({
  baseURL: '/api/v1',
  timeout: 10000,
})

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

// 响应拦截器 - 处理统一返回格式
api.interceptors.response.use(
  (response: AxiosResponse<ApiResponse<unknown>>) => {
    const res = response.data
    if (res.success) {
      return res.data // 返回内层的 data 字段
    }
    // 理论上成功响应不会进入 error 处理，因为 success=true
    return res.data
  },
  (error: AxiosError<ApiError>) => {
    if (error.response) {
      // 服务器返回了错误响应
      const { statusCode, message } = error.response.data
      console.error(`API Error ${statusCode}:`, message)
    } else if (error.request) {
      // 请求已发出但没有收到响应
      console.error('API Error: 网络请求失败')
    } else {
      console.error('API Error:', error.message)
    }
    return Promise.reject(error)
  }
)

// ==================== 汉字 API ====================

export interface Character {
  id: string
  word: string
  pinyin: string | null
  pinyins: string | null
  radical: string | null
  strokes: number | null
  strokeMap: Record<string, number> | null
  structure: string | null
  explanation: string | null
  words: string[]
  createdAt: string
  updatedAt: string
}

export interface CharacterListParams {
  page?: number
  limit?: number
  search?: string
}

export interface CharacterListResponse {
  data: Character[]
  total: number
  page: number
  limit: number
  totalPages: number
}

// 汉字列表
export function getCharacters(params?: CharacterListParams) {
  return api.get<CharacterListResponse>('/characters', { params })
}

// 汉字详情
export function getCharacter(id: string) {
  return api.get<Character>(`/characters/${id}`)
}

// 汉字总数
export function getCharacterCount() {
  return api.get<number>('/characters/count')
}

// 随机汉字
export function getRandomCharacter() {
  return api.get<Character>('/characters/random')
}

// 搜索汉字
export function searchCharacters(q: string) {
  return api.get<CharacterListResponse>('/characters/search', { params: { q } })
}

// ==================== 成语 API ====================

export interface Idiom {
  id: string
  word: string
  pinyin: string | null
  derivation: string | null
  explanation: string | null
  example: string | null
  synonyms: string[]
  antonyms: string[]
  createdAt: string
  updatedAt: string
}

export interface IdiomListParams {
  page?: number
  limit?: number
  search?: string
}

export interface IdiomListResponse {
  data: Idiom[]
  total: number
  page: number
  limit: number
  totalPages: number
}

// 成语列表
export function getIdioms(params?: IdiomListParams) {
  return api.get<IdiomListResponse>('/idioms', { params })
}

// 成语详情
export function getIdiom(id: string) {
  return api.get<Idiom>(`/idioms/${id}`)
}

// 成语总数
export function getIdiomCount() {
  return api.get<number>('/idioms/count')
}

// 随机成语
export function getRandomIdiom() {
  return api.get<Idiom>('/idioms/random')
}

// 搜索成语
export function searchIdioms(q: string) {
  return api.get<IdiomListResponse>('/idioms/search', { params: { q } })
}

// ==================== 古诗 API ====================

export interface Poem {
  id: string
  title: string
  author: string
  content: string
  pinyin: string | null
  difficulty: number | null
  tags: string[]
  dynasty: string
  type: string | null
  verses: string[]
  versePinyins: string[][] | null
  createdAt: string
  updatedAt: string
}

export interface PoemListParams {
  page?: number
  limit?: number
  dynasty?: string
  search?: string
}

export interface PoemListResponse {
  data: Poem[]
  total: number
  page: number
  limit: number
  totalPages: number
}

// 古诗列表
export function getPoems(params?: PoemListParams) {
  return api.get<PoemListResponse>('/poems', { params })
}

// 古诗详情
export function getPoem(id: string) {
  return api.get<Poem>(`/poems/${id}`)
}

// 古诗总数
export function getPoemCount() {
  return api.get<number>('/poems/count')
}

// 随机古诗
export function getRandomPoem() {
  return api.get<Poem>('/poems/random')
}

export default api
