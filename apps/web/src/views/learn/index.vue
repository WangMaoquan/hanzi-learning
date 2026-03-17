<script setup lang="ts">
  import { RouterView, useRoute } from 'vue-router'
  import ThemeSwitcher from '@/components/ThemeSwitcher.vue'

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
  <div class="min-h-screen bg-[var(--color-background)] transition-colors duration-300">
    <header
      class="bg-[var(--color-surface)] shadow-sm sticky top-0 z-50 border-b border-[var(--color-secondary-200)]"
    >
      <div class="max-w-6xl mx-auto px-4 py-3">
        <div class="flex items-center justify-between">
          <RouterLink to="/" class="flex items-center gap-2">
            <img src="/favicon.svg" alt="logo" class="w-6 h-6" />
            <span class="font-bold text-[var(--color-secondary-900)]">汉字学习</span>
          </RouterLink>
          <nav class="flex items-center gap-1">
            <RouterLink
              v-for="tab in tabs"
              :key="tab.path"
              :to="tab.path"
              class="px-3 py-1.5 rounded-lg text-sm transition-colors"
              :class="[
                route.path === tab.path || route.path.startsWith(tab.path + '/')
                  ? 'bg-[var(--color-primary-100)] text-[var(--color-primary-700)] font-medium'
                  : 'text-[var(--color-secondary-600)] hover:bg-[var(--color-secondary-50)]',
              ]"
            >
              {{ tab.icon }} {{ tab.name }}
            </RouterLink>
            <div class="ml-2">
              <ThemeSwitcher />
            </div>
          </nav>
        </div>
      </div>
    </header>

    <main class="max-w-6xl mx-auto px-4 py-6">
      <RouterView />
    </main>
  </div>
</template>
