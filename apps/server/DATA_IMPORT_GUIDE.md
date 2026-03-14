# 数据导入指南

## 1. 下载开源数据

### chinese-xinhua (汉字、成语)

```bash
cd apps/server/data
git clone https://github.com/pwxcoo/chinese-xinhua.git
```

### chinese-poetry (古诗词)

```bash
cd apps/server/data
git clone https://github.com/chinese-poetry/chinese-poetry.git
```

## 2. 安装种子脚本依赖

```bash
cd /Users/wangmaoquan/project/hanzi-learning/apps/server
pnpm add -D @types/node ts-node
```

## 3. 运行导入脚本

```bash
cd /Users/wangmaoquan/project/hanzi-learning/apps/server
pnpm ts-node scripts/seed.ts
```

## 4. 测试 API

```bash
# 获取汉字列表
curl http://localhost:3001/api/v1/characters

# 获取成语列表
curl http://localhost:3001/api/v1/idioms

# 获取古诗列表
curl http://localhost:3001/api/v1/poems
```
