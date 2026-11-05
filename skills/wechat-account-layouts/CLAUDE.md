# wechat-account-layouts — 三号公众号排版

> L2 | 父级：[../../CLAUDE.md](../../CLAUDE.md)

## 成员

- `SKILL.md`：三号选版规则、配图注入约定、渲染参数、交付前检查清单、权限边界。
- `refs/account-specs.json`：三号版式规格真源。每条规格从真实成稿反推（主号 7 篇成稿、夜校 W44 成稿、中继协吴志强成稿），含头尾固定块约定。
- `refs/presets.json`：三个预设的名字、来源、样式相对路径与文风说明。
- `assets/main-account/style.css`：从 `/Users/huazi/Downloads/主号排版/` 多篇成稿提取的共性蓝色版式；不存原文和图片。
- `assets/ai-night-school/{reset.css,ai-night-school.css}`：MarkFlow AI 夜校主题副本。
- `assets/deep-reading/{reset.css,deepread.css,THIRD_PARTY_NOTICES.md}`：MarkFlow 深度阅读主题副本及第三方许可。
- `previews/示例三版式对比/`：三个预设各一篇示例成稿（示例-*.html）与共用示例稿件、配图，供选版时对照预览。
- `scripts/render.mjs`：使用 MarkFlow 现有 Markdown 和 juice 依赖渲染内联 HTML。支持 `--images` 配图清单注入、`--image-dir`、`--meta` 各号头尾信息、`--no-inline-images`。
- `scripts/check-layout.mjs`：排版体检。查 15 项机械可判项（文档结构、wrapper、内联样式、图片 alt/来源/数量、尾块固定块、占位符与内部块残留、标题层级），全部通过才输出「可交付」。

## 约定

只在本 Skill 中保存可复用的版式与工具，不将任何稿件原文写入 assets。改 preset 时先核真实来源，再检查 CSS 选择器、许可和 README/根 L2 索引。示例测试可写 Skill 的 `outputs/<任务名>/`；真实稿件的编辑稿和 HTML 预览写在负责伙伴自己的 Cindy `workspace/`，协会小编私聊向 Huazi 交可打开文件。经确认归档后挑选成品沉淀至 HuaziDigitalGarden 协会项目对应号的 `公众号内容/`，不得把过程稿默认写进花园。公众号后台由人操作，Huazi 独占最终发布权限。

配图注入约定：稿件 `.md` 常不含 Markdown 图片语法，只吃 Markdown 的渲染会丢光配图。渲染前按 `【配图：说明（来源）】` 占位符生成 `images.json`（锚点文字 → 图片），用 `--images` 注入，锚点未命中会告警并置文末——每次渲染后检查告警。

与本机 `@hectoryuan/wechat-publisher-mcp`（`~/Code/Developer/wechat-publisher-mcp`）分工：该 MCP 提供 43 工具、17 套通用主题与建草稿能力；本 Skill 专管三个号的固定成稿版式。其 `extract_template` 只提取粗粒度 token、闭环还原失败，不用于替代本 Skill 版式。

[PROTOCOL]: 变更时更新本页，再检查 `SKILL.md` 的来源与 `refs/account-specs.json`。
