<script setup lang="ts">
  import { ref, computed, onMounted, watch } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { getCharacter, getCharacterNeighbors, type Character } from '@/services/api'
  import { useHanziWriter } from '@hanzi-learning/hanzi-vue'
  import { Card, Empty, BackLink, Skeleton } from '@hanzi-learning/ui'

  const route = useRoute()
  const router = useRouter()

  const loading = ref(true)
  const character = ref<Character | null>(null)
  const prevCharacter = ref<Character | null>(null)
  const nextCharacter = ref<Character | null>(null)
  const writerContainer = ref<HTMLElement | null>(null)

  // 只有当 character 有值时才初始化笔顺动画
  const writerComputed = computed(() => character.value?.title || '')
  const shouldShowWriter = computed(() => !!character.value?.title)

  const { animateCharacter } = useHanziWriter(writerComputed, writerContainer)

  // 获取数据
  async function fetchData() {
    try {
      loading.value = true
      const id = route.params.id as string
      if (!id) return

      // 并行请求详情和相邻汉字
      const [charRes, neighborsRes] = await Promise.all([
        getCharacter(id),
        getCharacterNeighbors(id),
      ])

      character.value = charRes.data
      prevCharacter.value = neighborsRes.data.prev
      nextCharacter.value = neighborsRes.data.next
    } catch {
      // API 拦截器已处理错误提示
    } finally {
      loading.value = false
    }
  }

  // 监听路由参数变化
  watch(
    () => route.params.id,
    () => {
      fetchData()
    }
  )

  onMounted(() => {
    fetchData()
  })
</script>

<template>
  <!-- 骨架屏 -->
  <div
    v-if="loading"
    class="min-h-screen pb-12 bg-[var(--color-secondary-50)]"
  >
    <div class="max-w-6xl mx-auto px-4 pt-6">
      <div class="mb-6">
        <Skeleton
          width="100"
          height="24"
        />
      </div>
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- 左侧 -->
        <Card>
          <div class="flex items-center justify-center h-48 rounded-xl mb-6 bg-[var(--color-primary-50)]">
            <Skeleton
              width="160"
              height="144"
            />
          </div>
          <div class="mb-6">
            <Skeleton
              width="100"
              height="24"
              class="mb-4"
            />
            <Skeleton
              width="100%"
              height="200"
            />
          </div>
          <div class="flex justify-center mb-6">
            <Skeleton
              width="140"
              height="44"
            />
          </div>
          <div class="flex justify-between pt-4 border-t border-[var(--color-secondary-200)]">
            <Skeleton
              width="80"
              height="44"
            />
            <Skeleton
              width="80"
              height="44"
            />
          </div>
        </Card>
        <!-- 右侧 -->
        <div class="space-y-6">
          <Card>
            <Skeleton
              width="120"
              height="28"
              class="mb-5"
            />
            <div class="space-y-4">
              <Skeleton
                width="80"
                height="40"
              />
              <Skeleton
                width="100%"
                height="60"
              />
              <div class="flex gap-3">
                <Skeleton
                  width="60"
                  height="36"
                />
                <Skeleton
                  width="80"
                  height="36"
                />
                <Skeleton
                  width="80"
                  height="36"
                />
              </div>
            </div>
          </Card>
          <Card>
            <Skeleton
              width="80"
              height="28"
              class="mb-5"
            />
            <div class="flex flex-wrap gap-3">
              <Skeleton
                width="60"
                height="36"
              />
              <Skeleton
                width="80"
                height="36"
              />
              <Skeleton
                width="60"
                height="36"
              />
            </div>
          </Card>
        </div>
      </div>
    </div>
  </div>

  <div
    v-else-if="character"
    class="min-h-screen pb-12 bg-[var(--color-secondary-50)]"
  >
    <div class="max-w-6xl mx-auto px-4 pt-6">
      <!-- 返回链接 -->
      <div class="mb-6">
        <BackLink
          to="/learn/characters"
          text="返回字表"
        />
      </div>
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- 左侧：汉字展示 -->
        <Card
          hoverable
          class="border-2 border-primary-700"
        >
          <!-- 汉字大字展示 -->
          <div
            class="flex items-center justify-center h-48 rounded-xl mb-6 bg-[var(--color-primary-50)]"
          >
            <span class="text-9xl font-bold text-[var(--color-secondary-900)]">{{
              character.title
            }}</span>
          </div>

          <!-- 笔顺动画 -->
          <div class="mb-6">
            <h3
              class="text-lg font-semibold mb-4 flex items-center gap-2 text-[var(--color-secondary-900)] font-serif"
            >
              <span class="w-2 h-2 rounded-full bg-[var(--color-primary-700)]"></span>
              笔顺动画
            </h3>
            <div
              v-show="shouldShowWriter"
              ref="writerContainer"
              class="rounded-xl p-4 bg-[var(--color-secondary-50)]"
            ></div>
          </div>

          <!-- 动画控制 -->
          <div class="flex justify-center mb-6">
            <button
              class="px-6 py-2.5 font-medium rounded-xl transition-colors shadow-sm hover:shadow bg-[var(--color-primary-700)] text-white"
              @click="animateCharacter()"
            >
              重新播放笔顺
            </button>
          </div>

          <!-- 导航 -->
          <div class="flex justify-between pt-4 border-t border-[var(--color-secondary-200)]">
            <button
              v-if="prevCharacter"
              class="px-4 py-2.5 bg-[var(--color-surface)] rounded-xl border border-[var(--color-secondary-200)] transition-all flex items-center gap-2 hover:border-primary-300 text-[var(--color-secondary-700)]"
              @click="router.push(`/learn/characters/${prevCharacter.id}`)"
            >
              <span class="text-[var(--color-secondary-400)]">←</span>
              <span class="font-medium">{{ prevCharacter.title }}</span>
            </button>
            <div v-else></div>
            <button
              v-if="nextCharacter"
              class="px-4 py-2.5 font-medium rounded-xl transition-all flex items-center gap-2 shadow-sm hover:shadow bg-[var(--color-primary-700)] text-white"
              @click="router.push(`/learn/characters/${nextCharacter.id}`)"
            >
              <span class="font-medium">{{ nextCharacter.title }}</span>
              <span>→</span>
            </button>
          </div>
        </Card>

        <!-- 右侧：信息 -->
        <div class="space-y-6">
          <!-- 基本信息 -->
          <Card>
            <h2
              class="text-xl font-bold mb-5 flex items-center gap-2 text-[var(--color-secondary-900)] font-serif"
            >
              <span class="w-1.5 h-6 rounded-full bg-[var(--color-primary-700)]"></span>
              基本信息
            </h2>
            <div class="space-y-4">
              <!-- 拼音 -->
              <div class="flex items-start gap-4">
                <span class="w-12 shrink-0 text-[var(--color-secondary-400)]">拼音</span>
                <span class="text-2xl font-semibold text-[var(--color-secondary-900)]">
                  {{ character.pinyin || '-' }}
                </span>
              </div>
              <!-- 释义 -->
              <div class="flex items-start gap-4">
                <span class="w-12 shrink-0 text-[var(--color-secondary-400)]">释义</span>
                <span class="leading-relaxed text-[var(--color-secondary-700)]">
                  {{ character.content || '-' }}
                </span>
              </div>
              <!-- 属性标签 -->
              <div class="flex flex-wrap gap-3 pt-2">
                <span
                  v-if="character.strokes"
                  class="px-4 py-2 font-medium rounded-lg bg-[var(--color-primary-50)] text-[var(--color-primary-700)]"
                >
                  {{ character.strokes }} 画
                </span>
                <span
                  v-if="character.structure"
                  class="px-4 py-2 font-medium rounded-lg bg-[var(--color-secondary-50)] text-[var(--color-secondary-500)]"
                >
                  {{ character.structure }}
                </span>
                <span
                  v-if="character.radicals"
                  class="px-4 py-2 font-medium rounded-lg bg-[var(--color-secondary-50)] text-[var(--color-secondary-500)]"
                >
                  部首：{{ character.radicals }}
                </span>
              </div>
            </div>
          </Card>

          <!-- 组词 -->
          <Card v-if="character.words?.length">
            <h2
              class="text-xl font-bold mb-5 flex items-center gap-2 text-[var(--color-secondary-900)] font-serif"
            >
              <span class="w-1.5 h-6 rounded-full bg-[var(--color-primary-700)]"></span>
              组词
            </h2>
            <div class="flex flex-wrap gap-3">
              <span
                v-for="word in character.words"
                :key="word"
                class="px-4 py-2 font-medium rounded-lg transition-colors cursor-pointer bg-[var(--color-secondary-50)] text-[var(--color-secondary-700)]"
              >
                {{ word }}
              </span>
            </div>
          </Card>
        </div>
      </div>
    </div>
  </div>

  <Empty
    v-else
    description="未找到该汉字"
  >
    <RouterLink
      to="/learn/characters"
      class="text-[var(--color-primary-700)]"
    >
      返回字表
    </RouterLink>
  </Empty>
</template>
