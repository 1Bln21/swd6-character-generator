/* =====================================================================
   Star Wars D6 - dice page
   ---------------------------------------------------------------------
   Stands on its own (with a small i18n of its own). Roll "xD+x" freely, or
   from the roll profiles of the loaded character or ship (localStorage
   swd6_roll_*). Wild Die by 2nd Edition R&E: explodes on a 6, complication
   on a 1.
   ===================================================================== */
'use strict';

const HELP_PAGE = 'dice';
const LS_LANG = 'swd6_lang';
let LANG = localStorage.getItem(LS_LANG) || 'en';
const T = {
  de: {
    title: 'Star Wars D6 – Würfel', subtitle: 'Würfelwurf',
    nav_char: 'Charaktere', nav_droid: 'Droiden', nav_ship: 'Schiffe / Fahrzeuge', nav_npc: 'NPCs', nav_dice: 'Würfeln', nav_vtt: 'Spieltisch',
    options: 'Optionen', opt_language: 'Sprache / Language', opt_theme: 'Darstellung',
    theme_dark: 'Dunkel', theme_light: 'Hell', theme_oled: 'OLED-Schwarz', theme_bespin: 'Bespin (warm)',
    free_roll: 'Freier Wurf', dice: 'Würfel (D)', pips: 'Pips (+)', modifier: 'Modifikator',
    wild_die: 'Wild Die (explodiert auf 6, Komplikation auf 1)',
    roll: '🎲 Würfeln', roll_again: 'Nochmal',
    from_char: 'Aus geladenem Charakter', from_ship: 'Aus geladenem Schiff',
    from_droid: 'Aus geladenem Droiden',
    no_droid: 'Kein Droide geladen.',
    no_char: 'Kein Charakter geladen. Öffne den Charakter-Generator, ein Wurf-Profil wird automatisch gespeichert.',
    no_ship: 'Kein Schiff geladen.',
    reload: '↻ Profile neu laden',
    result: 'Ergebnis', total: 'Summe', dice_shown: 'Würfel', wilddie: 'Wild Die',
    exploded: 'explodiert', complication: '⚠ Komplikation! (Wild Die = 1)',
    complication_alt: 'GM-Option: ohne Wild-Würfel und höchsten Würfel = {n}',
    history: 'Verlauf', clear: 'Leeren',
    attrs_skills: 'Attribute & Fertigkeiten', add_mod_hint: 'Der Modifikator wird auf Bogen-Würfe addiert (z. B. Feuerkontrolle des Schiffs).',
    from_gear: 'Ausrüstung (Würfel-Bonus)', gear_short: 'Ausr.',
    no_gear: 'Keine Ausrüstung mit Würfel-Bonus im Inventar des geladenen Charakters. Angehakte Gegenstände werden auf Skill-Würfe addiert.',
  },
  en: {
    title: 'Star Wars D6 – Dice', subtitle: 'Dice roller',
    nav_char: 'Characters', nav_droid: 'Droids', nav_ship: 'Ships / Vehicles', nav_npc: 'NPCs', nav_dice: 'Dice', nav_vtt: 'Table',
    options: 'Options', opt_language: 'Sprache / Language', opt_theme: 'Theme',
    theme_dark: 'Dark', theme_light: 'Light', theme_oled: 'OLED black', theme_bespin: 'Bespin (warm)',
    free_roll: 'Free roll', dice: 'Dice (D)', pips: 'Pips (+)', modifier: 'Modifier',
    wild_die: 'Wild Die (explodes on 6, complication on 1)',
    roll: '🎲 Roll', roll_again: 'Roll again',
    from_char: 'From loaded character', from_ship: 'From loaded ship',
    from_droid: 'From loaded droid',
    no_droid: 'No droid loaded.',
    no_char: 'No character loaded. Open the character generator; a roll profile is saved automatically.',
    no_ship: 'No ship loaded.',
    reload: '↻ Reload profiles',
    result: 'Result', total: 'Total', dice_shown: 'Dice', wilddie: 'Wild die',
    exploded: 'exploded', complication: '⚠ Complication! (Wild die = 1)',
    complication_alt: 'GM option: without the wild die and the highest die = {n}',
    history: 'History', clear: 'Clear',
    attrs_skills: 'Attributes & skills', add_mod_hint: 'The modifier is added to sheet rolls (e.g. a ship\'s fire control).',
    from_gear: 'Equipment (dice bonus)', gear_short: 'gear',
    no_gear: 'No equipment with a dice bonus in the loaded character\'s inventory. Checked items are added to skill rolls.',
  },
};
/* Missing key: let only harmless characters through. The dice page reads
   roll profiles out of localStorage, written there by the generators - and
   those may come from an imported sheet of somebody else's. The same guard
   as in genshared.js and app.js. */
function t(k) {
  if (T[LANG] && T[LANG][k] !== undefined) return T[LANG][k];
  if (T.en[k] !== undefined) return T.en[k];
  return String(k).replace(/[^\w.:-]/g, '');
}
function esc(s) {
  return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}
function fmtD(p) {
  if (p == null || isNaN(p)) return '—';
  const neg = p < 0; p = Math.abs(Math.round(p));
  const d = Math.floor(p / 3), r = p % 3;
  return (neg ? '-' : '') + d + 'D' + (r ? '+' + r : '');
}

/* ---------------- dice logic ---------------- */
function d6() { return 1 + Math.floor(Math.random() * 6); }
function rollPool(nDice, pips, wild) {
  nDice = Math.max(0, nDice | 0);
  const regCount = wild ? Math.max(0, nDice - 1) : nDice;
  const regs = [];
  for (let i = 0; i < regCount; i++) regs.push(d6());
  let wildVal = null, wildTotal = 0, exploded = 0, complication = false;
  if (wild && nDice >= 1) {
    let r = d6(); wildVal = r; wildTotal = r;
    if (r === 1) complication = true;
    while (r === 6) { r = d6(); wildTotal += r; exploded++; if (exploded > 100) break; }
  }
  const base = regs.reduce((a, b) => a + b, 0) + wildTotal + (pips | 0);
  let alt = base;
  if (complication) {
    const highest = regs.length ? Math.max.apply(null, regs) : 0;
    alt = base - 1 - highest;   // drop the wild 1 and the highest regular die
  }
  return { regs, wildVal, wildTotal, exploded, complication, pips: pips | 0, total: base, alt };
}
function pipsToDicePips(pips) { pips = Math.max(0, pips | 0); return { dice: Math.floor(pips / 3), pips: pips % 3 }; }

/* ---------------- state ---------------- */
let history = [];
function profile(key) { try { return JSON.parse(localStorage.getItem(key) || 'null'); } catch (e) { return null; } }
function modifier() { const el = document.getElementById('modPips'); return el ? (+el.value || 0) : 0; }
function equipBonus() {
  let sum = 0;
  document.querySelectorAll('#gearPools input[type=checkbox]:checked').forEach(c => { sum += (+c.dataset.pips || 0); });
  return sum;
}

function doRoll(nDice, pips, label) {
  const wild = document.getElementById('wildToggle').checked;
  const r = rollPool(nDice, pips, wild);
  r.label = label || (fmtD(nDice * 3 + pips));
  history.unshift(r);
  if (history.length > 20) history.pop();
  renderResult();
}
function rollFromPips(totalPips, label) {
  const mod = modifier(), eq = equipBonus();
  const extra = mod + eq;
  const dp = pipsToDicePips(totalPips + extra);
  doRoll(dp.dice, dp.pips, label + (eq ? ` +${fmtD(eq)} ${t('gear_short')}` : '') + (mod ? ` ${mod > 0 ? '+' : ''}${mod}` : ''));
}

/* ---------------- Rendering ---------------- */
function poolButtons(prof) {
  if (!prof || !prof.entries || !prof.entries.length) return '';
  return prof.entries.map(e =>
    `<button class="mini roll-pool" data-pips="${e.pips}" data-label="${esc(e.label)}">${esc(e.label)} <b>${fmtD(e.pips)}</b></button>`).join(' ');
}
function renderResult() {
  const box = document.getElementById('result');
  if (!box) return;
  if (!history.length) { box.innerHTML = `<p class="hint">—</p>`; return; }
  const r = history[0];
  const diceStr = r.regs.map(x => `<span class="die ${x === 6 ? 'six' : x === 1 ? 'one' : ''}">${x}</span>`).join('');
  const wildStr = r.wildVal != null
    ? `<span class="die wild ${r.wildVal === 6 ? 'six' : r.wildVal === 1 ? 'one' : ''}">${r.wildVal}</span>${r.exploded ? ` <span class="hint">(${t('exploded')} ×${r.exploded} → ${r.wildTotal})</span>` : ''}`
    : '';
  box.innerHTML = `
    <div class="roll-head">${esc(r.label)}</div>
    <div class="roll-total">${r.total}</div>
    <div class="roll-dice">${diceStr} ${wildStr}${r.pips ? ` <span class="pips">+${r.pips}</span>` : ''}</div>
    ${r.complication ? `<div class="roll-warn">${t('complication')}<br><span class="hint">${t('complication_alt').replace('{n}', r.alt)}</span></div>` : ''}
    <h3>${t('history')} <button class="mini" id="clearHist">${t('clear')}</button></h3>
    <table class="list">${history.map(h =>
      `<tr><td>${esc(h.label)}</td><td class="num"><b>${h.total}</b></td><td class="hint">${h.wildVal != null ? t('wilddie') + ' ' + h.wildVal : ''}${h.complication ? ' ⚠' : ''}</td></tr>`).join('')}</table>`;
}
function render() {
  document.documentElement.lang = LANG;
  document.title = t('title');
  document.querySelectorAll('[data-i18n]').forEach(el => { el.innerHTML = t(el.dataset.i18n); });
  document.querySelectorAll('input[name="langOpt"]').forEach(r => r.checked = (r.value === LANG));
  const ch = profile('swd6_roll_char'), sh = profile('swd6_roll_ship'),
        dr = profile('swd6_roll_droid');
  document.getElementById('charName').textContent = ch && ch.name ? ' – ' + ch.name : '';
  document.getElementById('shipName').textContent = sh && sh.name ? ' – ' + sh.name : '';
  document.getElementById('droidName').textContent = dr && dr.name ? ' – ' + dr.name : '';
  document.getElementById('charPools').innerHTML = poolButtons(ch) || `<p class="hint">${t('no_char')}</p>`;
  document.getElementById('shipPools').innerHTML = poolButtons(sh) || `<p class="hint">${t('no_ship')}</p>`;
  document.getElementById('droidPools').innerHTML = poolButtons(dr) || `<p class="hint">${t('no_droid')}</p>`;
  /* Offer the equipment from both sheets - the player ticks what counts now. */
  const gear = ((ch && ch.gear) || []).concat((dr && dr.gear) || [])
    .filter((g, i, a) => a.findIndex(x => x.label === g.label && x.pips === g.pips) === i);
  document.getElementById('gearPools').innerHTML = gear.length
    ? gear.map(g => `<label class="opt-row gear-row" style="text-transform:none" title="${esc(g.hint || '')}">
        <input type="checkbox" data-pips="${g.pips}"> ${esc(g.label)} <b>+${fmtD(g.pips)}</b></label>`).join('')
    : `<p class="hint">${t('no_gear')}</p>`;
  renderResult();
}

/* ---------------- wiring ---------------- */
document.addEventListener('DOMContentLoaded', () => {
  render();
  document.getElementById('btnRoll').addEventListener('click', () => {
    const nd = +document.getElementById('freeDice').value || 0;
    const pp = +document.getElementById('freePips').value || 0;
    doRoll(nd, pp, fmtD(nd * 3 + pp));
  });
  document.getElementById('btnReload').addEventListener('click', render);
  document.body.addEventListener('click', e => {
    const b = e.target.closest('.roll-pool');
    if (b) { rollFromPips(+b.dataset.pips, b.dataset.label); return; }
    if (e.target.id === 'clearHist') { history = []; renderResult(); return; }
  });
  document.querySelectorAll('input[name="langOpt"]').forEach(r =>
    r.addEventListener('change', () => {
      LANG = r.value;
      localStorage.setItem(LS_LANG, LANG);
      render();
  /* Credits and the legal links come from their own files and are not
     covered by data-i18n - they have to be redrawn by hand, the same way
     genshared.js does it for the generator pages. */
  if (typeof renderLegal === 'function') renderLegal();
  const am = document.getElementById('aboutModal');
  if (am && !am.classList.contains('hidden') && typeof renderAbout === 'function') renderAbout();
  /* The help follows the language just like the credits do. */
  const hm = document.getElementById('helpModal');
  if (hm && !hm.classList.contains('hidden') && typeof renderHelp === 'function') renderHelp();
    }));
  const om = document.getElementById('optionsMenu'), ob = document.getElementById('btnOptions');
  if (ob) ob.addEventListener('click', e => { e.stopPropagation(); om.classList.toggle('hidden'); });
  if (om) om.addEventListener('click', e => e.stopPropagation());
  document.addEventListener('click', () => om && om.classList.add('hidden'));
});
