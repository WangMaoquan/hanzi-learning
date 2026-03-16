<script setup lang="ts">
defineProps<{
  /** 标签 */
  label: string
  /** 是否为重要信息 */
  prominent?: boolean
}>()
</script>

<template>
  <div class="mb-4 last:mb-0">
    <span class="text-gray-500 text-sm block mb-1">{{ label }}</span>
    <p :class="prominent ? 'text-xl font-semibold text-gray-900' : 'text-gray-900'">
      <slot />
    </p>
  </div>
</template>
