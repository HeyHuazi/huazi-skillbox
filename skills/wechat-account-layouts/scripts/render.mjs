#!/usr/bin/env node
// 从本 Skill 自带三套样式渲染公众号 HTML；Markdown 运行库优先用本 Skill 自带的 node_modules（npm install），
// 没有时退回本机 MarkFlow 项目，不改其源码。
//
// 关键约定（见 refs/account-specs.json）：
//  1. 配图不能只靠 Markdown —— 稿件 .md 往往不含图片语法，图片在成稿阶段才插入。
//     故渲染器支持 --images 清单与 --image-dir，把本地图片按位置注入并内联为 base64。
//  2. 各号头尾块不同（主号栏目名/期号、夜校尾栏、中继协机构块），由 --meta 传入。
//  3. 输出是可直接粘进公众号编辑器的内联 HTML；公众号后台粘贴后需实测图片是否仍存在。
import { createRequire } from 'node:module'
import { readFile, mkdir, writeFile, readdir, stat } from 'node:fs/promises'
import { fileURLToPath, pathToFileURL } from 'node:url'
import path from 'node:path'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const usage = `用法: node scripts/render.mjs --preset main-account|ai-night-school|deep-reading --input 稿件.md --output 成品.html
可选:
  --markflow /path/to/MarkFlow   MarkFlow 依赖位置（默认 /Users/huazi/Code/Developer/MarkFlow，或 MARKFLOW_DIR）
  --images 清单.json             配图清单：{ "插入点锚文本": { "file": "相对路径", "alt": "替代文本" } }
  --image-dir 目录              配图根目录（默认与 --input 同目录）
  --meta 键=值                   各号头尾信息（可重复），如 --meta 期号=2026W44 --meta 栏目名=知识更新
  --no-inline-images            不把图片转 base64，保留文件相对路径（供人上传后替换）`

// 参数解析：--key value 成对；--meta 可重复，收集为对象
const args = {}
const meta = {}
{
  const argv = process.argv.slice(2)
  for (let i = 0; i < argv.length; i++) {
    const token = argv[i]
    if (!token.startsWith('--')) throw new Error(usage)
    const key = token.slice(2)
    if (key === 'meta') {
      const kv = argv[++i] ?? ''
      const eq = kv.indexOf('=')
      if (eq > 0) meta[kv.slice(0, eq)] = kv.slice(eq + 1)
      continue
    }
    if (key === 'no-inline-images') { args[key] = true; continue }
    const value = argv[++i]
    if (value === undefined) throw new Error(usage)
    args[key] = value
  }
}
if (!args.preset || !args.input || !args.output) throw new Error(usage)

const presets = JSON.parse(await readFile(path.join(root, 'refs/presets.json'), 'utf8'))
const preset = presets[args.preset]
if (!preset) throw new Error(`未知版式: ${args.preset}\n${usage}`)

// 依赖解析顺序：--markflow 指定 → MARKFLOW_DIR 环境变量 → 本 Skill 自带 node_modules → 本机默认 MarkFlow 项目。
// 前三个是给别的机器用的（skill 目录里跑过 npm install 即可自包含），最后一个是本机原有习惯，保留兼容。
const depNames = ['unified', 'remark-parse', 'remark-gfm', 'remark-rehype', 'rehype-stringify', 'rehype-sanitize', 'juice']
const depBases = [
  args.markflow,
  process.env.MARKFLOW_DIR,
  root,
  '/Users/huazi/Code/Developer/MarkFlow',
].filter(Boolean).map(p => path.resolve(p))

let depPaths = null
const tried = []
for (const base of depBases) {
  try {
    const req = createRequire(path.join(base, 'package.json'))
    depPaths = depNames.map(name => req.resolve(name))
    break
  } catch {
    tried.push(base)
  }
}
if (!depPaths) {
  throw new Error(
    '找不到 Markdown 渲染依赖（' + depNames.join(' / ') + '）。\n' +
    '已尝试：\n  ' + tried.join('\n  ') + '\n' +
    '解决：在本 Skill 目录执行 npm install，或用 --markflow 指向已安装这些依赖的项目。',
  )
}
const load = p => import(pathToFileURL(p).href)
const [{ unified }, { default: remarkParse }, { default: remarkGfm }, { default: remarkRehype }, { default: rehypeStringify }, { default: rehypeSanitize }, juiceModule] = await Promise.all(
  depPaths.map(load),
)
const juice = juiceModule.default

// ---------- 读取稿件 ----------
const markdown = await readFile(path.resolve(args.input), 'utf8')
const input = markdown.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, '')

// ---------- Markdown → HTML ----------
const html = String(await unified().use(remarkParse).use(remarkGfm).use(remarkRehype).use(rehypeSanitize).use(rehypeStringify).process(input))

// ---------- 配图注入 ----------
const imageDir = path.resolve(args.imageDir || path.dirname(path.resolve(args.input)))
const mimeOf = f => (/\.png$/i.test(f) ? 'image/png' : /\.(webp|heic)$/i.test(f) ? 'image/webp' : 'image/jpeg')

/** 取某文件转 base64 data URI；--no-inline-images 时返回相对路径 */
async function toDataUri(abs, rel) {
  if (args['no-inline-images']) return rel
  const buf = await readFile(abs)
  return `data:${mimeOf(abs)};base64,${buf.toString('base64')}`
}

/** 生成一个 <figure class="figure-image"> 图片块 */
function figureHtml(src, alt) {
  const a = (alt || '').replace(/"/g, '&quot;')
  return `<figure class="figure-image"><img src="${src}" alt="${a}"></figure>`
}

/**
 * 把配图插入到正文中。
 * 清单键为锚点文字：该锚点所在段落之前插入图片。锚点匹配不到时插到文末并告警。
 */
async function injectImages(bodyHtml) {
  if (!args.images) return bodyHtml
  const manifest = JSON.parse(await readFile(path.resolve(args.images), 'utf8'))
  let out = bodyHtml
  const warnings = []
  for (const [anchor, spec] of Object.entries(manifest)) {
    const file = typeof spec === 'string' ? spec : spec.file
    const alt = typeof spec === 'string' ? '' : (spec.alt || '')
    const abs = path.resolve(imageDir, file)
    try { await stat(abs) } catch { warnings.push(`配图缺失: ${file}`); continue }
    const src = await toDataUri(abs, path.relative(imageDir, abs))
    const fig = figureHtml(src, alt)
    if (anchor === '__head__') { out = fig + out; continue }
    const idx = out.indexOf(anchor)
    if (idx === -1) { warnings.push(`锚点未命中，图片已置文末: ${anchor}`); out += fig; continue }
    // 定位到该锚点所在 <p> 块的开头
    const pStart = out.lastIndexOf('<p', idx)
    const insertAt = pStart === -1 ? idx : pStart
    out = out.slice(0, insertAt) + fig + out.slice(insertAt)
  }
  if (warnings.length) console.warn('⚠ ' + warnings.join('\n⚠ '))
  return out
}

/**
 * 把稿件里的 Markdown 图片也内联成 base64。
 * 不处理这一步，`![](配图.jpg)` 会留下相对路径——粘进公众号编辑器就是坏图。
 * 只处理相对路径；data: 与 http(s) 原样保留。
 */
async function inlineMarkdownImages(bodyHtml) {
  if (args['no-inline-images']) return bodyHtml
  const srcs = [...bodyHtml.matchAll(/<img\b[^>]*?\ssrc="([^"]+)"/g)].map(m => m[1])
  const rels = [...new Set(srcs)].filter(s => !/^(data:|https?:)/i.test(s))
  const warnings = []
  let out = bodyHtml
  for (const src of rels) {
    const rel = decodeURIComponent(src)
    const abs = path.resolve(imageDir, rel)
    try { await stat(abs) } catch { warnings.push(`稿件图片找不到，保留原路径: ${rel}`); continue }
    const uri = await toDataUri(abs, rel)
    out = out.split(`src="${src}"`).join(`src="${uri}"`)
  }
  if (warnings.length) console.warn('⚠ ' + warnings.join('\n⚠ '))
  return out
}

let body = await inlineMarkdownImages(await injectImages(html))

// ---------- 各号头尾块 ----------
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

/** 主号头：蓝顶栏 + 栏目名 + 期号 */
function mainMasthead() {
  const bar = '<section style="background:#3B5BA5;height:6px;line-height:0;font-size:0;">&nbsp;</section>'
  const line = `<section style="padding:10px 2px 8px 2px;border-bottom:1px solid #EAEAEA;overflow:hidden;">`
    + (meta.期号 ? `<span style="float:right;font-size:12px;color:#999;padding-top:2px;">${esc(meta.期号)}</span>` : '')
    + `<span style="font-size:15px;font-weight:bold;color:#3B5BA5;letter-spacing:1px;">${esc(meta.栏目名 || '知识更新')}</span></section>`
  return `<section style="margin:0 0 20px 0;">${bar}${line}</section>`
}

/** 中继协尾：机构简介 + 口号 + 供稿/编辑 */
function deepFooter() {
  const org = meta.机构简介 || '中国继续工程教育协会人工智能分会（China Association for AI in Continuing Education）成立于2026年7月29日，是中国继续工程教育协会的分支机构，由上海继续工程教育协会牵头筹建并承担运营支撑工作。分会以服务国家战略、推动人工智能与继续教育深度融合为使命，致力于成为AI赋能继续教育的标准制定者、平台提供者、生态构建者，助力专业技术人才从“AI旁观者”成长为“AI驾驭者”。'
  const slogan = meta.口号 || '从AI旁观者，到AI驾驭者。'
  const credit = meta.供稿编辑 || '供稿：中国继续工程教育协会人工智能分会<br>编辑：上海继续工程教育协会综合管理部'
  return `<hr style="box-sizing: border-box; margin: 36px 0; border: none; height: 1px; background-color: #e1e4e8;">`
    + `<p style="box-sizing: border-box; overflow-wrap: break-word; margin: 20px 0; line-height: 1.8; color: #1a1a1a; text-align: left; margin-bottom: 20px;">${esc(org)}</p>`
    + `<section style="margin:34px 0 0 0;">`
    + `<p style="margin:0;font-size:13px;color:#8a8a8a;line-height:1.6;text-align:center;">${esc(slogan)}</p>`
    + `<section style="border-top:1px dashed #d9d9d9;margin:16px 0 0 0;padding-top:12px;">`
    + `<p style="margin:0;font-size:12px;color:#8a8a8a;line-height:1.9;text-align:center;">${credit}</p>`
    + `</section></section>`
}

/** 夜校尾栏：账号 + 期号 */
function nightFooter() {
  const issue = meta.期号 || ''
  return `<section style="margin:32px 0 0 0;">`
    + `<p style="margin:0;font-size:12px;color:#8a8a8a;line-height:1.6;text-align:center;">上海AI夜校 · AI应用周刊｜${esc(issue)}</p>`
    + `</section>`
}

// 组装 wrapper
let wrapper = `<section id="${preset.wrapper}">`
if (args.preset === 'main-account') {
  wrapper += mainMasthead()
} else {
  wrapper += `<section id="${preset.wrapper}-body">`
}
wrapper += body
if (args.preset === 'main-account') {
  wrapper += `</section>`
} else {
  if (args.preset === 'ai-night-school') wrapper += nightFooter()
  if (args.preset === 'deep-reading') wrapper += deepFooter()
  wrapper += `</section></section>`
}

// ---------- 样式内联 ----------
const css = (preset.reset ? await readFile(path.join(root, preset.reset), 'utf8') + '\n' : '') + await readFile(path.join(root, preset.style), 'utf8')
const inline = juice.inlineContent(wrapper, css + `\n#${preset.wrapper} { padding:0; }`, { inlinePseudoElements: true, preserveImportant: true })

// 主号外层画布：真实成稿用 div 包裹，非 section
const canvas = args.preset === 'main-account'
  ? `<div style="max-width:677px;margin:0 auto;background:#FFFFFF;padding:24px 16px 32px;font-family:-apple-system,BlinkMacSystemFont,'Helvetica Neue','PingFang SC','Hiragino Sans GB','Microsoft YaHei',sans-serif;">`
  : ''
const canvasEnd = args.preset === 'main-account' ? `</div>` : ''

const full = `<!doctype html><html lang="zh-CN"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${preset.account}｜排版稿</title></head><body>${canvas}${inline}${canvasEnd}</body></html>`
await mkdir(path.dirname(path.resolve(args.output)), { recursive: true })
await writeFile(path.resolve(args.output), full, 'utf8')
console.log(`已生成 ${path.resolve(args.output)}（${preset.account}，${full.length} 字符）`)
