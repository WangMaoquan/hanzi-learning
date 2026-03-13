<script setup lang="ts">
  // 骨架屏组件
  defineProps<{
    lines?: number
    width?: string
    height?: string
  }>()
</script>

<template>
  <div class="animate-pulse space-y-3">
    <div
      v-for="i in lines || 3"
      :key="i"
      class="bg-gray-200 rounded"
      :style="{
        width: width || '100%',
        height: height || '1rem',
      }"
    ></div>
  </div>
</template>
