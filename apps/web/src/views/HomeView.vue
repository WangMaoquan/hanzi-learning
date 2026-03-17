<script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import { useContentCounts, useToast } from '@/composables'

  const { characterCount, poemCount, idiomCount, loading, error, fetchCounts } = useContentCounts()
  const toast = useToast()

  // 功能色配置 - 现代简约中国风
  const featureColors = {
    characters: {
      bg: 'bg-primary-50',
      bgHover: 'hover:bg-primary-100',
      text: 'text-primary-700',
      textHover: 'group-hover:text-primary-800',
      border: 'border-primary-200',
      borderHover: 'hover:border-primary-500',
      icon: 'text-primary-600',
    },
    poems: {
      bg: 'bg-secondary-50',
      bgHover: 'hover:bg-secondary-100',
      text: 'text-secondary-700',
      textHover: 'group-hover:text-secondary-800',
      border: 'border-secondary-200',
      borderHover: 'hover:border-secondary-500',
      icon: 'text-secondary-600',
    },
    idioms: {
      bg: 'bg-yellow-50',
      bgHover: 'hover:bg-yellow-100',
      text: 'text-yellow-700',
      textHover: 'group-hover:text-yellow-800',
      border: 'border-yellow-200',
      borderHover: 'hover:border-yellow-500',
      icon: 'text-yellow-600',
    },
    prose: {
      bg: 'bg-secondary-50',
      bgHover: 'hover:bg-secondary-100',
      text: 'text-secondary-600',
      textHover: 'group-hover:text-secondary-700',
      border: 'border-secondary-200',
      borderHover: 'hover:border-secondary-400',
      icon: 'text-secondary-500',
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
    <header class="bg-white shadow-sm">
      <div class="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <div class="flex items-center gap-2">
          <img src="/favicon.svg" alt="logo" class="w-8 h-8" />
          <span class="text-xl font-bold text-gray-900">汉字学习平台</span>
        </div>
        <nav class="flex gap-6">
          <RouterLink to="/" class="text-gray-600 hover:text-primary-500 transition-colors">
            首页
          </RouterLink>
          <RouterLink to="/learn" class="text-gray-600 hover:text-primary-500 transition-colors">
            学习
          </RouterLink>
          <RouterLink to="/practice" class="text-gray-600 hover:text-primary-500 transition-colors">
            练习
          </RouterLink>
          <RouterLink to="/about" class="text-gray-600 hover:text-primary-500 transition-colors">
            关于
          </RouterLink>
        </nav>
      </div>
    </header>

    <!-- Hero - 现代简约中国风 -->
    <section class="bg-gradient-to-br from-secondary-50 via-white to-primary-50 py-20">
      <div class="max-w-4xl mx-auto px-4 text-center">
        <h1
          class="text-4xl md:text-5xl font-bold text-secondary-900 mb-6"
          style="font-family: 'Noto Serif SC', serif"
        >
          趣味学习，轻松掌握中华文化
        </h1>
        <p class="text-lg md:text-xl text-secondary-600 mb-10 max-w-2xl mx-auto leading-relaxed">
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
    <section class="py-20 bg-gray-50">
      <div class="max-w-6xl mx-auto px-4">
        <h2 class="text-3xl font-bold text-gray-900 text-center mb-4"> 学习内容 </h2>
        <p class="text-gray-500 text-center mb-12 max-w-xl mx-auto">
          多种学习方式，轻松掌握中华文化精髓
        </p>

        <div v-if="loading" class="text-center text-gray-500 py-12"> 加载中... </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <RouterLink
            v-for="feature in features"
            :key="feature.path"
            :to="feature.path"
            class="group"
          >
            <div
              :class="[
                'bg-white rounded-2xl p-6 border-2 border-transparent transition-all duration-300',
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
              <p class="text-gray-500 text-sm mb-4 leading-relaxed">
                {{ feature.description }}
              </p>

              <!-- 数量 -->
              <div class="flex items-center gap-2">
                <span :class="['text-sm font-semibold', getFeatureColors(feature.type).text]">
                  {{ feature.count.value }}
                </span>
                <span class="text-gray-400 text-sm">个内容</span>
              </div>
            </div>
          </RouterLink>
        </div>
      </div>
    </section>

    <!-- Stats - 现代简约中国风 -->
    <section class="bg-white py-16">
      <div class="max-w-4xl mx-auto px-4">
        <div class="grid grid-cols-3 gap-8 md:gap-12 text-center">
          <div class="py-6">
            <div
              class="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent"
            >
              {{ characterCount.toLocaleString() }}+
            </div>
            <div class="text-secondary-600 mt-3 font-medium"> 常用汉字 </div>
          </div>
          <div class="py-6">
            <div
              class="text-4xl md:text-5xl font-bold bg-gradient-to-r from-secondary-600 to-secondary-800 bg-clip-text text-transparent"
            >
              {{ (poemCount / 1000).toFixed(0) }}k+
            </div>
            <div class="text-secondary-600 mt-3 font-medium"> 经典古诗 </div>
          </div>
          <div class="py-6">
            <div
              class="text-4xl md:text-5xl font-bold bg-gradient-to-r from-yellow-500 to-yellow-700 bg-clip-text text-transparent"
            >
              {{ idiomCount.toLocaleString() }}+
            </div>
            <div class="text-secondary-600 mt-3 font-medium"> 成语故事 </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="bg-gray-900 text-gray-400 py-8">
      <div class="max-w-6xl mx-auto px-4 text-center">
        <p>汉字学习平台 - 让学习变得更有趣</p>
      </div>
    </footer>
  </div>
</template>
