/* =====================================================================
   Star Wars D6 – Droiden-Generator (Droid Generator v1-3 von C. Gibboney)
   25D-Pool für Attribute + Fertigkeiten + Modifikationen, Degrees mit
   attributsabhängigen Steigerungskosten, Modifikations-Katalog,
   Ausrüstung/Waffen aus den Charakter-Katalogen, Druckbogen.
   Benötigt genshared.js + gendata.js (DROID_DATA) + data.js (DATA).
   ===================================================================== */
'use strict';

const PAGE_DOC_KIND = 'droid';
const LS_CURRENT = 'swd6_droid_current';
const LS_SAVED = 'swd6_droids';

const ATTRS = [
  { key: 'dex', name: 'Dexterity' },
  { key: 'kno', name: 'Knowledge' },
  { key: 'mec', name: 'Mechanical' },
  { key: 'per', name: 'Perception' },
  { key: 'str', name: 'Strength' },
  { key: 'tec', name: 'Technical' },
];

/* ---------------- Übersetzungen ---------------- */
Object.assign(T.de, {
  title: 'Star Wars D6 – Droiden-Generator',
  subtitle: 'Droiden-Generator',
  footer: 'Basiert auf „Droid Generator v1-3“ von Chance Gibboney · Star Wars: The Roleplaying Game, 2nd Edition – West End Games D6-System',
  doc_one: 'Droide', doc_plural: 'Droiden',
  tab_model: 'Modell', tab_attrs: 'Attribute', tab_skills: 'Fertigkeiten',
  tab_mods: 'Modifikationen', tab_gear: 'Ausrüstung', tab_sheet: 'Droidenbogen',
  dr_model: 'Modell-Daten', dr_name: 'Bezeichnung / Name', dr_player: 'Spielername',
  dr_degree: 'Degree (Klasse)', dr_manufacturer: 'Hersteller',
  dr_locomotion: 'Fortbewegung', dr_scale: 'Größenklasse', dr_move: 'Move (m)',
  dr_matrix: 'Persönlichkeits-Matrix', dr_height: 'Höhe (m)', dr_weight: 'Gewicht (kg)',
  dr_matrix_hint: 'Steht in keiner Quelle und wird nicht aus der Vorlage übernommen – bitte selbst wählen und vom Spielleiter absegnen lassen. Ein Lastenheber ist „Simple“, ein Taktik- oder Protokolldroide deutlich mehr.',
  dr_quote: 'Zitat', dr_fp: 'Machtpunkte',
  dr_desc: 'Beschreibung', dr_history: 'Kurze Geschichte',
  dr_personality: 'Persönlichkeit', dr_objectives: 'Motivation / Ziele',
  dr_portrait: 'Droidenbild',
  dr_db: 'Datenbank-Fertigkeiten (fest einprogrammiert)',
  dr_db_hint: 'Bis zu zwei fest verdrahtete Wissens-/Fertigkeits-Datenbanken. Der Bonus kostet Pips aus dem Startpool.',
  dr_db_skill: 'Datenbank-Skill', dr_db_level: 'Bonus',
  dr_pool: 'Startpool', dr_pool_hint: 'Der Startpool (Standard 25D = 75 Pips) wird auf Attribute, Fertigkeiten UND Modifikationen aufgeteilt – gut einteilen!',
  dr_override: 'Override Startwürfel (D):',
  dr_attrs_heading: 'Attribute (Start je 1D, Maximum 13D · +/− in Pips)',
  dr_degree_hint: 'Der Degree bestimmt die CP-Steigerungskosten je Attribut (Multiplikator in %): ',
  dr_cp_cost: 'CP-Kauf',
  cp_left: 'CP übrig',
  dr_skills_hint: 'Fertigkeiten kosten 1 Pip je Steigerung (max. +2D bei der Erschaffung) und bauen auf dem Attribut auf. ★-Kosten nach der Erschaffung: aktuelle Würfelzahl in CP.',
  specialization: '(Spezialisierung)', add_spec_title: 'Spezialisierung hinzufügen',
  prompt_spec: 'Name der Spezialisierung (z. B. "Blaster: Welding Tools"):',
  dr_mods: 'Modifikationen', dr_mod_hint: 'Kosten in Pips aus dem Startpool (auch halbe Pips). Späterer Einbau kostet die angegebenen CP.',
  dr_pips: 'Pips', dr_cp_later: 'CP (später)',
  dr_mod_stock: 'Ab Werk', dr_mod_retrofit: 'Nachgerüstet',
  dr_mod_cap: 'Nachrüst-Kapazität (Pips)', dr_mod_cp_used: 'CP für Nachrüstung',
  dr_mod_cap_override: 'Kapazität überschreiben:',
  dr_mod_cap_hint: 'Ab Werk = Pips aus dem Startpool. Nachgerüstet = kostet CP und belegt Einbauplatz; Standard ist ein Drittel des Startpools.',
  dr_custom_mods: 'Eigene Modifikationen',
  dr_points: 'Charakterpunkte', dr_cp_earned: 'Verdient (gesamt)', dr_cp_other: 'Sonstig ausgegeben',
  dr_cp_auto: 'Durch Steigerungen ausgegeben',
  dr_equipment: 'Ausrüstung', dr_weapons: 'Waffen (getragen)',
  dr_template: 'Droiden-Vorlage aus den Regelwerken', dr_template_pick: '– Droide wählen –',
  dr_template_hint: 'Fertige Droidenmodelle aus den Fan-Sammelbänden. Übernimmt Attribute, Fertigkeiten, Ausstattung und den Grad als Startpunkt. Der Grad stammt aus der Kapitel-Einteilung des Droid Compendium; mit ≈ markierte Einträge kommen aus anderen Quellen und sind daraus abgeleitet.',
  dr_template_apply: 'Vorlage übernehmen', dr_template_applied: 'Vorlage übernommen ✔',
  dr_tpl_degree: 'Grad', dr_deg_all: 'Alle Grade',
  dr_deg_d1: '1. Grad', dr_deg_d2: '2. Grad',
  dr_deg_d3: '3. Grad', dr_deg_d4: '4. Grad',
  dr_deg_d5: '5. Grad', dr_deg_other: 'Sonstige',
  dr_template_overwrite: 'Aktuelle Werte durch „{name}“ ersetzen?',
  dr_tpl_equip_note: 'Ausstattung laut Vorlage (als Notiz übernommen – passende Modifikationen bitte im Tab „Modifikationen“ auswählen):',
  pdf_catalog: 'Erweiterter Katalog aus den Regelwerken', pdf_search: 'Suchen', pdf_add: '+ Übernehmen',
  pdf_hint: 'Zusätzliche Einträge aus den Fan-Sammelbänden. Suchbegriff eingeben, dann übernehmen.',
  pdf_results: 'Treffer', pdf_none: 'Keine Treffer.', pdf_min_chars: 'Mindestens 2 Zeichen eingeben – oder eine Ära wählen.',
  pdf_more: 'weitere über Suche oder Ära eingrenzen',
  dr_custom_gear: 'Eigene Einträge',
  dr_melee: 'Nahkampf', dr_ranged: 'Fernkampf',
  range_pkml: 'Reichweite (P/K/M/L)',
  sheet_title_droid: 'Das Rollenspiel · D6 · Droidenbogen',
  dr_installed: 'Eingebaute Modifikationen',
  dr_dbline: 'Datenbank',
  wounds: 'Beschädigungen', dmg_gt_str: 'Schaden > STR', condition: 'Zustand', effect: 'Auswirkung',
  droidWoundRows: [
    ['0 – 3', 'Gestört (Stunned)', '−1D auf alle Würfe in dieser und der nächsten Runde'],
    ['4 – 8', 'Beschädigt (Wounded)', 'Fällt aus für den Rest der Runde, −1D auf alles bis repariert'],
    ['9 – 12', 'Schwer beschädigt', 'Systemausfall für 10D Minuten, handlungsunfähig bis repariert'],
    ['13 +', 'Zerstört / Kernschaden', 'Abgeschaltet; ohne Reparatur (und ggf. Backup-Speicher) verloren'],
  ],
});
Object.assign(T.en, {
  title: 'Star Wars D6 – Droid Generator',
  subtitle: 'Droid Generator',
  footer: 'Based on "Droid Generator v1-3" by Chance Gibboney · Star Wars: The Roleplaying Game, 2nd Edition – West End Games D6 system',
  doc_one: 'droid', doc_plural: 'droids',
  tab_model: 'Model', tab_attrs: 'Attributes', tab_skills: 'Skills',
  tab_mods: 'Modifications', tab_gear: 'Equipment', tab_sheet: 'Droid Sheet',
  dr_model: 'Model Data', dr_name: 'Designation / Name', dr_player: 'Player Name',
  dr_degree: 'Degree', dr_manufacturer: 'Manufacturer',
  dr_locomotion: 'Locomotion', dr_scale: 'Scale', dr_move: 'Move (m)',
  dr_matrix: 'Personality Matrix', dr_height: 'Height (m)', dr_weight: 'Weight (kg)',
  dr_matrix_hint: 'Not given in any source and not taken from the template – pick it yourself and have your GM approve it. A load lifter is “Simple”, a tactical or protocol droid clearly more.',
  dr_quote: 'A Quote', dr_fp: 'Force Points',
  dr_desc: 'Physical Description', dr_history: 'Short History',
  dr_personality: 'Personality', dr_objectives: 'Motivation / Objectives',
  dr_portrait: 'Droid Picture',
  dr_db: 'Database skills (hard-wired)',
  dr_db_hint: 'Up to two hard-wired knowledge/skill databases. The bonus costs pips from the starting pool.',
  dr_db_skill: 'Database skill', dr_db_level: 'Bonus',
  dr_pool: 'Starting pool', dr_pool_hint: 'The starting pool (default 25D = 75 pips) is divided among attributes, skills AND modifications – spend it wisely!',
  dr_override: 'Override starting dice (D):',
  dr_attrs_heading: 'Attributes (each starts at 1D, maximum 13D · +/− in pips)',
  dr_degree_hint: 'The degree sets the CP upgrade cost per attribute (multiplier in %): ',
  dr_cp_cost: 'CP buy',
  cp_left: 'CP left',
  dr_skills_hint: 'Skills cost 1 pip per raise (max. +2D at creation) and build on the attribute. ★ cost after creation: current die code in CP.',
  specialization: '(specialization)', add_spec_title: 'Add specialization',
  prompt_spec: 'Name of the specialization (e.g. "Blaster: Welding Tools"):',
  dr_mods: 'Modifications', dr_mod_hint: 'Costs in pips from the starting pool (half pips allowed). Installing later costs the listed CP.',
  dr_pips: 'Pips', dr_cp_later: 'CP (later)',
  dr_mod_stock: 'Factory', dr_mod_retrofit: 'Retrofitted',
  dr_mod_cap: 'Retrofit capacity (pips)', dr_mod_cp_used: 'CP spent on retrofits',
  dr_mod_cap_override: 'Override capacity:',
  dr_mod_cap_hint: 'Factory = pips from the starting pool. Retrofitted = costs CP and takes up install space; the default is one third of the starting pool.',
  dr_custom_mods: 'Custom modifications',
  dr_points: 'Character Points', dr_cp_earned: 'Earned (total)', dr_cp_other: 'Spent elsewhere',
  dr_cp_auto: 'Spent on improvements',
  dr_equipment: 'Equipment', dr_weapons: 'Weapons (carried)',
  dr_template: 'Droid template from the sourcebooks', dr_template_pick: '– choose droid –',
  dr_template_hint: 'Ready-made droid models from the fan compilations. Applies attributes, skills, equipment and the degree as a starting point. The degree comes from the chapter layout of the Droid Compendium; entries marked ≈ are from other sources and were inferred from those.',
  dr_template_apply: 'Apply template', dr_template_applied: 'Template applied ✔',
  dr_tpl_degree: 'Degree', dr_deg_all: 'All degrees',
  dr_deg_d1: '1st degree', dr_deg_d2: '2nd degree',
  dr_deg_d3: '3rd degree', dr_deg_d4: '4th degree',
  dr_deg_d5: '5th degree', dr_deg_other: 'Other',
  dr_template_overwrite: 'Replace the current values with "{name}"?',
  dr_tpl_equip_note: 'Equipment per template (added as a note – pick matching modifications on the "Modifications" tab):',
  pdf_catalog: 'Extended catalog from the sourcebooks', pdf_search: 'Search', pdf_add: '+ Add',
  pdf_hint: 'Additional entries from the fan compilations. Type a search term, then add.',
  pdf_results: 'Matches', pdf_none: 'No matches.', pdf_min_chars: 'Enter at least 2 characters – or pick an era.',
  pdf_more: 'narrow further with the search or era',
  dr_custom_gear: 'Custom entries',
  dr_melee: 'Melee', dr_ranged: 'Ranged',
  range_pkml: 'Range (PB/S/M/L)',
  sheet_title_droid: 'The Roleplaying Game · D6 · Droid Sheet',
  dr_installed: 'Installed modifications',
  dr_dbline: 'Database',
  wounds: 'Damage Chart', dmg_gt_str: 'Damage > STR', condition: 'Condition', effect: 'Effect',
  droidWoundRows: [
    ['0 – 3', 'Stunned', '−1D to rolls for this round and the next'],
    ['4 – 8', 'Damaged (Wounded)', 'Out for the rest of the round, −1D to everything until repaired'],
    ['9 – 12', 'Heavily damaged', 'Systems down for 10D minutes; inoperative until repaired'],
    ['13 +', 'Destroyed / core damage', 'Shut down; lost without repair (and a backup memory)'],
  ],
});

/* ---------------- Dokument ---------------- */
function emptyDoc() {
  return {
    version: 1, kind: 'droid',
    info: {
      name: '', player: '', degree: 'First Degree', manufacturer: '',
      locomotion: 'Legs (2)', scale: 'Character', move: 10,
      matrix: 'Simple', height: '', weight: '', quote: '', forcePoints: 1,
      description: '', history: '', personality: '', objectives: '',
      portrait: '', notes: '',
      dbSkill1: 'None', dbLevel1: 'None', dbSkill2: 'None', dbLevel2: 'None',
    },
    attrs: { dex: 0, kno: 0, mec: 0, per: 0, str: 0, tec: 0 },   // Pips über 1D (Erschaffung)
    attrsCP: { dex: 0, kno: 0, mec: 0, per: 0, str: 0, tec: 0 },
    skills: {},          // "attr|Name" -> {c, cp}
    extraSkills: [],     // {name, attr, spec}
    mods: {},            // ab Werk verbaut: Name -> Anzahl (kostet Pips aus dem Startpool)
    modsCP: {},          // später nachgerüstet: Name -> Anzahl (kostet CP + Einbauplatz)
    customMods: [],      // {name, desc, pips, note}
    points: { cpEarned: 0, cpSpentOther: 0 },
    overrides: { startDice: null, modCapacity: null },
    equipment: {}, customEquipment: [],
    melee: [], ranged: [], customMelee: [], customRanged: [],
  };
}
let C = emptyDoc();
function migrate(obj) {
  const base = emptyDoc();
  const m = Object.assign(base, obj);
  m.info = Object.assign(emptyDoc().info, obj.info || {});
  m.points = Object.assign(emptyDoc().points, obj.points || {});
  m.overrides = Object.assign(emptyDoc().overrides, obj.overrides || {});
  ['attrs', 'attrsCP'].forEach(k => m[k] = Object.assign(emptyDoc()[k], obj[k] || {}));
  ['skills', 'mods', 'modsCP', 'equipment'].forEach(k => { if (!m[k] || typeof m[k] !== 'object') m[k] = {}; });
  ['extraSkills', 'customMods', 'customEquipment', 'melee', 'ranged', 'customMelee', 'customRanged']
    .forEach(k => { if (!Array.isArray(m[k])) m[k] = []; });
  /* Bis v3.3.0 hieß der vierte Grad in den Daten „Fouth Degree“. Ohne diese
     Umschreibung fänden ältere Droiden ihren Grad nicht mehr in der Liste und
     das <select> fiele stillschweigend auf „First Degree“ zurück – mit anderen
     CP-Kosten je Attribut. */
  if (m.info.degree === 'Fouth Degree') m.info.degree = 'Fourth Degree';
  delete m.info.bodyType;          // bis v3.5.0 ein reines Deko-Feld
  m.kind = 'droid';
  return m;
}

/* ---------------- Regeln ---------------- */
function degree() {
  return DROID_DATA.degrees.find(d => d.name === C.info.degree) || DROID_DATA.degrees[0];
}
function attrTotal(key) {
  return DROID_DATA.attrMinPips + (C.attrs[key] || 0) + (C.attrsCP[key] || 0);
}
function dbLevelPips(label) {
  const l = DROID_DATA.dbLevels.find(x => x.label === label);
  return l ? l.pips : 0;
}
function poolTotal() {
  const o = C.overrides.startDice;
  return (o != null && o !== '') ? Math.round(o * 3) : DROID_DATA.startDice * 3;
}
function poolSpent() {
  let p = 0;
  ATTRS.forEach(a => p += (C.attrs[a.key] || 0));
  Object.values(C.skills).forEach(s => p += (s.c || 0));
  for (const [n, q] of Object.entries(C.mods)) {
    const m = DROID_DATA.mods.find(x => x.name === n);
    if (m && q > 0) p += m.pips * q;
  }
  C.customMods.forEach(cm => p += (+cm.pips || 0));
  p += dbLevelPips(C.info.dbLevel1) + dbLevelPips(C.info.dbLevel2);
  return p;
}
function poolLeft() { return poolTotal() - poolSpent(); }

/* ---------------- Nachrüsten (Modifikationen nach der Erschaffung) ----------
   Ab Werk verbaute Modifikationen kosten Pips aus dem Startpool. Wer später
   etwas einbauen lässt, zahlt stattdessen Charakterpunkte – und der Droide
   braucht Platz dafür: die Nachrüst-Kapazität begrenzt, wie viele Pips an
   Hardware nachträglich hineinpassen (Standard: ein Drittel des Startpools,
   je Droide überschreibbar). Für die 116 Katalogeinträge ohne CP-Angabe gilt
   der Umrechnungsfaktor aus den vorhandenen Werten: CP = Pips × 1,5. */
function modCpCost(m) {
  if (!m) return 1;
  if (m.cp) return m.cp;
  return Math.max(1, Math.ceil((+m.pips || 0) * 1.5));
}
function modCapacity() {
  const o = C.overrides.modCapacity;
  return (o != null && o !== '') ? Math.max(0, +o) : Math.floor(poolTotal() / 3);
}
function modCapUsed() {
  let p = 0;
  for (const [n, q] of Object.entries(C.modsCP)) {
    const m = DROID_DATA.mods.find(x => x.name === n);
    if (m && q > 0) p += (+m.pips || 0) * q;
  }
  return p;
}
function modCapLeft() { return modCapacity() - modCapUsed(); }
function modsCpSpent() {
  let cp = 0;
  for (const [n, q] of Object.entries(C.modsCP)) {
    const m = DROID_DATA.mods.find(x => x.name === n);
    if (m && q > 0) cp += modCpCost(m) * q;
  }
  return cp;
}

function skillKey(attr, name) { return attr + '|' + name; }
function skillEntry(key) {
  if (!C.skills[key]) C.skills[key] = { c: 0, cp: 0 };
  return C.skills[key];
}
function skillTotal(key) {
  const attr = key.split('|')[0];
  const s = C.skills[key] || { c: 0, cp: 0 };
  return attrTotal(attr) + (s.c || 0) + (s.cp || 0);
}
/* Spezialisierung? (extraSkills-Eintrag mit gesetztem spec-Elternskill) –
   sie kosten laut Grundregelwerk die halben CP der Fertigkeit, genau wie beim
   Charaktergenerator. */
function isSpecKey(key) {
  const parts = key.split('|'); const attr = parts[0], name = parts[1];
  return C.extraSkills.some(e => e.attr === attr && e.spec && e.name === name);
}
function cpDieCost(key, d) {
  if (isSpecKey(key)) return Math.max(1, Math.ceil(d / 2));
  return d;
}
function skillCpCost(key) { return cpDieCost(key, Math.max(1, Math.floor(skillTotal(key) / 3))); }
function skillCpSpent(key) {
  const s = C.skills[key]; if (!s || !s.cp) return 0;
  const attr = key.split('|')[0];
  const base = attrTotal(attr) - (C.attrsCP[attr] || 0) + (s.c || 0);
  let cost = 0;
  for (let i = 0; i < s.cp; i++) cost += cpDieCost(key, Math.max(1, Math.floor((base + i) / 3)));
  return cost;
}
/* Attribut-Steigerung per CP: 20 CP je Pip × Degree-Multiplikator */
function attrCpCostNext(key) {
  const mult = degree().mult[ATTRS.findIndex(a => a.key === key)] / 100;
  return Math.round(DROID_DATA.cpPerAttrPip * mult);
}
function attrCpSpent(key) {
  return (C.attrsCP[key] || 0) * attrCpCostNext(key);
}
function cpSpentAuto() {
  let t2 = 0;
  ATTRS.forEach(a => t2 += attrCpSpent(a.key));
  Object.keys(C.skills).forEach(k => t2 += skillCpSpent(k));
  t2 += modsCpSpent();                    // nachgerüstete Modifikationen
  return t2;
}
function cpLeft() { return (+C.points.cpEarned || 0) - cpSpentAuto() - (+C.points.cpSpentOther || 0); }
function skillsFor(attr) {
  const rows = [];
  const std = DATA.skills[attr] || [];
  std.forEach(n => {
    rows.push({ name: n, attr, spec: null, std: true });
    /* Spezialisierungen hängen unter ihrem Grundskill */
    C.extraSkills.filter(e => e.attr === attr && e.spec === n)
      .forEach(e => rows.push({ name: e.name, attr, spec: n }));
  });
  C.extraSkills.filter(e => e.attr === attr && !e.spec && !std.includes(e.name))
    .forEach(e => rows.push({ name: e.name, attr, spec: null, extra: true }));
  return rows;
}

/* ---------------- Wurf-Profil für die Würfelseite ----------------
   Droiden sind spielbare Figuren, also gehören sie genauso auf die Würfelseite
   wie Charaktere. genshared.js ruft buildRollProfile() beim Autospeichern auf,
   sobald es hier definiert ist. Die Bonus-Erkennung ist eine Kopie aus app.js –
   dieses Skript läuft auf der Droidenseite nicht mit. */
function noteBonusPips(txt, name) {
  const val = (d, p) => (+d) * 3 + (p ? +p : 0);
  let m = /\(\s*(?:power|rating|level|stufe)\s*\+?\s*(\d+)D(?:\+(\d+))?\s*\)/i.exec(String(name || ''));
  if (m) return val(m[1], m[2]);
  const t2 = String(txt || '');
  m = /\+\s*(\d+)D(?:\+(\d+))?/.exec(t2);
  if (m) return val(m[1], m[2]);
  m = /(?:reduc|lower|decreas)[a-z]*\s+(?:the\s+)?[a-z ]{0,24}difficulty[^.]{0,40}?by\s+(\d+)D(?:\+(\d+))?/i.exec(t2);
  if (m) return val(m[1], m[2]);
  return 0;
}
function buildRollProfile() {
  try {
    const entries = [], seen = {};
    ATTRS.forEach(a => entries.push({ label: a.name, pips: attrTotal(a.key), kind: 'attr' }));
    ATTRS.forEach(a => skillsFor(a.key).forEach(r => {
      const key = skillKey(a.key, r.name);
      if (!seen[key] && ((C.skills[key] || {}).c || (C.skills[key] || {}).cp)) {
        seen[key] = 1;
        entries.push({ label: (r.spec ? '↳ ' : '') + skillName(r.name), pips: skillTotal(key), kind: 'skill' });
      }
    }));
    /* Getragene Ausrüstung mit Würfel-Bonus – dieselbe Logik wie beim Charakter */
    const gear = [], seenG = {};
    const byName = (list, n) => (list || []).find(x => x.name === n);
    Object.keys(C.equipment || {}).forEach(n => {
      if ((C.equipment[n] || 0) <= 0 || seenG[n]) return;
      const it = byName(DATA.equipment, n)
        || (typeof PDF_EQUIPMENT !== 'undefined' && byName(PDF_EQUIPMENT, n));
      const note = it ? (it.notes || it.note || '') : '';
      const pips = noteBonusPips(note, n);
      if (pips > 0) { seenG[n] = 1; gear.push({ label: n, pips: pips, hint: String(note).slice(0, 80) }); }
    });
    (C.customEquipment || []).forEach(e => {
      if (!e || !e.name || (+e.qty || 0) <= 0) return;
      const pips = noteBonusPips(e.note || e.notes || '', e.name);
      if (pips > 0) gear.push({ label: e.name, pips: pips, hint: String(e.note || e.notes || '').slice(0, 80) });
    });
    localStorage.setItem('swd6_roll_droid',
      JSON.stringify({ name: (C.info && C.info.name) || '', entries, gear }));
  } catch (e) {}
}

/* ---------------- Ansichten ---------------- */
function selOpts(list, sel, noneLabel) {
  let out = noneLabel != null ? `<option value="">${noneLabel}</option>` : '';
  return out + list.map(x => `<option ${x === sel ? 'selected' : ''} value="${esc(x)}">${esc(x)}</option>`).join('');
}
function poolBanner() {
  const left = poolLeft();
  return `<div class="pool-banner ${left < 0 ? 'neg' : ''}">
    <span>${t('dr_pool')}: <b>${fmtD(poolTotal())}</b></span>
    <span class="${left < 0 ? 'neg' : ''}">${t('left')}: <b>${left % 1 ? left.toFixed(1) : fmtD(left)}</b> ${left === 0 ? '<span class="ok">✔</span>' : ''}</span>
    ${/* Attribute, Fertigkeiten und Nachrüstungen kosten hier auch CP –
          der Rest gehört deshalb neben den Startpool. */''}
    <span>${t('cp_left')}: <b class="${cpLeft() < 0 ? 'warn' : 'ok'}">${cpLeft()}</b></span>
    <span class="hint">${t('dr_pool_hint')}</span>
    <span style="margin-left:auto"><label style="display:inline">${t('dr_override')}</label>
      ${inputN('overrides.startDice', C.overrides.startDice, 'data-rerender="1" style="width:70px"')}</span>
  </div>`;
}

/* ---------------- Vorlagen und erweiterte Kataloge (PDF) ---------------- */
let tplFilter = '', tplMsg = '', tplDegree = '';

/* Der Grad steht im Droid Compendium nicht im Statblock, sondern als
   Kapitelüberschrift („1st Degree Droids“ …) – 267 der 350 Katalogeinträge
   tragen ihn deshalb als `degree` direkt aus dem Buch. Die übrigen 83 (aus
   anderen Quellen) wurden daraus abgeleitet und mit `degreeDerived` markiert.
   Die Stichwortliste unten greift nur noch, wenn beides fehlt. */
const DEGREE_KEY = {
  'First Degree': 'd1', 'Second Degree': 'd2', 'Third Degree': 'd3',
  'Fourth Degree': 'd4', 'Fifth Degree': 'd5',
};
const DROID_FUNC = [
  ['d1', ['medical', 'surgical', 'biolog', 'physician', 'chemist', 'pharma', 'science',
          'analysis', 'research', 'laborator', 'diagnos', 'nurse', 'emergency', '2-1b', '1-1b']],
  ['d4', ['assassin', 'battle', 'war ', 'warfare', 'combat', 'security', 'guard', 'sentry',
          'military', 'bounty', 'gladiat', 'destroyer', 'commando', 'police', 'interrogat', 'sniper']],
  ['d3', ['protocol', 'translat', 'servant', 'tutor', 'teacher', 'nanny', 'valet', 'bartend',
          'entertain', 'diplomat', 'etiquette', 'interpret', 'hospitality', 'secretar', 'courier']],
  ['d2', ['astromech', 'repair', 'engineer', 'technic', 'mechanic', 'maintenance', 'utility',
          'navigation', 'pilot', 'computer', 'systems control', 'r2-', 'r4-', 'r5-']],
  ['d5', ['labor', 'mining', 'sanitation', 'janitor', 'load lifter', 'lifter', 'agricultur',
          'power droid', 'gonk', 'menial', 'worker', 'scrub', 'harvest', 'cargo', 'construction']],
];
function droidFunctionOf(d) {
  if (d.degree && DEGREE_KEY[d.degree]) return DEGREE_KEY[d.degree];
  const hay = ((d.name || '') + ' ' + String(d.type || '').slice(0, 120)).toLowerCase();
  for (const [key, words] of DROID_FUNC) if (words.some(w => hay.includes(w))) return key;
  return 'other';
}
const pdfFilter = { melee: '', ranged: '', equip: '' };
const pdfEra = { melee: '', ranged: '', equip: '' };

/* Ära-Auswahl. Die Schlüssel liefert die erzeugte Katalogdatei mit, damit
   Dropdown und Daten nicht auseinanderlaufen. */
function eraOptions(selected) {
  const list = (typeof PDF_ERAS !== 'undefined') ? PDF_ERAS : [];
  return [`<option value="">${t('era_all')}</option>`].concat(
    list.map(e => `<option ${selected === e ? 'selected' : ''} value="${e}">${t('era_' + e.replace('-', '_'))}</option>`)
  ).join('');
}

function droidTemplates() { return (typeof PDF_DROIDS !== 'undefined') ? PDF_DROIDS : []; }
function templateCard() {
  const src = droidTemplates();
  if (!src.length) return '';
  const f = tplFilter.toLowerCase().trim();
  const hits = src.map((x, n) => [x, n])
    .filter(([x]) => !f || x.name.toLowerCase().includes(f) || (x.type || '').toLowerCase().includes(f))
    .filter(([x]) => !tplDegree || droidFunctionOf(x) === tplDegree)
    .sort((a, b) => {
      /* nach Funktionsgruppe, darin alphabetisch – so liegen ähnliche Droiden
         beieinander statt in der Reihenfolge der Quellbücher */
      const ga = droidFunctionOf(a[0]), gb = droidFunctionOf(b[0]);
      if (ga !== gb) return ga.localeCompare(gb);
      return a[0].name.localeCompare(b[0].name);
    })
    .slice(0, 400);
  return `<div class="card"><h2>${t('dr_template')}</h2>
    <p class="hint">${t('dr_template_hint')}</p>
    <div style="display:flex; gap:8px; flex-wrap:wrap; align-items:flex-end">
      <div style="flex:0 0 200px"><label>${t('pdf_search')}</label>
        <input type="text" id="tplSearch" value="${esc(tplFilter)}" placeholder="R2, Protocol, Medical …"></div>
      <div style="flex:0 0 190px"><label>${t('dr_tpl_degree')}</label>
        <select id="tplDegree">
          <option value="">${t('dr_deg_all')}</option>
          ${['d1', 'd2', 'd3', 'd4', 'd5', 'other'].map(k =>
            `<option value="${k}" ${tplDegree === k ? 'selected' : ''}>${t('dr_deg_' + k)}</option>`).join('')}
        </select></div>
      <div style="flex:1; min-width:240px"><label>${t('dr_template_pick')}</label>
        <select id="tplSelect">${hits.map(([x, n]) =>
          `<option value="${n}">${esc(x.name)} — ${t('dr_deg_' + droidFunctionOf(x))}${
            x.degreeDerived ? ' ≈' : ''}</option>`).join('')}</select></div>
      <div><button class="accent" data-act="applyTemplate">${t('dr_template_apply')}</button></div>
    </div>
    ${tplMsg ? `<p class="ok" style="margin-top:8px">${esc(tplMsg)}</p>` : ''}
  </div>`;
}
/* Der Hersteller steckt am Anfang der type-Zeile ("Cybot Galactica GY-I
   Information Analysis Unit"). Bei 40 der 350 Katalogeinträge hängt aber der
   komplette Statblock hinten dran, weil die PDF-Extraktion Typ- und Werteblock
   nicht trennen konnte — dann landete früher "… Unit DEXTERITY 2D KNOWLEDGE 2D"
   im Herstellerfeld. Deshalb zuerst beim ersten Attributnamen abschneiden. */
function templateManufacturer(type) {
  let s = String(type).split(/\b(?:DEXTERITY|KNOWLEDGE|MECHANICAL|PERCEPTION|STRENGTH|TECHNICAL)\b/)[0];
  s = s.split(/model|droid/i)[0].trim().replace(/[,;:]+$/, '');
  if (s.length > 60) s = s.slice(0, 60).replace(/\s+\S*$/, '');   // Notbremse
  return s.trim();
}
function applyDroidTemplate() {
  const sel = document.getElementById('tplSelect');
  if (!sel || sel.value === '') return;
  const src = droidTemplates()[+sel.value];
  if (!src) return;
  if (!confirm(t('dr_template_overwrite').replace('{name}', src.name))) return;
  const i = C.info;
  i.name = src.name;
  if (src.type) i.manufacturer = templateManufacturer(src.type) || i.manufacturer;
  /* Grad übernehmen – er bestimmt die CP-Kosten je Attribut. Über den Index in
     DROID_DATA.degrees statt über den Namen, damit eine abweichende Schreibweise
     nicht still auf den ersten Eintrag zurückfällt. */
  const degIdx = { d1: 0, d2: 1, d3: 2, d4: 3, d5: 4 }[droidFunctionOf(src)];
  if (degIdx != null && DROID_DATA.degrees[degIdx]) i.degree = DROID_DATA.degrees[degIdx].name;
  const mv = /(\d+)/.exec(src.move || '');
  if (mv) i.move = +mv[1];
  /* Attribute: Vorlagenwerte als Erschaffungs-Pips über dem 1D-Minimum */
  ATTRS.forEach(a => {
    const pips = (src.attrs || {})[a.key] || 0;
    C.attrs[a.key] = Math.max(0, pips - DROID_DATA.attrMinPips);
    C.attrsCP[a.key] = 0;
  });
  /* Fertigkeiten aus der Vorlage: "First aid 3D, (A) medicine: cyborging 4D+2" */
  C.skills = {};
  C.extraSkills = [];
  /* Die PDF-Spalten brechen Fertigkeitsnamen um ("Computer programming/" +
     "repair 5D"). Deshalb erst alles zusammenziehen, dann an Kommas und
     Würfelangaben trennen und tolerant gegen Schreibweisen vergleichen. */
  const norm = x => x.toLowerCase().replace(/[^a-z]/g, '');
  const skillIndex = {};
  ATTRS.forEach(a => (DATA.skills[a.key] || []).forEach(n => { skillIndex[norm(n)] = [a.key, n]; }));
  const flat = (src.skills || []).join(' ').replace(/\s+/g, ' ');
  /* Alle "Name … 4D+2"-Paare im Fließtext einsammeln (auch mehrere je Zeile) */
  /* Der Doppelpunkt gehört mit in den Namen, sonst wird aus
     "blaster: welding tools 7D" nur "welding tools" – kein bekannter Skill,
     die Fertigkeit fiel früher ersatzlos weg. */
  const pairRe = /([A-Za-z][A-Za-z :\/'\-\(\)]*?)\s*(\d+D(?:\+\d)?)/g;
  let pm;
  while ((pm = pairRe.exec(flat)) !== null) {
    let nm = pm[1].replace(/\(A\)/ig, '').trim().replace(/^[,;\s]+/, '');
    const pips = dicePipsD(pm[2]);
    if (nm.includes(':')) {
      const cut = nm.indexOf(':');
      const parentRaw = nm.slice(0, cut).trim();
      const rest = nm.slice(cut + 1).trim();
      const ph = skillIndex[norm(parentRaw)];
      if (ph) {
        /* Echte Spezialisierung – als eigene Fertigkeit unter dem Grundskill */
        const [attr, parentName] = ph;
        const specName = parentName + ': ' + rest.charAt(0).toUpperCase() + rest.slice(1);
        if (!C.extraSkills.some(e => e.attr === attr && e.name === specName))
          C.extraSkills.push({ name: specName, attr, spec: parentName });
        const overS = pips - attrTotal(attr);
        if (overS > 0) C.skills[skillKey(attr, specName)] = { c: overS, cp: 0 };
        continue;
      }
      nm = rest;              // z. B. "Skills: blaster" → "blaster"
    }
    const hit = skillIndex[norm(nm)];
    if (!hit) continue;
    const [attr, canonical] = hit;
    const over = pips - attrTotal(attr);
    if (over > 0) C.skills[skillKey(attr, canonical)] = { c: over, cp: 0 };
  }
  const notes = [];
  if ((src.equipped || []).length) notes.push(t('dr_tpl_equip_note') + '\n- ' + src.equipped.join('\n- '));
  if (src.source) notes.push('Quelle: ' + src.source);
  if (src.costText) notes.push('Cost: ' + src.costText + (src.avail ? ' · Availability: ' + src.avail : ''));
  i.notes = notes.join('\n\n');
  tplMsg = t('dr_template_applied');
  update('model');
}
function dicePipsD(s) {
  const m = /(\d+)\s*D\s*(?:\+\s*(\d+))?/.exec(String(s || ''));
  return m ? (+m[1]) * 3 + (+(m[2] || 0)) : 0;
}
function pdfSource(kind) {
  if (kind === 'melee') return (typeof PDF_WEAPONS_MELEE !== 'undefined') ? PDF_WEAPONS_MELEE : [];
  if (kind === 'ranged') return (typeof PDF_WEAPONS_RANGED !== 'undefined') ? PDF_WEAPONS_RANGED : [];
  return (typeof PDF_EQUIPMENT !== 'undefined') ? PDF_EQUIPMENT : [];
}
function pdfCatalogBlock(kind) {
  const src = pdfSource(kind);
  if (!src.length) return '';
  const f = (pdfFilter[kind] || '').toLowerCase().trim();
  const era = pdfEra[kind] || '';
  const LIMIT = 50;
  let rows = '', info = '';
  {
    /* Der Katalog zeigt von sich aus die ersten Einträge. Früher blieb er
       leer, bis jemand zwei Zeichen tippte – dann wirkt die Karte, als
       wäre gar nichts drin. Suche und Ära grenzen jetzt nur noch ein. */
    const all = src.filter(x => (!era || x.era === era) &&
      (f.length < 2 || x.name.toLowerCase().includes(f) ||
       (x.type || '').toLowerCase().includes(f)));
    const hits = all.slice(0, LIMIT);
    if (!hits.length) info = `<p class="hint">${t('pdf_none')}</p>`;
    else {
      rows = hits.map(h => `<tr><td>${esc(h.name)}${h.book ? `<br><span class="hint">${esc(h.book)}</span>` : ''}</td>
        <td>${esc(kind === 'equip' ? h.type : h.damage)}</td>
        <td class="num">${fmtCr(h.cost)}</td>
        <td><button class="mini" data-act="pdfAdd" data-kind="${kind}" data-i="${src.indexOf(h)}">${t('pdf_add')}</button></td></tr>`).join('');
      info = `<p class="hint">${t('pdf_results')}: ${hits.length} / ${all.length}${
        all.length > LIMIT ? ' · ' + t('pdf_more') : ''}</p>`;
    }
  }
  const label = kind === 'equip' ? t('dr_equipment') : (kind === 'melee' ? t('dr_melee') : t('dr_ranged'));
  return `<div class="card"><h2>${t('pdf_catalog')} – ${label}</h2>
    <p class="hint">${t('pdf_hint')}</p>
    <p><input type="text" data-pdfsearch="${kind}" value="${esc(pdfFilter[kind])}" placeholder="${esc(t('pdf_search'))}…" style="width:260px">
       <select data-pdfera="${kind}" style="width:200px">${eraOptions(pdfEra[kind])}</select></p>
    ${info}${rows ? `<div class="table-scroll"><table class="list">${rows}</table></div>` : ''}</div>`;
}
function pdfAddDroid(kind, idx) {
  const h = pdfSource(kind)[idx];
  if (!h) return;
  if (kind === 'equip') C.customEquipment.push({ name: h.name, cost: h.cost, qty: 1, note: h.type || '' });
  else if (kind === 'melee') C.customMelee.push({ name: h.name, dmg: h.damage, diff: h.diff, cost: h.cost });
  else C.customRanged.push({ name: h.name, skill: (h.skill || '').split(':')[0], dmg: h.damage, ranges: h.range, cost: h.cost });
  update();
}

function viewModel() {
  const i = C.info;
  const dbSel = n => `
    <div><label>${t('dr_db_skill')} ${n}</label>
      <select data-bind="info.dbSkill${n}" data-rerender="1">${selOpts(DROID_DATA.dbSkills, i['dbSkill' + n])}</select></div>
    <div><label>${t('dr_db_level')} ${n}</label>
      <select data-bind="info.dbLevel${n}" data-rerender="1">
        ${DROID_DATA.dbLevels.map(l => `<option ${i['dbLevel' + n] === l.label ? 'selected' : ''} value="${esc(l.label)}">${esc(l.label)}${l.pips ? ' (' + l.pips + ' ' + t('dr_pips') + ')' : ''}</option>`).join('')}
      </select></div>`;
  return `
  ${poolBanner()}
  ${templateCard()}
  <div class="grid2">
    <div>
      <div class="card"><h2>${t('dr_model')}</h2>
        <div class="formgrid">
          <div><label>${t('dr_name')}</label>${inputT('info.name', i.name)}</div>
          <div><label>${t('dr_player')}</label>${inputT('info.player', i.player)}</div>
          <div><label>${t('dr_degree')}</label><select data-bind="info.degree" data-rerender="1">${selOpts(DROID_DATA.degrees.map(d => d.name), i.degree)}</select></div>
          <div><label>${t('dr_manufacturer')}</label>
            <input type="text" list="makers" data-bind="info.manufacturer" value="${esc(i.manufacturer)}">
            <datalist id="makers">${DROID_DATA.manufacturers.map(m => `<option value="${esc(m)}">`).join('')}</datalist></div>
          <div><label>${t('dr_locomotion')}</label><select data-bind="info.locomotion">${selOpts(DROID_DATA.locomotion, i.locomotion)}</select></div>
          <div><label>${t('dr_scale')}</label><select data-bind="info.scale">${selOpts(DROID_DATA.scales, i.scale)}</select></div>
          <div><label>${t('dr_move')}</label>${inputN('info.move', i.move, 'style="width:80px"')}</div>
          <div><label>${t('dr_matrix')}</label><select data-bind="info.matrix">${selOpts(DROID_DATA.matrix, i.matrix)}</select>
            <span class="hint">${t('dr_matrix_hint')}</span></div>
          <div><label>${t('dr_height')}</label>${inputT('info.height', i.height)}</div>
          <div><label>${t('dr_weight')}</label>${inputT('info.weight', i.weight)}</div>
          <div><label>${t('dr_fp')}</label>${inputN('info.forcePoints', i.forcePoints, 'style="width:80px"')}</div>
          <div class="wide"><label>${t('dr_quote')}</label>${inputT('info.quote', i.quote, 'style="width:100%"')}</div>
        </div>
      </div>
      <div class="card"><h2>${t('dr_db')}</h2>
        <p class="hint">${t('dr_db_hint')}</p>
        <div class="formgrid">${dbSel(1)}${dbSel(2)}</div>
      </div>
    </div>
    <div>
      ${portraitCardHtml(t('dr_portrait'))}
      <div class="card"><h2>${t('dr_desc')} &amp; Co.</h2>
        <label>${t('dr_desc')}</label><textarea data-bind="info.description">${esc(i.description)}</textarea>
        <label style="margin-top:10px">${t('dr_history')}</label><textarea data-bind="info.history">${esc(i.history)}</textarea>
        <label style="margin-top:10px">${t('dr_personality')}</label><textarea data-bind="info.personality">${esc(i.personality)}</textarea>
        <label style="margin-top:10px">${t('dr_objectives')}</label><textarea data-bind="info.objectives">${esc(i.objectives)}</textarea>
        <label style="margin-top:10px">${t('notes')}</label><textarea data-bind="info.notes">${esc(i.notes)}</textarea>
      </div>
    </div>
  </div>`;
}

function viewAttrs() {
  const left = poolLeft();
  const deg = degree();
  const rows = ATTRS.map((a, ai) => {
    const total = attrTotal(a.key);
    const canPlus = left >= 1 && total < DROID_DATA.attrMaxPips;
    return `<div class="attr-row">
      <span class="aname">${a.name}</span>
      <span class="alimits">×${deg.mult[ai]}%</span>
      ${stepper('attr', `data-a="${a.key}"`, (C.attrs[a.key] || 0) > 0, canPlus)}
      <span class="dice">${fmtD(total)}</span>
      <span class="cost-hint">${t('dr_cp_cost')} (${attrCpCostNext(a.key)} CP):</span>
      ${stepper('attrCP', `data-a="${a.key}"`, (C.attrsCP[a.key] || 0) > 0, total < DROID_DATA.attrMaxPips)}
      ${C.attrsCP[a.key] ? `<span class="badge">+${C.attrsCP[a.key]} · ${attrCpSpent(a.key)} CP</span>` : ''}
    </div>`;
  }).join('');
  const cpAuto = cpSpentAuto();
  return `
  ${poolBanner()}
  <div class="card"><h2>${t('dr_attrs_heading')}</h2>
    <p class="hint">${t('dr_degree_hint')}${esc(deg.name)} → ${deg.mult.map((m, i2) => ATTRS[i2].name.slice(0, 3) + ' ' + m + '%').join(' · ')}</p>
    ${rows}
  </div>
  <div class="card"><h2>${t('dr_points')}</h2>
    <div class="formgrid">
      <div><label>${t('dr_cp_earned')}</label>${inputN('points.cpEarned', C.points.cpEarned, 'data-rerender="1"')}</div>
      <div><label>${t('dr_cp_other')}</label>${inputN('points.cpSpentOther', C.points.cpSpentOther, 'data-rerender="1"')}</div>
    </div>
    <p>${t('dr_cp_auto')}: <b>${cpAuto} CP</b><br>
    ${t('left')}: <b class="${cpLeft() < 0 ? 'warn' : 'ok'}">${cpLeft()} CP</b></p>
  </div>`;
}

const collapsedSecs = {};
function viewSkills() {
  const left = poolLeft();
  const sections = ATTRS.map(a => {
    const rows = skillsFor(a.key).map(r => {
      const key = skillKey(a.key, r.name);
      const e = C.skills[key] || { c: 0, cp: 0 };
      const total = skillTotal(key);
      const extraIdx = C.extraSkills.findIndex(x => x.attr === a.key && x.name === r.name);
      return `<div class="skill-row ${r.spec ? 'spec' : ''}">
        <span class="sname">${r.spec ? '↳ ' : ''}${esc(skillName(r.name))}
          ${r.spec ? `<span class="tag">${t('specialization')}</span>` : ''}
        </span>
        ${r.std ? `<button class="mini" data-act="addSpec" data-attr="${a.key}" data-parent="${esc(r.name)}" title="${t('add_spec_title')}">S+</button>` : ''}
        ${stepper('skill', `data-key="${esc(key)}"`, e.c > 0, left >= 1 && e.c < 6)}
        <span class="dice ${total > attrTotal(a.key) ? '' : 'plain'}">${fmtD(total)}</span>
        <span class="cost-hint">CP (${skillCpCost(key)}):</span>
        ${stepper('skillCP', `data-key="${esc(key)}"`, e.cp > 0, true)}
        ${e.cp ? `<span class="badge">+${e.cp} · ${skillCpSpent(key)} CP</span>` : ''}
        ${(r.extra || r.spec) ? `<button class="mini danger" data-act="delExtra" data-idx="${extraIdx}">×</button>` : ''}
      </div>`;
    }).join('');
    const spentHere = skillsFor(a.key).reduce((tt, r) => {
      const e = C.skills[skillKey(a.key, r.name)]; return tt + (e ? e.c || 0 : 0);
    }, 0);
    return `<div class="skill-section">
      <div class="skill-head" data-act="toggleSec" data-sec="${a.key}">
        <span class="aname">${a.name}</span>
        <span class="dice plain">${fmtD(attrTotal(a.key))}</span>
        <span class="hint">${spentHere ? '+' + fmtD(spentHere) : ''}</span>
        <span style="margin-left:auto" class="hint">▼</span>
      </div>
      <div class="skill-body" ${collapsedSecs[a.key] ? 'style="display:none"' : ''}>
        ${rows}
        <p><button class="mini" data-act="addCustomSkill" data-attr="${a.key}">+ ${t('skill')}</button></p>
      </div>
    </div>`;
  }).join('');
  return `${poolBanner()}<p class="hint">${t('dr_skills_hint')}</p>${sections}`;
}

function viewMods() {
  const cats = [...new Set(DROID_DATA.mods.map(m => m.cat))];
  const blocks = cats.map(cat => {
    const rows = DROID_DATA.mods.filter(m => m.cat === cat).map(m => {
      const q = C.mods[m.name] || 0;
      const qc = C.modsCP[m.name] || 0;
      return `<tr ${(q || qc) ? 'style="background:#1b2038"' : ''}>
        <td>${esc(m.name)}${m.desc ? `<br><span class="hint">${esc(m.desc)}</span>` : ''}</td>
        <td class="num">${m.pips}</td><td class="num">${modCpCost(m)}</td>
        <td class="num"><input type="number" min="0" data-modqty="${esc(m.name)}" value="${q}" style="width:64px"></td>
        <td class="num"><input type="number" min="0" data-modcpqty="${esc(m.name)}" value="${qc}" style="width:64px"></td>
      </tr>`;
    }).join('');
    return `<div class="card"><h2>${esc(cat)}</h2><div class="table-scroll">
      <table class="list"><tr><th>${t('dr_mods')}</th><th class="num">${t('dr_pips')}</th><th class="num">${t('dr_cp_later')}</th>
        <th class="num">${t('dr_mod_stock')}</th><th class="num">${t('dr_mod_retrofit')}</th></tr>${rows}</table></div></div>`;
  }).join('');
  const customRows = C.customMods.map((cm, i2) => `<tr>
    <td>${inputT('customMods.' + i2 + '.name', cm.name)}</td>
    <td>${inputT('customMods.' + i2 + '.desc', cm.desc)}</td>
    <td class="num">${inputN('customMods.' + i2 + '.pips', cm.pips, 'data-rerender="1" style="width:80px"')}</td>
    <td><button class="mini danger" data-act="delCustomMod" data-idx="${i2}">×</button></td></tr>`).join('');
  const capLeft = modCapLeft(), cpUsed = modsCpSpent();
  const retroBanner = `<div class="pool-banner ${capLeft < 0 ? 'neg' : ''}">
    <span>${t('dr_mod_cap')}: <b>${modCapacity()}</b></span>
    <span class="${capLeft < 0 ? 'neg' : ''}">${t('left')}: <b>${capLeft % 1 ? capLeft.toFixed(1) : capLeft}</b></span>
    <span>${t('dr_mod_cp_used')}: <b>${cpUsed}</b></span>
    <span class="hint">${t('dr_mod_cap_hint')}</span>
    <span style="margin-left:auto"><label style="display:inline">${t('dr_mod_cap_override')}</label>
      ${inputN('overrides.modCapacity', C.overrides.modCapacity, 'data-rerender="1" style="width:70px"')}</span>
  </div>`;
  return `
  ${poolBanner()}
  ${retroBanner}
  <p class="hint">${t('dr_mod_hint')}</p>
  ${blocks}
  <div class="card"><h2>${t('dr_custom_mods')}</h2>
    <div class="table-scroll"><table class="list">
      <tr><th>${t('name')}</th><th>${t('special')}</th><th class="num">${t('dr_pips')}</th><th></th></tr>${customRows}</table></div>
    <p><button class="mini" data-act="addCustomMod">${t('add_entry')}</button></p>
  </div>`;
}

function viewGear() {
  const cats = [...new Set(DATA.equipment.map(e => e.cat))];
  const eqBlocks = cats.map(cat => {
    const rows = DATA.equipment.filter(e => e.cat === cat).map(e => {
      const qty = C.equipment[e.name] || 0;
      return `<tr><td>${esc(e.name)}${e.note ? `<br><span class="hint">${esc(e.note)}</span>` : ''}</td>
        <td class="num">${fmtCr(e.cost)}</td><td>${esc(e.avail)}</td>
        <td class="num"><input type="number" min="0" data-eqqty="${esc(e.name)}" value="${qty}" style="width:64px"></td></tr>`;
    }).join('');
    return `<div class="card"><h2>${esc(cat)}</h2><div class="table-scroll">
      <table class="list"><tr><th>${t('item')}</th><th class="num">${t('cost')}</th><th>${t('avail')}</th><th class="num">${t('qty')}</th></tr>${rows}</table></div></div>`;
  }).join('');
  const mOwned = C.melee.map((n, i2) => {
    const m = DATA.melee.find(x => x.name === n); if (!m) return '';
    return `<tr><td>${esc(m.name)}</td><td>STR+${fmtD(m.dmg)}</td><td>${esc(m.diff)}</td>
      <td><button class="mini danger" data-act="delOwn" data-list="melee" data-idx="${i2}">×</button></td></tr>`;
  }).join('');
  const rOwned = C.ranged.map((n, i2) => {
    const r = DATA.ranged.find(x => x.name === n); if (!r) return '';
    return `<tr><td>${esc(r.name)}</td><td>${esc(r.skill)}</td><td>${fmtD(r.dmg)}</td>
      <td>${esc(r.close)}/${esc(r.short)}/${esc(r.medium)}/${esc(r.long)}</td>
      <td><button class="mini danger" data-act="delOwn" data-list="ranged" data-idx="${i2}">×</button></td></tr>`;
  }).join('');
  /* Lichtschwerter sind hier absichtlich dabei: „lightsaber“ ist im D6-System
     eine Geschicklichkeits-Fertigkeit, keine Macht-Fertigkeit – Grievous und
     die HK-Serie führen kanonisch welche, ohne machtsensitiv zu sein. */
  const mCat = DATA.melee.map((m, i2) => `<option value="${i2}">${esc(m.name)} (STR+${fmtD(m.dmg)}, ${fmtCr(m.cost)} Cr.)</option>`).join('');
  const rCat = DATA.ranged.map((r, i2) => `<option value="${i2}">${esc(r.name)} (${fmtD(r.dmg)}, ${fmtCr(r.cost)} Cr.)</option>`).join('');
  return `
  <div class="card"><h2>${t('dr_weapons')}</h2>
    <h3>${t('dr_melee')}</h3>
    <div class="table-scroll"><table class="list"><tr><th>${t('weapon')}</th><th>${t('damage')}</th><th>${t('difficulty')}</th><th></th></tr>
      ${mOwned || `<tr><td colspan="4" class="hint">${t('none_dash')}</td></tr>`}</table></div>
    <p><select id="addMeleeSel">${mCat}</select> <button class="mini" data-act="addOwn" data-list="melee">+</button></p>
    <h3>${t('dr_ranged')}</h3>
    <div class="table-scroll"><table class="list"><tr><th>${t('weapon')}</th><th>${t('skill')}</th><th>${t('damage')}</th><th>${t('range_pkml')}</th><th></th></tr>
      ${rOwned || `<tr><td colspan="5" class="hint">${t('none_dash')}</td></tr>`}</table></div>
    <p><select id="addRangedSel">${rCat}</select> <button class="mini" data-act="addOwn" data-list="ranged">+</button></p>
  </div>
  ${customGearBlock()}
  ${pdfCatalogBlock('melee')}
  ${pdfCatalogBlock('ranged')}
  ${pdfCatalogBlock('equip')}
  ${eqBlocks}`;
}

/* Übernommene Einträge aus dem erweiterten Katalog */
function customGearBlock() {
  const rows = []
    .concat(C.customMelee.map((x, i2) => [x, 'customMelee', i2, t('dr_melee')]))
    .concat(C.customRanged.map((x, i2) => [x, 'customRanged', i2, t('dr_ranged')]))
    .concat(C.customEquipment.map((x, i2) => [x, 'customEquipment', i2, t('dr_equipment')]));
  if (!rows.length) return '';
  const body = rows.map(([x, list, i2, lab]) => `<tr>
    <td>${esc(x.name)}</td><td class="hint">${esc(lab)}</td>
    <td>${esc(x.dmg || x.note || '')}</td><td class="num">${fmtCr(x.cost || 0)}</td>
    <td><button class="mini danger" data-act="delCustomGear" data-list="${list}" data-idx="${i2}">×</button></td></tr>`).join('');
  return `<div class="card"><h2>${t('dr_custom_gear')}</h2>
    <div class="table-scroll"><table class="list">
      <tr><th>${t('name')}</th><th></th><th>${t('damage')} / ${t('note')}</th><th class="num">${t('cost')}</th><th></th></tr>
      ${body}</table></div></div>`;
}

/* ---------------- Druckbogen ---------------- */
function sheetField(lbl, val, span) {
  return `<div class="sp-field" style="grid-column: span ${span || 3}">
    <span class="lbl">${esc(lbl)}</span><span class="val">${esc(val) || '&nbsp;'}</span></div>`;
}
function renderSheet() {
  const i = C.info;
  const attrBlock = a => {
    const rows = skillsFor(a.key).filter(r => {
      const e = C.skills[skillKey(a.key, r.name)];
      return e && ((e.c || 0) + (e.cp || 0)) > 0;
    }).map(r => `<div class="sp-skill"><span>${r.spec ? '↳ ' : ''}${esc(skillName(r.name))}</span><span class="d">${fmtD(skillTotal(skillKey(a.key, r.name)))}</span></div>`).join('');
    return `<div class="sp-attr">
      <div class="ah"><span>${a.name}</span><span>${fmtD(attrTotal(a.key))}</span></div>${rows}</div>`;
  };
  const modRows = [];
  for (const [n, q] of Object.entries(C.mods)) {
    if (q > 0) {
      const m = DROID_DATA.mods.find(x => x.name === n);
      modRows.push(`<tr><td>${esc(n)}${q > 1 ? ' ×' + q : ''}</td><td>${esc(m ? m.desc : '')}</td></tr>`);
    }
  }
  /* Nachgerüstetes getrennt ausweisen – für den GM am Tisch der Unterschied
     zwischen „ab Werk“ und „später eingebaut“. */
  for (const [n, q] of Object.entries(C.modsCP)) {
    if (q > 0) {
      const m = DROID_DATA.mods.find(x => x.name === n);
      modRows.push(`<tr><td>${esc(n)}${q > 1 ? ' ×' + q : ''} <i>(${t('dr_mod_retrofit')})</i></td><td>${esc(m ? m.desc : '')}</td></tr>`);
    }
  }
  C.customMods.forEach(cm => { if (cm.name) modRows.push(`<tr><td>${esc(cm.name)}</td><td>${esc(cm.desc || '')}</td></tr>`); });
  const dbLines = [];
  [1, 2].forEach(n => {
    if (i['dbSkill' + n] !== 'None' && i['dbLevel' + n] !== 'None')
      dbLines.push(`${i['dbSkill' + n]} ${i['dbLevel' + n]}`);
  });
  const eqRows = [];
  Object.entries(C.equipment).forEach(([n, q]) => {
    if (q > 0) eqRows.push(esc(n) + (q > 1 ? ' ×' + q : ''));
  });
  const wLines = [];
  C.melee.forEach(n => { const m = DATA.melee.find(x => x.name === n); if (m) wLines.push(`${esc(m.name)} (STR+${fmtD(m.dmg)})`); });
  C.ranged.forEach(n => { const r = DATA.ranged.find(x => x.name === n); if (r) wLines.push(`${esc(r.name)} (${fmtD(r.dmg)}, ${esc(r.close)}/${esc(r.short)}/${esc(r.medium)}/${esc(r.long)})`); });
  const wound = t('droidWoundRows').map(r => `<tr><td>${r[0]}</td><td>${r[1]}</td><td>${r[2]}</td></tr>`).join('');

  const html = `
  <div class="sheet-page">
    <div class="sp-header"><div class="sw">STAR WARS</div><div class="st">${t('sheet_title_droid')}</div></div>
    ${typeof roundStampHtml === 'function' ? roundStampHtml() : ''}
    <div style="display:flex; gap:3mm; align-items:stretch">
    <div class="sp-grid" style="flex:1; align-content:start">
      ${sheetField(t('dr_name'), i.name, 6)}
      ${sheetField(t('dr_player'), i.player, 6)}
      ${sheetField(t('dr_degree'), i.degree, 6)}
      ${sheetField(t('dr_manufacturer'), i.manufacturer, 6)}
      ${sheetField(t('dr_locomotion'), i.locomotion, 4)}
      ${sheetField(t('dr_scale'), i.scale, 2)}
      ${sheetField(t('dr_move'), String(i.move || 0), 2)}
      ${sheetField(t('dr_matrix'), i.matrix, 4)}
      ${sheetField(t('dr_height'), i.height ? i.height + ' m' : '', 2)}
      ${sheetField(t('dr_weight'), i.weight ? i.weight + ' kg' : '', 2)}
      ${sheetField(t('dr_fp'), String(i.forcePoints || 0), 2)}
      ${sheetField('CP', String(cpLeft()), 2)}
      ${sheetField(t('dr_quote'), i.quote ? '„' + i.quote + '“' : '', 12)}
    </div>
    <div class="sp-portrait">
      ${i.portrait ? `<img src="${i.portrait}" alt="">` : `<span>${t('dr_portrait')}</span>`}
    </div>
    </div>
    <div class="sp-box"><h4>${t('tab_attrs')} &amp; ${t('tab_skills')}</h4>
      <div class="sp-cols3">
        <div>${attrBlock(ATTRS[0])}${attrBlock(ATTRS[1])}</div>
        <div>${attrBlock(ATTRS[2])}${attrBlock(ATTRS[3])}</div>
        <div>${attrBlock(ATTRS[4])}${attrBlock(ATTRS[5])}
          ${dbLines.length ? `<div class="sp-attr"><div class="ah"><span>${t('dr_dbline')}</span><span></span></div>
            ${dbLines.map(l => `<div class="sp-skill"><span>${esc(l)}</span></div>`).join('')}</div>` : ''}
        </div>
      </div>
    </div>
    <div class="sp-box"><h4>${t('dr_installed')}</h4>
      <table class="sp-table">${modRows.join('') || '<tr><td>–</td></tr>'}</table></div>
    <div class="sp-cols2">
      <div class="sp-box"><h4>${t('dr_weapons')} &amp; ${t('dr_equipment')}</h4>
        <div style="font-size:8.4pt">${wLines.concat(eqRows).join('<br>') || '–'}</div></div>
      <div class="sp-box"><h4>${t('wounds')}</h4>
        <table class="sp-table"><tr><th>${t('dmg_gt_str')}</th><th>${t('condition')}</th><th>${t('effect')}</th></tr>${wound}</table></div>
    </div>
    ${(i.description || i.personality) ? `<div class="sp-cols2">
      <div class="sp-box"><h4>${t('dr_desc')}</h4><div class="sp-lines" style="min-height:12mm">${esc(i.description)}</div></div>
      <div class="sp-box"><h4>${t('dr_personality')}</h4><div class="sp-lines" style="min-height:12mm">${esc(i.personality)}</div></div>
    </div>` : ''}
    <div class="sp-footer"><span>${t('sheet_footer')}</span><span>${t('tab_sheet')}</span></div>
  </div>`;
  document.getElementById('sheet-print').innerHTML = html;
  const tabEl = document.getElementById('tab-sheet');
  if (tabEl) tabEl.innerHTML = `
    <div class="card no-print"><h2>${t('tab_sheet')}</h2>
      <p>${t('sheet_preview')}</p>
      <p><button class="accent" data-act="print">${t('print_pdf')}</button></p>
    </div>${html}`;
}

/* ---------------- Seiten-Verkabelung ---------------- */
function renderTab(tab) {
  const el = document.getElementById('tab-' + tab);
  if (!el) return;
  switch (tab) {
    case 'model': el.innerHTML = viewModel(); break;
    case 'attrs': el.innerHTML = viewAttrs(); break;
    case 'skills': el.innerHTML = viewSkills(); break;
    case 'mods': el.innerHTML = viewMods(); break;
    case 'gear': el.innerHTML = viewGear(); break;
    case 'sheet': renderSheet(); break;
  }
}
function pageAction(el) {
  const dir = +el.dataset.dir || 0;
  switch (el.dataset.act) {
    case 'applyTemplate': applyDroidTemplate(); break;
    case 'pdfAdd': pdfAddDroid(el.dataset.kind, +el.dataset.i); break;
    case 'delCustomGear': C[el.dataset.list].splice(+el.dataset.idx, 1); update(); break;
    case 'attr': {
      const a = el.dataset.a;
      C.attrs[a] = Math.max(0, (C.attrs[a] || 0) + dir);
      update(); break;
    }
    case 'attrCP': {
      const a = el.dataset.a;
      C.attrsCP[a] = Math.max(0, (C.attrsCP[a] || 0) + dir);
      update(); break;
    }
    case 'skill': {
      const s = skillEntry(el.dataset.key);
      s.c = Math.max(0, Math.min(6, (s.c || 0) + dir));
      update(); break;
    }
    case 'skillCP': {
      const s = skillEntry(el.dataset.key);
      s.cp = Math.max(0, (s.cp || 0) + dir);
      update(); break;
    }
    case 'toggleSec':
      collapsedSecs[el.dataset.sec] = !collapsedSecs[el.dataset.sec];
      update(); break;
    case 'addSpec': {
      const name = prompt(t('prompt_spec'));
      if (name) {
        C.extraSkills.push({ name: name.trim(), attr: el.dataset.attr, spec: el.dataset.parent });
        update();
      }
      break;
    }
    case 'addCustomSkill': {
      const name = prompt(t('prompt_doc_name'));
      if (name) { C.extraSkills.push({ name: name.trim(), attr: el.dataset.attr, spec: null }); update(); }
      break;
    }
    case 'delExtra': {
      const i2 = +el.dataset.idx;
      if (i2 >= 0) {
        const ex = C.extraSkills[i2];
        if (ex) delete C.skills[skillKey(ex.attr, ex.name)];
        C.extraSkills.splice(i2, 1);
        update();
      }
      break;
    }
    case 'addCustomMod':
      C.customMods.push({ name: '', desc: '', pips: 0 });
      update(); break;
    case 'delCustomMod':
      C.customMods.splice(+el.dataset.idx, 1);
      update(); break;
    case 'addOwn': {
      const list = el.dataset.list;
      const sel = document.getElementById(list === 'melee' ? 'addMeleeSel' : 'addRangedSel');
      const item = (list === 'melee' ? DATA.melee : DATA.ranged)[+sel.value];
      if (item) { C[list].push(item.name); update(); }
      break;
    }
    case 'delOwn':
      C[el.dataset.list].splice(+el.dataset.idx, 1);
      update(); break;
  }
}
function pageChange(el) {
  if (el.id === 'tplDegree') {
    tplDegree = el.value; tplMsg = ''; update('model');
    return true;
  }
  if (el.id === 'tplSearch') {
    tplFilter = el.value; tplMsg = ''; update('model');
    const a = document.getElementById('tplSearch');
    if (a) { a.focus(); a.setSelectionRange(a.value.length, a.value.length); }
    return true;
  }
  if (el.dataset.pdfera != null) {
    pdfEra[el.dataset.pdfera] = el.value;
    update();
    return true;
  }
  if (el.dataset.pdfsearch != null) {
    pdfFilter[el.dataset.pdfsearch] = el.value;
    const pos = el.selectionStart; update();
    const a = document.querySelector(`[data-pdfsearch="${el.dataset.pdfsearch}"]`);
    if (a) { a.focus(); a.setSelectionRange(pos, pos); }
    return true;
  }
  if (el.dataset.modqty != null) {
    const q = Math.max(0, +el.value || 0);
    if (q) C.mods[el.dataset.modqty] = q; else delete C.mods[el.dataset.modqty];
    update();
    return true;
  }
  if (el.dataset.modcpqty != null) {
    const q = Math.max(0, +el.value || 0);
    if (q) C.modsCP[el.dataset.modcpqty] = q; else delete C.modsCP[el.dataset.modcpqty];
    update();
    return true;
  }
  if (el.dataset.eqqty != null) {
    const q = Math.max(0, +el.value || 0);
    if (q) C.equipment[el.dataset.eqqty] = q; else delete C.equipment[el.dataset.eqqty];
    update();
    return true;
  }
  return false;
}

document.addEventListener('DOMContentLoaded', () => initPage('model'));
