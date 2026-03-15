<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getCharacterCount, getPoemCount, getIdiomCount } from '@/services/api'

const loading = ref(true)
const characterCount = ref(0)
const poemCount = ref(0)
const idiomCount = ref(0)

async function fetchCounts() {
  try {
    loading.value = true
    const [chars, poems, idioms] = await Promise.all([
      getCharacterCount(),
      getPoemCount(),
      getIdiomCount()
    ])
    characterCount.value = chars
    poemCount.value = poems
    idiomCount.value = idioms
  } catch (error) {
    console.error('获取统计数据失败:', error)
  } finally {
    loading.value = false
  }
}

const features = [
  {
    title: '汉字学习',
    description: '笔顺动画、拼音注释、组词练习',
    icon: '✍️',
    path: '/learn/characters',
    count: characterCount,
  },
  {
    title: '古诗词',
    description: '经典唐诗宋词，朗读背诵',
    icon: '📜',
    path: '/learn/poems',
    count: poemCount,
  },
  {
    title: '文言文',
    description: '古今对译，理解经典',
    icon: '📖',
    path: '/learn/prose',
    count: ref(0),
  },
  {
    title: '成语故事',
    description: '典故出处，活学活用',
    icon: '🏮',
    path: '/learn/idioms',
    count: idiomCount,
  },
]

onMounted(() => {
  fetchCounts()
})
</script>

<template>
  <div class="min-h-screen">
    <!-- Header -->
    <header class="bg-white shadow-sm">
      <div class="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <div class="flex items-center gap-2">
          <img src="/favicon.svg" alt="logo" class="w-8 h-8" />
          <span class="text-xl font-bold text-gray-900">汉字学习平台</span>
        </div>
        <nav class="flex gap-6">
          <RouterLink to="/" class="text-gray-600 hover:text-primary-500">首页</RouterLink>
          <RouterLink to="/learn" class="text-gray-600 hover:text-primary-500">学习</RouterLink>
          <RouterLink to="/practice" class="text-gray-600 hover:text-primary-500">练习</RouterLink>
          <RouterLink to="/about" class="text-gray-600 hover:text-primary-500">关于</RouterLink>
        </nav>
      </div>
    </header>

    <!-- Hero -->
    <section class="bg-gradient-to-br from-primary-50 to-primary-100 py-16">
      <div class="max-w-4xl mx-auto px-4 text-center">
        <h1 class="text-4xl font-bold text-gray-900 mb-4">
          趣味学习，轻松掌握中华文化
        </h1>
        <p class="text-lg text-gray-600 mb-8">
          笔画顺序动画、古诗朗读背诵、成语故事讲解，让学习变得有趣
        </p>
        <RouterLink
          to="/learn"
          class="btn btn-primary text-lg px-8 py-3"
        >
          开始学习
        </RouterLink>
      </div>
    </section>

    <!-- Features -->
    <section class="py-16">
      <div class="max-w-6xl mx-auto px-4">
        <h2 class="text-2xl font-bold text-gray-900 text-center mb-12">
          学习内容
        </h2>
        <div v-if="loading" class="text-center text-gray-500 py-8">加载中...</div>
        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <RouterLink
            v-for="feature in features"
            :key="feature.path"
            :to="feature.path"
            class="card hover:shadow-lg transition-shadow"
          >
            <div class="text-4xl mb-4">{{ feature.icon }}</div>
            <h3 class="text-lg font-semibold text-gray-900 mb-2">
              {{ feature.title }}
            </h3>
            <p class="text-gray-500 text-sm mb-3">{{ feature.description }}</p>
            <span class="text-primary-500 text-sm font-medium">
              {{ feature.count.value }} 个内容
            </span>
          </RouterLink>
        </div>
      </div>
    </section>

    <!-- Stats -->
    <section class="bg-white py-12">
      <div class="max-w-4xl mx-auto px-4">
        <div class="grid grid-cols-3 gap-8 text-center">
          <div>
            <div class="text-3xl font-bold text-primary-500">{{ characterCount.toLocaleString() }}+</div>
            <div class="text-gray-500 mt-1">常用汉字</div>
          </div>
          <div>
            <div class="text-3xl font-bold text-secondary-500">{{ (poemCount / 1000).toFixed(0) }}k+</div>
            <div class="text-gray-500 mt-1">经典古诗</div>
          </div>
          <div>
            <div class="text-3xl font-bold text-green-500">{{ idiomCount.toLocaleString() }}+</div>
            <div class="text-gray-500 mt-1">成语故事</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="bg-gray-900 text-gray-400 py-8">
      <div class="max-w-6xl mx-auto px-4 text-center">
        <p>汉字学习平台 - 让学习变得更有趣</p>
      </div>
    </footer>
  </div>
</template>
