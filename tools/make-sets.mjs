// Draws the special sets: one card face and one chip motif per set that the
// game's rarity filter lists, and writes them as a stylesheet with every
// picture inline, so the site still ships no image files.
//
//   node tools/make-sets.mjs           write site/css/sets.css and its brand copy
//   node tools/make-sets.mjs --check   exit 1 if either is out of date
//
// The drawings are ours. Each takes its subject and its colours from the set's
// card in the game (colours measured from a player's screenshot of the rarity
// filter: brand/reference/MEASUREMENTS.md, "Special sets"), and none of the
// game's art is traced, copied or shipped. A set's chip keeps its measured
// fill and rim; the motif only sits on top of the fill.

import { readFile, writeFile } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = [join(ROOT, 'site/css/sets.css'), join(ROOT, 'brand/ufmwiz-sets.css')];

// The card face is drawn on the game's 640 by 854 frame; the chip on 40 by 44.
const W = 640, H = 854;

// A small seeded generator, so a drawing is the same on every run.
function rng(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6D2B79F5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const r1 = (n) => Math.round(n * 10) / 10;
const pts = (list) => list.map(([x, y]) => `${r1(x)},${r1(y)}`).join(' ');

const uri = (svg) => `url("data:image/svg+xml,${svg.replace(/%/g, '%25').replace(/#/g, '%23').replace(/</g, '%3C').replace(/>/g, '%3E').replace(/"/g, "'")}")`;
const face = (body) => uri(`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 ${W} ${H}' preserveAspectRatio='none'>${body}</svg>`);
const chip = (body) => uri(`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 40 44' preserveAspectRatio='none'>${body}</svg>`);

// A curve drawn three times, wide and dim under narrow and bright: a ribbon.
const ribbon = (d, layers) => layers.map(([c, w, o]) => `<path d='${d}' fill='none' stroke='${c}' stroke-width='${w}' stroke-linecap='round' opacity='${o}'/>`).join('');
const line = (x1, y1, x2, y2, c, w, o = 1) => `<path d='M${r1(x1)} ${r1(y1)}L${r1(x2)} ${r1(y2)}' stroke='${c}' stroke-width='${w}' stroke-linecap='round' opacity='${o}' fill='none'/>`;
// An arrowhead at (x, y) pointing along `deg` (0 is right, 90 is down).
function head(x, y, deg, size, c, o = 1) {
  const a = (deg * Math.PI) / 180;
  const p = (d, s) => [x + Math.cos(a + d) * s, y + Math.sin(a + d) * s];
  return `<polygon points='${pts([[x, y], p(Math.PI * 0.84, size), p(Math.PI, size * 0.55), p(-Math.PI * 0.84, size)])}' fill='${c}' opacity='${o}'/>`;
}
const cross = (x, y, s, c, w, o = 1) => line(x - s, y - s, x + s, y + s, c, w, o) + line(x - s, y + s, x + s, y - s, c, w, o);
const ring = (x, y, r, c, w, o = 1) => `<circle cx='${x}' cy='${y}' r='${r}' fill='none' stroke='${c}' stroke-width='${w}' opacity='${o}'/>`;

// ---- the drawings ------------------------------------------------------------

function europeanEvolutions() {
  const blue = 'M700 150C440 230 250 470 140 900', blue2 = 'M700 330C480 390 340 580 300 900', blue3 = 'M700 20C520 60 400 150 330 260';
  const pink = 'M-40 470C40 280 230 100 480 -40', pink2 = 'M-40 640C10 420 150 230 330 110';
  return face(
    ribbon(pink, [['#D61CC7', 110, 0.28], ['#D61CC7', 40, 0.3], ['#F8E2FA', 2.5, 0.8]])
    + ribbon(pink2, [['#D61CC7', 60, 0.2], ['#F8E2FA', 1.5, 0.5]])
    + ribbon(blue, [['#0F58CB', 130, 0.34], ['#2AAAF4', 46, 0.3], ['#BFE8FF', 3, 0.85]])
    + ribbon(blue2, [['#0F58CB', 80, 0.3], ['#2AAAF4', 2, 0.7]])
    + ribbon(blue3, [['#2AAAF4', 30, 0.22], ['#BFE8FF', 1.5, 0.6]]),
  );
}

function gameChangers() {
  const gold = '#D4B959', pale = '#F2EAA9', green = '#519E5A';
  return face(
    // the light across the board
    `<path d='M-40 250L700 60L700 170L-40 420Z' fill='${green}' opacity='.16'/><path d='M-40 640L700 380L700 450L-40 740Z' fill='${green}' opacity='.1'/>`
    // marked runs
    + ribbon('M585 105C470 160 340 235 235 300', [[gold, 7, 0.95], [pale, 2, 0.9]]) + head(222, 308, 150, 44, gold)
    + line(585, 105, 425, 430, gold, 3.5, 0.85)
    + ribbon('M70 440Q170 300 240 205', [[gold, 4, 0.85]])
    + ribbon('M150 470L400 405', [[green, 5, 0.6]]) + head(410, 402, -15, 30, green, 0.6)
    + ribbon('M470 760L575 640', [[gold, 4, 0.8]]) + head(582, 632, -49, 30, gold, 0.9)
    // the pieces
    + cross(432, 92, 15, gold, 5) + cross(205, 250, 11, gold, 4, 0.9) + cross(520, 345, 14, green, 5, 0.7) + cross(150, 600, 16, green, 5, 0.5)
    + ring(510, 250, 16, gold, 5) + ring(72, 330, 15, gold, 4, 0.9) + ring(560, 570, 18, green, 5, 0.6) + ring(95, 690, 15, gold, 4, 0.8) + ring(330, 80, 14, green, 4, 0.5),
  );
}

function harvest() {
  const rand = rng(11);
  let out = '';
  // chaff on the wind
  for (const [c, o] of [['#E6B62B', 0.45], ['#F1D954', 0.75]]) {
    out += `<g fill='${c}' opacity='${o}'>`;
    for (let i = 0; i < 26; i++) out += `<circle cx='${Math.round(120 + rand() * 520)}' cy='${Math.round(60 + rand() * 420)}' r='${r1(1 + rand() * 2.6)}'/>`;
    out += '</g>';
  }
  // an ear of wheat: a stem, grains in pairs, an awn from each grain
  const ear = (x0, y0, x1, y1, n, size) => {
    const dx = x1 - x0, dy = y1 - y0, len = Math.hypot(dx, dy), ux = dx / len, uy = dy / len, deg = (Math.atan2(dy, dx) * 180) / Math.PI;
    let s = line(x0 - ux * len * 0.45, y0 - uy * len * 0.45, x1, y1, '#B4904A', size * 0.22, 0.9);
    for (let i = 0; i < n; i++) {
      const t = i / (n - 1), cx = x0 + dx * t, cy = y0 + dy * t, k = size * (1 - t * 0.35);
      for (const side of [-1, 1]) {
        const gx = cx - uy * side * k * 0.55, gy = cy + ux * side * k * 0.55, turn = deg + side * 28;
        s += `<ellipse rx='${Math.round(k)}' ry='${Math.round(k * 0.42)}' transform='translate(${Math.round(gx)} ${Math.round(gy)}) rotate(${Math.round(turn)})' fill='${i % 2 ? '#E6B62B' : '#F1D954'}'/>`;
        const a = (turn * Math.PI) / 180;
        s += line(gx + Math.cos(a) * k, gy + Math.sin(a) * k, gx + Math.cos(a) * k * 3.2, gy + Math.sin(a) * k * 3.2, '#FCF2BB', 1.4, 0.7);
      }
    }
    return s;
  };
  out += `<path d='M0 395L640 395' stroke='#F1D954' stroke-width='2' opacity='.45'/>`;
  out += ear(250, 380, 560, 150, 9, 30) + ear(330, 430, 610, 300, 7, 22) + ear(170, 300, 400, 110, 7, 20);
  return face(out);
}

function mavericks() {
  const seam = (x1, y1, x2, y2) => line(x1, y1, x2, y2, '#1D1E1F', 5, 0.85) + line(x1 + 3, y1 - 3, x2 + 3, y2 - 3, '#6A7078', 1.5, 0.7);
  const hazard = (x, y, dir) => [0, 1, 2].map((i) => line(x + i * 26 * dir, y, x + i * 26 * dir + 44 * dir, y - 62, '#A98727', 13, 0.95)).join('');
  const star = (cx, cy, R) => `<polygon points='${pts(Array.from({ length: 10 }, (_, i) => { const a = (-90 + i * 36) * Math.PI / 180, r = i % 2 ? R * 0.42 : R; return [cx + Math.cos(a) * r, cy + Math.sin(a) * r]; }))}' fill='#D8C3B3'/>`;
  return face(
    // plates, each caught by the light a little differently
    `<polygon points='0,0 330,0 0,400' fill='#62676B' opacity='.34'/><polygon points='640,0 640,330 330,0' fill='#1D1E1F' opacity='.3'/>`
    + `<polygon points='320,300 560,560 320,820 80,560' fill='#52575C' opacity='.22'/><polygon points='0,560 220,854 0,854' fill='#62676B' opacity='.2'/>`
    + seam(0, 400, 330, 0) + seam(330, 0, 640, 330) + seam(80, 560, 320, 300) + seam(320, 300, 560, 560) + seam(0, 480, 300, 854) + seam(640, 480, 340, 854)
    + Array.from({ length: 22 }, (_, i) => line(20 + i * 29, 0, 20 + i * 29 - 300, 520, i % 3 ? '#62676B' : '#1D1E1F', 1, 0.28)).join('')
    + hazard(40, 500, 1) + hazard(600, 150, -1)
    + star(320, 74, 26) + line(250, 74, 282, 74, '#D8C3B3', 4, 0.8) + line(358, 74, 390, 74, '#D8C3B3', 4, 0.8),
  );
}

function mostWanted() {
  const rand = rng(5);
  const sx = 410, sy = 300, sr = 138, shore = 462;
  // the sun, then the sky cut back through its lower half in widening bands
  let sun = `<defs><linearGradient id='s' x1='0' y1='0' x2='0' y2='1'><stop offset='0' stop-color='#FCE5E7'/><stop offset='.5' stop-color='#F8C8C2'/><stop offset='1' stop-color='#F05A63'/></linearGradient><clipPath id='c'><circle cx='${sx}' cy='${sy}' r='${sr}'/></clipPath></defs><circle cx='${sx}' cy='${sy}' r='${sr}' fill='url(#s)'/>`;
  for (let i = 0; i < 6; i++) sun += `<rect x='${sx - sr}' y='${sy + 8 + i * 22}' width='${sr * 2}' height='${4 + i * 2.4}' fill='#E12D67' clip-path='url(#c)'/>`;
  // a skyline on the far shore
  let city = '';
  for (let x = 250; x < 640;) {
    const w = 22 + rand() * 30, h = 34 + rand() * 150 * (1 - Math.abs(x - 430) / 330);
    city += `<rect x='${r1(x)}' y='${r1(shore - h)}' width='${r1(w)}' height='${r1(h)}' fill='${rand() < 0.5 ? '#591259' : '#96276C'}'/>`;
    x += w + rand() * 10;
  }
  // the sun on the water
  let water = `<rect x='0' y='${shore}' width='${W}' height='6' fill='#240D4D'/>`;
  for (let i = 0; i < 9; i++) {
    const y = shore + 14 + i * 9, half = 120 - i * 10 + rand() * 20;
    water += line(sx - half, y, sx + half, y, i % 2 ? '#F05A63' : '#F8C8C2', 3, 0.75 - i * 0.06);
  }
  // a palm: a leaning trunk and a crown of fronds
  const palm = (bx, by, tx, ty, s) => {
    let p = `<path d='M${bx} ${by}Q${bx + (tx - bx) * 0.2} ${(by + ty) / 2} ${tx} ${ty}' stroke='#0B093B' stroke-width='${14 * s}' fill='none' stroke-linecap='round'/>`;
    for (const [deg, len] of [[-170, 150], [-140, 170], [-105, 150], [-70, 160], [-35, 175], [0, 150], [28, 120], [-200, 120]]) {
      const a = (deg * Math.PI) / 180, ex = tx + Math.cos(a) * len * s, ey = ty + Math.sin(a) * len * s + 60 * s;
      const mx = tx + Math.cos(a) * len * s * 0.55, my = ty + Math.sin(a) * len * s * 0.75 - 26 * s;
      p += `<path d='M${tx} ${ty}Q${r1(mx)} ${r1(my)} ${r1(ex)} ${r1(ey)}Q${r1(mx)} ${r1(my + 34 * s)} ${tx} ${ty}Z' fill='#0B093B'/>`;
    }
    return p;
  };
  return face(sun + city + water + palm(118, 700, 170, 170, 1) + palm(640, 640, 610, 250, 0.7));
}

function screamers() {
  const wisp = (d, w) => ribbon(d, [['#14515B', w * 2.2, 0.35], ['#14515B', w, 0.75], ['#1E8D8A', w * 0.6, 0.8], ['#0CBF93', w * 0.24, 0.9], ['#2DB797', 2.5, 0.85]]);
  // bare spires on the skyline, behind the mist
  const rand = rng(3);
  let spires = `<path d='M0 854L0 730`;
  for (let x = 0; x <= 640; x += 32) spires += `L${x} ${r1(700 + rand() * 50)}L${x + 10} ${r1(610 + rand() * 80)}L${x + 20} ${r1(700 + rand() * 50)}`;
  spires += `L640 854Z' fill='#142A61' opacity='.75'/>`;
  return face(
    spires
    + wisp('M700 790C520 720 610 540 500 440C400 350 540 230 440 140C380 90 300 120 240 62', 46)
    + wisp('M440 140C340 160 310 270 210 250C140 236 124 170 162 146C196 126 226 160 204 186', 30)
    + wisp('M660 260C580 210 610 100 510 66C430 40 400 118 462 150C500 168 520 132 498 112', 26)
    + wisp('M520 900C480 770 580 700 520 590', 30)
    + wisp('M-40 640C60 600 40 500 120 470C180 448 204 500 168 520', 22)
    + wisp('M560 150C640 110 660 30 600 -20', 40) + wisp('M300 330C380 300 420 360 500 440', 20)
    // a pair of eyes in the mist
    + `<ellipse cx='548' cy='196' rx='9' ry='5' fill='#2DB797' transform='rotate(18 548 196)'/><ellipse cx='586' cy='206' rx='9' ry='5' fill='#2DB797' transform='rotate(-8 586 206)'/>`,
  );
}

function shapeshifters() {
  const rand = rng(8);
  const tones = ['#3D3B7A', '#113D5A', '#23235E', '#2C5375', '#115663', '#1C8577', '#1C6971'];
  let out = '';
  for (let x = 0; x < W;) {
    const w = 18 + rand() * 62;
    // a column in two or three lengths, each cut on a slant
    let y = -20;
    const parts = 2 + Math.floor(rand() * 2);
    for (let i = 0; i < parts; i++) {
      const h = i === parts - 1 ? H + 40 - y : 160 + rand() * 380, slant = (rand() - 0.5) * 70;
      out += `<polygon points='${pts([[x, y], [x + w, y + slant], [x + w, y + h + slant], [x, y + h]])}' fill='${tones[Math.floor(rand() * tones.length)]}' opacity='${r1(0.75 + rand() * 0.25)}'/>`;
      y += h;
    }
    if (rand() < 0.35) out += line(x, 0, x, H, '#2ADB9F', 1.5, 0.45);
    x += w;
  }
  return face(out);
}

function superHeroes() {
  const rand = rng(21);
  const cx = 320, cy = 470, far = 900;
  let out = '', a = rand() * 6;
  while (a < 360) {
    const w = 2 + rand() * 9, light = rand() < 0.5;
    const p = (deg) => [cx + Math.cos((deg * Math.PI) / 180) * far, cy + Math.sin((deg * Math.PI) / 180) * far];
    out += `<polygon points='${pts([[cx, cy], p(a), p(a + w)])}' fill='${light ? '#8F9BC2' : '#0B2144'}' opacity='${r1(light ? 0.1 + rand() * 0.16 : 0.14 + rand() * 0.2)}'/>`;
    a += w + rand() * 5;
  }
  return face(out);
}

function teamOfTheWeek() {
  // a chevron cut from yellow plate, printed with a halftone
  const chevron = [[250, 378], [470, 232], [620, 232], [400, 378], [620, 524], [470, 524]];
  return face(
    `<defs><linearGradient id='y' x1='0' y1='0' x2='1' y2='1'><stop offset='0' stop-color='#FEFD37'/><stop offset='.55' stop-color='#F6D911'/><stop offset='1' stop-color='#907E46'/></linearGradient><pattern id='h' width='13' height='13' patternUnits='userSpaceOnUse' patternTransform='rotate(45)'><circle cx='6.5' cy='6.5' r='3.1' fill='#130C07'/></pattern><linearGradient id='f' x1='0' y1='0' x2='1' y2='0'><stop offset='.3' stop-color='#fff' stop-opacity='0'/><stop offset='1' stop-color='#fff'/></linearGradient><mask id='m'><rect x='250' y='232' width='370' height='292' fill='url(#f)'/></mask></defs>`
    // brushed plates behind it
    + `<polygon points='0,0 640,0 640,170 0,330' fill='#907E46' opacity='.18'/><polygon points='0,330 640,170 640,232 0,430' fill='#130C07' opacity='.5'/>`
    + `<polygon points='0,560 250,378 400,378 120,854 0,854' fill='#65593B' opacity='.28'/><polygon points='640,560 640,854 300,854' fill='#41331D' opacity='.45'/>`
    + `<polygon points='${pts(chevron)}' fill='url(#y)'/><polygon points='${pts(chevron)}' fill='url(#h)' mask='url(#m)' opacity='.34'/>`
    + `<polygon points='${pts(chevron)}' fill='none' stroke='#FEFD37' stroke-width='3' opacity='.9'/>`
    + line(0, 330, 640, 170, '#B8A74C', 2, 0.7) + line(0, 430, 640, 232, '#B8A74C', 1.5, 0.4),
  );
}

function transferStars() {
  const rand = rng(14);
  const tones = [['#013742', 0.9], ['#015B5F', 0.85], ['#015B5F', 0.7], ['#02A99C', 0.7], ['#01D8C5', 0.75]];
  const ang = (-54 * Math.PI) / 180, ux = Math.cos(ang), uy = Math.sin(ang), nx = -uy, ny = ux;
  let out = '';
  // brush strokes thrown up the diagonal, ragged at both ends
  for (let i = 0; i < 34; i++) {
    const off = (rand() - 0.5) * 520, cx = 320 + nx * off + ux * (rand() - 0.5) * 500, cy = 427 + ny * off + uy * (rand() - 0.5) * 500;
    const len = 120 + rand() * 330, w = 6 + rand() * 34, [c, o] = tones[Math.floor(rand() * rand() * tones.length)];
    const a = [cx - ux * len / 2, cy - uy * len / 2], b = [cx + ux * len / 2, cy + uy * len / 2];
    out += `<polygon points='${pts([[a[0] - nx * w / 2, a[1] - ny * w / 2], [b[0] - nx * w * 0.1, b[1] - ny * w * 0.1], [b[0] + ux * 26, b[1] + uy * 26], [b[0] + nx * w * 0.4, b[1] + ny * w * 0.4], [a[0] + nx * w / 2, a[1] + ny * w / 2], [a[0] - ux * 18, a[1] - uy * 18]])}' fill='${c}' opacity='${o}'/>`;
  }
  // the move itself
  out += `<path d='M236 520L420 300L392 372L592 150' fill='none' stroke='#2BE6CA' stroke-width='7' stroke-linejoin='miter' opacity='.95'/>` + head(606, 134, -48, 46, '#2BE6CA');
  out += `<path d='M70 250L150 150' fill='none' stroke='#02A99C' stroke-width='5' opacity='.8'/>` + head(158, 140, -51, 30, '#02A99C', 0.8);
  return face(out);
}

function weekendLeague() {
  const rand = rng(31);
  // hairline cracks in the stone
  let out = '';
  for (let i = 0; i < 16; i++) {
    let x = rand() * W, y = rand() * 560, d = `M${r1(x)} ${r1(y)}`;
    for (let j = 0; j < 5; j++) { x += (rand() - 0.5) * 130; y += 20 + rand() * 70; d += `L${r1(x)} ${r1(y)}`; }
    out += `<path d='${d}' fill='none' stroke='${rand() < 0.5 ? '#31493F' : '#010202'}' stroke-width='${r1(1 + rand() * 1.6)}' opacity='.7'/>`;
  }
  // the fissure: a jagged line that splits as it runs, lit from inside
  const crack = (x, y, tx, ty, steps, jitter) => {
    const out = [[x, y]];
    for (let i = 1; i <= steps; i++) out.push([x + ((tx - x) * i) / steps + (i < steps ? (rand() - 0.5) * jitter : 0), y + ((ty - y) * i) / steps + (i < steps ? (rand() - 0.5) * jitter * 0.5 : 0)]);
    return out;
  };
  const main = crack(590, 30, 170, 610, 12, 90);
  const limbs = [crack(...main[3], main[3][0] - 190, main[3][1] + 40, 5, 50), crack(...main[6], main[6][0] + 150, main[6][1] + 130, 5, 50), crack(...main[9], main[9][0] - 60, main[9][1] - 150, 4, 40)];
  const d = (p) => 'M' + p.map(([x, y]) => `${r1(x)} ${r1(y)}`).join('L');
  const lit = (p, k) => [['#46A54F', 54 * k, 0.16], ['#77BF60', 26 * k, 0.3], ['#77BF60', 11 * k, 0.9], ['#ABD470', 5 * k, 1], ['#BCDD95', 1.6 * k, 1]]
    .map(([c, w, o]) => `<path d='${d(p)}' fill='none' stroke='${c}' stroke-width='${r1(w)}' stroke-linejoin='miter' opacity='${o}'/>`).join('');
  out += limbs.map((p) => lit(p, 0.5)).join('') + lit(main, 1);
  out += `<g fill='#BCDD95'>`;
  for (let i = 0; i < 40; i++) {
    const [x, y] = main[Math.floor(rand() * main.length)];
    out += `<circle cx='${Math.round(x + (rand() - 0.5) * 240)}' cy='${Math.round(y + (rand() - 0.5) * 170)}' r='${r1(0.8 + rand() * 2.2)}' opacity='${r1(0.3 + rand() * 0.6)}'/>`;
  }
  out += '</g>';
  return face(out);
}

function veterans() {
  const rand = rng(44);
  // veins through the marble
  let out = '';
  for (let i = 0; i < 13; i++) {
    let x = rand() * W, y = -20, d = `M${r1(x)} ${r1(y)}`;
    const lean = (rand() - 0.5) * 150;
    while (y < H + 20) { x += lean * 0.4 + (rand() - 0.5) * 90; y += 40 + rand() * 90; d += `L${r1(x)} ${r1(y)}`; }
    const c = ['#DBAF72', '#CE9C5B', '#B77941'][i % 3];
    out += `<path d='${d}' fill='none' stroke='#FAEAD2' stroke-width='${r1(6 + rand() * 8)}' opacity='.5' stroke-linejoin='round'/><path d='${d}' fill='none' stroke='${c}' stroke-width='${r1(1 + rand() * 2.2)}' opacity='${r1(0.55 + rand() * 0.4)}' stroke-linejoin='round'/>`;
  }
  // a medal: a disc in a ring, with a laurel branch up each side
  const cx = 350, cy = 330;
  out += `<defs><radialGradient id='d' cx='.4' cy='.35' r='.75'><stop offset='0' stop-color='#FAEAD2'/><stop offset='.6' stop-color='#D3BDA8'/><stop offset='1' stop-color='#977555'/></radialGradient></defs>`;
  out += `<circle cx='${cx}' cy='${cy}' r='128' fill='#C89B6C'/><circle cx='${cx}' cy='${cy}' r='128' fill='none' stroke='#9E744C' stroke-width='3'/><circle cx='${cx}' cy='${cy}' r='112' fill='url(#d)'/><circle cx='${cx}' cy='${cy}' r='112' fill='none' stroke='#E3BC8E' stroke-width='3'/>`;
  for (const side of [-1, 1]) {
    for (let i = 0; i < 8; i++) {
      const deg = 90 + side * (18 + i * 19), a = (deg * Math.PI) / 180, lx = cx + Math.cos(a) * 80, ly = cy + Math.sin(a) * 80;
      const turn = deg + side * 62;
      out += `<ellipse cx='${r1(lx)}' cy='${r1(ly)}' rx='${r1(25 - i)}' ry='${r1(9.5 - i * 0.4)}' transform='rotate(${r1(turn)} ${r1(lx)} ${r1(ly)})' fill='${i % 2 ? '#B77941' : '#977555'}'/>`;
    }
    out += `<path d='M${cx} ${cy + 82}A82 82 0 0 ${side === 1 ? 0 : 1} ${r1(cx + side * 60)} ${r1(cy - 56)}' fill='none' stroke='#79583A' stroke-width='3'/>`;
  }
  return face(out);
}

// ---- the chips: one stroke of the same picture, on 40 by 44 -------------------

const CHIPS = {
  'european-evolutions': () => chip(`<polygon points='0,0 20,0 0,26' fill='#D61CC7' opacity='.7'/>` + ribbon('M40 6C26 12 12 26 8 44', [['#2AAAF4', 5, 0.45], ['#BFE8FF', 1.2, 0.9]])),
  'game-changers': () => chip(line(35, 6, 12, 15, '#D4B959', 1.6) + head(9, 16.2, 159, 7, '#D4B959') + ring(32, 35, 3, '#D4B959', 1.4) + cross(8, 33, 2.4, '#D4B959', 1.3)),
  harvest: () => chip([0, 1, 2, 3].map((i) => { const x = 23 + i * 4.2, y = 13 - i * 3.2; return `<ellipse cx='${x - 1.6}' cy='${y - 1.8}' rx='3' ry='1.3' transform='rotate(-70 ${x - 1.6} ${y - 1.8})' fill='#F1D954'/><ellipse cx='${x + 1.9}' cy='${y + 1.3}' rx='3' ry='1.3' transform='rotate(-5 ${x + 1.9} ${y + 1.3})' fill='#E6B62B'/>`; }).join('') + line(14, 20, 23, 13, '#B4904A', 1)),
  mavericks: () => chip(`<polygon points='0,0 24,0 0,28' fill='#52575C' opacity='.55'/>` + line(0, 28, 24, 0, '#6A7078', 1) + line(27, 44, 31, 37, '#A98727', 2.6) + line(32, 44, 36, 37, '#A98727', 2.6) + line(37, 44, 41, 37, '#A98727', 2.6)),
  'most-wanted': () => chip(`<defs><linearGradient id='g' x1='0' y1='0' x2='0' y2='1'><stop offset='0' stop-color='#F3245E'/><stop offset='.5' stop-color='#96276C'/><stop offset='.8' stop-color='#240D4D'/></linearGradient></defs><rect width='40' height='44' fill='url(#g)' opacity='.9'/><circle cx='30' cy='11' r='6.5' fill='#F8C8C2'/><rect x='23' y='11.5' width='14' height='1.3' fill='#E12D67'/><rect x='23' y='14.5' width='14' height='1.8' fill='#E12D67'/>`),
  'new-season': () => chip(`<polygon points='19,0 40,0 40,24 34,13 31,15 27,6 24,8' fill='#E2C791'/>` + line(15, 0, 40, 30, '#E2C791', 0.9, 0.7)),
  screamers: () => chip(`<rect width='40' height='44' fill='#4A34DC' opacity='.35'/>` + ribbon('M42 32C30 28 36 16 26 11C18 7 12 13 17 17', [['#1E8D8A', 5.5, 0.6], ['#0CBF93', 2, 0.95]])),
  shapeshifters: () => chip([[0, 6, '#3D3B7A', 0, 44], [6, 5, '#1C8577', 8, 30], [11, 7, '#23235E', 0, 44], [18, 4, '#1C6971', 0, 26], [22, 6, '#3D3B7A', 14, 30], [28, 5, '#115663', 0, 44], [33, 7, '#1C8577', 20, 24]].map(([x, w, c, y, h]) => `<rect x='${x}' y='${y}' width='${w}' height='${h}' fill='${c}' opacity='.9'/>`).join('')),
  'super-heroes': () => chip(`<circle cx='20' cy='24' r='15' fill='#2A8BBD' opacity='.35'/>` + Array.from({ length: 12 }, (_, i) => { const p = (d) => [20 + Math.cos((d * Math.PI) / 180) * 40, 24 + Math.sin((d * Math.PI) / 180) * 40]; return `<polygon points='${pts([[20, 24], p(i * 30 + 6), p(i * 30 + 18)])}' fill='#2A8BBD' opacity='.5'/>`; }).join('')),
  'team-of-the-week': () => chip(`<polygon points='16,22 30,6 40,6 26,22 40,38 30,38' fill='#F6D911' opacity='.5'/><polygon points='16,22 30,6 40,6 26,22 40,38 30,38' fill='none' stroke='#FEFD37' stroke-width='1' opacity='.9'/>`),
  'transfer-stars': () => chip([[2, 42, 14, 26, 3, '#015B5F'], [8, 44, 18, 31, 2, '#02A99C'], [24, 14, 36, 0, 4, '#015B5F'], [29, 16, 39, 4, 1.6, '#01D8C5']].map(([a, b, c, d, w, col]) => line(a, b, c, d, col, w, 0.9)).join('') + head(39.5, 3.4, -50, 6, '#01D8C5')),
  'weekend-league': () => chip(`<path d='M31 0L25 11L29 17L19 27L22 33L13 44' fill='none' stroke='#46A54F' stroke-width='6' opacity='.3'/><path d='M31 0L25 11L29 17L19 27L22 33L13 44' fill='none' stroke='#77BF60' stroke-width='2.2'/>`),
  veterans: () => chip([-1, 1].map((s) => [0, 1, 2, 3].map((i) => { const deg = 90 + s * (30 + i * 26), a = (deg * Math.PI) / 180, x = 20 + Math.cos(a) * 15.5, y = 22 + Math.sin(a) * 16.5; return `<ellipse cx='${r1(x)}' cy='${r1(y)}' rx='4' ry='1.7' transform='rotate(${r1(deg + s * 62)} ${r1(x)} ${r1(y)})' fill='#DBAF72'/>`; }).join('')).join('')),
};

// ---- the sets ---------------------------------------------------------------
// base: the face's ground, as the card runs top to bottom in the game.
// rim: the frame, light to dark the way the game's frame catches light.
// ink: the numerals. shade: how far the foot of the face is darkened for them.
export const SETS = [
  { id: 'european-evolutions', art: europeanEvolutions, base: 'linear-gradient(118deg, #62065D 0%, #400151 26%, #140B58 48%, #0B3788 70%, #002352 100%)', rim: 'linear-gradient(100deg, #D61CC7 0%, #F8E2FA 28%, #5A0068 50%, #2AAAF4 76%, #BFE8FF 100%)' },
  { id: 'game-changers', art: gameChangers, base: 'radial-gradient(120% 80% at 40% 28%, #057C45 0%, #046741 34%, #07382D 100%)', rim: 'linear-gradient(160deg, #EEF9DC 0%, #D4B959 30%, #94A430 62%, #CAF297 100%)' },
  { id: 'harvest', art: harvest, base: 'linear-gradient(172deg, #2C2719 0%, #675523 18%, #A97D21 36%, #905D1E 50%, #44230D 72%, #2D1A0C 100%)', rim: 'linear-gradient(170deg, #FCF2BB 0%, #B4904A 40%, #4F3F1C 72%, #B4904A 100%)' },
  { id: 'mavericks', art: mavericks, base: 'linear-gradient(180deg, #5E646A 0%, #41464A 40%, #222425 75%, #1F2122 100%)', rim: 'linear-gradient(135deg, #D8C3B3 0%, #676668 26%, #303335 52%, #676668 78%, #484C52 100%)' },
  { id: 'most-wanted', art: mostWanted, base: 'linear-gradient(180deg, #F3245E 0%, #F05A63 22%, #E12D67 44%, #96276C 54%, #591259 62%, #240D4D 74%, #0B093B 88%, #07072D 100%)', rim: 'linear-gradient(180deg, #E29BAE 0%, #D44260 46%, #290E36 100%)' },
  { id: 'new-season', chipOnly: true },
  { id: 'screamers', art: screamers, base: 'linear-gradient(180deg, #031D60 0%, #142A61 25%, #3A4F9F 45%, #4733C1 68%, #3A2E92 82%, #211F39 100%)', rim: 'linear-gradient(160deg, #B0A4BE 0%, #44546E 40%, #211F39 72%, #0CBF93 100%)' },
  { id: 'shapeshifters', art: shapeshifters, base: '#23235E', rim: 'linear-gradient(120deg, #D0DCE0 0%, #9FB2BA 30%, #2ADB9F 55%, #226A66 76%, #D0DCE0 100%)' },
  { id: 'super-heroes', art: superHeroes, base: 'radial-gradient(90% 70% at 50% 55%, #2A8BBD 0%, #2379B5 22%, #1A508D 55%, #0B2144 100%)', rim: 'linear-gradient(135deg, #F7F7F7 0%, #9E9E9E 30%, #000000 55%, #9E9E9E 78%, #F7F7F7 100%)' },
  { id: 'team-of-the-week', art: teamOfTheWeek, base: 'linear-gradient(180deg, #7C7474 0%, #41331D 30%, #262315 60%, #130C07 100%)', rim: 'linear-gradient(150deg, #F2E036 0%, #826E2B 36%, #342102 62%, #F2E036 92%)' },
  { id: 'transfer-stars', art: transferStars, base: 'linear-gradient(160deg, #00101E 0%, #011F35 40%, #012A34 70%, #00101E 100%)', rim: 'linear-gradient(140deg, #76E2E6 0%, #16B8CD 40%, #021417 72%, #16B8CD 100%)' },
  { id: 'veterans', art: veterans, base: 'linear-gradient(165deg, #EBDFD3 0%, #E5D5C7 40%, #D3BDA8 75%, #E9DDD6 100%)', rim: 'linear-gradient(150deg, #FAEAD2 0%, #E3BC8E 25%, #9E744C 55%, #C89B6C 80%, #FAEAD2 100%)', ink: 'var(--ufm-ink-card)', shade: 0 },
  { id: 'weekend-league', art: weekendLeague, base: 'linear-gradient(180deg, #7E928A 0%, #435352 14%, #1D2F28 34%, #101B17 55%, #010202 80%)', rim: 'linear-gradient(160deg, #BCDD95 0%, #7DA054 30%, #202E28 56%, #0D1610 76%, #7DA054 100%)' },
];

export function stylesheet() {
  const out = [`/* ============================================================
   UFMWiz special sets
   Written by the set drawing tool: change a set there, not here.
   One card face and one chip motif for each special set the
   game's rarity filter lists. The drawings are ours, in colours
   measured from the set's own card; none of the game's art is
   here. A chip keeps its measured fill and rim under the motif.
   ============================================================ */

.ucard--set { --cink: #FFFFFF; --set-shade: .5; background: var(--set-rim); }

.ucard--set .ucard__face { inset: 2.6%; background: var(--set-art) center / 100% 100% no-repeat, var(--set-base); }

.ucard--set .ucard__face::before { background: linear-gradient(118deg, rgba(255,255,255,.2) 0 10%, rgba(255,255,255,0) 26%); }

/* the foot of the face darkens under the name and the stats */
.ucard--set .ucard__face::after {
  content: ""; position: absolute; inset: 0; pointer-events: none;
  background: linear-gradient(180deg, rgba(0,0,0,0) 44%, rgba(0,0,0,var(--set-shade)) 78%);
}

.ucard--set .ucard__ovr, .ucard--set .ucard__name, .ucard--set .ucard__stats { z-index: 1; }

.hexchip[class*="hexchip--set-"] > i { background: var(--set-chip) center / 100% 100% no-repeat, var(--fill); text-shadow: 0 1px 2px rgba(0,0,0,.7); }

.rchip[class*="rchip--set-"] i { background: var(--set-chip) center / 100% 100% no-repeat, var(--fill); }
`];
  for (const s of SETS) {
    if (!s.chipOnly) {
      out.push(`.ucard--set-${s.id} {\n  --set-base: ${s.base};\n  --set-rim: ${s.rim};${s.ink ? `\n  --cink: ${s.ink};` : ''}${s.shade !== undefined ? `\n  --set-shade: ${s.shade};` : ''}\n  --set-art: ${s.art()};\n}\n`);
    }
    out.push(`.hexchip--set-${s.id}, .rchip--set-${s.id} { --set-chip: ${CHIPS[s.id]()}; }\n`);
  }
  return out.join('\n');
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const css = stylesheet();
  if (process.argv.includes('--check')) {
    let stale = false;
    for (const p of OUT) if ((await readFile(p, 'utf8').catch(() => '')) !== css) { console.error(`make-sets: ${p} is out of date. Run node tools/make-sets.mjs`); stale = true; }
    if (stale) process.exit(1);
    console.log('make-sets: the set stylesheets are up to date');
  } else {
    for (const p of OUT) await writeFile(p, css);
    console.log(`make-sets: ${SETS.length} sets, ${(css.length / 1024).toFixed(1)} KB`);
  }
}
