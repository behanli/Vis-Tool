// Define 'navigation' directive
angular.module('navigation')
.directive('navigation' , function() {
	
	var link = function(scope) {
		var target = document.getElementById(scope.active);
		angular.element(target).addClass('active');
	}

	return {
		restrict: 'E',
		templateUrl: 'js/navigation/navigation.template.html',
		link: link,
		scope: {
			active: '@'
		}
	}

})