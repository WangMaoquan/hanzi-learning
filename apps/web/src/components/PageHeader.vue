<script setup lang="ts">
  defineProps<{
    title: string
    description?: string
  }>()
</script>

<template>
  <div
    class="py-8 mb-6 border-b bg-[var(--color-secondary-100)] border-[var(--color-secondary-200)]"
  >
    <div class="max-w-6xl mx-auto px-4">
      <h1 class="text-3xl font-bold mb-2 text-[var(--color-secondary-900)] font-serif">
        {{ title }}
      </h1>
      <p
        v-if="description"
        class="text-[var(--color-secondary-600)] mt-1"
      >
        {{ description }}
      </p>
    </div>
  </div>
</template>
