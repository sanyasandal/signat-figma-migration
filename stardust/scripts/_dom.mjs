import { chromium } from 'playwright';
const [url]=process.argv.slice(2);
const b=await chromium.launch();const p=await b.newPage({viewport:{width:1440,height:900}});
await p.goto(url,{waitUntil:'domcontentloaded'});await p.waitForTimeout(4000);
await p.evaluate(async()=>{for(let y=0;y<document.body.scrollHeight;y+=600){window.scrollTo(0,y);await new Promise(r=>setTimeout(r,150));}});
await p.waitForTimeout(1500);
const out=await p.evaluate(()=>{
 const d=(el)=>{const t=el.tagName.toLowerCase();const id=el.id?'#'+el.id:'';const c=el.className&&typeof el.className==='string'?'.'+el.className.trim().split(/\s+/).slice(0,3).join('.'):'';return t+id+c;};
 const lines=[];
 const walk=(el,depth,max)=>{ if(depth>max)return; const txt=(el.innerText||'').trim().length; if(txt<5&&!el.querySelector('img'))return; lines.push('  '.repeat(depth)+d(el)+' ['+txt+'] '+(el.innerText||'').trim().slice(0,50).replace(/\n/g,' / ')); for(const c of el.children) walk(c,depth+1,max);};
 const main=document.querySelector('main')||document.body; lines.push('body text '+document.body.innerText.length+' main '+(main.innerText||'').length+' h1 '+[...document.querySelectorAll('h1')].map(h=>h.innerText+(main.contains(h)?'(in main)':'(out)')).join('|'));
 walk(document.body,0,7); return lines.join('\n');});
console.log(out);await b.close();
