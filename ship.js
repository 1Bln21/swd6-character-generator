/* =====================================================================
   Star Wars D6 – Schiffs-Generator (Ship Generator v1-1 von C. Gibboney)
   Basiswerte-Editor + Umbau-Werkstatt: prozentuale Upgrades, Ersatzteile,
   Waffen, Sensoren, Crew-Skills, Druckbogen.
   Benötigt genshared.js + gendata.js (SHIP_DATA).
   ===================================================================== */
'use strict';

const PAGE_DOC_KIND = 'ship';
const LS_CURRENT = 'swd6_ship_current';
const LS_SAVED = 'swd6_ships';

/* ---------------- Übersetzungen ---------------- */
Object.assign(T.de, {
  title: 'Star Wars D6 – Schiffs- und Fahrzeug-Generator',
  subtitle: 'Schiffs- und Fahrzeug-Generator',
  footer: 'Basiert auf „Ship Generator v1-1“ von Chance Gibboney · Star Wars: The Roleplaying Game, 2nd Edition – West End Games D6-System',
  doc_one: 'Schiff', doc_plural: 'Schiffe',
  tab_ship: 'Schiff', tab_weapons: 'Waffen', tab_crew: 'Sensoren & Crew',
  tab_mods: 'Umbauten', tab_sheet: 'Schiffsbogen',
  sh_template: 'Vorlage aus den Regelwerken', sh_template_pick: '– Schiff/Fahrzeug wählen –',
  sh_template_hint: 'Über 850 Schiffe und Fahrzeuge aus den Fan-Sammelbänden. Auswählen füllt alle Grundwerte samt Bewaffnung – danach nach Belieben anpassen.',
  sh_template_apply: 'Vorlage übernehmen', sh_template_search: 'Suchen',
  sh_template_ships: 'Raumschiffe', sh_template_vehicles: 'Fahrzeuge',
  sh_template_applied: 'Vorlage übernommen ✔',
  sh_template_overwrite: 'Aktuelle Werte durch die Vorlage „{name}“ ersetzen?',
  sh_source: 'Quelle',
  sh_varied: 'Diese Quelle nennt je nach Epoche unterschiedliche Werte – übernommen wurde jeweils der erste. Originalangaben:',
  sh_basics: 'Grunddaten', sh_owner: 'Besitzer', sh_shipname: 'Schiffsname',
  sh_craft: 'Modell (Craft)', sh_type: 'Typ', sh_scale: 'Größenklasse',
  sh_skill: 'Pilotenskill', sh_skillspec: 'Spezialisierung',
  sh_crew: 'Crew', sh_passengers: 'Passagiere', sh_cargo: 'Frachtkapazität',
  sh_consumables: 'Vorräte', sh_length: 'Länge (m)', sh_cover: 'Deckung',
  sh_altitude: 'Max. Flughöhe', sh_nav: 'Nav-Computer',
  sh_hyper: 'Hyperantrieb (Multiplikator)', sh_hyperbackup: 'Backup-Hyperantrieb',
  sh_buy_backup: 'Backup-Hyperantrieb kaufen',
  sh_weight_scale: 'Klasse',
  sh_weapon_weight: 'davon Waffen',
  sh_capclass: 'Capital-Unterklasse',
  sh_capclass_cruiser: 'bis Kreuzer (×6)',
  sh_capclass_isd: 'Sternenzerstörer (×15)',
  sh_capclass_ssd: 'Super-Sternenzerstörer (×30)',
  sh_weight_scale_hint: 'Großsysteme (Ersatz-Antrieb, Hyperantrieb, Backup-Hyperantrieb, Schildgenerator) wiegen je nach Größenklasse unterschiedlich – aktueller Faktor ×{f}. Basis sind die Space-Transport-Werte aus Galaxy Guide 6: Jäger ×0,5, Space Transport ×1; Capital abgestuft (bis Kreuzer ×6, Sternenzerstörer ×15, Super-Sternenzerstörer ×30), Death Star ×60 (Hausregel, abgeleitet aus der Scale-Tabelle des Grundregelwerks). Ausrüstung und Frachtumbauten bleiben unverändert.',
  sh_backup_yes: 'Ja – x5 (2.500 Cr, Gewicht 8)',
  sh_backup_hint: 'Notfall-Antrieb „Lifesaver 1000" (x5) aus Galaxy Guide 6: kostet 2.500 Credits und 8 Gewicht (wie ein Ersatzteil, geht vom Laderaum ab). Muss nach jedem Sprung überholt werden. Ein gekaufter Backup hat Vorrang vor dem im Reiter „Werte" hinterlegten Wert.',
  sh_stats: 'Werte', sh_hull: 'Hülle', sh_shields: 'Schilde',
  sh_maneuver: 'Manövrierfähigkeit', sh_space: 'Space (Bewegung)',
  sh_atmosphere: 'Atmosphäre – Quellwert (optional)',
  sh_atmo_eff: 'Atmosphäre (Move; Vollgas)',
  sh_atmo_none: 'keine (kann keine Atmosphäre)',
  sh_atmo_derived: 'Aus Space berechnet:',
  sh_atmo_none_hint: 'Kein Atmosphärenflug (Feld = N/A).',
  sh_costnew: 'Preis (neu)', sh_costused: 'Preis (gebraucht)',
  sh_mishap: 'Pannen-Modifikator (Basis)',
  sh_basehint: 'Die Grundwerte stammen aus dem Quellenbuch des Schiffs – hier eintragen, die Umbauten rechnen darauf auf.',
  sh_portrait: 'Schiffsbild',
  sh_weapon: 'Waffe', sh_firearc: 'Feuerwinkel', sh_firelinked: 'Gekoppelt (fire-linked)',
  sh_firecontrol: 'Feuerleitsystem', sh_number: 'Anzahl', sh_wcrew: 'Bedienung (Crew)',
  sh_spacerange: 'Reichweite (Space)', sh_atmrange: 'Reichweite (Atmosphäre)',
  sh_sensors: 'Sensoren', sh_passive: 'Passiv', sh_scan: 'Scan', sh_search: 'Such', sh_focus: 'Fokus',
  sh_range: 'Reichweite', sh_bonus: 'Bonus',
  sh_quirks: 'Eigenheiten / Macken', sh_quirk_hint: 'Besonderheiten des Schiffs und ihre Auswirkungen – eine je Zeile.',
  sh_crewskills: 'Crew-Skills (NSC-Besatzung)',
  sh_mods_pct: 'Leistungs-Umbauten (Kosten in % des Neupreises)',
  sh_mod_drive: 'Sublicht-Antrieb (Space)', sh_mod_maneuver: 'Manövrierfähigkeit',
  sh_mod_hyper: 'Hyperantrieb verbessern', sh_mod_hull: 'Hülle verstärken',
  sh_mod_shield: 'Schilde verstärken', sh_mod_wdmg: 'Waffenschaden',
  sh_mod_none: '– kein Umbau –',
  sh_install: 'Einbau', sh_mishap_col: 'Panne',
  sh_parts: 'Ersatzteile & Systeme',
  sh_repl_drive: 'Ersatz-Antrieb', sh_repl_hyper: 'Ersatz-Hyperantrieb',
  sh_repl_maneuver: 'Ersatz-Manövriertriebwerke',
  sh_maneuver_hint: 'Hausregel (nicht in den Büchern): kaufbare Manövriertriebwerke, bewusst teuer. Obergrenze je Klasse – Space Transport bis 2D, Capital-Kreuzer bis 1D+2, größere Capital nur 1D, Jäger bis 4D. Preis/Gewicht skalieren mit der Schiffsklasse.',
  sh_shieldgen: 'Schildgenerator', sh_keep: '– Original behalten –',
  sh_mods_general: 'Ausrüstungs-Umbauten',
  sh_cargo_mods: 'Fracht-Umbauten',
  sh_cargo_left: 'Frachtraum frei',
  sh_cargo_rule: 'Frachtraum-Abzug',
  sh_cargo_auto: 'Automatisch (Standard)',
  sh_cargo_strict: 'Streng – Überladung als Fehler',
  sh_cargo_offopt: 'Ignorieren – Gewicht nicht abziehen',
  sh_cargo_off_short: 'Abzug aus',
  sh_cargo_small_note: 'Dieses Schiff hat weniger als eine Tonne Laderaum – typisch für Jäger. Galaxy Guide 6 schreibt dazu ausdrücklich: „All the modifications and replacements listed below were designed for light freighters … They should not be used for starfighters or capital combat ships.“ Ein Ersatzsystem passt hier also schlicht nicht hinein; das ist keine Fehlrechnung, sondern liegt außerhalb der Regeln. Für Jäger bleiben die Leistungs-Umbauten oben – die kosten laut Buch keinen Laderaum. Wer es trotzdem zulassen will, stellt den Abzug auf „Ignorieren“.',
  sh_houserule: 'Hausregel',
  sh_houserule_hint: 'Die Stufe +1D+2 bei Rumpf und Schilden geht über Galaxy Guide 6 hinaus: Das Buch deckelt den Rumpf ausdrücklich bei +1D+1 und nennt für Schilde gar keine Verbesserungstabelle. Sie ist als Hausregel ergänzt und folgt der Manövrierfähigkeit.',
  sh_wpn_catalog: 'Waffe aus den Regelwerken übernehmen',
  sh_wpn_hint: 'Die Bewaffnung stammt aus den Schiffsbeschreibungen der Sammelbände; die Übersicht aus „Galaxy Guide 6“ steht mit Preis und Gewicht voran. Auswählen und übernehmen – danach lässt sich alles frei anpassen.',
  sh_wpn_search: 'Suchen', sh_wpn_pick: '– Waffe wählen –',
  sh_wpn_allscales: 'Alle Größenklassen',
  sh_wpn_gg6: 'Galaxy Guide 6 – Frachter-Bewaffnung (mit Preis)',
  sh_wpn_books: 'Aus den Schiffsbeschreibungen der Sammelbände',
  sh_wpn_count: '{n} Waffen zur Auswahl',
  sh_wpn_cut: '{n} weitere nicht angezeigt – über Suche oder Größenklasse eingrenzen',
  sh_wpn_added: '✔ „{name}“ übernommen',
  sh_wpn_blank: 'Leere Waffe hinzufügen',
  sh_wpn_full: 'Mehr als {n} Waffen sieht der Generator nicht vor – erst eine entfernen.',
  sh_cargo_of: 'von', sh_cargo_used: 'belegt durch Umbauten:',
  sh_cargo_hint: 'Nur Ersatzsysteme und Einbauten wiegen etwas und gehen vom Frachtraum ab. Die prozentualen Leistungs-Umbauten oben kosten laut Galaxy Guide 6 keinen Laderaum: „as long as the characters are modifying an existing system, the ship’s cargo capacity is unaffected.“',
  sh_custom_mods: 'Eigene Umbauten',
  sh_weight: 'Gewicht (t)', sh_effect: 'Effekt',
  sh_summary: 'Zusammenfassung',
  sh_cost_mods: 'Kosten aller Umbauten', sh_cost_total: 'Preis (neu, umgebaut)',
  sh_weight_total: 'Zusatzgewicht', sh_mishap_total: 'Pannen-Modifikator (gesamt)',
  sh_mishap_hint: 'Der Pannen-Modifikator steigt mit jedem Leistungs-Umbau – der Spielleiter nutzt ihn für Zwischenfälle bei Umbauten von Amateurhand.',
  sh_effective: 'Effektive Werte nach Umbau',
  sheet_title_ship: 'Das Rollenspiel · D6 · Schiffsbogen',
  sh_info_block: 'Schiffsdaten', sh_movement: 'Bewegung',
  sh_fees: 'Wartung & Vorräte',
  sh_fees_text: '„Basisgebühr“ × (Crew + Passagiere) × Tage aufzufüllender Vorräte',
  /* Werkstatt (Galaxy Guide 6) */
  tab_shop: 'Werkstatt',
  ws_intro: 'Erweiterte Regeln aus „Galaxy Guide 6: Tramp Freighters“, Kapitel Acht. Gedacht für leichte Frachter – nicht für Jäger oder Schiffe der Capital-Klasse.',
  ws_mishap: 'Pannen auswürfeln',
  ws_mishap_when: 'Ein umgebautes System versagt, wenn der Wild Die eine 1 zeigt und der Spielleiter daraus eine Komplikation macht. Dann 1D werfen und den Pannen-Modifikator addieren.',
  ws_system: 'System', ws_modifier: 'Pannen-Modifikator', ws_roll: '🎲 Würfeln',
  ws_result_roll: 'Wurf', ws_result_total: 'Gesamt', ws_result_sev: 'Schweregrad',
  ws_sev_minor: 'Leicht', ws_sev_moderate: 'Mittel', ws_sev_catastrophic: 'Katastrophal',
  ws_sev_note: 'Eine gewürfelte 1 gilt immer als leichte Panne.',
  ws_repairs: 'Reparaturkosten',
  ws_repairs_hint: 'Prozentsätze vom ursprünglichen Kaufpreis des Schiffs – bei Waffen vom Preis der Waffe. Preise gelten für neue Teile in Eigenarbeit. Gebrauchtteile kosten die Hälfte, sind aber unzuverlässig; ein bezahlter Mechaniker verlangt noch einmal ungefähr den Teilepreis als Lohn.',
  ws_damage: 'Schaden', ws_diff: 'Schwierigkeit', ws_pct: 'Anteil', ws_credits: 'Credits',
  ws_of_weapon: 'vom Waffenpreis',
  ws_ports: 'Raumhäfen', ws_docking: 'Liegegebühr',
  ws_per_day: 'pro Tag', ws_none_listed: 'nicht festgelegt',
  ws_costs: 'Laufende Kosten',
  ws_restock: 'Vorräte auffüllen', ws_basefee: 'Basisgebühr',
  ws_people: 'Crew + Passagiere', ws_days: 'Tage', ws_dockdays: 'Liegetage',
  ws_basefee_hint: 'Übliche Route 10 Cr., abgelegener Außenrand bis 35 Cr.',
  ws_overhaul: 'Generalüberholung',
  ws_overhaul_hint: 'Nach je 20 Hyperraumsprüngen fällig. Wird sie versäumt, empfiehlt die Quelle rund drei Prozent Ausfallrisiko pro weiterem Sprung: der Spielleiter würfelt heimlich 2D, bei einer 2 versagt der Hyperantrieb.',
  ws_sum: 'Summe',
  ws_times: 'Einbauzeiten',
  ws_times_hint: 'Überstunden oder kräftige Bestechung halbieren die Zeit – zum doppelten Preis.',
  ws_time: 'Dauer',
  ws_rules: 'Faustregeln',
  ws_link: 'Waffen koppeln',
  ws_link_hint: 'Bis zu drei baugleiche Waffen mit identischem Schadenswert lassen sich koppeln. Die Rechnereinbindung kostet 100 Cr. je Waffe. Eine zweite Feuerstelle für dieselbe Waffe kostet ebenfalls 100 Cr. und zählt als +1 auf den Pannen-Tabellen.',
  ws_weapons_linked: 'gekoppelt', ws_bonus: 'Schadensbonus',
  sh_template_count: '{ships} Schiffe, {vehicles} Fahrzeuge zur Auswahl',
  sh_template_cut: '{n} weitere nicht angezeigt, bitte Suche oder Ära eingrenzen',
  ws_sh_bay: 'Reparaturbucht',
  ws_rule_used: 'Gebrauchtteile kosten die Hälfte – können aber jederzeit ausfallen.',
  ws_rule_resale: 'Eine Werft zahlt für ein ausgebautes Teil höchstens 25 % des Neupreises; ist es beschädigt, nur rund 5 % Schrottwert.',
  ws_rule_labor: 'Lässt man den Umbau ausführen, kostet die Arbeit 20 bis 50 % der Umbaukosten. Unabhängige Techniker handeln mit sich reden, Konzerntechniker nicht.',
  ws_rule_permit: 'Eine imperiale Waffengenehmigung kostet 30 % des Kaufpreises. Dafür ein vergleichender Con- oder Bureaucracy-Wurf gegen den Schadenswert der Waffe – je Waffe einzeln.',
  ws_rule_nav: 'Ersatz-Navigationscomputer: 2.000 Cr. Voll ausgerüstete Reparaturbucht: rund 100 Cr. pro Tag.',
  ws_source: 'Quelle',
});
Object.assign(T.en, {
  title: 'Star Wars D6 – Ship & Vehicle Generator',
  subtitle: 'Ship & Vehicle Generator',
  footer: 'Based on "Ship Generator v1-1" by Chance Gibboney · Star Wars: The Roleplaying Game, 2nd Edition – West End Games D6 system',
  doc_one: 'ship', doc_plural: 'ships',
  tab_ship: 'Ship', tab_weapons: 'Weapons', tab_crew: 'Sensors & Crew',
  tab_mods: 'Modifications', tab_sheet: 'Ship Sheet',
  sh_template: 'Template from the sourcebooks', sh_template_pick: '– choose ship/vehicle –',
  sh_template_hint: 'Over 850 ships and vehicles from the fan compilations. Selecting one fills in all base stats including weapons – adjust freely afterwards.',
  sh_template_apply: 'Apply template', sh_template_search: 'Search',
  sh_template_ships: 'Starships', sh_template_vehicles: 'Vehicles',
  sh_template_applied: 'Template applied ✔',
  sh_template_overwrite: 'Replace the current values with the template "{name}"?',
  sh_source: 'Source',
  sh_varied: 'This source lists different values per era – the first one was applied. Original entries:',
  sh_basics: 'Basics', sh_owner: 'Owner', sh_shipname: 'Ship Name',
  sh_craft: 'Craft', sh_type: 'Type', sh_scale: 'Scale',
  sh_skill: 'Pilot skill', sh_skillspec: 'Skill specialty',
  sh_crew: 'Crew', sh_passengers: 'Passengers', sh_cargo: 'Cargo capacity',
  sh_consumables: 'Consumables', sh_length: 'Length (m)', sh_cover: 'Cover',
  sh_altitude: 'Max. altitude', sh_nav: 'Nav computer',
  sh_hyper: 'Hyperdrive (multiplier)', sh_hyperbackup: 'Backup hyperdrive',
  sh_buy_backup: 'Buy backup hyperdrive',
  sh_weight_scale: 'class',
  sh_weapon_weight: 'of which weapons',
  sh_capclass: 'Capital sub-class',
  sh_capclass_cruiser: 'up to cruiser (×6)',
  sh_capclass_isd: 'Star Destroyer (×15)',
  sh_capclass_ssd: 'Super Star Destroyer (×30)',
  sh_weight_scale_hint: 'Major systems (replacement drive, hyperdrive, backup hyperdrive, shield generator) weigh differently by ship class — current factor ×{f}. The baseline is the Space Transport figures from Galaxy Guide 6: starfighter ×0.5, space transport ×1; capital is tiered (up to cruiser ×6, Star Destroyer ×15, Super Star Destroyer ×30), Death Star ×60 (house rule, derived from the core rulebook scale table). Equipment and cargo modifications are unaffected.',
  sh_backup_yes: 'Yes – x5 (2,500 cr, weight 8)',
  sh_backup_hint: 'Emergency drive “Lifesaver 1000” (x5) from Galaxy Guide 6: costs 2,500 credits and 8 weight (like a spare part, comes off cargo). Must be overhauled after every jump. A purchased backup overrides the value set on the “Stats” tab.',
  sh_stats: 'Stats', sh_hull: 'Hull', sh_shields: 'Shields',
  sh_maneuver: 'Maneuverability', sh_space: 'Space (movement)',
  sh_atmosphere: 'Atmosphere – source value (optional)',
  sh_atmo_eff: 'Atmosphere (move; all-out)',
  sh_atmo_none: 'none (cannot enter atmosphere)',
  sh_atmo_derived: 'Derived from Space:',
  sh_atmo_none_hint: 'No atmospheric flight (field = N/A).',
  sh_costnew: 'Cost (new)', sh_costused: 'Cost (used)',
  sh_mishap: 'Mishap modifier (base)',
  sh_basehint: 'Enter the base stats from the ship’s sourcebook – the modifications build on them.',
  sh_portrait: 'Ship Picture',
  sh_weapon: 'Weapon', sh_firearc: 'Fire arc', sh_firelinked: 'Fire-linked',
  sh_firecontrol: 'Fire control', sh_number: 'Number', sh_wcrew: 'Crew (weapon)',
  sh_spacerange: 'Space range', sh_atmrange: 'Atmosphere range',
  sh_sensors: 'Sensors', sh_passive: 'Passive', sh_scan: 'Scan', sh_search: 'Search', sh_focus: 'Focus',
  sh_range: 'Range', sh_bonus: 'Bonus',
  sh_quirks: 'Quirks / difficulties', sh_quirk_hint: 'Peculiarities of the ship and their effects – one per line.',
  sh_crewskills: 'Crew skills (NPC crew)',
  sh_mods_pct: 'Performance modifications (cost as % of new price)',
  sh_mod_drive: 'Sublight drive (space)', sh_mod_maneuver: 'Maneuverability',
  sh_mod_hyper: 'Improve hyperdrive', sh_mod_hull: 'Reinforce hull',
  sh_mod_shield: 'Reinforce shields', sh_mod_wdmg: 'Weapon damage',
  sh_mod_none: '– no modification –',
  sh_install: 'Install', sh_mishap_col: 'Mishap',
  sh_parts: 'Replacement parts & systems',
  sh_repl_drive: 'Replacement drive', sh_repl_hyper: 'Replacement hyperdrive',
  sh_repl_maneuver: 'Replacement maneuver thrusters',
  sh_maneuver_hint: 'House rule (not in the books): purchasable maneuver thrusters, deliberately expensive. Cap per class — space transport up to 2D, capital cruiser up to 1D+2, larger capital only 1D, starfighter up to 4D. Price/weight scale with the ship class.',
  sh_shieldgen: 'Shield generator', sh_keep: '– keep original –',
  sh_mods_general: 'Equipment modifications',
  sh_cargo_mods: 'Cargo modifications',
  sh_cargo_left: 'Cargo space free',
  sh_cargo_rule: 'Cargo deduction',
  sh_cargo_auto: 'Automatic (default)',
  sh_cargo_strict: 'Strict – flag overload as an error',
  sh_cargo_offopt: 'Ignore – do not deduct weight',
  sh_cargo_off_short: 'deduction off',
  sh_cargo_small_note: 'This craft has less than a ton of cargo space – typical for a starfighter. Galaxy Guide 6 says so explicitly: "All the modifications and replacements listed below were designed for light freighters … They should not be used for starfighters or capital combat ships." A replacement system simply does not fit here; that is not a miscalculation, it is outside the rules. For fighters the percentage modifications above remain – by the book those cost no cargo space at all. To allow it anyway, set the deduction to "Ignore".',
  sh_houserule: 'house rule',
  sh_houserule_hint: 'The +1D+2 step for hull and shields goes beyond Galaxy Guide 6: the book explicitly caps the hull at +1D+1 and gives no improvement table for shields at all. It is included as a house rule, mirroring maneuverability.',
  sh_wpn_catalog: 'Add a weapon from the sourcebooks',
  sh_wpn_hint: 'These weapons are taken from the ship entries in the compendia; the summary from "Galaxy Guide 6" comes first, with price and weight. Pick one and add it – everything stays editable afterwards.',
  sh_wpn_search: 'Search', sh_wpn_pick: '– pick a weapon –',
  sh_wpn_allscales: 'All scales',
  sh_wpn_gg6: 'Galaxy Guide 6 – freighter armament (with price)',
  sh_wpn_books: 'From the ship entries in the compendia',
  sh_wpn_count: '{n} weapons to choose from',
  sh_wpn_cut: '{n} more not shown – narrow it down with the search or scale',
  sh_wpn_added: '✔ Added "{name}"',
  sh_wpn_blank: 'Add a blank weapon',
  sh_wpn_full: 'The generator does not go beyond {n} weapons – remove one first.',
  sh_cargo_of: 'of', sh_cargo_used: 'taken by modifications:',
  sh_cargo_hint: 'Only replacement systems and installed gear have weight and come off the cargo capacity. The percentage modifications above cost no cargo space at all, per Galaxy Guide 6: “as long as the characters are modifying an existing system, the ship’s cargo capacity is unaffected.”',
  sh_custom_mods: 'Custom modifications',
  sh_weight: 'Weight (t)', sh_effect: 'Effect',
  sh_summary: 'Summary',
  sh_cost_mods: 'Cost of all modifications', sh_cost_total: 'Cost (new, modified)',
  sh_weight_total: 'Added weight', sh_mishap_total: 'Mishap modifier (total)',
  sh_mishap_hint: 'The mishap modifier grows with every performance modification – the GM uses it for incidents caused by amateur work.',
  sh_effective: 'Effective stats after modification',
  sheet_title_ship: 'The Roleplaying Game · D6 · Ship Sheet',
  sh_info_block: 'Ship Information', sh_movement: 'Movement',
  sh_fees: 'Maintenance & restocking',
  sh_fees_text: '"Base fee" × (crew + passengers) × days of consumables to restock',
  /* Workshop (Galaxy Guide 6) */
  tab_shop: 'Workshop',
  ws_intro: 'Expanded rules from "Galaxy Guide 6: Tramp Freighters", Chapter Eight. Written for light freighters – not for starfighters or capital combat ships.',
  ws_mishap: 'Roll for mishaps',
  ws_mishap_when: 'A modified system malfunctions when the wild die comes up 1 and the GM turns it into a complication. Then roll 1D and add the mishap modifier.',
  ws_system: 'System', ws_modifier: 'Mishap modifier', ws_roll: '🎲 Roll',
  ws_result_roll: 'Roll', ws_result_total: 'Total', ws_result_sev: 'Severity',
  ws_sev_minor: 'Minor', ws_sev_moderate: 'Moderate', ws_sev_catastrophic: 'Catastrophic',
  ws_sev_note: 'A roll of 1 always counts as a minor mishap.',
  ws_repairs: 'Repair costs',
  ws_repairs_hint: 'Percentages of the ship\'s original retail cost – for weapons, of the weapon\'s cost. Prices are for new parts with the characters doing the work themselves. Used parts cost half but may not be reliable; hired labour runs about the cost of the new parts again.',
  ws_damage: 'Damage', ws_diff: 'Difficulty', ws_pct: 'Share', ws_credits: 'Credits',
  ws_of_weapon: 'of weapon cost',
  ws_ports: 'Spaceports', ws_docking: 'Docking fee',
  ws_per_day: 'per day', ws_none_listed: 'not listed',
  ws_costs: 'Running costs',
  ws_restock: 'Restocking', ws_basefee: 'Base fee',
  ws_people: 'Crew + passengers', ws_days: 'Days', ws_dockdays: 'Days docked',
  ws_basefee_hint: 'Well-travelled routes around 10 cr., isolated Outer Rim ports up to 35 cr.',
  ws_overhaul: 'Maintenance overhaul',
  ws_overhaul_hint: 'Due after every 20 hyperspace jumps. If skipped, the source suggests roughly a three percent chance of failure per further jump: the GM secretly rolls 2D, and on a 2 the hyperdrive malfunctions.',
  ws_sum: 'Total',
  ws_times: 'Installation times',
  ws_times_hint: 'Overtime or substantial bribes cut the time in half – at double the cost.',
  ws_time: 'Time taken',
  ws_rules: 'Rules of thumb',
  ws_link: 'Linked weapons',
  ws_link_hint: 'Up to three identical weapons with matching damage codes can be linked. The computer linkage costs 100 cr. per weapon. A second firing station for the same weapon also costs 100 cr. and counts as a +1 modification on the mishap charts.',
  ws_weapons_linked: 'linked', ws_bonus: 'Damage bonus',
  sh_template_count: '{ships} ships, {vehicles} vehicles to choose from',
  sh_template_cut: '{n} more not shown – narrow the search or era',
  ws_sh_bay: 'Repair bay',
  ws_rule_used: 'Used parts cost half – but they may give out at the worst possible moment.',
  ws_rule_resale: 'A shipyard will never offer more than 25 % of list for a part it takes out; if the part is damaged, only about 5 % salvage price.',
  ws_rule_labor: 'Hiring the work out costs 20 to 50 % of the modification cost. Independent technicians can be bargained with, corporate ones cannot.',
  ws_rule_permit: 'An Imperial weapon permit costs 30 % of the purchase price. Roll con or bureaucracy opposed by the weapon\'s damage code – separately for each weapon.',
  ws_rule_nav: 'Replacement nav computer: 2,000 cr. A fully equipped repair bay rents for about 100 cr. per day.',
  ws_source: 'Source',
});

/* ---------------- Dokument ---------------- */
function emptyDoc() {
  return {
    version: 1, kind: 'ship',
    info: {
      name: '', owner: '', craft: '', type: '', scale: 'Starfighter',
      skill: 'Space Transports', skillSpec: '', crew: '', passengers: '',
      cargo: '', consumables: '', length: '', cover: 'Not applicable',
      altitude: '', nav: true, hyper: 'x2', hyperBackup: 'None',
      capitalClass: 'cruiser',      // nur bei Capital-Skala: cruiser | stardestroyer | ssd
      hull: 12, shields: 3, maneuver: 3, space: 4, atmosphere: '',
      costNew: 0, costUsed: 0, mishapBase: 0, portrait: '', notes: '',
      cargoRule: 'auto',            // auto | strict | off – siehe cargoStatus()
    },
    weapons: [],
    sensors: {
      passiveRange: '', passiveBonus: 0, scanRange: '', scanBonus: 0,
      searchRange: '', searchBonus: 0, focusRange: '', focusBonus: 0,
    },
    quirks: '',
    crewSkills: {},                 // Skillname -> Pips
    mods: {
      drive: '', maneuver: '', hyper: '', hull: '', shield: '', wdmg: '',
      replDrive: '', replHyper: '', shieldGen: '', backupHyper: false, replManeuver: '',
      general: {},                  // Name -> Anzahl
      cargo: {},                    // Name -> Anzahl
      custom: [],                   // {name, desc, cost, weight}
    },
  };
}
let C = emptyDoc();
function migrate(obj) {
  const base = emptyDoc();
  const m = Object.assign(base, obj);
  m.info = Object.assign(emptyDoc().info, obj.info || {});
  m.sensors = Object.assign(emptyDoc().sensors, obj.sensors || {});
  m.mods = Object.assign(emptyDoc().mods, obj.mods || {});
  if (!Array.isArray(m.weapons)) m.weapons = [];
  /* Bis v2.2.1 konnte "Starship" in gespeicherten Schiffen stehen. */
  m.weapons.forEach(w => { w.scale = normScale(w.scale); });
  if (!Array.isArray(m.mods.custom)) m.mods.custom = [];
  m.kind = 'ship';
  return m;
}
function emptyWeapon() {
  return { name: '', scale: 'Starfighter', arc: 'Front', skill: 'Starship Gunnery',
           linked: false, fireControl: 0, damage: 12, number: 1, crew: '',
           spaceRange: '', atmRange: '' };
}

/* Das Excel führt die Waffen-Größenklassen als "Starship", die des Schiffs
   als "Starfighter" – dieselbe Skala unter zwei Namen. Dadurch fand die
   Auswahlliste den voreingestellten Wert nicht und fiel auf die erste
   Option ("Character") zurück. Hier auf die Schreibweise des Regelwerks
   vereinheitlicht; gendata.js bleibt unangetastet, weil es aus dem Excel
   erzeugt wird. */
function weaponScaleList() {
  return SHIP_DATA.weaponScales.map(s => (s === 'Starship' ? 'Starfighter' : s));
}
function normScale(s) {
  return s === 'Starship' ? 'Starfighter' : (s || '');
}

/* Kaufbarer Backup-Hyperantrieb: der klassische „Lifesaver 1000" (x5) aus
   Galaxy Guide 6 – feste Werte, kostet Credits und Gewicht wie ein Ersatzteil.
   „Muss nach jedem Sprung überholt werden" (Notfallantrieb). */
const BACKUP_HYPER = { mult: 'x5', cost: 2500, weight: 8 };

/* Gewichts-Faktor der großen Einbausysteme nach Größenklasse. Die GG6-Werte
   sind für leichte Frachter (Space Transports) ausgelegt – ein Capital-
   Hyperantrieb oder -Schildgenerator wiegt ein Vielfaches, ein reiner Jäger
   weniger. Offizielle Scale-Tabelle (R&E S.92): Starfighter 6D, Capital 12D,
   Death Star 24D; daraus als Hausregel abgeleitete, gerundete Faktoren.
   Betrifft nur die Großsysteme (Antrieb, Hyperantrieb, Schildgenerator) –
   Ausrüstung/Frachtumbauten bleiben crew-groß und unskaliert. */
function weightScaleFactor(i) {
  switch (i.scale) {
    case 'Capital':
      /* Innerhalb der Capital-Skala nochmals abgestuft (nur fürs Gewicht):
         bis Kreuzer < Sternenzerstörer < Super-Sternenzerstörer. */
      return i.capitalClass === 'ssd' ? 30
           : i.capitalClass === 'stardestroyer' ? 15 : 6;
    case 'Deathstar': return 60;    // bleibt die Spitze – größer geht nur DS II / Starkiller ;)
    case 'Starfighter': return i.skill === 'Space Transports' ? 1 : 0.5;
    default:          return 0.5;   // Speeder / Walker / Character
  }
}

/* Gewichts-Multiplikator einer Größenklasse (für Waffen, nach deren eigener
   Skala). Analog zu weightScaleFactor, aber ohne Space-Transport-Sonderfall. */
function scaleMultOf(scale) {
  switch (scale) {
    case 'Capital':   return 10;
    case 'Deathstar': return 30;
    case 'Starfighter': return 1;
    case 'Walker':    return 0.6;
    case 'Speeder':   return 0.4;
    default:          return 0.3;   // Character
  }
}
/* Basisgewicht einer Waffe auf Starfighter-Skala (Hausregel), damit
   Zusatzbewaffnung nicht gewichtslos zum Overpowern taugt. */
const WEAPON_BASE_WEIGHT = 2;

/* Ersatz-Manövriertriebwerke (Hausregel – steht so nicht in den Büchern).
   Obergrenze der erreichbaren Manövrierbarkeit je Klasse (in Pips):
   Space Transport ≤ 2D, Capital-Kreuzer ≤ 1D+2, größere Capital ≤ 1D,
   Jäger/Kleingerät großzügiger. Preis/Gewicht skalieren wie die anderen
   Großsysteme über weightScaleFactor. */
function maneuverCapPips(i) {
  switch (i.scale) {
    case 'Capital':   return i.capitalClass === 'cruiser' ? 5 : 3;   // 1D+2 / 1D
    case 'Deathstar': return 3;                                      // 1D
    case 'Starfighter': return i.skill === 'Space Transports' ? 6 : 12; // 2D / 4D
    default:          return 12;                                     // Speeder/Walker/Character
  }
}
function maneuverThrusterOptions(i) {
  const cap = maneuverCapPips(i);
  const out = [];
  for (let p = 3; p <= cap; p++) out.push({ pips: p, cost: p * 6000, weight: Math.max(1, Math.round(p / 2)) });
  return out;
}
function maneuverThruster(i, sel) {
  const pips = +sel;
  if (!pips) return null;
  if (pips > maneuverCapPips(i)) return null;   // über Klassen-Cap → ignorieren
  return { value: pips, cost: pips * 6000, weight: Math.max(1, Math.round(pips / 2)) };
}

/* ---------------- Berechnungen ---------------- */
function pctMod(list, label) { return list.find(m => m.label === label) || null; }

/* Das Excel beginnt beim Hyperantrieb erst bei x2. Galaxy Guide 6 nennt
   davor noch den Schritt x4 → x3, der hier vorangestellt wird. */
/* Rumpf und Schilde: das Excel endet bei +1D+1. Galaxy Guide 6 deckelt den
   Rumpf dort ausdruecklich und nennt fuer Schilde gar keine Tabelle - die
   Stufe +1D+2 ist eine bewusst ergaenzte Hausregel (siehe shiprules.js). */
function hullShieldList(base) {
  const extra = (typeof TRAMP_RULES !== 'undefined' && TRAMP_RULES.hullShieldExtra)
    ? TRAMP_RULES.hullShieldExtra : [];
  return base.concat(extra);
}

function hyperImproveList() {
  const extra = (typeof TRAMP_RULES !== 'undefined') ? TRAMP_RULES.hyperImproveExtra : [];
  return extra.concat(SHIP_DATA.hyperImprove);
}
function modPips(label) {
  /* '+0D+1' → 1 Pip usw. */
  const m = /\+?(\d+)D\+(\d+)/.exec(label || '');
  if (m) return (+m[1]) * 3 + (+m[2]);
  const n = /\+(\d+)/.exec(label || '');
  return n ? 0 : 0;
}
/* Atmosphärengeschwindigkeit aus dem Space-Wert – die Tabelle steht so im
   Grundregelwerk ("Ships in an Atmosphere"). Erste Zahl = Move in der
   Atmosphäre, zweite = Vollgas in km/h. Die Bücher tragen bei den einzelnen
   Schiffen oft grobe oder gar keine Atmosphärenwerte ein; abgeleitet aus dem
   (auch modifizierten) Space stimmt es immer und ändert sich mit Umbauten. */
const ATMO_TABLE = {
  1: [210, 600], 2: [225, 650], 3: [260, 750], 4: [280, 800],
  5: [295, 850], 6: [330, 950], 7: [350, 1000], 8: [365, 1050],
  9: [400, 1150], 10: [415, 1200], 11: [435, 1250], 12: [450, 1300],
};
function atmoFromSpace(space) {
  const s = Math.round(+space || 0);
  if (s < 1) return null;
  let row = ATMO_TABLE[s];
  if (!row) {                        // über die Tabelle hinaus fortschreiben
    const top = ATMO_TABLE[12];
    row = [top[0] + (s - 12) * 15, top[1] + (s - 12) * 50];
  }
  return { move: row[0], kph: row[1] };
}
/* Ein Schiff ohne Atmosphären-Eintrag kann laut Regelwerk gar nicht in eine
   Atmosphäre – das sagt das Feld aber nur, wenn dort ausdrücklich "N/A" o. ä.
   steht. Ein leeres Feld ist meist nur eine Lücke der Extraktion (viele Jäger
   haben Space, aber keinen ausgeschriebenen Atmosphärenwert). */
function canEnterAtmosphere(atmoField) {
  return !/^\s*(n\/?a|none|not applicable|keine?|no)\s*$/i.test(atmoField || '');
}
function atmoDisplay(space, atmoField) {
  if (!canEnterAtmosphere(atmoField)) return '';
  const a = atmoFromSpace(space);
  if (!a) return '';
  return a.move + '; ' + a.kph.toLocaleString('en-US') + ' km/h';
}

function shipDerived() {
  const i = C.info, md = C.mods;
  const cost = +i.costNew || 0;
  let modCost = 0, mishap = +i.mishapBase || 0, weight = 0;
  const pct = [
    ['drive', SHIP_DATA.driveMods], ['maneuver', SHIP_DATA.maneuverMods],
    ['hyper', hyperImproveList()], ['hull', hullShieldList(SHIP_DATA.hullMods)],
    ['shield', hullShieldList(SHIP_DATA.shieldMods)], ['wdmg', SHIP_DATA.weaponDmgMods],
  ];
  for (const [key, list] of pct) {
    const sel = pctMod(list, md[key]);
    if (sel) { modCost += cost * sel.costPct; mishap += sel.mishap; }
  }
  /* Großsysteme skalieren mit der Größenklasse – Gewicht UND Preis (Jäger
     billiger/leichter, Capital nach Multiplikator, siehe weightScaleFactor). */
  const wf = weightScaleFactor(i);
  const rd = SHIP_DATA.replDrives.find(x => x.model === md.replDrive);
  if (rd) { modCost += rd.cost * wf; weight += rd.weight * wf; }
  const rh = SHIP_DATA.replHyper.find(x => x.model === md.replHyper);
  if (rh) { modCost += rh.cost * wf; weight += rh.weight * wf; }
  if (md.backupHyper) { modCost += BACKUP_HYPER.cost * wf; weight += BACKUP_HYPER.weight * wf; }
  const sg = SHIP_DATA.shieldGens.find(x => x.rating === md.shieldGen);
  if (sg) { modCost += sg.cost * wf; weight += sg.weight * wf; }
  /* Ersatz-Manövriertriebwerke (Hausregel, teuer, Preis/Gewicht nach Klasse). */
  const mt = maneuverThruster(i, md.replManeuver);
  if (mt) { modCost += mt.cost * wf; weight += mt.weight * wf; }
  for (const [n, q] of Object.entries(md.general)) {
    const g = SHIP_DATA.generalMods.find(x => x.name === n);
    if (g && q > 0) { modCost += g.cost * q; weight += g.weight * q; }
  }
  for (const [n, q] of Object.entries(md.cargo)) {
    const g = SHIP_DATA.cargoMods.find(x => x.name === n);
    if (g && q > 0) { modCost += g.cost * q; weight += g.weight * q; }
  }
  md.custom.forEach(cm => { modCost += (+cm.cost || 0); weight += (+cm.weight || 0); });
  /* Bewaffnung wiegt jetzt mit (je Waffe nach ihrer Skala × Anzahl). */
  let weaponWeight = 0;
  (C.weapons || []).forEach(w => {
    weaponWeight += WEAPON_BASE_WEIGHT * scaleMultOf(w.scale) * Math.max(1, +w.number || 1);
  });
  weight += weaponWeight;
  weight = Math.round(weight * 10) / 10;   // saubere Anzeige bei ×0.5-Faktor

  /* Effektive Werte */
  const hull = (+i.hull || 0) + modPips(md.hull);
  /* Der Schildgenerator ist ein Ersatzsystem, kein Zusatz: Er tritt an die
     Stelle der vorhandenen Schilde, genau wie Ersatz-Antrieb und
     Ersatz-Hyperantrieb. Bisher wurde er aufaddiert – ein 4D-Generator in
     einem Schiff mit 3D Schilden ergab 7D statt 4D.
     Prozentuale Umbauten ("Schilde verstärken") kommen danach obendrauf. */
  const shields = (sg ? sg.pips : (+i.shields || 0)) + modPips(md.shield);
  /* Ersatz-Triebwerk gibt (wie Ersatz-Antrieb) den neuen Grundwert vor. */
  const maneuver = (mt ? mt.value : (+i.maneuver || 0)) + modPips(md.maneuver);
  /* Ein Ersatz-Antrieb gibt den neuen Grundwert vor; ein zusätzlicher
     Leistungs-Umbau kommt darauf. Die Quelle sieht das ausdrücklich vor
     ("Double all difficulties for modifying this drive"), bisher wurde der
     Umbau bei eingebautem Ersatz-Antrieb stillschweigend verschluckt. */
  let space = rd ? rd.space : (+i.space || 0);
  const dm = pctMod(SHIP_DATA.driveMods, md.drive);
  if (dm) space += +dm.label.replace('+', '');

  /* Beim Hyperantrieb sind beide Angaben absolute Multiplikatoren, keine
     Zuschläge. Kleiner ist schneller – deshalb gilt der bessere Wert, sonst
     würde ein eingebauter x1-Antrieb von einem alten "auf x2 verbessern"
     wieder ausgebremst. */
  let hyper = i.hyper;
  const hyperCandidates = [i.hyper, rh && rh.mult, md.hyper].filter(Boolean);
  if (hyperCandidates.length > 1 || rh || md.hyper) {
    const val = x => { const m = /x\s*([\d.]+)/i.exec(String(x)); return m ? parseFloat(m[1]) : Infinity; };
    hyper = hyperCandidates.reduce((best, x) => (val(x) < val(best) ? x : best));
  }
  const wdmgPips = modPips(md.wdmg);
  const atmo = atmoDisplay(space, i.atmosphere);
  /* Backup-Hyperantrieb: gekaufter (x5) hat Vorrang vor dem manuell im
     Reiter hinterlegten Wert. „None"/leer = keiner. */
  const hyperBackup = md.backupHyper ? BACKUP_HYPER.mult
    : (i.hyperBackup && i.hyperBackup !== 'None' ? i.hyperBackup : '');
  return Object.assign(
    { modCost, mishap, weight, hull, shields, maneuver, space, hyper, wdmgPips,
      atmo, canAtmo: canEnterAtmosphere(i.atmosphere), hyperBackup,
      weightFactor: wf, weaponWeight: Math.round(weaponWeight * 10) / 10,
      costTotal: cost + modCost },
    cargoStatus(weight));
}

/* --------------------------------------------------------------------------
   Frachtraum und Umbauten

   Galaxy Guide 6 unterscheidet klar zwischen zwei Wegen:

     "Modified systems have one tremendous advantage over replaced systems:
      they do not take up extra space. In game terms, as long as the
      characters are modifying an existing system, the ship's cargo capacity
      is unaffected."                                              (Kapitel 8)

   Die prozentualen Leistungs-Umbauten kosten also KEINEN Frachtraum – nur
   Ersatzsysteme und Einbauten wiegen etwas. Genau deshalb lässt sich auch
   ein Jäger aufrüsten, obwohl er kaum Laderaum hat.

   Dazu kommt der ausdrückliche Geltungsbereich des Kapitels:

     "All the modifications and replacements listed below were designed for
      light freighters (and other related ships). They should not be used for
      starfighters or capital combat ships."

   Ein Jäger mit 110 kg Laderaum, in den jemand einen 18-Tonnen-Ersatzantrieb
   einbaut, ist deshalb kein Rechenfehler der App, sondern ein Fall, den das
   Buch gar nicht vorsieht. Statt einer roten Fehlermeldung erklärt die App
   das – und überlässt der Spielleitung die Entscheidung:

     auto   – Standard: rechnet mit, meldet aber bei Kleinschiffen ruhig
              statt alarmierend, weil die Regeln dort nicht greifen
     strict – rechnet mit und markiert jede Überladung rot
     off    – Gewicht wird gar nicht gegen den Laderaum gerechnet
   -------------------------------------------------------------------------- */
function cargoStatus(weight) {
  const base = cargoTons();
  const rule = C.info.cargoRule || 'auto';
  const round = v => Math.round(v * 1000) / 1000;
  /* Kleinschiff: weniger als eine Tonne Laderaum. Das trifft Jäger, deren
     Stauraum die Bücher in Kilogramm angeben. */
  const small = base > 0 && base < 1;
  const left = round(base - (rule === 'off' ? 0 : weight));
  return {
    cargoBase: round(base),
    cargoLeft: left,
    cargoUnit: small ? 'kg' : 't',
    cargoSmall: small,
    cargoRule: rule,
    /* Rot nur, wenn die Überladung wirklich als Fehler gelten soll */
    cargoOver: left < 0 && rule !== 'off' && !(rule === 'auto' && small),
    cargoNote: left < 0 && rule === 'auto' && small,
  };
}

/* Zahl in der Einheit ausgeben, die zum Schiff passt: Jäger führen ihren
   Stauraum in Kilogramm, Frachter in Tonnen. */
function fmtCargo(tons, unit) {
  if (unit === 'kg') return fmtCr(Math.round(tons * 1000)) + ' kg';
  return fmtCr(Math.round(tons * 100) / 100) + ' t';
}

/* Die Frachtkapazität steht als Freitext im Quellenbuch
   ("800 metric tons, in four cargo bays"). Für die Rechnung zählt die
   erste Zahl; kleine Schiffe sind gelegentlich in Kilogramm angegeben. */
function cargoTons() {
  const txt = String(C.info.cargo || '');
  const m = /([\d,.]+)\s*(?:metric\s*)?(ton|tonne)/i.exec(txt);
  if (m) return parseFloat(m[1].replace(/,/g, '')) || 0;
  const kg = /([\d,.]+)\s*kg/i.exec(txt);
  if (kg) return (parseFloat(kg[1].replace(/,/g, '')) || 0) / 1000;
  const n = /([\d,.]+)/.exec(txt);
  return n ? parseFloat(n[1].replace(/,/g, '')) || 0 : 0;
}

/* ---------------- Eingabe-Helfer ---------------- */
function diceCtl(path, pips) {
  const d = Math.floor((pips || 0) / 3), p = (pips || 0) % 3;
  return `<span class="dicectl nowrap">
    <input type="number" min="0" max="30" value="${d}" data-dice="${path}" data-part="d" style="width:58px">D +
    <input type="number" min="0" max="2" value="${p}" data-dice="${path}" data-part="p" style="width:48px">
    <span class="dice plain">${fmtD(pips || 0)}</span></span>`;
}
function selOpts(list, sel, noneLabel) {
  let out = noneLabel != null ? `<option value="">${noneLabel}</option>` : '';
  return out + list.map(x => `<option ${x === sel ? 'selected' : ''} value="${esc(x)}">${esc(x)}</option>`).join('');
}

/* ---------------- Ansichten ---------------- */
/* ---------------- Vorlagen aus den Regelwerks-PDFs ---------------- */
let tplFilter = '';
let tplEra = '';

/* Ära-Auswahl. Die Schlüssel liefert die erzeugte Katalogdatei mit, damit
   Dropdown und Daten nicht auseinanderlaufen. */
function eraOptions(selected) {
  const list = (typeof PDF_ERAS !== 'undefined') ? PDF_ERAS : [];
  return [`<option value="">${t('era_all')}</option>`].concat(
    list.map(e => `<option ${selected === e ? 'selected' : ''} value="${e}">${t('era_' + e.replace('-', '_'))}</option>`)
  ).join('');
}
function templates() {
  const ships = (typeof PDF_SHIPS !== 'undefined') ? PDF_SHIPS : [];
  const vehicles = (typeof PDF_VEHICLES !== 'undefined') ? PDF_VEHICLES : [];
  return { ships, vehicles };
}
function templateCard() {
  const { ships, vehicles } = templates();
  if (!ships.length && !vehicles.length) return '';
  const f = tplFilter.toLowerCase();
  const match = x => (!f || x.name.toLowerCase().includes(f) || (x.craft || '').toLowerCase().includes(f)) &&
                     (!tplEra || x.era === tplEra);
  const opt = (x, idx, kind) => `<option value="${kind}:${idx}">${esc(x.name)}${x.scale ? ' · ' + esc(x.scale) : ''}${x.book ? ' · ' + esc(x.book) : ''}</option>`;
  const CAP = 400;                      // längere Listen macht kein Browser mit
  const sHits = ships.map((x, n) => [x, n]).filter(([x]) => match(x));
  const vHits = vehicles.map((x, n) => [x, n]).filter(([x]) => match(x));
  const sOpts = sHits.slice(0, CAP).map(([x, n]) => opt(x, n, 'ship')).join('');
  const vOpts = vHits.slice(0, CAP).map(([x, n]) => opt(x, n, 'vehicle')).join('');
  /* Stillschweigend abschneiden wäre irreführend – wer nichts findet, soll
     wissen, dass er die Auswahl eingrenzen muss. */
  const cut = (sHits.length > CAP ? sHits.length - CAP : 0) +
              (vHits.length > CAP ? vHits.length - CAP : 0);
  return `
  <div class="card"><h2>${t('sh_template')}</h2>
    <p class="hint">${t('sh_template_hint')}</p>
    <div style="display:flex; gap:8px; flex-wrap:wrap; align-items:flex-end">
      <div style="flex:0 0 200px">
        <label>${t('sh_template_search')}</label>
        <input type="text" id="tplSearch" value="${esc(tplFilter)}" placeholder="YT-1300, X-wing …">
      </div>
      <div style="flex:0 0 200px">
        <label>${t('era_label')}</label>
        <select id="tplEra">${eraOptions(tplEra)}</select>
      </div>
      <div style="flex:1; min-width:240px">
        <label>${t('sh_template_pick')}</label>
        <select id="tplSelect" size="1">
          <optgroup label="${t('sh_template_ships')}">${sOpts}</optgroup>
          <optgroup label="${t('sh_template_vehicles')}">${vOpts}</optgroup>
        </select>
      </div>
      <div><button class="accent" data-act="applyTemplate">${t('sh_template_apply')}</button></div>
    </div>
    <p class="hint">${t('sh_template_count')
      .replace('{ships}', sHits.length).replace('{vehicles}', vHits.length)}${
      cut ? ' · ' + t('sh_template_cut').replace('{n}', cut) : ''}</p>
    ${tplMsg ? `<p class="ok" style="margin-top:8px">${esc(tplMsg)}</p>` : ''}
  </div>`;
}
let tplMsg = '';
function applyTemplate() {
  const sel = document.getElementById('tplSelect');
  if (!sel || !sel.value) return;
  const [kind, idxStr] = sel.value.split(':');
  const { ships, vehicles } = templates();
  const src = (kind === 'ship' ? ships : vehicles)[+idxStr];
  if (!src) return;
  if (!confirm(t('sh_template_overwrite').replace('{name}', src.name))) return;
  const i = C.info;
  i.craft = src.craft || src.name;
  i.type = src.type || '';
  if (!i.name) i.name = src.name;
  if (src.scale && SHIP_DATA.scales.includes(src.scale)) i.scale = src.scale;
  i.length = (src.length || '').replace(/\s*meters?/i, '');
  const sk = (src.skill || '').split(':')[0].trim();
  const hit = SHIP_DATA.pilotSkills.find(p => p.toLowerCase() === sk.toLowerCase());
  if (hit) i.skill = hit;
  i.skillSpec = (src.skill || '').includes(':') ? src.skill.split(':').slice(1).join(':').trim() : '';
  i.crew = src.crew || '';
  i.passengers = src.passengers || '';
  i.cargo = src.cargo || '';
  i.consumables = src.consumables || '';
  i.costNew = src.cost || 0;
  const used = /([\d,\.]+)\s*\(used/i.exec(src.costText || '');
  i.costUsed = used ? +used[1].replace(/,/g, '') : 0;
  /* Manche Quellen nennen mehrere Epochen ("8 (Rebellion), 11 (New Republic)").
     Dann den ersten Wert übernehmen und den Originaltext in die Notizen legen. */
  const varied = [];
  const firstNum = s2 => { const m = /(\d+)/.exec(String(s2 || '')); return m ? +m[1] : 0; };
  const isVaried = s2 => /,|\(/.test(String(s2 || ''));
  const hyperOk = SHIP_DATA.hyperMults.includes(src.hyper);
  if (src.hyper) {
    if (hyperOk) i.hyper = src.hyper;
    else varied.push(t('sh_hyper') + ': ' + src.hyper);
  }
  if (src.hyperBackup) {
    if (SHIP_DATA.hyperMults.includes(src.hyperBackup)) i.hyperBackup = src.hyperBackup;
    else varied.push(t('sh_hyperbackup') + ': ' + src.hyperBackup);
  }
  i.nav = /yes/i.test(src.nav || '');
  i.hull = src.hullPips || 0;
  i.shields = src.shieldPips || 0;
  i.maneuver = src.maneuverPips || 0;
  i.space = firstNum(src.space);
  i.atmosphere = src.atmosphere || src.move || '';
  if (src.cover && SHIP_DATA.covers.includes(src.cover)) i.cover = src.cover;
  [['space', src.space], ['maneuver', src.maneuver], ['hull', src.hull], ['shields', src.shields]]
    .forEach(([k, v]) => { if (isVaried(v)) varied.push(k + ': ' + v); });
  const notes = [];
  if (varied.length) notes.push('⚠ ' + t('sh_varied') + '\n' + varied.join('\n'));
  if (src.source) notes.push(t('sh_source') + ': ' + src.source);
  if (src.notes) notes.push(src.notes);
  if (src.era || src.affiliation) notes.push([src.era, src.affiliation].filter(Boolean).join(' · '));
  i.notes = notes.join('\n\n');
  /* Sensoren */
  const sn = src.sensors || {};
  const put = (key, val) => {
    const m = /^\s*([\d\/]+)\s*\/\s*(\d+D(?:\+\d)?)/.exec(val || '');
    if (m) { C.sensors[key + 'Range'] = m[1]; C.sensors[key + 'Bonus'] = dicePips(m[2]); }
    else { C.sensors[key + 'Range'] = (val || '').trim(); C.sensors[key + 'Bonus'] = 0; }
  };
  put('passive', sn.Passive); put('scan', sn.Scan);
  put('search', sn.Search); put('focus', sn.Focus);
  /* Waffen */
  C.weapons = (src.weapons || []).slice(0, SHIP_DATA.maxWeapons).map(w => {
    const nw = emptyWeapon();
    nw.name = w.name || '';
    if (w.scale && weaponScaleList().includes(normScale(w.scale))) nw.scale = normScale(w.scale);
    const arc = (w.arc || '').split(/[,\/]/)[0].trim();
    if (SHIP_DATA.fireArcs.includes(arc)) nw.arc = arc;
    const gs = SHIP_DATA.gunSkills.find(g => (w.skill || '').toLowerCase().startsWith(g.toLowerCase()));
    if (gs) nw.skill = gs;
    nw.linked = /fire-?linked/i.test(w.name || '');
    nw.fireControl = dicePips(w.fireControl);
    nw.damage = dicePips(w.damage);
    nw.crew = w.crew || '';
    nw.spaceRange = w.spaceRange || '';
    nw.atmRange = w.atmRange || '';
    return nw;
  });
  tplMsg = t('sh_template_applied');
  update('ship');
}
function dicePips(s) {
  if (!s) return 0;
  const m = /(\d+)\s*D\s*(?:\+\s*(\d+))?/.exec(String(s));
  return m ? (+m[1]) * 3 + (+(m[2] || 0)) : 0;
}

function viewShip() {
  const i = C.info;
  const der = shipDerived();
  return `
  ${templateCard()}
  ${portraitCardHtml(t('sh_portrait'))}
  <div class="card"><h2>${t('sh_basics')}</h2>
    <p class="hint">${t('sh_basehint')}</p>
    <div class="formgrid">
      <div><label>${t('sh_shipname')}</label>${inputT('info.name', i.name)}</div>
      <div><label>${t('sh_owner')}</label>${inputT('info.owner', i.owner)}</div>
      <div><label>${t('sh_craft')}</label>${inputT('info.craft', i.craft)}</div>
      <div><label>${t('sh_type')}</label>${inputT('info.type', i.type)}</div>
      <div><label>${t('sh_scale')}</label><select data-bind="info.scale" data-rerender="1">${selOpts(SHIP_DATA.scales, i.scale)}</select></div>
      ${i.scale === 'Capital' ? `<div><label>${t('sh_capclass')}</label>
        <select data-bind="info.capitalClass" data-rerender="1">
          <option value="cruiser" ${i.capitalClass === 'cruiser' ? 'selected' : ''}>${t('sh_capclass_cruiser')}</option>
          <option value="stardestroyer" ${i.capitalClass === 'stardestroyer' ? 'selected' : ''}>${t('sh_capclass_isd')}</option>
          <option value="ssd" ${i.capitalClass === 'ssd' ? 'selected' : ''}>${t('sh_capclass_ssd')}</option>
        </select></div>` : ''}
      <div><label>${t('sh_skill')}</label><select data-bind="info.skill">${selOpts(SHIP_DATA.pilotSkills, i.skill)}</select></div>
      <div><label>${t('sh_skillspec')}</label>${inputT('info.skillSpec', i.skillSpec)}</div>
      <div><label>${t('sh_crew')}</label>${inputT('info.crew', i.crew)}</div>
      <div><label>${t('sh_passengers')}</label>${inputT('info.passengers', i.passengers)}</div>
      <div><label>${t('sh_cargo')}</label>${inputT('info.cargo', i.cargo)}</div>
      <div><label>${t('sh_consumables')}</label>${inputT('info.consumables', i.consumables)}</div>
      <div><label>${t('sh_length')}</label>${inputT('info.length', i.length)}</div>
      <div><label>${t('sh_cover')}</label><select data-bind="info.cover">${selOpts(SHIP_DATA.covers, i.cover)}</select></div>
      <div><label>${t('sh_altitude')}</label>${inputT('info.altitude', i.altitude)}</div>
      <div><label>${t('sh_nav')}</label>
        <select data-bind="info.nav" data-type="bool">
          <option value="true" ${i.nav ? 'selected' : ''}>${t('yes')}</option>
          <option value="false" ${!i.nav ? 'selected' : ''}>${t('no')}</option>
        </select></div>
      <div><label>${t('sh_hyper')}</label><select data-bind="info.hyper">${selOpts(SHIP_DATA.hyperMults, i.hyper)}</select></div>
      <div><label>${t('sh_hyperbackup')}</label><select data-bind="info.hyperBackup">${selOpts(SHIP_DATA.hyperMults, i.hyperBackup)}</select></div>
    </div>
  </div>
  <div class="card"><h2>${t('sh_stats')}</h2>
    <div class="formgrid">
      <div><label>${t('sh_hull')}</label>${diceCtl('info.hull', i.hull)}</div>
      <div><label>${t('sh_shields')}</label>${diceCtl('info.shields', i.shields)}</div>
      <div><label>${t('sh_maneuver')}</label>${diceCtl('info.maneuver', i.maneuver)}</div>
      <div><label>${t('sh_space')}</label>${inputN('info.space', i.space, 'style="width:90px"')}</div>
      <div class="wide"><label>${t('sh_atmosphere')}</label>${inputT('info.atmosphere', i.atmosphere, 'style="width:100%"')}
        <div class="hint">${der.atmo ? t('sh_atmo_derived') + ' <b>' + esc(der.atmo) + '</b>' : t('sh_atmo_none_hint')}</div></div>
      <div><label>${t('sh_costnew')}</label>${inputN('info.costNew', i.costNew, 'data-rerender="1"')}</div>
      <div><label>${t('sh_costused')}</label>${inputN('info.costUsed', i.costUsed)}</div>
      <div><label>${t('sh_mishap')}</label>${inputN('info.mishapBase', i.mishapBase, 'data-rerender="1" style="width:90px"')}</div>
    </div>
  </div>
  <div class="card"><h2>${t('notes')}</h2>
    <textarea data-bind="info.notes">${esc(i.notes)}</textarea>
  </div>`;
}

/* ---------------- Waffen-Auswahl aus den Regelwerken ----------------
   Die Bewaffnung steht in den Büchern nur innerhalb der Schiffs-Statblöcke.
   tools/extract-from-pdfs.py sammelt daraus die Typen (PDF_SHIP_WEAPONS,
   nach Häufigkeit sortiert), dazu kommt die Waffenübersicht aus
   Galaxy Guide 6. Auswählen füllt eine neue Waffe mit allen Werten. */
let wpnFilter = '';
let wpnScale = '';

function weaponCatalog() {
  const out = [];
  /* Galaxy Guide 6 zuerst: eine überschaubare, vom Buch kuratierte Liste
     mit Preis und Gewicht – für Frachterausbauten die erste Wahl. */
  if (typeof TRAMP_RULES !== 'undefined' && TRAMP_RULES.weapons) {
    TRAMP_RULES.weapons.forEach(w => out.push({
      name: w.name, scale: w.scale, damage: w.damage, fireControl: w.fireControl,
      arc: '', skill: '', crew: '',
      spaceRange: w.spaceRange || '', atmRange: w.atmRange || '',
      cost: w.cost, weight: w.weight, note: w.note || '',
      book: 'GG6 Tramp Freighters', group: 'gg6',
    }));
  }
  if (typeof PDF_SHIP_WEAPONS !== 'undefined') {
    PDF_SHIP_WEAPONS.forEach(w => out.push(Object.assign({ group: 'pdf' }, w)));
  }
  return out;
}

function weaponCard() {
  const cat = weaponCatalog();
  if (!cat.length) return '';
  const f = wpnFilter.toLowerCase().trim();
  const hits = cat.filter(w =>
    (!wpnScale || w.scale === wpnScale) &&
    (!f || w.name.toLowerCase().includes(f)));
  const CAP = 300;
  /* Manche Bücher hängen an den Schadenswert eine Erläuterung
     ("6D against planetary shields, 3D otherwise"). In der Auswahlzeile
     zählt nur der Würfelcode – der ganze Text steht danach im Feld. */
  const shortDice = s => {
    const m = /^\s*(\d+\s*D(?:\s*\+\s*\d)?)/.exec(String(s || ''));
    return m ? m[1].replace(/\s+/g, '') : '';
  };
  const label = w => {
    const bits = [w.name];
    if (w.scale) bits.push(w.scale);                    // Starfighter / Capital …
    const dmg = shortDice(w.damage);
    if (dmg) bits.push(t('damage') + ' ' + dmg);
    const fc = shortDice(w.fireControl);
    if (fc) bits.push('FC ' + fc);
    if (w.cost) bits.push(fmtCr(w.cost) + ' Cr.');
    return bits.join(' · ');
  };
  const opt = (w, i) => `<option value="${i}">${esc(label(w))}</option>`;
  const gg6 = hits.map((w, i) => [w, i]).filter(([w]) => w.group === 'gg6');
  const pdf = hits.map((w, i) => [w, i]).filter(([w]) => w.group === 'pdf').slice(0, CAP);
  const scaleOpts = [`<option value="">${t('sh_wpn_allscales')}</option>`].concat(
    ['Starfighter', 'Capital', 'Speeder', 'Walker', 'Character'].map(s =>
      `<option ${wpnScale === s ? 'selected' : ''} value="${s}">${esc(s)}</option>`)).join('');
  const rest = hits.filter(w => w.group === 'pdf').length - pdf.length;

  return `
  <div class="card"><h2>${t('sh_wpn_catalog')}</h2>
    <p class="hint">${t('sh_wpn_hint')}</p>
    <div style="display:flex; gap:8px; flex-wrap:wrap; align-items:flex-end">
      <div style="flex:0 0 190px">
        <label>${t('sh_wpn_search')}</label>
        <input type="text" id="wpnSearch" value="${esc(wpnFilter)}" placeholder="Laser, Ion, Torpedo …">
      </div>
      <div style="flex:0 0 170px">
        <label>${t('sh_scale')}</label>
        <select id="wpnScale">${scaleOpts}</select>
      </div>
      <div style="flex:1 1 240px; min-width:200px">
        <label>${t('sh_wpn_pick')}</label>
        <select id="wpnSelect">
          ${gg6.length ? `<optgroup label="${esc(t('sh_wpn_gg6'))}">${gg6.map(([w, i]) => opt(w, i)).join('')}</optgroup>` : ''}
          ${pdf.length ? `<optgroup label="${esc(t('sh_wpn_books'))}">${pdf.map(([w, i]) => opt(w, i)).join('')}</optgroup>` : ''}
        </select>
      </div>
      <div><button class="accent" data-act="addFromCatalog">+ ${t('sh_weapon')}</button></div>
    </div>
    <p class="hint">${t('sh_wpn_count').replace('{n}', hits.length)}${rest > 0 ? ' · ' + t('sh_wpn_cut').replace('{n}', rest) : ''}</p>
    ${wpnMsg ? `<p class="ok">${esc(wpnMsg)}</p>` : ''}
  </div>`;
}
let wpnMsg = '';

function addWeaponFromCatalog() {
  if (C.weapons.length >= SHIP_DATA.maxWeapons) return;
  const sel = document.getElementById('wpnSelect');
  if (!sel || sel.value === '') return;
  const cat = weaponCatalog();
  const f = wpnFilter.toLowerCase().trim();
  const hits = cat.filter(w =>
    (!wpnScale || w.scale === wpnScale) &&
    (!f || w.name.toLowerCase().includes(f)));
  const src = hits[+sel.value];
  if (!src) return;
  const nw = emptyWeapon();
  nw.name = src.name;
  if (src.scale && weaponScaleList().includes(src.scale)) nw.scale = src.scale;
  if (src.arc && SHIP_DATA.fireArcs.includes(src.arc)) nw.arc = src.arc;
  const sk = (src.skill || '').split(':')[0].trim();
  const hitSkill = SHIP_DATA.gunSkills.find(g => g.toLowerCase() === sk.toLowerCase());
  if (hitSkill) nw.skill = hitSkill;
  else if (src.scale === 'Capital') nw.skill = 'Capital Ship Gunnery';
  nw.damage = dicePips(src.damage);
  nw.fireControl = dicePips(src.fireControl);
  nw.crew = src.crew || '';
  nw.spaceRange = src.spaceRange || '';
  nw.atmRange = src.atmRange || '';
  C.weapons.push(nw);
  wpnMsg = t('sh_wpn_added').replace('{name}', src.name);
  update();
}

/* '4D+2' -> 14 Pips. Die Kataloge liefern Würfelcodes als Text. */
function dicePips(s) {
  const m = /(\d+)\s*D(?:\s*\+\s*(\d))?/.exec(String(s || ''));
  return m ? (+m[1]) * 3 + (+(m[2] || 0)) : 0;
}

function viewWeapons() {
  const rows = C.weapons.map((w, wi) => `
    <div class="card"><h2>${t('sh_weapon')} ${wi + 1}
      <button class="mini danger" style="float:right" data-act="delWeapon" data-idx="${wi}">× ${t('remove')}</button></h2>
      <div class="formgrid">
        <div><label>${t('name')}</label>${inputT('weapons.' + wi + '.name', w.name)}</div>
        <div><label>${t('sh_scale')}</label><select data-bind="weapons.${wi}.scale">${selOpts(weaponScaleList(), normScale(w.scale))}</select></div>
        <div><label>${t('sh_firearc')}</label><select data-bind="weapons.${wi}.arc">${selOpts(SHIP_DATA.fireArcs, w.arc)}</select></div>
        <div><label>${t('skill')}</label><select data-bind="weapons.${wi}.skill">${selOpts(SHIP_DATA.gunSkills, w.skill)}</select></div>
        <div><label>${t('sh_firelinked')}</label>
          <select data-bind="weapons.${wi}.linked" data-type="bool">
            <option value="false" ${!w.linked ? 'selected' : ''}>${t('no')}</option>
            <option value="true" ${w.linked ? 'selected' : ''}>${t('yes')}</option>
          </select></div>
        <div><label>${t('sh_number')}</label>${inputN('weapons.' + wi + '.number', w.number, 'style="width:80px"')}</div>
        <div><label>${t('sh_firecontrol')}</label>${diceCtl('weapons.' + wi + '.fireControl', w.fireControl)}</div>
        <div><label>${t('damage')}</label>${diceCtl('weapons.' + wi + '.damage', w.damage)}</div>
        <div><label>${t('sh_wcrew')}</label>${inputT('weapons.' + wi + '.crew', w.crew, 'style="width:90px"')}</div>
        <div><label>${t('sh_spacerange')}</label>${inputT('weapons.' + wi + '.spaceRange', w.spaceRange, 'placeholder="1-3/12/25"')}</div>
        <div><label>${t('sh_atmrange')}</label>${inputT('weapons.' + wi + '.atmRange', w.atmRange, 'placeholder="100-300/1.2/2.5 km"')}</div>
      </div>
    </div>`).join('');
  return `${C.weapons.length < SHIP_DATA.maxWeapons ? weaponCard()
            : `<p class="hint">${t('sh_wpn_full').replace('{n}', SHIP_DATA.maxWeapons)}</p>`}
    ${rows || `<p class="hint">${t('none_dash')}</p>`}
    ${C.weapons.length < SHIP_DATA.maxWeapons
      ? `<p><button data-act="addWeapon">+ ${t('sh_wpn_blank')}</button></p>` : ''}`;
}

function viewCrew() {
  const sn = C.sensors;
  const sens = [
    ['passive', t('sh_passive')], ['scan', t('sh_scan')],
    ['search', t('sh_search')], ['focus', t('sh_focus')],
  ].map(([k, lab]) => `
    <tr><td>${lab}</td>
      <td>${inputT('sensors.' + k + 'Range', sn[k + 'Range'], 'placeholder="30/0D" style="width:110px"')}</td>
      <td>${diceCtl('sensors.' + k + 'Bonus', sn[k + 'Bonus'])}</td></tr>`).join('');
  const crewRows = SHIP_DATA.crewSkills.map(name => {
    const pips = C.crewSkills[name] || 0;
    return `<tr><td>${esc(skillName(name))}</td><td>${diceCtl('crewSkills.' + name, pips)}</td></tr>`;
  }).join('');
  return `
  <div class="card"><h2>${t('sh_sensors')}</h2>
    <div class="table-scroll"><table class="list">
      <tr><th></th><th>${t('sh_range')}</th><th>${t('sh_bonus')}</th></tr>${sens}</table></div>
  </div>
  <div class="card"><h2>${t('sh_quirks')}</h2>
    <p class="hint">${t('sh_quirk_hint')}</p>
    <textarea data-bind="quirks" rows="5">${esc(C.quirks)}</textarea>
  </div>
  <div class="card"><h2>${t('sh_crewskills')}</h2>
    <div class="table-scroll"><table class="list">
      <tr><th>${t('skill')}</th><th></th></tr>${crewRows}</table></div>
  </div>`;
}

function viewMods() {
  const md = C.mods;
  const i2 = C.info;
  const der = shipDerived();
  const pctSel = (key, list, label) => {
    const opts = [`<option value="">${t('sh_mod_none')}</option>`]
      .concat(list.map(m =>
        `<option ${md[key] === m.label ? 'selected' : ''} value="${esc(m.label)}">${esc(m.label)} · ${t('sh_install')}: ${esc(m.diff)} · ${Math.round(m.costPct * 100)}% · ${t('sh_mishap_col')} +${m.mishap}${m.houseRule ? ' · ' + t('sh_houserule') : ''}</option>`)).join('');
    return `<div><label>${label}</label><select data-bind="mods.${key}" data-rerender="1">${opts}</select></div>`;
  };
  const genRows = SHIP_DATA.generalMods.map(g => {
    const q = md.general[g.name] || 0;
    return `<tr><td>${esc(g.name)}<br><span class="hint">${esc(g.desc)}</span></td>
      <td class="num">${fmtCr(g.cost)}</td><td class="num">${g.weight}</td><td>${esc(g.avail)}</td>
      <td class="num"><input type="number" min="0" data-modqty="general:${esc(g.name)}" value="${q}" style="width:64px"></td></tr>`;
  }).join('');
  const cargoRows = SHIP_DATA.cargoMods.map(g => {
    const q = md.cargo[g.name] || 0;
    return `<tr><td>${esc(g.name)}</td><td class="num">${fmtCr(g.cost)}</td><td class="num">${g.weight}</td>
      <td class="num"><input type="number" min="0" data-modqty="cargo:${esc(g.name)}" value="${q}" style="width:64px"></td></tr>`;
  }).join('');
  const customRows = md.custom.map((cm, i2) => `<tr>
    <td>${inputT('mods.custom.' + i2 + '.name', cm.name)}</td>
    <td>${inputT('mods.custom.' + i2 + '.desc', cm.desc)}</td>
    <td class="num">${inputN('mods.custom.' + i2 + '.cost', cm.cost, 'data-rerender="1" style="width:90px"')}</td>
    <td class="num">${inputN('mods.custom.' + i2 + '.weight', cm.weight, 'data-rerender="1" style="width:70px"')}</td>
    <td><button class="mini danger" data-act="delCustomMod" data-idx="${i2}">×</button></td></tr>`).join('');
  const partSel = (key, list, mk, label, none, classOf) => {
    const opts = [`<option value="">${none}</option>`].concat(list.map(x => {
      /* classOf: nur die Klasse zeigen (z. B. „Space 12" / „x5"), keinen
         Modellnamen – das Modell wäre je Schiffsklasse ohnehin nicht dasselbe. */
      const lbl = classOf ? classOf(x) : (mk === 'rating' ? x.rating : x[mk] + ' (' + (x.maker || '') + ')');
      return `<option ${md[key] === x[mk] ? 'selected' : ''} value="${esc(x[mk])}">${esc(lbl + ' · ' + fmtCr(x.cost) + ' Cr.')}</option>`;
    })).join('');
    return `<div><label>${label}</label><select data-bind="mods.${key}" data-rerender="1">${opts}</select></div>`;
  };
  return `
  <div class="pool-banner">
    <span>${t('sh_cost_mods')}: <b>${fmtCr(der.modCost)}</b> Cr.</span>
    <span>${t('sh_cost_total')}: <b>${fmtCr(der.costTotal)}</b> Cr.</span>
    <span>${t('sh_weight_total')}: <b>${der.weight}</b> t${der.weightFactor !== 1 ? ` <span class="hint">(${t('sh_weight_scale')} ×${der.weightFactor})</span>` : ''}${der.weaponWeight ? ` <span class="hint">· ${t('sh_weapon_weight')} ${der.weaponWeight} t</span>` : ''}</span>
    ${der.cargoBase ? `<span>${t('sh_cargo_left')}: <b class="${der.cargoOver ? 'warn' : ''}">${fmtCargo(der.cargoLeft, der.cargoUnit)}</b> / ${fmtCargo(der.cargoBase, der.cargoUnit)}${der.cargoRule === 'off' ? ' · ' + t('sh_cargo_off_short') : ''}</span>` : ''}
    <span>${t('sh_mishap_total')}: <b>${der.mishap}</b></span>
  </div>
  <div class="card"><h2>${t('sh_mods_pct')}</h2>
    <div class="formgrid">
      ${pctSel('drive', SHIP_DATA.driveMods, t('sh_mod_drive'))}
      ${pctSel('maneuver', SHIP_DATA.maneuverMods, t('sh_mod_maneuver'))}
      ${pctSel('hyper', hyperImproveList(), t('sh_mod_hyper'))}
      ${pctSel('hull', hullShieldList(SHIP_DATA.hullMods), t('sh_mod_hull'))}
      ${pctSel('shield', hullShieldList(SHIP_DATA.shieldMods), t('sh_mod_shield'))}
      ${pctSel('wdmg', SHIP_DATA.weaponDmgMods, t('sh_mod_wdmg'))}
    </div>
    <p class="hint">${t('sh_mishap_hint')}</p>
    <p class="hint">${t('sh_cargo_hint')}</p>
    <div class="formgrid">
      <div><label>${t('sh_cargo_rule')}</label>
        <select data-bind="info.cargoRule" data-rerender="1">
          <option value="auto" ${(i2.cargoRule || 'auto') === 'auto' ? 'selected' : ''}>${t('sh_cargo_auto')}</option>
          <option value="strict" ${i2.cargoRule === 'strict' ? 'selected' : ''}>${t('sh_cargo_strict')}</option>
          <option value="off" ${i2.cargoRule === 'off' ? 'selected' : ''}>${t('sh_cargo_offopt')}</option>
        </select></div>
    </div>
    ${der.cargoNote ? `<p class="hint warnbox">${t('sh_cargo_small_note')}</p>` : ''}
    <p class="hint">${t('sh_houserule_hint')}</p>
  </div>
  <div class="card"><h2>${t('sh_parts')}</h2>
    <div class="formgrid">
      ${partSel('replDrive', SHIP_DATA.replDrives, 'model', t('sh_repl_drive'), t('sh_keep'), x => t('sh_space') + ' ' + x.space)}
      ${partSel('replHyper', SHIP_DATA.replHyper, 'model', t('sh_repl_hyper'), t('sh_keep'), x => x.mult)}
      ${partSel('shieldGen', SHIP_DATA.shieldGens, 'rating', t('sh_shieldgen'), t('sh_keep'))}
      <div><label>${t('sh_buy_backup')}</label>
        <select data-bind="mods.backupHyper" data-type="bool">
          <option value="false" ${!C.mods.backupHyper ? 'selected' : ''}>${t('no')}</option>
          <option value="true" ${C.mods.backupHyper ? 'selected' : ''}>${t('sh_backup_yes')}</option>
        </select></div>
      <div><label>${t('sh_repl_maneuver')}</label>
        <select data-bind="mods.replManeuver" data-rerender="1">
          <option value="" ${!i2.maneuver && !C.mods.replManeuver ? 'selected' : ''}>${t('sh_keep')}</option>
          ${maneuverThrusterOptions(i2).map(o =>
            `<option value="${o.pips}" ${(+C.mods.replManeuver === o.pips) ? 'selected' : ''}>${fmtD(o.pips)} · ${fmtCr(o.cost * der.weightFactor)} Cr.</option>`).join('')}
        </select></div>
    </div>
    <p class="hint">${t('sh_backup_hint')}</p>
    <p class="hint">${t('sh_maneuver_hint')}</p>
    <p class="hint">${t('sh_weight_scale_hint').replace('{f}', der.weightFactor)}</p>
  </div>
  <div class="card"><h2>${t('sh_effective')}</h2>
    <p>
      ${t('sh_hull')}: <span class="dice">${fmtD(der.hull)}</span> &nbsp;
      ${t('sh_shields')}: <span class="dice">${fmtD(der.shields)}</span> &nbsp;
      ${t('sh_maneuver')}: <span class="dice">${fmtD(der.maneuver)}</span> &nbsp;
      ${t('sh_space')}: <span class="dice">${der.space}</span> &nbsp;
      ${t('sh_hyper')}: <span class="dice">${esc(der.hyper || 'None')}</span> &nbsp;
      ${t('sh_hyperbackup')}: <span class="dice">${esc(der.hyperBackup || t('sh_atmo_none'))}</span>
      ${der.wdmgPips ? ` &nbsp; ${t('sh_mod_wdmg')}: <span class="dice">+${fmtD(der.wdmgPips)}</span>` : ''}
      <br>${t('sh_atmo_eff')}: <span class="dice">${der.atmo ? esc(der.atmo) : t('sh_atmo_none')}</span>
    </p>
  </div>
  <div class="card"><h2>${t('sh_mods_general')}</h2>
    <div class="table-scroll"><table class="list">
      <tr><th>${t('item')}</th><th class="num">${t('cost')}</th><th class="num">${t('sh_weight')}</th><th>${t('avail')}</th><th class="num">${t('qty')}</th></tr>
      ${genRows}</table></div>
    <h3>${t('sh_cargo_mods')}</h3>
    <div class="table-scroll"><table class="list">
      <tr><th>${t('item')}</th><th class="num">${t('cost')}</th><th class="num">${t('sh_weight')}</th><th class="num">${t('qty')}</th></tr>
      ${cargoRows}</table></div>
    <h3>${t('sh_custom_mods')}</h3>
    <div class="table-scroll"><table class="list">
      <tr><th>${t('name')}</th><th>${t('sh_effect')}</th><th class="num">${t('cost')}</th><th class="num">${t('sh_weight')}</th><th></th></tr>
      ${customRows}</table></div>
    <p><button class="mini" data-act="addCustomMod">${t('add_entry')}</button></p>
  </div>`;
}

/* ---------------- Druckbogen ---------------- */
function sheetField(lbl, val, span) {
  return `<div class="sp-field" style="grid-column: span ${span || 3}">
    <span class="lbl">${esc(lbl)}</span><span class="val">${esc(val) || '&nbsp;'}</span></div>`;
}
function renderSheet() {
  const i = C.info, der = shipDerived();
  const wRows = C.weapons.map(w => `
    <tr><td>${esc(w.name)}${w.number > 1 ? ' ×' + w.number : ''}${w.linked ? ' (fire-linked)' : ''}</td>
      <td>${esc(w.scale)}</td><td>${esc(w.arc)}</td><td>${esc(w.skill)}</td>
      <td>${fmtD(w.fireControl)}</td><td>${fmtD((+w.damage || 0) + der.wdmgPips)}</td>
      <td>${esc(w.spaceRange)}</td><td>${esc(w.atmRange)}</td></tr>`).join('');
  const modList = [];
  for (const [key, list, label] of [
    ['drive', SHIP_DATA.driveMods, t('sh_mod_drive')], ['maneuver', SHIP_DATA.maneuverMods, t('sh_mod_maneuver')],
    ['hyper', hyperImproveList(), t('sh_mod_hyper')], ['hull', hullShieldList(SHIP_DATA.hullMods), t('sh_mod_hull')],
    ['shield', hullShieldList(SHIP_DATA.shieldMods), t('sh_mod_shield')], ['wdmg', SHIP_DATA.weaponDmgMods, t('sh_mod_wdmg')],
  ]) {
    if (C.mods[key]) modList.push(`${label}: ${C.mods[key]}`);
  }
  if (C.mods.replDrive) modList.push(`${t('sh_repl_drive')}: ${C.mods.replDrive}`);
  if (C.mods.replHyper) modList.push(`${t('sh_repl_hyper')}: ${C.mods.replHyper}`);
  if (C.mods.shieldGen) modList.push(`${t('sh_shieldgen')}: ${C.mods.shieldGen}`);
  for (const [n, q] of Object.entries(C.mods.general)) if (q > 0) modList.push(n + (q > 1 ? ' ×' + q : ''));
  for (const [n, q] of Object.entries(C.mods.cargo)) if (q > 0) modList.push(n + (q > 1 ? ' ×' + q : ''));
  C.mods.custom.forEach(cm => { if (cm.name) modList.push(cm.name); });
  const crewRows = SHIP_DATA.crewSkills.filter(n => (C.crewSkills[n] || 0) > 0)
    .map(n => `<div class="sp-skill"><span>${esc(skillName(n))}</span><span class="d">${fmtD(C.crewSkills[n])}</span></div>`).join('');

  const html = `
  <div class="sheet-page">
    <div class="sp-header"><div class="sw">STAR WARS</div><div class="st">${t('sheet_title_ship')}</div></div>
    ${typeof roundStampHtml === 'function' ? roundStampHtml() : ''}
    <div style="display:flex; gap:3mm; align-items:stretch">
    <div class="sp-grid" style="flex:1; align-content:start">
      ${sheetField(t('sh_shipname'), i.name, 6)}
      ${sheetField(t('sh_owner'), i.owner, 6)}
      ${sheetField(t('sh_craft'), i.craft, 6)}
      ${sheetField(t('sh_type'), i.type, 6)}
      ${sheetField(t('sh_scale'), i.scale, 3)}
      ${sheetField(t('sh_length'), i.length ? i.length + ' m' : '', 3)}
      ${sheetField(t('sh_skill'), i.skill + (i.skillSpec ? ': ' + i.skillSpec : ''), 6)}
      ${sheetField(t('sh_crew'), i.crew, 3)}
      ${sheetField(t('sh_passengers'), i.passengers, 3)}
      ${sheetField(t('sh_cargo'), der.cargoBase && der.weight && der.cargoRule !== 'off'
        ? `${fmtCargo(der.cargoLeft, der.cargoUnit)} ${t('sh_cargo_of')} ${fmtCargo(der.cargoBase, der.cargoUnit)} (${t('sh_cargo_used')} ${der.weight} t)`
        : i.cargo, 3)}
      ${sheetField(t('sh_consumables'), i.consumables, 3)}
      ${sheetField(t('sh_nav'), i.nav ? t('yes') : t('no'), 3)}
      ${sheetField(t('sh_cover'), i.cover, 3)}
      ${sheetField(t('sh_altitude'), i.altitude, 3)}
      ${sheetField(t('sh_mishap_total'), String(der.mishap), 3)}
    </div>
    <div class="sp-portrait">
      ${i.portrait ? `<img src="${i.portrait}" alt="">` : `<span>${t('sh_portrait')}</span>`}
    </div>
    </div>
    <div class="sp-box"><h4>${t('sh_stats')} – ${t('sh_effective')}</h4>
      <div style="display:flex; gap:14px; justify-content:space-around; flex-wrap:wrap">
        <div class="sp-stat"><span class="big">${fmtD(der.hull)}</span><span class="lbl">${t('sh_hull')}</span></div>
        <div class="sp-stat"><span class="big">${fmtD(der.shields)}</span><span class="lbl">${t('sh_shields')}</span></div>
        <div class="sp-stat"><span class="big">${fmtD(der.maneuver)}</span><span class="lbl">${t('sh_maneuver')}</span></div>
        <div class="sp-stat"><span class="big">${der.space}</span><span class="lbl">Space</span></div>
        <div class="sp-stat"><span class="big">${esc(der.hyper || '–')}</span><span class="lbl">${t('sh_hyper')}</span></div>
        <div class="sp-stat"><span class="big">${esc(der.hyperBackup || '–')}</span><span class="lbl">${t('sh_hyperbackup')}</span></div>
        <div class="sp-stat"><span class="big">${fmtCr(der.costTotal)}</span><span class="lbl">${t('sh_cost_total')}</span></div>
      </div>
      <div style="font-size:8pt; margin-top:3px">${t('sh_atmo_eff')}: ${der.atmo ? esc(der.atmo) : t('sh_atmo_none')}</div>
    </div>
    <div class="sp-box"><h4>${t('tab_weapons')}</h4>
      <table class="sp-table">
        <tr><th>${t('sh_weapon')}</th><th>${t('sh_scale')}</th><th>${t('sh_firearc')}</th><th>${t('skill')}</th><th>${t('sh_firecontrol')}</th><th>${t('damage')}</th><th>${t('sh_spacerange')}</th><th>${t('sh_atmrange')}</th></tr>
        ${wRows || '<tr><td colspan="8">–</td></tr>'}
      </table></div>
    <div class="sp-cols2">
      <div class="sp-box"><h4>${t('sh_sensors')}</h4>
        <table class="sp-table">
          <tr><th></th><th>${t('sh_range')}</th><th>${t('sh_bonus')}</th></tr>
          <tr><td>${t('sh_passive')}</td><td>${esc(C.sensors.passiveRange)}</td><td>${fmtD(C.sensors.passiveBonus)}</td></tr>
          <tr><td>${t('sh_scan')}</td><td>${esc(C.sensors.scanRange)}</td><td>${fmtD(C.sensors.scanBonus)}</td></tr>
          <tr><td>${t('sh_search')}</td><td>${esc(C.sensors.searchRange)}</td><td>${fmtD(C.sensors.searchBonus)}</td></tr>
          <tr><td>${t('sh_focus')}</td><td>${esc(C.sensors.focusRange)}</td><td>${fmtD(C.sensors.focusBonus)}</td></tr>
        </table></div>
      <div class="sp-box"><h4>${t('sh_quirks')}</h4>
        <div class="sp-lines" style="min-height:20mm">${esc(C.quirks)}</div></div>
    </div>
    <div class="sp-cols2">
      <div class="sp-box"><h4>${t('tab_mods')}</h4>
        <div style="font-size:8.4pt">${modList.length ? modList.map(esc).join('<br>') : '–'}</div></div>
      <div class="sp-box"><h4>${t('sh_crewskills')}</h4>
        ${crewRows || '<div style="font-size:8.4pt">–</div>'}
        <div style="font-size:7.6pt; margin-top:4px; border-top:.6px solid #999; padding-top:2px">
          ${t('sh_fees')}: ${t('sh_fees_text')}</div></div>
    </div>
    ${C.info.notes ? `<div class="sp-box"><h4>${t('notes')}</h4><div class="sp-lines" style="min-height:10mm">${esc(C.info.notes)}</div></div>` : ''}
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
/* ================= Werkstatt: erweiterte Regeln aus Galaxy Guide 6 =========
   Reiner Nachschlage- und Rechenbereich. Nichts davon wandert ins Dokument,
   deshalb steht der Zustand hier und nicht in C. */
const WS = {
  system: 'drive', extra: 0, result: null,
  port: 'standard', baseFee: 10, days: 1, people: 0, dockDays: 1,
};

function firstInt(s) { const m = /(\d+)/.exec(String(s == null ? '' : s)); return m ? +m[1] : 0; }

/* Crew + Passagiere aus den Freitextfeldern schätzen ("4; skeleton 2/+5" → 4) */
function wsPeopleDefault() {
  return firstInt(C.info.crew) + firstInt(C.info.passengers);
}

function wsSeverity(total) {
  for (const s of TRAMP_RULES.severity) if (total <= s.max) return s.key;
  return 'catastrophic';
}

function rollMishap() {
  const die = 1 + Math.floor(Math.random() * 6);
  const total = die + (+WS.extra || 0);
  /* "A roll of 1 always counts as a minor mishap" – der Modifikator zählt
     dann nicht, sonst wäre die Zusicherung der Quelle wirkungslos. */
  const sev = die === 1 ? 'minor' : wsSeverity(total);
  const list = TRAMP_RULES.mishaps[WS.system][sev];
  const idx = Math.floor(Math.random() * 6);
  WS.result = { die, total, sev, text: list[idx], resultRoll: idx + 1 };
  update('shop');
}

function viewWorkshop() {
  const lang = LANG === 'de' ? 'de' : 'en';
  const cost = +C.info.costNew || 0;
  const der = shipDerived();
  if (WS.people === 0) WS.people = wsPeopleDefault();

  /* --- Pannen-Würfel --- */
  const sysOpts = TRAMP_RULES.systems.map(s =>
    `<option ${WS.system === s.key ? 'selected' : ''} value="${s.key}">${esc(s[lang])}</option>`).join('');
  const r = WS.result;
  const sevLabel = { minor: t('ws_sev_minor'), moderate: t('ws_sev_moderate'),
                     catastrophic: t('ws_sev_catastrophic') };
  const resultBlock = !r ? '' : `
    <div class="ws-result ws-${r.sev}">
      <div class="ws-result-head">
        <span>${t('ws_result_roll')}: <b>${r.die}</b></span>
        <span>${t('ws_result_total')}: <b>${r.total}</b></span>
        <span>${t('ws_result_sev')}: <b>${sevLabel[r.sev]}</b></span>
        <span>1D: <b>${r.resultRoll}</b></span>
      </div>
      <p>${esc(r.text)}</p>
    </div>`;

  /* --- Reparaturkosten --- */
  const repairBlocks = Object.values(TRAMP_RULES.repairs).map(grp => {
    const rows = grp.rows.map(row => {
      const cr = grp.ofWeapon || !row.pct ? '–'
               : fmtCr(Math.round(cost * row.pct)) + ' Cr.';
      return `<tr><td>${esc(row.label)}</td><td>${esc(row.diff)}</td>
        <td class="num">${row.pct ? Math.round(row.pct * 100) + ' %' : '–'}</td>
        <td class="num">${cr}</td></tr>`;
    }).join('');
    return `<h3>${esc(lang === 'de' ? grp.deName : grp.enName)}${grp.ofWeapon ? ` <span class="hint">(${t('ws_of_weapon')})</span>` : ''}</h3>
      <div class="table-scroll"><table class="list">
        <tr><th>${t('ws_damage')}</th><th>${t('ws_diff')}</th><th>${t('ws_pct')}</th><th>${t('ws_credits')}</th></tr>
        ${rows}</table></div>`;
  }).join('');

  /* --- Raumhäfen und laufende Kosten --- */
  const portOpts = TRAMP_RULES.spaceports.map(p =>
    `<option ${WS.port === p.key ? 'selected' : ''} value="${p.key}">${esc(p[lang].name)}</option>`).join('');
  const port = TRAMP_RULES.spaceports.find(p => p.key === WS.port) || TRAMP_RULES.spaceports[2];
  const restock = (+WS.baseFee || 0) * (+WS.people || 0) * (+WS.days || 0);
  const docking = port.docking * (+WS.dockDays || 0);
  const rn = TRAMP_RULES.running;

  const timeRows = TRAMP_RULES.installTime.map(x =>
    `<tr><td>${esc(x.diff)}</td><td>${esc(x.time)}</td></tr>`).join('');

  const ec = TRAMP_RULES.economics;
  const linkRows = TRAMP_RULES.linked.map(l =>
    `<tr><td>${l.count} ${t('ws_weapons_linked')}</td><td>${l.bonus}</td>
     <td class="num">${fmtCr(l.count * ec.linkCostPerWeapon)} Cr.</td></tr>`).join('');

  return `
  <p class="hint">${t('ws_intro')}</p>

  <div class="card"><h2>${t('ws_mishap')}</h2>
    <p class="hint">${t('ws_mishap_when')} ${t('ws_sev_note')}</p>
    <div class="formgrid">
      <div><label>${t('ws_system')}</label><select data-ws="system">${sysOpts}</select></div>
      <div><label>${t('ws_modifier')}</label>
        <input type="number" data-ws="extra" value="${WS.extra}" style="width:90px">
        <span class="hint">${t('sh_mishap_total')}: ${der.mishap}</span></div>
      <div><label>&nbsp;</label><button class="accent" data-act="rollMishap">${t('ws_roll')}</button></div>
    </div>
    ${resultBlock}
  </div>

  <div class="card"><h2>${t('ws_costs')}</h2>
    <div class="formgrid">
      <div><label>${t('ws_ports')}</label><select data-ws="port">${portOpts}</select></div>
      <div><label>${t('ws_dockdays')}</label><input type="number" min="0" data-ws="dockDays" value="${WS.dockDays}" style="width:80px"></div>
    </div>
    <p class="hint">${esc(port[lang].desc)}</p>
    <p>${t('ws_docking')}: <b>${port.docking ? fmtCr(port.docking) + ' Cr. ' + t('ws_per_day') : t('ws_none_listed')}</b>
       ${port.docking ? ` &nbsp;→&nbsp; ${t('ws_sum')}: <b>${fmtCr(docking)} Cr.</b>` : ''}</p>

    <h3>${t('ws_restock')}</h3>
    <p class="hint">${t('sh_fees_text')} · ${t('ws_basefee_hint')}</p>
    <div class="formgrid">
      <div><label>${t('ws_basefee')}</label><input type="number" min="0" data-ws="baseFee" value="${WS.baseFee}" style="width:80px"></div>
      <div><label>${t('ws_people')}</label><input type="number" min="0" data-ws="people" value="${WS.people}" style="width:80px"></div>
      <div><label>${t('ws_days')}</label><input type="number" min="0" data-ws="days" value="${WS.days}" style="width:80px"></div>
    </div>
    <p>${t('ws_sum')}: <b>${fmtCr(restock)} Cr.</b></p>

    <h3>${t('ws_overhaul')}</h3>
    <p class="hint">${t('ws_overhaul_hint')}</p>
    <p>${fmtCr(rn.overhaulAvg)}–${fmtCr(rn.overhaulHeavy)} Cr. · ${t('ws_sh_bay')}: ${fmtCr(rn.repairBayPerDay)} Cr. ${t('ws_per_day')}</p>
  </div>

  <div class="card"><h2>${t('ws_repairs')}</h2>
    <p class="hint">${t('ws_repairs_hint')}</p>
    ${repairBlocks}
  </div>

  <div class="card"><h2>${t('ws_times')}</h2>
    <p class="hint">${t('ws_times_hint')}</p>
    <div class="table-scroll"><table class="list">
      <tr><th>${t('ws_diff')}</th><th>${t('ws_time')}</th></tr>${timeRows}</table></div>
  </div>

  <div class="card"><h2>${t('ws_link')}</h2>
    <p class="hint">${t('ws_link_hint')}</p>
    <div class="table-scroll"><table class="list">
      <tr><th>${t('ws_weapons_linked')}</th><th>${t('ws_bonus')}</th><th>${t('ws_credits')}</th></tr>
      ${linkRows}</table></div>
  </div>

  <div class="card"><h2>${t('ws_rules')}</h2>
    <ul class="hint">
      <li>${t('ws_rule_used')}</li>
      <li>${t('ws_rule_resale')}</li>
      <li>${t('ws_rule_labor')}</li>
      <li>${t('ws_rule_permit')}</li>
      <li>${t('ws_rule_nav')}</li>
    </ul>
    <p class="hint">${t('ws_source')}: ${esc(TRAMP_RULES.source)}</p>
  </div>`;
}

function renderTab(tab) {
  const el = document.getElementById('tab-' + tab);
  if (!el) return;
  switch (tab) {
    case 'ship': el.innerHTML = viewShip(); break;
    case 'weapons': el.innerHTML = viewWeapons(); break;
    case 'crew': el.innerHTML = viewCrew(); break;
    case 'mods': el.innerHTML = viewMods(); break;
    case 'shop': el.innerHTML = viewWorkshop(); break;
    case 'sheet': renderSheet(); break;
  }
}
function pageAction(el) {
  switch (el.dataset.act) {
    case 'applyTemplate': applyTemplate(); break;
    case 'addWeapon':
      if (C.weapons.length < SHIP_DATA.maxWeapons) C.weapons.push(emptyWeapon());
      wpnMsg = '';
      update(); break;
    case 'addFromCatalog': addWeaponFromCatalog(); break;
    case 'delWeapon':
      C.weapons.splice(+el.dataset.idx, 1);
      update(); break;
    case 'addCustomMod':
      C.mods.custom.push({ name: '', desc: '', cost: 0, weight: 0 });
      update(); break;
    case 'delCustomMod':
      C.mods.custom.splice(+el.dataset.idx, 1);
      update(); break;
    case 'rollMishap': rollMishap(); break;
  }
}
function pageChange(el) {
  /* Werkstatt-Felder gehören nicht ins Dokument – nur neu zeichnen,
     nicht speichern. */
  if (el.dataset.ws) {
    const k = el.dataset.ws;
    WS[k] = (el.type === 'number') ? (+el.value || 0) : el.value;
    if (k === 'system') WS.result = null;   // Ergebnis passt sonst nicht zum System
    update('shop');
    const again = document.querySelector(`[data-ws="${k}"]`);
    if (again && el.type === 'number') { again.focus(); again.select(); }
    return true;
  }
  if (el.id === 'wpnSearch' || el.id === 'wpnScale') {
    if (el.id === 'wpnSearch') wpnFilter = el.value; else wpnScale = el.value;
    wpnMsg = '';
    update('weapons');
    const again = document.getElementById(el.id);
    if (again && el.id === 'wpnSearch') {
      again.focus();
      again.setSelectionRange(again.value.length, again.value.length);
    }
    return true;
  }
  if (el.id === 'tplEra') {
    tplEra = el.value;
    tplMsg = '';
    update('ship');
    return true;
  }
  if (el.id === 'tplSearch') {
    tplFilter = el.value;
    tplMsg = '';
    update('ship');
    const s = document.getElementById('tplSearch');
    if (s) { s.focus(); s.setSelectionRange(s.value.length, s.value.length); }
    return true;
  }
  if (el.dataset.dice) {
    const path = el.dataset.dice;
    const wrap = el.closest('.dicectl');
    const dEl = wrap.querySelector('[data-part="d"]');
    const pEl = wrap.querySelector('[data-part="p"]');
    const pips = Math.max(0, (+dEl.value || 0)) * 3 + Math.min(2, Math.max(0, (+pEl.value || 0)));
    /* Skill-Namen können Punkte enthalten ("Ground vehicle Op.") –
       deshalb hier ohne Pfad-Splitting zuweisen. */
    if (path.startsWith('crewSkills.')) {
      const name = path.slice('crewSkills.'.length);
      if (pips) C.crewSkills[name] = pips; else delete C.crewSkills[name];
    } else {
      setPath(C, path, pips);
    }
    update();
    return true;
  }
  if (el.dataset.modqty != null) {
    const [group, name] = el.dataset.modqty.split(/:(.+)/);
    const q = Math.max(0, +el.value || 0);
    if (q) C.mods[group][name] = q; else delete C.mods[group][name];
    update();
    return true;
  }
  return false;
}

document.addEventListener('DOMContentLoaded', () => initPage('ship'));
