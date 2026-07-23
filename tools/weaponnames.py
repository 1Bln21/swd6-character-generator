# -*- coding: utf-8 -*-
"""
=============================================================================
 Waffennamen aus Schiffs- und Fahrzeug-Statbloecken saeubern
=============================================================================

 Die Waffenliste eines Schiffs ist die unruhigste Stelle der Textebene: die
 Buecher setzen sie zweispaltig, mit Aufzaehlungszeichen, Fussnoten und
 Seitenfuessen dazwischen. Dabei entstehen zwei Sorten von Schrott:

   1. reparierbar - der Name traegt Ballast VOR sich her
      "Scan 80/2D Search 100/3D Focus 5/4D 6 Dual Turbolaser Cannons"
      (die Sensorzeile ist in die Waffenzeile gelaufen)

   2. Phantomwaffen - eine Zeile aus dem Statblock der VORIGEN Waffe wurde
      als eigene Waffe gelesen: "1.7 km", "(Atmosphere)", "5 batteries rear".
      Der Gymsnor-2 Freighter kam so auf zwei Waffen statt einer.

 Eigenes Modul, weil zwei Werkzeuge dieselben Regeln brauchen:
 extract-from-pdfs.py beim Einlesen der PDFs und repair-catalogs.py, das
 die bereits erzeugten pdfdata-*.js nachtraeglich in Ordnung bringt.
=============================================================================
"""
import re

BULLET_CHARS = '■□▪▫•●◆·'

LIG = {'ﬁ': 'fi', 'ﬂ': 'fl', 'ﬀ': 'ff', '’': "'", '‘': "'", '“': '"', '”': '"',
       '–': '-', '—': '-', ' ': ' ', ' ': ' '}

# Zeilen aus dem Statblock, die als eigene Waffe gelesen wurden. "space" nur
# vor "Range", sonst fiele der "Space Mine Layer" mit durch.
WEAPON_JUNK_FIRST = re.compile(
    # Wortanfaenge - "Atmosph" steht fuer "Atmosphere" wie fuer die am
    # Zeilenende abgeschnittene Fassung
    r'^(?:space\s*ran|atmosph|fire\s*control|fire\s*arc|blast\s*radi|auto-?fire'
    # ganze Woerter
    r'|(?:damage|scale|crew|ammo|range|skill|batter(?:y|ies)|may)\b)', re.I)

# Feuerwinkel-Zeilen ohne jeden Waffennamen ("Rear/Left, 2 Rear/Right")
WEAPON_ARCS = re.compile(
    r'^(?:\d+\s+)?(?:front|rear|back|left|right|turret|forward|dorsal|ventral|'
    r'port|starboard)(?:[\s/,]+(?:\d+\s+)?(?:front|rear|back|left|right|turret|'
    r'forward|dorsal|ventral|port|starboard))*\*?\s*$', re.I)

# Seitenfuss der Quellbuecher ("Galaxy Guide 16: The Old Republic 284")
WEAPON_FOOTER = re.compile(
    r'\b(guide|sourcebook|compendium|anthology|handbook|companion|journal)\b'
    r'[^,]*\s\d{1,3}\s*$', re.I)

# Ein einzelnes Eigenschaftswort ist kein Waffenname
WEAPON_ADJ = {'heavy', 'light', 'medium', 'twin', 'quad', 'dual', 'double'}

# Woerter, an denen sich ein am Zeilenende abgeschnittener Name erkennen
# laesst: "70 Heavy Turbolas", "102 Proton Torp", "Energy Bom"
WEAPON_WORDS = ('cannon', 'laser', 'turbolaser', 'blaster', 'missile', 'torpedo',
                'launcher', 'turret', 'projector', 'disruptor', 'bomb', 'rocket',
                'battery', 'defense', 'atmosphere', 'range', 'scattergun',
                'flamethrower', 'slugthrower', 'lightsaber')

WEAPON_COUNT_RE = re.compile(r'^\s*(\d+)\s*[x×]?\s+')

WEAPON_PLURAL = {
    'Cannons': 'Cannon', 'Launchers': 'Launcher', 'Tubes': 'Tube',
    'Turrets': 'Turret', 'Batteries': 'Battery', 'Projectors': 'Projector',
    'Emplacements': 'Emplacement', 'Guns': 'Gun', 'Lasers': 'Laser',
    'Missiles': 'Missile', 'Torpedoes': 'Torpedo', 'Blasters': 'Blaster',
    'Mounts': 'Mount', 'Racks': 'Rack', 'Bays': 'Bay', 'Bombs': 'Bomb',
}


def _clean(s):
    for a, b in LIG.items():
        s = s.replace(a, b)
    s = re.sub(r'\[\d+\]', '', s)                     # Fussnotenverweise
    return re.sub(r'[ \t]+', ' ', s).strip()


def clean_weapon_name(raw):
    """Ballast vor dem eigentlichen Waffennamen abraeumen."""
    n = _clean(raw or '').strip()
    n = n.lstrip(BULLET_CHARS + ' *').strip()
    n = re.sub(r'^.*[%s]\s*' % BULLET_CHARS, '', n)   # Seitenfuss + Kaestchen
    n = re.sub(r'^[^.]*\bper (?:round|turn)\.\s*', '', n, flags=re.I)
    n = re.sub(r'^.*\bFocus\s*:?\s*\S+\s+(?=[0-9A-Za-z])', '', n, flags=re.I)
    n = re.sub(r'^.*\(pages?\s+[^)]*\)\s*(?=[A-Za-z])', '', n, flags=re.I)
    n = re.sub(r'^\([^)]{0,40}\)\s*(?=[0-9A-Za-z])', '', n)
    n = n.strip()
    # Statwerte vor dem Namen: den abschliessenden grossgeschriebenen
    # Ausdruck herausziehen ("... 11D if a heavy proton bomb is used.
    # Tractor Beam" -> "Tractor Beam")
    if re.search(r'\dD', n):
        m = re.search(r'([A-Z][A-Za-z-]*(?:\s+[A-Z][A-Za-z-]*){0,3})\s*$', n)
        if m and m.start() > 0 and re.search(r'\dD', n[:m.start()]):
            n = m.group(1)
    if n and n[0].islower():
        n = n[0].upper() + n[1:]
    return n.strip()


def plausible_weapon_name(n):
    """False = Phantomwaffe oder unbrauchbar abgeschnittener Name."""
    if not n or not re.match(r'[A-Za-z0-9"]', n):
        return False
    if re.search(r'\bkm\b', n, re.I):                 # Reichweitenzeile
        return False
    if re.search(r'\d\s*/\s*\d', n):                  # "300/700 for torpedoes"
        return False
    if re.search(r'\(pages?\s', n, re.I) or WEAPON_FOOTER.search(n):
        return False
    if WEAPON_JUNK_FIRST.match(n) and not re.search(
            r'\b(cannon|laser|blaster|launcher|turret|gun|projector)\b', n, re.I):
        return False
    if WEAPON_ARCS.match(n):
        return False
    if len(re.findall(r'[A-Za-z]', n)) < 3:
        return False
    if n.lower().strip('*') in WEAPON_ADJ:
        return False
    # Am Zeilenende abgeschnitten: das letzte Wort ist nur der Anfang eines
    # Waffenworts ("Turbolas", "Torp", "Bom")
    tail = re.findall(r'[A-Za-z]+', n)
    if tail:
        last = tail[-1].lower()
        if len(last) >= 3 and any(w.startswith(last) and w != last
                                  for w in WEAPON_WORDS):
            return False
    return True


def weapon_base_name(n):
    """'2 Pulse Laser Cannons' -> 'Pulse Laser Cannon'
       Die Stueckzahl gehoert in das eigene Feld, nicht in den Namen."""
    n = WEAPON_COUNT_RE.sub('', (n or '').strip())
    n = re.sub(r'\s*\([^)]*\)\s*$', '', n).strip()    # "(2 fire-linked)" o. ae.
    # Mehrzahl nur bei den ueblichen Waffenwoertern zuruecknehmen
    n = re.sub(r'\b(%s)\b' % '|'.join(WEAPON_PLURAL),
               lambda m: WEAPON_PLURAL[m.group(1)], n)
    return n.strip()
