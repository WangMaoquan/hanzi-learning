import nest from '@hanzi-learning/eslint-config/nest'

// 过滤掉 eslint.config.js 自身
const filteredNest = nest.map(config => {
  if (config.files) {
    return {
      ...config,
      ignores: [...(config.ignores || []), 'eslint.config.js'],
    }
  }
  return config
})

export default [
  {
    ignores: ['dist/**', 'node_modules/**', 'data/**', 'eslint.config.js'],
  },
  ...filteredNest,
]
