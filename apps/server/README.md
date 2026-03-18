# 汉字学习平台后端

汉字学习平台的 NestJS 后端服务，提供汉字、古诗、成语等内容的 RESTful API。

## 技术栈

| 技术       | 说明               |
| ---------- | ------------------ |
| NestJS 11  | Node.js 企业级框架 |
| Prisma 6   | TypeScript ORM     |
| PostgreSQL | 关系型数据库       |
| Pino       | 结构化日志         |
| Jest       | 单元测试           |

## 环境要求

- Node.js >= 22.17.0
- PostgreSQL 14+
- pnpm 10.32.0

## 本地开发

```bash
# 安装依赖
pnpm install

# 生成 Prisma Client
pnpm prisma:generate

# 同步数据库 schema（开发环境）
pnpm prisma:push

# 启动开发服务器
pnpm dev
```

服务启动后：

- API: http://localhost:3001
- Swagger 文档: http://localhost:3001/api/docs

## 环境变量

在 `apps/server/.env` 中配置：

```env
# 数据库连接
DATABASE_URL="postgresql://user:password@localhost:5432/hanzi_learning"

# 允许的跨域来源（逗号分隔）
ALLOWED_ORIGINS="http://localhost:3000"

# 日志级别 (trace, debug, info, warn, error, fatal)
LOG_LEVEL=debug

# Node 环境
NODE_ENV=development
```

## API 文档

### 端点概览

| 模块 | 路径                 | 说明                 |
| ---- | -------------------- | -------------------- |
| 汉字 | `/api/v1/characters` | 汉字查询、详情、随机 |
| 古诗 | `/api/v1/poems`      | 古诗查询、详情、随机 |
| 成语 | `/api/v1/idioms`     | 成语查询、详情、随机 |
| 健康 | `/api/v1/health`     | 服务健康检查         |

### 通用响应格式

**成功响应：**

```json
{
  "success": true,
  "data": { ... },
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

**错误响应：**

```json
{
  "success": false,
  "statusCode": 404,
  "message": "Resource not found",
  "error": "Not Found",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### 分页参数

所有列表接口支持分页：

| 参数  | 类型   | 默认值 | 说明     |
| ----- | ------ | ------ | -------- |
| page  | number | 1      | 页码     |
| limit | number | 20     | 每页数量 |

响应包含：

```json
{
  "data": [...],
  "total": 100,
  "page": 1,
  "limit": 20,
  "totalPages": 5
}
```

## 命令

```bash
# 开发
pnpm dev

# 构建
pnpm build

# 生产运行
pnpm start

# 测试
pnpm test

# 测试覆盖率
pnpm test:cov

# 代码检查
pnpm lint
```

## 项目结构

```
apps/server/
├── prisma/
│   └── schema.prisma    # 数据库模型
├── src/
│   ├── main.ts          # 应用入口
│   ├── app.module.ts    # 根模块
│   ├── logger/          # 日志模块
│   ├── modules/
│   │   ├── characters/  # 汉字模块
│   │   ├── poems/       # 古诗模块
│   │   ├── idioms/      # 成语模块
│   │   └── health/      # 健康检查模块
│   ├── interceptors/    # 拦截器
│   ├── filters/         # 异常过滤器
│   ├── dtos/           # 数据传输对象
│   ├── transformers/   # 数据转换
│   └── prisma/         # Prisma 服务
└── scripts/            # 脚本
```

## 部署

### Docker

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install --frozen-lockfile

COPY . .
RUN pnpm build

EXPOSE 3001
CMD ["pnpm", "start"]
```

### Docker Compose

```yaml
version: "3.8"

services:
  server:
    build: .
    ports:
      - "3001:3001"
    environment:
      - DATABASE_URL=postgresql://user:password@db:5432/hanzi_learning
    depends_on:
      - db

  db:
    image: postgres:14
    environment:
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password
      POSTGRES_DB: hanzi_learning
```

## 监控

### 健康检查

- `GET /health` - 综合健康检查
- `GET /health/live` - 存活探针
- `GET /health/ready` - 就绪探针

### 日志

开发环境使用 pino-pretty 彩色输出，生产环境输出 JSON 格式。

日志级别通过 `LOG_LEVEL` 环境变量控制。

## 许可

MIT
