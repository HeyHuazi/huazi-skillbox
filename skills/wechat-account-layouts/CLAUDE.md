# wechat-account-layouts — 三号公众号排版

> L2 | 父级：[../../CLAUDE.md](../../CLAUDE.md)

## 成员

- `SKILL.md`：三号选版规则、输入与交付流程、权限边界。
- `refs/presets.json`：三个预设的名字、来源、样式相对路径与文风说明。
- `assets/main-account/style.css`：从 `/Users/huazi/Downloads/主号排版/` 多篇成稿提取的共性蓝色版式；不存原文和图片。
- `assets/ai-night-school/{reset.css,ai-night-school.css}`：MarkFlow AI 夜校主题副本。
- `assets/deep-reading/{reset.css,deepread.css,THIRD_PARTY_NOTICES.md}`：MarkFlow 深度阅读主题副本及第三方许可。
- `previews/示例三版式对比/`：三个预设各一篇示例成稿（示例-*.html）与共用示例稿件、配图，供选版时对照预览。
- `scripts/render.mjs`：使用 MarkFlow 现有 Markdown 和 juice 依赖，输出内联 HTML。

## 约定

只在本 Skill 中保存可复用的版式与工具，不将任何稿件原文写入 assets。改 preset 时先核真实来源，再检查 CSS 选择器、许可和 README/根 L2 索引。示例测试可写 Skill 的 `outputs/<任务名>/`；真实稿件的编辑稿和 HTML 预览写在负责伙伴自己的 Cindy `workspace/`，协会小编私聊向 Huazi 交可打开文件。经确认归档后挑选成品沉淀至 HuaziDigitalGarden 协会项目对应号的 `公众号内容/`，不得把过程稿默认写进花园。公众号后台由人操作，Huazi 独占最终发布权限。

[PROTOCOL]: 变更时更新本页，再检查 `SKILL.md` 的来源与 `refs/presets.json`。
