// SAMUDRA MANTHAN: the shot list (Paper Atlas style, Hindi). Everything is cut paper on parchment.
// Deities are drawn simply and respectfully: no faces, no violence shown.
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

/** the churning: mountain in the ocean, Vasuki around it, asuras (head side, left) and devas (tail side, right) pulling */
function churn(t, o = {}) {
  const sink = o.sink || 0, lift = o.lift || 0, swirl = o.swirl ?? 1, pull = Math.sin(t * 2.6) * 28 * (o.still ? 0 : 1);
  skyPage(o.seed || 21, o.sky || C.sky); if (o.clouds !== false) { cloud(170, 360, 0.8); cloud(900, 460, 0.7); }
  const my = 1330 + sink;
  ocean(t, 1150, () => {
    if (o.turtle) tortoise(540, my + 30, 1.05, t);
    mountain(540, my, 1); coils(540, my, 1, o.coils ?? 1, swirl ? t * 0.9 : 0);
    if (o.rope !== false) {
      snake([[300, 980 - sink * 0.2], [200, 1080 + pull * 0.3], [150 + pull, 1210]], 40, true);
      snake([[780, 980 - sink * 0.2], [880, 1080 - pull * 0.3], [930 - pull, 1210]], 40, false);
    }
  }, swirl);
  if (o.people !== false) {
    ground(1470, P.sepia);
    person({ ...ASURA, x: 110 + pull * 0.5, y: 1500, h: 330, arm: 110, dir: 1 }); person({ ...ASURA, x: 230 + pull * 0.5, y: 1500, h: 300, arm: 120, dir: 1 });
    person({ ...DEVA, x: 970 - pull * 0.5, y: 1500, h: 330, arm: 110, dir: -1, halo: o.halo || 0 }); person({ ...DEVA, x: 850 - pull * 0.5, y: 1500, h: 300, arm: 120, dir: -1, halo: o.halo || 0 });
  }
}

export function buildShots() {
  const S = [], CUES = [], add = (o) => (S.push(o), o), cue = (t, type, o = {}) => CUES.push({ t: +t.toFixed(3), type, ...o });
  const OFF = 2;   // lines 0-1 are the hook; the story starts at script line 2
  const at = (i) => L(i + OFF) - 0.08;
  const w = (word, i) => Wd(word, i + OFF) - at(i);
  const pop = (lt, a, dur = 0.35) => (lt > a ? eob(seg(lt, a, a + dur)) : 0);
  const shot = (i, o) => { const st = at(i); add({ id: `S${String(i).padStart(2, '0')}`, at: st, ...o }); cue(st, 'whoosh', { gain: 0.5 }); return st; };

  // H0 · hook: why is Shiva's throat blue?
  { const kyo = Wd('क्यों', 0), ni = Wd('नीला', 0); add({ id: 'H0', at: 0, cam: [540, 820], zoom: 0.12, note: 'hook: Shiva close-up, blue throat, big question mark', draw(lt, d, t) {
    skyPage(30); glow(540, 800, 600, 0.8); ground(1600, P.sepia);
    trishul(880, 2100, 1700); person({ ...SHIVA, x: 540, y: 2050, h: 1400, halo: 1, arm: 10, throat: lt > ni - 0.2 ? 1 : 0.6 });
    if (lt > ni - 0.2) sparkles(540, 980, 160, t, pop(lt, ni - 0.2));
    K.slip('?', 860, 380, pop(lt, kyo, 0.4), 0.08, 150);
  } }); cue(0.05, 'whoosh', { gain: 0.5 }); cue(Wd('नीला', 0), 'sparkle', { dur: 1 }); cue(kyo, 'pop'); }
  // H1 · "no? come, I'll tell you"
  { const st = L(1) - 0.08, ai = Wd('आइए', 1) - st; add({ id: 'H1', at: st, cam: [540, 1000], zoom: 0.1, note: 'hook: the churning, ribbon SAMUDRA MANTHAN', draw(lt, d, t) {
    churn(t, { swirl: 1 }); kalash(540, 760, 0.8 * pop(lt, ai), pop(lt, ai), t);
    K.ribbon('समुद्र मंथन', 540, 330, pop(lt, 0.1, 0.45), 80);
  } }); cue(st, 'whoosh', { gain: 0.5 }); cue(st + 0.1, 'pop', { gain: 0.6 }); cue(st + ai, 'sparkle', { dur: 1 }); }

  // 0 · Indra rides Airavata through the clouds of Swarga
  shot(0, { cam: [540, 900], zoom: 0.08, note: 'Swarga: Indra on Airavata walks in, ribbon', draw(lt, d, t) {
    skyPage(1); heavenClouds(t); cloudGround(1450);
    const ex = lerp(-200, 380, eo(clamp(lt / 3))), wk = lt < 3 ? lt * 5 : 0;
    const [hx, hy] = elephant(ex, 1470, 0.85, 0, wk); person({ ...INDRA, x: ex - 20, y: 1470 - 520 * 0.85 + 10, h: 300, arm: 40, halo: 0.6 });
    K.ribbon('स्वर्गलोक', 540, 330, pop(lt, 0.2, 0.45), 90);
    K.slip('देवराज इंद्र', 760, 620, pop(lt, w('इंद्र', 0)), 0.03, 48);
  } });
  cue(at(0) + 0.25, 'pop', { gain: 0.6 }); cue(at(0) + 1.0, 'thud', { gain: 0.3 }); cue(at(0) + 2.0, 'thud', { gain: 0.3 });

  // 1 · Durvasa offers a divine garland
  { const st = shot(1, { cam: [540, 1000], zoom: 0.08, note: 'Durvasa holds out a garland to Indra', draw(lt, d, t) {
    skyPage(2); heavenClouds(t); cloudGround(1450);
    elephant(260, 1470, 0.8); person({ ...INDRA, x: 240, y: 1470 - 520 * 0.8 + 10, h: 290, arm: 60 });
    const g = pop(lt, w('माला', 1), 0.4);
    person({ ...SAGE, x: 860, y: 1470, h: 560, dir: -1, arm: lerp(20, 80, g), hold: (hx, hy) => garland(hx + 10, hy + 10, 0.9) });
    sparkles(860 - 240, 1470 - 480, 130, t, g);
    K.slip('ऋषि दुर्वासा', 800, 520, pop(lt, w('दुर्वासा', 1)), -0.03, 48);
  } }); cue(st + w('माला', 1), 'sparkle', { dur: 0.9 }); }

  // 2 · the garland goes on Airavata's head
  { const st = shot(2, { cam: [600, 900], zoom: 0.1, note: 'garland placed on the elephant head', draw(lt, d, t) {
    skyPage(3); heavenClouds(t); cloudGround(1450);
    const [hx, hy] = elephant(200, 1500, 1.15);
    person({ ...INDRA, x: 160, y: 1500 - 520 * 1.15 + 10, h: 330, arm: lerp(30, 70, eio(seg(lt, 0, 1))) });
    const p = eio(seg(lt, 0.3, w('रख', 2) + 0.2)); garland(lerp(380, hx - 20, p), lerp(600, hy + 20, p), 1, 0.8);
  } }); cue(st + w('रख', 2), 'pop', { gain: 0.5 }); }

  // 3 · Airavata throws it down and tramples it
  { const ku = w('कुचल', 3), fe = w('फेंककर', 3); const st = shot(3, { cam: [700, 1250], zoom: 0.1, note: 'garland thrown down, foot stomps, petals scatter', draw(lt, d, t) {
    skyPage(4); cloudGround(1450);
    const stomp = lt < ku - 0.4 ? 0 : lt < ku ? eo(seg(lt, ku - 0.4, ku - 0.1)) : 1 - eo(seg(lt, ku, ku + 0.12));
    elephant(240, 1470, 1, stomp);
    const fall = eio(seg(lt, fe - 0.4, fe + 0.2));
    if (lt < ku + 0.05) garland(lerp(540, 470, fall), lerp(700, 1440, fall), 0.9, lerp(0.8, 0.3, fall), fall * 1.2);
    else petals(470, 1440, seg(lt, ku, ku + 0.8), 3);
  } }); cue(st + fe, 'slide', { dur: 0.5, gain: 0.5 }); cue(st + ku, 'thud'); }

  // 4 · Durvasa's curse
  { const sh = w('श्राप', 4); const st = shot(4, { cam: [540, 1000], zoom: 0.12, note: 'Durvasa raises his hand, crimson wash, seal', draw(lt, d, t) {
    skyPage(5); cloudGround(1450); wash(P.crimson, 0.25 * pop(lt, sh) * (0.8 + 0.2 * Math.sin(t * 8)));
    person({ ...SAGE, x: 540, y: 1470, h: 760, arm: lerp(20, 150, eob(seg(lt, 0.1, 0.5))), back: 20 });
    K.seal(540, 420, pop(lt, sh) * 1.1, 'श');
  } }); cue(st + sh, 'slam', { gain: 0.6 }); }

  // 5 · the devas lose their splendour
  { const ch = w('चला', 5); const st = shot(5, { cam: [540, 1050], zoom: 0.08, note: 'three devas, their gold halos fade', draw(lt, d, t) {
    skyPage(6); heavenClouds(t); cloudGround(1450);
    const fade = 1 - eio(seg(lt, w('तेज', 5), ch + 0.5)); wash('#5A5040', 0.3 * (1 - fade));
    [[260, 560], [540, 640], [820, 560]].forEach(([x, h], i) => person({ ...DEVA, x, y: 1470, h, halo: fade, arm: lerp(15, 5, 1 - fade), bob: (1 - fade) * 20 }));
    K.slip('तेज और वैभव', 540, 300, pop(lt, w('तेज', 5)) * (lt > ch ? 1 - seg(lt, ch + 0.3, ch + 0.8) * 0.4 : 1), 0.03, 50);
  } }); cue(st + ch, 'slide', { dur: 1.2, gain: 0.5 }); }

  // 6 · the asuras take Swarga
  { const as = w('असुरों', 6); const st = shot(6, { cam: [540, 950], zoom: 0.08, note: 'golden palace, asuras march in, crimson flags', draw(lt, d, t) {
    skyPage(7, '#D9C59A'); palace(540, 1200, 1, pop(lt, as + 0.5, 0.5)); cloudGround(1450);
    for (let i = 0; i < 4; i++) { const x = lerp(-150 - i * 140, 200 + i * 220, eo(seg(lt, as - 0.1, as + 1.4))); person({ ...ASURA, x, y: 1490, h: 420, walk: t * 6, arm: 30 + 10 * Math.sin(t * 6 + i) }); }
    K.slip('स्वर्ग', 540, 330, pop(lt, 0.2), -0.02, 56);
  } }); cue(st + as, 'thud', { gain: 0.6 }); cue(st + as + 0.35, 'thud', { gain: 0.6 }); cue(st + as + 0.7, 'thud', { gain: 0.6 }); }

  // 7 · the devas go to Vishnu
  { const vi = w('विष्णु', 7); const st = shot(7, { cam: [540, 950], zoom: 0.1, note: 'devas bow; Vishnu appears on a lotus over the milk ocean', draw(lt, d, t) {
    skyPage(8); const g = pop(lt, vi - 0.2, 0.6);
    glow(540, 720, 520, g * 0.8);
    ocean(t, 1250, () => { ctx.save(); ctx.translate(0, (1 - g) * 500); lotus(540, 1210, 1.3); person({ ...VISHNU, x: 540, y: 1200, h: 640, arms4: 1, halo: g, arm: 40, back: 30, holdUp1: (x, y) => chakra(x, y - 20, 1, t), holdUp2: (x, y) => shankh(x, y - 20, 1), hold: (x, y) => lotus(x, y + 30, 0.25) }); ctx.restore(); }, 0.2);
    for (const [x, d_] of [[110, 1], [970, -1]]) person({ ...DEVA, x, y: 1560, h: 380, dir: d_, arm: 70 });
    K.slip('भगवान विष्णु', 540, 280, pop(lt, vi), 0.02, 52);
  } }); cue(st + vi, 'sparkle', { dur: 1.2 }); }

  // 8 · "churn the Ocean of Milk"
  { const kh = w('क्षीरसागर', 8); shot(8, { cam: [540, 1000], zoom: 0.06, note: 'wide milk ocean, Vishnu points', draw(lt, d, t) {
    skyPage(9); cloud(200, 420, 0.8); cloud(860, 330, 0.7);
    ocean(t, 980, null, 0.4 + eio(seg(lt, w('मंथन', 8), d)) * 0.6);
    person({ ...VISHNU, x: 870, y: 1500, h: 520, dir: -1, arms4: 1, halo: 1, arm: lerp(10, 95, eob(seg(lt, kh - 0.2, kh + 0.2))), holdUp1: (x, y) => chakra(x, y - 20, 1, t), holdUp2: (x, y) => shankh(x, y - 20, 1) });
    K.slip('क्षीरसागर', 420, 600, pop(lt, kh), -0.03, 60);
  } }); }

  // 9 · amrit will come out of it
  { const am = w('अमृत', 9); const st = shot(9, { cam: [540, 950], zoom: 0.1, note: 'a glowing kalash rises from the ocean', draw(lt, d, t) {
    skyPage(10, '#E9D6A4'); const r = eob(seg(lt, am - 0.2, am + 0.6));
    ocean(t, 1150, () => kalash(540, lerp(1500, 1080, r), 1.6, r, t), 0.3);
    sparkles(540, 860, 260, t, r);
    K.slip('अमृत = अमरता', 540, 330, pop(lt, w('अमर', 9)), 0.02, 52);
  } }); cue(st + am, 'sparkle', { dur: 1.4 }); }

  // 10 · not alone: take the asuras along
  { const sa = w('साथ', 10); const st = shot(10, { cam: [540, 1050], zoom: 0.08, note: 'deva and asura face each other, hands meet', draw(lt, d, t) {
    skyPage(11); cloudGround(1450);
    const m = eio(seg(lt, w('असुरों', 10) - 0.2, sa + 0.1));
    person({ ...DEVA, x: lerp(250, 380, m), y: 1470, h: 640, arm: lerp(10, 80, m) });
    person({ ...ASURA, x: lerp(830, 700, m), y: 1470, h: 640, dir: -1, arm: lerp(10, 80, m) });
    sparkles(540, 960, 90, t, pop(lt, sa));
    K.slip('देवता', 260, 420, pop(lt, 0.2), -0.03, 50); K.slip('असुर', 820, 420, pop(lt, w('असुरों', 10)), 0.03, 50);
  } }); cue(st + sa, 'pop'); }

  // 11 · Mount Mandara becomes the churning rod
  { const st = shot(11, { cam: [540, 900], zoom: 0.08, note: 'Mandara drops into the ocean', draw(lt, d, t) {
    skyPage(12); cloud(170, 360, 0.8); cloud(900, 460, 0.7);
    const dr = eob(seg(lt, 0.1, 0.9));
    ocean(t, 1150, () => mountain(540, lerp(300, 1330, dr), 1), 0.2 + 0.6 * seg(lt, 0.8, 1.3));
    K.slip('मंदराचल पर्वत', 540, 260, pop(lt, w('मंदराचल', 11)), -0.02, 50);
  } }); cue(st + 0.85, 'thud'); cue(st + 0.9, 'bubbles', { dur: 1.0, gain: 0.5 }); }

  // 12 · Vasuki becomes the rope
  { const va = w('वासुकि', 12); shot(12, { cam: [540, 950], zoom: 0.1, note: 'Vasuki coils around the mountain', draw(lt, d, t) {
    churn(t, { coils: eio(seg(lt, 0, d * 0.9)), rope: lt > d * 0.6, people: false, swirl: 0.2 });
    K.slip('नागराज वासुकि', 540, 260, pop(lt, va), 0.02, 50);
  } }); }

  // 13 · devas on one side, asuras on the other
  { const de = w('देवता', 13), as = w('असुर', 13); shot(13, { cam: [540, 1000], zoom: 0.06, note: 'wide: asuras left (head), devas right (tail)', draw(lt, d, t) {
    churn(t, { swirl: 0.3, still: true });
    K.slip('देवता', 900, 1080, pop(lt, de), 0.03, 46); K.slip('असुर', 180, 1080, pop(lt, as), -0.03, 46);
  } }); }

  // 14 · the churning begins
  { const st = shot(14, { cam: [540, 1050], zoom: 0.1, note: 'pulling, mountain turns, ocean swirls, ribbon', draw(lt, d, t) {
    churn(t, { swirl: 1 });
    K.ribbon('समुद्र मंथन', 540, 330, pop(lt, w('समुद्र', 14), 0.45), 80);
  } }); cue(st, 'slide', { dur: 1.8, gain: 0.6 }); }

  // 15 · the mountain starts to sink
  { const du = w('डूबने', 15); const st = shot(15, { cam: [540, 1100], zoom: 0.1, note: 'mountain sinks, crimson arrow down', draw(lt, d, t) {
    churn(t, { sink: eio(seg(lt, du - 0.4, d)) * 380, swirl: 0.6 });
    if (lt > du - 0.3) arrow(880, 520, 880, 860, eo(seg(lt, du - 0.3, du + 0.3)));
  } }); cue(st + du, 'bubbles', { dur: 1.5 }); cue(st + du, 'slide', { dur: 1.2, gain: 0.5 }); }

  // 16 · Vishnu becomes Kurma, the tortoise
  { const ka = w('कछुए', 16), ku = w('कूर्म', 16); const st = shot(16, { cam: [540, 1150], zoom: 0.08, note: 'cutaway under the ocean: the tortoise rises', draw(lt, d, t) {
    skyPage(13, '#E9D6A4'); ctx.fillStyle = C.milk2; ctx.fillRect(-300, 600, W + 600, H); ctx.fillStyle = C.milk3; ctx.fillRect(-300, 1350, W + 600, H);
    ocean(t, 520, null, 0.3);
    mountain(540, 1100, 0.75);
    const r = eob(seg(lt, ka - 0.3, ka + 0.6)); glow(540, 1250, 400, r * 0.7);
    tortoise(540, lerp(1900, 1200, r), 1.1, t);
    K.slip('कूर्म अवतार', 540, 360, pop(lt, ku), 0.02, 56);
  } }); cue(st + ka, 'sparkle', { dur: 1.2 }); cue(st + ka, 'bubbles', { dur: 1.2, gain: 0.4 }); }

  // 17 · lifts the whole mountain on his back
  { const pi = w('पीठ', 17); const st = shot(17, { cam: [540, 1100], zoom: 0.08, note: 'mountain rises back up on the tortoise', draw(lt, d, t) {
    churn(t, { sink: lerp(380, 0, eio(seg(lt, 0.2, pi + 0.5))), turtle: true, swirl: 0.8 });
  } }); cue(st + pi, 'thud', { gain: 0.5 }); }

  // 18 · first came halahala
  { const ha = w('हलाहल', 18); const st = shot(18, { cam: [540, 1000], zoom: 0.1, note: 'dark poison cloud bubbles up from the ocean', draw(lt, d, t) {
    churn(t, { swirl: 1, sky: '#CDBB92' });
    const g = eob(seg(lt, ha - 0.4, ha + 0.6)); wash(C.dusk, 0.35 * g);
    poisonCloud(540, lerp(1200, 650, g), g * 1.1, t);
    K.slip('हलाहल', 540, 260, pop(lt, ha), -0.03, 60);
  } }); cue(st + ha - 0.3, 'bubbles', { dur: 1.6 }); cue(st + ha, 'sizzle', { dur: 1.5, gain: 0.5 }); }

  // 19 · poison that could burn all creation
  { const sr = w('सृष्टि', 19); const st = shot(19, { cam: [540, 900], zoom: 0.06, note: 'cloud swells over the world, everything darkens', draw(lt, d, t) {
    skyPage(14, '#B9A57E'); cloud(200, 1100, 1, 0.5);
    // the three worlds as a small round earth
    cut(P_circ(540, 1250, 230), P.sea);
    for (const [x, y, r] of [[470, 1190, 80], [610, 1310, 70], [600, 1150, 40]]) cut(P_circ(x, y, r), P.land, { shadow: 0.3, edge: 3 });
    const g = eio(seg(lt, 0, d)); wash(C.dusk, 0.25 + 0.4 * g);
    poisonCloud(540, 700, 1.1 + g * 0.9, t);
    if (lt > sr) { ctx.save(); ctx.globalAlpha = 0.6 * pop(lt, sr); ctx.strokeStyle = P.crimson; ctx.lineWidth = 14; ctx.beginPath(); ctx.arc(540, 1250, 250, 0, TAU); ctx.stroke(); ctx.restore(); }
    K.slip('विष', 540, 260, pop(lt, w('विष', 19)), 0.03, 64);
  } }); cue(st, 'sizzle', { dur: 2.5, gain: 0.5 }); }

  // 20 · everyone was afraid; then Shiva came forward
  { const sh = w('शिव', 20); const st = shot(20, { cam: [540, 1050], zoom: 0.08, note: 'devas and asuras tremble; Shiva walks in with trishul', draw(lt, d, t) {
    skyPage(15, '#B9A57E'); wash(C.dusk, 0.45); poisonCloud(540, 520, 1.2, t, 0.95); ground(1470, '#5E4A38');
    const fear = lt < sh ? Math.sin(t * 30) * 4 : 0;
    person({ ...DEVA, x: 150 + fear, y: 1500, h: 400, arm: 120 }); person({ ...ASURA, x: 330 - fear, y: 1500, h: 400, arm: 120 });
    const e = eo(seg(lt, sh - 0.6, sh + 0.6)); const sx = lerp(1250, 780, e);
    glow(sx, 1000, 380, e * 0.8);
    trishul(sx + 140, 1500, 760); person({ ...SHIVA, x: sx, y: 1500, h: 700, dir: -1, halo: e, arm: 10, back: 60 });
    K.slip('भगवान शिव', 760, 330, pop(lt, sh), 0.02, 52);
  } }); cue(st + sh, 'sparkle', { dur: 1.5 }); }

  // 21 · Shiva drinks the poison
  { const pi = w('पी', 21); const st = shot(21, { cam: [540, 950], zoom: 0.1, note: 'the poison spirals down into Shiva; cloud shrinks', draw(lt, d, t) {
    skyPage(16, '#B9A57E'); const p = eio(seg(lt, 0.1, d)); wash(C.dusk, 0.45 * (1 - p * 0.6)); ground(1470, '#5E4A38');
    poisonCloud(540, 450, 1.2 * (1 - p * 0.75), t);
    // the stream: dark beads spiralling down to the hands at the mouth
    for (let i = 0; i < 14; i++) { const k = ((t * 0.9 + i / 14) % 1); const y = lerp(560, 870, k), x = 540 + Math.sin(k * 9 + t) * 50 * (1 - k); circle(x, y, 20 * (1 - k * 0.5), i % 2 ? C.poison : C.poison2); }
    glow(540, 1000, 400, 0.6);
    trishul(760, 1500, 800); person({ ...SHIVA, x: 540, y: 1500, h: 760, halo: 1, arm: 150, back: 150, throat: seg(lt, pi, d) * 0.4 });
  } }); cue(st, 'gulp', { gain: 0.6 }); cue(st + pi, 'gulp', { gain: 0.6 }); }

  // 22 · Parvati holds his throat
  { const pa = w('पार्वती', 22), th = w('थाम', 22); const st = shot(22, { cam: [540, 950], zoom: 0.1, note: 'Parvati beside Shiva, her hand at his throat', draw(lt, d, t) {
    skyPage(17); glow(540, 900, 500, 0.6); ground(1470, P.sepia);
    trishul(880, 1500, 800); person({ ...SHIVA, x: 680, y: 1500, h: 760, halo: 1, arm: 10, throat: 0.45 });
    const e = eo(seg(lt, pa - 0.5, pa + 0.3));
    person({ ...PARVATI, x: lerp(-100, 400, e), y: 1500, h: 640, halo: e * 0.7, arm: lerp(10, 105, eob(seg(lt, th - 0.4, th + 0.1))) });
    K.slip('माता पार्वती', 400, 300, pop(lt, pa), -0.02, 52);
  } }); cue(st + th, 'pop', { gain: 0.5 }); }

  // 23 · the throat turns blue
  { const ni = w('नीला', 23); const st = shot(23, { cam: [540, 820], zoom: 0.14, note: 'close-up: the throat turns blue', draw(lt, d, t) {
    skyPage(18); glow(540, 800, 600, 0.7); ground(1600, P.sepia);
    trishul(880, 2100, 1700); person({ ...SHIVA, x: 540, y: 2050, h: 1400, halo: 1, arm: 10, throat: lerp(0.45, 1, eio(seg(lt, ni - 0.5, ni + 0.3))) });
    if (lt > ni) sparkles(540, 980, 160, t, pop(lt, ni));
  } }); cue(st + ni, 'sparkle', { dur: 1.2 }); }

  // 24 · Neelkanth
  { const nk = w('नीलकंठ', 24); const st = shot(24, { cam: [540, 900], zoom: 0.08, note: 'Shiva in full, ribbon NEELKANTH', draw(lt, d, t) {
    skyPage(19); heavenClouds(t); glow(540, 900, 560, 0.8); cloudGround(1470);
    trishul(760, 1500, 820); person({ ...SHIVA, x: 540, y: 1500, h: 780, halo: 1, arm: 70, back: 10, throat: 1 });
    K.ribbon('नीलकंठ', 540, 300, pop(lt, nk, 0.45), 100);
  } }); cue(st + nk, 'pop'); cue(st + nk, 'sparkle', { dur: 1.2 }); }

  // 25 · the treasures rise: Kamadhenu, Uchchaihshravas, Kalpavriksha
  { const ka = w('कामधेनु', 25), uc = w('उच्चैश्रवा', 25), kl = w('कल्पवृक्ष', 25); const st = shot(25, { cam: [540, 950], zoom: 0.06, note: 'cow, horse, wish-tree rise from the ocean in turn', draw(lt, d, t) {
    skyPage(20); cloud(540, 260, 0.6, 0.7);
    const r1 = eob(seg(lt, ka - 0.2, ka + 0.5)), r2 = eob(seg(lt, uc - 0.2, uc + 0.5)), r3 = eob(seg(lt, kl - 0.2, kl + 0.5));
    ocean(t, 1200, () => { cow(230, lerp(1600, 1180, r1), 0.85); tree(820, lerp(1700, 1190, r3), 0.8, t); horse(520, lerp(1600, 1000, r2), 0.85); }, 0.3);
    K.slip('कामधेनु', 230, 760, pop(lt, ka), -0.04, 44); K.slip('उच्चैश्रवा', 560, 520, pop(lt, uc), 0.03, 44); K.slip('कल्पवृक्ष', 830, 640, pop(lt, kl), -0.02, 44);
    K.slip('अनमोल रत्न', 540, 340, pop(lt, w('अनमोल', 25)) * (1 - seg(lt, ka - 0.2, ka)), 0, 50);
  } }); cue(st + ka, 'pop'); cue(st + uc, 'pop'); cue(st + kl, 'pop'); }

  // 26 · Lakshmi on a lotus
  { const la = w('लक्ष्मी', 26); const st = shot(26, { cam: [540, 950], zoom: 0.1, note: 'Lakshmi rises on a lotus', draw(lt, d, t) {
    skyPage(22, '#EBD8A8'); const r = eob(seg(lt, 0.0, 1.0)); glow(540, 800, 520, r);
    ocean(t, 1250, () => { ctx.save(); ctx.translate(0, (1 - r) * 700); lotus(540, 1230, 1.6); person({ ...LAKSHMI, x: 540, y: 1215, h: 640, halo: r, arm: 70, back: 20, hold: (x, y) => lotus(x, y + 20, 0.3) }); ctx.restore(); }, 0.2);
    sparkles(540, 800, 330, t, r);
    K.slip('माता लक्ष्मी', 540, 260, pop(lt, la), 0.02, 52);
  } }); cue(st + 0.2, 'sparkle', { dur: 1.6 }); }

  // 27 · she chooses Vishnu
  { const vi = w('विष्णु', 27); const st = shot(27, { cam: [540, 1000], zoom: 0.08, note: 'Lakshmi places the garland on Vishnu', draw(lt, d, t) {
    skyPage(23); heavenClouds(t); cloudGround(1470); glow(540, 900, 500, 0.6);
    person({ ...VISHNU, x: 740, y: 1500, h: 700, dir: -1, arms4: 1, halo: 1, holdUp1: (x, y) => chakra(x, y - 20, 1, t), holdUp2: (x, y) => shankh(x, y - 20, 1) });
    const p = eio(seg(lt, vi - 0.6, vi + 0.4));
    person({ ...LAKSHMI, x: 320, y: 1500, h: 620, halo: 0.8, arm: lerp(60, 110, p) });
    garland(lerp(570, 740, p), lerp(870, 1500 - 700 * 0.82, p), 0.9, 0.7);
    if (p >= 1) sparkles(740, 900, 170, t, 1);
  } }); cue(st + vi + 0.4, 'sparkle', { dur: 1 }); }

  // 28 · Dhanvantari with the pot of amrit
  { const dh = w('धन्वंतरि', 28), am = w('अमृत', 28); const st = shot(28, { cam: [540, 950], zoom: 0.1, note: 'Dhanvantari rises holding the glowing kalash', draw(lt, d, t) {
    skyPage(24, '#EBD3A0'); const r = eob(seg(lt, dh - 0.4, dh + 0.6)); glow(540, 800, 600, r);
    ocean(t, 1250, () => { ctx.save(); ctx.translate(0, (1 - r) * 800); person({ ...VISHNU, head: 'crown', robe: '#E0B23C', x: 540, y: 1300, h: 700, halo: r, arm: 95, back: 20, hold: (x, y) => kalash(x + 10, y + 70, 0.6, pop(lt, am), t) }); ctx.restore(); }, 0.3);
    K.slip('धन्वंतरि', 540, 260, pop(lt, dh), -0.02, 54);
  } }); cue(st + dh, 'sparkle', { dur: 1.3 }); cue(st + am, 'pop'); }

  // 29 · the asuras snatch the pot
  { const ch = w('छीन', 29); const st = shot(29, { cam: [540, 1050], zoom: 0.1, note: 'an asura grabs the kalash and runs', draw(lt, d, t) {
    skyPage(25); cloudGround(1470);
    const g = eo(seg(lt, ch - 0.25, ch + 0.15)), run = seg(lt, ch + 0.15, d) * 500;
    person({ ...DEVA, x: 760, y: 1500, h: 620, dir: -1, arm: lerp(90, 40, g) });
    person({ ...ASURA, x: 330 - run, y: 1500, h: 640, arm: lerp(60, 100, g), walk: run * 0.05, hold: (x, y) => { if (g > 0.5) kalash(x, y + 40, 0.55, 0.6, t); } });
    if (g <= 0.5) kalash(560, 1060, 0.55, 0.6, t);
    for (const [x, k] of [[470, 0], [210, 1]]) person({ ...ASURA, x: x - 260 - run * 0.8, y: 1500, h: 520, walk: t * 8 + k, arm: 40 });
  } }); cue(st + ch, 'slam', { gain: 0.6 }); cue(st + ch + 0.1, 'zip', { gain: 0.5 }); }

  // 30 · Vishnu becomes Mohini
  { const mo = w('मोहिनी', 30); const st = shot(30, { cam: [540, 1000], zoom: 0.1, note: 'sparkles, Mohini appears; asuras turn to look', draw(lt, d, t) {
    skyPage(26); heavenClouds(t); cloudGround(1470);
    const r = eob(seg(lt, mo - 0.3, mo + 0.4)); sparkles(640, 1000, 260, t, 1 - seg(lt, mo + 0.3, mo + 1.2) * 0.6);
    glow(640, 1000, 420, r * 0.7);
    if (r > 0) { ctx.save(); ctx.globalAlpha = clamp(r); person({ ...MOHINI, x: 640, y: 1500, h: 680, halo: 0.5, arm: 30, back: 20 }); ctx.restore(); }
    person({ ...ASURA, x: 150, y: 1500, h: 480, arm: 20 + r * 30, hold: (x, y) => kalash(x, y + 40, 0.5, 0.5, t) });
    K.slip('मोहिनी रूप', 640, 330, pop(lt, mo), 0.02, 54);
  } }); cue(st + mo, 'sparkle', { dur: 1.5 }); }

  // 31 · she serves all the amrit to the devas
  { const de = w('देवताओं', 31); shot(31, { cam: [540, 1050], zoom: 0.08, note: 'Mohini pours amrit along the row of devas', draw(lt, d, t) {
    skyPage(27); cloudGround(1470);
    const p = eio(seg(lt, 0.2, d - 0.3)); const mx = lerp(300, 820, p);
    for (let i = 0; i < 3; i++) person({ ...DEVA, x: 260 + i * 260, y: 1500, h: 420, arm: 60, halo: seg(lt, de + i * 0.3, de + i * 0.3 + 0.5) * 0.8 });
    person({ ...MOHINI, x: mx - 30, y: 1500 - 60, h: 640, arm: 95, hold: (x, y) => kalash(x + 10, y + 50, 0.55, 0.8, t) });
    for (let i = 0; i < 6; i++) { const k = (t * 1.6 + i / 6) % 1; circle(mx + 150, 1000 + k * 140, 10, '#F2C14E'); }
    K.slip('अमृत', 540, 330, pop(lt, w('अमृत', 31)), -0.03, 56);
  } }); }

  // 32 · the devas' splendour returns
  { const lo = w('लौट', 32); const st = shot(32, { cam: [540, 950], zoom: 0.1, note: 'sunrise; devas glow gold again', draw(lt, d, t) {
    skyPage(28, '#EED9A2'); const s = eo(seg(lt, 0, d)); cut(P_circ(540, lerp(1200, 760, s), 170), '#EFC66A', { shadow: 0.4, edge: 5 }); glow(540, lerp(1200, 760, s), 700, s);
    heavenClouds(t); cloudGround(1450);
    const h = pop(lt, lo - 0.3, 0.6);
    [[230, 560], [540, 640], [850, 560]].forEach(([x, hh]) => person({ ...DEVA, x, y: 1470, h: hh, halo: h, arm: lerp(10, 140, h) }));
    sparkles(540, 800, 380, t, h);
  } }); cue(st + lo, 'sparkle', { dur: 1.5 }); }

  // 33 · lesson: poison comes before nectar
  { const vi = w('विष', 33); const st = shot(33, { cam: [540, 900], zoom: 0.06, note: 'lesson card: poison cloud then arrow then kalash', draw(lt, d, t) {
    K.parchment(29);
    const a = pop(lt, w('अमृत', 33)), b = pop(lt, 0.1);
    poisonCloud(300, 950, 0.75 * b, t); kalash(800, 1080, 1.1 * a, a, t);
    arrow(450, 950, 640, 950, eo(seg(lt, vi + 0.2, vi + 0.6)));
    K.slip('पहले विष', 300, 640, b, -0.03, 50); K.slip('फिर अमृत', 800, 640, pop(lt, vi + 0.5), 0.03, 50);
  } }); cue(st + vi, 'pop'); }

  // 34 · patience: back to the churning, the kalash glowing above (loops to the start)
  { const dh = w('धैर्य', 34); shot(34, { cam: [540, 950], zoom: 0.12, note: 'churning again, kalash glows above, ribbon DHAIRYA', draw(lt, d, t) {
    churn(t, { swirl: 0.7, halo: 0.7 });
    kalash(540, 760, 0.9, 1, t);
    K.ribbon('धैर्य', 540, 300, pop(lt, dh, 0.45), 100);
  } }); }

  return { shots: S, cues: CUES };
}
