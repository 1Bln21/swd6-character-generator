# Star Wars D6 – Charaktergenerator (2nd Edition)

**[Deutsch](#deutsch) · [English](#english)**

Ein vollständiger Charaktergenerator für **Star Wars: The Roleplaying Game (D6-System, 2nd Edition Revised & Expanded, West End Games)** als Web-App – ohne Installation, ohne Build-Tools, läuft direkt im Browser. Optional mit Online-Konten (Benutzername + Passwort + MFA), Cloud-Speicherung und Charakter-Freigaben für die Spielrunde.

Das Projekt ist die HTML-Portierung der Excel-Tabelle **„Character Generator v2-5“** – siehe [Danksagung](#danksagung--credits).

---

## Deutsch

### Features

- **60 Spezies + 9 Near-Human-Varianten** mit Attributs-Grenzen, Move, Spezialfähigkeiten, Story-Faktoren und Quellenangaben – inkl. Trianii (m/w) und Baukasten für eigene Spezies
- **Regelkonforme Erschaffung**: 18D Attributswürfel (spezies-abhängig), 7D Fertigkeiten (max. +2D), Machtfertigkeiten aus dem Attributs-Pool, Steigerung per Charakterpunkten mit automatischer Kostenberechnung
- **Alle 84 Fertigkeiten**, Advanced Skills, Spezialisierungen und eigene Fertigkeiten
- **82 Machtkräfte** mit Voraussetzungen, Schwierigkeiten und Seitenangaben
- **Kataloge**: Ausrüstung, Rüstungen, Nahkampf- und Fernkampfwaffen, Sprengstoffe – plus **Lichtschwert-Werkstatt** (Kristalle, Farben, Modifikationen mit Schadensberechnung)
- **Charakterbild**: Import per Datei oder Drag & Drop, automatische Verkleinerung, erscheint auf dem Bogen
- **Speichern & Laden** im Browser (localStorage) + JSON-Export/-Import
- **Druck / PDF-Export**: sauberer Charakterbogen (2–4 A4-Seiten) über den Druckdialog des Browsers
- **Zweisprachig**: Deutsch / English, umschaltbar im ⚙-Menü
- **Online-Konten** (optional, benötigt PHP-Hosting): Registrierung, Login, **MFA per Authenticator-App** (Google/Microsoft Authenticator, Aegis, Authy …), Charaktere online speichern und **für Mitspieler freigeben**

### Schnellstart (lokal, ohne Server)

1. Projekt herunterladen (Code → Download ZIP) und entpacken
2. **`index.html` doppelklicken** – fertig

Alles läuft im Browser; Charaktere werden lokal gespeichert (localStorage) und lassen sich als `.json` exportieren/importieren. Die Online-Funktionen blenden sich ohne Server automatisch aus.

### Hosting

> **Fertiges Paket:** Auf der [Releases-Seite](https://github.com/1Bln21/swd6-character-generator/releases) gibt es das komplette Projekt als ZIP zum Download. Einfach entpacken und per FTP/SFTP hochladen – die Laufzeit-Datenbank (`api/data/`) ist bewusst nicht enthalten und wird beim ersten Aufruf automatisch angelegt.

#### Variante A: Nur statisch (ohne Online-Konten)

Alle Dateien **außer dem Ordner `api/`** auf beliebigen Webspace oder GitHub Pages laden. Fertig.

#### Variante B: Mit Online-Konten (PHP)

**Voraussetzungen:**

| Komponente | Anforderung |
|---|---|
| PHP | Version 7.4 oder neuer |
| PHP-Erweiterung | `pdo_sqlite` (bei praktisch allen Hostern Standard) |
| Webserver | Apache (nutzt mitgelieferte `.htaccess`) oder nginx (siehe Hinweis) |
| HTTPS | **Pflicht** – Login-Daten dürfen nie unverschlüsselt laufen (Let's Encrypt gibt es bei den üblichen Hostern per Klick) |

Das deckt praktisch jeden deutschen Shared-Hosting-Tarif ab (IONOS, Strato, All-Inkl, Netcup …). Eine eigene Datenbank ist **nicht** nötig – die API nutzt SQLite (eine Datei).

**Installation:**

1. Den **kompletten Projektordner** (inkl. `api/`) per FTP/SFTP hochladen
2. Sicherstellen, dass PHP in `api/data/` schreiben darf (Ordner wird beim ersten Aufruf automatisch angelegt; ggf. Schreibrechte für das `api/`-Verzeichnis setzen)
3. Seite im Browser öffnen – erscheint oben der Knopf **☁ Online**, läuft alles

**Konfiguration** – zwei Dateien:

- **`config.js`** (Frontend):
  - `apiUrl` – Pfad zur API (Standard `api/index.php`, passt beim Hochladen des ganzen Ordners)
  - `impressumUrl` / `datenschutzUrl` – Links erscheinen im Footer für alle Besucher
- **`api/index.php`** (oben im `$CONFIG`-Block):
  - `allow_register` – Registrierung erlauben (Standard: `true`)
  - `register_code` – Einladungscode; wenn gesetzt, können sich nur Personen mit diesem Code registrieren (empfohlen für private Spielrunden!)
  - `issuer` – Name, der in der Authenticator-App angezeigt wird

**nginx-Hinweis:** Die Datenbank liegt in `api/data/` und ist bei Apache per `.htaccess` gegen Direktzugriff geschützt. Bei nginx den Pfad selbst sperren:

```nginx
location ^~ /api/data/ { deny all; }
```

### Impressum & Datenschutzerklärung (eingebaut)

Öffentliche Seiten brauchen in Deutschland ein Impressum und – erst recht mit Benutzerkonten – eine Datenschutzerklärung. Beides bringt der Generator als **fertige Vorlage** mit, die nur noch mit deinen Angaben gefüllt wird:

1. ⚙-Menü → **„⚖ Impressum & Datenschutz…"** öffnen
2. Name, Anschrift, E-Mail und den Hosting-Anbieter eintragen
3. Speichern – die Links erscheinen im Footer

**Wo landen die Angaben?**

| Situation | Speicherort | Gilt für |
|---|---|---|
| Als **Administrator** angemeldet (PHP-Server) | `api/data/legal.json` | **alle Besucher** |
| Kein Server (statisches Hosting) | „`</>` config.js-Snippet"-Knopf → Block in `config.js` einfügen | alle Besucher |
| Nicht angemeldet / lokale Nutzung | Browser-Speicher | nur dieser Browser |

Administrator ist der **zuerst registrierte Benutzer**; weitere lassen sich in `api/index.php` unter `'admins'` eintragen. Wer bereits eigene Rechtsseiten hat, trägt stattdessen einfach die **URLs** ein (optional) – dann verlinkt der Footer dorthin statt auf die eingebauten Seiten.

Die Datenschutzerklärung beschreibt genau das, was diese Anwendung wirklich tut: keine Cookies zu Analysezwecken, keine externen Dienste oder CDNs, Speicherung im Browser, optionale Konten (Benutzername, bcrypt-Hash, TOTP-Schlüssel), Charakter-Freigaben, Server-Logfiles und die Betroffenenrechte nach DSGVO.

> ⚠️ **Die Texte sind eine allgemeine Muster-Vorlage ohne Gewähr und keine Rechtsberatung.** Prüfe sie vor der Veröffentlichung – im Zweifel anwaltlich.

### HTTPS aktivieren (Let's Encrypt) – Pflicht bei Online-Konten

Sobald Nutzerkonten im Spiel sind, dürfen Login-Daten **niemals unverschlüsselt** übertragen werden. HTTPS ist Pflicht. Je nach Hosting-Typ gibt es zwei Wege:

**A) Shared Hosting / Webspace** (IONOS, Strato, All-Inkl, Netcup, Hetzner Webhosting …) – der einfachste Fall:

1. Im Hosting-/Kunden-Panel den Bereich **„SSL“**, „Sicherheit“ oder „Zertifikate“ öffnen.
2. Für die Domain ein kostenloses **Let's-Encrypt-Zertifikat** aktivieren (oft ein einziger Klick, „SSL aktivieren“).
3. Falls vorhanden: **„HTTP auf HTTPS umleiten“ / „HTTPS erzwingen“** einschalten.

Nach wenigen Minuten ist die Seite unter `https://` erreichbar; die Verlängerung übernimmt der Anbieter automatisch. Bei diesen Tarifen musst du certbot **nicht** selbst installieren.

**B) Eigener Server** (VPS / Root-Server mit Apache oder nginx) – mit **certbot**:

```bash
# Debian/Ubuntu, Apache:
sudo apt update
sudo apt install certbot python3-certbot-apache
sudo certbot --apache -d deine-domain.de -d www.deine-domain.de

# … oder nginx:
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d deine-domain.de -d www.deine-domain.de
```

certbot fragt nach einer E-Mail-Adresse, richtet HTTPS automatisch ein und bietet an, HTTP nach HTTPS umzuleiten – hier **„Redirect“** wählen. Die automatische Verlängerung läuft über einen systemd-Timer/Cronjob; Test:

```bash
sudo certbot renew --dry-run
```

Voraussetzung: Die Domain zeigt bereits per DNS auf den Server, und Port 80/443 sind erreichbar. Danach die Seite ausschließlich über `https://` aufrufen.

### Sicherheit (Online-Konten)

- Passwörter: bcrypt (`password_hash`), nie im Klartext
- Login-Tokens: nur als SHA-256-Hash in der Datenbank
- MFA: TOTP nach RFC 6238 (30 s, 6 Stellen) mit QR-Code-Einrichtung, ±1 Zeitfenster, **Replay-Schutz** (jeder Code nur einmal)
- **8 einmalige Backup-Codes** für den Verlust des Geräts
- Rate-Limiting: nach 8 Fehlversuchen 15 Minuten Sperre
- SQL ausschließlich über Prepared Statements

### Technik / Dateien

| Datei | Zweck |
|---|---|
| `index.html` | Einstiegspunkt, Grundgerüst |
| `app.js` | Spiellogik, UI, Charakterbogen, i18n (DE/EN) |
| `data.js` | Alle Spieldaten (aus der Original-Excel extrahiert) |
| `online.js` | Online-Konten-Client (Login, MFA, Cloud, Freigaben) |
| `config.js` | Betreiber-Konfiguration (API-URL, Impressum/Datenschutz) |
| `qrcode.js` | QR-Code-Bibliothek (MIT, Kazuhiko Arase) |
| `style.css` | Design (App + Druckbogen) |
| `api/index.php` | Komplette Server-API (PHP + SQLite, eine Datei) |
| `ANLEITUNG.txt` | Kurzanleitung für Spieler |

Kein Build-Schritt, keine Abhängigkeiten, kein Framework – Vanilla JS/CSS/PHP.

---

## English

A complete character generator for **Star Wars: The Roleplaying Game (D6 system, 2nd Edition Revised & Expanded, West End Games)** as a web app. No installation, no build tools – just open `index.html` in a browser. Optional online accounts (username + password + **TOTP MFA** via common authenticator apps), cloud character storage and sharing with fellow players.

This project is an HTML port of the Excel workbook **"Character Generator v2-5"** – see [credits](#danksagung--credits).

**Features:** 60 species + 9 near-human variants, full rules-based character creation (attribute dice, skill dice, Character Point advancement with cost calculation), 84 skills incl. advanced skills and specializations, 82 Force powers with prerequisites, equipment/armor/weapon/explosives catalogs, a lightsaber workshop (crystals, colors, modifications), character portraits, save/load in the browser plus JSON export/import, print/PDF character sheets (2–4 pages), bilingual UI (German/English via the ⚙ menu).

**Local use:** download, unzip, double-click `index.html`. Online features hide automatically when no server is present.

**Hosting with online accounts:** upload the whole folder to any web space with **PHP 7.4+** and the `pdo_sqlite` extension (standard almost everywhere). No database setup needed – the API is a single PHP file using SQLite. **HTTPS is mandatory.** Configure `config.js` (frontend: `apiUrl`, legal links) and the `$CONFIG` block at the top of `api/index.php` (`allow_register`, `register_code` invitation code, `issuer` shown in authenticator apps). On nginx, deny access to `/api/data/` (Apache is covered by the bundled `.htaccess`).

**Security:** bcrypt password hashing, SHA-256-hashed session tokens, RFC 6238 TOTP with QR setup, replay protection, 8 single-use backup codes, rate limiting (8 failures → 15 min lockout), prepared statements only.

---

## Danksagung / Credits

- **Original-Excel „Character Generator v2-5“**: Dieses Projekt wäre ohne die großartige Vorarbeit des ursprünglichen Autors nicht denkbar. Sämtliche Spieldaten (Spezies, Fertigkeiten, Machtkräfte, Kataloge, Lichtschwert-Werkstatt) und die Erschaffungslogik stammen aus seiner Tabelle. Der Autor nennt in der Tabelle als Kontakt: **gigobyte@hotmail.com**. / This project builds on the excellent work of the original author of the "Character Generator v2-5" Excel workbook, who lists **gigobyte@hotmail.com** as contact in the workbook. All game data and the creation logic originate from that spreadsheet.
- **QR-Code-Bibliothek**: [qrcode-generator](https://github.com/kazuhikoarase/qrcode-generator) von Kazuhiko Arase, MIT-Lizenz.
- **Star Wars: The Roleplaying Game** (D6) von **West End Games**.

## Rechtliches / Disclaimer

Dies ist ein nicht-kommerzielles **Fan-Projekt** für den privaten Spieltisch. Es besteht keine Verbindung zu Lucasfilm Ltd., Disney oder West End Games. *Star Wars* und alle zugehörigen Namen sind Marken ihrer jeweiligen Rechteinhaber. Die enthaltenen Spielwerte dienen als Spielhilfe zur 2nd Edition; die Regelbücher werden dadurch nicht ersetzt. / This is a non-commercial fan project. Not affiliated with Lucasfilm Ltd., Disney or West End Games. *Star Wars* and all related names are trademarks of their respective owners.

## Lizenz / License

[MIT](LICENSE)
