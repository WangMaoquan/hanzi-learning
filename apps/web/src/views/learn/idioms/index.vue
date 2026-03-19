<script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import { getIdioms, getIdiomCount, type Idiom } from '@/services/api'
  import { Card, Skeleton } from '@hanzi-learning/ui'
  import PageHeader from '@/components/PageHeader.vue'
  import PageContent from '@/components/PageContent.vue'

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
    } catch {
      // API 拦截器已处理错误提示
    } finally {
      loading.value = false
    }
  }

  function handlePageChange(page: number) {
    currentPage.value = page
    fetchIdioms()
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
    <!-- 页面头部 -->
    <PageHeader
      title="成语故事"
      description="学习成语典故，了解传统文化"
    />

    <PageContent
      v-model:page="currentPage"
      v-model:limit="pageSize"
      :loading="loading"
      :total="total"
      :page-size="pageSize"
      color="primary"
      show-size-changer
      :page-sizes="[20, 40, 60, 80]"
      empty-description="暂无成语数据"
      skeleton
      @update:page="handlePageChange"
      @update:limit="handleSizeChange"
    >
      <!-- 骨架屏 -->
      <template #skeleton>
        <!-- 特色卡片骨架 -->
        <div class="mb-8 border-2 border-[var(--color-secondary-200)] rounded-xl p-6">
          <div class="flex items-start gap-8">
            <Skeleton
              :lines="1"
              width="8rem"
              height="4rem"
            />
            <div class="flex-1 space-y-3">
              <Skeleton
                :lines="1"
                width="6rem"
                height="2rem"
              />
              <Skeleton
                :lines="1"
                width="4rem"
                height="1.25rem"
              />
              <Skeleton :lines="3" />
            </div>
          </div>
        </div>
        <!-- 列表骨架 -->
        <div class="mt-8">
          <Skeleton
            :lines="1"
            width="4rem"
            height="1.5rem"
            class="mb-4"
          />
          <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            <Skeleton
              v-for="i in 40"
              :key="i"
              :lines="1"
              width="100%"
              height="3rem"
            />
          </div>
        </div>
      </template>
      <!-- 当前学习 - 特色卡片 -->
      <Card
        v-if="currentIdiom"
        hoverable
        class="mb-8 border-2 border-[var(--color-secondary-200)]"
      >
        <div class="flex items-start gap-8">
          <!-- 成语展示 -->
          <div
            class="flex items-center justify-center rounded-xl px-6 py-4 shadow-inner shrink-0 bg-[var(--color-primary-50)]"
          >
            <span class="text-4xl font-bold tracking-widest text-[var(--color-secondary-900)]">{{
              currentIdiom.title
            }}</span>
          </div>

          <!-- 信息区域 -->
          <div class="flex-1">
            <div class="flex items-center gap-3 mb-4">
              <span
                class="px-3 py-1 text-sm font-semibold rounded-full bg-[var(--color-primary-500)] text-white"
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
            <div
              v-if="currentIdiom.derivation"
              class="mb-4"
            >
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
      <Empty
        v-else
        description="暂无成语数据"
        class="mb-6"
      />

      <!-- 成语列表 -->
      <div class="mt-8">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl font-bold text-[var(--color-secondary-900)] font-serif">
            成语列表
          </h2>
          <span class="text-[var(--color-secondary-500)] text-sm">共 {{ total }} 个成语</span>
        </div>

        <div class="flex flex-wrap justify-center gap-3">
          <RouterLink
            v-for="idiom in idioms"
            :key="idiom.id"
            :to="`/learn/idioms/${idiom.id}`"
            class="group"
          >
            <div
              class="flex items-center justify-center bg-[var(--color-surface)] rounded-xl border-2 border-[var(--color-secondary-200)] hover:border-[var(--color-primary-300)] hover:bg-[var(--color-primary-50)] hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 py-3 px-4"
            >
              <span class="font-bold transition-colors text-lg text-[var(--color-secondary-700)]">
                {{ idiom.title }}
              </span>
            </div>
          </RouterLink>
        </div>
      </div>
    </PageContent>
  </div>
</template>
