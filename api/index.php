<?php
/* =====================================================================
   Star Wars D6 Charaktergenerator – Online-API
   ---------------------------------------------------------------------
   Benutzerkonten (Username + Passwort + TOTP-MFA), Charakter-Speicherung
   und Freigaben. Läuft auf jedem Standard-Webspace mit PHP >= 7.4 und
   wahlweise SQLite ODER MySQL/MariaDB. Keine weiteren Abhängigkeiten.

   User accounts (username + password + TOTP MFA), character storage and
   sharing. Runs on any standard web space with PHP >= 7.4 and either
   SQLite or MySQL/MariaDB.
   ===================================================================== */

$CONFIG = [
  /* ---------------- Datenbank / database ----------------
     Viele (besonders kostenlose) Hoster bieten kein SQLite an, dafür
     aber MySQL. Trage die Zugangsdaten aus dem Hosting-Panel ein –
     sobald host, name und user gefüllt sind, wird MySQL verwendet.
     Bleiben sie leer, nutzt die API automatisch SQLite (api/data/).

     Many (especially free) hosts do not offer SQLite but do offer
     MySQL. Fill in the credentials from your hosting panel – as soon
     as host, name and user are set, MySQL is used. If left empty the
     API falls back to SQLite (api/data/). */
  'db' => [
    'driver' => 'auto',   // 'auto' | 'mysql' | 'pgsql' | 'sqlite'
                          // 'auto' nutzt MySQL, sobald host/name/user gefüllt sind;
                          // für PostgreSQL ausdrücklich 'pgsql' eintragen.
    'host'   => '',       // z. B. sql212.byethost6.com
    'name'   => '',       // Datenbankname / database name
    'user'   => '',       // Datenbank-Benutzer / database user
    'pass'   => '',       // Passwort / password
    'port'   => '',       // meist leer lassen / usually leave empty
  ],

  // Voreinstellung für die Registrierung; der Administrator kann sie
  // später in der App umstellen (offen / mit Freigabe / geschlossen).
  // Default registration mode; the administrator can change it in the
  // app later ('open' | 'approval' | 'closed').
  'register_mode' => 'open',
  // Veraltet, wirkt nur wenn noch keine Einstellung gespeichert wurde.
  'allow_register' => true,
  // Optionaler Einladungscode: wenn gesetzt, ist er bei der Registrierung
  // Pflicht (praktisch für private Spielrunden). '' = ohne Code.
  'register_code' => '',
  // Name, der in der Authenticator-App angezeigt wird
  'issuer' => 'SWD6 Generator',
  // Admins dürfen Impressum/Datenschutz bearbeiten. Der zuerst registrierte
  // Benutzer (ID 1) ist immer Admin; hier weitere Benutzernamen ergänzen.
  // Admins may edit the legal notice / privacy policy. The first registered
  // user (ID 1) is always an admin; add further usernames here.
  'admins' => [],
  // Token-Lebensdauer in Tagen / token lifetime in days
  'token_days' => 60,
  // CORS: nur setzen, wenn Frontend auf anderer Domain liegt, z. B.
  // 'https://meine-seite.de' – sonst leer lassen.
  'allow_origin' => '',
  // Grenzen / limits
  'max_chars_per_user' => 100,
  'max_char_bytes' => 512 * 1024,
];

/* Konfiguration auch für api/check.php lesbar machen (dort wird diese
   Datei mit gesetzter Konstante eingebunden und bricht hier ab). */
if (defined('SWD6_CONFIG_ONLY')) return $CONFIG;

/* ------------------------------------------------------------------ */
header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');

/* Fehler immer als JSON ausliefern – sonst bekommt die App eine
   HTML-Fehlerseite und kann nichts Sinnvolles anzeigen. */
function out_error($msg, $code = 500) {
  if (!headers_sent()) {
    http_response_code($code);
    header('Content-Type: application/json; charset=utf-8');
  }
  echo json_encode(['error' => $msg], JSON_UNESCAPED_UNICODE);
}
set_exception_handler(function ($e) {
  out_error('Server error: ' . $e->getMessage());
});
register_shutdown_function(function () {
  $e = error_get_last();
  if ($e && in_array($e['type'], [E_ERROR, E_PARSE, E_CORE_ERROR, E_COMPILE_ERROR], true)) {
    out_error('PHP error: ' . $e['message'] . ' (' . basename($e['file']) . ':' . $e['line'] . ')');
  }
});

/* Mindestanforderung: PHP 7. Ältere Versionen kennen z. B. random_bytes()
   nicht – dann bricht die Registrierung mitten drin ab. Bei den meisten
   Hostern lässt sich die PHP-Version im Control-Panel umstellen. */
if (version_compare(PHP_VERSION, '7.0.0', '<')) {
  out_error('This API needs PHP 7.0 or newer – your server runs PHP ' . PHP_VERSION
    . '. Please switch the PHP version in your hosting control panel '
    . '(e.g. "Select PHP Version" / "PHP-Einstellungen") to 7.4 or 8.x.', 500);
  exit;
}
if (!function_exists('random_bytes')) {
  out_error('This server is missing the PHP function random_bytes(). '
    . 'Please switch to PHP 7.4 or newer in your hosting control panel.', 500);
  exit;
}
if ($CONFIG['allow_origin'] !== '') {
  header('Access-Control-Allow-Origin: ' . $CONFIG['allow_origin']);
  header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Auth-Token');
  header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
  if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(204); exit; }
}

function json_out($data, $code = 200) {
  http_response_code($code);
  echo json_encode($data, JSON_UNESCAPED_UNICODE);
  exit;
}
function fail($msg, $code = 400) { json_out(['error' => $msg], $code); }

/* ---------------- Datenbank: SQLite, MySQL/MariaDB ODER PostgreSQL ---------------- */
$dataDir = __DIR__ . '/data';
$dbc = $CONFIG['db'];
$drv = strtolower((string)$dbc['driver']);
$usePg = in_array($drv, ['pgsql', 'postgres', 'postgresql'], true);
$useMysql = !$usePg && ($drv === 'mysql'
  || ($drv === 'auto' && $dbc['host'] !== '' && $dbc['name'] !== '' && $dbc['user'] !== ''));
$useServer = $usePg || $useMysql;                 // alles außer SQLite
$DRIVER = $usePg ? 'pgsql' : ($useMysql ? 'mysql' : 'sqlite');

if (!$useServer) {
  if (!is_dir($dataDir)) @mkdir($dataDir, 0770, true);
  /* Schutzdateien auch dann anlegen, wenn der Ordner von Hand erstellt wurde */
  if (is_dir($dataDir) && !is_file($dataDir . '/.htaccess')) {
    @file_put_contents($dataDir . '/.htaccess', "Require all denied\n");
    @file_put_contents($dataDir . '/index.html', '');
  }
  if (!extension_loaded('pdo_sqlite')) {
    fail('This server has no SQLite support (PHP extension pdo_sqlite missing). '
       . 'Enter your MySQL or PostgreSQL credentials in the $CONFIG[\'db\'] block of api/index.php instead.', 500);
  }
}
if ($useMysql && !extension_loaded('pdo_mysql')) {
  fail('This server has no MySQL support (PHP extension pdo_mysql missing).', 500);
}
if ($usePg && !extension_loaded('pdo_pgsql')) {
  fail('This server has no PostgreSQL support (PHP extension pdo_pgsql missing).', 500);
}

try {
  if ($usePg) {
    $dsn = 'pgsql:host=' . $dbc['host']
         . ($dbc['port'] !== '' ? ';port=' . $dbc['port'] : '')
         . ';dbname=' . $dbc['name'];
    $db = new PDO($dsn, $dbc['user'], $dbc['pass']);
  } elseif ($useMysql) {
    $dsn = 'mysql:host=' . $dbc['host']
         . ($dbc['port'] !== '' ? ';port=' . $dbc['port'] : '')
         . ';dbname=' . $dbc['name'] . ';charset=utf8mb4';
    $db = new PDO($dsn, $dbc['user'], $dbc['pass']);
  } else {
    $db = new PDO('sqlite:' . $dataDir . '/swd6.sqlite');
  }
  $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
  if (!$useServer) {
    $db->exec('PRAGMA journal_mode = WAL');
    $db->exec('PRAGMA foreign_keys = ON');
  }
} catch (Exception $e) {
  $msg = 'Database connection failed: ' . $e->getMessage();
  if (!$useServer) {
    /* Häufigster Fall: der Webserver darf im Datenordner nicht schreiben.
       SQLite braucht Schreibrechte auf dem ORDNER, nicht nur auf der Datei. */
    $msg .= ' | SQLite needs write access to the folder "' . $dataDir . '". On Linux run: '
          . 'sudo mkdir -p "' . $dataDir . '" && sudo chown -R www-data:www-data "' . $dataDir . '" '
          . '&& sudo chmod 775 "' . $dataDir . '" '
          . '(replace www-data with your web server user). '
          . 'Alternatively use MySQL or PostgreSQL by filling in the $CONFIG[\'db\'] block in api/index.php. '
          . 'Open api/check.php for a full report.';
  } else {
    $msg .= ' | Check host, database name, user and password in the $CONFIG[\'db\'] block '
          . 'of api/index.php. Open api/check.php for a full report.';
  }
  fail($msg, 500);
}

/* Dialekt-Unterschiede an einer Stelle gebündelt */
$PK  = $usePg ? 'SERIAL PRIMARY KEY'
     : ($useMysql ? 'INT AUTO_INCREMENT PRIMARY KEY' : 'INTEGER PRIMARY KEY AUTOINCREMENT');
$STR = 'VARCHAR(191)';                             // für alle drei; SQLite ignoriert die Länge
$TXT = $useMysql ? 'LONGTEXT' : 'TEXT';
if ($usePg) {
  /* citext macht Benutzernamen case-insensitive (wie bei MySQL/SQLite). Fehlt
     die Erweiterung (kein Superuser), bleibt VARCHAR – dann case-sensitiv. */
  try { $db->exec('CREATE EXTENSION IF NOT EXISTS citext'); $UNI = 'CITEXT UNIQUE NOT NULL'; }
  catch (Exception $e) { $UNI = 'VARCHAR(64) UNIQUE NOT NULL'; }
} else {
  $UNI = $useMysql ? 'VARCHAR(64) UNIQUE NOT NULL' : 'TEXT UNIQUE NOT NULL COLLATE NOCASE';
}
$SUF = $useMysql ? ' ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci' : '';
/* Case-insensitive Sortierung */
function ci($col) {
  global $useMysql, $usePg;
  if ($useMysql) return $col;                      // Collation ist schon ci
  if ($usePg) return 'LOWER(' . $col . ')';        // Postgres: per LOWER sortieren
  return $col . ' COLLATE NOCASE';                 // SQLite
}
function insert_ignore() {
  global $useMysql, $usePg;
  if ($useMysql) return 'INSERT IGNORE INTO';
  if ($usePg) return 'INSERT INTO';                // Postgres: dazu on_conflict() ans Ende
  return 'INSERT OR IGNORE INTO';
}
/* An eine per insert_ignore() gebaute Anweisung anhängen (nur Postgres). */
function on_conflict() { global $usePg; return $usePg ? ' ON CONFLICT DO NOTHING' : ''; }
/* Zuletzt vergebene Auto-ID – Postgres braucht den Sequenznamen. */
function last_id($table) {
  global $db, $usePg;
  return (int)($usePg ? $db->lastInsertId($table . '_id_seq') : $db->lastInsertId());
}

$db->exec("CREATE TABLE IF NOT EXISTS users (
  id $PK,
  username $UNI,
  pass_hash $STR NOT NULL,
  totp_secret $STR DEFAULT '',
  totp_pending $STR DEFAULT '',
  totp_enabled INT DEFAULT 0,
  totp_last_step BIGINT DEFAULT 0,
  backup_codes $TXT,
  fail_count INT DEFAULT 0,
  fail_time BIGINT DEFAULT 0,
  approved INT DEFAULT 1,
  is_admin INT DEFAULT 0,
  recovery_hash $STR DEFAULT '',
  reset_hash $STR DEFAULT '',
  reset_expires BIGINT DEFAULT 0,
  created BIGINT
)$SUF");
$db->exec("CREATE TABLE IF NOT EXISTS tokens (
  token_hash VARCHAR(64) PRIMARY KEY,
  user_id INT NOT NULL,
  expires BIGINT NOT NULL
)$SUF");
$db->exec("CREATE TABLE IF NOT EXISTS chars (
  id $PK,
  user_id INT NOT NULL,
  name $STR NOT NULL,
  kind VARCHAR(16) DEFAULT 'char',
  data $TXT NOT NULL,
  updated BIGINT
)$SUF");
$db->exec("CREATE TABLE IF NOT EXISTS shares (
  char_id INT NOT NULL,
  owner_id INT NOT NULL,
  to_user_id INT NOT NULL,
  UNIQUE(char_id, to_user_id)
)$SUF");
$db->exec("CREATE TABLE IF NOT EXISTS settings (
  k VARCHAR(64) PRIMARY KEY,
  v $TXT
)$SUF");
/* Spielrunden: ein GM lädt Spieler per Code ein, Spieler melden Chars an,
   der GM gibt sie für die Runde frei (Live-Status, siehe char_get). */
$db->exec("CREATE TABLE IF NOT EXISTS rounds (
  id $PK,
  name $STR NOT NULL,
  gm_id INT NOT NULL,
  invite_code VARCHAR(32) UNIQUE NOT NULL,
  created BIGINT
)$SUF");
$db->exec("CREATE TABLE IF NOT EXISTS round_members (
  round_id INT NOT NULL,
  user_id INT NOT NULL,
  role VARCHAR(8) DEFAULT 'player',
  UNIQUE(round_id, user_id)
)$SUF");
$db->exec("CREATE TABLE IF NOT EXISTS round_chars (
  round_id INT NOT NULL,
  char_id INT NOT NULL,
  approved INT DEFAULT 0,
  approved_by INT DEFAULT 0,
  approved_at BIGINT DEFAULT 0,
  note $TXT,
  UNIQUE(round_id, char_id)
)$SUF");
/* Support-/Ticketsystem: angemeldete Nutzer melden Bugs oder schlagen
   Schiffe/Spezies/Droiden vor, Admins antworten. Bilder als Base64. */
$db->exec("CREATE TABLE IF NOT EXISTS tickets (
  id $PK,
  user_id INT NOT NULL,
  subject $STR NOT NULL,
  category VARCHAR(16) DEFAULT 'other',
  status VARCHAR(12) DEFAULT 'open',
  created BIGINT,
  updated BIGINT
)$SUF");
$db->exec("CREATE TABLE IF NOT EXISTS ticket_messages (
  id $PK,
  ticket_id INT NOT NULL,
  author_id INT NOT NULL,
  is_admin INT DEFAULT 0,
  body $TXT,
  image $TXT,
  created BIGINT
)$SUF");
/* Bestenliste der versteckten Zugabe. Bewusst ohne Kontobindung: drei
   Buchstaben und eine Zahl, mehr wird nicht gespeichert – kein Bezug zu einem
   Nutzer, keine IP, nichts, was jemanden identifiziert. */
$db->exec("CREATE TABLE IF NOT EXISTS arcade_scores (
  id $PK,
  name VARCHAR(3) NOT NULL,
  score INT NOT NULL,
  created BIGINT
)$SUF");
/* Wer hat welches Ticket wann zuletzt gelesen? Pro Nutzer eine Zeile je Ticket –
   so bleibt der Hinweis für jeden Admin einzeln stehen, statt dass ein Admin ihn
   für alle wegklickt. Fehlt eine Zeile, gilt das Ticket als nie gelesen. */
$db->exec("CREATE TABLE IF NOT EXISTS ticket_seen (
  user_id INT NOT NULL,
  ticket_id INT NOT NULL,
  seen BIGINT,
  PRIMARY KEY (user_id, ticket_id)
)$SUF");

/* Spalten einer Tabelle ermitteln (für Migration und Selbstprüfung) */
function table_columns($table) {
  global $db, $useMysql, $usePg;
  $cols = [];
  try {
    if ($useMysql) {
      foreach ($db->query("SHOW COLUMNS FROM `$table`")->fetchAll(PDO::FETCH_ASSOC) as $c) $cols[] = $c['Field'];
    } elseif ($usePg) {
      $st = $db->prepare("SELECT column_name FROM information_schema.columns WHERE table_name = ?");
      $st->execute([$table]);
      foreach ($st->fetchAll(PDO::FETCH_ASSOC) as $c) $cols[] = $c['column_name'];
    } else {
      foreach ($db->query("PRAGMA table_info($table)")->fetchAll(PDO::FETCH_ASSOC) as $c) $cols[] = $c['name'];
    }
  } catch (Exception $e) { /* Tabelle fehlt */ }
  return $cols;
}

/* Nachrüsten älterer Installationen (Spalten kamen später dazu) */
$userCols = table_columns('users');
$addCols = [
  'approved'      => 'approved INT DEFAULT 1',
  'is_admin'      => 'is_admin INT DEFAULT 0',
  'recovery_hash' => "recovery_hash $STR DEFAULT ''",
  'reset_hash'    => "reset_hash $STR DEFAULT ''",
  'reset_expires' => 'reset_expires BIGINT DEFAULT 0',
];
$alterError = '';
foreach ($addCols as $col => $colDef) {
  if (in_array($col, $userCols, true)) continue;
  try { $db->exec("ALTER TABLE users ADD COLUMN $colDef"); }
  catch (Exception $e) { $alterError = $e->getMessage(); }
}
/* chars: Dokumenttyp kam mit den Droiden-/Schiffs-Generatoren dazu */
if (!in_array('kind', table_columns('chars'), true)) {
  try { $db->exec("ALTER TABLE chars ADD COLUMN kind VARCHAR(16) DEFAULT 'char'"); }
  catch (Exception $e) { $alterError = $e->getMessage(); }
}
/* round_chars: Begründung des GM bei einer Ablehnung (kam mit dem Reject-Knopf) */
$rcCols = table_columns('round_chars');
if ($rcCols && !in_array('note', $rcCols, true)) {
  try { $db->exec("ALTER TABLE round_chars ADD COLUMN note $TXT"); }
  catch (Exception $e) { $alterError = $e->getMessage(); }
}

/* Erlaubte Dokumenttypen: Charaktere, Droiden, Schiffe, eigene Spezies */
$KINDS = ['char', 'droid', 'ship', 'species', 'npc'];
function req_kind() {
  global $KINDS;
  $k = (string)inp('kind', 'char');
  return in_array($k, $KINDS, true) ? $k : 'char';
}

/* Selbstprüfung: fehlt etwas, klar sagen statt später mittendrin abstürzen */
$required = ['id', 'username', 'pass_hash', 'totp_secret', 'totp_pending', 'totp_enabled',
             'totp_last_step', 'backup_codes', 'fail_count', 'fail_time', 'approved',
             'is_admin', 'recovery_hash', 'reset_hash', 'reset_expires', 'created'];
$missing = array_values(array_diff($required, table_columns('users')));
if ($missing) {
  fail('Database schema incomplete – the table "users" is missing: ' . implode(', ', $missing)
     . ($alterError ? ' | Could not add it automatically: ' . $alterError : '')
     . ' | Open api/check.php in your browser for a detailed report.', 500);
}

/* ---------------- Einstellungen (in der Datenbank) ---------------- */
function setting_get($key, $default = null) {
  global $db;
  $st = $db->prepare('SELECT v FROM settings WHERE k = ?');
  $st->execute([$key]);
  $row = $st->fetch(PDO::FETCH_ASSOC);
  if (!$row) return $default;
  $val = json_decode($row['v'], true);
  return $val === null ? $default : $val;
}
function setting_set($key, $value) {
  global $db, $useMysql;
  $json = json_encode($value, JSON_UNESCAPED_UNICODE);
  $sql = $useMysql
    ? 'INSERT INTO settings (k, v) VALUES (?, ?) ON DUPLICATE KEY UPDATE v = VALUES(v)'
    : 'INSERT INTO settings (k, v) VALUES (?, ?) ON CONFLICT(k) DO UPDATE SET v = excluded.v';
  $db->prepare($sql)->execute([$key, $json]);
}
/* Registrierungsmodus: 'open' | 'approval' | 'closed' */
function register_mode() {
  global $CONFIG;
  $m = setting_get('register_mode');
  if ($m === null) $m = $CONFIG['allow_register'] ? $CONFIG['register_mode'] : 'closed';
  return in_array($m, ['open', 'approval', 'closed'], true) ? $m : 'open';
}

/* ---------------- Eingabe ---------------- */
$action = isset($_GET['action']) ? $_GET['action'] : '';
/* Die dekodierte Anfrage heißt bewusst $INPUT und nicht $body: die Aktionen
   unten laufen auf Skript-Ebene, ein lokales "$body = trim(inp('body'))" würde
   sonst die gesamte Eingabe überschreiben – alle späteren inp()-Aufrufe liefen
   dann ins Leere (genau dieser Fehler verschluckte v3.1.0 die Screenshots). */
$INPUT = [];
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  $raw = file_get_contents('php://input');
  if ($raw !== '' && $raw !== false) {
    $INPUT = json_decode($raw, true);
    if (!is_array($INPUT)) $INPUT = [];
  }
}
function inp($key, $default = null) {
  global $INPUT;
  if (isset($INPUT[$key])) return $INPUT[$key];
  if (isset($_GET[$key])) return $_GET[$key];
  return $default;
}

/* ---------------- Auth-Helfer ---------------- */
function bearer_token() {
  $hdr = '';
  if (isset($_SERVER['HTTP_AUTHORIZATION'])) $hdr = $_SERVER['HTTP_AUTHORIZATION'];
  elseif (isset($_SERVER['REDIRECT_HTTP_AUTHORIZATION'])) $hdr = $_SERVER['REDIRECT_HTTP_AUTHORIZATION'];
  if (preg_match('/Bearer\s+(\S+)/i', $hdr, $m)) return $m[1];
  if (isset($_SERVER['HTTP_X_AUTH_TOKEN'])) return $_SERVER['HTTP_X_AUTH_TOKEN'];
  $t = inp('token'); return $t ? $t : '';
}
function make_token($userId) {
  global $db, $CONFIG;
  $tok = bin2hex(random_bytes(32));
  $st = $db->prepare('INSERT INTO tokens (token_hash, user_id, expires) VALUES (?,?,?)');
  $st->execute([hash('sha256', $tok), $userId, time() + $CONFIG['token_days'] * 86400]);
  // Alte Tokens gelegentlich aufräumen
  if (mt_rand(0, 20) === 0) $db->exec('DELETE FROM tokens WHERE expires < ' . time());
  return $tok;
}
function auth() {
  global $db;
  $tok = bearer_token();
  if (!$tok) fail('Not logged in', 401);
  $st = $db->prepare('SELECT u.* FROM tokens t JOIN users u ON u.id = t.user_id WHERE t.token_hash = ? AND t.expires > ?');
  $st->execute([hash('sha256', $tok), time()]);
  $user = $st->fetch(PDO::FETCH_ASSOC);
  if (!$user) fail('Not logged in', 401);
  return $user;
}
function is_admin($user) {
  global $CONFIG;
  if ((int)$user['id'] === 1) return true;                 // Ersteinrichtung
  if (isset($user['is_admin']) && (int)$user['is_admin'] === 1) return true;
  return in_array($user['username'], $CONFIG['admins'], true);
}
function require_admin() {
  $user = auth();
  if (!is_admin($user)) fail('Administrator rights required', 403);
  return $user;
}
/* Ist dieser Nutzer GM der Runde? Der Gründer bekommt bei round_create die
   Rolle 'gm' im round_members-Eintrag, weitere GMs per round_set_role – daher
   deckt diese Rolle sowohl Gründer als auch Co-GMs ab. */
function round_is_gm($roundId, $userId) {
  global $db;
  $st = $db->prepare("SELECT 1 FROM round_members WHERE round_id = ? AND user_id = ? AND role = 'gm'");
  $st->execute([$roundId, $userId]);
  return (bool)$st->fetch();
}
/* Ticket-Screenshot prüfen: nur data:image/(png|jpeg|webp), bis ~1 MB binär
   (Base64 ist ~1.37× größer → 1,5 MB Grenze). Leer erlaubt. */
function valid_ticket_image($img) {
  $img = (string)$img;
  if ($img === '') return '';
  if (!preg_match('#^data:image/(png|jpe?g|webp);base64,#i', $img)) fail('Unsupported image format (PNG/JPEG/WebP only)');
  if (strlen($img) > 1500000) fail('Screenshot too large (max ~1 MB)');
  return $img;
}
/* ---- Ticket-Benachrichtigungen ----
   „Neu für mich" heißt: eine Nachricht der Gegenseite ist jünger als der
   Zeitpunkt, zu dem ich das Ticket zuletzt geöffnet habe. Für Admins zählen
   Nachrichten von Nutzern (is_admin = 0, also neue Tickets und Rückfragen),
   für Nutzer die Antworten der Admins (is_admin = 1). */
function ticket_mark_seen($userId, $ticketId) {
  global $db, $useMysql;
  $sql = $useMysql
    ? 'INSERT INTO ticket_seen (user_id, ticket_id, seen) VALUES (?,?,?) ON DUPLICATE KEY UPDATE seen = VALUES(seen)'
    : 'INSERT INTO ticket_seen (user_id, ticket_id, seen) VALUES (?,?,?) '
      . 'ON CONFLICT(user_id, ticket_id) DO UPDATE SET seen = excluded.seen';
  $db->prepare($sql)->execute([(int)$userId, (int)$ticketId, time()]);
}
/* Obergrenzen gegen Spam und Speicher-Missbrauch: eine Nachricht darf einen
   Screenshot von ~1 MB tragen – ohne Deckel könnte ein angemeldetes Konto die
   Datenbank vollschreiben. Admins sind ausgenommen (sie beantworten viel). */
function ticket_check_limits($user, $newTicket) {
  global $db;
  if (is_admin($user)) return;
  $hourAgo = time() - 3600;
  $st = $db->prepare('SELECT COUNT(*) FROM ticket_messages WHERE author_id = ? AND created > ?');
  $st->execute([$user['id'], $hourAgo]);
  if ((int)$st->fetchColumn() >= 30) fail('Too many messages in the last hour – please try again later', 429);
  if (!$newTicket) return;
  $st = $db->prepare("SELECT COUNT(*) FROM tickets WHERE user_id = ? AND status <> 'closed'");
  $st->execute([$user['id']]);
  if ((int)$st->fetchColumn() >= 20) fail('You have too many open tickets (max 20) – please close some first');
  $st = $db->prepare('SELECT COUNT(*) FROM tickets WHERE user_id = ? AND created > ?');
  $st->execute([$user['id'], $hourAgo]);
  if ((int)$st->fetchColumn() >= 5) fail('Too many new tickets in the last hour – please try again later', 429);
}
function ticket_unread_count($user, $admin) {
  global $db;
  $sql = 'SELECT COUNT(*) FROM tickets t WHERE EXISTS (
            SELECT 1 FROM ticket_messages m WHERE m.ticket_id = t.id AND m.is_admin = ?
              AND m.created > COALESCE((SELECT s.seen FROM ticket_seen s
                                        WHERE s.user_id = ? AND s.ticket_id = t.id), 0))';
  $params = [$admin ? 0 : 1, $user['id']];
  if (!$admin) { $sql .= ' AND t.user_id = ?'; $params[] = $user['id']; }
  $st = $db->prepare($sql);
  $st->execute($params);
  return (int)$st->fetchColumn();
}
function admin_count() {
  global $db;
  $st = $db->query('SELECT COUNT(*) FROM users WHERE is_admin = 1 OR id = 1');
  return (int)$st->fetchColumn();
}
/* Einmal-Codes (Wiederherstellung / Admin-Reset) */
function gen_code($bytes = 8) {
  return implode('-', str_split(strtoupper(bin2hex(random_bytes($bytes))), 4));
}
function code_hash($code) {
  return hash('sha256', strtoupper(preg_replace('/[^A-Za-z0-9]/', '', (string)$code)));
}
function new_recovery_code($userId) {
  global $db;
  $code = gen_code();
  $db->prepare('UPDATE users SET recovery_hash = ? WHERE id = ?')->execute([code_hash($code), $userId]);
  return $code;
}
function rate_check($user) {
  if ((int)$user['fail_count'] >= 8 && time() - (int)$user['fail_time'] < 900)
    fail('Too many failed attempts – try again in 15 minutes', 429);
}
function rate_fail($userId) {
  global $db;
  $db->prepare('UPDATE users SET fail_count = fail_count + 1, fail_time = ? WHERE id = ?')->execute([time(), $userId]);
  usleep(400000);
}
function rate_ok($userId) {
  global $db;
  $db->prepare('UPDATE users SET fail_count = 0 WHERE id = ?')->execute([$userId]);
}

/* ---------------- TOTP (RFC 6238, SHA1, 6 Stellen, 30 s) ---------------- */
function b32_encode($bin) {
  $alpha = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
  $out = ''; $bits = 0; $val = 0;
  for ($i = 0; $i < strlen($bin); $i++) {
    $val = ($val << 8) | ord($bin[$i]); $bits += 8;
    while ($bits >= 5) { $bits -= 5; $out .= $alpha[($val >> $bits) & 31]; }
  }
  if ($bits > 0) $out .= $alpha[($val << (5 - $bits)) & 31];
  return $out;
}
function b32_decode($s) {
  $alpha = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
  $s = strtoupper(preg_replace('/[^A-Za-z2-7]/', '', $s));
  $out = ''; $bits = 0; $val = 0;
  for ($i = 0; $i < strlen($s); $i++) {
    $idx = strpos($alpha, $s[$i]); if ($idx === false) continue;
    $val = ($val << 5) | $idx; $bits += 5;
    if ($bits >= 8) { $bits -= 8; $out .= chr(($val >> $bits) & 255); }
  }
  return $out;
}
function totp_at($secretB32, $step) {
  $key = b32_decode($secretB32);
  $bin = pack('N', 0) . pack('N', $step);
  $hash = hash_hmac('sha1', $bin, $key, true);
  $offset = ord($hash[19]) & 0xf;
  $code = (unpack('N', substr($hash, $offset, 4))[1] & 0x7fffffff) % 1000000;
  return str_pad((string)$code, 6, '0', STR_PAD_LEFT);
}
/* Prüft TOTP-Code (Fenster ±1) oder Backup-Code. Gibt true bei Erfolg. */
function verify_second_factor($user, $code, $secretB32 = null) {
  global $db;
  $code = preg_replace('/\s+/', '', (string)$code);
  $secret = $secretB32 !== null ? $secretB32 : $user['totp_secret'];
  if ($secret && preg_match('/^\d{6}$/', $code)) {
    $now = (int)floor(time() / 30);
    for ($w = -1; $w <= 1; $w++) {
      $step = $now + $w;
      if ($step > (int)$user['totp_last_step'] && hash_equals(totp_at($secret, $step), $code)) {
        $db->prepare('UPDATE users SET totp_last_step = ? WHERE id = ?')->execute([$step, $user['id']]);
        return true;
      }
    }
  }
  /* Backup-Code? (nur bei aktivierter MFA, nicht beim Einrichten) */
  if ($secretB32 === null && $code !== '') {
    $codes = json_decode((string)$user['backup_codes'], true);
    if (is_array($codes)) {
      $h = hash('sha256', strtoupper(str_replace('-', '', $code)));
      $idx = array_search($h, $codes, true);
      if ($idx !== false) {
        unset($codes[$idx]);
        $db->prepare('UPDATE users SET backup_codes = ? WHERE id = ?')
           ->execute([json_encode(array_values($codes)), $user['id']]);
        return true;
      }
    }
  }
  return false;
}

/* ===================================================================== */
switch ($action) {

case 'ping': {
  $mode = register_mode();
  json_out(['ok' => true, 'api' => 'swd6', 'version' => 2,
            'db' => $DRIVER,
            'register' => $mode !== 'closed',
            'registerMode' => $mode,
            'registerCode' => $CONFIG['register_code'] !== '']);
}

case 'authcheck': {
  /* Zeigt, ob der Server Anmelde-Header überhaupt an PHP weiterreicht.
     Wird von api/check.php aufgerufen. Gibt keine Geheimnisse preis –
     nur, ob und über welchen Weg ein Token ankommt. */
  json_out([
    'authorization'  => isset($_SERVER['HTTP_AUTHORIZATION']) && $_SERVER['HTTP_AUTHORIZATION'] !== '',
    'redirect'       => isset($_SERVER['REDIRECT_HTTP_AUTHORIZATION']) && $_SERVER['REDIRECT_HTTP_AUTHORIZATION'] !== '',
    'xAuthToken'     => isset($_SERVER['HTTP_X_AUTH_TOKEN']) && $_SERVER['HTTP_X_AUTH_TOKEN'] !== '',
    'tokenSeen'      => bearer_token() !== '',
    'sapi'           => PHP_SAPI,
  ]);
}

case 'register': {
  $mode = register_mode();
  if ($mode === 'closed') fail('Registration is currently disabled', 403);
  if ($CONFIG['register_code'] !== '' &&
      !hash_equals($CONFIG['register_code'], (string)inp('registerCode', '')))
    fail('Invalid registration code', 403);
  $username = trim((string)inp('username', ''));
  $password = (string)inp('password', '');
  if (!preg_match('/^[A-Za-z0-9_\-]{3,32}$/', $username))
    fail('Username: 3-32 characters, letters/digits/-/_ only');
  if (strlen($password) < 8) fail('Password must be at least 8 characters');
  if (strlen($password) > 1024) fail('Password too long (max 1024 characters)');
  $st = $db->prepare('SELECT id FROM users WHERE username = ?');
  $st->execute([$username]);
  if ($st->fetch()) fail('Username already taken', 409);
  /* Der allererste Benutzer ist Administrator und immer freigeschaltet. */
  $st = $db->query('SELECT COUNT(*) FROM users');
  $isFirst = (int)$st->fetchColumn() === 0;
  $approved = ($isFirst || $mode !== 'approval') ? 1 : 0;
  $st = $db->prepare('INSERT INTO users (username, pass_hash, created, approved, is_admin) VALUES (?,?,?,?,?)');
  $st->execute([$username, password_hash($password, PASSWORD_DEFAULT), time(), $approved, $isFirst ? 1 : 0]);
  $id = last_id('users');
  $recovery = new_recovery_code($id);
  if (!$approved)
    json_out(['pendingApproval' => true, 'username' => $username, 'recoveryCode' => $recovery]);
  json_out(['token' => make_token($id), 'username' => $username, 'mfaEnabled' => false,
            'isAdmin' => $isFirst, 'recoveryCode' => $recovery]);
}

case 'login': {
  $username = trim((string)inp('username', ''));
  $password = (string)inp('password', '');
  $st = $db->prepare('SELECT * FROM users WHERE username = ?');
  $st->execute([$username]);
  $user = $st->fetch(PDO::FETCH_ASSOC);
  if (!$user) { usleep(400000); fail('Wrong username or password', 401); }
  rate_check($user);
  if (!password_verify($password, $user['pass_hash'])) {
    rate_fail($user['id']); fail('Wrong username or password', 401);
  }
  if ((int)$user['approved'] !== 1)
    json_out(['error' => 'Your account is waiting for approval by the administrator.',
              'pendingApproval' => true], 403);
  if ((int)$user['totp_enabled'] === 1) {
    $code = (string)inp('totp', '');
    if ($code === '') json_out(['mfaRequired' => true]);
    if (!verify_second_factor($user, $code)) {
      rate_fail($user['id']); fail('Invalid authenticator code', 401);
    }
  }
  rate_ok($user['id']);
  if (password_needs_rehash($user['pass_hash'], PASSWORD_DEFAULT)) {
    $db->prepare('UPDATE users SET pass_hash = ? WHERE id = ?')
       ->execute([password_hash($password, PASSWORD_DEFAULT), $user['id']]);
  }
  json_out(['token' => make_token($user['id']), 'username' => $user['username'],
            'mfaEnabled' => (int)$user['totp_enabled'] === 1, 'isAdmin' => is_admin($user)]);
}

/* ---- Passwort ändern / vergessen (ohne E-Mail) ---- */
case 'password_change': {
  $user = auth();
  rate_check($user);
  $old = (string)inp('oldPassword', '');
  $new = (string)inp('newPassword', '');
  if (!password_verify($old, $user['pass_hash'])) {
    rate_fail($user['id']); fail('Current password is wrong', 401);
  }
  if (strlen($new) < 8) fail('Password must be at least 8 characters');
  if (strlen($new) > 1024) fail('Password too long (max 1024 characters)');
  rate_ok($user['id']);
  $db->prepare('UPDATE users SET pass_hash = ? WHERE id = ?')
     ->execute([password_hash($new, PASSWORD_DEFAULT), $user['id']]);
  /* Andere Geräte abmelden, die aktuelle Sitzung behalten */
  $db->prepare('DELETE FROM tokens WHERE user_id = ? AND token_hash <> ?')
     ->execute([$user['id'], hash('sha256', bearer_token())]);
  json_out(['ok' => true]);
}

case 'recovery_new': {
  $user = auth();
  json_out(['recoveryCode' => new_recovery_code($user['id'])]);
}

case 'password_reset': {
  $username = trim((string)inp('username', ''));
  $code     = (string)inp('code', '');
  $new      = (string)inp('newPassword', '');
  $st = $db->prepare('SELECT * FROM users WHERE username = ?');
  $st->execute([$username]);
  $user = $st->fetch(PDO::FETCH_ASSOC);
  if (!$user) { usleep(400000); fail('Wrong user name or code', 401); }
  rate_check($user);
  if (strlen($new) < 8) fail('Password must be at least 8 characters');
  if (strlen($new) > 1024) fail('Password too long (max 1024 characters)');
  $h = code_hash($code);
  $viaRecovery = !empty($user['recovery_hash']) && hash_equals($user['recovery_hash'], $h);
  $viaAdmin    = !empty($user['reset_hash']) && hash_equals($user['reset_hash'], $h)
                 && (int)$user['reset_expires'] > time();
  if (!$viaRecovery && !$viaAdmin) { rate_fail($user['id']); fail('Wrong user name or code', 401); }
  /* Der zweite Faktor bleibt Pflicht – ein Code allein darf MFA nicht aushebeln.
     Ist das Gerät weg, kann ein Administrator die MFA zurücksetzen. */
  if ((int)$user['totp_enabled'] === 1) {
    $totp = (string)inp('totp', '');
    if ($totp === '') json_out(['mfaRequired' => true]);
    if (!verify_second_factor($user, $totp)) {
      rate_fail($user['id']); fail('Invalid authenticator code', 401);
    }
  }
  rate_ok($user['id']);
  $db->prepare("UPDATE users SET pass_hash = ?, reset_hash = '', reset_expires = 0 WHERE id = ?")
     ->execute([password_hash($new, PASSWORD_DEFAULT), $user['id']]);
  $db->prepare('DELETE FROM tokens WHERE user_id = ?')->execute([$user['id']]);   // überall abmelden
  json_out(['ok' => true, 'recoveryCode' => new_recovery_code($user['id'])]);
}

case 'logout': {
  $user = auth();
  $db->prepare('DELETE FROM tokens WHERE token_hash = ?')
     ->execute([hash('sha256', bearer_token())]);
  json_out(['ok' => true]);
}

case 'me': {
  $user = auth();
  $codes = json_decode((string)$user['backup_codes'], true);
  json_out(['username' => $user['username'],
            'mfaEnabled' => (int)$user['totp_enabled'] === 1,
            'isAdmin' => is_admin($user),
            'backupCodesLeft' => is_array($codes) ? count($codes) : 0]);
}

/* DSGVO-Auskunft: alle über den angemeldeten Nutzer gespeicherten Daten.
   Keine Geheimnisse (Passwort-/TOTP-/Code-Hashes bleiben draußen). */
case 'my_data': {
  $user = auth();
  $codes = json_decode((string)$user['backup_codes'], true);
  $account = [
    'username'        => $user['username'],
    'created'         => (int)$user['created'],
    'approved'        => (int)$user['approved'] === 1,
    'isAdmin'         => is_admin($user),
    'mfaEnabled'      => (int)$user['totp_enabled'] === 1,
    'backupCodesLeft' => is_array($codes) ? count($codes) : 0,
    'hasRecoveryCode' => !empty($user['recovery_hash']),
    'adminResetPending' => !empty($user['reset_hash']) && (int)$user['reset_expires'] > time(),
  ];
  /* Eigene Dokumente inkl. Inhalt (es sind die eigenen Daten des Nutzers) */
  $st = $db->prepare("SELECT id, name, COALESCE(kind,'char') AS kind, updated, data
                      FROM chars WHERE user_id = ? ORDER BY COALESCE(kind,'char'), " . ci('name'));
  $st->execute([$user['id']]);
  $documents = [];
  foreach ($st->fetchAll(PDO::FETCH_ASSOC) as $r) {
    $documents[] = ['id' => (int)$r['id'], 'name' => $r['name'], 'kind' => $r['kind'],
                    'updated' => (int)$r['updated'], 'data' => json_decode($r['data'], true)];
  }
  /* Freigaben, die der Nutzer erteilt hat */
  $st = $db->prepare("SELECT c.name, u.username AS shared_with
                      FROM shares s JOIN chars c ON c.id = s.char_id JOIN users u ON u.id = s.to_user_id
                      WHERE s.owner_id = ? ORDER BY " . ci('c.name'));
  $st->execute([$user['id']]);
  $sharesGiven = $st->fetchAll(PDO::FETCH_ASSOC);
  /* Freigaben, die dem Nutzer erteilt wurden */
  $st = $db->prepare("SELECT c.name, u.username AS owner
                      FROM shares s JOIN chars c ON c.id = s.char_id JOIN users u ON u.id = s.owner_id
                      WHERE s.to_user_id = ? ORDER BY " . ci('c.name'));
  $st->execute([$user['id']]);
  $sharesReceived = $st->fetchAll(PDO::FETCH_ASSOC);
  /* Runden-Mitgliedschaften */
  $st = $db->prepare("SELECT r.name, m.role, gu.username AS gm
                      FROM round_members m JOIN rounds r ON r.id = m.round_id
                      JOIN users gu ON gu.id = r.gm_id WHERE m.user_id = ? ORDER BY " . ci('r.name'));
  $st->execute([$user['id']]);
  $rounds = $st->fetchAll(PDO::FETCH_ASSOC);
  /* Support-Tickets des Nutzers inkl. Nachrichten */
  $st = $db->prepare('SELECT id, subject, category, status, created FROM tickets WHERE user_id = ? ORDER BY created');
  $st->execute([$user['id']]);
  $tickets = [];
  foreach ($st->fetchAll(PDO::FETCH_ASSOC) as $tk) {
    $ms = $db->prepare('SELECT is_admin, body, created, (image IS NOT NULL AND image <> \'\') AS has_image
                        FROM ticket_messages WHERE ticket_id = ? ORDER BY created, id');
    $ms->execute([$tk['id']]);
    $tickets[] = ['subject' => $tk['subject'], 'category' => $tk['category'], 'status' => $tk['status'],
                  'created' => (int)$tk['created'],
                  'messages' => array_map(function ($m) {
                    return ['fromAdmin' => (int)$m['is_admin'] === 1, 'body' => $m['body'],
                            'created' => (int)$m['created'], 'hasImage' => (bool)$m['has_image']];
                  }, $ms->fetchAll(PDO::FETCH_ASSOC))];
  }
  json_out([
    'exportedAt' => time(),
    'account'    => $account,
    'documents'  => $documents,
    'sharesGiven'    => $sharesGiven,
    'sharesReceived' => $sharesReceived,
    'rounds'     => $rounds,
    'tickets'    => $tickets,
    'note' => 'This is all data stored about your account. Password, MFA and recovery codes are stored only as irreversible hashes and are never included.',
  ]);
}

case 'mfa_start': {
  $user = auth();
  $secret = b32_encode(random_bytes(20));
  $db->prepare('UPDATE users SET totp_pending = ? WHERE id = ?')->execute([$secret, $user['id']]);
  $issuer = rawurlencode($CONFIG['issuer']);
  $label = $issuer . ':' . rawurlencode($user['username']);
  json_out(['secret' => $secret,
            'otpauth' => "otpauth://totp/{$label}?secret={$secret}&issuer={$issuer}&algorithm=SHA1&digits=6&period=30"]);
}

case 'mfa_verify': {
  $user = auth();
  rate_check($user);
  if ($user['totp_pending'] === '') fail('No MFA setup in progress');
  if (!verify_second_factor($user, inp('code', ''), $user['totp_pending'])) {
    rate_fail($user['id']); fail('Invalid code – check time on your device', 401);
  }
  rate_ok($user['id']);
  $codes = []; $hashes = [];
  for ($i = 0; $i < 8; $i++) {
    $c = strtoupper(bin2hex(random_bytes(4)));
    $codes[] = substr($c, 0, 4) . '-' . substr($c, 4, 4);
    $hashes[] = hash('sha256', $c);
  }
  $db->prepare('UPDATE users SET totp_secret = totp_pending, totp_pending = \'\', totp_enabled = 1, backup_codes = ? WHERE id = ?')
     ->execute([json_encode($hashes), $user['id']]);
  json_out(['ok' => true, 'backupCodes' => $codes]);
}

case 'mfa_disable': {
  $user = auth();
  rate_check($user);
  if ((int)$user['totp_enabled'] !== 1) fail('MFA is not enabled');
  if (!verify_second_factor($user, inp('code', ''))) {
    rate_fail($user['id']); fail('Invalid code', 401);
  }
  rate_ok($user['id']);
  $db->prepare("UPDATE users SET totp_secret = '', totp_enabled = 0, totp_last_step = 0, backup_codes = '[]' WHERE id = ?")
     ->execute([$user['id']]);
  json_out(['ok' => true]);
}

case 'chars': {
  $user = auth();
  $kind = req_kind();
  $st = $db->prepare("SELECT id, name, updated FROM chars WHERE user_id = ? AND COALESCE(kind,'char') = ? ORDER BY " . ci('name'));
  $st->execute([$user['id'], $kind]);
  $mine = $st->fetchAll(PDO::FETCH_ASSOC);
  $st = $db->prepare("SELECT c.id, c.name, c.updated, u.username AS owner
                      FROM shares s JOIN chars c ON c.id = s.char_id JOIN users u ON u.id = s.owner_id
                      WHERE s.to_user_id = ? AND COALESCE(c.kind,'char') = ? ORDER BY " . ci('c.name'));
  $st->execute([$user['id'], $kind]);
  json_out(['mine' => $mine, 'shared' => $st->fetchAll(PDO::FETCH_ASSOC)]);
}

case 'char_get': {
  $user = auth();
  $id = (int)inp('id', 0);
  $st = $db->prepare('SELECT c.*, u.username AS owner FROM chars c JOIN users u ON u.id = c.user_id WHERE c.id = ?');
  $st->execute([$id]);
  $char = $st->fetch(PDO::FETCH_ASSOC);
  if (!$char) fail('Character not found', 404);
  $isOwner = (int)$char['user_id'] === (int)$user['id'];
  if (!$isOwner) {
    $st = $db->prepare('SELECT 1 FROM shares WHERE char_id = ? AND to_user_id = ?');
    $st->execute([$id, $user['id']]);
    $ok = (bool)$st->fetch();
    if (!$ok) {
      /* GM (Gründer oder Co-GM) einer Runde darf angemeldete Chars ansehen. */
      $st = $db->prepare("SELECT 1 FROM round_chars rc
                          JOIN round_members m ON m.round_id = rc.round_id
                          WHERE rc.char_id = ? AND m.user_id = ? AND m.role = 'gm'");
      $st->execute([$id, $user['id']]);
      $ok = (bool)$st->fetch();
    }
    if (!$ok) fail('No access to this character', 403);
  }
  /* Live-Freigaben für den Bogen: in welchen Runden ist dieser Char freigegeben? */
  $st = $db->prepare('SELECT r.name, u.username AS gm, rc.approved_at
                      FROM round_chars rc JOIN rounds r ON r.id = rc.round_id
                      JOIN users u ON u.id = r.gm_id
                      WHERE rc.char_id = ? AND rc.approved = 1 ORDER BY rc.approved_at');
  $st->execute([$id]);
  $approvals = [];
  foreach ($st->fetchAll(PDO::FETCH_ASSOC) as $a)
    $approvals[] = ['round' => $a['name'], 'gm' => $a['gm'], 'at' => (int)$a['approved_at']];
  json_out(['id' => (int)$char['id'], 'name' => $char['name'], 'owner' => $char['owner'],
            'kind' => $char['kind'] ? $char['kind'] : 'char',
            'readonly' => !$isOwner, 'updated' => (int)$char['updated'],
            'roundApprovals' => $approvals,
            'data' => json_decode($char['data'], true)]);
}

case 'char_save': {
  $user = auth();
  $name = trim((string)inp('name', ''));
  $data = inp('data');
  if ($name === '') fail('Character name is required');
  if (!is_array($data)) fail('Character data is missing');
  $json = json_encode($data, JSON_UNESCAPED_UNICODE);
  if (strlen($json) > $CONFIG['max_char_bytes']) fail('Character too large');
  $id = (int)inp('id', 0);
  if ($id > 0) {
    $st = $db->prepare('SELECT user_id FROM chars WHERE id = ?');
    $st->execute([$id]);
    $row = $st->fetch(PDO::FETCH_ASSOC);
    if (!$row) fail('Character not found', 404);
    if ((int)$row['user_id'] !== (int)$user['id']) fail('Only the owner can save this character', 403);
    $db->prepare('UPDATE chars SET name = ?, data = ?, updated = ? WHERE id = ?')
       ->execute([$name, $json, time(), $id]);
    json_out(['id' => $id]);
  }
  $st = $db->prepare('SELECT COUNT(*) FROM chars WHERE user_id = ?');
  $st->execute([$user['id']]);
  if ((int)$st->fetchColumn() >= $CONFIG['max_chars_per_user']) fail('Character limit reached');
  $db->prepare('INSERT INTO chars (user_id, name, kind, data, updated) VALUES (?,?,?,?,?)')
     ->execute([$user['id'], $name, req_kind(), $json, time()]);
  json_out(['id' => last_id('chars')]);
}

/* ---- Eigene Spezies: für alle angemeldeten Gruppenmitglieder sichtbar ---- */
case 'species_list': {
  $user = auth();
  $st = $db->prepare("SELECT c.id, c.name, c.updated, c.data, u.username AS owner, c.user_id
                      FROM chars c JOIN users u ON u.id = c.user_id
                      WHERE COALESCE(c.kind,'char') = 'species' ORDER BY " . ci('c.name'));
  $st->execute();
  $out = [];
  foreach ($st->fetchAll(PDO::FETCH_ASSOC) as $r) {
    $out[] = ['id' => (int)$r['id'], 'name' => $r['name'], 'owner' => $r['owner'],
              'updated' => (int)$r['updated'],
              'mine' => (int)$r['user_id'] === (int)$user['id'],
              'data' => json_decode($r['data'], true)];
  }
  json_out(['species' => $out]);
}

case 'species_delete': {
  $user = auth();
  $id = (int)inp('id', 0);
  $st = $db->prepare("SELECT user_id FROM chars WHERE id = ? AND COALESCE(kind,'char') = 'species'");
  $st->execute([$id]);
  $row = $st->fetch(PDO::FETCH_ASSOC);
  if (!$row) fail('Species not found', 404);
  if ((int)$row['user_id'] !== (int)$user['id'] && !is_admin($user))
    fail('Only the owner or an administrator can delete this species', 403);
  $db->prepare('DELETE FROM chars WHERE id = ?')->execute([$id]);
  $db->prepare('DELETE FROM shares WHERE char_id = ?')->execute([$id]);
  json_out(['ok' => true]);
}

case 'char_delete': {
  $user = auth();
  $id = (int)inp('id', 0);
  $st = $db->prepare('SELECT user_id FROM chars WHERE id = ?');
  $st->execute([$id]);
  $row = $st->fetch(PDO::FETCH_ASSOC);
  if (!$row) fail('Character not found', 404);
  if ((int)$row['user_id'] !== (int)$user['id']) fail('Only the owner can delete this character', 403);
  $db->prepare('DELETE FROM chars WHERE id = ?')->execute([$id]);
  $db->prepare('DELETE FROM shares WHERE char_id = ?')->execute([$id]);
  $db->prepare('DELETE FROM round_chars WHERE char_id = ?')->execute([$id]);
  json_out(['ok' => true]);
}

case 'share_add': case 'share_remove': case 'shares': {
  $user = auth();
  $id = (int)inp('charId', inp('id', 0));
  $st = $db->prepare('SELECT user_id FROM chars WHERE id = ?');
  $st->execute([$id]);
  $row = $st->fetch(PDO::FETCH_ASSOC);
  if (!$row) fail('Character not found', 404);
  if ((int)$row['user_id'] !== (int)$user['id']) fail('Only the owner can manage shares', 403);
  if ($action === 'share_add') {
    $target = trim((string)inp('username', ''));
    $st = $db->prepare('SELECT id FROM users WHERE username = ?');
    $st->execute([$target]);
    $tu = $st->fetch(PDO::FETCH_ASSOC);
    if (!$tu) fail('User not found', 404);
    if ((int)$tu['id'] === (int)$user['id']) fail('You cannot share with yourself');
    $db->prepare(insert_ignore() . ' shares (char_id, owner_id, to_user_id) VALUES (?,?,?)' . on_conflict())
       ->execute([$id, $user['id'], $tu['id']]);
  }
  if ($action === 'share_remove') {
    $target = trim((string)inp('username', ''));
    $db->prepare('DELETE FROM shares WHERE char_id = ? AND to_user_id = (SELECT id FROM users WHERE username = ?)')
       ->execute([$id, $target]);
  }
  $st = $db->prepare('SELECT u.username FROM shares s JOIN users u ON u.id = s.to_user_id WHERE s.char_id = ? ORDER BY ' . ci('u.username'));
  $st->execute([$id]);
  json_out(['shares' => $st->fetchAll(PDO::FETCH_COLUMN)]);
}

/* ---- Benutzerverwaltung (nur Admin) ---- */
case 'admin_users': {
  require_admin();
  $st = $db->query('SELECT u.id, u.username, u.created, u.approved, u.is_admin, u.totp_enabled,
                    (SELECT COUNT(*) FROM chars c WHERE c.user_id = u.id) AS char_count
                    FROM users u ORDER BY ' . ci('u.username'));
  $users = [];
  foreach ($st->fetchAll(PDO::FETCH_ASSOC) as $r) {
    $users[] = [
      'id' => (int)$r['id'],
      'username' => $r['username'],
      'created' => (int)$r['created'],
      'approved' => (int)$r['approved'] === 1,
      'isAdmin' => (int)$r['id'] === 1 || (int)$r['is_admin'] === 1,
      'mfaEnabled' => (int)$r['totp_enabled'] === 1,
      'chars' => (int)$r['char_count'],
    ];
  }
  json_out(['users' => $users, 'registerMode' => register_mode()]);
}

case 'admin_user_action': {
  $me = require_admin();
  $id = (int)inp('id', 0);
  $what = (string)inp('what', '');
  if ($id <= 0) fail('No user selected');
  $st = $db->prepare('SELECT * FROM users WHERE id = ?');
  $st->execute([$id]);
  $target = $st->fetch(PDO::FETCH_ASSOC);
  if (!$target) fail('User not found', 404);
  $self = (int)$target['id'] === (int)$me['id'];
  $extra = [];

  switch ($what) {
    case 'reset_password': {
      /* Einmal-Code erzeugen, 24 Stunden gültig. Der Administrator gibt ihn
         dem Benutzer persönlich weiter (Chat, Telefon …) – kein E-Mail-Versand. */
      $code = gen_code();
      $db->prepare('UPDATE users SET reset_hash = ?, reset_expires = ? WHERE id = ?')
         ->execute([code_hash($code), time() + 86400, $id]);
      $extra = ['resetCode' => $code, 'username' => $target['username']];
      break;
    }
    case 'approve':
      $db->prepare('UPDATE users SET approved = 1 WHERE id = ?')->execute([$id]);
      break;
    case 'block':
      if ($self) fail('You cannot block your own account');
      if (is_admin($target) && admin_count() <= 1) fail('The last administrator cannot be blocked');
      $db->prepare('UPDATE users SET approved = 0 WHERE id = ?')->execute([$id]);
      $db->prepare('DELETE FROM tokens WHERE user_id = ?')->execute([$id]);   // sofort abmelden
      break;
    case 'promote':
      $db->prepare('UPDATE users SET is_admin = 1, approved = 1 WHERE id = ?')->execute([$id]);
      break;
    case 'demote':
      if ($self) fail('You cannot remove your own administrator rights');
      if ((int)$id === 1) fail('The first account is permanently an administrator');
      if (admin_count() <= 1) fail('At least one administrator must remain');
      $db->prepare('UPDATE users SET is_admin = 0 WHERE id = ?')->execute([$id]);
      break;
    case 'delete':
      if ($self) fail('You cannot delete your own account here');
      if (is_admin($target) && admin_count() <= 1) fail('The last administrator cannot be deleted');
      $db->prepare('DELETE FROM shares WHERE to_user_id = ? OR owner_id = ?')->execute([$id, $id]);
      /* Anmeldungen der Chars dieses Users aus allen Runden entfernen */
      $db->prepare('DELETE FROM round_chars WHERE char_id IN (SELECT id FROM chars WHERE user_id = ?)')->execute([$id]);
      $db->prepare('DELETE FROM chars  WHERE user_id = ?')->execute([$id]);
      /* Runden, in denen der User Mitglied/GM war */
      $db->prepare('DELETE FROM round_members WHERE user_id = ?')->execute([$id]);
      $db->prepare('DELETE FROM round_chars WHERE round_id IN (SELECT id FROM rounds WHERE gm_id = ?)')->execute([$id]);
      $db->prepare('DELETE FROM round_members WHERE round_id IN (SELECT id FROM rounds WHERE gm_id = ?)')->execute([$id]);
      $db->prepare('DELETE FROM rounds WHERE gm_id = ?')->execute([$id]);
      /* Support-Tickets des Nutzers (und alle Nachrichten darin) */
      $db->prepare('DELETE FROM ticket_messages WHERE ticket_id IN (SELECT id FROM tickets WHERE user_id = ?)')->execute([$id]);
      $db->prepare('DELETE FROM ticket_messages WHERE author_id = ?')->execute([$id]);
      $db->prepare('DELETE FROM ticket_seen WHERE ticket_id IN (SELECT id FROM tickets WHERE user_id = ?)')->execute([$id]);
      $db->prepare('DELETE FROM ticket_seen WHERE user_id = ?')->execute([$id]);
      $db->prepare('DELETE FROM tickets WHERE user_id = ?')->execute([$id]);
      $db->prepare('DELETE FROM tokens WHERE user_id = ?')->execute([$id]);
      $db->prepare('DELETE FROM users  WHERE id = ?')->execute([$id]);
      break;
    case 'reset_mfa':
      $db->prepare("UPDATE users SET totp_secret = '', totp_pending = '', totp_enabled = 0,
                    totp_last_step = 0, backup_codes = '[]' WHERE id = ?")->execute([$id]);
      break;
    default:
      fail('Unknown action');
  }
  json_out(array_merge(['ok' => true], $extra));
}

case 'admin_settings': {
  require_admin();
  $mode = inp('registerMode');
  if ($mode !== null) {
    if (!in_array($mode, ['open', 'approval', 'closed'], true)) fail('Invalid registration mode');
    setting_set('register_mode', $mode);
  }
  json_out(['registerMode' => register_mode()]);
}

/* ---- Impressum / Datenschutz (site-weit, nur Admin darf schreiben) ---- */
case 'legal_get': {
  $data = setting_get('legal');
  if (!is_array($data)) {   // Übernahme aus der früheren Dateiablage
    $f = $dataDir . '/legal.json';
    $data = is_file($f) ? json_decode(file_get_contents($f), true) : null;
  }
  json_out(['legal' => is_array($data) ? $data : null]);
}

case 'legal_save': {
  $user = auth();
  if (!is_admin($user)) fail('Only the site administrator may edit the legal pages', 403);
  $in = inp('legal');
  if (!is_array($in)) fail('No data');
  $fields = ['name', 'street', 'zip', 'city', 'country', 'email', 'phone',
             'responsible', 'vatId', 'provider', 'providerAddress'];
  $out = [];
  foreach ($fields as $f2) {
    $v = isset($in[$f2]) ? trim(strip_tags((string)$in[$f2])) : '';
    if (strlen($v) > 300) fail('Field too long: ' . $f2);
    $out[$f2] = $v;
  }
  $urls = [];
  foreach (['impressum', 'datenschutz'] as $k) {
    $v = isset($in['urls'][$k]) ? trim((string)$in['urls'][$k]) : '';
    if ($v !== '' && !preg_match('#^https?://#i', $v)) $v = 'https://' . ltrim($v, '/');
    if (strlen($v) > 300) fail('URL too long');
    $urls[$k] = $v;
  }
  $out['urls'] = $urls;
  $out['updated'] = time();
  setting_set('legal', $out);
  json_out(['ok' => true, 'legal' => $out]);
}

/* ===================== Spielrunden (GM + Freigabe) ===================== */
case 'round_create': {
  $user = auth();
  $name = trim((string)inp('name', ''));
  if ($name === '') fail('Round name is required');
  if (strlen($name) > 100) fail('Round name too long (max 100 characters)');
  /* Obergrenze gegen Spam: ein Nutzer kann nicht beliebig viele Runden anlegen. */
  $st = $db->prepare('SELECT COUNT(*) FROM rounds WHERE gm_id = ?');
  $st->execute([$user['id']]);
  if ((int)$st->fetchColumn() >= 50) fail('You have reached the maximum number of rounds (50)');
  /* eindeutigen Einladungscode erzeugen */
  $code = '';
  for ($i = 0; $i < 20; $i++) {
    $try = strtoupper(bin2hex(random_bytes(4)));   // 8 Hex-Zeichen
    $st = $db->prepare('SELECT 1 FROM rounds WHERE invite_code = ?');
    $st->execute([$try]);
    if (!$st->fetch()) { $code = $try; break; }
  }
  if ($code === '') $code = strtoupper(bin2hex(random_bytes(8)));
  $db->prepare('INSERT INTO rounds (name, gm_id, invite_code, created) VALUES (?,?,?,?)')
     ->execute([$name, $user['id'], $code, time()]);
  $rid = last_id('rounds');
  $db->prepare(insert_ignore() . ' round_members (round_id, user_id, role) VALUES (?,?,?)' . on_conflict())
     ->execute([$rid, $user['id'], 'gm']);
  json_out(['id' => $rid, 'name' => $name, 'inviteCode' => $code, 'role' => 'gm']);
}

case 'round_join': {
  $user = auth();
  $code = preg_replace('/[^A-Fa-f0-9]/', '', (string)inp('code', ''));
  if ($code === '') fail('Invitation code required');
  $st = $db->prepare('SELECT * FROM rounds WHERE invite_code = ?');
  $st->execute([strtoupper($code)]);
  $round = $st->fetch(PDO::FETCH_ASSOC);
  if (!$round) { usleep(300000); fail('No round found for this code', 404); }  // bremst Code-Brute-Force
  $db->prepare(insert_ignore() . ' round_members (round_id, user_id, role) VALUES (?,?,?)' . on_conflict())
     ->execute([$round['id'], $user['id'], 'player']);
  json_out(['ok' => true, 'id' => (int)$round['id'], 'name' => $round['name']]);
}

case 'round_list': {
  $user = auth();
  $st = $db->prepare("SELECT r.id, r.name, r.invite_code, r.gm_id, m.role, gu.username AS gm,
                      (SELECT COUNT(*) FROM round_members mm WHERE mm.round_id = r.id) AS members
                      FROM round_members m JOIN rounds r ON r.id = m.round_id
                      JOIN users gu ON gu.id = r.gm_id
                      WHERE m.user_id = ? ORDER BY " . ci('r.name'));
  $st->execute([$user['id']]);
  $out = [];
  foreach ($st->fetchAll(PDO::FETCH_ASSOC) as $r) {
    $isGm = $r['role'] === 'gm';
    $out[] = ['id' => (int)$r['id'], 'name' => $r['name'], 'role' => $r['role'],
              'gm' => $r['gm'], 'members' => (int)$r['members'],
              'inviteCode' => $isGm ? $r['invite_code'] : null];
  }
  json_out(['rounds' => $out]);
}

case 'round_members': {
  $user = auth();
  $id = (int)inp('id', 0);
  $st = $db->prepare('SELECT role FROM round_members WHERE round_id = ? AND user_id = ?');
  $st->execute([$id, $user['id']]);
  if (!$st->fetch()) fail('Not a member of this round', 403);
  $st = $db->prepare("SELECT u.username, m.role FROM round_members m JOIN users u ON u.id = m.user_id
                      WHERE m.round_id = ? ORDER BY m.role DESC, " . ci('u.username'));
  $st->execute([$id]);
  json_out(['members' => $st->fetchAll(PDO::FETCH_ASSOC)]);
}

case 'round_leave': {
  $user = auth();
  $id = (int)inp('id', 0);
  $st = $db->prepare('SELECT gm_id FROM rounds WHERE id = ?');
  $st->execute([$id]);
  $round = $st->fetch(PDO::FETCH_ASSOC);
  if (!$round) fail('Round not found', 404);
  if ((int)$round['gm_id'] === (int)$user['id'])
    fail('As GM, delete the round instead of leaving it');
  $db->prepare('DELETE FROM round_members WHERE round_id = ? AND user_id = ?')->execute([$id, $user['id']]);
  $db->prepare('DELETE FROM round_chars WHERE round_id = ? AND char_id IN (SELECT id FROM chars WHERE user_id = ?)')
     ->execute([$id, $user['id']]);
  json_out(['ok' => true]);
}

case 'round_delete': {
  $user = auth();
  $id = (int)inp('id', 0);
  $st = $db->prepare('SELECT gm_id FROM rounds WHERE id = ?');
  $st->execute([$id]);
  $round = $st->fetch(PDO::FETCH_ASSOC);
  if (!$round) fail('Round not found', 404);
  if ((int)$round['gm_id'] !== (int)$user['id'] && !is_admin($user))
    fail('Only the GM can delete this round', 403);
  $db->prepare('DELETE FROM round_chars WHERE round_id = ?')->execute([$id]);
  $db->prepare('DELETE FROM round_members WHERE round_id = ?')->execute([$id]);
  $db->prepare('DELETE FROM rounds WHERE id = ?')->execute([$id]);
  json_out(['ok' => true]);
}

case 'round_remove_member': {
  $user = auth();
  $id = (int)inp('id', 0);
  $st = $db->prepare('SELECT gm_id FROM rounds WHERE id = ?');
  $st->execute([$id]);
  $round = $st->fetch(PDO::FETCH_ASSOC);
  if (!$round) fail('Round not found', 404);
  if (!round_is_gm($id, $user['id'])) fail('Only a GM can remove members', 403);
  $target = trim((string)inp('username', ''));
  $st = $db->prepare('SELECT id FROM users WHERE username = ?');
  $st->execute([$target]);
  $tu = $st->fetch(PDO::FETCH_ASSOC);
  if (!$tu) fail('User not found', 404);
  if ((int)$tu['id'] === (int)$round['gm_id']) fail('The GM cannot be removed');
  $db->prepare('DELETE FROM round_members WHERE round_id = ? AND user_id = ?')->execute([$id, $tu['id']]);
  $db->prepare('DELETE FROM round_chars WHERE round_id = ? AND char_id IN (SELECT id FROM chars WHERE user_id = ?)')
     ->execute([$id, $tu['id']]);
  json_out(['ok' => true]);
}

/* Einen weiteren GM ernennen oder zurückstufen (für wechselnde Spielleiter). */
case 'round_set_role': {
  $user = auth();
  $id = (int)inp('id', 0);
  $st = $db->prepare('SELECT gm_id FROM rounds WHERE id = ?');
  $st->execute([$id]);
  $round = $st->fetch(PDO::FETCH_ASSOC);
  if (!$round) fail('Round not found', 404);
  if (!round_is_gm($id, $user['id'])) fail('Only a GM can change roles', 403);
  $role = inp('role', '') === 'gm' ? 'gm' : 'player';
  $target = trim((string)inp('username', ''));
  $st = $db->prepare('SELECT id FROM users WHERE username = ?');
  $st->execute([$target]);
  $tu = $st->fetch(PDO::FETCH_ASSOC);
  if (!$tu) fail('User not found', 404);
  /* Der Gründer bleibt immer GM. */
  if ((int)$tu['id'] === (int)$round['gm_id']) fail('The founding GM keeps their role');
  $st = $db->prepare('SELECT 1 FROM round_members WHERE round_id = ? AND user_id = ?');
  $st->execute([$id, $tu['id']]);
  if (!$st->fetch()) fail('User is not a member of this round', 404);
  $db->prepare('UPDATE round_members SET role = ? WHERE round_id = ? AND user_id = ?')
     ->execute([$role, $id, $tu['id']]);
  json_out(['ok' => true, 'role' => $role]);
}

/* Runde übergeben: nur der aktuelle Gründer (oder ein Admin) kann die
   Eigentümerschaft an ein anderes Mitglied abgeben – etwa wenn er aufhört.
   Der neue Gründer wird GM; der bisherige bleibt als Co-GM in der Runde. */
case 'round_transfer': {
  $user = auth();
  $id = (int)inp('id', 0);
  $st = $db->prepare('SELECT gm_id FROM rounds WHERE id = ?');
  $st->execute([$id]);
  $round = $st->fetch(PDO::FETCH_ASSOC);
  if (!$round) fail('Round not found', 404);
  if ((int)$round['gm_id'] !== (int)$user['id'] && !is_admin($user))
    fail('Only the founding GM can hand over the round', 403);
  $target = trim((string)inp('username', ''));
  $st = $db->prepare('SELECT id FROM users WHERE username = ?');
  $st->execute([$target]);
  $tu = $st->fetch(PDO::FETCH_ASSOC);
  if (!$tu) fail('User not found', 404);
  if ((int)$tu['id'] === (int)$round['gm_id']) fail('This user already owns the round');
  $st = $db->prepare('SELECT 1 FROM round_members WHERE round_id = ? AND user_id = ?');
  $st->execute([$id, $tu['id']]);
  if (!$st->fetch()) fail('User is not a member of this round', 404);
  $db->prepare('UPDATE rounds SET gm_id = ? WHERE id = ?')->execute([$tu['id'], $id]);
  $db->prepare("UPDATE round_members SET role = 'gm' WHERE round_id = ? AND user_id = ?")
     ->execute([$id, $tu['id']]);                                   // neuer Gründer ist GM
  $db->prepare("UPDATE round_members SET role = 'gm' WHERE round_id = ? AND user_id = ?")
     ->execute([$id, (int)$round['gm_id']]);                        // alter Gründer bleibt Co-GM
  json_out(['ok' => true]);
}

case 'round_assign': case 'round_unassign': {
  $user = auth();
  $id = (int)inp('id', 0);
  $charId = (int)inp('charId', 0);
  $st = $db->prepare('SELECT 1 FROM round_members WHERE round_id = ? AND user_id = ?');
  $st->execute([$id, $user['id']]);
  if (!$st->fetch()) fail('Not a member of this round', 403);
  $st = $db->prepare('SELECT user_id FROM chars WHERE id = ?');
  $st->execute([$charId]);
  $row = $st->fetch(PDO::FETCH_ASSOC);
  if (!$row) fail('Character not found', 404);
  if ((int)$row['user_id'] !== (int)$user['id']) fail('Only the owner can assign this character', 403);
  if ($action === 'round_assign') {
    $db->prepare(insert_ignore() . ' round_chars (round_id, char_id, approved) VALUES (?,?,0)' . on_conflict())
       ->execute([$id, $charId]);
  } else {
    $db->prepare('DELETE FROM round_chars WHERE round_id = ? AND char_id = ?')->execute([$id, $charId]);
  }
  json_out(['ok' => true]);
}

case 'round_approve': {
  $user = auth();
  $id = (int)inp('id', 0);
  $charId = (int)inp('charId', 0);
  $st = $db->prepare('SELECT gm_id FROM rounds WHERE id = ?');
  $st->execute([$id]);
  $round = $st->fetch(PDO::FETCH_ASSOC);
  if (!$round) fail('Round not found', 404);
  if (!round_is_gm($id, $user['id'])) fail('Only a GM can approve characters', 403);
  $st = $db->prepare('SELECT 1 FROM round_chars WHERE round_id = ? AND char_id = ?');
  $st->execute([$id, $charId]);
  if (!$st->fetch()) fail('Character is not assigned to this round', 404);
  /* Drei Zustände: 1 = freigegeben, 0 = wartet, -1 = abgelehnt. Abgelehnt ist
     bewusst etwas anderes als „wartet“ – der Spieler soll sehen, dass der GM
     schon hingeschaut und Nein gesagt hat, statt weiter zu warten. */
  $a = inp('approved', true);
  if ($a === -1 || $a === '-1' || $a === 'reject') $state = -1;
  elseif ($a === true || $a === 1 || $a === '1' || $a === 'true') $state = 1;
  else $state = 0;
  /* Kurze Begründung, damit der Spieler weiß, was er ändern soll. Nur bei einer
     Ablehnung sinnvoll – bei Freigabe oder Zurücksetzen wird sie geleert. */
  $note = trim((string)inp('note', ''));
  if (strlen($note) > 500) $note = substr($note, 0, 500);
  if ($state !== -1) $note = '';
  if ($state === 0) {
    $db->prepare('UPDATE round_chars SET approved = 0, approved_by = 0, approved_at = 0, note = ? WHERE round_id = ? AND char_id = ?')
       ->execute(['', $id, $charId]);
  } else {
    /* Auch die Ablehnung mit Zeitstempel festhalten – sonst weiß niemand, wann
       und von wem sie kam. */
    $db->prepare('UPDATE round_chars SET approved = ?, approved_by = ?, approved_at = ?, note = ? WHERE round_id = ? AND char_id = ?')
       ->execute([$state, $user['id'], time(), $note, $id, $charId]);
  }
  json_out(['ok' => true, 'approved' => $state === 1, 'state' => $state]);
}

case 'round_chars': {
  $user = auth();
  $id = (int)inp('id', 0);
  $st = $db->prepare('SELECT gm_id FROM rounds WHERE id = ?');
  $st->execute([$id]);
  $round = $st->fetch(PDO::FETCH_ASSOC);
  if (!$round) fail('Round not found', 404);
  if (!round_is_gm($id, $user['id'])) fail('Only a GM can view round characters', 403);
  $st = $db->prepare("SELECT c.id, c.name, c.kind, c.updated, u.username AS owner,
                      rc.approved, rc.approved_at, rc.note
                      FROM round_chars rc JOIN chars c ON c.id = rc.char_id
                      JOIN users u ON u.id = c.user_id
                      WHERE rc.round_id = ? ORDER BY " . ci('u.username') . ", " . ci('c.name'));
  $st->execute([$id]);
  $out = [];
  foreach ($st->fetchAll(PDO::FETCH_ASSOC) as $r) {
    $out[] = ['id' => (int)$r['id'], 'name' => $r['name'], 'kind' => $r['kind'] ? $r['kind'] : 'char',
              'owner' => $r['owner'], 'updated' => (int)$r['updated'],
              /* approved bleibt als Wahrheitswert erhalten (alte Clients), state
                 trägt den echten Zustand: 1 frei, 0 wartet, -1 abgelehnt. */
              'approved' => (int)$r['approved'] === 1, 'state' => (int)$r['approved'],
              'approvedAt' => (int)$r['approved_at'], 'note' => (string)$r['note'],
              /* Wurde der Bogen nach der Freigabe noch bearbeitet? Der Spieler
                 speichert in dasselbe Dokument, der GM sieht also immer den
                 aktuellen Stand - dieser Hinweis sagt ihm, dass sich etwas
                 geaendert hat, ohne die Freigabe zu erzwingen. */
              'changedSince' => ((int)$r['approved'] === 1
                                 && (int)$r['updated'] > (int)$r['approved_at'])];
  }
  json_out(['chars' => $out]);
}

/* Für den Spieler: welche EIGENEN Chars sind in dieser Runde angemeldet/frei? */
case 'round_my_chars': {
  $user = auth();
  $id = (int)inp('id', 0);
  $st = $db->prepare('SELECT 1 FROM round_members WHERE round_id = ? AND user_id = ?');
  $st->execute([$id, $user['id']]);
  if (!$st->fetch()) fail('Not a member of this round', 403);
  $st = $db->prepare("SELECT c.id, c.name, c.kind, rc.approved, rc.note FROM round_chars rc
                      JOIN chars c ON c.id = rc.char_id
                      WHERE rc.round_id = ? AND c.user_id = ? ORDER BY " . ci('c.name'));
  $st->execute([$id, $user['id']]);
  $out = [];
  foreach ($st->fetchAll(PDO::FETCH_ASSOC) as $r)
    $out[] = ['id' => (int)$r['id'], 'name' => $r['name'], 'kind' => $r['kind'] ? $r['kind'] : 'char',
              'approved' => (int)$r['approved'] === 1, 'state' => (int)$r['approved'],
              'note' => (string)$r['note']];
  json_out(['chars' => $out]);
}

/* ===================== Support-/Ticketsystem ===================== */
case 'ticket_create': {
  $user = auth();
  ticket_check_limits($user, true);
  $subject = trim((string)inp('subject', ''));
  $msgBody = trim((string)inp('body', ''));
  $cat = (string)inp('category', 'other');
  if (!in_array($cat, ['ship', 'species', 'droid', 'bug', 'other'], true)) $cat = 'other';
  if ($subject === '') fail('Subject is required');
  if (strlen($subject) > 150) fail('Subject too long (max 150 characters)');
  if ($msgBody === '') fail('Message is required');
  if (strlen($msgBody) > 8000) fail('Message too long (max 8000 characters)');
  $img = valid_ticket_image(inp('image'));
  $now = time();
  $db->prepare('INSERT INTO tickets (user_id, subject, category, status, created, updated) VALUES (?,?,?,?,?,?)')
     ->execute([$user['id'], $subject, $cat, 'open', $now, $now]);
  $tid = last_id('tickets');
  $db->prepare('INSERT INTO ticket_messages (ticket_id, author_id, is_admin, body, image, created) VALUES (?,?,?,?,?,?)')
     ->execute([$tid, $user['id'], is_admin($user) ? 1 : 0, $msgBody, $img, $now]);
  json_out(['id' => $tid]);
}

case 'ticket_list': {
  $user = auth();
  $admin = is_admin($user);
  /* unread = Nachrichten der Gegenseite, die jünger sind als mein letzter Besuch */
  $sql = "SELECT t.id, t.subject, t.category, t.status, t.updated,
            (SELECT COUNT(*) FROM ticket_messages m WHERE m.ticket_id = t.id) AS msgs,
            (SELECT COUNT(*) FROM ticket_messages m2 WHERE m2.ticket_id = t.id AND m2.is_admin = ?
               AND m2.created > COALESCE((SELECT s.seen FROM ticket_seen s
                                          WHERE s.user_id = ? AND s.ticket_id = t.id), 0)) AS unread";
  $params = [$admin ? 0 : 1, $user['id']];
  if ($admin) {
    $sql .= ", u.username AS owner FROM tickets t JOIN users u ON u.id = t.user_id ORDER BY t.updated DESC";
  } else {
    $sql .= " FROM tickets t WHERE t.user_id = ? ORDER BY t.updated DESC";
    $params[] = $user['id'];
  }
  $st = $db->prepare($sql);
  $st->execute($params);
  $out = [];
  foreach ($st->fetchAll(PDO::FETCH_ASSOC) as $r) {
    $out[] = ['id' => (int)$r['id'], 'subject' => $r['subject'], 'category' => $r['category'],
              'status' => $r['status'], 'updated' => (int)$r['updated'],
              'owner' => isset($r['owner']) ? $r['owner'] : $user['username'],
              'messages' => (int)$r['msgs'], 'unread' => (int)$r['unread']];
  }
  json_out(['tickets' => $out, 'isAdmin' => $admin]);
}

case 'ticket_get': {
  $user = auth();
  $id = (int)inp('id', 0);
  $st = $db->prepare('SELECT * FROM tickets WHERE id = ?');
  $st->execute([$id]);
  $tk = $st->fetch(PDO::FETCH_ASSOC);
  if (!$tk) fail('Ticket not found', 404);
  if ((int)$tk['user_id'] !== (int)$user['id'] && !is_admin($user)) fail('No access to this ticket', 403);
  $st = $db->prepare("SELECT m.is_admin, m.body, m.image, m.created, u.username AS author
                      FROM ticket_messages m JOIN users u ON u.id = m.author_id
                      WHERE m.ticket_id = ? ORDER BY m.created, m.id");
  $st->execute([$id]);
  $msgs = [];
  foreach ($st->fetchAll(PDO::FETCH_ASSOC) as $m) {
    $msgs[] = ['author' => $m['author'], 'isAdmin' => (int)$m['is_admin'] === 1,
               'body' => $m['body'], 'image' => $m['image'] ? $m['image'] : null, 'created' => (int)$m['created']];
  }
  /* Öffnen gilt als gelesen – der Hinweis verschwindet nur für mich. */
  ticket_mark_seen($user['id'], $id);
  json_out(['id' => (int)$tk['id'], 'subject' => $tk['subject'], 'category' => $tk['category'],
            'status' => $tk['status'], 'messages' => $msgs]);
}

case 'ticket_reply': {
  $user = auth();
  $id = (int)inp('id', 0);
  $st = $db->prepare('SELECT user_id FROM tickets WHERE id = ?');
  $st->execute([$id]);
  $tk = $st->fetch(PDO::FETCH_ASSOC);
  if (!$tk) fail('Ticket not found', 404);
  $admin = is_admin($user);
  if ((int)$tk['user_id'] !== (int)$user['id'] && !$admin) fail('No access to this ticket', 403);
  ticket_check_limits($user, false);
  /* Endlos lange Fäden begrenzen (jede Nachricht kann ein Bild tragen). */
  $st = $db->prepare('SELECT COUNT(*) FROM ticket_messages WHERE ticket_id = ?');
  $st->execute([$id]);
  if ((int)$st->fetchColumn() >= 100) fail('This ticket has reached the maximum number of messages (100)');
  $msgBody = trim((string)inp('body', ''));
  if ($msgBody === '') fail('Message is required');
  if (strlen($msgBody) > 8000) fail('Message too long (max 8000 characters)');
  $img = valid_ticket_image(inp('image'));
  $now = time();
  $db->prepare('INSERT INTO ticket_messages (ticket_id, author_id, is_admin, body, image, created) VALUES (?,?,?,?,?,?)')
     ->execute([$id, $user['id'], $admin ? 1 : 0, $msgBody, $img, $now]);
  /* Admin-Antwort → „beantwortet"; Nutzer-Antwort → wieder „offen". */
  $db->prepare('UPDATE tickets SET status = ?, updated = ? WHERE id = ?')
     ->execute([$admin ? 'answered' : 'open', $now, $id]);
  json_out(['ok' => true]);
}

case 'ticket_close': {
  $user = auth();
  $id = (int)inp('id', 0);
  $st = $db->prepare('SELECT user_id FROM tickets WHERE id = ?');
  $st->execute([$id]);
  $tk = $st->fetch(PDO::FETCH_ASSOC);
  if (!$tk) fail('Ticket not found', 404);
  if ((int)$tk['user_id'] !== (int)$user['id'] && !is_admin($user)) fail('No access to this ticket', 403);
  $status = inp('reopen') ? 'open' : 'closed';
  $db->prepare('UPDATE tickets SET status = ?, updated = ? WHERE id = ?')->execute([$status, time(), $id]);
  json_out(['ok' => true, 'status' => $status]);
}

/* ---- Bestenliste der versteckten Zugabe (ohne Anmeldung) ---- */
case 'arcade_top': {
  $st = $db->query('SELECT name, score FROM arcade_scores ORDER BY score DESC, id ASC LIMIT 10');
  $out = [];
  foreach ($st->fetchAll(PDO::FETCH_ASSOC) as $r)
    $out[] = ['name' => $r['name'], 'score' => (int)$r['score']];
  json_out(['scores' => $out]);
}
case 'arcade_add': {
  /* Offen für alle, deshalb eng geführt: nur drei Großbuchstaben, eine Zahl
     in plausibler Höhe, und höchstens ein Eintrag alle paar Sekunden. Die
     Tabelle wird auf 100 Zeilen gestutzt, damit sie nicht wächst. */
  $name = strtoupper(trim((string)inp('name', '')));
  if (!preg_match('/^[A-Z]{3}$/', $name)) fail('Three letters A-Z required');
  $score = (int)inp('score', 0);
  if ($score <= 0 || $score > 1000000) fail('Invalid score');
  $now = time();
  $st = $db->prepare('SELECT COUNT(*) FROM arcade_scores WHERE created > ?');
  $st->execute([$now - 5]);
  if ((int)$st->fetchColumn() >= 3) fail('Too many entries – please wait a moment', 429);
  $db->prepare('INSERT INTO arcade_scores (name, score, created) VALUES (?,?,?)')
     ->execute([$name, $score, $now]);
  $keep = $db->query('SELECT id FROM arcade_scores ORDER BY score DESC, id ASC LIMIT 100')
             ->fetchAll(PDO::FETCH_COLUMN);
  if ($keep) {
    $in = implode(',', array_map('intval', $keep));
    $db->exec('DELETE FROM arcade_scores WHERE id NOT IN (' . $in . ')');
  }
  $st = $db->query('SELECT name, score FROM arcade_scores ORDER BY score DESC, id ASC LIMIT 10');
  $out = [];
  foreach ($st->fetchAll(PDO::FETCH_ASSOC) as $r)
    $out[] = ['name' => $r['name'], 'score' => (int)$r['score']];
  json_out(['ok' => true, 'scores' => $out]);
}

/* Nur die Anzahl – wird von jeder Seite für den Hinweis am ☁-Knopf abgefragt. */
case 'ticket_status': {
  $user = auth();
  $admin = is_admin($user);
  json_out(['unread' => ticket_unread_count($user, $admin), 'isAdmin' => $admin]);
}

default:
  fail('Unknown action', 404);
}
