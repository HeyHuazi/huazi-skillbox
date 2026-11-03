---
name: wechat-account-layouts
description: 三个协会公众号的排版交付：主号使用主号成稿蓝色版式，AI 夜校使用 MarkFlow「AI 夜校」，中继协人工智能号使用 MarkFlow「深度阅读」；输出供人复制到公众号编辑器的内联 HTML。Style and render articles for the three association WeChat accounts using their verified layouts; deliver inline HTML for human review and paste.
version: 0.3
---

<!--
[INPUT]: 已核对文稿与配图素材；主号来源 /Users/huazi/Downloads/主号排版；夜校和中继协来源 MarkFlow 的 ai-night-school.css/deepread.css。
[OUTPUT]: 伙伴工作目录内的稿件/HTML 预览、配图说明与待核清单；确认归档后再沉淀入数字花园；由人送审、Huazi 本人发布。
[POS]: skills/wechat-account-layouts 唯一入口，负责三号版式选择与渲染；association-writing-guide 管稿件文风及事实核查，folio 管图片卡片，不相互替代。
[PROTOCOL]: 修改时检查 refs/presets.json、素材版权/出处和本目录 CLAUDE.md，并运行仓库 scripts/validate.sh。
-->

# 三个公众号的排版交付

只处理经核对的稿件排版；小刘负责排期与供稿交接，协会小编负责文章加工与 HTML，事实与政务表达参考 `association-writing-guide`。无法核实的政策、数字、身份、图片使用权要列入待核清单，不能因版式完成就视为审核通过。

## 选版

| 目标号 | 参数 | 依据 | 视觉特征 |
|---|---|---|---|
| 上海继续工程教育协会主号 | `main-account` | `refs/presets.json` + `assets/main-account/style.css`；从主号多篇成稿中抽取 | 蓝色顶栏与小节左边线、正文克制、公众号原成稿共性 |
| 上海 AI 夜校 | `ai-night-school` | MarkFlow 原主题复制 `assets/ai-night-school/` | #024CC6 签名蓝、较轻快的标题和图片 |
| 中继协人工智能分会号 | `deep-reading` | MarkFlow 原「深度阅读」主题复制 `assets/deep-reading/` | 中性灰黑、较长文章的阅读节奏 |

用户明确指定某号时按该号选，不从文章关键词推断账号；未指定时先核目标号。主号成稿中有蓝/绿等专题变体，当前预设取多篇共性的蓝色基础版；专题配色另行明确。**样式选择不是内容审核**：三号定位、事实、政治红线、人名/出处由供稿人和审核人确认。

## 执行流程

1. 获取目标号、**已核对的** Markdown 稿件、配图文件或明确的图片占位说明。**过程稿写在当前负责伙伴自己的 Cindy `workspace/`**：以目标号和 `日期-文章短标题/` 建文件夹，保存供稿副本、编辑稿、配图、待核清单及 `预览-v1.html`、`预览-v2.html`，不覆盖旧版。Skill 仓库的 `outputs/` 仅作示例测试，不当成华哥的正式归档。确认归档后再将最终成品放数字花园对应业务目录：主号 `渠道矩阵/主号/公众号内容/`，夜校 `AI夜校/公众号内容/`，中继协 `渠道矩阵/中继协号/公众号内容/`；**不得把未审预览自动写进花园**。不要从主号 HTML 原稿中复制正文或内嵌图片做新稿。
2. 选择预设：主号自带提取样式；夜校和中继协分别是 MarkFlow `ai-night-school`、`deepread` 原 CSS 的本地副本。更新版式时回到来源文件核对变更后再更新副本，不在 MarkFlow 项目里直接改主题。
3. 用 `scripts/render.mjs` 渲染 Markdown。它复用本机 MarkFlow 已安装的 Markdown 与 juice 依赖，将 CSS 内联。主题与 MarkFlow 的预览/复制样式同源；渲染器只覆盖常用 GFM、表格、图片、引用，不声称复刻 MarkFlow 对数学、图表、本地 `img://` 的完整工作流。复杂稿件直接在 MarkFlow 界面选对应主题并使用“复制到微信”。
4. 检查成品 HTML：标题/正文/列表/表格/配图位置都在，首屏与手机宽度可读；检查没有未替换占位、内网图片链接或缺失图。**协会小编在与 Huazi 的私聊里发送能直接打开的预览**，同时说明目标号、当前版本、待核事项和图片上传顺序；群里同步版本/审核状态即可。只发 Mac 本地路径不算交付，须确认 Huazi 在 Cindy 手机端实际能打开、配图能加载。图片尽量用真实可访问的链接；本地图片由人上传到公众号编辑器后替换。大图 `data:` 可用于本地预览，但**公众号后台粘贴后需实测图片是否仍存在**。
5. 由人复制到公众号后台草稿、查看实际效果并送内部审核。**Skill、伙伴不得登录/操作公众号后台，AI 不做最终发布；发布权限只在 Huazi 手里。**

```bash
node skills/wechat-account-layouts/scripts/render.mjs \
  --preset ai-night-school \
  --input "$HOME/Library/Application Support/Cindy/owners/<owner-id>/bots/<当前伙伴-id>/workspace/ai-night-school/20261102-示例文章/稿件.md" \
  --output "$HOME/Library/Application Support/Cindy/owners/<owner-id>/bots/<当前伙伴-id>/workspace/ai-night-school/20261102-示例文章/预览-v1.html"
```

参数可改为 `main-account` 或 `deep-reading`；默认使用 `/Users/huazi/Code/Developer/MarkFlow` 的现有依赖，搬到其他机器可传 `--markflow /path/to/MarkFlow` 或设 `MARKFLOW_DIR`。

## 来源与许可

- 主号参考 `/Users/huazi/Downloads/主号排版/`：多篇已成稿仅用于提炼版式，不把原文和内嵌图片纳入 Skill。
- 夜校来源 `MarkFlow/src/themes/markdown-style/ai-night-school.css`，中继协来源 `MarkFlow/src/themes/markdown-style/deepread.css`，重置样式同源；适配修改不回写 MarkFlow。
- `deepread.css` 继承 huasheng_editor 的 MIT 条款，完整声明保存在 `assets/deep-reading/THIRD_PARTY_NOTICES.md`。
