import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

/**
 * footer — M12 dark footer. Template-slotted from the authored footer document:
 * section 1 brand (logo, name, prose), middle sections link columns (optional heading + list),
 * last section the social row (label + links; network links become icons, their text sr-only).
 * @param {Element} block The footer block element
 */
const ICONS = {
  facebook: '<svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true" focusable="false"><path fill-rule="evenodd" d="M4 2h16a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2h-5v-7h2.5l.5-3h-3V9.5c0-.9.4-1.5 1.6-1.5H18V5.3A20 20 0 0 0 15.6 5C13.2 5 12 6.4 12 8.8V12H9.5v3H12v7H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z"/></svg>',
  instagram: '<svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true" focusable="false"><path fill-rule="evenodd" d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H7zm5 3.5a4.5 4.5 0 1 1 0 9 4.5 4.5 0 0 1 0-9zm0 2a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zm5.3-4a1.2 1.2 0 1 1 0 2.4 1.2 1.2 0 0 1 0-2.4z"/></svg>',
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
