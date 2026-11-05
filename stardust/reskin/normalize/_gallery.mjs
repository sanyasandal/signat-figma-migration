import { LEDGER as CONTENT_LEDGER, NORMALIZE as CONTENT_NORMALIZE } from './_content.mjs';

export const LEDGER = [
  ...CONTENT_LEDGER,
  { id: 'N4', what: 'de-carousel .nsw-carousel: every slide static and visible, pager/prev/next removed', why: 'the NSW carousel paints one slide at a time and its pager numbers are UI chrome; the reskin renders all slides in DOM order, so both sides compare deterministically' },
];

export const NORMALIZE = `${CONTENT_NORMALIZE};(() => {
  // N4 — NSW Design System carousel
  document.querySelectorAll('.nsw-carousel').forEach((c) => {
    c.querySelectorAll('.nsw-carousel__navigation, .nsw-carousel__control, .js-carousel__navigation, nav').forEach((e) => e.remove());
    const list = c.querySelector('.nsw-carousel__list');
    if (list) { list.style.transform = 'none'; list.style.display = 'block'; }
    c.querySelectorAll('.nsw-carousel__item').forEach((li) => {
      li.removeAttribute('aria-hidden'); li.style.width = 'auto'; li.style.display = 'block';
      li.style.visibility = 'visible';
    });
  });
})()`;
