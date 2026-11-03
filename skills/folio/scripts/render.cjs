#!/usr/bin/env node
/**
 * [INPUT]: 本地 HTML、固定或自动高度画布与 Playwright。
 * [OUTPUT]: 每个 .folio-page 对应的 PNG；失败返回非零状态。
 * [POS]: Folio 通用导出器，不决定内容与视觉风格。
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */
const fs = require('node:fs');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
let chromium;
try { ({ chromium } = require('playwright')); }
catch { ({ chromium } = require('playwright-core')); }

const check = root => {
  const box = root.getBoundingClientRect();
  const errors = [];
  for (const el of root.querySelectorAll('*')) {
    if (el.closest('[data-decoration]')) continue;
    const r = el.getBoundingClientRect();
    if (!r.width || !r.height) continue;
    if (r.left < box.left - 1 || r.top < box.top - 1 ||
        r.right > box.right + 1 || r.bottom > box.bottom + 1)
      errors.push('内容超出画布: ' + el.tagName + ' ' + el.textContent.slice(0, 30));
    const style = getComputedStyle(el);
    if ((style.overflowX !== 'visible' && el.scrollWidth > el.clientWidth + 1) ||
        (style.overflowY !== 'visible' && el.scrollHeight > el.clientHeight + 1))
      errors.push('内容超出容器: ' + el.tagName);
    for (const node of el.childNodes) {
      if (node.nodeType !== Node.TEXT_NODE || !node.textContent.trim()) continue;
      const range = document.createRange();
      range.selectNodeContents(node);
      for (const rect of range.getClientRects())
        if (rect.left < box.left - 1 || rect.right > box.right + 1 ||
            rect.top < box.top - 1 || rect.bottom > box.bottom + 1)
          errors.push('文字超出画布: ' + node.textContent.slice(0, 30));
    }
  }
  for (const img of root.querySelectorAll('img'))
    if (!img.complete || !img.naturalWidth) errors.push('图片加载失败: ' + img.getAttribute('src'));
  return errors;
};

async function main() {
  const argv = process.argv.slice(2);
  const source = argv.shift();
  const options = { scale: 1 };
  while (argv.length) {
    const key = argv.shift();
    if (!['--out', '--browser', '--scale'].includes(key) || !argv.length)
      throw Error('用法: node render.cjs <HTML> --out <目录> [--browser <浏览器>] [--scale 1|2|3]');
    options[key.slice(2)] = argv.shift();
  }
  if (!source || !options.out) throw Error('必须指定 HTML 与 --out');
  const scale = Number(options.scale);
  if (![1, 2, 3].includes(scale)) throw Error('--scale 只能为 1、2 或 3');
  if (!fs.existsSync(source)) throw Error('HTML 不存在: ' + source);
  const browser = await chromium.launch(options.browser ? { executablePath: options.browser } : {});
  try {
    const page = await browser.newPage({ deviceScaleFactor: scale });
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.goto(pathToFileURL(path.resolve(source)).href, { waitUntil: 'load' });
    await page.evaluate(async () => {
      await document.fonts.ready;
      await Promise.all([...document.images].map(img => img.decode().catch(() => {})));
    });
    const frames = page.locator('.folio-page');
    const count = await frames.count();
    if (!count) throw Error('HTML 中没有 .folio-page');
    const sizes = [];
    // ---------- 全部检查通过后再写入成图 ----------
    for (let i = 0; i < count; i++) {
      const frame = frames.nth(i);
      const width = Number(await frame.getAttribute('data-width'));
      const declaredHeight = await frame.getAttribute('data-height');
      if (!Number.isInteger(width) || width <= 0 || width > 16384)
        throw Error('第 ' + (i + 1) + ' 页宽度无效');
      await page.setViewportSize({ width, height: 900 });
      const height = declaredHeight === 'auto'
        ? Math.ceil(await frame.evaluate(el => el.getBoundingClientRect().height))
        : Number(declaredHeight);
      if (![width, height].every(n => Number.isInteger(n) && n > 0 && n <= 16384))
        throw Error('第 ' + (i + 1) + ' 页尺寸无效');
      sizes.push({ width, height });
      await page.setViewportSize({ width, height });
      const box = await frame.boundingBox();
      if (!box || Math.abs(box.width - width) > 1 || Math.abs(box.height - height) > 1)
        errors.push('第 ' + (i + 1) + ' 页 CSS 尺寸与声明不符');
      errors.push(...(await frame.evaluate(check)).map(e => '第 ' + (i + 1) + ' 页: ' + e));
    }
    if (errors.length) throw Error(errors.join('\n'));
    fs.mkdirSync(options.out, { recursive: true });
    for (let i = 0; i < count; i++) {
      await page.setViewportSize(sizes[i]);
      const target = path.join(options.out, String(i + 1).padStart(2, '0') + '.png');
      await frames.nth(i).screenshot({ path: target, animations: 'disabled' });
      console.log('已导出: ' + target);
    }
  } finally { await browser.close(); }
}
main().catch(e => { console.error('导出失败: ' + e.message); process.exitCode = 1; });
