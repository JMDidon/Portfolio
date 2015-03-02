(function() {
	'use strict';

	angular
		.module('Portfolio')
		.directive('stickyHeader', stickyHeader);

	/**
	 *	@name stickyHeader.directive
	 *	@desc Makes a header sticky after a certain amount of scroll
	 */
	function stickyHeader() {
		var directive = {
			restrict: 'EA',
			link: link,
			scope: false // We don't want to create a new scope for this element as it won't interfere with it
		};

		return directive;

		function link(scope, element, attributes) {
			window.addEventListener('scroll', throttle(function() {
					if(window.scrollY > scope.slideSize.height) {
						document.querySelector('.main-header').classList.add('stickied')
					}
					else {
						document.querySelector('.main-header').classList.remove('stickied');
					}
				}, 30)
			);
		}

		function throttle(fn, threshold) {
			var last,
				deferTimer;
			return function() {
				var context = this,
					args = arguments,
					now = +new Date();

				if (last && now < last + threshold) {
					clearTimeout(deferTimer);
					deferTimer = setTimeout(function () {
						last = now;
						fn.apply(context, args);
					}, threshold);
				}
				else {
					last = now;
					fn.apply(context, args);
				}
			};
		}
	}
})();
