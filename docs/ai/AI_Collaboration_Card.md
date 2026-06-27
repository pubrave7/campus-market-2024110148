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

## AI 协作总结

| 项目 | 内容 |
|------|------|
| 使用工具 | Claude Code |
| 协作次数 | 4 次 |
| 覆盖范围 | 目录分析、入口文件、路由系统、技术栈 |
| 采纳率 | 100%（AI 解释准确，全部采纳） |
| 修改情况 | 无重大修改，AI 输出质量较高 |
| 效率提升 | 显著——无需逐行查文档，AI 快速给出结构化分析 |

**体会：**

AI 在"阅读理解型"任务上表现优秀——能快速分析代码结构、解释技术概念。但在后续"创造型"任务（如编写业务代码）中，需要更谨慎地验证 AI 输出的正确性。AI 应该是"副驾驶"而非"自动驾驶"——最终决策权在开发者手中。
