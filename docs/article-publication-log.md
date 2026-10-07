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
- 2026-10-08 至 2026-10-14 的 BFS、勾股定理、二维前缀和、叉积、Dijkstra、贝塞尔曲线、凸包目前仅为待审候选，日期与顺序尚未批准，不能据此启动或发布
- 后续记录实际文章 URL、首次上线日期、提交与验证证据；不能把计划写作已发布
- 仅通过 Git 自动部署；先核对远端，preview CI 和部署成功后再推进同一提交到 main；不手动触发 Vercel 部署
