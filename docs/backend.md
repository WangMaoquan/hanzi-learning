# 后端技术选型

## 技术栈

| 层级     | 推荐方案                |
| -------- | ----------------------- |
| 运行时   | Node.js 20+ 或 Bun      |
| 框架     | NestJS                  |
| 数据库   | PostgreSQL + Prisma ORM |
| 认证     | JWT                     |
| API 风格 | RESTful                 |

---

# 数据库设计

## 表结构

```sql
-- 用户表
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR(255) UNIQUE,
  password_hash VARCHAR(255),
  nickname VARCHAR(100),
  avatar_url VARCHAR(500),
  role VARCHAR(20) DEFAULT 'student',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 学习进度表
CREATE TABLE learning_progress (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  content_type VARCHAR(20),
  content_id VARCHAR(50),
  status VARCHAR(20),
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

-- 学习记录表
CREATE TABLE learning_records (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  action VARCHAR(50),
  content_type VARCHAR(20),
  content_id VARCHAR(50),
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

# API 设计

## 基础路径

`/api/v1`

## 认证接口

| 方法 | 路径                  | 说明       |
| ---- | --------------------- | ---------- |
| POST | /api/v1/auth/register | 注册       |
| POST | /api/v1/auth/login    | 登录       |
| POST | /api/v1/auth/refresh  | 刷新 Token |
| POST | /api/v1/auth/logout   | 登出       |

## 用户接口

| 方法  | 路径             | 说明             |
| ----- | ---------------- | ---------------- |
| GET   | /api/v1/users/me | 获取当前用户信息 |
| PATCH | /api/v1/users/me | 更新用户信息     |

## 内容接口（公开）

| 方法 | 路径                   | 说明       |
| ---- | ---------------------- | ---------- |
| GET  | /api/v1/characters     | 汉字列表   |
| GET  | /api/v1/characters/:id | 汉字详情   |
| GET  | /api/v1/poems          | 古诗列表   |
| GET  | /api/v1/poems/:id      | 古诗详情   |
| GET  | /api/v1/prose          | 文言文列表 |
| GET  | /api/v1/idioms         | 成语列表   |

## 学习进度接口（需认证）

| 方法 | 路径                   | 说明         |
| ---- | ---------------------- | ------------ |
| GET  | /api/v1/progress       | 获取学习进度 |
| POST | /api/v1/progress       | 更新学习进度 |
| GET  | /api/v1/progress/stats | 学习统计     |

## 收藏接口（需认证）

| 方法   | 路径                  | 说明         |
| ------ | --------------------- | ------------ |
| GET    | /api/v1/favorites     | 获取收藏列表 |
| POST   | /api/v1/favorites     | 添加收藏     |
| DELETE | /api/v1/favorites/:id | 取消收藏     |

---

# 部署建议

| 组件     | 推荐平台                     |
| -------- | ---------------------------- |
| 前端     | Vercel / Netlify             |
| 后端     | Railway / Render / 阿里云 FC |
| 数据库   | Neon / Supabase / 阿里云 RDS |
| 对象存储 | 阿里云 OSS / 腾讯云 COS      |
| CDN      | 阿里云 CDN / 腾讯云 CDN      |
