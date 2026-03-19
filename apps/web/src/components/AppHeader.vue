<script setup lang="ts">
  import { RouterLink, useRoute } from 'vue-router'
  import ThemeSwitcher from './ThemeSwitcher.vue'

  interface NavItem {
    name: string
    path: string
    icon: string
  }

  defineProps<{
    navItems?: NavItem[]
  }>()

  const route = useRoute()

  const isActive = (path: string) => {
    // 支持子路由高亮，如 /learn/characters 会高亮 /learn
    return route.path === path || route.path.startsWith(path + '/')
  }
</script>

<template>
  <header
    class="bg-[var(--color-surface)] shadow-sm sticky top-0 z-50 border-b border-[var(--color-secondary-200)]"
  >
    <div class="max-w-6xl mx-auto px-4 py-3">
      <div class="flex items-center justify-between">
        <RouterLink
          to="/"
          class="flex items-center gap-2"
        >
          <img
            src="/favicon.svg"
            alt="logo"
            class="w-6 h-6"
          />
          <span class="font-bold text-[var(--color-secondary-900)]">汉字学习</span>
        </RouterLink>
        <nav class="flex items-center gap-1">
          <template v-if="navItems">
            <RouterLink
              v-for="item in navItems"
              :key="item.path"
              :to="item.path"
              class="px-3 py-1.5 rounded-lg text-sm transition-colors"
              :class="[
                isActive(item.path)
                  ? 'bg-[var(--color-primary-100)] text-[var(--color-primary-700)] font-medium'
                  : 'text-[var(--color-secondary-600)] hover:bg-[var(--color-secondary-50)]',
              ]"
            >
              {{ item.icon }} {{ item.name }}
            </RouterLink>
          </template>
          <div class="ml-2">
            <ThemeSwitcher />
          </div>
        </nav>
      </div>
    </div>
  </header>
</template>
