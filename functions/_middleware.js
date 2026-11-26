// Ganti kartu link preview (Threads, WA, IG, FB) kalau yang dibuka juraganwarnet.stickology.xyz.
// stickology.xyz tetap pakai kartu Stickology yang ada di index.html.
const JW = {
  title: 'Juragan Warnet · Bangun warnet jadi arena e-sport',
  desc: 'Game simulator warnet 3D. Gratis, langsung main di browser tanpa download, bisa bareng teman.',
  url: 'https://juraganwarnet.stickology.xyz/',
  img: 'https://juraganwarnet.stickology.xyz/og-warnet.jpg',
  icon: '/icon-warnet',
};
const set = (v) => ({ element(e) { e.setAttribute('content', v); } });
export async function onRequest(ctx) {
  const res = await ctx.next();
  const host = new URL(ctx.request.url).hostname;
  if (!/^(juraganwarnet|play)\./.test(host)) return res;
  if (!(res.headers.get('content-type') || '').includes('text/html')) return res;
  return new HTMLRewriter()
    .on('title', { element(e) { e.setInnerContent('Juragan Warnet · Stickology'); } })
    .on('meta[name="description"]', set(JW.desc))
    .on('meta[property="og:site_name"]', set('Juragan Warnet'))
    .on('meta[property="og:title"]', set(JW.title))
    .on('meta[property="og:description"]', set(JW.desc))
    .on('meta[property="og:url"]', set(JW.url))
    .on('meta[property="og:image"]', set(JW.img))
    .on('meta[name="twitter:title"]', set(JW.title))
    .on('meta[name="twitter:image"]', set(JW.img))
    .on('link[rel="icon"][type="image/png"]', { element(e) { e.setAttribute('href', JW.icon + '.png'); } })
    .on('link[rel="apple-touch-icon"]', { element(e) { e.setAttribute('href', JW.icon + '.png'); } })
    .transform(res);
}
