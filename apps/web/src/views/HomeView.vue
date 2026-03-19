<script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import { useContentCounts, useToast } from '@/composables'
  import { Skeleton } from '@hanzi-learning/ui'
  import ThemeSwitcher from '@/components/ThemeSwitcher.vue'

  const { characterCount, poemCount, idiomCount, loading, error, fetchCounts } = useContentCounts()
  const toast = useToast()

  // 功能色配置 - 现代简约中国风
  const featureColors = {
    characters: {
      bg: 'bg-[var(--color-primary-50)]',
      bgHover: 'hover:bg-[var(--color-primary-100)]',
      text: 'text-[var(--color-primary-700)]',
      textHover: 'group-hover:text-[var(--color-primary-800)]',
      border: 'border-[var(--color-primary-200)]',
      borderHover: 'hover:border-[var(--color-primary-500)]',
      icon: 'text-[var(--color-primary-600)]',
    },
    poems: {
      bg: 'bg-[var(--color-secondary-50)]',
      bgHover: 'hover:bg-[var(--color-secondary-100)]',
      text: 'text-[var(--color-secondary-700)]',
      textHover: 'group-hover:text-[var(--color-secondary-800)]',
      border: 'border-[var(--color-secondary-200)]',
      borderHover: 'hover:border-[var(--color-secondary-500)]',
      icon: 'text-[var(--color-secondary-600)]',
    },
    idioms: {
      bg: 'bg-[var(--color-accent-50)]',
      bgHover: 'hover:bg-[var(--color-accent-100)]',
      text: 'text-[var(--color-accent-700)]',
      textHover: 'group-hover:text-[var(--color-accent-800)]',
      border: 'border-[var(--color-accent-200)]',
      borderHover: 'hover:border-[var(--color-accent-500)]',
      icon: 'text-[var(--color-accent-600)]',
    },
    prose: {
      bg: 'bg-[var(--color-secondary-50)]',
      bgHover: 'hover:bg-[var(--color-secondary-100)]',
      text: 'text-[var(--color-secondary-600)]',
      textHover: 'group-hover:text-secondary-700',
      border: 'border-[var(--color-secondary-200)]',
      borderHover: 'hover:border-[var(--color-secondary-400)]',
      icon: 'text-[var(--color-secondary-500)]',
    },
  }

  const features = [
    {
      title: '汉字学习',
      description: '笔顺动画、拼音注释、组词练习',
      icon: '✍️',
      path: '/learn/characters',
      count: characterCount,
      type: 'characters',
    },
    {
      title: '古诗词',
      description: '经典唐诗宋词，朗读背诵',
      icon: '📜',
      path: '/learn/poems',
      count: poemCount,
      type: 'poems',
    },
    {
      title: '文言文',
      description: '古今对译，理解经典',
      icon: '📖',
      path: '/learn/prose',
      count: ref(0),
      type: 'prose',
    },
    {
      title: '成语故事',
      description: '典故出处，活学活用',
      icon: '🏮',
      path: '/learn/idioms',
      count: idiomCount,
      type: 'idioms',
    },
  ]

  function getFeatureColors(type: string) {
    return featureColors[type as keyof typeof featureColors] || featureColors.characters
  }

  onMounted(async () => {
    await fetchCounts()
    if (error.value) {
      toast.error(error.value)
    }
  })
</script>

<template>
  <div class="min-h-screen">
    <!-- Header -->
    <header class="bg-[var(--color-surface)] shadow-sm">
      <div class="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <div class="flex items-center gap-2">
          <img
            src="/favicon.svg"
            alt="logo"
            class="w-8 h-8"
          />
          <span class="text-xl font-bold text-[var(--color-secondary-900)]">汉字学习平台</span>
        </div>
        <nav class="flex items-center gap-6">
          <RouterLink
            to="/"
            class="text-[var(--color-secondary-600)] hover:text-[var(--color-primary-500)] transition-colors"
          >
            首页
          </RouterLink>
          <RouterLink
            to="/learn"
            class="text-[var(--color-secondary-600)] hover:text-[var(--color-primary-500)] transition-colors"
          >
            学习
          </RouterLink>
          <RouterLink
            to="/practice"
            class="text-[var(--color-secondary-600)] hover:text-[var(--color-primary-500)] transition-colors"
          >
            练习
          </RouterLink>
          <RouterLink
            to="/about"
            class="text-[var(--color-secondary-600)] hover:text-[var(--color-primary-500)] transition-colors"
          >
            关于
          </RouterLink>
          <ThemeSwitcher />
        </nav>
      </div>
    </header>

    <!-- Hero - 现代简约中国风 -->
    <section class="bg-[var(--color-secondary-50)] py-20">
      <div class="max-w-4xl mx-auto px-4 text-center">
        <h1
          class="text-4xl md:text-5xl font-bold text-[var(--color-secondary-900)] mb-6 font-serif"
        >
          趣味学习，轻松掌握中华文化
        </h1>
        <p
          class="text-lg md:text-xl text-[var(--color-secondary-600)] mb-10 max-w-2xl mx-auto leading-relaxed"
        >
          笔画顺序动画、古诗朗读背诵、成语故事讲解，让学习变得有趣
        </p>
        <RouterLink
          to="/learn"
          class="btn btn-primary text-lg px-10 py-4 shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5"
        >
          开始学习
        </RouterLink>
      </div>
    </section>

    <!-- Features -->
    <section class="py-20 bg-[var(--color-background)]">
      <div class="max-w-6xl mx-auto px-4">
        <h2 class="text-3xl font-bold text-[var(--color-secondary-900)] text-center mb-4">
          学习内容
        </h2>
        <p class="text-[var(--color-secondary-500)] text-center mb-12 max-w-xl mx-auto">
          多种学习方式，轻松掌握中华文化精髓
        </p>

        <div
          v-if="loading"
          class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          <div
            v-for="i in 4"
            :key="i"
            class="bg-[var(--color-surface)] rounded-2xl p-6 border-2 border-[var(--color-secondary-100)]"
          >
            <div class="w-14 h-14 rounded-xl mb-5 bg-[var(--color-secondary-100)]"></div>
            <Skeleton
              width="60%"
              height="24"
              class="mb-2"
            />
            <Skeleton
              width="100%"
              height="16"
              class="mb-4"
            />
            <Skeleton
              width="40%"
              height="16"
            />
          </div>
        </div>

        <div
          v-else
          class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          <RouterLink
            v-for="feature in features"
            :key="feature.path"
            :to="feature.path"
            class="group"
          >
            <div
              :class="[
                'bg-[var(--color-surface)] rounded-2xl p-6 border-2 transition-all duration-300',
                getFeatureColors(feature.type).border,
                'hover:shadow-xl hover:-translate-y-1',
                getFeatureColors(feature.type).borderHover,
              ]"
            >
              <!-- 图标区域 -->
              <div
                :class="[
                  'w-14 h-14 rounded-xl flex items-center justify-center mb-5 text-2xl',
                  getFeatureColors(feature.type).bg,
                ]"
              >
                {{ feature.icon }}
              </div>

              <!-- 标题 -->
              <h3
                :class="[
                  'text-xl font-bold mb-2 transition-colors',
                  getFeatureColors(feature.type).text,
                  getFeatureColors(feature.type).textHover,
                ]"
              >
                {{ feature.title }}
              </h3>

              <!-- 描述 -->
              <p class="text-[var(--color-secondary-500)] text-sm mb-4 leading-relaxed">
                {{ feature.description }}
              </p>

              <!-- 数量 -->
              <div class="flex items-center gap-2">
                <span :class="['text-sm font-semibold', getFeatureColors(feature.type).text]">
                  {{ feature.count.value }}
                </span>
                <span class="text-[var(--color-secondary-400)] text-sm">个内容</span>
              </div>
            </div>
          </RouterLink>
        </div>
      </div>
    </section>

    <!-- Stats - 现代简约中国风 -->
    <section class="bg-[var(--color-surface)] py-16">
      <div class="max-w-4xl mx-auto px-4">
        <div class="grid grid-cols-3 gap-8 md:gap-12 text-center">
          <div class="py-6">
            <div class="text-4xl md:text-5xl font-bold text-[var(--color-primary-700)]">
              {{ characterCount.toLocaleString() }}+
            </div>
            <div class="text-[var(--color-secondary-600)] mt-3 font-medium">
              常用汉字
            </div>
          </div>
          <div class="py-6">
            <div class="text-4xl md:text-5xl font-bold text-[var(--color-secondary-700)]">
              {{ (poemCount / 1000).toFixed(0) }}k+
            </div>
            <div class="text-[var(--color-secondary-600)] mt-3 font-medium">
              经典古诗
            </div>
          </div>
          <div class="py-6">
            <div class="text-4xl md:text-5xl font-bold text-[var(--color-gold-600)]">
              {{ idiomCount.toLocaleString() }}+
            </div>
            <div class="text-[var(--color-secondary-600)] mt-3 font-medium">
              成语故事
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="bg-[var(--color-secondary-900)] text-[var(--color-secondary-400)] py-8">
      <div class="max-w-6xl mx-auto px-4 text-center">
        <p>汉字学习平台 - 让学习变得更有趣</p>
      </div>
    </footer>
  </div>
</template>
