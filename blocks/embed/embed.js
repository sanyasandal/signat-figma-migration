/**
 * embed — a video or map URL authored as a link (Block Collection model), rendered as a lazy
 * iframe that replaces the link, as the source site's embed block does.
 * @param {Element} block
 */
export default function decorate(block) {
  const link = block.querySelector('a[href]');
  if (!link) return;
  const url = new URL(link.href);
  const isMap = /google\.[a-z.]+\/maps/.test(url.href);
  const frame = document.createElement('iframe');
  frame.src = url.href;
  frame.loading = 'lazy';
  frame.allowFullscreen = true;
  frame.setAttribute('allow', 'encrypted-media; picture-in-picture');
  frame.title = isMap ? 'Map' : 'Video';
  const wrap = document.createElement('div');
  wrap.className = `embed-frame ${isMap ? 'embed-map' : 'embed-video'}`;
  wrap.append(frame);
  block.replaceChildren(wrap);
}
