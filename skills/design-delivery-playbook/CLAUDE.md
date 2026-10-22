# design-delivery-playbook/

> L2 | 父级: /CLAUDE.md

## 成员清单

- SKILL.md: skill 唯一入口。YAML frontmatter（name/description/version）+ L3 契约 + 方法决策树与正文。Agent 按此文件驱动执行。
- refs/methods.json: 36 张方法卡全库（4 个 skill 共享同一份数据，md5 一致）。本 skill 取「流程评审」类 4 卡：全员走查、五节点流程、95% 还原、印前八项。字段：name/category/one_liner/when_to_use/steps/principles/examples。

[PROTOCOL]: 变更时更新此头部（文件增删、职责变更），然后检查 CLAUDE.md
