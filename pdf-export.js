/* =====================================================================
   PDF export of the sheets - real text instead of a screenshot.
   ---------------------------------------------------------------------
   Up to v3.7.x every .sheet-page was photographed with html2canvas and put
   into the PDF as an image. That looked exactly like the screen but was a
   heap of pixels: nothing selectable, nothing searchable, not editable in
   Acrobat or PDF-XChange, and large files besides - and depending on the
   sheet's height the canvas could burst the browser's limits ("Index or
   size is negative or greater than the allowed amount").

   Now a painter walks the finished sheet structure and puts lines, boxes
   and text straight into the PDF. It works generically off the sheets'
   sp- classes, so it covers character, droid, ship and NPC alike, and stays
   in step automatically when a sheet changes.

   The built-in jsPDF fonts do not carry the check mark, arrow or star -
   those are substituted. Umlauts work (WinAnsi), so no font file has to be
   shipped.
   ===================================================================== */
'use strict';

/* Characters the standard fonts do not carry.

   When jsPDF meets a character the built-in font does not know, it switches
   the whole line to UTF-16. What then stands in the finished PDF is not the
   character you wanted but the entire line as gibberish with little boxes
   in between - which is how the wound table's tick box and the typographic
   minus used to disfigure every sheet. */
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
    /* Safety net: anything not caught above that falls outside WinAnsi is
       dropped. Better a missing special character than a wrecked line.
       Umlauts and the euro sign are part of WinAnsi and stay. */
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
    const M = 12, PW = 210, PH = 297, CW = PW - 2 * M;   // margin and text width
    const COL = CW / 12;                                  // the sheets are laid out on 12 columns
    let y = M;

    const seite = () => pdf.internal.getCurrentPageInfo().pageNumber;
    /* Make room. In a multi-column layout several columns cross the same
       page boundary one after another; each may then only move to the next
       page, not start one of its own - otherwise every column gets a blank
       sheet to itself. */
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
    /* Wrap text to a width and set it line by line. */
    const put = (txt, x, size, style, grey, maxW) => {
      const s = pdfText(txt);
      if (!s) return 0;
      setFont(size, style, grey);
      const lines = pdf.splitTextToSize(s, maxW || (CW - (x - M)));
      lines.forEach(l => { need(size * 0.42 + 1); pdf.text(l, x, y + size * 0.35); y += size * 0.42 + 1; });
      return lines.length;
    };

    /* ---- building blocks of the sheets ---- */
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
      /* Frame and heading only when the box stayed on one page - otherwise
         the frame would be drawn across half the sheet. */
      if (seite() !== startSeite) { y += 3; return; }
      pdf.setDrawColor(60);
      pdf.setLineWidth(0.35);
      pdf.rect(x0, startY, width, y - startY);
      /* The heading last: on the sheet it sits as a black bar on the box's
         edge, and the bar has to lie on top of the frame. */
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
      /* Tight leading on purpose: the sheet is figured for one A4 page. At
         4.4 mm per skill a character with many skills overran, and the last
         two boxes ended up alone on a second sheet. */
      y += 3.7;
    }

    /* Attribute heading: name on the left, dice value on the right, a rule
       beneath - as on the sheet. Without handling of its own it fell into
       the catch-all branch, which draws the plain text only: "Dexterity 2D"
       came out as "Dexterity2D", and for a character with no skills all six
       attributes were stuck together on a single line. */
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
      /* Distribute column widths by content. Equal columns forced the wound
         table's effect column to wrap while "0 - 3" took up a third of the
         line beside it. Each column now gets what its widest entry needs -
         capped, so one long note cannot crush the rest. */
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
        /* Wrap every cell first: a note like "Easy Business roll is
           required for repairs" does not fit in one column. Only the first
           line used to be set and the rest was dropped - notes broke off
           mid-sentence. The tallest cell decides the row height. */
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
        /* The rule belongs below the baseline, not through the letters. */
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

    /* Side by side instead of stacked.

       The sheet sets its blocks in columns: the six attributes in three,
       equipment and weapons in two, and in the header the portrait stands
       beside the personal details. The painter did not know these
       containers, walked straight into them and stacked everything - one
       page became four, and with the layout went the overview.

       Drawing goes column by column from the same top edge; afterwards the
       pen stands below the longest one. */
    function drawColumns(node, x0, width, breiten) {
      const kinder = Array.prototype.slice.call(node.children);
      if (kinder.length < 2) { walk(node, x0, width); return; }
      const luecke = 3;
      const rest = width - luecke * (kinder.length - 1);
      const w = breiten || kinder.map(() => rest / kinder.length);
      /* Every column starts on the same page at the same top edge.
         Afterwards the pen stands where the longest column ended - even
         when that one reached past the page boundary. */
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

    /* A row the sheet sets side by side */
    function istFlexZeile(el) {
      return /display\s*:\s*flex/i.test(el.getAttribute('style') || '');
    }

    /* Walks a node's children and handles what it recognises. */
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
        /* On the sheet the footer sticks to the bottom edge. Carried along
           in the flow here, it pushed a brim-full page over the edge - and
           landed as the only line on a sheet of its own. So it is placed
           firmly at the bottom, with no page break. */
        const merk = y;
        setFont(6, 'italic', true);
        pdf.text(pdfText(el.textContent), x0, PH - M + 3.5);
        y = merk;
        return;
      }
      if (el.tagName === 'TABLE') { drawTable(el, x0, width); return; }
      if (drawStats(el, x0, width)) return;
      /* take the sheet's column layout over */
      if (cl.contains('sp-cols3') || cl.contains('sp-cols2')) {
        drawColumns(el, x0, width); return;
      }
      if (istFlexZeile(el)) {
        /* In the header the portrait stands to the right of the personal
           details at a fixed width; otherwise the columns come out equal. */
        const bild = el.querySelector(':scope > .sp-portrait');
        if (bild && el.children.length === 2) {
          drawColumns(el, x0, width, [width - 37, 34]);
        } else {
          drawColumns(el, x0, width);
        }
        return;
      }
      /* Only descend further when something structured lies below.
         Otherwise a line like "<b>Loot:</b> 310 credits ..." would draw only
         the <b> and lose the text behind it - which is exactly what happened
         on the NPC cards. */
      const strukturiert = el.querySelector(
        '.sp-grid, .sp-box, .sp-skill, .sp-attr, .sp-stat, .sp-portrait, .sp-header, .sp-footer, table');
      if (strukturiert) { walk(el, x0, width); return; }
      put(el.textContent, x0, 7.6, 'normal', false, width);
    }

    for (let p = 0; p < pages.length; p++) {
      if (p > 0) {
        /* After a multi-column stretch the pen can stand on an earlier
           page; the next sheet page still belongs at the end. */
        pdf.setPage(pdf.internal.getNumberOfPages());
        pdf.addPage();
        y = M;
      }
      walk(pages[p], M, CW);
    }

    /* Throw away blank sheets at the end. A sheet whose last box falls
       exactly on the edge leaves behind a started page that was never drawn
       on. */
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
