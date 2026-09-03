/* =====================================================================
   Star Wars D6 character generator - legal notice & privacy policy
   ---------------------------------------------------------------------
   Built-in legal texts, filled in with the operator's details. Storage:
     1. server (api/data/legal.json) - applies to ALL visitors, admin only
     2. SITE_CONFIG.legal in config.js - for hosting without PHP
     3. localStorage - this browser only (local use)
   Alternatively they can link out to pages of the operator's own.

   NOTE: the texts are a sample template offered without warranty and are
   no substitute for legal advice.
   ===================================================================== */
'use strict';

/* ---------------- translations ---------------- */
Object.assign(T.de, {
  /* These five used to live in app.js and were therefore missing from the
     droid and ship pages - they belong to this module. */
  opt_legal: 'Rechtliches (fürs Hosting)',
  legal_impressum_label: 'Link zum Impressum',
  legal_datenschutz_label: 'Link zur Datenschutzerklärung',
  legal_hint: 'Leer = Link ausgeblendet. Gilt nur für diesen Browser – damit alle Besucher die Links sehen, die URLs in config.js eintragen.',
  link_impressum: 'Impressum', link_datenschutz: 'Datenschutz',
  legal_open_settings: '⚖ Impressum & Datenschutz…',
  legal_settings_title: 'Impressum & Datenschutz',
  legal_urls_section: 'Eigene Seiten verlinken (optional)',
  legal_urls_hint: 'Nur ausfüllen, wenn du bereits eigene Rechtsseiten hast. Bleiben die Felder leer, werden die eingebauten Seiten mit deinen Angaben unten verwendet.',
  legal_data_section: 'Angaben für die eingebauten Seiten',
  legal_f_name: 'Name / Betreiber*', legal_f_street: 'Straße & Hausnummer*',
  legal_f_zip: 'PLZ*', legal_f_city: 'Ort*', legal_f_country: 'Land',
  legal_f_email: 'E-Mail*', legal_f_phone: 'Telefon (optional)',
  legal_f_responsible: 'Inhaltlich verantwortlich (falls abweichend)',
  legal_f_vat: 'USt-IdNr. (optional)',
  legal_f_provider: 'Hosting-Anbieter (für die Datenschutzerklärung)',
  legal_f_provideraddr: 'Anschrift des Hosters (optional)',
  legal_required: '* Pflichtangaben für ein Impressum in Deutschland.',
  legal_f_jurisdiction: 'Rechtsraum des Betreibers',
  legal_j_de: 'Deutschland',
  legal_j_eu: 'Anderes EU-/EWR-Land',
  legal_j_other: 'Außerhalb der EU/des EWR',
  legal_j_hint: 'Nicht dasselbe wie das Land oben – das steht in der Anschrift. Hier geht es darum, nach welchem Recht die Seite betrieben wird. Die Datenschutzerklärung stützt sich allein auf die DSGVO und gilt damit im gesamten EU-/EWR-Raum unverändert; nur das Impressum hängt am nationalen Recht.',
  legal_j_warn_eu: 'Das Impressum wird ohne Paragraphenangabe erzeugt. Die Pflicht dazu stammt aus der E-Commerce-Richtlinie, die jedes Land eigenständig umgesetzt hat (Österreich § 5 ECG, Niederlande Art. 3:15d BW …). Prüfe, welche Angaben dein Land verlangt und unter welcher Bezeichnung.',
  legal_j_warn_other: 'Das Impressum wird ohne Paragraphenangabe erzeugt. Außerhalb der EU gelten andere Regeln – prüfe, was dein Land für Anbieterangaben verlangt.',
  legal_j_warn_privacy: 'Diese Datenschutzerklärung ist auf die DSGVO geschrieben. Außerhalb der EU/des EWR gilt sie nicht automatisch – Kalifornien (CCPA/CPRA), Kanada (PIPEDA) und andere verlangen Eigenes. Vor der Veröffentlichung prüfen lassen.',
  legal_preview_only: 'Nur für dich sichtbar, nicht Teil des Dokuments:',
  legal_save: '💾 Speichern', legal_saved: 'Gespeichert ✔',
  legal_preview_i: 'Impressum ansehen', legal_preview_d: 'Datenschutz ansehen',
  legal_store_server: '✔ Angemeldet als Administrator – die Angaben werden auf dem Server gespeichert und allen Besuchern angezeigt.',
  legal_store_local: 'Kein Server erreichbar – die Angaben werden nur in diesem Browser gespeichert. Für ein öffentliches Hosting ohne PHP das config.js-Snippet unten übernehmen.',
  legal_store_nologin: 'Nicht als Administrator angemeldet – die Angaben gelten nur in diesem Browser. Melde dich über ☁ Online als Administrator an, damit sie für alle Besucher gelten.',
  legal_locked: '🔒 Nur der Administrator kann diese Angaben ändern. Melde dich über ☁ Online an, um sie zu bearbeiten. (Ansehen ist für alle möglich.)',
  legal_snippet_btn: '</> config.js-Snippet',
  legal_snippet_hint: 'Diesen Block in config.js einfügen (ersetzt dort das legal-Objekt), damit die Angaben ohne PHP-Server für alle Besucher gelten:',
  legal_disclaimer: 'Wichtig: Diese Texte sind eine allgemeine Muster-Vorlage ohne Gewähr auf Vollständigkeit oder Richtigkeit und stellen keine Rechtsberatung dar. Prüfe sie vor der Veröffentlichung – im Zweifel anwaltlich.',
  legal_no_data: 'Es sind noch keine Angaben hinterlegt. Trage sie im ⚙-Menü unter „Impressum & Datenschutz“ ein.',
  legal_missing: 'Bitte mindestens Name, Straße, PLZ, Ort und E-Mail ausfüllen.',
  legal_error: 'Fehler: ',
  doc_impressum: 'Impressum', doc_privacy: 'Datenschutzerklärung',
  legal_updated: 'Stand',
});
Object.assign(T.en, {
  opt_legal: 'Legal (for hosting)',
  legal_impressum_label: 'Legal notice (Impressum) URL',
  legal_datenschutz_label: 'Privacy policy URL',
  legal_hint: 'Empty = link hidden. Applies to this browser only – to show the links to all visitors, set the URLs in config.js.',
  link_impressum: 'Legal Notice', link_datenschutz: 'Privacy Policy',
  legal_open_settings: '⚖ Legal notice & privacy…',
  legal_settings_title: 'Legal notice & privacy policy',
  legal_urls_section: 'Link to your own pages (optional)',
  legal_urls_hint: 'Only fill these in if you already have your own legal pages. If left empty, the built-in pages are used with the details below.',
  legal_data_section: 'Details for the built-in pages',
  legal_f_name: 'Name / operator*', legal_f_street: 'Street & number*',
  legal_f_zip: 'Postcode*', legal_f_city: 'City*', legal_f_country: 'Country',
  legal_f_email: 'E-mail*', legal_f_phone: 'Phone (optional)',
  legal_f_responsible: 'Responsible for content (if different)',
  legal_f_vat: 'VAT ID (optional)',
  legal_f_provider: 'Hosting provider (for the privacy policy)',
  legal_f_provideraddr: 'Address of the host (optional)',
  legal_required: '* Required for a legal notice (Impressum) in Germany.',
  legal_f_jurisdiction: 'Legal setting of the operator',
  legal_j_de: 'Germany',
  legal_j_eu: 'Another EU/EEA country',
  legal_j_other: 'Outside the EU/EEA',
  legal_j_hint: 'Not the same as the country above - that one goes in the address. This is about the law the site is run under. The privacy policy rests on the GDPR alone and therefore holds unchanged across the EU/EEA; only the legal notice depends on national law.',
  legal_j_warn_eu: 'The legal notice is produced without citing a statute. The duty comes from the e-commerce directive, which every country implemented for itself (Austria § 5 ECG, the Netherlands art. 3:15d BW …). Check what your country requires and under which heading.',
  legal_j_warn_other: 'The legal notice is produced without citing a statute. Outside the EU different rules apply - check what your country requires of a service provider.',
  legal_j_warn_privacy: 'This privacy policy is written for the GDPR. Outside the EU/EEA it does not apply automatically - California (CCPA/CPRA), Canada (PIPEDA) and others demand their own. Have it reviewed before publishing.',
  legal_preview_only: 'Visible to you only, not part of the document:',
  legal_save: '💾 Save', legal_saved: 'Saved ✔',
  legal_preview_i: 'View legal notice', legal_preview_d: 'View privacy policy',
  legal_store_server: '✔ Signed in as administrator – the details are stored on the server and shown to all visitors.',
  legal_store_local: 'No server reachable – the details are stored in this browser only. For public hosting without PHP, use the config.js snippet below.',
  legal_store_nologin: 'Not signed in as administrator – these details apply to this browser only. Sign in via ☁ Online as the administrator so they apply to all visitors.',
  legal_locked: '🔒 Only the administrator can change these details. Sign in via ☁ Online to edit them. (Viewing is possible for everyone.)',
  legal_snippet_btn: '</> config.js snippet',
  legal_snippet_hint: 'Paste this block into config.js (replacing the legal object there) so the details apply to all visitors without a PHP server:',
  legal_disclaimer: 'Important: these texts are a general template without any warranty of completeness or correctness and do not constitute legal advice. Review them before publishing – consult a lawyer if in doubt.',
  legal_no_data: 'No details have been entered yet. Add them in the ⚙ menu under “Legal notice & privacy”.',
  legal_missing: 'Please fill in at least name, street, postcode, city and e-mail.',
  legal_error: 'Error: ',
  doc_impressum: 'Legal Notice', doc_privacy: 'Privacy Policy',
  legal_updated: 'Last updated',
});

/* ---------------- storage ---------------- */
const LS_LEGAL = 'swd6_legal';
const LEGAL_FIELDS = ['name', 'street', 'zip', 'city', 'country', 'email', 'phone',
                      'responsible', 'vatId', 'provider', 'providerAddress',
                      /* Under whose law the site is run: 'de' | 'eu' | 'other'.
                         NOT the same as the postal country above - that one is
                         free text and says where the letters go. */
                      'jurisdiction'];

/* Which legal setting applies. Empty counts as Germany, so an installation
   that existed before this field keeps exactly the text it had. */
function legalWhere(d) {
  const j = (d && d.jurisdiction) || 'de';
  return (j === 'eu' || j === 'other') ? j : 'de';
}
function legalJWarn(wo) {
  if (wo === 'de') return '';
  return esc(t('legal_j_warn_' + wo)) + ' ' +
         (wo === 'other' ? esc(t('legal_j_warn_privacy')) : '');
}
let legalServer = null;      // loaded from the server (applies to all visitors)
let legalMsg = '';
let legalSnippetOpen = false;

function legalEmpty() {
  const o = { urls: { impressum: '', datenschutz: '' } };
  LEGAL_FIELDS.forEach(f => o[f] = '');
  return o;
}
function legalLocal() {
  let raw = {};
  try { raw = JSON.parse(localStorage.getItem(LS_LEGAL)) || {}; } catch (e) {}
  /* Migrating the old shape: { impressum: url, datenschutz: url } */
  if (raw && typeof raw.impressum === 'string' && !raw.urls) {
    raw = { urls: { impressum: raw.impressum || '', datenschutz: raw.datenschutz || '' } };
  }
  const o = legalEmpty();
  LEGAL_FIELDS.forEach(f => { if (raw[f]) o[f] = raw[f]; });
  if (raw.urls) {
    o.urls.impressum = raw.urls.impressum || '';
    o.urls.datenschutz = raw.urls.datenschutz || '';
  }
  o.updated = raw.updated || 0;
  return o;
}
function legalConfig() {
  const cfg = (typeof SITE_CONFIG !== 'undefined' && SITE_CONFIG) || {};
  const o = legalEmpty();
  const src = cfg.legal || {};
  LEGAL_FIELDS.forEach(f => { if (src[f]) o[f] = src[f]; });
  o.urls.impressum = (src.urls && src.urls.impressum) || cfg.impressumUrl || '';
  o.urls.datenschutz = (src.urls && src.urls.datenschutz) || cfg.datenschutzUrl || '';
  return o;
}
function legalHasContent(d) {
  return !!(d && (d.name || d.urls.impressum || d.urls.datenschutz));
}
/* Which data applies: server > config.js > localStorage */
function legalData() {
  if (legalHasContent(legalServer)) return legalServer;
  const cfg = legalConfig();
  if (legalHasContent(cfg)) return cfg;
  return legalLocal();
}
function legalIsAdmin() {
  return typeof ONLINE !== 'undefined' && !!ONLINE.token && !!ONLINE.isAdmin;
}
function legalApiAvailable() {
  return typeof onlineAvailable !== 'undefined' && onlineAvailable;
}

/* ---------------- the legal texts ---------------- */
function legalAddress(d) {
  const parts = [];
  if (d.name) parts.push(esc(d.name));
  if (d.street) parts.push(esc(d.street));
  const line = [d.zip, d.city].filter(x => x).join(' ');
  if (line) parts.push(esc(line));
  if (d.country) parts.push(esc(d.country));
  return parts.join('<br>');
}
/* Two versions, and the reason is a difference between two kinds of European
   law. The privacy policy rests entirely on the GDPR, which is a REGULATION
   and therefore applies directly in every member state - it needs no variant.
   The duty to publish who runs a site comes from the e-commerce DIRECTIVE,
   and a directive is turned into national law by each country separately:
   Germany § 5 DDG, Austria § 5 ECG, the Netherlands art. 3:15d BW. There is
   no citation that is right everywhere.

   So: the German text keeps its paragraphs, and everyone else gets the same
   substance without a citation that would be wrong for them. Naming the
   wrong statute is worse than naming none. */
function docImpressum(d) {
  return legalWhere(d) === 'de' ? docImpressumDe(d) : docImpressumNeutral(d);
}

function docImpressumDe(d) {
  if (LANG === 'en') return `
    <h3>Legal Notice</h3>
    <p><b>Information pursuant to § 5 DDG (German Digital Services Act)</b></p>
    <p>${legalAddress(d)}</p>
    <p><b>Contact</b><br>E-mail: ${esc(d.email)}${d.phone ? '<br>Phone: ' + esc(d.phone) : ''}</p>
    ${d.responsible ? `<p><b>Responsible for the content pursuant to § 18 (2) MStV</b><br>${esc(d.responsible)}</p>` : ''}
    ${d.vatId ? `<p><b>VAT identification number</b><br>${esc(d.vatId)}</p>` : ''}
    <h4>Consumer dispute resolution</h4>
    <p>We are neither willing nor obliged to take part in dispute resolution proceedings before a consumer arbitration board.</p>
    <h4>Liability for content</h4>
    <p>As a service provider we are responsible for our own content on these pages in accordance with general law (§ 7 (1) DDG). However, we are not obliged to monitor transmitted or stored third-party information or to investigate circumstances that indicate illegal activity. Obligations to remove or block the use of information under general law remain unaffected. Liability in this respect is only possible from the point in time at which we become aware of a specific infringement. If we become aware of such infringements, we will remove the content immediately.</p>
    <h4>Liability for links</h4>
    <p>Our offer may contain links to external third-party websites over whose content we have no influence. We therefore cannot accept any liability for this third-party content. The respective provider or operator of the linked pages is always responsible for their content. The linked pages were checked for possible legal violations at the time of linking; illegal content was not recognisable. If we become aware of legal violations, we will remove such links immediately.</p>
    <h4>Copyright</h4>
    <p>Content and works created by the site operator on these pages are subject to copyright law. Contributions by third parties are marked as such.</p>
    <h4>Fan project notice</h4>
    <p>This application is a non-commercial fan project and is not affiliated with Lucasfilm Ltd., The Walt Disney Company or West End Games. “Star Wars” and all related names are trademarks of their respective owners.</p>`;
  return `
    <h3>Impressum</h3>
    <p><b>Angaben gemäß § 5 DDG (Digitale-Dienste-Gesetz)</b></p>
    <p>${legalAddress(d)}</p>
    <p><b>Kontakt</b><br>E-Mail: ${esc(d.email)}${d.phone ? '<br>Telefon: ' + esc(d.phone) : ''}</p>
    ${d.responsible ? `<p><b>Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV</b><br>${esc(d.responsible)}</p>` : ''}
    ${d.vatId ? `<p><b>Umsatzsteuer-Identifikationsnummer</b><br>${esc(d.vatId)}</p>` : ''}
    <h4>Verbraucherstreitbeilegung</h4>
    <p>Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.</p>
    <h4>Haftung für Inhalte</h4>
    <p>Als Diensteanbieter sind wir gemäß § 7 Abs. 1 DDG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 DDG sind wir als Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen. Verpflichtungen zur Entfernung oder Sperrung der Nutzung von Informationen nach den allgemeinen Gesetzen bleiben hiervon unberührt. Eine diesbezügliche Haftung ist jedoch erst ab dem Zeitpunkt der Kenntnis einer konkreten Rechtsverletzung möglich. Bei Bekanntwerden von entsprechenden Rechtsverletzungen werden wir diese Inhalte umgehend entfernen.</p>
    <h4>Haftung für Links</h4>
    <p>Unser Angebot enthält ggf. Links zu externen Websites Dritter, auf deren Inhalte wir keinen Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich. Die verlinkten Seiten wurden zum Zeitpunkt der Verlinkung auf mögliche Rechtsverstöße überprüft; rechtswidrige Inhalte waren nicht erkennbar. Bei Bekanntwerden von Rechtsverletzungen werden wir derartige Links umgehend entfernen.</p>
    <h4>Urheberrecht</h4>
    <p>Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen Urheberrecht. Beiträge Dritter sind als solche gekennzeichnet.</p>
    <h4>Hinweis zum Fan-Projekt</h4>
    <p>Diese Anwendung ist ein nicht-kommerzielles Fan-Projekt und steht in keiner Verbindung zu Lucasfilm Ltd., The Walt Disney Company oder West End Games. „Star Wars“ und alle zugehörigen Bezeichnungen sind Marken der jeweiligen Rechteinhaber.</p>`;
}

/* Same information, no national citation. What has to be shown, and under
   which heading, is set by the law of the country the site is run from -
   this covers the common core: who runs it, how to reach them, who answers
   for the content. */
function docImpressumNeutral(d) {
  if (LANG === 'en') return `
    <h3>Legal Notice</h3>
    <p><b>Information about the provider of this service</b></p>
    <p>${legalAddress(d)}</p>
    <p><b>Contact</b><br>E-mail: ${esc(d.email)}${d.phone ? '<br>Phone: ' + esc(d.phone) : ''}</p>
    ${d.responsible ? `<p><b>Responsible for the content</b><br>${esc(d.responsible)}</p>` : ''}
    ${d.vatId ? `<p><b>VAT identification number</b><br>${esc(d.vatId)}</p>` : ''}
    <h4>Liability for content</h4>
    <p>We are responsible for our own content on these pages under the general laws. We are not obliged to monitor third-party information transmitted or stored here, nor to investigate circumstances that point to unlawful activity. Obligations to remove or block the use of information under the general laws remain unaffected; liability in this respect is only possible from the moment a concrete infringement becomes known. We will remove such content immediately once we learn of it.</p>
    <h4>Liability for links</h4>
    <p>Our offer may contain links to external third-party websites over whose content we have no influence. We therefore cannot accept any liability for this third-party content. The respective provider or operator of the linked pages is always responsible for their content. The linked pages were checked for possible legal violations at the time of linking; illegal content was not recognisable. If we become aware of legal violations, we will remove such links immediately.</p>
    <h4>Copyright</h4>
    <p>Content and works created by the site operator on these pages are subject to copyright. Contributions by third parties are marked as such.</p>
    <h4>Fan project notice</h4>
    <p>This application is a non-commercial fan project and is not affiliated with Lucasfilm Ltd., The Walt Disney Company or West End Games. “Star Wars” and all related names are trademarks of their respective owners.</p>`;
  return `
    <h3>Impressum / Anbieterkennzeichnung</h3>
    <p><b>Angaben zum Anbieter dieses Dienstes</b></p>
    <p>${legalAddress(d)}</p>
    <p><b>Kontakt</b><br>E-Mail: ${esc(d.email)}${d.phone ? '<br>Telefon: ' + esc(d.phone) : ''}</p>
    ${d.responsible ? `<p><b>Verantwortlich für den Inhalt</b><br>${esc(d.responsible)}</p>` : ''}
    ${d.vatId ? `<p><b>Umsatzsteuer-Identifikationsnummer</b><br>${esc(d.vatId)}</p>` : ''}
    <h4>Haftung für Inhalte</h4>
    <p>Für eigene Inhalte auf diesen Seiten sind wir nach den allgemeinen Gesetzen verantwortlich. Wir sind nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen. Verpflichtungen zur Entfernung oder Sperrung der Nutzung von Informationen nach den allgemeinen Gesetzen bleiben hiervon unberührt; eine Haftung ist erst ab dem Zeitpunkt der Kenntnis einer konkreten Rechtsverletzung möglich. Bei Bekanntwerden entsprechender Rechtsverletzungen entfernen wir diese Inhalte umgehend.</p>
    <h4>Haftung für Links</h4>
    <p>Unser Angebot enthält ggf. Links zu externen Websites Dritter, auf deren Inhalte wir keinen Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich. Die verlinkten Seiten wurden zum Zeitpunkt der Verlinkung auf mögliche Rechtsverstöße überprüft; rechtswidrige Inhalte waren nicht erkennbar. Bei Bekanntwerden von Rechtsverletzungen entfernen wir derartige Links umgehend.</p>
    <h4>Urheberrecht</h4>
    <p>Die durch den Anbieter erstellten Inhalte und Werke auf diesen Seiten unterliegen dem Urheberrecht. Beiträge Dritter sind als solche gekennzeichnet.</p>
    <h4>Hinweis zum Fan-Projekt</h4>
    <p>Diese Anwendung ist ein nicht-kommerzielles Fan-Projekt und steht in keiner Verbindung zu Lucasfilm Ltd., The Walt Disney Company oder West End Games. „Star Wars“ und alle zugehörigen Bezeichnungen sind Marken der jeweiligen Rechteinhaber.</p>`;
}

function docPrivacy(d) {
  const host = d.provider ? esc(d.provider) : (LANG === 'en' ? 'our hosting provider' : 'unser Hosting-Anbieter');
  const hostAddr = d.providerAddress ? ` (${esc(d.providerAddress)})` : '';
  if (LANG === 'en') return `
    <h3>Privacy Policy</h3>
    <h4>1. Controller</h4>
    <p>${legalAddress(d)}<br>E-mail: ${esc(d.email)}${d.phone ? '<br>Phone: ' + esc(d.phone) : ''}</p>
    <h4>2. Overview</h4>
    <p>This application is a character generator for a tabletop role-playing game. It contains no advertising, no tracking and no third-party services. All files (scripts, styles, fonts) are delivered from this server; no external CDNs or analytics services are used.</p>
    <h4>3. Server log files</h4>
    <p>When you access the site, ${host}${hostAddr} automatically collects server log files: IP address, date and time of the request, the file requested, amount of data transferred, browser type and version, operating system and referrer URL. Legal basis is Art. 6 (1) (f) GDPR (legitimate interest in a technically correct presentation and the security of the service). These data are generally deleted after a few days and are not merged with other data sources.</p>
    <h4>4. Storage in your browser (local storage)</h4>
    <p>The application stores your characters, the chosen language and – if you use an account – your login token in your browser’s local storage. These data remain on your device and are not transmitted automatically. No cookies are used for analysis or advertising. You can delete them at any time via your browser settings or the functions of the application.</p>
    <h4>5. User accounts (optional)</h4>
    <p>If you create an account we process: your chosen user name, your password (stored only as a bcrypt hash, never in plain text), the time of registration, a counter for failed login attempts, your approval and administrator status and – if you enable two-factor authentication – a TOTP secret and hashes of your backup codes. Recovery and password-reset codes are likewise stored only as hashes, as are session tokens. <b>No e-mail address is required.</b> Purpose: providing the user account; legal basis Art. 6 (1) (b) GDPR.</p>
    <h4>6. Stored characters and sharing</h4>
    <p>Characters you save online contain the data you enter (name, values, descriptive texts and optionally an image). If you share a character, the user accounts you select can read it. You can revoke a share at any time.</p>
    <h4>7. Bug reports and feedback</h4>
    <p>The application can report faults. Two things send data here: the “Report a bug” button in the gear menu, which sends what you type into it, and an automatic handler that reports script errors on its own so that faults nobody writes in about are still noticed.</p>
    <p>Sent in both cases: the error message or your text, the place in the program code, the page, the version of the application, the browser family with its major version (for example “Firefox 128 / Windows”) and the set language. <b>No IP address is stored, no complete user agent, no identifier that would follow you from one visit to the next.</b> If you are signed in, your user name is attached so that an answer by ticket is possible; without an account the report is anonymous. A character sheet is only sent along if you tick that box in the dialog yourself, and pictures are removed from it beforehand.</p>
    <p>To limit abuse of the open interface, the number of reports per sender within one hour is counted. The key for this is not your IP address but a hash of it with an installation-specific secret and the current date; it cannot be turned back into an address, does not connect one day with the next, and is deleted after two days.</p>
    <p>Legal basis is Art. 6 (1) (f) GDPR (legitimate interest in finding and fixing faults in the application). Automatic reporting can be switched off at any time in the same dialog; the setting is stored in your browser. Reports are deleted at the latest 90 days after being dealt with, an attached sheet after seven.</p>
    <h4>8. Storage period and deletion</h4>
    <p>Characters are stored until you delete them. Your account and all associated data will be deleted on request to ${esc(d.email)}.</p>
    <h4>9. Encryption</h4>
    <p>This site uses HTTPS (TLS) to protect the transmission of your data.</p>
    <h4>10. Your rights</h4>
    <p>You have the right to information (Art. 15 GDPR), rectification (Art. 16), erasure (Art. 17), restriction of processing (Art. 18), data portability (Art. 20) and to object (Art. 21). You also have the right to lodge a complaint with a supervisory authority (Art. 77 GDPR).</p>
    <h4>11. No disclosure, no third countries</h4>
    <p>Your data are not passed on to third parties and not transferred to countries outside the EU/EEA, apart from the technical processing by the hosting provider acting as a processor.</p>
    <h4>12. No automated decision-making</h4>
    <p>No automated decision-making or profiling within the meaning of Art. 22 GDPR takes place.</p>`;
  return `
    <h3>Datenschutzerklärung</h3>
    <h4>1. Verantwortlicher</h4>
    <p>${legalAddress(d)}<br>E-Mail: ${esc(d.email)}${d.phone ? '<br>Telefon: ' + esc(d.phone) : ''}</p>
    <h4>2. Überblick</h4>
    <p>Diese Anwendung ist ein Charaktergenerator für ein Tischrollenspiel. Sie kommt ohne Werbung, ohne Tracking und ohne Dienste Dritter aus. Alle benötigten Dateien (Skripte, Stylesheets, Schriften) werden von diesem Server ausgeliefert; es werden keine externen CDNs oder Analysedienste eingebunden.</p>
    <h4>3. Server-Logfiles</h4>
    <p>Beim Aufruf der Seite erhebt ${host}${hostAddr} automatisch Server-Logfiles: IP-Adresse, Datum und Uhrzeit der Anfrage, aufgerufene Datei, übertragene Datenmenge, Browsertyp und -version, Betriebssystem sowie Referrer-URL. Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an einer technisch fehlerfreien Darstellung und der Sicherheit des Angebots). Diese Daten werden in der Regel nach wenigen Tagen gelöscht und nicht mit anderen Datenquellen zusammengeführt.</p>
    <h4>4. Speicherung im Browser (localStorage)</h4>
    <p>Die Anwendung speichert deine Charaktere, die gewählte Sprache und – bei Nutzung eines Kontos – dein Anmeldetoken im lokalen Speicher deines Browsers. Diese Daten verbleiben auf deinem Gerät und werden nicht automatisch übertragen. Cookies zu Analyse- oder Werbezwecken werden nicht eingesetzt. Du kannst die Daten jederzeit über die Browsereinstellungen oder die Funktionen der Anwendung löschen.</p>
    <h4>5. Benutzerkonten (optional)</h4>
    <p>Legst du ein Konto an, verarbeiten wir: den von dir gewählten Benutzernamen, dein Passwort (ausschließlich als bcrypt-Hash, nie im Klartext), den Zeitpunkt der Registrierung, einen Zähler für Fehlanmeldungen, den Freigabe- und Administratorstatus sowie – bei aktivierter Zwei-Faktor-Anmeldung – einen TOTP-Schlüssel und Hashes deiner Backup-Codes. Auch Wiederherstellungs- und Zurücksetz-Codes für vergessene Passwörter werden nur als Hash gespeichert, ebenso die Sitzungstoken. <b>Eine E-Mail-Adresse wird nicht verlangt.</b> Zweck ist die Bereitstellung des Nutzerkontos; Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO.</p>
    <h4>6. Gespeicherte Charaktere und Freigaben</h4>
    <p>Online gespeicherte Charaktere enthalten die von dir eingegebenen Daten (Name, Werte, Beschreibungstexte und optional ein Bild). Gibst du einen Charakter frei, können die von dir gewählten Benutzerkonten ihn lesen. Eine Freigabe kannst du jederzeit widerrufen.</p>
    <h4>7. Fehlerberichte und Rückmeldungen</h4>
    <p>Die Anwendung kann Fehler melden. Zwei Dinge senden hier Daten: der Knopf „Fehler melden“ im Zahnradmenü, der schickt, was du hineinschreibst, und eine automatische Erfassung, die Skriptfehler von selbst meldet – damit auch Fehler auffallen, über die niemand schreibt.</p>
    <p>Übertragen werden in beiden Fällen: die Fehlermeldung bzw. dein Text, die Stelle im Programmcode, die Seite, die Version der Anwendung, die Browser-Familie mit Hauptversion (z. B. „Firefox 128 / Windows“) und die eingestellte Sprache. <b>Es wird keine IP-Adresse gespeichert, kein vollständiger User-Agent und keine Kennung, die dich über Besuche hinweg wiedererkennbar macht.</b> Bist du angemeldet, wird dein Benutzername mitgeschickt, damit eine Antwort per Ticket möglich ist; ohne Konto ist die Meldung anonym. Ein Charakterbogen wird nur mitgesendet, wenn du das im Dialog selbst ankreuzt – Bilder werden vorher entfernt.</p>
    <p>Um Missbrauch der offenen Schnittstelle zu begrenzen, wird die Zahl der Meldungen je Absender innerhalb einer Stunde gezählt. Schlüssel dafür ist nicht deine IP-Adresse, sondern ein Hash aus ihr, einem installationsspezifischen Geheimnis und dem aktuellen Datum; er lässt sich nicht in eine Adresse zurückrechnen, verbindet einen Tag nicht mit dem nächsten und wird nach zwei Tagen gelöscht.</p>
    <p>Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse daran, Fehler der Anwendung zu finden und zu beheben). Die automatische Meldung lässt sich im selben Dialog jederzeit abschalten; die Einstellung liegt in deinem Browser. Berichte werden spätestens 90 Tage nach ihrer Erledigung gelöscht, ein angehängter Bogen bereits nach sieben Tagen.</p>
    <h4>8. Speicherdauer und Löschung</h4>
    <p>Charaktere werden gespeichert, bis du sie löschst. Dein Konto und alle zugehörigen Daten löschen wir auf Anfrage an ${esc(d.email)}.</p>
    <h4>9. Verschlüsselung</h4>
    <p>Diese Seite nutzt HTTPS (TLS), um die Übertragung deiner Daten zu schützen.</p>
    <h4>10. Deine Rechte</h4>
    <p>Du hast das Recht auf Auskunft (Art. 15 DSGVO), Berichtigung (Art. 16), Löschung (Art. 17), Einschränkung der Verarbeitung (Art. 18), Datenübertragbarkeit (Art. 20) und Widerspruch (Art. 21). Außerdem steht dir ein Beschwerderecht bei einer Datenschutz-Aufsichtsbehörde zu (Art. 77 DSGVO).</p>
    <h4>11. Keine Weitergabe, keine Drittländer</h4>
    <p>Eine Weitergabe deiner Daten an Dritte sowie eine Übermittlung in Länder außerhalb der EU/des EWR findet nicht statt – abgesehen von der technischen Verarbeitung durch den Hosting-Anbieter als Auftragsverarbeiter.</p>
    <h4>12. Keine automatisierte Entscheidungsfindung</h4>
    <p>Eine automatisierte Entscheidungsfindung oder ein Profiling im Sinne des Art. 22 DSGVO findet nicht statt.</p>`;
}

/* ---------------- showing the legal texts ---------------- */
function legalDocModal() {
  let m = document.getElementById('legalDocModal');
  if (!m) {
    m = document.createElement('div');
    m.id = 'legalDocModal';
    m.className = 'modal-overlay no-print hidden';
    m.innerHTML = '<div class="modal-box legal-doc" id="legalDocBox"></div>';
    document.body.appendChild(m);
    m.addEventListener('click', e => { if (e.target === m) m.classList.add('hidden'); });
  }
  return m;
}
/* vorschau = the operator is looking at their own text from the settings
   dialog. Only then is the note about the legal setting shown - a visitor
   following the footer link must never read "this text may not fit", and
   the note is not part of the document either way. */
function openLegalDoc(which, vorschau) {
  const d = legalData();
  const box = legalDocModal().querySelector('#legalDocBox');
  const title = which === 'impressum' ? t('doc_impressum') : t('doc_privacy');
  let content;
  if (!d.name) content = `<p class="hint">${t('legal_no_data')}</p>`;
  else content = which === 'impressum' ? docImpressum(d) : docPrivacy(d);
  let hinweis = '';
  if (vorschau) {
    const wo = legalWhere(d);
    const schluessel = which === 'impressum'
      ? (wo === 'de' ? '' : 'legal_j_warn_' + wo)
      : (wo === 'other' ? 'legal_j_warn_privacy' : '');
    if (schluessel) {
      hinweis = `<p class="warn" style="font-size:12.5px; border:1px solid currentColor;
                    border-radius:6px; padding:8px 10px; margin-bottom:12px">
                   ${t('legal_preview_only')} ${t(schluessel)}</p>`;
    }
  }
  box.innerHTML = `
    <div class="modal-head"><h2>${title}</h2>
      <button class="mini" data-legal-close="1">✕</button></div>
    ${hinweis}
    ${content}
    ${d.updated ? `<p class="hint" style="margin-top:14px">${t('legal_updated')}: ${new Date(d.updated * 1000).toLocaleDateString(LANG === 'de' ? 'de-DE' : 'en-US')}</p>` : ''}
    <p style="text-align:center; margin-top:12px">
      <button class="accent" data-legal-close="1">${t('about_close')}</button></p>`;
  legalDocModal().classList.remove('hidden');
}

/* ---------------- settings ---------------- */
function legalSettingsModal() {
  let m = document.getElementById('legalSetModal');
  if (!m) {
    m = document.createElement('div');
    m.id = 'legalSetModal';
    m.className = 'modal-overlay no-print hidden';
    m.innerHTML = '<div class="modal-box" id="legalSetBox"></div>';
    document.body.appendChild(m);
    m.addEventListener('click', e => { if (e.target === m) m.classList.add('hidden'); });
  }
  return m;
}
function openLegalSettings() {
  legalMsg = ''; legalSnippetOpen = false;
  legalSettingsModal().classList.remove('hidden');
  renderLegalSettings();
}
function legalFormValues() {
  const g = id => { const el = document.getElementById(id); return el ? el.value.trim() : ''; };
  const o = legalEmpty();
  LEGAL_FIELDS.forEach(f => o[f] = g('lg_' + f));
  o.urls.impressum = g('lg_url_impressum');
  o.urls.datenschutz = g('lg_url_datenschutz');
  return o;
}
function renderLegalSettings() {
  const box = document.getElementById('legalSetBox');
  if (!box) return;
  /* When editing, always prefill from whichever source currently applies */
  const d = legalData();
  /* With a server running, only administrators may change the details -
     they then apply to every visitor. Without a server (purely local use)
     anyone may enter their own. */
  const canEdit = !legalApiAvailable() || legalIsAdmin();
  const ro = canEdit ? '' : 'disabled';
  const field = (key, id, type) => `
    <label class="opt-label">${t(key)}</label>
    <input type="${type || 'text'}" id="lg_${id}" value="${esc(d[id] || '')}" ${ro}>`;
  let status, statusCls;
  if (legalIsAdmin()) { status = t('legal_store_server'); statusCls = 'ok'; }
  else if (legalApiAvailable()) { status = t('legal_locked'); statusCls = 'warn'; }
  else { status = t('legal_store_local'); statusCls = 'hint'; }

  box.innerHTML = `
    <div class="modal-head"><h2>${t('legal_settings_title')}</h2>
      <button class="mini" data-legal-close="1">✕</button></div>
    ${legalMsg ? `<p class="modal-msg">${esc(legalMsg)}</p>` : ''}
    <p class="${statusCls}" style="font-size:12.5px">${status}</p>

    <h3>${t('legal_urls_section')}</h3>
    <p class="hint">${t('legal_urls_hint')}</p>
    <label class="opt-label">${t('link_impressum')} – URL</label>
    <input type="url" id="lg_url_impressum" value="${esc(d.urls.impressum || '')}" placeholder="https://…" ${ro}>
    <label class="opt-label">${t('link_datenschutz')} – URL</label>
    <input type="url" id="lg_url_datenschutz" value="${esc(d.urls.datenschutz || '')}" placeholder="https://…" ${ro}>

    <h3>${t('legal_data_section')}</h3>
    ${field('legal_f_name', 'name')}
    ${field('legal_f_street', 'street')}
    <div style="display:flex; gap:8px">
      <div style="flex:0 0 32%">${field('legal_f_zip', 'zip')}</div>
      <div style="flex:1">${field('legal_f_city', 'city')}</div>
    </div>
    ${field('legal_f_country', 'country')}
    <label class="opt-label">${t('legal_f_jurisdiction')}</label>
    <select id="lg_jurisdiction" ${ro}>
      ${['de', 'eu', 'other'].map(j =>
        `<option value="${j}" ${legalWhere(d) === j ? 'selected' : ''}>${t('legal_j_' + j)}</option>`).join('')}
    </select>
    <p class="hint">${t('legal_j_hint')}</p>
    <p class="warn" id="lg_j_warn" style="font-size:12.5px">${legalJWarn(legalWhere(d))}</p>
    ${field('legal_f_email', 'email', 'email')}
    ${field('legal_f_phone', 'phone')}
    ${field('legal_f_responsible', 'responsible')}
    ${field('legal_f_vat', 'vatId')}
    ${field('legal_f_provider', 'provider')}
    ${field('legal_f_provideraddr', 'providerAddress')}
    <p class="hint">${t('legal_required')}</p>

    <p style="margin-top:12px">
      ${canEdit ? `<button class="accent" data-legal-act="save">${t('legal_save')}</button>` : ''}
      <button data-legal-act="preview-impressum">${t('legal_preview_i')}</button>
      <button data-legal-act="preview-datenschutz">${t('legal_preview_d')}</button>
      ${canEdit ? `<button data-legal-act="snippet">${t('legal_snippet_btn')}</button>` : ''}
    </p>
    ${legalSnippetOpen && canEdit ? `
      <p class="hint">${t('legal_snippet_hint')}</p>
      <textarea readonly rows="8" style="font-family:Consolas,monospace; font-size:12px">${esc(legalSnippet())}</textarea>` : ''}
    <p class="warn" style="font-size:12px; margin-top:12px">${t('legal_disclaimer')}</p>`;
}
function legalSnippet() {
  const d = legalFormValues();
  const q = s => JSON.stringify(s || '');
  return '  legal: {\n' +
    LEGAL_FIELDS.map(f => `    ${f}: ${q(d[f])},`).join('\n') +
    `\n    urls: { impressum: ${q(d.urls.impressum)}, datenschutz: ${q(d.urls.datenschutz)} },\n  },`;
}
async function legalSave() {
  /* Safety net: with a server running, only the administrator saves.
     Without this check a visitor could create local details that would only
     confuse themselves. The server rejects it anyway. */
  if (legalApiAvailable() && !legalIsAdmin()) {
    legalMsg = t('legal_locked');
    renderLegalSettings();
    return;
  }
  const d = legalFormValues();
  const urlsOnly = (d.urls.impressum || d.urls.datenschutz) && !d.name;
  if (!urlsOnly && d.name && (!d.street || !d.zip || !d.city || !d.email)) {
    legalMsg = t('legal_missing'); renderLegalSettings(); return;
  }
  ['impressum', 'datenschutz'].forEach(k => {
    let v = d.urls[k];
    if (v && !/^https?:\/\//i.test(v)) d.urls[k] = 'https://' + v.replace(/^\/+/, '');
  });
  if (legalIsAdmin()) {
    try {
      const res = await api('legal_save', { legal: d });
      legalServer = res.legal;
      legalMsg = t('legal_saved');
    } catch (e) { legalMsg = t('legal_error') + e.message; }
  } else {
    d.updated = Math.floor(Date.now() / 1000);
    localStorage.setItem(LS_LEGAL, JSON.stringify(d));
    legalMsg = t('legal_saved');
  }
  renderLegal();
  renderLegalSettings();
}

/* ---------------- footer links & menu entry ----------------
   Deliberately via window: app.js brings a stub renderLegal() with it,
   genshared.js (the droid and ship pages) does not. A plain assignment
   "renderLegal = ..." throws a ReferenceError there in strict mode - and
   that broke off the rest of this file, which is why the menu entry for the
   legal notice and privacy policy was missing from both pages. */
window.renderLegal = function () {
  const d = legalData();
  const links = [];
  const mk = (which, label) => {
    const url = d.urls[which];
    if (url) return `<a href="${esc(url)}" target="_blank" rel="noopener">${label}</a>`;
    if (d.name) return `<a href="#" data-legal-open="${which}">${label}</a>`;
    return '';
  };
  const i = mk('impressum', t('link_impressum'));
  const p = mk('datenschutz', t('link_datenschutz'));
  if (i) links.push(i);
  if (p) links.push(p);
  const foot = document.getElementById('legalLinks');
  if (foot) foot.innerHTML = links.length ? ' · ' + links.join(' · ') : '';
  const cont = document.getElementById('legalConfig');
  if (cont) {
    cont.innerHTML = `
      <div class="opt-section">${t('opt_legal')}</div>
      <button class="opt-btn" data-legal-act="settings">${t('legal_open_settings')}</button>`;
  }
};

/* ---------------- events ---------------- */
document.addEventListener('click', e => {
  const open = e.target.closest('[data-legal-open]');
  if (open) { e.preventDefault(); openLegalDoc(open.dataset.legalOpen); return; }
  const close = e.target.closest('[data-legal-close]');
  if (close) {
    e.preventDefault();
    const m = close.closest('.modal-overlay');
    if (m) m.classList.add('hidden');
    return;
  }
  const act = e.target.closest('[data-legal-act]');
  if (!act) return;
  e.preventDefault();
  switch (act.dataset.legalAct) {
    case 'settings':
      if (typeof optionsMenu !== 'undefined') optionsMenu.classList.add('hidden');
      openLegalSettings();
      break;
    case 'save': legalSave(); break;
    case 'preview-impressum': openLegalDoc('impressum', true); break;
    case 'preview-datenschutz': openLegalDoc('datenschutz', true); break;
    case 'snippet': legalSnippetOpen = !legalSnippetOpen; renderLegalSettings(); break;
  }
});
document.addEventListener('keydown', e => {
  if (e.key !== 'Escape') return;
  ['legalDocModal', 'legalSetModal'].forEach(id => {
    const m = document.getElementById(id);
    if (m) m.classList.add('hidden');
  });
});
/* The options menu stops propagation - hence a listener of its own there.

   Fetch the element directly rather than use the optionsMenu variable:
   app.js sets it while parsing, genshared.js (the droid and ship pages)
   only at DOMContentLoaded. Since this file runs earlier, it was still
   undefined there - the listener was never attached and the menu entry did
   nothing. */
const legalOptionsMenu = document.getElementById('optionsMenu');
if (legalOptionsMenu) {
  legalOptionsMenu.addEventListener('click', e => {
    const act = e.target.closest('[data-legal-act]');
    if (act && act.dataset.legalAct === 'settings') {
      legalOptionsMenu.classList.add('hidden');
      openLegalSettings();
    }
  });
}

/* The note under the legal-setting picker follows it at once. Only that one
   paragraph is rewritten, not the whole form - redrawing it would read the
   values back from storage and throw away everything typed but not saved. */
document.addEventListener('change', e => {
  if (!e.target || e.target.id !== 'lg_jurisdiction') return;
  const p = document.getElementById('lg_j_warn');
  if (p) p.innerHTML = legalJWarn(e.target.value);
});

/* ---------------- startup ---------------- */
(async function initLegal() {
  renderLegal();
  const url = (typeof SITE_CONFIG !== 'undefined' && SITE_CONFIG.apiUrl) || '';
  if (!url) return;
  if (location.protocol === 'file:' && !/^https?:/i.test(url)) return;
  try {
    const res = await fetch(url + '?action=legal_get');
    const data = await res.json();
    if (data && data.legal) {
      const o = legalEmpty();
      LEGAL_FIELDS.forEach(f => { if (data.legal[f]) o[f] = data.legal[f]; });
      if (data.legal.urls) {
        o.urls.impressum = data.legal.urls.impressum || '';
        o.urls.datenschutz = data.legal.urls.datenschutz || '';
      }
      o.updated = data.legal.updated || 0;
      legalServer = o;
      renderLegal();
    }
  } catch (e) { /* no server - the local details apply */ }
})();
