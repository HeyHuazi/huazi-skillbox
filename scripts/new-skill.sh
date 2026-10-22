#!/usr/bin/env bash
# 新 skill 脚手架
# 用法: ./scripts/new-skill.sh <slug> "<一句话简介（中文）>" "<英文 description 片段>"
# [PROTOCOL]: 模板结构变更时更新此文件，然后检查 CLAUDE.md 与 validate.sh
set -eu

cd "$(dirname "$0")/.."
[ $# -ge 2 ] || { echo "用法: $0 <slug> \"中文简介\" \"英文触发场景\""; exit 1; }
slug=$1; cn=$2; en=${3:-"Use when relevant tasks appear."}

[[ "$slug" =~ ^[a-z0-9]+(-[a-z0-9]+)*$ ]] || { echo "✗ slug 必须是 kebab-case: $slug"; exit 1; }
[ -d "skills/$slug" ] && { echo "✗ skills/$slug 已存在"; exit 1; }

mkdir -p "skills/$slug/refs"

cat > "skills/$slug/SKILL.md" <<EOF
---
name: $slug
description: $cn。$en
version: 0.1
---

<!--
[L3 契约]
[INPUT]: 依赖 ./refs/ 的 JSON 方法卡数据
[OUTPUT]: 对外提供 SKILL.md 单文件——方法决策树、适用场景、操作步骤与关键原则
[POS]: skills/$slug 的唯一入口。（TODO: 与兄弟 skill 的边界）
[PROTOCOL]: 变更时更新此头部，然后检查本目录 CLAUDE.md
-->

# ${slug}（TODO: 中文标题）

（TODO: 一句话说明提炼来源）

## 方法速览（决策树）

- 场景 → 方法名
EOF

cat > "skills/$slug/CLAUDE.md" <<EOF
# $slug/

> L2 | 父级: /CLAUDE.md

## 成员清单

- SKILL.md: skill 唯一入口。YAML frontmatter（name/description/version）+ L3 契约 + 方法决策树与正文。Agent 按此文件驱动执行。
- refs/: 结构化方法卡数据（TODO: 填数据文件名与规模）

[PROTOCOL]: 变更时更新此头部（文件增删、职责变更），然后检查 CLAUDE.md
EOF

echo "已生成 skills/$slug/ （SKILL.md + CLAUDE.md + refs/）"
echo "后续步骤:"
echo "  1. 填写 SKILL.md 正文与 refs 数据"
echo "  2. README.md 一览表加一行"
echo "  3. 根 CLAUDE.md L2 索引加一行（skill 计数 +1）"
echo "  4. ./scripts/validate.sh 校验通过后提交"
