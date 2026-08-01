# CLAUDE.md

## 思想（宪法——遇到下面任何规则没覆盖的场景，回到这里判断）

- **Simple is better than complex.** (Zen)
- **Flat is better than nested.** (Zen) — 函数优于类、内联优于跳转、三行重复优于过早抽象
- **Explicit is better than implicit.** (Zen) — 依赖显式传入、配置显式注入、不靠模块级全局状态做隐式耦合
- **Readability counts.** (Zen) — 代码被读 > 被写。从业务角度命名，不用生僻词；「注释只写 Why」的前提是代码本身能说明 What
- **Signal-driven actors.** — Service 拥有私有状态，对外通信仅通过信号；Service 不持 View 引用（View 持 Service 引用以 connect 信号是允许的）
- **YAGNI — trust internals, validate at boundaries.** — 不写 hypothetical 防御，删除胜于注释掉，不留向后兼容别名
- **If the implementation is hard to explain, it's a bad idea.** (Zen) — 解释起来绕的设计，多半是错的

## 命名

- 类名 PascalCase，函数和变量 camelCase
- 函数名用动词前缀（PowerShell 风格）：`sendText`、`dispatch`、`add`、`remove`
- 选短词、常见词，第一次读代码的人也能看懂
- 类名提供了上下文后，去掉冗余名词：`DeviceTracker.dispatch()` 不写 `dispatchCommand()`
- 名词锁定到 CONTEXT.md，不用近义词：`device` 不写 `phone`，`command` 不写 `task`
- 不用 `_` 前缀标记模块内部函数——模块边界本身就是封装

## 反模式（看到就改）

**违反 Flat is better than nested：**

- 只做 if/elif 分发的包装函数 → 让调用方直接调对应函数
- 把类嵌在方法里但不用闭包 → 提升为模块级
- 类名已提供上下文时函数名还重复名词 → 砍掉名词
- 用 `_` 前缀标记模块内部函数 → 去掉，模块边界已经是封装

**违反 Explicit is better than implicit：**

- 模块级 `global` 可变状态伪装成单例 → 提升为类，或 frozen dataclass 显式注入
- 用 dict 传结构化数据 → 用 dataclass，IDE 补全 + 类型检查
- 传整个对象但只用其中一个方法 → 传 callable，依赖保持最窄

**违反 YAGNI：**

- 先规划测试框架再写代码 → 测试从真实故障中自然生长
- 多处文档描述同一个事实 → 一个事实一个位置，其余用链接

**违反 Simple is better than complex：**

- 能用轻方案时选了重方案 → 算一下实际负载再决定
- 把不属于本模块职责的逻辑混进来"顺手做了" → 保持每个模块的单一职责

**违反 Readability counts：**

- 注释或文档复述代码已经说明的事 → 删掉，代码自己说 What
