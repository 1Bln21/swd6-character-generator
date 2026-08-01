/* ===========================================================================
   Deutsche Fertigkeitsnamen
   ---------------------------------------------------------------------------
   Grundlage ist die deutsche Ausgabe "Krieg der Sterne – Das Rollenspiel"
   (West End Games, deutsch bei Welt der Spiele). Die Namen stammen aus einem
   Charakterbogen der deutschen Ausgabe:
   https://der-eisenhofer.de/wp-content/uploads/2012/12/star-wars-d6-charakterbogen.pdf

   Der Bogen deckt 62 der 84 Fertigkeiten wörtlich ab. Was dort fehlt – vor
   allem die aufgefächerten Reparatur-Fertigkeiten, die der Bogen zu einem
   einzigen "Reparatur" zusammenzieht – ist mit der Wortwahl desselben Bogens
   gebildet (Fahrzeugnamen wie "Kampfläufer", "Raumtransporter",
   "Repulsoraggregate" stehen dort). Diese abgeleiteten Einträge sind unten
   mit  // abgeleitet  gekennzeichnet.

   WICHTIG: Das sind reine Anzeigenamen. Gespeichert und gerechnet wird
   weiterhin mit den englischen Bezeichnungen – ein Charakter bleibt also
   zwischen beiden Sprachen austauschbar, und die Kataloge aus den
   Regelwerken (die englische Skill-Namen nennen) passen weiterhin dazu.

   Eigennamen und eingedeutschte Begriffe bleiben, wie sie sind: Blaster
   heißt Blaster, Astrogation heißt Astrogation.
   =========================================================================== */

const SKILLS_DE = {

  /* ---------------- Geschicklichkeit ---------------- */
  'Archaic Guns': 'Archaische Schusswaffen',
  'Blaster': 'Blaster',
  'Blaster Artillery': 'Artillerieblaster',
  'Bowcaster': 'Bolzenschleuder',
  'Bows': 'Bogen',
  'Brawling Parry': 'Abblocken',
  'Dodge': 'Ausweichen',
  'Firearms': 'Schusswaffen',
  'Grenade': 'Granaten',
  'Lightsaber': 'Laserschwert',
  'Melee Combat': 'Nahkampfwaffen',
  'Melee Parry': 'Parieren',
  'Missile Weapons': 'Raketenwaffen',
  'Pick Pockets': 'Taschendiebstahl',
  'Running': 'Laufen',
  'Thrown Weapons': 'Wurfwaffen',
  'Vehicle Blasters': 'Fahrzeugblaster',

  /* ---------------- Wissen ---------------- */
  'Alien Species': 'Aliens',
  'Bureaucracy': 'Bürokratie',
  'Business': 'Geschäfte',
  'Cultures': 'Kulturen',
  'Intimidation': 'Einschüchtern',
  'Languages': 'Fremdsprache',
  'Law Enforcement': 'Gesetzeskenntnisse',
  'Planetary Systems': 'Planetensysteme',
  'Scholar': 'Gelehrsamkeit',            // abgeleitet
  'Streetwise': 'Gassenwissen',
  'Survival': 'Überleben',
  'Tactics': 'Taktik',                   // abgeleitet
  'Value': 'Schätzen',
  'Willpower': 'Willenskraft',

  /* ---------------- Mechanik ---------------- */
  'Archaic Starship Pilot.': 'Archaische Raumschiffe',
  'Astrogation': 'Astrogation',
  'Beast Riding': 'Reiten',
  'Capital Ship Gun.': 'Großkampfschiff-Artillerie',   // Buch: „Sternenschiffartillerie“
  'Capital Ship Piloting': 'Großkampfschiffe',         // Buch: „Sternenschiffe“
  'Capital Ship Shields': 'Großkampfschiff-Deflektoren', // Buch: „Sternenschiffdeflektoren“
  'Communications': 'Kommunikation',
  'Ground Vehicle Op.': 'Bodenfahrzeuge',
  'Hover Vehicle Op.': 'Schweber',
  'Jet Pack Operation': 'Jetpack',            // abgeleitet
  'Powersuit Operation': 'Exoskelett',
  'Repulsorlift Op.': 'Repulsoraggregate',
  'Rocket Pack Op.': 'Raketenrucksack',       // abgeleitet
  'Sensors': 'Sensoren',
  'Space Transport': 'Raumtransporter',
  'Starfighter Piloting': 'Raumjäger',
  'Starship Gunnery': 'Raumjägerartillerie',
  'Starship Shields': 'Raumjägerdeflektoren',
  'Swoop Operation': 'Blitzjäger',
  'Walker Operation': 'Kampfläufer',

  /* ---------------- Wahrnehmung ---------------- */
  'Bargain': 'Feilschen',
  'Command': 'Kommandieren',
  'Con': 'Betrügen',
  'Forgery': 'Fälschen',
  'Gambling': 'Glücksspiel',
  'Hide': 'Verbergen',
  'Investigation': 'Nachforschen',
  'Persuasion': 'Überreden',
  'Search': 'Suchen',
  'Sneak': 'Schleichen',

  /* ---------------- Stärke ---------------- */
  'Brawling': 'Raufen',
  'Climbing / Jumping': 'Klettern / Springen',
  'Lifting': 'Heben',
  'Stamina': 'Ausdauer',
  'Swimming': 'Schwimmen',

  /* ---------------- Technik ----------------
     Der deutsche Bogen führt nur ein einziges "Reparatur". Die App fächert
     es wie das englische Original auf, deshalb hier nach dem Muster
     <Gerät>-Reparatur gebildet. */
  'Armor Repair': 'Panzerungs-Reparatur',              // abgeleitet
  'Blaster Repair': 'Blaster-Reparatur',               // abgeleitet
  'Capital Ship Repair': 'Großkampfschiff-Reparatur',  // abgeleitet
  'Capital Ship Weap. Rep.': 'Großkampfschiffwaffen-Reparatur',  // abgeleitet
  'Computer Prog. / Rep.': 'Computerprogrammierung/-reparatur',
  'Demolition': 'Sprengtechnik',
  'Droid Prog.': 'Droidenprogrammierung',
  'Droid Repair': 'Droiden-Reparatur',                 // abgeleitet
  'First Aid': 'Erste Hilfe',
  'Ground Vehicle Rep.': 'Bodenfahrzeug-Reparatur',    // abgeleitet
  'Lightsaber Repair': 'Laserschwert-Reparatur',       // abgeleitet
  'Melee Repair': 'Nahkampfwaffen-Reparatur',          // abgeleitet
  'Repulsorlift Repair': 'Repulsor-Reparatur',         // abgeleitet
  'Security': 'Sicherheitssysteme',
  'Space Transport Rep.': 'Raumtransporter-Reparatur', // abgeleitet
  'Starfighter Repair': 'Raumjäger-Reparatur',         // abgeleitet
  'Starship Weapon Rep.': 'Raumschiffwaffen-Reparatur',// abgeleitet
  'Walker Repair': 'Kampfläufer-Reparatur',            // abgeleitet

  /* ---------------- Weitere Fertigkeiten der Generatoren ----------------
     Der Droiden- und der Schiffsgenerator führen einige Namen in eigener
     Schreibweise; hier mit abgedeckt, damit auch dort übersetzt wird. */
  'Medicine': 'Medizin',
  'Repair': 'Reparatur',
  'Computer Programming': 'Computerprogrammierung',
  'Capital Ship Gunnery': 'Großkampfschiff-Artillerie',
  'Space Transports': 'Raumtransporter',
  /* Die Excel-Vorlagen kürzen unterschiedlich ab – dieselbe Fertigkeit
     heißt im Charakterbogen "Archaic Starship Pilot.", in der Schiffs-Crew
     "Archaic Starship Piloting". Beide Schreibweisen abdecken. */
  'Archaic Starship Piloting': 'Archaische Raumschiffe',
  'Ground vehicle Op.': 'Bodenfahrzeuge',
  'Repulsorlift Operation': 'Repulsoraggregate',
};

/* Anzeigename einer Fertigkeit. Bei unbekannten Namen – etwa einer frei
   eingetragenen Spezialisierung – bleibt der Originaltext stehen.

   Spezialisierungen schreibt das Regelwerk als "Blaster: Blastergewehr";
   der Teil vor dem Doppelpunkt ist die Grundfertigkeit und wird mit
   übersetzt, der frei gewählte Rest bleibt, wie er eingetragen wurde. */
function skillName(en) {
  if (typeof LANG === 'undefined' || LANG !== 'de') return en;
  if (SKILLS_DE[en]) return SKILLS_DE[en];
  const i = en.indexOf(':');
  if (i > 0) {
    const base = SKILLS_DE[en.slice(0, i).trim()];
    if (base) return base + ':' + en.slice(i + 1);
  }
  return en;
}

/* Für Bögen und Listen, in denen der englische Regelbegriff daneben stehen
   soll – so bleibt ein Charakterbogen auch am englischen Spieltisch lesbar. */
function skillNameBoth(en) {
  const de = skillName(en);
  return de === en ? en : de + ' (' + en + ')';
}
