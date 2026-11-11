// Generates project.json for the "Langit Biru" B3 preview from timings.json.
// Usage: node build.mjs [timings.json] [output project.json]
// timings.json: { voice, voiceDuration, lead, tail, split, hit, biru, captions:[{start,end,text}], television }
// All times in timings.json are final-video seconds (voice lead included).
import fs from 'node:fs';

const [, , timingFile = 'timings.json', outFile = 'project.json'] = process.argv;
const T = JSON.parse(fs.readFileSync(timingFile, 'utf8'));
const total = T.lead + T.voiceDuration + T.tail;

const W = 1280, H = Math.round(1280 * 1920 / 1080 * 100) / 100; // ≈2275.56 design units
const INK = '#e9ebec', GRAY = '#8b9199', DIM = '#5b6169', PANEL = '#191c21', BLUE = '#4da3ff';
const GROUND = 1760;

// Blank-head stick figure with rounded thick limbs (B3 human grammar). Feet at local (0,0).
function figure({x, y = GROUND, scale = 1, armKeys, headKeys, armAngle = 0}) {
  const limb = (points) => ({type: 'line', points, color: INK, lineWidth: 34});
  return {type: 'group', x, y, scaleX: scale, scaleY: scale, children: [
    {type: 'ellipse', x: -70, y: 6, w: 140, h: 26, fill: '#0d0f12'},            // contact shadow
    limb([[0, -250], [-34, -120], [-40, -10]]),                                   // back leg
    limb([[0, -250], [30, -120], [42, -10]]),                                     // front leg
    limb([[0, -470], [0, -250]]),                                                 // torso
    limb([[0, -455], [-34, -350], [-44, -270]]),                                  // relaxed left arm
    {type: 'group', pivotX: 0, pivotY: -440, angle: armAngle, keys: armKeys, children: [
      limb([[0, -440], [22, -340], [26, -255]])                                   // right arm (points when rotated)
    ]},
    {type: 'group', pivotX: 0, pivotY: -480, keys: headKeys, children: [
      limb([[0, -490], [0, -470]]),
      {type: 'ellipse', x: -62, y: -618, w: 124, h: 124, fill: INK}              // blank round head
    ]}
  ]};
}

const frame = (extra) => [
  {type: 'text', text: 'STICKOLOGY / SAINS', x: 90, y: 110, w: 800, size: 46, bold: true, color: DIM},
  {type: 'text', text: '01', x: 1125, y: 110, w: 120, size: 46, bold: true, color: DIM},
  {type: 'rect', x: 70, y: 230, w: 1140, h: 1620, radius: 26, fill: PANEL},
  ...extra,
  {type: 'line', points: [[70, GROUND + 18], [1210, GROUND + 18]], color: '#2b3037', lineWidth: 4}
];

// --- Shot A: "Kenapa langit biru?" — look up, point, question mark.
const aEnd = T.split;
const shotA = {start: 0, end: aEnd, layers: frame([
  {type: 'group', x: 0, y: 0, children: [
    {type: 'ellipse', x: 860, y: 430, w: 150, h: 150, fill: '#2a2f36'}            // unlit sky hint (sun not yet the subject)
  ]},
  figure({x: 470, scale: 1.75,
    headKeys: [{t: 0.15, angle: 0}, {t: 0.6, angle: -0.32}],
    armKeys: [{t: 0.3, angle: 0}, {t: 0.85, angle: -2.1}]}),
  {type: 'text', text: '?', x: 900, y: 640, w: 300, size: 300, bold: true, color: INK, from: 0.7,
    keys: [{t: 0.7, alpha: 0, y: 680}, {t: 0.95, alpha: 1, y: 640}]}
])};

// --- Shot B: sunlight hits air molecules, blue scatters, sky turns blue.
const sun = [920, 470], hit = [560, 1010];
const molecules = [[560, 1010], [470, 950], [640, 930], [520, 1090], [660, 1060], [330, 700], [790, 760], [720, 1420], [930, 1230]];
const scatter = (cx, cy, from, len, n, rot = 0, width = 12) => Array.from({length: n}, (_, i) => {
  const a = rot + i * 2 * Math.PI / n, r0 = 40;
  return {type: 'line', color: BLUE, lineWidth: width, from,
    points: [[cx + Math.cos(a) * r0, cy + Math.sin(a) * r0], [cx + Math.cos(a) * (r0 + len), cy + Math.sin(a) * (r0 + len)]],
    keys: [{t: from, progress: 0, alpha: 1}, {t: from + 0.45, progress: 1, alpha: 1}, {t: from + 1.6, progress: 1, alpha: 0.35}]};
});
const b = (s) => s - aEnd; // final-video time -> shot-relative
const hitT = b(T.hit), biruT = b(T.biru);
const shotB = {start: aEnd, end: total, layers: frame([
  {type: 'rect', x: 70, y: 230, w: 1140, h: 1330, radius: 26, fill: '#2d6bb0', alpha: 0, from: hitT + 0.3,
    keys: [{t: hitT + 0.3, alpha: 0}, {t: biruT + 0.2, alpha: 0.42}]},                              // sky fills with blue
  {type: 'ellipse', x: sun[0] - 170, y: sun[1] - 170, w: 340, h: 340, fill: '#f4f5f5', alpha: 0.12},
  {type: 'ellipse', x: sun[0] - 100, y: sun[1] - 100, w: 200, h: 200, fill: '#f4f5f5'},
  {type: 'text', text: 'MATAHARI', x: 890, y: 610, w: 320, size: 48, bold: true, color: GRAY},
  {type: 'line', points: [[sun[0] - 70, sun[1] + 80], hit], color: '#f4f5f5', lineWidth: 16,
    keys: [{t: 0.05, progress: 0}, {t: hitT, progress: 1}]},                                        // white sunlight travels
  ...scatter(hit[0], hit[1], hitT, 230, 10, 0.2, 13),
  ...scatter(330, 700, hitT + 0.35, 110, 6, 0.5, 8),
  ...scatter(790, 760, hitT + 0.55, 110, 6, 0.1, 8),
  ...scatter(720, 1420, hitT + 0.75, 100, 6, 0.4, 8),
  ...scatter(930, 1230, hitT + 0.9, 100, 6, 0.0, 8),
  ...[[560, 1010, 1.2], [330, 700, 1.35], [930, 1230, 1.5], [790, 760, 1.6]].map(([x, y, d]) => ({
    type: 'line', points: [[x, y], [262, 1215]], color: BLUE, lineWidth: 7, from: hitT + d,
    keys: [{t: hitT + d, progress: 0}, {t: hitT + d + 0.4, progress: 1}]})),                      // blue reaches our eyes
  ...molecules.map(([x, y], i) => ({type: 'ellipse', x: x - 24, y: y - 24, w: 48, h: 48, fill: i < 5 ? '#b8bcc1' : GRAY})),
  {type: 'text', text: 'UDARA', x: 480, y: 1150, w: 300, size: 48, bold: true, color: GRAY},
  figure({x: 230, scale: 0.95, armAngle: -2.1,
    headKeys: [{t: 0, angle: -0.32}, {t: biruT, angle: -0.32}, {t: biruT + 0.25, angle: -0.14}, {t: biruT + 0.5, angle: -0.28}]}),
  {type: 'text', text: 'BIRU', x: 600, y: 1330, w: 600, size: 170, bold: true, color: '#cfe6ff', from: biruT,
    keys: [{t: biruT, alpha: 0, y: 1370}, {t: biruT + 0.25, alpha: 1, y: 1330}]}
])};

const project = {
  version: 1, style: 'B3', width: 1080, height: 1920, fps: 30, captionSize: 54,
  voice: {path: T.voice, lead: T.lead, tail: T.tail},
  captions: T.captions,
  shots: [shotA, shotB],
  sfx: [
    {time: 0.7 + 0.02, kind: 'pop', gain: 0.03},
    {time: T.hit, kind: 'tap', gain: 0.035},
    {time: T.biru, kind: 'chime', gain: 0.02}
  ],
  television: T.television ?? {enabled: true, intensity: 0.45}
};
fs.writeFileSync(outFile, JSON.stringify(project, null, 2) + '\n');
console.log(`wrote ${outFile}: ${total.toFixed(2)}s, design ${W}x${H}`);
