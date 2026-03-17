<script setup lang="ts">
defineProps<{
  /** 加载提示文字 */
  text?: string
  /** size: sm, md, lg */
  size?: 'sm' | 'md' | 'lg'
}>()
</script>

<template>
  <div
    class="flex items-center justify-center py-8"
    :class="size === 'sm' ? 'py-4' : size === 'lg' ? 'py-12' : 'py-8'"
  >
    <div class="flex items-center gap-3">
      <!-- spinner -->
      <svg
        class="animate-spin"
        :class="{
          'w-4 h-4': size === 'sm',
          'w-6 h-6': size === 'md' || !size,
          'w-8 h-8': size === 'lg',
        }"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          class="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          stroke-width="4"
        />
        <path
          class="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
      <span
        v-if="text || $slots.default"
        class="text-[var(--color-secondary-500)]"
        :class="{
          'text-sm': size === 'sm',
          'text-base': size === 'md' || !size,
          'text-lg': size === 'lg',
        }"
      >
        <slot>{{ text }}</slot>
      </span>
    </div>
  </div>
</template>
