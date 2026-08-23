# -*- coding: utf-8 -*-
"""
=============================================================================
 Clean weapon names out of ship and vehicle statblocks
=============================================================================

 A ship's weapon list is the most unruly part of the text layer: the books
 set it in two columns, with bullet characters, footnotes and running feet
 in between. Two kinds of rubbish come out of that:

   1. repairable - the name drags ballast along IN FRONT of it
      "Scan 80/2D Search 100/3D Focus 5/4D 6 Dual Turbolaser Cannons"
      (the sensor line has run into the weapon line)

   2. phantom weapons - a line from the PREVIOUS weapon's statblock was read
      as a weapon of its own: "1.7 km", "(Atmosphere)", "5 batteries rear".
      That is how the Gymsnor-2 freighter ended up with two weapons instead
      of one.

 A module of its own, because two tools need the same rules:
 extract-from-pdfs.py while reading the PDFs, and repair-catalogs.py, which
 puts an already generated pdfdata-*.js back in order.
=============================================================================
"""
import re

BULLET_CHARS = '■□▪▫•●◆·'

LIG = {'ﬁ': 'fi', 'ﬂ': 'fl', 'ﬀ': 'ff', '’': "'", '‘': "'", '“': '"', '”': '"',
       '–': '-', '—': '-', ' ': ' ', ' ': ' '}

# Lines from the statblock that were read as weapons of their own. "space"
# only before "Range", or the "Space Mine Layer" would fall through too.
WEAPON_JUNK_FIRST = re.compile(
    # word beginnings - "Atmosph" covers "Atmosphere" as well as the
    # version clipped at the end of a line
    r'^(?:space\s*ran|atmosph|fire\s*control|fire\s*arc|blast\s*radi|auto-?fire'
    # whole words
    r'|(?:damage|scale|crew|ammo|range|skill|batter(?:y|ies)|may)\b)', re.I)

# Fire arc lines with no weapon name at all ("Rear/Left, 2 Rear/Right")
WEAPON_ARCS = re.compile(
    r'^(?:\d+\s+)?(?:front|rear|back|left|right|turret|forward|dorsal|ventral|'
    r'port|starboard)(?:[\s/,]+(?:\d+\s+)?(?:front|rear|back|left|right|turret|'
    r'forward|dorsal|ventral|port|starboard))*\*?\s*$', re.I)

# The source books' running foot ("Galaxy Guide 16: The Old Republic 284")
WEAPON_FOOTER = re.compile(
    r'\b(guide|sourcebook|compendium|anthology|handbook|companion|journal)\b'
    r'[^,]*\s\d{1,3}\s*$', re.I)

# A single adjective is not a weapon name
WEAPON_ADJ = {'heavy', 'light', 'medium', 'twin', 'quad', 'dual', 'double'}

# Words that give away a name clipped at the end of a line: "70 Heavy
# Turbolas", "102 Proton Torp", "Energy Bom"
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
    s = re.sub(r'\[\d+\]', '', s)                     # footnote markers
    return re.sub(r'[ \t]+', ' ', s).strip()


def clean_weapon_name(raw):
    """Clear away the ballast in front of the actual weapon name."""
    n = _clean(raw or '').strip()
    n = n.lstrip(BULLET_CHARS + ' *').strip()
    n = re.sub(r'^.*[%s]\s*' % BULLET_CHARS, '', n)   # running foot + box char
    n = re.sub(r'^[^.]*\bper (?:round|turn)\.\s*', '', n, flags=re.I)
    n = re.sub(r'^.*\bFocus\s*:?\s*\S+\s+(?=[0-9A-Za-z])', '', n, flags=re.I)
    n = re.sub(r'^.*\(pages?\s+[^)]*\)\s*(?=[A-Za-z])', '', n, flags=re.I)
    n = re.sub(r'^\([^)]{0,40}\)\s*(?=[0-9A-Za-z])', '', n)
    n = n.strip()
    # stat values in front of the name: pull out the capitalised phrase at
    # the end ("... 11D if a heavy proton bomb is used. Tractor Beam" ->
    # "Tractor Beam")
    if re.search(r'\dD', n):
        m = re.search(r'([A-Z][A-Za-z-]*(?:\s+[A-Z][A-Za-z-]*){0,3})\s*$', n)
        if m and m.start() > 0 and re.search(r'\dD', n[:m.start()]):
            n = m.group(1)
    if n and n[0].islower():
        n = n[0].upper() + n[1:]
    return n.strip()


def plausible_weapon_name(n):
    """False = a phantom weapon, or a name clipped beyond use."""
    if not n or not re.match(r'[A-Za-z0-9"]', n):
        return False
    if re.search(r'\bkm\b', n, re.I):                 # a range line
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
    # clipped at the end of a line: the last word is only the start of a
    # weapon word ("Turbolas", "Torp", "Bom")
    tail = re.findall(r'[A-Za-z]+', n)
    if tail:
        last = tail[-1].lower()
        if len(last) >= 3 and any(w.startswith(last) and w != last
                                  for w in WEAPON_WORDS):
            return False
    return True


# --------------------------------------------------------- apostrophes
# The text layer likes to put a space after the apostrophe ("Toth' s
# Starfighter", "Warrior' s Armor", "Vua' spar Interdictor"), and .title()
# turns "HOUND'S TOOTH" into "Hound'S Tooth".
#
# An apostrophe at the END of a word, by contrast, is correct - the plural
# possessive: "Kuat Drive Yards' Escort Carrier", "Boss Nass' Custom Bongo".
# So the two halves are only joined when a LOWER case word follows the
# space.
APOS_SPLIT = re.compile(r"([A-Za-z])['’]\s+([a-z])")
APOS_TITLE = re.compile(r"([a-z])['’]S\b")


def fix_apostrophes(n):
    n = APOS_SPLIT.sub(r"\1'\2", n or '')
    return APOS_TITLE.sub(r"\1's", n)


# Separators left at the front when better_name() cuts off one of two
# manufacturers joined by "/" or "-"
# ("Corellian Engineering Corporation/Wereling Spaceworks' Corvette").
def strip_lead_punct(n):
    return (n or '').lstrip("/-–— \t").strip()


def weapon_base_name(n):
    """'2 Pulse Laser Cannons' -> 'Pulse Laser Cannon'
       The count belongs in its own field, not in the name."""
    n = WEAPON_COUNT_RE.sub('', (n or '').strip())
    n = re.sub(r'\s*\([^)]*\)\s*$', '', n).strip()    # "(2 fire-linked)" and the like
    # undo the plural only on the usual weapon words
    n = re.sub(r'\b(%s)\b' % '|'.join(WEAPON_PLURAL),
               lambda m: WEAPON_PLURAL[m.group(1)], n)
    return n.strip()
