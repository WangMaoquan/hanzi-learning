<script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import { getIdioms, getIdiomCount, type Idiom } from '@/services/api'
  import { Card, Loading, Empty, Pagination } from '@hanzi-learning/ui'

  const loading = ref(true)
  const idioms = ref<Idiom[]>([])
  const currentIdiom = ref<Idiom | null>(null)
  const currentPage = ref(1)
  const pageSize = ref(40)
  const total = ref(0)

  // 获取成语列表
  async function fetchIdioms() {
    try {
      loading.value = true
      const [countRes, listRes] = await Promise.all([
        getIdiomCount(),
        getIdioms({ page: currentPage.value, limit: pageSize.value }),
      ])
      total.value = countRes.data
      idioms.value = listRes.data.data
      // 设置当前页第一个为当前学习
      if (idioms.value.length > 0) {
        currentIdiom.value = idioms.value[0]
      }
    } catch (error) {
      console.error('获取成语列表失败:', error)
    } finally {
      loading.value = false
    }
  }

  function handlePageChange(page: number) {
    currentPage.value = page
    fetchIdioms()
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function handleSizeChange(newSize: number) {
    pageSize.value = newSize
    currentPage.value = 1
    fetchIdioms()
  }

  onMounted(() => {
    fetchIdioms()
  })
</script>

<template>
  <div class="min-h-screen bg-[var(--color-secondary-50)]">
    <!-- 页面头部 - 现代简约中国风 -->
    <div
      class="py-8 mb-6 border-b border-[var(--color-secondary-200)] bg-[var(--color-accent-50)] shadow-inner"
    >
      <div class="max-w-6xl mx-auto px-4">
        <h1 class="text-3xl font-bold mb-2 text-[var(--color-secondary-900)] font-serif">
          成语故事
        </h1>
        <p class="text-[var(--color-secondary-600)] mt-1"> 学习成语典故，了解传统文化 </p>
      </div>
    </div>

    <div class="max-w-6xl mx-auto px-4 pb-8">
      <!-- 加载状态 -->
      <Loading v-if="loading" text="加载中..." />

      <template v-else>
        <!-- 当前学习 - 特色卡片 -->
        <Card v-if="currentIdiom" hoverable class="mb-8 border-2 border-[var(--color-accent-500)]">
          <div class="flex items-start gap-8">
            <!-- 成语展示 -->
            <div
              class="flex items-center justify-center rounded-xl px-6 py-4 shadow-inner shrink-0 bg-[var(--color-accent-50)]"
            >
              <span class="text-4xl font-bold tracking-widest text-[var(--color-secondary-900)]">{{
                currentIdiom.title
              }}</span>
            </div>

            <!-- 信息区域 -->
            <div class="flex-1">
              <div class="flex items-center gap-3 mb-4">
                <span
                  class="px-3 py-1 text-sm font-semibold rounded-full bg-[var(--color-accent-500)] text-white"
                >
                  正在学习
                </span>
                <span class="text-[var(--color-secondary-400)] text-sm">点击下方成语继续学习</span>
              </div>

              <!-- 拼音 -->
              <div class="mb-4">
                <span class="text-[var(--color-secondary-500)] text-sm">拼音</span>
                <p class="text-xl font-semibold text-[var(--color-secondary-900)]">
                  {{ currentIdiom.pinyin || '-' }}
                </p>
              </div>

              <!-- 释义 -->
              <div class="mb-4">
                <span class="text-[var(--color-secondary-500)] text-sm">释义</span>
                <p class="text-[var(--color-secondary-700)] leading-relaxed">
                  {{ currentIdiom.content || '-' }}
                </p>
              </div>

              <!-- 出处 -->
              <div v-if="currentIdiom.derivation" class="mb-4">
                <span class="text-[var(--color-secondary-500)] text-sm">出处</span>
                <p class="text-[var(--color-secondary-600)] text-sm italic leading-relaxed">
                  {{ currentIdiom.derivation }}
                </p>
              </div>

              <!-- 例句 -->
              <div v-if="currentIdiom.example">
                <span class="text-[var(--color-secondary-500)] text-sm">例句</span>
                <p class="text-[var(--color-secondary-700)] italic">
                  {{ currentIdiom.example }}
                </p>
              </div>
            </div>
          </div>
        </Card>

        <!-- 空状态 -->
        <Empty v-else description="暂无成语数据" class="mb-6" />

        <!-- 成语列表 -->
        <div>
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-xl font-bold text-[var(--color-secondary-900)] font-serif">
              成语列表
            </h2>
            <span class="text-[var(--color-secondary-500)] text-sm">共 {{ total }} 个成语</span>
          </div>

          <div class="flex flex-wrap justify-center gap-3 mb-8">
            <RouterLink
              v-for="idiom in idioms"
              :key="idiom.id"
              :to="`/learn/idioms/${idiom.id}`"
              class="group"
            >
              <div
                class="flex items-center justify-center bg-[var(--color-surface)] rounded-xl border-2 border-[var(--color-accent-200)] hover:border-[var(--color-accent-500)] hover:bg-[var(--color-accent-50)] hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 py-3 px-4"
              >
                <span class="font-bold transition-colors text-lg text-[var(--color-secondary-700)]">
                  {{ idiom.title }}
                </span>
              </div>
            </RouterLink>
          </div>

          <!-- 分页 -->
          <div class="flex justify-center">
            <Pagination
              v-model="currentPage"
              :total="total"
              :limit="pageSize"
              color="orange"
              show-size-changer
              :page-sizes="[20, 40, 60, 80]"
              @update:model-value="handlePageChange"
              @update:limit="handleSizeChange"
            />
          </div>
        </div>
      </template>
    </div>
  </div>
</template>
