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

本节记录新文章的实际状态，不将文档记账、维护、现有页重做或视频成果计为新篇。状态核对时间：2026-10-10 00:50（Asia/Shanghai；2026-10-09 16:50 UTC）。

| 北京时间日期 | 主题 | 新篇状态 | 选题确认 | 文章 URL | 新文章提交 | 新文章验证 / 发布 |
| --- | --- | --- | --- | --- | --- | --- |
| 2026-10-08 | 未定 | 未发布，当日新篇目标未完成 | 七日候选及日期 / 顺序仍待审核 | 无 | 无 | 未进行新文章验收；无新文章上线 |
| 2026-10-09 | 勾股定理：四块三角形，拼出平方和 | 已正式发布（当日唯一新篇） | 2026-10-09 11:49 用户明确授权启动及 preview 通过后发布；其余七日候选未据此逐项获批 | [正式文章](https://crazycloud.cc/learn/pythagorean-theorem) | 首版 cb67bdf；正式版 [ede3089962251dc5edf2e3c77c530289778f84dc](https://github.com/crazycloudcc/ccblog/commit/ede3089962251dc5edf2e3c77c530289778f84dc) | 198/198 测试、lint、TypeScript、配置、冻结源 build/Pagefind 全过；独立数学覆盖 19,796 帧。Dream Loop 第一轮 6/10 后修正，第二轮独立视觉 8/10；真实桌面及 500px 窄窗口、键盘、起终点/中点/两向极值通过。精确 [preview CI 37908460303](https://github.com/crazycloudcc/ccblog/actions/runs/37908460303) 与 [生产 CI 37909364377](https://github.com/crazycloudcc/ccblog/actions/runs/37909364377) success；[生产部署](https://vercel.com/chainboxapp/ccblog/44KfUjfFgq6orYgZe1gdXP5dZwpx) Ready / Production / 精确 SHA / crazycloud.cc 已核实。线上公式、canonical、日期例子和 MIT 署名正常，两条旧路由实测 HTTP 308 保留 query；[详情与限制](experiments/dream-loop-2026-10-09/README.md) |

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

## 2026-10-10 新文章实际发布

- 真正开工：2026-10-10 00:00:35 Asia/Shanghai（2026-10-09 16:00:35 UTC）；此前仅选题研究，不提前计入新一天。
- 主题：[二分答案：最早什么时候够用](https://crazycloud.cc/learn/binary-search-on-answer)。2026-10-10 00:49:53 Asia/Shanghai（2026-10-09 16:49:53 UTC）首次实际确认正式站可读，计入 10 月 10 日唯一新篇。不是 10 月 9 日第二篇。
- 正式产品提交 `4e6783ad9ca872bc643a92333eaa65f1e79419ec`，205/205 测试、lint/types/config/冻结 build/Pagefind 通过；独立数学穷举 565,500 场景、6,171,558 帧，C++ UBSan 边界覆盖；Dream Loop 首轮 7.6 后修正，最终视觉 8.5/10。桌面与 500px 窄窗口真实截图、键盘验证通过；不声称真机触屏/屏幕阅读器验收。
- 精确 [preview CI 37961356766](https://github.com/crazycloudcc/ccblog/actions/runs/37961356766) success 后同 SHA 推进 main；[生产部署](https://vercel.com/chainboxapp/ccblog/92GskeS98BPimkUGqbBVmQUZom9X) Ready / Production / crazycloud.cc / 精确 SHA 已实读；精确 [生产 CI 37961767542](https://github.com/crazycloudcc/ccblog/actions/runs/37961767542) 于 16:50:13 UTC success。
- 含同批可选作者URL维护，不另计文章。完整来源、Dream Loop目标及已知限制见 [本次记录](experiments/dream-loop-2026-10-10/README.md)。

## 2026-10-10 既有课程澄清维护（不是新日更）

- 2026-10-09 22:07 UTC（Asia/Shanghai 10 月 10 日 06:07）确认生产部署 Ready：LIS 与二分答案增加静态双向延伸链接，明确 end / 追加与已证明可行 hi 的不同；勾股日期例子补三个正整数定义及 (1,1,√2) 反例。
- 产品提交 `393cef346cd824c2a5f5e78b15a8ae54ab61a092`；207/207 tests、lint/types/config/冻结 build/Pagefind；独立数学/源码及真实桌面/500px 窄窗口截图评审通过。图形算法未改，不将维护记新篇。
- 精确 [preview CI](https://github.com/crazycloudcc/ccblog/actions/runs/37996880510)、[生产 CI](https://github.com/crazycloudcc/ccblog/actions/runs/37997294685) success；[生产部署](https://vercel.com/chainboxapp/ccblog/81C1ceTdRxi7Qf3XCrqE5KhPAxkd) Ready / Production / crazycloud.cc / 精确 SHA 实读。10 月 10 日唯一新篇仍为二分答案。
- [范围、Dream Loop 与限制](experiments/lesson-clarity-2026-10-10/README.md)。没有声称手机真机、屏幕阅读器、收录或流量提升。

## 2026-10-10 勾股计算精度提示（不是新日更）

- 2026-10-10 03:09:44UTC（Asia/Shanghai11:09:44）确认生产Ready。共享常见误区补“中间保留精度，最后按要求取近似值”，单位正方形两对角线例子2√2→2.83，对照提前近似1.41+1.41→2.82；不判断外部题目答案。
- 产品提交 `06ed4a240e4602b143d16acbd2dbbdbf2f13fe18`，208/208tests、lint/types/config/冻结build/Pagefind通过；BigInt精确舍入区间回归、独立数学与真实桌面/500px截图审阅通过。标题/首次发布日期/路由/图形算法未改，不计第二篇。
- [previewCI38019258727](https://github.com/crazycloudcc/ccblog/actions/runs/38019258727)、[生产CI38019482807](https://github.com/crazycloudcc/ccblog/actions/runs/38019482807) success；[生产部署](https://vercel.com/chainboxapp/ccblog/89jgKisdEu2qwZLVKvh8VVMrxrH8) Ready / Production / crazycloud.cc / 精确SHA实读。[完整证据与限制](experiments/rounding-clarity-2026-10-10/README.md)。

## 2026-10-10 LIS 单步预测引导（不是新日更）

- 2026-10-10 09:13 UTC（Asia/Shanghai 17:13）确认正式页出现“先预测，再验证”提示：在单步前预测替换位置或追加，再对照并解释长度变化。共享静态答案继续直接可读，算法、核心图形及首次发布日期不变。
- 产品提交 `2207565ff0d715a3c42ca876dd54f72b6bbd0ad9`；209/209 tests、lint/types/config/冻结 build/Pagefind 通过；独立数学另验 44,922 前缀，Dream Loop 桌面/500px 真实截图独审通过。
- [preview CI](https://github.com/crazycloudcc/ccblog/actions/runs/38040304413) 与 [生产 CI](https://github.com/crazycloudcc/ccblog/actions/runs/38040484513) success；[生产部署](https://vercel.com/chainboxapp/ccblog/EKYSi4UG9qCS9cDyTmZi5w5euk8x) Ready / Production / crazycloud.cc / 精确 SHA 已实读。
- [完整记录与截图](experiments/lis-prediction-2026-10-10/README.md)。不计第二篇，不声称真机、屏幕阅读器或学习效果验收。

## 2026-10-10 勾股作高应用澄清（不是新日更）

- 2026-10-10 13:14UTC（Asia/Shanghai21:14）确认正式页新增说明：非直角三角形的原三边不能直接套用，但作高后可在形成的直角三角形中分别使用；垂足可能在延长线上，求解仍需足够已知条件。核心图形与首次发布日期不变。
- 产品提交 `ed6b1738b4b95ba9978e40fd297619a3dfd1aeb5`；210/210tests、lint/types/config/冻结build/Pagefind通过，独立数学及真实桌面/500px截图审阅无须修项。
- [previewCI38054669077](https://github.com/crazycloudcc/ccblog/actions/runs/38054669077)、[生产CI38054849538](https://github.com/crazycloudcc/ccblog/actions/runs/38054849538) success；[生产部署](https://vercel.com/chainboxapp/ccblog/A2duDevDKuueHEnCh7e17x9pvPrc) Ready/Production/crazycloud.cc/精确SHA实读。[完整记录与限制](experiments/altitude-clarity-2026-10-10/README.md)。不计第二篇，不将常青应用线索称为热点或增长证据。
