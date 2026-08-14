# Star Wars D6 – Character, Droid & Ship Generator (2nd Edition)

**[English](#english) · [Deutsch](#deutsch)**

Three complete generators for **Star Wars: The Roleplaying Game (D6 system, 2nd Edition Revised & Expanded, West End Games)** as a web app — no installation, no build tools, just open it in a browser. Optionally with online accounts (username + password + MFA), cloud storage and sharing within your gaming group.

**Works with both rulebooks.** Character creation is identical in *2nd Edition Revised & Expanded* and in *REUP* (Revised, Expanded, Updated, Womp Rat Press 2015): same 18D attribute dice, same 7D of starting skill dice, same species values. REUP only adds material, and that material is included here — its extra skills and Force powers are simply part of the lists. Build by either book; the sheet is valid at both tables.

This project is an HTML port of the Excel workbooks by **Chance Gibboney** — see [credits](#credits--danksagung).

| | |
|---|---|
| **Characters** | `index.html` — 374 species, all skills, Force powers, equipment, lightsaber workshop |
| **Droids** | `droid.html` — degrees, 167 modifications, 393 ready-made droid templates |
| **Ships & Vehicles** | `ship.html` — 1,300 ship/vehicle templates, modification workshop, weapons, sensors |
| **NPCs** | `npc.html` — build a group role by role (6 stormtroopers, 2 officers) or a flight class by class, with compact stat blocks |

Game masters can also run **game rounds**: invite players by code, let them submit characters, and approve them for the round (the approval is stamped on the sheet). See the ☁ Online window.

---

## English

### Features

**Characters**
- **374 species + 9 near-human variants** with attribute limits, move, special abilities, story factors and page references — 60 from the original workbook plus 314 taken from the Alien Compendium, listed separately in the dropdown. Includes Trianii (m/f) and a builder for custom species
- **Rules-based creation**: 18D attribute dice (species-dependent), 7D skills (max. +2D), Force skills from the attribute pool, Character Point advancement with automatic cost calculation
- **All 90 skills**, advanced skills, specializations and custom skills
- **91 Force powers** with prerequisites, difficulties and page references
- **Lightsaber workshop** — crystals, colors, modifications with damage calculation
- **Custom species can be stored online** and then appear in the species dropdown for the whole group

**Droids** (`droid.html`)
- Five **degrees**, each with its own attribute upgrade costs
- Shared **25D starting pool** for attributes, skills *and* modifications
- **167 modifications** in 11 categories (processors, sensors, armor, weapons, medical …)
- Hard-wired **database skills**
- **393 droid templates** from the sourcebooks — apply and adjust

**Ships & Vehicles** (`ship.html`)
- **1,300 templates** (958 starships + 342 vehicles) — pick one and every base stat is filled in, weapons included
- **Modification workshop**: sublight drive, maneuverability, hyperdrive, hull, shields, weapon damage — each with install difficulty, cost as a percentage of the ship, and a growing **mishap modifier**
- Replacement drives, hyperdrives, shield generators, cargo conversions
- Up to twelve weapons with fire arc, fire control and ranges; sensors and NPC crew skills
- **Weapon picker**: 1,064 armament types collected from the ship entries in the compendia, plus the *Galaxy Guide 6* summary with price and weight — filter by scale (Starfighter, Capital, Speeder, Walker, Character), pick one, and every stat is filled in
- **Cargo space** is tracked against installed replacement systems — in kilograms for fighters, tons for freighters. Percentage upgrades cost no cargo space at all, which is exactly how starfighters get upgraded (see `ANLEITUNG.txt`)
- **Workshop** with the expanded rules from *Galaxy Guide 6: Tramp Freighters*: a mishap roller covering all five systems and three severities, the repair cost table priced against your ship, spaceport classes with docking fees, the restocking formula, overhaul costs, installation times and the linked-weapons rules

**Everywhere**
- **Portraits**: import by file or drag & drop, resized automatically, printed on the sheet
- **Save & load** in the browser (localStorage) plus JSON export/import
- **Print / PDF export**: clean sheets via the browser's print dialog
- **Bilingual**: English by default, German switchable in the ⚙ menu (the choice is remembered per browser) — including all 90 skill names, taken from the German edition ("Krieg der Sterne – Das Rollenspiel"). Characters stay interchangeable between languages because the data keeps the English names
- **Extended catalogs from the sourcebooks**: 493 weapons and 563 pieces of equipment, searchable and filterable by era
- **Online accounts** (optional, needs PHP hosting): registration, login, **MFA via authenticator app**, cloud storage and sharing with fellow players
- **An easter egg has been hiding in the app for several versions now.** No hints here — happy hunting

### Quick start (local, no server)

1. Download the project (Code → Download ZIP) or grab the [latest release](https://github.com/1Bln21/swd6-character-generator/releases) and unzip it
2. **Double-click `index.html`** — done

Everything runs in the browser; entries are stored locally and can be exported/imported as `.json`. The online features hide themselves automatically when no server is present.

### Hosting

> **Ready-made package:** the [releases page](https://github.com/1Bln21/swd6-character-generator/releases) has the complete project as a ZIP. Unzip, upload via FTP/SFTP — the runtime database (`api/data/`) is deliberately not included and is created on first use.

#### Option A: static only (no online accounts)

Upload everything **except the `api/` folder** to any web space or GitHub Pages. Done.

#### Option B: with online accounts (PHP)

| Component | Requirement |
|---|---|
| PHP | 7.4 or newer |
| Database | **SQLite** (`pdo_sqlite`, no setup) **or MySQL/MariaDB** (`pdo_mysql`) |
| Web server | Apache (uses the bundled `.htaccess`) or nginx (see note) |
| HTTPS | **Mandatory** — login data must never travel unencrypted |

1. Upload the **whole project folder** (including `api/`)
2. Pick a database:
   - **SQLite** (default): do nothing, `api/data/` is created automatically
   - **MySQL**: create a database in your hosting panel and fill in the `'db'` block at the top of `api/index.php`
3. Open the page — if the **☁ Online** button appears, everything works

**Something not working?** Open `api/check.php` in a browser. It checks PHP version, required functions, database drivers, the connection with your credentials, tables/columns, write and `ALTER` permissions, and whether auth headers reach PHP — each problem marked in red with a concrete fix. Delete the file once everything runs.

**nginx note:** the SQLite database lives in `api/data/` and is protected by `.htaccess` on Apache. On nginx add:

```nginx
location ^~ /api/data/ { deny all; }
```

**HTTPS with Let's Encrypt** — on shared hosting activate the free certificate in your panel (one click). On your own server:

```bash
sudo apt install certbot python3-certbot-apache      # or python3-certbot-nginx
sudo certbot --apache -d your-domain.com
```

Choose **“Redirect”** so HTTP forwards to HTTPS.

### User management (administrator)

The **first registered user is automatically the administrator**. In the ☁ Online window they get an extra **“Administration”** section:

- **Registration mode**: *open* · *approval required* · *closed*
- **User list** with name, registration date, status, number of entries and the *Admin* / *MFA* markers
- **Per-user actions**: approve · block · promote to admin · revoke admin · reset MFA · reset password · delete

Built-in safeguards: you cannot demote, block or delete yourself, the first account stays administrator, and the last remaining administrator cannot be removed.

### Forgotten password

The app deliberately requires **no e-mail address**, so instead of a reset link there are two ways without any mail delivery:

1. **Recovery code (self-service)** — shown once at registration (e.g. `C3F6-898F-C9A9-7A72`). Use *“Forgot your password?”* with your user name and the code.
2. **One-time code from the administrator** — generated from the user list, valid for 24 hours, handed over personally.

If MFA is enabled it is still required during a reset — a code alone does not bypass two-factor authentication. Every code is single-use, and all sessions end after a reset.

### Legal notice & privacy policy (built in)

Public sites in Germany need a legal notice and — especially with user accounts — a privacy policy. Both ship as **ready-made templates** that only need your details: ⚙ menu → **“⚖ Legal notice & privacy”**. As an administrator the details are stored server-side and apply to all visitors; without a server there is a `config.js` snippet. If you already have your own legal pages, just enter the URLs instead.

> ⚠️ **The texts are a general template without warranty and are not legal advice.** Review them before publishing.

### Security (online accounts)

- Passwords: bcrypt (`password_hash`), never in plain text
- Session tokens: stored only as SHA-256 hashes
- MFA: TOTP per RFC 6238 with QR setup, ±1 time window, **replay protection**
- **8 single-use backup codes** in case the device is lost
- Rate limiting: 8 failed attempts → 15 minute lockout
- SQL exclusively via prepared statements

### Files

| File | Purpose |
|---|---|
| `index.html` / `app.js` | Character generator |
| `droid.html` / `droid.js` | Droid generator |
| `ship.html` / `ship.js` | Ship and vehicle generator |
| `genshared.js` | Shared core for the droid and ship pages |
| `data.js` | Character game data (from the Excel workbook) |
| `gendata.js` | Droid and ship data (from the Excel workbooks) |
| `pdfdata-gear.js` | Weapons and equipment from the sourcebooks |
| `pdfdata-craft.js` | Ship and vehicle templates |
| `pdfdata-droids.js` | Droid templates |
| `online.js` | Online accounts client |
| `legal.js` | Legal notice / privacy pages |
| `config.js` | Operator configuration |
| `api/index.php` | Complete server API (PHP + SQLite/MySQL, one file) |
| `api/check.php` | Installation check |
| `tools/*.py` | Scripts that regenerate the data files from the sources |

No build step, no dependencies, no framework — vanilla JS/CSS/PHP.

### Regenerating the game data

```bash
pip install openpyxl pypdf
python tools/extract-from-excel.py   "Character Generator v2-5.xlsx"
python tools/extract-generators.py   "Droid Generator v1-3.xlsm" "Ship Generator v1-1.xlsx"
python tools/extract-from-pdfs.py    "path/to/rulebooks" ["more/folders" ...]
python tools/extract-species.py      "path/to/rp_aliens.pdf" ["more/files" ...]
```

Each script prints a summary (number of species, skills, ships …) — compare it with the previous run to spot layout changes in a new source version. The source documents themselves are **not** part of this repository.

`extract-from-pdfs.py` reads a list of sourcebooks defined in its `SOURCES` table and searches the given folders recursively, so the books may live in several places. Every catalog entry records which book it came from and which era it belongs to, which is what the era filter in the app uses.

Books currently read: the fan compendia (weapons, equipment, droids, starships, vehicles), *Galaxy Guide 16: The Old Republic*, the CEC Compendium, *Starships & Speeders*, the *Dark Empire* sourcebook and the Saga-Edition conversions (KotOR, Clone Wars, Rebellion Era, Legacy Era, Starships of the Galaxy, Scavenger's Guide to Droids).

Two scanned books are deliberately **not** included: *Stock Ships* and *Galaxy Guide 6* have text layers so damaged that ship names arrive as `R.eekeene's R.etribution`, and *Galladinium's Fantastic Technology* and *Pirates & Privateers* have no text layer at all. Running them through a proper OCR first (e.g. `ocrmypdf`) would make them usable — the `SOURCES` table has commented-out entries ready. The modification rules from *Galaxy Guide 6* are already in the app: they were transcribed by hand into `shiprules.js`.

---

## Deutsch

Drei vollständige Generatoren für **Star Wars: Das Rollenspiel (D6-System, 2nd Edition Revised & Expanded, West End Games)** als Web-App – ohne Installation, ohne Build-Werkzeuge, direkt im Browser. Optional mit Online-Konten (Benutzername + Passwort + MFA), Cloud-Speicherung und Freigaben für die Spielrunde.

**Passt zu beiden Regelwerken.** Die Charaktererschaffung ist in der *2nd Edition Revised & Expanded* und in *REUP* (Revised, Expanded, Updated, Womp Rat Press 2015) identisch: dieselben 18D Attributwürfel, dieselben 7D Fertigkeitswürfel, dieselben Spezieswerte. REUP ergänzt nur, und diese Ergänzungen sind hier enthalten – die zusätzlichen Fertigkeiten und Machtkräfte stehen einfach mit in den Listen. Bau nach dem Buch deiner Wahl; der Bogen gilt an beiden Tischen.

Das Projekt ist die HTML-Portierung der Excel-Tabellen von **Chance Gibboney** – siehe [Danksagung](#credits--danksagung).

### Was drin ist

**Charaktere** (`index.html`) – 374 Spezies (60 aus der Excel, 314 weitere aus dem Alien Compendium, im Dropdown getrennt aufgeführt) + 9 Near-Human-Varianten, regelkonforme Erschaffung (18D Attribute, 7D Fertigkeiten, Machtfertigkeiten aus dem Attributs-Pool, Steigerung per Charakterpunkten), alle 90 Fertigkeiten, 91 Machtkräfte, Lichtschwert-Werkstatt. **Eigene Spezies lassen sich online speichern** und stehen dann der ganzen Gruppe im Dropdown zur Verfügung.

**Droiden** (`droid.html`) – fünf Degrees mit eigenen Steigerungskosten, gemeinsamer 25D-Startpool für Attribute, Fertigkeiten *und* Modifikationen, 167 Modifikationen in 11 Kategorien, fest verdrahtete Datenbank-Fertigkeiten sowie **393 fertige Droidenmodelle** aus den Regelwerken.

**Schiffe & Fahrzeuge** (`ship.html`) – **1.300 Vorlagen** (958 Raumschiffe + 342 Fahrzeuge): auswählen und alle Grundwerte samt Bewaffnung sind gefüllt. Dazu die Umbau-Werkstatt (Antrieb, Manövrierfähigkeit, Hyperantrieb, Hülle, Schilde, Waffenschaden) mit Einbau-Schwierigkeit, Kosten in Prozent des Schiffswerts und steigendem **Pannen-Modifikator**, Ersatzteile, bis zu zwölf Waffen, Sensoren und Crew-Skills. Die Bewaffnung lässt sich aus einem **Waffen-Katalog** übernehmen: 1.064 Typen aus den Schiffsbeschreibungen der Sammelbände plus die Übersicht aus *Galaxy Guide 6* mit Preis und Gewicht, filterbar nach Größenklasse. Dazu die **Werkstatt** mit den erweiterten Regeln aus *Galaxy Guide 6: Tramp Freighters*: Pannen auswürfeln für alle fünf Systeme und drei Schweregrade, Reparaturkosten-Tabelle auf den eigenen Schiffswert gerechnet, Raumhafen-Klassen mit Liegegebühren, Vorratsformel, Überholungskosten, Einbauzeiten und die Regeln für gekoppelte Waffen.

**NPCs** (`npc.html`) – erzeugt ganze **NPC-Gruppen mit kompakten Statblöcken**. Die Truppe wird **rollenweise** zusammengestellt: je Zeile eine Fraktion mit eigener Anzahl, also etwa 6 Sturmtruppen, 2 Offiziere und 3 Söldner in einer Gruppe. Dazu Spezies-Modus (nur Menschen / gemischt / eine Spezies / nur Aliens) und Erfahrungsstufe; bei „gemischt“ stellt der Mensch-Anteil Star-Wars-typisch die Mehrheit. Genauso für **Schiffe**: Anzahl je Klasse (Jäger, Space Transport, Capital), je Klasse getrennt wählbar, ob alle Schiffe baugleich sein sollen, und ein Ära-Filter für den Vorlagenpool. Mehrere Karten pro Druckseite.

**Spielrunden** – Spielleiter können eine Runde eröffnen, Spieler per Einladungscode aufnehmen, deren angemeldete Charaktere ansehen und **für die Runde freigeben** – die Freigabe erscheint als Stempel auf dem Bogen (☁-Online-Fenster).

**Easteregg** – seit einigen Versionen steckt eins in der App. Wo, wird hier nicht verraten: viel Spaß beim Suchen.

**Überall** – Bild-Import per Datei oder Drag & Drop, Speichern im Browser plus JSON-Export, Druck-/PDF-Bögen, zweisprachige Oberfläche (Englisch als Standard, Deutsch im ⚙-Menü) samt aller 90 Fertigkeitsnamen nach der deutschen Ausgabe „Krieg der Sterne – Das Rollenspiel“, durchsuchbare **erweiterte Kataloge** mit 493 Waffen und 563 Ausrüstungsgegenständen, nach Ära filterbar sowie optionale **Online-Konten** mit MFA, Cloud-Speicherung und Freigaben.

### Schnellstart

ZIP von der [Releases-Seite](https://github.com/1Bln21/swd6-character-generator/releases) laden, entpacken, **`index.html` doppelklicken**. Fertig – alles läuft lokal im Browser.

### Hosting

Für die Online-Funktionen den kompletten Ordner (inkl. `api/`) auf einen Webspace mit **PHP 7.4+** laden. Als Datenbank genügt **SQLite** (keine Einrichtung); wo das nicht verfügbar ist, den `'db'`-Block oben in `api/index.php` mit **MySQL**-Zugangsdaten füllen. **HTTPS ist Pflicht.** Klemmt etwas: `api/check.php` im Browser aufrufen – die Seite prüft alles Nötige und nennt zu jedem Problem die Lösung.

Der **zuerst registrierte Benutzer ist Administrator** und kann die Registrierung auf *offen*, *mit Freigabe* oder *geschlossen* stellen, Benutzer verwalten, MFA und Passwörter zurücksetzen. Impressum und Datenschutzerklärung bringt die App als ausfüllbare Vorlage mit (⚙-Menü).

Alle Details stehen im englischen Teil oben – die Abschnitte *Hosting*, *User management*, *Forgotten password* und *Security* gelten unverändert.

---

## Credits & Danksagung

- **Chance Gibboney** – author of the original Excel workbooks (*Character Generator v2-5*, *Droid Generator v1-3*, *Ship Generator v1-1*). This project would not exist without his work: all game data and the creation logic originate from his spreadsheets, and he kindly gave his permission for this web app. **Thank you!**
  *Autor der Original-Excel-Tabellen. Sämtliche Spieldaten und die Erschaffungslogik stammen aus seiner jahrelangen Arbeit; er hat der Nutzung für diese Web-App ausdrücklich zugestimmt. Vielen Dank!*
- **The Star Wars D6 fan community** for the *rp_\** compilations (weapons, equipment, droids, starships, vehicles) that feed the extended catalogs.
- **Kazuhiko Arase** for [qrcode-generator](https://github.com/kazuhikoarase/qrcode-generator) (MIT).
- **West End Games** for *Star Wars: The Roleplaying Game* (D6).

## Disclaimer

This is a non-commercial **fan project** for the private gaming table. Not affiliated with Lucasfilm Ltd., The Walt Disney Company or West End Games. *Star Wars* and all related names are trademarks of their respective owners. The included game values are a play aid for the 2nd Edition and do not replace the rulebooks.

*Nicht-kommerzielles Fan-Projekt für den privaten Spieltisch, ohne Verbindung zu Lucasfilm Ltd., Disney oder West End Games. Die enthaltenen Spielwerte ersetzen die Regelbücher nicht.*

## License

[MIT](LICENSE)
