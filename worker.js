// Stickology: penerima webhook Saweria -> Kampung Stickman (Firestore)
// Variabel di Cloudflare: WEBHOOK_KEY, FIREBASE_API_KEY, FIREBASE_PROJECT_ID, BOT_EMAIL, BOT_PASSWORD
const MIN_CUSTOM = 5000;

const sv = (v) => ({ stringValue: String(v) });
const iv = (v) => ({ integerValue: String(Math.round(v)) });

function readField(f) {
  if (!f) return undefined;
  if ('stringValue' in f) return f.stringValue;
  if ('integerValue' in f) return Number(f.integerValue);
  if ('doubleValue' in f) return Number(f.doubleValue);
  if ('booleanValue' in f) return f.booleanValue;
  if ('mapValue' in f) {
    const o = {};
    for (const [k, v] of Object.entries(f.mapValue.fields || {})) o[k] = readField(v);
    return o;
  }
  return undefined;
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (request.method !== 'POST') return new Response('Webhook Stickology aktif.', { status: 200 });
    if (!env.WEBHOOK_KEY || url.searchParams.get('key') !== env.WEBHOOK_KEY) {
      return new Response('Kode rahasia salah.', { status: 403 });
    }

    let body;
    try { body = await request.json(); } catch (e) { return new Response('Isi kiriman bukan JSON.', { status: 400 }); }

    let sawName = String(body.donator_name || body.donatorName || 'Anonim').trim().slice(0, 24);
    if (!sawName || sawName.includes('@') || /\d{8,}/.test(sawName)) sawName = 'Anonim';
    const amount = Math.max(0, Math.round(Number(body.amount_raw || body.amountRaw || body.amount || 0)));
    const rawMsg = String(body.message || '').trim();
    if (!amount) return new Response('Nominal kosong, diabaikan.', { status: 200 });

    // Masuk sebagai bot
    const login = await fetch(
      'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' + env.FIREBASE_API_KEY,
      { method: 'POST', headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ email: env.BOT_EMAIL, password: env.BOT_PASSWORD, returnSecureToken: true }) }
    ).then((r) => r.json());
    if (!login.idToken) return new Response('Bot gagal masuk ke Firebase.', { status: 500 });
    const H = { 'content-type': 'application/json', authorization: 'Bearer ' + login.idToken };
    const base = 'https://firestore.googleapis.com/v1/projects/' + env.FIREBASE_PROJECT_ID + '/databases/(default)/documents/';

    // Cari kode pesanan di pesan donasi, contoh: KS-7Q4M
    const m = rawMsg.toUpperCase().match(/KS\s*-?\s*([A-Z0-9]{4})/);
    const code = m ? 'KS-' + m[1] : '';
    const cleanMsg = rawMsg.replace(/KS\s*-?\s*[A-Z0-9]{4}/i, '').trim().slice(0, 100);

    let order = null;
    if (code) {
      const r = await fetch(base + 'pesanan/' + code, { headers: H });
      if (r.ok) {
        const doc = await r.json();
        const f = doc.fields || {};
        order = {
          uid: readField(f.uid), name: readField(f.name), look: readField(f.look) || {},
          role: readField(f.role) || 'warga', special: readField(f.special) || '',
          msg: readField(f.msg) || '', status: readField(f.status), exp: Number(readField(f.exp) || 0)
        };
        if (order.status !== 'pending' || order.exp < Date.now()) order = null;
      }
    }

    const now = Date.now();
    let fields;
    if (order && amount >= MIN_CUSTOM) {
      const look = order.look || {};
      fields = {
        name: sv(String(order.name || sawName).slice(0, 24)), amount: iv(amount), msg: sv(order.msg || cleanMsg),
        at: iv(now), src: sv('saweria'), uid: sv(order.uid), code: sv(code), role: sv(order.role),
        look: { mapValue: { fields: { cap: sv(look.cap || '#2F6FEB'), outfit: sv(look.outfit || 'none'), face: sv(look.face || 'smile'), acc: sv(look.acc || 'none') } } }
      };
    } else {
      fields = { name: sv(sawName), amount: iv(amount), msg: sv(cleanMsg), at: iv(now), src: sv('saweria') };
      if (code) fields.code = sv(code);
    }

    const res = await fetch(base + 'donatur', { method: 'POST', headers: H, body: JSON.stringify({ fields }) });
    if (!res.ok) return new Response('Gagal menyimpan donatur: ' + (await res.text()), { status: 500 });

    if (order) {
      const status = amount >= MIN_CUSTOM ? 'paid' : 'kurang';
      await fetch(base + 'pesanan/' + code + '?updateMask.fieldPaths=status&updateMask.fieldPaths=paidAt&updateMask.fieldPaths=paidAmount', {
        method: 'PATCH', headers: H,
        body: JSON.stringify({ fields: { status: sv(status), paidAt: iv(now), paidAmount: iv(amount) } })
      });
      if (status === 'paid' && order.special) {
        await fetch(base + 'roles/' + order.uid, {
          method: 'PATCH', headers: H,
          body: JSON.stringify({ fields: { title: sv(String(order.special).slice(0, 30)), at: iv(now), code: sv(code) } })
        });
      }
    }
    return new Response(order ? 'Donatur berkode masuk ke kampung.' : 'Donatur masuk ke kampung.', { status: 200 });
  }
};
