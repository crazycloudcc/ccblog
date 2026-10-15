# 前缀和：目标、实现与验收

## 目标与来源

上海2026-10-16唯一新篇 `/learn/prefix-sum`。在n+1个边界上对齐两个前缀，通过平移斜纹消去共同项，留下[l,r)。范围条长表达项的位置；有符号柱图表达数值，不混淆正面积与负和。同步公式、代码与静态解释。

真实常青需求：CSES https://cses.fi/problemset/task/1646 的一基闭区间查询、Library Checker https://judge.yosupo.jp/problem/static_range_sum 的零基左闭右开查询；负数和空区间为本课扩展。动态对照 https://cses.fi/problemset/task/1648 说明修改值需要更新前缀。没有搜索量或热度数据，不作增长归因。18UTC重新实读CSES静态题，仍为同一查询定义，不构造新闻热点。

实际读AetherViz SKILL.md blob afb04d73369d0e4e0a66a583f2ce8896cf5e724f 与MIT许可，保留docs/licenses/aetherviz-master.txt。无第三方脚本安装执行。

## 实现与修正

原环境16–17UTC不可用；17:59UTC实际pwd成功，恢复快照371个blob与510ba基线一致，唯一缺失旧generated target PNG不补造。旧20 dirty未编辑。18UTC续同题实现。

独审指出并已修复：稀疏数组校验漏过undefined、负柱与说明交叠、目录误用LIS预览图。另修目录编号010与单元素预设中六项示例措辞。独立数学与SSR审查：9,840个[-9,0,9]数组的401,040个区间、1,000个随机数组119,945次可加性检查、34非法输入、345组预设×区间×阶段；13项独立检查通过，另重跑作者3定向。状态模拟不等于真实浏览器验收。

## 本地验证

全量初跑275/277通过，两个旧断言随第十课变化：课程总数9→10、AI索引4000字节上限→5000，仍保持紧凑索引约束。修复后278/278通过；lint、tsc --noEmit、配置校验、冻结源码Next webpack生产构建、Pagefind通过。冻结构建直接调用Next，不触发Apple同步以免无关内容变化。Pagefind提示zh-cn不支持词干化，搜索仍可用。OG用既有sharp本地原生SVG生成，fontconfig缓存目录警告未阻止产物生成；1200×630尺寸通过测试。

本地dev默认hostname因uv_interface_addresses系统错误失败；明确127.0.0.1后Ready，但云浏览器连接被拒绝，记录限制并停server，没有更改网络。目标是待精确preview Ready后读取实际画面、独立视觉审阅和修正，再main。当前未宣称真实视觉验收或正式发布。

- OG实际查看发现默认LIS标题残留，已改为Prefix Sum并重新生成，新增防回归测试；最终全量278项。本地实际PNG已查看且标题/图示一致，不能代替页面真实截图。专属noscript提示已补。
