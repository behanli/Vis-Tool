// Define 'period-selector' directive
angular.module('periodSelector')
.directive('periodSelector' , [ function() {

	// Controller
	var controller = ['$scope' , function($scope) {
	
		// Function to alternate period selector
		$scope.setPeriodType = function(type) {
			$scope.period.type = type;
		}

		// Functions to handle date-picker
		$scope.popup = {
			opened: false
		};

		$scope.togglePopup = function() {
			$scope.popup.opened = !$scope.popup.opened;
		};

	}];

	// Return object
	return {
		scope: {
			period: '=',  // period object passed in
			events: '=' // events array passed in
		},
		controller: controller,
		restrict: 'E',
		templateUrl: "js/period-selector/period-selector.template.html"
	}

}]);