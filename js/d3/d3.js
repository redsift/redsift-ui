'use strict';

var tools = require('./tools.js');
var radialChart = require('./radialChart.js');

var reusable = {
  radialChart: radialChart
};

var D3 = {
  Tools: tools,
  Reusable: reusable
};

if (typeof module !== 'undefined' && module.exports) { module.exports = D3; } // CommonJs export
if (typeof define === 'function' && define.amd) { define([], function () { return D3; }); } // AMD