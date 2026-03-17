<script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import { getCharacters, getCharacterCount, type Character } from '@/services/api'
  import { Card, Loading, Empty, Pagination } from '@hanzi-learning/ui'

  const loading = ref(true)
  const characters = ref<Character[]>([])
  const currentCharacter = ref<Character | null>(null)
  const currentPage = ref(1)
  const pageSize = ref(40)
  const total = ref(0)

  // 获取汉字列表
  async function fetchCharacters() {
    try {
      loading.value = true
      const [countRes, listRes] = await Promise.all([
        getCharacterCount(),
        getCharacters({ page: currentPage.value, limit: pageSize.value }),
      ])
      total.value = countRes.data
      characters.value = listRes.data.data
      // 设置当前页第一个汉字为当前学习
      if (characters.value.length > 0) {
        currentCharacter.value = characters.value[0]
      }
    } catch (error) {
      console.error('获取汉字列表失败:', error)
    } finally {
      loading.value = false
    }
  }

  // 页码变化
  function handlePageChange(page: number) {
    currentPage.value = page
    fetchCharacters()
    // 滚动到顶部
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // 每页条数变化
  function handleSizeChange(newSize: number) {
    pageSize.value = newSize
    currentPage.value = 1
    fetchCharacters()
  }

  onMounted(() => {
    fetchCharacters()
  })
</script>

<template>
  <div class="min-h-screen bg-[var(--color-secondary-50)]">
    <!-- 页面头部 - 现代简约中国风 -->
    <div
      class="bg-[var(--color-secondary-50)] py-8 mb-6 border-b border-[var(--color-secondary-200)]"
    >
      <div class="max-w-6xl mx-auto px-4">
        <h1 class="text-3xl font-bold text-[var(--color-secondary-900)] font-serif"> 汉字学习 </h1>
        <p class="text-[var(--color-secondary-600)] mt-1"> 掌握汉字笔画顺序，轻松学会常用汉字 </p>
      </div>
    </div>

    <div class="max-w-6xl mx-auto px-4 pb-8">
      <!-- 加载状态 -->
      <Loading v-if="loading" text="加载中..." />

      <template v-else>
        <!-- 当前学习 - 特色卡片 -->
        <Card
          v-if="currentCharacter"
          hoverable
          class="mb-8 border-2 border-[var(--color-primary-700)]"
        >
          <div class="flex items-center gap-8">
            <!-- 汉字展示 -->
            <div
              class="w-36 h-36 flex items-center justify-center rounded-xl shadow-inner bg-[var(--color-primary-50)]"
            >
              <span class="text-7xl font-bold text-[var(--color-secondary-900)]">{{
                currentCharacter.title
              }}</span>
            </div>

            <!-- 信息区域 -->
            <div class="flex-1">
              <div class="flex items-center gap-3 mb-4">
                <span
                  class="px-3 py-1 text-sm font-semibold rounded-full bg-[var(--color-primary-700)] text-white"
                >
                  正在学习
                </span>
                <span class="text-[var(--color-secondary-400)] text-sm">点击下方汉字继续学习</span>
              </div>

              <!-- 拼音 -->
              <div class="mb-4">
                <span class="text-[var(--color-secondary-500)] text-sm">拼音</span>
                <p class="text-2xl font-semibold text-[var(--color-secondary-900)]">
                  {{ currentCharacter.pinyin || '-' }}
                </p>
              </div>

              <!-- 释义 -->
              <div class="mb-5">
                <span class="text-[var(--color-secondary-500)] text-sm">释义</span>
                <p class="text-[var(--color-secondary-700)] leading-relaxed">
                  {{ currentCharacter.content || '-' }}
                </p>
              </div>

              <!-- 属性标签 -->
              <div class="flex flex-wrap gap-3">
                <span
                  v-if="currentCharacter.strokes"
                  class="px-3 py-1.5 text-sm rounded-lg bg-[var(--color-secondary-50)] text-[var(--color-secondary-500)]"
                >
                  {{ currentCharacter.strokes }} 画
                </span>
                <span
                  v-if="currentCharacter.structure"
                  class="px-3 py-1.5 text-sm rounded-lg bg-[var(--color-secondary-50)] text-[var(--color-secondary-500)]"
                >
                  {{ currentCharacter.structure }}
                </span>
                <span
                  v-if="currentCharacter.radicals"
                  class="px-3 py-1.5 text-sm rounded-lg bg-[var(--color-secondary-50)] text-[var(--color-secondary-500)]"
                >
                  部首：{{ currentCharacter.radicals }}
                </span>
              </div>
            </div>
          </div>
        </Card>

        <!-- 空状态 -->
        <Empty v-else description="暂无汉字数据" class="mb-6" />

        <!-- 字表 -->
        <div>
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-xl font-bold text-[var(--color-secondary-900)] font-serif"> 字表 </h2>
            <span class="text-[var(--color-secondary-500)] text-sm">共 {{ total }} 个汉字</span>
          </div>

          <div class="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-3 mb-8">
            <RouterLink
              v-for="char in characters"
              :key="char.id"
              :to="`/learn/characters/${char.id}`"
              class="group aspect-square flex items-center justify-center bg-[var(--color-surface)] rounded-xl border-2 border-[var(--color-secondary-200)] hover:border-[var(--color-primary-300)] hover:bg-[var(--color-primary-50)] hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
            >
              <span class="text-2xl font-bold transition-colors text-[var(--color-secondary-700)]">
                {{ char.title }}
              </span>
            </RouterLink>
          </div>

          <!-- 分页 -->
          <div class="flex justify-center">
            <Pagination
              v-model="currentPage"
              :total="total"
              :limit="pageSize"
              color="primary"
              show-size-changer
              :page-sizes="[20, 40, 60, 80]"
              @update:model-value="handlePageChange"
              @update:limit="handleSizeChange"
            />
          </div>
        </div>
      </template>
    </div>
  </div>
</template>
