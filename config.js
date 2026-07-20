/* =====================================================================
   Site-Konfiguration für das Hosting / Site configuration for hosting
   =====================================================================
   Wer den Generator öffentlich hostet, trägt hier die Links zu
   Impressum und Datenschutzerklärung ein. Sie erscheinen dann für
   ALLE Besucher unten im Footer und im ⚙-Optionsmenü.

   If you host the generator publicly, enter the URLs of your legal
   notice (Impressum) and privacy policy here. They will be shown to
   ALL visitors in the footer and in the ⚙ options menu.

   Beispiel / Example:
     impressumUrl:   'https://meine-seite.de/impressum.html',
     datenschutzUrl: 'https://meine-seite.de/datenschutz.html',

   Leer lassen ('') = Link wird nicht angezeigt (z. B. bei rein
   lokaler Nutzung). / Leave empty ('') to hide a link (e.g. for
   purely local use).
   ===================================================================== */
const SITE_CONFIG = {
  impressumUrl: '',
  datenschutzUrl: '',

  /* Online-Konten (User + Passwort + MFA, Cloud-Speicherung, Freigaben).
     Beim Hosting mit dem mitgelieferten api/-Ordner (PHP + SQLite) einfach
     so lassen – die App erkennt den Server automatisch. Liegt die API
     woanders, hier die volle URL eintragen. '' = Online-Funktionen aus.
     /
     Online accounts (user + password + MFA, cloud storage, sharing).
     When hosting with the bundled api/ folder (PHP + SQLite) just leave
     as is – the app detects the server automatically. If the API lives
     elsewhere, enter the full URL. '' = online features off. */
  apiUrl: 'api/index.php',
};
