// Generates project.json for the "Langit Biru" B2 preview from timings.json.
// Usage: node build.mjs [timings.json] [output project.json]
// timings.json: { voice, voiceDuration, lead, tail, split, hit, biru, captions:[{start,end,text}] }
// All times are final-video seconds (voice lead included). Artwork comes from art.mjs (./art/*.png).
import fs from 'node:fs';

const [, , timingFile = 'timings.json', outFile = 'project.json'] = process.argv;
const T = JSON.parse(fs.readFileSync(timingFile, 'utf8'));
const total = T.lead + T.voiceDuration + T.tail;
const art = (f) => `${T.artDir ?? 'art'}/${f}`;
const INK = '#3b3a34', BLUE = '#5f86a6', BRICK = '#c0704f', SUN_DARK = '#c99a3e';

// Sitting figure on the hill wearing the Stickology blue cap (art drawn at 1x, placed at 2.1x).
const S = 2.1, BX = 40, BY = 470;
const shoulder = [BX + 216 * S, BY + 306 * S]; // on the torso, below the head
const ARM_UP = -2.21; // points at the sun, clear of the head and cap brim
const figure = ({armKeys, armAngle, heads}) => [
  {type: 'image', path: art('body-sit.png'), x: BX, y: BY, w: 560 * S},
  {type: 'image', path: art('arm.png'), x: shoulder[0] - 8 * S, y: shoulder[1] - 8 * S, w: 60 * S, angle: armAngle, keys: armKeys},
  ...heads.map(({file, from, to, keys}) => ({type: 'image', path: art(file), x: BX + 195 * S - 100 * S, y: BY + 200 * S - 130 * S, w: 260 * S, from, to, keys}))
];
const scene = (extra, skyBlueKeys) => [
  {type: 'image', path: art('sky-paper.png'), x: 0, y: 0, w: 1280},
  ...(skyBlueKeys ? [{type: 'image', path: art('sky-blue.png'), x: 0, y: 0, w: 1280, keys: skyBlueKeys}] : []),
  {type: 'image', path: art('sun.png'), x: 872, y: 600, w: 260},
  {type: 'image', path: art('hill.png'), x: 0, y: 0, w: 1280},
  ...extra
];

// --- Shot A: "Kenapa langit biru?" — sitting on a hill, looks up, points, question.
const aEnd = T.split;
const shotA = {start: 0, end: aEnd, layers: scene([
  ...figure({armAngle: -0.3, armKeys: [{t: 0.35, angle: -0.3}, {t: 0.9, angle: ARM_UP}],
    heads: [{file: 'head-forward.png', to: 0.4}, {file: 'head-up.png', from: 0.4}]}),
  {type: 'text', text: '?', x: 640, y: 470, w: 300, size: 260, bold: true, color: BRICK, from: 0.75,
    keys: [{t: 0.75, alpha: 0, y: 510}, {t: 1.0, alpha: 1, y: 470}]}
])};

// --- Shot B: person-free diagram card — sunlight meets air, blue scatters everywhere, reaches the eye.
const b = (s) => s - aEnd, hitT = b(T.hit);
const payoff = T.biru - 0.25;
const hit = [620, 1020];
const molecules = [[620, 1020], [540, 960], [700, 950], [580, 1090], [690, 1080], [320, 850], [900, 820], [360, 1290], [860, 1200]];
const scatter = (cx, cy, from, len, n, rot, width) => Array.from({length: n}, (_, i) => {
  const a = rot + i * 2 * Math.PI / n, r0 = 42;
  return {type: 'line', color: BLUE, lineWidth: width, from,
    points: [[cx + Math.cos(a) * r0, cy + Math.sin(a) * r0], [cx + Math.cos(a) * (r0 + len), cy + Math.sin(a) * (r0 + len)]],
    keys: [{t: from, progress: 0, alpha: 1}, {t: from + 0.4, progress: 1, alpha: 1}, {t: from + 1.5, progress: 1, alpha: 0.45}]};
});
const eye = [985, 1470];
const shotB = {start: aEnd, end: payoff, layers: [
  {type: 'image', path: art('card.png'), x: 70, y: 320, w: 1140,
    keys: [{t: 0, y: 360, alpha: 0.4}, {t: 0.22, y: 320, alpha: 1}]},
  {type: 'text', text: 'cahaya matahari', x: 340, y: 420, w: 600, size: 72, color: INK},
  {type: 'image', path: art('sun.png'), x: 130, y: 400, w: 230},
  {type: 'line', points: [[330, 640], hit], color: SUN_DARK, lineWidth: 13, keys: [{t: 0.15, progress: 0}, {t: hitT, progress: 1}]},
  ...scatter(...hit, hitT, 210, 10, 0.2, 10),
  ...scatter(320, 850, hitT + 0.3, 110, 6, 0.5, 7),
  ...scatter(900, 820, hitT + 0.45, 110, 6, 0.1, 7),
  ...scatter(360, 1290, hitT + 0.6, 100, 6, 0.4, 7),
  ...scatter(860, 1200, hitT + 0.75, 100, 6, 0.0, 7),
  ...[[620, 1020, 1.0], [900, 820, 1.15], [360, 1290, 1.3], [860, 1200, 1.4]].map(([x, y, d]) => ({
    type: 'line', points: [[x, y], [eye[0] - 60, eye[1] - 10]], color: BLUE, lineWidth: 6, from: hitT + d,
    keys: [{t: hitT + d, progress: 0}, {t: hitT + d + 0.4, progress: 1}]})),
  ...molecules.map(([x, y]) => ({type: 'image', path: art('molecule.png'), x: x - 35, y: y - 35, w: 70})),
  {type: 'text', text: 'udara', x: 560, y: 1120, w: 300, size: 64, color: INK},
  {type: 'image', path: art('eye.png'), x: eye[0] - 110, y: eye[1] - 70, w: 220, from: hitT + 0.9,
    keys: [{t: hitT + 0.9, alpha: 0}, {t: hitT + 1.1, alpha: 1}]},
  {type: 'text', text: 'mata kita', x: 860, y: 1560, w: 330, size: 60, color: INK, from: hitT + 0.9,
    keys: [{t: hitT + 0.9, alpha: 0}, {t: hitT + 1.1, alpha: 1}]}
]};

// --- Shot C: back on the hill, the sky is blue; delighted reaction on "biru".
const shotC = {start: payoff, end: total, layers: scene([
  ...figure({armAngle: ARM_UP, heads: [{file: 'head-up.png', to: 0.3}, {file: 'head-smile.png', from: 0.3}]}),
  {type: 'text', text: 'biru!', x: 150, y: 330, w: 600, size: 230, color: '#4f7ea3', from: 0.2,
    keys: [{t: 0.2, alpha: 0, y: 370}, {t: 0.45, alpha: 1, y: 330}]}
], [{t: 0, alpha: 0.35}, {t: 0.4, alpha: 1}])};

// The runtime requires keyframe times inside each shot: trim keys that would land after the cut.
for (const shot of [shotA, shotB, shotC]) {
  const span = shot.end - shot.start;
  for (const l of shot.layers) if (l.keys) {
    const inside = l.keys.filter(k => k.t <= span);
    if (inside.length < l.keys.length) inside.push({...l.keys[inside.length], t: span});
    l.keys = inside;
  }
}

const project = {
  version: 1, style: 'B2', width: 1080, height: 1920, fps: 30, captionSize: 54,
  voice: {path: T.voice, lead: T.lead, tail: T.tail},
  captions: T.captions,
  shots: [shotA, shotB, shotC],
  sfx: [
    {time: 0.77, kind: 'pop', gain: 0.03},
    {time: T.split + 0.02, kind: 'paper', gain: 0.03},
    {time: T.hit, kind: 'tap', gain: 0.035},
    {time: payoff + 0.22, kind: 'chime', gain: 0.022}
  ]
};
fs.writeFileSync(outFile, JSON.stringify(project, null, 2) + '\n');
console.log(`wrote ${outFile}: ${total.toFixed(2)}s`);
