/**
 *  https://coderwall.com/p/hujlhg/smooth-scrolling-without-jquery (slightly modified)
 *  Smoothly scroll element to the given target (element.scrollTop)
 *  for the given duration
 *
 *  Returns a promise that's fulfilled when done, or rejected if interrupted
 */

function smoothScroll(element, targetName, duration) {
    var target = document.querySelector(targetName).offsetTop;
    duration = Math.round(duration) || 300;

    if (duration === 0) {
        element.scrollTop = target;
        return Promise.resolve();
    }

    var startTime = Date.now();
    var endTime = startTime + duration;

    var startTop = element.scrollTop;
    var distance = target - startTop;

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
        var previousTop = element.scrollTop;

        // This is like a think function from a game loop
        function scroll_frame() {
            if (element.scrollTop != previousTop) {
                reject('Interrupted');
                return;
            }

            // Set the scrollTop for this frame
            var now = Date.now();
            var point = smooth_step(startTime, endTime, now);
            var frameTop = parseInt(Math.round(startTop + (distance * point)));
            element.scrollTop = frameTop;

            // Check if we're done!
            if (now >= endTime) {
                resolve();
                return;
            }

            // If we were supposed to scroll but didn't, then we
            // probably hit the limit, so consider it done; not
            // interrupted.
            if (element.scrollTop === previousTop
                && element.scrollTop !== frameTop) {
                resolve();
                return;
            }
            previousTop = element.scrollTop;

            // Schedule next frame for execution
            setTimeout(scroll_frame, 0);
        }

        // Boostrap the animation process
        setTimeout(scroll_frame, 0);
    });
}
