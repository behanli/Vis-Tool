// Define 'concept-controller' controller
angular.module('tabs')
.controller('conceptCtrl', ['$scope', 'apiRequest', '$timeout', 'dataFormatter', 
	function($scope, apiRequest, $timeout, dataFormatter) { 

	// Init properties
	$scope.events = [];
	$scope.selectedStudentsOptions = ['students', 'groupscohorts'];

	// Populate courses
	apiRequest.courses().then( function(response) { 
		$scope.courses = response.data;
		$scope.selectedCourse = $scope.courses[0]; // Default to first course
	});

	// Populate students / groups / cohorts / events / engagement options on course selection
	$scope.$watch('selectedCourse', function() {

		if(!$scope.selectedCourse) return;

		// students
		apiRequest.students($scope.selectedCourse).then( function(response) {
			$scope.students = response.data;
		})

		// groups
		apiRequest.groups($scope.selectedCourse).then( function(response) { // groups
			
			$scope.groups = response.data.map( function(currentValue) {
				var obj = {};
				obj.value = currentValue;
				obj.type = 'group';
				return obj;
			});

		});

		// cohorts
		apiRequest.cohorts($scope.selectedCourse).then(function( response) { // cohorts
			
			$scope.cohorts = response.data.map( function(currentValue) {
				var obj = {};
				obj.value = currentValue;
				obj.type = 'cohort';
				return obj;
			});

		});

		// events (tasks & topics)
		apiRequest.events($scope.selectedCourse, "LearningTask").then( function(response) {

			$scope.tasks = response.data.map( function(currentValue) {
				var obj = {};
				obj.value = currentValue;
				obj.type = 'task';
				return obj;
			});

		});

		apiRequest.events($scope.selectedCourse, "LearningTopic").then( function(response) {

			$scope.topics = response.data.map( function(currentValue) {
				var obj = {};
				obj.value = currentValue;
				obj.type = 'topic';
				return obj;
			});

		});

		// engagement options
		apiRequest.engagementOptions($scope.selectedCourse).then( function(response) {
			$scope.engagementOptions = response.data;
		});

	});

	/* Populate metrics select
		NOTE: ensure api fn^ name matches metric name in controller */
	$scope.metrics = [
		{value:'courseDurationConcept', display:'Course Duration'}, 
		{value:'courseInteractionsConcept', display:'Course Interactions'},
		{value:'engagementConcept', display:'Engagement'}
	];

	// Concept options - display concepts for the following metrics
	$scope.conceptOptions = ['courseDurationConcept', 'courseInteractionsConcept'];
	
	// Populate charts
	$scope.charts = [
		{value: 'bar' , display: 'Barchart'},
		{value: 'scatter' , display: 'Scatterplot'},
		{value: 'hist' , display: 'Histogram'},
		{value:'histSmooth' , display: 'Histogram (Overlay)'}
	];

	// Reset filter
	$scope.reset = function() {
		$scope.selectedStudentsOption = 'students';
		$scope.selectedStudents = [];
		$scope.selectedGroupsCohorts = [];
		$scope.selectedMetric = $scope.metrics[0];
		$scope.selectedEngagementOptions = [];
		$scope.selectedChart = $scope.charts[0];
	}

	$scope.reset();

	// Function to handle submit btn
	$scope.handleSubmit = function() {

		/* Undefine data to prevent chart duplication
					from previous submit */
		$scope.data = undefined;
		$scope.chartToDisplay = undefined;

		/* Timeout used so that each directive is recalled on submit
				with a new scope initialised */
		$timeout( function() {  

			// Update charts only on 'Submit'
			$scope.metricsToDisplay = [$scope.selectedMetric];
			$scope.chartToDisplay = $scope.selectedChart;

			var metrics = [$scope.selectedMetric.value];

			// Call to data formatter
			if ($scope.selectedStudentsOption == 'students') {

				var params = {

					course: $scope.selectedCourse,
					students: $scope.selectedStudents,
					metrics: metrics,
					options: $scope.selectedEngagementOptions,
					concept: $scope.selectedConcept

				};

				dataFormatter.students(params)
				.then( function(res) {
					$scope.data = res;
				});

			} else { // groupscohorts

				var params = {

					course: $scope.selectedCourse,
					groupsCohorts: $scope.selectedGroupsCohorts,
					metrics: metrics,
					options: $scope.selectedEngagementOptions,
					concept: $scope.selectedConcept

				};
				
				dataFormatter.groupsCohorts(params)
				.then (function(res) {
					$scope.data = res;
				});

			}

		}, 10);

	}

}]);