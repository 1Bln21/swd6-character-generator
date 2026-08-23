/* ===========================================================================
   Expanded workshop rules for starships
   ---------------------------------------------------------------------------
   Source: "Galaxy Guide 6: Tramp Freighters" (West End Games, WEG40095),
   Chapter Eight - "Ship Modifications and Repairs".

   This file is maintained by hand (unlike gendata.js, which is generated
   from the Excel templates, and pdfdata-*.js from the compilations).

   The rules text of the mishap tables deliberately stays English - like the
   app's other game terms (skills, species, equipment). Only the controls
   around them are translated.

   An important note from the source: these rules were written for light
   freighters. They are not meant for starfighters or capital combat
   ships.
   =========================================================================== */

const TRAMP_RULES = {

  source: 'Galaxy Guide 6: Tramp Freighters (WEG 40095), Chapter Eight',

  /* --------------------------------------------------------------------
     When does a mishap happen?
     A modified system fails when the player rolls a 1 on the Wild Die AND
     the GM turns that into a complication rather than merely subtracting
     the highest die. Then roll 1D, add the modification's mishap modifier
     and look the result up in this table.
     -------------------------------------------------------------------- */
  severity: [
    { max: 2, key: 'minor' },
    { max: 5, key: 'moderate' },
    { max: 99, key: 'catastrophic' },
  ],

  /* Installation time by the difficulty of the modification. Paid overtime
     or a hefty bribe halves the time but costs twice as much. */
  installTime: [
    { diff: 'Very Easy',      time: '1 hour'  },
    { diff: 'Easy',           time: '6 hours' },
    { diff: 'Moderate',       time: '1 day'   },
    { diff: 'Difficult',      time: '2 days'  },
    { diff: 'Very Difficult', time: '1 week'  },
    { diff: 'Heroic',         time: '1 month' },
  ],

  /* --------------------------------------------------------------------
     Spaceport classes of the Imperial Space Ministry
     -------------------------------------------------------------------- */
  spaceports: [
    { key: 'landing',  docking: 0,
      de: { name: 'Landefeld',
            desc: 'Nur eine planierte Fläche, kein Kontrollturm – beim Landen droht Zusammenstoß mit startenden Schiffen. Betankung und Reparatur sind nicht garantiert und von schlechter Qualität, dafür günstig.' },
      en: { name: 'Landing Field',
            desc: 'A cleared, level area with no flight control tower – landing ships risk colliding with departing vessels. No guaranteed refueling or repair services; what exists is low quality but fairly affordable.' } },
    { key: 'limited',  docking: 0,
      de: { name: 'Eingeschränkter Service',
            desc: 'Kleiner Kontrollturm mit Peilsender. Wartungsschuppen sind mietbar, einfache Reparaturen muss die Besatzung selbst erledigen. Größere Vorräte gibt es nur anderswo.' },
      en: { name: 'Limited Services',
            desc: 'Small control tower with a homing beacon. Maintenance sheds can be rented, but primitive repairs must be assayed by the ship\'s own crew. All major supplies must be purchased elsewhere.' } },
    { key: 'standard', docking: 50,
      de: { name: 'Standard-Klasse',
            desc: 'Voll besetzter Kontrollturm, Restocking und eine kleine Werft für kleinere Reparaturen und Umbauten. Umbauten kosten bis zum Doppelten und dauern über doppelt so lange, die Arbeit ist aber ordentlich.' },
      en: { name: 'Standard Class',
            desc: 'Fully staffed and equipped flight control tower, restocking services and a small shipyard for minor repairs and modifications. Work can cost up to double and take more than twice as long, though quality is fairly good.' } },
    { key: 'stellar',  docking: 50,
      de: { name: 'Stellar-Klasse',
            desc: 'Landeplätze für nahezu jeden Schiffstyp, mehrere Werften ringsum, die fast jeden Umbau ausführen. Fast immer mit imperialem Zollbüro. Arbeit von fortgeschrittener Qualität zu mittleren Preisen.' },
      en: { name: 'Stellar Class',
            desc: 'Facilities for landing and docking nearly any type and class of vessel, with several shipyards capable of nearly any repair or customization. Almost always an Imperial Customs office on site. Advanced quality, moderately affordable.' } },
    { key: 'imperial', docking: 150,
      de: { name: 'Imperiale Klasse',
            desc: 'Luxuriös und modern, mit riesigen Lande- und Wartungsanlagen. Schnelle, hochwertige Arbeit – aber teuer. Der Zoll ist mit tragbaren Scannern ausgerüstet, das Militär stark präsent, und Kleinigkeiten werden mit voller Härte geahndet.' },
      en: { name: 'Imperial Class',
            desc: 'Luxurious and modern, with an impressive array of landing fields and maintenance facilities. Rapid, high-quality work – but it does not come cheap. Customs is staffed by competent officers with portable scanners, and the Empire keeps a formidable military presence. Troublemakers are unwelcome.' } },
  ],

  /* --------------------------------------------------------------------
     Running costs
     -------------------------------------------------------------------- */
  running: {
    restockBaseTypical: 10,   // credits, well-connected routes
    restockBaseRemote:  35,   // credits, remote ports (Outer Rim)
    /* restocking = base fee x (crew + passengers) x days of consumables */
    overhaulJumps:      20,   // a full overhaul every 20 hyperspace jumps
    overhaulAvg:      1000,
    overhaulHeavy:    5000,   // heavily modified or heavily used ships
    repairBayPerDay:   100,   // renting a fully equipped repair bay
    navComputer:      2000,   // replacement navigation computer
  },

  /* rules of thumb from the chapter */
  economics: {
    usedPartsPct:   0.5,   // used parts cost half - but are unreliable
    resalePct:      0.25,  // shipyards pay at most 25 % for a removed part
    salvagePct:     0.05,  // if the part is damaged: scrap value only
    laborMinPct:    0.2,   // having it installed costs 20 to 50 % of the work
    laborMaxPct:    0.5,
    repairLaborPct: 1.0,   // repairs by a third party: about as much as the parts
    weaponPermitPct: 0.3,  // Imperial weapon permit: 30 % of the purchase price
    linkCostPerWeapon: 100,
  },

  /* For the hyperdrive the spreadsheet knows only the x2, x1 and x1/2
     steps. The source also names the entry step "x4/x3 (or more)". */
  hyperImproveExtra: [
    { label: 'x3', diff: 'Easy', costPct: 0.10, mishap: 1 },
  ],

  /* --------------------------------------------------------------------
     House rule: one step beyond the book
     ---------------------------------------------------------------------
     Galaxy Guide 6 caps the hull explicitly at +1D+1 ("Due to current
     technology standards, it is impossible to improve the hull code by
     more than +1D+1", p. 36). For shields the chapter gives no improvement
     table at all - p. 40 only says shields are "almost impossible to
     improve beyond their initial strength"; the steps in the generator
     come from the Excel template.

     The +1D+2 step therefore goes beyond both sources. It was added at a
     GM's request and follows maneuverability, which in the book does reach
     +1D+2 (Heroic, 25 %, mishap modifier +3). Anyone playing strictly by
     the book removes this list.
     -------------------------------------------------------------------- */
  hullShieldExtra: [
    { label: '+1D+2', diff: 'Heroic', costPct: 0.25, mishap: 3, houseRule: true },
  ],

  /* --------------------------------------------------------------------
     Weapon summary from Chapter Eight
     The prices are for fitting to a light freighter; the weight comes off
     the cargo hold. For legal armament the Empire demands a permit - 30 %
     of the purchase price, rolled for separately per weapon.

     All values at starfighter scale. Transcribed by hand, because the book
     exists only as a scan (see the head of this file).
     -------------------------------------------------------------------- */
  /* The GG6 table gives no ranges. They are filled in here from the usual
     values of identical starfighter-scale weapons in the catalogue (the
     commonest space and atmosphere ranges per weapon type), so that a gun
     taken from GG6 does not end up with no range at all. */
  weapons: [
    { name: 'Taim & Bak KX-3 Light Blaster Cannon', scale: 'Starfighter',
      fireControl: '1D', damage: '1D', cost: 1000, weight: 1,
      spaceRange: '1-3/12/25', atmRange: '100-300/1.2/2.5 km' },
    { name: 'Kuat Vonak Light Laser Cannon', scale: 'Starfighter',
      fireControl: '2D', damage: '2D', cost: 1500, weight: 2,
      spaceRange: '1-3/12/25', atmRange: '100-300/1.2/2.5 km' },
    { name: 'Arakyd Tomral Heavy Laser Cannon', scale: 'Starfighter',
      fireControl: '2D', damage: '5D', cost: 3000, weight: 4,
      spaceRange: '1-3/12/25', atmRange: '100-300/1.2/2.5 km' },
    { name: 'Incom W-34t Turbolaser', scale: 'Starfighter',
      fireControl: '3D', damage: '7D', cost: 9000, weight: 5,
      spaceRange: '3-15/35/75', atmRange: '6-30/70/150 km',
      note: 'Illegal on a private vessel. Can only fire every other round, being jury-rigged to a freighter.' },
    { name: 'Comar f-2 Light Ion Cannon', scale: 'Starfighter',
      fireControl: '1D', damage: '2D', cost: 1000, weight: 0.5,
      spaceRange: '1-3/12/25', atmRange: '100-300/1.2/2.5 km',
      note: 'Ionizes rather than destroys – disables the target\'s electronics.' },
    { name: 'Comar f-4 Medium Ion Cannon', scale: 'Starfighter',
      fireControl: '2D', damage: '3D', cost: 1500, weight: 1,
      spaceRange: '1-3/12/25', atmRange: '100-300/1.2/2.5 km',
      note: 'Ionizes rather than destroys – disables the target\'s electronics.' },
    { name: 'Comar f-9 Heavy Ion Cannon', scale: 'Starfighter',
      fireControl: '4D', damage: '4D', cost: 3000, weight: 2,
      spaceRange: '1-3/12/25', atmRange: '100-300/1.2/2.5 km',
      note: 'Ionizes rather than destroys – disables the target\'s electronics.' },
    { name: 'Arakyd Hi-fex Proton Torpedo Launcher', scale: 'Starfighter',
      fireControl: '2D', damage: '9D', cost: 2500, weight: 2,
      spaceRange: '1/3/7', atmRange: '100/300/700',
      note: 'Includes a 12-torpedo rack. Replacement torpedo: 800 credits.' },
    { name: 'Arakyd Morne-3 Concussion Missile Launcher', scale: 'Starfighter',
      fireControl: '1D', damage: '8D', cost: 3500, weight: 3,
      spaceRange: '1/3/7', atmRange: '50-100/300/700',
      note: 'Includes a 10-missile rack. Replacement missile: 500 credits.' },
    { name: 'Tractor Beam Projector', scale: 'Starfighter',
      fireControl: '2D', damage: '2D', cost: 8000, weight: 15,
      spaceRange: '1-5/15/30', atmRange: '100-500/1.5/3 km',
      note: 'Pulls a smaller vessel closer; against a larger ship the freighter is drawn in instead.' },
  ],

  /* Up to three identical weapons can be linked. They must have the same
     damage value. A second firing position for the same weapon likewise
     costs 100 credits and counts as +1 on the mishap tables. */
  linked: [
    { count: 2, bonus: '+1D' },
    { count: 3, bonus: '+2D' },
  ],

  /* --------------------------------------------------------------------
     Repair costs - as a percentage of the ship's original purchase price
     (for weapons: of the weapon's price). The prices are for new parts
     with the characters doing the work themselves.
     -------------------------------------------------------------------- */
  repairs: {
    maneuver: { deName: 'Manövrierfähigkeit verloren', enName: 'Maneuverability lost', ofWeapon: false, rows: [
      { label: '-1D',        diff: 'Easy',           pct: 0.10 },
      { label: '-2D',        diff: 'Moderate',       pct: 0.15 },
      { label: '-3D or more', diff: 'Difficult',     pct: 0.20 },
    ] },
    moves: { deName: 'Move-Punkte verloren', enName: 'Moves lost', ofWeapon: false, rows: [
      { label: '1', diff: 'Easy',           pct: 0.10 },
      { label: '2', diff: 'Moderate',       pct: 0.15 },
      { label: '3', diff: 'Difficult',      pct: 0.20 },
      { label: '4', diff: 'Very Difficult', pct: 0.25 },
    ] },
    shields: { deName: 'Schilde verloren', enName: 'Shields lost', ofWeapon: false, rows: [
      { label: '1D',  diff: 'Easy',           pct: 0.05 },
      { label: '2D',  diff: 'Moderate',       pct: 0.05 },
      { label: '3D',  diff: 'Difficult',      pct: 0.05 },
      { label: '4D+', diff: 'Very Difficult', pct: 0.10 },
    ] },
    drive: { deName: 'Antrieb oder Generator zerstört', enName: 'Drive or generator destroyed', ofWeapon: false, rows: [
      { label: 'identischer Ersatz / identical unit', diff: 'Difficult', pct: 0.35 },
    ] },
    hyperdrive: { deName: 'Hyperantrieb beschädigt', enName: 'Hyperdrive damaged', ofWeapon: false, rows: [
      { label: 'Reparatur / repair', diff: 'Moderate', pct: 0 },
    ] },
    weapons: { deName: 'Waffe beschädigt', enName: 'Weapon damaged', ofWeapon: true, rows: [
      { label: 'Lightly',  diff: 'Easy',           pct: 0.15 },
      { label: 'Heavily',  diff: 'Moderate',       pct: 0.25 },
      { label: 'Severely', diff: 'Very Difficult', pct: 0.35 },
    ] },
  },

  /* --------------------------------------------------------------------
     Mishap tables: five systems, three severities each, 1D each
     -------------------------------------------------------------------- */
  systems: [
    { key: 'drive',    de: 'Sublicht-Antrieb',       en: 'Sublight Drives'  },
    { key: 'maneuver', de: 'Manövrierfähigkeit',     en: 'Maneuverability'  },
    { key: 'hyper',    de: 'Hyperantrieb',           en: 'Hyperdrives'      },
    { key: 'hull',     de: 'Rumpf',                  en: 'Hull'             },
    { key: 'weapon',   de: 'Bewaffnung',             en: 'Weaponry'         },
  ],

  mishaps: {

    drive: {
      minor: [
        'Engine power transfer conduit blows out. Space is -2 until repaired (Easy repair roll).',
        'Drive system stalls. Ship must continue at same speed for 2 rounds.',
        'Power surges increase difficulty of all maneuvers by +5 for 1 round.',
        'Engine reaching unsafe operating parameters: ship must make no maneuvers for the next 2 rounds or circuits burn out, adding +10 to the difficulty of all maneuvers until repaired (Easy difficulty).',
        'Engine power surges. Add +5 to the difficulty of all maneuvers, including landing. Repairs cost 10% of engine cost.',
        'Engine power conduits blow out. All maneuvers at +10 to difficulty until rerouted (Moderate repair roll, takes 2 rounds).',
      ],
      moderate: [
        'Power surges. Add +10 to the difficulty of all maneuvers for 2D rounds.',
        'Drive circuit link failure. Roll 1D at the beginning of each round. On 1-2, controls are considered ionized for that round.',
        'Engine power transfer conduit blows out. Space is -2 until repaired (Moderate repair roll).',
        'Drive system stalls. Ship must continue at same speed for 2 rounds, maneuverability considered 0D for 5 rounds.',
        'Temporary drive failure. Ship is dead in space for 1D rounds.',
        'Engine reaching unsafe operating parameters: ship must make no maneuvers for the next 2 rounds or circuits burn out, adding +10 to the difficulty of all maneuvers until repaired (Moderate difficulty).',
      ],
      catastrophic: [
        'Engine overloads while landing or docking as a result of stresses. Replacement parts cost 25% of the original cost of the engine.',
        'Engine overload. Engine shuts down, with no thrust, maneuverability is effectively 0D. Add +15 to all astrogation difficulties.',
        'Engine overloads and is destroyed. Must be completely replaced.',
        'Engine overload. Engine destroyed, must be replaced; anyone near the engine compartment suffers 4D damage from explosion and smoke inhalation.',
        'Engine overload and power surge. Engine destroyed and hyperdrive disabled (Difficult repair roll to fix).',
        'Drive system fails as ship is on final approach for landing. Pilot must make Difficult piloting rolls not to crash the ship (5D damage to all aboard if the ship crashes).',
      ],
    },

    maneuver: {
      minor: [
        'Control circuit malfunction causes maneuverability to be -1D for 1 round.',
        'Alluvial dampers misaligned. Maneuverability at -2D until an Easy repair roll is made.',
        'Minor radiation leak: nothing immediately dangerous, but must be repaired before the next hyperspace jump (Easy repair roll), or increase all astrogation difficulties by +10 and anyone in the engine room suffers 4D radiation damage.',
        'Lateral thrusters misfire. Add +5 to the difficulty of any maneuvers and enemy ships get a +5 bonus to hit this round.',
        'Engine maneuvering circuitry blows. Add +5 to the difficulty of all maneuvers until the circuits are replaced (an Easy repair roll if the characters have the circuits on hand).',
        'System short. Maneuverability is 0D for one round.',
      ],
      moderate: [
        'Control circuit malfunction causes maneuverability to be -2D for 1 round.',
        'Radiation leak: nothing immediately dangerous, but must be repaired before the next hyperspace jump (Moderate repair roll), or increase all astrogation difficulties by +10 and double all hyperspace travel times. Anyone in the engine room suffers 4D radiation damage.',
        'Alluvial dampers misaligned. Maneuverability at -2D until a Moderate repair roll is made.',
        'System short. Maneuverability is 0D for 1D rounds.',
        'Engine maneuvering circuitry blows. Add +10 to the difficulty of all maneuvers until the circuits are replaced (an Easy repair roll if the characters have the circuits on hand).',
        'Lateral thrusters misfire. Add +5 to the difficulty of any maneuvers and enemy ships get a +5 bonus to hit for the next 3 rounds.',
      ],
      catastrophic: [
        'Lateral thrusters blow. Maneuverability is 0D and the system must be completely replaced.',
        'System short. Maneuverability is 0D for 1 round. The short remains: at the beginning of each additional round, roll 1D. On a 1-2, the system shorts out for that round.',
        'Maneuvering thrusters firing randomly. Increase difficulty of all maneuvers by +10 until the system is shut down (Easy piloting roll) and repaired (Moderate repair roll, requires 500 credits worth of parts).',
        'Serious power surge. Maneuverability is 0D for 1D rounds and feedback destroys one ship\'s system. Roll 1D: 1 hyperdrive; 2-3 ion drive; 4 sensors; 5 communications; 6 one weapon (determine randomly).',
        'Major radiation leak. Double all hyperspace travel times; anyone next to the engine compartments suffers 6D radiation damage.',
        'Lateral thrusters blow up (maneuverability 0D) and power feedback lowers Space by -2 for 1D rounds.',
      ],
    },

    hyper: {
      minor: [
        'Hyperdrive fluctuation. The trip takes 1D hours longer than normal.',
        'Hyperdrive motivator damaged. Ship will not enter hyperspace until the motivator is fixed (Very Easy repair roll).',
        'Hyperdrive power flux. Ship will not enter hyperspace until 2 rounds after the hyperdrive is engaged.',
        'Power overload: emergency circuits shunt energy into an alternate system. Roll 1D to see which system is destroyed: 1-2 communications; 3-4 sensors; 5-6 lose 1D of shields.',
        'Hyperdrive misaligned. A character must make an Easy repair roll before the hyperdrive can be engaged.',
        'Misjump. Hyperdrive cuts out in the wrong system.',
      ],
      moderate: [
        'Hyperdrive overload. The main hyperdrive nearly overloaded. Characters must make a Difficult repair roll to get it operating again.',
        'Hyperdrive power flux. Ship will not enter hyperspace until 1D+2 rounds after the hyperdrive is engaged.',
        'Power surges destroy the backup hyperdrive and double the hyperdrive multiplier (x1/2 is now x1, x1 is now x2, x2 is now x4).',
        'Misjump. Hyperdrive cuts out in the wrong system.',
        'Hyperdrive fluctuation. The trip takes 4D hours longer than normal.',
        'Hyperdrive destroyed. The ship arrives at its destination, but the hyperdrive is destroyed as the ship emerges into realspace.',
      ],
      catastrophic: [
        'Hyperdrive blows. The main hyperdrive is completely destroyed.',
        'Hyperdrive overload. Power flux nearly destroys the hyperdrive. Characters must make a Very Difficult repair roll to get it operating again.',
        'Collision. The ship collides with a heavy object while in hyperspace. It drops to realspace heavily damaged and with a ruptured hull; the ship is no longer spaceworthy and must be abandoned.',
        'Power surges mean the trip takes 1D days longer than expected.',
        'Misjump. Ship emerges in the wrong system.',
        'Near miss. The ship nearly collides with a stellar object and drops to realspace at the last instant. The pilot must now plot a new hyperspace course.',
      ],
    },

    hull: {
      minor: [
        'Power surge wipes out sensors and communication systems for 1D rounds.',
        'Minor hull stress; automatic bulkheads seal for 2 rounds. Characters may not move to different sections of the ship until the pilot makes a Very Easy computer programming/repair roll.',
        'Minor hull stress; susceptible to further damage. If the ship is damaged in the next three rounds, add +1D to the enemy\'s damage roll.',
        'Shield array damaged through power fluxes. Shields reduced by -1D for 1 round.',
        'Engine vibration stresses hull. Hull code is -1D for 1 round.',
        'Engine vibration causes hull stress. Reduce the ship\'s Space by -1 and maneuverability by -1D for 2 rounds.',
      ],
      moderate: [
        'Engine vibration stresses hull. Hull code is -1D for 1D rounds.',
        'Hull stress; susceptible to further damage. If the ship is damaged in the next three rounds, add +2D to the enemy\'s damage roll.',
        'Microscopic hull breach; automatic bulkheads seal. Characters may not move to different sections of the ship until the pilot makes a Very Easy computer programming/repair roll (to open the bulkheads) and a Very Easy repair roll to fix the breach.',
        'Shield failure due to power fluxes. Shields reduced by -1D for 1D rounds and after that reduced by -1 until an Easy space transports repair roll is made.',
        'Power surge overloads sensors and communications systems for 1D rounds.',
        'Power surge interferes with the hyperdrive motivator. All astrogation attempts in the next 1D rounds add +10 to the difficulty.',
      ],
      catastrophic: [
        'Power surge destroys one ship\'s system. Roll 1D: 1 communications; 2-3 sensors; 4-5 backup hyperdrive; 6 main hyperdrive.',
        'Hull breach; automatic bulkheads seal. Any character in the breached compartment suffers 8D damage from vacuum until computer systems attach a temporary seal (1D rounds). A character can attach the seal manually with a Difficult Strength total (fighting the effects of the vacuum).',
        'Hull breach and bulkheads fail! All characters in the ship suffer 8D damage from vacuum until characters attach a temporary seal (Difficult Strength total) or the computer system activates the seal (1D rounds).',
        'Engine vibration causes serious hull damage – reduce hull by -3D until repairs are made (Very Difficult repair roll).',
        'Severe power fluctuations reduce shields by -2D until a Moderate repair roll is made.',
        'Hull breach in the cargo hold: half of the cargo is sucked from the ship into the vacuum of space.',
      ],
    },

    weapon: {
      minor: [
        'Power surge reduces fire control by -1D for 1 round.',
        'Circuit flux creates erratic power flow: -1D to fire control until fixed (Easy starship weapon repair roll).',
        'Targeting computer malfunction. Weapon will only fire once per round for 1 round.',
        'Weapon misfires. Ranges halved for 1 round.',
        'Power flux reduces damage by -1D for one round.',
        'Power transfer conduit blows out. Weapon disabled until fixed (Very Easy starship weapon repair roll).',
      ],
      moderate: [
        'Power surge reduces fire control by -1D for 1D rounds.',
        'Circuit flux creates erratic power flow. Fire control is 0D until fixed (Easy starship weapon repair roll).',
        'Power flux reduces damage by -3D for 1D rounds unless fixed (Moderate starship weapon repair roll).',
        'Power transfer conduit blows out. Weapon disabled until fixed (Moderate starship weapon repair roll).',
        'Targeting computer displays faulty range data. Increase difficulty of all gunnery rolls by +2D for 5 rounds.',
        'Targeting computer has a short. Fire control is 0D and damage is -3D until fixed (normally fixed by a solid kick to the computer linkage).',
      ],
      catastrophic: [
        'Power transfer conduit blows out. Weapon disabled until fixed (Moderate starship weapon repair roll).',
        'If the weapon is a turret, it freezes in place for 1D rounds. If not, no effect.',
        'Power surge reduces the weapon to molten slag. Weapon destroyed.',
        'Circuit flux creates erratic power flow. Roll 1D each round – on a 5 or 6 the weapon overloads and is destroyed. Requires a Heroic starship weapon repair roll to fix.',
        'Circuitry overload only allows the weapon to be fired once every four rounds.',
        'Power overflow disables 1D other weapons (pick randomly) on the ship for 2 rounds.',
      ],
    },
  },
};
