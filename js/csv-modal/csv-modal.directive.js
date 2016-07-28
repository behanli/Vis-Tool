// Define 'csv-modal' directive
angular.module('csvModal')
.directive('csvModal', [ function() { 

	var controller = ['$scope', function($scope) { 

		$scope.init = function() {

			if(!$scope.data) return;

			$scope.saveAs = 'data';

		}

		// Watches
		$scope.$watch('data', $scope.init);

	}];

	var link = function(scope, elem, attrs) {

		// Print csv
		printCSV = function() {

			if(!scope.data) return;

			scope.csv = objArrToCSV(scope.data, ',' , '<br />');
			var pre = angular.element('#csvPre');
			pre[0].innerHTML = scope.csv;


		}

		// Save csv
		scope.saveCSV = function() {
			var csv = objArrToCSV(scope.data, ',' , '\n');

			var encodedData = "data:text/csv;charset=utf-8," + encodeURIComponent(csv);

			// Set hidden <a> tag attrs
			var anchor = document.getElementById('downloadCSV');

			anchor.setAttribute("href", encodedData);
			anchor.setAttribute("download", scope.saveAs + '.csv');
			anchor.click(); // Initiate download

		}

		// Watches
		scope.$watch('data', printCSV, true);

		// Function to convert obj array to csv with passed in delimiters
		function objArrToCSV(objArr, fieldDelim , lineDelim) {

			var string = "",
					keys = Object.keys(objArr[0]);

			// Print header
			keys.forEach( function( key, keyIndex ) {

				string += (keyIndex != keys.length - 1) ? key + fieldDelim : key + lineDelim;

			});

			// Print data
			objArr.forEach( function( obj, dataIndex ) {

				keys.forEach( function( key, keyIndex ) {

					string += (keyIndex != keys.length - 1) ? objArr[dataIndex][key] + fieldDelim : objArr[dataIndex][key];

				});

				string += lineDelim;

			});

			return string;
		}

	}

	return {
		restrict: 'E',
		templateUrl: 'js/csv-modal/csv-modal.template.html',
		scope: {
			data: '='
		},
		controller: controller,
		link: link
	}

}]);