import { chromium } from 'playwright';
const [reskin, eds, w='1440'] = process.argv.slice(2);
const b = await chromium.launch();
const measure = async (url, isEds) => {
  const p = await b.newPage({ viewport: { width: +w, height: 900 } });
  await p.goto(url, { waitUntil: 'load' });
  await p.evaluate(async()=>{for(let y=0;y<document.body.scrollHeight;y+=600){window.scrollTo(0,y);await new Promise(r=>setTimeout(r,100));} window.scrollTo(0,0);});
  if (isEds) await p.waitForFunction(()=>[...document.querySelectorAll('main > .section')].every(s=>s.dataset.sectionStatus==='loaded') && document.querySelector('footer .footer[data-block-status="loaded"]'),null,{timeout:60000}).catch(()=>{});
  await p.waitForFunction(()=>[...document.querySelectorAll('main img')].every(i=>i.complete),null,{timeout:45000}).catch(()=>{});
  await p.waitForTimeout(1000);
  const r = await p.evaluate((isEds) => {
    const secs = isEds ? [...document.querySelectorAll('main > .section')].filter((s) => s.textContent.trim() || s.querySelector('img')) : [...document.querySelectorAll('main > section[data-slot]')];
    return { total: document.documentElement.scrollHeight, header: Math.round(document.querySelector('header').getBoundingClientRect().height), footer: Math.round(document.querySelector('footer').getBoundingClientRect().height), secs: secs.map((s) => Math.round(s.getBoundingClientRect().height)) };
  }, isEds);
  await p.close(); return r;
};
const a = await measure(reskin, false); const e = await measure(eds, true);
console.log(`w=${w} total reskin ${a.total} eds ${e.total} (${((e.total-a.total)/a.total*100).toFixed(1)}%) header ${a.header}/${e.header} footer ${a.footer}/${e.footer}`);
a.secs.forEach((h, i) => { const x = e.secs[i]; console.log(`  s${String(i+1).padStart(2,'0')} reskin ${h} eds ${x} ${x===undefined?'':((x-h)/h*100).toFixed(1)+'%'}`); });
if (e.secs.length !== a.secs.length) console.log('  section count differs', a.secs.length, e.secs.length);
await b.close();
