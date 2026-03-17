import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export type ThemeName = 'chinese' | 'cute' | 'classical' | 'nature' | 'starry'

// 主题配色映射 - 完整版
const themeColors: Record<ThemeName, Record<string, string>> = {
  chinese: {
    // 主色 - 中国红系
    '--color-primary-50': '#FEF2F2',
    '--color-primary-100': '#FEE2E2',
    '--color-primary-200': '#FECACA',
    '--color-primary-300': '#FCA5A5',
    '--color-primary-400': '#F87171',
    '--color-primary-500': '#EF4444',
    '--color-primary-600': '#DC2626',
    '--color-primary-700': '#C41E3A',
    '--color-primary-800': '#9B2C2C',
    '--color-primary-900': '#7F1D1D',

    // 辅助色 - 深靛蓝
    '--color-secondary-50': '#F8FAFC',
    '--color-secondary-100': '#F1F5F9',
    '--color-secondary-200': '#E2E8F0',
    '--color-secondary-300': '#CBD5E1',
    '--color-secondary-400': '#94A3B8',
    '--color-secondary-500': '#64748B',
    '--color-secondary-600': '#475569',
    '--color-secondary-700': '#334155',
    '--color-secondary-800': '#1E293B',
    '--color-secondary-900': '#0F172A',
    '--color-secondary-950': '#1A1A2E',

    // 金色点缀
    '--color-gold-50': '#FFFBEB',
    '--color-gold-100': '#FEF3C7',
    '--color-gold-200': '#FDE68A',
    '--color-gold-300': '#FCD34D',
    '--color-gold-400': '#FBBF24',
    '--color-gold-500': '#D4AF37',
    '--color-gold-600': '#B4941F',

    // 品牌色
    '--color-brand-primary': '#C41E3A',
    '--color-brand-secondary': '#1A1A2E',

    // 背景/表面
    '--color-background': '#F5F5F0',
    '--color-surface': '#FFFFFF',

    // 渐变色
    '--color-gradient-from': '#FEF2F2',
    '--color-gradient-via': '#FFFFFF',
    '--color-gradient-to': '#FEE2E2',

    // 点缀色（用于成语页面等特殊场景）
    '--color-accent-50': '#FFFBEB',
    '--color-accent-100': '#FEF3C7',
    '--color-accent-200': '#FDE68A',
    '--color-accent-300': '#FCD34D',
    '--color-accent-400': '#FBBF24',
    '--color-accent-500': '#D4AF37',
    '--color-accent-600': '#B4941F',
    '--color-accent-700': '#926918',
    '--color-accent-800': '#713912',

    // 阴影色
    '--color-shadow': 'rgba(0, 0, 0, 0.1)',
    '--color-shadow-lg': 'rgba(0, 0, 0, 0.15)',

    // 交互色
    '--color-focus-ring': 'rgba(196, 30, 58, 0.2)',
    '--color-hover-bg': 'rgba(196, 30, 58, 0.05)',
  },
  cute: {
    // 主色 - 柔和粉橙
    '--color-primary-50': '#FEF3F3',
    '--color-primary-100': '#FDE8E8',
    '--color-primary-200': '#FCD5D5',
    '--color-primary-300': '#FBBFBF',
    '--color-primary-400': '#F89F9F',
    '--color-primary-500': '#F47D7D',
    '--color-primary-600': '#E86565',
    '--color-primary-700': '#D94747',
    '--color-primary-800': '#B53838',
    '--color-primary-900': '#8B2A2A',

    // 辅助色 - 柔和粉
    '--color-secondary-50': '#FFF5F5',
    '--color-secondary-100': '#FFE8E8',
    '--color-secondary-200': '#FFD5D5',
    '--color-secondary-300': '#FFBDBD',
    '--color-secondary-400': '#FF9E9E',
    '--color-secondary-500': '#FF7D7D',
    '--color-secondary-600': '#E65555',
    '--color-secondary-700': '#CC3D3D',
    '--color-secondary-800': '#A32D2D',
    '--color-secondary-900': '#7A2222',
    '--color-secondary-950': '#4A1515',

    // 金色点缀 - 橙色系
    '--color-gold-50': '#FFF8F0',
    '--color-gold-100': '#FFF0E0',
    '--color-gold-200': '#FFE0C0',
    '--color-gold-300': '#FFCC99',
    '--color-gold-400': '#FFB366',
    '--color-gold-500': '#FF9933',
    '--color-gold-600': '#E68000',

    // 品牌色
    '--color-brand-primary': '#FF7D7D',
    '--color-brand-secondary': '#FFB366',

    // 背景/表面
    '--color-background': '#FFF5F5',
    '--color-surface': '#FFFFFF',

    // 渐变色
    '--color-gradient-from': '#FFF5F5',
    '--color-gradient-via': '#FFFFFF',
    '--color-gradient-to': '#FFE8E8',

    // 点缀色
    '--color-accent-50': '#FFF8F0',
    '--color-accent-100': '#FFF0E0',
    '--color-accent-200': '#FFE0C0',
    '--color-accent-300': '#FFCC99',
    '--color-accent-400': '#FFB366',
    '--color-accent-500': '#FF9933',
    '--color-accent-600': '#E68000',
    '--color-accent-700': '#CC7000',
    '--color-accent-800': '#A35A00',

    // 阴影色
    '--color-shadow': 'rgba(255, 125, 125, 0.15)',
    '--color-shadow-lg': 'rgba(255, 125, 125, 0.2)',

    // 交互色
    '--color-focus-ring': 'rgba(255, 125, 125, 0.2)',
    '--color-hover-bg': 'rgba(255, 125, 125, 0.08)',
  },
  classical: {
    // 主色 - 墨灰系
    '--color-primary-50': '#F5F5F5',
    '--color-primary-100': '#EBEBEB',
    '--color-primary-200': '#D9D9D9',
    '--color-primary-300': '#C4C4C4',
    '--color-primary-400': '#A8A8A8',
    '--color-primary-500': '#8C8C8C',
    '--color-primary-600': '#6B6B6B',
    '--color-primary-700': '#4A4A4A',
    '--color-primary-800': '#333333',
    '--color-primary-900': '#1F1F1F',

    // 辅助色 - 深灰
    '--color-secondary-50': '#F8F8F8',
    '--color-secondary-100': '#F0F0F0',
    '--color-secondary-200': '#E0E0E0',
    '--color-secondary-300': '#C8C8C8',
    '--color-secondary-400': '#A8A8A8',
    '--color-secondary-500': '#888888',
    '--color-secondary-600': '#686868',
    '--color-secondary-700': '#484848',
    '--color-secondary-800': '#2D2D2D',
    '--color-secondary-900': '#1A1A1A',
    '--color-secondary-950': '#0D0D0D',

    // 金色点缀 - 古铜色
    '--color-gold-50': '#FDF8F0',
    '--color-gold-100': '#FAF0E0',
    '--color-gold-200': '#F5E0C8',
    '--color-gold-300': '#ECC9A8',
    '--color-gold-400': '#E0B088',
    '--color-gold-500': '#D49966',
    '--color-gold-600': '#B8824D',

    // 品牌色
    '--color-brand-primary': '#4A4A4A',
    '--color-brand-secondary': '#1A1A1A',

    // 背景/表面
    '--color-background': '#F5F5F0',
    '--color-surface': '#FAFAFA',

    // 渐变色
    '--color-gradient-from': '#F5F5F5',
    '--color-gradient-via': '#FAFAFA',
    '--color-gradient-to': '#F0F0F0',

    // 点缀色
    '--color-accent-50': '#FDF8F0',
    '--color-accent-100': '#FAF0E0',
    '--color-accent-200': '#F5E0C8',
    '--color-accent-300': '#ECC9A8',
    '--color-accent-400': '#E0B088',
    '--color-accent-500': '#D49966',
    '--color-accent-600': '#B8824D',
    '--color-accent-700': '#8A6639',
    '--color-accent-800': '#5C4526',

    // 阴影色
    '--color-shadow': 'rgba(0, 0, 0, 0.08)',
    '--color-shadow-lg': 'rgba(0, 0, 0, 0.12)',

    // 交互色
    '--color-focus-ring': 'rgba(74, 74, 74, 0.15)',
    '--color-hover-bg': 'rgba(74, 74, 74, 0.05)',
  },
  nature: {
    // 主色 - 清新绿
    '--color-primary-50': '#ECFDF5',
    '--color-primary-100': '#D1FAE5',
    '--color-primary-200': '#A7F3D0',
    '--color-primary-300': '#6EE7B7',
    '--color-primary-400': '#34D399',
    '--color-primary-500': '#10B981',
    '--color-primary-600': '#059669',
    '--color-primary-700': '#047857',
    '--color-primary-800': '#065F46',
    '--color-primary-900': '#064E3B',

    // 辅助色 - 翠绿
    '--color-secondary-50': '#F0FDF4',
    '--color-secondary-100': '#DCFCE7',
    '--color-secondary-200': '#BBF7D0',
    '--color-secondary-300': '#86EFAC',
    '--color-secondary-400': '#4ADE80',
    '--color-secondary-500': '#22C55E',
    '--color-secondary-600': '#16A34A',
    '--color-secondary-700': '#15803D',
    '--color-secondary-800': '#166534',
    '--color-secondary-900': '#14532D',
    '--color-secondary-950': '#052E16',

    // 金色点缀 - 黄色
    '--color-gold-50': '#FEFCE8',
    '--color-gold-100': '#FEF9C3',
    '--color-gold-200': '#FEF08A',
    '--color-gold-300': '#FDE047',
    '--color-gold-400': '#FACC15',
    '--color-gold-500': '#EAB308',
    '--color-gold-600': '#CA8A04',

    // 品牌色
    '--color-brand-primary': '#059669',
    '--color-brand-secondary': '#14532D',

    // 背景/表面
    '--color-background': '#F0FDF4',
    '--color-surface': '#FFFFFF',

    // 渐变色
    '--color-gradient-from': '#ECFDF5',
    '--color-gradient-via': '#FFFFFF',
    '--color-gradient-to': '#D1FAE5',

    // 点缀色
    '--color-accent-50': '#FEFCE8',
    '--color-accent-100': '#FEF9C3',
    '--color-accent-200': '#FEF08A',
    '--color-accent-300': '#FDE047',
    '--color-accent-400': '#FACC15',
    '--color-accent-500': '#EAB308',
    '--color-accent-600': '#CA8A04',
    '--color-accent-700': '#A16C03',
    '--color-accent-800': '#785002',

    // 阴影色
    '--color-shadow': 'rgba(5, 150, 105, 0.1)',
    '--color-shadow-lg': 'rgba(5, 150, 105, 0.15)',

    // 交互色
    '--color-focus-ring': 'rgba(5, 150, 105, 0.2)',
    '--color-hover-bg': 'rgba(5, 150, 105, 0.05)',
  },
  starry: {
    // 主色 - 星空蓝紫
    '--color-primary-50': '#EEF2FF',
    '--color-primary-100': '#E0E7FF',
    '--color-primary-200': '#C7D2FE',
    '--color-primary-300': '#A5B4FC',
    '--color-primary-400': '#818CF8',
    '--color-primary-500': '#6366F1',
    '--color-primary-600': '#4F46E5',
    '--color-primary-700': '#4338CA',
    '--color-primary-800': '#3730A3',
    '--color-primary-900': '#312E81',

    // 辅助色 - 深靛蓝
    '--color-secondary-50': '#FAFBFF',
    '--color-secondary-100': '#F0F4FF',
    '--color-secondary-200': '#E0E7FF',
    '--color-secondary-300': '#C7D2FE',
    '--color-secondary-400': '#A5B4FC',
    '--color-secondary-500': '#818CF8',
    '--color-secondary-600': '#6366F1',
    '--color-secondary-700': '#4F46E5',
    '--color-secondary-800': '#4338CA',
    '--color-secondary-900': '#3730A3',
    '--color-secondary-950': '#1E1B4B',

    // 金色点缀 - 琥珀色（深色背景下更醒目）
    '--color-gold-50': '#FEF3C7',
    '--color-gold-100': '#FDE68A',
    '--color-gold-200': '#FCD34D',
    '--color-gold-300': '#FBBF24',
    '--color-gold-400': '#F59E0B',
    '--color-gold-500': '#D97706',
    '--color-gold-600': '#B45309',

    // 品牌色
    '--color-brand-primary': '#6366F1',
    '--color-brand-secondary': '#1E1B4B',

    // 背景/表面 - 深色
    '--color-background': '#0F172A',
    '--color-surface': '#1E293B',

    // 渐变色
    '--color-gradient-from': '#1E293B',
    '--color-gradient-via': '#0F172A',
    '--color-gradient-to': '#1E1B4B',

    // 点缀色 - 深色模式下更亮
    '--color-accent-50': '#1E293B',
    '--color-accent-100': '#312E81',
    '--color-accent-200': '#4338CA',
    '--color-accent-300': '#818CF8',
    '--color-accent-400': '#A5B4FC',
    '--color-accent-500': '#C7D2FE',
    '--color-accent-600': '#E0E7FF',
    '--color-accent-700': '#E2E8F0',
    '--color-accent-800': '#F1F5F9',

    // 阴影色 - 深色模式使用更亮的阴影
    '--color-shadow': 'rgba(0, 0, 0, 0.3)',
    '--color-shadow-lg': 'rgba(0, 0, 0, 0.4)',

    // 交互色
    '--color-focus-ring': 'rgba(99, 102, 241, 0.3)',
    '--color-hover-bg': 'rgba(99, 102, 241, 0.1)',
  },
}

export const themeNames: { value: ThemeName; label: string; icon: string }[] = [
  { value: 'chinese', label: '现代简约中国风', icon: '🏮' },
  { value: 'cute', label: '温馨可爱风', icon: '🌸' },
  { value: 'classical', label: '古典深邃风', icon: '📜' },
  { value: 'nature', label: '清新自然风', icon: '🌿' },
  { value: 'starry', label: '星空深邃风', icon: '✨' },
]

export const useThemeStore = defineStore('theme', () => {
  const theme = ref<ThemeName>('chinese')

  // 从 localStorage 恢复主题
  const savedTheme = localStorage.getItem('theme') as ThemeName | null
  if (savedTheme && themeNames.some((t) => t.value === savedTheme)) {
    theme.value = savedTheme
  }

  // 应用主题颜色到 CSS 变量
  function applyThemeColors(themeName: ThemeName) {
    const colors = themeColors[themeName]
    const root = document.documentElement

    // 清除之前的 data-theme
    root.removeAttribute('data-theme')

    // 设置新的 data-theme
    root.setAttribute('data-theme', themeName)

    // 设置 CSS 变量到 style 属性
    Object.entries(colors).forEach(([key, value]) => {
      root.style.setProperty(key, value)
    })
  }

  // 初始化主题颜色
  applyThemeColors(theme.value)

  // 监听主题变化
  watch(theme, (newTheme) => {
    applyThemeColors(newTheme)
    localStorage.setItem('theme', newTheme)
  })

  function setTheme(newTheme: ThemeName) {
    theme.value = newTheme
  }

  return {
    theme,
    setTheme,
    themeNames,
  }
})
