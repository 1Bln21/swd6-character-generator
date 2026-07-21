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
    'driver' => 'auto',   // 'auto' | 'mysql' | 'sqlite'
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

/* ------------------------------------------------------------------ */
header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');
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

/* ---------------- Datenbank: SQLite ODER MySQL ---------------- */
$dataDir = __DIR__ . '/data';
$dbc = $CONFIG['db'];
$useMysql = ($dbc['driver'] === 'mysql')
  || ($dbc['driver'] === 'auto' && $dbc['host'] !== '' && $dbc['name'] !== '' && $dbc['user'] !== '');
$DRIVER = $useMysql ? 'mysql' : 'sqlite';

if (!$useMysql) {
  if (!is_dir($dataDir)) {
    @mkdir($dataDir, 0770, true);
    @file_put_contents($dataDir . '/.htaccess', "Require all denied\n");
    @file_put_contents($dataDir . '/index.html', '');
  }
  if (!extension_loaded('pdo_sqlite')) {
    fail('This server has no SQLite support (PHP extension pdo_sqlite missing). '
       . 'Enter your MySQL credentials in the $CONFIG[\'db\'] block of api/index.php instead.', 500);
  }
}
if ($useMysql && !extension_loaded('pdo_mysql')) {
  fail('This server has no MySQL support (PHP extension pdo_mysql missing).', 500);
}

try {
  if ($useMysql) {
    $dsn = 'mysql:host=' . $dbc['host']
         . ($dbc['port'] !== '' ? ';port=' . $dbc['port'] : '')
         . ';dbname=' . $dbc['name'] . ';charset=utf8mb4';
    $db = new PDO($dsn, $dbc['user'], $dbc['pass']);
  } else {
    $db = new PDO('sqlite:' . $dataDir . '/swd6.sqlite');
  }
  $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
  if (!$useMysql) {
    $db->exec('PRAGMA journal_mode = WAL');
    $db->exec('PRAGMA foreign_keys = ON');
  }
} catch (Exception $e) {
  fail('Database connection failed: ' . $e->getMessage(), 500);
}

/* Dialekt-Unterschiede an einer Stelle gebündelt */
$PK  = $useMysql ? 'INT AUTO_INCREMENT PRIMARY KEY' : 'INTEGER PRIMARY KEY AUTOINCREMENT';
$STR = $useMysql ? 'VARCHAR(191)' : 'TEXT';
$TXT = $useMysql ? 'LONGTEXT'     : 'TEXT';
$UNI = $useMysql ? 'VARCHAR(64) UNIQUE NOT NULL' : 'TEXT UNIQUE NOT NULL COLLATE NOCASE';
$SUF = $useMysql ? ' ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci' : '';
/* Case-insensitive Sortierung: MySQL kann das per Collation schon selbst */
function ci($col) { global $useMysql; return $useMysql ? $col : $col . ' COLLATE NOCASE'; }
function insert_ignore() { global $useMysql; return $useMysql ? 'INSERT IGNORE INTO' : 'INSERT OR IGNORE INTO'; }

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

/* Nachrüsten älterer Installationen (Spalten kamen später dazu) */
foreach (['approved INT DEFAULT 1', 'is_admin INT DEFAULT 0'] as $colDef) {
  try { $db->exec("ALTER TABLE users ADD COLUMN $colDef"); } catch (Exception $e) { /* existiert bereits */ }
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
$body = [];
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  $raw = file_get_contents('php://input');
  if ($raw !== '' && $raw !== false) {
    $body = json_decode($raw, true);
    if (!is_array($body)) $body = [];
  }
}
function inp($key, $default = null) {
  global $body;
  if (isset($body[$key])) return $body[$key];
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
function admin_count() {
  global $db;
  $st = $db->query('SELECT COUNT(*) FROM users WHERE is_admin = 1 OR id = 1');
  return (int)$st->fetchColumn();
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
  $st = $db->prepare('SELECT id FROM users WHERE username = ?');
  $st->execute([$username]);
  if ($st->fetch()) fail('Username already taken', 409);
  /* Der allererste Benutzer ist Administrator und immer freigeschaltet. */
  $st = $db->query('SELECT COUNT(*) FROM users');
  $isFirst = (int)$st->fetchColumn() === 0;
  $approved = ($isFirst || $mode !== 'approval') ? 1 : 0;
  $st = $db->prepare('INSERT INTO users (username, pass_hash, created, approved, is_admin) VALUES (?,?,?,?,?)');
  $st->execute([$username, password_hash($password, PASSWORD_DEFAULT), time(), $approved, $isFirst ? 1 : 0]);
  $id = (int)$db->lastInsertId();
  if (!$approved) json_out(['pendingApproval' => true, 'username' => $username]);
  json_out(['token' => make_token($id), 'username' => $username, 'mfaEnabled' => false,
            'isAdmin' => $isFirst]);
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
  $st = $db->prepare('SELECT id, name, updated FROM chars WHERE user_id = ? ORDER BY ' . ci('name'));
  $st->execute([$user['id']]);
  $mine = $st->fetchAll(PDO::FETCH_ASSOC);
  $st = $db->prepare('SELECT c.id, c.name, c.updated, u.username AS owner
                      FROM shares s JOIN chars c ON c.id = s.char_id JOIN users u ON u.id = s.owner_id
                      WHERE s.to_user_id = ? ORDER BY ' . ci('c.name'));
  $st->execute([$user['id']]);
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
    if (!$st->fetch()) fail('No access to this character', 403);
  }
  json_out(['id' => (int)$char['id'], 'name' => $char['name'], 'owner' => $char['owner'],
            'readonly' => !$isOwner, 'updated' => (int)$char['updated'],
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
  $db->prepare('INSERT INTO chars (user_id, name, data, updated) VALUES (?,?,?,?)')
     ->execute([$user['id'], $name, $json, time()]);
  json_out(['id' => (int)$db->lastInsertId()]);
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
    $db->prepare(insert_ignore() . ' shares (char_id, owner_id, to_user_id) VALUES (?,?,?)')
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

  switch ($what) {
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
      $db->prepare('DELETE FROM chars  WHERE user_id = ?')->execute([$id]);
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
  json_out(['ok' => true]);
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

default:
  fail('Unknown action', 404);
}
