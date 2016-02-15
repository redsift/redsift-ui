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
        classed = 'line', as = true, ae = true;

    var arrowSize = 12,
        arrowAspect = 0.4,
        arrowOffset = 6;
                  
    function impl(selection) {
        selection.each(function(data) {
            if (data === undefined) {
                console.log('no data for line');
                return;
            }
            if (data.length < 2) {
                console.log(data.length + ' data items not supported by line');
                return;
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
            
            var p = el.select('.' + classed);
            
            if (p.empty()) {
                p = el.append('path').attr('class', classed);
            }
            
            p.attr('d', line(data));   
                
            var arrow = classed + ' arrow';
            var deg = 0;
            
            if (as) {
                deg = angleDeg(x0, y0, data[1][0], data[1][1]);
                
                var g = el.select('g.as');
                if (g.empty()) {
                    g = el.append('g').attr('class', 'as');
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
	            
                g = el.select('g.ae');
                if (g.empty()) {
                    g = el.append('g').attr('class', 'ae');
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
        classed = 'box';

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
                        t = el.append('text').attr('class', classed).attr('dominant-baseline', 'hanging');
                        // Chrome oddity, to investigate why getBBox is wrong first time by this factor
                        magicFix = 1.15;
                    }
                    var tx = data.tx || 0;
                    var ty = data.ty || 0;
                    
                    t.attr('x', data.x + tx)
                        .attr('y', data.y + ty)
                        .text(data.t);
                    var bound = t.node().getBBox();
                    data.width = data.width || (bound.width * magicFix + 2*tx);
                    data.height = data.height || (bound.height + ty);
                }
                
                data = [ [data.x, data.y], [data.x, data.y + data.height], [data.x + data.width, data.y + data.height], [data.x + data.width, data.y] ];
            } else if (data.length !== 4) {
                console.log(data.length + ' data items not supported by box');
                return;
            }
            
            var box = d3.svg.area();
            if (interpolation != null) {
                box = box.interpolate(interpolation);
            }

            
            p.attr('d', box(data));   
        });
    }

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
  }  
};

if (typeof module !== 'undefined' && module.exports) { module.exports = Components; } // CommonJs export
if (typeof define === 'function' && define.amd) { define([], function () { return Components; }); } // AMD