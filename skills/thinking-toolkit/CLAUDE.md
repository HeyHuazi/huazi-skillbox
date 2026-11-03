# thinking-toolkit/

> L2 | 父级: ../../CLAUDE.md

## 成员清单

- SKILL.md: skill 唯一入口。YAML frontmatter（name/description/version）+ L3 契约 + 十个思维角色决策树与完整技法。Agent 按此文件驱动执行。
- refs/README.md: 结构占位。本 skill 无独立 JSON 方法卡，规范内联于 SKILL.md；目录随包分发以满足库结构约定。

## 设计决策

- 十个原始角色（概率侦探、论证解剖师、系统思维黑客、模式猎人、哲学家、追问者、矛盾猎人、思想考古学家、真理探索者、维度坍缩检视）融合为一个 skill：共享同一底层哲学——"拆解表象，触及本质"，每个角色是不同切面的技法卡。
- 十个角色不是十个独立 skill——用户说"帮我分析这个观点"不需要先想该用哪个角色。决策树在 skill 内部路由。
- 角色之间保持纯粹，不交叉混淆。每次分析选用一个主视角。
- 无 refs/ 外部依赖，方法自包含。与 knowledge-alchemist 分工明确：thinking-toolkit 是纯粹的思维分析工具，knowledge-alchemist 是知识输入→输出的转化管道。

[PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
