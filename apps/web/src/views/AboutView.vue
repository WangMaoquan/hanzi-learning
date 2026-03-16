<script setup lang="ts">
  import { Card } from '@hanzi-learning/ui'

  const features = [
    {
      icon: '✍️',
      title: '阶段一：汉字学习',
      description: '笔顺动画、拼音注释、组词练习',
      color: 'primary',
    },
    {
      icon: '📜',
      title: '阶段二：古诗词',
      description: '朗读背诵、赏析理解',
      color: 'secondary',
    },
    {
      icon: '🏮',
      title: '阶段三：成语学习',
      description: '典故出处、活学活用',
      color: 'orange',
    },
    {
      icon: '📖',
      title: '阶段四：文言文',
      description: '古今对译、语法讲解',
      color: 'purple',
    },
  ]

  const techStack = [
    { name: '前端', value: 'Vue 3.5 + TypeScript + Vite', icon: '🎨' },
    { name: '样式', value: 'Tailwind CSS 4.x', icon: '✨' },
    { name: '架构', value: 'Monorepo (pnpm workspace)', icon: '🏗️' },
    { name: '汉字动画', value: 'Hanzi Writer', icon: '✏️' },
    { name: '状态管理', value: 'Pinia', icon: '📦' },
    { name: '后端', value: 'NestJS + Prisma', icon: '⚙️' },
  ]

  const colorMap: Record<string, { bg: string; text: string; border: string; gradient: string }> = {
    primary: {
      bg: 'bg-primary-50',
      text: 'text-primary-600',
      border: 'border-primary-200',
      gradient: 'from-primary-50 to-primary-100',
    },
    secondary: {
      bg: 'bg-secondary-50',
      text: 'text-secondary-600',
      border: 'border-secondary-200',
      gradient: 'from-secondary-50 to-secondary-100',
    },
    orange: {
      bg: 'bg-orange-50',
      text: 'text-orange-600',
      border: 'border-orange-200',
      gradient: 'from-orange-50 to-orange-100',
    },
    purple: {
      bg: 'bg-purple-50',
      text: 'text-purple-600',
      border: 'border-purple-200',
      gradient: 'from-purple-50 to-purple-100',
    },
  }
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 页面头部 -->
    <div class="bg-gradient-to-r from-primary-50 to-yellow-50 py-12 mb-8">
      <div class="max-w-4xl mx-auto px-4 text-center">
        <h1 class="text-4xl font-bold text-gray-900 mb-4"> 关于汉字学习平台 </h1>
        <p class="text-lg text-gray-600 max-w-2xl mx-auto">
          趣味学习中华文化的在线平台，帮助孩子掌握汉字、古诗、文言文和成语
        </p>
      </div>
    </div>

    <div class="max-w-4xl mx-auto px-4 pb-12">
      <!-- 平台简介 -->
      <Card hoverable class="mb-8">
        <div class="flex items-start gap-6">
          <div
            class="w-16 h-16 bg-gradient-to-br from-primary-100 to-primary-200 rounded-2xl flex items-center justify-center shrink-0"
          >
            <span class="text-3xl">🏫</span>
          </div>
          <div>
            <h2 class="text-xl font-bold text-gray-900 mb-2"> 平台简介 </h2>
            <p class="text-gray-600 leading-relaxed">
              汉字学习平台是一个专注于中华文化学习的在线教育工具。我们致力于通过趣味互动的学习方式，帮助用户轻松掌握汉字书写、古诗背诵、成语理解和文言文阅读能力。
            </p>
          </div>
        </div>
      </Card>

      <!-- 学习路线 -->
      <div class="mb-8">
        <h2 class="text-2xl font-bold text-gray-900 mb-6 text-center"> 学习路线 </h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div v-for="feature in features" :key="feature.title" class="group">
            <Card
              :class="
                'h-full border-2 transition-all duration-200 hover:-translate-y-1 ' +
                colorMap[feature.color].border
              "
            >
              <div class="flex items-start gap-4">
                <div
                  :class="[
                    'w-12 h-12 rounded-xl flex items-center justify-center text-2xl',
                    colorMap[feature.color].bg,
                  ]"
                >
                  {{ feature.icon }}
                </div>
                <div>
                  <h3 :class="['font-bold mb-1', colorMap[feature.color].text]">
                    {{ feature.title }}
                  </h3>
                  <p class="text-gray-500 text-sm">
                    {{ feature.description }}
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      <!-- 技术栈 -->
      <div class="mb-8">
        <h2 class="text-2xl font-bold text-gray-900 mb-6 text-center"> 技术栈 </h2>
        <Card>
          <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div
              v-for="tech in techStack"
              :key="tech.name"
              class="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-primary-50 transition-colors"
            >
              <span class="text-2xl">{{ tech.icon }}</span>
              <div>
                <div class="text-xs text-gray-500">
                  {{ tech.name }}
                </div>
                <div class="text-sm font-medium text-gray-800">
                  {{ tech.value }}
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <!-- 底部 -->
      <div class="text-center pt-8 border-t border-gray-200">
        <p class="text-gray-600 mb-2"> 让我们一起探索中华文化的魅力！ </p>
        <p class="text-gray-400 text-sm"> 汉字学习平台 · 让学习变得更有趣 </p>
      </div>
    </div>
  </div>
</template>
