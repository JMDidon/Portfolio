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
