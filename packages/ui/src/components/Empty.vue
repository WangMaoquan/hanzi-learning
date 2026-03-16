<script setup lang="ts">
defineProps<{
  /** 空状态描述文字 */
  description?: string
  /** 是否显示默认图标 */
  showIcon?: boolean
}>()
</script>

<template>
  <div class="flex flex-col items-center justify-center py-12 text-center">
    <!-- 默认图标 -->
    <div v-if="showIcon !== false" class="mb-4 text-gray-300">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="w-16 h-16"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="1.5"
          d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
        />
      </svg>
    </div>
    <p class="text-gray-500 text-base">
      <slot>{{ description || '暂无数据' }}</slot>
    </p>
  </div>
</template>
