// Define the 'student-controller' controller
angular.module('student')
.controller('studentCtrl' , ['$scope' , 'apiRequest' , 'dataFormatter', 'config', '$timeout',
	function($scope , apiRequest, dataFormatter, config, $timeout) {

		// Init properties
		$scope.events = [];

		// Populate charts
		$scope.charts = [
			{value: 'bar' , display: 'Barchart'},
			/*{value: 'line' , display: 'Linechart'},*/
			{value: 'scatter' , display: 'Scatterplot'},
			{value: 'hist' , display: 'Histogram'}
		];

		// Populate students select
		apiRequest.students().then( function(response) {
			$scope.students = response.data;
		})

		// Populate metrics select
		// NOTE: ensure api fn^ name matches metric name in controller
		$scope.metrics = [
			{value:'courseDuration', display:'Course Duration'}, 
			{value:'engagement', display:'Engagement'}, 
			{value:'courseLogins', display:'Course Logins'},
			{value:'courseInteractions', display:'Course Interactions'},
			{value:'courseSessions', display:'Course Sessions'}
		];

		// Populate events
		apiRequest.events().then(function(response) {
			$scope.events = response.data;
		});

		// Reset filter
		$scope.reset = function() {
			$scope.selectedChart = $scope.charts[0];
			$scope.studentFilter = '';
			$scope.selectedStudents = [];
			$scope.selectedMetrics = [];

			$scope.periodOne = {
				prefix: 'from',
				type: 'Date',
				date: config.DEFAULT_START_DATE,
				event: ''
			};
			
			$scope.periodTwo = {
				prefix: 'to',
				type: 'Date',
				date: config.DEFAULT_END_DATE,
				event: ''
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
				dataFormatter.students($scope.selectedStudents , metrics, $scope.periodOne, $scope.periodTwo)
				.then( function(res) {
					$scope.data = res;
				});

			}, 10);
		}

}]);