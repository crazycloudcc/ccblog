# 弧度换算比例说明维护（不是新文章）

## 目标与依据

2026-10-12 09:07 UTC 启动。现有交互已经正确显示 degrees × π / 180，正文也有整圈和标准角例子；此次仅补一般换算为什么成立，帮助只读正文的读者连接定义与代码。首次发布和教学更新日期仍为2026-10-12，当日唯一新篇仍是 radians。

- 原始学习疑问：https://math.stackexchange.com/questions/2650651/why-do-we-use-frac-pi180-to-convert-from-degrees-to-radians ，提问2018-02-14 17:23、编辑17:28。是常青需求，不是当前热度或搜索量证据。
- 原始教材：https://openstax.org/books/algebra-and-trigonometry-2e/pages/7-1-angles ，实际读取换算比例节；页面修订日期未核实。部分论坛答案有倒置比例等错误，不采用。

## 实现范围

只在共享 radians steps 的整圈说明之后加入一段：同一转角的度数为 d、弧度数为 θ，占整圈的比例相同，d/360=θ/(2π)，故 θ=dπ/180，反向 d=180θ/π。说明 d、θ 是两种单位下的数值，半径不影响换算。使用固定非零分母，零角也成立；页面原有0–360°单圈范围不扩展。

新增必要的数学往返/半径独立性测试，以及 HTML/Markdown 直接可读和日期不变回归。算法、SVG、布局、标题、路由、canonical、sitemap、Notes及旧308查询参数规则未改。未包含另一项未发布的二分证明。

## 安全快照与许可

基线为 main/preview 的 eb4ef45df307a82dad1056239709ae0d2dc37fa8。在同一现有 dot 工作区隔离目录通过精确Git提交物化，341个blob哈希全部匹配。旧20项工作树未改，不新增环境或分支；复用既有依赖。实际重读 AetherViz SKILL（afb04d73369d0e4e0a66a583f2ce8896cf5e724f）与仓库MIT许可、Dream Loop SKILL及Pro流程（9bddb901f7d071cfefdd21e264267c757177a9df）。没有运行上游脚本或添加外部图形库。

## Dream Loop 与验收状态

目标是保留现有图形与正文布局，让新增比例说明自然排版。此文字小维护使用原布局和真实基线作为目标，无新生成设计图及图片上传。

09:10:35 UTC 在正常 dev.crazycloud.cc/learn/radians 页面取得真实正文 before 截图，视口1188×761，文字和原六项步骤可读，保存在本批本地 .dream-loop/conversion/before.png。目标不等于实际after验收。

本提交准备阶段：232/232 tests、lint、types、config、冻结源 Next build 与 Pagefind 均通过，实际生成 HTML 与 Markdown 包含新增说明。独立审阅18/18定向测试、576128度数/半径样本、4004反向往返、32零值断言和13非法输入拒绝通过，共4036945断言，最大反向误差5.684341886080802e-14度；341基线文件独立复核仅3个授权源码/测试文件变化。preview、正式站和after截图尚未验收。发布回执将记录精确提交与CI/Ready/域绑定、真实画面及限制。没有把自动检查当作真实手机/触屏/屏幕阅读器或学习效果验证。
