<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getPoem, type Poem } from '@/services/api'

const route = useRoute()
const router = useRouter()

const loading = ref(true)
const poem = ref<Poem | null>(null)

async function fetchPoem() {
  try {
    loading.value = true
    const id = route.params.id as string
    poem.value = await getPoem(id)
  } catch (error) {
    console.error('获取古诗详情失败:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchPoem()
})
</script>

<template>
  <div v-if="loading" class="flex items-center justify-center py-20">
    <div class="text-gray-500">加载中...</div>
  </div>

  <div v-else-if="poem">
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
              {{ poem.dynasty }}
            </span>
            <span class="text-gray-600">{{ poem.author }}</span>
          </div>

          <!-- 原文 -->
          <div class="space-y-4 mb-6">
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

          <!-- 标签 -->
          <div v-if="poem.tags?.length" class="flex flex-wrap gap-2">
            <span
              v-for="tag in poem.tags"
              :key="tag"
              class="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded"
            >
              {{ tag }}
            </span>
          </div>
        </div>
      </div>

      <!-- 右侧：信息 -->
      <div class="space-y-6">
        <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 class="font-semibold text-gray-900 mb-4"> 信息 </h3>
          <div class="space-y-3">
            <div v-if="poem.type">
              <span class="text-gray-500 text-sm">类型</span>
              <p class="text-gray-900">{{ poem.type }}</p>
            </div>
            <div v-if="poem.difficulty">
              <span class="text-gray-500 text-sm">难度</span>
              <p class="text-gray-900">{{ poem.difficulty }} / 5</p>
            </div>
          </div>
        </div>

        <!-- 背诵模式按钮 -->
        <button
          class="w-full px-4 py-2 bg-secondary-400 text-white rounded-lg hover:bg-secondary-500 transition-colors"
          @click="router.push(`/practice?type=poem&id=${poem.id}`)"
        >
          开始背诵
        </button>
      </div>
    </div>
  </div>

  <div v-else class="text-center py-12">
    <p class="text-gray-500">未找到该古诗</p>
    <RouterLink to="/learn/poems" class="text-secondary-500 hover:underline">返回列表</RouterLink>
  </div>
</template>
