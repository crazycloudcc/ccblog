# 作高后间接使用勾股定理：既有课澄清

目标：保留“非直角三角形不能对原三边直接套用”的正确条件，同时说明作高后可在形成的直角三角形里分别使用；外垂足不是把原三角形分成两块，作高也不自动补足求解条件。

2026-10-10 13UTC 开始，同一既有云端以 preview43298c7e6db8d72772cfa8ed2e347b3c605f37e9 精确 Git blob 物化。旧工作树20项未改；历史文档图片/日志缺失仍由远端 base_tree 保留，不影响产品源文件验收。

AetherViz Master / Dream Loop 既有 MIT 许可已读取并保留。实现仅追加共享课程的一段常见误区说明及数学/文字回归。核心图形、标题、路由、发布日期不变；不计新文章。最新用户要求所有发布采用完整 Dream Loop，不沿用旧试验期限。

来源：
- https://amcstep.com/topics/triangles_basic ：作高应用与外垂足的常青学习线索。Name/Date 栏不是发表日期；不引用其题目、数值答案、统计或热度。
- https://openstax.org/books/algebra-and-trigonometry-2e/pages/10-2-non-right-triangles-law-of-cosines ：教材§10.2垂线构造与勾股推导，已有课程参考。

Dream Loop：目标是在已有60°反例后加入短解释，保持直接可读静态答案与图形主舞台。独立数学/范围预审确认锐、钝及外垂足表述。实现后运行完整检查，并尽可用真实 preview 画面独审；具体结果待验，不提前声明通过。

发布前本地检查：210/210 tests、lint、TypeScript、配置、冻结源 Next webpack build/Pagefind 均 exit0；构建HTML包含新说明及原canonical。独立最终数学/文本审阅无需修项；新增坐标回归覆盖锐角内垂足、钝角内垂足、两侧外垂足及靠近端点但非退化情况。实际09UTC发布后的dev页面本轮可正常读取，已保存维护前截图。真实preview修改后画面及部署结果仍待验。

## Dream Loop 结果与发布

- 产品提交：`ed6b1738b4b95ba9978e40fd297619a3dfd1aeb5`。预览[CI38054669077](https://github.com/crazycloudcc/ccblog/actions/runs/38054669077) success；[预览部署](https://vercel.com/chainboxapp/ccblog/ADKKDURHLUxDa4n8ra2NQB4BWw8F)13:11UTC实读Ready/Preview/dev.crazycloud.cc/精确SHA。
- 实际桌面1180×757及500×757窄窗口截图，独立评审均无文字重叠、截断、横向越界或相邻条目冲突；新说明可读，正常换行。窗口随后恢复。未改图形，未把坐标测试说成新作高交互。
- 独审无须修正后，以同SHA非强推更新main。[生产CI38054849538](https://github.com/crazycloudcc/ccblog/actions/runs/38054849538) success；[生产部署](https://vercel.com/chainboxapp/ccblog/A2duDevDKuueHEnCh7e17x9pvPrc)13:14UTC实际Ready/Production/crazycloud.cc/精确SHA；正式页新增说明、已知条件限制、canonical均已读取确认。
- 真实375/390宽度、手机触屏、屏幕阅读器、暗色视觉未验。当前ccblog豁免不替代这些验收；没有学习效果、收录或流量增长结论。

截图：[维护前](baseline.png)、[桌面](final-desktop.png)、[500px窄窗](final-narrow.png)。[独立审阅](independent-review.md)。本次不计新文章，ShanghaiOct10唯一新篇仍是二分答案。
