import { chromium } from 'playwright';
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';
const [file, w='1440', sel='main img, main .disclosure, main ul, main blockquote, main .actions, footer *'] = process.argv.slice(2);
const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: +w, height: 900 } });
await p.goto(/^https?:/.test(file) ? file : pathToFileURL(resolve(file)).href); await p.waitForTimeout(800);
console.log(await p.evaluate((sel) => [...document.querySelectorAll(sel)].slice(0,60).map((e) => { const b = e.getBoundingClientRect(); const c = getComputedStyle(e); return `${e.closest('[data-slot]')?.dataset.slot||'-'} ${e.tagName}.${(e.className||'').toString().slice(0,30)} ${Math.round(b.x)},${Math.round(b.y)} ${Math.round(b.width)}x${Math.round(b.height)} fs ${c.fontSize}/${c.lineHeight} m ${c.margin} p ${c.padding}`; }).join('\n'), sel));
await b.close();
