<?php
/* =====================================================================
   Star Wars D6 character generator - online API
   ---------------------------------------------------------------------
   User accounts (username + password + TOTP MFA), character storage and
   sharing. Runs on any standard web space with PHP >= 7.4 and either
   SQLite or MySQL/MariaDB. No other dependencies.
   ===================================================================== */

$CONFIG = [
  /* ---------------- database ----------------
     Many (especially free) hosts do not offer SQLite but do offer
     MySQL. Fill in the credentials from your hosting panel - as soon
     as host, name and user are set, MySQL is used. If left empty the
     API falls back to SQLite (api/data/). */
  'db' => [
    'driver' => 'auto',   // 'auto' | 'mysql' | 'pgsql' | 'sqlite'
                          // 'auto' uses MySQL as soon as host/name/user are set;
                          // for PostgreSQL put 'pgsql' here explicitly.
    'host'   => '',       // e.g. sql212.byethost6.com
    'name'   => '',       // database name
    'user'   => '',       // database user
    'pass'   => '',       // password
    'port'   => '',       // usually leave empty
  ],

  // Default registration mode; the administrator can change it in the
  // app later ('open' | 'approval' | 'closed').
  'register_mode' => 'open',
  // Obsolete; takes effect only while no setting has been saved yet.
  'allow_register' => true,
  // Optional invite code: once set it is required to register (handy for
  // a private group). '' = no code needed.
  'register_code' => '',
  // The name shown in the authenticator app
  'issuer' => 'SWD6 Generator',
  // Admins may edit the legal notice / privacy policy. The first registered
  // user (ID 1) is always an admin; add further usernames here.
  'admins' => [],
  // Token lifetime in days
  'token_days' => 60,
  // CORS: only set this when the front end lives on another domain, e.g.
  // 'https://my-site.example' - otherwise leave it empty.
  'allow_origin' => '',
  // limits
  'max_chars_per_user' => 100,
  'max_char_bytes' => 512 * 1024,
  // Table-top (mini VTT). Maps are stored on disk under their hash and
  // served with an immutable cache header, so a generous limit costs
  // bandwidth exactly once per device. Token pictures are thumbnails -
  // the client scales a portrait down before uploading it.
  'max_map_bytes' => 6 * 1024 * 1024,
  'max_token_bytes' => 256 * 1024,
  'max_maps_per_round' => 30,
  'max_tokens_per_map' => 120,
  // Background music. A track is delivered once per device and then cached
  // for good, so the size costs bandwidth only on the first play.
  'max_audio_bytes' => 12 * 1024 * 1024,
  'max_audio_per_round' => 25,

  /* ---- voice and video at the table ----
     The browsers talk to each other directly; this server only passes the
     introductions along. What it cannot do is get two people connected
     when both sit behind a router that refuses incoming connections - for
     those a TURN server relays the media.

     'secret' is the SAME string as static-auth-secret in turnserver.conf.
     It NEVER reaches the browser: the API hands out a user name that
     expires and a password derived from the secret (coturn's REST scheme,
     use-auth-secret). A fixed password in the JavaScript would turn the
     TURN server into an open relay for anyone who reads the page source.

     Put the secret in api/config.local.php, not here. Empty = no voice
     chat offered. */
  'turn' => [
    'urls'   => [],   // e.g. ['turns:turn.example.de:5349?transport=udp', ...]
    'secret' => '',
    'ttl'    => 12 * 3600,
    // Public STUN, used only to find out one's own address. No media goes
    // through it. Replace or empty it if no third party should be involved.
    'stun'   => ['stun:stun.l.google.com:19302'],
  ],
];

/* ---- settings that must survive an update ----
   Everything above lives in this file, and this file is replaced whenever
   a new version is uploaded - so the database password would have to be
   typed in again every single time. Worse, with two installations sharing
   one database server (a live site and a beta), uploading the file with
   the wrong credentials still in it points the beta at the live database,
   and since the schema is migrated on EVERY request the first visitor
   would rebuild the live tables.

   So: put the installation's own settings in api/config.local.php, which
   returns an array and is never shipped or overwritten:

       <?php return [
         'db' => ['host' => 'localhost', 'name' => 'beta',
                  'user' => 'swd6gen', 'pass' => '...'],
       ];

   Only the keys named there are replaced, and a block like 'db' or 'turn'
   is merged key by key - naming just the database name, or just the TURN
   secret, is enough and leaves the rest of that block alone. Replacing a
   block wholesale would quietly drop the defaults inside it: a 'turn'
   override giving only urls and secret would take the STUN list and the
   lifetime with it, and the loss would only show up as calls that fail to
   connect. A list (urls, admins) is replaced as a whole, which is what one
   expects there. */
$swd6Local = __DIR__ . '/config.local.php';
if (is_file($swd6Local)) {
  $swd6Override = include $swd6Local;
  if (is_array($swd6Override)) {
    foreach ($swd6Override as $swd6K => $swd6V) {
      if (is_array($swd6V) && isset($CONFIG[$swd6K]) && is_array($CONFIG[$swd6K])
          && array_keys($swd6V) !== range(0, count($swd6V) - 1)) {
        $CONFIG[$swd6K] = array_merge($CONFIG[$swd6K], $swd6V);
      } else {
        $CONFIG[$swd6K] = $swd6V;
      }
    }
  }
}

/* Make the configuration readable for api/check.php too (it includes
   this file with the constant set, and execution stops here). */
if (defined('SWD6_CONFIG_ONLY')) return $CONFIG;

/* ------------------------------------------------------------------ */
header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');

/* Always deliver errors as JSON - otherwise the app gets an HTML error
   page and has nothing sensible to show. */
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

/* Minimum requirement: PHP 7. Older versions do not know random_bytes(),
   for one - registration then breaks off half way through. With most hosts
   the PHP version can be switched in the control panel. */
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

/* ---------------- database: SQLite, MySQL/MariaDB OR PostgreSQL ---------------- */
$dataDir = __DIR__ . '/data';
$dbc = $CONFIG['db'];
$drv = strtolower((string)$dbc['driver']);
$usePg = in_array($drv, ['pgsql', 'postgres', 'postgresql'], true);
$useMysql = !$usePg && ($drv === 'mysql'
  || ($drv === 'auto' && $dbc['host'] !== '' && $dbc['name'] !== '' && $dbc['user'] !== ''));
$useServer = $usePg || $useMysql;                 // everything but SQLite
$DRIVER = $usePg ? 'pgsql' : ($useMysql ? 'mysql' : 'sqlite');

if (!$useServer) {
  if (!is_dir($dataDir)) @mkdir($dataDir, 0770, true);
  /* Create the guard files even when the folder was made by hand */
  if (is_dir($dataDir) && !is_file($dataDir . '/.htaccess')) {
    /* "Require all denied" is Apache 2.4. On 2.2 that line would trigger a
       500 instead of protecting anything, so both spellings are written,
       each guarded by its module. Behind nginx .htaccess does nothing at
       all - there the folder has to be blocked in the server config, see
       the README. */
    @file_put_contents($dataDir . '/.htaccess',
      "<IfModule mod_authz_core.c>\n  Require all denied\n</IfModule>\n" .
      "<IfModule !mod_authz_core.c>\n  Order allow,deny\n  Deny from all\n</IfModule>\n");
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
    /* The commonest case: the web server may not write in the data folder.
       SQLite needs write permission on the FOLDER, not just on the file. */
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

/* Dialect differences, gathered in one place */
$PK  = $usePg ? 'SERIAL PRIMARY KEY'
     : ($useMysql ? 'INT AUTO_INCREMENT PRIMARY KEY' : 'INTEGER PRIMARY KEY AUTOINCREMENT');
$STR = 'VARCHAR(191)';                             // for all three; SQLite ignores the length
$TXT = $useMysql ? 'LONGTEXT' : 'TEXT';
if ($usePg) {
  /* citext makes user names case-insensitive (as MySQL/SQLite are). Without
     the extension (no superuser) it stays VARCHAR - and case-sensitive. */
  try { $db->exec('CREATE EXTENSION IF NOT EXISTS citext'); $UNI = 'CITEXT UNIQUE NOT NULL'; }
  catch (Exception $e) { $UNI = 'VARCHAR(64) UNIQUE NOT NULL'; }
} else {
  $UNI = $useMysql ? 'VARCHAR(64) UNIQUE NOT NULL' : 'TEXT UNIQUE NOT NULL COLLATE NOCASE';
}
$SUF = $useMysql ? ' ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci' : '';
/* Case-insensitive ordering */
function ci($col) {
  global $useMysql, $usePg;
  if ($useMysql) return $col;                      // the collation is already ci
  if ($usePg) return 'LOWER(' . $col . ')';        // Postgres: order via LOWER
  return $col . ' COLLATE NOCASE';                 // SQLite
}
function insert_ignore() {
  global $useMysql, $usePg;
  if ($useMysql) return 'INSERT IGNORE INTO';
  if ($usePg) return 'INSERT INTO';                // Postgres: plus on_conflict() at the end
  return 'INSERT OR IGNORE INTO';
}
/* Append to a statement built by insert_ignore() (Postgres only). */
function on_conflict() { global $usePg; return $usePg ? ' ON CONFLICT DO NOTHING' : ''; }
/* Last auto-assigned id - Postgres needs the sequence name. */
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
/* Game rounds: a GM invites players by code, players enter characters,
   and the GM approves them for the round (live status, see char_get). */
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
/* Support/ticket system: signed-in users report bugs or suggest ships,
   species and droids, and admins reply. Images as base64. */
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
/* High score table for the hidden extra. Deliberately not tied to an
   account: three letters and a number, nothing more is stored - no link to
   a user, no IP, nothing that identifies anybody. */
$db->exec("CREATE TABLE IF NOT EXISTS arcade_scores (
  id $PK,
  name VARCHAR(3) NOT NULL,
  score INT NOT NULL,
  created BIGINT
)$SUF");
/* Who last read which ticket, and when? One row per user per ticket - so
   the notice stays up for each admin separately instead of one admin
   clicking it away for everyone. With no row, the ticket counts as unread. */
$db->exec("CREATE TABLE IF NOT EXISTS ticket_seen (
  user_id INT NOT NULL,
  ticket_id INT NOT NULL,
  seen BIGINT,
  PRIMARY KEY (user_id, ticket_id)
)$SUF");

/* ===================== the table-top (mini VTT) =====================
   A round can hold several battle maps; one of them is the active one the
   players see. The image itself does NOT live in the database - only its
   hash and dimensions. See vtt_store_image() for why.

   Positions are stored as a FRACTION of the map (0..1), not in pixels.
   A phone, a laptop and a beamer all show the same map at different sizes,
   and the GM may zoom; with pixels every client would have to agree on a
   scale first, and a token would sit somewhere else on every screen. */
/* The fog is a coarse grid of cells over the map, one character per cell:

     0  unexplored   - black. The party has never been there.
     1  explored     - dimmed. They know the room but are not in it now,
                       so they see the walls and NOT who is standing there.
     2  in sight     - open, and the tokens in it are visible.

   The three states are what makes the fog behave the way a table expects:
   walking out of a room leaves the map behind but takes the enemies with
   it. Two states cannot express that - either the room goes black again
   (and the party forgets the layout) or the enemies stay on show. */
$db->exec("CREATE TABLE IF NOT EXISTS round_maps (
  id $PK,
  round_id INT NOT NULL,
  name $STR DEFAULT '',
  sha VARCHAR(64) NOT NULL,
  ext VARCHAR(8) NOT NULL,
  w INT DEFAULT 0,
  h INT DEFAULT 0,
  bytes INT DEFAULT 0,
  grid INT DEFAULT 0,
  fog $TXT,
  fog_cols INT DEFAULT 0,
  fog_rows INT DEFAULT 0,
  created BIGINT
)$SUF");
/* A token is, at heart, a round character with x/y. char_id = 0 marks a
   free token the GM dropped on the map (a creature, a crate, a waypoint) -
   those have no sheet behind them and carry their own label.

   Two kinds of picture:

     img_sha set  - the owner made a token out of their character, droid or
                    ship portrait. The client scales the portrait down once
                    and uploads it; it lands on disk under its hash, exactly
                    like a map, and is served straight from there. Reading
                    the portrait out of the document instead would mean
                    pulling up to 512 KB of character sheet across the wire
                    to paint a disc 40 pixels wide.
     img_sha empty - a default token: the client draws a disc in `color`
                    with the initials from `label`, and picks the outline
                    from `kind`. Costs no storage and no request at all, so
                    a GM can drop twenty stormtroopers on the map without
                    uploading anything. */
$db->exec("CREATE TABLE IF NOT EXISTS round_tokens (
  id $PK,
  round_id INT NOT NULL,
  map_id INT NOT NULL,
  char_id INT DEFAULT 0,
  owner_id INT DEFAULT 0,
  kind VARCHAR(16) DEFAULT 'npc',
  label $STR DEFAULT '',
  color VARCHAR(16) DEFAULT '',
  img_sha VARCHAR(64) DEFAULT '',
  img_ext VARCHAR(8) DEFAULT '',
  x REAL DEFAULT 0.5,
  y REAL DEFAULT 0.5,
  size REAL DEFAULT 1,
  created BIGINT
)$SUF");
/* Background music the GM puts on. Two kinds:

     file - an uploaded track, stored like every other table-top asset
            under its hash and delivered by the web server.
     yt   - a YouTube video. Only the id is kept; nothing is fetched,
            re-encoded or re-served by us. Every client plays it from
            YouTube itself, which is both the legal and the cheap way
            round (see the note at 'audio_add').

   The playback position is NOT pushed continuously. The row holds where
   the track stood (pos) and the server time that reading was taken (at);
   a client that joins ten minutes later works out for itself where the
   track must be by now. That keeps six players in step over a poll that
   only carries a version number. */
$db->exec("CREATE TABLE IF NOT EXISTS round_audio (
  id $PK,
  round_id INT NOT NULL,
  kind VARCHAR(8) DEFAULT 'file',
  name $STR DEFAULT '',
  sha VARCHAR(64) DEFAULT '',
  ext VARCHAR(8) DEFAULT '',
  yt_id VARCHAR(24) DEFAULT '',
  yt_list VARCHAR(64) DEFAULT '',
  bytes INT DEFAULT 0,
  created BIGINT
)$SUF");

/* Who is currently sitting in the voice call, and since when. A row that
   has not been refreshed for a while counts as gone - browsers are closed
   without saying goodbye, so a heartbeat is the only reliable signal. */
$db->exec("CREATE TABLE IF NOT EXISTS round_calls (
  round_id INT NOT NULL,
  user_id INT NOT NULL,
  cam INT DEFAULT 0,
  mic INT DEFAULT 1,
  seen BIGINT,
  PRIMARY KEY (round_id, user_id)
)$SUF");
/* The introductions two browsers need before they can talk directly:
   session descriptions and ICE candidates. Every row is addressed to one
   peer, is read once and is thrown away - this is a post box, not an
   archive. Nothing in here is media; the audio and video never touch this
   server. */
$db->exec("CREATE TABLE IF NOT EXISTS round_signals (
  id $PK,
  round_id INT NOT NULL,
  from_id INT NOT NULL,
  to_id INT NOT NULL,
  body $TXT,
  created BIGINT
)$SUF");

/* Shared roll log of the round. Everyone at the table sees the same rolls,
   which is the whole point of rolling together. Trimmed on write. */
$db->exec("CREATE TABLE IF NOT EXISTS round_log (
  id $PK,
  round_id INT NOT NULL,
  user_id INT DEFAULT 0,
  kind VARCHAR(16) DEFAULT 'roll',
  text $TXT,
  data $TXT,
  created BIGINT
)$SUF");

/* Determine a table's columns (for migration and the self-check) */
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
  } catch (Exception $e) { /* table missing */ }
  return $cols;
}

/* Retrofit older installations (columns were added later) */
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
/* chars: the document type arrived with the droid and ship generators */
if (!in_array('kind', table_columns('chars'), true)) {
  try { $db->exec("ALTER TABLE chars ADD COLUMN kind VARCHAR(16) DEFAULT 'char'"); }
  catch (Exception $e) { $alterError = $e->getMessage(); }
}
/* round_chars: the GM's reason for a rejection (arrived with the reject button) */
$rcCols = table_columns('round_chars');
if ($rcCols && !in_array('note', $rcCols, true)) {
  try { $db->exec("ALTER TABLE round_chars ADD COLUMN note $TXT"); }
  catch (Exception $e) { $alterError = $e->getMessage(); }
}
/* rounds: the table-top arrived with 4.0.0.
   vtt_version counts up on EVERY change to map, tokens or log. The clients
   ask for nothing but this number while idling - one indexed read of a few
   bytes - and only fetch the state once it has moved. That keeps a group
   that is merely sitting there from costing anything worth measuring. */
/* round_log: the single dice arrived with the roll display on the map */
$rlCols = table_columns('round_log');
if ($rlCols && !in_array('data', $rlCols, true)) {
  try { $db->exec("ALTER TABLE round_log ADD COLUMN data $TXT"); }
  catch (Exception $e) { $alterError = $e->getMessage(); }
}
/* round_audio: playlists arrived after single videos */
$raCols = table_columns('round_audio');
if ($raCols && !in_array('yt_list', $raCols, true)) {
  try { $db->exec("ALTER TABLE round_audio ADD COLUMN yt_list VARCHAR(64) DEFAULT ''"); }
  catch (Exception $e) { $alterError = $e->getMessage(); }
}
/* round_maps: the fog arrived after the first table-tops existed */
$rmCols = table_columns('round_maps');
$rmAdd = ['fog' => "fog $TXT", 'fog_cols' => 'fog_cols INT DEFAULT 0',
          'fog_rows' => 'fog_rows INT DEFAULT 0'];
foreach ($rmAdd as $col => $colDef) {
  if (!$rmCols || in_array($col, $rmCols, true)) continue;
  try { $db->exec("ALTER TABLE round_maps ADD COLUMN $colDef"); }
  catch (Exception $e) { $alterError = $e->getMessage(); }
}
$rndCols = table_columns('rounds');
$rndAdd = [
  'vtt_version' => 'vtt_version BIGINT DEFAULT 0',
  'active_map'  => 'active_map INT DEFAULT 0',
  'audio_id'    => 'audio_id INT DEFAULT 0',
  'audio_play'  => 'audio_play INT DEFAULT 0',
  'audio_pos'   => 'audio_pos REAL DEFAULT 0',
  'audio_at'    => 'audio_at BIGINT DEFAULT 0',
  'audio_loop'  => 'audio_loop INT DEFAULT 1',
  /* Which entry of a playlist is running. A position in seconds is not
     enough there - "12:04" means nothing without knowing which of the
     forty tracks it refers to. */
  'audio_index' => 'audio_index INT DEFAULT 0',
];
foreach ($rndAdd as $col => $colDef) {
  if (!$rndCols || in_array($col, $rndCols, true)) continue;
  try { $db->exec("ALTER TABLE rounds ADD COLUMN $colDef"); }
  catch (Exception $e) { $alterError = $e->getMessage(); }
}

/* Permitted document types: characters, droids, ships, custom species */
$KINDS = ['char', 'droid', 'ship', 'species', 'npc'];
function req_kind() {
  global $KINDS;
  $k = (string)inp('kind', 'char');
  return in_array($k, $KINDS, true) ? $k : 'char';
}

/* Self-check: if something is missing, say so plainly instead of crashing later */
$required = ['id', 'username', 'pass_hash', 'totp_secret', 'totp_pending', 'totp_enabled',
             'totp_last_step', 'backup_codes', 'fail_count', 'fail_time', 'approved',
             'is_admin', 'recovery_hash', 'reset_hash', 'reset_expires', 'created'];
$missing = array_values(array_diff($required, table_columns('users')));
if ($missing) {
  fail('Database schema incomplete – the table "users" is missing: ' . implode(', ', $missing)
     . ($alterError ? ' | Could not add it automatically: ' . $alterError : '')
     . ' | Open api/check.php in your browser for a detailed report.', 500);
}

/* ---------------- settings (kept in the database) ---------------- */
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
/* Registration mode: 'open' | 'approval' | 'closed' */
function register_mode() {
  global $CONFIG;
  $m = setting_get('register_mode');
  if ($m === null) $m = $CONFIG['allow_register'] ? $CONFIG['register_mode'] : 'closed';
  return in_array($m, ['open', 'approval', 'closed'], true) ? $m : 'open';
}

/* ---------------- input ---------------- */
$action = isset($_GET['action']) ? $_GET['action'] : '';
/* The decoded request is deliberately called $INPUT and not $body: the
   actions below run at script level, so a local "$body = trim(inp('body'))"
   would otherwise overwrite the entire input - every later inp() call would
   come back empty (exactly this bug swallowed the screenshots in v3.1.0). */
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

/* ---------------- auth helpers ---------------- */
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
  // clear out old tokens now and then
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
  if ((int)$user['id'] === 1) return true;                 // initial setup
  if (isset($user['is_admin']) && (int)$user['is_admin'] === 1) return true;
  return in_array($user['username'], $CONFIG['admins'], true);
}
function require_admin() {
  $user = auth();
  if (!is_admin($user)) fail('Administrator rights required', 403);
  return $user;
}
/* Is this user a GM of the round? round_create gives the founder the 'gm'
   role in the round_members row, further GMs get it via round_set_role - so
   this role covers founders and co-GMs alike. */
function round_is_gm($roundId, $userId) {
  global $db;
  $st = $db->prepare("SELECT 1 FROM round_members WHERE round_id = ? AND user_id = ? AND role = 'gm'");
  $st->execute([$roundId, $userId]);
  return (bool)$st->fetch();
}
/* Anyone in the round, GM or player. The table-top is visible to members
   only - it is the group's table, not a public page. */
function round_is_member($roundId, $userId) {
  global $db;
  $st = $db->prepare('SELECT 1 FROM round_members WHERE round_id = ? AND user_id = ?');
  $st->execute([$roundId, $userId]);
  return (bool)$st->fetch();
}
/* Check a ticket screenshot: only data:image/(png|jpeg|webp), up to ~1 MB
   binary (base64 is ~1.37x larger -> a 1.5 MB limit). Empty is allowed. */
function valid_ticket_image($img) {
  $img = (string)$img;
  if ($img === '') return '';
  if (!preg_match('#^data:image/(png|jpe?g|webp);base64,#i', $img)) fail('Unsupported image format (PNG/JPEG/WebP only)');
  if (strlen($img) > 1500000) fail('Screenshot too large (max ~1 MB)');
  return $img;
}

/* ---- table-top images on disk -----------------------------------------
   Battle maps and token pictures. Character portraits and ticket
   screenshots live in the database as data URIs; these must not. A map is
   an order of magnitude larger, and the .htaccess of this project sets
   "no-cache, must-revalidate" for everything it serves, so a 1 MB map would
   be fetched again on every refresh. One group would eat a double-digit
   share of the server's 200 Mbit/s.

   So the file goes on disk under its own SHA-256 and is served by the web
   server directly, with an immutable cache header: the name changes when
   the content changes, therefore the old name can be cached forever and
   every device loads a given picture exactly once. Uploading the same map
   twice costs no extra space either - the hash is the file name.

   NOTE ON BACKUPS: these files are not in the database dump. This folder
   needs to be backed up separately.

   The folder is deliberately NOT api/data/ - that one is sealed off by a
   "Require all denied" guard, which is right for the SQLite file and wrong
   for something Apache is supposed to hand out. It is also created no
   matter which database driver is in use, while api/data/ is only made for
   SQLite. */
function vtt_dir() {
  return __DIR__ . '/vtt';
}
function vtt_dir_ready() {
  $dir = vtt_dir();
  if (!is_dir($dir)) @mkdir($dir, 0775, true);
  if (!is_dir($dir)) fail('Cannot create the table-top folder "' . $dir . '". '
    . 'On Linux: sudo mkdir -p "' . $dir . '" && sudo chown www-data:www-data "' . $dir . '" '
    . '&& sudo chmod 775 "' . $dir . '" (replace www-data with your web server user).', 500);
  /* An upload folder that the web server hands out is the classic way into
     a machine, so scripting is switched off here in every spelling the
     common Apache builds understand. Behind nginx .htaccess does nothing -
     the README explains what to configure there instead. */
  /* The guard carries a version marker: when the list of allowed types
     grows, an installation that already has the old file has to get the
     new one, or the newly permitted extensions stay unreachable. */
  $guard = $dir . '/.htaccess';
  $mark = '# swd6-vtt-guard v2';
  $have = is_file($guard) ? (string)@file_get_contents($guard) : '';
  if (strpos($have, $mark) === false) {
    @file_put_contents($guard,
      $mark . "\n"
    . "<IfModule mod_headers.c>\n"
    . "  Header set Cache-Control \"public, max-age=31536000, immutable\"\n"
    . "</IfModule>\n"
    . "php_flag engine off\n"
    . "<IfModule mod_mime.c>\n"
    . "  RemoveHandler .php .phtml .php3 .php4 .php5 .php7 .php8 .phar\n"
    . "  RemoveType .php .phtml .php3 .php4 .php5 .php7 .php8 .phar\n"
    . "  AddType audio/mpeg .mp3\n"
    . "  AddType audio/ogg .ogg\n"
    . "  AddType audio/mp4 .m4a\n"
    . "</IfModule>\n"
    . "<FilesMatch \"(?i)\\.(png|jpe?g|webp|mp3|ogg|m4a)$\">\n"
    . "  <IfModule mod_authz_core.c>\n    Require all granted\n  </IfModule>\n"
    . "  <IfModule !mod_authz_core.c>\n    Order allow,deny\n    Allow from all\n  </IfModule>\n"
    . "</FilesMatch>\n");
  }
  return $dir;
}
/* The magic bytes decide the type, never the caller and never a file name.
   Returns [extension, width, height]. */
function vtt_sniff($bin) {
  $sig = substr($bin, 0, 12);
  if (strncmp($sig, "\x89PNG\r\n\x1a\n", 8) === 0)                        $ext = 'png';
  elseif (strncmp($sig, "\xFF\xD8\xFF", 3) === 0)                         $ext = 'jpg';
  elseif (strncmp($sig, 'RIFF', 4) === 0 && substr($sig, 8, 4) === 'WEBP') $ext = 'webp';
  else fail('Unsupported image format (PNG/JPEG/WebP only)');
  $w = $h = 0;
  if (function_exists('getimagesizefromstring')) {
    $sz = @getimagesizefromstring($bin);
    if ($sz) { $w = (int)$sz[0]; $h = (int)$sz[1]; }
  }
  return [$ext, $w, $h];
}
/* Same idea as vtt_sniff, for the sound files the GM puts up as background
   music. Again the magic bytes decide, never a file name the caller sent. */
function vtt_sniff_audio($bin) {
  $sig = substr($bin, 0, 12);
  if (strncmp($sig, 'ID3', 3) === 0) return 'mp3';
  /* A bare MPEG frame header: 11 bits set, then a valid layer/version. */
  if (strlen($sig) > 1 && ord($sig[0]) === 0xFF && (ord($sig[1]) & 0xE0) === 0xE0) return 'mp3';
  if (strncmp($sig, 'OggS', 4) === 0) return 'ogg';
  if (substr($sig, 4, 4) === 'ftyp') return 'm4a';
  fail('Unsupported audio format (MP3, OGG or M4A)');
}
/* Store a sound file. Separate from the picture path only because the type
   sniffing differs - the hashing, the folder and the immutable delivery are
   the same, so a track uploaded twice costs one file. */
function vtt_store_audio($dataUri, $maxBytes) {
  if (!preg_match('#^data:[^;,]*;base64,(.*)$#is', (string)$dataUri, $m)) {
    fail('Track must be sent as a data URI');
  }
  $bin = base64_decode($m[1], true);
  if ($bin === false || $bin === '') fail('Track could not be decoded');
  if (strlen($bin) > $maxBytes) {
    fail('Track too large (' . round(strlen($bin) / 1048576, 1) . ' MB, limit '
       . round($maxBytes / 1048576, 1) . ' MB)');
  }
  $ext = vtt_sniff_audio($bin);
  $sha = hash('sha256', $bin);
  $dir = vtt_dir_ready();
  $path = $dir . '/' . $sha . '.' . $ext;
  if (!is_file($path) && @file_put_contents($path, $bin) === false) {
    fail('Could not write to "' . $dir . '" - check the folder permissions.', 500);
  }
  return [$sha, $ext, strlen($bin)];
}

/* Write a data URI to disk under its hash. Returns [sha, ext, bytes, w, h].
   $what only shapes the error message ("Map too large" / "Token picture
   too large"), $maxBytes differs sharply between the two: a map may be
   several megabytes, a token is a thumbnail. */
function vtt_store_image($dataUri, $maxBytes, $what = 'Image') {
  if (!preg_match('#^data:image/[a-z+]+;base64,(.*)$#is', (string)$dataUri, $m)) {
    fail($what . ' must be sent as a data URI (PNG/JPEG/WebP)');
  }
  $bin = base64_decode($m[1], true);
  if ($bin === false || $bin === '') fail($what . ' could not be decoded');
  if (strlen($bin) > $maxBytes) {
    fail($what . ' too large (' . round(strlen($bin) / 1048576, 2) . ' MB, limit '
       . round($maxBytes / 1048576, 2) . ' MB)');
  }
  list($ext, $w, $h) = vtt_sniff($bin);
  $sha = hash('sha256', $bin);
  $dir = vtt_dir_ready();
  $path = $dir . '/' . $sha . '.' . $ext;
  if (!is_file($path) && @file_put_contents($path, $bin) === false) {
    fail('Could not write to "' . $dir . '" - check the folder permissions.', 500);
  }
  return [$sha, $ext, strlen($bin), $w, $h];
}
/* Every change to the table-top bumps the round's version. The clients poll
   this number and nothing else while nothing is happening. */
function vtt_touch($roundId) {
  global $db;
  $db->prepare('UPDATE rounds SET vtt_version = vtt_version + 1 WHERE id = ?')
     ->execute([(int)$roundId]);
}
/* Positions are a fraction of the map. Anything outside 0..1 would put a
   token off the edge where nobody can reach it again. */
function vtt_frac($v) {
  $v = (float)$v;
  if (!is_finite($v)) return 0.5;
  return max(0.0, min(1.0, $v));
}
/* ---- fog of war ----------------------------------------------------
   How fine the grid is. Wide enough that a room edge lands roughly where
   it should, coarse enough that the whole mask stays a couple of kilobytes
   and the GM can black out a corridor in two strokes. */
define('FOG_COLS', 40);

/* How long a voice-call heartbeat counts for. Two missed beats and the
   seat is considered empty - long enough to survive a hiccup, short enough
   that a closed browser does not linger in the round for a minute.
   Defined out here, not next to its case: statements between two case
   labels are never reached, PHP jumps straight to the matching one. */
define('CALL_TIMEOUT', 25);
function fog_dims($map) {
  $cols = (int)$map['fog_cols'];
  $rows = (int)$map['fog_rows'];
  if ($cols > 0 && $rows > 0) return [$cols, $rows];
  $cols = FOG_COLS;
  $w = max(1, (int)$map['w']);
  $h = max(1, (int)$map['h']);
  $rows = max(1, min(200, (int)round($cols * $h / $w)));
  return [$cols, $rows];
}
/* A fresh map starts completely unexplored - that is the whole point: the
   players are not supposed to see the layout before they walk into it. */
function fog_read($map) {
  list($cols, $rows) = fog_dims($map);
  $s = (string)$map['fog'];
  $need = $cols * $rows;
  if (strlen($s) !== $need) $s = str_repeat('0', $need);
  return [$s, $cols, $rows];
}
/* Which cell does a token stand in? Positions are fractions of the map, so
   this is the same arithmetic on every screen size. */
function fog_cell_at($x, $y, $cols, $rows) {
  $c = (int)floor(max(0.0, min(0.999999, (float)$x)) * $cols);
  $r = (int)floor(max(0.0, min(0.999999, (float)$y)) * $rows);
  return $r * $cols + $c;
}
/* THE point of the whole exercise: a player is only told about tokens that
   stand in a cell currently in sight. In a room they have explored but left
   the terrain stays on their map and the figures do not - which is exactly
   how every other virtual table behaves, and what a GM expects when they
   move the party on. The GM always sees everything. */
function fog_hides_token($fog, $cols, $rows, $x, $y) {
  $i = fog_cell_at($x, $y, $cols, $rows);
  return !isset($fog[$i]) || $fog[$i] !== '2';
}

/* Remove a picture from disk once the last row referring to it is gone.
   The file name IS the hash, so two rounds that upload the same map share
   one file - deleting it because ONE of them dropped the map would tear the
   picture out from under the other. Hence the count first. */
function vtt_delete_unused($sha, $ext) {
  global $db;
  if (!$sha) return;
  $st = $db->prepare('SELECT COUNT(*) FROM round_maps WHERE sha = ?');
  $st->execute([$sha]);
  if ((int)$st->fetchColumn() > 0) return;
  $st = $db->prepare('SELECT COUNT(*) FROM round_tokens WHERE img_sha = ?');
  $st->execute([$sha]);
  if ((int)$st->fetchColumn() > 0) return;
  /* Sound files share the folder and the hashing, so they have to be asked
     about too - otherwise deleting a track would pull the file out from
     under another round that uploaded the same one. */
  $st = $db->prepare('SELECT COUNT(*) FROM round_audio WHERE sha = ?');
  $st->execute([$sha]);
  if ((int)$st->fetchColumn() > 0) return;
  $path = vtt_dir() . '/' . $sha . '.' . $ext;
  if (is_file($path)) @unlink($path);
}
/* ---- ticket notifications ----
   "New to me" means: a message from the other side is younger than the
   moment I last opened the ticket. For admins that counts messages from
   users (is_admin = 0, so new tickets and follow-up questions), for users
   the admins' replies (is_admin = 1). */
function ticket_mark_seen($userId, $ticketId) {
  global $db, $useMysql;
  $sql = $useMysql
    ? 'INSERT INTO ticket_seen (user_id, ticket_id, seen) VALUES (?,?,?) ON DUPLICATE KEY UPDATE seen = VALUES(seen)'
    : 'INSERT INTO ticket_seen (user_id, ticket_id, seen) VALUES (?,?,?) '
      . 'ON CONFLICT(user_id, ticket_id) DO UPDATE SET seen = excluded.seen';
  $db->prepare($sql)->execute([(int)$userId, (int)$ticketId, time()]);
}
/* Ceilings against spam and storage abuse: one message may carry a ~1 MB
   screenshot - without a cap a signed-in account could fill the database.
   Admins are exempt (they answer a great deal). */
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
/* One-time codes (recovery / admin reset) */
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

/* ---------------- TOTP (RFC 6238, SHA1, 6 digits, 30 s) ---------------- */
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
/* Checks a TOTP code (window +-1) or a backup code. True on success. */
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
  /* A backup code? (only with MFA switched on, not while setting it up) */
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
  /* Shows whether the server passes authorisation headers to PHP at all.
     Called by api/check.php. Gives away no secrets - only whether a token
     arrives, and by which route. */
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
  /* The very first user is an administrator and always approved. */
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

/* ---- change / forgot password (without e-mail) ---- */
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
  /* Sign the other devices out, keep the current session */
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
  /* The second factor stays mandatory - a code alone must not defeat MFA.
     If the device is gone, an administrator can reset MFA. */
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
  $db->prepare('DELETE FROM tokens WHERE user_id = ?')->execute([$user['id']]);   // sign out everywhere
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

/* GDPR data export: everything stored about the signed-in user. No secrets
   (password, TOTP and code hashes stay out). */
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
  /* Own documents including content (it is the user's own data) */
  $st = $db->prepare("SELECT id, name, COALESCE(kind,'char') AS kind, updated, data
                      FROM chars WHERE user_id = ? ORDER BY COALESCE(kind,'char'), " . ci('name'));
  $st->execute([$user['id']]);
  $documents = [];
  foreach ($st->fetchAll(PDO::FETCH_ASSOC) as $r) {
    $documents[] = ['id' => (int)$r['id'], 'name' => $r['name'], 'kind' => $r['kind'],
                    'updated' => (int)$r['updated'], 'data' => json_decode($r['data'], true)];
  }
  /* shares the user has granted */
  $st = $db->prepare("SELECT c.name, u.username AS shared_with
                      FROM shares s JOIN chars c ON c.id = s.char_id JOIN users u ON u.id = s.to_user_id
                      WHERE s.owner_id = ? ORDER BY " . ci('c.name'));
  $st->execute([$user['id']]);
  $sharesGiven = $st->fetchAll(PDO::FETCH_ASSOC);
  /* shares granted to the user */
  $st = $db->prepare("SELECT c.name, u.username AS owner
                      FROM shares s JOIN chars c ON c.id = s.char_id JOIN users u ON u.id = s.owner_id
                      WHERE s.to_user_id = ? ORDER BY " . ci('c.name'));
  $st->execute([$user['id']]);
  $sharesReceived = $st->fetchAll(PDO::FETCH_ASSOC);
  /* round memberships */
  $st = $db->prepare("SELECT r.name, m.role, gu.username AS gm
                      FROM round_members m JOIN rounds r ON r.id = m.round_id
                      JOIN users gu ON gu.id = r.gm_id WHERE m.user_id = ? ORDER BY " . ci('r.name'));
  $st->execute([$user['id']]);
  $rounds = $st->fetchAll(PDO::FETCH_ASSOC);
  /* the user's support tickets including their messages */
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
      /* A round's GM (founder or co-GM) may view the entered characters. */
      $st = $db->prepare("SELECT 1 FROM round_chars rc
                          JOIN round_members m ON m.round_id = rc.round_id
                          WHERE rc.char_id = ? AND m.user_id = ? AND m.role = 'gm'");
      $st->execute([$id, $user['id']]);
      $ok = (bool)$st->fetch();
    }
    if (!$ok) fail('No access to this character', 403);
  }
  /* Live approvals for the sheet: in which rounds is this character approved? */
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

/* ---- custom species: visible to every signed-in group member ---- */
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

/* ---- user administration (admin only) ---- */
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
      /* Generate a one-time code, valid 24 hours. The administrator passes
         it to the user personally (chat, phone ...) - nothing is e-mailed. */
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
      $db->prepare('DELETE FROM tokens WHERE user_id = ?')->execute([$id]);   // sign out at once
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
      /* remove this user's character entries from every round */
      $db->prepare('DELETE FROM round_chars WHERE char_id IN (SELECT id FROM chars WHERE user_id = ?)')->execute([$id]);
      $db->prepare('DELETE FROM chars  WHERE user_id = ?')->execute([$id]);
      /* rounds the user was a member or GM of */
      $db->prepare('DELETE FROM round_members WHERE user_id = ?')->execute([$id]);
      $db->prepare('DELETE FROM round_chars WHERE round_id IN (SELECT id FROM rounds WHERE gm_id = ?)')->execute([$id]);
      $db->prepare('DELETE FROM round_members WHERE round_id IN (SELECT id FROM rounds WHERE gm_id = ?)')->execute([$id]);
      $db->prepare('DELETE FROM rounds WHERE gm_id = ?')->execute([$id]);
      /* the user's support tickets (and every message in them) */
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

/* ---- legal notice / privacy policy (site-wide, admin may write) ---- */
case 'legal_get': {
  $data = setting_get('legal');
  if (!is_array($data)) {   // carried over from the earlier file storage
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

/* ===================== game rounds (GM + approval) ===================== */
case 'round_create': {
  $user = auth();
  $name = trim((string)inp('name', ''));
  if ($name === '') fail('Round name is required');
  if (strlen($name) > 100) fail('Round name too long (max 100 characters)');
  /* Ceiling against spam: a user cannot create rounds without limit. */
  $st = $db->prepare('SELECT COUNT(*) FROM rounds WHERE gm_id = ?');
  $st->execute([$user['id']]);
  if ((int)$st->fetchColumn() >= 50) fail('You have reached the maximum number of rounds (50)');
  /* generate a unique invite code */
  $code = '';
  for ($i = 0; $i < 20; $i++) {
    $try = strtoupper(bin2hex(random_bytes(4)));   // 8 hex characters
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
  if (!$round) { usleep(300000); fail('No round found for this code', 404); }  // slows code brute-forcing
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

/* Appoint another GM or demote one (for a changing game master). */
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
  /* The founder always stays a GM. */
  if ((int)$tu['id'] === (int)$round['gm_id']) fail('The founding GM keeps their role');
  $st = $db->prepare('SELECT 1 FROM round_members WHERE round_id = ? AND user_id = ?');
  $st->execute([$id, $tu['id']]);
  if (!$st->fetch()) fail('User is not a member of this round', 404);
  $db->prepare('UPDATE round_members SET role = ? WHERE round_id = ? AND user_id = ?')
     ->execute([$role, $id, $tu['id']]);
  json_out(['ok' => true, 'role' => $role]);
}

/* Hand a round over: only the current founder (or an admin) can pass
   ownership to another member - when they stop playing, say. The new
   founder becomes GM; the previous one stays in the round as a co-GM. */
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
     ->execute([$id, $tu['id']]);                                   // the new founder is a GM
  $db->prepare("UPDATE round_members SET role = 'gm' WHERE round_id = ? AND user_id = ?")
     ->execute([$id, (int)$round['gm_id']]);                        // the old founder stays a co-GM
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
  /* Three states: 1 = approved, 0 = waiting, -1 = rejected. Rejected is
     deliberately not the same as "waiting" - the player should see that the
     GM has looked and said no, rather than keep waiting. */
  $a = inp('approved', true);
  if ($a === -1 || $a === '-1' || $a === 'reject') $state = -1;
  elseif ($a === true || $a === 1 || $a === '1' || $a === 'true') $state = 1;
  else $state = 0;
  /* A short reason, so the player knows what to change. Only meaningful on
     a rejection - it is cleared on approval or reset. */
  $note = trim((string)inp('note', ''));
  if (strlen($note) > 500) $note = substr($note, 0, 500);
  if ($state !== -1) $note = '';
  if ($state === 0) {
    $db->prepare('UPDATE round_chars SET approved = 0, approved_by = 0, approved_at = 0, note = ? WHERE round_id = ? AND char_id = ?')
       ->execute(['', $id, $charId]);
  } else {
    /* Record the rejection with a timestamp too - otherwise nobody knows
       when it came, or from whom. */
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
              /* approved is kept as a boolean (for old clients); state
                 carries the real value: 1 approved, 0 waiting, -1 rejected. */
              'approved' => (int)$r['approved'] === 1, 'state' => (int)$r['approved'],
              'approvedAt' => (int)$r['approved_at'], 'note' => (string)$r['note'],
              /* Was the sheet edited after it was approved? The player saves
                 into the same document, so the GM always sees the current
                 state - this note tells them something has changed, without
                 forcing a re-approval. */
              'changedSince' => ((int)$r['approved'] === 1
                                 && (int)$r['updated'] > (int)$r['approved_at'])];
  }
  json_out(['chars' => $out]);
}

/* For the player: which of MY characters are entered/approved in this round? */
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

/* ===================== the table-top (mini VTT) =====================
   The GM puts maps up and decides which one is showing; everyone in the
   round moves their own tokens and rolls into a shared log.

   Deliberately NOT in here: fog of war, line of sight, distance measuring.
   Those are what VTT projects founder on, and at a table where the GM says
   what you can see anyway, they buy nothing. */

/* The cheap one. Every client asks this and nothing else while idling, so
   it stays a single indexed read and returns a handful of bytes. */
case 'vtt_poll': {
  $user = auth();
  $id = (int)inp('round', 0);
  if (!round_is_member($id, $user['id'])) fail('Not a member of this round', 403);
  $st = $db->prepare('SELECT vtt_version FROM rounds WHERE id = ?');
  $st->execute([$id]);
  $row = $st->fetch(PDO::FETCH_ASSOC);
  if (!$row) fail('Round not found', 404);
  json_out(['v' => (int)$row['vtt_version']]);
}

/* The whole table-top. Only fetched once vtt_poll reports a new version. */
case 'vtt_state': {
  $user = auth();
  $id = (int)inp('round', 0);
  if (!round_is_member($id, $user['id'])) fail('Not a member of this round', 403);
  $st = $db->prepare('SELECT * FROM rounds WHERE id = ?');
  $st->execute([$id]);
  $round = $st->fetch(PDO::FETCH_ASSOC);
  if (!$round) fail('Round not found', 404);
  $activeMap = (int)$round['active_map'];

  $isGm = round_is_gm($id, $user['id']);
  $maps = [];
  $activeFog = null; $fogCols = 0; $fogRows = 0;
  $st = $db->prepare('SELECT * FROM round_maps WHERE round_id = ? ORDER BY id');
  $st->execute([$id]);
  foreach ($st->fetchAll(PDO::FETCH_ASSOC) as $m) {
    $row = ['id' => (int)$m['id'], 'name' => (string)$m['name'],
            'url' => 'vtt/' . $m['sha'] . '.' . $m['ext'],
            'w' => (int)$m['w'], 'h' => (int)$m['h'], 'grid' => (int)$m['grid']];
    if ((int)$m['id'] === $activeMap) {
      list($activeFog, $fogCols, $fogRows) = fog_read($m);
      $row['fog'] = $activeFog;
      $row['fogCols'] = $fogCols;
      $row['fogRows'] = $fogRows;
    }
    $maps[] = $row;
  }
  /* Only the tokens of the map actually showing - a round may hold thirty
     maps, and nobody needs the tokens of the other twenty-nine. */
  $tokens = [];
  if ($activeMap) {
    $st = $db->prepare('SELECT t.*, u.username AS owner FROM round_tokens t
                        LEFT JOIN users u ON u.id = t.owner_id
                        WHERE t.round_id = ? AND t.map_id = ? ORDER BY t.id');
    $st->execute([$id, $activeMap]);
    foreach ($st->fetchAll(PDO::FETCH_ASSOC) as $t) {
      /* Hidden tokens are dropped HERE, before the answer is built. Sending
         them and letting the browser not draw them would put the position
         of every enemy into a reply any player can read.

         Never one's OWN token, though. Where your own figure stands is no
         secret from you, and hiding it is a trap: it is not drawn, so it
         cannot be dragged back out of the dark either. Somebody who walks
         into an unexplored corner would lose their piece for good. */
      $mine = (int)$t['owner_id'] === (int)$user['id'];
      if (!$isGm && !$mine && $activeFog !== null
          && fog_hides_token($activeFog, $fogCols, $fogRows, $t['x'], $t['y'])) {
        continue;
      }
      $tokens[] = ['id' => (int)$t['id'], 'charId' => (int)$t['char_id'],
                   'kind' => (string)$t['kind'], 'label' => (string)$t['label'],
                   'color' => (string)$t['color'],
                   /* empty url = the client draws a default token itself */
                   'url' => $t['img_sha'] ? 'vtt/' . $t['img_sha'] . '.' . $t['img_ext'] : '',
                   'x' => (float)$t['x'], 'y' => (float)$t['y'], 'size' => (float)$t['size'],
                   'owner' => (string)$t['owner'], 'ownerId' => (int)$t['owner_id']];
    }
  }
  $log = [];
  $st = $db->prepare('SELECT l.*, u.username FROM round_log l
                      LEFT JOIN users u ON u.id = l.user_id
                      WHERE l.round_id = ? ORDER BY l.id DESC LIMIT 50');
  $st->execute([$id]);
  foreach (array_reverse($st->fetchAll(PDO::FETCH_ASSOC)) as $l) {
    $log[] = ['id' => (int)$l['id'], 'who' => (string)$l['username'],
              'kind' => (string)$l['kind'], 'text' => (string)$l['text'],
              'data' => (string)$l['data'], 'at' => (int)$l['created']];
  }
  /* Music: the list plus where the track stands. "at" is the server's
     clock, and the answer carries "now" from the same clock - so a client
     whose own clock is minutes off still computes the right position, it
     only ever works with the difference between the two. */
  $audio = [];
  $st = $db->prepare('SELECT * FROM round_audio WHERE round_id = ? ORDER BY id');
  $st->execute([$id]);
  foreach ($st->fetchAll(PDO::FETCH_ASSOC) as $a) {
    $audio[] = ['id' => (int)$a['id'], 'kind' => (string)$a['kind'],
                'name' => (string)$a['name'],
                'url' => $a['sha'] ? 'vtt/' . $a['sha'] . '.' . $a['ext'] : '',
                'yt' => (string)$a['yt_id'],
                'ytList' => (string)$a['yt_list']];
  }

  json_out(['v' => (int)$round['vtt_version'], 'activeMap' => $activeMap,
            'isGm' => $isGm,
            'maps' => $maps, 'tokens' => $tokens, 'log' => $log,
            'audio' => $audio,
            'audioState' => [
              'id' => (int)$round['audio_id'],
              'play' => (int)$round['audio_play'] === 1,
              'pos' => (float)$round['audio_pos'],
              'at' => (int)$round['audio_at'],
              'loop' => (int)$round['audio_loop'] === 1,
              'index' => (int)$round['audio_index'],
              'now' => time(),
            ]]);
}

/* ---- maps: the GM's business ---- */
case 'map_add': {
  $user = auth();
  $id = (int)inp('round', 0);
  if (!round_is_gm($id, $user['id'])) fail('Only a GM can add maps', 403);
  $st = $db->prepare('SELECT COUNT(*) FROM round_maps WHERE round_id = ?');
  $st->execute([$id]);
  if ((int)$st->fetchColumn() >= $CONFIG['max_maps_per_round']) {
    fail('This round already has ' . $CONFIG['max_maps_per_round'] . ' maps');
  }
  list($sha, $ext, $bytes, $w, $h) = vtt_store_image(inp('img', ''), $CONFIG['max_map_bytes'], 'Map');
  $name = mb_substr(trim((string)inp('name', '')), 0, 120);
  if ($name === '') $name = 'Map';
  $grid = max(0, min(512, (int)inp('grid', 0)));
  $st = $db->prepare('INSERT INTO round_maps (round_id, name, sha, ext, w, h, bytes, grid, created)
                      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)');
  $st->execute([$id, $name, $sha, $ext, $w, $h, $bytes, $grid, time()]);
  $mapId = (int)last_id('round_maps');
  /* The first map a round gets is shown at once - otherwise the GM uploads
     one and stares at an empty table wondering what went wrong. */
  if (!(int)$db->query('SELECT active_map FROM rounds WHERE id = ' . $id)->fetchColumn()) {
    $db->prepare('UPDATE rounds SET active_map = ? WHERE id = ?')->execute([$mapId, $id]);
  }
  vtt_touch($id);
  json_out(['ok' => true, 'id' => $mapId, 'url' => 'vtt/' . $sha . '.' . $ext,
            'w' => $w, 'h' => $h]);
}

case 'map_activate': {
  $user = auth();
  $id = (int)inp('round', 0);
  if (!round_is_gm($id, $user['id'])) fail('Only a GM can switch the map', 403);
  $mapId = (int)inp('map', 0);
  if ($mapId) {
    $st = $db->prepare('SELECT 1 FROM round_maps WHERE id = ? AND round_id = ?');
    $st->execute([$mapId, $id]);
    if (!$st->fetch()) fail('Map not found in this round', 404);
  }
  $db->prepare('UPDATE rounds SET active_map = ? WHERE id = ?')->execute([$mapId, $id]);
  vtt_touch($id);
  json_out(['ok' => true]);
}

/* The grid belongs to the map, not to the round: one map is drawn at
   40 px per square, the next at 64. */
case 'map_grid': {
  $user = auth();
  $id = (int)inp('round', 0);
  if (!round_is_gm($id, $user['id'])) fail('Only a GM can change the grid', 403);
  $mapId = (int)inp('map', 0);
  $grid = max(0, min(512, (int)inp('grid', 0)));
  $st = $db->prepare('SELECT 1 FROM round_maps WHERE id = ? AND round_id = ?');
  $st->execute([$mapId, $id]);
  if (!$st->fetch()) fail('Map not found in this round', 404);
  $db->prepare('UPDATE round_maps SET grid = ? WHERE id = ?')->execute([$grid, $mapId]);
  vtt_touch($id);
  json_out(['ok' => true, 'grid' => $grid]);
}

/* Painting the fog. The GM sends the cells they just brushed over plus the
   state to put them in, or "all" to redo the whole map at once. Sending
   single cells rather than the entire mask keeps a brush stroke small, and
   two GMs painting at the same time do not overwrite each other's work. */
case 'map_fog': {
  $user = auth();
  $id = (int)inp('round', 0);
  if (!round_is_gm($id, $user['id'])) fail('Only a GM can change the fog', 403);
  $mapId = (int)inp('map', 0);
  $st = $db->prepare('SELECT * FROM round_maps WHERE id = ? AND round_id = ?');
  $st->execute([$mapId, $id]);
  $map = $st->fetch(PDO::FETCH_ASSOC);
  if (!$map) fail('Map not found in this round', 404);
  list($fog, $cols, $rows) = fog_read($map);

  $state = (string)inp('state', '2');
  if (!in_array($state, ['0', '1', '2'], true)) fail('Unknown fog state');

  $all = inp('all', null);
  if ($all !== null) {
    $fog = str_repeat($state, $cols * $rows);
  } else {
    $cells = inp('cells', []);
    if (!is_array($cells)) fail('cells must be a list');
    /* A brush stroke over a big map can cover a lot of cells; the cap only
       stops a malformed request from looping forever. */
    if (count($cells) > 20000) fail('Too many cells in one call');
    foreach ($cells as $c) {
      $i = (int)$c;
      if ($i >= 0 && $i < $cols * $rows) $fog[$i] = $state;
    }
  }
  $db->prepare('UPDATE round_maps SET fog = ?, fog_cols = ?, fog_rows = ? WHERE id = ?')
     ->execute([$fog, $cols, $rows, $mapId]);
  vtt_touch($id);
  json_out(['ok' => true, 'cols' => $cols, 'rows' => $rows]);
}

case 'map_delete': {
  $user = auth();
  $id = (int)inp('round', 0);
  if (!round_is_gm($id, $user['id'])) fail('Only a GM can delete maps', 403);
  $mapId = (int)inp('map', 0);
  $st = $db->prepare('SELECT sha, ext FROM round_maps WHERE id = ? AND round_id = ?');
  $st->execute([$mapId, $id]);
  $map = $st->fetch(PDO::FETCH_ASSOC);
  if (!$map) fail('Map not found in this round', 404);
  $db->prepare('DELETE FROM round_tokens WHERE round_id = ? AND map_id = ?')->execute([$id, $mapId]);
  $db->prepare('DELETE FROM round_maps WHERE id = ? AND round_id = ?')->execute([$mapId, $id]);
  $db->prepare('UPDATE rounds SET active_map = 0 WHERE id = ? AND active_map = ?')->execute([$id, $mapId]);
  vtt_delete_unused($map['sha'], $map['ext']);
  vtt_touch($id);
  json_out(['ok' => true]);
}

/* ---- tokens ---- */
case 'token_add': {
  $user = auth();
  $id = (int)inp('round', 0);
  if (!round_is_member($id, $user['id'])) fail('Not a member of this round', 403);
  $isGm = round_is_gm($id, $user['id']);
  $mapId = (int)inp('map', 0);
  $st = $db->prepare('SELECT 1 FROM round_maps WHERE id = ? AND round_id = ?');
  $st->execute([$mapId, $id]);
  if (!$st->fetch()) fail('Map not found in this round', 404);
  $st = $db->prepare('SELECT COUNT(*) FROM round_tokens WHERE round_id = ? AND map_id = ?');
  $st->execute([$id, $mapId]);
  if ((int)$st->fetchColumn() >= $CONFIG['max_tokens_per_map']) {
    fail('This map already carries ' . $CONFIG['max_tokens_per_map'] . ' tokens');
  }

  /* A token may stand for one of the round's documents. A player may only
     do that with their own, and only once the GM has approved it for the
     round - otherwise a sheet nobody has seen turns up on the table. */
  $charId = (int)inp('charId', 0);
  $kind = 'npc';
  if ($charId) {
    $st = $db->prepare('SELECT c.id, c.kind, c.user_id, rc.approved
                        FROM chars c LEFT JOIN round_chars rc
                          ON rc.char_id = c.id AND rc.round_id = ?
                        WHERE c.id = ?');
    $st->execute([$id, $charId]);
    $doc = $st->fetch(PDO::FETCH_ASSOC);
    if (!$doc) fail('Document not found', 404);
    if (!$isGm) {
      if ((int)$doc['user_id'] !== (int)$user['id']) fail('That is not your document', 403);
      if ((int)$doc['approved'] !== 1) fail('The GM has not approved this document for the round yet', 403);
    }
    $kind = $doc['kind'] ? $doc['kind'] : 'char';
  }
  $kindIn = (string)inp('kind', '');
  if ($kindIn !== '' && in_array($kindIn, ['char', 'droid', 'ship', 'npc'], true)) $kind = $kindIn;

  /* A picture is optional: without one the client draws a coloured disc
     with the initials, which costs neither storage nor a request. */
  $sha = $ext = '';
  $img = (string)inp('img', '');
  if ($img !== '') {
    list($sha, $ext) = vtt_store_image($img, $CONFIG['max_token_bytes'], 'Token picture');
  }
  $st = $db->prepare('INSERT INTO round_tokens
      (round_id, map_id, char_id, owner_id, kind, label, color, img_sha, img_ext, x, y, size, created)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
  $st->execute([$id, $mapId, $charId, $user['id'], $kind,
                mb_substr(trim((string)inp('label', '')), 0, 60),
                preg_replace('/[^#0-9a-zA-Z]/', '', (string)inp('color', '')),
                $sha, $ext, vtt_frac(inp('x', 0.5)), vtt_frac(inp('y', 0.5)),
                max(0.25, min(8, (float)inp('size', 1))), time()]);
  vtt_touch($id);
  json_out(['ok' => true, 'id' => (int)last_id('round_tokens'),
            'url' => $sha ? 'vtt/' . $sha . '.' . $ext : '']);
}

/* Moving is the one call that happens constantly - a token being dragged
   sends it over and over. It therefore does as little as possible. */
case 'token_move': {
  $user = auth();
  $id = (int)inp('round', 0);
  if (!round_is_member($id, $user['id'])) fail('Not a member of this round', 403);
  $tokenId = (int)inp('token', 0);
  $st = $db->prepare('SELECT owner_id FROM round_tokens WHERE id = ? AND round_id = ?');
  $st->execute([$tokenId, $id]);
  $tok = $st->fetch(PDO::FETCH_ASSOC);
  if (!$tok) fail('Token not found', 404);
  if ((int)$tok['owner_id'] !== (int)$user['id'] && !round_is_gm($id, $user['id'])) {
    fail('You can only move your own tokens', 403);
  }
  $db->prepare('UPDATE round_tokens SET x = ?, y = ? WHERE id = ?')
     ->execute([vtt_frac(inp('x', 0.5)), vtt_frac(inp('y', 0.5)), $tokenId]);
  vtt_touch($id);
  json_out(['ok' => true]);
}

case 'token_delete': {
  $user = auth();
  $id = (int)inp('round', 0);
  if (!round_is_member($id, $user['id'])) fail('Not a member of this round', 403);
  $tokenId = (int)inp('token', 0);
  $st = $db->prepare('SELECT owner_id, img_sha, img_ext FROM round_tokens WHERE id = ? AND round_id = ?');
  $st->execute([$tokenId, $id]);
  $tok = $st->fetch(PDO::FETCH_ASSOC);
  if (!$tok) fail('Token not found', 404);
  if ((int)$tok['owner_id'] !== (int)$user['id'] && !round_is_gm($id, $user['id'])) {
    fail('You can only remove your own tokens', 403);
  }
  $db->prepare('DELETE FROM round_tokens WHERE id = ?')->execute([$tokenId]);
  if ($tok['img_sha']) vtt_delete_unused($tok['img_sha'], $tok['img_ext']);
  vtt_touch($id);
  json_out(['ok' => true]);
}

/* ---- background music ----
   On the YouTube half: only the video id is stored. We do not fetch the
   video, do not pull the audio out of it and do not re-serve it - every
   client plays it from YouTube in an embedded player. Relaying it through
   this server would break YouTube's terms and put someone else's music on
   our wire; this way YouTube delivers it, exactly as if each player had
   opened the video themselves. */
case 'audio_add': {
  $user = auth();
  $id = (int)inp('round', 0);
  if (!round_is_gm($id, $user['id'])) fail('Only a GM can add music', 403);
  $st = $db->prepare('SELECT COUNT(*) FROM round_audio WHERE round_id = ?');
  $st->execute([$id]);
  if ((int)$st->fetchColumn() >= $CONFIG['max_audio_per_round']) {
    fail('This round already has ' . $CONFIG['max_audio_per_round'] . ' tracks');
  }
  $name = mb_substr(trim((string)inp('name', '')), 0, 120);
  $yt = trim((string)inp('yt', ''));
  if ($yt !== '') {
    /* Accept whatever the GM pasted - a watch link, a short link, an
       embed link, a bare id, or a playlist - and keep only the ids.

       A link can carry both: "watch?v=abc&list=PL123" is one video INSIDE
       a playlist. Then the playlist wins, because that is what the GM
       meant when they pasted it; the video id only says where to start.
       Playlist ids are not a fixed length (PL..., UU..., RD..., OLAK5uy...
       and others), hence the looser pattern. */
    $vid = '';
    $list = '';
    if (preg_match('#[?&]list=([A-Za-z0-9_-]{12,64})#', $yt, $m)) $list = $m[1];
    elseif (preg_match('#^(PL|UU|LL|FL|RD|OLAK5uy)[A-Za-z0-9_-]{10,}$#', $yt)) $list = $yt;
    if (preg_match('#(?:v=|youtu\.be/|/embed/|/shorts/)([A-Za-z0-9_-]{11})#', $yt, $m)) $vid = $m[1];
    elseif (preg_match('#^[A-Za-z0-9_-]{11}$#', $yt)) $vid = $yt;
    if ($vid === '' && $list === '') fail('That does not look like a YouTube link');
    if ($name === '') $name = $list !== '' ? 'YouTube-Playlist' : 'YouTube';
    $st = $db->prepare('INSERT INTO round_audio (round_id, kind, name, yt_id, yt_list, created)
                        VALUES (?, ?, ?, ?, ?, ?)');
    $st->execute([$id, 'yt', $name, $vid, $list, time()]);
  } else {
    list($sha, $ext, $bytes) = vtt_store_audio(inp('file', ''), $CONFIG['max_audio_bytes']);
    if ($name === '') $name = 'Track';
    $st = $db->prepare('INSERT INTO round_audio (round_id, kind, name, sha, ext, bytes, created)
                        VALUES (?, ?, ?, ?, ?, ?, ?)');
    $st->execute([$id, 'file', $name, $sha, $ext, $bytes, time()]);
  }
  vtt_touch($id);
  json_out(['ok' => true, 'id' => (int)last_id('round_audio')]);
}

/* Play, pause or jump. The GM is the only clock: they send the position
   they are at, the server stamps the moment, and every client works out
   the rest for itself. */
case 'audio_control': {
  $user = auth();
  $id = (int)inp('round', 0);
  if (!round_is_gm($id, $user['id'])) fail('Only a GM controls the music', 403);
  $trackId = (int)inp('track', 0);
  if ($trackId) {
    $st = $db->prepare('SELECT 1 FROM round_audio WHERE id = ? AND round_id = ?');
    $st->execute([$trackId, $id]);
    if (!$st->fetch()) fail('Track not found in this round', 404);
  }
  $play = inp('play', null);
  $pos = (float)inp('pos', 0);
  if (!is_finite($pos) || $pos < 0) $pos = 0;
  $loop = inp('loop', null);
  $index = inp('index', null);
  $sql = 'UPDATE rounds SET audio_id = ?, audio_pos = ?, audio_at = ?';
  $args = [$trackId, $pos, time()];
  if ($play !== null) { $sql .= ', audio_play = ?'; $args[] = ($play ? 1 : 0); }
  if ($loop !== null) { $sql .= ', audio_loop = ?'; $args[] = ($loop ? 1 : 0); }
  if ($index !== null) { $sql .= ', audio_index = ?'; $args[] = max(0, min(500, (int)$index)); }
  $sql .= ' WHERE id = ?';
  $args[] = $id;
  $db->prepare($sql)->execute($args);
  vtt_touch($id);
  json_out(['ok' => true]);
}

case 'audio_delete': {
  $user = auth();
  $id = (int)inp('round', 0);
  if (!round_is_gm($id, $user['id'])) fail('Only a GM can remove music', 403);
  $trackId = (int)inp('track', 0);
  $st = $db->prepare('SELECT sha, ext FROM round_audio WHERE id = ? AND round_id = ?');
  $st->execute([$trackId, $id]);
  $tr = $st->fetch(PDO::FETCH_ASSOC);
  if (!$tr) fail('Track not found in this round', 404);
  $db->prepare('DELETE FROM round_audio WHERE id = ? AND round_id = ?')->execute([$trackId, $id]);
  $db->prepare('UPDATE rounds SET audio_id = 0, audio_play = 0 WHERE id = ? AND audio_id = ?')
     ->execute([$id, $trackId]);
  if ($tr['sha']) vtt_delete_unused($tr['sha'], $tr['ext']);
  vtt_touch($id);
  json_out(['ok' => true]);
}

/* ---- voice and video ----
   Hand out TURN credentials that expire. This is coturn's REST scheme
   (use-auth-secret in turnserver.conf): the user name is an expiry stamp,
   the password is an HMAC of that name with the shared secret. coturn
   recomputes the same HMAC and lets the client in without ever having
   heard of that user - no account list to keep in step, and a credential
   caught in a browser's network log is worthless a few hours later.

   Only members of the round get one, so the relay cannot be used by
   anyone who merely found the page. */
case 'turn_credentials': {
  $user = auth();
  $id = (int)inp('round', 0);
  if (!round_is_member($id, $user['id'])) fail('Not a member of this round', 403);
  $cfg = isset($CONFIG['turn']) ? $CONFIG['turn'] : [];
  $ice = [];
  foreach ((array)(isset($cfg['stun']) ? $cfg['stun'] : []) as $u) {
    if ($u) $ice[] = ['urls' => $u];
  }
  $urls = array_values(array_filter((array)(isset($cfg['urls']) ? $cfg['urls'] : [])));
  $secret = (string)(isset($cfg['secret']) ? $cfg['secret'] : '');
  if ($urls && $secret !== '') {
    $ttl = (int)(isset($cfg['ttl']) ? $cfg['ttl'] : 43200);
    if ($ttl < 300) $ttl = 300;
    /* coturn expects "<expiry>:<anything>". The user id is only there to
       tell entries apart in the log. */
    $username = (time() + $ttl) . ':swd6-' . (int)$user['id'];
    $password = base64_encode(hash_hmac('sha1', $username, $secret, true));
    $ice[] = ['urls' => $urls, 'username' => $username, 'credential' => $password];
  }
  json_out(['iceServers' => $ice, 'ttl' => (int)(isset($cfg['ttl']) ? $cfg['ttl'] : 0),
            'turnConfigured' => ($urls && $secret !== '')]);
}

/* Announce oneself and find out who else is there. Called every few
   seconds while the call is open; the answer is what drives the mesh. */
case 'rtc_join': {
  $user = auth();
  $id = (int)inp('round', 0);
  if (!round_is_member($id, $user['id'])) fail('Not a member of this round', 403);
  $cam = inp('cam', null);
  $mic = inp('mic', null);
  $now = time();
  $st = $db->prepare('SELECT 1 FROM round_calls WHERE round_id = ? AND user_id = ?');
  $st->execute([$id, $user['id']]);
  if ($st->fetch()) {
    $sql = 'UPDATE round_calls SET seen = ?';
    $args = [$now];
    if ($cam !== null) { $sql .= ', cam = ?'; $args[] = $cam ? 1 : 0; }
    if ($mic !== null) { $sql .= ', mic = ?'; $args[] = $mic ? 1 : 0; }
    $sql .= ' WHERE round_id = ? AND user_id = ?';
    $args[] = $id; $args[] = $user['id'];
    $db->prepare($sql)->execute($args);
  } else {
    $db->prepare(insert_ignore() . ' round_calls (round_id, user_id, cam, mic, seen)
                  VALUES (?,?,?,?,?)' . on_conflict())
       ->execute([$id, $user['id'], $cam ? 1 : 0, $mic === null ? 1 : ($mic ? 1 : 0), $now]);
  }
  /* Sweep out the seats nobody is sitting in any more. Doing it here means
     no cron job is needed - the people still in the call clean up after
     the ones who left. */
  $db->prepare('DELETE FROM round_calls WHERE seen < ?')->execute([$now - CALL_TIMEOUT]);
  $db->prepare('DELETE FROM round_signals WHERE created < ?')->execute([$now - 120]);

  $st = $db->prepare('SELECT c.user_id, c.cam, c.mic, u.username FROM round_calls c
                      JOIN users u ON u.id = c.user_id
                      WHERE c.round_id = ? AND c.seen >= ? ORDER BY c.user_id');
  $st->execute([$id, $now - CALL_TIMEOUT]);
  $peers = [];
  foreach ($st->fetchAll(PDO::FETCH_ASSOC) as $p) {
    $peers[] = ['id' => (int)$p['user_id'], 'name' => (string)$p['username'],
                'cam' => (int)$p['cam'] === 1, 'mic' => (int)$p['mic'] === 1,
                'me' => (int)$p['user_id'] === (int)$user['id']];
  }
  json_out(['peers' => $peers, 'me' => (int)$user['id'], 'timeout' => CALL_TIMEOUT]);
}

case 'rtc_leave': {
  $user = auth();
  $id = (int)inp('round', 0);
  $db->prepare('DELETE FROM round_calls WHERE round_id = ? AND user_id = ?')
     ->execute([$id, $user['id']]);
  $db->prepare('DELETE FROM round_signals WHERE round_id = ? AND (from_id = ? OR to_id = ?)')
     ->execute([$id, $user['id'], $user['id']]);
  json_out(['ok' => true]);
}

/* Put one message in another member's post box. The body is passed
   through untouched - it is an SDP or an ICE candidate, and only the two
   browsers need to understand it. */
case 'rtc_send': {
  $user = auth();
  $id = (int)inp('round', 0);
  if (!round_is_member($id, $user['id'])) fail('Not a member of this round', 403);
  $to = (int)inp('to', 0);
  if (!$to || $to === (int)$user['id']) fail('No recipient');
  if (!round_is_member($id, $to)) fail('That user is not in this round', 403);
  $body = (string)inp('body', '');
  /* An SDP with a lot of candidates gets long, but not this long. The cap
     is only there so a single call cannot fill the table. */
  if ($body === '' || strlen($body) > 64000) fail('Message empty or too large');
  $db->prepare('INSERT INTO round_signals (round_id, from_id, to_id, body, created)
                VALUES (?,?,?,?,?)')
     ->execute([$id, $user['id'], $to, $body, time()]);
  json_out(['ok' => true]);
}

/* Empty my post box. Messages are handed over once and deleted - both
   sides have to keep them anyway, and leaving them lying around would
   have every poll replay the whole handshake. */
case 'rtc_recv': {
  $user = auth();
  $id = (int)inp('round', 0);
  if (!round_is_member($id, $user['id'])) fail('Not a member of this round', 403);
  $st = $db->prepare('SELECT id, from_id, body FROM round_signals
                      WHERE round_id = ? AND to_id = ? ORDER BY id LIMIT 60');
  $st->execute([$id, $user['id']]);
  $rows = $st->fetchAll(PDO::FETCH_ASSOC);
  $out = [];
  $ids = [];
  foreach ($rows as $r) {
    $out[] = ['from' => (int)$r['from_id'], 'body' => (string)$r['body']];
    $ids[] = (int)$r['id'];
  }
  if ($ids) {
    $db->exec('DELETE FROM round_signals WHERE id IN (' . implode(',', $ids) . ')');
  }
  json_out(['messages' => $out]);
}

/* ---- the shared roll log ---- */
case 'vtt_log': {
  $user = auth();
  $id = (int)inp('round', 0);
  if (!round_is_member($id, $user['id'])) fail('Not a member of this round', 403);
  $text = mb_substr(trim((string)inp('text', '')), 0, 300);
  if ($text === '') fail('Nothing to log');
  $kind = (string)inp('kind', 'roll');
  if (!in_array($kind, ['roll', 'note'], true)) $kind = 'note';
  /* The single dice, so every client can show the roll on the map instead
     of only a line of text. Passed through as the client sent it and
     capped in size - it is read back by the same code that wrote it, and
     it never reaches the page unescaped. */
  $data = (string)inp('data', '');
  if (strlen($data) > 2000) $data = '';
  $db->prepare('INSERT INTO round_log (round_id, user_id, kind, text, data, created)
                VALUES (?, ?, ?, ?, ?, ?)')
     ->execute([$id, $user['id'], $kind, $text, $data, time()]);
  /* Keep the log from growing without end: a long campaign would otherwise
     carry thousands of rows nobody ever scrolls back to. Strictly LESS
     THAN the oldest row worth keeping - with "<=" this deletes the very
     row it is supposed to keep, and every single roll vanished the moment
     it was written. */
  $db->prepare('DELETE FROM round_log WHERE round_id = ? AND id < (
                  SELECT MIN(id) FROM (SELECT id FROM round_log WHERE round_id = ?
                                       ORDER BY id DESC LIMIT 200) keep)')
     ->execute([$id, $id]);
  vtt_touch($id);
  json_out(['ok' => true]);
}

/* ===================== support / ticket system ===================== */
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
  /* unread = messages from the other side younger than my last visit */
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
  /* Opening counts as reading - the notice disappears for me alone. */
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
  /* Cap endlessly long threads (every message can carry an image). */
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
  /* An admin reply -> "answered"; a user reply -> "open" again. */
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

/* ---- high score table for the hidden extra (no sign-in) ---- */
case 'arcade_top': {
  $st = $db->query('SELECT name, score FROM arcade_scores ORDER BY score DESC, id ASC LIMIT 10');
  $out = [];
  foreach ($st->fetchAll(PDO::FETCH_ASSOC) as $r)
    $out[] = ['name' => $r['name'], 'score' => (int)$r['score']];
  json_out(['scores' => $out]);
}
case 'arcade_add': {
  /* Open to everyone, so kept on a short leash: three capital letters, a
     score of plausible size, and at most one entry every few seconds. The
     table is trimmed to 100 rows so it cannot grow. */
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

/* Just the count - every page asks for it to badge the cloud button. */
case 'ticket_status': {
  $user = auth();
  $admin = is_admin($user);
  json_out(['unread' => ticket_unread_count($user, $admin), 'isAdmin' => $admin]);
}

default:
  fail('Unknown action', 404);
}
