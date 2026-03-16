<script setup lang="ts">
  import { ref, computed, onMounted, watch } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { getCharacters, getCharacter, type Character } from '@/services/api'
  import { useToast } from '@/composables'
  import { useHanziWriter } from '@hanzi-learning/hanzi-vue'
  import { Card, Loading, Empty, BackLink } from '@hanzi-learning/ui'

  const route = useRoute()
  const router = useRouter()
  const toast = useToast()

  const loading = ref(true)
  const character = ref<Character | null>(null)
  const characters = ref<Character[]>([])
  const writerContainer = ref<HTMLElement | null>(null)

  // 笔顺动画
  const {
    isLoading: writerLoading,
    error: writerError,
    animateCharacter,
  } = useHanziWriter(
    computed(() => character.value?.title || ''),
    writerContainer
  )

  // 计算当前汉字在列表中的索引
  const currentIndex = computed(() => {
    if (!character.value) return -1
    return characters.value.findIndex((c) => c.id === character.value!.id)
  })

  const nextCharacter = computed(() => {
    if (currentIndex.value < 0 || currentIndex.value >= characters.value.length - 1) {
      return null
    }
    return characters.value[currentIndex.value + 1]
  })

  const prevCharacter = computed(() => {
    if (currentIndex.value <= 0) {
      return null
    }
    return characters.value[currentIndex.value - 1]
  })

  // 获取数据
  async function fetchData() {
    try {
      loading.value = true
      const id = route.params.id as string
      if (!id) return

      // 并行请求详情和列表
      const [charRes, listRes] = await Promise.all([
        getCharacter(id),
        getCharacters({ limit: 1000 }),
      ])

      character.value = charRes.data
      characters.value = listRes.data.data
    } catch (error) {
      console.error('获取汉字详情失败:', error)
      toast.error('获取汉字详情失败')
    } finally {
      loading.value = false
    }
  }

  // 监听路由参数变化
  watch(
    () => route.params.id,
    () => {
      fetchData()
    }
  )

  onMounted(() => {
    fetchData()
  })
</script>

<template>
  <Loading v-if="loading" text="加载中..." />

  <div v-else-if="character" class="min-h-screen bg-gray-50 pb-12">
    <!-- 页面头部 -->
    <div class="bg-gradient-to-r from-primary-50 to-primary-100 py-6 mb-6">
      <div class="max-w-6xl mx-auto px-4">
        <BackLink to="/learn/characters" text="返回字表" />
      </div>
    </div>

    <div class="max-w-6xl mx-auto px-4">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- 左侧：汉字展示 -->
        <Card hoverable class="border-2 border-primary-200">
          <!-- 汉字大字展示 -->
          <div
            class="flex items-center justify-center h-48 bg-gradient-to-br from-primary-50 to-primary-100 rounded-xl mb-6"
          >
            <span class="text-9xl font-bold text-gray-900">{{ character.title }}</span>
          </div>

          <!-- 笔顺动画 -->
          <div class="mb-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <span class="w-2 h-2 bg-primary-400 rounded-full"></span>
              笔顺动画
            </h3>
            <div v-if="writerLoading" class="text-center py-8 bg-gray-50 rounded-xl">
              <div class="text-gray-500"> 笔顺动画加载中... </div>
            </div>
            <div v-else-if="writerError" class="text-center py-8 bg-gray-50 rounded-xl">
              <div class="text-red-500"> 笔顺动画加载失败 </div>
            </div>
            <div v-else ref="writerContainer" class="bg-gray-50 rounded-xl p-4"></div>
          </div>

          <!-- 动画控制 -->
          <div v-if="!writerLoading && !writerError" class="flex justify-center mb-6">
            <button
              class="px-6 py-2.5 bg-primary-400 text-gray-900 font-medium rounded-xl hover:bg-primary-500 transition-colors shadow-sm hover:shadow"
              @click="animateCharacter()"
            >
              重新播放笔顺
            </button>
          </div>

          <!-- 导航 -->
          <div class="flex justify-between pt-4 border-t border-gray-100">
            <button
              v-if="prevCharacter"
              class="px-4 py-2.5 bg-white text-gray-700 rounded-xl border border-gray-200 hover:border-primary-300 hover:bg-primary-50 transition-all flex items-center gap-2"
              @click="router.push(`/learn/characters/${prevCharacter.id}`)"
            >
              <span class="text-gray-400">←</span>
              <span class="font-medium">{{ prevCharacter.title }}</span>
            </button>
            <div v-else></div>
            <button
              v-if="nextCharacter"
              class="px-4 py-2.5 bg-primary-400 text-gray-900 font-medium rounded-xl hover:bg-primary-500 transition-all flex items-center gap-2 shadow-sm hover:shadow"
              @click="router.push(`/learn/characters/${nextCharacter.id}`)"
            >
              <span class="font-medium">{{ nextCharacter.title }}</span>
              <span class="text-gray-700">→</span>
            </button>
          </div>
        </Card>

        <!-- 右侧：信息 -->
        <div class="space-y-6">
          <!-- 基本信息 -->
          <Card>
            <h2 class="text-xl font-bold text-gray-900 mb-5 flex items-center gap-2">
              <span class="w-1.5 h-6 bg-primary-400 rounded-full"></span>
              基本信息
            </h2>
            <div class="space-y-4">
              <!-- 拼音 -->
              <div class="flex items-start gap-4">
                <span class="text-gray-400 w-12 shrink-0">拼音</span>
                <span class="text-2xl font-semibold text-gray-900">
                  {{ character.pinyin || '-' }}
                </span>
              </div>
              <!-- 释义 -->
              <div class="flex items-start gap-4">
                <span class="text-gray-400 w-12 shrink-0">释义</span>
                <span class="text-gray-800 leading-relaxed">
                  {{ character.content || '-' }}
                </span>
              </div>
              <!-- 属性标签 -->
              <div class="flex flex-wrap gap-3 pt-2">
                <span
                  v-if="character.strokes"
                  class="px-4 py-2 bg-primary-100 text-primary-700 font-medium rounded-lg"
                >
                  {{ character.strokes }} 画
                </span>
                <span
                  v-if="character.structure"
                  class="px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg"
                >
                  {{ character.structure }}
                </span>
                <span
                  v-if="character.radicals"
                  class="px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg"
                >
                  部首：{{ character.radicals }}
                </span>
              </div>
            </div>
          </Card>

          <!-- 组词 -->
          <Card v-if="character.words?.length">
            <h2 class="text-xl font-bold text-gray-900 mb-5 flex items-center gap-2">
              <span class="w-1.5 h-6 bg-primary-400 rounded-full"></span>
              组词
            </h2>
            <div class="flex flex-wrap gap-3">
              <span
                v-for="word in character.words"
                :key="word"
                class="px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-primary-100 hover:text-primary-700 transition-colors cursor-pointer"
              >
                {{ word }}
              </span>
            </div>
          </Card>
        </div>
      </div>
    </div>
  </div>

  <Empty v-else description="未找到该汉字">
    <RouterLink to="/learn/characters" class="text-primary-500 hover:underline">
      返回字表
    </RouterLink>
  </Empty>
</template>
