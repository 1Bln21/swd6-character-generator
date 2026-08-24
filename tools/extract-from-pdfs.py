# -*- coding: utf-8 -*-
"""
=============================================================================
 Carry the catalogues out of the rulebook PDFs into pdfdata-*.js
=============================================================================

 Reads the fan-made compilations ("rp_*") plus a number of other source
 books and builds the pick lists the web app offers:

   PDF_WEAPONS_MELEE / PDF_WEAPONS_RANGED  - weapons for characters/droids
   PDF_EQUIPMENT                           - equipment
   PDF_SHIPS                               - ready-made ship templates
   PDF_VEHICLES                            - vehicle templates
   PDF_DROIDS                              - droid templates

 Every entry also carries its source book ("book") and era ("era"), so the
 app can filter on them.

 Usage:
     python tools/extract-from-pdfs.py FOLDER [FOLDER ...]

 The folders are searched recursively for the file names listed in SOURCES.
 A missing file is skipped and reported at the end.

 Requires: pip install pypdf

 Recommended: pdftotext from the poppler utilities. If it is on the PATH it
 is preferred over the built-in reader, because it keeps the two text
 columns of the books apart, while pypdf reads every page straight across
 both columns and cuts the statblocks to pieces ("Craft: Rot h" instead of
 "Craft: Rothana Heavy Engineering All-Terrain Tactical Enforcer"). Without
 poppler everything still runs, only with fewer and partly mangled entries.

 The PDFs themselves do NOT belong in the repository - they are rulebooks
 and fan compilations by West End Games. All that is generated here is the
 game-values file the app offers for selection.
=============================================================================
"""
import json
import os
import re
import subprocess
import sys

try:
    import pypdf
except ImportError:
    sys.exit('Bitte zuerst installieren:  pip install pypdf')

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
# Weapon names out of the statblocks - repair-catalogs.py needs the same
# rules, so they live in a module of their own.
from weaponnames import (clean_weapon_name, plausible_weapon_name,   # noqa: E402
                         weapon_base_name, fix_apostrophes, strip_lead_punct,
                         WEAPON_COUNT_RE, WEAPON_PLURAL)

SRC_DIRS = sys.argv[1:] or ['.']

# ---------------------------------------------------------------- sources
# kinds: which parsers are turned loose on the book
# ocr:   the book is a scan - its OCR often reads "D" as "0"
# skip:  skip this many leading pages (table of contents)
ERA_OLD, ERA_RISE = 'old-republic', 'rise-empire'
ERA_REB, ERA_NEW = 'rebellion', 'new-republic'

SOURCES = [
    # file                                     short name             era       kinds                              ocr    skip
    ('rp_weapons.pdf',                         'Weapons Compendium',  '',       ('weapons',),                      False, 6),
    ('rp_equipment.pdf',                       'Equipment Compendium', '',      ('equipment',),                    False, 6),
    ('rp_droids.pdf',                          'Droid Compendium',    '',       ('droids',),                       False, 6),
    ('rp_starships.pdf',                       'Starship Compendium', '',       ('ships',),                        False, 6),
    ('rp_vehicles.pdf',                        'Vehicle Compendium',  '',       ('vehicles',),                     False, 6),

    ('GG16_The_Old_Republic.pdf',              'GG16 Old Republic',   ERA_OLD,  ('weapons', 'equipment', 'ships',
                                                                                 'vehicles', 'droids'),            False, 0),
    ('CECCompendium.pdf',                      'CEC Compendium',      '',       ('ships', 'vehicles'),             False, 0),
    ('Starships_and_Speeders_D6_conversions.pdf', 'Starships & Speeders', '',   ('ships', 'vehicles'),             False, 0),
    ('WEG40071 - Dark Empire - Sourcebook.pdf', 'Dark Empire',        ERA_NEW,  ('ships', 'vehicles', 'droids'),   False, 0),

    ('RP_SagaConversion_Knights_of_the_Old_Republic_Campaign_Guide.pdf',
                                               'KotOR Campaign Guide', ERA_OLD, ('weapons', 'equipment', 'ships',
                                                                                 'vehicles', 'droids'),            False, 0),
    ('RP_SagaConversion_The_Clone_Wars_Campaign_Guide.pdf',
                                               'Clone Wars Guide',    ERA_RISE, ('weapons', 'equipment', 'ships',
                                                                                 'vehicles', 'droids'),            False, 0),
    ('RP_SagaConversion_Rebellion_Era_Campaign_Guide.pdf',
                                               'Rebellion Era Guide', ERA_REB,  ('weapons', 'equipment', 'ships',
                                                                                 'vehicles', 'droids'),            False, 0),
    ('RP_SagaConversion_Legacy_Era_Campaign_Guide.pdf',
                                               'Legacy Era Guide',    ERA_NEW,  ('weapons', 'equipment', 'ships',
                                                                                 'vehicles', 'droids'),            False, 0),
    ('RP_SagaConversion_Starships_of_the_Galaxy_Saga_Edition.pdf',
                                               'Starships of the Galaxy', '',   ('ships', 'vehicles'),             False, 0),
    ("RP_SagaConversion_Scavenger's_Guide_to_Droids.pdf",
                                               "Scavenger's Guide to Droids", '', ('droids', 'equipment'),         False, 0),
    # Mostly droid accessories - grasping arms, saws, sensors, holo
    # projectors - which the droid generator offers as equipment.
    ("WEG40116 - Cynabar's Fantastic Technology - Droids.pdf",
                                               "Cynabar's Droids",    '',       ('equipment', 'droids'),           False, 0),
]

# ------------------------------------------------- Deliberately left out
# These books exist only as scans. Their text layer is either missing
# altogether or so damaged that ship names arrive as "R.eekeene's
# R.etribution" or "ITI5J;fi1:i1~~1T1". That is damage done by the OCR
# itself and no amount of post-processing saves it - a few dozen mangled
# entries would only dilute the catalogues.
#
# To include them anyway, first put the PDFs through a proper OCR pass
# (ocrmypdf with tesseract, say) and then list them here:
#
#   ('WEG40150 - Stock Ships.pdf', 'Stock Ships', ERA_REB, ('ships',), True, 0),
#   ('WEG40095 - Galaxy Guide 6 - Trampfreighters.pdf', ...)
#   ('WEG40025 - Galladiniums Fantastic Technology.pdf', ...)   # no text layer at all
#   ('WEG40143 - Pirates & Privateers.pdf', ...)                # no text layer at all
#
# The modification rules from Galaxy Guide 6 are already maintained by hand
# in shiprules.js - the PDF is not needed for them.

LIG = {'ﬁ': 'fi', 'ﬂ': 'fl', 'ﬀ': 'ff', '’': "'", '‘': "'", '“': '"', '”': '"',
       '–': '-', '—': '-', ' ': ' ', ' ': ' '}

# Bullet characters the books use to introduce their statblocks
BULLET_CHARS = '■□▪▫•●◆·'

# Depending on the book, the OCR turns that little square into an 'm',
# 'mi', 'w', 's' or '@'. It may only be dropped as a token of its own
# BEFORE the name - stripped as a character class, "interceptor" loses its
# i and "modifications" its m.
OCR_BULLET = re.compile(r'^(?:mi|m|w|s|a|@|\|)\s+(?=\S)')


def clean(s):
    for a, b in LIG.items():
        s = s.replace(a, b)
    s = re.sub(r'\[\d+\]', '', s)                 # footnote markers
    # Where an illustration was stripped from the PDF the books leave a
    # "PICTURE REMOVED" placeholder. Sitting in the neighbouring column it
    # ends up glued to the line beside it - the YZ-900 arrived as "Corellian
    # Engineering Corporation YZ-900 Transport PICTURE".
    # Matched in capitals only: a container train whose cargo balls "are
    # removed" is describing itself, the placeholder always shouts.
    s = re.sub(r'\s*\bPICTURE\b\s*', ' ', s, flags=re.I)
    s = re.sub(r'\s*\bREMOVED\b\s*', ' ', s)
    return re.sub(r'[ \t]+', ' ', s).strip()


def strip_bullet(name):
    """'■ Azalus-Class Dreadnought' -> 'Azalus-Class Dreadnought'
       'mi Sensor Decoys'          -> 'Sensor Decoys'
       'interceptor'               -> 'interceptor'  (left alone)"""
    n = name.lstrip(BULLET_CHARS + ' ').strip()
    n = OCR_BULLET.sub('', n).strip()
    return n or name.strip()


def repair_clipped(name, ref):
    """Sometimes only the name line loses its start while the model line
       survives intact:
         'anta Droid Subfighter' + 'Haor Chall Engineering Manta Droid Subfighter'
         -> 'Manta Droid Subfighter'
       Only applied when the name really is the clipped tail of the model
       line - otherwise something like 'x1 Hyperdrive' would not survive."""
    if not name or not ref or not name[0].islower():
        return name
    if ref.lower().endswith(name.lower()) and len(ref) > len(name):
        start = len(ref) - len(name)
        while start > 0 and ref[start - 1] not in ' \t-/':
            start -= 1
        return ref[start:].strip() or name
    # Only a single letter is missing: 'oroSuub "Firelance"' next to
    # 'SoroSuub "Firelance" Blaster Rifle'
    if ref[1:].lower().startswith(name.lower()):
        return (ref[0] + name).strip()
    # The first word is the tail of a word from the model line:
    # 'ary Load Lifter' + 'Cybot Galactica CLL-6 Binary Load Lifter ...'
    #   -> 'Binary Load Lifter'
    first = name.split(' ', 1)[0]
    if len(first) >= 3:
        for w in re.findall(r"[A-Za-z][\w'-]*", ref):
            if len(w) > len(first) and w.lower().endswith(first.lower()):
                return (w + name[len(first):]).strip()
    return name


def tidy_name(n):
    """Some books set their headings all lower case or all upper case.
       That reads badly in a pick list - but only touch it when the casing
       really is uniform, so model designations like 'YT-1300' or 'TIE/ln'
       survive."""
    letters = [c for c in n if c.isalpha()]
    if letters and all(c.islower() for c in letters):
        n = n.title()
    elif letters and all(c.isupper() for c in letters) and len(n) > 5:
        n = n.title()
    # Clear away a leading separator (from two manufacturers joined by "/")
    # and the possessive the manufacturer left behind ("Corporation's Patrol
    # Cruiser" -> after cutting the maker, "'s Patrol Cruiser").
    n = strip_lead_punct(n)
    n = re.sub(r"^['’]s\b\s*", '', n).strip()
    # .title() also capitalises the letter after an apostrophe:
    # "HOUND'S TOOTH" -> "Hound'S Tooth"
    return fix_apostrophes(n)


# ------------------------------------------------------------ OCR repair
# Scanned books regularly read the die symbol "D" as a "0":
#   'Hull: 40'  ->  'Hull: 4D'      'Passive: 10/00' -> 'Passive: 10/0D'
# So only apply this to fields that always carry dice in the D6 system.
DICE_KEYS = {'Hull', 'Shields', 'Maneuverability', 'Fire Control', 'Damage',
             'Body Strength', 'Passive', 'Scan', 'Search', 'Focus'}
OCR_LETTER = {'l': '1', 'I': '1', 'O': '0', 'S': '5'}


def ocr_dice(val):
    """'40' -> '4D', '3D+l' -> '3D+1', '10/00' -> '10/0D'"""
    def fix_token(tok):
        # 'xD' already read correctly: only smooth out digit/letter swaps
        if re.fullmatch(r'\d+D(\+[\dlI])?', tok):
            return ''.join(OCR_LETTER.get(c, c) if c not in 'D+' else c for c in tok)
        # plain number with a trailing 0 -> dice, pips included ('30+' -> '3D+')
        m = re.fullmatch(r'([1-9]\d?)0(\+)?', tok)
        if m:
            return m.group(1) + 'D' + (m.group(2) or '')
        if tok == '00':
            return '0D'
        return tok
    return re.sub(r'[0-9A-Za-z+]+', lambda m: fix_token(m.group(0)), val)


KEY_RE = re.compile(r'^([A-Z][A-Za-z /\.\']{1,28}):\s*(.*)$')


def split_columns(page, min_lines=6):
    """Split a page into its columns and return them in reading order.

       The books are set in two columns. pypdf reads such a page line by
       line straight across both of them and cuts every statblock to pieces
       - "Craft: Rothana Heavy Engineering All-Terrain Tactical Enforcer"
       came out as "Craft: Rot h". pdftotext -layout, by contrast, keeps the
       horizontal position of the words, which is what makes the columns
       separable here.

       There is often no gutter that is empty all the way down: sometimes
       only two blanks stand between the columns, and headings run straight
       across. So what is looked for is the position in the middle region
       that would cut through the fewest lines. Lines that still straddle it
       stay unsplit in the left half."""
    lines = [z.rstrip() for z in page.split('\n')]
    full = [z for z in lines if z.strip()]
    if len(full) < min_lines:
        return lines
    width = max((len(z) for z in lines), default=0)
    if width < 40:
        return lines

    def cuts(p):
        return sum(1 for z in lines
                   if len(z) > p and z[p] != ' ' and z[max(0, p - 1)] != ' ')

    lo, hi = int(width * 0.3), int(width * 0.7)
    if hi <= lo:
        return lines
    p = min(range(lo, hi), key=cuts)
    if cuts(p) > len(full) * 0.12:
        return lines
    left, right = [], []
    for z in lines:
        if len(z) > p and z[p] != ' ' and z[max(0, p - 1)] != ' ':
            left.append(z.rstrip())
            right.append('')
        else:
            left.append(z[:p].rstrip())
            right.append(z[p:].rstrip())
    if sum(1 for z in left if z.strip()) < min_lines or \
       sum(1 for z in right if z.strip()) < min_lines:
        return lines
    return split_columns('\n'.join(left)) + [''] + split_columns('\n'.join(right))


def pdf_pages(path, skip_pages=0):
    """Pages as text. Prefers pdftotext (poppler) because it keeps the
       columns apart; without poppler it falls back to pypdf."""
    try:
        cmd = ['pdftotext', '-layout', '-enc', 'UTF-8',
               '-f', str(skip_pages + 1), path, '-']
        res = subprocess.run(cmd, check=True, capture_output=True, timeout=900)
        pages = res.stdout.decode('utf-8', 'replace').split('\f')
        return ['\n'.join(split_columns(pg)) for pg in pages]
    except (OSError, subprocess.SubprocessError):
        reader = pypdf.PdfReader(path)
        out = []
        for pg in range(skip_pages, len(reader.pages)):
            try:
                out.append(reader.pages[pg].extract_text() or '')
            except Exception:
                out.append('')
        return out


def pdf_lines(path, skip_pages=0, ocr=False):
    """Every line of the PDF, cleaned up and without bare page numbers."""
    out = []
    for txt in pdf_pages(path, skip_pages):
        for ln in txt.split('\n'):
            ln = clean(ln)
            if not ln:
                continue
            if re.fullmatch(r'\d{1,3}', ln):        # page number
                continue
            if ocr:
                m = KEY_RE.match(ln)
                if m and m.group(1) in DICE_KEYS:
                    ln = m.group(1) + ': ' + ocr_dice(m.group(2))
            out.append(ln)
    return merge_wrapped(out)


def merge_wrapped(lines):
    """Pull an 'Atmosphere Range:' whose value only arrives on the next line
       back onto one line. Otherwise the wrapped value is later taken for a
       new entry (a weapon name, say)."""
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


def join_wrapped(a, b):
    """Append a continuation line. If the first ends on a hyphen, the word
       belongs together ('Azalus-' + 'class' -> 'Azalus-class')."""
    a = a.rstrip()
    if a.endswith('-'):
        return a + b.lstrip()
    return (a + ' ' + b).strip()


def is_continuation(ln):
    """Headings often carry an explanatory aside in brackets that runs over
       several lines:

           R2-D2 (Artoo-Detoo)
           (as of the Battle of Yavin - as of the Jedi Academy
           Trilogy)
           Type: Industrial Automaton R2-D2 Astromech Droid

       The line right above "Type:" is then "Trilogy)" - useless as a name.
       Such continuations show up as unbalanced brackets."""
    ln = ln.strip()
    if not ln:
        return True
    if ln.startswith('('):
        return True
    return ln.count(')') > ln.count('(')


def find_name(lines, idx):
    """Walk upwards from the line above the statblock until one turns up
       that works as a heading. At most four lines - above that, the prose of
       the previous entry begins."""
    for back in range(1, 5):
        if idx - back < 0:
            break
        cand = lines[idx - back]
        if KEY_RE.match(cand):          # a "Key: value" is never the name
            break
        if is_continuation(cand):
            continue
        return cand
    return lines[idx - 1] if idx > 0 else ''


def parse_blocks(lines, start_key, extra_start=()):
    """Split into entries. An entry starts at the line BEFORE start_key."""
    starts = set([start_key]) | set(extra_start)
    blocks, cur, name = [], None, None
    for idx, ln in enumerate(lines):
        m = KEY_RE.match(ln)
        if m and m.group(1) in starts:
            if cur is not None and name:
                blocks.append((name, cur))
            name = find_name(lines, idx)
            # the name line must not itself be a "Key:"
            if KEY_RE.match(name):
                name = ''
            name = tidy_name(strip_bullet(name))
            cur = [ln]
        elif cur is not None:
            cur.append(ln)
    if cur is not None and name:
        blocks.append((name, cur))
    return blocks


# Only the genuine box symbols. BULLETS also holds 'm' and 'i' for botched
# OCR - that would be too coarse here and would cut off every continuation
# line starting with "many" or "in".
NEXT_ENTRY = '■□▪▫•●◆'


def kv(block_lines):
    """Key/value pairs, keeping continuation lines and their order."""
    data, order, last = {}, [], None
    for ln in block_lines:
        # If the next entry already starts here, the line no longer belongs
        # to the last value - otherwise its name ends up in the "Game Notes".
        if ln[:1] in NEXT_ENTRY:
            last = None
            continue
        m = KEY_RE.match(ln)
        if m:
            k, v = m.group(1), m.group(2)
            if k in data:
                data[k] = join_wrapped(data[k], v) if v else data[k]
            else:
                data[k] = v
                order.append(k)
            last = k
        elif last:
            data[last] = join_wrapped(data[last], ln)
    return data, order


def looks_like_name(n):
    if not n or len(n) > 70:
        return False
    low = n.lower()
    if low.startswith(('table of contents', 'index', 'chapter', 'appendix')):
        return False
    # Weed out bare chapter/running heads with no letters in them
    if not re.search(r'[A-Za-z]{3}', n):
        return False
    # Deck plan legends ("23. Storage/Cargo Hold") sit right in front of
    # the statblock in the scanned books and would otherwise be the name.
    if re.match(r'^\d+\s*[\.\)]', n):
        return False
    return True


# ------------------------------------------------------- plausibility
# Two-column scans mix prose into the statblocks. Entries like that are
# useless and would dilute the catalogue - better to drop them.
# A dice value may be qualified - "2D (+2 in atmosphere)" and "1D+2 (dovin
# basal)" are both things the books actually print. Only what does not
# begin with a dice code at all is rejected: then the parser caught prose
# instead of a statblock.
DICE_LEAD = re.compile(r'^\d{1,2}\s*D(\s*\+\s*\d)?\b')
MAXLEN = {'type': 120, 'scale': 40, 'length': 60, 'crew': 140, 'cargo': 90,
          'consumables': 70, 'space': 60, 'atmosphere': 90, 'move': 70,
          'hull': 70, 'shields': 70, 'maneuver': 70}


def plausible_craft(e):
    if damaged(e):
        return False
    # A ship name starts with a capital. If it is still lower case after
    # repair_clipped, the heading is no heading at all - for the "Unstable
    # Terrain Artillery Transport" it held the tail of a source note
    # ("ebsite, The Clone Wars"), and the whole entry was clipped line by
    # line.
    if (e.get('name') or ' ')[0].islower():
        return False
    for k in ('hull', 'shields', 'maneuver'):
        v = (e.get(k) or '').strip()
        if v and not DICE_LEAD.match(v):
            return False
    return True


# ------------------------------------------------------- improving names
# Some books put the class in the heading and name the model only in the
# "Craft:" line - the CEC Compendium, for one, lists the HT-2200 as a plain
# "Medium Freighter". In a pick list that is worthless: you read the type,
# not the ship. Names like that are replaced from "Craft:", dropping the
# manufacturer at the front.
GENRE_ONLY = re.compile(
    r'^(the\s+)?((light|medium|heavy|small|large|armed|advanced|modified|bulk|assault|'
    r'auxiliary|escort|patrol|attack|battle|strike|troop|cargo|passenger|utility|'
    r'diplomatic|drone|republic|imperial|star|space)\s+)*'
    r'(freighter|transport|shuttle|fighter|starfighter|cruiser|yacht|barge|hauler|'
    r'scout|bomber|gunship|corvette|frigate|speeder|walker|tank|carrier|dreadnought|'
    r'destroyer|ship|craft|vessel)s?$', re.I)

MAKERS = (
    'Corellian Engineering Corporation', 'Corellian Engineering Corp.',
    'Corellian Engineering', 'Sienar Fleet Systems', 'Sienar Fleet',
    'Republic Sienar Systems', 'Kuat Drive Yards\'', 'Kuat Drive Yards',
    'Kuat Systems Engineering', 'Kuat Drive', 'Republic Engineering Corporation',
    'Republic Engineering', 'Rendili StarDrive\'s', 'Rendili StarDrive',
    'Dromund Kalakar Shipyard', 'Dromund Kalakar', 'Slayn & Korpil',
    'Mon Calamari', 'Bespin Motors', 'Incom Corporation', 'Koensayr',
    'Telgorn Corp', 'Hoersch-Kessel Drive', 'Ubrikkian Industries', 'Ubrikkian',
    'SoroSuub Corporation', 'SoroSuub', 'MandalMotors', 'Loronar', 'Incom',
)


def better_name(name, craft):
    """'Medium Freighter' + 'Corellian Engineering Corporation HT-2200'
       -> 'HT-2200'.   With no usable craft line the name stays as it is."""
    if not craft or not GENRE_ONLY.match(name.strip()):
        return name
    rest = craft.strip()
    for m in MAKERS:
        if rest.lower().startswith(m.lower()):
            # clear separators including "/" - some ships name two makers
            # ("... Corporation/Wereling Spaceworks' Corvette").
            rest = rest[len(m):].strip(" -–/")
            break
    # "Modified ..." says more than the bare class does
    if not rest or GENRE_ONLY.match(rest):
        rest = craft.strip()
    return rest if rest else name


# ---------------------------------------------------------- weapon names
def looks_like_continuation(prev, ln):
    """Is ln a continuation of the previous line rather than a new weapon?

    In two-column typesetting both weapon names and long values wrap:

        Fire Arc: Turret (can
        be fixed to forward to be fired by the Pilot at only
        1D fire control)

    Without this check every following line would count as the next weapon
    - which is where entries like "gunnery", "km" or "controlled fire)"
    came from.
    """
    if not ln:
        return True
    if ln[0].islower():                       # the sentence carries on
        return True
    if ln.count(')') > ln.count('('):         # closing bracket with no opening
        return True
    if prev and prev.count('(') > prev.count(')'):   # bracket still open
        return True
    return False


def clean_weapons(weapons):
    """Captions ("PICTURE REMOVED") and scraps of prose that end up in the
       block as a weapon name do not belong in the weapon list."""
    out = []
    for w in weapons:
        n = clean_weapon_name(w.get('name') or '')
        if not plausible_weapon_name(n):
            continue
        w['name'] = n
        # Weapon names often carry an explanatory aside in brackets
        # ("2 Proton Torpedo Launchers (fire separately, 12 torpedoes each)"
        # is 63 characters). The limit is only there to fend off whole
        # paragraphs of prose - hence the generous value.
        if not n or len(n) > 95:
            continue
        if n.endswith('.') or n.upper() == n and len(n) > 4 and not re.search(r'\d', n):
            # sentences end on a full stop; all caps with no digit is
            # nearly always a caption ("PICTURE REMOVED")
            if n.endswith('.') or n in ('REMOVED', 'PICTURE REMOVED'):
                continue
        if not re.search(r'[A-Za-z]', n):
            continue
        # A weapon always brings values with it. Blocks sometimes run on,
        # because the book follows them with prose instead of a new
        # "Craft:" - then whole paragraphs land in the entry as "weapons"
        # (that is how the Basilisk War Droid got to 157). With neither a
        # damage value nor a fire arc it is not a weapon.
        if not re.search(r'\d+\s*D', w.get('damage') or '') and not (w.get('arc') or '').strip():
            continue
        out.append(w)
    return out


def trim_fields(e):
    """Two-column books occasionally let text from the neighbouring column
       run into a field. The front part is right, the rest gets cut."""
    for k, lim in MAXLEN.items():
        if e.get(k) and len(e[k]) > lim:
            e[k] = cap(e[k], lim)
    return e


# In some two-column books the text extraction loses the first character
# of a line: "Type:" becomes "ype:", "Scale:" becomes "cale:". An entry
# where that shows up is damaged throughout - its name included ("spo Riot
# Gu" instead of "Espo Riot Gun"). Not repairable, so drop it.
TRUNCATED_KEY = re.compile(r'(?:^|\s)(ype|cale|kill|otes|amage|odel|vail|ost):')
CITATION = re.compile(r'\(page|Campaign Guide|Sourcebook \(', re.I)


def damaged(e):
    text = ' '.join(str(v) for v in e.values() if isinstance(v, str))
    # Check the weapon list too: on ships the damage to the text layer
    # often sits there ("amage: D/5D/4D/3D" instead of "Damage: 6D/5D/4D/
    # 3D") while the header still looks clean.
    for w in e.get('weapons') or []:
        text += ' ' + ' '.join(str(v) for v in w.values() if isinstance(v, str))
    return bool(TRUNCATED_KEY.search(text)) or bool(CITATION.search(e.get('name', '')))


def plausible_gear(e):
    if damaged(e):
        return False
    for k, lim in (('type', 120), ('scale', 40), ('skill', 90), ('avail', 40)):
        if len(e.get(k) or '') > lim:
            return False
    return True


def money(s):
    """'1,000 (includes ...)' -> 1000 ; anything unnumberable -> 0"""
    if not s:
        return 0
    m = re.search(r'([\d][\d,\.]*)', s)
    if not m:
        return 0
    try:
        val = int(float(m.group(1).replace(',', '')))
    except ValueError:
        return 0
    if re.search(r'million', s, re.I):
        val *= 1000000
    return val


# The books write the scale inconsistently, and the line break likes to
# clip it: "Starfigh", "Starfghter", "Chara", "Capital (due to power
# output)". Older volumes say "Starship" where 2nd Edition says
# "Starfighter". Map all of it onto the rulebook's six classes.
SCALE_PREFIX = (('char', 'Character'), ('spee', 'Speeder'), ('sped', 'Speeder'),
                ('airspee', 'Speeder'), ('walk', 'Walker'),
                ('vehic', 'Speeder'),          # "Vehicle scale" = speeder scale
                ('starf', 'Starfighter'), ('stars', 'Starfighter'),
                ('strafi', 'Starfighter'),     # transposed letters in the typesetting
                ('fight', 'Starfighter'),
                ('capit', 'Capital'), ('cpit', 'Capital'),
                ('death', 'Death Star'))


def norm_scale(s):
    low = re.sub(r'[^a-z]', '', (s or '').lower())
    if not low:
        return ''
    for pre, val in SCALE_PREFIX:
        if low.startswith(pre):
            return val
    return (s or '').strip()


def dice_pips(s):
    """'4D+2' -> 14 pips; '2D' -> 6"""
    if not s:
        return 0
    m = re.search(r'(\d+)\s*D\s*(?:\+\s*(\d+))?', s)
    if not m:
        return 0
    return int(m.group(1)) * 3 + int(m.group(2) or 0)


# The books name the era in various ways - map them onto fixed keys
ERA_WORDS = [
    (r'old republic|kotor|knights of the old|cold war|great galactic war', ERA_OLD),
    (r'rise of the empire|clone wars|prequel', ERA_RISE),
    (r'rebellion|galactic civil war|classic', ERA_REB),
    (r'new republic|legacy|new jedi order|dark empire', ERA_NEW),
]


def norm_era(raw, default):
    low = (raw or '').lower()
    for pat, key in ERA_WORDS:
        if re.search(pat, low):
            return key
    return default


REJECTED = {}          # book -> number of entries dropped


def reject(src):
    REJECTED[src.book] = REJECTED.get(src.book, 0) + 1


def cap(s, n=600):
    """Shorten long rules text. The full version is in the book - the app
       needs only enough for the entry to make sense."""
    s = (s or '').strip()
    return s if len(s) <= n else s[:n].rstrip() + ' […]'


def tag(entry, src, d):
    """Add book and era. If the PDF names an era itself, it wins over the
       book's default."""
    entry['book'] = src.book
    entry['era'] = norm_era(d.get('Era', ''), src.era)
    if d.get('Source') and not entry.get('source'):
        entry['source'] = d['Source']
    return entry


# --------------------------------------------------------------- weapons
def parse_weapons(lines, src):
    melee, ranged = [], []
    for name, blk in parse_blocks(lines, 'Model'):
        if not looks_like_name(name):
            continue
        d, _ = kv(blk)
        typ = d.get('Type', '')
        dmg = d.get('Damage', '')
        # equipment without a damage value has no place in the weapon list
        if not dmg and not d.get('Skill'):
            continue
        entry = {
            'name': tidy_name(repair_clipped(name, d.get('Model', ''))),
            'model': d.get('Model', ''),
            'type': typ,
            'scale': norm_scale(d.get('Scale', '')) or 'Character',
            'skill': d.get('Skill', ''),
            'cost': money(d.get('Cost', '')),
            'costText': d.get('Cost', ''),
            'avail': d.get('Availability', ''),
            'diff': d.get('Difficulty', ''),
            'damage': dmg,
            'ammo': d.get('Ammo', ''),
            'rof': d.get('Rate of Fire', ''),
            'range': d.get('Range', ''),
            'notes': cap(d.get('Game Notes', '')),
            'source': d.get('Source', ''),
        }
        if not plausible_gear(entry):
            reject(src)
            continue
        is_melee = ('STR+' in dmg.upper().replace(' ', '')) or \
                   re.search(r'melee|blade|sword|knife|club|axe|pike|staff|whip|lightsaber',
                             (typ + ' ' + d.get('Skill', '')).lower()) is not None
        (melee if is_melee else ranged).append(tag(entry, src, d))
    return melee, ranged


# ------------------------------------------------------------- equipment
def parse_equipment(lines, src):
    out = []
    for name, blk in parse_blocks(lines, 'Model'):
        if not looks_like_name(name):
            continue
        d, _ = kv(blk)
        # weapons go through parse_weapons - here, everything without damage
        if d.get('Damage'):
            continue
        entry = {
            'name': tidy_name(repair_clipped(name, d.get('Model', ''))),
            'model': d.get('Model', ''),
            'type': d.get('Type', ''),
            'cost': money(d.get('Cost', '')),
            'costText': d.get('Cost', ''),
            'avail': d.get('Availability', ''),
            'skill': d.get('Skill', ''),
            'notes': cap(d.get('Game Notes', '')),
            'source': d.get('Source', ''),
        }
        if not plausible_gear(entry):
            reject(src)
            continue
        out.append(tag(entry, src, d))
    return out


# ------------------------------------------------- ships and vehicles
WEAPON_KEYS = {'fire arc', 'fire control', 'space range', 'atmosphere range',
               'atmosphere', 'range', 'damage', 'crew', 'skill', 'scale',
               'rate of fire', 'ammo'}


def field(d, *names):
    """Look up a statblock field, ignoring case and repeated blanks.

       The books are not consistent about their own labels: a tractor beam
       may be given a 'Space range', the ship above it a 'Space Range', and
       one entry manages 'Atmosphere        Range'. Matching them literally
       silently dropped the value."""
    flat = {re.sub(r'\s+', ' ', k).strip().lower(): v for k, v in d.items()}
    for n in names:
        v = flat.get(n.lower())
        if v:
            return v
    return ''


def parse_craft(lines, kind, src):
    out = []
    for name, blk in parse_blocks(lines, 'Craft'):
        if not looks_like_name(name):
            continue
        # header data up to "Weapons:" or "Sensors:"
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
                    schluessel = re.sub(r'\s+', ' ', k).strip().lower() if k else None
                    mode = 'weapons' if schluessel in WEAPON_KEYS or k is None else 'head'
                    (weap_lines if mode == 'weapons' else head).append(ln)
            else:
                weap_lines.append(ln)
        d, _ = kv(head)
        sd, _ = kv(sens_lines)

        # Weapons: blocks that start on a non-key line (the weapon name).
        #
        # Weapon names wrap often in two-column typesetting:
        #     2 Proton Torpedo Launchers (fire separately, 12 torpedoes
        #     each)
        #     Fire Arc: Front
        # The second line is not a new weapon but the rest of the name. The
        # giveaway is that not a single key line has been collected for the
        # name so far - a real weapon always brings some.
        weapons, cur, wname = [], None, None
        for ln in weap_lines:
            m = KEY_RE.match(ln)
            if not m:
                if wname is not None and not cur:
                    wname = join_wrapped(wname, ln)      # name continues
                    continue
                if cur and looks_like_continuation(cur[-1], ln):
                    cur[-1] = join_wrapped(cur[-1], ln)  # a value continues
                    continue
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
            # The books switch labels mid-page: sometimes 'Atmosphere Range:',
            # sometimes just 'Atmosphere:'. In a ship's header 'Atmosphere' is
            # its flight speed, but inside a weapon block it is always the
            # range - so both count here.
            space = field(wd, 'Space Range')
            atm = field(wd, 'Atmosphere Range', 'Atmosphere')
            wscale = norm_scale(wd.get('Scale', ''))
            # Starships carry two ranges ("Space Range" and "Atmosphere
            # Range"), ground vehicles only one, and the books simply call
            # it "Range". Nothing looked for that before - which is why
            # almost every vehicle weapon had no range at all.
            #
            # Which column that single value belongs in is decided by what
            # carries it: a vehicle does not leave the atmosphere, so its
            # armament has no space range either - even where the statblock
            # of a large submarine rates the weapon at starfighter scale. On
            # a starship the same holds for anything mounted at vehicle
            # scale. Only what is left really is a space range.
            #
            # Whether the statblock describes a ship or a vehicle is not
            # settled here - split_craft decides that further down. So the
            # uncertain case is marked and put right there.
            eine, solo = wd.get('Range', ''), False
            if eine and not space and not atm:
                if (wscale in ('Speeder', 'Walker', 'Character')
                        or re.search(r'\b(km|m|meter|metre)s?\b', eine, re.I)):
                    atm = eine
                else:
                    space, solo = eine, True
            wl.append({
                'name': wn, 'arc': wd.get('Fire Arc', ''), 'skill': wd.get('Skill', ''),
                'crew': wd.get('Crew', ''), 'fireControl': wd.get('Fire Control', ''),
                'spaceRange': space, 'atmRange': atm, '_soloRange': solo,
                'damage': wd.get('Damage', ''), 'scale': wscale,
            })

        entry = {
            'name': tidy_name(better_name(repair_clipped(name, d.get('Craft', '')),
                                          d.get('Craft', ''))),
            'craft': d.get('Craft', ''),
            'type': d.get('Type', ''),
            'scale': norm_scale(d.get('Scale', '')),
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
            'affiliation': d.get('Affiliation', ''),
            'source': d.get('Source', ''),
            'notes': cap(d.get('Game Notes', '')),
            'sensors': {k: sd.get(k, '') for k in ('Passive', 'Scan', 'Search', 'Focus')},
            'weapons': clean_weapons(wl),
            'kind': kind,
        }
        # pips, so the generator can take the value straight over
        entry['hullPips'] = dice_pips(entry['hull'])
        entry['shieldPips'] = dice_pips(entry['shields'])
        entry['maneuverPips'] = dice_pips(entry['maneuver'])
        if not plausible_craft(entry):
            reject(src)
            continue
        out.append(tag(trim_fields(entry), src, d))
    return out


def split_craft(items):
    """Some books mix starships and ground vehicles into one chapter. An
       entry with no hyperdrive and no space value but with a move value is
       a vehicle."""
    ships, vehicles = [], []
    for it in items:
        is_vehicle = (not it['hyper'] and not it['space'] and
                      (it['move'] or it['cover'] or
                       re.search(r'speeder|walker|tank|crawler|ground|repulsor',
                                 (it['type'] + ' ' + it['skill']).lower()) is not None))
        (vehicles if is_vehicle else ships).append(it)
    return ships, vehicles


# --------------------------------------------------------------- droids
ATTR_RE = re.compile(r'^(DEXTERITY|KNOWLEDGE|MECHANICAL|PERCEPTION|STRENGTH|TECHNICAL)\s+(\d+D(?:\+\d)?)',
                     re.I)
SKILL_RE = re.compile(r"([A-Za-z][A-Za-z \/'\-\(\)]*?)\s*(\d+D(?:\+\d)?)")


CHAR_STAT = re.compile(r'\b(Force Points|Character Points|Dark Side Points)\b', re.I)
ATTR_WORD = re.compile(r'\b(DEXTERITY|KNOWLEDGE|MECHANICAL|PERCEPTION|STRENGTH|TECHNICAL)\b')
# A droid type ends on "... Droid"/"... Automaton" (possibly with a degree
# or a stray dice value behind it). "Droid engineer", by contrast, has the
# word in the middle - that is a person, not a droid.
DROID_TYPE = re.compile(
    r'\b(droids?|automat(?:on|a)|mainframe computer|battle computer|droid brain)\b'
    r'[\s\W]*'
    r'(?:\(?\s*(?:1st|2nd|3rd|4th|5th|first|second|third|fourth|fifth)[- ]?'
    r'(?:degree|class)?\s*\)?)?'
    r'\s*(?:\d+D(?:\+\d)?)?\s*$', re.I)


def is_droid_typed(name, typ):
    """True when name or type marks the entry clearly as a droid - named
       droid characters like R2-D2 or C-3PO included, who carry character
       points like any character but are droids all the same."""
    m = ATTR_WORD.search(typ or '')
    prefix = (typ[:m.start()] if m else (typ or '')).strip()
    return bool(DROID_TYPE.search(prefix)) or \
        bool(re.search(r'\b(droid|automaton)\b', name or '', re.I))


def parse_droids(lines, src):
    out = []
    for name, blk in parse_blocks(lines, 'Type'):
        if not looks_like_name(name):
            continue
        # only real droid statblocks (at least one attribute, "DEXTERITY 2D")
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
        entry_d = {
            'name': name,
            'type': d.get('Type', ''),
            'attrs': attrs,
            'skills': [cap(s, 120) for s in skills if s][:40],
            'equipped': [cap(e, 120) for e in equip if e][:40],
            'move': d.get('Move', ''),
            'size': d.get('Size', ''),
            'cost': money(d.get('Cost', '')),
            'costText': d.get('Cost', ''),
            'avail': d.get('Availability', ''),
            'source': d.get('Source', ''),
        }
        if damaged(entry_d):
            reject(src)
            continue
        droidish = is_droid_typed(name, entry_d['type'])
        # Heroes and NPCs (Boba Fett, Luke, the Sith and Jedi boxes from
        # GG16 ...) sit in the same statblock boxes as droids but carry
        # Force, character or Dark Side points - a droid never has any of
        # that. Exception: named droid characters like R2-D2 and C-3PO are
        # written up as characters with character points, yet are typed
        # unmistakably as droids - those stay.
        if CHAR_STAT.search(' '.join(blk)) and not droidish:
            reject(src)
            continue
        # Creatures (banthas, akk dogs, predators from the books'
        # bestiaries) carry only DEXTERITY/PERCEPTION/STRENGTH. A droid
        # always has at least one "machine" attribute - KNOWLEDGE,
        # MECHANICAL or TECHNICAL - or is explicitly typed as a droid (and
        # was then merely read incompletely).
        machine = any(k in attrs for k in ('kno', 'mec', 'tec'))
        if not machine and not droidish:
            reject(src)
            continue
        out.append(tag(entry_d, src, d))
    return out


# ============================================================ main routine
class Src:
    def __init__(self, path, book, era, kinds, ocr, skip):
        self.path, self.book, self.era = path, book, era
        self.kinds, self.ocr, self.skip = kinds, ocr, skip


def find_file(name):
    for root in SRC_DIRS:
        direct = os.path.join(root, name)
        if os.path.isfile(direct):
            return direct
        for dirpath, _dirs, files in os.walk(root):
            if name in files:
                return os.path.join(dirpath, name)
    return None


melee, ranged, equipment, ships, vehicles, droids = [], [], [], [], [], []
missing, used = [], []

for fname, book, era, kinds, ocr, skip in SOURCES:
    path = find_file(fname)
    if not path:
        missing.append(fname)
        continue
    src = Src(path, book, era, kinds, ocr, skip)
    try:
        lines = pdf_lines(path, skip_pages=skip, ocr=ocr)
    except Exception as e:                      # damaged or encrypted file
        missing.append(f'{fname} ({e})')
        continue
    counts = {}
    if 'weapons' in kinds:
        m, r = parse_weapons(lines, src)
        melee += m
        ranged += r
        counts['Waffen'] = len(m) + len(r)
    if 'equipment' in kinds:
        e = parse_equipment(lines, src)
        equipment += e
        counts['Ausruestung'] = len(e)
    if 'ships' in kinds or 'vehicles' in kinds:
        craft = parse_craft(lines, 'ship', src)
        s, v = split_craft(craft)
        if 'ships' not in kinds:
            v += s
            s = []
        if 'vehicles' not in kinds:
            s += v
            v = []
        for x in v:
            x['kind'] = 'vehicle'
        # Now it is settled what is a ship and what a vehicle: a single
        # "Range:" on a vehicle is always an atmospheric one.
        for x in s + v:
            for w in (x.get('weapons') or []):
                if w.pop('_soloRange', False) and x.get('kind') == 'vehicle':
                    w['atmRange'], w['spaceRange'] = w['spaceRange'], ''
        ships += s
        vehicles += v
        counts['Schiffe'] = len(s)
        counts['Fahrzeuge'] = len(v)
    if 'droids' in kinds:
        dr = parse_droids(lines, src)
        droids += dr
        counts['Droiden'] = len(dr)
    used.append((book, counts))


# ------------------------------------------------ weapon list for ships
# The books give armament only inside the ship statblocks. For the
# generator's pick list the types are gathered out of them: same weapon,
# same scale, same damage = one entry. How often a type occurs decides the
# order - the common ones first.
# WEAPON_COUNT_RE, WEAPON_PLURAL and weapon_base_name live in
# weaponnames.py, because repair-catalogs.py needs them too.


def build_weapon_catalog(craft_items):
    """Build a weapon catalogue out of every ship and vehicle block."""
    seen = {}
    for e in craft_items:
        for w in e.get('weapons', []):
            name = weapon_base_name(w.get('name', ''))
            dmg = (w.get('damage') or '').strip()
            scale = norm_scale(w.get('scale') or '') or norm_scale(e.get('scale') or '')
            if not name or len(name) < 4 or not dmg:
                continue
            if not re.match(r'^\d{1,2}D', dmg):        # no clean damage value
                continue
            # weapon_base_name strips the count ("5 batteries rear" ->
            # "batteries rear"); only then does what is left show up as a
            # phantom weapon - so check once more here.
            if not plausible_weapon_name(name):
                continue
            key = (re.sub(r'[^a-z0-9]', '', name.lower()), scale, dmg)
            hit = seen.get(key)
            if hit:
                hit['count'] += 1
                continue
            seen[key] = {
                'name': name,
                'scale': scale,
                'damage': dmg,
                'fireControl': (w.get('fireControl') or '').strip(),
                'arc': (w.get('arc') or '').strip(),
                'skill': (w.get('skill') or '').strip(),
                'crew': (w.get('crew') or '').strip(),
                'spaceRange': (w.get('spaceRange') or '').strip(),
                'atmRange': (w.get('atmRange') or '').strip(),
                'book': e.get('book', ''),
                'count': 1,
            }
    out = sorted(seen.values(), key=lambda x: (-x['count'], x['name'].lower()))
    return out


def dedupe(items, by_craft=False):
    """First hit wins. The compilations come first in SOURCES because
       their text layer is the cleanest; the specialised books only fill
       gaps.

       For ships and vehicles the "Craft:" line counts as an identifier too.
       The same ship appears in several books under different headings - the
       HT-2200, say, once as "HT-2200 Medium Freighter" but in the CEC
       Compendium only as "Medium Freighter"."""
    seen, out, dropped = set(), [], 0
    for it in items:
        keys = [re.sub(r'[^a-z0-9]', '', it['name'].lower())]
        if by_craft and it.get('craft'):
            keys.append('craft:' + re.sub(r'[^a-z0-9]', '', it['craft'].lower()))
        if not keys[0] or any(k in seen for k in keys):
            dropped += 1
            continue
        seen.update(keys)
        out.append(it)
    return out, dropped


(melee, d1), (ranged, d2) = dedupe(melee), dedupe(ranged)
(equipment, d3), (ships, d4) = dedupe(equipment), dedupe(ships, by_craft=True)
(vehicles, d5), (droids, d6) = dedupe(vehicles, by_craft=True), dedupe(droids)

"""Output is split up so each page loads only what it needs:
     pdfdata-gear.js   - weapons + equipment  (character and droid pages)
     pdfdata-craft.js  - ships + vehicles     (ship page)
     pdfdata-droids.js - droid templates      (droid page)"""
APPDIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
HEAD = ('// Generated from the rulebook PDFs.\n'
        '// Source: Star Wars D6 (West End Games) and fan compilations from the community.\n'
        '// Do not edit by hand - run tools/extract-from-pdfs.py instead.\n')


# Order for the app's era dropdown. Written into every generated file, so
# the pick list can never drift away from the actual data.
ERA_ORDER = [ERA_OLD, ERA_RISE, ERA_REB, ERA_NEW]


def write_file(fname, pairs):
    p = os.path.join(APPDIR, fname)
    with open(p, 'w', encoding='utf-8') as f:
        f.write(HEAD)
        # The droid page loads two of these files - a second "const" would
        # be a syntax error, so only assign when it is not there yet.
        f.write('if (typeof PDF_ERAS === "undefined") var PDF_ERAS = %s;\n'
                % json.dumps(ERA_ORDER))
        for var, data in pairs:
            f.write('const %s = ' % var)
            json.dump(data, f, ensure_ascii=False, separators=(',', ':'))
            f.write(';\n')
    return os.path.getsize(p) / 1024


kb_gear = write_file('pdfdata-gear.js', [('PDF_WEAPONS_MELEE', melee),
                                         ('PDF_WEAPONS_RANGED', ranged),
                                         ('PDF_EQUIPMENT', equipment)])
ship_weapons = build_weapon_catalog(ships + vehicles)
kb_craft = write_file('pdfdata-craft.js', [('PDF_SHIPS', ships), ('PDF_VEHICLES', vehicles),
                                           ('PDF_SHIP_WEAPONS', ship_weapons)])
kb_droid = write_file('pdfdata-droids.js', [('PDF_DROIDS', droids)])

print('--- Gelesene Buecher ---')
for book, counts in used:
    detail = ', '.join(f'{k}: {v}' for k, v in counts.items() if v)
    print(f'  {book:<30} {detail or "nothing found"}')
if REJECTED:
    print('--- Discarded (implausible values, usually two-column scans) ---')
    for book, n in sorted(REJECTED.items(), key=lambda x: -x[1]):
        print(f'  {book:<30} {n}')
if missing:
    print('--- Not found ---')
    for m in missing:
        print(f'  {m}')

print('--- Zusammenfassung (nach Dubletten-Abgleich) ---')
print(f'  Schiffswaffen:   {len(ship_weapons):>5}   (Typen aus allen Statbloecken)')
print(f'  Nahkampfwaffen:  {len(melee):>5}   (Dubletten {d1})')
print(f'  Fernkampfwaffen: {len(ranged):>5}   (Dubletten {d2})')
print(f'  Ausruestung:     {len(equipment):>5}   (Dubletten {d3})')
print(f'  Raumschiffe:     {len(ships):>5}   (Dubletten {d4})')
print(f'  Fahrzeuge:       {len(vehicles):>5}   (Dubletten {d5})')
print(f'  Droiden:         {len(droids):>5}   (Dubletten {d6})')

eras = {}
for it in melee + ranged + equipment + ships + vehicles + droids:
    eras[it.get('era') or '(universell)'] = eras.get(it.get('era') or '(universell)', 0) + 1
print('--- Verteilung nach Aera ---')
for k, v in sorted(eras.items(), key=lambda x: -x[1]):
    print(f'  {k:<16} {v}')

print(f'  pdfdata-gear.js   {kb_gear:6.0f} KB')
print(f'  pdfdata-craft.js  {kb_craft:6.0f} KB')
print(f'  pdfdata-droids.js {kb_droid:6.0f} KB')
