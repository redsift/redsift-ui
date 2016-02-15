/* global d3 */

'use strict';

// Smooth some data with a given window size.
function smooth(d, w) {
    var result = [];
    for (var i = 0, l = d.length; i < l; ++i) {
        var mn = Math.max(0, i - 5 * w),
            mx = Math.min(d.length - 1, i + 5 * w),
            s = 0.0;
        result[i] = 0.0;
        for (var j = mn; j < mx; ++j) {
            var wd = Math.exp(-0.5 * (i - j) * (i - j) / w / w);
            result[i] += wd * d[j];
            s += wd;
        }
        result[i] /= s;
    }
    return result;
}

var Xkcd = {
	wiggle: function(perturbation, magnitude, fx, fy) {
		if (perturbation === undefined) {
			perturbation = 0.93;
		}
        
        if (magnitude === undefined) {
			magnitude = 0.003;
		}
        
        if (fx === undefined) {
			fx = 500;
		}
        
        if (fy === undefined) {
			fy = 300;
		}
        
        // XKCD-style line interpolation. Roughly based on:
        // jakevdp.github.com/blog/2012/10/07/xkcd-style-plots-in-matplotlib
        return function (points) {
            // Scale the data.
            var scaled = points.map(function (p) {
                return [p[0] / fx, p[1] / fy];
            });
            
            // Compute the distance along the path using a map-reduce.
            var dists = scaled.map(function (d, i) {
                if (i == 0) return 0.0;
                var dx = d[0] - scaled[i - 1][0],
                    dy = d[1] - scaled[i - 1][1];
                return Math.sqrt(dx * dx + dy * dy);
            }),
                dist = dists.reduce(function (curr, d) { return d + curr; }, 0.0);

            // Choose the number of interpolation points based on this distance.
            var N = Math.round(200 * dist);

            // Re-sample the line.
            var resampled = [];
            dists.map(function (d, i) {
                if (i == 0) return;
                var n = Math.max(3, Math.round(d / dist * N)),
                    spline = d3.interpolate(scaled[i - 1][1], scaled[i][1]),
                    delta = (scaled[i][0] - scaled[i - 1][0]) / (n - 1);
                for (var j = 0, x = scaled[i - 1][0]; j < n; ++j, x += delta)
                    resampled.push([x, spline(j / (n - 1))]);
            });

            // Compute the gradients.
            var gradients = resampled.map(function (a, i, d) {
                if (i == 0) return [d[1][0] - d[0][0], d[1][1] - d[0][1]];
                if (i == resampled.length - 1)
                    return [d[i][0] - d[i - 1][0], d[i][1] - d[i - 1][1]];
                return [0.5 * (d[i + 1][0] - d[i - 1][0]),
                        0.5 * (d[i + 1][1] - d[i - 1][1])];
            });

            // Normalize the gradient vectors to be unit vectors.
            gradients = gradients.map(function (d) {
                var len = Math.sqrt(d[0] * d[0] + d[1] * d[1]);
                if (len === 0) return [0, 0];
                return [d[0] / len, d[1] / len];
            });

            // Generate some perturbations.
            var perturbations = smooth(resampled.map(d3.random.normal(0.0, perturbation)), 3);

            // Add in the perturbations and re-scale the re-sampled curve.
            var result = resampled.map(function (d, i) {
                var p = perturbations[i],
                    g = gradients[i];
                    
                return [((d[0] + magnitude * g[1] * p) * fx).toFixed(6),
                        ((d[1] - magnitude * g[0] * p) * fy).toFixed(6)];
            });

            return result.join("L");
        }
	}	
};

if (typeof module !== 'undefined' && module.exports) { module.exports = Xkcd; } // CommonJs export
if (typeof define === 'function' && define.amd) { define([], function () { return Xkcd; }); } // AMD
