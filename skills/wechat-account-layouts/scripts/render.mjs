#!/usr/bin/env node
// 从本 Skill 自带三套样式渲染公众号 HTML；依赖现有 MarkFlow 项目的 Markdown 运行库，不改其源码。
import { createRequire } from 'node:module'
import { readFile, mkdir, writeFile } from 'node:fs/promises'
import { fileURLToPath, pathToFileURL } from 'node:url'
import path from 'node:path'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const usage = '用法: node scripts/render.mjs --preset main-account|ai-night-school|deep-reading --input 稿件.md --output 成品.html [--markflow /path/to/MarkFlow]'
const args = {}
for (let i = 2; i < process.argv.length; i += 2) {
  if (!process.argv[i]?.startsWith('--') || !process.argv[i + 1]) throw new Error(usage)
  args[process.argv[i].slice(2)] = process.argv[i + 1]
}
if (!args.preset || !args.input || !args.output) throw new Error(usage)
const presets = JSON.parse(await readFile(path.join(root, 'refs/presets.json'), 'utf8'))
const preset = presets[args.preset]
if (!preset) throw new Error(`未知版式: ${args.preset}\n${usage}`)
const markflow = path.resolve(args.markflow || process.env.MARKFLOW_DIR || '/Users/huazi/Code/Developer/MarkFlow')
const requireFromMarkflow = createRequire(path.join(markflow, 'package.json'))
const load = async name => import(pathToFileURL(requireFromMarkflow.resolve(name)).href)
const [{ unified }, { default: remarkParse }, { default: remarkGfm }, { default: remarkRehype }, { default: rehypeStringify }, { default: rehypeSanitize }, juiceModule] = await Promise.all([
  load('unified'), load('remark-parse'), load('remark-gfm'), load('remark-rehype'), load('rehype-stringify'), load('rehype-sanitize'), load('juice'),
])
const juice = juiceModule.default
const markdown = await readFile(path.resolve(args.input), 'utf8')
const input = markdown.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, '')
const html = String(await unified().use(remarkParse).use(remarkGfm).use(remarkRehype).use(rehypeSanitize).use(rehypeStringify).process(input))
const css = (preset.reset ? await readFile(path.join(root, preset.reset), 'utf8') + '\n' : '') + await readFile(path.join(root, preset.style), 'utf8')
const wrapper = `<section id="${preset.wrapper}">${args.preset === 'main-account' ? '<section class="masthead"><section class="masthead-bar">&nbsp;</section><section class="masthead-space">&nbsp;</section></section>' : ''}${html}</section>`
// 微信编辑器有自身页边距；与 MarkFlow 的微信渲染口径一致，所有样式直接内联到元素。
const inline = juice.inlineContent(wrapper, css + `\n#${preset.wrapper} { padding:0; }`, { inlinePseudoElements: true, preserveImportant: true })
const full = `<!doctype html><html lang="zh-CN"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${preset.account}｜排版稿</title></head><body>${inline}</body></html>`
await mkdir(path.dirname(path.resolve(args.output)), { recursive: true })
await writeFile(path.resolve(args.output), full, 'utf8')
console.log(`已生成 ${path.resolve(args.output)}（${preset.account}，${full.length} 字符）`)
