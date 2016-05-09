const SCROLL_DURATION = 200;

function docScrollTop() {
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

    let start_time = Date.now();
    let end_time = start_time + duration;

    let start_top = element.scrollTop;
    let distance = target - start_top;

    // based on http://en.wikipedia.org/wiki/Smoothstep
    let smooth_step = function(start, end, point) {
        if (point <= start) {
            return 0;
        }
        if (point >= end) {
            return 1;
        }
        let x = (point - start) / (end - start); // interpolation
        return x * x * (3 - 2 * x);
    }

    return new Promise(function(resolve, reject) {
        // This is to keep track of where the element's scrollTop is
        // supposed to be, based on what we're doing
        let previous_top = element.scrollTop;

        let timer = null;
        // This is like a think function from a game loop
        let scroll_frame = function() {
            /*
            // This logic is too fragile
            if(element.scrollTop != previous_top) {
                window.clearInterval(timer);
                reject('interrupted');
                return;
            }
            */
            // set the scrollTop for this frame
            let now = Date.now();
            let point = smooth_step(start_time, end_time, now);
            let frameTop = Math.round(start_top + (distance * point));
            element.scrollTop = frameTop;

            // check if we're done!
            if (now >= end_time) {
                window.clearInterval(timer);
                resolve('done');
                return;
            }

            // If we were supposed to scroll but didn't, then we
            // probably hit the limit, so consider it done; not
            // interrupted.
            if (element.scrollTop === previous_top && element.scrollTop !== frameTop) {
                window.clearInterval(timer);
                resolve('limit');
                return;
            }
            previous_top = element.scrollTop;
        }

        // boostrap the animation process
        timer = setInterval(scroll_frame, 10);
    });
}

function clickFor(to, offset) {
    return function(evt) {
        let target = document.getElementById(to);
        if (target === undefined) {
            return true;
        }
        offset = offset || 0;
        let delta = getAbsoluteBoundingRect(target).top + offset;
        smooth_scroll_to(document.body, delta, SCROLL_DURATION).catch(function(e) {
            console.error(e);
        });
        evt.preventDefault();
        return false;
    }
}

let scrollNodes = [];

function throttle(type, name, obj) {
    obj = obj || window;
    let running = false;
    let func = function() {
        if (running) {
            return;
        }
        running = true;
        requestAnimationFrame(function() {
            obj.dispatchEvent(new CustomEvent(name));
            running = false;
        });
    };
    obj.addEventListener(type, func);
}

function onScroll() {
    let pos = window.scrollY;
    scrollNodes.forEach(function(params) {
        let node = params[0];
        let current = params[1];
        let cls = params[2];
        let extents = params[4];

        let state = false;
        for (let i = 0; i < extents.length; i++) {
            let extent = extents[i];
            state = (pos > extent.start && pos < extent.end);
            if (state) {
                break;
            }
        }

        if (state === current) {
            return;
        }
        params[1] = state;
        if (state) {
            node.classList.add(cls);
        } else {
            node.classList.remove(cls);
        }
    });
}

function getAbsoluteBoundingRect(el) {
    let doc = document,
        win = window,
        body = doc.body,

        // pageXOffset and pageYOffset work everywhere except IE <9.
        offsetX = win.pageXOffset !== undefined ? win.pageXOffset :
        (doc.documentElement || body.parentNode || body).scrollLeft,
        offsetY = win.pageYOffset !== undefined ? win.pageYOffset :
        (doc.documentElement || body.parentNode || body).scrollTop,

        rect = el.getBoundingClientRect();

    if (el !== body) {
        let parent = el.parentNode;

        // The element's rect will be affected by the scroll positions of
        // *all* of its scrollable parents, not just the window, so we have
        // to walk up the tree and collect every scroll offset. Good times.
        while (parent !== body) {
            offsetX += parent.scrollLeft;
            offsetY += parent.scrollTop;
            parent = parent.parentNode;
        }
    }

    return {
        bottom: rect.bottom + offsetY,
        height: rect.height,
        left: rect.left + offsetX,
        right: rect.right + offsetX,
        top: rect.top + offsetY,
        width: rect.width
    };
}

function updateRegions() {
    scrollNodes.forEach(function(params) {
        let target = params[0].getBoundingClientRect();
        let overlap = params[3];

        let nodes = document.querySelectorAll(overlap);
        let all = [];
        for (let i = 0; i < nodes.length; i++) {
            let node = nodes[i];
            let ext = getAbsoluteBoundingRect(node);
            all.push({
                start: ext.top - target.height,
                end: ext.bottom
            });
        }
        params[4] = all;
    });
}

let Scroll = {
    initSmooth(selector, offset) {
        let nodes = document.querySelectorAll(selector);
        for (let i = 0; i < nodes.length; i++) {
            let node = nodes[i];
            let href = node.attributes.href;
            if (href === undefined || href.length === 0) {
                continue;
            }
            let to = href.nodeValue.toString();
            if (to.substr(0, 1) !== '#') {
                continue;
            }

            node.addEventListener('click', clickFor(to.substr(1), offset), false);
        }
    },
    toggleClass(selector, cls, overlap) {
        let nodes = document.querySelectorAll(selector);
        if (nodes.length > 0) {
            window.addEventListener('optimizedResize', updateRegions);
            window.addEventListener('optimizedScroll', onScroll);
        }
        for (let i = 0; i < nodes.length; i++) {
            let node = nodes[i];
            let param = [node, null, cls, overlap, []];

            // check for this node
            let found = false;
            for (let ii = 0; i < scrollNodes.length; i++) {
                if (scrollNodes[ii][0] == node) {
                    scrollNodes[ii] = param;
                    found = true;
                    break;
                }
            }
            if (!found) {
                scrollNodes.push(param);
            }
        }
        updateRegions();
        onScroll();
    },
    updateRegions: updateRegions
};

throttle('scroll', 'optimizedScroll');
throttle('resize', 'optimizedResize');

export { Scroll };
