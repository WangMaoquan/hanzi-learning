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
    <span class="text-[var(--color-secondary-500)] text-sm block mb-1">{{ label }}</span>
    <p :class="prominent ? 'text-xl font-semibold text-[var(--color-secondary-900)]' : 'text-[var(--color-secondary-900)]'">
      <slot></slot>
    </p>
  </div>
</template>
