/* =====================================================================
   Star Wars D6 generators - shared core for droid.html / ship.html
   ---------------------------------------------------------------------
   Holds the i18n plumbing, helpers and local storage management.
   The pages define: PAGE_DOC_KIND, LS_CURRENT, LS_SAVED, emptyDoc(), C,
   migrate(), renderTab()/renderAll(), renderSheet() - which makes them
   compatible with online.js and legal.js (the same interface as app.js).
   ===================================================================== */
'use strict';

const LS_LANG = 'swd6_lang';
/* Default language is English: the project is promoted in the English
   speaking SWD6 communities. Anyone who has switched to German once keeps
   that choice, it comes back out of localStorage. */
let LANG = localStorage.getItem(LS_LANG) || 'en';

/* Base dictionary - pages and modules add to it via Object.assign */
const T = {
de: {
  options: 'Optionen', opt_language: 'Sprache / Language',
  opt_theme: 'Darstellung', theme_dark: 'Dunkel', theme_light: 'Hell',
  theme_oled: 'OLED-Schwarz', theme_bespin: 'Bespin (warm)',
  btn_load: 'Laden', btn_save: '💾 Speichern', btn_new: 'Neu',
  btn_export: '⬇ Export', btn_import: '⬆ Import', btn_print: '🖨 Drucken',
  btn_pdf: '📄 PDF exportieren', pdf_working: 'PDF wird erstellt …',
  pdf_lib_missing: 'PDF-Bibliotheken nicht geladen (jspdf.min.js / html2canvas.min.js fehlen im Upload).',
  pdf_error: 'PDF-Export fehlgeschlagen: ',
  pdf_empty: 'Der Bogen enthaelt nichts zum Exportieren.',
  nav_char: 'Charaktere', nav_droid: 'Droiden', nav_ship: 'Schiffe / Fahrzeuge', nav_npc: 'NPCs', nav_dice: 'Würfeln', nav_vtt: 'Spieltisch',
  saved_placeholder: '– Gespeichert –',
  saved_ok: '✔ Gespeichert',
  prompt_doc_name: 'Name zum Speichern:',
  alert_select_saved: 'Bitte zuerst einen gespeicherten Eintrag auswählen.',
  confirm_delete: '„{name}“ wirklich löschen?',
  confirm_new: 'Neu beginnen? (Nicht gespeicherte Änderungen gehen verloren)',
  import_failed: 'Import fehlgeschlagen: ',
  import_invalid: 'Keine gültige Datei für diese Seite',
  yes: 'Ja', no: 'Nein', none_dash: '– keine –', none_one: '– keiner –',
  name: 'Name', cost: 'Preis', avail: 'Verf.', qty: 'Anzahl', sum: 'Summe',
  /* catalogue eras - the keys live in PDF_ERAS (pdfdata-*.js) */
  era_label: 'Ära', era_all: 'Alle Ären', era_universal: 'zeitlos',
  era_old_republic: 'Alte Republik', era_rise_empire: 'Aufstieg des Imperiums',
  era_rebellion: 'Rebellion', era_new_republic: 'Neue Republik / Legacy',
  note: 'Notiz', notes: 'Notizen', add_entry: '+ Eintrag', item: 'Gegenstand',
  skill: 'Skill', damage: 'Schaden', difficulty: 'Schwierigkeit', special: 'Besonderes',
  weapon: 'Waffe', left: 'Übrig', total: 'Gesamt', remove: 'Entfernen',
  page: 'Seite', sheet_footer: 'Star Wars D6 · 2nd Edition',
  print_pdf: '🖨 Drucken / Als PDF speichern',
  sheet_preview: 'Vorschau des Bogens. <b>Drucken / PDF:</b> Knopf unten – im Druckdialog „Als PDF speichern“ wählen.',
  portrait_import: '📷 Bild importieren', portrait_remove: 'Entfernen',
  portrait_placeholder: 'Kein Bild', portrait_error: 'Bild konnte nicht geladen werden.',
  portrait_url: 'https://… Bildadresse',
  portrait_url_btn: 'Holen',
  portrait_url_bad: 'Das ist keine gültige http- oder https-Adresse.',
  portrait_url_error: 'Das Bild ließ sich von dort nicht holen. Viele Seiten erlauben das Auslesen durch andere Seiten nicht — dann hilft nur, das Bild herunterzuladen und als Datei zu wählen.',
  portrait_url_hint: 'Das Bild wird einmal geholt und im Bogen gespeichert, die Adresse nicht. So ruft auch beim Weitergeben niemand die fremde Seite auf, und es bleibt erhalten, wenn die Adresse verschwindet.',
  portrait_hint: 'JPG/PNG/WebP – wird automatisch verkleinert. Datei hierher ziehen oder auf den Rahmen klicken. Mit ↺ ↻ drehen.',
  portrait_rotate: 'Um 90° drehen',
},
en: {
  options: 'Options', opt_language: 'Sprache / Language',
  opt_theme: 'Theme', theme_dark: 'Dark', theme_light: 'Light',
  theme_oled: 'OLED black', theme_bespin: 'Bespin (warm)',
  btn_load: 'Load', btn_save: '💾 Save', btn_new: 'New',
  btn_export: '⬇ Export', btn_import: '⬆ Import', btn_print: '🖨 Print',
  btn_pdf: '📄 Export PDF', pdf_working: 'Creating PDF …',
  pdf_lib_missing: 'PDF libraries not loaded (jspdf.min.js / html2canvas.min.js missing from the upload).',
  pdf_error: 'PDF export failed: ',
  pdf_empty: 'The sheet has nothing to export.',
  nav_char: 'Characters', nav_droid: 'Droids', nav_ship: 'Ships / Vehicles', nav_npc: 'NPCs', nav_dice: 'Dice', nav_vtt: 'Table',
  saved_placeholder: '– Saved –',
  saved_ok: '✔ Saved',
  prompt_doc_name: 'Name for saving:',
  alert_select_saved: 'Please select a saved entry first.',
  confirm_delete: 'Really delete "{name}"?',
  confirm_new: 'Start over? (Unsaved changes will be lost)',
  import_failed: 'Import failed: ',
  import_invalid: 'Not a valid file for this page',
  yes: 'Yes', no: 'No', none_dash: '– none –', none_one: '– none –',
  name: 'Name', cost: 'Cost', avail: 'Avail.', qty: 'Qty', sum: 'Total',
  /* Catalog eras – the keys live in PDF_ERAS (pdfdata-*.js) */
  era_label: 'Era', era_all: 'All eras', era_universal: 'timeless',
  era_old_republic: 'Old Republic', era_rise_empire: 'Rise of the Empire',
  era_rebellion: 'Rebellion', era_new_republic: 'New Republic / Legacy',
  note: 'Note', notes: 'Notes', add_entry: '+ Add entry', item: 'Item',
  skill: 'Skill', damage: 'Damage', difficulty: 'Difficulty', special: 'Special',
  weapon: 'Weapon', left: 'Left', total: 'Total', remove: 'Remove',
  page: 'Page', sheet_footer: 'Star Wars D6 · 2nd Edition',
  print_pdf: '🖨 Print / Save as PDF',
  sheet_preview: 'Preview of the sheet. <b>Print / PDF:</b> button below – choose "Save as PDF" in the print dialog.',
  portrait_import: '📷 Import image', portrait_remove: 'Remove',
  portrait_placeholder: 'No image', portrait_error: 'Could not load the image.',
  portrait_url: 'https://… picture address',
  portrait_url_btn: 'Fetch',
  portrait_url_bad: 'That is not a valid http or https address.',
  portrait_url_error: 'The picture could not be fetched from there. Many sites do not allow other sites to read their images — then the only way is to download it and pick it as a file.',
  portrait_url_hint: 'The picture is fetched once and stored in the sheet, the address is not. That way nobody calls the other site when the sheet is passed on, and it survives the address going away.',
  portrait_hint: 'JPG/PNG/WebP – resized automatically. Drag a file here or click the frame. Rotate with ↺ ↻.',
  portrait_rotate: 'Rotate 90°',
},
};
function t(k) {
  const v = T[LANG] && T[LANG][k];
  if (v !== undefined) return v;
  /* With a key missing, show the English version rather than the German
     one - English is the app's default language. */
  if (T.en && T.en[k] !== undefined) return T.en[k];
  if (T.de[k] !== undefined) return T.de[k];
  /* When the key is missing entirely, the key itself is shown. Many keys
     are built dynamically ("fac_" + npc.faction, "era_" + setup.shipEra) and
     the dynamic part can come out of somebody else's document - a sheet
     imported or approved in a round. Results of t() go into innerHTML raw,
     so only harmless characters may pass here. A missing key is a bug in any
     case; shown mangled, it is harmless. */
  return String(k).replace(/[^\w.:-]/g, '');
}
function tCat(cat) { const v = t('cat_' + cat); return v === 'cat_' + cat ? cat : v; }
function applyStaticI18n() {
  document.querySelectorAll('[data-i18n]').forEach(el => { el.innerHTML = t(el.dataset.i18n); });
  document.querySelectorAll('input[name="langOpt"]').forEach(r => r.checked = (r.value === LANG));
}
function setLang(l) {
  LANG = l;
  localStorage.setItem(LS_LANG, l);
  document.documentElement.lang = l;
  document.title = t('title');
  applyStaticI18n();
  if (typeof renderLegal === 'function') renderLegal();
  /* carry an open credits dialog along */
  const am = document.getElementById('aboutModal');
  if (am && !am.classList.contains('hidden') && typeof renderAbout === 'function') renderAbout();
  renderAll();
}

/* ---------------- helpers ---------------- */
function esc(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}
function fmtD(p) {
  if (p == null || isNaN(p)) return '—';
  const neg = p < 0; p = Math.abs(Math.round(p));
  const d = Math.floor(p / 3), r = p % 3;
  return (neg ? '-' : '') + d + 'D' + (r ? '+' + r : '');
}
function fmtCr(n) { return (Math.round(n * 100) / 100).toLocaleString(LANG === 'de' ? 'de-DE' : 'en-US'); }
function getPath(obj, path) { return path.split('.').reduce((o, k) => (o == null ? o : o[k]), obj); }
function setPath(obj, path, val) {
  const parts = path.split('.'); let o = obj;
  for (let i = 0; i < parts.length - 1; i++) o = o[parts[i]];
  o[parts[parts.length - 1]] = val;
}
function inputT(path, val, extra) {
  return `<input type="text" autocomplete="off" data-bind="${path}" value="${esc(val)}" ${extra || ''}>`;
}
function inputN(path, val, extra) {
  return `<input type="number" autocomplete="off" data-bind="${path}" data-type="num" value="${esc(val == null ? '' : val)}" ${extra || ''}>`;
}
function stepper(act, params, minus, plus) {
  return `<span class="stepper">
    <button class="mini" data-act="${act}" data-dir="-1" ${params} ${minus ? '' : 'disabled'}>−</button>
    <button class="mini" data-act="${act}" data-dir="1" ${params} ${plus ? '' : 'disabled'}>+</button>
  </span>`;
}

/* ---------------- picture import (portrait) ---------------- */
function importPortrait(file) {
  if (!file || !file.type || !file.type.startsWith('image/')) return;
  const rd = new FileReader();
  rd.onload = () => {
    const img = new Image();
    img.onload = () => {
      const maxW = 480, maxH = 600;
      const scale = Math.min(1, maxW / img.width, maxH / img.height);
      const w = Math.max(1, Math.round(img.width * scale));
      const h = Math.max(1, Math.round(img.height * scale));
      const cv = document.createElement('canvas');
      cv.width = w; cv.height = h;
      const ctx = cv.getContext('2d');
      ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, w, h);
      ctx.drawImage(img, 0, 0, w, h);
      let q = 0.85, out = cv.toDataURL('image/jpeg', q);
      while (out.length > 250 * 1024 && q > 0.4) { q -= 0.15; out = cv.toDataURL('image/jpeg', q); }
      C.info.portrait = out;
      update();
    };
    img.onerror = () => alert(t('portrait_error'));
    img.src = rd.result;
  };
  rd.readAsDataURL(file);
}

/* Fetch a picture from an address. Deliberately fetch() and not
   `img.src = url`: a picture drawn onto a canvas from another origin taints
   it, and toDataURL() then throws - the very step the import needs. So the
   bytes are fetched, which needs the other side to allow it (CORS). Where
   it does not, there is a clear message instead of a broken picture.

   The address itself is NOT stored. The picture is embedded exactly like a
   file import, so a sheet passed on to somebody else never calls a stranger's
   server - and it keeps working when that address goes away. */
function portraitFromUrl(url) {
  url = String(url || '').trim();
  if (!/^https?:\/\//i.test(url)) { alert(t('portrait_url_bad')); return; }
  fetch(url, { mode: 'cors' })
    .then(res => { if (!res.ok) throw new Error('HTTP ' + res.status); return res.blob(); })
    .then(blob => {
      if (!blob.type || !blob.type.indexOf) throw new Error('no type');
      if (blob.type.indexOf('image/') !== 0) throw new Error('not an image');
      /* A Blob carries .type just like a File, so the existing import path
         takes it unchanged - scaling, quality and the size cap included. */
      importPortrait(blob);
    })
    .catch(() => alert(t('portrait_url_error')));
}
/* Rotate an imported picture by 90 degrees (dir < 0 = anticlockwise). */
function rotatePortrait(dir) {
  if (!C.info.portrait) return;
  const img = new Image();
  img.onload = () => {
    const cv = document.createElement('canvas');
    cv.width = img.height; cv.height = img.width;
    const ctx = cv.getContext('2d');
    ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, cv.width, cv.height);
    ctx.translate(cv.width / 2, cv.height / 2);
    ctx.rotate((dir < 0 ? -90 : 90) * Math.PI / 180);
    ctx.drawImage(img, -img.width / 2, -img.height / 2);
    C.info.portrait = cv.toDataURL('image/jpeg', 0.85);
    update();
  };
  img.onerror = () => alert(t('portrait_error'));
  img.src = C.info.portrait;
}
function portraitCardHtml(title) {
  return `
    <div class="card">
      <h2>${title}</h2>
      <div style="display:flex; gap:14px; align-items:flex-start; flex-wrap:wrap">
        <div class="portrait-drop" data-portrait-drop="1" title="${esc(t('portrait_import'))}">
          ${C.info.portrait
            ? `<img src="${C.info.portrait}" alt="Portrait">`
            : `<div class="portrait-empty">${t('portrait_placeholder')}</div>`}
        </div>
        <div style="flex:1; min-width:180px">
          <p>
            <label class="filebtn">${t('portrait_import')}<input type="file" id="portraitFile" accept="image/*" hidden></label>
            ${C.info.portrait ? ` <button class="mini" data-act="portraitRotL" title="${t('portrait_rotate')}">↺</button>
              <button class="mini" data-act="portraitRotR" title="${t('portrait_rotate')}">↻</button>
              <button class="mini danger" data-act="portraitRemove">× ${t('portrait_remove')}</button>` : ''}
          </p>
          <p class="portrait-url">
            <input type="url" id="portraitUrl" placeholder="${esc(t('portrait_url'))}">
            <button class="mini" data-act="portraitUrl">${t('portrait_url_btn')}</button>
          </p>
          <p class="hint">${t('portrait_hint')}</p>
          <p class="hint">${t('portrait_url_hint')}</p>
        </div>
      </div>
    </div>`;
}

/* ---------------- refresh & autosave ---------------- */
let activeTab = null;
let saveTimer = null;
function autosave() {
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    try { localStorage.setItem(LS_CURRENT, JSON.stringify(C)); } catch (e) {}
    if (typeof buildRollProfile === 'function') buildRollProfile();   // roll profile (ship/droid)
  }, 300);
}
function update(tab) { autosave(); renderTab(tab || activeTab); }
function renderAll() { renderTab(activeTab); refreshSavedList(); }

/* ---------------- local storage management ---------------- */
function getSaved() {
  try { return JSON.parse(localStorage.getItem(LS_SAVED)) || {}; } catch (e) { return {}; }
}
function setSaved(obj) { localStorage.setItem(LS_SAVED, JSON.stringify(obj)); }
function refreshSavedList() {
  const sel = document.getElementById('savedCharSelect');
  if (!sel) return;
  const saved = getSaved();
  const names = Object.keys(saved).sort((a, b) => a.localeCompare(b, LANG));
  const cur = sel.value;
  sel.innerHTML = `<option value="">${t('saved_placeholder')}</option>` +
    names.map(n => `<option value="${esc(n)}">${esc(n)}</option>`).join('');
  if (names.includes(cur)) sel.value = cur;
}
function saveDocLocal() {
  let name = C.info.name && C.info.name.trim();
  if (!name) name = prompt(t('prompt_doc_name'));
  if (!name) return;
  C.info.name = name;
  const saved = getSaved();
  saved[name] = JSON.parse(JSON.stringify(C));
  saved[name]._saved = new Date().toISOString();
  setSaved(saved);
  refreshSavedList();
  document.getElementById('savedCharSelect').value = name;
  flashButton('btnSave', t('saved_ok'));
  autosave();
}
function loadDocLocal() {
  const sel = document.getElementById('savedCharSelect');
  if (!sel.value) { alert(t('alert_select_saved')); return; }
  const saved = getSaved();
  if (!saved[sel.value]) return;
  C = migrate(saved[sel.value]);
  renderAll(); autosave();
}
function deleteDocLocal() {
  const sel = document.getElementById('savedCharSelect');
  if (!sel.value) { alert(t('alert_select_saved')); return; }
  if (!confirm(t('confirm_delete').replace('{name}', sel.value))) return;
  const saved = getSaved();
  delete saved[sel.value];
  setSaved(saved); refreshSavedList();
}
function newDoc() {
  if (!confirm(t('confirm_new'))) return;
  C = emptyDoc();
  renderAll(); autosave();
}
function exportDoc() {
  const name = (C.info.name || PAGE_DOC_KIND).replace(/[^\wäöüÄÖÜß \-]/g, '_');
  const blob = new Blob([JSON.stringify(C, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = name + '.swd6-' + PAGE_DOC_KIND + '.json';
  a.click();
  URL.revokeObjectURL(a.href);
}
function importDoc(file) {
  const rd = new FileReader();
  rd.onload = () => {
    try {
      const obj = JSON.parse(rd.result);
      if (!obj.info || (obj.kind && obj.kind !== PAGE_DOC_KIND)) throw new Error(t('import_invalid'));
      C = migrate(obj);
      renderAll(); autosave();
    } catch (e) { alert(t('import_failed') + e.message); }
  };
  rd.readAsText(file);
}
function flashButton(id, text) {
  const b = document.getElementById(id);
  if (!b) return;
  const old = b.textContent;
  b.textContent = text;
  setTimeout(() => b.textContent = old, 1300);
}
/* online.js expects this function - droids and ships have no species bonus
   skills, so it is deliberately empty. */
function applySpeciesBonusSkills() {}

/* ---------------- event wiring (shared) ---------------- */
function wireCommonEvents() {
  document.getElementById('tabs').addEventListener('click', e => {
    const btn = e.target.closest('button[data-tab]');
    if (!btn) return;
    activeTab = btn.dataset.tab;
    document.querySelectorAll('#tabs button').forEach(b => b.classList.toggle('active', b === btn));
    document.querySelectorAll('.tab').forEach(tb => tb.classList.toggle('active', tb.id === 'tab-' + activeTab));
    renderTab(activeTab);
  });

  const content = document.getElementById('content');
  content.addEventListener('click', e => {
    const pd = e.target.closest('[data-portrait-drop]');
    if (pd) { const fi = document.getElementById('portraitFile'); if (fi) fi.click(); return; }
    const el = e.target.closest('[data-act]');
    if (!el) return;
    if (el.dataset.act === 'portraitRemove') { C.info.portrait = ''; update(); return; }
    if (el.dataset.act === 'portraitUrl') { portraitFromUrl((document.getElementById('portraitUrl') || {}).value); return; }
    if (el.dataset.act === 'portraitRotL') { rotatePortrait(-1); return; }
    if (el.dataset.act === 'portraitRotR') { rotatePortrait(1); return; }
    if (el.dataset.act === 'print') { renderSheet(); window.print(); return; }
    if (typeof pageAction === 'function') pageAction(el);
  });
  content.addEventListener('dragover', e => {
    if (e.target.closest('[data-portrait-drop]')) e.preventDefault();
  });
  content.addEventListener('drop', e => {
    const z = e.target.closest('[data-portrait-drop]');
    if (!z) return;
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) importPortrait(e.dataTransfer.files[0]);
  });
  content.addEventListener('change', e => {
    const el = e.target;
    if (el.id === 'portraitFile') {
      if (el.files && el.files[0]) importPortrait(el.files[0]);
      el.value = '';
      return;
    }
    if (typeof pageChange === 'function' && pageChange(el)) return;
    if (el.dataset.bind) {
      let val = el.value;
      if (el.dataset.type === 'num') val = el.value === '' ? null : +el.value;
      if (el.dataset.type === 'bool') val = el.value === 'true';
      setPath(C, el.dataset.bind, val);
      if (el.dataset.rerender || el.tagName === 'SELECT') update();
      else autosave();
    }
  });
  content.addEventListener('input', e => {
    const el = e.target;
    /* Search fields should filter while typing, not only on blur */
    const SEARCH_IDS = ['tplSearch', 'wpnSearch', 'pdfsearch'];
    if ((el.dataset.pdfsearch != null || SEARCH_IDS.includes(el.id)) &&
        typeof pageChange === 'function') {
      pageChange(el);
      return;
    }
    if (!el.dataset.bind) return;
    if (el.dataset.rerender || el.dataset.type === 'num' || el.tagName === 'SELECT') return;
    setPath(C, el.dataset.bind, el.value);
    autosave();
  });

  document.getElementById('btnSave').addEventListener('click', saveDocLocal);
  document.getElementById('btnLoad').addEventListener('click', loadDocLocal);
  document.getElementById('btnDelete').addEventListener('click', deleteDocLocal);
  document.getElementById('btnNew').addEventListener('click', newDoc);
  document.getElementById('btnExport').addEventListener('click', exportDoc);
  document.getElementById('btnImport').addEventListener('click', () => document.getElementById('importFile').click());
  document.getElementById('importFile').addEventListener('change', e => {
    if (e.target.files[0]) importDoc(e.target.files[0]);
    e.target.value = '';
  });
  document.getElementById('btnPrint').addEventListener('click', () => { renderSheet(); window.print(); });
  window.addEventListener('beforeprint', renderSheet);

  const optionsMenuEl = document.getElementById('optionsMenu');
  document.getElementById('btnOptions').addEventListener('click', e => {
    e.stopPropagation();
    optionsMenuEl.classList.toggle('hidden');
  });
  optionsMenuEl.addEventListener('click', e => e.stopPropagation());
  document.addEventListener('click', () => optionsMenuEl.classList.add('hidden'));
  document.querySelectorAll('input[name="langOpt"]').forEach(r => {
    r.addEventListener('change', () => { setLang(r.value); });
  });
}
/* legal.js reaches for a global variable named "optionsMenu" */
var optionsMenu = null;
document.addEventListener('DOMContentLoaded', () => { optionsMenu = document.getElementById('optionsMenu'); });

/* ---------------- startup (called by the page) ---------------- */
function initPage(defaultTab) {
  optionsMenu = document.getElementById('optionsMenu');
  activeTab = defaultTab;
  try {
    const cur = localStorage.getItem(LS_CURRENT);
    if (cur) C = migrate(JSON.parse(cur));
  } catch (e) { C = emptyDoc(); }
  document.documentElement.lang = LANG;
  document.title = t('title');
  applyStaticI18n();
  wireCommonEvents();
  renderAll();
  /* Password managers (Chrome, Edge AND Firefox) mark the input fields as
     login candidates once, during the form analysis that follows loading -
     even with autocomplete="off". Re-rendering once after the first paint
     replaces them with fresh elements that escape it (as switching tabs by
     hand does). */
  requestAnimationFrame(() => requestAnimationFrame(() => renderTab(activeTab)));
}

/* Fallback in case skills-de.js was not loaded (after an incomplete
   upload, say): the English names then stay in place instead of the page
   dying with a ReferenceError. */
if (typeof skillName !== 'function') {
  window.skillName = function (en) { return en; };
}
