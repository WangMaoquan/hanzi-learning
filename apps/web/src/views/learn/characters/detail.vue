<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { computed } from 'vue'
import { characters } from '@hanzi-learning/data'

const route = useRoute()
const router = useRouter()

const character = computed(() => {
  const id = route.params.id as string
  return characters.find((c) => c.id === id)
})

const nextCharacter = computed(() => {
  const idx = characters.findIndex((c) => c.id === character.value?.id)
  return characters[idx + 1]
})

const prevCharacter = computed(() => {
  const idx = characters.findIndex((c) => c.id === character.value?.id)
  return characters[idx - 1]
})
</script>

<template>
  <div v-if="character">
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold text-gray-900">汉字详情</h1>
      <RouterLink to="/learn/characters" class="text-gray-500 hover:text-gray-700">
        ← 返回字表
      </RouterLink>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- 左侧：汉字展示 -->
      <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div class="flex items-center justify-center h-64 bg-primary-50 rounded-xl mb-6">
          <span class="text-9xl font-bold text-gray-900">{{ character.title }}</span>
        </div>

        <!-- 笔顺动画占位 -->
        <div class="text-center text-gray-500 text-sm mb-4">
          笔顺动画（需要 Hanzi Writer）
        </div>

        <!-- 导航 -->
        <div class="flex justify-between">
          <button
            v-if="prevCharacter"
            @click="router.push(`/learn/characters/${prevCharacter.id}`)"
            class="btn bg-gray-100 text-gray-700 hover:bg-gray-200"
          >
            ← {{ prevCharacter.title }}
          </button>
          <div v-else></div>
          <button
            v-if="nextCharacter"
            @click="router.push(`/learn/characters/${nextCharacter.id}`)"
            class="btn bg-primary-400 text-gray-900 hover:bg-primary-500"
          >
            {{ nextCharacter.title }} →
          </button>
        </div>
      </div>

      <!-- 右侧：信息 -->
      <div class="space-y-6">
        <!-- 基本信息 -->
        <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">基本信息</h2>
          <div class="space-y-3">
            <div class="flex items-center gap-4">
              <span class="text-gray-500 w-12">拼音</span>
              <span class="text-xl text-gray-900">{{ character.pinyin }}</span>
            </div>
            <div class="flex items-center gap-4">
              <span class="text-gray-500 w-12">释义</span>
              <span class="text-gray-900">{{ character.translation }}</span>
            </div>
            <div class="flex items-center gap-4">
              <span class="text-gray-500 w-12">笔画</span>
              <span class="text-gray-900">{{ character.strokes }} 画</span>
            </div>
            <div class="flex items-center gap-4">
              <span class="text-gray-500 w-12">结构</span>
              <span class="text-gray-900">{{ character.structure }}</span>
            </div>
            <div class="flex items-center gap-4">
              <span class="text-gray-500 w-12">部首</span>
              <span class="text-gray-900">{{ character.radicals }}</span>
            </div>
          </div>
        </div>

        <!-- 组词 -->
        <div v-if="character.words?.length" class="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">组词</h2>
          <div class="flex flex-wrap gap-2">
            <span
              v-for="word in character.words"
              :key="word"
              class="px-3 py-1 bg-gray-100 rounded-full text-gray-700"
            >
              {{ word }}
            </span>
          </div>
        </div>

        <!-- 例句 -->
        <div v-if="character.sentences?.length" class="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">例句</h2>
          <ul class="space-y-2">
            <li v-for="sentence in character.sentences" :key="sentence" class="text-gray-700">
              {{ sentence }}
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>

  <div v-else class="text-center py-12">
    <p class="text-gray-500">未找到该汉字</p>
    <RouterLink to="/learn/characters" class="text-primary-500 hover:underline">
      返回字表
    </RouterLink>
  </div>
</template>
