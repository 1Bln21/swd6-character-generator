/* =====================================================================
   Star Wars D6 (2nd Edition) – Charaktergenerator / Character Generator
   Logik & UI  –  basiert auf "Character Generator v2-5.xlsx"
   ===================================================================== */
'use strict';

/* =====================================================================
   SPRACHEN / LANGUAGES
   ===================================================================== */
const LS_LANG = 'swd6_lang';
/* Standardsprache Englisch: Das Projekt wird in den englischsprachigen
   SWD6-Gemeinschaften beworben. Wer einmal auf Deutsch umgestellt hat,
   bekommt seine Wahl weiterhin aus dem localStorage. */
let LANG = localStorage.getItem(LS_LANG) || 'en';

/* Wird im ⚙-Menü unter „Über & Credits“ angezeigt.
   Bei jedem Release mit der Versionsnummer des Git-Tags abgleichen! */

/* Rückfall, falls skills-de.js nicht geladen wurde (etwa bei einem
   unvollständigen Upload): dann bleiben die englischen Fertigkeitsnamen
   stehen, statt dass die Seite mit einem ReferenceError abbricht. */
if (typeof skillName !== 'function') {
  window.skillName = function (en) { return en; };
}

const T = {
de: {
  title: 'Star Wars D6 – Charaktergenerator (2nd Edition)',
  subtitle: 'Charaktergenerator · 2nd Edition (Revised & Expanded)',
  footer: 'Basiert auf „Character Generator v2-5“ (Excel) · Star Wars: The Roleplaying Game, 2nd Edition – West End Games D6-System',
  options: 'Optionen', opt_language: 'Sprache / Language',
  opt_theme: 'Darstellung', theme_dark: 'Dunkel', theme_light: 'Hell',
  theme_oled: 'OLED-Schwarz', theme_bespin: 'Bespin (warm)',
  nav_char: 'Charaktere', nav_droid: 'Droiden', nav_ship: 'Schiffe / Fahrzeuge', nav_npc: 'NPCs',
  doc_one: 'Charakter', doc_plural: 'Charaktere',
  pdf_catalog: 'Erweiterter Katalog aus den Regelwerken',
  pdf_search: 'Suchen', pdf_add: '+ Übernehmen',
  pdf_hint: 'Zusätzliche Einträge aus den Regelwerken und Fan-Sammelbänden. Blättern oder über Suche und Ära eingrenzen, dann übernehmen – der Eintrag landet mit allen Werten in deiner Liste.',
  pdf_results: 'Treffer', pdf_none: 'Keine Treffer – Suchbegriff anpassen.',
  pdf_type_all: 'Alle', pdf_min_chars: 'Mindestens 2 Zeichen eingeben – oder eine Ära wählen.',
  pdf_more: 'weitere über Suche oder Ära eingrenzen',
  era_all: 'Alle Ären', era_universal: 'zeitlos',
  era_old_republic: 'Alte Republik', era_rise_empire: 'Aufstieg des Imperiums',
  era_rebellion: 'Rebellion', era_new_republic: 'Neue Republik / Legacy',
  cloud_species_group: '☁ Gespeicherte Spezies (Gruppe)',
  pdf_species_group: '📖 Weitere Spezies aus den Regelwerken',
  species_save_cloud: '☁ Spezies online speichern',
  species_save_cloud_hint: 'Speichert die eigene Spezies auf dem Server – danach steht sie allen angemeldeten Gruppenmitgliedern im Spezies-Dropdown zur Verfügung.',
  species_saved: 'Spezies gespeichert ✔',
  species_need_login: 'Zum Online-Speichern zuerst über ☁ Online anmelden.',
  species_need_name: 'Bitte der Spezies zuerst einen Namen geben.',
  species_cloud_list: 'Online gespeicherte Spezies',
  species_by: 'von', species_use: 'Übernehmen',
  species_confirm_delete: 'Gespeicherte Spezies „{name}“ wirklich löschen?',
  btn_load: 'Laden', btn_save: '💾 Speichern', btn_new: 'Neu',
  btn_export: '⬇ Export', btn_import: '⬆ Import', btn_print: '🖨 Drucken / PDF',
  tab_info: 'Charakter', tab_attrs: 'Attribute', tab_skills: 'Fertigkeiten',
  tab_force: 'Die Macht', tab_equip: 'Ausrüstung', tab_weapons: 'Waffen',
  tab_armor: 'Rüstung', tab_credits: 'Credits', tab_sheet: 'Charakterbogen',
  saved_placeholder: '– Gespeicherte Charaktere –',
  saved_ok: '✔ Gespeichert',
  prompt_char_name: 'Name für den Charakter:',
  alert_select_saved: 'Bitte zuerst einen gespeicherten Charakter auswählen.',
  confirm_delete: 'Charakter „{name}“ wirklich löschen?',
  confirm_new: 'Neuen Charakter beginnen? (Nicht gespeicherte Änderungen gehen verloren)',
  import_failed: 'Import fehlgeschlagen: ',
  import_invalid: 'Kein gültiger Charakter',
  yes: 'Ja', no: 'Nein', none_dash: '– keine –', none_one: '– keiner –',
  name: 'Name', cost: 'Preis', avail: 'Verf.', qty: 'Anzahl', sum: 'Summe',
  note: 'Notiz', notes: 'Notizen', add_entry: '+ Eintrag', item: 'Gegenstand',
  skill: 'Skill', damage: 'Schaden', difficulty: 'Schwierigkeit', special: 'Besonderes',
  weapon: 'Waffe', color: 'Farbe', max_short: 'Max.',
  /* Info-Tab */
  personal_data: 'Persönliche Daten',
  char_name: 'Charaktername', player_name: 'Spielername', occupation: 'Beruf / Template',
  species: 'Spezies', nh_variant: 'Near-Human-Variante', nh_choose: '– Variante wählen –',
  gender: 'Geschlecht', force_sensitive: 'Macht-sensitiv', home_planet: 'Heimatplanet',
  age: 'Alter', height_m: 'Größe (m)', weight_kg: 'Gewicht (kg)', quote: 'Zitat',
  desc_bg: 'Beschreibung & Hintergrund',
  appearance: 'Aussehen', history: 'Hintergrundgeschichte',
  personality: 'Persönlichkeit', objectives: 'Ziele / Motivation', other_notes: 'Sonstige Notizen',
  species_info: 'Spezies-Info', source: 'Quelle', homeworld: 'Heimatwelt',
  move: 'Move', height: 'Größe', weight: 'Gewicht',
  natural_armor: 'Natürliche Panzerung', phys_short: 'phys.', ener_short: 'energ.',
  special_abilities: 'Spezialfähigkeiten', story_factors: 'Story-Faktoren',
  typical_skills: 'Typische Fertigkeiten', bonus_skills: 'Bonus-Fertigkeiten (automatisch hinzugefügt)',
  portrait: 'Charakterbild', portrait_import: '📷 Bild importieren',
  portrait_remove: 'Entfernen', portrait_placeholder: 'Kein Bild',
  portrait_hint: 'JPG/PNG – wird automatisch verkleinert. Datei hierher ziehen oder auf den Rahmen klicken.',
  portrait_error: 'Bild konnte nicht geladen werden.',
  custom_species_def: 'Eigene Spezies definieren', species_name: 'Name der Spezies',
  attr_limits: 'Attribut-Grenzen (in Pips: 3 Pips = 1D, z. B. 6 = 2D, 12 = 4D)',
  min: 'Min.', max: 'Max.',
  /* Attribute-Tab */
  attr_pool: 'Attributs-Pool', distributed: 'Verteilt', left: 'Übrig',
  start_dice: 'Startwürfel', override_attr: 'Override Startwürfel (D):',
  attrs_heading: 'Attribute (+/− in Pips, 3 Pips = 1D)',
  cp_buy: 'CP-Kauf', pips_bought: 'Pip(s)',
  force_skills_heading: 'Machtfertigkeiten (aus Attributs-Pool, 3 Pips = 1D)',
  force_skill: 'Machtfertigkeit',
  force_skills_hint: 'Machtfertigkeiten werden bei der Erschaffung aus den Attributswürfeln bezahlt (1D Attribut = 1D Machtfertigkeit).',
  char_points: 'Charakterpunkte', cp_earned: 'Verdient (gesamt)', cp_other: 'Sonstig ausgegeben',
  cp_upgrades: 'Durch Steigerungen ausgegeben',
  fp_dsp: 'Machtpunkte & Dunkle Seite', fp_start: 'Start-Machtpunkte',
  fp_current: 'Machtpunkte aktuell', dsp: 'Punkte der Dunklen Seite',
  movement: 'Bewegung', base_species: 'Basis (Spezies)', improvement: 'Verbesserung (+)', total: 'Gesamt',
  /* Skills-Tab */
  skill_pool: 'Fertigkeits-Pool',
  skill_hint: 'max. +2D pro Fertigkeit bei der Erschaffung · ★ = typische Spezies-Fertigkeit',
  override_skill: 'Override Skillwürfel (D):',
  spent: 'verteilt:', add_custom_skill: '+ Eigene Fertigkeit',
  adv_skills: 'Fortgeschrittene Fertigkeiten', requirement: 'Voraussetzung',
  req_missing: '⚠ Voraussetzung nicht erfüllt',
  add_adv_skill: '+ Eigene fortgeschrittene Fertigkeit',
  adv_hint: 'Fortgeschrittene Fertigkeiten („Advanced Skills“) bauen nicht auf einem Attribut auf (Start 0D) und kosten bei CP-Steigerung das Doppelte.',
  specialization: '(Spezialisierung)', species_bonus: '(Spezies-Bonus)',
  add_spec_title: 'Spezialisierung hinzufügen', remove: 'Entfernen',
  prompt_spec: 'Name der Spezialisierung (z. B. "Blaster: Heavy Blaster Pistol"):',
  prompt_skill: 'Name der neuen Fertigkeit:',
  prompt_adv: 'Name der fortgeschrittenen Fertigkeit (z. B. "(A) Engineering"):',
  prompt_adv_req: 'Voraussetzung (z. B. "Repulsorlift Repair 5D"):',
  /* Macht-Tab */
  the_force: 'Die Macht',
  not_sensitive: 'Dieser Charakter ist nicht Macht-sensitiv.',
  not_sensitive_hint: 'Stelle auf dem Tab „Charakter“ die Option <b>Macht-sensitiv</b> auf „Ja“, um Machtfertigkeiten und -kräfte zu wählen.',
  powers_learnable: 'Kräfte lernbar', learned: 'Gelernt',
  override_powers: 'Override zusätzl. Kräfte:',
  powers_hint: 'Wie in der Excel-Vorlage: Anzahl lernbarer Kräfte = Summe der Pips in Control, Sense und Alter (+ Override). Die Machtfertigkeiten selbst werden auf dem Tab „Attribute“ gesteigert.',
  keep_up: 'Aufrechterhalten', maybe_missing: '⚠ evtl. nicht erfüllt', dark_side_title: 'Dunkle Seite',
  /* Ausrüstung */
  equip_cost: 'Ausrüstungskosten', credits_left: 'Credits übrig',
  other_equip: 'Sonstige Ausrüstung', credits_word: 'Credits',
  cat_Communication: 'Kommunikation', cat_General: 'Allgemeines', cat_Medical: 'Medizin',
  'cat_Restraining Devices': 'Fesselungsgeräte', 'cat_Special Tools': 'Spezialwerkzeuge',
  cat_Surveillance: 'Überwachung', cat_Transport: 'Transport', 'cat_Travel Aids': 'Reisehilfen',
  /* Waffen */
  sub_melee: 'Nahkampf', sub_ranged: 'Fernkampf', sub_expl: 'Sprengstoffe', sub_saber: 'Lichtschwert-Werkstatt',
  my_melee: 'Meine Nahkampfwaffen', my_ranged: 'Meine Fernkampfwaffen', my_sabers: 'Meine Lichtschwerter',
  custom_melee: 'Eigene Nahkampfwaffen', custom_ranged: 'Eigene Fernkampfwaffen',
  cat_melee: 'Katalog: Nahkampfwaffen', cat_ranged: 'Katalog: Fernkampfwaffen',
  explosives: 'Sprengstoffe', custom_expl: 'Eigene Sprengstoffe', explosive: 'Sprengstoff',
  range_pkml: 'Reichweite (P/K/M/L)', throw_range: 'Wurfweite (P/K/M/L)', radius: 'Radius',
  rof: 'Feuerrate', ammo: 'Munition', ammo_short: 'Mun.',
  saber_shop: 'Lichtschwert-Werkstatt',
  pri_crystal: 'Primärkristall', sec_crystal: 'Sekundärkristall', ter_crystal: 'Tertiärkristall',
  blade_color: 'Klingenfarbe', modification: 'Modifikation',
  choose_crystal: '– Kristall wählen –', pip: 'Pip',
  saber_name_ph: 'z. B. Lichtschwert meines Meisters',
  build_saber: '⚔ Lichtschwert bauen', properties: 'Eigenschaften',
  alert_primary: 'Bitte einen Primärkristall wählen.',
  custom_saber: 'Custom-Lichtschwert',
  /* Rüstung */
  str_resist: 'Widerstand gegen Schaden (STR)',
  armor_hint: 'Rüstungsboni werden auf den Stärke-Wurf gegen Schaden addiert.',
  my_armor: 'Meine Rüstung', custom_armor: 'Eigene Rüstung', cat_armor: 'Katalog: Rüstungen',
  armor: 'Rüstung', physical: 'Physisch', energy: 'Energie', coverage: 'Abdeckung', dex_pen: 'DEX-Malus',
  armor_bonus: 'Rüstungsbonus gesamt', armor_total: 'Widerstand mit Rüstung',
  armor_worn: 'Getragen', armor_worn_hint: 'Nur angehakte Rüstung zählt zum Widerstand. Zwei Rüstungen, die denselben Körperbereich abdecken, lassen sich nicht gleichzeitig tragen.',
  armor_conflict: 'Passt nicht: Ein anderes getragenes Rüstungsstück deckt bereits {loc} ab.',
  loc_head: 'Kopf', loc_torso: 'Torso', loc_arms: 'Arme', loc_hands: 'Hände', loc_legs: 'Beine',
  /* Credits */
  spent_misc: 'Ausgegeben (Sonstiges)', spent_ship: 'Ausgegeben (Schiff)',
  equipment: 'Ausrüstung', melee_w: 'Nahkampfwaffen (inkl. Lichtschwert-Mods)',
  ranged_w: 'Fernkampfwaffen', misc_ship: 'Sonstiges + Schiff',
  spent_total: 'Ausgegeben gesamt',
  loans: 'Kredite / Schulden', loan: 'Kredit', creditor: 'Gläubiger',
  amount_owed: 'Geschuldeter Betrag', interest: 'Zins (% / Monat)', monthly_due: 'Monatlich fällig',
  amount: 'Betrag', interest_short: 'Zins', monthly: 'Monatlich',
  /* Charakterbogen */
  sheet_preview: 'Vorschau des Bogens. <b>Drucken / PDF:</b> Knopf unten (oder oben rechts) – im Druckdialog kannst du „Als PDF speichern“ wählen.',
  print_pdf: '🖨 Drucken / Als PDF speichern',
  sheet_title: 'Das Rollenspiel · D6 · Charakterbogen',
  page: 'Seite',
  attrs_skills: 'Attribute & Fertigkeiten', game_stats: 'Spielwerte',
  fp: 'Machtpunkte', dark_side: 'Dunkle Seite',
  resist_p: 'Widerstand phys.*', resist_e: 'Widerstand energ.*',
  resist_note: '* Stärke inkl. aller Rüstung (natürlich, getragen, eigene).',
  sprint: 'Sprint', all_out: 'Vollgas',
  wounds: 'Verwundungen', dmg_gt_str: 'Schaden > STR', condition: 'Zustand', effect: 'Auswirkung',
  woundRows: [
    ['0 – 3', 'Stunned (Benommen)', '−1D auf alle Würfe in dieser und der nächsten Runde', '☐☐☐'],
    ['4 – 8', 'Wounded (Verwundet)', 'Fällt zu Boden, Rest der Runde keine Aktion, −1D auf alles bis geheilt', '☐'],
    ['4 – 8 (2×)', 'Twice Wounded', 'Wie oben, aber −2D auf alles bis geheilt', '☐'],
    ['9 – 12', 'Incapacitated', 'Bewusstlos für 10D Minuten, handlungsunfähig bis geheilt', '☐'],
    ['13 – 15', 'Mortally Wounded', 'Bewusstlos bis geheilt; jede Runde 2D würfeln – ist das Ergebnis kleiner als die Anzahl Runden, stirbt der Charakter', '☐'],
  ],
  sp_species_abilities: 'Spezies-Spezialfähigkeiten',
  bg_equip: 'Hintergrund & Ausrüstung',
  qty_short: 'Anz.', value_cr: 'Wert (Cr.)',
  earned_total_sheet: 'Verdient (gesamt)', spent_total_sheet: 'Ausgegeben (gesamt)',
  weapons_armor: 'Waffen & Rüstung',
  force_skills: 'Machtfertigkeiten', force_powers: 'Machtkräfte',
  power: 'Kraft', category: 'Kategorie', keep_up_short: 'Aufrechterh.',
  sheet_footer: 'Star Wars D6 · 2nd Edition',
},
en: {
  title: 'Star Wars D6 – Character Generator (2nd Edition)',
  subtitle: 'Character Generator · 2nd Edition (Revised & Expanded)',
  footer: 'Based on "Character Generator v2-5" (Excel) · Star Wars: The Roleplaying Game, 2nd Edition – West End Games D6 System',
  options: 'Options', opt_language: 'Sprache / Language',
  opt_theme: 'Theme', theme_dark: 'Dark', theme_light: 'Light',
  theme_oled: 'OLED black', theme_bespin: 'Bespin (warm)',
  nav_char: 'Characters', nav_droid: 'Droids', nav_ship: 'Ships / Vehicles', nav_npc: 'NPCs',
  doc_one: 'character', doc_plural: 'characters',
  pdf_catalog: 'Extended catalog from the sourcebooks',
  pdf_search: 'Search', pdf_add: '+ Add',
  pdf_hint: 'Additional entries from the sourcebooks and fan compilations. Browse, or narrow it down with the search and era, then add – the entry lands in your list with all its stats.',
  pdf_results: 'Matches', pdf_none: 'No matches – try a different term.',
  pdf_type_all: 'All', pdf_min_chars: 'Enter at least 2 characters – or pick an era.',
  pdf_more: 'narrow further with the search or era',
  era_all: 'All eras', era_universal: 'timeless',
  era_old_republic: 'Old Republic', era_rise_empire: 'Rise of the Empire',
  era_rebellion: 'Rebellion', era_new_republic: 'New Republic / Legacy',
  cloud_species_group: '☁ Saved species (group)',
  pdf_species_group: '📖 More species from the sourcebooks',
  species_save_cloud: '☁ Save species online',
  species_save_cloud_hint: 'Stores your custom species on the server – it then appears in the species dropdown for all signed-in group members.',
  species_saved: 'Species saved ✔',
  species_need_login: 'Sign in via ☁ Online first to save online.',
  species_need_name: 'Please give the species a name first.',
  species_cloud_list: 'Species stored online',
  species_by: 'by', species_use: 'Use',
  species_confirm_delete: 'Really delete stored species "{name}"?',
  btn_load: 'Load', btn_save: '💾 Save', btn_new: 'New',
  btn_export: '⬇ Export', btn_import: '⬆ Import', btn_print: '🖨 Print / PDF',
  tab_info: 'Character', tab_attrs: 'Attributes', tab_skills: 'Skills',
  tab_force: 'The Force', tab_equip: 'Equipment', tab_weapons: 'Weapons',
  tab_armor: 'Armor', tab_credits: 'Credits', tab_sheet: 'Character Sheet',
  saved_placeholder: '– Saved characters –',
  saved_ok: '✔ Saved',
  prompt_char_name: 'Name for this character:',
  alert_select_saved: 'Please select a saved character first.',
  confirm_delete: 'Really delete character "{name}"?',
  confirm_new: 'Start a new character? (Unsaved changes will be lost)',
  import_failed: 'Import failed: ',
  import_invalid: 'Not a valid character',
  yes: 'Yes', no: 'No', none_dash: '– none –', none_one: '– none –',
  name: 'Name', cost: 'Cost', avail: 'Avail.', qty: 'Qty', sum: 'Total',
  note: 'Note', notes: 'Notes', add_entry: '+ Add entry', item: 'Item',
  skill: 'Skill', damage: 'Damage', difficulty: 'Difficulty', special: 'Special',
  weapon: 'Weapon', color: 'Color', max_short: 'Max.',
  /* Info tab */
  personal_data: 'Personal Data',
  char_name: 'Character Name', player_name: 'Player Name', occupation: 'Occupation / Template',
  species: 'Species', nh_variant: 'Near-Human Variant', nh_choose: '– choose variant –',
  gender: 'Gender', force_sensitive: 'Force Sensitive', home_planet: 'Home Planet',
  age: 'Age', height_m: 'Height (m)', weight_kg: 'Weight (kg)', quote: 'A Quote',
  desc_bg: 'Description & Background',
  appearance: 'Physical Description', history: 'Character History',
  personality: 'Personality', objectives: 'Objectives / Motivation', other_notes: 'Other Notes',
  species_info: 'Species Info', source: 'Source', homeworld: 'Homeworld',
  move: 'Move', height: 'Height', weight: 'Weight',
  natural_armor: 'Natural Armor', phys_short: 'phys.', ener_short: 'energy',
  special_abilities: 'Special Abilities', story_factors: 'Story Factors',
  typical_skills: 'Typical Skills', bonus_skills: 'Bonus Skills (added automatically)',
  portrait: 'Character Portrait', portrait_import: '📷 Import image',
  portrait_remove: 'Remove', portrait_placeholder: 'No image',
  portrait_hint: 'JPG/PNG – resized automatically. Drag a file here or click the frame.',
  portrait_error: 'Could not load the image.',
  custom_species_def: 'Define Custom Species', species_name: 'Species Name',
  attr_limits: 'Attribute limits (in pips: 3 pips = 1D, e.g. 6 = 2D, 12 = 4D)',
  min: 'Min.', max: 'Max.',
  /* Attributes tab */
  attr_pool: 'Attribute Pool', distributed: 'Distributed', left: 'Left',
  start_dice: 'starting dice', override_attr: 'Override starting dice (D):',
  attrs_heading: 'Attributes (+/− in pips, 3 pips = 1D)',
  cp_buy: 'CP buy', pips_bought: 'pip(s)',
  force_skills_heading: 'Force Skills (paid from attribute pool, 3 pips = 1D)',
  force_skill: 'Force skill',
  force_skills_hint: 'At character creation, Force skills are paid for with attribute dice (1D of attributes = 1D of Force skill).',
  char_points: 'Character Points', cp_earned: 'Earned (total)', cp_other: 'Spent elsewhere',
  cp_upgrades: 'Spent on improvements',
  fp_dsp: 'Force Points & Dark Side', fp_start: 'Starting Force Points',
  fp_current: 'Force Points (current)', dsp: 'Dark Side Points',
  movement: 'Movement', base_species: 'Base (species)', improvement: 'Improvement (+)', total: 'Total',
  /* Skills tab */
  skill_pool: 'Skill Pool',
  skill_hint: 'max. +2D per skill at creation · ★ = typical species skill',
  override_skill: 'Override skill dice (D):',
  spent: 'spent:', add_custom_skill: '+ Custom skill',
  adv_skills: 'Advanced Skills', requirement: 'Requirement',
  req_missing: '⚠ requirement not met',
  add_adv_skill: '+ Custom Advanced Skill',
  adv_hint: 'Advanced skills do not build on an attribute (start at 0D) and cost double when raised with Character Points.',
  specialization: '(specialization)', species_bonus: '(species bonus)',
  add_spec_title: 'Add specialization', remove: 'Remove',
  prompt_spec: 'Name of the specialization (e.g. "Blaster: Heavy Blaster Pistol"):',
  prompt_skill: 'Name of the new skill:',
  prompt_adv: 'Name of the Advanced Skill (e.g. "(A) Engineering"):',
  prompt_adv_req: 'Requirement (e.g. "Repulsorlift Repair 5D"):',
  /* Force tab */
  the_force: 'The Force',
  not_sensitive: 'This character is not Force sensitive.',
  not_sensitive_hint: 'Set <b>Force Sensitive</b> to "Yes" on the "Character" tab to choose Force skills and powers.',
  powers_learnable: 'Powers learnable', learned: 'Learned',
  override_powers: 'Override extra powers:',
  powers_hint: 'As in the Excel original: number of learnable powers = sum of pips in Control, Sense and Alter (+ override). The Force skills themselves are raised on the "Attributes" tab.',
  keep_up: 'Kept up', maybe_missing: '⚠ possibly not met', dark_side_title: 'Dark Side',
  /* Equipment */
  equip_cost: 'Equipment cost', credits_left: 'Credits left',
  other_equip: 'Other Equipment', credits_word: 'credits',
  cat_Communication: 'Communication', cat_General: 'General', cat_Medical: 'Medical',
  'cat_Restraining Devices': 'Restraining Devices', 'cat_Special Tools': 'Special Tools',
  cat_Surveillance: 'Surveillance', cat_Transport: 'Transport', 'cat_Travel Aids': 'Travel Aids',
  /* Weapons */
  sub_melee: 'Melee', sub_ranged: 'Ranged', sub_expl: 'Explosives', sub_saber: 'Lightsaber Workshop',
  my_melee: 'My Melee Weapons', my_ranged: 'My Ranged Weapons', my_sabers: 'My Lightsabers',
  custom_melee: 'Custom Melee Weapons', custom_ranged: 'Custom Ranged Weapons',
  cat_melee: 'Catalog: Melee Weapons', cat_ranged: 'Catalog: Ranged Weapons',
  explosives: 'Explosives', custom_expl: 'Custom Explosives', explosive: 'Explosive',
  range_pkml: 'Range (PB/S/M/L)', throw_range: 'Throw Range (PB/S/M/L)', radius: 'Blast Radius',
  rof: 'Rate of Fire', ammo: 'Ammo', ammo_short: 'Ammo',
  saber_shop: 'Lightsaber Workshop',
  pri_crystal: 'Primary Crystal', sec_crystal: 'Secondary Crystal', ter_crystal: 'Tertiary Crystal',
  blade_color: 'Blade Color', modification: 'Modification',
  choose_crystal: '– choose crystal –', pip: 'pip',
  saber_name_ph: 'e.g. My master’s lightsaber',
  build_saber: '⚔ Build lightsaber', properties: 'Properties',
  alert_primary: 'Please choose a primary crystal.',
  custom_saber: 'Custom Lightsaber',
  /* Armor */
  str_resist: 'Damage resistance (STR)',
  armor_hint: 'Armor bonuses are added to the Strength roll to resist damage.',
  my_armor: 'My Armor', custom_armor: 'Custom Armor', cat_armor: 'Catalog: Armor',
  armor: 'Armor', physical: 'Physical', energy: 'Energy', coverage: 'Coverage', dex_pen: 'DEX Penalty',
  armor_bonus: 'Total armor bonus', armor_total: 'Resistance with armor',
  armor_worn: 'Worn', armor_worn_hint: 'Only ticked armor counts toward resistance. Two armors covering the same body area cannot be worn at once.',
  armor_conflict: 'Does not fit: another worn armor already covers {loc}.',
  loc_head: 'head', loc_torso: 'torso', loc_arms: 'arms', loc_hands: 'hands', loc_legs: 'legs',
  /* Credits */
  spent_misc: 'Spent (Misc.)', spent_ship: 'Spent (Ship)',
  equipment: 'Equipment', melee_w: 'Melee weapons (incl. lightsaber mods)',
  ranged_w: 'Ranged weapons', misc_ship: 'Misc. + Ship',
  spent_total: 'Total spent',
  loans: 'Loans / Debts', loan: 'Loan', creditor: 'Owed to',
  amount_owed: 'Amount owed', interest: 'Interest (% / month)', monthly_due: 'Owed monthly',
  amount: 'Amount', interest_short: 'Interest', monthly: 'Monthly',
  /* Character sheet */
  sheet_preview: 'Preview of the sheet. <b>Print / PDF:</b> button below (or top right) – in the print dialog choose "Save as PDF".',
  print_pdf: '🖨 Print / Save as PDF',
  sheet_title: 'The Roleplaying Game · D6 · Character Sheet',
  page: 'Page',
  attrs_skills: 'Attributes & Skills', game_stats: 'Game Stats',
  fp: 'Force Points', dark_side: 'Dark Side',
  resist_p: 'Resist phys.*', resist_e: 'Resist energy*',
  resist_note: '* Strength incl. all armor (natural, worn, custom).',
  sprint: 'High Spd', all_out: 'All Out',
  wounds: 'Wound Chart', dmg_gt_str: 'Damage > STR', condition: 'Wound Type', effect: 'Wound Effect',
  woundRows: [
    ['0 – 3', 'Stunned', '−1D to rolls for this round and the next', '☐☐☐'],
    ['4 – 8', 'Wounded', 'Falls prone, no action for the rest of the round, −1D to all rolls until healed', '☐'],
    ['4 – 8 (2×)', 'Twice Wounded', 'As above, but −2D to all rolls until healed', '☐'],
    ['9 – 12', 'Incapacitated', 'Falls prone and unconscious for 10D minutes; can do nothing until healed', '☐'],
    ['13 – 15', 'Mortally Wounded', 'Unconscious until healed; at the end of each round roll 2D – if the roll is less than the number of rounds mortally wounded, the character dies', '☐'],
  ],
  sp_species_abilities: 'Species Special Abilities',
  bg_equip: 'Background & Equipment',
  qty_short: 'Qty', value_cr: 'Value (cr.)',
  earned_total_sheet: 'Earned (total)', spent_total_sheet: 'Spent (total)',
  weapons_armor: 'Weapons & Armor',
  force_skills: 'Force Skills', force_powers: 'Force Powers',
  power: 'Power', category: 'Category', keep_up_short: 'Kept up',
  sheet_footer: 'Star Wars D6 · 2nd Edition',
},
};
function t(k) {
  const v = T[LANG] && T[LANG][k];
  if (v !== undefined) return v;
  /* Fehlt ein Schlüssel, lieber die englische Fassung zeigen als die
     deutsche – Englisch ist die Standardsprache der App. */
  if (T.en && T.en[k] !== undefined) return T.en[k];
  return T.de[k] !== undefined ? T.de[k] : k;
}
function tCat(cat) { return t('cat_' + cat); }
function setLang(l) {
  LANG = l;
  localStorage.setItem(LS_LANG, l);
  document.documentElement.lang = l;
  document.title = t('title');
  applyStaticI18n();
  renderLegal();
  const am = document.getElementById('aboutModal');
  if (am && !am.classList.contains('hidden')) renderAbout();
  renderAll();
}

/* ---------------- Impressum & Datenschutz ----------------
   Die eigentliche Umsetzung liegt in legal.js und überschreibt diese
   Platzhalter-Funktion, sobald die Datei geladen ist. */
function renderLegal() { /* siehe legal.js */ }
function applyStaticI18n() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    el.innerHTML = t(el.dataset.i18n);
  });
  document.querySelectorAll('input[name="langOpt"]').forEach(r => r.checked = (r.value === LANG));
}

/* =====================================================================
   KONSTANTEN / ZUSTAND
   ===================================================================== */
const ATTRS = [
  { key: 'dex', name: 'Dexterity' },
  { key: 'kno', name: 'Knowledge' },
  { key: 'mec', name: 'Mechanical' },
  { key: 'per', name: 'Perception' },
  { key: 'str', name: 'Strength' },
  { key: 'tec', name: 'Technical' },
];
const FORCE = [
  { key: 'control', name: 'Control' },
  { key: 'sense', name: 'Sense' },
  { key: 'alter', name: 'Alter' },
];
const ADV_SKILLS = [
  { name: '(A) Medicine', attr: 'tec', req: 'First Aid 5D' },
];
const LS_CURRENT = 'swd6_current';
const LS_CHARS = 'swd6_chars';

function emptyChar() {
  return {
    version: 1,
    info: {
      name: '', player: '', occupation: '', species: 'Human', nearHuman: '',
      gender: 'Male', forceSensitive: false, planet: '', age: '', height: '',
      weight: '', quote: '', description: '', history: '', personality: '', objectives: '',
      raceNotes: '', portrait: '',
    },
    customSpecies: {
      name: '', move: 10,
      mins: [6, 6, 6, 6, 6, 6], maxs: [12, 12, 12, 12, 12, 12],
      abilities: ['', '', '', '', '', ''], story: ['', '', '', ''],
    },
    attrs: { dex: 0, kno: 0, mec: 0, per: 0, str: 0, tec: 0 },
    attrsCP: { dex: 0, kno: 0, mec: 0, per: 0, str: 0, tec: 0 },
    force: { control: 0, sense: 0, alter: 0 },
    forceCP: { control: 0, sense: 0, alter: 0 },
    overrides: { attrDice: null, skillDice: null, powersLeft: 0 },
    skills: {},
    extraSkills: [],
    powers: [],
    points: { cpEarned: 0, cpSpentOther: 0, fpCurrent: null, dsp: 0, moveImp: 0 },
    credits: {
      earned: 0, spentMisc: 0, spentShip: 0,
      loans: [ { to: '', amount: 0, interest: 0 }, { to: '', amount: 0, interest: 0 } ],
    },
    equipment: {}, customEquipment: [],
    armor: [], armorWorn: [], customArmor: [],
    melee: [], customMelee: [],
    ranged: [], customRanged: [],
    explosives: {}, customExplosives: [],
    sabers: [],
    notes: '',
  };
}
let C = emptyChar();

/* ---------------- Helfer ---------------- */
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

/* ---------------- Spezies ---------------- */
function speciesData() {
  const name = C.info.species;
  if (name === 'Custom') {
    const cs = C.customSpecies;
    return {
      name: cs.name || 'Custom', min: cs.mins.slice(), max: cs.maxs.slice(),
      /* move stammt bei Cloud-Spezies aus fremden, ungeprüften Daten – strikt
         auf eine Zahl zwingen, sonst könnte ein String beim Anzeigen HTML
         einschleusen (die Zahl wird an mehreren Stellen ohne esc() gerendert). */
      move: (+cs.move || 10), free: 54 - cs.mins.reduce((a, b) => a + (+b || 0), 0), offset: 0,
      hMin: 0, hMax: 0, planet: '', page: 'Custom',
      abilities: cs.abilities.filter(x => x), story: cs.story.filter(x => x),
      skillImprove: [], bonusSkills: [], armorP: 0, armorE: 0, custom: true,
    };
  }
  if (name === 'Trianii' && (C.info.gender === 'Female' || C.info.gender === 'Male')) {
    return DATA.trianii[C.info.gender];
  }
  if (name === 'Near-Human') {
    const nh = DATA.nearHumans.find(x => x.name === C.info.nearHuman);
    if (nh) return nh;
    return {
      name: 'Near-Human', min: [0, 0, 0, 0, 0, 0], max: [54, 54, 54, 54, 54, 54],
      move: 10, free: 54, offset: 0, hMin: 0, hMax: 0, planet: '', page: 'GM',
      abilities: [], story: [], skillImprove: [], bonusSkills: [], armorP: 0, armorE: 0,
    };
  }
  return DATA.species.find(x => x.name === name)
      || extraSpecies().find(x => x.name === name)
      || DATA.species.find(x => x.name === 'Human');
}

/* Zusätzliche Spezies aus den Regelwerken (pdfdata-species.js). Die Datei
   enthält nur, was im Excel fehlt – doppelt geprüft wird hier trotzdem,
   falls data.js neu erzeugt wurde und inzwischen mehr kennt. */
function extraSpecies() {
  if (typeof PDF_SPECIES === 'undefined') return [];
  if (!extraSpecies._cache) {
    const have = new Set(DATA.species.map(x => speciesKey(x.name)));
    extraSpecies._cache = PDF_SPECIES.filter(x => !have.has(speciesKey(x.name)));
  }
  return extraSpecies._cache;
}
function speciesKey(n) {
  /* Wookiee/Wookie und Toydarian/Toydarians sollen als dasselbe gelten */
  return String(n || '').toLowerCase().replace(/[^a-z]/g, '')
    .replace(/(.)\1+/g, '$1').replace(/s$/, '');
}
function attrIdx(key) { return ATTRS.findIndex(a => a.key === key); }
function attrMin(key) { const sp = speciesData(); return +sp.min[attrIdx(key)] || 0; }
function attrMax(key) { const sp = speciesData(); return +sp.max[attrIdx(key)] || 54; }
function attrTotal(key) { return attrMin(key) + (C.attrs[key] || 0) + (C.attrsCP[key] || 0); }
function forceTotal(key) { return (C.force[key] || 0) + (C.forceCP[key] || 0); }

function attrPoolTotal() {
  const sp = speciesData();
  if (C.overrides.attrDice != null && C.overrides.attrDice !== '')
    return Math.round(C.overrides.attrDice * 3);
  return 54 + (sp.offset || 0);
}
function attrPoolLeft() {
  const sp = speciesData();
  const minSum = sp.min.reduce((a, b) => a + (+b || 0), 0);
  let spent = minSum;
  ATTRS.forEach(a => spent += (C.attrs[a.key] || 0));
  FORCE.forEach(f => spent += (C.force[f.key] || 0));
  return attrPoolTotal() - spent;
}
function skillPoolTotal() {
  if (C.overrides.skillDice != null && C.overrides.skillDice !== '')
    return Math.round(C.overrides.skillDice * 3);
  return 21;
}
function skillPoolLeft() {
  let spent = 0;
  Object.values(C.skills).forEach(s => spent += (s.c || 0));
  return skillPoolTotal() - spent;
}

/* ---------------- Skills ---------------- */
function skillKey(attr, name) { return attr + '|' + name; }
function skillEntry(key) {
  if (!C.skills[key]) C.skills[key] = { c: 0, cp: 0 };
  return C.skills[key];
}
function skillPips(key) { const s = C.skills[key]; return s ? (s.c || 0) + (s.cp || 0) : 0; }
function isAdvKey(key) { return key.split('|')[1].startsWith('(A)'); }
function skillTotal(key) {
  const attr = key.split('|')[0];
  const base = isAdvKey(key) ? 0 : attrTotal(attr);
  return base + skillPips(key);
}
function skillCpCost(key) {
  const cur = skillTotal(key);
  let d = Math.max(1, Math.floor(cur / 3));
  return isAdvKey(key) ? d * 2 : d;
}
function skillCpSpent(key) {
  const s = C.skills[key]; if (!s || !s.cp) return 0;
  const attr = key.split('|')[0];
  const base = (isAdvKey(key) ? 0 : attrTotal(attr)) + (s.c || 0);
  let cost = 0;
  for (let i = 0; i < s.cp; i++) {
    let d = Math.max(1, Math.floor((base + i) / 3));
    cost += isAdvKey(key) ? d * 2 : d;
  }
  return cost;
}
function attrCpSpent(key) {
  const base = attrMin(key) + (C.attrs[key] || 0);
  let cost = 0;
  for (let i = 0; i < (C.attrsCP[key] || 0); i++)
    cost += 10 * Math.max(1, Math.floor((base + i) / 3));
  return cost;
}
function forceCpSpent(key) {
  const base = C.force[key] || 0;
  let cost = 0;
  for (let i = 0; i < (C.forceCP[key] || 0); i++)
    cost += Math.max(1, Math.floor((base + i) / 3));
  return cost;
}
function cpSpentAuto() {
  let t2 = 0;
  ATTRS.forEach(a => t2 += attrCpSpent(a.key));
  FORCE.forEach(f => t2 += forceCpSpent(f.key));
  Object.keys(C.skills).forEach(k => t2 += skillCpSpent(k));
  return t2;
}
function cpLeft() { return (+C.points.cpEarned || 0) - cpSpentAuto() - (+C.points.cpSpentOther || 0); }

function skillsFor(attr) {
  const rows = [];
  const std = DATA.skills[attr] || [];
  std.forEach(n => {
    rows.push({ name: n, attr, spec: null, std: true });
    C.extraSkills.filter(e => e.attr === attr && e.spec === n)
      .forEach(e => rows.push({ name: e.name, attr, spec: n }));
  });
  C.extraSkills.filter(e => e.attr === attr && !e.spec && !e.adv && !std.includes(e.name))
    .forEach(e => rows.push({ name: e.name, attr, spec: null, extra: true, sb: e.sb }));
  return rows;
}
function isImproved(name) {
  const sp = speciesData();
  return (sp.skillImprove || []).some(si =>
    name.toLowerCase().startsWith(si.toLowerCase()) || si.toLowerCase().startsWith(name.toLowerCase()));
}

/* ---------------- Macht ---------------- */
function powersAllowed() {
  let pips = 0;
  FORCE.forEach(f => pips += forceTotal(f.key));
  return pips + (+C.overrides.powersLeft || 0);
}
function powersLeft() { return powersAllowed() - C.powers.length; }
function fpStart() { return C.info.forceSensitive ? 2 : 1; }

/* ---------------- Credits ---------------- */
function catByName(list, name) { return list.find(x => x.name === name); }
function creditTotals() {
  let equip = 0;
  Object.entries(C.equipment).forEach(([n, q]) => {
    const it = catByName(DATA.equipment, n); if (it && q > 0) equip += it.cost * q;
  });
  C.customEquipment.forEach(it => equip += (+it.cost || 0) * (+it.qty || 0));
  let armor = 0;
  C.armor.forEach(n => { const a = catByName(DATA.armor, n); if (a) armor += a.cost; });
  C.customArmor.forEach(a => armor += (+a.cost || 0));
  let melee = 0;
  C.melee.forEach(n => { const m = catByName(DATA.melee, n); if (m) melee += m.cost; });
  C.customMelee.forEach(m => melee += (+m.cost || 0));
  C.sabers.forEach(sb => (sb.mods || []).forEach(mn => {
    const m = catByName(DATA.saber.mods, mn); if (m) melee += m.cost;
  }));
  let ranged = 0;
  C.ranged.forEach(n => { const r = catByName(DATA.ranged, n); if (r) ranged += r.cost; });
  C.customRanged.forEach(r => ranged += (+r.cost || 0));
  let expl = 0;
  Object.entries(C.explosives).forEach(([n, q]) => {
    const e = catByName(DATA.explosives, n); if (e && q > 0) expl += e.cost * q;
  });
  C.customExplosives.forEach(e => expl += (+e.cost || 0) * (+e.qty || 0));
  const spent = (+C.credits.spentMisc || 0) + (+C.credits.spentShip || 0) + equip + armor + melee + ranged + expl;
  return { equip, armor, melee, ranged, expl, spent, left: (+C.credits.earned || 0) - spent };
}

/* ---------------- Lichtschwert ---------------- */
function saberDamage(sb) {
  const p = catByName(DATA.saber.primary, sb.primary);
  let dmg = p ? p.dmg : 15;
  const s = catByName(DATA.saber.secondary, sb.secondary);
  const tt = catByName(DATA.saber.secondary, sb.tertiary);
  if (s) dmg += s.mod;
  if (tt) dmg += tt.mod;
  return dmg;
}
function saberAbilities(sb) {
  const out = [];
  const p = catByName(DATA.saber.primary, sb.primary);
  if (p && p.ability) out.push(p.name + ': ' + p.ability);
  [sb.secondary, sb.tertiary].forEach(n => {
    const c = catByName(DATA.saber.secondary, n);
    if (c && c.ability) out.push(c.name + ': ' + c.ability);
  });
  (sb.mods || []).forEach(mn => {
    const m = catByName(DATA.saber.mods, mn);
    if (m) out.push(m.name + (m.ability ? ': ' + m.ability : ''));
  });
  return out;
}

/* =====================================================================
   RENDERING
   ===================================================================== */
let activeTab = 'info';
let saveTimer = null;

function autosave() {
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    try { localStorage.setItem(LS_CURRENT, JSON.stringify(C)); } catch (e) {}
  }, 300);
}
function update(tab) {
  autosave();
  renderTab(tab || activeTab);
}
function renderTab(tab) {
  const el = document.getElementById('tab-' + tab);
  if (!el) return;
  switch (tab) {
    case 'info': el.innerHTML = viewInfo(); break;
    case 'attrs': el.innerHTML = viewAttrs(); break;
    case 'skills': el.innerHTML = viewSkills(); break;
    case 'force': el.innerHTML = viewForce(); break;
    case 'equip': el.innerHTML = viewEquip(); break;
    case 'weapons': el.innerHTML = viewWeapons(); break;
    case 'armor': el.innerHTML = viewArmor(); break;
    case 'credits': el.innerHTML = viewCredits(); break;
    case 'sheet': renderSheet(); break;
  }
}
function renderAll() { renderTab(activeTab); refreshSavedList(); }

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

/* ---------------- Charakterbild ---------------- */
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
      let q = 0.85;
      let out = cv.toDataURL('image/jpeg', q);
      while (out.length > 250 * 1024 && q > 0.4) {
        q -= 0.15;
        out = cv.toDataURL('image/jpeg', q);
      }
      C.info.portrait = out;
      update('info');
    };
    img.onerror = () => alert(t('portrait_error'));
    img.src = rd.result;
  };
  rd.readAsDataURL(file);
}

/* ---------------- Tab: Charakter ---------------- */
function viewInfo() {
  const sp = speciesData();
  ensureCloudSpecies();
  const extra = extraSpecies();
  const speciesOpts = DATA.species.map(s =>
    `<option ${C.info.species === s.name ? 'selected' : ''}>${esc(s.name)}</option>`).join('')
    + (extra.length
      ? `<optgroup label="${esc(t('pdf_species_group'))}">`
        + extra.map(s => `<option ${C.info.species === s.name ? 'selected' : ''}>${esc(s.name)}</option>`).join('')
        + '</optgroup>'
      : '')
    + ((cloudSpecies || []).length
      ? `<optgroup label="${esc(t('cloud_species_group'))}">`
        + cloudSpecies.map(cs => `<option value="cloud:${cs.id}">${esc(cs.name)} (${esc(cs.owner)})</option>`).join('')
        + '</optgroup>'
      : '');
  const nhOpts = [`<option value="">${t('nh_choose')}</option>`]
    .concat(DATA.nearHumans.map(s => `<option ${C.info.nearHuman === s.name ? 'selected' : ''}>${esc(s.name)}</option>`)).join('');
  const genderOpts = DATA.genders.map(g => `<option ${C.info.gender === g ? 'selected' : ''}>${esc(g)}</option>`).join('');
  const planetList = DATA.planets.map(p => `<option value="${esc(p)}">`).join('');

  const portraitCard = `
    <div class="card">
      <h2>${t('portrait')}</h2>
      <div style="display:flex; gap:14px; align-items:flex-start; flex-wrap:wrap">
        <div class="portrait-drop" data-portrait-drop="1" title="${esc(t('portrait_import'))}">
          ${C.info.portrait
            ? `<img src="${C.info.portrait}" alt="Portrait">`
            : `<div class="portrait-empty">${t('portrait_placeholder')}</div>`}
        </div>
        <div style="flex:1; min-width:180px">
          <p>
            <label class="filebtn">${t('portrait_import')}<input type="file" id="portraitFile" accept="image/*" hidden></label>
            ${C.info.portrait ? ` <button class="mini danger" data-act="portraitRemove">× ${t('portrait_remove')}</button>` : ''}
          </p>
          <p class="hint">${t('portrait_hint')}</p>
        </div>
      </div>
    </div>`;

  let speciesBox = `
    <div class="card">
      <h2>${t('species_info')}: ${esc(sp.name)}</h2>
      <p class="hint">
        ${t('source')}: <b>${esc(sp.page || '–')}</b> &nbsp;·&nbsp; ${t('homeworld')}: <b>${esc(sp.planet || '–')}</b>
        &nbsp;·&nbsp; ${t('move')}: <b>${sp.move}</b>
        ${sp.hMax ? `&nbsp;·&nbsp; ${t('height')}: <b>${sp.hMin}–${sp.hMax} m</b>` : ''}
        ${(sp.armorP || sp.armorE) ? `&nbsp;·&nbsp; ${t('natural_armor')}: <b>+${fmtD(sp.armorP)} ${t('phys_short')} / +${fmtD(sp.armorE)} ${t('ener_short')}</b>` : ''}
      </p>
      ${sp.abilities.length ? `<h3>${t('special_abilities')}</h3><ul>${sp.abilities.map(a => `<li>${esc(a)}</li>`).join('')}</ul>` : ''}
      ${sp.story.length ? `<h3>${t('story_factors')}</h3><ul>${sp.story.map(a => `<li>${esc(a)}</li>`).join('')}</ul>` : ''}
      ${sp.skillImprove.length ? `<h3>${t('typical_skills')}</h3><p>${sp.skillImprove.map(a => `<span class="badge gold">${esc(a)}</span>`).join(' ')}</p>` : ''}
      ${sp.bonusSkills.length ? `<h3>${t('bonus_skills')}</h3><p>${sp.bonusSkills.map(a => `<span class="badge gold">${esc(a.name)}</span>`).join(' ')}</p>` : ''}
    </div>`;

  let customBox = '';
  if (C.info.species === 'Custom') {
    const cs = C.customSpecies;
    customBox = `<div class="card"><h2>${t('custom_species_def')}</h2>
      <div class="formgrid">
        <div><label>${t('species_name')}</label>${inputT('customSpecies.name', cs.name)}</div>
        <div><label>${t('move')}</label>${inputN('customSpecies.move', cs.move, 'data-rerender="1"')}</div>
      </div>
      <h3>${t('attr_limits')}</h3>
      <div class="table-scroll"><table class="list"><tr><th></th>${ATTRS.map(a => `<th>${a.name}</th>`).join('')}</tr>
      <tr><td>${t('min')}</td>${ATTRS.map((a, i) => `<td>${inputN('customSpecies.mins.' + i, cs.mins[i], 'data-rerender="1" style="width:70px"')}</td>`).join('')}</tr>
      <tr><td>${t('max')}</td>${ATTRS.map((a, i) => `<td>${inputN('customSpecies.maxs.' + i, cs.maxs[i], 'data-rerender="1" style="width:70px"')}</td>`).join('')}</tr>
      </table></div>
      <h3>${t('special_abilities')}</h3>
      ${cs.abilities.map((a, i) => `<p>${inputT('customSpecies.abilities.' + i, a, 'style="width:100%"')}</p>`).join('')}
      <h3>${t('story_factors')}</h3>
      ${cs.story.map((a, i) => `<p>${inputT('customSpecies.story.' + i, a, 'style="width:100%"')}</p>`).join('')}
      ${(typeof ONLINE !== 'undefined' && ONLINE.token) ? `
        <p style="margin-top:12px"><button class="accent" data-act="speciesSaveCloud">${t('species_save_cloud')}</button>
        ${speciesMsg ? `<span class="ok" style="margin-left:8px">${esc(speciesMsg)}</span>` : ''}</p>
        <p class="hint">${t('species_save_cloud_hint')}</p>` : ''}
    </div>`;
  }

  /* Online gespeicherte Spezies der Gruppe */
  let cloudBox = '';
  if ((cloudSpecies || []).length && typeof ONLINE !== 'undefined' && ONLINE.token) {
    const rows = cloudSpecies.map(cs2 => `<tr>
      <td>${esc(cs2.name)} <span class="hint">(${t('species_by')} ${esc(cs2.owner)})</span></td>
      <td class="nowrap">
        <button class="mini" data-act="speciesUse" data-id="${cs2.id}">${t('species_use')}</button>
        ${(cs2.mine || ONLINE.isAdmin) ? `<button class="mini danger" data-act="speciesDelete" data-id="${cs2.id}" data-name="${esc(cs2.name)}">×</button>` : ''}
      </td></tr>`).join('');
    cloudBox = `<div class="card"><h2>${t('species_cloud_list')}</h2>
      <div class="table-scroll"><table class="list">${rows}</table></div></div>`;
  }

  return `
  <div class="grid2">
    <div>
      <div class="card">
        <h2>${t('personal_data')}</h2>
        <div class="formgrid">
          <div><label>${t('char_name')}</label>${inputT('info.name', C.info.name)}</div>
          <div><label>${t('player_name')}</label>${inputT('info.player', C.info.player)}</div>
          <div><label>${t('occupation')}</label>${inputT('info.occupation', C.info.occupation)}</div>
          <div><label>${t('species')}</label>
            <select data-bind="info.species" data-rerender="1" data-species="1">${speciesOpts}</select>
          </div>
          ${C.info.species === 'Near-Human' ? `<div><label>${t('nh_variant')}</label>
            <select data-bind="info.nearHuman" data-rerender="1" data-species="1">${nhOpts}</select></div>` : ''}
          <div><label>${t('gender')}</label><select data-bind="info.gender" data-rerender="1" ${C.info.species === 'Trianii' ? 'data-species="1"' : ''}>${genderOpts}</select></div>
          <div><label>${t('force_sensitive')}</label>
            <select data-bind="info.forceSensitive" data-type="bool" data-rerender="1">
              <option value="false" ${!C.info.forceSensitive ? 'selected' : ''}>${t('no')}</option>
              <option value="true" ${C.info.forceSensitive ? 'selected' : ''}>${t('yes')}</option>
            </select></div>
          <div><label>${t('home_planet')}</label><input type="text" list="planets" autocomplete="off" data-bind="info.planet" value="${esc(C.info.planet)}"><datalist id="planets">${planetList}</datalist></div>
          <div><label>${t('age')}</label>${inputT('info.age', C.info.age)}</div>
          <div><label>${t('height_m')} ${sp.hMax ? `<span class="hint">[${sp.hMin}–${sp.hMax}]</span>` : ''}</label>${inputT('info.height', C.info.height)}</div>
          <div><label>${t('weight_kg')}</label>${inputT('info.weight', C.info.weight)}</div>
          <div class="wide"><label>${t('quote')}</label>${inputT('info.quote', C.info.quote, 'style="width:100%"')}</div>
        </div>
      </div>
      <div class="card">
        <h2>${t('desc_bg')}</h2>
        <label>${t('appearance')}</label><textarea data-bind="info.description">${esc(C.info.description)}</textarea>
        <label style="margin-top:10px">${t('history')}</label><textarea data-bind="info.history">${esc(C.info.history)}</textarea>
        <label style="margin-top:10px">${t('personality')}</label><textarea data-bind="info.personality">${esc(C.info.personality)}</textarea>
        <label style="margin-top:10px">${t('objectives')}</label><textarea data-bind="info.objectives">${esc(C.info.objectives)}</textarea>
        <label style="margin-top:10px">${t('other_notes')}</label><textarea data-bind="notes">${esc(C.notes)}</textarea>
      </div>
    </div>
    <div>
      ${portraitCard}
      ${speciesBox}
      ${customBox}
      ${cloudBox}
    </div>
  </div>`;
}

/* ---------------- Erweiterte Kataloge aus den Regelwerks-PDFs ----------------
   Die Listen sind sehr groß (bis 550 Einträge), deshalb wird nur nach einer
   Suche gefiltert angezeigt. Übernommene Einträge landen als "eigene" Waffe
   bzw. Ausrüstung in der Charakterliste – damit funktionieren Bogen und
   Kostenrechnung unverändert weiter. */
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
function eraLabel(e) {
  return e ? t('era_' + e.replace('-', '_')) : t('era_universal');
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
  const LIMIT = 60;
  let rows = '', info = '';
  {
    /* Der Katalog zeigt von sich aus die ersten Einträge. Früher blieb er
       leer, bis jemand zwei Zeichen tippte – dann wirkt die Karte, als
       wäre gar nichts drin. Suche und Ära grenzen jetzt nur noch ein. */
    const matchEra = x => !era || x.era === era;
    const matchText = x => f.length < 2 ||
      x.name.toLowerCase().includes(f) || (x.type || '').toLowerCase().includes(f) ||
      (x.model || '').toLowerCase().includes(f);
    const all = src.filter(x => matchEra(x) && matchText(x));
    const hits = all.slice(0, LIMIT);
    if (!hits.length) info = `<p class="hint">${t('pdf_none')}</p>`;
    else {
      const cols = kind === 'equip'
        ? h => `<td>${esc(h.type)}</td><td class="num">${fmtCr(h.cost)}</td><td>${esc(h.avail)}</td>`
        : h => `<td>${esc(h.damage)}</td><td>${esc(h.range || h.diff)}</td><td class="num">${fmtCr(h.cost)}</td>`;
      rows = hits.map(h => {
        const idx = src.indexOf(h);
        const prov = [h.book, eraLabel(h.era)].filter(Boolean).join(' · ');
        return `<tr><td>${esc(h.name)}
          ${prov ? `<br><span class="hint">${esc(prov)}</span>` : ''}
          ${h.notes ? `<br><span class="hint">${esc(h.notes.slice(0, 160))}${h.notes.length > 160 ? '…' : ''}</span>` : ''}</td>
          ${cols(h)}
          <td><button class="mini" data-act="pdfAdd" data-kind="${kind}" data-i="${idx}">${t('pdf_add')}</button></td></tr>`;
      }).join('');
      info = `<p class="hint">${t('pdf_results')}: ${hits.length} / ${all.length}${
        all.length > LIMIT ? ' · ' + t('pdf_more') : ''}</p>`;
    }
  }
  const head = kind === 'equip'
    ? `<th>${t('item')}</th><th>${t('pdf_type_all')}</th><th class="num">${t('cost')}</th><th>${t('avail')}</th><th></th>`
    : `<th>${t('weapon')}</th><th>${t('damage')}</th><th>${kind === 'ranged' ? t('range_pkml') : t('difficulty')}</th><th class="num">${t('cost')}</th><th></th>`;
  return `<div class="card"><h2>${t('pdf_catalog')}</h2>
    <p class="hint">${t('pdf_hint')}</p>
    <p><input type="text" data-pdfsearch="${kind}" value="${esc(pdfFilter[kind])}"
       placeholder="${esc(t('pdf_search'))}…" style="width:260px">
       <select data-pdfera="${kind}" style="width:200px">${eraOptions(pdfEra[kind])}</select></p>
    ${info}
    ${rows ? `<div class="table-scroll"><table class="list"><tr>${head}</tr>${rows}</table></div>` : ''}
  </div>`;
}
function pdfAdd(kind, idx) {
  const src = pdfSource(kind);
  const h = src[idx];
  if (!h) return;
  if (kind === 'melee') {
    C.customMelee.push({ name: h.name, dmg: h.damage, diff: h.diff, cost: h.cost,
                         note: [h.type, h.notes].filter(Boolean).join(' – ').slice(0, 300) });
  } else if (kind === 'ranged') {
    C.customRanged.push({ name: h.name, skill: (h.skill || '').split(':')[0], dmg: h.damage,
                          ranges: h.range, ammo: h.ammo, cost: h.cost });
  } else {
    C.customEquipment.push({ name: h.name, cost: h.cost, qty: 1,
                             note: [h.type, h.notes].filter(Boolean).join(' – ').slice(0, 300) });
  }
  update();
}

/* ---------------- Online gespeicherte Spezies ---------------- */
let cloudSpecies = null;   // null = noch nicht geladen
let speciesMsg = '';
function ensureCloudSpecies() {
  if (cloudSpecies !== null) return;
  if (typeof ONLINE === 'undefined' || !ONLINE.token || typeof api !== 'function') return;
  cloudSpecies = [];       // verhindert paralleles Mehrfachladen
  api('species_list').then(r => {
    cloudSpecies = r.species || [];
    if (activeTab === 'info') renderTab('info');
  }).catch(() => { cloudSpecies = []; });
}
function applyCloudSpecies(id) {
  const cs = (cloudSpecies || []).find(x => x.id === id);
  if (!cs) return;
  C.info.species = 'Custom';
  C.customSpecies = Object.assign(emptyChar().customSpecies, JSON.parse(JSON.stringify(cs.data || {})));
  if (!C.customSpecies.name) C.customSpecies.name = cs.name;
  onSpeciesChanged();
  update('info');
}
async function saveSpeciesCloud() {
  speciesMsg = '';
  if (typeof ONLINE === 'undefined' || !ONLINE.token) { alert(t('species_need_login')); return; }
  const name = (C.customSpecies.name || '').trim();
  if (!name) { alert(t('species_need_name')); return; }
  try {
    const existing = (cloudSpecies || []).find(x => x.mine && x.name === name);
    const body = { name, kind: 'species', data: C.customSpecies };
    if (existing) body.id = existing.id;
    await api('char_save', body);
    const r = await api('species_list');
    cloudSpecies = r.species || [];
    speciesMsg = t('species_saved');
  } catch (e) { speciesMsg = (t('online_error') || 'Fehler: ') + e.message; }
  renderTab('info');
}
async function deleteSpeciesCloud(id, name) {
  if (!confirm(t('species_confirm_delete').replace('{name}', name))) return;
  try {
    await api('species_delete', { id });
    const r = await api('species_list');
    cloudSpecies = r.species || [];
  } catch (e) { speciesMsg = (t('online_error') || 'Fehler: ') + e.message; }
  renderTab('info');
}

/* ---------------- Tab: Attribute ---------------- */
function viewAttrs() {
  const sp = speciesData();
  const left = attrPoolLeft();
  const rows = ATTRS.map(a => {
    const min = attrMin(a.key), max = attrMax(a.key);
    const total = attrTotal(a.key);
    const canPlus = left > 0 && (min + C.attrs[a.key] + 1) <= max;
    const canMinus = C.attrs[a.key] > 0;
    const cpCost = 10 * Math.max(1, Math.floor(total / 3));
    return `<div class="attr-row">
      <span class="aname">${a.name}</span>
      <span class="alimits">min ${fmtD(min)} · max ${fmtD(max)}</span>
      ${stepper('attr', `data-a="${a.key}"`, canMinus, canPlus)}
      <span class="dice">${fmtD(total)}</span>
      <span class="cost-hint">${t('cp_buy')} (${cpCost} CP):</span>
      ${stepper('attrCP', `data-a="${a.key}"`, C.attrsCP[a.key] > 0, (min + C.attrs[a.key] + C.attrsCP[a.key] + 1) <= max)}
      ${C.attrsCP[a.key] ? `<span class="badge">+${C.attrsCP[a.key]} ${t('pips_bought')} · ${attrCpSpent(a.key)} CP</span>` : ''}
    </div>`;
  }).join('');

  let forceRows = '';
  if (C.info.forceSensitive) {
    forceRows = FORCE.map(f => {
      const total = forceTotal(f.key);
      return `<div class="attr-row">
        <span class="aname">${f.name}</span>
        <span class="alimits">${t('force_skill')}</span>
        ${stepper('force', `data-f="${f.key}"`, C.force[f.key] > 0, left > 0)}
        <span class="dice">${fmtD(total)}</span>
        <span class="cost-hint">${t('cp_buy')} (${Math.max(1, Math.floor(total / 3))} CP):</span>
        ${stepper('forceCP', `data-f="${f.key}"`, C.forceCP[f.key] > 0, true)}
        ${C.forceCP[f.key] ? `<span class="badge">+${C.forceCP[f.key]} ${t('pips_bought')} · ${forceCpSpent(f.key)} CP</span>` : ''}
      </div>`;
    }).join('');
    forceRows = `<div class="card"><h2>${t('force_skills_heading')}</h2>${forceRows}
      <p class="hint">${t('force_skills_hint')}</p></div>`;
  }

  const cpAuto = cpSpentAuto();
  return `
  <div class="pool-banner ${left < 0 ? 'neg' : ''}">
    <span>${t('attr_pool')}: <b>${fmtD(attrPoolTotal())}</b></span>
    <span>${t('distributed')}: <b>${fmtD(attrPoolTotal() - left)}</b></span>
    <span class="${left < 0 ? 'neg' : ''}">${t('left')}: <b>${fmtD(left)}</b> ${left === 0 ? '<span class="ok">✔</span>' : ''}</span>
    <span class="hint">${t('species')}: ${esc(sp.name)} (${fmtD(54 + (sp.offset || 0))} ${t('start_dice')})</span>
    <span style="margin-left:auto"><label style="display:inline">${t('override_attr')}</label>
      ${inputN('overrides.attrDice', C.overrides.attrDice, 'data-rerender="1" style="width:70px"')}</span>
  </div>
  <div class="card"><h2>${t('attrs_heading')}</h2>${rows}</div>
  ${forceRows}
  <div class="grid3">
    <div class="card"><h2>${t('char_points')}</h2>
      <div class="formgrid">
        <div><label>${t('cp_earned')}</label>${inputN('points.cpEarned', C.points.cpEarned, 'data-rerender="1"')}</div>
        <div><label>${t('cp_other')}</label>${inputN('points.cpSpentOther', C.points.cpSpentOther, 'data-rerender="1"')}</div>
      </div>
      <p>${t('cp_upgrades')}: <b>${cpAuto} CP</b><br>
      ${t('left')}: <b class="${cpLeft() < 0 ? 'warn' : 'ok'}">${cpLeft()} CP</b></p>
    </div>
    <div class="card"><h2>${t('fp_dsp')}</h2>
      <p class="hint">${t('fp_start')}: <b>${fpStart()}</b> ${C.info.forceSensitive ? '(' + t('force_sensitive') + ')' : ''}</p>
      <div class="formgrid">
        <div><label>${t('fp_current')}</label>${inputN('points.fpCurrent', C.points.fpCurrent == null ? fpStart() : C.points.fpCurrent)}</div>
        <div><label>${t('dsp')}</label>${inputN('points.dsp', C.points.dsp)}</div>
      </div>
    </div>
    <div class="card"><h2>${t('movement')}</h2>
      <p>${t('base_species')}: <b>${sp.move}</b></p>
      <div><label>${t('improvement')}</label>${inputN('points.moveImp', C.points.moveImp, 'data-rerender="1"')}</div>
      <p>${t('total')}: <span class="dice">${(+sp.move || 0) + (+C.points.moveImp || 0)}</span></p>
    </div>
  </div>`;
}

/* ---------------- Tab: Skills ---------------- */
const collapsedSecs = {};
function viewSkills() {
  const left = skillPoolLeft();
  const sections = ATTRS.map(a => {
    const rows = skillsFor(a.key).map(r => {
      const key = skillKey(a.key, r.name);
      const e = C.skills[key] || { c: 0, cp: 0 };
      const total = skillTotal(key);
      const canPlus = left > 0 && e.c < 6;
      const extraIdx = C.extraSkills.findIndex(x => x.attr === a.key && x.name === r.name && !x.adv);
      return `<div class="skill-row ${r.spec ? 'spec' : ''} ${isImproved(r.name) ? 'improved' : ''}">
        <span class="sname">${r.spec ? '↳ ' : ''}${esc(skillName(r.name))}
          ${r.spec ? `<span class="tag">${t('specialization')}</span>` : ''}
          ${r.sb ? `<span class="tag">${t('species_bonus')}</span>` : ''}
        </span>
        ${stepper('skill', `data-key="${esc(key)}"`, e.c > 0, canPlus)}
        <span class="dice ${total > attrTotal(a.key) ? '' : 'plain'}">${fmtD(total)}</span>
        <span class="cost-hint">CP (${skillCpCost(key)}):</span>
        ${stepper('skillCP', `data-key="${esc(key)}"`, e.cp > 0, true)}
        ${e.cp ? `<span class="badge">+${e.cp} ${t('pips_bought')} · ${skillCpSpent(key)} CP</span>` : ''}
        ${r.std ? `<button class="mini" data-act="addSpec" data-attr="${a.key}" data-parent="${esc(r.name)}" title="${t('add_spec_title')}">S+</button>` : ''}
        ${(!r.std) ? `<button class="mini danger" data-act="delExtra" data-idx="${extraIdx}" title="${t('remove')}">×</button>` : ''}
      </div>`;
    }).join('');
    const spentHere = skillsFor(a.key).reduce((tt, r) => {
      const e = C.skills[skillKey(a.key, r.name)]; return tt + (e ? e.c || 0 : 0);
    }, 0);
    return `<div class="skill-section">
      <div class="skill-head" data-act="toggleSec" data-sec="${a.key}">
        <span class="aname">${a.name}</span>
        <span class="dice plain">${fmtD(attrTotal(a.key))}</span>
        <span class="hint">${spentHere ? t('spent') + ' ' + fmtD(spentHere) : ''}</span>
        <span style="margin-left:auto" class="hint">▼</span>
      </div>
      <div class="skill-body" id="sec-${a.key}" ${collapsedSecs[a.key] ? 'style="display:none"' : ''}>
        ${rows}
        <p><button class="mini" data-act="addCustomSkill" data-attr="${a.key}">${t('add_custom_skill')}</button></p>
      </div>
    </div>`;
  }).join('');

  const advRows = ADV_SKILLS.concat(C.extraSkills.filter(e => e.adv).map(e => ({ name: e.name, attr: e.attr, req: e.req || '', custom: true })))
    .map(sk => {
      const key = skillKey(sk.attr, sk.name);
      const e = C.skills[key] || { c: 0, cp: 0 };
      const total = skillTotal(key);
      let reqOk = true;
      if (sk.name === '(A) Medicine') reqOk = skillTotal(skillKey('tec', 'First Aid')) >= 15;
      const extraIdx = C.extraSkills.findIndex(x => x.adv && x.name === sk.name);
      return `<div class="skill-row">
        <span class="sname">${esc(sk.name)} <span class="tag">${t('requirement')}: ${esc(sk.req || '–')}</span>
          ${!reqOk ? `<span class="warn"> ${t('req_missing')}</span>` : ''}</span>
        ${stepper('skill', `data-key="${esc(key)}"`, e.c > 0, left > 0 && e.c < 6)}
        <span class="dice plain">${fmtD(total)}</span>
        <span class="cost-hint">CP (${skillCpCost(key)}):</span>
        ${stepper('skillCP', `data-key="${esc(key)}"`, e.cp > 0, true)}
        ${e.cp ? `<span class="badge">+${e.cp} ${t('pips_bought')} · ${skillCpSpent(key)} CP</span>` : ''}
        ${sk.custom ? `<button class="mini danger" data-act="delExtra" data-idx="${extraIdx}">×</button>` : ''}
      </div>`;
    }).join('');

  return `
  <div class="pool-banner ${left < 0 ? 'neg' : ''}">
    <span>${t('skill_pool')}: <b>${fmtD(skillPoolTotal())}</b></span>
    <span class="${left < 0 ? 'neg' : ''}">${t('left')}: <b>${fmtD(left)}</b> ${left === 0 ? '<span class="ok">✔</span>' : ''}</span>
    <span class="hint">${t('skill_hint')}</span>
    <span style="margin-left:auto"><label style="display:inline">${t('override_skill')}</label>
      ${inputN('overrides.skillDice', C.overrides.skillDice, 'data-rerender="1" style="width:70px"')}</span>
  </div>
  ${sections}
  <div class="card"><h2>${t('adv_skills')}</h2>${advRows}
    <p><button class="mini" data-act="addAdvSkill">${t('add_adv_skill')}</button></p>
    <p class="hint">${t('adv_hint')}</p>
  </div>`;
}

/* ---------------- Tab: Macht ---------------- */
function viewForce() {
  if (!C.info.forceSensitive && !C.powers.length && !FORCE.some(f => forceTotal(f.key) > 0)) {
    return `<div class="card"><h2>${t('the_force')}</h2>
      <p>${t('not_sensitive')}</p>
      <p class="hint">${t('not_sensitive_hint')}</p></div>`;
  }
  const dice = FORCE.map(f =>
    `<span style="margin-right:24px">${f.name}: <span class="dice">${fmtD(forceTotal(f.key))}</span></span>`).join('');
  const left = powersLeft();
  const cats = [...new Set(DATA.powers.map(p => p.cat))];
  const catBlocks = cats.map(cat => {
    const rows = DATA.powers.filter(p => p.cat === cat).map(p => {
      const has = C.powers.includes(p.name);
      const missing = p.prereq && p.prereq !== 'No Prerequisite' && p.prereq !== 'Special' &&
        !p.prereq.split(/,| and /i).every(x => {
          const tr = x.trim().replace(/\.$/, '');
          return !tr || C.powers.some(pw => pw.toLowerCase().startsWith(tr.toLowerCase().slice(0, Math.max(4, tr.length - 2))));
        });
      return `<div class="power-row ${has ? 'learned' : ''}">
        <input type="checkbox" data-act="powerToggle" data-power="${esc(p.name)}" ${has ? 'checked' : ''}>
        <div>
          <div class="pname">${esc(p.name)} ${p.dark === 'Yes' ? `<span class="dark" title="${t('dark_side_title')}">☠</span>` : ''}</div>
          <div class="pmeta">
            ${t('difficulty')}: ${esc(p.diff || '–')} · ${t('keep_up')}: ${p.kept === 'Yes' ? t('yes') : t('no')} · ${esc(p.page)}
            ${p.prereq && p.prereq !== 'No Prerequisite' ? `<br>${t('requirement')}: ${esc(p.prereq)} ${has && missing ? `<span class="warn">${t('maybe_missing')}</span>` : ''}` : ''}
          </div>
        </div>
      </div>`;
    }).join('');
    return `<div class="card"><h2>${esc(cat)}</h2>${rows}</div>`;
  }).join('');

  return `
  <div class="pool-banner ${left < 0 ? 'neg' : ''}">
    ${dice}
    <span>${t('powers_learnable')}: <b>${powersAllowed()}</b></span>
    <span>${t('learned')}: <b>${C.powers.length}</b></span>
    <span class="${left < 0 ? 'neg' : ''}">${t('left')}: <b>${left}</b></span>
    <span style="margin-left:auto"><label style="display:inline">${t('override_powers')}</label>
      ${inputN('overrides.powersLeft', C.overrides.powersLeft, 'data-rerender="1" style="width:70px"')}</span>
  </div>
  <p class="hint">${t('powers_hint')}</p>
  ${catBlocks}`;
}

/* ---------------- Tab: Ausrüstung ---------------- */
function viewEquip() {
  const cats = [...new Set(DATA.equipment.map(e => e.cat))];
  const blocks = cats.map(cat => {
    const rows = DATA.equipment.filter(e => e.cat === cat).map(e => {
      const qty = C.equipment[e.name] || 0;
      return `<tr>
        <td>${esc(e.name)}${e.note ? `<br><span class="hint">${esc(e.note)}</span>` : ''}</td>
        <td class="num">${fmtCr(e.cost)}</td>
        <td>${esc(e.avail)}</td>
        <td class="num"><input type="number" min="0" data-eq="${esc(e.name)}" value="${qty}" style="width:64px"></td>
        <td class="num">${qty ? fmtCr(e.cost * qty) : '–'}</td>
      </tr>`;
    }).join('');
    return `<div class="card"><h2>${esc(tCat(cat))}</h2><div class="table-scroll">
      <table class="list"><tr><th>${t('item')}</th><th class="num">${t('cost')}</th><th>${t('avail')}</th><th class="num">${t('qty')}</th><th class="num">${t('sum')}</th></tr>${rows}</table></div></div>`;
  }).join('');

  const customRows = C.customEquipment.map((e, i) => `<tr>
    <td>${inputT('customEquipment.' + i + '.name', e.name)}</td>
    <td class="num">${inputN('customEquipment.' + i + '.cost', e.cost, 'data-rerender="1" style="width:90px"')}</td>
    <td class="num">${inputN('customEquipment.' + i + '.qty', e.qty, 'data-rerender="1" style="width:64px"')}</td>
    <td>${inputT('customEquipment.' + i + '.note', e.note)}</td>
    <td><button class="mini danger" data-act="delCustom" data-list="customEquipment" data-idx="${i}">×</button></td>
  </tr>`).join('');

  const tt = creditTotals();
  return `
  <div class="pool-banner"><span>${t('equip_cost')}: <b>${fmtCr(tt.equip)}</b> ${t('credits_word')}</span>
    <span>${t('credits_left')}: <b class="${tt.left < 0 ? 'warn' : ''}">${fmtCr(tt.left)}</b></span></div>
  ${blocks}
  <div class="card"><h2>${t('other_equip')}</h2>
    <div class="table-scroll"><table class="list"><tr><th>${t('item')}</th><th class="num">${t('cost')}</th><th class="num">${t('qty')}</th><th>${t('note')}</th><th></th></tr>${customRows}</table></div>
    <p><button class="mini" data-act="addCustom" data-list="customEquipment">${t('add_entry')}</button></p>
  </div>
  ${pdfCatalogBlock('equip')}`;
}

/* ---------------- Tab: Waffen ---------------- */
let weaponsSub = 'melee';
let saberTemp = { name: '', primary: 'Mephite', secondary: '', tertiary: '', color: 'Blue', mods: ['', '', '', ''] };
function viewWeapons() {
  const sub = weaponsSub;
  const btn = (id, label) => `<button class="${sub === id ? 'active' : ''}" data-act="wsub" data-sub="${id}">${label}</button>`;
  let body = '';

  if (sub === 'melee') {
    const owned = C.melee.map((n, i) => {
      const m = catByName(DATA.melee, n); if (!m) return '';
      return `<tr><td>${esc(m.name)}</td><td>STR+${fmtD(m.dmg)}</td><td>${m.maxDmg ? fmtD(m.maxDmg) : '–'}</td>
        <td>${esc(m.diff)}</td><td class="num">${fmtCr(m.cost)}</td><td>${esc(m.ability)}</td>
        <td><button class="mini danger" data-act="delOwn" data-list="melee" data-idx="${i}">×</button></td></tr>`;
    }).join('');
    const customRows = C.customMelee.map((m, i) => `<tr>
      <td>${inputT('customMelee.' + i + '.name', m.name)}</td>
      <td>${inputT('customMelee.' + i + '.dmg', m.dmg, 'style="width:110px" placeholder="STR+1D"')}</td>
      <td>${inputT('customMelee.' + i + '.diff', m.diff, 'style="width:100px"')}</td>
      <td class="num">${inputN('customMelee.' + i + '.cost', m.cost, 'data-rerender="1" style="width:90px"')}</td>
      <td>${inputT('customMelee.' + i + '.note', m.note)}</td>
      <td><button class="mini danger" data-act="delCustom" data-list="customMelee" data-idx="${i}">×</button></td></tr>`).join('');
    const cat = DATA.melee.map((m, i) => `<tr>
      <td>${esc(m.name)}</td><td>STR+${fmtD(m.dmg)}</td><td>${m.maxDmg ? fmtD(m.maxDmg) : '–'}</td>
      <td>${esc(m.diff)}</td><td class="num">${fmtCr(m.cost)}</td><td>${esc(m.avail)}</td>
      <td>${esc(m.ability)}</td>
      <td><button class="mini" data-act="addOwn" data-list="melee" data-i="${i}">+</button></td></tr>`).join('');
    body = `
      <div class="card"><h2>${t('my_melee')}</h2><div class="table-scroll">
        <table class="list"><tr><th>${t('weapon')}</th><th>${t('damage')}</th><th>${t('max_short')}</th><th>${t('difficulty')}</th><th class="num">${t('cost')}</th><th>${t('special')}</th><th></th></tr>${owned || `<tr><td colspan="7" class="hint">${t('none_dash')}</td></tr>`}</table></div>
        <h3>${t('custom_melee')}</h3><div class="table-scroll">
        <table class="list"><tr><th>${t('name')}</th><th>${t('damage')}</th><th>${t('difficulty')}</th><th class="num">${t('cost')}</th><th>${t('note')}</th><th></th></tr>${customRows}</table></div>
        <p><button class="mini" data-act="addCustom" data-list="customMelee">${t('add_entry')}</button></p></div>
      <div class="card"><h2>${t('cat_melee')}</h2><div class="table-scroll">
        <table class="list"><tr><th>${t('weapon')}</th><th>${t('damage')}</th><th>${t('max_short')}</th><th>${t('difficulty')}</th><th class="num">${t('cost')}</th><th>${t('avail')}</th><th>${t('special')}</th><th></th></tr>${cat}</table></div></div>
      ${pdfCatalogBlock('melee')}`;
  }

  if (sub === 'ranged') {
    const owned = C.ranged.map((n, i) => {
      const r = catByName(DATA.ranged, n); if (!r) return '';
      return `<tr><td>${esc(r.name)}</td><td>${esc(r.skill)}</td><td>${fmtD(r.dmg)}</td>
        <td>${esc(r.close)}/${esc(r.short)}/${esc(r.medium)}/${esc(r.long)}</td>
        <td>${esc(r.rof)}</td><td>${esc(r.ammo)}</td><td class="num">${fmtCr(r.cost)}</td>
        <td><button class="mini danger" data-act="delOwn" data-list="ranged" data-idx="${i}">×</button></td></tr>`;
    }).join('');
    const customRows = C.customRanged.map((r, i) => `<tr>
      <td>${inputT('customRanged.' + i + '.name', r.name)}</td>
      <td>${inputT('customRanged.' + i + '.skill', r.skill, 'style="width:110px"')}</td>
      <td>${inputT('customRanged.' + i + '.dmg', r.dmg, 'style="width:80px"')}</td>
      <td>${inputT('customRanged.' + i + '.ranges', r.ranges, 'style="width:130px" placeholder="3/30/100/300"')}</td>
      <td>${inputT('customRanged.' + i + '.ammo', r.ammo, 'style="width:70px"')}</td>
      <td class="num">${inputN('customRanged.' + i + '.cost', r.cost, 'data-rerender="1" style="width:90px"')}</td>
      <td><button class="mini danger" data-act="delCustom" data-list="customRanged" data-idx="${i}">×</button></td></tr>`).join('');
    const cat = DATA.ranged.map((r, i) => `<tr>
      <td>${esc(r.name)}${r.ability ? `<br><span class="hint">${esc(r.ability)}</span>` : ''}</td>
      <td>${esc(r.skill)}</td><td>${fmtD(r.dmg)}</td>
      <td>${esc(r.close)}/${esc(r.short)}/${esc(r.medium)}/${esc(r.long)}</td>
      <td>${esc(r.rof)}</td><td>${esc(r.ammo)}</td><td class="num">${fmtCr(r.cost)}</td><td>${esc(r.avail)}</td>
      <td><button class="mini" data-act="addOwn" data-list="ranged" data-i="${i}">+</button></td></tr>`).join('');
    body = `
      <div class="card"><h2>${t('my_ranged')}</h2><div class="table-scroll">
        <table class="list"><tr><th>${t('weapon')}</th><th>${t('skill')}</th><th>${t('damage')}</th><th>${t('range_pkml')}</th><th>${t('rof')}</th><th>${t('ammo')}</th><th class="num">${t('cost')}</th><th></th></tr>${owned || `<tr><td colspan="8" class="hint">${t('none_dash')}</td></tr>`}</table></div>
        <h3>${t('custom_ranged')}</h3><div class="table-scroll">
        <table class="list"><tr><th>${t('name')}</th><th>${t('skill')}</th><th>${t('damage')}</th><th>${t('range_pkml')}</th><th>${t('ammo_short')}</th><th class="num">${t('cost')}</th><th></th></tr>${customRows}</table></div>
        <p><button class="mini" data-act="addCustom" data-list="customRanged">${t('add_entry')}</button></p></div>
      <div class="card"><h2>${t('cat_ranged')}</h2><div class="table-scroll">
        <table class="list"><tr><th>${t('weapon')}</th><th>${t('skill')}</th><th>${t('damage')}</th><th>${t('range_pkml')}</th><th>${t('rof')}</th><th>${t('ammo_short')}</th><th class="num">${t('cost')}</th><th>${t('avail')}</th><th></th></tr>${cat}</table></div></div>
      ${pdfCatalogBlock('ranged')}`;
  }

  if (sub === 'explosives') {
    const rows = DATA.explosives.map(e => {
      const qty = C.explosives[e.name] || 0;
      return `<tr><td>${esc(e.name)}${e.ability ? `<br><span class="hint">${esc(e.ability)}</span>` : ''}</td>
        <td>${e.dmg.filter(x => x && x !== '-').map(x => fmtD(+x)).join(' / ')}</td>
        <td>${e.ranges.map(x => x || '–').join('/')}</td>
        <td>${e.radius.map(x => x || '–').join('/')}</td>
        <td class="num">${fmtCr(e.cost)}</td><td>${esc(e.avail)}</td>
        <td class="num"><input type="number" min="0" data-exp="${esc(e.name)}" value="${qty}" style="width:64px"></td>
        <td class="num">${qty ? fmtCr(e.cost * qty) : '–'}</td></tr>`;
    }).join('');
    const customRows = C.customExplosives.map((e, i) => `<tr>
      <td>${inputT('customExplosives.' + i + '.name', e.name)}</td>
      <td>${inputT('customExplosives.' + i + '.dmg', e.dmg, 'style="width:110px"')}</td>
      <td class="num">${inputN('customExplosives.' + i + '.cost', e.cost, 'data-rerender="1" style="width:90px"')}</td>
      <td class="num">${inputN('customExplosives.' + i + '.qty', e.qty, 'data-rerender="1" style="width:64px"')}</td>
      <td>${inputT('customExplosives.' + i + '.note', e.note)}</td>
      <td><button class="mini danger" data-act="delCustom" data-list="customExplosives" data-idx="${i}">×</button></td></tr>`).join('');
    body = `
      <div class="card"><h2>${t('explosives')}</h2><div class="table-scroll">
        <table class="list"><tr><th>${t('explosive')}</th><th>${t('damage')}</th><th>${t('throw_range')}</th><th>${t('radius')}</th><th class="num">${t('cost')}</th><th>${t('avail')}</th><th class="num">${t('qty')}</th><th class="num">${t('sum')}</th></tr>${rows}</table></div>
        <h3>${t('custom_expl')}</h3><div class="table-scroll">
        <table class="list"><tr><th>${t('name')}</th><th>${t('damage')}</th><th class="num">${t('cost')}</th><th class="num">${t('qty')}</th><th>${t('note')}</th><th></th></tr>${customRows}</table></div>
        <p><button class="mini" data-act="addCustom" data-list="customExplosives">${t('add_entry')}</button></p></div>`;
  }

  if (sub === 'saber') {
    const S = saberTemp;
    const priOpts = [`<option value="">${t('choose_crystal')}</option>`].concat(DATA.saber.primary.map(p =>
      `<option ${S.primary === p.name ? 'selected' : ''} value="${esc(p.name)}">${esc(p.name)} (${fmtD(p.dmg)}${p.color ? ', ' + p.color : ''})</option>`)).join('');
    const secOpts = sel => [`<option value="">${t('none_one')}</option>`].concat(DATA.saber.secondary.map(p =>
      `<option ${sel === p.name ? 'selected' : ''} value="${esc(p.name)}">${esc(p.name)} (${p.mod >= 0 ? '+' : ''}${p.mod} ${t('pip')}, ${esc(p.color)})</option>`)).join('');
    const colorOpts = DATA.saber.colors.map(c => `<option ${S.color === c ? 'selected' : ''}>${esc(c)}</option>`).join('');
    const modOpts = sel => [`<option value="">${t('none_dash')}</option>`].concat(DATA.saber.mods.map(m =>
      `<option ${sel === m.name ? 'selected' : ''} value="${esc(m.name)}">${esc(m.name)} (${fmtCr(m.cost)} Cr.)</option>`)).join('');
    const dmg = saberDamage(S);
    const abilities = saberAbilities(S);
    const ownedRows = C.sabers.map((sb, i) => `<tr>
      <td>${esc(sb.name || t('custom_saber'))}</td><td>${esc(sb.color)}</td><td>${fmtD(saberDamage(sb))}</td>
      <td>${saberAbilities(sb).map(a => esc(a)).join('<br>')}</td>
      <td><button class="mini danger" data-act="delSaber" data-idx="${i}">×</button></td></tr>`).join('');
    body = `
      <div class="card"><h2>${t('saber_shop')}</h2>
        <div class="formgrid">
          <div><label>${t('name')}</label><input type="text" data-saber="name" value="${esc(S.name)}" placeholder="${esc(t('saber_name_ph'))}"></div>
          <div><label>${t('pri_crystal')}</label><select data-saber="primary">${priOpts}</select></div>
          <div><label>${t('sec_crystal')}</label><select data-saber="secondary">${secOpts(S.secondary)}</select></div>
          <div><label>${t('ter_crystal')}</label><select data-saber="tertiary">${secOpts(S.tertiary)}</select></div>
          <div><label>${t('blade_color')}</label><select data-saber="color">${colorOpts}</select></div>
          <div><label>${t('modification')} 1</label><select data-saber="mod0">${modOpts(S.mods[0])}</select></div>
          <div><label>${t('modification')} 2</label><select data-saber="mod1">${modOpts(S.mods[1])}</select></div>
          <div><label>${t('modification')} 3</label><select data-saber="mod2">${modOpts(S.mods[2])}</select></div>
          <div><label>${t('modification')} 4</label><select data-saber="mod3">${modOpts(S.mods[3])}</select></div>
        </div>
        <p style="margin-top:12px">${t('damage')}: <span class="dice">${fmtD(dmg)}</span>
          &nbsp; ${t('difficulty')}: <b>Difficult</b> &nbsp; ${t('skill')}: <b>Lightsaber</b></p>
        ${abilities.length ? `<p class="hint">${abilities.map(a => esc(a)).join('<br>')}</p>` : ''}
        <p><button class="accent" data-act="addSaber">${t('build_saber')}</button></p>
      </div>
      <div class="card"><h2>${t('my_sabers')}</h2><div class="table-scroll">
        <table class="list"><tr><th>${t('name')}</th><th>${t('color')}</th><th>${t('damage')}</th><th>${t('properties')}</th><th></th></tr>
        ${ownedRows || `<tr><td colspan="5" class="hint">${t('none_dash')}</td></tr>`}</table></div></div>`;
  }

  return `<div class="subtabs">
    ${btn('melee', t('sub_melee'))} ${btn('ranged', t('sub_ranged'))} ${btn('explosives', t('sub_expl'))} ${btn('saber', t('sub_saber'))}
  </div>${body}`;
}

/* Rüstungswerte kommen im Katalog als Pips (2D = 6), in der eigenen Rüstung
   dagegen als frei getippter Würfeltext ("+1D", "+1", "1D+2"). Beides auf
   Pips bringen, damit sich alles addieren lässt. */
function armorPips(v) {
  if (typeof v === 'number') return v || 0;
  const s = String(v || '').trim();
  if (!s) return 0;
  const m = /^([+-]?)\s*(?:(\d+)\s*D)?\s*\+?\s*(\d+)?/i.exec(s);
  if (!m) return 0;
  const sign = m[1] === '-' ? -1 : 1;
  return sign * ((+(m[2] || 0)) * 3 + (+(m[3] || 0)));
}

/* Abdeckung ("Torso", "Head, Torso, Arms", "Full") in Körperbereiche
   zerlegen. Zwei getragene Rüstungen dürfen sich nicht überschneiden – man
   kann nicht Brustpanzer UND eine Vollrüstung gleichzeitig am Torso tragen. */
const ARMOR_LOCS = ['head', 'torso', 'arms', 'hands', 'legs'];
function parseArmorLoc(str) {
  const s = String(str || '').toLowerCase();
  if (!s.trim()) return new Set();                 // unbekannt: keine Sperre
  if (/\b(full|all)\b|full body/.test(s)) return new Set(ARMOR_LOCS);
  const set = new Set();
  s.split(/[,/.;&]+/).forEach(p => {
    p = p.trim(); if (!p) return;
    if (/head|helmet|face/.test(p)) set.add('head');
    if (/torso|chest|vest|body|back/.test(p)) set.add('torso');
    if (/\barm/.test(p)) set.add('arms');
    if (/hand|glove|gauntlet/.test(p)) set.add('hands');
    if (/\bleg|boot|greave|shin/.test(p)) set.add('legs');
  });
  return set;
}

/* Alle Rüstungsstücke des Charakters in einheitlicher Form – Katalog wie
   eigene, mit Abdeckung, Werten (in Pips) und ob sie gerade getragen wird. */
function armorEntries() {
  const out = [];
  C.armor.forEach((n, i) => {
    const a = catByName(DATA.armor, n);
    if (a) out.push({ kind: 'armor', idx: i, name: a.name,
      loc: parseArmorLoc(a.loc), phys: +a.phys || 0, energy: +a.energy || 0,
      worn: !!(C.armorWorn && C.armorWorn[i]) });
  });
  (C.customArmor || []).forEach((a, i) => out.push({ kind: 'custom', idx: i,
    name: a.name || '#' + (i + 1), loc: parseArmorLoc(a.loc),
    phys: armorPips(a.phys), energy: armorPips(a.energy), worn: !!a.active }));
  return out;
}

/* Überschneidet die Abdeckung mit den bereits getragenen Rüstungen?
   Gibt den betroffenen Körperbereich zurück, sonst null. */
function armorClash(loc, exKind, exIdx) {
  const worn = new Set();
  armorEntries().forEach(e => {
    if (!e.worn || (e.kind === exKind && e.idx === exIdx)) return;
    e.loc.forEach(l => worn.add(l));
  });
  for (const l of loc) if (worn.has(l)) return l;
  return null;
}

let armorMsg = '';
function setArmorWorn(kind, idx, on) {
  armorMsg = '';
  const e = armorEntries().find(x => x.kind === kind && x.idx === idx);
  if (on && e) {
    const clash = armorClash(e.loc, kind, idx);
    if (clash) {
      armorMsg = t('armor_conflict').replace('{loc}', t('loc_' + clash));
      on = false;
    }
  }
  if (kind === 'armor') { (C.armorWorn = C.armorWorn || [])[idx] = on; }
  else if (C.customArmor[idx]) C.customArmor[idx].active = on;
}

/* Beim Hinzufügen automatisch tragen, sofern nichts kollidiert – so zählt
   eine einzelne Rüstung sofort, ohne dass man erst ein Häkchen setzen muss.
   Dient auch dazu, ältere Charaktere ohne "getragen"-Angabe sinnvoll zu
   belegen (erste passende Rüstung an, überlappende bleiben aus). */
function autoWear(kind, idx) {
  const e = armorEntries().find(x => x.kind === kind && x.idx === idx);
  if (e && !armorClash(e.loc, kind, idx)) {
    if (kind === 'armor') (C.armorWorn = C.armorWorn || [])[idx] = true;
    else C.customArmor[idx].active = true;
  }
}
function normalizeArmorWorn() {
  // Alte Charaktere tragen keine "getragen"-Angabe: dann ist C.armorWorn
  // kürzer als die Rüstungsliste bzw. eine eigene Rüstung hat kein active.
  // Für solche Einträge wird greedy die erste passende Rüstung angelegt.
  if (!Array.isArray(C.armorWorn)) C.armorWorn = [];
  const needOwned = C.armorWorn.length < C.armor.length;
  C.armorWorn.length = C.armor.length;              // auf Länge bringen
  let needCustom = false;
  (C.customArmor || []).forEach(a => {
    if (a.active === undefined) { a.active = false; needCustom = true; }
  });
  if (needOwned) C.armor.forEach((_, i) => {
    if (C.armorWorn[i] === undefined) autoWear('armor', i);
  });
  if (needCustom) (C.customArmor || []).forEach((_, i) => autoWear('custom', i));
}

/* Gesamter Schadenswiderstand: Stärke plus die Boni der GETRAGENEN Rüstung
   (natürliche Panzerung der Spezies zählt immer, sie ist angeboren). */
function armorTotals() {
  normalizeArmorWorn();
  const sp = speciesData();
  let physBonus = (sp.armorP || 0), enerBonus = (sp.armorE || 0);
  armorEntries().forEach(e => {
    if (e.worn) { physBonus += e.phys; enerBonus += e.energy; }
  });
  const str = attrTotal('str');
  return { str, physBonus, enerBonus,
           physTotal: str + physBonus, enerTotal: str + enerBonus };
}

/* ---------------- Tab: Rüstung ---------------- */
function viewArmor() {
  const wornBox = (kind, i, on) =>
    `<input type="checkbox" data-act="wearArmor" data-kind="${kind}" data-idx="${i}" ${on ? 'checked' : ''} title="${t('armor_worn')}">`;
  const owned = C.armor.map((n, i) => {
    const a = catByName(DATA.armor, n); if (!a) return '';
    return `<tr class="${C.armorWorn && C.armorWorn[i] ? 'worn' : ''}">
      <td>${wornBox('armor', i, C.armorWorn && C.armorWorn[i])}</td>
      <td>${esc(a.name)}</td><td>+${fmtD(a.phys)}</td><td>+${fmtD(a.energy)}</td>
      <td>${esc(a.loc)}</td><td>${a.dexPen ? '−' + fmtD(a.dexPen) : '–'}</td><td class="num">${fmtCr(a.cost)}</td>
      <td>${a.abilities.map(x => esc(x)).join('<br>')}</td>
      <td><button class="mini danger" data-act="delOwn" data-list="armor" data-idx="${i}">×</button></td></tr>`;
  }).join('');
  const customRows = C.customArmor.map((a, i) => `<tr class="${a.active ? 'worn' : ''}">
    <td>${wornBox('custom', i, a.active)}</td>
    <td>${inputT('customArmor.' + i + '.name', a.name)}</td>
    <td>${inputT('customArmor.' + i + '.phys', a.phys, 'style="width:80px" placeholder="+1D"')}</td>
    <td>${inputT('customArmor.' + i + '.energy', a.energy, 'style="width:80px" placeholder="+1"')}</td>
    <td>${inputT('customArmor.' + i + '.loc', a.loc, 'style="width:110px" placeholder="Torso"')}</td>
    <td>${inputT('customArmor.' + i + '.dexPen', a.dexPen, 'style="width:80px"')}</td>
    <td class="num">${inputN('customArmor.' + i + '.cost', a.cost, 'data-rerender="1" style="width:90px"')}</td>
    <td>${inputT('customArmor.' + i + '.note', a.note)}</td>
    <td><button class="mini danger" data-act="delCustom" data-list="customArmor" data-idx="${i}">×</button></td></tr>`).join('');
  const cat = DATA.armor.map((a, i) => `<tr>
    <td>${esc(a.name)}</td><td>+${fmtD(a.phys)}</td><td>+${fmtD(a.energy)}</td>
    <td>${esc(a.loc)}</td><td>${a.dexPen ? '−' + fmtD(a.dexPen) : '–'}</td>
    <td class="num">${fmtCr(a.cost)}</td><td>${esc(a.avail)}</td>
    <td>${a.abilities.map(x => esc(x)).join('<br>')}</td>
    <td><button class="mini" data-act="addOwn" data-list="armor" data-i="${i}">+</button></td></tr>`).join('');
  const at = armorTotals();
  const msg = armorMsg; armorMsg = '';   // Konfliktmeldung nur einmal zeigen
  // Stärke ist die Grund-Panzerung (jeder wehrt Schaden mit STR ab); die
  // natürliche Panzerung der Spezies steckt als Bonus im "Rüstungsbonus".
  return `
  <div class="pool-banner">
    <span>${t('str_resist')}: <b>${fmtD(at.str)}</b></span>
    <span>${t('armor_bonus')}: <b>+${fmtD(at.physBonus)} ${t('phys_short')} / +${fmtD(at.enerBonus)} ${t('ener_short')}</b></span>
    <span>${t('armor_total')}: <b>${fmtD(at.physTotal)} ${t('phys_short')} / ${fmtD(at.enerTotal)} ${t('ener_short')}</b></span>
    <span class="hint">${t('armor_hint')}</span>
  </div>
  ${msg ? `<div class="hint warnbox">${esc(msg)}</div>` : ''}
  <div class="card"><h2>${t('my_armor')}</h2>
    <p class="hint">${t('armor_worn_hint')}</p><div class="table-scroll">
    <table class="list"><tr><th>${t('armor_worn')}</th><th>${t('armor')}</th><th>${t('physical')}</th><th>${t('energy')}</th><th>${t('coverage')}</th><th>${t('dex_pen')}</th><th class="num">${t('cost')}</th><th>${t('special')}</th><th></th></tr>
    ${owned || `<tr><td colspan="9" class="hint">${t('none_dash')}</td></tr>`}</table></div>
    <h3>${t('custom_armor')}</h3><div class="table-scroll">
    <table class="list"><tr><th>${t('armor_worn')}</th><th>${t('name')}</th><th>${t('physical')}</th><th>${t('energy')}</th><th>${t('coverage')}</th><th>${t('dex_pen')}</th><th class="num">${t('cost')}</th><th>${t('note')}</th><th></th></tr>${customRows}</table></div>
    <p><button class="mini" data-act="addCustom" data-list="customArmor">${t('add_entry')}</button></p></div>
  <div class="card"><h2>${t('cat_armor')}</h2><div class="table-scroll">
    <table class="list"><tr><th>${t('armor')}</th><th>${t('physical')}</th><th>${t('energy')}</th><th>${t('coverage')}</th><th>${t('dex_pen')}</th><th class="num">${t('cost')}</th><th>${t('avail')}</th><th>${t('special')}</th><th></th></tr>${cat}</table></div></div>`;
}

/* ---------------- Tab: Credits ---------------- */
function viewCredits() {
  const tt = creditTotals();
  const loanRow = (l, i) => `
    <div class="formgrid">
      <div><label>${t('creditor')}</label>${inputT('credits.loans.' + i + '.to', l.to)}</div>
      <div><label>${t('amount_owed')}</label>${inputN('credits.loans.' + i + '.amount', l.amount, 'data-rerender="1"')}</div>
      <div><label>${t('interest')}</label>${inputN('credits.loans.' + i + '.interest', l.interest, 'data-rerender="1"')}</div>
      <div><label>${t('monthly_due')}</label><span class="dice plain">${fmtCr((+l.amount || 0) * (+l.interest || 0) / 100)}</span></div>
    </div>`;
  return `
  <div class="grid2">
    <div class="card"><h2>Credits</h2>
      <div class="formgrid">
        <div><label>${t('cp_earned')}</label>${inputN('credits.earned', C.credits.earned, 'data-rerender="1"')}</div>
        <div><label>${t('spent_misc')}</label>${inputN('credits.spentMisc', C.credits.spentMisc, 'data-rerender="1"')}</div>
        <div><label>${t('spent_ship')}</label>${inputN('credits.spentShip', C.credits.spentShip, 'data-rerender="1"')}</div>
      </div>
      <div class="table-scroll"><table class="list" style="margin-top:12px">
        <tr><td>${t('equipment')}</td><td class="num">${fmtCr(tt.equip)}</td></tr>
        <tr><td>${t('armor')}</td><td class="num">${fmtCr(tt.armor)}</td></tr>
        <tr><td>${t('melee_w')}</td><td class="num">${fmtCr(tt.melee)}</td></tr>
        <tr><td>${t('ranged_w')}</td><td class="num">${fmtCr(tt.ranged)}</td></tr>
        <tr><td>${t('explosives')}</td><td class="num">${fmtCr(tt.expl)}</td></tr>
        <tr><td>${t('misc_ship')}</td><td class="num">${fmtCr((+C.credits.spentMisc || 0) + (+C.credits.spentShip || 0))}</td></tr>
        <tr><td><b>${t('spent_total')}</b></td><td class="num"><b>${fmtCr(tt.spent)}</b></td></tr>
        <tr><td><b>${t('credits_left')}</b></td><td class="num"><b class="${tt.left < 0 ? 'warn' : 'ok'}">${fmtCr(tt.left)}</b></td></tr>
      </table></div>
    </div>
    <div class="card"><h2>${t('loans')}</h2>
      <h3>${t('loan')} 1</h3>${loanRow(C.credits.loans[0], 0)}
      <h3>${t('loan')} 2</h3>${loanRow(C.credits.loans[1], 1)}
    </div>
  </div>`;
}

/* =====================================================================
   CHARAKTERBOGEN / CHARACTER SHEET
   ===================================================================== */
function sheetField(lbl, val, span) {
  return `<div class="sp-field" style="grid-column: span ${span || 3}">
    <span class="lbl">${esc(lbl)}</span><span class="val">${esc(val) || '&nbsp;'}</span></div>`;
}
function renderSheet() {
  const sp = speciesData();
  const tt = creditTotals();
  const move = (+sp.move || 0) + (+C.points.moveImp || 0);
  const fp = C.points.fpCurrent == null ? fpStart() : C.points.fpCurrent;

  const attrBlock = a => {
    const rows = skillsFor(a.key).filter(r => {
      const e = C.skills[skillKey(a.key, r.name)];
      return (e && ((e.c || 0) + (e.cp || 0)) > 0) || r.sb;
    }).map(r => {
      const key = skillKey(a.key, r.name);
      return `<div class="sp-skill ${r.spec ? 'spec' : ''}"><span>${esc(skillName(r.name))}</span><span class="d">${fmtD(skillTotal(key))}</span></div>`;
    }).join('');
    return `<div class="sp-attr">
      <div class="ah"><span>${a.name}</span><span>${fmtD(attrTotal(a.key))}</span></div>${rows}</div>`;
  };
  const advBlock = () => {
    const advAll = ADV_SKILLS.concat(C.extraSkills.filter(e => e.adv));
    const rows = advAll.filter(sk => skillPips(skillKey(sk.attr, sk.name)) > 0)
      .map(sk => `<div class="sp-skill"><span>${esc(skillName(sk.name))}</span><span class="d">${fmtD(skillTotal(skillKey(sk.attr, sk.name)))}</span></div>`).join('');
    return rows ? `<div class="sp-attr"><div class="ah"><span>Advanced</span><span></span></div>${rows}</div>` : '';
  };
  const forceBlock = () => {
    if (!C.info.forceSensitive && !FORCE.some(f => forceTotal(f.key) > 0)) return '';
    const rows = FORCE.map(f =>
      `<div class="sp-skill"><span>${f.name}</span><span class="d">${fmtD(forceTotal(f.key))}</span></div>`).join('');
    return `<div class="sp-attr"><div class="ah"><span>${t('the_force')}</span><span></span></div>${rows}</div>`;
  };

  const woundRows = t('woundRows').map(r =>
    `<tr><td>${r[0]}</td><td>${r[1]}</td><td>${r[2]}</td><td>${r[3]}</td></tr>`).join('');

  const page1 = `
  <div class="sheet-page">
    <div class="sp-header"><div class="sw">STAR WARS</div><div class="st">${t('sheet_title')}</div></div>
    ${typeof roundStampHtml === 'function' ? roundStampHtml() : ''}
    <div style="display:flex; gap:3mm; align-items:stretch">
    <div class="sp-grid" style="flex:1; align-content:start">
      ${sheetField(t('char_name'), C.info.name, 4)}
      ${sheetField(t('player_name'), C.info.player, 4)}
      ${sheetField(t('occupation'), C.info.occupation, 4)}
      ${sheetField(t('species'), sp.name, 3)}
      ${sheetField(t('gender'), C.info.gender, 2)}
      ${sheetField(t('home_planet'), C.info.planet, 3)}
      ${sheetField(t('age'), C.info.age, 1)}
      ${sheetField(t('height'), C.info.height ? C.info.height + ' m' : '', 1)}
      ${sheetField(t('weight'), C.info.weight ? C.info.weight + ' kg' : '', 2)}
      ${sheetField(t('force_sensitive'), C.info.forceSensitive ? t('yes') : t('no'), 2)}
      ${sheetField(t('move'), move + '  (' + t('sprint') + ' ' + move * 2 + ' / ' + t('all_out') + ' ' + move * 4 + ')', 4)}
      ${sheetField(t('source'), sp.page, 3)}
      ${sheetField(t('quote'), C.info.quote ? '„' + C.info.quote + '“' : '', 12)}
    </div>
    <div class="sp-portrait">
      ${C.info.portrait
        ? `<img src="${C.info.portrait}" alt="">`
        : `<span>${t('portrait')}</span>`}
    </div>
    </div>
    <div class="sp-box">
      <h4>${t('attrs_skills')}</h4>
      <div class="sp-cols3">
        <div>${attrBlock(ATTRS[0])}${attrBlock(ATTRS[1])}</div>
        <div>${attrBlock(ATTRS[2])}${attrBlock(ATTRS[3])}</div>
        <div>${attrBlock(ATTRS[4])}${attrBlock(ATTRS[5])}${advBlock()}${forceBlock()}</div>
      </div>
    </div>
    <div class="sp-box"><h4>${t('game_stats')}</h4>
      <div style="display:flex; gap:18px; justify-content:space-around; flex-wrap:wrap">
        <div class="sp-stat"><span class="big">${cpLeft()}</span><span class="lbl">${t('char_points')}</span></div>
        <div class="sp-stat"><span class="big">${fp}</span><span class="lbl">${t('fp')}</span></div>
        <div class="sp-stat"><span class="big">${C.points.dsp || 0}</span><span class="lbl">${t('dark_side')}</span></div>
        <div class="sp-stat"><span class="big">${move}</span><span class="lbl">${t('move')}</span></div>
        <div class="sp-stat"><span class="big">${fmtD(armorTotals().physTotal)}</span><span class="lbl">${t('resist_p')}</span></div>
        <div class="sp-stat"><span class="big">${fmtD(armorTotals().enerTotal)}</span><span class="lbl">${t('resist_e')}</span></div>
        <div class="sp-stat"><span class="big">${fmtCr(tt.left)}</span><span class="lbl">Credits</span></div>
      </div>
      <div style="font-size:7pt; margin-top:2px">${t('resist_note')}</div>
    </div>
    <div class="sp-box"><h4>${t('wounds')}</h4>
      <table class="sp-table">
        <tr><th style="width:16%">${t('dmg_gt_str')}</th><th style="width:22%">${t('condition')}</th><th>${t('effect')}</th><th style="width:8%">☐</th></tr>
        ${woundRows}
      </table>
    </div>
    <div class="sp-cols2">
      <div class="sp-box"><h4>${t('sp_species_abilities')}</h4>
        <div style="font-size:8.4pt">${sp.abilities.length ? sp.abilities.map(x => '• ' + esc(x)).join('<br>') : '–'}</div></div>
      <div class="sp-box"><h4>${t('story_factors')}</h4>
        <div style="font-size:8.4pt">${sp.story.length ? sp.story.map(x => '• ' + esc(x)).join('<br>') : '–'}</div></div>
    </div>
    <div class="sp-footer"><span>${t('sheet_footer')}</span><span>${t('page')} 1</span></div>
  </div>`;

  const eqRows = [];
  Object.entries(C.equipment).forEach(([n, q]) => {
    if (q > 0) { const it = catByName(DATA.equipment, n); if (it) eqRows.push({ name: n, qty: q, cost: it.cost * q, note: it.note }); }
  });
  C.customEquipment.forEach(it => { if (it.name) eqRows.push({ name: it.name, qty: it.qty || 1, cost: (+it.cost || 0) * (+it.qty || 1), note: it.note }); });

  const page2 = `
  <div class="sheet-page">
    <div class="sp-header"><div class="sw" style="font-size:13pt">${esc(C.info.name || 'STAR WARS')}</div><div class="st">${t('bg_equip')}</div></div>
    <div class="sp-cols2">
      <div class="sp-box"><h4>${t('appearance')}</h4><div class="sp-lines">${esc(C.info.description)}</div></div>
      <div class="sp-box"><h4>${t('personality')}</h4><div class="sp-lines">${esc(C.info.personality)}</div></div>
    </div>
    <div class="sp-cols2">
      <div class="sp-box"><h4>${t('history')}</h4><div class="sp-lines">${esc(C.info.history)}</div></div>
      <div class="sp-box"><h4>${t('objectives')}</h4><div class="sp-lines">${esc(C.info.objectives)}</div></div>
    </div>
    <div class="sp-box"><h4>${t('equipment')}</h4>
      <table class="sp-table"><tr><th>${t('item')}</th><th style="width:8%">${t('qty_short')}</th><th style="width:12%">${t('value_cr')}</th><th>${t('note')}</th></tr>
      ${eqRows.map(r => `<tr><td>${esc(r.name)}</td><td>${r.qty}</td><td class="num">${fmtCr(r.cost)}</td><td>${esc(r.note || '')}</td></tr>`).join('') || '<tr><td colspan="4">–</td></tr>'}
      </table></div>
    <div class="sp-cols2">
      <div class="sp-box"><h4>Credits</h4>
        <table class="sp-table">
          <tr><td>${t('earned_total_sheet')}</td><td class="num">${fmtCr(+C.credits.earned || 0)}</td></tr>
          <tr><td>${t('spent_total_sheet')}</td><td class="num">${fmtCr(tt.spent)}</td></tr>
          <tr><td><b>${t('left')}</b></td><td class="num"><b>${fmtCr(tt.left)}</b></td></tr>
        </table></div>
      <div class="sp-box"><h4>${t('loans')}</h4>
        <table class="sp-table"><tr><th>${t('creditor')}</th><th>${t('amount')}</th><th>${t('interest_short')}</th><th>${t('monthly')}</th></tr>
        ${C.credits.loans.filter(l => l.to || l.amount).map(l =>
          `<tr><td>${esc(l.to)}</td><td class="num">${fmtCr(+l.amount || 0)}</td><td class="num">${l.interest || 0}%</td><td class="num">${fmtCr((+l.amount || 0) * (+l.interest || 0) / 100)}</td></tr>`).join('') || '<tr><td colspan="4">–</td></tr>'}
        </table></div>
    </div>
    <div class="sp-box"><h4>${t('notes')}</h4><div class="sp-lines">${esc(C.notes)}</div></div>
    <div class="sp-footer"><span>${t('sheet_footer')}</span><span>${t('page')} 2</span></div>
  </div>`;

  const meleeRows = C.melee.map(n => catByName(DATA.melee, n)).filter(Boolean)
    .map(m => `<tr><td>${esc(m.name)}</td><td>STR+${fmtD(m.dmg)}</td><td>${m.maxDmg ? fmtD(m.maxDmg) : '–'}</td><td>${esc(m.diff)}</td><td>${esc(m.ability)}</td></tr>`)
    .concat(C.sabers.map(sb => `<tr><td>${esc(sb.name || t('custom_saber'))} (${esc(sb.color)})</td><td>${fmtD(saberDamage(sb))}</td><td>–</td><td>Difficult</td><td>${saberAbilities(sb).map(esc).join('; ')}</td></tr>`))
    .concat(C.customMelee.filter(m => m.name).map(m => `<tr><td>${esc(m.name)}</td><td>${esc(m.dmg)}</td><td>–</td><td>${esc(m.diff)}</td><td>${esc(m.note || '')}</td></tr>`));
  const rangedRows = C.ranged.map(n => catByName(DATA.ranged, n)).filter(Boolean)
    .map(r => `<tr><td>${esc(r.name)}</td><td>${esc(r.skill)}</td><td>${fmtD(r.dmg)}</td><td>${esc(r.close)}/${esc(r.short)}/${esc(r.medium)}/${esc(r.long)}</td><td>${esc(r.rof)}</td><td>${esc(r.ammo)}</td><td>${esc(r.ability)}</td></tr>`)
    .concat(C.customRanged.filter(r => r.name).map(r => `<tr><td>${esc(r.name)}</td><td>${esc(r.skill)}</td><td>${esc(r.dmg)}</td><td>${esc(r.ranges)}</td><td>–</td><td>${esc(r.ammo)}</td><td>–</td></tr>`));
  const expRows = Object.entries(C.explosives).filter(([n, q]) => q > 0).map(([n, q]) => {
    const e = catByName(DATA.explosives, n); if (!e) return '';
    return `<tr><td>${esc(e.name)}</td><td>${q}</td><td>${e.dmg.filter(x => x && x !== '-').map(x => fmtD(+x)).join('/')}</td><td>${e.ranges.map(x => x || '–').join('/')}</td><td>${e.radius.map(x => x || '–').join('/')}</td><td>${esc(e.ability)}</td></tr>`;
  }).concat(C.customExplosives.filter(e => e.name).map(e => `<tr><td>${esc(e.name)}</td><td>${e.qty || 1}</td><td>${esc(e.dmg)}</td><td>–</td><td>–</td><td>${esc(e.note || '')}</td></tr>`));
  const armorRows = C.armor.map(n => catByName(DATA.armor, n)).filter(Boolean)
    .map(a => `<tr><td>${esc(a.name)}</td><td>+${fmtD(a.phys)}</td><td>+${fmtD(a.energy)}</td><td>${esc(a.loc)}</td><td>${a.dexPen ? '−' + fmtD(a.dexPen) : '–'}</td><td>${a.abilities.map(esc).join('; ')}</td></tr>`)
    .concat(C.customArmor.filter(a => a.name).map(a => `<tr><td>${esc(a.name)}</td><td>${esc(a.phys)}</td><td>${esc(a.energy)}</td><td>${esc(a.loc)}</td><td>${esc(a.dexPen)}</td><td>${esc(a.note || '')}</td></tr>`));

  const page3 = `
  <div class="sheet-page">
    <div class="sp-header"><div class="sw" style="font-size:13pt">${esc(C.info.name || 'STAR WARS')}</div><div class="st">${t('weapons_armor')}</div></div>
    <div class="sp-box"><h4>${t('armor')}</h4>
      <table class="sp-table"><tr><th>${t('armor')}</th><th>${t('physical')}</th><th>${t('energy')}</th><th>${t('coverage')}</th><th>${t('dex_pen')}</th><th>${t('special')}</th></tr>
      ${armorRows.join('') || '<tr><td colspan="6">–</td></tr>'}</table></div>
    <div class="sp-box"><h4>${t('sub_melee')}</h4>
      <table class="sp-table"><tr><th>${t('weapon')}</th><th>${t('damage')}</th><th>${t('max_short')}</th><th>${t('difficulty')}</th><th>${t('special')}</th></tr>
      ${meleeRows.join('') || '<tr><td colspan="5">–</td></tr>'}</table></div>
    <div class="sp-box"><h4>${t('sub_ranged')}</h4>
      <table class="sp-table"><tr><th>${t('weapon')}</th><th>${t('skill')}</th><th>${t('damage')}</th><th>${t('range_pkml')}</th><th>${t('rof')}</th><th>${t('ammo_short')}</th><th>${t('special')}</th></tr>
      ${rangedRows.join('') || '<tr><td colspan="7">–</td></tr>'}</table></div>
    <div class="sp-box"><h4>${t('explosives')}</h4>
      <table class="sp-table"><tr><th>${t('explosive')}</th><th>${t('qty_short')}</th><th>${t('damage')}</th><th>${t('throw_range')}</th><th>${t('radius')}</th><th>${t('special')}</th></tr>
      ${expRows.join('') || '<tr><td colspan="6">–</td></tr>'}</table></div>
    <div class="sp-footer"><span>${t('sheet_footer')}</span><span>${t('page')} 3</span></div>
  </div>`;

  let page4 = '';
  if (C.info.forceSensitive || C.powers.length) {
    const powerRows = C.powers.map(n => {
      const p = DATA.powers.find(x => x.name === n);
      if (!p) return `<tr><td>${esc(n)}</td><td colspan="4"></td></tr>`;
      return `<tr><td>${esc(p.name)}${p.dark === 'Yes' ? ' ☠' : ''}</td><td>${esc(p.cat)}</td><td>${esc(p.diff)}</td><td>${p.kept === 'Yes' ? t('yes') : t('no')}</td><td>${esc(p.page)}</td></tr>`;
    }).join('');
    page4 = `
    <div class="sheet-page">
      <div class="sp-header"><div class="sw" style="font-size:13pt">${esc(C.info.name || 'STAR WARS')}</div><div class="st">${t('the_force')}</div></div>
      <div class="sp-box"><h4>${t('force_skills')}</h4>
        <div style="display:flex; gap:18px; justify-content:space-around">
          ${FORCE.map(f => `<div class="sp-stat"><span class="big">${fmtD(forceTotal(f.key))}</span><span class="lbl">${f.name}</span></div>`).join('')}
          <div class="sp-stat"><span class="big">${fp}</span><span class="lbl">${t('fp')}</span></div>
          <div class="sp-stat"><span class="big">${C.points.dsp || 0}</span><span class="lbl">${t('dark_side')}</span></div>
        </div></div>
      <div class="sp-box"><h4>${t('force_powers')} (${C.powers.length})</h4>
        <table class="sp-table"><tr><th>${t('power')}</th><th>${t('category')}</th><th>${t('difficulty')}</th><th>${t('keep_up_short')}</th><th>${t('source')}</th></tr>
        ${powerRows || '<tr><td colspan="5">–</td></tr>'}</table></div>
      <div class="sp-footer"><span>${t('sheet_footer')}</span><span>${t('page')} 4</span></div>
    </div>`;
  }

  const html = page1 + page2 + page3 + page4;
  document.getElementById('sheet-print').innerHTML = html;
  const tabEl = document.getElementById('tab-sheet');
  if (tabEl) tabEl.innerHTML = `
    <div class="card no-print"><h2>${t('tab_sheet')}</h2>
      <p>${t('sheet_preview')}</p>
      <p><button class="accent" data-act="print">${t('print_pdf')}</button></p>
    </div>${html}`;
}

/* =====================================================================
   SPEICHERN / LADEN
   ===================================================================== */
function getSaved() {
  try { return JSON.parse(localStorage.getItem(LS_CHARS)) || {}; } catch (e) { return {}; }
}
function setSaved(obj) { localStorage.setItem(LS_CHARS, JSON.stringify(obj)); }
function refreshSavedList() {
  const sel = document.getElementById('savedCharSelect');
  const saved = getSaved();
  const names = Object.keys(saved).sort((a, b) => a.localeCompare(b, LANG));
  const cur = sel.value;
  sel.innerHTML = `<option value="">${t('saved_placeholder')}</option>` +
    names.map(n => `<option value="${esc(n)}">${esc(n)}</option>`).join('');
  if (names.includes(cur)) sel.value = cur;
}
function saveChar() {
  let name = C.info.name && C.info.name.trim();
  if (!name) name = prompt(t('prompt_char_name'));
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
function loadChar() {
  const sel = document.getElementById('savedCharSelect');
  if (!sel.value) { alert(t('alert_select_saved')); return; }
  const saved = getSaved();
  if (!saved[sel.value]) return;
  C = migrate(saved[sel.value]);
  renderAll(); autosave();
}
function deleteChar() {
  const sel = document.getElementById('savedCharSelect');
  if (!sel.value) { alert(t('alert_select_saved')); return; }
  if (!confirm(t('confirm_delete').replace('{name}', sel.value))) return;
  const saved = getSaved();
  delete saved[sel.value];
  setSaved(saved); refreshSavedList();
}
function newChar() {
  if (!confirm(t('confirm_new'))) return;
  C = emptyChar(); applySpeciesBonusSkills();
  renderAll(); autosave();
}
function exportChar() {
  const name = (C.info.name || 'charakter').replace(/[^\wäöüÄÖÜß \-]/g, '_');
  const blob = new Blob([JSON.stringify(C, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = name + '.swd6.json';
  a.click();
  URL.revokeObjectURL(a.href);
}
function importChar(file) {
  const rd = new FileReader();
  rd.onload = () => {
    try {
      const obj = JSON.parse(rd.result);
      if (!obj.info || !obj.attrs) throw new Error(t('import_invalid'));
      C = migrate(obj);
      renderAll(); autosave();
    } catch (e) { alert(t('import_failed') + e.message); }
  };
  rd.readAsText(file);
}
function migrate(obj) {
  const base = emptyChar();
  const merged = Object.assign(base, obj);
  merged.info = Object.assign(emptyChar().info, obj.info || {});
  merged.points = Object.assign(emptyChar().points, obj.points || {});
  merged.credits = Object.assign(emptyChar().credits, obj.credits || {});
  merged.overrides = Object.assign(emptyChar().overrides, obj.overrides || {});
  if (!merged.credits.loans || merged.credits.loans.length < 2)
    merged.credits.loans = emptyChar().credits.loans;
  return merged;
}
function flashButton(id, text) {
  const b = document.getElementById(id);
  const old = b.textContent;
  b.textContent = text;
  setTimeout(() => b.textContent = old, 1300);
}

function applySpeciesBonusSkills() {
  C.extraSkills = C.extraSkills.filter(e => !e.sb);
  const sp = speciesData();
  (sp.bonusSkills || []).forEach(b => {
    if (!C.extraSkills.some(e => e.name === b.name && e.attr === b.attr))
      C.extraSkills.push({ name: b.name, attr: b.attr, spec: null, adv: false, sb: true });
  });
}
function onSpeciesChanged() {
  ATTRS.forEach(a => { C.attrs[a.key] = 0; C.attrsCP[a.key] = 0; });
  FORCE.forEach(f => { C.force[f.key] = 0; C.forceCP[f.key] = 0; });
  applySpeciesBonusSkills();
}

/* =====================================================================
   EVENTS
   ===================================================================== */
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
  const act = el.dataset.act;
  const dir = +el.dataset.dir || 0;

  switch (act) {
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
    case 'force': {
      const f = el.dataset.f;
      C.force[f] = Math.max(0, (C.force[f] || 0) + dir);
      update(); break;
    }
    case 'forceCP': {
      const f = el.dataset.f;
      C.forceCP[f] = Math.max(0, (C.forceCP[f] || 0) + dir);
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
    case 'toggleSec': {
      const k = el.dataset.sec;
      collapsedSecs[k] = !collapsedSecs[k];
      update(); break;
    }
    case 'addSpec': {
      const name = prompt(t('prompt_spec'));
      if (name) {
        C.extraSkills.push({ name: name.trim(), attr: el.dataset.attr, spec: el.dataset.parent, adv: false });
        update();
      }
      break;
    }
    case 'addCustomSkill': {
      const name = prompt(t('prompt_skill'));
      if (name) {
        C.extraSkills.push({ name: name.trim(), attr: el.dataset.attr, spec: null, adv: false });
        update();
      }
      break;
    }
    case 'addAdvSkill': {
      const name = prompt(t('prompt_adv'));
      if (!name) break;
      const req = prompt(t('prompt_adv_req')) || '';
      const nm = name.trim().startsWith('(A)') ? name.trim() : '(A) ' + name.trim();
      C.extraSkills.push({ name: nm, attr: 'tec', spec: null, adv: true, req });
      update(); break;
    }
    case 'delExtra': {
      const i = +el.dataset.idx;
      if (i >= 0) {
        const ex = C.extraSkills[i];
        if (ex) delete C.skills[skillKey(ex.attr, ex.name)];
        C.extraSkills.splice(i, 1);
        update();
      }
      break;
    }
    case 'addOwn': {
      const list = el.dataset.list;
      const cat = { armor: DATA.armor, melee: DATA.melee, ranged: DATA.ranged }[list];
      const item = cat[+el.dataset.i];
      if (item) {
        C[list].push(item.name);
        // Neue Rüstung gleich tragen, wenn nichts kollidiert.
        if (list === 'armor') { (C.armorWorn = C.armorWorn || []).push(false); autoWear('armor', C.armor.length - 1); }
        update();
      }
      break;
    }
    case 'delOwn': {
      const list = el.dataset.list, idx = +el.dataset.idx;
      C[list].splice(idx, 1);
      if (list === 'armor' && Array.isArray(C.armorWorn)) C.armorWorn.splice(idx, 1);
      update(); break;
    }
    case 'addCustom': {
      const defaults = {
        customEquipment: { name: '', cost: 0, qty: 1, note: '' },
        customMelee: { name: '', dmg: '', diff: '', cost: 0, note: '' },
        customRanged: { name: '', skill: '', dmg: '', ranges: '', ammo: '', cost: 0 },
        customExplosives: { name: '', dmg: '', cost: 0, qty: 1, note: '' },
        customArmor: { name: '', phys: '', energy: '', loc: '', dexPen: '', cost: 0, note: '', active: true },
      };
      C[el.dataset.list].push(Object.assign({}, defaults[el.dataset.list]));
      update(); break;
    }
    case 'delCustom': {
      C[el.dataset.list].splice(+el.dataset.idx, 1);
      update(); break;
    }
    case 'wearArmor': {
      setArmorWorn(el.dataset.kind, +el.dataset.idx, el.checked);
      update('armor'); break;
    }
    case 'wsub': {
      weaponsSub = el.dataset.sub;
      update(); break;
    }
    case 'addSaber': {
      if (!saberTemp.primary) { alert(t('alert_primary')); break; }
      C.sabers.push(JSON.parse(JSON.stringify(saberTemp)));
      saberTemp = { name: '', primary: 'Mephite', secondary: '', tertiary: '', color: 'Blue', mods: ['', '', '', ''] };
      update(); break;
    }
    case 'delSaber': {
      C.sabers.splice(+el.dataset.idx, 1);
      update(); break;
    }
    case 'portraitRemove': {
      C.info.portrait = '';
      update('info'); break;
    }
    case 'pdfAdd': pdfAdd(el.dataset.kind, +el.dataset.i); break;
    case 'speciesSaveCloud': saveSpeciesCloud(); break;
    case 'speciesUse': applyCloudSpecies(+el.dataset.id); break;
    case 'speciesDelete': deleteSpeciesCloud(+el.dataset.id, el.dataset.name || ''); break;
    case 'print': {
      renderSheet();
      window.print(); break;
    }
  }
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
  if (el.dataset.act === 'powerToggle') {
    const p = el.dataset.power;
    if (el.checked) { if (!C.powers.includes(p)) C.powers.push(p); }
    else C.powers = C.powers.filter(x => x !== p);
    update(); return;
  }
  if (el.id === 'portraitFile') {
    if (el.files && el.files[0]) importPortrait(el.files[0]);
    el.value = '';
    return;
  }
  if (el.dataset.pdfera != null) {
    pdfEra[el.dataset.pdfera] = el.value;
    update();
    return;
  }
  if (el.dataset.pdfsearch != null) {
    pdfFilter[el.dataset.pdfsearch] = el.value;
    update();
    const again = document.querySelector(`[data-pdfsearch="${el.dataset.pdfsearch}"]`);
    if (again) { again.focus(); again.setSelectionRange(again.value.length, again.value.length); }
    return;
  }
  if (el.dataset.eq != null) {
    const q = Math.max(0, +el.value || 0);
    if (q) C.equipment[el.dataset.eq] = q; else delete C.equipment[el.dataset.eq];
    update(); return;
  }
  if (el.dataset.exp != null) {
    const q = Math.max(0, +el.value || 0);
    if (q) C.explosives[el.dataset.exp] = q; else delete C.explosives[el.dataset.exp];
    update(); return;
  }
  if (el.dataset.saber != null) {
    const k = el.dataset.saber;
    if (k.startsWith('mod')) saberTemp.mods[+k.slice(3)] = el.value;
    else saberTemp[k] = el.value;
    update(); return;
  }
  if (el.dataset.bind) {
    /* Cloud-Spezies im Dropdown gewählt: Werte kopieren statt Pfad setzen */
    if (el.dataset.bind === 'info.species' && el.value.startsWith('cloud:')) {
      applyCloudSpecies(+el.value.slice(6));
      return;
    }
    let val = el.value;
    if (el.dataset.type === 'num') val = el.value === '' ? null : +el.value;
    if (el.dataset.type === 'bool') val = el.value === 'true';
    setPath(C, el.dataset.bind, val);
    if (el.dataset.species) onSpeciesChanged();
    if (el.dataset.rerender || el.dataset.species || el.tagName === 'SELECT') update();
    else autosave();
  }
});

content.addEventListener('input', e => {
  const el = e.target;
  if (el.dataset.pdfsearch != null) {
    pdfFilter[el.dataset.pdfsearch] = el.value;
    const pos = el.selectionStart;
    update();
    const again = document.querySelector(`[data-pdfsearch="${el.dataset.pdfsearch}"]`);
    if (again) { again.focus(); again.setSelectionRange(pos, pos); }
    return;
  }
  if (!el.dataset.bind) return;
  if (el.dataset.rerender || el.dataset.type === 'num' || el.tagName === 'SELECT') return;
  setPath(C, el.dataset.bind, el.value);
  autosave();
});

/* Kopfzeile / Header */
document.getElementById('btnSave').addEventListener('click', saveChar);
document.getElementById('btnLoad').addEventListener('click', loadChar);
document.getElementById('btnDelete').addEventListener('click', deleteChar);
document.getElementById('btnNew').addEventListener('click', newChar);
document.getElementById('btnExport').addEventListener('click', exportChar);
document.getElementById('btnImport').addEventListener('click', () => document.getElementById('importFile').click());
document.getElementById('importFile').addEventListener('change', e => {
  if (e.target.files[0]) importChar(e.target.files[0]);
  e.target.value = '';
});
document.getElementById('btnPrint').addEventListener('click', () => { renderSheet(); window.print(); });
window.addEventListener('beforeprint', renderSheet);

/* Options-Menü */
const optionsMenu = document.getElementById('optionsMenu');
document.getElementById('btnOptions').addEventListener('click', e => {
  e.stopPropagation();
  optionsMenu.classList.toggle('hidden');
});
optionsMenu.addEventListener('click', e => e.stopPropagation());
document.addEventListener('click', () => optionsMenu.classList.add('hidden'));
document.querySelectorAll('input[name="langOpt"]').forEach(r => {
  r.addEventListener('change', () => { setLang(r.value); });
});
/* ---------------- Start ---------------- */
(function init() {
  try {
    const cur = localStorage.getItem(LS_CURRENT);
    if (cur) C = migrate(JSON.parse(cur));
  } catch (e) { C = emptyChar(); }
  document.documentElement.lang = LANG;
  document.title = t('title');
  applyStaticI18n();
  renderLegal();
  applySpeciesBonusSkills();
  renderAll();
})();
