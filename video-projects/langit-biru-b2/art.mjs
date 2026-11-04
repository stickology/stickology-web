// Original B2 artwork for "Kenapa langit biru?", drawn from code (editable, reproducible).
// Usage: node art.mjs   -> writes PNG layers into ./art/
import fs from 'node:fs';
import path from 'node:path';
import {createRequire} from 'node:module';
const require = createRequire(path.resolve('../../.claude/skills/directing-stickman-videos/package.json'));
const {createCanvas} = require('@napi-rs/canvas');

const OUT = 'art'; fs.mkdirSync(OUT, {recursive: true});
const W = 1280, H = 2276;
const INK = '#3b3a34', PAPER = '#f4f0e5', SKY_PAPER = '#ece5d6', SKY_BLUE = '#a7c6dc',
  HILL = '#a3ab7c', HILL_DARK = '#8a9466', SUN = '#e6b65a', SUN_DARK = '#c99a3e', BRICK = '#c0704f',
  CREAM = '#efe6d2', TAPE = 'rgba(214,206,184,.85)', HEAD = '#fbf8f1', MOLE = '#9db2c4';

let seed = 20261104;
const rnd = () => { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return seed / 4294967296; };
const jit = (a) => (rnd() - 0.5) * 2 * a;

// Hand-drawn polyline: subdivide and jitter slightly, so contours look inked rather than vector-perfect.
function wobble(points, amp = 1.6, step = 14) {
  const out = [];
  for (let i = 0; i < points.length - 1; i++) {
    const [x0, y0] = points[i], [x1, y1] = points[i + 1];
    const n = Math.max(1, Math.round(Math.hypot(x1 - x0, y1 - y0) / step));
    for (let k = 0; k < n; k++) { const t = k / n; out.push([x0 + (x1 - x0) * t + jit(amp), y0 + (y1 - y0) * t + jit(amp)]); }
  }
  out.push(points.at(-1)); return out;
}
function trace(ctx, pts) { ctx.beginPath(); ctx.moveTo(...pts[0]); for (let i = 1; i < pts.length - 1; i++) { const mx = (pts[i][0] + pts[i + 1][0]) / 2, my = (pts[i][1] + pts[i + 1][1]) / 2; ctx.quadraticCurveTo(pts[i][0], pts[i][1], mx, my); } ctx.lineTo(...pts.at(-1)); }
function ink(ctx, points, width = 5, color = INK, amp = 1.6) { ctx.save(); ctx.strokeStyle = color; ctx.lineWidth = width; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; trace(ctx, wobble(points, amp)); ctx.stroke(); ctx.restore(); }
function blob(ctx, cx, cy, rx, ry, fill, stroke = INK, width = 5, amp = 1.2) {
  const pts = Array.from({length: 60}, (_, i) => { const a = i / 60 * Math.PI * 2; return [cx + Math.cos(a) * (rx + jit(amp)), cy + Math.sin(a) * (ry + jit(amp))]; });
  pts.push(pts[0], pts[1]);
  ctx.save(); trace(ctx, pts); ctx.closePath();
  if (fill) { ctx.fillStyle = fill; ctx.fill(); }
  if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = width; ctx.lineJoin = 'round'; ctx.stroke(); }
  ctx.restore();
}
function save(name, canvas) { fs.writeFileSync(path.join(OUT, name), canvas.toBuffer('image/png')); }
const make = (w, h) => { const c = createCanvas(w, h); return [c, c.getContext('2d')]; };

// Hill contour shared by sky/hill layers (design units, full 9:16 frame).
const hillY = (x) => 1530 - 70 * Math.sin((x / W) * Math.PI * 0.9 + 0.25);
const hillPts = Array.from({length: 33}, (_, i) => [i * W / 32, hillY(i * W / 32)]);
const CAPTION_TOP = 1960; // keep caption band plain paper

// 1. sky-paper / sky-blue: same region above the hill; blue copy crossfades in for the payoff.
for (const [name, color] of [['sky-paper.png', SKY_PAPER], ['sky-blue.png', SKY_BLUE]]) {
  const [c, ctx] = make(W, H);
  ctx.fillStyle = color; ctx.beginPath(); ctx.moveTo(60, 200); ctx.lineTo(W - 60, 200);
  hillPts.slice().reverse().forEach(([x, y]) => ctx.lineTo(Math.min(W - 60, Math.max(60, x)), y + 20)); ctx.closePath(); ctx.fill();
  if (color === SKY_BLUE) { ctx.fillStyle = 'rgba(255,255,255,.35)'; for (const [x, y, w] of [[230, 520, 190], [760, 760, 240], [420, 1050, 160]]) { blob(ctx, x, y, w / 2, 34, 'rgba(255,255,255,.55)', null); } }
  ink(ctx, [[60, 200], [W - 60, 200]], 3, 'rgba(59,58,52,.35)', 1.2);
  save(name, c);
}

// 2. hill + tree + grass, transparent above the contour.
{
  const [c, ctx] = make(W, H);
  ctx.fillStyle = HILL; ctx.beginPath(); ctx.moveTo(...hillPts[0]); hillPts.forEach(p => ctx.lineTo(...p)); ctx.lineTo(W, CAPTION_TOP); ctx.lineTo(0, CAPTION_TOP); ctx.closePath(); ctx.fill();
  ctx.fillStyle = HILL_DARK; ctx.beginPath(); ctx.moveTo(0, 1760); ctx.quadraticCurveTo(500, 1690, W, 1800); ctx.lineTo(W, CAPTION_TOP); ctx.lineTo(0, CAPTION_TOP); ctx.closePath(); ctx.globalAlpha = 0.45; ctx.fill(); ctx.globalAlpha = 1;
  ink(ctx, hillPts, 5);
  ink(ctx, [[0, CAPTION_TOP], [W, CAPTION_TOP]], 4, 'rgba(59,58,52,.5)');
  for (let i = 0; i < 26; i++) { const x = 40 + rnd() * 1200, y = hillY(x) + 60 + rnd() * 300; ink(ctx, [[x, y], [x + 6, y - 22]], 3, '#6f7a50', 0.6); ink(ctx, [[x + 10, y], [x + 18, y - 16]], 3, '#6f7a50', 0.6); }
  // small tree, right
  ink(ctx, [[1080, hillY(1080) + 4], [1086, hillY(1080) - 190]], 10, '#7a5a3e', 1);
  blob(ctx, 1088, hillY(1080) - 270, 105, 95, '#8f9a6e', INK, 5, 3);
  blob(ctx, 1040, hillY(1080) - 225, 55, 45, '#9fa97c', INK, 4, 2);
  save('hill.png', c);
}

// 3. sun
{
  const [c, ctx] = make(320, 320);
  for (let i = 0; i < 12; i++) { const a = i / 12 * Math.PI * 2; ink(ctx, [[160 + Math.cos(a) * 112, 160 + Math.sin(a) * 112], [160 + Math.cos(a) * 146, 160 + Math.sin(a) * 146]], 6, SUN_DARK, 0.8); }
  blob(ctx, 160, 160, 88, 88, SUN, INK, 5, 1.5);
  save('sun.png', c);
}

// 4. sitting figure (body without pointing arm). Local frame 560x520, ground at y=480.
{
  const [c, ctx] = make(560, 520);
  blob(ctx, 300, 488, 200, 16, 'rgba(59,58,52,.16)', null);
  const hip = [250, 440], sh = [205, 262];
  ink(ctx, [sh, hip], 6);                                         // torso, leaning back
  ink(ctx, [sh, [150, 360], [118, 462]], 6);                      // support arm to the ground
  blob(ctx, 116, 468, 14, 9, HEAD, INK, 4, 0.5);                  // palm on grass
  ink(ctx, [hip, [372, 334], [452, 470]], 6);                     // far leg, knee up
  ink(ctx, [hip, [338, 362], [420, 476]], 6);                     // near leg
  blob(ctx, 462, 472, 20, 10, INK, INK, 2, 0.4); blob(ctx, 430, 478, 20, 10, INK, INK, 2, 0.4);
  save('body-sit.png', c);
}

// 5. pointing arm, drawn hanging down from the top-left pivot (rendered rotated).
{
  const [c, ctx] = make(60, 230);
  ink(ctx, [[8, 8], [14, 110], [12, 196]], 6, INK, 0.8);
  blob(ctx, 12, 206, 12, 14, HEAD, INK, 4, 0.5);
  save('arm.png', c);
}

// 6. heads: forward, looking up, delighted. Facing right; dot eyes and a short mouth.
const head = (name, eyes, mouth) => {
  const [c, ctx] = make(180, 180);
  blob(ctx, 90, 90, 64, 64, HEAD, INK, 5, 1);
  for (const [x, y] of eyes) blob(ctx, x, y, 6, 7, INK, null);
  mouth(ctx); save(name, c);
};
head('head-forward.png', [[104, 84], [132, 84]], ctx => ink(ctx, [[110, 114], [128, 113]], 4));
head('head-up.png', [[108, 66], [134, 63]], ctx => blob(ctx, 124, 104, 8, 9, null, INK, 4, 0.4));
head('head-smile.png', [[108, 68], [134, 65]], ctx => { ctx.save(); ctx.strokeStyle = INK; ctx.lineWidth = 4; ctx.lineCap = 'round'; ctx.beginPath(); ctx.arc(122, 98, 16, 0.25, Math.PI - 0.25); ctx.stroke(); ctx.restore(); blob(ctx, 152, 102, 9, 6, 'rgba(192,112,79,.45)', null); });

// 7. diagram card on paper (person-free explanatory closeup)
{
  const [c, ctx] = make(1140, 1460);
  ctx.save(); ctx.translate(570, 730); ctx.rotate(-0.012); ctx.translate(-570, -730);
  ctx.fillStyle = 'rgba(59,58,52,.10)'; ctx.fillRect(34, 40, 1080, 1400);
  ctx.fillStyle = CREAM; ctx.beginPath(); ctx.moveTo(24, 24); ctx.lineTo(1100, 30); ctx.lineTo(1094, 1420); ctx.lineTo(30, 1414); ctx.closePath(); ctx.fill();
  ink(ctx, [[24, 24], [1100, 30], [1094, 1420], [30, 1414], [24, 24]], 4);
  for (let y = 180; y < 1380; y += 92) ink(ctx, [[70, y], [1050, y + 3]], 2, 'rgba(95,134,166,.18)', 0.8);
  ctx.restore();
  ctx.fillStyle = TAPE; ctx.save(); ctx.translate(570, 20); ctx.rotate(0.03); ctx.fillRect(-110, -26, 220, 52); ctx.restore();
  save('card.png', c);
}
// 8. molecule dot and eye icon
{ const [c, ctx] = make(70, 70); blob(ctx, 35, 35, 22, 22, MOLE, INK, 4, 0.8); save('molecule.png', c); }
{
  const [c, ctx] = make(220, 140);
  ctx.save(); ctx.beginPath(); ctx.moveTo(20, 70); ctx.quadraticCurveTo(110, -10, 200, 70); ctx.quadraticCurveTo(110, 150, 20, 70); ctx.closePath(); ctx.fillStyle = HEAD; ctx.fill(); ctx.restore();
  ink(ctx, [[20, 70], [65, 32], [110, 22], [155, 32], [200, 70]], 5); ink(ctx, [[20, 70], [65, 108], [110, 118], [155, 108], [200, 70]], 5);
  blob(ctx, 110, 70, 30, 30, '#5f86a6', INK, 4, 0.6); blob(ctx, 110, 70, 12, 12, INK, null); blob(ctx, 120, 60, 5, 5, '#fff', null);
  save('eye.png', c);
}
console.log('art written:', fs.readdirSync(OUT).join(', '));
