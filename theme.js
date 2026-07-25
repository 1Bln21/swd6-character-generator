/* =====================================================================
   Darstellungs-Themes (Dark / Light / OLED / Bespin)
   ---------------------------------------------------------------------
   Setzt data-theme am <html>-Element. Wird in <head> geladen, damit das
   Theme schon vor dem ersten Zeichnen steht (kein Aufblitzen). Die Farben
   selbst stehen als CSS-Variablen in style.css.
   ===================================================================== */
(function () {
  'use strict';
  var LS_THEME = 'swd6_theme';
  var THEMES = ['dark', 'light', 'oled', 'bespin'];
  function get() {
    try { var t = localStorage.getItem(LS_THEME); return THEMES.indexOf(t) >= 0 ? t : 'dark'; }
    catch (e) { return 'dark'; }
  }
  function apply(theme) {
    if (THEMES.indexOf(theme) < 0) theme = 'dark';
    document.documentElement.setAttribute('data-theme', theme);
    try { localStorage.setItem(LS_THEME, theme); } catch (e) {}
    var radios = document.querySelectorAll('input[name="themeOpt"]');
    for (var i = 0; i < radios.length; i++) radios[i].checked = (radios[i].value === theme);
  }
  /* Sofort anwenden (Skript steht im <head>, läuft vor dem Body) */
  document.documentElement.setAttribute('data-theme', get());
  window.setTheme = apply;
  window.currentTheme = get;
  document.addEventListener('DOMContentLoaded', function () {
    apply(get());
    var radios = document.querySelectorAll('input[name="themeOpt"]');
    for (var i = 0; i < radios.length; i++) {
      radios[i].addEventListener('change', function () { apply(this.value); });
    }
  });
})();
