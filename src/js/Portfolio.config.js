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
