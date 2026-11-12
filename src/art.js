'use strict';
// Procedural art for the "Générique" page. Everything here is rendered to static inline SVG at build time.

function rng(seed) {
  let a = seed >>> 0;
  return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
}
const f = n => String(Math.round(n * 10) / 10);

/* ------------------------------------------------------------------ blossoms */
const PETAL = 'M0,0C-7.8,-3.4 -13,-12.2 -8.2,-18.6C-5.6,-21.9 -1.5,-21.7 0,-19.7C1.5,-21.7 5.6,-21.9 8.2,-18.6C13,-12.2 7.8,-3.4 0,0Z';

const PETAL_PTS = [[0, 0], [-7.8, -3.4], [-13, -12.2], [-8.2, -18.6], [-5.6, -21.9], [-1.5, -21.7], [0, -19.7], [1.5, -21.7], [5.6, -21.9], [8.2, -18.6], [13, -12.2], [7.8, -3.4], [0, 0]];
// one petal, rotated/scaled, as an absolute sub-path (lets a whole blossom be a single fill)
function petalD(deg, sx, sy) {
  const a = deg * Math.PI / 180, c = Math.cos(a), s = Math.sin(a);
  const q = PETAL_PTS.map(([x, y]) => { x *= sx; y *= sy; return f(x * c - y * s) + ',' + f(x * s + y * c); });
  return `M${q[0]}C${q[1]} ${q[2]} ${q[3]}C${q[4]} ${q[5]} ${q[6]}C${q[7]} ${q[8]} ${q[9]}C${q[10]} ${q[11]} ${q[12]}Z`;
}
function blossomDef(id, grad, seed, opts = {}) {
  const R = rng(seed);
  let d = '', cr = '';
  for (let k = 0; k < 5; k++) {
    const a = k * 72 + (R() - .5) * 11, sc = .93 + R() * .14, sx = sc * (.94 + R() * .12);
    d += petalD(a, sx, sc);
    const ca = (a - 90) * Math.PI / 180;
    cr += `M${f(Math.cos(ca) * 4)},${f(Math.sin(ca) * 4)}L${f(Math.cos(ca) * 12.5)},${f(Math.sin(ca) * 12.5)}`;
  }
  let s = `<g id="${id}"><path d="${d}" fill="url(#${grad})" stroke="${opts.edge || '#c98678'}" stroke-opacity=".3" stroke-width=".45"/>`;
  s += `<path d="${cr}" fill="none" stroke="${opts.crease || '#c9706c'}" stroke-opacity=".3" stroke-width=".5" stroke-linecap="round"/>`;
  if (!opts.plain) {
    let st = '', dots = '';
    const n = 9;
    for (let k = 0; k < n; k++) {
      const a = (k / n) * Math.PI * 2 + R() * .5, l = 4.2 + R() * 3.6, x = Math.cos(a) * l, y = Math.sin(a) * l, r = .75 + R() * .35;
      st += `M0,0L${f(x)},${f(y)}`;
      dots += `M${f(x - r)},${f(y)}a${f(r)},${f(r)} 0 1 0 ${f(r * 2)},0a${f(r)},${f(r)} 0 1 0 ${f(-r * 2)},0`;
    }
    s += `<path d="${st}" stroke="#b96a55" stroke-width=".42" stroke-opacity=".8" fill="none"/><path d="${dots}" fill="#f6cf8e"/><circle r="1.7" fill="#c0604c"/>`;
  } else {
    s += `<circle r="2.2" fill="#a9606a" fill-opacity=".8"/>`;
  }
  return s + '</g>';
}

function defs() {
  return `
<radialGradient id="gBl1" gradientUnits="userSpaceOnUse" cx="0" cy="0" r="21.5"><stop offset="0" stop-color="#e48c88"/><stop offset=".3" stop-color="#f3bfb2"/><stop offset=".72" stop-color="#fbe4d9"/><stop offset="1" stop-color="#fff7f0"/></radialGradient>
<radialGradient id="gBl2" gradientUnits="userSpaceOnUse" cx="0" cy="0" r="21.5"><stop offset="0" stop-color="#d87078"/><stop offset=".32" stop-color="#eda79d"/><stop offset=".78" stop-color="#f8d4c7"/><stop offset="1" stop-color="#fdebe0"/></radialGradient>
<radialGradient id="gBl3" gradientUnits="userSpaceOnUse" cx="0" cy="0" r="21.5"><stop offset="0" stop-color="#96606e"/><stop offset=".45" stop-color="#bb8a8e"/><stop offset="1" stop-color="#d9b3ab"/></radialGradient>
<linearGradient id="gBud" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#c9606a"/><stop offset="1" stop-color="#f4bcae"/></linearGradient>
${blossomDef('bl1', 'gBl1', 11)}
${blossomDef('bl2', 'gBl2', 23)}
${blossomDef('bl3', 'gBl1', 37)}
${blossomDef('blB', 'gBl3', 51, { plain: true, edge: '#7d5562', crease: '#7d5562' })}
<g id="bls">
  <path d="${petalD(-40, .86, .9)}${petalD(40, .86, .9)}" fill="url(#gBl2)" stroke="#c98678" stroke-opacity=".3" stroke-width=".45"/>
  <path d="${petalD(-2, 1, .96)}" fill="url(#gBl1)" stroke="#c98678" stroke-opacity=".3" stroke-width=".45"/>
  <path d="M0,2.4C-3.6,1.4 -5.2,-1.6 -4.6,-4.4C-2.8,-3.4 -1.2,-2.2 0,-.6C1.2,-2.2 2.8,-3.4 4.6,-4.4C5.2,-1.6 3.6,1.4 0,2.4Z" fill="#8a4b40"/>
</g>
<g id="bud">
  <path d="M0,0C-4.6,-2.6 -5.2,-9 0,-13.4C5.2,-9 4.6,-2.6 0,0Z" fill="url(#gBud)"/>
  <path d="M0,1.6C-3.8,.4 -4.8,-3.4 -3.4,-6.4C-2.4,-3.6 -1.2,-1.6 0,-.4C1.2,-1.6 2.4,-3.6 3.4,-6.4C4.8,-3.4 3.8,.4 0,1.6Z" fill="#8a4b40"/>
</g>
<g id="leafy">
  <path d="M0,0C-4.4,-4.4 -5,-11.6 0,-18C5,-11.6 4.4,-4.4 0,0Z" fill="#9b5a3c"/>
  <path d="M0,0C1.8,-5 2.4,-11.4 0,-18C5,-11.6 4.4,-4.4 0,0Z" fill="#c07a4c"/>
</g>`;
}

function limbPath(pts) {
  const L = [], Rr = [];
  for (const p of pts) { const nx = -Math.sin(p.a), ny = Math.cos(p.a); L.push(f(p.x + nx * p.w / 2) + ',' + f(p.y + ny * p.w / 2)); Rr.push(f(p.x - nx * p.w / 2) + ',' + f(p.y - ny * p.w / 2)); }
  return 'M' + L.join('L') + 'L' + Rr.reverse().join('L') + 'Z';
}

/**
 * A blossom branch growing from (0,0) toward `ang` (radians, screen coords).
 * Returns { svg, vb:[x,y,w,h], origin:[% x, % y] }.
 */
function branch(seed, o) {
  const R = rng(seed), limbs = [], spurs = [];
  const maxDepth = o.maxDepth ?? 2;
  function grow(x, y, ang, len, w0, depth, curl) {
    const step = 6, n = Math.max(5, Math.round(len / step)), pts = [];
    let a = ang, px = x, py = y;
    const w1 = depth >= 2 ? .8 : depth === 1 ? 1 : 1.6;
    for (let i = 0; i <= n; i++) {
      const t = i / n, w = w1 + (w0 - w1) * Math.pow(1 - t, 1.12);
      pts.push({ x: px, y: py, a, w, t });
      a += curl + (R() - .5) * .13; if (R() < .07) a += (R() - .5) * .42;
      px += Math.cos(a) * step; py += Math.sin(a) * step;
    }
    limbs.push({ pts, depth });
    if (depth < maxDepth) {
      const k = Math.max(1, Math.round(len / (depth === 0 ? o.branchEvery || 64 : 46) * (.8 + R() * .45)));
      let side = R() < .5 ? 1 : -1;
      for (let j = 0; j < k; j++) {
        const t = .2 + (j + R() * .7) / k * .72, p = pts[Math.min(n, Math.round(t * n))];
        side = -side;
        const da = side * (.5 + R() * .5);
        grow(p.x, p.y, p.a + da, len * (.36 + R() * .26) * (1 - t * .3), Math.max(1.5, p.w * .66), depth + 1, -da * .014 + (R() - .5) * .02);
      }
    }
    const from = depth === 0 ? (o.mainFrom ?? .5) : .22, spacing = depth === 0 ? 30 : 21;
    let d = spacing * (.4 + R());
    while (d < len - 6) { const t = d / len; if (t > from) { const p = pts[Math.min(n, Math.round(t * n))]; spurs.push({ x: p.x, y: p.y, a: p.a, tip: false }); } d += spacing * (.7 + R() * .8); }
    const e = pts[n]; spurs.push({ x: e.x, y: e.y, a: e.a, tip: true });
  }
  grow(0, 0, o.ang, o.len, o.w0, 0, o.curl || 0);

  let back = '', ped = '', front = '', leaves = '';
  let minX = 0, minY = 0, maxX = 0, maxY = 0;
  const ext = (x, y, r) => { minX = Math.min(minX, x - r); maxX = Math.max(maxX, x + r); minY = Math.min(minY, y - r); maxY = Math.max(maxY, y + r); };
  const density = o.density ?? 1;
  for (const s of spurs) {
    if (!s.tip && R() > density) continue;
    const n = s.tip ? 2 + Math.floor(R() * 1.7) : 1 + Math.floor(R() * 1.9);
    const sideSign = R() < .5 ? 1 : -1;
    for (let i = 0; i < n; i++) {
      const base = s.tip ? s.a + (R() - .5) * 2.3 : s.a + sideSign * (Math.PI / 2) + (R() - .5) * 1.5;
      const pl = 6 + R() * 10, x = s.x + Math.cos(base) * pl, y = s.y + Math.sin(base) * pl;
      const u = R(), sc = (.44 + Math.pow(R(), 1.4) * .5) * (o.flower || 1);
      const deg = base * 180 / Math.PI + 90;
      ped += `M${f(s.x)},${f(s.y)}Q${f(s.x + Math.cos(base + .5) * pl * .5)},${f(s.y + Math.sin(base + .5) * pl * .5)} ${f(x)},${f(y)}`;
      ext(x, y, 22 * sc);
      if (u < (s.tip ? .3 : .12)) {
        front += `<use href="#bud" transform="translate(${f(x)},${f(y)}) rotate(${f(deg + (R() - .5) * 30)}) scale(${f(sc * 110) / 100})"/>`;
      } else if (u < (s.tip ? .45 : .28)) {
        front += `<use href="#bls" transform="translate(${f(x)},${f(y)}) rotate(${f(deg + (R() - .5) * 40)}) scale(${f(sc * 100) / 100})"/>`;
      } else {
        const k = .66 + R() * .34, r1 = R() * 360, r2 = R() * 72;
        const isBack = R() < .24;
        const id = isBack ? 'blB' : ['bl1', 'bl2', 'bl3'][Math.floor(R() * 3)];
        const str = `<use href="#${id}" transform="translate(${f(x)},${f(y)}) rotate(${f(r1)}) scale(${f(sc * (isBack ? .86 : 1) * 100) / 100},${f(sc * k * (isBack ? .86 : 1) * 100) / 100}) rotate(${f(r2)})"/>`;
        if (isBack) back += str; else front += str;
      }
    }
    if (R() < .3) {
      const la = s.a + (R() < .5 ? 1 : -1) * (.6 + R() * .8);
      leaves += `<use href="#leafy" transform="translate(${f(s.x)},${f(s.y)}) rotate(${f(la * 180 / Math.PI + 90)}) scale(${f((.55 + R() * .5) * 100) / 100})"/>`;
    }
  }
  let wood = '', rim = '';
  limbs.sort((a, b) => a.depth - b.depth);
  for (const l of limbs) {
    for (const p of l.pts) ext(p.x, p.y, p.w);
    wood += limbPath(l.pts);
    // warm rim light on the side that faces the low sun (screen-down)
    const pts = l.pts.map(p => { const nx = -Math.sin(p.a), ny = Math.cos(p.a); const sgn = ny >= 0 ? 1 : -1; return f(p.x + sgn * nx * p.w * .3) + ',' + f(p.y + sgn * ny * p.w * .3); });
    rim += `<path d="M${pts.join('L')}" stroke-width="${f(Math.max(.5, l.pts[0].w * .2))}"/>`;
  }
  const pad = 6; minX -= pad; minY -= pad; maxX += pad; maxY += pad;
  const w = maxX - minX, h = maxY - minY;
  const inner = `<g>${back}</g><path d="${wood}" fill="${o.bark || '#33231f'}" stroke="${o.bark || '#33231f'}" stroke-width=".8" stroke-linejoin="round"/><g fill="none" stroke="#d99a72" stroke-opacity=".5" stroke-linecap="round" stroke-linejoin="round">${rim}</g><path d="${ped}" fill="none" stroke="#7d4f40" stroke-width=".8" stroke-linecap="round"/><g>${leaves}</g><g>${front}</g>`;
  const main = limbs.find(l => l.depth === 0).pts, pp = main[Math.round((o.perch ?? .3) * (main.length - 1))];
  return { inner, vb: [minX, minY, w, h].map(v => Math.round(v)), origin: [(-minX) / w * 100, (-minY) / h * 100], perch: { x: pp.x, y: pp.y - pp.w / 2 } };
}

/* ------------------------------------------------------------------ tulips */
const TULIP_COL = {
  cuivre: { d: '#7a2f1b', m: '#c8632f', l: '#f2ab6c', rim: '#ffd9a6', back: '#5f2414' },
  rose: { d: '#96474a', m: '#dc8a7c', l: '#f8cdbb', rim: '#fff0e6', back: '#7a3640' },
  creme: { d: '#b28763', m: '#ecd3b4', l: '#fff4e3', rim: '#ffffff', back: '#93694c' },
};
function tulipDefs() {
  let s = '';
  for (const [k, c] of Object.entries(TULIP_COL)) {
    s += `<linearGradient id="gT${k}" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="${c.d}"/><stop offset=".5" stop-color="${c.m}"/><stop offset="1" stop-color="${c.l}"/></linearGradient>`;
    s += `<linearGradient id="gTs${k}" x1="0" y1="1" x2=".25" y2="0"><stop offset="0" stop-color="${c.d}"/><stop offset=".62" stop-color="${c.m}"/><stop offset="1" stop-color="${c.l}" stop-opacity=".96"/></linearGradient>`;
    s += `<linearGradient id="gTb${k}" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="${c.back}"/><stop offset="1" stop-color="${c.m}"/></linearGradient>`;
  }
  s += `<linearGradient id="gStem" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#0b2f33"/><stop offset="1" stop-color="#2c7a68"/></linearGradient>`;
  s += `<linearGradient id="gLeafA" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#0a2c31"/><stop offset=".6" stop-color="#18605d"/><stop offset="1" stop-color="#3f9482"/></linearGradient>`;
  s += `<linearGradient id="gLeafB" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#07242a"/><stop offset=".7" stop-color="#0f4a4c"/><stop offset="1" stop-color="#236e66"/></linearGradient>`;
  return s;
}

// A leaf blade as two halves along a curved midrib (gives the fold / twist).
function blade(R, x0, y0, ang, len, width, curl) {
  const n = 16, cl = [];
  let a = ang, px = x0, py = y0;
  const step = len / n;
  for (let i = 0; i <= n; i++) { cl.push({ x: px, y: py, a }); a += curl / n * (0.15 + 2.2 * Math.pow(i / n, 1.6)); px += Math.cos(a) * step; py += Math.sin(a) * step; }
  const prof = t => Math.pow(Math.sin(Math.PI * Math.pow(t, .7)), .8) * (1 - t * .1);
  const L = [], Rr = [], C = [];
  cl.forEach((p, i) => { const t = i / n, w = width * prof(t) * .5 + (t < .08 ? 1.6 : 0); const nx = -Math.sin(p.a), ny = Math.cos(p.a); L.push(f(p.x + nx * w) + ',' + f(p.y + ny * w)); Rr.push(f(p.x - nx * w * .92) + ',' + f(p.y - ny * w * .92)); C.push(f(p.x) + ',' + f(p.y)); });
  const half1 = 'M' + L.join('L') + 'L' + C.slice().reverse().join('L') + 'Z';
  const half2 = 'M' + Rr.join('L') + 'L' + C.slice().reverse().join('L') + 'Z';
  return { half1, half2, mid: 'M' + C.join('L'), tip: cl[n] };
}

/**
 * One tulip in a 200 x H box, stem base at (100, H).
 */
function tulip(seed, o) {
  const R = rng(seed), H = o.h || 460, col = o.col || 'cuivre', c = TULIP_COL[col];
  const hx = 100 + (o.lean || 0), hy = 118;
  const cx = 100 + (o.lean || 0) * .15 + (o.bow || 0), cy = H * .55;
  // head tangent
  const tx = hx - cx, ty = hy - cy, rot = Math.atan2(tx, -ty) * 180 / Math.PI;
  const hs = o.head || 1;
  let s = '';
  // leaves (behind the stem)
  const l1 = blade(R, 100, H, -Math.PI / 2 - .2 - R() * .12, H * (.6 + R() * .12), 40 + R() * 8, -.95 - R() * .45);
  const l2 = blade(R, 100, H, -Math.PI / 2 + .14 + R() * .12, H * (.4 + R() * .12), 36 + R() * 8, .6 + R() * .5);
  for (const [l, flip] of [[l1, 0], [l2, 1]]) {
    s += `<path d="${l.half1}" fill="url(#${flip ? 'gLeafB' : 'gLeafA'})"/><path d="${l.half2}" fill="url(#${flip ? 'gLeafA' : 'gLeafB'})"/><path d="${l.mid}" fill="none" stroke="#7fc0aa" stroke-opacity=".28" stroke-width=".8"/>`;
  }
  // stem
  s += `<path d="M100,${H}Q${f(cx)},${f(cy)} ${f(hx)},${f(hy)}" fill="none" stroke="url(#gStem)" stroke-width="5.2" stroke-linecap="round"/>`;
  s += `<path d="M${98.6},${H}Q${f(cx - 1.4)},${f(cy)} ${f(hx - 1.3)},${f(hy + 4)}" fill="none" stroke="#8fd0b4" stroke-opacity=".3" stroke-width="1"/>`;
  // head
  const open = o.open ?? 0; // 0 closed .. 1 more open
  const tipL = -17 - open * 12, tipR = 18 + open * 12;
  s += `<g transform="translate(${f(hx)},${f(hy)}) rotate(${f(rot)}) scale(${hs})">`;
  const o5 = open * 6, o8 = open * 9;
  const L = `M-3,-2C-36,-8 ${f(-50 - o5)},-50 ${f(-41 - o8)},-83C${f(-38 - o8)},-93 ${f(tipL - 10)},-102 ${f(tipL)},-106`;
  const Rt = `M3,-2C36,-8 ${f(50 + o5)},-48 ${f(41 + o8)},-81C${f(38 + o8)},-91 ${f(tipR + 10)},-100 ${f(tipR)},-104`;
  s += `<path d="M-17,-78C-13,-95 -6,-105 0,-111C6,-105 13,-95 17,-78Z" fill="url(#gTb${col})"/>`;
  s += `<path d="${L}C${f(tipL + 2)},-98 -15,-90 -13,-82C-8,-58 0,-28 -3,-2Z" fill="url(#gTs${col})"/>`;
  s += `<path d="${Rt}C${f(tipR - 2)},-96 15,-88 13,-80C8,-56 0,-28 3,-2Z" fill="url(#gTs${col})"/>`;
  s += `<path d="${L}" fill="none" stroke="${c.rim}" stroke-opacity=".5" stroke-width=".9" stroke-linecap="round"/>`;
  s += `<path d="${Rt}" fill="none" stroke="${c.rim}" stroke-opacity=".5" stroke-width=".9" stroke-linecap="round"/>`;
  s += `<path d="M0,0C-31,-6 -39,-46 -23,-73C-17,-83 -7,-91 0,-96C7,-91 17,-83 23,-73C39,-46 31,-6 0,0Z" fill="url(#gT${col})"/>`;
  s += `<path d="M0,-6C-11,-28 -11,-60 0,-90C8,-62 8,-30 0,-6Z" fill="${c.l}" fill-opacity=".2"/>`;
  s += `<path d="M-23,-73C-17,-83 -7,-91 0,-96C7,-91 17,-83 23,-73" fill="none" stroke="${c.rim}" stroke-opacity=".6" stroke-width=".9" stroke-linecap="round"/>`;
  s += `<path d="M-15,-20C-20,-40 -17,-58 -9,-74M15,-20C20,-40 17,-58 9,-74" fill="none" stroke="${c.d}" stroke-opacity=".2" stroke-width=".7"/>`;
  s += `</g>`;
  return { inner: s, vb: [-60, -16, 320, H + 16] };
}

/* ------------------------------------------------------------------ kingfisher */
const KF_SIL = 'M4,40L37.5,34.6C40,25.6 48.4,19.6 57.6,19.6C67,19.6 74.6,25.6 77,34.4C79.2,42.4 85.6,52 88.6,64C90.6,72 91.4,80 93.4,86.6L98.6,101L90.8,98.6C88.4,95 85.6,91.6 82.4,89.4C74,96.6 59.6,96.4 49.2,87.6C39.4,79.2 34,66.4 36.2,55.2C37,51 38.6,47.4 38.6,43.2Z';

function kingfisher() {
  return `
<defs>
  <linearGradient id="kfO" x1=".1" y1="0" x2=".9" y2="1"><stop offset="0" stop-color="#f8bb70"/><stop offset=".5" stop-color="#e58a40"/><stop offset="1" stop-color="#b8532a"/></linearGradient>
  <linearGradient id="kfT" x1=".1" y1="0" x2=".85" y2="1"><stop offset="0" stop-color="#36bcc6"/><stop offset=".45" stop-color="#138298"/><stop offset="1" stop-color="#0a4a66"/></linearGradient>
  <linearGradient id="kfW" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#178ea2"/><stop offset="1" stop-color="#093f58"/></linearGradient>
  <radialGradient id="kfH" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#ffe3b4" stop-opacity=".6"/><stop offset="1" stop-color="#ffe3b4" stop-opacity="0"/></radialGradient>
  <clipPath id="kfC"><path d="${KF_SIL}"/></clipPath>
</defs>
<path d="M58.6,93.4c-.8,2.2 -.4,4.2 .8,5.4M65.4,94.6c-.4,2 0,3.6 1.2,4.6" stroke="#cf5a34" stroke-width="1.7" stroke-linecap="round" fill="none"/>
<path d="${KF_SIL}" fill="url(#kfO)"/>
<g clip-path="url(#kfC)">
  <ellipse cx="46" cy="72" rx="9" ry="15" fill="url(#kfH)"/>
  <path d="M30,36L37.5,32C38,22 48,15 58,15C70,15 79,23 81,36C83,46 91,58 93,70C95,84 98,94 104,108L86,101C76,91 68,75 64,59C62.4,53 62.4,50 63.2,47.4C56,42.2 47,40.5 38.2,40.3Z" fill="url(#kfT)"/>
  <path d="M38.3,40.2C47,40 56.5,42 63.4,47.4C61.4,52.6 53.6,55 46.4,53C42,51.6 39.4,48.6 38.6,44.6Z" fill="#f4a155"/>
  <path d="M37.4,46.6C42,53.6 50,57.6 60.4,58.6C57.6,64 51,66.4 45,64.2C40.4,61.6 37.2,55 37.4,46.6Z" fill="#fff5e4"/>
  <path d="M38.5,43C43,48.8 51.4,52.6 62,53.5C63,55.2 63.1,56.8 62.6,58.3C52,57.2 43.2,52.8 38.1,46.2Z" fill="#0f6f86"/>
  <path d="M63.6,47.6C67.8,46.2 72.6,48.4 74.6,52.8C72.8,57.4 67.8,59.4 63.7,57.6C62.2,54.4 62.4,50.6 63.6,47.6Z" fill="#fff5e4"/>
  <path d="M64,56C72,63 82.4,77 90,95C81.4,91.6 72,84 66.6,73.6C63.4,67 62.6,60.6 64,56Z" fill="url(#kfW)"/>
  <path d="M73,32.6C77,46 84.4,58 89.4,79" stroke="#86e8ea" stroke-opacity=".8" stroke-width="2.3" stroke-linecap="round" fill="none"/>
  <path d="M66.6,62.6c3.4,4.6 7.2,9.2 11.4,13.4M68.4,70.4c3,4 6.4,7.6 10.2,10.6" stroke="#5fd0d8" stroke-opacity=".55" stroke-width=".9" stroke-linecap="round" stroke-dasharray=".2 3.2" fill="none"/>
  <g fill="#9cecec" fill-opacity=".85"><circle cx="45.6" cy="27.6" r=".8"/><circle cx="50.4" cy="24.4" r=".8"/><circle cx="55.6" cy="22.6" r=".8"/><circle cx="61" cy="22.8" r=".8"/><circle cx="66.2" cy="25" r=".8"/><circle cx="70.4" cy="28.6" r=".8"/><circle cx="48.4" cy="30.4" r=".7"/><circle cx="53.4" cy="27.6" r=".7"/><circle cx="58.6" cy="26.8" r=".7"/><circle cx="63.6" cy="28.4" r=".7"/><circle cx="68" cy="32" r=".7"/><circle cx="56" cy="31" r=".6"/><circle cx="61.4" cy="32" r=".6"/></g>
</g>
<path d="M4,40L37.5,34.6L38.6,43.2Z" fill="#18262a"/>
<path d="M7.4,39.6L37.6,36.6" stroke="#6f8a8c" stroke-width=".7" stroke-linecap="round"/>
<path d="M9,40.3L38.2,40.6" stroke="#05090a" stroke-opacity=".5" stroke-width=".5"/>
<circle cx="41.9" cy="37.3" r="1.25" fill="#f4a155"/>
<circle cx="47.6" cy="34.8" r="2.7" fill="#0c1416"/><circle cx="46.8" cy="33.9" r=".9" fill="#fff"/>`;
}

/* ------------------------------------------------------------------ misc shapes */
// Closed smooth blob (Catmull-Rom -> cubic) for the wax seal.
function blob(seed, r, jitter, n = 13) {
  const R = rng(seed), P = [];
  for (let i = 0; i < n; i++) { const a = i / n * Math.PI * 2, rr = r + (R() - .4) * jitter; P.push([Math.cos(a) * rr, Math.sin(a) * rr]); }
  let d = `M${f(P[0][0])},${f(P[0][1])}`;
  for (let i = 0; i < n; i++) {
    const p0 = P[(i - 1 + n) % n], p1 = P[i], p2 = P[(i + 1) % n], p3 = P[(i + 2) % n];
    d += `C${f(p1[0] + (p2[0] - p0[0]) / 6)},${f(p1[1] + (p2[1] - p0[1]) / 6)} ${f(p2[0] - (p3[0] - p1[0]) / 6)},${f(p2[1] - (p3[1] - p1[1]) / 6)} ${f(p2[0])},${f(p2[1])}`;
  }
  return d + 'Z';
}
// Soft far-shore silhouette, viewBox 0 0 1000 60, waterline at y=60.
function hills(seed, amp, base) {
  const R = rng(seed), ph = [R() * 6, R() * 6, R() * 6, R() * 6];
  let d = 'M0,60';
  for (let x = 0; x <= 1000; x += 10) {
    const u = x / 1000;
    let y = Math.sin(u * 5.3 + ph[0]) * .5 + Math.sin(u * 11.7 + ph[1]) * .3 + Math.sin(u * 23.1 + ph[2]) * .14 + Math.sin(u * 47 + ph[3]) * .06;
    // keep the centre low so the sun sits in a gap
    const gap = 1 - Math.exp(-Math.pow((u - .5) / .16, 2));
    y = 60 - (base + (y * .5 + .5) * amp) * (.18 + .82 * gap);
    d += `L${x},${f(y)}`;
  }
  return d + 'L1000,60Z';
}

module.exports = { rng, defs, tulipDefs, branch, tulip, kingfisher, blob, hills, KF_SIL, PETAL, TULIP_COL };
