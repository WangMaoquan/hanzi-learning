<script setup lang="ts">
  import { RouterView } from 'vue-router'
  import ToastContainer from '@/components/ToastContainer.vue'
  import { useToast } from '@/composables'

  const { toasts } = useToast()
</script>

<template>
  <div class="min-h-screen bg-gray-50">
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
