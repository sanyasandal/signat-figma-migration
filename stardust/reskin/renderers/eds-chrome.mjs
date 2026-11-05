#!/usr/bin/env node
// The reskin page's header/footer → the authored /<ns>/nav and /<ns>/footer documents (strings and hrefs
// read from the DOM). nav: brand | links | tools. footer: brand | one section per column | social row.
//   node stardust/reskin/renderers/eds-chrome.mjs <slug> --ns <ns>
import { chromium } from 'playwright';
import { writeFileSync, mkdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const [slug] = process.argv.slice(2);
const ns = process.argv[process.argv.indexOf('--ns') + 1];
const b = await chromium.launch();
const p = await b.newPage();
await p.goto(pathToFileURL(resolve(`stardust/reskin/pages/${slug}.html`)).href);
const data = await p.evaluate(() => {
  const src = (i) => i.dataset.sourceSrc || i.src;
  const txt = (e) => e.textContent.replace(/\s+/g, ' ').trim();
  const h = document.querySelector('header[data-canon]');
  const f = document.querySelector('footer[data-canon]');
  return {
    logo: { src: src(h.querySelector('.brand img')), alt: h.querySelector('.brand img').alt },
    brand: [...h.querySelectorAll('.brand-text .nav-text')].map(txt),
    links: [...h.querySelectorAll('nav#site-nav > a')].map((a) => ({ href: a.getAttribute('href'), text: [...a.childNodes].filter((n) => n.nodeType === 3).map((n) => n.textContent).join('').trim() })),
    utility: [...h.querySelectorAll('.utility-bar a')].map((a) => ({ href: a.getAttribute('href'), text: txt(a) })),
    footer: {
      logo: { src: src(f.querySelector('.footer-brand img')), alt: f.querySelector('.footer-brand img').alt },
      name: txt(f.querySelector('.footer-name')),
      prose: [...f.querySelectorAll('.footer-prose')].map(txt),
      cols: [...f.querySelectorAll('.footer-col')].map((c) => ({
        title: c.querySelector('.footer-col-title') ? txt(c.querySelector('.footer-col-title')) : null,
        items: [...c.querySelectorAll('li')].map((li) => { const a = li.querySelector('a'); return a ? { href: a.getAttribute('href'), text: txt(a) } : { text: txt(li) }; }),
      })),
      socialLabel: txt(f.querySelector('.footer-social-label')),
      social: [...f.querySelectorAll('.footer-social li a')].map((a) => ({ href: a.getAttribute('href'), text: txt(a) || a.getAttribute('aria-label') })),
    },
  };
});
await b.close();
const esc = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
const li = (i) => `<li>${i.href ? `<a href="${esc(i.href)}">${esc(i.text)}</a>` : esc(i.text)}</li>`;
const doc = (sections) => `<body>\n<header></header>\n<main>\n${sections.map((s) => `<div>${s}</div>`).join('\n')}\n</main>\n<footer></footer>\n</body>\n`;
const nav = doc([
  `<p><img src="${esc(data.logo.src)}" alt="${esc(data.logo.alt)}"></p>${data.brand.map((t) => `<p>${esc(t)}</p>`).join('')}`,
  `<ul>${data.links.map(li).join('')}</ul>`,
  data.utility.map((u) => `<p><a href="${esc(u.href)}">${esc(u.text)}</a></p>`).join(''),
]);
const ft = data.footer;
const footer = doc([
  `<p><img src="${esc(ft.logo.src)}" alt="${esc(ft.logo.alt)}"></p><p>${esc(ft.name)}</p>${ft.prose.map((t) => `<p>${esc(t)}</p>`).join('')}`,
  ...ft.cols.map((c) => `${c.title ? `<h2>${esc(c.title)}</h2>` : ''}<ul>${c.items.map(li).join('')}</ul>`),
  `<p>${esc(ft.socialLabel)}</p><ul>${ft.social.map(li).join('')}</ul>`,
]);
mkdirSync(`content/${ns}`, { recursive: true });
writeFileSync(`content/${ns}/nav.html`, nav);
writeFileSync(`content/${ns}/footer.html`, footer);
console.error(`eds-chrome: content/${ns}/nav.html, content/${ns}/footer.html`);
