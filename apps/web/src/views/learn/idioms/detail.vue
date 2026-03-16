<script setup lang="ts">
  import { ref, onMounted, watch } from 'vue'
  import { useRoute } from 'vue-router'
  import { getIdioms, getIdiom, type Idiom } from '@/services/api'
  import { useToast } from '@/composables'
  import { Card, Loading, Empty, BackLink } from '@hanzi-learning/ui'

  const route = useRoute()
  const toast = useToast()

  const loading = ref(true)
  const idiom = ref<Idiom | null>(null)

  // 获取成语详情
  async function fetchIdiom() {
    try {
      loading.value = true
      const id = route.params.id as string
      if (!id) return

      idiom.value = (await getIdiom(id)).data
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
    <!-- 页面头部 -->
    <div class="bg-gradient-to-r from-orange-50 to-orange-100 py-6 mb-6">
      <div class="max-w-4xl mx-auto px-4">
        <BackLink to="/learn/idioms" text="返回列表" />
      </div>
    </div>

    <div class="max-w-4xl mx-auto px-4">
      <Card hoverable class="border-2 border-orange-200">
        <!-- 成语标题区域 -->
        <div class="text-center mb-8 pb-8 border-b border-orange-100">
          <div
            class="inline-flex items-center justify-center w-32 h-32 bg-gradient-to-br from-orange-100 to-orange-200 rounded-2xl mb-4 shadow-inner"
          >
            <span class="text-6xl font-bold text-gray-900">{{ idiom.title }}</span>
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
    </div>
  </div>

  <Empty v-else description="未找到该成语">
    <RouterLink to="/learn/idioms" class="text-orange-500 hover:underline"> 返回列表 </RouterLink>
  </Empty>
</template>
