// LAKSHMAN REKHA: the shot list (Katha style, Hindi). Everything is cut paper on parchment.
// Deities are drawn simply and respectfully: no faces. Kit from govardhan + new pieces below.
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

export function buildShots() {
  const S = [], CUES = [], add = (o) => (S.push(o), o), cue = (t, type, o = {}) => CUES.push({ t: +t.toFixed(3), type, ...o });
  const OFF = 2;
  const at = (i) => L(i + OFF) - 0.08;
  const w = (word, i) => Wd(word, i + OFF) - at(i);
  const pop = (lt, a, dur = 0.35) => (lt > a ? eob(seg(lt, a, a + dur)) : 0);
  const shot = (i, o) => { const st = at(i); add({ id: `S${String(i).padStart(2, '0')}`, at: st, ...o }); cue(st, 'whoosh', { gain: 0.5 }); return st; };
  const sub = (id, st, o) => { add({ id, at: st, ...o }); cue(st, 'whoosh', { gain: 0.45 }); return st; };
  const walkBob = (t, k = 1) => -Math.abs(Math.sin(t * 9)) * 12 * k;

  // H0a · hook: Lakshman draws the famous glowing line before the hut
  { const re = Wd('रेखा', 0); add({ id: 'H0a', at: 0, cam: [540, 1150], zoom: 0.12, note: 'hook: hut, Sita at the door, Lakshman draws a glowing line with an arrow tip', draw(lt, d, t) {
    forestPage(40); forest(t); kuti(560, 1440, 1.1); grass(1470);
    person({ ...SITA, x: 600, y: 1440, h: 470, halo: 0.8, arm: 20 });
    const p = eio(seg(lt, 0.1, 2.2)); person({ ...LAKSH, x: lerp(200, 820, p), y: 1470, h: 520, halo: 0.6, arm: 60, hold: (x, y) => arrowShaft(x, y + 60, 0.8, 1.3) });
    rekha(200, 900, 1490, p);
    K.slip('लक्ष्मण रेखा', 540, 380, pop(lt, 0.3), -0.03, 64);
  } }); cue(0.05, 'whoosh', { gain: 0.5 }); cue(0.15, 'sizzle', { dur: 1.0, gain: 0.3 }); cue(0.3, 'pop'); }
  // H0b · the scroll of Valmiki: the line crossed out
  { const st = Wd('वाल्मीकि', 0) - 0.08, re = Wd('रेखा', 0) - st, na = Wd('नहीं', 0) - st; sub('H0b', st, { cam: [540, 900], zoom: 0.12, note: 'hook: Valmiki Ramayana pothi, the glowing line under it gets a big red cross', draw(lt, d, t) {
    K.parchment(41); glow(540, 700, 420, 0.5);
    pothi(540, 640, 1.4, eo(seg(lt, 0, 0.6))); K.ribbon('वाल्मीकि रामायण', 540, 360, pop(lt, 0.02, 0.4), 72);
    rekha(160, 920, 1060, 1, 1); bigCross(540, 1060, eo(seg(lt, na - 0.1, na + 0.4)));
    K.slip('?', 880, 920, pop(lt, re, 0.3), 0.08, 110);
  } }); cue(st + na, 'slam', { gain: 0.5 }); }
  // H1 · "no? come, I'll tell you"
  { const st = L(1) - 0.08, ai = Wd('आइए', 1) - st; add({ id: 'H1', at: st, cam: [540, 1050], zoom: 0.1, note: 'hook: Rama, Sita, Lakshman before the hut, title ribbon', draw(lt, d, t) {
    forestPage(42); forest(t); kuti(540, 1400, 0.9); grass(1470);
    person({ ...RAMA, x: 300, y: 1540, h: 600, halo: 1, arm: 10, holdBack: (x, y) => bow(x + 40, y - 120, 0.9) });
    person({ ...SITA, x: 540, y: 1540, h: 520, halo: 0.9, arm: 20 });
    person({ ...LAKSH, x: 790, y: 1540, h: 580, dir: -1, halo: 0.7, arm: 10, holdBack: (x, y) => bow(x + 40, y - 120, 0.9) });
    K.ribbon('लक्ष्मण रेखा का सच', 540, 300, pop(lt, 0.05, 0.45), 74);
    sparkles(540, 900, 320, t, pop(lt, ai));
  } }); cue(st + 0.05, 'pop', { gain: 0.6 }); cue(st + ai, 'sparkle', { dur: 1 }); }

  // 0 · in Panchavati a golden deer appeared
  { const pa = w('पंचवटी', 0), su = w('सुनहरा', 0); const st = shot(0, { cam: [540, 1100], zoom: 0.1, note: 'Panchavati forest + hut, the golden deer leaps in', draw(lt, d, t) {
    forestPage(1); forest(t); kuti(300, 1420, 0.8); grass(1480);
    K.ribbon('पंचवटी', 540, 300, pop(lt, pa, 0.45), 90);
    const k = eo(seg(lt, su - 0.4, su + 0.3)); deer(lerp(1300, 760, k), 1560, 1.1, t, k < 1 ? seg(lt, su - 0.4, su + 0.3) : 0, k > 0 ? 1 : 0);
  } }); cue(st + pa, 'pop', { gain: 0.6 }); cue(st + su, 'sparkle', { dur: 1 }); }

  // 1 · Sita said: I want this deer
  { const hi = w('हिरण', 1); const st = shot(1, { cam: [540, 1100], zoom: 0.12, note: 'Sita points at the deer, Rama beside her', draw(lt, d, t) {
    forestPage(2); forest(t); grass(1480);
    person({ ...RAMA, x: 180, y: 1560, h: 620, halo: 1, arm: 15, holdBack: (x, y) => bow(x + 40, y - 120, 0.9) });
    person({ ...SITA, x: 400, y: 1560, h: 540, halo: 0.9, arm: lerp(20, 95, eo(seg(lt, 0.1, 0.5))) });
    deer(820, 1560, 1.0, t, 0, 1);
    K.slip('हिरण', 820, 760, pop(lt, hi), 0.03, 60);
  } }); cue(st + hi, 'pop'); }

  // 2 · Rama went after it and left Sita in Lakshman's care
  { const pi = w('पीछे', 2), la = w('लक्ष्मण', 2), ra = w('रक्षा', 2); const st = shot(2, { cam: [540, 1100], zoom: 0.08, note: 'Rama runs off after the deer, Lakshman steps up beside Sita', draw(lt, d, t) {
    forestPage(3); forest(t); kuti(330, 1420, 0.8); grass(1480);
    const r = eio(seg(lt, 0, pi + 0.8)); deer(lerp(800, 1500, r), 1560, 0.8, t, (r * 3) % 1, 1);
    person({ ...RAMA, x: lerp(520, 1350, r), y: 1560, h: 560, halo: 1, arm: 90, hold: (x, y) => bow(x, y, 0.8), bob: walkBob(t, r < 1 ? 1 : 0) });
    person({ ...SITA, x: 300, y: 1560, h: 500, halo: 0.9, arm: 20 });
    const l = eo(seg(lt, la - 0.3, la + 0.3)); person({ ...LAKSH, x: lerp(-150, 520, l), y: 1560, h: 560, dir: -1, halo: 0.7, arm: lerp(10, 60, pop(lt, ra)), holdBack: (x, y) => bow(x + 40, y - 120, 0.9) });
    K.slip('रक्षा', 420, 700, pop(lt, ra), -0.03, 60);
  } }); cue(st + 0.1, 'slide', { dur: 0.9, gain: 0.4 }); cue(st + ra, 'pop'); }

  // 3 · but the deer was really the demon Maricha
  { const as = w('असल', 3), ma = w('मारीच', 3); const st = shot(3, { cam: [540, 1050], zoom: 0.12, note: 'the deer\'s shadow on the dusk forest grows into a horned rakshasa silhouette', draw(lt, d, t) {
    const k = eio(seg(lt, as - 0.2, ma + 0.2)); forestPage(4, 0.35 + 0.3 * k); forest(t); grass(1480);
    deer(540, 1560, 1.1, t, 0, 1 - k); rakshasaShadow(540, 1560, 900 * Math.max(0.3, k), k);
    K.slip('मारीच', 540, 360, pop(lt, ma), -0.03, 66);
  } }); cue(st + as, 'slide', { dur: 0.8, gain: 0.4 }); cue(st + ma, 'slam', { gain: 0.45 }); }

  // 4 · Rama's arrow struck, and he cried out in Rama's voice
  { const ba = w('बाण', 4), aw = w('आवाज़', 4); const st = shot(4, { cam: [540, 1000], zoom: 0.1, note: 'an arrow flies across; the deer vanishes in smoke; red sound rings', draw(lt, d, t) {
    forestPage(5, 0.4); forest(t); grass(1480);
    const f = seg(lt, ba - 0.4, ba); if (f < 1) deer(820, 1560, 0.9, t, 0, 1); smoke(820, 1340, seg(lt, ba, ba + 0.9), 3);
    if (f > 0 && f < 1) arrowShaft(lerp(-100, 800, f), 1360, 1.2, 0);
    rings(820, 1100, t, pop(lt, aw - 0.1, 0.3));
    K.slip('आवाज़', 540, 420, pop(lt, aw), -0.03, 62);
  } }); cue(st + ba - 0.35, 'whoosh', { gain: 0.6 }); cue(st + ba, 'thud', { gain: 0.5 }); cue(st + aw, 'sizzle', { dur: 0.8, gain: 0.25 }); }

  // 5 · "Ha Sita! Ha Lakshmana!"
  { const si = w('सीते', 5), la = w('लक्ष्मण', 5); const st = shot(5, { cam: [540, 950], zoom: 0.16, note: 'dark forest, sound rings, two cries on slips', draw(lt, d, t) {
    forestPage(6, 0.65); forest(t); rings(540, 950, t * 1.5, 1);
    K.slip('हा सीते!', 380, 700, pop(lt, si - 0.05, 0.25), -0.05, 76); K.slip('हा लक्ष्मण!', 680, 1050, pop(lt, la - 0.05, 0.25), 0.04, 76);
  } }); cue(st + si, 'slam', { gain: 0.35 }); cue(st + la, 'slam', { gain: 0.35 }); }

  // 6 · Sita panicked: go, save your brother
  { const gh = w('घबरा', 6), ja = w('जाओ', 6), bc = w('बचाओ', 6); const st = shot(6, { cam: [540, 1150], zoom: 0.12, note: 'Sita at the hut urges Lakshman, points to the forest', draw(lt, d, t) {
    forestPage(7, 0.2); forest(t); kuti(420, 1420, 0.8); grass(1480);
    const sh = lt > gh && lt < gh + 0.6 ? Math.sin(t * 40) * 5 : 0;
    person({ ...SITA, x: 360 + sh, y: 1560, h: 540, halo: 0.9, arm: lerp(20, 100, pop(lt, ja - 0.1)), dir: 1 });
    person({ ...LAKSH, x: 720, y: 1560, h: 600, dir: -1, halo: 0.7, arm: 10, holdBack: (x, y) => bow(x + 40, y - 120, 0.9) });
    arrow(560, 760, 980, 760, eo(seg(lt, ja, ja + 0.4)));
    K.slip('जाओ', 760, 600, pop(lt, ja), 0.03, 60); K.slip('बचाओ', 300, 600, pop(lt, bc), -0.03, 60);
  } }); cue(st + ja, 'pop'); cue(st + bc, 'pop'); }

  // 7 · Lakshman: no one in the three worlds can defeat Rama
  { const ti = w('तीनों', 7), ha = w('हरा', 7); const st = shot(7, { cam: [540, 900], zoom: 0.1, note: 'three stacked worlds (heaven, earth, underworld) and glowing Rama above them; Lakshman calm', draw(lt, d, t) {
    K.parchment(8); glow(540, 400, 420, 0.6);
    const lv = [['स्वर्ग', '#E7D7AE', 560], ['पृथ्वी', '#8C9A5E', 820], ['पाताल', '#5D6377', 1080]];
    lv.forEach(([n, c, y], i) => { const p = pop(lt, ti + i * 0.12, 0.35); if (p <= 0) return; ctx.save(); ctx.translate(540, y); ctx.scale(p, p); cut(() => { ctx.beginPath(); ctx.ellipse(0, 0, 380, 90, 0, 0, TAU); }, c); ctx.restore(); K.label(n, 540, y + 6, 54 * p, P.ink); });
    person({ ...RAMA, x: 540, y: 480, h: 360, halo: 1, arm: 100, hold: (x, y) => bow(x, y, 0.6) });
    person({ ...LAKSH, x: 860, y: 1560, h: 520, dir: -1, halo: 0.6, arm: lerp(10, 80, pop(lt, ha)) });
    K.slip('अजेय', 230, 380, pop(lt, ha), -0.04, 60);
  } }); cue(st + ti, 'pop'); cue(st + ti + 0.12, 'pop'); cue(st + ti + 0.24, 'pop'); cue(st + ha, 'thud', { gain: 0.45 }); }

  // 8 · this voice is a demon's illusion
  { const ma = w('माया', 8); const st = shot(8, { cam: [540, 950], zoom: 0.12, note: 'the cry rings peel away to show the rakshasa face behind it', draw(lt, d, t) {
    forestPage(9, 0.55); forest(t);
    const k = eio(seg(lt, 0.1, ma + 0.2)); rakshasaShadow(540, 1600, 900, k * 0.9);
    rings(540, 950, t, 1 - k, '#9A8AB0');
    K.slip('माया', 540, 380, pop(lt, ma), -0.03, 66);
  } }); cue(st + ma, 'sizzle', { dur: 0.8, gain: 0.3 }); }

  // 9 · but Sita, in anger, said very harsh words
  { const gu = w('गुस्से', 9), ka = w('कठोर', 9); const st = shot(9, { cam: [540, 1100], zoom: 0.12, note: 'red wash, jagged crimson word-shards fly from Sita toward Lakshman', draw(lt, d, t) {
    forestPage(10); forest(t); grass(1480); wash(P.crimson, 0.18 * pop(lt, gu));
    person({ ...SITA, x: 300, y: 1560, h: 560, halo: 0.6, arm: lerp(20, 110, pop(lt, gu)) });
    person({ ...LAKSH, x: 800, y: 1560, h: 600, dir: -1, halo: 0.6, arm: 10, bob: lt > ka ? 6 : 0 });
    for (let i = 0; i < 5; i++) { const k = seg(lt, ka - 0.2 + i * 0.12, ka + 0.3 + i * 0.12); if (k <= 0 || k >= 1) continue; const x = lerp(420, 740, k), y = 820 + (i - 2) * 70; cut(P_poly([[x - 40, y], [x, y - 22], [x + 10, y - 4], [x + 50, y - 16], [x + 20, y + 20], [x - 10, y + 6]]), P.crimson, { shadow: 0.4, edge: 3 }); }
    K.slip('कठोर बातें', 540, 460, pop(lt, ka), -0.03, 60);
  } }); cue(st + gu, 'slam', { gain: 0.35 }); for (let i = 0; i < 3; i++) cue(st + w('कठोर', 9) + i * 0.15, 'tock', { gain: 0.45 }); }

  // 10 · Lakshman's heart was hurt
  { const du = w('दुखी', 10); const st = shot(10, { cam: [540, 800], zoom: 0.14, note: 'close: Lakshman with bowed head under a blue wash', draw(lt, d, t) {
    forestPage(11, 0.45); forest(t);
    ctx.save(); ctx.translate(540, 1700); ctx.rotate(0.06 * pop(lt, du - 0.2)); person({ ...LAKSH, x: 0, y: 0, h: 1100, halo: 0.5, arm: 5, back: 5 }); ctx.restore();
    K.slip('दुखी', 820, 420, pop(lt, du), 0.04, 62);
  } }); cue(st + du, 'plop'); }

  // 11 · palms joined: may the forest deities protect you
  { const jo = w('जोड़कर', 11), de = w('देवता', 11), ra = w('रक्षा', 11); const st = shot(11, { cam: [540, 1100], zoom: 0.1, note: 'Lakshman joins palms; the forest trees glow gold (vana devatas) around Sita', draw(lt, d, t) {
    forestPage(12); const g = pop(lt, de - 0.1, 0.5); forest(t, g); kuti(420, 1420, 0.8); grass(1480);
    person({ ...SITA, x: 330, y: 1560, h: 520, halo: 0.8 + 0.4 * pop(lt, ra), arm: 20 }); glow(330, 1250, 300, 0.5 * pop(lt, ra));
    const j = eo(seg(lt, jo - 0.4, jo)); person({ ...LAKSH, x: 760, y: 1560, h: 600, dir: -1, halo: 0.7, arm: lerp(10, 75, j), back: lerp(10, 75, j) });
    K.slip('वन देवता', 540, 440, g, -0.03, 60);
  } }); cue(st + jo, 'pop', { gain: 0.6 }); cue(st + de, 'sparkle', { dur: 1 }); }

  // 12 · and he left. That's all.
  { const ch = w('चले', 12), it = w('इतना', 12); const st = shot(12, { cam: [540, 1100], zoom: 0.08, note: 'Lakshman walks away into the forest; Sita alone at the hut; slip BAS ITNA HI', draw(lt, d, t) {
    forestPage(13); forest(t); kuti(330, 1420, 0.8); grass(1480);
    person({ ...SITA, x: 330, y: 1560, h: 500, halo: 0.8, arm: 20 });
    const k = eio(seg(lt, 0, it)); person({ ...LAKSH, x: lerp(640, 1150, k), y: 1560, h: 580, halo: 0.6, arm: 10, holdBack: (x, y) => bow(x + 40, y - 120, 0.9), bob: walkBob(t, k < 1 ? 1 : 0) });
    K.slip('बस इतना ही', 540, 440, pop(lt, it), -0.03, 62);
  } }); cue(st + ch, 'slide', { dur: 0.6, gain: 0.35 }); cue(st + it, 'pop'); }

  // 13 · but he kept looking back at Sita, again and again
  { const mu = w('मुड़कर', 13), de = w('देखते', 13); const st = shot(13, { cam: [540, 1100], zoom: 0.1, note: 'Lakshman on the path turns his head back toward the far hut; dashed gaze line', draw(lt, d, t) {
    forestPage(14); forest(t); kuti(220, 1300, 0.5); grass(1480);
    person({ ...SITA, x: 220, y: 1310, h: 280, halo: 0.8, arm: 20 });
    const back = Math.floor(seg(lt, mu - 0.2, d) * 3) % 2 === 0 && lt > mu - 0.2;
    person({ ...LAKSH, x: lerp(760, 880, seg(lt, 0, d)), y: 1560, h: 620, dir: back ? -1 : 1, halo: 0.6, arm: 10, holdBack: (x, y) => bow(x + 40, y - 120, 0.9), bob: back ? 0 : walkBob(t) });
    if (back) { ctx.save(); ctx.setLineDash([20, 18]); ctx.strokeStyle = P.gold; ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(800, 1000); ctx.lineTo(300, 1100); ctx.stroke(); ctx.restore(); }
    K.slip('बार बार', 540, 460, pop(lt, mu), -0.03, 60);
  } }); cue(st + mu, 'pop'); cue(st + de, 'pop', { gain: 0.5 }); }

  // 14 · no line drawn, no mantra read
  { const re = w('रेखा', 14), mn = w('मंत्र', 14); const st = shot(14, { cam: [540, 1150], zoom: 0.1, note: 'the empty ground before the hut; slips REKHA and MANTRA each get a red cross', draw(lt, d, t) {
    forestPage(15); forest(t); kuti(540, 1420, 1.0); grass(1480);
    for (const [tx, x, y, wt] of [['रेखा', 300, 520, re], ['मंत्र', 780, 620, mn]]) { K.slip(tx, x, y, pop(lt, wt), 0.02, 66); if (lt > wt + 0.15) { ctx.save(); ctx.translate(x, y); ctx.scale(0.6, 0.6); bigCross(0, 0, eo(seg(lt, wt + 0.15, wt + 0.45))); ctx.restore(); } }
  } }); cue(st + re + 0.2, 'slam', { gain: 0.35 }); cue(st + mn + 0.2, 'slam', { gain: 0.35 }); }

  // 15 · Aranya Kanda, sarga forty-five: no Lakshman rekha
  { const ar = w('अरण्य', 15), pa = w('पैंतालीस', 15), re = w('रेखा', 15); const st = shot(15, { cam: [540, 900], zoom: 0.1, note: 'the pothi opens: ribbon ARANYA KANDA, seal 45, the line crossed out', draw(lt, d, t) {
    K.parchment(16); glow(540, 800, 420, 0.4);
    pothi(540, 820, 1.5, eo(seg(lt, 0, 0.7)));
    K.ribbon('अरण्य कांड', 540, 380, pop(lt, ar, 0.45), 84);
    K.seal(860, 600, pop(lt, pa), '४५');
    rekha(200, 880, 1180, 1, pop(lt, re - 0.4)); bigCross(540, 1180, eo(seg(lt, re + 0.1, re + 0.5)));
  } }); cue(st + ar, 'pop', { gain: 0.6 }); cue(st + pa, 'thud', { gain: 0.5 }); cue(st + re + 0.15, 'slam', { gain: 0.4 }); }

  // 16 · then Ravana came disguised as a sannyasi
  { const ra = w('रावण', 16), sa = w('संन्यासी', 16); const st = shot(16, { cam: [540, 1100], zoom: 0.1, note: 'a saffron ascetic with staff and kamandal walks in; a faint ten-headed shadow behind him', draw(lt, d, t) {
    forestPage(17, 0.15); forest(t); kuti(300, 1420, 0.8); grass(1480);
    const k = eo(seg(lt, 0, sa + 0.3)), x = lerp(1250, 720, k);
    ctx.save(); ctx.globalAlpha = 0.28 * pop(lt, ra - 0.1, 0.5); ctx.filter = 'brightness(0.2)'; ravana(x + 30, 1540, 760, { arm: 30 }); ctx.restore();
    person({ ...SANNYASI, x, y: 1560, h: 600, dir: -1, arm: 30, hold: danda, holdBack: kamandal, bob: walkBob(t, k < 1 ? 1 : 0) });
    K.slip('संन्यासी', 540, 440, pop(lt, sa), -0.03, 62);
  } }); cue(st + ra, 'slam', { gain: 0.35 }); cue(st + sa, 'pop'); }

  // 17 · Sita, taking him for a guest, gave him a seat and water
  { const at_ = w('अतिथि', 17), as = w('आसन', 17), ja = w('जल', 17); const st = shot(17, { cam: [540, 1150], zoom: 0.1, note: 'Sita offers a grass mat and a water pot to the ascetic', draw(lt, d, t) {
    forestPage(18, 0.1); forest(t); kuti(300, 1420, 0.8); grass(1480);
    person({ ...SITA, x: 330, y: 1560, h: 540, halo: 0.8, arm: lerp(20, 80, pop(lt, ja - 0.1)), hold: lt > ja - 0.1 ? (x, y) => lota(x + 20, y + 40, 0.9) : null });
    person({ ...SANNYASI, x: 820, y: 1560, h: 600, dir: -1, arm: 30, hold: danda });
    const m = pop(lt, as - 0.1, 0.4); if (m > 0) mat(580, 1560, m);
    K.slip('अतिथि', 540, 440, pop(lt, at_), -0.03, 62);
  } }); cue(st + as, 'plop'); cue(st + ja, 'bubbles', { dur: 0.6, gain: 0.3 }); }

  // 18 · so where did the Lakshman rekha come from?
  { const re = w('रेखा', 18), ka = w('कहाँ', 18); const st = shot(18, { cam: [540, 950], zoom: 0.14, note: 'the glowing line alone on parchment, big ? above', draw(lt, d, t) {
    K.parchment(19); rekha(160, 920, 1150, eo(seg(lt, 0, re + 0.3)));
    K.slip('लक्ष्मण रेखा', 540, 980, pop(lt, re), -0.02, 60);
    K.slip('?', 540, 620, pop(lt, ka, 0.4), 0.08, 150);
  } }); cue(st + 0.1, 'sizzle', { dur: 0.7, gain: 0.25 }); cue(st + ka, 'pop'); }

  // 19 · in Tulsidas ji's Ramcharitmanas
  { const tu = w('तुलसीदास', 19), rc = w('रामचरितमानस', 19); const st = shot(19, { cam: [540, 1100], zoom: 0.1, note: 'Tulsidas (sage) writing on a pothi under a tree, ribbon RAMCHARITMANAS', draw(lt, d, t) {
    skyPage(20); forestTree(880, 1460, 1.0); grass(1480);
    person({ ...SAGE, x: 380, y: 1560, h: 560, arm: lerp(60, 80, 0.5 + 0.5 * Math.sin(t * 6)) });
    pothi(560, 1380, 0.6, seg(lt, 0, d));
    K.slip('तुलसीदास', 380, 640, pop(lt, tu), -0.03, 56);
    K.ribbon('रामचरितमानस', 540, 300, pop(lt, rc, 0.45), 80);
  } }); cue(st + tu, 'pop'); cue(st + rc, 'sparkle', { dur: 0.8 }); }

  // 20 · in Lanka Kanda, Mandodari taunts Ravana
  { const la = w('लंका', 20), mo = w('मंदोदरी', 20), ta = w('ताना', 20); const st = shot(20, { cam: [540, 1100], zoom: 0.1, note: 'golden Lanka palace; Mandodari speaks to ten-headed Ravana', draw(lt, d, t) {
    skyPage(21, '#D9C79A'); palace(540, 1160, 1.0, 1); ground(1460, '#B8A070');
    K.ribbon('लंका कांड', 540, 300, pop(lt, la, 0.45), 84);
    ravana(760, 1560, 620, { dir: -1, arm: 20 });
    const m = eo(seg(lt, mo - 0.4, mo)); person({ ...MANDO, x: lerp(-150, 300, m), y: 1560, h: 560, arm: lerp(20, 100, pop(lt, ta)) });
    K.slip('मंदोदरी', 300, 620, pop(lt, mo), -0.03, 56);
  } }); cue(st + la, 'pop', { gain: 0.6 }); cue(st + mo, 'pop'); cue(st + ta, 'pop'); }

  // 21 · the chaupai itself
  { const ra = w('रामानुज', 21), na = w('नाघेहु', 21); const st = shot(21, { cam: [540, 900], zoom: 0.08, note: 'the chaupai on a gold-rolled scroll card', draw(lt, d, t) {
    K.parchment(22); glow(540, 850, 500, 0.5);
    scrollCard(['रामानुज लघु रेख खचाई', 'सोउ नहिं नाघेहु असि मनुसाई'], 540, 850, pop(lt, ra - 0.1, 0.4), 58);
    rekha(260, 820, 1150, eo(seg(lt, na - 0.4, na + 0.4)));
  } }); cue(st + ra, 'sparkle', { dur: 1 }); }

  // 22 · you couldn't even cross a small line Lakshman drew
  { const kh = w('खींची', 22), re = w('रेखा', 22), pa = w('पार', 22); const st = shot(22, { cam: [540, 1150], zoom: 0.12, note: 'Ravana at one side of a tiny line, bumps back from it', draw(lt, d, t) {
    forestPage(23); forest(t); kuti(380, 1430, 0.9); grass(1480);
    const kp = eo(seg(lt, kh - 0.4, kh + 0.3)); if (kp > 0.01) { ctx.save(); ctx.shadowColor = 'rgba(242,160,60,0.9)'; ctx.shadowBlur = 30; ctx.strokeStyle = 'rgb(242,160,60)'; ctx.lineWidth = 14; ctx.lineCap = 'round'; ctx.beginPath(); ctx.ellipse(380, 1480, 330, 70, 0, Math.PI, Math.PI - Math.PI * kp, true); ctx.stroke(); ctx.restore(); }
    const bump = lt > pa ? Math.max(0, Math.sin((lt - pa) * 12)) * 60 * Math.exp(-(lt - pa) * 3) : 0;
    ravana(lerp(1150, 860, eo(seg(lt, 0, pa))) + bump, 1580, 560, { dir: -1, arm: 70 });
    K.slip('छोटी सी रेखा', 540, 520, pop(lt, re), -0.03, 58);
  } }); cue(st + kh, 'sizzle', { dur: 0.6, gain: 0.25 }); cue(st + pa, 'boing', { gain: 0.5 }); }

  // 23 · later tellings and TV made it a magic line
  { const ka = w('कथाओं', 23), tv_ = w('टीवी', 23), ja = w('जादुई', 23); const st = shot(23, { cam: [540, 950], zoom: 0.1, note: 'stack of pothis, then an old TV showing the line bursting into flames', draw(lt, d, t) {
    K.parchment(24);
    const b = pop(lt, ka - 0.1, 0.4); if (lt < tv_) { for (let i = 0; i < 3; i++) pothi(540, 1200 - i * 150, 1.0 * pop(lt, Math.min(0.02 + i * 0.1, ka - 0.2 + i * 0.1)), 1); }
    const v = pop(lt, tv_ - 0.1, 0.4);
    if (v > 0) tv(540, 950, 1.2 * v, () => { ctx.fillStyle = '#3A2A20'; ctx.fillRect(-300, -300, 520, 500); const f = pop(lt, ja - 0.2, 0.4); rekha(-260, 160, 80, 1); if (f > 0) for (let i = 0; i < 9; i++) { const fx = -240 + i * 48, hh = (60 + 40 * Math.sin(t * 9 + i * 2)) * f; cut(P_poly([[fx - 22, 85], [fx + Math.sin(t * 7 + i) * 8, 85 - hh], [fx + 22, 85]]), i % 2 ? '#F2A93B' : '#D9602E', { shadow: 0, edge: 0 }); } }, t);
    K.slip('जादुई रेखा', 540, 240, pop(lt, ja), -0.03, 62);
  } }); cue(st + ka, 'plop'); cue(st + tv_, 'pop'); cue(st + ja, 'sparkle', { dur: 0.8 }); }

  // 24 · did you know? tell us in the comments
  { const pa = w('पता', 24), ko = w('कमेंट', 24); const st = shot(24, { cam: [540, 950], zoom: 0.12, note: 'a big comment bubble with a heart, slip COMMENT', draw(lt, d, t) {
    K.parchment(25); bubble(540, 900, pop(lt, 0.05, 0.4), t);
    K.slip('?', 860, 560, pop(lt, pa, 0.3), 0.08, 120);
    K.slip('कमेंट करें', 540, 1250, pop(lt, ko), -0.02, 60);
  } }); cue(st + 0.05, 'pop'); cue(st + ko, 'sparkle', { dur: 0.8 }); }

  // 25 · so next time someone says "Lakshman rekha"
  { const re = w('रेखा', 25); const st = shot(25, { cam: [540, 1150], zoom: 0.12, note: 'the hut and the glowing line again (loops to the hook)', draw(lt, d, t) {
    forestPage(26); forest(t); kuti(540, 1420, 1.0); grass(1480);
    rekha(180, 900, 1520, eo(seg(lt, 0, re)));
    K.slip('लक्ष्मण रेखा', 540, 420, pop(lt, re), -0.03, 64);
  } }); cue(st + 0.1, 'sizzle', { dur: 1.0, gain: 0.25 }); }

  // 26 · remember what Valmiki wrote
  { const va = w('वाल्मीकि', 26), li = w('लिखा', 26); const st = shot(26, { cam: [540, 1100], zoom: 0.1, note: 'sage Valmiki writing at his ashram, ribbon VALMIKI, sparkles', draw(lt, d, t) {
    forestPage(27); forest(t); grass(1480); glow(540, 1100, 500, 0.5);
    person({ ...SAGE, x: 380, y: 1560, h: 620, halo: 0.6, arm: lerp(60, 80, 0.5 + 0.5 * Math.sin(t * 6)) });
    pothi(640, 1400, 0.7, seg(lt, 0, d));
    K.ribbon('वाल्मीकि', 540, 320, pop(lt, va, 0.45), 96);
    sparkles(640, 1300, 260, t, pop(lt, li));
  } }); cue(st + va, 'sparkle', { dur: 1.2 }); }

  return { shots: S, cues: CUES };
}
