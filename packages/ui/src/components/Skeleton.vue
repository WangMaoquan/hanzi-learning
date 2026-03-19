<script setup lang="ts">
defineProps<{
  /** 占位行数 */
  lines?: number
  /** 宽度 */
  width?: string | number
  /** 高度 */
  height?: string | number
}>()
</script>

<script lang="ts">
export default {
  inheritAttrs: false,
}
</script>

<template>
  <div class="animate-pulse space-y-3">
    <div
      v-for="i in lines || 3"
      :key="i"
      class="bg-[var(--color-secondary-200)] rounded"
      :style="{
        width: width || '100%',
        height: height || '1rem',
      }"
      v-bind="$attrs"
    ></div>
  </div>
</template>
