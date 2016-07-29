// Define the 'group-controller' controller 
angular.module('tabs')
.controller('groupCohortCtrl' , [ '$scope', 'apiRequest' , 'dataFormatter', 'config', '$timeout',
	function($scope , apiRequest, dataFormatter, config, $timeout) {

		// Init properties
		$scope.events = [];

		// Populate courses
		apiRequest.courses().then( function(response) {
			$scope.courses = response.data;
			$scope.selectedCourse = $scope.courses[0]; // Default to first course
		});

		// Populate groups / cohorts & events on course selection
		$scope.$watch('selectedCourse', function() {

			if(!$scope.selectedCourse) return;

			// Populate groups-cohorts select
			apiRequest.groups($scope.selectedCourse).then( function(response) { // groups
				
				$scope.groups = response.data.map( function(currentValue) {
					var obj = {};
					obj.value = currentValue;
					obj.type = 'group';
					return obj;
				});

			});

			apiRequest.cohorts($scope.selectedCourse).then(function( response) { // cohorts
				
				$scope.cohorts = response.data.map( function(currentValue) {
					var obj = {};
					obj.value = currentValue;
					obj.type = 'cohort';
					return obj;
				});

			});

			// Populate events
			apiRequest.events($scope.selectedCourse).then( function(response) {
				$scope.events = response.data;
			});

			// Populate event-filters
			apiRequest.eventFilters($scope.selectedCourse).then( function(response) { 
				$scope.eventFilters = response.data.rows.map( function(row) {
					return row[0];
				});
			});

		}); 

		// Populate charts
		$scope.charts = [
			{value: 'bar' , display: 'Barchart'},
			{value: 'scatter' , display: 'Scatterplot'},
			{value: 'hist' , display: 'Histogram'},
			{value:'histSmooth' , display: 'Histogram (Overlay)'}
		];

		// Populate metrics select
		// NOTE: ensure api fn^ name matches metric name in controller
		$scope.metrics = [
			{value:'courseDuration', display:'Course Duration'}, 
			{value:'engagement', display:'Engagement'}, 
			{value:'courseLogins', display:'Course Logins'},
			{value:'courseInteractions', display:'Course Interactions'},
			{value:'courseSessions', display:'Course Sessions'}
		];

		// Reset filter
		$scope.reset = function() {
			$scope.selectedChart = $scope.charts[0];
			$scope.selectedGroupsCohorts = [];
			$scope.selectedMetrics = [];

			$scope.periodOne = {
				prefix: 'from',
				type: 'Date',
				date: config.DEFAULT_START_DATE,
				event: '',
				eventFilter: ''
			};
			
			$scope.periodTwo = {
				prefix: 'to',
				type: 'Date',
				date: config.DEFAULT_END_DATE,
				event: '',
				eventFilter: ''
			};
		
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
				$scope.metricsToDisplay = $scope.selectedMetrics;
				$scope.chartToDisplay = $scope.selectedChart;
			
				var metrics = $scope.selectedMetrics.map( function(metric) {
					return metric.value;
				});

				// Load data
				dataFormatter.groupsCohorts($scope.selectedCourse, $scope.selectedGroupsCohorts, metrics, $scope.periodOne, $scope.periodTwo)
				.then( function(res) {
					$scope.data = res;
				});

			}, 10);
		}
		
}]); 
