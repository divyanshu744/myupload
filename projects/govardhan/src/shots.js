// GOVARDHAN: the shot list (Katha style, Hindi). Everything is cut paper on parchment.
// Deities are drawn simply and respectfully: no faces. Kit from samudra-manthan / ganesh-parikrama + new pieces below.
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

// ═════════════ GOVARDHAN ADDITIONS ═════════════
const GV = { hill: '#7E8B5A', hill2: '#8FA05E', hill3: '#6A7A4A', soil: '#8A6A48', rock: '#9C8C70', storm: '#4B5163', storm2: '#5D6377', water: ['#6F8FB0', '#5D7FA3', '#7C9CBC', '#56789A'], rain: 'rgba(200,215,235,0.75)' };
/** Govardhan hill, base centre (x, y). o.under = show the rocky underside (lifted). Returns top y offset helper */
function hill(x, y, s = 1, o = {}) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  if (o.under) cut(() => { ctx.beginPath(); ctx.moveTo(-480, 0); ctx.quadraticCurveTo(-200, 110, 0, 120); ctx.quadraticCurveTo(200, 110, 480, 0); ctx.closePath(); }, GV.soil, { shadow: 0.8, edge: 5 });
  if (o.under) { ctx.fillStyle = GV.rock; for (const [px, py, r] of [[-250, 40, 26], [-80, 70, 32], [120, 60, 24], [300, 30, 20]]) { ctx.beginPath(); ctx.arc(px, py, r, 0, TAU); ctx.fill(); } }
  cut(() => { ctx.beginPath(); ctx.moveTo(-480, 0); ctx.bezierCurveTo(-440, -200, -330, -330, -230, -340); ctx.bezierCurveTo(-140, -350, -90, -440, 0, -440); ctx.bezierCurveTo(110, -440, 160, -360, 250, -350); ctx.bezierCurveTo(360, -340, 450, -190, 480, 0); ctx.closePath(); }, GV.hill);
  cut(() => { ctx.beginPath(); ctx.moveTo(-200, -320); ctx.bezierCurveTo(-120, -340, -80, -420, 0, -420); ctx.bezierCurveTo(90, -420, 130, -350, 220, -330); ctx.bezierCurveTo(100, -300, -60, -290, -200, -320); ctx.closePath(); }, GV.hill2, { shadow: 0, edge: 0 });
  for (const [px, py, r] of [[-300, -300, 50], [-250, -330, 40], [-30, -440, 55], [40, -430, 45], [280, -330, 48], [330, -300, 38]]) cut(P_circ(px, py, r), P.forest, { shadow: 0.3, edge: 3 });
  for (const [px, py, r] of [[-150, -150, 34], [180, -110, 28], [40, -240, 30]]) cut(P_circ(px, py, r), GV.rock, { shadow: 0.3, edge: 3 });
  ctx.restore();
}
/** top surface y of the hill at x (for rain that stops on the umbrella) */
const hillTop = (hx, hy, s, x) => { const u = (x - hx) / (480 * s); if (Math.abs(u) > 1) return 1e9; return hy - s * 440 * Math.max(0, 1 - u * u) + 20; };
function cowF(x, y, s) { ctx.save(); ctx.translate(x, y); ctx.scale(Math.sign(s) || 1, 1); cow(0, 0, Math.abs(s)); ctx.restore(); }
function elephantF(x, y, s, dir = 1) { ctx.save(); ctx.translate(x, y); ctx.scale(dir, 1); elephant(0, 0, s); ctx.restore(); }
function stormCloud(x, y, s, a = 1) { ctx.save(); ctx.globalAlpha = clamp(a); ctx.translate(x, y); ctx.scale(s, s); cut(() => { ctx.beginPath(); for (const [dx, dy, r] of [[-110, 10, 70], [-40, -35, 95], [60, -15, 85], [140, 15, 60]]) { ctx.moveTo(dx + r, dy); ctx.arc(dx, dy, r, 0, TAU); } ctx.rect(-170, 10, 320, 60); }, GV.storm, { shadow: 0.7, edge: 3 }); cut(() => { ctx.beginPath(); ctx.ellipse(-40, -50, 60, 30, 0, 0, TAU); }, GV.storm2, { shadow: 0, edge: 0 }); ctx.restore(); }
function stormSky(t, a = 1, dx = 0) { stormCloud(160 + dx + Math.sin(t * 0.5) * 20, 320, 1.4, a); stormCloud(620 + dx, 230, 1.6, a); stormCloud(980 + dx - Math.sin(t * 0.4) * 20, 380, 1.3, a); stormCloud(420 + dx, 470, 1.1, a); }
function stormPage(seed, dark = 1) { skyPage(seed, '#C9C3B0'); wash(C.dusk, 0.55 * dark); }
/** rain streaks in a box; yMax(x) stops a drop (umbrella); n = density */
function rain(t, a = 1, n = 120, x0 = -100, x1 = W + 100, y0 = -100, y1 = 1600, yMax = null, sp = 1.6, col = GV.rain) {
  if (a <= 0) return; ctx.save(); ctx.globalAlpha = clamp(a); ctx.strokeStyle = col; ctx.lineWidth = 5; ctx.lineCap = 'round'; ctx.beginPath();
  for (let i = 0; i < n; i++) { const k = (t * sp + rnd(i + 11)) % 1; const x = x0 + rnd(i) * (x1 - x0) - k * 60, y = y0 + k * (y1 - y0); if (yMax && y > yMax(x)) continue; ctx.moveTo(x, y); ctx.lineTo(x - 14, y + 60); }
  ctx.stroke(); ctx.restore();
}
function hail(t, a = 1, n = 30) { if (a <= 0) return; ctx.save(); ctx.globalAlpha = clamp(a); for (let i = 0; i < n; i++) { const k = (t * 1.1 + rnd(i + 40)) % 1; cut(P_circ(rnd(i + 3) * W, -50 + k * 1550, 12 + rnd(i) * 8), '#F4F1EA', { shadow: 0.3, edge: 2 }); } ctx.restore(); }
function bolt(x, y, s, a = 1) { if (a <= 0) return; ctx.save(); ctx.globalAlpha = clamp(a); glow(x, y + 250 * s, 300 * s, 0.8, '255,240,170'); ctx.translate(x, y); ctx.scale(s, s); cut(P_poly([[0, 0], [60, 0], [20, 180], [90, 180], [-30, 480], [10, 250], [-60, 250]]), '#F6E59A', { shadow: 0.2, edge: 4 }); ctx.restore(); }
function water(t, y0, a = 1) { ctx.save(); ctx.globalAlpha = clamp(a); for (let i = 0; i < 4; i++) { const y = y0 + i * 90; cut(() => { ctx.beginPath(); ctx.moveTo(-300, H + 300); ctx.lineTo(-300, y); for (let x = -300; x <= W + 300; x += 30) ctx.lineTo(x, y + Math.sin(x * 0.012 + t * 2.4 * (i % 2 ? -1 : 1) + i) * 16); ctx.lineTo(W + 300, H + 300); ctx.closePath(); }, GV.water[i], { shadow: 0.5, edge: 4 }); } ctx.restore(); }
function hut(x, y, s = 1) { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); cut(P_rr(-130, -200, 260, 200, 6), '#D9B977'); cut(P_rr(-35, -130, 70, 130, [30, 30, 0, 0]), '#6B4E32', { shadow: 0, edge: 3 }); cut(P_poly([[-170, -190], [0, -340], [170, -190]]), '#A88A50', { shadow: 0.5, edge: 4 }); ctx.strokeStyle = '#8A6E3A'; ctx.lineWidth = 4; for (let i = 0; i < 5; i++) { ctx.beginPath(); ctx.moveTo(-130 + i * 65, -200); ctx.lineTo(0, -330); ctx.stroke(); } ctx.restore(); }
function village(t) { hut(160, 1470, 0.9); hut(900, 1460, 0.8); hut(420, 1330, 0.55); }
function kund(x, y, s = 1, t = 0, f = 1) { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); if (f > 0) { glow(0, -120, 200 * f, 0.7); for (let i = 0; i < 5; i++) { const fx = -60 + i * 30, hh = (110 + 50 * Math.sin(t * 9 + i * 2)) * f; cut(P_poly([[fx - 30, -60], [fx + Math.sin(t * 7 + i) * 10, -60 - hh], [fx + 30, -60]]), i % 2 ? '#F2A93B' : '#D9602E', { shadow: 0, edge: 0 }); } } cut(P_poly([[-130, -70], [130, -70], [100, 0], [-100, 0]]), '#9A4A32', { shadow: 0.5, edge: 4 }); ctx.fillStyle = '#7A3426'; for (let i = 0; i < 4; i++) ctx.fillRect(-110 + i * 60, -44, 40, 10); ctx.restore(); }
function vajra(x, y, s = 1, rot = 0, crack = 0) { ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s); for (const k of [-1, 1]) { ctx.save(); ctx.translate(0, k * crack * 40); ctx.rotate(k * crack * 0.4); ctx.scale(1, k); cut(P_poly([[-14, 0], [14, 0], [10, -60], [34, -90], [12, -100], [0, -150], [-12, -100], [-34, -90], [-10, -60]]), P.gold, { shadow: 0.4, edge: 3 }); ctx.restore(); } if (!crack) cut(P_circ(0, 0, 20), P.crimson, { shadow: 0.3, edge: 3 }); ctx.restore(); }
function thali(x, y, s = 1, p = 1) { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); cut(() => { ctx.beginPath(); ctx.ellipse(0, 0, 130, 36, 0, 0, TAU); }, P.gold, { shadow: 0.5, edge: 4 }); const n = Math.round(14 * clamp(p)); for (let i = 0; i < n; i++) { const a = rnd(i + 2) * TAU, r = rnd(i + 5) * 70; cut(P_circ(Math.cos(a) * r, -26 - (1 - r / 70) * 40 - rnd(i) * 10, 24), ['#F1E4C4', C.saffron, '#E0B23C', '#C9575A', '#E8D49A'][i % 5], { shadow: 0.3, edge: 2 }); } ctx.restore(); }
function sun(x, y, r, t, a = 1) { if (a <= 0) return; ctx.save(); ctx.globalAlpha = clamp(a); glow(x, y, r * 3.2, 0.9); ctx.translate(x, y); ctx.rotate(t * 0.3); for (let i = 0; i < 12; i++) { ctx.save(); ctx.rotate(i * TAU / 12); cut(P_poly([[-16, -r - 10], [0, -r - 70], [16, -r - 10]]), '#E8B43C', { shadow: 0.2, edge: 3 }); ctx.restore(); } cut(P_circ(0, 0, r), '#E8B43C', { shadow: 0.4, edge: 4 }); ctx.restore(); }
function moon(x, y, r, a = 1) { if (a <= 0) return; ctx.save(); ctx.globalAlpha = clamp(a); glow(x, y, r * 2.5, 0.5, '230,230,210'); ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.arc(x + r * 0.45, y - r * 0.2, r * 0.85, 0, TAU, true); ctx.fillStyle = '#F2EDD8'; ctx.fill('evenodd'); ctx.restore(); }
/** the lifting scene: Krishna at kx with the hill on his finger; lift 0..1 (0 = hill on the ground), crowd under, rain */
function liftScene(t, lift, o = {}) {
  const kx = o.kx ?? 540, kh = o.kh ?? 520, s = kh / 640, armDeg = lerp(30, 180, eio(clamp(lift * 1.4)));
  const hand = [kx + 30 * s - 220 * s * Math.sin(rad(-armDeg)), 1500 - 440 * s + 220 * s * Math.cos(rad(-armDeg))];
  const hs = o.hs ?? 1.05, hx = kx + 30 * s, hy = lerp(1500, hand[1] - 40 * s, eio(lift));
  if (o.crowd) for (let i = 0; i < 6; i++) { const x = [120, 250, 380, 700, 830, 960][i]; const enter = clamp(o.crowd * 1.2 - i * 0.04); const xx = lerp(x < 540 ? -200 : 1280, x, eo(enter)); if (i === 1) cowF(xx, 1530, 0.55); else if (i === 4) cowF(xx, 1530, -0.55); else villager(i, xx, 1530, 380, { dir: x < 540 ? 1 : -1, arm: 160, back: 150 }); }
  hill(hx, hy, hs, { under: lift > 0.3 });
  person({ ...KR, x: kx, y: 1500, h: kh, halo: o.halo ?? 1, arm: armDeg, finger: lift > 0.5, back: 15 });
  if (o.rain) rain(t, o.rain, 150, -100, W + 100, -100, 1600, (x) => (lift > 0.5 ? (Math.abs(x - hx) < 480 * hs ? hillTop(hx, hy, hs, x) : 1e9) : 1e9));
  return { hx, hy, hand };
}

export function buildShots() {
  const S = [], CUES = [], add = (o) => (S.push(o), o), cue = (t, type, o = {}) => CUES.push({ t: +t.toFixed(3), type, ...o });
  const OFF = 2;
  const at = (i) => L(i + OFF) - 0.08;
  const w = (word, i) => Wd(word, i + OFF) - at(i);
  const pop = (lt, a, dur = 0.35) => (lt > a ? eob(seg(lt, a, a + dur)) : 0);
  const shot = (i, o) => { const st = at(i); add({ id: `S${String(i).padStart(2, '0')}`, at: st, ...o }); cue(st, 'whoosh', { gain: 0.5 }); return st; };
  const sub = (id, st, o) => { add({ id, at: st, ...o }); cue(st, 'whoosh', { gain: 0.45 }); return st; };

  // H0a · hook: Krishna holds the hill up in the storm, "seven days"
  { const sa = Wd('सात', 0); add({ id: 'H0a', at: 0, cam: [540, 800], zoom: 0.12, note: 'hook: storm, Krishna holds Govardhan up, people under, slip SAAT DIN', draw(lt, d, t) {
    stormPage(40, 0.9); stormSky(t, 1); bolt(820, 120, 0.7, lt > 0.6 && lt < 0.85 ? 1 : 0);
    liftScene(t, 1, { crowd: 1, rain: 1 });
    K.slip('सात दिन', 860, 1050, pop(lt, sa), 0.04, 54);
  } }); cue(0.05, 'whoosh', { gain: 0.5 }); cue(0.6, 'slam', { gain: 0.35 }); cue(0.1, 'sizzle', { dur: 2.5, gain: 0.25 }); cue(sa, 'pop'); }
  // H0b · close on the finger, big ?
  { const st = Wd('पूरा', 0) - 0.08, ky = Wd('क्यों', 0) - st; add({ id: 'H0b', at: st, cam: [560, 700], zoom: 0.14, note: 'hook close: the hill on one finger, rain bouncing, big ?', draw(lt, d, t) {
    stormPage(41, 0.9); stormSky(t, 1, -60);
    ctx.save(); ctx.translate(540, 600); ctx.scale(1.5, 1.5); ctx.translate(-540, -600); liftScene(t, 1, { rain: 1 }); ctx.restore();
    K.slip('?', 880, 300, pop(lt, ky, 0.4), 0.08, 140);
  } }); cue(st, 'whoosh', { gain: 0.5 }); cue(st + ky, 'pop'); }
  // H1 · "no? come, I'll tell you"
  { const st = L(1) - 0.08, ai = Wd('आइए', 1) - st; add({ id: 'H1', at: st, cam: [540, 1000], zoom: 0.1, note: 'hook: Krishna with flute before Govardhan, cows, title ribbon', draw(lt, d, t) {
    skyPage(42); heavenClouds(t); hill(540, 1420, 1.0); cloudGround(1480);
    cowF(220, 1520, 0.7); cowF(880, 1520, -0.7);
    person({ ...KR, x: 540, y: 1520, h: 600, halo: 1, arm: 120, hold: flute });
    K.ribbon('गोवर्धन पर्वत', 540, 300, pop(lt, 0.05, 0.45), 80);
    sparkles(540, 900, 300, t, pop(lt, ai));
  } }); cue(st + 0.05, 'pop', { gain: 0.6 }); cue(st + ai, 'sparkle', { dur: 1 }); }

  // 0 · every year in Braj, Indra was worshipped
  { const br = w('ब्रज', 0), in_ = w('इंद्र', 0), pu = w('पूजा', 0); const st = shot(0, { cam: [540, 950], zoom: 0.1, note: 'Braj village, Indra pops on a cloud, yagya fire lights', draw(lt, d, t) {
    skyPage(1); village(t); cloudGround(1490);
    K.ribbon('ब्रज', 540, 300, pop(lt, br, 0.45), 90);
    const a = pop(lt, in_ - 0.1, 0.45); if (a > 0) { ctx.save(); ctx.globalAlpha = a; cloud(780, 760, 1.2); person({ ...INDRA, x: 780, y: 740, h: 380 * a, halo: 0.8, arm: 120, hold: (x, y) => vajra(x, y - 20, 0.7) }); ctx.restore(); }
    kund(420, 1560, 1.1, t, pop(lt, pu - 0.1, 0.5));
  } }); cue(st + br, 'pop', { gain: 0.6 }); cue(st + in_, 'sparkle', { dur: 0.8 }); cue(st + pu, 'sizzle', { dur: 0.8, gain: 0.3 }); }

  // 1 · so that it rains and the fields stay green
  { const va = w('वर्षा', 1), ha = w('हरे', 1); const st = shot(1, { cam: [540, 1100], zoom: 0.1, note: 'gentle rain on fields, sprouts grow green', draw(lt, d, t) {
    skyPage(2); cloud(300, 450, 1.1); cloud(800, 380, 0.9);
    rain(t, pop(lt, va - 0.2, 0.5), 70, 100, 1100, 480, 1400, null, 1.2, 'rgba(70,110,160,0.6)');
    ground(1350, '#B8A070');
    const g = eo(seg(lt, ha - 0.4, ha + 0.4)); for (let i = 0; i < 9; i++) { const x = 90 + i * 112, hh = 40 + g * 170; cut(P_poly([[x - 10, 1360], [x - 40, 1360 - hh], [x, 1360 - hh * 0.6], [x + 40, 1360 - hh], [x + 10, 1360]]), i % 2 ? C.leaf : GV.hill2, { shadow: 0.3, edge: 3 }); }
    K.slip('हरे खेत', 540, 900, pop(lt, ha), -0.02, 60);
  } }); cue(st + va, 'bubbles', { dur: 1, gain: 0.25 }); cue(st + ha, 'sparkle', { dur: 0.7 }); }

  // 2 · once seven-year-old Kanha asked Nanda Baba
  { const ka = w('कान्हा', 2), ba = w('बाबा', 2); const st = shot(2, { cam: [540, 1050], zoom: 0.1, note: 'little Krishna walks up to Nanda Baba', draw(lt, d, t) {
    skyPage(3); village(t); cloudGround(1490);
    person({ ...NANDA, x: 760, y: 1520, h: 680, dir: -1, arm: 20 });
    const k = eo(seg(lt, 0, ka + 0.4)); person({ ...KR, x: lerp(-100, 380, k), y: 1520, h: 420, halo: 0.8, arm: lerp(10, 100, seg(lt, ba, ba + 0.4)), bob: -Math.abs(Math.sin(t * 9)) * 12 * (k < 1 ? 1 : 0) });
    K.slip('सात साल', 330, 760, pop(lt, ka), -0.03, 50); K.slip('नंद बाबा', 760, 520, pop(lt, ba), 0.03, 50);
  } }); cue(st + ba, 'pop'); }

  // 3 · "Baba, who is this puja for?"
  { const ki = w('किसके', 3); const st = shot(3, { cam: [540, 1150], zoom: 0.12, note: 'Krishna points at the yagya fire, big ?', draw(lt, d, t) {
    skyPage(4); cloudGround(1490);
    kund(600, 1500, 1.4, t, 1);
    person({ ...KR, x: 250, y: 1520, h: 460, halo: 0.8, arm: lerp(20, 95, eo(seg(lt, 0.1, 0.5))) });
    person({ ...NANDA, x: 920, y: 1520, h: 640, dir: -1, arm: 30 });
    K.slip('?', 600, 760, pop(lt, ki, 0.4), 0.08, 140);
  } }); cue(st + ki, 'pop'); }

  // 4 · our cows graze on Govardhan
  { const ga = w('गायें', 4), go = w('गोवर्धन', 4); const st = shot(4, { cam: [540, 1100], zoom: 0.08, note: 'Govardhan hill rises, cows grazing at its foot', draw(lt, d, t) {
    skyPage(5); heavenClouds(t);
    const h = eob(seg(lt, go - 0.3, go + 0.3)); hill(540, 1480, 1.05 * Math.max(0.0001, h)); cloudGround(1490);
    const c = pop(lt, ga - 0.2, 0.4); if (c > 0) { cowF(200, 1540, 0.8 * c); cowF(560, 1560, -0.7 * c); cowF(900, 1540, -0.8 * c); }
    K.slip('गोवर्धन', 540, 520, pop(lt, go), -0.02, 60);
  } }); cue(st + ga, 'plop'); cue(st + go, 'thud', { gain: 0.5 }); }

  // 5 · grass, water and shade
  { const gh = w('घास', 5), pa = w('पानी', 5), ch = w('छाया', 5); const st = shot(5, { cam: [540, 1000], zoom: 0.1, note: 'three gifts of the hill: grass tufts, a stream, a shady tree', draw(lt, d, t) {
    skyPage(6); hill(540, 1450, 1.0);
    const a = pop(lt, gh, 0.4), b = pop(lt, pa, 0.4), c = pop(lt, ch, 0.4);
    if (b > 0) { ctx.save(); ctx.globalAlpha = b; cut(() => { ctx.beginPath(); ctx.moveTo(520, 1080); ctx.bezierCurveTo(600, 1200, 460, 1300, 560, 1450); ctx.lineTo(640, 1450); ctx.bezierCurveTo(540, 1300, 680, 1200, 560, 1080); ctx.closePath(); }, GV.water[0], { shadow: 0.3, edge: 3 }); ctx.restore(); }
    if (a > 0) for (let i = 0; i < 5; i++) { const x = 150 + i * 60; cut(P_poly([[x - 20, 1460], [x - 30, 1460 - 80 * a], [x, 1460 - 40 * a], [x + 30, 1460 - 80 * a], [x + 20, 1460]]), GV.hill2, { shadow: 0.3, edge: 3 }); }
    if (c > 0) { ctx.save(); ctx.translate(880, 1470); ctx.scale(c, c); cut(P_rr(-25, -260, 50, 260, 10), P.sepia); for (const [px, py, r] of [[0, -340, 130], [-100, -280, 90], [100, -280, 90]]) cut(P_circ(px, py, r), P.forest, { shadow: 0.4, edge: 4 }); ctx.restore(); ctx.save(); ctx.globalAlpha = 0.25 * c; ell(880, 1480, 200, 30, P.ink); ctx.restore(); }
    cloudGround(1490);
    K.slip('घास', 220, 600, a, -0.04, 54); K.slip('पानी', 540, 500, b, 0.02, 54); K.slip('छाया', 860, 620, c, 0.04, 54);
  } }); cue(st + gh, 'pop'); cue(st + pa, 'pop'); cue(st + ch, 'pop'); }

  // 6 · so the puja should be for the hill
  { const us = w('उसी', 6); const st = shot(6, { cam: [540, 1050], zoom: 0.1, note: 'Krishna points at the hill, a garland lands on it', draw(lt, d, t) {
    skyPage(7); heavenClouds(t); hill(640, 1450, 0.85); cloudGround(1490);
    person({ ...KR, x: 200, y: 1520, h: 500, halo: 0.9, arm: lerp(20, 110, eo(seg(lt, 0.1, 0.5))) });
    const g = eob(seg(lt, us - 0.2, us + 0.4)); if (lt > us - 0.2) { glow(640, 1150, 260, g * 0.6); garland(640, lerp(500, 1000, g), 1.3, 1); }
  } }); cue(st + us, 'sparkle', { dur: 0.9 }); }

  // 7 · the people agreed
  { const ma = w('मानी', 7); const st = shot(7, { cam: [540, 1100], zoom: 0.12, note: 'villagers nod and raise their hands in agreement', draw(lt, d, t) {
    skyPage(8); village(t); cloudGround(1490);
    const r = eob(seg(lt, ma - 0.3, ma + 0.2));
    for (let i = 0; i < 5; i++) villager(i, 140 + i * 200, 1540, 520 - (i % 2) * 40, { arm: lerp(15, 150, r), dir: i < 2 ? 1 : -1, bob: -Math.abs(Math.sin(t * 6 + i)) * 10 * r });
  } }); cue(st + ma, 'pop'); }

  // 8 · and offered the hill a feast
  { const bh = w('भोग', 8), pk = w('पकवानों', 8); const st = shot(8, { cam: [540, 1150], zoom: 0.1, note: 'annakut: plates of food heap up before the hill, petals', draw(lt, d, t) {
    skyPage(9); hill(540, 1300, 0.9); cloudGround(1340);
    const p = eo(seg(lt, pk - 0.2, bh + 0.3)); thali(300, 1470, 1.1, p); thali(540, 1520, 1.3, p); thali(780, 1470, 1.1, p);
    petals(540, 1300, seg(lt, bh, bh + 1.0), 3); glow(540, 1350, 300, pop(lt, bh) * 0.5);
    K.slip('भोग', 540, 520, pop(lt, bh), -0.02, 60);
  } }); cue(st + bh, 'sparkle', { dur: 1 }); }

  // 9 · Indra was furious
  { const kr = w('क्रोध', 9); const st = shot(9, { cam: [540, 950], zoom: 0.12, note: 'Indra on his cloud throne, red flush and shaking at KRODH', draw(lt, d, t) {
    skyPage(10, '#D9C79A'); heavenClouds(t);
    const r = pop(lt, kr - 0.1, 0.4), k = r > 0 ? Math.sin(t * 30) * 6 : 0;
    elephant(260, 1350, 0.75);
    cloud(700, 1300, 1.6); person({ ...INDRA, x: 700 + k, y: 1290, h: 680, halo: 0.7, arm: lerp(40, 170, r), hold: (x, y) => vajra(x, y - 20, 1.1) });
    wash(P.crimson, 0.18 * r); if (r > 0) { ctx.save(); ctx.globalAlpha = r; line([[560, 460], [600, 520], [570, 560], [620, 620]], P.crimson, 12); line([[850, 460], [810, 520], [840, 560], [790, 620]], P.crimson, 12); ctx.restore(); }
  } }); cue(st + kr, 'slam', { gain: 0.5 }); }

  // 10 · he sent the clouds of doom
  { const pr = w('प्रलय', 10), ba = w('बादल', 10); const st = shot(10, { cam: [540, 900], zoom: 0.1, note: 'dark storm clouds roll in over the village, sky darkens', draw(lt, d, t) {
    const k = eio(seg(lt, 0, ba + 0.5)); stormPage(11, k); village(t); cloudGround(1490);
    stormSky(t, 1, lerp(-900, 0, k));
    K.slip('प्रलय', 540, 760, pop(lt, pr), -0.03, 64);
  } }); cue(st + 0.1, 'slide', { dur: 1.2, gain: 0.5 }); cue(st + ba, 'slam', { gain: 0.35 }); }

  // 11 · torrential rain, lightning and hail
  { const mu = w('मूसलाधार', 11), bi = w('बिजली', 11), ol = w('ओले', 11); const st = shot(11, { cam: [540, 900], zoom: 0.12, note: 'storm: heavy rain, a lightning bolt on BIJLI, hailstones on OLE', draw(lt, d, t) {
    stormPage(12, 1); stormSky(t, 1); village(t); cloudGround(1490);
    rain(t, pop(lt, mu - 0.2, 0.3), 220);
    const fl = lt > bi && lt < bi + 0.35 ? 1 : 0; wash('#FFF6D8', fl * 0.35); bolt(640, 420, 0.9, fl);
    hail(t, pop(lt, ol - 0.1, 0.3), 26);
  } }); cue(st + mu, 'sizzle', { dur: 1.5, gain: 0.35 }); cue(st + bi, 'slam', { gain: 0.6 }); cue(st + ol, 'tock', { gain: 0.5 }); cue(st + ol + 0.12, 'tock', { gain: 0.4 }); }

  // 12 · all of Braj began to drown
  { const du = w('डूबने', 12); const st = shot(12, { cam: [540, 1100], zoom: 0.1, note: 'flood water rises over the huts', draw(lt, d, t) {
    stormPage(13, 1); stormSky(t, 1); village(t);
    water(t, lerp(1520, 1180, eio(seg(lt, 0, d))));
    rain(t, 1, 180);
  } }); cue(st + du, 'bubbles', { dur: 1.2, gain: 0.4 }); }

  // 13 · everyone, with their cows, came to Kanha for refuge
  { const ga = w('गायों', 13), sh = w('शरण', 13); const st = shot(13, { cam: [540, 1100], zoom: 0.1, note: 'villagers and cows hurry through the rain toward glowing Krishna', draw(lt, d, t) {
    stormPage(14, 1); stormSky(t, 1); cloudGround(1490);
    person({ ...KR, x: 860, y: 1520, h: 480, dir: -1, halo: lerp(0.6, 1, pop(lt, sh)), arm: lerp(15, 70, pop(lt, sh)) }); glow(860, 1150, 320, 0.5 * pop(lt, sh));
    const k = eo(seg(lt, 0, d)); const off = lerp(-500, 0, k);
    villager(0, 120 + off, 1540, 480, { arm: 160, back: 160, bob: -Math.abs(Math.sin(t * 9)) * 12 }); cowF(330 + off, 1550, 0.6 * pop(lt, ga - 0.3, 0.3)); villager(1, 520 + off, 1540, 440, { arm: 160, back: 150, bob: -Math.abs(Math.sin(t * 9 + 1)) * 12 });
    rain(t, 1, 180);
  } }); cue(st + ga, 'plop'); cue(st + sh, 'sparkle', { dur: 0.9 }); }

  // 14 · Kanha smiled (runs into the start of the next line)
  { const st = shot(14, { cam: [540, 800], zoom: 0.14, note: 'close: Krishna glowing calm in the rain, sparkles, looks up at the hill', draw(lt, d, t) {
    stormPage(15, 1); stormSky(t, 1);
    hill(820, 1500, 1.0); cloudGround(1490);
    person({ ...KR, x: 420, y: 1700, h: 980, halo: 1, arm: 20 });
    sparkles(420, 820, 230, t, pop(lt, 0.2)); rain(t, 1, 160);
  } }); cue(st + 0.2, 'sparkle', { dur: 1 }); }

  // 15 · lifted the whole Govardhan on his finger, as if at play
  { const st = Wd('पूरा', 17) - 0.08, go = Wd('गोवर्धन', 17) - st, un = Wd('उंगली', 17) - st; sub('S15', st, { cam: [540, 900], zoom: 0.08, note: 'the hill rises off the ground onto Krishna\'s little finger', draw(lt, d, t) {
    stormPage(16, 1); stormSky(t, 1); cloudGround(1490);
    liftScene(t, eio(seg(lt, go - 0.3, un + 0.3)), { rain: 1 });
    K.slip('उंगली', 860, 1080, pop(lt, un), 0.04, 54);
  } }); cue(st + go - 0.2, 'slide', { dur: 1.0, gain: 0.5 }); cue(st + un, 'thud', { gain: 0.5 }); }

  // 16 · the hill became a giant umbrella
  { const ch = w('छाता', 16); const st = shot(16, { cam: [540, 800], zoom: 0.1, note: 'wide: the hill as an umbrella, rain stops on top of it', draw(lt, d, t) {
    stormPage(17, 1); stormSky(t, 1); cloudGround(1490);
    const sc = liftScene(t, 1, { rain: 1 });
    ctx.save(); ctx.globalAlpha = 0.35 * pop(lt, ch); ctx.strokeStyle = P.gold; ctx.lineWidth = 10; ctx.setLineDash([20, 16]); ctx.beginPath(); ctx.ellipse(sc.hx, sc.hy + 40, 520, 120, 0, 0, Math.PI); ctx.stroke(); ctx.restore();
    K.slip('छाता', 860, 1080, pop(lt, ch), 0.04, 56);
  } }); cue(st + ch, 'pop'); }

  // 17 · all the people and cows came under it
  { const ni = w('नीचे', 17); const st = shot(17, { cam: [540, 1000], zoom: 0.1, note: 'people and cows walk in under the hill from both sides', draw(lt, d, t) {
    stormPage(18, 1); stormSky(t, 1); cloudGround(1490);
    liftScene(t, 1, { rain: 1, crowd: eo(seg(lt, 0, ni + 0.3)) });
  } }); cue(st + ni, 'sparkle', { dur: 0.8 }); }

  // 18 · seven days and seven nights it rained
  { const sa = w('सात', 18); const st = shot(18, { cam: [540, 900], zoom: 0.08, note: 'day/night cycle above the umbrella, counter 1..7', draw(lt, d, t) {
    stormPage(19, 1);
    const p = eio(seg(lt, 0.05, d)), n = Math.min(6, Math.floor(p * 7)), ph = (p * 7) % 1;
    const ang = Math.PI * (1 - ph); const isDay = true; sun(540 + Math.cos(ang) * 420, 560 - Math.sin(ang) * 280, 60, t, 0.7); moon(540 - Math.cos(ang) * 420, 560 + Math.sin(ang) * 280 * -1 + 0, 50, 0.9);
    stormSky(t, 1); cloudGround(1490);
    liftScene(t, 1, { rain: 1, crowd: 1 });
    bigText(['१', '२', '३', '४', '५', '६', '७'][n], 900, 1010, 150, P.crimson, pop(lt, sa - 0.2));
  } }); { const dd = Le(18 + OFF) - st; for (let k = 1; k <= 7; k++) cue(st + 0.05 + k * (dd - 0.05) / 7, 'tock', { gain: 0.55 }); } }

  // 19 · but Kanha did not move the hill one bit
  { const hi = w('हिलाया', 19); const st = shot(19, { cam: [560, 650], zoom: 0.12, note: 'close on the steady finger under the hill, gold plumb line', draw(lt, d, t) {
    stormPage(20, 1); stormSky(t, 1);
    ctx.save(); ctx.translate(540, 700); ctx.scale(1.35, 1.35); ctx.translate(-540, -700); const sc = liftScene(t, 1, { rain: 1 }); ctx.restore();
    if (lt > hi - 0.3) { ctx.save(); ctx.globalAlpha = pop(lt, hi - 0.3); ctx.setLineDash([18, 14]); ctx.strokeStyle = P.gold; ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(240, 300); ctx.lineTo(240, 1150); ctx.stroke(); ctx.restore(); }
    K.slip('अटल', 860, 1100, pop(lt, hi), 0.04, 56);
  } }); cue(st + hi, 'thud', { gain: 0.4 }); }

  // 20 · no hunger, no thirst, no fatigue
  { const bk = w('भूख', 20), py = w('प्यास', 20), th = w('थकान', 20); const st = shot(20, { cam: [540, 950], zoom: 0.08, note: 'three slips crossed out: hunger, thirst, tiredness; Krishna small below', draw(lt, d, t) {
    stormPage(21, 0.9); stormSky(t, 1); cloudGround(1490); liftScene(t, 1, { rain: 1, crowd: 1 });
    const items = [['भूख', 220, 300, bk], ['प्यास', 540, 230, py], ['थकान', 860, 300, th]];
    for (const [tx, x, y, wt] of items) { K.slip(tx, x, y, pop(lt, wt), 0.02, 62); if (lt > wt + 0.15) { ctx.save(); ctx.translate(x, y); ctx.scale(0.55, 0.55); bigCross(0, 0, eo(seg(lt, wt + 0.15, wt + 0.45))); ctx.restore(); } }
  } }); cue(st + bk, 'pop'); cue(st + py, 'pop'); cue(st + th, 'pop'); }

  // 21 · at last Indra's pride broke
  { const gh = w('घमंड', 21), tu = w('टूट', 21); const st = shot(21, { cam: [540, 950], zoom: 0.1, note: 'Indra on his cloud, his vajra cracks in two, he lowers his arm', draw(lt, d, t) {
    stormPage(22, 0.6); stormSky(t, 1);
    const c = eob(seg(lt, tu - 0.1, tu + 0.4));
    cloud(540, 1350, 1.8); person({ ...INDRA, x: 540, y: 1340, h: 720, halo: 0.5, arm: lerp(150, 30, c), hold: (x, y) => vajra(x, y - 20, 1.2, 0, c) });
    K.slip('घमंड', 540, 460, pop(lt, gh), -0.03, 60);
  } }); cue(st + tu, 'slam', { gain: 0.6 }); }

  // 22 · the clouds went back and the sun came out
  { const lo = w('लौट', 22), dh = w('धूप', 22); const st = shot(22, { cam: [540, 900], zoom: 0.08, note: 'storm clouds slide away, sun rises with rays', draw(lt, d, t) {
    const k = eio(seg(lt, lo - 0.3, dh + 0.3)); skyPage(23); wash(C.dusk, 0.55 * (1 - k));
    sun(540, lerp(900, 480, eo(seg(lt, dh - 0.3, dh + 0.6))), 90, t, pop(lt, dh - 0.3, 0.6));
    stormSky(t, 1, k * 1300);
    cloudGround(1490); liftScene(t, 1, { crowd: 1 });
  } }); cue(st + lo, 'slide', { dur: 1, gain: 0.4 }); cue(st + dh, 'sparkle', { dur: 1 }); }

  // 23 · Kanha gently put the hill back
  { const va = w('वापस', 23); const st = shot(23, { cam: [540, 1000], zoom: 0.08, note: 'the hill lowers back to the ground, people cheer', draw(lt, d, t) {
    skyPage(24); heavenClouds(t); sun(860, 380, 70, t, 0.8);
    const l = 1 - eio(seg(lt, 0.2, va + 0.4));
    cloudGround(1490); liftScene(t, l, { crowd: 1 });
  } }); cue(st + va + 0.3, 'thud', { gain: 0.5 }); }

  // 24 · Indra came himself and begged forgiveness
  { const sv = w('स्वयं', 24), ks = w('क्षमा', 24); const st = shot(24, { cam: [540, 1100], zoom: 0.1, note: 'Indra descends with Airavata and bows, hands folded, before Krishna', draw(lt, d, t) {
    skyPage(25); heavenClouds(t); cloudGround(1490);
    person({ ...KR, x: 300, y: 1520, h: 520, halo: 1, arm: 40, hold: flute });
    const dsc = eo(seg(lt, 0, sv + 0.4)), b = eio(seg(lt, ks - 0.5, ks + 0.2));
    elephantF(1000, lerp(900, 1520, dsc), 0.55, -1);
    ctx.save(); ctx.translate(730, lerp(1000, 1520, dsc)); ctx.rotate(-b * 0.25); person({ ...INDRA, x: 0, y: 0, h: 640, dir: -1, halo: 0.4, arm: lerp(10, 110, b), back: lerp(10, 110, b) }); ctx.restore();
    K.slip('क्षमा', 730, 520, pop(lt, ks), 0.03, 60);
  } }); cue(st + ks, 'pop'); }

  // 25 · Surabhi the cow bathed Kanha in milk
  { const su = w('सुरभि', 25), ab = w('अभिषेक', 25); const st = shot(25, { cam: [540, 1050], zoom: 0.1, note: 'Surabhi cow on a cloud pours a milk stream over Krishna, petals', draw(lt, d, t) {
    skyPage(26); heavenClouds(t); glow(540, 900, 500, 0.5); cloudGround(1490);
    const c = pop(lt, su - 0.1, 0.45); cloud(760, 640, 1.3 * c); if (c > 0) cowF(760, 600, 0.9 * c);
    const m = eo(seg(lt, ab - 0.3, ab + 0.3)); if (m > 0) { ctx.save(); ctx.lineCap = 'round'; ctx.strokeStyle = C.milk; ctx.lineWidth = 26; ctx.beginPath(); ctx.moveTo(640, 640); ctx.quadraticCurveTo(470, 700, lerp(640, 450, m), lerp(640, 880, m)); ctx.stroke(); ctx.restore(); for (let i = 0; i < 10; i++) { const k = (t * 1.5 + i / 10) % 1; ell(400 + rnd(i) * 100, 880 + k * 200, 9, 14, C.milk); } }
    person({ ...KR, x: 430, y: 1520, h: 640, halo: 1, arm: 40, hold: flute });
    petals(430, 1000, seg(lt, ab, ab + 1.2), 7);
  } }); cue(st + su, 'sparkle', { dur: 0.8 }); cue(st + ab, 'bubbles', { dur: 1, gain: 0.3 }); }

  // 26 · and he got the name Govinda
  { const go = w('गोविंद', 26); const st = shot(26, { cam: [540, 1050], zoom: 0.12, note: 'Krishna with flute among cows, ribbon GOVINDA', draw(lt, d, t) {
    skyPage(27); heavenClouds(t); hill(540, 1430, 0.9); cloudGround(1490);
    cowF(200, 1540, 0.7); cowF(880, 1540, -0.7);
    person({ ...KR, x: 540, y: 1520, h: 640, halo: 1, arm: 120, hold: flute });
    K.ribbon('गोविंद', 540, 330, pop(lt, go, 0.45), 110); sparkles(540, 900, 320, t, pop(lt, go));
  } }); cue(st + go, 'sparkle', { dur: 1.2 }); }

  // 27 · that's why the day after Diwali we do Govardhan Puja
  { const ag = w('अगले', 27), gp = w('गोवर्धन', 27); const st = shot(27, { cam: [540, 1150], zoom: 0.1, note: 'night: row of diyas, then the hill with annakut and a garland', draw(lt, d, t) {
    skyPage(28); wash(C.dusk, 0.5 * (1 - eo(seg(lt, ag, gp)))); hill(540, 1330, 0.85); cloudGround(1360);
    for (let i = 0; i < 5; i++) diya(140 + i * 200, 1470, 1.1 * pop(lt, 0.05 + i * 0.08, 0.3), t + i);
    const g = pop(lt, gp - 0.1, 0.4); garland(540, 820, 1.2 * g, 1); thali(540, 1350, 1.0, g);
    K.slip('गोवर्धन पूजा', 540, 450, pop(lt, gp), -0.02, 54);
  } }); cue(st + 0.05, 'sparkle', { dur: 0.8 }); cue(st + gp, 'pop'); }

  // 28 · lesson: however big the pride
  { const gh = w('घमंड', 28), ba = w('बड़ा', 28); const st = shot(28, { cam: [540, 950], zoom: 0.08, note: 'lesson card: a storm cloud labelled GHAMAND grows huge', draw(lt, d, t) {
    K.parchment(29);
    const g = lerp(1.3, 2.4, eob(seg(lt, ba - 0.2, ba + 0.4))); rain(t, 0.9, 80, 250, 830, 850, 1400, null, 1.3, 'rgba(70,90,120,0.7)'); stormCloud(540, 800, g * pop(lt, 0.05, 0.4));
    K.slip('घमंड', 540, 420, pop(lt, gh), -0.03, 64);
  } }); cue(st + ba, 'slam', { gain: 0.35 }); }

  // 29 · no one can drown those who take refuge in God (loops back to the umbrella)
  { const sh = w('शरण', 29), du = w('डुबो', 29); shot(29, { cam: [540, 900], zoom: 0.12, note: 'the umbrella hill over the crowd in the rain, ribbon SHARAN', draw(lt, d, t) {
    stormPage(30, 0.8); stormSky(t, 1); cloudGround(1490);
    liftScene(t, 1, { rain: 1, crowd: 1 });
    K.ribbon('शरण', 540, 1080, pop(lt, sh, 0.45), 90);
    sparkles(540, 1250, 320, t, pop(lt, du));
  } }); }

  return { shots: S, cues: CUES };
}
