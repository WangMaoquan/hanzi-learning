<script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import { getPoems, getPoemCount, type Poem } from '@/services/api'
  import { DYNASTY_LABELS } from '@hanzi-learning/utils'
  import { Card, Loading, Empty, Pagination } from '@hanzi-learning/ui'

  const loading = ref(true)
  const poems = ref<Poem[]>([])
  const currentPage = ref(1)
  const pageSize = ref(12)
  const total = ref(0)

  async function fetchPoems() {
    try {
      loading.value = true
      const [countRes, listRes] = await Promise.all([
        getPoemCount(),
        getPoems({ page: currentPage.value, limit: pageSize.value }),
      ])
      total.value = countRes.data
      poems.value = listRes.data.data
    } catch (error) {
      console.error('获取古诗列表失败:', error)
    } finally {
      loading.value = false
    }
  }

  function handlePageChange(page: number) {
    currentPage.value = page
    fetchPoems()
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function handleSizeChange(newSize: number) {
    pageSize.value = newSize
    currentPage.value = 1
    fetchPoems()
  }

  onMounted(() => {
    fetchPoems()
  })
</script>

<template>
  <div class="min-h-screen bg-[var(--color-secondary-50)]">
    <!-- 页面头部 - 现代简约中国风 -->
    <div
      class="py-8 mb-6 border-b bg-[var(--color-secondary-100)] border-[var(--color-secondary-200)]"
    >
      <div class="max-w-6xl mx-auto px-4">
        <h1 class="text-3xl font-bold mb-2 text-secondary-950 font-serif"> 古诗词 </h1>
        <p class="text-secondary-600 mt-1"> 品味经典唐诗宋词，感受诗词之美 </p>
      </div>
    </div>

    <div class="max-w-6xl mx-auto px-4 pb-8">
      <!-- 加载状态 -->
      <Loading v-if="loading" text="加载中..." />

      <!-- 空状态 -->
      <Empty v-else-if="!poems.length" description="暂无古诗数据" />

      <!-- 古诗列表 -->
      <div v-else>
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-xl font-bold text-secondary-950 font-serif"> 诗词列表 </h2>
          <span class="text-secondary-500 text-sm">共 {{ total }} 首古诗</span>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <RouterLink
            v-for="poem in poems"
            :key="poem.id"
            :to="`/learn/poems/${poem.id}`"
            class="group"
          >
            <Card
              hoverable
              class="h-full border-2 border-transparent hover:border-secondary-200 transition-all duration-200"
            >
              <!-- 头部 -->
              <div class="flex items-start justify-between mb-4">
                <h3
                  class="text-lg font-bold group-hover:text-secondary-700 transition-colors text-secondary-950"
                >
                  {{ poem.title }}
                </h3>
                <span
                  class="px-3 py-1 text-xs font-medium rounded-full bg-secondary-100 text-secondary-600"
                >
                  {{ DYNASTY_LABELS[poem.dynasty] || poem.dynasty }}
                </span>
              </div>

              <!-- 作者 -->
              <p class="text-secondary-500 text-sm mb-3 flex items-center gap-2">
                <span
                  class="w-5 h-5 flex items-center justify-center rounded-full text-xs bg-secondary-100 text-secondary-500"
                >
                  ✍️
                </span>
                {{ poem.author }}
              </p>

              <!-- 诗句预览 -->
              <p class="text-secondary-600 text-sm leading-relaxed line-clamp-3 mb-4">
                {{ poem.content }}
              </p>

              <!-- 底部 -->
              <div class="flex items-center justify-end text-sm">
                <span
                  class="font-medium group-hover:translate-x-1 transition-transform text-primary-700"
                >
                  查看全文 →
                </span>
              </div>
            </Card>
          </RouterLink>
        </div>

        <!-- 分页 -->
        <div class="flex justify-center">
          <Pagination
            v-model="currentPage"
            :total="total"
            :limit="pageSize"
            color="secondary"
            show-size-changer
            :page-sizes="[12, 24, 36, 48]"
            @update:model-value="handlePageChange"
            @update:limit="handleSizeChange"
          />
        </div>
      </div>
    </div>
  </div>
</template>
