# -*- coding: utf-8 -*-
"""
=============================================================================
 Zusaetzliche Schiffe aus einer Markdown-Datei in pdfdata-craft.js einpflegen
=============================================================================

 Der Nutzer sammelt weitere Schiffe von verschiedenen Webseiten und legt sie
 als Markdown ab (additional Ships.md). Jeder Block ist eine Tabellenzelle,
 deren Zeilen mit "<br />" getrennt sind - der Aufbau schwankt leicht, weil
 die Quellen unterschiedlich sind ("Name:" vs. "Craft:" vs. "Model:",
 "Hyperdrive:" vs. "Hyperdrive Multiplier:", "Space:" vs. "Space Range:").

 Dieses Skript liest solche Bloecke, bringt sie in dasselbe Format wie die
 aus den PDFs erzeugten Eintraege (siehe extract-from-pdfs.py) und haengt sie
 an PDF_SHIPS an. PDF_SHIP_WEAPONS wird danach neu aufgebaut, damit die neuen
 Bordwaffen auch im Waffen-Katalog auftauchen.

 Aufruf (aus dem Projektordner):
     python tools/parse-md-ships.py "Pfad/zur/additional Ships.md"

 Ohne --write nur Bericht.
=============================================================================
"""
import io
import json
import os
import re
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from weaponnames import (clean_weapon_name, plausible_weapon_name,
                         weapon_base_name, fix_apostrophes)

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BOOK = 'Community Additions'          # Herkunft in der Auswahlliste
WRITE = '--write' in sys.argv
args = [a for a in sys.argv[1:] if not a.startswith('--')]
MD = args[0] if args else os.path.join(
    os.path.expanduser('~'), 'OneDrive', 'Desktop', 'Swd6gen pdfs',
    'additional Ships.md')

SCALES = ['Death Star', 'Capital', 'Starfighter', 'Speeder', 'Walker',
          'Character']


def norm_scale(s):
    low = re.sub(r'[^a-z]', '', (s or '').lower())
    table = {'deathstar': 'Death Star', 'capital': 'Capital',
             'starfighter': 'Starfighter', 'starship': 'Starfighter',
             'speeder': 'Speeder', 'walker': 'Walker',
             'character': 'Character'}
    for pre, val in table.items():
        if low.startswith(pre):
            return val
    return (s or '').strip()


def dice_pips(s):
    m = re.search(r'(\d+)\s*D\s*(?:\+\s*(\d+))?', s or '')
    return int(m.group(1)) * 3 + int(m.group(2) or 0) if m else 0


def money(s):
    m = re.search(r'([\d][\d,\.]*)', s or '')
    if not m:
        return 0
    try:
        return int(m.group(1).replace(',', '').split('.')[0])
    except ValueError:
        return 0


# ------------------------------------------------------- Bloecke einlesen
def blocks(text):
    """(Ueberschrift, [Zeilen]) je Schiff. Die Ueberschrift steht als
       normale Textzeile ueber der Tabellenzelle."""
    out = []
    heading = ''
    for raw in text.splitlines():
        line = raw.strip()
        if not line:
            continue
        if line.startswith('|-'):
            continue
        if line.startswith('|'):
            cell = line.strip('|').strip()
            rows = []
            for seg in re.split(r'<br\s*/?>', cell):
                # Markdown-Maskierungen aufheben: "\|" -> "|", "\&" -> "&" usw.
                seg = re.sub(r'\\([|&\[\]*_~`\\])', r'\1', seg)
                rows.append(seg.strip())
            out.append((heading, rows))
            heading = ''
        elif not line.startswith('additional Ships'):
            heading = line
    return out


FIELD_RE = re.compile(r'^([A-Za-z][A-Za-z /\-]*?)\s*:\s*(.*)$')

# Schluesselwoerter, an denen die Waffen-Sektion beginnt bzw. endet
WEAPON_START = re.compile(r'^weapons?\s*:?\s*$', re.I)
BODY_START = re.compile(
    r'^(background|description|characteristics|game\s*notes?|game\s*use|'
    r'appearances?|history|role)\b', re.I)


def split_fields(rows):
    """Kopf-Felder, Sensoren, rohe Waffenzeilen, Rest ab 'Background:'."""
    head, sensors, weap = {}, {}, []
    mode = 'head'
    sensor_keys = ('passive', 'scan', 'search', 'focus')
    for ln in rows:
        low = ln.lower()
        if WEAPON_START.match(ln):
            mode = 'weap'
            continue
        if BODY_START.match(ln):
            mode = 'body'
            continue
        if mode == 'body':
            continue
        m = FIELD_RE.match(ln)
        if mode == 'weap':
            weap.append(ln)
            continue
        # Kopf
        if ln.lower().startswith('sensors'):
            mode = 'head'          # Sensoren folgen als eigene Felder
            continue
        if m:
            key, val = m.group(1).strip(), m.group(2).strip()
            if key.lower() in sensor_keys:
                sensors[key.capitalize()] = val
            else:
                head[key] = val
    return head, sensors, weap


# ------------------------------------------------------- Waffen einlesen
WEAP_FIELD = {
    'fire arc': 'arc', 'arc': 'arc',
    'fire control': 'fireControl',
    'crew': 'crew', 'skill': 'skill', 'scale': 'scale',
    'space': 'spaceRange', 'space range': 'spaceRange',
    'atmosphere': 'atmRange', 'atmosphere range': 'atmRange',
    'damage': 'damage',
}


def parse_weapons(lines, ship_scale):
    out, cur = [], None

    def flush():
        if cur and cur.get('name'):
            nm = clean_weapon_name(cur['name'])
            if plausible_weapon_name(nm):
                cur['name'] = nm
                cur.setdefault('scale', '')
                out.append(cur)

    for ln in lines:
        if not ln:
            continue
        m = FIELD_RE.match(ln)
        # Reichweiten-Unterzeilen im Vakbeor-Stil: "– Space: 1-5/15/30"
        sub = re.match(r'^[\-–]\s*(space|atmosphere)[^:]*:\s*(.*)$', ln, re.I)
        if sub:
            if cur is not None:
                key = 'spaceRange' if sub.group(1).lower() == 'space' else 'atmRange'
                cur[key] = sub.group(2).strip()
            continue
        if m and cur is not None and m.group(1).strip().lower() in WEAP_FIELD:
            field = WEAP_FIELD[m.group(1).strip().lower()]
            val = m.group(2).strip()
            if field == 'scale':
                val = norm_scale(val)
            cur[field] = val
            continue
        if m and m.group(1).strip().lower() in ('range', 'rate of fire',
                                                'ammo', 'blast radius'):
            continue                     # Kopfzeile / uninteressant
        # sonst: neue Waffe (Namenszeile ohne "Feld:")
        if not m:
            flush()
            cur = {'name': ln, 'arc': '', 'skill': '', 'crew': '',
                   'fireControl': '', 'spaceRange': '', 'atmRange': '',
                   'damage': '', 'scale': ''}
    flush()
    # Skala erben, wenn die Waffe keine eigene nennt
    for w in out:
        if not w.get('scale'):
            w['scale'] = ''
    return out


# --------------------------------------------------------- Eintrag bauen
def get(head, *keys):
    for k in keys:
        for hk in head:
            if hk.lower() == k.lower():
                return head[hk].strip()
    return ''


def build(heading, rows):
    head, sensors, weap_lines = split_fields(rows)
    craft = get(head, 'Name', 'Craft', 'Model') or heading
    name = fix_apostrophes((heading or craft).strip())
    scale = norm_scale(get(head, 'Scale')) or 'Capital'
    hyper = get(head, 'Hyperdrive Multiplier', 'Hyperdrive')
    entry = {
        'name': name,
        'craft': craft,
        'type': get(head, 'Type'),
        'scale': scale,
        'length': get(head, 'Length'),
        'skill': get(head, 'Skill'),
        'crew': get(head, 'Crew'),
        'crewSkill': get(head, 'Crew Skill'),
        'passengers': get(head, 'Passengers'),
        'cargo': get(head, 'Cargo Capacity', 'Cargo'),
        'consumables': get(head, 'Consumables'),
        'cost': money(get(head, 'Cost')),
        'costText': get(head, 'Cost'),
        'hyper': hyper,
        'hyperBackup': get(head, 'Hyperdrive Backup'),
        'nav': get(head, 'Nav Computer'),
        'maneuver': get(head, 'Maneuverability'),
        'space': get(head, 'Space'),
        'atmosphere': get(head, 'Atmosphere'),
        'hull': get(head, 'Hull'),
        'shields': get(head, 'Shields'),
        'move': '',
        'cover': '',
        'affiliation': '',
        'source': '',
        'notes': '',
        'sensors': {
            'Passive': sensors.get('Passive', ''),
            'Scan': sensors.get('Scan', ''),
            'Search': sensors.get('Search', ''),
            'Focus': sensors.get('Focus', ''),
        },
        'weapons': parse_weapons(weap_lines, scale),
        'kind': 'ship',
        'hullPips': dice_pips(get(head, 'Hull')),
        'shieldPips': dice_pips(get(head, 'Shields')),
        'maneuverPips': dice_pips(get(head, 'Maneuverability')),
        'book': BOOK,
        'era': '',
    }
    return entry


# ================================================================ Ablauf
def load_craft():
    src = io.open(os.path.join(ROOT, 'pdfdata-craft.js'), encoding='utf-8').read()
    arr = {m.group(1): json.loads(m.group(2))
           for m in re.finditer(r'^(?:const|var)\s+(\w+)\s*=\s*(\[.*\]);\s*$',
                                src, re.M)}
    return src, arr


def build_weapon_catalog(craft_items):
    seen = {}
    for e in craft_items:
        for w in e.get('weapons', []):
            name = weapon_base_name(w.get('name', ''))
            dmg = (w.get('damage') or '').strip()
            scale = (w.get('scale') or '').strip() or (e.get('scale') or '').strip()
            if not name or len(name) < 4 or not dmg:
                continue
            if not re.match(r'^\d{1,2}D', dmg):
                continue
            if not plausible_weapon_name(name):
                continue
            key = (re.sub(r'[^a-z0-9]', '', name.lower()), scale, dmg)
            hit = seen.get(key)
            if hit:
                hit['count'] += 1
                continue
            seen[key] = {
                'name': name, 'scale': scale, 'damage': dmg,
                'fireControl': (w.get('fireControl') or '').strip(),
                'arc': (w.get('arc') or '').strip(),
                'skill': (w.get('skill') or '').strip(),
                'crew': (w.get('crew') or '').strip(),
                'spaceRange': (w.get('spaceRange') or '').strip(),
                'atmRange': (w.get('atmRange') or '').strip(),
                'book': e.get('book', ''), 'count': 1,
            }
    return sorted(seen.values(), key=lambda x: (-x['count'], x['name'].lower()))


def save_craft(src, arr):
    def repl(m):
        name = m.group('name')
        if name not in arr:
            return m.group(0)
        body = json.dumps(arr[name], ensure_ascii=False, separators=(',', ':'))
        return '%s %s = %s;' % (m.group('kw'), name, body)
    new = re.sub(r'^(?P<kw>const|var)\s+(?P<name>\w+)\s*=\s*\[.*\];\s*$',
                 repl, src, flags=re.M)
    io.open(os.path.join(ROOT, 'pdfdata-craft.js'), 'w',
            encoding='utf-8', newline='\n').write(new)


text = io.open(MD, encoding='utf-8').read()
parsed = [build(h, r) for h, r in blocks(text) if r and any(':' in x for x in r)]
parsed = [e for e in parsed if e['name'] and (e['hull'] or e['weapons'])]

def key(s):
    return re.sub(r'[^a-z0-9]', '', (s or '').lower())


src, arr = load_craft()
# Gegen vorhandene Schiffe wird ueber Name UND Craft-Zeile abgeglichen, damit
# schon enthaltene Schiffe (MC75, Quasar Fire, Gozanti ...) nicht doppelt
# landen. Unter den Neuzugaengen zaehlt nur der Name: die beiden Sphyrna-
# Varianten teilen sich dieselbe Craft-Zeile, sind aber verschiedene Schiffe.
existing = set()
for e in arr['PDF_SHIPS']:
    existing.add(key(e.get('name')))
    existing.add(key(e.get('craft')))
added_names, added, skipped = set(), [], []
for e in parsed:
    nk, ck = key(e['name']), key(e['craft'])
    if nk in existing or ck in existing or nk in added_names:
        skipped.append(e['name'])
        continue
    added_names.add(nk)
    arr['PDF_SHIPS'].append(e)
    added.append(e)

print('Bloecke gelesen:      %d' % len(parsed))
print('Neu hinzugefuegt:     %d' % len(added))
print('Uebersprungen (schon da): %d  %s' % (len(skipped), skipped))
for e in added:
    print('  + %-32s Scale %-11s Waffen %d'
          % (e['name'][:32], e['scale'], len(e['weapons'])))

before = len(arr['PDF_SHIP_WEAPONS'])
arr['PDF_SHIP_WEAPONS'] = build_weapon_catalog(
    arr['PDF_SHIPS'] + arr['PDF_VEHICLES'])
print('Waffenkatalog: %d -> %d' % (before, len(arr['PDF_SHIP_WEAPONS'])))

if WRITE:
    save_craft(src, arr)
    print('\npdfdata-craft.js geschrieben.')
else:
    print('\nProbelauf - mit --write wird geschrieben.')
