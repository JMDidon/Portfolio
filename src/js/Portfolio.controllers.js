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
