# wechat-account-layouts

把一篇已核对的 Markdown 稿件，排成上海继续工程教育协会三个公众号**认得的成稿版式**，输出可直接粘进微信编辑器的内联 HTML；交稿前跑一遍排版体检。

它不是通用排版工具，只管三个号的固定版式。**样式正确不等于内容审核通过**——事实、称谓、政治表述由供稿人和审核人负责。

## 三个版式

| 目标号 | `--preset` | 视觉特征 | 固定块 |
|---|---|---|---|
| 上海继续工程教育协会主号 | `main-account` | 677px 版心，`#3B5BA5` 蓝顶栏，小节标题蓝色左边线 | 头：蓝顶栏 + 栏目名 + 期号；尾：责编/编委会署名 |
| 上海 AI 夜校 | `ai-night-school` | `#024CC6` 签名蓝，15px 正文，圆角媒体，导语块 `#E6EDF9` 不透明淡蓝底 | 尾：`上海AI夜校 · AI应用周刊｜{期号}`（期号 `YYYYWWNN`） |
| 中继协人工智能分会号 | `deep-reading` | 中性灰黑，680px，17px 正文 | 头：可选「导 语」小标；尾：机构简介 + 口号 + 供稿/编辑 |

**不从文章关键词推断账号。** 未指定目标号时先问。

## 安装

需要 Node.js ≥ 18（`npm install` 会拉 130 个包，建议 Node ≥ 20.19）。

```bash
cd wechat-account-layouts
npm install
```

`npm install` 之后本目录自带依赖，不再依赖任何外部项目。若本机已有装过这些包的项目，也可以用 `--markflow /path/to/that/project` 或环境变量 `MARKFLOW_DIR` 指过去，跳过安装。

依赖解析顺序：`--markflow` → `MARKFLOW_DIR` → 本 Skill 的 `node_modules` → 本机默认路径。找不到会明确报错并列出尝试过的路径。

## 用法

```bash
# 1) 渲染
node scripts/render.mjs \
  --preset ai-night-school \
  --input 稿件.md \
  --output 预览-v1.html \
  --meta 期号=2026W44

# 2) 带配图清单渲染（图片按锚点插入并内联为 base64）
node scripts/render.mjs --preset deep-reading \
  --input 稿件.md --output 预览-v1.html \
  --images images.json --image-dir . \
  --meta 期号=2026W44

# 3) 排版体检
node scripts/check-layout.mjs --preset ai-night-school --html 预览-v1.html --images images.json
```

体检全部通过才会输出「可交付」。它只查机器能判定的项：版式容器、样式是否真内联、配图数量与清单是否一致、各号尾块固定块、导语块底色与左签、占位符残留、H1 数量等。

**机器查不了的仍要人看**：首屏观感、390px 手机宽度可读性、无横向溢出、图片位置与正文逻辑是否对应。公众号后台粘贴后还要实测图片是否仍在。

## 配图清单

稿件 `.md` 往往没有图片语法——图片在成稿阶段才插入。只吃 Markdown 的渲染器会丢掉全部配图，所以配图走独立清单：

```json
{
  "__head__": { "file": "配图/01_首图.jpg", "alt": "现场" },
  "看清了职业，再看教育": { "file": "配图/02_第二节.jpg", "alt": "知识、能力、人格" }
}
```

键是**插入点前一段的起首文字**，`__head__` 表示插在全文最前。锚点未命中时图片落到文末并打印告警——每次渲染后都要看告警，确认是锚点写错还是稿件缺那一段。

稿件里的配图占位符统一写 `【配图：说明（来源）】`，渲染前按占位符生成清单，渲染后删除占位符。

## 目录

```
SKILL.md                  技能说明（选版、流程、配图注入、归档规则）
CLAUDE.md                 给本仓库 Agent 的导航
README.md                 本文件
package.json              依赖声明
refs/presets.json         三个版式的入口：样式文件、容器 id、来源
refs/account-specs.json   版式规格基线（每条从真实成稿反推）
assets/                   三套 CSS（含 deep-reading 的第三方许可声明）
scripts/render.mjs        Markdown → 内联 HTML
scripts/check-layout.mjs  排版体检
previews/                 三个版式的示例成品
```

## 改版式先改规格

`refs/account-specs.json` 是这个 Skill 唯一的口味来源。每条规格都从真实成稿反推，`verified_against` 里记着对应哪几篇。

改样式的顺序固定：**先看真成稿 → 改 `assets/` 的 CSS → 回写 `account-specs.json` → 若新增可机械判定的约束，同步加到 `check-layout.mjs`**。只改 CSS 不改规格，下一个人就不知道当时的决定，样式会慢慢漂回去。

## 来源与许可

- 主号版式从多篇已成稿反推，不把原文和内嵌图片纳入本 Skill。
- AI 夜校、中继协版式源自 MarkFlow 主题，本 Skill 副本已与上游分叉，适配不回写上游。
- `deepread.css` 继承 huasheng_editor 的 MIT 条款，完整声明见 `assets/deep-reading/THIRD_PARTY_NOTICES.md`。
- 本 Skill 不接触公众号后台：不获取登录态、不建草稿、不发布。成品交人复制粘贴。
