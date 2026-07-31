/* =====================================================================
   Versteckte Zugabe: „TIE BREAKER“ – ein Vektorspiel im Stil der frühen
   Achtziger (Vectrex/Battlezone: eine Strichfarbe, kein Füllen, alles Linien).
   ---------------------------------------------------------------------
   Start: Doppelklick auf die Überschrift „Optionen“ im ⚙-Menü.
   Steuerung: WASD zielen, Leertaste Laser, Alt Rakete (eine regeneriert
   alle 30 Sekunden). Läuft endlos, bis der Schild aufgebraucht ist.

   Der Ton kommt aus einem einzelnen Rechteck-Oszillator – so klang der
   PC-Lautsprecher, und es braucht keine Audiodateien.

   Die Bestenliste ist bewusst kontolos: nur drei Buchstaben und eine Zahl,
   global für alle Besucher (API-Aktionen arcade_top / arcade_add). Ohne
   Server läuft das Spiel trotzdem, dann bleibt die Liste lokal.
   ===================================================================== */
'use strict';

(function () {
  const W = 640, H = 480;                 // 4:3
  const KEY = 'swd6_arcade_local';        // Rückfalliste ohne Server

  let cv, ctx, box, raf = 0, running = false;
  let audio = null;

  /* ---------------- Ton: ein Rechteck-Oszillator, kurz getastet ------- */
  function beep(freq, ms, vol) {
    try {
      if (!audio) audio = new (window.AudioContext || window.webkitAudioContext)();
      const o = audio.createOscillator(), g = audio.createGain();
      o.type = 'square';
      o.frequency.value = freq;
      g.gain.value = vol == null ? 0.04 : vol;
      o.connect(g); g.connect(audio.destination);
      o.start();
      o.stop(audio.currentTime + ms / 1000);
    } catch (e) { /* Ton ist Beiwerk, nie ein Grund zum Abbruch */ }
  }
  function sweep(from, to, ms) {
    try {
      if (!audio) audio = new (window.AudioContext || window.webkitAudioContext)();
      const o = audio.createOscillator(), g = audio.createGain();
      o.type = 'square';
      o.frequency.setValueAtTime(from, audio.currentTime);
      o.frequency.linearRampToValueAtTime(to, audio.currentTime + ms / 1000);
      g.gain.value = 0.05;
      o.connect(g); g.connect(audio.destination);
      o.start(); o.stop(audio.currentTime + ms / 1000);
    } catch (e) {}
  }

  /* ---------------- Spielzustand ---------------- */
  const S = {
    keys: {}, foes: [], shots: [], rockets: [], sparks: [],
    aimX: 0, aimY: 0, score: 0, shield: 0, ammo: 0, ammoAt: 0,
    wave: 0, spawnAt: 0, over: false, name: '', top: [], sent: false, msg: '',
  };
  const MAX_AMMO = 4, AMMO_MS = 30000;

  function reset() {
    S.foes = []; S.shots = []; S.rockets = []; S.sparks = [];
    S.aimX = 0; S.aimY = 0; S.score = 0; S.shield = 5;
    S.ammo = MAX_AMMO; S.ammoAt = performance.now();
    S.wave = 0; S.spawnAt = 0; S.over = false; S.name = ''; S.sent = false; S.msg = '';
  }

  /* Gegner kommen aus der Tiefe: z läuft von 1 (fern) auf 0 (Cockpit). */
  function spawn() {
    const ang = Math.random() * Math.PI * 2, r = 0.25 + Math.random() * 0.75;
    S.foes.push({
      x: Math.cos(ang) * r, y: Math.sin(ang) * r * 0.7, z: 1,
      /* 50 % schneller als ursprünglich – fordernd, aber noch zu treffen. */
      spd: (0.055 + Math.random() * 0.05 + S.wave * 0.004) * 1.5,
      roll: Math.random() * Math.PI, hit: 0,
    });
    beep(120, 40, 0.03);
  }

  /* ---------------- Zeichnen (nur Linien, eine Farbe) ---------------- */
  function proj(f) {
    const s = 1 / (0.15 + f.z * 0.85);
    return { sx: W / 2 + f.x * W * 0.45 * s, sy: H / 2 + f.y * H * 0.45 * s, s: s };
  }
  function line(a, b, c, d) { ctx.beginPath(); ctx.moveTo(a, b); ctx.lineTo(c, d); ctx.stroke(); }

  function drawFoe(f) {
    const p = proj(f), r = 12 * p.s;
    if (r < 0.6 || r > 900) return;
    ctx.save();
    ctx.translate(p.sx, p.sy);
    ctx.rotate(Math.sin(f.roll) * 0.25);
    ctx.beginPath();                       // Kugelcockpit
    ctx.arc(0, 0, r * 0.45, 0, Math.PI * 2);
    ctx.stroke();
    line(-r * 0.45, 0, -r * 0.95, 0);      // Träger
    line(r * 0.45, 0, r * 0.95, 0);
    [-1, 1].forEach(s => {                 // sechseckige Flügel
      ctx.beginPath();
      ctx.moveTo(s * r * 0.95, -r * 1.15);
      ctx.lineTo(s * r * 1.3, -r * 0.5);
      ctx.lineTo(s * r * 1.3, r * 0.5);
      ctx.lineTo(s * r * 0.95, r * 1.15);
      ctx.lineTo(s * r * 0.6, r * 0.5);
      ctx.lineTo(s * r * 0.6, -r * 0.5);
      ctx.closePath(); ctx.stroke();
    });
    ctx.restore();
  }

  function drawCockpit() {
    ctx.globalAlpha = 0.55;
    line(0, H * 0.78, W * 0.28, H * 0.62);        // Rahmenstreben
    line(W, H * 0.78, W * 0.72, H * 0.62);
    line(W * 0.28, H * 0.62, W * 0.72, H * 0.62);
    line(W * 0.5, 0, W * 0.5, H * 0.10);
    ctx.globalAlpha = 1;
    const x = W / 2 + S.aimX * W * 0.45, y = H / 2 + S.aimY * H * 0.45;
    ctx.beginPath(); ctx.arc(x, y, 13, 0, Math.PI * 2); ctx.stroke();
    line(x - 22, y, x - 8, y); line(x + 8, y, x + 22, y);
    line(x, y - 22, x, y - 8); line(x, y + 8, x, y + 22);
    S.aimSX = x; S.aimSY = y;
  }

  function drawHud() {
    ctx.font = '14px monospace';
    ctx.fillText('SCORE ' + String(S.score).padStart(6, '0'), 12, 22);
    ctx.fillText('SHIELD ' + '|'.repeat(Math.max(0, S.shield)), 12, H - 14);
    ctx.fillText('MSL ' + '▲'.repeat(S.ammo), W - 110, H - 14);
  }

  function drawStars() {
    ctx.globalAlpha = 0.5;
    for (let i = 0; i < 40; i++) {
      const a = (i * 7919) % 1000 / 1000, b = (i * 104729) % 1000 / 1000;
      ctx.fillRect(a * W, b * H * 0.6, 1, 1);
    }
    ctx.globalAlpha = 1;
  }

  /* ---------------- Ablauf ---------------- */
  function fireLaser() {
    S.shots.push({ x: S.aimX, y: S.aimY, t: 0 });
    beep(880, 45, 0.05);
  }
  function fireRocket() {
    if (S.ammo <= 0) { beep(160, 70, 0.03); return; }
    S.ammo--;
    S.rockets.push({ x: S.aimX, y: S.aimY, t: 0 });
    sweep(300, 900, 220);
  }

  function hitTest(sx, sy, radius) {
    let best = -1, bestZ = 2;
    S.foes.forEach((f, i) => {
      const p = proj(f), r = 14 * p.s + radius;
      const d = Math.hypot(p.sx - sx, p.sy - sy);
      if (d < r && f.z < bestZ) { best = i; bestZ = f.z; }
    });
    return best;
  }

  function boom(f, pts) {
    const p = proj(f);
    for (let i = 0; i < 10; i++)
      S.sparks.push({ x: p.sx, y: p.sy, a: Math.random() * Math.PI * 2,
                      v: 1 + Math.random() * 3, t: 0 });
    S.score += pts;
    sweep(500, 90, 260);
  }

  function step(dt, now) {
    /* Zielen */
    const sp = 1.7 * dt;                  // doppelt so flink wie die erste Fassung (0.85)
    if (S.keys['a']) S.aimX -= sp;
    if (S.keys['d']) S.aimX += sp;
    if (S.keys['w']) S.aimY -= sp;
    if (S.keys['s']) S.aimY += sp;
    S.aimX = Math.max(-1, Math.min(1, S.aimX));
    S.aimY = Math.max(-1, Math.min(1, S.aimY));

    /* Munition regeneriert */
    if (S.ammo < MAX_AMMO && now - S.ammoAt > AMMO_MS) {
      S.ammo++; S.ammoAt = now; beep(1200, 60, 0.03);
    }

    /* Nachschub */
    if (now > S.spawnAt) {
      spawn();
      S.wave++;
      S.spawnAt = now + Math.max(450, 1600 - S.wave * 18);
    }

    /* Gegner heranfliegen lassen */
    for (let i = S.foes.length - 1; i >= 0; i--) {
      const f = S.foes[i];
      f.z -= f.spd * dt;
      f.roll += dt * 1.5;
      if (f.z <= 0.02) {                    // durchgebrochen
        S.foes.splice(i, 1);
        S.shield--;
        sweep(200, 60, 320);
        if (S.shield <= 0) gameOver();
      }
    }

    /* Laser: trifft sofort auf der Ziellinie */
    for (let i = S.shots.length - 1; i >= 0; i--) {
      const s = S.shots[i];
      s.t += dt;
      const sx = W / 2 + s.x * W * 0.45, sy = H / 2 + s.y * H * 0.45;
      const k = hitTest(sx, sy, 4);
      if (k >= 0) { boom(S.foes[k], 100); S.foes.splice(k, 1); S.shots.splice(i, 1); }
      else if (s.t > 0.12) S.shots.splice(i, 1);
    }
    /* Raketen: größerer Radius, räumen mehrere ab */
    for (let i = S.rockets.length - 1; i >= 0; i--) {
      const r = S.rockets[i];
      r.t += dt;
      if (r.t > 0.35) {
        const sx = W / 2 + r.x * W * 0.45, sy = H / 2 + r.y * H * 0.45;
        for (let k = S.foes.length - 1; k >= 0; k--) {
          const p = proj(S.foes[k]);
          if (Math.hypot(p.sx - sx, p.sy - sy) < 90) { boom(S.foes[k], 150); S.foes.splice(k, 1); }
        }
        S.rockets.splice(i, 1);
      }
    }
    for (let i = S.sparks.length - 1; i >= 0; i--) {
      const s = S.sparks[i]; s.t += dt;
      if (s.t > 0.4) S.sparks.splice(i, 1);
    }
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    ctx.strokeStyle = '#39ff7a'; ctx.fillStyle = '#39ff7a'; ctx.lineWidth = 1.6;
    drawStars();
    S.foes.slice().sort((a, b) => b.z - a.z).forEach(drawFoe);
    S.shots.forEach(s => {
      const sx = W / 2 + s.x * W * 0.45, sy = H / 2 + s.y * H * 0.45;
      line(0, H, sx, sy); line(W, H, sx, sy);
    });
    S.rockets.forEach(r => {
      const sx = W / 2 + r.x * W * 0.45, sy = H / 2 + r.y * H * 0.45;
      const t = Math.min(1, r.t / 0.35);
      line(W / 2, H, W / 2 + (sx - W / 2) * t, H + (sy - H) * t);
    });
    S.sparks.forEach(s => {
      const d = s.t * 60 * s.v;
      line(s.x, s.y, s.x + Math.cos(s.a) * d, s.y + Math.sin(s.a) * d);
    });
    drawCockpit();
    drawHud();
    if (S.over) drawOver();
  }

  function drawOver() {
    ctx.globalAlpha = 0.85;
    ctx.fillStyle = '#000'; ctx.fillRect(W * 0.1, H * 0.12, W * 0.8, H * 0.76);
    ctx.globalAlpha = 1;
    ctx.strokeStyle = '#39ff7a'; ctx.fillStyle = '#39ff7a';
    ctx.strokeRect(W * 0.1, H * 0.12, W * 0.8, H * 0.76);
    ctx.textAlign = 'center';
    ctx.font = '22px monospace';
    ctx.fillText('GAME OVER', W / 2, H * 0.22);
    ctx.font = '16px monospace';
    ctx.fillText('SCORE ' + S.score, W / 2, H * 0.29);
    ctx.fillText('ENTER INITIALS  ' + (S.name + '___').slice(0, 3), W / 2, H * 0.37);
    ctx.font = '13px monospace';
    ctx.fillText(S.msg || 'A-Z, ENTER = SEND, ESC = QUIT', W / 2, H * 0.43);
    ctx.fillText('- TOP 10 -', W / 2, H * 0.52);
    S.top.slice(0, 10).forEach((e, i) => {
      ctx.textAlign = 'left';
      ctx.fillText(String(i + 1).padStart(2, ' ') + '. ' + e.name, W * 0.32, H * 0.58 + i * 17);
      ctx.textAlign = 'right';
      ctx.fillText(String(e.score), W * 0.68, H * 0.58 + i * 17);
    });
    ctx.textAlign = 'left';
  }

  function gameOver() {
    S.over = true;
    sweep(400, 50, 700);
    loadTop();
  }

  /* ---------------- Bestenliste ---------------- */
  function localTop() {
    try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch (e) { return []; }
  }
  function saveLocal(list) {
    try { localStorage.setItem(KEY, JSON.stringify(list.slice(0, 10))); } catch (e) {}
  }
  async function loadTop() {
    S.top = localTop();
    if (typeof api !== 'function' || typeof onlineAvailable === 'undefined' || !onlineAvailable) return;
    try {
      const r = await api('arcade_top');
      if (r && Array.isArray(r.scores)) S.top = r.scores;
    } catch (e) { /* offline: lokale Liste genügt */ }
  }
  async function sendScore() {
    const name = (S.name + 'AAA').slice(0, 3).toUpperCase();
    S.sent = true; S.msg = 'SENDING...';
    const list = localTop();
    list.push({ name: name, score: S.score });
    list.sort((a, b) => b.score - a.score);
    saveLocal(list);
    if (typeof api === 'function' && typeof onlineAvailable !== 'undefined' && onlineAvailable) {
      try {
        const r = await api('arcade_add', { name: name, score: S.score });
        if (r && Array.isArray(r.scores)) { S.top = r.scores; S.msg = 'SAVED'; return; }
      } catch (e) { S.msg = 'OFFLINE - SAVED LOCALLY'; }
    } else {
      S.msg = 'OFFLINE - SAVED LOCALLY';
    }
    S.top = localTop();
  }

  /* ---------------- Fenster ---------------- */
  function open() {
    if (running) return;
    box = document.createElement('div');
    box.id = 'arcadeModal';
    box.className = 'modal-overlay no-print';
    box.innerHTML =
      '<div class="arcade-box">' +
      '<div class="arcade-head"><span>TIE BREAKER</span>' +
      '<button class="mini" id="arcadeClose">✕</button></div>' +
      '<canvas id="arcadeCv" width="' + W + '" height="' + H + '"></canvas>' +
      '<div class="arcade-help">WASD = AIM &nbsp; SPACE = LASER &nbsp; ALT = MISSILE &nbsp; ESC = QUIT</div>' +
      '</div>';
    document.body.appendChild(box);
    cv = document.getElementById('arcadeCv');
    ctx = cv.getContext('2d');
    document.getElementById('arcadeClose').addEventListener('click', close);
    box.addEventListener('click', e => { if (e.target === box) close(); });
    document.addEventListener('keydown', onKeyDown, true);
    document.addEventListener('keyup', onKeyUp, true);
    reset(); loadTop();
    running = true;
    let last = performance.now();
    const loop = now => {
      if (!running) return;
      const dt = Math.min(0.05, (now - last) / 1000); last = now;
      if (!S.over) step(dt, now);
      draw();
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
  }
  function close() {
    running = false;
    cancelAnimationFrame(raf);
    document.removeEventListener('keydown', onKeyDown, true);
    document.removeEventListener('keyup', onKeyUp, true);
    if (box && box.parentNode) box.parentNode.removeChild(box);
    box = null;
  }

  function onKeyDown(e) {
    if (!running) return;
    if (e.key === 'Escape') { close(); e.preventDefault(); return; }
    if (S.over) {
      if (!S.sent) {
        if (/^[a-zA-Z]$/.test(e.key) && S.name.length < 3) S.name += e.key.toUpperCase();
        else if (e.key === 'Backspace') S.name = S.name.slice(0, -1);
        else if (e.key === 'Enter' && S.name.length > 0) sendScore();
      } else if (e.key === 'Enter') { reset(); }
      e.preventDefault();
      return;
    }
    const k = e.key.toLowerCase();
    if ('wasd'.indexOf(k) >= 0) S.keys[k] = 1;
    if (e.key === ' ') fireLaser();
    if (e.key === 'Alt' || e.altKey && e.key !== 'Alt') fireRocket();
    if ([' ', 'w', 'a', 's', 'd', 'Alt'].indexOf(e.key) >= 0 || 'wasd'.indexOf(k) >= 0) e.preventDefault();
  }
  function onKeyUp(e) {
    const k = e.key.toLowerCase();
    if ('wasd'.indexOf(k) >= 0) S.keys[k] = 0;
  }

  /* ---------------- Auslöser: Doppelklick auf „Optionen“ ------------- */
  document.addEventListener('DOMContentLoaded', () => {
    const title = document.querySelector('#optionsMenu .opt-title');
    if (!title) return;
    title.addEventListener('dblclick', e => {
      e.preventDefault();
      e.stopPropagation();
      const m = document.getElementById('optionsMenu');
      if (m) m.classList.add('hidden');
      open();
    });
  });
})();
