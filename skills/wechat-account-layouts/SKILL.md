---
name: wechat-account-layouts
description: 三个协会公众号的排版交付：主号使用主号成稿蓝色版式（蓝顶栏+栏目名+期号），AI 夜校使用 MarkFlow「AI 夜校」版式（尾栏含期号），中继协人工智能号使用 MarkFlow「深度阅读」版式（机构简介+口号+供稿编辑尾块）；配图按清单注入并内联，输出供人复制到公众号编辑器的内联 HTML。Style and render articles for the three association WeChat accounts using their verified layouts; deliver inline HTML with images embedded for human review and paste.
version: 0.4
---

<!--
[INPUT]: 已核对文稿与配图素材；主号来源 /Users/huazi/Downloads/主号排版/ 共 7 篇成稿，夜校与中继协来源 MarkFlow 的 ai-night-school.css/deepread.css；版式规格真源 refs/account-specs.json（每条规格都从真实成稿反推）。
[OUTPUT]: 排版 HTML（内联样式 + 图片 base64 内嵌）、配图清单 images.json、待核清单；确认归档后再沉淀入数字花园；由人送审、Huazi 本人发布。
[POS]: skills/wechat-account-layouts 唯一入口，负责三号版式选择与渲染；association-writing-guide 管稿件文风及事实核查，xiehui-content-reviewer 管发布前审校，folio 管图片卡片，不相互替代。
[PROTOCOL]: 变更时更新此头部，检查 refs/account-specs.json、refs/presets.json、素材版权/出处和本目录 CLAUDE.md，并运行仓库 scripts/validate.sh。
-->

# 三个公众号的排版交付

只处理经核对的稿件排版；小刘负责排期与供稿交接，协会小编负责文章加工与 HTML，事实与政务表达参考 `association-writing-guide`，发布前审校走 `xiehui-content-reviewer`。无法核实的政策、数字、身份、图片使用权要列入待核清单，**不能因版式完成就视为审核通过**。

## 选版

| 目标号 | 参数 | 视觉特征 | 头/尾固定块 |
|---|---|---|---|
| 上海继续工程教育协会主号 | `main-account` | 677px 版心，#3B5BA5 蓝色顶栏，小节标题蓝色左边线 | 头：蓝顶栏 + 栏目名 + 期号；尾：责编/编委会署名 |
| 上海 AI 夜校 | `ai-night-school` | #024CC6 签名蓝，15px 正文，圆角媒体 | 头：blockquote 导语块；尾：`上海AI夜校 · AI应用周刊｜{期号}` |
| 中继协人工智能分会号 | `deep-reading` | 中性灰黑，680px，17px 正文 | 头：可选「导 语」小标；尾：机构简介 + 口号 + 供稿/编辑 |

**不从文章关键词推断账号**；未指定时先核目标号。样式选择不是内容审核——三号定位、事实、政治红线、人名/出处由供稿人和审核人确认。

各号详细规格以 `refs/account-specs.json` 为准，**成稿与规格表冲突时以成稿为准并回写规格表**。

## 执行流程

1. **核目标号**，取已核对的 Markdown 稿件与配图文件（图片路径、原图授权状态）。
2. **写配图清单** `images.json`，把配图插到正确位置（见下）。
3. **选预设渲染**，产出 `预览-v1.html`，用浏览器核对首屏与手机宽度。
4. **写待核清单**，列出未核实事项与图片使用限制。
5. **交付**：私聊华子发能直接打开的预览文件，说明目标号、版本、待核事项与图片上传顺序。
6. **归档**：确认后把成品放花园对应目录——主号 `渠道矩阵/主号/公众号内容/`，夜校 `AI夜校/公众号内容/`，中继协 `渠道矩阵/中继协号/公众号内容/`；**不得把未审预览自动写进花园**。

过程稿写在负责伙伴自己的 Cindy `workspace/`，按 `日期-文章短标题/` 建文件夹，保存供稿副本、编辑稿、配图、待核清单及 `预览-v1.html`、`预览-v2.html`，不覆盖旧版。Skill 仓库的 `outputs/` 仅作示例测试。

## 配图注入（本 Skill 的关键能力）

**为什么需要**：稿件 `.md` 往往不含 Markdown 图片语法——图片在成稿阶段才插入。只吃 Markdown 的渲染器会**丢掉全部配图**（实测 img=0）。

**做法**：渲染时带 `--images 清单.json`，清单是「锚点文字 → 图片」的映射：

```json
{
  "__head__": { "file": "配图/01_导语_现场照.jpg", "alt": "主旨报告现场" },
  "看清了职业，再看教育": { "file": "配图/02_第二节_知识能力人格.jpg", "alt": "知识、能力、人格" }
}
```

- 锚点文字 = 该图要插入位置**前一段**的起首文字；渲染器在该段之前插入 `<figure class="figure-image">`。
- `__head__` = 插在全文最前（首图）。
- 锚点未命中时图片置文末并打印告警——**每次渲染后检查告警**，确认是锚点写错还是稿件没写那段的标题。
- 图片默认转 base64 内嵌，微信编辑器可直接显示；`--no-inline-images` 保留相对路径，供人上传公众号素材库后替换。

**稿件里的配图占位符**统一写作 `【配图：说明（来源）】`，渲染前按占位符位置生成清单，渲染后删除占位符。占位符里的来源信息是待核清单的输入，不要在成稿里留占位符。

## 渲染命令

```bash
node skills/wechat-account-layouts/scripts/render.mjs \
  --preset deep-reading \
  --input 稿件.md \
  --output 预览-v1.html \
  --images images.json \
  --image-dir . \
  --meta 期号=2026W44 \
  --meta 栏目名=知识更新
```

| 参数 | 说明 |
|---|---|
| `--preset` | `main-account` / `ai-night-school` / `deep-reading` |
| `--input` | 稿件 Markdown（frontmatter 会被剥离） |
| `--output` | 产出 HTML 路径 |
| `--images` | 配图清单 JSON（见上） |
| `--image-dir` | 配图根目录，默认与 `--input` 同目录 |
| `--meta k=v` | 各号头尾信息，可重复：主号用 `栏目名`/`期号`；夜校用 `期号`；中继协可用 `机构简介`/`口号`/`供稿编辑` |
| `--no-inline-images` | 不转 base64，保留相对路径 |
| `--markflow` | MarkFlow 依赖位置，默认 `/Users/huazi/Code/Developer/MarkFlow`，可用 `MARKFLOW_DIR` 环境变量 |

渲染器只覆盖常用 GFM、表格、图片、引用，不声称复刻 MarkFlow 对数学、图表、本地 `img://` 的完整工作流。复杂稿件直接在 MarkFlow 界面选对应主题并使用「复制到微信」。

## 交付前检查

- [ ] 目标号与预设一致，栏目名/期号不为空
- [ ] 配图数量与稿件一致，`naturalWidth` 均非 0（无 broken 图）
- [ ] 图片顺序与正文逻辑对应，没有锚点告警未处理
- [ ] 尾块完整：中继协有机构简介+口号+供稿编辑；夜校有账号+期号；主号有责编/编委会
- [ ] 无未替换占位符 `【配图：…】`、无内网图片链接
- [ ] 首屏与 390px 手机宽度可读，无横向溢出
- [ ] 待核清单已写，图片授权状态已注明

**公众号后台粘贴后需实测图片是否仍存在**——大图 `data:` 有被编辑器处理的可能，这是已知风险项。

## 来源与许可

- 主号参考 `/Users/huazi/Downloads/主号排版/`：多篇已成稿仅用于提炼版式，不把原文和内嵌图片纳入 Skill。
- 夜校来源 `MarkFlow/src/themes/markdown-style/ai-night-school.css`，中继协来源 `MarkFlow/src/themes/markdown-style/deepread.css`，重置样式同源；适配修改不回写 MarkFlow。
- `deepread.css` 继承 huasheng_editor 的 MIT 条款，完整声明保存在 `assets/deep-reading/THIRD_PARTY_NOTICES.md`。
