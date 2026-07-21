<?php
/* =====================================================================
   Star Wars D6 Charaktergenerator – Installations-Check
   ---------------------------------------------------------------------
   Diese Seite prüft, ob der Webspace alles mitbringt, was die Online-
   Funktionen brauchen. Einfach im Browser aufrufen:

       https://DEINE-SEITE.de/api/check.php

   Sie ändert nichts an deinen Daten (nur ein Testeintrag, der sofort
   wieder gelöscht wird). Nach erfolgreicher Einrichtung kann die Datei
   gelöscht werden.

   This page checks whether your web space supports the online features.
   Open it in a browser; it does not modify your data. Delete the file
   once everything works.
   ===================================================================== */

define('SWD6_CONFIG_ONLY', true);
$CONFIG = require __DIR__ . '/index.php';

$rows = [];       // [status, titel, text]  status: ok | warn | err | info
function add($status, $title, $text = '') { global $rows; $rows[] = [$status, $title, $text]; }
function h($s) { return htmlspecialchars((string)$s, ENT_QUOTES, 'UTF-8'); }

/* ---------------- PHP ---------------- */
$phpOk = version_compare(PHP_VERSION, '7.0.0', '>=');
add($phpOk ? 'ok' : 'err', 'PHP-Version: ' . PHP_VERSION,
    $phpOk ? 'Ausreichend (benötigt wird 7.0 oder neuer, empfohlen 7.4/8.x).'
           : 'ZU ALT. Die App braucht mindestens PHP 7.0. Stelle die Version im Control-Panel '
             . 'deines Hosters um ("Select PHP Version" / "PHP-Einstellungen") – bei ByetHost/InfinityFree '
             . 'findest du das im Vistapanel unter "PHP Config" bzw. "Select PHP Version".');

foreach (['random_bytes' => 'Sichere Zufallszahlen (Passwort-Token, Codes)',
          'password_hash' => 'Passwort-Verschlüsselung',
          'hash_hmac' => 'Zwei-Faktor-Anmeldung (TOTP)',
          'json_encode' => 'Datenaustausch mit der App'] as $fn => $why) {
  add(function_exists($fn) ? 'ok' : 'err', 'Funktion ' . $fn . '()',
      function_exists($fn) ? $why : 'FEHLT – ' . $why . '. Meist Folge einer zu alten PHP-Version.');
}

/* ---------------- Datenbank-Treiber ---------------- */
$hasMysql  = extension_loaded('pdo_mysql');
$hasSqlite = extension_loaded('pdo_sqlite');
add($hasMysql ? 'ok' : 'info', 'PHP-Erweiterung pdo_mysql',
    $hasMysql ? 'Vorhanden – MySQL/MariaDB kann genutzt werden.' : 'Nicht vorhanden.');
add($hasSqlite ? 'ok' : 'info', 'PHP-Erweiterung pdo_sqlite',
    $hasSqlite ? 'Vorhanden – SQLite kann genutzt werden.'
               : 'Nicht vorhanden (bei vielen Gratis-Tarifen normal) – dann MySQL verwenden.');

$dbc = $CONFIG['db'];
$useMysql = ($dbc['driver'] === 'mysql')
  || ($dbc['driver'] === 'auto' && $dbc['host'] !== '' && $dbc['name'] !== '' && $dbc['user'] !== '');
add('info', 'Gewählte Datenbank: ' . ($useMysql ? 'MySQL' : 'SQLite'),
    $useMysql ? 'Host: ' . h($dbc['host']) . ' · Datenbank: ' . h($dbc['name']) . ' · Benutzer: ' . h($dbc['user'])
              : 'Datei: api/data/swd6.sqlite (keine Einrichtung nötig)');

if (!$useMysql && !$hasSqlite) {
  add('err', 'Keine nutzbare Datenbank',
      'Dieser Server kann kein SQLite, und es sind keine MySQL-Zugangsdaten eingetragen. '
    . 'Lege im Control-Panel eine MySQL-Datenbank an und trage die Zugangsdaten oben in api/index.php '
    . 'im Block \'db\' ein.');
}

/* ---------------- Verbindung ---------------- */
$db = null;
if ($useMysql || $hasSqlite) {
  try {
    if ($useMysql) {
      $dsn = 'mysql:host=' . $dbc['host'] . ($dbc['port'] !== '' ? ';port=' . $dbc['port'] : '')
           . ';dbname=' . $dbc['name'] . ';charset=utf8mb4';
      $db = new PDO($dsn, $dbc['user'], $dbc['pass']);
    } else {
      $dir = __DIR__ . '/data';
      if (!is_dir($dir)) @mkdir($dir, 0770, true);
      $wr = is_dir($dir) && is_writable($dir);
      add($wr ? 'ok' : 'err', 'Schreibrechte für api/data/',
          $wr ? 'Vorhanden.'
              : 'FEHLEN – SQLite kann die Datenbank nicht anlegen (Fehler "unable to open database file"). '
                . 'SQLite braucht Schreibrechte auf dem ORDNER, nicht nur auf der Datei. Auf Linux:<br>'
                . '<code>sudo mkdir -p ' . h($dir) . '</code><br>'
                . '<code>sudo chown -R www-data:www-data ' . h($dir) . '</code><br>'
                . '<code>sudo chmod 775 ' . h($dir) . '</code><br>'
                . 'Bei Apache heißt der Benutzer meist <code>www-data</code>, bei nginx ebenfalls '
                . '<code>www-data</code> (ggf. <code>nginx</code>). Aktueller PHP-Benutzer: <code>'
                . h(function_exists('posix_getpwuid') && function_exists('posix_geteuid')
                    ? posix_getpwuid(posix_geteuid())['name'] : get_current_user()) . '</code>');
      $db = new PDO('sqlite:' . $dir . '/swd6.sqlite');
    }
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    add('ok', 'Datenbank-Verbindung', 'Erfolgreich hergestellt.');
  } catch (Exception $e) {
    $db = null;
    add('err', 'Datenbank-Verbindung fehlgeschlagen', h($e->getMessage())
      . ' — Prüfe Hostname, Datenbankname, Benutzer und Passwort. '
      . 'Bei ByetHost/InfinityFree ist das MySQL-Passwort dasselbe wie dein Panel-Login-Passwort, '
      . 'und der Datenbankname enthält den Präfix (z. B. b6_12345678_swd6).');
  }
}

/* ---------------- Tabellen & Spalten ---------------- */
if ($db) {
  $tables = [];
  try {
    $q = $useMysql ? 'SHOW TABLES' : "SELECT name FROM sqlite_master WHERE type='table'";
    foreach ($db->query($q)->fetchAll(PDO::FETCH_NUM) as $r) $tables[] = $r[0];
  } catch (Exception $e) {}
  $want = ['users', 'tokens', 'chars', 'shares', 'settings'];
  $missingTables = array_values(array_diff($want, $tables));
  add($missingTables ? 'warn' : 'ok', 'Tabellen',
      $missingTables
        ? 'Noch nicht vorhanden: ' . h(implode(', ', $missingTables))
          . ' – das ist vor dem ersten Aufruf der App normal. Rufe einmal die Seite auf; '
          . 'die Tabellen werden automatisch angelegt.'
        : 'Alle vorhanden (' . h(implode(', ', $want)) . ').');

  if (in_array('users', $tables, true)) {
    $cols = [];
    try {
      if ($useMysql) foreach ($db->query('SHOW COLUMNS FROM `users`')->fetchAll(PDO::FETCH_ASSOC) as $c) $cols[] = $c['Field'];
      else foreach ($db->query('PRAGMA table_info(users)')->fetchAll(PDO::FETCH_ASSOC) as $c) $cols[] = $c['name'];
    } catch (Exception $e) {}
    $need = ['id','username','pass_hash','totp_secret','totp_pending','totp_enabled','totp_last_step',
             'backup_codes','fail_count','fail_time','approved','is_admin','recovery_hash',
             'reset_hash','reset_expires','created'];
    $miss = array_values(array_diff($need, $cols));
    add($miss ? 'err' : 'ok', 'Spalten der Tabelle "users"',
        $miss ? 'Es fehlen: ' . h(implode(', ', $miss))
              . ' – die App versucht sie automatisch nachzurüsten. Klappt das nicht (siehe ALTER-Test unten), '
              . 'kannst du die Tabelle in phpMyAdmin löschen; sie wird dann neu und vollständig angelegt '
              . '(Achtung: bestehende Konten gehen dabei verloren).'
              : 'Vollständig (' . count($cols) . ' Spalten).');
  }

  /* Schreibtest */
  try {
    $db->exec('CREATE TABLE IF NOT EXISTS swd6_checktest (k VARCHAR(32) PRIMARY KEY, v VARCHAR(32))');
    $db->exec("DELETE FROM swd6_checktest");
    $db->prepare('INSERT INTO swd6_checktest (k, v) VALUES (?, ?)')->execute(['test', 'ok']);
    $val = $db->query("SELECT v FROM swd6_checktest WHERE k = 'test'")->fetchColumn();
    add($val === 'ok' ? 'ok' : 'err', 'Schreiben und Lesen', $val === 'ok' ? 'Funktioniert.' : 'Unerwartetes Ergebnis.');
  } catch (Exception $e) {
    add('err', 'Schreiben in die Datenbank fehlgeschlagen', h($e->getMessage()));
  }
  /* ALTER-Test (wird für Updates gebraucht) */
  try {
    $db->exec('ALTER TABLE swd6_checktest ADD COLUMN probe INT DEFAULT 0');
    add('ok', 'Tabellen ändern (ALTER TABLE)', 'Erlaubt – Updates können neue Spalten nachrüsten.');
  } catch (Exception $e) {
    add('warn', 'Tabellen ändern (ALTER TABLE) nicht erlaubt', h($e->getMessage())
      . ' – bei einem Update auf eine neuere Version musst du die Tabellen ggf. in phpMyAdmin löschen.');
  }
  try { $db->exec('DROP TABLE swd6_checktest'); } catch (Exception $e) {}
}

/* ---------------- Ergebnis ---------------- */
$errors = 0; $warns = 0;
foreach ($rows as $r) { if ($r[0] === 'err') $errors++; if ($r[0] === 'warn') $warns++; }
?><!DOCTYPE html>
<html lang="de"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>SWD6 – Installations-Check</title>
<style>
 body { background:#0b0d17; color:#e8eaf6; font-family:"Segoe UI",system-ui,sans-serif;
        margin:0; padding:24px; line-height:1.5; }
 .wrap { max-width:860px; margin:0 auto; }
 h1 { color:#ffe81f; font-size:22px; letter-spacing:2px; margin:0 0 4px; }
 .sub { color:#9aa1c9; font-size:13px; margin-bottom:20px; }
 .item { background:#181c33; border:1px solid #2c3358; border-left-width:5px;
         border-radius:8px; padding:10px 14px; margin-bottom:8px; }
 .ok   { border-left-color:#6fe08c; } .err  { border-left-color:#ff6b6b; }
 .warn { border-left-color:#ffb347; } .info { border-left-color:#6db3ff; }
 .t { font-weight:700; } .d { color:#9aa1c9; font-size:13px; margin-top:2px; }
 .sum { border-radius:10px; padding:14px 18px; margin:18px 0; font-weight:700; }
 .sum.good { background:#15301f; border:1px solid #6fe08c; color:#6fe08c; }
 .sum.bad  { background:#301717; border:1px solid #ff6b6b; color:#ff6b6b; }
 code { background:#0e1122; padding:1px 6px; border-radius:4px; font-size:13px; }
</style></head><body><div class="wrap">
<h1>SWD6 – INSTALLATIONS-CHECK</h1>
<div class="sub">Prüft, ob dieser Webspace die Online-Funktionen unterstützt. Es werden keine Daten verändert.</div>

<div class="sum <?= $errors ? 'bad' : 'good' ?>">
<?php if ($errors): ?>
  ✖ <?= $errors ?> Problem(e) gefunden – siehe die rot markierten Punkte.
<?php elseif ($warns): ?>
  ✔ Grundsätzlich einsatzbereit, mit <?= $warns ?> Hinweis(en).
<?php else: ?>
  ✔ Alles in Ordnung – die Online-Funktionen sollten laufen.
<?php endif; ?>
</div>

<?php foreach ($rows as $r): ?>
  <div class="item <?= $r[0] ?>">
    <div class="t"><?= h($r[1]) ?></div>
    <?php if ($r[2]): ?><div class="d"><?= $r[2] ?></div><?php endif; ?>
  </div>
<?php endforeach; ?>

<p class="sub" style="margin-top:20px">
  Testen kannst du außerdem <code>api/index.php?action=ping</code> – dort steht, welche Datenbank verwendet wird.<br>
  Wenn alles läuft, kannst du diese Datei (<code>api/check.php</code>) löschen.
</p>
</div></body></html>
