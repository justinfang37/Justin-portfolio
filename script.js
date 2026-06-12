/* ═══ Justin Fang · 方 — portfolio interactions ═══ */

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ───────── shared petal drawing (anime cel-shaded) ───────── */
function drawPetal(ctx, p) {
  ctx.save();
  ctx.translate(p.x, p.y);
  ctx.rotate(p.rot);
  ctx.globalAlpha = p.alpha;
  ctx.beginPath();
  ctx.moveTo(0, -p.size);
  ctx.bezierCurveTo(p.size * 0.9, -p.size * 0.4, p.size * 0.55, p.size * 0.7, 0, p.size);
  ctx.bezierCurveTo(-p.size * 0.55, p.size * 0.7, -p.size * 0.9, -p.size * 0.4, 0, -p.size);
  ctx.closePath();
  ctx.fillStyle = p.color.fill;
  ctx.fill();
  ctx.lineJoin = "round";
  ctx.lineWidth = Math.max(1, p.size * 0.16);
  ctx.strokeStyle = p.color.line;
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

const PETAL_COLORS = [
  { fill: "#4ce06a", line: "#156d2d" },
  { fill: "#2fc452", line: "#0f5a23" },
  { fill: "#8df2a4", line: "#2e9e4e" },
  { fill: "#f5d98a", line: "#bb8f33" },
];

function makePetal(w, h, fromTop = false) {
  return {
    x: Math.random() * w,
    y: fromTop ? -20 : Math.random() * h,
    size: 5 + Math.random() * 9,
    alpha: 0.45 + Math.random() * 0.5,
    color: PETAL_COLORS[(Math.random() * PETAL_COLORS.length) | 0],
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
let isFormingRing = false; 
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
    if (isFormingRing) {
      const cx = lCanvas.width / 2;
      const cy = lCanvas.height / 2;
      p.ringAngle += p.ringSpeed;
      const tx = cx + Math.cos(p.ringAngle) * p.ringRadius;
      const ty = cy + Math.sin(p.ringAngle) * p.ringRadius;
      p.x += (tx - p.x) * 0.08;
      p.y += (ty - p.y) * 0.08;
      p.trot = p.ringAngle + Math.PI / 2; 
      let dRot = (p.trot - p.rot) % (Math.PI * 2);
      if (dRot > Math.PI) dRot -= Math.PI * 2;
      if (dRot < -Math.PI) dRot += Math.PI * 2;
      p.rot += dRot * 0.1;
      p.gvx = (p.gvx || 0) * 0.95;
      p.gvy = (p.gvy || 0) * 0.95;
      p.x += p.gvx;
      p.y += p.gvy;
    } else {
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
      if (p.y > lCanvas.height + 24) Object.assign(p, spawnTreePetal(lCanvas.width, lCanvas.height, false));
      if (p.x < -30) p.x = lCanvas.width + 20;
      if (p.x > lCanvas.width + 30) p.x = -20;
    }
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
      drawPetal(lCtx, b);
    } else {
      lCtx.globalAlpha = b.alpha;
      lCtx.fillStyle = b.color.fill;
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

function petalStorm() {
  const w = lCanvas.width, h = lCanvas.height;
  for (let i = 0; i < 130; i++) {
    const fromLeft = Math.random() < 0.5;
    burst.push({
      petal: true,
      x: fromLeft ? -30 - Math.random() * 120 : w + 30 + Math.random() * 120,
      y: Math.random() * h,
      vx: (fromLeft ? 1 : -1) * (7 + Math.random() * 11),
      vy: -2.5 + Math.random() * 5,
      size: 5 + Math.random() * 9,
      alpha: 0.85 + Math.random() * 0.15,
      decay: 0.003 + Math.random() * 0.004,
      color: PETAL_COLORS[(Math.random() * PETAL_COLORS.length) | 0],
      rot: Math.random() * Math.PI * 2,
      vr: -0.2 + Math.random() * 0.4,
    });
  }
  for (const p of petals) {
    p.gvx = (p.gvx || 0) + (Math.random() - 0.5) * 14;
    p.gvy = (p.gvy || 0) + (Math.random() - 0.5) * 10;
    p.vr += (Math.random() - 0.5) * 0.4;
  }
}

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
  setTimeout(() => { document.documentElement.classList.add("ink"); }, reducedMotion ? 0 : 1600);

  if (!reducedMotion) {
    setTimeout(() => {
      petalStorm();
      isFormingRing = true;
      const cx = lCanvas.width / 2;
      const cy = lCanvas.height / 2;
      const baseRadius = Math.min(cx, cy) * 0.95;
      petals.forEach((p) => {
        p.ringAngle = Math.random() * Math.PI * 2;
        p.ringRadius = baseRadius + (Math.random() - 0.5) * (baseRadius * 0.9);
        p.ringSpeed = 0.03 + Math.random() * 0.06;
      });
    }, 1200);
  }

  const SWORD_AT = reducedMotion ? 30 : 2400;

  setTimeout(() => { landing.classList.add("entering"); }, SWORD_AT);

  if (!reducedMotion) {
    setTimeout(() => { isFormingRing = false; }, SWORD_AT + 100);
    const SLASHES = [ { at: 200, angle: -24 }, { at: 400, angle: 63 }, { at: 600, angle: -76 } ];
    for (const s of SLASHES) { setTimeout(() => blastPetals(s.angle), SWORD_AT + s.at); }
    setTimeout(() => {
      const cx = lCanvas.width / 2, cy = lCanvas.height / 2;
      for (let i = 0; i < 140; i++) {
        const ang = Math.random() * Math.PI * 2;
        const speed = 2 + Math.random() * 9;
        const isPetal = Math.random() < 0.55;
        burst.push({
          petal: isPetal,
          x: cx, y: cy,
          vx: Math.cos(ang) * speed,
          vy: Math.sin(ang) * speed,
          size: isPetal ? 4 + Math.random() * 8 : 1.5 + Math.random() * 3,
          alpha: 1,
          decay: 0.006 + Math.random() * 0.012,
          color: PETAL_COLORS[(Math.random() * PETAL_COLORS.length) | 0],
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
  const motes = [];
  const N_PETALS = Math.min(60, (innerWidth * innerHeight) / 20000);
  const N_MOTES = Math.min(50, (innerWidth * innerHeight) / 22000);

  for (let i = 0; i < N_PETALS; i++) {
    const p = makePetal(canvas.width, canvas.height);
    p.vy *= 0.55; p.alpha *= 0.85; bgPetals.push(p);
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
        p.vy *= 0.55; p.alpha *= 0.85;
      }
      drawPetal(ctx, p);
    }
    drawTrail(ctx);
    requestAnimationFrame(mainFrame);
  }
  mainFrame();

  window.addEventListener("resize", () => sizeCanvas(canvas));
}

window.addEventListener("resize", () => { if (landingActive) sizeCanvas(lCanvas); });

if (location.hash && location.hash !== "#hero") { enterBtn.click(); }