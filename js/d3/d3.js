'use strict';

var components = require('./components.js');
var tools = require('./tools.js');
var radialChart = require('./radialChart.js');
var legendChart = require('./legendChart.js');

var reusable = {
  radialChart: radialChart,
  legendChart: legendChart
};

var D3 = {
  Tools: tools,
  Reusable: reusable,
  Components: components
};

if (typeof module !== 'undefined' && module.exports) { module.exports = D3; } // CommonJs export
if (typeof define === 'function' && define.amd) { define([], function () { return D3; }); } // AMD