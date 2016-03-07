/* global d3 */
'use strict';
function angleDeg(x0, y0, x1, y1) {
    var dy = y1 - y0;
    var dx = x1 - x0;
    var theta = Math.atan2(dy, dx);

    return theta * 180/Math.PI;
}

var Components = {
  // .datum([ [2, 3], [2, 10] ]).call(...); 
  line: function() {
    var interpolation = null, 
        classed = 'line', as = true, ae = true, bgline = null;

    var arrowSize = 12,
        arrowAspect = 0.4,
        arrowOffset = 6,
        xscale = null, yscale = null;
                  
    function impl(selection) {
        selection.each(function(data) {
            if (data == null) {
                console.log('no data for line');
                return;
            }
            
            if (data.length < 2) {
                console.log(data.length + ' data items not supported by line');
                return;
            }
            
            if (!Array.isArray(data[0])) {
                data = data.map(function (o) { return [ o.x, o.y ]; });
            }
            
            
            if (xscale || yscale) {
                if (xscale == null) {
                    xscale = function (v) { return v; }
                }
                if (yscale == null) {
                    yscale = function (v) { return v; }
                }
                data = data.map(function (o) {
                    return [ xscale(o[0]), yscale(o[1]) ];
                });
            }
            
            var x0 = data[0][0];            
            var y0 = data[0][1];
            
            var x1 = data[data.length - 1][0];            
            var y1 = data[data.length - 1][1];
            
            var aa = arrowAspect * arrowSize,
                o = arrowOffset,
                s = arrowSize;
            
            var line = d3.svg.line();
            if (interpolation != null) {
                line = line.interpolate(interpolation);
            }
            
            var el = d3.select(this);
            
            if (bgline) {
                var bg = el.select('.' + bgline);
                if (bg.empty()) {
                    bg = el.append('path').attr('class', 'bgstroke ' + bgline);
                }
                bg.attr('d', d3.svg.line()(data));
            }
            
            var p = el.select('.' + classed);
            if (p.empty()) {
                p = el.append('path').attr('class', classed);
            }
            
            p.attr('d', line(data));   
                
            var arrow = classed + ' arrow';
            var deg = 0;
            
            if (as) {
                deg = angleDeg(x0, y0, data[1][0], data[1][1]);
                
                var g = el.select('g.as.' + classed);
                if (g.empty()) {
                    g = el.append('g').attr('class', 'as ' + classed);
                }
                
                var a = g.select('path');
                if (a.empty()) {
                    a = g.append('path').attr('class', arrow);
                }
                
                g.attr('transform', 'rotate(' + deg + ', ' + x0 + ', ' + y0 + ')');
                a.attr('d', line([[x0 + s - o, y0 + aa], [x0 - o, y0], [x0 + s - o, y0 - aa]]));
            }

            if (ae) {
                deg = angleDeg(x1, y1, data[data.length - 2][0], data[data.length - 2][1]);
	            
                g = el.select('g.ae.' + classed);
                if (g.empty()) {
                    g = el.append('g').attr('class', 'ae ' + classed);
                }
                
                a = g.select('path');
                if (a.empty()) {
                    a = g.append('path').attr('class', arrow);
                }
                 
                g.attr('transform', 'rotate(' + deg + ', ' + x1 + ', ' + y1 + ')');
                a.attr('d', line([[x1 + s - o, y1 + aa], [x1 - o, y1], [x1 + s - o, y1 - aa]]));
            }

                 
        });
    }

    impl.bgline = function(value) {
        if (!arguments.length) return bgline;
        bgline = value;
        return impl;
    };
    
    impl.xscale = function(value) {
        if (!arguments.length) return xscale;
        xscale = value;
        return impl;
    };
    
    impl.yscale = function(value) {
        if (!arguments.length) return yscale;
        yscale = value;
        return impl;
    };
    
    impl.arrowStart = function(value) {
        if (!arguments.length) return as;
        as = value;
        return impl;
    };
    
    impl.arrowEnd = function(value) {
        if (!arguments.length) return ae;
        ae = value;
        return impl;
    };    

    impl.classed = function(value) {
        if (!arguments.length) return classed;
        classed = value;
        return impl;
    };
    
    impl.interpolation = function(value) {
        if (!arguments.length) return interpolation;
        interpolation = value;
        return impl;
    };
      
    return impl;
  },
  box: function() {
    var interpolation = null, 
        classed = 'box', baseline = 'hanging', anchor = 'start', style = null;

    function impl(selection) {
        selection.each(function(data) {
            if (data === undefined) {
                console.log('no data for box');
                return;
            }
                        
            var el = d3.select(this);
            var p = el.select('path.' + classed);
            
            if (p.empty()) {
                p = el.append('path').attr('class', classed);
            }
            
            if (!Array.isArray(data)) {
                // map
                if (data.t) {
                    var t = el.select('text.' + classed);
                    var magicFix = 1;
                    if (t.empty()) {
                        t = el.append('text').attr('class', classed);
                        // Chrome oddity, to investigate why getBBox is wrong first time by this factor
                        magicFix = 1.15;
                    }
                    // text-anchor
                    t.attr('text-anchor', anchor).attr('dominant-baseline', baseline);
                    
                    var tx = data.tx || 0;
                    var ty = data.ty || 0;
                    
                    t.attr('x', data.x + tx)
                        .attr('y', data.y + ty)
                        .text(data.t);
                    var bound = t.node().getBBox();
                    data.width = data.width || (bound.width * magicFix + 2*tx);
                    data.height = data.height || (bound.height + ty);
                }
                // console.log(data);
                //  , [data.x + data.width, data.y + data.height], [data.x + data.width, data.y]
                data = [ [data.x, data.y], [data.x, data.y + data.height], [data.x + data.width, data.y + data.height], [data.x + data.width, data.y], [data.x, data.y] ];
            } else if (data.length < 4) {
                console.log(data.length + ' data items not supported by box');
                return;
            }
            
            var box = d3.svg.line();
            if (interpolation != null) {
                box = box.interpolate(interpolation);
            }
            
            p.attr('d', box(data));   
            if (style) {
                p.attr('style', style);
            }
        });
    }
    
    impl.style = function(value) {
        if (!arguments.length) return style;
        style = value;
        return impl;
    };

    impl.anchor = function(value) {
        if (!arguments.length) return anchor;
        anchor = value;
        return impl;
    };

    impl.baseline = function(value) {
        if (!arguments.length) return baseline;
        baseline = value;
        return impl;
    };
    
    impl.classed = function(value) {
        if (!arguments.length) return classed;
        classed = value;
        return impl;
    };
    
    impl.interpolation = function(value) {
        if (!arguments.length) return interpolation;
        interpolation = value;
        return impl;
    };
      
    return impl;
  },
  spokes: function() {
    var radius = 100, 
        interpolation = null, 
        classed = 'spokes';       
      
      function impl(selection) {
        selection.each(function(data) {
            var seg = d3.svg.line().interpolate(interpolation);  
                    
            var p = d3.select(this).selectAll('path.' + classed).data(data);
            p.enter().append('path')
                .attr('class', classed);
            p.exit().remove();
            
            p.attr('d', function(d, i) {
                var hl = radius;
                var hRad = d.startAngle - Math.PI/2;
                var hx = hl * Math.cos(hRad); 
                var hy = hl * Math.sin(hRad);  
                
                var eRad = d.endAngle - Math.PI/2;
                var ex = hl * Math.cos(eRad); 
                var ey = hl * Math.sin(eRad);  
                
                return seg([[ ex, ey ], [ 0, 0 ], [ hx, hy ]]);
            });
                        
        });
      }
      
    impl.classed = function(value) {
        if (!arguments.length) return classed;
        classed = value;
        return impl;
    };      

    impl.radius = function(value) {
        if (!arguments.length) return radius;
        radius = value;
        return impl;
    };
    
    impl.interpolation = function(value) {
        if (!arguments.length) return interpolation;
        interpolation = value;
        return impl;
    };
          
      return impl;
  },
  radial: function() {
      var radius = 100, 
        interpolation = null, 
        classed = 'radial', 
        points = 90,
        startAngle = 0,
        endAngle = 2*Math.PI;
      
      function impl(selection) {
        selection.each(function() {

            var angle = d3.scale.linear()
                .domain([0, points])
                .range([startAngle, endAngle]);
                
            var line = d3.svg.line.radial()
                .interpolate(interpolation)
                .radius(radius)
                .angle(function(d, i) { return angle(i); });
            
            var data = [];
            if (points > 0) {
                data = [ d3.range(points+1) ];
                
            }
            var p = d3.select(this).selectAll('path.' + classed).data(data);
            
            p.enter().append('path')
                .attr('class', classed);
            p.exit().remove();
                    
            p.attr('d', function(d) {
                return line(d);
            });      
        });
      }

    impl.startAngle = function(value) {
        if (!arguments.length) return startAngle;
        startAngle = value;
        return impl;
    };  

    impl.endAngle = function(value) {
        if (!arguments.length) return endAngle;
        endAngle = value;
        return impl;
    };       
      
    impl.classed = function(value) {
        if (!arguments.length) return classed;
        classed = value;
        return impl;
    };      

    impl.points = function(value) {
        if (!arguments.length) return points;
        points = value;
        return impl;
    };

    impl.radius = function(value) {
        if (!arguments.length) return radius;
        radius = value;
        return impl;
    };
    
    impl.interpolation = function(value) {
        if (!arguments.length) return interpolation;
        interpolation = value;
        return impl;
    };
        
      return impl;
  }  
};

if (typeof module !== 'undefined' && module.exports) { module.exports = Components; } // CommonJs export
if (typeof define === 'function' && define.amd) { define([], function () { return Components; }); } // AMD
