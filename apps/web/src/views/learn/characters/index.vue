<script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import { getCharacters, type Character } from '@/services/api'
  import { Card, Loading, Empty } from '@hanzi-learning/ui'

  const loading = ref(true)
  const characters = ref<Character[]>([])
  const currentCharacter = ref<Character | null>(null)

  // 获取汉字列表
  async function fetchCharacters() {
    try {
      loading.value = true
      const response = await getCharacters({ limit: 100 })
      characters.value = response.data.data
      if (characters.value.length > 0) {
        currentCharacter.value = characters.value[0]
      }
    } catch (error) {
      console.error('获取汉字列表失败:', error)
    } finally {
      loading.value = false
    }
  }

  onMounted(() => {
    fetchCharacters()
  })
</script>

<template>
  <div>
    <h1 class="text-2xl font-bold text-gray-900 mb-6"> 汉字学习 </h1>

    <!-- 加载状态 -->
    <Loading v-if="loading" text="加载中..." />

    <template v-else>
      <!-- 当前学习 -->
      <Card v-if="currentCharacter" class="mb-6">
        <h2 class="text-lg font-semibold text-gray-900 mb-4"> 正在学习 </h2>
        <div class="flex items-center gap-8">
          <div class="w-40 h-40 flex items-center justify-center bg-primary-50 rounded-xl">
            <span class="text-8xl font-bold text-gray-900">{{ currentCharacter.title }}</span>
          </div>
          <div class="flex-1">
            <div class="mb-4">
              <span class="text-gray-500 text-sm">拼音</span>
              <p class="text-xl text-gray-900">
                {{ currentCharacter.pinyin || '-' }}
              </p>
            </div>
            <div class="mb-4">
              <span class="text-gray-500 text-sm">释义</span>
              <p class="text-gray-900">
                {{ currentCharacter.content || '-' }}
              </p>
            </div>
            <div class="flex gap-4">
              <div>
                <span class="text-gray-500 text-sm">笔画</span>
                <p class="text-gray-900">
                  {{ currentCharacter.strokes ? `${currentCharacter.strokes} 画` : '-' }}
                </p>
              </div>
              <div>
                <span class="text-gray-500 text-sm">结构</span>
                <p class="text-gray-900">
                  {{ currentCharacter.structure || '-' }}
                </p>
              </div>
              <div>
                <span class="text-gray-500 text-sm">部首</span>
                <p class="text-gray-900">
                  {{ currentCharacter.radicals || '-' }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <!-- 空状态 -->
      <Empty v-else description="暂无汉字数据" class="mb-6" />

      <!-- 字表 -->
      <div>
        <h2 class="text-lg font-semibold text-gray-900 mb-4"> 字表 ({{ characters.length }}) </h2>
        <div class="grid grid-cols-5 md:grid-cols-8 lg:grid-cols-10 gap-3">
          <RouterLink
            v-for="char in characters"
            :key="char.id"
            :to="`/learn/characters/${char.id}`"
            class="aspect-square flex items-center justify-center bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md hover:border-primary-200 transition-all"
          >
            <span class="text-2xl font-bold text-gray-900">{{ char.title }}</span>
          </RouterLink>
        </div>
      </div>
    </template>
  </div>
</template>
