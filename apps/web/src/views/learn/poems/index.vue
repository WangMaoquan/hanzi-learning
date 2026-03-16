<script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import { getPoems, type Poem } from '@/services/api'
  import { DYNASTY_LABELS } from '@hanzi-learning/utils'
  import { Loading, Empty } from '@hanzi-learning/ui'

  const loading = ref(true)
  const poems = ref<Poem[]>([])

  async function fetchPoems() {
    try {
      loading.value = true
      const response = await getPoems({ limit: 50 })
      poems.value = response.data.data
    } catch (error) {
      console.error('获取古诗列表失败:', error)
    } finally {
      loading.value = false
    }
  }

  onMounted(() => {
    fetchPoems()
  })
</script>

<template>
  <div>
    <h1 class="text-2xl font-bold text-gray-900 mb-6"> 古诗词学习 </h1>

    <!-- 加载状态 -->
    <Loading v-if="loading" text="加载中..." />

    <!-- 空状态 -->
    <Empty v-else-if="!poems.length" description="暂无古诗数据" />

    <!-- 古诗列表 -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <RouterLink
        v-for="poem in poems"
        :key="poem.id"
        :to="`/learn/poems/${poem.id}`"
        class="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md hover:border-secondary-200 transition-all"
      >
        <div class="flex items-start justify-between mb-3">
          <h3 class="text-lg font-semibold text-gray-900">
            {{ poem.title }}
          </h3>
          <span class="px-2 py-0.5 bg-secondary-100 text-secondary-700 text-xs rounded">
            {{ DYNASTY_LABELS[poem.dynasty] || poem.dynasty }}诗
          </span>
        </div>
        <p class="text-sm text-gray-500 mb-2">
          {{ poem.author }}
        </p>
        <p class="text-gray-600 line-clamp-2 text-sm">
          {{ poem.content }}
        </p>
      </RouterLink>
    </div>
  </div>
</template>
