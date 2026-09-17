# 角色扮演聊天 Agent

React + Express + Claude API 的角色扮演聊天应用,支持流式回复和长对话记忆摘要。

## 技术栈
- 前端:React + TypeScript + Vite
- 后端:Node.js + Express + TypeScript
- 数据库:SQLite + Prisma ORM
- AI:Anthropic Claude API(流式响应)

## 目录结构
```
roleplay-agent/
├── backend/     # Express API,负责调用 Claude 与持久化对话
└── frontend/    # React 聊天界面
```

## 启动步骤

### 1. 后端
```bash
cd backend
npm install
copy .env.example .env
```
编辑 `.env`,填入你的 `ANTHROPIC_API_KEY`。

```bash
npx prisma migrate dev --name init
npx prisma db seed
npm run dev
```
后端默认运行在 http://localhost:3001

### 2. 前端
```bash
cd frontend
npm install
npm run dev
```
前端默认运行在 http://localhost:5173,通过 Vite 代理转发 `/api` 请求到后端。

## 核心功能
- 角色选择:内置两个预设角色(林晚、阿树),人设定义在 `backend/src/characters/presets.ts`
- 流式对话:后端通过 SSE 将 Claude 的回复逐字推给前端
- 长期记忆:对话超过阈值后自动摘要旧消息,压缩进 system prompt,避免上下文无限增长

## 扩展方向
- 用户账号系统(JWT 鉴权)
- 自定义角色创建界面
- Docker 化部署
