(function() {
    'use strict';

    /**
     *  @name modal.directive
     *  @desc Create a modal inspired by the UI-Bootstrap modal directive
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

        function link (scope, element, attributes, ngModel) {

            scope.close = function (e) {
                e.preventDefault();
            };

            ngModel.$render = function() {
                scope.project = ngModel.$viewValue;
            };
        }

    }

})();
