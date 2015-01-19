
(function() {
	'use strict';

	angular.module('Portfolio', ['ngRoute'])
})();

(function() {
	'use strict';

	angular
		.module('Portfolio')
		.config(configure);

	configure.$inject = ['$routeProvider', '$locationProvider'];

	function configure( $routeProvider, $locationProvider ) {
		$routeProvider.when('/', {
			controller: 'Portfolio.MainCtrl',
			controllerAs: 'Main'
		});

		$locationProvider.html5Mode(true);
	}
})();

(function() {
	'use strict';

	angular
		.module('Portfolio')
		.controller('Portfolio.MainCtrl', Main);

	Main.$inject = ['$scope'];

	function Main($scope) {
		var vm = this;

		vm.doScroll = function(target, e) {
			var body = navigator.userAgent.indexOf('Firefox') > -1 ? document.documentElement : document.body;
			smoothScroll(body, target, 300);
			e.preventDefault();
		};
	}
})();

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

		/*function debounce(func, wait, immediate) {
			console.log('debounced: ', func, wait, immediate);
			var timeout;
			return function() {
				var context = this, args = arguments;
				var later = function() {
					timeout = null;
					if (!immediate) func.apply(context, args);
				};
				var callNow = immediate && !timeout;
				clearTimeout(timeout);
				timeout = setTimeout(later, wait);
				if (callNow) func.apply(context, args);
			};
		}*/
	}
})();
