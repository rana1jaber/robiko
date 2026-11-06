/* روبيكو: منطق اللعبة (المحرر، تشغيل الكود، الخريطة، الصوت، روبيكو المعلّم) */
/* ---------- parse maps ---------- */
LEVELS.forEach(l => {
  l.gems = 0;
  l.map.forEach((row, r) => [...row].forEach((ch, c) => {
    if (ch === "R") l.start = [r, c];
    if (ch === "G") l.goal = [r, c];
    if (ch === "*") l.gems++;
  }));
});

/* ---------- storage ---------- */
const KEY = "robiko.v2";
let store = { done: [], drafts: {}, cur: 0 };
try {
  const s = JSON.parse(localStorage.getItem(KEY));
  if (s && Array.isArray(s.done)) store = Object.assign(store, s);
  else {
    const old = JSON.parse(localStorage.getItem("code-robot.v1"));
    if (old && Array.isArray(old.done)) {
      if (old.done.includes(0)) store.done.push("0-0");
      if (old.done.includes(1)) store.done.push("1-0");
      store.cur = (PLANETS[old.cur] || PLANETS[0]).first;
    }
  }
} catch (e) {}
const isDone = i => store.done.includes(LEVELS[i].id);
const planetCount = p => PLANETS[p].missions.filter(m => store.done.includes(m.id)).length;
const planetDone = p => planetCount(p) === PLANETS[p].missions.length;
const nextInPlanet = p => { const pl = PLANETS[p]; const k = pl.missions.findIndex(m => !store.done.includes(m.id)); return pl.first + (k < 0 ? 0 : k); };
function save() { try { localStorage.setItem(KEY, JSON.stringify(store)); } catch (e) {} }

/* ---------- helpers ---------- */
const $ = id => document.getElementById(id);
const esc = s => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
function hl(src) {
  const re = /(\/\/[^\n]*|\/\*[\s\S]*?(?:\*\/|$))|("(?:[^"\\\n]|\\.)*"?|'(?:[^'\\\n]|\\.)*'?|`(?:[^`\\]|\\.)*`?)|\b(const|let|var|function|for|while|if|else|return|of|in|true|false|break|continue|new)\b|\b(\d+(?:\.\d+)?)\b|([A-Za-z_$][\w$]*)(?=\s*\()/g;
  let out = "", last = 0, m;
  while ((m = re.exec(src))) {
    out += esc(src.slice(last, m.index));
    const cls = m[1] ? "c" : m[2] ? "s" : m[3] ? "k" : m[4] ? "n" : "f";
    out += `<span class="t-${cls}">${esc(m[0])}</span>`;
    last = re.lastIndex;
  }
  return out + esc(src.slice(last));
}
const DIR_AR = { right: "إلى اليمين", left: "إلى اليسار", up: "إلى الأعلى", down: "إلى الأسفل" };
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
const sleep = ms => new Promise(r => setTimeout(r, ms));

/* ---------- state ---------- */
let cur = Math.min(store.cur || 0, LEVELS.length - 1);
let cell = 48, gap = 4;
let gemEls = {}, cellEls = [];
let runToken = null, solArmed = false;
const bot = document.createElement("div");
bot.className = "bot";
bot.innerHTML = `<svg viewBox="0 0 40 40" aria-label="الروبوت"><rect x="19" y="2" width="2" height="8" fill="#F2A93B"/><circle cx="20" cy="3" r="3" fill="#FF7A8A"/><rect x="4" y="9" width="32" height="27" rx="8" fill="#F2A93B"/><rect x="4" y="30" width="32" height="6" rx="3" fill="#D88E22"/><rect class="visor" x="8" y="14" width="24" height="13" rx="5" fill="#0F2229"/><g class="eyes"><circle cx="15" cy="20.5" r="2.8" fill="#6EE7B7"/><circle cx="25" cy="20.5" r="2.8" fill="#6EE7B7"/></g></svg>`;
const bubble = document.createElement("div");
bubble.className = "bubble";
bubble.hidden = true;

const GEM_SVG = `<svg class="gem" viewBox="0 0 24 24"><path d="M6 3h12l4 6-10 12L2 9z" fill="#FF7A8A"/><path d="M6 3l3 6h6l3-6M2 9h20M9 9l3 12 3-12" fill="none" stroke="#FFC1CA" stroke-width="1.2"/></svg>`;
const GOAL_SVG = `<svg class="goal" viewBox="0 0 24 24"><rect x="5" y="3" width="2" height="19" rx="1" fill="#E8F0EC"/><path d="M7 4h12l-3 4 3 4H7z" fill="#6EE7B7"/><ellipse cx="6" cy="21.5" rx="4" ry="1.3" fill="#0A181D" opacity=".5"/></svg>`;

/* ---------- UI build ---------- */
function renderStrip() {
  const n = LEVELS.filter((_, i) => isDone(i)).length;
  const pd = PLANETS.filter((_, p) => planetDone(p)).length;
  $("progText").textContent = `${pd} / ${PLANETS.length} كواكب · ${n} / ${LEVELS.length} مهمة`;
  $("progBar").style.width = (n / LEVELS.length * 100) + "%";
}

/* ---------- space map ---------- */
let justWon = null, mapMode = null;
function rng(seed) { return () => (seed = (seed * 16807) % 2147483647) / 2147483647; }
function spiralPath(R, turns) {
  let d = "", steps = 90;
  for (let k = 0; k <= steps; k++) {
    const t = k / steps, a = t * turns * Math.PI * 2, r = R * .92 * t;
    d += (k ? "L" : "M") + (Math.cos(a) * r).toFixed(1) + " " + (Math.sin(a) * r).toFixed(1);
  }
  return d;
}
function gearPath(r1, r2, teeth) {
  let d = "";
  for (let k = 0; k < teeth * 2; k++) {
    const a1 = k / (teeth * 2) * Math.PI * 2, a2 = (k + 1) / (teeth * 2) * Math.PI * 2, r = k % 2 ? r1 : r2;
    d += (k ? "L" : "M") + (Math.cos(a1) * r).toFixed(1) + " " + (Math.sin(a1) * r).toFixed(1) + "L" + (Math.cos(a2) * r).toFixed(1) + " " + (Math.sin(a2) * r).toFixed(1);
  }
  return d + "Z";
}
const PLANET_GRAD = [
  ["#E3B98A", "#6B4A2E"], ["#F3CF8E", "#A35F25"], ["#9B83FF", "#2A1C78"],
  ["#5FD6DD", "#0F5560"], ["#FF9AA6", "#5AA9FF"], ["#F7BE5E", "#7F420C"],
  ["#79E3A4", "#1A6040"], ["#A8DEFF", "#244F7C"], ["#FFF3B0", "#FF8A2A"]
];
function planetArt(i, R, ns = "") {
  const cp = `url(#${ns}clip${i})`, g = `url(#${ns}pg${i})`;
  const base = `<circle r="${R}" fill="${g}"/>`;
  const shade = `<circle r="${R}" fill="url(#${ns}shade)"/>`;
  switch (i) {
    case 0: // first command: rocky moon with a beacon
      return `<g clip-path="${cp}">${base}<circle cx="${-R*.35}" cy="${R*.2}" r="${R*.22}" fill="#000" opacity=".18"/><circle cx="${R*.3}" cy="${-R*.3}" r="${R*.13}" fill="#000" opacity=".2"/><circle cx="${R*.4}" cy="${R*.45}" r="${R*.1}" fill="#000" opacity=".16"/>${shade}</g>
        <rect x="-1.5" y="${-R-16}" width="3" height="16" fill="#E8F0EC"/><circle cy="${-R-18}" r="4" fill="#FF7A8A" class="twinkle"/>`;
    case 1: // sequence: ordered bands
      return `<g clip-path="${cp}">${base}${[-.55,-.15,.25,.62].map((y,k)=>`<rect x="${-R}" y="${R*y}" width="${R*2}" height="${R*.16}" fill="${k%2?"#FFF0CF":"#B5642A"}" opacity=".55"/>`).join("")}${shade}</g>`;
    case 2: // for loop: a vortex
      return `<g clip-path="${cp}">${base}<g class="spin"><path d="${spiralPath(R, 3.2)}" fill="none" stroke="#D9CEFF" stroke-width="${R*.09}" stroke-linecap="round" opacity=".8"/><path d="${spiralPath(R, 3.2)}" transform="rotate(180)" fill="none" stroke="#6E54E8" stroke-width="${R*.07}" stroke-linecap="round" opacity=".9"/></g>${shade}</g>`;
    case 3: // variables: a storage box in orbit
      return `<ellipse rx="${R*1.5}" ry="${R*.42}" fill="none" stroke="#9FE7EC" stroke-width="1.2" opacity=".35" transform="rotate(-15)"/>
        <g clip-path="${cp}">${base}<path d="M${-R} ${R*.1} Q0 ${-R*.25} ${R} ${R*.15}" stroke="#BFF3F5" stroke-width="${R*.08}" fill="none" opacity=".35"/>${shade}</g>
        <g transform="rotate(-15) translate(${R*1.38} ${-R*.12})"><rect x="-9" y="-9" width="18" height="18" rx="3" fill="#F2A93B"/><path d="M-9 -3h18" stroke="#2A1A04" stroke-width="1.5"/><text y="7" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="9" font-weight="600" fill="#2A1A04">x</text></g>`;
    case 4: // if: two-sided world
      return `<g clip-path="${cp}"><rect x="${-R}" y="${-R}" width="${R*2}" height="${R*2}" fill="#5AA9FF"/><path d="M${-R} ${-R} L${R*.35} ${-R} L${-R*.35} ${R} L${-R} ${R}Z" fill="#FF8C9A"/><path d="M${R*.35} ${-R} L${-R*.35} ${R}" stroke="#FFF" stroke-width="3" opacity=".7"/>${shade}</g>`;
    case 5: { // while: endless orbiting ring; the moon passes behind the planet, then in front
      const moon = `<circle r="5" fill="#FFF7E3" ${reduce ? `cx="${R*1.2}" cy="${R*.25}"` : ""}>${reduce ? "" : `<animateMotion dur="4s" repeatCount="indefinite" path="M${-R*1.55} 0 A${R*1.55} ${R*.4} 0 1 0 ${R*1.55} 0 A${R*1.55} ${R*.4} 0 1 0 ${-R*1.55} 0"/>`}</circle>`;
      return `<ellipse rx="${R*1.55}" ry="${R*.4}" fill="none" stroke="#FFE2A8" stroke-width="${R*.12}" opacity=".55" transform="rotate(-18)"/>
        <g transform="rotate(-18)">${moon}</g>
        <g clip-path="${cp}">${base}<circle cx="${-R*.25}" cy="${R*.15}" r="${R*.28}" fill="#FFD27A" opacity=".25"/>${shade}</g>
        <path d="M${-R*1.55} 0 A${R*1.55} ${R*.4} 0 0 0 ${R*1.55} 0" transform="rotate(-18)" fill="none" stroke="#FFE2A8" stroke-width="${R*.12}" opacity=".85"/>
        <clipPath id="${ns}ringFront"><rect x="${-R*2}" y="0" width="${R*4}" height="${R*2}"/></clipPath>
        <g transform="rotate(-18)" clip-path="url(#${ns}ringFront)">${moon}</g>`;
    }
    case 6: // functions: machine world with gears
      return `<g clip-path="${cp}">${base}<g transform="translate(${-R*.2} ${-R*.1})"><path class="spin slow" d="${gearPath(R*.42, R*.55, 9)}" fill="#C9F5DA" opacity=".4"/><circle r="${R*.16}" fill="${g}"/></g><g transform="translate(${R*.55} ${R*.5})"><path class="spin slow rev" d="${gearPath(R*.22, R*.3, 7)}" fill="#C9F5DA" opacity=".35"/></g>${shade}</g>`;
    case 7: // arrays: a chain of moons in a row
      return `<g clip-path="${cp}">${base}${shade}</g>
        ${[0,1,2,3].map(k=>{const a=(-160 + k*22)*Math.PI/180, x=Math.cos(a)*R*1.45, y=Math.sin(a)*R*1.45; return `<rect x="${x-8}" y="${y-8}" width="16" height="16" rx="4" fill="#E8F0EC" opacity="${.95-k*.12}"/><text x="${x}" y="${y+4}" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="10" font-weight="600" fill="#244F7C">${k}</text>`;}).join("")}`;
    case 8: // final: a star
      return `<circle r="${R*1.55}" fill="url(#${ns}glow)" class="corona"/>
        ${Array.from({length:12},(_,k)=>`<path d="M0 ${-R*1.05} L${R*.09} ${-R*1.32} L${-R*.09} ${-R*1.32}Z" fill="#FFD27A" transform="rotate(${k*30})"/>`).join("")}
        <g clip-path="${cp}">${base}<circle cx="${-R*.3}" cy="${-R*.3}" r="${R*.5}" fill="#FFF" opacity=".25"/></g>`;
  }
}
function mapLayout(tall) {
  if (tall) {
    const W = 400, pts = PLANETS.map((_, i) => [i % 2 ? 120 : 280, 120 + i * 150]);
    return { W, H: 120 + 8 * 150 + 150, pts, R: 38 };
  }
  return { W: 1000, H: 640,
    pts: [[880,500],[725,420],[565,500],[405,420],[245,495],[115,320],[290,205],[505,250],[760,165]], R: 42 };
}
function smoothPath(pts) {
  let d = `M${pts[0][0]} ${pts[0][1]}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || p2;
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ` C${c1[0].toFixed(1)} ${c1[1].toFixed(1)} ${c2[0].toFixed(1)} ${c2[1].toFixed(1)} ${p2[0]} ${p2[1]}`;
  }
  return d;
}
function missionDots(p, R) {
  const n = PLANETS[p].missions.length;
  if (n < 2) return [];
  // a curved trail across the planet's face, mission 1 on the right (reading order)
  return Array.from({ length: n }, (_, k) => {
    const th = Math.PI * k / (n - 1);
    return [R * .66 * Math.cos(th), R * .14 + R * .26 * Math.sin(th)];
  });
}
function botAt(p, k) {
  if (focusP === p) return focusDot(p, k);
  // in the galaxy view Robiko stands on the planet's top edge; planets 1 and 8 have
  // a beacon and array tiles at the very top, so it stands a little to the side there
  const { pts, R } = mapGeo, c = pts[p], lean = p === 0 || p === 7 ? .44 : 0;
  return [c[0] + R * Math.sin(lean), c[1] - R * Math.cos(lean)];
}
function renderMap(from = null) {
  const frame = $("mapFrame");
  const tall = frame.clientWidth < 640;
  mapMode = tall;
  const { W, H, pts, R } = mapLayout(tall);
  mapGeo = { pts, R, W, H, tall };
  const cp = LEVELS[cur].p, cm = LEVELS[cur].m;
  const flight = from && from.p !== cp ? from.p : null;
  const rand = rng(7);
  let stars = "";
  for (let k = 0; k < (tall ? 150 : 190); k++) {
    const x = rand() * W, y = rand() * H, r = .4 + rand() * 1.3, tw = rand() < .25;
    stars += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${r.toFixed(2)}" fill="#fff" opacity="${(.35 + rand() * .55).toFixed(2)}"${tw ? ` class="twinkle" style="animation-delay:${(rand() * 3).toFixed(2)}s"` : ""}/>`;
  }
  const defs = PLANET_GRAD.map((c, i) => `
    <radialGradient id="pg${i}" cx="35%" cy="30%" r="75%"><stop offset="0" stop-color="${c[0]}"/><stop offset="1" stop-color="${c[1]}"/></radialGradient>
    <clipPath id="clip${i}"><circle r="${R}"/></clipPath>`).join("");
  const done = planetDone;
  const segs = pts.slice(0, -1).map((p, i) => {
    const sub = smoothPath(pts).split(" C")[i + 1];
    return `<path d="M${p[0]} ${p[1]} C${sub}" fill="none" stroke="#6EE7B7" stroke-width="3" stroke-linecap="round" id="seg${i}" opacity="${flight === i ? 0 : (done(i) && (done(i + 1) || i + 1 === cp) ? .9 : 0)}"/>`;
  }).join("");
  const dotsFor = i => {
    const d = missionDots(i, R);
    if (!d.length) return "";
    let trail = "";
    for (let s = 0; s <= 24; s++) {
      const th = Math.PI * s / 24;
      trail += (s ? "L" : "M") + (R * .66 * Math.cos(th)).toFixed(1) + " " + (R * .14 + R * .26 * Math.sin(th)).toFixed(1);
    }
    return `<path d="${trail}" fill="none" stroke="#FFFFFF" stroke-opacity=".45" stroke-width="1.6" stroke-dasharray="2 4" stroke-linecap="round"/>` +
      d.map(([x, y], k) => {
        const m = PLANETS[i].missions[k], dn = store.done.includes(m.id), isC = i === cp && k === cm;
        const st = isC ? "cur" : dn ? "done" : "todo";
        return `<g class="mdot ${st}" data-p="${i}" data-k="${k}" transform="translate(${x.toFixed(1)} ${y.toFixed(1)})"><title>المهمة ${k + 1}: ${m.title}</title>
          <circle r="11" fill="transparent"/>
          ${st === "done" ? `<ellipse rx="6" ry="2.4" fill="#070E1A" opacity=".45"/><rect x="-.9" y="-17" width="1.8" height="17" rx=".9" fill="#E8F0EC"/><path class="flag-wave" d="M.9 -17 h10 l-3 3.6 3 3.6 h-10z" fill="#6EE7B7" style="animation-delay:${(k * .3).toFixed(1)}s"/>`
            : st === "cur" ? `<circle r="9" fill="none" stroke="#F2A93B" stroke-width="2" class="pulse"/><ellipse rx="8" ry="3.4" fill="#F2A93B"/><ellipse rx="4.5" ry="1.8" fill="#FFF7E3"/>`
            : `<path d="M0 -8 L5 -2 L0 3 L-5 -2Z" fill="#9FB8FF" fill-opacity=".35" stroke="#FFFFFF" stroke-opacity=".85" stroke-width="1.3"/><circle cy="-2.5" r="1.2" fill="#FFF" opacity=".8"/>`}
        </g>`;
      }).join("");
  };
  const planets = pts.map((p, i) => {
    const l = PLANETS[i], isCur = i === cp, st = done(i) ? "done" : (isCur ? "cur" : "todo");
    const ly = p[1] + R + (i === 8 ? 72 : 40);
    return `<g class="planet ${st} ${justWon === i ? "just-won" : ""} ${isCur ? "cur" : ""}" data-i="${i}" role="button" tabindex="0" aria-label="كوكب ${i + 1}: ${l.title}${done(i) ? "، مكتمل" : ""}" transform="translate(${p[0]} ${p[1]})">
      <circle class="hit" r="${R * 1.6}" fill="transparent"/>
      ${isCur && flight === null ? `<circle r="${R + 6}" fill="none" stroke="#F2A93B" stroke-width="2" class="pulse"/>` : ""}
      <circle class="focus-ring" r="${R + 12}"/>
      <g class="body">${planetArt(i, R)}${dotsFor(i)}</g>
      ${done(i) ? `<g transform="translate(${R * .72} ${-R * .72})"><circle r="11" fill="#6EE7B7" stroke="#070E1A" stroke-width="3"/><path d="M-5 0 L-1.5 4 L5 -4" fill="none" stroke="#070E1A" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></g>` : ""}
      <text class="p-num" text-anchor="middle" y="${ly - p[1] - 20}" direction="ltr">${String(i + 1).padStart(2, "0")}</text>
      <text class="p-title" text-anchor="middle" y="${ly - p[1]}">${l.title}</text>
      <text class="p-concept" text-anchor="middle" y="${ly - p[1] + 18}">${l.concept}</text>
    </g>`;
  }).join("");
  const start = from ? botAt(from.p, from.k) : botAt(cp, cm);
  frame.innerHTML = `<svg class="${tall ? "tall" : ""}" viewBox="0 0 ${W} ${H}" role="group" aria-label="خريطة المراحل">
    <defs>${defs}
      <radialGradient id="shade" cx="30%" cy="28%" r="80%"><stop offset=".55" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".55"/></radialGradient>
      <radialGradient id="glow"><stop offset=".4" stop-color="#FFC75A" stop-opacity=".55"/><stop offset="1" stop-color="#FF8A2A" stop-opacity="0"/></radialGradient>
      <radialGradient id="fglow"><stop offset=".72" stop-color="#8FD3FF" stop-opacity=".28"/><stop offset="1" stop-color="#8FD3FF" stop-opacity="0"/></radialGradient>
      <radialGradient id="neb1"><stop offset="0" stop-color="#6A3FD9" stop-opacity=".32"/><stop offset="1" stop-color="#6A3FD9" stop-opacity="0"/></radialGradient>
      <radialGradient id="neb2"><stop offset="0" stop-color="#1FA6A0" stop-opacity=".25"/><stop offset="1" stop-color="#1FA6A0" stop-opacity="0"/></radialGradient>
    </defs>
    <rect width="${W}" height="${H}" fill="#070E1A"/>
    <ellipse cx="${W * .3}" cy="${H * .35}" rx="${W * .45}" ry="${H * .3}" fill="url(#neb1)"/>
    <ellipse cx="${W * .75}" cy="${H * .7}" rx="${W * .4}" ry="${H * .28}" fill="url(#neb2)"/>
    ${stars}
    <path d="${smoothPath(pts)}" fill="none" stroke="#3A5866" stroke-width="2.5" stroke-dasharray="2 9" stroke-linecap="round"/>
    ${segs}
    ${planets}
    <g id="focus" display="none"></g>
    <g id="fx"></g>
    <g id="mapBot" transform="translate(${start[0].toFixed(1)} ${start[1].toFixed(1)})" role="button" aria-label="روبيكو"><g class="bob"><g class="tilt"><g class="sq"><g class="spinner"><g class="bscale" transform="scale(.74) translate(0 -23)">
      <circle cy="11" r="24" fill="transparent"/>
      <g class="flame" opacity="0"><path d="M-7 21 Q0 42 7 21Z" fill="#FF7A8A"/><path d="M-3.5 21 Q0 33 3.5 21Z" fill="#FFE2A8"/></g>
      <rect x="-1" y="-6" width="2" height="7" fill="#F2A93B"/><circle cy="-7" r="2.6" fill="#FF7A8A" class="twinkle"/><rect x="-14" y="0" width="28" height="22" rx="7" fill="#F2A93B" stroke="#070E1A" stroke-width="1.5"/><rect x="-10" y="5" width="20" height="10" rx="4" fill="#0F2229"/><g class="blink"><circle cx="-4.5" cy="10" r="2.3" fill="#6EE7B7"/><circle cx="4.5" cy="10" r="2.3" fill="#6EE7B7"/></g>
    </g></g></g></g></g><g class="say-slot"></g></g>
  </svg>`;
  justWon = null;
  focusP = null; $("galaxyBtn").hidden = true;
  if (from) {
    setFocus(from.p, false);
    placeMapBot(botAt(from.p, from.k));
    $("mapFrame").querySelector("#mapBot").style.opacity = 1;
    moveBot(from, { p: cp, k: cm });
  } else {
    traveling = true;
    setTimeout(async () => {
      await setFocus(cp, true);
      traveling = false;
      if (!reduce) botSay(pick(["أهلًا! 👋", "هل أنتِ جاهزة للبرمجة؟", "هيا نبدأ!"]), 2600);
    }, reduce ? 0 : 350);
  }
}

let mapGeo = null, traveling = false;
const SVGNS = "http://www.w3.org/2000/svg";
const pick = a => a[Math.floor(Math.random() * a.length)];
const STEP_LINES = ["هيا!", "مهمة جديدة!", "هيا بنا!", "أنا جاهز!", "خطوة أخرى!"];
const LAND_LINES = ["وصلنا! 🚀", "كوكب جديد!", "رائع!", "هبوط ناجح!"];
const POKE_LINES = ["لا تدغدغيني! 😆", "أحب الكود 💛", "for for for 🌀", "console.log('مرحبًا')", "أنا روبيكو!", "هيا نبرمج!", "بطاريتي 100%", "قيمتي true 😎"];
function fxLayer() { return $("mapFrame").querySelector("#fx"); }
function puffs(x, y, n) {
  if (reduce) return;
  const fx = fxLayer(); if (!fx) return;
  for (let i = 0; i < n; i++) {
    const c = document.createElementNS(SVGNS, "circle");
    c.setAttribute("cx", x); c.setAttribute("cy", y); c.setAttribute("r", 2.5 + Math.random() * 2);
    c.setAttribute("fill", "#E8F0EC"); c.setAttribute("class", "puff");
    const ang = Math.PI + Math.random() * Math.PI * 0 + (i / Math.max(1, n - 1)) * Math.PI;
    c.style.setProperty("--dx", (Math.cos(ang) * 14).toFixed(1) + "px");
    c.style.setProperty("--dy", (-Math.abs(Math.sin(ang)) * 6 - 2).toFixed(1) + "px");
    fx.appendChild(c); setTimeout(() => c.remove(), 650);
  }
}
function spark(x, y) {
  const fx = fxLayer(); if (!fx) return;
  const c = document.createElementNS(SVGNS, "path");
  const r = 2 + Math.random() * 2.5;
  c.setAttribute("d", `M${x} ${y - r} L${x + r * .35} ${y} L${x} ${y + r} L${x - r * .35} ${y}Z`);
  c.setAttribute("fill", pick(["#FFE2A8", "#FF7A8A", "#F2A93B", "#6EE7B7"])); c.setAttribute("class", "spark");
  c.style.setProperty("--dx", ((Math.random() - .5) * 18).toFixed(1) + "px");
  c.style.setProperty("--dy", (8 + Math.random() * 12).toFixed(1) + "px");
  fx.appendChild(c); setTimeout(() => c.remove(), 950);
}
let sayTimer = null;
function botSay(text, ms) {
  const slot = $("mapFrame").querySelector("#mapBot .say-slot"); if (!slot) return;
  const w = Math.max(44, [...text].length * 8.5 + 20);
  slot.innerHTML = `<g class="mapsay" transform="translate(0 -46)"><rect x="${-w / 2}" y="-15" width="${w}" height="24" rx="10" fill="#E8F0EC"/><path d="M-5 8 L0 15 L5 8Z" fill="#E8F0EC"/><text y="2" text-anchor="middle" direction="rtl" font-family="Readex Pro, sans-serif" font-size="12.5" font-weight="500" fill="#0F2229">${esc(text)}</text></g>`;
  clearTimeout(sayTimer); sayTimer = setTimeout(() => { slot.innerHTML = ""; }, ms);
}
function pokeBot() {
  const b = $("mapFrame").querySelector("#mapBot .spinner"); if (!b) return;
  b.classList.remove("spin-once"); void b.getBoundingClientRect(); b.classList.add("spin-once");
  sfx("boing"); botSay(pick(POKE_LINES), 2000);
  const q = $("mapFrame").querySelector("#mapBot").transform.baseVal.consolidate().matrix;
  for (let i = 0; i < 8; i++) setTimeout(() => spark(q.e + (Math.random() - .5) * 20, q.f - 14), i * 40);
}
setInterval(() => {
  if (reduce || $("mapView").hidden || document.hidden) return;
  const svg = $("mapFrame").querySelector("svg"), fx = fxLayer(); if (!svg || !fx) return;
  const vb = svg.viewBox.baseVal, x = vb.width * (.35 + Math.random() * .65), y = vb.height * Math.random() * .35;
  const g = document.createElementNS(SVGNS, "g");
  g.innerHTML = `<g class="shoot"><line x1="${x}" y1="${y}" x2="${x + 46}" y2="${y - 26}" stroke="#FFFFFF" stroke-width="1.6" stroke-linecap="round" opacity=".85"/><circle cx="${x}" cy="${y}" r="1.8" fill="#FFF"/></g>`;
  fx.appendChild(g); setTimeout(() => g.remove(), 1200);
}, 3800);

/* ---------- sound ---------- */
let soundOn = true, actx = null;
try { soundOn = localStorage.getItem("robiko.sound") !== "off"; } catch (e) {}
function renderSoundBtn() {
  $("soundBtn").innerHTML = soundOn
    ? `<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M3 8h3l4-3v10l-4-3H3z" fill="currentColor"/><path d="M13 7a4 4 0 0 1 0 6M15 5a7 7 0 0 1 0 10" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>`
    : `<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M3 8h3l4-3v10l-4-3H3z" fill="currentColor"/><path d="M13 8l4 4M17 8l-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>`;
  $("soundBtn").setAttribute("aria-pressed", soundOn);
  $("soundBtn").title = soundOn ? "كتم الصوت" : "تشغيل الصوت";
}
$("soundBtn").addEventListener("click", () => {
  soundOn = !soundOn; try { localStorage.setItem("robiko.sound", soundOn ? "on" : "off"); } catch (e) {}
  renderSoundBtn(); if (soundOn) sfx("pop"); else { hush(); } renderVoiceBtn();
});
function tone(f1, f2, dur, type = "sine", vol = .12, at = 0) {
  const t = actx.currentTime + at, o = actx.createOscillator(), g = actx.createGain();
  o.type = type; o.frequency.setValueAtTime(f1, t); o.frequency.exponentialRampToValueAtTime(f2, t + dur);
  g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(.001, t + dur);
  o.connect(g).connect(actx.destination); o.start(t); o.stop(t + dur + .02);
}
function sfx(name) {
  if (!soundOn) return;
  try {
    if (!actx) actx = new (window.AudioContext || window.webkitAudioContext)();
    if (actx.state === "suspended") actx.resume();
    switch (name) {
      case "step": tone(520, 600, .06, "triangle", .06); break;
      case "blip": tone(560 + Math.random() * 260, 520, .035, "square", .018); break;
      case "hop": tone(380, 760, .12, "sine", .08); break;
      case "pop": tone(660, 990, .09, "sine", .1); break;
      case "gem": tone(1046, 1568, .12, "triangle", .1); tone(1568, 2093, .16, "triangle", .08, .07); break;
      case "say": tone(700, 640, .05, "square", .03); tone(820, 760, .05, "square", .03, .06); break;
      case "crash": tone(180, 60, .3, "sawtooth", .1); break;
      case "boing": tone(220, 880, .18, "sine", .12); tone(880, 330, .2, "sine", .08, .16); break;
      case "rocket": tone(120, 900, 1.8, "sawtooth", .03); tone(200, 1200, 1.8, "triangle", .04); break;
      case "land": tone(300, 90, .25, "sine", .14); tone(784, 1046, .14, "triangle", .08, .2); break;
      case "win": [523, 659, 784, 1046].forEach((f, i) => tone(f, f * 1.01, .18, "triangle", .1, i * .1)); break;
    }
  } catch (e) {}
}
/* ---------- planet focus (zoomed view, missions in a Z) ---------- */
let focusP = null;
function focusGeom(p) {
  const { W, H, pts, R, tall } = mapGeo;
  const Rf = tall ? W * .27 : Math.min(W, H) * .27;
  const fy = tall ? Math.max(Rf + (p === 0 ? 134 : 110), Math.min(H - Rf - 120, pts[p][1])) : H / 2 + 14 + (p === 7 ? 44 : 0);
  return { fx: W / 2, fy, Rf, S: Rf / R };
}
function zCorners(Rf) { const a = Rf * .56, b = Rf * .42; return [[-a, -b], [a, -b], [-a, b], [a, b]]; }
const zCache = {};
function zCurve(Rf) {
  // a Z with rounded, flowing corners, sampled densely so the robot can walk along it
  const key = Rf.toFixed(2);
  if (zCache[key]) return zCache[key];
  const [A, B, C, D] = zCorners(Rf);
  const unit = (p, q) => { const d = Math.hypot(q[0] - p[0], q[1] - p[1]); return [(q[0] - p[0]) / d, (q[1] - p[1]) / d]; };
  const r = Rf * .34;
  const u1 = unit(A, B), u2 = unit(B, C), u3 = unit(C, D);
  const B1 = [B[0] - u1[0] * r, B[1] - u1[1] * r], B2 = [B[0] + u2[0] * r, B[1] + u2[1] * r];
  const C1 = [C[0] - u2[0] * r, C[1] - u2[1] * r], C2 = [C[0] + u3[0] * r, C[1] + u3[1] * r];
  const pts = [], marks = [0];
  const line = (p, q, n) => { for (let i = 0; i < n; i++) { const t = i / n; pts.push([p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t]); } };
  const quad = (p, c, q, n) => { for (let i = 0; i < n; i++) { const t = i / n, m = 1 - t; pts.push([m * m * p[0] + 2 * m * t * c[0] + t * t * q[0], m * m * p[1] + 2 * m * t * c[1] + t * t * q[1]]); if (i === n / 2) marks.push(pts.length - 1); } };
  line(A, B1, 20); quad(B1, B, B2, 24); line(B2, C1, 30); quad(C1, C, C2, 24); line(C2, D, 20); pts.push(D);
  const L = [0];
  for (let i = 1; i < pts.length; i++) L.push(L[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
  const out = { pts, L, T: L[L.length - 1], cornerS: [0, L[marks[1]], L[marks[2]], L[L.length - 1]] };
  zCache[key] = out;
  return out;
}
function zAt(sv, Rf) {
  const { pts, L, T } = zCurve(Rf);
  sv = Math.max(0, Math.min(T, sv));
  let lo = 0, hi = L.length - 1;
  while (hi - lo > 1) { const mid = (lo + hi) >> 1; if (L[mid] <= sv) lo = mid; else hi = mid; }
  const t = (sv - L[lo]) / ((L[hi] - L[lo]) || 1);
  return [pts[lo][0] + (pts[hi][0] - pts[lo][0]) * t, pts[lo][1] + (pts[hi][1] - pts[lo][1]) * t];
}
function zStops(n, Rf) {
  const { T, cornerS } = zCurve(Rf);
  if (n === 1) return [T / 2];
  if (n === 4) return cornerS.slice();
  return Array.from({ length: n }, (_, k) => T * k / (n - 1));
}
function focusDot(p, k) {
  const n = PLANETS[p].missions.length;
  if (n === 4) { const g = focusGeom(p), c = zCorners(g.Rf)[k]; return [g.fx + c[0], g.fy + c[1]]; }
  const g = focusGeom(p), sv = zStops(PLANETS[p].missions.length, g.Rf)[k], z = zAt(sv, g.Rf);
  return [g.fx + z[0], g.fy + z[1]];
}
function zPathTo(sv, Rf) {
  const { pts, L } = zCurve(Rf);
  let d = `M${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`;
  for (let i = 1; i < pts.length && L[i] <= sv; i++) d += `L${pts[i][0].toFixed(1)} ${pts[i][1].toFixed(1)}`;
  const z = zAt(sv, Rf);
  return d + `L${z[0].toFixed(1)} ${z[1].toFixed(1)}`;
}
function focusMarkup(p) {
  const { W, H, R } = mapGeo, { fx, fy, Rf, S } = focusGeom(p), pl = PLANETS[p];
  const n = pl.missions.length, stops = zStops(n, Rf), T = zCurve(Rf).T;
  const cp = LEVELS[cur].p, cm = LEVELS[cur].m;
  const reached = planetDone(p) ? T : (p === cp ? stops[cm] : 0);
  const fpos = k => n === 4 ? zCorners(Rf)[k] : zAt(stops[k], Rf);
  // some planets have decorations above the sphere: keep the title clear of them, inside the frame
  const headroom = p === 0 ? (R + 22) * S : p === 7 ? (R * 1.45 + 8) * S : p === 8 ? R * 1.32 * S : Rf;
  const titleY = Math.max(-headroom - (mapGeo.tall ? 14 : 18), (mapGeo.tall ? 48 : 60) - fy);
  const roads = stops.slice(0, -1).map((_, k) => {
    if (!store.done.includes(pl.missions[k].id)) return "";
    const [x1, y1] = fpos(k), [x2, y2] = fpos(k + 1), d = `M${x1.toFixed(1)} ${y1.toFixed(1)} L${x2.toFixed(1)} ${y2.toFixed(1)}`;
    return `<g class="road" data-k="${k}"><path class="r-edge" d="${d}" fill="none" stroke="#6EE7B7" stroke-opacity=".75" stroke-width="20" stroke-linecap="round"/><path class="r-base" d="${d}" fill="none" stroke="#0B1A22" stroke-opacity=".9" stroke-width="14" stroke-linecap="round"/><path class="r-mid" d="${d}" fill="none" stroke="#FFE2A8" stroke-width="2.2" stroke-dasharray="7 7" stroke-linecap="round"/></g>`;
  }).join("");
  const dots = stops.map((sv, k) => {
    const [x, y] = n === 4 ? zCorners(Rf)[k] : zAt(sv, Rf), m = pl.missions[k], dn = store.done.includes(m.id), isC = p === cp && k === cm;
    const st = isC ? "cur" : dn ? "done" : "todo";
    const mark = st === "done" ? `<ellipse rx="6" ry="2.4" fill="#070E1A" opacity=".45"/><rect x="-.9" y="-17" width="1.8" height="17" rx=".9" fill="#E8F0EC"/><path class="flag-wave" d="M.9 -17 h10 l-3 3.6 3 3.6 h-10z" fill="#6EE7B7" style="animation-delay:${(k * .3).toFixed(1)}s"/>`
      : st === "cur" ? `<circle r="9" fill="none" stroke="#F2A93B" stroke-width="2" class="pulse"/><ellipse rx="8" ry="3.4" fill="#F2A93B"/><ellipse rx="4.5" ry="1.8" fill="#FFF7E3"/>`
      : `<path d="M0 -8 L5 -2 L0 3 L-5 -2Z" fill="#9FB8FF" fill-opacity=".45" stroke="#FFFFFF" stroke-opacity=".9" stroke-width="1.3"/><circle cy="-2.5" r="1.2" fill="#FFF" opacity=".8"/>`;
    return `<g class="mdot ${st}" data-p="${p}" data-k="${k}" tabindex="0" role="button" aria-label="المهمة ${k + 1}: ${m.title}" transform="translate(${x.toFixed(1)} ${y.toFixed(1)})"><title>المهمة ${k + 1}: ${m.title}</title>
        <circle r="26" fill="transparent"/><g transform="scale(${mapGeo.tall ? 1.3 : 1.8})">${mark}</g></g>
      <text class="f-label ${st === "cur" ? "cur" : ""}" x="${x.toFixed(1)}" y="${(y + (mapGeo.tall ? 22 + (n === 4 && k % 2 ? 15 : 0) : 30)).toFixed(1)}" text-anchor="middle" direction="rtl">${k + 1}. ${m.title}</text>`;
  }).join("");
  return `<rect class="fdim" x="0" y="0" width="${W}" height="${H}" fill="#02060F" opacity=".8"/>
    <g class="fplanet" transform="translate(${fx} ${fy}) scale(${S.toFixed(3)})"><circle r="${R * 1.3}" fill="url(#fglow)"/>${planetArt(p, R)}</g>
    <g class="fz" transform="translate(${fx} ${fy})">
      <text class="f-sub" y="${titleY - (mapGeo.tall ? 24 : 30)}" text-anchor="middle">كوكب ${p + 1} · ${pl.concept}</text>
      <text class="f-title" y="${titleY}" text-anchor="middle">${pl.title}</text>
      <g class="roads">${roads}</g>
      ${dots}
    </g>`;
}
function placeMapBot([x, y]) {
  const b = $("mapFrame").querySelector("#mapBot"); if (!b) return;
  b.setAttribute("transform", `translate(${x.toFixed(1)} ${y.toFixed(1)})`);
  b.querySelector(".bscale").setAttribute("transform", `scale(${focusP !== null ? Math.max(.95, Math.min(1.35, focusGeom(focusP).Rf / 128)).toFixed(2) : .74}) translate(0 -23)`);
}
function tween(dur, step) {
  return new Promise(res => {
    if (reduce || dur <= 0) { step(1); res(); return; }
    const t0 = performance.now();
    const f = now => { const t = Math.min(1, (now - t0) / dur); step(t); if (t < 1) requestAnimationFrame(f); else res(); };
    requestAnimationFrame(f);
  });
}
const ease = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
async function setFocus(p, animate) {
  const svg = $("mapFrame").querySelector("svg"); if (!svg) return;
  const layer = svg.querySelector("#focus"), bot = svg.querySelector("#mapBot");
  const k = LEVELS[cur].p === p ? LEVELS[cur].m : (nextInPlanet(p) - PLANETS[p].first);
  focusP = p;
  layer.innerHTML = focusMarkup(p);
  layer.setAttribute("display", "inline");
  $("galaxyBtn").hidden = false;
  const { pts } = mapGeo, { fx, fy, S } = focusGeom(p);
  const fp = layer.querySelector(".fplanet"), fz = layer.querySelector(".fz"), dim = layer.querySelector(".fdim");
  const showBot = LEVELS[cur].p === p || bot.dataset.keep === "1";
  bot.style.opacity = 0;
  if (animate && !reduce) {
    sfx("hop");
    await tween(700, t => {
      const e = ease(t), x = pts[p][0] + (fx - pts[p][0]) * e, y = pts[p][1] + (fy - pts[p][1]) * e, sc = 1 + (S - 1) * e;
      fp.setAttribute("transform", `translate(${x.toFixed(1)} ${y.toFixed(1)}) scale(${sc.toFixed(3)})`);
      dim.setAttribute("opacity", (.8 * e).toFixed(2));
      fz.setAttribute("opacity", Math.max(0, (t - .6) / .4).toFixed(2));
    });
  }
  fz.scrollIntoView({ block: "nearest", behavior: reduce ? "auto" : "smooth" });
  if (showBot) { placeMapBot(focusDot(p, LEVELS[cur].p === p ? LEVELS[cur].m : k)); bot.style.opacity = 1; }
}
async function clearFocus(animate) {
  const svg = $("mapFrame").querySelector("svg"); if (!svg || focusP === null) return;
  const layer = svg.querySelector("#focus"), bot = svg.querySelector("#mapBot"), p = focusP;
  const { pts } = mapGeo, { fx, fy, S } = focusGeom(p);
  const fp = layer.querySelector(".fplanet"), fz = layer.querySelector(".fz"), dim = layer.querySelector(".fdim");
  bot.style.opacity = 0;
  if (animate && !reduce) {
    fz.setAttribute("opacity", 0);
    await tween(600, t => {
      const e = ease(t), x = fx + (pts[p][0] - fx) * e, y = fy + (pts[p][1] - fy) * e, sc = S + (1 - S) * e;
      fp.setAttribute("transform", `translate(${x.toFixed(1)} ${y.toFixed(1)}) scale(${sc.toFixed(3)})`);
      dim.setAttribute("opacity", (.8 * (1 - e)).toFixed(2));
    });
  }
  layer.setAttribute("display", "none"); layer.innerHTML = "";
  focusP = null; $("galaxyBtn").hidden = true;
  const cp = LEVELS[cur].p;
  placeMapBot(botAt(cp, LEVELS[cur].m)); bot.style.opacity = 1;
}
$("galaxyBtn").addEventListener("click", async () => { if (traveling) return; traveling = true; await clearFocus(true); traveling = false; });

function moveBot(from, to) {
  const svg = $("mapFrame").querySelector("svg");
  const botEl = svg.querySelector("#mapBot"), tilt = botEl.querySelector(".tilt"), flame = botEl.querySelector(".flame");
  const { pts, R } = mapGeo;
  const place = ([x, y]) => botEl.setAttribute("transform", `translate(${x.toFixed(1)} ${y.toFixed(1)})`);
  const sq = botEl.querySelector(".sq");
  const flying = from.p !== to.p;
  const seg = flying ? svg.querySelector("#seg" + from.p) : null;
  const target = svg.querySelector(`.planet[data-i="${to.p}"]`);
  if (focusP === null) target.scrollIntoView({ block: "center", behavior: reduce ? "auto" : "smooth" });
  traveling = true;
  const arrive = () => {
    traveling = false;
    tilt.removeAttribute("transform"); flame.setAttribute("opacity", "0"); sq.removeAttribute("transform");
    const land = botAt(to.p, to.k);
    placeMapBot(land); botEl.style.opacity = 1;
    puffs(land[0], land[1], flying ? 7 : 4);
    sfx("pop");
    botSay(pick(flying ? LAND_LINES : STEP_LINES), 2200);
    if (flying) {
      if (seg) { seg.style.strokeDashoffset = 0; seg.setAttribute("opacity", ".9"); }
      const ring = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      ring.setAttribute("r", R + 6); ring.setAttribute("fill", "none"); ring.setAttribute("stroke", "#F2A93B"); ring.setAttribute("stroke-width", "2"); ring.setAttribute("class", "pulse");
      target.insertBefore(ring, target.children[1]);
      target.classList.remove("todo"); target.classList.add("cur", "just-won");
      $("arriveText").textContent = `وصل روبيكو إلى كوكب ${PLANETS[to.p].title}`;
    } else {
      $("arriveText").textContent = `المهمة ${to.k + 1}: ${PLANETS[to.p].missions[to.k].title}`;
    }
    startTarget = null; $("arriveGo").textContent = "ابدئي المهمة";
    $("arriveBar").hidden = false; $("arriveGo").focus({ preventScroll: true });
  };
  if (reduce) { if (flying) { clearFocus(false); setFocus(to.p, false); } arrive(); return; }
  const run = (dur, step) => new Promise(res => {
    const t0 = performance.now();
    const f = now => {
      if (!botEl.isConnected) { traveling = false; return; }
      const t = Math.min(1, (now - t0) / dur);
      step(t);
      if (t < 1) requestAnimationFrame(f); else res();
    };
    requestAnimationFrame(f);
  });
  setTimeout(async () => {
    if (flying && seg) {
      await clearFocus(true);
      target.scrollIntoView({ block: "center", behavior: "smooth" });
      placeMapBot(botAt(from.p, from.k)); botEl.style.opacity = 1;
      await sleep(250);
      const L = seg.getTotalLength(), a = botAt(from.p, from.k), b = botAt(to.p, to.k);
      const oa = [a[0] - pts[from.p][0], a[1] - pts[from.p][1]], ob = [b[0] - pts[to.p][0], b[1] - pts[to.p][1]];
      seg.style.strokeDasharray = L; seg.style.strokeDashoffset = L; seg.setAttribute("opacity", ".9");
      flame.setAttribute("opacity", "1");
      sfx("rocket");
      let lastSpark = 0;
      await run(2000, t => {
        const e = t < .5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
        const pt = seg.getPointAtLength(L * e), ahead = seg.getPointAtLength(Math.min(L, L * e + 2));
        const lift = Math.sin(Math.PI * e) * 30;
        place([pt.x + oa[0] + (ob[0] - oa[0]) * e, pt.y + oa[1] + (ob[1] - oa[1]) * e - lift]);
        tilt.setAttribute("transform", `rotate(${Math.max(-25, Math.min(25, (ahead.x - pt.x) * 6)).toFixed(1)} 0 -7)`);
        seg.style.strokeDashoffset = L * (1 - e);
        if (t - lastSpark > .025) { lastSpark = t; const q = botEl.transform.baseVal.consolidate().matrix; spark(q.e, q.f + 4); }
      });
      tilt.removeAttribute("transform"); flame.setAttribute("opacity", "0");
      puffs(b[0], b[1], 6); sfx("land");
      await sleep(350);
      await setFocus(to.p, true);
    } else if (!flying) {
      const dir = to.k >= from.k ? 1 : -1;
      const fg = focusP === to.p ? focusGeom(to.p) : null, stops = fg ? zStops(PLANETS[to.p].missions.length, fg.Rf) : null;
      for (let k = from.k; k !== to.k; k += dir) {
        const a = botAt(to.p, k), b = botAt(to.p, k + dir);
        let lastPh = 0;
        const road = fg && dir === 1 ? svg.querySelector(`#focus .road[data-k="${k}"]`) : null;
        const ra = road ? [a[0] - fg.fx, a[1] - fg.fy] : null, rb = road ? [b[0] - fg.fx, b[1] - fg.fy] : null;
        const grow = t => { if (!road) return; const ex = ra[0] + (rb[0] - ra[0]) * t, ey = ra[1] + (rb[1] - ra[1]) * t; road.querySelectorAll("path").forEach(pa => pa.setAttribute("d", `M${ra[0].toFixed(1)} ${ra[1].toFixed(1)} L${ex.toFixed(1)} ${ey.toFixed(1)}`)); };
        grow(0);
        await run(fg ? 1150 : 760, t => {
          const ph = (t * (fg ? 3 : 2)) % 1, hop = Math.sin(Math.PI * ph) * (fg ? 20 : 11);
          let x = a[0] + (b[0] - a[0]) * t, y = a[1] + (b[1] - a[1]) * t;
          place([x, y - hop]);
          grow(t);
          const squash = ph < .12 || ph > .9 ? [1.18, .8] : [.92, 1.1];
          sq.setAttribute("transform", `scale(${squash[0]} ${squash[1]})`);
          tilt.setAttribute("transform", `rotate(${(dir * -10 * Math.sin(Math.PI * ph)).toFixed(1)} 0 0)`);
          if (ph < lastPh) { puffs(x, y, 3); sfx("hop"); }
          lastPh = ph;
        });
      }
    }
    arrive();
  }, 600);
}
$("mapFrame").addEventListener("click", e => {
  if (e.target.closest("#mapBot")) { pokeBot(); return; }
  if (traveling) return;
  const d = e.target.closest(".mdot");
  if (d && focusP !== null) { loadLevel(PLANETS[+d.dataset.p].first + +d.dataset.k); showGame(); return; }
  if (e.target.closest(".fdim")) { traveling = true; clearFocus(true).then(() => { traveling = false; }); return; }
  if (e.target.closest(".fplanet")) { loadLevel(nextInPlanet(focusP)); showGame(); return; }
  const p = e.target.closest(".planet"); if (!p) return;
  zoomTo(+p.dataset.i);
});
$("mapFrame").addEventListener("keydown", e => {
  const p = e.target.closest(".planet");
  if (p && !traveling && focusP === null && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); zoomTo(+p.dataset.i); }
  const d = e.target.closest(".mdot");
  if (d && focusP !== null && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); loadLevel(PLANETS[+d.dataset.p].first + +d.dataset.k); showGame(); }
});
async function zoomTo(p) {
  traveling = true;
  await setFocus(p, true);
  traveling = false;
  if (LEVELS[cur].p !== p) botSay("", 1);
}
/* the map always offers one clear way into the game */
let startTarget = null;
function showStartBar() {
  const firstOpen = LEVELS.findIndex((_, i) => !isDone(i));
  const allDone = firstOpen < 0, first = !store.done.length && cur === 0;
  startTarget = !allDone && isDone(cur) ? firstOpen : cur;
  const l = LEVELS[startTarget];
  $("arriveText").textContent = allDone ? "أتممتِ المجرة كاملة! يمكنكِ مراجعة أي مهمة." : first ? `أول مهمة: ${l.title}` : `مهمتك الحالية: ${l.title}`;
  $("arriveGo").textContent = allDone ? "راجعي المهمة" : first ? "ابدئي المهمة الأولى" : "تابعي من حيث توقفتِ";
  $("arriveBar").hidden = false;
}
function showMap(from = null) {
  if (runToken) runToken.cancel = true;
  stopPlayer();
  $("gameView").hidden = true; $("mapView").hidden = false; $("mapBtn").hidden = true;
  $("arriveBar").hidden = true;
  window.scrollTo({ top: 0 });
  renderMap(from);
  if (!from) showStartBar();
}
function showGame() {
  $("mapView").hidden = true; $("gameView").hidden = false; $("mapBtn").hidden = false;
  sizeBoard(); window.scrollTo({ top: 0 });
  startPlayer();
}
$("mapBtn").addEventListener("click", () => showMap());
$("arriveGo").addEventListener("click", () => {
  if (startTarget !== null && startTarget !== cur) loadLevel(startTarget);
  startTarget = null;
  showGame();
});
window.addEventListener("resize", () => {
  if (!$("mapView").hidden && !traveling && ($("mapFrame").clientWidth < 640) !== mapMode) renderMap();
});

function renderMissionTabs() {
  const l = LEVELS[cur], pl = PLANETS[l.p], box = $("mtabs");
  if (!box) return;
  box.hidden = pl.missions.length < 2;
  box.innerHTML = pl.missions.map((m, k) => {
    const idx = pl.first + k, d = store.done.includes(m.id);
    return `<button type="button" data-i="${idx}" class="${idx === cur ? "active" : ""} ${d ? "done" : ""}" aria-current="${idx === cur ? "step" : "false"}"><b>${d ? "✓" : k + 1}</b><span>${m.title}</span></button>`;
  }).join("");
}
function renderLesson() {
  const l = LEVELS[cur], pl = PLANETS[l.p];
  $("lesson").innerHTML = `
    <div class="eyebrow">كوكب ${l.p + 1} · ${pl.title}${pl.missions.length > 1 ? ` · المهمة ${l.m + 1} من ${pl.missions.length}` : ""}</div>
    <nav class="mtabs" id="mtabs" aria-label="مهمات الكوكب"></nav>
    <h2>${l.title}</h2>
    <section class="stage" id="stage" aria-label="روبيكو يشرح">
      <div class="sbubble" id="sbubble" title="اضغطي لإكمال الجملة"><span class="txt" id="stxt"></span><span class="tail" id="stail"></span></div>
      <div class="floor" id="floor">
        <svg class="ground" id="ground" aria-hidden="true"></svg>
        <div class="screen" id="pscreen" hidden><div class="bar"><i></i><i></i><i></i></div><pre id="psample"></pre></div>
        <div class="actor" id="actor" aria-hidden="true">
          <svg viewBox="0 0 100 130">
            <ellipse class="shadow" cx="50" cy="126" rx="26" ry="4" fill="#000" opacity=".45"/>
            <g class="rb"><g class="rb-all">
              <rect class="leg l1" x="36" y="100" width="9" height="20" rx="4" fill="#D88E22"/>
              <rect class="leg l2" x="55" y="100" width="9" height="20" rx="4" fill="#D88E22"/>
              <g class="armL"><rect x="14" y="66" width="9" height="26" rx="4.5" fill="#D88E22"/><circle cx="18.5" cy="94" r="5.5" fill="#F2A93B"/></g>
              <rect x="25" y="62" width="50" height="42" rx="12" fill="#F2A93B"/>
              <rect x="33" y="70" width="34" height="18" rx="5" fill="#0F2229"/>
              <circle cx="41" cy="79" r="3" fill="#FF7A8A" class="twinkle"/><circle cx="50" cy="79" r="3" fill="#6EE7B7" class="twinkle" style="animation-delay:.6s"/><circle cx="59" cy="79" r="3" fill="#8FD3FF" class="twinkle" style="animation-delay:1.2s"/>
              <g class="armR"><rect x="77" y="66" width="9" height="26" rx="4.5" fill="#D88E22"/><circle cx="81.5" cy="94" r="5.5" fill="#F2A93B"/></g>
              <g class="rb-head">
                <rect x="45" y="54" width="10" height="10" fill="#D88E22"/>
                <g class="ant"><rect x="48.6" y="2" width="2.8" height="14" fill="#F2A93B"/><circle cx="50" cy="3" r="4.6" fill="#FF7A8A"/></g>
                <rect x="18" y="14" width="64" height="44" rx="15" fill="#F2A93B"/>
                <rect x="24" y="21" width="52" height="30" rx="10" fill="#0F2229"/>
                <g class="eyes">
                  <g class="e-norm blink"><circle cx="40" cy="34" r="5" fill="#6EE7B7"/><circle cx="60" cy="34" r="5" fill="#6EE7B7"/></g>
                  <g class="e-happy"><path d="M34 36 q6 -8 12 0 M54 36 q6 -8 12 0" fill="none" stroke="#6EE7B7" stroke-width="3.2" stroke-linecap="round"/></g>
                  <g class="e-think"><circle cx="40" cy="33" r="5" fill="#6EE7B7"/><path d="M55 34 h10" stroke="#6EE7B7" stroke-width="3.2" stroke-linecap="round"/></g>
                </g>
                <rect class="mouth" x="43" y="43" width="14" height="5" rx="2.5" fill="#6EE7B7"/>
                <text class="q" x="88" y="12" font-family="Readex Pro, sans-serif" font-size="20" font-weight="700" fill="#F2A93B">؟</text>
              </g>
            </g></g>
          </svg>
        </div>
      </div>
      <div class="pctrl">
        <button class="ibtn" type="button" id="pPrev" aria-label="السابق">▶</button>
        <button class="ibtn play" type="button" id="pPlay" aria-label="إيقاف مؤقت">❚❚</button>
        <button class="ibtn" type="button" id="pNext" aria-label="التالي">◀</button>
        <div class="segs" id="psegs"></div>
        <button class="ibtn" type="button" id="pVoice">تشغيل الصوت</button>
        <select class="ibtn voice-pick" id="pVoicePick" aria-label="اختيار صوت روبيكو" hidden></select>
        <button class="ibtn" type="button" id="pText" aria-pressed="false">النص كامل</button>
        <button class="ibtn" type="button" id="pSkip">تخطي الشرح</button>
      </div>
      <div class="voice-help" id="voiceHelp" hidden></div>
      <div class="transcript" id="ptranscript" hidden>
        ${l.lesson.map(p => `<p>${p}</p>`).join("")}
        <pre class="sample">${hl(l.sample)}</pre>
      </div>
    </section>
    <button class="btn replay" type="button" id="pReplay" hidden>أعيدي الشرح</button>
    <details class="ref">
      <summary>كل أوامر الروبوت</summary>
      <div class="ref-grid">
        <code>right() left() up() down()</code><span>تحريك خانة واحدة</span>
        <code>move("right")</code><span>تحريك باتجاه مكتوب كنص</span>
        <code>canMove("down")</code><span>هل الطريق مفتوح؟ تعيد true أو false</span>
        <code>gemHere()</code><span>هل توجد جوهرة تحت الروبوت؟</span>
        <code>pick()</code><span>التقاط الجوهرة</span>
        <code>say(قيمة)</code><span>الروبوت يقول القيمة</span>
        <code>console.log(قيمة)</code><span>يطبع في الكونسول (رسائل الروبوت)</span>
      </div>
    </details>`;
  $("taskBox").innerHTML = `<strong>المهمة</strong><span>${l.task}</span>`;
  renderMissionTabs();
  startPlayer();
}

/* ---------- Robiko presenter ---------- */
let player = null, voiceOn = false; // spoken explanation is opt-in
try { voiceOn = localStorage.getItem("robiko.voice") === "on"; } catch (e) {}
const closedStages = new Set();
function closeStage() {
  closedStages.add(cur);
  stopPlayer();
  const s = $("stage"), r = $("pReplay");
  if (s) s.hidden = true;
  if (r) r.hidden = false;
}
/* recorded clips live in audio/<mission id>/<slide>.mp3 and audio/common/example.mp3;
   a slide with no clip falls back to the browser's Arabic voice */
let curClip = null, recorded = false;
function hush() {
  try { speechSynthesis.cancel(); } catch (e) {}
  const c = curClip;
  if (!c) return;
  curClip = null;
  c.onerror = null;
  c.pause();
  if (c.onended) c.onended();
}
let arVoice = null, arVoices = [];
function findVoice() {
  try {
    const score = v => (/online|natural|neural/i.test(v.name) ? 4 : 0) + (/google/i.test(v.name) ? 2 : 0) + (/SA/i.test(v.lang) ? 3 : 0);
    arVoices = speechSynthesis.getVoices().filter(v => /^ar/i.test(v.lang)).sort((x, y) => score(y) - score(x));
    let saved = null;
    try { saved = localStorage.getItem("robiko.voiceName"); } catch (e) {}
    arVoice = arVoices.find(v => v.name === saved) || arVoices[0] || null;
  } catch (e) { arVoices = []; arVoice = null; }
}
const voiceLabel = v => v.name.replace(/^Microsoft\s+/, "").replace(/\s*Online\s*\(Natural\)/i, "").replace(/\s*-\s*Arabic\s*/i, " ");
// read the sentence, not the code punctuation around it
const spoken = t => t.replace(/[\u{1F300}-\u{1FAFF}☀-➿]/gu, "").replace(/\/\/|\(\)|[(){}\[\];=<>"`]/g, " ").replace(/\s+/g, " ").trim();
try { findVoice(); speechSynthesis.onvoiceschanged = () => { findVoice(); renderVoiceBtn(); }; } catch (e) {}
const plain = h => { const d = document.createElement("div"); d.innerHTML = h.replace(/<br\s*\/?>/g, " "); return d.textContent.replace(/\s+/g, " ").trim(); };
function stopPlayer() {
  if (!player) return;
  player.token.dead = true;
  clearTimeout(player.timer); clearTimeout(player.token.gt);
  hush();
  const pr = $("actor"); if (pr) pr.classList.remove("talking");
  player = null;
}
function startPlayer(force = false) {
  stopPlayer();
  if ($("gameView").hidden) return;
  const closed = !force && (isDone(cur) || closedStages.has(cur));
  $("stage").hidden = closed; $("pReplay").hidden = !closed;
  if (closed) return;
  const l = LEVELS[cur];
  const slides = l.lesson.map(h => ({ html: h }));
  slides.push({ html: "انظري إلى هذا المثال 👇 اقرئيه سطرًا سطرًا، وانتبهي للتعليقات بعد <code>//</code>.", code: l.sample });
  slides.push({ html: `<b>مهمتك:</b> ${l.task} 💪` });
  player = { slides, i: 0, playing: false, token: {}, seen: new Set() };
  $("psegs").innerHTML = slides.map((_, k) => `<button type="button" data-k="${k}" aria-label="الجزء ${k + 1}"></button>`).join("");
  renderVoiceBtn();
  const a = actorEl(), f = $("floor");
  drawGround();
  a.style.transition = "none"; placeActor(SPOTS[0]);
  void a.offsetWidth; a.style.transition = "";
  showSlide(0);
}
function renderVoiceBtn() {
  const b = $("pVoice"); if (!b) return;
  const on = !!((arVoice || recorded) && voiceOn && soundOn);
  b.setAttribute("aria-pressed", on ? "true" : "false");
  b.textContent = on ? "كتم الصوت" : "تشغيل الصوت";
  const sel = $("pVoicePick");
  if (sel) {
    sel.hidden = recorded || arVoices.length < 2;
    sel.innerHTML = arVoices.map((v, k) => `<option value="${k}"${v === arVoice ? " selected" : ""}>${esc(voiceLabel(v))}</option>`).join("");
  }
}
function renderPlayBtn() {
  const b = $("pPlay"); if (!b || !player) return;
  const atEnd = !player.playing && player.i === player.slides.length - 1 && player.done;
  b.textContent = atEnd ? "↻" : player.playing ? "❚❚" : "▶";
  b.setAttribute("aria-label", atEnd ? "إعادة الشرح" : player.playing ? "إيقاف التشغيل التلقائي" : "تشغيل تلقائي");
  b.title = b.getAttribute("aria-label");
}
function typeInto(el, html, token, perTick, onDone) {
  el.innerHTML = html;
  const nodes = [];
  const walk = n => { for (const c of [...n.childNodes]) { if (c.nodeType === 3) { nodes.push([c, c.textContent]); c.textContent = ""; } else walk(c); } };
  walk(el);
  const caret = document.createElement("span"); caret.className = "caret"; el.appendChild(caret);
  let ni = 0, ci = 0, count = 0;
  const finish = () => { nodes.forEach(([n, t]) => { n.textContent = t; }); caret.remove(); onDone(); };
  token.skip = finish;
  if (reduce) { finish(); return; }
  const tick = () => {
    if (token.dead || token.skipped) return;
    for (let k = 0; k < perTick && ni < nodes.length; k++) {
      const [n, t] = nodes[ni];
      n.textContent = t.slice(0, ++ci);
      if (ci >= t.length) { ni++; ci = 0; }
      if (++count % 7 === 0 && !(voiceOn && (arVoice || recorded))) sfx("blip");
    }
    if (ni >= nodes.length) { caret.remove(); onDone(); return; }
    setTimeout(tick, 28);
  };
  tick();
}
const SPOTS = [.74, .1, .46, .82, .2, .6, .32];
function actorEl() { return $("actor"); }
/* the explanation stage stands on the current planet: its curved surface is the floor */
const GROUND_BOX = 96, GROUND_H = 58, STAGE_PAD = 14;
const groundR = W => W * 1.6;
function drawGround() {
  const g = $("ground"), f = $("floor");
  if (!g || !f || !f.clientWidth) return;
  const p = LEVELS[cur].p, W = f.clientWidth, R = groundR(W), c = PLANET_GRAD[p];
  g.innerHTML = `<defs>
      <radialGradient id="s-pg${p}" cx="35%" cy="30%" r="75%"><stop offset="0" stop-color="${c[0]}"/><stop offset="1" stop-color="${c[1]}"/></radialGradient>
      <clipPath id="s-clip${p}"><circle r="${R}"/></clipPath>
      <radialGradient id="s-shade" cx="30%" cy="28%" r="80%"><stop offset=".55" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".55"/></radialGradient>
      <radialGradient id="s-glow"><stop offset=".4" stop-color="#FFC75A" stop-opacity=".55"/><stop offset="1" stop-color="#FF8A2A" stop-opacity="0"/></radialGradient>
    </defs>
    <g transform="translate(${W / 2 + STAGE_PAD} ${GROUND_BOX - GROUND_H + R})">${planetArt(p, R, "s-")}</g>`;
}
function placeActor(x) {
  const a = actorEl(), f = $("floor");
  if (!a || !f) return;
  const W = f.clientWidth, w = a.offsetWidth, R = groundR(W), dx = (W - w) * x + w / 2 - W / 2;
  a.style.left = (W - w) * x + "px";
  a.style.bottom = (GROUND_H - (R - Math.sqrt(R * R - dx * dx)) - 5) + "px"; // shadow rests on the surface
  a.style.transform = `rotate(${(Math.atan2(dx, R) * 180 / Math.PI).toFixed(1)}deg)`; // upright on the curve
  a.dataset.x = x;
}
function setPose(...cls) {
  const a = actorEl(); if (!a) return;
  a.classList.remove("point", "think", "happy", "smile", "wow", "g-wave", "g-explain", "g-shrug");
  cls.filter(Boolean).forEach(c => a.classList.add(c));
}
function oneShot(cls, ms) {
  const a = actorEl(); if (!a) return;
  a.classList.remove(cls); void a.offsetWidth; a.classList.add(cls);
  setTimeout(() => a.classList.remove(cls), ms);
}
function moveTail(x) {
  const t = $("stail"), f = $("floor"), a = actorEl(); if (!t || !f || !a) return;
  const W = f.clientWidth, w = a.offsetWidth;
  t.style.left = Math.max(24, Math.min(W - 24, (W - w) * x + w / 2)) + "px";
}
function walkTo(x, tok) {
  return new Promise(res => {
    const a = actorEl(), f = $("floor"); if (!a || !f) return res();
    const W = f.clientWidth, w = a.offsetWidth, cur = parseFloat(a.dataset.x || "-1");
    if (Math.abs(cur - x) < .02 || reduce) { placeActor(x); moveTail(x); return res(); }
    a.classList.toggle("flip", x < cur);
    a.classList.add("walking"); setPose();
    placeActor(x); moveTail(x);
    let steps = 0;
    const stepT = setInterval(() => { if (tok.dead) return; if (steps++ % 2 === 0) sfx("step"); }, 140);
    setTimeout(() => { clearInterval(stepT); a.classList.remove("walking"); res(); }, 960);
  });
}
function gestureLoop(tok) {
  const moves = ["g-wave", "g-explain", "g-shrug", "nod", "g-explain", "look"];
  let n = 0;
  const go = () => {
    if (tok.dead || tok.quiet) return;
    const a = actorEl(); if (!a || a.classList.contains("point")) { tok.gt = setTimeout(go, 1500); return; }
    const m = moves[(n++ + Math.floor(Math.random() * 3)) % moves.length];
    if (m === "look") { a.classList.toggle("flip"); }
    else if (m !== "nod") { setPose(m); setTimeout(() => { if (!tok.dead) setPose(); }, 900); }
    tok.gt = setTimeout(go, 1500 + Math.random() * 900);
  };
  tok.gt = setTimeout(go, 700);
}
async function showSlide(i) {
  if (!player) return;
  const P = player, sl = P.slides[i];
  P.token.dead = true; clearTimeout(P.timer); clearTimeout(P.token.gt);
  hush();
  P.token = {}; P.i = i; P.done = false; P.seen.add(i);
  const tok = P.token, a = actorEl(), txt = $("stxt"), scr = $("pscreen"), pre = $("psample"), floor = $("floor");
  [...$("psegs").children].forEach((b, k) => { b.className = k === i ? "on" : P.seen.has(k) ? "seen" : ""; });
  $("pPrev").disabled = i === 0; $("pNext").disabled = i === P.slides.length - 1;
  $("pSkip").textContent = i === P.slides.length - 1 ? "ابدئي الكتابة" : "تخطي الشرح";
  $("pSkip").classList.toggle("primary", i === P.slides.length - 1);
  renderPlayBtn();
  a.classList.remove("talking");
  const codeAt = P.slides.findIndex(x => x.code), last = i === P.slides.length - 1;
  // the screen with the example code lives on the left once we reach the example
  if (i < codeAt) { scr.hidden = true; floor.style.minHeight = ""; }
  else {
    if (scr.hidden) { scr.hidden = false; }
    if (!sl.code) pre.innerHTML = hl(P.slides[codeAt].code);
    floor.style.minHeight = Math.max(200, scr.offsetHeight + 24) + "px";
  }
  const target = i >= codeAt ? .97 : SPOTS[i % SPOTS.length];
  txt.innerHTML = '<span class="caret"></span>';
  const plainT = plain(sl.html);
  // the text starts right away; Robiko walks to its spot while it appears
  walkTo(target, tok).then(() => {
    if (tok.dead) return;
    // face the screen when it is up, otherwise face the middle
    a.classList.toggle("flip", i >= codeAt ? true : target > .5);
    if (sl.code) { setPose("point", "wow"); sfx("pop"); }
    else if (last) { setPose("happy"); oneShot("jump", 1150); sfx("win"); }
    else if (/؟/.test(plainT)) setPose("think");
    else setPose();
    if (!P.done) {
      a.classList.add("talking");
      if (!sl.code && !last) gestureLoop(tok);
    }
  });
  let typed = false, spoke = !(voiceOn && soundOn);
  const settle = () => {
    if (tok.dead || !typed || !spoke) return;
    tok.quiet = true; clearTimeout(tok.gt);
    a.classList.remove("talking");
    if (!sl.code && !last) { setPose(/!/.test(plainT) ? "happy" : ""); if (/!/.test(plainT)) oneShot("jump", 600); }
    P.done = true; renderPlayBtn();
    if (!P.playing) return;
    if (!last) P.timer = setTimeout(() => { if (!tok.dead && P.playing) showSlide(i + 1); }, Math.max(1300, plainT.length * 30));
    else { P.playing = false; renderPlayBtn(); }
  };
  if (!spoke) {
    const voiceFailed = () => {
      if (tok.dead) return;
      spoke = true;
      if (!arVoice) { voiceOn = false; renderVoiceBtn(); } // so the next press tries again
      settle(); voiceHelp(true);
    };
    // a short gap after cancel(): some browsers silently drop a speak() that follows it at once
    const speakWithVoice = () => setTimeout(() => {
      if (tok.dead) return;
      if (!arVoice) { voiceFailed(); return; }
      try {
        const u = new SpeechSynthesisUtterance(spoken(plainT));
        let started = false;
        u.voice = arVoice; u.lang = arVoice.lang; u.rate = .95; u.pitch = 1;
        u.onstart = () => { started = true; };
        u.onend = () => { spoke = true; settle(); };
        u.onerror = e => { if (e.error === "interrupted" || e.error === "canceled") { spoke = true; settle(); } else voiceFailed(); };
        speechSynthesis.speak(u);
        setTimeout(() => { if (!started && !spoke) voiceFailed(); }, 4000);
      } catch (e) { voiceFailed(); }
    }, 150);
    const clip = new Audio(sl.code ? "audio/common/example.mp3" : `audio/${LEVELS[cur].id}/${i + 1}.mp3`);
    let fell = false;
    const noClip = () => {
      if (fell || tok.dead || curClip !== clip) return;
      fell = true; curClip = null;
      speakWithVoice();
    };
    curClip = clip;
    clip.onended = () => { if (curClip === clip) curClip = null; spoke = true; settle(); };
    clip.onerror = noClip;
    clip.onplaying = () => { if (!recorded) { recorded = true; renderVoiceBtn(); } };
    const playing = clip.play();
    if (playing) playing.catch(noClip);
  }
  const afterText = () => {
    if (sl.code) {
      const code = sl.code; let n = 0;
      const step = () => {
        if (tok.dead) return;
        n = reduce ? code.length : Math.min(code.length, n + 3);
        pre.innerHTML = hl(code.slice(0, n)) + (n < code.length ? '<span class="caret" style="background:var(--amber)"></span>' : "");
        floor.style.minHeight = Math.max(200, scr.offsetHeight + 24) + "px";
        if (n < code.length) setTimeout(step, 22); else { typed = true; setPose("point", "smile"); settle(); }
      };
      pre.textContent = ""; step();
    } else { typed = true; settle(); }
  };
  typeInto(txt, sl.html, tok, 2, afterText);
}
function voiceHelp(failed = false) {
  const box = $("voiceHelp"); if (!box) return;
  box.hidden = failed ? false : !box.hidden;
  box.innerHTML = `<b>${failed ? "تعذّر على المتصفح تشغيل صوت روبيكو. تأكدي أن صوت الجهاز والتبويب غير مكتوم، أو جرّبي هذه الحلول:" : "يحتاج صوت روبيكو إلى صوت عربي في جهازكِ:"}</b>
    <ul>
      <li><b>الأسهل:</b> افتحي اللعبة في متصفح <b>Microsoft Edge</b>، ففيه أصوات عربية جاهزة وواضحة.</li>
      <li><b>ويندوز:</b> الإعدادات ← الوقت واللغة ← الكلام ← إضافة أصوات ← العربية (السعودية).</li>
      <li><b>ماك:</b> إعدادات النظام ← تسهيلات الاستخدام ← المحتوى المنطوق ← صوت النظام ← إدارة الأصوات ← العربية.</li>
      <li><b>آيفون:</b> الإعدادات ← تسهيلات الاستخدام ← المحتوى المنطوق ← الأصوات ← العربية.</li>
      <li><b>أندرويد:</b> الإعدادات ← تحويل النص إلى كلام ← محرك Google ← نزّلي اللغة العربية.</li>
    </ul>
    ثم حدّثي الصفحة، وسيشغّل زر «تشغيل الصوت» صوت روبيكو.`;
}
$("lesson").addEventListener("click", e => {
  if (!player) return;
  const t = e.target;
  if (t.closest("#sbubble") && !t.closest("#voiceHelp")) { if (player.token.skip && !player.done) { player.token.skipped = true; player.token.skip(); } return; }
  if (t.closest("#pSkip")) {
    closeStage();
    document.querySelector(".editor").scrollIntoView({ block: "nearest", behavior: reduce ? "auto" : "smooth" });
    if (matchMedia("(hover: hover)").matches) ta.focus({ preventScroll: true });
    return;
  }
  if (t.closest("#pNext")) { showSlide(Math.min(player.i + 1, player.slides.length - 1)); return; }
  if (t.closest("#pPrev")) { showSlide(Math.max(player.i - 1, 0)); return; }
  const seg = t.closest("#psegs button"); if (seg) { showSlide(+seg.dataset.k); return; }
  if (t.closest("#pPlay")) {
    const atEnd = !player.playing && player.i === player.slides.length - 1 && player.done;
    if (atEnd) { player.seen.clear(); showSlide(0); return; }
    player.playing = !player.playing;
    if (!player.playing) { clearTimeout(player.timer); hush(); actorEl().classList.remove("talking"); clearTimeout(player.token.gt); player.token.quiet = true; }
    else showSlide(player.done ? Math.min(player.i + 1, player.slides.length - 1) : player.i);
    renderPlayBtn(); return;
  }
  if (t.closest("#actor")) { oneShot("twirl", 650); sfx("boing"); return; }
  if (t.closest("#pVoice")) {
    voiceOn = !voiceOn; try { localStorage.setItem("robiko.voice", voiceOn ? "on" : "off"); } catch (e) {}
    if (voiceOn && !soundOn) { soundOn = true; try { localStorage.setItem("robiko.sound", "on"); } catch (e) {} renderSoundBtn(); }
    renderVoiceBtn(); if (!voiceOn) { hush(); }
    showSlide(player.i); return;
  }
  if (t.closest("#pText")) {
    const tr = $("ptranscript"), b = $("pText"); tr.hidden = !tr.hidden; b.setAttribute("aria-pressed", String(!tr.hidden)); return;
  }
});
$("lesson").addEventListener("change", e => {
  if (e.target.id !== "pVoicePick" || !player) return;
  arVoice = arVoices[+e.target.value] || arVoice;
  voiceOn = true;
  try { localStorage.setItem("robiko.voiceName", arVoice.name); localStorage.setItem("robiko.voice", "on"); } catch (err) {}
  if (!soundOn) { soundOn = true; try { localStorage.setItem("robiko.sound", "on"); } catch (err) {} renderSoundBtn(); }
  renderVoiceBtn();
  showSlide(player.i);
});
$("lesson").addEventListener("click", e => {
  const b = e.target.closest(".mtabs button"); if (b) loadLevel(+b.dataset.i);
  if (e.target.closest("#pReplay")) { closedStages.delete(cur); startPlayer(true); }
});
$("toCode").addEventListener("click", () => {
  document.querySelector(".editor").scrollIntoView({ block: "start", behavior: reduce ? "auto" : "smooth" });
});

function sizeBoard() {
  const l = LEVELS[cur], cols = l.map[0].length;
  const avail = $("boardWrap").clientWidth - 8;
  gap = cols > 10 ? 3 : 4;
  cell = Math.max(20, Math.min(54, Math.floor((avail - gap * (cols + 1)) / cols)));
  const b = $("board");
  b.style.setProperty("--cell", cell + "px");
  b.style.setProperty("--gap", gap + "px");
  b.style.gridTemplateColumns = `repeat(${cols}, var(--cell))`;
}

function buildBoard() {
  const l = LEVELS[cur], b = $("board");
  b.innerHTML = ""; gemEls = {}; cellEls = [];
  l.map.forEach((row, r) => {
    cellEls[r] = [];
    [...row].forEach((ch, c) => {
      const d = document.createElement("div");
      d.className = "cell " + (ch === "#" ? "wall" : "floor");
      if (ch === "*") { d.insertAdjacentHTML("beforeend", GEM_SVG); gemEls[r + "," + c] = d.lastElementChild; }
      if (ch === "G") d.insertAdjacentHTML("beforeend", GOAL_SVG);
      b.appendChild(d); cellEls[r][c] = d;
    });
  });
  b.appendChild(bot); b.appendChild(bubble);
  sizeBoard();
  resetBoard();
}

function placeBot(r, c, dir) {
  bot.style.setProperty("--x", c); bot.style.setProperty("--y", r);
  bubble.style.setProperty("--x", c); bubble.style.setProperty("--y", r);
  if (dir) bot.dataset.dir = dir;
}
let gemsTaken = 0;
function updateGemChip() {
  const l = LEVELS[cur], chip = $("gemChip");
  chip.hidden = !l.gems;
  chip.textContent = `الجواهر ${gemsTaken} / ${l.gems}`;
  chip.classList.toggle("ok", l.gems && gemsTaken === l.gems);
}
function resetBoard() {
  const l = LEVELS[cur];
  bot.classList.remove("crash", "win");
  bot.style.transition = "none";
  placeBot(l.start[0], l.start[1], "right");
  void bot.offsetWidth; bot.style.transition = "";
  bubble.hidden = true;
  Object.values(gemEls).forEach(g => g.classList.remove("taken"));
  cellEls.flat().forEach(c => c.classList.remove("visited"));
  gemsTaken = 0; updateGemChip();
  $("overlay").hidden = true;
}
window.addEventListener("resize", () => {
  sizeBoard();
  const a = $("actor"), f = $("floor");
  if (a && f && f.clientWidth && a.dataset.x) { const x = Math.min(1, +a.dataset.x); drawGround(); placeActor(x); moveTail(x); }
});

/* ---------- editor ---------- */
const ta = $("code");
function syncEditor() {
  $("hl").innerHTML = hl(ta.value) + "\n";
  const n = ta.value.split("\n").length;
  $("gutter").textContent = Array.from({ length: n }, (_, i) => i + 1).join("\n");
  const lines = Math.max(14, n + 2);
  document.querySelector(".code-wrap").style.height = `calc(${lines} * 1.6 * var(--code-fs) + 28px)`;
  syncScroll();
}
function syncScroll() { $("hl").scrollTop = ta.scrollTop; $("hl").scrollLeft = ta.scrollLeft; $("gutter").scrollTop = ta.scrollTop; }
ta.addEventListener("input", () => { syncEditor(); store.drafts[LEVELS[cur].id] = ta.value; save(); });
ta.addEventListener("scroll", syncScroll);
function insert(text) {
  const s = ta.selectionStart, e = ta.selectionEnd;
  ta.setRangeText(text, s, e, "end");
  ta.dispatchEvent(new Event("input"));
}
ta.addEventListener("keydown", e => {
  if ((e.ctrlKey || e.metaKey) && e.key === "Enter") { e.preventDefault(); toggleRun(); return; }
  if (e.key === "Tab") { e.preventDefault(); insert("  "); return; }
  if (e.key === "Enter") {
    e.preventDefault();
    const before = ta.value.slice(0, ta.selectionStart);
    const line = before.slice(before.lastIndexOf("\n") + 1);
    let ind = (line.match(/^\s*/) || [""])[0];
    if (/[{[(]\s*$/.test(line)) ind += "  ";
    insert("\n" + ind);
  }
  if (e.key === "}") {
    const before = ta.value.slice(0, ta.selectionStart);
    const line = before.slice(before.lastIndexOf("\n") + 1);
    if (/^\s{2,}$/.test(line)) { e.preventDefault(); ta.setRangeText("", ta.selectionStart - 2, ta.selectionStart, "end"); insert("}"); }
  }
});

/* ---------- console ---------- */
function log(text, type = "info", raw) {
  const li = document.createElement("li");
  li.className = type;
  li.textContent = text;
  if (raw) { const s = document.createElement("span"); s.className = "raw"; s.textContent = raw; li.appendChild(s); }
  $("log").appendChild(li);
  $("log").scrollTop = $("log").scrollHeight;
}
function clearLog() { $("log").innerHTML = ""; }

/* ---------- running ---------- */
const RUNTIME = $("runtime").textContent;

function execute(code, l) {
  return new Promise(resolve => {
    const header = "var __D = " + JSON.stringify({ grid: l.map, start: l.start }) + ";\n" + RUNTIME + "\ntry {\n(function(){\"use strict\";\n";
    const userStart = header.split("\n").length;
    const src = header + code + "\n})();\n__done(null);\n} catch (__e) { __done(__e); }\n";
    const url = URL.createObjectURL(new Blob([src], { type: "text/javascript" }));
    let w;
    try { w = new Worker(url); } catch (e) { resolve({ fatal: "تعذّر تشغيل الكود في هذا المتصفح." }); return; }
    const timer = setTimeout(() => { w.terminate(); URL.revokeObjectURL(url); resolve({ timeout: true }); }, 2500);
    w.onmessage = ev => { clearTimeout(timer); w.terminate(); URL.revokeObjectURL(url); resolve(Object.assign(ev.data, { userStart })); };
    w.onerror = ev => {
      ev.preventDefault(); clearTimeout(timer); w.terminate(); URL.revokeObjectURL(url);
      resolve({ syntax: { message: ev.message || "SyntaxError", line: ev.lineno ? ev.lineno - userStart + 1 : null } });
    };
  });
}

function userLine(stack, userStart, total) {
  const nums = [...String(stack).matchAll(/:(\d+):\d+\)?/g)].map(m => +m[1]);
  const hit = nums.find(n => n >= userStart && n < userStart + total);
  return hit ? hit - userStart + 1 : null;
}

function explain(err, line) {
  const at = line ? ` (السطر ${line})` : "";
  switch (err.kind) {
    case "crash": return `اصطدم الروبوت بجدار وهو يتحرك ${DIR_AR[err.extra] || ""}${at}.`;
    case "nogem": return `استدعيتِ pick() والروبوت ليس فوق جوهرة${at}. تأكدي بـ if (gemHere()) قبلها.`;
    case "baddir": return `الاتجاه "${err.extra}" غير معروف${at}. استخدمي "right" أو "left" أو "up" أو "down" بين علامتي تنصيص.`;
    case "limit": return "نفّذ الروبوت أكثر من 3000 أمر. على الأرجح لديكِ حلقة لا تنتهي.";
  }
  let m;
  if (err.name === "ReferenceError" && (m = err.message.match(/^(\S+) is not defined/)))
    return `الاسم "${m[1]}" غير معروف${at}. تأكدي من الكتابة، فالحروف الكبيرة والصغيرة مختلفة (right غير Right).`;
  if (err.name === "TypeError" && (m = err.message.match(/(\S+) is not a function/)))
    return `"${m[1]}" ليست دالة، فلا يمكن استدعاؤها بقوسين ()${at}.`;
  if (err.name === "TypeError" && /constant variable/.test(err.message))
    return `حاولتِ تغيير قيمة متغير معرّف بـ const${at}. استخدمي let إذا كانت القيمة ستتغير.`;
  return `حدث خطأ${at}: ${err.name}`;
}

async function toggleRun() {
  if (runToken) { runToken.cancel = true; return; }
  const l = LEVELS[cur], code = ta.value;
  const token = runToken = { cancel: false };
  $("runBtn").classList.add("stop"); $("runLabel").textContent = "إيقاف";
  resetBoard(); clearLog();
  closeStage();
  // on phones the board sits under the editor: bring it into view so the run can be watched
  if (matchMedia("(max-width: 880px)").matches) document.querySelector(".boardp").scrollIntoView({ block: "start", behavior: reduce ? "auto" : "smooth" });
  const res = await execute(code, l);

  let won = false;
  const finish = () => {
    if (!won && !token.cancel) { failedRuns[l.id] = (failedRuns[l.id] || 0) + 1; updateSolBtn(); }
    if (runToken !== token) return;
    runToken = null; $("runBtn").classList.remove("stop"); $("runLabel").textContent = "تشغيل";
  };

  if (res.fatal) { log(res.fatal, "err"); return finish(); }
  if (res.timeout) { log("استغرق الكود وقتًا طويلًا ولم ينتهِ. هل لديكِ حلقة لا تنتهي؟ تأكدي أن شرط while يصبح false في وقت ما.", "err"); return finish(); }
  if (res.syntax) {
    const at = res.syntax.line && res.syntax.line > 0 ? ` في السطر ${res.syntax.line}` : "";
    log(`خطأ في كتابة الكود${at}. تأكدي أن كل قوس ( و { له قوس إغلاق، وأن النصوص بين علامات تنصيص.`, "err", res.syntax.message.replace(/^Uncaught\s*/, ""));
    return finish();
  }

  const says = [];
  const delay = reduce ? 120 : 270;
  for (const e of res.events) {
    if (token.cancel) { resetBoard(); log("أوقفتِ التشغيل.", "info"); return finish(); }
    if (e.t === "move") {
      placeBot(e.r, e.c, e.dir); cellEls[e.r][e.c].classList.add("visited"); sfx("step");
      await sleep(delay);
    } else if (e.t === "pick") {
      gemEls[e.r + "," + e.c].classList.add("taken"); gemsTaken++; updateGemChip(); sfx("gem");
      const gc = cellEls[e.r][e.c]; gc.classList.remove("sparkle"); void gc.offsetWidth; gc.classList.add("sparkle");
      await sleep(delay * .6);
    } else if (e.t === "say") {
      says.push(e.text); log(e.text, "say");
      bubble.textContent = e.text; bubble.hidden = false; sfx("say");
      await sleep(delay * 3); bubble.hidden = true;
    } else if (e.t === "crash") {
      bot.dataset.dir = e.dir; bot.classList.add("crash"); sfx("crash");
      await sleep(400);
    }
  }
  res.says = says;

  if (res.err) {
    const total = code.split("\n").length;
    log(explain(res.err, userLine(res.err.stack, res.userStart, total)), "err", res.err.kind ? null : res.err.message);
    return finish();
  }
  const atGoal = l.mode === "console" || (res.pos[0] === l.goal[0] && res.pos[1] === l.goal[1]);
  if (!atGoal) { log("انتهى الكود ولم يصل الروبوت إلى العلم. أضيفي مزيدًا من الأوامر وجرّبي مرة أخرى.", "err"); return finish(); }
  if (res.gemsLeft > 0) { log(`وصلتِ إلى العلم، لكن بقي ${res.gemsLeft} من الجواهر لم تُجمع.`, "err"); return finish(); }
  const clean = code.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/.*$/gm, "");
  for (const n of l.needs || []) if (!n.re.test(clean)) { log(n.msg, "err"); return finish(); }
  if (l.check) { const msg = l.check(res, clean); if (msg) { log(msg, "err"); return finish(); } }

  won = true;
  win();
  finish();
}

/* the solution stays out of the way until a hint or a couple of tries */
const failedRuns = {}, hintsSeen = new Set();
function updateSolBtn() {
  const id = LEVELS[cur].id;
  $("solBtn").hidden = !(isDone(cur) || hintsSeen.has(id) || (failedRuns[id] || 0) >= 2);
}

let nextAction = null;
function confetti() {
  if (reduce) return;
  const host = document.querySelector(".boardp");
  const colors = ["#F2A93B", "#FF7A8A", "#6EE7B7", "#8FD3FF", "#FFE2A8", "#9B83FF"];
  for (let i = 0; i < 46; i++) {
    const d = document.createElement("i");
    d.className = "confetti";
    d.style.background = pick(colors);
    if (Math.random() < .35) d.style.borderRadius = "50%";
    const ang = Math.random() * Math.PI * 2, dist = 80 + Math.random() * 180;
    d.style.setProperty("--dx", (Math.cos(ang) * dist).toFixed(0) + "px");
    d.style.setProperty("--dy", (Math.sin(ang) * dist * .6 + 120).toFixed(0) + "px");
    d.style.setProperty("--rot", ((Math.random() - .5) * 900).toFixed(0) + "deg");
    d.style.animationDelay = (Math.random() * .12).toFixed(2) + "s";
    host.appendChild(d); setTimeout(() => d.remove(), 1800);
  }
}
function win() {
  const l = LEVELS[cur], pl = PLANETS[l.p];
  bot.classList.add("win");
  sfx("win"); confetti();
  bubble.textContent = pick(["رائع! 🎉", "أحسنتِ!", "عبقرية! 🧠", "كود نظيف ✨", "مذهل!"]); bubble.hidden = false;
  setTimeout(() => { bubble.hidden = true; }, 1600);
  log("ممتاز! أتممتِ المهمة.", "ok");
  const wasPlanetDone = planetDone(l.p);
  if (!store.done.includes(l.id)) store.done.push(l.id);
  save(); renderStrip(); renderMissionTabs(); updateSolBtn();
  const lastInPlanet = l.m === pl.missions.length - 1;
  if (!lastInPlanet) {
    $("winText").textContent = `أتممتِ المهمة ${l.m + 1} من ${pl.missions.length} في كوكب ${pl.title}.`;
    $("nextBtn").textContent = "المهمة التالية";
    nextAction = () => { const from = { p: l.p, k: l.m }; loadLevel(cur + 1); showMap(from); };
  } else if (!planetDone(l.p)) {
    $("winText").textContent = `بقيت مهمات لم تُتمّيها في كوكب ${pl.title}.`;
    $("nextBtn").textContent = "أكملي الباقي";
    nextAction = () => { const from = { p: l.p, k: l.m }; loadLevel(nextInPlanet(l.p)); showMap(from); };
  } else if (l.p === PLANETS.length - 1) {
    const all = LEVELS.every((_, i) => isDone(i));
    $("winText").textContent = all ? "أتممتِ المجرة كاملة! أنتِ تعرفين الآن الأوامر والحلقات والمتغيرات والشروط والدوال والمصفوفات." : "أتممتِ التحدي الأخير! بقيت مهمات في كواكب أخرى، تجدينها في الخريطة.";
    $("nextBtn").textContent = "خريطة المجرة";
    if (!wasPlanetDone) justWon = l.p;
    nextAction = () => showMap();
  } else {
    $("winText").textContent = `أتممتِ كوكب ${pl.title} كاملًا!`;
    $("nextBtn").textContent = "انطلقي للكوكب التالي";
    if (!wasPlanetDone) justWon = l.p;
    nextAction = () => { const from = { p: l.p, k: l.m }; loadLevel(nextInPlanet(l.p + 1)); showMap(from); };
  }
  setTimeout(() => { $("overlay").hidden = false; $("nextBtn").focus(); }, reduce ? 0 : 700);
}
$("nextBtn").addEventListener("click", () => { if (nextAction) nextAction(); });
$("stayBtn").addEventListener("click", () => { resetBoard(); ta.focus(); });
$("runBtn").addEventListener("click", toggleRun);

$("hintBtn").addEventListener("click", () => {
  const box = $("hintbox");
  box.innerHTML = `<b>تلميح:</b> ${LEVELS[cur].hint}`;
  box.hidden = !box.hidden;
  if (!box.hidden) { hintsSeen.add(LEVELS[cur].id); updateSolBtn(); }
});
$("solBtn").addEventListener("click", () => {
  if (!solArmed) {
    solArmed = true; $("solBtn").textContent = "هل أنتِ متأكدة؟ اضغطي مرة أخرى";
    setTimeout(() => { solArmed = false; $("solBtn").textContent = "الحل"; }, 3000);
    return;
  }
  solArmed = false; $("solBtn").textContent = "الحل";
  ta.value = LEVELS[cur].solution; ta.dispatchEvent(new Event("input"));
  log("وضعتُ لكِ الحل في المحرر. اقرئيه سطرًا سطرًا، ثم اضغطي تشغيل.", "info");
});
$("resetBtn").addEventListener("click", () => {
  ta.value = LEVELS[cur].starter; ta.dispatchEvent(new Event("input"));
  log("عاد الكود إلى نقطة البداية.", "info");
});

function loadLevel(i) {
  if (runToken) runToken.cancel = true;
  runToken = null; $("runBtn").classList.remove("stop"); $("runLabel").textContent = "تشغيل";
  cur = i; store.cur = i; save();
  renderStrip(); renderLesson();
  const l = LEVELS[i];
  $("boardTitle").textContent = l.mode === "console" ? "الروبوت يسمعك" : `المهمة ${l.m + 1} · ${l.title}`;
  ta.value = store.drafts[l.id] != null ? store.drafts[l.id] : l.starter;
  syncEditor();
  updateSolBtn();
  $("hintbox").hidden = true;
  buildBoard();
  clearLog();
  log("اكتبي الكود واضغطي تشغيل. يمكنكِ التجربة كما تشائين.", "info");
}

renderSoundBtn();
loadLevel(cur);
showMap();
