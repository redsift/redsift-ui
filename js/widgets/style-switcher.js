'use strict';

function useTheme(title) {
  var themes = document.getElementsByTagName('link');
  for (var idx = 0; idx < themes.length; idx++) {
    var theme = themes[idx];

    if ((theme.rel.indexOf('stylesheet') != -1) && theme.title) {
      theme.disabled = true;
      if (theme.title == title) {
          theme.disabled = false;
      }
    }
  }
}

var StyleSwitcher = {
  use: useTheme
}

if (typeof module !== 'undefined' && module.exports) { module.exports = StyleSwitcher; } // CommonJs export
if (typeof define === 'function' && define.amd) { define([], function () { return StyleSwitcher; }); } // AMD
