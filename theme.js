/* =====================================================================
   Colour themes (Dark / Light / OLED / Bespin)
   ---------------------------------------------------------------------
   Sets data-theme on the <html> element. Loaded from <head> so the theme
   is in place before the first paint (no flash of the wrong colours). The
   colours themselves live as CSS variables in style.css.
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
  /* Apply at once (this script sits in <head> and runs before the body) */
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
