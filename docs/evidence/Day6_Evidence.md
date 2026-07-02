# Day6 证据卡 —— 注册登录、状态持久化与交互优化

> **日期：** 2026-07-02
> **实训主题：** Mock 注册登录、用户状态持久化、交互反馈完善与功能走查
> **关键词：** 注册登录、状态持久化、交互优化

---

## 一、任务完成情况

| 任务 | 内容 | 状态 |
|------|------|------|
| Task 1 | 在 db.json 中增加 users 数据资源 | ✅ 已添加 3 个示例账号 |
| Task 2 | 创建用户 API 模块 `src/api/user.ts` | ✅ 封装 getUsers / createUser / getUserByUsername |
| Task 3 | 增加登录和注册路由 | ✅ `/login` 和 `/register` 已配置 |
| Task 4 | 创建注册页面 `RegisterView.vue` | ✅ 含表单校验、用户名重复检查、自动登录 |
| Task 5 | 改造 userStore 支持登录/退出/恢复 | ✅ 移除模拟用户，改为 login/logout/restoreLogin |
| Task 6 | App.vue 启动时恢复登录状态 | ✅ onMounted 中调用 restoreLogin() |
| Task 7 | 创建登录页面 `LoginView.vue` | ✅ 含快速填充测试账号、错误提示 |
| Task 8 | 改造导航栏登录状态展示 | ✅ AppHeader 区分登录/未登录，增加下拉菜单和退出 |
| Task 9 | 改造发布页面的发布人逻辑 | ✅ 未登录阻断发布、自动填充当前用户名 |
| Task 10 | 改造个人中心未登录状态 | ✅ 未登录显示"请先登录"引导页 |
| Task 11 | 创建加载状态组件 `LoadingState.vue` | ✅ 支持 small/medium/large 三种尺寸 |
| Task 12 | 创建错误状态组件 `ErrorState.vue` | ✅ 含 Mock 服务提示和重新加载按钮 |
| Task 13 | 创建搜索组件 `SearchBar.vue` | ✅ 防抖 300ms、清空、回车搜索 |
| Task 14 | 为四个列表页增加加载/错误/搜索 | ✅ Trade/LostFound/GroupBuy/Errand 全部完成 |
| Task 15 | 优化收藏按钮状态展示 | ✅ 圆形按钮 + 收藏后粉红背景 + 心跳动画 |
| Task 16 | 优化发布表单体验 | ✅ 未登录不可提交、发布人字段禁用、错误提示 |
| Task 17 | 清理 AI 冗余代码 | ✅ 无 JWT/权限/Token 等超出范围代码 |
| Task 18 | 完整功能走查 | ✅ 见下方走查记录 |

---

## 二、注册登录设计

### 2.1 用户数据存储

**db.json 新增 users 集合：**

```json
{
  "users": [
    { "id": 1, "username": "zhangsan", "password": "123456", "displayName": "张同学", ... },
    { "id": 2, "username": "lisi", "password": "123456", "displayName": "李同学", ... },
    { "id": 3, "username": "wangwu", "password": "123456", "displayName": "王同学", ... }
  ]
}
```

### 2.2 注册流程

1. 用户在 `/register` 页面填写用户名（≥3字符）、密码（≥6字符）、确认密码、显示昵称
2. 前端校验通过后，先通过 `getUserByUsername()` 检查用户名是否已被注册
3. 若用户名可用，调用 `createUser()` 将新用户 POST 到 JSON Server 的 `/users`
4. 注册成功后自动调用 `userStore.login()` 保存登录状态
5. 页面自动跳转到首页

### 2.3 登录流程

1. 用户在 `/login` 页面输入用户名和密码
2. 调用 `getUsers()` 查询所有用户，在本地匹配用户名和密码
3. 匹配成功则调用 `userStore.login()` 保存登录状态，跳转首页
4. 匹配失败则显示"用户名或密码错误"

### 2.4 退出流程

1. 点击导航栏用户下拉菜单中的"退出登录"或个人中心"退出登录"
2. 调用 `userStore.logout()` 清空 Pinia 状态和 localStorage
3. 跳转到首页，导航栏恢复为"登录/注册"按钮

### 2.5 功能边界说明

**本项目实现的是前端实训中的 Mock 注册/登录功能，仅在本地 JSON Server 中模拟，不代表生产环境安全认证方案。**

**本日未实现的内容：**
- 密码加密/哈希
- JWT Token
- 后端 Session
- 短信验证码
- 邮箱验证
- 第三方登录
- 找回密码
- 权限路由
- 服务端安全校验
- 用户头像真实上传

---

## 三、状态持久化设计

### 3.1 为什么使用 localStorage

在本次实训项目中，我们使用 `localStorage` 实现登录状态持久化，原因如下：

1. **刷新保持登录**：Pinia 状态仅存在于内存中，刷新页面后丢失。localStorage 数据持久存储于浏览器，刷新后可恢复。
2. **简单实用**：对于前端实训项目，localStorage 是最直接的持久化方案，无需引入后端 Session 或 Token 机制。
3. **模拟真实体验**：虽然本项目不是生产级认证，但通过 localStorage 可以让用户体感到"刷新后仍保持登录"的真实效果。

### 3.2 持久化实现

- **存储键名**：`campus_market_user`
- **存储时机**：`userStore.login()` 调用时同步写入 localStorage
- **恢复时机**：`App.vue` 的 `onMounted` 中调用 `userStore.restoreLogin()` 从 localStorage 读取并恢复
- **清除时机**：`userStore.logout()` 调用时清空 localStorage

### 3.3 数据结构

localStorage 中存储的用户对象包含：id, username, displayName, avatar, school, college, grade, studentId, phone, email, createdAt, bio, publishedCount, soldCount, purchasedCount。

**注意：密码不存储在 localStorage 中，仅在登录校验时临时使用。**

---

## 四、交互体验优化

### 4.1 加载状态（LoadingState.vue）

- 双环旋转动画，支持 small/medium/large 三种尺寸
- 用于所有四个核心列表页面的首次数据加载

### 4.2 错误状态（ErrorState.vue）

- 警告图标 + 错误文案 + Mock 服务启动提示
- "重新加载"按钮，点击触发父组件 refetch
- 用于接口请求失败的场景

### 4.3 搜索组件（SearchBar.vue）

- 300ms 防抖输入，避免频繁过滤
- 支持回车搜索和点击搜索按钮
- 清空按钮一键清除
- 搜索结果数量实时显示

### 4.4 收藏按钮优化

- 未收藏：空心爱心 🤍，淡色圆形边框
- 已收藏：实心红心 ❤️，粉红背景 + 红色边框
- 点击时播放心跳动画（scale 缩放）

### 4.5 发布表单优化

- 未登录时显示醒目的橙色提示条，引导用户去登录
- 发布人字段自动填充当前用户名，且不可手动编辑
- 未登录时提交按钮禁用，hover 提示"请先登录后再发布"
- 提交中按钮显示"发布中..."并禁用

---

## 五、页面联动记录

| 联动页面 | 联动内容 |
|---------|---------|
| 导航栏 ⇄ userStore | 未登录显示"登录/注册"按钮；已登录显示用户头像、昵称和下拉菜单 |
| 发布页 ⇄ userStore | 未登录显示引导提示条，发布人自动填充当前用户 |
| 个人中心 ⇄ userStore | 未登录显示"请先登录"引导页；已登录展示完整用户资料和功能菜单 |
| 列表页 ⇄ favoriteStore | 收藏按钮状态实时反映是否已收藏 |
| 所有页面 ⇄ localStorage | 刷新后保持登录状态，页面联动不受影响 |

---

## 六、完整功能走查记录

| 步骤 | 测试内容 | 预期结果 | 实测结果 |
|------|---------|---------|---------|
| 1 | 启动 JSON Server (`npm run mock`) | 服务运行在 localhost:3001 | ✅ |
| 2 | 启动前端 (`npm run dev`) | 服务运行在 localhost:5173 | ✅ |
| 3 | 打开首页，查看导航栏 | 显示"登录"/"注册"按钮 | ✅ |
| 4 | 点击"注册"，创建新用户 testuser | 注册成功，自动登录，跳转首页 | ✅ |
| 5 | 检查 db.json | users 中新增 testuser 记录 | ✅ |
| 6 | 查看导航栏 | 显示 testuser 的昵称 | ✅ |
| 7 | 进入发布页 | 发布人自动填充为当前用户 | ✅ |
| 8 | 发布一条二手交易信息 | 发布成功，跳转到交易列表 | ✅ |
| 9 | 确认发布人是当前用户 | seller 字段为 testuser 的昵称 | ✅ |
| 10 | 进入二手交易页面 | 测试搜索功能（输入关键词） | ✅ |
| 11 | 收藏一条信息 | 收藏按钮变为红心 | ✅ |
| 12 | 进入个人中心 | 查看收藏，显示刚收藏的内容 | ✅ |
| 13 | 刷新页面 | 登录状态保持，头像和昵称不变 | ✅ |
| 14 | 点击退出登录 | 清空状态，导航栏恢复"登录/注册" | ✅ |
| 15 | 再进入个人中心 | 显示"请先登录"引导页 | ✅ |
| 16 | 使用 testuser 重新登录 | 登录成功 | ✅ |
| 17 | 停止 JSON Server，刷新列表页 | 显示错误状态和重新加载按钮 | ✅ |
| 18 | 恢复 JSON Server，点击重新加载 | 列表恢复显示 | ✅ |
| 19 | 构建项目 (`npm run build`) | 构建成功 | ✅ |

---

## 七、AI 协作记录

### 7.1 AI 帮助生成的内容

| 内容 | 说明 |
|------|------|
| `src/stores/user.ts` | AI 帮助重构了整个 Store，加入 login/logout/restoreLogin 方法和 localStorage 持久化 |
| `src/views/LoginView.vue` | AI 生成了完整的登录页面，包括表单、校验、错误提示和测试账号快速填充 |
| `src/views/RegisterView.vue` | AI 生成了注册页面，包括用户名重复检查、表单校验和注册后自动登录 |
| `src/components/LoadingState.vue` | AI 生成双环旋转动画加载组件 | |
| `src/components/AppHeader.vue` | AI 帮助区分登录/未登录状态的显示，增加用户下拉菜单和退出功能 |

### 7.2 人工调整内容

| 调整内容 | 原因 |
|---------|------|
| 删除原始 userStore 中的硬编码模拟用户数据 | Day6 要求改为登录驱动，不应保留写死的用户 |
| 修复 RegisterView 中 TypeScript 类型错误 | `users[0]` 可能为 undefined，需要正确窄化类型 |
| 确保所有表单字段 placeholder 提示"请先登录" | 引导未登录用户完成注册登录 |
| 收藏按钮从纯文字改为圆形边框按钮 | 提升视觉辨识度，与列表卡片风格统一 |
| 优化错误提示信息，统一提示 `npm run mock` | 帮助学生快速定位 Mock 服务问题 |
| 确保不生成 JWT/Token/权限路由相关代码 | 超出 Day6 范围，保持项目简洁 |
| 调整 localStorage key 命名 | 使用语义化的 `campus_market_user` 而非通用名 |

### 7.3 AI 使用经验

- **优点**：AI 能快速生成完整的登录/注册页面和 Store 重构代码，大幅提高开发效率
- **需要人工把关的地方**：TypeScript 类型安全、业务逻辑边界、用户体验细节（如未登录时的引导提示）
- **安全注意事项**：AI 可能生成 JWT/Token 等超出范围的代码，需要人工审查和删除

---

## 八、文件变更清单

| 文件 | 变更类型 | 说明 |
|------|---------|------|
| `db.json` | 修改 | 新增 users 集合，含 3 个示例账号 |
| `src/api/user.ts` | 新增 | 用户 API 模块（getUsers / createUser / getUserByUsername） |
| `src/stores/user.ts` | 重写 | 从模拟用户改造为 login/logout/restoreLogin 模式，增加 localStorage 持久化 |
| `src/App.vue` | 修改 | onMounted 中调用 restoreLogin() |
| `src/router/index.ts` | 修改 | 新增 /login 和 /register 路由 |
| `src/views/LoginView.vue` | 新增 | 登录页面 |
| `src/views/RegisterView.vue` | 新增 | 注册页面 |
| `src/components/AppHeader.vue` | 重写 | 区分登录/未登录状态，增加下拉菜单和退出 |
| `src/components/LoadingState.vue` | 新增 | 加载状态组件 |
| `src/components/ErrorState.vue` | 新增 | 错误状态组件 |
| `src/components/SearchBar.vue` | 新增 | 搜索栏组件 |
| `src/views/TradeView.vue` | 修改 | 增加搜索、加载、错误状态，优化收藏按钮 |
| `src/views/LostFoundView.vue` | 修改 | 增加搜索、加载、错误状态，优化收藏按钮 |
| `src/views/GroupBuyView.vue` | 修改 | 增加搜索、加载、错误状态，优化收藏按钮 |
| `src/views/ErrandView.vue` | 修改 | 增加搜索、加载、错误状态，优化收藏按钮 |
| `src/views/PublishView.vue` | 修改 | 未登录阻断发布、发布人自动填充且不可编辑 |
| `src/views/UserCenterView.vue` | 修改 | 未登录引导页、退出登录按钮 |

---

## 九、总结

Day6 是本项目中承上启下的关键一天。通过实现 Mock 注册/登录功能，项目从"开发者写死的模拟用户"转向了"用户可自主注册和登录的动态状态"。这是学生理解前端项目中用户状态管理本质的重要一步。

**核心收获：**
1. **注册登录**：理解了前端如何通过 JSON Server 模拟注册和登录流程，包括用户名重复检查、密码校验和用户状态保存
2. **状态持久化**：理解了 localStorage 在 Pinia 状态管理中的作用——让刷新后的页面仍能识别当前用户
3. **交互优化**：通过 LoadingState、ErrorState、SearchBar 等组件，让页面在不同状态下都能给用户清晰的反馈
4. **功能边界**：明确了 Mock 注册登录与生产级认证系统的区别，理解了"什么能做、什么不该做"的工程判断

---

> **Git 提交建议：** `feat: Day6 注册登录、状态持久化与交互体验优化`
