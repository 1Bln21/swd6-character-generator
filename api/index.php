<?php
/* =====================================================================
   Star Wars D6 Charaktergenerator – Online-API
   ---------------------------------------------------------------------
   Benutzerkonten (Username + Passwort + TOTP-MFA), Charakter-Speicherung
   und Freigaben. Läuft auf jedem Standard-Webspace mit PHP >= 7.4 und
   SQLite (PDO). Keine weiteren Abhängigkeiten.

   User accounts (username + password + TOTP MFA), character storage and
   sharing. Runs on any standard web space with PHP >= 7.4 and SQLite.
   ===================================================================== */

$CONFIG = [
  // Registrierung erlauben? / Allow registration?
  'allow_register' => true,
  // Optionaler Einladungscode: wenn gesetzt, ist er bei der Registrierung
  // Pflicht (praktisch für private Spielrunden). '' = ohne Code.
  'register_code' => '',
  // Name, der in der Authenticator-App angezeigt wird
  'issuer' => 'SWD6 Generator',
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

/* ---------------- Datenbank ---------------- */
$dataDir = __DIR__ . '/data';
if (!is_dir($dataDir)) {
  @mkdir($dataDir, 0770, true);
  @file_put_contents($dataDir . '/.htaccess', "Require all denied\n");
  @file_put_contents($dataDir . '/index.html', '');
}
try {
  $db = new PDO('sqlite:' . $dataDir . '/swd6.sqlite');
  $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
  $db->exec('PRAGMA journal_mode = WAL');
  $db->exec('PRAGMA foreign_keys = ON');
} catch (Exception $e) {
  fail('Database unavailable', 500);
}
$db->exec("CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL COLLATE NOCASE,
  pass_hash TEXT NOT NULL,
  totp_secret TEXT DEFAULT '',
  totp_pending TEXT DEFAULT '',
  totp_enabled INTEGER DEFAULT 0,
  totp_last_step INTEGER DEFAULT 0,
  backup_codes TEXT DEFAULT '[]',
  fail_count INTEGER DEFAULT 0,
  fail_time INTEGER DEFAULT 0,
  created INTEGER
)");
$db->exec("CREATE TABLE IF NOT EXISTS tokens (
  token_hash TEXT PRIMARY KEY,
  user_id INTEGER NOT NULL,
  expires INTEGER NOT NULL
)");
$db->exec("CREATE TABLE IF NOT EXISTS chars (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  name TEXT NOT NULL,
  data TEXT NOT NULL,
  updated INTEGER
)");
$db->exec("CREATE TABLE IF NOT EXISTS shares (
  char_id INTEGER NOT NULL,
  owner_id INTEGER NOT NULL,
  to_user_id INTEGER NOT NULL,
  UNIQUE(char_id, to_user_id)
)");

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
    $codes = json_decode($user['backup_codes'], true);
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

case 'ping':
  json_out(['ok' => true, 'api' => 'swd6', 'version' => 1,
            'register' => $CONFIG['allow_register'],
            'registerCode' => $CONFIG['register_code'] !== '']);

case 'register': {
  if (!$CONFIG['allow_register']) fail('Registration is disabled', 403);
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
  $st = $db->prepare('INSERT INTO users (username, pass_hash, created) VALUES (?,?,?)');
  $st->execute([$username, password_hash($password, PASSWORD_DEFAULT), time()]);
  $id = (int)$db->lastInsertId();
  json_out(['token' => make_token($id), 'username' => $username, 'mfaEnabled' => false]);
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
            'mfaEnabled' => (int)$user['totp_enabled'] === 1]);
}

case 'logout': {
  $user = auth();
  $db->prepare('DELETE FROM tokens WHERE token_hash = ?')
     ->execute([hash('sha256', bearer_token())]);
  json_out(['ok' => true]);
}

case 'me': {
  $user = auth();
  $codes = json_decode($user['backup_codes'], true);
  json_out(['username' => $user['username'],
            'mfaEnabled' => (int)$user['totp_enabled'] === 1,
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
  $st = $db->prepare('SELECT id, name, updated FROM chars WHERE user_id = ? ORDER BY name COLLATE NOCASE');
  $st->execute([$user['id']]);
  $mine = $st->fetchAll(PDO::FETCH_ASSOC);
  $st = $db->prepare('SELECT c.id, c.name, c.updated, u.username AS owner
                      FROM shares s JOIN chars c ON c.id = s.char_id JOIN users u ON u.id = s.owner_id
                      WHERE s.to_user_id = ? ORDER BY c.name COLLATE NOCASE');
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
    $db->prepare('INSERT OR IGNORE INTO shares (char_id, owner_id, to_user_id) VALUES (?,?,?)')
       ->execute([$id, $user['id'], $tu['id']]);
  }
  if ($action === 'share_remove') {
    $target = trim((string)inp('username', ''));
    $db->prepare('DELETE FROM shares WHERE char_id = ? AND to_user_id = (SELECT id FROM users WHERE username = ?)')
       ->execute([$id, $target]);
  }
  $st = $db->prepare('SELECT u.username FROM shares s JOIN users u ON u.id = s.to_user_id WHERE s.char_id = ? ORDER BY u.username COLLATE NOCASE');
  $st->execute([$id]);
  json_out(['shares' => $st->fetchAll(PDO::FETCH_COLUMN)]);
}

default:
  fail('Unknown action', 404);
}
