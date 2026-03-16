<script setup lang="ts">
  import { ref, computed, onMounted, watch } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { getCharacters, getCharacter, type Character } from '@/services/api'
  import { useToast } from '@/composables'
  import { useHanziWriter } from '@hanzi-learning/hanzi-vue'
  import { Card, Loading, Empty } from '@hanzi-learning/ui'

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

  <div v-else-if="character">
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold text-gray-900"> 汉字详情 </h1>
      <RouterLink to="/learn/characters" class="text-gray-500 hover:text-gray-700">
        ← 返回字表
      </RouterLink>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- 左侧：汉字展示 -->
      <Card>
        <div class="flex items-center justify-center h-64 bg-primary-50 rounded-xl mb-6">
          <span class="text-9xl font-bold text-gray-900">{{ character.title }}</span>
        </div>

        <!-- 笔顺动画 -->
        <div v-if="writerLoading" class="text-center text-gray-500 text-sm mb-4">
          笔顺动画加载中...
        </div>
        <div v-else-if="writerError" class="text-center text-gray-500 text-sm mb-4">
          笔顺动画加载失败
        </div>
        <div v-else ref="writerContainer" class="mb-4"></div>

        <!-- 动画控制 -->
        <div v-if="!writerLoading && !writerError" class="flex justify-center gap-2 mb-4">
          <button
            class="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            @click="animateCharacter()"
          >
            重新播放
          </button>
        </div>

        <!-- 导航 -->
        <div class="flex justify-between">
          <button
            v-if="prevCharacter"
            class="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            @click="router.push(`/learn/characters/${prevCharacter.id}`)"
          >
            ← {{ prevCharacter.title }}
          </button>
          <div v-else></div>
          <button
            v-if="nextCharacter"
            class="px-4 py-2 bg-primary-400 text-gray-900 rounded-lg hover:bg-primary-500 transition-colors"
            @click="router.push(`/learn/characters/${nextCharacter.id}`)"
          >
            {{ nextCharacter.title }} →
          </button>
        </div>
      </Card>

      <!-- 右侧：信息 -->
      <div class="space-y-6">
        <!-- 基本信息 -->
        <Card>
          <h2 class="text-lg font-semibold text-gray-900 mb-4"> 基本信息 </h2>
          <div class="space-y-3">
            <div class="flex items-center gap-4">
              <span class="text-gray-500 w-12">拼音</span>
              <span class="text-xl text-gray-900">{{ character.pinyin || '-' }}</span>
            </div>
            <div class="flex items-center gap-4">
              <span class="text-gray-500 w-12">释义</span>
              <span class="text-gray-900">{{ character.content || '-' }}</span>
            </div>
            <div class="flex items-center gap-4">
              <span class="text-gray-500 w-12">笔画</span>
              <span class="text-gray-900">{{
                character.strokes ? `${character.strokes} 画` : '-'
              }}</span>
            </div>
            <div class="flex items-center gap-4">
              <span class="text-gray-500 w-12">结构</span>
              <span class="text-gray-900">{{ character.structure || '-' }}</span>
            </div>
            <div class="flex items-center gap-4">
              <span class="text-gray-500 w-12">部首</span>
              <span class="text-gray-900">{{ character.radicals || '-' }}</span>
            </div>
          </div>
        </Card>

        <!-- 组词 -->
        <Card v-if="character.words?.length">
          <h2 class="text-lg font-semibold text-gray-900 mb-4"> 组词 </h2>
          <div class="flex flex-wrap gap-2">
            <span
              v-for="word in character.words"
              :key="word"
              class="px-3 py-1 bg-gray-100 rounded-full text-gray-700"
            >
              {{ word }}
            </span>
          </div>
        </Card>
      </div>
    </div>
  </div>

  <Empty v-else description="未找到该汉字">
    <RouterLink to="/learn/characters" class="text-primary-500 hover:underline">
      返回字表
    </RouterLink>
  </Empty>
</template>
