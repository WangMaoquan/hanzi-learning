<script setup lang="ts">
import { characters } from '@hanzi-learning/data'

const currentCharacter = characters[0]
</script>

<template>
  <div>
    <h1 class="text-2xl font-bold text-gray-900 mb-6">汉字学习</h1>

    <!-- 当前学习 -->
    <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
      <h2 class="text-lg font-semibold text-gray-900 mb-4">正在学习</h2>
      <div class="flex items-center gap-8">
        <div class="w-40 h-40 flex items-center justify-center bg-primary-50 rounded-xl">
          <span class="text-8xl font-bold text-gray-900">{{ currentCharacter.title }}</span>
        </div>
        <div class="flex-1">
          <div class="mb-4">
            <span class="text-gray-500 text-sm">拼音</span>
            <p class="text-xl text-gray-900">{{ currentCharacter.pinyin }}</p>
          </div>
          <div class="mb-4">
            <span class="text-gray-500 text-sm">释义</span>
            <p class="text-gray-900">{{ currentCharacter.translation }}</p>
          </div>
          <div class="flex gap-4">
            <div>
              <span class="text-gray-500 text-sm">笔画</span>
              <p class="text-gray-900">{{ currentCharacter.strokes }} 画</p>
            </div>
            <div>
              <span class="text-gray-500 text-sm">结构</span>
              <p class="text-gray-900">{{ currentCharacter.structure }}</p>
            </div>
            <div>
              <span class="text-gray-500 text-sm">部首</span>
              <p class="text-gray-900">{{ currentCharacter.radicals }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 字表 -->
    <div>
      <h2 class="text-lg font-semibold text-gray-900 mb-4">字表</h2>
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
  </div>
</template>
