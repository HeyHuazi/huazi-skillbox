# knowledge-alchemist/

> L2 | 父级: ../../CLAUDE.md

## 成员清单

- SKILL.md: skill 唯一入口。YAML frontmatter（name/description/version）+ L3 契约 + 六种知识处理技法决策树与完整步骤。Agent 按此文件驱动执行。
- refs/: 预留，当前无外部数据依赖。

## 设计决策

- 六个原始提示词（知识炼金师 HQ&A、书籍灵魂透视、思想炼金、知识形态转化、学术通俗化、公式解读）融合为一个 skill：共享同一核心使命——"把复杂知识变成大脑最渴望吸收的形态"。
- 技法之间可组合使用——一篇学术文章可先用技法一（HQ&A）提取本质，再用技法五（学术通俗化）翻译。
- 与 thinking-toolkit 分工明确：knowledge-alchemist 是知识输入→淬炼→输出的转化管道，thinking-toolkit 是纯粹的思维分析工具。两者命名区分一目了然：alchemist 有产物（输出物），toolkit 无心（纯分析）。
- 无 refs/ 外部依赖，技法自包含。

[PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md