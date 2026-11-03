# text-zen/

> L2 | 父级: ../../CLAUDE.md

## 成员清单

- SKILL.md: skill 唯一入口。YAML frontmatter（name/description/version）+ L3 契约 + 纯文本排版哲学与六条排版法则。Agent 按此文件驱动执行。
- refs/README.md: 结构占位。本 skill 无独立 JSON 方法卡，规范内联于 SKILL.md；目录随包分发以满足库结构约定。

## 设计决策

- 单条原始提示词（群通知优化/文本禅师）独立成 skill：Unix 美学式的纯文本排版是独特能力域，与任何现有 skill 均不重叠。
- 与 folio（HTML 排版 + PNG 导出）和 wechat-account-layouts（公众号内联 HTML）在排版场景互补——text-zen 专攻纯文本，不涉及富文本/HTML/图片。
- 极简主义——六条法则，一条终极律令。无扩展计划。
- 无 refs/ 外部依赖。

[PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
