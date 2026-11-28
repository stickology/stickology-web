// Ganti kartu link preview (Threads, WA, IG, FB) kalau yang dibuka juraganwarnet.stickology.xyz.
// stickology.xyz tetap pakai kartu Stickology yang ada di index.html.
const JW = {
  title: 'Juragan Warnet · Bangun warnet jadi arena e-sport',
  desc: 'Game simulator warnet 3D. Gratis, langsung main di browser tanpa download, bisa bareng teman.',
  url: 'https://juraganwarnet.stickology.xyz/',
  img: 'https://juraganwarnet.stickology.xyz/og-warnet.jpg',
  icon: '/icon-warnet',
};
// Kartu link preview kalau yang dibuka juraganlaundry.stickology.xyz.
const JL = {
  title: 'Juragan Laundry · Bangun laundry kiloan jadi raja laundry',
  desc: 'Bangun laundry kiloan dari 2 mesin sampai jadi raja laundry. Main bareng teman, tanpa download.',
  url: 'https://juraganlaundry.stickology.xyz/',
  img: 'https://juraganlaundry.stickology.xyz/juragan-laundry-og.jpg',
  icon: '/juragan-laundry-logo',
};
// Kartu link preview kalau yang dibuka angkringan.stickology.xyz.
const ANGK = {
    title: 'Angkringan Simulator · Malam yang Sama',
  desc: 'Jaga angkringan pojok perempatan selama lima malam yang selalu sama. Gratis, langsung main di browser tanpa download.',
  url: 'https://angkringan.stickology.xyz/',
  img: 'https://angkringan.stickology.xyz/angkringan-og-v2.jpg',
  icon: '/angkringan-logo',
};
const set = (v) => ({ element(e) { e.setAttribute('content', v); } });
export async function onRequest(ctx) {
  const res = await ctx.next();
  const host = new URL(ctx.request.url).hostname;
  if (/^juraganlaundry\./.test(host)) {
    if (!(res.headers.get('content-type') || '').includes('text/html')) return res;
    return new HTMLRewriter()
      .on('title', { element(e) { e.setInnerContent('Juragan Laundry'); } })
      .on('meta[name="description"]', set(JL.desc))
      .on('meta[property="og:site_name"]', set('Juragan Laundry'))
      .on('meta[property="og:title"]', set(JL.title))
      .on('meta[property="og:description"]', set(JL.desc))
      .on('meta[property="og:url"]', set(JL.url))
      .on('meta[property="og:image"]', set(JL.img))
      .on('meta[name="twitter:title"]', set(JL.title))
      .on('meta[name="twitter:image"]', set(JL.img))
      .on('link[rel="icon"][type="image/png"]', { element(e) { e.setAttribute('href', JL.icon + '.png'); } })
      .on('link[rel="apple-touch-icon"]', { element(e) { e.setAttribute('href', JL.icon + '.png'); } })
      .on('meta[name="theme-color"]', set('#14919B'))
      .on('meta[name="apple-mobile-web-app-title"]', set('Juragan Laundry'))
      .transform(res);
  }
  if (/^angkringan\./.test(host)) {
      if (!(res.headers.get('content-type') || '').includes('text/html')) return res;
    return new HTMLRewriter()
      .on('title', { element(e) { e.setInnerContent('Angkringan Simulator — Malam yang Sama'); } })
    .on('meta[name="description"]', set(ANGK.desc))
    .on('meta[property="og:site_name"]', set('Angkringan Simulator'))
    .on('meta[property="og:title"]', set(ANGK.title))
    .on('meta[property="og:description"]', set(ANGK.desc))
    .on('meta[property="og:url"]', set(ANGK.url))
    .on('meta[property="og:image"]', set(ANGK.img))
    .on('meta[name="twitter:title"]', set(ANGK.title))
    .on('meta[name="twitter:image"]', set(ANGK.img))
    .on('link[rel="icon"][type="image/png"]', { element(e) { e.setAttribute('href', ANGK.icon + '.png'); } })
    .on('link[rel="apple-touch-icon"]', { element(e) { e.setAttribute('href', ANGK.icon + '.png'); } })
    .on('meta[name="theme-color"]', set('#0d1526'))
    .on('meta[name="apple-mobile-web-app-title"]', set('Angkringan Simulator'))
  .transform(res);
  }
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
    .on('link[rel="apple-touch-icon"]', { element(e) { e.setAttribute('href', JW.icon + '-apple.png'); } })
    .on('link[rel="manifest"]', { element(e) { e.setAttribute('href', '/manifest-warnet.webmanifest'); } })
    .on('meta[name="theme-color"]', set('#2FA36B'))
    .on('meta[name="apple-mobile-web-app-title"]', set('Juragan Warnet'))
    .transform(res);
}
