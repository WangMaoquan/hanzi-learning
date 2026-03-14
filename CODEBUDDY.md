# 汉字学习平台

趣味学习中华文化的在线平台，帮助孩子掌握汉字、古诗、文言文和成语。

## 技术栈

| 层级     | 技术                                 |
| -------- | ------------------------------------ |
| 前端     | Vue 3.5 + TypeScript + Vite 5        |
| 样式     | Tailwind CSS 4.x (@tailwindcss/vite) |
| 状态     | Pinia                                |
| 汉字动画 | hanzi-writer                         |
| 后端     | NestJS + Prisma + PostgreSQL         |
| 架构     | Monorepo (pnpm workspace + Turbo)    |
| 代码规范 | ESLint 9 + Prettier                  |

## 快速开始

```bash
# 安装依赖（根目录）
pnpm install

# 启动前端开发服务器（端口 3000）
pnpm dev

# 启动后端服务
cd apps/server && pnpm dev

# 构建所有包
pnpm build

# 代码检查
pnpm lint

# 代码格式化
pnpm format
```

## 项目结构

```
hanzi-learning/
├── apps/
│   ├── web/              # Vue 3 前端应用
│   └── server/           # NestJS 后端服务
├── packages/
│   ├── data/            # 内容数据（汉字、古诗）
│   ├── hanzi-vue/       # Hanzi Writer Vue 封装
│   ├── types/           # TypeScript 类型定义
│   ├── ui/              # 通用 UI 组件
│   └── utils/           # 工具函数
└── tooling/
    ├── eslint-config/
    ├── prettier-config/
    └── tsconfig/
```

## 关键文件

| 文件                               | 说明                         |
| ---------------------------------- | ---------------------------- |
| `apps/web/vite.config.ts`          | Vite 配置（含 Tailwind 4.x） |
| `apps/web/src/router/index.ts`     | 路由配置                     |
| `apps/web/src/main.ts`             | 前端入口                     |
| `apps/web/src/styles/main.css`     | Tailwind 样式入口            |
| `packages/hanzi-vue/src/index.ts`  | 笔顺动画封装                 |
| `packages/data/src/content/`       | 学习内容数据                 |
| `apps/server/prisma/schema.prisma` | 数据库模型                   |
| `apps/server/src/main.ts`          | 后端入口                     |

## 常见问题

1. **Tailwind CSS 4.x**: 使用 `@tailwindcss/vite` 插件，CSS 用 `@import "tailwindcss"`，无需 `tailwind.config.js`
2. **Hanzi Writer**: 笔画数据需网络加载，离线环境可能无法显示
3. **Monorepo**: 使用 `workspace:*` 协议，添加新包后需重新 `pnpm install`
4. **开发端口**: 前端默认 3000，后端默认 3001

## 数据位置

- 汉字数据: `packages/data/src/content/characters/`
- 古诗数据: `packages/data/src/content/poems/`
- 类型定义: `packages/types/src/index.ts`

## 详细文档

- [后端设计](./docs/backend.md) - 数据库、API、部署
- [产品路线图](./docs/evolution.md) - 演进计划
