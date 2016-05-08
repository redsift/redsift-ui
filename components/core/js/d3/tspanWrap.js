/* global d3 */
'use strict';

function tspanWrap() {
    // Replaces a <text>'s list of a <tspan>
    var split = /\s+/, join = ' ', width = 0;

    function impl(selection) {
        selection.each(function() {
        var text = d3.select(this),
            words = text.text().split(split).reverse(),
            word,
            line = [],
            spans = [],
            dy = 0,
            x = text.attr('x'),
            y = text.attr('y'),
            w = text.attr('width'),
            h = text.attr('height'),     
            tspan = text.text(null).append('tspan');
        
        if (w != null) {
            w = parseInt(w);
        } else {
            w = width;
        }

        if (h != null) {
            h = parseInt(h);
        }

        while (word = words.pop()) {
            line.push(word);
            tspan.text(line.join(join));

            if (tspan.node().getComputedTextLength() > w) {
                line.pop();

                tspan.attr('x', x).attr('y', y);

                // update the dy later to keep the BBox predictable
                spans.push([tspan, dy]);

                var box = tspan.node().getBBox();
                dy = dy + box.height;
                
                var txt = line.join(join);
                line = [ word ];
                
                if (h != null && dy > h) {
                    tspan.text(txt + '…');
                    tspan = null;
                    line = [];
                    break;
                } else {
                    tspan.text(txt);
                    tspan = text.append('tspan').text(null);
                }
            }
        }
        if (line.length !== 0) {
            tspan.text(line.join(join));
            tspan.attr('x', x).attr('y', y);
            spans.push([tspan, dy]);
        }

        // this workaround is due to odd behaviour with getBBox and the height
        spans.forEach(function (d) {
            d[0].attr('dy', d[1]);
        });
        });
    }

    impl.width = function(value) {
        if (!arguments.length) return width;
        width = value;
        return impl;
    }; 

    impl.split = function(value) {
        if (!arguments.length) return split;
        split = value;
        return impl;
    };  

    impl.join = function(value) {
        if (!arguments.length) return join;
        join = value;
        return impl;
    };  

    return impl;
}    

if (typeof module !== 'undefined' && module.exports) { module.exports = tspanWrap; } // CommonJs export
if (typeof define === 'function' && define.amd) { define([], function () { return tspanWrap; }); } // AMD