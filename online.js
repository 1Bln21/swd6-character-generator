/* =====================================================================
   Star Wars D6 Charaktergenerator – Online-Konten (Client)
   Login/Registrierung, TOTP-MFA, Cloud-Charaktere, Freigaben.
   Benötigt app.js (t, LANG, C, esc, migrate, renderAll) und qrcode.js.
   ===================================================================== */
'use strict';

/* ---------------- Übersetzungen ergänzen ---------------- */
Object.assign(T.de, {
  btn_online: '☁ Online',
  online_title: 'Online-Konto',
  online_login: 'Anmelden', online_register: 'Registrieren',
  online_username: 'Benutzername', online_password: 'Passwort',
  online_password2: 'Passwort (wiederholen)',
  online_regcode: 'Einladungscode',
  online_totp_code: 'Code aus der Authenticator-App',
  online_totp_or_backup: 'Authenticator-Code (oder Backup-Code)',
  online_do_login: 'Anmelden', online_do_register: 'Konto erstellen',
  online_logout: 'Abmelden',
  online_logged_in_as: 'Angemeldet als',
  online_pw_mismatch: 'Die Passwörter stimmen nicht überein.',
  online_pw_short: 'Das Passwort muss mindestens 8 Zeichen haben.',
  online_mfa: 'Zwei-Faktor-Anmeldung (MFA)',
  online_mfa_on: 'MFA ist aktiv', online_mfa_off: 'MFA ist nicht eingerichtet',
  online_mfa_setup: 'MFA einrichten', online_mfa_disable: 'MFA deaktivieren',
  online_mfa_scan: 'QR-Code mit der Authenticator-App scannen (Google Authenticator, Microsoft Authenticator, Aegis, Authy …) oder den Schlüssel manuell eingeben:',
  online_mfa_confirm: 'Danach den 6-stelligen Code eingeben:',
  online_mfa_verify: 'Bestätigen',
  online_mfa_backup_title: 'Backup-Codes (einmalig verwendbar)',
  online_mfa_backup_hint: 'Jetzt sicher aufbewahren (z. B. ausdrucken)! Mit einem Backup-Code kannst du dich anmelden, wenn das Handy verloren geht. Sie werden nur EINMAL angezeigt.',
  online_mfa_backup_left: 'Backup-Codes übrig',
  online_mfa_done: 'Fertig',
  online_my_chars: 'Meine Online-{docs}',
  online_shared_chars: 'Für mich freigegeben',
  online_upload: '⬆ {doc} hochladen',
  online_load: 'Laden', online_delete: 'Löschen', online_share: 'Freigeben',
  online_from: 'von', online_none: '– keine –',
  online_share_title: 'Freigeben an Benutzer:',
  online_share_add: 'Freigeben',
  online_share_current: 'Freigegeben an:',
  online_share_remove: 'entfernen',
  online_confirm_delete_cloud: 'Online-Charakter „{name}“ wirklich löschen?',
  online_loaded: 'Charakter geladen.',
  online_saved: 'Hochgeladen ✔',
  online_readonly_hint: 'Freigegebene Charaktere werden als Kopie geladen – Speichern legt sie unter deinem Konto ab.',
  online_no_name: 'Bitte zuerst einen Namen vergeben.',
  online_error: 'Fehler: ',
  online_offline: 'Server nicht erreichbar.',
  online_close: 'Schließen',
  online_updated: 'Stand',
  online_pending_title: 'Registrierung eingegangen',
  online_pending_text: 'Dein Konto muss noch von einem Administrator freigegeben werden. Sobald das erledigt ist, kannst du dich anmelden.',
  online_admin: 'Verwaltung',
  online_admin_open: '⚙ Benutzerverwaltung öffnen',
  online_admin_search: 'Benutzer suchen …',
  online_loading: 'Lädt …',
  online_admin_mode: 'Registrierung',
  online_mode_open: 'Offen – jeder kann sich sofort anmelden',
  online_mode_approval: 'Mit Freigabe – Konten müssen bestätigt werden',
  online_mode_closed: 'Geschlossen – keine neuen Registrierungen',
  online_admin_users: 'Benutzer',
  online_col_user: 'Benutzer', online_col_since: 'Registriert', online_col_status: 'Status',
  online_col_chars: 'Chars', online_col_actions: 'Aktionen',
  online_status_ok: 'aktiv', online_status_pending: 'wartet auf Freigabe',
  online_badge_admin: 'Admin', online_badge_mfa: 'MFA',
  online_act_approve: 'Freigeben', online_act_block: 'Sperren',
  online_act_promote: 'Zum Admin', online_act_demote: 'Admin entziehen',
  online_act_delete: 'Löschen', online_act_resetmfa: 'MFA zurücksetzen',
  online_confirm_delete_user: 'Benutzer „{name}“ mit allen Charakteren wirklich löschen?',
  online_confirm_resetmfa: 'Zwei-Faktor-Anmeldung für „{name}“ zurücksetzen? (z. B. bei verlorenem Handy)',
  online_confirm_demote: 'Admin-Rechte von „{name}“ entziehen?',
  online_you: 'du',
  online_forgot: 'Passwort vergessen?',
  online_reset_title: 'Passwort zurücksetzen',
  online_reset_hint: 'Gib deinen Wiederherstellungscode ein (bei der Registrierung angezeigt) – oder lass dir von einem Administrator einen Einmal-Code geben.',
  online_reset_code: 'Wiederherstellungs- oder Einmal-Code',
  online_new_password: 'Neues Passwort',
  online_do_reset: 'Passwort neu setzen',
  online_reset_done: 'Passwort geändert – du kannst dich jetzt anmelden.',
  online_recovery_title: 'Wiederherstellungscode',
  online_recovery_hint: 'Jetzt sicher aufbewahren! Mit diesem Code (und deinem Benutzernamen) kannst du dir ein neues Passwort setzen, falls du es vergisst. Er wird nur EINMAL angezeigt.',
  online_recovery_new: '↻ Neuen Wiederherstellungscode erzeugen',
  online_pw_change: 'Passwort ändern',
  online_pw_old: 'Aktuelles Passwort',
  online_pw_changed: 'Passwort geändert ✔',
  online_act_resetpw: 'Passwort zurücksetzen',
  online_confirm_resetpw: 'Einmal-Code für „{name}“ erzeugen? Das alte Passwort bleibt gültig, bis der Code benutzt wird.',
  online_resetcode_for: 'Einmal-Code für „{name}“ (24 h gültig) – bitte persönlich weitergeben:',
});
Object.assign(T.en, {
  btn_online: '☁ Online',
  online_title: 'Online Account',
  online_login: 'Sign in', online_register: 'Register',
  online_username: 'Username', online_password: 'Password',
  online_password2: 'Password (repeat)',
  online_regcode: 'Invitation code',
  online_totp_code: 'Code from your authenticator app',
  online_totp_or_backup: 'Authenticator code (or backup code)',
  online_do_login: 'Sign in', online_do_register: 'Create account',
  online_logout: 'Sign out',
  online_logged_in_as: 'Signed in as',
  online_pw_mismatch: 'The passwords do not match.',
  online_pw_short: 'The password must be at least 8 characters.',
  online_mfa: 'Two-factor authentication (MFA)',
  online_mfa_on: 'MFA is active', online_mfa_off: 'MFA is not set up',
  online_mfa_setup: 'Set up MFA', online_mfa_disable: 'Disable MFA',
  online_mfa_scan: 'Scan the QR code with your authenticator app (Google Authenticator, Microsoft Authenticator, Aegis, Authy …) or enter the key manually:',
  online_mfa_confirm: 'Then enter the 6-digit code:',
  online_mfa_verify: 'Verify',
  online_mfa_backup_title: 'Backup codes (single use)',
  online_mfa_backup_hint: 'Store these safely now (e.g. print them)! A backup code lets you sign in if you lose your phone. They are shown only ONCE.',
  online_mfa_backup_left: 'backup codes left',
  online_mfa_done: 'Done',
  online_my_chars: 'My online {docs}',
  online_shared_chars: 'Shared with me',
  online_upload: '⬆ Upload current {doc}',
  online_load: 'Load', online_delete: 'Delete', online_share: 'Share',
  online_from: 'by', online_none: '– none –',
  online_share_title: 'Share with user:',
  online_share_add: 'Share',
  online_share_current: 'Shared with:',
  online_share_remove: 'remove',
  online_confirm_delete_cloud: 'Really delete online character "{name}"?',
  online_loaded: 'Character loaded.',
  online_saved: 'Uploaded ✔',
  online_readonly_hint: 'Shared characters are loaded as a copy – saving stores them under your own account.',
  online_no_name: 'Please enter a name first.',
  online_error: 'Error: ',
  online_offline: 'Server not reachable.',
  online_close: 'Close',
  online_updated: 'Updated',
  online_pending_title: 'Registration received',
  online_pending_text: 'Your account still needs to be approved by an administrator. Once that is done you can sign in.',
  online_admin: 'Administration',
  online_admin_open: '⚙ Open user management',
  online_admin_search: 'Search users …',
  online_loading: 'Loading …',
  online_admin_mode: 'Registration',
  online_mode_open: 'Open – anyone can sign up immediately',
  online_mode_approval: 'Approval required – accounts must be confirmed',
  online_mode_closed: 'Closed – no new registrations',
  online_admin_users: 'Users',
  online_col_user: 'User', online_col_since: 'Registered', online_col_status: 'Status',
  online_col_chars: 'Chars', online_col_actions: 'Actions',
  online_status_ok: 'active', online_status_pending: 'awaiting approval',
  online_badge_admin: 'Admin', online_badge_mfa: 'MFA',
  online_act_approve: 'Approve', online_act_block: 'Block',
  online_act_promote: 'Make admin', online_act_demote: 'Remove admin',
  online_act_delete: 'Delete', online_act_resetmfa: 'Reset MFA',
  online_confirm_delete_user: 'Really delete user “{name}” and all their characters?',
  online_confirm_resetmfa: 'Reset two-factor authentication for “{name}”? (e.g. lost phone)',
  online_confirm_demote: 'Remove administrator rights from “{name}”?',
  online_you: 'you',
  online_forgot: 'Forgot your password?',
  online_reset_title: 'Reset password',
  online_reset_hint: 'Enter your recovery code (shown when you registered) – or ask an administrator for a one-time code.',
  online_reset_code: 'Recovery or one-time code',
  online_new_password: 'New password',
  online_do_reset: 'Set new password',
  online_reset_done: 'Password changed – you can sign in now.',
  online_recovery_title: 'Recovery code',
  online_recovery_hint: 'Store this safely now! With this code (and your user name) you can set a new password if you forget it. It is shown only ONCE.',
  online_recovery_new: '↻ Generate a new recovery code',
  online_pw_change: 'Change password',
  online_pw_old: 'Current password',
  online_pw_changed: 'Password changed ✔',
  online_act_resetpw: 'Reset password',
  online_confirm_resetpw: 'Generate a one-time code for “{name}”? The old password stays valid until the code is used.',
  online_resetcode_for: 'One-time code for “{name}” (valid 24 h) – hand it over personally:',
});

/* ---- Spielrunden (GM + Gruppen-Freigabe) ---- */
Object.assign(T.de, {
  online_rounds: 'Spielrunden',
  rounds_open: '🎲 Spielrunden öffnen',
  rounds_title: 'Spielrunden',
  rounds_create: 'Neue Runde anlegen',
  rounds_name: 'Name der Runde',
  rounds_create_btn: 'Runde anlegen',
  rounds_join: 'Einer Runde beitreten',
  rounds_code: 'Einladungscode',
  rounds_join_btn: 'Beitreten',
  rounds_mine: 'Meine Runden',
  rounds_gm: 'GM',
  rounds_members: 'Mitglieder',
  rounds_role_gm: 'GM', rounds_role_player: 'Spieler',
  rounds_back: 'zurück',
  rounds_invite: 'Einladungscode',
  rounds_invite_hint: 'Diesen Code an deine Spieler weitergeben – damit treten sie der Runde bei.',
  rounds_kick: 'entfernen',
  rounds_kick_confirm: '„{name}“ aus der Runde entfernen?',
  rounds_founder: 'Gründer',
  rounds_make_gm: '→ zum GM',
  rounds_make_player: '→ zum Spieler',
  rounds_make_gm_confirm: '„{name}“ zum weiteren GM dieser Runde ernennen? Ein GM kann Charaktere ansehen, freigeben und Mitglieder verwalten.',
  rounds_my_chars: 'Meine angemeldeten Charaktere',
  rounds_assign: 'Anmelden',
  rounds_unassign: 'abmelden',
  rounds_approved: 'freigegeben',
  rounds_pending: 'wartet auf Freigabe',
  rounds_party: 'Charaktere der Runde',
  rounds_approve: 'Freigeben',
  rounds_revoke: 'Freigabe zurücknehmen',
  rounds_delete: 'Runde löschen',
  rounds_delete_confirm: 'Runde „{name}“ mit allen Freigaben wirklich löschen?',
  rounds_leave: 'Runde verlassen',
  rounds_leave_confirm: 'Runde „{name}“ wirklich verlassen?',
  rounds_need_name: 'Bitte einen Namen für die Runde eingeben.',
  rounds_need_code: 'Bitte den Einladungscode eingeben.',
  rounds_none: 'Noch keine Runden. Lege eine an oder tritt mit einem Code bei.',
  rounds_wrong_page: 'In der passenden Generator-Seite öffnen ({kind}).',
  rounds_kind_char: 'Charakter', rounds_kind_droid: 'Droide', rounds_kind_ship: 'Schiff',
  sheet_round_stamp: 'Für Runde „{round}“ freigegeben — GM {gm}',
});
Object.assign(T.en, {
  online_rounds: 'Game rounds',
  rounds_open: '🎲 Open game rounds',
  rounds_title: 'Game rounds',
  rounds_create: 'Create a new round',
  rounds_name: 'Round name',
  rounds_create_btn: 'Create round',
  rounds_join: 'Join a round',
  rounds_code: 'Invitation code',
  rounds_join_btn: 'Join',
  rounds_mine: 'My rounds',
  rounds_gm: 'GM',
  rounds_members: 'Members',
  rounds_role_gm: 'GM', rounds_role_player: 'Player',
  rounds_back: 'back',
  rounds_invite: 'Invitation code',
  rounds_invite_hint: 'Give this code to your players so they can join the round.',
  rounds_kick: 'remove',
  rounds_kick_confirm: 'Remove “{name}” from the round?',
  rounds_founder: 'founder',
  rounds_make_gm: '→ make GM',
  rounds_make_player: '→ make player',
  rounds_make_gm_confirm: 'Make “{name}” an additional GM of this round? A GM can view and approve characters and manage members.',
  rounds_my_chars: 'My submitted characters',
  rounds_assign: 'Submit',
  rounds_unassign: 'withdraw',
  rounds_approved: 'approved',
  rounds_pending: 'awaiting approval',
  rounds_party: 'Round characters',
  rounds_approve: 'Approve',
  rounds_revoke: 'Revoke approval',
  rounds_delete: 'Delete round',
  rounds_delete_confirm: 'Really delete round “{name}” and all its approvals?',
  rounds_leave: 'Leave round',
  rounds_leave_confirm: 'Really leave round “{name}”?',
  rounds_need_name: 'Please enter a name for the round.',
  rounds_need_code: 'Please enter the invitation code.',
  rounds_none: 'No rounds yet. Create one or join with a code.',
  rounds_wrong_page: 'Open it in the matching generator page ({kind}).',
  rounds_kind_char: 'character', rounds_kind_droid: 'droid', rounds_kind_ship: 'ship',
  sheet_round_stamp: 'Approved for round “{round}” — GM {gm}',
});

/* ---------------- Zustand & API ---------------- */
const LS_ONLINE = 'swd6_online';
/* Dokumenttyp dieser Seite: 'char' (index), 'droid' oder 'ship'.
   Konto und Anmeldung sind für alle Seiten dieselben – nur die
   Cloud-Listen werden nach Typ getrennt. */
const DOC_KIND = (typeof PAGE_DOC_KIND !== 'undefined') ? PAGE_DOC_KIND : 'char';
function tDoc(key) {
  return t(key).replace('{docs}', t('doc_plural')).replace('{doc}', t('doc_one'));
}
let ONLINE = { token: '', username: '', mfaEnabled: false };
try { Object.assign(ONLINE, JSON.parse(localStorage.getItem(LS_ONLINE)) || {}); } catch (e) {}
let onlineAvailable = false;
let onlineView = 'login';       // login | account | mfaSetup | mfaBackup
let onlineData = { mine: [], shared: [] };
let onlineMsg = '';
let mfaSetup = null;            // {secret, otpauth}
let mfaBackupCodes = [];
let recoveryCode = '';          // einmalig angezeigter Wiederherstellungscode
let recoveryNext = 'account';   // wohin nach dem Wegklicken
let shareOpenId = null;
let shareLists = {};            // charId -> [usernames]
let regInfo = { register: true, registerCode: false, registerMode: 'open' };
let adminData = null;           // { users: [...], registerMode }

function apiUrl() {
  return (typeof SITE_CONFIG !== 'undefined' && SITE_CONFIG.apiUrl) || '';
}
async function api(action, body, params) {
  const headers = { 'Content-Type': 'application/json' };
  if (ONLINE.token) {
    headers['Authorization'] = 'Bearer ' + ONLINE.token;
    /* Zusätzlich als eigener Header: Apache reicht "Authorization" bei
       PHP-FPM/FastCGI ohne passende Konfiguration nicht an PHP durch. */
    headers['X-Auth-Token'] = ONLINE.token;
  }
  let url = apiUrl() + '?action=' + encodeURIComponent(action);
  if (params) Object.keys(params).forEach(k => {
    url += '&' + encodeURIComponent(k) + '=' + encodeURIComponent(params[k]);
  });
  const res = await fetch(url, {
    method: body !== undefined ? 'POST' : 'GET',
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
  let data = null, raw = '';
  try { raw = await res.text(); data = JSON.parse(raw); } catch (e) {}
  if (data === null) {
    /* Keine JSON-Antwort: meist eine PHP-Fehlerseite des Hosters.
       Den Anfang mitzeigen, sonst ist der Fehler nicht auffindbar. */
    const hint = raw.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 200);
    const err = new Error((hint || 'HTTP ' + res.status) + ' — api/check.php im Browser öffnen');
    err.status = res.status;
    throw err;
  }
  if (!res.ok) {
    const msg = (data && data.error) ? data.error : ('HTTP ' + res.status);
    if (res.status === 401 && ONLINE.token && action !== 'login') {
      setOnlineAuth({ token: '', username: '', mfaEnabled: false });
      onlineView = 'login';
    }
    const err = new Error(msg); err.status = res.status; throw err;
  }
  return data;
}
function setOnlineAuth(o) {
  ONLINE = o;
  localStorage.setItem(LS_ONLINE, JSON.stringify(ONLINE));
  updateOnlineButton();
  /* Cache der Gruppen-Spezies neu laden (nur auf der Charakter-Seite vorhanden) */
  try { if (typeof cloudSpecies !== 'undefined') cloudSpecies = null; } catch (e) {}
}
function updateOnlineButton() {
  updateAdminButton();
  const b = document.getElementById('btnOnline');
  if (!b) return;
  b.style.display = onlineAvailable ? 'inline-block' : 'none';
  b.textContent = ONLINE.username ? '☁ ' + ONLINE.username : t('btn_online');
}

/* ---------------- Modal ---------------- */
function onlineModal() {
  let m = document.getElementById('onlineModal');
  if (!m) {
    m = document.createElement('div');
    m.id = 'onlineModal';
    m.className = 'modal-overlay no-print hidden';
    m.innerHTML = '<div class="modal-box" id="onlineBox"></div>';
    document.body.appendChild(m);
    m.addEventListener('click', e => { if (e.target === m) closeOnline(); });
  }
  return m;
}
function openOnline() {
  onlineModal().classList.remove('hidden');
  onlineMsg = '';
  if (ONLINE.token) { onlineView = 'account'; refreshCloud(); }
  else onlineView = 'login';
  renderOnline();
}
function closeOnline() { onlineModal().classList.add('hidden'); }

async function refreshCloud() {
  try {
    const me = await api('me');
    ONLINE.username = me.username; ONLINE.mfaEnabled = me.mfaEnabled;
    ONLINE.backupCodesLeft = me.backupCodesLeft;
    ONLINE.isAdmin = !!me.isAdmin;
    setOnlineAuth(ONLINE);
    onlineData = await api('chars', undefined, { kind: DOC_KIND });
    adminData = ONLINE.isAdmin ? await api('admin_users') : null;
  } catch (e) { onlineMsg = e.message; }
  renderOnline();
}

function fmtDate(ts) {
  if (!ts) return '';
  return new Date(ts * 1000).toLocaleString(LANG === 'de' ? 'de-DE' : 'en-US',
    { dateStyle: 'short', timeStyle: 'short' });
}

/* ================= Verwaltung: eigenes Fenster (nur für Administratoren) ==
   Früher hing die Benutzerverwaltung im Online-Konto-Fenster. Bei vielen
   Nutzern wird das unübersichtlich – deshalb ein eigenes Fenster mit Suche,
   das Admins über das ⚙-Menü öffnen. */
let adminFilter = '';
let adminMsg = '';

function adminModal() {
  let m = document.getElementById('adminModal');
  if (!m) {
    m = document.createElement('div');
    m.id = 'adminModal';
    m.className = 'modal-overlay no-print hidden';
    m.innerHTML = '<div class="modal-box admin-box" id="adminBox"></div>';
    document.body.appendChild(m);
    m.addEventListener('click', e => { if (e.target === m) closeAdmin(); });
  }
  return m;
}
async function openAdmin() {
  adminMsg = ''; adminFilter = '';
  adminModal().classList.remove('hidden');
  renderAdmin();                                   // sofort (evtl. „lädt…“)
  try { adminData = await api('admin_users'); }
  catch (e) { adminMsg = t('online_error') + e.message; }
  renderAdmin();
}
function closeAdmin() { adminModal().classList.add('hidden'); }

/* ⚙-Menü-Knopf nur für Admins zeigen. */
function updateAdminButton() {
  const b = document.getElementById('btnAdmin');
  if (b) b.classList.toggle('hidden', !(ONLINE && ONLINE.isAdmin));
}

function adminUserRow(u) {
  const self = u.username === ONLINE.username;
  const badges = (u.isAdmin ? `<span class="badge gold">${t('online_badge_admin')}</span>` : '')
               + (u.mfaEnabled ? `<span class="badge">${t('online_badge_mfa')}</span>` : '');
  const b = (cls, what, extra) => `<button class="mini ${cls}" data-aact="user" data-what="${what}" data-id="${u.id}" data-name="${esc(u.username)}">${extra}</button>`;
  const acts = [];
  if (!u.approved) acts.push(b('', 'approve', t('online_act_approve')));
  if (u.approved && !self) acts.push(b('', 'block', t('online_act_block')));
  if (!u.isAdmin) acts.push(b('', 'promote', t('online_act_promote')));
  else if (!self && u.id !== 1) acts.push(b('', 'demote', t('online_act_demote')));
  if (!self) acts.push(b('', 'reset_password', t('online_act_resetpw')));
  if (u.mfaEnabled) acts.push(b('', 'reset_mfa', t('online_act_resetmfa')));
  if (!self) acts.push(b('danger', 'delete', t('online_act_delete')));
  return `<tr>
    <td>${esc(u.username)}${self ? ` <span class="hint">(${t('online_you')})</span>` : ''}<br>${badges}</td>
    <td class="hint">${u.created ? fmtDate(u.created) : ''}</td>
    <td>${u.approved ? `<span class="ok">${t('online_status_ok')}</span>`
                     : `<span class="warn">${t('online_status_pending')}</span>`}</td>
    <td class="num">${u.chars}</td>
    <td class="nowrap">${acts.join(' ')}</td>
  </tr>`;
}
function adminBody() {
  if (!adminData) return `<p class="hint">${t('online_loading')}</p>`;
  const mode = adminData.registerMode || 'open';
  const modeOpt = (v, label) =>
    `<option value="${v}" ${mode === v ? 'selected' : ''}>${label}</option>`;
  const all = adminData.users || [];
  const pending = all.filter(u => !u.approved).length;
  const f = adminFilter.trim().toLowerCase();
  // Freigabe-Wartende zuerst, dann alphabetisch – so springt Wichtiges nach oben.
  const users = all.slice()
    .sort((a, b) => (a.approved - b.approved) || a.username.localeCompare(b.username))
    .filter(u => !f || u.username.toLowerCase().includes(f));
  const rows = users.map(adminUserRow).join('');
  return `
    <label>${t('online_admin_mode')}</label>
    <select data-aact="mode">
      ${modeOpt('open', t('online_mode_open'))}
      ${modeOpt('approval', t('online_mode_approval'))}
      ${modeOpt('closed', t('online_mode_closed'))}
    </select>
    <h3>${t('online_admin_users')} (${all.length})${pending ? ` – <span class="warn">${pending} ⏳</span>` : ''}</h3>
    <input type="text" id="adminSearch" data-aact="search" value="${esc(adminFilter)}"
           placeholder="${t('online_admin_search')}" style="width:100%; margin-bottom:8px">
    <div class="table-scroll"><table class="list">
      <tr><th>${t('online_col_user')}</th><th>${t('online_col_since')}</th><th>${t('online_col_status')}</th>
          <th class="num">${t('online_col_chars')}</th><th>${t('online_col_actions')}</th></tr>
      ${rows || `<tr><td colspan="5" class="hint">${t('none_dash')}</td></tr>`}
    </table></div>`;
}
function renderAdmin() {
  const box = document.getElementById('adminBox');
  if (!box) return;
  box.innerHTML = `<div class="modal-head"><h2>${t('online_admin')}</h2>
      <button class="mini" data-aact="close">✕</button></div>`
    + (adminMsg ? `<p class="modal-msg">${esc(adminMsg)}</p>` : '')
    + adminBody();
}
async function adminClick(el) {
  const act = el.dataset.aact;
  adminMsg = '';
  try {
    if (act === 'close') { closeAdmin(); return; }
    if (act === 'user') {
      const what = el.dataset.what, name = el.dataset.name || '';
      if (what === 'delete' && !confirm(t('online_confirm_delete_user').replace('{name}', name))) return;
      if (what === 'reset_mfa' && !confirm(t('online_confirm_resetmfa').replace('{name}', name))) return;
      if (what === 'demote' && !confirm(t('online_confirm_demote').replace('{name}', name))) return;
      if (what === 'reset_password' && !confirm(t('online_confirm_resetpw').replace('{name}', name))) return;
      const res = await api('admin_user_action', { id: +el.dataset.id, what });
      if (res.resetCode)
        adminMsg = t('online_resetcode_for').replace('{name}', res.username) + ' ' + res.resetCode;
      adminData = await api('admin_users');
    }
  } catch (e) { adminMsg = t('online_error') + e.message; }
  renderAdmin();
}

/* ================= Spielrunden: eigenes Fenster =======================
   Jeder angemeldete Nutzer kann eine Runde anlegen (wird deren GM) oder per
   Einladungscode beitreten. Spieler melden ihre Charaktere zur Runde an, der
   GM sieht sie und gibt sie frei – die Freigabe erscheint als Live-Vermerk
   auf dem Charakterbogen (siehe char_get → roundApprovals). */
let roundsData = null;     // { rounds: [...] }
let roundsMsg = '';
let roundSel = null;       // ausgewählte Runde (Detailansicht) oder null (Liste)
let roundDetail = null;    // { round, members, gmChars, myChars, myDocs }

function roundsModal() {
  let m = document.getElementById('roundsModal');
  if (!m) {
    m = document.createElement('div');
    m.id = 'roundsModal';
    m.className = 'modal-overlay no-print hidden';
    m.innerHTML = '<div class="modal-box admin-box" id="roundsBox"></div>';
    document.body.appendChild(m);
    m.addEventListener('click', e => { if (e.target === m) closeRounds(); });
  }
  return m;
}
async function openRounds() {
  roundsMsg = ''; roundSel = null; roundDetail = null;
  roundsModal().classList.remove('hidden');
  renderRounds();
  try { roundsData = await api('round_list'); }
  catch (e) { roundsMsg = t('online_error') + e.message; }
  renderRounds();
}
function closeRounds() { roundsModal().classList.add('hidden'); }

/* Freigabe-Vermerk für den Charakterbogen (Live-Status vom Server, liegt in
   C._rounds, sobald ein Cloud-Dokument geladen wurde). Wird von den Bögen in
   app.js / droid.js / ship.js aufgerufen – daher hier zentral und global. */
function roundStampHtml() {
  const list = (typeof C !== 'undefined' && C && Array.isArray(C._rounds)) ? C._rounds : [];
  if (!list.length) return '';
  return `<div class="round-stamps">` + list.map(a =>
    `<span class="round-stamp">✔ ${t('sheet_round_stamp')
        .replace('{round}', esc(a.round)).replace('{gm}', esc(a.gm))}`
    + (a.at ? ` · ${fmtDate(a.at)}` : '') + `</span>`).join('') + `</div>`;
}

/* Alle eigenen Cloud-Dokumente (Charaktere, Droiden, Schiffe) für die
   Anmelde-Auswahl – Spezies sind nicht spielbar und bleiben außen vor. */
async function myCloudDocs() {
  const kinds = ['char', 'droid', 'ship'];
  const res = await Promise.all(kinds.map(k =>
    api('chars', undefined, { kind: k }).catch(() => ({ mine: [] }))));
  const out = [];
  res.forEach((r, i) => (r.mine || []).forEach(c =>
    out.push({ id: c.id, name: c.name, kind: kinds[i] })));
  return out;
}
async function openRoundDetail(id) {
  roundSel = id; roundDetail = null; roundsMsg = '';
  renderRounds();
  const round = (roundsData.rounds || []).find(r => r.id === id);
  if (!round) { roundSel = null; renderRounds(); return; }
  try {
    const members = (await api('round_members', undefined, { id })).members || [];
    const gmChars = round.role === 'gm' ? (await api('round_chars', undefined, { id })).chars || [] : null;
    const myChars = (await api('round_my_chars', undefined, { id })).chars || [];
    const myDocs = await myCloudDocs();
    roundDetail = { round, members, gmChars, myChars, myDocs };
  } catch (e) { roundsMsg = t('online_error') + e.message; }
  renderRounds();
}

function roundsBody() {
  if (!roundsData) return `<p class="hint">${t('online_loading')}</p>`;
  if (roundSel) return roundDetailBody();
  const rows = (roundsData.rounds || []).map(r => `<tr>
      <td><a href="#" data-ract="open" data-id="${r.id}">${esc(r.name)}</a></td>
      <td class="hint">${t('rounds_gm')}: ${esc(r.gm)}</td>
      <td class="hint">${r.members} · ${t('rounds_members')}</td>
      <td>${r.role === 'gm'
            ? `<span class="badge gold">${t('rounds_role_gm')}</span>`
            : `<span class="badge">${t('rounds_role_player')}</span>`}</td>
    </tr>`).join('');
  return `
    <h3>${t('rounds_create')}</h3>
    <p><input type="text" id="rNewName" placeholder="${esc(t('rounds_name'))}" style="width:55%">
       <button class="accent" data-ract="create">${t('rounds_create_btn')}</button></p>
    <h3>${t('rounds_join')}</h3>
    <p><input type="text" id="rJoinCode" placeholder="${esc(t('rounds_code'))}" style="width:40%">
       <button data-ract="join">${t('rounds_join_btn')}</button></p>
    <h3>${t('rounds_mine')}</h3>
    <table class="list">${rows || `<tr><td class="hint">${t('rounds_none')}</td></tr>`}</table>`;
}

function roundDetailBody() {
  const d = roundDetail;
  const back = `<p><button class="mini" data-ract="back">← ${t('rounds_back')}</button></p>`;
  if (!d) return back + `<p class="hint">${t('online_loading')}</p>`;
  const r = d.round;
  const isGm = r.role === 'gm';
  let html = back + `<h2>${esc(r.name)}</h2>`;
  if (isGm && r.inviteCode)
    html += `<p>${t('rounds_invite')}: <code class="rcode">${esc(r.inviteCode)}</code></p>
             <p class="hint">${t('rounds_invite_hint')}</p>`;

  html += `<h3>${t('rounds_members')} (${d.members.length})</h3><table class="list">`
    + d.members.map(m => {
      const isFounder = m.username === r.gm;
      let acts = '';
      if (isGm && !isFounder) {
        acts += m.role === 'gm'
          ? `<button class="mini" data-ract="setRole" data-id="${r.id}" data-user="${esc(m.username)}" data-role="player">${t('rounds_make_player')}</button> `
          : `<button class="mini" data-ract="setRole" data-id="${r.id}" data-user="${esc(m.username)}" data-role="gm">${t('rounds_make_gm')}</button> `;
        acts += `<button class="mini danger" data-ract="kick" data-id="${r.id}" data-user="${esc(m.username)}">${t('rounds_kick')}</button>`;
      }
      return `<tr>
        <td>${esc(m.username)} ${m.role === 'gm' ? `<span class="badge gold">GM</span>` : ''}${isFounder ? ` <span class="hint">(${t('rounds_founder')})</span>` : ''}</td>
        <td class="nowrap">${acts}</td></tr>`;
    }).join('') + `</table>`;

  /* Eigene Charaktere anmelden / abmelden (GM wie Spieler) */
  const assigned = new Set((d.myChars || []).map(c => c.id));
  const mineRows = (d.myChars || []).map(c => `<tr>
      <td>${esc(c.name)} ${c.approved
          ? `<span class="badge gold">✔ ${t('rounds_approved')}</span>`
          : `<span class="badge">${t('rounds_pending')}</span>`}</td>
      <td class="nowrap"><button class="mini danger" data-ract="unassign" data-id="${r.id}" data-cid="${c.id}">${t('rounds_unassign')}</button></td>
    </tr>`).join('');
  const opts = (d.myDocs || []).filter(c => !assigned.has(c.id))
      .map(c => `<option value="${c.id}">${esc(c.name)} (${t('rounds_kind_' + c.kind)})</option>`).join('');
  html += `<h3>${t('rounds_my_chars')}</h3>
    <table class="list">${mineRows || `<tr><td class="hint">${t('online_none')}</td></tr>`}</table>`;
  if (opts) html += `<p><select id="rAssignSel">${opts}</select>
      <button class="accent" data-ract="assign" data-id="${r.id}">${t('rounds_assign')}</button></p>`;

  /* GM-Ansicht: alle angemeldeten Charaktere mit Freigabe-Schalter */
  if (isGm) {
    const gmRows = (d.gmChars || []).map(c => {
      const canView = c.kind === DOC_KIND;
      const viewBtn = canView
        ? `<button class="mini" data-ract="view" data-cid="${c.id}">${t('online_load')}</button>`
        : `<span class="hint" title="${esc(t('rounds_wrong_page').replace('{kind}', t('rounds_kind_' + c.kind)))}">${t('rounds_kind_' + c.kind)}</span>`;
      return `<tr>
        <td>${esc(c.name)} <span class="hint">(${esc(c.owner)})</span></td>
        <td>${c.approved ? `<span class="ok">✔ ${t('rounds_approved')}</span>` : `<span class="hint">${t('rounds_pending')}</span>`}</td>
        <td class="nowrap">${viewBtn}
          <button class="mini ${c.approved ? '' : 'accent'}" data-ract="approve" data-id="${r.id}" data-cid="${c.id}" data-appr="${c.approved ? 0 : 1}">${c.approved ? t('rounds_revoke') : t('rounds_approve')}</button>
        </td></tr>`;
    }).join('');
    html += `<h3>${t('rounds_party')}</h3>
      <table class="list">${gmRows || `<tr><td class="hint">${t('online_none')}</td></tr>`}</table>`;
  }

  html += `<p style="margin-top:14px">${isGm
      ? `<button class="mini danger" data-ract="deleteRound" data-id="${r.id}" data-name="${esc(r.name)}">${t('rounds_delete')}</button>`
      : `<button class="mini danger" data-ract="leave" data-id="${r.id}" data-name="${esc(r.name)}">${t('rounds_leave')}</button>`}</p>`;
  return html;
}

function renderRounds() {
  const box = document.getElementById('roundsBox');
  if (!box) return;
  box.innerHTML = `<div class="modal-head"><h2>${t('rounds_title')}</h2>
      <button class="mini" data-ract="close">✕</button></div>`
    + (roundsMsg ? `<p class="modal-msg">${esc(roundsMsg)}</p>` : '')
    + roundsBody();
}

async function roundsClick(el) {
  const act = el.dataset.ract;
  roundsMsg = '';
  try {
    switch (act) {
      case 'close': closeRounds(); return;
      case 'back': roundSel = null; roundDetail = null; break;
      case 'open': await openRoundDetail(+el.dataset.id); return;
      case 'create': {
        const name = (document.getElementById('rNewName').value || '').trim();
        if (!name) { roundsMsg = t('rounds_need_name'); break; }
        await api('round_create', { name });
        roundsData = await api('round_list');
        break;
      }
      case 'join': {
        const code = (document.getElementById('rJoinCode').value || '').trim();
        if (!code) { roundsMsg = t('rounds_need_code'); break; }
        await api('round_join', { code });
        roundsData = await api('round_list');
        break;
      }
      case 'assign': {
        const sel = document.getElementById('rAssignSel');
        if (!sel || !sel.value) break;
        await api('round_assign', { id: +el.dataset.id, charId: +sel.value });
        await openRoundDetail(+el.dataset.id); return;
      }
      case 'unassign':
        await api('round_unassign', { id: +el.dataset.id, charId: +el.dataset.cid });
        await openRoundDetail(+el.dataset.id); return;
      case 'approve':
        await api('round_approve', { id: +el.dataset.id, charId: +el.dataset.cid, approved: el.dataset.appr === '1' });
        await openRoundDetail(+el.dataset.id); return;
      case 'kick':
        if (!confirm(t('rounds_kick_confirm').replace('{name}', el.dataset.user))) return;
        await api('round_remove_member', { id: +el.dataset.id, username: el.dataset.user });
        await openRoundDetail(+el.dataset.id); return;
      case 'setRole':
        if (el.dataset.role === 'gm' && !confirm(t('rounds_make_gm_confirm').replace('{name}', el.dataset.user))) return;
        await api('round_set_role', { id: +el.dataset.id, username: el.dataset.user, role: el.dataset.role });
        await openRoundDetail(+el.dataset.id); return;
      case 'leave':
        if (!confirm(t('rounds_leave_confirm').replace('{name}', el.dataset.name))) return;
        await api('round_leave', { id: +el.dataset.id });
        roundSel = null; roundDetail = null;
        roundsData = await api('round_list');
        break;
      case 'deleteRound':
        if (!confirm(t('rounds_delete_confirm').replace('{name}', el.dataset.name))) return;
        await api('round_delete', { id: +el.dataset.id });
        roundSel = null; roundDetail = null;
        roundsData = await api('round_list');
        break;
      case 'view': {
        const id = +el.dataset.cid;
        const data = await api('char_get', undefined, { id });
        if ((data.kind || 'char') !== DOC_KIND) {
          roundsMsg = t('rounds_wrong_page').replace('{kind}', t('rounds_kind_' + (data.kind || 'char')));
          break;
        }
        C = migrate(data.data);
        C._cloudId = null;                 // GM ist nicht Eigentümer → Kopie
        C._rounds = data.roundApprovals || [];
        applySpeciesBonusSkills();
        autosave(); renderAll();
        closeRounds(); closeOnline();
        return;
      }
    }
  } catch (e) { roundsMsg = t('online_error') + e.message; }
  renderRounds();
}

function renderOnline() {
  const box = document.getElementById('onlineBox');
  if (!box) return;
  let html = `<div class="modal-head"><h2>${t('online_title')}</h2>
    <button class="mini" data-oact="close">✕</button></div>`;
  if (onlineMsg) html += `<p class="modal-msg">${esc(onlineMsg)}</p>`;

  if (onlineView === 'login') {
    html += `
    <div class="subtabs">
      <button class="active" disabled>${t('online_login')}</button>
      ${regInfo.register ? `<button data-oact="gotoRegister">${t('online_register')}</button>` : ''}
    </div>
    <label>${t('online_username')}</label><input type="text" id="olUser" autocomplete="username">
    <label>${t('online_password')}</label><input type="password" id="olPass" autocomplete="current-password">
    <div id="olTotpRow" class="hidden">
      <label>${t('online_totp_or_backup')}</label>
      <input type="text" id="olTotp" inputmode="numeric" autocomplete="one-time-code">
    </div>
    <p><button class="accent" data-oact="login">${t('online_do_login')}</button>
       <a href="#" data-oact="gotoReset" style="margin-left:10px; font-size:13px; color:var(--muted)">${t('online_forgot')}</a></p>`;
  }

  if (onlineView === 'reset') {
    html += `
    <h3>${t('online_reset_title')}</h3>
    <p class="hint">${t('online_reset_hint')}</p>
    <label>${t('online_username')}</label><input type="text" id="rsUser" autocomplete="username">
    <label>${t('online_reset_code')}</label><input type="text" id="rsCode" placeholder="XXXX-XXXX-XXXX-XXXX">
    <label>${t('online_new_password')}</label><input type="password" id="rsPass" autocomplete="new-password">
    <div id="rsTotpRow" class="hidden">
      <label>${t('online_totp_or_backup')}</label>
      <input type="text" id="rsTotp" inputmode="numeric" autocomplete="one-time-code">
    </div>
    <p><button class="accent" data-oact="doReset">${t('online_do_reset')}</button>
       <button data-oact="gotoLogin">${t('online_login')}</button></p>`;
  }

  if (onlineView === 'recovery') {
    html += `
    <h3>${t('online_recovery_title')}</h3>
    <p class="warn">${t('online_recovery_hint')}</p>
    <p class="mono-secret">${esc(recoveryCode)}</p>
    <p><button class="accent" data-oact="recoveryDone">${t('online_mfa_done')}</button></p>`;
  }

  if (onlineView === 'register') {
    html += `
    <div class="subtabs">
      <button data-oact="gotoLogin">${t('online_login')}</button>
      <button class="active" disabled>${t('online_register')}</button>
    </div>
    <label>${t('online_username')}</label><input type="text" id="orUser" autocomplete="username">
    <label>${t('online_password')}</label><input type="password" id="orPass" autocomplete="new-password">
    <label>${t('online_password2')}</label><input type="password" id="orPass2" autocomplete="new-password">
    ${regInfo.registerCode ? `<label>${t('online_regcode')}</label><input type="text" id="orCode">` : ''}
    <p><button class="accent" data-oact="register">${t('online_do_register')}</button></p>`;
  }

  if (onlineView === 'account') {
    const mine = onlineData.mine.map(c => `
      <tr><td>${esc(c.name)}</td><td class="hint">${fmtDate(c.updated)}</td>
        <td class="nowrap">
          <button class="mini" data-oact="load" data-id="${c.id}">${t('online_load')}</button>
          <button class="mini" data-oact="shareOpen" data-id="${c.id}">${t('online_share')}</button>
          <button class="mini danger" data-oact="delete" data-id="${c.id}" data-name="${esc(c.name)}">×</button>
        </td></tr>
      ${shareOpenId === c.id ? `<tr><td colspan="3" class="share-row">
        ${t('online_share_title')} <input type="text" id="shareUser" style="width:140px">
        <button class="mini" data-oact="shareAdd" data-id="${c.id}">${t('online_share_add')}</button><br>
        ${(shareLists[c.id] || []).length ? t('online_share_current') + ' ' +
          (shareLists[c.id] || []).map(u => `<span class="badge">${esc(u)}
            <a href="#" data-oact="shareRemove" data-id="${c.id}" data-user="${esc(u)}">×</a></span>`).join(' ')
          : ''}
      </td></tr>` : ''}`).join('');
    const shared = onlineData.shared.map(c => `
      <tr><td>${esc(c.name)} <span class="hint">(${t('online_from')} ${esc(c.owner)})</span></td>
        <td class="hint">${fmtDate(c.updated)}</td>
        <td><button class="mini" data-oact="load" data-id="${c.id}">${t('online_load')}</button></td></tr>`).join('');
    html += `
    <p>${t('online_logged_in_as')}: <b>${esc(ONLINE.username)}</b>
      <button class="mini" style="float:right" data-oact="logout">${t('online_logout')}</button></p>
    <h3>${tDoc('online_my_chars')}</h3>
    <p><button class="accent" data-oact="upload">${tDoc('online_upload')}</button></p>
    <table class="list">${mine || `<tr><td class="hint">${t('online_none')}</td></tr>`}</table>
    <h3>${t('online_shared_chars')}</h3>
    <table class="list">${shared || `<tr><td class="hint">${t('online_none')}</td></tr>`}</table>
    <p class="hint">${t('online_readonly_hint')}</p>
    <p><button data-oact="openRounds">${t('rounds_open')}</button></p>
    ${ONLINE.isAdmin ? `<p><button data-oact="openAdmin">${t('online_admin_open')}</button></p>` : ''}
    <h3>${t('online_pw_change')}</h3>
    <label>${t('online_pw_old')}</label><input type="password" id="pwOld" autocomplete="current-password">
    <label>${t('online_new_password')}</label><input type="password" id="pwNew" autocomplete="new-password">
    <p><button data-oact="pwChange">${t('online_pw_change')}</button>
       <button data-oact="recoveryNew">${t('online_recovery_new')}</button></p>
    <h3>${t('online_mfa')}</h3>
    <p>${ONLINE.mfaEnabled
        ? `<span class="ok">✔ ${t('online_mfa_on')}</span>
           ${ONLINE.backupCodesLeft != null ? `<span class="hint"> · ${ONLINE.backupCodesLeft} ${t('online_mfa_backup_left')}</span>` : ''}
           <br><label>${t('online_totp_or_backup')}</label>
           <input type="text" id="mfaOffCode" style="width:140px" inputmode="numeric">
           <button class="mini danger" data-oact="mfaDisable">${t('online_mfa_disable')}</button>`
        : `<span class="hint">${t('online_mfa_off')}</span><br>
           <button class="accent" data-oact="mfaStart">${t('online_mfa_setup')}</button>`}
    </p>`;
  }

  if (onlineView === 'pending') {
    html += `
    <h3>${t('online_pending_title')}</h3>
    <p>${t('online_pending_text')}</p>
    <p><button class="accent" data-oact="gotoLogin">${t('online_login')}</button></p>`;
  }

  if (onlineView === 'mfaSetup' && mfaSetup) {
    let qrHtml = '';
    try {
      const qr = qrcode(0, 'M');
      qr.addData(mfaSetup.otpauth);
      qr.make();
      qrHtml = qr.createSvgTag({ cellSize: 4, margin: 2 });
    } catch (e) { qrHtml = ''; }
    html += `
    <p>${t('online_mfa_scan')}</p>
    <div class="qr-wrap">${qrHtml}</div>
    <p class="mono-secret">${esc(mfaSetup.secret)}</p>
    <p>${t('online_mfa_confirm')}</p>
    <input type="text" id="mfaCode" inputmode="numeric" autocomplete="one-time-code" style="width:140px">
    <button class="accent" data-oact="mfaVerify">${t('online_mfa_verify')}</button>`;
  }

  if (onlineView === 'mfaBackup') {
    html += `
    <h3>${t('online_mfa_backup_title')}</h3>
    <p class="warn">${t('online_mfa_backup_hint')}</p>
    <p class="mono-secret">${mfaBackupCodes.map(esc).join('<br>')}</p>
    <p><button class="accent" data-oact="backToAccount">${t('online_mfa_done')}</button></p>`;
  }

  box.innerHTML = html;
}

/* ---------------- Aktionen ---------------- */
async function onlineAction(el) {
  const act = el.dataset.oact;
  onlineMsg = '';
  try {
    switch (act) {
      case 'close': closeOnline(); return;
      case 'gotoRegister': onlineView = 'register'; break;
      case 'gotoLogin': onlineView = 'login'; break;
      case 'login': {
        const username = document.getElementById('olUser').value.trim();
        const password = document.getElementById('olPass').value;
        const totpEl = document.getElementById('olTotp');
        const totp = totpEl ? totpEl.value.trim() : '';
        const res = await api('login', { username, password, totp });
        if (res.mfaRequired) {
          document.getElementById('olTotpRow').classList.remove('hidden');
          document.getElementById('olTotp').focus();
          return;
        }
        setOnlineAuth({ token: res.token, username: res.username, mfaEnabled: res.mfaEnabled,
                        isAdmin: !!res.isAdmin });
        onlineView = 'account';
        await refreshCloud();
        return;
      }
      case 'register': {
        const username = document.getElementById('orUser').value.trim();
        const p1 = document.getElementById('orPass').value;
        const p2 = document.getElementById('orPass2').value;
        const codeEl = document.getElementById('orCode');
        if (p1.length < 8) { onlineMsg = t('online_pw_short'); break; }
        if (p1 !== p2) { onlineMsg = t('online_pw_mismatch'); break; }
        const res = await api('register', { username, password: p1,
          registerCode: codeEl ? codeEl.value.trim() : '' });
        recoveryCode = res.recoveryCode || '';
        if (res.pendingApproval) {
          recoveryNext = 'pending';
          onlineView = recoveryCode ? 'recovery' : 'pending';
          break;
        }
        setOnlineAuth({ token: res.token, username: res.username, mfaEnabled: false,
                        isAdmin: !!res.isAdmin });
        if (recoveryCode) { recoveryNext = 'account'; onlineView = 'recovery'; break; }
        onlineView = 'account';
        await refreshCloud();
        return;
      }
      case 'openAdmin':
        closeOnline();
        openAdmin();
        return;
      case 'openRounds':
        closeOnline();
        openRounds();
        return;
      case 'logout':
        try { await api('logout', {}); } catch (e) {}
        setOnlineAuth({ token: '', username: '', mfaEnabled: false, isAdmin: false });
        onlineView = 'login';
        break;
      case 'upload': {
        const name = (C.info.name || '').trim();
        if (!name) { onlineMsg = t('online_no_name'); break; }
        const payload = JSON.parse(JSON.stringify(C));
        delete payload._cloudId;
        delete payload._rounds;          // Freigaben sind Server-Live-Status, nie mitspeichern
        let id = C._cloudId || 0;
        try {
          const res = await api('char_save', { id, name, kind: DOC_KIND, data: payload });
          C._cloudId = res.id;
        } catch (e) {
          if (e.status === 403 || e.status === 404) {
            const res = await api('char_save', { name, kind: DOC_KIND, data: payload });
            C._cloudId = res.id;
          } else throw e;
        }
        autosave();
        onlineMsg = t('online_saved');
        onlineData = await api('chars', undefined, { kind: DOC_KIND });
        break;
      }
      case 'load': {
        const id = +el.dataset.id;
        const data = await api('char_get', undefined, { id });
        C = migrate(data.data);
        C._cloudId = data.readonly ? null : data.id;
        C._rounds = data.roundApprovals || [];
        applySpeciesBonusSkills();
        autosave(); renderAll();
        onlineMsg = t('online_loaded');
        closeOnline();
        return;
      }
      case 'delete': {
        if (!confirm(t('online_confirm_delete_cloud').replace('{name}', el.dataset.name))) return;
        await api('char_delete', { id: +el.dataset.id });
        if (C._cloudId === +el.dataset.id) { C._cloudId = null; autosave(); }
        onlineData = await api('chars', undefined, { kind: DOC_KIND });
        break;
      }
      case 'shareOpen': {
        const id = +el.dataset.id;
        shareOpenId = shareOpenId === id ? null : id;
        if (shareOpenId) {
          const r = await api('shares', undefined, { id });
          shareLists[id] = r.shares;
        }
        break;
      }
      case 'shareAdd': {
        const id = +el.dataset.id;
        const u = document.getElementById('shareUser').value.trim();
        if (!u) break;
        const r = await api('share_add', { charId: id, username: u });
        shareLists[id] = r.shares;
        break;
      }
      case 'shareRemove': {
        const id = +el.dataset.id;
        const r = await api('share_remove', { charId: id, username: el.dataset.user });
        shareLists[id] = r.shares;
        break;
      }
      case 'adm': {
        const what = el.dataset.what;
        const name = el.dataset.name || '';
        if (what === 'delete' && !confirm(t('online_confirm_delete_user').replace('{name}', name))) return;
        if (what === 'reset_mfa' && !confirm(t('online_confirm_resetmfa').replace('{name}', name))) return;
        if (what === 'demote' && !confirm(t('online_confirm_demote').replace('{name}', name))) return;
        if (what === 'reset_password' && !confirm(t('online_confirm_resetpw').replace('{name}', name))) return;
        const res = await api('admin_user_action', { id: +el.dataset.id, what });
        if (res.resetCode)
          onlineMsg = t('online_resetcode_for').replace('{name}', res.username) + ' ' + res.resetCode;
        adminData = await api('admin_users');
        break;
      }
      case 'gotoReset': onlineView = 'reset'; break;
      case 'doReset': {
        const username = document.getElementById('rsUser').value.trim();
        const code = document.getElementById('rsCode').value.trim();
        const pw = document.getElementById('rsPass').value;
        const totpEl = document.getElementById('rsTotp');
        const totp = totpEl ? totpEl.value.trim() : '';
        if (pw.length < 8) { onlineMsg = t('online_pw_short'); break; }
        const res = await api('password_reset', { username, code, newPassword: pw, totp });
        if (res.mfaRequired) {
          document.getElementById('rsTotpRow').classList.remove('hidden');
          document.getElementById('rsTotp').focus();
          return;
        }
        recoveryCode = res.recoveryCode || '';
        recoveryNext = 'login';
        onlineMsg = t('online_reset_done');
        onlineView = recoveryCode ? 'recovery' : 'login';
        break;
      }
      case 'recoveryDone':
        recoveryCode = '';
        onlineView = recoveryNext;
        if (recoveryNext === 'account') { await refreshCloud(); return; }
        break;
      case 'recoveryNew':
        recoveryCode = (await api('recovery_new', {})).recoveryCode;
        recoveryNext = 'account';
        onlineView = 'recovery';
        break;
      case 'pwChange': {
        const oldPw = document.getElementById('pwOld').value;
        const newPw = document.getElementById('pwNew').value;
        if (newPw.length < 8) { onlineMsg = t('online_pw_short'); break; }
        await api('password_change', { oldPassword: oldPw, newPassword: newPw });
        onlineMsg = t('online_pw_changed');
        break;
      }
      case 'mfaStart':
        mfaSetup = await api('mfa_start', {});
        onlineView = 'mfaSetup';
        break;
      case 'mfaVerify': {
        const code = document.getElementById('mfaCode').value.trim();
        const res = await api('mfa_verify', { code });
        mfaBackupCodes = res.backupCodes || [];
        ONLINE.mfaEnabled = true; setOnlineAuth(ONLINE);
        mfaSetup = null;
        onlineView = 'mfaBackup';
        break;
      }
      case 'mfaDisable': {
        const code = document.getElementById('mfaOffCode').value.trim();
        await api('mfa_disable', { code });
        ONLINE.mfaEnabled = false; setOnlineAuth(ONLINE);
        break;
      }
      case 'backToAccount':
        mfaBackupCodes = [];
        onlineView = 'account';
        await refreshCloud();
        return;
    }
  } catch (e) {
    onlineMsg = t('online_error') + e.message;
  }
  renderOnline();
}

/* ---------------- Verkabelung ---------------- */
document.addEventListener('click', e => {
  const el = e.target.closest('[data-oact]');
  if (!el || !el.closest('#onlineModal')) return;
  if (el.tagName === 'SELECT') return;          // Auswahlfelder über 'change'
  e.preventDefault();
  onlineAction(el);
});
/* Registrierungsmodus umschalten (Auswahlfeld im Verwaltungsbereich) */
document.addEventListener('change', async e => {
  const el = e.target;
  if (!el.dataset || el.dataset.oact !== 'mode' || !el.closest('#onlineModal')) return;
  onlineMsg = '';
  try {
    await api('admin_settings', { registerMode: el.value });
    adminData = await api('admin_users');
    regInfo.registerMode = el.value;
    regInfo.register = el.value !== 'closed';
  } catch (err) { onlineMsg = t('online_error') + err.message; }
  renderOnline();
});
/* ---- Runden-Fenster: eigene Handler (nur innerhalb #roundsModal) ---- */
document.addEventListener('click', e => {
  const el = e.target.closest('[data-ract]');
  if (!el || !el.closest('#roundsModal')) return;
  if (el.tagName === 'SELECT') return;
  e.preventDefault();
  roundsClick(el);
});
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') { closeOnline(); closeAdmin(); closeRounds(); }
  if (e.key === 'Enter' && e.target.closest && e.target.closest('#onlineModal')) {
    const box = document.getElementById('onlineBox');
    const primary = box && box.querySelector('button.accent[data-oact]');
    if (primary) { e.preventDefault(); primary.click(); }
  }
});

/* ---- Verwaltungsfenster: eigene Handler (nur innerhalb #adminModal) ---- */
document.addEventListener('click', e => {
  const el = e.target.closest('[data-aact]');
  if (!el || !el.closest('#adminModal')) return;
  if (el.tagName === 'SELECT') return;
  e.preventDefault();
  adminClick(el);
});
document.addEventListener('change', async e => {
  const el = e.target;
  if (!el.dataset || el.dataset.aact !== 'mode' || !el.closest('#adminModal')) return;
  adminMsg = '';
  try {
    await api('admin_settings', { registerMode: el.value });
    adminData = await api('admin_users');
    regInfo.registerMode = el.value;
    regInfo.register = el.value !== 'closed';
  } catch (err) { adminMsg = t('online_error') + err.message; }
  renderAdmin();
});
document.addEventListener('input', e => {
  const el = e.target;
  if (!el.dataset || el.dataset.aact !== 'search' || !el.closest('#adminModal')) return;
  adminFilter = el.value;
  const pos = el.selectionStart;
  renderAdmin();
  const again = document.getElementById('adminSearch');
  if (again) { again.focus(); again.setSelectionRange(pos, pos); }
});
/* ⚙-Menü: Verwaltung öffnen (Knopf steht in allen drei Seiten, nur für
   Admins sichtbar – updateAdminButton() blendet ihn ein/aus). */
(function wireAdminButton() {
  const b = document.getElementById('btnAdmin');
  if (b) b.addEventListener('click', () => {
    const om = document.getElementById('optionsMenu');
    if (om) om.classList.add('hidden');
    openAdmin();
  });
  updateAdminButton();
})();

/* Sprachwechsel: Online- und Verwaltungs-UI mit übersetzen */
const _setLangOrig = setLang;
setLang = function (l) {
  _setLangOrig(l);
  updateOnlineButton();
  renderOnline();
  const am = document.getElementById('adminModal');
  if (am && !am.classList.contains('hidden')) renderAdmin();
  const rm = document.getElementById('roundsModal');
  if (rm && !rm.classList.contains('hidden')) renderRounds();
};

/* Server-Erkennung beim Start */
(async function initOnline() {
  const url = apiUrl();
  if (!url) return;
  if (location.protocol === 'file:' && !/^https?:/i.test(url)) return;
  const btn = document.getElementById('btnOnline');
  try {
    const res = await fetch(url + '?action=ping');
    const data = await res.json();
    if (!data || data.api !== 'swd6') return;
    onlineAvailable = true;
    regInfo = { register: !!data.register, registerCode: !!data.registerCode,
                registerMode: data.registerMode || 'open' };
    if (btn) {
      btn.addEventListener('click', openOnline);
      updateOnlineButton();
    }
    if (ONLINE.token) {
      try {
        const me = await api('me');
        ONLINE.username = me.username; ONLINE.mfaEnabled = me.mfaEnabled;
        ONLINE.isAdmin = !!me.isAdmin;
        setOnlineAuth(ONLINE);
        if (typeof renderLegal === 'function') renderLegal();
      } catch (e) {}
    }
  } catch (e) { /* kein Server – rein lokale Nutzung */ }
})();
