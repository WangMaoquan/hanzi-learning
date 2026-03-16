<script setup lang="ts">
  import { ref, onMounted, watch } from 'vue'
  import { useRoute } from 'vue-router'
  import { getIdiom, getIdiomNeighbors, type Idiom } from '@/services/api'
  import { useToast } from '@/composables'
  import { Card, Loading, Empty, BackLink } from '@hanzi-learning/ui'

  const route = useRoute()
  const toast = useToast()

  const loading = ref(true)
  const idiom = ref<Idiom | null>(null)
  const neighbors = ref<{ prev: Idiom | null; next: Idiom | null }>({
    prev: null,
    next: null,
  })

  // 获取成语详情
  async function fetchIdiom() {
    try {
      loading.value = true
      const id = route.params.id as string
      if (!id) return

      const [idiomRes, neighborsRes] = await Promise.all([getIdiom(id), getIdiomNeighbors(id)])
      idiom.value = idiomRes.data
      neighbors.value = neighborsRes.data
    } catch (error) {
      console.error('获取成语详情失败:', error)
      toast.error('获取成语详情失败')
    } finally {
      loading.value = false
    }
  }

  // 监听路由参数变化
  watch(
    () => route.params.id,
    () => {
      fetchIdiom()
    }
  )

  onMounted(() => {
    fetchIdiom()
  })
</script>

<template>
  <Loading v-if="loading" text="加载中..." />

  <div v-else-if="idiom" class="min-h-screen bg-gray-50 pb-12">
    <div class="max-w-4xl mx-auto px-4 pt-6">
      <!-- 返回链接 -->
      <div class="mb-6">
        <BackLink to="/learn/idioms" text="返回列表" />
      </div>

      <Card hoverable class="border-2 border-orange-200">
        <!-- 成语标题区域 -->
        <div class="text-center mb-8 pb-8 border-b border-orange-100">
          <div
            class="inline-flex items-center justify-center bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl px-8 py-4 mb-4 shadow-inner"
          >
            <span class="text-5xl font-bold text-gray-900 tracking-widest">{{ idiom.title }}</span>
          </div>
          <p class="text-2xl font-semibold text-gray-600">
            {{ idiom.pinyin }}
          </p>
        </div>

        <!-- 释义 -->
        <div class="mb-8">
          <h2 class="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span class="w-2 h-6 bg-orange-400 rounded-full"></span>
            释义
          </h2>
          <p class="text-gray-700 leading-relaxed text-lg">
            {{ idiom.content || '暂无释义' }}
          </p>
        </div>

        <!-- 出处 -->
        <div v-if="idiom.derivation" class="mb-8">
          <h2 class="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span class="w-2 h-6 bg-orange-400 rounded-full"></span>
            出处
          </h2>
          <p class="text-gray-600 italic leading-relaxed bg-orange-50 p-4 rounded-xl">
            {{ idiom.derivation }}
          </p>
        </div>

        <!-- 例句 -->
        <div v-if="idiom.example" class="mb-8">
          <h2 class="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span class="w-2 h-6 bg-orange-400 rounded-full"></span>
            例句
          </h2>
          <p
            class="text-gray-700 italic leading-relaxed bg-gray-50 p-5 rounded-xl border border-gray-100"
          >
            {{ idiom.example }}
          </p>
        </div>

        <!-- 近义词 -->
        <div v-if="idiom.synonyms?.length" class="mb-8">
          <h2 class="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span class="w-2 h-6 bg-blue-400 rounded-full"></span>
            近义词
          </h2>
          <div class="flex flex-wrap gap-2">
            <span
              v-for="word in idiom.synonyms"
              :key="word"
              class="px-4 py-2 bg-blue-50 text-blue-700 font-medium rounded-xl hover:bg-blue-100 transition-colors cursor-pointer"
            >
              {{ word }}
            </span>
          </div>
        </div>

        <!-- 反义词 -->
        <div v-if="idiom.antonyms?.length">
          <h2 class="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span class="w-2 h-6 bg-red-400 rounded-full"></span>
            反义词
          </h2>
          <div class="flex flex-wrap gap-2">
            <span
              v-for="word in idiom.antonyms"
              :key="word"
              class="px-4 py-2 bg-red-50 text-red-700 font-medium rounded-xl hover:bg-red-100 transition-colors cursor-pointer"
            >
              {{ word }}
            </span>
          </div>
        </div>
      </Card>

      <!-- 上一个/下一个导航 -->
      <div class="mt-8 flex items-center justify-between">
        <RouterLink
          v-if="neighbors.prev"
          :to="`/learn/idioms/${neighbors.prev.id}`"
          class="group flex items-center gap-3 px-6 py-4 bg-white rounded-xl border-2 border-transparent hover:border-orange-200 hover:shadow-lg transition-all"
        >
          <span
            class="w-10 h-10 flex items-center justify-center bg-orange-100 text-orange-500 rounded-full group-hover:bg-orange-200 transition-colors"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </span>
          <div class="text-left">
            <div class="text-xs text-gray-400"> 上一个 </div>
            <div
              class="text-base font-semibold text-gray-700 group-hover:text-orange-600 transition-colors"
            >
              {{ neighbors.prev.title }}
            </div>
          </div>
        </RouterLink>
        <div v-else></div>

        <RouterLink
          v-if="neighbors.next"
          :to="`/learn/idioms/${neighbors.next.id}`"
          class="group flex items-center gap-3 px-6 py-4 bg-white rounded-xl border-2 border-transparent hover:border-orange-200 hover:shadow-lg transition-all"
        >
          <div class="text-right">
            <div class="text-xs text-gray-400"> 下一个 </div>
            <div
              class="text-base font-semibold text-gray-700 group-hover:text-orange-600 transition-colors"
            >
              {{ neighbors.next.title }}
            </div>
          </div>
          <span
            class="w-10 h-10 flex items-center justify-center bg-orange-100 text-orange-500 rounded-full group-hover:bg-orange-200 transition-colors"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </span>
        </RouterLink>
        <div v-else></div>
      </div>
    </div>
  </div>

  <Empty v-else description="未找到该成语">
    <RouterLink to="/learn/idioms" class="text-orange-500 hover:underline"> 返回列表 </RouterLink>
  </Empty>
</template>
