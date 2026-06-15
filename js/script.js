/* ═══ Justin Fang · 方 — portfolio interactions ═══ */

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ───────── shared petal drawing (anime cel-shaded) ───────── */
function hexRgb(h) {
  const v = parseInt(h.replace("#", ""), 16);
  return [(v >> 16) & 255, (v >> 8) & 255, v & 255];
}
function rgbStr(c) {
  return "rgb(" + (c[0] | 0) + "," + (c[1] | 0) + "," + (c[2] | 0) + ")";
}
/* per-petal color lerp — each frame the live colour eases toward its
   target, so a season change is a smooth wash, not a hard snap */
function tickPetalColor(p) {
  if (!p.fillRgb) return;
  const t = p.colorLerp || 0.06;
  for (let i = 0; i < 3; i++) {
    p.fillRgb[i] += (p.targetFillRgb[i] - p.fillRgb[i]) * t;
    p.lineRgb[i] += (p.targetLineRgb[i] - p.lineRgb[i]) * t;
  }
}

function drawPetal(ctx, p) {
  ctx.save();
  ctx.translate(p.x, p.y);
  ctx.rotate(p.rot);
  ctx.globalAlpha = p.alpha;
  const fillStr = p.fillRgb ? rgbStr(p.fillRgb) : p.color.fill;
  const lineStr = p.lineRgb ? rgbStr(p.lineRgb) : p.color.line;
  /* a soft seasonal glow so the petals pop hard against the ink-wash
     mountain backdrop — without it the bright pinks/yellows can look flat */
  ctx.shadowColor = fillStr;
  ctx.shadowBlur = Math.max(4, p.size * 0.9);
  ctx.beginPath();
  ctx.moveTo(0, -p.size);
  ctx.bezierCurveTo(p.size * 0.9, -p.size * 0.4, p.size * 0.55, p.size * 0.7, 0, p.size);
  ctx.bezierCurveTo(-p.size * 0.55, p.size * 0.7, -p.size * 0.9, -p.size * 0.4, 0, -p.size);
  ctx.closePath();
  ctx.fillStyle = fillStr;
  ctx.fill();
  ctx.shadowBlur = 0;
  ctx.lineJoin = "round";
  ctx.lineWidth = Math.max(1, p.size * 0.16);
  ctx.strokeStyle = lineStr;
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(-p.size * 0.22, -p.size * 0.5);
  ctx.quadraticCurveTo(-p.size * 0.42, 0, -p.size * 0.18, p.size * 0.4);
  ctx.strokeStyle = "rgba(255, 255, 255, 0.55)";
  ctx.lineWidth = Math.max(0.8, p.size * 0.09);
  ctx.lineCap = "round";
  ctx.stroke();
  ctx.restore();
}

/* ── seasonal palettes — petals transition winter → spring → summer →
   autumn as you scroll through the realm. saturated and bright so the
   change is unmistakable the instant a threshold is crossed. ── */
const SEASONS = {
  /* the landing page: soft plum blossoms drifting through the courtyard,
     a gentler pink than the in-scroll spring palette */
  blossoms: [
    { fill: "#ffd6e3", line: "#c4647d" },
    { fill: "#ffc0d4", line: "#a8455f" },
    { fill: "#ffb0c9", line: "#94324d" },
    { fill: "#ffe4ec", line: "#d68ca0" },
    { fill: "#ff9fbb", line: "#7a2843" },
    { fill: "#fff0f5", line: "#c98aa0" },
  ],
  winter: [
    { fill: "#ffffff", line: "#9bb4cc" },
    { fill: "#f4f8ff", line: "#86a2bc" },
    { fill: "#ffffff", line: "#aebfd4" },
    { fill: "#e8effa", line: "#7894b0" },
  ],
  spring: [
    { fill: "#ff3d8a", line: "#7a0a3a" },
    { fill: "#ff1493", line: "#600728" },
    { fill: "#ff6fb0", line: "#8b1a40" },
    { fill: "#ff9ec7", line: "#a02e4d" },
    { fill: "#ff2d6f", line: "#52051f" },
  ],
  summer: [
    { fill: "#00ff5e", line: "#00541d" },
    { fill: "#3dff7a", line: "#0a6b25" },
    { fill: "#00e052", line: "#003d12" },
    { fill: "#8cff9b", line: "#137a2a" },
    { fill: "#46ff86", line: "#075420" },
  ],
  autumn: [
    { fill: "#ffd900", line: "#7a5e00" },
    { fill: "#ffeb3b", line: "#8a6a00" },
    { fill: "#ffc107", line: "#664a00" },
    { fill: "#ffe14d", line: "#705500" },
    { fill: "#ffb400", line: "#5c3f00" },
  ],
};

/* landing opens on soft plum blossoms drifting from the courtyard tree.
   the seasonal cycle (winter → spring → summer → autumn) only kicks in
   once the user has entered the realm and started scrolling. */
let currentSeason = "blossoms";

function pickPetalColor() {
  const palette = SEASONS[currentSeason];
  return palette[(Math.random() * palette.length) | 0];
}

/* eagerly retint every active petal when the season changes, so the
   transition is unmistakable instead of waiting for old petals to fall
   off and respawn. */
function retintAllPetals() {
  const apply = (p) => {
    const c = pickPetalColor();
    p.color = c;
    const f = hexRgb(c.fill);
    const l = hexRgb(c.line);
    if (!p.fillRgb) {
      p.fillRgb = [...f];
      p.lineRgb = [...l];
    }
    p.targetFillRgb = f;
    p.targetLineRgb = l;
  };
  if (Array.isArray(petals)) for (const p of petals) apply(p);
  if (Array.isArray(burst)) for (const b of burst) if (b.petal) apply(b);
  if (Array.isArray(window.__bgPetals)) for (const p of window.__bgPetals) apply(p);
}

function makePetal(w, h, fromTop = false) {
  const c = pickPetalColor();
  const fillRgb = hexRgb(c.fill);
  const lineRgb = hexRgb(c.line);
  return {
    x: Math.random() * w,
    y: fromTop ? -20 : Math.random() * h,
    size: 5 + Math.random() * 9,
    alpha: 0.45 + Math.random() * 0.5,
    color: c,
    fillRgb: [...fillRgb],
    lineRgb: [...lineRgb],
    targetFillRgb: [...fillRgb],
    targetLineRgb: [...lineRgb],
    vy: 0.25 + Math.random() * 0.7,
    vx: -0.15 + Math.random() * 0.3,
    rot: Math.random() * Math.PI * 2,
    vr: -0.012 + Math.random() * 0.024,
    sway: Math.random() * Math.PI * 2,
    swaySpeed: 0.004 + Math.random() * 0.01,
    swayAmp: 0.3 + Math.random() * 0.7,
  };
}

function sizeCanvas(canvas) {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

const landing = document.getElementById("landing");
const lCanvas = document.getElementById("landing-canvas");
const lCtx = lCanvas.getContext("2d");
sizeCanvas(lCanvas);

let landingActive = true;
let petals = [];
let trail = [];   
let burst = [];   
const mouse = { x: -999, y: -999 };

function spawnTreePetal(w, h, initial) {
  const p = makePetal(w, h, true);
  p.y = initial ? Math.random() * h : -20 + Math.random() * h * 0.25;
  p.x = w - (Math.random() * w * 0.5 + (p.y / h) * w * 0.3);
  p.vx = -(0.05 + Math.random() * 0.4);
  return p;
}

/* descent-mode spawn — petals appear below the viewport, spread across
   the full width, and fly upward past the falling camera */
let isDescending = false;
function spawnDescentPetal(w, h) {
  const p = makePetal(w, h, true);
  p.x = Math.random() * w;
  p.y = h + 20 + Math.random() * 120;
  p.vx = (Math.random() - 0.5) * 0.6;
  p.vy = -(8 + Math.random() * 18);
  p.swayAmp = 0.2 + Math.random() * 0.4;
  return p;
}

const LANDING_PETALS = reducedMotion ? 0 : Math.min(110, (innerWidth * innerHeight) / 11000);
for (let i = 0; i < LANDING_PETALS; i++) petals.push(spawnTreePetal(lCanvas.width, lCanvas.height, true));

const orb = document.createElement("div");
orb.id = "cursor-orb";
orb.style.opacity = "0";
document.body.appendChild(orb);

const targetCursor = document.createElement("div");
targetCursor.id = "target-cursor";
targetCursor.innerHTML =
  '<span class="tc-dot"></span>' +
  '<span class="tc-rot">' +
  '<span class="tc-corner tc-tl"></span><span class="tc-corner tc-tr"></span>' +
  '<span class="tc-corner tc-br"></span><span class="tc-corner tc-bl"></span>' +
  "</span>";
document.body.appendChild(targetCursor);
const tcCorners = {
  tl: targetCursor.querySelector(".tc-tl"),
  tr: targetCursor.querySelector(".tc-tr"),
  br: targetCursor.querySelector(".tc-br"),
  bl: targetCursor.querySelector(".tc-bl"),
};
let tcLockTarget = null;

function updateTargetLock(e) {
  if (!tcLockTarget) return;
  const r = tcLockTarget.getBoundingClientRect();
  const pad = 8, size = 14;
  tcCorners.tl.style.transform = `translate(${r.left - pad - e.clientX}px, ${r.top - pad - e.clientY}px)`;
  tcCorners.tr.style.transform = `translate(${r.right + pad - size - e.clientX}px, ${r.top - pad - e.clientY}px)`;
  tcCorners.br.style.transform = `translate(${r.right + pad - size - e.clientX}px, ${r.bottom + pad - size - e.clientY}px)`;
  tcCorners.bl.style.transform = `translate(${r.left - pad - e.clientX}px, ${r.bottom + pad - size - e.clientY}px)`;
}

window.addEventListener("mousemove", (e) => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
  if (landingActive) {
    targetCursor.style.opacity = "1";
    targetCursor.style.left = e.clientX + "px";
    targetCursor.style.top = e.clientY + "px";
    updateTargetLock(e);
  } else {
    orb.style.opacity = "1";
    orb.style.left = e.clientX + "px";
    orb.style.top = e.clientY + "px";
    if (!reducedMotion) {
      trail.push({
        x: e.clientX + (Math.random() - 0.5) * 10,
        y: e.clientY + (Math.random() - 0.5) * 10,
        size: 1.5 + Math.random() * 2.5,
        alpha: 0.9,
        vx: (Math.random() - 0.5) * 0.6,
        vy: (Math.random() - 0.5) * 0.6 - 0.3,
      });
      if (trail.length > 90) trail.splice(0, trail.length - 90);
    }
  }
});

function drawTrail(ctx) {
  for (let i = trail.length - 1; i >= 0; i--) {
    const t = trail[i];
    t.alpha -= 0.025;
    t.x += t.vx;
    t.y += t.vy;
    if (t.alpha <= 0) { trail.splice(i, 1); continue; }
    ctx.globalAlpha = t.alpha;
    ctx.fillStyle = "#7ef2c0";
    ctx.shadowColor = "#34e89e";
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.arc(t.x, t.y, t.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.globalAlpha = 1;
  }
}

const enterBtn = document.getElementById("enter-btn");
enterBtn.addEventListener("mouseenter", (e) => {
  tcLockTarget = enterBtn;
  targetCursor.classList.add("locked");
  updateTargetLock(e);
});
enterBtn.addEventListener("mouseleave", () => {
  tcLockTarget = null;
  targetCursor.classList.remove("locked");
  for (const c of Object.values(tcCorners)) c.style.transform = "";
});

function landingFrame() {
  if (!landingActive) return;
  lCtx.clearRect(0, 0, lCanvas.width, lCanvas.height);

  for (const p of petals) {
    p.sway += p.swaySpeed;
    p.gvx = (p.gvx || 0) * 0.95;
    p.gvy = (p.gvy || 0) * 0.95;
    p.x += p.vx + p.gvx + Math.sin(p.sway) * p.swayAmp * 0.4;
    p.y += p.vy + p.gvy;
    p.rot += p.vr;
    const dx = p.x - mouse.x, dy = p.y - mouse.y;
    const d2 = dx * dx + dy * dy;
    if (d2 < 9000 && d2 > 1) {
      const f = 60 / d2;
      p.x += dx * f;
      p.y += dy * f;
    }
    if (isDescending) {
      /* during descent: anything that scrolls off the top OR the bottom
         comes back from below, spread across the full width, flying
         upward — you're falling past them */
      if (p.y < -40 || p.y > lCanvas.height + 80) {
        Object.assign(p, spawnDescentPetal(lCanvas.width, lCanvas.height));
      }
    } else {
      if (p.y > lCanvas.height + 24) Object.assign(p, spawnTreePetal(lCanvas.width, lCanvas.height, false));
      if (p.y < -40) Object.assign(p, spawnTreePetal(lCanvas.width, lCanvas.height, false));
    }
    if (p.x < -30) p.x = lCanvas.width + 20;
    if (p.x > lCanvas.width + 30) p.x = -20;
    tickPetalColor(p);
    drawPetal(lCtx, p);
  }

  drawTrail(lCtx);

  for (let i = burst.length - 1; i >= 0; i--) {
    const b = burst[i];
    b.x += b.vx;
    b.y += b.vy;
    b.vx *= 0.985;
    b.vy = b.vy * 0.985 + 0.05;
    b.alpha -= b.decay;
    b.rot += b.vr;
    if (b.alpha <= 0) { burst.splice(i, 1); continue; }
    if (b.petal) {
      tickPetalColor(b);
      drawPetal(lCtx, b);
    } else {
      lCtx.globalAlpha = b.alpha;
      lCtx.fillStyle = b.fillRgb ? rgbStr(b.fillRgb) : b.color.fill;
      lCtx.shadowColor = "#34e89e";
      lCtx.shadowBlur = 10;
      lCtx.beginPath();
      lCtx.arc(b.x, b.y, b.size, 0, Math.PI * 2);
      lCtx.fill();
      lCtx.shadowBlur = 0;
      lCtx.globalAlpha = 1;
    }
  }

  requestAnimationFrame(landingFrame);
}
landingFrame();

function blastPetals(angleDeg) {
  const t = (angleDeg * Math.PI) / 180;
  const dx = Math.cos(t), dy = Math.sin(t);
  const px = -dy, py = dx;
  const cx = lCanvas.width / 2, cy = lCanvas.height / 2;
  for (const p of petals) {
    const side = Math.sign(dx * (p.y - cy) - dy * (p.x - cx)) || 1;
    const s = 5 + Math.random() * 8;
    p.gvx = (p.gvx || 0) + px * side * s + (Math.random() - 0.5) * 3;
    p.gvy = (p.gvy || 0) + py * side * s + (Math.random() - 0.5) * 3;
    p.vr += (Math.random() - 0.5) * 0.3;
  }
}

let entered = false;
enterBtn.addEventListener("click", () => {
  if (entered) return;
  entered = true;

  landing.classList.add("splashing");

  let descentAccel = null;
  if (!reducedMotion) {
    /* descent starts immediately — give every petal a small upward kick
       so the falling stops and the rise begins right away (no bulk reset
       of positions, just velocity), then ramp acceleration upward */
    for (const p of petals) {
      p.vy = -2 - Math.random() * 3;
      p.swayAmp *= 0.6;
    }
    isDescending = true;
    descentAccel = setInterval(() => {
      for (const p of petals) {
        p.vy = Math.max((p.vy || 0) * 1.10 - 0.55, -34);
        p.vx *= 0.93;
        p.swayAmp *= 0.9;
        p.colorLerp = 0.12;
      }
    }, 40);

    /* cycle the seasons under our feet as we descend — these set the
       target only; each petal eases there over a few frames */
    setTimeout(() => { currentSeason = "spring";  retintAllPetals(); }, 50);
    setTimeout(() => { currentSeason = "summer";  retintAllPetals(); }, 800);
    setTimeout(() => { currentSeason = "autumn";  retintAllPetals(); }, 1550);
  }

  const SLAM_AT = reducedMotion ? 30 : 2300;

  /* the slam: whiteout flash + shake + hard stop on the descent. petals
     keep their upward velocity but we stop recycling them from below,
     so the stream tapers off as they exit the top of the screen. */
  setTimeout(() => {
    landing.classList.add("slamming");
    if (descentAccel) { clearInterval(descentAccel); descentAccel = null; }
    isDescending = false;
    if (!reducedMotion) {
      for (const p of petals) {
        p.gvx = (Math.random() - 0.5) * 4;
        p.gvy = (Math.random() - 0.5) * 4;
        p.colorLerp = 0.18;
      }
    }
  }, SLAM_AT);

  /* after the slam: drop into winter snow and apply grayscale */
  setTimeout(() => {
    document.documentElement.classList.add("ink");
    currentSeason = "winter";
    retintAllPetals();
  }, SLAM_AT + 250);

  /* sword slashes follow the slam — no tornado gather; petals keep
     streaming upward and the slashes just rip through them */
  const SWORD_AT = SLAM_AT + 350;
  setTimeout(() => { landing.classList.add("entering"); }, SWORD_AT);

  if (!reducedMotion) {
    const SLASHES = [ { at: 200, angle: -24 }, { at: 400, angle: 63 }, { at: 600, angle: -76 } ];
    for (const s of SLASHES) { setTimeout(() => blastPetals(s.angle), SWORD_AT + s.at); }
    setTimeout(() => {
      const cx = lCanvas.width / 2, cy = lCanvas.height / 2;
      for (let i = 0; i < 140; i++) {
        const ang = Math.random() * Math.PI * 2;
        const speed = 2 + Math.random() * 9;
        const isPetal = Math.random() < 0.55;
        const c = pickPetalColor();
        const f = hexRgb(c.fill);
        const l = hexRgb(c.line);
        burst.push({
          petal: isPetal,
          x: cx, y: cy,
          vx: Math.cos(ang) * speed,
          vy: Math.sin(ang) * speed,
          size: isPetal ? 4 + Math.random() * 8 : 1.5 + Math.random() * 3,
          alpha: 1,
          decay: 0.006 + Math.random() * 0.012,
          color: c,
          fillRgb: [...f],
          lineRgb: [...l],
          targetFillRgb: [...f],
          targetLineRgb: [...l],
          rot: Math.random() * Math.PI * 2,
          vr: -0.08 + Math.random() * 0.16,
        });
      }
    }, SWORD_AT + 200);
  }

  const mainEl = document.getElementById("main");
  const shatterEl = document.getElementById("shatter");
  const SHATTER_AT = SWORD_AT + 1000;

  setTimeout(() => {
    landingActive = false;
    shatterEl.classList.add("go");
    landing.style.display = "none";
    if (targetCursor) targetCursor.remove();

    mainEl.hidden = false;
    initMain();
    void mainEl.offsetWidth;
    mainEl.classList.add("arrived");
    document.body.style.overflow = "auto";
  }, SHATTER_AT);

  setTimeout(() => {
    landing.remove();
    shatterEl.remove();
  }, SHATTER_AT + 1500);
});

document.body.style.overflow = "hidden";

/* ═══════════ MAIN SCENE ═══════════ */
let mainStarted = false;
function initMain() {
  if (mainStarted) return;
  mainStarted = true;

  const io = new IntersectionObserver(
    (entries) => {
      for (const en of entries) {
        if (en.isIntersecting) {
          en.target.classList.add("shown");
          io.unobserve(en.target);
        }
      }
    },
    { threshold: 0.12 }
  );
  document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

  const sections = document.querySelectorAll("header[id], section[id]");
  const navLinks = document.querySelectorAll(".nav-links a");

  const navObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          navLinks.forEach((link) => link.classList.remove("active"));
          const activeLink = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
          if (activeLink) activeLink.classList.add("active");
        }
      });
    },
    /* This creates a tight window in the absolute center of your screen. 
       A section MUST cross the middle of the monitor to light up! */
    { rootMargin: "-40% 0px -40% 0px" } 
  );
  sections.forEach((sec) => navObserver.observe(sec));

  const mountain = document.querySelector(".ink-mountain");
  if (mountain) {
    const BASE_OPACITY = 0.42;
    const fadeMountain = () => {
      const f = Math.max(0, 1 - window.scrollY / (window.innerHeight * 0.85));
      mountain.style.opacity = (BASE_OPACITY * f).toFixed(3);
    };
    window.addEventListener("scroll", fadeMountain, { passive: true });
    fadeMountain();
  }

  /* ── seasonal scroll-cycle: as the user descends through the realm,
        the falling petals shift from winter snow → spring plum blossoms
        → summer green → autumn cinnabar leaves ── */
  const updateSeason = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const p = max > 0 ? window.scrollY / max : 0;
    const next =
      p < 0.18 ? "winter" :
      p < 0.45 ? "spring" :
      p < 0.72 ? "summer" : "autumn";
    if (next !== currentSeason) {
      currentSeason = next;
      document.body.dataset.season = next;
      retintAllPetals();
    }
  };
  window.addEventListener("scroll", updateSeason, { passive: true });
  /* force winter snow the moment the user lands on the main scene */
  currentSeason = "winter";
  retintAllPetals();
  document.body.dataset.season = currentSeason;
  updateSeason();

  document.querySelectorAll(".proj-card").forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const r = card.getBoundingClientRect();
      card.style.setProperty("--mx", e.clientX - r.left + "px");
      card.style.setProperty("--my", e.clientY - r.top + "px");
    });
  });

  const canvas = document.getElementById("main-canvas");
  const ctx = canvas.getContext("2d");
  sizeCanvas(canvas);

  if (reducedMotion) return;

  const bgPetals = [];
  window.__bgPetals = bgPetals;
  const motes = [];
  const N_PETALS = Math.min(60, (innerWidth * innerHeight) / 20000);
  const N_MOTES = Math.min(50, (innerWidth * innerHeight) / 22000);

  for (let i = 0; i < N_PETALS; i++) {
    const p = makePetal(canvas.width, canvas.height);
    p.vy *= 0.55;
    /* keep petals close to fully opaque so the bright seasonal colour
       reads against the dark mountain — was 0.85 multiplier before */
    p.alpha = Math.max(0.78, p.alpha);
    bgPetals.push(p);
  }
  for (let i = 0; i < N_MOTES; i++) {
    motes.push({
      x: Math.random() * canvas.width, y: Math.random() * canvas.height,
      size: 0.8 + Math.random() * 1.8, alpha: 0.15 + Math.random() * 0.4,
      vy: -(0.1 + Math.random() * 0.3), vx: (Math.random() - 0.5) * 0.15,
      tw: Math.random() * Math.PI * 2,
    });
  }

  function mainFrame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = "rgba(52, 232, 158, 0.07)";
    ctx.lineWidth = 1;
    for (let i = 0; i < motes.length; i++) {
      for (let j = i + 1; j < motes.length; j++) {
        const dx = motes[i].x - motes[j].x, dy = motes[i].y - motes[j].y;
        if (dx * dx + dy * dy < 13000) {
          ctx.beginPath(); ctx.moveTo(motes[i].x, motes[i].y); ctx.lineTo(motes[j].x, motes[j].y); ctx.stroke();
        }
      }
    }

    for (const m of motes) {
      m.x += m.vx; m.y += m.vy; m.tw += 0.02;
      if (m.y < -10) { m.y = canvas.height + 10; m.x = Math.random() * canvas.width; }
      if (m.x < -10) m.x = canvas.width + 10;
      if (m.x > canvas.width + 10) m.x = -10;
      ctx.globalAlpha = m.alpha * (0.6 + 0.4 * Math.sin(m.tw));
      ctx.fillStyle = "#7ef2c0";
      ctx.beginPath(); ctx.arc(m.x, m.y, m.size, 0, Math.PI * 2); ctx.fill();
      ctx.globalAlpha = 1;
    }

    for (const p of bgPetals) {
      p.sway += p.swaySpeed;
      p.x += p.vx + Math.sin(p.sway) * p.swayAmp * 0.3;
      p.y += p.vy; p.rot += p.vr;
      if (p.y > canvas.height + 24) {
        Object.assign(p, makePetal(canvas.width, canvas.height, true));
        p.vy *= 0.55;
        p.alpha = Math.max(0.78, p.alpha);
      }
      tickPetalColor(p);
      drawPetal(ctx, p);
    }
    drawTrail(ctx);
    requestAnimationFrame(mainFrame);
  }
  mainFrame();

  window.addEventListener("resize", () => sizeCanvas(canvas));
}

window.addEventListener("resize", () => { if (landingActive) sizeCanvas(lCanvas); });

/* If the page was deep-linked to a specific section (e.g. you came back
   from a project scroll with #projects in the URL), skip the cinematic
   and drop straight onto the main page. A plain reload (no hash, or
   just #hero) always shows the landing again. */
function skipLandingDirectly() {
  if (entered) return;
  entered = true;
  landingActive = false;
  document.documentElement.classList.add("ink");
  const mainEl = document.getElementById("main");
  const shatterEl = document.getElementById("shatter");
  mainEl.hidden = false;
  initMain();
  mainEl.classList.add("arrived");
  if (landing) landing.remove();
  if (shatterEl) shatterEl.remove();
  if (targetCursor) targetCursor.remove();
  document.body.style.overflow = "auto";
}

if (location.hash && location.hash !== "#hero") {
  skipLandingDirectly();
}