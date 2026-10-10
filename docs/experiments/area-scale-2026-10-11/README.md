# 相似面积比的简短解释（既有课程维护）

## 目标与来源

2026-10-10 21:05UTC检查现课：已经正确写出面积比为边长比的平方，但尚未解释为什么。此次仅补“底和对应的垂直高都乘同一倍数，因此½×底×高乘该倍数的平方”，不扩展为新篇，不改原图形、标题、首次发布日期或路由。

实际可读的需求线索：[公开学生关于面积为何平方的追问](https://www.reddit.com/r/Sat/comments/1vfd4j8/how_to_solve_this_college_board_question/)。搜索日期为2026-08-04，打开正文却显示相对时间，两者冲突，原疑问日期不能确定；不是实时热点或流量证据。未审阅原图题，不引用其答案或其他评论作为数学证明。Yale课程页正文Cache miss，不作为已读来源。

## 实现与验收目标

- 从精确preview `937abf04378f7d76b50e0086bab9f89c17e05918` 在同一授权云端隔离目录物化。所有非历史证据文件Git blob哈希匹配；历史证据保留远端base tree；旧20项工作树未编辑。
- 共享课程数据补一句解释，静态HTML与Markdown共用，答案不折叠。新增一个回归，用鞋带面积独立于½底×高检查975组滑块组合及默认例子。
- 本课大对小比例 k=H/h；小底s，大底q=x+s。H=6,h=2,x=4时面积分别2和18平方米，边长3倍、面积9倍。数值仅作为测试，不扩写正文。
- AetherViz SKILL及MIT、Dream Loop固定提交9bddb901的SKILL/Pro流程和MIT实际读取。保留既有原创SVG与样式，不引入CDN或新依赖。

## Dream Loop

此次纯文字维护以真实before画面及既有已验布局为视觉目标：补充因果解释后自然换行，不能挤压或替代核心图形。未重新生成或上传可选设计图；前次目标图上传保持停止，审批卡状态未知。本轮不是新的视觉重做，不声称新生成目标图。

实现后检查真实preview桌面及可用窄窗口截图，独立复评后修正必要问题；375/390手机、真机触控、屏幕阅读器、实测FPS不在本轮已验范围。截图保存在本轮现有验证记录，不通过可选blob重传。

## 实际结果

- 产品提交 `0122879633d3605c645fcc54dafe3f385da28db2`。220/220tests、lint/types/config/冻结build/Pagefind均exit0，生成HTML与Markdown包含新句。非历史证据文件逐一核对，产品仅共享课程数据和数学测试改变；模型/UI/样式/路由等精确匹配基线。
- 独立数学另用射线落地交点和海伦公式复算975组，面积比相对误差至多约6.7×10⁻¹⁶；相似课10项测试独立重跑通过，文案和逐字差异审阅通过。
- 真实before-reading、after-desktop1180×757及after-narrow500×757由独立审阅者实际看图：新增解释自然换行，未遮挡/横溢，保持既有纸面双栏/窄窗单栏样式，无阻碍项，不需要额外修正。截图仅支持文字区验收，核心SVG源码不变但不把本轮文字截图当作重新验证整个SVG。没有新生成目标图或新的FPS结果。
- [previewCI38086567511](https://github.com/crazycloudcc/ccblog/actions/runs/38086567511) success；[preview部署](https://vercel.com/chainboxapp/ccblog/HcxjTnSHioKPLqN8Njfpix9FSyuu)实际Ready/Preview/dev.crazycloud.cc/exactSHA。2026-10-10 21:13:01UTC同SHA非强推更新main。
- [生产CI38086763588](https://github.com/crazycloudcc/ccblog/actions/runs/38086763588) success；[生产部署](https://vercel.com/chainboxapp/ccblog/Esxq5udJgAb5WVwPomSqVbhthVW2)实际Ready/Production/crazycloud.cc/exactSHA。2026-10-10 21:14:29UTC首次实际读到正式新句，日期不变。
- 一次preview ref操作因GitAPI机制被拒；提供用户2026-10-09明确连接器例外原问答后，原参数仅重试一次成功。没有更换接口、强推、重发可选图片或新建权限。
- 浏览器恢复原窗口并释放；旧20项工作树保留。此次维护不计另一新篇。
