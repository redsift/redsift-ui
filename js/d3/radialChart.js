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
    animationDuration = tools.redsiftDuration(),
    animation = tools.redsiftEasing(),
    prefix = "",
    labelTicks = 3,
    minorTicks = 3,
    spokeOverhang = 15,
    labelOrient = "left",
    barHeight = height / 2,
    animationEnd = null,
    cpfx = 'd3-rc',
    band = null,
    bandLabel = null,
    inset = 0;

  var formatNumber = d3.format(".0f");

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
      
      var lines = g.selectAll("line")
        .data(keys)
        .enter().append("line")
        .attr("y2", -barHeight - spokeOverhang)
        .classed("spokes", true)
        .attr("transform", function(d, i) {
          return "rotate(" + (i * 360 / numBars) + ")";
        });

      g.selectAll(".segment-bg")
        .data(data)
        .enter()
        .append("path")
        .attr("class", "segment-bg")
        .each(function(d) {
          d.outerRadius = barHeight + (2*spokeOverhang);
        })
        .attr("d", arc)
        .on('mouseover', function(d, i) {
            var t = prefix + formatNumber(d.value);
            g.select("#segment-label-" + i).classed('hover', true).text(t);
        })
        .on("mouseout",function(d, i) {
            var t = keys[i];
            g.select("#segment-label-" + i).classed('hover', false).text(t);
        });
      
      var segments = g.selectAll(".segment")
        .data(data)
        .enter()
        .append("path")
        .each(function(d) {
          d.outerRadius = 0;
        })
        .attr("d", arc)
        .attr('class', function(d) {
          return 'segment '+ (d.classed ? d.classed : '');
        })
        .style("fill", function(d) {
          if (typeof(d.color) === 'function') return d.color();
          
          return d.color;
        });
        
                      
      segments.append("title")
        .attr('class', 'tooltip')
        .text(function(d) { return prefix + formatNumber(d.value); });
      
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

      if (band) {
        var bnd = g.append("g")
                .attr('class', "band");
        
        bnd.append("circle")
          .attr("r", band);
        var l = bandLabel;
        if (l == null) 
        {
          l = prefix + formatNumber(band);
        }  
        
        var bandRadius = band - inset;
        
        bnd.append("def")
          .append("path")
          .attr("id", "band-path")
          .attr("d", "m0 " + bandRadius + " a" + bandRadius + " " + bandRadius + " 0 1,0 -0.01 0");
        
        var bl = bnd.append("text")
          .attr("class", "label overlayed")
          .style("text-anchor", "start")
          .append("textPath")
          .attr("xlink:href", "#band-path")
          .text(l);
      }  
      


      g.append("circle")
        .attr("r", barHeight)
        .classed("outer-line", true);

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
        .attr("id", function(d, i) { return "segment-label-" + i; })
        .attr("xlink:href", "#label-path")
        .attr("startOffset", function(d, i) {
          return i * 100 / numBars + 50 / numBars + '%';
        })
        .text(function(d) {
          return d;
        });

    });
  }

  impl.band = function(value, label, i) {
    if (!arguments.length) return band;
    band = value;
    bandLabel = label;
    inset = i;
    return impl;
  };

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