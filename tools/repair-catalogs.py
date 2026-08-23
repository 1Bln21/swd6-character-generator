# -*- coding: utf-8 -*-
"""
=============================================================================
 Put an already generated pdfdata-*.js back in order
=============================================================================

 Normally the catalogues are built out of the PDFs in one go
 (tools/extract-from-pdfs.py). When only the naming rules have been brought
 up to date, a full re-run would be unnecessary - and it assumes every
 source book is to hand. This script applies the same rules (from
 weaponnames.py) to the finished files:

   * clean the weapon names in the ship and vehicle statblocks
   * remove phantom weapons (lines from the previous weapon's statblock)
   * rebuild PDF_SHIP_WEAPONS from the cleaned lists
   * repair names clipped at the start of a line, using the model or craft
     line ("ary Load Lifter" -> "Binary Load Lifter")

 Usage (from the project folder):
     python tools/repair-catalogs.py

 Without --write it only reports what would change.
=============================================================================
"""
import io
import json
import os
import re
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from weaponnames import (clean_weapon_name, plausible_weapon_name,
                         weapon_base_name, fix_apostrophes, strip_lead_punct)

# Manufacturers that better_name() cuts off the "Craft:" line. Where the
# name stands there as a possessive, an "'s Patrol Cruiser" was left over.
LEAD_POSSESSIVE = re.compile(r"^['’]s\b\s*")

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
WRITE = '--write' in sys.argv


def load_arrays(path):
    """'const PDF_SHIPS = [...];' -> {'PDF_SHIPS': [...]} plus the raw text.

       The regex used before, '^const \\w+ = \\[.*\\];$', found only SINGLE-LINE
       arrays. PDF_SHIPS, however, is indented across tens of thousands of
       lines - so it was skipped silently, despite being the largest
       catalogue. Hence searching across the brackets here and remembering
       the exact position along with its formatting, so that writing back
       does not reformat half the file.
    """
    src = io.open(path, encoding='utf-8', newline='').read()
    out, spans = {}, {}
    for m in re.finditer(r'(?:const|var)\s+(\w+)\s*=\s*\[', src):
        name = m.group(1)
        start = src.index('[', m.start())
        depth, i, in_str, esc = 0, start, False, False
        while i < len(src):
            c = src[i]
            if in_str:
                if esc:
                    esc = False
                elif c == '\\':
                    esc = True
                elif c == '"':
                    in_str = False
            elif c == '"':
                in_str = True
            elif c == '[':
                depth += 1
            elif c == ']':
                depth -= 1
                if depth == 0:
                    break
            i += 1
        end = i + 1
        body = src[start:end]
        out[name] = json.loads(body.replace('\r\n', '\n'))
        # multi-line -> write back with indent=1, otherwise compact.
        spans[name] = (start, end, '\n' in body, '\r\n' in body)
    return src, out, spans


# Only these arrays are touched. PDF_ERAS and similar constants sit in the
# same files - they would otherwise be reformatted for no reason.
MANAGED = ('PDF_SHIPS', 'PDF_VEHICLES', 'PDF_SHIP_WEAPONS', 'PDF_WEAPONS_MELEE',
           'PDF_WEAPONS_RANGED', 'PDF_EQUIPMENT', 'PDF_DROIDS')


def save_arrays(path, src, arrays, spans):
    """Replace only the array bodies, each in ITS own formatting."""
    for name in sorted(spans, key=lambda n: -spans[n][0]):     # from the back
        if name not in arrays or name not in MANAGED:
            continue
        start, end, multiline, crlf = spans[name]
        if multiline:
            body = json.dumps(arrays[name], ensure_ascii=False, indent=1)
        else:
            body = json.dumps(arrays[name], ensure_ascii=False, separators=(',', ':'))
        if crlf:
            body = body.replace('\n', '\r\n')
        src = src[:start] + body + src[end:]
    io.open(path, 'w', encoding='utf-8', newline='').write(src)


# Where the original held a picture, the compilations carry the placeholder
# "PICTURE REMOVED" in the text layer. It has turned up in the middle of a
# field value - and once as an entire ship name ("Removed"), because it sat
# directly above a statblock and looked like a heading.
PICTURE = re.compile(r'\s*PICTURE\s+REMOVED\s*', re.I)

def strip_picture(items):
    def walk(obj, where, label):
        for k, v in list(obj.items()):
            if isinstance(v, str) and PICTURE.search(v):
                fixed = PICTURE.sub(' ', v).strip()
                report['picture_stripped'].append('%s.%s: %r -> %r' % (label, k, v, fixed))
                obj[k] = fixed
            elif isinstance(v, dict):
                walk(v, where, '%s.%s' % (label, k))
            elif isinstance(v, list):
                # The placeholder sits inside weapon names too ("PICTURE
                # REMOVED 12 Turbolaser Cannons") - a loop over the header
                # fields alone misses it.
                for n, item in enumerate(v):
                    if isinstance(item, dict):
                        walk(item, where, '%s.%s[%d]' % (label, k, n))
    for e in items:
        walk(e, e, e.get('name') or '?')


# Dice fields sometimes drag the NEXT ship's name along behind them ("1D+1
# Lifeboat", "x12 Nella 330"). Simply cutting everything after the dice value
# would be wrong: "2D (+2 in atmosphere)" and "0D (must follow track)" are
# genuine rules text. So cut only when what follows really is another
# catalogue entry - or one of the known statblock headings.
DICE_FIELDS = ('hull', 'shields', 'maneuver', 'hyper', 'hyperBackup',
               'space', 'atmosphere', 'nav', 'crew', 'consumables', 'cargo')
STRAY_HEADS = re.compile(r'\s+(Sensors?|Weapons?|Shields?|Hull|Maneuverability|'
                         r'Crew|Passengers|Cargo Capacity)\s*:?\s*$', re.I)

def strip_glued_names(items, known):
    for e in items:
        for k in DICE_FIELDS:
            v = e.get(k)
            if not isinstance(v, str) or not v.strip():
                continue
            orig = v
            # Cut statblock headings out of PURE dice fields only. 'crew'
            # and 'cargo' hold real prose, which may well end on the same
            # words ("can support up to 6 total crew").
            if k in ('hull', 'shields', 'maneuver'):
                v = STRAY_HEADS.sub('', v).strip()
            # An appended entry name - the longest match wins, so that
            # "Nella 330 Heavy Scout" is not left half there as "Nella 330".
            for other in sorted(known, key=len, reverse=True):
                if len(other) < 5:
                    continue
                if v.lower().endswith(' ' + other.lower()) and v.lower() != other.lower():
                    v = v[:-(len(other) + 1)].strip()
                    break
            if v != orig:
                report['glued_stripped'].append('%s.%s: %r -> %r' % (e.get('name'), k, orig, v))
                e[k] = v


def rename_placeholder(items):
    """Name entries whose name was nothing but the picture placeholder from
       their craft or type line. With no usable replacement, out it goes."""
    keep = []
    for e in items:
        if (e.get('name') or '').strip().lower() in ('removed', 'picture removed', 'picture'):
            alt = (e.get('type') or '').strip() or (e.get('craft') or '').strip()
            if alt:
                alt = ' '.join(w[0].upper() + w[1:] if w and w[0].islower() else w
                               for w in alt.split())
                report['names_repaired'].append('%s  ->  %s' % (e['name'], alt))
                e['name'] = alt
            else:
                report['entries_dropped'].append(e.get('name'))
                continue
        keep.append(e)
    return keep


def repair_clipped(name, ref):
    """As in extract-from-pdfs.py: the name has lost its start, while the
       model or craft line still carries it in full."""
    if not name or not ref or not name[0].islower():
        return name
    if ref.lower().endswith(name.lower()) and len(ref) > len(name):
        start = len(ref) - len(name)
        while start > 0 and ref[start - 1] not in ' \t-/':
            start -= 1
        return ref[start:].strip() or name
    if ref[1:].lower().startswith(name.lower()):
        return (ref[0] + name).strip()
    first = name.split(' ', 1)[0]
    if len(first) >= 3:
        for w in re.findall(r"[A-Za-z][\w'-]*", ref):
            if len(w) > len(first) and w.lower().endswith(first.lower()):
                return (w + name[len(first):]).strip()
    return name


def tidy_entry_name(n):
    """Take apostrophe damage, a leading separator and the possessive left
       behind by the manufacturer out of an entry name."""
    n = strip_lead_punct((n or '').strip())
    return fix_apostrophes(LEAD_POSSESSIVE.sub('', n)).strip()


def build_weapon_catalog(craft_items):
    """Same weapon, same scale, same damage = one entry. How often a type
       occurs decides the order."""
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


report = {'weapons_repaired': [], 'weapons_dropped': [], 'names_repaired': [],
          'entries_dropped': [], 'picture_stripped': [], 'glued_stripped': []}


def fix_craft(items, ref_key):
    """Clean the weapon lists and repair clipped names. Returns the entries
       whose name is usable afterwards."""
    ok = []
    for e in items:
        kept = []
        for w in e.get('weapons') or []:
            raw = w.get('name') or ''
            n = clean_weapon_name(raw)
            if not plausible_weapon_name(n):
                report['weapons_dropped'].append('%s: %s' % (e.get('name'), raw))
                continue
            n = fix_apostrophes(n)
            if n != raw:
                report['weapons_repaired'].append('%s  ->  %s' % (raw, n))
            w['name'] = n
            kept.append(w)
        if 'weapons' in e:
            e['weapons'] = kept
        fixed = tidy_entry_name(repair_clipped(e.get('name') or '',
                                               e.get(ref_key) or ''))
        if fixed != e.get('name'):
            report['names_repaired'].append('%s  ->  %s' % (e['name'], fixed))
            e['name'] = fixed
        # A ship name starts with a capital. If it stays lower case, the
        # heading is no heading but the tail of a source note - and the
        # entry behind it is clipped throughout.
        if (e.get('name') or ' ')[0].islower():
            report['entries_dropped'].append(e.get('name'))
            continue
        ok.append(e)
    return ok


# --------------------------------------------------------------- ships
craft_path = os.path.join(ROOT, 'pdfdata-craft.js')
craft_src, craft, craft_spans = load_arrays(craft_path)
craft['PDF_SHIPS'] = rename_placeholder(craft['PDF_SHIPS'])
craft['PDF_VEHICLES'] = rename_placeholder(craft['PDF_VEHICLES'])
strip_picture(craft['PDF_SHIPS'])
strip_picture(craft['PDF_VEHICLES'])
# Collect the names only AFTER the placeholders are gone - otherwise
# "Removed" would count as a valid entry name and be cut out of other
# entries' fields.
known_names = set(e.get('name') or '' for e in craft['PDF_SHIPS'] + craft['PDF_VEHICLES'])
strip_glued_names(craft['PDF_SHIPS'], known_names)
strip_glued_names(craft['PDF_VEHICLES'], known_names)
craft['PDF_SHIPS'] = fix_craft(craft['PDF_SHIPS'], 'craft')
craft['PDF_VEHICLES'] = fix_craft(craft['PDF_VEHICLES'], 'craft')
before = len(craft['PDF_SHIP_WEAPONS'])
craft['PDF_SHIP_WEAPONS'] = build_weapon_catalog(
    craft['PDF_SHIPS'] + craft['PDF_VEHICLES'])

# ---------------------------------------------- weapons, equipment, droids
gear_path = os.path.join(ROOT, 'pdfdata-gear.js')
gear_src, gear, gear_spans = load_arrays(gear_path)
for key in ('PDF_WEAPONS_MELEE', 'PDF_WEAPONS_RANGED', 'PDF_EQUIPMENT'):
    for e in gear[key]:
        fixed = tidy_entry_name(repair_clipped(e.get('name') or '',
                                               e.get('model') or ''))
        if fixed != e.get('name'):
            report['names_repaired'].append('%s  ->  %s' % (e['name'], fixed))
            e['name'] = fixed

droid_path = os.path.join(ROOT, 'pdfdata-droids.js')
droid_src, droids, droid_spans = load_arrays(droid_path)
for e in droids['PDF_DROIDS']:
    fixed = tidy_entry_name(repair_clipped(e.get('name') or '',
                                           e.get('type') or ''))
    if fixed != e.get('name'):
        report['names_repaired'].append('%s  ->  %s' % (e['name'], fixed))
        e['name'] = fixed

# -------------------------------------------------------------- report
print('PICTURE REMOVED entfernt:%3d' % len(report['picture_stripped']))
print('angeklebte Namen entfernt:%2d' % len(report['glued_stripped']))
print('Waffennamen repariert: %5d' % len(report['weapons_repaired']))
print('Phantomwaffen entfernt:%5d' % len(report['weapons_dropped']))
print('Eintragsnamen repariert:%4d' % len(report['names_repaired']))
print('Eintraege verworfen:  %5d   %s' % (len(report['entries_dropped']), report['entries_dropped']))
print('Waffenkatalog: %d -> %d Eintraege' % (before, len(craft['PDF_SHIP_WEAPONS'])))
for k in ('picture_stripped', 'glued_stripped', 'names_repaired',
          'weapons_repaired', 'weapons_dropped'):
    print('\n--- %s (erste 40) ---' % k)
    for line in report[k][:40]:
        # The Windows console cannot print the books' box characters
        print('   ' + line.encode('ascii', 'replace').decode('ascii'))

if WRITE:
    save_arrays(craft_path, craft_src, craft, craft_spans)
    save_arrays(gear_path, gear_src, gear, gear_spans)
    save_arrays(droid_path, droid_src, droids, droid_spans)
    print('\nDateien geschrieben.')
else:
    print('\nProbelauf - mit --write werden die Dateien geaendert.')
