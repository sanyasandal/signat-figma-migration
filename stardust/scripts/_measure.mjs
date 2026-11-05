import { chromium } from 'playwright';
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';
const [file, w='1440'] = process.argv.slice(2);
const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: +w, height: 900 } });
await p.goto(/^https?:/.test(file) ? file : pathToFileURL(resolve(file)).href); await p.waitForTimeout(800);
console.log(await p.evaluate(() => {
  const r = (e) => { const b = e.getBoundingClientRect(); return `${Math.round(b.x)},${Math.round(b.y)} ${Math.round(b.width)}x${Math.round(b.height)}`; };
  const out = [];
  const h = document.querySelector('header'); out.push('header ' + r(h) + ' util ' + r(h.querySelector('.utility-bar')) + ' row ' + r(h.querySelector('.chrome-row')));
  document.querySelectorAll('main > section').forEach((s) => {
    const cs = getComputedStyle(s); const pn = s.querySelector('.panel'); const pcs = pn && getComputedStyle(pn);
    out.push(`${s.dataset.slot} ${r(s)} pad ${cs.paddingTop} bg ${cs.backgroundColor} | panel ${pn ? r(pn) + ' pad ' + pcs.padding + ' bg ' + pcs.backgroundColor : ''}`);
    s.querySelectorAll('h1,h2,h3,h4,.card,.btn,.link,.split-img,.band-img,.cards').forEach((e, i) => { if (i < 6) { const c = getComputedStyle(e); out.push(`   ${e.tagName}.${e.className} ${r(e)} fs ${c.fontSize}/${c.lineHeight} ls ${c.letterSpacing} col ${c.color} bg ${c.backgroundColor} pad ${c.padding}`); } });
  });
  const f = document.querySelector('footer'); out.push('footer ' + r(f) + ' pad ' + getComputedStyle(f).padding);
  return out.join('\n');
}));
await b.close();
