---
name: folio
description: 将已有文章、图片和笔记自动排版为 HTML/CSS 并导出 PNG，适用于周刊封面、图文卡片和简报。Arrange existing text and images into styled HTML and export PNG covers and editorial cards.
version: 0.2
---

<!--
[INPUT]: 用户图文、refs/presets.json 与预设资源。
[OUTPUT]: 可编辑 HTML/CSS，以及逐页 PNG。
[POS]: Folio 内容排版入口；脚本负责验证与截图。
[PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
-->

# Folio

把已有内容排成图片。自动选择合适预设。
内置蓝色周刊样式，支持竖版卡片、方图与长图。

## 选择与排版

1. 读取用户内容和 refs/presets.json。
2. 用户指定样式时采用指定样式。否则按用途选择。
3. 按画幅读取选中预设的 HTML/CSS。
4. 将母版与同目录 CSS 复制到本次输出目录，再替换内容。
5. 导出 PNG 并查看成图，修正可见问题。
6. 交付图片、HTML 和 CSS，注明采用的预设。

在项目内执行时，将成品写入 `outputs/<任务名>/`。
用户指定输出目录时，使用指定目录。
`assets/` 保存母版，`previews/` 保存可复用样图。

默认直接完成。关键素材或事实缺失时询问用户。
不虚构机构、期号、日期或数据。
母版文案仅用于演示，正式任务必须替换。
用户要求样图时，可使用母版原文案。

## 内容边界

- 转成图片默认保留原意，不自动摘要或改写事实。
- 用户明确要求摘要卡片时，再提炼内容。
- 输入图片默认作为素材，不自动重建为 HTML。
- 用户要求复现参考图时，才重建其视觉结构。
- 文字放不下时调整版式或分页，不裁切正文。
- 整组使用统一样式，每页按用途选择版式。
- 当前预设不匹配用途时，说明限制并按用户要求扩展。

## 画幅选择

| 画幅 | 尺寸 | 适用内容 | 母版 |
|---|---|---|---|
| 竖版卡片 card | 1080×1440 | 封面、单页卡片、分页图文 | `assets/weekly-blue/card.html` |
| 方图 square | 1080×1080 | 方形封面、短内容 | `assets/weekly-blue/square.html` |
| 长图 long | 宽 1080，高度随内容增长 | 完整文章、连续图文 | `assets/weekly-blue/long.html` |

未指定画幅时默认竖版卡片。完整长文优先长图。
用户要求三种尺寸时，分别排版并导出三份成图。
长图母版最小高度 2400，正文使用正常文档流。
原始 `assets/weekly-blue/reference.html` 仅保留作横版参考。

## 蓝色周刊样式

各画幅共用 `assets/weekly-blue/style.css`。
`previews/` 保存预览，路径由预设索引指定。
保留蓝底、白色大标题、标签、淡字和圆弧。
用本地中文字体，避免截图依赖远程字体。
竖版和方图重排标题、标签与期号，不拉伸横版。
标题加长时，调整断行与字号，检查下方期号位置。
长图头部承载封面，正文按章节向下延伸。
长图演示正文仅展示版式，正式任务全部替换。

## 导出

运行环境：Node.js + Playwright + Chromium。
在独立工具目录运行 `npm install playwright`，再运行
`npx playwright install chromium`。导出器需能解析该依赖；
独立安装时用 `NODE_PATH=<工具目录>/node_modules` 指向依赖。
已有 Chrome 时可通过 `--browser` 指定可执行文件。

```bash
node <skill目录>/scripts/render.cjs <输出目录>/index.html --out <输出目录>/images
```

HTML 中每个 `.folio-page` 是一张图片。
`data-width` 与 `data-height` 指定 CSS 像素尺寸。
长图设 `data-height="auto"`，CSS 设 `height: auto`。
导出器按实际内容测量高度，单张高度上限 16384。
超过上限时拆分长图，不缩小全文至难以阅读。
默认导出同尺寸 PNG；`--scale 2` 导出两倍像素。
装饰元素必须标记 `data-decoration`，允许出血。
正文不允许溢出；图片必须加载成功。
脚本失败时修复原因再导出，不能宣称成图已通过。
