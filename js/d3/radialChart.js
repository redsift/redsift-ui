/* global d3 */
/* global d3 */
'use strict';

var tools = require('./tools.js');

var index = 0;

// Special CSS under this size
var SMALL_TH = 200;

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
    spokeOverhang = 16,
    labelOrient = "left",
    animationEnd = null,
    cpfx = 'd3-rc',
    band = [],
    bandLabel = [],
    inset = 0,
    selected = null;

  var formatNumber = d3.format(".0f");
  var tickAxisSize = 50;
  var bandAxisSize = 40;
  var axisPadding = 30;
  
  function impl(selection) {
   
    var minorTicks = 3;
    var small = false;
    if (height < SMALL_TH) {
      small = true;
      minorTicks = 2;
      labelDistance = 4;
      spokeOverhang = 8;
    }
    
    var barHeight = (height / 2) - 30;
    var labelRadius = barHeight + labelDistance;
    var axisSize = tickAxisSize + (band.length > 0 ? bandAxisSize : 0);      
        
    selection.each(function(data) {
      var svg = d3.select(this).select('svg');
      var g = null;
      var labels = null;
      
      var create = false;
      if (svg.empty()) {
        create = true;
        svg = tools.svgRoot(this, width + axisSize, height);
        g = svg.append("g")
          .attr('class', cpfx + (small ? ' d3-small' : ''))
          .attr("transform", "translate(" + (width / 2 + axisSize) + "," + height / 2 + ")");
          
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

      var arc = d3.svg.arc()
        .startAngle(function(d, i) {
          return (i * 2 * Math.PI) / numBars;
        })
        .endAngle(function(d, i) {
          return ((i + 1) * 2 * Math.PI) / numBars;
        })
        .innerRadius(0);
      
      // Spokes
      g.selectAll("line")
        .data(keys)
        .enter().append("line")
        .attr("y2", -barHeight - spokeOverhang)
        .classed("spokes", true)
        .attr("transform", function(d, i) {
          return "rotate(" + (i * 360 / numBars) + ")";
        });

      function updateLabel(d, i) {
          var t = d.valueText;
          if (t === undefined) {
            t = prefix + formatNumber(d.value);
          } else if (typeof t === 'function') {
            t = t();
          }
          selected = i;
          g.select("#segment-label-" + i).classed('hover', true).text(t);
      }
        
      g.selectAll(".segment-bg")
        .data(data)
        .enter()
        .append("path")
        .attr("class", "segment-bg")
        .each(function(d) {
          d.outerRadius = barHeight + (2*spokeOverhang);
        })
        .attr("d", arc)
        .on('mouseover', updateLabel)
        .on("mouseout",function(d, i) {
            var t = keys[i];
            selected = null;
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
        
      bind.each(function(d, i) {
          if (animation) {
            if (d.animateFrom !== undefined) {
              d.outerRadius = barScale(d.animateFrom);
            } else {
              d.outerRadius = 0;
            }
          } else {
            d.outerRadius = barScale(d.value);
          }
          
          if (i === selected) {
            updateLabel(d, i);
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
      
      var vals = null;
      var bvals = null;

      if (create) {
        g.append("circle")
          .attr("r", barHeight)
          .classed("outer-line", true);
        var offset = (width + (axisSize - axisPadding)) / 2;
        vals = g.append("g")
          .attr("class", "x axis label")
          .attr("transform", "translate(-" + offset + ",0)");

        bvals = g.append("g")
          .attr("class", "xb axis label")
          .attr("transform", "translate(-" + offset + ",0)");
      } else {
        vals = g.select('.x');
        bvals = g.select('.xb');
      }

      var xAxis = d3.svg.axis()
        .scale(x).orient(labelOrient)
        .ticks(minorTicks)
        .tickFormat(function(v) {
          return prefix + formatNumber(v);
        });
        
      if (animation) {
        vals = vals.transition().ease(animation).duration(animationDuration);
      }
      vals.call(xAxis);

      function tickHandlers(selection) {
        return {
          showTick: function (d, s) {
            g.selectAll(selection).filter(function(d, i) { return (i === s); }).attr('style', 'opacity: 1.0');
          },    
          hideAllTicks: function () {
            g.selectAll(selection).attr('style', 'opacity: 0.0');
          }
        }
      }

      var onmousetl = tickHandlers('.tick-line');
      
      g.select('.x').selectAll('text')
        .on('mouseover', onmousetl.showTick)
        .on("mouseout", onmousetl.hideAllTicks);

      if (band.length !== 0) {
        if (animation) {
          bvals = bvals.transition().ease(animation).duration(animationDuration);
        }
        
        var bandAxis = d3.svg.axis()
          .scale(x).orient(labelOrient === 'left' ? 'right' : 'left')
          .tickValues([ band ])
          .tickFormat(function(v, i) {
            if (bandLabel.length > i) {
              var l = bandLabel[i];
              if (l != null) return l;
            }
            return prefix + formatNumber(v);
          });
        bvals.call(bandAxis);

       g.selectAll(".band-line")
        .data(band)
        .enter().append("circle")
        .attr("r", function(d) {
          return barScale(d);
        })
        .classed("band-line", true);
        

      var onmousebl = tickHandlers('.band-line');

      g.select('.xb').selectAll('text')
        .on('mouseover', onmousebl.showTick)
        .on("mouseout", onmousebl.hideAllTicks);        
        
      }
      
      // Tick lines
      g.selectAll(".tick-line")
        .data(x.ticks(minorTicks))
        .enter().append("circle")
        .attr("r", function(d) {
          return barScale(d);
        })
        .classed("tick-line", true);
      
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
    
    if (!Array.isArray(value)) {
      value = [ value ];
    }
    
    if (!Array.isArray(label)) {
      label = [ label ];
    }
    
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

  impl.labelOrient = function(value) {
    if (!arguments.length) return labelOrient;
    labelOrient = value;
    return impl;
  };

  return impl;
}

if (typeof module !== 'undefined' && module.exports) { module.exports = radialChart; } // CommonJs export
if (typeof define === 'function' && define.amd) { define([], function () { return radialChart; }); } // AMD