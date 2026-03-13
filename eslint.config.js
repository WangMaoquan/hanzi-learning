import base from './tooling/eslint-config/src/base.js'
import vue from './tooling/eslint-config/src/vue.js'

export default [
  // packages 下所有包的配置 (纯 TypeScript)
  {
    name: '@hanzi-learning/packages',
    files: ['packages/**/*.{js,ts}'],
  },
  ...base,

  // apps/web 的配置 (Vue + TypeScript)
  {
    name: '@hanzi-learning/web',
    files: ['apps/web/**/*.{js,ts,vue,tsx}'],
  },
  ...vue,
]
