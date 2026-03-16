<script setup lang="ts">
  import { RouterView, useRoute } from 'vue-router'

  const route = useRoute()

  const tabs = [
    { name: '首页', path: '/learn', icon: '🏠' },
    { name: '汉字', path: '/learn/characters', icon: '✍️' },
    { name: '古诗', path: '/learn/poems', icon: '📜' },
    { name: '文言文', path: '/learn/prose', icon: '📖' },
    { name: '成语', path: '/learn/idioms', icon: '🏮' },
  ]
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <header class="bg-white shadow-sm sticky top-0 z-50">
      <div class="max-w-6xl mx-auto px-4 py-3">
        <div class="flex items-center justify-between">
          <RouterLink to="/" class="flex items-center gap-2">
            <img src="/favicon.svg" alt="logo" class="w-6 h-6" />
            <span class="font-bold text-gray-900">汉字学习</span>
          </RouterLink>
          <nav class="flex gap-1">
            <RouterLink
              v-for="tab in tabs"
              :key="tab.path"
              :to="tab.path"
              class="px-3 py-1.5 rounded-lg text-sm transition-colors"
              :class="[
                route.path === tab.path || route.path.startsWith(tab.path + '/')
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-gray-600 hover:bg-gray-100',
              ]"
            >
              {{ tab.icon }} {{ tab.name }}
            </RouterLink>
          </nav>
        </div>
      </div>
    </header>

    <main class="max-w-6xl mx-auto px-4 py-6">
      <RouterView />
    </main>
  </div>
</template>
