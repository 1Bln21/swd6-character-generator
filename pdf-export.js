/* =====================================================================
   Echter PDF-Export der Bögen (jsPDF + html2canvas, beide offline).
   Jede .sheet-page wird als eigene A4-Seite gerendert – dadurch gibt es
   keine Umbrüche mitten in einem Abschnitt mehr. Fällt jsPDF/html2canvas
   aus (z. B. unvollständiger Upload), bleibt der normale Drucken-Weg.
   ===================================================================== */
'use strict';

async function exportSheetPdf(btn) {
  const jspdfNS = window.jspdf || window.jsPDF;
  if (!jspdfNS || typeof window.html2canvas !== 'function') {
    alert(typeof t === 'function' ? t('pdf_lib_missing') : 'PDF libraries not loaded.');
    return;
  }
  const JsPDF = jspdfNS.jsPDF || jspdfNS;
  if (typeof renderSheet === 'function') renderSheet();
  const host = document.getElementById('sheet-print');
  const pages = host ? host.querySelectorAll('.sheet-page') : [];
  if (!pages.length) return;

  const oldLabel = btn ? btn.textContent : '';
  if (btn) { btn.disabled = true; btn.textContent = (typeof t === 'function' ? t('pdf_working') : 'Creating PDF …'); }

  /* #sheet-print ist normalerweise display:none – zum Abfotografieren kurz
     sichtbar, aber weit außerhalb des Sichtfelds positionieren. */
  const prev = host.getAttribute('style') || '';
  host.style.cssText = 'display:block;position:fixed;left:-10000px;top:0;margin:0;background:#fff;z-index:-1';

  try {
    const pdf = new JsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' });
    const PW = 210, PH = 297;
    /* Browser begrenzen Canvas-Flächen (je Seite rund 16.000 Pixel). Ein voll
       ausgefüllter Bogen mal Faktor 2 lief darüber – html2canvas gab dann eine
       Fläche der Größe 0 zurück und der Export brach mit „Index or size is
       negative or greater than the allowed amount“ ab. Deshalb den Faktor an
       die tatsächliche Bogengröße anpassen, statt ihn fest zu setzen. */
    const MAX_PX = 8000;
    let added = 0;
    for (let i = 0; i < pages.length; i++) {
      const el = pages[i];
      const rect = el.getBoundingClientRect();
      const w = Math.max(1, Math.ceil(el.scrollWidth || rect.width));
      const h0 = Math.max(1, Math.ceil(el.scrollHeight || rect.height));
      let scale = Math.min(2, MAX_PX / w, MAX_PX / h0);
      if (!isFinite(scale) || scale <= 0) scale = 1;

      const canvas = await window.html2canvas(el, {
        scale: scale, backgroundColor: '#ffffff', useCORS: true, logging: false,
        windowWidth: w, windowHeight: h0,
      });
      /* Leere Seite oder gescheiterte Aufnahme lieber überspringen, als den
         ganzen Export zu verlieren. */
      if (!canvas || !canvas.width || !canvas.height) continue;

      const img = canvas.toDataURL('image/jpeg', 0.92);
      if (added > 0) pdf.addPage();
      /* Seitenfüllend einpassen, ohne das Seitenverhältnis zu verzerren. */
      let dw = PW, dh = canvas.height * PW / canvas.width;
      if (dh > PH) { dh = PH; dw = canvas.width * PH / canvas.height; }
      pdf.addImage(img, 'JPEG', (PW - dw) / 2, 0, dw, dh);
      added++;
    }
    if (!added) throw new Error(typeof t === 'function' ? t('pdf_empty') : 'Nothing to export.');
    let name = 'sheet';
    try { name = (C.info && (C.info.name || C.info.craft)) || (typeof PAGE_DOC_KIND !== 'undefined' ? PAGE_DOC_KIND : 'sheet'); } catch (e) {}
    name = String(name || 'sheet').replace(/[^\wäöüÄÖÜß \-]/g, '_').trim() || 'sheet';
    pdf.save(name + '.pdf');
  } catch (e) {
    alert((typeof t === 'function' ? t('pdf_error') : 'PDF export failed: ') + e.message);
  } finally {
    host.setAttribute('style', prev);
    if (btn) { btn.disabled = false; btn.textContent = oldLabel; }
  }
}

document.addEventListener('DOMContentLoaded', function () {
  const b = document.getElementById('btnPdf');
  if (b) b.addEventListener('click', function () { exportSheetPdf(b); });
});
