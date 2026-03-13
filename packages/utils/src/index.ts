import type { ContentType, DifficultyLevel } from '@hanzi-learning/types'

export * from './constants'

// 生成唯一ID
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
}

// 格式化日期
export function formatDate(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
}

// 拼音转数字声调（简化）
export function pinyinToNumbers(pinyin: string): string {
  const toneMap: Record<string, string> = {
    a: '1', o: '1', e: '1', i: '1', u: '1', v: '1',
    ai: '2', ei: '2', ui: '2', ao: '2', ou: '2', iu: '2', ie: '2', ve: '2',
    an: '3', en: '3', in: '3', un: '3', vn: '3',
    ang: '4', eng: '4', ing: '4', ong: '4',
  }
  return pinyin.replace(/[aeiouv]+/g, (match) => toneMap[match] || '1')
}

// 难度等级标签
export function getDifficultyLabel(level: DifficultyLevel): string {
  const labels: Record<DifficultyLevel, string> = {
    1: '入门',
    2: '基础',
    3: '进阶',
    4: '高级',
    5: '专家',
  }
  return labels[level]
}

// 内容类型标签
export function getContentTypeLabel(type: ContentType): string {
  const labels: Record<ContentType, string> = {
    character: '汉字',
    poem: '古诗',
    prose: '文言文',
    idiom: '成语',
  }
  return labels[type]
}

// 打乱数组（用于练习题目随机排序）
export function shuffleArray<T>(array: T[]): T[] {
  const result = [...array]
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

// 本地存储工具
const MAX_STORAGE_SIZE = 5 * 1024 * 1024 // 5MB

export const storage = {
  get<T>(key: string, defaultValue?: T): T | null {
    try {
      const item = localStorage.getItem(key)
      if (!item) return defaultValue ?? null
      return JSON.parse(item) as T
    }
    catch {
      // 清理无效数据
      try {
        localStorage.removeItem(key)
      }
      catch {
        // ignore
      }
      return defaultValue ?? null
    }
  },

  set<T>(key: string, value: T): boolean {
    try {
      const serialized = JSON.stringify(value)
      const size = new Blob([serialized]).size

      if (size > MAX_STORAGE_SIZE) {
        console.warn(`Storage quota exceeded: ${key} (${size} bytes)`)
        return false
      }

      localStorage.setItem(key, serialized)
      return true
    }
    catch (error) {
      // 可能是配额超限
      if (error instanceof DOMException && error.name === 'QuotaExceededError') {
        console.error('localStorage quota exceeded')
      }
      return false
    }
  },

  remove(key: string): void {
    try {
      localStorage.removeItem(key)
    }
    catch {
      // ignore
    }
  },

  clear(): void {
    try {
      localStorage.clear()
    }
    catch {
      // ignore
    }
  },

  // 获取已用空间
  getUsage(): number {
    let total = 0
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key) {
          const value = localStorage.getItem(key)
          if (value) {
            total += new Blob([value]).size
          }
        }
      }
    }
    catch {
      // ignore
    }
    return total
  },
}

// 防抖
export function debounce<T extends (...args: unknown[]) => unknown>(
  fn: T,
  delay: number,
): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout> | null = null
  return (...args: Parameters<T>) => {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => fn(...args), delay)
  }
}

// 节流
export function throttle<T extends (...args: unknown[]) => unknown>(
  fn: T,
  limit: number,
): (...args: Parameters<T>) => void {
  let inThrottle = false
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      fn(...args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}
