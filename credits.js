/* =====================================================================
   Über & Credits – gemeinsam für alle drei Generatoren
   ---------------------------------------------------------------------
   Der Star-Wars-Crawl mit der Danksagung und die Angaben zu Lizenz und
   Quellcode. Lag früher in app.js und war damit nur auf der
   Charakterseite erreichbar; Droiden- und Schiffsseite hatten im
   ⚙-Menü nur die Sprachwahl.

   Wird von allen drei Seiten NACH dem jeweiligen Seitenskript geladen,
   damit das Wörterbuch T bereits existiert.

   Hier steht auch APP_VERSION – die Versionsnummer gehört zur App als
   Ganzes, nicht zu einer einzelnen Seite.
   ===================================================================== */
'use strict';

const APP_VERSION = '2.4.4';

/* ---------------- Übersetzungen ---------------- */
Object.assign(T.de, {
  opt_about: 'Info', about_open: 'ℹ Über & Credits',
  about_title: 'Über & Credits',
  app_name: 'SWD6 Generatoren',
  about_created: 'Erstellt von', about_license: 'Lizenz', about_repo: 'Quellcode',
  about_replay: '↻ Crawl wiederholen', about_close: 'Schließen',
  about_disclaimer: 'Nicht-kommerzielles Fan-Projekt. Nicht verbunden mit Lucasfilm Ltd., Disney oder West End Games. „Star Wars“ ist eine Marke der jeweiligen Rechteinhaber.',
  about_crawl: [
    'SWD6 GENERATOREN',
    'Vor langer Zeit, in einer Tabellenkalkulation weit, weit entfernt, entstand ein Werkzeug, das Helden erschuf.',
    'Der größte Dank gebührt CHANCE GIBBONEY, dem Schöpfer der originalen Excel-Tabellen für Charaktere, Droiden und Schiffe. Seine akribische Arbeit bildet das Fundament aller drei Generatoren – ohne ihn gäbe es diese Anwendung nicht. Er hat der Nutzung freundlicherweise zugestimmt.',
    'Dank gebührt WEST END GAMES für das D6-System und das Star-Wars-Rollenspiel der Zweiten Edition, das Generationen von Spielern zusammenbrachte.',
    'Dank an die namenlosen Chronisten der Fan-Gemeinde, die über Jahre die Sammelbände für Waffen, Ausrüstung, Droiden, Raumschiffe und Fahrzeuge zusammentrugen und die Saga-Edition ins D6-System zurückübersetzten. Aus ihrer Arbeit stammen die Kataloge dieser Anwendung.',
    'Dank an Kazuhiko Arase für die QR-Code-Bibliothek und an die Schöpfer von PHP, SQLite und Python, deren freie Werkzeuge diese Reise möglich machten.',
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
  about_disclaimer: 'Non-commercial fan project. Not affiliated with Lucasfilm Ltd., Disney or West End Games. “Star Wars” is a trademark of its respective owners.',
  about_crawl: [
    'SWD6 GENERATORS',
    'A long time ago, in a spreadsheet far, far away, a tool was born that forged heroes.',
    'Our greatest thanks go to CHANCE GIBBONEY, creator of the original Excel workbooks for characters, droids and ships. His meticulous work is the foundation of all three generators — without him, this app would not exist. He kindly gave his permission for it to be used.',
    'Thanks to WEST END GAMES for the D6 system and the Second Edition of the Star Wars Roleplaying Game that brought generations of players together.',
    'Thanks to the unnamed chroniclers of the fan community, who over many years compiled the compendia of weapons, equipment, droids, starships and vehicles, and converted the Saga Edition back into the D6 system. Their work is where the catalogs in this app come from.',
    'Thanks to Kazuhiko Arase for the QR code library, and to the makers of PHP, SQLite and Python, whose free tools made this journey possible.',
    'Thanks also to the AI assistance that helped port the code.',
    'And finally, thanks to you — brave hero at the gaming table, who sends new characters into an endless galaxy.',
    'May the Force be with you.',
  ],
});

/* ---------------- Über / About & Credits ---------------- */
function aboutModal() {
  let m = document.getElementById('aboutModal');
  if (!m) {
    m = document.createElement('div');
    m.id = 'aboutModal';
    m.className = 'modal-overlay no-print hidden';
    m.innerHTML = '<div class="modal-box about-box" id="aboutBox"></div>';
    document.body.appendChild(m);
    m.addEventListener('click', e => { if (e.target === m) m.classList.add('hidden'); });
  }
  return m;
}
function openAbout() { aboutModal().classList.remove('hidden'); renderAbout(); }
window.renderAbout = function renderAbout() {
  const box = document.getElementById('aboutBox');
  if (!box) return;
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
      <p class="hint">${t('about_repo')}: github.com/1Bln21/swd6-character-generator</p>
      <p class="hint">${t('about_disclaimer')}</p>
    </div>
    <p style="text-align:center; margin-top:10px">
      <button data-about="replay">${t('about_replay')}</button>
      <button class="accent" data-about="close">${t('about_close')}</button>
    </p>`;
};
const btnAbout = document.getElementById('btnAbout');
if (btnAbout) btnAbout.addEventListener('click', () => {
  /* Nicht auf die Variable optionsMenu aus app.js zugreifen – die gibt es
     auf der Droiden- und Schiffsseite nicht. */
  const om = document.getElementById('optionsMenu');
  if (om) om.classList.add('hidden');
  openAbout();
});
document.addEventListener('click', e => {
  const el = e.target.closest('[data-about]');
  if (!el) return;
  const act = el.dataset.about;
  const m = document.getElementById('aboutModal');
  if (act === 'close' && m) m.classList.add('hidden');
  if (act === 'replay') {
    const c = document.getElementById('swCrawl');
    if (c) { c.style.animation = 'none'; void c.offsetWidth; c.style.animation = ''; }
  }
});
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') { const m = document.getElementById('aboutModal'); if (m) m.classList.add('hidden'); }
});
