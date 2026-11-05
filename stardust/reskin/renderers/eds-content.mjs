#!/usr/bin/env node
// deploy Steps 1–9 content leg: the gated reskin page's <main> → an EDS content page (body fragment).
// Strings, hrefs and image sources are read from the reskin page DOM, never retyped. Decoration the
// blocks add back at runtime (arrow / chevron ligature glyphs, the sr-only "(opens in new window)" suffix)
// is stripped here; layout-only wrappers are unwrapped.
//   node stardust/reskin/renderers/eds-content.mjs <slug> --out <content file> [--ns <namespace>]
import { chromium } from 'playwright';
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const args = process.argv.slice(2);
const slug = args[0];
const opt = (k) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : null; };
const out = opt('--out');
const ns = opt('--ns');
if (!slug || !out) { console.error('usage: eds-content.mjs <slug> --out <file> [--ns <ns>]'); process.exit(2); }
const mappingAll = JSON.parse(readFileSync('stardust/reskin/mapping.json', 'utf8'));
const slotMap = mappingAll.pages[slug]?.slots || {};
// deploy Step 2 (D1/D11) per module + composition; layout 'stack' on a columns module = prose
const planOf = (slot, kinds, rootTag, rootClass, isFirst) => {
  const e = slotMap[slot] || {};
  const m = e.module;
  const has = (k) => kinds.includes(k);
  if (m === 'M1') return { block: 'hero', h1: isFirst };
  if (m === 'M9' && e.layout === 'media-band') return { block: 'hero (banner)' };
  if (m === 'M9b' || m === 'M9') return { block: 'hero (banner)' };
  if (['M2', 'M11', 'M11b', 'M10'].includes(m) && has('cards')) {
    const v = { M2: 'cards', M11: 'cards (value, tinted)', M11b: 'cards (value)', M10: 'cards (social)' }[m];
    return { head: true, block: v };
  }
  if (['M6', 'M6b', 'M7'].includes(m) && e.layout === 'split' && has('img')) {
    return { block: { M6: 'columns (editorial, tinted)', M6b: 'columns (editorial)', M7: 'columns (split)' }[m] };
  }
  if (m === 'M5') return { style: 'statement' };
  if (m === 'M3') return { style: rootTag === 'aside' ? 'section-nav' : 'breadcrumb' };
  if (has('disclosure')) return { head: true, block: 'accordion' };
  return {};
};
const mediaMapPath = 'stardust/reskin/eds/media-map.json';
const mediaMap = existsSync(mediaMapPath) ? JSON.parse(readFileSync(mediaMapPath, 'utf8')) : {};
const model = JSON.parse(readFileSync(`stardust/reskin/content-model/${slug}/content-model.json`, 'utf8'));

const b = await chromium.launch();
const p = await b.newPage();
await p.goto(pathToFileURL(resolve(`stardust/reskin/pages/${slug}.html`)).href);
const sections = await p.evaluate(() => {
  const clean = (node) => {
    const c = node.cloneNode(true);
    c.querySelectorAll('.glyph, .sr-only').forEach((e) => e.remove());
    c.querySelectorAll('.clamp').forEach((e) => e.replaceWith(...e.childNodes));
    c.querySelectorAll('a[aria-current]').forEach((e) => e.replaceWith(...e.childNodes));
    c.querySelectorAll('img[data-source-src]').forEach((i) => { i.setAttribute('src', i.dataset.sourceSrc); });
    c.querySelectorAll('img').forEach((i) => { if (!/^https?:/.test(i.getAttribute('src') || '')) i.remove(); });
    c.querySelectorAll('*').forEach((e) => {
      [...e.attributes].forEach((a) => { if (!['href', 'src', 'alt', 'data-source-src', 'colspan', 'rowspan'].includes(a.name)) e.removeAttribute(a.name); });
    });
    return c;
  };
  const img = (i) => ({ kind: 'img', src: i.dataset.sourceSrc || i.getAttribute('src') || '', alt: i.getAttribute('alt') || '' });
  const items = (flow) => {
    const res = [];
    for (const el of flow.children) {
      if (el.matches('h1,h2,h3,h4,h5,h6')) res.push({ kind: 'heading', tag: el.tagName.toLowerCase(), html: clean(el).innerHTML });
      else if (el.matches('figure.media')) el.querySelectorAll('img').forEach((i) => res.push(img(i)));
      else if (el.matches('img')) res.push(img(el));
      else if (el.matches('.actions')) el.querySelectorAll('a').forEach((a) => res.push({ kind: 'cta', href: a.getAttribute('href'), text: clean(a).innerHTML, secondary: a.classList.contains('btn-secondary') }));
      else if (el.matches('p')) res.push({ kind: 'p', html: clean(el).innerHTML });
      else if (el.matches('ul,ol')) res.push({ kind: 'list', tag: el.tagName.toLowerCase(), html: clean(el).innerHTML });
      else if (el.matches('.table-wrap, table')) {
        const t = el.matches('table') ? el : el.querySelector('table');
        const rows = [...t.querySelectorAll('tr')].map((tr) => [...tr.children].map((td) => ({ th: td.tagName === 'TH', html: clean(td).innerHTML.trim() })));
        res.push({ kind: 'table', rows });
      }
      else if (el.matches('.cards')) res.push({ kind: 'cards', cards: [...el.children].map((card) => items(card)) });
      else if (el.matches('.disclosure')) {
        const t = clean(el.querySelector('.disclosure-toggle')).innerHTML.trim();
        res.push({ kind: 'disclosure', title: t, panel: items(el.querySelector('.disclosure-panel')) });
      } else if (el.matches('blockquote')) res.push({ kind: 'raw', html: clean(el).outerHTML });
      else if (el.matches('.clamp')) res.push(...items(el));
      else if (el.matches('span.glyph, .sr-only')) { /* runtime decoration */ } else res.push({ kind: 'unknown', tag: el.tagName, cls: el.className, text: el.textContent.slice(0, 80) });
    }
    return res;
  };
  return [...document.querySelectorAll('main > section[data-slot]')].map((s) => {
    const band = s.querySelector(':scope > img.band-img');
    const flow = s.querySelector('[data-slot-body]');
    const list = items(flow);
    const split = s.querySelector('.split-img');
    if (band) list.unshift(img(band));
    if (split) list.push({ ...img(split), split: true, first: s.classList.contains('media-first') });
    return { slot: s.dataset.slot, items: list, kinds: [...new Set(list.map((i) => i.kind))] };
  });
});
await b.close();

const unknown = sections.flatMap((s) => s.items.filter((i) => i.kind === 'unknown').map((i) => `${s.slot}: ${i.tag}.${i.cls} "${i.text}"`));
if (unknown.length) { console.error(`eds-content: unconverted elements\n${unknown.join('\n')}`); process.exit(1); }

const src = (u) => mediaMap[u] || mediaMap[u.split('?')[0]] || u.split('?')[0];
const esc = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
const flagged = [];
let pageH1 = false;
const imgHtml = (i) => {
  const s = src(i.src);
  if (!/^https?:/.test(s)) { flagged.push(`dropped non-URL image src ${s} (source garbage, flagged)`); return ''; }
  if (/fbcdn\.net/.test(s)) flagged.push(s);
  return `<img src="${esc(s)}" alt="${esc(i.alt)}">`;
};
const elHtml = (i, ctx = {}) => {
  switch (i.kind) {
    case 'heading': {
      let tag = ctx.h1 && !ctx.h1done ? 'h1' : i.tag;
      if (ctx.h1) ctx.h1done = true;
      // one <h1> per page: a source's second h1 is authored as h2 (text unchanged; flagged)
      if (tag === 'h1') {
        if (pageH1) { tag = 'h2'; flagged.push(`second source h1 "${i.html.slice(0, 40)}" authored as h2`); }
        pageH1 = true;
      }
      return `<${tag}>${i.html}</${tag}>`;
    }
    case 'p': return `<p>${i.html}</p>`;
    case 'cta': return `<p>${i.secondary ? '<em>' : '<strong>'}<a href="${esc(i.href)}">${i.text}</a>${i.secondary ? '</em>' : '</strong>'}</p>`;
    case 'img': { const h = imgHtml(i); return h ? `<p>${h}</p>` : ''; }
    case 'list': return `<${i.tag}>${i.html}</${i.tag}>`;
    case 'raw': return i.html;
    case 'table': {
      const header = i.rows[0]?.every((c) => c.th);
      const cols = Math.max(...i.rows.map((r) => r.length));
      const rows = i.rows.map((r) => `<div>${Array.from({ length: cols }, (_, k) => `<div>${r[k]?.html ?? ''}</div>`).join('')}</div>`).join('');
      return `<div class="table${header ? '' : ' no-header'}">${rows}</div>`;
    }
    // D1: an embed URL is a plain link in default content; buildAutoBlocks() makes it the embed block
    case 'embed': return `<p><a href="${esc(i.href)}">${esc(i.href)}</a></p>`;
    default: throw new Error(`eds-content: no default-content form for ${i.kind}`);
  }
};
const cell = (html) => `<div>${html}</div>`;
const row = (...cells) => `<div>${cells.map(cell).join('')}</div>`;
const blockName = (spec) => {
  const [name, vars] = spec.match(/^([a-z-]+)(?: \((.*)\))?$/).slice(1);
  return `${name}${vars ? ` ${vars.split(/,\s*/).join(' ')}` : ''}`;
};
// a card's title link (first p holding only a link) is authored as an h3 heading
const cardCells = (card, keepP = false) => {
  const media = card.filter((i) => i.kind === 'img');
  const rest = card.filter((i) => i.kind !== 'img').map((i, k) => {
    if (!keepP && k === 0 && i.kind === 'p' && /^<a [^>]*>[\s\S]*<\/a>$/.test(i.html.trim()) && !card.some((c) => c.kind === 'heading')) return `<h3>${i.html}</h3>`;
    return elHtml(i);
  });
  return media.length ? [media.map(imgHtml).join(''), rest.join('')] : [rest.join('')];
};

const embeds = (opt('--embeds') || '').split(',').filter(Boolean);
const fragments = [];
let fragN = 0;
const embedSlots = model.sections.filter((x) => /embed-container/.test(x.rootClass || '')).map((x) => x.slot);
const sectionHtml = (s, idx) => {
  const ms = model.sections.find((x) => x.slot === s.slot) || {};
  const pl = planOf(s.slot, s.kinds, ms.rootTag, ms.rootClass, idx === 0);
  const ei = embedSlots.indexOf(s.slot);
  if (ei >= 0 && embeds[ei]) s.items.push({ kind: 'embed', href: embeds[ei] });
  const ctx = { h1: pl.h1 };
  let { items } = s;
  const parts = [];
  if (pl.head) {
    const k = items.findIndex((i) => ['cards', 'disclosure'].includes(i.kind));
    parts.push(...items.slice(0, k).map((i) => elHtml(i, ctx)));
    items = items.slice(k);
  }
  if (pl.block) {
    const name = blockName(pl.block);
    let rows = [];
    if (name.startsWith('cards')) rows = items.find((i) => i.kind === 'cards').cards.map((c) => row(...cardCells(c, name.includes('social'))));
    else if (name === 'accordion') {
      rows = items.filter((i) => i.kind === 'disclosure').map((d) => {
        const body = d.panel.map((i) => elHtml(i)).join('');
        if (!d.panel.some((i) => i.kind === 'table')) return row(`<p>${d.title}</p>`, body);
        fragN += 1;
        const fpath = `/${ns}/fragments/${slug}-${fragN}`;
        fragments.push({ path: fpath, html: body });
        return row(`<p>${d.title}</p>`, `<p><a href="${fpath}">${fpath}</a></p>`);
      });
    }
    else if (name.startsWith('hero')) {
      const media = items.filter((i) => i.kind === 'img');
      const text = items.filter((i) => i.kind !== 'img').map((i) => elHtml(i, ctx)).join('');
      rows = media.length ? [row(media.map(imgHtml).join('')), row(text)] : [row(text)];
    } else if (name.startsWith('columns')) {
      const media = items.find((i) => i.split) || items.find((i) => i.kind === 'img');
      const text = items.filter((i) => i !== media).map((i) => elHtml(i, ctx)).join('');
      const first = items.indexOf(media) === 0 || media?.first;
      rows = [first ? row(imgHtml(media), text) : row(text, imgHtml(media))];
    }
    parts.push(`<div class="${name}">${rows.join('')}</div>`);
    // content after the repeating run (a closing paragraph, a CTA) stays default content after the block
    if (name.startsWith('cards') || name === 'accordion') {
      const unit = name === 'accordion' ? 'disclosure' : 'cards';
      const last = items.map((i) => i.kind).lastIndexOf(unit);
      const between = items.slice(0, last + 1).filter((i) => i.kind !== unit && !(unit === 'cards'));
      if (between.length && unit === 'disclosure') throw new Error(`eds-content: ${s.slot} prose between accordion items`);
      parts.push(...items.slice(last + 1).map((i) => elHtml(i, ctx)));
    }
  } else {
    parts.push(...items.map((i) => elHtml(i, ctx)));
  }
  if (pl.style) parts.push(`<div class="section-metadata">${row('<p>style</p>', `<p>${pl.style}</p>`)}</div>`);
  return `<div>${parts.join('\n')}</div>`;
};

const md = model.metadata || {};
const ogImage = md.ogTags?.['og:image'] && src(md.ogTags['og:image']);
if (ogImage && !/^https?:/.test(ogImage)) flagged.push(`source og:image is ${ogImage} (source garbage, not carried)`);
const meta = [['title', md.title], ['description', md.description], ['image', /^https?:/.test(ogImage || '') ? ogImage : null]]
  .filter(([, v]) => v)
  .map(([k, v]) => row(`<p>${k}</p>`, k === 'image' ? `<img src="${esc(v)}" alt="">` : `<p>${esc(v)}</p>`));
if (ns) meta.push(row('<p>nav</p>', `<p>/${ns}/nav</p>`), row('<p>footer</p>', `<p>/${ns}/footer</p>`));
const body = `<body>
<header></header>
<main>
${sections.map((x, k) => sectionHtml(x, k)).join('\n')}
<div><div class="metadata">${meta.join('')}</div></div>
</main>
<footer></footer>
</body>
`;
mkdirSync(dirname(out), { recursive: true });
writeFileSync(out, body);
for (const f of fragments) {
  const fout = `content${f.path}.html`;
  mkdirSync(dirname(fout), { recursive: true });
  writeFileSync(fout, `<body>\n<header></header>\n<main>\n<div>${f.html}</div>\n</main>\n<footer></footer>\n</body>\n`);
}
console.error(`eds-content: ${slug} → ${out} (${sections.length} sections${fragments.length ? `, ${fragments.length} accordion fragment(s)` : ''}${flagged.length ? `; flags: ${flagged.join('; ')}` : ''})`);
