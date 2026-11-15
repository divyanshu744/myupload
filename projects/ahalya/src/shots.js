// AHALYA: the shot list (Katha style, Hindi). Everything is cut paper on parchment.
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

export function buildShots() {
  const S = [], CUES = [], add = (o) => (S.push(o), o), cue = (t, type, o = {}) => CUES.push({ t: +t.toFixed(3), type, ...o });
  const OFF = 2;
  const at = (i) => L(i + OFF) - 0.08;
  const w = (word, i) => Wd(word, i + OFF) - at(i);
  const pop = (lt, a, dur = 0.35) => (lt > a ? eob(seg(lt, a, a + dur)) : 0);
  const shot = (i, o) => { const st = at(i); add({ id: `S${String(i).padStart(2, '0')}`, at: st, ...o }); cue(st, 'whoosh', { gain: 0.5 }); return st; };
  const sub = (id, st, o) => { add({ id, at: st, ...o }); cue(st, 'whoosh', { gain: 0.45 }); return st; };
  const walkBob = (t, k = 1) => -Math.abs(Math.sin(t * 9)) * 12 * k;

  // H0a · hook: the popular image: a stone with a woman's outline, Rama's foot approaching
  { add({ id: 'H0a', at: 0, cam: [540, 1150], zoom: 0.12, note: 'hook: the famous stone (shila) with a faint woman outline, Rama walks up', draw(lt, d, t) {
    forestPage(40); forest(t); grass(1480);
    shila(380, 1520, 1.15, 1);
    const p = eo(seg(lt, 0.1, 1.6)); person({ ...RAMA, x: lerp(1150, 800, p), y: 1560, h: 600, dir: -1, halo: 1, arm: 10, holdBack: (x, y) => bow(x + 40, y - 120, 0.9), bob: walkBob(t, p < 1 ? 1 : 0) });
    K.slip('अहल्या', 380, 860, pop(lt, 0.3), -0.03, 70);
  } }); cue(0.05, 'whoosh', { gain: 0.5 }); cue(0.3, 'pop'); }
  // H0b · Valmiki's pothi: the stone gets a red cross
  { const st = Wd('वाल्मीकि', 0) - 0.08, pa = Wd('पत्थर', 0) - st, na = Wd('नहीं', 0) - st; sub('H0b', st, { cam: [540, 900], zoom: 0.12, note: 'hook: Valmiki Ramayana pothi, the stone under it gets a big red cross', draw(lt, d, t) {
    K.parchment(41); glow(540, 700, 420, 0.5);
    pothi(540, 600, 1.4, eo(seg(lt, 0, 0.6))); K.ribbon('वाल्मीकि रामायण', 540, 330, pop(lt, 0.02, 0.4), 72);
    shila(540, 1300, 0.9 * pop(lt, pa - 0.2, 0.35), 1); bigCross(540, 1160, eo(seg(lt, na - 0.05, na + 0.4)));
  } }); cue(st + pa, 'thud', { gain: 0.5 }); cue(st + na, 'slam', { gain: 0.5 }); }
  // H1 · "no? come, I'll tell you": Ahalya glowing, title ribbon
  { const st = L(1) - 0.08, ai = Wd('आइए', 1) - st; add({ id: 'H1', at: st, cam: [540, 1050], zoom: 0.1, note: 'hook: Ahalya standing in tapas before the ashram, title ribbon', draw(lt, d, t) {
    forestPage(42); forest(t); kuti(540, 1400, 0.9); grass(1470);
    glow(540, 1150, 420, 0.6); person({ ...AHALYA, x: 540, y: 1560, h: 600, halo: 1, arm: 75, back: 75 });
    K.ribbon('अहल्या का सच', 540, 300, pop(lt, 0.05, 0.45), 80);
    sparkles(540, 1100, 320, t, pop(lt, ai));
  } }); cue(st + 0.05, 'pop', { gain: 0.6 }); cue(st + ai, 'sparkle', { dur: 1 }); }

  // 0 · Vishwamitra takes Rama and Lakshmana to Mithila
  { const vi = w('विश्वामित्र', 0), mi = w('मिथिला', 0); const st = shot(0, { cam: [540, 1100], zoom: 0.08, note: 'the sage leads the two brothers along a road; ribbon MITHILA, dashed route', draw(lt, d, t) {
    forestPage(1); forest(t); grass(1480);
    K.ribbon('मिथिला', 540, 300, pop(lt, mi, 0.45), 90);
    ctx.save(); ctx.setLineDash([26, 20]); ctx.strokeStyle = P.crimson; ctx.lineWidth = 10; ctx.beginPath(); ctx.moveTo(160, 640); ctx.lineTo(160 + 760 * eo(seg(lt, mi - 0.6, mi + 0.5)), 600); ctx.stroke(); ctx.restore();
    const x0 = lerp(80, 300, seg(lt, 0, d));
    person({ ...VISHWA, x: x0 + 560, y: 1560, h: 600, arm: 30, hold: danda, bob: walkBob(t), halo: 0.3 * pop(lt, vi) });
    person({ ...RAMA, x: x0 + 300, y: 1560, h: 560, halo: 1, arm: 10, holdBack: (x, y) => bow(x + 40, y - 120, 0.9), bob: walkBob(t + 0.2) });
    person({ ...LAKSH, x: x0 + 80, y: 1560, h: 540, halo: 0.7, arm: 10, holdBack: (x, y) => bow(x + 40, y - 120, 0.9), bob: walkBob(t + 0.4) });
  } }); cue(st + vi, 'pop', { gain: 0.5 }); cue(st + mi, 'pop', { gain: 0.6 }); }

  // 1 · on the way, a deserted old ashram
  { const su = w('सुनसान', 1), as = w('आश्रम', 1); const st = shot(1, { cam: [540, 1150], zoom: 0.12, note: 'a lonely overgrown hut between bare trees under a dusk wash', draw(lt, d, t) {
    forestPage(2, 0.3); grass(1480); ruinedAshram(t, 0);
    K.slip('सुनसान', 300, 560, pop(lt, su), -0.04, 62); K.slip('पुराना आश्रम', 760, 700, pop(lt, as), 0.03, 58);
  } }); cue(st + su, 'pop'); cue(st + as, 'pop'); }

  // 2 · Rama asked: whose ashram is this?
  { const pu = w('पूछा', 2), ki = w('किसका', 2); const st = shot(2, { cam: [540, 1150], zoom: 0.1, note: 'Rama points at the ruined hut, a ? pops', draw(lt, d, t) {
    forestPage(3, 0.25); grass(1480); dryTree(980, 1450, 0.9); kuti(720, 1440, 0.9);
    person({ ...RAMA, x: 260, y: 1560, h: 620, halo: 1, arm: lerp(10, 95, pop(lt, pu - 0.1)), finger: true, holdBack: (x, y) => bow(x + 40, y - 120, 0.9) });
    K.slip('?', 720, 640, pop(lt, ki, 0.3), 0.08, 140);
  } }); cue(st + ki, 'pop'); }

  // 3 · Vishwamitra: this was the ashram of maharshi Gautama
  { const bo = w('बोले', 3), ga = w('गौतम', 3); const st = shot(3, { cam: [540, 1100], zoom: 0.12, note: 'Vishwamitra explains; a framed vision of sage Gautama appears', draw(lt, d, t) {
    forestPage(4, 0.2); grass(1480);
    person({ ...VISHWA, x: 250, y: 1560, h: 640, arm: lerp(20, 110, pop(lt, bo)), hold: null, holdBack: danda });
    const v = pop(lt, ga - 0.2, 0.45); if (v > 0) { ctx.save(); ctx.translate(720, 900); ctx.scale(v, v); cut(() => { ctx.beginPath(); ctx.ellipse(0, 0, 260, 330, 0, 0, TAU); }, '#EFE2BE'); ctx.beginPath(); ctx.ellipse(0, 0, 240, 310, 0, 0, TAU); ctx.clip(); glow(0, -50, 300, 0.6); person({ ...GAUTAMA, x: 0, y: 330, h: 560, halo: 0.6, arm: 30, hold: danda }); ctx.restore(); }
    K.slip('महर्षि गौतम', 720, 520, pop(lt, ga), -0.03, 58);
  } }); cue(st + ga, 'sparkle', { dur: 0.8 }); }

  // 4 · where he did tapas with his wife Ahalya
  { const ah = w('अहल्या', 4), ta = w('तप', 4); const st = shot(4, { cam: [540, 1100], zoom: 0.1, note: 'flashback: the ashram green and alive; Gautama and Ahalya with joined palms, glowing', draw(lt, d, t) {
    forestPage(5); forest(t); kuti(540, 1400, 0.85); grass(1480);
    const g = pop(lt, ta - 0.1, 0.5); glow(540, 1150, 500, 0.5 * g);
    person({ ...GAUTAMA, x: 300, y: 1560, h: 620, halo: 0.5 + 0.4 * g, arm: lerp(20, 75, g), back: lerp(10, 75, g) });
    const a = eo(seg(lt, ah - 0.4, ah)); person({ ...AHALYA, x: lerp(1200, 760, a), y: 1560, h: 560, dir: -1, halo: 0.5 + 0.4 * g, arm: lerp(20, 75, g), back: lerp(10, 75, g) });
    K.slip('अहल्या', 760, 640, pop(lt, ah), 0.03, 60); K.ribbon('तप', 540, 320, g, 96);
  } }); cue(st + ah, 'pop'); cue(st + ta, 'sparkle', { dur: 1 }); }

  // 5 · one day, when Gautama went out
  { const ba = w('बाहर', 5); const st = shot(5, { cam: [540, 1100], zoom: 0.1, note: 'Gautama walks off with his kamandal; Ahalya at the hut', draw(lt, d, t) {
    forestPage(6); forest(t); kuti(300, 1420, 0.8); grass(1480);
    person({ ...AHALYA, x: 300, y: 1560, h: 520, halo: 0.6, arm: 20 });
    const k = eio(seg(lt, 0.1, d)); person({ ...GAUTAMA, x: lerp(620, 1200, k), y: 1560, h: 600, arm: 30, hold: danda, holdBack: kamandal, bob: walkBob(t, k < 1 ? 1 : 0) });
    K.slip('बाहर गए', 760, 600, pop(lt, ba), 0.03, 60);
  } }); cue(st + 0.1, 'slide', { dur: 0.8, gain: 0.35 }); }

  // 6 · Indra came in Gautama's form
  { const ind = w('इंद्र', 6), ru = w('रूप', 6), aa = w('आ', 6); const st = shot(6, { cam: [540, 1050], zoom: 0.12, note: 'crowned Indra; a puff of smoke turns him into a copy of the sage', draw(lt, d, t) {
    forestPage(7, 0.2); forest(t); grass(1480);
    const k = seg(lt, ru - 0.1, ru + 0.25), x = lerp(900, 680, eo(seg(lt, aa - 0.3, aa + 0.3)));
    if (k < 0.5) person({ ...INDRA, x, y: 1560, h: 620, dir: -1, arm: 30, halo: 0.4 });
    else person({ ...GAUTAMA, x, y: 1560, h: 600, dir: -1, arm: 30, hold: danda });
    smoke(x, 1200, seg(lt, ru - 0.1, ru + 0.8), 4);
    K.slip('इंद्र', 540, 380, pop(lt, ind), -0.03, 70); K.slip('गौतम का रूप', 540, 560, pop(lt, ru + 0.15), 0.03, 56);
  } }); cue(st + ind, 'pop'); cue(st + ru, 'sizzle', { dur: 0.7, gain: 0.3 }); }

  // 7 · Valmiki writes: Ahalya had recognised Indra
  { const va = w('वाल्मीकि', 7), pe = w('पहचान', 7); const st = shot(7, { cam: [540, 1100], zoom: 0.12, note: 'the disguised sage casts a crowned shadow; Ahalya sees it; slip PAHCHAN', draw(lt, d, t) {
    forestPage(8, 0.25); forest(t); kuti(260, 1420, 0.75); grass(1480);
    K.ribbon('वाल्मीकि लिखते हैं', 540, 300, pop(lt, va, 0.45), 66);
    const sh = pop(lt, pe - 0.3, 0.5); ctx.save(); ctx.globalAlpha = 0.45 * sh; ctx.filter = 'brightness(0.15)'; person({ ...INDRA, x: 920, y: 1540, h: 760, dir: -1, arm: 30 }); ctx.restore();
    person({ ...GAUTAMA, x: 760, y: 1560, h: 600, dir: -1, arm: 30, hold: danda });
    person({ ...AHALYA, x: 330, y: 1560, h: 540, halo: 0.5, arm: lerp(20, 90, pop(lt, pe)), finger: true });
    K.slip('पहचान लिया', 540, 620, pop(lt, pe), -0.03, 60);
  } }); cue(st + va, 'pop', { gain: 0.6 }); cue(st + pe, 'slam', { gain: 0.35 }); }

  // 8 · still, she erred
  { const bh = w('भूल', 8); const st = shot(8, { cam: [540, 950], zoom: 0.14, note: 'a lotus droops and loses petals under a dark wash; slip BHOOL', draw(lt, d, t) {
    K.parchment(9); wash(C.dusk, 0.35); const k = eio(seg(lt, 0.1, bh + 0.4));
    ctx.save(); ctx.translate(540, 1300); ctx.rotate(0.5 * k); lotus(0, 0, 1.6); ctx.restore();
    for (let i = 0; i < 4; i++) { const f = seg(lt, bh + i * 0.1, bh + 0.8 + i * 0.1); if (f > 0) ell(500 + i * 40 + f * 60, 1150 + f * 300, 26, 14, C.lotus, f * 3 + i); }
    K.slip('भूल', 540, 560, pop(lt, bh), -0.04, 84);
  } }); cue(st + bh, 'plop'); }

  // 9 · then Gautama returned and understood everything
  { const lo = w('लौट', 9), sa = w('समझ', 9); const st = shot(9, { cam: [540, 1100], zoom: 0.1, note: 'Gautama returns; the disguised Indra hurries away right', draw(lt, d, t) {
    forestPage(10, 0.3); forest(t); kuti(540, 1420, 0.8); grass(1480);
    const g = eo(seg(lt, 0, lo + 0.3)); person({ ...GAUTAMA, x: lerp(-150, 260, g), y: 1560, h: 640, arm: 30, hold: danda, bob: walkBob(t, g < 1 ? 1 : 0) });
    const r = eio(seg(lt, lo, sa + 0.5)); ctx.save(); ctx.globalAlpha = 1 - 0.5 * r; person({ ...INDRA, x: lerp(780, 1250, r), y: 1560, h: 600, arm: 10, halo: 0.3, bob: walkBob(t) }); ctx.restore();
    K.slip('समझ गए', 300, 560, pop(lt, sa), -0.03, 62);
  } }); cue(st + lo, 'slide', { dur: 0.6, gain: 0.35 }); cue(st + sa, 'thud', { gain: 0.45 }); }

  // 10 · he cursed Indra too, and Ahalya too
  { const ind = w('इंद्र', 10), sh = w('श्राप', 10), ah = w('अहल्या', 10); const st = shot(10, { cam: [540, 1000], zoom: 0.14, note: 'Gautama raises his hand, red rings; two slips INDRA and AHALYA', draw(lt, d, t) {
    forestPage(11, 0.45); forest(t); wash(P.crimson, 0.15 * pop(lt, sh));
    person({ ...GAUTAMA, x: 540, y: 1600, h: 760, arm: lerp(20, 160, pop(lt, sh - 0.2)), halo: 0.4 });
    rings(540, 900, t, pop(lt, sh - 0.1, 0.3));
    K.slip('श्राप', 540, 380, pop(lt, sh), -0.03, 74);
    K.slip('इंद्र', 230, 640, pop(lt, ind), -0.05, 60); K.slip('अहल्या', 850, 640, pop(lt, ah), 0.05, 60);
  } }); cue(st + sh, 'slam', { gain: 0.45 }); cue(st + ah, 'pop'); }

  // 11 · but the curse was not to become stone
  { const pa = w('पत्थर', 11), na = w('नहीं', 11); const st = shot(11, { cam: [540, 1000], zoom: 0.12, note: 'the stone pops on parchment and gets a red cross', draw(lt, d, t) {
    K.parchment(12);
    shila(540, 1300, 1.2 * pop(lt, pa - 0.15, 0.35), 1); bigCross(540, 1100, eo(seg(lt, na - 0.05, na + 0.35)));
    K.slip('पत्थर?', 540, 520, pop(lt, pa), -0.03, 74);
  } }); cue(st + pa, 'thud', { gain: 0.5 }); cue(st + na, 'slam', { gain: 0.5 }); }

  // 12 · for thousands of years you will do tapas right here
  { const ha = w('हज़ारों', 12), ta = w('तप', 12); const st = shot(12, { cam: [540, 1050], zoom: 0.1, note: 'Ahalya with joined palms; sun and moon race around her (years passing)', draw(lt, d, t) {
    forestPage(13, 0.2); grass(1480); kuti(860, 1420, 0.6);
    sunMoon(t, pop(lt, ha - 0.1, 0.4));
    person({ ...AHALYA, x: 540, y: 1560, h: 600, halo: 0.6 + 0.3 * pop(lt, ta), arm: 75, back: 75 });
    K.ribbon('हज़ारों वर्ष', 540, 300, pop(lt, ha, 0.45), 80);
  } }); cue(st + ha, 'pop', { gain: 0.6 }); cue(st + ta, 'sparkle', { dur: 0.8 }); }

  // 13 · only air, no food, lying on ash
  { const ha = w('हवा', 13), bh = w('भोजन', 13), ra = w('राख', 13); const st = shot(13, { cam: [540, 950], zoom: 0.1, note: 'three cards: wind, an empty plate crossed out, a heap of ash', draw(lt, d, t) {
    K.parchment(14);
    const p1 = pop(lt, ha - 0.1), p2 = pop(lt, bh - 0.1), p3 = pop(lt, ra - 0.1);
    if (p1 > 0) { ctx.save(); ctx.translate(320, 600); ctx.scale(2 * p1, 2 * p1); windLines(0, 0, t); ctx.restore(); K.label('हवा', 320, 820, 80 * p1, P.ink); }
    if (p2 > 0) { plate(760, 900, 1.8 * p2); ctx.save(); ctx.translate(760, 880); ctx.scale(1, 1); bigCross(0, 0, eo(seg(lt, bh + 0.15, bh + 0.45))); ctx.restore(); K.label('भोजन', 760, 1080, 80 * p2, P.ink); }
    if (p3 > 0) { ashGround(420, 1260, p3 * 1.6); K.label('राख', 420, 1400, 80 * p3, P.ink); }
  } }); cue(st + ha, 'whoosh', { gain: 0.4 }); cue(st + bh, 'pop'); cue(st + ra, 'plop'); }

  // 14 · and no being will be able to see you
  { const pr = w('प्राणी', 14), de = w('देख', 14); const st = shot(14, { cam: [540, 1100], zoom: 0.1, note: 'Ahalya fades to a faint outline as a deer and a sage pass by without seeing', draw(lt, d, t) {
    forestPage(15, 0.15); forest(t); grass(1480);
    const f = eio(seg(lt, de - 0.3, de + 0.5)); ctx.save(); ctx.globalAlpha = 1 - 0.85 * f; person({ ...AHALYA, x: 540, y: 1560, h: 580, halo: 0.6, arm: 75, back: 75 }); ctx.restore();
    const k = seg(lt, 0, d); cow(lerp(-250, 1300, k), 1600, 0.7);
    K.slip('अदृश्य', 540, 460, pop(lt, de), -0.03, 70);
  } }); cue(st + pr, 'pop', { gain: 0.5 }); cue(st + de, 'sizzle', { dur: 0.7, gain: 0.25 }); }

  // 15 · when Rama comes, and you welcome him
  { const ra = w('राम', 15), sa = w('सत्कार', 15); const st = shot(15, { cam: [540, 1100], zoom: 0.1, note: 'a glowing Rama appears on the horizon in a framed vision', draw(lt, d, t) {
    forestPage(16); forest(t); grass(1480);
    const v = pop(lt, ra - 0.2, 0.45); glow(540, 900, 500, 0.6 * v);
    if (v > 0) { ctx.save(); ctx.globalAlpha = clamp(v); person({ ...RAMA, x: 540, y: 1560, h: 680, halo: 1, arm: 30, holdBack: (x, y) => bow(x + 40, y - 120, 0.9) }); ctx.restore(); }
    K.slip('जब राम आएँगे', 540, 380, pop(lt, ra), -0.03, 60);
    const m = pop(lt, sa - 0.1, 0.4); if (m > 0) { mat(840, 1560, m); lota(840, 1520, m); }
  } }); cue(st + ra, 'sparkle', { dur: 1 }); cue(st + sa, 'pop'); }

  // 16 · then you will be pure
  { const sh = w('शुद्ध', 16); const st = shot(16, { cam: [540, 950], zoom: 0.14, note: 'a lotus blooms in golden light; slip SHUDDH', draw(lt, d, t) {
    K.parchment(17); const k = eob(seg(lt, 0, sh + 0.3)); glow(540, 1100, 520, 0.8 * k);
    lotus(540, 1300, 1.6 * Math.max(0.05, k)); sparkles(540, 1150, 300, t, pop(lt, sh));
    K.slip('शुद्ध', 540, 520, pop(lt, sh), -0.03, 84);
  } }); cue(st + sh, 'sparkle', { dur: 1 }); }

  // 17 · now Rama stepped into the ashram
  { const ka = w('कदम', 17); const st = shot(17, { cam: [540, 1150], zoom: 0.1, note: 'Rama, Lakshmana and Vishwamitra walk into the overgrown ashram; the vines fall away', draw(lt, d, t) {
    forestPage(18, 0.25 * (1 - pop(lt, ka))); grass(1480); ruinedAshram(t, pop(lt, ka, 0.6));
    const k = eo(seg(lt, 0, ka + 0.2));
    person({ ...VISHWA, x: lerp(-400, 80, k), y: 1580, h: 560, arm: 30, hold: danda, bob: walkBob(t, k < 1 ? 1 : 0) });
    person({ ...LAKSH, x: lerp(-200, 220, k), y: 1580, h: 560, halo: 0.7, arm: 10, holdBack: (x, y) => bow(x + 40, y - 120, 0.9), bob: walkBob(t + 0.3, k < 1 ? 1 : 0) });
    person({ ...RAMA, x: lerp(0, 380, k), y: 1580, h: 600, halo: 1, arm: 10, holdBack: (x, y) => bow(x + 40, y - 120, 0.9), bob: walkBob(t + 0.6, k < 1 ? 1 : 0) });
    K.slip('कदम रखा', 760, 560, pop(lt, ka), 0.03, 60);
  } }); cue(st + ka, 'thud', { gain: 0.45 }); }

  // 18 · Ahalya, shining with tapas, became visible to all
  { const te = w('तेज', 18), di = w('दिखने', 18); const st = shot(18, { cam: [540, 1050], zoom: 0.12, note: 'Ahalya fades in at the hut, bright halo and sparkles', draw(lt, d, t) {
    forestPage(19); forest(t); kuti(540, 1400, 0.85); grass(1480);
    const a = eo(seg(lt, 0.05, di + 0.2)); glow(540, 1050, 520, a * (0.8 + 0.2 * Math.sin(t * 4)));
    ctx.save(); ctx.globalAlpha = 0.15 + 0.85 * a; person({ ...AHALYA, x: 540, y: 1560, h: 620, halo: 1.2, arm: 75, back: 75 }); ctx.restore();
    sparkles(540, 1000, 340, t, pop(lt, te)); K.slip('तप का तेज', 540, 380, pop(lt, te), -0.03, 62);
  } }); cue(st + te, 'sparkle', { dur: 1.2 }); }

  // 19 · like fire hidden in smoke
  { const dh = w('धुएँ', 19), aa = w('आग', 19); const st = shot(19, { cam: [540, 950], zoom: 0.16, note: 'a ring of grey smoke parts and a bright flame shows through', draw(lt, d, t) {
    K.parchment(20); wash(C.dusk, 0.25);
    const o = eio(seg(lt, aa - 0.3, aa + 0.4));
    flame(540, 1200, 1.3 * Math.max(0.3, o), t); smokeCloud(540, 1000, 1.2 + 0.8 * o, 1 - o, t);
    K.slip('धुएँ में आग', 540, 420, pop(lt, dh), -0.03, 62);
  } }); cue(st + dh, 'whoosh', { gain: 0.4 }); cue(st + aa, 'sizzle', { dur: 0.6, gain: 0.3 }); }

  // 20 · and listen: Rama and Lakshmana themselves touched Ahalya's feet
  { const su = w('सुनिए', 20), ch = w('चरण', 20); const st = shot(20, { cam: [540, 1150], zoom: 0.12, note: 'Rama and Lakshmana bow low before Ahalya; slip CHARAN', draw(lt, d, t) {
    forestPage(21); forest(t); kuti(820, 1420, 0.7); grass(1480);
    person({ ...AHALYA, x: 880, y: 1560, h: 580, dir: -1, halo: 1, arm: lerp(20, 60, pop(lt, ch)) });
    const k = eio(seg(lt, ch - 0.6, ch + 0.1));
    bowing({ ...LAKSH, x: 70, y: 1560, h: 500, halo: 0.7 }, k * 0.9); bowing({ ...RAMA, x: 340, y: 1560, h: 580, halo: 1 }, k);
    K.slip('और सुनिए', 300, 400, pop(lt, su), -0.04, 60); K.slip('चरण छुए', 600, 620, pop(lt, ch), 0.03, 64);
  } }); cue(st + su, 'pop'); cue(st + ch, 'sparkle', { dur: 1 }); }

  // 21 · Ahalya welcomed both as guests
  { const at_ = w('अतिथि', 21), sa = w('सत्कार', 21); const st = shot(21, { cam: [540, 1150], zoom: 0.1, note: 'Ahalya offers water and a mat to Rama and Lakshmana', draw(lt, d, t) {
    forestPage(22); forest(t); kuti(860, 1420, 0.7); grass(1480);
    person({ ...LAKSH, x: 160, y: 1560, h: 540, halo: 0.7, arm: 10 }); person({ ...RAMA, x: 360, y: 1560, h: 580, halo: 1, arm: 10 });
    const m = pop(lt, sa - 0.1, 0.4); if (m > 0) mat(560, 1560, m);
    person({ ...AHALYA, x: 790, y: 1560, h: 560, dir: -1, halo: 1, arm: lerp(20, 80, pop(lt, at_ - 0.1)), hold: lt > at_ - 0.1 ? (x, y) => lota(x + 20, y + 40, 0.9) : null });
    K.slip('अतिथि सत्कार', 540, 440, pop(lt, at_), -0.03, 60);
  } }); cue(st + at_, 'pop'); cue(st + sa, 'plop'); }

  // 22 · flowers rained from the sky, and Gautama returned too
  { const ph = w('फूल', 22), ga = w('गौतम', 22); const st = shot(22, { cam: [540, 1100], zoom: 0.1, note: 'petals rain; Gautama walks in and stands beside Ahalya', draw(lt, d, t) {
    forestPage(23); heavenClouds(t); forest(t); kuti(540, 1400, 0.8); grass(1480);
    person({ ...AHALYA, x: 620, y: 1560, h: 560, halo: 1, arm: 75, back: 75 });
    const g = eo(seg(lt, ga - 0.5, ga + 0.3)); person({ ...GAUTAMA, x: lerp(-150, 380, g), y: 1560, h: 620, halo: 0.6, arm: 30, hold: danda, bob: walkBob(t, g > 0 && g < 1 ? 1 : 0) });
    petalRain(t, pop(lt, ph - 0.2, 0.5), 3);
    K.slip('गौतम', 380, 640, pop(lt, ga), -0.03, 60);
  } }); cue(st + ph, 'sparkle', { dur: 1.2 }); cue(st + ga, 'pop'); }

  // 23 · so where did the stone story come from?
  { const pa = w('पत्थर', 23), ka = w('कहाँ', 23); const st = shot(23, { cam: [540, 950], zoom: 0.14, note: 'the stone alone on parchment, big ? above', draw(lt, d, t) {
    K.parchment(24); shila(540, 1300, 1.2 * pop(lt, pa - 0.1, 0.4), 1);
    K.slip('?', 540, 620, pop(lt, ka, 0.4), 0.08, 150);
  } }); cue(st + pa, 'thud', { gain: 0.45 }); cue(st + ka, 'pop'); }

  // 24 · in later works, like Tulsidas ji's Ramcharitmanas
  { const ra = w('रचनाओं', 24), tu = w('तुलसीदास', 24), rc = w('रामचरितमानस', 24); const st = shot(24, { cam: [540, 1100], zoom: 0.1, note: 'stacked pothis, then Tulsidas writing under a tree; ribbon RAMCHARITMANAS', draw(lt, d, t) {
    skyPage(25); forestTree(880, 1460, 1.0); grass(1480);
    if (lt < tu - 0.1) { for (let i = 0; i < 3; i++) pothi(540, 1350 - i * 150, pop(lt, Math.min(0.02 + i * 0.1, ra - 0.2 + i * 0.1)), 1); }
    else { person({ ...SAGE, x: 380, y: 1560, h: 560, arm: lerp(60, 80, 0.5 + 0.5 * Math.sin(t * 6)) }); pothi(600, 1400, 0.6, seg(lt, tu, d)); K.slip('तुलसीदास', 380, 640, pop(lt, tu - 0.1), -0.03, 56); }
    K.ribbon('रामचरितमानस', 540, 300, pop(lt, rc, 0.45), 80);
  } }); cue(st + ra, 'plop'); cue(st + tu, 'pop'); cue(st + rc, 'sparkle', { dur: 0.8 }); }

  // 25 · Ahalya was described as a stone (shila)
  { const sh = w('शिला', 25); const st = shot(25, { cam: [540, 950], zoom: 0.1, note: 'the chaupai line on a scroll card; the stone with a woman outline below', draw(lt, d, t) {
    K.parchment(26); glow(540, 700, 420, 0.4);
    scrollCard(['गौतम नारि श्राप बस', 'उपल देह धरि धीर'], 540, 560, pop(lt, 0.05, 0.4), 58);
    shila(540, 1360, pop(lt, sh - 0.2, 0.4), 1); K.slip('शिला', 860, 1000, pop(lt, sh), 0.05, 66);
  } }); cue(st + 0.05, 'sparkle', { dur: 0.8 }); cue(st + sh, 'thud', { gain: 0.45 }); }

  // 26 · did you know? tell us in the comments
  { const pa = w('पता', 26), ko = w('कमेंट', 26); const st = shot(26, { cam: [540, 950], zoom: 0.12, note: 'a big comment bubble, slip COMMENT', draw(lt, d, t) {
    K.parchment(27); bubble(540, 900, pop(lt, 0.05, 0.4), t);
    K.slip('?', 860, 560, pop(lt, pa, 0.3), 0.08, 120);
    K.slip('कमेंट करें', 540, 1250, pop(lt, ko), -0.02, 60);
  } }); cue(st + 0.05, 'pop'); cue(st + ko, 'sparkle', { dur: 0.8 }); }

  // 27 · lesson: true tapas washes away every mistake
  { const si = w('सीख', 27), ta = w('तप', 27), dh = w('धो', 27); const st = shot(27, { cam: [540, 1050], zoom: 0.1, note: 'Ahalya glowing before the green ashram; ribbon SEEKH; sparkles (loops to the hook)', draw(lt, d, t) {
    forestPage(28); forest(t); kuti(540, 1400, 0.85); grass(1480);
    glow(540, 1100, 520, 0.4 + 0.4 * pop(lt, ta));
    person({ ...AHALYA, x: 540, y: 1560, h: 620, halo: 1, arm: 75, back: 75 });
    K.ribbon('सीख', 540, 300, pop(lt, si, 0.45), 96); sparkles(540, 1050, 340, t, pop(lt, dh));
  } }); cue(st + si, 'pop', { gain: 0.6 }); cue(st + dh, 'sparkle', { dur: 1.2 }); }

  return { shots: S, cues: CUES };
}
