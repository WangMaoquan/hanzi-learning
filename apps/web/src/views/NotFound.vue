<script setup lang="ts"></script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-[var(--color-background)]">
    <div class="text-center">
      <div class="text-8xl mb-4">
        404
      </div>
      <h1 class="text-2xl font-bold text-[var(--color-secondary-900)] mb-2">
        页面不存在
      </h1>
      <p class="text-[var(--color-secondary-500)] mb-8">
        抱歉，您访问的页面不存在或已被删除
      </p>
      <RouterLink
        to="/"
        class="btn btn-primary"
      >
        返回首页
      </RouterLink>
    </div>
  </div>
</template>
