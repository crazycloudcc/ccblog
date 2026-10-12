# 相似三角形周长与比例方向说明

2026-10-12 14:08 UTC 启动，维护现有课，不计新文章；教学日期保持2026-10-11。

## 需求与范围

- https://math.stackexchange.com/questions/1898045/relationship-between-perimeter-of-2-similar-triangle ，原问2016-08-20 12:56，问周长比例的证明。
- https://math.stackexchange.com/questions/4823726/perimeter-and-areas-of-similar-triangles ，原问2023-12-10 07:30，混淆比例方向。均实际阅读，是常青需求，不称新热度或搜索量。
- 独立适配审阅确认：现有面积k²说明正确，但缺周长求和及反向比值解释。本次仅扩充最后一条易错点：三边均乘k，周长也乘k；面积乘k²；大/小与小/大顺序一致。保留原面积推导、模型和半透明轮廓提示，不新增模型或交互。

## 快照、许可与目标

同一已有dot云端从精确preview efa9778ce07eee7fb3fbc0fce36e18ea798c59ce物化隔离目录，342个blob逐项匹配；复用既有依赖，无新分支/环境/安装，旧20项保持。已实际重读AetherViz SKILL blob afb04d73369d0e4e0a66a583f2ce8896cf5e724f及仓库MIT许可，Dream Loop SKILL与Pro流程commit9bddb901f7d071cfefdd21e264267c757177a9df。仅采用教学/审阅流程，不执行上游脚本或增加CDN。

Dream Loop目标是保留现有正文布局并自然容纳短解释，使用真实现有布局为文字维护目标，不生成或上传可选图片。14:10:09正常dev页面取得真实1180×757 baseline，新增段落尚未上线；本地 .dream-loop/perimeter/before.png。目标不能冒充after验收。

仅3个源/测试文件变化：共享lessons、数学回归、HTML/Markdown静态出版回归。图形/算法/日期/标题/路由/canonical/sitemap/旧308query/Notes保持。具体已取消binary README上传不在本次范围，普通binary仍3步骤。

## 当前验收

实现已准备，完整tests/lint/types/config/冻结build/Pagefind与独立数学审阅正在运行。未提交preview或main，真实after/精确部署尚未验收。后续回执记录终态；不将自动检查称真实手机、触屏、屏幕阅读器或学习效果验证。既有线上Markdown客户端阻止不重试。

14:12:38 UTC完整234/234 tests、lint、types、config、冻结Next build与Pagefind通过；实际构建HTML及Markdown含周长说明/反向比例。独立21/21聚焦测试已通过，数学边界全审仍在完成。仅指定三份源/测试文件不同，未包含未发布binary证明。

14:14 UTC独立数学/文本审阅通过，无必修项：21/21聚焦测试；975组滑块组合、2000内部样本，全部三边/周长/面积及倒数、极值与排除边界验证。12个数学有效但超图形范围的情况由图形模型正确拒绝，24个非法情况拒绝。其他339基线blob不变。报告在本地 .dream-loop/perimeter/math-review.md；未将局部测试冒称全量。

## 精确 Preview 与画面

产品提交076db369cdc61a63563ea601d1ff740c9b1c24e6于14:15:44非强推更新preview，expectedSHA为efa9778。Git触发短暂延迟后自然启动，未手动部署、空提交或更换路线。[CI38261624860](https://github.com/crazycloudcc/ccblog/actions/runs/38261624860) success；14:19:25实际核验[部署](https://vercel.com/chainboxapp/ccblog/Byi2hjHApncZXNrqVVixBhFrkmTK) Ready/Preview/dev.crazycloud.cc/精确SHA。

14:19:50真实1180×757桌面及14:20:05真实500×757窄窗after，新增说明完整可读；窄窗clientWidth=scrollWidth=500，无页面横向溢出。canonical保持正式课URL，两日期保持2026-10-11；窗口已恢复1180×757。本地截图 .dream-loop/perimeter/after-desktop.png 和after-narrow.png；不声称图片上传仓库。独立视觉复评尚在进行，main未推进。

此次仅验变化正文，375/390真机、触屏、屏幕阅读器、FPS及未变核心图形交互未重验。自动全checks覆盖相关回归，不替代未做的真实设备验收。

14:21UTC独立实际三张截图复评9.4/10，通过；无阻碍或必须修正项。可选建议仅截图时移动鼠标，不影响产品。14:21:52同一产品SHA非强推推进main，expectedSHA3462cf；生产CI/Ready/域绑定与正式正文等待核验，尚不称正式完成。

## 正式发布

2026-10-12 14:24:27 UTC / 上海22:24:27实际确认 https://crazycloud.cc/learn/similar-triangles 含周长求和与反向比例说明，canonical保持正式URL，首次发布/教学更新均2026-10-11。

- main产品076db369cdc61a63563ea601d1ff740c9b1c24e6。
- [生产CI38262364590](https://github.com/crazycloudcc/ccblog/actions/runs/38262364590) completed/success。
- [生产部署](https://vercel.com/chainboxapp/ccblog/6Gyw6Yv5afsSxqCLSoS5hx2HGpeN) Ready/Production/crazycloud.cc/精确SHA实读。
- 234全检查、独立21聚焦/2975数学样本及边界、实际截图复评9.4全部通过。图形/算法未改，未重新验375/390、真机触屏、屏幕阅读器或FPS；线上Markdown既有阻止不重试，本地构建已验。
- 维护不计新篇，无流量或学习效果声明；旧binary具体取消保持停止。没有可选图片上传，没有修改另外两个已停止项目。
