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
