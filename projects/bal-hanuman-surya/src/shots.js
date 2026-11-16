// BAL HANUMAN AND THE SUN: the shot list (Katha style, Hindi). Cut paper on parchment; no faces.
// Deities are drawn simply and respectfully: no faces. Kit from lakshman-rekha + new pieces below.
import { ctx, W, H, TAU, clamp, lerp, seg, eo, eio, eob, rnd, rr, circle, ell, line } from './core/lib.js';
import { L, Le, Wd, T } from './core/timing.js';
import * as K from './core/kit.js';
const { P, cut, P_rr, P_poly, P_circ } = K;
const rad = (d) => d * Math.PI / 180;
const C = {
  vishnu: '#4A6E9E', shiva: '#9DB4BE', asura: '#A88E78', milk: '#F4EDDA', milk2: '#E6DBC0', milk3: '#D8CAA8',
  saffron: '#C8702F', poison: '#2C3328', poison2: '#454F3C', throat: '#2F5FA8', lotus: '#C9575A', lotus2: '#E39A8E',
  white: '#F4EFE2', grey: '#B8B0A2', leaf: '#6F8A4A', sky: '#E7D7AE', hair: '#3E2C1E', dusk: '#2F3550',
};

// ═════════════ PAGES ═════════════
function skyPage(seed, sky = C.sky) {
  K.parchment(seed); ctx.save(); ctx.globalAlpha = 0.75; ctx.fillStyle = sky; ctx.fillRect(-300, -300, W + 600, 1500); ctx.restore();
}
function cloud(x, y, s, a = 1) { ctx.save(); ctx.globalAlpha = a; ctx.translate(x, y); ctx.scale(s, s); cut(() => { ctx.beginPath(); for (const [dx, dy, r] of [[-90, 10, 55], [-30, -25, 75], [50, -10, 65], [110, 15, 45]]) { ctx.moveTo(dx + r, dy); ctx.arc(dx, dy, r, 0, TAU); } ctx.rect(-140, 10, 270, 50); }, C.white, { shadow: 0.4, edge: 4 }); ctx.restore(); }
function heavenClouds(t) { cloud(180 + Math.sin(t * 0.4) * 20, 700, 1.1); cloud(880 - Math.sin(t * 0.3) * 20, 560, 0.9); cloud(560, 330, 0.6, 0.8); }
function ground(y = 1450, col = P.sepia) { cut(P_rr(-300, y, W + 600, 900, 0), col, { shadow: 0, edge: 0 }); }
function cloudGround(y = 1450) { cut(() => { ctx.beginPath(); ctx.moveTo(-300, H + 300); ctx.lineTo(-300, y); for (let x = -300; x <= W + 300; x += 90) ctx.arc(x + 45, y, 55, Math.PI, 0); ctx.lineTo(W + 300, H + 300); ctx.closePath(); }, C.white, { shadow: 0.6, edge: 5 }); }
/** the Ocean of Milk: layered cream waves from y0 down. mid() is drawn behind the front layers (things IN the ocean) */
function ocean(t, y0 = 1150, mid = null, swirl = 0) {
  for (let i = 0; i < 4; i++) {
    const y = y0 + i * 110;
    cut(() => { ctx.beginPath(); ctx.moveTo(-300, H + 300); ctx.lineTo(-300, y); for (let x = -300; x <= W + 300; x += 30) ctx.lineTo(x, y + Math.sin(x * 0.011 + t * (1.4 + swirl * 3) * (i % 2 ? -1 : 1) + i) * (18 + swirl * 22)); ctx.lineTo(W + 300, H + 300); ctx.closePath(); }, [C.milk, C.milk2, C.milk, C.milk3][i], { shadow: 0.6, edge: 5 });
    if (i === 0 && mid) mid();
  }
}

// ═════════════ PEOPLE ═════════════
function arm(px, py, deg, col, len = 220) {
  const r = rad(-deg);
  cut(() => { ctx.beginPath(); ctx.save(); ctx.translate(px, py); ctx.rotate(r); ctx.roundRect(-20, 0, 40, len, 20); ctx.restore(); }, col, { shadow: 0.5, edge: 4 });
  return [px - len * Math.sin(r), py + len * Math.cos(r)];
}
// ═════════════ OBJECTS ═════════════
function chakra(x, y, s, t = 0) { ctx.save(); ctx.translate(x, y); ctx.rotate(t * 3); ctx.scale(s, s); cut(P_circ(0, 0, 40), P.gold, { shadow: 0.4, edge: 3 }); circle(0, 0, 24, '#A87A22'); for (let i = 0; i < 8; i++) { ctx.save(); ctx.rotate(i * TAU / 8); ctx.fillStyle = P.gold; ctx.fillRect(-3, -40, 6, 52); ctx.restore(); } circle(0, 0, 9, P.crimson); ctx.restore(); }
function shankh(x, y, s) { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); cut(() => { ctx.beginPath(); ctx.moveTo(-20, -45); ctx.quadraticCurveTo(40, -30, 30, 20); ctx.quadraticCurveTo(10, 50, -15, 40); ctx.quadraticCurveTo(-40, 0, -20, -45); }, C.white, { shadow: 0.4, edge: 3 }); ctx.strokeStyle = C.grey; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(0, 5, 14, 0, 5); ctx.stroke(); ctx.restore(); }
function trishul(x, y, len = 640) { cut(P_rr(x - 8, y - len, 16, len, 6), P.ink, { shadow: 0.5, edge: 3 }); cut(() => { ctx.beginPath(); const t = y - len; ctx.moveTo(x - 60, t - 70); ctx.quadraticCurveTo(x - 60, t + 10, x, t + 10); ctx.quadraticCurveTo(x + 60, t + 10, x + 60, t - 70); ctx.lineTo(x + 46, t - 20); ctx.quadraticCurveTo(x, t - 10, x - 46, t - 20); ctx.closePath(); ctx.moveTo(x - 10, t); ctx.lineTo(x, t - 100); ctx.lineTo(x + 10, t); ctx.closePath(); }, '#8E8676', { shadow: 0.4, edge: 3 }); }
function glow(x, y, r, a = 1, col = '242,200,90') { if (a <= 0) return; ctx.save(); ctx.globalAlpha = clamp(a); const g = ctx.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, `rgba(${col},0.85)`); g.addColorStop(1, `rgba(${col},0)`); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill(); ctx.restore(); }
/** golden kalash with mango leaves; g = glow 0..1 */
function kalash(x, y, s = 1, g = 0, t = 0) {
  glow(x, y - 60 * s, 260 * s, g * (0.8 + 0.2 * Math.sin(t * 4)));
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  for (const k of [-1, 0, 1]) cut(P_poly([[k * 22, -150], [k * 70 - 10, -200 + Math.abs(k) * 25], [k * 22 + 18, -150]]), C.leaf, { shadow: 0.3, edge: 3 });
  cut(P_circ(0, -165, 34), P.sepia, { shadow: 0.3, edge: 3 });
  cut(P_rr(-48, -150, 96, 40, 10), P.gold, { shadow: 0.4, edge: 3 });
  cut(() => { ctx.beginPath(); ctx.moveTo(-40, -112); ctx.bezierCurveTo(-130, -90, -120, 0, -50, 0); ctx.lineTo(50, 0); ctx.bezierCurveTo(120, 0, 130, -90, 40, -112); ctx.closePath(); }, P.gold);
  ctx.strokeStyle = P.crimson; ctx.lineWidth = 7; ctx.beginPath(); ctx.moveTo(-95, -60); ctx.quadraticCurveTo(0, -30, 95, -60); ctx.stroke();
  ctx.restore();
}
function garland(x, y, s = 1, sag = 1, rot = 0) { ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s); for (let i = 0; i <= 18; i++) { const a = Math.PI * i / 18; const px = -Math.cos(a) * 90, py = Math.sin(a) * 120 * sag; cut(P_circ(px, py, 17), [C.saffron, P.gold, P.crimson][i % 3], { shadow: 0.3, edge: 2 }); } ctx.restore(); }
function petals(x, y, p, seed = 0) { for (let i = 0; i < 12; i++) { const a = rnd(i + seed) * TAU, r = eo(p) * (80 + rnd(i + 3) * 150); ell(x + Math.cos(a) * r, y - Math.abs(Math.sin(a)) * r * 0.5 + p * 40, 14, 9, [C.saffron, P.gold, P.crimson][i % 3], a); } }
function lotus(x, y, s = 1) { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); for (const [a, c] of [[-60, C.lotus], [60, C.lotus], [-30, C.lotus2], [30, C.lotus2], [0, C.lotus]]) cut(() => { ctx.beginPath(); ctx.save(); ctx.rotate(rad(a)); ctx.moveTo(0, 0); ctx.quadraticCurveTo(-55, -80, 0, -170); ctx.quadraticCurveTo(55, -80, 0, 0); ctx.restore(); }, c, { shadow: 0.4, edge: 3 }); cut(P_rr(-120, -10, 240, 26, 13), C.leaf, { shadow: 0.4, edge: 3 }); ctx.restore(); }
/** white elephant facing right, standing on (x, y). step lifts the front foot (0..1). Returns the top of the head. */
function elephant(x, y, s = 1, step = 0, walk = 0) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s); const col = '#E9E3D4', sh = '#CFC6B2';
  for (const [lx, k] of [[-170, 1], [-60, -1], [60, 1], [170, -1]]) { const up = (lx === 170 ? step * 120 : 0) + Math.max(0, Math.sin(walk + (k > 0 ? 0 : Math.PI))) * 25; cut(P_rr(lx - 40, -230 - up, 80, 230, 20), lx < 0 ? sh : col, { shadow: 0.5, edge: 4 }); }
  cut(() => { ctx.beginPath(); ctx.ellipse(0, -330, 260, 170, 0, 0, TAU); }, col);
  cut(P_rr(-150, -520, 300, 70, 14), P.crimson, { shadow: 0.4, edge: 3 }); ctx.fillStyle = P.gold; for (let i = 0; i < 6; i++) ctx.fillRect(-140 + i * 50, -460, 30, 14);
  cut(() => { ctx.beginPath(); ctx.moveTo(300, -380); ctx.bezierCurveTo(380, -300, 380, -150, 330, -60); ctx.lineTo(300, -70); ctx.bezierCurveTo(330, -170, 310, -280, 250, -330); ctx.closePath(); }, col, { shadow: 0.5, edge: 4 });
  cut(P_circ(270, -440, 105), col); cut(() => { ctx.beginPath(); ctx.ellipse(205, -430, 70, 95, -0.2, 0, TAU); }, sh, { shadow: 0.4, edge: 4 });
  cut(P_poly([[300, -360], [380, -330], [300, -340]]), C.white, { shadow: 0.3, edge: 2 }); circle(305, -470, 9, P.ink);
  cut(P_poly([[230, -545], [270, -585], [310, -545]]), P.gold, { shadow: 0.3, edge: 3 });
  ctx.restore(); return [x + 270 * s, y - 545 * s];
}
function cow(x, y, s = 1) { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); const col = '#F1EBDD'; for (const lx of [-110, -50, 60, 120]) cut(P_rr(lx - 18, -160, 36, 160, 12), lx < 0 ? '#D8D0BE' : col, { shadow: 0.4, edge: 3 }); cut(() => { ctx.beginPath(); ctx.ellipse(0, -210, 170, 85, 0, 0, TAU); }, col); cut(P_poly([[-40, -290], [0, -320], [40, -290]]), col, { shadow: 0.3, edge: 3 }); cut(() => { ctx.beginPath(); ctx.ellipse(200, -270, 55, 45, 0.3, 0, TAU); }, col); for (const k of [-1, 1]) cut(P_poly([[190 + k * 18, -310], [185 + k * 40, -380], [205 + k * 10, -310]]), P.gold, { shadow: 0.3, edge: 2 }); circle(215, -280, 7, P.ink); cut(P_rr(-60, -250, 120, 22, 8), P.crimson, { shadow: 0, edge: 2 }); ctx.restore(); }
function horse(x, y, s = 1) { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); const col = '#F4EFE2'; for (const lx of [-110, -60, 70, 120]) cut(P_rr(lx - 15, -200, 30, 200, 10), lx < 0 ? '#DCD4C2' : col, { shadow: 0.4, edge: 3 }); cut(() => { ctx.beginPath(); ctx.ellipse(0, -250, 170, 75, 0, 0, TAU); }, col); cut(P_poly([[110, -290], [190, -430], [250, -400], [170, -260]]), col); cut(() => { ctx.beginPath(); ctx.ellipse(235, -410, 70, 34, 0.5, 0, TAU); }, col); cut(P_poly([[120, -310], [170, -440], [150, -300]]), P.gold, { shadow: 0.3, edge: 2 }); circle(240, -425, 6, P.ink); ctx.restore(); }
function tree(x, y, s = 1, t = 0) { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); cut(P_rr(-30, -300, 60, 300, 10), P.sepia); for (const [px, py, r] of [[0, -420, 150], [-120, -340, 100], [120, -340, 100], [0, -300, 90]]) cut(P_circ(px, py, r), P.forest, { shadow: 0.4, edge: 4 }); for (let i = 0; i < 9; i++) glow(-150 + rnd(i) * 300, -480 + rnd(i + 4) * 220, 30, 0.7 + 0.3 * Math.sin(t * 3 + i)), circle(-150 + rnd(i) * 300, -480 + rnd(i + 4) * 220, 14, P.gold); ctx.restore(); }
function palace(x, y, s = 1, flags = 0) { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); cut(P_rr(-360, -380, 720, 380, 6), '#E2C47A'); for (const [px, r] of [[-250, 90], [0, 150], [250, 90]]) { cut(P_rr(px - r, -380 - r * 0.9, r * 2, r * 0.9 + 4, 4), '#E2C47A', { shadow: 0.3, edge: 3 }); cut(() => { ctx.beginPath(); ctx.arc(px, -380 - r * 0.9, r, Math.PI, TAU); ctx.closePath(); }, P.gold); cut(P_rr(px - 6, -380 - r * 1.9 - 60, 12, 70, 4), P.ink, { shadow: 0.3, edge: 2 }); if (flags > 0) cut(P_poly([[px + 6, -380 - r * 1.9 - 60], [px + 6 + 90 * flags, -380 - r * 1.9 - 35], [px + 6, -380 - r * 1.9 - 10]]), P.crimson, { shadow: 0.3, edge: 2 }); } for (let i = 0; i < 5; i++) { rr(-300 + i * 140, -260, 60, 260, [30, 30, 0, 0]); ctx.fillStyle = '#8A6A48'; ctx.fill(); } ctx.restore(); }
function sparkles(x, y, r, t, a = 1) { if (a <= 0) return; ctx.save(); ctx.globalAlpha = clamp(a); for (let i = 0; i < 10; i++) { const ang = i / 10 * TAU + t * 0.8, rr_ = r * (0.6 + 0.4 * rnd(i)); const px = x + Math.cos(ang) * rr_, py = y + Math.sin(ang) * rr_, k = 10 + 8 * Math.sin(t * 6 + i); ctx.fillStyle = '#F2C14E'; ctx.beginPath(); ctx.moveTo(px, py - k * 2); ctx.lineTo(px + k * 0.5, py); ctx.lineTo(px, py + k * 2); ctx.lineTo(px - k * 0.5, py); ctx.closePath(); ctx.fill(); } ctx.restore(); }
function wash(col, a) { if (a <= 0) return; ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = col; ctx.fillRect(-300, -300, W + 600, H + 600); ctx.restore(); }
function arrow(x0, y0, x1, y1, p = 1) { if (p <= 0.02) return; const x = lerp(x0, x1, p), y = lerp(y0, y1, p); line([[x0, y0], [x, y]], P.crimson, 14); const a = Math.atan2(y1 - y0, x1 - x0); cut(P_poly([[x + Math.cos(a) * 40, y + Math.sin(a) * 40], [x + Math.cos(a + 2.4) * 40, y + Math.sin(a + 2.4) * 40], [x + Math.cos(a - 2.4) * 40, y + Math.sin(a - 2.4) * 40]]), P.crimson, { shadow: 0.4, edge: 3 }); }
function diya(x, y, s = 1, t = 0) { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); glow(0, -60, 90, 0.8 + 0.2 * Math.sin(t * 9)); cut(() => { ctx.beginPath(); ctx.moveTo(-60, -20); ctx.quadraticCurveTo(0, 30, 60, -20); ctx.lineTo(80, -30); ctx.lineTo(-60, -30); ctx.closePath(); }, '#A0522D', { shadow: 0.4, edge: 3 }); cut(() => { ctx.beginPath(); ctx.moveTo(60, -30); ctx.quadraticCurveTo(80 + Math.sin(t * 11) * 4, -70, 70, -100); ctx.quadraticCurveTo(50, -60, 60, -30); }, '#F2A93B', { shadow: 0, edge: 0 }); ctx.restore(); }
function modak(x, y, s = 1) { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); cut(() => { ctx.beginPath(); ctx.moveTo(0, -60); ctx.quadraticCurveTo(50, -10, 40, 20); ctx.lineTo(-40, 20); ctx.quadraticCurveTo(-50, -10, 0, -60); }, '#F1E4C4', { shadow: 0.4, edge: 3 }); ctx.restore(); }
function lota(x, y, s = 1) { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); cut(() => { ctx.beginPath(); ctx.moveTo(-25, -70); ctx.lineTo(25, -70); ctx.lineTo(20, -50); ctx.bezierCurveTo(70, -40, 70, 20, 0, 20); ctx.bezierCurveTo(-70, 20, -70, -40, -20, -50); ctx.closePath(); }, '#C27A3A', { shadow: 0.4, edge: 3 }); ctx.restore(); }
function pothi(x, y, s = 1, p = 1) { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); cut(P_rr(-300, -70, 600, 140, 10), '#D9B977'); ctx.strokeStyle = 'rgba(62,44,30,0.6)'; ctx.lineWidth = 4; for (let i = 0; i < 4; i++) { ctx.beginPath(); ctx.moveTo(-250, -40 + i * 26); ctx.lineTo(-250 + 500 * clamp(p * 1.3 - i * 0.1), -40 + i * 26); ctx.stroke(); } for (const k of [-160, 160]) circle(k, 0, 10, P.crimson); cut(P_rr(-320, -80, 30, 160, 6), P.wine, { shadow: 0.3, edge: 2 }); cut(P_rr(290, -80, 30, 160, 6), P.wine, { shadow: 0.3, edge: 2 }); ctx.restore(); }
function thought(x, y, s, t) { if (s <= 0) return; ctx.save(); ctx.translate(x, y); ctx.scale(s, s); for (const [dx, dy, r] of [[-150, 170, 18], [-110, 120, 28]]) cut(P_circ(dx, dy, r), C.white, { shadow: 0.3, edge: 3 }); cloud(0, 0, 0.9); ctx.font = `800 110px NotoDeva`; ctx.fillStyle = P.crimson; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('?', 0, 10 + Math.sin(t * 4) * 6); ctx.restore(); }
function dayPage(seed) { skyPage(seed); heavenClouds(0); }
function bigCross(x, y, p) { if (p <= 0) return; ctx.save(); ctx.globalAlpha = clamp(p); ctx.lineCap = 'round'; ctx.strokeStyle = P.crimson; ctx.lineWidth = 26; ctx.beginPath(); ctx.moveTo(x - 110, y - 110); ctx.lineTo(x - 110 + 220 * clamp(p * 2), y - 110 + 220 * clamp(p * 2)); ctx.stroke(); if (p > 0.5) { ctx.beginPath(); ctx.moveTo(x + 110, y - 110); ctx.lineTo(x + 110 - 220 * clamp(p * 2 - 1), y - 110 + 220 * clamp(p * 2 - 1)); ctx.stroke(); } ctx.restore(); }
function bigText(text, x, y, size, col, sc = 1) { if (sc <= 0) return; ctx.save(); ctx.translate(x, y); ctx.scale(sc, sc); ctx.font = `800 ${size}px NotoDeva`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.lineWidth = 14; ctx.strokeStyle = P.edge; ctx.strokeText(text, 0, 0); ctx.fillStyle = col; ctx.fillText(text, 0, 0); ctx.restore(); }

// ═════════════ PEOPLE (person from samudra-manthan + krishna / pagri heads) ═════════════
/** a figure standing on (x, y). o = { h, dir, skin, robe, trim, head: 'crown'|'jata'|'sage'|'asura'|'bun'|'krishna'|'pagri'|'none',
 *  arm (front arm deg: 0 down, 90 forward, 180 up), back, halo 0..1, hold: fn(hx, hy), holdBack, sari, bob, beard, finger } */
function person(o) {
  const h = o.h || 640, d = o.dir || 1, s = h / 640;
  ctx.save(); ctx.translate(o.x, o.y + (o.bob || 0)); ctx.scale(s * d, s);
  const skin = o.skin || P.skin, robe = o.robe || P.wine, trim = o.trim || P.gold;
  if (o.halo > 0) { ctx.save(); ctx.globalAlpha = clamp(o.halo); const g = ctx.createRadialGradient(0, -540, 40, 0, -540, 190); g.addColorStop(0, 'rgba(242,200,90,0.9)'); g.addColorStop(1, 'rgba(242,200,90,0)'); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, -540, 190, 0, TAU); ctx.fill(); cut(P_circ(0, -545, 112), '#E2B44E', { shadow: 0.2, edge: 4 }); ctx.restore(); }
  const bh = arm(-30, -440, o.back ?? 10, skin); if (o.holdBack) o.holdBack(bh[0], bh[1]);
  if (o.sari) cut(P_poly([[-70, -470], [70, -470], [125, 0], [-125, 0]]), robe);
  else { cut(P_poly([[-72, -470], [72, -470], [80, -250], [-80, -250]]), skin); cut(P_poly([[-85, -260], [85, -260], [110, 0], [-110, 0]]), robe); }
  cut(P_poly([[-72, -470], [-30, -470], [80, -280], [40, -260]]), o.sari ? trim : (o.sash || robe), { shadow: 0.4, edge: 3 });
  rr(-85, -275, 170, 24, 8); ctx.fillStyle = trim; ctx.fill();
  const hd = o.head || 'none';
  if (hd !== 'sage' && hd !== 'pagri') { ctx.beginPath(); ctx.arc(0, -470, 55, 0.15 * Math.PI, 0.85 * Math.PI); ctx.strokeStyle = P.gold; ctx.lineWidth = 9; ctx.stroke(); }
  if (hd === 'bun') cut(P_circ(-45, -590, 42), C.hair, { shadow: 0.4, edge: 4 });
  if (hd === 'krishna') cut(P_circ(-40, -585, 46), C.hair, { shadow: 0.4, edge: 4 });
  cut(P_circ(0, -540, 66), skin);
  if (hd === 'crown') { cut(P_poly([[-58, -580], [-62, -660], [-30, -640], [0, -700], [30, -640], [62, -660], [58, -580]]), P.gold, { shadow: 0.5, edge: 4 }); circle(0, -625, 10, P.crimson); }
  if (hd === 'bun') cut(P_poly([[-50, -590], [-30, -640], [0, -615], [30, -640], [50, -590]]), P.gold, { shadow: 0.3, edge: 3 });
  if (hd === 'krishna') {
    cut(P_poly([[-56, -585], [-40, -630], [0, -612], [40, -630], [56, -585]]), P.gold, { shadow: 0.3, edge: 3 }); circle(0, -606, 8, P.crimson);
    // peacock feather
    ctx.save(); ctx.translate(18, -620); ctx.rotate(0.35); line([[0, 0], [0, -120]], P.sepia, 5);
    cut(() => { ctx.beginPath(); ctx.ellipse(0, -120, 30, 50, 0, 0, TAU); }, '#2E7D6B', { shadow: 0.3, edge: 3 });
    ell(0, -112, 18, 30, '#E0B23C'); ell(0, -108, 10, 17, '#2F5FA8'); ctx.restore();
  }
  if (hd === 'pagri') { cut(P_rr(-64, -650, 128, 78, 34), o.pagri || C.saffron, { shadow: 0.4, edge: 4 }); circle(46, -640, 14, P.gold); }
  if (hd === 'sage') cut(P_circ(0, -610, 52), C.white, { shadow: 0.4, edge: 4 });
  if (hd === 'jata') { cut(P_circ(0, -622, 44), C.hair, { shadow: 0.4, edge: 4 }); rr(-40, -600, 80, 14, 6); ctx.fillStyle = o.band || P.gold; ctx.fill(); }
  if (hd === 'queen') { cut(P_circ(-45, -590, 42), C.hair, { shadow: 0.4, edge: 4 }); cut(P_poly([[-52, -585], [-56, -650], [-26, -630], [0, -680], [26, -630], [56, -650], [52, -585]]), P.gold, { shadow: 0.4, edge: 3 }); }
  if (o.beard || hd === 'sage') cut(P_poly([[-46, -510], [46, -510], [0, -400]]), C.white, { shadow: 0.4, edge: 4 });
  const fh = arm(30, -440, o.arm ?? 10, skin); rr(15, -400, 30, 14, 5); ctx.fillStyle = P.gold; ctx.fill();
  if (o.finger) { const r = rad(-(o.arm ?? 10)); ctx.save(); ctx.translate(fh[0], fh[1]); ctx.rotate(r); cut(P_rr(-8, -10, 16, 46, 8), skin, { shadow: 0.3, edge: 3 }); ctx.restore(); }
  if (o.hold) o.hold(fh[0], fh[1]);
  ctx.restore();
}
const KR = { skin: '#3F6FA8', robe: '#E0B23C', trim: P.crimson, head: 'krishna', sash: P.crimson };
const INDRA = { skin: P.skin, robe: P.royal, trim: P.gold, head: 'crown' };
const NANDA = { skin: P.skin, robe: '#EFE6D0', trim: P.gold, head: 'pagri', beard: true, pagri: '#C8952F' };
const GOPA = (i) => ({ skin: [P.skin, '#D6A57A', '#C99468'][i % 3], robe: ['#EFE6D0', '#C8702F', '#E0D2B0'][i % 3], trim: [P.crimson, P.sepia, P.green][i % 3], head: 'pagri', pagri: [C.saffron, P.crimson, '#E0B23C'][i % 3] });
const GOPI = (i) => ({ skin: [P.skin, '#D6A57A'][i % 2], robe: [P.crimson, P.green, P.wine][i % 3], trim: P.gold, head: 'bun', sari: true });
/** a villager by index (alternating gopa / gopi) */
function villager(i, x, y, h, o = {}) { person({ ...(i % 2 ? GOPI(i) : GOPA(i)), x, y, h, ...o }); }
function flute(hx, hy) { ctx.save(); ctx.translate(hx, hy); ctx.rotate(-0.9); cut(P_rr(-12, -150, 24, 260, 10), '#B07A3A', { shadow: 0.4, edge: 3 }); for (let i = 0; i < 4; i++) circle(0, -110 + i * 40, 5, P.ink); ctx.restore(); }

// ═════════════ LAKSHMAN REKHA ADDITIONS ═════════════
const RAMA = { skin: '#3F6FA8', robe: '#E0B23C', trim: P.crimson, head: 'jata', sash: P.crimson };
const LAKSH = { skin: '#E3B98F', robe: '#C8702F', trim: P.gold, head: 'jata', sash: P.wine };
const SITA = { skin: '#E3B98F', robe: P.crimson, trim: P.gold, head: 'bun', sari: true };
const SANNYASI = { skin: '#B98A68', robe: '#C8702F', trim: P.wine, head: 'sage', sash: '#A85A28' };
const RAVANA = { skin: '#A88E78', robe: P.ink, trim: P.gold, head: 'crown', sash: P.crimson };
const MANDO = { skin: '#E3B98F', robe: P.royal, trim: P.gold, head: 'queen', sari: true };
const SAGE = { skin: '#D6A57A', robe: '#EFE6D0', trim: P.sepia, head: 'sage', sash: '#C8702F' };
function bow(hx, hy, s = 1, draw = 0) { ctx.save(); ctx.translate(hx, hy); ctx.scale(s, s); ctx.strokeStyle = '#6B4E32'; ctx.lineWidth = 14; ctx.lineCap = 'round'; ctx.beginPath(); ctx.arc(-120, 0, 190, -1.0, 1.0); ctx.stroke(); ctx.strokeStyle = P.edge; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(-120 + 190 * Math.cos(-1.0), 190 * Math.sin(-1.0)); ctx.lineTo(-20 - draw * 60, 0); ctx.lineTo(-120 + 190 * Math.cos(1.0), 190 * Math.sin(1.0)); ctx.stroke(); ctx.restore(); }
function arrowShaft(x, y, s = 1, rot = 0) { ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s); cut(P_rr(-120, -5, 200, 10, 4), '#8A6A48', { shadow: 0.3, edge: 2 }); cut(P_poly([[80, -16], [120, 0], [80, 16]]), '#9C9C9C', { shadow: 0.3, edge: 2 }); cut(P_poly([[-120, 0], [-150, -18], [-100, 0], [-150, 18]]), P.crimson, { shadow: 0.2, edge: 2 }); ctx.restore(); }
/** the golden deer facing right, standing on (x, y); leap 0..1 lifts it in an arc pose */
function deer(x, y, s = 1, t = 0, leap = 0, a = 1) {
  if (a <= 0 || s <= 0) return; ctx.save(); ctx.globalAlpha = clamp(a); ctx.translate(x, y - Math.sin(leap * Math.PI) * 160 * s); ctx.scale(s, s); ctx.rotate(-0.25 * Math.sin(leap * TAU));
  glow(0, -220, 260, 0.6 + 0.2 * Math.sin(t * 5)); const col = '#D9A531', dk = '#B8862A';
  for (const [lx, k] of [[-90, 1], [-60, -1], [70, 1], [100, -1]]) { const sw = leap > 0 ? (k * 0.5) : Math.sin(t * 2 + k) * 0.05; ctx.save(); ctx.translate(lx, -150); ctx.rotate(sw); cut(P_rr(-11, 0, 22, 150, 8), k < 0 ? dk : col, { shadow: 0.4, edge: 3 }); ctx.restore(); }
  cut(() => { ctx.beginPath(); ctx.ellipse(0, -200, 140, 62, 0, 0, TAU); }, col);
  cut(P_poly([[90, -230], [150, -350], [190, -340], [140, -210]]), col, { shadow: 0.3, edge: 3 });
  cut(() => { ctx.beginPath(); ctx.ellipse(190, -360, 52, 28, 0.4, 0, TAU); }, col, { shadow: 0.3, edge: 3 });
  ctx.strokeStyle = '#8A6A30'; ctx.lineWidth = 7; ctx.lineCap = 'round'; for (const k of [0, 1]) { ctx.beginPath(); ctx.moveTo(165 + k * 15, -385); ctx.lineTo(150 + k * 25, -450); ctx.lineTo(125 + k * 25, -480); ctx.moveTo(152 + k * 25, -440); ctx.lineTo(185 + k * 25, -470); ctx.stroke(); }
  for (let i = 0; i < 9; i++) circle(-100 + (i % 5) * 45 + (i > 4 ? 22 : 0), -215 + (i > 4 ? 30 : 0), 9, '#F4EFE2');
  circle(205, -368, 6, P.ink); cut(P_poly([[-135, -215], [-175, -250], [-150, -200]]), col, { shadow: 0.2, edge: 2 });
  ctx.restore(); sparkles(x, y - 220 * s, 220 * s, t, 0.7 * a);
}
function forestTree(x, y, s = 1, g = 0, t = 0) { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); cut(P_rr(-26, -280, 52, 280, 10), P.sepia); for (const [px, py, r] of [[0, -400, 140], [-110, -320, 100], [110, -320, 100]]) cut(P_circ(px, py, r), P.forest, { shadow: 0.4, edge: 4 }); if (g > 0) { glow(0, -380, 220, g * (0.7 + 0.2 * Math.sin(t * 3 + x))); for (let i = 0; i < 5; i++) circle(-90 + rnd(i + x) * 180, -460 + rnd(i + 3 + x) * 160, 10 * g, P.gold); } ctx.restore(); }
function forest(t, g = 0) { forestTree(90, 1430, 0.95, g, t); forestTree(1000, 1440, 1.0, g, t); forestTree(300, 1250, 0.6, g, t); forestTree(800, 1240, 0.55, g, t); }
function kuti(x = 540, y = 1480, s = 1) { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); cut(P_rr(-170, -230, 340, 230, 6), '#C9A86A'); ctx.strokeStyle = '#8A6E3A'; ctx.lineWidth = 5; for (let i = 0; i < 8; i++) { ctx.beginPath(); ctx.moveTo(-160 + i * 45, -225); ctx.lineTo(-160 + i * 45, -5); ctx.stroke(); } cut(P_rr(-40, -150, 80, 150, [36, 36, 0, 0]), '#5A4028', { shadow: 0, edge: 3 }); cut(P_poly([[-220, -210], [0, -400], [220, -210]]), '#9C8A52', { shadow: 0.5, edge: 4 }); ctx.strokeStyle = '#7A6A3A'; for (let i = 0; i < 7; i++) { ctx.beginPath(); ctx.moveTo(-200 + i * 66, -215); ctx.lineTo(0, -390); ctx.stroke(); } ctx.restore(); }
function forestPage(seed, dark = 0) { skyPage(seed, '#DCCB98'); cloud(260, 380, 0.8, 0.8); cloud(820, 300, 0.7, 0.8); wash(C.dusk, dark); }
function grass(y = 1480) { cut(() => { ctx.beginPath(); ctx.moveTo(-300, H + 300); ctx.lineTo(-300, y); for (let x = -300; x <= W + 300; x += 60) { ctx.lineTo(x + 20, y - 26); ctx.lineTo(x + 40, y); } ctx.lineTo(W + 300, H + 300); ctx.closePath(); }, '#8C9A5E', { shadow: 0.6, edge: 4 }); }
/** the famous line on the ground, drawn from left to right (p), glowing */
function rekha(x0, x1, y, p = 1, a = 1, col = '242,160,60') { if (p <= 0.01 || a <= 0) return; ctx.save(); ctx.globalAlpha = clamp(a); const x = lerp(x0, x1, p); ctx.shadowColor = `rgba(${col},0.9)`; ctx.shadowBlur = 30; ctx.strokeStyle = `rgb(${col})`; ctx.lineWidth = 14; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(x0, y); for (let xx = x0; xx <= x; xx += 20) ctx.lineTo(xx, y + Math.sin(xx * 0.05) * 5); ctx.stroke(); ctx.restore(); }
function rings(x, y, t, a = 1, col = P.crimson, n = 4) { if (a <= 0) return; ctx.save(); ctx.globalAlpha = clamp(a); ctx.strokeStyle = col; ctx.lineWidth = 10; for (let i = 0; i < n; i++) { const k = (t * 1.2 + i / n) % 1; ctx.globalAlpha = clamp(a) * (1 - k); ctx.beginPath(); ctx.arc(x, y, 60 + k * 380, -0.7, 0.7); ctx.stroke(); ctx.beginPath(); ctx.arc(x, y, 60 + k * 380, Math.PI - 0.7, Math.PI + 0.7); ctx.stroke(); } ctx.restore(); }
function smoke(x, y, p, seed = 0) { if (p <= 0 || p >= 1) return; for (let i = 0; i < 8; i++) { const a = rnd(i + seed) * TAU, r = eo(p) * (60 + rnd(i + 2) * 160); ctx.save(); ctx.globalAlpha = 1 - p; cut(P_circ(x + Math.cos(a) * r, y + Math.sin(a) * r * 0.6 - p * 80, 40 + rnd(i) * 40 + p * 40), '#8E8676', { shadow: 0, edge: 3 }); ctx.restore(); } }
/** a dark rakshasa silhouette (Maricha / shadow) standing on (x, y) */
function rakshasaShadow(x, y, h, a = 1) { if (a <= 0) return; ctx.save(); ctx.globalAlpha = clamp(a); person({ skin: '#3B2E3A', robe: '#2A2230', trim: '#5A3A4A', head: 'none', x, y, h, arm: 140, back: 150 }); ctx.save(); ctx.translate(x, y - h * 540 / 640); const s = h / 640; ctx.scale(s, s); for (const k of [-1, 1]) cut(P_poly([[k * 30, -50], [k * 70, -130], [k * 55, -40]]), '#2A2230', { shadow: 0.2, edge: 3 }); circle(-22, -5, 9, P.crimson); circle(22, -5, 9, P.crimson); ctx.restore(); ctx.restore(); }
/** Ravana in his own form: crowned with ten heads (five each side, smaller) */
function ravana(x, y, h, o = {}) { const s = h / 640; for (let i = 4; i >= 0; i--) for (const k of [-1, 1]) { if (k === 1 && i === 4) continue; ctx.save(); ctx.translate(x + k * (i + 1) * 62 * s, y - 540 * s + (i + 1) * 12 * s); ctx.scale(s * 0.72, s * 0.72); cut(P_circ(0, 0, 66), '#9A8070', { shadow: 0.3, edge: 3 }); cut(P_poly([[-50, -40], [-54, -100], [-25, -80], [0, -125], [25, -80], [54, -100], [50, -40]]), P.gold, { shadow: 0.3, edge: 3 }); ctx.restore(); } person({ ...RAVANA, x, y, h, ...o }); }
function danda(hx, hy) { cut(P_rr(hx - 7, hy - 300, 14, 520, 6), '#8A6A48', { shadow: 0.4, edge: 3 }); }
function kamandal(hx, hy) { lota(hx, hy + 70, 0.9); }
function mat(x, y, s = 1) { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); cut(() => { ctx.beginPath(); ctx.ellipse(0, 0, 150, 34, 0, 0, TAU); }, '#B9A15E', { shadow: 0.4, edge: 4 }); ctx.strokeStyle = '#8A7A3A'; ctx.lineWidth = 4; for (let i = -3; i <= 3; i++) { ctx.beginPath(); ctx.moveTo(i * 38, -28); ctx.lineTo(i * 38, 28); ctx.stroke(); } ctx.restore(); }
function tv(x, y, s, inner, t = 0) { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); for (const k of [-1, 1]) line([[k * 20, -300], [k * 120, -440]], P.ink, 8); cut(P_rr(-330, -300, 660, 500, 40), '#6B4E32'); cut(P_rr(-290, -260, 470, 420, 30), '#2B3340', { shadow: 0, edge: 3 }); ctx.save(); ctx.beginPath(); ctx.roundRect(-290, -260, 470, 420, 30); ctx.clip(); inner(); ctx.restore(); for (const k of [0, 1]) circle(245, -150 + k * 110, 30, '#C8952F'); for (const k of [-1, 1]) cut(P_rr(k * 220 - 15, 200, 30, 70, 6), '#4A3828', { shadow: 0.3, edge: 2 }); ctx.restore(); }
function scrollCard(lines_, x, y, sc = 1, size = 60) { if (sc <= 0) return; ctx.save(); ctx.translate(x, y); ctx.scale(sc, sc); ctx.font = `800 ${size}px NotoDeva`; const w = Math.max(...lines_.map((l) => ctx.measureText(l).width)) + 110, h = lines_.length * size * 1.6 + 90; cut(P_rr(-w / 2, -h / 2, w, h, 10), '#EFE2BE'); for (const k of [-1, 1]) cut(P_rr(-w / 2 - 20, k * h / 2 - 22, w + 40, 44, 22), P.wine, { shadow: 0.4, edge: 3 }); ctx.fillStyle = P.ink; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; lines_.forEach((l, i) => ctx.fillText(l, 0, (i - (lines_.length - 1) / 2) * size * 1.6 + 6)); ctx.restore(); }
function bubble(x, y, s, t) { if (s <= 0) return; ctx.save(); ctx.translate(x, y); ctx.scale(s, s); cut(() => { ctx.beginPath(); ctx.roundRect(-300, -200, 600, 360, 60); ctx.moveTo(-120, 150); ctx.lineTo(-200, 270); ctx.lineTo(-30, 155); }, '#F4EFE2'); for (let i = 0; i < 3; i++) circle(-120 + i * 120, -20, 34 + 6 * Math.sin(t * 6 + i), [P.crimson, P.gold, P.royal][i]); ctx.restore(); }

// ═════════════ AHALYA ADDITIONS ═════════════
const VISHWA = { skin: '#D6A57A', robe: '#C8702F', trim: P.gold, head: 'sage', sash: P.wine };
const GAUTAMA = { skin: '#C99468', robe: '#EFE6D0', trim: P.sepia, head: 'sage', sash: '#8C9A5E' };
const AHALYA = { skin: '#E3B98F', robe: '#2E7D6B', trim: P.gold, head: 'bun', sari: true };
/** a grey rock, optionally with the outline of a seated woman (the popular "shila" image) */
function shila(x, y, s = 1, fig = 0, crack = 0) {
  if (s <= 0) return; ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  cut(() => { ctx.beginPath(); ctx.moveTo(-240, 0); ctx.bezierCurveTo(-260, -140, -170, -300, -40, -320); ctx.bezierCurveTo(110, -340, 250, -220, 240, -60); ctx.lineTo(240, 0); ctx.closePath(); }, '#9A958A', { shadow: 0.6, edge: 5 });
  cut(() => { ctx.beginPath(); ctx.ellipse(-60, -230, 70, 40, -0.3, 0, TAU); }, '#ADA89C', { shadow: 0, edge: 0 });
  if (fig > 0) { ctx.save(); ctx.globalAlpha = clamp(fig) * 0.7; ctx.strokeStyle = '#6E6A60'; ctx.lineWidth = 8; ctx.lineCap = 'round'; ctx.beginPath(); ctx.arc(0, -230, 42, 0, TAU); ctx.moveTo(-30, -190); ctx.quadraticCurveTo(-90, -60, -110, -20); ctx.moveTo(30, -190); ctx.quadraticCurveTo(90, -60, 110, -20); ctx.moveTo(-110, -20); ctx.lineTo(110, -20); ctx.stroke(); ctx.restore(); }
  if (crack > 0) { ctx.strokeStyle = P.ink; ctx.lineWidth = 6; ctx.beginPath(); const pts = [[-20, -320], [10, -240], [-30, -170], [20, -90], [-10, 0]]; const n = Math.max(1, Math.floor(pts.length * clamp(crack))); ctx.moveTo(...pts[0]); for (let i = 1; i < n; i++) ctx.lineTo(...pts[i]); ctx.stroke(); }
  ctx.restore();
}
function dryTree(x, y, s = 1) { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.strokeStyle = '#6B4E32'; ctx.lineCap = 'round'; const br = (x0, y0, a, l, w) => { if (l < 30) return; const x1 = x0 + Math.cos(a) * l, y1 = y0 + Math.sin(a) * l; ctx.lineWidth = w; ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.stroke(); br(x1, y1, a - 0.45, l * 0.68, w * 0.65); br(x1, y1, a + 0.4, l * 0.62, w * 0.65); }; br(0, 0, -Math.PI / 2, 230, 34); ctx.restore(); }
function ruinedAshram(t, life = 0) {
  dryTree(140, 1460, 1.1); dryTree(950, 1450, 0.95);
  kuti(540, 1440, 1.0);
  if (life < 1) { ctx.save(); ctx.globalAlpha = 1 - life; ctx.strokeStyle = '#5F7040'; ctx.lineWidth = 7; for (let i = 0; i < 6; i++) { ctx.beginPath(); const x0 = 380 + i * 60; ctx.moveTo(x0, 1440); ctx.bezierCurveTo(x0 + 30, 1380, x0 - 30, 1330, x0 + 10, 1260 - rnd(i) * 80); ctx.stroke(); } ctx.restore(); }
}
function ashGround(x, y, s = 1) { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); cut(() => { ctx.beginPath(); ctx.ellipse(0, 0, 220, 50, 0, 0, TAU); }, '#A39D93', { shadow: 0.4, edge: 4 }); for (let i = 0; i < 14; i++) circle(-180 + rnd(i) * 360, -20 + rnd(i + 5) * 40, 6, '#7E786E'); ctx.restore(); }
function flame(x, y, s = 1, t = 0) { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); glow(0, -120, 260, 0.8 + 0.2 * Math.sin(t * 8)); for (const [w_, h_, c, k] of [[110, 300, '#D9602E', 0], [75, 220, '#F2A93B', 1], [40, 130, '#FBE3A0', 2]]) cut(() => { ctx.beginPath(); ctx.moveTo(-w_, 0); ctx.quadraticCurveTo(-w_ * 1.1, -h_ * 0.6, Math.sin(t * 7 + k) * 15, -h_); ctx.quadraticCurveTo(w_ * 1.1, -h_ * 0.6, w_, 0); ctx.closePath(); }, c, { shadow: 0, edge: 0 }); ctx.restore(); }
function smokeCloud(x, y, s, a = 1, t = 0) { if (a <= 0) return; ctx.save(); ctx.globalAlpha = clamp(a); for (let i = 0; i < 9; i++) { const ang = i / 9 * TAU + t * 0.3; cut(P_circ(x + Math.cos(ang) * 170 * s, y + Math.sin(ang) * 120 * s, (90 + rnd(i) * 40) * s), i % 2 ? '#8E8676' : '#A39D93', { shadow: 0.2, edge: 3 }); } ctx.restore(); }
function windLines(x, y, t, a = 1) { if (a <= 0) return; ctx.save(); ctx.globalAlpha = clamp(a); ctx.strokeStyle = '#6E8AA0'; ctx.lineWidth = 9; ctx.lineCap = 'round'; for (let i = 0; i < 3; i++) { const o = ((t * 0.8 + i * 0.33) % 1) * 60; ctx.beginPath(); ctx.moveTo(x - 90 + o, y - 50 + i * 50); ctx.lineTo(x + 50 + o, y - 50 + i * 50); ctx.arc(x + 50 + o, y - 70 + i * 50, 20, Math.PI / 2, -Math.PI, true); ctx.stroke(); } ctx.restore(); }
function plate(x, y, s = 1) { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); cut(() => { ctx.beginPath(); ctx.ellipse(0, 0, 110, 40, 0, 0, TAU); }, '#C8952F', { shadow: 0.4, edge: 3 }); cut(() => { ctx.beginPath(); ctx.ellipse(0, -4, 80, 26, 0, 0, TAU); }, '#E0B23C', { shadow: 0, edge: 0 }); ctx.restore(); }
function petalRain(t, a = 1, seed = 0) { if (a <= 0) return; ctx.save(); ctx.globalAlpha = clamp(a); for (let i = 0; i < 26; i++) { const x = rnd(i + seed) * W, y = ((rnd(i + 9 + seed) * 1400 + t * (160 + rnd(i) * 80)) % 1500) - 100; ell(x + Math.sin(t * 2 + i) * 30, y, 16, 10, [C.saffron, P.gold, P.crimson, C.lotus2][i % 4], t * 2 + i); } ctx.restore(); }
function sunMoon(t, a = 1) { if (a <= 0) return; ctx.save(); ctx.globalAlpha = clamp(a); for (let k = 0; k < 2; k++) { const ang = t * 2.4 + k * Math.PI, x = 540 + Math.cos(ang) * 420, y = 760 + Math.sin(ang) * 330; if (k === 0) { glow(x, y, 120, 0.8); cut(P_circ(x, y, 55), '#F2B33D', { shadow: 0.3, edge: 3 }); } else { cut(P_circ(x, y, 48), '#F4EFE2', { shadow: 0.3, edge: 3 }); circle(x + 18, y - 10, 40, 'rgba(231,215,174,0.9)'); } } ctx.restore(); }
/** a person bowing low toward +dir (rotates around the feet) */
function bowing(o, k) { ctx.save(); ctx.translate(o.x, o.y); ctx.rotate((o.dir || 1) * rad(35) * clamp(k)); person({ ...o, x: 0, y: 0, arm: lerp(o.arm ?? 10, 50, k) }); ctx.restore(); }
function ashramPage(seed, dark = 0) { forestPage(seed, dark); }

// ═════════════ HANUMAN ADDITIONS ═════════════
const HANU = { skin: '#C98B4A', robe: '#D9602E', trim: P.gold, head: 'crown', sash: P.crimson };
const BAL = { skin: '#C98B4A', robe: '#D9602E', trim: P.gold, head: 'none', sash: P.crimson };
const VANARA = (i) => ({ skin: ['#A77B52', '#8E6A48', '#B88A5A'][i % 3], robe: ['#6F8A4A', '#8A6A48', '#7A2E3A'][i % 3], trim: P.gold, head: 'none' });
const JAMBA = { skin: '#4A3A30', robe: '#8A6A48', trim: P.gold, head: 'sage', sash: '#5A4028' };
const ANJANA = { skin: '#C99468', robe: '#2E7D6B', trim: P.gold, head: 'bun', sari: true };
const VAYU = { skin: '#BFD3D8', robe: '#6E8AA0', trim: P.gold, head: 'crown', sash: '#E7EEF0' };
const BRAHMA = { skin: '#E0B070', robe: P.crimson, trim: P.gold, head: 'crown', beard: true };
const DEVA = { skin: P.skin, robe: P.royal, trim: P.gold, head: 'crown' };
/** a vanara (or bear with tail=false): tail behind, round ears, a lighter muzzle. Same options as person() */
function vanara(o, tail = true) {
  const h = o.h || 640, d = o.dir || 1, s = h / 640;
  if (tail) { ctx.save(); ctx.translate(o.x, o.y + (o.bob || 0)); ctx.scale(s * d, s); const wv = Math.sin((o.t || 0) * 3) * 20; ctx.strokeStyle = P.edge; ctx.lineCap = 'round'; ctx.lineWidth = 40; const tp = () => { ctx.beginPath(); ctx.moveTo(-60, -280); ctx.bezierCurveTo(-260, -260, -300, -520 + wv, -200, -640); ctx.quadraticCurveTo(-130, -700, -150, -600); }; tp(); ctx.stroke(); ctx.strokeStyle = o.skin; ctx.lineWidth = 30; tp(); ctx.stroke(); ctx.restore(); }
  person(o);
  ctx.save(); ctx.translate(o.x, o.y + (o.bob || 0)); ctx.scale(s * d, s);
  for (const k of [-1, 1]) cut(P_circ(k * 64, -545, 24), o.skin, { shadow: 0.3, edge: 3 });
  cut(() => { ctx.beginPath(); ctx.ellipse(26, -512, 42, 30, 0, 0, TAU); }, o.muzzle || '#E8C9A0', { shadow: 0.2, edge: 3 });
  if (o.head === 'crown') { cut(P_poly([[-58, -580], [-62, -660], [-30, -640], [0, -700], [30, -640], [62, -660], [58, -580]]), P.gold, { shadow: 0.5, edge: 4 }); circle(0, -625, 10, P.crimson); }
  ctx.restore();
}
function gada(hx, hy) { cut(P_rr(hx - 9, hy - 330, 18, 380, 6), '#8A6A48', { shadow: 0.4, edge: 3 }); cut(P_circ(hx, hy - 350, 62), P.gold, { shadow: 0.5, edge: 4 }); circle(hx, hy - 350, 18, P.crimson); }
function mountain(x, y, s = 1, col = P.stone, col2 = P.stoneDark) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  cut(P_poly([[-330, 0], [-50, -700], [40, -700], [330, 0]]), col);
  cut(P_poly([[0, -700], [40, -700], [330, 0], [70, 0]]), col2, { shadow: 0, edge: 0 });
  for (const [px, py, r] of [[-20, -690, 50], [40, -670, 40]]) cut(P_circ(px, py, r), P.forest, { shadow: 0.3, edge: 3 });
  ctx.restore();
}
function hills(y = 1500) { mountain(150, y, 0.8, '#B7A07A', '#9C8660'); mountain(930, y, 0.95, '#B7A07A', '#9C8660'); mountain(560, y + 40, 0.6, P.stone, P.stoneDark); }
function sun(x, y, r, t, a = 1) { if (a <= 0) return; ctx.save(); ctx.globalAlpha = clamp(a); glow(x, y, r * 3.2, 0.9); ctx.translate(x, y); ctx.rotate(t * 0.3); for (let i = 0; i < 12; i++) { ctx.save(); ctx.rotate(i * TAU / 12); cut(P_poly([[-16, -r - 10], [0, -r - 70], [16, -r - 10]]), '#E8B43C', { shadow: 0.2, edge: 3 }); ctx.restore(); } cut(P_circ(0, 0, r), '#E8B43C', { shadow: 0.4, edge: 4 }); circle(0, 0, r * 0.7, '#F2C14E'); ctx.restore(); }
/** a ripe mango-like fruit with a leaf */
function fruit(x, y, s = 1) { if (s <= 0) return; ctx.save(); ctx.translate(x, y); ctx.scale(s, s); cut(() => { ctx.beginPath(); ctx.ellipse(0, 0, 110, 130, 0.25, 0, TAU); }, '#E0782F', { shadow: 0.5, edge: 4 }); cut(() => { ctx.beginPath(); ctx.ellipse(-30, -40, 40, 55, 0.25, 0, TAU); }, '#F2A93B', { shadow: 0, edge: 0 }); cut(P_rr(-6, -170, 12, 50, 4), P.sepia, { shadow: 0.3, edge: 2 }); cut(() => { ctx.beginPath(); ctx.moveTo(0, -150); ctx.quadraticCurveTo(60, -210, 130, -170); ctx.quadraticCurveTo(60, -120, 0, -150); }, C.leaf, { shadow: 0.3, edge: 3 }); ctx.restore(); }
function sea(t, y0 = 1250) { for (let i = 0; i < 4; i++) { const y = y0 + i * 100; cut(() => { ctx.beginPath(); ctx.moveTo(-300, H + 300); ctx.lineTo(-300, y); for (let x = -300; x <= W + 300; x += 30) ctx.lineTo(x, y + Math.sin(x * 0.011 + t * 1.4 * (i % 2 ? -1 : 1) + i) * 16); ctx.lineTo(W + 300, H + 300); ctx.closePath(); }, [P.sea, P.seaDark, P.sea, '#7E9893'][i], { shadow: 0.6, edge: 5 }); } }
function shore(y = 1480) { cut(() => { ctx.beginPath(); ctx.moveTo(-300, H + 300); ctx.lineTo(-300, y); ctx.quadraticCurveTo(300, y - 60, 700, y + 10); ctx.lineTo(W + 300, y + 60); ctx.lineTo(W + 300, H + 300); ctx.closePath(); }, '#D9C08E', { shadow: 0.5, edge: 5 }); }
function rock(x, y, s = 1) { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); cut(() => { ctx.beginPath(); ctx.moveTo(-120, 0); ctx.quadraticCurveTo(-110, -110, 0, -110); ctx.quadraticCurveTo(110, -110, 120, 0); ctx.closePath(); }, '#9A958A', { shadow: 0.5, edge: 4 }); ctx.restore(); }
/** the vajra: a golden double-ended thunderbolt */
function vajra(x, y, s = 1, rot = 0) { if (s <= 0) return; ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s); glow(0, 0, 160, 0.6); cut(P_rr(-16, -60, 32, 120, 10), P.gold, { shadow: 0.4, edge: 3 }); cut(P_circ(0, 0, 26), '#A87A22', { shadow: 0.3, edge: 3 }); for (const k of [-1, 1]) { cut(() => { ctx.beginPath(); ctx.moveTo(0, k * 50); ctx.quadraticCurveTo(-70, k * 110, 0, k * 170); ctx.quadraticCurveTo(70, k * 110, 0, k * 50); }, P.gold, { shadow: 0.4, edge: 3 }); cut(P_poly([[-8, k * 160], [0, k * 210], [8, k * 160]]), '#A87A22', { shadow: 0.2, edge: 2 }); } ctx.restore(); }
/** a zig-zag light streak from (x0,y0) toward (x1,y1), drawn to p */
function bolt(x0, y0, x1, y1, p = 1, a = 1) { if (p <= 0.02 || a <= 0) return; ctx.save(); ctx.globalAlpha = clamp(a); ctx.shadowColor = 'rgba(242,200,90,0.9)'; ctx.shadowBlur = 30; ctx.strokeStyle = '#F7E3A0'; ctx.lineWidth = 14; ctx.lineJoin = 'round'; ctx.beginPath(); ctx.moveTo(x0, y0); const n = 8; for (let i = 1; i <= Math.ceil(n * p); i++) { const k = Math.min(i / n, p); ctx.lineTo(lerp(x0, x1, k) + (i < n ? (i % 2 ? 40 : -40) : 0), lerp(y0, y1, k)); } ctx.stroke(); ctx.restore(); }
function flash(a) { wash('#FFF6DA', a); }
/** a thought cloud holding a drawing */
function thoughtOf(x, y, s, inner) { if (s <= 0) return; ctx.save(); ctx.translate(x, y); ctx.scale(s, s); for (const [dx, dy, r] of [[-170, 230, 20], [-130, 170, 30]]) cut(P_circ(dx, dy, r), C.white, { shadow: 0.3, edge: 3 }); cloud(0, 0, 1.35); inner(); ctx.restore(); }
/** three stacked bands: heaven, earth, the netherworld; still = wind stopped 0..1 */
function threeLokas(t, still = 0) {
  const sw = (1 - still);
  cut(P_rr(-300, -300, W + 600, 820, 0), '#E7D7AE', { shadow: 0, edge: 0 }); cloud(300, 260, 0.8); cloud(800, 360, 0.7); palace(540, 470, 0.45, 1 - still * 0.8);
  cut(P_rr(-300, 520, W + 600, 480, 0), '#DCCB98', { shadow: 0.6, edge: 5 }); for (const [x, s] of [[200, 0.55], [540, 0.6], [880, 0.55]]) { ctx.save(); ctx.translate(x, 990); ctx.rotate(Math.sin(t * 3 + x) * 0.06 * sw); forestTree(0, 0, s); ctx.restore(); }
  cut(P_rr(-300, 1000, W + 600, 1200, 0), '#3E3550', { shadow: 0.6, edge: 5 }); for (let i = 0; i < 5; i++) diya(160 + i * 190, 1260, 0.7, t * sw);
  for (const [x, y] of [[300, 120], [760, 700], [420, 1140]]) windLines(x, y, t, sw);
}
/** Brahma: three visible crowned, bearded heads */
function brahma(x, y, h, o = {}) { const s = h / 640; for (const k of [-1, 1]) { ctx.save(); ctx.translate(x + k * 95 * s, y - 520 * s); ctx.scale(s * 0.78, s * 0.78); cut(P_circ(0, 0, 66), BRAHMA.skin, { shadow: 0.3, edge: 3 }); cut(P_poly([[-50, -40], [-54, -100], [-25, -80], [0, -125], [25, -80], [54, -100], [50, -40]]), P.gold, { shadow: 0.3, edge: 3 }); cut(P_poly([[-40, 30], [40, 30], [0, 130]]), C.white, { shadow: 0.3, edge: 3 }); ctx.restore(); } person({ ...BRAHMA, x, y, h, ...o }); }
function sword(x, y, s = 1, rot = 0) { ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s); cut(P_poly([[-14, -60], [14, -60], [8, -300], [0, -330], [-8, -300]]), '#B8B8B0', { shadow: 0.4, edge: 3 }); cut(P_rr(-50, -66, 100, 20, 6), P.gold, { shadow: 0.3, edge: 2 }); cut(P_rr(-10, -46, 20, 70, 6), P.sepia, { shadow: 0.3, edge: 2 }); ctx.restore(); }
/** the head of the child seen side-on (no face): skin circle, ear, muzzle; mark 0..1 shows the crimson mark on the left jaw */
function headStudy(x, y, s, mark = 0, t = 0) { if (s <= 0) return; ctx.save(); ctx.translate(x, y); ctx.scale(s, s); cut(P_circ(-150, -30, 60), BAL.skin, { shadow: 0.4, edge: 4 }); cut(P_circ(0, 0, 230), BAL.skin); cut(() => { ctx.beginPath(); ctx.ellipse(110, 80, 150, 110, 0.15, 0, TAU); }, '#E8C9A0', { shadow: 0.3, edge: 4 }); if (mark > 0) { glow(70, 170, 200 * mark, 0.7, '168,50,45'); ctx.save(); ctx.translate(70, 170); ctx.rotate(t); ctx.fillStyle = P.crimson; ctx.beginPath(); for (let i = 0; i < 16; i++) { const r = i % 2 ? 30 : 80 * mark; ctx.lineTo(Math.cos(i * TAU / 16) * r, Math.sin(i * TAU / 16) * r); } ctx.closePath(); ctx.fill(); ctx.restore(); } ctx.restore(); }

export function buildShots() {
  const S = [], CUES = [], add = (o) => (S.push(o), o), cue = (t, type, o = {}) => CUES.push({ t: +t.toFixed(3), type, ...o });
  const OFF = 2;
  const at = (i) => L(i + OFF) - 0.08;
  const w = (word, i) => Wd(word, i + OFF) - at(i);
  const pop = (lt, a, dur = 0.35) => (lt > a ? eob(seg(lt, a, a + dur)) : 0);
  const shot = (i, o) => { const st = at(i); add({ id: `S${String(i).padStart(2, '0')}`, at: st, ...o }); cue(st, 'whoosh', { gain: 0.5 }); return st; };
  const sub = (id, st, o) => { add({ id, at: st, ...o }); cue(st, 'whoosh', { gain: 0.45 }); return st; };
  const walkBob = (t, k = 1) => -Math.abs(Math.sin(t * 9)) * 12 * k;
  const dawn = (seed, sky = '#F2D6A2') => skyPage(seed, sky);

  // H0a · hook: Hanuman ji with gada, ribbon HANUMAN
  { add({ id: 'H0a', at: 0, cam: [540, 1050], zoom: 0.12, note: 'hook: Hanuman ji glowing on a hill with his gada; ribbon HANUMAN on the name', draw(lt, d, t) {
    dawn(40); sun(820, 520, 110, t, 0.9); hills(1500); grass(1500);
    glow(540, 1100, 460, 0.5); vanara({ ...HANU, x: 540, y: 1580, h: 680, halo: 1, arm: 20, hold: gada, back: 10, t });
    K.ribbon('हनुमान', 540, 300, pop(lt, Wd('हनुमान', 0) - 0.05, 0.45), 100);
  } }); cue(0.05, 'whoosh', { gain: 0.5 }); cue(Wd('हनुमान', 0), 'pop', { gain: 0.6 }); }
  // H0b · ... from an injury: the head study with a crimson mark on the jaw
  { const st = Wd('एक', 0) - 0.12, ch = Wd('चोट', 0) - st; sub('H0b', st, { cam: [540, 900], zoom: 0.14, note: 'hook: the child\'s head side-on, a crimson burst on the left jaw; slip CHOT', draw(lt, d, t) {
    K.parchment(41); glow(540, 900, 460, 0.4);
    headStudy(540, 900, 1.3, pop(lt, ch - 0.05, 0.4), t);
    K.slip('चोट?', 540, 420, pop(lt, ch), -0.04, 90);
  } }); cue(st + ch, 'thud', { gain: 0.5 }); }
  // H1 · no? come, I'll tell you: Bal Hanuman leaping at the sun, title ribbon
  { const st = L(1) - 0.08, ai = Wd('आइए', 1) - st; add({ id: 'H1', at: st, cam: [540, 1000], zoom: 0.1, note: 'hook: little Hanuman leaping toward a big rising sun; title ribbon', draw(lt, d, t) {
    dawn(42); sun(760, 640, 150, t); hills(1550); grass(1550);
    const k = eo(seg(lt, 0, d)); vanara({ ...BAL, x: lerp(300, 420, k), y: lerp(1450, 1250, k), h: 380, halo: 0.8, arm: 160, back: 140, t });
    K.ribbon('हनुमान नाम कैसे पड़ा', 540, 280, pop(lt, 0.05, 0.45), 70);
    sparkles(760, 640, 260, t, pop(lt, ai));
  } }); cue(st + 0.05, 'pop', { gain: 0.6 }); cue(st + ai, 'sparkle', { dur: 1 }); }

  // 0 · on the seashore the vanara army sat, sad
  { const ki = w('किनारे', 0), se = w('सेना', 0), ud = w('उदास', 0); const st = shot(0, { cam: [540, 1150], zoom: 0.1, note: 'dusk shore: a row of vanaras with lowered heads, the sea behind; ribbon SAMUDRA', draw(lt, d, t) {
    skyPage(1, '#D9C6A0'); wash(C.dusk, 0.15); sea(t, 1150); shore(1470);
    K.ribbon('समुद्र', 540, 300, pop(lt, ki - 0.3, 0.45), 90);
    for (let i = 0; i < 5; i++) { const sad = pop(lt, ud - 0.1, 0.5); ctx.save(); ctx.translate(120 + i * 210, 1580); ctx.rotate(-(i % 2 ? 1 : -1) * 0); vanara({ ...VANARA(i), x: 0, y: sad * 20, h: 420 + (i % 2) * 40, dir: i < 2 ? 1 : -1, arm: lerp(10, 40, sad), back: lerp(10, 40, sad), t: t + i }); ctx.restore(); }
    K.slip('वानर सेना', 300, 620, pop(lt, se), -0.03, 58); K.slip('उदास', 800, 720, pop(lt, ud), 0.04, 66);
  } }); cue(st + se, 'pop'); cue(st + ud, 'plop'); }

  // 1 · a hundred-yojana ocean: who will cross?
  { const yo = w('योजन', 1), ko = w('कौन', 1); const st = shot(1, { cam: [540, 950], zoom: 0.14, note: 'a wide sea, a crimson dashed route stretches across with slip 100 YOJAN; a big ? on KAUN', draw(lt, d, t) {
    skyPage(2, '#D9C6A0'); sea(t, 800); 
    ctx.save(); ctx.setLineDash([30, 22]); ctx.strokeStyle = P.crimson; ctx.lineWidth = 12; ctx.beginPath(); ctx.moveTo(80, 700); ctx.quadraticCurveTo(540, 380, 80 + 920 * eo(seg(lt, 0, yo + 0.4)), 700); ctx.stroke(); ctx.restore();
    K.slip('सौ योजन', 540, 460, pop(lt, yo), -0.03, 72);
    K.slip('?', 540, 1050, pop(lt, ko, 0.35), 0.08, 170);
  } }); cue(st + yo, 'pop'); cue(st + ko, 'pop', { gain: 0.7 }); }

  // 2 · then Jambavan reminded Hanuman ji of his childhood
  { const ja = w('जाम्बवान', 2), ha = w('हनुमान', 2), ba = w('बचपन', 2); const st = shot(2, { cam: [540, 1100], zoom: 0.1, note: 'old bear Jambavan speaks to Hanuman sitting apart; a thought cloud with a little vanara at BACHPAN', draw(lt, d, t) {
    skyPage(3, '#D9C6A0'); sea(t, 1250); shore(1480);
    vanara({ ...JAMBA, x: 250, y: 1580, h: 600, arm: lerp(10, 95, pop(lt, ja)), hold: danda, beard: true }, false);
    rock(800, 1560, 1.2); vanara({ ...HANU, x: 800, y: 1480, h: 560, dir: -1, halo: 0.5 * pop(lt, ha), arm: 20, t });
    thoughtOf(700, 650, pop(lt, ba - 0.1, 0.4), () => { vanara({ ...BAL, x: 0, y: 120, h: 220, halo: 0.6, arm: 90, back: 30, t }); });
    K.slip('जाम्बवान', 250, 700, pop(lt, ja), -0.03, 58);
  } }); cue(st + ja, 'pop'); cue(st + ba, 'sparkle', { dur: 0.8 }); }

  // 3 · Hanuman ji is the son of mother Anjana and Pavan dev
  { const an = w('अंजना', 3), pa = w('पवन', 3), pu = w('पुत्र', 3); const st = shot(3, { cam: [540, 1100], zoom: 0.1, note: 'Anjana holding a glowing baby on a hill; Pavan dev with wind lines on the right', draw(lt, d, t) {
    dawn(4, '#E9D6A8'); hills(1520); grass(1520);
    glow(330, 1150, 360, 0.3 + 0.4 * pop(lt, pu));
    person({ ...ANJANA, x: 330, y: 1580, h: 600, halo: 0.5, arm: 70, back: 70, hold: (x, y) => { glow(x, y - 30, 120, 0.8); cut(() => { ctx.beginPath(); ctx.ellipse(x, y - 20, 70, 44, 0, 0, TAU); }, C.white, { shadow: 0.4, edge: 3 }); cut(P_circ(x + 50, y - 50, 30), BAL.skin, { shadow: 0.3, edge: 3 }); } });
    const v = pop(lt, pa - 0.2, 0.45); if (v > 0) { ctx.save(); ctx.globalAlpha = v; person({ ...VAYU, x: 800, y: 1580, h: 640, dir: -1, halo: 0.8, arm: 60 }); windLines(820, 800, t, 1); windLines(620, 1000, t + 0.3, 1); ctx.restore(); }
    K.slip('अंजना', 330, 700, pop(lt, an), -0.03, 60); K.slip('पवन देव', 800, 620, pop(lt, pa), 0.03, 60);
  } }); cue(st + an, 'pop'); cue(st + pa, 'whoosh', { gain: 0.35 }); cue(st + pu, 'sparkle', { dur: 0.8 }); }

  // 4 · one morning little Hanuman saw the rising sun
  { const su = w('सुबह', 4), na = w('नन्हे', 4), so = w('सूरज', 4); const st = shot(4, { cam: [540, 1100], zoom: 0.12, note: 'dawn: the sun rises over the hills; little Hanuman on a rock turns and points at it', draw(lt, d, t) {
    dawn(5); const r = eo(seg(lt, 0, so + 0.3)); sun(760, lerp(1350, 760, r), 130, t); hills(1520); grass(1520);
    rock(330, 1590, 1.1); vanara({ ...BAL, x: 330, y: 1500, h: 400, halo: 0.6, arm: lerp(10, 110, pop(lt, so - 0.1)), finger: true, t });
    K.slip('सुबह', 300, 480, pop(lt, su), -0.04, 64); K.slip('नन्हे हनुमान', 330, 860, pop(lt, na), 0.03, 52);
  } }); cue(st + su, 'pop'); cue(st + so, 'sparkle', { dur: 0.8 }); }

  // 5 · and took it for a ripe fruit
  { const pa = w('पका', 5), ph = w('फल', 5); const st = shot(5, { cam: [540, 950], zoom: 0.12, note: 'the sun on the left, a ripe fruit pops on the right, an equals sign between', draw(lt, d, t) {
    dawn(6); sun(300, 800, 150, t);
    bigText('=', 560, 800, 200, P.ink, pop(lt, 0.1));
    fruit(810, 830, 1.15 * pop(lt, Math.min(0.35, pa - 0.1), 0.4));
    K.slip('पका फल', 810, 1120, pop(lt, ph), 0.03, 66);
  } }); cue(st + pa, 'pop'); cue(st + ph, 'plop'); }

  // 6 · just like that, to catch the fruit, he leapt into the sky
  { const bs = w('बस', 6), pk = w('पकड़ने', 6), aa = w('आकाश', 6); const st = shot(6, { cam: [540, 1000], zoom: 0.14, note: 'little Hanuman crouches then leaps off the rock, arms up, wind lines behind him', draw(lt, d, t) {
    dawn(7); sun(800, 420, 120, t, 0.9); hills(1560); grass(1560); rock(300, 1620, 1.1);
    const j = eio(seg(lt, aa - 0.35, d + 0.2)); const x = lerp(300, 620, j), y = lerp(1530, 700, j);
    vanara({ ...BAL, x, y, h: 400, halo: 0.6, arm: lerp(30, 165, pop(lt, pk - 0.2)), back: lerp(10, 150, j), t });
    windLines(x - 160, y - 100, t, j);
    K.slip('बस!', 760, 900, pop(lt, bs), 0.04, 80);
  } }); cue(st + aa - 0.1, 'whoosh', { gain: 0.6 }); cue(st + bs, 'pop'); }

  // 7 · Valmiki writes: he flew three hundred yojanas up
  { const va = w('वाल्मीकि', 7), ti = w('तीन', 7), ud = w('उड़', 7); const st = shot(7, { cam: [540, 950], zoom: 0.1, note: 'the child rises past clouds; a crimson dashed altitude line with slip 300 YOJAN; ribbon VALMIKI', draw(lt, d, t) {
    skyPage(8, '#EED9A8'); const k = seg(lt, 0, d);
    for (let i = 0; i < 4; i++) cloud(i % 2 ? 820 : 260, ((300 + i * 420 + k * 900) % 1700) - 50, 0.8);
    ctx.save(); ctx.setLineDash([26, 20]); ctx.strokeStyle = P.crimson; ctx.lineWidth = 10; ctx.beginPath(); ctx.moveTo(160, 1450); ctx.lineTo(160, lerp(1450, 520, eo(seg(lt, ti - 0.3, ud + 0.3)))); ctx.stroke(); ctx.restore();
    vanara({ ...BAL, x: 560, y: 1150 + Math.sin(t * 4) * 15, h: 420, halo: 0.7, arm: 170, back: 160, t }); windLines(560, 1300, t, 1);
    K.ribbon('वाल्मीकि लिखते हैं', 540, 280, pop(lt, va, 0.45), 64); K.slip('तीन सौ योजन', 330, 560, pop(lt, ti), -0.04, 56);
  } }); cue(st + va, 'pop', { gain: 0.6 }); cue(st + ti, 'pop'); }

  // 8 · the sun's heat struck him, but he wasn't scared at all
  { const ta = w('तपन', 8), na = w('नहीं', 8); const st = shot(8, { cam: [540, 950], zoom: 0.12, note: 'huge sun filling the top, heat rings; the child keeps reaching, halo bright; slip NAHIN GHABRAYE', draw(lt, d, t) {
    skyPage(9, '#F2C98A'); sun(540, 420, 300, t); rings(540, 420, t, pop(lt, ta - 0.1, 0.4), '#D9602E', 3); wash('#F2A93B', 0.15 * pop(lt, ta));
    vanara({ ...BAL, x: 540, y: 1450 + Math.sin(t * 4) * 12, h: 440, halo: 0.6 + 0.4 * pop(lt, na), arm: 170, back: 160, t });
    K.slip('तपन', 260, 880, pop(lt, ta), -0.04, 64); K.slip('नहीं घबराए', 790, 960, pop(lt, na), 0.03, 58);
  } }); cue(st + ta, 'sizzle', { dur: 0.7, gain: 0.3 }); cue(st + na, 'pop'); }

  // 9 · seeing this, Devraj Indra became angry
  { const ind = w('इंद्र', 9), kr = w('क्रोधित', 9); const st = shot(9, { cam: [540, 1050], zoom: 0.14, note: 'Indra on white Airavata above clouds; a crimson wash and rings on KRODHIT', draw(lt, d, t) {
    skyPage(10, '#E7D7AE'); heavenClouds(t); wash(P.crimson, 0.15 * pop(lt, kr)); cloudGround(1400);
    const top = elephant(620, 1500, 0.85); person({ ...INDRA, x: top[0] - 120, y: top[1] + 40, h: 440, dir: -1, halo: 0.5, arm: lerp(10, 120, pop(lt, kr)) });
    rings(top[0] - 120, top[1] - 250, t, pop(lt, kr - 0.1, 0.3));
    K.slip('देवराज इंद्र', 300, 420, pop(lt, ind), -0.03, 58);
  } }); cue(st + ind, 'pop'); cue(st + kr, 'slam', { gain: 0.4 }); }

  // 10 · and he hurled his vajra at the child
  { const va = w('वज्र', 10), ch = w('चला', 10); const st = shot(10, { cam: [540, 950], zoom: 0.12, note: 'Indra raises the vajra (top right); it flies down-left with a light streak; a white flash', draw(lt, d, t) {
    skyPage(11, '#E7D7AE'); cloud(300, 1300, 1.1); cloud(820, 1150, 0.9);
    const th = eio(seg(lt, ch - 0.1, ch + 0.5));
    person({ ...INDRA, x: 820, y: 900, h: 520, dir: -1, halo: 0.5, arm: lerp(170, 60, th), hold: th < 0.05 ? (x, y) => vajra(x, y - 40, 0.7 * pop(lt, va - 0.2, 0.35), 0.4) : null });
    if (th > 0.05) { vajra(lerp(760, 200, th), lerp(380, 1300, th), 0.7, th * 8); bolt(780, 360, lerp(760, 200, th), lerp(380, 1300, th), 1, 0.9); }
    flash(0.7 * clamp(1 - Math.abs(lt - (ch + 0.55)) * 5));
    K.slip('वज्र', 300, 500, pop(lt, va), -0.04, 74);
  } }); cue(st + ch, 'whoosh', { gain: 0.7 }); cue(st + ch + 0.5, 'slam', { gain: 0.5 }); }

  // 11 · Hanuman ji fell on a mountain peak
  { const ch = w('चोटी', 11), gi = w('गिरे', 11); const st = shot(11, { cam: [540, 1050], zoom: 0.12, note: 'the child tumbles gently down onto a mountain peak; a dust puff on landing (no injury shown)', draw(lt, d, t) {
    skyPage(12, '#E2CFA2'); mountain(540, 1700, 1.15); 
    const f = eio(seg(lt, 0, gi + 0.15)); ctx.save(); ctx.translate(lerp(820, 560, f), lerp(300, 880, f)); ctx.rotate(lerp(2.4, 0.4, f)); vanara({ ...BAL, x: 0, y: 0, h: 360, halo: 0.4, arm: 120, back: 140, t }); ctx.restore();
    smoke(560, 900, seg(lt, gi + 0.1, gi + 0.9), 5);
    K.slip('पर्वत की चोटी', 300, 520, pop(lt, ch), -0.03, 56);
  } }); cue(st + gi + 0.1, 'thud', { gain: 0.6 }); }

  // 12 · and his left jaw, "hanu", was broken
  { const ba = w('बायाँ', 12), ha = w('हनु', 12), tu = w('टूट', 12); const st = shot(12, { cam: [540, 950], zoom: 0.12, note: 'head study, crimson burst on the left jaw; slips BAYAN JABDA and HANU', draw(lt, d, t) {
    K.parchment(13); headStudy(540, 950, 1.25, pop(lt, ba - 0.1, 0.4), t * 0.5);
    arrow(220, 1350, 560, 1180, eo(seg(lt, ba, ba + 0.4)));
    K.slip('बायाँ जबड़ा', 260, 520, pop(lt, ba), -0.04, 58); K.slip('हनु', 820, 520, pop(lt, ha), 0.04, 90);
  } }); cue(st + ba, 'pop'); cue(st + ha, 'pop', { gain: 0.6 }); cue(st + tu, 'thud', { gain: 0.4 }); }

  // 13 · in Sanskrit, the jaw is called "hanu"
  { const sa = w('संस्कृत', 13), ha = w('हनु', 13); const st = shot(13, { cam: [540, 950], zoom: 0.1, note: 'a palm-leaf pothi, ribbon SANSKRIT, a scroll card HANU = JABDA', draw(lt, d, t) {
    K.parchment(14); glow(540, 800, 420, 0.4);
    K.ribbon('संस्कृत', 540, 320, pop(lt, sa, 0.45), 90); pothi(540, 640, 1.2, eo(seg(lt, 0, 0.8)));
    scrollCard(['हनु  =  जबड़ा'], 540, 1050, pop(lt, ha - 0.1, 0.4), 90);
  } }); cue(st + sa, 'pop', { gain: 0.6 }); cue(st + ha, 'sparkle', { dur: 0.8 }); }

  // 14 · that's why he was named Hanuman!
  { const na = w('नाम', 14), ha = w('हनुमान', 14); const st = shot(14, { cam: [540, 1000], zoom: 0.12, note: 'HANU + MAN builds into HANUMAN in big type; the glowing child below; sparkles', draw(lt, d, t) {
    K.parchment(15); glow(540, 1150, 500, 0.5 * pop(lt, ha));
    if (lt < ha - 0.05) { bigText('हनु', 360, 560, 150, P.crimson, pop(lt, 0.02)); bigText('+', 540, 560, 120, P.ink, pop(lt, na - 0.3)); bigText('मान', 720, 560, 150, P.ink, pop(lt, na - 0.15)); }
    else bigText('हनुमान', 540, 560, 190, P.crimson, pop(lt, ha - 0.05, 0.45));
    vanara({ ...BAL, x: 540, y: 1560, h: 520, halo: 1, arm: 75, back: 75, t });
    sparkles(540, 1150, 330, t, pop(lt, ha));
  } }); cue(st + na, 'pop'); cue(st + ha, 'sparkle', { dur: 1.2 }); }

  // 15 · but seeing his son fallen, Pavan dev was upset
  { const be = w('बेटे', 15), ru = w('रूठ', 15); const st = shot(15, { cam: [540, 1100], zoom: 0.1, note: 'Pavan dev picks up the child and turns away into a cave mouth', draw(lt, d, t) {
    skyPage(16, '#D9C6A0'); wash(C.dusk, 0.2 * pop(lt, ru)); hills(1520); grass(1520);
    cut(() => { ctx.beginPath(); ctx.ellipse(900, 1520, 260, 380, 0, Math.PI, TAU); }, '#3E3550', { shadow: 0.5, edge: 5 });
    const k = eio(seg(lt, ru - 0.2, d + 0.3));
    person({ ...VAYU, x: lerp(420, 760, k), y: 1580, h: 640, dir: k > 0.05 ? 1 : -1, halo: 0.6, arm: 70, back: 70, hold: (x, y) => { cut(P_circ(x + 10, y - 40, 34), BAL.skin, { shadow: 0.3, edge: 3 }); cut(() => { ctx.beginPath(); ctx.ellipse(x - 20, y, 80, 38, 0, 0, TAU); }, BAL.robe, { shadow: 0.3, edge: 3 }); } });
    K.slip('अपने बेटे को', 300, 560, pop(lt, be), -0.03, 56); K.slip('रूठ गए', 760, 700, pop(lt, ru), 0.04, 64);
  } }); cue(st + be, 'pop'); cue(st + ru, 'thud', { gain: 0.4 }); }

  // 16 · and in all three worlds the wind stopped!
  { const ti = w('तीनों', 16), hw = w('हवा', 16), bn = w('बंद', 16); const st = shot(16, { cam: [540, 900], zoom: 0.08, note: 'three bands: heaven, earth, netherworld; wind lines and swaying stop; big cross on BAND', draw(lt, d, t) {
    const still = eio(seg(lt, bn - 0.2, bn + 0.3)); threeLokas(still > 0 ? (bn - 0.2) + (t - lt) + 0 : t, still);
    K.slip('तीनों लोक', 540, 700, pop(lt, ti), -0.03, 60);
    K.slip('हवा', 260, 300, pop(lt, hw), -0.05, 60); bigCross(760, 300, eo(seg(lt, bn, bn + 0.4)));
  } }); cue(st + ti, 'pop'); cue(st + bn, 'slam', { gain: 0.4 }); }

  // 17 · the gods were alarmed, and together they pacified Pavan dev
  { const de = w('देवता', 17), ma = w('मनाया', 17); const st = shot(17, { cam: [540, 1100], zoom: 0.1, note: 'gods with joined palms walk up to Pavan dev holding the child; the wind lines return on MANAYA', draw(lt, d, t) {
    skyPage(18, '#E7D7AE'); heavenClouds(t); cloudGround(1450);
    person({ ...VAYU, x: 900, y: 1580, h: 620, dir: -1, halo: 0.7, arm: 70, back: 70, hold: (x, y) => { cut(P_circ(x + 10, y - 40, 34), BAL.skin, { shadow: 0.3, edge: 3 }); cut(() => { ctx.beginPath(); ctx.ellipse(x - 20, y, 80, 38, 0, 0, TAU); }, BAL.robe, { shadow: 0.3, edge: 3 }); } });
    const g = eo(seg(lt, 0, de + 0.5)); person({ ...DEVA, x: lerp(-200, 70, g), y: 1580, h: 520, halo: 0.4, arm: 75, back: 75, bob: walkBob(t, g < 1 ? 1 : 0) }); person({ ...INDRA, x: lerp(-60, 260, g), y: 1580, h: 560, halo: 0.4, arm: 75, back: 75, bob: walkBob(t + 0.3, g < 1 ? 1 : 0) }); brahma(lerp(100, 470, g), 1580, 600, { halo: 0.6, arm: 75, back: 75, bob: walkBob(t + 0.6, g < 1 ? 1 : 0) });
    windLines(760, 700, t, pop(lt, ma, 0.5));
    K.slip('देवता', 300, 560, pop(lt, de), -0.04, 64); K.slip('मनाया', 760, 520, pop(lt, ma), 0.03, 64);
  } }); cue(st + de, 'pop'); cue(st + ma, 'sparkle', { dur: 0.8 }); }

  // 18 · Brahma ji's boon: no weapon in battle can kill him
  { const br = w('ब्रह्मा', 18); const st = shot(18, { cam: [540, 1050], zoom: 0.1, note: 'Brahma raises a blessing hand over the glowing child; sparkles', draw(lt, d, t) {
    skyPage(19, '#E7D7AE'); heavenClouds(t); cloudGround(1450);
    brahma(330, 1580, 660, { halo: 1, arm: lerp(10, 120, pop(lt, br + 0.2)), back: 40 });
    vanara({ ...BAL, x: 780, y: 1560, h: 420, dir: -1, halo: 1, arm: 75, back: 75, t }); sparkles(780, 1250, 240, t, pop(lt, br + 0.3));
    K.slip('ब्रह्मा जी', 330, 520, pop(lt, br), -0.03, 64);
  } }); cue(st + br + 0.3, 'sparkle', { dur: 1 }); }
  { const st0 = at(18), sh = Wd('शस्त्र', 18 + OFF) - 0.12 - st0, na = w('नहीं', 18) - sh; sub('S18b', st0 + sh, { cam: [540, 950], zoom: 0.12, note: 'weapons (sword, arrows) around the glowing child; a big cross on NAHIN', draw(lt, d, t) {
    K.parchment(20); glow(540, 950, 420, 0.6);
    vanara({ ...BAL, x: 540, y: 1250, h: 460, halo: 1, arm: 75, back: 75, t });
    const p = pop(lt, 0.02, 0.4); sword(220, 1100, p, -0.5); sword(860, 1100, p, 0.5); arrowShaft(300, 600, 1.4 * p, 0.6); arrowShaft(780, 600, 1.4 * p, Math.PI - 0.6);
    bigCross(540, 600, eo(seg(lt, na, na + 0.4)));
    K.slip('शस्त्र', 540, 360, pop(lt, 0.05), -0.03, 66);
  } }); cue(st0 + sh + na, 'slam', { gain: 0.4 }); }

  // 19 · Indra's boon: his death only by his own wish
  { const ind = w('इंद्र', 19); const st = shot(19, { cam: [540, 1050], zoom: 0.1, note: 'Indra, the vajra lowered, blesses the child', draw(lt, d, t) {
    skyPage(21, '#E7D7AE'); heavenClouds(t); cloudGround(1450);
    person({ ...INDRA, x: 330, y: 1580, h: 640, halo: 0.6, arm: lerp(10, 120, pop(lt, ind + 0.2)), holdBack: (x, y) => vajra(x, y + 20, 0.55, 0.2) });
    vanara({ ...BAL, x: 780, y: 1560, h: 420, dir: -1, halo: 1, arm: 75, back: 75, t }); sparkles(780, 1250, 240, t, pop(lt, ind + 0.3));
    K.slip('इंद्र', 330, 520, pop(lt, ind), -0.03, 70);
  } }); cue(st + ind, 'pop'); cue(st + ind + 0.3, 'sparkle', { dur: 1 }); }
  { const st0 = at(19), mr = Wd('मृत्यु', 19 + OFF) - 0.12 - st0, ic = w('इच्छा', 19) - mr; sub('S19b', st0 + mr, { cam: [540, 950], zoom: 0.12, note: 'ribbon ICHCHHA MRITYU over the glowing child, a diya steady', draw(lt, d, t) {
    K.parchment(22); glow(540, 950, 460, 0.6);
    vanara({ ...BAL, x: 540, y: 1300, h: 480, halo: 1, arm: 75, back: 75, t });
    K.ribbon('इच्छा मृत्यु', 540, 420, pop(lt, ic - 0.1, 0.45), 90); diya(540, 1420, 1.1, t);
    K.slip('मृत्यु', 280, 700, pop(lt, 0.05), -0.04, 60);
  } }); cue(st0 + mr + ic, 'sparkle', { dur: 1 }); }

  // 20 · and listen: in Valmiki Ramayana, Hanuman ji does not swallow the sun
  { const su = w('सुनिए', 20); const st = shot(20, { cam: [540, 950], zoom: 0.1, note: 'Valmiki pothi with ribbon; slip AUR SUNIYE', draw(lt, d, t) {
    K.parchment(23); glow(540, 800, 420, 0.5); pothi(540, 800, 1.4, eo(seg(lt, 0, 0.6)));
    K.ribbon('वाल्मीकि रामायण', 540, 360, pop(lt, 0.1, 0.4), 72); K.slip('और सुनिए', 540, 1150, pop(lt, su), -0.03, 64);
  } }); cue(st + su, 'pop'); }
  { const st0 = at(20), ni = Wd('हनुमान', 20 + OFF) - 0.12 - st0, nh = w('नहीं', 20) - ni, ng = w('निगलते', 20) - ni; sub('S20b', st0 + ni, { cam: [540, 950], zoom: 0.12, note: 'the sun inside a thought cloud near the child\'s open hands, a big cross on NAHIN', draw(lt, d, t) {
    dawn(24); hills(1560); grass(1560);
    vanara({ ...BAL, x: 300, y: 1560, h: 440, halo: 0.6, arm: 120, back: 100, t });
    thoughtOf(680, 760, pop(lt, 0.02, 0.4), () => { sun(0, 0, 90, t); });
    K.slip('निगलना?', 680, 1150, pop(lt, ng), 0.03, 60);
    bigCross(680, 760, eo(seg(lt, nh, nh + 0.4)));
  } }); cue(st0 + ni + nh, 'slam', { gain: 0.4 }); }

  // 21 · the swallowing story became famous later, through works like the Hanuman Chalisa
  { const ba = w('बाद', 21); const st = shot(21, { cam: [540, 1000], zoom: 0.1, note: 'old pothi on the left, a crimson arrow of time to a newer book on the right; slip BAAD MEIN', draw(lt, d, t) {
    K.parchment(25); K.ribbon('सूरज निगलना?', 540, 320, pop(lt, 0.05, 0.4), 72); pothi(270, 800, 0.8, 1); K.slip('वाल्मीकि', 270, 980, pop(lt, 0.1), -0.03, 48); arrow(470, 800, 690, 800, eo(seg(lt, ba - 0.1, ba + 0.4)));
    const b = pop(lt, ba + 0.1, 0.4); if (b > 0) { ctx.save(); ctx.translate(850, 800); ctx.scale(b, b); cut(P_rr(-120, -160, 240, 320, 10), P.wine); cut(P_rr(-100, -140, 200, 280, 6), '#EFE2BE', { shadow: 0, edge: 2 }); ctx.restore(); }
    K.slip('बाद में', 580, 1150, pop(lt, ba), -0.03, 70);
  } }); cue(st + ba, 'pop'); }
  { const st0 = at(21), hc = Wd('हनुमान', 21 + OFF) - 0.12 - st0, ra = w('रचनाओं', 21) - hc, ma = w('मशहूर', 21) - hc; sub('S21b', st0 + hc, { cam: [540, 950], zoom: 0.1, note: 'ribbon HANUMAN CHALISA, the chaupai on a scroll card; slip MASHHOOR', draw(lt, d, t) {
    K.parchment(26); glow(540, 800, 440, 0.4);
    K.ribbon('हनुमान चालीसा', 540, 340, pop(lt, 0.02, 0.4), 80);
    scrollCard(['जुग सहस्र जोजन पर भानू', 'लील्यो ताहि मधुर फल जानू'], 540, 760, pop(lt, 0.15, 0.4), 54);
    K.slip('मशहूर', 540, 1130, pop(lt, ma), 0.03, 66);
  } }); cue(st0 + hc, 'sparkle', { dur: 0.8 }); cue(st0 + hc + ma, 'pop'); }

  // 22 · hearing this, Hanuman ji remembered his strength
  { const sh = w('शक्ति', 22), ya = w('याद', 22); const st = shot(22, { cam: [540, 1050], zoom: 0.12, note: 'Hanuman stands up from the rock by the sea, glow and sparkles rise; Jambavan beside', draw(lt, d, t) {
    skyPage(27, '#E9D6A8'); sea(t, 1250); shore(1480);
    vanara({ ...JAMBA, x: 200, y: 1580, h: 540, arm: 60, hold: danda, beard: true }, false);
    const k = pop(lt, ya - 0.2, 0.5); glow(640, 1100, 300 + 200 * k, 0.4 + 0.5 * k);
    vanara({ ...HANU, x: 640, y: 1580 - 40 * (1 - k), h: 600 + 60 * k, halo: 0.5 + 0.5 * k, arm: lerp(20, 60, k), hold: gada, t });
    sparkles(640, 1100, 300, t, k); K.slip('शक्ति', 640, 420, pop(lt, sh), -0.03, 74);
  } }); cue(st + sh, 'pop'); cue(st + ya, 'sparkle', { dur: 1.2 }); }

  // 23 · and he was ready to leap across the ocean!
  { const sa = w('समुद्र', 23), ta = w('तैयार', 23); const st = shot(23, { cam: [540, 950], zoom: 0.12, note: 'Hanuman grows huge on the mountain at the shore, the sea ahead; a crimson dashed leap arc', draw(lt, d, t) {
    skyPage(28, '#E9D6A8'); sea(t, 1300); mountain(250, 1620, 0.9);
    const g = eo(seg(lt, 0, ta + 0.3)); vanara({ ...HANU, x: 260, y: 1060, h: lerp(380, 600, g), halo: 1, arm: 150, back: 20, t, hold: null });
    ctx.save(); ctx.setLineDash([30, 22]); ctx.strokeStyle = P.crimson; ctx.lineWidth = 12; ctx.beginPath(); const p = eo(seg(lt, sa - 0.2, sa + 0.6)); ctx.moveTo(450, 650); ctx.quadraticCurveTo(700 , 250, lerp(450, 1050, p), lerp(650, 600, p)); ctx.stroke(); ctx.restore();
    K.slip('तैयार!', 820, 900, pop(lt, ta), 0.04, 74);
  } }); cue(st + sa, 'whoosh', { gain: 0.5 }); cue(st + ta, 'slam', { gain: 0.4 }); }

  // 24 · did you know? tell us in the comments
  { const pa = w('पता', 24), ko = w('कमेंट', 24); const st = shot(24, { cam: [540, 950], zoom: 0.12, note: 'a big comment bubble, slip COMMENT', draw(lt, d, t) {
    K.parchment(29); bubble(540, 900, pop(lt, 0.05, 0.4), t);
    K.slip('?', 860, 560, pop(lt, pa, 0.3), 0.08, 120);
    K.slip('कमेंट करें', 540, 1250, pop(lt, ko), -0.02, 60);
  } }); cue(st + 0.05, 'pop'); cue(st + ko, 'sparkle', { dur: 0.8 }); }

  // 25 · lesson: never forget your own strength
  { const si = w('सीख', 25), sh = w('शक्ति', 25), bh = w('भूलिए', 25); const st = shot(25, { cam: [540, 1050], zoom: 0.1, note: 'Hanuman ji glowing on the hill at sunrise with his gada; ribbon SEEKH (loops to the hook)', draw(lt, d, t) {
    dawn(30); sun(820, 520, 110, t, 0.9); hills(1500); grass(1500);
    glow(540, 1100, 460, 0.4 + 0.4 * pop(lt, sh));
    vanara({ ...HANU, x: 540, y: 1580, h: 680, halo: 1, arm: 20, hold: gada, t });
    K.ribbon('सीख', 540, 300, pop(lt, si, 0.45), 96); sparkles(540, 1050, 340, t, pop(lt, bh));
  } }); cue(st + si, 'pop', { gain: 0.6 }); cue(st + bh, 'sparkle', { dur: 1.2 }); }

  return { shots: S, cues: CUES };
}
