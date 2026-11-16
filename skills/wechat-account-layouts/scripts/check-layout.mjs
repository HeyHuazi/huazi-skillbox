#!/usr/bin/env node
/**
 * 排版体检：机械检查渲染成品是否可交付。
 *
 * 只查能机械判定的事——版式契约、图、尾块、占位符、溢出。
 * 内容质量、事实、审核状态一律不查，那些走 xiehui-content-reviewer。
 *
 * 用法: node scripts/check-layout.mjs --preset deep-reading --html 预览-v1.html [--images images.json]
 */
import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const usage = '用法: node scripts/check-layout.mjs --preset main-account|ai-night-school|deep-reading --html 成品.html [--images 清单.json]'
const args = {}
{
  const argv = process.argv.slice(2)
  for (let i = 0; i < argv.length; i++) {
    const key = argv[i].slice(2)
    if (argv[i].startsWith('--') && argv[i + 1] && !argv[i + 1].startsWith('--')) args[key] = argv[++i]
    else args[key] = true
  }
}
if (!args.preset || !args.html) {
  console.error(usage)
  process.exit(2)
}

const html = await readFile(path.resolve(args.html), 'utf8')

const results = []
const ok = (name, detail = '') => results.push({ pass: true, name, detail })
const bad = (name, detail = '') => results.push({ pass: false, name, detail })

// ── 1. 文档结构 ──
if (html.startsWith('<!doctype html>')) ok('HTML 文档声明', '<!doctype html>')
else bad('HTML 文档声明', '缺少 <!doctype html>')

if (/<html[^>]*lang="zh-CN"/.test(html)) ok('语言声明', 'lang="zh-CN"')
else bad('语言声明', '缺少 lang="zh-CN"')

if (/<meta[^>]*charset="UTF-8"/i.test(html)) ok('字符集', 'UTF-8')
else bad('字符集', '缺少 charset="UTF-8"')

// ── 2. 版式契约（wrapper） ──
const presets = JSON.parse(await readFile(path.join(root, 'refs/presets.json'), 'utf8'))
const preset = presets[args.preset]
if (!preset) {
  bad('预设存在', `未知 preset: ${args.preset}`)
} else {
  const wrapperRe = new RegExp(`<section id="${preset.wrapper}"`)
  if (wrapperRe.test(html)) ok('版式 wrapper', `#${preset.wrapper}`)
  else bad('版式 wrapper', `缺少 <section id="${preset.wrapper}">`)
}

// ── 3. 内联样式（公众号只认 inline style） ──
const inlineCount = (html.match(/style="/g) || []).length
const styleTag = /<style[\s>]/i.test(html)
if (!styleTag && inlineCount > 10) ok('样式内联', `${inlineCount} 处 inline style，无 <style> 块`)
else if (styleTag) bad('样式内联', '存在 <style> 块，公众号不执行')
else bad('样式内联', `inline style 仅 ${inlineCount} 处，疑似未内联`)

// ── 4. 图片 ──
const imgTags = html.match(/<img\b[^>]*>/g) || []
const hasManifest = typeof args.images === 'string'
if (imgTags.length) {
  const withAlt = imgTags.filter(t => /alt="[^"]+"/.test(t)).length
  if (withAlt === imgTags.length) ok('图片 alt', `${imgTags.length} 张全部有 alt`)
  else bad('图片 alt', `${imgTags.length - withAlt} 张缺 alt`)
  const broken = imgTags.filter(t => /src="(?!data:|https?:)/.test(t))
  if (broken.length) bad('图片来源', `${broken.length} 张非 base64/外链，公众号粘贴后可能丢失`)
  else ok('图片来源', `${imgTags.length} 张均为 base64/外链`)
} else if (hasManifest) {
  bad('图片', '有配图清单但成品无图片，注入失败')
} else {
  ok('图片', '无配图清单，本稿不带图（合规）')
}

// 图片清单与成品是否一致
if (hasManifest) {
  const manifest = JSON.parse(await readFile(path.resolve(args.images), 'utf8'))
  const expected = Object.keys(manifest).length
  if (imgTags.length === expected) ok('配图数量', `清单 ${expected} 张，成品 ${imgTags.length} 张`)
  else bad('配图数量', `清单 ${expected} 张，成品 ${imgTags.length} 张`)
}

// ── 5. 尾块固定块 ──
const footers = {
  'deep-reading': [
    ['机构简介', /中国继续工程教育协会人工智能分会/],
    ['口号', /从AI旁观者，到AI驾驭者。/],
    ['供稿编辑', /供稿：[\s\S]{0,80}编辑：/],
  ],
  'ai-night-school': [
    ['账号与期号', /上海AI夜校[\s\S]{0,40}AI应用周刊｜\s*\d{4}W\d+/],
  ],
  'main-account': [
    ['蓝顶栏', /#3B5BA5/],
  ],
}
for (const [name, re] of footers[args.preset] || []) {
  if (re.test(html)) ok(`尾块·${name}`)
  else bad(`尾块·${name}`, '未检出')
}

// ── 5b. 篇首导语块底色契约 ──
// 2026-11-16 华子定：夜校导语块底色是签名蓝淡底、不透明，字色/左签/圆角/内边距保持原版。
// 三元组：[名称, 正则, 是否反向]；反向时命中即为错。
const leadBlocks = {
  'ai-night-school': [
    ['签名蓝淡底 #E6EDF9', /background-color:\s*#e6edf9/i, false],
    ['底不透明', /background(-color)?:\s*(rgba|hsla)\(|background(-color)?:\s*transparent/i, true],
    ['非实心深蓝块', /background-color:\s*#024cc6/i, true],
    ['非暖灰底 #faf7f5', /background-color:\s*#faf7f5/i, true],
    ['左蓝签保留', /border-left:\s*3px solid #024cc6/i, false],
  ],
}
if (leadBlocks[args.preset]) {
  const bq = html.match(/<blockquote\b[^>]*>/i)
  if (!bq) {
    bad('导语块', '未检出 blockquote')
  } else {
    for (const [name, re, negate] of leadBlocks[args.preset]) {
      const hit = re.test(bq[0])
      if (negate ? !hit : hit) ok(`导语块·${name}`)
      else bad(`导语块·${name}`, '与 refs/account-specs.json 的 lead_block 不符')
    }
  }
}

// ── 6. 占位符与脏数据 ──
// 只扫可见文本：base64 里会随机命中 XXX/TODO 等字样，扫全文必然误报。
const visibleText = html
  .replace(/<img\b[^>]*>/g, '')
  .replace(/data:[^"']+/g, '')
  .replace(/<(script|style)[\s\S]*?<\/\1>/gi, '')
  .replace(/<[^>]+>/g, ' ')
const leftovers = [
  [/【配图[:：][^】]*】/, '残留配图占位符'],
  [/\[BASE64\]/, '残留 base64 占位'],
  [/\bTODO\b|\bFIXME\b|待补|\bXXX\b/, '残留待办标记'],
  [/localhost|127\.0\.0\.1|file:\/\//, '内网/本地路径'],
]
for (const [re, label] of leftovers) {
  if (re.test(visibleText)) bad('清洁度', `检出${label}`)
}
ok('清洁度', '未检出占位符/待办/内网路径')

// ── 7. 内部块（发布前必须删除） ──
const internalBlocks = [
  [/流转记录/, '内部流转记录'],
  [/v0\.\d+[^\n]{0,20}(草案|待审)/, '版本状态块'],
  [/待核清单|审核意见单/, '内部审核件'],
]
for (const [re, label] of internalBlocks) {
  if (re.test(visibleText)) bad('内部块', `检出${label}，发布前须删`)
}
ok('内部块', '未检出内部块')

// ── 8. 标题层级 ──
const h1 = (html.match(/<h1\b/g) || []).length
const h2 = (html.match(/<h2\b/g) || []).length
if (h1 === 1) ok('H1 数量', '1 个')
else bad('H1 数量', `${h1} 个，应为 1`)
if (h2) ok('H2 小节', `${h2} 个`)
else bad('H2 小节', '0 个，长文应有小节标题')

// ── 输出 ──
const failed = results.filter(r => !r.pass)
console.log(`\n排版体检 · ${preset?.account || args.preset} · ${path.basename(args.html)}\n`)
for (const r of results) {
  console.log(`  ${r.pass ? '✅' : '❌'} ${r.name}${r.detail ? ` — ${r.detail}` : ''}`)
}
console.log(`\n${results.length - failed.length}/${results.length} 项通过${failed.length ? `，${failed.length} 项待处理` : '，可交付'}\n`)
process.exit(failed.length ? 1 : 0)
