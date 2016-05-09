var _SVG_ID = 0xff000;

// Created a SVG 1.1 node with margin convention
function svg() {
  _SVG_ID = _SVG_ID + 1;
  var id = _SVG_ID;

  var width = 300,
      height = 150,
      top = 16,
      right = 16,
      bottom = 16,
      left = 16,
      scale = 1,
      inner = 'g.inner',
      innerWidth = -1,
      innerHeight = -1,
      transition = null,
      css = null;

  function _updateInnerWidth() {
      innerWidth = width - left - right;
  }

  function _updateInnerHeight() {
      innerHeight = height - top - bottom;
  }

  _updateInnerWidth();
  _updateInnerHeight();

  function impl(selection) {

    selection.each(function(d, i) {
        var bind = d3.select(this).selectAll('svg.svg-guid-' + id);

        // new
        var nsvg = bind.data([ null ])
                .enter()
                .append('svg')
                    .attr({
                        version: '1.1',
                        xmlns: 'http://www.w3.org/2000/svg',
                        preserveAspectRatio: 'xMidYMid meet',
                        class: 'svg-guid-'+id,
                        width: width * scale,
                        height: height * scale,
                        viewBox: '0 0 ' + width + ' ' + height
                    });

        if (css != null) {
            nsvg.append('defs')
                .append('style')
                .attr('type', 'text/css')
                .text(css);
        }

        nsvg.append('g')
            .attr({
                transform: 'translate(' + left + ',' + top + ')',
                class: 'inner'
                });

        // d3 work around for xlink
        bind.each(function() {
            this.setAttributeNS('http://www.w3.org/2000/xmlns/', 'xmlns:xlink', 'http://www.w3.org/1999/xlink');
        });

        var svg = bind;
        var g = bind.select(inner);

        if (transition === true) {
            svg = svg.transition();
            g = g.transition();
        }

        svg.attr({
            width: width * scale,
            height: height * scale,
            viewBox: '0 0 ' + width + ' ' + height
        });
        g.attr('transform', 'translate(' + left + ',' + top + ')');

    });
  }

  impl.self = function() { return 'svg.svg-guid-' + id; }
  impl.child = function() { return impl.self() + '>' + inner; }
  impl.innerWidth = function() { return innerWidth; }
  impl.innerHeight = function() { return innerHeight; }

  impl.transition = function(value) {
    if (!arguments.length) return transition;
    transition = value;
    return impl;
  };

  impl.width = function(value) {
    if (!arguments.length) return width;
    width = value;
    _updateInnerWidth();
    return impl;
  };

  impl.height = function(value) {
    if (!arguments.length) return width;
    height = value;
    _updateInnerHeight();
    return impl;
  };

  impl.css = function(value) {
    if (!arguments.length) return css;
    css = value;
    return impl;
  };

  impl.scale = function(value) {
    if (!arguments.length) return scale;
    scale = value;
    return impl;
  };

  impl.margin = function(value) {
    if (!arguments.length) return {
  			top: top,
  			right: right,
  			bottom: bottom,
  			left: left
  		};
    if (value.top !== undefined) {
      top = value.top;
      right = value.right;
      bottom = value.bottom;
      left = value.left;
    } else {
      top = value;
      right = value;
      bottom = value;
      left = value;
    }
    _updateInnerWidth();
    _updateInnerHeight();
    return impl;
  };

  return impl;
}

export { svg };
