(function() {
	'use strict';

	angular
		.module('Portfolio')
		.directive('slide', slide);

	function slide() {
		var directive = {
			restrict: 'EA',
			link: link,
			scope: false // We don't want this directive to create its own scope
		};

		return directive;

		function link(scope, element, attributes) {
			resizeSlides(element[0], scope);

			window.addEventListener('resize', function (e) {
				resizeSlides(element[0], scope);
			});
		}

		/**
		 *	Set element's size to window's dimensions
		 */
		function resizeSlides(element, scope) {
			var width  = window.innerWidth;
			var height = window.innerHeight;

			element.style.width  = width  + 'px';
			element.style.height = height + 'px';

			scope.slideSize = {
				width : width,
				height: height
			};
		}
	}
})();
