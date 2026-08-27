/* =====================================================================
   Star Wars D6 - the table-top (mini VTT)
   ---------------------------------------------------------------------
   A shared battle map for one game round: the GM puts maps up, everyone
   moves their own tokens, and rolls land in a log the whole table sees.

   Stands on its own, like dice.js: its own small i18n, no dependency on
   app.js or genshared.js. The sign-in comes from localStorage, which
   online.js wrote on one of the generator pages - same origin, same
   session, so there is nothing to log into twice.

   Deliberately NOT here: fog of war, line of sight, distance measuring.
   Those are what VTT projects founder on, and at a table where the GM
   says what you can see anyway they buy nothing.
   ===================================================================== */
(function () {
'use strict';


/* The map in a window of its own, for a second monitor.

   It is the SAME page with ?view=map - not a second renderer. Everything
   here already rebuilds itself from the server state, so a second window
   needs no messages passed between windows: it polls like any other
   participant and draws what it gets. Dragging tokens and painting fog
   work in it unchanged.

   What must NOT run twice is the music and the voice call - the track
   would play twice, slightly apart, and one would sit in one's own round
   a second time and hear oneself. */
const MAP_ONLY = new URLSearchParams(location.search).get('view') === 'map';

/* ---------------- translations ---------------- */
const T = {
  de: {
    subtitle: 'Spieltisch', options: 'Optionen', opt_language: 'Sprache / Language',
    opt_theme: 'Darstellung', theme_dark: 'Dunkel', theme_light: 'Hell',
    theme_oled: 'OLED-Schwarz', theme_bespin: 'Bespin',
    nav_char: 'Charaktere', nav_droid: 'Droiden', nav_ship: 'Schiffe / Fahrzeuge',
    nav_npc: 'NPCs', nav_dice: 'Würfeln', nav_vtt: 'Spieltisch',
    gate_title: 'Spieltisch',
    gate_nologin: 'Dafür musst du angemeldet sein – über den ☁-Knopf oben.',
    gate_noserver: 'Für den Spieltisch wird der Server gebraucht. Diese Installation läuft ohne API.',
    gate_norounds: 'Du bist in keiner Spielrunde. Über ☁ oben kannst du eine anlegen oder mit einem Einladungscode beitreten.',
    gm_title: 'Spielleitung', gm_map_pick: 'Karte', gm_grid: 'Raster (px, 0 = aus)',
    gm_dim: 'Dunkelheit',
    gm_dim_hint: 'Tag und Nacht auf derselben Karte. Verdunkelt die Szene für alle – auch schon erkundetes Gelände. Die Marken bleiben sichtbar. Nur die Spielleitung kann das stellen.',
    gm_upload: '＋ Karte hochladen', gm_delete: 'Karte löschen',
    gm_hint: 'Nur die Spielleitung kann Karten hochladen und umschalten. Große Bilder werden vor dem Hochladen verkleinert.',
    fog_title: 'Nebel', fog_off: 'Marken bewegen',
    fog_sight: 'Im Blick (Marken sichtbar)', fog_known: 'Erkundet (nur Gelände)',
    fog_dark: 'Unerkundet (schwarz)', fog_brush: 'Pinselgröße',
    fog_all_dark: 'Alles schwärzen', fog_all_open: 'Alles aufdecken',
    fog_hint: 'Eine neue Karte ist komplett schwarz. Male auf, wo die Gruppe hinkommt. Verlässt sie einen Raum, stell ihn auf „Erkundet“ – das Gelände bleibt, die Marken darin verschwinden für die Spieler.',
    fog_paint: 'Nebel malen – Marken lassen sich gerade nicht ziehen.',
    au_title: 'Musik', au_track: 'Stück', au_play: '▶ Abspielen', au_pause: '⏸ Pause',
    au_stop: '⏹ Aus', au_loop: 'Wiederholen', au_upload: '＋ MP3 hochladen',
    au_delete: 'Stück entfernen', au_yt: 'YouTube-Link', au_yt_add: '＋ YouTube übernehmen',
    au_volume: 'Lautstärke', au_enable: '🔊 Ton einschalten',
    au_none: 'Keine Musik.', au_playing: 'Läuft: ', au_paused: 'Pausiert: ',
    au_hint: 'Die Spielleitung bestimmt, was läuft; die Lautstärke stellt jeder für sich. Browser lassen Ton erst nach einem Klick zu – dafür ist der Knopf da.',
    au_yt_note: 'YouTube-Stücke spielt jeder Browser direkt bei YouTube ab. Der kleine Player muss sichtbar bleiben, das verlangen die YouTube-Bedingungen.',
    au_bad_yt: 'Das sieht nicht nach einem YouTube-Link aus.',
    au_big: 'Die Datei ist zu groß (Grenze 12 MB).',
    confirm_au_delete: 'Dieses Stück entfernen?',
    tok_title: 'Marken', tok_doc: 'Aus meinen Bögen', tok_color: 'Farbe',
    tok_portrait: 'Bild des Bogens als Marke verwenden',
    tok_add_doc: 'Marke setzen', tok_free_label: 'Freie Marke', tok_count: 'Anzahl',
    tok_add_free: 'Freie Marke setzen',
    tok_hint: 'Ziehen verschiebt eine Marke. Du bewegst deine eigenen; die Spielleitung bewegt alle. Doppelklick entfernt sie.',
    popout: 'Karte in eigenes Fenster',
    call_title: 'Sprache & Bild', call_join: '🎧 Beitreten', call_leave: 'Verlassen',
    call_mic_on: '🎤 Mikro an', call_mic_off: '🔇 Mikro aus',
    call_cam_on: '📷 Kamera an', call_cam_off: '📷 Kamera aus',
    call_you: 'Du', call_connecting: 'verbindet …', call_alone: 'Sonst ist noch niemand da.',
    call_nomic: 'Kein Zugriff auf Mikrofon oder Kamera. Der Browser fragt beim ersten Mal nach – wurde es abgelehnt, muss die Erlaubnis in den Seiteneinstellungen wieder erteilt werden.',
    call_insecure: 'Sprachchat braucht HTTPS. Über eine unverschlüsselte Verbindung gibt kein Browser das Mikrofon frei.',
    call_noturn: 'Ohne Relay-Server kommen Teilnehmer hinter strengen Routern nicht zusammen.',
    roll_sheet: 'Bogen', roll_what: 'Attribut / Fertigkeit',
    roll_free: '– freier Wurf –', roll_nosheet: '– kein Bogen –',
    roll_gear: 'Ausrüstung mit Würfel-Bonus:',
    roll_sum: 'Wurf: {pool} aus {from}',
    roll_title: 'Würfeln', dice: 'Würfel (D)', pips: 'Pips (+)', modifier: 'Modifikator',
    wild_die: 'Wild Die', roll: '🎲 Würfeln',
    log_title: 'Protokoll', log_empty: 'Noch nichts gewürfelt.',
    no_map: 'Noch keine Karte auf dem Tisch.',
    no_map_gm: 'Noch keine Karte. Lade rechts eine hoch.',
    stage_hint: 'Marken lassen sich mit der Maus oder dem Finger ziehen – wohin sie gezogen werden, dahin schauen sie. Auf der Stelle drehen: Umschalt halten und ziehen, oder lange gedrückt halten. Ein Umschalt-Klick ohne Drehen nimmt den Sichtkegel wieder weg.',
    st_live: 'verbunden', st_off: 'keine Verbindung', st_saving: 'speichert …',
    doc_none: '– kein Bogen –', complication: 'Komplikation!',
    confirm_map_delete: 'Diese Karte und alle Marken darauf löschen?',
    confirm_tok_delete: 'Diese Marke entfernen?',
    err_big: 'Das Bild ist selbst verkleinert noch zu groß.',
  },
  en: {
    subtitle: 'Table', options: 'Options', opt_language: 'Sprache / Language',
    opt_theme: 'Theme', theme_dark: 'Dark', theme_light: 'Light',
    theme_oled: 'OLED black', theme_bespin: 'Bespin',
    nav_char: 'Characters', nav_droid: 'Droids', nav_ship: 'Ships / Vehicles',
    nav_npc: 'NPCs', nav_dice: 'Dice', nav_vtt: 'Table',
    gate_title: 'Table',
    gate_nologin: 'You have to be signed in for this – use the ☁ button up top.',
    gate_noserver: 'The table needs the server. This installation runs without the API.',
    gate_norounds: 'You are not in a game round. Create one under ☁ up top, or join with an invite code.',
    gm_title: 'Game master', gm_map_pick: 'Map', gm_grid: 'Grid (px, 0 = off)',
    gm_dim: 'Darkness',
    gm_dim_hint: 'Day and night on the same map. Darkens the scene for everyone, explored ground included. The tokens stay visible. Only the GM can set this.',
    gm_upload: '＋ Upload map', gm_delete: 'Delete map',
    gm_hint: 'Only the GM can upload maps and switch between them. Large pictures are scaled down before upload.',
    fog_title: 'Fog', fog_off: 'Move tokens',
    fog_sight: 'In sight (tokens visible)', fog_known: 'Explored (terrain only)',
    fog_dark: 'Unexplored (black)', fog_brush: 'Brush size',
    fog_all_dark: 'Black out all', fog_all_open: 'Reveal all',
    fog_hint: 'A new map starts completely black. Paint open where the party goes. When they leave a room, set it to "Explored" - the terrain stays, the tokens in it disappear for the players.',
    fog_paint: 'Painting fog - tokens cannot be dragged right now.',
    au_title: 'Music', au_track: 'Track', au_play: '▶ Play', au_pause: '⏸ Pause',
    au_stop: '⏹ Off', au_loop: 'Repeat', au_upload: '＋ Upload MP3',
    au_delete: 'Remove track', au_yt: 'YouTube link', au_yt_add: '＋ Add YouTube',
    au_volume: 'Volume', au_enable: '🔊 Turn sound on',
    au_none: 'No music.', au_playing: 'Playing: ', au_paused: 'Paused: ',
    au_hint: 'The GM decides what plays; everyone sets their own volume. Browsers only allow sound after a click - that is what the button is for.',
    au_yt_note: 'YouTube tracks play from YouTube in each browser. The small player has to stay visible - YouTube’s terms require it.',
    au_bad_yt: 'That does not look like a YouTube link.',
    au_big: 'That file is too large (limit 12 MB).',
    confirm_au_delete: 'Remove this track?',
    tok_title: 'Tokens', tok_doc: 'From my sheets', tok_color: 'Colour',
    tok_portrait: 'Use the sheet’s picture as the token',
    tok_add_doc: 'Place token', tok_free_label: 'Free token', tok_count: 'Count',
    tok_add_free: 'Place free token',
    tok_hint: 'Drag to move a token. You move your own; the GM moves them all. Double-click removes one.',
    popout: 'Map in its own window',
    call_title: 'Voice & video', call_join: '🎧 Join', call_leave: 'Leave',
    call_mic_on: '🎤 Mic on', call_mic_off: '🔇 Mic off',
    call_cam_on: '📷 Camera on', call_cam_off: '📷 Camera off',
    call_you: 'You', call_connecting: 'connecting …', call_alone: 'Nobody else here yet.',
    call_nomic: 'No access to microphone or camera. The browser asks the first time - if it was refused, the permission has to be granted again in the site settings.',
    call_insecure: 'Voice chat needs HTTPS. No browser hands out the microphone over an unencrypted connection.',
    call_noturn: 'Without a relay server, people behind strict routers will not connect.',
    roll_sheet: 'Sheet', roll_what: 'Attribute / skill',
    roll_free: '– free roll –', roll_nosheet: '– no sheet –',
    roll_gear: 'Equipment with a dice bonus:',
    roll_sum: 'Rolling {pool} from {from}',
    roll_title: 'Roll', dice: 'Dice (D)', pips: 'Pips (+)', modifier: 'Modifier',
    wild_die: 'Wild Die', roll: '🎲 Roll',
    log_title: 'Log', log_empty: 'Nothing rolled yet.',
    no_map: 'No map on the table yet.',
    no_map_gm: 'No map yet. Upload one on the right.',
    stage_hint: 'Tokens can be dragged with the mouse or a finger - which way they went is which way they look. To turn one where it stands: hold shift and drag, or press and hold. A shift click without turning takes the cone off again.',
    st_live: 'connected', st_off: 'no connection', st_saving: 'saving …',
    doc_none: '– no sheet –', complication: 'Complication!',
    confirm_map_delete: 'Delete this map and every token on it?',
    confirm_tok_delete: 'Remove this token?',
    err_big: 'Even scaled down, that picture is too large.',
  },
};
const LS_LANG = 'swd6_lang';
let LANG = localStorage.getItem(LS_LANG) || 'en';
if (!T[LANG]) LANG = 'en';
function t(k) {
  const v = (T[LANG] && T[LANG][k]) || (T.en && T.en[k]);
  /* A missing key is shown as itself, stripped to harmless characters -
     the same guard as in app.js, genshared.js and dice.js. */
  return v !== undefined ? v : String(k).replace(/[^\w .:+\-\/()]/g, '');
}
function applyLang() {
  document.documentElement.lang = LANG;
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const s = t(el.getAttribute('data-i18n'));
    if (s) el.textContent = s;
  });
  document.querySelectorAll('input[name="langOpt"]').forEach(r => { r.checked = r.value === LANG; });
  /* Credits and the legal links come from their own files and are not
     covered by data-i18n - they have to be redrawn by hand, the same way
     genshared.js does it for the generator pages. */
  if (typeof renderLegal === 'function') renderLegal();
  if (typeof relangOnline === 'function') relangOnline();
  /* help.js reads the language off LANG; inside the IIFE it is invisible
     from outside, so the copy on window is kept in step. */
  window.LANG = LANG;
  const hm = document.getElementById('helpModal');
  if (hm && !hm.classList.contains('hidden') && typeof renderHelp === 'function') renderHelp();
  const am = document.getElementById('aboutModal');
  if (am && !am.classList.contains('hidden') && typeof renderAbout === 'function') renderAbout();
}

/* ---------------- helpers ---------------- */
const $ = id => document.getElementById(id);
function esc(s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g,
    c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}
/* credits.js and legal.js are shared with the generator pages and reach for
   the dictionary and these two helpers by their bare names. Everything in
   this file sits inside an IIFE, so hand exactly those three out - they are
   the whole surface this page shares, and nothing else leaks. */
window.T = T;
window.t = t;
window.esc = esc;
window.HELP_PAGE = 'vtt';
window.LANG = LANG;
function apiUrl() {
  return (typeof SITE_CONFIG !== 'undefined' && SITE_CONFIG.apiUrl) || '';
}
/* Pictures are handed out by the web server straight from api/vtt/, next
   to the API script - not through index.php. */
function assetUrl(rel) {
  /* The server builds these paths itself out of the content hash, so they
     always look like "vtt/<sha>.<ext>". Checking anyway costs nothing and
     means a made-up reply cannot turn a token picture into a link to
     somewhere else - "//evil.example/x.png" is a valid relative URL. */
  if (!/^vtt\/[0-9a-f]{64}\.(png|jpe?g|webp|mp3|ogg|m4a)$/i.test(String(rel || ''))) return '';
  const base = apiUrl();
  const dir = base ? base.replace(/[^\/]*$/, '') : 'api/';
  return dir + rel;
}

/* The session that online.js wrote on a generator page. Same origin, so
   the sign-in carries over and nobody logs in twice. */
const LS_ONLINE = 'swd6_online';
let SESSION = {};
try { SESSION = JSON.parse(localStorage.getItem(LS_ONLINE)) || {}; } catch (e) {}

let offline = false;
async function api(action, body) {
  const headers = { 'Content-Type': 'application/json' };
  if (SESSION.token) {
    headers['Authorization'] = 'Bearer ' + SESSION.token;
    headers['X-Auth-Token'] = SESSION.token;
  }
  const res = await fetch(apiUrl() + '?action=' + encodeURIComponent(action), {
    method: 'POST', headers, body: JSON.stringify(body || {}),
  });
  let data = null;
  try { data = JSON.parse(await res.text()); } catch (e) {}
  if (!res.ok || !data) throw new Error((data && data.error) || ('HTTP ' + res.status));
  return data;
}

/* ---------------- state ---------------- */
let rounds = [];
let roundId = 0;
let state = null;          // last vtt_state answer
let version = -1;
let myDocs = [];
let dragging = null;       // the token under the finger - polling must not move it
let pollTimer = 0;

/* ---------------- the map and its tokens ---------------- */
function activeMap() {
  if (!state) return null;
  return (state.maps || []).find(m => m.id === state.activeMap) || null;
}

function renderStage() {
  const map = activeMap();
  const img = $('mapImg'), grid = $('grid');
  const stage = $('stage');
  if (!map) {
    img.removeAttribute('src');
    img.classList.add('hidden');
    stage.classList.remove('has-map');
    grid.classList.add('hidden');
    $('tokens').innerHTML = '';
    $('mapName').textContent = '';
    $('stageHint').textContent = state && state.isGm ? t('no_map_gm') : t('no_map');
    return;
  }
  img.classList.remove('hidden');
  /* Give the stage the map's proportions. Without this it would either
     stretch to the full column height (pushing everything else off the
     screen) or shrink to the picture's pixel size instead of filling the
     space. --map-arn is the same ratio as a plain number, because calc()
     cannot divide inside an aspect-ratio value. */
  if (map.w > 0 && map.h > 0) {
    stage.style.setProperty('--map-ar', map.w + ' / ' + map.h);
    stage.style.setProperty('--map-arn', String(map.w / map.h));
    stage.classList.add('has-map');
  } else {
    stage.classList.remove('has-map');
  }
  const url = assetUrl(map.url);
  if (img.getAttribute('src') !== url) img.setAttribute('src', url);
  $('mapName').textContent = map.name || '';
  $('stageHint').textContent = t('stage_hint');
  /* The grid is given in pixels of the ORIGINAL map. On screen the map is
     scaled to fit, so the grid has to be scaled by the same factor or it
     would drift away from the picture. */
  if (map.grid > 0 && map.w > 0) {
    const step = (map.grid / map.w * 100) + '%';
    grid.style.backgroundSize = step + ' ' + (map.grid / (map.h || map.w) * 100) + '%';
    grid.classList.remove('hidden');
  } else {
    grid.classList.add('hidden');
  }
  renderFog();
  renderTokens();
}

/* ---------------- fog of war ----------------
   Drawn on a canvas over the map: black where the party has never been,
   a dark veil where they have been but are not now, nothing where they
   are looking. The canvas carries the mask at cell resolution and is
   stretched by CSS, so redrawing costs nothing worth measuring even while
   a brush is being dragged across it. */
function renderFog() {
  const cv = $('fog');
  const map = activeMap();
  if (!map || !map.fog || !map.fogCols) { cv.classList.add('hidden'); return; }
  const cols = map.fogCols, rows = map.fogRows, fog = map.fog;
  cv.classList.remove('hidden');
  if (cv.width !== cols || cv.height !== rows) { cv.width = cols; cv.height = rows; }
  const ctx = cv.getContext('2d');
  ctx.clearRect(0, 0, cols, rows);
  for (let i = 0; i < fog.length; i++) {
    const c = fog[i];
    if (c === '2') continue;
    /* The GM has to be able to work, so for them the black is only a
       strong tint - they see the map underneath and know what they are
       revealing. For players it is opaque. */
    ctx.fillStyle = c === '0'
      ? (state && state.isGm ? 'rgba(0,0,0,.80)' : '#000')
      : 'rgba(0,0,0,.55)';
    ctx.fillRect(i % cols, Math.floor(i / cols), 1, 1);
  }
}

/* Which cells does a brush stroke at this spot cover? */
function fogCellsAt(fx, fy, map, radius) {
  const cols = map.fogCols, rows = map.fogRows;
  const cx = Math.floor(fx * cols), cy = Math.floor(fy * rows);
  const out = [];
  const r = Math.max(1, radius) - 1;
  for (let y = cy - r; y <= cy + r; y++) {
    for (let x = cx - r; x <= cx + r; x++) {
      if (x < 0 || y < 0 || x >= cols || y >= rows) continue;
      /* round brush - a square one paints corners the GM did not mean */
      if ((x - cx) * (x - cx) + (y - cy) * (y - cy) > r * r + r) continue;
      out.push(y * cols + x);
    }
  }
  return out;
}

function fogMode() {
  const el = document.querySelector('input[name="fogMode"]:checked');
  return el ? el.value : 'off';
}

let fogQueue = new Set();
let fogFlushTimer = 0;
let fogLast = null;        // where the brush was on the previous move
/* A stroke touches dozens of cells; they are collected and sent in one
   call every 250 ms instead of one request per cell. */
function fogPaint(fx, fy) {
  const map = activeMap();
  const mode = fogMode();
  if (!map || mode === 'off' || !map.fogCols) return;
  const brush = +$('fogBrush').value || 3;

  /* pointermove does not fire for every pixel: drag quickly and the
     positions arrive far apart. Dabbing a circle at each one leaves a
     dotted line with holes between the dabs - and a hole in the fog is a
     hole the players can see through. So the gap to the previous point is
     filled in, step by step, at half a brush width. */
  const pts = [];
  if (fogLast) {
    const dx = fx - fogLast.x, dy = fy - fogLast.y;
    const stepX = Math.max(1, brush / 2) / map.fogCols;
    const stepY = Math.max(1, brush / 2) / map.fogRows;
    const steps = Math.ceil(Math.max(Math.abs(dx) / stepX, Math.abs(dy) / stepY));
    for (let s = 1; s < steps; s++) {
      pts.push({ x: fogLast.x + dx * (s / steps), y: fogLast.y + dy * (s / steps) });
    }
  }
  pts.push({ x: fx, y: fy });
  fogLast = { x: fx, y: fy };

  let changed = false;
  const arr = map.fog.split('');
  pts.forEach(p => fogCellsAt(p.x, p.y, map, brush).forEach(i => {
    if (arr[i] !== mode) { arr[i] = mode; changed = true; }
    fogQueue.add(i);
  }));
  if (!changed) return;
  map.fog = arr.join('');
  renderFog();
  if (!fogFlushTimer) fogFlushTimer = setTimeout(flushFog, 250);
}
async function setWholeFog(stateChar) {
  const map = activeMap();
  if (!map) return;
  try {
    await api('map_fog', { round: roundId, map: map.id, state: stateChar, all: 1 });
    await refresh(true);
  } catch (e) { alert(e.message); }
}
async function flushFog() {
  fogFlushTimer = 0;
  const map = activeMap();
  const cells = [...fogQueue];
  fogQueue.clear();
  if (!map || !cells.length) return;
  try {
    await api('map_fog', { round: roundId, map: map.id, state: fogMode(), cells });
    await refresh(true);
  } catch (e) { setStatus(false, e.message); }
}

function tokenInitials(tok) {
  const s = (tok.label || '').trim();
  if (!s) return '?';
  const parts = s.split(/\s+/);
  return (parts.length > 1 ? parts[0][0] + parts[1][0] : s.slice(0, 2)).toUpperCase();
}

function mayMove(tok) {
  return !!state && (state.isGm || tok.ownerId === SESSION.userId || tok.owner === SESSION.user);
}

function renderTokens() {
  const box = $('tokens');
  const list = (state && state.tokens) || [];
  box.innerHTML = list.map(tok => {
    /* The field of view sits in a layer of its own BEHIND the figure, not
       inside it: the token clips its contents (that is what keeps a round
       portrait round), and rotating the token itself would stand the
       picture on its head. */
    const kegel = (tok.facing >= 0 && tok.facing < 360)
      ? '<div class="vtt-facing" style="left:' + (tok.x * 100) + '%;top:' + (tok.y * 100) + '%;'
        + '--tok-size:' + (tok.size || 1) + ';transform:translate(-50%,-50%) rotate('
        + tok.facing + 'deg);'
        + (tok.color ? 'background:' + esc(tok.color) + ';' : '') + '"'
        + ' data-facing-for="' + tok.id + '"></div>'
      : '';
    const cls = 'vtt-token kind-' + esc(tok.kind || 'npc') + (mayMove(tok) ? ' mine' : '');
    const style = 'left:' + (tok.x * 100) + '%;top:' + (tok.y * 100) + '%;'
                + '--tok-size:' + (tok.size || 1) + ';'
                + (tok.color ? 'border-color:' + esc(tok.color) + ';background:' + esc(tok.color) + ';' : '');
    const inner = tok.url
      ? '<img src="' + esc(assetUrl(tok.url)) + '" alt="">'
      : '<span>' + esc(tokenInitials(tok)) + '</span>';
    return kegel + '<div class="' + cls + '" style="' + style + '" data-id="' + tok.id + '" '
         + 'title="' + esc(tok.label || '') + (tok.owner ? ' – ' + esc(tok.owner) : '') + '">'
         + inner + '</div>';
  }).join('');
}

/* 0 = broad daylight, 100 = pitch black. Not quite black even then: at
   full strength a little of the ground still shows through, so the GM can
   still tell where the walls are. */
function zeigeDunkelheit(prozent) {
  const el = $('night');
  if (!el) return;
  const p = Math.max(0, Math.min(100, +prozent || 0));
  el.style.opacity = String(p / 100 * 0.92);
}

function renderMapList() {
  const sel = $('mapSel');
  const maps = (state && state.maps) || [];
  sel.innerHTML = maps.map(m =>
    '<option value="' + m.id + '"' + (m.id === state.activeMap ? ' selected' : '') + '>'
    + esc(m.name || ('#' + m.id)) + '</option>').join('');
  const isGm = !!(state && state.isGm);
  $('gmCard').classList.toggle('hidden', !isGm);
  $('fogCard').classList.toggle('hidden', !isGm);
  const map = activeMap();
  $('gridSize').value = map ? (map.grid || 0) : 0;
  const dunkel = map ? (map.dim || 0) : 0;
  /* Do not overwrite the slider while it is being dragged - the answer to
     the previous step would jump it back under the finger. */
  const rg = $('dimRange');
  if (rg && document.activeElement !== rg) rg.value = String(dunkel);
  if ($('dimVal')) $('dimVal').textContent = dunkel + ' %';
  zeigeDunkelheit(dunkel);
}

/* ---------------- rolls on the map ----------------
   A roll that only appears as a line of text in a side panel gets missed.
   So every new roll is thrown onto the map for a few seconds, with the
   individual dice and the total, for everyone at the table.

   Only entries newer than the highest one already seen are shown - without
   that, opening the page would replay the last fifty rolls at once, and
   every poll would show them again. */
let lastRollShown = 0;

function dieFace(v, kind) {
  return '<span class="vtt-die' + (kind ? ' ' + kind : '') + '">' + v + '</span>';
}

function showRoll(entry) {
  let d = null;
  try { d = JSON.parse(entry.data || 'null'); } catch (e) {}
  const stage = $('stage');
  const el = document.createElement('div');
  el.className = 'vtt-roll';

  let dice = '';
  if (d && Array.isArray(d.regs)) {
    dice = d.regs.map(v => dieFace(v)).join('');
    if (d.wild != null) {
      /* The Wild Die is the one that matters: a 6 keeps going, a 1 is a
         complication. It gets its own colour so nobody has to count. */
      dice += dieFace(d.wild, d.wild === 1 ? 'bad' : (d.wild >= 6 ? 'good' : 'wild'));
      /* The follow-up dice of an exploding wild die belong to it, so they
         carry its accent - not green. Green means "this die exploded", and
         a green 1 next to the red 1 of a complication reads as nonsense. */
      (d.extra || []).forEach(v => { dice += dieFace(v, 'wild'); });
    }
    if (d.pips) dice += '<span class="vtt-die flat">+' + d.pips + '</span>';
    if (d.mod) dice += '<span class="vtt-die flat">' + (d.mod > 0 ? '+' : '') + d.mod + '</span>';
  }

  el.innerHTML =
      '<div class="vtt-roll-who">' + esc(entry.who || '?')
    + (d && d.label ? ' · ' + esc(d.label) : '') + '</div>'
    + (dice ? '<div class="vtt-roll-dice">' + dice + '</div>' : '')
    + '<div class="vtt-roll-total">' + esc(d ? String(d.total) : entry.text) + '</div>'
    + (d && d.complication ? '<div class="vtt-roll-comp">' + esc(t('complication')) + '</div>' : '');

  /* Scatter them a little so several rolls in quick succession do not land
     exactly on top of each other. */
  el.style.left = (34 + Math.random() * 32) + '%';
  el.style.top = (26 + Math.random() * 30) + '%';
  stage.appendChild(el);
  setTimeout(() => el.classList.add('fade'), 5200);
  setTimeout(() => el.remove(), 6400);
}

function showNewRolls() {
  const log = (state && state.log) || [];
  const newest = log.length ? log[log.length - 1].id : 0;
  if (!lastRollShown) { lastRollShown = newest; return; }   // first load: no replay
  log.filter(l => l.id > lastRollShown && l.kind === 'roll').forEach(showRoll);
  if (newest > lastRollShown) lastRollShown = newest;
}

function renderLog() {
  const box = $('log');
  const log = (state && state.log) || [];
  if (!log.length) { box.innerHTML = '<p class="hint">' + esc(t('log_empty')) + '</p>'; return; }
  box.innerHTML = log.map(l =>
    '<div class="vtt-log-row"><b>' + esc(l.who || '?') + '</b> ' + esc(l.text) + '</div>').join('');
  box.scrollTop = box.scrollHeight;
}

/* ---------------- background music ----------------
   The GM is the clock. The server keeps the position the GM was at and the
   moment that reading was taken; every client adds the time since then and
   knows where the track has to be. Nothing is pushed continuously, and a
   player who joins in the middle lands in the right place.

   The clock difference between the browser and the server is taken out
   with the "now" the answer carries - otherwise a machine whose clock is
   two minutes off would seek two minutes into the track. */
let audioUnlocked = false;
let audioStallTicks = 0;   // consecutive ticks with playback requested but no progress
let audioLastPos = -1;     // where the track stood on the previous tick
let ytPlayer = null, ytReady = false, ytWanted = null;
let ytLoadedList = '';     // which playlist the embedded player already holds

function audioTrack() {
  if (!state || !state.audioState) return null;
  return (state.audio || []).find(a => a.id === state.audioState.id) || null;
}
/* Where should the track be right now, in seconds? */
function audioWantedPos() {
  const s = state.audioState;
  if (!s.play) return s.pos;
  const serverNow = s.now + (Date.now() - (state._fetchedAt || Date.now())) / 1000;
  return s.pos + Math.max(0, serverNow - s.at);
}

function renderAudio() {
  if (MAP_ONLY) return;
  const gm = !!(state && state.isGm);
  $('auGm').classList.toggle('hidden', !gm);
  const track = audioTrack();
  const st = state && state.audioState;

  const sel = $('auSel');
  const list = (state && state.audio) || [];
  const keep = sel.value;
  sel.innerHTML = list.map(a =>
    '<option value="' + a.id + '">' + esc(a.name) + (a.kind === 'yt' ? ' (YouTube)' : '') + '</option>').join('');
  if (list.some(a => String(a.id) === keep)) sel.value = keep;
  else if (track) sel.value = String(track.id);

  $('auNow').textContent = !track ? t('au_none')
    : (st.play ? t('au_playing') : t('au_paused')) + track.name;
  $('auLoop').checked = !!(st && st.loop);

  syncAudio();
}

/* Bring the local players in line with what the server says. */
function syncAudio() {
  if (MAP_ONLY) return;
  const track = audioTrack();
  const st = state && state.audioState;
  const el = $('auEl');
  const ytBox = $('auYtBox');
  const vol = (+$('auVol').value || 0) / 100;

  if (!track || !st.play) {
    el.pause();
    if (ytPlayer && ytReady) { try { ytPlayer.pauseVideo(); } catch (e) {} }
    /* Move to the paused position as well, not just stop. Someone who
       opens the table while the music is paused would otherwise sit
       wherever their own player happened to be, and would hear the wrong
       few seconds the moment the GM presses play again. */
    if (track && track.kind !== 'yt' && el.readyState > 0
        && Math.abs(el.currentTime - st.pos) > 1) {
      try { el.currentTime = st.pos; } catch (e) {}
    }
    if (!track) { ytBox.classList.add('hidden'); ytWanted = null; }
    $('btnAuEnable').classList.add('hidden');
    return;
  }

  if (track.kind === 'yt') {
    el.pause();
    ytBox.classList.remove('hidden');
    ensureYt(track, audioWantedPos(), vol);
    return;
  }

  ytBox.classList.add('hidden');
  if (ytPlayer && ytReady) { try { ytPlayer.pauseVideo(); } catch (e) {} }
  const url = assetUrl(track.url);
  if (el.getAttribute('src') !== url) {
    el.setAttribute('src', url);
    el.load();
    audioStallTicks = 0;      // a new track deserves a fresh chance to seek
  }
  el.loop = !!st.loop;
  el.volume = vol;
  const want = audioWantedPos();
  /* Only correct a real drift. Seeking on every poll would make the track
     stutter every second and a half.

     On a looping track the distance has to be measured around the circle:
     5.9 s and 0.1 s of a six second loop are two tenths apart musically,
     but a plain subtraction calls it 5.8 and seeks - every poll, forever.
     That is audible as a stutter right at the loop point. */
  /* Jumping into the middle of a track needs the server to answer byte
     range requests. Apache does; PHP's built-in server does not, and
     neither does every cheap web space. Where it is missing the browser
     stalls after a seek and plays nothing at all - silence is worse than
     starting in the wrong place, so after a few stalled ticks the sync
     gives up on this track and simply lets it run. */
  if (audioStallTicks > 3) {
    if (el.paused) { const q = el.play(); if (q && q.catch) q.catch(() => {}); }
    return;
  }
  /* The telling symptom is not the readyState - that flickers between "has
     data" and "has only metadata" while a failing seek retries. It is that
     the position does not move although playback was asked for. */
  if (!el.paused && Math.abs(el.currentTime - audioLastPos) < 0.05) audioStallTicks++;
  else audioStallTicks = 0;
  audioLastPos = el.currentTime;

  /* Never seek while the element is still fetching or already seeking.
     Doing it anyway builds a loop that feeds itself: the seek restarts
     buffering, 1.5 s later the position still reads zero, so it seeks
     again - and the track never plays a single note. Wait until there is
     data to play, then correct once. */
  if (isFinite(el.duration) && el.duration > 0 && el.readyState >= 2 && !el.seeking) {
    const d = el.duration;
    const target = st.loop ? ((want % d) + d) % d : Math.min(want, d);
    let off = Math.abs(el.currentTime - target);
    if (st.loop) off = Math.min(off, d - off);
    if (off > 2) el.currentTime = target;
  }
  const p = el.play();
  if (p && p.catch) p.catch(() => {
    /* Browsers refuse sound until the page has been clicked. That is not
       an error to shout about - it just needs one button press. */
    audioUnlocked = false;
    $('btnAuEnable').classList.remove('hidden');
  });
}

/* The YouTube half. The iframe API is loaded only when a YouTube track is
   actually used - nobody who never plays one talks to youtube.com. */
function ensureYt(track, pos, vol) {
  ytWanted = { id: track.yt, list: track.ytList || '', pos, vol,
               index: (state.audioState && state.audioState.index) || 0 };
  if (!window.YT || !window.YT.Player) {
    if (!document.getElementById('ytApi')) {
      const s = document.createElement('script');
      s.id = 'ytApi';
      s.src = 'https://www.youtube.com/iframe_api';
      document.head.appendChild(s);
      window.onYouTubeIframeAPIReady = () => { ytReady = false; buildYt(); };
    }
    return;
  }
  if (!ytPlayer) { buildYt(); return; }
  if (!ytReady) return;
  applyYt();
}
function buildYt() {
  const box = $('auYtBox');
  box.innerHTML = '<div id="ytHost"></div>';
  ytPlayer = new YT.Player('ytHost', {
    height: '200', width: '200',
    videoId: ytWanted ? ytWanted.id : '',
    playerVars: { playsinline: 1, rel: 0 },
    events: {
      onReady: () => { ytReady = true; applyYt(); },
      onStateChange: e => {
        /* Autoplay refused: same story as with the audio element. */
        if (e.data === YT.PlayerState.UNSTARTED) $('btnAuEnable').classList.remove('hidden');
      },
    },
  });
}
function applyYt() {
  if (!ytPlayer || !ytReady || !ytWanted) return;
  try {
    if (ytWanted.list) {
      /* A playlist is loaded once and then left alone. loadPlaylist starts
         it over from the given entry, so calling it on every tick would
         restart the same track forever - hence the check on which list is
         already running. */
      const running = (ytLoadedList === ytWanted.list);
      if (!running) {
        ytLoadedList = ytWanted.list;
        ytPlayer.loadPlaylist({ list: ytWanted.list, listType: 'playlist',
                                index: ytWanted.index, startSeconds: ytWanted.pos });
      } else if (typeof ytPlayer.getPlaylistIndex === 'function'
                 && ytPlayer.getPlaylistIndex() !== ytWanted.index) {
        /* The GM moved on to another entry - follow, but do not fight the
           player while it is switching by itself. */
        ytPlayer.playVideoAt(ytWanted.index);
      } else if (Math.abs((ytPlayer.getCurrentTime() || 0) - ytWanted.pos) > 5) {
        ytPlayer.seekTo(ytWanted.pos, true);
      }
    } else {
      ytLoadedList = '';
      const cur = ytPlayer.getVideoData && ytPlayer.getVideoData().video_id;
      if (cur !== ytWanted.id) ytPlayer.loadVideoById(ytWanted.id, ytWanted.pos);
      else if (Math.abs((ytPlayer.getCurrentTime() || 0) - ytWanted.pos) > 3) {
        ytPlayer.seekTo(ytWanted.pos, true);
      }
    }
    ytPlayer.setVolume(Math.round(ytWanted.vol * 100));
    ytPlayer.playVideo();
  } catch (e) {}
}

/* The GM's player is the clock for a playlist: it walks through the entries
   by itself, and nobody else can know where it got to. So it reports the
   entry and the time - on every change, and otherwise now and then, which
   is enough to catch a latecomer up. */
let ytReportAt = 0;
function ytReportIfGm() {
  if (!state || !state.isGm || !ytPlayer || !ytReady || !ytWanted || !ytWanted.list) return;
  let idx, pos;
  try {
    idx = ytPlayer.getPlaylistIndex();
    pos = ytPlayer.getCurrentTime() || 0;
  } catch (e) { return; }
  if (typeof idx !== 'number' || idx < 0) return;
  const moved = idx !== (state.audioState.index || 0);
  const stale = Date.now() - ytReportAt > 15000;
  if (!moved && !stale) return;
  ytReportAt = Date.now();
  api('audio_control', { round: roundId, track: state.audioState.id,
                         play: 1, pos, index: idx, loop: state.audioState.loop })
    .then(() => { if (moved) refresh(true); })
    .catch(() => {});
}

function renderAll() {
  renderStage();
  renderMapList();
  renderLog();
  showNewRolls();
  renderAudio();
}

/* ---------------- talking to the server ----------------
   While nothing happens only vtt_poll runs: it answers with a single
   number. The whole table is fetched again only once that number moves. */
async function refresh(force) {
  if (!roundId) return;
  try {
    if (!force) {
      const p = await api('vtt_poll', { round: roundId });
      if (p.v === version) { setStatus(true); return; }
    }
    const s = await api('vtt_state', { round: roundId });
    version = s.v;
    /* Do not yank a token out from under a finger that is dragging it. */
    if (dragging && state) {
      const keep = (state.tokens || []).find(x => x.id === dragging.id);
      const fresh = (s.tokens || []).find(x => x.id === dragging.id);
      if (keep && fresh) { fresh.x = keep.x; fresh.y = keep.y; }
    }
    /* When the answer arrived, measured on the browser's own clock - the
       music sync works out the server time from this and never trusts the
       machine's wall clock. */
    s._fetchedAt = Date.now();
    state = s;
    renderAll();
    setStatus(true);
  } catch (e) {
    setStatus(false, e.message);
  }
}

function setStatus(ok, msg) {
  offline = !ok;
  const el = $('vttStatus');
  el.textContent = ok ? t('st_live') : (t('st_off') + (msg ? ' – ' + msg : ''));
  el.classList.toggle('neg', !ok);
}

function startPolling() {
  if (pollTimer) clearInterval(pollTimer);
  /* A second and a half is fast enough that a moved token feels immediate,
     and slow enough that a group of six costs four requests a second - all
     of them a single indexed read. Hidden tabs stop asking entirely. */
  pollTimer = setInterval(() => {
    if (document.hidden || !roundId) return;
    refresh(false);
    /* The music has to be checked on every tick, not only when the table
       changes. refresh() stops at the version number when nothing has
       happened - and on a quiet round nothing does, so a player who
       started late would stay minutes out of step for the whole session.
       This costs nothing: it only compares two local numbers. */
    if (state) { syncAudio(); ytReportIfGm(); }
  }, 1500);
  document.addEventListener('visibilitychange', () => { if (!document.hidden) refresh(false); });
}

/* ---------------- dragging ----------------
   Positions are a fraction of the map, so they survive any zoom or screen
   size. During the drag the token follows locally and the server hears
   about it at most every 200 ms; the final position always goes out. */
let sendPending = 0;
function stageFraction(ev) {
  const r = $('stage').getBoundingClientRect();
  return {
    x: Math.max(0, Math.min(1, (ev.clientX - r.left) / (r.width || 1))),
    y: Math.max(0, Math.min(1, (ev.clientY - r.top) / (r.height || 1))),
  };
}
let painting = false;
let drehen = null;          // figure being turned on the spot (shift)
let drehStart = null;       // where the pointer went down - a click that does not move clears it
let drehLetzt = null;       // and where it is now: the two together say whether it was turned
let drehTimer = 0;          // long press starts turning without a shift key
function wireDragging() {
  const stage = $('stage');
  stage.addEventListener('pointerdown', ev => {
    /* While a fog brush is selected the stage belongs to the brush, not to
       the tokens - otherwise every stroke that starts on a figure would
       drag it across the map instead of painting. */
    if (fogMode() !== 'off' && state && state.isGm) {
      painting = true;
      /* Capturing is a convenience, not a requirement: it keeps the stroke
         alive when the cursor leaves the stage. If the browser refuses the
         pointer it must not tear the rest of the handler down with it -
         without the guard the first dab of every stroke went missing. */
      try { stage.setPointerCapture(ev.pointerId); } catch (e) {}
      /* A stroke starts fresh - without this the line would be drawn from
         wherever the previous stroke happened to end, straight across the
         map. */
      fogLast = null;
      const p = stageFraction(ev);
      fogPaint(p.x, p.y);
      ev.preventDefault();
      return;
    }
    const el = ev.target.closest('.vtt-token');
    if (!el) return;
    const id = +el.getAttribute('data-id');
    const tok = (state.tokens || []).find(x => x.id === id);
    if (!tok || !mayMove(tok)) return;
    /* Shift turns the figure where it stands. Without it the drag decides
       the facing, which is how you move a miniature: you push it, and it
       ends up looking the way it went. */
    if (ev.shiftKey) {
      drehen = tok;
      drehStart = stageFraction(ev);
      try { el.setPointerCapture(ev.pointerId); } catch (e) {}
      el.classList.add('drag');
      ev.preventDefault();
      return;
    }
    dragging = tok;
    dragging._von = { x: tok.x, y: tok.y };
    try { el.setPointerCapture(ev.pointerId); } catch (e) {}
    el.classList.add('drag');
    /* A phone has no shift key. Holding the figure for half a second
       switches to turning, so a player on a tablet can set the facing of a
       piece that is not going anywhere. The timer is cancelled by the first
       real movement - dragging must not turn into turning under your
       finger. */
    if (drehTimer) clearTimeout(drehTimer);
    drehTimer = setTimeout(() => {
      drehTimer = 0;
      if (!dragging) return;
      const t2 = dragging;
      dragging = null;
      drehen = t2;
      drehStart = drehLetzt = { x: t2.x, y: t2.y };
      el.classList.add('turning');
    }, 500);
    ev.preventDefault();
  });
  stage.addEventListener('pointermove', ev => {
    /* If no button is held any more, the pointerup went missing - the
       pointer left the window, the capture was lost, another element
       swallowed it. Without this the brush stays stuck down and paints
       along with every later mouse movement; the same goes for a token,
       which would then follow the cursor around the map. buttons === 0
       is the honest answer to "is anything actually being pressed". */
    if ((painting || dragging || drehen) && ev.buttons === 0) { end(); return; }
    if (painting) { const p = stageFraction(ev); fogPaint(p.x, p.y); return; }
    if (drehen) {
      const p = stageFraction(ev);
      drehLetzt = p;
      setzeKegel(drehen, winkelZu(drehen, p));
      const jetzt = Date.now();
      if (jetzt - sendPending > 200) { sendPending = jetzt; pushMove(drehen); }
      return;
    }
    if (!dragging) return;
    const p = stageFraction(ev);
    /* Moved for real - this is a drag, not a long press. */
    if (drehTimer && (Math.abs(p.x - dragging.x) > 0.01 || Math.abs(p.y - dragging.y) > 0.01)) {
      clearTimeout(drehTimer); drehTimer = 0;
    }
    dragging.x = p.x; dragging.y = p.y;
    const el = stage.querySelector('.vtt-token[data-id="' + dragging.id + '"]');
    if (el) { el.style.left = (p.x * 100) + '%'; el.style.top = (p.y * 100) + '%'; }
    const now = Date.now();
    if (now - sendPending > 200) { sendPending = now; pushMove(dragging); }
  });
  const end = () => {
    if (painting) {
      painting = false;
      fogLast = null;
      if (fogFlushTimer) { clearTimeout(fogFlushTimer); fogFlushTimer = 0; }
      flushFog();
      return;
    }
    if (drehTimer) { clearTimeout(drehTimer); drehTimer = 0; }
    stage.querySelectorAll('.vtt-token.turning').forEach(e => e.classList.remove('turning'));
    if (drehen) {
      const tok = drehen;
      drehen = null;
      stage.querySelectorAll('.vtt-token.drag').forEach(e => e.classList.remove('drag'));
      /* Shift pressed and let go without turning: the cone comes off. That
         is the way back for a figure that should not be looking anywhere
         in particular. */
      /* Compare where the pointer went DOWN with where it ended up - not
         with the figure, which never moves while turning and would make
         every turn look like a click. */
      if (drehStart && (!drehLetzt || (Math.abs(drehStart.x - drehLetzt.x) < 0.012
                                    && Math.abs(drehStart.y - drehLetzt.y) < 0.012))) {
        tok.facing = -1;
        renderTokens();
      }
      drehStart = drehLetzt = null;
      pushMove(tok, true);
      return;
    }
    if (!dragging) return;
    const tok = dragging;
    dragging = null;
    stage.querySelectorAll('.vtt-token.drag').forEach(e => e.classList.remove('drag'));
    /* A move of any length points the figure the way it went. Below that a
       nudge would spin it around for no reason. */
    const von = tok._von;
    if (von) {
      const weg = Math.hypot(tok.x - von.x, tok.y - von.y);
      if (weg > 0.02) tok.facing = winkelZu({ x: von.x, y: von.y }, { x: tok.x, y: tok.y });
      delete tok._von;
    }
    pushMove(tok, true);
  };
  stage.addEventListener('pointerup', end);
  stage.addEventListener('pointercancel', end);

  stage.addEventListener('dblclick', async ev => {
    const el = ev.target.closest('.vtt-token');
    if (!el) return;
    const id = +el.getAttribute('data-id');
    const tok = (state.tokens || []).find(x => x.id === id);
    if (!tok || !mayMove(tok)) return;
    if (!confirm(t('confirm_tok_delete'))) return;
    try { await api('token_delete', { round: roundId, token: id }); await refresh(true); }
    catch (e) { alert(e.message); }
  });
}
async function pushMove(tok, final) {
  try {
    const daten = { round: roundId, token: tok.id, x: tok.x, y: tok.y };
    /* Only send the facing when this figure has one - otherwise every move
       of an unturned marker would write a -1 that was never asked for. */
    if (tok.facing !== undefined && tok.facing !== null) daten.facing = tok.facing;
    await api('token_move', daten);
    if (final) await refresh(true);
  } catch (e) { setStatus(false, e.message); }
}

/* ---------------- facing ----------------
   Which way a figure looks is worth as much at the table as where it
   stands. It is set the way you would turn a miniature: dragging points it
   the way it went, and holding shift turns it on the spot without moving
   it. A shift click that does not move takes the cone away again.

   The angle counts from "up", clockwise, which is what CSS rotate() wants -
   no conversion anywhere. */
function winkelZu(tok, p) {
  const dx = p.x - tok.x, dy = p.y - tok.y;
  const grad = Math.atan2(dx, -dy) * 180 / Math.PI;
  return (grad + 360) % 360;
}
function setzeKegel(tok, grad) {
  tok.facing = grad;
  const el = $('stage').querySelector('.vtt-facing[data-facing-for="' + tok.id + '"]');
  if (el) {
    el.style.transform = 'translate(-50%,-50%) rotate(' + grad + 'deg)';
    el.style.left = (tok.x * 100) + '%';
    el.style.top = (tok.y * 100) + '%';
  } else {
    renderTokens();
  }
}

/* ---------------- maps ---------------- */
/* The server takes up to 6 MB, but a photo straight from a phone is bigger
   than any table needs. Scaled to 2000 px it still looks sharp on a beamer
   and is a fraction of the traffic. */
function shrinkMap(file, cb) {
  if (!file || !file.type || !file.type.startsWith('image/')) { cb(''); return; }
  const rd = new FileReader();
  rd.onload = () => {
    const img = new Image();
    img.onload = () => {
      const max = 2000, scale = Math.min(1, max / img.width, max / img.height);
      const w = Math.max(1, Math.round(img.width * scale));
      const h = Math.max(1, Math.round(img.height * scale));
      const cv = document.createElement('canvas'); cv.width = w; cv.height = h;
      cv.getContext('2d').drawImage(img, 0, 0, w, h);
      let q = 0.9, out = cv.toDataURL('image/jpeg', q);
      while (out.length > 5000000 && q > 0.3) { q -= 0.1; out = cv.toDataURL('image/jpeg', q); }
      cb(out.length > 5000000 ? '' : out);
    };
    img.onerror = () => cb('');
    img.src = rd.result;
  };
  rd.readAsDataURL(file);
}

/* ---------------- tokens from a sheet ----------------
   The picture is scaled down here, once, and travels as a small thumbnail.
   Sending the whole document would mean up to half a megabyte of character
   sheet to paint a disc forty pixels wide. */
function portraitToken(dataUri, cb) {
  if (!dataUri) { cb(''); return; }
  const img = new Image();
  img.onload = () => {
    const S = 128;
    const cv = document.createElement('canvas'); cv.width = cv.height = S;
    const ctx = cv.getContext('2d');
    /* Crop square from the middle - a portrait is usually taller than wide,
       and a squashed face makes a poor token. */
    const side = Math.min(img.width, img.height);
    ctx.drawImage(img, (img.width - side) / 2, (img.height - side) / 2, side, side, 0, 0, S, S);
    cb(cv.toDataURL('image/jpeg', 0.85));
  };
  img.onerror = () => cb('');
  img.src = dataUri;
}

/* Only what may actually go on the table: my own documents entered in THIS
   round AND approved by the GM. Listing everything would offer sheets the
   server then refuses with a 403 - the player would pick one and get an
   error instead of a token. round_my_chars answers all of that in one
   request, with the kind, so the default token gets the right outline. */
async function loadMyDocs() {
  const sel = $('tokDoc');
  try {
    const r = await api('round_my_chars', { id: roundId });
    myDocs = (r.chars || []).filter(d => d.approved);
  } catch (e) { myDocs = []; }
  sel.innerHTML = '<option value="">' + esc(t('doc_none')) + '</option>'
    + myDocs.map(d => '<option value="' + d.id + '">' + esc(d.name) + '</option>').join('');
  /* The GM may place any approved document, not just their own - handy for
     NPCs that do have a sheet. */
  $('btnTokDoc').disabled = !myDocs.length;
  renderRollSheets();
  renderRollWhat();
}

async function addDocToken() {
  const id = +$('tokDoc').value;
  if (!id) return;
  const doc = myDocs.find(d => d.id === id);
  const map = activeMap();
  if (!map) return;
  const body = {
    round: roundId, map: map.id, charId: id,
    label: doc ? doc.name : '', color: $('tokColor').value,
    x: 0.5, y: 0.5,
  };
  try {
    if ($('tokUsePortrait').checked) {
      const full = await api('char_get', { id });
      const data = full && full.data;
      const portrait = data && (data.portrait || (data.info && data.info.portrait) || data.image);
      if (portrait) {
        await new Promise(res => portraitToken(portrait, img => { if (img) body.img = img; res(); }));
      }
    }
    await api('token_add', body);
    await refresh(true);
  } catch (e) { alert(e.message); }
}

async function addFreeTokens() {
  const map = activeMap();
  if (!map) return;
  const label = $('tokLabel').value.trim();
  const n = Math.max(1, Math.min(20, +$('tokCount').value || 1));
  try {
    for (let i = 0; i < n; i++) {
      await api('token_add', {
        round: roundId, map: map.id, kind: 'npc',
        label: n > 1 ? label + ' ' + (i + 1) : label,
        color: $('tokColor').value,
        /* Spread them out a little, or twenty troopers land on one spot
           and the GM has to peel them apart one by one. */
        x: 0.3 + (i % 5) * 0.1, y: 0.3 + Math.floor(i / 5) * 0.1,
      });
    }
    await refresh(true);
  } catch (e) { alert(e.message); }
}

/* ---------------- rolling ----------------
   Mirrors the Wild Die of dice.js (2nd Edition R&E: explodes on a 6,
   complication on a 1). Not shared with dice.js yet - pulling the roll
   logic into a common file belongs with the shared-core clean-up that is
   already on the list, and doing it here would touch the dice page. */
function d6() { return 1 + Math.floor(Math.random() * 6); }
function rollPool(nDice, pips, wild, mod) {
  const regCount = wild ? Math.max(0, nDice - 1) : nDice;
  const regs = [];
  for (let i = 0; i < regCount; i++) regs.push(d6());
  let wildVal = null, wildTotal = 0, complication = false;
  const extra = [];          // the further dice an exploding wild die brings
  if (wild && nDice >= 1) {
    wildVal = d6();
    wildTotal = wildVal;
    if (wildVal === 1) complication = true;
    let v = wildVal;
    while (v === 6) { v = d6(); wildTotal += v; extra.push(v); }
  }
  const total = regs.reduce((a, b) => a + b, 0) + wildTotal + (pips || 0) + (mod || 0);
  return { regs, wildVal, wildTotal, extra, complication, total };
}
/* ---------------- rolling off a sheet ----------------
   The pools are not worked out here. The generators already do it when
   they save (buildRollProfile), and the result travels inside the
   document as `_roll` - attributes and trained skills as finished pip
   counts, plus the equipment that grants a dice bonus. Recomputing it
   here would mean a fourth copy of those rules, and it would need
   data.js and the whole equipment catalogue on this page. */
let rollProfiles = {};   // charId -> { entries, gear }

function pipsToDice(p) {
  return Math.floor(p / 3) + 'D' + (p % 3 ? '+' + (p % 3) : '');
}

async function loadRollProfile(id) {
  if (!id) return null;
  if (rollProfiles[id] !== undefined) return rollProfiles[id];
  rollProfiles[id] = null;               // stops a second fetch while this one runs
  try {
    const full = await api('char_get', { id });
    const d = full && full.data;
    rollProfiles[id] = (d && d._roll) || null;
  } catch (e) { rollProfiles[id] = null; }
  return rollProfiles[id];
}

function renderRollSheets() {
  const sel = $('rollSheet');
  const keep = sel.value;
  sel.innerHTML = '<option value="">' + esc(t('roll_nosheet')) + '</option>'
    + myDocs.map(d => '<option value="' + d.id + '">' + esc(d.name) + '</option>').join('');
  if (myDocs.some(d => String(d.id) === keep)) sel.value = keep;
}

async function renderRollWhat() {
  const id = +$('rollSheet').value || 0;
  const what = $('rollWhat');
  const gear = $('rollGear');
  const prof = await loadRollProfile(id);
  if (!prof || !(prof.entries || []).length) {
    what.innerHTML = '<option value="">' + esc(t('roll_free')) + '</option>';
    gear.innerHTML = '';
    updateRollSum();
    return;
  }
  what.innerHTML = '<option value="">' + esc(t('roll_free')) + '</option>'
    + prof.entries.map((e, i) =>
        '<option value="' + i + '">' + esc(e.label) + ' ' + pipsToDice(e.pips) + '</option>').join('');
  /* The bonuses are offered, not applied: only the player knows whether
     the code slicer is actually in hand for this roll. */
  gear.innerHTML = (prof.gear || []).length
    ? '<div class="hint">' + esc(t('roll_gear')) + '</div>'
      + prof.gear.map((g, i) =>
          '<label class="opt-row" style="text-transform:none" title="' + esc(g.hint || '') + '">'
          + '<input type="checkbox" class="roll-gear-box" data-pips="' + g.pips + '"> '
          + '<span>' + esc(g.label) + ' +' + pipsToDice(g.pips) + '</span></label>').join('')
    : '';
  updateRollSum();
}

/* What is actually thrown: the chosen pool, plus every ticked bonus, plus
   whatever the player typed. The three number fields stay editable - they
   are the free roll, and they are what the picker writes into. */
function rollPoolPips() {
  const id = +$('rollSheet').value || 0;
  const prof = rollProfiles[id];
  const idx = $('rollWhat').value;
  let pips = 0, from = '';
  if (prof && idx !== '') {
    const e = prof.entries[+idx];
    if (e) { pips = e.pips; from = e.label; }
  }
  let bonus = 0;
  document.querySelectorAll('.roll-gear-box:checked').forEach(b => { bonus += +b.getAttribute('data-pips') || 0; });
  return { pips, bonus, from };
}

function updateRollSum() {
  const r = rollPoolPips();
  const el = $('rollSum');
  if (!r.from) { el.textContent = ''; return; }
  const total = r.pips + r.bonus;
  el.textContent = t('roll_sum')
    .replace('{pool}', pipsToDice(total))
    .replace('{from}', r.from + (r.bonus ? ' +' + pipsToDice(r.bonus) : ''));
  /* Write it into the number fields, so the free roll and the picker are
     never two different truths on screen. */
  $('rollDice').value = Math.floor(total / 3);
  $('rollPips').value = total % 3;
}

async function doRoll() {
  const n = Math.max(0, +$('rollDice').value || 0);
  const p = Math.max(0, Math.min(2, +$('rollPips').value || 0));
  const mod = +$('rollMod').value || 0;
  const wild = $('rollWild').checked;
  const r = rollPool(n, p, wild, mod);
  /* Name what was rolled, not just the dice count - "Blaster 5D+2 → 21"
     tells the table something, "5D+2 → 21" does not. */
  const src = rollPoolPips();
  const label = (src.from ? src.from + ' ' : '')
              + n + 'D' + (p ? '+' + p : '') + (mod ? (mod > 0 ? ' +' + mod : ' ' + mod) : '');
  let text = label + ' → ' + r.total;
  if (r.wildVal !== null) text += ' (Wild ' + r.wildVal + ')';
  if (r.complication) text += ' – ' + t('complication');
  /* The individual dice travel along so every client can put the roll on
     the map rather than only into the log. */
  const data = JSON.stringify({
    label, regs: r.regs, wild: r.wildVal, extra: r.extra,
    pips: p, mod, total: r.total, complication: r.complication,
  });
  try { await api('vtt_log', { round: roundId, kind: 'roll', text, data }); await refresh(true); }
  catch (e) { alert(e.message); }
}

/* ---------------- voice and video ----------------
   A mesh: everyone holds a connection to everyone else, and the media
   never touches our server - it only passes the introductions along. That
   carries a table of five or six comfortably. Beyond that the number of
   connections grows with the square of the participants and it would need
   a server that mixes the streams, which is a different kind of project.

   Two things decide whether this works at all, and neither is in this
   file: the page must be delivered over HTTPS (no browser hands out a
   microphone otherwise), and there has to be a TURN server for the people
   whose routers refuse incoming connections. */
let call = {
  in: false,
  stream: null,           // our own microphone/camera
  mic: true,
  cam: false,
  peers: {},              // userId -> { pc, aSender, vSender, stream, name }
  me: 0,
  ice: [],
  timerSignals: 0,
  timerPresence: 0,
};

function callMsg(key, raw) {
  $('callMsg').textContent = raw !== undefined ? raw : (key ? t(key) : '');
}

async function callJoin() {
  if (MAP_ONLY || call.in) return;
  if (!window.isSecureContext) { callMsg('call_insecure'); return; }
  try {
    call.stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
  } catch (e) {
    callMsg('call_nomic');
    return;
  }
  call.mic = true;
  call.cam = false;
  try {
    const c = await api('turn_credentials', { round: roundId });
    call.ice = c.iceServers || [];
    if (!c.turnConfigured) callMsg('call_noturn');
    else callMsg('');
  } catch (e) { call.ice = []; callMsg('call_noturn'); }

  call.in = true;
  $('btnCallJoin').classList.add('hidden');
  $('btnCallLeave').classList.remove('hidden');
  $('callToggles').classList.remove('hidden');
  renderCallButtons();
  renderTiles();

  await callHeartbeat();
  /* Two separate rhythms: the post box has to be emptied quickly, because
     a handshake is several messages back and forth. Who is in the room
     changes far more slowly. */
  call.timerSignals = setInterval(callPumpSignals, 1000);
  call.timerPresence = setInterval(callHeartbeat, 3000);
}

async function callLeave() {
  if (!call.in) return;
  call.in = false;
  clearInterval(call.timerSignals);
  clearInterval(call.timerPresence);
  Object.keys(call.peers).forEach(id => dropPeer(+id));
  if (call.stream) call.stream.getTracks().forEach(t => t.stop());
  call.stream = null;
  try { await api('rtc_leave', { round: roundId }); } catch (e) {}
  $('btnCallJoin').classList.remove('hidden');
  $('btnCallLeave').classList.add('hidden');
  $('callToggles').classList.add('hidden');
  callMsg('');
  renderTiles();
}

function dropPeer(id) {
  const p = call.peers[id];
  if (!p) return;
  try { p.pc.close(); } catch (e) {}
  delete call.peers[id];
  renderTiles();
}

/* Who initiates? Both sides see each other at the same moment, and if both
   send an offer the negotiation collapses ("glare"). The rule is simply
   the smaller user id offers - it needs no agreement, both sides work it
   out for themselves. */
function iOffer(otherId) {
  return call.me < otherId;
}

function makePeer(id, name) {
  const pc = new RTCPeerConnection({ iceServers: call.ice });
  /* Both directions are set up right away, even without a camera. The
     track is filled in later with replaceTrack, which needs no fresh
     negotiation - switching the camera on mid-session would otherwise
     renegotiate the whole connection. */
  const aSender = pc.addTransceiver('audio', { direction: 'sendrecv' }).sender;
  const vSender = pc.addTransceiver('video', { direction: 'sendrecv' }).sender;
  const a = call.stream && call.stream.getAudioTracks()[0];
  const v = call.stream && call.stream.getVideoTracks()[0];
  if (a) aSender.replaceTrack(a);
  if (v) vSender.replaceTrack(v);

  const entry = { pc, aSender, vSender, stream: new MediaStream(), name };
  call.peers[id] = entry;

  pc.onicecandidate = ev => {
    if (ev.candidate) {
      api('rtc_send', { round: roundId, to: id,
                        body: JSON.stringify({ t: 'ice', c: ev.candidate }) }).catch(() => {});
    }
  };
  pc.ontrack = ev => {
    entry.stream.addTrack(ev.track);
    /* A receiving track exists as soon as the connection has a channel for
       it - even when nothing is coming through, because the transceiver is
       set up in both directions from the start. What tells the difference
       is `muted`: it is true while no media arrives and flips when the
       other side actually switches the camera on. Without listening for
       that, every tile would show a black rectangle instead of the name. */
    ev.track.onmute = renderTiles;
    ev.track.onunmute = renderTiles;
    renderTiles();
  };
  pc.onconnectionstatechange = () => {
    if (pc.connectionState === 'failed' || pc.connectionState === 'closed') dropPeer(id);
    else renderTiles();
  };
  return entry;
}

async function callHeartbeat() {
  if (!call.in) return;
  let r;
  try {
    r = await api('rtc_join', { round: roundId, cam: call.cam ? 1 : 0, mic: call.mic ? 1 : 0 });
  } catch (e) { return; }
  call.me = r.me;
  const here = {};
  (r.peers || []).forEach(p => { if (!p.me) here[p.id] = p; });

  /* Gone: close and forget. */
  Object.keys(call.peers).forEach(id => { if (!here[+id]) dropPeer(+id); });

  /* New: build a connection, and offer if it is our turn. */
  for (const idStr of Object.keys(here)) {
    const id = +idStr;
    if (call.peers[id]) {
      const p = call.peers[id];
      p.name = here[id].name;
      p.cam = here[id].cam;
      p.mic = here[id].mic;
      continue;
    }
    const entry = makePeer(id, here[id].name);
    entry.cam = here[id].cam;
    entry.mic = here[id].mic;
    if (iOffer(id)) {
      try {
        const offer = await entry.pc.createOffer();
        await entry.pc.setLocalDescription(offer);
        await api('rtc_send', { round: roundId, to: id,
                                body: JSON.stringify({ t: 'offer', sdp: entry.pc.localDescription }) });
      } catch (e) {}
    }
  }
  renderTiles();
}

async function callPumpSignals() {
  if (!call.in) return;
  let r;
  try { r = await api('rtc_recv', { round: roundId }); } catch (e) { return; }
  for (const m of (r.messages || [])) {
    let msg;
    try { msg = JSON.parse(m.body); } catch (e) { continue; }
    const id = m.from;
    let entry = call.peers[id];
    if (!entry) entry = makePeer(id, '');
    try {
      if (msg.t === 'offer') {
        await entry.pc.setRemoteDescription(msg.sdp);
        const ans = await entry.pc.createAnswer();
        await entry.pc.setLocalDescription(ans);
        await api('rtc_send', { round: roundId, to: id,
                                body: JSON.stringify({ t: 'answer', sdp: entry.pc.localDescription }) });
      } else if (msg.t === 'answer') {
        await entry.pc.setRemoteDescription(msg.sdp);
      } else if (msg.t === 'ice') {
        /* Candidates can arrive before the description they belong to;
           that throws, and it is not worth reporting. */
        try { await entry.pc.addIceCandidate(msg.c); } catch (e) {}
      }
    } catch (e) {}
  }
}

async function toggleMic() {
  call.mic = !call.mic;
  const a = call.stream && call.stream.getAudioTracks()[0];
  /* Disabling the track is what actually mutes: it keeps sending, but
     silence. Removing it would renegotiate every connection. */
  if (a) a.enabled = call.mic;
  renderCallButtons();
  callHeartbeat();
}

async function toggleCam() {
  if (call.cam) {
    const v = call.stream && call.stream.getVideoTracks()[0];
    if (v) { v.stop(); call.stream.removeTrack(v); }
    Object.values(call.peers).forEach(p => { try { p.vSender.replaceTrack(null); } catch (e) {} });
    call.cam = false;
  } else {
    try {
      const s = await navigator.mediaDevices.getUserMedia({ video: true });
      const v = s.getVideoTracks()[0];
      call.stream.addTrack(v);
      Object.values(call.peers).forEach(p => { try { p.vSender.replaceTrack(v); } catch (e) {} });
      call.cam = true;
      callMsg('');
    } catch (e) { callMsg('call_nomic'); }
  }
  renderCallButtons();
  renderTiles();
  callHeartbeat();
}

function renderCallButtons() {
  $('btnMic').textContent = t(call.mic ? 'call_mic_on' : 'call_mic_off');
  $('btnMic').classList.toggle('danger', !call.mic);
  $('btnCam').textContent = t(call.cam ? 'call_cam_on' : 'call_cam_off');
}

/* The tiles are rebuilt, but the <video> elements are kept: assigning a
   srcObject again restarts the picture, and a mesh that flickers on every
   poll is unusable. */
const tileEls = {};
function renderTiles() {
  const box = $('callTiles');
  if (!call.in) { box.innerHTML = ''; Object.keys(tileEls).forEach(k => delete tileEls[k]); return; }

  const wanted = ['me'].concat(Object.keys(call.peers));
  Object.keys(tileEls).forEach(k => {
    if (wanted.indexOf(k) < 0) { tileEls[k].remove(); delete tileEls[k]; }
  });

  wanted.forEach(key => {
    let tile = tileEls[key];
    if (!tile) {
      tile = document.createElement('div');
      tile.className = 'call-tile';
      tile.innerHTML = '<video autoplay playsinline></video><span class="call-name"></span>';
      tileEls[key] = tile;
      box.appendChild(tile);
    }
    const vid = tile.querySelector('video');
    const nameEl = tile.querySelector('.call-name');
    if (key === 'me') {
      /* Never listen to yourself - it howls. */
      vid.muted = true;
      if (vid.srcObject !== call.stream) vid.srcObject = call.stream;
      nameEl.textContent = t('call_you') + (call.mic ? '' : ' 🔇');
      tile.classList.toggle('no-cam', !call.cam);
    } else {
      const p = call.peers[+key];
      if (!p) return;
      if (vid.srcObject !== p.stream) vid.srcObject = p.stream;
      const live = p.pc.connectionState === 'connected';
      nameEl.textContent = (p.name || '?') + (live ? '' : ' · ' + t('call_connecting'))
                         + (p.mic === false ? ' 🔇' : '');
      /* Two sources agree here: what the other side says about its camera
         in the heartbeat, and whether the track is actually delivering.
         Either alone is misleading - the flag can be stale by a few
         seconds, and the track exists even when it carries nothing. */
      const hasPicture = p.stream.getVideoTracks().some(x => x.readyState === 'live' && !x.muted);
      tile.classList.toggle('no-cam', !(p.cam && hasPicture));
    }
  });

  if (Object.keys(call.peers).length === 0) callMsg(null, t('call_alone'));
}

/* ---------------- rounds ---------------- */
function gate(msgKey) {
  $('vttGate').classList.remove('hidden');
  $('vttMain').classList.add('hidden');
  $('gateText').textContent = t(msgKey);
}

async function selectRound(id) {
  roundId = id;
  version = -1;
  state = null;
  try { localStorage.setItem('swd6_vtt_round', String(id)); } catch (e) {}
  await refresh(true);
  await loadMyDocs();
}

/* online.js sits on this page too now, so signing in happens right here
   instead of on a generator page. The gate has to hear about it: it decided
   what to show from the session as it stood when the page loaded. Reading
   the session again and running boot() once more is enough - polling is
   stopped first so a second timer cannot start alongside the first. */
/* Called from the rounds dialog when the table is already open: switching
   beats reloading. A round that was only just created or joined is not in
   this page's list yet - then boot() starts over and picks it up from
   swd6_vtt_round, which the caller has already written. */
window.openTableRound = async function (id) {
  const sel = $('roundSel');
  if (sel && Array.prototype.some.call(sel.options, o => +o.value === +id)) {
    sel.value = String(id);
    await selectRound(+id);
    return;
  }
  if (pollTimer) { clearInterval(pollTimer); pollTimer = 0; }
  boot();
};

window.onAuthChanged = function () {
  try { SESSION = JSON.parse(localStorage.getItem(LS_ONLINE)) || {}; } catch (e) { SESSION = {}; }
  if (pollTimer) { clearInterval(pollTimer); pollTimer = 0; }
  boot();
};

async function boot() {
  applyLang();
  if (!apiUrl() && !(typeof SITE_CONFIG !== 'undefined')) { gate('gate_noserver'); return; }
  if (!SESSION.token) { gate('gate_nologin'); return; }
  let list;
  try {
    list = await api('round_list', {});
  } catch (e) {
    gate(e.message && /log/i.test(e.message) ? 'gate_nologin' : 'gate_noserver');
    return;
  }
  rounds = list.rounds || [];
  if (!rounds.length) { gate('gate_norounds'); return; }
  $('vttGate').classList.add('hidden');
  $('vttMain').classList.remove('hidden');
  const sel = $('roundSel');
  sel.innerHTML = rounds.map(r =>
    '<option value="' + r.id + '">' + esc(r.name) + '</option>').join('');
  let want = 0;
  try { want = +localStorage.getItem('swd6_vtt_round') || 0; } catch (e) {}
  if (!rounds.some(r => r.id === want)) want = rounds[0].id;
  sel.value = String(want);
  await selectRound(want);
  startPolling();
}

/* ---------------- wiring ---------------- */
document.addEventListener('DOMContentLoaded', function () {
  if (MAP_ONLY) document.body.classList.add('map-only');
  applyLang();

  document.querySelectorAll('input[name="langOpt"]').forEach(r => {
    r.addEventListener('change', function () {
      LANG = this.value;
      try { localStorage.setItem(LS_LANG, LANG); } catch (e) {}
      applyLang();
      renderAll();
    });
  });
  const btnOpt = $('btnOptions'), menu = $('optionsMenu');
  if (btnOpt) btnOpt.addEventListener('click', e => { e.stopPropagation(); menu.classList.toggle('hidden'); });
  document.addEventListener('click', e => {
    if (menu && !menu.classList.contains('hidden') && !menu.contains(e.target) && e.target !== btnOpt) {
      menu.classList.add('hidden');
    }
  });

  $('roundSel').addEventListener('change', function () { selectRound(+this.value); });

  $('btnMapUpload').addEventListener('click', () => $('mapFile').click());
  $('mapFile').addEventListener('change', function () {
    const f = this.files && this.files[0];
    this.value = '';
    if (!f) return;
    shrinkMap(f, async img => {
      if (!img) { alert(t('err_big')); return; }
      try {
        await api('map_add', {
          round: roundId, name: f.name.replace(/\.[^.]+$/, ''),
          img, grid: +$('gridSize').value || 0,
        });
        await refresh(true);
      } catch (e) { alert(e.message); }
    });
  });
  $('mapSel').addEventListener('change', async function () {
    try { await api('map_activate', { round: roundId, map: +this.value }); await refresh(true); }
    catch (e) { alert(e.message); }
  });
  $('btnMapDelete').addEventListener('click', async () => {
    const map = activeMap();
    if (!map || !confirm(t('confirm_map_delete'))) return;
    try { await api('map_delete', { round: roundId, map: map.id }); await refresh(true); }
    catch (e) { alert(e.message); }
  });
  /* Day and night. The veil follows the slider straight away so the GM can
     see what the table will see; the server hears about it at most every
     200 ms while dragging, and the final value always goes out. */
  const rg = $('dimRange');
  if (rg) {
    let dimPending = 0;
    const sende = async (wert, endgueltig) => {
      const map = activeMap();
      if (!map) return;
      map.dim = wert;
      try { await api('map_dim', { round: roundId, map: map.id, dim: wert }); }
      catch (e) { setStatus(false, e.message); }
      if (endgueltig) await refresh(true);
    };
    rg.addEventListener('input', function () {
      const wert = +this.value || 0;
      if ($('dimVal')) $('dimVal').textContent = wert + ' %';
      zeigeDunkelheit(wert);
      const jetzt = Date.now();
      if (jetzt - dimPending > 200) { dimPending = jetzt; sende(wert, false); }
    });
    rg.addEventListener('change', function () { sende(+this.value || 0, true); });
  }

  $('gridSize').addEventListener('change', async function () {
    const map = activeMap();
    if (!map) return;
    /* Draw it at once so the GM sees the effect while typing, then store it
       - the grid belongs to the map, and everyone else has to see it too. */
    map.grid = +this.value || 0;
    renderStage();
    try { await api('map_grid', { round: roundId, map: map.id, grid: map.grid }); await refresh(true); }
    catch (e) { alert(e.message); }
  });

  document.querySelectorAll('input[name="fogMode"]').forEach(r => {
    r.addEventListener('change', () => {
      const on = fogMode() !== 'off';
      $('stage').classList.toggle('painting', on);
      $('stageHint').textContent = on ? t('fog_paint') : t('stage_hint');
    });
  });
  $('btnFogAllDark').addEventListener('click', () => setWholeFog('0'));
  $('btnFogAllOpen').addEventListener('click', () => setWholeFog('2'));

  /* ---- music ---- */
  const auCtl = (extra) => {
    const trackId = +$('auSel').value || 0;
    return api('audio_control', Object.assign(
      { round: roundId, track: trackId, loop: $('auLoop').checked }, extra));
  };
  $('btnAuPlay').addEventListener('click', async () => {
    audioUnlocked = true;
    try { await auCtl({ play: 1, pos: 0 }); await refresh(true); } catch (e) { alert(e.message); }
  });
  $('btnAuPause').addEventListener('click', async () => {
    /* Pause where it actually stands, so resuming carries on rather than
       jumping back to the beginning. */
    const el = $('auEl');
    let pos = el.currentTime || 0;
    if (ytPlayer && ytReady) { try { pos = ytPlayer.getCurrentTime() || pos; } catch (e) {} }
    try { await auCtl({ play: 0, pos }); await refresh(true); } catch (e) { alert(e.message); }
  });
  $('btnAuStop').addEventListener('click', async () => {
    try {
      await api('audio_control', { round: roundId, track: 0, play: 0, pos: 0 });
      await refresh(true);
    } catch (e) { alert(e.message); }
  });
  $('auLoop').addEventListener('change', () => auCtl({}).then(() => refresh(true)).catch(() => {}));
  $('auSel').addEventListener('change', async () => {
    try { await auCtl({ play: 1, pos: 0 }); await refresh(true); } catch (e) { alert(e.message); }
  });
  $('btnAuUpload').addEventListener('click', () => $('auFile').click());
  $('auFile').addEventListener('change', function () {
    const f = this.files && this.files[0];
    this.value = '';
    if (!f) return;
    if (f.size > 12 * 1024 * 1024) { alert(t('au_big')); return; }
    const rd = new FileReader();
    rd.onload = async () => {
      try {
        await api('audio_add', { round: roundId, name: f.name.replace(/\.[^.]+$/, ''), file: rd.result });
        await refresh(true);
      } catch (e) { alert(e.message); }
    };
    rd.readAsDataURL(f);
  });
  $('btnAuYt').addEventListener('click', async () => {
    const v = $('auYt').value.trim();
    if (!v) return;
    try {
      await api('audio_add', { round: roundId, yt: v, name: $('auYt').value.slice(0, 60) });
      $('auYt').value = '';
      await refresh(true);
    } catch (e) { alert(e.message); }
  });
  $('btnAuDelete').addEventListener('click', async () => {
    const id = +$('auSel').value || 0;
    if (!id || !confirm(t('confirm_au_delete'))) return;
    try { await api('audio_delete', { round: roundId, track: id }); await refresh(true); }
    catch (e) { alert(e.message); }
  });
  $('btnAuEnable').addEventListener('click', () => {
    /* The click the browser was waiting for. */
    audioUnlocked = true;
    $('btnAuEnable').classList.add('hidden');
    syncAudio();
  });
  $('auVol').addEventListener('input', function () {
    const v = (+this.value || 0) / 100;
    $('auEl').volume = v;
    if (ytPlayer && ytReady) { try { ytPlayer.setVolume(Math.round(v * 100)); } catch (e) {} }
    try { localStorage.setItem('swd6_vtt_vol', this.value); } catch (e) {}
  });
  try {
    const v = localStorage.getItem('swd6_vtt_vol');
    if (v !== null) $('auVol').value = v;
  } catch (e) {}

  $('btnPopout').addEventListener('click', () => {
    /* A named window: pressing the button again brings the existing one
       back to the front instead of opening a second copy. */
    const w = window.open('vtt.html?view=map', 'swd6-map',
                          'width=1280,height=860,menubar=no,toolbar=no');
    if (w) w.focus();
  });
  $('btnPopout').title = t('popout');

  $('btnCallJoin').addEventListener('click', callJoin);
  $('btnCallLeave').addEventListener('click', callLeave);
  $('btnMic').addEventListener('click', toggleMic);
  $('btnCam').addEventListener('click', toggleCam);
  /* Give up the seat when the tab closes, so nobody lingers in the round
     as a ghost until the heartbeat times out.

     fetch with keepalive, not sendBeacon: a beacon carries no headers, so
     the request would arrive without the token and be turned away with a
     401. keepalive survives the page going away AND keeps the header. */
  window.addEventListener('pagehide', () => {
    if (!call.in) return;
    try {
      fetch(apiUrl() + '?action=rtc_leave', {
        method: 'POST', keepalive: true,
        headers: { 'Content-Type': 'application/json',
                   'Authorization': 'Bearer ' + SESSION.token,
                   'X-Auth-Token': SESSION.token },
        body: JSON.stringify({ round: roundId }),
      });
    } catch (e) {}
  });

  $('rollSheet').addEventListener('change', renderRollWhat);
  $('rollWhat').addEventListener('change', updateRollSum);
  $('rollGear').addEventListener('change', updateRollSum);

  $('btnTokDoc').addEventListener('click', addDocToken);
  $('btnTokFree').addEventListener('click', addFreeTokens);
  $('btnRoll').addEventListener('click', doRoll);

  /* Nothing can be seeked before the browser knows how long the track is.
     With preload="none" that only happens once playback has begun, so the
     very first attempt to jump to the right position is always too early -
     this brings it back the moment the duration is known. */
  $('auEl').addEventListener('loadedmetadata', () => { if (state) syncAudio(); });
  $('auEl').addEventListener('canplay', () => { if (state) syncAudio(); });

  wireDragging();
  boot();
});

})();
