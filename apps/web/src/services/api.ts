import axios from 'axios'

// 创建 axios 实例
const api = axios.create({
  baseURL: '/api/v1',
  timeout: 10000,
})

// 响应拦截器
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    console.error('API Error:', error)
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

export default api
