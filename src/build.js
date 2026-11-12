// Build: index.src.html + procedural art (dev/art.js) -> index.html (single self-contained file).
// Usage: node src/build.js   (edit src/index.src.html, then rebuild)
'use strict';
const fs = require('fs'), path = require('path');
const art = require('./art');

const A = art.branch(+(process.env.SA || 7), { ang: Math.PI * .9, len: 400, w0: 12, curl: .0035, maxDepth: 2, density: .8, perch: .34, mainFrom: .46 });
const B = art.branch(+(process.env.SB || 19), { ang: Math.PI * .1, len: 250, w0: 8.5, curl: -.004, maxDepth: 2, density: .8, mainFrom: .45 });

const svgBranch = (b, extra = '') =>
  `<svg class="art" viewBox="${b.vb.join(' ')}" style="--bw:${b.vb[2]};--bh:${b.vb[3]};--ox:${(b.origin[0] / 100).toFixed(4)};--oy:${(b.origin[1] / 100).toFixed(4)}" aria-hidden="true" focusable="false">${b.inner}${extra}</svg>`;

// the kingfisher sits on branch A (feet at 62,96 in its own 0..106 box)
const KS = .46;
const bird = `<g class="kf" transform="translate(${(A.perch.x - 62 * KS).toFixed(1)},${(A.perch.y - 95.6 * KS).toFixed(1)}) scale(${KS})">${art.kingfisher()}</g>`;

const tulipSet = (list) => list.map(([seed, o, x, s, r, dur, del]) => {
  const t = art.tulip(seed, o);
  return `<div class="tulip" style="--x:${x};--s:${s};--r:${r}deg;--dur:${dur}s;--del:${del}s"><svg class="art" viewBox="${t.vb.join(' ')}" aria-hidden="true" focusable="false">${t.inner}</svg></div>`;
}).join('');

const TL = tulipSet([
  [3, { col: 'creme', lean: -8, bow: 8, h: 320, open: .15, head: .92 }, 44, .8, 6, 7.9, -3.1],
  [2, { col: 'rose', lean: 14, bow: -10, h: 420, open: .45 }, -52, .92, 2, 9.3, -1.2],
  [1, { col: 'cuivre', lean: -16, bow: 10, h: 500, open: .1 }, -136, 1, -4, 8.4, -5.4],
]);
const TR = tulipSet([
  [6, { col: 'rose', lean: 10, bow: -8, h: 310, open: .2, head: .9 }, 48, .78, -7, 8.7, -2.2],
  [5, { col: 'cuivre', lean: -12, bow: 10, h: 400, open: .7 }, -46, .9, -2, 7.6, -4.4],
  [4, { col: 'creme', lean: 16, bow: -8, h: 480, open: .3 }, -132, .98, 4, 9.8, -.6],
]);

// ---- tiny PNG encoder + tileable grain (bitmaps tile for free; SVG turbulence re-renders on every paint)
const zlib = require('zlib');
function crc32(buf) { let crc = ~0; for (let n = 0; n < buf.length; n++) { let c = (crc ^ buf[n]) & 0xff; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; crc = (crc >>> 8) ^ c; } return ~crc >>> 0; }
function chunk(type, data) { const len = Buffer.alloc(4); len.writeUInt32BE(data.length); const td = Buffer.concat([Buffer.from(type, 'ascii'), data]); const crc = Buffer.alloc(4); crc.writeUInt32BE(crc32(td)); return Buffer.concat([len, td, crc]); }
function noiseTile(size, rgb, gain, seed) {
  const R = art.rng(seed), row = size * 4 + 1, raw = Buffer.alloc(row * size);
  for (let y = 0; y < size; y++) {
    raw[y * row] = 0;
    for (let x = 0; x < size; x++) {
      const v = (R() + R()) / 2, a = Math.max(0, Math.min(255, Math.round((v - .36) * gain * 255))), o = y * row + 1 + x * 4;
      raw[o] = rgb[0]; raw[o + 1] = rgb[1]; raw[o + 2] = rgb[2]; raw[o + 3] = a & 0xfc; // coarse alpha steps compress better
    }
  }
  const ihdr = Buffer.alloc(13); ihdr.writeUInt32BE(size, 0); ihdr.writeUInt32BE(size, 4); ihdr[8] = 8; ihdr[9] = 6;
  const png = Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), chunk('IHDR', ihdr), chunk('IDAT', zlib.deflateSync(raw, { level: 9 })), chunk('IEND', Buffer.alloc(0))]);
  return `url(data:image/png;base64,${png.toString('base64')})`;
}

const tokens = {
  NOISE_FILM: noiseTile(144, [255, 246, 230], .15, 11),
  NOISE_INTRO: noiseTile(144, [255, 246, 230], .34, 12),
  NOISE_PAPER: noiseTile(160, [116, 78, 40], .2, 13),
  DEFS: art.defs() + art.tulipDefs(),
  BRANCH_A: svgBranch(A, bird),
  BRANCH_B: svgBranch(B),
  TULIPS_L: TL,
  TULIPS_R: TR,
  HILLS_FAR: art.hills(3, 30, 8),
  HILLS_NEAR: art.hills(8, 20, 5),
  SEAL_BLOB: art.blob(5, 24.5, 2.2, 15),
  KF_SIL: art.KF_SIL,
};

let src = fs.readFileSync(path.join(__dirname, 'index.src.html'), 'utf8');
src = src.replace(/%%([A-Z_]+)%%/g, (m, k) => { if (!(k in tokens)) throw new Error('unknown token ' + k); return tokens[k]; });
fs.writeFileSync(path.join(__dirname, '..', 'index.html'), src);
console.log('index.html', Math.round(src.length / 1024) + ' KB', '| blossoms A', (tokens.BRANCH_A.match(/<use/g) || []).length, 'B', (tokens.BRANCH_B.match(/<use/g) || []).length);
