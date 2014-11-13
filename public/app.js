
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

	function Main ( $scope ) {
		var vm = this;
		console.log('Yo', vm);
	}
})();
