Day2 实验证据卡 — 页面骨架与路由导航

实验日期
2026-06-28

一、本日新增页面

| 序号 | 页面名称 | 文件路径 | 功能说明 |
|------|----------|----------|----------|
| 1 | 首页 | `src/views/HomeView.vue` | 原有页面，项目入口 |
| 2 | 列表页 | `src/views/ListView.vue` | 展示商品列表，支持跳转详情 |
| 3 | 详情页 | `src/views/DetailView.vue` | 商品详情展示，通过路由参数 `:id` 接收商品 ID |
| 4 | 发布页 | `src/views/PublishView.vue` | 商品发布表单（名称、价格、描述） |
| 5 | 消息页 | `src/views/MessageView.vue` | 消息列表，展示聊天/系统通知 |
| 6 | 个人中心 | `src/views/ProfileView.vue` | 用户信息展示、统计数据 |
| 7 | 看板页 | `src/views/BoardView.vue` | 平台数据概览（静态统计数据） |

二、路由设计

路由配置文件：`src/router/index.ts`

路由表

| 路径 | 路由名称 | 组件 | 说明 |
|------|----------|------|------|
| `/` | home | HomeView | 首页（直接导入） |
| `/list` | list | ListView | 商品列表（懒加载） |
| `/detail/:id` | detail | DetailView | 商品详情，携带 id 参数（懒加载） |
| `/publish` | publish | PublishView | 发布商品（懒加载） |
| `/messages` | messages | MessageView | 消息中心（懒加载） |
| `/profile` | profile | ProfileView | 个人中心（懒加载） |
| `/board` | board | BoardView | 数据看板（懒加载） |

设计要点

- 使用 `createWebHistory` 模式，URL 无 `#` 号
- 除首页外，其余 6 个页面均采用 `() => import(...)` 懒加载方式，优化首屏性能
- `/detail/:id` 使用动态路由参数，支持从列表页携带商品 ID 跳转

三、导航系统

在 `App.vue` 中实现了顶部导航栏：

- **首页** — `/`
- **列表** — `/list`
- **发布** — `/publish`
- **消息** — `/messages`
- **看板** — `/board`
- **我的** — `/profile`

导航栏特性：
- 使用 `<router-link>` 实现声明式导航
- 当前激活路由高亮显示（蓝色背景）
- 标题可点击返回首页
- 响应式布局：顶部固定导航 + 内容区 + 底部版权

四、进阶任务完成情况

1. **看板页设计** ✅ — `BoardView.vue` 包含 4 个统计卡片（注册用户 / 在售商品 / 成交订单 / 今日新增）和最近商品表格
2. **路由跳转增强** ✅ — 列表页通过 `<router-link :to="'/detail/' + item.id">` 跳转到详情页，DetailView 通过 `useRoute().params.id` 获取参数
3. **UI 优化** ✅ — 项目未安装 Element Plus，使用原生 HTML/CSS 实现了完整的导航栏、卡片、表单、表格等 UI 组件

五、遇到的问题与解决

（填写实验中遇到的问题及解决方式）

六、AI 协作记录

| 协作环节 | AI 工具 | 用途说明 |
|----------|---------|----------|
| 页面骨架生成 | Claude Code | 批量生成 6 个 Vue SFC 页面组件 |
| 代码审查 | - | 项目构建验证通过 |
