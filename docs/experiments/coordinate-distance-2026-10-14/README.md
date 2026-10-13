# 坐标距离：上海2026-10-14唯一新图解

状态：16:00:16UTC之后启动，尚未发布。路由 /learn/coordinate-distance。

## 需求与范围

历史真实提问（2017-01-03 11:59UTC）：https://math.stackexchange.com/questions/2081792/how-do-we-write-the-derivation-of-distance-formula-of-two-points-from-two-differ 。跨象限时坐标有负号，为何距离仍用差？只作需求线索，不复制回答或图片，也不称新热度。

Primary：https://openstax.org/books/algebra-and-trigonometry-2e/pages/2-1-the-rectangular-coordinate-systems-and-graphs 。书目2021-12-21；章节的当前copyright不当更新日期。

独立选题审阅确认：原勾股课面积拼补没有两点坐标交互。新课围绕正交同尺度坐标，区分坐标、有向变化、非负长度；跨轴/交换/共同平移不变，轴对齐与重合另行说明。图形限制整数[-5,5]，一般公式可用于实数平面坐标；不处理经纬度或道路路径。

## 设计与许可

已实际读AetherViz Master SKILL及MIT许可 docs/licenses/aetherviz-master.txt，采用大型原生SVG、同步公式代码、键盘滑块、窄屏和减少动画，适配现有Next应用，无上游可执行脚本/CDN依赖。Dream Loop SKILL/Pro工作流固定9bddb901f7d071cfefdd21e264267c757177a9df及MIT许可 docs/licenses/dream-loop.txt 已读。

目标：暖白终端外壳，等比例坐标平面作主舞台；橙水平、蓝竖直、绿直线及文字标签，不只靠颜色。默认A=(-2,1)、B=(1,-3)、C=(1,1)，Δx=3、Δy=-4、d=5。两点始终不动，动画只逐段显露辅助线，不暗示绕路长度等于直线距离。重合/轴对齐不显示非退化直角标；同时平移不能分别截断。

Dream Loop真实baseline于2026-10-13 15:59:59UTC，显式cdp云浏览器现有勾股课1180×757。生成目标仅本地布局参考、不上传、不当真实截图或数学证据。实现与最终验收待追加。

## 安全快照

实际16:01:34UTC，精确preview456d57ddca4946679c9531bf4c739be399ca6d58物化并验证355个baseline blobs。原20项工作树保持；不包含已取消binary proof。旧日期/路由/308 query/Notes分离保护继续。没有创建新环境/分支、没有新增权限凭据费用。

## 实现与修正

2026-10-13 16:04:19UTC实际查看并锁定生成目标（1566×1005）。目标图横轴刻度存在生成错位，源码按正确数学坐标绘制，不复制该错误。目标始终仅本地布局参考。

首轮256tests及lint/types/build通过后自验发现OG使用LIS fallback标题，已修正并新增回归；字体缓存不可写警告后改用可写临时缓存，实际重看正确PNG。独立审阅发现短边与轴刻度文字撞位，最终保留完整SVG几何/ABC/网格/直角标，边长数值集中到同步解释，端点标签相互远离。没有用简化卡片代替图形。

最终2026-10-13 16:16:17UTC：258/258 tests、lint、TypeScript、配置校验、冻结内容Next webpack build、Pagefind全通过。16:16:43UTC实际构建HTML（排除脚本）、Markdown、SVG、canonical、sitemap、learn入口和勾股双向入口通过。旧308/query与路由回归包含在全tests内，无重复线上访问。

独立数学与真实preview截图/独审、精确preview CI Ready、生产发布尚待完成；本条不声称正式上线。当前250→258测试增加8项；旧binary取消的232与此批无关。

16:18:22UTC独立最终数学/文本/代码审阅PASS，无must-fix：14,641整数端点（12,100非退化、2,420轴对齐非重合、121重合），1,478,741动画状态、6,456,681共同平移候选（793,881可用）、58,564按钮边界、201根式、14,641实际SSR加144中间态、8/8专项通过。精确baseline355文件348未改、7既有文件仅限定集成变更、0缺失；7旧课程及6旧扩展深度一致。旧binary未动。真实视觉/preview/生产仍待。
