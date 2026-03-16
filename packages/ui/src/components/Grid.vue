<script setup lang="ts">
defineProps<{
  /** 间距 */
  gap?: string
}>()
</script>

<template>
  <div
    class="grid gap-3"
    :style="gap ? { gap } : {}"
  >
    <slot></slot>
  </div>
</template>
