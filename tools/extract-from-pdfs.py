# -*- coding: utf-8 -*-
"""
=============================================================================
 Kataloge aus den Regelwerk-PDFs nach pdfdata-*.js übertragen
=============================================================================

 Liest die Fanmade-Sammelbände ("rp_*") sowie eine Reihe weiterer Quellbücher
 und erzeugt daraus Auswahl-Kataloge für die Web-App:

   PDF_WEAPONS_MELEE / PDF_WEAPONS_RANGED  – Waffen für Charaktere/Droiden
   PDF_EQUIPMENT                           – Ausrüstung
   PDF_SHIPS                               – fertige Schiffs-Vorlagen
   PDF_VEHICLES                            – Fahrzeug-Vorlagen
   PDF_DROIDS                              – Droiden-Vorlagen

 Jeder Eintrag trägt zusätzlich das Quellbuch ("book") und die Ära ("era"),
 damit in der App danach gefiltert werden kann.

 Aufruf:
     python tools/extract-from-pdfs.py ORDNER [ORDNER ...]

 Die Ordner werden rekursiv nach den in SOURCES genannten Dateinamen
 durchsucht. Fehlt eine Datei, wird sie übersprungen und am Ende gemeldet.

 Benötigt: pip install pypdf

 Die PDFs selbst gehören NICHT ins Repository – sie sind Regelwerke bzw.
 Fan-Kompilationen von West End Games. Erzeugt wird ausschließlich die
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

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
# Waffennamen aus den Statbloecken - dieselben Regeln braucht auch
# repair-catalogs.py, deshalb liegen sie in einem eigenen Modul.
from weaponnames import (clean_weapon_name, plausible_weapon_name,   # noqa: E402
                         weapon_base_name, fix_apostrophes, strip_lead_punct,
                         WEAPON_COUNT_RE, WEAPON_PLURAL)

SRC_DIRS = sys.argv[1:] or ['.']

# ---------------------------------------------------------------- Quellen
# kinds: welche Parser auf das Buch losgelassen werden
# ocr:   Buch ist ein Scan – die Texterkennung liest "D" häufig als "0"
# skip:  führende Seiten (Inhaltsverzeichnis) überspringen
ERA_OLD, ERA_RISE = 'old-republic', 'rise-empire'
ERA_REB, ERA_NEW = 'rebellion', 'new-republic'

SOURCES = [
    # Datei                                    Kurzname               Ära       kinds                              ocr    skip
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
]

# ---------------------------------------------------- Bewusst nicht dabei
# Diese Bücher liegen nur als Scan vor. Ihre Textebene ist entweder gar nicht
# vorhanden oder so fehlerhaft, dass Schiffsnamen als "R.eekeene's R.etribution"
# oder "ITI5J;fi1:i1~~1T1" ankommen. Das ist ein Schaden der Texterkennung
# selbst und mit Nachbearbeitung nicht zu retten – ein paar Dutzend
# verstümmelte Einträge würden die Kataloge nur verwässern.
#
# Wer sie doch aufnehmen will, muss die PDFs zuerst sauber durch eine OCR
# schicken (z. B. ocrmypdf mit tesseract) und sie dann hier eintragen:
#
#   ('WEG40150 - Stock Ships.pdf', 'Stock Ships', ERA_REB, ('ships',), True, 0),
#   ('WEG40095 - Galaxy Guide 6 - Trampfreighters.pdf', ...)
#   ('WEG40025 - Galladiniums Fantastic Technology.pdf', ...)   # gar keine Textebene
#   ('WEG40143 - Pirates & Privateers.pdf', ...)                # gar keine Textebene
#
# Die Modifikationsregeln aus Galaxy Guide 6 stecken bereits von Hand
# gepflegt in shiprules.js – dafür wird das PDF nicht gebraucht.

LIG = {'ﬁ': 'fi', 'ﬂ': 'fl', 'ﬀ': 'ff', '’': "'", '‘': "'", '“': '"', '”': '"',
       '–': '-', '—': '-', ' ': ' ', ' ': ' '}

# Aufzählungszeichen, mit denen die Bücher ihre Statblöcke einleiten
BULLET_CHARS = '■□▪▫•●◆·'

# Die Texterkennung macht aus dem Kästchen je nach Buch ein 'm', 'mi', 'w',
# 's' oder '@'. Das darf nur als eigenständiges Zeichen VOR dem Namen weg –
# als Zeichenklasse abgezogen verliert "interceptor" sein i und
# "modifications" sein m.
OCR_BULLET = re.compile(r'^(?:mi|m|w|s|a|@|\|)\s+(?=\S)')


def clean(s):
    for a, b in LIG.items():
        s = s.replace(a, b)
    s = re.sub(r'\[\d+\]', '', s)                 # Fußnotenverweise
    return re.sub(r'[ \t]+', ' ', s).strip()


def strip_bullet(name):
    """'■ Azalus-Class Dreadnought' -> 'Azalus-Class Dreadnought'
       'mi Sensor Decoys'          -> 'Sensor Decoys'
       'interceptor'               -> 'interceptor'  (bleibt unangetastet)"""
    n = name.lstrip(BULLET_CHARS + ' ').strip()
    n = OCR_BULLET.sub('', n).strip()
    return n or name.strip()


def repair_clipped(name, ref):
    """Manchmal verliert nur die Namenszeile ihren Anfang, waehrend die
       Modellzeile heil bleibt:
         'anta Droid Subfighter' + 'Haor Chall Engineering Manta Droid Subfighter'
         -> 'Manta Droid Subfighter'
       Nur anwenden, wenn der Name wirklich das abgeschnittene Ende der
       Modellzeile ist - sonst bliebe etwa 'x1 Hyperdrive' nicht erhalten."""
    if not name or not ref or not name[0].islower():
        return name
    if ref.lower().endswith(name.lower()) and len(ref) > len(name):
        start = len(ref) - len(name)
        while start > 0 and ref[start - 1] not in ' \t-/':
            start -= 1
        return ref[start:].strip() or name
    # Nur ein einzelner Buchstabe fehlt: 'oroSuub "Firelance"' neben
    # 'SoroSuub "Firelance" Blaster Rifle'
    if ref[1:].lower().startswith(name.lower()):
        return (ref[0] + name).strip()
    # Das erste Wort ist der Rest eines Wortes aus der Modellzeile:
    # 'ary Load Lifter' + 'Cybot Galactica CLL-6 Binary Load Lifter ...'
    #   -> 'Binary Load Lifter'
    first = name.split(' ', 1)[0]
    if len(first) >= 3:
        for w in re.findall(r"[A-Za-z][\w'-]*", ref):
            if len(w) > len(first) and w.lower().endswith(first.lower()):
                return (w + name[len(first):]).strip()
    return name


def tidy_name(n):
    """Manche Bücher setzen Überschriften komplett klein oder komplett groß.
       In einer Auswahlliste liest sich das schlecht – aber nur anfassen,
       wenn die Schreibweise wirklich einheitlich ist, damit Modellkürzel
       wie 'YT-1300' oder 'TIE/ln' erhalten bleiben."""
    letters = [c for c in n if c.isalpha()]
    if letters and all(c.islower() for c in letters):
        n = n.title()
    elif letters and all(c.isupper() for c in letters) and len(n) > 5:
        n = n.title()
    # Fuehrendes Trennzeichen (von zwei per "/" verbundenen Herstellern) und
    # der vom Hersteller uebrig gebliebene Genitiv ("Corporation's Patrol
    # Cruiser" -> nach Herstellerschnitt "'s Patrol Cruiser") abraeumen.
    n = strip_lead_punct(n)
    n = re.sub(r"^['’]s\b\s*", '', n).strip()
    # .title() zieht den Buchstaben hinter dem Apostroph mit hoch:
    # "HOUND'S TOOTH" -> "Hound'S Tooth"
    return fix_apostrophes(n)


# --------------------------------------------------------- OCR-Korrektur
# Gescannte Bücher lesen das Würfelsymbol "D" regelmäßig als "0":
#   'Hull: 40'  ->  'Hull: 4D'      'Passive: 10/00' -> 'Passive: 10/0D'
# Deshalb nur in Feldern anwenden, die im D6-System immer Würfel führen.
DICE_KEYS = {'Hull', 'Shields', 'Maneuverability', 'Fire Control', 'Damage',
             'Body Strength', 'Passive', 'Scan', 'Search', 'Focus'}
OCR_LETTER = {'l': '1', 'I': '1', 'O': '0', 'S': '5'}


def ocr_dice(val):
    """'40' -> '4D', '3D+l' -> '3D+1', '10/00' -> '10/0D'"""
    def fix_token(tok):
        # 'xD' bereits korrekt erkannt: nur Ziffern-Buchstaben-Dreher glätten
        if re.fullmatch(r'\d+D(\+[\dlI])?', tok):
            return ''.join(OCR_LETTER.get(c, c) if c not in 'D+' else c for c in tok)
        # reine Zahl mit angehängter 0 -> Würfel, auch mit Pip-Zusatz ('30+' -> '3D+')
        m = re.fullmatch(r'([1-9]\d?)0(\+)?', tok)
        if m:
            return m.group(1) + 'D' + (m.group(2) or '')
        if tok == '00':
            return '0D'
        return tok
    return re.sub(r'[0-9A-Za-z+]+', lambda m: fix_token(m.group(0)), val)


KEY_RE = re.compile(r'^([A-Z][A-Za-z /\.\']{1,28}):\s*(.*)$')


def pdf_lines(path, skip_pages=0, ocr=False):
    """Alle Zeilen des PDFs, bereinigt und ohne reine Seitenzahlen."""
    reader = pypdf.PdfReader(path)
    out = []
    for pg in range(skip_pages, len(reader.pages)):
        try:
            txt = reader.pages[pg].extract_text() or ''
        except Exception:
            continue
        for ln in txt.split('\n'):
            ln = clean(ln)
            if not ln:
                continue
            if re.fullmatch(r'\d{1,3}', ln):        # Seitenzahl
                continue
            if ocr:
                m = KEY_RE.match(ln)
                if m and m.group(1) in DICE_KEYS:
                    ln = m.group(1) + ': ' + ocr_dice(m.group(2))
            out.append(ln)
    return merge_wrapped(out)


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


def join_wrapped(a, b):
    """Fortsetzungszeile anhängen. Endet die erste auf einem Trennstrich,
       gehört das Wort zusammen ('Azalus-' + 'class' -> 'Azalus-class')."""
    a = a.rstrip()
    if a.endswith('-'):
        return a + b.lstrip()
    return (a + ' ' + b).strip()


def is_continuation(ln):
    """Überschriften tragen oft einen erklärenden Zusatz in Klammern, der über
       mehrere Zeilen läuft:

           R2-D2 (Artoo-Detoo)
           (as of the Battle of Yavin - as of the Jedi Academy
           Trilogy)
           Type: Industrial Automaton R2-D2 Astromech Droid

       Die Zeile direkt über "Type:" ist dann "Trilogy)" – als Name unbrauchbar.
       Solche Fortsetzungen erkennt man an unausgeglichenen Klammern."""
    ln = ln.strip()
    if not ln:
        return True
    if ln.startswith('('):
        return True
    return ln.count(')') > ln.count('(')


def find_name(lines, idx):
    """Von der Zeile über dem Statblock aus nach oben gehen, bis eine Zeile
       gefunden ist, die als Überschrift taugt. Höchstens vier Zeilen weit –
       darüber beginnt der Fließtext des vorherigen Eintrags."""
    for back in range(1, 5):
        if idx - back < 0:
            break
        cand = lines[idx - back]
        if KEY_RE.match(cand):          # ein "Key: Wert" ist nie der Name
            break
        if is_continuation(cand):
            continue
        return cand
    return lines[idx - 1] if idx > 0 else ''


def parse_blocks(lines, start_key, extra_start=()):
    """Zerlegt in Einträge. Ein Eintrag beginnt bei der Zeile VOR start_key."""
    starts = set([start_key]) | set(extra_start)
    blocks, cur, name = [], None, None
    for idx, ln in enumerate(lines):
        m = KEY_RE.match(ln)
        if m and m.group(1) in starts:
            if cur is not None and name:
                blocks.append((name, cur))
            name = find_name(lines, idx)
            # Namenszeile darf selbst kein "Key:" sein
            if KEY_RE.match(name):
                name = ''
            name = tidy_name(strip_bullet(name))
            cur = [ln]
        elif cur is not None:
            cur.append(ln)
    if cur is not None and name:
        blocks.append((name, cur))
    return blocks


# Nur die echten Kästchen-Symbole. BULLETS enthält zusätzlich 'm' und 'i'
# für verunglückte Texterkennung – das wäre hier zu grob und würde jede
# Fortsetzungszeile abschneiden, die mit "many" oder "in" beginnt.
NEXT_ENTRY = '■□▪▫•●◆'


def kv(block_lines):
    """Key/Value-Paare mit Fortsetzungszeilen und Reihenfolge."""
    data, order, last = {}, [], None
    for ln in block_lines:
        # Beginnt hier schon der nächste Eintrag, gehört die Zeile nicht mehr
        # zum letzten Wert – sonst landet sein Name in den "Game Notes".
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
    # Reine Kapitel-/Kopfzeilen ohne Buchstaben aussortieren
    if not re.search(r'[A-Za-z]{3}', n):
        return False
    # Deckplan-Legenden ("23. Storage/Cargo Hold") stehen in den gescannten
    # Büchern direkt vor dem Statblock und wären sonst der Name.
    if re.match(r'^\d+\s*[\.\)]', n):
        return False
    return True


# ------------------------------------------------------- Plausibilität
# Zweispaltige Scans mischen Fließtext in die Statblöcke. Solche Einträge
# sind unbrauchbar und würden den Katalog verwässern – lieber verwerfen.
# Ein Würfelwert darf qualifiziert sein – "2D (+2 in atmosphere)" oder
# "1D+2 (dovin basal)" sind gültige Angaben der Bücher. Verworfen wird nur,
# was gar nicht mit einem Würfelcode beginnt: dann hat der Parser Fließtext
# erwischt statt eines Statblocks.
DICE_LEAD = re.compile(r'^\d{1,2}\s*D(\s*\+\s*\d)?\b')
MAXLEN = {'type': 120, 'scale': 40, 'length': 60, 'crew': 140, 'cargo': 90,
          'consumables': 70, 'space': 60, 'atmosphere': 90, 'move': 70,
          'hull': 70, 'shields': 70, 'maneuver': 70}


def plausible_craft(e):
    if damaged(e):
        return False
    # Ein Schiffsname faengt gross an. Bleibt er nach repair_clipped klein,
    # ist die Ueberschrift gar keine - beim "Unstable Terrain Artillery
    # Transport" stand dort der Rest einer Quellenangabe ("ebsite, The Clone
    # Wars"), und der ganze Eintrag war zeilenweise abgeschnitten.
    if (e.get('name') or ' ')[0].islower():
        return False
    for k in ('hull', 'shields', 'maneuver'):
        v = (e.get(k) or '').strip()
        if v and not DICE_LEAD.match(v):
            return False
    return True


# ------------------------------------------------------- Namen aufwerten
# Manche Buecher setzen die Gattung als Ueberschrift und nennen das Modell
# nur in der "Craft:"-Zeile - der CEC Compendium etwa fuehrt den HT-2200 als
# blosses "Medium Freighter". In einer Auswahlliste ist das wertlos: man
# liest die Bauart, nicht das Schiff. Solche Namen werden aus "Craft:"
# ersetzt, wobei der Hersteller vorn wegfaellt.
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
       -> 'HT-2200'.   Ohne brauchbares craft bleibt der Name, wie er ist."""
    if not craft or not GENRE_ONLY.match(name.strip()):
        return name
    rest = craft.strip()
    for m in MAKERS:
        if rest.lower().startswith(m.lower()):
            # Trennzeichen inkl. "/" abraeumen - manche Schiffe nennen zwei
            # Hersteller ("... Corporation/Wereling Spaceworks' Corvette").
            rest = rest[len(m):].strip(" -–/")
            break
    # "Modified ..." bleibt aussagekraeftiger als die blosse Gattung
    if not rest or GENRE_ONLY.match(rest):
        rest = craft.strip()
    return rest if rest else name


# --------------------------------------------------------- Waffennamen
def looks_like_continuation(prev, ln):
    """Ist ln die Fortsetzung der vorigen Zeile und keine neue Waffe?

    Im zweispaltigen Satz brechen sowohl Waffennamen als auch lange
    Wertangaben um:

        Fire Arc: Turret (can
        be fixed to forward to be fired by the Pilot at only
        1D fire control)

    Ohne diese Pruefung wuerde jede Folgezeile als naechste Waffe gelten -
    daher kamen Eintraege wie "gunnery", "km" oder "controlled fire)".
    """
    if not ln:
        return True
    if ln[0].islower():                       # Satz laeuft weiter
        return True
    if ln.count(')') > ln.count('('):         # schliessende Klammer ohne Anfang
        return True
    if prev and prev.count('(') > prev.count(')'):   # Klammer noch offen
        return True
    return False


def clean_weapons(weapons):
    """Bildunterschriften ("PICTURE REMOVED") und Fliesstext-Reste, die als
       Waffenname im Block landen, gehoeren nicht in die Waffenliste."""
    out = []
    for w in weapons:
        n = clean_weapon_name(w.get('name') or '')
        if not plausible_weapon_name(n):
            continue
        w['name'] = n
        # Waffennamen tragen oft einen erklaerenden Zusatz in Klammern
        # ("2 Proton Torpedo Launchers (fire separately, 12 torpedoes each)"
        # sind 63 Zeichen). Die Grenze dient nur dazu, ganze Fliesstext-
        # Absaetze abzuwehren - deshalb grosszuegig.
        if not n or len(n) > 95:
            continue
        if n.endswith('.') or n.upper() == n and len(n) > 4 and not re.search(r'\d', n):
            # Saetze enden auf Punkt; reine Grossschrift ohne Ziffer ist
            # fast immer eine Bildunterschrift ("PICTURE REMOVED")
            if n.endswith('.') or n in ('REMOVED', 'PICTURE REMOVED'):
                continue
        if not re.search(r'[A-Za-z]', n):
            continue
        # Eine Waffe bringt immer Werte mit. Bloecke laufen manchmal weiter,
        # weil im Buch danach Fliesstext statt eines neuen "Craft:" folgt -
        # dann landen ganze Absaetze als "Waffen" im Eintrag (der Basilisk
        # War Droid kam so auf 157). Ohne Schadenswert und ohne Feuerwinkel
        # ist es keine Waffe.
        if not re.search(r'\d+\s*D', w.get('damage') or '') and not (w.get('arc') or '').strip():
            continue
        out.append(w)
    return out


def trim_fields(e):
    """Zweispaltige Bücher lassen gelegentlich Text der Nachbarspalte in ein
       Feld laufen. Der vordere Teil stimmt, der Rest wird gekappt."""
    for k, lim in MAXLEN.items():
        if e.get(k) and len(e[k]) > lim:
            e[k] = cap(e[k], lim)
    return e


# In einigen zweispaltig gesetzten Büchern verliert die Textextraktion
# zeilenweise das erste Zeichen: aus "Type:" wird "ype:", aus "Scale:"
# "cale:". Ein Eintrag, in dem das auftaucht, ist durchgehend beschädigt –
# auch sein Name ("spo Riot Gu" statt "Espo Riot Gun"). Nicht reparierbar,
# also verwerfen.
TRUNCATED_KEY = re.compile(r'(?:^|\s)(ype|cale|kill|otes|amage|odel|vail|ost):')
CITATION = re.compile(r'\(page|Campaign Guide|Sourcebook \(', re.I)


def damaged(e):
    text = ' '.join(str(v) for v in e.values() if isinstance(v, str))
    # Auch die Waffenliste mitpruefen: bei Schiffen steckt der Schaden der
    # Textebene oft dort ("amage: D/5D/4D/3D" statt "Damage: 6D/5D/4D/3D"),
    # waehrend die Kopfdaten noch sauber aussehen.
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
    """'1,000 (includes ...)' -> 1000 ; nicht bezifferbar -> 0"""
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


# Die Bücher schreiben die Größenklasse uneinheitlich, und der Zeilenumbruch
# schneidet sie gern ab: "Starfigh", "Starfghter", "Chara",
# "Capital (due to power output)". Ältere Bände sagen "Starship", wo die
# 2. Edition "Starfighter" sagt. Auf die sechs Klassen des Regelwerks bringen.
SCALE_PREFIX = (('char', 'Character'), ('spee', 'Speeder'), ('sped', 'Speeder'),
                ('airspee', 'Speeder'), ('walk', 'Walker'),
                ('vehic', 'Speeder'),          # "Vehicle scale" = Speeder-Skala
                ('starf', 'Starfighter'), ('stars', 'Starfighter'),
                ('strafi', 'Starfighter'),     # Buchstabendreher im Satz
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
    """'4D+2' -> 14 Pips; '2D' -> 6"""
    if not s:
        return 0
    m = re.search(r'(\d+)\s*D\s*(?:\+\s*(\d+))?', s)
    if not m:
        return 0
    return int(m.group(1)) * 3 + int(m.group(2) or 0)


# Die Bücher schreiben die Ära unterschiedlich – auf feste Schlüssel bringen
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


REJECTED = {}          # Buch -> Anzahl verworfener Einträge


def reject(src):
    REJECTED[src.book] = REJECTED.get(src.book, 0) + 1


def cap(s, n=600):
    """Lange Regeltexte kürzen. Vollständig stehen sie im Buch – die App
       braucht nur so viel, dass der Eintrag verständlich bleibt."""
    s = (s or '').strip()
    return s if len(s) <= n else s[:n].rstrip() + ' […]'


def tag(entry, src, d):
    """Buch und Ära ergänzen. Nennt das PDF selbst eine Ära, hat sie Vorrang
       vor der Voreinstellung des Buches."""
    entry['book'] = src.book
    entry['era'] = norm_era(d.get('Era', ''), src.era)
    if d.get('Source') and not entry.get('source'):
        entry['source'] = d['Source']
    return entry


# ---------------------------------------------------------------- Waffen
def parse_weapons(lines, src):
    melee, ranged = [], []
    for name, blk in parse_blocks(lines, 'Model'):
        if not looks_like_name(name):
            continue
        d, _ = kv(blk)
        typ = d.get('Type', '')
        dmg = d.get('Damage', '')
        # Ausrüstung ohne Schadenswert gehört nicht in den Waffenkatalog
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


# ------------------------------------------------------------ Ausrüstung
def parse_equipment(lines, src):
    out = []
    for name, blk in parse_blocks(lines, 'Model'):
        if not looks_like_name(name):
            continue
        d, _ = kv(blk)
        # Waffen laufen über parse_weapons – hier alles ohne Schadenswert
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


# ------------------------------------------------- Schiffe und Fahrzeuge
WEAPON_KEYS = {'Fire Arc', 'Fire Control', 'Space Range', 'Atmosphere Range',
               'Range', 'Damage', 'Crew', 'Skill', 'Scale', 'Rate of Fire', 'Ammo'}


def parse_craft(lines, kind, src):
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

        # Waffen: Blöcke, die mit einer Nicht-Key-Zeile (Waffenname) beginnen.
        #
        # Waffennamen brechen im zweispaltigen Satz häufig um:
        #     2 Proton Torpedo Launchers (fire separately, 12 torpedoes
        #     each)
        #     Fire Arc: Front
        # Die zweite Zeile ist keine neue Waffe, sondern der Rest des Namens.
        # Erkennbar daran, dass zum bisherigen Namen noch keine einzige
        # Kennzeile gesammelt wurde – eine echte Waffe bringt immer welche mit.
        weapons, cur, wname = [], None, None
        for ln in weap_lines:
            m = KEY_RE.match(ln)
            if not m:
                if wname is not None and not cur:
                    wname = join_wrapped(wname, ln)      # Fortsetzung des Namens
                    continue
                if cur and looks_like_continuation(cur[-1], ln):
                    cur[-1] = join_wrapped(cur[-1], ln)  # Fortsetzung eines Wertes
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
            space, atm = wd.get('Space Range', ''), wd.get('Atmosphere Range', '')
            wscale = norm_scale(wd.get('Scale', ''))
            # Raumschiffe führen zwei Reichweiten ("Space Range" und
            # "Atmosphere Range"), Bodenfahrzeuge nur eine, und die heißt in
            # den Büchern schlicht "Range". Danach wurde bisher nicht gesucht –
            # deshalb stand bei fast jeder Fahrzeugwaffe keine Reichweite.
            #
            # In welche Spalte der eine Wert gehört, entscheidet der Träger:
            # Ein Fahrzeug verlässt die Atmosphäre nicht, also hat auch seine
            # Bewaffnung keine Weltraumreichweite – selbst wenn der Statblock
            # eines großen U-Boots die Waffe in Jägerskala führt. Auf einem
            # Raumschiff gilt dasselbe für alles, was in Fahrzeugskala montiert
            # ist. Nur der Rest ist wirklich eine Weltraumreichweite.
            #
            # Ob der Statblock ein Schiff oder ein Fahrzeug beschreibt, steht
            # hier noch nicht fest – das entscheidet erst split_craft weiter
            # unten. Der unsichere Fall wird deshalb vermerkt und dort
            # richtiggestellt.
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
        # Pips für die direkte Übernahme in den Generator
        entry['hullPips'] = dice_pips(entry['hull'])
        entry['shieldPips'] = dice_pips(entry['shields'])
        entry['maneuverPips'] = dice_pips(entry['maneuver'])
        if not plausible_craft(entry):
            reject(src)
            continue
        out.append(tag(trim_fields(entry), src, d))
    return out


def split_craft(items):
    """Manche Bücher mischen Raumschiffe und Bodenfahrzeuge in einem Kapitel.
       Ein Eintrag ohne Hyperantrieb und ohne Space-Wert, aber mit Move-Wert,
       ist ein Fahrzeug."""
    ships, vehicles = [], []
    for it in items:
        is_vehicle = (not it['hyper'] and not it['space'] and
                      (it['move'] or it['cover'] or
                       re.search(r'speeder|walker|tank|crawler|ground|repulsor',
                                 (it['type'] + ' ' + it['skill']).lower()) is not None))
        (vehicles if is_vehicle else ships).append(it)
    return ships, vehicles


# ------------------------------------------------------------- Droiden
ATTR_RE = re.compile(r'^(DEXTERITY|KNOWLEDGE|MECHANICAL|PERCEPTION|STRENGTH|TECHNICAL)\s+(\d+D(?:\+\d)?)',
                     re.I)
SKILL_RE = re.compile(r"([A-Za-z][A-Za-z \/'\-\(\)]*?)\s*(\d+D(?:\+\d)?)")


CHAR_STAT = re.compile(r'\b(Force Points|Character Points|Dark Side Points)\b', re.I)
ATTR_WORD = re.compile(r'\b(DEXTERITY|KNOWLEDGE|MECHANICAL|PERCEPTION|STRENGTH|TECHNICAL)\b')
# Ein Droiden-Typ endet auf "... Droid"/"... Automaton" (evtl. mit Grad oder
# einem verrutschten Wuerfelwert dahinter). "Droid engineer" dagegen hat das
# Wort mittendrin - das ist eine Person, kein Droide.
DROID_TYPE = re.compile(
    r'\b(droids?|automat(?:on|a)|mainframe computer|battle computer|droid brain)\b'
    r'[\s\W]*'
    r'(?:\(?\s*(?:1st|2nd|3rd|4th|5th|first|second|third|fourth|fifth)[- ]?'
    r'(?:degree|class)?\s*\)?)?'
    r'\s*(?:\d+D(?:\+\d)?)?\s*$', re.I)


def is_droid_typed(name, typ):
    """True, wenn Name oder Typ den Eintrag klar als Droiden ausweist -
       auch fuer benannte Droiden-Figuren wie R2-D2 oder C-3PO, die als
       Charaktere Charakterpunkte tragen, aber trotzdem Droiden sind."""
    m = ATTR_WORD.search(typ or '')
    prefix = (typ[:m.start()] if m else (typ or '')).strip()
    return bool(DROID_TYPE.search(prefix)) or \
        bool(re.search(r'\b(droid|automaton)\b', name or '', re.I))


def parse_droids(lines, src):
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
        # Helden und NPCs (Boba Fett, Luke, die Sith- und Jedi-Kaesten aus
        # GG16 ...) stehen in denselben Statblock-Kaesten wie Droiden, tragen
        # aber Macht-, Charakter- oder Dunkle-Seite-Punkte - Droiden haben so
        # etwas nie. Ausnahme: benannte Droiden-Figuren wie R2-D2 und C-3PO
        # werden als Charaktere mit Charakterpunkten gefuehrt, sind aber
        # eindeutig als Droide typisiert - die bleiben drin.
        if CHAR_STAT.search(' '.join(blk)) and not droidish:
            reject(src)
            continue
        # Kreaturen (Banthas, Akk-Hunde, Predatoren aus den Bestiarien der
        # Bücher) fuehren nur DEXTERITY/PERCEPTION/STRENGTH. Ein Droide hat
        # immer mindestens eine "maschinelle" Eigenschaft - KNOWLEDGE,
        # MECHANICAL oder TECHNICAL - oder ist ausdruecklich als Droide
        # typisiert (dann nur unvollstaendig gelesen).
        machine = any(k in attrs for k in ('kno', 'mec', 'tec'))
        if not machine and not droidish:
            reject(src)
            continue
        out.append(tag(entry_d, src, d))
    return out


# ================================================================= Ablauf
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
    except Exception as e:                      # beschädigte oder verschlüsselte Datei
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
        # Jetzt steht fest, was Schiff und was Fahrzeug ist: Eine einzelne
        # "Range:"-Angabe auf einem Fahrzeug ist immer eine atmosphärische.
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


# ------------------------------------------- Waffen-Katalog für Schiffe
# Die Bewaffnung steht in den Büchern nur innerhalb der Schiffs-Statblöcke.
# Für die Auswahlliste im Generator werden daraus die Typen gesammelt:
# gleiche Waffe, gleiche Skala, gleicher Schaden = ein Eintrag. Wie oft ein
# Typ vorkommt, entscheidet die Reihenfolge – die gängigsten zuerst.
# WEAPON_COUNT_RE, WEAPON_PLURAL und weapon_base_name stehen in
# weaponnames.py, weil repair-catalogs.py sie ebenfalls braucht.


def build_weapon_catalog(craft_items):
    """Aus allen Schiffs- und Fahrzeugblöcken einen Waffenkatalog bilden."""
    seen = {}
    for e in craft_items:
        for w in e.get('weapons', []):
            name = weapon_base_name(w.get('name', ''))
            dmg = (w.get('damage') or '').strip()
            scale = norm_scale(w.get('scale') or '') or norm_scale(e.get('scale') or '')
            if not name or len(name) < 4 or not dmg:
                continue
            if not re.match(r'^\d{1,2}D', dmg):        # kein sauberer Schadenswert
                continue
            # weapon_base_name entfernt die Stückzahl ("5 batteries rear" ->
            # "batteries rear"), erst danach wird der Rest als Phantomwaffe
            # erkennbar - deshalb hier noch einmal prüfen.
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
    """Erster Treffer gewinnt. Die Sammelbände stehen in SOURCES vorn, weil
       ihre Textebene am saubersten ist; die Spezialbücher ergänzen nur.

       Bei Schiffen und Fahrzeugen zählt zusätzlich die "Craft:"-Zeile als
       Kennung. Dasselbe Schiff steht in mehreren Büchern unter verschiedenen
       Überschriften – der HT-2200 etwa einmal als "HT-2200 Medium Freighter",
       im CEC Compendium aber nur als "Medium Freighter"."""
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

"""Ausgabe aufgeteilt, damit jede Seite nur lädt, was sie braucht:
     pdfdata-gear.js   – Waffen + Ausrüstung   (Charakter- und Droidenseite)
     pdfdata-craft.js  – Schiffe + Fahrzeuge   (Schiffsseite)
     pdfdata-droids.js – Droiden-Vorlagen      (Droidenseite)"""
APPDIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
HEAD = ('// Automatisch erzeugt aus den Regelwerk-PDFs.\n'
        '// Quelle: Star Wars D6 (West End Games) sowie Fan-Kompilationen der Community.\n'
        '// Nicht von Hand bearbeiten - stattdessen tools/extract-from-pdfs.py laufen lassen.\n')


# Reihenfolge für das Ära-Dropdown der App. Steht in jeder erzeugten Datei,
# damit die Auswahlliste nie von den tatsächlichen Daten abweicht.
ERA_ORDER = [ERA_OLD, ERA_RISE, ERA_REB, ERA_NEW]


def write_file(fname, pairs):
    p = os.path.join(APPDIR, fname)
    with open(p, 'w', encoding='utf-8') as f:
        f.write(HEAD)
        # Die Droidenseite laedt zwei dieser Dateien - ein zweites "const"
        # waere ein Syntaxfehler, deshalb nur setzen, wenn noch nicht da.
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
    print(f'  {book:<30} {detail or "nichts gefunden"}')
if REJECTED:
    print('--- Verworfen (unplausible Werte, meist zweispaltige Scans) ---')
    for book, n in sorted(REJECTED.items(), key=lambda x: -x[1]):
        print(f'  {book:<30} {n}')
if missing:
    print('--- Nicht gefunden ---')
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
