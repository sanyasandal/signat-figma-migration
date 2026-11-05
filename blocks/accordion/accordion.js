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
 * accordion — composed from donor tokens (new-module, Block Collection `accordion` content model).
 * One row per item: [title paragraph][panel content]. Panels start closed
 * (hidden="until-found", the source's rest state); the authored title stays a <p>
 * beside the toggle so it remains editable,
 * and the toggle is named by it. The chevron is the source's Material Icons ligature word.
 * Schema: stardust/eds-schema/learning-and-support-learning.json (s04).
 * @ew-exempt the generated chevron ligature ("keyboard_arrow_down") — presentational, aria-hidden
 * @param {Element} block
 */
let uid = 0;

function setOpen(button, panel, open) {
  button.setAttribute('aria-expanded', open ? 'true' : 'false');
  if (open) panel.removeAttribute('hidden');
  else panel.setAttribute('hidden', 'until-found');
}

export default function decorate(block) {
  const items = [...block.children].map((row) => {
    const [titleCell, panelCell] = row.children;
    uid += 1;
    const id = `accordion-${uid}`;
    const item = document.createElement('div');
    item.className = 'disclosure';

    const head = document.createElement('div');
    head.className = 'disclosure-head';
    const title = titleCell?.querySelector('p, h2, h3, h4') || titleCell;
    title.id = `${id}-title`;
    head.append(title);

    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'disclosure-toggle';
    button.setAttribute('aria-controls', id);
    button.setAttribute('aria-labelledby', title.id);
    const glyph = document.createElement('span');
    glyph.className = 'glyph glyph-down';
    glyph.setAttribute('aria-hidden', 'true');
    glyph.textContent = 'keyboard_arrow_down';
    button.append(glyph);
    head.append(button);

    const panel = document.createElement('div');
    panel.className = 'disclosure-panel';
    panel.id = id;
    if (panelCell) panel.append(...panelCell.childNodes);
    setOpen(button, panel, false);
    button.addEventListener('click', () => {
      setOpen(button, panel, button.getAttribute('aria-expanded') !== 'true');
    });
    panel.addEventListener('beforematch', () => setOpen(button, panel, true));

    item.append(head, panel);
    return item;
  });
  block.replaceChildren(...items);
  decorateExternalLinks(block.closest('.section') || block);
}
