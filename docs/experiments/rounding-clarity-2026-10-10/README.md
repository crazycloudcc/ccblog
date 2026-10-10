# 勾股课：中间精度提示维护

实际研究2026-10-10 02:58UTC，实施03:00UTC后；Asia/Shanghai10月10日。这是已有课程的小维护，不是第二篇日更。

## 范围、来源与基线

- 只在共享课程数据的“常见误区”补一条中间精度提示，并增加数学/HTML/Markdown回归。标题、首次发布日期、路由、图形/动画算法、现有内链及SEO配置不变；updated已是当前北京时间日期，不制造新日期。
- 真实学习线索：https://www.reddit.com/r/learnmath/comments/1skh0hs/help_understanding_and_using_pythagorean_theorem/ 。正文存在把中间边长提前近似再求和的困惑。搜索显示2026-04-13，但缓存相对时间与抓取日期不一致，确切发表日期未核实；不是今日热点或搜索量证据。未审原题图片，不判断其网站答案。本站另写单位正方形两条对角线例子。
- 同一既有dot云端，从preview `a6bd79428ac9725724b6d3851cc5bb786c2f7643` 物化并核验288个blob，覆盖所有运行、构建、测试源码及文字文档；16张历史文档图片未下载，提交基于原tree完整保留。没有把旧工作树当最新；旧20项遗留改动不动。package/lock一致才复用已安装依赖，无新环境/分支/凭据或未知脚本。

## Dream Loop目标与实现

以本次真实云端preview维护前截图为布局基准，保留纸色终端外观、原图形主舞台和两列讲解。提示放在原有“常见误区”列表第一项，无新折叠、控件或重型区块；无需点击即可读，窄屏自然换行。目标是帮助读者分清显示近似和后续计算，而不是重新设计证明图。

文案使用“取近似值”，不将保留小数误称取整；题目要求精确值时保留根式。原始数学示例：单位正方形两条对角线总长2√2，保留两位小数2.83；各先近似1.41后求和为2.82。

独立内容审阅已确认教学价值；60位Decimal另行复算。新回归通过BigInt整数平方严格夹逼sqrt(2)与sqrt(8)的舍入区间，避免把浮点计算输出当精确证明；并检查共享HTML/Markdown完整呈现与发布日期保持。

## 门槛和未验项

待最终全tests/lint/types/config/冻结源build/Pagefind、独立实现数学审阅、精确preview CI/Ready、可用真实截图和独立视觉审阅后，再将同SHA推进main。此初始记录不是发布成功声明。原本受阻的本地浏览器路线不重试绕过，仅使用已许可dev.crazycloud.cc。桌面窄窗口不等于物理手机、触屏或屏幕阅读器验收。无流量/排名/收录效果声明。

03:03UTC最终本地208/208tests、lint、types、config、冻结Nextwebpackbuild40路由、Pagefind17页均通过。独立只读实现/数学审阅无阻断：1,974,025 < 2,000,000 < 2,002,225；7,980,625 < 8,000,000 < 8,037,225，严格在舍入区间内，无中点歧义；141+141=282。共享HTML/Markdown和原日期已审。基线hash差异仅lessons.ts与learn-publication.test.mjs，另新增此文档。

## 已完成的发布验收

- 精确产品提交 `06ed4a240e4602b143d16acbd2dbbdbf2f13fe18`；[preview CI38019258727](https://github.com/crazycloudcc/ccblog/actions/runs/38019258727) success，[preview部署](https://vercel.com/chainboxapp/ccblog/GWTk834WrEJor9KT748yz4mVT6LX) Ready / Preview / dev.crazycloud.cc / 精确SHA均实读。
- [维护前基线](baseline.png)、[最终桌面1180×757](final-desktop.png)、[最终窄窗口500×757](final-narrow.png)是真实dot云端浏览器画面。独立截图审阅无阻断：全文、根号、小数正常可读，换行自然，无新增横向截断或重叠，原列表层级保持。鼠标轻遮个别字不是页面缺陷。只审已显示阅读区，不声称重验全部图形舞台或真实手机/读屏。
- 03:07UTC通过expectedSHA非强推推进同一已验收提交至main；[生产CI38019482807](https://github.com/crazycloudcc/ccblog/actions/runs/38019482807) success；03:09:44UTC实读[生产部署](https://vercel.com/chainboxapp/ccblog/89jgKisdEu2qwZLVKvh8VVMrxrH8) Ready / Production / crazycloud.cc / 精确SHA。
- 属于已有文章教学澄清，未增加新篇，不宣称流量/排名增长。未重复登录统计，已有实际采集时间与污染限制仍适用。
