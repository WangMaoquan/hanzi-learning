<script setup lang="ts">
defineProps<{
  /** 链接地址 */
  to?: string
  /** 是否使用 router-link */
  replace?: boolean
}>()
</script>

<template>
  <component
    :is="to ? (replace ? 'span' : 'a') : 'span'"
    :href="to"
    class="inline-flex items-center gap-1 text-[var(--color-secondary-500)] hover:text-primary-600 transition-colors cursor-pointer"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      class="w-4 h-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M15 19l-7-7 7-7"
      />
    </svg>
    <span><slot>返回</slot></span>
  </component>
</template>
