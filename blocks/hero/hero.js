/**
 * hero — M1 full-bleed photo hero / M9 photo banner (`hero banner`).
 * Template-slotted: the authored picture becomes the cover layer, the authored text moves into
 * the panel. Rows: [picture]? [heading, paragraphs, CTA paragraph].
 * Schema: stardust/eds-schema/home.json (s01, s05), learning-and-support-learning.json (s07).
 * @param {Element} block
 */
export default function decorate(block) {
  const picture = block.querySelector('picture') || block.querySelector('img');
  const media = document.createElement('div');
  media.className = 'hero-media';
  const inner = document.createElement('div');
  inner.className = 'hero-inner';
  const panel = document.createElement('div');
  panel.className = 'hero-panel';
  inner.append(panel);

  const cells = [...block.querySelectorAll(':scope > div > div')];
  cells.forEach((cell) => {
    [...cell.children].forEach((el) => {
      if (el.querySelector('picture, img') && el.textContent.trim() === '') return;
      if (el.tagName === 'PICTURE' || el.tagName === 'IMG') return;
      panel.append(el);
    });
  });
  if (picture) {
    const img = picture.tagName === 'IMG' ? picture : picture.querySelector('img');
    if (img) {
      img.loading = 'eager';
      img.fetchPriority = 'high';
    }
    media.append(picture);
  }
  block.replaceChildren(...(picture ? [media] : []), inner);
  if (!picture) block.classList.add('no-media');
}
