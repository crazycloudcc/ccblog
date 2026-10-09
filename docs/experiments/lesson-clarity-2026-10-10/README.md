# 既有课程澄清维护：2026-10-10

实际检查始于 2026-10-09 21:56 UTC（Asia/Shanghai 10 月 10 日），名义 22 UTC 轮提前到达。本批不是新文章，10 月 10 日唯一新篇仍是二分答案。

## 目标与基线

从精确 preview 546786999f14412d231d84769189ac26c44e9821 核对现有隔离目录，303 个 blob 全部一致后实施。旧树 20 项改动未触碰，无可见并发写者。只改静态课程数据、共用 HTML / Markdown 渲染与测试；算法、图形、控制、原 Notes、旧 308/query、canonical 和作者配置保持。

Dream Loop 目标：保留当前纸色终端布局和图形主舞台，在参考资料前增加一个清楚的“延伸学习”段和可点击链接；解释 tails 搜索 end 与已证明可行的 hi 的区别。勾股日期例子在首次术语旁定义三个正整数，并与一般正实数边长区分。维护前真实云端截图已保存作为布局基准；不是新生成图或最终验收。

## 需求与来源

- 已观察的学习问题是边界理解和整数勾股数概念混淆，不宣称搜索量或当日热度。勾股学习问题：https://www.reddit.com/r/askmath/comments/1wxrhi7/have_i_created_a_new_way_for_finding_pythagorean/ 。搜索日期与页面相对时间冲突，原始发帖时间未核实。
- 本轮实际读取 C++ 工作草案 https://eel.is/c++draft/alg.binary.search ，lower_bound / upper_bound 的返回范围包含 last；无发布日期推断。Wolfram 定义在前轮已实际读取：https://mathworld.wolfram.com/PythagoreanTriple.html 。这些是技术定义来源，不是新热点。
- 本轮新增公开搜索没有证实新的时效热点。Monash LIS editorial 搜索结果存在，但正文 cache miss，不据其作新增需求或技术结论。

## 实现与独审

网页与 Markdown 共用结构化 lessonExtensions；LIS 与二分答案双向链接，作为延伸而非新前置。LIS 静态段明确空 tails / 全 false 返回 end、追加并禁止解引用；二分答案维持 hi 可行。勾股数定义与 (1,1,√2) 反例相邻于日期例子。首次发布日期不变；有实质维护的 LIS / 勾股 updated 为 10 月 10 日。

独立只读审阅通过数学、范围及共用渲染，发现测试直接比较 HTML 未转义的 >。已改为 React SSR 转义比较，Markdown 仍匹配原文；随后重新运行全 checks。现有 LIS 已有前驱和真实路径，未将其误记为缺失功能。

## 发布门槛与限制

等待最终测试 / lint / types / config / 冻结源 build / Pagefind、精确 preview CI 与 Ready、真实可用截图和独立视觉评审，满足后才推进 main。此记录尚不声明发布成功。既有本地浏览器安全阻止不重试绕过；只用原本许可的 dev.crazycloud.cc 云端预览。窄窗口不等于真机触屏 / 屏幕阅读器验收。GSC / 精确生产 host 完整 UTC 日统计未读取，未知。

22:00 UTC 最终本地 207/207 tests、lint、tsc、config、冻结源 Next webpack build 40 路由、Pagefind 17 页均通过。测试断言修正后的结果；未改生产算法。下一步仅发布 preview 验收，main 尚未改。
