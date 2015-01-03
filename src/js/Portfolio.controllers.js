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
			smoothScroll(body, target, 150);
			e.preventDefault();
		};
	}
})();
