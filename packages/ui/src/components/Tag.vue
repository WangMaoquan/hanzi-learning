<script setup lang="ts">
defineProps<{
  /** 标签类型/颜色 */
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'error' | 'info'
  /** 标签大小 */
  size?: 'sm' | 'md' | 'lg'
}>()
</script>

<template>
  <span
    class="inline-flex items-center rounded-full font-medium"
    :class="[
      // 颜色变体
      {
        'bg-gray-100 text-gray-700': variant === 'default' || !variant,
        'bg-primary-100 text-primary-700': variant === 'primary',
        'bg-green-100 text-green-700': variant === 'success',
        'bg-yellow-100 text-yellow-700': variant === 'warning',
        'bg-red-100 text-red-700': variant === 'error',
        'bg-blue-100 text-blue-700': variant === 'info',
      },
      // 大小
      {
        'px-2 py-0.5 text-xs': size === 'sm',
        'px-2.5 py-1 text-sm': size === 'md' || !size,
        'px-3 py-1.5 text-base': size === 'lg',
      },
    ]"
  >
    <slot></slot>
  </span>
</template>
