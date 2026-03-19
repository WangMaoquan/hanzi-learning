<script setup lang="ts">
  import { ref } from 'vue'
  import { useThemeStore, themeNames, type ThemeName } from '@/stores/theme'

  const themeStore = useThemeStore()
  const showDropdown = ref(false)

  function handleSelectTheme(theme: ThemeName) {
    themeStore.setTheme(theme)
    showDropdown.value = false
  }
</script>

<template>
  <div class="relative">
    <!-- 主题切换按钮 -->
    <button
      class="flex items-center gap-2 px-3 py-2 rounded-lg bg-[var(--color-surface)]/80 backdrop-blur-sm border border-[var(--color-secondary-200)] hover:bg-[var(--color-surface)] hover:shadow-md transition-all duration-200"
      @click="showDropdown = !showDropdown"
    >
      <span class="text-lg">{{ themeNames.find((t) => t.value === themeStore.theme)?.icon }}</span>
      <span class="text-sm text-[var(--color-secondary-700)] hidden sm:inline">{{
        themeNames.find((t) => t.value === themeStore.theme)?.label
      }}</span>
      <svg
        class="w-4 h-4 text-[var(--color-secondary-400)]"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M19 9l-7 7-7-7"
        />
      </svg>
    </button>

    <!-- 下拉菜单 -->
    <Transition
      enter-active-class="transition ease-out duration-100"
      enter-from-class="transform opacity-0 scale-95"
      enter-to-class="transform opacity-100 scale-100"
      leave-active-class="transition ease-in duration-75"
      leave-from-class="transform opacity-100 scale-100"
      leave-to-class="transform opacity-0 scale-95"
    >
      <div
        v-if="showDropdown"
        class="absolute right-0 mt-2 w-48 bg-[var(--color-surface)] rounded-xl shadow-lg border border-[var(--color-secondary-100)] py-1 z-50"
      >
        <button
          v-for="theme in themeNames"
          :key="theme.value"
          class="w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-[var(--color-secondary-50)] transition-colors"
          :class="themeStore.theme === theme.value ? 'bg-[var(--color-secondary-50)]' : ''"
          @click="handleSelectTheme(theme.value)"
        >
          <span class="text-lg">{{ theme.icon }}</span>
          <span class="text-sm text-[var(--color-secondary-700)]">{{ theme.label }}</span>
          <svg
            v-if="themeStore.theme === theme.value"
            class="w-4 h-4 text-primary-600 ml-auto"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fill-rule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clip-rule="evenodd"
            />
          </svg>
        </button>
      </div>
    </Transition>

    <!-- 点击外部关闭 -->
    <div
      v-if="showDropdown"
      class="fixed inset-0 z-40"
      @click="showDropdown = false"
    ></div>
  </div>
</template>
