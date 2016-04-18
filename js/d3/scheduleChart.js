/* global d3 */
'use strict';

var tspanWrap = require('./tspanWrap.js');
var svg = require('./svg.js');

var CSS = "text { font: 10px sans-serif; } \n"; 

function scheduleChart() {
  
  var width = 300,
      height = 150,
      eventHeight = 32,
      eventPadding = 2,
      textLeft = 4,
      textRight = 4,
      textTop = 2,
      textBottom = 2;
  
  var colorText = '#7F736F',
        colorLine = '#AB9A94',
        colorLight = '#F7EEED',
        ePx = '10px',
        aPx = '12px';
  
  function _isMinor(d) {
    return  (d.getMinutes() != 0);
  }
    
  var eventRectStyle = function(d) {
      var c = '#FFDF53';
      var o = '0.8';

      if (d.status === 'proposed') {
          c = '#50AFFA';
          o = '1.0';
      } else if (d.status === 'confirmed') {
          c = '#37D192';
      }
      
      return 'fill:' + c + ';opacity:' + o;
  }
  
  var eventTextStyle = function(d) {
      var c = colorText;
      if (d.status === 'proposed') {
          c = colorLight;
      }
      return 'dominant-baseline: text-before-edge; font-size: ' + ePx + ';fill:' + c;
  }
  
  var eventSymbolStyle = function(d) {
      var c = 'none';
      if (d.self === true) {
          c = colorLight;
      }      
      return 'dominant-baseline: text-after-edge; text-anchor: end; font-size: ' + ePx + ';fill:' + c;
  }
  
  var axisTextStyle = function(d) {
      var c = colorText;
      if (_isMinor(d)) {
        // hide minors
        c = 'none';
      } 
      
      return 'font-size: ' + aPx + ';fill: ' + c;
  }

  var axisLineStyle = function(d) {
      var w = '1.6px';
      if (_isMinor(d)) {
        w = '0.4px';
      } 
      
      return 'stroke-width: ' + w + ';stroke: ' + colorLine;
  }

    
  function impl(selection) {
    selection.each(function(provided) {
        var extent = [ 
            d3.min(provided, (v) => v.start),
            d3.max(provided, (v) => v.end),
        ];

        // filter out empty events (e.g. range setting values)
        var data = provided.filter((d) => d.status != null);
        
        // create overlap indexes
        data = data.map(function(d, i) {
            var index = 0;
            for (var pos = 0; pos < data.length; pos++) {
                if (pos >= i) break;
                var t = data[pos];
                
                var overlap = (t.start >= d.start && t.start < d.end) || 
                        (t.end > d.start && t.end <= d.end);
                if (overlap) 
                {
                index = t.index + 1;
                }
            }
            d.index = index;
            return d;
        });
        
        var x = d3.time.scale()
            .domain(extent)
            .rangeRound([0, width]);

        var xAxis = d3.svg.axis()
            .scale(x)
            .orient('bottom')
            .tickFormat(d3.time.format('%Hh'))
            .ticks(d3.time.minutes, 30)
            .tickPadding(4)
            .tickSize(-height, 0);
        
        var el = d3.select(this).append('g').attr('class', 'schedule');
            
        var grid = el.append('g')
            .attr('class', 'x axis')
            .attr('transform', 'translate(0, ' + height + ')')
            .call(xAxis);

        grid
            .selectAll('g.x.axis g.tick text')
            .attr('style', axisTextStyle)
            .attr('transform', 'translate(' + -10 + ',0)'); //TODO: axis hardcode here

        grid
            .selectAll('g.x.axis g.tick line')
            .attr('style', axisLineStyle); 
            
        // Event rects
        var events = el.append('g')
                    .attr('class', 'events');


        var event = events.selectAll('g.event')
            .data(data)
            .enter()
            .append('g')
            .attr('class', 'event')
            .attr('transform', (d) => 'translate(' + x(d.start) + ',' + (d.index * (eventHeight + eventPadding)) + ')');


        event.append('rect')
            .attr('style', eventRectStyle)
            .attr('width', (d) => x(d.end) - x(d.start))
            .attr('height', eventHeight);


        var wrap = tspanWrap();
        event.append('text')
            .attr('style', eventTextStyle)
            .attr('x', textLeft)
            .attr('y', textTop)
            .attr('width', (d) => x(d.end) - x(d.start) - textLeft - textRight)
            .attr('height', eventHeight - textTop - textBottom)
            .text((d) => d.summary)
            .call(wrap);
            
            
        event.append('text')
            .attr('class', 'symbol')
            .attr('x', (d) => x(d.end) - x(d.start) - textRight)
            .attr('y', eventHeight - textBottom)
            .attr('style', eventSymbolStyle)
            .text('♚');
                                  
    });
  }

  impl.width = function(value) {
    if (!arguments.length) return width;
    width = value;
    return impl;
  };

  impl.height = function(value) {
    if (!arguments.length) return height;
    height = value;
    return impl;
  };
  
  impl.eventHeight = function(value) {
    if (!arguments.length) return eventHeight;
    eventHeight = value;
    return impl;
  };
  
  impl.eventPadding = function(value) {
    if (!arguments.length) return eventPadding;
    eventPadding = value;
    return impl;
  };   
  
  impl.textPadding = function(value) {
    if (!arguments.length) return {
        top: textTop,
        right: textRight,
        bottom: textBottom,
        left: textLeft
    };
    if (value.top !== undefined) {
      textTop = value.top;
      textRight = value.right;
      textBottom = value.bottom;
      textLeft = value.left; 
    } else {
      textTop = value;
      textRight = value;
      textBottom = value;
      textLeft = value;
    } 
    return impl;
  };
  
  impl.rasterize = function(selection, data, width, height, scale) {
      var ratio = 1.91;
      if (height == null || height == 0) {
          height = Math.round(width / ratio);
      } else if (width == null || width == 0) {
          width = Math.round(height * ratio);
      }
      
      var frame = svg()
                    .width(width)
                    .height(height)
                    .scale(scale)
                    .css(CSS);   
      
      impl
        .width(frame.innerWidth())
        .height(frame.innerHeight());
        
      var div = selection.call(frame);
      div.select(frame.child()).datum(data).call(impl);
  }      
    
  return impl;
}


if (typeof module !== 'undefined' && module.exports) { module.exports = scheduleChart; } // CommonJs export
if (typeof define === 'function' && define.amd) { define([], function () { return scheduleChart; }); } // AMD