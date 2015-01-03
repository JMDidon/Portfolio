/**
 *  https://coderwall.com/p/hujlhg/smooth-scrolling-without-jquery (slightly modified)
 *  Smoothly scroll element to the given target (element.scrollTop)
 *  for the given duration
 *
 *  Returns a promise that's fulfilled when done, or rejected if interrupted
 */

function smoothScroll(element, targetName, duration) {
    target = document.querySelector(targetName).offsetTop;
    duration = Math.round(duration);

    if (duration < 0) {
        return Promise.reject('Bad duration');
    }

    if (duration === 0) {
        element.scrollTop = target;
        return Promise.resolve();
    }

    var start_time = Date.now();
    var end_time = start_time + duration;

    var start_top = element.scrollTop;
    var distance = target - start_top;

    // Based on http://en.wikipedia.org/wiki/Smoothstep
    function smooth_step(start, end, point) {
        if (point <= start) { return 0; }
        if (point >= end) { return 1; }
        var x = (point - start) / (end - start); // interpolation
        return x*x*x*(x*(x*6 - 15) + 10);
    }

    return new Promise(function(resolve, reject) {
        // This is to keep track of where the element's scrollTop is
        // supposed to be, based on what we're doing
        var previous_top = element.scrollTop;

        // This is like a think function from a game loop
        function scroll_frame() {
            if (element.scrollTop != previous_top) {
                reject('Interrupted');
                return;
            }

            // Set the scrollTop for this frame
            var now = Date.now();
            var point = smooth_step(start_time, end_time, now);
            var frameTop = parseInt(Math.round(start_top + (distance * point)));
            element.scrollTop = frameTop;

            // Check if we're done!
            if (now >= end_time) {
                resolve();
                return;
            }

            // If we were supposed to scroll but didn't, then we
            // probably hit the limit, so consider it done; not
            // interrupted.
            if (element.scrollTop === previous_top
                && element.scrollTop !== frameTop) {
                resolve();
                return;
            }
            previous_top = element.scrollTop;

            // Schedule next frame for execution
            setTimeout(scroll_frame, 0);
        }

        // Boostrap the animation process
        setTimeout(scroll_frame, 0);
    });
}
