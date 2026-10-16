# 差分数组：目标、实现与验收

上海2026-10-17唯一新篇 `/learn/difference-array`；2026-10-16 16:00 UTC之后开始实现。先圈出左闭右开区间，再显示起止事件，再逐格扫描恢复额外增量和最终值。大幅SVG、公式、文字、代码共用同一状态；原数组与增量差分明确分开。全段、末项、负增量、两段重叠、空区间、零增量可探索。原Notes与308路径不修改。

## 需求与边界

AtCoder AWC0173 D（2026-10-07）：https://atcoder.jp/contests/awc0173/tasks/awc0173_d 。批量范围攻击后统一判断结果，最多10万次更新、100万个位置，是实际适用问题。这里只引用题型与限制，独立证明边界事件公式，不把AI生成题解当数学验证。不声称新热点、搜索量、流量或转化增长。

实读AetherViz SKILL.md（afb04d73369d0e4e0a66a583f2ce8896cf5e724f）与仓库MIT许可；使用其同步探索教学结构，原生React/SVG实现，不加入外部脚本/服务。实读Next 16.2.10 use-client文档。

## 恢复与实现

在原dot工作区恢复0ce6548精确源文件，378个blob核对Git SHA，唯一缺失历史generated target PNG未重造；发布以原远端tree为基底，保持它和所有无关文件。旧checkout20项dirty及状态文本SHA256 dce205ced636c0d68e4ca7d0fb416c80e26314e019d710d5441835a9ec6a5769未变。无新环境、分支或凭据。

独立首审指出重叠预设公式/第二步说明/SVG名称只描述首个更新，已补第二个更新事件。模型具备稀疏数组、非法边界/增量校验与不修改输入保证。作者测试穷举小数组单次更新与双更新叠加/交换，并验证哨兵、空区间、预设和发现入口。完整静态正文、Markdown、canonical、sitemap与分享图沿用统一课程数据。

## 验证状态

初始282/282测试、lint、tsc、配置校验、冻结源码Next webpack构建及Pagefind通过；后续修改须再跑最终门禁。未执行Apple同步，避免无关数据变化。Pagefind的zh-cn词干提示不影响索引。原生SVG生成1200×630PNG并实际查看；fontconfig缓存警告未阻止生成。

本地dev明确127.0.0.1启动成功，但dot云浏览器访问报ERR_CONNECTION_REFUSED。停止server，不改网络或换环境；真实页面视觉/键盘验收留待精确preview就绪。不把代码审查或静态测试当真实画面。设计目标：桌面主体优先容纳图形、公式与步进；窄屏图形内部横滚，按钮可触及；减少动画时禁止自动播放，单步可用。

当前未正式发布。须独审闭环、最终检查、精确preview CI/Ready、实际画面审查后再更新main；生产再核精确CI/Ready、hostname与页面。手机实机、屏幕阅读器、FPS未宣称已验。

## 独审与真实preview闭环

最终初版282 tests、lint/types/config/冻结build/Pagefind全部重跑通过。独立623559组朴素对照（382075单更新、191484双更新、50000全边界随机）、48非法输入、4032渲染阶段状态通过；每组显示代码执行与结果、几何与文字一致，控制handler和静态全文也通过。

初版preview `3b746e968992c186e71beec9cc68d8fe0e403f56`，[CI38929854064](https://github.com/crazycloudcc/ccblog/actions/runs/38929854064) success，[部署](https://vercel.com/chainboxapp/ccblog/1Jbxanip4FnkUVKRB1GFRXRGE28j) Ready/Preview/精确SHA/dev.crazycloud.cc绑定实核。

真实dot云浏览器1180×757与503×757截图已独立像素审阅，无must-fix；重叠8/8最终数组、空区间抵消、Home键改边界、播放中重置、日期与canonical实验通过。503px下页面宽与scrollWidth均503，图形内部单独横滚。发现两项可改进：选中预设缺少视觉样式、窄屏末步的活动格子需手动横滚。修正版增加pressed样式与只在离散步骤变化时即时滚动图形到活动格子，不滚动页面，不增加运动动画。待修正版门禁与preview复验。

尝试浏览器减少动画模拟时，组织策略禁止DevTools，已停止该路径，没有规避。减少动画的禁播/单步由独立渲染及source检查验证，未冒充实际浏览器系统模式验收。无手机实机、屏幕阅读器或FPS验证。
