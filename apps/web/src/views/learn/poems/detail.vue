<script setup lang="ts">
  import { useRoute, useRouter } from 'vue-router'
  import { computed } from 'vue'
  import { poems } from '@hanzi-learning/data'

  const route = useRoute()
  const router = useRouter()

  const poem = computed(() => {
    const id = route.params.id as string
    return poems.find((p) => p.id === id)
  })

  const dynastyLabels: Record<string, string> = {
    tang: '唐',
    song: '宋',
    yuan: '元',
    ming: '明',
    qing: '清',
  }
</script>

<template>
  <div v-if="poem">
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold text-gray-900">
        {{ poem.title }}
      </h1>
      <RouterLink to="/learn/poems" class="text-gray-500 hover:text-gray-700">
        ← 返回列表
      </RouterLink>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- 左侧：原文 -->
      <div class="lg:col-span-2 space-y-6">
        <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div class="flex items-center gap-4 mb-4">
            <span class="px-2 py-1 bg-secondary-100 text-secondary-700 text-sm rounded">
              {{ dynastyLabels[poem.dynasty] }}诗
            </span>
            <span class="text-gray-600">{{ poem.author }}</span>
          </div>

          <!-- 原文 -->
          <div class="space-y-6 mb-6">
            <div
              v-for="(verse, verseIdx) in poem.verses"
              :key="verseIdx"
              class="flex justify-center gap-3 flex-wrap"
            >
              <span
                v-for="(char, charIdx) in verse"
                :key="charIdx"
                class="flex flex-col items-center"
              >
                <span class="text-sm text-gray-400">{{
                  poem.versePinyins?.[verseIdx]?.[charIdx] || ''
                }}</span>
                <span class="text-xl text-gray-900">{{ char }}</span>
              </span>
            </div>
          </div>

          <!-- 翻译 -->
          <div class="border-t pt-4">
            <h3 class="font-semibold text-gray-900 mb-2"> 译文 </h3>
            <p class="text-gray-600 leading-relaxed">
              {{ poem.translation }}
            </p>
          </div>
        </div>

        <!-- 赏析 -->
        <div
          v-if="poem.appreciation"
          class="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
        >
          <h3 class="font-semibold text-gray-900 mb-3"> 赏析 </h3>
          <p class="text-gray-600 leading-relaxed">
            {{ poem.appreciation }}
          </p>
        </div>

        <!-- 创作背景 -->
        <div
          v-if="poem.background"
          class="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
        >
          <h3 class="font-semibold text-gray-900 mb-3"> 创作背景 </h3>
          <p class="text-gray-600 leading-relaxed">
            {{ poem.background }}
          </p>
        </div>
      </div>

      <!-- 右侧：注释 -->
      <div class="space-y-6">
        <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 class="font-semibold text-gray-900 mb-4"> 注释 </h3>
          <div v-if="poem.annotation" class="space-y-3">
            <div v-for="(value, key) in poem.annotation" :key="key" class="flex gap-2">
              <span class="text-primary-600 font-medium">{{ key }}</span>
              <span class="text-gray-600">{{ value }}</span>
            </div>
          </div>
          <p v-else class="text-gray-400 text-sm"> 暂无注释 </p>
        </div>

        <!-- 背诵模式按钮 -->
        <button
          class="w-full btn btn-secondary"
          @click="router.push(`/practice?type=poem&id=${poem.id}`)"
        >
          开始背诵
        </button>
      </div>
    </div>
  </div>

  <div v-else class="text-center py-12">
    <p class="text-gray-500"> 未找到该古诗 </p>
    <RouterLink to="/learn/poems" class="text-secondary-500 hover:underline"> 返回列表 </RouterLink>
  </div>
</template>
