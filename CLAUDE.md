# huazi-skillbox - 华子日常沉淀的 Agent Skill 收录库

无构建链。技术栈：Markdown + JSON + Bash + HTML/CSS；Folio 用 Node.js + Playwright 导出图片。
GEB 分形文档系统协议见 [GEB.md](GEB.md)。

## 目录地图

- `skills/` - skill 收录区，每个子目录一个独立 skill（现有 17 个，含公众号排版、公文写作、文案创作、思维模型、知识炼金、标题创作等）
- `shared/` - 跨 skill 共享数据唯一真源（methods.json 供 4 个 skill 引用）
- `catalog/` - 大厂项目复盘文章库索引（2388 篇 CSV + README），只读数据，skill 的语料出处
- `scripts/` - 治理脚本：validate.sh（全库校验）、new-skill.sh（脚手架）
- `outputs/` - 本次任务产物，按任务分目录；不纳入版本控制

## Skill 标准结构（铁律）

```
skills/{slug}/
├── CLAUDE.md    # L2 模块地图：成员清单 + 父级链接
├── SKILL.md     # 入口：YAML frontmatter（name/description/version）+ L3 头部契约 + 正文
├── refs/        # 结构化数据（JSON），SKILL.md 引用的方法卡/模板数据
├── assets/      # 按需添加：按预设分组的模板与样式
├── previews/    # 按需添加：可复用的成图样例
└── scripts/     # 按需添加：可重复执行的工具
```

## 法则

- 命名：slug 一律 kebab-case；YAML `name` 必须等于目录名
- frontmatter 必含 `name`、`description`（中英双语，供 Agent 自动匹配）、`version`
- SKILL.md 中引用的 refs/ 文件必须真实存在
- 模板按 assets/{preset}/ 分组，预览与模板分开
- 正式任务产物写入 outputs/{task}/，不混入 skill 资源
- 数据与叙事分离：方法卡数据放 refs/*.json，SKILL.md 只做导航与决策树
- 共享数据单一真源：跨 skill 复用的数据放 shared/，各 skill 保留分发副本，validate.sh 校验 md5 一致性
- 新增 skill 流程：脚手架 → 填内容 → 同步 README 与本文件索引、计数 → `scripts/validate.sh` 通过
- README 的 Skills 一览表与 skills/ 目录由 validate.sh 守护同构

## L2 索引

- shared/CLAUDE.md - 跨 skill 共享数据唯一真源（36 张方法卡全库）
- catalog/CLAUDE.md - 2388 篇大厂复盘文章索引，只读语料库
- scripts/CLAUDE.md - 全库脚手架与结构校验
- skills/folio/CLAUDE.md - 图文排版与图片导出，蓝色周刊支持竖版、方图与长图
- skills/wechat-account-layouts/CLAUDE.md - 三号公众号样式选择、主号成稿版式与 MarkFlow 双主题的内联 HTML 交付，配图清单注入
- skills/lieflat-gongwen/CLAUDE.md - 公文写作 DNA：两族七文种可验收风格参数与自检脚本（上游收录，保留中文目录约定）
- skills/association-writing-guide/CLAUDE.md - 协会公开稿件文风和内容红线
- skills/government-article-reviewer/CLAUDE.md - 政务文章发布前审校：政治表述/人名职务/文种结构/语言语法/标点数字六轮检查与 A·B·C 分级
- skills/behavior-design-toolkit/CLAUDE.md - 行为设计三件套（B=MAT / AIDTAS / 认知偏差）
- skills/design-delivery-playbook/CLAUDE.md - 设计流程与交付质量手册
- skills/efficiency-toolkit/CLAUDE.md - 设计师效率工具箱
- skills/project-review-writing/CLAUDE.md - 大厂复盘写作六段式模板
- skills/ux-research-playbook/CLAUDE.md - 用户研究方法速查
- skills/visual-system-playbook/CLAUDE.md - 视觉体系构建手册
- skills/thinking-toolkit/CLAUDE.md - 十个思维角色工坊：概率侦探、论证解剖、系统思维、模式猎人、哲学怀疑、深层追问、矛盾揭示、第一性原理、真理探求、维度坍缩检视
- skills/knowledge-alchemist/CLAUDE.md - 知识炼金工坊：六种知识处理技法（HQ&A 萃取、书籍透视、思想炼金、形态转化、学术通俗化、公式解读）
- skills/title-crafter/CLAUDE.md - 标题炼金：标题党实操钩子公式 + 标题炼金师认知缺口哲学，五标题输出
- skills/sharp-observer/CLAUDE.md - 敏锐观察者：三种观察叙事技法（时间暂停、留白凝视、身体语言解码）
- skills/text-zen/CLAUDE.md - 文本禅师：纯文本排版六法则，Unix 之美
- skills/ad-copy-master/CLAUDE.md - 李明广告文案与概念定义：三十年传奇文案大师角色，两大战法（文案创作/概念定义）合一

[PROTOCOL]: 变更时更新此文件（skill 增删、目录结构变化），然后检查 scripts/validate.sh 规则是否需要同步
