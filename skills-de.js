/* ===========================================================================
   German skill names
   ---------------------------------------------------------------------------
   Based on the German edition "Krieg der Sterne - Das Rollenspiel" (West End
   Games, in German from Welt der Spiele). The names come from a character
   sheet of that edition:
   https://der-eisenhofer.de/wp-content/uploads/2012/12/star-wars-d6-charakterbogen.pdf

   That sheet covers 62 of the 84 skills word for word. What is missing there
   - above all the fanned-out repair skills, which the sheet collapses into a
   single "Reparatur" - is built from the same sheet's vocabulary (vehicle
   names like "Kampfläufer", "Raumtransporter" and "Repulsoraggregate" do
   appear on it). Those derived entries are marked  // derived  below.

   IMPORTANT: these are display names only. Storage and arithmetic still use
   the English terms - so a character stays interchangeable between the two
   languages, and the catalogues from the rulebooks (which name English
   skills) still line up with it.

   Proper nouns and terms already naturalised in German stay as they are:
   Blaster is Blaster, Astrogation is Astrogation.
   =========================================================================== */

const SKILLS_DE = {

  /* ---------------- Dexterity ---------------- */
  /* Added from REUP; the German edition does not have them, so they are
     built from the same sheet's vocabulary. */
  'Acrobatics': 'Akrobatik',                  // from REUP
  'Archaic Guns': 'Archaische Schusswaffen',
  'Blaster': 'Blaster',
  'Artillery': 'Artillerie',                  // from REUP
  'Blaster Artillery': 'Artillerieblaster',
  'Bowcaster': 'Bolzenschleuder',
  'Bows': 'Bogen',
  'Brawling Parry': 'Abblocken',
  'Dodge': 'Ausweichen',
  'Firearms': 'Schusswaffen',
  'Flamethrower': 'Flammenwerfer',            // from REUP
  'Grenade': 'Granaten',
  'Lightsaber': 'Laserschwert',
  'Melee Combat': 'Nahkampfwaffen',
  'Melee Parry': 'Parieren',
  'Missile Weapons': 'Raketenwaffen',
  'Pick Pockets': 'Taschendiebstahl',
  'Running': 'Laufen',
  'Thrown Weapons': 'Wurfwaffen',
  'Vehicle Blasters': 'Fahrzeugblaster',

  /* ---------------- Knowledge ---------------- */
  'Alien Species': 'Aliens',
  'Bureaucracy': 'Bürokratie',
  'Business': 'Geschäfte',
  'Cultures': 'Kulturen',
  'Intimidation': 'Einschüchtern',
  'Languages': 'Fremdsprache',
  'Law Enforcement': 'Gesetzeskenntnisse',
  'Planetary Systems': 'Planetensysteme',
  'Scholar': 'Gelehrsamkeit',            // derived
  'Streetwise': 'Gassenwissen',
  'Survival': 'Überleben',
  'Tactics': 'Taktik',                   // derived
  'Value': 'Schätzen',
  'Willpower': 'Willenskraft',

  /* ---------------- Mechanical ---------------- */
  'Archaic Starship Pilot.': 'Archaische Raumschiffe',
  'Aquatic Vehicle Op.': 'Wasserfahrzeuge',   // from REUP
  'Astrogation': 'Astrogation',
  'Beast Riding': 'Reiten',
  'Capital Ship Gun.': 'Großkampfschiff-Artillerie',   // book: „Sternenschiffartillerie“
  'Capital Ship Piloting': 'Großkampfschiffe',         // book: „Sternenschiffe“
  'Capital Ship Shields': 'Großkampfschiff-Deflektoren', // book: „Sternenschiffdeflektoren“
  'Communications': 'Kommunikation',
  'Ground Vehicle Op.': 'Bodenfahrzeuge',
  'Hover Vehicle Op.': 'Schweber',
  'Jet Pack Operation': 'Jetpack',            // derived
  'Powersuit Operation': 'Exoskelett',
  'Repulsorlift Op.': 'Repulsoraggregate',
  'Rocket Pack Op.': 'Raketenrucksack',       // derived
  'Sensors': 'Sensoren',
  'Space Transport': 'Raumtransporter',
  'Starfighter Piloting': 'Raumjäger',
  'Starship Gunnery': 'Raumjägerartillerie',
  'Starship Shields': 'Raumjägerdeflektoren',
  'Submersible Vehicle Op.': 'Tauchboote',    // from REUP
  'Swoop Operation': 'Blitzjäger',
  'Walker Operation': 'Kampfläufer',

  /* ---------------- Perception ---------------- */
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

  /* ---------------- Strength ---------------- */
  'Brawling': 'Raufen',
  'Climbing / Jumping': 'Klettern / Springen',
  'Lifting': 'Heben',
  'Stamina': 'Ausdauer',
  'Swimming': 'Schwimmen',

  /* ---------------- Technical ----------------
     The German sheet carries a single "Reparatur". The app fans it out the
     way the English original does, so the entries here follow the pattern
     <device>-Reparatur. */
  'Armor Repair': 'Panzerungs-Reparatur',              // derived
  'Aquatic Vehicle Rep.': 'Wasserfahrzeug-Reparatur',  // from REUP
  'Blaster Repair': 'Blaster-Reparatur',               // derived
  'Capital Ship Repair': 'Großkampfschiff-Reparatur',  // derived
  'Capital Ship Weap. Rep.': 'Großkampfschiffwaffen-Reparatur',  // derived
  'Computer Prog. / Rep.': 'Computerprogrammierung/-reparatur',
  'Demolition': 'Sprengtechnik',
  'Droid Prog.': 'Droidenprogrammierung',
  'Droid Repair': 'Droiden-Reparatur',                 // derived
  'First Aid': 'Erste Hilfe',
  'Ground Vehicle Rep.': 'Bodenfahrzeug-Reparatur',    // derived
  'Lightsaber Repair': 'Laserschwert-Reparatur',       // derived
  'Melee Repair': 'Nahkampfwaffen-Reparatur',          // derived
  'Repulsorlift Repair': 'Repulsor-Reparatur',         // derived
  'Security': 'Sicherheitssysteme',
  'Space Transport Rep.': 'Raumtransporter-Reparatur', // derived
  'Starfighter Repair': 'Raumjäger-Reparatur',         // derived
  'Starship Weapon Rep.': 'Raumschiffwaffen-Reparatur',// derived
  'Walker Repair': 'Kampfläufer-Reparatur',            // derived

  /* ---------------- further skills used by the generators ---------------
     The droid and ship generators carry a few names in spellings of their
     own; covered here as well, so they get translated there too. */
  'Medicine': 'Medizin',
  'Repair': 'Reparatur',
  'Computer Programming': 'Computerprogrammierung',
  'Capital Ship Gunnery': 'Großkampfschiff-Artillerie',
  'Space Transports': 'Raumtransporter',
  /* The Excel templates abbreviate inconsistently - the same skill is
     "Archaic Starship Pilot." on the character sheet and "Archaic Starship
     Piloting" in the ship's crew. Cover both spellings. */
  'Archaic Starship Piloting': 'Archaische Raumschiffe',
  'Ground vehicle Op.': 'Bodenfahrzeuge',
  '(A) Pod Racer Operation': 'Podrennen',     // from REUP
  'Repulsorlift Operation': 'Repulsoraggregate',
};

/* Display name of a skill. For names it does not know - a freely typed
   specialisation, say - the original text stays.

   The rules write specialisations as "Blaster: blaster rifle"; the part
   before the colon is the base skill and is translated along with it, while
   the freely chosen rest stays exactly as it was typed. */
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

/* For sheets and lists that should carry the English rules term alongside -
   which keeps a character sheet readable at an English table too. */
function skillNameBoth(en) {
  const de = skillName(en);
  return de === en ? en : de + ' (' + en + ')';
}
