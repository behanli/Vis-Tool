// Define 'data-table' directive
angular.module('displayData')
.directive('displayData', [ function() { 

	var controller = ['$scope' , function($scope) { 

		$scope.$watch('data', function() {
			
			if(!$scope.data) return;

			var keys = Object.keys($scope.data[0]);

			$scope.textKeys = [];
			$scope.numKeys = [];

			for(var i = 0; i < keys.length; i++) {
				
				if( typeof $scope.data[0][keys[i]] === 'string') {
					$scope.textKeys.push(keys[i]);
				} else {
					$scope.numKeys.push(keys[i]);
				}
				
			}
			
		});

	}];

	var link = function(scope, elem, attrs) {


		// TODO

	}



	return {
		restrict: 'E',
		templateUrl: 'js/display-data/display-data.template.html',
		scope: {
			data: '='
		},
		controller: controller,
		link: link	
	}


}]);