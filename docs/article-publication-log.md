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

本节记录新文章的实际状态，不将文档记账、维护、现有页重做或视频成果计为新篇。状态核对时间：2026-10-14 00:12（Asia/Shanghai；2026-10-13 16:12 UTC）；新篇实施中与正式完成分别记录。

| 北京时间日期 | 主题 | 新篇状态 | 选题确认 | 文章 URL | 新文章提交 | 新文章验证 / 发布 |
| --- | --- | --- | --- | --- | --- | --- |
| 2026-10-08 | 未定 | 未发布，当日新篇目标未完成 | 七日候选及日期 / 顺序仍待审核 | 无 | 无 | 未进行新文章验收；无新文章上线 |
| 2026-10-09 | 勾股定理：四块三角形，拼出平方和 | 已正式发布（当日唯一新篇） | 2026-10-09 11:49 用户明确授权启动及 preview 通过后发布；其余七日候选未据此逐项获批 | [正式文章](https://crazycloud.cc/learn/pythagorean-theorem) | 首版 cb67bdf；正式版 [ede3089962251dc5edf2e3c77c530289778f84dc](https://github.com/crazycloudcc/ccblog/commit/ede3089962251dc5edf2e3c77c530289778f84dc) | 198/198 测试、lint、TypeScript、配置、冻结源 build/Pagefind 全过；独立数学覆盖 19,796 帧。Dream Loop 第一轮 6/10 后修正，第二轮独立视觉 8/10；真实桌面及 500px 窄窗口、键盘、起终点/中点/两向极值通过。精确 [preview CI 37908460303](https://github.com/crazycloudcc/ccblog/actions/runs/37908460303) 与 [生产 CI 37909364377](https://github.com/crazycloudcc/ccblog/actions/runs/37909364377) success；[生产部署](https://vercel.com/chainboxapp/ccblog/44KfUjfFgq6orYgZe1gdXP5dZwpx) Ready / Production / 精确 SHA / crazycloud.cc 已核实。线上公式、canonical、日期例子和 MIT 署名正常，两条旧路由实测 HTTP 308 保留 query；[详情与限制](experiments/dream-loop-2026-10-09/README.md) |
| 2026-10-10 | 二分答案：最早什么时候够用 | 已正式发布（当日唯一新篇） | 用户日更自主迭代授权 | [正式文章](https://crazycloud.cc/learn/binary-search-on-answer) | 4e6783ad9ca872bc643a92333eaa65f1e79419ec | 2026-10-09 16:49:53UTC首次正式可读；205tests，详见下方实际发布记录 |
| 2026-10-11 | 相似三角形：路灯下，影长和距离怎样变化 | 已正式发布（当日唯一新篇） | 用户日更自主迭代授权，真实常青教学需求 | [正式文章](https://crazycloud.cc/learn/similar-triangles) | 36ca87a4ec6ea87b8a9f4951d6a39ffa2f685db3 | 2026-10-10 16:40:54UTC首次正式可读；219tests，独立数学/Dream Loop8.6，精确preview与生产CI/Ready通过；详见下方记录 |
| 2026-10-12 | 弧度：一段弧，有几个半径长？ | 已正式发布（当日唯一新篇） | 用户日更自主执行授权；依据实际常青学习需求，不称热度 | https://crazycloud.cc/learn/radians | 6522e3c1b16c3808a4017628260b7692b6d3ee00 | 2026-10-11 16:34:20UTC首次确认正式可读；229tests，独立数学审阅及Dream Loop修正后8/10，精确preview和生产CI/Ready/域绑定通过 |
| 2026-10-13 | 最大公约数：把余数留在画面里 | 已正式发布（当日唯一新篇） | 用户日更自主执行；常青需求 | https://crazycloud.cc/learn/euclidean-algorithm | b01692c8aebf6fac121f2c96266171f409c82a38 | 2026-10-12 16:49:46UTC正式完成，240tests及独立数学/Dream Loop、精确preview和生产CI/Ready；详见下方记录 |
| 2026-10-14 | 两点距离：负坐标为什么仍然用相减 | 实施中，未正式发布 | 用户日更自主执行；2017跨象限原问与OpenStax教学依据 | /learn/coordinate-distance（待上线） | 待验收 | 2026-10-13 16:00:16UTC后启动同题，待精确preview/生产闭环，不提前计完成 |

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

## 2026-10-11 新文章实际发布

- 按用户后续明确的每天新图解自主执行授权选题，不再等待旧七日计划逐项审核；旧候选仍仅参考，10月8日未完成事实不变。
- 实际启动 2026-10-10 16:01:38 UTC / AsiaShanghai 2026-10-11 00:01:38，主题“相似三角形：路灯下，影长和距离怎样变化？”，计划URL `/learn/similar-triangles`。
- 首次实际确认正式页可读：2026-10-10 16:40:54 UTC / AsiaShanghai 2026-10-11 00:40:54。正式URL https://crazycloud.cc/learn/similar-triangles ，计入10月11日唯一新篇。新增两三角形对应与同中心缩放实验，不是前日勾股维护的重复。
- 正式产品提交 `36ca87a4ec6ea87b8a9f4951d6a39ffa2f685db3`；219/219tests、lint/types/config/冻结build/Pagefind通过。独立数学90,951组参数、636,657动画状态、7,279,025断言通过，角标/局部放大追加复审通过；Dream Loop首轮7.6修正至最终8.6，真实1182×757桌面、502×757窄窗口截图独审通过。375/390、真机触屏、屏幕阅读器与实测FPS未验。
- 精确 [previewCI38068314030](https://github.com/crazycloudcc/ccblog/actions/runs/38068314030) success，Vercel5R2TQUqHfDiW6Tc4bDwVRqGKEhLa Ready/Preview/dev.crazycloud.cc实核后，同SHA非强推更新main；精确 [生产CI38068516130](https://github.com/crazycloudcc/ccblog/actions/runs/38068516130) success，[生产部署](https://vercel.com/chainboxapp/ccblog/BUmS7JWUWJP5SzVYRB1nWqBEAX7a) Ready/Production/crazycloud.cc/exactSHA实核。正式交互x4→8、s2→4、q6→12、代码与canonical验证。
- 勾股课仅同批增加相似课延伸链接并更新维护日期，不计另一新篇。原Notes、两个308及query规则未改；分类为实际几何内容，canonical/sitemap/Markdown/llms入口回归通过。[完整来源、审阅及限制](experiments/similarity-2026-10-11/README.md)。

## 2026-10-11 相似面积比解释（不是新日更）

- 2026-10-10 21:14:29UTC（Asia/Shanghai10月11日05:14:29）实读正式课新增短推导：相似放大k倍，底和对应垂直高都乘k，因此½×底×高乘k²。原结论正确，此次补原因，不改核心图形/标题/首次发布日期，不计新篇。
- 产品提交 `0122879633d3605c645fcc54dafe3f385da28db2`；220/220tests、lint/types/config/冻结build/Pagefind全过。独立数学975组射线/海伦公式复算及精确增量审阅通过；Dream Loop真实before→实现→桌面1180×757/500×757窄窗截图→独立文字布局复评通过，无须修正。375/390真机等仍未验。
- 精确 [previewCI38086567511](https://github.com/crazycloudcc/ccblog/actions/runs/38086567511) success、[preview部署](https://vercel.com/chainboxapp/ccblog/HcxjTnSHioKPLqN8Njfpix9FSyuu) Ready/Preview/dev.crazycloud.cc/exactSHA后同SHA推进main；[生产CI38086763588](https://github.com/crazycloudcc/ccblog/actions/runs/38086763588) success、[生产部署](https://vercel.com/chainboxapp/ccblog/Esxq5udJgAb5WVwPomSqVbhthVW2) Ready/Production/crazycloud.cc/exactSHA实核。静态HTML/Markdown同步回归通过。
- [需求、范围、Dream Loop和限制](experiments/area-scale-2026-10-11/README.md)。外部追问日期冲突未确认，不声称新热度或学习/流量增长。

## 2026-10-11 整数虚拟区间标准库说明（不是新日更）

- 2026-10-11 13:21:01UTC（Asia/Shanghai21:21:01）实读正式二分答案课新增说明：C++20 iota 无须预存数组，partition_point 使用 !enough 保持先true后false；必须检查 end、单调性、整数上界和溢出。首次发布日期、标题、路由及图形均保留，不计新篇。
- 产品提交 `194a93143b71ca8733259a7b4212beeb115c6c44`；221/221tests、lint/types/config/冻结build/Pagefind通过。独立最终文本/数学审阅、8/8定向回归及C++20 UBSan边界穷举通过。Dream Loop实际before、实现、1180×757桌面/500×757窄窗截图独审通过，无须修正；375/390真机等未验。
- 精确 [previewCI38142480734](https://github.com/crazycloudcc/ccblog/actions/runs/38142480734) success，[preview部署](https://vercel.com/chainboxapp/ccblog/CmMCCiP1xyxK4CfnwDSquLS9E12Q) Ready/Preview/dev.crazycloud.cc实核后，同SHA非强推main；[生产CI38142726379](https://github.com/crazycloudcc/ccblog/actions/runs/38142726379) success，[生产部署](https://vercel.com/chainboxapp/ccblog/2xEdKbHJkUFE5upPRLRiGWwTa1Wf) Ready/Production/crazycloud.cc/exactSHA及正式FAQ/canonical实核。
- [需求来源、完整验收和边界代码](experiments/integer-range-faq-2026-10-11/README.md)。原问题日期2021-06-10，是常青需求，不称实时热度或流量成果。

## 2026-10-12 新文章实际发布：弧度

- 实际启动2026-10-11 16:01UTC / Asia/Shanghai10月12日00:01；2026-10-11 16:34:20UTC / 上海00:34:20首次确认[正式文章](https://crazycloud.cc/learn/radians)可读，计10月12日唯一新篇。保留10月8日未完成记录。
- 产品提交 `6522e3c1b16c3808a4017628260b7692b6d3ee00`，初版 `b7025f0a19562ad431441261f133d11bdabe98ef` 的实际截图暴露留白与控件距离问题，经裁切布局及固定操作栏修正后，229/229 tests、lint/types/config/冻结build/Pagefind全部重新通过。
- 独立数学审阅验证每帧保长，裁切再查19,798,323点；Dream Loop目标/实现/实际截图/独审/修正完成，视觉复评8/10。真实1180×757桌面、500×757窄窗、单步/播放终点/重置/键盘/零角与整圈验证；375/390真机、触屏和屏幕阅读器未验，不冒称验收。
- 精确[preview CI38155567843](https://github.com/crazycloudcc/ccblog/actions/runs/38155567843) success，[preview部署](https://vercel.com/chainboxapp/ccblog/EZWQARzYhdzZiHvszh2LQd3DuBxv) Ready/Preview/dev.crazycloud.cc/exactSHA通过后，同SHA非强推main；[生产CI38155843685](https://github.com/crazycloudcc/ccblog/actions/runs/38155843685) success，[生产部署](https://vercel.com/chainboxapp/ccblog/FZojoWgQjYrhHeFwr9PnEz5mEbY8) Ready/Production/crazycloud.cc/exactSHA及正式canonical、1rad/r=2/s=2cm交互实核。
- [需求来源、公式、真实失败与修正、验收限制](experiments/radians-2026-10-12/README.md)。原始2019疑问与MIT2010/OpenStax资料是常青需求，不称实时热度、搜索量或流量成果。生成目标图只本地布局参考，不作实际验收图、不上传。

## 2026-10-12 LIS 参考资料直达维护（不是新文章）

- 2026-10-11 21:11:17 UTC / 上海 10 月 12 日 05:11:17，正式 LIS 页面已指向 CP-Algorithms 的完整官方新地址。原地址仍可读但只显示搬迁提示；这是减少一次导航，不称失效链接、新热点或流量成果。首次发布与教学更新日期仍为 10 月 7 日、10 月 10 日。
- 产品提交 `683a68a9e0f47c4ccd68d1a8d9a2d331071efd69`；230/230 tests、lint、types、config、冻结 build、Pagefind 全部通过。独立 diff 审阅确认只改一个 URL，数学、算法和核心图形未变。Dream Loop 实际 before/after 1180×757 截图独审通过，无须修正。
- [Preview CI38175058016](https://github.com/crazycloudcc/ccblog/actions/runs/38175058016) success、[preview 部署](https://vercel.com/chainboxapp/ccblog/C1eRYwcb7oa3oa9GiFoHdcaQKWAj) Ready/Preview/dev.crazycloud.cc/exact SHA 后，同 SHA 非强推 main。[生产 CI38175225196](https://github.com/crazycloudcc/ccblog/actions/runs/38175225196) success、[生产部署](https://vercel.com/chainboxapp/ccblog/GJxaEZQ2xrwy764PiSBqaMQrbZhJ) Ready/Production/crazycloud.cc/exact SHA，正式 href、canonical、日期实核。
- [来源、完整记录与限制](experiments/lis-reference-2026-10-12/README.md)。线上 Markdown 正常导航被客户端阻止，停止且未绕路，故该线上输出未验；本地 HTML/Markdown 回归已通过。本轮未重新测移动端或其他交互。10 月 12 日唯一新篇仍为 radians。


## 2026-10-12 弧度换算比例解释（不是新文章）

- 2026-10-12 09:22:38 UTC（上海17:22:38）正式页已出现一般换算比例：同一转角 d/360=θ/(2π)，故 θ=dπ/180，反向 d=180θ/π。只补原代码公式的静态解释，原图形、标题、教学日期与单圈范围不变。
- 产品提交 `3462cfcc106275e6583a010134d2b74fea0e904e`；本批232/232 tests、lint/types/config/冻结build/Pagefind通过，独立18项聚焦测试及4036945数学断言通过。Dream Loop真实1188×761前后与503×761窄窗截图独审9/10，无须修正；375/390、触屏、屏幕阅读器与未改图形交互未重新验收。
- 精确[previewCI38228715241](https://github.com/crazycloudcc/ccblog/actions/runs/38228715241) success及[preview部署](https://vercel.com/chainboxapp/ccblog/8oaEbGwGUxqgWtc74CBfDZAt9WJS) Ready/Preview/dev.crazycloud.cc通过后，同SHA非强推main；[生产CI38229172108](https://github.com/crazycloudcc/ccblog/actions/runs/38229172108) success，[生产部署](https://vercel.com/chainboxapp/ccblog/E7a9Did1rudAyK8bDh1fsAP4pgvG) Ready/Production/crazycloud.cc/精确SHA及正式正文/canonical/日期实核。
- [来源、真实审查过程与限制](experiments/radian-conversion-2026-10-12/README.md)。2018原疑问是常青需求，非实时热度。线上Markdown受既有客户端限制未重试，构建HTML/Markdown已验证。当日唯一新篇仍为radians；另一项取消的二分证明未包含、未发布。

## 2026-10-12 相似周长与比例方向说明（不是新文章）

- 2026-10-12 14:24:27UTC（上海22:24:27）正式相似课新增：三条对应边都乘k，周长作为三边和也乘k；面积仍乘k²。大/小与小/大方向一致，反向比为1/k、1/k、1/k²。原图形、标题、教学日期2026-10-11保持，当日唯一新篇仍radians。
- 产品提交`076db369cdc61a63563ea601d1ff740c9b1c24e6`；234/234 tests、lint/types/config/冻结build/Pagefind通过，独立21定向及975滑块+2000内部数学样本、边界与精确增量审阅通过。Dream Loop真实1180×757前后/500×757窄窗独审9.4/10，无必修项；375/390、真机、触屏、屏幕阅读器和未变交互未重验。
- [previewCI38261624860](https://github.com/crazycloudcc/ccblog/actions/runs/38261624860) success及[preview部署](https://vercel.com/chainboxapp/ccblog/Byi2hjHApncZXNrqVVixBhFrkmTK) Ready/Preview/dev.crazycloud.cc/exactSHA后同SHA非强推main；[生产CI38262364590](https://github.com/crazycloudcc/ccblog/actions/runs/38262364590) success，[生产部署](https://vercel.com/chainboxapp/ccblog/6Gyw6Yv5afsSxqCLSoS5hx2HGpeN) Ready/Production/crazycloud.cc/exactSHA及正文/canonical/日期实核。
- [来源与验收限制](experiments/perimeter-ratio-2026-10-12/README.md)。2016/2023问题是常青需求，不称实时热度；线上Markdown未重试既有客户端阻止，本地HTML/Markdown已验。另一项取消的binary证明未包含或发布。

## 2026-10-13 新文章实际发布：欧几里得算法

- 2026-10-12 16:03:10UTC / 上海10月13日00:03:10启动，16:49:46UTC / 上海00:49:46完成[正式新篇](https://crazycloud.cc/learn/euclidean-algorithm)，计上海10月13日唯一新篇。此前radians属于10月12日，保留10月8日未完成记录。
- 产品提交`b01692c8aebf6fac121f2c96266171f409c82a38`。原矩形逐轮切方块、余数/公式/代码同步，统一gcd网格区分工作块；静态双向整除推导、整数边界与成本口径完整。
- 最终240/240tests、lint/types/config/冻结build/Pagefind通过；独立3,600输入/14,688中间态、244,846 BigInt对照、93状态与29,376 SVG状态通过。Dream Loop首轮真实视觉5.5分暴露留白/裁切/标签问题，经布局与对比度等修正后全部checks重跑，最终真实截图独审8.1/10。
- 实际1180×757桌面及500×757窄窗、单步/相等/互质播放终点/键盘1与60/交换/网格已验。500宽页面无横向溢出，图形内部有412/540横滚；横滚提示偏弱为非阻断改进项。滚动后舞台通过不等同所有输入首屏同显；375/390真机、触屏、屏幕阅读器及FPS未验。
- [PreviewCI38278896338](https://github.com/crazycloudcc/ccblog/actions/runs/38278896338) success及[preview部署](https://vercel.com/chainboxapp/ccblog/GYwEuL9ZR3ah2mpFPvMT6P4B7PAK) Ready/Preview/dev.crazycloud.cc/exactSHA后同SHA非强推main；[生产CI38279912933](https://github.com/crazycloudcc/ccblog/actions/runs/38279912933) success，[生产部署](https://vercel.com/chainboxapp/ccblog/7q6JXuCPo92n8pbuQ4qRhTu91QZi) Ready/Production/crazycloud.cc/exactSHA，正式正文/单步/canonical/日期实核。
- [来源、真实失败与修正、验收限制](experiments/euclidean-2026-10-13/README.md)。2024原疑问和MIT课程是常青需求，非新热度或搜索量；生成目标图仅本地布局参考。旧取消binary证明未包含或发布。

## 2026-10-13 GCD 精确小数与浮点边界说明（不是新文章）

- 2026-10-12 18:22:29UTC（上海10月13日02:22:29）[正式GCD课](https://crazycloud.cc/learn/euclidean-algorithm)新增短解释：共同尺度须使两个正长度都是它的整数倍；精确有限小数可从精确十进制表示取共同分母转整数，1116/10与465/10的最大共同尺度为93/10=9.3。不能保证已存储二进制浮点直接乘10取整等价，近似测量须先定误差规则。原整数交互域、标题、教学日期保持，唯一新篇计数不变。
- 产品`22a11f977fa9e468744f76955d879e05f5ca9577`；补齐正长度/整数倍定义后最终242/242tests、lint/types/config/冻结build/Pagefind全部重跑通过。独立82,944精确有理数及4种共同分母细化、最大性证明和最终文本/边界审阅通过。
- Dream Loop实际before、局部生成目标参考、实现、1181×757桌面/501×757窄窗截图独审9.2/10，无视觉must-fix。新文字自然换行、无页面横溢出；指针遮少量字属非阻断截图限制。375/390真机、触屏、屏幕阅读器、FPS未验；未改图形交互不重复手动QA。
- [previewCI38289791751](https://github.com/crazycloudcc/ccblog/actions/runs/38289791751) success及[preview部署](https://vercel.com/chainboxapp/ccblog/7pWr4giRrWUAbc8WSiZjG1cpuKVp) Ready/Preview/dev.crazycloud.cc/exactSHA后，同SHA非强推main；[生产CI38290270942](https://github.com/crazycloudcc/ccblog/actions/runs/38290270942) success，[生产部署](https://vercel.com/chainboxapp/ccblog/DAsA5F1M15ztT8iV2X8U228tPT2g) Ready/Production/crazycloud.cc/exactSHA，正式FAQ/reference/canonical/日期实核。
- [来源、定义修正与验收限制](experiments/gcd-decimal-2026-10-13/README.md)。2013原提问是常青需求，不称新热度。旧binary具体取消未重试或包含；一次preview审核遗漏Oct9连接器例外，在原证据补齐后同调用仅重试一次成功。

## 2026-10-13 勾股与相似面积桥接（不是新文章）

- 2026-10-12 22:17:57UTC（上海10月13日06:17:57）正式勾股课的既有延伸段补充半圆应用：三边作直径时面积常数为π/8；同类相似形须使用对应长度并共享K。明确这是勾股与面积缩放的推论，不是另一份证明，继续链接相似课。核心SVG、标题、教学日期及当日唯一新篇计数不变。
- 产品 `69567590c90db6040966f1a494c8fc4e47886739`；新增Markdown测试的Jiti别名缺失修复后最终244/244tests、lint/types/config/冻结build/Pagefind全过。独立42组正实数数学、13项定向、静态HTML/Markdown/链接/日期审阅通过。Dream Loop真实1188×761桌面及505×761窄窗独审9/10，无必修项；375/390真机、触屏、屏幕阅读器、FPS及未改核心交互未重验。
- [previewCI38315374178](https://github.com/crazycloudcc/ccblog/actions/runs/38315374178) success和[preview部署](https://vercel.com/chainboxapp/ccblog/5pNcDJ7hRQqyPzVDVxZC2RCeGksR) Ready/Preview/dev.crazycloud.cc/精确SHA后同SHA非强推main；[生产CI38315678569](https://github.com/crazycloudcc/ccblog/actions/runs/38315678569) success，[生产部署](https://vercel.com/chainboxapp/ccblog/HF8AAySUmbCyrJ9jj3MbycCuLVFn) Ready/Production/crazycloud.cc/精确SHA与正式正文、canonical、日期已实核。
- [来源、失败修复与验收限制](experiments/shape-bridge-2026-10-13/README.md)。Cambridge来源更新于2022-12-12，属于常青教学需求，不称热度或流量成果。生成目标只本地；线上Markdown既有阻止未重试。旧binary具体取消未包含。

## 2026-10-13 多个正整数的 GCD 折叠说明（不是新文章）

- 2026-10-13 04:13:36UTC（上海12:13:36）正式GCD课完成短解释：用已有欧几里得公因数集合不变量追到(g,0)，说明正整数gcd(a,b,c)=gcd(gcd(a,b),c)。48、18、30得到6，换成20得到2。仍为两数图形，不引入空输入/全零约定；核心图形、整数域与原教学日期保持，不计另一新篇。
- 产品 `388778e6c8898287d39de8396836ca0d9001024a`；246/246tests、lint/types/config/冻结build/Pagefind通过。独立216,000三元组、1,296,000换序、12,960,000整除集合检查，以及2,056安全整数BigInt三元组和128列表通过。静态HTML/Markdown/canonical/日期已验。
- Dream Loop真实桌面1180×757前后图与本地生成布局参考，独审9.5/10无必修项。只验本轮可见桌面区域；窄屏、375/390真机、触屏、屏幕阅读器、FPS与未改SVG交互未重验，不冒称通过。
- [previewCI38345051810](https://github.com/crazycloudcc/ccblog/actions/runs/38345051810) success和[preview部署](https://vercel.com/chainboxapp/ccblog/FapcUV1dPq1FxkuCkjGRM2baEwoU) Ready/dev/精确SHA后同SHA非强推main；[生产CI38345290728](https://github.com/crazycloudcc/ccblog/actions/runs/38345290728) success，[生产部署](https://vercel.com/chainboxapp/ccblog/CVbCwqMZZ6zv4XdKahtPfJtdPoxF) Ready/Production/crazycloud.cc/精确SHA与正式正文实核。
- [来源、验收与限制](experiments/gcd-fold-2026-10-13/README.md)。2015结合律问题与2011两两互质问题仅作常青意图，未声称热度；明确cdp云端入口实际可读，未重复未限定浏览器枚举。旧binary具体取消未包含。

## 2026-10-13 弧长与扇形周长澄清（不是新文章）

- 2026-10-13 11:20:23UTC（上海19:20:23）正式弧度课完成共享FAQ：普通扇形0<θ<2π的周长为弧长加两条半径；整圆只计圆周，零角退化不套普通公式。面积仅区分平方单位。原图形、标题、教学日期2026-10-12不变，Oct13唯一新篇仍为GCD。
- 产品`55a7f48c9e4fdf7590eab3d452f794b4173c5b95`；248/248tests、lint/types/config/冻结build/Pagefind通过；独立精确差异、数学端点/趋近与2项定向、SSR/Markdown/构建产物/日期canonical通过。Dream Loop真实1180×757桌面前后独审9.1/10，无must-fix；补滚动截图确认自测答案可达。窄屏375/390、真机、触屏、屏幕阅读器、FPS和未改控件交互未重验。
- [previewCI38388844910](https://github.com/crazycloudcc/ccblog/actions/runs/38388844910)success及[preview部署](https://vercel.com/chainboxapp/ccblog/vogZw85gPXh2geTnn6YVBp9Jo9Pv)Ready/dev/精确SHA后同SHA非强推main；[生产CI38389361205](https://github.com/crazycloudcc/ccblog/actions/runs/38389361205)success，[生产部署](https://vercel.com/chainboxapp/ccblog/6bATY21GjaJXwyFYvaj9MPQLjr6C)Ready/Production/crazycloud.cc/精确SHA及正式全文/canonical/日期实核。
- [来源与验收限制](experiments/sector-perimeter-2026-10-13/README.md)。2013原问是常青需求，非新热点或流量成果。目标图只本地布局参考；线上Markdown限制未重试。旧binary具体取消、Gmail主动监控取消及两停止项目保持。

## 2026-10-13 GCD 约分应用说明（不是新文章）

- 2026-10-13 13:19:13UTC（上海21:19:13）正式GCD课新增短FAQ：正整数分子分母同除gcd，解释共同非零因子消去保持值，以最大性反证约后互质；36/60同除12得3/5，强调求gcd可交换输入但不能倒置分数。核心SVG、整数交互域及原教学日期不变，不计第二新篇。
- 产品`247b7ecb59065f4ae18886ac11b40a55c42f9029`；250/250tests、lint/types/config/冻结build/Pagefind通过；独立13,622数学样本、354基线文件精确差异、2新增定向测试及实际HTML/Markdown/日期canonical通过。DreamLoop真实1180×757前后截图独审9/10，无must-fix；原窄正文栏略密、12换行属非阻断观察。窄屏375/390、真机、触屏、屏幕阅读器、FPS及未改控件未重验。
- [previewCI38403226703](https://github.com/crazycloudcc/ccblog/actions/runs/38403226703)success和[preview部署](https://vercel.com/chainboxapp/ccblog/ETzfF7NvFxfVcFrEREtghX4XxrsH)Ready/Preview/dev.crazycloud.cc/精确SHA后同SHA非强推main；[生产CI38403659237](https://github.com/crazycloudcc/ccblog/actions/runs/38403659237)success，[生产部署](https://vercel.com/chainboxapp/ccblog/DjnCnMat9sYWfyK3T3jWb1wNR61h)Ready/Production/crazycloud.cc/精确SHA与正式全文/日期/canonical已实读。
- [来源与验收限制](experiments/gcd-fraction-2026-10-13/README.md)。2014-11-05原问为常青需求，不称热度或搜索量；生成目标仅本地布局参照。旧binary具体取消、Gmail监控取消和已停项目保持。


## 2026-10-15 新文章实施：最小公倍数

- 2026-10-14 16:00UTC之后（上海10月15日）启动今天唯一新篇 `/learn/least-common-multiple`。双排正倍数首次共同落点、两数GCD/LCM恒等式及三数边界，是独立于既有GCD的教学目标。
- 状态：实施中，未宣称发布；本轮失败将继续同题，不另开日更。保留10月8日未完成记录。
- 固定基线54f746fc5cf635c82d8f6be13509e526f6af7339；旧工作树未动。需求与Dream Loop、验证证据见 [实验记录](experiments/lcm-2026-10-15/README.md)。


## 2026-10-16 新文章实施：前缀和

- 唯一新题 `/learn/prefix-sum`：减去共同前缀，留下左闭右开区间；含负数与空区间边界。16UTC已选题并做数学方案独审，原云端故障导致实际代码延后至2026-10-15 18:00UTC（上海Oct16 02:00）开始。
- 状态：实施中，尚未发布。基线main/preview均为510ba11c3e2fb94c3d442528ac1c4a5383bc37d8；失败续同题。Oct8未完成记录不变。
- 来源是CSES与Library Checker真实题型，不宣称热度、搜索量或增长。测试、视觉证据与发布结果待实际验证后追加；不能把旧证据算作本篇验收。
- 本地实现已通过278/278 tests、lint/types、冻结build/Pagefind；独立数学/SSR13项通过，修复稀疏输入、图形说明间距与目录预览。当前等待精确preview CI/Ready及真实画面独审，尚未正式发布。详见[本篇验收记录](experiments/prefix-sum-2026-10-16/README.md)。
- 第一版preview提交b351b6f398d12403bb29a7eb0889f548a72ba977的CI38783683020成功、Vercel4wpjvEcUuyDdguJs7uMW7viXpJbP Ready与dev绑定已验证；真实桌面浅色截图独审无must-fix。随后前置公式/播放控件并修正手动改变边界后的预设按下态，完整278 tests及lint/types/build再次通过；等待修正版preview与正式核验。
