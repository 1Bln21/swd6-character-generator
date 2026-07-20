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
  online_my_chars: 'Meine Online-Charaktere',
  online_shared_chars: 'Für mich freigegeben',
  online_upload: '⬆ Aktuellen Charakter hochladen',
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
  online_no_name: 'Bitte dem Charakter zuerst einen Namen geben (Tab „Charakter“).',
  online_error: 'Fehler: ',
  online_offline: 'Server nicht erreichbar.',
  online_close: 'Schließen',
  online_updated: 'Stand',
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
  online_my_chars: 'My online characters',
  online_shared_chars: 'Shared with me',
  online_upload: '⬆ Upload current character',
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
  online_no_name: 'Please give the character a name first ("Character" tab).',
  online_error: 'Error: ',
  online_offline: 'Server not reachable.',
  online_close: 'Close',
  online_updated: 'Updated',
});

/* ---------------- Zustand & API ---------------- */
const LS_ONLINE = 'swd6_online';
let ONLINE = { token: '', username: '', mfaEnabled: false };
try { Object.assign(ONLINE, JSON.parse(localStorage.getItem(LS_ONLINE)) || {}); } catch (e) {}
let onlineAvailable = false;
let onlineView = 'login';       // login | account | mfaSetup | mfaBackup
let onlineData = { mine: [], shared: [] };
let onlineMsg = '';
let mfaSetup = null;            // {secret, otpauth}
let mfaBackupCodes = [];
let shareOpenId = null;
let shareLists = {};            // charId -> [usernames]
let regInfo = { register: true, registerCode: false };

function apiUrl() {
  return (typeof SITE_CONFIG !== 'undefined' && SITE_CONFIG.apiUrl) || '';
}
async function api(action, body, params) {
  const headers = { 'Content-Type': 'application/json' };
  if (ONLINE.token) headers['Authorization'] = 'Bearer ' + ONLINE.token;
  let url = apiUrl() + '?action=' + encodeURIComponent(action);
  if (params) Object.keys(params).forEach(k => {
    url += '&' + encodeURIComponent(k) + '=' + encodeURIComponent(params[k]);
  });
  const res = await fetch(url, {
    method: body !== undefined ? 'POST' : 'GET',
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
  let data = null;
  try { data = await res.json(); } catch (e) {}
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
}
function updateOnlineButton() {
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
    setOnlineAuth(ONLINE);
    onlineData = await api('chars');
  } catch (e) { onlineMsg = e.message; }
  renderOnline();
}

function fmtDate(ts) {
  if (!ts) return '';
  return new Date(ts * 1000).toLocaleString(LANG === 'de' ? 'de-DE' : 'en-US',
    { dateStyle: 'short', timeStyle: 'short' });
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
    <p><button class="accent" data-oact="login">${t('online_do_login')}</button></p>`;
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
    <h3>${t('online_my_chars')}</h3>
    <p><button class="accent" data-oact="upload">${t('online_upload')}</button></p>
    <table class="list">${mine || `<tr><td class="hint">${t('online_none')}</td></tr>`}</table>
    <h3>${t('online_shared_chars')}</h3>
    <table class="list">${shared || `<tr><td class="hint">${t('online_none')}</td></tr>`}</table>
    <p class="hint">${t('online_readonly_hint')}</p>
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
        setOnlineAuth({ token: res.token, username: res.username, mfaEnabled: res.mfaEnabled });
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
        setOnlineAuth({ token: res.token, username: res.username, mfaEnabled: false });
        onlineView = 'account';
        await refreshCloud();
        return;
      }
      case 'logout':
        try { await api('logout', {}); } catch (e) {}
        setOnlineAuth({ token: '', username: '', mfaEnabled: false });
        onlineView = 'login';
        break;
      case 'upload': {
        const name = (C.info.name || '').trim();
        if (!name) { onlineMsg = t('online_no_name'); break; }
        const payload = JSON.parse(JSON.stringify(C));
        delete payload._cloudId;
        let id = C._cloudId || 0;
        try {
          const res = await api('char_save', { id, name, data: payload });
          C._cloudId = res.id;
        } catch (e) {
          if (e.status === 403 || e.status === 404) {
            const res = await api('char_save', { name, data: payload });
            C._cloudId = res.id;
          } else throw e;
        }
        autosave();
        onlineMsg = t('online_saved');
        onlineData = await api('chars');
        break;
      }
      case 'load': {
        const id = +el.dataset.id;
        const data = await api('char_get', undefined, { id });
        C = migrate(data.data);
        C._cloudId = data.readonly ? null : data.id;
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
        onlineData = await api('chars');
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
  if (el && el.closest('#onlineModal')) { e.preventDefault(); onlineAction(el); }
});
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeOnline();
  if (e.key === 'Enter' && e.target.closest && e.target.closest('#onlineModal')) {
    const box = document.getElementById('onlineBox');
    const primary = box && box.querySelector('button.accent[data-oact]');
    if (primary) { e.preventDefault(); primary.click(); }
  }
});

/* Sprachwechsel: Online-UI mit übersetzen */
const _setLangOrig = setLang;
setLang = function (l) {
  _setLangOrig(l);
  updateOnlineButton();
  renderOnline();
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
    regInfo = { register: !!data.register, registerCode: !!data.registerCode };
    if (btn) {
      btn.addEventListener('click', openOnline);
      updateOnlineButton();
    }
    if (ONLINE.token) {
      try { const me = await api('me'); ONLINE.username = me.username; ONLINE.mfaEnabled = me.mfaEnabled; setOnlineAuth(ONLINE); }
      catch (e) {}
    }
  } catch (e) { /* kein Server – rein lokale Nutzung */ }
})();
