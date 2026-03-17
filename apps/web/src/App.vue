<script setup lang="ts">
  import { RouterView } from 'vue-router'
  import { ToastContainer } from '@hanzi-learning/ui'
  import { useToast } from '@/composables'
  import { useThemeStore } from '@/stores/theme'

  const { toasts } = useToast()
  // 初始化主题
  useThemeStore()
</script>

<template>
  <div class="min-h-screen bg-[var(--color-background)]">
    <RouterView />
    <ToastContainer :toasts="toasts" />
  </div>
</template>

<style>
  html,
  body {
    margin: 0;
    padding: 0;
    font-family: 'Noto Sans SC', 'Microsoft YaHei', sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
</style>
