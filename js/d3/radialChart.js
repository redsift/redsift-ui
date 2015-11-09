/* global d3 */
/* global d3 */
'use strict';

var tools = require('./tools.js');

var index = 0;

// Adapted from: http://bl.ocks.org/bricedev/8aaef92e64007f882267
// Uses Bostock's Reusable Chart Convention http://bost.ocks.org/mike/chart/ 
function radialChart() {
  var inst = index++;
  
  var width = 300,
    height = width,
    labelDistance = 8,
    animationDelay = 0,
    animationSegmentDelay = 100,
    animationDuration = tools.redsiftDuration(),
    animation = tools.redsiftEasing(),
    prefix = "",
    labelTicks = 3,
    minorTicks = 3,
    spokeOverhang = 15,
    labelOrient = "left",
    animationEnd = null,
    cpfx = 'd3-rc',
    band = null,
    bandLabel = null,
    inset = 0;

  var formatNumber = d3.format(".0f");

  function impl(selection) {
    var barHeight = (height / 2) - 30;
    var labelRadius = barHeight + labelDistance;
          
    selection.each(function(data) {
      var svg = d3.select(this).select('svg');
      var g = null;
      var labels = null;
      
      var create = false;
      if (svg.empty()) {
        create = true;
        svg = tools.svgRoot(this, width, height);
        g = svg.append("g")
          .attr('class', cpfx)
          .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
          
      } else {
        g = svg.select('.'+cpfx);
        labels = g.select('.segment-label');
      }
      

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
            var t = d.valueText;
            if (t === undefined) {
              t = prefix + formatNumber(d.value);
            } else if (typeof t === 'function') {
              t = t();
            }
            g.select("#segment-label-" + i).classed('hover', true).text(t);
        })
        .on("mouseout",function(d, i) {
            var t = keys[i];
            g.select("#segment-label-" + i).classed('hover', false).text(t);
        });
      
      var bind = g.selectAll(".segment")
        .data(data);
      
      // update
      bind.attr("class", "update");  
      
      // enter / new
      bind.enter()
        .append("path")
        .attr('class', 'segment');
        
      bind.each(function(d) {
          if (animation) {
            if (d.animateFrom !== undefined) {
              d.outerRadius = barScale(d.animateFrom);
            } else {
              d.outerRadius = 0;
            }
          } else {
            d.outerRadius = barScale(d.value);
          }
        })
        .attr("d", arc)
        .attr('class', function(d) {
          return 'segment '+ (d.classed ? d.classed : '');
        })
        .style("fill", function(d) {
          if (typeof d.color === 'function') return d.color();
          
          return d.color;
        });
      
      // exit
      bind.exit().remove();
      
      if (animation) {
        bind.transition().ease(animation).duration(animationDuration).delay(function(d, i) {
            return animationDelay + (i * animationSegmentDelay);
          })
          .attrTween("d", function(d, index) {
            var i = d3.interpolate(d.outerRadius, barScale(d.value));
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
      if (band != null) {
        var pth = null;
        var bl = null;
        var crc = null;
        if (create) {
          var bnd = g.append("g")
                .attr('class', "band");
          crc = bnd.append("circle");
          
          pth = bnd.append("def")
            .append("path")
            .attr("id", "band-path-"+inst);
          
          bl = bnd.append("text")
            .attr("class", "label overlayed")
            .style("text-anchor", "start")
            .append("textPath")
            .attr("xlink:href", "#band-path-"+inst);
        } else {
          var bnd = g.select('.band');
          
          crc = bnd.select('circle');
          pth = bnd.select('#band-path-'+inst);
          bl = bnd.select('textPath');
        }
        
        var bandScaled = barScale(band);
        function setBand() {
          var bandRadius = bandScaled - inset;
          pth.attr("d", "m0 " + bandRadius + " a" + bandRadius + " " + bandRadius + " 0 1,0 -0.01 0");
  
          var l = bandLabel;
          if (l == null) 
          {
            l = prefix + formatNumber(band);
          }          
          bl.text(l);
        }
        
        if (animation) {
          bl.text('');
          crc.transition().ease(animation).duration(animationDuration).attr("r", bandScaled)
            .each("end", setBand);
        } else {
            crc.attr("r", bandScaled);
            setBand();     
        }
      }  
      
      var vals = null;
      if (create) {
        g.append("circle")
          .attr("r", barHeight)
          .classed("outer-line", true);
        
        vals = g.append("g")
          .attr("class", "x axis label");
      } else {
        vals = g.select('.x');
      }

      var xAxis = d3.svg.axis()
        .scale(x).orient(labelOrient)
        .ticks(labelTicks)
        .tickFormat(function(v) {
          return prefix + formatNumber(v);
        });
        
      if (animation) {
        vals = vals.transition().ease(animation).duration(animationDuration);
      }
        
      vals.call(xAxis);

      // Labels
      var def = null;
      if (labels == null) {
        labels = g.append("g")
          .attr("class", "segment-label label");
      
        def = labels.append("def")
          .append("path")
          .attr("id", "label-path-"+inst)
      } else {
        def = labels.select('#label-path-'+inst);
      }

      def.attr("d", "m0 " + -labelRadius + " a" + labelRadius + " " + labelRadius + " 0 1,1 -0.01 0");
      
      labels.selectAll("text")
        .data(keys)
        .enter().append("text")
        .style("text-anchor", "middle")
        .append("textPath")
        .attr("id", function(d, i) { return "segment-label-" + i; })
        .attr("xlink:href", "#label-path-"+inst)
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