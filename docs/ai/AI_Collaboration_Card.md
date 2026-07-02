# AI Collaboration Card

## 使用工具

**Claude Code** (Anthropic 官方 CLI AI Coding 工具)

---

## 协作记录

### 协作 1：分析项目目录结构

**Prompt：**
> 请分析 campus-market-seed 项目的目录结构，说明每个目录的职责，哪些是课程基础设施，哪些需要自己开发。

**AI 输出：**

```
campus-market-seed/
├── docs/                    # 📚 课程文档（基础设施）
│   ├── ai/                  # AI 协作规范与记录
│   ├── evidence/            # 每日过程性证据模板
│   └── guide/               # 学生使用指南
├── public/                  # 🌐 静态资源（基础设施）
│   └── favicon.ico          # 网站图标
├── scripts/                 # 🔧 自动检测脚本（基础设施，后续启用）
├── src/                     # 💻 项目源码（需自己开发）
│   ├── api/                 # API 接口层（需开发）
│   ├── components/          # 公共组件（需开发）
│   ├── router/              # 路由配置（部分已提供）
│   ├── stores/              # Pinia 状态管理（需开发）
│   ├── views/               # 页面视图（需开发）
│   ├── App.vue              # 根组件
│   └── main.ts              # 应用入口
├── .editorconfig            # 编辑器配置（基础设施）
├── .nvmrc                   # Node.js 版本约束（基础设施）
├── package.json             # 项目依赖声明
├── pnpm-lock.yaml           # 依赖锁定文件
├── vite.config.ts           # Vite 构建配置
└── tsconfig.json            # TypeScript 配置
```

**自己的理解：**

项目采用典型 Vue 3 工程化目录结构。docs/、scripts/、public/ 以及根目录的配置文件（.editorconfig、.nvmrc 等）属于课程基础设施，提供了统一的开发环境基线。src/ 下的 api/、components/、stores/、views/ 是需要自己开发的核心业务代码目录。router/ 已提供基础路由配置，需要后续扩展。

**最终结论：**

这种分工很清晰——基础设施保证环境一致性，src 目录留给开发者实现业务逻辑。开发时重点关注 src/ 下的五个子目录。

---

### 协作 2：解释 main.ts

**Prompt：**
> 请解释 src/main.ts 中每一行代码的作用，说明 Vue 应用如何创建、Pinia 和 Router 如何注册。

**AI 输出：**

```typescript
// 1. 从 vue 包导入 createApp 函数——Vue 3 的应用创建入口
import { createApp } from 'vue'
// 2. 从 pinia 包导入 createPinia 函数——创建全局状态管理实例
import { createPinia } from 'pinia'

// 3. 导入根组件 App.vue
import App from './App.vue'
// 4. 导入路由实例
import router from './router'

// 5. 调用 createApp 创建 Vue 应用实例，传入根组件
const app = createApp(App)

// 6. 通过 app.use() 注册 Pinia 插件——之后所有组件都可以使用 store
app.use(createPinia())
// 7. 通过 app.use() 注册 Router 插件——启用页面路由功能
app.use(router)

// 8. 将应用挂载到 index.html 中的 #app 元素上
app.mount('#app')
```

**自己的理解：**

Vue 3 通过 `createApp` 创建应用实例，然后通过插件机制（`app.use()`）注册 Pinia 和 Router。这种设计是"渐进式"的——需要什么功能就注册什么插件。`#app` 挂载点对应 `index.html` 中的 `<div id="app"></div>`。整个流程是：创建实例 → 注册插件 → 挂载到 DOM。

**最终结论：**

main.ts 是项目的"组装车间"，把 Vue、Pinia、Router 三个核心模块组装在一起。理解了 main.ts 就理解了整个应用的启动流程。

---

### 协作 3：解释 Router 的作用

**Prompt：**
> 请解释 src/router/index.ts 中 Router 的作用，以及为什么首页能够显示。

**AI 输出：**

```typescript
// createRouter: 创建路由实例
// createWebHistory: 使用 HTML5 History 模式（URL 不带 #）
import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'

const router = createRouter({
  // history: 指定路由模式，createWebHistory 使用浏览器 History API
  history: createWebHistory(import.meta.env.BASE_URL),
  // routes: 路由映射表，定义 URL 路径与组件的对应关系
  routes: [
    {
      path: '/',           // 访问根路径 "/" 时
      name: 'home',        // 路由名称（可用于编程式导航）
      component: HomeView, // 渲染 HomeView 组件
    },
  ],
})

export default router
```

**首页能显示的原因：**

1. 浏览器访问 `http://localhost:5173/`
2. Vite 返回 `index.html`，其中引入 `/src/main.ts`
3. main.ts 创建 Vue 应用并注册 Router
4. Router 检测到 URL 路径为 `/`，匹配到 `path: '/'`
5. 在 App.vue 的 `<RouterView />` 位置渲染 HomeView 组件
6. 用户看到"项目启动成功"

**自己的理解：**

Router 本质是一个"URL → 组件"的映射表。`createWebHistory` 让 URL 看起来像普通网站路径（不带 `#`），`<RouterView />` 是组件的渲染出口。当前只有一个路由 `/`，后续需要添加更多页面路由。

**最终结论：**

Router 是单页应用（SPA）页面切换的核心——不同 URL 显示不同组件，但不会刷新整个页面。

---

### 协作 4：分析技术栈

**Prompt：**
> 请分析 campus-market-seed 项目采用的技术栈，包括框架、语言、构建工具、状态管理、路由、代码规范等。

**AI 输出：**

| 类别 | 技术 | 版本 | 用途 |
|------|------|------|------|
| 框架 | Vue 3 | ^3.5.38 | 前端 UI 框架（Composition API） |
| 语言 | TypeScript | ~6.0.0 | 类型安全的 JavaScript 超集 |
| 构建工具 | Vite | ^8.0.16 | 开发服务器与生产构建 |
| 状态管理 | Pinia | ^3.0.4 | Vue 3 官方状态管理库 |
| 路由 | Vue Router | ^5.1.0 | SPA 页面路由 |
| 包管理器 | pnpm | 11.9.0 | 高效的 Node.js 包管理器 |
| 代码检查 | ESLint | ^10.5.0 | 代码质量与风格检查 |
| 代码检查 | Oxlint | ~1.69.0 | Rust 编写的高性能 Linter |
| Node.js | Node | ^22.18.0 \|\| >=24.12.0 | 运行时环境 |

**自己的理解：**

技术栈选型非常现代化：Vue 3 + TypeScript + Vite 是当前 Vue 生态的主流组合。Pinia 取代了 Vuex 成为官方推荐的状态管理方案。pnpm 相比 npm 更节省磁盘空间。ESLint + Oxlint 双 linter 保证代码质量。

**最终结论：**

这套技术栈是 2025-2026 年 Vue 3 项目的标准配置，学习它可以掌握当前前端开发的主流实践。

---

---

### 协作 5：Day2 页面骨架与路由导航

**Prompt：**
> 请为 Vue 3 项目创建 8 个页面骨架组件，包括首页、列表页、详情页、发布页、消息页、个人中心、留言板和登录页，并配置 Vue Router 路由。

**AI 输出：**

AI 生成了 8 个基础页面骨架（每个包含基本的 `<template>` + `<script setup>` + `<style scoped>`），并更新了 `router/index.ts` 配置了完整的路由映射表。同时生成了 AppNav 导航组件和 AppLayout 布局组件。

**自己的理解：**

页面骨架的设计需要考虑：1）哪些页面是核心业务流程页面，2）哪些是辅助页面，3）路由如何组织（哪些用懒加载、哪些直接导入）。AI 生成的路由配置默认使用了懒加载策略（动态 import），这对构建优化有帮助。

**人工修改：**
- 调整了导航菜单的样式，使 active 状态更明显
- 为导航项添加了 emoji 图标，提升视觉辨识度
- 确认路由结构覆盖了课程要求的全部页面

---

### 协作 6：Day3 Mock 数据与列表渲染

**Prompt：**
> 请为校园轻集市设计 db.json 数据结构，包含二手交易、失物招领、拼单搭子和跑腿委托四种数据，并封装对应的 API 模块。

**AI 输出：**

AI 设计了包含 trades、lostFounds、groupBuys、errands 四个集合的 db.json，每个集合包含 5-8 条示例数据。同时生成了四个对应的 API 模块（trade.ts、lostFound.ts、groupBuy.ts、errand.ts），每个模块封装了 getList、getById、create 等方法。

**人工修改：**
- 修复了 db.json 中的中文编码损坏问题（多次提交修复）
- 调整了 API 类型定义，使其更贴合业务需求
- 添加了 axios 请求的 UTF-8 编码声明
- 确认列表页能正确渲染四种业务数据

**遇到的问题：**
- JSON Server 中文数据出现乱码 → 通过设置 axios Content-Type 头 `charset=utf-8` 解决
- db.json 中部分中文数据编码损坏 → 手动重新编写损坏的数据条目

---

### 协作 7：Day4 发布表单与数据新增

**Prompt：**
> 请创建 PublishView.vue 发布页面，支持选择业务类型（二手/失物/拼单/跑腿），根据类型动态显示不同表单字段，提交数据到 JSON Server。

**AI 输出：**

AI 生成了完整的发布页面，包括：业务类型选择器、动态表单字段（根据类型切换）、表单校验逻辑、数据提交和页面跳转。使用了 FormField 组件封装表单项。

**人工修改：**
- 优化了表单校验规则，增加了必填字段检查
- 修复了发布后跳转逻辑——从跳转到通用列表页改为跳转到对应类型的业务列表页
- 调整了表单样式，使其在不同屏幕尺寸下都有良好的布局
- 添加了发布成功后的 Toast 提示

---

### 协作 8：Day5 状态管理与用户中心

**Prompt：**
> 请使用 Pinia 创建 userStore 和 favoriteStore，实现用户状态管理和收藏功能，并创建 UserCenterView.vue 个人中心页面。

**AI 输出：**

AI 创建了两个 Pinia Store：userStore（用户信息、登录状态管理）和 favoriteStore（收藏列表的增删查改），以及 UserCenterView 个人中心页面（展示用户资料、收藏列表、统计数据）。

**人工修改：**
- 将 userStore 从硬编码的模拟用户改为支持动态登录
- 优化了收藏按钮的交互——从文字链接改为圆形爱心图标
- 调整了个人中心的布局，使其信息层级更清晰
- 修复了 TypeScript 类型安全问题

---

### 协作 9：Day6 注册登录与交互优化

**Prompt：**
> 请实现注册登录功能（基于 JSON Server），创建 LoadingState、ErrorState、SearchBar 组件，并为四个列表页添加加载/错误/搜索/收藏交互。

**AI 输出：**

AI 生成了完整的注册登录页面、三个交互组件（加载/错误/搜索），并改造了四个核心列表页面，添加了搜索、加载状态、错误状态和收藏按钮优化。

**人工修改与判断：**
- 删除了 AI 生成的 JWT/Token/权限路由相关代码——超出 Day6 范围
- 确保 localStorage 中不存储密码（安全考量）
- 修复了 TypeScript 类型窄化问题
- 统一了错误提示信息，引导用户执行 `npm run mock`
- 优化了收藏按钮的视觉设计（圆形边框 + 心跳动画）
- 确保未登录状态下发布页和个人中心有合理的引导提示

---

### 协作 10：Day7 综合验收与项目整理

**Prompt：**
> 请根据 Day7 实验手册，完成项目综合验收，包括：构建检查、功能走查、README 完善、证据卡整理、AI 协作复盘和最终提交。

**AI 输出：**

AI 执行了完整的项目质量检查（构建、类型检查、Lint），并辅助生成了 README.md、CHECK_REPORT.md、Day7_Evidence.md 和更新了 AI_Collaboration_Card.md。

**人工审查与判断：**
- 逐项核对 README 中的功能说明，确保只列出真实实现的功能（未添加登录注册的高级特性、支付、实时聊天等未实现功能）
- 修复了 12 个 ESLint 错误（未使用变量、any 类型等），确保代码质量
- 对 AI 生成的"项目展示稿"进行了人工精简和真实性审查
- 确认所有文档中的技术栈、运行命令、目录结构与项目实际一致
- 验证了构建产物的正确性

---

## AI 协作总结

| 项目 | 内容 |
|------|------|
| 使用工具 | Claude Code (Anthropic) |
| 协作次数 | 10 次（Day1-Day7 全覆盖） |
| 覆盖范围 | 目录分析、代码解释、页面骨架、Mock 数据、API 封装、表单设计、状态管理、交互优化、注册登录、文档整理、质量检测 |
| 采纳率 | 约 85%（大部分 AI 输出被采纳，但均经过人工审查和修改） |
| 主要修改类型 | TypeScript 类型安全修复、业务逻辑边界调整、UI 细节优化、删除超出范围代码 |

### AI 的优势与局限

**AI 帮助最大的阶段：**
1. **页面骨架生成**（Day2）：快速生成多个页面文件，节省大量重复劳动
2. **Mock 数据设计**（Day3）：快速生成真实感的示例数据
3. **表单与交互组件**（Day4-6）：完整的功能组件代码框架

**AI 生成内容中出现过的问题：**
1. 会生成超出项目范围的功能（JWT、权限路由、支付、实时聊天等）——需要人工识别和删除
2. TypeScript 类型有时不够严格（使用 `any` 逃逸类型检查）
3. 中文编码处理不当（db.json 乱码问题）
4. 有时会"过度设计"，生成比需求更复杂的代码

**自己的判断和修改能力：**
- 能够识别 AI 生成代码中的类型安全问题并修复
- 能够判断哪些功能在项目范围内、哪些超出范围
- 能够调整 UI 细节（动画、配色、布局）使其符合校园场景
- 能够理解业务逻辑并确保代码实现正确

**使用 AI Coding 工具的注意事项：**
1. AI 是"副驾驶"而非"自动驾驶"——所有代码都应经过人工审查
2. 先理解需求，再使用 AI 辅助实现，而不是让 AI 替代理解决策
3. 遇到不确定的 AI 输出时，优先查阅官方文档验证
4. AI 生成的文档类内容（README、证据卡），必须逐条核对真实性
5. AI 可能"编造"功能——文档中不能出现未实现的功能描述
