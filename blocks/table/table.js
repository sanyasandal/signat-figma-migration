/**
 * table — data tables (new-module: no donor table; type.body, palette.rule, palette.lightBandBg).
 * Block Collection model: one row per table row; the first row is the header unless `no-header`.
 * Authored cells are moved into the table cells, never rebuilt.
 * @param {Element} block
 */
export default function decorate(block) {
  const table = document.createElement('table');
  const head = !block.classList.contains('no-header');
  const thead = document.createElement('thead');
  const tbody = document.createElement('tbody');
  [...block.children].forEach((row, i) => {
    const tr = document.createElement('tr');
    [...row.children].forEach((cell) => {
      const c = document.createElement(head && i === 0 ? 'th' : 'td');
      c.append(...cell.childNodes);
      tr.append(c);
    });
    (head && i === 0 ? thead : tbody).append(tr);
  });
  if (head) table.append(thead);
  table.append(tbody);
  const wrap = document.createElement('div');
  wrap.className = 'table-wrap';
  wrap.append(table);
  block.replaceChildren(wrap);
}
