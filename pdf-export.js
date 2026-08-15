/* =====================================================================
   PDF-Export der Bögen – echter Text statt Bildschirmfoto.
   ---------------------------------------------------------------------
   Bis v3.7.x wurde jede .sheet-page mit html2canvas abfotografiert und als
   Bild ins PDF gelegt. Das sah exakt aus wie am Bildschirm, war aber ein
   Pixelhaufen: nichts auswählbar, nichts durchsuchbar, in Acrobat oder
   PDF-XChange nicht zu bearbeiten, dazu große Dateien – und die Canvas-Fläche
   konnte je nach Bogenhöhe die Grenzen des Browsers sprengen („Index or size
   is negative or greater than the allowed amount“).

   Jetzt läuft ein Zeichner die fertige Bogen-Struktur ab und setzt Linien,
   Kästen und Textzeilen direkt ins PDF. Er arbeitet generisch über die
   sp-Klassen der Bögen, gilt damit für Charakter, Droide, Schiff und NPC
   gleichermaßen und bleibt automatisch synchron, wenn ein Bogen sich ändert.

   Die eingebauten jsPDF-Schriften kennen ✔ ↳ ★ nicht – die werden ersetzt.
   Umlaute funktionieren (WinAnsi), eine mitgelieferte Schriftdatei ist
   deshalb nicht nötig.
   ===================================================================== */
'use strict';

/* Zeichen, die die Standardschriften nicht fuehren.

   Trifft jsPDF auf ein Zeichen, das die eingebaute Schrift nicht kennt,
   schaltet es fuer die ganze Zeile auf UTF-16 um. Im fertigen PDF steht dann
   nicht das gewuenschte Zeichen, sondern die ganze Zeile als Buchstabensalat
   mit Kaestchen dazwischen - so verunstalteten das Ankreuzkaestchen der
   Wundtabelle und das typografische Minus bisher jeden Bogen. */
function pdfText(s) {
  return String(s == null ? '' : s)
    .replace(/[✔✓]/g, 'OK')
    .replace(/[↳➜→]/g, '>')
    .replace(/[★☆*]/g, '*')
    .replace(/[☐□]/g, '[ ]')
    .replace(/[☑☒]/g, '[X]')
    .replace(/[–—−]/g, '-')
    .replace(/[„“”]/g, '"')
    .replace(/[‚‘’]/g, "'")
    .replace(/…/g, '...')
    .replace(/×/g, 'x')
    .replace(/ /g, ' ')
    /* Auffangnetz: Was oben nicht erfasst wurde und ausserhalb von WinAnsi
       liegt, faellt weg. Lieber ein fehlendes Sonderzeichen als eine
       zerschossene Zeile. Umlaute und Euro gehoeren zu WinAnsi und bleiben. */
    .replace(/[^\x20-\xff\u20ac\u201a\u0192\u201e\u2026\u2020\u2021\u02c6\u2030\u0160\u2039\u0152\u017d\u2018\u2019\u201c\u201d\u2022\u2013\u2014\u02dc\u2122\u0161\u203a\u0153\u017e\u0178]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

async function exportSheetPdf(btn) {
  const jspdfNS = window.jspdf || window.jsPDF;
  if (!jspdfNS) {
    alert(typeof t === 'function' ? t('pdf_lib_missing') : 'PDF library not loaded.');
    return;
  }
  const JsPDF = jspdfNS.jsPDF || jspdfNS;
  if (typeof renderSheet === 'function') renderSheet();
  const host = document.getElementById('sheet-print');
  const pages = host ? host.querySelectorAll('.sheet-page') : [];
  if (!pages.length) return;

  const oldLabel = btn ? btn.textContent : '';
  if (btn) { btn.disabled = true; btn.textContent = (typeof t === 'function' ? t('pdf_working') : 'Creating PDF …'); }

  try {
    const pdf = new JsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' });
    const M = 12, PW = 210, PH = 297, CW = PW - 2 * M;   // Rand und Satzbreite
    const COL = CW / 12;                                  // die Bögen rastern in 12 Spalten
    let y = M;

    const seite = () => pdf.internal.getCurrentPageInfo().pageNumber;
    /* Platz schaffen. Beim Spaltensatz laufen mehrere Spalten nacheinander
       über dieselbe Seitengrenze; jede darf dann nur auf die nächste Seite
       wechseln, nicht eine eigene anlegen - sonst bekommt jede Spalte ihr
       eigenes leeres Blatt. */
    const need = h => {
      if (y + h <= PH - M) return;
      if (seite() < pdf.internal.getNumberOfPages()) pdf.setPage(seite() + 1);
      else pdf.addPage();
      y = M;
    };
    const setFont = (size, style, grey) => {
      pdf.setFont('helvetica', style || 'normal');
      pdf.setFontSize(size);
      pdf.setTextColor(grey ? 110 : 20);
    };
    /* Text auf eine Breite umbrechen und zeilenweise setzen. */
    const put = (txt, x, size, style, grey, maxW) => {
      const s = pdfText(txt);
      if (!s) return 0;
      setFont(size, style, grey);
      const lines = pdf.splitTextToSize(s, maxW || (CW - (x - M)));
      lines.forEach(l => { need(size * 0.42 + 1); pdf.text(l, x, y + size * 0.35); y += size * 0.42 + 1; });
      return lines.length;
    };

    /* ---- Bausteine der Bögen ---- */
    function drawFields(grid, x0, width) {
      const cols = Math.max(1, Math.round(width / COL));
      let used = 0, rowTop = y, rowH = 0;
      const fields = grid.querySelectorAll(':scope > .sp-field');
      fields.forEach(f => {
        const span = Math.min(cols, Math.max(1, parseInt(
          (f.getAttribute('style') || '').replace(/.*span\s*(\d+).*/, '$1'), 10) || 3));
        if (used + span > cols) { used = 0; rowTop += rowH; y = rowTop; rowH = 0; }
        const w = span * (width / cols) - 2;
        const x = x0 + used * (width / cols);
        const lbl = f.querySelector('.lbl'), val = f.querySelector('.val');
        need(11);
        const top = rowTop;
        setFont(5.6, 'normal', true);
        pdf.text(pdfText(lbl ? lbl.textContent : ''), x, top + 3);
        setFont(8.6, 'bold');
        const lines = pdf.splitTextToSize(pdfText(val ? val.textContent : ''), w);
        lines.slice(0, 3).forEach((l, n) => pdf.text(l, x, top + 7 + n * 3.4));
        const h = 8 + Math.min(3, lines.length) * 3.2 - 3.2;
        pdf.setDrawColor(190);
        pdf.line(x, top + h + 1.2, x + w, top + h + 1.2);
        rowH = Math.max(rowH, h + 2.4);
        used += span;
        y = top;
      });
      y = rowTop + rowH;
    }

    function drawBox(box, x0, width) {
      const head = box.querySelector(':scope > h4');
      const title = head ? pdfText(head.textContent) : '';
      const startY = y + 2, startSeite = seite();
      y = startY + (title ? 6.5 : 3);
      walk(box, x0 + 2.5, width - 5, head);
      y += 2;
      /* Rahmen und Überschrift nur, wenn der Kasten auf einer Seite blieb -
         sonst zöge der Rahmen quer über das halbe Blatt. */
      if (seite() !== startSeite) { y += 3; return; }
      pdf.setDrawColor(60);
      pdf.setLineWidth(0.35);
      pdf.rect(x0, startY, width, y - startY);
      /* Die Überschrift zuletzt: Auf dem Bogen sitzt sie als schwarzer Balken
         auf dem Kastenrand, und der Balken muss über dem Rahmen liegen. */
      if (title) {
        pdf.setFillColor(20);
        pdf.rect(x0, startY, width, 6, 'F');
        setFont(7.4, 'bold');
        pdf.setTextColor(255);
        pdf.text(title.toUpperCase(), x0 + 2.5, startY + 4.3);
        pdf.setTextColor(20);
      }
      y += 3;
    }

    function drawStats(row, x0, width) {
      const stats = row.querySelectorAll('.sp-stat');
      if (!stats.length) return false;
      need(13);
      const w = width / stats.length;
      stats.forEach((st, n) => {
        const big = st.querySelector('.big'), lbl = st.querySelector('.lbl');
        setFont(13, 'bold');
        pdf.text(pdfText(big ? big.textContent : ''), x0 + w * n + w / 2, y + 5, { align: 'center' });
        setFont(5.8, 'normal', true);
        pdf.text(pdfText(lbl ? lbl.textContent : ''), x0 + w * n + w / 2, y + 9, { align: 'center' });
      });
      y += 10.5;
      return true;
    }

    function drawSkill(el, x0, width) {
      const parts = el.querySelectorAll('span');
      const left = pdfText(parts[0] ? parts[0].textContent : '');
      const right = pdfText(parts[1] ? parts[1].textContent : '');
      need(5);
      setFont(8, 'normal');
      pdf.text(left, x0, y + 2.8);
      setFont(8, 'bold');
      pdf.text(right, x0 + width, y + 2.8, { align: 'right' });
      /* Enger Zeilenabstand mit Absicht: Der Bogen ist auf eine A4-Seite
         gerechnet. Bei 4,4 mm je Fertigkeit lief ein Charakter mit vielen
         Fertigkeiten über, und die letzten zwei Kästen landeten allein auf
         einem zweiten Blatt. */
      y += 3.7;
    }

    /* Attributüberschrift: links der Name, rechts der Würfelwert, darunter ein
       Strich – wie auf dem Bogen. Ohne eigene Behandlung landete sie im
       Auffangzweig, der nur den reinen Text zeichnet: aus „Dexterity 2D“ wurde
       „Dexterity2D“, und bei einem Charakter ohne Fertigkeiten klebten alle
       sechs Attribute in einer einzigen Zeile aneinander. */
    function drawAttrHead(el, x0, width) {
      const parts = el.querySelectorAll('span');
      need(7);
      setFont(8.8, 'bold');
      pdf.text(pdfText(parts[0] ? parts[0].textContent : ''), x0, y + 3.2);
      pdf.text(pdfText(parts[1] ? parts[1].textContent : ''), x0 + width, y + 3.2, { align: 'right' });
      y += 4.3;
      pdf.setDrawColor(60);
      pdf.setLineWidth(0.35);
      pdf.line(x0, y - 0.6, x0 + width, y - 0.6);
      y += 0.8;
    }

    function drawTable(tbl, x0, width) {
      const rows = tbl.querySelectorAll('tr');
      const schrift = c => {
        const kopf = c.tagName === 'TH';
        setFont(kopf ? 6 : 7.6, kopf ? 'bold' : 'normal', kopf);
      };
      /* Spaltenbreiten nach Inhalt verteilen. Gleich breite Spalten zwangen
         die Wirkungsspalte der Wundtabelle in den Umbruch, während daneben
         "0 - 3" ein Drittel der Zeile belegte. Jede Spalte bekommt jetzt so
         viel, wie ihr breitester Eintrag braucht - gedeckelt, damit eine
         lange Notiz die übrigen nicht erdrückt. */
      const spalten = Math.max(1, ...Array.prototype.map.call(
        rows, r => r.querySelectorAll('th, td').length));
      const wunsch = new Array(spalten).fill(5);
      Array.prototype.forEach.call(rows, r => {
        Array.prototype.forEach.call(r.querySelectorAll('th, td'), (c, i) => {
          schrift(c);
          const breit = pdf.getTextWidth(pdfText(c.textContent)) + 2.5;
          wunsch[i] = Math.max(wunsch[i], Math.min(breit, width * 0.45));
        });
      });
      const summe = wunsch.reduce((a, b) => a + b, 0);
      const breiten = wunsch.map(x => x / summe * width);
      const links = breiten.map((_, i) => breiten.slice(0, i).reduce((a, b) => a + b, 0));

      rows.forEach((tr, ri) => {
        const cells = tr.querySelectorAll('th, td');
        if (!cells.length) return;
        /* Erst alle Zellen umbrechen: Eine Notiz wie "Easy Business roll is
           required for repairs" passt nicht in eine Spalte. Bisher wurde nur
           die erste Zeile gesetzt und der Rest fiel weg - Notizen brachen
           mitten im Satz ab. Die höchste Zelle bestimmt die Zeilenhöhe. */
        const inhalte = Array.prototype.map.call(cells, (c, i) => {
          schrift(c);
          return pdf.splitTextToSize(pdfText(c.textContent), breiten[i] - 1.5).slice(0, 4);
        });
        const zeilen = Math.max(1, ...inhalte.map(l => l.length));
        need(zeilen * 3.2 + 2);
        inhalte.forEach((lines, ci) => {
          schrift(cells[ci]);
          lines.forEach((l, n) => pdf.text(l, x0 + links[ci], y + 2.8 + n * 3.2));
        });
        y += (zeilen - 1) * 3.2 + 3.8;
        /* Der Strich gehört unter die Grundlinie, nicht in die Buchstaben. */
        if (ri === 0) { pdf.setDrawColor(200); pdf.line(x0, y - 0.6, x0 + width, y - 0.6); }
      });
      y += 1.5;
    }

    function drawPortrait(el, x0, width) {
      const img = el.querySelector('img');
      if (!img || !img.getAttribute('src')) return;
      const src = img.getAttribute('src');
      if (!/^data:image\/(png|jpe?g|webp)/i.test(src)) return;
      const w = Math.min(38, width), nw = img.naturalWidth || 4, nh = img.naturalHeight || 3;
      const h = w * nh / nw;
      need(h + 2);
      try { pdf.addImage(src, /png/i.test(src) ? 'PNG' : 'JPEG', x0, y, w, h); } catch (e) {}
      y += h + 2;
    }

    /* Nebeneinander statt untereinander.

       Der Bogen setzt seine Blöcke in Spalten: die sechs Attribute in drei,
       Ausrüstung und Waffen in zwei, und im Kopf steht das Bild neben den
       Personalien. Der Zeichner kannte diese Behälter nicht, lief einfach
       hinein und stapelte alles untereinander - aus einer Seite wurden vier,
       und mit dem Layout ging die Übersicht verloren.

       Gezeichnet wird Spalte für Spalte vom selben oberen Rand aus; danach
       steht der Stift unter der längsten. */
    function drawColumns(node, x0, width, breiten) {
      const kinder = Array.prototype.slice.call(node.children);
      if (kinder.length < 2) { walk(node, x0, width); return; }
      const luecke = 3;
      const rest = width - luecke * (kinder.length - 1);
      const w = breiten || kinder.map(() => rest / kinder.length);
      /* Jede Spalte beginnt auf derselben Seite am selben oberen Rand.
         Danach steht der Stift dort, wo die längste Spalte geendet hat -
         auch wenn die über die Seitengrenze hinausgereicht hat. */
      const startSeite = seite(), oben = y;
      let endSeite = startSeite, unten = y, x = x0;
      kinder.forEach((k, i) => {
        pdf.setPage(startSeite);
        y = oben;
        drawNode(k, x, w[i]);
        if (seite() > endSeite || (seite() === endSeite && y > unten)) {
          endSeite = seite();
          unten = y;
        }
        x += w[i] + luecke;
      });
      pdf.setPage(endSeite);
      y = unten;
    }

    /* Eine Zeile, die im Bogen nebeneinander gesetzt ist */
    function istFlexZeile(el) {
      return /display\s*:\s*flex/i.test(el.getAttribute('style') || '');
    }

    /* Läuft die Kinder eines Knotens ab und behandelt, was er kennt. */
    function walk(node, x0, width, skip) {
      Array.prototype.forEach.call(node.children, el => {
        if (el !== skip) drawNode(el, x0, width);
      });
    }

    function drawNode(el, x0, width) {
      const cl = el.classList;
      if (cl.contains('sp-header')) {
        const sw = el.querySelector('.sw'), st = el.querySelector('.st');
        need(14);
        setFont(17, 'bold');
        pdf.text(pdfText(sw ? sw.textContent : 'STAR WARS'), x0 + width / 2, y + 6, { align: 'center' });
        setFont(8, 'normal', true);
        pdf.text(pdfText(st ? st.textContent : ''), x0 + width / 2, y + 11, { align: 'center' });
        y += 15;
        pdf.setDrawColor(60); pdf.line(x0, y, x0 + width, y); y += 3;
        return;
      }
      if (cl.contains('sp-grid')) { drawFields(el, x0, width); return; }
      if (cl.contains('sp-box')) { drawBox(el, x0, width); return; }
      if (cl.contains('sp-portrait')) { drawPortrait(el, x0, width); return; }
      if (cl.contains('sp-skill')) { drawSkill(el, x0, width); return; }
      if (cl.contains('ah')) { drawAttrHead(el, x0, width); return; }
      if (cl.contains('sp-attr')) { walk(el, x0, width); return; }
      if (cl.contains('sp-footer')) {
        /* Auf dem Bogen klebt die Fußzeile am unteren Blattrand. Lief sie hier
           im Fluss mit, drückte sie eine randvolle Seite über die Kante - und
           landete als einzige Zeile auf einem eigenen Blatt. Sie wird deshalb
           fest unten gesetzt, ohne Umbruch. */
        const merk = y;
        setFont(6, 'italic', true);
        pdf.text(pdfText(el.textContent), x0, PH - M + 3.5);
        y = merk;
        return;
      }
      if (el.tagName === 'TABLE') { drawTable(el, x0, width); return; }
      if (drawStats(el, x0, width)) return;
      /* Spaltensatz des Bogens übernehmen */
      if (cl.contains('sp-cols3') || cl.contains('sp-cols2')) {
        drawColumns(el, x0, width); return;
      }
      if (istFlexZeile(el)) {
        /* Im Kopf steht das Bild rechts neben den Personalien und hat eine
           feste Breite; sonst werden die Spalten gleich breit. */
        const bild = el.querySelector(':scope > .sp-portrait');
        if (bild && el.children.length === 2) {
          drawColumns(el, x0, width, [width - 37, 34]);
        } else {
          drawColumns(el, x0, width);
        }
        return;
      }
      /* Nur weiter absteigen, wenn darunter noch etwas Strukturiertes liegt.
         Sonst würde eine Zeile wie „<b>Beute:</b> 310 Credits …“ nur das <b>
         zeichnen und den Text dahinter verlieren – genau das passierte auf
         den NPC-Karten. */
      const strukturiert = el.querySelector(
        '.sp-grid, .sp-box, .sp-skill, .sp-attr, .sp-stat, .sp-portrait, .sp-header, .sp-footer, table');
      if (strukturiert) { walk(el, x0, width); return; }
      put(el.textContent, x0, 7.6, 'normal', false, width);
    }

    for (let p = 0; p < pages.length; p++) {
      if (p > 0) {
        /* Nach mehrspaltigem Satz kann der Stift auf einer früheren Seite
           stehen; die nächste Bogenseite gehört trotzdem ans Ende. */
        pdf.setPage(pdf.internal.getNumberOfPages());
        pdf.addPage();
        y = M;
      }
      walk(pages[p], M, CW);
    }

    /* Leere Blätter am Ende wegwerfen. Ein Bogen, dessen letzter Kasten genau
       auf die Kante fällt, lässt eine angefangene Seite zurück, auf der nie
       etwas gezeichnet wurde. */
    for (let n = pdf.internal.getNumberOfPages(); n > 1; n--) {
      const inhalt = (pdf.internal.pages[n] || []).join('');
      if (/\(.+\) Tj|\bre\b|\bDo\b/.test(inhalt)) break;
      pdf.deletePage(n);
    }

    let name = 'sheet';
    try { name = (C.info && (C.info.name || C.info.craft)) || (typeof PAGE_DOC_KIND !== 'undefined' ? PAGE_DOC_KIND : 'sheet'); } catch (e) {}
    name = String(name || 'sheet').replace(/[^\wäöüÄÖÜß \-]/g, '_').trim() || 'sheet';
    pdf.save(name + '.pdf');
  } catch (e) {
    alert((typeof t === 'function' ? t('pdf_error') : 'PDF export failed: ') + e.message);
  } finally {
    if (btn) { btn.disabled = false; btn.textContent = oldLabel; }
  }
}

document.addEventListener('DOMContentLoaded', function () {
  const b = document.getElementById('btnPdf');
  if (b) b.addEventListener('click', function () { exportSheetPdf(b); });
});
