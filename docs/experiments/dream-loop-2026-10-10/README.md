# 二分答案新文章 — 2026-10-10（Asia/Shanghai）

## 范围与真实时间

- 方案研究始于 2026-10-09 15:57 UTC，仍属北京时间 10 月 9 日；产品实施在真实 16:00:35 UTC 后开始，计入 10 月 10 日，不是 10 月 9 日第二篇。
- 新页面 `/learn/binary-search-on-answer`，机器并行生产的时间搜索空间、单调可行性与 first-true 闭区间；与既有数组查找课目标不同。
- 原有二分/LIS Notes、Learn 双向入口与两条旧 HTTP 308/query 行为保留。新课没有伪造 Notes 对应页。
- 同批小维护：Learn Article `author.url` 指向启用的 About 页，使用配置域名；About 关闭时不输出。身份来自站点 About 可见文字与同一作者配置，不推断外部 X 账号归属。

## 基线与环境

- 从远端 preview `2e9685a03333aa2f857fe89964f0b96add537b48` 的完整树物化：282 个 blob 逐 Git blob SHA 一致；main 为 `ede3089962251dc5edf2e3c77c530289778f84dc`。
- 只用现有 dot 云端，隔离工作目录；不覆盖旧工作树的 20 项遗留改动，不使用用户电脑、新环境、新分支、凭据、跟踪器或付费 API。
- package/lock 与既有依赖一致，无依赖变更。已读当前 Next 16.2.10 client-component 指南。

## 来源与图形目标

- [CP-Algorithms](https://cp-algorithms.com/num_methods/binary_search.html#search-on-arbitrary-predicate)、[USACO Guide](https://usaco.guide/silver/binary-search)、[CSES Factory Machines](https://cses.fi/problemset/task/1620/) 是算法/模型来源。需求证据是历史学习问题，不宣称新热点或搜索量。
- AetherViz 教学结构按原生 React/SVG 实现，不执行其外部 CDN/Three.js 要求；保留 MIT 许可。沿用 Dream Loop Pro 固定版本 `9bddb901f7d071cfefdd21e264267c757177a9df`。
- [生成目标](target-generated.png)是内置图像工具生成的 UI 布局参考，不是运行截图，也不是教学证明。目标图错误地给各机器 9 秒位置都画了产品点、阶梯数值与边界文字存在误差，**不按这些错误实现**。实现必须由真实 floor(t/k) 与测试得出：`[2,3,7]`、目标 8，8 秒 7 件，9 秒 8 件。
- 图形舞台包含机器环形进度、完成时间轨道、累计产量阶梯、目标线、可行域和二分区间，与 C++ 行同步。连续动画只表示观察时间，不伪装成整数代码执行。

## 验证进度与限制

- 首轮 204 项测试通过；独立审阅指出动画中 8.96 秒四舍五入成 9.0 会与 7 件产量矛盾，已改为向下显示到一位小数，切入探索时量化到 0.1 秒。最终相关测试与全量检查另行记录。
- 本地云浏览器首次 `localhost:3112` 连接拒绝；服务绑定修复后选择该错误页触发浏览器协议安全策略阻止。未绕过，停止本地浏览器路线。计划仅访问原本允许的 preview 页面；本地构建通过不算真实浏览器验收。
- 发布状态仍待精确 preview SHA、CI/部署、可用截图与独立视觉评审；此文档不构成上线成功声明。
- GSC/当前 Production 完整 UTC 日数据未知；不将测试数、视觉评分或发布当作流量增长。
