/* =====================================================================
   About & credits - shared by all three generators
   ---------------------------------------------------------------------
   The Star Wars crawl with the acknowledgements, plus the licence and
   source code details. This used to live in app.js and so was reachable
   only from the character page; the droid and ship pages had nothing but
   the language picker in their gear menu.

   Loaded by all three pages AFTER their own page script, so the dictionary
   T already exists.

   APP_VERSION lives here too - the version number belongs to the app as a
   whole, not to any single page.
   ===================================================================== */
'use strict';

const APP_VERSION = '4.0.0-beta.14';

/* ---------------- translations ---------------- */
Object.assign(T.de, {
  opt_about: 'Info', about_open: 'ℹ Über & Credits',
  about_title: 'Über & Credits',
  app_name: 'SWD6 Generatoren',
  about_created: 'Erstellt von', about_license: 'Lizenz', about_repo: 'Quellcode',
  about_replay: '↻ Crawl wiederholen', about_close: 'Schließen',
  about_music: 'Musik', about_music_track: '„Invasion March – Star Wars Style Cinematic Music“',
  about_mute: '🔇 Stumm', about_unmute: '🔊 Ton an',
  about_music_by: 'von Luis Humanoid · lizenzfrei',
  about_disclaimer: 'Nicht-kommerzielles Fan-Projekt. Nicht verbunden mit Lucasfilm Ltd., Disney oder West End Games. „Star Wars“ ist eine Marke der jeweiligen Rechteinhaber.',
  about_crawl: [
    'SWD6 GENERATOREN',
    'Vor langer Zeit, in einer Tabellenkalkulation weit, weit entfernt, entstand ein Werkzeug, das Helden erschuf.',
    'Der größte Dank gebührt CHANCE GIBBONEY, dem Schöpfer der originalen Excel-Tabellen für Charaktere, Droiden und Schiffe. Seine akribische Arbeit bildet das Fundament aller drei Generatoren – ohne ihn gäbe es diese Anwendung nicht. Er hat der Nutzung freundlicherweise zugestimmt.',
    'Dank gebührt WEST END GAMES für das D6-System und das Star-Wars-Rollenspiel der Zweiten Edition, das Generationen von Spielern zusammenbrachte.',
    'Dank an die namenlosen Chronisten der Fan-Gemeinde, die über Jahre die Sammelbände für Waffen, Ausrüstung, Droiden, Raumschiffe und Fahrzeuge zusammentrugen und die Saga-Edition ins D6-System zurückübersetzten. Aus ihrer Arbeit stammen die Kataloge dieser Anwendung.',
    'Dank an Kazuhiko Arase für die QR-Code-Bibliothek, an die Projekte jsPDF und html2canvas (beide MIT) für den PDF-Export und an die Schöpfer von PHP, SQLite und Python, deren freie Werkzeuge diese Reise möglich machten.',
    'Dank auch an die KI-Assistenz, die beim Portieren des Codes zur Seite stand.',
    'Und schließlich Dank an dich – tapfere Heldin, tapferer Held am Spieltisch, der neue Charaktere in eine unendliche Galaxis entsendet.',
    'Möge die Macht mit dir sein.',
  ],
});

Object.assign(T.en, {
  opt_about: 'Info', about_open: 'ℹ About & Credits',
  about_title: 'About & Credits',
  app_name: 'SWD6 Generators',
  about_created: 'Created by', about_license: 'License', about_repo: 'Source code',
  about_replay: '↻ Replay crawl', about_close: 'Close',
  about_music: 'Music', about_music_track: '“Invasion March – Star Wars Style Cinematic Music”',
  about_mute: '🔇 Mute', about_unmute: '🔊 Unmute',
  about_music_by: 'by Luis Humanoid · royalty-free',
  about_disclaimer: 'Non-commercial fan project. Not affiliated with Lucasfilm Ltd., Disney or West End Games. “Star Wars” is a trademark of its respective owners.',
  about_crawl: [
    'SWD6 GENERATORS',
    'A long time ago, in a spreadsheet far, far away, a tool was born that forged heroes.',
    'Our greatest thanks go to CHANCE GIBBONEY, creator of the original Excel workbooks for characters, droids and ships. His meticulous work is the foundation of all three generators — without him, this app would not exist. He kindly gave his permission for it to be used.',
    'Thanks to WEST END GAMES for the D6 system and the Second Edition of the Star Wars Roleplaying Game that brought generations of players together.',
    'Thanks to the unnamed chroniclers of the fan community, who over many years compiled the compendia of weapons, equipment, droids, starships and vehicles, and converted the Saga Edition back into the D6 system. Their work is where the catalogs in this app come from.',
    'Thanks to Kazuhiko Arase for the QR code library, to the jsPDF and html2canvas projects (both MIT) for PDF export, and to the makers of PHP, SQLite and Python, whose free tools made this journey possible.',
    'Thanks also to the AI assistance that helped port the code.',
    'And finally, thanks to you — brave hero at the gaming table, who sends new characters into an endless galaxy.',
    'May the Force be with you.',
  ],
});

/* ---------------- about & credits ---------------- */
function aboutModal() {
  let m = document.getElementById('aboutModal');
  if (!m) {
    m = document.createElement('div');
    m.id = 'aboutModal';
    m.className = 'modal-overlay no-print hidden';
    m.innerHTML = '<div class="modal-box about-box" id="aboutBox"></div>';
    document.body.appendChild(m);
    m.addEventListener('click', e => { if (e.target === m) closeAbout(); });
  }
  return m;
}

/* ---------------- music ----------------
   The track plays while the window is open and stops when it closes -
   otherwise it would drone on while you work on your character. The browser
   remembers the mute setting, so nobody has to press it again every time. */
const LS_CREDITS_MUTED = 'swd6_credits_muted';
function creditsAudio() { return document.getElementById('creditsAudio'); }
function creditsMuted() { return localStorage.getItem(LS_CREDITS_MUTED) === '1'; }
function startCreditsMusic() {
  const a = creditsAudio();
  if (!a) return;
  a.muted = creditsMuted();
  /* Opening it is a click, so browsers allow playback. If it is refused
     anyway (strict autoplay rules, say), the player stays visible and you
     start it by hand - hence simply swallowing the error. */
  const p = a.play();
  if (p && p.catch) p.catch(() => {});
}
function stopCreditsMusic() {
  const a = creditsAudio();
  if (!a) return;
  a.pause();
  try { a.currentTime = 0; } catch (e) {}
}
function toggleCreditsMute() {
  const a = creditsAudio();
  const next = !creditsMuted();
  localStorage.setItem(LS_CREDITS_MUTED, next ? '1' : '0');
  if (a) a.muted = next;
  const b = document.getElementById('btnCreditsMute');
  if (b) b.textContent = next ? t('about_unmute') : t('about_mute');
}
function closeAbout() {
  const m = document.getElementById('aboutModal');
  if (m) m.classList.add('hidden');
  stopCreditsMusic();
}
function openAbout() { aboutModal().classList.remove('hidden'); renderAbout(); startCreditsMusic(); }
window.renderAbout = function renderAbout() {
  const box = document.getElementById('aboutBox');
  if (!box) return;
  /* Switching language rebuilds the box - which replaces the <audio>
     element too. Remember position and state beforehand, so the track does
     not break off half way and start again from the top. */
  const old = creditsAudio();
  const keep = old ? { at: old.currentTime, playing: !old.paused } : null;
  const crawl = t('about_crawl');
  const title = crawl[0];
  const paras = crawl.slice(1).map(p => `<p>${esc(p)}</p>`).join('');
  box.innerHTML = `
    <div class="modal-head"><h2>${t('about_title')}</h2>
      <button class="mini" data-about="close">✕</button></div>
    <div class="sw-crawl">
      <div class="sw-crawl-content" id="swCrawl">
        <div class="sw-title">${esc(title)}</div>
        ${paras}
      </div>
    </div>
    <div class="about-info">
      <p><b>${esc(t('app_name'))}</b> · v${APP_VERSION}</p>
      <p>${t('about_created')} <b>1Bln21</b> · ${t('about_license')}:
        <a href="LICENSE" target="_blank" rel="noopener">MIT</a></p>
      <p>${t('about_music')}: <b>${t('about_music_track')}</b> ${t('about_music_by')}
        <button class="mini" id="btnCreditsMute" data-about="mute">${
          creditsMuted() ? t('about_unmute') : t('about_mute')}</button></p>
      <audio id="creditsAudio" controls loop preload="none" src="credits-theme.mp3"
             style="width:100%; margin-bottom:8px"></audio>
      <p class="hint">${t('about_repo')}: github.com/1Bln21/swd6-character-generator</p>
      <p class="hint">${t('about_disclaimer')}</p>
    </div>
    <p style="text-align:center; margin-top:10px">
      <button data-about="replay">${t('about_replay')}</button>
      <button class="accent" data-about="close">${t('about_close')}</button>
    </p>`;
  /* carry playback across the rebuild */
  if (keep) {
    const a = creditsAudio();
    if (a) {
      a.muted = creditsMuted();
      try { a.currentTime = keep.at; } catch (e) {}
      if (keep.playing) { const p = a.play(); if (p && p.catch) p.catch(() => {}); }
    }
  }
};
const btnAbout = document.getElementById('btnAbout');
if (btnAbout) btnAbout.addEventListener('click', () => {
  /* Do not reach for app.js's optionsMenu variable - it does not exist on
     the droid and ship pages. */
  const om = document.getElementById('optionsMenu');
  if (om) om.classList.add('hidden');
  openAbout();
});
document.addEventListener('click', e => {
  const el = e.target.closest('[data-about]');
  if (!el) return;
  const act = el.dataset.about;
  if (act === 'close') closeAbout();
  if (act === 'mute') toggleCreditsMute();
  if (act === 'replay') {
    const c = document.getElementById('swCrawl');
    if (c) { c.style.animation = 'none'; void c.offsetWidth; c.style.animation = ''; }
  }
});
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeAbout();
});
