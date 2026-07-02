# 🎓 校园轻集市 — Campus Market

> **AI 辅助前端工程实践课程 · 7 天实训项目**
>
> 一个面向校园场景的轻量级综合服务平台，涵盖二手交易、失物招领、拼单搭子和跑腿委托四大核心业务。

---

## 📋 项目简介

校园轻集市是一个基于 **Vue 3** 的前端单页应用（SPA），为校园内的学生提供一站式的信息发布与浏览平台。项目通过 7 天实训，从项目初始化到综合验收，完整体验了现代前端工程化开发流程。

**核心业务场景：**

| 业务模块 | 说明 |
|---------|------|
| 🛒 二手交易 | 浏览、搜索、发布、收藏校园二手商品 |
| 🔍 失物招领 | 发布寻物启事和失物招领信息 |
| 🤝 拼单搭子 | 发起拼单活动，寻找搭子 |
| 🏃 跑腿委托 | 发布代取、代送、代办等委托 |

---

## 🛠 技术栈

| 类别 | 技术 | 说明 |
|------|------|------|
| 前端框架 | Vue 3 (Composition API) | 渐进式 UI 框架 |
| 开发语言 | TypeScript | 类型安全的 JavaScript 超集 |
| 构建工具 | Vite | 极速开发服务器与生产构建 |
| 状态管理 | Pinia | Vue 3 官方状态管理库 |
| 路由 | Vue Router | SPA 页面路由管理 |
| HTTP 客户端 | Axios | 基于 Promise 的 HTTP 库 |
| Mock 服务 | JSON Server | 快速搭建 RESTful Mock API |
| 包管理器 | pnpm | 高效的 Node.js 包管理器 |
| 代码规范 | ESLint + Oxlint | 双 Linter 保证代码质量 |

---

## 🚀 快速开始

### 环境要求

- Node.js ^22.18.0 或 >=24.12.0
- pnpm 11.9.0+

### 安装与启动

```bash
# 1. 克隆项目
git clone <仓库地址>
cd campus-market-seed

# 2. 安装依赖
pnpm install

# 3. 启动 Mock 服务（新终端窗口）
npm run mock

# 4. 启动前端开发服务器（另一个新终端窗口）
npm run dev
```

浏览器访问：**http://localhost:5173**

### 构建项目

```bash
npm run build
```

构建产物在 `dist/` 目录中。

---

## 📁 项目目录结构

```
campus-market-seed
├── docs/
│   ├── ai/                          # AI 协作规范与记录
│   │   └── AI_Collaboration_Card.md
│   ├── evidence/                    # 每日过程性证据卡
│   │   ├── Day1_Evidence.md         # 项目理解与环境搭建
│   │   ├── Day2_Evidence.md         # 页面骨架与路由导航
│   │   ├── Day3_Evidence.md         # Mock 数据建模与列表渲染
│   │   ├── Day4_Evidence.md         # 发布表单与数据新增
│   │   ├── Day5_Evidence.md         # 状态管理与用户中心
│   │   ├── Day6_Evidence.md         # 注册登录、状态持久化与交互优化
│   │   └── Day7_Evidence.md         # 综合验收与项目展示
│   ├── guide/                       # 学生使用指南
│   └── project/                     # 项目文档
├── public/                          # 静态资源
├── scripts/                         # 自动检测脚本
├── src/
│   ├── api/                         # API 接口层
│   │   ├── http.ts                  # Axios 实例配置
│   │   ├── trade.ts                 # 二手交易 API
│   │   ├── lostFound.ts             # 失物招领 API
│   │   ├── groupBuy.ts              # 拼单搭子 API
│   │   ├── errand.ts                # 跑腿委托 API
│   │   └── user.ts                  # 用户 API
│   ├── components/                  # 公共组件
│   │   ├── AppHeader.vue            # 顶部导航栏（含登录状态）
│   │   ├── AppLayout.vue            # 全局布局（头部 + 主体 + 页脚）
│   │   ├── AppNav.vue               # 导航菜单
│   │   ├── EmptyState.vue           # 空状态组件
│   │   ├── ErrorState.vue           # 错误状态组件（含重试按钮）
│   │   ├── FormField.vue            # 表单字段组件
│   │   ├── ItemCard.vue             # 列表卡片组件
│   │   ├── LoadingState.vue         # 加载状态组件（支持三种尺寸）
│   │   └── SearchBar.vue            # 搜索栏组件（300ms 防抖）
│   ├── router/
│   │   └── index.ts                 # 路由配置（13 个路由）
│   ├── stores/
│   │   ├── favorite.ts              # 收藏状态管理
│   │   └── user.ts                  # 用户状态管理（含 localStorage 持久化）
│   ├── views/
│   │   ├── HomeView.vue             # 首页（功能入口）
│   │   ├── TradeView.vue            # 二手交易列表页
│   │   ├── LostFoundView.vue         # 失物招领列表页
│   │   ├── GroupBuyView.vue         # 拼单搭子列表页
│   │   ├── ErrandView.vue           # 跑腿委托列表页
│   │   ├── PublishView.vue          # 信息发布页
│   │   ├── DetailView.vue           # 信息详情页
│   │   ├── ListView.vue             # 通用列表页
│   │   ├── UserCenterView.vue       # 个人中心
│   │   ├── MessageView.vue          # 消息中心
│   │   ├── LoginView.vue            # 登录页
│   │   ├── RegisterView.vue         # 注册页
│   │   └── BoardView.vue            # 留言板
│   ├── App.vue                      # 根组件
│   └── main.ts                      # 应用入口
├── db.json                          # Mock 数据文件
├── CHECK_REPORT.md                  # 项目检测报告
├── package.json                     # 项目依赖声明
├── vite.config.ts                   # Vite 构建配置
└── tsconfig.json                    # TypeScript 配置
```

---

## 📝 每日开发记录

| 天数 | 主题 | 核心内容 |
|------|------|---------|
| **Day1** | 项目启动与业务梳理 | 项目背景理解、目录分析、技术栈学习、AI 协作体验 |
| **Day2** | 页面骨架与路由导航 | 8 个页面骨架、Vue Router 配置、导航组件、公共布局 |
| **Day3** | Mock 数据建模与列表渲染 | db.json 数据设计、JSON Server 启动、API 封装、列表渲染 |
| **Day4** | 发布表单与数据新增 | PublishView 表单、表单校验、数据 POST、发布后跳转 |
| **Day5** | 状态管理与用户中心 | Pinia Store 创建、用户中心页面、收藏功能 |
| **Day6** | 交互优化与体验完善 | 注册登录、状态持久化、加载/错误/搜索组件、收藏动画 |
| **Day7** | 综合验收与项目展示 | 功能走查、构建检查、README 完善、证据归档、AI 复盘 |

---

## 🔍 核心功能说明

### 已实现功能

- ✅ 首页功能入口与公告展示
- ✅ 四大核心业务列表页（二手交易、失物招领、拼单搭子、跑腿委托）
- ✅ 列表搜索与分类筛选
- ✅ 信息发布表单（支持四种业务类型）
- ✅ 发布后自动跳转到对应列表页
- ✅ 信息详情页
- ✅ 用户注册与登录（基于 JSON Server 的 Mock 实现）
- ✅ 登录状态持久化（localStorage + Pinia）
- ✅ 收藏/取消收藏功能
- ✅ 个人中心（用户资料、收藏管理、统计数据）
- ✅ 消息中心
- ✅ 加载状态、空状态、错误状态展示
- ✅ 响应式布局

### 功能边界说明

本项目为前端实训项目，以下功能不在当前范围内：

- ❌ 真实后端服务（使用 JSON Server 模拟）
- ❌ 图片上传（使用 emoji 图标替代）
- ❌ 密码加密与 JWT Token
- ❌ 第三方登录（微信/QQ）
- ❌ 实时聊天
- ❌ 支付功能
- ❌ 后台管理
- ❌ 消息推送通知

---

## 🤖 AI 协作说明

本项目在开发过程中使用 **Claude Code**（Anthropic 官方 CLI AI Coding 工具）辅助完成页面骨架、Mock 数据、接口封装、表单设计、状态管理和交互优化。

开发者在 AI 辅助过程中承担了以下角色：

- **需求判断**：决定哪些功能需要实现、哪些不在范围内
- **代码审查**：检查 AI 生成代码的正确性、类型安全和边界处理
- **业务决策**：选择数据结构、组件划分和交互方案
- **质量把控**：确保代码通过 ESLint、TypeScript 类型检查和构建验证

具体 AI 协作过程记录在：
- `docs/ai/AI_Collaboration_Card.md` — 完整的 AI 协作记录
- `docs/evidence/` — 每日证据卡中的 AI 协作小节

---

## 📊 项目检测

项目已配置完整的代码质量检测体系：

```bash
# 类型检查
npm run type-check

# 代码规范检查
npm run lint

# 完整构建（含类型检查）
npm run build
```

检测结果记录在 `CHECK_REPORT.md` 中。

---

## 📄 License

本仓库仅用于《校园轻集市》课程教学与实践。
