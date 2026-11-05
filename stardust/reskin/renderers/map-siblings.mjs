#!/usr/bin/env node
// Phase 3 for content-type siblings: each captured section is mapped by its source block (the NSW
// EDS block class on the section root) onto the same donor modules and compositions the approved
// `content` archetype uses. Writes mapping.json pages + the sibling rows appended to mapping.md.
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';

const MAP = 'stardust/reskin/mapping.json';
const BRIEF = 'stardust/reskin/mapping.md';
const mapping = JSON.parse(readFileSync(MAP, 'utf8'));
const slugs = process.argv.slice(2);
const base = { width: 'wide', inset: '16px' };
const rules = (s) => {
  const rc = s.rootClass || '';
  const hasH1 = (s.ordered || []).some((n) => n.kind === 'heading' && n.level === 'h1');
  const tinted = /off-white|grey|nsw-section--light/.test(rc) || s.tone === 'tinted';
  const dark = /brand-dark/.test(rc) || s.tone === 'dark';
  if (s.rootTag === 'nav' && /breadcrumb/.test(rc)) return [{ module: 'M3', layout: 'stack', ...base }, 'M3 (Category tile rail)', 'breadcrumb: the tab row of short links with dividers'];
  if (s.rootTag === 'aside') return [{ module: 'M3', layout: 'stack', heading: 'h4', ...base }, 'M3 (Category tile rail)', 'section nav: tab list of sibling links, stacked'];
  if (/accordions-container/.test(rc)) return [{ layout: 'stack', heading: 'h2', ...base }, '—', 'disclosures: composed from type.tab / palette.rule / type.body (the archetype accordion new-module)', 'new-module'];
  if (/card-container|content-container/.test(rc)) {
    if (tinted) return [{ module: 'M11', layout: 'cards', heading: 'h2', tone: 'light', bleed: true, ...base }, 'M11 (Value-props band)', 'repeating link/event tiles on the greige band'];
    return [{ module: 'M11b', layout: 'cards', heading: 'h2', ...base }, 'M11b (Value-props tiles, untinted)', 'repeating link tiles: label + body + arrow'];
  }
  if (/facebook-feed/.test(rc)) return [{ module: 'M10', layout: 'cards', columns: 3, align: 'center', heading: 'h2', ...base }, 'M10 (Social stories strip)', 'centred heading over post cards (static snapshot)'];
  if (/columns-container/.test(rc)) {
    if (dark) return [{ module: 'M9', layout: 'media-band', width: 'wide', tone: 'dark', heading: 'h2' }, 'M9 (Photo banner)', 'image + text on the dark band: the photo banner composition'];
    if (tinted) return [{ module: 'M6', layout: 'split', tone: 'light', bleed: true, heading: 'h3', ...base }, 'M6 (Editorial stagger)', 'image beside heading/body/CTA on the greige band'];
    return [{ module: 'M6b', layout: 'split', heading: 'h3', ...base }, 'M6b (Editorial row, untinted)', 'image beside heading/body/CTA'];
  }
  if (/table-container/.test(rc)) return [{ layout: 'stack', heading: hasH1 ? 'display' : 'h2', ...(tinted ? { tone: 'light', bleed: true } : {}), ...base }, '—', 'data tables: no donor table module; composed from type.body, palette.rule, palette.lightBandBg (EDS table block)', 'new-module'];
  if (/embed-container/.test(rc)) return [{ module: 'M5b', layout: 'stack', heading: 'h2', ...base }, 'M5b (Prose band)', 'heading/intro over an embedded video or map (iframe carried in EDS as an embed block)'];
  if (dark) return [{ module: 'M9b', layout: 'stack', tone: 'dark', bleed: true, heading: 'h3', ...base }, 'M9b (Dark quote band)', 'dark full-bleed band of light text (quote or call-out)'];
  if (tinted) return [{ module: 'M5c', layout: 'stack', tone: 'light', bleed: true, heading: 'h2', ...base }, 'M5c (Prose band, greige)', 'prose on the greige band'];
  return [{ module: 'M5b', layout: 'stack', heading: hasH1 ? 'display' : 'h2', ...base }, 'M5b (Prose band)', 'heading + body/lists/media prose'];
};
const rows = [];
for (const slug of slugs) {
  const model = JSON.parse(readFileSync(`stardust/reskin/content-model/${slug}/content-model.json`, 'utf8'));
  const slots = {};
  for (const s of model.sections) {
    const [entry, mod, why, status = 'mapped'] = rules(s);
    slots[s.slot] = entry;
    const head = (s.headings || [])[0];
    const content = `${(head?.text || head || s.visibleText.slice(0, 40)).toString().replace(/\|/g, '/').slice(0, 60)} — ${s.images.length} img, ${s.ctas.length} links`;
    rows.push(`| ${slug} | ${s.slot} | ${content} | ${mod} | ${why} | ${status} |`);
  }
  mapping.pages[slug] = { template: 'learning-and-support-learning', slots };
}
writeFileSync(MAP, `${JSON.stringify(mapping, null, 2)}\n`);
let brief = readFileSync(BRIEF, 'utf8');
const marker = '\n## Stats';
const keep = brief.split('\n').filter((l) => !slugs.some((s) => l.startsWith(`| ${s} |`))).join('\n');
brief = keep.replace(marker, `${rows.join('\n')}\n${marker}`);
writeFileSync(BRIEF, brief);
const mapped = rows.filter((r) => r.endsWith('| mapped |')).length;
console.error(`map-siblings: ${slugs.length} page(s), ${rows.length} slot(s), ${mapped} mapped (${(mapped / rows.length * 100).toFixed(0)}%), ${rows.length - mapped} new-module`);
