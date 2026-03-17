<script setup lang="ts">
  import { RouterView } from 'vue-router'
  import AppHeader from '@/components/AppHeader.vue'

  const tabs = [
    { name: '学习首页', path: '/learn', icon: '🏠' },
    { name: '汉字', path: '/learn/characters', icon: '✍️' },
    { name: '古诗', path: '/learn/poems', icon: '📜' },
    { name: '文言文', path: '/learn/prose', icon: '📖' },
    { name: '成语', path: '/learn/idioms', icon: '🏮' },
  ]
</script>

<template>
  <div class="min-h-screen bg-[var(--color-background)] transition-colors duration-300">
    <AppHeader :nav-items="tabs" />

    <main class="max-w-6xl mx-auto px-4 py-6">
      <RouterView />
    </main>
  </div>
</template>
