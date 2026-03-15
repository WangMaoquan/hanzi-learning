<script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import { getIdioms, type Idiom } from '@/services/api'

  const loading = ref(true)
  const idioms = ref<Idiom[]>([])
  const currentIdiom = ref<Idiom | null>(null)

  // 获取成语列表
  async function fetchIdioms() {
    try {
      loading.value = true
      const response = await getIdioms({ limit: 50 })
      idioms.value = response.data
      if (idioms.value.length > 0) {
        currentIdiom.value = idioms.value[0]
      }
    } catch (error) {
      console.error('获取成语列表失败:', error)
    } finally {
      loading.value = false
    }
  }

  onMounted(() => {
    fetchIdioms()
  })
</script>

<template>
  <div>
    <h1 class="text-2xl font-bold text-gray-900 mb-6"> 成语学习 </h1>

    <!-- 加载状态 -->
    <div v-if="loading" class="flex items-center justify-center py-20">
      <div class="text-gray-500"> 加载中... </div>
    </div>

    <template v-else>
      <!-- 当前学习 -->
      <div
        v-if="currentIdiom"
        class="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6"
      >
        <h2 class="text-lg font-semibold text-gray-900 mb-4"> 正在学习 </h2>
        <div class="flex items-start gap-8">
          <div class="w-40 h-40 flex items-center justify-center bg-primary-50 rounded-xl">
            <span class="text-4xl font-bold text-gray-900">{{ currentIdiom.title }}</span>
          </div>
          <div class="flex-1">
            <div class="mb-4">
              <span class="text-gray-500 text-sm">拼音</span>
              <p class="text-xl text-gray-900">
                {{ currentIdiom.pinyin || '-' }}
              </p>
            </div>
            <div class="mb-4">
              <span class="text-gray-500 text-sm">释义</span>
              <p class="text-gray-900">
                {{ currentIdiom.content || '-' }}
              </p>
            </div>
            <div v-if="currentIdiom.derivation" class="mb-4">
              <span class="text-gray-500 text-sm">出处</span>
              <p class="text-gray-700 text-sm">
                {{ currentIdiom.derivation }}
              </p>
            </div>
            <div v-if="currentIdiom.example">
              <span class="text-gray-500 text-sm">例句</span>
              <p class="text-gray-700 italic">
                {{ currentIdiom.example }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- 空状态 -->
      <div v-else class="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
        <p class="text-gray-500"> 暂无成语数据 </p>
      </div>

      <!-- 成语列表 -->
      <div>
        <h2 class="text-lg font-semibold text-gray-900 mb-4"> 成语列表 ({{ idioms.length }}) </h2>
        <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
          <RouterLink
            v-for="idiom in idioms"
            :key="idiom.id"
            :to="`/learn/idioms/${idiom.id}`"
            class="p-3 bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md hover:border-primary-200 transition-all text-center"
          >
            <span class="text-lg font-bold text-gray-900">{{ idiom.title }}</span>
          </RouterLink>
        </div>
      </div>
    </template>
  </div>
</template>
