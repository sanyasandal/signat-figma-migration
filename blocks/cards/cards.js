/**
 * External links (not the school or the department's site) open in a new window and carry the
 * source site's screen-reader suffix. Buttons and the social feed are excluded, as on the source.
 * Idempotent: a link is decorated once.
 * @param {Element} root The container to decorate
 */
function decorateExternalLinks(root) {
  root.querySelectorAll('a[href^="http"], a[href^="mailto:"]').forEach((a) => {
    if (a.dataset.external) return;
    let host;
    try {
      host = new URL(a.href).hostname;
    } catch {
      return;
    }
    if (a.protocol !== 'mailto:') {
      if (host === window.location.hostname || host === 'fortstreet-h.schools.nsw.gov.au') return;
      if (host.endsWith('education.nsw.gov.au')) return;
    }
    if (a.classList.contains('button') || a.closest('.cards.social')) return;
    a.dataset.external = 'true';
    a.target = '_blank';
    a.rel = 'noopener';
    const note = document.createElement('span');
    note.className = 'sr-only';
    note.textContent = '(opens in new window)';
    a.append(' ', note);
  });
}

/**
 * cards — M2 tiles / M11 value props (`cards value`, `tinted` band) /
 * M10 social strip (`cards social`).
 * Reconstructive: one row per card, [picture]? [title + body]. Authored elements are
 * moved, never rebuilt. The trailing arrow is the source's Material Icons ligature
 * word ("east"), aria-hidden.
 * Schema: stardust/eds-schema/home.json (s02, s06, s09),
 * learning-and-support-learning.json (s03, s08).
 * @ew-exempt the generated arrow ligature ("east") — presentational, aria-hidden
 * @param {Element} block
 */
export default function decorate(block) {
  const list = document.createElement('div');
  list.className = 'cards-list';
  const rows = [...block.children];
  rows.forEach((row) => {
    const card = document.createElement('div');
    card.className = 'card';
    [...row.children].forEach((cell) => {
      const onlyPicture = cell.querySelector('picture, img') && cell.textContent.trim() === '';
      if (onlyPicture) {
        const media = document.createElement('div');
        media.className = 'card-media';
        media.append(cell.querySelector('picture') || cell.querySelector('img'));
        card.append(media);
      } else {
        card.append(...cell.children);
      }
    });
    const arrow = document.createElement('span');
    arrow.className = 'glyph glyph-right';
    arrow.setAttribute('aria-hidden', 'true');
    arrow.textContent = 'east';
    card.append(arrow);
    if (card.querySelector('.card-media')) card.classList.add('has-media');
    list.append(card);
  });
  list.style.setProperty('--cards-columns', rows.length % 3 === 0 ? 3 : 2);
  block.replaceChildren(list);
  decorateExternalLinks(block.closest('.section') || block);
}
