# -*- coding: utf-8 -*-
"""
=============================================================================
 Kataloge aus den Fanmade-Regelwerk-PDFs nach pdfdata.js übertragen
=============================================================================

 Liest die "rp_*"-Sammelbände (Waffen, Ausrüstung, Droiden, Raumschiffe,
 Fahrzeuge) und erzeugt daraus Auswahl-Kataloge für die Web-App:

   PDF_WEAPONS_MELEE / PDF_WEAPONS_RANGED  – Waffen für Charaktere/Droiden
   PDF_EQUIPMENT                           – Ausrüstung
   PDF_SHIPS                               – fertige Schiffs-Vorlagen
   PDF_VEHICLES                            – Fahrzeug-Vorlagen
   PDF_DROIDS                              – Droiden-Vorlagen

 Aufruf:
     python tools/extract-from-pdfs.py "Pfad/zum/Ordner/mit/den/PDFs"

 Benötigt: pip install pypdf

 Die PDFs selbst gehören NICHT ins Repository – sie sind Fan-Kompilationen
 der Regelwerke von West End Games. Erzeugt wird ausschließlich die
 Spielwerte-Datei, die die App zur Auswahl anbietet.
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

SRC_DIR = sys.argv[1] if len(sys.argv) > 1 else '.'
OUT = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'pdfdata.js')

FILES = {
    'weapons':   'rp_weapons.pdf',
    'equipment': 'rp_equipment.pdf',
    'droids':    'rp_droids.pdf',
    'ships':     'rp_starships.pdf',
    'vehicles':  'rp_vehicles.pdf',
}

LIG = {'ﬁ': 'fi', 'ﬂ': 'fl', '’': "'", '“': '"', '”': '"',
       '–': '-', '—': '-', ' ': ' '}


def clean(s):
    for a, b in LIG.items():
        s = s.replace(a, b)
    return re.sub(r'[ \t]+', ' ', s).strip()


def pdf_lines(path, skip_pages=0):
    """Alle Zeilen des PDFs, bereinigt und ohne reine Seitenzahlen."""
    reader = pypdf.PdfReader(path)
    out = []
    for pg in range(skip_pages, len(reader.pages)):
        txt = reader.pages[pg].extract_text() or ''
        for ln in txt.split('\n'):
            ln = clean(ln)
            if not ln:
                continue
            if re.fullmatch(r'\d{1,3}', ln):        # Seitenzahl
                continue
            out.append(ln)
    return merge_wrapped(out)


KEY_RE = re.compile(r'^([A-Z][A-Za-z /\.\']{1,28}):\s*(.*)$')


def merge_wrapped(lines):
    """'Atmosphere Range:' mit leerem Wert und Wert erst in der nächsten Zeile
       zu einer Zeile zusammenziehen. Sonst wird der umgebrochene Wert später
       für einen neuen Eintrag (z. B. einen Waffennamen) gehalten."""
    out = []
    for ln in lines:
        m = KEY_RE.match(ln)
        if out:
            prev = KEY_RE.match(out[-1])
            if prev and not prev.group(2) and not m:
                out[-1] = out[-1] + ' ' + ln
                continue
        out.append(ln)
    return out


def parse_blocks(lines, start_key, extra_start=()):
    """Zerlegt in Einträge. Ein Eintrag beginnt bei der Zeile VOR start_key."""
    starts = set([start_key]) | set(extra_start)
    blocks, cur, name = [], None, None
    for idx, ln in enumerate(lines):
        m = KEY_RE.match(ln)
        if m and m.group(1) in starts:
            if cur is not None and name:
                blocks.append((name, cur))
            name = lines[idx - 1] if idx > 0 else ''
            # Namenszeile darf selbst kein "Key:" sein
            if KEY_RE.match(name):
                name = ''
            cur = [ln]
        elif cur is not None:
            cur.append(ln)
    if cur is not None and name:
        blocks.append((name, cur))
    return blocks


def kv(block_lines):
    """Key/Value-Paare mit Fortsetzungszeilen und Reihenfolge."""
    data, order, last = {}, [], None
    for ln in block_lines:
        m = KEY_RE.match(ln)
        if m:
            k, v = m.group(1), m.group(2)
            if k in data:
                data[k] += ' ' + v if v else ''
            else:
                data[k] = v
                order.append(k)
            last = k
        elif last:
            data[last] = (data[last] + ' ' + ln).strip()
    return data, order


def looks_like_name(n):
    if not n or len(n) > 70:
        return False
    if n.lower().startswith(('table of contents', 'index', 'chapter')):
        return False
    return True


def money(s):
    """'1,000 (includes ...)' -> 1000 ; nicht bezifferbar -> 0"""
    if not s:
        return 0
    m = re.search(r'([\d][\d,\.]*)', s.replace('.', '.'))
    if not m:
        return 0
    try:
        return int(float(m.group(1).replace(',', '')))
    except ValueError:
        return 0


def dice_pips(s):
    """'4D+2' -> 14 Pips; '2D' -> 6"""
    if not s:
        return 0
    m = re.search(r'(\d+)\s*D\s*(?:\+\s*(\d+))?', s)
    if not m:
        return 0
    return int(m.group(1)) * 3 + int(m.group(2) or 0)


# ---------------------------------------------------------------- Waffen
def parse_weapons(path):
    lines = pdf_lines(path, skip_pages=6)
    melee, ranged = [], []
    for name, blk in parse_blocks(lines, 'Model'):
        if not looks_like_name(name):
            continue
        d, _ = kv(blk)
        typ = d.get('Type', '')
        dmg = d.get('Damage', '')
        entry = {
            'name': name,
            'model': d.get('Model', ''),
            'type': typ,
            'scale': d.get('Scale', 'Character'),
            'skill': d.get('Skill', ''),
            'cost': money(d.get('Cost', '')),
            'costText': d.get('Cost', ''),
            'avail': d.get('Availability', ''),
            'diff': d.get('Difficulty', ''),
            'damage': dmg,
            'ammo': d.get('Ammo', ''),
            'rof': d.get('Rate of Fire', ''),
            'range': d.get('Range', ''),
            'notes': d.get('Game Notes', ''),
            'source': d.get('Source', ''),
        }
        is_melee = ('STR+' in dmg.upper().replace(' ', '')) or \
                   re.search(r'melee|blade|sword|knife|club|axe|pike|staff|whip|lightsaber',
                             (typ + ' ' + d.get('Skill', '')).lower()) is not None
        (melee if is_melee else ranged).append(entry)
    return melee, ranged


# ------------------------------------------------------------ Ausrüstung
def parse_equipment(path):
    lines = pdf_lines(path, skip_pages=6)
    out = []
    for name, blk in parse_blocks(lines, 'Model'):
        if not looks_like_name(name):
            continue
        d, _ = kv(blk)
        out.append({
            'name': name,
            'model': d.get('Model', ''),
            'type': d.get('Type', ''),
            'cost': money(d.get('Cost', '')),
            'costText': d.get('Cost', ''),
            'avail': d.get('Availability', ''),
            'skill': d.get('Skill', ''),
            'notes': d.get('Game Notes', ''),
            'source': d.get('Source', ''),
        })
    return out


# ------------------------------------------------- Schiffe und Fahrzeuge
WEAPON_KEYS = {'Fire Arc', 'Fire Control', 'Space Range', 'Atmosphere Range',
               'Damage', 'Crew', 'Skill', 'Scale', 'Rate of Fire', 'Ammo'}


def parse_craft(path, kind):
    lines = pdf_lines(path, skip_pages=6)
    out = []
    for name, blk in parse_blocks(lines, 'Craft'):
        if not looks_like_name(name):
            continue
        # Kopfdaten bis "Weapons:" bzw. "Sensors:"
        head, weap_lines, sens_lines = [], [], []
        mode = 'head'
        for ln in blk:
            m = KEY_RE.match(ln)
            k = m.group(1) if m else None
            if k == 'Weapons':
                mode = 'weapons'
                rest = m.group(2)
                if rest:
                    weap_lines.append(rest)
                continue
            if k == 'Sensors':
                mode = 'sensors'
                continue
            if mode == 'head':
                head.append(ln)
            elif mode == 'sensors':
                if k in ('Passive', 'Scan', 'Search', 'Focus'):
                    sens_lines.append(ln)
                else:
                    mode = 'weapons' if k in WEAPON_KEYS or k is None else 'head'
                    (weap_lines if mode == 'weapons' else head).append(ln)
            else:
                weap_lines.append(ln)
        d, _ = kv(head)
        sd, _ = kv(sens_lines)

        # Waffen: Blöcke, die mit einer Nicht-Key-Zeile (Waffenname) beginnen
        weapons, cur, wname = [], None, None
        for ln in weap_lines:
            m = KEY_RE.match(ln)
            if not m:
                if cur and wname:
                    weapons.append((wname, cur))
                wname, cur = ln, []
            elif cur is not None:
                cur.append(ln)
        if cur and wname:
            weapons.append((wname, cur))
        wl = []
        for wn, wb in weapons:
            wd, _ = kv(wb)
            wl.append({
                'name': wn, 'arc': wd.get('Fire Arc', ''), 'skill': wd.get('Skill', ''),
                'crew': wd.get('Crew', ''), 'fireControl': wd.get('Fire Control', ''),
                'spaceRange': wd.get('Space Range', ''), 'atmRange': wd.get('Atmosphere Range', ''),
                'damage': wd.get('Damage', ''), 'scale': wd.get('Scale', ''),
            })

        entry = {
            'name': name,
            'craft': d.get('Craft', ''),
            'type': d.get('Type', ''),
            'scale': d.get('Scale', ''),
            'length': d.get('Length', ''),
            'skill': d.get('Skill', ''),
            'crew': d.get('Crew', ''),
            'crewSkill': d.get('Crew Skill', ''),
            'passengers': d.get('Passengers', ''),
            'cargo': d.get('Cargo Capacity', ''),
            'consumables': d.get('Consumables', ''),
            'cost': money(d.get('Cost', '')),
            'costText': d.get('Cost', ''),
            'hyper': d.get('Hyperdrive Multiplier', '') or d.get('Hyperdrive', ''),
            'hyperBackup': d.get('Hyperdrive Backup', '') or d.get('Backup Hyperdrive', ''),
            'nav': d.get('Nav Computer', ''),
            'maneuver': d.get('Maneuverability', ''),
            'space': d.get('Space', ''),
            'atmosphere': d.get('Atmosphere', ''),
            'hull': d.get('Hull', '') or d.get('Body Strength', ''),
            'shields': d.get('Shields', ''),
            'move': d.get('Move', ''),
            'cover': d.get('Cover', ''),
            'era': d.get('Era', ''),
            'affiliation': d.get('Affiliation', ''),
            'source': d.get('Source', ''),
            'notes': d.get('Game Notes', ''),
            'sensors': {k: sd.get(k, '') for k in ('Passive', 'Scan', 'Search', 'Focus')},
            'weapons': wl,
            'kind': kind,
        }
        # Pips für die direkte Übernahme in den Generator
        entry['hullPips'] = dice_pips(entry['hull'])
        entry['shieldPips'] = dice_pips(entry['shields'])
        entry['maneuverPips'] = dice_pips(entry['maneuver'])
        out.append(entry)
    return out


# ------------------------------------------------------------- Droiden
ATTR_RE = re.compile(r'^(DEXTERITY|KNOWLEDGE|MECHANICAL|PERCEPTION|STRENGTH|TECHNICAL)\s+(\d+D(?:\+\d)?)',
                     re.I)


def parse_droids(path):
    lines = pdf_lines(path, skip_pages=6)
    out = []
    for name, blk in parse_blocks(lines, 'Type'):
        if not looks_like_name(name):
            continue
        # Nur echte Droiden-Statblöcke (mind. ein Attribut wie "DEXTERITY 2D")
        if not any(ATTR_RE.match(x) for x in blk):
            continue
        attrs, skills, equip = {}, [], []
        mode = None
        for ln in blk:
            am = ATTR_RE.match(ln)
            if am:
                attrs[am.group(1).lower()[:3]] = dice_pips(am.group(2))
                mode = 'skills'
                rest = ln[am.end():].strip()
                if rest:
                    skills.append(rest)
                continue
            m = KEY_RE.match(ln)
            if m and m.group(1) in ('Equipped With', 'Equipped with'):
                mode = 'equip'
                if m.group(2):
                    equip.append(m.group(2))
                continue
            if m and m.group(1) in ('Move', 'Size', 'Cost', 'Availability', 'Source', 'Type'):
                mode = None
                continue
            if mode == 'skills':
                skills.append(ln)
            elif mode == 'equip':
                equip.append(ln.lstrip('-').strip())
        d, _ = kv(blk)
        out.append({
            'name': name,
            'type': d.get('Type', ''),
            'attrs': attrs,
            'skills': [s for s in skills if s],
            'equipped': [e for e in equip if e],
            'move': d.get('Move', ''),
            'size': d.get('Size', ''),
            'cost': money(d.get('Cost', '')),
            'costText': d.get('Cost', ''),
            'avail': d.get('Availability', ''),
            'source': d.get('Source', ''),
        })
    return out


# ================================================================= Ablauf
def path_for(key):
    p = os.path.join(SRC_DIR, FILES[key])
    return p if os.path.isfile(p) else None


result = {}
melee = ranged = []
p = path_for('weapons')
if p:
    melee, ranged = parse_weapons(p)
p = path_for('equipment')
equipment = parse_equipment(p) if p else []
p = path_for('ships')
ships = parse_craft(p, 'ship') if p else []
p = path_for('vehicles')
vehicles = parse_craft(p, 'vehicle') if p else []
p = path_for('droids')
droids = parse_droids(p) if p else []


def dedupe(items):
    seen, out = set(), []
    for it in items:
        k = it['name'].lower()
        if k in seen:
            continue
        seen.add(k)
        out.append(it)
    return out


melee, ranged = dedupe(melee), dedupe(ranged)
equipment, ships, vehicles, droids = map(dedupe, (equipment, ships, vehicles, droids))

"""Ausgabe aufgeteilt, damit jede Seite nur lädt, was sie braucht:
     pdfdata-gear.js   – Waffen + Ausrüstung   (Charakter- und Droidenseite)
     pdfdata-craft.js  – Schiffe + Fahrzeuge   (Schiffsseite)
     pdfdata-droids.js – Droiden-Vorlagen      (Droidenseite)"""
APPDIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
HEAD = ('// Automatisch erzeugt aus den Fanmade-Sammelbaenden (rp_*.pdf)\n'
        '// Quelle: Star Wars D6 (West End Games), zusammengetragen von der Fan-Community.\n'
        '// Nicht von Hand bearbeiten - stattdessen tools/extract-from-pdfs.py laufen lassen.\n')

def write_file(fname, pairs):
    p = os.path.join(APPDIR, fname)
    with open(p, 'w', encoding='utf-8') as f:
        f.write(HEAD)
        for var, data in pairs:
            f.write('const %s = ' % var)
            json.dump(data, f, ensure_ascii=False, separators=(',', ':'))
            f.write(';\n')
    return os.path.getsize(p) / 1024

kb_gear = write_file('pdfdata-gear.js', [('PDF_WEAPONS_MELEE', melee),
                                         ('PDF_WEAPONS_RANGED', ranged),
                                         ('PDF_EQUIPMENT', equipment)])
kb_craft = write_file('pdfdata-craft.js', [('PDF_SHIPS', ships), ('PDF_VEHICLES', vehicles)])
kb_droid = write_file('pdfdata-droids.js', [('PDF_DROIDS', droids)])
if os.path.isfile(OUT):
    os.remove(OUT)      # alte Sammeldatei entfernen

print('--- Zusammenfassung ---')
print(f'  Nahkampfwaffen:  {len(melee)}')
print(f'  Fernkampfwaffen: {len(ranged)}')
print(f'  Ausruestung:     {len(equipment)}')
print(f'  Raumschiffe:     {len(ships)}')
print(f'  Fahrzeuge:       {len(vehicles)}')
print(f'  Droiden:         {len(droids)}')
print(f'  pdfdata-gear.js   {kb_gear:6.0f} KB')
print(f'  pdfdata-craft.js  {kb_craft:6.0f} KB')
print(f'  pdfdata-droids.js {kb_droid:6.0f} KB')
