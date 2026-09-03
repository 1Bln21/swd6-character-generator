/* =====================================================================
   Site configuration for hosting
   =====================================================================
   If you host the generator publicly, enter the URLs of your legal
   notice (Impressum) and privacy policy here. They will be shown to
   ALL visitors in the footer and in the ⚙ options menu.

   Example:
     impressumUrl:   'https://my-site.example/impressum.html',
     datenschutzUrl: 'https://my-site.example/datenschutz.html',

   Leave empty ('') to hide a link (e.g. for purely local use).
   ===================================================================== */
const SITE_CONFIG = {
  impressumUrl: '',
  datenschutzUrl: '',

  /* Details for the BUILT-IN legal notice / privacy pages. Easiest via the
     ⚙ menu under "Legal notice & privacy"; with a PHP server they are
     stored in api/data/legal.json and apply to all visitors. Without PHP,
     paste them here - the same dialog generates this snippet for you at the
     press of a button. */
  legal: {
    name: '',
    street: '',
    zip: '',
    city: '',
    country: '',
    email: '',
    phone: '',
    responsible: '',
    vatId: '',
    provider: '',
    providerAddress: '',
    /* Under whose law the site is run - NOT the postal country above.
         'de'    Germany: the legal notice cites § 5 DDG and § 18 (2) MStV
         'eu'    another EU/EEA country: same information, no citation,
                 because the duty comes from a directive each country
                 implemented for itself
         'other' outside the EU/EEA: as 'eu', and be aware that the privacy
                 policy is written for the GDPR and will not fit
       Empty counts as 'de'. The privacy policy itself needs no variant
       inside the EU/EEA: the GDPR is a regulation and applies directly. */
    jurisdiction: '',
    urls: { impressum: '', datenschutz: '' },
  },

  /* Online accounts (user + password + MFA, cloud storage, sharing).
     When hosting with the bundled api/ folder (PHP + SQLite) just leave
     this as it is - the app detects the server automatically. If the API
     lives elsewhere, enter the full URL. '' = online features off. */
  apiUrl: 'api/index.php',
};
