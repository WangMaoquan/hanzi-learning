<script setup lang="ts">
  import { useToast, type ToastType } from './useToast'

  defineProps<{
    toasts: ReturnType<typeof useToast>['toasts']
  }>()

  const { remove } = useToast()

  const typeClasses: Record<ToastType, string> = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    warning: 'bg-yellow-500',
    info: 'bg-blue-500',
  }

  const iconMap: Record<ToastType, string> = {
    success: '✓',
    error: '✕',
    warning: '⚠',
    info: 'ℹ',
  }
</script>

<template>
  <div class="fixed top-4 right-4 z-50 flex flex-col gap-2">
    <TransitionGroup name="toast">
      <div
        v-for="toast in toasts"
        :key="toast.id"
        class="flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg text-white min-w-[280px] max-w-[400px]"
        :class="typeClasses[toast.type]"
      >
        <span class="text-lg">{{ iconMap[toast.type] }}</span>
        <span class="flex-1">{{ toast.message }}</span>
        <button class="text-white/80 hover:text-white transition-colors" @click="remove(toast.id)">
          ✕
        </button>
      </div>
    </TransitionGroup>
  </div>
</template>

<style scoped>
  .toast-enter-active,
  .toast-leave-active {
    transition: all 0.3s ease;
  }

  .toast-enter-from {
    opacity: 0;
    transform: translateX(100%);
  }

  .toast-leave-to {
    opacity: 0;
    transform: translateX(100%);
  }
</style>
