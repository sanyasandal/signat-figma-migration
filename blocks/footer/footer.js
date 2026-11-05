import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

/**
 * footer — M12 dark footer. Template-slotted from the authored footer document:
 * section 1 brand (logo, name, prose), middle sections link columns (optional heading + list),
 * last section the social row (label + links; network links become icons, their text sr-only).
 * @param {Element} block The footer block element
 */
const ICONS = {
  facebook: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.78-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.44 2.89h-2.34v6.99A10 10 0 0 0 22 12z"/></svg>',
  instagram: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm0 8.2a3.2 3.2 0 1 1 0-6.4 3.2 3.2 0 0 1 0 6.4zM17.3 5.5a1.2 1.2 0 1 0 0 2.4 1.2 1.2 0 0 0 0-2.4zM21.9 7.1c-.1-1.6-.4-3-1.6-4.2S17.6 1.3 16 1.2C14.3 1.1 9.7 1.1 8 1.2c-1.6.1-3 .4-4.2 1.6S2.2 5.5 2.1 7.1C2 8.8 2 13.2 2.1 14.9c.1 1.6.4 3 1.6 4.2s2.6 1.5 4.2 1.6c1.7.1 6.3.1 8 0 1.6-.1 3-.4 4.2-1.6s1.5-2.6 1.6-4.2c.1-1.7.1-6.1.2-7.8zM19.8 18a3.2 3.2 0 0 1-1.8 1.8c-1.3.5-4.3.4-5.7.4s-4.4.1-5.7-.4A3.2 3.2 0 0 1 4.8 18c-.5-1.3-.4-4.3-.4-5.7s-.1-4.4.4-5.7A3.2 3.2 0 0 1 6.6 4.8c1.3-.5 4.3-.4 5.7-.4s4.4-.1 5.7.4A3.2 3.2 0 0 1 19.8 6.6c.5 1.3.4 4.3.4 5.7s.1 4.4-.4 5.7z"/></svg>',
};

function el(tag, className) {
  const e = document.createElement(tag);
  if (className) e.className = className;
  return e;
}

export default async function decorate(block) {
  const footerMeta = getMetadata('footer');
  const footerPath = footerMeta ? new URL(footerMeta, window.location).pathname : '/footer';
  const fragment = await loadFragment(footerPath);
  const sections = [...fragment.children];
  const brandSec = sections.shift();
  const socialSec = sections.pop();

  const root = el('div', 'container chrome-footer footer-zoned');
  const main = el('div', 'footer-main');

  const brand = el('div', 'footer-brand');
  if (brandSec) {
    const pic = brandSec.querySelector('picture') || brandSec.querySelector('img');
    if (pic) {
      (pic.tagName === 'IMG' ? pic : pic.querySelector('img'))?.classList.add('logo');
      brand.append(pic);
    }
    const ps = [...brandSec.querySelectorAll('p')].filter((p) => p.textContent.trim());
    ps.forEach((p, i) => {
      p.className = i === 0 ? 'footer-name' : 'footer-prose';
      brand.append(p);
    });
  }
  main.append(brand);

  sections.forEach((sec) => {
    const col = el('div', 'footer-col');
    const title = sec.querySelector('h1, h2, h3, h4, h5, h6');
    if (title) {
      title.classList.add('footer-col-title');
      col.append(title);
    }
    const list = sec.querySelector('ul');
    if (list) col.append(list);
    main.append(col);
  });

  const social = el('div', 'footer-social');
  if (socialSec) {
    const label = socialSec.querySelector('p');
    if (label) {
      label.className = 'footer-social-label';
      social.append(label);
    }
    const list = socialSec.querySelector('ul');
    if (list) {
      list.className = 'icon-links';
      list.querySelectorAll('a').forEach((a) => {
        const key = Object.keys(ICONS).find((k) => a.textContent.trim().toLowerCase() === k);
        if (!key) return;
        a.className = 'social-icon';
        const name = el('span', 'sr-only');
        name.append(...a.childNodes);
        a.insertAdjacentHTML('afterbegin', ICONS[key]);
        a.append(name);
      });
      social.append(list);
    }
  }

  root.append(main, social);
  block.replaceChildren(root);
}
