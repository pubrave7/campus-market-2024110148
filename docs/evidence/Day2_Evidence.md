Day2 实验证据卡 — 页面骨架与路由导航（多页面扩展）

实验日期

2026-06-28

一、本日任务概述

Day2 的核心任务是搭建"校园轻集市"PC 端 Web App 的前端**页面骨架**，完成基础**路由导航**配置，设计并实现**公共布局**组件，形成可访问、可跳转、可扩展的前端页面框架。本日不要求实现复杂业务逻辑或接入真实数据。

二、页面骨架 — 本日创建/更新的页面

根据"校园轻集市"业务需求，本日共创建了 5 个新的业务页面，更新了 1 个已有页面（首页），并保留了之前创建的 4 个通用页面。核心 8 个业务页面如下：

| 序号 | 页面名称 | 文件路径 | 路由路径 | 功能说明 |
|------|----------|----------|----------|----------|
| 1 | 首页 | `src/views/HomeView.vue` | `/` | 展示平台入口、五大业务分类入口、快速入门指引、公告栏 |
| 2 | 二手交易页 | `src/views/TradeView.vue` | `/trade` | 展示二手商品列表，支持分类筛选（教材教辅/数码电子/生活用品等6类），展示价格、卖家、成色信息 |
| 3 | 失物招领页 | `src/views/LostFoundView.vue` | `/lost-found` | 展示失物和招领信息，支持"寻物启事"与"失物招领"双 tab 切换，包含地点、时间、联系方式 |
| 4 | 拼单搭子页 | `src/views/GroupBuyView.vue` | `/group-buy` | 展示拼单团购、找搭子、组队信息，支持按类型筛选，显示进度条和参与人数 |
| 5 | 跑腿委托页 | `src/views/ErrandView.vue` | `/errand` | 展示跑腿任务与委托信息，支持代取/代办/其他分类筛选，显示酬劳和任务状态（待接单/已接单/已完成） |
| 6 | 发布页面 | `src/views/PublishView.vue` | `/publish` | 用于发布商品、失物、拼单或跑腿信息（含表单） |
| 7 | 消息页面 | `src/views/MessageView.vue` | `/message` | 展示私信消息列表与系统通知，支持未读标记 |
| 8 | 个人中心 | `src/views/UserCenterView.vue` | `/user` | 展示用户资料、统计数据、功能菜单（我的发布/收藏/购买记录/跑腿记录/失物记录/账号设置） |

页面骨架设计原则

- 每个页面均为独立的 Vue SFC（单文件组件），包含 `<script setup lang="ts">`、`<template>`、`<style scoped>` 三部分
- 每个页面均包含清晰的页面标题（h2）和业务场景说明（page-desc）
- 页面使用静态模拟数据（ref 数组）展示 UI 效果，不依赖后端 API
- 页面样式采用 scoped CSS，避免样式污染
- 所有页面遵循统一的视觉风格：白色卡片 + 浅灰背景 + 蓝色主题色

三、路由导航

路由配置文件：`src/router/index.ts`

核心路由表

| 路径 | 路由名称 | 组件 | 加载方式 | 说明 |
|------|----------|------|----------|------|
| `/` | home | HomeView | 直接导入 | 首页，首屏优先加载 |
| `/trade` | trade | TradeView | 懒加载 | 二手交易列表 |
| `/lost-found` | lost-found | LostFoundView | 懒加载 | 失物招领信息 |
| `/group-buy` | group-buy | GroupBuyView | 懒加载 | 拼单搭子信息 |
| `/errand` | errand | ErrandView | 懒加载 | 跑腿委托任务 |
| `/publish` | publish | PublishView | 懒加载 | 发布信息表单 |
| `/message` | message | MessageView | 懒加载 | 消息中心 |
| `/user` | user | UserCenterView | 懒加载 | 个人中心 |

兼容性路由（重定向）

| 旧路径 | 新路径 | 处理方式 |
|--------|--------|----------|
| `/messages` | `/message` | 301 重定向 |
| `/profile` | `/user` | 301 重定向 |

路由设计特点

- 使用 `createWebHistory` 模式，URL 无 `#` 号，语义清晰
- 除首页外，其余 7 个业务页面均采用 `() => import(...)` 动态懒加载，优化首屏加载性能
- 路由路径使用语义化命名（如 `/lost-found`、`/group-buy`），避免无意义的 `/page1`、`/test` 等路径
- 旧路径 `/messages` 和 `/profile` 设置为重定向到新路径，保证向后兼容
- 保留了原有的 `/list`、`/detail/:id`、`/board` 路由以兼容已有功能

导航栏路由配置

在 `AppNav.vue` 组件中，使用 `<router-link>` 实现了 8 个核心页面的声明式导航，当前激活路由通过 `route.path` 匹配实现高亮（蓝色背景 + 白色文字）。

四、公共布局

本日将公共布局从 `App.vue` 中拆分为独立的可复用组件，实现了**页面组件**与**通用布局组件**的清晰分离：

布局组件结构

| 组件 | 文件路径 | 职责 |
|------|----------|------|
| `AppLayout.vue` | `src/components/AppLayout.vue` | 整体页面布局容器：顶部导航 + 内容区 + 底部版权 |
| `AppHeader.vue` | `src/components/AppHeader.vue` | 顶部区域：Logo 标题 + 副标题 + 导航插槽 |
| `AppNav.vue` | `src/components/AppNav.vue` | 导航菜单：8 个路由链接 + 当前激活高亮 |

 布局设计特点

- **关注点分离**：AppLayout 负责整体结构，AppHeader 负责品牌展示，AppNav 负责路由导航，各司其职
- **插槽机制**：AppHeader 通过 `<slot name="nav">` 接收 AppNav，支持灵活替换导航内容
- **粘性顶部**：AppHeader 使用 `position: sticky; top: 0` 实现顶部固定
- **响应式内容区**：AppLayout 的 `<main>` 区域设置 `max-width: 1100px` 并水平居中
- **统一风格**：所有布局组件使用与页面组件一致的设计语言

App.vue 重构

将原先内联在 App.vue 中的 header/nav/main/footer 全部移至独立的布局组件中，App.vue 仅作为根组件引入 AppLayout：

```vue
<script setup lang="ts">
import AppLayout from '@/components/AppLayout.vue'
</script>
<template>
  <AppLayout />
</template>
```

这种方式使得 App.vue 保持简洁，布局逻辑集中在可复用的组件中。

五、项目目录结构（Day2 结束后）

```
src/
├── views/                    # 页面级组件
│   ├── HomeView.vue          # 首页
│   ├── TradeView.vue         # 二手交易页 【新增】
│   ├── LostFoundView.vue     # 失物招领页 【新增】
│   ├── GroupBuyView.vue      # 拼单搭子页 【新增】
│   ├── ErrandView.vue        # 跑腿委托页 【新增】
│   ├── PublishView.vue       # 发布页面
│   ├── MessageView.vue       # 消息页面
│   ├── UserCenterView.vue    # 个人中心 【新增】
│   ├── ListView.vue          # 通用列表页（保留）
│   ├── DetailView.vue        # 商品详情页（保留）
│   └── BoardView.vue         # 数据看板页（保留）
├── components/               # 可复用组件
│   ├── AppLayout.vue         # 公共布局容器 【新增】
│   ├── AppHeader.vue         # 顶部导航栏 【新增】
│   ├── AppNav.vue            # 导航菜单 【新增】
│   └── .gitkeep
├── router/
│   └── index.ts              # 路由配置（已更新）
├── App.vue                   # 根组件（已重构）
└── main.ts                   # 入口文件（挂载router+pinia）
```

六、遇到的问题与解决

1. **页面命名与手册不一致**：项目原有页面（ListView、ProfileView 等）使用通用命名，与 Day2 手册要求的业务场景命名（TradeView、UserCenterView 等）不匹配。解决方法：新增符合手册要求的业务页面，保留原有页面并设置路由兼容重定向。

2. **路由路径统一**：原有 `/messages` 和 `/profile` 路径与手册要求的 `/message` 和 `/user` 不同。解决方法：更新主路由路径，旧路径设置 redirect 保证向后兼容。

3. **布局组件拆分**：原先所有布局逻辑（header、nav、footer）都写在 App.vue 中，代码耦合度高。解决方法：按照手册要求拆分为 AppLayout / AppHeader / AppNav 三个独立组件，实现页面组件与通用组件的清晰边界。

4. **HomeView 首页内容更新**：原首页仅围绕"二手交易"单一场景设计。解决方法：扩展为涵盖全部五大业务（二手交易、失物招领、拼单搭子、跑腿委托、发布信息）的入口页面，增加公告栏。

七、AI 协作记录

| 协作环节 | AI 工具 | 用途说明 | 人工审查重点 |
|----------|---------|----------|-------------|
| 页面骨架生成 | Claude Code | 生成 5 个业务页面（TradeView、LostFoundView、GroupBuyView、ErrandView、UserCenterView）的完整 Vue SFC 代码 | 检查页面名称是否与业务场景对应；检查是否存在无意义占位内容；确认每个页面都有清晰的标题和说明 |
| 布局组件设计 | Claude Code | 生成 AppLayout、AppHeader、AppNav 三个布局组件 | 检查组件拆分是否合理；确认插槽机制正确；验证导航高亮逻辑 |
| HomeView 更新 | Claude Code | 扩展首页内容以覆盖全部业务场景 | 检查业务描述是否贴合"校园轻集市"场景 |
| 构建验证 | vue-tsc + vite build | 类型检查和生产构建 | 确认无类型错误；确认所有页面正确打包 |

AI 使用小结

本日大部分代码由 AI（Claude Code）辅助生成，但所有生成内容均经过以下人工审查：
- 页面内容是否围绕"校园生活"场景，没有引入无关业务
- 路由路径是否语义清晰，没有出现 `/page1`、`/test` 等无意义路径
- 组件拆分是否合理，页面组件与公共布局组件是否清晰分离
- 代码是否简洁，没有过度封装或引入不必要的第三方依赖
- 项目是否可以正常构建和运行

 八、本日交付物清单

| 交付物 | 存放位置 | 状态 |
|--------|----------|------|
| 5 个新增业务页面 | `src/views/TradeView.vue`、`LostFoundView.vue`、`GroupBuyView.vue`、`ErrandView.vue`、`UserCenterView.vue` | ✅ |
| 1 个更新首页 | `src/views/HomeView.vue` | ✅ |
| 3 个公共布局组件 | `src/components/AppLayout.vue`、`AppHeader.vue`、`AppNav.vue` | ✅ |
| 路由配置文件 | `src/router/index.ts` | ✅ |
| Day2 证据卡 | `docs/evidence/Day2_Evidence.md` | ✅ |
| 项目构建验证 | `npm run build` 通过 | ✅ |
| TypeScript 类型检查 | `vue-tsc --build` 通过 | ✅ |

九、检测结果

```bash
# TypeScript 类型检查
$ npx vue-tsc --build
# 无错误输出 — 通过 ✅

# 生产构建
$ npx vite build
# ✓ built in 198ms — 通过 ✅
# 所有页面和组件均成功打包
```
