<script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import { getPoems, getPoemCount, type Poem } from '@/services/api'
  import { DYNASTY_LABELS } from '@hanzi-learning/utils'
  import { Card } from '@hanzi-learning/ui'
  import PageHeader from '@/components/PageHeader.vue'
  import PageContent from '@/components/PageContent.vue'

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
    } catch {
      // API 拦截器已处理错误提示
    } finally {
      loading.value = false
    }
  }

  function handlePageChange(page: number) {
    currentPage.value = page
    fetchPoems()
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
    <!-- 页面头部 -->
    <PageHeader
      title="古诗词"
      description="品味经典唐诗宋词，感受诗词之美"
    />

    <PageContent
      v-model:page="currentPage"
      v-model:limit="pageSize"
      :loading="loading"
      :total="total"
      :page-size="pageSize"
      color="secondary"
      show-size-changer
      :page-sizes="[12, 24, 36, 48]"
      empty-description="暂无古诗数据"
      @update:page="handlePageChange"
      @update:limit="handleSizeChange"
    >
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-xl font-bold text-[var(--color-secondary-900)] font-serif">
          诗词列表
        </h2>
        <span class="text-[var(--color-secondary-500)] text-sm">共 {{ total }} 首古诗</span>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <RouterLink
          v-for="poem in poems"
          :key="poem.id"
          :to="`/learn/poems/${poem.id}`"
          class="group"
        >
          <Card
            hoverable
            class="h-full border-2 border-[var(--color-secondary-200)] hover:shadow-lg transition-all duration-200"
          >
            <!-- 头部 -->
            <div class="flex items-start justify-between mb-4">
              <h3
                class="text-lg font-bold group-hover:text-[var(--color-secondary-700)] transition-colors text-[var(--color-secondary-900)]"
              >
                {{ poem.title }}
              </h3>
              <span
                class="px-3 py-1 text-xs font-medium rounded-full bg-[var(--color-secondary-100)] text-[var(--color-secondary-600)]"
              >
                {{ DYNASTY_LABELS[poem.dynasty] || poem.dynasty }}
              </span>
            </div>

            <!-- 作者 -->
            <p class="text-[var(--color-secondary-500)] text-sm mb-3 flex items-center gap-2">
              <span
                class="w-5 h-5 flex items-center justify-center rounded-full text-xs bg-[var(--color-secondary-100)] text-[var(--color-secondary-500)]"
              >
                ✍️
              </span>
              {{ poem.author }}
            </p>

            <!-- 诗句预览 -->
            <p class="text-[var(--color-secondary-600)] text-sm leading-relaxed line-clamp-3 mb-4">
              {{ poem.content }}
            </p>

            <!-- 底部 -->
            <div class="flex items-center justify-end text-sm">
              <span
                class="font-medium group-hover:translate-x-1 transition-transform text-[var(--color-primary-700)]"
              >
                查看全文 →
              </span>
            </div>
          </Card>
        </RouterLink>
      </div>
    </PageContent>
  </div>
</template>
