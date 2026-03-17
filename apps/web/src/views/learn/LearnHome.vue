<script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import { useContentCounts, useToast } from '@/composables'

  const { characterCount, poemCount, idiomCount, loading, error, fetchCounts } = useContentCounts()
  const toast = useToast()

  const stats = [
    { label: '汉字', value: characterCount, icon: '✍️', path: '/learn/characters' },
    { label: '古诗', value: poemCount, icon: '📜', path: '/learn/poems' },
    { label: '文言文', value: ref(0), icon: '📖', path: '/learn/prose' },
    { label: '成语', value: idiomCount, icon: '🏮', path: '/learn/idioms' },
  ]

  onMounted(async () => {
    await fetchCounts()
    if (error.value) {
      toast.error(error.value)
    }
  })
</script>

<template>
  <div>
    <h1 class="text-2xl font-bold text-[var(--color-secondary-900)] mb-6"> 选择学习内容 </h1>

    <!-- Stats -->
    <div v-if="loading" class="text-center text-[var(--color-secondary-500)] py-8"> 加载中... </div>
    <div v-else class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      <RouterLink
        v-for="stat in stats"
        :key="stat.path"
        :to="stat.path"
        class="bg-[var(--color-surface)] rounded-xl p-6 shadow-sm border border-[var(--color-secondary-100)] hover:shadow-md transition-shadow text-center"
      >
        <div class="text-3xl mb-2">
          {{ stat.icon }}
        </div>
        <div class="text-2xl font-bold text-[var(--color-secondary-900)]">
          {{ stat.value.value.toLocaleString() }}
        </div>
        <div class="text-[var(--color-secondary-500)] text-sm">
          {{ stat.label }}
        </div>
      </RouterLink>
    </div>

    <!-- Quick Start -->
    <h2 class="text-lg font-semibold text-[var(--color-secondary-900)] mb-4"> 快速开始 </h2>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <RouterLink
        to="/learn/characters"
        class="bg-[var(--color-primary-500)] rounded-xl p-6 text-white hover:bg-[var(--color-primary-600)] transition-all"
      >
        <div class="flex items-center gap-3 mb-2">
          <span class="text-3xl">✍️</span>
          <span class="text-xl font-bold">开始学汉字</span>
        </div>
        <p class="text-primary-100"> 从一年级常用字开始 </p>
      </RouterLink>

      <RouterLink
        to="/learn/poems"
        class="bg-[var(--color-secondary-500)] rounded-xl p-6 text-white hover:bg-[var(--color-secondary-600)] transition-all"
      >
        <div class="flex items-center gap-3 mb-2">
          <span class="text-3xl">📜</span>
          <span class="text-xl font-bold">开始读古诗</span>
        </div>
        <p class="text-secondary-100"> 背诵经典唐诗 </p>
      </RouterLink>
    </div>
  </div>
</template>
