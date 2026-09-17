# -*- coding: utf-8 -*-
"""
=============================================================================
 Carry extra species from the rulebooks over into pdfdata-species.js
=============================================================================

 Reads the fan-made compilation "rp_aliens.pdf" plus individual text files
 laid out the same way (see below) and builds PDF_SPECIES from them - the
 species that Chance Gibboney's Excel generator does not yet carry.

 Usage:
     python tools/extract-species.py FILE_OR_FOLDER [...]

 Requires: pip install pypdf


 ---------------------------------------------------------------------------
 Why "offset" is converted
 ---------------------------------------------------------------------------
 The compilation gives attribute dice by 2nd Edition (base 12D for humans).
 The Excel generator - and with it this app - works by "Revised & Expanded"
 with a base of 18D. The two are a constant 6D apart.

 The app models the attribute pool as  54 pips + offset. So:

     offset = book_attribute_dice_in_pips + 18 - 54
            = attribute_dice_in_pips - 36

 Cross-checked against species that appear in both sources (book -> Excel
 offset):
     Aqualish  12D -> 0     Falleen 13D -> +3     Gamorrean 11D -> -3
     Hutt      14D -> +6    Noghri  16D -> +12    Twi'lek   11D -> -3
 They all agree. The only divergence in the spreadsheet is the Toydarian,
 whom the author gave 2D more than the formula yields - but existing species
 are not touched here anyway.


 ---------------------------------------------------------------------------
 Expected layout of an entry
 ---------------------------------------------------------------------------
     <name>                       (or "Name: <name>" in text files)
     Home Planet: Ando            (optional)
     Attribute Dice: 12D
     DEXTERITY 2D/4D              (or "Dex: 2D/4D")
     KNOWLEDGE 1D/3D
     MECHANICAL 1D+2/3D+2
     PERCEPTION 2D/4D
     STRENGTH 2D/4D+2
     TECHNICAL 1D+2/3D
     Special Abilities:           (optional)
         <title>: <text>
     Story Factors:               (optional)
         <title>: <text>
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

# Same order as data.js: DEX, KNOW, MECH, PERC, STR, TECH
ATTR_ORDER = ['DEXTERITY', 'KNOWLEDGE', 'MECHANICAL', 'PERCEPTION', 'STRENGTH', 'TECHNICAL']
ATTR_ALIAS = {'DEX': 'DEXTERITY', 'KNOW': 'KNOWLEDGE', 'KNO': 'KNOWLEDGE',
              'MECH': 'MECHANICAL', 'MEC': 'MECHANICAL', 'PERC': 'PERCEPTION',
              'PER': 'PERCEPTION', 'STR': 'STRENGTH', 'TECH': 'TECHNICAL',
              'TEC': 'TECHNICAL'}

DICE = r'\d+D(?:\s*\+\s*\d)?'
# In the typesetting the space between attribute name and dice code
# occasionally disappears ("MECHANICAL1D/4D" instead of "MECHANICAL 1D/4D").
# If even one attribute was missing, the whole block was discarded as
# incomplete - which is how the Togruta slipped through. Hence \s* instead of
# \s+; the alternation is pinned to the six attribute names, so a false
# match is impossible.
ATTR_RE = re.compile(r'^(%s)\s*:?\s*(%s)\s*/\s*(%s)\s*$'
                     % ('|'.join(ATTR_ORDER + list(ATTR_ALIAS)), DICE, DICE), re.I)
DICE_LINE = re.compile(r'^Attribute Dice\s*:\s*(%s)' % DICE, re.I)
SECTION_RE = re.compile(r'^(Special Abilities|Story Factors)\s*:?\s*$', re.I)
ENTRY_RE = re.compile(r'^([A-Z][^:]{1,60}):\s*(.*)$')
KEY_LINE = re.compile(r"^[A-Za-z][A-Za-z /'-]{1,28}:\s")


# A few entries appear in the book under a name that makes no sense outside
# its chapter: a caste of a people, or a name wrapped over two lines. There
# is no reliable way to join those automatically - trying to append the line
# above merges neighbouring species wholesale ("Dulok" + "Duros"). So it is
# done by hand here.
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
        if ln and not re.fullmatch(r'\d{1,3}', ln):     # drop page numbers
            out.append(ln)
    return out


def looks_like_species_name(n):
    """The name sits on a line of its own above the block. In two-column
       typesetting the tail of some prose from the neighbouring column
       occasionally lands there - such lines give themselves away by lower
       case, punctuation or length."""
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
       Only the part before 'meters' counts, or '2.5 meters diameter' drags
       the body height up with it."""
    head = re.split(r'meters?', text, 1)[0]
    nums = re.findall(r'\d+(?:\.\d+)?', head) or re.findall(r'\d+(?:\.\d+)?', text)
    if not nums:
        return 0.0, 0.0
    lo = float(nums[0])
    hi = float(nums[1]) if len(nums) > 1 else lo
    return (lo, hi) if hi >= lo else (lo, lo)


def starts_new_entry(lines, idx):
    """Is lines[idx] the name line of the next species? The giveaway is that
       the line itself looks like a name AND that "Home Planet:" or
       "Attribute Dice:" follows shortly below.

       The name test is the decisive part: without it a continuation line
       like "the Jedi Sourcebook (pages 75-76)" also counts as a name line,
       merely because the next entry begins two lines further on."""
    if not looks_like_species_name(lines[idx]):
        return False
    for look in (1, 2, 3):
        if idx + look >= len(lines):
            break
        ln = lines[idx + look]
        if DICE_LINE.match(ln) or re.match(r'^Home Planet\s*:', ln, re.I):
            return True
        if KEY_LINE.match(ln):        # some other key -> no
            return False
    return False


def join_wrapped(a, b):
    """Append a continuation line; join a hyphen at the end of a line."""
    a = a.rstrip()
    if a.endswith('-') and not a.endswith(' -'):
        return a + b.lstrip()
    return (a + ' ' + b).strip()


def parse(lines, source_label):
    """Every species block in one source."""
    out = []
    i = 0
    while i < len(lines):
        dm = DICE_LINE.match(lines[i])
        if not dm:
            i += 1
            continue

        # --- name: one or two lines earlier ("Home Planet:" in between) ---
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
            # skip the prose and go on looking upwards
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

            # the next species begins -> the block ends here
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
                # The source note often wraps ("... Power of" / "the Jedi
                # Sourcebook (pages 75-76)"). Only append a continuation
                # when the line visibly ends mid-phrase and the next starts
                # lower case - otherwise the next species' name would slip
                # in with it.
                for _ in range(2):          # at most two continuation lines
                    if j + 1 >= len(lines):
                        break
                    nxt = lines[j + 1]
                    if KEY_LINE.match(nxt) or starts_new_entry(lines, j + 1):
                        break
                    # already complete? then append nothing.
                    if src_page.endswith((')', '.')) or src_page[-1:].isdigit():
                        break
                    j += 1
                    src_page = join_wrapped(src_page, lines[j])
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

        # take only complete blocks
        if found == 6 and move:
            out.append({
                'name': name,
                'min': mins,
                'max': maxs,
                'move': move,
                # 54 + offset is the app's attribute pool; see the header comment
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


# ------------------------------------------------------ names already known
def existing_names():
    p = os.path.join(APPDIR, 'data.js')
    s = open(p, encoding='utf-8').read()
    data = json.loads(s[s.index('{'):s.rindex('};') + 1])
    return {norm(x['name']) for x in data['species']}


def norm(n):
    """For the duplicate check: normalise case, apostrophes, the spellings
       fandom is inconsistent about (Wookiee/Wookie) and the plural - the
       spreadsheet lists some peoples in the plural ("Baragwins",
       "Toydarians"), the compilation in the singular."""
    n = re.sub(r"[^a-z]", '', n.lower())
    n = re.sub(r'(.)\1+', r'\1', n)          # collapse doubled letters
    return n.rstrip('s')


# ============================================================ main routine
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
    f.write('// Generated from the rulebooks (rp_aliens.pdf and others).\n'
            '// Only species the Excel generator does not already carry.\n'
            '// Do not edit by hand - run tools/extract-species.py instead.\n')
    f.write('const PDF_SPECIES = ')
    json.dump(found_all, f, ensure_ascii=False, separators=(',', ':'))
    f.write(';\n')

print('--- Gelesene Dateien ---')
for name, err, ganz, neu in per_file:
    if err:
        print('  %-34s %s' % (name[:34], err))
    else:
        print('  %-34s found: %4d   of those new: %4d' % (name[:34], ganz, neu))
print('--- Ergebnis ---')
print('  Neue Spezies:      %d' % len(found_all))
print('  Bereits im Excel:  %d' % len(existing_names()))
print('  pdfdata-species.js %.0f KB' % (os.path.getsize(OUT) / 1024))
ohne_max = [g['name'] for g in found_all if any(m == 0 for m in g['max'])]
if ohne_max:
    print('  Ohne Hoechstwerte (bitte pruefen): %s' % ', '.join(ohne_max[:10]))
