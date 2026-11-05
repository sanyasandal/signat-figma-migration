import { chromium } from 'playwright';
const [reskin, eds] = process.argv.slice(2);
const b = await chromium.launch();
async function m(u, w, isEds) {
  const p = await b.newPage({ viewport: { width: w, height: 800 } });
  await p.goto(u, { waitUntil: 'load' });
  if (isEds) await p.waitForFunction(() => [...document.querySelectorAll('main > .section')].every((s) => s.dataset.sectionStatus === 'loaded') && document.querySelector('footer .footer[data-block-status="loaded"]'), null, { timeout: 60000 });
  await p.evaluate(() => document.querySelectorAll('main img').forEach((i) => { i.loading = 'eager'; }));
  await p.waitForFunction(() => [...document.querySelectorAll('main img')].every((i) => i.complete), null, { timeout: 60000 }).catch(() => {});
  await p.waitForTimeout(800);
  const r = await p.evaluate((e) => ({ t: document.documentElement.scrollHeight, s: [...document.querySelectorAll(e ? 'main > .section' : 'main > section')].filter((x) => x.getBoundingClientRect().height > 0).map((x) => Math.round(x.getBoundingClientRect().height)) }), isEds);
  await p.close(); return r;
}
for (const w of [1440, 360]) {
  const a = await m(reskin, w, false); const e = await m(eds, w, true);
  const worst = a.s.map((h, i) => Math.abs((e.s[i] ?? 0) - h) / h * 100);
  console.log(`${w}: total ${a.t}/${e.t} (${((e.t - a.t) / a.t * 100).toFixed(1)}%) worst section Δ ${Math.max(...worst).toFixed(1)}% @s${String(worst.indexOf(Math.max(...worst)) + 1).padStart(2, '0')} | reskin ${a.s.join(',')} | eds ${e.s.join(',')}`);
}
await b.close();
