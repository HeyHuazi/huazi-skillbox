# 第三方版权声明

markflow 包含或改编了以下第三方项目的设计成果。除另有说明外，markflow 项目代码仍遵循仓库根目录的 AGPL-3.0-only 许可证。

## huasheng_editor

LatePost Depth、Financial Times、Anthropic、Hara Emptiness、Ando Concrete、WeChat Default、Tech、Elegant、Deep Read、New York Times、Jony Ive、Medium、Apple Minimal、Hische Editorial 与 Gaudi Organic Markdown 排版主题的设计语言，以及本地图片管线（`img://` 短链接 + IndexedDB 存储 + 预览 blob: 重写 + 复制时 Base64 内联的三时机分离设计，实现于 `src/lib/images/`）均改编自：

- 项目：https://github.com/alchaincyf/huasheng_editor
- 作者：花生（alchaincyf）
- 许可证：MIT License

```text
MIT License

Copyright (c) 2024 花生 (alchaincyf)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## huasheng_editor

来源：<https://github.com/alchaincyf/huasheng_editor>

本项目移植了 huasheng_editor（MIT License, Copyright (c) alchaincyf）的以下能力，并按 MarkFlow 架构重构：

- 飞书复制内容修复规则（`src/lib/markdown/feishu-fix.ts`）
- 多图网格布局与微信 Grid→Table 转换（`src/lib/markdown/render/plugins/rehype-image-grid.ts`、`src/lib/markdown/render/adapters/wechat.ts`）
- 源行号锚点与点击跳转（`src/lib/markdown/render/plugins/remark-source-line.ts`、`src/components/markdown/previewer/jump-to-source.ts`）

```
MIT License

Copyright (c) alchaincyf

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```
