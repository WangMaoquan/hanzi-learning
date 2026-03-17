<script setup lang="ts">
defineProps<{
  /** 是否 hover 时有阴影效果 */
  hoverable?: boolean
  /** 是否有点击效果 */
  clickable?: boolean
  /** 额外的 class */
  class?: string
}>()
</script>

<template>
  <div
    class="bg-[var(--color-surface)] rounded-xl p-6 shadow-sm border border-[var(--color-secondary-100)] transition-all"
    :class="{
      'hover:shadow-md hover:border-primary-200': hoverable,
      'cursor-pointer active:scale-[0.99]': clickable,
    }"
  >
    <slot></slot>
  </div>
</template>
