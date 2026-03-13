import base from './base.js'
import tseslint from 'typescript-eslint'

export default [
  ...base,
  ...tseslint.configs.recommended,
  {
    name: '@hanzi-learning/nestjs',
    files: ['**/*.js', '**/*.ts'],
    languageOptions: {
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: undefined,
      },
    },
    rules: {
      // NestJS/DI 相关
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/ban-ts-comment': 'off',

      // Node.js 相关
      'no-console': 'off',
      'node/no-process-exit': 'off',

      // 允许 __ 开头
      'no-underscore-dangle': 'off',
    },
  },
]
