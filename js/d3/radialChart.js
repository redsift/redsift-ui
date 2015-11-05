/* global d3 */
'use strict';

var tools = require('./tools.js');

// Adapted from: http://bl.ocks.org/bricedev/8aaef92e64007f882267
// Uses Bostock's Reusable Chart Convention http://bost.ocks.org/mike/chart/ 
function radialChart() {
  var width = 300,
    height = width,
    labelDistance = 1.04,
    animationDelay = 0,
    animationSegmentDelay = 100,
    animationDuration = 1000,
    animation = "elastic",
    prefix = "",
    labelTicks = 3,
    minorTicks = 3,
    spokeOverhang = 15,
    labelOrient = "left",
    barHeight = height / 2,
    animationEnd = null,
    cpfx = 'd3-rc';

  var formatNumber = d3.format("s");

  function impl(selection) {
    selection.each(function(data) {
      var svg = tools.svgRoot(this, width, height);

      var g = svg.append("g")
        .attr('class', cpfx)
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

      var extent = [1, d3.max(data, function(d) {
        return d.value;
      })];
      var barScale = d3.scale.linear()
        .domain(extent)
        .range([0, barHeight]);

      var keys = data.map(function(d, i) {
        return d.name;
      });
      var numBars = keys.length;

      var x = d3.scale.linear()
        .domain(extent)
        .range([0, -barHeight]);

      g.append("circle")
        .attr("r", barHeight)
        .classed("outer-line", true);

      var circles = g.selectAll("circle")
        .data(x.ticks(minorTicks))
        .enter().append("circle")
        .attr("r", function(d) {
          return barScale(d);
        })
        .classed("tick-line", true);

      var arc = d3.svg.arc()
        .startAngle(function(d, i) {
          return (i * 2 * Math.PI) / numBars;
        })
        .endAngle(function(d, i) {
          return ((i + 1) * 2 * Math.PI) / numBars;
        })
        .innerRadius(0);

      var segments = g.selectAll("path")
        .data(data)
        .enter().append("path")
        .each(function(d) {
          d.outerRadius = 0;
        })
        .attr("d", arc)
        .attr('class', function(d) {
          return 'segment '+ (d.classed ? d.classed : '');
        })
        .style("fill", function(d) {
          return d.color;
        });

      if (animation) {
        //TODO: Does not work when null
        segments.transition().ease(animation).duration(animationDuration).delay(function(d, i) {
            return animationDelay + (i * animationSegmentDelay);
          })
          .attrTween("d", function(d, index) {
            var i = d3.interpolate(d.outerRadius, barScale(+d.value));
            return function(t) {
              d.outerRadius = i(t);
              return arc(d, index);
            };
          })
          .each("end", function() {
            if (animationEnd) {
              animationEnd();
            }
          });
      }

      var lines = g.selectAll("line")
        .data(keys)
        .enter().append("line")
        .attr("y2", -barHeight - spokeOverhang)
        .classed("spokes", true)
        .attr("transform", function(d, i) {
          return "rotate(" + (i * 360 / numBars) + ")";
        });

      var vals = g.append("g")
        .attr("class", "x axis label");

       var xAxis = d3.svg.axis()
        .scale(x).orient(labelOrient)
        .ticks(labelTicks)
        .tickFormat(function(v) {
          return prefix + formatNumber(v);
        });
      vals.call(xAxis);

      // Labels
      var labelRadius = barHeight * labelDistance;

      var labels = g.append("g")
        .attr("class", "segment-label label");

      labels.append("def")
        .append("path")
        .attr("id", "label-path")
        .attr("d", "m0 " + -labelRadius + " a" + labelRadius + " " + labelRadius + " 0 1,1 -0.01 0");

      labels.selectAll("text")
        .data(keys)
        .enter().append("text")
        .style("text-anchor", "middle")
        .append("textPath")
        .attr("xlink:href", "#label-path")
        .attr("startOffset", function(d, i) {
          return i * 100 / numBars + 50 / numBars + '%';
        })
        .text(function(d) {
          return d;
        });

    });
  }

  impl.width = function(value) {
    if (!arguments.length) return width;
    width = value;
    height = value;
    return impl;
  };

  impl.labelDistance = function(value) {
    if (!arguments.length) return labelDistance;
    labelDistance = value;
    return impl;
  };

  impl.animationEnd = function(value) {
    if (!arguments.length) return animationEnd;
    animationEnd = value;
    return impl;
  };
  
  impl.animation = function(value) {
    if (!arguments.length) return animation;
    animation = value;
    return impl;
  };

  impl.animationDelay = function(value) {
    if (!arguments.length) return animationDelay;
    animationDelay = value;
    return impl;
  };

  impl.animationSegmentDelay = function(value) {
    if (!arguments.length) return animationSegmentDelay;
    animationSegmentDelay = value;
    return impl;
  };

  impl.animationDuration = function(value) {
    if (!arguments.length) return animationDuration;
    animationDuration = value;
    return impl;
  };

  impl.prefix = function(value) {
    if (!arguments.length) return prefix;
    prefix = value;
    return impl;
  };

  impl.labelTicks = function(value) {
    if (!arguments.length) return labelTicks;
    labelTicks = value;
    return impl;
  };

  impl.minorTicks = function(value) {
    if (!arguments.length) return minorTicks;
    minorTicks = value;
    return impl;
  };

  impl.spokeOverhang = function(value) {
    if (!arguments.length) return spokeOverhang;
    spokeOverhang = value;
    return impl;
  };

  impl.labelOrient = function(value) {
    if (!arguments.length) return labelOrient;
    labelOrient = value;
    return impl;
  };

  return impl;
}

if (typeof module !== 'undefined' && module.exports) { module.exports = radialChart; } // CommonJs export
if (typeof define === 'function' && define.amd) { define([], function () { return radialChart; }); } // AMD