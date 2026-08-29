/* =====================================================================
   Bug reports - the button, and the crash handler behind it
   ---------------------------------------------------------------------
   The ticket system already exists, but it needs an account, and hardly
   anybody makes one just to say that a button did nothing. So this file
   adds the two things that need neither an account nor patience:

     1. A report button in the gear menu. One field, send, done. Signed in
        it carries the user name so the answer can go out by ticket;
        signed out it is simply anonymous.

     2. A crash handler. Script errors go to the server on their own, so a
        fault that nobody bothers to report is still visible. This is the
        part that matters: the visitors who hit a bug mostly close the tab
        and are never heard from.

   What is sent, and nothing else: the message, the place in the code, the
   stack, which page, the version, the browser family and the language. No
   IP address is stored, no full user agent, nothing that follows anybody
   from one visit to the next. The sheet only goes along when the box in
   the dialog is ticked, and pictures are taken out of it first.

   Automatic reporting can be switched off in the dialog; the setting lives
   in the browser like the language does.

   Loaded by every page after its own script, so T, t() and esc() exist.
   ===================================================================== */
'use strict';

Object.assign(T.de, {
  rp_open: '🐞 Fehler melden',
  rp_title: 'Fehler melden',
  rp_intro: 'Etwas funktioniert nicht wie erwartet? Ein Satz genügt – was wolltest du tun, und was ist stattdessen passiert?',
  rp_label: 'Beschreibung',
  rp_lang: 'Bitte auf Deutsch oder Englisch schreiben – nur diese beiden Sprachen kann ich lesen. Ein Bericht, der erst durch einen Übersetzer muss, bleibt erfahrungsgemäß liegen.',
  rp_ph: 'Beispiel: Auf dem Schiffsbogen bleibt das Feld für die Frachtkapazität leer, sobald ich einen Umbau eintrage.',
  rp_sheet: 'Aktuellen Bogen mitschicken (ohne Bild)',
  rp_sheet_hint: 'Hilft enorm beim Nachstellen. Enthält die eingegebenen Werte und Texte des offenen Bogens.',
  rp_auto: 'Abstürze automatisch melden',
  rp_auto_hint: 'Schickt bei einem Skriptfehler Meldung, Stelle im Code, Seite und Version. Ohne IP-Adresse, ohne Kennung, nicht mit anderen Daten zusammengeführt.',
  rp_send: 'Absenden',
  rp_close: 'Schließen',
  rp_empty: 'Bitte beschreibe kurz, was passiert ist.',
  rp_sending: 'Wird gesendet …',
  rp_thanks: 'Angekommen – danke! Das hilft mehr, als du denkst.',
  rp_thanks_anon: 'Angekommen – danke! Eine Antwort ist auf diesem Weg nicht möglich; wer eine möchte, meldet sich an und öffnet ein Ticket.',
  rp_failed: 'Konnte nicht gesendet werden. Besteht eine Verbindung zum Server?',
  rp_offline: 'Diese Installation hat keinen Server, an den gemeldet werden könnte.',
  rp_sent_note: 'Gesendet werden: dein Text, die Seite ({page}), die Version ({version}), Browser und Sprache.',
  rp_ticket_hint: 'Für längere Rückfragen gibt es das Ticket-System im ☁-Menü – dort kann geantwortet werden.',
});
Object.assign(T.en, {
  rp_open: '🐞 Report a bug',
  rp_title: 'Report a bug',
  rp_intro: 'Something not working as expected? One sentence is enough - what were you trying to do, and what happened instead?',
  rp_label: 'Description',
  rp_lang: 'Please write in English or German - those are the two languages I can read. A report that has to go through a translator first tends to be left lying about.',
  rp_ph: 'For example: on the ship sheet the cargo capacity field goes blank as soon as I add a modification.',
  rp_sheet: 'Send the current sheet along (without the picture)',
  rp_sheet_hint: 'A huge help in reproducing it. Contains the values and texts of the sheet you have open.',
  rp_auto: 'Report crashes automatically',
  rp_auto_hint: 'On a script error this sends the message, the place in the code, the page and the version. No IP address, no identifier, not merged with anything else.',
  rp_send: 'Send',
  rp_close: 'Close',
  rp_empty: 'Please describe briefly what happened.',
  rp_sending: 'Sending …',
  rp_thanks: 'Received - thank you! This helps more than you think.',
  rp_thanks_anon: 'Received - thank you! No answer is possible this way; if you would like one, sign in and open a ticket.',
  rp_failed: 'Could not be sent. Is there a connection to the server?',
  rp_offline: 'This installation has no server to report to.',
  rp_sent_note: 'What is sent: your text, the page ({page}), the version ({version}), browser and language.',
  rp_ticket_hint: 'For a longer back and forth there is the ticket system in the ☁ menu - answers are possible there.',
});

const LS_REPORT_OFF = 'swd6_report_off';
const RP_MAX_AUTO = 6;          // per page load - a loop must not flood the server
const RP_SHEET_MAX = 200000;    // matches the cap on the server

let rpSent = 0;                 // how many automatic reports went out
let rpSeen = {};                // fingerprints already sent in this page load
let rpMsg = '';                 // message under the dialog
let rpBusy = false;

/* ---------------- what the server is told ---------------- */

/* The API address. Pages without config.js (a purely local copy, an older
   dice page) fall back to the folder next door, which is where it sits in
   every normal install. An empty apiUrl means online features are off - and
   then there is nothing to report to either. */
function rpUrl() {
  let u = 'api/index.php';
  try {
    if (typeof SITE_CONFIG !== 'undefined' && typeof SITE_CONFIG.apiUrl === 'string') u = SITE_CONFIG.apiUrl;
  } catch (e) { /* config.js not loaded */ }
  if (!u) return '';
  if (location.protocol === 'file:') return '';   // no server to talk to
  return u;
}

/* APP_VERSION is a top-level const in credits.js. Reading a const that has
   not been reached yet throws rather than being undefined, hence the catch. */
function rpVersion() {
  try { return (typeof APP_VERSION !== 'undefined') ? String(APP_VERSION) : ''; }
  catch (e) { return ''; }
}
function rpPage() {
  try { return (typeof HELP_PAGE !== 'undefined') ? String(HELP_PAGE) : ''; }
  catch (e) { return ''; }
}
function rpLang() {
  try { return (typeof LANG !== 'undefined') ? String(LANG) : ''; } catch (e) { return ''; }
}

/* Browser family and system, not the full user agent. Enough to reproduce a
   fault, too little to recognise anybody by. */
function rpBrowser() {
  const u = navigator.userAgent || '';
  const namen = [
    ['Firefox', /Firefox\/(\d+)/], ['Edge', /Edg\/(\d+)/], ['Opera', /OPR\/(\d+)/],
    ['Samsung', /SamsungBrowser\/(\d+)/], ['Chrome', /Chrome\/(\d+)/],
    ['Safari', /Version\/(\d+)[^)]*Safari/],
  ];
  let name = 'other', ver = '';
  for (const [n, re] of namen) {
    const m = u.match(re);
    if (m) { name = n; ver = m[1]; break; }
  }
  let os = 'other';
  if (/Windows/.test(u)) os = 'Windows';
  else if (/Android/.test(u)) os = 'Android';
  else if (/iPhone|iPad|iPod/.test(u)) os = 'iOS';
  else if (/Mac OS X/.test(u)) os = 'macOS';
  else if (/Linux/.test(u)) os = 'Linux';
  return (name + (ver ? ' ' + ver : '') + ' / ' + os).slice(0, 64);
}

/* The token, straight out of local storage. Reading it from online.js would
   mean this file could only work on pages that load online.js - and the dice
   page does not. Signed in the report can be answered, that is all it is for. */
function rpToken() {
  try { return (JSON.parse(localStorage.getItem('swd6_online')) || {}).token || ''; }
  catch (e) { return ''; }
}

function rpAutoOn() {
  try { return localStorage.getItem(LS_REPORT_OFF) !== '1'; } catch (e) { return true; }
}
function rpSetAuto(an) {
  try { localStorage.setItem(LS_REPORT_OFF, an ? '0' : '1'); } catch (e) {}
}

/* The open sheet, without anything that shows a face. Pictures are big and
   a portrait is no help in finding a bug, so every data URI and every field
   called portrait is dropped - at any depth, because tokens and ship sheets
   keep their images elsewhere than the character page does. */
function rpHasSheet() {
  try { return (typeof C !== 'undefined') && !!C && typeof C === 'object'; }
  catch (e) { return false; }
}
function rpSheet() {
  let quelle = null;
  try { quelle = (typeof C !== 'undefined') ? C : null; } catch (e) { return ''; }
  if (!quelle || typeof quelle !== 'object') return '';
  const putzen = (v, tiefe) => {
    if (tiefe > 12) return null;
    if (typeof v === 'string') return v.lastIndexOf('data:image/', 0) === 0 ? '' : v;
    if (Array.isArray(v)) return v.map(x => putzen(x, tiefe + 1));
    if (v && typeof v === 'object') {
      const o = {};
      Object.keys(v).forEach(k => {
        if (k === 'portrait' || k === '_cloudId' || k === '_rounds') return;
        o[k] = putzen(v[k], tiefe + 1);
      });
      return o;
    }
    return v;
  };
  try {
    const s = JSON.stringify(putzen(quelle, 0));
    return (s && s.length <= RP_SHEET_MAX) ? s : '';
  } catch (e) { return ''; }
}

/* Sending must never throw. Whatever goes wrong here, the page carries on -
   a reporter that breaks the page it is watching is worse than none.

   ueberleben says whether the request has to survive the page being closed.
   A crash often comes just as somebody gives up and navigates away, so those
   are sent with keepalive. The dialog is NOT: keepalive caps the body at
   64 KB, and a sheet sent along is bigger than that on its own - the send
   would fail for exactly the reports worth the most. */
async function rpSend(body, ueberleben) {
  const url = rpUrl();
  if (!url) return false;
  const headers = { 'Content-Type': 'application/json' };
  const tok = rpToken();
  if (tok) { headers['Authorization'] = 'Bearer ' + tok; headers['X-Auth-Token'] = tok; }
  const opt = { method: 'POST', headers, body: JSON.stringify(body) };
  if (ueberleben) opt.keepalive = true;
  const res = await fetch(url + '?action=report', opt);
  const data = await res.json();
  return !!(data && data.stored);
}

/* ---------------- the crash handler ---------------- */

/* Noise that says nothing about this app: errors from browser add-ons, the
   blank cross-origin "Script error." with no detail behind it, and the
   ResizeObserver warning every browser produces sooner or later. */
function rpNoise(msg, src, stack) {
  const alles = msg + ' ' + src + ' ' + stack;
  if (/extension:\/\//.test(alles)) return true;
  if (/^Script error\.?$/.test(msg.trim()) && !src) return true;
  if (/ResizeObserver loop/.test(msg)) return true;
  return false;
}

/* datei is the full address the browser reported. It is tested whole - an
   add-on gives itself away by its scheme, and that is exactly the part the
   short form below throws away - and only then shortened for storage: within
   this app the file name alone says where to look. */
function rpAuto(msg, datei, zeile, spalte, stack) {
  try {
    if (!rpAutoOn() || rpSent >= RP_MAX_AUTO) return;
    msg = String(msg || '').slice(0, 500);
    datei = String(datei || '');
    stack = String(stack || '').slice(0, 3000);
    if (!msg || rpNoise(msg, datei, stack)) return;
    const src = datei
      ? (datei.split('/').pop() + (zeile ? ':' + zeile + (spalte ? ':' + spalte : '') : '')).slice(0, 180)
      : '';
    const finger = msg + '|' + src;
    if (rpSeen[finger]) return;              // the same fault twice is one fault
    rpSeen[finger] = true;
    rpSent++;
    rpSend({
      kind: 'js', msg, src, stack,
      page: rpPage(), version: rpVersion(), ua: rpBrowser(), lang: rpLang(),
    }, true).catch(() => {});
  } catch (e) { /* the reporter stays quiet, always */ }
}

window.addEventListener('error', ev => {
  /* A failed image or script fires here too, but as a plain Event without a
     message. Those are for the network tab, not for this table. */
  if (!ev || !ev.message) return;
  rpAuto(ev.message, ev.filename, ev.lineno, ev.colno, ev.error && ev.error.stack);
});
window.addEventListener('unhandledrejection', ev => {
  if (!ev) return;
  const r = ev.reason;
  const msg = (r && r.message) ? r.message : String(r);
  rpAuto('Unhandled promise rejection: ' + msg, '', 0, 0, r && r.stack);
});

/* ---------------- the dialog ---------------- */

function reportModal() {
  let m = document.getElementById('reportModal');
  if (!m) {
    m = document.createElement('div');
    m.id = 'reportModal';
    m.className = 'modal-overlay no-print hidden';
    m.innerHTML = '<div class="modal-box" id="reportBox"></div>';
    document.body.appendChild(m);
    m.addEventListener('click', e => { if (e.target === m) closeReport(); });
  }
  return m;
}
function closeReport() {
  const m = document.getElementById('reportModal');
  if (m) m.classList.add('hidden');
}

window.renderReport = function renderReport() {
  const box = document.getElementById('reportBox');
  if (!box) return;
  const text = (document.getElementById('rpText') || {}).value || '';
  const hatBogen = rpHasSheet();
  const bogenAn = (document.getElementById('rpSheet') || {}).checked || false;
  const note = t('rp_sent_note')
    .replace('{page}', rpPage() || '–')
    .replace('{version}', rpVersion() || '–');
  box.innerHTML = `
    <div class="modal-head"><h2>${t('rp_title')}</h2>
      <button class="mini" data-report="close">✕</button></div>
    <p class="hint">${esc(t('rp_intro'))}</p>
    <p class="hint"><b>${esc(t('rp_lang'))}</b></p>
    <label>${t('rp_label')}</label>
    <textarea id="rpText" rows="5" placeholder="${esc(t('rp_ph'))}">${esc(text)}</textarea>
    ${hatBogen ? `<p><label><input type="checkbox" id="rpSheet" ${bogenAn ? 'checked' : ''}>
      ${esc(t('rp_sheet'))}</label><br><span class="hint">${esc(t('rp_sheet_hint'))}</span></p>` : ''}
    <p class="hint">${esc(note)}</p>
    ${rpMsg ? `<p class="hint"><b>${esc(rpMsg)}</b></p>` : ''}
    <p style="text-align:center; margin-top:10px">
      <button class="accent" data-report="send" ${rpBusy ? 'disabled' : ''}>${t('rp_send')}</button>
      <button data-report="close">${t('rp_close')}</button></p>
    <hr>
    <p><label><input type="checkbox" id="rpAuto" ${rpAutoOn() ? 'checked' : ''}>
      ${esc(t('rp_auto'))}</label><br><span class="hint">${esc(t('rp_auto_hint'))}</span></p>
    <p class="hint">${esc(t('rp_ticket_hint'))}</p>`;
};

function openReport() {
  rpMsg = '';
  reportModal().classList.remove('hidden');
  renderReport();
  const ta = document.getElementById('rpText');
  if (ta) ta.focus();
}

async function reportSchicken() {
  const ta = document.getElementById('rpText');
  const txt = ((ta && ta.value) || '').trim();
  if (!txt) { rpMsg = t('rp_empty'); renderReport(); return; }
  if (!rpUrl()) { rpMsg = t('rp_offline'); renderReport(); return; }
  const mitBogen = (document.getElementById('rpSheet') || {}).checked;
  rpBusy = true; rpMsg = t('rp_sending'); renderReport();
  let ok = false;
  try {
    ok = await rpSend({
      kind: 'fb', msg: txt,
      sheet: mitBogen ? rpSheet() : '',
      page: rpPage(), version: rpVersion(), ua: rpBrowser(), lang: rpLang(),
    }, false);
  } catch (e) { ok = false; }
  rpBusy = false;
  if (ok) {
    /* Emptied by hand: the box is redrawn from the field, so without this
       the sent text would come straight back. Looked up afresh - the
       "sending" redraw above replaced the element ta was pointing at, and
       clearing the old one would clear something no longer on the page. */
    const feld = document.getElementById('rpText');
    if (feld) feld.value = '';
    rpMsg = rpToken() ? t('rp_thanks') : t('rp_thanks_anon');
  } else {
    rpMsg = t('rp_failed');
  }
  renderReport();
}

document.addEventListener('click', e => {
  const el = e.target.closest('[data-report]');
  if (!el) return;
  if (el.dataset.report === 'close') closeReport();
  if (el.dataset.report === 'send') reportSchicken();
});
document.addEventListener('change', e => {
  if (e.target && e.target.id === 'rpAuto') rpSetAuto(e.target.checked);
});
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeReport(); });

(function wireReport() {
  const b = document.getElementById('btnReport');
  if (!b) return;
  /* Nothing to report to without a server - then the button would only
     promise something the page cannot keep. */
  if (!rpUrl()) { b.classList.add('hidden'); return; }
  b.addEventListener('click', () => {
    const om = document.getElementById('optionsMenu');
    if (om) om.classList.add('hidden');
    openReport();
  });
})();
