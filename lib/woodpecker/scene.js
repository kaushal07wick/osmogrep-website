/* Hero woodpecker: the refined 304x152 engine from osmogrep-woodpecker-detailed.html, ported as an ES
   module. Pure computation, safe to import on the server. It draws the site's own bug with its moods.
   Site changes: twice the raster detail (608x304), and no error card or status line (only the
   'tok' pops and the CAUGHT tag remain as text). */
export const Woodpecker = (function () {
  'use strict';
  var CARD_COLS = 14;
  var CW = 0.075, RH = 0.125, COLS = 608, ROWS = 304;           // fine raster: world x = col*CW, y = row*RH
  var TCW = 0.6, TCOLS = 76, TROWS = 38;                   // coarse text grid: cell 0.6 x 1
  var WORLD_W = 45.6, WORLD_H = 38, CYCLE = 10;
  var RAMP = ' .:-=+*#%@';
  var N = COLS * ROWS, TN = TCOLS * TROWS;
  var V = new Float32Array(N), C = new Uint8Array(N), G = new Uint8Array(N);
  var TCH = new Array(TN), TC = new Uint8Array(TN);
  var BUGD = null;
  var CARD = { on: false, a: 1, x0: 1.2 + CARD_COLS * 0.6, y0: 1.15, x1: 28.8 + CARD_COLS * 0.6, y1: 7.75 };
  var PAL = { 1: '#1d1b19', 2: '#a58d70', 3: '#e0622a', 6: '#8f897f', 7: '#a9805a' };
  var FONT = '"Space Mono", ui-monospace, Menlo, Consolas, monospace';

  function clamp(x, a, b) { return x < a ? a : x > b ? b : x; }
  function lerp(a, b, t) { return a + (b - a) * t; }
  function sstep(a, b, x) { var t = clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); }
  function eIn(t) { t = clamp(t, 0, 1); return t * t * t; }
  function eOut(t) { t = clamp(t, 0, 1); return 1 - Math.pow(1 - t, 3); }
  function hash(x, y) { var n = Math.sin(x * 127.1 + y * 311.7) * 43758.5453; return n - Math.floor(n); }
  function vnoise(x, y) {
    var xi = Math.floor(x), yi = Math.floor(y), xf = x - xi, yf = y - yi;
    var u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf);
    var a = hash(xi, yi), b = hash(xi + 1, yi), c = hash(xi, yi + 1), d = hash(xi + 1, yi + 1);
    return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
  }

  /* ---------- fine-layer painting ---------- */
  function paint(x0, y0, x1, y1, dist, val, color, mark) {
    var c0 = Math.max(0, Math.floor(x0 / CW)), c1 = Math.min(COLS - 1, Math.ceil(x1 / CW));
    var r0 = Math.max(0, Math.floor(y0 / RH)), r1 = Math.min(ROWS - 1, Math.ceil(y1 / RH));
    for (var r = r0; r <= r1; r++) {
      var y = (r + 0.5) * RH;
      for (var c = c0; c <= c1; c++) {
        var x = (c + 0.5) * CW, d = dist(x, y);
        var cov = clamp(0.5 - d / 0.2, 0, 1);
        if (cov < 0.03) continue;
        var v = val ? val(x, y, c, r, d) : 1, i = r * COLS + c;
        V[i] += (v - V[i]) * cov;
        if(cov>.2){C[i]=color;G[i]=mark?mark(x,y,c,r,d):0;}
      }
    }
  }
  function ellA(cx, cy, rx, ry) {
    var m = Math.min(rx, ry);
    return function (x, y) { return (Math.hypot((x - cx) / rx, (y - cy) / ry) - 1) * m; };
  }
  function circ(cx, cy, r) { return function (x, y) { return Math.hypot(x - cx, y - cy) - r; }; }
  function cap(ax, ay, bx, by, r0, r1) {
    var dx = bx - ax, dy = by - ay, l2 = dx * dx + dy * dy || 1;
    return function (x, y) {
      var h = clamp(((x - ax) * dx + (y - ay) * dy) / l2, 0, 1);
      return Math.hypot(x - ax - dx * h, y - ay - dy * h) - lerp(r0, r1, h);
    };
  }
  /* coarse text layer: colors 1 ink, 3 orange, 4 white on orange, 6 dim, 7 wood chip */
  function put(col, row, str, color) {
    for (var k = 0; k < str.length; k++) {
      var c = col + k;
      if (c < 0 || c >= TCOLS || row < 0 || row >= TROWS) continue;
      TCH[row * TCOLS + c] = str[k]; TC[row * TCOLS + c] = color;
    }
  }

  /* ---------- scene constants ---------- */
  var PK = -2.2, REST_X = 25.4 + PK, REST_Y = 12.6;
  var BEAK = 5.9, BEAK_DY = 0.75, BUG_H2 = 1.75;
  var HOLE = { x: 32.4, y: 13.3 };
  var TAPS = [0.25, 0.75, 1.25, 1.75, 2.25, 2.75, 3.25];
  var MSGS = [
    { id: 'NULL-003', err: 'TypeError: user.profile is undefined', at: 'at notify (src/notify.ts:3:27)', why: 'profile is undefined until a user sets one' },
    { id: 'RACE-011', err: 'Race: customer charged twice', at: 'at worker (src/queue.ts:77:9)', why: 'two retries overlap under load' },
    { id: 'LEAK-007', err: 'Leak: +38MB per upload', at: 'at handle (src/upload.ts:203:5)', why: 'listener is never released after close' },
    { id: 'AUTH-014', err: 'Unhandled rejection: token refresh', at: 'at refresh (src/auth.ts:58:3)', why: 'refresh returns undefined after expiry' }
  ];
const LEGS_A = ['..k..k..k..k..', '.k..k..k..k...'];
const LEGS_B = ['...k..k..k..k.', '..k..k..k..k..'];
const SHADOW = '...ssssssss...';
const ANTENNAE = ['..............', '....kk..kk....', '.....k..k.....'];

// walk: the original bug exactly, eyes looking ahead; blinks every few steps.
const WALK_BODY = ['...oooooooo...', '..oookoookoo..', '..oooooooooo..', '...oooooooo...'];
const BLINK_BODY = ['...oooooooo...', '..oooooooooo..', '..oooooooooo..', '...oooooooo...'];
const WALK_A = [...ANTENNAE, ...WALK_BODY, ...LEGS_A, SHADOW];
const WALK_B = [...ANTENNAE, ...WALK_BODY, ...LEGS_B, SHADOW];
const WALK_BLINK = [...ANTENNAE, ...BLINK_BODY, ...LEGS_A, SHADOW];

// curious: stops, antennae perk up tall (one twitches), eyes glance ahead, then back over its shoulder.
const PERK = ['.....kk..kk...', '.....k...k....', '.....k..k.....'];
const PERK_TWITCH = ['.....kk.......', '.....k...kk...', '.....k..k.....'];
const LOOK_UP = ['...oooooooo...', '..ooookoooko..', '..oooooooooo..', '...oooooooo...'];
const LOOK_BACK = ['...oooooooo...', '..okoookoooo..', '..oooooooooo..', '...oooooooo...'];
const CURIOUS_A = [...PERK, ...LOOK_UP, ...LEGS_A, SHADOW];
const CURIOUS_B = [...PERK_TWITCH, ...LOOK_UP, ...LEGS_A, SHADOW];
const CURIOUS_C = [...PERK, ...LOOK_BACK, ...LEGS_A, SHADOW];

// scared: antennae shoot straight up in a V, eyes go wide, sweat drop, stiff tiptoe legs (+ shake).
const SCARED_A = [
  '...k......k...',
  '....k....k....',
  '.....k..k.....',
  '...oooooooo.k.',
  '..oowwoowwook.',
  '..oowkoowkoo..',
  '...dddddddd...',
  '..k..k..k..k..',
  '..k..k..k..k..',
  SHADOW,
];
const SCARED_B = SCARED_A.map((r, y) => (y === 5 ? '..ookwookwoo..' : r));

// caught: flipped on its back, x-eyes, antennae flopped out, stiff legs up, one twitching.
const CAUGHT_BODY = [
  '...dddddddd...',
  '..okokookoko..',
  '..ookooookoo..',
  '..okokookoko..',
  '.k.oooooooo.k.',
  'k............k',
];
const CAUGHT_A = ['..............', '..k..k..k..k..', '..k..k..k..k..', ...CAUGHT_BODY, SHADOW];
const CAUGHT_B = ['..............', '.k..k...k..k..', '..k..k..k..k..', ...CAUGHT_BODY, SHADOW];

// happy: fixed, shell goes green, ^ ^ eyes, little hop.
const HAPPY_BODY = ['...gggggggg...', '..ggkggggkgg..', '..gkgkggkgkg..', '...GGGGGGGG...'];
const HAPPY_A = [...ANTENNAE, ...HAPPY_BODY, ...LEGS_A, SHADOW];
const HAPPY_B = [...ANTENNAE.slice(1), ...HAPPY_BODY, '...k.k..k.k...', '..............', '..............', '....ssssss....'];


  function bugPath(ct) {
    var s = clamp((ct - 3.6) / 1.3, 0, 1);
    return {
      x: 29.6 + 2.6 * (1 - sstep(0, 0.25, s)) + 0.25 * Math.sin(s * 18),
      y: 13.3 - 3.7 * (s + 0.02 * Math.sin(s * 30)),
      sc: eOut((ct - 3.6) / 0.25)
    };
  }
  var BUGF = bugPath(4.9);

  var BUG_PIXEL=.235,BUG_ANCHOR={x:2.4,y:5.4};
  function state(ct) {
    var S={hx:REST_X,hy:REST_Y,bdy:0,bug:null,jaw:0};
    var contactX=BUGF.x+(BUG_ANCHOR.x-7)*BUG_PIXEL;
    var contactY=BUGF.y+(BUG_ANCHOR.y-5)*BUG_PIXEL;
    var tx=contactX-(BEAK-.28),ty=contactY-BEAK_DY;
    if(ct<3.5){
      var p=(ct%.5)/.5,pk=p<.25?PK*(1-eIn(p/.25)):PK*eOut((p-.25)/.75);
      S.hx=25.4+pk;S.hy=REST_Y+.3*(1-Math.abs(pk)/2.2);
    }else if(ct<4.9){
      S.hy=REST_Y-1.4*sstep(0,1,(ct-3.9));
      S.jaw=.34*sstep(4.72,4.95,ct);
      if(ct>=3.6){var b=bugPath(ct);S.bug={x:b.x,y:b.y,sc:b.sc,held:false,mood:ct>4.6?'scared':'walk'};}
    }else if(ct<5.35){
      var l=eIn((ct-4.9)/.25);S.hx=lerp(REST_X,tx,l);S.hy=lerp(REST_Y-1.4,ty,l);S.bdy=-.65*l;
      S.jaw=lerp(.34,.14,sstep(5.08,5.18,ct));
      if(ct<5.15)S.bug={x:BUGF.x,y:BUGF.y,sc:1,held:false,mood:'scared'};
    }else if(ct<6.05){
      var r=eOut((ct-5.35)/.7);S.hx=lerp(tx,REST_X,r);S.hy=lerp(ty,REST_Y,r);S.bdy=-.65*(1-r);
    }else if(ct<8.4)S.hy=REST_Y+.09*Math.sin(ct*2.2);
    else if(ct<9.2){var g=Math.abs(Math.sin(Math.PI*(ct-8.4)/.4));S.hx=REST_X+.6*g;S.hy=REST_Y+.25*g;}
    else S.hy=REST_Y+.09*Math.sin(ct*2.2);
    if(ct>=5.15&&ct<8.62){
      var age=ct-5.15,angle=.2*Math.sin(age*10)*Math.exp(-age*1.7);
      var scale=1-sstep(8.4,8.62,ct),gx=S.hx+BEAK-.28,gy=S.hy+BEAK_DY;
      var cx=(7-BUG_ANCHOR.x)*BUG_PIXEL*scale,cy=(5-BUG_ANCHOR.y)*BUG_PIXEL*scale;
      S.jaw=.14*scale;
      S.bug={x:gx+cx*Math.cos(angle)-cy*Math.sin(angle),y:gy+cx*Math.sin(angle)+cy*Math.cos(angle),
        sc:scale,held:true,mood:'caught',gripX:gx,gripY:gy,angle:angle,jaw:S.jaw};
    }
    return S;
  }

  /* ---------- drawing ---------- */
  function edgeX(y) { return 31 + 0.5 * Math.sin(y * 0.55) + 0.35 * Math.sin(y * 1.7 + 1.3); }


  // Convex outline keeps the bill pointed while every visible mark remains a glyph.
  function polygon(points) {
    return function (x, y) {
      var nearest = Infinity, inside = false;
      for (var i = 0, j = points.length - 1; i < points.length; j = i++) {
        var a = points[j], b = points[i], dx = b[0]-a[0], dy = b[1]-a[1];
        var t = clamp(((x-a[0])*dx+(y-a[1])*dy)/(dx*dx+dy*dy || 1),0,1);
        nearest = Math.min(nearest, Math.hypot(x-a[0]-t*dx,y-a[1]-t*dy));
        if ((a[1]>y)!==(b[1]>y) && x<(b[0]-a[0])*(y-a[1])/(b[1]-a[1])+a[0]) inside = !inside;
      }
      return inside ? -nearest : nearest;
    };
  }
  function stroke(ax, ay, bx, by, width, shade, color) {
    paint(Math.min(ax,bx)-width-.3,Math.min(ay,by)-width-.3,
      Math.max(ax,bx)+width+.3,Math.max(ay,by)+width+.3,
      cap(ax,ay,bx,by,width,width*.7),function(){return shade;},color || 1);
  }
  function drawTrunk() {
    paint(29,0,WORLD_W,WORLD_H,function(x,y){return edgeX(y)-x;},function(x,y,c,r){
      var depth=x-edgeX(y), warp=x+.16*Math.sin(y*.42)+.1*Math.sin(y*1.1+x);
      var grain=vnoise(warp*3.8,y*.09), ridge=Math.pow(Math.abs(Math.sin(warp*5.3+.45*Math.sin(y*.38))),14);
      var v=.15+.16*vnoise(warp*1.5,y*.2)+.2*ridge+.14*sstep(.52,.7,grain);
      // Elongated growth rings interrupt the vertical grain instead of adding random speckle.
      var knots=[[35.6,7.2,1.05,2.5],[40.8,23,1.25,3.1],[33.6,29,.65,1.9]];
      for(var k=0;k<knots.length;k++){
        var q=knots[k], rr=Math.hypot((x-q[0])/q[2],(y-q[1])/q[3]);
        if(rr<2.3) v=lerp(v,.16+.46*Math.pow(.5+.5*Math.cos(rr*16),5),1-sstep(1.2,2.3,rr));
      }
      v+=.25*(1-sstep(0,.75,depth));
      var fade=(.32+.68*sstep(0,4,y))*(1-sstep(31,38,y));
      return clamp(v*fade,.02,.8);
    },2);
    paint(30.7,11.8,34.1,14.8,ellA(HOLE.x,HOLE.y,1.45,1.3),function(x,y,c,r,d){return d>-.25?.7:.35;},2);
    paint(31,12.1,33.9,14.6,ellA(HOLE.x+.12,HOLE.y,1.12,.94),function(){return .92;},1);
  }
  function drawBird(S,ct,ptr) {
    var by=S.bdy,th=-.16,sn=Math.sin(th),cs=Math.cos(th);
    function along(x,y,cx,cy){return (x-cx)*sn-(y-cy)*cs;}
    function across(x,y,cx,cy){return (x-cx)*cs+(y-cy)*sn;}
    function ell(cx,cy,rx,ry){return function(x,y){return (Math.hypot(across(x,y,cx,cy)/rx,along(x,y,cx,cy)/ry)-1)*Math.min(rx,ry);};}
    // Photo references: swept crown, cheek stripe, layered scapulars and long folded primaries.
    for(var f=0;f<4;f++){
      var ax=24.5+f*.44,ay=27.0+by,bx=30.1+f*.38,by1=33.3-f*.25;
      var vx=bx-ax,vy=by1-ay,ll=Math.hypot(vx,vy);
      paint(23,25+by,32,35,cap(ax,ay,bx,by1,.53,.07),function(x,y,c,r,d){
        var u=((x-ax)*vx+(y-ay)*vy)/ll,v=((x-ax)*vy-(y-ay)*vx)/ll;
        if(d>-.13)return .42;
        if(Math.abs(v)<.065)return .26;
        return .71+.08*Math.sin(u*7+Math.abs(v)*8);
      },1,function(x,y,c,r,d){
        var u=((x-ax)*vx+(y-ay)*vy)/ll,v=((x-ax)*vy-(y-ay)*vx)/ll;
        if(Math.abs(v)<.055 && r%3!==0)return 92;
        return d<-.13 && hash(c,r)>.77 && Math.sin(u*8+Math.abs(v)*10)>.8?(v<0?47:92):0;
      });
    }
    var bcx=25,bcy=21.6+by;
    paint(20,13+by,30,30+by,ell(bcx,bcy,3.15,7.4),function(x,y,c,r,d){
      if(d>-.18)return .72;
      var u=across(x,y,bcx,bcy),a=along(x,y,bcx,bcy);
      return .73+.09*sstep(-2,2,u)+.045*vnoise(x*3,y*1.1);
    },1);
    var wingEnvelope=ell(24.15,21.5+by,2.6,6.85);
    // Long feather shafts and diagonal barbs replace the broad zebra bands.
    for(var f=0;f<9;f++){
      var wx=21.95+f*.36,wy=21.85+by-f*.13,ry=6.45-f*.31;
      var flight=ell(wx,wy,.64,ry);
      paint(wx-2,wy-ry-1,wx+2,wy+ry+1,function(x,y){return Math.max(flight(x,y),wingEnvelope(x,y));},function(x,y,c,r,d){
        var u=along(x,y,wx,wy),v=across(x,y,wx,wy);
        if(d>-.12)return .34;
        if(Math.abs(v)<.065)return .46;
        var barb=.5+.5*Math.sin(u*6.1+Math.abs(v)*11);
        return barb>.87?.5:.71+.12*sstep(-.45,.45,v);
      },1,function(x,y,c,r,d){
        var u=along(x,y,wx,wy),v=across(x,y,wx,wy);
        if(Math.abs(v)<.06 && r%3!==0)return 92;
        return d<-.14 && hash(c,r)>.72 && Math.sin(u*6.1+Math.abs(v)*11)>.75?(v<0?47:92):0;
      });
    }
    // Scalloped shoulder coverts form a denser upper wing over the long primaries.
    for(var row=0;row<5;row++)for(var f=0;f<6;f++){
      var fx=21.95+f*.49+row*.12,fy=16.35+by+row*.72;
      var covert=ell(fx,fy,.41,.86);
      paint(fx-.8,fy-1.2,fx+.8,fy+1.2,function(x,y){return Math.max(covert(x,y),wingEnvelope(x,y));},function(x,y,c,r,d){
        if(d>-.14)return .23;
        var a=along(x,y,fx,fy),v=across(x,y,fx,fy);
        return .66+.12*sstep(-.35,.35,v)+.035*Math.cos(a*3+v*5);
      },1,function(x,y,c,r,d){
        var a=along(x,y,fx,fy),v=across(x,y,fx,fy);
        if(Math.abs(v)<.05 && r%3===0)return 92;
        return d<-.15 && hash(c,r)>.82 && Math.sin(a*9+Math.abs(v)*10)>.85?(v<0?47:92):0;
      });
    }
    stroke(25.8,21.6+by,26.4,21+by,.12,.16);
    stroke(26.4,21+by,26.8,20.2+by,.12,.16);
    // Short ankles and paired opposing toes cling to the bark, rather than dangling.
    for(var leg=0;leg<2;leg++){
      var ly=22.7+leg*2.2,grip=edgeX(ly)+.08;
      stroke(27,ly-.7+by,28.65,ly+.35+by*.25,.28,.65);
      stroke(28.65,ly+.35+by*.25,29.65,ly,.21,.77);
      stroke(29.65,ly,grip-.12,ly-.68,.15,.76);
      stroke(grip-.12,ly-.68,grip+.25,ly-.12,.095,.9);
      stroke(29.65,ly,grip+.18,ly-.13,.13,.76);
      stroke(grip+.18,ly-.13,grip+.38,ly+.24,.085,.9);
      stroke(29.65,ly,grip-.4,ly+.78,.13,.74);
      stroke(grip-.4,ly+.78,grip-.1,ly+.98,.08,.9);
      stroke(29.65,ly,grip-.9,ly+.65,.12,.7);
      stroke(grip-.9,ly+.65,grip-.56,ly+.99,.08,.9);
      for(var scale=0;scale<7;scale++){
        var sx=28.55+scale*.19;
        stroke(sx,ly-.09,sx+.11,ly+.21,.045,.24);
        stroke(sx+.04,ly+.23,sx+.17,ly+.36,.035,.35);
      }
      paint(29.32,ly-.3,29.95,ly+.28,ellA(29.62,ly,.23,.2),function(x,y,c,r,d){return d>-.08?.24:.76;},1);
    }
    var hx=S.hx,hy=S.hy;
    paint(19,hy-2.5,28.4,19+by,cap(24.5,17.4+by,hx-.1,hy+.4,1.65,1.7),function(x,y,c,r,d){
      return d>-.16?.75:.7+.07*Math.sin(y*12+x*3);
    },1);
    // Continuous white cheek/neck stripe is the strongest marking in the real profile.
    paint(hx-2.6,hy-2.4,hx+2.6,hy+2.5,polygon([
      [hx-2.3,hy-.8],[hx-1.8,hy-1.8],[hx+.65,hy-1.65],
      [hx+2.3,hy-.2],[hx+1.9,hy+1.05],[hx+.1,hy+1.9],[hx-1.9,hy+1.45]
    ]),function(x,y,c,r,d){return d>-.13?.77:.72;},1,function(x,y,c,r,d){
      if(y>hy-.95 && y<hy+.1 && x<hx+.1){
        var flow=(x-hx)*3.1+(y-hy)*8;
        if(Math.sin(flow)>.74)return 47;
      }
      return 0;
    });
    stroke(hx-1.95,hy+.55,hx+.35,hy+.38,.31,.045);
    stroke(hx+1.45,hy+.94,hx+.25,hy+1.7,.37,.045);
    stroke(hx+.25,hy+1.7,24.6,17.3+by,.46,.045);
    stroke(24.6,17.3+by,26,18.2+by,.4,.06);
    stroke(26,18.2+by,27.2,20.1+by,.25,.07);
    stroke(27.2,20.1+by,27.7,22.1+by,.12,.08);
    for(var f=0;f<13;f++){
      var t=f/12,nx=lerp(hx+.25,24.6,t),ny=lerp(hy+1.7,17.3+by,t);
      stroke(nx-.36,ny+.02,nx-.61,ny+.31,.035,.13);
      stroke(nx+.36,ny+.03,nx+.56,ny+.22,.035,.17);
    }
    // Swept crown follows the references' long, low curve and ragged trailing feather tips.
    paint(hx-4.6,hy-3.1,hx+2,hy+.1,polygon([
      [hx-4.3,hy-.65],[hx-3.6,hy-1.55],[hx-2.85,hy-2.28],
      [hx-1.7,hy-2.55],[hx-.5,hy-2.3],[hx+.6,hy-1.8],[hx+1.6,hy-1.18],
      [hx+.45,hy-1.18],[hx-1.1,hy-1.0],[hx-2.55,hy-.18],[hx-3.05,hy-.85]
    ]),function(x,y,c,r,d){
      var shaft=.5+.5*Math.sin(((x-hx)*.48-(y-hy))*14);
      return d>-.12?.84:.64+.18*shaft;
    },3,function(x,y,c,r,d){
      var flow=((x-hx)*.48-(y-hy))*14;
      return Math.sin(flow)>.57?47:0;
    });
    for(var f=0;f<9;f++)stroke(hx-2.65+f*.23,hy-1.1-f*.105,hx-4.2+f*.19,hy-.64-f*.16,.065,.81,3);
    stroke(hx-.65,hy-.86,hx+1.6,hy-.7,.17,.045);
    var ex=hx+.9,ey=hy-.52;
    paint(ex-.8,ey-.8,ex+.8,ey+.8,circ(ex,ey,.7),function(){return .94;},1);
    paint(ex-.65,ey-.65,ex+.65,ey+.65,circ(ex,ey,.51),function(){return .83;},2);
    if(ct%3.7<.12)stroke(ex-.47,ey,ex+.47,ey,.12,.87);
    else{
      var target=ptr||S.bug||{x:ex+3,y:ey},dx=target.x-ex,dy=target.y-ey,len=Math.hypot(dx,dy)||1;
      var ox=dx/len*.11,oy=dy/len*.11;
      paint(ex-.6,ey-.6,ex+.6,ey+.6,circ(ex+ox,ey+oy,.31),function(){return .98;},1);
      paint(ex-.35,ey-.4,ex+.1,ey+.1,circ(ex+ox-.13,ey+oy-.15,.15),function(){return 0;},1);
    }
    stroke(hx-.65,hy+1.05,hx+1.75,hy+.38,.19,.76,3);
    var tipX=hx+BEAK,tipY=hy+BEAK_DY,jaw=S.jaw||0;
    paint(hx+1.2,hy-.65,tipX+.3,hy+1.9,polygon([
      [hx+1.45,hy-.25],[tipX,tipY-jaw],[hx+1.7,hy+.62]
    ]),function(x,y,c,r,d){return d>-.12?.82:.45;},1);
    paint(hx+1.2,hy+.3,tipX+.3,hy+2,polygon([
      [hx+1.7,hy+.68],[tipX-.12,tipY+jaw+.12],[hx+1.5,hy+1.16]
    ]),function(x,y,c,r,d){return d>-.12?.84:.65;},1);
    stroke(hx+1.9,hy+.59,tipX-.3,tipY,.045,.93);
    stroke(hx+2,hy+.04,hx+2.4,hy+.12,.075,.9);
    stroke(hx+2.15,hy+.23,tipX-.72,tipY-.12,.035,.18);
    stroke(hx+2.04,hy+1.02,tipX-.7,tipY+.22,.04,.39);
  }
  function drawChips(ct) {
    var times = TAPS.concat([3.55]);
    for (var k = 0; k < times.length; k++) {
      var ts = times[k], a = ct - ts;
      if (a < 0 || a > 0.9) continue;
      var cnt = ts > 3.5 ? 12 : 6;
      for (var i = 0; i < cnt; i++) {
        var vx = -(2.5 + 8 * hash(ts * 13.1, i)), vy = -(1 + 6 * hash(i * 7.7, ts * 3.3));
        var px = 31.0 + vx * a, py = 13.3 + vy * a + 7 * a * a;
        put(Math.floor(px / TCW), Math.floor(py), a < 0.3 ? '*' : a < 0.6 ? "'" : '.', 7);
      }
    }
  }

  function drawPopups(ct) {
    for (var k = 0; k < TAPS.length; k++) {
      var a = ct - TAPS[k];
      if (a < 0.04 || a > 0.55) continue;
      var last = k === TAPS.length - 1;
      put(33 + (k % 2) * 3, Math.floor(9 - 2.5 * a), last ? ' tonk?! ' : 'tok', last ? 4 : 6);
    }
  }

  function ring(x, y, a, ch) {
    var rad = 1 + 3.5 * a;
    for (var i = 0; i < 10; i++) {
      var an = i * Math.PI / 5 + a;
      put(Math.round((x + rad * Math.cos(an)) / TCW), Math.round(y + rad * 0.8 * Math.sin(an)), ch, 3);
    }
  }

  function cardChars(m) {
    var out = [];
    function add(r, c, s, col) { for (var k = 0; k < s.length; k++) out.push([c + CARD_COLS + k, r, s[k], col]); }
    add(2, 4, m.id, 3); add(2, 4 + m.id.length, '  runtime issue', 6);
    add(3, 4, m.err, 3); add(4, 4, m.at, 6); add(5, 4, m.why, 1);
    add(6, 4, ' osmogrep fix ', 4); add(6, 19, 'reproduced in sandbox', 6);
    return out;
  }

  function drawCard(ct, n) {
    var chars = cardChars(MSGS[n % MSGS.length]), total = chars.length, shown = 0;
    if (ct >= 6.1 && ct < 8.4) shown = Math.min(total, Math.floor((ct - 6.1) * 120));
    else if (ct >= 8.4 && ct < 9.0) shown = Math.floor(total * (1 - (ct - 8.4) / 0.6));
    CARD.on = shown > 0;
    CARD.a = ct < 6.3 ? clamp((ct - 6.1) / 0.2, 0, 1) : ct >= 8.4 ? clamp(1 - (ct - 8.4) / 0.6, 0, 1) : 1;
    for (var i = 0; i < shown; i++) put(chars[i][0], chars[i][1], chars[i][2], chars[i][3]);
  }

  function statusLine(ct, n) {
    var id = MSGS[n % MSGS.length].id, k = 0, i;
    if (ct < 0.25) return ['$ osmogrep run', 6];
    if (ct < 3.5) { for (i = 0; i < TAPS.length; i++) if (TAPS[i] <= ct) k++; return k >= 7 ? ['test 07/07  FAIL', 3] : ['running tests ' + ('0' + k).slice(-2) + '/07', 6]; }
    if (ct < 5.15) return ['reproducing ' + id + ' ...', 3];
    if (ct < 8.6) return ['1 runtime issue  ' + id + '  run osmogrep fix', 3];
    return ['fix applied  7/7 passing', 6];
  }

  var trunkV=null,trunkC=null;
  function frame(t, ptr) {
    V.fill(0); C.fill(0); G.fill(0); TC.fill(0);
    for (var i = 0; i < TN; i++) TCH[i] = '';
    var n = Math.floor(t / CYCLE), ct = t - n * CYCLE, S = state(ct);
    if(!trunkV){drawTrunk();trunkV=V.slice();trunkC=C.slice();}
    else {V.set(trunkV);C.set(trunkC);}
    drawBird(S, ct, ptr);
    BUGD = S.bug ? Object.assign({},S.bug,{t:t}) : null;
    drawChips(ct);
    drawPopups(ct);
    if (ct >= 5.15 && ct < 5.6) ring(S.hx + BEAK, S.hy + BEAK_DY, (ct - 5.15) / 0.45, '*');
    if (ct >= 8.6 && ct < 9.05) ring(REST_X + BEAK, REST_Y + BEAK_DY + 0.4, (ct - 8.6) / 0.45, '+');
    if (S.bug && ct >= 5.15) put(Math.round((S.bug.x + 2.9) / TCW), Math.round(S.bug.y - .3), ' CAUGHT ', 4);
    return n;
  }

  var GLYPHS=RAMP+String.fromCharCode(47,92);
  var glyphAtlas=null,trunkImage=null,trunkImageKey=null;
  /* ---------- canvas renderer ---------- */
  function draw(ctx, w, h, fontFamily) {
    var s = w / WORLD_W, fw = CW * s, fh = RH * s, i, r, c, k, ch;
    var fam = fontFamily || FONT;
    ctx.clearRect(0, 0, w, h);
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.font = (fh * 1.08) + 'px ' + fam;

    // Cache glyphs at display resolution: detail does not require thousands of font rasterizations.
    var dpr=ctx.getTransform().a, atlasKey=[fw,fh,dpr,fam].join('|');
    if(!glyphAtlas || glyphAtlas.key!==atlasKey){
      var aw=Math.ceil(fw*dpr)+2, ah=Math.ceil(fh*dpr)+2;
      var sheet=document.createElement('canvas');sheet.width=aw*GLYPHS.length;sheet.height=ah*3;
      var ac=sheet.getContext('2d');ac.textAlign='center';ac.textBaseline='middle';ac.font=(fh*.96*dpr)+'px '+fam;
      [1,2,3].forEach(function(color,row){ac.font=(color===1?'700 ':'400 ')+(fh*.96*dpr)+'px '+fam;ac.fillStyle=PAL[color];for(var k=1;k<GLYPHS.length;k++)ac.fillText(GLYPHS[k],(k+.5)*aw,(row+.5)*ah+fh*dpr*.04);});
      glyphAtlas={key:atlasKey,sheet:sheet,aw:aw,ah:ah};
    }
    var atlas=glyphAtlas,aw=atlas.aw,ah=atlas.ah;
    function glyph(target,value,color,c,r,mark){
      var k=mark?GLYPHS.indexOf(String.fromCharCode(mark)):Math.min(RAMP.length-1,Math.floor(value*(RAMP.length-.001)));if(k<=0)return;
      target.drawImage(atlas.sheet,k*aw,((color||1)-1)*ah,aw,ah,(c+.5)*fw-aw/(2*dpr),(r+.5)*fh-ah/(2*dpr),aw/dpr,ah/dpr);
    }
    if(!trunkImage || trunkImageKey!==atlasKey){
      trunkImage=document.createElement('canvas');trunkImage.width=ctx.canvas.width;trunkImage.height=ctx.canvas.height;
      var tree=trunkImage.getContext('2d');tree.setTransform(dpr,0,0,dpr,0,0);
      for(r=0;r<ROWS;r++)for(c=0;c<COLS;c++){i=r*COLS+c;glyph(tree,trunkV[i],trunkC[i],c,r);}
      trunkImageKey=atlasKey;
    }
    ctx.drawImage(trunkImage,0,0,trunkImage.width/dpr,trunkImage.height/dpr);
    // Clear changed cells before drawing the moving layer, including white cheek and belly cells.
    for(r=0;r<ROWS;r++)for(c=0;c<COLS;c++){
      i=r*COLS+c;if(V[i]!==trunkV[i] || C[i]!==trunkC[i] || G[i])ctx.clearRect(c*fw,r*fh,fw,fh);
    }
    for(r=0;r<ROWS;r++)for(c=0;c<COLS;c++){
      i=r*COLS+c;if(V[i]!==trunkV[i] || C[i]!==trunkC[i] || G[i])glyph(ctx,V[i],C[i],c,r,G[i]);
    }
    if(BUGD&&BUGD.sc>.03){
      var frames=BUGD.mood==='caught'?[CAUGHT_A,CAUGHT_B]:BUGD.mood==='scared'?[SCARED_A,SCARED_B]:[WALK_A,WALK_B,WALK_A,WALK_BLINK];
      var rows=frames[Math.floor(BUGD.t/(BUGD.held?.22:BUGD.mood==='scared'?.16:.3))%frames.length];
      var pixel=BUG_PIXEL*BUGD.sc*s;
      ctx.save();
      ctx.translate((BUGD.held?BUGD.gripX:BUGD.x)*s,(BUGD.held?BUGD.gripY:BUGD.y)*s);
      if(BUGD.held)ctx.rotate(BUGD.angle);
      var ox=BUGD.held?BUG_ANCHOR.x:7,oy=BUGD.held?BUG_ANCHOR.y:5;
      // Sprite rows and palette are the website mascot, including its caught expression.
      var colors={o:'#EA580C',d:'#9A3412',k:'#18181B',w:'#ffffff'};
      for(r=0;r<rows.length;r++)for(c=0;c<rows[r].length;c++){
        ch=rows[r][c];if(!colors[ch])continue;
        ctx.fillStyle=colors[ch];ctx.fillRect((c-ox)*pixel,(r-oy)*pixel,pixel+.04,pixel+.04);
      }
      ctx.restore();
      if(BUGD.held){
        // Repaint only the bill's last glyphs over the shell: the bug sits between the mandibles.
        var left=Math.floor((BUGD.gripX-.35)/CW),right=Math.ceil((BUGD.gripX+.28)/CW);
        var top=Math.floor((BUGD.gripY-.35)/RH),bottom=Math.ceil((BUGD.gripY+.4)/RH);
        for(r=top;r<=bottom;r++)for(c=left;c<=right;c++){
          if(c<0||c>=COLS||r<0||r>=ROWS)continue;
          i=r*COLS+c;if(C[i]===1&&V[i]>.35)glyph(ctx,V[i],1,c,r);
        }
      }
    }
    if (CARD.on) {                                          // light card with dashed border and corner brackets
      var x0 = CARD.x0 * s, y0 = CARD.y0 * s, x1 = CARD.x1 * s, y1 = CARD.y1 * s;
      ctx.save(); ctx.globalAlpha = CARD.a;
      ctx.fillStyle = '#fbfaf7'; ctx.fillRect(x0, y0, x1 - x0, y1 - y0);
      ctx.strokeStyle = 'rgba(29,27,25,.3)'; ctx.lineWidth = 1; ctx.setLineDash([3, 3]);
      ctx.strokeRect(x0 + .5, y0 + .5, x1 - x0 - 1, y1 - y0 - 1); ctx.setLineDash([]);
      ctx.strokeStyle = PAL[1]; ctx.lineWidth = 2; var L = Math.max(10, s * 0.9);
      [[x0, y0, 1, 1], [x1, y0, -1, 1], [x0, y1, 1, -1], [x1, y1, -1, -1]].forEach(function (p) {
        ctx.beginPath(); ctx.moveTo(p[0] + p[2] * L, p[1]); ctx.lineTo(p[0], p[1]); ctx.lineTo(p[0], p[1] + p[3] * L); ctx.stroke();
      });
      ctx.restore();
    }
    var tw = TCW * s, th = s;                                // coarse text
    ctx.font = (th * 0.82) + 'px ' + fam;
    for (r = 0; r < TROWS; r++) for (c = 0; c < TCOLS; c++) {
      i = r * TCOLS + c; if (TCH[i] === '') continue;
      if (TC[i] === 4) { ctx.fillStyle = PAL[3]; ctx.fillRect(c * tw, r * th + th * 0.06, tw + 0.5, th * 0.9); }
    }
    for (r = 0; r < TROWS; r++) for (c = 0; c < TCOLS; c++) {
      i = r * TCOLS + c; ch = TCH[i]; if (ch === '' || ch === ' ') continue;
      k = TC[i]; ctx.fillStyle = k === 4 ? '#ffffff' : PAL[k] || PAL[1];
      ctx.fillText(ch, (c + 0.5) * tw, (r + 0.5) * th + th * 0.04);
    }
  }

  return { WORLD_W: WORLD_W, WORLD_H: WORLD_H, CYCLE: CYCLE, frame: frame, draw: draw, PAL: PAL };
})();
