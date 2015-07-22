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
            var modal       = document.querySelector('#modal');
            vm.projects     = [];
            vm.modalOpened  = false;

            vm.isMobile     = (document.documentElement.clientWidth || document.body.clientWidth) < 1024;

            /* In order to scroll the right element, we need to detect Firefox users */
            vm.scrollElem   = navigator.userAgent.indexOf('Firefox') > -1 ? document.documentElement : document.body;

            /* Scroll to the given target */
            vm.doScroll = function (target, e) {
                smoothScroll(vm.scrollElem, target, 300);
                e.preventDefault();
            };

            /* Open project on click */
            vm.openProject = function (project, e) {
                vm.modalOpened = true;
                vm.openedProject = project;
                vm.sendGAEvent('project', project.title);

                e.preventDefault();
            };

            vm.close = function () {
                vm.modalOpened = false;
                vm.openedProject = undefined;
            };

            vm.sendGAEvent = function (category, label) {
                ga('send', 'event', category, 'click', label);
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
