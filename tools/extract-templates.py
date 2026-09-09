# -*- coding: utf-8 -*-
"""=====================================================================
   Character templates out of the rulebook  ->  pdfdata-templates.js
   =====================================================================
   The printed templates are the usual way into the game: pick "Brash
   Pilot", copy the sheet, play. The generator had every other kind of
   template - 1,296 ships, 393 droids, NPC groups - and none for
   characters, which is what a reader of the rulebook looks for first.

   WHY TWO PASSES OVER THE SAME PAGES

   A template page is a form in two columns, and no single extraction
   gets all of it:

     pdftotext -layout  keeps the grid, so "DEXTERITY 2D+1 PERCEPTION
                        2D+1" stays on one line and the attributes can be
                        read off reliably. The prose on the right is torn
                        into slivers.
     pdftotext (flow)   follows reading order, so each prose block comes
                        out as one run beginning with its own label -
                        Equipment:, Background:, Personality: - and the
                        skills sit in one run per attribute. The attribute
                        values, though, drift away from their headings.

   So the attributes come from the layout pass and everything else from
   the flow pass.

   WHAT A TEMPLATE ACTUALLY CARRIES

   Only the six attributes have dice. The skills are listed WITHOUT
   values - the printed template names the skills that suit the character
   and leaves the player the 7D to spend. So a template fills the
   attribute pool completely and the skill pool not at all.

   The attributes always add up to 18D, but on a Force-sensitive template
   part of that sits in control, sense and alter, which come out of the
   same pool. That is the check at the end.

   HOW THE SKILLS ARE READ

   Not by position on the page but by name, and as a PHRASE rather than
   word by word: in reading order the skills of one attribute arrive as a
   single run ("Bargain Command Investigation Persuasion Search Sneak"),
   so there is nothing to split on. Each known skill is searched for in
   that run instead, longest name first, and struck out once found - so
   "Melee Combat" cannot be eaten by a later "Melee Parry".

   The list of known skills comes from the app's own data.js. That does
   two jobs at once: it files each skill under the right attribute
   without trusting the column, and a name the app does not know is
   reported instead of quietly written into the catalogue.

   Usage:  python tools/extract-templates.py "path/to/REUP.pdf" [-o out.js]
   =====================================================================
"""
import argparse
import json
import os
import re
import subprocess
import sys

ATTR_NAMES = ['DEXTERITY', 'KNOWLEDGE', 'MECHANICAL',
              'PERCEPTION', 'STRENGTH', 'TECHNICAL']
ATTR_KEY = {'DEXTERITY': 'dex', 'KNOWLEDGE': 'kno', 'MECHANICAL': 'mec',
            'PERCEPTION': 'per', 'STRENGTH': 'str', 'TECHNICAL': 'tec'}
FORCE_KEYS = ['control', 'sense', 'alter']

# The prose blocks, in the order the page prints them. "Note" appears on
# only a few templates and sits inside the background text.
LABELS = ['Equipment', 'Background', 'Note', 'Personality', 'Objectives',
          'A Quote', 'Connection With Characters']

DICE = r'(\d+)D(?:\+([12]))?'

# How the book spells a skill, against how the app writes it. The app uses
# abbreviations the book spells out, so most of these cannot be guessed by
# normalising - they have to be stated.
ALIAS = {
    'computer prgm./repair': 'Computer Prog. / Rep.',
    'computer programming/repair': 'Computer Prog. / Rep.',
    'computer programming': 'Computer Prog. / Rep.',
    'computer prgm': 'Computer Prog. / Rep.',
    'droid programming': 'Droid Prog.',
    'droid prgm.': 'Droid Prog.',
    'droid prgm': 'Droid Prog.',
    'droid prgrm': 'Droid Prog.',
    'repulsorlift operation': 'Repulsorlift Op.',
    'repulsorlift op.': 'Repulsorlift Op.',
    'space transports': 'Space Transport',
    'space transports repair': 'Space Transport Rep.',
    'space transport repair': 'Space Transport Rep.',
    'ground vehicle operation': 'Ground Vehicle Op.',
    'ground vehicle op.': 'Ground Vehicle Op.',
    'hover vehicle operation': 'Hover Vehicle Op.',
    'aquatic vehicle operation': 'Aquatic Vehicle Op.',
    'aquatic vehicle repair': 'Aquatic Vehicle Rep.',
    'submersible vehicle operation': 'Submersible Vehicle Op.',
    'capital ship gunnery': 'Capital Ship Gun.',
    'capital ship weapon repair': 'Capital Ship Weap. Rep.',
    'starship weapon repair': 'Starship Weapon Rep.',
    'ground vehicle repair': 'Ground Vehicle Rep.',
    'climbing/jumping': 'Climbing / Jumping',
    'demolitions': 'Demolition',
    'pick pocket': 'Pick Pockets',
    'archaic starship piloting': 'Archaic Starship Pilot.',
    'rocket pack operation': 'Rocket Pack Op.',
    # REUP renamed two skills the app still spells the older way.
    'archaic weapons': 'Archaic Guns',
    'culture': 'Cultures',
}

# The one page whose grid the typesetting broke. On the Retired Captain
# the values for MECHANICAL and TECHNICAL sit a row above their headings,
# so nothing on the heading's own line can be read. Which value belongs
# where is not a guess: in the layout pass a left-column attribute value
# stands at character 23-25 and a right-column one at 43-46, and the two
# strays sit at 23 and 46. The arithmetic agrees - the four readable
# attributes come to 34 pips, and 11 + 9 fills the pool to exactly 54.
HAND_CHECKED = {
    'RETIRED CAPTAIN': {'mec': 11, 'tec': 9},
}

# Templates that are not meant to add up to 18D. A droid is not built on a
# player's attribute pool, and the book prints it with 8D.
NOT_18D = ['Protocol Droid']

# Skills a template names that the app has no entry for. They are kept as
# the template's own free-text skills rather than dropped, because the
# book does list them - but they are NOT invented as app skills.
EXTRA_OK = ['Glider', 'Primitive Construction']

# ---------------------------------------------------------------------
# The equipment line
# ---------------------------------------------------------------------
# It is one sentence of prose: "Lightsaber (5D), robes, bottle of liquor,
# 250 credits". Dropping the whole thing into a note - which is where it
# went first - means the lightsaber never reaches the weapons tab, which
# is exactly what a player notices.
#
# What CAN be read out of it is only what the book itself marks:
#
#   (5D)              a damage code -> a weapon
#   (STR+1D+1)        a damage code that adds Strength -> melee
#   (+2 energy, ...)  an armour rating -> armour
#   1,000 credits     starting money
#
# Everything without one of those - robes, comlink, a bottle of liquor, a
# YT-1300 - stays prose and stays in the note. Guessing which catalogue
# entry "medpac" means would put invented numbers on a sheet, and a wrong
# die is worse than a line of text.
DMG_STR = re.compile(r'^\s*(?:STR|Strength)\s*\+\s*(\d+D(?:\+[12])?|[12])\s*$', re.I)
DMG_DICE = re.compile(r'^\s*(\d+D(?:\+[12])?)\s*$', re.I)
ARMOUR = re.compile(r'\+\s*(\d+D?(?:\+[12])?)\s*(physical|energy)', re.I)
CREDITS = re.compile(r'([\d][\d,.]*)\s*credits', re.I)

# A lightsaber does its damage without Strength, so the bracket looks like a
# blaster's. It is a melee weapon all the same.
MELEE_NAMES = re.compile(r'lightsaber|light\s*whip|sword|knife|knives|spear|saber|club|staff|axe|vibro',
                         re.I)
THROWN = re.compile(r'detonator|grenade|explosive', re.I)


def split_items(text):
    """Split the line on commas that separate items.

       Not every comma does: the book writes prices as "1,000 credits", and
       splitting there leaves an item called "1" and another called "000
       credits" - which is how the starting money first came out as zero. A
       comma with a digit on each side belongs to the number."""
    teile, tiefe, start = [], 0, 0
    for i, c in enumerate(text):
        if c == '(':
            tiefe += 1
        elif c == ')':
            tiefe = max(0, tiefe - 1)
        elif c == ',' and tiefe == 0:
            if i and text[i - 1].isdigit() and i + 1 < len(text) and text[i + 1].isdigit():
                continue
            teile.append(text[start:i])
            start = i + 1
    teile.append(text[start:])
    return [t.strip(' .') for t in teile if t.strip(' .')]


def parse_equipment(text):
    """-> (weapons, armour, credits, what is left as prose)."""
    waffen, panzer, geld, rest = [], [], 0, []
    for stueck in split_items(text):
        m = re.match(r'^(.*?)\s*\(([^)]*)\)\s*(.*)$', stueck)
        klammer = m.group(2) if m else ''
        name = (m.group(1) + ' ' + m.group(3)).strip() if m else stueck

        if klammer:
            ms = DMG_STR.match(klammer)
            md = DMG_DICE.match(klammer)
            if ms or md:
                schaden = ('STR+' + ms.group(1)) if ms else md.group(1)
                art = ('thrown' if THROWN.search(name)
                       else 'melee' if (ms or MELEE_NAMES.search(name))
                       else 'ranged')
                waffen.append({'name': name, 'dmg': schaden, 'kind': art})
                continue
            if ARMOUR.search(klammer):
                werte = {a[1].lower(): a[0] for a in ARMOUR.findall(klammer)}
                panzer.append({'name': name,
                               'phys': werte.get('physical', ''),
                               'energy': werte.get('energy', ''),
                               'note': klammer})
                continue

        # "Sword (damage code is Strength+1D+1)" - the same thing said in words.
        m2 = re.search(r'damage code is\s+(?:STR|Strength)\s*\+\s*(\d+D(?:\+[12])?)',
                       stueck, re.I)
        if m2:
            waffen.append({'name': re.sub(r'\s*\(.*', '', stueck).strip(),
                           'dmg': 'STR+' + m2.group(1), 'kind': 'melee'})
            continue

        mc = CREDITS.search(stueck)
        if mc and not re.search(r'owed|debt', stueck, re.I) and not geld:
            geld = int(re.sub(r'[^\d]', '', mc.group(1)))
            uebrig = CREDITS.sub('', stueck).strip(' ,.')
            if uebrig:
                rest.append(uebrig)
            continue

        rest.append(stueck)
    return waffen, panzer, geld, rest


def fmt_pips(n):
    return '%dD' % (n // 3) if n % 3 == 0 else '%dD+%d' % (n // 3, n % 3)


def clean(text):
    """Undo what the typesetting did to the words.

       The PDF hyphenates across lines with a soft hyphen, so "existence"
       arrives as "exis<U+00AD> tence". Left alone it would land on the
       character sheet exactly like that."""
    text = text.replace(u'­ ', '').replace(u'­', '')
    text = text.replace(u'’', "'").replace(u'‘', "'")
    text = text.replace(u'“', '"').replace(u'”', '"')
    text = text.replace(u'—', ' - ').replace(u'–', '-')
    return re.sub(r'\s+', ' ', text).strip()


def pdftotext(pdf, first, last, layout):
    cmd = ['pdftotext', '-f', str(first), '-l', str(last), '-enc', 'UTF-8']
    if layout:
        cmd.append('-layout')
    cmd += [pdf, '-']
    out = subprocess.run(cmd, capture_output=True)
    if out.returncode:
        sys.exit('pdftotext failed: ' + out.stderr.decode('utf-8', 'replace'))
    return out.stdout.decode('utf-8', 'replace')


def find_pages(pdf):
    """The template section, found rather than hardcoded.

       Taking the first and last page that look like a template would drag
       in half the book: a worked example early on carries the same
       heading. The templates are printed one after another, so the
       LONGEST UNBROKEN RUN of such pages is the section itself."""
    seiten = pdftotext(pdf, 1, 10000, True).split('\f')
    # Deliberately NOT testing for "Gender/Species" as well: the Protocol
    # Droid template has no gender, and that one missing line would end the
    # run nine templates early.
    ist = [bool(re.search(u'^\\s*• .+ •\\s*$', p, re.M)
                and 'TEMPLATE' in p.upper())
           for p in seiten]
    beste = (0, 0, 0)
    lauf = 0
    for i, treffer in enumerate(ist):
        lauf = lauf + 1 if treffer else 0
        if lauf > beste[0]:
            beste = (lauf, i - lauf + 2, i + 1)
    if not beste[0]:
        sys.exit('No template pages found in this PDF.')
    return beste[1], beste[2]


def blocks(text):
    """Split into one chunk per template, keyed by the bullet heading."""
    teile = re.split(u'^\\s*• (.+?) •\\s*$', text, flags=re.M)
    return [(teile[i].strip(), teile[i + 1]) for i in range(1, len(teile), 2)]


def app_skills(repo_root):
    """The app's own skill list, so a name is filed by the app's opinion
       rather than by where it happened to sit on the page."""
    src = open(os.path.join(repo_root, 'data.js'), encoding='utf-8').read()
    i = src.index('"skills"')
    j = src.index('{', i)
    tiefe, k = 0, j
    while k < len(src):
        if src[k] == '{':
            tiefe += 1
        elif src[k] == '}':
            tiefe -= 1
            if tiefe == 0:
                break
        k += 1
    return json.loads(src[j:k + 1])


def skill_patterns(roh):
    """One search pattern per skill, longest name first.

       Longest first matters: "Melee Combat" has to be taken out of the run
       before a bare "Melee Parry" pattern looks at it, or the two overlap
       and one of them goes missing."""
    paare = []
    for key, liste in roh.items():
        for echt in liste:
            paare.append((echt, key, echt))
    for buch, echt in ALIAS.items():
        key = next((k for k, v in roh.items() if echt in v), None)
        if key:
            paare.append((buch, key, echt))
    for name in EXTRA_OK:
        paare.append((name, '', name))
    paare.sort(key=lambda p: -len(p[0]))

    out = []
    for such, key, echt in paare:
        # Tolerate the book's spacing around slashes and its dots.
        stuecke = [re.escape(t) for t in re.split(r'\s*/\s*', such)]
        muster = r'\s*/\s*'.join(stuecke)
        muster = muster.replace(r'\ ', r'\s+').replace(r'\.', r'\.?')
        out.append((re.compile(r'(?<![A-Za-z])' + muster + r'(?![A-Za-z])',
                               re.I), key, echt))
    return out


def parse(pdf, repo_root):
    first, last = find_pages(pdf)
    print('Template pages: %d to %d' % (first, last))
    layout_bl = dict(blocks(pdftotext(pdf, first, last, True)))
    flow_bl = blocks(pdftotext(pdf, first, last, False))
    muster = skill_patterns(app_skills(repo_root))

    vorlagen, meldungen = [], []
    for kopf, flow in flow_bl:
        lay = layout_bl.get(kopf, '')

        # ---- attributes, out of the layout pass ----
        paare = re.findall(r'\b(%s)\s+%s' % ('|'.join(ATTR_NAMES), DICE), lay)
        attrs = {}
        for name, d, plus in paare:
            key = ATTR_KEY[name]
            if key not in attrs:
                attrs[key] = int(d) * 3 + (int(plus) if plus else 0)
        attrs.update(HAND_CHECKED.get(kopf, {}))
        fehlend = [a for a in ATTR_KEY.values() if a not in attrs]
        if fehlend:
            meldungen.append('%s: no value for %s' % (kopf, ', '.join(fehlend)))
            continue

        # ---- Force skills, which come out of the same pool ----
        # Each one on its own: the templates carry anything from "Sense 1D."
        # through "Control 1D, sense 1D." to all three, and a pattern that
        # insists on the full set finds none of the shorter ones.
        force = {}
        besonders = flow.split('SPECIAL ABILITIES')
        if len(besonders) > 1:
            zone = re.split(r'Force Sensitive|Move:|Force Points', besonders[1])[0]
            for k in FORCE_KEYS:
                mf = re.search(r'(?<![A-Za-z])' + k + r'\s+' + DICE, zone, re.I)
                if mf:
                    force[k] = int(mf.group(1)) * 3 + (int(mf.group(2)) if mf.group(2) else 0)

        # ---- skills ----
        bereich = re.split(r'SPECIAL ABILITIES|Equipment:|Move:', flow)[0]
        bereich = re.sub(r'^.*?Physical Description:', '', bereich, flags=re.S)
        rest = bereich
        gefunden, frei = {}, []
        for regex, key, echt in muster:
            if regex.search(rest):
                rest = regex.sub(' ', rest)
                if key:
                    gefunden.setdefault(key, [])
                    if echt not in gefunden[key]:
                        gefunden[key].append(echt)
                elif echt not in frei:
                    frei.append(echt)
        # What is left should be nothing but attribute headings, their dice
        # and the empty form fields. Anything else is worth a look.
        rest = re.sub(r'\b(%s)\b' % '|'.join(ATTR_NAMES), ' ', rest)
        rest = re.sub(DICE, ' ', rest)
        rest = re.sub(r'(Character Name|Type|Gender/Species|Age|Height|Weight'
                      r'|Physical Description|Force Sensitive|Yes|No)\s*\??:?',
                      ' ', rest)
        m_sp = re.search(r'Gender/Species:[ \t]*[^/\n]*?/[ \t]*([A-Za-z][A-Za-z \'-]*)',
                         lay)
        if m_sp:
            # Reading order drops the species value in among the skills.
            rest = re.sub(re.escape(m_sp.group(1).strip()), ' ', rest, flags=re.I)
        uebrig = [w for w in re.split(r'[\s/,.]+', rest) if len(w) > 2]
        if uebrig:
            meldungen.append('%s: left over: %s' % (kopf, ' '.join(uebrig[:10])))

        # ---- prose ----
        # Each block runs from its own label to whichever label comes next
        # in the text, so an absent one (most templates have no "Note")
        # does not interrupt the block before it.
        stellen = []
        for label in LABELS:
            m = re.search(r'(?<![A-Za-z])' + re.escape(label) + r':', flow)
            if m:
                stellen.append((m.start(), m.end(), label))
        stellen.sort()
        # The last block would otherwise run on into the heading of the next
        # template, which sits in this chunk until the split takes it away.
        schluss_block = len(flow)
        m_ende = re.search(r'CHARACTER\s+TEMPLATE', flow)
        if m_ende and stellen and m_ende.start() > stellen[-1][0]:
            schluss_block = m_ende.start()
        text = {}
        for n, (_, ende, label) in enumerate(stellen):
            schluss = stellen[n + 1][0] if n + 1 < len(stellen) else schluss_block
            text[label] = clean(flow[ende:schluss])

        m_move = re.search(r'Move:\s*(\d+)', flow)
        m_fp = re.search(r'Force Points:\s*(\d+)', flow)
        m_type = re.search(r'Type:\s*(.+)', flow)
        # "Gender/Species:" is a blank form field on most templates. Where a
        # species is fixed the book prints it after the slash, sometimes
        # with nothing before it at all ("/Ewok").
        #
        # Read from the LAYOUT pass: in reading order the value is torn away
        # from its label and lands among the skills, which is where the
        # loose "Ewok" and "Mon Calamari" came from.
        m_spec = re.search(r'Gender/Species:[ \t]*[^/\n]*?/[ \t]*([A-Za-z][A-Za-z \'-]*)',
                           lay)

        ausruestung = text.get('Equipment', '')
        waffen, panzer, geld, restgut = parse_equipment(ausruestung)

        vorlagen.append({
            'name': clean(m_type.group(1)) if m_type else kopf.title(),
            'species': clean(m_spec.group(1)) if m_spec else '',
            'weapons': waffen,
            'armor': panzer,
            'credits': geld,
            'gear': restgut,
            'attrs': attrs,
            'force': force,
            'skills': gefunden,
            'extraSkills': frei,
            'move': int(m_move.group(1)) if m_move else 10,
            'forcePoints': int(m_fp.group(1)) if m_fp else 1,
            'forceSensitive': bool(force) or 'Force Sensitive? Yes' in flow,
            'equipment': text.get('Equipment', ''),
            'background': text.get('Background', ''),
            'note': text.get('Note', ''),
            'personality': text.get('Personality', ''),
            'objectives': text.get('Objectives', ''),
            'quote': text.get('A Quote', ''),
            'connection': text.get('Connection With Characters', ''),
            'book': 'REUP',
        })
    return vorlagen, meldungen


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('pdf')
    ap.add_argument('-o', '--out', default='pdfdata-templates.js')
    args = ap.parse_args()
    repo_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

    vorlagen, meldungen = parse(args.pdf, repo_root)
    print('\n%d templates read.\n' % len(vorlagen))

    print('%-26s %-12s %5s %5s %6s  %s'
          % ('Template', 'Species', 'Attr', 'Force', 'total', 'skills'))
    schief = 0
    for v in vorlagen:
        a = sum(v['attrs'].values())
        f = sum(v['force'].values())
        ok = (a + f) == 54 or v['name'] in NOT_18D
        if not ok:
            schief += 1
        n_sk = sum(len(x) for x in v['skills'].values()) + len(v['extraSkills'])
        print('%-26s %-12s %5s %5s %6s  %2d %s'
              % (v['name'][:26], v['species'][:12], fmt_pips(a),
                 fmt_pips(f) if f else '-', fmt_pips(a + f), n_sk,
                 '' if ok else '<<< not 18D'))
    print('\n%d of %d add up to 18D.' % (len(vorlagen) - schief, len(vorlagen)))

    for feld in ['background', 'personality', 'objectives', 'quote', 'equipment']:
        leer = [v['name'] for v in vorlagen if not v[feld]]
        if leer:
            print('No %s: %s' % (feld, ', '.join(leer)))

    print('\n--- what came out of the equipment line ---')
    print('%-26s %5s  %-46s %s' % ('Template', 'creds', 'weapons / armour', 'left as prose'))
    for v in vorlagen:
        teile = ['%s %s%s' % (w['name'], w['dmg'],
                              '' if w['kind'] == 'ranged' else ' [' + w['kind'] + ']')
                 for w in v['weapons']]
        teile += ['%s +%s/%s' % (a['name'], a['phys'] or '-', a['energy'] or '-')
                  for a in v['armor']]
        print('%-26s %5d  %-46s %s'
              % (v['name'][:26], v['credits'], '; '.join(teile)[:46],
                 ', '.join(v['gear'])[:40]))
    ohne = [v['name'] for v in vorlagen if not v['weapons'] and v['equipment']]
    print('\nNo weapon in the line: %s' % (', '.join(ohne) or '-'))

    if meldungen:
        print('\nFor review:')
        for m in meldungen:
            print('  ' + m)

    kopf = ('// Character templates from the rulebook - generated by\n'
            '// tools/extract-templates.py. Only the attributes carry dice;\n'
            '// the skills are the ones the template names, and the 7D of\n'
            '// skill dice stay with the player, exactly as in the book.\n')
    with open(args.out, 'w', encoding='utf-8', newline='') as f:
        f.write(kopf + 'const PDF_TEMPLATES = '
                + json.dumps(vorlagen, ensure_ascii=False, separators=(',', ':'))
                + ';\n')
    print('\n%s written (%d templates).' % (args.out, len(vorlagen)))


if __name__ == '__main__':
    main()
