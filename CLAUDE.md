# 项目简介

这是一个运行在 **Cloudflare Workers** 上的 API 服务，使用 **Hono** 框架构建。

## 技术栈

- 运行时: Cloudflare Workers
- 框架: Hono v4
- 语言: TypeScript
- 工具链: Wrangler

## 项目结构

```
src/
├── index.ts              # 入口：创建 Hono app，挂载路由
├── types.ts              # 全局类型（AppEnv、Env bindings 等）
├── routes/
│   └── index.ts          # 路由层：定义 URL 路径，映射到 controller
├── controllers/
│   └── user.controller.ts  # 控制器层：处理 HTTP 请求/响应，参数校验
├── services/
│   └── user.service.ts   # Service 层：业务逻辑，数据访问
└── models/
    └── user.model.ts     # Model 层：数据结构与类型定义
```

## 分层职责

| 层 | 文件位置 | 职责 |
|----|----------|------|
| 路由层 | `src/routes/` | 定义路径和 HTTP 方法，不含业务逻辑 |
| 控制器层 | `src/controllers/` | 解析请求参数、校验输入、返回响应 |
| Service 层 | `src/services/` | 业务逻辑、数据库/KV/R2 访问 |
| Model 层 | `src/models/` | TypeScript 接口和类型定义 |

## 开发规范

- 新增资源时，按 model → service → controller → route 顺序创建文件
- Controller 只负责 HTTP 层，业务逻辑下沉到 service
- 数据库/KV/R2 等 binding 访问统一在 service 层，通过参数传入 `env`
- 修改 `wrangler.jsonc` 中的 bindings 后，运行 `npm run cf-typegen` 更新类型
- 环境变量通过 `Env` 类型注入，敏感信息使用 `wrangler secret` 管理

## 开发命令

| 命令 | 说明 |
|------|------|
| `pnpm dev` | 本地开发（wrangler dev） |
| `pnpm deploy` | 部署到 Cloudflare |
| `pnpm cf-typegen` | 根据 wrangler.jsonc 生成 TS 类型 |

## 包管理

- 统一使用 pnpm，禁止使用 npm 或 yarn
- 安装依赖：`pnpm add <package>`
- 安装开发依赖：`pnpm add -D <package>`
