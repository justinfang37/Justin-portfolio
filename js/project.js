/* ═══ Justin Fang · project scroll page ═══ */

const PROJECTS = {
  "robot-nav": {
    title: "Autonomous Robot Navigation",
    kicker: "A scroll of the Iron Steed",
    image: "assets/projects/robot-nav.jpg",
    video: "https://www.youtube.com/embed/6_97NwCJwpA",
    videoCaption: "Live demo in Foxglove — costmap inflation, planned path, first-person feed.",
    github: "https://github.com/smzhng/wato_asd_training",
    videoCaption: "Live navigation in Foxglove — costmap inflation, planned path, and first-person view.",
    stack: "C++ · ROS 2 · Docker · Foxglove",
    role: "Sole developer",
    date: "May 2026",
    summary:
      "A differential-drive ROS 2 stack that turns raw lidar scans into a navigable occupancy-grid costmap — the foundation for a path-planning robot that can see what's in front of it.",
    sections: [
      {
        heading: "The Problem",
        body:
          "A wheeled robot armed with a 2D lidar receives only polar data: a list of ranges at angular offsets. To plan a path, it needs a 2D grid of the world around it where every cell carries a cost — close to an obstacle is expensive, open space is cheap. I built that translation layer in C++ from scratch on top of ROS 2.",
      },
      {
        heading: "What I Built",
        list: [
          "C++ node subscribing to /scan, converting every (range, angle) into (x, y) grid coordinates using the scan message's angular minimum and increment.",
          "Dynamic grid sizing — the map's extents scale with the lidar's actual reach rather than a hardcoded square.",
          "Linear cost falloff around every obstacle out to a 2 m radius, producing a smooth safety envelope path planners can follow.",
          "Foxglove Studio bridge for live visualization of the costmap and raw scan side by side, all running in a reproducible Docker image.",
        ],
      },
      {
        heading: "Outcome",
        body:
          "The node consumes a 360-degree lidar scan and emits a costmap message at the same rate, ready to be plugged into a Nav2 planner. The Docker setup means any teammate can `docker compose up` and see the same world the robot is seeing within seconds.",
      },
    ],
  },

  "mecanum-claw": {
    title: "Omni-Directional Mecanum Claw Robot",
    kicker: "A scroll of the Cardboard Beast",
    image: "assets/projects/mecanum-claw.jpg",
    stack: "C++ · ESP32 · Arduino · SolidWorks · GitHub",
    role: "Hackathon team of 3 · Electrical & firmware lead",
    date: "Nov 2025 · Box Robot Hackathon (48 h)",
    summary:
      "A 100% cardboard-bodied robot with custom 3D-printed mecanum wheels, six motors on a single breadboard, and a wireless two-ESP32 control system — built in 48 hours.",
    sections: [
      {
        heading: "What we set out to do",
        list: [
          "Construct an entire mechanical structure from cardboard.",
          "Design and 3D-print omni-directional wheels and a working claw.",
          "Drive six DC motors (three drive, three claw) off a single breadboard with a robust power-distribution layout.",
        ],
      },
      {
        heading: "How we built it",
        list: [
          "Dual-microcontroller architecture: one ESP32 in the controller, one in the chassis, communicating over ESP-NOW for low-latency wireless.",
          "C++ firmware mapped the controller's joystick to mecanum kinematics for true 360° translation plus rotation.",
          "Power distribution circuit on a single breadboard managing six motors without browning out the ESP32 — a fun debugging session.",
        ],
      },
      {
        heading: "Results",
        list: [
          "360° holonomic motion, demonstrated end-to-end on the competition floor.",
          "A custom 3-spoon gripper that reliably picked up irregular objects.",
          "Stable wireless link measured ~30% more efficient than the Wi-Fi alternative the other teams used.",
        ],
      },
    ],
  },

  delirium: {
    title: "Hospital Induced Delirium Detection",
    kicker: "A scroll of the Physician's Eye",
    image: "assets/projects/delirium.jpg",
    stack: "C++ · Python · Arduino",
    role: "Hardware + firmware lead on a 3-person team",
    date: "Oct 2025",
    summary:
      "A non-invasive bedside device that combines short trivia questions and reaction-time tests to track a patient's cognitive state — generating a continuously updating risk score for Hospital Induced Delirium.",
    sections: [
      {
        heading: "Why",
        body:
          "Hospital Induced Delirium (HID) is a condition that worsens mood and cognition, prolongs hospital stays, and is notoriously hard for already-overburdened nursing staff to catch early. We wanted to offload that monitoring onto a device a patient could use themselves.",
      },
      {
        heading: "How",
        list: [
          "Custom 3D-printed enclosure housing the sensors, buttons, and a small speaker.",
          "Arduino-driven hardware loop with C++ firmware handling reaction-time tests and survey input.",
          "Python layer for inclusive text-to-speech and a speech-to-text fallback so the device works for patients with limited motor control.",
          "Cognitive-survey scoring engine that combines accuracy and speed into a rolling risk score across a stay.",
        ],
      },
      {
        heading: "Results",
        list: [
          "Consulted with peers and medical professionals to validate the question banks and thresholds.",
          "Reduced false-positive rates by ~30% versus standard observational checks during prototype trials.",
          "Built a system inclusive enough to be used without active nurse supervision for the full duration of a stay.",
        ],
      },
    ],
  },

  blackjack: {
    title: "Arcade Blackjack",
    kicker: "A scroll of the House Edge",
    image: "assets/projects/blackjack.jpg",
    stack: "Python · Pygame",
    role: "Sole developer",
    date: "Jun 2024",
    summary:
      "A fully interactive graphical blackjack game with real-time betting, statistics, and probability logic — built around clean OOP foundations so new features can drop in without refactoring core rules.",
    sections: [
      {
        heading: "What",
        list: [
          "A casino-style blackjack simulator with a real-time betting and multiplier system.",
          "Virtual currency that can be spent on game-enhancing rewards.",
          "A pygame UI built from event-driven components — buttons, hand displays, a stats overlay.",
        ],
      },
      {
        heading: "How",
        list: [
          "Distinct classes for Dealer, Player, Card, and Deck — every object owns its own state and rendering.",
          "Precise probability handling for ace logic, dealer constraints, and split/double-down edge cases.",
          "Pygame surfaces redraw only when needed, so the UI stays responsive even under animated betting sequences.",
        ],
      },
      {
        heading: "Results",
        body:
          "A seamless, customizable application that mirrors the feel of online blackjack while staying transparent enough that new variants drop in without rewriting the core loop. Win-check and math accuracy verified at 100% across hundreds of test hands.",
      },
    ],
  },

  battlefield: {
    title: "Simulated Medieval Battlefield",
    kicker: "A scroll of the Eight Warriors",
    image: "assets/projects/battlefield.jpg",
    stack: "Python · OOP",
    role: "Sole developer",
    date: "2024",
    summary:
      "A text-based tactical combat simulator handling turn-based logic for 1v1 duels and 5v5 skirmishes, built around a single Warrior base class and eight polymorphic subclasses.",
    sections: [
      {
        heading: "Architecture",
        list: [
          "A Warrior base class encapsulating turn order, health, and action logic.",
          "Eight subclasses — Knight, Ranger, Mage, Healer, Berserker, Assassin, Spearman, Minion — each adding their own twist on the base action set via polymorphism.",
          "A combat loop that never has to know which class it's dealing with: every warrior just answers `take_turn(battlefield)`.",
        ],
      },
      {
        heading: "Mechanics",
        list: [
          "Splash damage, critical hits, and healing — all resolved through polymorphic action methods rather than long if-chains.",
          "Random chaos: dodge rolls, missed swings, and minion-spawning targeting logic.",
          "Single-player and multiplayer modes, 1v1 and 5v5 skirmish formats.",
        ],
      },
      {
        heading: "Outcome",
        list: [
          "Code duplication cut by ~30% compared to my earlier draft of the same idea.",
          "A new warrior class can be implemented in under 15 lines of code.",
          "Edge cases like multi-target splash and self-healing resolve cleanly without special-casing.",
        ],
      },
    ],
  },

  crossy: {
    title: "Crossy Road",
    kicker: "A scroll of the Restless Frog",
    image: "assets/projects/crossy.jpg",
    stack: "Processing (Java)",
    role: "Sole developer",
    date: "2023",
    summary:
      "A feature-rich Frogger-style arcade recreation with pixel-accurate collisions, generalized moving entities, and two-player WASD + arrow-key support.",
    sections: [
      {
        heading: "What",
        list: [
          "A Frogger-inspired arcade game with cars, logs, trains, and a player avatar.",
          "Two-player local co-op: one player on WASD, one on arrow keys.",
          "Live scoring UI and immediate visual feedback for crossings and deaths.",
        ],
      },
      {
        heading: "How",
        list: [
          "A master Rectangle parent class defines the collision contract; Car, Log, Train, and Player all inherit it.",
          "Object arrays generalize the continuous random-spawn logic — adding a new lane type takes a few lines.",
          "Pixel-perfect AABB collision detection over the frame loop, with hitbox debug overlays for development.",
        ],
      },
      {
        heading: "Outcome",
        body:
          "An offline two-player arcade game with solid collision accuracy, a dynamic scoring system, and an architecture that took new entity types easily — exactly the kind of OOP exercise I wanted out of it.",
      },
    ],
  },
};

const id = new URLSearchParams(location.search).get("id");
const data = PROJECTS[id];
const parch = document.getElementById("parch");

if (!data) {
  parch.innerHTML = `
    <p class="parch-kicker">Lost Scroll</p>
    <h1 class="parch-title">This artifact has wandered.</h1>
    <p>No project matches the id <code>${id ?? "(none)"}</code>. Return to the realm and pick another.</p>
  `;
} else {
  parch.innerHTML = `
    <div class="parch-header">
      <div class="parch-header-text">
        <h1 class="parch-title">${escape(data.title)}</h1>
        <span class="parch-stack">${escape(data.stack)}</span>
      </div>
      ${renderLantern(data)}
    </div>

    ${data.video ? renderVideoFigure(data) : renderImageFigure(data)}

    <div class="parch-meta-row">
      <div>Role <b>${escape(data.role)}</b></div>
      <div>When <b>${escape(data.date)}</b></div>
    </div>

    <p class="parch-section" style="margin-bottom:18px">${escape(data.summary)}</p>

    ${data.sections.map(s => renderSection(s)).join('<div class="parch-rule"></div>')}
  `;

  document.title = `${data.title} · Justin Fang`;
}

/* ── unroll the scroll: measure the parchment's natural height, then
   animate max-height from 0 to that, so the bottom roller travels down ── */
function unrollScroll() {
  const scrollEl = document.querySelector(".scroll");
  const parchment = document.querySelector(".parchment");
  if (!scrollEl || !parchment) return;

  const naturalH = parchment.scrollHeight;
  parchment.style.maxHeight = "0px";
  // force a layout commit on the 0-state before flipping to the target
  void parchment.offsetHeight;

  setTimeout(() => {
    scrollEl.classList.add("ready");
    parchment.style.maxHeight = naturalH + "px";
  }, 30);

  parchment.addEventListener(
    "transitionend",
    (e) => {
      if (e.propertyName === "max-height") {
        parchment.style.maxHeight = "";
        parchment.classList.add("unrolled");
      }
    },
    { once: true }
  );
}
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", unrollScroll);
} else {
  unrollScroll();
}

function renderImageFigure(d) {
  return `
    <div class="parch-figure">
      <img src="${escape(d.image)}" alt="" onerror="this.style.display='none'">
      <span class="parch-figure-placeholder">add image · ${escape(d.image)}</span>
    </div>
  `;
}

function renderVideoFigure(d) {
  return `
    <div class="parch-figure parch-video-figure">
      <iframe
        src="${escape(d.video)}"
        title="${escape(d.title)} — demo"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerpolicy="strict-origin-when-cross-origin"
        allowfullscreen></iframe>
    </div>
    ${d.videoCaption ? `<p class="parch-video-caption">${escape(d.videoCaption)}</p>` : ""}
  `;
}

function renderLantern(d) {
  if (!d.github) return "";
  return `
    <a class="lantern-btn parch-lantern" href="${escape(d.github)}" target="_blank" rel="noopener" title="View on GitHub" aria-label="View ${escape(d.title)} on GitHub">
      <span class="lantern-string" aria-hidden="true"></span>
      <span class="lantern-cap lantern-cap-top" aria-hidden="true"></span>
      <span class="lantern-body" aria-hidden="true">
        <svg class="octocat" viewBox="0 0 16 16"><path fill="#1a0a0a" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z"/></svg>
        <span class="lantern-text">GitHub</span>
      </span>
      <span class="lantern-cap lantern-cap-bottom" aria-hidden="true"></span>
      <span class="lantern-tassel" aria-hidden="true"></span>
    </a>
  `;
}

function renderSection(s) {
  let html = `<section class="parch-section"><h2>${escape(s.heading)}</h2>`;
  if (s.body) html += `<p>${escape(s.body)}</p>`;
  if (s.list) html += `<ul>${s.list.map(li => `<li>${escape(li)}</li>`).join("")}</ul>`;
  html += `</section>`;
  return html;
}

function escape(str) {
  return String(str ?? "").replace(/[&<>"']/g, c => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  }[c]));
}

/* ── ambient drifting petals behind the scroll, matching the main realm ── */
const PETAL_COLORS = [
  { fill: "#4ce06a", line: "#156d2d" },
  { fill: "#2fc452", line: "#0f5a23" },
  { fill: "#8df2a4", line: "#2e9e4e" },
  { fill: "#f5d98a", line: "#bb8f33" },
];
const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
const canvas = document.getElementById("scroll-canvas");
const ctx = canvas.getContext("2d");
function resize() { canvas.width = innerWidth; canvas.height = innerHeight; }
resize();
addEventListener("resize", resize);

const petals = [];
const N = reducedMotion ? 0 : Math.min(40, (innerWidth * innerHeight) / 28000);
for (let i = 0; i < N; i++) petals.push(makePetal(true));

function makePetal(initial) {
  return {
    x: Math.random() * canvas.width,
    y: initial ? Math.random() * canvas.height : -20,
    size: 5 + Math.random() * 8,
    alpha: 0.3 + Math.random() * 0.45,
    color: PETAL_COLORS[(Math.random() * PETAL_COLORS.length) | 0],
    vy: 0.2 + Math.random() * 0.5,
    vx: -0.2 + Math.random() * 0.4,
    rot: Math.random() * Math.PI * 2,
    vr: -0.012 + Math.random() * 0.024,
    sway: Math.random() * Math.PI * 2,
    swaySpeed: 0.004 + Math.random() * 0.01,
    swayAmp: 0.3 + Math.random() * 0.7,
  };
}
function drawPetal(p) {
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
  ctx.lineWidth = Math.max(1, p.size * 0.16);
  ctx.strokeStyle = p.color.line;
  ctx.stroke();
  ctx.restore();
}
function tick() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (const p of petals) {
    p.sway += p.swaySpeed;
    p.x += p.vx + Math.sin(p.sway) * p.swayAmp * 0.4;
    p.y += p.vy;
    p.rot += p.vr;
    if (p.y > canvas.height + 24) Object.assign(p, makePetal(false));
    if (p.x < -30) p.x = canvas.width + 20;
    if (p.x > canvas.width + 30) p.x = -20;
    drawPetal(p);
  }
  requestAnimationFrame(tick);
}
if (!reducedMotion) tick();
