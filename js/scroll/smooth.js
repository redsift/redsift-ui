/* global Promise */
'use strict';

var SCROLL_DURATION = 200;

function elementScrollTop(e)
{
    var top = 0;
    while (e.offsetParent !== undefined && e.offsetParent !== null)
    {
        top += e.offsetTop + (e.clientTop != null ? e.clientTop : 0);
        e = e.offsetParent;
    }

    return top;
}

function docScrollTop()
{
    return document.documentElement.scrollTop + document.body.scrollTop;
}

// Adapted from https://coderwall.com/p/hujlhg/smooth-scrolling-without-jquery
function smooth_scroll_to(element, target, duration) {
    target = Math.round(target);
    duration = Math.round(duration);
    if (duration < 0) {
        return Promise.reject('bad duration');
    }
    if (duration === 0) {
        element.scrollTop = target;
        return Promise.resolve('no-duration');
    }

    var start_time = Date.now();
    var end_time = start_time + duration;

    var start_top = element.scrollTop;
    var distance = target - start_top;

    // based on http://en.wikipedia.org/wiki/Smoothstep
    var smooth_step = function(start, end, point) {
        if(point <= start) { return 0; }
        if(point >= end) { return 1; }
        var x = (point - start) / (end - start); // interpolation
        return x*x*(3 - 2*x);
    }

    return new Promise(function(resolve, reject) {
        // This is to keep track of where the element's scrollTop is
        // supposed to be, based on what we're doing
        var previous_top = element.scrollTop;

        // This is like a think function from a game loop
        var scroll_frame = function() {
            if(element.scrollTop != previous_top) {
                reject('interrupted');
                return;
            }

            // set the scrollTop for this frame
            var now = Date.now();
            var point = smooth_step(start_time, end_time, now);
            var frameTop = Math.round(start_top + (distance * point));
            element.scrollTop = frameTop;

            // check if we're done!
            if(now >= end_time) {
                resolve('done');
                return;
            }

            // If we were supposed to scroll but didn't, then we
            // probably hit the limit, so consider it done; not
            // interrupted.
            if(element.scrollTop === previous_top
                && element.scrollTop !== frameTop) {
                resolve('limit');
                return;
            }
            previous_top = element.scrollTop;

            // schedule next frame for execution
            setTimeout(scroll_frame, 0);
        }

        // boostrap the animation process
        setTimeout(scroll_frame, 0);
    });
}

function clickFor(to) {
    return function(evt) { 
        var target = document.getElementById(to);
        if (target === undefined) {
            return true;
        }
        var delta = elementScrollTop(target);
        smooth_scroll_to(document.body, delta, SCROLL_DURATION).catch(function (e) { console.error(e); } );
        evt.preventDefault();
        return false;
    }
}

var Scroll = {
	initSmooth: function(selector) {
		var nodes = document.querySelectorAll(selector);
		for(var i=0; i<nodes.length; i++) {
			var node = nodes[i];
            var href = node.attributes.href;
            if (href === undefined || href.length === 0) {
                continue;
            }
            var to = href.nodeValue.toString();
            if (to.substr(0, 1) !== '#') {
                continue;
            }
            
            node.addEventListener('click', clickFor(to.substr(1)), false);
		} 
	}
};

if (typeof module !== 'undefined' && module.exports) { module.exports = Scroll; } // CommonJs export
if (typeof define === 'function' && define.amd) { define([], function () { return Scroll; }); } // AMD
  	