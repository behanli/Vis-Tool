// Define 'scatterplot' directive
angular.module('charts')
.directive('scatterplot' , ['$window', 'colourGenerator', 'config',
 function($window, colourGenerator, config) {

	var controller = [ '$window' , '$scope' , function($window, $scope) {
		
		// Init 
		$scope.init = function() {

			if ($scope.metrics.length > 1) {
				$scope.xMetric = $scope.metrics[0].value;
				$scope.yMetric = $scope.metrics[1].value;
			} else {
				$scope.xMetric = $scope.yMetric = $scope.metrics[0].value;
			}

			$scope.scaleMetrics = [{value:'none' , display:'None'}].concat($scope.metrics);
			$scope.scaleBy = $scope.scaleMetrics[0].value;

		}

		$scope.init();

		// Track window resize event
		$window.onresize = function() {
			$scope.$apply();
		}

	}];

	var link = function(scope , elem, attrs) {
		
		// Init
		var margin = {top: 20, right: 20, bottom: 50, left: 50},
			width = '100%',
			height = config.CHART_HEIGHT,
			xScale = d3.scale.linear().nice(),
			yScale = d3.scale.linear().nice(),
			rScale = d3.scale.sqrt(),
			xAxis = d3.svg.axis().scale(xScale).orient("bottom"),
			yAxis = d3.svg.axis().scale(yScale).orient("left")
				.tickFormat( function(d) {
					return (d / 1000) >= 1 ? (d/1000) + 'K' : d;
				}),
			radius = 5,
			opacity = 0.6,
			fill,
			circles,
			data;

		var svg = d3.select('#chart')
			.attr("width" , width)
			.attr("height" , height);

		var g = svg.append('g')
			.attr("transform" , "translate(" + margin.left + "," + margin.top + ")");

		var tooltip = d3.select('body')
			.append('div')
				.attr("class", "tooltip")
				.attr("opacity", 0); // Hidden

		var innerWidth = svg[0][0].getBoundingClientRect().width - margin.left - margin.right, // 750
			innerHeight = svg[0][0].getBoundingClientRect().height - margin.top - margin.bottom; // 350

		// Scales
		xScale.range([0 , innerWidth]);
		yScale.range([innerHeight , 0]);
		rScale.range([2 , 20]);

		// Watches
		scope.$watch( function() {
			return angular.element($window)[0].innerWidth;
		}, resize);
		scope.$watch('data', render);
		scope.$watch('xMetric', moveX); /* Modify render() to handle additional functionality */
		scope.$watch('yMetric', moveY);
		scope.$watch('scaleBy', scale);

		// Functions to handle asynchronous data and ui events

		function render() {

			g.selectAll('*').remove();

			if (!scope.data) {
				g.append('text')
					.text("Loading ...")
					.attr("class" , "loading")
					.attr("transform" , "translate(" + (innerWidth / 2) +
						"," + (innerHeight / 2) + ")");
				return;
			}

			data = scope.data;

			fill = colourGenerator.colourScale(data);

			// Scale domains
			xScale
				.domain(d3.extent(data , function(d) {
					return d[scope.xMetric];
				}));
			yScale
				.domain(d3.extent(data , function(d) {
					return d[scope.yMetric];
				}));

			// Seletion
			circles = g.selectAll('circle').data(data);

			// Enter
			circles.enter().append('circle')
				.attr("r" , 0)
				.attr("stroke" , function(d) {
					return fill(d.groupcohort);
				})
				.attr("fill", function(d) {
					return fill(d.groupcohort);
				})
				.attr("opacity", opacity)
				.on("mouseover" , function() {

						// Highlight student
						d3.select(this)
							.transition()
							.attr("fill-opacity" , 0);
						
						// Display tooltip
						var student = d3.select(this).datum();
						
						tooltip//.transition()
							.style("opacity", 0.9);
						tooltip
							.style("height", 70 + "px") // Adjust for additional information
							.html( function() {
								var string = "<b>" + student.student + "</b><br>";
								string += student.groupcohort == 'NA' ? '' : "<em>" + student.groupcohort + "</em><br>";
								string += scope.xMetric + ": " + student[scope.xMetric]
									+ "<br>" + scope.yMetric + ": " + student[scope.yMetric];
								return string;
							})
							.style("left", (d3.event.pageX + 10) + "px")
							.style("top", (d3.event.pageY - 40) + "px");
				})
				.on("mouseout", function() {

						// Unhighlight student
						d3.select(this)
							.transition()
							.attr("fill-opacity", 1);

						// Hide tooltip
						tooltip
							.style("opacity", 0);
				});

			// Update
			circles
				.attr("cx" , function(d) {
					return xScale( d[scope.xMetric] );
				})
				.attr("cy", function(d) {
					return yScale( d[scope.yMetric] );
				})
				.transition()
				.duration(750)
				.attr("r", function(d) {
					return scope.scaleBy == 'none' ? radius : scaleDomain(d);
				});

			// Axis
			g.append('g')
				.attr("class" , 'x axis')
				.attr("transform" , "translate(" + 0 + "," + innerHeight + ")")
				.call(xAxis)
			.append('text')
				.style("font-size", "16px")
				.attr("x" , innerWidth)
				.attr("dy" , margin.bottom - 5)
				.attr("text-anchor" , "end")
			.text(getMetricDisplay(scope.xMetric));

			g.append('g')
				.attr("class" , 'y axis')
				.call(yAxis)
			.append('text')
				.style("font-size", "16px")
				.attr("transform" , "rotate(90)")
				.attr("dy", margin.left)
			.text(getMetricDisplay(scope.yMetric));
		}

		function moveX() {

			if(!scope.data) return;

		xScale
				.domain(d3.extent(scope.data , function(d) {
					return d[scope.xMetric];
				}));

			circles
				.transition()
				.duration(750)
				.attr("cx", function(d) {
					return xScale( d[scope.xMetric] );
				});

			g.select('.x.axis')
				.call(xAxis);
			g.select('.x.axis > text')
				.text(getMetricDisplay(scope.xMetric));
		}

		function moveY() {
			if(!scope.data) return;

			yScale
				.domain(d3.extent(scope.data , function(d) {
					return d[scope.yMetric];
				}));

			circles
				.transition()
				.duration(750)
				.attr("cy", function(d) {
					return yScale( d[scope.yMetric] );
				});

			g.select('.y.axis')
				.call(yAxis);
			g.select('.y.axis > text')
				.text(getMetricDisplay(scope.yMetric));
		
		}

		function scale() {

			if(!scope.data) return;

			circles
				.transition()
				.duration(1000)
				.attr("r", function(d) {
					return scope.scaleBy == 'none' ? radius : scaleDomain(d);
				});
		}

		function scaleDomain(d) {
				
			rScale.domain(d3.extent(scope.data, function(d) {
				return d[scope.scaleBy];
			}));

			return rScale( d[scope.scaleBy] );

		}

		function getMetricDisplay(metricValue) {
			for(var i = 0; i <  scope.metrics.length; i++) {
				if (scope.metrics[i].value == metricValue) return scope.metrics[i].display; 
			}
		}

		function resize() {
			// Update proportions
			innerWidth = svg[0][0].getBoundingClientRect().width - margin.left - margin.right;
			xScale.range([0 , innerWidth]);

			// Responsive axis ticks
			xAxis.ticks( innerWidth < 630 ? (innerWidth < 400 ? 3 : 6) : 10 );

			render();
		}
	}

	return {
		restrict: 'E',
		templateUrl: 'js/charts/scatterplot/scatterplot.template.html',
		link: link,
		controller: controller,
		scope: {
			data: '=',
			metrics: '=',
		}
	}

}]);