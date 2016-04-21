'use strict';

var webp = require('./webp.js');

var FeatureDetection = {
  webp: webp
};

if (typeof module !== 'undefined' && module.exports) { module.exports = FeatureDetection; } // CommonJs export
if (typeof define === 'function' && define.amd) { define([], function () { return FeatureDetection; }); } // AMD
