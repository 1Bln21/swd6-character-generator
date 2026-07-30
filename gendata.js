// Automatisch erzeugt aus "Droid Generator v1-3.xlsm" und "Ship Generator v1-1.xlsx"
// Quelle: Droiden-/Schiffs-Generatoren von Chance Gibboney (Star Wars D6, WEG)
// Nicht von Hand bearbeiten - stattdessen tools/extract-generators.py laufen lassen.
const DROID_DATA = {
 "degrees": [
  {
   "name": "First Degree",
   "mult": [
    100,
    50,
    100,
    75,
    150,
    50
   ]
  },
  {
   "name": "Second Degree",
   "mult": [
    100,
    100,
    50,
    100,
    150,
    50
   ]
  },
  {
   "name": "Third Degree",
   "mult": [
    100,
    50,
    110,
    65,
    135,
    110
   ]
  },
  {
   "name": "Fourth Degree",
   "mult": [
    50,
    150,
    100,
    85,
    65,
    135
   ]
  },
  {
   "name": "Fifth Degree",
   "mult": [
    85,
    135,
    85,
    150,
    50,
    65
   ]
  }
 ],
 "manufacturers": [
  "Accutronics",
  "Arakyd",
  "ARO",
  "Baktoid",
  "Balmorran Arms",
  "Caldrahlsen",
  "Chiba",
  "Colicoid",
  "Commerce Guild",
  "Cybot Galactica",
  "Czerka",
  "GeenTech",
  "GeneTech",
  "Go-Corp.",
  "Holowan Mechanical",
  "Industrial Automation",
  "Kalibac Industries",
  "Kuat Drive",
  "Las Tech",
  "LeisureMech",
  "Loronar",
  "Lovolan",
  "MedTech",
  "Merendata",
  "Opti-Prime",
  "Otoga",
  "Phlut Design System",
  "PublicTech",
  "Rebaxan Columni",
  "Rendili",
  "Rim Securities",
  "Roche",
  "Rodian",
  "Servo-Droid",
  "Sienar",
  "Smitroo",
  "SoroSuub Corp.",
  "Taptronics",
  "Techno Union",
  "Telbrintel",
  "Trade federation",
  "Trang Robotics",
  "Ubrikkian",
  "Ulban Arms",
  "Veril Line Systems"
 ],
 "bodyTypes": [
  "Box Framed",
  "Cylindrical",
  "Hemispherical",
  "Humanoid, Full",
  "Humanoid, Skeletal",
  "Semi-Humanoid",
  "Semi-Spherical",
  "Spherical"
 ],
 "locomotion": [
  "Ball Bearing/s",
  "Legs (2)",
  "Legs (3)",
  "Legs (4)",
  "Repulsorlift",
  "Stationary",
  "Treads",
  "Wheeled Legs (3)",
  "Wheeled Legs (4)",
  "Wheels"
 ],
 "scales": [
  "Character",
  "Speeder",
  "Walker",
  "Starfighter",
  "Capital"
 ],
 "matrix": [
  "None",
  "Simple",
  "Elementary",
  "Advanced",
  "Complex",
  "True A.I.",
  "Alien"
 ],
 "dbSkills": [
  "None",
  "Alien Species",
  "Armor Repair",
  "Blaster Repair",
  "Bureaucracy",
  "Business",
  "Capital Ship Repair",
  "Capital Ship Weapon Repair",
  "Computer Programming / Repair",
  "Cultures",
  "Demolition",
  "Droid Programming",
  "Droid Repair",
  "First Aid",
  "Ground Vehicle Repair",
  "Intimidation",
  "Languages",
  "Law Enforcement",
  "Lightsaber Repair",
  "Melee Repair",
  "Planetary Systems",
  "Repulsorlift Repair",
  "Scholar",
  "Security",
  "Space Transport Repair",
  "Starfighter Repair",
  "Starship Weapon Repair",
  "Streetwise",
  "Survival",
  "Tactics",
  "Value",
  "Walker Repair",
  "Willpower"
 ],
 "dbLevels": [
  {
   "label": "None",
   "pips": 0
  },
  {
   "label": "+1D+0",
   "pips": 3
  },
  {
   "label": "+2D+0",
   "pips": 6
  },
  {
   "label": "+3D+0",
   "pips": 9
  },
  {
   "label": "+4D+0",
   "pips": 12
  },
  {
   "label": "+5D+0",
   "pips": 15
  }
 ],
 "mods": [
  {
   "cat": "Flight Engines",
   "name": "Jet Pack",
   "desc": "20 Charges (vertically 70m, horizontally 100m per charge)",
   "pips": 10,
   "cp": 0
  },
  {
   "cat": "Flight Engines",
   "name": "Repulsor Pads",
   "desc": ".2m flight ceiling",
   "pips": 0,
   "cp": 0
  },
  {
   "cat": "Flight Engines",
   "name": "Repulsor Stabilizer",
   "desc": "+2D to any checks involving balance",
   "pips": 2,
   "cp": 0
  },
  {
   "cat": "Flight Engines",
   "name": "Repulsorlift Unit I",
   "desc": "2m flight ceiling",
   "pips": 1,
   "cp": 0
  },
  {
   "cat": "Flight Engines",
   "name": "Repulsorlift Unit II",
   "desc": "5m flight ceiling",
   "pips": 2,
   "cp": 0
  },
  {
   "cat": "Flight Engines",
   "name": "Repulsorlift Unit III",
   "desc": "10m flight ceiling",
   "pips": 3,
   "cp": 0
  },
  {
   "cat": "Flight Engines",
   "name": "Repulsorlift Unit IV",
   "desc": "25m flight ceiling",
   "pips": 4,
   "cp": 0
  },
  {
   "cat": "Flight Engines",
   "name": "Repulsorlift Unit V",
   "desc": "50m flight ceiling",
   "pips": 5,
   "cp": 0
  },
  {
   "cat": "Flight Engines",
   "name": "Repulsorlift Unit X",
   "desc": "500m flight ceiling",
   "pips": 8,
   "cp": 0
  },
  {
   "cat": "Flight Engines",
   "name": "Rocket Pack",
   "desc": "12 Charges (vertically 70m, horizontally 160m per charge)",
   "pips": 12,
   "cp": 0
  },
  {
   "cat": "Processors",
   "name": "AA-1 Verbobrain",
   "desc": "Human-like thought",
   "pips": 1,
   "cp": 0
  },
  {
   "cat": "Processors",
   "name": "AA-12x Verbobrain",
   "desc": "Tactical human-like thought",
   "pips": 2,
   "cp": 0
  },
  {
   "cat": "Processors",
   "name": "Analytical Computer",
   "desc": "Rapid data analysis",
   "pips": 0.5,
   "cp": 0
  },
  {
   "cat": "Processors",
   "name": "AX-1 Espionage Brain",
   "desc": "Counter-intelligence human-like thought",
   "pips": 2,
   "cp": 0
  },
  {
   "cat": "Processors",
   "name": "Backup Memory",
   "desc": "Keep skills learned after one memory wipe",
   "pips": 3,
   "cp": 0
  },
  {
   "cat": "Processors",
   "name": "Command Override",
   "desc": "Neutralizes restraining bolts",
   "pips": 3,
   "cp": 0
  },
  {
   "cat": "Processors",
   "name": "Heuristic Processor",
   "desc": "Able to use skills untrained in",
   "pips": 5,
   "cp": 0
  },
  {
   "cat": "Processors",
   "name": "Kraren X1 Super Processor",
   "desc": "Rapid data collation",
   "pips": 0.5,
   "cp": 0
  },
  {
   "cat": "Input / Output",
   "name": "Computer Scomp-Link",
   "desc": "+1D to all \"Comp. Prog. / Repair\" checks when linked to a network",
   "pips": 2,
   "cp": 3
  },
  {
   "cat": "Input / Output",
   "name": "Controller, Joystick",
   "desc": "500m range",
   "pips": 0,
   "cp": 0
  },
  {
   "cat": "Input / Output",
   "name": "Controller, Remote",
   "desc": "5000km range",
   "pips": 0,
   "cp": 0
  },
  {
   "cat": "Input / Output",
   "name": "Extendable I/O Computer Jack",
   "desc": "",
   "pips": 0,
   "cp": 0
  },
  {
   "cat": "Input / Output",
   "name": "Holographic Array Projector",
   "desc": "+3D to all \"Hide\", and +2D to all \"Sneak\" checks",
   "pips": 6,
   "cp": 15
  },
  {
   "cat": "Input / Output",
   "name": "Holographic Projector",
   "desc": "",
   "pips": 0.5,
   "cp": 0
  },
  {
   "cat": "Input / Output",
   "name": "Input Keyboard",
   "desc": "",
   "pips": 0,
   "cp": 0
  },
  {
   "cat": "Input / Output",
   "name": "Monitoring Screen",
   "desc": "",
   "pips": 0,
   "cp": 0
  },
  {
   "cat": "Input / Output",
   "name": "Multi-socket Computer Interface",
   "desc": "",
   "pips": 0,
   "cp": 0
  },
  {
   "cat": "Input / Output",
   "name": "Plastron Interface Socket",
   "desc": "",
   "pips": 0,
   "cp": 0
  },
  {
   "cat": "Input / Output",
   "name": "Readout Screen",
   "desc": "",
   "pips": 0,
   "cp": 0
  },
  {
   "cat": "Input / Output",
   "name": "Recording Unit, Audio",
   "desc": "",
   "pips": 0,
   "cp": 0
  },
  {
   "cat": "Input / Output",
   "name": "Recording Unit, Holographic",
   "desc": "",
   "pips": 0.5,
   "cp": 0
  },
  {
   "cat": "Input / Output",
   "name": "Recording Unit, Holo-Macrobinoculars",
   "desc": "+1D to all \"Search\" checks, records 50m line of sight",
   "pips": 2,
   "cp": 3
  },
  {
   "cat": "Input / Output",
   "name": "Recording Unit, Video",
   "desc": "",
   "pips": 0,
   "cp": 0
  },
  {
   "cat": "Input / Output",
   "name": "Starship Interface Jack",
   "desc": "",
   "pips": 0,
   "cp": 0
  },
  {
   "cat": "Input / Output",
   "name": "Video Display Screen",
   "desc": "",
   "pips": 0,
   "cp": 0
  },
  {
   "cat": "Sensors",
   "name": "Atmosphere Sensor",
   "desc": "determines air content in one hour, and type in five minutes",
   "pips": 0,
   "cp": 0
  },
  {
   "cat": "Sensors",
   "name": "Audio / Video Sensor (Alien Range)",
   "desc": "",
   "pips": 0,
   "cp": 0
  },
  {
   "cat": "Sensors",
   "name": "Audio / Video Sensor (Human Range)",
   "desc": "",
   "pips": 0,
   "cp": 0
  },
  {
   "cat": "Sensors",
   "name": "Biorecognition Package",
   "desc": "+2D to \"Search\" if biological readings of target are available, range is 40m",
   "pips": 4,
   "cp": 6
  },
  {
   "cat": "Sensors",
   "name": "Broad-band Antenna/Receiver",
   "desc": "",
   "pips": 0,
   "cp": 0
  },
  {
   "cat": "Sensors",
   "name": "Electromagnetic Sensors",
   "desc": "Monitors electromagnetic spectrum",
   "pips": 0,
   "cp": 0
  },
  {
   "cat": "Sensors",
   "name": "Greater Sensor Package",
   "desc": "+1D to all \"Search\" checks",
   "pips": 2,
   "cp": 3
  },
  {
   "cat": "Sensors",
   "name": "Improved Sensor Package",
   "desc": "+0D+2 to all \"Search\" checks",
   "pips": 1,
   "cp": 2
  },
  {
   "cat": "Sensors",
   "name": "Long-Range Sensor I",
   "desc": "+2D to all \"Search\" checks for objects 50-750 meters away",
   "pips": 4,
   "cp": 6
  },
  {
   "cat": "Sensors",
   "name": "Long-Range Sensor II",
   "desc": "+1D to all \"Search\" checks for objects 200-5000 meters away",
   "pips": 2,
   "cp": 1
  },
  {
   "cat": "Sensors",
   "name": "Motion Sensor I",
   "desc": "+1D to \"Search\" or Spot moving objects upto 50m away",
   "pips": 1,
   "cp": 1
  },
  {
   "cat": "Sensors",
   "name": "Motion Sensor II",
   "desc": "+1D to \"Search\" or Spot moving objects upto 500m away",
   "pips": 2,
   "cp": 1
  },
  {
   "cat": "Sensors",
   "name": "Olfactory Sensors",
   "desc": "+1D to Odor-based \"Search\" checks",
   "pips": 1,
   "cp": 1
  },
  {
   "cat": "Sensors",
   "name": "Planetary Array / Wide-Range Sensor",
   "desc": "Passive: 10m / 0D,  Scan: 100m / 1D,  Search: 500m / 2D,  Focus: 10m / 3D",
   "pips": 3,
   "cp": 0
  },
  {
   "cat": "Sensors",
   "name": "Radiation Sensors",
   "desc": "Determine radiation levels",
   "pips": 0,
   "cp": 0
  },
  {
   "cat": "Sensors",
   "name": "Seismic Sensor",
   "desc": "+1D to search for ground vibration and determine the source",
   "pips": 2,
   "cp": 3
  },
  {
   "cat": "Sensors",
   "name": "Sonic sensor",
   "desc": "+0D+2 to all \"Search\" checks involving sound",
   "pips": 1,
   "cp": 2
  },
  {
   "cat": "Sensors",
   "name": "System Diagnosis Package",
   "desc": "+1D to all \"System Diagnosis\" checks",
   "pips": 1,
   "cp": 3
  },
  {
   "cat": "Sensors",
   "name": "Torplex Microwave Sensor",
   "desc": "+1D to all \"Security\" checks",
   "pips": 2,
   "cp": 3
  },
  {
   "cat": "Sensors",
   "name": "Video Sensor, 360 degree",
   "desc": "Hard to surprise",
   "pips": 1,
   "cp": 0
  },
  {
   "cat": "Sensors",
   "name": "Video Sensor, Infrared",
   "desc": "Reduced penalty for darkness",
   "pips": 1,
   "cp": 0
  },
  {
   "cat": "Sensors",
   "name": "Video Sensor, Microscopic",
   "desc": "+1D to all \"search\" checks for microscale work",
   "pips": 1,
   "cp": 3
  },
  {
   "cat": "Sensors",
   "name": "Video Sensor, Telescopic",
   "desc": "",
   "pips": 0.5,
   "cp": 0
  },
  {
   "cat": "Sensors",
   "name": "Video Sensor, Ultra-violet",
   "desc": "",
   "pips": 0.5,
   "cp": 0
  },
  {
   "cat": "Sensors",
   "name": "Wide-band Comm Receptors",
   "desc": "",
   "pips": 0,
   "cp": 0
  },
  {
   "cat": "Communication/Speech",
   "name": "Coded Transmission Circuitry",
   "desc": "",
   "pips": 1,
   "cp": 0
  },
  {
   "cat": "Communication/Speech",
   "name": "Comlink, Internal",
   "desc": "",
   "pips": 0,
   "cp": 0
  },
  {
   "cat": "Communication/Speech",
   "name": "Comlink, Internal Broad-band",
   "desc": "",
   "pips": 1,
   "cp": 0
  },
  {
   "cat": "Communication/Speech",
   "name": "Comlink, Internal High Freq. Binary",
   "desc": "",
   "pips": 1,
   "cp": 0
  },
  {
   "cat": "Communication/Speech",
   "name": "Comlink, Internal Multichannel",
   "desc": "",
   "pips": 1,
   "cp": 0
  },
  {
   "cat": "Communication/Speech",
   "name": "Comlink, Internal, Encrypted",
   "desc": "",
   "pips": 2,
   "cp": 0
  },
  {
   "cat": "Communication/Speech",
   "name": "Cybot Acoustic Signaler",
   "desc": "Bleeps, Whistles, and Blurps",
   "pips": 0,
   "cp": 0
  },
  {
   "cat": "Communication/Speech",
   "name": "Restricted Vocabulary",
   "desc": "\"Affirmative\" and \"Negative\" are all it can speak",
   "pips": 0,
   "cp": 0
  },
  {
   "cat": "Communication/Speech",
   "name": "Speech Synthesizer",
   "desc": "Computerized speech",
   "pips": 0.5,
   "cp": 0
  },
  {
   "cat": "Communication/Speech",
   "name": "TranLang I Communication Module",
   "desc": "+1D to all \"Language\" checks",
   "pips": 2,
   "cp": 3
  },
  {
   "cat": "Communication/Speech",
   "name": "TranLang II Communication Module",
   "desc": "+2D to all \"Language\" checks",
   "pips": 4,
   "cp": 6
  },
  {
   "cat": "Communication/Speech",
   "name": "TranLang III Communication Module",
   "desc": "+3D to all \"Language\" checks",
   "pips": 6,
   "cp": 9
  },
  {
   "cat": "Communication/Speech",
   "name": "TranLang IV Communication Module",
   "desc": "+4D to all \"Language\" checks",
   "pips": 8,
   "cp": 12
  },
  {
   "cat": "Communication/Speech",
   "name": "Translator Unit",
   "desc": "+5D to all \"Language\" checks",
   "pips": 10,
   "cp": 15
  },
  {
   "cat": "Communication/Speech",
   "name": "Vocabulator",
   "desc": "Replicates organic speech",
   "pips": 1,
   "cp": 0
  },
  {
   "cat": "Software Package",
   "name": "Data Storage / Collection Software",
   "desc": "+1D to all \"Comp. Prog. / Repair\" checks involving data research",
   "pips": 1,
   "cp": 3
  },
  {
   "cat": "Software Package",
   "name": "Business Administration Database",
   "desc": "+1D to all \"Business\" and \"Cultures\" checks",
   "pips": 4,
   "cp": 3
  },
  {
   "cat": "Software Package",
   "name": "CodeRifter Encryption Programming",
   "desc": "Increases the difficulty one step to hack your data",
   "pips": 1,
   "cp": 0
  },
  {
   "cat": "Software Package",
   "name": "Data Analysis Software",
   "desc": "+1D to all \"Comp. Prog. / Repair\" checks involving data collection",
   "pips": 1,
   "cp": 3
  },
  {
   "cat": "Software Package",
   "name": "Language Database",
   "desc": "+1D to all \"Language\" checks",
   "pips": 2,
   "cp": 3
  },
  {
   "cat": "Software Package",
   "name": "Repair Database",
   "desc": "+1D to all \"Repair\" skill checks",
   "pips": 2,
   "cp": 3
  },
  {
   "cat": "Software Package",
   "name": "SecurityViolator Security Programming",
   "desc": "",
   "pips": 0,
   "cp": 0
  },
  {
   "cat": "Software Package",
   "name": "Tactical Database Software",
   "desc": "+1D to all \"Tactics\" Checks",
   "pips": 2,
   "cp": 3
  },
  {
   "cat": "Software Package",
   "name": "Skill Database Software I",
   "desc": "+1D to all \"Select Skill\" Checks",
   "pips": 2,
   "cp": 3
  },
  {
   "cat": "Software Package",
   "name": "Skill Database Software II",
   "desc": "+2D to all \"Select Skill\" Checks",
   "pips": 4,
   "cp": 6
  },
  {
   "cat": "Manipulators",
   "name": "Grasping Claw, Heavy",
   "desc": "+2D to all \"Lifting\" checks",
   "pips": 4,
   "cp": 6
  },
  {
   "cat": "Manipulators",
   "name": "Grasping Claw, Standard",
   "desc": "+1D to all \"Lifting\" checks",
   "pips": 2,
   "cp": 3
  },
  {
   "cat": "Manipulators",
   "name": "Manipulator Arm, Fine",
   "desc": "",
   "pips": 0,
   "cp": 0
  },
  {
   "cat": "Manipulators",
   "name": "Manipulator Arm, Fine, Retractable",
   "desc": "",
   "pips": 0,
   "cp": 0
  },
  {
   "cat": "Manipulators",
   "name": "Manipulator Arm, Heavy",
   "desc": "+1D to all \"Lifting\" checks",
   "pips": 1,
   "cp": 1
  },
  {
   "cat": "Manipulators",
   "name": "Manipulator Arm, Heavy, Retractable",
   "desc": "+1D to all \"Lifting\" checks",
   "pips": 1,
   "cp": 1
  },
  {
   "cat": "Manipulators",
   "name": "Manipulator Arm, Ultra-fine",
   "desc": "+1D to all Technical Skill rolls",
   "pips": 3,
   "cp": 3
  },
  {
   "cat": "Manipulators",
   "name": "Manipulator Arm, Ultra-fine, Retractable",
   "desc": "+1D to all Technical Skill rolls",
   "pips": 3,
   "cp": 3
  },
  {
   "cat": "Manipulators",
   "name": "Telescopic Appendage",
   "desc": "2m reach",
   "pips": 0,
   "cp": 0
  },
  {
   "cat": "Manipulators",
   "name": "Tool Mounts",
   "desc": "",
   "pips": 0,
   "cp": 0
  },
  {
   "cat": "Armor",
   "name": "Armor, Protective Coating",
   "desc": "+1D against physical damage",
   "pips": 1.5,
   "cp": 3
  },
  {
   "cat": "Armor",
   "name": "Armor, Reinforced Hull",
   "desc": "+2D against physical damage",
   "pips": 3,
   "cp": 6
  },
  {
   "cat": "Armor",
   "name": "Armor, Durasteel Plating",
   "desc": "+3D against physical damage",
   "pips": 4.5,
   "cp": 9
  },
  {
   "cat": "Armor",
   "name": "Armor, Light",
   "desc": "+1D against physical and +1D against energy damage",
   "pips": 3,
   "cp": 6
  },
  {
   "cat": "Armor",
   "name": "Armor, Medium",
   "desc": "+2D against physical and +2D against energy damage",
   "pips": 6,
   "cp": 12
  },
  {
   "cat": "Armor",
   "name": "Armor, Heavy",
   "desc": "+3D against physical and +3D against energy damage",
   "pips": 9,
   "cp": 18
  },
  {
   "cat": "Armor",
   "name": "Armor, Super",
   "desc": "+4D against physical and +4D against energy damage",
   "pips": 12,
   "cp": 24
  },
  {
   "cat": "Armor",
   "name": "Shield, Deflector",
   "desc": "+1D against energy damage",
   "pips": 1.5,
   "cp": 3
  },
  {
   "cat": "Armor",
   "name": "Shield, Force Field",
   "desc": "+2D against energy damage",
   "pips": 3,
   "cp": 6
  },
  {
   "cat": "Armor",
   "name": "Shield, Generator",
   "desc": "+3D against energy damage",
   "pips": 4.5,
   "cp": 9
  },
  {
   "cat": "Armor",
   "name": "Shield, Forearm",
   "desc": "+1D to all \"Brawling Parry\" and \"Melee Parry\" checks",
   "pips": 2,
   "cp": 6
  },
  {
   "cat": "Armor",
   "name": "Shield, Molecular",
   "desc": "Absorbs any energy bolts that successfully hit",
   "pips": 12,
   "cp": 0
  },
  {
   "cat": "Mounted Tools/Weapons",
   "name": "Blaster, Cannon",
   "desc": "8D damage, Range (0-2/3-75/76-200/201-500)",
   "pips": 5,
   "cp": 0
  },
  {
   "cat": "Mounted Tools/Weapons",
   "name": "Blaster, Heavy",
   "desc": "6D damage, Range (0-2/3-30/31-100/101-300)",
   "pips": 3,
   "cp": 0
  },
  {
   "cat": "Mounted Tools/Weapons",
   "name": "Blaster, Light",
   "desc": "2D damage, Range (0-1/2-4/5-10/11-30)",
   "pips": 0.5,
   "cp": 0
  },
  {
   "cat": "Mounted Tools/Weapons",
   "name": "Blaster, Medium",
   "desc": "4D damage, Range (0-2/3-10/11-30/31-120)",
   "pips": 1,
   "cp": 0
  },
  {
   "cat": "Mounted Tools/Weapons",
   "name": "Blaster, Stun",
   "desc": "4D damage, Range (0-2/3-10/11-30/31-60)",
   "pips": 1,
   "cp": 0
  },
  {
   "cat": "Mounted Tools/Weapons",
   "name": "Buzzsaw",
   "desc": "5D damage, Melee",
   "pips": 1,
   "cp": 0
  },
  {
   "cat": "Mounted Tools/Weapons",
   "name": "Cargo Wench",
   "desc": "50m of durasteel cable, +1D to all \"Lifting\" check",
   "pips": 2,
   "cp": 0
  },
  {
   "cat": "Mounted Tools/Weapons",
   "name": "Circular Saw",
   "desc": "4D damage, Melee",
   "pips": 1,
   "cp": 0
  },
  {
   "cat": "Mounted Tools/Weapons",
   "name": "Flamethrower",
   "desc": "3D damage (combust), Range (10m cone)",
   "pips": 1,
   "cp": 0
  },
  {
   "cat": "Mounted Tools/Weapons",
   "name": "Internal Processing Furnace",
   "desc": "10D damage (Walker Scale)",
   "pips": 10,
   "cp": 0
  },
  {
   "cat": "Mounted Tools/Weapons",
   "name": "Plasteel Cutter",
   "desc": "2D damage, Range (2m)",
   "pips": 0.5,
   "cp": 0
  },
  {
   "cat": "Mounted Tools/Weapons",
   "name": "Sonic Torture Device",
   "desc": "3D damage (stun), Melee",
   "pips": 1,
   "cp": 0
  },
  {
   "cat": "Mounted Tools/Weapons",
   "name": "Stun Prod",
   "desc": "5D damage (stun), Range (3m)",
   "pips": 1,
   "cp": 0
  },
  {
   "cat": "Mounted Tools/Weapons",
   "name": "Thermal Drill",
   "desc": "5D damage, Melee",
   "pips": 1,
   "cp": 0
  },
  {
   "cat": "Mounted Tools/Weapons",
   "name": "Welder, Arc",
   "desc": "6D damage, Range (2m)",
   "pips": 2,
   "cp": 0
  },
  {
   "cat": "Mounted Tools/Weapons",
   "name": "Welder, Heavy Laser",
   "desc": "8D damage, Range (2m)",
   "pips": 3,
   "cp": 0
  },
  {
   "cat": "Mounted Tools/Weapons",
   "name": "Welder, Laser",
   "desc": "4D damage, Range (2m)",
   "pips": 1,
   "cp": 0
  },
  {
   "cat": "Medical",
   "name": "Amputation Vibroblade",
   "desc": "5D damage, First Aid or Medicine",
   "pips": 1,
   "cp": 0
  },
  {
   "cat": "Medical",
   "name": "Electroshock Probe",
   "desc": "1D to 4D (variable) damage (stun), First Aid or Medicine",
   "pips": 1,
   "cp": 0
  },
  {
   "cat": "Medical",
   "name": "Hypodermic Injectors (Other)",
   "desc": "description",
   "pips": 1,
   "cp": 0
  },
  {
   "cat": "Medical",
   "name": "Hypodermic Injectors (paralysis)",
   "desc": "4D damage (stun), First Aid or Medicine",
   "pips": 1,
   "cp": 0
  },
  {
   "cat": "Medical",
   "name": "Laser Scalpel I",
   "desc": "2D damage, First Aid or Medicine",
   "pips": 0.5,
   "cp": 0
  },
  {
   "cat": "Medical",
   "name": "Laser Scalpel II",
   "desc": "3D damage, First Aid or Medicine",
   "pips": 1,
   "cp": 0
  },
  {
   "cat": "Medical",
   "name": "Medical Computer Interface Tether",
   "desc": "When connected to medical mainframe, +2D bonus to all medical skills",
   "pips": 5,
   "cp": 0
  },
  {
   "cat": "Medical",
   "name": "Medical Computer Scomp Link",
   "desc": "When connected to medical mainframe, +1D bonus to all medical skills",
   "pips": 3,
   "cp": 0
  },
  {
   "cat": "Medical",
   "name": "Medical Diagnostic Computer and Sensor",
   "desc": "+1D to all \"Medicine\" and \"First Aid\" checks",
   "pips": 2,
   "cp": 3
  },
  {
   "cat": "Medical",
   "name": "Medicine Dispensers",
   "desc": "",
   "pips": 0,
   "cp": 0
  },
  {
   "cat": "Medical",
   "name": "Power Shears",
   "desc": "5D damage, First Aid or Medicine",
   "pips": 1,
   "cp": 0
  },
  {
   "cat": "Medical",
   "name": "Surgical Attachments",
   "desc": "",
   "pips": 0,
   "cp": 0
  },
  {
   "cat": "Other",
   "name": "Anti-scan Frame",
   "desc": "+1D to \"Hide\" against sensors",
   "pips": 2,
   "cp": 3
  },
  {
   "cat": "Other",
   "name": "Compressed Air Launcher",
   "desc": "(for flares)",
   "pips": 0,
   "cp": 0
  },
  {
   "cat": "Other",
   "name": "Diagnostic Package",
   "desc": "+2D to one Repair skill",
   "pips": 6,
   "cp": 6
  },
  {
   "cat": "Other",
   "name": "Droid GPS Module",
   "desc": "",
   "pips": 0,
   "cp": 0
  },
  {
   "cat": "Other",
   "name": "Enviromental Compensator",
   "desc": "Protected circuitry to survive extreme atmospheres and vacuum of space",
   "pips": 1,
   "cp": 0
  },
  {
   "cat": "Other",
   "name": "Equipment Tray/Bin",
   "desc": "",
   "pips": 0,
   "cp": 0
  },
  {
   "cat": "Other",
   "name": "Fire Extinguisher",
   "desc": "Can create a 2m cloud, that grants +2D cover bonus against blaster fire",
   "pips": 1,
   "cp": 0
  },
  {
   "cat": "Other",
   "name": "Foldable Body/Chassis",
   "desc": "",
   "pips": 0,
   "cp": 0
  },
  {
   "cat": "Other",
   "name": "Food Sample Analyzer",
   "desc": "",
   "pips": 0,
   "cp": 0
  },
  {
   "cat": "Other",
   "name": "Hi-Intensity Searchlight",
   "desc": "100m line of light",
   "pips": 0.5,
   "cp": 0
  },
  {
   "cat": "Other",
   "name": "Hyperspace, Astrogation Buffer",
   "desc": "Stores one set of Nav coordinates",
   "pips": 0.5,
   "cp": 0
  },
  {
   "cat": "Other",
   "name": "Hyperspace, Jump Memory",
   "desc": "Stores five sets of Nav coordinates",
   "pips": 1,
   "cp": 0
  },
  {
   "cat": "Other",
   "name": "Internal Power Generator, Heavy",
   "desc": "able to recharge a Starfighter scale vehicle in 1 day",
   "pips": 2,
   "cp": 0
  },
  {
   "cat": "Other",
   "name": "Internal Power Generator, Standard",
   "desc": "able to recharge a Walker scale vehicle in 1 day",
   "pips": 4,
   "cp": 0
  },
  {
   "cat": "Other",
   "name": "Internal Storage, Medium",
   "desc": "10kg of extra space available for storage",
   "pips": 1,
   "cp": 0
  },
  {
   "cat": "Other",
   "name": "Internal Storage, Small",
   "desc": "2kg of extra space available for storage",
   "pips": 0.5,
   "cp": 0
  },
  {
   "cat": "Other",
   "name": "Internal Storage, Tiny",
   "desc": ".5kg of extra space available for storage",
   "pips": 0,
   "cp": 0
  },
  {
   "cat": "Other",
   "name": "Locked Access",
   "desc": "Shutdown switch is secured or internally located",
   "pips": 3,
   "cp": 0
  },
  {
   "cat": "Other",
   "name": "Loyalty Inhibitor",
   "desc": "Inhibits this unit from disclosing any info. classified as \"Business Sensitive\"",
   "pips": 2,
   "cp": 0
  },
  {
   "cat": "Other",
   "name": "Magnetic Footpads/Manipulators",
   "desc": "",
   "pips": 0.5,
   "cp": 0
  },
  {
   "cat": "Other",
   "name": "Magnetic Treads/Wheels",
   "desc": "",
   "pips": 0.5,
   "cp": 0
  },
  {
   "cat": "Other",
   "name": "Mineral Analysis Kit and Sampler",
   "desc": "+2D to all \"Investigation\" and \"Value\" check on any mineral samples",
   "pips": 6,
   "cp": 12
  },
  {
   "cat": "Other",
   "name": "Organic Bio-fibers/Vat-Grown Skin",
   "desc": "Replicated regenerative skin and muscles",
   "pips": 1,
   "cp": 0
  },
  {
   "cat": "Other",
   "name": "Retractable Leg",
   "desc": "",
   "pips": 0,
   "cp": 0
  },
  {
   "cat": "Other",
   "name": "Self Destruct System, Area I",
   "desc": "5D/3D damage in a 0-3m/4-6m radius",
   "pips": 1,
   "cp": 0
  },
  {
   "cat": "Other",
   "name": "Self Destruct System, Area II",
   "desc": "8D/6D/4D/2D damage  0-2m/3-4m/5-6m/7-8m radius",
   "pips": 2,
   "cp": 0
  },
  {
   "cat": "Other",
   "name": "Self Destruct System, Droid",
   "desc": "Destroys the droids circuitry and major components",
   "pips": 0,
   "cp": 0
  },
  {
   "cat": "Other",
   "name": "Sexual Package, Female",
   "desc": "Female gender anatomy, Feminine Voice",
   "pips": 0,
   "cp": 0
  },
  {
   "cat": "Other",
   "name": "Sexual Package, Male",
   "desc": "Male gender anatomy, Masculine Voice",
   "pips": 0,
   "cp": 0
  },
  {
   "cat": "Other",
   "name": "Shielded Circuitry/Data Storage Module",
   "desc": "Grants +3D against an DEMP, Electromagnetic, or Ion effects",
   "pips": 4,
   "cp": 9
  },
  {
   "cat": "Other",
   "name": "Spray Nozzle",
   "desc": "",
   "pips": 0,
   "cp": 0
  }
 ],
 "startDice": 25,
 "attrMinPips": 3,
 "attrMaxPips": 39,
 "cpPerAttrPip": 20
};
const SHIP_DATA = {
 "scales": [
  "Character",
  "Speeder",
  "Walker",
  "Starfighter",
  "Capital",
  "Deathstar"
 ],
 "pilotSkills": [
  "Archaic Starship Piloting",
  "Capital Ship Piloting",
  "Ground Vehicle Operation",
  "Hover Vehicle Operation",
  "Repulsorlift Operation",
  "Space Transports",
  "Starfighter Piloting",
  "Swoop Operation",
  "Walker Operation",
  "User Defined"
 ],
 "crewSkills": [
  "Archaic Starship Piloting",
  "Astrogation",
  "Capital Ship Gunnery",
  "Capital Ship Piloting",
  "Capital Ship Shields",
  "Communications",
  "Ground vehicle Op.",
  "Hover Vehicle Op.",
  "Repulsorlift Operation",
  "Sensors",
  "Space Transport",
  "Starfighter Piloting",
  "Starship Gunnery",
  "Starship Shields",
  "Swoop Operation",
  "Vehicle Blasters",
  "Walker Operation"
 ],
 "covers": [
  "Not applicable",
  "1/4",
  "1/2",
  "3/4",
  "Full"
 ],
 "hyperMults": [
  "None",
  "x0.5",
  "x0.75",
  "x1",
  "x1.5",
  "x2",
  "x3",
  "x4",
  "x5",
  "x6",
  "x7",
  "x8",
  "x9",
  "x10",
  "x11",
  "x12",
  "x13",
  "x14",
  "x15",
  "x16",
  "x17",
  "x18",
  "x19",
  "x20",
  "x25"
 ],
 "fireArcs": [
  "Front",
  "Right",
  "Left",
  "Back",
  "Turret"
 ],
 "gunSkills": [
  "Starship Gunnery",
  "Vehicle Blasters",
  "Capital Ship Gunnery",
  "User Defined"
 ],
 "weaponScales": [
  "Character",
  "Speeder",
  "Walker",
  "Starship",
  "Capital",
  "Deathstar"
 ],
 "generalMods": [
 {
  "name": "Sensor Jamming Hardware",
  "desc": "Grants sensors +1D to Identify, but -2D to Detect",
  "cost": 4000,
  "weight": 1,
  "avail": "X"
 },
 {
  "name": "Sensor Decoys",
  "desc": "add +2D to the difficulty to determine ship vs. sensor",
  "cost": 2000,
  "weight": 2,
  "avail": "F"
 },
 {
  "name": "Escape Equipment",
  "desc": "Seats eight (food/oxygen for 2 weeks)",
  "cost": 1200,
  "weight": 5,
  "avail": "2"
 },
 {
  "name": "Enviromental Converters",
  "desc": "Comfortable environs through-out the ship",
  "cost": 4000,
  "weight": 4,
  "avail": "2"
 },
 {
  "name": "Fuel Converter: Solid Fuel Converter",
  "desc": "Half the ship's \"restocking\" fees",
  "cost": 8000,
  "weight": 5,
  "avail": "2"
 },
 {
  "name": "Fuel Converter: Scoops",
  "desc": "Recharges power cells in atmosphere or water",
  "cost": 15000,
  "weight": 15,
  "avail": "2"
 },
 {
  "name": "Fuel Converter: Solar Converter",
  "desc": "Solar Sails: recharge ship's power cells in about 15 days",
  "cost": 12000,
  "weight": 10,
  "avail": "2"
 },
 {
  "name": "Automatic Cargo Jettisoning",
  "desc": "Ability to jettison cargo from the cockpit",
  "cost": 1000,
  "weight": 1,
  "avail": "F"
 },
 {
  "name": "Passenger Conversion: Primitive",
  "desc": "Passengers sleep on the floor",
  "cost": 30,
  "weight": 1,
  "avail": "X"
 },
 {
  "name": "Passenger Conversion: Standard",
  "desc": "Passenger compartment",
  "cost": 400,
  "weight": 10,
  "avail": "2"
 },
 {
  "name": "Passenger Conversion: Luxury",
  "desc": "Luxurious passanger compartment",
  "cost": 1000,
  "weight": 15,
  "avail": "3"
 }
],
 "driveMods": [
  {
   "label": "+1",
   "diff": "Moderate",
   "costPct": 0.1,
   "mishap": 1
  },
  {
   "label": "+2",
   "diff": "Difficult",
   "costPct": 0.15,
   "mishap": 1
  },
  {
   "label": "+3",
   "diff": "Very Difficult",
   "costPct": 0.25,
   "mishap": 2
  },
  {
   "label": "+4",
   "diff": "Heroic",
   "costPct": 0.35,
   "mishap": 3
  }
 ],
 "maneuverMods": [
  {
   "label": "+0D+1",
   "diff": "Easy",
   "costPct": 0.05,
   "mishap": 1
  },
  {
   "label": "+0D+2",
   "diff": "Moderate",
   "costPct": 0.1,
   "mishap": 1
  },
  {
   "label": "+1D+0",
   "diff": "Difficult",
   "costPct": 0.15,
   "mishap": 1
  },
  {
   "label": "+1D+1",
   "diff": "Very Difficult",
   "costPct": 0.2,
   "mishap": 2
  },
  {
   "label": "+1D+2",
   "diff": "Heroic",
   "costPct": 0.25,
   "mishap": 3
  }
 ],
 "hullMods": [
  {
   "label": "+0D+1",
   "diff": "Moderate",
   "costPct": 0.1,
   "mishap": 1
  },
  {
   "label": "+0D+2",
   "diff": "Difficult",
   "costPct": 0.15,
   "mishap": 1
  },
  {
   "label": "+1D+0",
   "diff": "Very Difficult",
   "costPct": 0.2,
   "mishap": 2
  },
  {
   "label": "+1D+1",
   "diff": "Heroic",
   "costPct": 0.25,
   "mishap": 3
  }
 ],
 "shieldMods": [
  {
   "label": "+0D+1",
   "diff": "Moderate",
   "costPct": 0.1,
   "mishap": 1
  },
  {
   "label": "+0D+2",
   "diff": "Difficult",
   "costPct": 0.15,
   "mishap": 1
  },
  {
   "label": "+1D+0",
   "diff": "Very Difficult",
   "costPct": 0.2,
   "mishap": 2
  },
  {
   "label": "+1D+1",
   "diff": "Heroic",
   "costPct": 0.25,
   "mishap": 3
  }
 ],
 "weaponDmgMods": [
  {
   "label": "+0D+1",
   "diff": "Easy",
   "costPct": 0.15,
   "mishap": 1
  },
  {
   "label": "+0D+2",
   "diff": "Moderate",
   "costPct": 0.25,
   "mishap": 1
  },
  {
   "label": "+1D+0",
   "diff": "Difficult",
   "costPct": 0.3,
   "mishap": 2
  },
  {
   "label": "+1D+1",
   "diff": "Very Difficult",
   "costPct": 0.35,
   "mishap": 2
  },
  {
   "label": "+1D+2",
   "diff": "Heroic",
   "costPct": 0.5,
   "mishap": 3
  }
 ],
 "hyperImprove": [
  {
   "label": "x2",
   "diff": "Moderate",
   "costPct": 0.15,
   "mishap": 1
  },
  {
   "label": "x1",
   "diff": "Very Difficult",
   "costPct": 0.25,
   "mishap": 2
  },
  {
   "label": "x0.5",
   "diff": "Heroic",
   "costPct": 0.35,
   "mishap": 3
  }
 ],
 "replDrives": [
  {
   "model": "Starscream-9",
   "maker": "Sienar Fleet",
   "type": "Ion Drive",
   "cost": 500000,
   "weight": 24,
   "avail": "X",
   "space": 12,
   "atmCruise": 450,
   "atmMax": 1300,
   "special": "Double all difficulties when modifing this drive."
  },
  {
   "model": "Boshaa-C'hi",
   "maker": "Kuat Drive Yard",
   "type": "Ion Drive",
   "cost": 100000,
   "weight": 18,
   "avail": "X",
   "space": 10,
   "atmCruise": 0,
   "atmMax": 0,
   "special": "Double all difficulties when modifing this drive."
  },
  {
   "model": "Evader-GT",
   "maker": "Corellian",
   "type": "Ion Drive",
   "cost": 50000,
   "weight": 16,
   "avail": "F",
   "space": 8,
   "atmCruise": 0,
   "atmMax": 0,
   "special": "Double all difficulties when modifing this drive."
  },
  {
   "model": "Starslinger",
   "maker": "Incom",
   "type": "Ion Drive",
   "cost": 20000,
   "weight": 12,
   "avail": "F",
   "space": 6,
   "atmCruise": 0,
   "atmMax": 0,
   "special": "Double all difficulties when modifing this drive."
  },
  {
   "model": "Boav",
   "maker": "SoroSuub",
   "type": "Ion Drive",
   "cost": 10000,
   "weight": 10,
   "avail": "2",
   "space": 4,
   "atmCruise": 0,
   "atmMax": 0,
   "special": "0"
  }
 ],
 "replHyper": [
  {
   "mult": "x5",
   "model": "Lifesaver 1000",
   "maker": "Sienar Fleet",
   "cost": 2500,
   "weight": 8,
   "avail": "1",
   "special": "must be overhauled after each jump"
  },
  {
   "mult": "x4",
   "model": "ATX-5",
   "maker": "Rendili StarDrive",
   "cost": 4000,
   "weight": 10,
   "avail": "1",
   "special": "0"
  },
  {
   "mult": "x3",
   "model": "Horizon-Hopper Light",
   "maker": "Incom",
   "cost": 7000,
   "weight": 12,
   "avail": "2",
   "special": "0"
  },
  {
   "mult": "x2",
   "model": "Avatar-10",
   "maker": "Corellian",
   "cost": 10000,
   "weight": 15,
   "avail": "2",
   "special": "+1D to Repair rolls to Install"
  },
  {
   "mult": "x1",
   "model": "Griffyn-XTG",
   "maker": "SoroSuub",
   "cost": 15000,
   "weight": 18,
   "avail": "F",
   "special": "any non-SoroSuub ship attempting to install +1 difficulty level"
  },
  {
   "mult": "x1",
   "model": "Warp-XR",
   "maker": "Sienar Fleet",
   "cost": 25000,
   "weight": 17,
   "avail": "X",
   "special": "0"
  }
 ],
 "shieldGens": [
  {
   "rating": "1D",
   "cost": 4000,
   "weight": 6,
   "pips": 3
  },
  {
   "rating": "2D",
   "cost": 10000,
   "weight": 8,
   "pips": 6
  },
  {
   "rating": "3D",
   "cost": 20000,
   "weight": 10,
   "pips": 9
  },
  {
   "rating": "4D",
   "cost": 40000,
   "weight": 12,
   "pips": 12
  }
 ],
 "cargoMods": [
  {
   "name": "Cargo Compartment: Concealed",
   "cost": 200,
   "weight": 1
  },
  {
   "name": "Cargo Compartment: Hidden",
   "cost": 400,
   "weight": 5
  },
  {
   "name": "Cargo Compartment: Scanner Resistant",
   "cost": 1000,
   "weight": 5
  },
  {
   "name": "Refrigeration Equipment",
   "cost": 100,
   "weight": 1
  }
 ],
 "maxWeapons": 12
};
