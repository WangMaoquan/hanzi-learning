<script setup lang="ts">
  import { ref, onMounted, watch } from 'vue'
  import { useRoute } from 'vue-router'
  import { getIdioms, getIdiom, type Idiom } from '@/services/api'
  import { useToast } from '@/composables'

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

      idiom.value = await getIdiom(id)
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
  <div v-if="loading" class="flex items-center justify-center py-20">
    <div class="text-gray-500"> 加载中... </div>
  </div>

  <div v-else-if="idiom">
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold text-gray-900"> 成语详情 </h1>
      <RouterLink to="/learn/idioms" class="text-gray-500 hover:text-gray-700">
        ← 返回列表
      </RouterLink>
    </div>

    <div class="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
      <!-- 成语标题 -->
      <div class="text-center mb-8">
        <h2 class="text-5xl font-bold text-gray-900 mb-2">
          {{ idiom.title }}
        </h2>
        <p class="text-xl text-gray-500">
          {{ idiom.pinyin }}
        </p>
      </div>

      <!-- 释义 -->
      <div class="mb-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-2"> 释义 </h3>
        <p class="text-gray-700 leading-relaxed">
          {{ idiom.content || '暂无释义' }}
        </p>
      </div>

      <!-- 出处 -->
      <div v-if="idiom.derivation" class="mb-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-2"> 出处 </h3>
        <p class="text-gray-600 italic">
          {{ idiom.derivation }}
        </p>
      </div>

      <!-- 例句 -->
      <div v-if="idiom.example" class="mb-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-2"> 例句 </h3>
        <p class="text-gray-700 italic bg-gray-50 p-4 rounded-lg">
          {{ idiom.example }}
        </p>
      </div>

      <!-- 近义词 -->
      <div v-if="idiom.synonyms?.length" class="mb-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-2"> 近义词 </h3>
        <div class="flex flex-wrap gap-2">
          <span
            v-for="word in idiom.synonyms"
            :key="word"
            class="px-3 py-1 bg-blue-100 text-blue-700 rounded-full"
          >
            {{ word }}
          </span>
        </div>
      </div>

      <!-- 反义词 -->
      <div v-if="idiom.antonyms?.length">
        <h3 class="text-lg font-semibold text-gray-900 mb-2"> 反义词 </h3>
        <div class="flex flex-wrap gap-2">
          <span
            v-for="word in idiom.antonyms"
            :key="word"
            class="px-3 py-1 bg-red-100 text-red-700 rounded-full"
          >
            {{ word }}
          </span>
        </div>
      </div>
    </div>
  </div>

  <div v-else class="text-center py-12">
    <p class="text-gray-500"> 未找到该成语 </p>
    <RouterLink to="/learn/idioms" class="text-primary-500 hover:underline"> 返回列表 </RouterLink>
  </div>
</template>
