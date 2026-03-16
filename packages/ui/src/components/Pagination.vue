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
  /** 是否显示每页条数选择 */
  showSizeChanger?: boolean
  /** 可选的每页条数 */
  pageSizes?: number[]
  /** 主题色 */
  color?: 'primary' | 'secondary' | 'orange' | 'purple'
}>()

const emit = defineEmits<{
  'update:modelValue': [page: number]
  'update:limit': [limit: number]
}>()

const colorMap = {
  primary: {
    bg: 'bg-primary-500',
    hover: 'hover:bg-primary-100',
    text: 'text-primary-600',
    ring: 'focus:ring-primary-500',
  },
  secondary: {
    bg: 'bg-secondary-500',
    hover: 'hover:bg-secondary-100',
    text: 'text-secondary-600',
    ring: 'focus:ring-secondary-500',
  },
  orange: {
    bg: 'bg-orange-500',
    hover: 'hover:bg-orange-100',
    text: 'text-orange-600',
    ring: 'focus:ring-orange-500',
  },
  purple: {
    bg: 'bg-purple-500',
    hover: 'hover:bg-purple-100',
    text: 'text-purple-600',
    ring: 'focus:ring-purple-500',
  },
}

const currentColor = computed(() => colorMap[props.color || 'primary'])

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

function changeSize(event: Event) {
  const newLimit = Number((event.target as HTMLSelectElement).value)
  emit('update:limit', newLimit)
  emit('update:modelValue', 1) // 重置到第一页
}

const startNum = computed(() => (props.modelValue - 1) * (props.limit || 10) + 1)
const endNum = computed(() => Math.min(props.modelValue * (props.limit || 10), props.total))
</script>

<template>
  <div class="flex flex-col sm:flex-row items-center justify-between gap-4 px-4 py-3 bg-white rounded-xl shadow-sm border border-gray-100">
    <!-- 左侧：显示信息和每页条数选择 -->
    <div class="flex items-center gap-4 text-sm text-gray-500 order-2 sm:order-1">
      <span v-if="total > 0" class="whitespace-nowrap">
        第 <span class="text-gray-700 font-medium">{{ startNum }}</span> -
        <span class="text-gray-700 font-medium">{{ endNum }}</span> 条，
        共 <span class="text-gray-700 font-medium">{{ total }}</span> 条
      </span>

      <select
        v-if="showSizeChanger"
        :value="limit || 10"
        class="h-8 px-2 pr-7 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 cursor-pointer appearance-none bg-no-repeat bg-[right_0.5rem_center]"
        style="background-image: url('data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 fill=%27none%27 viewBox=%270%200%2020%2020%27%3E%3Cpath stroke=%27%236b7280%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27 stroke-width=%271.5%27 d=%27m6 8 4 4 4-4%27/%3E%3C/svg%3E'); background-size: 1rem;"
        @change="changeSize"
      >
        <option v-for="size in (pageSizes || [10, 20, 40, 60])" :key="size" :value="size">
          {{ size }} 条/页
        </option>
      </select>
    </div>

    <!-- 右侧：分页按钮 -->
    <div class="flex items-center gap-1 order-1 sm:order-2">
      <!-- 首页 -->
      <button
        class="hidden sm:flex items-center justify-center w-8 h-8 rounded-lg text-sm text-gray-500 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        :disabled="modelValue <= 1"
        title="首页"
        @click="goTo(1)"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
        </svg>
      </button>

      <!-- 上一页 -->
      <button
        class="flex items-center justify-center h-8 px-3 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        :disabled="modelValue <= 1"
        @click="goTo(modelValue - 1)"
      >
        <svg class="w-4 h-4 mr-1 sm:hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
        <span class="hidden sm:inline">上一页</span>
      </button>

      <!-- 页码 -->
      <template v-for="(page, index) in pages" :key="index">
        <span
          v-if="page === '...'"
          class="px-1.5 text-gray-400"
        >...</span>
        <button
          v-else
          class="min-w-[32px] h-8 px-2 rounded-lg text-sm font-medium transition-all duration-200"
          :class="page === modelValue
            ? `${currentColor.bg} text-white shadow-md shadow-primary-500/25`
            : `${currentColor.text} ${currentColor.hover} hover:shadow-sm`"
          @click="goTo(page)"
        >
          {{ page }}
        </button>
      </template>

      <!-- 下一页 -->
      <button
        class="flex items-center justify-center h-8 px-3 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        :disabled="modelValue >= totalPages"
        @click="goTo(modelValue + 1)"
      >
        <span class="hidden sm:inline">下一页</span>
        <svg class="w-4 h-4 ml-1 sm:hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      </button>

      <!-- 末页 -->
      <button
        class="hidden sm:flex items-center justify-center w-8 h-8 rounded-lg text-sm text-gray-500 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        :disabled="modelValue >= totalPages"
        title="末页"
        @click="goTo(totalPages)"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
        </svg>
      </button>

      <!-- 页码跳转 -->
      <div
        v-if="showJumper"
        class="flex items-center gap-1.5 ml-2 pl-2 border-l border-gray-200"
      >
        <span class="text-sm text-gray-500 hidden sm:inline">跳至</span>
        <input
          type="number"
          :min="1"
          :max="totalPages"
          class="w-14 h-8 px-2 border border-gray-200 rounded-lg text-sm text-center focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-shadow"
          placeholder="页码"
          @keyup.enter="goTo(Number(($event.target as HTMLInputElement).value))"
        />
        <span class="text-sm text-gray-500 hidden sm:inline">页</span>
      </div>
    </div>
  </div>
</template>
