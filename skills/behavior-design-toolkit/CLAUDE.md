# behavior-design-toolkit/

> L2 | 父级: /CLAUDE.md

## 成员清单

- SKILL.md: skill 唯一入口。YAML frontmatter（name/description/version）+ L3 契约 + 方法决策树与正文。Agent 按此文件驱动执行。
- refs/methods.json: 36 张方法卡全库（4 个 skill 共享同一份数据，md5 一致）。本 skill 取「行为设计」类 3 卡（B=MAT、AIDTAS、认知偏差）及签到/AB 测试相关卡。字段：name/category/one_liner/when_to_use/steps/principles/examples。

[PROTOCOL]: 变更时更新此头部（文件增删、职责变更），然后检查 CLAUDE.md
