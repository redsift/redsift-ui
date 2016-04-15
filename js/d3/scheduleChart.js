/* global d3 */
'use strict';

var tools = require('./tools.js');

function scheduleChart() {
  
  var width = 300,
      height = 150,
      eventHeight = 32,
      eventPadding = 2,
      textLeft = 4,
      textRight = 4,
      textTop = 4,
      textBottom = 4;
  
  function _isMinor(d) {
    return  (d.getMinutes() != 0);
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
            .attr('class', function(d) {
                return _isMinor(d) ? 'minor' : '';
            });

        grid
            .selectAll('g.x.axis g.tick line')
            .attr('class', function(d) {
                return _isMinor(d) ? 'minor' : '';
            });  
            
        // Event rects
        var events = el.append('g')
                    .attr('class', 'events');


        var event = events.selectAll('g.event')
            .data(data)
            .enter()
            .append('g')
            .attr('class', (d) => 'event ' + d.status + (d.self ? ' self' : ''))
            .attr('transform', (d) => 'translate(' + x(d.start) + ',' + (d.index * (eventHeight + eventPadding)) + ')');


        event.append('rect')
            .attr('width', (d) => x(d.end) - x(d.start))
            .attr('height', eventHeight);

        //TODO: Wrapping is a bit of hackfest
        event.append('text')
            .attr('x', textLeft)
            .attr('y', 0)
            .attr('width', (d) => x(d.end) - x(d.start) - textLeft - textRight)
            .attr('height', eventHeight - textTop - textBottom)
            .text((d) => d.summary);
                        
            /*
            .call(Redsift.D3.Components.tspanWrap().width(80));
            */
            
        event.append('text')
            .attr('class', 'symbol')
            .attr('x', (d) => x(d.end) - x(d.start))
            .attr('y', eventHeight)
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
    
  return impl;
}


if (typeof module !== 'undefined' && module.exports) { module.exports = scheduleChart; } // CommonJs export
if (typeof define === 'function' && define.amd) { define([], function () { return scheduleChart; }); } // AMD