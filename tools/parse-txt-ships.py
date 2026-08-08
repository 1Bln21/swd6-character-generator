# -*- coding: utf-8 -*-
"""
=============================================================================
 Schiffe aus einer gesammelten Textdatei in pdfdata-craft.js einpflegen
=============================================================================

 Der Nutzer sammelt Schiffe von verschiedenen Fan-Seiten und legt sie als
 Textdatei ab (new ships.txt). Bloecke sind durch eine Unterstrichzeile
 getrennt, innerhalb eines Blocks steht "Feld: Wert" - allerdings mit den
 Schwankungen, die man bei zusammenkopierten Quellen erwartet:

   * Der Name steht mal unter "Name:", mal unter "Craft:", mal unter
     "Model:", gelegentlich sogar unter "Type:".
   * "Hyperdrive:" vs. "Hyperdrive Multiplier:", "Space:" vs. "Space Range:",
     "Fire Arc:" mit mehreren Winkeln ("2 front, 3 left").
   * Sensor- und Waffenbloecke sind eingerueckt, unterschiedlich tief, und
     die Waffen tragen ihre Unterfelder in wechselnder Reihenfolge.
   * Tippfehler und OCR-Reste: "Fire Control: 20" statt "2D", "Passive: 15/00"
     statt "15/0D", "Hull: XD" (Wert fehlt in der Quelle).

 Das Skript parst so viel wie moeglich, meldet den Rest und schreibt NICHTS,
 solange --write nicht gesetzt ist. Bloecke, deren Pflichtwerte fehlen,
 landen im Bericht statt still im Katalog.

 Aufruf:
   python tools/parse-txt-ships.py "new ships.txt"            # Trockenlauf
   python tools/parse-txt-ships.py "new ships.txt" --write    # einpflegen
=============================================================================
"""
import json, re, sys, os, bisect

CRAFT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "pdfdata-craft.js")
BOOK = "Community Additions"

SCALES = ["Character", "Speeder", "Walker", "Starfighter", "Capital"]
ARCS = ["Front", "Right", "Left", "Back", "Turret"]
HYPER_MULTS = ["None", "x0.5", "x0.75"] + ["x%d" % n for n in range(1, 21)] + ["x25", "x1.5", "x1.8"]
PILOT_SKILLS = ["Archaic Starship Piloting", "Capital Ship Piloting", "Ground Vehicle Operation",
                "Hover Vehicle Operation", "Repulsorlift Operation", "Space Transports",
                "Starfighter Piloting", "Swoop Operation", "Walker Operation"]
# Die Quellen schreiben denselben Skill sehr unterschiedlich ("Starfighter
# Pilot", "Starship Piloting", "Space Transport Piloting"). Reihenfolge zaehlt:
# "capital ship" muss vor "starship" greifen, sonst landet ein Grosskampfschiff
# beim Jaeger-Skill.
SKILL_ALIASES = [
    (r"capital\s*ship", "Capital Ship Piloting"),
    (r"space\s*transport", "Space Transports"),
    (r"archaic", "Archaic Starship Piloting"),
    (r"starfighter", "Starfighter Piloting"),
    (r"starship\s*pilot", "Starfighter Piloting"),
    (r"walker", "Walker Operation"),
    (r"repulsorlift", "Repulsorlift Operation"),
]

# --------------------------------------------------------------------------
# Kleinkram

def dice_pips(s):
    """'4D+1' -> 13, '0D+2' -> 2, '2D' -> 6. Unlesbares -> None."""
    if not s:
        return None
    m = re.match(r"\s*(\d+)\s*D\s*(?:\+\s*(\d+))?", str(s), re.I)
    if not m:
        return None
    return int(m.group(1)) * 3 + int(m.group(2) or 0)

def norm_dice(s):
    """Vereinheitlicht Wuerfelangaben und faengt die '20'-statt-'2D'-Tippfehler."""
    if not s:
        return ""
    s = str(s).strip()
    m = re.match(r"^(\d+)\s*[DO0]\s*(?:\+\s*(\d+))?$", s, re.I)
    if m:
        return "%sD%s" % (m.group(1), "+" + m.group(2) if m.group(2) else "")
    return s

def clean(s):
    """Typografische Anfuehrungszeichen und Gedankenstriche vereinheitlichen."""
    return (s.replace("‘", "'").replace("’", "'")
             .replace("“", '"').replace("”", '"')
             .replace("–", "-").replace("—", "-")).strip()

def num(s):
    m = re.search(r"([\d.,]+)", str(s or ""))
    if not m:
        return 0
    v = m.group(1).replace(",", "").rstrip(".")
    try:
        return int(float(v))
    except ValueError:
        return 0

# --------------------------------------------------------------------------
# Aera raten

ERA_HINTS = [
    ("old-republic", r"high republic|jedi civil war|sith war|old republic|great galactic war|"
                     r"mandalorian wars|kotor|knights of the old"),
    ("rise-empire",  r"clone wars|separatist|confederacy|grand army of the republic|"
                     r"galactic republic|trade federation|death watch|geonosis|bad batch"),
    ("new-republic", r"new republic|first order|resistance|thirty years after|legacy era|"
                     r"yuuzhan vong|after the battle of endor"),
    ("rebellion",    r"galactic civil war|rebel alliance|galactic empire|imperial|"
                     r"battle of yavin|battle of hoth|battle of endor|black sun"),
]

def guess_era(text):
    low = text.lower()
    hits = [(era, len(re.findall(pat, low))) for era, pat in ERA_HINTS]
    hits = [h for h in hits if h[1]]
    if not hits:
        return ""
    hits.sort(key=lambda h: -h[1])
    return hits[0][0]

# --------------------------------------------------------------------------
# Feldzugriff

def field(block, *keys):
    for k in keys:
        m = re.search(r"^[ \t]*" + k + r"[ \t]*:[ \t]*(.*)$", block, re.I | re.M)
        if m and m.group(1).strip():
            return clean(m.group(1))
    return ""

def parse_sensors(block):
    out = {}
    for key in ("Passive", "Scan", "Search", "Focus"):
        v = field(block, key)
        if v:
            # '15/00' ist ein OCR-Rest fuer '15/0D'
            v = re.sub(r"/(\d)0$", r"/\g<1>D", v)
            v = re.sub(r"/\+(\d)$", r"/0D+\1", v)
            out[key] = v
        else:
            out[key] = ""
    return out

# "ammo", "rate of fire" usw. gehoeren ZUR Waffe. Fehlen sie hier, beginnt das
# Skript bei so einer Zeile eine neue Waffe - und der danach folgende Schaden
# landet an der Geisterwaffe statt am Torpedowerfer.
WEAPON_SUBFIELDS = ("fire arc", "fire control", "firecontrol", "space", "space range",
                    "atmosphere range", "atmosphere", "damage", "skill", "crew", "scale",
                    "ammo", "ammunition", "rate of fire", "rof", "range", "capacity",
                    "missiles", "payload", "location", "atmospheric range", "space rage",
                    "atmoshpere range", "fire rate", "arc", "notes", "note")

def parse_weapons(block):
    """Der Waffenteil beginnt bei 'Weapons:' und endet beim naechsten Absatz,
       der wie Fliesstext aussieht (Description/Background/Capsule/Game Note)."""
    m = re.search(r"^[ \t]*Weapons?[ \t]*:?[ \t]*$|^[ \t]*Weapons?[ \t]*:[ \t]*(.+)$",
                  block, re.I | re.M)
    if not m:
        return [], []
    rest = block[m.end():]
    stop = re.search(r"^[ \t]*(Description|Background|Capsule|Game Note|Sources?|Appearances|"
                     r"Starfighter Compliment|Standard Wing|Capacity|Equipment|Leech Craft)[ \t]*:?",
                     rest, re.I | re.M)
    if stop:
        rest = rest[:stop.start()]

    lines = [l.rstrip() for l in rest.splitlines()]
    weapons, cur = [], None
    for line in lines:
        s = line.strip()
        if not s:
            continue
        kv = re.match(r"^([A-Za-z][A-Za-z /]*?)\s*:\s*(.*)$", s)
        key = kv.group(1).strip().lower() if kv else ""
        if kv and key in WEAPON_SUBFIELDS:
            if cur is None:                      # Unterfeld ohne Kopfzeile
                continue
            cur.setdefault(key, kv.group(2).strip())
        else:
            if cur:
                weapons.append(cur)
            cur = {"name": clean(s)}
    if cur:
        weapons.append(cur)

    # Manche Eintraege haengen Fliesstext an den Waffenteil an ("Stealth Hull:
    # ...", Patzertabellen, Munitionslisten). Ohne Schaden, Feuerkontrolle UND
    # Reichweite ist es keine Waffe, sondern Prosa - die gehoert in die Notizen.
    prose, real = [], []
    for w in weapons:
        if any(w.get(k) for k in ("damage", "fire control", "firecontrol", "space range", "space")):
            real.append(w)
        else:
            prose.append(w["name"])
    weapons = real

    out = []
    for w in weapons:
        name = re.sub(r"^\d+\s*[x*]\s*", lambda mm: mm.group(0), w["name"])   # '3 x ...' behalten
        arc_raw = w.get("fire arc", "")
        arc = ""
        for a in ARCS:
            if re.search(r"\b" + a + r"\b", arc_raw, re.I):
                arc = a
                break
        if not arc and re.search(r"forward", arc_raw, re.I):
            arc = "Front"
        if not arc and re.search(r"rear", arc_raw, re.I):
            arc = "Back"
        scale = ""
        for sc in SCALES:
            if re.search(r"\b" + sc + r"\b", w.get("scale", ""), re.I):
                scale = sc
                break
        skill = w.get("skill", "")
        if re.search(r"capital", skill, re.I):
            skill = "Capital ship gunnery"
        elif re.search(r"missile", skill, re.I):
            skill = "Starship gunnery"
        elif skill:
            skill = "Starship gunnery"
        out.append({
            "name": name, "arc": arc or "Front", "skill": skill or "Starship gunnery",
            "crew": w.get("crew", ""), "fireControl": norm_dice(w.get("fire control") or w.get("firecontrol", "")),
            "spaceRange": w.get("space range") or w.get("space", ""),
            "atmRange": w.get("atmosphere range") or w.get("atmosphere", ""),
            "damage": norm_dice(w.get("damage", "")), "scale": scale,
            "_arcRaw": arc_raw,
        })
    return out, prose

# --------------------------------------------------------------------------

def parse_block(block):
    warn = []
    name = field(block, "Name", "Craft", "Model", "Type")
    name = re.sub(r"^(Craft|Model|Type|raft)\s*:\s*", "", name, flags=re.I)
    if not name:
        return None, ["kein Name"]

    craft = field(block, "Craft", "Model") or name
    craft = re.sub(r"^(Craft|Model|raft)\s*:\s*", "", craft, flags=re.I)

    scale = ""
    sc = field(block, "Scale")
    for s in SCALES:
        if s.lower() in sc.lower():
            scale = s
            break
    if not scale:
        # Die Quelle schweigt. Aus dem Pilot-Skill ableiten statt leer lassen -
        # ohne Groessenklasse laedt die Vorlage sonst unbrauchbar.
        scale = "Capital" if re.search(r"capital", field(block, "Skill"), re.I) else "Starfighter"
        warn.append("Scale fehlt - aus dem Skill auf %s geschlossen" % scale)

    skill_raw = field(block, "Skill")
    skill = ""
    if skill_raw:
        head = re.split(r"[:–-]", skill_raw, maxsplit=1)[0].strip()
        for pat, target in SKILL_ALIASES:
            if re.search(pat, head, re.I):
                spec = skill_raw[len(head):].lstrip(" :-–").strip()
                skill = target + (": " + spec if spec else "")
                break
        if not skill:
            warn.append("Pilot-Skill unbekannt (%r)" % skill_raw)
            skill = skill_raw

    hull = norm_dice(field(block, "Hull"))
    shields = norm_dice(field(block, "Shields", "Shield"))
    maneuver = norm_dice(field(block, "Maneuverability", "Manoeuvrability", "Maneuver"))
    hp, sp, mp = dice_pips(hull), dice_pips(shields), dice_pips(maneuver)
    if hp is None:
        warn.append("Huelle unlesbar (%r)" % hull)
    if sp is None and shields and not re.match(r"^\s*(none|no|-)\s*$", shields, re.I):
        warn.append("Schilde unlesbar (%r)" % shields)

    extra_notes = []

    def hyper_val(raw, label):
        """'x2 (attached pod)' -> 'x2' plus Notiz; 'N/A', 'No' -> leer."""
        if not raw or re.match(r"^\W*(no|none|n\W*a|kein)\b", raw, re.I):
            return ""
        paren = re.search(r"\(([^)]*)\)", raw)
        core = re.sub(r"\([^)]*\)", "", raw).strip().lower().replace("x ", "x")
        core = re.sub(r"^(x?)([\d.]+)$", lambda m: "x" + m.group(2), core)
        if paren:
            extra_notes.append("%s: %s" % (label, paren.group(1).strip()))
        if core and core not in HYPER_MULTS:
            warn.append("%s ausserhalb der Liste (%r)" % (label, core))
            extra_notes.append("%s laut Quelle: %s" % (label, raw))
            return ""
        return core

    hyper = hyper_val(field(block, "Hyperdrive Multiplier", "Hyperdrive"), "Hyperantrieb")
    backup = hyper_val(field(block, "Hyperdrive Backup", "Backup Hyperdrive", "Hyperdrive backup"),
                       "Backup-Hyperantrieb")

    cost_raw = field(block, "Cost")
    cost = 0
    mnew = re.search(r"([\d.,]+)\s*(?:million\s*)?(?:credits?\s*)?\(new", cost_raw, re.I)
    if mnew:
        cost = num(mnew.group(1))
        if re.search(r"million", cost_raw, re.I):
            cost = int(float(mnew.group(1).replace(",", "")) * 1_000_000)
    elif cost_raw and not re.search(r"not (available|for sale)", cost_raw, re.I):
        cost = num(cost_raw)
        if re.search(r"million", cost_raw, re.I):
            cost = int(float(re.search(r"([\d.]+)", cost_raw).group(1)) * 1_000_000)

    atmo = field(block, "Atmosphere")
    if re.search(r"cannot enter", atmo, re.I):
        atmo = "N/A"

    weapons, prose = parse_weapons(block)
    for p in prose:
        extra_notes.append(p if len(p) <= 200 else p[:197] + "...")
    for w in weapons:
        raw = w.pop("_arcRaw", "")
        if "," in raw:
            # Der Katalog kennt je Waffe genau EINEN Winkel. Den ersten nehmen und
            # die volle Angabe in die Notizen, damit die Batterie nicht verschwindet.
            extra_notes.append("%s - Feuerwinkel laut Quelle: %s" % (w["name"], raw))
            warn.append("mehrere Feuerwinkel: %s" % w["name"][:32])
    if hp is None:
        extra_notes.append("Huelle in der Quelle nicht angegeben (%s)" % (hull or "-"))
    if sp is None and shields and not re.match(r"^\s*(none|no|-)\s*$", shields, re.I):
        extra_notes.append("Schilde in der Quelle nicht angegeben (%s)" % shields)

    entry = {
        "name": name, "craft": craft, "type": field(block, "Type", "Class"),
        "scale": scale, "length": field(block, "Length"), "skill": skill,
        "crew": field(block, "Crew"), "crewSkill": field(block, "Crew Skill"),
        "passengers": field(block, "Passengers", "Passengers/Security", "Passengers/Troops"),
        "cargo": field(block, "Cargo Capacity", "Cargo"),
        "consumables": field(block, "Consumables"),
        "cost": cost, "costText": cost_raw,
        "hyper": hyper, "hyperBackup": backup,
        "nav": "Yes" if re.match(r"^\s*(y|yes)\b", field(block, "Nav Computer"), re.I) else "",
        "maneuver": maneuver, "space": field(block, "Space"), "atmosphere": atmo,
        "hull": hull, "shields": shields, "move": "", "cover": "",
        "affiliation": "General", "source": "Community Additions",
        "notes": "\n".join(extra_notes),
        "sensors": parse_sensors(block),
        "weapons": weapons,
        "kind": "ship", "book": BOOK, "era": guess_era(block),
        "hullPips": hp or 0, "shieldPips": sp or 0, "maneuverPips": mp or 0,
    }
    return entry, warn

# --------------------------------------------------------------------------

def load_catalog():
    s = open(CRAFT, encoding="utf-8", newline="").read()
    i = s.index("[", s.index("PDF_SHIPS"))
    j = s.index("const PDF_VEHICLES")
    end = s.rindex("]", i, j) + 1
    arr = s[i:end]
    ships = json.loads(arr.replace("\r\n", "\n"))
    assert json.dumps(ships, indent=1, ensure_ascii=False).replace("\n", "\r\n") == arr, \
        "pdfdata-craft.js laesst sich nicht verlustfrei neu schreiben"
    return s, i, end, ships

def main():
    if len(sys.argv) < 2:
        print(__doc__)
        return 1
    src = sys.argv[1]
    write = "--write" in sys.argv
    txt = open(src, encoding="utf-8").read()
    blocks = [b.strip() for b in re.split(r"\n\s*_{3,}\s*\n", txt) if b.strip()]

    s, i, end, ships = load_catalog()
    have = {x["name"].strip().lower(): x for x in ships}

    # Der Katalog fuehrt viele Schiffe OHNE Herstellernamen ("Cantwell-class
    # Arrestor Cruiser"), die Textdatei MIT ("Kuat Drive Yards Cantwell-class
    # Arrestor Cruiser"). Ein reiner Namensvergleich uebersieht das. Deshalb
    # zusaetzlich ueber den Kern des Namens vergleichen: Hersteller-Vorspann,
    # Klassen-Zusaetze und Fuellwoerter weg, Rest normalisiert.
    MAKERS = (r"incom(-freitek)?|freitek|frei'?tek|koensayr( manufacturing)?|kuat( drive yards| systems"
              r" engineering)?|corellian engineering( corporation)?|cec|sorosuub( corporation)?|"
              r"subpro|sienar(-chall)?|cygnus spaceworks|slayn & korpil|gallofree yards,? inc\.?|"
              r"mandalmotors|arakyd industries|ubrikkian( industries)?|haor chall engineering|"
              r"lantillian shipwrights|baktoid armor workshop|damorian manufacturing corporation|"
              r"xizor transport systems|mon calamari shipyards|rencraft industries|zentine dynamics|"
              r"star forge manufacture|hoersch-kessel drive|latero spaceworks|sacul (industries|aerospace)|"
              r"amalgamated hyperdyne|sublight products corporation|nubia star drives inc|"
              r"kalevalan spaceworks|republic sienar systems|tay industries|daystar craft|"
              r"buuper torsckil abbey devices|variax shipyards|feethan ottraw\s+scalable assemblies|"
              r"tarrvin-on-kallik|starypon/sunhui spacework|corellia mining corporation|"
              r"mandalorian (neo-crusader war forges|protectorate)|elaor propulsion|"
              r"valkeri (enterprises|consolidated enterprises)|republic fleet|preox-morlana|"
              r"ferrix field yards|cignus spaceworks|modified|model|craft|type")

    def core_name(n):
        n = n.lower()
        n = re.sub(r"^(?:" + MAKERS + r")\b[\s'/-]*", "", n)
        n = re.sub(r"^(?:" + MAKERS + r")\b[\s'/-]*", "", n)   # zweiter Vorspann
        n = re.sub(r"\b(class|type|-class|-type|starfighter|fighter|freighter|transport|shuttle|"
                   r"cruiser|frigate|carrier|yacht|interceptor|bomber|hauler|courier)\b", " ", n)
        n = re.sub(r"[^a-z0-9]+", "", n)
        return n

    core = {}
    for x in ships:
        core.setdefault(core_name(x["name"]), []).append(x)

    parsed, skipped, dupes, near, replaced = [], [], [], [], []
    seen, seen_core = set(), set()
    for b in blocks:
        e, warn = parse_block(b)
        if e is None:
            skipped.append(("?", warn))
            continue
        key = e["name"].strip().lower()
        if key in have:
            dupes.append((e["name"], "steht schon im Katalog [%s]" % have[key]["book"]))
            continue
        if key in seen:
            dupes.append((e["name"], "kommt in der Textdatei doppelt vor"))
            continue
        ck = core_name(e["name"])
        if ck and ck in core:
            # Standardmaessig NICHT einfuegen: das waere derselbe Kahn unter zwei
            # Namen. Echte Varianten (T-65B vs. T-65C-A2) haben verschiedene
            # Kerne und laufen hier gar nicht auf.
            near.append((e["name"], ", ".join(x["name"] for x in core[ck][:2])))
            if "--replace-near" in sys.argv:
                # Die Textdatei ist handverlesen, der Katalogeintrag stammt aus
                # der Texterkennung. Werte also ersetzen - aber den EINGETRAGENEN
                # NAMEN behalten, damit die Vorlage dort bleibt, wo sie gesucht
                # wird, und die Herkunftsangabe des Buches nicht verlorengeht.
                tgt = core[ck][0]
                # Normalerweise gewinnt der eingetragene Name - dort wird die
                # Vorlage gesucht. Ist er aber selbst abgeschnitten ("Nu Attack",
                # "Blade-32"), gewinnt der Name aus der Textdatei ohne den
                # Herstellervorspann. Bedingung: er enthaelt jedes Wort des alten
                # und hat mehr davon, sonst bleibt es beim alten.
                cand = e["name"]
                for _ in range(2):        # "Incom/Subpro ..." nennt zwei Hersteller
                    cand = re.sub(r"^(?:" + MAKERS + r")\b[\s'/-]*", "", cand, flags=re.I).strip()
                words = lambda x: set(w for w in re.split(r"[^A-Za-z0-9]+", x.lower()) if w)
                keep_name = tgt["name"]
                if cand and words(keep_name) < words(cand):
                    keep_name = cand
                keep_book = tgt["book"]
                keep_era = tgt.get("era") or e.get("era", "")
                tgt.clear()
                tgt.update(e)
                tgt["name"] = keep_name
                tgt["book"] = keep_book
                tgt["era"] = keep_era
                tgt["notes"] = ("\n".join(x for x in [
                    e.get("notes", ""),
                    "Werte 2026 aus der Sammlung des Betreibers ersetzt (vorher aus der "
                    "Texterkennung des Sammelbands); dort gefuehrt als: " + e["name"],
                ] if x)).strip()
                replaced.append((e["name"], keep_name))
                continue
            if "--include-near" not in sys.argv:
                continue
        seen.add(key)
        seen_core.add(ck)
        parsed.append((e, warn))

    print("Bloecke: %d | uebernommen: %d | Dubletten: %d | verworfen: %d"
          % (len(blocks), len(parsed), len(dupes), len(skipped)))
    if dupes:
        print("\n-- Dubletten (nicht eingefuegt) --")
        for n, why in dupes:
            print("   %-52s %s" % (n[:52], why))
    if replaced:
        print("\n-- vorhandene Eintraege ERSETZT (Name und Buchangabe bleiben) --")
        for src_n, tgt_n in replaced:
            print("   %-52s -> %s" % (src_n[:52], tgt_n))
    if near and not replaced:
        print("\n-- AEHNLICH zu vorhandenen Eintraegen (NICHT eingefuegt) --")
        print("   Varianten (X-Wing, Y-Wing, Z-95 ...) sind gewollt; echte Dubletten nicht.")
        print("   --replace-near ersetzt die Werte des vorhandenen Eintrags,")
        print("   --include-near legt sie zusaetzlich als zweiten Eintrag an.")
        for n, other in near:
            print("   %-52s ~ %s" % (n[:52], other))
    warned = [(e["name"], w) for e, w in parsed if w]
    if warned:
        print("\n-- mit Anmerkung uebernommen --")
        for n, w in warned:
            print("   %-52s %s" % (n[:52], " | ".join(w)))
    if skipped:
        print("\n-- verworfen --")
        for n, w in skipped:
            print("   %-52s %s" % (n[:52], " | ".join(w)))

    if not write:
        print("\nTrockenlauf - nichts geschrieben. Mit --write einpflegen.")
        return 0
    if not parsed and not replaced:
        print("\nNichts zu tun.")
        return 0

    names = [x["name"] for x in ships]
    for e, _ in parsed:
        k = bisect.bisect_left(names, e["name"])
        ships.insert(k, e)
        names.insert(k, e["name"])
    out = s[:i] + json.dumps(ships, indent=1, ensure_ascii=False).replace("\n", "\r\n") + s[end:]
    open(CRAFT, "w", encoding="utf-8", newline="").write(out)
    print("\npdfdata-craft.js geschrieben - jetzt %d Schiffe." % len(ships))
    return 0

if __name__ == "__main__":
    sys.exit(main())
