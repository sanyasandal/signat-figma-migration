import { DEFAULT_NORMALIZE, DEFAULT_LEDGER } from '../../scripts/reskin/source-normalize.mjs';

export const LEDGER = [
  ...DEFAULT_LEDGER,
  { id: 'N3', what: 'open every .nsw-accordion panel (unhide its content region, aria-expanded=true)', why: 'closed panel text is content; capture-only — the rendered accordion keeps the closed rest state' },
];

export const NORMALIZE = `${DEFAULT_NORMALIZE};(() => {
  // N3 — expand nsw-accordion panels so their text is read
  document.querySelectorAll('.nsw-accordion [aria-expanded="false"]').forEach((b) => {
    b.setAttribute('aria-expanded', 'true');
    const id = b.getAttribute('aria-controls');
    const panel = id && document.getElementById(id);
    if (panel) { panel.hidden = false; panel.removeAttribute('hidden'); panel.style.display = ''; }
  });
  document.querySelectorAll('.nsw-accordion__content[hidden]').forEach((p) => p.removeAttribute('hidden'));
})()`;
