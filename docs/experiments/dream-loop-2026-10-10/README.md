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

## 16:31 UTC 暂停点

- 最终本地 205/205 测试、lint、TypeScript、配置校验、冻结源 production build 与 Pagefind 通过。冻结构建直接运行 Next、未联网刷新无关 App 元数据；远端 CI 尚未开始。
- [独立数学报告](math-review.md)：565,500 场景、6,171,558 状态帧、16,227,900 个小数产量点；提取原 C++ 运行 UBSan，50,045 边界与 350,315 判定均通过。分数动画显示与中途切入探索回归通过。
- 新 OG PNG blob `8782f0c515ef8c0f7fb028b13275f88b0a1a855a`、生成目标 PNG blob `d08ba2e1e5ca1de8f2077b543b50d8579f5eed96` 已上传且与本地哈希一致。
- 随后基于既有 preview 创建16文件候选树的 GitHub create_tree 返回 `user cancelled MCP tool call`。未获 tree SHA；未创建提交、未更新任何分支。停止写入并报告父任务，未重试或换工具绕过。
- 因未部署 preview，真实截图/视觉评分、精确 preview CI/Ready 与生产均尚未完成。此结果是待续作的本地候选，不是新文章发布。

## 恢复与第一轮真实 preview

- 上述暂停记录是当时状态。用户明确继续后，同一创建树操作重试成功；preview 更新曾返回取消，明确继续授权后的同参数一次重试成功。取消原因未知，不推断为权限设置问题。
- 初版 preview 提交 `b8fe53173b2543df593ca1da18e5c041d1dcd13c`；[CI 37959955346](https://github.com/crazycloudcc/ccblog/actions/runs/37959955346) 于 2026-10-09 16:34:54 UTC success。
- [Vercel preview](https://vercel.com/chainboxapp/ccblog/8yPLtT2USYH2e9ohH8aoYGXbPVNr) 已实读 Ready / Preview / 精确源码 SHA；16:36 UTC 云端浏览器正常加载 dev.crazycloud.cc 新课，取得真实截图。无手动部署。
- 真实桌面交互：默认 9 秒 8 件；下一步动画收束到 8 秒 7 件并高亮代码；零需求 0；两台 4 秒、需求 7 的边界 16；非法 `4,40` 保留上一有效场景并报错；reset、滑杆键盘 Home/End、单机 `[3]` 需求 5 得 15 秒、非单调反例展开均通过。
- 独立视觉第一轮 7.6/10，未通过 8 分门槛：滑杆在首屏下方，不利于按提示探索；核心代码长行裁切、字号偏小。修正把滑杆放在图形上方，核心代码字号从 11px 提升到 12px、逐行可换行并保留行号悬挂缩进，算法与状态不改。增加 SSR 顺序与代码换行回归断言。需要新的完整检查与精确 preview 截图复审。
- 本轮操作失误记录：首次重跑命令的编辑相对路径错误，且配置检查脚本名拼错，未形成完整验收。已使用正确目录/脚本重启整套检查，不能将失败那次记作通过。

## 第二轮修正中的复核

- `ad3ace587cc067eb07523918885144ae717db249` 已自动部署到 [preview ARQECvbEr5Xc33m9bawoUTYJ9TJm](https://vercel.com/chainboxapp/ccblog/ARQECvbEr5Xc33m9bawoUTYJ9TJm)，Ready / Preview / dev.crazycloud.cc / 精确 SHA 实读。
- 16:41 UTC 真实截图证实滑杆首屏可用、代码不再横向裁切。独立复核发现行号可能继承负 `text-indent`，截图确实行号不清楚；继续修正行号 `text-indent:0`，侧栏略加宽以减少无益软换行，并微缩首屏间距。仍不推进 main。
- 数学复核确认核心算法和静态 lesson 哈希不变；将滑杆还原位置后的完整组件哈希与原审计版相同，证明行为实现未变。7 项 focused/SSR 通过，新增行号 CSS 回归；最终整套检查再次重跑。

- 16:42 UTC 真实播放过程还发现原生 range 会按 step=0.1 对连续 value 再四舍五入，导致文本 3.2、辅助功能 range 3.3；为避免 8.96 秒被读成 9 秒，把 range value 绑定到与文本相同的向下量化显示值。连续 SVG/time 与产量算法不变。独立审阅确认方向正确，并补做 RAF / hooks 边界回归；最终检查在此修正后重新运行。

## 最终发布候选与验收

- 最终产品提交 `4e6783ad9ca872bc643a92333eaa65f1e79419ec`，树 `90ee9e891ae711b52899802eea526f3468f26f79`。全部 205/205 tests、lint、TypeScript、配置、冻结源 build 与 Pagefind（17 页）在最后 range 修正后通过，详见 `checks/*-final.log`。
- 精确 [preview CI 37961356766](https://github.com/crazycloudcc/ccblog/actions/runs/37961356766) success；[preview 部署](https://vercel.com/chainboxapp/ccblog/wrPtXEQbZYr9nvgBEgqZYEJFJ3dp) Ready / Preview / 源码完整 SHA 与 dev.crazycloud.cc 实读。
- 最终独立视觉 **8.5/10**（构图 2.7/3、色彩 2.6/3、材质 2.4/3、细节 0.8/1），通过 8 分门槛。[首轮截图](preview-initial.png) → [最终桌面截图](preview-final-desktop.png)；[独审报告](visual-review-final.md)。评分是本次图像评审，不是用户满意度、性能或流量指标。
- 真实云端 Chromium 500px 窄窗口：[首屏](preview-final-narrow-top.png)、[完整图形](preview-final-narrow-graph.png)。最终 Home/End 键盘探索读数 0 秒/0 件与 16 秒/15 件正常，reset 返回 9 秒/8 件。窄窗口无可见控件重叠/横向溢出；**没有真实手机、触屏、屏幕阅读器或 FPS 验收**。
- [数学独审](math-review.md) 后续验证 40 个真实 hooks/RAF 动画采样：实际 8.95238 秒时 range=8.9、显示 8.9、产量 7；切入探索取消 RAF，停在 8.9。算法/lesson 哈希保持不变。
- 16:48 UTC 重新核对远端 main=`ede3089`、preview=`4e6783a` 无并发变化后，main 以 expected SHA / force=false 推进同一已验收提交。生产 CI、自动部署及最终域名确认需待下一节实际回执；此时不把分支更新冒充正式可用。

## 正式可用回执

- 2026-10-09 16:49 UTC 实读 [生产部署](https://vercel.com/chainboxapp/ccblog/92GskeS98BPimkUGqbBVmQUZom9X)：Ready / Production / main / 精确 `4e6783ad9ca872bc643a92333eaa65f1e79419ec` / crazycloud.cc 域名绑定。
- 16:49:53 UTC 单次正式站浏览器确认 [新文章](https://crazycloud.cc/learn/binary-search-on-answer) 可读，默认 9.0 秒、8 件、完整静态讲解和 2026-10-10 日期正常。正式发布时间按本次首次实际可读证据记为北京时间 2026-10-10。未为重复 QA 再访问旧路由。
- 本地最终构建已核验 canonical、Article 日期及 `author.url=https://crazycloud.cc/about`，sitemap 含新课；当前生产网络层这批 metadata 未另行抓取。旧 Notes 与 308/query 配置未更改，回归测试通过。
- 未读到 GSC / crazycloud.cc Production 完整 UTC 日指标，均为未知；不宣称收录、搜索量、排名或流量增长。

- 精确 [生产 CI 37961767542](https://github.com/crazycloudcc/ccblog/actions/runs/37961767542) 在 2026-10-09 16:50:13 UTC success。后续回执仅提交 preview 的 docs，不再次修改或发布产品 main。
