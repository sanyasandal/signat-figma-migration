#!/usr/bin/env node
// Archetype renderer: the generic stream-render, after one structural fix to the model it reads —
// a heading with no text whose children are images (source: <h3><picture>…</h3> in columns-img-col)
// is replaced in the stream by those images, so the image is not dropped. No string is touched.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
// Second fix, applied to the rendered HTML: a slot whose stream is only inline list items (a breadcrumb)
// keeps the source's inline flow (no line break between items — the source innerText has none), with the
// donor M3 tab-row hairline as the divider; an empty source href (the current page) stays an <a> with no href.
import { spawnSync } from 'node:child_process';

const [slug, ...rest] = process.argv.slice(2);
if (!slug) { console.error('usage: node stardust/reskin/renderers/stream.mjs <slug> [stream-render flags]'); process.exit(2); }
const src = `stardust/reskin/content-model/${slug}/content-model.json`;
const model = JSON.parse(readFileSync(src, 'utf8'));
let hoisted = 0;
let lifted = 0;
const fix = (nodes) => nodes.flatMap((n) => {
  // a paragraph holding only a CTA the source styled as a button (p.button-container > a.button)
  // is that CTA: the generic renderer then draws it as the donor .btn, not an inline text link
  if (n.kind === 'paragraph' && n.children?.length === 1 && n.children[0].kind === 'cta' && n.children[0].buttonLike) {
    lifted += 1;
    return [{ ...n.children[0], sep: n.sep }];
  }
  if (n.kind === 'heading' && !(n.text || '').trim() && n.children?.length && n.children.every((c) => c.kind === 'image')) {
    hoisted += n.children.length;
    return n.children.map((c, k) => ({ ...c, sep: k ? c.sep : n.sep }));
  }
  return n.children ? [{ ...n, children: fix(n.children) }] : [n];
});
for (const s of model.sections) s.ordered = fix(s.ordered);
const dir = `stardust/.work/reskin/models/${slug}`;
mkdirSync(dir, { recursive: true });
writeFileSync(`${dir}/content-model.json`, JSON.stringify(model, null, 2));
console.error(`renderer: ${slug} — ${hoisted} image(s) lifted out of empty headings, ${lifted} button CTA(s) lifted out of paragraphs`);
const r = spawnSync('node', ['stardust/scripts/reskin/stream-render.mjs', slug, '--model-dir', 'stardust/.work/reskin/models', ...rest], { stdio: 'inherit' });
if (r.status !== 0 || rest.includes('--check') || rest.includes('--deploy-map')) process.exit(r.status ?? 1);
const oi = rest.indexOf('--out');
const out = oi >= 0 ? rest[oi + 1] : `stardust/reskin/pages/${slug}.html`;
let html = readFileSync(out, 'utf8');
const inline = model.sections.filter((s) => s.ordered.length && s.ordered.every((n) => n.kind === 'listItem' && /^inline/.test(n.display || ''))).map((s) => s.slot);
for (const slot of inline) {
  const at = html.indexOf(`data-slot="${slot}"`);
  const ul = html.indexOf('<ul class="list">', at);
  if (at < 0 || ul < 0) throw new Error(`renderer: ${slot} inline list not found in ${out}`);
  html = `${html.slice(0, ul)}<ul class="list list-inline">${html.slice(ul + '<ul class="list">'.length)}`;
}
const cur = (html.match(/<a class="link" href="">/g) || []).length;
html = html.replaceAll('<a class="link" href="">', '<a class="link" aria-current="page">');
// generic renderer contrast fix: links and the footer name on dark grounds take the ground's foreground
// donor tracking per heading role (the generic renderer leaves letter-spacing normal), same selectors
// and order as its font-size rules so the same rule wins; M2 tiles edge-to-edge, M11 hairline rules
html = html.replace('</head>', `<style>.site-main .tone-dark .link, .site-main .tone-dark .panel a:not(.btn) { color: inherit; }
.site-footer.tone-dark .footer-name { color: inherit; }
.site-main .heading { letter-spacing: var(--type-display-letter-spacing); }
.site-main .heading-h2 .heading { letter-spacing: var(--type-h2-letter-spacing); }
.site-main .heading-h3 .heading { letter-spacing: var(--type-h3-letter-spacing); }
.site-main .heading-h4 .heading { letter-spacing: var(--type-h4-letter-spacing); }
.site-main .band .flow .heading.role-h2 { letter-spacing: var(--type-h2-letter-spacing); }
.site-main .band .flow .heading.role-h3 { letter-spacing: var(--type-h3-letter-spacing); }
.site-main .band .flow .heading.role-h4 { letter-spacing: var(--type-h4-letter-spacing); }
.site-main .heading-display .heading { letter-spacing: var(--type-display-letter-spacing); }
.site-main h2.heading { letter-spacing: var(--type-h2-letter-spacing); }
.site-main h3.heading { letter-spacing: var(--type-h3-letter-spacing); }
.site-main h4.heading { letter-spacing: var(--type-h4-letter-spacing); }
.site-main .card .heading { letter-spacing: var(--type-h3-letter-spacing); }
.site-main .disclosure-toggle { letter-spacing: var(--type-h3-letter-spacing); }
.site-main section[data-module="M2"] .cards { gap: 0; }
.site-main section[data-module="M2"] .card { border-right: 1px solid var(--palette-page-bg); }
.site-main section[data-module="M2"] .card:nth-child(3n) { border-right: 0; }
.site-main section[data-module="M2"] .flow > .heading { padding-inline: var(--layout-gutter); }
.site-main section[data-module="M11"] .cards { gap: 1px; }
.site-main .clamp { display: block; overflow: visible; }
.site-main .tone-dark .btn { background: var(--buttons-secondary-background); color: var(--buttons-secondary-color); }
@media (max-width: 900px) { .site-main section[data-module="M2"] .card { border-right: 0; border-bottom: 1px solid var(--palette-page-bg); } }</style>
</head>`);
if (inline.length) {
  html = html.replace('</head>', `<style>.site-main .list-inline { list-style: none; padding: 0; margin: 0; font-size: var(--type-tab-font-size, 16px); line-height: var(--type-tab-line-height, 20px); letter-spacing: var(--type-tab-letter-spacing, normal); }
.site-main .list-inline li { display: inline; }
.site-main .list-inline li + li { border-left: 1px solid var(--palette-rule, currentColor); margin-left: 12px; padding-left: 12px; }
.site-main .list-inline a[aria-current] { text-decoration: none; color: var(--palette-muted-fg, inherit); }</style>
</head>`);
}
writeFileSync(out, html);
console.error(`renderer: ${slug} — ${inline.length} inline list slot(s), ${cur} current-page link(s)`);
