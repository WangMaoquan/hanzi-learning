import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/HomeView.vue'),
    },
    {
      path: '/learn',
      name: 'learn',
      component: () => import('@/views/learn/index.vue'),
      children: [
        {
          path: '',
          name: 'learn-home',
          component: () => import('@/views/learn/LearnHome.vue'),
        },
        {
          path: 'characters',
          name: 'learn-characters',
          component: () => import('@/views/learn/characters/index.vue'),
        },
        {
          path: 'characters/:id',
          name: 'character-detail',
          component: () => import('@/views/learn/characters/detail.vue'),
        },
        {
          path: 'poems',
          name: 'learn-poems',
          component: () => import('@/views/learn/poems/index.vue'),
        },
        {
          path: 'poems/:id',
          name: 'poem-detail',
          component: () => import('@/views/learn/poems/detail.vue'),
        },
        {
          path: 'prose',
          name: 'learn-prose',
          component: () => import('@/views/learn/prose/index.vue'),
        },
        {
          path: 'idioms',
          name: 'learn-idioms',
          component: () => import('@/views/learn/idioms/index.vue'),
        },
        {
          path: 'idioms/:id',
          name: 'idiom-detail',
          component: () => import('@/views/learn/idioms/detail.vue'),
        },
      ],
    },
    {
      path: '/practice',
      name: 'practice',
      component: () => import('@/views/practice/index.vue'),
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('@/views/AboutView.vue'),
    },
  ],
})

export default router
