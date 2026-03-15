<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getCharacterCount, getPoemCount } from '@/services/api'

const loading = ref(true)
const characterCount = ref(0)
const poemCount = ref(0)

async function fetchCounts() {
  try {
    loading.value = true
    const [chars, poems] = await Promise.all([
      getCharacterCount(),
      getPoemCount()
    ])
    characterCount.value = chars
    poemCount.value = poems
  } catch (error) {
    console.error('获取统计数据失败:', error)
  } finally {
    loading.value = false
  }
}

const exercises = [
  {
    title: '汉字书写',
    description: '练习汉字笔顺和书写',
    icon: '✍️',
    path: '/practice/write',
    available: true,
  },
  {
    title: '拼音连线',
    description: '汉字与拼音配对练习',
    icon: '🔗',
    path: '/practice/pinyin',
    available: true,
  },
  {
    title: '古诗填空',
    description: '根据提示填写诗句',
    icon: '📝',
    path: '/practice/poem-fill',
    available: true,
  },
  {
    title: '诗词背诵',
    description: '回忆并背诵古诗',
    icon: '🎯',
    path: '/practice/recite',
    available: true,
  },
]

onMounted(() => {
  fetchCounts()
})
</script>

<template>
  <div>
    <h1 class="text-2xl font-bold text-gray-900 mb-6">练习中心</h1>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <RouterLink
        v-for="exercise in exercises"
        :key="exercise.path"
        :to="exercise.available ? exercise.path : '#'"
        class="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all"
        :class="{ 'opacity-50 cursor-not-allowed': !exercise.available }"
      >
        <div class="flex items-center gap-4">
          <div class="text-4xl">{{ exercise.icon }}</div>
          <div>
            <h3 class="text-lg font-semibold text-gray-900">{{ exercise.title }}</h3>
            <p class="text-gray-500 text-sm">{{ exercise.description }}</p>
          </div>
        </div>
      </RouterLink>
    </div>

    <!-- 学习统计 -->
    <div class="mt-8 bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <h2 class="text-lg font-semibold text-gray-900 mb-4">学习统计</h2>
      <div v-if="loading" class="text-center text-gray-500 py-4">加载中...</div>
      <div v-else class="grid grid-cols-3 gap-6 text-center">
        <div>
          <div class="text-2xl font-bold text-primary-500">{{ characterCount.toLocaleString() }}</div>
          <div class="text-gray-500 text-sm">已学汉字</div>
        </div>
        <div>
          <div class="text-2xl font-bold text-secondary-500">{{ (poemCount / 1000).toFixed(0) }}k+</div>
          <div class="text-gray-500 text-sm">已学古诗</div>
        </div>
        <div>
          <div class="text-2xl font-bold text-green-500">0</div>
          <div class="text-gray-500 text-sm">连续学习天数</div>
        </div>
      </div>
    </div>
  </div>
</template>
