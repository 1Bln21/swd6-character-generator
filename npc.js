/* =====================================================================
   Star Wars D6 - NPC group generator (for game masters)
   ---------------------------------------------------------------------
   Builds whole NPC groups with compact statblocks: size, species mode
   (humans only / mixed / one species / aliens only) and a faction (Empire,
   Rebels, pirates, CIS ...). Built on genshared.js (t, esc, fmtD, C,
   autosave, renderAll, initPage) and data.js (species).
   ===================================================================== */
'use strict';

const PAGE_DOC_KIND = 'npc';
const LS_CURRENT = 'swd6_npc_current';
const LS_SAVED   = 'swd6_npc_saved';

/* ---------------- translations ---------------- */
Object.assign(T.de, {
  title: 'Star Wars D6 – NPC-Generator',
  subtitle: 'NPC-Gruppengenerator',
  nav_npc: 'NPCs',
  doc_one: 'NPC-Gruppe', doc_plural: 'NPC-Gruppen',
  tab_setup: 'Gruppe', tab_sheet: 'NPC-Bogen',
  sheet_title_npc: 'NSC-GRUPPE',
  npc_group_name: 'Gruppenname',
  npc_count: 'Anzahl NPCs',
  npc_species_mode: 'Spezies',
  npc_mode_human: 'Alle Menschen',
  npc_mode_mixed: 'Gemischt (Mensch-Mehrheit)',
  npc_mode_single: 'Eine Spezies',
  npc_mode_aliens: 'Nur Aliens (gemischt)',
  npc_species_pick: 'Spezies wählen',
  npc_faction: 'Fraktion / Beruf',
  npc_threat: 'Erfahrung / Gefährlichkeit',
  npc_threat_green: 'Grün (Kanonenfutter)',
  npc_threat_average: 'Durchschnitt',
  npc_threat_veteran: 'Veteran',
  npc_threat_elite: 'Elite',
  npc_generate: '🎲 Gruppe erzeugen',
  npc_add_one: '+ NPC hinzufügen',
  npc_reroll: 'neu würfeln',
  npc_remove: 'entfernen',
  npc_empty: 'Noch keine NPCs. Stelle oben die Gruppe ein und klicke „Gruppe erzeugen“.',
  npc_move: 'Bew.',
  npc_weapon: 'Waffe', npc_gear: 'Ausrüstung', npc_armor: 'Panzerung',
  npc_loot: 'Beute', npc_credits: 'Credits',
  npc_skills: 'Fertigkeiten',
  npc_species_col: 'Spezies',
  npc_count_hint: '1–30 NPCs pro Gruppe.',
  npc_mixed_note: 'Bei „Gemischt“ stellt Star Wars-typisch der Mensch-Anteil die Mehrheit.',
  npc_wounds: 'Zustand',
  npc_w_stun: 'Betäubt', npc_w_wound: 'Verwundet', npc_w_incap: 'Kampfunf.', npc_w_mortal: 'Sterbend',
  fac_imperial: 'Imperium', fac_rebel: 'Rebellen-Allianz', fac_pirate: 'Piraten',
  fac_cis: 'CIS / Separatisten', fac_bounty: 'Kopfgeldjäger', fac_crime: 'Verbrechersyndikat',
  fac_merc: 'Söldner', fac_civilian: 'Zivilisten',
  fac_trader: 'Händler', fac_customs: 'Zollbeamte', fac_smuggler: 'Schmuggler',
  fac_pilot: 'Piloten', fac_mechanic: 'Mechaniker', fac_medic: 'Sanitäter',
  fac_scout: 'Kundschafter', fac_official: 'Beamte',
  npc_gen: 'Was erzeugen?', npc_gen_people: 'Personen', npc_gen_ships: 'Schiffe',
  npc_troop: 'Truppe zusammenstellen',
  npc_troop_add: '+ Rolle hinzufügen',
  npc_troop_hint: 'Je Zeile eine Rolle mit eigener Anzahl – z. B. 6 Sturmtruppen und 2 Offiziere. Gesamt: {n} NPCs. Spezies-Verteilung und Erfahrungsstufe gelten für die ganze Truppe.',
  npc_fleet: 'Flotte zusammenstellen',
  npc_fleet_hint: 'Anzahl je Klasse; 0 lässt die Klasse weg. Gesamt: {n} Schiffe. „Baugleich“ gilt nur für die eigene Klasse – 4 baugleiche Jäger und 2 baugleiche Transporter sind zwei verschiedene Modelle.',
  npc_fleet_avail: '{n} Vorlagen',
  npc_fleet_none: 'keine Vorlage in dieser Ära',
  npc_same_ship_on: 'baugleich',
  npc_ships_nopool: 'Diese Kombination aus Klassen und Ära enthält keine Vorlagen. Ära weiter fassen oder eine Klasse dazunehmen.',
  npc_size_starfighter: 'Jäger', npc_size_transport: 'Space Transport', npc_size_capital: 'Capital',
  npc_ship_crew: 'Crew (Steuern/Bordgeschütze)', npc_ship_extra: 'Extra-Waffen',
  npc_ships_empty: 'Noch keine Schiffe. Anzahl je Klasse setzen und „Gruppe erzeugen“.',
  npc_add_ship: '+ Schiff hinzufügen',
  npc_ship_hint: 'Zufällige Schiffe der gewählten Klassen und Ära aus dem Katalog; Crew-Würfel und Extra-Waffen richten sich nach der Erfahrungsstufe.',
});
Object.assign(T.en, {
  title: 'Star Wars D6 – NPC Generator',
  subtitle: 'NPC group generator',
  nav_npc: 'NPCs',
  doc_one: 'NPC group', doc_plural: 'NPC groups',
  tab_setup: 'Group', tab_sheet: 'NPC sheet',
  sheet_title_npc: 'NPC GROUP',
  npc_group_name: 'Group name',
  npc_count: 'Number of NPCs',
  npc_species_mode: 'Species',
  npc_mode_human: 'All human',
  npc_mode_mixed: 'Mixed (human majority)',
  npc_mode_single: 'One species',
  npc_mode_aliens: 'Aliens only (mixed)',
  npc_species_pick: 'Choose species',
  npc_faction: 'Faction / profession',
  npc_threat: 'Experience / threat',
  npc_threat_green: 'Green (cannon fodder)',
  npc_threat_average: 'Average',
  npc_threat_veteran: 'Veteran',
  npc_threat_elite: 'Elite',
  npc_generate: '🎲 Generate group',
  npc_add_one: '+ Add NPC',
  npc_reroll: 're-roll',
  npc_remove: 'remove',
  npc_empty: 'No NPCs yet. Set up the group above and click “Generate group”.',
  npc_move: 'Move',
  npc_weapon: 'Weapon', npc_gear: 'Gear', npc_armor: 'Armor',
  npc_loot: 'Loot', npc_credits: 'credits',
  npc_skills: 'Skills',
  npc_species_col: 'Species',
  npc_count_hint: '1–30 NPCs per group.',
  npc_mixed_note: 'With “Mixed”, humans form the majority, as is typical for Star Wars.',
  npc_wounds: 'Condition',
  npc_w_stun: 'Stunned', npc_w_wound: 'Wounded', npc_w_incap: 'Incap.', npc_w_mortal: 'Mortally W.',
  fac_imperial: 'Empire', fac_rebel: 'Rebel Alliance', fac_pirate: 'Pirates',
  fac_cis: 'CIS / Separatists', fac_bounty: 'Bounty hunters', fac_crime: 'Crime syndicate',
  fac_merc: 'Mercenaries', fac_civilian: 'Civilians',
  fac_trader: 'Traders', fac_customs: 'Customs officers', fac_smuggler: 'Smugglers',
  fac_pilot: 'Pilots', fac_mechanic: 'Mechanics', fac_medic: 'Medics',
  fac_scout: 'Scouts', fac_official: 'Officials',
  npc_gen: 'Generate what?', npc_gen_people: 'People', npc_gen_ships: 'Ships',
  npc_troop: 'Compose the group',
  npc_troop_add: '+ Add role',
  npc_troop_hint: 'One role per row with its own count – e.g. 6 stormtroopers and 2 officers. Total: {n} NPCs. Species mix and experience level apply to the whole group.',
  npc_fleet: 'Compose the flight',
  npc_fleet_hint: 'Count per class; 0 leaves the class out. Total: {n} ships. “Identical” applies within its own class only – 4 identical starfighters and 2 identical transports are two different models.',
  npc_fleet_avail: '{n} templates',
  npc_fleet_none: 'no template in this era',
  npc_same_ship_on: 'identical',
  npc_ships_nopool: 'No templates match this combination of classes and era. Widen the era or add a class.',
  npc_size_starfighter: 'Starfighter', npc_size_transport: 'Space transport', npc_size_capital: 'Capital',
  npc_ship_crew: 'Crew (piloting/gunnery)', npc_ship_extra: 'extra weapons',
  npc_ships_empty: 'No ships yet. Set a count per class, then “Generate group”.',
  npc_add_ship: '+ Add ship',
  npc_ship_hint: 'Random ships of the chosen classes and era from the catalog; crew dice and extra weapons scale with the experience level.',
});

/* ---------------- game values ---------------- */
/* Attribute order as in DATA.species: dex, kno, mec, per, str, tec */
const NPC_ATTRS = [
  { key: 'dex', name: 'Dexterity' }, { key: 'kno', name: 'Knowledge' },
  { key: 'mec', name: 'Mechanical' }, { key: 'per', name: 'Perception' },
  { key: 'str', name: 'Strength' }, { key: 'tec', name: 'Technical' },
];
const AI = { dex: 0, kno: 1, mec: 2, per: 3, str: 4, tec: 5 };

/* Threat levels: target attribute total (pips) + skill bonus range (pips) */
const NPC_THREAT = {
  green:   { attr: 33, skillMin: 0, skillMax: 3 },
  average: { attr: 42, skillMin: 3, skillMax: 6 },
  veteran: { attr: 51, skillMin: 6, skillMax: 10 },
  elite:   { attr: 60, skillMin: 9, skillMax: 13 },
};

/* Faction archetypes. focus = weight per attribute (dex,kno,mec,per,str,tec)
   when distributing attributes. skills: {name (EN, localised via skillName),
   attr}. weapon: {name (EN), dmg (pips) OR str:+pips for melee, rng}.
   armor = pips. */
const NPC_FACTIONS = {
  imperial: {
    focus: [3, 1, 1, 2, 2, 1], armor: 3,
    skills: [['Blaster', 'dex'], ['Dodge', 'dex'], ['Brawling', 'str'], ['Search', 'per']],
    weapon: { name: 'Blaster Rifle', dmg: 15, rng: '3-30/100/300' },
    gear: { de: 'Sturmtruppen-Rüstung (+1D), Komlink', en: 'Stormtrooper armor (+1D), comlink' },
  },
  rebel: {
    focus: [3, 1, 2, 2, 2, 1], armor: 0,
    skills: [['Blaster', 'dex'], ['Dodge', 'dex'], ['Brawling', 'str'], ['First Aid', 'tec']],
    weapon: { name: 'Blaster Rifle', dmg: 15, rng: '3-30/100/300' },
    gear: { de: 'Blaster-Gaskartuschen, Komlink', en: 'Power packs, comlink' },
  },
  pirate: {
    focus: [3, 1, 1, 2, 3, 1], armor: 1,
    skills: [['Blaster', 'dex'], ['Dodge', 'dex'], ['Brawling', 'str'], ['Streetwise', 'kno']],
    weapon: { name: 'Blaster Pistol', dmg: 12, rng: '3-10/30/120' },
    gear: { de: 'Vibromesser (STR+1D), Beutetaschen', en: 'Vibroblade (STR+1D), loot pouches' },
  },
  cis: {
    focus: [3, 1, 2, 2, 1, 2], armor: 1,
    skills: [['Blaster', 'dex'], ['Dodge', 'dex'], ['Search', 'per']],
    weapon: { name: 'Blaster Pistol', dmg: 12, rng: '3-10/30/120' },
    gear: { de: 'Komlink, Datenpad', en: 'Comlink, datapad' },
  },
  bounty: {
    focus: [3, 1, 1, 3, 2, 1], armor: 2,
    skills: [['Blaster', 'dex'], ['Dodge', 'dex'], ['Brawling', 'str'], ['Search', 'per'], ['Streetwise', 'kno']],
    weapon: { name: 'Blaster Rifle', dmg: 15, rng: '3-30/100/300' },
    gear: { de: 'Panzerung (+1D), Handfesseln, Betäubungsgranate', en: 'Armor (+1D), binders, stun grenade' },
  },
  crime: {
    focus: [2, 1, 1, 2, 3, 1], armor: 0,
    skills: [['Brawling', 'str'], ['Blaster', 'dex'], ['Intimidation', 'per'], ['Gambling', 'kno']],
    weapon: { name: 'Hold-out Blaster', dmg: 9, rng: '3-4/8/12' },
    gear: { de: 'Knüppel (STR+1D), Credits-Chips', en: 'Club (STR+1D), credit chips' },
  },
  merc: {
    focus: [3, 1, 2, 2, 2, 1], armor: 2,
    skills: [['Blaster', 'dex'], ['Dodge', 'dex'], ['Grenade', 'dex'], ['Brawling', 'str']],
    weapon: { name: 'Blaster Rifle', dmg: 15, rng: '3-30/100/300' },
    gear: { de: 'Panzerweste (+1D), 2 Granaten (5D)', en: 'Armored vest (+1D), 2 grenades (5D)' },
  },
  civilian: {
    focus: [1, 2, 1, 2, 1, 2], armor: 0,
    skills: [['Dodge', 'dex'], ['Bargain', 'per']],
    weapon: { name: 'Hold-out Blaster', dmg: 9, rng: '3-4/8/12' },
    gear: { de: 'Alltagskleidung, Komlink', en: 'Everyday clothing, comlink' },
  },
  /* ---- trades and roles: non-combat NPCs with the skills to match ---- */
  trader: {
    focus: [1, 3, 2, 3, 1, 1], armor: 0,
    skills: [['Bargain', 'per'], ['Value', 'kno'], ['Streetwise', 'kno'], ['Con', 'per'], ['Space Transports', 'mec']],
    weapon: { name: 'Hold-out Blaster', dmg: 9, rng: '3-4/8/12' },
    gear: { de: 'Datenpad, Waren-Manifest, Credits-Chips', en: 'Datapad, cargo manifest, credit chips' },
  },
  customs: {
    focus: [2, 3, 2, 3, 1, 1], armor: 1,
    skills: [['Search', 'per'], ['Investigation', 'per'], ['Bureaucracy', 'kno'], ['Law Enforcement', 'kno'], ['Blaster', 'dex'], ['Space Transports', 'mec']],
    weapon: { name: 'Blaster Pistol', dmg: 12, rng: '3-10/30/120' },
    gear: { de: 'Handscanner, Datenpad, Uniform', en: 'Hand scanner, datapad, uniform' },
  },
  smuggler: {
    focus: [2, 2, 3, 2, 1, 1], armor: 0,
    skills: [['Space Transports', 'mec'], ['Astrogation', 'mec'], ['Con', 'per'], ['Sneak', 'per'], ['Streetwise', 'kno'], ['Blaster', 'dex']],
    weapon: { name: 'Blaster Pistol', dmg: 12, rng: '3-10/30/120' },
    gear: { de: 'Verstecktes Frachtfach, Komlink', en: 'Hidden cargo compartment, comlink' },
  },
  pilot: {
    focus: [2, 1, 3, 2, 1, 1], armor: 0,
    skills: [['Space Transports', 'mec'], ['Starfighter Piloting', 'mec'], ['Astrogation', 'mec'], ['Starship Gunnery', 'mec'], ['Starship Shields', 'mec']],
    weapon: { name: 'Blaster Pistol', dmg: 12, rng: '3-10/30/120' },
    gear: { de: 'Fluganzug, Komlink', en: 'Flight suit, comlink' },
  },
  mechanic: {
    focus: [1, 1, 2, 1, 1, 3], armor: 0,
    skills: [['Space Transports Repair', 'tec'], ['Computer Programming/Repair', 'tec'], ['Blaster Repair', 'tec'], ['Droid Programming/Repair', 'tec']],
    weapon: { name: 'Hold-out Blaster', dmg: 9, rng: '3-4/8/12' },
    gear: { de: 'Werkzeugsatz, Diagnose-Scanner, Ersatzteile', en: 'Toolkit, diagnostic scanner, spare parts' },
  },
  medic: {
    focus: [1, 2, 1, 2, 1, 3], armor: 0,
    skills: [['First Aid', 'tec'], ['(A) Medicine', 'tec'], ['Bargain', 'per']],
    weapon: { name: 'Hold-out Blaster', dmg: 9, rng: '3-4/8/12' },
    gear: { de: 'Medpac, Diagnose-Scanner', en: 'Medpac, diagnostic scanner' },
  },
  scout: {
    focus: [2, 2, 2, 3, 1, 1], armor: 0,
    skills: [['Astrogation', 'mec'], ['Sensors', 'mec'], ['Survival', 'kno'], ['Search', 'per'], ['Beast Riding', 'mec']],
    weapon: { name: 'Blaster Rifle', dmg: 15, rng: '3-30/100/300' },
    gear: { de: 'Vorräte, Makrofernglas, Komlink', en: 'Supplies, macrobinoculars, comlink' },
  },
  official: {
    focus: [1, 3, 1, 3, 1, 1], armor: 0,
    skills: [['Bureaucracy', 'kno'], ['Persuasion', 'per'], ['Business', 'kno'], ['Law Enforcement', 'kno']],
    weapon: { name: 'Hold-out Blaster', dmg: 9, rng: '3-4/8/12' },
    gear: { de: 'Datenpad, Amtsausweis', en: 'Datapad, credentials' },
  },
};
const FACTION_ORDER = ['imperial', 'rebel', 'pirate', 'cis', 'bounty', 'crime', 'merc', 'civilian',
  'trader', 'customs', 'smuggler', 'pilot', 'mechanic', 'medic', 'scout', 'official'];

/* Alien pool for "mixed" / "aliens only" - filtered at run time down to the
   names DATA.species actually holds. */
const NPC_ALIEN_POOL = ['Rodian', "Twi'lek", 'Duros', 'Bothan', 'Trandoshan', 'Wookiee',
  'Sullustan', 'Gran', 'Quarren', 'Zabrak', 'Gamorrean', 'Devaronian', 'Ithorian', 'Aqualish'];

/* name components */
const NPC_HUMAN_FIRST = ['Kael', 'Drenn', 'Mara', 'Jorin', 'Talon', 'Vesa', 'Cade', 'Nyla',
  'Rurik', 'Sella', 'Bran', 'Ione', 'Garr', 'Lenn', 'Tavi', 'Marek', 'Dessa', 'Corlan'];
const NPC_HUMAN_LAST = ['Vane', 'Korr', 'Halcyon', 'Detta', 'Ryland', 'Sunder', 'Mott',
  'Kryze', 'Valen', 'Fenn', 'Brint', 'Solace', 'Wren', 'Antilles', 'Vos', 'Terrik'];
const NPC_ALIEN_SYL = ['va', 'to', 'ka', 'ru', 'zi', 'na', 'do', 'sh', 'ee', 'ba', 'qu', 'ok',
  'ta', 'mo', 'lu', 'gi', 'ce', 'ro', 'wa', 'th'];

/* ---------------- randomness (deterministic per roll) ---------------- */
function rngInt(n) { return Math.floor(Math.random() * n); }
function rngPick(arr) { return arr[rngInt(arr.length)]; }
function rngRange(a, b) { return a + rngInt(b - a + 1); }
function shuffled(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) { const j = rngInt(i + 1); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}

/* ---------------- species access ---------------- */
function npcSpecies(name) {
  const sp = (DATA.species || []).find(s => s.name === name);
  if (sp) return sp;
  /* fall back on human */
  return { name: name || 'Human', min: [6, 6, 6, 6, 6, 6], max: [12, 12, 12, 12, 12, 12], move: 10 };
}
function npcAlienPool() {
  const have = new Set((DATA.species || []).map(s => s.name));
  return NPC_ALIEN_POOL.filter(n => have.has(n));
}
function allSpeciesNames() {
  return (DATA.species || []).map(s => s.name).sort((a, b) => a.localeCompare(b));
}

/* ---------------- name generator ---------------- */
function npcName(speciesName) {
  if (speciesName === 'Human') return rngPick(NPC_HUMAN_FIRST) + ' ' + rngPick(NPC_HUMAN_LAST);
  const parts = rngRange(2, 3);
  let s = '';
  for (let i = 0; i < parts; i++) s += rngPick(NPC_ALIEN_SYL);
  s = s.charAt(0).toUpperCase() + s.slice(1);
  if (rngInt(2)) s += "'" + rngPick(NPC_ALIEN_SYL);
  return s;
}

/* ---------------- species distribution ---------------- */
function roundRobin(n, arr) {
  const out = [];
  for (let i = 0; i < n; i++) out.push(arr[i % arr.length]);
  return out;
}
function buildSpeciesList(count, mode, single) {
  if (mode === 'human') return Array(count).fill('Human');
  if (mode === 'single') return Array(count).fill(single || 'Human');
  const pool = npcAlienPool();
  if (!pool.length) return Array(count).fill('Human');
  if (mode === 'aliens') {
    const k = Math.min(pool.length, Math.max(1, Math.min(4, count)));
    return shuffled(roundRobin(count, shuffled(pool).slice(0, k)));
  }
  /* mixed: humans form the majority (a little above any alien group) */
  const k = Math.min(pool.length, count <= 2 ? 1 : rngRange(2, 3));
  const aliens = shuffled(pool).slice(0, Math.max(1, k));
  let humans = Math.max(1, Math.round(count * (0.4 + Math.random() * 0.15)));
  let rest = count - humans;
  let maxAlien = Math.ceil(rest / aliens.length);
  while (humans <= maxAlien && humans < count) {
    humans++; rest = count - humans; maxAlien = Math.ceil(rest / aliens.length);
  }
  const list = Array(humans).fill('Human').concat(roundRobin(rest, aliens));
  return shuffled(list);
}

/* ---------------- one NPC ---------------- */
function genAttrs(sp, targetPips, focus) {
  const pips = sp.min.slice();
  const cap = sp.max.slice();
  const floor = pips.reduce((a, b) => a + b, 0);
  const ceil = cap.reduce((a, b) => a + b, 0);
  let target = Math.max(floor, Math.min(targetPips, ceil));
  let cur = floor, guard = 0;
  while (cur < target && guard++ < 2000) {
    /* weighted pick of an attribute that has not hit its cap yet */
    const avail = [];
    for (let i = 0; i < 6; i++) if (pips[i] < cap[i]) for (let w = 0; w < focus[i]; w++) avail.push(i);
    if (!avail.length) break;
    pips[rngPick(avail)]++; cur++;
  }
  return pips;
}
/* ---------------- loot ----------------
   What the party finds when it searches the NPC. Credits by how dangerous
   they are (a greenhorn does not walk around with 2000 credits), plus one
   or two finds from the faction pot and the general one. */
const NPC_LOOT_CREDITS = {
  green:   [5, 50],
  average: [25, 200],
  veteran: [100, 600],
  elite:   [250, 1500],
};
const NPC_LOOT_ITEMS = {
  imperial: [['Imperialer Codezylinder', 'Imperial code cylinder'],
             ['Dienstmarke mit Rangabzeichen', 'Service badge with rank insignia'],
             ['Rationen (2 Tage)', 'Field rations (2 days)']],
  rebel:    [['Verschlüsselter Datenchip', 'Encrypted data chip'],
             ['Ersatz-Gaskartuschen', 'Spare power packs'],
             ['Gefälschte Ausweispapiere', 'Forged identification']],
  pirate:   [['Beutesack mit Schmuck', 'Pouch of looted jewelry'],
             ['Gestohlener Komlink', 'Stolen comlink'],
             ['Sternenkarte mit Schmuggelrouten', 'Star chart with smuggling routes']],
  cis:      [['Droiden-Ersatzteile', 'Droid spare parts'],
             ['Separatisten-Signalgeber', 'Separatist signal beacon']],
  bounty:   [['Kopfgeld-Datapad mit Zielen', 'Bounty datapad with targets'],
             ['Handfesseln', 'Binders'], ['Betäubungsgranate', 'Stun grenade']],
  crime:    [['Credit-Chips (nicht registriert)', 'Unregistered credit chips'],
             ['Päckchen Spice', 'Packet of spice'], ['Schuldschein', 'IOU note']],
  merc:     [['Söldnervertrag', 'Mercenary contract'], ['Medpac', 'Medpac']],
  civilian: [['Familienfoto-Holo', 'Family holo'], ['Hausschlüssel-Chip', 'Door key chip']],
  common:   [['Komlink', 'Comlink'], ['Trinkflasche', 'Canteen'],
             ['Werkzeugsatz', 'Tool kit'], ['Datapad', 'Datapad'],
             ['Glücksbringer', 'Lucky charm']],
};
function genLoot(factionId, threatId) {
  const rangeC = NPC_LOOT_CREDITS[threatId] || NPC_LOOT_CREDITS.average;
  const credits = Math.round(rngRange(rangeC[0], rangeC[1]) / 5) * 5;
  const pot = (NPC_LOOT_ITEMS[factionId] || []).concat(NPC_LOOT_ITEMS.common);
  const picked = [];
  const want = 1 + rngInt(2);                      // one or two finds
  while (picked.length < want && picked.length < pot.length) {
    const cand = pot[rngInt(pot.length)];
    if (!picked.includes(cand)) picked.push(cand);
  }
  return { credits, itemsDe: picked.map(x => x[0]), itemsEn: picked.map(x => x[1]) };
}

function genNPC(speciesName, factionId, threatId) {
  const sp = npcSpecies(speciesName);
  const fac = NPC_FACTIONS[factionId] || NPC_FACTIONS.imperial;
  const th = NPC_THREAT[threatId] || NPC_THREAT.average;
  const attrs = genAttrs(sp, th.attr, fac.focus);
  const skills = fac.skills.map(([name, attr]) => ({
    name, attr, pips: attrs[AI[attr]] + rngRange(th.skillMin, th.skillMax),
  }));
  const weapon = Object.assign({}, fac.weapon);
  if (weapon.str != null) weapon.dmg = attrs[AI.str] + weapon.str;   // melee: STR + bonus
  return {
    name: npcName(speciesName),
    species: speciesName,
    /* The role belongs to the figure, not to the group - one squad can
       hold stormtroopers AND officers. */
    faction: NPC_FACTIONS[factionId] ? factionId : 'imperial',
    attrs, skills, weapon,
    move: sp.move || 10,
    armor: fac.armor || 0,
    gearDe: fac.gear.de, gearEn: fac.gear.en,
    loot: genLoot(factionId, threatId),
  };
}

/* ---------------- document ---------------- */
/* Clean up documents from elsewhere. Strings are escaped while rendering;
   what matters here are the fields used on as a number or as a translation
   key - those otherwise end up in the markup raw. */
function sanitizeNpc(n) {
  if (!n || typeof n !== 'object') return { name: '', species: '', attrs: [], skills: [], weapon: {} };
  n.move = +n.move || 0;
  n.armor = +n.armor || 0;
  if (!NPC_FACTIONS[n.faction]) n.faction = 'imperial';
  if (n.loot && typeof n.loot === 'object') {
    n.loot.credits = +n.loot.credits || 0;
    /* The sheet reads itemsDe/itemsEn without a guard. If a foreign
       document lacks them, rendering of the WHOLE group breaks off - a game
       master would see nothing but a blank page. */
    if (!Array.isArray(n.loot.itemsDe)) n.loot.itemsDe = [];
    if (!Array.isArray(n.loot.itemsEn)) n.loot.itemsEn = [];
  } else {
    n.loot = null;
  }
  if (!Array.isArray(n.attrs)) n.attrs = [];
  if (!Array.isArray(n.skills)) n.skills = [];
  if (!n.weapon || typeof n.weapon !== 'object') n.weapon = { name: '', dmg: 0 };
  return n;
}
function sanitizeShip(s) {
  if (!s || typeof s !== 'object') return { name: '', craft: '', weapons: [] };
  s.crewPips = +s.crewPips || 0;
  s.extra = +s.extra || 0;
  if (!Array.isArray(s.weapons)) s.weapons = [];
  return s;
}
function emptyDoc() {
  return {
    version: 1, kind: 'npc',
    info: { name: '' },
    setup: { count: 6, gen: 'people', mode: 'mixed', species: 'Human',
             faction: 'imperial', threat: 'average',
             /* A squad of several roles: 6 stormtroopers + 2 officers,
                rather than one single faction for the whole group. */
             troop: [{ faction: 'imperial', n: 6 }],
             /* Several classes at once: a patrol of fighters AND a
                transport is the normal case, not the exception. */
             /* Count AND "identical" kept separate per class: a patrol of
                4 identical fighters and 2 identical transports is the normal
                case, not 6 craft of the same model. */
             shipCounts: { starfighter: 0, transport: 6, capital: 0 },
             shipSame:   { starfighter: false, transport: false, capital: false },
             shipEra: '' },
    npcs: [], ships: [],
  };
}
let C = emptyDoc();
function migrate(obj) {
  const d = emptyDoc();
  if (obj && typeof obj === 'object') {
    if (obj.info) d.info.name = obj.info.name || '';
    if (obj.setup) Object.assign(d.setup, obj.setup);
    /* Up to 3.8.0.2 there was exactly ONE class (setup.shipSize) and one
       total (setup.count). The test has to hang on the INCOMING object:
       emptyDoc() always fills d.setup, so testing that would discard the old
       value silently. */
    const alt = obj.setup || {};
    /* Up to 3.8.0.2 ONE faction (setup.faction) covered setup.count people. */
    if (!Array.isArray(alt.troop) || !alt.troop.length) {
      d.setup.troop = [{ faction: FACTION_ORDER.includes(alt.faction) ? alt.faction : 'imperial',
                         n: Math.max(1, Math.min(30, +alt.count || 6)) }];
    }
    d.setup.troop = d.setup.troop
      .filter(r => r && FACTION_ORDER.includes(r.faction))
      .map(r => ({ faction: r.faction, n: Math.max(0, Math.min(30, +r.n || 0)) }));
    if (!d.setup.troop.length) d.setup.troop = [{ faction: 'imperial', n: 6 }];
    if (!alt.shipCounts) {
      const k = SHIP_SIZES.includes(alt.shipSize) ? alt.shipSize : 'transport';
      d.setup.shipCounts = { starfighter: 0, transport: 0, capital: 0 };
      d.setup.shipCounts[k] = Math.max(1, Math.min(30, +alt.count || 6));
    }
    /* Known classes only, valid numbers only - and never everything at zero. */
    SHIP_SIZES.forEach(k => {
      d.setup.shipCounts[k] = Math.max(0, Math.min(30, +d.setup.shipCounts[k] || 0));
      d.setup.shipSame[k] = !!d.setup.shipSame[k];
    });
    if (!shipTotal(d.setup)) d.setup.shipCounts.transport = 6;
    /* Check select fields against their known values. A foreign document
       with an unknown era would otherwise produce an empty fleet without a
       word - the pool filters on a value no entry carries. */
    const eras = (typeof PDF_ERAS !== 'undefined') ? PDF_ERAS : [];
    if (eras.indexOf(d.setup.shipEra) < 0) d.setup.shipEra = '';
    if (['people', 'ships'].indexOf(d.setup.gen) < 0) d.setup.gen = 'people';
    if (!NPC_THREAT[d.setup.threat]) d.setup.threat = 'average';
    if (['human', 'mixed', 'single', 'aliens'].indexOf(d.setup.mode) < 0) d.setup.mode = 'mixed';
    delete d.setup.shipSize;
    delete d.setup.shipSizes;
    delete d.setup.sameShip;
    /* The cards arrive unchecked from the file or from the cloud - a sheet
       imported or approved in a round is foreign input. So force numeric
       fields hard to numbers and check the faction against the known list,
       so none of it reaches the markup raw. */
    if (Array.isArray(obj.npcs)) d.npcs = obj.npcs.map(sanitizeNpc);
    if (Array.isArray(obj.ships)) d.ships = obj.ships.map(sanitizeShip);
    if (obj._cloudId) d._cloudId = obj._cloudId;
  }
  return d;
}

/* ---------------- NPC ships ---------------- */
const SHIP_SIZES = ['starfighter', 'transport', 'capital'];
/* Files a catalogue entry under a size category. */
function npcShipCat(s) {
  const scale = s.scale, skill = (s.skill || '').toLowerCase();
  if (scale === 'Capital') return 'capital';
  if (skill.indexOf('space transport') >= 0) return 'transport';
  if (scale === 'Starfighter') return 'starfighter';
  return null;   // vehicles and the rest
}
/* Crew dice (piloting/gunnery, in pips) per threat level. */
const NPC_SHIP_CREW = { green: 9, average: 12, veteran: 15, elite: 21 };
/* Ship pool by class and era. With no era chosen everything counts, the 72
   entries with no era among them - which would otherwise be dropped for no
   good reason. */
/* ship.js has an eraOptions() of its own - npc.html does not load ship.js,
   but the era_* texts live in genshared.js and apply here just the same. */
function npcEraOptions(selected) {
  const list = (typeof PDF_ERAS !== 'undefined') ? PDF_ERAS : [];
  return [`<option value="">${t('era_all')}</option>`].concat(
    list.map(e => `<option ${selected === e ? 'selected' : ''} value="${e}">${t('era_' + e.replace('-', '_'))}</option>`)
  ).join('');
}
function shipPool(sizes, era) {
  const want = (sizes && sizes.length) ? sizes : SHIP_SIZES;
  return (typeof PDF_SHIPS !== 'undefined' ? PDF_SHIPS : [])
    .filter(x => want.indexOf(npcShipCat(x)) >= 0 && (!era || x.era === era));
}
function shipEntry(src, crewPips, extra) {
  return {
    name: src.name, craft: src.craft || '', scale: src.scale || '',
    hull: src.hull || '', shields: src.shields || '', maneuver: src.maneuver || '',
    space: src.space || '', hyper: src.hyper || '',
    weapons: (src.weapons || []).map(w => (w && (w.name || w)) || '').filter(Boolean).slice(0, 6),
    crewPips, extra,
  };
}
function troopTotal(s) {
  return (s.troop || []).reduce((a, r) => a + (+r.n || 0), 0);
}
function shipTotal(s) {
  return SHIP_SIZES.reduce((a, k) => a + (+((s.shipCounts || {})[k]) || 0), 0);
}
/* Builds the group class by class: every class has its own count and its
   own "identical" flag. When identical, the model (crew and extra armament
   included) is drawn ONCE for that class. */
function genShips(setup) {
  const threat = setup.threat, era = setup.shipEra;
  const th = NPC_THREAT[threat] || NPC_THREAT.average;
  const base = NPC_SHIP_CREW[threat] || 12;
  const crewRoll = () => base + rngRange(0, th.skillMax);
  const extraRoll = () => (threat === 'veteran' || threat === 'elite') ? rngRange(1, 2) : 0;
  const out = [];
  SHIP_SIZES.forEach(k => {
    const n = Math.max(0, Math.min(30, +((setup.shipCounts || {})[k]) || 0));
    if (!n) return;
    const pool = shipPool([k], era);
    if (!pool.length) return;                  // that class is empty in this era
    if ((setup.shipSame || {})[k]) {
      const src = rngPick(pool), c = crewRoll(), e = extraRoll();
      for (let i = 0; i < n; i++) out.push(shipEntry(src, c, e));
    } else {
      for (let i = 0; i < n; i++) out.push(shipEntry(rngPick(pool), crewRoll(), extraRoll()));
    }
  });
  return out;
}
/* Draw a single further ship (+ / reroll). It is drawn from the classes
   that were asked for at all; "identical" deliberately does NOT apply here -
   anyone rerolling a card wants some variety. */
function genOneShip() {
  const s = C.setup;
  const active = SHIP_SIZES.filter(k => +((s.shipCounts || {})[k]) > 0);
  const pool = shipPool(active.length ? active : SHIP_SIZES, s.shipEra);
  if (!pool.length) return null;
  const th = NPC_THREAT[s.threat] || NPC_THREAT.average;
  const base = NPC_SHIP_CREW[s.threat] || 12;
  return shipEntry(rngPick(pool), base + rngRange(0, th.skillMax),
                   (s.threat === 'veteran' || s.threat === 'elite') ? rngRange(1, 2) : 0);
}

function generateGroup() {
  const s = C.setup;
  const n = Math.max(1, Math.min(30, +s.count || 1));
  s.count = n;   /* now only a fallback for old saves; the rows are what count */
  if (s.gen === 'ships') {
    C.ships = genShips(s);
  } else {
    /* The species distribution covers the WHOLE squad (otherwise every role
       would get a human majority of its own); the faction, by contrast, goes
       row by row. */
    const roles = [];
    s.troop.forEach(r => { for (let i = 0; i < r.n; i++) roles.push(r.faction); });
    if (!roles.length) roles.push(s.troop[0] ? s.troop[0].faction : 'imperial');
    const speciesList = buildSpeciesList(roles.length, s.mode, s.species);
    C.npcs = speciesList.map((sp, i) => genNPC(sp, roles[i], s.threat));
  }
  autosave();
}
function shipCard(sh, i, editable) {
  return `<div class="npc-card">
    <div class="npc-head">
      ${editable
        ? `<input type="text" class="npc-name-in" data-shipname="${i}" value="${esc(sh.name)}">`
        : `<span class="npc-name">${esc(sh.name)}</span>`}
      <span class="npc-sub">${esc(sh.craft)} · ${esc(sh.scale)}</span>
      ${editable ? `<span class="npc-actions">
        <button class="mini" data-act="rerollShip" data-idx="${i}">${t('npc_reroll')}</button>
        <button class="mini danger" data-act="removeShip" data-idx="${i}">×</button></span>` : ''}
    </div>
    <div class="npc-attrs">
      <span class="npc-attr"><b>HULL</b> ${esc(sh.hull || '–')}</span>
      <span class="npc-attr"><b>SHD</b> ${esc(sh.shields || '–')}</span>
      <span class="npc-attr"><b>MAN</b> ${esc(sh.maneuver || '–')}</span>
      <span class="npc-attr"><b>SPACE</b> ${esc(sh.space || '–')}</span>
      <span class="npc-attr"><b>HYPER</b> ${esc(sh.hyper || '–')}</span>
    </div>
    <div class="npc-line"><b>${t('npc_ship_crew')}:</b> ${fmtD(sh.crewPips)}</div>
    <div class="npc-line"><b>${t('npc_weapon')}:</b> ${sh.weapons.length ? sh.weapons.map(esc).join(', ') : '–'}${sh.extra ? ` <span class="hint">(+${+sh.extra || 0} ${t('npc_ship_extra')})</span>` : ''}</div>
  </div>`;
}

/* ---------------- rendering: setup + list ---------------- */
function factionOpts(sel) {
  return FACTION_ORDER.map(f =>
    `<option value="${f}" ${sel === f ? 'selected' : ''}>${t('fac_' + f)}</option>`).join('');
}
function speciesOpts(sel) {
  return allSpeciesNames().map(n =>
    `<option value="${esc(n)}" ${sel === n ? 'selected' : ''}>${esc(n)}</option>`).join('');
}
function attrChips(npc) {
  return NPC_ATTRS.map(a =>
    `<span class="npc-attr"><b>${a.name.slice(0, 3).toUpperCase()}</b> ${fmtD(npc.attrs[AI[a.key]])}</span>`).join('');
}
function skillsText(npc) {
  return npc.skills.map(sk => `${esc(skillName(sk.name))} ${fmtD(sk.pips)}`).join(' · ');
}
function weaponText(npc) {
  const w = npc.weapon;
  return `${esc(skillName ? skillName(w.name) : w.name)} (${fmtD(w.dmg)}${w.rng ? ', ' + esc(w.rng) : ''})`;
}
function npcCard(npc, i, editable) {
  return `<div class="npc-card">
    <div class="npc-head">
      ${editable
        ? `<input type="text" class="npc-name-in" data-npcname="${i}" value="${esc(npc.name)}">`
        : `<span class="npc-name">${esc(npc.name)}</span>`}
      <span class="npc-sub">${esc(npc.species)} · ${t('fac_' + (npc.faction || C.setup.faction))}</span>
      ${editable ? `<span class="npc-actions">
        <button class="mini" data-act="reroll" data-idx="${i}">${t('npc_reroll')}</button>
        <button class="mini danger" data-act="removeNpc" data-idx="${i}">×</button></span>` : ''}
    </div>
    <div class="npc-attrs">${attrChips(npc)}<span class="npc-attr"><b>${t('npc_move')}</b> ${+npc.move || 0}</span></div>
    <div class="npc-line"><b>${t('npc_skills')}:</b> ${skillsText(npc)}</div>
    <div class="npc-line"><b>${t('npc_weapon')}:</b> ${weaponText(npc)}${npc.armor ? ` · <b>${t('npc_armor')}:</b> +${fmtD(npc.armor)}` : ''}</div>
    <div class="npc-line"><b>${t('npc_gear')}:</b> ${esc(LANG === 'de' ? npc.gearDe : npc.gearEn)}</div>
    ${npc.loot ? `<div class="npc-line"><b>${t('npc_loot')}:</b> ${+npc.loot.credits || 0} ${t('npc_credits')}${
      (LANG === 'de' ? npc.loot.itemsDe : npc.loot.itemsEn).length
        ? ' · ' + esc((LANG === 'de' ? npc.loot.itemsDe : npc.loot.itemsEn).join(', ')) : ''}</div>` : ''}
  </div>`;
}

function renderTab(tab) {
  activeTab = tab || 'setup';
  document.querySelectorAll('#tabs button').forEach(b => b.classList.toggle('active', b.dataset.tab === activeTab));
  document.querySelectorAll('.tab').forEach(tb => tb.classList.toggle('active', tb.id === 'tab-' + activeTab));
  if (activeTab === 'sheet') { renderSheet(); return; }
  const s = C.setup;
  const el = document.getElementById('tab-setup');
  if (!el) return;
  const ships = s.gen === 'ships';
  const list = ships
    ? (C.ships.length ? `<div class="npc-grid">${C.ships.map((sh, i) => shipCard(sh, i, true)).join('')}</div>`
                      : `<p class="hint">${t(shipPool(SHIP_SIZES, s.shipEra).length ? 'npc_ships_empty' : 'npc_ships_nopool')}</p>`)
    : (C.npcs.length ? `<div class="npc-grid">${C.npcs.map((n, i) => npcCard(n, i, true)).join('')}</div>`
                     : `<p class="hint">${t('npc_empty')}</p>`);
  const threatSel = `<div><label>${t('npc_threat')}</label>
    <select data-bind="setup.threat">
      <option value="green" ${s.threat === 'green' ? 'selected' : ''}>${t('npc_threat_green')}</option>
      <option value="average" ${s.threat === 'average' ? 'selected' : ''}>${t('npc_threat_average')}</option>
      <option value="veteran" ${s.threat === 'veteran' ? 'selected' : ''}>${t('npc_threat_veteran')}</option>
      <option value="elite" ${s.threat === 'elite' ? 'selected' : ''}>${t('npc_threat_elite')}</option>
    </select></div>`;
  el.innerHTML = `
    <div class="card">
      <h2>${t('doc_one')}</h2>
      <div class="formgrid">
        <div><label>${t('npc_group_name')}</label>${inputT('info.name', C.info.name)}</div>
        <div><label>${t('npc_gen')}</label>
          <select data-bind="setup.gen" data-rerender="1">
            <option value="people" ${!ships ? 'selected' : ''}>${t('npc_gen_people')}</option>
            <option value="ships" ${ships ? 'selected' : ''}>${t('npc_gen_ships')}</option>
          </select></div>
        ${ships ? `
        <div class="npc-fleet"><label>${t('npc_fleet')}</label>
          <div class="npc-fleet-rows">${SHIP_SIZES.map(k => {
            const avail = shipPool([k], s.shipEra).length;
            return `<div class="npc-fleet-row">
              <span class="npc-fleet-name">${t('npc_size_' + k)}</span>
              <input type="number" min="0" max="30" data-shipcount="${k}"
                     value="${+s.shipCounts[k] || 0}" ${avail ? '' : 'disabled'}>
              <label class="npc-size-opt"><input type="checkbox" data-shipsame="${k}"
                ${s.shipSame[k] ? 'checked' : ''} ${avail ? '' : 'disabled'}> ${t('npc_same_ship_on')}</label>
              <span class="npc-fleet-avail">${t(avail ? 'npc_fleet_avail' : 'npc_fleet_none').replace('{n}', avail)}</span>
            </div>`;
          }).join('')}</div>
          <span class="hint">${t('npc_fleet_hint').replace('{n}', shipTotal(s))}</span></div>
        <div><label>${t('era_label')}</label>
          <select data-bind="setup.shipEra" data-rerender="1">${npcEraOptions(s.shipEra)}</select></div>
        ${threatSel}` : `
        <div class="npc-fleet"><label>${t('npc_troop')}</label>
          <div class="npc-fleet-rows">${s.troop.map((r, i) => `
            <div class="npc-fleet-row">
              <select class="npc-troop-fac" data-troopfac="${i}">${factionOpts(r.faction)}</select>
              <input type="number" min="0" max="30" data-troopn="${i}" value="${+r.n || 0}">
              ${s.troop.length > 1
                ? `<button class="mini" data-act="delTroop" data-idx="${i}">${t('npc_remove')}</button>` : ''}
            </div>`).join('')}
          </div>
          <p><button class="mini" data-act="addTroop">${t('npc_troop_add')}</button></p>
          <span class="hint">${t('npc_troop_hint').replace('{n}', troopTotal(s))}</span></div>
        <div><label>${t('npc_species_mode')}</label>
          <select data-bind="setup.mode" data-rerender="1">
            <option value="human" ${s.mode === 'human' ? 'selected' : ''}>${t('npc_mode_human')}</option>
            <option value="mixed" ${s.mode === 'mixed' ? 'selected' : ''}>${t('npc_mode_mixed')}</option>
            <option value="single" ${s.mode === 'single' ? 'selected' : ''}>${t('npc_mode_single')}</option>
            <option value="aliens" ${s.mode === 'aliens' ? 'selected' : ''}>${t('npc_mode_aliens')}</option>
          </select></div>
        ${s.mode === 'single'
          ? `<div><label>${t('npc_species_pick')}</label>
             <select data-bind="setup.species">${speciesOpts(s.species)}</select></div>` : ''}
        ${threatSel}`}
      </div>
      <p class="hint">${ships ? t('npc_ship_hint') : t('npc_mixed_note')}</p>
      <p><button class="accent" data-act="generate">${t('npc_generate')}</button>
         ${ships
           ? (C.ships.length ? `<button data-act="addShip">${t('npc_add_ship')}</button>` : '')
           : (C.npcs.length ? `<button data-act="addNpc">${t('npc_add_one')}</button>` : '')}</p>
    </div>
    ${list}`;
}

/* ---------------- actions ---------------- */
function pageAction(el) {
  const act = el.dataset.act;
  if (act === 'generate') { generateGroup(); renderTab('setup'); return; }
  if (act === 'addNpc') {
    const sp = buildSpeciesList(1, C.setup.mode, C.setup.species)[0];
    const last = C.setup.troop[C.setup.troop.length - 1];
    C.npcs.push(genNPC(sp, (last && last.faction) || 'imperial', C.setup.threat));
    autosave(); renderTab('setup'); return;
  }
  if (act === 'reroll') {
    const i = +el.dataset.idx;
    if (C.npcs[i]) {
      /* The faction sits in the card - otherwise a rerolled officer card
         would quietly turn into a stormtrooper. */
      const fac = C.npcs[i].faction || (C.setup.troop[0] || {}).faction || 'imperial';
      C.npcs[i] = genNPC(C.npcs[i].species, fac, C.setup.threat); autosave(); renderTab('setup');
    }
    return;
  }
  if (act === 'removeNpc') {
    const i = +el.dataset.idx;
    C.npcs.splice(i, 1); autosave(); renderTab('setup'); return;
  }
  if (act === 'addTroop') {
    C.setup.troop.push({ faction: 'imperial', n: 2 });
    autosave(); renderTab('setup'); return;
  }
  if (act === 'delTroop') {
    const i = +el.dataset.idx;
    if (C.setup.troop.length > 1) C.setup.troop.splice(i, 1);
    autosave(); renderTab('setup'); return;
  }
  if (act === 'addShip') { const sh = genOneShip(); if (sh) C.ships.push(sh); autosave(); renderTab('setup'); return; }
  if (act === 'rerollShip') {
    const i = +el.dataset.idx; const sh = genOneShip();
    if (C.ships[i] && sh) { C.ships[i] = sh; autosave(); renderTab('setup'); }
    return;
  }
  if (act === 'removeShip') { const i = +el.dataset.idx; C.ships.splice(i, 1); autosave(); renderTab('setup'); return; }
}
/* Name fields (not bound to C - they use a data attribute of their own) */
function pageChange(el) {
  if (el.dataset.npcname != null) {
    const i = +el.dataset.npcname;
    if (C.npcs[i]) { C.npcs[i].name = el.value; autosave(); }
    return true;
  }
  if (el.dataset.shipname != null) {
    const i = +el.dataset.shipname;
    if (C.ships[i]) { C.ships[i].name = el.value; autosave(); }
    return true;
  }
  if (el.dataset.troopfac != null) {
    const r = C.setup.troop[+el.dataset.troopfac];
    if (r && FACTION_ORDER.includes(el.value)) { r.faction = el.value; autosave(); renderTab('setup'); }
    return true;
  }
  if (el.dataset.troopn != null) {
    const r = C.setup.troop[+el.dataset.troopn];
    if (r) { r.n = Math.max(0, Math.min(30, +el.value || 0)); el.value = r.n; autosave(); renderTab('setup'); }
    return true;
  }
  /* Count per ship class. 0 means "not this class"; only if all three stood
     at 0 would there be nothing to build - the button catches that. */
  if (el.dataset.shipcount != null) {
    const k = el.dataset.shipcount;
    if (SHIP_SIZES.indexOf(k) >= 0) {
      C.setup.shipCounts[k] = Math.max(0, Math.min(30, +el.value || 0));
      el.value = C.setup.shipCounts[k];
      autosave(); renderTab('setup');
    }
    return true;
  }
  if (el.dataset.shipsame != null) {
    const k = el.dataset.shipsame;
    if (SHIP_SIZES.indexOf(k) >= 0) { C.setup.shipSame[k] = !!el.checked; autosave(); }
    return true;
  }
  return false;
}

/* ---------------- compact sheet ---------------- */
function renderSheet() {
  const ships = C.setup.gen === 'ships';
  const cards = ships
    ? C.ships.map((sh, i) => shipCard(sh, i, false)).join('')
    : C.npcs.map((n, i) => npcCard(n, i, false)).join('');
  const subtitle = ships
    ? `${SHIP_SIZES.filter(k => +C.setup.shipCounts[k] > 0)
           .map(k => t('npc_size_' + k) + ' ' + C.setup.shipCounts[k]).join(' · ')}${
         C.setup.shipEra ? ' · ' + t('era_' + C.setup.shipEra.replace('-', '_')) : ''} · ${C.ships.length}`
    : `${C.setup.troop.filter(r => r.n > 0).map(r => t('fac_' + r.faction) + ' ' + r.n).join(' · ')
        } · ${C.npcs.length} NPCs`;
  const html = `
  <div class="sheet-page npc-sheet">
    <div class="sp-header"><div class="sw">STAR WARS</div><div class="st">${t('sheet_title_npc')}</div></div>
    ${typeof roundStampHtml === 'function' ? roundStampHtml() : ''}
    <div class="npc-sheet-title">${esc(C.info.name || t('doc_one'))} · ${subtitle}</div>
    <div class="npc-grid print">${cards || `<p class="hint">${t('npc_empty')}</p>`}</div>
    <div class="sp-footer"><span>${t('sheet_footer')}</span></div>
  </div>`;
  document.getElementById('sheet-print').innerHTML = html;
  const tabEl = document.getElementById('tab-sheet');
  if (tabEl) tabEl.innerHTML = `
    <div class="card no-print"><h2>${t('tab_sheet')}</h2>
      <p>${t('sheet_preview')}</p>
      <p><button class="accent" data-act="print">${t('print_pdf')}</button></p>
    </div>${html}`;
}

/* ---------------- startup ---------------- */
initPage('setup');
