import axios, { type AxiosResponse } from 'axios'

// 创建 axios 实例
const api = axios.create({
  baseURL: '/api/v1',
  timeout: 10000,
})

// 添加通用请求头
api.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest'

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
// 提取 data 字段返回，axios 泛型会在使用时推断
api.interceptors.response.use(
  <T>(response: { data: ApiResponse<T> }): T => {
    return response.data.data
  },
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

// ==================== 汉字 API ====================

export interface Character {
  id: string
  title: string
  content: string
  pinyin: string | null
  pinyins: string | null
  radicals: string | null
  strokes: number | null
  structure: '左右' | '上下' | '包围' | '独体' | '品字' | null
  difficulty: number
  tags: string[]
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

export function getCharacters(params?: CharacterListParams) {
  return api.get<CharacterListResponse>('/characters', { params }).then((res) => res.data)
}

export function getCharacter(id: string) {
  return api.get<Character>(`/characters/${id}`).then((res) => res.data)
}

export function getCharacterCount() {
  return api.get<number>('/characters/count').then((res) => res.data)
}

export function getRandomCharacter() {
  return api.get<Character>('/characters/random').then((res) => res.data)
}

export function searchCharacters(q: string) {
  return api
    .get<CharacterListResponse>('/characters/search', { params: { q } })
    .then((res) => res.data)
}

// ==================== 成语 API ====================

export interface Idiom {
  id: string
  title: string
  content: string
  pinyin: string | null
  derivation: string | null
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

export function getIdioms(params?: IdiomListParams) {
  return api.get<IdiomListResponse>('/idioms', { params }).then((res) => res.data)
}

export function getIdiom(id: string) {
  return api.get<Idiom>(`/idioms/${id}`).then((res) => res.data)
}

export function getIdiomCount() {
  return api.get<number>('/idioms/count').then((res) => res.data)
}

export function getRandomIdiom() {
  return api.get<Idiom>('/idioms/random').then((res) => res.data)
}

export function searchIdioms(q: string) {
  return api.get<IdiomListResponse>('/idioms/search', { params: { q } }).then((res) => res.data)
}

// ==================== 古诗 API ====================

export interface Poem {
  id: string
  title: string
  author: string
  content: string
  pinyin: string | null
  difficulty: number
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

export function getPoems(params?: PoemListParams) {
  return api.get<PoemListResponse>('/poems', { params }).then((res) => res.data)
}

export function getPoem(id: string) {
  return api.get<Poem>(`/poems/${id}`).then((res) => res.data)
}

export function getPoemCount() {
  return api.get<number>('/poems/count').then((res) => res.data)
}

export function getRandomPoem() {
  return api.get<Poem>('/poems/random')
}

export default api
