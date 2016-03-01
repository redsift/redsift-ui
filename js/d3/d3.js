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
  Components: components,
  Constants: {
      Patterns: {
        crosshatch1: { ang: 45, w: 4, h: 4, s: 5 },
        crosshatch2: { ang: 45, w: 3, h: 4, s: 5 }, 
        crosshatch3: { ang: 45, w: 3, h: 3, s: 5 },   
        diagonal1: { ang: 30, w: 5, h: 4, s: 5 }, 
        diagonal2: { ang: 30, w: 5, h: 3, s: 5 }, 
        diagonal3: { ang: 30, w: 5, h: 2, s: 5 },
        blocks: { ang: 0, w: 3, h: 4, s: 5 },
        redsift: { ang: 30, w: 3, h: 3, s: 5 },   
    }
  }
};

if (typeof module !== 'undefined' && module.exports) { module.exports = D3; } // CommonJs export
if (typeof define === 'function' && define.amd) { define([], function () { return D3; }); } // AMD