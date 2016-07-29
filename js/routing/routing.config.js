// Configure '$routeProvider' for application
angular.module('visApp')
.config(['$locationProvider' , '$routeProvider' , 
	function config($locationProvider , $routeProvider) {

		// Set $locationProvider hash prefix
		//$locationProvider.hashPrefix('!');

		// Configure routes
		$routeProvider

			// route for the students page
			.when('/students' , {
				templateUrl: 'js/tabs/student/student.template.html'
			})

			// route for the groups-cohorts page
			.when('/groups-cohorts' , {
				templateUrl: 'js/tabs/group-cohort/group-cohort.template.html'
			})

			// route for the concept page
			.when('/concept', {
				templateUrl: 'js/tabs/concept/concept.template.html'
			})

			// default route
			.otherwise('/students');
	}]);
