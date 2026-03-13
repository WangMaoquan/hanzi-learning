# 汉字学习平台

一个趣味学习中华文化的在线平台，帮助孩子轻松掌握汉字、古诗、文言文和成语。

## 技术栈

- **前端框架**: Vue 3.5 + TypeScript
- **构建工具**: Vite 5
- **样式方案**: Tailwind CSS 4.x（使用 @tailwindcss/vite 插件）
- **状态管理**: Pinia
- **架构模式**: Monorepo (pnpm workspace + Turbo)
- **代码规范**: ESLint 9 + Prettier
- **汉字动画**: Hanzi Writer

## 关键文件

| 文件 | 说明 |
|------|------|
| `apps/web/vite.config.ts` | Vite 配置，包含 Tailwind 4.x 插件 |
| `apps/web/src/router/index.ts` | 路由配置 |
| `apps/web/src/main.ts` | 应用入口 |
| `apps/web/src/styles/main.css` | Tailwind 4.x 样式入口 |
| `packages/hanzi-vue/src/index.ts` | Hanzi Writer Vue 封装 |

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
# 安装依赖（必须在根目录）
pnpm install

# 启动开发服务器（根目录运行）
pnpm dev

# 构建所有包
pnpm build

# 预览构建结果
pnpm preview

# 代码检查
pnpm lint

# 代码格式化
pnpm format

# 清理 node_modules 和 dist
pnpm clean
```

## 常见问题 (Gotchas)

1. **Tailwind CSS 4.x**: 使用 `@tailwindcss/vite` 插件，CSS 中使用 `@import "tailwindcss"`，无需 `tailwind.config.js`
2. **Hanzi Writer**: 笔画数据需要网络加载，离线环境可能无法显示动画
3. **Monorepo 依赖**: 使用 `workspace:*` 协议，添加新包后需重新 `pnpm install`
4. **开发服务器端口**: 默认 3000 端口

## 内容数据

内容数据存放在 `packages/data/src/content/` 目录下：
- `characters/` - 汉字数据
- `poems/` - 古诗数据
- `prose/` - 文言文数据（待扩展）
- `idioms/` - 成语数据（待扩展）

## 后端规划

### 技术选型

| 层级 | 推荐方案 |
|------|----------|
| **运行时** | Node.js 20+ 或 Bun |
| **框架** | Fastify / NestJS / Hono |
| **数据库** | PostgreSQL + Prisma ORM |
| **认证** | JWT / NextAuth.js |
| **API 风格** | RESTful + GraphQL（可选） |

### 数据库设计

```sql
-- 用户表
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR(255) UNIQUE,
  password_hash VARCHAR(255),
  nickname VARCHAR(100),
  avatar_url VARCHAR(500),
  role VARCHAR(20) DEFAULT 'student', -- student, teacher, admin
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 学习进度表
CREATE TABLE learning_progress (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  content_type VARCHAR(20), -- character, poem, prose, idiom
  content_id VARCHAR(50),
  status VARCHAR(20), -- not_started, in_progress, completed
  score INTEGER,
  completed_at TIMESTAMP,
  last_accessed_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, content_type, content_id)
);

-- 用户收藏表
CREATE TABLE favorites (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  content_type VARCHAR(20),
  content_id VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW()
);

-- 学习记录表（用于统计）
CREATE TABLE learning_records (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  action VARCHAR(50), -- read, practice, complete
  content_type VARCHAR(20),
  content_id VARCHAR(50),
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### API 设计

```
API 基础路径: /api/v1

# 认证
POST   /api/v1/auth/register     # 注册
POST   /api/v1/auth/login        # 登录
POST   /api/v1/auth/refresh      # 刷新 Token
POST   /api/v1/auth/logout       # 登出

# 用户
GET    /api/v1/users/me          # 获取当前用户信息
PATCH  /api/v1/users/me          # 更新用户信息

# 内容（公开）
GET    /api/v1/characters       # 汉字列表
GET    /api/v1/characters/:id   # 汉字详情
GET    /api/v1/poems            # 古诗列表
GET    /api/v1/poems/:id        # 古诗详情
GET    /api/v1/prose            # 文言文列表
GET    /api/v1/idioms           # 成语列表

# 学习进度（需认证）
GET    /api/v1/progress         # 获取学习进度
POST   /api/v1/progress         # 更新学习进度
GET    /api/v1/progress/stats   # 学习统计

# 收藏（需认证）
GET    /api/v1/favorites        # 获取收藏列表
POST   /api/v1/favorites        # 添加收藏
DELETE /api/v1/favorites/:id    # 取消收藏
```

### 目录结构（后端）

```
apps/
└── server/                     # Node.js 服务端
    ├── src/
    │   ├── modules/
    │   │   ├── auth/           # 认证模块
    │   │   ├── user/           # 用户模块
    │   │   ├── content/        # 内容模块
    │   │   └── progress/       # 学习进度模块
    │   ├── common/             # 公共模块
    │   │   ├── decorators/    # 装饰器
    │   │   ├── filters/       # 异常过滤器
    │   │   └── interceptors/  # 拦截器
    │   ├── config/             # 配置文件
    │   ├── database/           # 数据库相关
    │   │   ├── migrations/    # 数据库迁移
    │   │   └── seeders/       # 种子数据
    │   └── main.ts            # 入口文件
    ├── prisma/
    │   └── schema.prisma      # Prisma 模型定义
    └── package.json
```

### 部署建议

| 组件 | 推荐平台 |
|------|----------|
| 前端 | Vercel / Netlify |
| 后端 | Railway / Render / 阿里云 FC |
| 数据库 | Neon / Supabase / 阿里云 RDS |
| 对象存储 | 阿里云 OSS / 腾讯云 COS |
| CDN | 阿里云 CDN / 腾讯云 CDN |

### 服务端演进路线

1. **阶段一**：使用当前 JSON 数据，后续接入后端 API
2. **阶段二**：搭建基础服务端，实现用户认证和进度同步
3. **阶段三**：接入 Headless CMS 管理内容
4. **阶段四**：添加 AI 功能（语音评测、个性化推荐）

## 许可证

MIT
