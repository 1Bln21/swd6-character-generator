# -*- coding: utf-8 -*-
"""
=============================================================================
 Bring extra ships from a Markdown file into pdfdata-craft.js
=============================================================================

 The maintainer collects further ships from various web sites and files them
 as Markdown (additional Ships.md). Each block is a table cell whose lines
 are separated by "<br />" - the layout varies slightly, because the sources
 differ ("Name:" vs. "Craft:" vs. "Model:", "Hyperdrive:" vs. "Hyperdrive
 Multiplier:", "Space:" vs. "Space Range:").

 This script reads such blocks, brings them into the same shape as the
 entries generated from the PDFs (see extract-from-pdfs.py) and appends them
 to PDF_SHIPS. PDF_SHIP_WEAPONS is rebuilt afterwards, so the new shipboard
 weapons show up in the weapon catalogue too.

 Usage (from the project folder):
     python tools/parse-md-ships.py "path/to/additional Ships.md"

 Without --write it only reports.
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
BOOK = 'Community Additions'          # the origin shown in the pick list
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
    # Copy-and-pasted sources sometimes lose the first letter
    # ("tarfighter" instead of "Starfighter") - so match on a substring too.
    for part, val in (('fighter', 'Starfighter'), ('capital', 'Capital'),
                      ('speeder', 'Speeder'), ('walker', 'Walker'),
                      ('deathstar', 'Death Star'), ('character', 'Character')):
        if part in low:
            return val
    return (s or '').strip()


def dice_pips(s):
    m = re.search(r'(\d+)\s*D\s*(?:\+\s*(\d+))?', s or '')
    return int(m.group(1)) * 3 + int(m.group(2) or 0) if m else 0


def money(s):
    m = re.search(r'([\d][\d,\.]*)', s or '')
    if not m:
        return 0
    num = m.group(1)
    # Remove thousands separators - a comma OR a full stop when exactly
    # three digits follow it ("320.000" European = 320000, "1,500" = 1500).
    # Any remaining full stop (a real decimal point) is cut afterwards.
    num = re.sub(r'[.,](?=\d{3}(?:\D|$))', '', num)
    try:
        return int(num.replace(',', '').split('.')[0])
    except ValueError:
        return 0


# --------------------------------------------------------- reading blocks
def blocks(text):
    """(heading, [lines]) per ship. The heading sits as an ordinary line of
       text above the table cell."""
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
                # undo Markdown escaping: "\|" -> "|", "\&" -> "&" and so on
                seg = re.sub(r'\\([|&\[\]*_~`\\])', r'\1', seg)
                rows.append(seg.strip())
            out.append((heading, rows))
            heading = ''
        elif not line.startswith('additional Ships'):
            heading = line
    return out


FIELD_RE = re.compile(r'^([A-Za-z][A-Za-z /\-]*?)\s*:\s*(.*)$')

# Keywords at which the weapon section begins and ends
WEAPON_START = re.compile(r'^weapons?\s*:?\s*$', re.I)
BODY_START = re.compile(
    r'^(background|description|characteristics|game\s*notes?|game\s*use|'
    r'appearances?|history|role)\b', re.I)


def split_fields(rows):
    """Header fields, sensors, raw weapon lines, and the rest from
       'Background:' onwards."""
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
        # header
        if ln.lower().startswith('sensors'):
            mode = 'head'          # sensors follow as fields of their own
            continue
        if m:
            key, val = m.group(1).strip(), m.group(2).strip()
            if key.lower() in sensor_keys:
                sensors[key.capitalize()] = val
            else:
                head[key] = val
    return head, sensors, weap


# -------------------------------------------------------- reading weapons
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
        # range sub-lines in the Vakbeor style: "- Space: 1-5/15/30"
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
            continue                     # a heading, of no interest
        # otherwise: a new weapon (a name line with no "field:")
        if not m:
            flush()
            cur = {'name': ln, 'arc': '', 'skill': '', 'crew': '',
                   'fireControl': '', 'spaceRange': '', 'atmRange': '',
                   'damage': '', 'scale': ''}
    flush()
    # inherit the scale when the weapon names none of its own
    for w in out:
        if not w.get('scale'):
            w['scale'] = ''
    return out


# ------------------------------------------------------ building the entry
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


# ========================================================== main routine
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
# A ship from the Markdown file is either a CORRECTION (in which case it is
# already in the catalogue - matched by name or craft line) or an ADDITION.
# Corrections overwrite the values of the existing entry but stay in its book
# and era. Additions land under "Community Additions". The matching runs only
# against the ORIGINAL catalogue, so two new variants sharing a craft line
# (the Sphyrna) cannot hit each other.
orig_name, orig_craft = {}, {}
for i, e in enumerate(arr['PDF_SHIPS']):
    orig_name.setdefault(key(e.get('name')), i)
    if e.get('craft'):
        orig_craft.setdefault(key(e.get('craft')), i)

added_names, added, updated, skipped = set(), [], [], []
for e in parsed:
    nk, ck = key(e['name']), key(e['craft'])
    idx = orig_name.get(nk, orig_craft.get(ck, -1))
    if idx >= 0:
        old = arr['PDF_SHIPS'][idx]
        e['book'] = old.get('book') or e['book']     # stays in the original book
        e['era'] = e['era'] or old.get('era', '')
        arr['PDF_SHIPS'][idx] = e
        updated.append(e['name'])
    elif nk in added_names:
        skipped.append(e['name'])
    else:
        added_names.add(nk)
        arr['PDF_SHIPS'].append(e)
        added.append(e)

print('Bloecke gelesen:      %d' % len(parsed))
print('Korrigiert:           %d  %s' % (len(updated), updated))
print('Neu hinzugefuegt:     %d' % len(added))
print('Uebersprungen (schon da): %d  %s' % (len(skipped), skipped))
for e in added:
    print('  + %-32s Scale %-11s Waffen %d'
          % (e['name'][:32], e['scale'], len(e['weapons'])))

# ------------------------ individual fixes from the rulebooks --------------
# Statblocks that run across a page break in the PDFs are occasionally read
# incompletely by the extractor. Filled in here by hand.
#   Corellia Stardrive TT-17R NovaDive Scout (GG16, pp. 271/272): the first
#   weapon was missing its ranges and damage (they sat behind the running
#   head).
fixed_weapons = 0
for e in arr['PDF_SHIPS']:
    if e.get('name') == 'NovaDive' and e.get('weapons'):
        w = e['weapons'][0]
        if not (w.get('damage') or '').strip():
            w['spaceRange'] = '1-5/10/17'
            w['atmRange'] = '100-500/1/1.7 km'
            w['damage'] = '3D'
            fixed_weapons += 1
print('Einzelkorrekturen (Waffen): %d' % fixed_weapons)

before = len(arr['PDF_SHIP_WEAPONS'])
arr['PDF_SHIP_WEAPONS'] = build_weapon_catalog(
    arr['PDF_SHIPS'] + arr['PDF_VEHICLES'])
print('Waffenkatalog: %d -> %d' % (before, len(arr['PDF_SHIP_WEAPONS'])))

if WRITE:
    save_craft(src, arr)
    print('\npdfdata-craft.js written.')
else:
    print('\nDry run - pass --write to write it out.')
