import { ref } from 'vue'
import { getCharacterCount, getPoemCount, getIdiomCount } from '@/services/api'

export interface ContentCounts {
  characterCount: number
  poemCount: number
  idiomCount: number
}

export function useContentCounts() {
  const characterCount = ref(0)
  const poemCount = ref(0)
  const idiomCount = ref(0)
  const loading = ref(true)
  const error = ref<string | null>(null)

  async function fetchCounts() {
    try {
      loading.value = true
      error.value = null

      const [chars, poems, idioms] = await Promise.all([
        getCharacterCount(),
        getPoemCount(),
        getIdiomCount(),
      ])

      characterCount.value = chars
      poemCount.value = poems
      idiomCount.value = idioms
    } catch (e) {
      error.value = '获取统计数据失败'
      console.error('获取统计数据失败:', e)
    } finally {
      loading.value = false
    }
  }

  return {
    characterCount,
    poemCount,
    idiomCount,
    loading,
    error,
    fetchCounts,
  }
}
