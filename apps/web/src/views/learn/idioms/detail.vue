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

  <div v-else-if="idiom" class="min-h-screen pb-12 bg-secondary-50">
    <div class="max-w-4xl mx-auto px-4 pt-6">
      <!-- 返回链接 -->
      <div class="mb-6">
        <BackLink to="/learn/idioms" text="返回列表" />
      </div>

      <Card hoverable class="border-2 border-yellow-500">
        <!-- 成语标题区域 -->
        <div class="text-center mb-8 pb-8 border-b border-yellow-100">
          <div
            class="inline-flex items-center justify-center rounded-xl px-8 py-4 mb-4 shadow-inner bg-[linear-gradient(135deg,#fffbeb_0%,#fef3c7_100%)]"
          >
            <span class="text-5xl font-bold tracking-widest text-secondary-950">{{
              idiom.title
            }}</span>
          </div>
          <p class="text-2xl font-semibold text-secondary-500">
            {{ idiom.pinyin }}
          </p>
        </div>

        <!-- 释义 -->
        <div class="mb-8">
          <h2 class="text-lg font-bold mb-4 flex items-center gap-2 text-secondary-950 font-serif">
            <span class="w-2 h-6 rounded-full bg-yellow-500"></span>
            释义
          </h2>
          <p class="leading-relaxed text-lg text-gray-700">
            {{ idiom.content || '暂无释义' }}
          </p>
        </div>

        <!-- 出处 -->
        <div v-if="idiom.derivation" class="mb-8">
          <h2 class="text-lg font-bold mb-4 flex items-center gap-2 text-secondary-950 font-serif">
            <span class="w-2 h-6 rounded-full bg-yellow-500"></span>
            出处
          </h2>
          <p class="italic leading-relaxed rounded-xl p-4 bg-yellow-50 text-secondary-500">
            {{ idiom.derivation }}
          </p>
        </div>

        <!-- 例句 -->
        <div v-if="idiom.example" class="mb-8">
          <h2 class="text-lg font-bold mb-4 flex items-center gap-2 text-secondary-950 font-serif">
            <span class="w-2 h-6 rounded-full bg-yellow-500"></span>
            例句
          </h2>
          <p
            class="italic leading-relaxed rounded-xl p-5 border bg-secondary-50 text-gray-700 border-gray-200"
          >
            {{ idiom.example }}
          </p>
        </div>

        <!-- 近义词 -->
        <div v-if="idiom.synonyms?.length" class="mb-8">
          <h2 class="text-lg font-bold mb-4 flex items-center gap-2 text-secondary-950 font-serif">
            <span class="w-2 h-6 rounded-full bg-blue-500"></span>
            近义词
          </h2>
          <div class="flex flex-wrap gap-2">
            <span
              v-for="word in idiom.synonyms"
              :key="word"
              class="px-4 py-2 font-medium rounded-xl transition-colors cursor-pointer bg-blue-50 text-blue-700"
            >
              {{ word }}
            </span>
          </div>
        </div>

        <!-- 反义词 -->
        <div v-if="idiom.antonyms?.length">
          <h2 class="text-lg font-bold mb-4 flex items-center gap-2 text-secondary-950 font-serif">
            <span class="w-2 h-6 rounded-full bg-red-500"></span>
            反义词
          </h2>
          <div class="flex flex-wrap gap-2">
            <span
              v-for="word in idiom.antonyms"
              :key="word"
              class="px-4 py-2 font-medium rounded-xl transition-colors cursor-pointer bg-red-50 text-red-600"
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
          class="group flex items-center gap-3 px-6 py-4 bg-white rounded-xl border-2 border-transparent hover:shadow-lg transition-all border-gray-200"
        >
          <span
            class="w-10 h-10 flex items-center justify-center rounded-full transition-colors bg-yellow-50 text-amber-700"
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
            <div class="text-base font-semibold transition-colors text-gray-700">
              {{ neighbors.prev.title }}
            </div>
          </div>
        </RouterLink>
        <div v-else></div>

        <RouterLink
          v-if="neighbors.next"
          :to="`/learn/idioms/${neighbors.next.id}`"
          class="group flex items-center gap-3 px-6 py-4 bg-white rounded-xl border-2 border-transparent hover:shadow-lg transition-all border-gray-200"
        >
          <div class="text-right">
            <div class="text-xs text-gray-400"> 下一个 </div>
            <div class="text-base font-semibold transition-colors text-gray-700">
              {{ neighbors.next.title }}
            </div>
          </div>
          <span
            class="w-10 h-10 flex items-center justify-center rounded-full transition-colors bg-yellow-50 text-amber-700"
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
    <RouterLink to="/learn/idioms" class="text-yellow-500"> 返回列表 </RouterLink>
  </Empty>
</template>
