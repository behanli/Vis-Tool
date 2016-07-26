// Define 'png-modal' directive
angular.module('pngModal')
.directive('pngModal', [ function() { 

	var link = function(scope, elem, attrs) {
	
		/*scope.svgToPng = function() {

			// Get chart elem
			var chart = document.getElementById(attrs.chartId);

			// Serialize chart (svg) html
			var html = new XMLSerializer().serializeToString(chart);

			var imgsrc = 'data:image/svg+xml;base64,'+ btoa(html);

			// Get canvas and draw image
			var canvas = document.querySelector('canvas'),
					context = canvas.getContext('2d');

			var image = new Image;
			image.src = imgsrc;

			// On image load
			image.onload = function() {
				context.drawImage(image, 0, 0);

				// TODO: Download on click

			}

			
		}*/
	
	}

	return {
		restrict: 'E',
		templateUrl: 'js/png-modal/png-modal.template.html',
		link: link
	}

}]);