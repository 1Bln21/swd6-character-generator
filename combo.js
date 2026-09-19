/* =====================================================================
   Text fields with suggestions - a drop-down that looks like a select
   ---------------------------------------------------------------------
   For fields that take free text but offer a list: the home planet on the
   character sheet, the manufacturer on the droid sheet. These used a
   <datalist>, and a datalist's pop-up is drawn by the browser itself and
   ignores every style - on Windows a grey rounded box that looks nothing
   like the species list right next to it.

   So the list is drawn here instead, in the colours of a select. What the
   datalist was for stays: any text can be typed, and the list narrows down
   while typing - entries that START with the text first, then those that
   contain it.

   Usage: <input type="text" data-combo="planets"> plus a
   <datalist id="planets"> holding the options, as before - only the field
   points at it through data-combo instead of list, so the browser's own
   pop-up stays out of the way. Works through event delegation on the
   document, so views that rebuild themselves with innerHTML need nothing.
   ===================================================================== */
(function () {
'use strict';

let pop = null;        // the open list, a child of <body>
let field = null;      // the input it belongs to
let shown = [];        // the values currently listed
let active = -1;       // keyboard position in `shown`
let typed = false;     // filter only once something was typed since opening

function escHtml(s) {
  return String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
}
function optionsOf(inp) {
  const dl = document.getElementById(inp.dataset.combo);
  return dl ? [...dl.options].map(o => o.value).filter(Boolean) : [];
}
function close() {
  if (pop) pop.remove();
  pop = null; field = null; shown = []; active = -1;
}
/* Everything on opening - someone clicking into a filled field wants to see
   the alternatives, and a value from a template that is on no list ("Serv-O-")
   would otherwise leave nothing to show at all. Filtered once typing starts. */
function filtered(inp) {
  const all = optionsOf(inp);
  const q = inp.value.trim().toLowerCase();
  if (!typed || !q) return all;
  const starts = all.filter(v => v.toLowerCase().startsWith(q));
  const contains = all.filter(v => !v.toLowerCase().startsWith(q) && v.toLowerCase().includes(q));
  return starts.concat(contains);
}
/* Fixed to the viewport, under the field - or above it where the space
   below is too short. */
function place() {
  const r = field.getBoundingClientRect();
  const below = innerHeight - r.bottom - 8, above = r.top - 8;
  const up = below < 180 && above > below;
  const room = Math.max(120, Math.min(360, up ? above : below));
  pop.style.left = Math.max(4, r.left) + 'px';
  pop.style.minWidth = r.width + 'px';
  pop.style.maxHeight = room + 'px';
  pop.style.top = up ? '' : r.bottom + 'px';
  pop.style.bottom = up ? (innerHeight - r.top) + 'px' : '';
}
function render(inp) {
  if (field !== inp) { close(); field = inp; }
  shown = filtered(inp);
  if (!shown.length) { if (pop) pop.style.display = 'none'; return; }
  if (!pop) {
    pop = document.createElement('div');
    pop.className = 'combo-pop';
    pop.setAttribute('role', 'listbox');
    /* mousedown, not click: a click would first take the focus away from
       the field, and losing the focus closes the list. */
    pop.addEventListener('mousedown', e => {
      e.preventDefault();
      const it = e.target.closest('[data-i]');
      if (it) pick(+it.dataset.i);
    });
    document.body.appendChild(pop);
  }
  pop.style.display = '';
  const cur = inp.value;
  if (active >= shown.length) active = shown.length - 1;
  pop.innerHTML = shown.map((v, i) =>
    `<div class="combo-item${i === active ? ' active' : ''}${v === cur ? ' current' : ''}" role="option" data-i="${i}">${escHtml(v)}</div>`).join('');
  place();
  const mark = pop.querySelector('.active') || pop.querySelector('.current');
  if (mark) mark.scrollIntoView({ block: 'nearest' });
}
function pick(i) {
  if (!field || i < 0 || i >= shown.length) return;
  const inp = field;
  inp.value = shown[i];
  close();
  /* The pages save through their own input and change handlers - fire both,
     as typing would. */
  inp.dispatchEvent(new Event('input', { bubbles: true }));
  inp.dispatchEvent(new Event('change', { bubbles: true }));
}

document.addEventListener('focusin', e => {
  const inp = e.target.closest && e.target.closest('input[data-combo]');
  if (inp) { active = -1; typed = false; render(inp); }
  else if (pop && !pop.contains(e.target)) close();
});
document.addEventListener('focusout', e => {
  if (field && e.target === field) close();
});
document.addEventListener('input', e => {
  if (e.target.matches && e.target.matches('input[data-combo]') && e.isTrusted) { active = -1; typed = true; render(e.target); }
});
/* Clicking into a field that already has the focus opens the list again
   after Escape closed it. */
document.addEventListener('mousedown', e => {
  const inp = e.target.closest && e.target.closest('input[data-combo]');
  if (inp && document.activeElement === inp && !pop) { typed = false; render(inp); }
});
document.addEventListener('keydown', e => {
  const inp = e.target.closest && e.target.closest('input[data-combo]');
  if (!inp) return;
  if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
    if (!pop || pop.style.display === 'none') { render(inp); if (!shown.length) return; }
    e.preventDefault();
    const n = shown.length;
    active = e.key === 'ArrowDown' ? (active + 1) % n : (active <= 0 ? n - 1 : active - 1);
    render(inp);
  } else if (e.key === 'Enter' && pop && active >= 0) {
    e.preventDefault();
    pick(active);
  } else if (e.key === 'Escape' && pop) {
    e.preventDefault();
    close();
  } else if (e.key === 'Tab') {
    close();
  }
});
/* The list is fixed to the viewport, the field is not: when the page
   scrolls, the list would stay behind. Scrolling inside the list is fine. */
window.addEventListener('scroll', e => {
  if (pop && !(e.target instanceof Node && pop.contains(e.target))) close();
}, true);
window.addEventListener('resize', close);
})();
