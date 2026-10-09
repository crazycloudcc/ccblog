# 文章与交互页面发布台账

本表从 2026-10-07 开始维护，日期按北京时间（Asia/Shanghai）记录。它记录实际发布，不是选题批准单；文章 frontmatter 日期、Git 首次收录日期与首次线上可用日期不能互相替代。

## 已有原文与交互首版

| 页面 | 原文标注日期 | 首次线上日期 | 交互首版与提交 | 验证 |
| --- | --- | --- | --- | --- |
| [二分查找原文](https://crazycloud.cc/blog/binary-search) / [交互版](https://crazycloud.cc/blog/binary-search/visual) | 2026-08-05 | 原文历史上线日期未核实；交互版 2026-10-07 | [66e2a7e](https://github.com/crazycloudcc/ccblog/commit/66e2a7ec61f202243779dc1582c62015d578eeee)：新增交互伴读页，未新建原文 | 首版 159 项测试、lint、TypeScript、build 通过；[生产 CI](https://github.com/crazycloudcc/ccblog/actions/runs/37572659869) success；[生产部署](https://vercel.com/chainboxapp/ccblog/BEDnF8rRtFXgJvEKewySd1BPsfbc) Ready |
| [LIS 原文](https://crazycloud.cc/blog/longest-increasing-subsequence) / [交互版](https://crazycloud.cc/blog/longest-increasing-subsequence/visual) | 2026-08-06 | 原文历史上线日期未核实；交互版 2026-10-07 | 同上：严格递增 / 非递减 tails 对比、步进、自测；仍是卡片式首版 | 与二分首版同一提交、CI 和部署；尚未进行新版图形视觉重做 |

两篇原文最早可追溯到仓库提交 [8729a23](https://github.com/crazycloudcc/ccblog/commit/8729a23e10402b79a46ca539781d8a2e72774336)（2026-08-07）；这只是 Git 收录证据，不是首次上线证明。

## 后续变更

| 上线日期 | 页面与变更 | 提交 | 验证 |
| --- | --- | --- | --- |
| 2026-10-07 | 二分交互页重做：满幅图形舞台、正确 / 错误双轨 SVG、区间与指针动画、播放 / 暂停 / 速度 / 步进 / 重置、减少动画支持。属于现有页面重做，不计新文章；LIS 未改 | [255da2b](https://github.com/crazycloudcc/ccblog/commit/255da2b10278fc861f42c33cf6206380b885a5c7) | 170 项测试、lint、TypeScript、build 通过；[preview CI](https://github.com/crazycloudcc/ccblog/actions/runs/37574927443) success 后推进 main；[生产 CI](https://github.com/crazycloudcc/ccblog/actions/runs/37575089755) success；[生产部署](https://vercel.com/chainboxapp/ccblog/J6ztKZuLRSJwetSMpJqfNpjaDwqJ) Ready，精确 SHA 与 crazycloud.cc 绑定核实 |

上述部署状态来自发布时核验。自动化与源码检查不等于真实画面验收：首版未做浏览器功能验收；重做版浏览器访问被阻止，未取得桌面 / 移动画面截图，也未绕过限制。

## 日更记账与发布规则

- 2026-10-07 已完成二分 / LIS 交互首版及二分重做，不为补数量再发文章
- 自 2026-10-08 起按北京时间每个自然日一篇新文章记账；现有页重做不抵作新篇
- 2026-10-08 至 2026-10-14 的七日候选原未获逐项批准。2026-10-09 11:49（北京时间）用户明确授权启动今日新文章及 preview 验证通过后正式发布，今日选用勾股定理；这不代表其余候选、日期或顺序全部获批。
- 后续记录实际文章 URL、首次上线日期、提交与验证证据；不能把计划写作已发布
- 仅通过 Git 自动部署；先核对远端，preview CI 和部署成功后再推进同一提交到 main；不手动触发 Vercel 部署

## 每日新篇状态

本节记录新文章的实际状态，不将文档记账、维护、现有页重做或视频成果计为新篇。状态核对时间：2026-10-09 16:59（Asia/Shanghai；2026-10-09 08:59 UTC）。

| 北京时间日期 | 主题 | 新篇状态 | 选题确认 | 文章 URL | 新文章提交 | 新文章验证 / 发布 |
| --- | --- | --- | --- | --- | --- | --- |
| 2026-10-08 | 未定 | 未发布，当日新篇目标未完成 | 七日候选及日期 / 顺序仍待审核 | 无 | 无 | 未进行新文章验收；无新文章上线 |
| 2026-10-09 | 勾股定理：四块三角形，拼出平方和 | 首版 preview 已部署；独立视觉审阅发现布局缺口，二轮修正待复验，未正式发布 | 2026-10-09 11:49 用户明确授权启动新文章；其余七日候选未据此逐项获批 | `/learn/pythagorean-theorem`（计划发布路径） | 首版 cb67bdf；二轮修正待提交 | 含 10/24/26 日期例子的最终本地源已重跑完整 198/198 回归、lint、TypeScript、配置校验、冻结源 production build 与 Pagefind（16 页），全部通过；静态 HTML/Markdown/sitemap/llms 已核验。独立数学与 React 19 SSR 审阅已完成（19,796 帧），日期段独立内容校对通过。首版精确 preview CI 37907379751 success，Vercel Ready/dev 域名核验通过；真实截图独立视觉评分 6/10，公式折叠、图形偏小，二轮已修正并重跑 198 项及完整本地检查；二轮精确 preview 与生产仍未验证 |

## 2026-10-07 栏目迁移（不是新日更）

- 建立独立「图解实验室」`/learn`，与 Notes 并列；二分与 LIS 迁到 `/learn/binary-search`、`/learn/longest-increasing-subsequence`
- 保留两篇原 Notes 与双向入口。原 `/blog/.../visual` 使用 Next 配置 HTTP 308 永久重定向，保留查询参数；历史首发链接继续可用
- 栏目当前只展示实际存在的算法内容，难度、前置和时长估计不代表学习完成记录
- 此次仅栏目迁移；二分满幅双轨与播放算法保留，LIS 没有视觉重做，不计新文章。七日候选仍未批准
- 具体发布提交、CI 和部署证据以本次发布报告为准；本条不是上线成功声明。未完成真实浏览器 / 手机视觉验收，不将静态和自动化检查写作画面验收
- 后续规范见 [图解实验室栏目规范](./visual-lab.md)

## 2026-10-07 两课搜索与阅读基础补齐（不是新日更）

- 为现有二分和最长递增子序列 Learn 补全知识名、静态答案、条件/边界、逐步例子、复杂度、常见误区、仓库既有作者和参考资料，保持图形主舞台和 Notes 双向入口
- 课程数据统一驱动页面、独立 Learn Article/BreadcrumbList、canonical、实际日期的 sitemap 和纯文字阅读版；两课独立图解 OG，llms.txt 增加课程入口
- 本次是已有两课的 SEO/GEO 基础补齐，不计新篇，不代表任何收录、排名或 AI 引用增长；七日候选继续待审
- 本条记录变更范围，不冒充上线成功。精确提交、preview / 生产 CI 与部署 Ready / 域名证据由对应发布报告记录；未进行真实桌面/手机画面验收
