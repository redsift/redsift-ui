import { Tools } from './tools.js';

function legendChart() {

  var width = 300,
    height = width,
    cpfx = 'd3-lc',
    sample = 16,
    padding = 4;

  function impl(selection) {
    selection.each(function(data) {
      var svg = Tools.svgRoot(this, width, height, 'svg-padding-left svg-padding-top');

      var g = svg.append("g")
        .attr('class', cpfx);

      var max = 1;
      var mapped = data.map(function(d) {
          if (!Array.isArray(d.color)) {
            d.color = [ d.color ];
          } else {
            max = Math.max(max, d.color.length);
          }
          return d;
      });

      var line = g.selectAll("g").data(mapped)
        .enter()
        .append('g')
        .attr("transform",function(d,i) { return "translate(0," + (1+i)*(sample+padding) + ")"})

     var swatch = line.append('g')
        .attr("class", function (d) { return 'swatch ' + (d.classed ? d.classed : ''); });

      var xText = (sample + padding) * max;

      swatch.selectAll("rect")
        .data(function(d) { return d.color; })
        .enter().append("rect")
        .style('fill', function (d) { return d; })
        .attr("x", function (d, i) { return xText - ((sample+padding) * (i + 1)); })
        .attr("y", -sample + padding)
        .attr("width", sample)
        .attr("height", sample)

      line.append('text')
        .attr('class', 'label')
        .attr("x", xText)
        .text(function(d) {
          return d.title;
        });
    });
  }

  impl.width = function(value) {
    if (!arguments.length) return width;
    width = value;
    height = value;
    return impl;
  };

  impl.sample = function(value) {
    if (!arguments.length) return sample;
    sample = value;
    return impl;
  };

  return impl;
}


export { legendChart };
