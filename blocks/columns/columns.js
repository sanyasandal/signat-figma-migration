/**
 * columns — M6 editorial (`columns editorial`, `tinted` band) / M7 split feature (`columns split`).
 * One row: [text][picture] or [picture][text]; the picture column aligns to its outer edge.
 * Schema: stardust/eds-schema/home.json (s03, s04, s08).
 * @param {Element} block
 */
export default function decorate(block) {
  const cols = [...block.firstElementChild.children];
  block.classList.add(`columns-${cols.length}-cols`);
  [...block.children].forEach((row) => {
    [...row.children].forEach((col, i) => {
      const pic = col.querySelector('picture, img');
      if (pic && col.textContent.trim() === '') {
        col.classList.add('columns-img-col');
        if (i === 0) row.classList.add('media-first');
      }
    });
  });
}
