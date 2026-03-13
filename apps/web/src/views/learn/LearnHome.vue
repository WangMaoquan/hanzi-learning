<script setup lang="ts">
import { characters, poems } from '@hanzi-learning/data'

const stats = [
  { label: '汉字', value: characters.length, icon: '✍️', path: '/learn/characters' },
  { label: '古诗', value: poems.length, icon: '📜', path: '/learn/poems' },
  { label: '文言文', value: 0, icon: '📖', path: '/learn/prose' },
  { label: '成语', value: 0, icon: '🏮', path: '/learn/idioms' },
]
</script>

<template>
  <div>
    <h1 class="text-2xl font-bold text-gray-900 mb-6">选择学习内容</h1>

    <!-- Stats -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      <RouterLink
        v-for="stat in stats"
        :key="stat.path"
        :to="stat.path"
        class="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow text-center"
      >
        <div class="text-3xl mb-2">{{ stat.icon }}</div>
        <div class="text-2xl font-bold text-gray-900">{{ stat.value }}</div>
        <div class="text-gray-500 text-sm">{{ stat.label }}</div>
      </RouterLink>
    </div>

    <!-- Quick Start -->
    <h2 class="text-lg font-semibold text-gray-900 mb-4">快速开始</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <RouterLink
        to="/learn/characters"
        class="bg-gradient-to-r from-primary-400 to-primary-500 rounded-xl p-6 text-white hover:from-primary-500 hover:to-primary-600 transition-all"
      >
        <div class="flex items-center gap-3 mb-2">
          <span class="text-3xl">✍️</span>
          <span class="text-xl font-bold">开始学汉字</span>
        </div>
        <p class="text-primary-100">从一年级常用字开始</p>
      </RouterLink>

      <RouterLink
        to="/learn/poems"
        class="bg-gradient-to-r from-secondary-400 to-secondary-500 rounded-xl p-6 text-white hover:from-secondary-500 hover:to-secondary-600 transition-all"
      >
        <div class="flex items-center gap-3 mb-2">
          <span class="text-3xl">📜</span>
          <span class="text-xl font-bold">开始读古诗</span>
        </div>
        <p class="text-secondary-100">背诵经典唐诗</p>
      </RouterLink>
    </div>
  </div>
</template>
