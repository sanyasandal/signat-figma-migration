import { chromium } from 'playwright';
const B = 'https://reskin--signat-figma-migration--sanyasandal.aem.page';
const b = await chromium.launch();
for (const path of ['/reskin/home', '/reskin/learning-and-support-learning']) {
  for (const w of [1440, 390]) {
    const ctx = await b.newContext({ viewport: { width: w, height: 900 } });
    await ctx.route(/\/(nav|footer)\.plain\.html|fonts\.css|\.woff2/, async (r) => { await new Promise((x) => setTimeout(x, 1500)); r.continue(); });
    const p = await ctx.newPage();
    await p.addInitScript(() => { window.__cls = 0; new PerformanceObserver((l) => { for (const e of l.getEntries()) if (!e.hadRecentInput) window.__cls += e.value; }).observe({ type: 'layout-shift', buffered: true }); });
    await p.goto(B + path, { waitUntil: 'load' });
    await p.waitForTimeout(5000);
    const cls = await p.evaluate(() => window.__cls);
    let hdr = '';
    if (w === 390) {
      const t = p.locator('header .nav-toggle');
      await t.click(); const open = await t.getAttribute('aria-expanded'); const navVis = await p.locator('#site-nav').isVisible();
      await p.keyboard.press('Escape'); const closed = await t.getAttribute('aria-expanded'); const navHidden = !(await p.locator('#site-nav').isVisible());
      hdr = ` | toggle open=${open} navVisible=${navVis} escape→${closed} navHidden=${navHidden}`;
    }
    console.log(`${path} @${w}: CLS ${cls.toFixed(4)}${hdr}`);
    await ctx.close();
  }
}
await b.close();
