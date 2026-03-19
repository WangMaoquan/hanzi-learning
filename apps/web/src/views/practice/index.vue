<script setup lang="ts">
  import { onMounted } from 'vue'
  import { useContentCounts, useToast } from '@/composables'
  import { Skeleton } from '@hanzi-learning/ui'
  import AppHeader from '@/components/AppHeader.vue'

  const { characterCount, poemCount, loading, error, fetchCounts } = useContentCounts()
  const toast = useToast()

  const navItems = [{ name: '练习首页', path: '/practice', icon: '✍️' }]

  const exercises = [
    {
      title: '汉字书写',
      description: '练习汉字笔顺和书写',
      icon: '✍️',
      path: '/practice/write',
      available: false,
    },
    {
      title: '拼音连线',
      description: '汉字与拼音配对练习',
      icon: '🔗',
      path: '/practice/pinyin',
      available: false,
    },
    {
      title: '古诗填空',
      description: '根据提示填写诗句',
      icon: '📝',
      path: '/practice/poem-fill',
      available: false,
    },
    {
      title: '诗词背诵',
      description: '回忆并背诵古诗',
      icon: '🎯',
      path: '/practice/recite',
      available: false,
    },
  ]

  onMounted(async () => {
    await fetchCounts()
    if (error.value) {
      toast.error(error.value)
    }
  })
</script>

<template>
  <div class="min-h-screen bg-[var(--color-background)] transition-colors duration-300">
    <AppHeader :nav-items="navItems" />

    <main class="max-w-4xl mx-auto px-4 py-8">
      <h1 class="text-2xl font-bold mb-6 text-[var(--color-secondary-900)] font-serif">
        练习中心
      </h1>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <RouterLink
          v-for="exercise in exercises"
          :key="exercise.path"
          :to="exercise.available ? exercise.path : '#'"
          class="bg-[var(--color-surface)] rounded-xl p-6 transition-all border-2 border-[var(--color-secondary-200)] hover:shadow-md"
          :class="{ 'opacity-50 cursor-not-allowed': !exercise.available }"
        >
          <div class="flex items-center gap-4">
            <div
              class="w-16 h-16 flex items-center justify-center rounded-xl text-3xl bg-[var(--color-primary-50)]"
            >
              {{ exercise.icon }}
            </div>
            <div>
              <h3 class="text-lg font-semibold text-[var(--color-secondary-900)]">
                {{ exercise.title }}
              </h3>
              <p class="text-[var(--color-secondary-500)] text-sm">
                {{ exercise.description }}
              </p>
            </div>
          </div>
        </RouterLink>
      </div>

      <!-- 学习统计 -->
      <div
        class="mt-8 bg-[var(--color-surface)] rounded-xl p-6 border border-[var(--color-secondary-200)]"
      >
        <h2 class="text-lg font-semibold mb-4 text-[var(--color-secondary-900)] font-serif">
          学习统计
        </h2>
        <div
          v-if="loading"
          class="grid grid-cols-3 gap-6 text-center"
        >
          <div>
            <Skeleton
              width="60%"
              height="40"
              class="mx-auto mb-2"
            />
            <Skeleton
              width="50%"
              height="16"
              class="mx-auto"
            />
          </div>
          <div>
            <Skeleton
              width="60%"
              height="40"
              class="mx-auto mb-2"
            />
            <Skeleton
              width="50%"
              height="16"
              class="mx-auto"
            />
          </div>
          <div>
            <Skeleton
              width="60%"
              height="40"
              class="mx-auto mb-2"
            />
            <Skeleton
              width="50%"
              height="16"
              class="mx-auto"
            />
          </div>
        </div>
        <div
          v-else
          class="grid grid-cols-3 gap-6 text-center"
        >
          <div>
            <div class="text-2xl font-bold text-[var(--color-primary-700)]">
              {{ characterCount.toLocaleString() }}
            </div>
            <div class="text-[var(--color-secondary-500)] text-sm">
              已学汉字
            </div>
          </div>
          <div>
            <div class="text-2xl font-bold text-[var(--color-secondary-900)]">
              {{ (poemCount / 1000).toFixed(0) }}k+
            </div>
            <div class="text-[var(--color-secondary-500)] text-sm">
              已学古诗
            </div>
          </div>
          <div>
            <div class="text-2xl font-bold text-gold-500">
              0
            </div>
            <div class="text-[var(--color-secondary-500)] text-sm">
              连续学习天数
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>
