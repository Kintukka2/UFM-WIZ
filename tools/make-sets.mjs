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
// A soft blur, for light: glows, mist and haze.
const GLOW = `<filter id='b' x='-30%' y='-30%' width='160%' height='160%'><feGaussianBlur stdDeviation='16'/></filter>`;
const ring = (x, y, r, c, w, o = 1) => `<circle cx='${x}' cy='${y}' r='${r}' fill='none' stroke='${c}' stroke-width='${w}' opacity='${o}'/>`;

// ---- the drawings ------------------------------------------------------------

function europeanEvolutions() {
  const blue = 'M700 150C440 230 250 470 140 900', blue2 = 'M700 330C480 390 340 580 300 900', blue3 = 'M700 20C520 60 400 150 330 260';
  const pink = 'M-40 470C40 280 230 100 480 -40', pink2 = 'M-40 640C10 420 150 230 330 110', cross = 'M-40 760C160 700 420 560 700 520';
  return face(
    GLOW
    + `<g filter='url(#b)'>${ribbon(pink, [['#BF10BB', 90, 0.5]])}${ribbon(blue, [['#0000D1', 120, 0.55]])}${ribbon(blue2, [['#2074D8', 60, 0.4]])}</g>`
    + ribbon(pink, [['#BF10BB', 44, 0.35], ['#E479DD', 9, 0.55], ['#F8E2FA', 2.5, 0.95]])
    + ribbon(pink2, [['#BF10BB', 60, 0.22], ['#E479DD', 4, 0.5], ['#F8E2FA', 1.5, 0.7]])
    + ribbon(blue, [['#0F58CB', 60, 0.35], ['#2AAAF4', 12, 0.5], ['#BFE8FF', 3, 0.95]])
    + ribbon(blue2, [['#0F58CB', 50, 0.3], ['#2AAAF4', 5, 0.6], ['#BFE8FF', 1.5, 0.8]])
    + ribbon(blue3, [['#2AAAF4', 30, 0.25], ['#BFE8FF', 2, 0.75]])
    + ribbon(cross, [['#2074D8', 26, 0.2], ['#BFE8FF', 1.5, 0.55]]),
  );
}

function gameChangers() {
  const gold = '#D4B959', pale = '#F2EAA9', green = '#519E5A';
  return face(
    GLOW
    // the light across the board
    + `<g filter='url(#b)'><path d='M-40 250L700 40L700 190L-40 430Z' fill='${green}' opacity='.4'/><path d='M-40 640L700 380L700 470L-40 760Z' fill='${green}' opacity='.25'/></g>`
    // marked runs
    + ribbon('M585 105C470 160 340 235 235 300', [[gold, 12, 1], [pale, 3, 0.9]]) + head(212, 314, 150, 62, gold)
    + line(585, 105, 425, 430, gold, 6, 0.9) + line(585, 105, 425, 430, pale, 1.5, 0.8)
    + ribbon('M70 440Q170 300 240 205', [[gold, 7, 0.9], [pale, 1.5, 0.7]])
    + ribbon('M150 470L400 405', [[green, 8, 0.7]]) + head(416, 400, -15, 40, green, 0.7)
    + ribbon('M470 760L575 640', [[gold, 6, 0.85]]) + head(586, 628, -49, 40, gold, 0.95)
    // the pieces
    + cross(432, 92, 18, gold, 7) + cross(205, 250, 13, gold, 6, 0.95) + cross(520, 345, 16, green, 7, 0.8) + cross(150, 600, 18, green, 7, 0.55)
    + ring(510, 250, 19, gold, 7) + ring(72, 330, 17, gold, 6, 0.95) + ring(560, 570, 20, green, 7, 0.65) + ring(95, 690, 17, gold, 6, 0.85) + ring(330, 80, 16, green, 6, 0.6),
  );
}

function harvest() {
  const rand = rng(11);
  let out = GLOW;
  // the low sun behind the sheaf
  out += `<g filter='url(#b)'><ellipse cx='390' cy='320' rx='330' ry='80' transform='rotate(-20 390 320)' fill='#EDC738' opacity='.55'/><ellipse cx='330' cy='400' rx='300' ry='26' fill='#EDC738' opacity='.5'/></g>`;
  out += `<path d='M0 398L640 398' stroke='#EDC738' stroke-width='2' opacity='.6'/>`;
  // fallen leaves along the sheaf
  const leaf = (x, y, len, deg, c) => `<g transform='translate(${x} ${y}) rotate(${deg})'><path d='M${-len} 0Q0 ${-len * 0.42} ${len} 0Q0 ${len * 0.42} ${-len} 0Z' fill='${c}'/><path d='M${-len} 0L${len} 0' stroke='#47340E' stroke-width='1.5' opacity='.6'/></g>`;
  [[150, 430, 44, -30, '#8A5C12'], [215, 372, 38, -52, '#E6B628'], [290, 420, 46, -12, '#6A3C13'], [370, 352, 40, -44, '#8A5C12'], [455, 300, 46, -24, '#E6B628'], [520, 232, 38, -58, '#6A3C13'], [585, 196, 40, -30, '#8A5C12'], [240, 300, 30, -70, '#9A6C24']]
    .forEach((l) => { out += leaf(...l); });
  // chaff on the wind
  for (const [c, o] of [['#E6B62B', 0.5], ['#F1D954', 0.85]]) {
    out += `<g fill='${c}' opacity='${o}'>`;
    for (let i = 0; i < 30; i++) out += `<circle cx='${Math.round(100 + rand() * 540)}' cy='${Math.round(70 + rand() * 400)}' r='${r1(1 + rand() * 2.8)}'/>`;
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
  out += ear(250, 380, 560, 150, 9, 32) + ear(330, 430, 612, 296, 7, 23) + ear(170, 300, 400, 110, 7, 21);
  return face(out);
}

function mavericks() {
  const seam = (x1, y1, x2, y2) => line(x1, y1, x2, y2, '#18191A', 6, 0.9) + line(x1 + 3, y1 - 3, x2 + 3, y2 - 3, '#61676C', 1.5, 0.8);
  const glint = (x1, y1, x2, y2) => line(x1, y1, x2, y2, '#EABC4C', 3.5, 0.95);
  const star = (cx, cy, R) => `<polygon points='${pts(Array.from({ length: 10 }, (_, i) => { const a = (-90 + i * 36) * Math.PI / 180, r = i % 2 ? R * 0.42 : R; return [cx + Math.cos(a) * r, cy + Math.sin(a) * r]; }))}' fill='#C0BFBF'/>`;
  return face(
    // brushed steel, grain running two ways
    `<defs><pattern id='g' width='7' height='7' patternUnits='userSpaceOnUse' patternTransform='rotate(-52)'><path d='M0 1H7' stroke='#61676C' stroke-width='.8' opacity='.5'/><path d='M0 4.5H7' stroke='#18191A' stroke-width='.8' opacity='.5'/></pattern><pattern id='h' width='7' height='7' patternUnits='userSpaceOnUse' patternTransform='rotate(52)'><path d='M0 1H7' stroke='#61676C' stroke-width='.8' opacity='.45'/><path d='M0 4.5H7' stroke='#18191A' stroke-width='.8' opacity='.5'/></pattern></defs>`
    + `<polygon points='0,0 320,0 320,330 0,640' fill='url(#g)'/><polygon points='640,0 320,0 320,330 640,640' fill='url(#h)'/><polygon points='0,640 320,330 640,640 640,854 0,854' fill='url(#g)' opacity='.7'/>`
    // plates, each caught by the light a little differently
    + `<polygon points='0,0 330,0 0,400' fill='#61676C' opacity='.3'/><polygon points='640,0 640,330 330,0' fill='#18191A' opacity='.3'/>`
    + `<polygon points='320,300 560,560 320,820 80,560' fill='#4C5157' opacity='.3'/><polygon points='0,560 220,854 0,854' fill='#61676C' opacity='.2'/>`
    + seam(0, 400, 330, 0) + seam(330, 0, 640, 330) + seam(80, 560, 320, 300) + seam(320, 300, 560, 560) + seam(0, 480, 300, 854) + seam(640, 480, 340, 854)
    // edges catching yellow light
    + glint(26, 260, 190, 60) + glint(26, 300, 110, 196) + glint(614, 560, 470, 740) + glint(614, 520, 540, 612) + glint(40, 640, 150, 778)
    + star(320, 80, 30) + line(236, 80, 276, 80, '#C0BFBF', 5, 0.85) + line(364, 80, 404, 80, '#C0BFBF', 5, 0.85) + line(256, 94, 280, 94, '#C0BFBF', 3, 0.6) + line(360, 94, 384, 94, '#C0BFBF', 3, 0.6),
  );
}

// Mavericks is the one set whose frame is drawn too: warning stripes on the
// shoulders and the waist of a heavier steel frame.
function mavericksFrame() {
  const bars = (x0, y0, x1, y1) => {
    let s = `<clipPath id='c${x0}${y0}'><rect x='${x0}' y='${y0}' width='${x1 - x0}' height='${y1 - y0}'/></clipPath><g clip-path='url(#c${x0}${y0})'><rect x='${x0}' y='${y0}' width='${x1 - x0}' height='${y1 - y0}' fill='#18191A'/>`;
    for (let x = x0 - (y1 - y0); x < x1; x += 34) s += `<polygon points='${pts([[x, y1], [x + 17, y1], [x + 17 + (y1 - y0), y0], [x + (y1 - y0), y0]])}' fill='#EABC4C'/>`;
    return s + '</g>';
  };
  return face(bars(20, 30, 190, 130) + bars(450, 30, 620, 130) + bars(0, 590, 70, 720) + bars(570, 590, 640, 720));
}

function mostWanted() {
  const rand = rng(5);
  const sx = 410, sy = 300, sr = 146, shore = 462;
  // the sun, then the sky cut back through its lower half in widening bands
  let sun = `${GLOW}<defs><linearGradient id='s' x1='0' y1='0' x2='0' y2='1'><stop offset='0' stop-color='#FCE5E7'/><stop offset='.5' stop-color='#F8C8C2'/><stop offset='1' stop-color='#F05A63'/></linearGradient><clipPath id='c'><circle cx='${sx}' cy='${sy}' r='${sr}'/></clipPath></defs><circle cx='${sx}' cy='${sy}' r='${sr + 40}' fill='#F8C8C2' opacity='.35' filter='url(#b)'/><circle cx='${sx}' cy='${sy}' r='${sr}' fill='url(#s)'/>`;
  for (let i = 0; i < 6; i++) sun += `<rect x='${sx - sr}' y='${sy + 8 + i * 23}' width='${sr * 2}' height='${4 + i * 2.6}' fill='#E12D67' clip-path='url(#c)'/>`;
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
  return face(sun + city + water + palm(40, 720, 70, 250, 0.8) + palm(118, 700, 170, 170, 1) + palm(640, 640, 610, 250, 0.7));
}

function screamers() {
  // a pitch at night: a goal, graves and bare spires against the glow
  const dark = '#211F39', hill = '#362058';
  let yard = `<path d='M0 700Q160 640 330 676T640 650L640 854L0 854Z' fill='${hill}'/>`;
  yard += `<path d='M52 690L52 600L150 588L150 676' fill='none' stroke='${dark}' stroke-width='7'/><path d='M52 600L150 588' stroke='${dark}' stroke-width='7'/>`;
  for (const [x, y, s] of [[214, 668, 1], [262, 676, 0.75], [596, 650, 0.9]]) yard += `<path d='M${x} ${y}V${y - 46 * s}M${x - 13 * s} ${y - 32 * s}H${x + 13 * s}' stroke='${dark}' stroke-width='${7 * s}' fill='none'/>`;
  for (const [x, w, h] of [[330, 26, 120], [366, 20, 84], [392, 30, 150], [434, 18, 70]]) yard += `<polygon points='${pts([[x, 680], [x, 680 - h * 0.7], [x + w / 2, 680 - h], [x + w, 680 - h * 0.7], [x + w, 680]])}' fill='${dark}'/>`;
  yard += `<path d='M500 676V590M500 630L474 600M500 612L530 578M500 650L522 628' stroke='${dark}' stroke-width='6' fill='none' stroke-linecap='round'/>`;
  // the ghost: a hooded head top right, an arm reaching left, a ragged tail down the side
  const body = 'M452 196C440 120 500 78 556 104C616 132 628 214 598 276C580 316 612 372 590 448C572 512 614 560 588 630C576 664 600 690 580 730L560 700L548 770L522 728L506 810L484 760L452 870L436 800C470 730 494 690 486 630C478 560 436 520 446 446C452 392 420 366 392 384C356 408 312 396 262 336C318 352 356 326 380 292C402 262 460 250 452 196Z';
  const wisp = (d, w) => ribbon(d, [['#125967', w, 0.7], ['#0BAF8A', w * 0.4, 0.85], ['#2DB797', 2.5, 0.9]]);
  return face(
    GLOW
    + `<defs><linearGradient id='g' x1='.6' y1='0' x2='.4' y2='1'><stop offset='0' stop-color='#2DB797'/><stop offset='.3' stop-color='#0BAF8A'/><stop offset='.7' stop-color='#125967'/><stop offset='1' stop-color='#125967' stop-opacity='.15'/></linearGradient></defs>`
    + `<g fill='#B0A4BE'>${[[90, 70, 2], [210, 44, 1.5], [330, 96, 2], [250, 170, 1.4], [70, 210, 1.6], [380, 40, 1.4]].map(([x, y, r]) => `<circle cx='${x}' cy='${y}' r='${r}' opacity='.8'/>`).join('')}</g>`
    + `<ellipse cx='320' cy='640' rx='380' ry='70' fill='#4A34E2' opacity='.55' filter='url(#b)'/>` + yard
    + `<path d='${body}' fill='#0BAF8A' opacity='.6' filter='url(#b)'/><path d='${body}' fill='url(#g)' opacity='.82'/>`
    // folds in the cloth, dark and light
    + ribbon('M566 300C546 380 572 450 554 540C544 590 566 640 548 700', [['#04241B', 7, 0.4]])
    + ribbon('M516 300C494 390 520 470 488 560C478 600 500 650 486 720', [['#04241B', 5, 0.3]])
    + ribbon('M470 330C458 380 474 430 462 470', [['#2DB797', 3, 0.7]]) + ribbon('M540 110C580 120 604 170 598 220', [['#2DB797', 3, 0.7]])
    // mist coming off it
    + wisp('M262 336C200 300 150 334 110 300C74 270 92 212 134 204C170 198 186 236 160 250', 20)
    + wisp('M600 150C650 110 650 40 600 0', 26) + wisp('M452 860C400 800 320 824 296 772C278 736 310 706 336 726', 18)
    + wisp('M-30 520C40 500 30 430 90 420C130 414 140 452 116 464', 14) + wisp('M452 196C420 150 440 96 400 70', 12)
    // the face: hollow sockets with a light in each, and a torn mouth
    + `<polygon points='476,168 524,186 516,206 482,196' fill='#04241B'/><polygon points='588,176 542,190 548,210 582,202' fill='#04241B'/>`
    + `<polygon points='490,180 514,190 510,198 492,192' fill='#2DB797'/><polygon points='576,186 552,194 554,202 574,198' fill='#2DB797'/>`
    + `<path d='M492 238L508 230L518 244L530 228L542 244L554 230L572 240L560 296L546 276L532 304L520 276L506 296Z' fill='#04241B'/>`,
  );
}

function shapeshifters() {
  const rand = rng(8);
  const tones = ['#3D3B7A', '#113D5A', '#23235E', '#2C5375', '#115663', '#1C8577', '#1C6971', '#442E80', '#291C5B'];
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
  // a glow moving behind the glass
  out += `${GLOW}<g filter='url(#b)'><ellipse cx='150' cy='300' rx='110' ry='260' fill='#1C8577' opacity='.5'/><ellipse cx='470' cy='200' rx='90' ry='220' fill='#442E80' opacity='.55'/><ellipse cx='560' cy='560' rx='90' ry='200' fill='#2ADB9F' opacity='.28'/></g>`;
  return face(out);
}

function superHeroes() {
  const rand = rng(21);
  const cx = 320, cy = 470, far = 900;
  let out = '', a = rand() * 6;
  while (a < 360) {
    const w = 2 + rand() * 9, light = rand() < 0.5;
    const p = (deg) => [cx + Math.cos((deg * Math.PI) / 180) * far, cy + Math.sin((deg * Math.PI) / 180) * far];
    out += `<polygon points='${pts([[cx, cy], p(a), p(a + w)])}' fill='${light ? '#8F9BC2' : '#0B2144'}' opacity='${r1(light ? 0.12 + rand() * 0.2 : 0.16 + rand() * 0.24)}'/>`;
    a += w + rand() * 5;
  }
  // the flash at the centre
  out += `${GLOW}<circle cx='${cx}' cy='${cy}' r='130' fill='#3493B8' opacity='.8' filter='url(#b)'/><circle cx='${cx}' cy='${cy}' r='46' fill='#F7F7F7' opacity='.55' filter='url(#b)'/>`;
  out += line(cx - 300, cy, cx + 300, cy, '#F7F7F7', 1.5, 0.45) + line(cx - 170, cy - 250, cx + 170, cy + 250, '#F7F7F7', 1.2, 0.3) + line(cx + 170, cy - 250, cx - 170, cy + 250, '#F7F7F7', 1.2, 0.3);
  return face(out);
}

function teamOfTheWeek() {
  // a chevron cut from yellow plate, printed with a halftone, between steel
  const chevron = [[250, 378], [470, 232], [620, 232], [400, 378], [620, 524], [470, 524]];
  const top = [[330, 0], [640, 0], [640, 214], [486, 214], [356, 300], [260, 300], [400, 150]];
  const left = [[0, 300], [150, 300], [236, 378], [70, 620], [0, 620]];
  return face(
    `${GLOW}<defs><linearGradient id='y' x1='0' y1='0' x2='1' y2='1'><stop offset='0' stop-color='#FEFD37'/><stop offset='.5' stop-color='#E5E508'/><stop offset='.8' stop-color='#CAA408'/><stop offset='1' stop-color='#8C5A07'/></linearGradient>`
    + `<linearGradient id='t' x1='0' y1='0' x2='1' y2='1'><stop offset='0' stop-color='#B4B9C5'/><stop offset='.6' stop-color='#707480'/><stop offset='1' stop-color='#412D21'/></linearGradient>`
    + `<pattern id='h' width='13' height='13' patternUnits='userSpaceOnUse' patternTransform='rotate(45)'><circle cx='6.5' cy='6.5' r='3.1' fill='#130C07'/></pattern><linearGradient id='f' x1='0' y1='0' x2='1' y2='0'><stop offset='.3' stop-color='#fff' stop-opacity='0'/><stop offset='1' stop-color='#fff'/></linearGradient><mask id='m'><rect x='250' y='232' width='370' height='292' fill='url(#f)'/></mask>`
    + `<pattern id='w' width='5' height='5' patternUnits='userSpaceOnUse' patternTransform='rotate(-24)'><path d='M0 1H5' stroke='#130C07' stroke-width='.7' opacity='.35'/></pattern></defs>`
    // steel plates, brushed
    + `<polygon points='${pts(top)}' fill='url(#t)'/><polygon points='${pts(top)}' fill='url(#w)'/>`
    + `<polygon points='${pts(left)}' fill='#827F80' opacity='.5'/><polygon points='${pts(left)}' fill='url(#w)' opacity='.8'/>`
    + `<polygon points='0,854 0,700 150,560 300,760 420,620 640,854' fill='#130C07' opacity='.6'/>`
    // their edges lit from the yellow
    + `<path d='M640 214L486 214L356 300L260 300' fill='none' stroke='#FCD019' stroke-width='10' opacity='.5' filter='url(#b)'/><path d='M640 214L486 214L356 300L260 300' fill='none' stroke='#FCD019' stroke-width='3'/>`
    + `<path d='M150 300L236 378L70 620' fill='none' stroke='#FCD019' stroke-width='2' opacity='.8'/><path d='M0 700L150 560L300 760L420 620L640 854' fill='none' stroke='#B8A74C' stroke-width='2' opacity='.6'/>`
    + `<polygon points='${pts(chevron)}' fill='#FEFD37' opacity='.55' filter='url(#b)'/>`
    + `<polygon points='${pts(chevron)}' fill='url(#y)'/><polygon points='${pts(chevron)}' fill='url(#h)' mask='url(#m)' opacity='.34'/>`
    + `<polygon points='${pts(chevron)}' fill='none' stroke='#FEFD37' stroke-width='3' opacity='.9'/>`,
  );
}

function transferStars() {
  const rand = rng(14);
  const tones = [['#013648', 0.9], ['#015B5F', 0.85], ['#015B5F', 0.75], ['#02A99C', 0.75], ['#00CFC2', 0.8]];
  const ang = (-54 * Math.PI) / 180, ux = Math.cos(ang), uy = Math.sin(ang), nx = -uy, ny = ux;
  let strokes = '';
  // brush strokes thrown up the diagonal, ragged at both ends
  for (let i = 0; i < 40; i++) {
    const off = (rand() - 0.5) * 520, cx = 320 + nx * off + ux * (rand() - 0.5) * 500, cy = 427 + ny * off + uy * (rand() - 0.5) * 500;
    const len = 120 + rand() * 360, w = 6 + rand() * 40, [c, o] = tones[Math.floor(rand() ** 1.5 * tones.length)];
    const a = [cx - ux * len / 2, cy - uy * len / 2], b = [cx + ux * len / 2, cy + uy * len / 2];
    strokes += `<polygon points='${pts([[a[0] - nx * w / 2, a[1] - ny * w / 2], [b[0] - nx * w * 0.1, b[1] - ny * w * 0.1], [b[0] + ux * 26, b[1] + uy * 26], [b[0] + nx * w * 0.4, b[1] + ny * w * 0.4], [a[0] + nx * w / 2, a[1] + ny * w / 2], [a[0] - ux * 18, a[1] - uy * 18]])}' fill='${c}' opacity='${o}'/>`;
  }
  // the moves themselves
  const move = (d, hx, hy, deg, w, size, c) => `<path d='${d}' fill='none' stroke='${c}' stroke-width='${w}' stroke-linejoin='miter'/>` + head(hx, hy, deg, size, c);
  const moves = move('M236 520L420 300L392 372L592 150', 608, 132, -48, 9, 56, '#2BE6CA') + move('M60 290L150 176', 160, 164, -51, 6, 36, '#00CFC2') + move('M430 760L560 610', 572, 596, -49, 6, 36, '#00CFC2');
  return face(`${GLOW}<g filter='url(#b)' opacity='.6'>${line(100, 760, 560, 130, '#00CFC2', 90)}</g>` + strokes + `<g filter='url(#b)' opacity='.7'>${moves}</g>` + moves);
}

function weekendLeague() {
  const rand = rng(31);
  let out = GLOW;
  // the slab: a few flat faces, then hairline cracks
  out += `<polygon points='0,0 300,0 180,210 0,300' fill='#738284' opacity='.3'/><polygon points='300,0 640,0 640,120 420,260 180,210' fill='#424F52' opacity='.45'/><polygon points='0,300 180,210 420,260 240,520 0,600' fill='#172E1E' opacity='.5'/>`;
  for (let i = 0; i < 18; i++) {
    let x = rand() * W, y = rand() * 560, d = `M${r1(x)} ${r1(y)}`;
    for (let j = 0; j < 5; j++) { x += (rand() - 0.5) * 130; y += 20 + rand() * 70; d += `L${r1(x)} ${r1(y)}`; }
    out += `<path d='${d}' fill='none' stroke='${rand() < 0.5 ? '#424F52' : '#020405'}' stroke-width='${r1(1 + rand() * 1.8)}' opacity='.75'/>`;
  }
  // the break: a wide ragged band where the slab has split, lit from inside
  const spine = [];
  for (let i = 0; i <= 9; i++) spine.push([600 - 58 * i + (rand() - 0.5) * 50, 70 + 52 * i]);
  const edge = (side) => spine.map(([x, y], i) => { const w = (i === 0 || i === 9 ? 20 : 78 + (rand() - 0.5) * 30) * side; return [x + w, y + w * 0.62]; });
  const band = [...edge(-1), ...edge(1).reverse()];
  out += `<defs><linearGradient id='g' x1='1' y1='0' x2='0' y2='1'><stop offset='0' stop-color='#A2D177'/><stop offset='.45' stop-color='#77BF60'/><stop offset='.8' stop-color='#3A6E44'/><stop offset='1' stop-color='#08180C'/></linearGradient></defs>`;
  out += `<polygon points='${pts(band)}' fill='#77BF60' opacity='.6' filter='url(#b)'/><polygon points='${pts(band)}' fill='url(#g)'/>`;
  // darker and brighter patches inside it
  for (let i = 0; i < 16; i++) {
    const [x, y] = spine[1 + Math.floor(rand() * 8)], px = x + (rand() - 0.5) * 80, py = y + (rand() - 0.5) * 60, s = 10 + rand() * 26;
    out += `<polygon points='${pts([[px - s, py], [px - s * 0.2, py - s * 0.8], [px + s, py - s * 0.2], [px + s * 0.4, py + s * 0.8]])}' fill='${i % 3 ? '#3A6E44' : '#BCDD95'}' opacity='${i % 3 ? 0.55 : 0.5}'/>`;
  }
  // a bright vein down the middle, branching
  const d = (p) => 'M' + p.map(([x, y]) => `${r1(x)} ${r1(y)}`).join('L');
  const vein = spine.map(([x, y]) => [x + (rand() - 0.5) * 36, y + (rand() - 0.5) * 20]);
  out += `<path d='${d(vein)}' fill='none' stroke='#ABD470' stroke-width='5'/><path d='${d(vein)}' fill='none' stroke='#BCDD95' stroke-width='1.6'/>`;
  for (const i of [2, 4, 6]) {
    const [x, y] = vein[i], limb = [[x, y], [x - 50 + rand() * 20, y + 34], [x - 96, y + 40 + rand() * 30], [x - 150, y + 86]];
    out += `<path d='${d(limb)}' fill='none' stroke='#77BF60' stroke-width='3' opacity='.9'/>`;
  }
  // the stone on either side bites into the break in long teeth
  spine.slice(0, -1).forEach(([x, y], i) => {
    for (const side of [-1, 1]) {
      const reach = 70 + rand() * 50, depth = 26 + rand() * 46, wide = 16 + rand() * 22;
      const ox = x + side * reach, oy = y + side * reach * 0.62;
      out += `<polygon points='${pts([[ox - 29 - wide, oy + 26 + wide * 0.4], [ox + 29 + wide, oy - 26 - wide * 0.4], [ox - side * depth + (rand() - 0.5) * 20, oy - side * depth * 0.62]])}' fill='${(i + (side > 0 ? 1 : 0)) % 2 ? '#020405' : '#172E1E'}'/>`;
    }
  });
  out += `<g fill='#BCDD95'>`;
  for (let i = 0; i < 40; i++) {
    const [x, y] = spine[Math.floor(rand() * spine.length)];
    out += `<circle cx='${Math.round(x + (rand() - 0.5) * 300)}' cy='${Math.round(y + (rand() - 0.5) * 200)}' r='${r1(0.8 + rand() * 2.2)}' opacity='${r1(0.3 + rand() * 0.6)}'/>`;
  }
  return face(out + '</g>');
}

function veterans() {
  const rand = rng(44);
  let out = GLOW;
  // light pooling across the stone
  out += `<g filter='url(#b)'>${line(-40, 620, 300, 380, '#C8A080', 60, 0.5)}${line(380, 900, 700, 560, '#DBAF72', 70, 0.45)}${line(420, 120, 700, -40, '#DBAF72', 50, 0.4)}</g>`;
  // veins through the marble, each with a branch or two
  for (let i = 0; i < 11; i++) {
    let x = rand() * W, y = -20;
    const lean = (rand() - 0.5) * 170, run = [[x, y]];
    while (y < H + 20) { x += lean * 0.4 + (rand() - 0.5) * 100; y += 40 + rand() * 90; run.push([x, y]); }
    const c = ['#CE9C5B', '#B77941', '#946A44'][i % 3], d = (p) => 'M' + p.map(([a, b]) => `${r1(a)} ${r1(b)}`).join('L'), w = 1.4 + rand() * 3;
    out += `<path d='${d(run)}' fill='none' stroke='#FAEAD2' stroke-width='${r1(w + 7)}' opacity='.6' stroke-linejoin='round'/><path d='${d(run)}' fill='none' stroke='${c}' stroke-width='${r1(w)}' opacity='${r1(0.7 + rand() * 0.3)}' stroke-linejoin='round'/>`;
    for (let k = 0; k < 2; k++) {
      const [bx, by] = run[1 + Math.floor(rand() * (run.length - 2))], dir = rand() < 0.5 ? -1 : 1;
      out += `<path d='${d([[bx, by], [bx + dir * (30 + rand() * 40), by + 30 + rand() * 30], [bx + dir * (70 + rand() * 60), by + 50 + rand() * 60]])}' fill='none' stroke='${c}' stroke-width='${r1(w * 0.5)}' opacity='.7'/>`;
    }
  }
  // a medal: a bronze field in a gold ring, a laurel branch up each side, a stone at the centre
  const cx = 350, cy = 316;
  out += `<defs><linearGradient id='r' x1='0' y1='0' x2='1' y2='1'><stop offset='0' stop-color='#FAEAD2'/><stop offset='.35' stop-color='#CCB68C'/><stop offset='.7' stop-color='#946A44'/><stop offset='1' stop-color='#5D2E15'/></linearGradient><radialGradient id='d' cx='.5' cy='.45' r='.6'><stop offset='0' stop-color='#765132'/><stop offset='1' stop-color='#4E280E'/></radialGradient><radialGradient id='o' cx='.38' cy='.32' r='.8'><stop offset='0' stop-color='#EDE4DE'/><stop offset='.55' stop-color='#928478'/><stop offset='1' stop-color='#4F3C27'/></radialGradient></defs>`;
  out += `<circle cx='${cx}' cy='${cy + 8}' r='158' fill='#5D2E15' opacity='.35' filter='url(#b)'/>`;
  out += `<circle cx='${cx}' cy='${cy}' r='152' fill='url(#r)'/><circle cx='${cx}' cy='${cy}' r='134' fill='url(#d)'/><circle cx='${cx}' cy='${cy}' r='134' fill='none' stroke='#CCB68C' stroke-width='3'/><circle cx='${cx}' cy='${cy}' r='152' fill='none' stroke='#946A44' stroke-width='2'/>`;
  for (const side of [-1, 1]) {
    out += `<path d='M${cx} ${cy + 104}A104 104 0 0 ${side === 1 ? 0 : 1} ${r1(cx + side * 70)} ${r1(cy - 78)}' fill='none' stroke='#A89482' stroke-width='3.5'/>`;
    for (let i = 0; i < 8; i++) {
      const deg = 90 + side * (16 + i * 18.5), a = (deg * Math.PI) / 180, lx = cx + Math.cos(a) * 104, ly = cy + Math.sin(a) * 104;
      for (const inout of [-1, 1]) out += `<ellipse rx='${24 - i}' ry='${r1(8.5 - i * 0.3)}' transform='translate(${Math.round(lx)} ${Math.round(ly)}) rotate(${Math.round(deg + side * (90 + inout * 36))}) translate(${14 - i * 0.6} 0)' fill='${inout === 1 ? '#CCB68C' : '#A89482'}'/>`;
    }
  }
  out += `<circle cx='${cx}' cy='${cy}' r='66' fill='url(#o)'/><circle cx='${cx}' cy='${cy}' r='66' fill='none' stroke='#CCB68C' stroke-width='3'/>`;
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
// rim2: the frame's inner lip, when it isn't the rim again. frame: a drawing on
// the frame itself. inset and lip: a heavier frame than the others have.
export const SETS = [
  { id: 'european-evolutions', art: europeanEvolutions, base: 'linear-gradient(118deg, #BF10BB 0%, #62065D 16%, #4A0066 30%, #140B58 48%, #0000D1 66%, #004490 82%, #002352 100%)', rim: 'linear-gradient(100deg, #D61CC7 0%, #F8E2FA 28%, #5A0068 50%, #2AAAF4 76%, #BFE8FF 100%)' },
  { id: 'game-changers', art: gameChangers, base: 'radial-gradient(120% 80% at 40% 28%, #057C45 0%, #046741 34%, #07382D 100%)', rim: 'linear-gradient(160deg, #EEF9DC 0%, #D4B959 30%, #94A430 62%, #CAF297 100%)' },
  { id: 'harvest', art: harvest, base: 'linear-gradient(176deg, #2D4532 0%, #354E31 14%, #6A5A24 27%, #9A6C24 40%, #6A3C13 54%, #421E09 72%, #2C1C0E 100%)', rim: 'linear-gradient(170deg, #FCF2BB 0%, #B4904A 40%, #4F3F1C 72%, #B4904A 100%)' },
  { id: 'mavericks', art: mavericks, base: 'linear-gradient(180deg, #61676C 0%, #4C5157 30%, #393D41 60%, #1F2122 100%)', rim: 'linear-gradient(135deg, #C0BFBF 0%, #5F5F5F 22%, #323639 44%, #C0BFBF 60%, #5F5F5F 80%, #323639 100%)', frame: mavericksFrame, inset: '4.3%', lip: '1.7%' },
  { id: 'most-wanted', art: mostWanted, base: 'linear-gradient(180deg, #F3245E 0%, #F05A63 22%, #E12D67 44%, #96276C 54%, #591259 62%, #240D4D 74%, #0B093B 88%, #07072D 100%)', rim: 'linear-gradient(180deg, #E29BAE 0%, #D44260 46%, #290E36 100%)' },
  { id: 'new-season', chipOnly: true },
  { id: 'screamers', art: screamers, base: 'linear-gradient(180deg, #061B61 0%, #0F2270 22%, #3F2A9E 52%, #4A34E2 68%, #362058 84%, #211F39 100%)', rim: 'linear-gradient(160deg, #B0A4BE 0%, #44546E 35%, #211F39 62%, #0BAF8A 100%)' },
  { id: 'shapeshifters', art: shapeshifters, base: '#23235E', rim: 'linear-gradient(120deg, #D0DCE0 0%, #9FB2BA 30%, #2ADB9F 55%, #226A66 76%, #D0DCE0 100%)' },
  { id: 'super-heroes', art: superHeroes, base: 'radial-gradient(90% 70% at 50% 55%, #2A8BBD 0%, #2379B5 22%, #1A508D 55%, #0B2144 100%)', rim: 'linear-gradient(135deg, #F7F7F7 0%, #9E9E9E 28%, #353535 52%, #9E9E9E 76%, #F7F7F7 100%)', rim2: 'linear-gradient(135deg, #FEE061 0%, #FCD630 50%, #FEE061 100%)' },
  { id: 'team-of-the-week', art: teamOfTheWeek, base: 'linear-gradient(180deg, #412D21 0%, #262315 45%, #120904 100%)', rim: 'linear-gradient(150deg, #F2E036 0%, #FCD019 20%, #826E2B 42%, #342102 62%, #F2E036 92%)' },
  { id: 'transfer-stars', art: transferStars, base: 'linear-gradient(160deg, #00101E 0%, #011F35 40%, #012A34 70%, #00101E 100%)', rim: 'linear-gradient(140deg, #76E2E6 0%, #16B8CD 40%, #021417 72%, #16B8CD 100%)' },
  { id: 'veterans', art: veterans, base: 'linear-gradient(160deg, #EDE4DE 0%, #E6D9D1 35%, #DAC3B2 68%, #EBE0DC 100%)', rim: 'linear-gradient(150deg, #FAEAD2 0%, #E3BC8E 22%, #946A44 50%, #CCB68C 74%, #FAEAD2 100%)', ink: 'var(--ufm-ink-card)', shade: 0 },
  { id: 'weekend-league', art: weekendLeague, base: 'linear-gradient(180deg, #738284 0%, #424F52 12%, #172E1E 30%, #08170E 55%, #020405 78%, #000000 100%)', rim: 'linear-gradient(160deg, #BCDD95 0%, #7DA054 30%, #202E28 56%, #0D1610 76%, #7DA054 100%)' },
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

.ucard--set { --cink: #FFFFFF; --set-shade: .5; --set-inset: 3.2%; --set-lip: 1.3%; background: var(--set-rim); }

/* the frame's inner lip: the rim again, mirrored and in shadow, so the frame reads as bevelled */
.ucard--set::before {
  content: ""; position: absolute; inset: var(--set-lip); clip-path: inherit;
  background: var(--set-frame, none) center / 100% 100% no-repeat, var(--set-rim2, var(--set-rim));
  transform: scaleX(-1); filter: brightness(.74);
}

.ucard--set .ucard__face { inset: var(--set-inset); background: var(--set-art) center / 100% 100% no-repeat, var(--set-base); }

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
      out.push(`.ucard--set-${s.id} {\n  --set-base: ${s.base};\n  --set-rim: ${s.rim};${s.ink ? `\n  --cink: ${s.ink};` : ''}${s.shade !== undefined ? `\n  --set-shade: ${s.shade};` : ''}${s.rim2 ? `\n  --set-rim2: ${s.rim2};` : ''}${s.inset ? `\n  --set-inset: ${s.inset}; --set-lip: ${s.lip};` : ''}${s.frame ? `\n  --set-frame: ${s.frame()};` : ''}\n  --set-art: ${s.art()};\n}\n`);
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
