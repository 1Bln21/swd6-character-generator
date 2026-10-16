/* ===========================================================================
   What a skill or a Force power actually does - one sentence each.
   ---------------------------------------------------------------------------
   The sheet names a skill and the dice behind it, and that is all. Anybody
   who does not have the rulebook open beside them is left guessing what
   "Hover Vehicle Op." covers that "Repulsorlift Op." does not, or what
   "Shift Sense" is good for. These lines answer exactly that question and
   nothing else: what the skill or power does. No difficulties, no modifiers,
   no page-long rules - those stay in the book, where they belong.

   The texts are written here, not copied: they are summaries of the entries
   in the rulebooks (REUP for the skills and most powers, the Old Republic
   guide and the fan Force compendium for the rest). Three powers have no
   rules text in any of those - Doppelganger, Force Blast and Repulse - and
   their lines say what the power is known to do, which is all anyone has.

   Keyed by the ENGLISH name, exactly as data.js spells it, including the
   abbreviations the character sheet uses ("Capital Ship Weap. Rep."). The
   German display name is irrelevant here - storage and lookup stay English,
   like everything else in this app.

   Used by the character generator on the skills and Force tabs, and by the
   NPC generator. A missing entry simply shows nothing; there is no fallback
   text, because a wrong explanation is worse than none.
   =========================================================================== */
'use strict';

const SKILL_INFO = {

  /* ---------------- Dexterity ---------------- */
  'Acrobatics': {
    de: 'Rollen, Hechten, Salti: mindert Fallschaden, beeindruckt Publikum und bringt im Nahkampf einen Gegner aus dem Tritt. Hilft auch beim Klettern und Springen.',
    en: 'Tumbling, diving and rolling: softens falling damage, entertains a crowd and throws an opponent off in a fight. Also helps with climbing and jumping.' },
  'Archaic Guns': {
    de: 'Schießen mit vorzeitlichen Feuerwaffen - Steinschloss, Muskete, Schwarzpulverpistole. Findet sich fast nur auf rückständigen Welten.',
    en: 'Firing primitive guns - flintlocks, muskets, black powder pistols. Hardly found outside low-technology worlds.' },
  'Artillery': {
    de: 'Bedienen schwerer Geschütze, die feste Munition verschießen: Kanonen und Feldgeschütze, nicht aber Raketenwerfer.',
    en: 'Working heavy guns that fire solid shot: cannon and field pieces, not missile launchers.' },
  'Blaster': {
    de: 'Der Umgang mit allem, was ein Charakter an Blastern tragen kann - von der Taschenpistole bis zum schweren Blastergewehr.',
    en: 'Handling every blaster a character can carry, from a hold-out pistol to a heavy blaster rifle.' },
  'Blaster Artillery': {
    de: 'Fest aufgestellte, von mehreren Leuten bediente Energiegeschütze: Stellungsblaster, Flugabwehr, Boden-Raum-Batterien.',
    en: 'Fixed, multi-crew energy guns: emplaced blasters, anti-air mounts, surface-to-space batteries.' },
  'Bowcaster': {
    de: 'Die Wookiee-Bolzenschleuder. Sie verlangt viel Kraft und wird kaum von jemand anderem geführt.',
    en: 'The Wookiee bowcaster. It takes great strength and is seldom used by anyone else.' },
  'Bows': {
    de: 'Bogen und Armbrust jeder Bauart - die Wookiee-Bolzenschleuder hat ihre eigene Fertigkeit.',
    en: 'Bows and crossbows of every kind - the Wookiee bowcaster has a skill of its own.' },
  'Brawling Parry': {
    de: 'Reaktionsfertigkeit: einen Faust- oder Nahkampfangriff mit bloßen Händen abblocken, statt ihm auszuweichen.',
    en: 'Reaction skill: blocking a brawling or melee attack bare-handed instead of giving ground.' },
  'Dodge': {
    de: 'Reaktionsfertigkeit gegen alles, was aus der Entfernung kommt - Blasterschüsse, Pfeile, Granaten.',
    en: 'Reaction skill against anything fired from a distance - blaster bolts, arrows, grenades.' },
  'Firearms': {
    de: 'Schusswaffen, die Projektile verschießen: Pistolen, Gewehre, Maschinenwaffen. Für ganz alte Modelle gibt es Archaische Schusswaffen.',
    en: 'Guns that fire bullets: pistols, rifles, machine guns. Very old designs fall under archaic guns.' },
  'Flamethrower': {
    de: 'Flammenwerfer jeder Bauart, vom Flammengewehr bis zum Projektor am Handgelenk.',
    en: 'Flame projectors of every kind, from flame rifles to wrist-mounted units.' },
  'Grenade': {
    de: 'Granaten und ähnliche Wurfgeschosse ins Ziel bringen. Misslingt der Wurf, landet die Granate woanders - meist ungünstig.',
    en: 'Putting grenades and similar throwables where they should go. A failed throw lands them somewhere else - usually badly.' },
  'Lightsaber': {
    de: 'Das Lichtschwert führen. Ohne Übung ist es für den Träger selbst gefährlich: ein misslungener Angriff kann die eigene Klinge zurückbringen.',
    en: 'Wielding a lightsaber. Untrained it is dangerous to its own bearer: a botched attack can bring the blade back on you.' },
  'Melee Combat': {
    de: 'Angriff mit Handwaffen aller Art - Vibroklinge, Kraftpike, Knüppel, Messer. Lichtschwerter haben ihre eigene Fertigkeit.',
    en: 'Attacking with hand weapons of every kind - vibroblades, force pikes, clubs, knives. Lightsabers have their own skill.' },
  'Melee Parry': {
    de: 'Reaktionsfertigkeit: einen Nahkampfangriff mit der eigenen Waffe abfangen. Gegen Blasterschüsse hilft sie nicht.',
    en: 'Reaction skill: catching a melee attack on your own weapon. It does nothing against blaster fire.' },
  'Missile Weapons': {
    de: 'Werfer mit eigenem Antrieb oder Treibsatz: Raketenwerfer, Granatwerfer, Flechettewerfer, Enterhakenschleuder.',
    en: 'Launchers with their own propellant: rocket and grenade launchers, flechette launchers, power harpoons.' },
  'Pick Pockets': {
    de: 'Taschendiebstahl und das unauffällige Verschwindenlassen kleiner Dinge. Das Opfer darf dagegen Suchen würfeln.',
    en: 'Picking pockets and palming small objects unseen. The victim gets an opposed search roll.' },
  'Running': {
    de: 'Schnell laufen, ohne zu stürzen - besonders über schwieriges Gelände.',
    en: 'Running fast without going down, above all over rough ground.' },
  'Thrown Weapons': {
    de: 'Wurfwaffen ohne Antrieb: Wurfmesser, Speer, Schleuder.',
    en: 'Thrown weapons without propellant: knives, spears, slings.' },
  'Vehicle Blasters': {
    de: 'Energiewaffen, die auf Fahrzeugen sitzen - Blasterkanonen auf Gleitern, Läufern und Bodenfahrzeugen.',
    en: 'Energy weapons mounted on vehicles - blaster cannon on speeders, walkers and ground craft.' },

  /* ---------------- Knowledge ---------------- */
  'Alien Species': {
    de: 'Was man über andere Völker weiß: Sitten, Körperbau, Schwächen, wie man sie nicht beleidigt.',
    en: 'What you know about other species: customs, anatomy, weak spots, how not to give offence.' },
  'Bureaucracy': {
    de: 'Sich in Ämtern zurechtfinden: Formulare, Zuständigkeiten, Dienstwege - und wo man sie abkürzen kann.',
    en: 'Finding your way through officialdom: forms, jurisdictions, proper channels - and where to cut them short.' },
  'Business': {
    de: 'Wie Firmen, Konzerne und Handelsgilden arbeiten, was üblich ist und was ein Geschäft wert ist.',
    en: 'How firms, corporations and trade guilds work, what is customary and what a deal is worth.' },
  'Cultures': {
    de: 'Bräuche, Umgangsformen und Gesellschaftsordnung bestimmter Welten und Gruppen.',
    en: 'Customs, manners and social order of particular worlds and groups.' },
  'Intimidation': {
    de: 'Durch Drohung, Auftreten oder Gewalt erreichen, dass jemand gehorcht oder redet.',
    en: 'Getting obedience or answers through threat, bearing or force.' },
  'Languages': {
    de: 'Fremde Sprachen und Schriften verstehen, sprechen und entziffern - Basic beherrscht fast jeder ohnehin.',
    en: 'Understanding, speaking and deciphering other languages and scripts - nearly everyone has Basic anyway.' },
  'Law Enforcement': {
    de: 'Wie Polizei, Zoll und Sicherheitsdienste arbeiten: Verfahren, Befugnisse, Dienstgrade.',
    en: 'How police, customs and security services work: procedures, powers, ranks.' },
  'Planetary Systems': {
    de: 'Allgemeinwissen über Welten und Systeme: Lage, Klima, Leben, Handel, Regierung.',
    en: 'General knowledge of worlds and systems: where they are, climate, life, trade, government.' },
  'Scholar': {
    de: 'Gelehrtes Wissen in einem Fachgebiet und die Fähigkeit, etwas nachzuschlagen oder zu erforschen.',
    en: 'Academic knowledge of a field, and the ability to look something up or research it.' },
  'Streetwise': {
    de: 'Sich in der Unterwelt bewegen: wen man fragt, was etwas auf dem Schwarzmarkt kostet, wo man untertaucht.',
    en: 'Moving in the underworld: who to ask, what a thing costs on the black market, where to go to ground.' },
  'Survival': {
    de: 'In feindlicher Umgebung durchkommen - Wüste, Dschungel, Eis, giftige Atmosphäre: Wasser, Nahrung, Schutz, Gefahren erkennen.',
    en: 'Getting through hostile country - desert, jungle, ice, poisonous air: water, food, shelter, spotting danger.' },
  'Tactics': {
    de: 'Truppen, Schiffe oder Staffeln so führen und aufstellen, dass sie im Vorteil sind.',
    en: 'Deploying troops, ships or squadrons so that they hold the advantage.' },
  'Value': {
    de: 'Den tatsächlichen Marktwert einer Sache einschätzen - und erkennen, ob man übers Ohr gehauen wird.',
    en: 'Judging what something is really worth on the market - and spotting when you are being cheated.' },
  'Willpower': {
    de: 'Standhalten: gegen Einschüchterung, Überredung und wenn der Körper schon aufgeben will.',
    en: 'Holding out: against intimidation, persuasion, and when the body wants to give up.' },

  /* ---------------- Mechanical ---------------- */
  'Aquatic Vehicle Op.': {
    de: 'Boote und Überwasserschiffe steuern. Auf technisch entwickelten Welten selten, auf einfachen alltäglich.',
    en: 'Steering boats and surface ships. Rare on high-tech worlds, everyday on simple ones.' },
  'Archaic Starship Pilot.': {
    de: 'Alte, primitive Raumschiffe fliegen, wie sie in abgelegenen Gegenden noch unterwegs sind.',
    en: 'Flying old, primitive starships of the kind still met in out-of-the-way places.' },
  'Astrogation': {
    de: 'Hyperraumsprünge berechnen: Kurs, Dauer und das Ausweichen vor allem, was im Weg steht. Ohne sie kommt niemand sicher ans Ziel.',
    en: 'Working out hyperspace jumps: course, duration, and avoiding whatever lies in the way. Nobody arrives safely without it.' },
  'Beast Riding': {
    de: 'Reittiere lenken - Bantha, Tauntaun, Dewback. Tiere haben einen eigenen Dickkopf, der sich dagegenstemmt.',
    en: 'Riding live mounts - banthas, tauntauns, dewbacks. Animals have a stubbornness of their own to argue with.' },
  'Capital Ship Gun.': {
    de: 'Die schweren Waffen großer Kriegsschiffe bedienen: Turbolaser, Ionenkanonen, Traktorstrahlen, Torpedos.',
    en: 'Working the heavy weapons of warships: turbolasers, ion cannon, tractor beams, torpedoes.' },
  'Capital Ship Piloting': {
    de: 'Große Kriegsschiffe steuern - Sternzerstörer, Fregatten, Kreuzer. Solche Schiffe wenden träge und brauchen Vorlauf.',
    en: 'Handling the big warships - Star Destroyers, frigates, cruisers. Such ships turn slowly and need warning.' },
  'Capital Ship Shields': {
    de: 'Die Schilde großer Schiffe führen: Energie auf die Feuerbögen legen, aus denen gerade geschossen wird.',
    en: 'Running a capital ship’s shields: putting power into the fire arcs that are actually being shot at.' },
  'Communications': {
    de: 'Funk, Subraumfunk und Komlinks bedienen - auch unter Störfeuer und gegen Abhörversuche.',
    en: 'Working radios, subspace sets and comlinks - including through jamming and against eavesdropping.' },
  'Ground Vehicle Op.': {
    de: 'Fahrzeuge auf Rädern und Ketten fahren, vom Sandkriecher bis zum Mannschaftstransporter.',
    en: 'Driving wheeled and tracked vehicles, from sandcrawlers to troop carriers.' },
  'Hover Vehicle Op.': {
    de: 'Luftkissenfahrzeuge steuern. Sie schweben auf einem Luftpolster statt auf Repulsoren und fahren sich entsprechend sperrig.',
    en: 'Driving hovercraft. They ride on a cushion of air rather than repulsors, and handle accordingly.' },
  'Jet Pack Operation': {
    de: 'Jetpacks fliegen. Sie ziehen Luft aus der Umgebung an und arbeiten deshalb nur in einer Atmosphäre.',
    en: 'Flying jet packs. They draw in surrounding air and therefore only work inside an atmosphere.' },
  'Powersuit Operation': {
    de: 'Kraftanzüge führen - servounterstützte Anzüge für Lasten, Bau oder Kampf, etwa die Rüstung der Raumtruppen.',
    en: 'Operating powersuits - servo-assisted suits for lifting, construction or combat, such as spacetrooper armour.' },
  'Repulsorlift Op.': {
    de: 'Die gewöhnlichen Schwebefahrzeuge: Landgleiter, Schneegleiter, Skyhopper, Wolkenwagen.',
    en: 'The everyday repulsor craft: landspeeders, snowspeeders, skyhoppers, cloud cars.' },
  'Rocket Pack Op.': {
    de: 'Raketenrucksäcke fliegen. Sie tragen ihren Treibstoff mit und arbeiten deshalb auch im luftleeren Raum.',
    en: 'Flying rocket packs. They carry their own propellant and so work in vacuum as well.' },
  'Sensors': {
    de: 'Sensoren auswerten: Lebenszeichen, Energiesignaturen, Schiffe erkennen - am Handscanner wie an der Schiffsanlage.',
    en: 'Reading sensors: life signs, energy traces, identifying ships - on a hand scanner as on a ship’s array.' },
  'Space Transport': {
    de: 'Raumtransporter fliegen: Frachter, Yachten, Shuttles - alles, was kein Kampfschiff ist.',
    en: 'Flying space transports: freighters, yachts, shuttles - everything that is not a combat ship.' },
  'Starfighter Piloting': {
    de: 'Jäger fliegen - X-Flügler, Y-Flügler, TIE. Enge Manöver, hohe Beschleunigung, kurze Reichweite.',
    en: 'Flying starfighters - X-wings, Y-wings, TIEs. Tight manoeuvres, hard acceleration, short legs.' },
  'Starship Gunnery': {
    de: 'Die Waffen in Jägergröße bedienen: Laserkanonen, Ionenkanonen, Protonentorpedos.',
    en: 'Working starfighter-scale weapons: laser cannon, ion cannon, proton torpedoes.' },
  'Starship Shields': {
    de: 'Die Schilde kleiner Schiffe führen und auf die Feuerbögen verteilen, aus denen Beschuss kommt.',
    en: 'Running a small ship’s shields and spreading them over the arcs taking fire.' },
  'Submersible Vehicle Op.': {
    de: 'Unterwasserfahrzeuge steuern - Tauchboote für Erkundung, Wartung oder Transport.',
    en: 'Piloting submersibles - underwater craft for survey, maintenance or transport.' },
  'Swoop Operation': {
    de: 'Swoops fliegen: Repulsorantrieb mit Ionennachbrenner, halsbrecherisch schnell und entsprechend heikel.',
    en: 'Riding swoops: repulsor drive with an ion afterburner, wildly fast and touchy to match.' },
  'Walker Operation': {
    de: 'Schreitpanzer führen - AT-AT, AT-ST, AT-PT. Schwer zu erlernen und fast immer militärisch.',
    en: 'Operating walkers - AT-ATs, AT-STs, AT-PTs. Hard to learn and almost always a military trade.' },

  /* ---------------- Perception ---------------- */
  'Bargain': {
    de: 'Um Preise feilschen, beim Kaufen wie beim Verkaufen - meist gegen das Feilschen der Gegenseite.',
    en: 'Haggling over prices, buying or selling - usually against the other side’s bargaining.' },
  'Command': {
    de: 'Untergebene führen: Befehle geben, die befolgt werden, und eine Einheit zusammenhalten.',
    en: 'Leading subordinates: giving orders that are obeyed and holding a unit together.' },
  'Con': {
    de: 'Täuschen und beschwatzen - jemanden zu etwas bringen, das ihm nicht nützt. Verkleidung gehört dazu.',
    en: 'Tricking and fast-talking - getting someone to do what is not in their interest. Disguise belongs here.' },
  'Forgery': {
    de: 'Papiere und Datensätze fälschen: Ausweise, Genehmigungen, Frachtbriefe, Zugangscodes.',
    en: 'Faking papers and records: identity documents, permits, cargo manifests, access codes.' },
  'Gambling': {
    de: 'Glücksspiel - vor allem Sabacc. Wirkt nur dort, wo Können mitspielt, nicht beim reinen Zufall.',
    en: 'Games of chance - sabacc above all. It only bites where skill plays a part, not in pure luck.' },
  'Hide': {
    de: 'Gegenstände verbergen: eine Waffe am Körper, etwas im Gepäck, etwas in einem Raum deponieren.',
    en: 'Concealing objects: a weapon on your person, goods in luggage, something planted in a room.' },
  'Investigation': {
    de: 'Nachforschen: Spuren, Aussagen und Akten zusammentragen und daraus schließen, was geschehen ist.',
    en: 'Investigating: gathering traces, statements and records, and working out what happened.' },
  'Persuasion': {
    de: 'Überzeugen, ohne zu täuschen oder zu drohen - mit Argumenten, Auftreten oder einer guten Geschichte.',
    en: 'Convincing without deceit or threat - by argument, bearing or a good story.' },
  'Search': {
    de: 'Suchen und entdecken: Verstecktes finden, jemanden bemerken, einer Spur folgen.',
    en: 'Searching and spotting: finding what is hidden, noticing someone, following a trail.' },
  'Sneak': {
    de: 'Sich lautlos und ungesehen bewegen - im Schatten bleiben, an Wachen vorbei.',
    en: 'Moving quietly and unseen - keeping to shadow, slipping past guards.' },

  /* ---------------- Strength ---------------- */
  'Brawling': {
    de: 'Kämpfen mit bloßen Händen: Schläge, Tritte, Würfe, Griffe.',
    en: 'Fighting bare-handed: punches, kicks, throws, holds.' },
  'Climbing / Jumping': {
    de: 'Klettern und Springen: Wände und Felsen hinauf, über Lücken hinweg, nach einem Vorsprung greifen.',
    en: 'Climbing and jumping: up walls and cliffs, across gaps, catching hold of a ledge.' },
  'Lifting': {
    de: 'Schweres heben und tragen - und es auch über längere Zeit halten.',
    en: 'Lifting and carrying heavy loads - and holding them for a while.' },
  'Stamina': {
    de: 'Durchhalten, wenn es über die Kräfte geht: lange Märsche, Hitze, Kälte, Erschöpfung.',
    en: 'Holding out past the limit: long marches, heat, cold, exhaustion.' },
  'Swimming': {
    de: 'Sich über Wasser halten und vorankommen - vom Schwimmbecken bis zum reißenden Fluss.',
    en: 'Staying afloat and making headway - from a swimming pool to a racing river.' },

  /* ---------------- Technical ---------------- */
  'Aquatic Vehicle Rep.': {
    de: 'Boote und Überwasserschiffe instand setzen und umbauen.',
    en: 'Repairing and modifying boats and surface ships.' },
  'Armor Repair': {
    de: 'Rüstungen flicken und ändern - je nach Schaden kostet es Zeit und Ersatzteile.',
    en: 'Patching and altering armour - what it costs in time and parts depends on the damage.' },
  'Blaster Repair': {
    de: 'Blasterwaffen reparieren und verändern, von der Pistole bis zur schweren Kanone.',
    en: 'Repairing and modifying blaster weapons, from pistols to heavy cannon.' },
  'Capital Ship Repair': {
    de: 'Die Systeme großer Kriegsschiffe instand setzen - Antrieb, Schilde, Rumpf, Elektronik.',
    en: 'Repairing the systems of big warships - drives, shields, hull, electronics.' },
  'Capital Ship Weap. Rep.': {
    de: 'Die schweren Waffenanlagen großer Schiffe warten und reparieren: Turbolaser, Ionenkanonen, Traktorstrahlen.',
    en: 'Servicing and repairing a warship’s heavy weapon mounts: turbolasers, ion cannon, tractor beams.' },
  'Computer Prog. / Rep.': {
    de: 'Rechner programmieren, reparieren und umgehen - auch Sicherungen knacken und Daten herausholen.',
    en: 'Programming, repairing and getting around computers - including breaking security and pulling data.' },
  'Demolition': {
    de: 'Sprengladungen setzen: etwas zum Einsturz bringen oder genau dort aufreißen, wo es nötig ist.',
    en: 'Setting charges: bringing something down, or opening it exactly where it has to open.' },
  'Droid Prog.': {
    de: 'Droiden programmieren - ihnen eine neue Fertigkeit oder Aufgabe beibringen.',
    en: 'Programming droids - teaching them a new skill or task.' },
  'Droid Repair': {
    de: 'Droiden reparieren, warten und umbauen.',
    en: 'Repairing, maintaining and modifying droids.' },
  'First Aid': {
    de: 'Erste Hilfe im Feld: Blutungen stillen, stabilisieren, einen Medipack anwenden.',
    en: 'Field first aid: stopping bleeding, stabilising, using a medpac.' },
  'Ground Vehicle Rep.': {
    de: 'Rad- und Kettenfahrzeuge instand setzen und umbauen.',
    en: 'Repairing and modifying wheeled and tracked vehicles.' },
  'Lightsaber Repair': {
    de: 'Ein Lichtschwert bauen, justieren und reparieren - Kristalle einsetzen, Fokus und Klingenlänge einstellen.',
    en: 'Building, tuning and repairing a lightsaber - setting crystals, adjusting focus and blade length.' },
  'Melee Repair': {
    de: 'Handwaffen instand setzen und schärfen - Vibroklingen, Kraftpiken, Knüppel.',
    en: 'Repairing and sharpening hand weapons - vibroblades, force pikes, clubs.' },
  'Repulsorlift Repair': {
    de: 'Schwebefahrzeuge reparieren und umbauen: Gleiter, Swoops, Speeder-Bikes.',
    en: 'Repairing and modifying repulsor craft: speeders, swoops, speeder bikes.' },
  'Security': {
    de: 'Schlösser, Alarmanlagen und Sperren überwinden oder einrichten. Rechnersicherheit gehört nicht dazu.',
    en: 'Beating or setting up locks, alarms and barriers. Computer security is not part of it.' },
  'Space Transport Rep.': {
    de: 'Frachter und andere Raumtransporter reparieren und umbauen.',
    en: 'Repairing and modifying freighters and other space transports.' },
  'Starfighter Repair': {
    de: 'Jäger instand setzen und verbessern.',
    en: 'Repairing and improving starfighters.' },
  'Starship Weapon Rep.': {
    de: 'Waffen in Jägergröße warten und reparieren: Laserkanonen, Ionenkanonen, Torpedowerfer.',
    en: 'Servicing and repairing starfighter-scale weapons: laser cannon, ion cannon, torpedo tubes.' },
  'Walker Repair': {
    de: 'Schreitpanzer instand setzen - Beine, Gelenke, Stabilisierung, Waffenanlagen.',
    en: 'Repairing walkers - legs, joints, stabilisers, weapon mounts.' },

  /* ---------------- Advanced skills ---------------- */
  /* They cost double and need their prerequisite; what they do is one step
     beyond the skill they build on. */
  '(A) Medicine': {
    de: 'Ärztliche Behandlung über Erste Hilfe hinaus: Operationen, Bactabehandlung, Kybernetik einsetzen.',
    en: 'Medical work beyond first aid: surgery, bacta treatment, fitting cybernetics.' },
  '(A) Bacta Tank Operation': {
    de: 'Einen Bactatank einrichten und überwachen - Mischung, Dosierung, Dauer der Behandlung.',
    en: 'Setting up and watching a bacta tank - mixture, dosage, how long the treatment runs.' },
  '(A) Injury/Ailment Diagnosis': {
    de: 'Verletzungen und Krankheiten erkennen und richtig einordnen, bevor behandelt wird.',
    en: 'Recognising injuries and illnesses and reading them correctly before treatment begins.' },
  '(A) Pod Racer Operation': {
    de: 'Podrenner fliegen: Repulsorschlitten an zwei Triebwerken, schneller als alles andere am Boden und kaum zu beherrschen.',
    en: 'Racing pods: a repulsor sled slung behind two engines, faster than anything else on the ground and barely controllable.' },
  '(A) Aquatic Vehicle Engineering': {
    de: 'Boote und Überwasserschiffe entwerfen und neu bauen, nicht nur reparieren.',
    en: 'Designing and building boats and surface ships from scratch, not merely repairing them.' },
  '(A) Armor Engineering': {
    de: 'Rüstungen entwerfen und bauen - Schutzwirkung, Gewicht und Beweglichkeit gegeneinander abwägen.',
    en: 'Designing and building armour - trading protection off against weight and freedom of movement.' },
  '(A) Capital Ship Engineering': {
    de: 'Großkampfschiffe entwerfen: Rumpf, Antrieb und Systeme eines Schiffs von Hunderten Metern Länge.',
    en: 'Designing capital ships: hull, drives and systems of a vessel hundreds of metres long.' },
  '(A) Civil/Industrial Engineering': {
    de: 'Bauten und Anlagen entwerfen: Gebäude, Brücken, Kraftwerke, Fabriken.',
    en: 'Designing structures and plant: buildings, bridges, power stations, factories.' },
  '(A) Computer Engineering': {
    de: 'Rechner und Rechnersysteme entwerfen und neu aufbauen.',
    en: 'Designing and building computers and computer systems.' },
  '(A) Droid Engineering': {
    de: 'Droiden entwerfen und bauen - Körper, Gehirn und Ausstattung zusammenstellen.',
    en: 'Designing and building droids - putting body, brain and fittings together.' },
  '(A) Equipment Engineering': {
    de: 'Geräte und Ausrüstung entwickeln, von Werkzeug bis Sensortechnik.',
    en: 'Developing equipment, from tools to sensor gear.' },
  '(A) Ground Vehicle Engineering': {
    de: 'Rad- und Kettenfahrzeuge entwerfen und bauen.',
    en: 'Designing and building wheeled and tracked vehicles.' },
  '(A) Hover Vehicle Engineering': {
    de: 'Luftkissenfahrzeuge entwerfen und bauen.',
    en: 'Designing and building hovercraft.' },
  '(A) Installation Engineering': {
    de: 'Ortsfeste Anlagen entwerfen: Stützpunkte, Raumstationen, Werften, Verteidigungsstellungen.',
    en: 'Designing fixed installations: bases, space stations, shipyards, defence emplacements.' },
  '(A) Repulsorlift Engineering': {
    de: 'Schwebefahrzeuge entwerfen und bauen - Gleiter, Swoops, Speeder-Bikes.',
    en: 'Designing and building repulsor craft - speeders, swoops, speeder bikes.' },
  '(A) Space Transport Engineering': {
    de: 'Raumtransporter entwerfen und bauen: Frachter, Yachten, Shuttles.',
    en: 'Designing and building space transports: freighters, yachts, shuttles.' },
  '(A) Starfighter Engineering': {
    de: 'Jäger entwerfen und bauen - Geschwindigkeit, Bewaffnung und Panzerung austarieren.',
    en: 'Designing and building starfighters - balancing speed, armament and armour.' },
  '(A) Submersible Vehicle Engineering': {
    de: 'Unterwasserfahrzeuge entwerfen und bauen.',
    en: 'Designing and building submersibles.' },
  '(A) Walker Engineering': {
    de: 'Schreitpanzer entwerfen und bauen - Gang, Standfestigkeit, Panzerung.',
    en: 'Designing and building walkers - gait, stability, armour.' },
  '(A) Weapon Engineering': {
    de: 'Waffen entwerfen und bauen, von der Handfeuerwaffe bis zum Schiffsgeschütz.',
    en: 'Designing and building weapons, from sidearms to ship-mounted guns.' },
};

/* ===========================================================================
   Force powers. The Control/Sense/Alter line on the tab already says which
   rolls a power needs; what is missing is what actually happens when they
   succeed. Where a power is a dark side discipline or costs a Dark Side
   Point, the sentence says so - the skull warns, but not why.
   =========================================================================== */

const POWER_INFO = {

  /* ---------------- Control: the Jedi's own body and mind ---------------- */
  'Absorb / Dissipate Energy': {
    de: 'Auftreffende Energie aufnehmen oder ableiten, statt sie einzustecken - von greller Sonne über Blasterschüsse bis zu Machtblitzen.',
    en: 'Taking in or shedding incoming energy instead of suffering it - from harsh sun to blaster bolts to Force lightning.' },
  'Accelerate Healing': {
    de: 'Die eigene Heilung beschleunigen: zusätzliche Heilungswürfe für die eigenen Wunden.',
    en: 'Speeding your own recovery: extra healing rolls for your own wounds.' },
  'Burst of Speed': {
    de: 'Kurzzeitig deutlich schneller laufen, als der Körper es hergibt.',
    en: 'Running far faster than the body allows, for a short while.' },
  'Channel Rage': {
    de: 'Den eigenen Zorn in eine Berserkerwut umlenken, die im Kampf stärker macht. Bringt einen Punkt der dunklen Seite ein.',
    en: 'Turning your own anger into a berserk fury that makes you stronger in a fight. Earns a Dark Side Point.' },
  'Concentration': {
    de: 'Sich ganz auf eine einzige Handlung sammeln und sie dadurch sicherer gelingen lassen.',
    en: 'Gathering yourself entirely on one action, and so making it come off.' },
  'Contort / Escape': {
    de: 'Sich aus Fesseln und Handschellen winden - der Körper gibt dabei mehr her als sonst.',
    en: 'Twisting out of bonds and binders - the body gives more than it normally would.' },
  'Control Disease': {
    de: 'Eine eigene Krankheit zurückdrängen, vom Infekt bis zur lebensbedrohlichen Seuche.',
    en: 'Pushing back a disease of your own, from an infection to something life-threatening.' },
  'Control Pain': {
    de: 'Den eigenen Schmerz ausblenden und trotz Verletzung weiterhandeln.',
    en: 'Shutting out your own pain and carrying on despite the wound.' },
  'Detoxify Poison': {
    de: 'Ein Gift im eigenen Körper unschädlich machen, vom Rausch bis zum Nervengift.',
    en: 'Neutralising a poison in your own body, from drink to a neurotoxin.' },
  'Emptiness': {
    de: 'Den Geist leeren und die Macht durch sich fließen lassen - der Charakter wirkt dann selbst wie nicht vorhanden. Wer der dunklen Seite verfallen ist, kann es nicht.',
    en: 'Emptying the mind and letting the Force flow through - the character all but ceases to register. Those consumed by the dark side cannot use it.' },
  'Enhance Attribute': {
    de: 'Ein Attribut für kurze Zeit anheben - und mit ihm alle Fertigkeiten, die daran hängen.',
    en: 'Raising one attribute for a short time - and with it every skill hanging off it.' },
  'Force of Will': {
    de: 'Die eigene Willenskraft gegen fremde Machtkräfte stemmen, statt ihnen ausgeliefert zu sein.',
    en: 'Setting your own willpower against another’s Force powers instead of simply suffering them.' },
  'Hibernation Trance': {
    de: 'In eine tiefe Starre fallen: Herzschlag und Atmung sinken fast auf null, der Körper überdauert Tage ohne Wasser und Luft.',
    en: 'Dropping into a deep trance: heartbeat and breathing fall to almost nothing, and the body lasts days without water or air.' },
  'Instinctive Astrogation: Control': {
    de: 'Einen Hyperraumsprung ohne Navirechner fliegen - die schwierigere Hälfte, bei der der Kurs auch wirklich umgesetzt wird.',
    en: 'Flying a hyperspace jump without a nav computer - the harder half, where the course is actually carried out.' },
  'Rage': {
    de: 'Sich in blanke Wut steigern und daraus Kraft ziehen. Nur für Gefallene; bringt einen Punkt der dunklen Seite ein.',
    en: 'Working yourself into sheer fury and drawing strength from it. Only for the fallen; earns a Dark Side Point.' },
  'Reduce Injury': {
    de: 'Eine schwere Verletzung abmildern - aus tödlich wird schwer, aus schwer wird weniger.',
    en: 'Softening a bad wound - mortal becomes severe, severe becomes less.' },
  'Remain Conscious': {
    de: 'Bei Bewusstsein bleiben, obwohl die Verletzung einen längst umwerfen müsste.',
    en: 'Staying conscious though the wound should long since have put you down.' },
  'Remove Fatigue': {
    de: 'Erschöpfung abschütteln: der Körper arbeitet die Ermüdungsstoffe schneller ab.',
    en: 'Shaking off exhaustion: the body clears fatigue faster than it should.' },
  'Resist Stun': {
    de: 'Den Körper vorbereiten, damit Betäubungsschaden weniger ausrichtet - muss vorher aktiv sein.',
    en: 'Preparing the body so stun damage bites less - it has to be up beforehand.' },
  'Short-Term Memory Enhancement': {
    de: 'Das eben Erlebte noch einmal durchgehen und Einzelheiten bemerken, die man übersehen hat.',
    en: 'Replaying what just happened and catching details you missed the first time.' },
  'Up the Walls': {
    de: 'Ein Stück des Weges an einer Wand entlanglaufen, solange Anfang und Ende am Boden liegen.',
    en: 'Running part of your movement along a wall, as long as you start and end on the floor.' },
  'Breath Control': {
    de: 'Den Atemreflex stilllegen und sehr lange ohne Luft auskommen.',
    en: 'Shutting down the urge to breathe and going without air for a long time.' },
  'Deflect Energy': {
    de: 'Einen Blasterschuss ablenken, statt ihn zu schlucken - notfalls mit der bloßen Hand.',
    en: 'Turning a blaster bolt aside instead of absorbing it - bare-handed if need be.' },
  'Force Body': {
    de: 'Den Körper über seine sichere Grenze hinaus treiben, um die Verbindung zur Macht zu halten - auf Kosten der eigenen Gesundheit.',
    en: 'Driving the body past its safe limit to keep hold of the Force - at the cost of your own health.' },
  'Force Comprehension': {
    de: 'In kurzer Zeit sehr viel Information aufnehmen und verstehen.',
    en: 'Taking in and understanding a great deal of information very quickly.' },
  'Resist Force': {
    de: 'Sich sammeln und für eine Weile gegen jede fremde Machtkraft wappnen.',
    en: 'Centring yourself and standing ready against any Force power aimed at you.' },

  /* ---------------- Sense: perceiving ---------------- */
  'Direction Sense': {
    de: 'Sich von der Macht zu einem Ziel führen lassen - einem Ort, einer Sache, einer Richtung.',
    en: 'Letting the Force steer you towards a goal - a place, an object, a direction.' },
  'Merge Senses': {
    de: 'Durch die Sinne eines Tieres wahrnehmen: sehen, hören und riechen, was es wahrnimmt.',
    en: 'Perceiving through an animal’s senses: seeing, hearing and smelling what it does.' },
  'Predict Natural Disaster': {
    de: 'Eine kommende Naturkatastrophe in vertrauter Umgebung spüren, bevor sie eintritt.',
    en: 'Feeling a natural disaster coming in country you know, before it arrives.' },
  'Beast Languages': {
    de: 'Sich mit Tieren verständigen - je zahmer und friedlicher, desto leichter.',
    en: 'Making yourself understood to animals - the tamer and milder, the easier.' },
  'Combat Sense': {
    de: 'Im Gefecht alles ausblenden außer den Gegnern - und sie dadurch sicherer treffen.',
    en: 'Blotting out everything in a fight but the opponents - and hitting them more surely for it.' },
  'Danger Sense': {
    de: 'Die eigenen Sinne wie einen Frühwarnring um sich legen: Gefahr meldet sich, bevor sie zuschlägt.',
    en: 'Laying your senses around you like an early warning ring: danger announces itself before it strikes.' },
  'Instinctive Astrogation: Sense': {
    de: 'Die bekanntere Hälfte: einen Hyperraumkurs ohne Navirechner berechnen.',
    en: 'The better known half: working out a hyperspace course without a nav computer.' },
  'Life Detection': {
    de: 'Spüren, dass überhaupt denkende Wesen in der Nähe sind, auch wenn man sie nicht sieht.',
    en: 'Sensing that thinking beings are near at all, even unseen.' },
  'Life Sense': {
    de: 'Eine bestimmte Person aufspüren und verfolgen - man muss sie kennen.',
    en: 'Finding and following one particular person - you have to know them.' },
  'Life Web': {
    de: 'Große Ansammlungen einer bestimmten Art über weite Strecken aufspüren. Braucht Tage.',
    en: 'Locating large concentrations of one chosen species over great distances. It takes days.' },
  'Magnify Senses': {
    de: 'Die eigenen Sinne so schärfen, dass man ohne Gerät wahrnimmt, wofür es sonst Technik braucht.',
    en: 'Sharpening your own senses to pick up what would otherwise need instruments.' },
  'Postcognition': {
    de: 'Sehen, was an einem Ort oder mit einem Gegenstand früher geschehen ist.',
    en: 'Seeing what happened earlier in a place, or to an object.' },
  'Receptive Telepathy': {
    de: 'Die Gedanken eines anderen lesen - wer sich wehrt, macht es schwer.',
    en: 'Reading another’s thoughts - anyone resisting makes it hard work.' },
  'Sense Force': {
    de: 'Die Macht an einem Ort selbst wahrnehmen: ob sie hell, dunkel oder ungewöhnlich stark ist.',
    en: 'Sensing the Force in a place itself: whether it runs light, dark or unusually strong.' },
  'Sense Force Potential': {
    de: 'Erkennen, ob und wie stark jemand machtsensitiv ist.',
    en: 'Telling whether someone is Force-sensitive, and how strongly.' },
  'Sense Path': {
    de: 'Spüren, wohin der eingeschlagene Weg führt - ob die eigenen Taten zur dunklen Seite neigen.',
    en: 'Feeling where your road leads - whether what you are doing tends towards the dark side.' },
  'Shift Sense': {
    de: 'Einen Sinn auf etwas umstellen, das er sonst nicht wahrnimmt: Wärme, Funkfrequenzen, Infrarot.',
    en: 'Retuning a sense to something it normally cannot catch: heat, comm frequencies, infrared.' },
  'Translation': {
    de: 'Eine unbekannte Sprache verstehen, indem man den Sinn hinter den Worten erfasst.',
    en: 'Understanding an unknown language by taking the meaning behind the words.' },
  'Weather Sense': {
    de: 'Das Wetter der nächsten Stunden und Tage voraussehen - in vertrauter Gegend am sichersten.',
    en: 'Foreseeing the weather of the coming hours and days - surest in country you know.' },
  'Mechu-Deru': {
    de: 'Maschinen durch die Macht erfassen: Aufbau, Zustand, Schäden - vom Handgerät bis zum Großkampfschiff.',
    en: 'Taking in machines through the Force: build, condition, damage - from hand tools to capital ships.' },
  'Sense True Nature': {
    de: 'Hinter die Fassade sehen: was jemand wirklich will und wirklich ist.',
    en: 'Seeing behind the front: what someone really wants and really is.' },
  'Time Awareness': {
    de: 'Genau spüren, wie viel Zeit seit einem Ereignis vergangen ist - und das eigene Handeln danach ausrichten.',
    en: 'Feeling exactly how much time has passed since an event - and timing yourself by it.' },
  'Force Shot': {
    de: 'Die Macht führt den Schuss: er trifft auch Ziele, die in Deckung oder verborgen sind.',
    en: 'The Force guides the shot: it finds targets in cover or hidden from view.' },

  /* ---------------- Control & Alter: acting on others ---------------- */
  'Force Jump': {
    de: 'Unmöglich weit und hoch springen - die Macht trägt den Sprung mit.',
    en: 'Leaping impossibly high and far - the Force carries the jump.' },
  'Redirect Energy': {
    de: 'Einen Energieangriff nicht nur abfangen, sondern zurückschicken - auf den Angreifer oder ein anderes Ziel.',
    en: 'Not merely catching an energy attack but sending it back - at the attacker or somewhere else.' },
  "Accelerate Another's Healing": {
    de: 'Einem anderen zusätzliche Heilungswürfe verschaffen.',
    en: 'Giving someone else extra healing rolls.' },
  'Aura of Uneasiness': {
    de: 'Eine Aura ausstrahlen, die anderen Unbehagen einflößt und sie auf Abstand hält. Sith-Disziplin, bringt einen Punkt der dunklen Seite ein.',
    en: 'Giving off an aura of disquiet that keeps others at arm’s length. A Sith discipline; earns a Dark Side Point.' },
  "Control Another's Disease": {
    de: 'Die Krankheit eines anderen zurückdrängen.',
    en: 'Pushing back someone else’s disease.' },
  "Control Another's Pain": {
    de: 'Einem anderen den Schmerz nehmen, damit er trotz Verletzung handeln kann.',
    en: 'Taking another’s pain away so they can act despite the wound.' },
  'Control Breathing': {
    de: 'Den Sauerstofffluss im eigenen Körper steuern - Luft anhalten weit über das Übliche hinaus.',
    en: 'Controlling the flow of oxygen in your own body - holding your breath far past the usual.' },
  'Detoxify poison in Another': {
    de: 'Ein Gift im Körper eines anderen unschädlich machen.',
    en: 'Neutralising a poison in someone else’s body.' },
  'Detoxify Another’s Poison': {
    de: 'Ein Gift im Körper eines anderen unschädlich machen - die ausführlichere Fassung derselben Kraft.',
    en: 'Neutralising a poison in someone else’s body - the fuller version of the same power.' },
  'Electronic Manipulation': {
    de: 'Den eigenen Zorn in die Schaltkreise einer Maschine lenken und sie umprogrammieren - allerdings nur zurück auf ihren ursprünglichen Stand. Sith-Disziplin.',
    en: 'Channelling anger into a machine’s circuits and reprogramming it - but only back to how it was. A Sith discipline.' },
  'Feed on Dark Side': {
    de: 'Sich von der dunklen Seite nähren und daraus Kraft ziehen. Bringt einen Punkt der dunklen Seite ein.',
    en: 'Feeding on the dark side and drawing strength from it. Earns a Dark Side Point.' },
  'Force Lightning': {
    de: 'Blitze aus den Fingern schleudern, die Schmerz und Schaden anrichten. Bringt sofort einen Punkt der dunklen Seite ein - ohne Ausnahme.',
    en: 'Hurling lightning from the fingers, dealing pain and damage. Earns a Dark Side Point at once - no exceptions.' },
  'Hatred': {
    de: 'Den eigenen Hass als Druckwelle aus Machtenergie entladen, die alle in der Nähe trifft. Bringt einen Punkt der dunklen Seite ein.',
    en: 'Releasing your hatred as a blast of Force energy that strikes everyone nearby. Earns a Dark Side Point.' },
  'Inflict Pain': {
    de: 'Einem anderen Schmerz zufügen, ohne ihn zu berühren. Bringt einen Punkt der dunklen Seite ein.',
    en: 'Inflicting pain on another without touching them. Earns a Dark Side Point.' },
  'Place Another in Hibernation Trance': {
    de: 'Jemand anderen in die tiefe Starre versetzen - etwa um einen Schwerverletzten über die Zeit zu bringen.',
    en: 'Putting someone else into the deep trance - to carry a badly wounded person through, for instance.' },
  "Remove Another's Fatigue": {
    de: 'Einem anderen die Erschöpfung nehmen.',
    en: 'Taking the exhaustion out of someone else.' },
  'Return Another to Consciousness': {
    de: 'Einen Bewusstlosen wieder zu sich bringen.',
    en: 'Bringing someone unconscious back round.' },
  'Transfer Force': {
    de: 'Eigene Lebenskraft an einen tödlich Verletzten abgeben und ihn so vor dem Sterben bewahren.',
    en: 'Giving your own life force to someone mortally wounded, and so keeping them from dying.' },
  'Waves of Darkness': {
    de: 'Hass, Neid und Gier als Wellen dunkler Energie nach außen schleudern; wer hineingerät, verliert die Orientierung. Sith-Disziplin.',
    en: 'Hurling hatred, envy and greed outwards in waves of dark energy; anyone caught in them loses their bearings. A Sith discipline.' },
  'Force Channel': {
    de: 'Eine meditative Kampfhaltung: die Macht fließt stärker durch den Jedi - mehr Schaden im Angriff, mehr Widerstand gegen fremde Kräfte.',
    en: 'A meditative battle stance: the Force runs stronger through the Jedi - more damage dealt, more resistance to other powers.' },
  'Force Weapon': {
    de: 'Eine gewöhnliche Nahkampfwaffe mit der Macht aufladen, sodass sie härter trifft.',
    en: 'Charging an ordinary melee weapon with the Force so that it strikes harder.' },
  'Overload Saber': {
    de: 'Die eigene Klinge überladen: mehr Schaden, auf Kosten der Waffe.',
    en: 'Overloading your own blade: more damage, at the weapon’s expense.' },
  'Slow': {
    de: 'Einem anderen eine bleierne Schwere auflegen, die ihn kaum noch handeln lässt.',
    en: 'Laying a leaden weariness on someone so that they can barely act.' },
  'Drain Energy': {
    de: 'Energiezellen und Geräte leersaugen - vom Datapad über das Energiepack bis zum tragbaren Generator.',
    en: 'Draining power cells and devices - datapads, power packs, portable generators.' },
  'Fear': {
    de: 'Blanke Angst in jemandem wecken, bis er flieht oder erstarrt. Bringt einen Punkt der dunklen Seite ein.',
    en: 'Waking sheer fear in someone until they run or freeze. Earns a Dark Side Point.' },

  /* ---------------- Sense & Alter ---------------- */
  'Greater Force Shield': {
    de: 'Ein starker Machtschild um den eigenen Körper, der Schläge wie Schüsse abfängt.',
    en: 'A strong Force shield around your body, catching blows and shots alike.' },
  "Dim Another's Senses": {
    de: 'Die Wahrnehmung eines anderen trüben, solange die Kraft gehalten wird.',
    en: 'Dulling another’s perception for as long as the power is held.' },
  'Force Wind': {
    de: 'Luftströmungen zu einem Wirbelsturm bündeln, der Menschen hochreißt und fortschleudert. Sith-Disziplin.',
    en: 'Gathering air currents into a tornado that lifts people up and flings them away. A Sith discipline.' },
  'Lesser Force Shield': {
    de: 'Ein schwacher Machtschild um den eigenen Körper - die Vorstufe zum großen.',
    en: 'A light Force shield around your body - the lesser form of the greater one.' },
  'Force Breach': {
    de: 'Einem Gegner alle gehaltenen Machtkräfte auf einen Schlag abschalten.',
    en: 'Shutting down every Force power an opponent is holding, all at once.' },
  'Force Blinding': {
    de: 'Einen Gegner vorübergehend blenden.',
    en: 'Blinding an opponent for a while.' },

  /* ---------------- Alter: moving the world ---------------- */
  'Kinetic Combat': {
    de: 'Eine Nahkampfwaffe oder das Lichtschwert auf Entfernung führen, als hielte man es in der Hand.',
    en: 'Wielding a melee weapon or lightsaber at a distance, as though it were in your hand.' },
  'Bolt of Hatred': {
    de: 'Eine Kugel aus reinem Hass formen und schleudern. Sith-Disziplin, bringt einen Punkt der dunklen Seite ein.',
    en: 'Forming and hurling a sphere of pure hatred. A Sith discipline; earns a Dark Side Point.' },
  'Dark Side Web': {
    de: 'Ein Netz aus Energie der dunklen Seite auslegen, das Gefangene festhält. Sith-Disziplin.',
    en: 'Spinning a web of dark side energy that holds whoever is caught in it. A Sith discipline.' },
  'Force Push': {
    de: 'Jemanden mit der Macht wegstoßen, ohne ihn zu berühren.',
    en: 'Shoving someone away with the Force, without touching them.' },
  'Injure / Kill': {
    de: 'Durch Berührung von innen verletzen oder töten. Bringt einen Punkt der dunklen Seite ein.',
    en: 'Injuring or killing from the inside, by touch. Earns a Dark Side Point.' },
  'Telekinesis': {
    de: 'Gegenstände auf Sicht bewegen - vom Werkzeug bis zu zig Tonnen, je nach Können.',
    en: 'Moving objects in sight - from a tool to tens of tonnes, depending on skill.' },
  'Force Whirlwind': {
    de: 'Einen Wirbel heraufrufen, der ein Ziel hochhebt und herumschleudert. Gegen Lebende eingesetzt: ein Punkt der dunklen Seite.',
    en: 'Calling up a whirl that lifts a target and flings it about. Used against the living: a Dark Side Point.' },
  'Force Burst': {
    de: 'Die Macht zu einer Energiekugel sammeln und sie entladen - je länger gesammelt, desto heftiger.',
    en: 'Gathering the Force into a sphere of energy and loosing it - the longer the gathering, the heavier the blow.' },
  'Force Eruption': {
    de: 'Machtenergie in den Boden leiten und sie an einer gewählten Stelle ausbrechen lassen.',
    en: 'Channelling Force energy into the ground and making it erupt at a chosen spot.' },
  'Force Flight': {
    de: 'Sich selbst durch die Luft bewegen, statt zu gehen - bis etwa zwanzig Meter weit.',
    en: 'Moving yourself through the air instead of walking - up to about twenty metres.' },
  'Force Potency': {
    de: 'Eine meditative Kampfhaltung, die jeden Machtangriff härter treffen lässt.',
    en: 'A meditative battle stance that makes every Force attack land harder.' },
  'Forcequake': {
    de: 'Den Boden an einer Stelle erbeben lassen, sodass alle dort den Halt verlieren.',
    en: 'Shaking the ground in one place so that everyone there loses their footing.' },
  'Inspire': {
    de: 'Verbündeten Zuversicht einflößen, die sie über sich hinauswachsen lässt.',
    en: 'Filling allies with a confidence that lifts them past themselves.' },
  'Ball Lightning': {
    de: 'Einen Blitzball formen und werfen, der beim Aufschlag entlädt. Bringt einen Punkt der dunklen Seite ein.',
    en: 'Forming and throwing a ball of lightning that discharges on impact. Earns a Dark Side Point.' },
  'Crushing Darkness': {
    de: 'Ein Ziel in zusammengeballter Dunkelheit zerquetschen. Bringt einen Punkt der dunklen Seite ein.',
    en: 'Crushing a target in gathered darkness. Earns a Dark Side Point.' },
  'Devastating Force': {
    de: 'Einen Machtangriff weit über sein übliches Maß hinaus verstärken. Bringt einen Punkt der dunklen Seite ein.',
    en: 'Driving a Force attack far past its usual measure. Earns a Dark Side Point.' },
  'Empower Force': {
    de: 'Alle Machtkräfte mit veränderlicher Wirkung um die Hälfte verstärken - Schaden, Boni, alles.',
    en: 'Raising every Force power with a variable effect by half - damage, bonuses, all of it.' },
  'Extend Force': {
    de: 'Die Wirkungsdauer gehaltener Machtkräfte verdoppeln.',
    en: 'Doubling how long sustained Force powers last.' },
  'Force Blast': {
    de: 'Machtenergie als gebündelten Stoß nach vorn entladen. Keine Regelbeschreibung in den vorliegenden Bänden - die Zeile gibt wieder, was die Kraft bewirkt.',
    en: 'Loosing Force energy as a focused blast. No rules text in the books at hand - this line states what the power does.' },
  'Repulse': {
    de: 'Eine Druckwelle in alle Richtungen entladen, die alles in der Nähe fortschleudert. Keine Regelbeschreibung in den vorliegenden Bänden.',
    en: 'Loosing a shockwave in every direction that throws back everything nearby. No rules text in the books at hand.' },

  /* ---------------- Control & Sense ---------------- */
  'Lifemerge': {
    de: 'Im Augenblick des Todes mit der Macht verschmelzen, statt einfach zu vergehen.',
    en: 'Merging with the Force at the moment of death, instead of simply ending.' },
  'Farseeing': {
    de: 'Weit entfernte Menschen und Orte sehen - mit Mühe auch Vergangenes oder Kommendes.',
    en: 'Seeing distant people and places - and, with effort, the past or what is to come.' },
  'Lifebond': {
    de: 'Ein dauerhaftes Band zu einem anderen knüpfen: man spürt einander über jede Entfernung.',
    en: 'Tying a lasting bond to another: you feel each other across any distance.' },
  'Lightsaber Combat': {
    de: 'Das Lichtschwert durch die Macht führen und zugleich die Absichten des Gegners spüren - die Kraft, die einen Jedi im Duell ausmacht.',
    en: 'Guiding the lightsaber through the Force while sensing the opponent’s intent - the power that makes a Jedi in a duel.' },
  'Projective Telepathy': {
    de: 'Einem anderen Gedanken senden, ohne ein Wort zu sprechen.',
    en: 'Sending thoughts to another without a word spoken.' },
  'Sith Sorcery': {
    de: 'Die Geister toter Sith-Lords in den eigenen Körper rufen und ihre Kraft nutzen - um den Preis, besessen zu werden. Bringt einen Punkt der dunklen Seite ein.',
    en: 'Calling the spirits of dead Sith lords into your body and using their power - at the risk of possession. Earns a Dark Side Point.' },
  'Sith Sword Combat': {
    de: 'Wie Lichtschwertkampf, aber auf Abwehr angelegt: das Sith-Schwert fängt, was kommt.',
    en: 'Like lightsaber combat, but built around defence: the Sith sword catches what comes.' },

  /* ---------------- Control, Sense & Alter ---------------- */
  'Affect Mind': {
    de: 'Wahrnehmung, Erinnerung oder Schlussfolgerung eines anderen verbiegen - der Trick, mit dem Jedi an Wachen vorbeikommen.',
    en: 'Bending another’s perception, memory or conclusions - the trick that gets Jedi past guards.' },
  'Alchemy': {
    de: 'Sith-Alchemie: Lebewesen und Stoffe mit der dunklen Seite umformen. Bringt einen Punkt der dunklen Seite ein.',
    en: 'Sith alchemy: reshaping creatures and materials with the dark side. Earns a Dark Side Point.' },
  'Battle Meditation': {
    de: 'Eine ganze Streitmacht im Kampf lenken und zusammenhalten - je mehr Köpfe, desto schwerer.',
    en: 'Steering and holding together a whole force in battle - the more heads, the harder.' },
  'Control Mind': {
    de: 'Einen anderen übernehmen und steuern. Bringt einen Punkt der dunklen Seite ein.',
    en: 'Taking another over and steering them. Earns a Dark Side Point.' },
  'Create Force Storm': {
    de: 'Einen Machtsturm heraufrufen, der alles im Umkreis zerreißt - eine der zerstörerischsten Kräfte überhaupt.',
    en: 'Calling up a Force storm that tears apart everything around - one of the most destructive powers there is.' },
  'Doppelganger': {
    de: 'Ein Trugbild des eigenen Ichs erschaffen, das Gegner in die Irre führt. Keine Regelbeschreibung in den vorliegenden Bänden.',
    en: 'Creating a false image of yourself to mislead opponents. No rules text in the books at hand.' },
  'Drain Life Energy': {
    de: 'Einem anderen Lebenskraft entziehen und sie für sich nutzen. Sith-Disziplin, bringt einen Punkt der dunklen Seite ein.',
    en: 'Draining life force from another and taking it for yourself. A Sith discipline; earns a Dark Side Point.' },
  'Drain Life Essence': {
    de: 'Mehreren Opfern zugleich das Leben entziehen. Bringt einen Punkt der dunklen Seite ein.',
    en: 'Draining the life from several victims at once. Earns a Dark Side Point.' },
  'Enhanced Coordination': {
    de: 'Viele Menschen zu einem Handeln aus einem Guss zusammenführen - von einer Handvoll bis zu Tausenden.',
    en: 'Bringing many people to act as one - from a handful to thousands.' },
  'Force Harmony': {
    de: 'Mehrere Machtnutzer zu einem gemeinsamen Ganzen verbinden, das mehr vermag als jeder für sich.',
    en: 'Joining several Force users into one whole that can do more than any of them alone.' },
  'Illusion': {
    de: 'Eine Sinnestäuschung erschaffen, die ein Ziel für wirklich hält.',
    en: 'Creating an illusion that a target takes for real.' },
  'Memory Wipe': {
    de: 'Einem anderen Erinnerungen nehmen. Bringt einen Punkt der dunklen Seite ein.',
    en: 'Taking memories away from another. Earns a Dark Side Point.' },
  'Projected Fighting': {
    de: 'Auf Entfernung kämpfen: die Schläge treffen, als stünde man unmittelbar vor dem Gegner.',
    en: 'Fighting at a distance: the blows land as though you stood right in front of the opponent.' },
  'Telekinetic Kill': {
    de: 'Mit der Macht zudrücken, bis das Ziel erstickt - der Würgegriff aus der Ferne. Bringt einen Punkt der dunklen Seite ein.',
    en: 'Squeezing with the Force until the target chokes - the grip from across the room. Earns a Dark Side Point.' },
  'Transfer Life': {
    de: 'Den eigenen Geist in einen anderen Körper verlegen.',
    en: 'Moving your own spirit into another body.' },
  'Balance of the Force': {
    de: 'Beide Seiten der Macht zugleich anrufen - ein waghalsiger Weg, der bei Misslingen zur dunklen Seite führt.',
    en: 'Drawing on both sides of the Force at once - a reckless road that ends in the dark side when it fails.' },
  'Force Mastery': {
    de: 'Eine meditative Kampfhaltung, die den Jedi mächtiger erscheinen lässt und gehaltene Kräfte länger wirken lässt.',
    en: 'A meditative battle stance that makes the Jedi seem greater and keeps sustained powers running longer.' },
  'Machine Meld': {
    de: 'Mit einer Maschine verschmelzen und sie unmittelbar steuern - vom Rechnerterminal bis zum Großkampfschiff.',
    en: 'Melding with a machine and steering it directly - from a computer terminal to a capital ship.' },
  'Technometry': {
    de: 'Ein Gerät durch die Macht befragen: wozu es dient, was es erlebt hat, wie es bedient wird.',
    en: 'Questioning a device through the Force: what it is for, what it has seen, how it is worked.' },
  'Teleport': {
    de: 'Sich an einen anderen Ort versetzen - je vertrauter das Ziel, desto eher gelingt es.',
    en: 'Moving yourself to another place - the better you know the destination, the likelier it works.' },
  'Death Field': {
    de: 'Allen in der Umgebung zugleich Lebenskraft entziehen und sie in sich sammeln. Bringt einen Punkt der dunklen Seite ein.',
    en: 'Draining life from everyone around at once and gathering it into yourself. Earns a Dark Side Point.' },
  'Force Walk': {
    de: 'Die ruhelosen Geister toter Sith an sich binden und ihre Kraft anzapfen. Bringt einen Punkt der dunklen Seite ein.',
    en: 'Binding the restless spirits of dead Sith to yourself and tapping their power. Earns a Dark Side Point.' },
  'Voss Healing Ritual': {
    de: 'Heilritual der Voss-Mystiker: Kraft von Umstehenden sammeln und in einen Verletzten lenken.',
    en: 'The healing rite of the Voss mystics: gathering strength from bystanders and steering it into the injured.' },

  /* ---------------- Special ---------------- */
  'Force Scream': {
    de: 'Ein unfreiwilliger Ausbruch: verliert ein Dunkler Jedi die Beherrschung, entlädt sich sein Zorn als zerstörerischer Schrei.',
    en: 'An involuntary outburst: when a Dark Jedi loses their temper, the anger discharges as a destructive scream.' },
};


/* The one sentence for a name, in the language currently set. A
   specialization ("Blaster: hold-out blaster") has no entry of its own and
   falls back to the skill in front of the colon - which is what it is a
   specialization of. An unknown name returns an empty string: no text is
   better than the wrong one. */
function infoText(art, name) {
  const buch = art === 'power' ? POWER_INFO : SKILL_INFO;
  if (!buch || !name) return '';
  let e = buch[name];
  if (!e) {
    const i = String(name).indexOf(':');
    if (i > 0) e = buch[String(name).slice(0, i).trim()];
  }
  const sprache = (typeof LANG === 'string' && LANG) || 'en';
  return e ? (e[sprache] || e.en || '') : '';
}
