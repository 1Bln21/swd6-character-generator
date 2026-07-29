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
    for (let i = 0; i < pages.length; i++) {
      const canvas = await window.html2canvas(pages[i], {
        scale: 2, backgroundColor: '#ffffff', useCORS: true, logging: false,
        windowWidth: pages[i].scrollWidth, windowHeight: pages[i].scrollHeight,
      });
      const img = canvas.toDataURL('image/jpeg', 0.92);
      if (i > 0) pdf.addPage();
      let h = canvas.height * PW / canvas.width;   // Breite = A4, Höhe proportional
      if (h > PH) h = PH;                          // Sicherheitskappe auf eine Seite
      pdf.addImage(img, 'JPEG', 0, 0, PW, h);
    }
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
