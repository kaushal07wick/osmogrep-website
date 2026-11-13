/* Footer ASCII landscape, ported from footer.html. Site changes vs the reference:
   - day/night on India time (IST): pixel sun by day, white crescent moon by night, with the
     whole scene relit (warm orange by day, cool cream by night)
   - the light source sits high and lights the ridges; slopes facing away are shaded
   - ridges are static (no drift, no cursor bump) and the back range is removed, so the wordmark reads
   - the canvas bugs are gone: the DOM FooterBug (with its easter eggs) walks the ridges instead,
     using the exported ridgeY.
   createFooterScene(canvas, sceneEl) returns { cleanup, ridgeY, ridgeCount }. Client only. */
// @ts-nocheck
/* Day and night follow India time (IST) for every visitor: sun 06:00 to 18:00 IST, half moon otherwise.
   The answer is cached until the next sunrise/sunset or for an hour, whichever comes first, so the
   clock is read about once an hour and the scene still flips on time. */
const IST_OFFSET_MIN = 330; // UTC+5:30
const HOUR = 3600000;
let nightCache = { until: 0, night: false };
const isNight = () => {
  const now = Date.now();
  if (now < nightCache.until) return nightCache.night;
  const istMin = (Math.floor(now / 60000) + IST_OFFSET_MIN) % 1440;
  const night = istMin < 360 || istMin >= 1080;
  const nextSwitchMin = istMin < 360 ? 360 - istMin : istMin < 1080 ? 1080 - istMin : 1440 - istMin + 360;
  nightCache = { until: now + Math.min(HOUR, nextSwitchMin * 60000 - (now % 60000)), night };
  return night;
};
const RIDGE_T = 3; // ridges are frozen at this moment of the original drift

export function createFooterScene(canvas, scene, { reduced = false } = {}) {
  var cv = canvas, ctx = cv.getContext('2d');
  var W = 0, H = 0, DPR = 1, cols = 0, rows = 0, CW = 7.2, CH = 12, BG = '#181819';
  var mask = null, stars = [];
  var QA = []; for (var i = 0; i <= 20; i++) QA.push('rgba(224,98,42,' + (i / 20) + ')');
  var QW = []; for (i = 0; i <= 20; i++) QW.push('rgba(255,255,255,' + (i / 20) + ')');
  var QC = []; for (i = 0; i <= 20; i++) QC.push('rgba(241,235,224,' + (i / 20) + ')');
  function hash(a, b, c) { var n = Math.sin(a * 127.1 + b * 311.7 + (c || 0) * 74.7) * 43758.5453; return n - Math.floor(n); }
  function q(a) { return Math.max(0, Math.min(20, Math.round(a * 20))); }

  /* ---------- ridges (front to back) ---------- */
  var RZ = [
    { base: .87, A: [13, 7],  f: [.0062, .017], s: [.30, -.45], ph: [0, 1.7],  a: 1,   fill: 1,   ps: 3,   bx: .2,  v: 36 },
    { base: .76, A: [18, 8],  f: [.0052, .014], s: [-.22, .36], ph: [2, .5],   a: .72, fill: .75, ps: 2.2, bx: .62, v: 24 },
    { base: .65, A: [23, 9],  f: [.0044, .012], s: [.16, -.28], ph: [4, 2.4],  a: .52, fill: .55, ps: 1.5, bx: .38, v: 16 },
    { base: .55, A: [28, 10], f: [.0038, .010], s: [-.12, .2],  ph: [1, 3.3],  a: .38, fill: .4 }
  ];
  function ridgeY(i, x) {
    var z = RZ[i], t = RIDGE_T;
    return H * z.base + z.A[0] * Math.sin(x * z.f[0] + t * z.s[0] + z.ph[0]) + z.A[1] * Math.sin(x * z.f[1] + t * z.s[1] + z.ph[1]);
  }

  /* ---------- ghost wordmark mask ---------- */
  function buildMask() {
    var mw = cols * 2, mh = rows * 2, oc = document.createElement('canvas'); oc.width = mw; oc.height = mh;
    var o = oc.getContext('2d'); o.fillStyle = '#000'; o.textBaseline = 'alphabetic'; o.textAlign = 'left';
    o.font = '700 100px "Space Mono", monospace'; var w100 = o.measureText('osmogrep').width || 600;
    var target = mw * 0.6, fp = 100 * target / w100;
    o.font = '700 ' + fp + 'px "Space Mono", monospace';
    o.fillText('osmogrep', mw * 0.07, mh * 0.62);
    var d = o.getImageData(0, 0, mw, mh).data; mask = new Float32Array(cols * rows);
    for (var r = 0; r < rows; r++) for (var c = 0; c < cols; c++) {
      var s = 0; for (var dy = 0; dy < 2; dy++) for (var dx = 0; dx < 2; dx++) s += d[(((r * 2 + dy) * mw) + (c * 2 + dx)) * 4 + 3];
      mask[r * cols + c] = s / (4 * 255);
    }
  }
  function buildStars() {
    stars = [];
    for (var k = 0; k < 90; k++) stars.push({ c: Math.floor(hash(k, 1) * cols), r: Math.floor(hash(k, 2) * rows * 0.5), ph: hash(k, 3) * 6.28, ch: '.+*\''[Math.floor(hash(k, 4) * 4)] });
  }
  function size() {
    var r = scene.getBoundingClientRect(); W = r.width; H = r.height; DPR = Math.min(2, window.devicePixelRatio || 1);
    cv.width = Math.round(W * DPR); cv.height = Math.round(H * DPR);
    CW = W < 600 ? 6 : 7.2; CH = W < 600 ? 10 : 12; cols = Math.ceil(W / CW); rows = Math.ceil(H / CH);
    if (W <= 0 || H <= 0) { mask = null; return; }
    buildMask(); buildStars();
  }

  /* ---------- frame ---------- */
  function render(t) {
    if (!mask || W <= 0 || H <= 0) return;
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0); ctx.clearRect(0, 0, W, H);
    ctx.font = (CW * 1.6) + 'px "Space Mono", monospace'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    var c, r, x, y, i, a, ch;
    var night = isNight();
    var L = night ? QC : QA; // light colour used for ridges, rays and wordmark shimmer

    /* stars */
    stars.forEach(function (s) {
      a = 0.1 + 0.4 * (0.5 + 0.5 * Math.sin(t * 1.3 + s.ph));
      ctx.fillStyle = QW[q(a * 0.7)]; ctx.fillText(s.ch, (s.c + .5) * CW, (s.r + .5) * CH);
    });

    /* sun (day) or white half moon (night): high in the sky, glow + ASCII halo + pixel disc */
    var sx = W * 0.86, sy = H * 0.26 + 3 * Math.sin(t * 0.6), SR = Math.max(14, Math.min(22, W * 0.015)), HR = Math.min(130, W * 0.1, H * 0.3);
    var gc = night ? '241,235,224' : '224,98,42';
    var GR = Math.min(HR * 1.6, sy - 2, W - sx - 2); // the glow must fit inside the canvas, or it gets cut flat
    var g = ctx.createRadialGradient(sx, sy, SR * 0.5, sx, sy, GR);
    g.addColorStop(0, 'rgba(' + gc + ',' + (night ? .18 : .32) + ')'); g.addColorStop(.35, 'rgba(' + gc + ',' + (night ? .06 : .1) + ')'); g.addColorStop(1, 'rgba(' + gc + ',0)');
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(sx, sy, GR, 0, Math.PI * 2); ctx.fill();


    var ramp = ' .:-=+*#';
    for (r = Math.max(0, Math.floor((sy - HR) / CH)); r < Math.min(rows, Math.ceil((sy + HR) / CH)); r++) {
      for (c = Math.max(0, Math.floor((sx - HR) / CW)); c < Math.min(cols, Math.ceil((sx + HR) / CW)); c++) {
        x = (c + .5) * CW; y = (r + .5) * CH; var dd = Math.hypot(x - sx, y - sy);
        if (dd < SR + 3 || dd > HR) continue;
        var n = (dd - SR) / (HR - SR), I = Math.pow(1 - n, 2) * (0.8 + 0.2 * Math.sin(t * 1.7 + dd * 0.04));
        I *= 0.72 + 0.28 * Math.cos(10 * Math.atan2(y - sy, x - sx) + t * 0.35);
        var k = Math.min(7, Math.floor(I * 9)); if (k < 1) continue;
        ctx.fillStyle = L[q(I * (night ? 0.45 : 0.7))]; ctx.fillText(ramp[k], x, y);
      }
    }
    var P = Math.max(2, Math.round(SR / 9));
    for (var py = -SR; py <= SR; py += P) for (var px = -SR; px <= SR; px += P) {
      var dr = Math.hypot(px + P / 2, py + P / 2); if (dr > SR) continue;
      if (night && Math.hypot(px + P / 2 - SR * 0.55, py + P / 2 + SR * 0.2) < SR * 0.78) continue; // crescent: bite out of the right side
      if (!night && dr > SR - P * 1.5 && hash(px, py, Math.floor(t * 3)) > 0.55) continue;
      ctx.fillStyle = night ? ((px + py < -SR * 0.6) ? '#ffffff' : '#f1ebe0') : ((px + py < -SR * 0.6) ? '#f08a4b' : '#e0622a'); ctx.fillRect(Math.round(sx + px), Math.round(sy + py), P, P);
    }

    /* ghost wordmark: ASCII glyphs with a shimmer sweep */
    var band = ((t / 7) % 1.5 - 0.25) * cols, tick = Math.floor(t * 2), dense = '#%8@&';
    for (r = 0; r < rows; r++) for (c = 0; c < cols; c++) {
      var m = mask[r * cols + c]; if (m < 0.18) continue;
      var wv = Math.exp(-Math.pow((c - band) / 11, 2)), hh = hash(c, r, tick);
      ch = m > 0.55 ? (hh > 0.93 ? dense[Math.floor(hh * 50) % 5] : '#') : (m > 0.35 ? '+' : ':');
      if (wv > 0.1) { ctx.fillStyle = L[q(Math.min(0.85, wv * 0.95 * m))]; } else { ctx.fillStyle = QW[q(m > 0.55 ? 0.24 : 0.12)]; }
      ctx.fillText(ch, (c + .5) * CW, (r + .5) * CH);
    }

    /* ridges */
    var Y = [], z;
    for (i = 0; i < RZ.length; i++) { Y[i] = []; for (c = 0; c < cols; c++) Y[i][c] = ridgeY(i, (c + .5) * CW); }
    for (i = RZ.length - 1; i >= 0; i--) {
      z = RZ[i];
      ctx.fillStyle = 'rgba(24,24,25,.93)'; ctx.beginPath(); ctx.moveTo(0, H);
      for (c = 0; c < cols; c++) ctx.lineTo((c + .5) * CW, Y[i][c]);
      ctx.lineTo(W, H); ctx.closePath(); ctx.fill();
      for (c = 0; c < cols; c++) {
        var top = Y[i][c], lim = i > 0 ? Y[i - 1][c] : H;
        var sl = ((Y[i][Math.min(cols - 1, c + 1)] - Y[i][Math.max(0, c - 1)]) / (2 * CW));
        var rt = Math.floor(top / CH), fr = top / CH - rt;
        ch = sl < -0.3 ? '/' : sl > 0.3 ? '\\' : (fr < 0.5 ? '-' : '_');
        // lighting: slopes facing the light are lit, slopes facing away fall into shadow
        var cx = (c + .5) * CW, toL = Math.sign(sx - cx), lit = Math.max(0.4, Math.min(1.35, 0.95 + 2.2 * (-sl * toL) - Math.abs(sx - cx) / W * 0.25));

        for (r = rt + 1; r < rows; r++) {
          y = (r + .5) * CH; if (y > lim + CH) break;
          var d = (y - top) / CH;
          if (((c + r) & 1) !== 0) continue;
          var hv = hash(c, r, Math.floor(t * 1.5));
          ch = d < 2.2 && hv > 0.55 ? ':' : '.';
          if (hv > 0.985) ch = '+';
          var fa = (0.2 + 0.62 * Math.max(0, 1 - d / 9)) * z.fill * (0.75 + 0.25 * hv) * lit;
          ctx.fillStyle = L[q(fa)]; ctx.fillText(ch, (c + .5) * CW, y);
        }
      }
      ctx.beginPath(); ctx.strokeStyle = L[q(z.a * (i === 0 ? 0.9 : 0.55))]; ctx.lineWidth = i === 0 ? 1.6 : 1.1; ctx.lineJoin = 'round';
      ctx.moveTo(0, Y[i][0]);
      for (c = 1; c < cols - 1; c++) { var mx = (c + 1) * CW, my = (Y[i][c] + Y[i][c + 1]) / 2; ctx.quadraticCurveTo((c + .5) * CW, Y[i][c], mx, my); }
      ctx.lineTo(W, Y[i][cols - 1]);
      ctx.stroke();
    }

    /* embers */
    for (var k = 0; k < 24; k++) {
      var ph = hash(k, 5), life = (t * (0.04 + hash(k, 2) * 0.05) + ph) % 1;
      var ex = hash(k, 1) * W + 16 * Math.sin(t * 0.4 + ph * 6), ey = H * 0.86 - life * H * 0.8;
      var ea = Math.sin(life * Math.PI) * (0.5 + 0.5 * Math.sin(t * 6 + k));
      ctx.fillStyle = k % 4 === 0 ? QC[q(ea * 0.7)] : L[q(ea)]; ctx.fillRect(Math.round(ex), Math.round(ey), 2, 2);
    }
  }


  var visible = true, t0 = performance.now(), last = 0, tcur = 3, raf = 0;
  var onResize = function () { size(); render(tcur); };
  var io = new IntersectionObserver(function (e) { visible = e[0].isIntersecting; });
  size();
  // The full-page 404 hides the footer; rebuild when its host becomes visible again.
  var ro = new ResizeObserver(onResize); ro.observe(scene);
  addEventListener('resize', onResize);
  if (reduced) render(tcur);
  else {
    io.observe(scene);
    (function loop(now) {
      raf = requestAnimationFrame(loop);
      if (!visible || now - last < 33) return; last = now;
      tcur = Math.max(0, now - t0) / 1000 + 3; render(tcur);
    })(t0);
  }
  return {
    cleanup: function () { cancelAnimationFrame(raf); io.disconnect(); ro.disconnect(); removeEventListener('resize', onResize); },
    ridgeY: function (i, x) { return ridgeY(i, x); },
    ridgeCount: RZ.length,
  };
}
