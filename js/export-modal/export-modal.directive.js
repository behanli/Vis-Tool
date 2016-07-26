// Define 'png-modal' directive
angular.module('exportModal')
.directive('exportModal', ['$http', function($http) { 

	var controller = ['$scope', function($scope) { 

		// Default params
		$scope.init = function() {
			$scope.downloadOptions = ['.png', '.svg'];
			$scope.downloadAs = $scope.downloadOptions[0];
			$scope.saveAs = 'chart';
		}

	}];

	var link = function(scope, elem, attrs) {
	
		scope.export = function() {

			/* Get svg.css to create inline style;
				export functionality nested within promise */
			$http.get('css/svg.min.css').then( function(res) {

				var style = res.data; // svg css styling
				var url;

				// Get chart elem & proportions for hidden canvas
				var chart = document.getElementById(attrs.chartId),
					width = chart.getBoundingClientRect().width,
					height = chart.getBoundingClientRect().height;

				// Serialize chart (svg) html
				var html = new XMLSerializer().serializeToString(chart);

				// Nest style within <svg></svg>
				var endIndex = html.indexOf('</svg>');
				html = html.slice(0, endIndex) + "<style>" + style + "</style>" + html.slice(endIndex, html.length);

				if(scope.downloadAs == '.png') {

					var imgsrc = 'data:image/svg+xml;base64,'+ btoa(html);

					// Get canvas and draw image (hidden)
					var canvas = document.querySelector('canvas');
					canvas.setAttribute("width", width);
					canvas.setAttribute("height", height + 20);

					var	context = canvas.getContext('2d');

					var image = new Image;
					image.src = imgsrc;

					// On image load
					image.onload = function() {
						
						context.drawImage(image, 0, 0);

						url = canvas.toDataURL("image/png");

						// Set hidden <a> tag attrs
						var anchor = document.getElementById('downloadChart');

						anchor.setAttribute("href", url);
						anchor.setAttribute("download", scope.saveAs + scope.downloadAs);
						anchor.click();

					}

				} else { // svg

					url = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(html);

					// Set hidden <a> tag attrs
					var anchor = document.getElementById('downloadChart');

					anchor.setAttribute("href", url);
					anchor.setAttribute("download", scope.saveAs + scope.downloadAs);
					anchor.click();

				} 

			});

		}
	
	}

	return {
		restrict: 'E',
		templateUrl: 'js/export-modal/export-modal.template.html',
		controller: controller,
		link: link
	}

}]);