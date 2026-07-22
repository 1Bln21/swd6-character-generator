# -*- coding: utf-8 -*-
"""
=============================================================================
 Zusaetzliche Spezies aus den Regelwerken nach pdfdata-species.js uebertragen
=============================================================================

 Liest den Fanmade-Sammelband "rp_aliens.pdf" sowie einzelne Textdateien im
 gleichen Aufbau (siehe unten) und erzeugt daraus PDF_SPECIES - Spezies, die
 im Excel-Generator von Chance Gibboney noch nicht enthalten sind.

 Aufruf:
     python tools/extract-species.py DATEI_ODER_ORDNER [...]

 Benoetigt: pip install pypdf


 ---------------------------------------------------------------------------
 Warum "offset" umgerechnet wird
 ---------------------------------------------------------------------------
 Der Sammelband nennt die Attributwuerfel nach der 2. Edition (Basis 12D fuer
 Menschen). Der Excel-Generator - und damit diese App - rechnet nach
 "Revised & Expanded" mit der Basis 18D. Zwischen beiden liegen konstant 6D.

 Die App bildet den Attributpool als  54 Pips + offset  ab. Also gilt:

     offset = Attributwuerfel_des_Buches_in_Pips + 18 - 54
            = Attributwuerfel_in_Pips - 36

 Gegenprobe an Spezies, die in beiden Quellen stehen (Buch -> Excel-offset):
     Aqualish  12D -> 0     Falleen 13D -> +3     Gamorrean 11D -> -3
     Hutt      14D -> +6    Noghri  16D -> +12    Twi'lek   11D -> -3
 Alle stimmen. Einzige Abweichung im Excel ist der Toydarianer, dem der Autor
 2D mehr gegeben hat als die Formel ergibt - bestehende Spezies werden hier
 aber ohnehin nicht angefasst.


 ---------------------------------------------------------------------------
 Erwarteter Aufbau eines Eintrags
 ---------------------------------------------------------------------------
     <Name>                       (oder "Name: <Name>" in Textdateien)
     Home Planet: Ando            (optional)
     Attribute Dice: 12D
     DEXTERITY 2D/4D              (oder "Dex: 2D/4D")
     KNOWLEDGE 1D/3D
     MECHANICAL 1D+2/3D+2
     PERCEPTION 2D/4D
     STRENGTH 2D/4D+2
     TECHNICAL 1D+2/3D
     Special Abilities:           (optional)
         <Titel>: <Text>
     Story Factors:               (optional)
         <Titel>: <Text>
     Move: 10/12
     Size: 1.6-1.8 meters tall
     Source: ...                  (optional)
=============================================================================
"""
import json
import os
import re
import sys

try:
    import pypdf
except ImportError:
    sys.exit('Bitte zuerst installieren:  pip install pypdf')

APPDIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ARGS = sys.argv[1:] or ['.']

LIG = {'ﬁ': 'fi', 'ﬂ': 'fl', 'ﬀ': 'ff', '’': "'", '‘': "'", '“': '"', '”': '"',
       '–': '-', '—': '-', ' ': ' ', ' ': ' '}

# Reihenfolge wie in data.js: DEX, KNOW, MECH, PERC, STR, TECH
ATTR_ORDER = ['DEXTERITY', 'KNOWLEDGE', 'MECHANICAL', 'PERCEPTION', 'STRENGTH', 'TECHNICAL']
ATTR_ALIAS = {'DEX': 'DEXTERITY', 'KNOW': 'KNOWLEDGE', 'KNO': 'KNOWLEDGE',
              'MECH': 'MECHANICAL', 'MEC': 'MECHANICAL', 'PERC': 'PERCEPTION',
              'PER': 'PERCEPTION', 'STR': 'STRENGTH', 'TECH': 'TECHNICAL',
              'TEC': 'TECHNICAL'}

DICE = r'\d+D(?:\s*\+\s*\d)?'
ATTR_RE = re.compile(r'^(%s)\s*:?\s+(%s)\s*/\s*(%s)\s*$'
                     % ('|'.join(ATTR_ORDER + list(ATTR_ALIAS)), DICE, DICE), re.I)
DICE_LINE = re.compile(r'^Attribute Dice\s*:\s*(%s)' % DICE, re.I)
SECTION_RE = re.compile(r'^(Special Abilities|Story Factors)\s*:?\s*$', re.I)
ENTRY_RE = re.compile(r'^([A-Z][^:]{1,60}):\s*(.*)$')


# Einzelne Eintraege stehen im Buch unter einem Namen, der ausserhalb seines
# Kapitels nicht mehr verstaendlich ist: Kasten eines Volkes oder ein ueber
# zwei Zeilen umbrochener Name. Automatisch laesst sich das nicht zuverlaessig
# zusammenfuehren - der Versuch, die Zeile darueber anzuhaengen, verschmilzt
# reihenweise benachbarte Arten ("Dulok" + "Duros"). Deshalb hier von Hand.
RENAME = {
    'Worker': 'Geonosian Worker',
    'Aristocrat': 'Geonosian Aristocrat',
    'Warrior': 'Charon Warrior',
}


def clean(s):
    for a, b in LIG.items():
        s = s.replace(a, b)
    return re.sub(r'[ \t]+', ' ', s).strip()


def pips(d):
    m = re.match(r'(\d+)\s*D(?:\s*\+\s*(\d))?', (d or '').strip(), re.I)
    return int(m.group(1)) * 3 + int(m.group(2) or 0) if m else 0


def read_lines(path):
    if path.lower().endswith('.pdf'):
        reader = pypdf.PdfReader(path)
        raw = []
        for pg in reader.pages:
            try:
                raw += (pg.extract_text() or '').split('\n')
            except Exception:
                continue
    else:
        with open(path, encoding='utf-8', errors='replace') as f:
            raw = f.read().split('\n')
    out = []
    for ln in raw:
        ln = clean(ln)
        if ln and not re.fullmatch(r'\d{1,3}', ln):     # Seitenzahlen weg
            out.append(ln)
    return out


def looks_like_species_name(n):
    """Der Name steht als eigene Zeile ueber dem Block. Bei zweispaltigem
       Satz landet dort gelegentlich das Ende eines Fliesstextes aus der
       Nachbarspalte - solche Zeilen sind an Kleinschreibung, Satzzeichen
       oder Laenge zu erkennen."""
    if not n or len(n) > 34:
        return False
    if n[-1] in '.,;:':
        return False
    if not n[0].isupper():
        return False
    if len(n.split()) > 5:
        return False
    return bool(re.search(r'[A-Za-z]{2}', n))


def parse_size(text):
    """'1.6-1.9 meters tall' -> (1.6, 1.9);  '4 meters tall on average' -> (4, 4)
       Nur der Teil vor 'meters' zaehlt, sonst zieht '2.5 meters diameter'
       die Koerpergroesse mit hoch."""
    head = re.split(r'meters?', text, 1)[0]
    nums = re.findall(r'\d+(?:\.\d+)?', head) or re.findall(r'\d+(?:\.\d+)?', text)
    if not nums:
        return 0.0, 0.0
    lo = float(nums[0])
    hi = float(nums[1]) if len(nums) > 1 else lo
    return (lo, hi) if hi >= lo else (lo, lo)


def join_wrapped(a, b):
    """Fortsetzungszeile anhaengen; Trennstrich am Zeilenende zusammenziehen."""
    a = a.rstrip()
    if a.endswith('-') and not a.endswith(' -'):
        return a + b.lstrip()
    return (a + ' ' + b).strip()


def parse(lines, source_label):
    """Alle Spezies-Bloecke einer Quelle."""
    out = []
    i = 0
    while i < len(lines):
        dm = DICE_LINE.match(lines[i])
        if not dm:
            i += 1
            continue

        # --- Name: eine oder zwei Zeilen vorher (dazwischen "Home Planet:") ---
        name, planet = '', ''
        for back in (1, 2, 3, 4, 5):
            if i - back < 0:
                break
            cand = lines[i - back]
            pm = re.match(r'^Home Planet\s*:\s*(.+)$', cand, re.I)
            if pm:
                planet = pm.group(1).strip()
                continue
            nm = re.match(r'^Name\s*:\s*(.+)$', cand, re.I)
            if nm:
                name = nm.group(1).strip()
                break
            # Fliesstext ueberspringen und weiter nach oben suchen
            if not ENTRY_RE.match(cand) and looks_like_species_name(cand):
                name = cand.strip()
                break
        if not name:
            i += 1
            continue
        name = RENAME.get(name, name)

        attr_dice = pips(dm.group(1))
        mins = [0] * 6
        maxs = [0] * 6
        found = 0
        abilities, story = [], []
        move, hmin, hmax, src_page = 0, 0.0, 0.0, ''
        section = None
        cur = None

        j = i + 1
        while j < len(lines):
            ln = lines[j]

            # Naechste Spezies beginnt -> Block zu Ende
            if DICE_LINE.match(ln):
                break

            am = ATTR_RE.match(ln)
            if am:
                key = am.group(1).upper()
                key = ATTR_ALIAS.get(key, key)
                if key in ATTR_ORDER:
                    idx = ATTR_ORDER.index(key)
                    mins[idx] = pips(am.group(2))
                    maxs[idx] = pips(am.group(3))
                    found += 1
                cur = None
                j += 1
                continue

            sm = SECTION_RE.match(ln)
            if sm:
                section = 'abilities' if sm.group(1).lower().startswith('special') else 'story'
                cur = None
                j += 1
                continue

            mm = re.match(r'^Move\s*:\s*(\d+)', ln, re.I)
            if mm:
                move = int(mm.group(1))
                section, cur = None, None
                j += 1
                continue

            zm = re.match(r'^Size\s*:\s*(.+)$', ln, re.I)
            if zm:
                hmin, hmax = parse_size(zm.group(1))
                section, cur = None, None
                j += 1
                continue

            pm = re.match(r'^Source\s*:\s*(.+)$', ln, re.I)
            if pm:
                src_page = pm.group(1).strip()
                section, cur = None, None
                j += 1
                continue

            if re.match(r'^(Home Planet|Description|Skin Colour|Skin Color)\s*:', ln, re.I):
                section, cur = None, None
                j += 1
                continue

            if section:
                em = ENTRY_RE.match(ln)
                if em and em.group(2) != '':
                    cur = em.group(0)
                    (abilities if section == 'abilities' else story).append(cur)
                elif cur is not None:
                    lst = abilities if section == 'abilities' else story
                    lst[-1] = join_wrapped(lst[-1], ln)
            j += 1

        # Nur vollstaendige Bloecke uebernehmen
        if found == 6 and move:
            out.append({
                'name': name,
                'min': mins,
                'max': maxs,
                'move': move,
                # 54 + offset ist der Attributpool der App; siehe Kopfkommentar
                'offset': attr_dice - 36,
                'free': 54 + (attr_dice - 36) - sum(mins),
                'hMin': hmin,
                'hMax': hmax,
                'planet': planet,
                'page': src_page,
                'abilities': abilities,
                'story': story,
                'skillImprove': [],
                'bonusSkills': [],
                'armorP': 0,
                'armorE': 0,
                'book': source_label,
            })
        i = j if j > i else i + 1
    return out


# ------------------------------------------------- bereits vorhandene Namen
def existing_names():
    p = os.path.join(APPDIR, 'data.js')
    s = open(p, encoding='utf-8').read()
    data = json.loads(s[s.index('{'):s.rindex('};') + 1])
    return {norm(x['name']) for x in data['species']}


def norm(n):
    """Fuer den Dublettenabgleich: Gross/Klein, Apostrophe, die im Fandom
       uneinheitliche Schreibweise (Wookiee/Wookie) und die Mehrzahl
       angleichen - das Excel fuehrt einige Voelker im Plural
       ("Baragwins", "Toydarians"), der Sammelband im Singular."""
    n = re.sub(r"[^a-z]", '', n.lower())
    n = re.sub(r'(.)\1+', r'\1', n)          # doppelte Buchstaben zusammenziehen
    return n.rstrip('s')


# ================================================================== Ablauf
files = []
for a in ARGS:
    if os.path.isdir(a):
        for dirpath, _d, names in os.walk(a):
            for n in names:
                if n.lower().endswith(('.pdf', '.txt')):
                    files.append(os.path.join(dirpath, n))
    elif os.path.isfile(a):
        files.append(a)

have = existing_names()
found_all, per_file = [], []
for path in files:
    label = os.path.splitext(os.path.basename(path))[0]
    if label.startswith('rp_aliens'):
        label = 'Alien Compendium'
    try:
        got = parse(read_lines(path), label)
    except Exception as e:
        per_file.append((os.path.basename(path), 'FEHLER: %s' % e, 0, 0))
        continue
    neu = [g for g in got if norm(g['name']) not in have]
    for g in neu:
        have.add(norm(g['name']))
    found_all += neu
    per_file.append((os.path.basename(path), '', len(got), len(neu)))

found_all.sort(key=lambda x: x['name'].lower())

OUT = os.path.join(APPDIR, 'pdfdata-species.js')
with open(OUT, 'w', encoding='utf-8') as f:
    f.write('// Automatisch erzeugt aus den Regelwerken (rp_aliens.pdf u. a.).\n'
            '// Nur Spezies, die im Excel-Generator noch fehlen.\n'
            '// Nicht von Hand bearbeiten - stattdessen tools/extract-species.py laufen lassen.\n')
    f.write('const PDF_SPECIES = ')
    json.dump(found_all, f, ensure_ascii=False, separators=(',', ':'))
    f.write(';\n')

print('--- Gelesene Dateien ---')
for name, err, ganz, neu in per_file:
    if err:
        print('  %-34s %s' % (name[:34], err))
    else:
        print('  %-34s gefunden: %4d   davon neu: %4d' % (name[:34], ganz, neu))
print('--- Ergebnis ---')
print('  Neue Spezies:      %d' % len(found_all))
print('  Bereits im Excel:  %d' % len(existing_names()))
print('  pdfdata-species.js %.0f KB' % (os.path.getsize(OUT) / 1024))
ohne_max = [g['name'] for g in found_all if any(m == 0 for m in g['max'])]
if ohne_max:
    print('  Ohne Hoechstwerte (bitte pruefen): %s' % ', '.join(ohne_max[:10]))
