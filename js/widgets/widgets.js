'use strict';

var sliders = require('./sliders.js');


var Widgets = {
  Sliders: sliders
};

if (typeof module !== 'undefined' && module.exports) { module.exports = Widgets; } // CommonJs export
if (typeof define === 'function' && define.amd) { define([], function () { return Widgets; }); } // AMD