// Generated from "Character Generator v2-5.xlsx"
// Source: Chance Gibboney's Excel character generator
// (Star Wars D6, 2nd Edition - West End Games)
// Do not edit by hand - run tools/extract-from-excel.py instead.
const DATA = {
 "species": [
  {
   "name": "Aqualish",
   "min": [
    6,
    3,
    5,
    6,
    6,
    5
   ],
   "max": [
    12,
    9,
    11,
    12,
    14,
    9
   ],
   "move": 9,
   "free": 23,
   "offset": 0,
   "hMin": 1.8,
   "hMax": 2,
   "planet": "Ando",
   "page": "p.60 SWTS:SE",
   "abilities": [],
   "story": [
    "Belligerence: Aqualish tend to be pushy and obnoxious."
   ],
   "skillImprove": [],
   "bonusSkills": [],
   "armorP": 0,
   "armorE": 0
  },
  {
   "name": "Balinaka",
   "min": [
    5,
    3,
    5,
    6,
    9,
    3
   ],
   "max": [
    12,
    10,
    11,
    12,
    15,
    7
   ],
   "move": 12,
   "free": 23,
   "offset": 0,
   "hMin": 3.5,
   "hMax": 4,
   "planet": "Garnib",
   "page": "p.28 AE",
   "abilities": [
    "Claws: you deal Strength +1D damage",
    "Night Vision: you have excelent vision and as such suffer no penaties in darkness.",
    "Aquatic: Able to breath air and water and can withstand the extreme pressures found in ocean depths."
   ],
   "story": [],
   "skillImprove": [],
   "bonusSkills": [],
   "armorP": 0,
   "armorE": 0
  },
  {
   "name": "Barabel",
   "min": [
    6,
    3,
    3,
    4,
    9,
    3
   ],
   "max": [
    12,
    7,
    9,
    14,
    15,
    7
   ],
   "move": 11,
   "free": 26,
   "offset": 0,
   "hMin": 1.9,
   "hMax": 2.2,
   "planet": "Barab I",
   "page": "p.4 GG4",
   "abilities": [
    "Natural Body Armor:  +2D bonus against physical attacks and +1D bonus against energy attacks.",
    "Radiation Resistance: +2D bonus when defending against the effects of radiation.",
    "Infrared Vision: Ability to see in total darkness, provided there are heat sources present."
   ],
   "story": [
    "Jedi Respect: Will almost always yield to the commands of a Jedi Knight.",
    "Reputation: Fierce warriors."
   ],
   "skillImprove": [],
   "bonusSkills": [],
   "armorP": 6,
   "armorE": 3
  },
  {
   "name": "Baragwins",
   "min": [
    4,
    3,
    3,
    6,
    6,
    6
   ],
   "max": [
    11,
    7,
    11,
    10,
    12,
    9
   ],
   "move": 7,
   "free": 24,
   "offset": -2,
   "hMin": 1.4,
   "hMax": 2.2,
   "planet": "Unknown",
   "page": "p.69 SWTS:SE",
   "abilities": [
    "Armor: +1D bonus against physical attacks.",
    "Smell: +1D to their \"search\" skill when tracking by scent, and +1D to perception checks t determine the moods of others within  five meters.",
    "Weapons Knowledge:"
   ],
   "story": [],
   "skillImprove": [],
   "bonusSkills": [],
   "armorP": 3,
   "armorE": 0
  },
  {
   "name": "Bothan",
   "min": [
    3,
    6,
    3,
    9,
    5,
    6
   ],
   "max": [
    12,
    12,
    9,
    15,
    11,
    13
   ],
   "move": 10,
   "free": 22,
   "offset": 0,
   "hMin": 1.3,
   "hMax": 1.5,
   "planet": "Bothawui",
   "page": "p.32 AE",
   "abilities": [],
   "story": [],
   "skillImprove": [],
   "bonusSkills": [],
   "armorP": 0,
   "armorE": 0
  },
  {
   "name": "Cerean",
   "min": [
    6,
    8,
    6,
    6,
    6,
    3
   ],
   "max": [
    12,
    15,
    10,
    12,
    10,
    8
   ],
   "move": 10,
   "free": 19,
   "offset": 0,
   "hMin": 1.7,
   "hMax": 2.1,
   "planet": "Cerea",
   "page": "SWRPGNetwork",
   "abilities": [
    "Redundant Physiology: Anytime you would have been mortally woundedfollowing damage to the heart or brain, instead makes you incapacitated.",
    "Second Heart:"
   ],
   "story": [
    "Aversion to High Technology: Will try to avoid high technology.",
    "Male Rarity: Females outnumber the males 20 to 1."
   ],
   "skillImprove": [
    "Stamina"
   ],
   "bonusSkills": [],
   "armorP": 0,
   "armorE": 0
  },
  {
   "name": "Chiss",
   "min": [
    6,
    6,
    6,
    6,
    6,
    6
   ],
   "max": [
    12,
    12,
    12,
    12,
    12,
    12
   ],
   "move": 10,
   "free": 18,
   "offset": 0,
   "hMin": 1.6,
   "hMax": 2,
   "planet": "Csilla",
   "page": "SWRPGNetwork",
   "abilities": [
    "Low-Light Vision: able to see twice the distance of a human, while retaining the ability to see color.",
    "Tactically Minded:"
   ],
   "story": [
    "Cultured: As any sophisticated human society."
   ],
   "skillImprove": [
    "Tactics"
   ],
   "bonusSkills": [],
   "armorP": 0,
   "armorE": 0
  },
  {
   "name": "Custom",
   "min": [
    3,
    3,
    3,
    3,
    3,
    3
   ],
   "max": [
    9,
    9,
    9,
    9,
    9,
    9
   ],
   "move": 10,
   "free": 36,
   "offset": 0,
   "hMin": 1,
   "hMax": 2,
   "planet": "Please select one",
   "page": "Custom",
   "abilities": [],
   "story": [],
   "skillImprove": [],
   "bonusSkills": [],
   "armorP": 0,
   "armorE": 0
  },
  {
   "name": "Defel",
   "min": [
    6,
    3,
    3,
    6,
    9,
    3
   ],
   "max": [
    12,
    9,
    9,
    12,
    13,
    9
   ],
   "move": 10,
   "free": 24,
   "offset": 0,
   "hMin": 1.1,
   "hMax": 1.5,
   "planet": "Af'El",
   "page": "p.33 GG4",
   "abilities": [
    "Invisibility: +3D bonus when using the \"Sneak\" skill.",
    "Claws: Inflict Strength +2D damage.",
    "Light Blind: Can only see in ultraviolet, any other light blinds the Defel. (Able to wear special visors to compesate)"
   ],
   "story": [
    "Overconfidence: Ignore surveillence equipment and characters with special perception abilities when they shouldn't.",
    "Reputation: Considered a myth by most of the galaxy - and thus thought to be a supernatural being if encountered."
   ],
   "skillImprove": [],
   "bonusSkills": [],
   "armorP": 0,
   "armorE": 0
  },
  {
   "name": "Devaronians",
   "min": [
    6,
    6,
    3,
    6,
    6,
    3
   ],
   "max": [
    12,
    12,
    11,
    14,
    12,
    9
   ],
   "move": 8,
   "free": 24,
   "offset": 0,
   "hMin": 1.7,
   "hMax": 1.9,
   "planet": "Devaron",
   "page": "p.88 SWTS:SE",
   "abilities": [],
   "story": [
    "Wonderlust: You do not stay in any area for any length of time."
   ],
   "skillImprove": [],
   "bonusSkills": [],
   "armorP": 0,
   "armorE": 0
  },
  {
   "name": "Drall",
   "min": [
    3,
    6,
    3,
    6,
    3,
    3
   ],
   "max": [
    9,
    14,
    9,
    12,
    9,
    9
   ],
   "move": 7,
   "free": 30,
   "offset": 0,
   "hMin": 1,
   "hMax": 1.5,
   "planet": "Drall",
   "page": "p.39 AE",
   "abilities": [],
   "story": [
    "Honesty: You are adamantly truthful.",
    "Hibernation: You feel you are supposed to hibernate."
   ],
   "skillImprove": [],
   "bonusSkills": [],
   "armorP": 0,
   "armorE": 0
  },
  {
   "name": "Dug",
   "min": [
    9,
    5,
    6,
    6,
    4,
    6
   ],
   "max": [
    15,
    11,
    12,
    12,
    10,
    12
   ],
   "move": 6,
   "free": 18,
   "offset": 0,
   "hMin": 1,
   "hMax": 1.5,
   "planet": "Malastare",
   "page": "SWRPGNetwork",
   "abilities": [
    "Quadrapedal Movement: +6 to movement when using all four limbs to move.",
    "Great Shout: You can inflate your throat to issue a bellow that can be heard over a distance of Strength roll times 300 meters."
   ],
   "story": [
    "Bad Disposition: You have a serious problem with discrimination and have become disdainful of non-Dugs.",
    "Manual Locomotion: You normally walk on your hands."
   ],
   "skillImprove": [],
   "bonusSkills": [],
   "armorP": 0,
   "armorE": 0
  },
  {
   "name": "Duros",
   "min": [
    3,
    4,
    6,
    3,
    3,
    5
   ],
   "max": [
    12,
    8,
    14,
    9,
    9,
    12
   ],
   "move": 10,
   "free": 30,
   "offset": 0,
   "hMin": 1.6,
   "hMax": 2.2,
   "planet": "Duros",
   "page": "p.86 SWTS:SE",
   "abilities": [],
   "story": [],
   "skillImprove": [
    "Astrogation",
    "Space Transport",
    "Starfighter Piloting",
    "Archaic Starship Pilot."
   ],
   "bonusSkills": [],
   "armorP": 0,
   "armorE": 0
  },
  {
   "name": "Elomin",
   "min": [
    6,
    5,
    6,
    6,
    3,
    7
   ],
   "max": [
    12,
    11,
    12,
    12,
    9,
    12
   ],
   "move": 10,
   "free": 21,
   "offset": 0,
   "hMin": 1.6,
   "hMax": 1.9,
   "planet": "Elom",
   "page": "p.41 AE",
   "abilities": [],
   "story": [],
   "skillImprove": [],
   "bonusSkills": [],
   "armorP": 0,
   "armorE": 0
  },
  {
   "name": "Entymal",
   "min": [
    6,
    3,
    3,
    3,
    6,
    3
   ],
   "max": [
    12,
    6,
    9,
    12,
    12,
    9
   ],
   "move": 10,
   "free": 30,
   "offset": 0,
   "hMin": 1.2,
   "hMax": 2,
   "planet": "Endex",
   "page": "p.42 AE",
   "abilities": [
    "Armor: +2 bonus against physical attacks.",
    "Gliding: Under normal gravity conditions, you can glide down approx. 60 to 100 meters."
   ],
   "story": [],
   "skillImprove": [
    "Astrogation",
    "Capital Ship Piloting",
    "Space Transport"
   ],
   "bonusSkills": [],
   "armorP": 2,
   "armorE": 0
  },
  {
   "name": "Ewok",
   "min": [
    5,
    3,
    5,
    6,
    3,
    3
   ],
   "max": [
    14,
    9,
    11,
    14,
    9,
    8
   ],
   "move": 7,
   "free": 29,
   "offset": 0,
   "hMin": 1,
   "hMax": 1,
   "planet": "Endor",
   "page": "p.13 SWTS:SE",
   "abilities": [
    "Skill Limits: May not improve any vehicle skills (other than Glider), starship operations, or repair skills.",
    "Smell: +1D to their \"search\" skill when tracking by scent."
   ],
   "story": [
    "Protectiveness: Most human will feel unusually protective of Ewoks, wanting to protect them like small children."
   ],
   "skillImprove": [
    "Hide",
    "Search",
    "Sneak"
   ],
   "bonusSkills": [
    {
     "name": "Thrown Weapon",
     "attr": "dex"
    },
    {
     "name": "Glider",
     "attr": "mec"
    },
    {
     "name": "Primitive Construction",
     "attr": "tec"
    }
   ],
   "armorP": 0,
   "armorE": 0
  },
  {
   "name": "Falleen",
   "min": [
    6,
    6,
    6,
    7,
    7,
    6
   ],
   "max": [
    12,
    14,
    12,
    14,
    14,
    12
   ],
   "move": 9,
   "free": 19,
   "offset": 3,
   "hMin": 1.7,
   "hMax": 2.4,
   "planet": "Falleen",
   "page": "p.46 AE",
   "abilities": [
    "Amphibious:  You can survive underwater for up to 12 hours with out air.",
    "Attraction Pheromones: You exude pheromones and can change your skin color to affect others. This grants you +1D to your \"Persuasion\" checks. (you can increase this +1D per hour of meditation and prepreiation, up to a total of +3D).",
    "Good Swimmer: You gain +1D bonus to any \"Swimming\" check."
   ],
   "story": [
    "Rare:"
   ],
   "skillImprove": [],
   "bonusSkills": [],
   "armorP": 0,
   "armorE": 0
  },
  {
   "name": "Gamorrean",
   "min": [
    6,
    3,
    3,
    3,
    9,
    3
   ],
   "max": [
    12,
    6,
    5,
    9,
    15,
    5
   ],
   "move": 7,
   "free": 24,
   "offset": -3,
   "hMin": 1.3,
   "hMax": 1.6,
   "planet": "Gamorr",
   "page": "p.213 SWRPGRE",
   "abilities": [
    "Great Stamina: Anytime you all called upon to make a \"Stamina\" check you may reroll once if the first roll fails."
   ],
   "story": [
    "Language: Cannot speak galactic basic, but can understand it.",
    "Droid Hatred:",
    "Reputation: Regarded a primitive, brutal, and mindless.",
    "Enslaved:"
   ],
   "skillImprove": [
    "Melee Combat",
    "Brawling",
    "Thrown Weapon"
   ],
   "bonusSkills": [],
   "armorP": 0,
   "armorE": 0
  },
  {
   "name": "Gand",
   "min": [
    4,
    3,
    4,
    3,
    6,
    3
   ],
   "max": [
    12,
    12,
    12,
    14,
    15,
    14
   ],
   "move": 10,
   "free": 31,
   "offset": 0,
   "hMin": 1.6,
   "hMax": 1.9,
   "planet": "Gand",
   "page": "p.78 SWTS:SE",
   "abilities": [
    "Divergent Evolution: Variable species special ability, talk it over with GM."
   ],
   "story": [],
   "skillImprove": [],
   "bonusSkills": [],
   "armorP": 0,
   "armorE": 0
  },
  {
   "name": "Geelan",
   "min": [
    8,
    3,
    6,
    8,
    5,
    6
   ],
   "max": [
    14,
    9,
    12,
    14,
    11,
    12
   ],
   "move": 10,
   "free": 18,
   "offset": 0,
   "hMin": 0.75,
   "hMax": 1.5,
   "planet": "Needan",
   "page": "p.60 AE",
   "abilities": [
    "Claws: you deal Strength +1D damage"
   ],
   "story": [
    "Hoarders: You never throw anything away. You will only part with your possessions if you are paid for it or your life is in damger."
   ],
   "skillImprove": [],
   "bonusSkills": [],
   "armorP": 0,
   "armorE": 0
  },
  {
   "name": "Gran",
   "min": [
    3,
    3,
    3,
    6,
    3,
    3
   ],
   "max": [
    12,
    9,
    10,
    12,
    12,
    9
   ],
   "move": 10,
   "free": 33,
   "offset": 0,
   "hMin": 1.2,
   "hMax": 1.8,
   "planet": "Kinyen",
   "page": "p.74 SWTS:SE",
   "abilities": [
    "Vision: Your eyestalks give you a larger spectrum of vision, you gain +1D bonus to perception to notice sudden movement.",
    "Infrared Vision: Ability to see in total darkness, provided there are heat sources present."
   ],
   "story": [],
   "skillImprove": [],
   "bonusSkills": [],
   "armorP": 0,
   "armorE": 0
  },
  {
   "name": "Gree",
   "min": [
    6,
    6,
    9,
    3,
    3,
    6
   ],
   "max": [
    9,
    12,
    15,
    9,
    9,
    15
   ],
   "move": 5,
   "free": 21,
   "offset": 0,
   "hMin": 0.8,
   "hMax": 1.2,
   "planet": "Gree",
   "page": "p.67 AE",
   "abilities": [],
   "story": [
    "Droid Stigma: You ignore and look down upon droids, and consider all droids and autonomous computers an unimportant technology."
   ],
   "skillImprove": [],
   "bonusSkills": [],
   "armorP": 0,
   "armorE": 0
  },
  {
   "name": "Gungan",
   "min": [
    7,
    3,
    6,
    6,
    6,
    7
   ],
   "max": [
    13,
    9,
    12,
    12,
    10,
    13
   ],
   "move": 10,
   "free": 19,
   "offset": 0,
   "hMin": 1.9,
   "hMax": 2.2,
   "planet": "Naboo",
   "page": "SWRPGNetwork",
   "abilities": [
    "Amphibious:  You can survive underwater for up to 2 hours with out air.",
    "Excellent Hearing: Gain +1D bonus to \"Search\" rolls when using your hearing.",
    "Great Swimmer: You gain +2D bonus to any \"Swimming\" check."
   ],
   "story": [
    "Isolationism: Prejudice against outsiders.",
    "Warrior Culture: Emphasis of honor and duty."
   ],
   "skillImprove": [],
   "bonusSkills": [],
   "armorP": 0,
   "armorE": 0
  },
  {
   "name": "Herglic",
   "min": [
    3,
    3,
    3,
    5,
    9,
    4
   ],
   "max": [
    9,
    9,
    12,
    11,
    15,
    13
   ],
   "move": 6,
   "free": 27,
   "offset": 0,
   "hMin": 1.7,
   "hMax": 1.9,
   "planet": "Giju",
   "page": "p.68 AE",
   "abilities": [
    "Armor: +1D bonus against physical attacks."
   ],
   "story": [
    "Gambling Frenzy: You are irrestibly drawn to games of chance. To pass on a game of chance you must make a moderate \"Willpower\" check."
   ],
   "skillImprove": [],
   "bonusSkills": [],
   "armorP": 3,
   "armorE": 0
  },
  {
   "name": "Human",
   "min": [
    6,
    6,
    6,
    6,
    6,
    6
   ],
   "max": [
    12,
    12,
    12,
    12,
    12,
    12
   ],
   "move": 10,
   "free": 18,
   "offset": 0,
   "hMin": 1.5,
   "hMax": 2,
   "planet": "Any",
   "page": "Any",
   "abilities": [],
   "story": [],
   "skillImprove": [],
   "bonusSkills": [],
   "armorP": 0,
   "armorE": 0
  },
  {
   "name": "Morellian",
   "min": [
    6,
    6,
    6,
    6,
    6,
    6
   ],
   "max": [
    12,
    12,
    12,
    12,
    12,
    12
   ],
   "move": 10,
   "free": 18,
   "offset": 0,
   "hMin": 1.5,
   "hMax": 2,
   "planet": "Morellia",
   "page": "Wookieepedia",
   "abilities": [],
   "story": [
    "Near-Extinct: After the Yuuzhan Vong invasion, the Morellians were nearly extinct."
   ],
   "skillImprove": [],
   "bonusSkills": [],
   "armorP": 0,
   "armorE": 0
  },
  {
   "name": "Hutt",
   "min": [
    1,
    6,
    3,
    6,
    6,
    3
   ],
   "max": [
    9,
    15,
    11,
    15,
    15,
    12
   ],
   "move": 1,
   "free": 35,
   "offset": 6,
   "hMin": 3,
   "hMax": 5,
   "planet": "Varl (Nal Hutta)",
   "page": "p.71 SWTS:SE",
   "abilities": [
    "Force Resistance: You roll double your Perception dice to resist any use of the force used to manipulate your mind."
   ],
   "story": [
    "Reputaion: Unilversally despised, even by those that benefit from you.",
    "Self-centered: you cannot look beyond yourself (or your relatives), in your considerations."
   ],
   "skillImprove": [],
   "bonusSkills": [],
   "armorP": 0,
   "armorE": 0
  },
  {
   "name": "Ithorian",
   "min": [
    3,
    8,
    3,
    4,
    3,
    3
   ],
   "max": [
    9,
    15,
    6,
    12,
    9,
    7
   ],
   "move": 10,
   "free": 30,
   "offset": 0,
   "hMin": 1.8,
   "hMax": 2.3,
   "planet": "Ithor",
   "page": "p.96 SWTS:SE",
   "abilities": [],
   "story": [
    "Herd Ship:"
   ],
   "skillImprove": [],
   "bonusSkills": [
    {
     "name": "Agriculture",
     "attr": "kno"
    },
    {
     "name": "Ecology",
     "attr": "kno"
    }
   ],
   "armorP": 0,
   "armorE": 0
  },
  {
   "name": "Jawa",
   "min": [
    3,
    3,
    6,
    3,
    3,
    6
   ],
   "max": [
    12,
    10,
    14,
    9,
    8,
    14
   ],
   "move": 8,
   "free": 30,
   "offset": 0,
   "hMin": 0.8,
   "hMax": 1.2,
   "planet": "Tatooine",
   "page": "p.74 AE",
   "abilities": [],
   "story": [
    "Trade Language: You can speak a flexable trade language which is virtually unitelligible to other species."
   ],
   "skillImprove": [],
   "bonusSkills": [],
   "armorP": 0,
   "armorE": 0
  },
  {
   "name": "Kubaz",
   "min": [
    5,
    6,
    3,
    8,
    3,
    6
   ],
   "max": [
    11,
    12,
    11,
    14,
    9,
    12
   ],
   "move": 8,
   "free": 23,
   "offset": 0,
   "hMin": 1.5,
   "hMax": 1.5,
   "planet": "Kubindi",
   "page": "p.40 SWTS:SE",
   "abilities": [],
   "story": [],
   "skillImprove": [],
   "bonusSkills": [],
   "armorP": 0,
   "armorE": 0
  },
  {
   "name": "Meris",
   "min": [
    11,
    3,
    3,
    3,
    6,
    6
   ],
   "max": [
    18,
    12,
    12,
    12,
    12,
    12
   ],
   "move": 10,
   "free": 22,
   "offset": 0,
   "hMin": 1.5,
   "hMax": 2.2,
   "planet": "Merisee",
   "page": "p.93 AE",
   "abilities": [
    "Skill Bonus: You may choose from \"Agriculture\", \"First Aid\", or \"Medicine\" to gain a +2D.",
    "Stealthy: You gain a +2D when using the \"Sneak\" skill."
   ],
   "story": [],
   "skillImprove": [],
   "bonusSkills": [
    {
     "name": "Weather Prediction",
     "attr": "kno"
    },
    {
     "name": "Agriculture",
     "attr": "kno"
    }
   ],
   "armorP": 0,
   "armorE": 0
  },
  {
   "name": "Mon Calamari",
   "min": [
    3,
    3,
    4,
    3,
    3,
    4
   ],
   "max": [
    10,
    12,
    10,
    9,
    9,
    12
   ],
   "move": 9,
   "free": 34,
   "offset": 0,
   "hMin": 1.3,
   "hMax": 1.8,
   "planet": "Mon Calamari",
   "page": "p.7 SWTS:SE",
   "abilities": [
    "Moist Enviroment: When in a moist climate, +1D bonus to all Dexterity, Perception, and Strength checks. This is purely psychological.",
    "Dry Enviroment: When in a dry climate, -1D penalty to all Dexterity, Perception, and Strength checks. This is purely psychological.",
    "Aquatic: Able to breath air and water and can withstand the extreme pressures found in ocean depths."
   ],
   "story": [
    "Enslaved:"
   ],
   "skillImprove": [],
   "bonusSkills": [],
   "armorP": 0,
   "armorE": 0
  },
  {
   "name": "Multopos",
   "min": [
    6,
    3,
    0,
    6,
    3,
    0
   ],
   "max": [
    13,
    12,
    9,
    1,
    12,
    5
   ],
   "move": 7,
   "free": 36,
   "offset": 0,
   "hMin": 1.6,
   "hMax": 2,
   "planet": "Baralou",
   "page": "p.97 AE",
   "abilities": [
    "Webbed Hands: Due to your webbed hands you suffer a -1D penalty when using any object designed for the human hand.",
    "Dehydration: Every day out of water forces you to make a Moderate \"Stamina\" check or suffer damage equal to 1D times each day spent away from water.",
    "Membranes: You gain +1D bonus to any \"Swimming\" check. Plus 4 to movement in water.",
    "Aquatic: Able to breath air and water and can withstand the extreme pressures found in ocean depths."
   ],
   "story": [],
   "skillImprove": [],
   "bonusSkills": [],
   "armorP": 0,
   "armorE": 0
  },
  {
   "name": "Nautolan",
   "min": [
    6,
    6,
    6,
    6,
    6,
    6
   ],
   "max": [
    12,
    12,
    12,
    15,
    12,
    12
   ],
   "move": 10,
   "free": 18,
   "offset": 0,
   "hMin": 1.6,
   "hMax": 2,
   "planet": "Glee Anselm",
   "page": "SWRPGNetwork",
   "abilities": [
    "Amphibious:  You can survive underwater for up to 8 hours with out air.",
    "Enhanced Senses: you can detect when another being shifts it's mood. You gain +1D bonus to Perception roll when dealing with another being within 10 meters."
   ],
   "story": [],
   "skillImprove": [],
   "bonusSkills": [],
   "armorP": 0,
   "armorE": 0
  },
  {
   "name": "Near-Human",
   "min": [
    0,
    0,
    0,
    0,
    0,
    0
   ],
   "max": [
    0,
    0,
    0,
    0,
    0,
    0
   ],
   "move": 0,
   "free": 54,
   "offset": 0,
   "hMin": 0,
   "hMax": 0,
   "planet": "None",
   "page": "None",
   "abilities": [],
   "story": [],
   "skillImprove": [],
   "bonusSkills": [],
   "armorP": 0,
   "armorE": 0
  },
  {
   "name": "Noghri",
   "min": [
    7,
    4,
    3,
    8,
    8,
    3
   ],
   "max": [
    17,
    11,
    11,
    14,
    17,
    11
   ],
   "move": 11,
   "free": 33,
   "offset": 12,
   "hMin": 1,
   "hMax": 1.3,
   "planet": "Honoghr",
   "page": "p.110 AE",
   "abilities": [
    "Claws: you deal Strength +1D damage",
    "Fangs: you deal Strength +1D damage",
    "Stealthy: You gain a +2D when using the \"Hide\" or \"Sneak\" skill.",
    "Acute Senses: You gain a +2D when using the \"Search\" skill.",
    "Ignorance: May not place any points into Knowledge skills, except for \"Intimidation\", \"Survival\", or \"Willpower\"."
   ],
   "story": [
    "Enslaved:"
   ],
   "skillImprove": [],
   "bonusSkills": [
    {
     "name": "Martial Arts",
     "attr": "str"
    }
   ],
   "armorP": 0,
   "armorE": 0
  },
  {
   "name": "Ortolan",
   "min": [
    3,
    6,
    3,
    7,
    8,
    6
   ],
   "max": [
    9,
    12,
    9,
    13,
    15,
    12
   ],
   "move": 5,
   "free": 21,
   "offset": 0,
   "hMin": 1.3,
   "hMax": 1.6,
   "planet": "Orto",
   "page": "p.99 SWTS:SE",
   "abilities": [
    "Foraging: Any attempt to look for food gains a +2D bonus.",
    "Ingestion: Gain a +1D bonus to resist any poison consumed."
   ],
   "story": [
    "Food: You are obsessed with food. Any offering of food in exchange for service or information, grants the offerer +2D bonus on the persuasion check."
   ],
   "skillImprove": [],
   "bonusSkills": [],
   "armorP": 0,
   "armorE": 0
  },
  {
   "name": "Pa'lowick",
   "min": [
    3,
    5,
    6,
    6,
    6,
    3
   ],
   "max": [
    12,
    14,
    12,
    13,
    12,
    12
   ],
   "move": 7,
   "free": 19,
   "offset": -6,
   "hMin": 0.9,
   "hMax": 1.8,
   "planet": "Pa'lowick",
   "page": "p.104 SWTS:SE",
   "abilities": [],
   "story": [],
   "skillImprove": [],
   "bonusSkills": [],
   "armorP": 0,
   "armorE": 0
  },
  {
   "name": "Pho Ph'eahian",
   "min": [
    3,
    3,
    3,
    5,
    3,
    6
   ],
   "max": [
    12,
    12,
    12,
    13,
    12,
    15
   ],
   "move": 9,
   "free": 31,
   "offset": 0,
   "hMin": 1.3,
   "hMax": 2,
   "planet": "Pho Ph'eah",
   "page": "p.116 AE",
   "abilities": [
    "Four Arms: You have two sets of arms. You can perform two physical actions with no penalty."
   ],
   "story": [],
   "skillImprove": [],
   "bonusSkills": [],
   "armorP": 0,
   "armorE": 0
  },
  {
   "name": "Quarren",
   "min": [
    5,
    3,
    6,
    3,
    3,
    5
   ],
   "max": [
    14,
    12,
    14,
    11,
    13,
    15
   ],
   "move": 9,
   "free": 29,
   "offset": 0,
   "hMin": 1.4,
   "hMax": 1.9,
   "planet": "Mon Calamari",
   "page": "p.76 SWTS:SE",
   "abilities": [
    "Aquatic: Able to breath air and water and can withstand the extreme pressures found in ocean depths."
   ],
   "story": [],
   "skillImprove": [
    "Swimming"
   ],
   "bonusSkills": [],
   "armorP": 0,
   "armorE": 0
  },
  {
   "name": "Rodian",
   "min": [
    5,
    3,
    3,
    3,
    3,
    3
   ],
   "max": [
    14,
    9,
    8,
    11,
    13,
    7
   ],
   "move": 10,
   "free": 34,
   "offset": 0,
   "hMin": 1.5,
   "hMax": 1.7,
   "planet": "Rodia",
   "page": "p.67 SWTS:SE",
   "abilities": [],
   "story": [
    "Reputaion: Notorious for your tenacity and egerness to kill for the sake of a few credits."
   ],
   "skillImprove": [],
   "bonusSkills": [],
   "armorP": 0,
   "armorE": 0
  },
  {
   "name": "Sarkans",
   "min": [
    3,
    6,
    3,
    6,
    9,
    3
   ],
   "max": [
    11,
    13,
    11,
    14,
    19,
    9
   ],
   "move": 4,
   "free": 24,
   "offset": 0,
   "hMin": 1.9,
   "hMax": 2.2,
   "planet": "Sarka",
   "page": "p.93 SWTS:SE",
   "abilities": [
    "Night Vision: you have excelent vision and as such suffer no penaties in darkness.",
    "Cold Blooded: if exposed to extreme cold, you become sluggish (all die codes are reduced by 3D).",
    "Tail: you may attack with your tail at Strength +3D damage."
   ],
   "story": [
    "Sarkan Protocol: You must be treated with \"proper respect\"."
   ],
   "skillImprove": [],
   "bonusSkills": [],
   "armorP": 0,
   "armorE": 0
  },
  {
   "name": "Shawda Ubb",
   "min": [
    3,
    3,
    3,
    6,
    3,
    3
   ],
   "max": [
    12,
    12,
    7,
    14,
    9,
    9
   ],
   "move": 5,
   "free": 33,
   "offset": 0,
   "hMin": 0.3,
   "hMax": 0.5,
   "planet": "Manpha",
   "page": "p.98 SWTS:SE",
   "abilities": [
    "Acid Spray: (3meters / 6D Stun damage / effects last for 15 minutes)",
    "Moist Enviroment: When in a moist climate, +1D bonus to all Dexterity, Perception, and Strength checks. This is purely psychological.",
    "Dry Enviroment: When in a dry climate, -1D penalty to all Dexterity, Perception, and Strength checks. This is purely psychological."
   ],
   "story": [],
   "skillImprove": [],
   "bonusSkills": [],
   "armorP": 0,
   "armorE": 0
  },
  {
   "name": "Shistavanen",
   "min": [
    3,
    3,
    3,
    3,
    3,
    3
   ],
   "max": [
    15,
    12,
    12,
    15,
    12,
    9
   ],
   "move": 10,
   "free": 36,
   "offset": 0,
   "hMin": 1.3,
   "hMax": 1.9,
   "planet": "Uvena",
   "page": "p.102 SWTS:SE",
   "abilities": [
    "Night Vision: you have excelent vision and as such suffer no penaties in darkness."
   ],
   "story": [],
   "skillImprove": [],
   "bonusSkills": [],
   "armorP": 0,
   "armorE": 0
  },
  {
   "name": "Snivvians",
   "min": [
    3,
    6,
    3,
    7,
    6,
    3
   ],
   "max": [
    9,
    12,
    9,
    14,
    12,
    12
   ],
   "move": 10,
   "free": 26,
   "offset": 0,
   "hMin": 1.2,
   "hMax": 1.8,
   "planet": "Cadomai",
   "page": "p.108 SWTS:SE",
   "abilities": [
    "Adaptive Skin: You can withstand extreme temperatures."
   ],
   "story": [],
   "skillImprove": [],
   "bonusSkills": [],
   "armorP": 3,
   "armorE": 0
  },
  {
   "name": "Ssither",
   "min": [
    6,
    8,
    3,
    7,
    9,
    3
   ],
   "max": [
    12,
    14,
    9,
    13,
    15,
    9
   ],
   "move": 10,
   "free": 18,
   "offset": 0,
   "hMin": 1.65,
   "hMax": 2,
   "planet": "Jatee",
   "page": "p.147 AE",
   "abilities": [
    "Telepathy: You can selectively broadcast and receive thoughts and emotions. You can filter unwanted communications. (See text)"
   ],
   "story": [],
   "skillImprove": [],
   "bonusSkills": [
    {
     "name": "Ssither Telepathy",
     "attr": "kno"
    }
   ],
   "armorP": 0,
   "armorE": 0
  },
  {
   "name": "Sullustan",
   "min": [
    3,
    3,
    6,
    3,
    3,
    3
   ],
   "max": [
    9,
    8,
    13,
    10,
    8,
    11
   ],
   "move": 10,
   "free": 33,
   "offset": 0,
   "hMin": 1,
   "hMax": 1.8,
   "planet": "Sullust",
   "page": "p.22 SWTS:SE",
   "abilities": [
    "Enhanced Senses: Advanced vision and hearing - anytime they make Perception or \"Search\" checks involving hearing or vision in low-ligh, they receive a +2D bonus.",
    "Location Sense: Once you have been somewhere you always remember how to return to the area - no die roll needed. When using the \"Astrogation\" skill to jump to a place you have been, you gain a bonus of +1D to the roll."
   ],
   "story": [],
   "skillImprove": [],
   "bonusSkills": [],
   "armorP": 0,
   "armorE": 0
  },
  {
   "name": "Sunesis",
   "min": [
    6,
    6,
    3,
    6,
    3,
    3
   ],
   "max": [
    12,
    14,
    10,
    14,
    9,
    9
   ],
   "move": 8,
   "free": 27,
   "offset": 0,
   "hMin": 1.5,
   "hMax": 2.1,
   "planet": "Monor II",
   "page": "p.149 AE",
   "abilities": [
    "Ultrasound: Gain +1D bonus to \"Search\" rolls when using your hearing."
   ],
   "story": [],
   "skillImprove": [],
   "bonusSkills": [],
   "armorP": 0,
   "armorE": 0
  },
  {
   "name": "Talz",
   "min": [
    6,
    3,
    3,
    7,
    8,
    3
   ],
   "max": [
    12,
    9,
    9,
    13,
    14,
    9
   ],
   "move": 8,
   "free": 21,
   "offset": -3,
   "hMin": 2,
   "hMax": 2.2,
   "planet": "Alzoc III",
   "page": "p.94 SWTS:SE",
   "abilities": [],
   "story": [
    "Enslaved:"
   ],
   "skillImprove": [],
   "bonusSkills": [],
   "armorP": 0,
   "armorE": 0
  },
  {
   "name": "Tasari",
   "min": [
    3,
    3,
    3,
    6,
    3,
    3
   ],
   "max": [
    12,
    12,
    9,
    15,
    11,
    8
   ],
   "move": 10,
   "free": 33,
   "offset": 0,
   "hMin": 1.4,
   "hMax": 1.7,
   "planet": "Tasariq",
   "page": "p.153 AE",
   "abilities": [
    "Force-Sensitive: You are almost always Force-Sensitive."
   ],
   "story": [],
   "skillImprove": [],
   "bonusSkills": [],
   "armorP": 0,
   "armorE": 0
  },
  {
   "name": "Toydarians",
   "min": [
    3,
    7,
    5,
    6,
    4,
    3
   ],
   "max": [
    9,
    13,
    12,
    13,
    9,
    10
   ],
   "move": 4,
   "free": 32,
   "offset": 6,
   "hMin": 1,
   "hMax": 1.2,
   "planet": "Toydaria",
   "page": "SWRPGNetwork",
   "abilities": [
    "Force Resistance: You roll double your Perception dice to resist any use of the force used to manipulate your mind."
   ],
   "story": [
    "Shrewd Businessmen: You pride yourself on good bargaining skills"
   ],
   "skillImprove": [
    "Bargain",
    "Con",
    "Business"
   ],
   "bonusSkills": [
    {
     "name": "Flight",
     "attr": "dex"
    }
   ],
   "armorP": 0,
   "armorE": 0
  },
  {
   "name": "Trandoshan",
   "min": [
    4,
    3,
    4,
    6,
    9,
    3
   ],
   "max": [
    13,
    10,
    9,
    11,
    14,
    8
   ],
   "move": 8,
   "free": 25,
   "offset": 0,
   "hMin": 1.9,
   "hMax": 2.4,
   "planet": "Kashyyyk",
   "page": "p.62 SWTS:SE",
   "abilities": [
    "Infrared Vision: Ability to see in total darkness, provided there are heat sources present.",
    "Clumsy: any skill use or action that requires fine fingure manipulation is at -2D.",
    "Regeneration: Once per day, a \"Young\" trandoshan, must make  a moderate strength or \"Stamina\" check. Success means that the limb regenerates by 10%, on a failure nothing occurs.",
    "Hostile: +1D to all \"Intimidation checks against non-trandoshans."
   ],
   "story": [
    "Wookiee Hatred: Moderate Willpower to keep from attacking a wookiee or known companions of a wookiee.",
    "Belligerence: Trandoshans tend to be pushy and obnoxious."
   ],
   "skillImprove": [],
   "bonusSkills": [],
   "armorP": 0,
   "armorE": 0
  },
  {
   "name": "Trianii",
   "min": [
    7,
    6,
    4,
    6,
    6,
    4
   ],
   "max": [
    12,
    12,
    12,
    12,
    14,
    14
   ],
   "move": 12,
   "free": 21,
   "offset": 0,
   "hMin": 1.5,
   "hMax": 2.2,
   "planet": "Trian",
   "page": "p.157 AE",
   "abilities": [
    "Claws: you deal Strength +1D damage",
    "Prehensile Tail:",
    "Special Balance: You gain a +D bonus to all actions involving \"Climbing\", \"Jumping\", and \"Acrobatics\"."
   ],
   "story": [
    "Female Physical Superiority:",
    "Feud with the Authority:"
   ],
   "skillImprove": [],
   "bonusSkills": [],
   "armorP": 0,
   "armorE": 0
  },
  {
   "name": "Trunsk",
   "min": [
    6,
    6,
    6,
    3,
    6,
    3
   ],
   "max": [
    12,
    9,
    12,
    9,
    14,
    9
   ],
   "move": 9,
   "free": 24,
   "offset": 0,
   "hMin": 1.5,
   "hMax": 2,
   "planet": "Trunska",
   "page": "p.158 AE",
   "abilities": [
    "Claws: you deal Strength +1D damage"
   ],
   "story": [],
   "skillImprove": [],
   "bonusSkills": [],
   "armorP": 0,
   "armorE": 0
  },
  {
   "name": "Tusken Raider",
   "min": [
    3,
    3,
    3,
    3,
    3,
    3
   ],
   "max": [
    13,
    11,
    9,
    12,
    12,
    9
   ],
   "move": 10,
   "free": 36,
   "offset": 0,
   "hMin": 1.5,
   "hMax": 1.9,
   "planet": "Tatooine",
   "page": "p.129 AE",
   "abilities": [],
   "story": [],
   "skillImprove": [],
   "bonusSkills": [],
   "armorP": 0,
   "armorE": 0
  },
  {
   "name": "Twi'lek",
   "min": [
    3,
    3,
    3,
    6,
    3,
    3
   ],
   "max": [
    9,
    12,
    7,
    14,
    9,
    9
   ],
   "move": 10,
   "free": 30,
   "offset": -3,
   "hMin": 1.6,
   "hMax": 2.4,
   "planet": "Ryloth",
   "page": "p.66 SWTS:SE",
   "abilities": [
    "Head Tails: You can use you head tails to communicate with other Twi'leks in a secret language."
   ],
   "story": [],
   "skillImprove": [],
   "bonusSkills": [],
   "armorP": 0,
   "armorE": 0
  },
  {
   "name": "Ubese",
   "min": [
    6,
    3,
    3,
    6,
    3,
    6
   ],
   "max": [
    14,
    9,
    8,
    14,
    9,
    12
   ],
   "move": 8,
   "free": 27,
   "offset": 0,
   "hMin": 1.75,
   "hMax": 2.25,
   "planet": "Uba IV",
   "page": "p.162 AE",
   "abilities": [
    "Survival: You gain a +2D bonus to \"Survival\" skill checks."
   ],
   "story": [],
   "skillImprove": [],
   "bonusSkills": [],
   "armorP": 0,
   "armorE": 0
  },
  {
   "name": "Ugnaught",
   "min": [
    3,
    3,
    6,
    5,
    6,
    3
   ],
   "max": [
    11,
    9,
    12,
    10,
    12,
    11
   ],
   "move": 10,
   "free": 28,
   "offset": 0,
   "hMin": 1,
   "hMax": 1.6,
   "planet": "Gentes",
   "page": "p.105 SWTS:SE",
   "abilities": [],
   "story": [],
   "skillImprove": [],
   "bonusSkills": [],
   "armorP": 0,
   "armorE": 0
  },
  {
   "name": "Wookie",
   "min": [
    3,
    3,
    3,
    3,
    8,
    3
   ],
   "max": [
    11,
    7,
    11,
    7,
    18,
    10
   ],
   "move": 11,
   "free": 31,
   "offset": 0,
   "hMin": 2,
   "hMax": 2.3,
   "planet": "Kashyyyk",
   "page": "p.11 SWTS:SE",
   "abilities": [
    "Berserker Rage: When angered, +2D bonus to Strength for the purposes of causing damage while brawling. Also, -2D to all non-strength checks. To calm down while enemies are still present, a moderate perception check is needed at -1D (min. 1D). If no enemies are around the difficulty is changed to easy perception at -1D (min. 1D).",
    "Climbing Claws: Used for Climbing only. +2D to \"Climb\". Any Wookiee who uses these in combat is considered dishonorable, and will be hunted down."
   ],
   "story": [
    "Reputation: Fierce savage with a short temper.",
    "Enslaved:",
    "Language: Cannot speak galactic basic, but can understand it.",
    "Honor-Bound:"
   ],
   "skillImprove": [],
   "bonusSkills": [],
   "armorP": 0,
   "armorE": 0
  },
  {
   "name": "Yuzzum",
   "min": [
    6,
    6,
    6,
    3,
    6,
    6
   ],
   "max": [
    13,
    12,
    12,
    11,
    12,
    11
   ],
   "move": 10,
   "free": 21,
   "offset": 0,
   "hMin": 2,
   "hMax": 2.5,
   "planet": "Endor",
   "page": "p.107 SWTS:SE",
   "abilities": [],
   "story": [],
   "skillImprove": [],
   "bonusSkills": [],
   "armorP": 0,
   "armorE": 0
  },
  {
   "name": "Zabrak",
   "min": [
    6,
    3,
    6,
    6,
    6,
    3
   ],
   "max": [
    12,
    12,
    12,
    18,
    15,
    12
   ],
   "move": 10,
   "free": 24,
   "offset": 0,
   "hMin": 1.8,
   "hMax": 2.3,
   "planet": "Iridonia",
   "page": "SWRPGNetwork",
   "abilities": [
    "Mental Willpower: Anytime you roll \"Willpower\" you gain +1D to the check."
   ],
   "story": [],
   "skillImprove": [],
   "bonusSkills": [],
   "armorP": 0,
   "armorE": 0
  }
 ],
 "nearHumans": [
  {
   "name": "Borneck",
   "min": [
    6,
    4,
    6,
    3,
    6,
    3
   ],
   "max": [
    12,
    12,
    14,
    11,
    14,
    11
   ],
   "move": 8,
   "free": 27,
   "offset": 1,
   "hMin": 1.8,
   "hMax": 2,
   "planet": "Vellity",
   "page": "p.101 AE",
   "abilities": [],
   "story": [],
   "skillImprove": [],
   "bonusSkills": [],
   "armorP": 0,
   "armorE": 0
  },
  {
   "name": "Epicanthix",
   "min": [
    6,
    6,
    6,
    6,
    6,
    6
   ],
   "max": [
    14,
    12,
    12,
    14,
    12,
    11
   ],
   "move": 10,
   "free": 18,
   "offset": 0,
   "hMin": 1.8,
   "hMax": 2.5,
   "planet": "Panatha",
   "page": "p.101 AE",
   "abilities": [],
   "story": [
    "Galactic Naivete: You become overwhelmed with unfamiliar and fantastic surroundings of other worlds."
   ],
   "skillImprove": [
    "Cultures",
    "Languages",
    "Value"
   ],
   "bonusSkills": [],
   "armorP": 0,
   "armorE": 0
  },
  {
   "name": "Etti",
   "min": [
    6,
    6,
    6,
    6,
    6,
    6
   ],
   "max": [
    12,
    12,
    11,
    12,
    11,
    11
   ],
   "move": 8,
   "free": 18,
   "offset": 0,
   "hMin": 1.7,
   "hMax": 2.2,
   "planet": "Etti",
   "page": "p.103 AE",
   "abilities": [],
   "story": [],
   "skillImprove": [
    "Bureaucracy",
    "Business",
    "Bargain",
    "Value"
   ],
   "bonusSkills": [],
   "armorP": 0,
   "armorE": 0
  },
  {
   "name": "Hapans",
   "min": [
    6,
    6,
    6,
    4,
    6,
    6
   ],
   "max": [
    14,
    15,
    12,
    11,
    14,
    12
   ],
   "move": 10,
   "free": 23,
   "offset": 3,
   "hMin": 1.5,
   "hMax": 2.1,
   "planet": "Hapes",
   "page": "p.104 AE",
   "abilities": [
    "Attractive: You receive a +1D bonus to any \"Bargain\", \"Con\", \"Command\", or \"Persuasion\" skill check made against non-Hapan humans of the opposite gender.",
    "Vision: Due to intense light from your home world you have poor night vision (see text)."
   ],
   "story": [
    "Language: If you are able to speak basic, it is as a second language."
   ],
   "skillImprove": [],
   "bonusSkills": [],
   "armorP": 0,
   "armorE": 0
  },
  {
   "name": "Lorrdians",
   "min": [
    6,
    6,
    3,
    9,
    6,
    3
   ],
   "max": [
    12,
    12,
    12,
    15,
    12,
    12
   ],
   "move": 10,
   "free": 21,
   "offset": 0,
   "hMin": 1.4,
   "hMax": 2,
   "planet": "Lorrd",
   "page": "p.104 AE",
   "abilities": [],
   "story": [
    "Enslaved:"
   ],
   "skillImprove": [],
   "bonusSkills": [
    {
     "name": "Body Language",
     "attr": "per"
    },
    {
     "name": "Kinetic Communication",
     "attr": "per"
    }
   ],
   "armorP": 0,
   "armorE": 0
  },
  {
   "name": "Ropagu",
   "min": [
    3,
    6,
    3,
    6,
    3,
    6
   ],
   "max": [
    6,
    15,
    6,
    16,
    5,
    15
   ],
   "move": 7,
   "free": 27,
   "offset": 0,
   "hMin": 1.7,
   "hMax": 1.9,
   "planet": "Ropagi II",
   "page": "p.106 AE",
   "abilities": [
    "Skill Bonus: (See text)",
    "Skill Limitation: (See text)"
   ],
   "story": [],
   "skillImprove": [],
   "bonusSkills": [],
   "armorP": 0,
   "armorE": 0
  },
  {
   "name": "Wroonian",
   "min": [
    6,
    6,
    6,
    6,
    6,
    6
   ],
   "max": [
    14,
    12,
    14,
    14,
    11,
    11
   ],
   "move": 10,
   "free": 18,
   "offset": 0,
   "hMin": 1.7,
   "hMax": 2.2,
   "planet": "Wroona",
   "page": "p.107 AE",
   "abilities": [],
   "story": [
    "Pursuit of Wealth: You are always concerned with personal wealth and belongings.",
    "Capricious: You are spontaneous and carefree."
   ],
   "skillImprove": [],
   "bonusSkills": [],
   "armorP": 0,
   "armorE": 0
  },
  {
   "name": "Xa Fel",
   "min": [
    3,
    3,
    3,
    6,
    3,
    3
   ],
   "max": [
    9,
    9,
    13,
    12,
    6,
    13
   ],
   "move": 7,
   "free": 24,
   "offset": -9,
   "hMin": 1.5,
   "hMax": 1.8,
   "planet": "Xa Fel",
   "page": "p.108 AE",
   "abilities": [],
   "story": [
    "Corporate Slaves: (Enslaved)"
   ],
   "skillImprove": [
    "Starfighter Piloting",
    "Starship Shields",
    "Starship Gunnery",
    "Starship Repair"
   ],
   "bonusSkills": [],
   "armorP": 0,
   "armorE": 0
  },
  {
   "name": "Zelosian",
   "min": [
    6,
    6,
    6,
    6,
    6,
    6
   ],
   "max": [
    12,
    12,
    11,
    12,
    11,
    11
   ],
   "move": 8,
   "free": 18,
   "offset": 0,
   "hMin": 1.5,
   "hMax": 2,
   "planet": "Zelos II",
   "page": "p.109 AE",
   "abilities": [
    "Afraid of the Dark: When in the dark you must make a Difficult Perception or Moderate \"Willpower\" check, or suffer a -1D penalty to all attribute and skill checks until you are back in well-lit area.",
    "Intoxication: You suffer the effects of intoxication after ingesting sugar, not after ingesting alcohol.",
    "Photosynthesis: You can derive nourishment from a star for up to one month."
   ],
   "story": [],
   "skillImprove": [],
   "bonusSkills": [],
   "armorP": 0,
   "armorE": 0
  }
 ],
 "trianii": {
  "Female": {
   "name": "Trianii (Female)",
   "min": [
    8,
    6,
    4,
    6,
    7,
    4
   ],
   "max": [
    12,
    12,
    12,
    12,
    14,
    14
   ],
   "move": 12,
   "free": 21,
   "offset": 2,
   "hMin": 1.5,
   "hMax": 2.2,
   "planet": "Trian",
   "page": "p.157 AE",
   "abilities": [
    "Claws: you deal Strength +1D damage",
    "Prehensile Tail:",
    "Special Balance: You gain a +D bonus to all actions involving \"Climbing\", \"Jumping\", and \"Acrobatics\"."
   ],
   "story": [
    "Female Physical Superiority:",
    "Feud with the Authority:"
   ],
   "skillImprove": [],
   "bonusSkills": [],
   "armorP": 0,
   "armorE": 0
  },
  "Male": {
   "name": "Trianii (Male)",
   "min": [
    7,
    6,
    4,
    6,
    6,
    4
   ],
   "max": [
    12,
    12,
    12,
    12,
    14,
    14
   ],
   "move": 12,
   "free": 21,
   "offset": 0,
   "hMin": 1.5,
   "hMax": 2.2,
   "planet": "Trian",
   "page": "p.157 AE",
   "abilities": [
    "Claws: you deal Strength +1D damage",
    "Prehensile Tail:",
    "Special Balance: You gain a +D bonus to all actions involving \"Climbing\", \"Jumping\", and \"Acrobatics\"."
   ],
   "story": [
    "Female Physical Superiority:",
    "Feud with the Authority:"
   ],
   "skillImprove": [],
   "bonusSkills": [],
   "armorP": 0,
   "armorE": 0
  }
 },
 "skills": {
  "dex": [
   "Acrobatics",
   "Archaic Guns",
   "Artillery",
   "Blaster",
   "Blaster Artillery",
   "Bowcaster",
   "Bows",
   "Brawling Parry",
   "Dodge",
   "Firearms",
   "Flamethrower",
   "Grenade",
   "Lightsaber",
   "Melee Combat",
   "Melee Parry",
   "Missile Weapons",
   "Pick Pockets",
   "Running",
   "Thrown Weapons",
   "Vehicle Blasters"
  ],
  "kno": [
   "Alien Species",
   "Bureaucracy",
   "Business",
   "Cultures",
   "Intimidation",
   "Languages",
   "Law Enforcement",
   "Planetary Systems",
   "Scholar",
   "Streetwise",
   "Survival",
   "Tactics",
   "Value",
   "Willpower"
  ],
  "mec": [
   "Aquatic Vehicle Op.",
   "Archaic Starship Pilot.",
   "Astrogation",
   "Beast Riding",
   "Capital Ship Gun.",
   "Capital Ship Piloting",
   "Capital Ship Shields",
   "Communications",
   "Ground Vehicle Op.",
   "Hover Vehicle Op.",
   "Jet Pack Operation",
   "Powersuit Operation",
   "Repulsorlift Op.",
   "Rocket Pack Op.",
   "Sensors",
   "Space Transport",
   "Starfighter Piloting",
   "Starship Gunnery",
   "Starship Shields",
   "Submersible Vehicle Op.",
   "Swoop Operation",
   "Walker Operation"
  ],
  "per": [
   "Bargain",
   "Command",
   "Con",
   "Forgery",
   "Gambling",
   "Hide",
   "Investigation",
   "Persuasion",
   "Search",
   "Sneak"
  ],
  "str": [
   "Brawling",
   "Climbing / Jumping",
   "Lifting",
   "Stamina",
   "Swimming"
  ],
  "tec": [
   "Aquatic Vehicle Rep.",
   "Armor Repair",
   "Blaster Repair",
   "Capital Ship Repair",
   "Capital Ship Weap. Rep.",
   "Computer Prog. / Rep.",
   "Demolition",
   "Droid Prog.",
   "Droid Repair",
   "First Aid",
   "Ground Vehicle Rep.",
   "Lightsaber Repair",
   "Melee Repair",
   "Repulsorlift Repair",
   "Security",
   "Space Transport Rep.",
   "Starfighter Repair",
   "Starship Weapon Rep.",
   "Walker Repair"
  ]
 },
 "powers": [
  {
   "name": "Absorb / Dissipate Energy",
   "cat": "Control",
   "prereq": "No Prerequisite",
   "page": "p.41",
   "diff": "Special",
   "kept": "Yes",
   "dark": "No"
  },
  {
   "name": "Accelerate Healing",
   "cat": "Control",
   "prereq": "No Prerequisite",
   "page": "p. 41",
   "diff": "Special",
   "kept": "No",
   "dark": "No"
  },
  {
   "name": "Burst of Speed",
   "cat": "Control",
   "prereq": "Enhance Attribute",
   "page": "Player Made",
   "diff": "Moderate",
   "kept": "No",
   "dark": "No"
  },
  {
   "name": "Channel Rage",
   "cat": "Control",
   "prereq": "No Prerequisite",
   "page": "Player Made",
   "diff": "Easy",
   "kept": "Yes",
   "dark": "Yes"
  },
  {
   "name": "Concentration",
   "cat": "Control",
   "prereq": "No Prerequisite",
   "page": "p. 41",
   "diff": "Special",
   "kept": "No",
   "dark": "No"
  },
  {
   "name": "Contort / Escape",
   "cat": "Control",
   "prereq": "Concentration, Control Pain, and Enhance Attribute",
   "page": "p. 41",
   "diff": "Special",
   "kept": "No",
   "dark": "No"
  },
  {
   "name": "Control Disease",
   "cat": "Control",
   "prereq": "Accelerate Healing",
   "page": "MB p. 143",
   "diff": "Special",
   "kept": "No",
   "dark": "No"
  },
  {
   "name": "Control Pain",
   "cat": "Control",
   "prereq": "No Prerequisite",
   "page": "P. 41, 44",
   "diff": "Special",
   "kept": "Yes",
   "dark": "No"
  },
  {
   "name": "Detoxify Poison",
   "cat": "Control",
   "prereq": "No Prerequisite",
   "page": "p. 44",
   "diff": "Special",
   "kept": "No",
   "dark": "No"
  },
  {
   "name": "Direction Sense",
   "cat": "Sense",
   "prereq": "No Prerequisite",
   "page": "REUP p. 159",
   "diff": "Easy",
   "kept": "Yes",
   "dark": "No"
  },
  {
   "name": "Emptiness",
   "cat": "Control",
   "prereq": "Hibernation Trance",
   "page": "p. 44",
   "diff": "Moderate",
   "kept": "No",
   "dark": "No"
  },
  {
   "name": "Enhance Attribute",
   "cat": "Control",
   "prereq": "No Prerequisite",
   "page": "p. 44-45",
   "diff": "Moderate",
   "kept": "No",
   "dark": "No"
  },
  {
   "name": "Force Jump",
   "cat": "Control & Alter",
   "prereq": "Enhance Attribute, Telekinesis",
   "page": "REUP p. 167",
   "diff": "Easy",
   "kept": "No",
   "dark": "No"
  },
  {
   "name": "Force of Will",
   "cat": "Control",
   "prereq": "No Prerequisite",
   "page": "p. 45",
   "diff": "Easy",
   "kept": "Yes",
   "dark": "No"
  },
  {
   "name": "Greater Force Shield",
   "cat": "Sense & Alter",
   "prereq": "Absorb / Dissipate Energy, Concentration, Magnify Senses, Telekinesis, Lesser Force Shield",
   "page": "REUP p. 168",
   "diff": "Difficult / Very Difficult",
   "kept": "Yes",
   "dark": "No"
  },
  {
   "name": "Hibernation Trance",
   "cat": "Control",
   "prereq": "No Prerequisite",
   "page": "p. 45",
   "diff": "Difficult",
   "kept": "Yes",
   "dark": "No"
  },
  {
   "name": "Instinctive Astrogation: Control",
   "cat": "Control",
   "prereq": "No Prerequisite",
   "page": "p. 46",
   "diff": "Very Difficult +",
   "kept": "No",
   "dark": "No"
  },
  {
   "name": "Kinetic Combat",
   "cat": "Alter",
   "prereq": "Telekinesis",
   "page": "REUP p. 163",
   "diff": "Difficult",
   "kept": "No",
   "dark": "No"
  },
  {
   "name": "Lifemerge",
   "cat": "Control & Sense",
   "prereq": "No Prerequisite",
   "page": "REUP p. 165",
   "diff": "Difficult",
   "kept": "No",
   "dark": "No"
  },
  {
   "name": "Merge Senses",
   "cat": "Sense",
   "prereq": "Magnify Senses",
   "page": "REUP p. 160",
   "diff": "Moderate",
   "kept": "No",
   "dark": "No"
  },
  {
   "name": "Predict Natural Disaster",
   "cat": "Sense",
   "prereq": "Danger Sense, Life Detection, Weather Sense, Magnify Senses",
   "page": "REUP p. 160",
   "diff": "Special",
   "kept": "No",
   "dark": "No"
  },
  {
   "name": "Rage",
   "cat": "Control",
   "prereq": "Hibernation Trance",
   "page": "p. 46",
   "diff": "Difficult",
   "kept": "No",
   "dark": "Yes"
  },
  {
   "name": "Redirect Energy",
   "cat": "Control & Alter",
   "prereq": "Absorb / Dissipate Energy",
   "page": "REUP p. 168",
   "diff": "Difficult / Very Difficult",
   "kept": "No",
   "dark": "No"
  },
  {
   "name": "Reduce Injury",
   "cat": "Control",
   "prereq": "Control Pain",
   "page": "p. 46-47",
   "diff": "Special",
   "kept": "No",
   "dark": "No"
  },
  {
   "name": "Remain Conscious",
   "cat": "Control",
   "prereq": "Control Pain",
   "page": "p. 47",
   "diff": "Special",
   "kept": "No",
   "dark": "No"
  },
  {
   "name": "Remove Fatigue",
   "cat": "Control",
   "prereq": "Accelerate Healing and Control Pain",
   "page": "p. 47",
   "diff": "Moderate",
   "kept": "Yes",
   "dark": "No"
  },
  {
   "name": "Resist Stun",
   "cat": "Control",
   "prereq": "No Prerequisite",
   "page": "p. 47",
   "diff": "Moderate",
   "kept": "Yes",
   "dark": "No"
  },
  {
   "name": "Short-Term Memory Enhancement",
   "cat": "Control",
   "prereq": "Hibernation Trance",
   "page": "p. 47-48",
   "diff": "Difficult",
   "kept": "No",
   "dark": "No"
  },
  {
   "name": "Beast Languages",
   "cat": "Sense",
   "prereq": "Translation",
   "page": "p. 48",
   "diff": "Special",
   "kept": "Yes",
   "dark": "No"
  },
  {
   "name": "Combat Sense",
   "cat": "Sense",
   "prereq": "Danger Sense",
   "page": "p. 48",
   "diff": "Mod. +3 / additional",
   "kept": "No",
   "dark": "No"
  },
  {
   "name": "Danger Sense",
   "cat": "Sense",
   "prereq": "Life Detection",
   "page": "p. 48",
   "diff": "Mod. or Attacker's Roll",
   "kept": "Yes",
   "dark": "No"
  },
  {
   "name": "Instinctive Astrogation: Sense",
   "cat": "Sense",
   "prereq": "Magnify Senses",
   "page": "p. 48-49",
   "diff": "Moderate +",
   "kept": "No",
   "dark": "No"
  },
  {
   "name": "Life Detection",
   "cat": "Sense",
   "prereq": "No Prerequisite",
   "page": "p. 49",
   "diff": "Very Easy or Mod.",
   "kept": "Yes",
   "dark": "No"
  },
  {
   "name": "Life Sense",
   "cat": "Sense",
   "prereq": "Life Detection",
   "page": "p. 49",
   "diff": "Very Easy +",
   "kept": "Yes",
   "dark": "No"
  },
  {
   "name": "Life Web",
   "cat": "Sense",
   "prereq": "Life Sense and Sense Force",
   "page": "p. 49",
   "diff": "Special",
   "kept": "No",
   "dark": "No"
  },
  {
   "name": "Magnify Senses",
   "cat": "Sense",
   "prereq": "No Prerequisite",
   "page": "p. 49",
   "diff": "Very Easy +",
   "kept": "No",
   "dark": "No"
  },
  {
   "name": "Postcognition",
   "cat": "Sense",
   "prereq": "Hibernation Trance, Life Detection,  and Sense Force",
   "page": "MB p. 146",
   "diff": "Special",
   "kept": "No",
   "dark": "No"
  },
  {
   "name": "Receptive Telepathy",
   "cat": "Sense",
   "prereq": "Life Sense",
   "page": "p. 49-50",
   "diff": "Special",
   "kept": "Yes",
   "dark": "No"
  },
  {
   "name": "Sense Force",
   "cat": "Sense",
   "prereq": "No Prerequisite",
   "page": "p. 50",
   "diff": "Moderate +",
   "kept": "No",
   "dark": "No"
  },
  {
   "name": "Sense Force Potential",
   "cat": "Sense",
   "prereq": "Life Sense, Receptive Telepathy, and Sense Force",
   "page": "p. 50",
   "diff": "Special",
   "kept": "No",
   "dark": "No"
  },
  {
   "name": "Sense Path",
   "cat": "Sense",
   "prereq": "Emptiness",
   "page": "p. 50-51",
   "diff": "Moderate",
   "kept": "Yes",
   "dark": "No"
  },
  {
   "name": "Shift Sense",
   "cat": "Sense",
   "prereq": "Magnify Senses",
   "page": "p. 51-52",
   "diff": "Special",
   "kept": "Yes",
   "dark": "No"
  },
  {
   "name": "Translation",
   "cat": "Sense",
   "prereq": "Projective Telepathy",
   "page": "p. 52",
   "diff": "Mod. or Diff. +",
   "kept": "Yes",
   "dark": "No"
  },
  {
   "name": "Up the Walls",
   "cat": "Control",
   "prereq": "Enhance Attribute, Burst of Speed",
   "page": "REUP p. 158",
   "diff": "Difficult",
   "kept": "No",
   "dark": "No"
  },
  {
   "name": "Weather Sense",
   "cat": "Sense",
   "prereq": "Magnify Senses",
   "page": "p. 52",
   "diff": "Special",
   "kept": "Yes",
   "dark": "No"
  },
  {
   "name": "Bolt of Hatred",
   "cat": "Alter",
   "prereq": "No Prerequisite",
   "page": "p. 87",
   "diff": "Moderate",
   "kept": "No",
   "dark": "Yes"
  },
  {
   "name": "Dark Side Web",
   "cat": "Alter",
   "prereq": "No Prerequisite",
   "page": "p. 87",
   "diff": "Difficult",
   "kept": "Yes",
   "dark": "Yes"
  },
  {
   "name": "Force Push",
   "cat": "Alter",
   "prereq": "Telekinesis",
   "page": "Player Made",
   "diff": "Moderate",
   "kept": "No",
   "dark": "No"
  },
  {
   "name": "Injure / Kill",
   "cat": "Alter",
   "prereq": "Life Sense",
   "page": "p. 52",
   "diff": "Target's Roll",
   "kept": "No",
   "dark": "Yes"
  },
  {
   "name": "Telekinesis",
   "cat": "Alter",
   "prereq": "No Prerequisite",
   "page": "p. 52-53",
   "diff": "Special",
   "kept": "Yes",
   "dark": "No"
  },
  {
   "name": "Farseeing",
   "cat": "Control & Sense",
   "prereq": "Life Sense",
   "page": "p. 53",
   "diff": "Special",
   "kept": "No",
   "dark": "No"
  },
  {
   "name": "Lifebond",
   "cat": "Control & Sense",
   "prereq": "Life Sense, Receptive Telepathy, and Magnify Senses",
   "page": "p. 54",
   "diff": "Moderate / Special",
   "kept": "Yes",
   "dark": "No"
  },
  {
   "name": "Lightsaber Combat",
   "cat": "Control & Sense",
   "prereq": "No Prerequisite",
   "page": "p. 54-55",
   "diff": "Mod. / Easy",
   "kept": "Yes",
   "dark": "No"
  },
  {
   "name": "Projective Telepathy",
   "cat": "Control & Sense",
   "prereq": "Receptive Telepathy",
   "page": "p. 55",
   "diff": "Very Easy + / Very Easy +",
   "kept": "No",
   "dark": "No"
  },
  {
   "name": "Sith Sorcery",
   "cat": "Control & Sense",
   "prereq": "Enhance Attribute, Feed on Dark Side, Life Sense, and Sense Force",
   "page": "Player Made",
   "diff": "Diff. / Mod.",
   "kept": "No",
   "dark": "Yes"
  },
  {
   "name": "Sith Sword Combat",
   "cat": "Control & Sense",
   "prereq": "No Prerequisite",
   "page": "Player Made",
   "diff": "Mod. / Easy",
   "kept": "Yes",
   "dark": "No"
  },
  {
   "name": "Accelerate Another's Healing",
   "cat": "Control & Alter",
   "prereq": "Control Another's Pain",
   "page": "p. 55",
   "diff": "Very Easy + / Very Easy",
   "kept": "No",
   "dark": "No"
  },
  {
   "name": "Aura of Uneasiness",
   "cat": "Control & Alter",
   "prereq": "No Prerequisite",
   "page": "p. 87",
   "diff": "Easy + / Easy",
   "kept": "No",
   "dark": "Yes"
  },
  {
   "name": "Control Another's Disease",
   "cat": "Control & Alter",
   "prereq": "Control Another's Pain",
   "page": "p. 55-56",
   "diff": "Very Easy + / Very Easy",
   "kept": "No",
   "dark": "No"
  },
  {
   "name": "Control Another's Pain",
   "cat": "Control & Alter",
   "prereq": "Control Pain",
   "page": "p. 56",
   "diff": "Very Easy + / Special",
   "kept": "No",
   "dark": "No"
  },
  {
   "name": "Control Breathing",
   "cat": "Control & Alter",
   "prereq": "Concentration, Hibernation Trance, and Telekinesis",
   "page": "p. 56",
   "diff": "Mod. / Very Diff.",
   "kept": "Special",
   "dark": "No"
  },
  {
   "name": "Detoxify poison in Another",
   "cat": "Control & Alter",
   "prereq": "Accelerate Another's Healing, and Detoxify Poison",
   "page": "p. 56",
   "diff": "Very Easy + / Special",
   "kept": "No",
   "dark": "No"
  },
  {
   "name": "Electronic Manipulation",
   "cat": "Control & Alter",
   "prereq": "Absorb / Dissipate Energy, and Affect Mind",
   "page": "p. 87",
   "diff": "Special / Special",
   "kept": "No",
   "dark": "Yes"
  },
  {
   "name": "Feed on Dark Side",
   "cat": "Control & Alter",
   "prereq": "Sense Force",
   "page": "p. 56-57",
   "diff": "Mod. / Mod. +Special",
   "kept": "Yes",
   "dark": "Yes"
  },
  {
   "name": "Force Lightning",
   "cat": "Control & Alter",
   "prereq": "No Prerequisite",
   "page": "p. 57",
   "diff": "Diff. + / Target's Roll",
   "kept": "No",
   "dark": "Yes"
  },
  {
   "name": "Hatred",
   "cat": "Control & Alter",
   "prereq": "Inflict Pain, Injure/Kill, Rage, Waves of Darkness",
   "page": "Player Made",
   "diff": "Mod. / Target's Roll",
   "kept": "No",
   "dark": "Yes"
  },
  {
   "name": "Inflict Pain",
   "cat": "Control & Alter",
   "prereq": "Control Pain, and Life Sense",
   "page": "p. 57",
   "diff": "Very Easy + / Target's Roll",
   "kept": "No",
   "dark": "Yes"
  },
  {
   "name": "Place Another in Hibernation Trance",
   "cat": "Control & Alter",
   "prereq": "Hibernation Trance",
   "page": "p. 57",
   "diff": "Very Easy + / Very Easy +",
   "kept": "No",
   "dark": "No"
  },
  {
   "name": "Remove Another's Fatigue",
   "cat": "Control & Alter",
   "prereq": "Accelerate Another's Healing, and Remove Fatigue",
   "page": "p. 57",
   "diff": "Easy / Mod. +",
   "kept": "No",
   "dark": "No"
  },
  {
   "name": "Return Another to Consciousness",
   "cat": "Control & Alter",
   "prereq": "Remain Conscious",
   "page": "p. 57",
   "diff": "Easy + / Special",
   "kept": "No",
   "dark": "No"
  },
  {
   "name": "Transfer Force",
   "cat": "Control & Alter",
   "prereq": "Control Another's Pain",
   "page": "p. 57",
   "diff": "Easy + / Mod.",
   "kept": "No",
   "dark": "No"
  },
  {
   "name": "Waves of Darkness",
   "cat": "Control & Alter",
   "prereq": "No Prerequisite",
   "page": "p. 87",
   "diff": "Special / Special",
   "kept": "Yes",
   "dark": "Yes"
  },
  {
   "name": "Dim Another's Senses",
   "cat": "Sense & Alter",
   "prereq": "No Prerequisite",
   "page": "p. 64",
   "diff": "Easy + / Target's Roll",
   "kept": "Yes",
   "dark": "No"
  },
  {
   "name": "Force Wind",
   "cat": "Sense & Alter",
   "prereq": "Magnify Senses, Shift Sense, and Telekinesis",
   "page": "p. 88",
   "diff": "Moderate / Special",
   "kept": "Yes",
   "dark": "Yes"
  },
  {
   "name": "Lesser Force Shield",
   "cat": "Sense & Alter",
   "prereq": "Absorb / Dissipate Energy, Concentration, Magnify Senses, and Telekinesis",
   "page": "p. 65",
   "diff": "Easy / Moderate",
   "kept": "Yes",
   "dark": "No"
  },
  {
   "name": "Affect Mind",
   "cat": "Control, Sense & Alter",
   "prereq": "No Prerequisite",
   "page": "p. 58",
   "diff": "Special",
   "kept": "No",
   "dark": "No"
  },
  {
   "name": "Alchemy",
   "cat": "Control, Sense & Alter",
   "prereq": "Accelerate Another's Healing, Injure/Kill, Place Another in Hibernation Trance, Sith Sorcery, Transfer Force",
   "page": "Player Made",
   "diff": "Mod. / Mod. / Var.",
   "kept": "No",
   "dark": "Yes"
  },
  {
   "name": "Battle Meditation",
   "cat": "Control, Sense & Alter",
   "prereq": "No Prerequisite",
   "page": "p. 58-59",
   "diff": "Special",
   "kept": "Yes",
   "dark": "No"
  },
  {
   "name": "Control Mind",
   "cat": "Control, Sense & Alter",
   "prereq": "No Prerequisite",
   "page": "p. 59-60",
   "diff": "Mod. Target's Roll / Special",
   "kept": "No",
   "dark": "Yes"
  },
  {
   "name": "Create Force Storm",
   "cat": "Control, Sense & Alter",
   "prereq": "Hibernation Trance, Life Sense, Magnify Senses, Projective Telepathy, Sense Force, Telekinesis, Instinctive Astrogation (Either), Rage",
   "page": "p. 60",
   "diff": "Heroic / Heroic / Heroic",
   "kept": "No",
   "dark": "Yes"
  },
  {
   "name": "Doppelganger",
   "cat": "Control, Sense & Alter",
   "prereq": "Control Another's Pain, Emptiness, Magnify Senses, Projective Telepathy, Sense Force, Telekinesis, Transfer Force, Affect Mind",
   "page": "p. 60",
   "diff": "V. D. / V. D. / Heroic",
   "kept": "Yes",
   "dark": "Yes"
  },
  {
   "name": "Drain Life Energy",
   "cat": "Control, Sense & Alter",
   "prereq": "No Prerequisite",
   "page": "p. 88",
   "diff": "Easy / Easy + / Easy",
   "kept": "Yes",
   "dark": "Yes"
  },
  {
   "name": "Drain Life Essence",
   "cat": "Control, Sense & Alter",
   "prereq": "Control Another's Pain, Emptiness, Magnify Senses, Projective Telepathy, Sense Force, Telekinesis, Transfer Force, Affect Mind",
   "page": "p. 60-61",
   "diff": "Special",
   "kept": "Yes",
   "dark": "Yes"
  },
  {
   "name": "Enhanced Coordination",
   "cat": "Control, Sense & Alter",
   "prereq": "No Prerequisite",
   "page": "p. 62",
   "diff": "Mod. / Diff. / Special",
   "kept": "No",
   "dark": "No"
  },
  {
   "name": "Force Harmony",
   "cat": "Control, Sense & Alter",
   "prereq": "Life Sense, and Projective Telepathy",
   "page": "p. 62-63",
   "diff": "Diff. + / Diff. + / Mod.",
   "kept": "Yes",
   "dark": "No"
  },
  {
   "name": "Illusion",
   "cat": "Control, Sense & Alter",
   "prereq": "Affect Mind, Dim Another's Senses, Life Detection, Life Sense, Projective Telepathy, Sense Force",
   "page": "Player Made",
   "diff": "Special",
   "kept": "Yes",
   "dark": "No"
  },
  {
   "name": "Memory Wipe",
   "cat": "Control, Sense & Alter",
   "prereq": "Control Another's Pain, Emptiness, Magnify Senses, Projective Telepathy, Sense Force, Telekinesis, Transfer Force, Affect Mind",
   "page": "p. 88",
   "diff": "Special",
   "kept": "No",
   "dark": "Yes"
  },
  {
   "name": "Projected Fighting",
   "cat": "Control, Sense & Alter",
   "prereq": "Concentration, and Telekinesis",
   "page": "p. 63",
   "diff": "Diff. / Diff. / Mod. +",
   "kept": "No",
   "dark": "No"
  },
  {
   "name": "Telekinetic Kill",
   "cat": "Control, Sense & Alter",
   "prereq": "Inflict Pain, Injure / Kill, and Life Sense",
   "page": "p. 63",
   "diff": "E. + / E. + / Target's Roll",
   "kept": "No",
   "dark": "Yes"
  },
  {
   "name": "Transfer Life",
   "cat": "Control, Sense & Alter",
   "prereq": "Special",
   "page": "p. 63-64",
   "diff": "Heroic + / Heroic + / Special",
   "kept": "No",
   "dark": "Yes"
  },
  {
   "name": "Force Scream",
   "cat": "Special",
   "prereq": "Special",
   "page": "p. 65",
   "diff": "No Roll",
   "kept": "No",
   "dark": "Special"
  },
  {
   "name": "Breath Control",
   "cat": "Control",
   "prereq": "Concentration, Hibernation Trance",
   "page": "GG16 p. 187",
   "diff": "Moderate if at ease or rest, Difficult if in motion, Very Difficult if performing strenuous activities",
   "kept": "No",
   "dark": "No"
  },
  {
   "name": "Deflect Energy",
   "cat": "Control",
   "prereq": "Absorb / Dissipate Energy",
   "page": "GG16 p. 189",
   "diff": "Moderate plus the damage roll of the attack",
   "kept": "No",
   "dark": "No"
  },
  {
   "name": "Force Body",
   "cat": "Control",
   "prereq": "Concentration, Control Pain, Reduce Injury, Remain Conscious",
   "page": "GG16 p. 190",
   "diff": "Difficult",
   "kept": "No",
   "dark": "No"
  },
  {
   "name": "Force Comprehension",
   "cat": "Control",
   "prereq": "Concentration",
   "page": "GG16 p. 191",
   "diff": "Moderate",
   "kept": "No",
   "dark": "No"
  },
  {
   "name": "Resist Force",
   "cat": "Control",
   "prereq": "Concentration",
   "page": "GG16 p. 194",
   "diff": "Moderate",
   "kept": "No",
   "dark": "No"
  },
  {
   "name": "Mechu-Deru",
   "cat": "Sense",
   "prereq": "Absorb / Dissipate Energy, Affect Mind",
   "page": "GG16 p. 197",
   "diff": "Very Easy for hand-held devices, Easy for droids and character -scale devices, Moderate for starfighters and speeder -scale vehicles and devices, Difficult for walkerscale vehicles and devices, Very Difficult for space transports, Heroic for capital -scale vehicles and devices",
   "kept": "No",
   "dark": "No"
  },
  {
   "name": "Sense True Nature",
   "cat": "Sense",
   "prereq": "Life Detection, Life Sense, Receptive Telepathy",
   "page": "GG16 p. 200",
   "diff": "Moderate for friendly, unresistant targets. Moderate plus target’s Perception or control roll (whichever is higher) to determine the difficulty of the probe on an unwilling subject",
   "kept": "No",
   "dark": "No"
  },
  {
   "name": "Time Awareness",
   "cat": "Sense",
   "prereq": "Magnify Senses, Sense Force",
   "page": "GG16 p. 201",
   "diff": "Moderate",
   "kept": "No",
   "dark": "No"
  },
  {
   "name": "Force Whirlwind",
   "cat": "Alter",
   "prereq": "Telekinesis",
   "page": "GG16 p. 202",
   "diff": "Moderate, or target’s Strength roll (whichever is higher)",
   "kept": "No",
   "dark": "Yes"
  },
  {
   "name": "Force Burst",
   "cat": "Alter",
   "prereq": "Concentration, Force blast, Force Push, Projected Fighting, repulse, Telekinesis",
   "page": "GG16 p. 202",
   "diff": "Varies",
   "kept": "No",
   "dark": "No"
  },
  {
   "name": "Force Channel",
   "cat": "Control & Alter",
   "prereq": "No Prerequisite",
   "page": "GG16 p. 202",
   "diff": "Difficult / Difficult",
   "kept": "No",
   "dark": "No"
  },
  {
   "name": "Force Eruption",
   "cat": "Alter",
   "prereq": "No Prerequisite",
   "page": "GG16 p. 203",
   "diff": "Moderate; modified by proximity",
   "kept": "No",
   "dark": "No"
  },
  {
   "name": "Force Flight",
   "cat": "Alter",
   "prereq": "Concentration, Telekinesis",
   "page": "GG16 p. 203",
   "diff": "Equal to the number of meters the Jedi wishes to move himself (20 meters maximum)",
   "kept": "No",
   "dark": "No"
  },
  {
   "name": "Force Potency",
   "cat": "Alter",
   "prereq": "Empower Force",
   "page": "GG16 p. 203",
   "diff": "Very Difficult",
   "kept": "No",
   "dark": "Yes"
  },
  {
   "name": "Forcequake",
   "cat": "Alter",
   "prereq": "Force whirlwind, Telekinesis",
   "page": "GG16 p. 204",
   "diff": "Moderate or Difficult, modified by proximity, but must be within line of sight",
   "kept": "No",
   "dark": "No"
  },
  {
   "name": "Inspire",
   "cat": "Alter",
   "prereq": "Affect Mind, Battle Meditation",
   "page": "GG16 p. 205",
   "diff": "Very Difficult, modified for proximity. This power may be kept \"up.\"",
   "kept": "No",
   "dark": "No"
  },
  {
   "name": "Detoxify Another’s Poison",
   "cat": "Control & Alter",
   "prereq": "Accelerate Healing, Accelerate Another's Healing, Control Pain, Control Another's Pain, Detoxify Poison",
   "page": "GG16 p. 208",
   "diff": "Very Easy, modified by relationship / Very Easy for a very mild poison (such as alcohol); Easy for a mild poison; Moderate for an average poison ; Difficult for a virulent poison; Very Difficult to Heroic for a neurotoxin",
   "kept": "No",
   "dark": "No"
  },
  {
   "name": "Force Weapon",
   "cat": "Control & Alter",
   "prereq": "Concentration",
   "page": "GG16 p. 209",
   "diff": "Equal to the melee weapon’s base difficulty (ie, a knife is Very Easy) / Moderate",
   "kept": "No",
   "dark": "No"
  },
  {
   "name": "Overload Saber",
   "cat": "Control & Alter",
   "prereq": "Concentration, Force weapon",
   "page": "GG16 p. 211",
   "diff": "Moderate / Moderate",
   "kept": "No",
   "dark": "No"
  },
  {
   "name": "Slow",
   "cat": "Control & Alter",
   "prereq": "Accelerate Healing, Accelerate Another's Healing, Control Pain, Control Another's Pain, Remove Fatigue, Remove Another's Fatigue",
   "page": "GG16 p. 211",
   "diff": "Easy / Moderate, or target’s control or Perception roll",
   "kept": "No",
   "dark": "No"
  },
  {
   "name": "Force Breach",
   "cat": "Sense & Alter",
   "prereq": "Affect Mind, Dim Another's Senses, Sense Force",
   "page": "GG16 p. 212",
   "diff": "Easy / Target’s opposed control roll",
   "kept": "No",
   "dark": "No"
  },
  {
   "name": "Force Blinding",
   "cat": "Sense & Alter",
   "prereq": "Dim Another's Senses",
   "page": "GG16 p. 213",
   "diff": "Easy, modified by proximity / Difficult, or target’s Perception or control roll",
   "kept": "No",
   "dark": "No"
  },
  {
   "name": "Balance of the Force",
   "cat": "Control, Sense & Alter",
   "prereq": "Sense Force",
   "page": "GG16 p. 215",
   "diff": "Moderate if the user was initially a servant of the Light Side; Difficult if the user was initially a minion of the Dark Side / Moderate / Target’s control or Strength roll, line of sight only",
   "kept": "No",
   "dark": "Yes"
  },
  {
   "name": "Force Mastery",
   "cat": "Control, Sense & Alter",
   "prereq": "Extend Force, Force channel",
   "page": "GG16 p. 216",
   "diff": "Difficult / Difficult / Difficult",
   "kept": "No",
   "dark": "No"
  },
  {
   "name": "Machine Meld",
   "cat": "Control, Sense & Alter",
   "prereq": "Absorb / Dissipate Energy, Affect Mind, Concentration, mechu-deru, technometry",
   "page": "GG16 p. 218",
   "diff": "Moderate / Difficult / Difficult for a single computer terminal, speeder-scale, and walker-scale vehicles, Very Difficult for a ship’s system, Heroic for a starfighter-scale starship, Heroic +10 for a capital- scale ship",
   "kept": "No",
   "dark": "No"
  },
  {
   "name": "Technometry",
   "cat": "Control, Sense & Alter",
   "prereq": "Absorb / Dissipate Energy, Affect Mind",
   "page": "GG16 p. 219",
   "diff": "Easy / Moderate / Moderate (or opposed Perception roll for droids)",
   "kept": "No",
   "dark": "No"
  },
  {
   "name": "Teleport",
   "cat": "Control, Sense & Alter",
   "prereq": "Concentration, Farseeing, Hibernation Trance, Instinctive Astrogation: Sense, Life Detection, Life Sense, Magnify Senses, Projective Telepathy, Receptive Telepathy, Sense Force, Telekinesis",
   "page": "GG16 p. 219",
   "diff": "Difficult / Difficult, modified by familiarity of destination / Difficult, modified by distance to destination",
   "kept": "No",
   "dark": "No"
  },
  {
   "name": "Ball Lightning",
   "cat": "Alter",
   "prereq": "Absorb / Dissipate Energy, Control Pain, Force Lightning, Force shot, Inflict Pain, Injure / Kill, Life Detection, Life Sense, Sense Force",
   "page": "GG16 p. 221",
   "diff": "Moderate",
   "kept": "No",
   "dark": "Yes"
  },
  {
   "name": "Crushing Darkness",
   "cat": "Alter",
   "prereq": "Control Pain, Inflict Pain, Life Detection, Life Sense, Telekinesis",
   "page": "GG16 p. 221",
   "diff": "Moderate",
   "kept": "No",
   "dark": "Yes"
  },
  {
   "name": "Devastating Force",
   "cat": "Alter",
   "prereq": "Empower Force",
   "page": "GG16 p. 222",
   "diff": "Difficult or Very Difficult",
   "kept": "No",
   "dark": "Yes"
  },
  {
   "name": "Drain Energy",
   "cat": "Control & Alter",
   "prereq": "Absorb / Dissipate Energy",
   "page": "GG16 p. 223",
   "diff": "Very Easy for simple devices (datapads, holorecorders, droid callers); Easy for power packs (such as blasters); Moderate for energy cells (lightsabers, force pikes, vibro weapons); Difficult for portable generators (E -Web repeating blasters, droids) / Easy if the target is a non - sentient piece of equipment. If the target is a droid, the alter difficulty is the droid’s Strength roll",
   "kept": "No",
   "dark": "Yes"
  },
  {
   "name": "Fear",
   "cat": "Control & Alter",
   "prereq": "Aura of Uneasiness",
   "page": "GG16 p. 223",
   "diff": "Target’s opposing control or Perception roll / Moderate",
   "kept": "No",
   "dark": "Yes"
  },
  {
   "name": "Death Field",
   "cat": "Control, Sense & Alter",
   "prereq": "Accelerate Another's Healing, Accelerate Healing, Affect Mind, Concentration, Control Another's Pain, Control Mind, Control Pain, Dim Another's Senses, Drain Life Energy, Drain Life Essence, Farseeing, Hibernation Trance, Injure / Kill, Life Detection, Life Sense, Magnify Senses, Projective Telepathy, Receptive Telepathy, Sense Force, Telekinesis, Transfer Force",
   "page": "GG16 p. 227",
   "diff": "Target’s Perception or control roll / Difficult / Target’s Strength roll",
   "kept": "No",
   "dark": "Yes"
  },
  {
   "name": "Force Walk",
   "cat": "Control, Sense & Alter",
   "prereq": "Accelerate Another's Healing, Accelerate Healing, Affect Mind, Control Another's Pain, Control Mind, Control Pain, Dim Another's Senses, Drain Life Essence, Enhance Attribute, Farseeing, Feed on Dark Side, Hibernation Trance, Injure / Kill, Life Detection, Life Sense, Magnify Senses, Projective Telepathy, Receptive Telepathy, Sense Force, Sith Sorcery, Telekinesis, Transfer Force",
   "page": "GG16 p. 229",
   "diff": "Very Difficult / Difficult / Difficult",
   "kept": "No",
   "dark": "No"
  },
  {
   "name": "Voss Healing Ritual",
   "cat": "Control, Sense & Alter",
   "prereq": "Accelerate Another's Healing, Control Another's Pain, Control Pain, Life Detection, Life Sense, Projective Telepathy, Receptive Telepathy, Transfer Force",
   "page": "GG16 p. 231",
   "diff": "Easy. Modified by relationship / Easy. Modified by proximity / Very Easy. Modified by relationship",
   "kept": "No",
   "dark": "No"
  },
  {
   "name": "Empower Force",
   "cat": "Alter",
   "prereq": "No Prerequisite",
   "page": "Hero's Guide p. 139",
   "diff": "Very Difficult",
   "kept": "No",
   "dark": "No"
  },
  {
   "name": "Extend Force",
   "cat": "Alter",
   "prereq": "No Prerequisite",
   "page": "Hero's Guide p. 140",
   "diff": "Difficult",
   "kept": "No",
   "dark": "No"
  },
  {
   "name": "Force Shot",
   "cat": "Sense",
   "prereq": "Life Detection, Life Sense, Sense Force",
   "page": "SW Gamer 9 p. 92",
   "diff": "Moderate",
   "kept": "Yes",
   "dark": "Yes"
  },
  {
   "name": "Force Blast",
   "cat": "Alter",
   "prereq": "Telekinesis",
   "page": "Force Unleashed CG p. 86",
   "diff": "Easy 3D / Moderate 4D / Difficult 5D / Very Difficult 6D / Heroic 7D damage",
   "kept": "No",
   "dark": "Yes"
  },
  {
   "name": "Repulse",
   "cat": "Alter",
   "prereq": "Telekinesis",
   "page": "Force Unleashed CG p. 86",
   "diff": "Opposed Strength or control roll",
   "kept": "No",
   "dark": "Yes"
  }
 ],
 "equipment": [
  {
   "cat": "Communication",
   "name": "Comlink (Military)",
   "cost": 100,
   "avail": "2R",
   "note": ""
  },
  {
   "cat": "Communication",
   "name": "Comlink (Personal)",
   "cost": 25,
   "avail": "1",
   "note": ""
  },
  {
   "cat": "Communication",
   "name": "Comlink (Vehicle)",
   "cost": 300,
   "avail": "1",
   "note": ""
  },
  {
   "cat": "General",
   "name": "Backpack",
   "cost": 10,
   "avail": "1",
   "note": ""
  },
  {
   "cat": "General",
   "name": "Beltpack",
   "cost": 5,
   "avail": "1",
   "note": ""
  },
  {
   "cat": "General",
   "name": "Body Glove",
   "cost": 700,
   "avail": "3",
   "note": "Adds +1 to any subsequent \"Survival\" or \"Stamina\" rolls in harsh envrionments"
  },
  {
   "cat": "General",
   "name": "Breath Mask",
   "cost": 50,
   "avail": "1",
   "note": ""
  },
  {
   "cat": "General",
   "name": "Chronometer (w/ compartment)",
   "cost": 50,
   "avail": "1",
   "note": "8cm x 6cm x 3cm"
  },
  {
   "cat": "General",
   "name": "Datapad",
   "cost": 100,
   "avail": "1",
   "note": ""
  },
  {
   "cat": "General",
   "name": "Fusion Grappler",
   "cost": 100,
   "avail": "2",
   "note": "Grappling Hook"
  },
  {
   "cat": "General",
   "name": "Glowrod",
   "cost": 10,
   "avail": "1",
   "note": "Beam of light: 50m"
  },
  {
   "cat": "General",
   "name": "Gravity Belt",
   "cost": 500,
   "avail": "3",
   "note": "Slows down falls"
  },
  {
   "cat": "General",
   "name": "Lazer Welder",
   "cost": 50,
   "avail": "1",
   "note": ""
  },
  {
   "cat": "General",
   "name": "Luma Flares",
   "cost": 100,
   "avail": "2",
   "note": ""
  },
  {
   "cat": "General",
   "name": "Macrobinoclars",
   "cost": 100,
   "avail": "1",
   "note": ""
  },
  {
   "cat": "General",
   "name": "Micro Fusion Reactor",
   "cost": 750,
   "avail": "1",
   "note": ""
  },
  {
   "cat": "General",
   "name": "Oxidizer",
   "cost": 350,
   "avail": "2",
   "note": "Filters 4 hours of breathable atmosphere from any atmosphere on 1 charge"
  },
  {
   "cat": "General",
   "name": "Portable Computer (Power 1D)",
   "cost": 10000,
   "avail": "F",
   "note": "Add the power rating to any \"Computer Programming\" checks"
  },
  {
   "cat": "General",
   "name": "Portable Computer (Power 2D)",
   "cost": 25000,
   "avail": "F",
   "note": "Add the power rating to any \"Computer Programming\" checks"
  },
  {
   "cat": "General",
   "name": "Portable Computer (Power 3D)",
   "cost": 35000,
   "avail": "F",
   "note": "Add the power rating to any \"Computer Programming\" checks"
  },
  {
   "cat": "General",
   "name": "Portable Computer (Power 4D)",
   "cost": 45000,
   "avail": "F",
   "note": "Add the power rating to any \"Computer Programming\" checks"
  },
  {
   "cat": "General",
   "name": "Portable Computer (Power 5D)",
   "cost": 55000,
   "avail": "F",
   "note": "Add the power rating to any \"Computer Programming\" checks"
  },
  {
   "cat": "General",
   "name": "Recording Rod",
   "cost": 100,
   "avail": "1",
   "note": ""
  },
  {
   "cat": "General",
   "name": "Standard Power Pack (Blaster)",
   "cost": 25,
   "avail": "1R",
   "note": ""
  },
  {
   "cat": "General",
   "name": "Syntherope Dispensor",
   "cost": 2,
   "avail": "1",
   "note": "Supports up to 500kg of weight."
  },
  {
   "cat": "General",
   "name": "Vehicle Voice Lock",
   "cost": 650,
   "avail": "3",
   "note": ""
  },
  {
   "cat": "Medical",
   "name": "Customized Medical Backpack",
   "cost": 600,
   "avail": "2",
   "note": "See page 38 Galladinium's Fantastic Technology"
  },
  {
   "cat": "Medical",
   "name": "Med-aid",
   "cost": 250,
   "avail": "1",
   "note": "Adds +1D bonus to any \"First Aid\" check"
  },
  {
   "cat": "Medical",
   "name": "Medkit",
   "cost": 1200,
   "avail": "2",
   "note": "Functions as a medmac that can be used ten times"
  },
  {
   "cat": "Medical",
   "name": "Medpac",
   "cost": 100,
   "avail": "1",
   "note": ""
  },
  {
   "cat": "Medical",
   "name": "Micro-gravity Pressure Patch",
   "cost": 750,
   "avail": "2",
   "note": "Easy First Aid roll is required for proper placement\nallows a wounded patient to act as if unwounded"
  },
  {
   "cat": "Medical",
   "name": "Replar Splint",
   "cost": 200,
   "avail": "2",
   "note": "Easy First Aid roll is required for proper placement"
  },
  {
   "cat": "Medical",
   "name": "Spray Plasto-cast",
   "cost": 35,
   "avail": "1",
   "note": "Easy First Aid roll is required for proper application\nAdds +2 to the users next healing roll"
  },
  {
   "cat": "Restraining Devices",
   "name": "Biodegradable Binders",
   "cost": 75,
   "avail": "2R",
   "note": "Opposed Strength roll to break free (Strength 6D)"
  },
  {
   "cat": "Restraining Devices",
   "name": "Magnacuffs",
   "cost": 75,
   "avail": "2F",
   "note": "Opposed Strength roll to break free (Strength 6D+2)"
  },
  {
   "cat": "Restraining Devices",
   "name": "Magnaharness",
   "cost": 200,
   "avail": "2F",
   "note": "Opposed Strength roll to break free (Strength 8D)"
  },
  {
   "cat": "Restraining Devices",
   "name": "Restraining Bolt",
   "cost": 75,
   "avail": "1",
   "note": ""
  },
  {
   "cat": "Restraining Devices",
   "name": "Slave Collar/Director Unit",
   "cost": 10000,
   "avail": "3X",
   "note": "Each collar deals 2D-5D damage or kill mode (8D)\nOne director unit can control ten slave collars"
  },
  {
   "cat": "Special Tools",
   "name": "Bubble Cloak",
   "cost": 800,
   "avail": "2",
   "note": "Easy Dexterity roll required to inflate and deflate(removal): Has a Strength of 1D+2"
  },
  {
   "cat": "Special Tools",
   "name": "Code Slicer",
   "cost": 2000,
   "avail": "3",
   "note": "Add +1D to all \"Security\" checks if attempting to bypass or break security mesures"
  },
  {
   "cat": "Special Tools",
   "name": "Droid Diagnostic",
   "cost": 200,
   "avail": "1",
   "note": "Very Easy \"Droid Prog.\" roll required for standard system checks\nGain +1D to \"Droid Repair\" checks while using the Diagnostic tool"
  },
  {
   "cat": "Special Tools",
   "name": "Electronic Lock Breaker",
   "cost": 25000,
   "avail": "X",
   "note": "Moderate \"Security\" and Difficult \"Computer Programming\" roll required"
  },
  {
   "cat": "Special Tools",
   "name": "Energy Capacitor",
   "cost": 1500,
   "avail": "2",
   "note": "Easy Technical roll is required for normal operations\nCollects energy from one and transfers it to another"
  },
  {
   "cat": "Special Tools",
   "name": "Force Detector",
   "cost": 0,
   "avail": "4X",
   "note": ""
  },
  {
   "cat": "Special Tools",
   "name": "Infra-goggles",
   "cost": 300,
   "avail": "2",
   "note": "Reduces darkness related attack difficulty by 2D"
  },
  {
   "cat": "Special Tools",
   "name": "Organic Gill",
   "cost": 200,
   "avail": "3",
   "note": "Enables breathing underwater"
  },
  {
   "cat": "Special Tools",
   "name": "Portable Magna Lock",
   "cost": 150,
   "avail": "2",
   "note": "Very Easy \"Security\" roll is required to install and activate the unit\nThe device adds +2D to an objects difficulty to open with Strength or \"Security\""
  },
  {
   "cat": "Special Tools",
   "name": "Sensor Pack",
   "cost": 650,
   "avail": "2R",
   "note": "Scan 300m range, gain +1D to \"Sensor\" checks"
  },
  {
   "cat": "Special Tools",
   "name": "Shipjacking Kit",
   "cost": 16000,
   "avail": "4X",
   "note": "Add +3D to all \"Security\" checks to break through a ships physical security system"
  },
  {
   "cat": "Special Tools",
   "name": "Tech Scanner",
   "cost": 2600,
   "avail": "2",
   "note": "Successful operation of this device adds +1D to users \"repair\" checks"
  },
  {
   "cat": "Special Tools",
   "name": "Weapon Sniffer",
   "cost": 5600,
   "avail": "2R",
   "note": "Add +2D to operator's \"Search: Weapon Detectors\" (must have this skill)\nHas a \"Search\" skill of 5D to find hidden energy weapons"
  },
  {
   "cat": "Surveillance",
   "name": "Electronic Identification",
   "cost": 450,
   "avail": "2F",
   "note": ""
  },
  {
   "cat": "Surveillance",
   "name": "Heat Pod",
   "cost": 70,
   "avail": "3F",
   "note": "Increases the difficulty of a heat sensor by two."
  },
  {
   "cat": "Surveillance",
   "name": "Heat Sensor",
   "cost": 250,
   "avail": "4",
   "note": "100m Range detects heat signatures"
  },
  {
   "cat": "Surveillance",
   "name": "Pocket Scrambler",
   "cost": 800,
   "avail": "4R",
   "note": "With out a similar device and the encription code a Very Difficult to Heroic \"Communications\" check is needed."
  },
  {
   "cat": "Surveillance",
   "name": "Sound Bubble",
   "cost": 300,
   "avail": "3",
   "note": "Easy \"Sensors\" check is required to operate"
  },
  {
   "cat": "Surveillance",
   "name": "Tracking Beacon",
   "cost": 250,
   "avail": "3F",
   "note": ""
  },
  {
   "cat": "Surveillance",
   "name": "Voice Scrambler",
   "cost": 600,
   "avail": "3",
   "note": "Your conversation is impossible to discern more than 3m away"
  },
  {
   "cat": "Transport",
   "name": "Jet Pack (Hush-about)",
   "cost": 1800,
   "avail": "3R",
   "note": "10 Charges (Lift 300kg: vertically 200m, horizontally 500m per charge)"
  },
  {
   "cat": "Transport",
   "name": "Jet Pack (NJP-433)",
   "cost": 400,
   "avail": "2R",
   "note": "5 Charges (Lift 250kg: vertically 50m, horizontally 150m per charge)"
  },
  {
   "cat": "Transport",
   "name": "Jet Pack (Whisper)",
   "cost": 400,
   "avail": "3F",
   "note": "20 Charges (Lift 150kg: vertically 70m, horizontally 100m per charge)"
  },
  {
   "cat": "Transport",
   "name": "Jet Pack (Z-6)",
   "cost": 300,
   "avail": "4R",
   "note": "20 Charges (Lift Pilot+100kg: vertically 70m, horizontally 100m per charge)"
  },
  {
   "cat": "Transport",
   "name": "Rocket Pack (DRPV-78)",
   "cost": 600,
   "avail": "3R",
   "note": "12 Charges (Lift Pilot+30kg: vertically 300m, horizontally 500m per charge)"
  },
  {
   "cat": "Transport",
   "name": "Rocket Pack (DSP-5)",
   "cost": 400,
   "avail": "2R",
   "note": "12 Charges (Lift 60kg: vertically 70m, horizontally 160m per charge)"
  },
  {
   "cat": "Transport",
   "name": "Rocket Pack (PRP-100)",
   "cost": 350,
   "avail": "2R",
   "note": "8 Charges (Lift 65kg: vertically 75m, horizontally 170m per charge)"
  },
  {
   "cat": "Travel Aids",
   "name": "Animal Excluder",
   "cost": 350,
   "avail": "2R",
   "note": "Creatures must make a successful \"Willpower\" or \"Strength\" check to enter field\nThree settings (Low - 2D, Normal - 4D, High - 6D)"
  },
  {
   "cat": "Travel Aids",
   "name": "Dehydrated Food Pack",
   "cost": 2,
   "avail": "1",
   "note": "One meal, one person"
  },
  {
   "cat": "Travel Aids",
   "name": "Distress Beacon",
   "cost": 200,
   "avail": "2",
   "note": ""
  },
  {
   "cat": "Travel Aids",
   "name": "Emergency Inflation Shelter",
   "cost": 500,
   "avail": "2",
   "note": "Very Easy \"Survival\" roll is needed to activate, for 10 continuous hours of use"
  },
  {
   "cat": "Travel Aids",
   "name": "Galactic Currency Converter",
   "cost": 300,
   "avail": "2",
   "note": "Easy \"Business\" roll is required for normal operations"
  },
  {
   "cat": "Travel Aids",
   "name": "Space Suit",
   "cost": 2200,
   "avail": "2F",
   "note": "Will support one user for 10 days in space (food/atmosphere/waste removal)\nThe wearer suffers a penalty of 2D to all Dexterity checks"
  },
  {
   "cat": "Travel Aids",
   "name": "Vacuum Suit",
   "cost": 1000,
   "avail": "1",
   "note": "Contains 10 hours worth of atmosphere"
  },
  {
   "cat": "Travel Aids",
   "name": "Water Purifier",
   "cost": 100,
   "avail": "1",
   "note": "Easy \"Survival\" roll is required for normal operations"
  }
 ],
 "armor": [
  {
   "name": "A3AA Personal Defense Module",
   "cost": 8500,
   "avail": "4X",
   "phys": 6,
   "energy": 3,
   "loc": "Full",
   "dexPen": 3,
   "abilities": [
    "Dispersion Cloud: -2D to all blaster damage"
   ]
  },
  {
   "name": "Arelik Armor",
   "cost": 0,
   "avail": "4X",
   "phys": 6,
   "energy": 3,
   "loc": "Head, Torso, Arms",
   "dexPen": 3,
   "abilities": [
    "Sensor Pod: +1D to \"Search\" checks",
    "Infrared Sensors: +1D to Perception checks.",
    "Enviromental Filter:"
   ]
  },
  {
   "name": "Armored Vacuum Suit",
   "cost": 4000,
   "avail": "2R",
   "phys": 3,
   "energy": 3,
   "loc": "Full",
   "dexPen": 0,
   "abilities": [
    "Vacuum: Holds 10 hours of atmosphere."
   ]
  },
  {
   "name": "Blast Helmet",
   "cost": 300,
   "avail": "1",
   "phys": 3,
   "energy": 1,
   "loc": "Head",
   "dexPen": 0,
   "abilities": []
  },
  {
   "name": "Blast Vest",
   "cost": 300,
   "avail": "1",
   "phys": 3,
   "energy": 1,
   "loc": "Torso",
   "dexPen": 0,
   "abilities": []
  },
  {
   "name": "Bounty Hunter Armor",
   "cost": 2500,
   "avail": "2R",
   "phys": 6,
   "energy": 3,
   "loc": "Full",
   "dexPen": 0,
   "abilities": []
  },
  {
   "name": "Camo Armor",
   "cost": 1500,
   "avail": "2",
   "phys": 3,
   "energy": 2,
   "loc": "Torso, Arms/Legs",
   "dexPen": 0,
   "abilities": [
    "Camo Field: +1D to the difficulty of being spotted."
   ]
  },
  {
   "name": "Castaan Staad Armor",
   "cost": 750,
   "avail": "3",
   "phys": 3,
   "energy": 3,
   "loc": "Torso",
   "dexPen": 0,
   "abilities": []
  },
  {
   "name": "Combat Jumpsuit",
   "cost": 500,
   "avail": "2",
   "phys": 3,
   "energy": 2,
   "loc": "Full",
   "dexPen": 0,
   "abilities": []
  },
  {
   "name": "Concussion Helmet",
   "cost": 375,
   "avail": "1",
   "phys": 2,
   "energy": 0,
   "loc": "Head",
   "dexPen": 0,
   "abilities": []
  },
  {
   "name": "Corellian 611 Combat Armor",
   "cost": 5000,
   "avail": "3F",
   "phys": 6,
   "energy": 3,
   "loc": "Head, Torso.",
   "dexPen": 0,
   "abilities": []
  },
  {
   "name": "Corellian Huntsuit",
   "cost": 2900,
   "avail": "3R",
   "phys": 6,
   "energy": 3,
   "loc": "Full",
   "dexPen": 3,
   "abilities": [
    "Sensor Pod: +1D to \"Search\" checks",
    "Power Suit: +1D to \"Lifting\" checks."
   ]
  },
  {
   "name": "Coynite Battle Armor",
   "cost": 150,
   "avail": "3",
   "phys": 6,
   "energy": 6,
   "loc": "Full",
   "dexPen": 3,
   "abilities": []
  },
  {
   "name": "CV14-B Concussion Vest",
   "cost": 500,
   "avail": "1",
   "phys": 3,
   "energy": 0,
   "loc": "Torso",
   "dexPen": 0,
   "abilities": []
  },
  {
   "name": "Dragon Armor",
   "cost": 0,
   "avail": "4X",
   "phys": 9,
   "energy": 6,
   "loc": "Full",
   "dexPen": 6,
   "abilities": [
    "Heavy: \"Hide\", \"Sneak\", and \"Swimming\" cannot be used.",
    "Strength: +1D Strength bonus on \"Lifting\" and melee / brawling damage.",
    "Sensors: +2D to Perception and \"Search\" checks.",
    "(MFTAS) +1D to all ranged attacks against targets at Med. or Long ranage.",
    "Body Glove:",
    "Sealed Enviro-Filter:",
    "Weapons:",
    "Comlink:"
   ]
  },
  {
   "name": "Dura-Armor",
   "cost": 8000,
   "avail": "3",
   "phys": 6,
   "energy": 6,
   "loc": "Full",
   "dexPen": 6,
   "abilities": []
  },
  {
   "name": "Espo Helmet",
   "cost": 200,
   "avail": "0R",
   "phys": 3,
   "energy": 1,
   "loc": "Head",
   "dexPen": 0,
   "abilities": []
  },
  {
   "name": "Espo Riot Armor Body",
   "cost": 0,
   "avail": "X",
   "phys": 5,
   "energy": 2,
   "loc": "Body",
   "dexPen": 2,
   "abilities": []
  },
  {
   "name": "Espo Riot Armor Helmet",
   "cost": 0,
   "avail": "X",
   "phys": 6,
   "energy": 3,
   "loc": "Head",
   "dexPen": 0,
   "abilities": []
  },
  {
   "name": "Espo Vest",
   "cost": 200,
   "avail": "0R",
   "phys": 3,
   "energy": 1,
   "loc": "Torso",
   "dexPen": 1,
   "abilities": []
  },
  {
   "name": "Flex-Armor",
   "cost": 2000,
   "avail": "3",
   "phys": 3,
   "energy": 3,
   "loc": "Full",
   "dexPen": 3,
   "abilities": []
  },
  {
   "name": "Flex-Armor (Modified)",
   "cost": 2000,
   "avail": "3",
   "phys": 6,
   "energy": 0,
   "loc": "Full",
   "dexPen": 3,
   "abilities": []
  },
  {
   "name": "Gladiator Armor",
   "cost": 0,
   "avail": "4X",
   "phys": 6,
   "energy": 3,
   "loc": "Head, Torso, Arms",
   "dexPen": 0,
   "abilities": [
    "Jet Pack: 10 charges",
    "Weapons:"
   ]
  },
  {
   "name": "Heavy Radiation Powersuit:",
   "cost": 3000,
   "avail": "2",
   "phys": 6,
   "energy": 6,
   "loc": "Full",
   "dexPen": 3,
   "abilities": [
    "Booster Jets: Move(Space) 1 (1D Maneuverabilty)",
    "Sensors: +1D to \"Sensors\" checks",
    "Comlink:",
    "Magnetic Traction Boots"
   ]
  },
  {
   "name": "Imperial Protective Armor",
   "cost": 0,
   "avail": "3X",
   "phys": 2,
   "energy": 2,
   "loc": "Full",
   "dexPen": 0,
   "abilities": [
    "Comlink:",
    "Body Suit:"
   ]
  },
  {
   "name": "Imperial Shocksuit",
   "cost": 0,
   "avail": "3X",
   "phys": 3,
   "energy": 1,
   "loc": "Full",
   "dexPen": 0,
   "abilities": [
    "Comlink:",
    "Body Suit:"
   ]
  },
  {
   "name": "Light Scout Armor",
   "cost": 700,
   "avail": "2",
   "phys": 1,
   "energy": 1,
   "loc": "Full",
   "dexPen": 0,
   "abilities": [
    "Adds +1D to \"Sneak\" in natural Terrain."
   ]
  },
  {
   "name": "Link Armor",
   "cost": 500,
   "avail": "1",
   "phys": 3,
   "energy": 2,
   "loc": "Full",
   "dexPen": 3,
   "abilities": []
  },
  {
   "name": "Link Armor (Modified)",
   "cost": 1050,
   "avail": "1",
   "phys": 5,
   "energy": 3,
   "loc": "Full",
   "dexPen": 6,
   "abilities": []
  },
  {
   "name": "Malgon Armor",
   "cost": 0,
   "avail": "4X",
   "phys": 6,
   "energy": 6,
   "loc": "Full",
   "dexPen": 6,
   "abilities": [
    "Heavy: \"Hide\", \"Sneak\", and \"Swimming\" cannot be used.",
    "Strength: +1D Strength bonus on \"Lifting\" and melee / brawling damage.",
    "Sensors: +1D to Perception and \"Search\" checks.",
    "Weapons:"
   ]
  },
  {
   "name": "Mandalorian Battle Armor",
   "cost": 0,
   "avail": "4X",
   "phys": 9,
   "energy": 6,
   "loc": "Full",
   "dexPen": 0,
   "abilities": [
    "Infrared/Motion Sensor: +1D to Perception in dark or moving targets",
    "Weapons:"
   ]
  },
  {
   "name": "Nova-Tech Powersuit",
   "cost": 1000,
   "avail": "2",
   "phys": 9,
   "energy": 6,
   "loc": "Full",
   "dexPen": 0,
   "abilities": [
    "Booster Jets: Move(Space) 1 (1D Maneuverabilty)",
    "Weapons:"
   ]
  },
  {
   "name": "Protective Vest",
   "cost": 250,
   "avail": "1",
   "phys": 5,
   "energy": 2,
   "loc": "Torso",
   "dexPen": 0,
   "abilities": []
  },
  {
   "name": "Seatrooper Armor",
   "cost": 0,
   "avail": "3X",
   "phys": 3,
   "energy": 3,
   "loc": "Full",
   "dexPen": 0,
   "abilities": [
    "Fins: +2D to \"Swimming\" checks.",
    "Comlink:",
    "Body Glove:"
   ]
  },
  {
   "name": "Shadow Suit",
   "cost": 0,
   "avail": "3",
   "phys": 0,
   "energy": 0,
   "loc": "Full",
   "dexPen": 0,
   "abilities": [
    "Camo-Dye/Sensor Scramler: +2D to \"Sneak\" checks."
   ]
  },
  {
   "name": "Smasher Armor",
   "cost": 1250,
   "avail": "3",
   "phys": 3,
   "energy": 3,
   "loc": "Body",
   "dexPen": 0,
   "abilities": [
    "Servos: +2D to \"Brawling\", \"Climbing/Jumping\", \"Lifting\", and damage in strength-related attacks"
   ]
  },
  {
   "name": "Snowtrooper Armor",
   "cost": 0,
   "avail": "3X",
   "phys": 3,
   "energy": 3,
   "loc": "Full",
   "dexPen": 3,
   "abilities": [
    "Comlink:",
    "Body Suit:",
    "Terrain Grip Boots: +1D to \"Climb\" checks"
   ]
  },
  {
   "name": "Stormtrooper Armor",
   "cost": 0,
   "avail": "3X",
   "phys": 6,
   "energy": 3,
   "loc": "Full",
   "dexPen": 3,
   "abilities": [
    "(MFTAS) +2D to Perception checks in Low Visability",
    "(MFTAS) +2 to Ranged weapons skill checks against targets that move more then 10m.",
    "Comlink:",
    "Body Glove:"
   ]
  },
  {
   "name": "Stormtrooper Scout Armor",
   "cost": 0,
   "avail": "3X",
   "phys": 2,
   "energy": 2,
   "loc": "Full",
   "dexPen": 0,
   "abilities": [
    "Comlink:",
    "Body Suit:"
   ]
  },
  {
   "name": "Ubese Raider Armor",
   "cost": 1000,
   "avail": "3",
   "phys": 6,
   "energy": 3,
   "loc": "Head, Torso",
   "dexPen": 0,
   "abilities": [
    "Sealed Envio-Filter:",
    "Flash Guard Visor:"
   ]
  }
 ],
 "melee": [
  {
   "name": "Cryogen Whip",
   "cost": 350,
   "avail": "3X",
   "dmg": 3,
   "maxDmg": 0,
   "diff": "Moderate",
   "ability": "Additional 4D stun damage due from extreme cold, Victim must make a Moderate \"Stamina\" roll after second strike to avoid a -1D to Dexterity checks.",
   "color": ""
  },
  {
   "name": "Double Bladed Vibroblade",
   "cost": 6000,
   "avail": "4X",
   "dmg": 13,
   "maxDmg": 24,
   "diff": "Difficult",
   "ability": "",
   "color": ""
  },
  {
   "name": "Gaderffii Stick",
   "cost": 0,
   "avail": "2F",
   "dmg": 3,
   "maxDmg": 0,
   "diff": "Easy",
   "ability": "",
   "color": ""
  },
  {
   "name": "Knife",
   "cost": 25,
   "avail": "1",
   "dmg": 3,
   "maxDmg": 18,
   "diff": "Very Easy",
   "ability": "",
   "color": ""
  },
  {
   "name": "Lightsaber",
   "cost": 0,
   "avail": "4X",
   "dmg": 15,
   "maxDmg": 0,
   "diff": "Difficult",
   "ability": "",
   "color": "Blue"
  },
  {
   "name": "Molecular Stiletto",
   "cost": 400,
   "avail": "4X",
   "dmg": 6,
   "maxDmg": 0,
   "diff": "Moderate",
   "ability": "",
   "color": ""
  },
  {
   "name": "Power Cane",
   "cost": 400,
   "avail": "3X",
   "dmg": 3,
   "maxDmg": 0,
   "diff": "Easy",
   "ability": "Moderate Difficulty: (Power Point) Variable Damage 1D to 5D",
   "color": ""
  },
  {
   "name": "Stun Baton",
   "cost": 300,
   "avail": "R",
   "dmg": 8,
   "maxDmg": 0,
   "diff": "Easy",
   "ability": "",
   "color": ""
  },
  {
   "name": "Stun Gauntlets",
   "cost": 300,
   "avail": "2",
   "dmg": 6,
   "maxDmg": 0,
   "diff": "East",
   "ability": "Charges:10",
   "color": ""
  },
  {
   "name": "Togorian Scimitar",
   "cost": 8500,
   "avail": "4X",
   "dmg": 6,
   "maxDmg": 0,
   "diff": "Moderate",
   "ability": "Additional 4D stun damage from electric shock",
   "color": ""
  },
  {
   "name": "Vibro-Ax",
   "cost": 500,
   "avail": "2R",
   "dmg": 10,
   "maxDmg": 21,
   "diff": "Moderate",
   "ability": "",
   "color": ""
  },
  {
   "name": "Vibroblade",
   "cost": 250,
   "avail": "2F",
   "dmg": 9,
   "maxDmg": 20,
   "diff": "Moderate",
   "ability": "",
   "color": ""
  },
  {
   "name": "Vibrodagger",
   "cost": 50,
   "avail": "2R",
   "dmg": 6,
   "maxDmg": 18,
   "diff": "Easy",
   "ability": "",
   "color": ""
  },
  {
   "name": "Vibro-saw",
   "cost": 400,
   "avail": "1R",
   "dmg": 7,
   "maxDmg": 0,
   "diff": "Easy",
   "ability": "",
   "color": ""
  }
 ],
 "ranged": [
  {
   "name": "\"Firelance\" Blaster Rifle",
   "cost": 1200,
   "avail": "2X",
   "dmg": 15,
   "close": "3",
   "short": "30",
   "medium": "100",
   "long": "300",
   "rof": "1",
   "ammo": "100",
   "ability": "",
   "skill": "Blaster"
  },
  {
   "name": "36T blaster Carbine",
   "cost": 900,
   "avail": "2X",
   "dmg": 15,
   "close": "2",
   "short": "25",
   "medium": "50",
   "long": "200",
   "rof": "-",
   "ammo": "100",
   "ability": "",
   "skill": "Blaster"
  },
  {
   "name": "Adjudicator",
   "cost": 300,
   "avail": "2R",
   "dmg": 10,
   "close": "0",
   "short": "5",
   "medium": "10",
   "long": "25",
   "rof": "2",
   "ammo": "4",
   "ability": "",
   "skill": "Firearms"
  },
  {
   "name": "AXM-50 Energy Rifle",
   "cost": 4500,
   "avail": "3R",
   "dmg": 15,
   "close": "2",
   "short": "25",
   "medium": "50",
   "long": "75",
   "rof": "7",
   "ammo": "250",
   "ability": "Grenade Launcher:",
   "skill": "Blaster"
  },
  {
   "name": "AXM-50 Grenade Launcher",
   "cost": 0,
   "avail": "-",
   "dmg": 0,
   "close": "4",
   "short": "25",
   "medium": "100",
   "long": "200",
   "rof": "1",
   "ammo": "30",
   "ability": "Blast (0-2m/4m/6m) Damage (4D/3D/2D)",
   "skill": "Missile Weapons"
  },
  {
   "name": "BMC-150 Blaster",
   "cost": 1000,
   "avail": "4X",
   "dmg": 18,
   "close": "24",
   "short": "100",
   "medium": "200",
   "long": "300",
   "rof": "1",
   "ammo": "50",
   "ability": "A bi-pod adds +1D to \"Blaster\" checks",
   "skill": "Blaster"
  },
  {
   "name": "BR1-Z Blast Rifle",
   "cost": 1500,
   "avail": "4X",
   "dmg": 15,
   "close": "2",
   "short": "15",
   "medium": "30",
   "long": "150",
   "rof": "1",
   "ammo": "50",
   "ability": "Add 5 to the difficulty of long range",
   "skill": "Blaster"
  },
  {
   "name": "Combat Pistol (Slugthrower)",
   "cost": 300,
   "avail": "2F",
   "dmg": 9,
   "close": "2",
   "short": "10",
   "medium": "30",
   "long": "60",
   "rof": "-",
   "ammo": "16",
   "ability": "Reduce dmg 1D against target with body armor.",
   "skill": "Firearms"
  },
  {
   "name": "Disruptor Pistol",
   "cost": 3000,
   "avail": "4X",
   "dmg": 20,
   "close": "0",
   "short": "3",
   "medium": "5",
   "long": "7",
   "rof": "1",
   "ammo": "5",
   "ability": "",
   "skill": "Blaster"
  },
  {
   "name": "DL-18 Blaster Pistol",
   "cost": 500,
   "avail": "1X",
   "dmg": 12,
   "close": "2",
   "short": "10",
   "medium": "30",
   "long": "120",
   "rof": "-",
   "ammo": "100",
   "ability": "",
   "skill": "Blaster"
  },
  {
   "name": "DL-22 Blaster Pistol",
   "cost": 500,
   "avail": "1X",
   "dmg": 13,
   "close": "2",
   "short": "10",
   "medium": "30",
   "long": "120",
   "rof": "1",
   "ammo": "100",
   "ability": "",
   "skill": "Blaster"
  },
  {
   "name": "DL-44 Heavy Blaster Pistol",
   "cost": 750,
   "avail": "2X",
   "dmg": 15,
   "close": "2",
   "short": "7",
   "medium": "25",
   "long": "50",
   "rof": "-",
   "ammo": "25",
   "ability": "",
   "skill": "Blaster"
  },
  {
   "name": "DL-6H Heavy Blaster Pistol",
   "cost": 800,
   "avail": "1X",
   "dmg": 15,
   "close": "2",
   "short": "10",
   "medium": "30",
   "long": "120",
   "rof": "-",
   "ammo": "25",
   "ability": "",
   "skill": "Blaster"
  },
  {
   "name": "Duo-Flechette Rifle",
   "cost": 1000,
   "avail": "3X",
   "dmg": 15,
   "close": "2",
   "short": "10",
   "medium": "30",
   "long": "60",
   "rof": "-",
   "ammo": "5",
   "ability": "",
   "skill": "Missile Weapons"
  },
  {
   "name": "E-11 Blaster Rifle",
   "cost": 7000,
   "avail": "4X",
   "dmg": 15,
   "close": "2",
   "short": "30",
   "medium": "100",
   "long": "300",
   "rof": "-",
   "ammo": "25",
   "ability": "",
   "skill": "Blaster"
  },
  {
   "name": "E-Web Heavy Repeating Blaster",
   "cost": 5000,
   "avail": "2X",
   "dmg": 24,
   "close": "2",
   "short": "75",
   "medium": "200",
   "long": "500",
   "rof": "-",
   "ammo": "*",
   "ability": "Tripod req.",
   "skill": "Blaster"
  },
  {
   "name": "EXP-7(a) Blaster Rifle",
   "cost": 7000,
   "avail": "4X",
   "dmg": 21,
   "close": "2",
   "short": "30",
   "medium": "80",
   "long": "350",
   "rof": "1",
   "ammo": "8",
   "ability": "Fire Control: 2D",
   "skill": "Blaster"
  },
  {
   "name": "Flechette Smart Pistol",
   "cost": 500,
   "avail": "3R",
   "dmg": 0,
   "close": "9",
   "short": "20",
   "medium": "50",
   "long": "100",
   "rof": "2",
   "ammo": "8",
   "ability": "Dmg. Based on range (3D/5D/4D/3D)",
   "skill": "Missile Weapons"
  },
  {
   "name": "HB-4 Projectile Rifle",
   "cost": 1500,
   "avail": "4R",
   "dmg": 15,
   "close": "49",
   "short": "1000",
   "medium": "4000",
   "long": "8000",
   "rof": "1",
   "ammo": "6",
   "ability": "Fire Control: 1D+1 (med./long range only)",
   "skill": "Missile Weapons"
  },
  {
   "name": "Heavy Blaster Rifle",
   "cost": 1250,
   "avail": "4X",
   "dmg": 17,
   "close": "2",
   "short": "25",
   "medium": "50",
   "long": "250",
   "rof": "1",
   "ammo": "50",
   "ability": "",
   "skill": "Blaster"
  },
  {
   "name": "J8Q-128 Finbat",
   "cost": 4000,
   "avail": "X",
   "dmg": 36,
   "close": "0",
   "short": "50",
   "medium": "250",
   "long": "500",
   "rof": "1",
   "ammo": "1",
   "ability": "",
   "skill": "Missile Weapons"
  },
  {
   "name": "KK-5 Blaster Pistol",
   "cost": 750,
   "avail": "X",
   "dmg": 12,
   "close": "2",
   "short": "10",
   "medium": "30",
   "long": "120",
   "rof": "1",
   "ammo": "100",
   "ability": "",
   "skill": "Blaster"
  },
  {
   "name": "Pulse-wave Blaster",
   "cost": 600,
   "avail": "4X",
   "dmg": 12,
   "close": "2",
   "short": "8",
   "medium": "20",
   "long": "100",
   "rof": "1",
   "ammo": "50",
   "ability": "",
   "skill": "Blaster"
  },
  {
   "name": "Pulse-wave Rifle",
   "cost": 2000,
   "avail": "4X",
   "dmg": 15,
   "close": "2",
   "short": "20",
   "medium": "75",
   "long": "150",
   "rof": "1",
   "ammo": "50",
   "ability": "",
   "skill": "Blaster"
  },
  {
   "name": "Q2 Hold-out Blaster",
   "cost": 275,
   "avail": "2R",
   "dmg": 9,
   "close": "2",
   "short": "4",
   "medium": "8",
   "long": "12",
   "rof": "-",
   "ammo": "6",
   "ability": "",
   "skill": "Blaster"
  },
  {
   "name": "Quick-draw Pulse-wave",
   "cost": 300,
   "avail": "4X",
   "dmg": 9,
   "close": "1",
   "short": "3",
   "medium": "6",
   "long": "10",
   "rof": "1",
   "ammo": "3",
   "ability": "Draw and fire in one round (no penalty)",
   "skill": "Blaster"
  },
  {
   "name": "SIL-50 Defense Pistol",
   "cost": 2000,
   "avail": "4F",
   "dmg": 15,
   "close": "0",
   "short": "3",
   "medium": "5",
   "long": "10",
   "rof": "1/2 rounds",
   "ammo": "15",
   "ability": "Stun dmg, against \"Stamina\"",
   "skill": "Firearms"
  },
  {
   "name": "Sporting Blaster",
   "cost": 350,
   "avail": "1F",
   "dmg": 10,
   "close": "2",
   "short": "10",
   "medium": "30",
   "long": "60",
   "rof": "-",
   "ammo": "50",
   "ability": "",
   "skill": "Blaster"
  },
  {
   "name": "Stormtrooper One Blaster Rifle",
   "cost": 1000,
   "avail": "2X",
   "dmg": 15,
   "close": "2",
   "short": "30",
   "medium": "100",
   "long": "300",
   "rof": "-",
   "ammo": "100",
   "ability": "",
   "skill": "Blaster"
  },
  {
   "name": "T-12 Light Repeating Blaster",
   "cost": 2000,
   "avail": "2X",
   "dmg": 18,
   "close": "2",
   "short": "50",
   "medium": "120",
   "long": "300",
   "rof": "-",
   "ammo": "25",
   "ability": "",
   "skill": "Blaster"
  },
  {
   "name": "T-6 \"Thunderer\" Pistol",
   "cost": 750,
   "avail": "2X",
   "dmg": 20,
   "close": "2",
   "short": "7",
   "medium": "25",
   "long": "50",
   "rof": "1",
   "ammo": "25",
   "ability": "",
   "skill": "Blaster"
  },
  {
   "name": "Wookiee Bowcaster",
   "cost": 0,
   "avail": "3R",
   "dmg": 12,
   "close": "2",
   "short": "10",
   "medium": "30",
   "long": "50",
   "rof": "1",
   "ammo": "6",
   "ability": "Easy Strength check to fire more then once a round",
   "skill": "Bowcaster"
  },
  {
   "name": "Yctor Black Powder Pistol",
   "cost": 200,
   "avail": "4",
   "dmg": 9,
   "close": "2",
   "short": "3",
   "medium": "10",
   "long": "25",
   "rof": "1",
   "ammo": "1",
   "ability": "",
   "skill": "Archaic Guns"
  }
 ],
 "explosives": [
  {
   "name": "Anti-Vehicle Grenade",
   "cost": 750,
   "avail": "X",
   "dmg": [
    "21",
    "-",
    "-",
    "-"
   ],
   "ranges": [
    "2",
    "7",
    "20",
    "40"
   ],
   "radius": [
    "-",
    "-",
    "-",
    "-"
   ],
   "ability": "Character or Speeder scale"
  },
  {
   "name": "B Stun Grenade",
   "cost": 300,
   "avail": "2X",
   "dmg": [
    "12",
    "9",
    "6",
    "-"
   ],
   "ranges": [
    "0",
    "2",
    "16",
    "25"
   ],
   "radius": [
    "2",
    "20",
    "40",
    "-"
   ],
   "ability": "Stun"
  },
  {
   "name": "Detonite Tape",
   "cost": 1500,
   "avail": "X",
   "dmg": [
    "15",
    "-",
    "-",
    "-"
   ],
   "ranges": [
    "-",
    "-",
    "-",
    "-"
   ],
   "radius": [
    "1",
    "-",
    "-",
    "-"
   ],
   "ability": "(per 5m of tape)"
  },
  {
   "name": "Frag Grenade",
   "cost": 200,
   "avail": "1R",
   "dmg": [
    "15",
    "12",
    "9",
    "6"
   ],
   "ranges": [
    "2",
    "7",
    "20",
    "40"
   ],
   "radius": [
    "2",
    "4",
    "6",
    "10"
   ],
   "ability": ""
  },
  {
   "name": "Glop Grenade",
   "cost": 275,
   "avail": "2X",
   "dmg": [
    "18",
    "15",
    "9",
    "-"
   ],
   "ranges": [
    "2",
    "7",
    "30",
    "60"
   ],
   "radius": [
    "1",
    "3",
    "5",
    "-"
   ],
   "ability": "Opposed \"Strength\" check"
  },
  {
   "name": "Mine",
   "cost": 750,
   "avail": "2X",
   "dmg": [
    "15",
    "12",
    "9",
    "6"
   ],
   "ranges": [
    "-",
    "-",
    "-",
    "-"
   ],
   "radius": [
    "2",
    "4",
    "6",
    "10"
   ],
   "ability": ""
  },
  {
   "name": "Thermal Detonator",
   "cost": 2000,
   "avail": "2X",
   "dmg": [
    "30",
    "24",
    "15",
    "6"
   ],
   "ranges": [
    "2",
    "4",
    "7",
    "12"
   ],
   "radius": [
    "2",
    "8",
    "12",
    "20"
   ],
   "ability": ""
  }
 ],
 "saber": {
  "primary": [
   {
    "name": "Danite",
    "color": "Minor",
    "dmg": 14,
    "ability": ""
   },
   {
    "name": "Kathracite",
    "color": "Minor",
    "dmg": 11,
    "ability": ""
   },
   {
    "name": "Mephite",
    "color": "Any",
    "dmg": 15,
    "ability": ""
   },
   {
    "name": "Pontite",
    "color": "Any",
    "dmg": 17,
    "ability": ""
   },
   {
    "name": "Repacite",
    "color": "Minor",
    "dmg": 12,
    "ability": ""
   },
   {
    "name": "Sith Crystal",
    "color": "Red",
    "dmg": 15,
    "ability": ""
   },
   {
    "name": "Synth-Crystals: Danite",
    "color": "Minor",
    "dmg": 11,
    "ability": ""
   },
   {
    "name": "Synth-Crystals: Kathracite",
    "color": "Minor",
    "dmg": 8,
    "ability": ""
   },
   {
    "name": "Synth-Crystals: Mephite",
    "color": "Minor",
    "dmg": 12,
    "ability": ""
   },
   {
    "name": "Synth-Crystals: Ponite",
    "color": "Minor",
    "dmg": 14,
    "ability": ""
   },
   {
    "name": "Synth-Crystals: Repacite",
    "color": "Any",
    "dmg": 9,
    "ability": ""
   },
   {
    "name": "Visindar Black Pearl",
    "color": "Violet",
    "dmg": 18,
    "ability": "Reroll a result of \"1\" on the wild die, once per Adventure"
   },
   {
    "name": "Zaka Hollow Diamond",
    "color": "White",
    "dmg": 18,
    "ability": "Allows 1 secondary crystal to be placed within this one adding to the effects of the lightsaber (effectively giving the lightsaber 2 secondary crystals)"
   },
   {
    "name": "Zaka Hollow Emerald",
    "color": "Green",
    "dmg": 17,
    "ability": "Allows 1 secondary crystal to be placed within this one adding to the effects of the lightsaber (effectively giving the lightsaber 2 secondary crystals)"
   },
   {
    "name": "Zaka Hollow Sapphire",
    "color": "Blue",
    "dmg": 16,
    "ability": "Allows 1 secondary crystal to be placed within this one adding to the effects of the lightsaber (effectively giving the lightsaber 2 secondary crystals)"
   }
  ],
  "secondary": [
   {
    "name": "Angel's Tears",
    "color": "Light Blue",
    "mod": -1,
    "ability": "Add +1pip to all Alter skill rolls"
   },
   {
    "name": "Bondar Emerald",
    "color": "Dark Green",
    "mod": 1,
    "ability": "Stun damage only!"
   },
   {
    "name": "Cammasian Diamond",
    "color": "White",
    "mod": 0,
    "ability": "Add +1pip to all force skill rolls (Lightside only)"
   },
   {
    "name": "Carbonized Tibanna Gas Crystal",
    "color": "Dark Blue",
    "mod": -1,
    "ability": "Add +2pips to Lightsaber skill rolls used to attack"
   },
   {
    "name": "Damind Quartz",
    "color": "White",
    "mod": 1,
    "ability": "(Lightside only)"
   },
   {
    "name": "Demon's Laughter",
    "color": "Dark Red",
    "mod": -3,
    "ability": "Reroll wild die results of a 5 or 6 (instead of just 6)"
   },
   {
    "name": "Endorian Amber",
    "color": "Gold",
    "mod": -1,
    "ability": "Add +2pips to parry blaster fire with lightsaber skill rolls"
   },
   {
    "name": "Eralam Crystal",
    "color": "Light Green",
    "mod": 0,
    "ability": "Add +1pip to all lightsaber skill rolls"
   },
   {
    "name": "Firkrann Peridot",
    "color": "Blue",
    "mod": 3,
    "ability": "Stun damage only!"
   },
   {
    "name": "Jenruax Fire Opal",
    "color": "Light Red",
    "mod": 0,
    "ability": "Add +1pip to parry blaster fire with lightsaber skill rolls"
   },
   {
    "name": "Krayt Dragon Pearl",
    "color": "Shimmering",
    "mod": 1,
    "ability": "Add +2pips to all lightsaber skill rolls"
   },
   {
    "name": "Living Crystal",
    "color": "Violet",
    "mod": -1,
    "ability": "Add +1 pip to all Sense skill rolls"
   },
   {
    "name": "Luxum Emerald",
    "color": "Light Green",
    "mod": 2,
    "ability": "Stun damage only! +1pip to lightsaber skill rolls used to attack"
   },
   {
    "name": "Massassi Smoky Ruby",
    "color": "Black",
    "mod": 1,
    "ability": "Add +1pip to all force skill rolls (Darkside only)"
   },
   {
    "name": "Nextor Crystal",
    "color": "Teal",
    "mod": -3,
    "ability": "All difficulties to use a lightsaber are \"moderate\" (instead of \"difficult\")"
   },
   {
    "name": "Nubian Sea Quartz",
    "color": "Grey",
    "mod": 0,
    "ability": "Add +2pips to damage against objects"
   },
   {
    "name": "Opila Crystal",
    "color": "Green",
    "mod": 0,
    "ability": "Reroll a result of \"1\" on the wild die, once per Adventure (lightside only)"
   },
   {
    "name": "Phond Aquamarine",
    "color": "Royal Blue",
    "mod": -3,
    "ability": "Add +2D to damage against objects"
   },
   {
    "name": "Rasp Garnet",
    "color": "Light Red",
    "mod": -3,
    "ability": "Ignore -1D penalty on all \"kept up\" force powers (Control/Sense kept up  power is only -1D not -2D)"
   },
   {
    "name": "Roon Crystal",
    "color": "Red",
    "mod": 1,
    "ability": "(Darkside only)"
   },
   {
    "name": "Rubat Topez",
    "color": "Yellow",
    "mod": 0,
    "ability": "Gain +1 character point per adventure, only usable on force skill rolls (doesn't convert into exp.)"
   },
   {
    "name": "Sapith Crystal",
    "color": "Violet",
    "mod": 0,
    "ability": "Add +1pip to lightsaber skill rolls used to attack"
   },
   {
    "name": "Sigil Ruby",
    "color": "Crimson",
    "mod": 2,
    "ability": ""
   },
   {
    "name": "Sodinth Agate",
    "color": "Light Blue",
    "mod": 0,
    "ability": "Gain +1D to all force skill rolls used to heal or protect (self or another creature)"
   },
   {
    "name": "Solari Crystal",
    "color": "Yellow",
    "mod": 1,
    "ability": "Add +1pip to lightsaber skill rolls used to attack / +1D to damage (against darkside creatures only)"
   },
   {
    "name": "Upari Diamond",
    "color": "Shimmering",
    "mod": 1,
    "ability": "Add +1pip to lightsaber skill rolls used to attack / +1D to parry blaster fire with lightsaber skill rolls"
   },
   {
    "name": "Zaka Fire Pearl",
    "color": "Shimmering",
    "mod": 3,
    "ability": "On a result of \"1\" on the wild die while wielding the lightsaber the crystal becomes unstable and explodes. The blast radius is 1-2/6/10 and deals 10D/8D/6D damage to all within the radius."
   },
   {
    "name": "Zeltronian Sapphire",
    "color": "Pink",
    "mod": -1,
    "ability": "Add +1pip to all Control skill rolls"
   }
  ],
  "mods": [
   {
    "name": "Call Becon",
    "cost": 1000,
    "ability": "Summons a ship with a slave circuit as a standard call beacon (imbedded in the handle)"
   },
   {
    "name": "Comlink",
    "cost": 50,
    "ability": ""
   },
   {
    "name": "Conealed Compartment",
    "cost": 0,
    "ability": "Must be installed at Lightsaber creation, and the new diff. is a Heroic Lightsaber Repair roll"
   },
   {
    "name": "Force Detector",
    "cost": 0,
    "ability": ""
   },
   {
    "name": "Form-Fitted Hand Grip",
    "cost": 1250,
    "ability": "+1 pip to all Lightsaber skill rolls, -1D to anyone but user to all Lightsaber skill rolls."
   },
   {
    "name": "Glowrod",
    "cost": 50,
    "ability": ""
   },
   {
    "name": "Hidden Knife",
    "cost": 50,
    "ability": ""
   },
   {
    "name": "Internal Force Activation",
    "cost": 100,
    "ability": "Must be \"Force Sensitive\" and have a min. of 1D in \"Control\" and \"Alter\" to use."
   },
   {
    "name": "Magna-Lock Butt",
    "cost": 500,
    "ability": "Able to connect 2 lightsabers together to form \"Double Lightsaber\". Both Lightsabers must have this feature."
   },
   {
    "name": "Medscanner",
    "cost": 3000,
    "ability": ""
   },
   {
    "name": "Recording Rod",
    "cost": 100,
    "ability": ""
   },
   {
    "name": "Stun Baton Feature",
    "cost": 500,
    "ability": ""
   },
   {
    "name": "Syntherope Dispenser",
    "cost": 100,
    "ability": ""
   },
   {
    "name": "Translator Unit",
    "cost": 1100,
    "ability": "installs a Droid Vocabulator within the handle (requires a Difficult Droid Repair roll)"
   },
   {
    "name": "Water-Proof Casing",
    "cost": 200,
    "ability": "Able to bring Lightsaber underwater, without removing the power cell."
   },
   {
    "name": "Weapon Sniffer",
    "cost": 6000,
    "ability": ""
   }
  ],
  "colors": [
   "Blue",
   "Green",
   "Orange",
   "Red",
   "Violet",
   "White",
   "Yellow"
  ]
 },
 "planets": [
  "Af'El",
  "Alderaan",
  "Alzoc III",
  "Ando",
  "Anoat",
  "Antar IV",
  "Barab I",
  "Baralou",
  "Bespin",
  "Bilbringi",
  "Bothawui",
  "Byss",
  "C'had",
  "Cadomai",
  "Calamari",
  "Carida",
  "Celanon",
  "Cerea",
  "Chandrila",
  "Clak'dorVII",
  "Cona",
  "Corellia",
  "Coruscant",
  "Csilla",
  "Dagobah",
  "Dantooine",
  "Devaron",
  "Drall",
  "Duro",
  "Duros",
  "Elom",
  "ElroodSector",
  "Endex",
  "Endor",
  "Etti",
  "Falleen",
  "Gamorr",
  "Gand",
  "Garnib",
  "Gentes",
  "Giju",
  "Glee Anselm",
  "Gree",
  "Hapes",
  "Honoghr",
  "Hoth",
  "Iridonia",
  "Ithor",
  "Jatee",
  "Kashyyyk",
  "Kessel",
  "Kinyen",
  "Kuat",
  "Kubindi",
  "Lianna",
  "Lorrd",
  "Malastare",
  "Manpha",
  "Merisee",
  "Mon Calamari",
  "Monor II",
  "Naboo",
  "NalHutta",
  "Needan",
  "OrdMantell",
  "Orto",
  "Pa'lowick",
  "Panatha",
  "Pho Ph'eah",
  "Roche",
  "Rodia",
  "Ropagi II",
  "Ryloth",
  "Sarka",
  "Sullust",
  "Tasariq",
  "Tatooine",
  "Thyferra",
  "Tibrin",
  "Toola",
  "Toydaria",
  "Trian",
  "Trunska",
  "Uba IV",
  "Unknown",
  "Uvena",
  "Varl (Nal Hutta)",
  "Vellity",
  "Wroona",
  "Xa Fel",
  "Yavin4",
  "Zelos II"
 ],
 "genders": [
  "Asexual",
  "Female",
  "Genderless",
  "Hermaphradite",
  "Male"
 ]
};

/* =====================================================================
   Advanced skills (marked "(A)" in the books)
   ---------------------------------------------------------------------
   They start at 1D rather than at the attribute value, cost double the
   character points, and cannot be learned until their prerequisite is met
   (R&E p. 65, REUP pp. 61 f.).

   The list lives here rather than in the character generator, because
   droids need it just as much: a 2-1B carries "(A) Bacta tank operation
   5D", "(A) Injury/ailment diagnosis 6D" and "(A) Medicine 9D" - without
   these entries half a medical droid's equipment was dropped without
   replacement when a template was applied.

   The 16 engineering specialisations and their prerequisites appear this
   way in REUP ("Engineering Prerequisites", p. 62). Bacta tank operation
   and diagnosis are not defined separately there; they turn up only in the
   medical droids' statblocks, which is why they carry no prerequisite - the
   attribute is the one the books file them under there.
   ===================================================================== */
const ADV_SKILLS = [
  { name: '(A) Medicine', attr: 'tec', req: 'First Aid 5D' },
  { name: '(A) Bacta Tank Operation', attr: 'mec', req: '' },
  { name: '(A) Injury/Ailment Diagnosis', attr: 'per', req: '' },
  /* REUP lists pod racing as an advanced skill (p. 46). */
  { name: '(A) Pod Racer Operation', attr: 'mec', req: 'Repulsorlift Op. 5D' },

  /* Engineering - one prerequisite per specialisation */
  { name: '(A) Aquatic Vehicle Engineering', attr: 'tec', req: 'Aquatic Vehicle Rep. 4D' },
  { name: '(A) Armor Engineering', attr: 'tec', req: 'Armor Repair 4D' },
  { name: '(A) Capital Ship Engineering', attr: 'tec', req: 'Capital Ship Repair 5D' },
  { name: '(A) Civil/Industrial Engineering', attr: 'tec', req: 'Bureaucracy 1D' },
  { name: '(A) Computer Engineering', attr: 'tec', req: 'Computer Prog. / Rep. 5D' },
  { name: '(A) Droid Engineering', attr: 'tec', req: 'Droid Repair 5D' },
  { name: '(A) Equipment Engineering', attr: 'tec', req: '' },
  { name: '(A) Ground Vehicle Engineering', attr: 'tec', req: 'Ground Vehicle Rep. 4D' },
  { name: '(A) Hover Vehicle Engineering', attr: 'tec', req: '' },
  { name: '(A) Installation Engineering', attr: 'tec', req: 'Computer Prog. / Rep. 2D' },
  { name: '(A) Repulsorlift Engineering', attr: 'tec', req: 'Repulsorlift Repair 4D' },
  { name: '(A) Space Transport Engineering', attr: 'tec', req: 'Space Transport Rep. 5D' },
  { name: '(A) Starfighter Engineering', attr: 'tec', req: 'Starfighter Repair 5D' },
  { name: '(A) Submersible Vehicle Engineering', attr: 'tec', req: '' },
  { name: '(A) Walker Engineering', attr: 'tec', req: 'Walker Repair 4D' },
  { name: '(A) Weapon Engineering', attr: 'tec', req: 'Blaster Repair 5D' },
];
