# 汉字学习平台

一个趣味学习中华文化的在线平台，帮助孩子轻松掌握汉字、古诗、文言文和成语。

## 技术栈

- **前端框架**: Vue 3.5 + TypeScript
- **构建工具**: Vite 5
- **样式方案**: Tailwind CSS
- **状态管理**: Pinia
- **架构模式**: Monorepo (pnpm workspace + Turbo)
- **代码规范**: ESLint 9 + Prettier

## 项目结构

```
hanzi-learning/
├── apps/
│   └── web/              # Vue 3 主应用
├── packages/
│   ├── ui/               # 通用 UI 组件
│   ├── hanzi-vue/        # Hanzi Writer Vue 封装
│   ├── utils/            # 工具函数
│   ├── types/            # TypeScript 类型定义
│   └── data/             # 内容数据（汉字、古诗、文言文、成语）
└── tooling/
    ├── eslint-config/    # ESLint 配置
    ├── prettier-config/  # Prettier 配置
    └── tsconfig/         # TypeScript 配置
```

## 学习路线（演进计划）

### 阶段一：汉字学习（MVP）
- 笔顺动画演示
- 拼音、笔画数、部首、结构展示
- 组词、例句学习
- 难度分级（按年级）

### 阶段二：古诗词学习
- 经典唐诗宋词收录
- 原文、拼音、译文对照
- 注释、赏析、创作背景
- 背诵模式（挖空练习）

### 阶段三：成语学习
- 成语故事、典故出处
- 近义词、反义词
- 看图猜成语
- 成语接龙游戏

### 阶段四：文言文学习
- 初中必背文言文
- 古今对译
- 实词、虚词练习
- 文法讲解

### 阶段五：内容管理（可选）
- 引入 Headless CMS（Strapi/Sanity）
- 支持用户上传内容
- 管理员后台

## 开发指南

```bash
# 安装依赖
pnpm install

# 启动开发
pnpm dev

# 构建
pnpm build

# 代码检查
pnpm lint

# 代码格式化
pnpm format
```

## 内容数据

内容数据存放在 `packages/data/src/content/` 目录下：
- `characters/` - 汉字数据
- `poems/` - 古诗数据
- `prose/` - 文言文数据（待扩展）
- `idioms/` - 成语数据（待扩展）

## 许可证

MIT
