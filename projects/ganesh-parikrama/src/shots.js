// GANESH PARIKRAMA: the shot list (Katha style, Hindi). Everything is cut paper on parchment.
// Deities are drawn simply and respectfully: no faces. Kit copied from samudra-manthan + new beings below.
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
/** a figure standing on (x, y). o = { h, dir, skin, robe, trim, head: 'crown'|'jata'|'sage'|'asura'|'bun'|'none',
 *  arm (front arm deg), back (back arm deg), arms4, halo 0..1, hold: fn(hx, hy) for the front hand, holdBack, holdUp1, holdUp2, sari, bob } */
function person(o) {
  const h = o.h || 640, d = o.dir || 1, s = h / 640;
  ctx.save(); ctx.translate(o.x, o.y + (o.bob || 0)); ctx.scale(s * d, s);
  const skin = o.skin || P.skin, robe = o.robe || P.wine, trim = o.trim || P.gold;
  if (o.halo > 0) { ctx.save(); ctx.globalAlpha = clamp(o.halo); const g = ctx.createRadialGradient(0, -540, 40, 0, -540, 190); g.addColorStop(0, 'rgba(242,200,90,0.9)'); g.addColorStop(1, 'rgba(242,200,90,0)'); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, -540, 190, 0, TAU); ctx.fill(); cut(P_circ(0, -545, 112), '#E2B44E', { shadow: 0.2, edge: 4 }); ctx.restore(); }
  if (o.arms4) { const a = arm(-40, -440, -150, skin, 200); o.holdUp1 && o.holdUp1(a[0], a[1]); }
  const bh = arm(-30, -440, o.back ?? 10, skin); if (o.holdBack) o.holdBack(bh[0], bh[1]);
  // body: a robe / dhoti with an uttariya sash
  if (o.sari) cut(P_poly([[-70, -470], [70, -470], [125, 0], [-125, 0]]), robe);
  else { cut(P_poly([[-72, -470], [72, -470], [80, -250], [-80, -250]]), skin); cut(P_poly([[-85, -260], [85, -260], [110, 0], [-110, 0]]), robe); }
  cut(P_poly([[-72, -470], [-30, -470], [80, -280], [40, -260]]), o.sari ? trim : robe, { shadow: 0.4, edge: 3 });
  rr(-85, -275, 170, 24, 8); ctx.fillStyle = trim; ctx.fill();
  // necklace
  if (o.head !== 'sage' && o.head !== 'asura') { ctx.beginPath(); ctx.arc(0, -470, 55, 0.15 * Math.PI, 0.85 * Math.PI); ctx.strokeStyle = P.gold; ctx.lineWidth = 9; ctx.stroke(); }
  // head
  const hd = o.head || 'none';
  if (hd === 'jata') cut(P_rr(-60, -700, 120, 120, 50), C.hair, { shadow: 0.4, edge: 4 });
  if (hd === 'bun') cut(P_circ(-45, -590, 42), C.hair, { shadow: 0.4, edge: 4 });
  if (hd === 'sage') cut(P_circ(0, -610, 52), C.white, { shadow: 0.4, edge: 4 });
  cut(P_circ(0, -540, 66), skin);
  if (o.throat) { ctx.save(); ctx.globalAlpha = clamp(o.throat); rr(-26, -490, 52, 30, 10); ctx.fillStyle = C.throat; ctx.fill(); ctx.restore(); }
  if (hd === 'crown') { cut(P_poly([[-58, -580], [-62, -660], [-30, -640], [0, -700], [30, -640], [62, -660], [58, -580]]), P.gold, { shadow: 0.5, edge: 4 }); circle(0, -625, 10, P.crimson); }
  if (hd === 'jata') { ctx.save(); ctx.beginPath(); ctx.arc(20, -690, 26, rad(-60), rad(160)); ctx.arc(30, -700, 20, rad(160), rad(-60), true); ctx.closePath(); ctx.fillStyle = C.white; ctx.fill(); ctx.restore(); }
  if (hd === 'bun') { cut(P_poly([[-50, -590], [-30, -640], [0, -615], [30, -640], [50, -590]]), P.gold, { shadow: 0.3, edge: 3 }); }
  if (hd === 'sage') cut(P_poly([[-46, -510], [46, -510], [0, -380]]), C.white, { shadow: 0.4, edge: 4 });
  if (hd === 'asura') { cut(P_poly([[-66, -560], [-50, -640], [-20, -600], [0, -650], [20, -600], [50, -640], [66, -560], [0, -590]]), P.ink, { shadow: 0.4, edge: 3 }); for (const k of [-1, 1]) cut(P_poly([[k * 40, -598], [k * 72, -660], [k * 58, -592]]), '#EBDDBE', { shadow: 0.3, edge: 3 }); }
  if (hd === 'deva') cut(P_rr(-50, -615, 100, 34, 10), P.gold, { shadow: 0.3, edge: 3 });
  if (o.arms4) { const a = arm(40, -440, 150, skin, 200); o.holdUp2 && o.holdUp2(a[0], a[1]); }
  const fh = arm(30, -440, o.arm ?? 10, skin); rr(15, -400, 30, 14, 5); ctx.fillStyle = P.gold; ctx.fill();
  if (o.hold) o.hold(fh[0], fh[1]);
  ctx.restore();
}
const VISHNU = { skin: C.vishnu, robe: '#E0B23C', trim: P.crimson, head: 'crown' };
const SHIVA = { skin: C.shiva, robe: '#A88A62', trim: P.ink, head: 'jata' };
const DEVA = { skin: P.skin, robe: P.royal, trim: P.gold, head: 'deva' };
const ASURA = { skin: C.asura, robe: '#5A2A2A', trim: P.ink, head: 'asura' };
const INDRA = { skin: P.skin, robe: P.royal, trim: P.gold, head: 'crown' };
const SAGE = { skin: P.skin, robe: C.saffron, trim: P.sepia, head: 'sage' };
const LAKSHMI = { skin: P.skin, robe: P.crimson, trim: P.gold, head: 'bun', sari: true };
const PARVATI = { skin: P.skin, robe: P.green, trim: P.gold, head: 'bun', sari: true };
const MOHINI = { skin: P.skin, robe: P.wine, trim: P.gold, head: 'bun', sari: true };

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
function mountain(x, y, s = 1) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  cut(P_poly([[-230, 0], [-40, -900], [40, -900], [230, 0]]), P.stone);
  cut(P_poly([[0, -900], [40, -900], [230, 0], [60, 0]]), P.stoneDark, { shadow: 0, edge: 0 });
  for (const [px, py, r] of [[-20, -880, 60], [40, -860, 50], [-60, -790, 45]]) cut(P_circ(px, py, r), P.forest, { shadow: 0.3, edge: 3 });
  ctx.restore();
}
/** Vasuki's coils around the mountain: p 0..1 how many coils are drawn; rot shifts them (the churning turn) */
function coils(x, y, s, p = 1, rot = 0) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  const n = 5; for (let i = 0; i < Math.ceil(n * clamp(p)); i++) { const yy = -260 - i * 110 + ((rot * 110) % 110); const hw = 230 * (1 - (-yy) / 900) + 26; const k = clamp(n * p - i);
    cut(() => { ctx.beginPath(); ctx.moveTo(-hw, yy + 34); ctx.lineTo(-hw + 2 * hw * k, yy - 34 + 68 * (1 - k)); ctx.lineTo(-hw + 2 * hw * k, yy - 34 + 68 * (1 - k) - 44); ctx.lineTo(-hw, yy - 10); ctx.closePath(); }, i % 2 ? '#5E7A3C' : '#6F8A4A', { shadow: 0.5, edge: 3 }); }
  ctx.restore();
}
/** a thick snake body along pts, head at the LAST point (or none) */
function snake(pts, w = 44, head = true, col = '#6F8A4A') {
  ctx.save(); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  const path = () => { ctx.beginPath(); pts.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); };
  ctx.shadowColor = 'rgba(70,45,20,0.35)'; ctx.shadowBlur = 12; ctx.shadowOffsetY = 8; path(); ctx.strokeStyle = col; ctx.lineWidth = w; ctx.stroke(); ctx.shadowColor = 'transparent';
  path(); ctx.strokeStyle = P.edge; ctx.lineWidth = w + 8; ctx.globalCompositeOperation = 'destination-over'; ctx.stroke(); ctx.globalCompositeOperation = 'source-over';
  path(); ctx.setLineDash([10, 26]); ctx.strokeStyle = '#4F6D33'; ctx.lineWidth = w * 0.35; ctx.stroke(); ctx.setLineDash([]);
  ctx.restore();
  if (head) { const [a, b] = [pts[pts.length - 2], pts[pts.length - 1]], ang = Math.atan2(b[1] - a[1], b[0] - a[0]); ctx.save(); ctx.translate(b[0], b[1]); ctx.rotate(ang); cut(() => { ctx.beginPath(); ctx.ellipse(20, 0, 60, 46, 0, 0, TAU); }, col, { shadow: 0.5, edge: 4 }); circle(40, -18, 7, P.ink); circle(40, 18, 7, P.ink); ctx.restore(); }
}
function tortoise(x, y, s = 1, t = 0) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  for (const k of [-1, 1]) cut(P_rr(k * 200 - 45, -40 + Math.sin(t * 2 + k) * 8, 90, 120, 40), '#7E8B5A', { shadow: 0.5, edge: 4 });
  cut(() => { ctx.beginPath(); ctx.ellipse(330, -60, 90, 70, 0, 0, TAU); }, '#7E8B5A'); circle(370, -80, 10, P.ink);
  cut(() => { ctx.beginPath(); ctx.ellipse(0, 0, 320, 240, 0, Math.PI, TAU); ctx.closePath(); }, '#5E7A4C');
  ctx.strokeStyle = '#4A5F3A'; ctx.lineWidth = 8; for (const [a, b] of [[-200, -150], [-60, -230], [80, -225], [210, -140]]) { ctx.beginPath(); ctx.arc(a * 0.9, b * 0.6 + 20, 70, 0, TAU); ctx.stroke(); }
  cut(P_rr(-330, -20, 660, 40, 20), '#A89A5C', { shadow: 0.3, edge: 3 });
  ctx.restore();
}
function poisonCloud(x, y, s, t, a = 1) {
  if (s <= 0 || a <= 0) return; ctx.save(); ctx.globalAlpha = clamp(a); ctx.translate(x, y); ctx.scale(s, s);
  for (let i = 0; i < 9; i++) { const ang = i / 9 * TAU + t * 0.4, r = 110 + 40 * Math.sin(t * 1.3 + i); cut(P_circ(Math.cos(ang) * r, Math.sin(ang) * r * 0.7, 95 + 15 * Math.sin(t * 2 + i)), i % 2 ? C.poison : C.poison2, { shadow: 0.6, edge: 0 }); }
  cut(P_circ(0, 0, 150), C.poison, { shadow: 0, edge: 0 });
  ctx.strokeStyle = P.crimson; ctx.lineWidth = 6; for (let i = 0; i < 5; i++) { const a0 = i * 1.3 + t; ctx.beginPath(); ctx.arc(0, 0, 70 + i * 22, a0, a0 + 1.1); ctx.stroke(); }
  ctx.restore();
}
function cow(x, y, s = 1) { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); const col = '#F1EBDD'; for (const lx of [-110, -50, 60, 120]) cut(P_rr(lx - 18, -160, 36, 160, 12), lx < 0 ? '#D8D0BE' : col, { shadow: 0.4, edge: 3 }); cut(() => { ctx.beginPath(); ctx.ellipse(0, -210, 170, 85, 0, 0, TAU); }, col); cut(P_poly([[-40, -290], [0, -320], [40, -290]]), col, { shadow: 0.3, edge: 3 }); cut(() => { ctx.beginPath(); ctx.ellipse(200, -270, 55, 45, 0.3, 0, TAU); }, col); for (const k of [-1, 1]) cut(P_poly([[190 + k * 18, -310], [185 + k * 40, -380], [205 + k * 10, -310]]), P.gold, { shadow: 0.3, edge: 2 }); circle(215, -280, 7, P.ink); cut(P_rr(-60, -250, 120, 22, 8), P.crimson, { shadow: 0, edge: 2 }); ctx.restore(); }
function horse(x, y, s = 1) { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); const col = '#F4EFE2'; for (const lx of [-110, -60, 70, 120]) cut(P_rr(lx - 15, -200, 30, 200, 10), lx < 0 ? '#DCD4C2' : col, { shadow: 0.4, edge: 3 }); cut(() => { ctx.beginPath(); ctx.ellipse(0, -250, 170, 75, 0, 0, TAU); }, col); cut(P_poly([[110, -290], [190, -430], [250, -400], [170, -260]]), col); cut(() => { ctx.beginPath(); ctx.ellipse(235, -410, 70, 34, 0.5, 0, TAU); }, col); cut(P_poly([[120, -310], [170, -440], [150, -300]]), P.gold, { shadow: 0.3, edge: 2 }); circle(240, -425, 6, P.ink); ctx.restore(); }
function tree(x, y, s = 1, t = 0) { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); cut(P_rr(-30, -300, 60, 300, 10), P.sepia); for (const [px, py, r] of [[0, -420, 150], [-120, -340, 100], [120, -340, 100], [0, -300, 90]]) cut(P_circ(px, py, r), P.forest, { shadow: 0.4, edge: 4 }); for (let i = 0; i < 9; i++) glow(-150 + rnd(i) * 300, -480 + rnd(i + 4) * 220, 30, 0.7 + 0.3 * Math.sin(t * 3 + i)), circle(-150 + rnd(i) * 300, -480 + rnd(i + 4) * 220, 14, P.gold); ctx.restore(); }
function palace(x, y, s = 1, flags = 0) { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); cut(P_rr(-360, -380, 720, 380, 6), '#E2C47A'); for (const [px, r] of [[-250, 90], [0, 150], [250, 90]]) { cut(P_rr(px - r, -380 - r * 0.9, r * 2, r * 0.9 + 4, 4), '#E2C47A', { shadow: 0.3, edge: 3 }); cut(() => { ctx.beginPath(); ctx.arc(px, -380 - r * 0.9, r, Math.PI, TAU); ctx.closePath(); }, P.gold); cut(P_rr(px - 6, -380 - r * 1.9 - 60, 12, 70, 4), P.ink, { shadow: 0.3, edge: 2 }); if (flags > 0) cut(P_poly([[px + 6, -380 - r * 1.9 - 60], [px + 6 + 90 * flags, -380 - r * 1.9 - 35], [px + 6, -380 - r * 1.9 - 10]]), P.crimson, { shadow: 0.3, edge: 2 }); } for (let i = 0; i < 5; i++) { rr(-300 + i * 140, -260, 60, 260, [30, 30, 0, 0]); ctx.fillStyle = '#8A6A48'; ctx.fill(); } ctx.restore(); }
function sparkles(x, y, r, t, a = 1) { if (a <= 0) return; ctx.save(); ctx.globalAlpha = clamp(a); for (let i = 0; i < 10; i++) { const ang = i / 10 * TAU + t * 0.8, rr_ = r * (0.6 + 0.4 * rnd(i)); const px = x + Math.cos(ang) * rr_, py = y + Math.sin(ang) * rr_, k = 10 + 8 * Math.sin(t * 6 + i); ctx.fillStyle = '#F2C14E'; ctx.beginPath(); ctx.moveTo(px, py - k * 2); ctx.lineTo(px + k * 0.5, py); ctx.lineTo(px, py + k * 2); ctx.lineTo(px - k * 0.5, py); ctx.closePath(); ctx.fill(); } ctx.restore(); }
function wash(col, a) { if (a <= 0) return; ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = col; ctx.fillRect(-300, -300, W + 600, H + 600); ctx.restore(); }
function arrow(x0, y0, x1, y1, p = 1) { if (p <= 0.02) return; const x = lerp(x0, x1, p), y = lerp(y0, y1, p); line([[x0, y0], [x, y]], P.crimson, 14); const a = Math.atan2(y1 - y0, x1 - x0); cut(P_poly([[x + Math.cos(a) * 40, y + Math.sin(a) * 40], [x + Math.cos(a + 2.4) * 40, y + Math.sin(a + 2.4) * 40], [x + Math.cos(a - 2.4) * 40, y + Math.sin(a - 2.4) * 40]]), P.crimson, { shadow: 0.4, edge: 3 }); }

// ═════════════ GANESH PARIKRAMA ADDITIONS ═════════════
const G = { skin: '#D9825B', robe: '#E0B23C', trim: P.crimson, peacock: '#2F5FA8', peacock2: '#2E7D6B', mouse: '#9A8F86', snow: '#F6F1E6' };
const KARTIKEYA = { skin: P.skin, robe: P.crimson, trim: P.gold, head: 'crown' };
const SIDDHI = { skin: P.skin, robe: P.crimson, trim: P.gold, head: 'bun', sari: true };
const BUDDHI = { skin: P.skin, robe: P.green, trim: P.gold, head: 'bun', sari: true };

/** Ganesha standing on (x, y): elephant head, round belly, crown. o = { h, dir, halo, arm, back, hold, bob, trunk } */
function ganesha(o) {
  const h = o.h || 640, d = o.dir || 1, s = h / 640;
  ctx.save(); ctx.translate(o.x, o.y + (o.bob || 0)); ctx.scale(s * d, s);
  if (o.halo > 0) { ctx.save(); ctx.globalAlpha = clamp(o.halo); const g = ctx.createRadialGradient(0, -540, 40, 0, -540, 230); g.addColorStop(0, 'rgba(242,200,90,0.9)'); g.addColorStop(1, 'rgba(242,200,90,0)'); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, -540, 230, 0, TAU); ctx.fill(); cut(P_circ(0, -545, 140), '#E2B44E', { shadow: 0.2, edge: 4 }); ctx.restore(); }
  const bh = arm(-60, -430, o.back ?? 15, G.skin, 200); if (o.holdBack) o.holdBack(bh[0], bh[1]);
  cut(P_poly([[-120, -250], [120, -250], [140, 0], [-140, 0]]), G.robe);
  cut(P_poly([[-80, -470], [80, -470], [120, -300], [-120, -300]]), G.skin);
  cut(() => { ctx.beginPath(); ctx.ellipse(10, -290, 135, 115, 0, 0, TAU); }, G.skin);
  rr(-130, -245, 270, 26, 10); ctx.fillStyle = G.trim; ctx.fill();
  cut(P_poly([[-80, -470], [-40, -470], [100, -270], [60, -255]]), G.trim, { shadow: 0.4, edge: 3 });
  ctx.beginPath(); ctx.arc(0, -470, 60, 0.15 * Math.PI, 0.85 * Math.PI); ctx.strokeStyle = P.gold; ctx.lineWidth = 9; ctx.stroke();
  // head: back ear, head, trunk, tusk, crown
  cut(() => { ctx.beginPath(); ctx.ellipse(-75, -545, 70, 92, -0.15, 0, TAU); }, '#C6704C', { shadow: 0.4, edge: 4 });
  cut(P_circ(15, -560, 88), G.skin);
  const tc = o.trunk || 0;
  ctx.save(); ctx.lineCap = 'round'; const tp = () => { ctx.beginPath(); ctx.moveTo(70, -540); ctx.bezierCurveTo(120, -470, 110, -390, 70 + tc * 20, -360); ctx.quadraticCurveTo(40, -330, 55, -310); };
  tp(); ctx.strokeStyle = P.edge; ctx.lineWidth = 46; ctx.stroke(); tp(); ctx.strokeStyle = G.skin; ctx.lineWidth = 38; ctx.stroke(); ctx.restore();
  cut(P_poly([[50, -505], [95, -470], [62, -495]]), C.white, { shadow: 0.3, edge: 2 });
  cut(() => { ctx.beginPath(); ctx.ellipse(-45, -540, 44, 62, 0.1, 0, TAU); }, '#C6704C', { shadow: 0.4, edge: 4 });
  cut(P_poly([[-50, -630], [-55, -710], [-20, -690], [15, -745], [50, -690], [85, -710], [80, -630]]), P.gold, { shadow: 0.5, edge: 4 }); circle(15, -675, 11, P.crimson);
  ctx.beginPath(); ctx.moveTo(-10, -620); ctx.lineTo(40, -620); ctx.strokeStyle = P.crimson; ctx.lineWidth = 8; ctx.stroke();
  const fh = arm(55, -430, o.arm ?? 15, G.skin, 200); rr(40, -390, 30, 14, 5); ctx.fillStyle = P.gold; ctx.fill();
  if (o.hold) o.hold(fh[0], fh[1]);
  ctx.restore();
}
/** a seated figure: seat top at y. who = 'shiva'|'parvati'|ganesh-free person preset */
function seated(o) {
  const s = (o.h || 640) / 640;
  ctx.save(); ctx.beginPath(); ctx.rect(-600, -600, W + 1200, o.y - 30 * s + 600); ctx.clip();
  person({ ...o, y: o.y + 230 * s }); ctx.restore();
  cut(P_rr(o.x - 165 * s, o.y - 95 * s, 330 * s, 100 * s, 45 * s), o.sari ? o.robe : (o.robe || P.wine), { shadow: 0.5, edge: 4 });
}
function asana(x, y, s = 1) { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); cut(P_rr(-200, 0, 400, 90, 12), P.gold); cut(P_rr(-180, -24, 360, 40, 20), P.crimson, { shadow: 0.3, edge: 3 }); for (const k of [-150, 150]) cut(P_rr(k - 20, 90, 40, 50, 6), '#A87A22', { shadow: 0.3, edge: 2 }); ctx.restore(); }
/** Shiva and Parvati on their two seats (centre x, seat top y) */
function parents(x, y, s = 1, halo = 1, armUp = 0) {
  asana(x - 170 * s, y, 0.75 * s); asana(x + 170 * s, y, 0.75 * s);
  seated({ ...SHIVA, x: x - 170 * s, y: y - 18 * s, h: 520 * s, halo, arm: lerp(20, 130, armUp), back: 15 });
  seated({ ...PARVATI, x: x + 170 * s, y: y - 18 * s, h: 480 * s, halo, arm: lerp(20, 130, armUp), back: 15 });
}
function kailash(x, y, s = 1) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  cut(P_poly([[-520, 0], [-120, -760], [0, -820], [120, -760], [520, 0]]), P.stone);
  cut(P_poly([[0, -820], [120, -760], [520, 0], [160, 0]]), P.stoneDark, { shadow: 0, edge: 0 });
  cut(P_poly([[-200, -610], [-120, -760], [0, -820], [120, -760], [210, -600], [140, -630], [70, -570], [0, -640], [-80, -580], [-140, -640]]), G.snow, { shadow: 0.4, edge: 4 });
  ctx.restore();
}
function earth(x, y, r, t = 0) {
  cut(P_circ(x, y, r), P.sea, { shadow: 0.8, edge: 6 });
  ctx.save(); ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.clip();
  for (const [dx, dy, rr_] of [[-0.35, -0.25, 0.38], [0.3, 0.25, 0.32], [0.25, -0.4, 0.18], [-0.2, 0.45, 0.15]]) cut(P_circ(x + (dx + Math.sin(t * 0.2) * 0.05) * r, y + dy * r, rr_ * r), P.land, { shadow: 0.3, edge: 3 });
  ctx.restore();
}
/** dashed orbit ellipse drawn up to p (0..1) */
function orbit(x, y, rx, ry, p = 1, col = P.crimson, wdt = 10) { if (p <= 0.01) return; ctx.save(); ctx.setLineDash([26, 18]); ctx.strokeStyle = col; ctx.lineWidth = wdt; ctx.lineCap = 'round'; ctx.beginPath(); ctx.ellipse(x, y, rx, ry, 0, -Math.PI / 2, -Math.PI / 2 + TAU * clamp(p)); ctx.stroke(); ctx.restore(); }
/** peacock facing right standing on (x, y); fan 0..1 opens the tail; flap 0..1 wings. Returns the saddle point. */
function peacock(x, y, s = 1, o = {}) {
  const fan = o.fan || 0, flap = o.flap || 0;
  ctx.save(); ctx.translate(x, y); ctx.scale(s * (o.dir || 1), s);
  if (fan > 0.02) { for (let i = 0; i < 13; i++) { const a = rad(-170 + i * (160 / 12)) * fan + rad(-200) * (1 - fan); const L_ = 360; ctx.save(); ctx.translate(-60, -230); ctx.rotate(a + Math.PI / 2); cut(() => { ctx.beginPath(); ctx.ellipse(0, -L_ / 2, 46, L_ / 2, 0, 0, TAU); }, i % 2 ? G.peacock2 : '#3E8A6E', { shadow: 0.3, edge: 3 }); circle(0, -L_ + 60, 22, P.gold); circle(0, -L_ + 60, 11, G.peacock); ctx.restore(); } }
  else cut(() => { ctx.beginPath(); ctx.moveTo(-60, -260); ctx.quadraticCurveTo(-300, -230, -420, -120); ctx.lineTo(-380, -90); ctx.quadraticCurveTo(-260, -170, -40, -190); ctx.closePath(); }, G.peacock2, { shadow: 0.4, edge: 3 });
  for (const lx of [-20, 30]) cut(P_rr(lx - 7, -130, 14, 130, 5), P.gold, { shadow: 0.3, edge: 2 });
  cut(() => { ctx.beginPath(); ctx.ellipse(0, -210, 130, 85, -0.1, 0, TAU); }, G.peacock);
  cut(() => { ctx.beginPath(); ctx.moveTo(70, -250); ctx.quadraticCurveTo(140, -330, 110, -420); ctx.lineTo(150, -430); ctx.quadraticCurveTo(170, -320, 110, -220); ctx.closePath(); }, G.peacock, { shadow: 0.4, edge: 3 });
  cut(P_circ(135, -435, 32), G.peacock, { shadow: 0.3, edge: 3 }); cut(P_poly([[160, -440], [205, -425], [160, -420]]), P.gold, { shadow: 0.2, edge: 2 }); circle(143, -442, 6, P.ink);
  for (let i = 0; i < 3; i++) { line([[120 + i * 8, -465], [110 + i * 14, -505]], G.peacock, 4); circle(110 + i * 14, -508, 7, G.peacock); }
  ctx.save(); ctx.translate(-20, -230); ctx.rotate(-flap * 1.1); cut(() => { ctx.beginPath(); ctx.ellipse(-40, 0, 110, 50, 0.15, 0, TAU); }, '#3A6FB5', { shadow: 0.4, edge: 3 }); ctx.restore();
  ctx.restore(); return [x + 0 * s * (o.dir || 1), y - 285 * s];
}
function mouse(x, y, s = 1, dir = 1, t = 0, wob = 0) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s * dir, s);
  ctx.save(); ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(-90, -40); ctx.quadraticCurveTo(-180, -40 + Math.sin(t * 6) * 20, -200, -110); ctx.strokeStyle = '#7E746C'; ctx.lineWidth = 10; ctx.stroke(); ctx.restore();
  for (const lx of [-50, 40]) cut(P_rr(lx - 10, -40 + Math.sin(t * 20 + lx) * wob, 20, 40, 8), '#7E746C', { shadow: 0.3, edge: 2 });
  cut(() => { ctx.beginPath(); ctx.ellipse(0, -75, 100, 62, 0, 0, TAU); }, G.mouse);
  cut(P_poly([[70, -110], [160, -70], [70, -40]]), G.mouse, { shadow: 0.3, edge: 3 }); circle(162, -70, 9, P.ink);
  cut(P_circ(55, -130, 30), '#B9AEA4', { shadow: 0.3, edge: 3 }); circle(105, -88, 6, P.ink);
  cut(P_rr(-55, -140, 90, 22, 8), P.crimson, { shadow: 0.2, edge: 2 });
  ctx.restore();
}
function vel(x, y, len = 420) { cut(P_rr(x - 7, y - len * 0.75, 14, len, 5), P.sepia, { shadow: 0.4, edge: 2 }); cut(() => { ctx.beginPath(); const t = y - len * 0.75; ctx.moveTo(x, t - 110); ctx.quadraticCurveTo(x + 40, t - 40, x, t); ctx.quadraticCurveTo(x - 40, t - 40, x, t - 110); }, P.gold, { shadow: 0.4, edge: 3 }); }
function diya(x, y, s = 1, t = 0) { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); glow(0, -60, 90, 0.8 + 0.2 * Math.sin(t * 9)); cut(() => { ctx.beginPath(); ctx.moveTo(-60, -20); ctx.quadraticCurveTo(0, 30, 60, -20); ctx.lineTo(80, -30); ctx.lineTo(-60, -30); ctx.closePath(); }, '#A0522D', { shadow: 0.4, edge: 3 }); cut(() => { ctx.beginPath(); ctx.moveTo(60, -30); ctx.quadraticCurveTo(80 + Math.sin(t * 11) * 4, -70, 70, -100); ctx.quadraticCurveTo(50, -60, 60, -30); }, '#F2A93B', { shadow: 0, edge: 0 }); ctx.restore(); }
function modak(x, y, s = 1) { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); cut(() => { ctx.beginPath(); ctx.moveTo(0, -60); ctx.quadraticCurveTo(50, -10, 40, 20); ctx.lineTo(-40, 20); ctx.quadraticCurveTo(-50, -10, 0, -60); }, '#F1E4C4', { shadow: 0.4, edge: 3 }); ctx.restore(); }
function lota(x, y, s = 1) { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); cut(() => { ctx.beginPath(); ctx.moveTo(-25, -70); ctx.lineTo(25, -70); ctx.lineTo(20, -50); ctx.bezierCurveTo(70, -40, 70, 20, 0, 20); ctx.bezierCurveTo(-70, 20, -70, -40, -20, -50); ctx.closePath(); }, '#C27A3A', { shadow: 0.4, edge: 3 }); ctx.restore(); }
function pothi(x, y, s = 1, p = 1) { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); cut(P_rr(-300, -70, 600, 140, 10), '#D9B977'); ctx.strokeStyle = 'rgba(62,44,30,0.6)'; ctx.lineWidth = 4; for (let i = 0; i < 4; i++) { ctx.beginPath(); ctx.moveTo(-250, -40 + i * 26); ctx.lineTo(-250 + 500 * clamp(p * 1.3 - i * 0.1), -40 + i * 26); ctx.stroke(); } for (const k of [-160, 160]) circle(k, 0, 10, P.crimson); cut(P_rr(-320, -80, 30, 160, 6), P.wine, { shadow: 0.3, edge: 2 }); cut(P_rr(290, -80, 30, 160, 6), P.wine, { shadow: 0.3, edge: 2 }); ctx.restore(); }
function thought(x, y, s, t) { if (s <= 0) return; ctx.save(); ctx.translate(x, y); ctx.scale(s, s); for (const [dx, dy, r] of [[-150, 170, 18], [-110, 120, 28]]) cut(P_circ(dx, dy, r), C.white, { shadow: 0.3, edge: 3 }); cloud(0, 0, 0.9); ctx.font = `800 110px NotoDeva`; ctx.fillStyle = P.crimson; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('?', 0, 10 + Math.sin(t * 4) * 6); ctx.restore(); }
function dayPage(seed) { skyPage(seed); heavenClouds(0); }
function bigCross(x, y, p) { if (p <= 0) return; ctx.save(); ctx.globalAlpha = clamp(p); ctx.lineCap = 'round'; ctx.strokeStyle = P.crimson; ctx.lineWidth = 26; ctx.beginPath(); ctx.moveTo(x - 110, y - 110); ctx.lineTo(x - 110 + 220 * clamp(p * 2), y - 110 + 220 * clamp(p * 2)); ctx.stroke(); if (p > 0.5) { ctx.beginPath(); ctx.moveTo(x + 110, y - 110); ctx.lineTo(x + 110 - 220 * clamp(p * 2 - 1), y - 110 + 220 * clamp(p * 2 - 1)); ctx.stroke(); } ctx.restore(); }
function bigText(text, x, y, size, col, sc = 1) { if (sc <= 0) return; ctx.save(); ctx.translate(x, y); ctx.scale(sc, sc); ctx.font = `800 ${size}px NotoDeva`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.lineWidth = 14; ctx.strokeStyle = P.edge; ctx.strokeText(text, 0, 0); ctx.fillStyle = col; ctx.fillText(text, 0, 0); ctx.restore(); }
/** Ganesha walking round the seated parents: p 0..1 over `rounds` rounds; returns completed rounds */
function parikramaScene(t, p, rounds = 7, o = {}) {
  const cx = 540, cy = 1250, rx = 420, ry = 150;
  const a = p * rounds * TAU; const gx = cx + Math.sin(a) * rx, gy = cy + Math.cos(a) * ry; const behind = Math.cos(a) < 0;
  const dir = Math.cos(a) >= 0 ? 1 : -1; const gs = lerp(0.62, 0.78, (Math.cos(a) + 1) / 2);
  orbit(cx, cy, rx, ry, 1, 'rgba(168,50,45,0.55)', 8);
  const g = () => ganesha({ x: gx, y: gy + 120, h: 420 * gs / 0.7, dir, halo: o.halo ?? 0.5, arm: 120, back: 120, bob: p > 0 && p < 1 ? -Math.abs(Math.sin(a * 6)) * 12 : 0 });
  if (behind) g();
  parents(cx, cy - 20, 0.95, 1, o.bless || 0);
  if (!behind) g();
  return Math.min(rounds, Math.floor(p * rounds + 1e-6));
}

export function buildShots() {
  const S = [], CUES = [], add = (o) => (S.push(o), o), cue = (t, type, o = {}) => CUES.push({ t: +t.toFixed(3), type, ...o });
  const OFF = 2;
  const at = (i) => L(i + OFF) - 0.08;
  const w = (word, i) => Wd(word, i + OFF) - at(i);
  const pop = (lt, a, dur = 0.35) => (lt > a ? eob(seg(lt, a, a + dur)) : 0);
  const shot = (i, o) => { const st = at(i); add({ id: `S${String(i).padStart(2, '0')}`, at: st, ...o }); cue(st, 'whoosh', { gain: 0.5 }); return st; };

  // H0 · hook: how did Ganesha win the race round the earth without running?
  { const pr = Wd('पृथ्वी', 0), pk = Wd('परिक्रमा', 0), ke = Wd('कैसे', 0), du = Wd('दौड़े', 0); add({ id: 'H0', at: 0, cam: [540, 900], zoom: 0.12, note: 'hook: Ganesha + mouse, earth pops, orbit draws, big ?', draw(lt, d, t) {
    skyPage(30); glow(540, 800, 600, 0.6); cloudGround(1480);
    const e = pop(lt, pr - 0.15, 0.5); earth(760, 720, 190 * e, t); orbit(760, 720, 260, 110, eio(seg(lt, pk - 0.2, pk + 0.9)));
    ganesha({ x: 280, y: 1500, h: 700, halo: 1, arm: 70, hold: (x, y) => modak(x + 10, y + 20, 0.9) });
    mouse(500, 1500, 0.9, 1, t, 0);
    K.slip('?', 900, 380, pop(lt, ke, 0.4), 0.08, 150);
  } }); cue(0.05, 'whoosh', { gain: 0.5 }); cue(pr, 'pop'); cue(pk, 'slide', { dur: 1 }); cue(ke, 'pop'); }
  // H1 · "no? come, I'll tell you"
  { const st = L(1) - 0.08, ai = Wd('आइए', 1) - st; add({ id: 'H1', at: st, cam: [540, 1050], zoom: 0.1, note: 'hook: Ganesha circles his parents, ribbon', draw(lt, d, t) {
    skyPage(31); heavenClouds(t); cloudGround(1480);
    parikramaScene(t, lt / 6, 1);
    K.ribbon('गणेश जी की परिक्रमा', 540, 330, pop(lt, 0.1, 0.45), 70);
    sparkles(540, 900, 300, t, pop(lt, ai));
  } }); cue(st, 'whoosh', { gain: 0.5 }); cue(st + 0.1, 'pop', { gain: 0.6 }); cue(st + ai, 'sparkle', { dur: 1 }); }

  // 0 · Kailash: Shiva, Parvati and their two sons
  { const pa = w('पार्वती', 0), pu = w('पुत्र', 0); const st = shot(0, { cam: [540, 950], zoom: 0.08, note: 'Kailash, Shiva + Parvati, two sons pop in', draw(lt, d, t) {
    skyPage(1); cloud(180, 420, 0.8); kailash(540, 1200, 1); cloudGround(1470);
    K.ribbon('कैलाश', 540, 300, pop(lt, 0.15, 0.45), 90);
    trishul(150, 1500, 700); person({ ...SHIVA, x: 330, y: 1500, h: 600, halo: pop(lt, 0.3), arm: 40 });
    person({ ...PARVATI, x: 760, y: 1500, h: 560, halo: pop(lt, pa), arm: 40, dir: -1 });
    const k = pop(lt, pu); if (k > 0) { person({ ...KARTIKEYA, x: 480, y: 1500, h: 300 * k, arm: 30 }); ganesha({ x: 600, y: 1500, h: 300 * k, arm: 30 }); }
  } }); cue(st + 0.15, 'pop', { gain: 0.6 }); cue(st + pu, 'pop'); }

  // 1 · elder Kartikeya, younger Ganesha
  { const ka = w('कार्तिकेय', 1), ga = w('गणेश', 1); shot(1, { cam: [540, 1000], zoom: 0.1, note: 'Kartikeya with vel (left), Ganesha with modak (right), slips', draw(lt, d, t) {
    skyPage(2); heavenClouds(t); cloudGround(1470);
    const a = eo(seg(lt, 0, Math.max(0.6, ka + 0.3))), b = eo(seg(lt, ga - 0.4, ga + 0.3));
    person({ ...KARTIKEYA, x: lerp(-200, 300, a), y: 1500, h: 640, halo: 0.6, arm: 25, hold: (x, y) => vel(x, y + 30, 480) });
    ganesha({ x: lerp(1300, 780, b), y: 1500, h: 620, dir: -1, halo: 0.6, arm: 70, hold: (x, y) => modak(x + 10, y + 20, 0.9) });
    K.slip('कार्तिकेय', 300, 420, pop(lt, ka), -0.03, 50); K.slip('गणेश', 780, 420, pop(lt, ga), 0.03, 50);
  } }); }

  // 2 · an argument
  { const ba = w('बहस', 2); const st = shot(2, { cam: [540, 1050], zoom: 0.1, note: 'the brothers face each other, crimson zig-zag between', draw(lt, d, t) {
    skyPage(3); cloudGround(1470);
    const k = lt > ba ? Math.sin(t * 18) * 6 : 0;
    person({ ...KARTIKEYA, x: 300 + k, y: 1500, h: 660, arm: lt > ba ? 80 + Math.sin(t * 7) * 15 : 20, hold: (x, y) => {} });
    ganesha({ x: 780 - k, y: 1500, h: 660, dir: -1, arm: lt > ba ? 80 + Math.cos(t * 7) * 15 : 20 });
    if (lt > ba) { ctx.save(); ctx.globalAlpha = pop(lt, ba); line([[480, 760], [540, 820], [500, 880], [580, 940]], P.crimson, 12); ctx.restore(); }
  } }); cue(st + ba, 'slam', { gain: 0.4 }); }

  // 3 · whose wedding comes first?
  { const vi = w('विवाह', 3), ki = w('किसका', 3); const st = shot(3, { cam: [540, 950], zoom: 0.1, note: 'a wedding garland between the brothers, big ?', draw(lt, d, t) {
    skyPage(4); heavenClouds(t); cloudGround(1470);
    person({ ...KARTIKEYA, x: 220, y: 1500, h: 560, arm: 70 }); ganesha({ x: 860, y: 1500, h: 560, dir: -1, arm: 70 });
    const g = pop(lt, vi - 0.1, 0.45); glow(540, 880, 260, g * 0.6); garland(540, 760, 1.2 * g, 1);
    K.slip('विवाह', 540, 360, pop(lt, vi), -0.02, 60); K.slip('?', 780, 600, pop(lt, ki, 0.4), 0.08, 110);
  } }); cue(st + vi, 'sparkle', { dur: 0.9 }); cue(st + ki, 'pop'); }

  // 4 · Shiva smiles
  { const st = shot(4, { cam: [540, 900], zoom: 0.12, note: 'Shiva and Parvati seated on Kailash, glowing', draw(lt, d, t) {
    skyPage(5); kailash(540, 1150, 0.9); cloudGround(1470); glow(540, 950, 520, 0.7);
    asana(540, 1300, 1.3); seated({ ...SHIVA, x: 430, y: 1285, h: 700, halo: 1, arm: lerp(20, 130, eo(seg(lt, 0.3, 1.0))), back: 15 }); seated({ ...PARVATI, x: 680, y: 1285, h: 620, halo: 1, arm: 20 });
    sparkles(430, 860, 170, t, pop(lt, 0.4));
  } }); cue(st + 0.4, 'sparkle', { dur: 1 }); }

  // 5 · whoever goes round the whole earth
  { const pr = w('पृथ्वी', 5), pk = w('परिक्रमा', 5), lo = w('लौटेगा', 5); const st = shot(5, { cam: [540, 950], zoom: 0.08, note: 'earth with a crimson orbit drawing all the way round', draw(lt, d, t) {
    skyPage(6, '#DCCBA0'); for (let i = 0; i < 20; i++) circle(rnd(i) * W, rnd(i + 9) * 1400, 4, P.gold);
    earth(540, 950, 300 * pop(lt, pr - 0.2, 0.5), t);
    orbit(540, 950, 430, 180, eio(seg(lt, pk - 0.1, lo + 0.2)));
    const a = eio(seg(lt, pk - 0.1, lo + 0.2)) * TAU - Math.PI / 2; if (lt > pk - 0.1) circle(540 + Math.cos(a) * 430, 950 + Math.sin(a) * 180, 22, P.crimson);
    K.slip('पूरी पृथ्वी', 540, 420, pop(lt, pr), 0.02, 56);
  } }); cue(st + pr, 'pop'); cue(st + pk, 'slide', { dur: 1.4, gain: 0.5 }); }

  // 6 · his wedding comes first
  { const pe = w('पहले', 6); const st = shot(6, { cam: [540, 950], zoom: 0.1, note: 'garland lands on a gold seal of 1st place', draw(lt, d, t) {
    skyPage(7); heavenClouds(t);
    earth(540, 1000, 300, t); orbit(540, 1000, 430, 180, 1);
    const g = eob(seg(lt, 0.1, 0.8)); garland(540, lerp(300, 620, g), 1.1, 1);
    K.seal(860, 600, pop(lt, pe) * 0.9, '१');
    K.slip('पहले विवाह', 540, 1420, pop(lt, w('विवाह', 6)), -0.02, 50);
  } }); cue(st + pe, 'slam', { gain: 0.5 }); }

  // 7 · Kartikeya mounts his peacock
  { const mo = w('मोर', 7), bai = w('बैठे', 7); const st = shot(7, { cam: [540, 1050], zoom: 0.1, note: 'peacock fans its tail, Kartikeya hops on', draw(lt, d, t) {
    skyPage(8); heavenClouds(t); cloudGround(1470);
    const sp = peacock(560, 1500, 1.25, { fan: eo(seg(lt, mo - 0.3, mo + 0.4)) });
    const j = eio(seg(lt, bai - 0.5, bai + 0.1));
    person({ ...KARTIKEYA, x: lerp(200, sp[0] - 20, j), y: lerp(1500, sp[1] + 20, j) - Math.sin(j * Math.PI) * 120, h: lerp(560, 400, j), arm: 40, halo: 0.6, hold: (x, y) => vel(x, y + 30, 480) });
    K.slip('मोर', 860, 520, pop(lt, mo), 0.03, 56);
  } }); cue(st + mo, 'sparkle', { dur: 0.8 }); cue(st + bai, 'thud', { gain: 0.4 }); }

  // 8 · and flies off into the sky in a blink
  { const pa = w('पलक', 8), aa = w('आकाश', 8); const st = shot(8, { cam: [540, 900], zoom: 0.06, note: 'peacock flies up and away past clouds, dashed trail', draw(lt, d, t) {
    skyPage(9); cloud(200, 1100, 1); cloud(880, 1250, 0.8);
    const f = eio(seg(lt, pa - 0.2, d)); const x = lerp(300, 820, f), y = lerp(1300, 520, f);
    K.dashedRoute([[300, 1300], [x, y]], 1);
    const sp = peacock(x, y, 0.9, { flap: (Math.sin(t * 14) + 1) / 2 }); person({ ...KARTIKEYA, x: sp[0] - 20, y: sp[1] + 15, h: 290, arm: 60, halo: 0.6 });
    cloud(540, 600, 0.7, 0.9);
    K.slip('आकाश', 300, 420, pop(lt, aa), -0.03, 56);
  } }); cue(st + pa, 'whoosh', { gain: 0.8 }); cue(st + pa + 0.1, 'zip', { gain: 0.4 }); }

  // 9 · Ganesha falls to thinking
  { const so = w('सोच', 9); const st = shot(9, { cam: [540, 1000], zoom: 0.12, note: 'Ganesha alone, thought cloud with ?', draw(lt, d, t) {
    skyPage(10); heavenClouds(t); cloudGround(1470);
    ganesha({ x: 480, y: 1500, h: 760, halo: 0.5, arm: lerp(15, 135, eo(seg(lt, so - 0.3, so + 0.2))), trunk: Math.sin(t * 2) });
    thought(820, 560, pop(lt, so, 0.5), t);
  } }); cue(st + so, 'pop'); }

  // 10 · his mount: a little mouse
  { const mu = w('मूषक', 10); const st = shot(10, { cam: [640, 1250], zoom: 0.14, note: 'close: the mouse with a crimson saddle, slip', draw(lt, d, t) {
    skyPage(11); cloudGround(1470);
    ganesha({ x: 300, y: 1500, h: 760, halo: 0.4, arm: 20 });
    const r = eob(seg(lt, mu - 0.5, mu + 0.1)); mouse(lerp(1300, 760, r), 1500, 1.5, -1, t, r < 1 ? 10 : 0);
    K.slip('मूषक', 760, 1000, pop(lt, mu), 0.03, 60);
  } }); cue(st + mu, 'plop'); }

  // 11 · and a heavy body
  { const bh = w('भारी', 11); const st = shot(11, { cam: [540, 1150], zoom: 0.1, note: 'Ganesha sits on the mouse, the mouse squashes', draw(lt, d, t) {
    skyPage(12); cloudGround(1470);
    const sq = eob(seg(lt, bh - 0.3, bh + 0.2)); ctx.save(); ctx.translate(560, 1500); ctx.scale(1 + sq * 0.15, 1 - sq * 0.2); mouse(0, 0, 1.3, 1, t, 0); ctx.restore();
    ganesha({ x: 520, y: lerp(1100, 1330 + sq * 30, eo(seg(lt, 0, bh - 0.2))), h: 520, arm: 40, back: 40 });
    K.slip('भारी', 820, 520, pop(lt, bh), 0.04, 60);
  } }); cue(st + bh, 'thud'); }

  // 12 · beating a peacock in a race: impossible
  { const na = w('नामुमकिन', 12); const st = shot(12, { cam: [540, 950], zoom: 0.08, note: 'race track: peacock far ahead, mouse at the start, crimson X', draw(lt, d, t) {
    K.parchment(13);
    line([[80, 1350], [1000, 1350]], P.sepia, 8); line([[80, 900], [1000, 900]], P.sepia, 8);
    const f = eo(seg(lt, 0, 1.6)); const sp = peacock(lerp(250, 880, f), 860, 0.55, { flap: (Math.sin(t * 14) + 1) / 2 }); person({ ...KARTIKEYA, x: sp[0] - 10, y: sp[1] + 10, h: 180, arm: 60 });
    mouse(lerp(200, 270, f), 1330, 0.9, 1, t, 6); ganesha({ x: lerp(180, 250, f), y: 1240, h: 260, arm: 30 });
    bigCross(540, 1100, eo(seg(lt, na - 0.1, na + 0.4)));
    K.slip('नामुमकिन', 540, 420, pop(lt, na), -0.03, 62);
  } }); cue(st + 0.1, 'zip', { gain: 0.5 }); cue(st + na, 'slam', { gain: 0.6 }); }

  // 13 · then Ganesha bathed
  { const sn = w('स्नान', 13); const st = shot(13, { cam: [540, 950], zoom: 0.1, note: 'Ganesha pours water from a lota, droplets', draw(lt, d, t) {
    skyPage(14); glow(540, 900, 500, 0.5); cloudGround(1470);
    const p = eio(seg(lt, 0.1, sn + 0.2));
    ganesha({ x: 540, y: 1500, h: 760, halo: 0.6, arm: lerp(20, 165, p), hold: (x, y) => lota(x, y + 30, 1.2) });
    if (p > 0.8) for (let i = 0; i < 16; i++) { const k = (t * 1.4 + i / 16) % 1; ell(470 + rnd(i) * 160 + Math.sin(i) * 30, 560 + k * 500, 9, 16, '#8FB8D8'); }
    K.slip('स्नान', 860, 420, pop(lt, sn), 0.03, 58);
  } }); cue(st + sn, 'bubbles', { dur: 1.2, gain: 0.4 }); }

  // 14 · seats his parents on two seats
  { const aa = w('आसनों', 14), pi = w('पिता', 14); const st = shot(14, { cam: [540, 1050], zoom: 0.08, note: 'two seats pop in, Shiva and Parvati appear on them', draw(lt, d, t) {
    skyPage(15); heavenClouds(t); cloudGround(1470);
    const s1 = pop(lt, pi - 0.2, 0.4), s2 = pop(lt, aa - 0.1, 0.4);
    if (s2 > 0) { ctx.save(); ctx.translate(540, 1300); ctx.scale(s2, s2); ctx.translate(-540, -1300); asana(370, 1300, 0.85); asana(710, 1300, 0.85); ctx.restore(); }
    if (s2 >= 1) { const a = pop(lt, aa + 0.3, 0.5); ctx.save(); ctx.globalAlpha = a; seated({ ...SHIVA, x: 370, y: 1282, h: 560, halo: a, arm: 30 }); seated({ ...PARVATI, x: 710, y: 1282, h: 520, halo: a, arm: 30 }); ctx.restore(); }
    else { ctx.save(); ctx.globalAlpha = 1; person({ ...SHIVA, x: 330, y: 1500, h: 560, arm: 20 }); person({ ...PARVATI, x: 750, y: 1500, h: 520, arm: 20, dir: -1 }); ctx.restore(); }
    K.slip('माता पिता', 540, 420, pop(lt, pi), -0.02, 56);
  } }); cue(st + aa, 'pop'); cue(st + aa + 0.3, 'sparkle', { dur: 1 }); }

  // 15 · worships them
  { const pu = w('पूजा', 15); const st = shot(15, { cam: [540, 1150], zoom: 0.1, note: 'Ganesha offers a diya and petals before the seated parents', draw(lt, d, t) {
    skyPage(16); glow(540, 950, 520, 0.6); cloudGround(1470);
    asana(370, 1250, 0.85); asana(710, 1250, 0.85); seated({ ...SHIVA, x: 370, y: 1232, h: 560, halo: 1, arm: 120 }); seated({ ...PARVATI, x: 710, y: 1232, h: 520, halo: 1, arm: 120 });
    ganesha({ x: 540, y: 1560, h: 380, halo: 0.6, arm: 110, back: 110, hold: (x, y) => diya(x + 30, y + 10, 1.3, t) });
    petals(540, 1200, seg(lt, pu, pu + 1.0), 5);
  } }); cue(st + pu, 'sparkle', { dur: 1 }); }

  // 16 · folds his hands and goes round them seven times
  { const sa = w('सात', 16), pk = w('परिक्रमा', 16); const st = shot(16, { cam: [540, 1050], zoom: 0.06, note: 'parikrama: Ganesha circles the seated parents, counter 1..7', draw(lt, d, t) {
    skyPage(17); heavenClouds(t); cloudGround(1480);
    const n = parikramaScene(t, eio(seg(lt, 0.1, d + 0.15)), 7);
    if (lt > sa - 0.2) bigText(['१', '२', '३', '४', '५', '६', '७'][Math.max(0, Math.min(6, n))], 900, 470, 150, P.crimson, pop(lt, sa - 0.2));
    K.slip('सात परिक्रमा', 420, 420, pop(lt, pk), -0.03, 52);
  } }); { const dd = Le(16 + OFF) - st + 0.15; for (let k = 1; k <= 7; k++) cue(st + 0.1 + k * (dd - 0.1) / 7, 'tock', { gain: 0.6 }); } }

  // 17 · "now get me married"
  { const vi = w('विवाह', 17); const st = shot(17, { cam: [540, 1050], zoom: 0.1, note: 'Ganesha bows before the parents, garland glows above', draw(lt, d, t) {
    skyPage(18); heavenClouds(t); cloudGround(1480);
    parents(540, 1230, 0.95, 1, 0);
    ganesha({ x: 540, y: 1580, h: 420, halo: 0.6, arm: 120, back: 120 });
    const g = pop(lt, vi - 0.1, 0.5); glow(540, 520, 220, g * 0.6); garland(540, 440, g, 1);
  } }); cue(st + vi, 'sparkle', { dur: 0.8 }); }

  // 18 · "but where did you go round the earth?"
  { const ka = w('कहाँ', 18); const st = shot(18, { cam: [540, 950], zoom: 0.1, note: 'Shiva points; small earth with ? beside', draw(lt, d, t) {
    skyPage(19); heavenClouds(t); cloudGround(1470);
    trishul(120, 1500, 760); person({ ...SHIVA, x: 330, y: 1500, h: 700, halo: 1, arm: lerp(15, 95, eo(seg(lt, 0.2, 0.8))) });
    earth(780, 900, 210 * pop(lt, w('पृथ्वी', 18) - 0.2, 0.5), t); orbit(780, 900, 300, 120, eio(seg(lt, w('परिक्रमा', 18), ka)));
    K.slip('?', 900, 500, pop(lt, ka, 0.4), 0.08, 130);
  } }); cue(st + ka, 'pop'); }

  // 19 · "the Vedas and Shastras say"
  { const ve = w('वेद', 19), sh = w('शास्त्र', 19); const st = shot(19, { cam: [540, 1000], zoom: 0.1, note: 'palm-leaf scriptures open, lines write in', draw(lt, d, t) {
    K.parchment(20); glow(540, 900, 520, 0.6);
    pothi(540, 760, 1.2 * Math.max(0.6, pop(lt, ve - 0.2, 0.5)), seg(lt, ve, d)); pothi(540, 1080, 1.2 * pop(lt, sh - 0.2, 0.5), seg(lt, sh, d));
    ganesha({ x: 900, y: 1560, h: 420, dir: -1, arm: 90, halo: 0.5 });
    K.slip('वेद', 300, 560, pop(lt, ve), -0.03, 56); K.slip('शास्त्र', 760, 1300, pop(lt, sh), 0.03, 56);
  } }); cue(st + ve, 'pop'); cue(st + sh, 'pop'); }

  // 20 · whoever goes round their mother and father
  { const pk = w('परिक्रमा', 20); shot(20, { cam: [540, 1050], zoom: 0.08, note: 'parents seated, gold orbit around them draws', draw(lt, d, t) {
    skyPage(21); cloudGround(1480);
    parents(540, 1230, 0.95, 1, 0);
    orbit(540, 1100, 400, 300, eio(seg(lt, pk - 0.4, d)), P.gold, 14);
    K.slip('माता पिता', 540, 330, pop(lt, w('पिता', 20)), -0.02, 56);
  } }); }

  // 21 · gets the fruit of going round the whole earth: parents = earth
  { const ph = w('फल', 21), pr = w('पृथ्वी', 21); const st = shot(21, { cam: [540, 950], zoom: 0.06, note: 'equation: parents ring = earth ring', draw(lt, d, t) {
    K.parchment(22);
    ctx.save(); ctx.translate(300, 820); ctx.scale(0.55, 0.55); ctx.translate(-540, -1230); parents(540, 1230, 1, 1, 0); orbit(540, 1100, 440, 330, 1, P.gold, 18); ctx.restore();
    const e = pop(lt, pr - 0.1, 0.5); earth(800, 760, 160 * e, t); orbit(800, 760, 230, 100, e, P.gold, 10);
    bigText('=', 540, 760, 160, P.crimson, pop(lt, ph - 0.1));
    K.slip('एक ही फल', 540, 1250, pop(lt, ph), 0.02, 60);
  } }); cue(st + pr, 'pop'); cue(st + ph, 'slam', { gain: 0.5 }); }

  // 22 · "for me, you are the whole world"
  { const sa = w('संसार', 22); const st = shot(22, { cam: [540, 950], zoom: 0.12, note: 'a giant earth glows behind the seated parents', draw(lt, d, t) {
    skyPage(23); const g = eo(seg(lt, 0, sa + 0.3));
    glow(540, 800, 700, g); earth(540, 820, lerp(150, 430, g), t); cloudGround(1480);
    parents(540, 1260, 1, 1, 0);
    ganesha({ x: 920, y: 1580, h: 360, dir: -1, arm: 120, back: 120, halo: 0.5 });
    K.ribbon('पूरा संसार', 540, 280, pop(lt, sa, 0.45), 90);
  } }); cue(st + sa, 'sparkle', { dur: 1.3 }); }

  // 23 · Shiva and Parvati were delighted
  { const pr = w('प्रसन्न', 23); const st = shot(23, { cam: [540, 950], zoom: 0.08, note: 'parents bless, petals rain, halos bright', draw(lt, d, t) {
    skyPage(24, '#EBD8A8'); heavenClouds(t); glow(540, 900, 600, 0.8); cloudGround(1480);
    parents(540, 1230, 0.95, 1, eo(seg(lt, pr - 0.4, pr + 0.2)));
    ganesha({ x: 540, y: 1580, h: 400, halo: 1, arm: 120, back: 120 });
    for (let k = 0; k < 3; k++) petals(260 + k * 280, 500 + seg(lt, pr, d) * 300, seg(lt, pr + k * 0.15, pr + 1.2), k);
    sparkles(540, 1300, 260, t, pop(lt, pr));
  } }); cue(st + pr, 'sparkle', { dur: 1.5 }); }

  // 24 · married to Siddhi and Buddhi
  { const si = w('सिद्धि', 24), bu = w('बुद्धि', 24); const st = shot(24, { cam: [540, 1000], zoom: 0.1, note: 'wedding: Ganesha garlanded, Siddhi left, Buddhi right', draw(lt, d, t) {
    skyPage(25); heavenClouds(t); cloudGround(1480); glow(540, 900, 520, 0.6);
    for (let i = 0; i < 9; i++) garland(100 + i * 110, 230, 0.4, 0.5);
    ganesha({ x: 540, y: 1500, h: 700, halo: 1, arm: 40, back: 40 });
    garland(555, 1500 - 470 * 700 / 640, 0.85 * pop(lt, w('विवाह', 24)), 0.8);
    const a = eo(seg(lt, si - 0.4, si + 0.3)), b = eo(seg(lt, bu - 0.4, bu + 0.3));
    person({ ...SIDDHI, x: lerp(-150, 230, a), y: 1500, h: 560, halo: a * 0.5, arm: 60 });
    person({ ...BUDDHI, x: lerp(1230, 850, b), y: 1500, h: 560, dir: -1, halo: b * 0.5, arm: 60 });
    K.slip('सिद्धि', 230, 640, pop(lt, si), -0.03, 52); K.slip('बुद्धि', 850, 640, pop(lt, bu), 0.03, 52);
  } }); cue(st + si, 'pop'); cue(st + bu, 'pop'); }

  // 25 · two sons, Kshema and Labha: Shubh-Labh
  { const ks = w('क्षेम', 25), la = w('लाभ', 25), sh = w('शुभ', 25); const st = shot(25, { cam: [540, 1000], zoom: 0.08, note: 'two small boys appear; then SHUBH LABH written in kumkum', draw(lt, d, t) {
    skyPage(26); heavenClouds(t); cloudGround(1480);
    ganesha({ x: 540, y: 1500, h: 620, halo: 0.8, arm: 70, back: 70 });
    const a = pop(lt, ks - 0.1, 0.4), b = pop(lt, la - 0.1, 0.4);
    if (a > 0) person({ ...KARTIKEYA, robe: P.royal, x: 230, y: 1500, h: 380 * a, arm: 40, halo: 0.4 });
    if (b > 0) person({ ...KARTIKEYA, robe: P.green, x: 850, y: 1500, h: 380 * b, arm: 40, dir: -1, halo: 0.4 });
    K.slip('क्षेम', 230, 920, a * (1 - 0.3 * seg(lt, sh, sh + 0.3)), -0.03, 50); K.slip('लाभ', 850, 920, b * (1 - 0.3 * seg(lt, sh, sh + 0.3)), 0.03, 50);
    K.ribbon('शुभ  लाभ', 540, 330, pop(lt, sh, 0.45), 100);
  } }); cue(st + ks, 'pop'); cue(st + la, 'pop'); cue(st + sh, 'sparkle', { dur: 1 }); }

  // 26 · Kartikeya comes back after circling the earth
  { const lo = w('लौटे', 26); const st = shot(26, { cam: [540, 950], zoom: 0.08, note: 'peacock lands, tired, completing its orbit round the earth', draw(lt, d, t) {
    skyPage(27, '#DCCBA0');
    earth(540, 800, 260, t); orbit(540, 800, 400, 160, 1, 'rgba(168,50,45,0.5)', 8);
    const f = eio(seg(lt, 0, lo + 0.3)); const x = lerp(1050, 700, f), y = lerp(700, 1500, f);
    cloudGround(1480);
    const sp = peacock(x, y, 0.95, { dir: -1, flap: f < 1 ? (Math.sin(t * 12) + 1) / 2 : 0 }); person({ ...KARTIKEYA, x: sp[0] + 20, y: sp[1] + 15, h: 320, arm: 50, dir: -1, halo: 0.5 });
    K.slip('कार्तिकेय', 300, 1200, pop(lt, w('कार्तिकेय', 26)), -0.03, 50);
  } }); cue(st + lo, 'thud', { gain: 0.5 }); }

  // 27 · learns everything, leaves for Mount Krauncha
  { const kr = w('क्रौंच', 27); const st = shot(27, { cam: [540, 1000], zoom: 0.08, note: 'Kartikeya walks away towards the Krauncha mountain', draw(lt, d, t) {
    skyPage(28, '#D9C59A'); cloud(800, 400, 0.7);
    mountain(780, 1450, 0.85); cloudGround(1480);
    const f = eio(seg(lt, w('पता', 27), d)); const x = lerp(260, 640, f), s = lerp(1, 0.6, f);
    const sp = peacock(x + 120 * s, 1500 - (1 - s) * 60, 0.8 * s); person({ ...KARTIKEYA, x, y: 1500 - (1 - s) * 60, h: 560 * s, arm: 20, walk: t * 4, hold: (hx, hy) => vel(hx, hy + 30, 480) });
    K.slip('क्रौंच पर्वत', 760, 400, pop(lt, kr), 0.03, 52);
  } }); cue(st + kr, 'pop'); }

  // 28 · that's why Ganesha is the god of wisdom
  { const bu = w('बुद्धि', 28); const st = shot(28, { cam: [540, 950], zoom: 0.1, note: 'Ganesha in glory, ribbon BUDDHI KE DEVTA', draw(lt, d, t) {
    skyPage(29); heavenClouds(t); glow(540, 900, 600, 0.9); cloudGround(1480);
    lotus(540, 1520, 1.5); ganesha({ x: 540, y: 1500, h: 780, halo: 1, arm: 120, back: 30, hold: (x, y) => modak(x + 10, y + 20, 0.9) });
    mouse(860, 1500, 0.9, -1, t, 0);
    K.ribbon('बुद्धि के देवता', 540, 280, pop(lt, bu, 0.45), 84);
    sparkles(540, 900, 380, t, pop(lt, bu));
  } }); cue(st + bu, 'sparkle', { dur: 1.4 }); }

  // 29 · lesson: where strength gets tired
  { const ta = w('ताकत', 29), th = w('थक', 29); shot(29, { cam: [540, 950], zoom: 0.06, note: 'lesson card: a running peacock slows, sweat drops', draw(lt, d, t) {
    K.parchment(31);
    const tired = seg(lt, th - 0.3, th + 0.6); const sp = peacock(540, 1250, 1.1, { flap: (Math.sin(t * lerp(14, 3, tired)) + 1) / 2 * (1 - tired * 0.7) });
    for (let i = 0; i < 3; i++) if (tired > 0) ell(700 + i * 40, 780 + ((t * 1.5 + i / 3) % 1) * 120, 10, 16, '#8FB8D8');
    K.slip('ताकत', 540, 420, pop(lt, ta), -0.03, 64);
    K.slip('थक जाती है', 540, 600, pop(lt, th), 0.03, 50);
  } }); }

  // 30 · wisdom finds the way
  { const bu = w('बुद्धि', 30), ra = w('रास्ता', 30); const st = shot(30, { cam: [540, 950], zoom: 0.06, note: 'lesson card: a diya lights a short golden path to the parents', draw(lt, d, t) {
    K.parchment(32);
    ctx.save(); ctx.translate(780, 1050); ctx.scale(0.55, 0.55); ctx.translate(-540, -1230); parents(540, 1230, 1, 1, 0); ctx.restore();
    diya(260, 1200, 1.6 * pop(lt, bu - 0.1, 0.4), t);
    if (lt > ra - 0.2) K.dashedRoute([[330, 1150], [450, 1050], [600, 1060]], eo(seg(lt, ra - 0.2, ra + 0.6)));
    K.slip('बुद्धि', 260, 560, pop(lt, bu), -0.03, 64);
  } }); cue(st + bu, 'sparkle', { dur: 1 }); }

  // 31 · serving your parents is the greatest parikrama (loops back to the circling)
  { const se = w('सेवा', 31), pk = w('परिक्रमा', 31); shot(31, { cam: [540, 1050], zoom: 0.1, note: 'Ganesha circles the parents again, ribbon SEVA', draw(lt, d, t) {
    skyPage(33); heavenClouds(t); cloudGround(1480);
    parikramaScene(t, lt / 8, 1, { halo: 1, bless: 1 });
    K.ribbon('सेवा', 540, 300, pop(lt, se, 0.45), 110);
    sparkles(540, 900, 320, t, pop(lt, pk));
  } }); }

  return { shots: S, cues: CUES };
}
