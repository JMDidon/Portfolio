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
