#!/usr/bin/env bash
# huazi-skillbox 全库校验
# 用法: ./scripts/validate.sh
# [INPUT]: skills/ 目录、shared/ 真源、资源引用与 README/CLAUDE 索引。
# [OUTPUT]: 目录与引用校验结果；错误返回非零状态。
# [POS]: 全库结构校验入口，与 new-skill.sh 共享目录约定。守护 GEB 三层同构与 shared 数据一致性。
# [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
set -u

cd "$(dirname "$0")/.."
fail=0
err() { echo "✗ $1"; fail=1; }
ok()  { echo "✓ $1"; }

# ---------- 0. GEB 协议存在 ----------
[ -f "GEB.md" ] && ok "GEB.md 存在" || err "缺 GEB.md（分形文档系统协议）"

# ---------- 0b. 非 skill 模块 L2 存在 ----------
[ -f "catalog/CLAUDE.md" ] || err "缺 catalog/CLAUDE.md (L2)"
[ -f "scripts/CLAUDE.md" ] || err "缺 scripts/CLAUDE.md (L2)"
[ -f "shared/CLAUDE.md" ] || err "缺 shared/CLAUDE.md (L2)"

# ---------- 0c. shared 数据完整 ----------
[ -f "shared/methods.json" ] || err "缺 shared/methods.json（跨 skill 共享真源）"

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

# ---------- 4. 入口与索引引用的资源必须存在 ----------
for d in skills/*/; do
  slug=$(basename "$d")
  for source in "$d/SKILL.md" "$d/refs/"*.json; do
    [ -f "$source" ] || continue
    while IFS= read -r ref; do
      [ -f "$d/$ref" ] || err "$slug: 引用了不存在的 $ref"
    done < <(grep -oE '(refs|assets|previews)/[A-Za-z0-9_./-]+\.(json|html|css|png)' "$source" | sort -u)
  done
done
[ $fail -eq 0 ] && ok "入口与预设资源引用完整"

# ---------- 4b. shared 数据一致性：分发副本必须与真源 md5 相同 ----------
if [ -f "shared/methods.json" ]; then
  shared_md5=$(md5 -q "shared/methods.json" 2>/dev/null || md5sum "shared/methods.json" | awk '{print $1}')
  for d in behavior-design-toolkit design-delivery-playbook ux-research-playbook visual-system-playbook; do
    copy="skills/$d/refs/methods.json"
    if [ -f "$copy" ]; then
      copy_md5=$(md5 -q "$copy" 2>/dev/null || md5sum "$copy" | awk '{print $1}')
      [ "$shared_md5" = "$copy_md5" ] || err "$d: refs/methods.json md5 与 shared/methods.json 不一致"
    else
      err "$d: 缺 refs/methods.json（应为 shared/methods.json 的分发副本）"
    fi
  done
  [ $fail -eq 0 ] && ok "shared/methods.json 分发副本一致"
fi

# ---------- 5. README 一览表与 skills/ 同构 ----------
readme_rows=$(/usr/bin/grep -cE '\]\(skills/[a-z0-9-]+/\)' README.md)
skill_count=$(ls -d skills/*/ | wc -l | tr -d ' ')
[ "$readme_rows" = "$skill_count" ] || err "README 一览表 $readme_rows 行 ≠ skills/ 实际 $skill_count 个"
diff -q <(printf '%s\n' skills/*/ | sed 's#/$##' | sort) \
  <(grep -oE '\]\(skills/[a-z0-9-]+/\)' README.md | sed 's#^](##;s#/)$##' | sort) \
  >/dev/null || err "README 一览表与实际 skill 名称不一致"

# ---------- 6. L1 的 L2 索引与 skills/ 同构 ----------
l1_rows=$(/usr/bin/grep -cE '^- skills/[a-z0-9-]+/CLAUDE\.md' CLAUDE.md)
[ "$l1_rows" = "$skill_count" ] || err "CLAUDE.md L2 索引 $l1_rows 条 ≠ skills/ 实际 $skill_count 个"
diff -q <(printf '%s\n' skills/*/CLAUDE.md | sort) \
  <(grep -oE '^\- skills/[a-z0-9-]+/CLAUDE\.md' CLAUDE.md | sed 's/^- //' | sort) \
  >/dev/null || err "CLAUDE.md L2 索引与实际 skill 模块地图不一致"

# ---------- 6b. L1 的 L2 索引包含非 skill 模块 ----------
for mod in catalog scripts shared; do
  grep -q "^- $mod/CLAUDE\.md" CLAUDE.md || err "CLAUDE.md L2 索引缺 $mod/CLAUDE.md"
done

[ $fail -eq 0 ] && ok "README 与 L1 索引同构 (共 $skill_count skills + catalog/scripts/shared)"

echo ""
if [ $fail -eq 0 ]; then echo "全部通过 ✓"; exit 0; else echo "存在错误 ✗"; exit 1; fi
