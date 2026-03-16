<script setup lang="ts">
  import { ref, onMounted, watch } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { getPoem, getPoemNeighbors, type Poem } from '@/services/api'
  import { useToast } from '@/composables'
  import { Card, Loading, Empty, BackLink } from '@hanzi-learning/ui'

  const route = useRoute()
  const router = useRouter()
  const toast = useToast()

  const loading = ref(true)
  const poem = ref<Poem | null>(null)
  const neighbors = ref<{ prev: Poem | null; next: Poem | null }>({
    prev: null,
    next: null,
  })

  async function fetchPoem() {
    try {
      loading.value = true
      const id = route.params.id as string
      if (!id) return

      const [poemRes, neighborsRes] = await Promise.all([getPoem(id), getPoemNeighbors(id)])
      poem.value = poemRes.data
      neighbors.value = neighborsRes.data
    } catch (error) {
      console.error('获取古诗详情失败:', error)
      toast.error('获取古诗详情失败')
    } finally {
      loading.value = false
    }
  }

  // 监听路由参数变化
  watch(
    () => route.params.id,
    () => {
      fetchPoem()
    }
  )

  onMounted(() => {
    fetchPoem()
  })
</script>

<template>
  <Loading v-if="loading" text="加载中..." />

  <div v-else-if="poem" class="min-h-screen bg-gray-50 pb-12">
    <!-- 页面头部 -->
    <div class="bg-gradient-to-r from-secondary-50 to-secondary-100 py-6 mb-6">
      <div class="max-w-6xl mx-auto px-4">
        <BackLink to="/learn/poems" text="返回列表" />
      </div>
    </div>

    <div class="max-w-6xl mx-auto px-4">
      <!-- 标题区域 -->
      <div class="mb-8">
        <h1 class="text-4xl font-bold text-gray-900 mb-4">
          {{ poem.title }}
        </h1>
        <div class="flex items-center gap-4">
          <span
            class="px-4 py-1.5 bg-secondary-100 text-secondary-700 text-sm font-semibold rounded-full"
          >
            {{ poem.dynasty }}
          </span>
          <span class="text-lg text-gray-600">{{ poem.author }}</span>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- 左侧：原文 -->
        <div class="lg:col-span-2 space-y-6">
          <Card hoverable>
            <!-- 诗句展示 -->
            <div class="space-y-6">
              <div
                v-for="(verse, verseIdx) in poem.verses"
                :key="verseIdx"
                class="flex justify-center gap-4 flex-wrap"
              >
                <div
                  v-for="(char, charIdx) in verse"
                  :key="charIdx"
                  class="flex flex-col items-center min-w-[2rem]"
                >
                  <span class="text-xs text-secondary-400 h-4">
                    {{ poem.versePinyins?.[verseIdx]?.[charIdx] || '' }}
                  </span>
                  <span class="text-2xl font-bold text-gray-800 py-1">{{ char }}</span>
                </div>
              </div>
            </div>

            <!-- 标签 -->
            <div
              v-if="poem.tags?.length"
              class="flex flex-wrap gap-2 mt-8 pt-6 border-t border-gray-100"
            >
              <span
                v-for="tag in poem.tags"
                :key="tag"
                class="px-3 py-1.5 bg-gray-100 text-gray-600 text-sm rounded-lg hover:bg-secondary-100 hover:text-secondary-700 transition-colors cursor-pointer"
              >
                #{{ tag }}
              </span>
            </div>
          </Card>
        </div>

        <!-- 右侧：信息 -->
        <div class="space-y-6">
          <!-- 信息卡片 -->
          <Card>
            <h2 class="text-lg font-bold text-gray-900 mb-5 flex items-center gap-2">
              <span class="w-1.5 h-6 bg-secondary-400 rounded-full"></span>
              诗词信息
            </h2>
            <div class="space-y-4">
              <div v-if="poem.type" class="flex items-center justify-between">
                <span class="text-gray-500">类型</span>
                <span class="px-3 py-1 bg-secondary-50 text-secondary-700 font-medium rounded-lg">
                  {{ poem.type }}
                </span>
              </div>
              <div v-if="poem.difficulty" class="flex items-center justify-between">
                <span class="text-gray-500">难度</span>
                <div class="flex items-center gap-2">
                  <div class="flex gap-1">
                    <span
                      v-for="i in 5"
                      :key="i"
                      class="w-2 h-2 rounded-full"
                      :class="i <= poem.difficulty ? 'bg-secondary-400' : 'bg-gray-200'"
                    ></span>
                  </div>
                  <span class="text-gray-700 font-medium">{{ poem.difficulty }}/5</span>
                </div>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-gray-500">字数</span>
                <span class="text-gray-700 font-medium">
                  {{ poem.verses?.flat().length || 0 }} 字
                </span>
              </div>
            </div>
          </Card>

          <!-- 背诵模式按钮 -->
          <button
            class="w-full px-6 py-4 bg-secondary-400 text-white font-semibold rounded-xl hover:bg-secondary-500 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 flex items-center justify-center gap-2"
            @click="router.push(`/practice?type=poem&id=${poem.id}`)"
          >
            <span class="text-xl">📖</span>
            开始背诵
          </button>

          <!-- 分享提示 -->
          <p class="text-center text-gray-400 text-sm">
            点击按钮开始背诵模式，系统将随机展示诗句让你背诵
          </p>
        </div>
      </div>

      <!-- 上一首/下一首导航 -->
      <div class="mt-8 flex items-center justify-between">
        <RouterLink
          v-if="neighbors.prev"
          :to="`/learn/poems/${neighbors.prev.id}`"
          class="group flex items-center gap-3 px-6 py-4 bg-white rounded-xl border-2 border-transparent hover:border-secondary-200 hover:shadow-lg transition-all"
        >
          <span
            class="w-10 h-10 flex items-center justify-center bg-secondary-100 text-secondary-500 rounded-full group-hover:bg-secondary-200 transition-colors"
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
            <div class="text-xs text-gray-400"> 上一首 </div>
            <div
              class="text-base font-semibold text-gray-700 group-hover:text-secondary-600 transition-colors"
            >
              {{ neighbors.prev.title }}
            </div>
          </div>
        </RouterLink>
        <div v-else></div>

        <RouterLink
          v-if="neighbors.next"
          :to="`/learn/poems/${neighbors.next.id}`"
          class="group flex items-center gap-3 px-6 py-4 bg-white rounded-xl border-2 border-transparent hover:border-secondary-200 hover:shadow-lg transition-all"
        >
          <div class="text-right">
            <div class="text-xs text-gray-400"> 下一首 </div>
            <div
              class="text-base font-semibold text-gray-700 group-hover:text-secondary-600 transition-colors"
            >
              {{ neighbors.next.title }}
            </div>
          </div>
          <span
            class="w-10 h-10 flex items-center justify-center bg-secondary-100 text-secondary-500 rounded-full group-hover:bg-secondary-200 transition-colors"
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

  <Empty v-else description="未找到该古诗">
    <RouterLink to="/learn/poems" class="text-secondary-500 hover:underline"> 返回列表 </RouterLink>
  </Empty>
</template>
