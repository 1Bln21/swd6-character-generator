/* =====================================================================
   Catalogue search - shared by the character, droid and ship pages
   ---------------------------------------------------------------------
   The catalogues are indexed under the names the rulebooks print, and
   those are rarely the names people say. A Porax-38 is a "P-38" at the
   table, an Eta-2 Actis is an "E-2", and a Belbullab-22 is a "B-22".
   Typed that way the search used to come back empty, which looks exactly
   like "we do not have it".

   Two ways out, and the catalogues need both:

   1. A rule, for the many cases that follow one. A word of letters, a
      hyphen and a number also answers to its first letter plus that
      number. Measured over the ship catalogue the raw rule fires 84
      times but invents nonsense out of acronyms - AIC-4 would answer to
      "A-4", INT-66 to "I-66". Restricted to real words (a capital
      followed by lower case) 40 sensible short names remain.

      What slips through anyway - "Craft-4" becoming C-4, "Tank-1"
      becoming T-1 - only ever ADDS matches. Nothing can go missing
      through this, which is why the loose end is acceptable.

   2. A field, for the cases no rule will ever catch. Nicknames like
      "Chopper" have nothing in common with "C1-10P". An entry may carry
      an 'alias' - a string or a list - that the search reads along with
      the name. It is maintained by hand and survives an extraction run,
      the same way the rest of the catalogue does.
   ===================================================================== */
'use strict';

/* "Porax-38" -> ["p-38"]. Only real words, never acronyms. */
function catShort(txt) {
  return (String(txt).match(/[A-Z][a-z]{2,}-\d{1,3}/g) || [])
    .map(w => (w[0] + '-' + w.split('-')[1]).toLowerCase());
}

/* An alias may be written as one string or as a list of them. */
function catAlias(x) {
  const a = x && x.alias;
  if (!a) return '';
  return (Array.isArray(a) ? a.join(' ') : String(a));
}

/* Does this entry answer to what was typed? 'fields' names the columns
   worth searching - for a ship that is name and craft, for a droid name
   and type. 'f' is expected already trimmed and lower case; an empty
   search matches everything, which is what the cards want. */
function catMatch(x, f, fields) {
  if (!f) return true;
  for (let i = 0; i < fields.length; i++) {
    const v = x[fields[i]];
    if (v && String(v).toLowerCase().includes(f)) return true;
  }
  const alias = catAlias(x);
  if (alias && alias.toLowerCase().includes(f)) return true;
  const haystack = fields.map(k => x[k] || '').join(' ') + ' ' + alias;
  return catShort(haystack).some(k => k.includes(f));
}
