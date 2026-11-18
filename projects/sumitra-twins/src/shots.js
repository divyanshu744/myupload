// SUMITRA TWINS: the shot list (Katha style, Hindi). Cut paper on parchment; no faces.
// Deities are drawn simply and respectfully: no faces. Kit from shiv-dhanush + new pieces below.
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

// ═════════════ SHIV DHANUSH ADDITIONS ═════════════
const SHIVA = { skin: '#9DB4BE', robe: '#A88A62', trim: P.ink, head: 'jata', sash: '#6B4E32' };
const JANAKA = { skin: P.skin, robe: '#EFE6D0', trim: P.gold, head: 'crown', beard: true, sash: P.crimson };
const DEVARATA = { skin: '#D6A57A', robe: P.royal, trim: P.gold, head: 'crown', beard: true, sash: P.gold };
const KING = (i) => ({ skin: [P.skin, '#D6A57A', '#C99468'][i % 3], robe: [P.royal, P.green, P.wine, '#6B4E32'][i % 4], trim: P.gold, head: 'crown', sash: [P.gold, P.crimson, '#C8702F'][i % 3] });
const COURT = (i) => ({ skin: [P.skin, '#D6A57A', '#C99468'][i % 3], robe: ['#EFE6D0', '#C8702F', '#E0D2B0', P.wine][i % 4], trim: P.gold, head: 'pagri', pagri: [C.saffron, P.crimson, '#E0B23C'][i % 3] });
const BOWWOOD = '#5A3F28';
/** Shiva's great bow, vertical (tips up/down, grip on the left at (-90, 0)). o: str 0..1 string, drw 0..1 draw, brk 0..1 broken, g glow */
function shivBow(x, y, s = 1, rot = 0, o = {}) {
  if (s <= 0) return; const { str = 0, drw = 0, brk = 0, g = 0 } = o;
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
  if (g > 0) glow(-60, 0, 560, g);
  const half = (k) => {
    ctx.save(); if (brk > 0) { ctx.translate(-90 - brk * 40, k * brk * 90); ctx.rotate(-k * brk * 0.7); ctx.translate(90, 0); }
    const path = () => { ctx.beginPath(); ctx.moveTo(-90, 0); ctx.quadraticCurveTo(-120, k * 260, 0, k * 430); };
    ctx.lineCap = 'round';
    ctx.save(); ctx.translate(8, 10); ctx.strokeStyle = 'rgba(60,40,20,0.25)'; ctx.lineWidth = 64; path(); ctx.stroke(); ctx.restore();
    ctx.strokeStyle = P.edge; ctx.lineWidth = 64; path(); ctx.stroke();
    ctx.strokeStyle = BOWWOOD; ctx.lineWidth = 52; path(); ctx.stroke();
    ctx.strokeStyle = '#7A5634'; ctx.lineWidth = 16; path(); ctx.stroke();
    for (const f of [0.3, 0.55, 0.8]) { const u = 1 - f, px = u * u * -90 + 2 * u * f * -120 + 0, py = 2 * u * f * k * 260 + f * f * k * 430; circle(px, py, 30, f === 0.55 ? P.gold : P.crimson); }
    cut(P_circ(0, k * 430, 30), P.gold, { shadow: 0.3, edge: 3 });
    if (brk > 0) { ctx.fillStyle = '#C9A06A'; ctx.beginPath(); for (let i = 0; i < 7; i++) ctx.lineTo(-90 + (i % 2 ? 16 : -16) + (i - 3) * 6, k * (i % 2 ? 4 : 14)); ctx.closePath(); ctx.fill(); }
    ctx.restore();
  };
  half(-1); half(1);
  if (brk <= 0) cut(P_rr(-122, -60, 64, 120, 14), P.crimson, { shadow: 0.3, edge: 3 });
  if (str > 0.02 && brk < 0.05) { ctx.strokeStyle = '#F4EFE2'; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(0, -430); const ex = drw * 170; if (str < 1) ctx.lineTo(0, lerp(-430, 430, str)); else { ctx.lineTo(ex, 0); ctx.lineTo(0, 430); } ctx.stroke(); }
  ctx.restore();
}
/** the great chest on eight wheels (4 near + 4 far), facing left; lid 0..1 opens, roll turns wheels, inner(): drawn inside when open */
function chestCart(x, y, s = 1, lid = 0, roll = 0, inner = null, wheelsP = 1) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  const wheel = (wx, wy, r, col, a) => { if (a <= 0) return; ctx.save(); ctx.translate(wx, wy); ctx.scale(a, a); cut(P_circ(0, 0, r), col, { shadow: 0.4, edge: 4 }); circle(0, 0, r * 0.72, '#8A6A48'); ctx.strokeStyle = col; ctx.lineWidth = 12; for (let i = 0; i < 6; i++) { const an = roll + i * Math.PI / 3; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(Math.cos(an) * r * 0.72, Math.sin(an) * r * 0.72); ctx.stroke(); } circle(0, 0, r * 0.2, P.gold); ctx.restore(); };
  const xs = [-330, -110, 110, 330];
  xs.forEach((wx, i) => wheel(wx + 70, -110, 70, '#4A3828', clamp(wheelsP * 8 - (4 + i))));
  cut(P_rr(-460, -150, 920, 40, 8), '#4A3828', { shadow: 0.4, edge: 3 });
  if (lid > 0.02) glow(0, -330, 420, 0.8 * lid);
  if (lid > 0.02 && inner) inner();
  cut(P_rr(-420, -400, 840, 260, 10), '#6B4E32');
  for (const bx of [-300, 0, 300]) cut(P_rr(bx - 22, -400, 44, 260, 4), P.gold, { shadow: 0.2, edge: 2 });
  cut(P_rr(-420, -300, 840, 26, 4), '#4A3828', { shadow: 0, edge: 0 });
  ctx.save(); ctx.translate(420, -400); ctx.rotate(lid * 1.25); cut(P_rr(-850, -50, 860, 56, 12), '#7A5634', { shadow: 0.5, edge: 4 }); for (const bx of [-720, -420, -120]) cut(P_rr(bx - 22, -50, 44, 56, 4), P.gold, { shadow: 0.2, edge: 2 }); ctx.restore();
  xs.forEach((wx, i) => wheel(wx, -70, 80, '#5A3F28', clamp(wheelsP * 8 - i)));
  // tow pole to the left
  cut(P_rr(-640, -150, 200, 26, 10), '#4A3828', { shadow: 0.3, edge: 3 });
  ctx.restore();
}
/** a row of men leaning left, pulling a rope that runs to (rx, ry) */
function pullers(x0, x1, y, h, ry, t, n, step = 1) {
  ctx.strokeStyle = '#B08A50'; ctx.lineWidth = 12; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(x0 - 80, ry); ctx.lineTo(x1 + 60, ry + 10); ctx.stroke();
  for (let i = 0; i < n; i++) { const px = lerp(x0, x1, n > 1 ? i / (n - 1) : 0); ctx.save(); ctx.translate(px, y); ctx.rotate(-0.22); person({ ...COURT(i), x: 0, y: 0, h, dir: -1, arm: 70, back: 95, bob: -Math.abs(Math.sin(t * 5 * step + i)) * 10 }); ctx.restore(); }
}
function throne(x, y, s = 1) { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); cut(P_rr(-150, -420, 300, 420, 24), P.wine); cut(P_rr(-180, -170, 360, 60, 14), P.gold, { shadow: 0.4, edge: 3 }); cut(P_poly([[-90, -420], [0, -500], [90, -420]]), P.gold, { shadow: 0.3, edge: 3 }); ctx.restore(); }
function vedi(x, y, s = 1, t = 0) { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); flame(0, -110, 0.8, t); cut(P_rr(-170, -120, 340, 120, 6), '#B7A07A'); cut(P_rr(-200, -150, 400, 40, 6), '#9C8660', { shadow: 0.3, edge: 3 }); ctx.restore(); }
function plough(hx, hy) { cut(P_poly([[hx - 8, hy - 10], [hx + 8, hy - 10], [hx + 170, hy + 230], [hx + 150, hy + 240]]), '#8A6A48', { shadow: 0.4, edge: 3 }); cut(P_poly([[hx + 140, hy + 220], [hx + 260, hy + 250], [hx + 150, hy + 270]]), '#9C9C9C', { shadow: 0.3, edge: 2 }); }
function babyGlow(x, y, s = 1, a = 1) { if (a <= 0 || s <= 0) return; ctx.save(); ctx.globalAlpha = clamp(a); ctx.translate(x, y); ctx.scale(s, s); glow(0, -20, 220, 0.9); cut(() => { ctx.beginPath(); ctx.ellipse(0, 0, 110, 66, 0, 0, TAU); }, C.white, { shadow: 0.4, edge: 3 }); cut(P_circ(80, -40, 44), '#E3B98F', { shadow: 0.3, edge: 3 }); ctx.restore(); }
function fainted(o, k) { ctx.save(); ctx.translate(o.x, o.y); ctx.rotate((o.dir || 1) * rad(85) * clamp(k)); person({ ...o, x: 0, y: 0, arm: lerp(o.arm ?? 10, 150, k) }); ctx.restore(); }
function shake(lt, a, dur = 0.8, amp = 18) { const k = clamp(1 - (lt - a) / dur); if (lt < a || k <= 0) return; ctx.translate(Math.sin(lt * 70) * amp * k, Math.cos(lt * 55) * amp * 0.7 * k); }
function book(x, y, s = 1) { if (s <= 0) return; ctx.save(); ctx.translate(x, y); ctx.scale(s, s); cut(P_rr(-130, -170, 260, 340, 10), P.wine); cut(P_rr(-108, -148, 216, 296, 6), '#EFE2BE', { shadow: 0, edge: 2 }); ctx.strokeStyle = 'rgba(62,44,30,0.5)'; ctx.lineWidth = 4; for (let i = 0; i < 6; i++) { ctx.beginPath(); ctx.moveTo(-80, -100 + i * 40); ctx.lineTo(80, -100 + i * 40); ctx.stroke(); } ctx.restore(); }
function court() {
  K.parchment(7); const fl = 1380;
  cut(P_rr(-40, 200, 1160, fl - 160, 0), P.stone, { shadow: 0, edge: 0 });
  for (const x of [120, 540, 960]) cut(() => { ctx.beginPath(); ctx.moveTo(x - 150, fl); ctx.lineTo(x - 150, 620); ctx.arc(x, 620, 150, Math.PI, TAU); ctx.lineTo(x + 150, fl); ctx.closePath(); }, P.stoneDark, { shadow: 0, edge: 0 });
  for (const x of [330, 750]) cut(P_poly([[x - 70, 260], [x + 70, 260], [x + 70, 820], [x, 760], [x - 70, 820]]), P.crimson);
  cut(P_rr(-40, fl, 1160, 600, 0), P.sepia, { shadow: 0, edge: 0 }); cut(P_rr(330, fl, 420, 600, 0), P.wine, { shadow: 0, edge: 0 });
}
function palaceDay(seed) { skyPage(seed, '#E9D6A8'); cloud(240, 360, 0.7, 0.8); cloud(860, 300, 0.6, 0.8); }


// ═════════════ SUMITRA TWINS ADDITIONS ═════════════
const DASHA = { skin: P.skin, robe: P.wine, trim: P.gold, head: 'crown', beard: true, sash: P.gold };
const KAUS = { skin: '#E3B98F', robe: '#C8952F', trim: P.crimson, head: 'queen', sari: true };
const SUMI = { skin: '#E3B98F', robe: '#2E7D6B', trim: P.gold, head: 'queen', sari: true };
const KAIK = { skin: '#D6A57A', robe: P.crimson, trim: P.gold, head: 'queen', sari: true };
const RISHYA = { skin: '#C99468', robe: '#C8702F', trim: P.gold, head: 'sage', sash: P.wine };
const PURUSHA = { skin: '#E0A848', robe: P.crimson, trim: P.gold, head: 'crown', sash: P.gold };
const QCOL = { k: '#C8952F', s: '#2E7D6B', y: P.crimson };
const BOY_R = { skin: '#3F6FA8', robe: '#E0B23C', trim: P.crimson, head: 'bun', sash: P.crimson };
const BOY_L = { skin: '#E3B98F', robe: '#C8702F', trim: P.gold, head: 'bun', sash: P.wine };
const BOY_B = { skin: '#5A7FA8', robe: P.royal, trim: P.gold, head: 'bun', sash: P.gold };
const BOY_S = { skin: '#E3B98F', robe: '#2E7D6B', trim: P.gold, head: 'bun', sash: P.crimson };
/** golden vessel of divine kheer; lid 0..1 lifts the silver lid, g glow */
function payasPot(x, y, s = 1, lid = 0, g = 0, t = 0) {
  if (s <= 0) return; ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  if (g > 0) glow(0, -120, 340, g * (0.85 + 0.15 * Math.sin(t * 4)));
  cut(() => { ctx.beginPath(); ctx.moveTo(-150, -150); ctx.bezierCurveTo(-190, -20, -110, 0, -70, 0); ctx.lineTo(70, 0); ctx.bezierCurveTo(110, 0, 190, -20, 150, -150); ctx.closePath(); }, P.gold);
  ctx.strokeStyle = P.crimson; ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(-160, -95); ctx.quadraticCurveTo(0, -60, 160, -95); ctx.stroke();
  cut(() => { ctx.beginPath(); ctx.ellipse(0, -150, 152, 34, 0, 0, TAU); }, '#A87A22', { shadow: 0.2, edge: 3 });
  cut(() => { ctx.beginPath(); ctx.ellipse(0, -146, 136, 26, 0, 0, TAU); }, C.milk, { shadow: 0, edge: 0 });
  for (let i = 0; i < 5; i++) circle(-80 + i * 40, -146 + (i % 2 ? 6 : -6), 6, i % 2 ? '#C9A06A' : '#7A9A4A');
  ctx.save(); ctx.translate(130 * lid, -160 - 160 * lid); ctx.rotate(0.5 * lid);
  cut(() => { ctx.beginPath(); ctx.ellipse(0, 0, 158, 40, 0, Math.PI, TAU); ctx.closePath(); }, '#C9CDD2', { shadow: 0.4, edge: 4 }); cut(P_circ(0, -44, 18), '#B0B5BA', { shadow: 0.3, edge: 3 });
  ctx.restore(); ctx.restore();
}
function kheerBowl(x, y, s = 1, col = P.gold) { if (s <= 0) return; ctx.save(); ctx.translate(x, y); ctx.scale(s, s); cut(() => { ctx.beginPath(); ctx.moveTo(-90, -40); ctx.quadraticCurveTo(0, 70, 90, -40); ctx.closePath(); }, col, { shadow: 0.4, edge: 3 }); cut(() => { ctx.beginPath(); ctx.ellipse(0, -40, 90, 20, 0, 0, TAU); }, C.milk, { shadow: 0, edge: 3 }); ctx.restore(); }
/** one wedge of kheer from angle a0 to a1 (degrees, 0 = right, clockwise), rimmed in col; moved by (dx, dy), scaled sc */
function wedge(cx, cy, r, a0, a1, col, dx = 0, dy = 0, sc = 1, a = 1) {
  if (a <= 0 || sc <= 0) return; ctx.save(); ctx.globalAlpha = clamp(a); ctx.translate(cx + dx, cy + dy); ctx.scale(sc, sc);
  const p = () => { ctx.beginPath(); ctx.moveTo(0, 0); ctx.arc(0, 0, r, rad(a0), rad(a1)); ctx.closePath(); };
  cut(p, C.milk, { shadow: 0.5, edge: 4 });
  for (let i = 0; i < 4; i++) { const an = rad(lerp(a0, a1, (i + 0.5) / 4)); circle(Math.cos(an) * r * 0.6, Math.sin(an) * r * 0.6, 7, i % 2 ? '#C9A06A' : '#7A9A4A'); }
  ctx.strokeStyle = col; ctx.lineWidth = 22; ctx.lineCap = 'round'; ctx.beginPath(); ctx.arc(0, 0, r - 11, rad(a0) + 0.04, rad(a1) - 0.04); ctx.stroke();
  ctx.restore();
}
function platter(cx, cy, r) { cut(P_circ(cx, cy, r + 40), P.gold, { shadow: 0.6, edge: 5 }); circle(cx, cy, r + 14, '#A87A22'); }
/** a fraction label in big crimson numerals: n over d */
function frac(n, d, x, y, sc = 1, size = 120, col = P.crimson) { if (sc <= 0) return; ctx.save(); ctx.translate(x, y); ctx.scale(sc, sc); cut(P_rr(-size * 0.75, -size * 1.35, size * 1.5, size * 2.7, 10), P.edge, { shadow: 0.6, edge: 0 }); ctx.font = `800 ${size}px NotoDeva`; ctx.fillStyle = col; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(String(n), 0, -size * 0.62); ctx.fillText(String(d), 0, size * 0.72); ctx.fillStyle = P.ink; ctx.fillRect(-size * 0.5, -6, size, 12); ctx.restore(); }
/** a swaddled baby lying in a glow, head to the right */
function baby(x, y, s = 1, skin = '#E3B98F', a = 1, wrap = C.white) { if (a <= 0 || s <= 0) return; ctx.save(); ctx.globalAlpha = clamp(a); ctx.translate(x, y); ctx.scale(s, s); glow(0, -10, 200, 0.7); cut(() => { ctx.beginPath(); ctx.ellipse(-10, 0, 105, 60, 0, 0, TAU); }, wrap, { shadow: 0.4, edge: 3 }); cut(P_rr(-60, -50, 18, 100, 6), P.gold, { shadow: 0, edge: 0 }); cut(P_circ(85, -30, 46), skin, { shadow: 0.3, edge: 3 }); ctx.restore(); }
/** a hanging wooden cradle (palna); inner() draws what lies in it; rock 0..1 swings it */
function cradle(x, y, s = 1, inner = null, sw = 0) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  for (const k of [-1, 1]) cut(P_rr(k * 300 - 18, -520, 36, 520, 8), '#6B4E32', { shadow: 0.4, edge: 3 });
  cut(P_rr(-330, -540, 660, 40, 12), '#7A5634', { shadow: 0.4, edge: 3 }); for (const k of [-1, 1]) circle(k * 300, -540, 26, P.gold);
  ctx.save(); ctx.translate(0, -510); ctx.rotate(sw);
  ctx.strokeStyle = '#B08A50'; ctx.lineWidth = 8; for (const k of [-1, 1]) { ctx.beginPath(); ctx.moveTo(k * 40, 0); ctx.lineTo(k * 230, 330); ctx.stroke(); }
  if (inner) inner(0, 300);
  cut(() => { ctx.beginPath(); ctx.moveTo(-260, 300); ctx.quadraticCurveTo(-250, 420, -120, 420); ctx.lineTo(120, 420); ctx.quadraticCurveTo(250, 420, 260, 300); ctx.closePath(); }, '#A0522D');
  ctx.strokeStyle = P.gold; ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(-230, 350); ctx.lineTo(230, 350); ctx.stroke();
  ctx.restore(); ctx.restore();
}
function nightPage(seed, t = 0) { K.parchment(seed); wash('#1E2440', 0.88); for (let i = 0; i < 40; i++) { const x = rnd(i + seed) * W, y = rnd(i + 50 + seed) * 1300; circle(x, y, 3 + 2 * rnd(i + 7), `rgba(244,239,226,${0.4 + 0.4 * Math.sin(t * 2 + i)})`); } }
function moon(x, y, r) { glow(x, y, r * 2.6, 0.5, '244,239,226'); cut(P_circ(x, y, r), '#F4EFE2', { shadow: 0.3, edge: 3 }); circle(x + r * 0.35, y - r * 0.2, r * 0.85, 'rgba(30,36,64,0.85)'); }
/** the Ashlesha nakshatra drawn as a little serpent of stars; p draws the line, g lights it */
const ASH = [[-260, 120], [-170, 40], [-60, 80], [40, -10], [140, 30], [230, -60], [290, -10]];
function ashlesha(x, y, s = 1, p = 1, g = 1, t = 0) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  const n = (ASH.length - 1) * clamp(p); ctx.strokeStyle = '#F2C14E'; ctx.lineWidth = 6; ctx.shadowColor = 'rgba(242,193,78,0.9)'; ctx.shadowBlur = 20 * g; ctx.beginPath(); ctx.moveTo(...ASH[0]);
  for (let i = 1; i <= Math.ceil(n); i++) { const k = Math.min(1, n - (i - 1)); ctx.lineTo(lerp(ASH[i - 1][0], ASH[i][0], k), lerp(ASH[i - 1][1], ASH[i][1], k)); } if (p > 0.01) ctx.stroke(); ctx.shadowBlur = 0;
  ASH.forEach(([sx, sy], i) => { const r = 16 + 5 * Math.sin(t * 4 + i); glow(sx, sy, 70, 0.6 * g); ctx.fillStyle = '#F7E3A0'; ctx.beginPath(); for (let j = 0; j < 8; j++) { const rr_ = j % 2 ? r * 0.4 : r; ctx.lineTo(sx + Math.cos(j * Math.PI / 4) * rr_, sy + Math.sin(j * Math.PI / 4) * rr_); } ctx.closePath(); ctx.fill(); });
  ctx.restore();
}
function heart(x, y, s = 1, a = 1) { if (a <= 0) return; ctx.save(); ctx.globalAlpha = clamp(a); ctx.translate(x, y); ctx.scale(s, s); cut(() => { ctx.beginPath(); ctx.moveTo(0, 60); ctx.bezierCurveTo(-120, -20, -70, -110, 0, -50); ctx.bezierCurveTo(70, -110, 120, -20, 0, 60); }, P.crimson, { shadow: 0.5, edge: 4 }); ctx.restore(); }
function link(x0, x1, y, p = 1, col = P.crimson) { if (p <= 0.02) return; ctx.save(); ctx.strokeStyle = col; ctx.lineWidth = 14; ctx.lineCap = 'round'; ctx.setLineDash([30, 22]); ctx.beginPath(); ctx.moveTo(x0, y); ctx.lineTo(lerp(x0, x1, p), y); ctx.stroke(); ctx.restore(); }

export function buildShots() {
  const S = [], CUES = [], add = (o) => (S.push(o), o), cue = (t, type, o = {}) => CUES.push({ t: +t.toFixed(3), type, ...o });
  const OFF = 2;
  const at = (i) => L(i + OFF) - 0.08;
  const w = (word, i) => Wd(word, i + OFF) - at(i);
  const pop = (lt, a, dur = 0.35) => (lt > a ? eob(seg(lt, a, a + dur)) : 0);
  const shot = (i, o) => { const st = at(i); add({ id: `S${String(i).padStart(2, '0')}`, at: st, ...o }); cue(st, 'whoosh', { gain: 0.5 }); return st; };
  const sub = (id, st, o) => { add({ id, at: st, ...o }); cue(st, 'whoosh', { gain: 0.45 }); return st; };
  const subAt = (i, word) => Wd(word, i + OFF) - 0.12;
  const walkBob = (t, k = 1) => -Math.abs(Math.sin(t * 9)) * 12 * k;
  const CX = 540, CY = 760, R = 230; // the kheer "pie"

  // H0a · hook: two young princes side by side, names
  { const la = Wd('लक्ष्मण', 0), sh = Wd('शत्रुघ्न', 0); add({ id: 'H0a', at: 0, cam: [540, 1000], zoom: 0.12, note: 'hook: young Lakshmana and Shatrughna stand side by side in a glow; slips with their names', draw(lt, d, t) {
    palaceDay(40); ground(1480, '#C9AE7A'); glow(540, 1100, 560, 0.45);
    person({ ...BOY_L, x: 360, y: 1580, h: 470, halo: 0.4, arm: 20 });
    person({ ...BOY_S, x: 720, y: 1580, h: 470, dir: -1, halo: 0.4, arm: 20 });
    K.slip('लक्ष्मण', 330, 560, pop(lt, la - 0.1), -0.04, 72); K.slip('शत्रुघ्न', 750, 560, pop(lt, sh - 0.1), 0.04, 72);
  } }); cue(0.05, 'whoosh', { gain: 0.5 }); cue(la, 'pop'); cue(sh, 'pop'); }
  // H0b · twins? two babies in one cradle
  { const st = Wd('जुड़वाँ', 0) - 0.12; sub('H0b', st, { cam: [540, 1000], zoom: 0.14, note: 'hook: one cradle, two babies glowing; big crimson JUDWAAN?', draw(lt, d, t) {
    palaceDay(41); ground(1500, '#C9AE7A');
    cradle(540, 1500, 1.0, (x, y) => { baby(x - 110, y + 10, 0.8); baby(x + 110, y + 10, 0.8); }, Math.sin(t * 2) * 0.06);
    bigText('जुड़वाँ?', 540, 420, 150, P.crimson, pop(lt, 0.05, 0.45));
  } }); cue(st + 0.05, 'slam', { gain: 0.35 }); }
  // H1 · no? come, I'll tell you: the golden vessel of kheer glows; title ribbon
  { const st = L(1) - 0.08, ai = Wd('आइए', 1) - st; add({ id: 'H1', at: st, cam: [540, 1000], zoom: 0.1, note: 'hook: the golden vessel of divine kheer glowing; title ribbon', draw(lt, d, t) {
    palaceDay(42); glow(540, 1050, 520, 0.4);
    payasPot(540, 1300, 1.5, pop(lt, ai, 0.5), 0.8, t);
    K.ribbon('जुड़वाँ क्यों?', 540, 330, pop(lt, 0.05, 0.45), 100);
    sparkles(540, 1050, 320, t, pop(lt, ai));
  } }); cue(st + 0.05, 'pop', { gain: 0.6 }); cue(st + ai, 'sparkle', { dur: 1 }); }

  // 0 · Dasharatha had three queens, but no child
  { const da = w('दशरथ', 0), ti = w('तीन', 0), sa = w('संतान', 0); const st = shot(0, { cam: [540, 1050], zoom: 0.12, note: 'court: King Dasharatha on his throne, three queens appear on TEEN; an empty cradle with a cross on SANTAAN', draw(lt, d, t) {
    court(); throne(250, 1420, 0.85);
    person({ ...DASHA, x: 250, y: 1440, h: 520, halo: 0.2, arm: 25 });
    [KAUS, SUMI, KAIK].forEach((q, i) => { const k = pop(lt, ti + i * 0.12, 0.35); if (k > 0) { ctx.save(); ctx.globalAlpha = clamp(k); person({ ...q, x: 560 + i * 170, y: 1580, h: 430, dir: -1, arm: 15 }); ctx.restore(); } });
    K.slip('राजा दशरथ', 260, 300, pop(lt, da), -0.03, 58); K.slip('तीन रानियाँ', 760, 420, pop(lt, ti), 0.03, 58);
    const c = pop(lt, sa - 0.25, 0.4); if (c > 0) { ctx.save(); ctx.translate(780, 840); ctx.scale(0.45 * c, 0.45 * c); cradle(0, 300, 1); ctx.restore(); bigCross(780, 820, eo(seg(lt, sa, sa + 0.4))); }
  } }); cue(st + da, 'pop'); cue(st + ti, 'pop'); cue(st + sa, 'slam', { gain: 0.35 }); }

  // 1 · then the sage Rishyashringa performed a sacrifice for a son
  { const ri = w('ऋष्यश्रृंग', 1), pu = w('पुत्र', 1), ya = w('यज्ञ', 1); const st = shot(1, { cam: [540, 1100], zoom: 0.12, note: 'the sage Rishyashringa sits by the fire altar pouring an offering; Dasharatha with joined palms across; slips', draw(lt, d, t) {
    palaceDay(1); ground(1480, '#B7A07A');
    const f = pop(lt, ya - 0.3, 0.5); ctx.save(); ctx.translate(540, 1520); ctx.scale(0.7 + 0.3 * f, 0.7 + 0.3 * f); vedi(0, 0, 1, t); ctx.restore();
    person({ ...RISHYA, x: 220, y: 1580, h: 560, arm: lerp(30, 75, eio(seg(lt, 0, d))), hold: (x, y) => lota(x + 20, y + 40, 0.8) });
    person({ ...DASHA, x: 880, y: 1580, h: 540, dir: -1, arm: 75, back: 75 });
    K.slip('ऋष्यश्रृंग मुनि', 280, 400, pop(lt, ri), -0.03, 54); K.slip('पुत्र के लिए', 800, 560, pop(lt, pu), 0.03, 54); K.ribbon('यज्ञ', 540, 260, pop(lt, ya, 0.45), 100);
  } }); cue(st + ri, 'pop'); cue(st + pu, 'pop'); cue(st + ya, 'whoosh', { gain: 0.4 }); }

  // 2 · from the fire, a divine being appeared
  { const aa = w('आग', 2), di = w('दिव्य', 2), pr = w('प्रकट', 2); const st = shot(2, { cam: [540, 1050], zoom: 0.14, note: 'close on the big fire; a radiant golden being with a halo rises out of the flames', draw(lt, d, t) {
    skyPage(2, '#E2C48E'); wash(P.crimson, 0.06); ground(1520, '#B7A07A');
    const r = eo(seg(lt, di - 0.3, pr + 0.4)); glow(540, 1000, 600, 0.3 + 0.5 * r);
    if (r > 0) { ctx.save(); ctx.globalAlpha = clamp(r * 1.5); person({ ...PURUSHA, x: 540, y: 1560 - 300 * r, h: 600, halo: r, arm: 30, back: 30 }); ctx.restore(); }
    flame(540, 1560, 1.5 * (0.8 + 0.2 * pop(lt, aa, 0.4)), t); cut(P_rr(260, 1500, 560, 120, 8), '#9C8660');
    K.slip('दिव्य पुरुष', 540, 300, pop(lt, di), 0.03, 68);
  } }); cue(st + aa, 'whoosh', { gain: 0.4 }); cue(st + pr, 'sparkle', { dur: 1.2 }); }

  // 3 · in his hands a golden vessel, full of divine kheer
  { const so = w('सोने', 3), kh = w('खीर', 3); const st = shot(3, { cam: [540, 1000], zoom: 0.14, note: 'close: the golden vessel held up; the silver lid lifts on KHEER and white kheer glows', draw(lt, d, t) {
    skyPage(3, '#E2C48E'); glow(540, 950, 560, 0.5);
    payasPot(540, 1250, 1.9, eo(seg(lt, kh - 0.3, kh + 0.3)), 0.6 + 0.4 * pop(lt, kh), t);
    K.slip('सोने का पात्र', 540, 330, pop(lt, so), -0.03, 64); K.slip('दिव्य खीर', 820, 640, pop(lt, kh), 0.04, 60);
  } }); cue(st + so, 'pop'); cue(st + kh, 'sparkle', { dur: 1 }); }

  // 4 · he said: feed this kheer to your queens
  { const kh = w('खीर', 4), ra = w('रानियों', 4), ki = w('खिलाइए', 4); const st = shot(4, { cam: [540, 1100], zoom: 0.1, note: 'the divine being hands the vessel to Dasharatha, who bows; the three queens appear behind on RANIYON', draw(lt, d, t) {
    palaceDay(4); ground(1480, '#C9AE7A');
    const g = eio(seg(lt, ki - 0.5, ki + 0.2));
    person({ ...PURUSHA, x: 220, y: 1580, h: 600, halo: 1, arm: lerp(70, 88, g), hold: (x, y) => payasPot(x + 30 + 90 * g, y + 40, 0.55, 0, 0.5, t) });
    bowing({ ...DASHA, x: 640, y: 1580, h: 540, dir: -1, arm: 80, back: 80 }, pop(lt, ki, 0.5));
    [KAUS, SUMI, KAIK].forEach((q, i) => { const k = pop(lt, ra + i * 0.1, 0.35); if (k > 0) { ctx.save(); ctx.globalAlpha = clamp(k); person({ ...q, x: 820 + i * 110, y: 1500, h: 360, dir: -1, arm: 15 }); ctx.restore(); } });
    K.slip('रानियों को', 860, 520, pop(lt, ra), 0.04, 58); K.slip('खीर', 300, 420, pop(lt, kh), -0.04, 70);
  } }); cue(st + kh, 'pop'); cue(st + ra, 'pop'); }

  // 5 · Dasharatha gave HALF to the eldest queen Kausalya
  { const aa = w('आधी', 5), ka = w('कौसल्या', 5); const st = shot(5, { cam: [540, 950], zoom: 0.1, note: 'the kheer as a round platter (pie); the LEFT HALF, rimmed gold, slides down-left to Kausalya; fraction 1/2', draw(lt, d, t) {
    palaceDay(5); platter(CX, CY, R);
    const m = eio(seg(lt, ka - 0.2, ka + 0.5));
    person({ ...KAUS, x: 230, y: 1580, h: 470, halo: 0.2, arm: lerp(15, 75, m) });
    wedge(CX, CY, R, -90, 90, P.gold); wedge(CX, CY, R, 90, 270, QCOL.k, -60 * m, 480 * m, 1 - 0.55 * m);
    frac(1, 2, 880, 420, pop(lt, aa), 100); K.slip('कौसल्या', 200, 1020, pop(lt, ka), -0.04, 58);
  } }); cue(st + aa, 'pop', { gain: 0.6 }); cue(st + ka, 'whoosh', { gain: 0.4 }); }

  // 6 · half of the rest, a QUARTER, to Sumitra
  { const aa = w('आधा', 6), ch = w('चौथाई', 6), su = w('सुमित्रा', 6); const st = shot(6, { cam: [540, 950], zoom: 0.1, note: 'the remaining right half; its top quarter, rimmed green, slides down-right to Sumitra; fraction 1/4', draw(lt, d, t) {
    palaceDay(6); platter(CX, CY, R);
    const m = eio(seg(lt, su - 0.2, su + 0.5));
    wedge(CX, CY, R, 0, 90, P.gold);
    ctx.save(); ctx.globalAlpha = 0.18; cut(() => { ctx.beginPath(); ctx.moveTo(CX, CY); ctx.arc(CX, CY, R, rad(90), rad(270)); ctx.closePath(); }, '#A87A22', { shadow: 0, edge: 0 }); ctx.restore();
    person({ ...SUMI, x: 850, y: 1580, h: 470, dir: -1, halo: 0.2, arm: lerp(15, 75, m) });
    wedge(CX, CY, R, -90, 0, QCOL.s, 60 * m, 570 * m, 1 - 0.5 * m);
    K.slip('आधे का आधा', 240, 420, pop(lt, aa), -0.04, 54); frac(1, 4, 240, 760, pop(lt, ch), 90); K.slip('सुमित्रा', 870, 1020, pop(lt, su), 0.04, 58);
  } }); cue(st + aa, 'pop'); cue(st + ch, 'pop', { gain: 0.6 }); cue(st + su, 'whoosh', { gain: 0.4 }); }

  // 7 · of what was left, half to Kaikeyi
  { const ba = w('बचा', 7), ka = w('कैकेयी', 7); const st = shot(7, { cam: [540, 950], zoom: 0.1, note: 'the remaining quarter; its upper eighth, rimmed crimson, slides down to Kaikeyi; fraction 1/8', draw(lt, d, t) {
    palaceDay(7); platter(CX, CY, R);
    const m = eio(seg(lt, ka - 0.2, ka + 0.5));
    wedge(CX, CY, R, 45, 90, P.gold);
    person({ ...KAIK, x: 760, y: 1580, h: 470, dir: -1, halo: 0.2, arm: lerp(15, 75, m) });
    wedge(CX, CY, R, 0, 45, QCOL.y, -20 * m, 470 * m, 1 - 0.4 * m);
    K.slip('जो बचा', 230, 420, pop(lt, ba), -0.04, 60); frac(1, 8, 230, 760, pop(lt, ba + 0.3), 90); K.slip('कैकेयी', 860, 1020, pop(lt, ka), 0.04, 58);
  } }); cue(st + ba, 'pop'); cue(st + ka, 'whoosh', { gain: 0.4 }); }

  // 8 · now only an eighth was left in the vessel
  { const pa = w('पात्र', 8), aa = w('आठवाँ', 8); const st = shot(8, { cam: [540, 950], zoom: 0.14, note: 'the empty gold platter with one small eighth of kheer left, glowing; big 1/8', draw(lt, d, t) {
    palaceDay(8); platter(CX, CY + 80, R);
    wedge(CX, CY + 80, R, 45, 90, P.gold, 0, 0, 1 + 0.08 * pop(lt, aa)); glow(CX + 70, CY + 170, 200, 0.5 * pop(lt, aa));
    K.slip('बस इतना', 540, 1180, pop(lt, pa), -0.03, 60); frac(1, 8, 870, 420, pop(lt, aa), 110);
  } }); cue(st + pa, 'pop'); cue(st + aa, 'pop', { gain: 0.6 }); }

  // 9 · Dasharatha thought a little, and gave that too to Sumitra!
  { const so = w('सोचा', 9); const st = shot(9, { cam: [540, 1050], zoom: 0.12, note: 'Dasharatha holds the last bowl, a thought cloud with ? above him', draw(lt, d, t) {
    palaceDay(9); ground(1480, '#C9AE7A');
    person({ ...DASHA, x: 540, y: 1580, h: 560, halo: 0.2, arm: 75, back: 150, hold: (x, y) => kheerBowl(x + 40, y + 10, 0.9) });
    thought(780, 560, pop(lt, so - 0.1, 0.4), t);
  } }); cue(st + so, 'pop'); }
  { const st = subAt(9, 'सुमित्रा'), su = Wd('सुमित्रा', 9 + OFF) - st; sub('S09b', st, { cam: [540, 1050], zoom: 0.14, note: 'the bowl slides into Sumitra\'s hands; sparkles; she now holds two bowls; slip SUMITRA', draw(lt, d, t) {
    palaceDay(10); ground(1480, '#C9AE7A');
    const m = eio(seg(lt, 0, 0.6));
    person({ ...DASHA, x: 220, y: 1580, h: 540, halo: 0.2, arm: lerp(80, 70, m) });
    person({ ...SUMI, x: 800, y: 1580, h: 520, dir: -1, halo: 0.4 + 0.4 * m, arm: 75, back: 75 });
    kheerBowl(lerp(420, 640, m), lerp(1230, 1250, m) - Math.sin(m * Math.PI) * 120, 0.8, QCOL.s); kheerBowl(670, 1150, 0.8, QCOL.s);
    sparkles(700, 1180, 200, t, pop(lt, su + 0.3)); K.slip('फिर सुमित्रा को!', 640, 420, pop(lt, su), 0.03, 60);
  } }); cue(st + su, 'sparkle', { dur: 1 }); }

  // 10 · so Sumitra got TWO portions
  { const su = w('सुमित्रा', 10), dd = w('दो', 10); const st = shot(10, { cam: [540, 950], zoom: 0.1, note: 'the whole pie reassembled, each slice rimmed in its queen\'s colour; the two green slices lift and glow; big 2', draw(lt, d, t) {
    palaceDay(11); platter(CX, CY, R);
    const g = pop(lt, dd, 0.4);
    wedge(CX, CY, R, 90, 270, QCOL.k); wedge(CX, CY, R, 0, 45, QCOL.y);
    wedge(CX, CY, R, -90, 0, QCOL.s, 40 * g, -40 * g, 1 + 0.05 * g); wedge(CX, CY, R, 45, 90, QCOL.s, 40 * g, 40 * g, 1 + 0.05 * g);
    K.slip('कौसल्या', 200, 1120, pop(lt, 0.05), -0.04, 50); K.slip('कैकेयी', 540, 1200, pop(lt, 0.15), 0.03, 50); K.slip('सुमित्रा', 880, 1120, pop(lt, su), 0.04, 56);
    bigText('2', 900, 380, 220, P.crimson, g);
  } }); cue(st + su, 'pop'); cue(st + dd, 'slam', { gain: 0.35 }); }

  // 11 · in time, Rama was born to Kausalya, and Bharata to Kaikeyi
  { const ra = w('राम', 11), bh = w('भरत', 11); const st = shot(11, { cam: [540, 1050], zoom: 0.12, note: 'Kausalya (left) holds baby Rama (blue) in a glow; then Kaikeyi (right) holds baby Bharata', draw(lt, d, t) {
    palaceDay(12); ground(1480, '#C9AE7A');
    person({ ...KAUS, x: 280, y: 1580, h: 520, halo: 0.3, arm: 75, back: 75, hold: (x, y) => baby(x + 10, y - 10, 0.7, BOY_R.skin, pop(lt, ra - 0.1, 0.4)) });
    const kb = pop(lt, bh - 0.3, 0.4); if (kb > 0) { ctx.save(); ctx.globalAlpha = clamp(kb); person({ ...KAIK, x: 800, y: 1580, h: 520, dir: -1, halo: 0.3, arm: 75, back: 75, hold: (x, y) => baby(x + 10, y - 10, 0.7, BOY_B.skin, pop(lt, bh, 0.4)) }); ctx.restore(); }
    K.slip('राम', 280, 560, pop(lt, ra), -0.04, 76); K.slip('भरत', 800, 560, pop(lt, bh), 0.04, 76);
  } }); cue(st + ra, 'sparkle', { dur: 0.8 }); cue(st + bh, 'sparkle', { dur: 0.8 }); }

  // 12 · and Sumitra gave birth to two sons together
  { const sa = w('साथ', 12), dd = w('दो', 12); const st = shot(12, { cam: [540, 1000], zoom: 0.12, note: 'Sumitra beside a cradle; two babies appear in it, one then the other, on SAATH / DO', draw(lt, d, t) {
    palaceDay(13); ground(1500, '#C9AE7A');
    person({ ...SUMI, x: 170, y: 1580, h: 520, halo: 0.4, arm: 60 });
    cradle(680, 1500, 0.85, (x, y) => { baby(x - 110, y + 10, 0.8, '#E3B98F', pop(lt, sa - 0.1, 0.4)); baby(x + 110, y + 10, 0.8, '#E3B98F', pop(lt, dd - 0.1, 0.4)); }, Math.sin(t * 2) * 0.05);
    K.slip('एक साथ', 680, 420, pop(lt, sa), -0.03, 64); bigText('दो बेटे', 680, 640, 110, P.crimson, pop(lt, dd));
  } }); cue(st + sa, 'pop'); cue(st + dd, 'sparkle', { dur: 1 }); }

  // 13 · Lakshmana and Shatrughna! Two portions, two sons
  { const la = w('लक्ष्मण', 13), sh = w('शत्रुघ्न', 13), hi = w('हिस्से', 13), be = w('बेटे', 13); const st = shot(13, { cam: [540, 1000], zoom: 0.1, note: 'two green-rimmed bowls on top with arrows down to the two little princes Lakshmana and Shatrughna', draw(lt, d, t) {
    palaceDay(14); ground(1480, '#C9AE7A');
    person({ ...BOY_L, x: 330, y: 1580, h: 440, halo: 0.4, arm: 20 }); person({ ...BOY_S, x: 750, y: 1580, h: 440, dir: -1, halo: 0.4, arm: 20 });
    const b = pop(lt, hi - 0.15, 0.35); kheerBowl(330, 520, 0.9 * b, QCOL.s); kheerBowl(750, 520, 0.9 * b, QCOL.s);
    arrow(330, 590, 330, 760, eo(seg(lt, be - 0.1, be + 0.3))); arrow(750, 590, 750, 760, eo(seg(lt, be - 0.1, be + 0.3)));
    K.slip('लक्ष्मण', 330, 330, pop(lt, la), -0.04, 64); K.slip('शत्रुघ्न', 750, 330, pop(lt, sh), 0.04, 64);
  } }); cue(st + la, 'pop'); cue(st + sh, 'pop'); cue(st + be, 'sparkle', { dur: 0.8 }); }

  // 14 · in the Valmiki Ramayana, both were born under one nakshatra, Ashlesha
  { const va = w('वाल्मीकि', 14); const st = shot(14, { cam: [540, 950], zoom: 0.12, note: 'an old palm-leaf pothi writes itself; slip VALMIKI RAMAYAN', draw(lt, d, t) {
    K.parchment(15); glow(540, 900, 420, 0.4);
    pothi(540, 950, 1.3, eo(seg(lt, 0, d)));
    K.slip('वाल्मीकि रामायण', 540, 520, pop(lt, va), -0.03, 64); K.slip('बालकांड 18', 540, 1180, pop(lt, va + 0.4), 0.03, 52);
  } }); cue(st + va, 'pop'); }
  { const st = subAt(14, 'नक्षत्र'), nk = Wd('नक्षत्र', 14 + OFF) - st, as = Wd('आश्लेषा', 14 + OFF) - st; sub('S14b', st, { cam: [540, 950], zoom: 0.12, note: 'night sky: the serpent-shaped Ashlesha stars join up and glow over the cradle with two babies; ribbon ASHLESHA', draw(lt, d, t) {
    nightPage(16, t); moon(900, 260, 70);
    ashlesha(520, 640, 1.2, eo(seg(lt, nk - 0.1, as + 0.3)), 0.4 + 0.6 * pop(lt, as), t);
    cradle(540, 1520, 0.6, (x, y) => { baby(x - 110, y + 10, 0.8); baby(x + 110, y + 10, 0.8); });
    K.ribbon('आश्लेषा', 540, 330, pop(lt, as, 0.45), 96);
  } }); cue(st + nk, 'sparkle', { dur: 1 }); cue(st + as, 'pop', { gain: 0.6 }); }

  // 15 · Lakshmana was with Rama from childhood; Rama would neither sleep nor eat without him
  { const ba = w('बचपन', 15); const st = shot(15, { cam: [540, 1100], zoom: 0.1, note: 'the boys Rama and Lakshmana walk together, Rama with a small bow; slip BACHPAN SE', draw(lt, d, t) {
    palaceDay(17); ground(1480, '#C9AE7A'); palace(820, 1200, 0.45, 1);
    const g = eo(seg(lt, 0, d)) * 120;
    person({ ...BOY_R, x: 420 + g, y: 1580, h: 470, halo: 0.6, arm: 15, bob: walkBob(t), holdBack: (x, y) => bow(x, y - 50, 0.4) });
    person({ ...BOY_L, x: 200 + g, y: 1580, h: 450, halo: 0.4, arm: 70, bob: walkBob(t + 0.3) });
    K.slip('बचपन से साथ', 420, 460, pop(lt, ba), -0.03, 60);
  } }); cue(st + ba, 'pop'); }
  { const st = subAt(15, 'बिना'), bi = Wd('बिना', 15 + OFF) - st, so = Wd('सोते', 15 + OFF) - st, kh = Wd('खाते', 15 + OFF) - st; sub('S15b', st, { cam: [540, 1050], zoom: 0.12, note: 'night room: boy Rama sits awake on his mat, the mat beside him empty, a full plate untouched; slips NEEND NAHIN / KHAANA NAHIN', draw(lt, d, t) {
    nightPage(18, t); moon(860, 300, 60); cut(P_rr(-300, 1380, W + 600, 900, 0), '#4A3828', { shadow: 0.5, edge: 4 });
    diya(140, 1420, 0.8, t);
    mat(380, 1500, 1.3); mat(760, 1500, 1.3);
    person({ ...BOY_R, x: 380, y: 1530, h: 420, halo: 0.4, arm: 20 });
    plate(760, 1480, 0.9); for (let i = 0; i < 3; i++) modak(720 + i * 40, 1470, 0.45);
    K.slip('उनके बिना', 540, 420, pop(lt, bi), -0.03, 60); K.slip('न नींद', 300, 700, pop(lt, so), -0.04, 60); K.slip('न खाना', 780, 760, pop(lt, kh), 0.04, 60);
  } }); cue(st + bi, 'pop'); cue(st + so, 'pop'); cue(st + kh, 'pop'); }

  // 16 · and Shatrughna was dearer than life to Bharata
  { const sh = w('शत्रुघ्न', 16), pr = w('प्राणों', 16); const st = shot(16, { cam: [540, 1050], zoom: 0.12, note: 'boys Bharata and Shatrughna side by side, a crimson heart rises between them on PRAANON', draw(lt, d, t) {
    palaceDay(19); ground(1480, '#C9AE7A');
    person({ ...BOY_B, x: 340, y: 1580, h: 470, halo: 0.5, arm: 60 }); person({ ...BOY_S, x: 720, y: 1580, h: 450, dir: -1, halo: 0.4, arm: 60 });
    const hp = pop(lt, pr, 0.45); heart(530, 900 - 80 * hp, 1.3 * hp, hp);
    K.slip('भरत', 340, 420, pop(lt, 0.1), -0.04, 64); K.slip('शत्रुघ्न', 740, 420, pop(lt, sh), 0.04, 64); K.slip('प्राणों से प्यारे', 540, 1180, pop(lt, pr + 0.2), -0.02, 54);
  } }); cue(st + sh, 'pop'); cue(st + pr, 'sparkle', { dur: 0.8 }); }

  // 17 · one twin with Rama, the other with Bharata!
  { const ju = w('जुड़वाँ', 17), ra = w('राम', 17), bh = w('भरत', 17); const st = shot(17, { cam: [540, 1050], zoom: 0.1, note: 'four boys in a row: Rama, Lakshmana | Shatrughna, Bharata; a dashed crimson line joins the twins in the middle; slip JUDWAAN', draw(lt, d, t) {
    palaceDay(20); ground(1480, '#C9AE7A');
    const ga = pop(lt, ra - 0.1, 0.35), gb = pop(lt, bh - 0.1, 0.35);
    person({ ...BOY_R, x: 140, y: 1580, h: 430, halo: 0.3 + 0.5 * ga, arm: 15 }); person({ ...BOY_L, x: 400, y: 1580, h: 400, halo: 0.3, arm: 15 });
    person({ ...BOY_S, x: 680, y: 1580, h: 400, dir: -1, halo: 0.3, arm: 15 }); person({ ...BOY_B, x: 940, y: 1580, h: 430, dir: -1, halo: 0.3 + 0.5 * gb, arm: 15 });
    link(400, 680, 980, eo(seg(lt, ju - 0.1, ju + 0.4))); K.slip('जुड़वाँ', 540, 820, pop(lt, ju), -0.03, 60);
    K.slip('राम के साथ', 270, 420, ga, -0.04, 52); K.slip('भरत के साथ', 810, 420, gb, 0.04, 52);
  } }); cue(st + ju, 'pop'); cue(st + ra, 'pop'); cue(st + bh, 'pop'); }

  // 18 · in the Ramcharitmanas this division is told a little differently
  { const rc = w('रामचरितमानस', 18), ba = w('बँटवारा', 18), al = w('अलग', 18); const st = shot(18, { cam: [540, 950], zoom: 0.12, note: 'a newer book labelled RAMCHARITMANAS; beside it the small kheer pie; slip ALAG', draw(lt, d, t) {
    K.parchment(21); glow(540, 900, 420, 0.4);
    book(330, 900, 1.1 * pop(lt, 0.05, 0.4)); K.ribbon('रामचरितमानस', 540, 330, pop(lt, rc, 0.45), 80);
    const b = pop(lt, ba - 0.1, 0.4); if (b > 0) { ctx.save(); ctx.translate(780, 900); ctx.scale(0.5 * b, 0.5 * b); platter(0, 0, R); wedge(0, 0, R, 90, 270, QCOL.k); wedge(0, 0, R, -90, 0, QCOL.s); wedge(0, 0, R, 0, 90, QCOL.y); ctx.restore(); }
    K.slip('थोड़ा अलग', 540, 1200, pop(lt, al), 0.03, 64);
  } }); cue(st + rc, 'pop', { gain: 0.6 }); cue(st + al, 'pop'); }

  // 19 · there Kausalya and Kaikeyi, with their own hands, give a share to Sumitra
  { const ko = w('कौसल्या', 19); const st = shot(19, { cam: [540, 1100], zoom: 0.1, note: 'Kausalya (left) and Kaikeyi (right) turn toward Sumitra in the middle; slips with names', draw(lt, d, t) {
    palaceDay(22); ground(1480, '#C9AE7A');
    person({ ...KAUS, x: 170, y: 1580, h: 500, arm: 70, hold: (x, y) => kheerBowl(x + 20, y, 0.6, QCOL.k) });
    person({ ...SUMI, x: 540, y: 1580, h: 480, halo: 0.3, arm: 15 });
    person({ ...KAIK, x: 910, y: 1580, h: 500, dir: -1, arm: 70, hold: (x, y) => kheerBowl(x + 20, y, 0.6, QCOL.y) });
    K.slip('कौसल्या', 190, 520, pop(lt, ko), -0.04, 56); K.slip('कैकेयी', 900, 520, pop(lt, ko + 0.5), 0.04, 56);
  } }); cue(st + ko, 'pop'); }
  { const st = subAt(19, 'हाथ'), ha = Wd('हाथ', 19 + OFF) - st, su = Wd('सुमित्रा', 19 + OFF) - st; sub('S19b', st, { cam: [540, 1000], zoom: 0.14, note: 'close: two hands from left and right pour a share of kheer into Sumitra\'s green-rimmed bowl in the middle; slip SUMITRA', draw(lt, d, t) {
    palaceDay(23);
    const m = eio(seg(lt, 0, su + 0.2));
    arm(lerp(-60, 160, m), 900, 100, KAUS.skin, 320); arm(lerp(1140, 920, m), 900, -100, KAIK.skin, 320);
    kheerBowl(lerp(130, 400, m), 940, 0.9, QCOL.k); kheerBowl(lerp(950, 680, m), 940, 0.9, QCOL.y);
    kheerBowl(540, 1200, 1.3 + 0.1 * pop(lt, su), QCOL.s); sparkles(540, 1150, 220, t, pop(lt, su));
    K.slip('अपने हाथ से', 540, 420, pop(lt, ha), -0.03, 60); K.slip('सुमित्रा को', 540, 640, pop(lt, su), 0.03, 60);
  } }); cue(st + ha, 'pop'); cue(st + su, 'sparkle', { dur: 0.8 }); }

  // 20 · did you know? tell us in the comments
  { const pa = w('पता', 20), ko = w('कमेंट', 20); const st = shot(20, { cam: [540, 950], zoom: 0.12, note: 'a big comment bubble, slip COMMENT', draw(lt, d, t) {
    K.parchment(29); bubble(540, 900, pop(lt, 0.05, 0.4), t);
    K.slip('?', 860, 560, pop(lt, pa, 0.3), 0.08, 120);
    K.slip('कमेंट करें', 540, 1250, pop(lt, ko), -0.02, 60);
  } }); cue(st + 0.05, 'pop'); cue(st + ko, 'sparkle', { dur: 0.8 }); }

  // 21 · lesson: a brother's company is the greatest strength
  { const si = w('सीख', 21), sa = w('साथ', 21), ta = w('ताक़त', 21); const st = shot(21, { cam: [540, 1050], zoom: 0.1, note: 'the four brothers as young princes stand together glowing; ribbon SEEKH; slip SAATH (loops to the hook)', draw(lt, d, t) {
    palaceDay(30); ground(1480, '#C9AE7A'); glow(540, 1150, 560, 0.3 + 0.3 * pop(lt, ta));
    person({ ...LAKSH, x: 160, y: 1580, h: 480, halo: 0.4, arm: 30 });
    person({ ...RAMA, x: 400, y: 1580, h: 520, halo: 1, arm: 15, holdBack: (x, y) => bow(x, y - 60, 0.5) });
    person({ ...BOY_B, x: 680, y: 1580, h: 510, dir: -1, halo: 0.5, arm: 15 });
    person({ ...BOY_S, x: 920, y: 1580, h: 480, dir: -1, halo: 0.4, arm: 30 });
    K.ribbon('सीख', 540, 300, pop(lt, si, 0.45), 96); K.slip('भाई का साथ', 540, 560, pop(lt, sa), 0.03, 62);
    sparkles(540, 1050, 380, t, pop(lt, ta));
  } }); cue(st + si, 'pop', { gain: 0.6 }); cue(st + ta, 'sparkle', { dur: 1.2 }); }

  return { shots: S, cues: CUES };
}
