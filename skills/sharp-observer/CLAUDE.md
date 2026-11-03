# sharp-observer/

> L2 | 父级: ../../CLAUDE.md

## 成员清单

- SKILL.md: skill 唯一入口。YAML frontmatter（name/description/version）+ L3 契约 + 三种观察叙事技法决策树与完整操作步骤。Agent 按此文件驱动执行。
- refs/README.md: 结构占位。本 skill 无独立 JSON 方法卡，规范内联于 SKILL.md；目录随包分发以满足库结构约定。

## 设计决策

- 三条原始提示词（特殊的观察者、六十岁的农民、身体语言分析）融合为一个 skill：共享同一叙事内核——克制、留白、细节驱动。
- 三条路线覆盖三种输入形态：场景/瞬间（时间暂停叙事）、人物倾诉（留白凝视）、照片/面部（身体语言解码）。可组合使用。
- 与 thinking-toolkit 分工明确：sharp-observer 输出的是叙事（故事/描写），thinking-toolkit 输出的是分析（判断/结论）。
- 无 refs/ 外部依赖。

[PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
