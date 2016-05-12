import { Tools } from './tools.js';

function pieChart() {
  var outerRadius = 100,
    innerRadius = 0,
    classed = 'pie',
    fill = null,
    animationEnd = null,
    animationDuration = Tools.redsiftDuration(),
    animation = Tools.redsiftEasing();

  function impl(selection) {
    var arc = d3.svg.arc()
                .outerRadius(outerRadius)
                .innerRadius(innerRadius);



    selection.each(function(data) {

        var p = d3.select(this).selectAll('path.'+classed)
            .data(data);

        p.enter().append('path')
            .attr('class', classed);
        p.exit().remove();

        if (animation) {
            p.transition().ease(animation).duration(animationDuration).attr('d', arc).each('end', function() {
                if (animationEnd) {
                    animationEnd();
                }
            });
        } else {
            p.attr('d', arc);
        }


        if (fill) {
            p.style('fill', fill);
        }
    });
  }

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

  impl.animationDuration = function(value) {
    if (!arguments.length) return animationDuration;
    animationDuration = value;
    return impl;
  };

  impl.fill = function(value) {
    if (!arguments.length) return fill;
    fill = value;
    return impl;
  };

  impl.classed = function(value) {
    if (!arguments.length) return classed;
    classed = value;
    return impl;
  };

  impl.outerRadius = function(value) {
    if (!arguments.length) return outerRadius;
    outerRadius = value;
    return impl;
  };

  impl.innerRadius = function(value) {
    if (!arguments.length) return innerRadius;
    innerRadius = value;
    return impl;
  };

  return impl;
}

export { pieChart };
