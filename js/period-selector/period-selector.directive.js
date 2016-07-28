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

	var link = function(scope, elem, attrs) {

		// Set id of collapsible panel
		scope.id = attrs.setId;

		// Collapsible event picker logic
		elem.find('.dropdown-menu li').on("click" , function() {
			var collapse = $(this).text() == 'Date' ? 'hide' : 'show';
			$("#" + scope.id).collapse(collapse);
		});

	}

	// Return object
	return {
		restrict: 'E',
		templateUrl: "js/period-selector/period-selector.template.html",
		scope: {
			period: '=',  // period object passed in
			events: '=', // events array passed in
			eventFilters: '=' // eventFilters array passed in
		},
		controller: controller,
		link: link
	}

}]);