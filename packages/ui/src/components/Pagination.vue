<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  /** 当前页码 */
  modelValue: number
  /** 总数据数 */
  total: number
  /** 每页条数 */
  limit?: number
  /** 是否显示页码跳转 */
  showJumper?: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [page: number]
}>()

const totalPages = computed(() => Math.ceil(props.total / (props.limit || 10)))

const pages = computed(() => {
  const p = totalPages.value
  const c = props.modelValue
  const result: (number | '...')[] = []

  if (p <= 7) {
    for (let i = 1; i <= p; i++) result.push(i)
  } else {
    result.push(1)
    if (c > 3) result.push('...')
    for (let i = Math.max(2, c - 1); i <= Math.min(p - 1, c + 1); i++) {
      result.push(i)
    }
    if (c < p - 2) result.push('...')
    result.push(p)
  }

  return result
})

function goTo(page: number) {
  if (page >= 1 && page <= totalPages.value && page !== props.modelValue) {
    emit('update:modelValue', page)
  }
}
</script>

<template>
  <div class="flex items-center justify-center gap-1">
    <!-- 上一页 -->
    <button
      class="px-3 py-1.5 rounded-lg text-sm text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
      :disabled="modelValue <= 1"
      @click="goTo(modelValue - 1)"
    >
      上一页
    </button>

    <!-- 页码 -->
    <template
      v-for="(page, index) in pages"
      :key="index"
    >
      <span
        v-if="page === '...'"
        class="px-2 text-gray-400"
      >...</span>
      <button
        v-else
        class="min-w-[36px] h-8 px-2 rounded-lg text-sm font-medium transition-colors"
        :class="page === modelValue
          ? 'bg-primary-500 text-white'
          : 'text-gray-600 hover:bg-gray-100'"
        @click="goTo(page)"
      >
        {{ page }}
      </button>
    </template>

    <!-- 下一页 -->
    <button
      class="px-3 py-1.5 rounded-lg text-sm text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
      :disabled="modelValue >= totalPages"
      @click="goTo(modelValue + 1)"
    >
      下一页
    </button>

    <!-- 页码跳转 -->
    <div
      v-if="showJumper"
      class="flex items-center gap-1 ml-2"
    >
      <span class="text-sm text-gray-500">跳至</span>
      <input
        type="number"
        :min="1"
        :max="totalPages"
        class="w-14 h-8 px-2 border border-gray-300 rounded-lg text-sm text-center focus:outline-none focus:border-primary-500"
        @keyup.enter="goTo(Number(($event.target as HTMLInputElement).value))"
      />
      <span class="text-sm text-gray-500">页</span>
    </div>
  </div>
</template>
