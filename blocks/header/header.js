import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

/**
 * header — M13 utility bar + nav. Template-slotted from the authored nav document:
 * section 1 brand (logo picture + name + motto paragraphs), section 2 the link list,
 * section 3 utility links. Authored elements are moved into the chrome DOM, never rebuilt.
 * @param {Element} block The header block element
 */
const isDesktop = window.matchMedia('(min-width: 901px)');

function el(tag, className, attrs = {}) {
  const e = document.createElement(tag);
  if (className) e.className = className;
  Object.entries(attrs).forEach(([k, v]) => e.setAttribute(k, v));
  return e;
}

export default async function decorate(block) {
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/nav';
  const fragment = await loadFragment(navPath);
  const [brandSec, linksSec, toolsSec] = [...fragment.children];

  const header = block.closest('header');

  const utility = el('div', 'utility-bar');
  const utilityInner = el('div', 'container');
  utility.append(utilityInner);
  if (toolsSec) {
    toolsSec.querySelectorAll('a').forEach((a) => {
      a.className = '';
      utilityInner.append(a);
    });
  }

  const row = el('div', 'chrome-row nav-align-center');
  const inner = el('div', 'container');
  row.append(inner);

  const brand = el('div', 'brand');
  const brandText = el('div', 'brand-text');
  if (brandSec) {
    const pic = brandSec.querySelector('picture') || brandSec.querySelector('img');
    if (pic) {
      (pic.tagName === 'IMG' ? pic : pic.querySelector('img'))?.classList.add('logo');
      brand.append(pic);
    }
    brandSec.querySelectorAll('p').forEach((p) => {
      if (p.textContent.trim()) {
        p.className = 'nav-text';
        brandText.append(p);
      }
    });
  }
  brand.append(brandText);

  const nav = el('nav', '', { id: 'site-nav', 'aria-label': 'Main' });
  if (linksSec) {
    linksSec.querySelectorAll('li > a, li > p > a').forEach((a) => {
      a.className = '';
      nav.append(a);
    });
  }

  const actions = el('div', 'nav-actions');
  const skipNav = el('a', 'sr-only', { href: '#site-nav' });
  skipNav.textContent = 'Skip to navigation';
  const skipMain = el('a', 'sr-only', { href: '#main' });
  skipMain.textContent = 'Skip to content';
  const search = el('button', 'icon-btn', { type: 'button', 'aria-label': 'Search' });
  search.append(el('span', 'glyph glyph-search', { 'aria-hidden': 'true' }));
  const toggle = el('button', 'icon-btn nav-toggle', {
    type: 'button', 'aria-label': 'Menu', 'aria-expanded': 'false', 'aria-controls': 'site-nav',
  });
  toggle.append(el('span', 'glyph glyph-menu', { 'aria-hidden': 'true' }));
  const setOpen = (open) => {
    header.classList.toggle('nav-open', open);
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  };
  toggle.addEventListener('click', () => setOpen(toggle.getAttribute('aria-expanded') !== 'true'));
  window.addEventListener('keydown', (e) => {
    if (e.code === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
      setOpen(false);
      toggle.focus();
    }
  });
  isDesktop.addEventListener('change', () => setOpen(false));
  actions.append(skipNav, skipMain, search, toggle);

  inner.append(brand, nav, actions);
  const main = document.querySelector('main');
  if (main && !main.id) main.id = 'main';
  block.replaceChildren(utility, row);
}
