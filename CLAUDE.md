# huazi-skillbox - 华子日常沉淀的 Agent Skill 收录库

纯 Markdown/JSON 仓库，无构建链。技术栈：YAML frontmatter + Markdown + JSON + Bash 脚本。

## 目录地图

- `skills/` - skill 收录区，每个子目录一个独立 skill（6 个）
- `catalog/` - 大厂项目复盘文章库索引（2388 篇 CSV + README），只读数据，skill 的语料出处
- `scripts/` - 治理脚本：validate.sh（全库校验）、new-skill.sh（脚手架）

## Skill 标准结构（铁律）

```
skills/{slug}/
├── CLAUDE.md    # L2 模块地图：成员清单 + 父级链接
├── SKILL.md     # 入口：YAML frontmatter（name/description/version）+ L3 头部契约 + 正文
└── refs/        # 结构化数据（JSON），SKILL.md 引用的方法卡/模板数据
```

## 法则

- 命名：slug 一律 kebab-case；YAML `name` 必须等于目录名
- frontmatter 必含 `name`、`description`（中英双语，供 Agent 自动匹配）、`version`
- SKILL.md 中引用的 refs/ 文件必须真实存在
- 数据与叙事分离：方法卡数据放 refs/*.json，SKILL.md 只做导航与决策树
- 新增 skill 流程：`scripts/new-skill.sh {slug} "简介"` → 填内容 → `scripts/validate.sh` 通过 → 更新 README 一览表 → 更新本文件 skill 计数
- README 的 Skills 一览表与 skills/ 目录由 validate.sh 守护同构

## L2 索引

- skills/behavior-design-toolkit/CLAUDE.md - 行为设计三件套（B=MAT / AIDTAS / 认知偏差）
- skills/design-delivery-playbook/CLAUDE.md - 设计流程与交付质量手册
- skills/efficiency-toolkit/CLAUDE.md - 设计师效率工具箱
- skills/project-review-writing/CLAUDE.md - 大厂复盘写作六段式模板
- skills/ux-research-playbook/CLAUDE.md - 用户研究方法速查
- skills/visual-system-playbook/CLAUDE.md - 视觉体系构建手册

[PROTOCOL]: 变更时更新此文件（skill 增删、目录结构变化），然后检查 scripts/validate.sh 规则是否需要同步
