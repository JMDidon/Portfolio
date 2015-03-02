
(function() {
	'use strict';

	angular.module('Portfolio', ['ngAnimate']);
})();

(function() {
	'use strict';

	angular
		.module('Portfolio')
		.config(configure);

	configure.$inject = ['$locationProvider'];

	function configure ( $locationProvider ) {
		$locationProvider.html5Mode(true);
	}
})();

(function() {
	'use strict';

	angular
		.module('Portfolio')
		.factory('ProjectsFactory', ProjectsFactory);

	ProjectsFactory.$inject = ['$http'];

	function ProjectsFactory($http) {
		return {
			getProjects: getProjects
		};

		function getProjects() {
			return $http.get('public/json/projects.json')
				 .then(returnProject)
				 .catch(returnError);
		}

		function returnProject(response) {
			return response.data;
		}

		function returnError(error) {
			console.log('Error while retrieving projects: ', error);
			return error;
		}
	}

})();

(function() {
	'use strict';

	angular
		.module('Portfolio')
		.controller('Portfolio.MainCtrl', Main);

	Main.$inject = ['$scope', 'ProjectsFactory'];

	function Main ($scope, ProjectsFactory) {
		var vm = this;
		init();

		function init () {
			var modal 		= document.querySelector('#modal');
			vm.projects 	= [];
			vm.modalOpened 	= false;

			/* Detect Retina screen in order to display high-res images */
			vm.isRetina 	= window.devicePixelRatio > 1;

			/* In order to scroll the right element, we need to detect Firefox users */
			vm.scrollElem 	= navigator.userAgent.indexOf('Firefox') > -1 ? document.documentElement : document.body;

			/* Scroll to the given target */
			vm.doScroll = function (target, e) {
				smoothScroll(vm.scrollElem, target, 300);
				e.preventDefault();
			};

			/* Open project on click */
			vm.openProject = function (project, e) {
				vm.modalOpened = true;
				vm.openedProject = project;

				console.log('project, e :', vm.openedProject, e);
				e.preventDefault();
			};

			vm.close = function () {
				vm.modalOpened = false;
				vm.openedProject = undefined;
			};

			/* Get projects from service */
			ProjectsFactory.getProjects()
				.then(function (projects) {
					vm.projects = projects;
				})
				.catch(function (error) {
					console.error(error);
				});
		}
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

	/**
	 *	@name modal.directive
	 *	@desc Create a modal inspired by the UI-Bootstrap modal directive
	 */
	 angular
		.module('Portfolio')
		.directive('modal', modal);

	function modal () {
		var directive = {
			restrict: 'EA',
			link: link,
			require: '?ngModel'
		};

		return directive;

		link.$inject = ['$document'];

		function link (scope, element, attributes, ngModel, $docmuent) {

			scope.close = function (e) {
				console.log('Modal directive, close:', e);
				e.preventDefault();
			};

			ngModel.$render = function() {
				scope.project = ngModel.$viewValue;
			};

			$document.on('scroll', function (e) {
				e.preventDefault();
			});

			console.log('Modal directive, init : ', scope, element, attributes);
		}

	}

	/*angular
		.module('Portfolio')
		.factory('ModalFactory', ModalFactory)
		.directive('modal', modal)
		.provider('$modal', modalProvider);

	//modalProvider.$inject = ['$q'];

	function ModalFactory () {
		var ModalFactory = {};

		ModalFactory.open = function (modalInstance, modal) {
			openedWindows.add(modalInstance, {
				deferred: modal.deferred,
				modalScope: modal.scope,
			});

			console.log('ModalFactory.open(modalInstance, modal) :', modalInstance, modal);
		};

		return ModalFactory;
	}

	function modal () {
		var directive = {
			restrict: 'EA',
			link: link,
			scope: {}
		};

		return directive;

		function link (scope, element, attributes) {

			scope.close = function (e) {

				//ModalFactory.dismiss(modal, 'Backdrop click');
				console.log('Modal directive, close:', e);
				e.preventDefault();
			};

			/*scope.open = function(modalInstance, modal) {
				openedWindows.add(modalInstance, {
					deferred: modal.deferred,
					modalScope: modal.scope,
				});
			};

			console.log(scope, element, attributes);
		}

	}

	function modalProvider() {
		var $modalProvider = {
			options: {},
			$get: 	['$injector', '$q', '$rootScope', 'ModalFactory',
			function ($injector, $q, $rootScope, ModalFactory) {
				var $modal = {};

				$modal.open = function (options) {
					var modalResultDeferred = $q.defer();
					var modalOpenedDeferred = $q.defer();

					var modalInstance = {
						result: modalResultDeferred.promise,
						opened: modalOpenedDeferred.promise,
						close: function (result) {
							$modal.close(modalInstance, result);
						}
					};

					console.log('$modal provider, open(options):', options);
					options = angular.extend({}, $modalProvider.options, options);
					options.resolve = options.resolve || {};

					var templateAndResolvePromise = $q.all(getResolvePromises(options.resolve));

					templateAndResolvePromise.then(function resolveSuccess (tplAndVars) {
						var modalScope = (options.scope || $rootScope).$new();
						modalScope.$close = modalInstance.close;
						modalScope.$dismiss = modalInstance.dismiss;

						console.log('templateAndResolvePromise.then(tplAndVars)', tplAndVars, modalScope);

						ModalFactory.open(modalInstance, {
							scope: modalScope,
							deferred: modalResultDeferred,
							backdrop: options.backdrop,
							keyboard: options.keyboard,
							backdropClass: options.backdropClass,
							windowClass: options.windowClass,
							windowTemplateUrl: options.windowTemplateUrl,
							size: options.size
						});
					});
				};

				function getResolvePromises (resolves) {
					var promisesArr = [];
					angular.forEach(resolves, function (value) {
						if (angular.isFunction(value) || angular.isArray(value)) {
							promisesArr.push($q.when($injector.invoke(value)));
						}
					});
					return promisesArr;
				}

				return $modal;
			}]
		};

		return $modalProvider;
	}*/

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
	}
})();
