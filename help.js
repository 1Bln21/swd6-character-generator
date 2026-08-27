/* =====================================================================
   Help - one section per area of the page you are standing on.
   ---------------------------------------------------------------------
   Loaded by every page after its own script, so the dictionary T and the
   helpers t() and esc() already exist. Which page this is comes from
   HELP_PAGE, which each page sets for itself; a page that does not set it
   gets no help button rather than the wrong text.

   The language follows the setting like everything else. The texts are NOT
   in the pages' T blocks: they are long, they belong together, and keeping
   them here means a section can be rewritten without touching the code
   around it.
   ===================================================================== */
'use strict';

Object.assign(T.de, {
  help_open: '❓ Hilfe', help_title: 'Hilfe',
  help_intro: 'Kurz erklärt, was die Bereiche dieser Seite tun. Die Sprache folgt der Einstellung im Zahnradmenü.',
  help_close: 'Schließen',
});
Object.assign(T.en, {
  help_open: '❓ Help', help_title: 'Help',
  help_intro: 'A short word on what the areas of this page do. The language follows the setting in the gear menu.',
  help_close: 'Close',
});

/* Per page a list of [heading, text]. The heading is a key from the page's
   own dictionary wherever one exists - then it says exactly what the tab
   above says, in whichever language is set. */
const HELP_TEXT = {
  char: {
    de: [
      ['tab_info', 'Name, Spezies, Vorlage und das Bild. Die Spezies setzt die Grenzen der Attribute und bringt eigene Fähigkeiten mit; eine Vorlage füllt den ganzen Bogen auf einmal. Das Bild lässt sich per Datei oder Adresse einsetzen – gespeichert wird nur das Bild, nie die Adresse.'],
      ['tab_attrs', 'Die sechs Attribute. Bei der Erschaffung wird ein Würfelvorrat verteilt, der Rest kostet Charakterpunkte. Über den Grenzen der Spezies wird gewarnt, blockiert aber nichts – am Tisch entscheidet die Spielleitung.'],
      ['tab_skills', 'Fertigkeiten hängen an ihrem Attribut und beginnen bei dessen Wert. Spezialisierungen stehen eingerückt darunter. Erweiterte Fertigkeiten (mit „(A)") starten bei 1D, kosten doppelt und brauchen ihre Voraussetzung.'],
      ['tab_force', 'Nur für machtsensitive Charaktere: Control, Sense und Alter, dazu die Machtfähigkeiten. Bei jeder steht, was sie verlangt; fehlt eine Voraussetzung, wird es angezeigt, ohne die Wahl zu verbieten.'],
      ['tab_equip', 'Ausrüstung aus den Katalogen der Quellenbände, mit Menge und Preis. Eigene Einträge lassen sich frei anlegen. Was hier steht, taucht auf dem Bogen und in der Kreditrechnung auf.'],
      ['tab_weapons', 'Nahkampf, Fernkampf, Sprengstoffe – und die Lichtschwert-Werkstatt. Dort wird aus Waffentyp, Kristallen und Einbauten ein eigenes Lichtschwert gebaut; der Schaden folgt den Kristallen.'],
      ['tab_armor', 'Rüstung wirkt erst, wenn sie angehakt ist. Zwei Rüstungen, die denselben Körperbereich abdecken, lassen sich nicht zugleich tragen. Der Widerstand auf dem Bogen rechnet Stärke plus getragene Rüstung.'],
      ['tab_credits', 'Verdientes Geld, sonstige Ausgaben und Schulden. Was Ausrüstung, Waffen und Rüstung kosten, wird automatisch abgezogen – unten steht, was übrig bleibt.'],
      ['tab_sheet', 'Der fertige Bogen. „Drucken" nutzt den Browser-Dialog (dort „Als PDF speichern"), „PDF" schreibt echten Text ins PDF statt eines Bildes – der lässt sich durchsuchen und ausfüllen.'],
    ],
    en: [
      ['tab_info', 'Name, species, template and the picture. The species sets the attribute limits and brings its own abilities; a template fills the whole sheet at once. The picture can come from a file or an address - only the picture is stored, never the address.'],
      ['tab_attrs', 'The six attributes. At creation you spread a pool of dice; anything beyond that costs character points. Going past the species limits is flagged but never blocked - at the table the GM decides.'],
      ['tab_skills', 'Skills hang off their attribute and start at its value. Specialisations sit indented below. Advanced skills (marked "(A)") start at 1D, cost double, and need their prerequisite.'],
      ['tab_force', 'For Force-sensitive characters only: Control, Sense and Alter, plus the Force powers. Each says what it requires; a missing requirement is shown without forbidding the choice.'],
      ['tab_equip', 'Equipment from the sourcebook catalogues, with quantity and price. Your own entries can be added freely. What stands here appears on the sheet and in the credit account.'],
      ['tab_weapons', 'Melee, ranged, explosives - and the lightsaber workshop. There a weapon type, crystals and fittings make a lightsaber of your own; the damage follows the crystals.'],
      ['tab_armor', 'Armor only counts once it is ticked as worn. Two pieces covering the same body area cannot be worn at once. The resistance on the sheet is Strength plus the armor being worn.'],
      ['tab_credits', 'Money earned, other spending and debts. What equipment, weapons and armor cost is subtracted automatically - the bottom line is what is left.'],
      ['tab_sheet', 'The finished sheet. "Print" uses the browser dialog (choose "Save as PDF" there); "PDF" writes real text into the PDF instead of a picture, so it can be searched and filled in.'],
    ],
  },
  droid: {
    de: [
      ['tab_model', 'Bezeichnung, Grad, Hersteller und Fortbewegung. Eine Vorlage aus den Sammelbänden füllt Werte und Modifikationen auf einmal. Beschreibung, Geschichte, Persönlichkeit, Ziele und Notizen stehen alle auf dem Bogen.'],
      ['tab_attrs', 'Die sechs Attribute aus dem Startpool. Der Grad des Droiden gibt vor, wie viel zur Verfügung steht.'],
      ['tab_skills', 'Wie beim Charakter, dazu die Datenbank-Fertigkeiten des Droidengehirns.'],
      ['tab_mods', 'Alles, was eingebaut ist. Ab Werk kostet Pips aus dem Startpool, später eingebaut kostet Charakterpunkte. Panzerung und Schilde aus diesem Bereich ergeben den Schadenswiderstand, der oben in der Zeile und auf dem Bogen steht.'],
      ['tab_gear', 'Mitgeführte Ausrüstung und Waffen, dazu das Credits-Konto. Was hier gekauft wird, kostet Geld – im Gegensatz zu den Modifikationen ab Werk.'],
      ['tab_sheet', 'Der Droidenbogen, wie beim Charakter mit Druck und PDF-Export.'],
    ],
    en: [
      ['tab_model', 'Designation, degree, manufacturer and locomotion. A template from the compendia fills values and modifications at once. Description, history, personality, objectives and notes all appear on the sheet.'],
      ['tab_attrs', 'The six attributes out of the starting pool. The droid degree decides how much there is to spend.'],
      ['tab_skills', 'As on the character page, plus the droid brain’s database skills.'],
      ['tab_mods', 'Everything built in. Fitted at the factory costs pips from the starting pool; fitted later costs character points. Armor and shields from this tab make up the damage resistance shown in the line above and on the sheet.'],
      ['tab_gear', 'Equipment and weapons carried, plus the credit account. What is bought here costs money - unlike the modifications fitted at the factory.'],
      ['tab_sheet', 'The droid sheet, with printing and PDF export as on the character page.'],
    ],
  },
  ship: {
    de: [
      ['tab_ship', 'Grunddaten: Modell, Größenklasse, Antrieb, Hülle, Schilde, Fracht. Eine Vorlage aus den Katalogen füllt alles auf einmal – knapp tausend Schiffe und Fahrzeuge stehen zur Wahl.'],
      ['tab_weapons', 'Bewaffnung mit Skala, Feuerwinkel, Feuerkontrolle, Schaden und Reichweiten. Aus dem Katalog übernommene Waffen bleiben danach frei änderbar. Ab Werk verbaute Waffen kosten keine Frachtkapazität, nachgerüstete schon.'],
      ['tab_crew', 'Sensorreichweiten, Besatzung und die Fertigkeiten der NSC-Crew.'],
      ['tab_mods', 'Umbauten in Prozent des Schiffswerts, dazu Ersatzteile: Antrieb, Hyperantrieb, Schildgenerator, Manövriertriebwerke. Jeder Umbau erhöht den Pannen-Modifikator und kostet Gewicht.'],
      ['tab_shop', 'Allgemeine Einbauten und Frachtabteile mit Preis und Gewicht, sowie eigene Posten.'],
      ['tab_sheet', 'Der Schiffsbogen mit den effektiven Werten nach allen Umbauten.'],
    ],
    en: [
      ['tab_ship', 'The basics: model, scale, drive, hull, shields, cargo. A template from the catalogues fills it all at once - close to a thousand ships and vehicles to pick from.'],
      ['tab_weapons', 'Armament with scale, fire arc, fire control, damage and ranges. A weapon taken from the catalogue stays editable afterwards. Factory-fitted guns cost no cargo capacity; retrofitted ones do.'],
      ['tab_crew', 'Sensor ranges, crew, and the skills of the NPC crew.'],
      ['tab_mods', 'Modifications as a percentage of the ship’s value, plus replacement parts: drive, hyperdrive, shield generator, maneuver thrusters. Every modification raises the mishap modifier and costs weight.'],
      ['tab_shop', 'General fittings and cargo compartments with price and weight, plus entries of your own.'],
      ['tab_sheet', 'The ship sheet with the effective values after all modifications.'],
    ],
  },
  npc: {
    de: [
      ['tab_setup', 'Erzeugt ganze Gruppen von Nichtspielerfiguren: Fraktion, Erfahrung, Anzahl. Die Werte, Ausrüstung und Beute werden ausgewürfelt, lassen sich aber nachbessern.'],
      ['tab_sheet', 'Die fertigen Karten der Gruppe, zum Drucken oder als PDF.'],
    ],
    en: [
      ['tab_setup', 'Builds whole groups of non-player figures: faction, experience, headcount. Stats, equipment and loot are rolled, and can be adjusted afterwards.'],
      ['tab_sheet', 'The finished cards for the group, for printing or as a PDF.'],
    ],
  },
  dice: {
    de: [
      ['free_roll', 'Freier Wurf: Würfelzahl, Pips und Modifikator eingeben. Der Wild Die ist standardmäßig an – er explodiert bei einer 6 und bedeutet bei einer 1 eine Komplikation.'],
      ['from_char', 'Würfelt direkt auf ein Attribut oder eine Fertigkeit des zuletzt gespeicherten Bogens. Charakter, Droide und Schiff bringen jeweils ihre eigenen Pools mit.'],
      ['from_gear', 'Ausrüstung mit Würfelbonus lässt sich anhaken; der Bonus wird auf den Pool addiert.'],
    ],
    en: [
      ['free_roll', 'A free roll: enter dice, pips and a modifier. The Wild Die is on by default - it explodes on a 6 and means a complication on a 1.'],
      ['from_char', 'Rolls straight against an attribute or skill from the sheet you last saved. Character, droid and ship each bring their own pools.'],
      ['from_gear', 'Equipment that grants dice can be ticked; the bonus is added to the pool.'],
    ],
  },
  vtt: {
    de: [
      ['gate_title', 'Der Spieltisch gehört immer zu einer Spielrunde. Anmelden und Runden anlegen oder beitreten geht über den ☁-Knopf oben – von hier aus, eine Generatorseite braucht es nicht mehr.'],
      ['gm_title', 'Nur für die Spielleitung: Karte hochladen und umschalten, Raster einstellen und die Dunkelheit für Tag und Nacht. Die Verdunkelung gilt für alle und legt sich auch über bereits erkundetes Gelände; die Marken bleiben sichtbar.'],
      ['fog_title', 'Der Nebel kennt drei Zustände: unerkundet (schwarz), erkundet (Gelände sichtbar, Marken darin verborgen) und im Blick (alles sichtbar). Verborgene Marken erreichen den Spieler gar nicht – sie stehen nicht in der Antwort des Servers. Die eigene Marke sieht man immer.'],
      ['tok_title', 'Marken entstehen aus den Bildern der eigenen Bögen oder als schlichte Scheibe. Ziehen bewegt sie – und die Richtung, in die gezogen wurde, ist auch die Blickrichtung. Auf der Stelle drehen: Umschalt halten und ziehen, oder lange gedrückt halten. Ein Umschalt-Klick ohne Drehen nimmt den Sichtkegel weg. Doppelklick entfernt die Marke.'],
      ['roll_title', 'Würfeln am Tisch: entweder frei oder direkt auf eine Fertigkeit des eigenen Bogens, samt Ausrüstungsbonus. Jeder Wurf erscheint für alle kurz auf der Karte und steht im Protokoll.'],
      ['au_title', 'Hintergrundmusik der Spielleitung: eine hochgeladene MP3 oder eine YouTube-Playlist. Alle hören dasselbe an derselben Stelle; bei YouTube spielt jeder Browser selbst ab.'],
      ['call_title', 'Sprache und Bild über WebRTC, jeder mit jedem. Trägt etwa fünf bis sechs Teilnehmer. Die Medien laufen nicht über den Server dieser Seite.'],
      ['log_title', 'Alle Würfe der Runde in der Reihenfolge, in der sie gefallen sind.'],
    ],
    en: [
      ['gate_title', 'The table always belongs to a game round. Signing in and creating or joining a round happens under the ☁ button up top - right here, no generator page needed any more.'],
      ['gm_title', 'For the GM only: upload and switch maps, set the grid, and set the darkness for day and night. The dimming applies to everyone and lies over explored ground as well; the tokens stay visible.'],
      ['fog_title', 'The fog has three states: unexplored (black), explored (terrain visible, tokens inside hidden) and in sight (everything visible). Hidden tokens never reach the player at all - they are not in the server’s answer. Your own token is always visible to you.'],
      ['tok_title', 'Tokens are made from the pictures on your own sheets, or drawn as a plain disc. Dragging moves them - and the way they went is the way they look. To turn one where it stands: hold shift and drag, or press and hold. A shift click without turning takes the cone off. A double click removes the token.'],
      ['roll_title', 'Rolling at the table: freely, or straight against a skill from your own sheet including the gear bonus. Every roll appears briefly on the map for everyone and goes into the log.'],
      ['au_title', 'Background music from the GM: an uploaded MP3 or a YouTube playlist. Everyone hears the same thing at the same place; with YouTube each browser plays it itself.'],
      ['call_title', 'Voice and video over WebRTC, everyone with everyone. Carries about five or six people. The media do not travel through this site’s server.'],
      ['log_title', 'Every roll of the round, in the order they were made.'],
    ],
  },
};

function helpModal() {
  let m = document.getElementById('helpModal');
  if (!m) {
    m = document.createElement('div');
    m.id = 'helpModal';
    m.className = 'modal-overlay no-print hidden';
    m.innerHTML = '<div class="modal-box" id="helpBox"></div>';
    document.body.appendChild(m);
    m.addEventListener('click', e => { if (e.target === m) closeHelp(); });
  }
  return m;
}
function closeHelp() {
  const m = document.getElementById('helpModal');
  if (m) m.classList.add('hidden');
}
window.renderHelp = function renderHelp() {
  const box = document.getElementById('helpBox');
  if (!box) return;
  const seite = (typeof HELP_PAGE !== 'undefined') ? HELP_PAGE : '';
  const satz = (HELP_TEXT[seite] || {})[typeof LANG !== 'undefined' ? LANG : 'en']
            || (HELP_TEXT[seite] || {}).en || [];
  box.innerHTML = `
    <div class="modal-head"><h2>${t('help_title')}</h2>
      <button class="mini" data-help="close">✕</button></div>
    <p class="hint">${t('help_intro')}</p>
    ${satz.map(([k, txt]) =>
      `<h3>${esc(t(k))}</h3><p>${esc(txt)}</p>`).join('')}
    <p style="text-align:center; margin-top:10px">
      <button class="accent" data-help="close">${t('help_close')}</button></p>`;
};
function openHelp() { helpModal().classList.remove('hidden'); renderHelp(); }

document.addEventListener('click', e => {
  const el = e.target.closest('[data-help]');
  if (el && el.dataset.help === 'close') closeHelp();
});
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeHelp(); });

(function wireHelp() {
  const b = document.getElementById('btnHelp');
  if (!b) return;
  /* A page that names no area gets no button rather than empty help. */
  if (typeof HELP_PAGE === 'undefined' || !HELP_TEXT[HELP_PAGE]) {
    b.classList.add('hidden');
    return;
  }
  b.addEventListener('click', () => {
    const om = document.getElementById('optionsMenu');
    if (om) om.classList.add('hidden');
    openHelp();
  });
})();
