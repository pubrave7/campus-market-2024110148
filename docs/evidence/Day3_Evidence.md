Day3 证据卡：Mock 数据建模与列表渲染

> **日期**：2026-06-29
> **实训主题**：Mock 数据建模、JSON Server 接口模拟与页面列表渲染

---

一、本日工作概述

本日完成了"校园轻集市"项目的 Mock 数据建模、JSON Server 接口模拟、Axios 请求封装以及四个核心业务页面的列表渲染，实现了从"静态页面骨架"到"数据驱动页面"的关键转变。

---

二、Mock 数据设计

2.1 数据集合概览

在 `db.json` 中设计了四组核心业务数据：

| 数据集合 | 数量 | 对应页面 | 主要字段 |
|---------|------|---------|---------|
| `trades` | 8条 | 二手交易 | title, price, category, condition, seller, publishTime, location, image, status |
| `lostFounds` | 7条 | 失物招领 | type, title, itemName, description, location, date, contact, status |
| `groupBuys` | 7条 | 拼单搭子 | type, title, description, targetCount, currentCount, deadline, location, initiator, status |
| `errands` | 7条 | 跑腿委托 | type, title, description, reward, pickupLocation, deliveryLocation, deadline, publisher, status |

2.2 我的设计思路

在设计 Mock 数据时，我重点考虑了以下原则：

1. **贴近校园场景**：所有数据内容全部围绕校园生活展开，例如教材交易、图书馆失物、考研搭子、代取快递等真实需求；
2. **字段命名统一**：遵循驼峰命名法（camelCase），如 `publishTime`、`targetCount`、`currentCount`，确保前后端约定一致；
3. **数据状态区分**：每条数据都包含 `status` 字段，支持 `open`（进行中）、`closed`（已关闭）、`done`（已完成）、`claimed`（已接单）等不同状态，为后续交互（如接单、关闭）预留空间；
4. **占位图策略**：二手交易的 `image` 字段使用 `placehold.co` 占位图服务，不同分类使用不同配色，便于视觉区分；
5. **数据量充足**：每类数据至少 7 条以上，覆盖多个分类维度，能够充分测试筛选功能。

2.3 AI 设计对比

使用 AI 工具辅助生成了部分 Mock 数据结构。以下是"我的设计"与"AI 设计"的对比：

| 对比维度 | 我的设计 | AI 设计 | 最终采用 |
|---------|---------|---------|---------|
| trades 字段 | 基础字段 + status + location | AI 增加了 userId、images数组、tags、viewCount 等字段 | 采用我的设计，去掉了 userId、images数组等复杂字段 |
| lostFounds 字段 | type + itemName | AI 设计了复杂的用户关联表和物品分类枚举 | 采用我的设计，保持扁平结构，避免不必要的关联 |
| groupBuys 字段 | targetCount / currentCount | AI 使用了 targetCount / currentCount（一致） | 两者一致，直接采用 |
| errands 字段 | pickupLocation + deliveryLocation | AI 设计了 address 对象（含经纬度） | 采用我的设计，地址用简单字符串描述更符合校园场景 |
| 数据条数 | 7-8条 | AI 建议 5 条 | 最终准备了 7-8 条，确保筛选后有足够的展示内容 |

**AI 的主要优点**：
- 能快速生成数据结构的 TypeScript 接口定义；
- 数据内容多样化，能覆盖更多边缘场景。

**AI 的主要问题**：
- 倾向于设计真实后端架构（用户表、订单表、评论表等），超出 Day3 需求；
- 字段过于复杂（数组嵌套、多级对象），增加了 JSON Server 的使用难度；
- 部分数据不够贴合校园场景（如设计了电子产品的具体型号参数）。

**人工修改内容**：
- 简化了数据结构，去掉多表关联，保持扁平；
- 将 `images` 数组改为单个 `image` 字符串，与占位图方案匹配；
- 将地址相关字段从嵌套对象改为简单字符串；
- 增加了中文校园场景化描述，使数据更有代入感；
- 统一了所有集合的 `status` 字段值（open/closed/done/claimed）。

---

三、JSON Server 接口模拟

 3.1 配置方案

在 `package.json` 中新增了 `mock` 脚本：

```json
"mock": "json-server --watch db.json --port 3001"
```

启动后，JSON Server 自动为 `db.json` 中的四个集合生成 RESTful API 端点：

- `GET /trades` → 二手交易列表
- `GET /lostFounds` → 失物招领列表
- `GET /groupBuys` → 拼单搭子列表
- `GET /errands` → 跑腿委托列表

3.2 接口验证

通过浏览器访问 `http://localhost:3001/trades` 等端点，确认数据能正常以 JSON 格式返回。

---

四、Axios 请求封装

 4.1 基础实例（`src/api/http.ts`）

创建了 Axios 基础实例，配置了 `baseURL` 和 `timeout`：

```typescript
const http = axios.create({
  baseURL: 'http://localhost:3001',
  timeout: 5000,
})
```

**简约原则**：Day3 阶段不加入 JWT Token、权限拦截、复杂错误码处理等逻辑，保持代码清晰易懂。

 4.2 业务 API 模块

按业务模块拆分了四个 API 文件：

| 文件 | 方法 | 返回类型 |
|------|------|---------|
| `src/api/trade.ts` | `getTrades()` | `TradeItem[]` |
| `src/api/lostFound.ts` | `getLostFounds()` | `LostFoundItem[]` |
| `src/api/groupBuy.ts` | `getGroupBuys()` | `GroupBuyItem[]` |
| `src/api/errand.ts` | `getErrands()` | `ErrandItem[]` |

每个文件都导出了对应的 TypeScript 接口，提供类型安全保障。

---

五、列表渲染实现

5.1 页面改造

将四个核心页面从"硬编码数据"改造为"接口驱动渲染"：

1. **TradeView.vue**（二手交易）：在 `onMounted` 中调用 `getTrades()`，保留分类筛选功能，使用 `ItemCard` 组件渲染卡片网格；
2. **LostFoundView.vue**（失物招领）：在 `onMounted` 中调用 `getLostFounds()`，保留失物/招领 Tab 切换；
3. **GroupBuyView.vue**（拼单搭子）：在 `onMounted` 中调用 `getGroupBuys()`，保留类型筛选和进度条展示；
4. **ErrandView.vue**（跑腿委托）：在 `onMounted` 中调用 `getErrands()`，保留任务类型筛选和状态徽标。

5.2 公共组件

- **ItemCard.vue**：通用列表卡片组件，支持 `title`、`image`、`icon` 属性，通过插槽 `meta` 和 `footer` 灵活定制内容（在 TradeView 中使用）；
- **EmptyState.vue**：无数据状态组件，当接口返回空数组时显示友好提示，支持自定义 `message` 属性。

 5.3 数据驱动验证

每个页面的内容 100% 来自 API 接口数据，确认了以下状态处理：

- **数据正常**：显示列表内容；
- **数据为空**：显示 EmptyState 空状态提示；
- **请求失败**：控制台输出错误日志（为后续完善错误提示预留）。

---

六、关键词环

本日核心知识点：**Mock 数据** → **JSON Server** → **Axios 封装** → **列表渲染** → **数据驱动页面**

---

 七、遇到的问题与解决

| 问题 | 原因 | 解决方法 |
|------|------|---------|
| GroupBuyView 字段名不匹配 | db.json 使用 `targetCount`/`currentCount`，而旧页面使用 `target`/`current` | 统一修改页面模板中的字段引用 |
| ErrandView 地址字段不一致 | db.json 拆分为 `pickupLocation`/`deliveryLocation`，页面原本使用单一 `location` | 更新模板为 `pickupLocation` → `deliveryLocation` 的展示方式 |

---

八、自我检查

- [x] db.json 包含四类核心业务数据（每类 ≥5 条）
- [x] JSON Server 可正常启动并返回数据
- [x] src/api/http.ts 完成 Axios 基础封装
- [x] 四个业务 API 模块均创建完毕
- [x] ItemCard.vue 和 EmptyState.vue 组件可用
- [x] 四个核心页面完成数据请求和列表渲染
- [x] 页面内容来自接口，非硬编码
- [x] 项目可正常构建（`npm run build-only` 通过）
- [x] Day3 证据卡已编写
