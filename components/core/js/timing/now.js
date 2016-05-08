'use strict';

var Timing = {
  now: function() {
    var performance = window.performance;
    if (performance === undefined) {
      this.now = function() {
        return new Date().getTime();
      }
    } else {
      if (performance.now) {
        this.now = function() { return performance.now();}
      } else if (performance.webkitNow) {
        this.now = function() { return performance.webkitNow();}
      } else if (performance.msNow) {
        this.now = function() { return performance.msNow();}
      } else if (performance.oNow) {
        this.now = function() { return performance.oNow();}
      } else if (performance.mozNow) {
        this.now = function() { return performance.mozNow();}
      } else {
        throw new Error('unknown window.performance impl');
      }
    }
  
    return this.now();
  }
};

if (typeof module !== 'undefined' && module.exports) { module.exports = Timing; } // CommonJs export
if (typeof define === 'function' && define.amd) { define([], function () { return Timing; }); } // AMD
  