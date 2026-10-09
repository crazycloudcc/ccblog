# 2026-10-09 勾股定理新文章：Dream Loop 发布记录

## 授权、日期与范围

- 北京时间 2026-10-09 11:49，用户明确要求启动今天的新文章、经过 Dream Loop，并允许 preview 测试通过后正式发布，无需再次确认。此授权不把七日候选计划变成逐项批准单。
- 路由 `/learn/pythagorean-theorem`，今日唯一新文章。2026-10-08 保持未完成记录；不补造旧日期文章，不放入 Notes。
- 开工远端：preview `27e4a4bf1a8e45de8ebdfb75a91a57351bdf5b32`；main `7c20084fb048200ac5d81839e31c91c01fa41720`。工作树干净，无另一写入者。

## 来源与目标

- 实际读取 AetherViz Master 的 [SKILL blob afb04d7](https://github.com/andyhuo520/aetherviz-master/blob/master/SKILL.md) 与 [MIT LICENSE](https://github.com/andyhuo520/aetherviz-master/blob/master/LICENSE)。借鉴教学结构，独立原生 SVG 实现，无新增 CDN、第三方脚本、依赖或权限；许可保存在 `docs/licenses/aetherviz-master.txt`。
- 沿用已批准的 Dream Loop Pro 流程；实际读取固定版本 [SKILL](https://github.com/achimala/dream-loop/blob/9bddb901f7d071cfefdd21e264267c757177a9df/SKILL.md) 与 [Pro workflow](https://github.com/achimala/dream-loop/blob/9bddb901f7d071cfefdd21e264267c757177a9df/references/pro-mode/workflow.md)。
- [真实既有栏目基线](baseline.jpg)：2026-10-09 03:52 UTC，dot 云端浏览器当前 preview LIS，1180×757。它是现有视觉语言参照，不是假称新文章的“改前”。
- [生成目标](target-generated.png)：内置图像工具生成的一张 UI 目标，约 42 秒；不是运行截图。保持奶油终端主题、双大正方形、紧凑滑块和同屏公式。
- 目标中几何文字和边标不作为数学依据。实现的坐标与拼铺需通过独立数学验证；严谨性优先于生成图逐像素匹配。
- 数学来源：Euclid I.47、I.48（Clark University David E. Joyce 在线版），OpenStax Algebra and Trigonometry 2e 10.2。已实际读取核验；未取得可信近期热度数据，未宣称本题是实时热点。

## 实现

- 左图保留 c² 参照，右图将四个全等三角形作刚性平移，终点留下 a² 与 b²；a、b、移动进度与公式/解释同步。
- 移动中可能重叠，页面明确不把中途空白当剩余面积证明；只在起终点比较完整拼铺。解释中间四边形为何是真正正方形。
- 另有 30°–150° 夹角实验，展示直角条件和 60° 的 c²=13 反例。键盘原生滑块、静态服务端正文、Markdown、Article/BreadcrumbList、真实日期 sitemap、独立 OG 和 llms 索引一起交付。
- 不添加不存在的 Notes；保留旧二分/LIS 的双向入口、canonical 与固定两条旧 308 路由。

## 首版本地验证（历史阶段）

- 首版既有 188/188 tests、完整 ESLint、TypeScript、production build 通过，Pagefind 16 页。
- [独立数学/SSR审查](math-review.md)已完成：新增 10 项回归，全仓 198/198 通过；覆盖 19,796 帧。真实 preview 截图、交互与独立视觉审阅尚未执行。
- dot 云端浏览器可正常打开 dev.crazycloud.cc。访问本地 localhost:3100 得到 `ERR_CONNECTION_REFUSED`，未用别的网络路线规避；因此将经 Git preview 部署后采集真实画面。
- 仅通过 Git 自动部署。当前文档记录开工状态，尚不构成 preview 或生产成功声明。

## 07 UTC 本地续做与待决状态

- GitHub 上传生成目标图片的 `create_blob` 未返回成功；待决审批未获明确批准。只读查询目标 blob 仍为 404，未重试上传、换路径、创建提交或更新分支。preview / main 仍为开工时 SHA。
- 生成目标文件未改，Git blob hash 保持 `9278713330a18538faf2b61097a97b9ead503c92`。
- 本轮只给本地静态阅读原稿增加日期例子：2026-10-24 按月 / 日 / 两位年份写作 10/24/26，10²+24²=676=26²；明确滑块仍是 1–8，例子不声称可直接输入 10/24。
- 已实际打开核验 [WonderLab 官方活动页](https://wonderlab.org/pythagorean-theorem-day/) 与 [Seattle Universal Math Museum 官方活动页](https://seattlemathmuseum.org/events/pythagorean-palooza)。两处都是已公告的当地数学活动，不据此宣称全球统一节日、热搜或搜索流量增长。
- 台账同步独立数学审阅和主体实现 198 测试的实际完成状态；仍明确没有 preview 验收或正式上线。日期段追加后，相关 23/23 静态/SSR/路由测试、课程数据文件 ESLint 与 `git diff --check` 通过；不重复整站构建。
- 独立内容校对已通过：另一审阅者实际重读两家官网，确认日期、等式、活动事实和滑块 1–8 限制一致，无热搜、全球统一节日或扩展互动能力表述；此次为只读校对，未作远端写入。

## 08 UTC 冻结源完整复验（2026-10-09 07:58 UTC）

- 无另一 ccblog 写入者。原图片上传无成功回执，目标 blob 的只读查询仍返回 404；远端 preview/main 不变，未重发或改路径上传。
- 含日期段的最终本地代码完整检查通过：`npm test` **198/198**、`npm run lint`、`npx tsc --noEmit`、`node scripts/validate-config.mjs`、`npx next build --webpack`、`npm run postbuild`。总流程退出码为 0。
- 使用冻结源构建，未运行会同步并改动无关 App 元数据的 prebuild `sync-apps`；`lib/apps.ts`、依赖、路由配置均保持原样。此次不声称执行了完整 `npm run build` 的外部元数据抓取步骤。
- [完整日志](checks-0800/)（仅统一行尾并去除尾部空白，检查结果未改）；Pagefind 索引 16 页、2254 词。中文词干化不受 Pagefind 支持，为工具既有提示，不声明已测得搜索排名或收录。
- [构建输出断言与关键源文件哈希](checks-0800/static-output.json)：单一 h1、正确 canonical、日期与算式、控件限制、两条官方来源、Markdown、sitemap、llms 索引均正确，无虚假同名 Notes 链接或新增远程脚本。
- 查新仅取得当天勾股教材/逆定理资料更新的搜索摘要，原网页未能打开；它属于未完整核实的内容供给，不是需求增长。原稿已含逆定理，未据此凑内容改动。
- 以上全部是本地代码和静态产物验证。preview 部署、真实浏览器截图/交互、独立视觉审阅、正式发布仍未完成。

## 图片上传恢复（2026-10-09 08:29 UTC）

- 用户明确要求重新发起已失效的同一图片上传审批。再次只读核对本地 hash 与远端 404 后，仅重发原 `create_blob` 一次。
- 新审批后的原调用成功返回 blob `9278713330a18538faf2b61097a97b9ead503c92`，与本地目标图 hash 一致；保留同一目标图，无重复制作或绕过审批。
- 至此仍未创建文章提交；随后续做原 preview → 真实视觉审阅 → production 流程。

## Round 1：精确 preview 与真实视觉反馈（08:49–08:53 UTC）

- 用户随后明确允许现有 GitHub 连接器创建 Git 提交并更新 preview/main，由 Vercel 自动部署。未使用 Vercel 手动部署，未新建环境、分支或凭据。
- 提交 [`cb67bdfd4717762bf749c32e4937d78ea8a9febe`](https://github.com/crazycloudcc/ccblog/commit/cb67bdfd4717762bf749c32e4937d78ea8a9febe)，tree `991dd9368d4e2be33f3aa8bc3ffbc4e9b412b246` 与已验证本地树一致；作者匹配本仓库既有 crazycloud 身份。expected-SHA 非强制更新 preview，main 保持 `7c20084fb048200ac5d81839e31c91c01fa41720`。
- [精确 preview CI 37907379751](https://github.com/crazycloudcc/ccblog/actions/runs/37907379751) success；[Vercel preview](https://vercel.com/chainboxapp/ccblog/9mhLsQaKaoRw1FM6wxsogSau3Cqk) 只读核验 Ready、Preview 环境、精确 commit 与 dev.crazycloud.cc 绑定。
- [真实首屏](preview-round1.jpg)、[移动中](preview-midpoint.jpg)、[a=1/b=8 边界](preview-extremes.jpg) 均由 dot 云端浏览器截图，未编辑图像。
- [真实交互结果](browser-round1-results.json)：重置、50% 说明、原生键盘 Home/End 调边长与进度、反例从 60° 用方向键到 90°，数据/图形/公式同步；不是源码测试替代浏览器。
- 独立视觉审阅指出：首屏核心等式被终端底栏遮住，图形在面板内过小，极小方块标签挤压，移动中重要限制约 9px。首版不得直接发布到 main。

## Round 2 修正与复验

- 去掉本课冗余 cd 路径栏，等式置于说明前，数值及面积符号分组排版；图形放大，1–8 范围不换行。
- 极小方块面积标签改为外侧引线；移动中重叠限制改为 12px HTML 图注，避免 SVG 缩放后过小。
- 补充两课精确路径白名单与等式顺序回归。数学坐标与模型没有改变，仍须重新完整测试并重新验证精确 preview 的真实画面。

- Round 2 最终实现将进度滑块与 a/b 控制并排置于舞台前，将主图上限增至 340px。最终 198/198 tests、全仓 lint、TypeScript、配置、冻结源 production build 和 Pagefind 全部通过，日志见 [checks-round2](checks-round2/)。旧测试将“允许重叠”锁在 SVG 内，迁移为真实 HTML 图注后已相应更新定位；没有删除提示或放宽数学断言。
- [首轮独立视觉报告](visual-review-round1.md)评分 6/10，构图1/3、色彩对比2/3、表面3/3、细节0/1；这是审阅者主观评分，不是学习效果或流量指标。二轮必须用新真实截图复核。


## Round 2 真实验收与正式发布（2026-10-09 09:01–09:11 UTC）

- 精确最终实现提交 `ede3089962251dc5edf2e3c77c530289778f84dc`，tree `26edfc27972ceef6f20228184b25e2b475fca1dc`。此后没有改产品代码。
- [preview CI 37908460303](https://github.com/crazycloudcc/ccblog/actions/runs/37908460303) success；[Vercel preview](https://vercel.com/chainboxapp/ccblog/GKYmSWcARgd4ZZsDRSrWw88ZZqkT) 只读核验 Ready、Preview、精确 SHA 与 dev.crazycloud.cc。
- [二轮首屏](preview-round2.jpg)、[起点](preview-round2-start.jpg)、[中点](preview-round2-midpoint.jpg)、[a1/b8 极值](preview-round2-extremes.jpg) 均为真实 dot 云端 Chromium 截图；等式和更大几何主体已进入首屏。
- 通过正常桌面窗口拖拽取得真实 **500×757 CSS viewport**，不是 DevTools 仿真：[窄屏首屏](preview-round2-narrow-top.jpg)、[下滚后的图形与等式](preview-round2-narrow-stage.jpg)、[a8/b1 反向极值](preview-round2-narrow-reverse-extreme.jpg)。document scrollWidth 与 clientWidth 均为 500，无所检 main 元素右溢；完成后恢复 1181px 窗口。
- [二轮实际交互结果](browser-round2-results.json)：Home/End 调两边、50% 步骤、最终比较、反向极值、夹角由 Home 加四次方向键到 90°、重置到 3/4/0/60 均同步更新图/公式/说明。采集控制台有浏览器扩展 metadata 错误，过滤 chrome-extension 来源后未见应用 error/warn；不称整个浏览器零错误。
- [独立二轮视觉报告](visual-review-round2.md) **8/10 通过**（composition 2/3、color/contrast 2/3、surfaces 3/3、details 1/1），审阅者实际看上述新图；已展示状态无发布阻断。剩余 P2 是桌面终态解释标题在折叠边沿、小编号对比偏弱。
- 09:08 UTC，以 expected SHA `7c20084fb048200ac5d81839e31c91c01fa41720` 非强制将 **同一个已验提交** 推进 main；由 Git 自动触发生产，未在 Vercel 手动部署。
- [精确生产 CI 37909364377](https://github.com/crazycloudcc/ccblog/actions/runs/37909364377) success；[Vercel 生产 44KfUjfFgq6orYgZe1gdXP5dZwpx](https://vercel.com/chainboxapp/ccblog/44KfUjfFgq6orYgZe1gdXP5dZwpx) 实际只读核验 Ready、Production、main、精确 SHA 和 crazycloud.cc。
- [生产页面](https://crazycloud.cc/learn/pythagorean-theorem) 于北京时间 **2026-10-09 17:10** 实际打开：[生产截图](production.jpg)、[线上结果](production-results.json)。单 h1、生产 canonical、25=9+16、10/24/26 静态日期例子及算式、原滑块 1–8、AetherViz MIT 可见署名均正常。
- 两条旧 `/blog/binary-search/visual` 和 `/blog/longest-increasing-subsequence/visual` 经线上 HEAD 实测 **HTTP 308**，Location 分别为对应 `/learn/…?release=pythagorean`，查询参数保持。不是只从 Next 配置推断。
- Markdown 线上 HEAD 返回 200、`text/markdown; charset=utf-8`；随后云浏览器打开正文得到 `ERR_BLOCKED_BY_CLIENT`，未改路径或用其他路线规避，**线上 Markdown 正文未验**。本地构建的 Markdown 内容/日期/算式此前已通过完整检查。
- 响应式验收只覆盖实际桌面与 500px 窄窗口；**没有 320/375px、物理手机、iOS/Android、读屏、200% 缩放、深色主题或 reduced-motion 偏好切换的运行验收**。实现无自动播放/动画循环，静态与对应 CSS 检查不能冒充这些运行证据。沿用用户已有 ccblog 手机/人工验收豁免，不把豁免写成测试通过。
- 未测真实搜索排名/收录/学习效果，也没有 FPS、LLM token 或美元成本遥测。生成目标 hash 仍为 `9278713330a18538faf2b61097a97b9ead503c92`。
- 09 UTC 运营轮续做同一篇，未重开文章；Oct 8 未完成如实保留。发布证据归档仅提交 preview，按用户当前要求不为文档记录再次推进 main。

- 静态入口线上补查范围：[HTTP GET 结果](production-static-links.json) 中 sitemap、llms、Learn 索引及旧二分/LIS 双向页均返回 403，已停止，不换客户端或路径绕行；因此不声称这些线上正文已验。sitemap 的先行 HEAD 为 200/application/xml。对应静态构建产物、双向链接、索引规则的源码/回归验证已通过，和线上 GET 未验严格区分。
