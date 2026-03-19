<script setup lang="ts">
  import { computed } from 'vue'
  import { Loading, Empty, Pagination } from '@hanzi-learning/ui'

  const props = defineProps<{
    loading?: boolean
    total?: number
    limit?: number
    page?: number
    emptyDescription?: string
    showSizeChanger?: boolean
    pageSizes?: number[]
    color?: 'primary' | 'secondary' | 'orange' | 'purple'
    /** 加载时显示骨架屏而非 Loading 文字 */
    skeleton?: boolean
  }>()

  const emit = defineEmits<{
    'update:page': [page: number]
    'update:limit': [limit: number]
  }>()

  // 是否有数据
  const hasData = computed(() => props.total && props.total > 0)

  function handlePageChange(page: number) {
    emit('update:page', page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function handleLimitChange(limit: number) {
    emit('update:limit', limit)
    emit('update:page', 1)
  }
</script>

<template>
  <div class="max-w-6xl mx-auto px-4 pb-8">
    <!-- 加载状态 - 骨架屏 -->
    <div v-if="loading && skeleton">
      <slot name="skeleton"></slot>
    </div>

    <!-- 加载状态 - Loading -->
    <Loading
      v-else-if="loading"
      text="加载中..."
    />

    <!-- 空状态 -->
    <Empty
      v-else-if="!hasData"
      :description="emptyDescription || '暂无数据'"
    />

    <!-- 内容区域 -->
    <slot v-else></slot>

    <!-- 分页 -骨架屏时不显示 -->
    <div
      v-if="hasData && !(loading && skeleton)"
      class="flex justify-center mt-8"
    >
      <Pagination
        v-if="page !== undefined && limit !== undefined"
        :model-value="page"
        :total="total"
        :limit="limit"
        :color="color"
        :show-size-changer="showSizeChanger"
        :page-sizes="pageSizes"
        @update:model-value="handlePageChange"
        @update:limit="handleLimitChange"
      />
    </div>
  </div>
</template>
