# 华子工具箱 / huazi-skillbox

华子制作的 Agent Skills。每个 skill 独立放在 `skills/`，按需安装。

## 目录

```text
skills/             可独立安装的 Skill
  folio/
    SKILL.md        入口与使用规则
    refs/           预设索引
    assets/         按样式分组的 HTML/CSS
      weekly-blue/  竖版卡片、方图、长图母版
    previews/       三种画幅与原始横版预览
    scripts/        通用 PNG 导出器
shared/             跨 skill 共享数据唯一真源
catalog/            设计复盘文章索引
scripts/            全库脚手架与校验
outputs/            任务产物，按需生成并由 Git 忽略
```

模板源码与预览图随 Skill 保存。每次任务的成品放在
`outputs/<任务名>/`，避免覆盖母版。

## 设计方法

从语雀「[大厂项目复盘知识库](https://www.yuque.com/suoyibo/lk20w0)」2388 篇大厂设计复盘文章（42947 张配图 OCR 文字挖掘）中提炼的 **6 个设计方法 Agent Skill**，另收录 Folio、协会写作指南、三个公众号版式 Skill、文案创作 Skill 及 5 个语言与思维 Skill，现共 17 个。面向 [Agent Skill](https://code.claude.com/docs/en/skills) 标准格式（SKILL.md + YAML frontmatter + refs/ 结构化数据）。

设计方法 skill = 一类设计工作的速查手册：方法卡片含适用场景、操作步骤、关键原则、出处文章，可直接驱动 AI 助手按大厂实战方法论执行任务。folio 则是排版导出工具，将已有图文排版为 HTML 并导出 PNG。

## Skills 一览

| Skill | 一句话简介 |
|---|---|
| [folio](skills/folio/) | 将已有图文排版为 HTML 并导出 PNG，支持竖版卡片、方图和自适应长图 |
| [ux-research-playbook](skills/ux-research-playbook/) | 大厂用户研究方法速查：体验地图、服务蓝图、用户画像、可用性测试、眼动实验、日记研究、合意性测试等 15 法 |
| [behavior-design-toolkit](skills/behavior-design-toolkit/) | 行为设计三件套落地：福格模型 B=MAT、AIDTAS 精细化转化、认知偏差库，外加签到激励体系选型与 AB 测试验证结论 |
| [project-review-writing](skills/project-review-writing/) | 大厂项目复盘写作模板：六段式叙事骨架（缘起-诊断-立标-破题-验证-收束），基于 13 家公司 26 篇精读复盘的结构分析 |
| [design-delivery-playbook](skills/design-delivery-playbook/) | 设计流程与交付质量手册：全员体验走查、五节点标准流程、95% 高还原交付、印前八项检查 |
| [visual-system-playbook](skills/visual-system-playbook/) | 视觉体系构建手册：情绪板制定风格、APP 视觉品牌定义 12 周 8 步法、设计语言 0-1 全链路、大改版视觉升级流程 |
| [efficiency-toolkit](skills/efficiency-toolkit/) | 设计师效率工具箱：时间块规划、任务池 ROI、工程化设计、流程自动化、审批提效、AI 批量处理、可视化选型等 11 法 |
| [association-writing-guide](skills/association-writing-guide/) | 协会公开稿件文风与表达规范：政务纪实体/专题纵深体双文体决策、标题句式工艺、事实与称谓规范、内容六条红线与自检清单，基于协会通讯 86 期精读提炼 |
| [government-article-reviewer](skills/government-article-reviewer/) | 政务文章审校：按政治表述→人名职务→文种结构→语言语法→标点数字的顺序检查，A/B/C 三级问题分级与人工核验清单，附公文文种与官方媒体写法三份细则 |
| [wechat-account-layouts](skills/wechat-account-layouts/) | 三个公众号的排版交付：主号成稿蓝色版式、MarkFlow AI 夜校版式、MarkFlow 深度阅读版式；输出可供人复制的内联 HTML，不操作公众号后台 |
| [lieflat-gongwen](skills/lieflat-gongwen/) | 公文写作 DNA：基于 229+77 篇真实公文全量统计的可验收风格参数（句长/顿号密度/层级配比/力度词配额），覆盖调研报告、领导讲话、工作意见、经验材料、工作方案、经验总结与千字级党建材料，含参数自检脚本 |
| [thinking-toolkit](skills/thinking-toolkit/) | 思维模型工坊：十个思维角色（概率侦探、论证解剖师、系统思维黑客、模式猎人、哲学家、追问者、矛盾猎人、思想考古学家、真理探索者、维度坍缩检视），一个决策树路由 |
| [knowledge-alchemist](skills/knowledge-alchemist/) | 知识炼金工坊：六种知识处理技法（HQ&A 萃取、书籍透视、思想炼金、形态转化、学术通俗化、公式解读） |
| [title-crafter](skills/title-crafter/) | 标题炼金：标题党五钩子公式 + 标题炼金师认知缺口哲学，输出五个差异化标题方案 |
| [sharp-observer](skills/sharp-observer/) | 敏锐观察者：三种观察叙事技法（时间暂停叙事、留白凝视、身体语言解码），克制留白细节驱动 |
| [text-zen](skills/text-zen/) | 文本禅师：纯文本排版六法则，Unix 之道——简洁即美，空白即语言 |
| [ad-copy-master](skills/ad-copy-master/) | 李明广告文案与概念定义：三十年传奇文案大师角色，两大战法（文案创作/概念定义）合一，输出广告语、品牌 slogan、产品文案与概念命名 |

## 用法

把需要的 skill 目录复制到你的 Agent skills 目录：

```bash
# Claude Code
cp -R skills/<skill-name> ~/.claude/skills/

# Alma
cp -R skills/<skill-name> ~/.config/alma/skills/
```

之后 AI 助手会在任务匹配 skill 的 `description` 时自动加载（也可显式点名调用）。

文章索引见 [catalog](catalog/)。

## 新增 Skill（治理流程）

```bash
# 1. 脚手架
./scripts/new-skill.sh my-skill "一句话中文简介" "English trigger description"

# 2. 填写 SKILL.md 正文与 refs/ 数据

# 3. README 一览表 + 根 CLAUDE.md L2 索引各加一行

# 4. 校验通过后提交
./scripts/validate.sh
```

规则：slug 一律 kebab-case；frontmatter 必含 name/description/version 且 name 等于目录名；方法卡数据放 refs/，SKILL.md 只做导航；跨 skill 共享数据放 shared/，分发副本由 validate.sh 校验 md5 一致性；文档三层结构（根 CLAUDE.md → skill 目录 CLAUDE.md → SKILL.md 头部契约）由校验脚本守护同构。

## 数据来源

- 语雀「大厂项目复盘知识库」（<https://www.yuque.com/suoyibo/lk20w0>）：2388 篇大厂设计复盘文章
- 2026-10 图片 OCR 增量挖掘：42947 张配图中的方法论要点
- 各 skill 的 `refs/` 目录内为结构化方法卡数据（JSON），出处文章逐条标注于卡片内

## License

[MIT](LICENSE) © HeyHuazi 2026
