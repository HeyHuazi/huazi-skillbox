#!/usr/bin/env bash
# huazi-skillbox 全库校验
# 用法: ./scripts/validate.sh
# [PROTOCOL]: 新增校验规则时更新此文件头部，然后检查 CLAUDE.md
set -u

cd "$(dirname "$0")/.."
fail=0
err() { echo "✗ $1"; fail=1; }
ok()  { echo "✓ $1"; }

# ---------- 1. 每个 skill 目录结构完整 ----------
for d in skills/*/; do
  slug=$(basename "$d")
  [ -f "$d/SKILL.md" ]  || err "$slug: 缺 SKILL.md"
  [ -f "$d/CLAUDE.md" ] || err "$slug: 缺 CLAUDE.md (L2)"
  [ -d "$d/refs" ]      || err "$slug: 缺 refs/ 目录"
done
[ $fail -eq 0 ] && ok "skill 目录结构完整"

# ---------- 2. frontmatter 完整 + name 一致 ----------
for d in skills/*/; do
  slug=$(basename "$d")
  head -1 "$d/SKILL.md" | grep -q '^---' || { err "$slug: SKILL.md 缺 YAML frontmatter"; continue; }
  for key in name description version; do
    awk '/^---$/{n++;next} n==1 && /^'"$key"':/' "$d/SKILL.md" | grep -q . || err "$slug: frontmatter 缺 $key"
  done
  name=$(awk '/^---$/{n++;next} n==1 && /^name:/{sub(/^name:[ ]*/,"");print;exit}' "$d/SKILL.md")
  [ "$name" = "$slug" ] || err "$slug: frontmatter name '$name' ≠ 目录名"
done
[ $fail -eq 0 ] && ok "frontmatter 与目录名一致"

# ---------- 3. L3 契约存在 ----------
for d in skills/*/; do
  slug=$(basename "$d")
  grep -q '\[POS\]:' "$d/SKILL.md" || err "$slug: SKILL.md 缺 L3 头部契约"
done
[ $fail -eq 0 ] && ok "L3 契约齐全"

# ---------- 4. refs 引用完整（SKILL.md 提到的 refs/*.json 必须存在） ----------
for d in skills/*/; do
  slug=$(basename "$d")
  grep -o 'refs/[A-Za-z0-9._-]*\.json' "$d/SKILL.md" | sort -u | while read -r ref; do
    [ -f "$d/$ref" ] || err "$slug: 引用了不存在的 $ref"
  done
done
[ $fail -eq 0 ] && ok "refs 引用完整"

# ---------- 5. README 一览表与 skills/ 同构 ----------
readme_rows=$(/usr/bin/grep -cE '\]\(skills/[a-z0-9-]+/\)' README.md)
skill_count=$(ls -d skills/*/ | wc -l | tr -d ' ')
[ "$readme_rows" = "$skill_count" ] || err "README 一览表 $readme_rows 行 ≠ skills/ 实际 $skill_count 个"

# ---------- 6. L1 的 L2 索引与 skills/ 同构 ----------
l1_rows=$(/usr/bin/grep -cE '^- skills/[a-z0-9-]+/CLAUDE\.md' CLAUDE.md)
[ "$l1_rows" = "$skill_count" ] || err "CLAUDE.md L2 索引 $l1_rows 条 ≠ skills/ 实际 $skill_count 个"

[ $fail -eq 0 ] && ok "README 与 L1 索引同构 (共 $skill_count skills)"

echo ""
if [ $fail -eq 0 ]; then echo "全部通过 ✓"; exit 0; else echo "存在错误 ✗"; exit 1; fi
