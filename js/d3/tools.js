'use strict';

var Tools = {
  svgRoot: function (parent, width, height) {
    var svg = d3.select(parent).append("svg")
          .attr("version", "1.1")
          .attr("xmlns", "http://www.w3.org/2000/svg")
          .attr("width", width)
          .attr("height", height);
    
    // d3 work around
    svg.node().setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns:xlink", "http://www.w3.org/1999/xlink");
    
    return svg;
  },
  createShadowFilter: function (defs, fname, morphRadius, shadowColour, blurRadius, padding) {
    if (morphRadius === undefined) {
      morphRadius = 1;
    }
    if (shadowColour === undefined) {
      shadowColour = 'rgba(230,230,230,0.6)';
    }
  
    if (blurRadius === undefined) {
      blurRadius = 1.1;
    }
  
    if (padding === undefined) {
      padding = "10px";
    }
  
    var filter = defs
      .append("filter")
      .attr("id", fname)
      .attr("x", "-" + padding)
      .attr("y", "-" + padding)
      .attr("width", "120")
      .attr("height", "120");
  
    filter.append("feMorphology")
      .attr('operator', 'dilate')
      .attr('radius', morphRadius)
      .attr('in', 'SourceAlpha')
      .attr('result', 'TEMPLATE');
  
    filter.append('feFlood')
      .attr('flood-color', shadowColour)
      .attr('result', 'COLOUR');
  
    filter.append('feComposite')
      .attr('in', "COLOUR")
      .attr('in2', "TEMPLATE")
      .attr('operator', "in")
      .attr('result', 'TEMPLATE_COLOUR');
  
    filter.append('feGaussianBlur')
      .attr('stdDeviation', blurRadius)
      .attr('result', 'BG');
  
    var merge = filter.append('feMerge');
    merge.append('feMergeNode').attr('in', "BG");
    merge.append('feMergeNode').attr('in', "SourceGraphic");
  }
};

if (typeof module !== 'undefined' && module.exports) { module.exports = Tools; } // CommonJs export
if (typeof define === 'function' && define.amd) { define([], function () { return Tools; }); } // AMD

/*
var bg = defs
        .append("filter")
        .attr("id", "bg-hash");

      var pattern = "data:image/svg+xml;charset=utf-8,%3Csvg%20version%3D%221.1%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20xmlns%3Axlink%3D%22http%3A%2F%2Fwww.w3.org%2F1999%2Fxlink%22%20width%3D%22100px%22%20height%3D%22200px%22%20%20%3E%0A%09%3Cdefs%3E%0A%09%09%3Cpattern%20id%3D%22pattern%22%20patternUnits%3D%22userSpaceOnUse%22%20width%3D%2210%22%20height%3D%2210%22%3E%0A%0A%09%09%09%3Cpath%20fill%3D%22%23FFFFFF%22%20d%3D%22M0%2C8.239V10h1.761L0%2C8.239z%22%2F%3E%0A%09%09%09%3Cpath%20fill%3D%22%23FFFFFF%22%20d%3D%22M5%2C0l5%2C5l0%2C0V3.238L6.762%2C0H5z%22%2F%3E%0A%09%09%09%3Cpolygon%20fill%3D%22%23FFFFFF%22%20points%3D%220%2C3.239%200%2C5%205%2C10%206.761%2C10%20%22%2F%3E%0A%09%09%09%3Cpolygon%20fill%3D%22%23FFFFFF%22%20points%3D%221.762%2C0%200%2C0%2010%2C10%2010%2C8.238%20%22%2F%3E%0A%09%09%3C%2Fpattern%3E%0A%09%3C%2Fdefs%3E%0A%09%3Crect%20x%3D%220%22%20y%3D%220%22%20width%3D%22100%25%22%20height%3D%22100%25%22%20fill%3D%22url(%23pattern)%22%20%2F%3E%0A%3C%2Fsvg%3E";

      pattern = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iNjAiIGhlaWdodD0iMzAiPgo8ZGVmcz4KPHJlY3QgaWQ9InIiIHdpZHRoPSIzMCIgaGVpZ2h0PSIxNSIgZmlsbD0iI2JiMDg1ZiIgc3Ryb2tlLXdpZHRoPSIyLjUiIHN0cm9rZT0iIzdhMDU0ZCI+PC9yZWN0Pgo8ZyBpZD0icCI+Cjx1c2UgeGxpbms6aHJlZj0iI3IiPjwvdXNlPgo8dXNlIHk9IjE1IiB4bGluazpocmVmPSIjciI+PC91c2U+Cjx1c2UgeT0iMzAiIHhsaW5rOmhyZWY9IiNyIj48L3VzZT4KPHVzZSB5PSI0NSIgeGxpbms6aHJlZj0iI3IiPjwvdXNlPgo8L2c+CjwvZGVmcz4KPHVzZSB4bGluazpocmVmPSIjcCIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMCAtMjUpIHNrZXdZKDQwKSI+PC91c2U+Cjx1c2UgeGxpbms6aHJlZj0iI3AiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDMwIDApIHNrZXdZKC00MCkiPjwvdXNlPgo8L3N2Zz4=";

      bg.append('feImage')
        .attr("xlink:href", pattern)
        .attr('x', '0')
        .attr('y', '1')
        .attr('width', '60')
        .attr('height', '30')
        .attr('result', 'BG');

      bg.append('feTile')
        .attr('in', 'BG')
        .attr('result', 'BG_T');

      bg.append('feFlood')
        .attr('flood-color', "rgba(0,230,230,0.6)")
        .attr('result', 'COLOUR');

      bg.append('feComposite')
        .attr('in', "BG_T")
        .attr('in2', "SourceAlpha")
        .attr('operator', "in")
        .attr('result', 'BG_T_A');

      bg.append('feComposite')
        .attr('in', "COLOUR")
        .attr('in2', "BG_T_A")
        .attr('operator', "in")
        .attr('result', 'OUT');
      */
