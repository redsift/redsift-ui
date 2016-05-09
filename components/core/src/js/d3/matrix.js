import { Components } from './components.js';

function matrix() {

    var rowClassed = 'row',
        columnClassed = 'column',
        anchor = 'start',
        formatter = function (d) { return d; },
        ty = 0,
        tx = 0,
        grid = null;

    function impl(selection) {
        var sizes = [];
        var nodes = [];

        selection.enter().append('g').attr('class', function(d,i) {
            var flag = (i%2 === 0) ? ' even' : ' odd';

            return rowClassed + flag + ' row-' + i;
        });

        selection.exit().remove();

        selection.each(function(data) {
            var cols = d3.select(this).selectAll('.' + columnClassed).data(data);

            cols.enter().append('text').attr('class', function(d,i) {
                var flag = (i%2 === 0) ? ' even' : ' odd';

                return columnClassed + flag + ' column-' + i;
            });

            cols.exit().remove();

            cols.attr('text-anchor', anchor).attr('dominant-baseline', 'text-before-edge').text(formatter);
            var line = [];
            var nos = [];
            cols.each(function () {
                line.push(this.getBBox());
                nos.push(this);
            });

            sizes.push(line);
            nodes.push(nos);
        });

        if (grid) {
            // Not very d3....
            grid.selectAll('.grid').remove();
        }

        var len = 0;
        var maxY = ty;
        var rows = sizes.map(function (r) {
            if (r && r.length > len) {
                len = r.length;
            }
            var max = d3.max(r, function (c) {
                return c.height;
            });
            if (max === undefined) max = 0;
            maxY += max + (2*ty);
            return max;
        });

        var cols = [];

        var offset = 0;

        for (var i=0; i<len; i++) {
            var slice = sizes.map(function (r) {
                if (r && r.length > i) return r[i].width
                return 0;
            });

            var max = d3.max(slice);
            cols.push(max);
            if (grid) {
                var line = Components.line()
                            .classed('grid column column-'+i)
                            .arrowStart(false)
                            .arrowEnd(false)
                            .interpolation(style);

                grid.datum([[offset, 0], [offset, maxY]]).call(line);
            }
            offset += max + (2*tx);
        }
        if (grid) {
            var endLineCol = Components.line()
                    .classed('grid end column column-'+i)
                    .arrowStart(false)
                    .arrowEnd(false)
                    .interpolation(style);

            grid.datum([[offset, 0], [offset, maxY]]).call(endLineCol);
        }

        var oy = ty;
        var ox = 0;
        nodes.forEach(function (r, ir) {

            ox = tx;
            r.forEach(function (n, ic) {
                d3.select(n).attr('x', ox).attr('y', oy);
                ox += cols[ic] + (2*tx);
            });

            if (grid) {
                var line = Components.line()
                            .classed('grid row row-'+ir)
                            .arrowStart(false)
                            .arrowEnd(false)
                            .interpolation(style);
                if (ox !== tx) grid.datum([[0, oy - ty], [ox - tx, oy - ty]]).call(line);
            }
            oy += rows[ir] + (2*ty);
        });
        if (grid) {
            var endLineRow = Components.line()
                    .classed('grid end row row-'+nodes.length)
                    .arrowStart(false)
                    .arrowEnd(false)
                    .interpolation(style);
            if (ox !== tx) grid.datum([[0, oy], [ox - tx, oy]]).call(endLineRow);
        }
    }

    impl.tx = function(value) {
        if (!arguments.length) return tx;
        tx = value;
        return impl;
    };

    impl.ty = function(value) {
        if (!arguments.length) return ty;
        ty = value;
        return impl;
    };

    impl.formatter = function(value) {
        if (!arguments.length) return formatter;
        formatter = value;
        return impl;
    };

    impl.rowClassed = function(value) {
        if (!arguments.length) return rowClassed;
        rowClassed = value;
        return impl;
    };

    impl.columnClassed = function(value) {
        if (!arguments.length) return columnClassed;
        columnClassed = value;
        return impl;
    };

    // node to attach the grid to
    impl.grid = function(value) {
        if (!arguments.length) return grid;
        grid = value;
        return impl;
    };


    return impl;
}

export { matrix };
