# Day5 证据卡 —— 状态管理与用户中心

> **日期：** 2026-07-01
> **实训主题：** Pinia 状态管理、用户状态模拟、我的发布与收藏功能实现
> **关键词：** Pinia、状态管理、用户中心

---

## 一、任务完成情况

| 任务 | 内容 | 状态 |
|------|------|------|
| Task 1 | 确认 Pinia 已挂载 | ✅ main.ts 已包含 `createPinia()` |
| Task 2 | 创建用户状态 Store | ✅ `src/stores/user.ts` |
| Task 3 | 创建收藏状态 Store | ✅ `src/stores/favorite.ts` |
| Task 4 | 导航栏显示用户信息 | ✅ AppHeader.vue 集成用户头像和名称 |
| Task 5 | 发布页面使用当前用户 | ✅ PublishView.vue 自动填充 publisher/seller/initiator |
| Task 6 | 列表页添加收藏功能 | ✅ 四个列表页均添加收藏按钮 |
| Task 7 | 完善个人中心页面 | ✅ UserCenterView.vue 集成 Store |
| Task 8 | 证据卡与 Git 提交 | ✅ 本文档 |

---

## 二、Store 设计

### 2.1 用户状态 Store（`user.ts`）

**设计思路：** 管理当前模拟用户的所有信息，包括基本资料、学院年级、联系方式、统计数据等。

| 分类 | 内容 |
|------|------|
| **State** | `name`, `avatar`, `school`, `college`, `grade`, `studentId`, `phone`, `email`, `joinedAt`, `bio`, `isLoggedIn`, `publishedCount`, `soldCount`, `purchasedCount` |
| **Getters** | `displayName`（显示名称）、`avatarChar`（头像首字）、`schoolInfo`（学院+年级）、`fullInfo`（完整信息对象） |
| **Actions** | `updateProfile(data)`（更新用户资料）、`incrementPublished()`（增加发布计数） |

**关键决策：**
- 使用模拟用户"张同学"，不需要真实登录
- 统计数据（publishedCount 等）跟随 Store 动态变化
- 发布成功后自动调用 `incrementPublished()` 更新统计

### 2.2 收藏状态 Store（`favorite.ts`）

**设计思路：** 管理跨页面的收藏状态，支持四种业务类型的收藏/取消收藏/切换操作。

| 分类 | 内容 |
|------|------|
| **State** | `items: FavoriteItem[]`（收藏列表，包含 id、type、title、price、seller 等） |
| **Getters** | `count`（收藏总数）、`getByType(type)`（按类型筛选）、`isFavorited(id, type)`（判断是否已收藏） |
| **Actions** | `addFavorite(item)`、`removeFavorite(id, type)`、`toggleFavorite(item)` |

**关键决策：**
- 收藏数据暂存前端内存（Pinia），刷新后丢失——这是 Day5 可接受的行为
- 后续可通过 localStorage 或后端接口实现持久化
- `FavoriteItem` 包含足够展示信息，避免收藏后还需回查 API

### 2.3 状态边界判断

| 数据类型 | 是否放入 Store | 原因 |
|----------|---------------|------|
| 当前用户信息 | ✅ 是 | 导航栏、发布页、个人中心等多处使用 |
| 收藏列表 | ✅ 是 | 列表页和个人中心都需要使用 |
| 发布统计数据 | ✅ 是 | 个人中心展示，发布页更新 |
| 表单临时输入内容 | ❌ 否 | 仅属于发布页面内部 |
| 筛选条件（分类、tab） | ❌ 否 | 仅属于各自列表页面 |
| 表单校验错误信息 | ❌ 否 | 仅属于当前表单页面 |
| 列表数据（API 返回） | ❌ 否 | 仅在各自列表页使用，不需要跨页面共享 |

---

## 三、跨页面状态使用验证

### 3.1 导航栏（AppHeader.vue）
- 读取 `userStore.avatarChar` 显示头像首字
- 读取 `userStore.displayName` 显示用户名
- 点击跳转到个人中心 `/user`

### 3.2 发布页面（PublishView.vue）
- 二手交易：`seller` 字段自动填充 `userStore.displayName`
- 跑腿委托：`publisher` 字段自动填充 `userStore.displayName`
- 拼单搭子：`initiator` 字段自动填充 `userStore.displayName`
- 发布成功后调用 `userStore.incrementPublished()`

### 3.3 列表页面（TradeView / ErrandView / GroupBuyView / LostFoundView）
- 四类业务页面均集成收藏按钮（🤍/❤️）
- 点击切换收藏状态，调用 `favoriteStore.toggleFavorite()`
- 已收藏显示实心红心（❤️），未收藏显示空心（🤍）
- 使用 `event.stopPropagation()` 防止冒泡触发卡片点击跳转

### 3.4 个人中心（UserCenterView.vue）
- **用户资料区：** 从 `userStore` 读取头像首字、姓名、学院、年级、简介
- **统计数据区：** `publishedCount` 来自 userStore，`favorited` 来自 favoriteStore
- **我的收藏：** 直接从 `favoriteStore.items` 渲染，支持取消收藏
- **账号设置：** 保存时调用 `userStore.updateProfile()`

---

## 四、AI 协作记录

### 4.1 AI 生成的内容

| 内容 | 工具 | 说明 |
|------|------|------|
| `src/stores/user.ts` | Claude Code | 用户 Store 完整代码，包括 state、getters、actions |
| `src/stores/favorite.ts` | Claude Code | 收藏 Store 完整代码，支持增删查 |
| `AppHeader.vue` 用户入口 | Claude Code | 在导航栏右侧添加用户头像+姓名入口 |
| `PublishView.vue` Store 集成 | Claude Code | 自动填充发布人字段+发布计数更新 |
| `TradeView.vue` 收藏功能 | Claude Code | 收藏按钮+心跳动画 |
| `LostFoundView.vue` 收藏功能 | Claude Code | 收藏按钮集成 |
| `GroupBuyView.vue` 收藏功能 | Claude Code | 收藏按钮集成 |
| `ErrandView.vue` 收藏功能 | Claude Code | 收藏按钮集成 |
| `UserCenterView.vue` 重写 | Claude Code | 全面对接两个 Store |

### 4.2 人工审查与调整

1. **Store 命名审查：** 确认 `useUserStore`、`useFavoriteStore` 命名清晰、符合 Pinia 惯例
2. **状态边界审查：** 确认没有将表单临时数据、筛选条件等放入 Store
3. **收藏数据结构：** 审查 `FavoriteItem` 接口设计，确保包含足够展示信息
4. **发布页预填逻辑：** 确认用户仍可手动修改发布人名称（保留输入框可编辑）
5. **用户中心收藏展示：** 审查 `favDisplayInfo()` 函数，确保四种类型的收藏都能正确显示
6. **删除 JWT/登录相关内容：** AI 未生成完整登录系统，保持在模拟用户阶段
7. **样式审查：** 确认收藏按钮心跳动画、用户头像渐变、整体 UI 协调

---

## 五、功能测试记录

### 测试环境
- **前端：** Vite Dev Server (localhost:5173)
- **Mock 服务：** JSON Server (localhost:3001)
- **浏览器：** Chrome

### 测试用例

| # | 测试内容 | 操作 | 预期结果 | 实际结果 |
|---|----------|------|----------|----------|
| 1 | 导航栏用户显示 | 打开任意页面 | 右上角显示"张"头像 + "张同学"名称 | ✅ 通过 |
| 2 | 导航栏跳转 | 点击用户区域 | 跳转到个人中心 `/user` | ✅ 通过 |
| 3 | 发布页预填 | 打开发布页面 | 发布人/发起人自动填充"张同学" | ✅ 通过 |
| 4 | 手动修改发布人 | 在发布页修改发布人名称为"李同学" | 可以正常修改并提交 | ✅ 通过 |
| 5 | 发布后统计更新 | 提交一条新发布 | 个人中心"已发布"数字增加 | ✅ 通过 |
| 6 | 二手交易收藏 | 在 TradeView 点击收藏按钮 | 按钮从🤍变为❤️，心跳动画播放 | ✅ 通过 |
| 7 | 取消收藏 | 再次点击已收藏按钮 | 按钮从❤️变回🤍 | ✅ 通过 |
| 8 | 跑腿收藏 | 在 ErrandView 点击收藏 | 正常收藏/取消 | ✅ 通过 |
| 9 | 拼单收藏 | 在 GroupBuyView 点击收藏 | 正常收藏/取消 | ✅ 通过 |
| 10 | 失物收藏 | 在 LostFoundView 点击收藏 | 正常收藏/取消 | ✅ 通过 |
| 11 | 收藏跨页面 | 在列表页收藏后去个人中心 | 个人中心"我的收藏"显示已收藏条目 | ✅ 通过 |
| 12 | 个人中心取消收藏 | 在"我的收藏"中点击取消收藏 | 条目消失，列表页收藏状态同步 | ✅ 通过 |
| 13 | 收藏计数 | 收藏/取消收藏后查看统计数据 | 收藏数字实时更新 | ✅ 通过 |
| 14 | 个人中心资料 | 查看个人中心 | 正确显示姓名、学院、年级、简介、手机、邮箱 | ✅ 通过 |
| 15 | 设置保存 | 修改昵称后保存 | Store 状态更新，导航栏用户名同步变化 | ✅ 通过 |
| 16 | 刷新后收藏丢失 | 刷新页面 | 收藏数据清空（符合预期，内存状态） | ✅ 通过 |
| 17 | 项目构建 | `npx vite build` | 构建成功，无报错 | ✅ 通过 |
| 18 | TypeScript 检查 | `npx vue-tsc --noEmit` | 类型检查通过 | ✅ 通过 |

---

## 六、收获与反思

### 6.1 对状态管理的理解

在 Day1-Day4 中，所有数据都放在页面组件内部（`ref()` 局部状态），页面之间无法共享数据。Day5 引入 **Pinia** 后：

- **用户信息** 不再需要在每个页面硬编码或复制，一个 Store 全局共享
- **收藏状态** 可以在列表页和个人中心之间同步，实现了真正的跨页面交互
- **统计数据** 跟随业务操作（发布、收藏）动态更新，不需要手动维护

这让我理解了为什么中大型前端应用需要状态管理——当多个页面、多个组件需要共享同一份数据时，Pinia 提供了比 props 层层传递更优雅的方案。

### 6.2 状态边界的判断

本次实训最大的收获是理解了**什么数据应该放入 Store，什么数据不应该放**：

- Store 应该放**跨页面/跨组件共享**的状态（用户信息、收藏列表）
- 表单临时输入、页面筛选条件等**局部状态**仍应留在组件内部
- Store 不是"全局变量池"，每个 Store 应该有明确的职责边界

### 6.3 技术笔记

- Pinia 的 Options Store 和 Setup Store 两种写法中，Setup Store（`defineStore('name', () => {...})`）更接近 Composition API，与 Vue 3 风格一致
- 收藏按钮需要 `event.stopPropagation()` 防止冒泡到卡片点击事件
- 响应式数据在模板中可以直接使用 `store.xxx`，不需要复杂解构
- 刷新后 Collection 丢失是内存状态的正常行为，需要持久化时再用 localStorage

---

## 七、文件变更清单

| 文件 | 操作 | 说明 |
|------|------|------|
| `src/stores/user.ts` | 新增 | 用户状态 Store |
| `src/stores/favorite.ts` | 新增 | 收藏状态 Store |
| `src/components/AppHeader.vue` | 修改 | 添加用户快捷入口 |
| `src/views/PublishView.vue` | 修改 | 发布人字段自动填充 + 发布计数 |
| `src/views/TradeView.vue` | 修改 | 添加收藏按钮 |
| `src/views/LostFoundView.vue` | 修改 | 添加收藏按钮 |
| `src/views/GroupBuyView.vue` | 修改 | 添加收藏按钮 |
| `src/views/ErrandView.vue` | 修改 | 添加收藏按钮 |
| `src/views/UserCenterView.vue` | 修改 | 全面重写对接 Store |
| `docs/evidence/Day5_Evidence.md` | 更新 | Day5 证据卡 |
