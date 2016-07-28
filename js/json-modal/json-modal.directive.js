// Define 'json-modal' directive
angular.module('jsonModal')
.directive('jsonModal', [function() { 

	var controller = ['$scope', function($scope) {

		$scope.init = function() {

			if(!$scope.data) return;

			$scope.saveAs = 'data';

			$scope.nests = ['none'].concat( Object.keys($scope.data[0]) ); // Nest by keys within data
			$scope.nestBy = $scope.nests[0]; // 'none' by default
		}

		// Pretty print json
		$scope.json = "";
		$scope.printJSON = function() {

			if(!$scope.data) return;

			var nestData; // Temp data to preserve existing data structure

			if($scope.nestBy != 'none') {
				nestData = d3.nest()
					.key(function(d) {
						return d[$scope.nestBy];
					})
					.entries($scope.data);
			} else {
				nestData = $scope.data;
			}

			$scope.json = JSON.stringify(nestData, undefined, 2);

		}

		// Watches
		$scope.$watch('data', $scope.init);
		$scope.$watch('data', $scope.printJSON, true);
		$scope.$watch('nestBy', $scope.printJSON);

	}];

	var link = function(scope, elem, attrs) {
		
		scope.saveJSON = function() {

			var encodedData = "data:text/json;charset=utf-8," + encodeURIComponent(scope.json);

			// Set hidden <a> tag attrs
			var anchor = document.getElementById('downloadJSON');

			anchor.setAttribute("href", encodedData);
			anchor.setAttribute("download", scope.saveAs + '.json');
			anchor.click(); // Initiate download

		}

	}

	return {
		restrict: 'E',
		templateUrl: 'js/json-modal/json-modal.template.html',
		scope: {
			data: '='
		},
		controller: controller,
		link
	}

}]);