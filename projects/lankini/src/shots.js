// LANKINI (Lanka, the city goddess): the shot list (Katha style, Hindi). Cut paper on parchment; no faces.
// Deities are drawn simply and respectfully. Kit from hanuman-surasa + new pieces below.
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


// ═════════════ BALA-ATIBALA ADDITIONS ═════════════
const VASI = { skin: '#E3B98F', robe: '#EFE6D0', trim: P.gold, head: 'sage', sash: P.crimson };
const DEVI_B = { skin: '#E3B98F', robe: '#E0B23C', trim: P.crimson, head: 'queen', sari: true };
const DEVI_A = { skin: '#E3B98F', robe: '#C9575A', trim: P.gold, head: 'queen', sari: true };
const WATER = ['#8FB3C4', '#7AA1B5', '#8FB3C4', '#6E95AA'];
/** the Sarayu: a river band from y0 to y1 with moving ripples; near bank below */
function river(t, y0 = 1120, y1 = 1420, dark = 0) {
  cut(P_rr(-300, y0, W + 600, y1 - y0 + 40, 0), WATER[1], { shadow: 0, edge: 0 });
  for (let i = 0; i < 3; i++) { const y = y0 + 40 + i * ((y1 - y0) / 3); ctx.strokeStyle = 'rgba(244,239,226,0.55)'; ctx.lineWidth = 6; ctx.lineCap = 'round'; for (let k = 0; k < 5; k++) { const x = ((k * 260 + t * (40 + i * 20) + i * 90) % 1400) - 160; ctx.beginPath(); ctx.moveTo(x, y); ctx.quadraticCurveTo(x + 40, y - 12, x + 80, y); ctx.stroke(); } }
  cut(() => { ctx.beginPath(); ctx.moveTo(-300, y0 + 10); for (let x = -300; x <= W + 300; x += 60) ctx.lineTo(x + 30, y0 - 20 - 10 * Math.sin(x)); ctx.lineTo(W + 300, y0 + 10); ctx.lineTo(W + 300, y0 - 80); ctx.lineTo(-300, y0 - 80); ctx.closePath(); }, '#8C9A5E', { shadow: 0.3, edge: 3 });
  cut(() => { ctx.beginPath(); ctx.moveTo(-300, H + 300); ctx.lineTo(-300, y1); ctx.quadraticCurveTo(300, y1 - 40, 700, y1 + 10); ctx.lineTo(W + 300, y1 + 30); ctx.lineTo(W + 300, H + 300); ctx.closePath(); }, '#C9B07E', { shadow: 0.5, edge: 5 });
  wash(C.dusk, dark);
}
function riverPage(seed, t, dark = 0, y0 = 1120, y1 = 1420) { skyPage(seed, '#E2D7AE'); cloud(240, 360, 0.7, 0.8); cloud(860, 280, 0.6, 0.8); forestTree(120, y0 - 30, 0.45); forestTree(950, y0 - 30, 0.5); forestTree(780, y0 - 40, 0.35); river(t, y0, y1, dark); }
/** a glowing mantra orb with a word inside */
function orb(text, x, y, s = 1, t = 0, col = '#F2C85A') { if (s <= 0) return; ctx.save(); ctx.translate(x, y + Math.sin(t * 3) * 10); ctx.scale(s, s); glow(0, 0, 230, 0.85); cut(P_circ(0, 0, 120), col, { shadow: 0.4, edge: 5 }); circle(0, 0, 96, 'rgba(255,246,218,0.55)'); ctx.font = `800 ${text.length > 4 ? 52 : 76}px NotoDeva`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = P.crimson; ctx.fillText(text, 0, 6); ctx.restore(); }
/** a beam of light from (x0,y0) to (x1,y1), grown by p */
function beam(x0, y0, x1, y1, p = 1, a = 0.7) { if (p <= 0.02 || a <= 0) return; ctx.save(); ctx.globalAlpha = clamp(a); const x = lerp(x0, x1, p), y = lerp(y0, y1, p); const g = ctx.createLinearGradient(x0, y0, x, y); g.addColorStop(0, 'rgba(242,200,90,0.95)'); g.addColorStop(1, 'rgba(255,246,218,0.6)'); ctx.strokeStyle = g; ctx.lineWidth = 40; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x, y); ctx.stroke(); ctx.restore(); }
/** a lying figure (asleep on the ground), head to the left */
function sleeper(o, x, y, h) { ctx.save(); ctx.translate(x + h * 0.55, y); ctx.rotate(-Math.PI / 2); person({ ...o, x: 0, y: 0, h, arm: 5, back: 5 }); ctx.restore(); }
/** a temple tower (gopuram) in cut paper */
function gopuram(x, y, s = 1, t = 0) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  for (let i = 0; i < 6; i++) { const w = 460 - i * 66, h = 110; cut(P_rr(-w / 2, -(i + 1) * h, w, h + 6, 6), i % 2 ? '#E2C47A' : '#D9B060', { shadow: 0.4, edge: 4 }); for (let k = -2; k <= 2; k++) circle(k * w / 6, -(i + 0.5) * h, 12, P.wine); }
  cut(P_poly([[-50, -660], [50, -660], [0, -760]]), P.gold, { shadow: 0.4, edge: 4 }); circle(0, -770, 18, P.gold);
  cut(() => { ctx.beginPath(); ctx.moveTo(-70, 0); ctx.lineTo(-70, -150); ctx.arc(0, -150, 70, Math.PI, TAU); ctx.lineTo(70, 0); ctx.closePath(); }, P.ink, { shadow: 0.3, edge: 3 });
  glow(0, -110, 120, 0.6 + 0.2 * Math.sin(t * 6));
  ctx.restore();
}
function fever(x, y, s = 1) { if (s <= 0) return; ctx.save(); ctx.translate(x, y); ctx.scale(s, s); cut(P_rr(-22, -150, 44, 220, 22), '#EFE6D0'); cut(P_circ(0, 90, 46), P.crimson, { shadow: 0.3, edge: 4 }); cut(P_rr(-10, -60, 20, 140, 10), P.crimson, { shadow: 0, edge: 0 }); ctx.restore(); }
function sweat(x, y, s = 1) { if (s <= 0) return; ctx.save(); ctx.translate(x, y); ctx.scale(s, s); for (const [dx, dy] of [[-60, 0], [10, -40], [70, 10]]) cut(() => { ctx.beginPath(); ctx.moveTo(dx, dy - 50); ctx.quadraticCurveTo(dx + 30, dy, dx, dy + 20); ctx.quadraticCurveTo(dx - 30, dy, dx, dy - 50); }, '#8FB3C4', { shadow: 0.3, edge: 3 }); ctx.restore(); }
function mirrorFrame(x, y, s = 1, inner = null) { if (s <= 0) return; ctx.save(); ctx.translate(x, y); ctx.scale(s, s); cut(() => { ctx.beginPath(); ctx.ellipse(0, 0, 200, 260, 0, 0, TAU); }, P.gold, { shadow: 0.5, edge: 5 }); cut(() => { ctx.beginPath(); ctx.ellipse(0, 0, 170, 230, 0, 0, TAU); }, '#DCE6E4', { shadow: 0, edge: 0 }); if (inner) { ctx.save(); ctx.beginPath(); ctx.ellipse(0, 0, 170, 230, 0, 0, TAU); ctx.clip(); inner(); ctx.restore(); } cut(P_rr(-20, 250, 40, 160, 10), P.gold); ctx.restore(); }
function bed(x, y, s = 1) { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); cut(P_rr(-300, -120, 600, 120, 16), P.wine); cut(P_rr(-300, -150, 600, 50, 20), '#E0B23C', { shadow: 0.3, edge: 3 }); cut(P_rr(-290, -200, 140, 60, 28), '#F4EFE2'); for (const k of [-1, 1]) cut(P_rr(k * 290 - 15, -320, 30, 320, 8), P.gold); cut(P_rr(-310, -330, 620, 26, 8), P.gold); ctx.restore(); }


// ═════════════ KAIKEYI-VARDAN ADDITIONS ═════════════
const MANTHARA = { skin: '#C99468', robe: '#6B5A4A', trim: P.sepia, head: 'bun', sari: true };
const BHARATA = { skin: '#5A7FA8', robe: P.royal, trim: P.gold, head: 'crown', sash: P.gold };
const ASURA_K = { skin: '#6E5A6A', robe: '#2A2230', trim: P.crimson, head: 'crown', sash: P.crimson };
/** Manthara: an old maid, bent forward (hunched), white bun */
function manthara(o) { ctx.save(); ctx.translate(o.x, o.y); ctx.rotate((o.dir || 1) * rad(14)); person({ ...MANTHARA, ...o, x: 0, y: 0 }); ctx.restore(); }
/** chariot facing right on (x, y): two horses ahead, one big wheel. riders() draws standing people (local coords, floor at y = -170) */
function ratha(x, y, s = 1, roll = 0, riders = null, t = 0, gallop = 0) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  const hb = (k) => -Math.abs(Math.sin(t * 10 * gallop + k)) * 22 * gallop;
  ctx.save(); ctx.translate(0, hb(1)); horse(560, 0, 0.85); ctx.restore();
  cut(P_rr(120, -230, 420, 22, 10), '#6B4E32', { shadow: 0.3, edge: 3 });
  ctx.save(); ctx.translate(0, hb(0)); horse(470, 20, 0.85); ctx.restore();
  ctx.strokeStyle = '#3E2C1E'; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(110, -330); ctx.quadraticCurveTo(400, -300, 690, -400); ctx.stroke();
  cut(P_rr(-30, -480, 10, 330, 4), P.ink, { shadow: 0.3, edge: 2 }); cut(P_poly([[-20, -480], [90, -450], [-20, -420]]), P.crimson, { shadow: 0.3, edge: 2 });
  if (riders) riders();
  cut(P_rr(-260, -190, 400, 40, 8), '#6B4E32', { shadow: 0.5, edge: 4 });
  cut(() => { ctx.beginPath(); ctx.moveTo(-250, -190); ctx.lineTo(-250, -330); ctx.quadraticCurveTo(-60, -300, 140, -380); ctx.lineTo(140, -190); ctx.closePath(); }, P.wine);
  ctx.strokeStyle = P.gold; ctx.lineWidth = 9; ctx.beginPath(); ctx.moveTo(-240, -300); ctx.quadraticCurveTo(-60, -270, 130, -345); ctx.stroke();
  for (let i = 0; i < 3; i++) circle(-170 + i * 120, -240, 14, P.gold);
  ctx.save(); ctx.translate(-70, -110); cut(P_circ(0, 0, 110), '#4A3828', { shadow: 0.5, edge: 4 }); circle(0, 0, 84, '#8A6A48');
  ctx.strokeStyle = '#4A3828'; ctx.lineWidth = 12; for (let i = 0; i < 8; i++) { const a = roll + i * Math.PI / 4; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(Math.cos(a) * 84, Math.sin(a) * 84); ctx.stroke(); } circle(0, 0, 24, P.gold); ctx.restore();
  ctx.restore();
}
/** a big chariot wheel seen side-on; pin 0..1 = the axle pin missing (dark hole); finger 0..1 slides a finger with a bangle into the hole */
function wheelClose(x, y, s = 1, roll = 0, finger = 0, hole = 1) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  cut(P_rr(-700, -40, 640, 80, 12), '#6B4E32', { shadow: 0.4, edge: 4 });
  cut(P_circ(0, 0, 330), '#4A3828'); circle(0, 0, 270, '#9C7A52');
  ctx.strokeStyle = '#4A3828'; ctx.lineWidth = 30; ctx.lineCap = 'butt'; for (let i = 0; i < 8; i++) { const a = roll + i * Math.PI / 4; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(Math.cos(a) * 275, Math.sin(a) * 275); ctx.stroke(); }
  cut(P_circ(0, 0, 90), P.gold, { shadow: 0.5, edge: 4 }); circle(0, 0, 34, hole > 0 ? '#2A1E14' : P.gold);
  if (finger > 0) { ctx.save(); ctx.translate(lerp(420, 30, eo(finger)), 0); cut(P_rr(0, -30, 520, 60, 30), '#E3B98F', { shadow: 0.5, edge: 4 }); cut(P_rr(150, -40, 34, 80, 10), P.gold, { shadow: 0.3, edge: 3 }); cut(P_rr(200, -40, 34, 80, 10), P.crimson, { shadow: 0.3, edge: 3 }); cut(P_rr(330, -80, 400, 160, 60), '#E3B98F', { shadow: 0.5, edge: 4 }); ctx.restore(); }
  ctx.restore();
}
/** a small carved casket; lid 0..1 opens; inner() draws what rises out */
function casket(x, y, s = 1, lid = 0, inner = null) {
  if (s <= 0) return; ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  if (lid > 0.02) { glow(0, -200, 300, 0.8 * lid); if (inner) inner(); }
  cut(P_rr(-200, -200, 400, 200, 14), '#7A5634'); for (const bx of [-120, 120]) cut(P_rr(bx - 16, -200, 32, 200, 4), P.gold, { shadow: 0.2, edge: 2 }); circle(0, -110, 22, P.gold);
  ctx.save(); ctx.translate(-200, -200); ctx.rotate(-lid * 1.6); cut(P_rr(0, -60, 410, 64, 20), '#8A6A48', { shadow: 0.5, edge: 4 }); ctx.restore();
  ctx.restore();
}
/** a vara (boon) orb with a number */
function vara(n, x, y, s, t) { orb(n === 1 ? 'वर १' : 'वर २', x, y, s, t + n, n === 1 ? '#F2C85A' : '#E8B43C'); }
/** ornaments scattered on the floor */
function ornaments(x, y, p = 1) { if (p <= 0) return; for (let i = 0; i < 9; i++) { const a = -Math.PI + rnd(i + 3) * Math.PI, r = eo(p) * (80 + rnd(i) * 260); const px = x + Math.cos(a) * r, py = y + 30 + rnd(i + 8) * 40; if (i % 3 === 0) { ctx.strokeStyle = P.gold; ctx.lineWidth = 9; ctx.beginPath(); ctx.ellipse(px, py, 34, 14, 0, 0, TAU); ctx.stroke(); } else circle(px, py, 12 + (i % 2) * 6, i % 2 ? P.gold : P.crimson); } }
function torches(t) { for (const x of [150, 930]) { cut(P_rr(x - 10, 900, 20, 300, 6), '#4A3828', { shadow: 0.3, edge: 2 }); flame(x, 905, 0.35, t + x); } }
function battlePage(seed, t, night = 0) { skyPage(seed, '#D9B98A'); ground(1450, '#B7976A'); if (night > 0) { wash('#1E2440', 0.75 * night); for (let i = 0; i < 20; i++) circle(rnd(i + seed) * W, rnd(i + 30) * 700, 3, `rgba(244,239,226,${0.6 * night})`); } }
function flyingArrows(t, a = 1, dir = 1, seed = 0) { if (a <= 0) return; ctx.save(); ctx.globalAlpha = clamp(a); for (let i = 0; i < 6; i++) { const k = (t * 0.9 + rnd(i + seed)) % 1, x = dir > 0 ? lerp(-200, 1300, k) : lerp(1300, -200, k); arrowShaft(x, 500 + rnd(i + 4 + seed) * 600 + k * 120, 0.9, dir > 0 ? 0.12 : Math.PI - 0.12); } ctx.restore(); }
/** a compass rose whose south point glows crimson (sc 0..1 pops it) */
function compassS(x, y, sc = 1, t = 0) { if (sc <= 0) return; ctx.save(); ctx.translate(x, y); ctx.scale(sc, sc); glow(0, 90, 160, 0.6 + 0.2 * Math.sin(t * 5), '168,50,45'); K.compass(0, 0, 1.3); cut(P_poly([[-26, 0], [0, 150], [26, 0]]), P.crimson, { shadow: 0.4, edge: 3 }); ctx.restore(); }

// ═════════════ RAVAN-NAAM ADDITIONS ═════════════
const NANDI = { skin: '#5A4636', robe: '#A88A62', trim: P.gold, head: 'jata', sash: '#6B4E32', muzzle: '#C9A27A' };
const VISHRAVA = { skin: '#C99468', robe: '#EFE6D0', trim: P.sepia, head: 'sage', sash: '#C8702F' };
const KUBERA = { skin: '#E0B070', robe: '#E0B23C', trim: P.crimson, head: 'crown', sash: P.crimson };
const PARVATI = { skin: '#E3B98F', robe: P.crimson, trim: P.gold, head: 'queen', sari: true };
const MINISTER = (i) => ({ skin: ['#A88E78', '#8E7A6A', '#9A8070'][i % 3], robe: [P.ink, P.wine, '#3E3550'][i % 3], trim: P.gold, head: 'pagri', pagri: [P.crimson, '#6B4E32', P.gold][i % 3] });
/** Kailash: a tall grey peak with a snow cap and a flat summit. Returns the summit y */
function kailash(x, y, s = 1, g = 0, t = 0) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  if (g > 0) glow(0, -820, 420, g * (0.8 + 0.2 * Math.sin(t * 3)));
  cut(P_poly([[-560, 0], [-140, -760], [-90, -800], [90, -800], [140, -760], [560, 0]]), '#B9B4AC');
  cut(P_poly([[90, -800], [140, -760], [560, 0], [120, 0]]), '#A29D95', { shadow: 0, edge: 0 });
  cut(P_poly([[-230, -580], [-140, -760], [-90, -800], [90, -800], [140, -760], [230, -580], [150, -620], [80, -570], [0, -630], [-80, -570], [-150, -620]]), '#F4EFE2', { shadow: 0.3, edge: 3 });
  ctx.restore(); return y - 800 * s;
}
/** Shiva and Parvati standing on a summit at (x, y); hold 0..1 = Parvati clings to Shiva */
function shivParvati(x, y, h, hold = 0, halo = 0.8) {
  person({ ...PARVATI, x: x - lerp(140, 70, hold) * h / 400, y, h: h * 0.88, arm: lerp(20, 95, hold), halo: halo * 0.6 });
  person({ ...SHIVA, x: x + 50 * h / 400, y, h, dir: -1, arm: 20, halo, hold: (hx, hy) => trishul(hx, hy + 120 * h / 640, 560 * h / 640) });
}
/** the Pushpaka vimana: a small golden palace on a platform riding a cloud; rider() draws standing figures (floor y = -40) */
function pushpaka(x, y, s = 1, t = 0, rider = null, g = 0.5) {
  ctx.save(); ctx.translate(x, y + Math.sin(t * 2.2) * 10); ctx.scale(s, s);
  glow(0, -120, 420, g);
  palace(0, -40, 0.42, 1);
  if (rider) rider();
  cut(P_rr(-280, -60, 560, 60, 14), P.gold, { shadow: 0.5, edge: 4 }); for (let i = 0; i < 6; i++) circle(-225 + i * 90, -30, 12, P.crimson);
  cloud(-120, 60, 0.9); cloud(130, 70, 0.8);
  ctx.restore();
}
/** Dashagriva in the vimana */
const riderR = (h = 300, o = {}) => () => ravana(0, -40, h, { arm: 40, ...o });
/** Shiva's foot from above, its big toe pressing down to the right; press 0..1 lowers it */
function shivFoot(x, y, s = 1, press = 0) {
  ctx.save(); ctx.translate(x, y + lerp(-260, 0, eio(press))); ctx.scale(s, s);
  const sk = SHIVA.skin;
  cut(() => { ctx.beginPath(); ctx.moveTo(-150, -900); ctx.lineTo(40, -900); ctx.lineTo(60, -180); ctx.quadraticCurveTo(180, -110, 300, -70); ctx.quadraticCurveTo(360, -40, 330, 0); ctx.lineTo(-160, 0); ctx.quadraticCurveTo(-220, -60, -150, -200); ctx.closePath(); }, sk);
  for (let i = 0; i < 4; i++) cut(P_circ(250 - i * 62, -14, 34 - i * 4), sk, { shadow: 0.3, edge: 3 });
  cut(P_circ(310, -26, 46), sk, { shadow: 0.4, edge: 4 });
  cut(P_rr(-160, -330, 230, 40, 14), P.gold, { shadow: 0.3, edge: 3 }); for (let i = 0; i < 5; i++) circle(-130 + i * 45, -290, 10, P.crimson);
  ctx.restore();
}
/** Ravana pinned: arms raised under a mountain whose base is at the hands */
function pinned(x, y, h, t = 0, strain = 0) { ravana(x, y + Math.sin(t * 30) * 4 * strain, h, { arm: 172, back: 168 }); }
/** the sword Chandrahasa: a curved, moon-bright blade with a crescent on the hilt */
function chandrahas(x, y, s = 1, rot = 0, t = 0) {
  if (s <= 0) return; ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
  glow(0, -170, 300, 0.8 + 0.2 * Math.sin(t * 5), '230,236,240');
  cut(() => { ctx.beginPath(); ctx.moveTo(-16, -60); ctx.quadraticCurveTo(-30, -250, 40, -400); ctx.quadraticCurveTo(10, -240, 18, -60); ctx.closePath(); }, '#DCE3E6', { shadow: 0.4, edge: 3 });
  cut(P_rr(-60, -70, 120, 24, 8), P.gold, { shadow: 0.3, edge: 2 }); cut(P_rr(-12, -46, 24, 90, 8), P.sepia, { shadow: 0.3, edge: 2 });
  cut(() => { ctx.beginPath(); ctx.arc(0, 70, 38, 0.3 * Math.PI, 1.7 * Math.PI, true); ctx.arc(-14, 70, 30, 1.6 * Math.PI, 0.4 * Math.PI); ctx.closePath(); }, '#F4EFE2', { shadow: 0.3, edge: 3 });
  ctx.restore();
}
/** a baby with ten little heads (Dashagriva at birth) */
function tenHeadBaby(x, y, s = 1, p = 1, t = 0) {
  if (s <= 0) return; ctx.save(); ctx.translate(x, y); ctx.scale(s, s); glow(0, -20, 260, 0.6);
  cut(() => { ctx.beginPath(); ctx.ellipse(-30, 30, 120, 66, 0, 0, TAU); }, C.white, { shadow: 0.4, edge: 3 });
  cut(P_rr(-90, -20, 18, 100, 6), P.gold, { shadow: 0, edge: 0 });
  const n = Math.round(10 * clamp(p));
  for (let i = 0; i < n; i++) { const a = -Math.PI * 0.9 + i * (Math.PI * 0.8 / 9); cut(P_circ(110 + Math.cos(a) * 95, -10 + Math.sin(a) * 95 + 60, 30), '#9A8070', { shadow: 0.3, edge: 3 }); }
  ctx.restore();
}
function laugh(x, y, s, t) { if (s <= 0) return; ctx.save(); ctx.translate(x, y); ctx.rotate(Math.sin(t * 14) * 0.06); bigText('हा हा हा!', 0, 0, 92, P.crimson, s); ctx.restore(); }
function lankaNight(seed, t) { nightPage(seed, t); moon(860, 300, 64); palace(540, 1350, 0.95, 1); wash('#1E2440', 0.25); ground(1350, '#3E3550'); }
function himalaya(seed, dark = 0) { skyPage(seed, '#DCE3E0'); cloud(220, 300, 0.7, 0.8); cloud(880, 420, 0.6, 0.8); mountain(80, 1500, 0.9, '#C9C4BC', '#AEA9A0'); mountain(1000, 1500, 1.0, '#C9C4BC', '#AEA9A0'); wash(C.dusk, dark); }

// ═════════════ KUMBHAKARNA ADDITIONS ═════════════
const KUMBHA = { skin: '#7A6656', robe: '#3E3550', trim: P.gold, head: 'crown', sash: P.crimson };
const VIBHI = { skin: '#A88E78', robe: '#EFE6D0', trim: P.gold, head: 'crown', sash: '#2E7D6B' };
const SARAS = { skin: '#E3B98F', robe: '#F4EFE2', trim: P.gold, head: 'queen', sari: true };
const DEVAS = (i) => ({ skin: [P.skin, '#D6A57A', '#E0B070'][i % 3], robe: [P.royal, P.green, P.wine][i % 3], trim: P.gold, head: 'crown', sash: P.gold });
/** the giant Kumbhakarna standing (a broad, tall rakshasa with a crown) */
function kumbha(x, y, h, o = {}) { person({ ...KUMBHA, x, y, h, ...o }); }
/** Kumbhakarna asleep on the ground, chest rising and falling, Z's floating up */
function sleeping(x, y, h, t, z = 1) { ctx.save(); ctx.translate(0, Math.sin(t * 2.4) * 6); sleeper(KUMBHA, x, y, h); ctx.restore(); zzz(x - h * 0.45, y - h * 0.3, h / 640, t, z); }
function zzz(x, y, s, t, a = 1) { if (a <= 0) return; for (let i = 0; i < 3; i++) { const k = (t * 0.5 + i / 3) % 1; ctx.save(); ctx.globalAlpha = clamp(a) * (k < 0.15 ? k / 0.15 : 1 - (k - 0.15) / 0.85); bigText('Z', x + (40 + k * 140) * s, y - (60 + k * 260) * s, (60 + k * 50) * s, P.royal, 1); ctx.restore(); } }
/** a veena: long neck, two gourds */
function veena(hx, hy, s = 1) { ctx.save(); ctx.translate(hx, hy); ctx.rotate(-0.6); ctx.scale(s, s); cut(P_rr(-14, -260, 28, 420, 12), '#8A5A32', { shadow: 0.4, edge: 3 }); cut(P_circ(0, 170, 70), '#B07A3A', { shadow: 0.4, edge: 3 }); cut(P_circ(0, -250, 44), '#B07A3A', { shadow: 0.4, edge: 3 }); ctx.strokeStyle = P.gold; ctx.lineWidth = 3; for (const k of [-6, 6]) { ctx.beginPath(); ctx.moveTo(k, -220); ctx.lineTo(k, 150); ctx.stroke(); } ctx.restore(); }
function saraswati(x, y, h, o = {}) { person({ ...SARAS, x, y, h, halo: 1, arm: 60, hold: (hx, hy) => veena(hx, hy, h / 640), ...o }); }
/** a big crowned head seen from the side (no face); returns the mouth point */
function bigHead(x, y, s = 1, glowA = 0, t = 0) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  if (glowA > 0) glow(0, 0, 420, glowA * (0.8 + 0.2 * Math.sin(t * 6)));
  cut(P_rr(-120, 150, 240, 400, 40), KUMBHA.skin); cut(P_poly([[-260, 380], [260, 380], [300, 700], [-300, 700]]), KUMBHA.robe);
  cut(P_circ(0, 0, 240), KUMBHA.skin); cut(P_circ(-150, -10, 60), '#6A5646', { shadow: 0.3, edge: 3 });
  cut(() => { ctx.beginPath(); ctx.ellipse(150, 90, 120, 90, 0.2, 0, TAU); }, '#8A7666', { shadow: 0.3, edge: 3 });
  cut(P_poly([[-210, -150], [-230, -330], [-110, -260], [0, -390], [110, -260], [230, -330], [210, -150]]), P.gold, { shadow: 0.5, edge: 4 }); circle(0, -250, 24, P.crimson);
  ctx.restore(); return [x + 230 * s, y + 110 * s];
}
/** Saraswati's light: a small glowing orb with a veena mark */
function vaniLight(x, y, s, t) { if (s <= 0) return; ctx.save(); ctx.translate(x, y); ctx.scale(s, s); glow(0, 0, 200, 0.9); cut(P_circ(0, 0, 60), '#FFF6DA', { shadow: 0.3, edge: 3 }); veena(0, 0, 0.22); sparkles(0, 0, 120, t, 0.8); ctx.restore(); }
function snow(t, a = 1) { if (a <= 0) return; ctx.save(); ctx.globalAlpha = clamp(a); for (let i = 0; i < 30; i++) { const x = rnd(i + 3) * W, y = ((rnd(i + 11) * 1400 + t * (90 + rnd(i) * 60)) % 1400) - 50; circle(x + Math.sin(t + i) * 20, y, 7 + rnd(i + 5) * 5, '#F4EFE2'); } ctx.restore(); }
function heaven(seed) { skyPage(seed, '#E9DDB8'); heavenClouds(0); }
const brother = { r: (x, y, h, o = {}) => ravana(x, y, h, o), k: (x, y, h, o = {}) => kumbha(x, y, h, o), v: (x, y, h, o = {}) => person({ ...VIBHI, x, y, h, ...o }) };

// ═════════════ HANUMAN-SURASA ADDITIONS ═════════════
const SURASA = { skin: '#A9BC92', robe: '#2E7D6B', trim: P.gold, head: 'queen', sari: true };
const SAGARA = { skin: '#5E8FA8', robe: '#2F5F78', trim: P.gold, head: 'crown', sash: '#9DB4B0' };
const NAGA = '#5E7A3C', NAGA2 = '#6F8A4A', DUSK = '#2F3550';
/** sky over the open sea */
function seaSky(seed, t, y0 = 1250, sky = '#E7D7AE') { skyPage(seed, sky); cloud(220 + Math.sin(t * 0.4) * 20, 420, 0.8, 0.9); cloud(860 - Math.sin(t * 0.3) * 20, 290, 0.7, 0.9); sea(t, y0); }
/** Hanuman in flight: the crowned vanara turned along the flight, both arms forward. (x, y) = body centre */
function flyer(x, y, h, t, o = {}) {
  const d = o.dir || 1; if (o.wind !== 0) windLines(x - d * h * 0.8, y + 10, t, o.wind ?? 0.8);
  ctx.save(); ctx.translate(x, y + (o.still ? 0 : Math.sin(t * 3) * 8)); ctx.scale(d, 1); ctx.rotate(rad(o.tilt ?? 72));
  if (o.glowA) glow(0, 0, h * 0.9, o.glowA);
  vanara({ ...HANU, x: 0, y: h * 0.5, h, arm: o.arm ?? 178, back: o.back ?? 172, halo: o.halo ?? 0.6, t, hold: o.hold });
  ctx.restore();
}
/** Hanuman's shadow on the water */
function waterShadow(x, y, w, a = 1) { if (a <= 0) return; ctx.save(); ctx.globalAlpha = clamp(a); ctx.fillStyle = 'rgba(30,36,64,0.55)'; ctx.beginPath(); ctx.ellipse(x, y, w, w * 0.16, 0, 0, TAU); ctx.fill(); ctx.beginPath(); ctx.ellipse(x + w * 0.85, y, w * 0.2, w * 0.1, 0, 0, TAU); ctx.fill(); ctx.restore(); }
function wing(flap = 0) { ctx.save(); ctx.rotate(-0.25 - flap * 0.35); cut(() => { ctx.beginPath(); ctx.moveTo(0, 0); ctx.quadraticCurveTo(200, -260, 420, -230); ctx.lineTo(340, -160); ctx.lineTo(400, -110); ctx.lineTo(300, -70); ctx.lineTo(340, -20); ctx.quadraticCurveTo(160, 40, 0, 60); ctx.closePath(); }, '#F4EFE2', { shadow: 0.4, edge: 4 }); ctx.strokeStyle = '#B8B0A2'; ctx.lineWidth = 5; for (let i = 0; i < 3; i++) { ctx.beginPath(); ctx.moveTo(40, 20); ctx.lineTo(300 - i * 20, -170 + i * 60); ctx.stroke(); } ctx.restore(); }
/** a mountain with wings (the mountains of old flew) */
function wingedMount(x, y, s, t, o = {}) { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); const f = Math.sin(t * 6 + x) * 0.5 + 0.5; for (const k of [-1, 1]) { if (o.lost === k) continue; ctx.save(); ctx.translate(k * 120, -380); ctx.scale(k, 1); wing(f); ctx.restore(); } mountain(0, 0, 1, o.col || P.stone, o.col2 || P.stoneDark); ctx.restore(); }
/** Mainaka: the golden mountain; g = glow 0..1, wings 0/1 */
function mainaka(x, y, s = 1, t = 0, g = 1, wings = 0) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  if (g > 0) glow(0, -380, 640, 0.6 * g);
  if (wings) for (const k of [-1, 1]) { ctx.save(); ctx.translate(k * 120, -380); ctx.scale(k, 1); wing(Math.sin(t * 5) * 0.5 + 0.5); ctx.restore(); }
  mountain(0, 0, 1, '#E0B23C', '#C8952F');
  for (let i = 0; i < 6; i++) circle(-160 + rnd(i + 2) * 320, -80 - rnd(i + 7) * 480, 12, '#F7E3A0');
  ctx.restore(); if (g > 0) sparkles(x, y - 400 * s, 320 * s, t, g);
}
/** a wing falling away, fluttering */
function fallingWing(x, y, s, p, t) { if (p <= 0 || p >= 1) return; ctx.save(); ctx.globalAlpha = 1 - p * 0.6; ctx.translate(x + p * 160, y + eo(p) * 520); ctx.rotate(p * 2 + Math.sin(t * 8) * 0.2); ctx.scale(s, s); wing(0); ctx.restore(); }
/** the Sea god rising from the waves to the waist */
function sagara(x, y, h, o = {}) { person({ ...SAGARA, x, y, h, halo: 0.6, ...o }); }
/** the great naga's head, facing left; open 0..1 parts the jaws. (x, y) = the hinge */
function nagaHead(x, y, s, open = 0, t = 0) {
  if (s <= 0) return; ctx.save(); ctx.translate(x, y); ctx.scale(-s, s);
  const a = open * 0.62;
  cut(() => { ctx.beginPath(); ctx.ellipse(-60, -40, 180, 150, 0, 0, TAU); }, NAGA, { shadow: 0.5, edge: 5 });
  cut(P_poly([[0, 0], [270 * Math.cos(-a) + 20, 270 * Math.sin(-a) - 10], [270 * Math.cos(a) + 20, 270 * Math.sin(a) + 10]]), '#5A1E24', { shadow: 0, edge: 3 });
  for (const k of [-1, 1]) { ctx.save(); ctx.rotate(k * a); const jaw = k < 0 ? () => { ctx.beginPath(); ctx.moveTo(-40, -90); ctx.quadraticCurveTo(200, -100, 290, -20); ctx.lineTo(290, 4); ctx.lineTo(-40, 10); ctx.closePath(); } : () => { ctx.beginPath(); ctx.moveTo(-40, -4); ctx.lineTo(280, -4); ctx.quadraticCurveTo(260, 50, 120, 70); ctx.lineTo(-40, 70); ctx.closePath(); };
    cut(jaw, k < 0 ? NAGA2 : '#8C9A5E', { shadow: 0.4, edge: 4 });
    if (open > 0.15) for (const fx of [230, 160]) cut(P_poly(k < 0 ? [[fx - 14, 2], [fx, 46], [fx + 14, 2]] : [[fx - 12, -2], [fx - 2, -36], [fx + 10, -2]]), '#F4EFE2', { shadow: 0.2, edge: 2 });
    ctx.restore(); }
  ctx.save(); ctx.rotate(-a); cut(P_poly([[-140, -110], [-150, -200], [-110, -170], [-80, -240], [-50, -170], [-10, -200], [-20, -110]]), P.gold, { shadow: 0.4, edge: 4 }); circle(-80, -160, 12, P.crimson); ctx.restore();
  ctx.restore();
}
/** Surasa as the great naga rising from the sea: body curve + head at (hx, hy) */
function nagaSerpent(hx, hy, s, open, t) {
  const sw = Math.sin(t * 2) * 30 * s;
  snake([[hx + 520 * s, 1900], [hx + 480 * s + sw, hy + 820 * s], [hx + 300 * s - sw, hy + 520 * s], [hx + 260 * s, hy + 230 * s], [hx + 150 * s, hy + 40 * s]], 130 * s, false, NAGA2);
  nagaHead(hx, hy, s, open, t);
}
/** Surasa's own form: a crowned mother with a five-hooded naga canopy */
function nagaMata(x, y, h, o = {}) {
  const s = h / 640; ctx.save(); ctx.translate(x, y - 560 * s); ctx.scale(s, s);
  cut(() => { ctx.beginPath(); ctx.ellipse(0, 0, 200, 170, 0, Math.PI, TAU); ctx.lineTo(200, 80); ctx.lineTo(-200, 80); ctx.closePath(); }, NAGA, { shadow: 0.4, edge: 4 });
  for (let i = 0; i < 5; i++) { const an = Math.PI + (i + 0.5) * Math.PI / 5; cut(P_circ(Math.cos(an) * 200, Math.sin(an) * 170, 46), NAGA2, { shadow: 0.3, edge: 3 }); }
  ctx.restore(); person({ ...SURASA, x, y, h, ...o });
}
/** Simhika rising from the dark water: a big dark rakshasi, horns, crimson eyes; reach 0..1 extends a long arm toward (rx, ry) */
function simhika(x, y, h, t, a = 1, reach = 0, rx = 0, ry = 0) {
  if (a <= 0) return; ctx.save(); ctx.globalAlpha = clamp(a);
  if (reach > 0) { const ex = lerp(x, rx, reach), ey = lerp(y - h * 0.55, ry, reach); ctx.lineCap = 'round'; ctx.strokeStyle = '#2A2230'; ctx.lineWidth = 46 * h / 640; ctx.beginPath(); ctx.moveTo(x, y - h * 0.62); ctx.quadraticCurveTo((x + ex) / 2, Math.min(y - h * 0.9, ey) - 60, ex, ey); ctx.stroke(); for (let i = -2; i <= 2; i++) { ctx.lineWidth = 16 * h / 640; ctx.beginPath(); ctx.moveTo(ex, ey); ctx.lineTo(ex + i * 22, ey + 50); ctx.stroke(); } }
  rakshasaShadow(x, y, h, 1); ctx.restore();
}
/** the island of Lanka on the horizon: hill + golden palace */
function lankaIsle(x, y, s = 1) { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); cut(() => { ctx.beginPath(); ctx.moveTo(-420, 40); ctx.quadraticCurveTo(-200, -260, 0, -300); ctx.quadraticCurveTo(220, -260, 420, 40); ctx.closePath(); }, '#8C9A5E', { shadow: 0.5, edge: 4 }); palace(0, -250, 0.42, 1); ctx.restore(); }
/** a dashed crimson arc from (x0,y0) to (x1,y1) drawn to p */
function arc(x0, y0, x1, y1, lift, p = 1, col = P.crimson) { if (p <= 0.01) return; ctx.save(); ctx.setLineDash([26, 18]); ctx.strokeStyle = col; ctx.lineWidth = 10; ctx.lineCap = 'round'; ctx.beginPath(); const n = 40; for (let i = 0; i <= n * clamp(p); i++) { const k = i / n; const x = lerp(x0, x1, k), y = lerp(y0, y1, k) - Math.sin(k * Math.PI) * lift; i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); } ctx.stroke(); ctx.restore(); }
function arcPt(x0, y0, x1, y1, lift, k) { return [lerp(x0, x1, k), lerp(y0, y1, k) - Math.sin(k * Math.PI) * lift]; }
/** a tiny glowing Hanuman (thumb-sized) */
function tinyHanu(x, y, s, t) { if (s <= 0) return; glow(x, y, 120 * s, 0.9); flyer(x, y, 160 * s, t, { wind: 0, halo: 0.9 }); }
function underwater(seed, t) { K.parchment(seed); wash('#2F5F78', 0.75); for (let i = 0; i < 18; i++) { const x = rnd(i + seed) * W, y = (1400 - ((t * 90 + rnd(i + 4) * 1400) % 1400)); circle(x + Math.sin(t * 2 + i) * 14, y, 8 + rnd(i) * 10, 'rgba(244,239,226,0.45)'); } ctx.strokeStyle = 'rgba(244,239,226,0.25)'; ctx.lineWidth = 8; for (let k = 0; k < 4; k++) { ctx.beginPath(); for (let x = -100; x <= W + 100; x += 30) ctx.lineTo(x, 150 + k * 40 + Math.sin(x * 0.01 + t * 2 + k) * 10); ctx.stroke(); } }
function splash(x, y, p, s = 1) { if (p <= 0 || p >= 1) return; for (let i = 0; i < 12; i++) { const an = Math.PI + (i + 0.5) / 12 * Math.PI, r = eo(p) * 260 * s; ctx.save(); ctx.globalAlpha = 1 - p; cut(P_circ(x + Math.cos(an) * r, y + Math.sin(an) * r * 0.9 + p * p * 200, (26 - p * 12) * s), '#E7EEF0', { shadow: 0, edge: 3 }); ctx.restore(); } }
function duskSea(seed, t, dark = 0.55) { skyPage(seed, '#C9A98A'); wash(DUSK, dark); sea(t, 1250); wash(DUSK, dark * 0.5); }
function counter(n, x, y, sc = 1, col = P.crimson) { bigText(`${n} योजन`, x, y, 96, col, sc); }
const HI = (n) => String(n).replace(/\d/g, (c) => '०१२३४५६७८९'[c]);
function snake(pts, w = 44, head = true, col = '#6F8A4A') {
  ctx.save(); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  const path = () => { ctx.beginPath(); pts.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); };
  ctx.shadowColor = 'rgba(70,45,20,0.35)'; ctx.shadowBlur = 12; ctx.shadowOffsetY = 8; path(); ctx.strokeStyle = col; ctx.lineWidth = w; ctx.stroke(); ctx.shadowColor = 'transparent';
  path(); ctx.strokeStyle = P.edge; ctx.lineWidth = w + 8; ctx.globalCompositeOperation = 'destination-over'; ctx.stroke(); ctx.globalCompositeOperation = 'source-over';
  path(); ctx.setLineDash([10, 26]); ctx.strokeStyle = '#4F6D33'; ctx.lineWidth = w * 0.35; ctx.stroke(); ctx.setLineDash([]);
  ctx.restore();
  if (head) { const [a, b] = [pts[pts.length - 2], pts[pts.length - 1]], ang = Math.atan2(b[1] - a[1], b[0] - a[0]); ctx.save(); ctx.translate(b[0], b[1]); ctx.rotate(ang); cut(() => { ctx.beginPath(); ctx.ellipse(20, 0, 60, 46, 0, 0, TAU); }, col, { shadow: 0.5, edge: 4 }); circle(40, -18, 7, P.ink); circle(40, 18, 7, P.ink); ctx.restore(); }
}


// ═════════════ LANKINI ADDITIONS ═════════════
const LDEVI = { skin: '#6E5A6A', robe: '#7A2E3A', trim: P.gold, head: 'none', sari: true };
const GUARD = { skin: '#7A6656', robe: '#3E3550', trim: P.gold, head: 'none', sash: P.crimson };
const TULSI = { skin: '#D6A57A', robe: '#EFE6D0', trim: P.sepia, head: 'sage', sash: '#C8702F' };
const VALMIKI = { skin: '#C99468', robe: '#C8702F', trim: P.gold, head: 'sage', sash: P.wine };
const GOLD2 = '#D9B060';
/** the city goddess Lanka: a tall rakshasi in a wine sari with a golden crown of city towers; fierce = crimson eyes */
function lankaDevi(x, y, h, o = {}) {
  const s = h / 640, d = o.dir || 1;
  if (o.aura) glow(x, y - 560 * s, 300 * s, o.aura, '200,60,60');
  person({ ...LDEVI, x, y, h, ...o });
  ctx.save(); ctx.translate(x, y + (o.bob || 0)); ctx.scale(s * d, s);
  cut(P_circ(-40, -592, 40), '#2A2230', { shadow: 0.3, edge: 3 });
  for (const [tx, th] of [[-48, 70], [0, 100], [48, 70]]) { cut(P_rr(tx - 20, -585 - th, 40, th + 10, 3), P.gold, { shadow: 0.4, edge: 3 }); cut(P_poly([[tx - 24, -585 - th], [tx, -585 - th - 34], [tx + 24, -585 - th]]), GOLD2, { shadow: 0.3, edge: 3 }); }
  cut(P_rr(-62, -598, 124, 22, 6), P.gold, { shadow: 0.3, edge: 3 });
  if (o.fierce !== false) { circle(-24, -540, 9, P.crimson); circle(24, -540, 9, P.crimson); }
  ctx.restore();
}
/** a small cat sitting, facing right (for scale) */
function cat(x, y, s = 1, col = '#8A7A6A') { if (s <= 0) return; ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  ctx.strokeStyle = col; ctx.lineWidth = 18; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(-60, -10); ctx.quadraticCurveTo(-140, -20, -120, -110); ctx.stroke();
  cut(() => { ctx.beginPath(); ctx.ellipse(0, -70, 70, 80, 0, 0, TAU); }, col, { shadow: 0.4, edge: 3 });
  cut(P_circ(30, -170, 52), col, { shadow: 0.4, edge: 3 });
  for (const k of [-1, 1]) cut(P_poly([[30 + k * 12, -210], [30 + k * 40, -250], [30 + k * 46, -190]]), col, { shadow: 0.2, edge: 3 });
  circle(50, -175, 7, '#F2C14E'); ctx.restore(); }
/** the golden city wall across the page, top at y, with battlements */
function goldWall(y, t = 0, glowA = 0) {
  if (glowA > 0) glow(540, y + 100, 700, glowA * (0.8 + 0.2 * Math.sin(t * 3)));
  cut(P_rr(-300, y, W + 600, 900, 0), P.gold, { shadow: 0.6, edge: 5 });
  for (let x = -300; x <= W + 300; x += 120) cut(P_rr(x, y - 60, 70, 70, 4), P.gold, { shadow: 0.3, edge: 3 });
  ctx.strokeStyle = 'rgba(168,122,34,0.6)'; ctx.lineWidth = 5; for (let r = 0; r < 6; r++) { const yy = y + 70 + r * 70; ctx.beginPath(); ctx.moveTo(-300, yy); ctx.lineTo(W + 300, yy); ctx.stroke(); }
}
/** a gate in the wall: arch at (x, y = ground), doors open 0..1 with light behind */
function lankaGate(x, y, s = 1, open = 0, t = 0) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  cut(P_rr(-260, -620, 520, 620, 8), GOLD2, { shadow: 0.6, edge: 5 });
  for (const k of [-1, 1]) { cut(P_rr(k * 230 - 60, -760, 120, 760, 6), P.gold, { shadow: 0.5, edge: 4 }); cut(() => { ctx.beginPath(); ctx.arc(k * 230, -760, 60, Math.PI, TAU); ctx.closePath(); }, '#C8952F', { shadow: 0.3, edge: 3 }); cut(P_poly([[k * 230 + 4, -830], [k * 230 + 74, -810], [k * 230 + 4, -790]]), P.crimson, { shadow: 0.2, edge: 2 }); line([[k * 230, -820], [k * 230, -880]], P.ink, 5); }
  const arch = () => { ctx.beginPath(); ctx.moveTo(-150, 0); ctx.lineTo(-150, -380); ctx.arc(0, -380, 150, Math.PI, TAU); ctx.lineTo(150, 0); ctx.closePath(); };
  cut(arch, '#2A2230', { shadow: 0, edge: 4 });
  if (open > 0) { ctx.save(); arch(); ctx.clip(); glow(0, -250, 420, open, '255,220,140'); ctx.restore(); }
  for (const k of [-1, 1]) { ctx.save(); ctx.translate(k * 150, 0); ctx.scale(1 - 0.85 * clamp(open), 1); cut(() => { ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, -380); if (k < 0) { ctx.arc(150, -380, 150, Math.PI, Math.PI * 1.5); ctx.lineTo(150, 0); } else { ctx.arc(-150, -380, 150, TAU, Math.PI * 1.5, true); ctx.lineTo(-150, 0); } ctx.closePath(); }, '#8A5A32', { shadow: 0.3, edge: 3 }); for (let i = 0; i < 3; i++) for (let j = 0; j < 2; j++) circle(-k * (45 + j * 60), -90 - i * 110, 9, P.gold); ctx.restore(); }
  ctx.restore();
}
/** Lanka at night: stars, moon, the palace roofs behind the golden wall and its gate */
function nightCity(seed, t, o = {}) {
  nightPage(seed, t); moon(o.mx ?? 880, o.my ?? 260, 60);
  palace(540, o.wy ?? 1000, 0.95, 1); palace(120, (o.wy ?? 1000) + 40, 0.5, 1); palace(960, (o.wy ?? 1000) + 30, 0.55, 1);
  wash('#1E2440', 0.2); goldWall(o.wy ?? 1000, t, o.wallGlow ?? 0.25);
  if (o.gate !== false) lankaGate(o.gx ?? 540, o.gy ?? 1500, o.gs ?? 0.8, o.open || 0, t);
  ground(o.gy ?? 1500, '#3E3550');
}
/** the three-peaked Trikuta with Lanka on top */
function trikuta(x, y, s = 1, t = 0, g = 0.5) { ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  mountain(-300, 0, 0.9, '#6E6A7A', '#57536A'); mountain(300, 0, 0.9, '#6E6A7A', '#57536A'); mountain(0, 60, 1.25, '#7A7688', '#615D74');
  glow(0, -840, 520, g * (0.8 + 0.2 * Math.sin(t * 3))); palace(0, -760, 0.55, 1); palace(-260, -560, 0.32, 1); palace(260, -560, 0.32, 1);
  ctx.restore(); }
/** a crimson-gold impact burst; p 0..1 */
function impact(x, y, p, s = 1) { if (p <= 0 || p >= 1) return; ctx.save(); ctx.translate(x, y); ctx.scale(s * (0.6 + 0.6 * eo(p)), s * (0.6 + 0.6 * eo(p))); ctx.globalAlpha = 1 - p * p; const pts = []; for (let i = 0; i < 20; i++) { const r = i % 2 ? 70 : 170; const a = i / 20 * TAU; pts.push([Math.cos(a) * r, Math.sin(a) * r]); } cut(P_poly(pts), P.crimson, { shadow: 0.3, edge: 4 }); const pts2 = pts.map(([a, b]) => [a * 0.55, b * 0.55]); cut(P_poly(pts2), '#F2C14E', { shadow: 0, edge: 2 }); ctx.restore(); }
/** a big open palm (seen from the side), swinging; rot in radians */
function palm(x, y, s = 1, rot = 0, col = LDEVI.skin) { ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s); cut(P_rr(-40, 0, 80, 420, 36), col, { shadow: 0.5, edge: 4 }); cut(() => { ctx.beginPath(); ctx.ellipse(0, 470, 90, 110, 0, 0, TAU); }, col, { shadow: 0.5, edge: 4 }); for (let i = 0; i < 4; i++) cut(P_rr(-70 + i * 40, 520, 30, 120 - Math.abs(i - 1.5) * 18, 15), col, { shadow: 0.3, edge: 3 }); cut(P_rr(70, 420, 30, 100, 15), col, { shadow: 0.3, edge: 3 }); rr(-44, 380, 88, 22, 8); ctx.fillStyle = P.gold; ctx.fill(); ctx.restore(); }
/** a big fist on a forearm, pointing along +x after rot */
function fist(x, y, s = 1, rot = 0, col = HANU.skin) { ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s); cut(P_rr(-420, -45, 420, 90, 40), col, { shadow: 0.5, edge: 4 }); rr(-120, -50, 26, 100, 8); ctx.fillStyle = P.gold; ctx.fill(); cut(P_rr(-20, -90, 170, 180, 50), col, { shadow: 0.5, edge: 4 }); ctx.strokeStyle = 'rgba(62,44,30,0.45)'; ctx.lineWidth = 6; for (let i = 0; i < 3; i++) { ctx.beginPath(); ctx.moveTo(90, -45 + i * 45); ctx.lineTo(150, -45 + i * 45); ctx.stroke(); } ctx.restore(); }
/** a left footprint / sole in cut paper (toes up, big toe on the right = left foot seen from below... drawn as a left foot from above) */
function foot(x, y, s = 1, col = HANU.skin) { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); cut(() => { ctx.beginPath(); ctx.moveTo(-60, 140); ctx.bezierCurveTo(-110, 60, -100, -120, -20, -150); ctx.bezierCurveTo(70, -170, 100, -80, 80, 20); ctx.bezierCurveTo(70, 100, 50, 160, -10, 170); ctx.closePath(); }, col, { shadow: 0.6, edge: 5 }); for (const [tx, ty, r] of [[60, -190, 34], [10, -205, 26], [-30, -200, 22], [-62, -185, 19], [-88, -160, 16]]) cut(P_circ(tx, ty, r), col, { shadow: 0.3, edge: 3 }); rr(-70, 110, 120, 20, 8); ctx.fillStyle = P.gold; ctx.fill(); ctx.restore(); }
/** a rakshasa guard with a spear and a torch */
function guard(x, y, h, t, dir = 1) { person({ ...GUARD, x, y, h, dir, arm: 40, back: 30, hold: (hx, hy) => { cut(P_rr(hx - 7, hy - 360, 14, 520, 5), '#5A4028', { shadow: 0.3, edge: 2 }); cut(P_poly([[hx - 22, hy - 360], [hx, hy - 440], [hx + 22, hy - 360]]), '#9C9C9C', { shadow: 0.3, edge: 2 }); } }); ctx.save(); ctx.translate(x, y - h * 545 / 640); const s = h / 640; ctx.scale(s * dir, s); for (const k of [-1, 1]) cut(P_poly([[k * 30, -50], [k * 64, -120], [k * 52, -40]]), '#3E3550', { shadow: 0.2, edge: 3 }); ctx.restore(); flame(x - dir * h * 0.18, y - h * 0.62, 0.22 * h / 640 * 2, t + x); }
/** tiny Hanuman standing (walk bob) */
function smallHanu(x, y, h, t, o = {}) { vanara({ ...HANU, x, y, h, halo: o.halo ?? 0.6, arm: o.arm ?? 20, back: o.back ?? 15, dir: o.dir || 1, bob: o.walk ? -Math.abs(Math.sin(t * 7)) * h * 0.04 : 0, t, ...o }); }
/** a namaste-like pose: both arms forward/up */
const NAMASTE = { arm: 70, back: 60 };
function crossOut(x, y, p, s = 1) { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); bigCross(0, 0, p); ctx.restore(); }
function pastWash(a = 0.25) { wash('#C9A86A', a); }

export function buildShots() {
  const S = [], CUES = [], add = (o) => (S.push(o), o), cue = (t, type, o = {}) => CUES.push({ t: +t.toFixed(3), type, ...o });
  const OFF = 2;
  const at = (i) => L(i + OFF) - 0.08;
  const w = (word, i) => Wd(word, i + OFF) - at(i);
  const pop = (lt, a, dur = 0.35) => (lt > a ? eob(seg(lt, a, a + dur)) : 0);
  const shot = (i, o) => { const st = at(i); add({ id: `S${String(i).padStart(2, '0')}`, at: st, ...o }); cue(st, 'whoosh', { gain: 0.5 }); return st; };
  const sub = (id, st, o) => { add({ id, at: st, ...o }); cue(st, 'whoosh', { gain: 0.45 }); return st; };
  const subAt = (i, word) => Wd(word, i + OFF) - 0.12;
  const wAt = (word, i, st) => Wd(word, i + OFF) - st;

  // H0a · hook: golden Lanka at night, behind its wall and gate
  { const ra = Wd('रक्षा', 0), na = Wd('नगरी', 0); add({ id: 'H0a', at: 0, cam: [540, 1000], zoom: 0.12, note: 'hook: golden Lanka at night, wall and gate; slips LANKA KI RAKSHA, LANKA NAGARI', draw(lt, d, t) {
    nightCity(401, t, { wallGlow: 0.4 });
    K.slip('लंका की रक्षा', 300, 330, pop(lt, ra), -0.04, 62); K.slip('लंका नगरी', 760, 470, pop(lt, na), 0.04, 62);
  } }); cue(0.05, 'whoosh', { gain: 0.5 }); cue(ra, 'pop'); cue(na, 'pop'); }
  // H0b · ...as a woman: the city goddess rises behind the gate
  { const st = Wd('स्त्री', 0) - 0.12; sub('H0b', st, { cam: [540, 950], zoom: 0.14, note: 'hook: the city goddess rises huge in front of the gate, a crown of golden towers; slip STREE KE ROOP MEIN?', draw(lt, d, t) {
    nightCity(402, t, { wallGlow: 0.3 });
    const k = eob(seg(lt, 0, 0.6)); lankaDevi(540, lerp(1900, 1520, k), 900, { arm: 40, back: 30, aura: 0.5 * k, bob: Math.sin(t * 2) * 6 });
    K.slip('स्त्री के रूप में?', 540, 230, pop(lt, 0.15), -0.03, 62);
  } }); cue(st + 0.1, 'slam', { gain: 0.35 }); }
  // H1 · no? come, I'll tell you
  { const st = L(1) - 0.08, ai = Wd('आइए', 1) - st; add({ id: 'H1', at: st, cam: [540, 1000], zoom: 0.1, note: 'hook: title ribbon LANKA KI RAKSHAK DEVI; small Hanuman faces the goddess at the gate', draw(lt, d, t) {
    nightCity(403, t, { gate: true });
    lankaDevi(700, 1500, 620, { arm: 70, back: 20, dir: -1 }); smallHanu(320, 1500, 300, t, { halo: 0.8 });
    K.ribbon('लंका की रक्षक देवी', 540, 330, pop(lt, 0.05, 0.45), 74);
  } }); cue(st + 0.05, 'pop', { gain: 0.6 }); cue(st + ai, 'sparkle', { dur: 1 }); }

  // 0a · Hanuman crosses the sea and lands near Lanka
  { const la = w('लंका', 0); const st = shot(0, { cam: [540, 1000], zoom: 0.13, note: 'day: Hanuman flies down a crimson route onto the shore of Lanka; slip LANKA PAHUNCHE', draw(lt, d, t) {
    seaSky(404, t, 1250); lankaIsle(760, 1300, 1.1);
    const k = eio(seg(lt, 0, la + 0.6)); arc(120, 500, 640, 900, 120, k); const [x, y] = arcPt(120, 500, 640, 900, 120, k * 0.95); flyer(x, y, 320, t, { halo: 0.8 });
    K.slip('समुद्र पार', 280, 280, pop(lt, 0.05), -0.04, 62); K.slip('लंका पहुँचे', 640, 1150, pop(lt, la), 0.03, 60);
  } }); cue(st + la, 'pop'); }
  // 0b · he waits for night
  { const st = subAt(0, 'रात'), iz = wAt('इंतज़ार', 0, st); sub('S00b', st, { cam: [540, 1000], zoom: 0.13, note: 'Hanuman sits on a hill looking at Lanka; the sky darkens to night and the moon rises; slip RAAT KA INTZAAR', draw(lt, d, t) {
    const dk = eio(seg(lt, 0, 1.6)); skyPage(405, '#E2C08E'); sun(260, lerp(500, 1000, dk), 70, t, 1 - dk); wash('#1E2440', 0.85 * dk);
    if (dk > 0.3) moon(860, lerp(700, 330, dk), 56);
    trikuta(780, 1450, 0.55, t, 0.6 * dk); mountain(180, 1550, 0.9, '#5E5A6E', '#4A4660');
    smallHanu(200, 950, 260, t, { halo: 0.7, arm: 30 });
    K.slip('रात', 300, 300, pop(lt, 0.05), -0.04, 72); K.slip('इंतज़ार', 700, 400, pop(lt, iz), 0.04, 66);
  } }); cue(st + iz, 'pop'); }

  // 1a · Lanka on Trikuta
  { const st = shot(1, { cam: [540, 1000], zoom: 0.12, note: 'night: the three peaks of Trikuta, Lanka glowing gold on top; slip TRIKUTA PARVAT', draw(lt, d, t) {
    nightPage(406, t); moon(860, 280, 56); trikuta(540, 1500, 1.0, t, 0.9);
    K.slip('त्रिकूट पर्वत', 540, 260, pop(lt, 0.05), -0.03, 64);
  } }); cue(st + 0.05, 'pop'); }
  // 1b · golden walls shining at night
  { const st = subAt(1, 'सोने'), ch = wAt('चमक', 1, st); sub('S01b', st, { cam: [540, 1050], zoom: 0.14, note: 'close: the golden wall and palace roofs shining in the night, sparkles; slip SONE KI DEEWAREN', draw(lt, d, t) {
    nightCity(407, t, { gate: false, wallGlow: 0.5 + 0.4 * pop(lt, ch), wy: 900, gy: 1600 });
    sparkles(540, 1000, 420, t, 0.4 + 0.6 * pop(lt, ch));
    K.slip('सोने की दीवारें', 540, 300, pop(lt, 0.05), -0.03, 62);
  } }); cue(st + ch, 'sparkle', { dur: 0.8 }); }

  // 2a · he becomes as small as a cat
  { const bi = w('बिल्ली', 2), ch = w('छोटे', 2); const st = shot(2, { cam: [540, 1050], zoom: 0.12, note: 'night by the wall: big Hanuman shrinks down to the size of a cat sitting beside him; slip BILLI JITNE', draw(lt, d, t) {
    nightPage(408, t); moon(860, 260, 50); goldWall(700, t, 0.2); ground(1450, '#3E3550');
    const k = eio(seg(lt, ch - 0.3, ch + 0.5)); glow(420, lerp(1100, 1350, k), lerp(380, 160, k), 0.5 * pop(lt, ch - 0.3, 0.3) * (1 - seg(lt, ch + 0.6, ch + 1.2)));
    smallHanu(420, 1450, lerp(640, 230, k), t, { halo: 0.7 }); cat(700, 1450, pop(lt, bi - 0.1) * 1.05);
    K.slip('बिल्ली जितने', 700, 330, pop(lt, bi), 0.04, 66);
  } }); cue(st + bi, 'pop'); cue(st + ch, 'sparkle', { dur: 0.6 }); }
  // 2b · so no rakshasa recognises him
  { const st = subAt(2, 'राक्षस'), pe = wAt('पहचान', 2, st); sub('S02b', st, { cam: [540, 1050], zoom: 0.13, note: 'two rakshasa guards with torches walk past; tiny Hanuman slips by in the shadow of the wall; slip PEHCHAAN NA SAKE', draw(lt, d, t) {
    nightPage(409, t); goldWall(700, t, 0.15); ground(1450, '#3E3550');
    guard(lerp(900, 640, seg(lt, 0, 2)), 1450, 520, t, -1); guard(lerp(1120, 860, seg(lt, 0, 2)), 1450, 500, t, -1);
    smallHanu(lerp(140, 300, seg(lt, 0, 3)), 1450, 170, t, { walk: true, halo: 0.4 });
    K.slip('राक्षस', 820, 300, pop(lt, 0.05), 0.04, 62); K.slip('पहचान न सके', 330, 440, pop(lt, pe), -0.04, 60);
  } }); cue(st + pe, 'pop'); }

  // 3a · at the city gate
  { const st = shot(3, { cam: [540, 1050], zoom: 0.12, note: 'the great golden gate at night; tiny Hanuman walks up to it; slip NAGAR KA DWAAR', draw(lt, d, t) {
    nightCity(410, t, { gs: 1.0 }); smallHanu(lerp(160, 360, seg(lt, 0, 2.2)), 1500, 160, t, { walk: lt < 2.2, halo: 0.5 });
    K.slip('नगर का द्वार', 540, 260, pop(lt, 0.05), -0.03, 64);
  } }); cue(st + 0.05, 'pop'); }
  // 3b · a fearsome woman blocks his way
  { const st = subAt(3, 'अचानक'), bh = wAt('भयानक', 3, st), ra = wAt('रास्ता', 3, st); sub('S03b', st, { cam: [540, 1000], zoom: 0.14, note: 'the goddess appears huge in front of the gate, one arm out across the way; Hanuman small at left; slip RAASTA ROK LIYA', draw(lt, d, t) {
    nightCity(411, t, { gs: 1.0 });
    ctx.save(); shake(lt, 0.05, 0.6, 14); const k = eob(seg(lt, 0, 0.45)); lankaDevi(640, 1500, lerp(300, 880, k), { arm: lerp(10, 92, pop(lt, ra - 0.2, 0.4)), back: 20, dir: -1, aura: 0.6 }); ctx.restore();
    smallHanu(200, 1500, 160, t, { halo: 0.5 });
    K.slip('भयानक', 760, 240, pop(lt, bh), 0.04, 66); K.slip('रास्ता रोक लिया', 330, 1150, pop(lt, ra), -0.03, 58);
  } }); cue(st + 0.05, 'slam', { gain: 0.4 }); cue(st + ra, 'pop'); }

  // 4a · I am Lanka herself
  { const sv = w('स्वयं', 4), la = w('लंका', 4); const st = shot(4, { cam: [540, 950], zoom: 0.13, note: 'the goddess, close, a hand on her chest; behind her the city glows; slip MAIN SWAYAM LANKA NAGARI', draw(lt, d, t) {
    nightPage(412, t); trikuta(540, 1650, 0.9, t, 0.5 + 0.4 * pop(lt, la)); wash('#1E2440', 0.25);
    lankaDevi(540, 1700, 1150, { arm: 150, back: 20, aura: 0.6, bob: Math.sin(t * 2) * 6 });
    K.slip('मैं स्वयं', 260, 330, pop(lt, sv), -0.04, 62); K.slip('लंका नगरी', 800, 330, pop(lt, la), 0.04, 62);
  } }); cue(st + sv, 'pop'); cue(st + la, 'pop'); }
  // 4b · no one enters without my command
  { const st = subAt(4, 'मेरी'), na = wAt('नहीं', 4, st); sub('S04b', st, { cam: [540, 1050], zoom: 0.13, note: 'the shut gate; the goddess stands before it, arm out; a crimson cross on the gate; slip KOI NAHIN GHUS SAKTA', draw(lt, d, t) {
    nightCity(413, t, { gs: 1.0 }); lankaDevi(860, 1500, 560, { arm: 90, back: 10, dir: -1, aura: 0.4 });
    crossOut(540, 1150, seg(lt, na - 0.1, na + 0.4));
    K.slip('आज्ञा के बिना', 540, 260, pop(lt, 0.05), -0.03, 60); K.slip('कोई नहीं घुस सकता', 540, 420, pop(lt, na), 0.03, 56);
  } }); cue(st + na, 'slam', { gain: 0.3 }); }

  // 5a · Tulsidas called her Lankini
  { const lk = w('लंकिनी', 5); const st = shot(5, { cam: [540, 1000], zoom: 0.12, note: 'Tulsidas ji (sage, white robe) writing on a palm-leaf pothi; slip TULSIDAS + LANKINI', draw(lt, d, t) {
    palaceDay(414); ground(1450, '#C9A86A');
    person({ ...TULSI, x: 330, y: 1450, h: 620, arm: 70, back: 30 }); pothi(720, 1150, 0.65, seg(lt, 0, 2));
    K.slip('तुलसीदास जी', 330, 300, pop(lt, 0.05), -0.04, 60); K.slip('लंकिनी', 720, 820, pop(lt, lk), 0.04, 84);
  } }); cue(st + lk, 'pop'); }
  // 5b · in Valmiki she is the city itself
  { const st = subAt(5, 'पर'), va = wAt('वाल्मीकि', 5, st), la = wAt('लंका', 5, st); sub('S05b', st, { cam: [540, 1000], zoom: 0.13, note: 'Valmiki ji with his book at left; at right the golden city fades into the goddess form (city = woman); slip VALMIKI RAMAYAN / LANKA NAGARI', draw(lt, d, t) {
    palaceDay(415); ground(1450, '#C9A86A');
    person({ ...VALMIKI, x: 230, y: 1450, h: 560, arm: 80, back: 20, hold: (hx, hy) => book(hx + 20, hy - 40, 0.5) });
    const k = eio(seg(lt, la - 0.4, la + 0.6)); ctx.save(); ctx.globalAlpha = 1 - 0.7 * k; palace(750, 1450, 0.5, 1); ctx.restore();
    ctx.save(); ctx.globalAlpha = k; lankaDevi(750, 1450, 600, { arm: 20, back: 20, dir: -1, fierce: false }); ctx.restore();
    K.slip('वाल्मीकि रामायण', 300, 300, pop(lt, va), -0.04, 58); K.slip('ख़ुद लंका नगरी', 750, 420, pop(lt, la), 0.04, 58);
  } }); cue(st + va, 'pop'); cue(st + la, 'sparkle', { dur: 0.8 }); }

  // 6a · Hanuman, politely
  { const st = shot(6, { cam: [540, 1050], zoom: 0.13, note: 'small Hanuman, hands raised politely, looking up at the huge goddess; slip VINAMRATA SE', draw(lt, d, t) {
    nightCity(416, t, { gs: 1.0 }); lankaDevi(760, 1500, 820, { arm: 10, back: 10, dir: -1 });
    smallHanu(330, 1500, 260, t, { ...NAMASTE, halo: 0.8 });
    K.slip('विनम्रता से', 320, 300, pop(lt, 0.1), -0.04, 64);
  } }); cue(st + 0.1, 'pop'); }
  // 6b · I just want to see this beautiful city
  { const st = subAt(6, 'मैं'), su = wAt('सुंदर', 6, st); sub('S06b', st, { cam: [540, 1000], zoom: 0.13, note: 'a thought cloud above Hanuman shows palaces and gardens; slip SUNDAR NAGAR', draw(lt, d, t) {
    nightCity(417, t, { gs: 1.0 }); smallHanu(300, 1500, 300, t, { ...NAMASTE, halo: 0.8 });
    thoughtOf(640, 640, 0.75 * pop(lt, 0.05, 0.4), () => { palace(0, 90, 0.32, 1); forestTree(-200, 110, 0.35); forestTree(200, 110, 0.35); });
    K.slip('सुंदर नगर', 640, 1000, pop(lt, su), 0.04, 66);
  } }); cue(st + su, 'sparkle', { dur: 0.6 }); }

  // 7 · she slaps him, hard
  { const gu = w('ग़ुस्से', 7), th = w('थप्पड़', 7); const st = shot(7, { cam: [540, 1000], zoom: 0.14, note: 'the goddess flares red with anger; her huge palm swings down onto small Hanuman; on THAPPAD an impact burst and shake', draw(lt, d, t) {
    nightPage(418, t); goldWall(900, t, 0.2); ground(1500, '#3E3550'); wash('#7A1E24', 0.25 * pop(lt, gu));
    ctx.save(); shake(lt, th, 0.7, 20);
    lankaDevi(830, 1500, 760, { arm: 10, back: 10, dir: -1, aura: 0.4 + 0.5 * pop(lt, gu) });
    const k = eio(seg(lt, th - 0.4, th)); palm(800, 980, 0.8, lerp(2.9, 1.09, k));
    smallHanu(330, 1500, 300, t, { halo: 0.7, arm: 40, back: 30 }); impact(450, 1170, seg(lt, th, th + 0.5), 0.6);
    ctx.restore();
    K.slip('ग़ुस्से में', 300, 280, pop(lt, gu), -0.04, 62); K.slip('थप्पड़!', 760, 330, pop(lt, th), 0.05, 80);
  } }); cue(st + th, 'slam', { gain: 0.55 }); }

  // 8a · Hanuman roars
  { const ga = w('गर्जना', 8); const st = shot(8, { cam: [540, 1000], zoom: 0.14, note: 'Hanuman roars: he grows, golden rings burst from him; the goddess leans back; slip GARJANA', draw(lt, d, t) {
    nightCity(419, t, { gs: 1.0 }); lankaDevi(820, 1500, 760, { arm: 120, back: 30, dir: -1, aura: 0.3 });
    const k = eob(seg(lt, ga - 0.1, ga + 0.5)); smallHanu(340, 1500, lerp(300, 560, k), t, { halo: 1, arm: 120, back: 100 });
    rings(340, 1100, t, pop(lt, ga, 0.3), P.gold, 4);
    bigText('गर्जना!', 360, 330, 110, P.crimson, pop(lt, ga, 0.4));
  } }); cue(st + ga, 'slam', { gain: 0.45 }); }
  // 8b · but thinking: she is a woman, he held back his strength
  { const st = subAt(8, 'पर'), str = wAt('स्त्री', 8, st), na = wAt('नहीं', 8, st); sub('S08b', st, { cam: [540, 1000], zoom: 0.13, note: 'Hanuman pauses, fist lowered; a thought cloud with a woman in a sari; a strength bar fills only a little; slip POORI TAAKAT NAHIN', draw(lt, d, t) {
    nightPage(420, t); goldWall(1000, t, 0.15); ground(1500, '#3E3550');
    smallHanu(300, 1500, 560, t, { halo: 0.9, arm: 20, back: 15 });
    thoughtOf(720, 560, 0.7 * pop(lt, 0.05, 0.4), () => { person({ ...LDEVI, x: 0, y: 150, h: 260, fierce: false }); });
    K.slip('स्त्री है', 720, 880, pop(lt, str), 0.04, 62);
    const bp = pop(lt, na - 0.5, 0.5); if (bp > 0) { cut(P_rr(560, 1030, 400, 60, 30), '#3E3550', { shadow: 0.3, edge: 3 }); cut(P_rr(566, 1036, Math.max(10, 388 * 0.25 * bp), 48, 24), P.crimson, { shadow: 0, edge: 2 }); }
    K.slip('पूरी ताक़त नहीं', 760, 1180, pop(lt, na), -0.03, 52);
  } }); cue(st + str, 'pop'); cue(st + na, 'pop'); }

  // 9a · just a light blow with the left fist
  { const ba = w('बाएँ', 9), ha = w('हल्का', 9); const st = shot(9, { cam: [540, 1000], zoom: 0.14, note: 'close: Hanuman\'s left fist (marked BAAYAN) moves in gently; small impact; slips BAAYEN HAATH KI MUTTHI / HALKA SA', draw(lt, d, t) {
    nightPage(421, t); wash('#3E3550', 0.3);
    const k = eio(seg(lt, ha - 0.4, ha + 0.1)); fist(lerp(420, 640, k), 900, 1.1, 0);
    impact(820, 900, seg(lt, ha + 0.05, ha + 0.6), 0.7);
    K.slip('बायाँ हाथ', 300, 400, pop(lt, ba), -0.04, 64); K.slip('हल्का सा प्रहार', 600, 1180, pop(lt, ha), 0.03, 58);
  } }); cue(st + ha, 'pop', { gain: 0.8 }); }
  // 9b · she falls to the ground
  { const st = subAt(9, 'और'), gi = wAt('गिर', 9, st); sub('S09b', st, { cam: [540, 1050], zoom: 0.13, note: 'the goddess topples and falls flat to the ground; dust; Hanuman stands calm; slip GIR PADI!', draw(lt, d, t) {
    nightCity(422, t, { gs: 1.0 });
    const k = eio(seg(lt, gi - 0.35, gi + 0.2)); ctx.save(); ctx.translate(720, 1500); ctx.rotate(rad(85) * k); lankaDevi(0, 0, 600, { arm: lerp(10, 120, k), back: 60, dir: -1, aura: 0.3 * (1 - k) }); ctx.restore();
    smoke(840, 1480, seg(lt, gi, gi + 1.0), 7); smallHanu(250, 1500, 300, t, { halo: 0.9 });
    K.slip('धरती पर', 540, 280, pop(lt, 0.05), -0.03, 60); bigText('गिर पड़ी!', 700, 450, 100, P.crimson, pop(lt, gi, 0.4));
  } }); cue(st + gi, 'slam', { gain: 0.45 }); }

  // 10 · she joins her hands: have mercy
  { const ma = w('महाबली', 10), da = w('दया', 10); const st = shot(10, { cam: [540, 1000], zoom: 0.13, note: 'the goddess kneels/bows with joined hands before glowing Hanuman; slip DAYA KARO!', draw(lt, d, t) {
    nightCity(423, t, { gs: 1.0 }); smallHanu(300, 1500, 460, t, { halo: 1 }); glow(300, 1150, 300, 0.4);
    { const bk = pop(lt, 0.05, 0.5); ctx.save(); ctx.translate(780, 1500); ctx.rotate(-rad(30) * bk); lankaDevi(0, 0, 560, { dir: -1, arm: lerp(10, 70, bk), back: lerp(10, 60, bk), fierce: false }); ctx.restore(); }
    K.slip('हे महाबली', 300, 300, pop(lt, ma), -0.04, 62); K.slip('दया करो!', 760, 440, pop(lt, da), 0.04, 70);
  } }); cue(st + da, 'pop'); }

  // 11 · long ago Brahma had told me
  { const br = w('ब्रह्मा', 11); const st = shot(11, { cam: [540, 1000], zoom: 0.12, note: 'memory (warm sepia): Brahma ji on a lotus among clouds speaks to the goddess standing before him; slip BRAHMA JI', draw(lt, d, t) {
    heaven(424); pastWash(0.25); lotus(340, 1250, 1.2); brahma(340, 1150, 560, { halo: 0.9, arm: 100 }); cloudGround(1400);
    lankaDevi(800, 1400, 500, { arm: 60, back: 50, dir: -1, fierce: false });
    K.slip('बहुत पहले', 540, 240, pop(lt, 0.05), -0.03, 60); K.slip('ब्रह्मा जी', 340, 420, pop(lt, br), 0.04, 64);
  } }); cue(st + br, 'sparkle', { dur: 0.8 }); }

  // 12a · the day a vanara defeats you
  { const va = w('वानर', 12), ha = w('हरा', 12); const st = shot(12, { cam: [540, 1000], zoom: 0.13, note: 'Brahma\'s words as a vision: a vanara figure stands tall and glowing over the fallen goddess (cut paper card); slip VAANAR / HARA DE', draw(lt, d, t) {
    heaven(425); pastWash(0.3);
    scrollCard(['जिस दिन कोई वानर'], 540, 330, pop(lt, 0.05, 0.4), 62);
    const k = eio(seg(lt, ha - 0.2, ha + 0.4)); ctx.save(); ctx.translate(760, 1350); ctx.rotate(rad(80) * k); lankaDevi(0, 0, 480, { arm: 20, back: 20, dir: -1, fierce: false }); ctx.restore();
    ctx.save(); ctx.globalAlpha = pop(lt, va - 0.1); vanara({ ...VANARA(0), x: 380, y: 1350, h: 560, halo: 0.6, arm: 120, t }); ctx.restore(); cloudGround(1380);
    K.slip('हरा दे', 760, 700, pop(lt, ha), 0.04, 66);
  } }); cue(st + va, 'pop'); cue(st + ha, 'slam', { gain: 0.3 }); }
  // 12b · know that the end of the rakshasas is near
  { const st = subAt(12, 'समझ'), an = wAt('अंत', 12, st); sub('S12b', st, { cam: [540, 1000], zoom: 0.14, note: 'Ravana\'s Lanka palace darkens under a red sky; rakshasa shadows fade; big crimson ANT PAAS HAI!', draw(lt, d, t) {
    nightPage(426, t); wash('#7A1E24', 0.15 + 0.3 * pop(lt, an)); palace(540, 1450, 1.0, 1); ground(1450, '#2A2230');
    for (const [x, h] of [[160, 420], [920, 440]]) rakshasaShadow(x, 1450, h, 1 - 0.7 * seg(lt, an, an + 1));
    wash('#1E2440', 0.35 * pop(lt, an));
    K.slip('राक्षसों का', 540, 300, pop(lt, 0.05), -0.03, 62); bigText('अंत पास है!', 540, 520, 104, P.crimson, pop(lt, an, 0.4));
  } }); cue(st + an, 'slam', { gain: 0.45 }); }

  // 13a · go
  { const ja = w('जाओ', 13); const st = shot(13, { cam: [540, 1050], zoom: 0.13, note: 'the goddess stands aside and points at the gate; the doors swing open with golden light; slip JAAO', draw(lt, d, t) {
    nightCity(427, t, { gs: 1.0, open: eio(seg(lt, ja - 0.1, ja + 0.8)) });
    lankaDevi(880, 1500, 560, { arm: 75, back: 10, dir: -1, fierce: false }); smallHanu(220, 1500, 280, t, { halo: 0.9 });
    K.slip('जाओ', 540, 280, pop(lt, ja), -0.03, 84);
  } }); cue(st + ja, 'sparkle', { dur: 0.8 }); }
  // 13b · find Sita ji wherever you like
  { const st = subAt(13, 'जहाँ'), si = wAt('सीता', 13, st); sub('S13b', st, { cam: [540, 1000], zoom: 0.13, note: 'a thought cloud shows Sita ji (glowing halo) under a tree; Hanuman looks up; slip SITA JI KO DHOONDHO', draw(lt, d, t) {
    nightCity(428, t, { gs: 1.0, open: 1 }); smallHanu(260, 1500, 300, t, { halo: 0.9 });
    thoughtOf(660, 620, 0.78 * pop(lt, 0.05, 0.4), () => { forestTree(80, 140, 0.4, 0.6, t); person({ ...SITA, x: -60, y: 140, h: 240, halo: 0.9 }); });
    K.slip('सीता जी को ढूँढो', 620, 1020, pop(lt, si), 0.04, 58);
  } }); cue(st + si, 'pop'); }

  // 14a · not through the gate
  { const dw = w('द्वार', 14), na = w('नहीं', 14); const st = shot(14, { cam: [540, 1050], zoom: 0.12, note: 'the open gate with a crimson cross over it; Hanuman small beside; slip DWAAR SE NAHIN', draw(lt, d, t) {
    nightCity(429, t, { gs: 1.0, open: 1 }); smallHanu(220, 1500, 280, t, { halo: 0.8 });
    crossOut(540, 1150, seg(lt, na - 0.1, na + 0.4));
    K.slip('द्वार से नहीं!', 540, 280, pop(lt, dw), -0.03, 70);
  } }); cue(st + na, 'slam', { gain: 0.3 }); }
  // 14b · leaps over the wall
  { const st = subAt(14, 'दीवार'), ku = wAt('कूद', 14, st); sub('S14b', st, { cam: [540, 1000], zoom: 0.13, note: 'Hanuman arcs high over the golden wall into the city (dashed crimson route); slip DEEWAR PHAANDKAR', draw(lt, d, t) {
    nightPage(430, t); moon(860, 240, 50); palace(540, 1150, 0.8, 1); goldWall(1000, t, 0.3); ground(1600, '#3E3550');
    const k = eio(seg(lt, 0, ku + 0.3)); arc(140, 1300, 900, 900, 600, k); const [x, y] = arcPt(140, 1300, 900, 900, 600, Math.min(k, 0.98)); flyer(x, y, 240, t, { halo: 0.8, tilt: lerp(40, 110, k) });
    K.slip('दीवार फाँदकर', 300, 300, pop(lt, 0.05), -0.04, 62); K.slip('कूद गए!', 820, 560, pop(lt, ku), 0.04, 68);
  } }); cue(st + 0.05, 'whoosh', { gain: 0.6 }); cue(st + ku, 'pop'); }

  // 15a · first step with the left foot
  { const ba = w('बाएँ', 15); const st = shot(15, { cam: [540, 1000], zoom: 0.14, note: 'inside the city: a huge left foot comes down onto the golden street; dust ring; slip PEHLA KADAM / BAAYAN PAIR', draw(lt, d, t) {
    nightPage(431, t); palace(540, 900, 0.9, 1); ground(900, '#B7976A');
    const k = eio(seg(lt, ba - 0.4, ba + 0.1)); foot(540, lerp(300, 1050, k), 1.6);
    smoke(540, 1250, seg(lt, ba + 0.1, ba + 1.0), 3);
    K.slip('पहला कदम', 300, 300, pop(lt, 0.05), -0.04, 62); K.slip('बायाँ पैर', 780, 420, pop(lt, ba), 0.04, 66);
  } }); cue(st + ba + 0.1, 'slam', { gain: 0.4 }); }
  // 15b · as if on the heads of his enemies
  { const st = subAt(15, 'मानो'), si = wAt('सिर', 15, st); sub('S15b', st, { cam: [540, 1000], zoom: 0.13, note: 'the footprint\'s shadow falls over the crowns of rakshasa silhouettes and ten-headed Ravana\'s crown far below; slip SHATRUON KE SIR PAR!', draw(lt, d, t) {
    nightPage(432, t); wash('#7A1E24', 0.12); ground(1500, '#2A2230');
    ravana(540, 1500, 520, {}); rakshasaShadow(170, 1500, 400); rakshasaShadow(910, 1500, 400);
    const k = eio(seg(lt, 0, si)); ctx.save(); ctx.globalAlpha = 0.85; foot(540, lerp(150, 560, k), 1.5); ctx.restore();
    K.slip('शत्रुओं के', 230, 260, pop(lt, 0.05), -0.04, 60); bigText('सिर पर!', 800, 330, 100, P.crimson, pop(lt, si, 0.4));
  } }); cue(st + si, 'slam', { gain: 0.4 }); }

  // 16 · did you know? tell us in the comments
  { const pa = w('पता', 16), ko = w('कमेंट', 16); const st = shot(16, { cam: [540, 950], zoom: 0.12, note: 'a big comment bubble, slip COMMENT', draw(lt, d, t) {
    K.parchment(433); bubble(540, 900, pop(lt, 0.05, 0.4), t);
    K.slip('?', 860, 560, pop(lt, pa, 0.3), 0.08, 120);
    K.slip('कमेंट करें', 540, 1250, pop(lt, ko), -0.02, 60);
  } }); cue(st + 0.05, 'pop'); cue(st + ko, 'sparkle', { dur: 0.8 }); }

  // 17a · lesson: strength with restraint
  { const si = w('सीख', 17), sa = w('संयम', 17); const st = shot(17, { cam: [540, 1000], zoom: 0.1, note: 'dawn over Lanka: Hanuman glowing, gada held low; ribbon SEEKH, slips TAAKAT + SANYAM', draw(lt, d, t) {
    skyPage(434, '#EBCB8E'); sun(860, 600, 90, t, 0.9); trikuta(760, 1500, 0.6, t, 0.3); ground(1500, '#B7976A');
    glow(330, 1100, 380, 0.3 + 0.4 * pop(lt, sa)); vanara({ ...HANU, x: 330, y: 1500, h: 600, halo: 1, arm: 15, back: 15, t, hold: gada });
    K.ribbon('सीख', 540, 300, pop(lt, si, 0.45), 96);
    K.slip('ताक़त + संयम', 760, 700, pop(lt, sa), 0.04, 60);
  } }); cue(st + si, 'pop', { gain: 0.6 }); }
  // 17b · then victory is certain
  { const st = subAt(17, 'तो'), ji = wAt('जीत', 17, st); sub('S17b', st, { cam: [540, 1000], zoom: 0.12, note: 'Hanuman small before the open golden gate of Lanka at night (loops to the hook); slip JEET PAKKI', draw(lt, d, t) {
    nightCity(435, t, { gs: 1.0, open: 1, wallGlow: 0.5 }); smallHanu(540, 1500, 300, t, { halo: 1 }); sparkles(540, 1150, 300, t, pop(lt, ji));
    K.slip('जीत पक्की!', 540, 300, pop(lt, ji), -0.03, 80);
  } }); cue(st + ji, 'sparkle', { dur: 1.2 }); }

  return { shots: S, cues: CUES };
}
