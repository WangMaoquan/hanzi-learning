<script setup lang="ts">
  // 文言文内容 - 后续扩展
  import PageHeader from '@/components/PageHeader.vue'
  import PageContent from '@/components/PageContent.vue'
</script>

<template>
  <div class="min-h-screen bg-[var(--color-secondary-50)]">
    <!-- 页面头部 -->
    <PageHeader
      title="文言文"
      description="学习古今对译，掌握实词虚词"
    />

    <PageContent>
      <div
        class="bg-[var(--color-surface)] rounded-xl p-12 shadow-sm border border-[var(--color-secondary-100)] text-center"
      >
        <div class="text-6xl mb-4">
          📖
        </div>
        <h2 class="text-xl font-semibold text-[var(--color-secondary-900)] mb-2">
          即将上线
        </h2>
        <p class="text-[var(--color-secondary-500)] mb-4">
          文言文学习模块正在准备中
        </p>
        <p class="text-sm text-[var(--color-secondary-400)]">
          预计包含：初中必背文言文、古今对译、实词虚词练习
        </p>
      </div>
    </PageContent>
  </div>
</template>
