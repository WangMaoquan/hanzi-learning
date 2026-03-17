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

  <div v-else-if="poem" class="min-h-screen pb-12" style="background-color: #f5f5f0">
    <div class="max-w-6xl mx-auto px-4 pt-6">
      <!-- 返回链接 -->
      <div class="mb-6">
        <BackLink to="/learn/poems" text="返回列表" />
      </div>

      <!-- 标题区域 -->
      <div class="mb-8">
        <h1
          class="text-4xl font-bold mb-4"
          style="color: #1a1a2e; font-family: 'Noto Serif SC', serif"
        >
          {{ poem.title }}
        </h1>
        <div class="flex items-center gap-4">
          <span
            class="px-4 py-1.5 text-sm font-semibold rounded-full"
            style="background-color: #f1f5f9; color: #475569"
          >
            {{ poem.dynasty }}
          </span>
          <span class="text-lg" style="color: #6b7280">{{ poem.author }}</span>
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
                  <span class="text-xs h-4" style="color: #94a3b8">
                    {{ poem.versePinyins?.[verseIdx]?.[charIdx] || '' }}
                  </span>
                  <span class="text-2xl font-bold py-1" style="color: #1a1a2e">{{ char }}</span>
                </div>
              </div>
            </div>

            <!-- 标签 -->
            <div
              v-if="poem.tags?.length"
              class="flex flex-wrap gap-2 mt-8 pt-6 border-t"
              style="border-color: #e5e7eb"
            >
              <span
                v-for="tag in poem.tags"
                :key="tag"
                class="px-3 py-1.5 text-sm rounded-lg transition-colors cursor-pointer"
                style="background-color: #f5f5f0; color: #6b7280"
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
            <h2
              class="text-lg font-bold mb-5 flex items-center gap-2"
              style="color: #1a1a2e; font-family: 'Noto Serif SC', serif"
            >
              <span class="w-1.5 h-6 rounded-full" style="background-color: #1a1a2e"></span>
              诗词信息
            </h2>
            <div class="space-y-4">
              <div v-if="poem.type" class="flex items-center justify-between">
                <span style="color: #9ca3af">类型</span>
                <span
                  class="px-3 py-1 font-medium rounded-lg"
                  style="background-color: #f1f5f9; color: #475569"
                >
                  {{ poem.type }}
                </span>
              </div>
              <div v-if="poem.difficulty" class="flex items-center justify-between">
                <span style="color: #9ca3af">难度</span>
                <div class="flex items-center gap-2">
                  <div class="flex gap-1">
                    <span
                      v-for="i in 5"
                      :key="i"
                      class="w-2 h-2 rounded-full"
                      :style="
                        i <= poem.difficulty
                          ? 'background-color: #1A1A2E;'
                          : 'background-color: #E5E7EB;'
                      "
                    ></span>
                  </div>
                  <span class="font-medium" style="color: #374151">{{ poem.difficulty }}/5</span>
                </div>
              </div>
              <div class="flex items-center justify-between">
                <span style="color: #9ca3af">字数</span>
                <span class="font-medium" style="color: #374151">
                  {{ poem.verses?.flat().length || 0 }} 字
                </span>
              </div>
            </div>
          </Card>

          <!-- 背诵模式按钮 -->
          <button
            class="w-full px-6 py-4 font-semibold rounded-xl transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 flex items-center justify-center gap-2"
            style="background-color: #1a1a2e; color: white"
            @click="router.push(`/practice?type=poem&id=${poem.id}`)"
          >
            <span class="text-xl">📖</span>
            开始背诵
          </button>

          <!-- 分享提示 -->
          <p class="text-center text-sm" style="color: #9ca3af">
            点击按钮开始背诵模式，系统将随机展示诗句让你背诵
          </p>
        </div>
      </div>

      <!-- 上一首/下一首导航 -->
      <div class="mt-8 flex items-center justify-between">
        <RouterLink
          v-if="neighbors.prev"
          :to="`/learn/poems/${neighbors.prev.id}`"
          class="group flex items-center gap-3 px-6 py-4 bg-white rounded-xl border-2 border-transparent hover:shadow-lg transition-all"
          style="border-color: #e5e7eb"
        >
          <span
            class="w-10 h-10 flex items-center justify-center rounded-full transition-colors"
            style="background-color: #f1f5f9; color: #64748b"
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
            <div class="text-xs" style="color: #9ca3af"> 上一首 </div>
            <div class="text-base font-semibold transition-colors" style="color: #374151">
              {{ neighbors.prev.title }}
            </div>
          </div>
        </RouterLink>
        <div v-else></div>

        <RouterLink
          v-if="neighbors.next"
          :to="`/learn/poems/${neighbors.next.id}`"
          class="group flex items-center gap-3 px-6 py-4 bg-white rounded-xl border-2 border-transparent hover:shadow-lg transition-all"
          style="border-color: #e5e7eb"
        >
          <div class="text-right">
            <div class="text-xs" style="color: #9ca3af"> 下一首 </div>
            <div class="text-base font-semibold transition-colors" style="color: #374151">
              {{ neighbors.next.title }}
            </div>
          </div>
          <span
            class="w-10 h-10 flex items-center justify-center rounded-full transition-colors"
            style="background-color: #f1f5f9; color: #64748b"
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
    <RouterLink to="/learn/poems" style="color: #1a1a2e"> 返回列表 </RouterLink>
  </Empty>
</template>
