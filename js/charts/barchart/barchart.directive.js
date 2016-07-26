// Define 'barchart' directive
angular.module('charts')
.directive('barchart' ,  ['$window' , 'colourGenerator', 'config' , 
	function($window, colourGenerator, config) {

	// Controller
	var controller = [ '$window' , '$scope' ,
	function($window, $scope) {

		$scope.init = function() {

			$scope.yMetric = $scope.metrics[0].value;
			$scope.quantiles = ['None', 0.1, 0.25, 0.5, 0.75, 0.9];
			$scope.plotQuantile = $scope.quantiles[0];

		}

		// Populate select
		$scope.$watch('data', function() {

			if(!$scope.data) return;
			
			$scope.groupCohorts = d3.nest()
				.key( function(d) { return d.groupcohort; })
				.entries($scope.data)
				.map( function(elem) { return elem.key; });

			$scope.groupcohort = $scope.groupCohorts[0];

		});

		$scope.init();
	
		// Track window resize event
		$window.onresize = function() {
			$scope.$apply();
		}

	}];

	// Link
	var link = function(scope , elem , attrs) {
		
		// Init
		var margin = {top: 20, right: 30, bottom: 70, left: 50},
			width = '100%',
			height = config.CHART_HEIGHT,
			innerWidth,
			xScale = d3.scale.ordinal(),
			yScale = d3.scale.linear(),
			xAxis = d3.svg.axis().scale(xScale).orient("bottom"),
			yAxis = d3.svg.axis().scale(yScale).orient("left")
				.tickFormat( function(d) {
					return (d / 1000) >= 1 ? (d/1000) + 'K' : d;
				}),
			fill,
			bars,
			data;

		var	svg = d3.select('#chart')
			.attr("width" , "100%")
			.attr("height" , height);
		
		var	g = svg.append("g")
				.attr("transform" , "translate(" + margin.left + "," + margin.top + ")");
		
		var tooltip = d3.select('body')
			.append('div')
				.attr("class", "tooltip")
				.attr("opacity", 0); // Hidden
		
		var innerWidth = svg[0][0].getBoundingClientRect().width - margin.left - margin.right,
				innerHeight = svg[0][0].getBoundingClientRect().height - margin.top - margin.bottom;

		// Scale
		yScale.range([innerHeight, 0]);

		// Watches
		scope.$watch('data', render);
		scope.$watch('groupcohort', render);
		scope.$watch('yMetric', changeY);
		scope.$watch('plotAvg', overlayAvg);
		scope.$watch('plotQuantile', overlayQuantile);
		scope.$watch( function() {
			return angular.element($window)[0].innerWidth;
		}, resize);

		// Functions to handle asynchronous data and ui events

		// Function to render bar chart
		function render() {

			g.selectAll('*').remove();

			if(!scope.data) { 
				g.append('text')
					.text("Loading ...")
					.attr("class" , "loading")
					.attr("transform" , "translate(" + (innerWidth / 2) +
						"," + (innerHeight / 2) + ")");
				return;
			}

			fill = colourGenerator.colourScale(scope.data);

			// Subset data based on groupcohort selected
			data = [];

			d3.nest()
				.key( function(d) { return d.groupcohort; })
				.entries(scope.data)
				.map( function(nest) {
					if (nest.key == scope.groupcohort) {
						data = data.concat(nest.values);
					}
				});

			// Scales
			xScale
				.rangeRoundBands([0 , innerWidth] , 0.05)
				.domain( data.map( function(elem) {
					return elem.student;
				}));

			yScale.domain(yScaleDomain(data));

			// Selection
			bars = g.selectAll('rect').data(data /*, function(d) {
				return d.student; // Join by key
			}*/);

			// Enter
			bars.enter()
				.append('rect')
					.attr("height" , function(d) {
						return innerHeight - yScale(d[scope.yMetric]);
					})
					.attr("y" , function(d) {
						return yScale(d[scope.yMetric]);
					})
					.attr("width", 0)
					.attr("x" , function(d,i) {
						return xScale(d.student);
					})
					.attr("fill" , function(d) {
						return fill(d.groupcohort);
					})
				.on("mouseover" , function() {

						// Highlight student
						d3.select(this)
							.transition()
							.attr("opacity" , 0.5);

						// Display tooltip
						var student = d3.select(this).datum();

						tooltip//.transition()
							.style("opacity", 0.9);
						tooltip
							.html("<b>" + student.student + "</b>" + "<br>" + scope.yMetric + ": " + student[scope.yMetric])
							.style("left", (d3.event.pageX + 10) + "px")
							.style("top", (d3.event.pageY - 40) + "px");					

				})
				.on("mouseout" , function() {

						// Unhighlight student
						d3.select(this)
							.transition()
							.attr("opacity" , 1);

						// Hide tooltip
						tooltip
							.style("opacity", 0);

				});

			// Update
			bars
				.transition()
				.duration(750)
				.attr("width", xScale.rangeBand());

			// Axis
			g.append('g')
				.attr("transform", "translate(" + 0 + "," + innerHeight + ")") 
				.attr("class", "x axis")
				.call(xAxis)
			.selectAll('text')
				.attr("dy", 20)
				.attr("dx", -35)
				.attr("transform", "rotate(-45)")
				.attr("text-anchor", "start")
				.attr("class", data.length > 20 ? 'hidden' : '');

			g.append('g')
				.attr("class" , "y axis")
				.call(yAxis)
			.append('text')
				.style("font-size", "16px")
				.attr("transform" , "rotate(90)")
				.attr("dy", margin.left)
			.text(getMetricDisplay(scope.yMetric));

			// Render additional statistics
			overlayAvg();
			overlayQuantile();

		}

		function getMetricDisplay(metricValue) {
			for(var i = 0; i <  scope.metrics.length; i++) {
				if (scope.metrics[i].value == metricValue) return scope.metrics[i].display; 
			}
		}

		function changeY() {
			if(!scope.data) return;

			yScale.domain(yScaleDomain(data));

			bars
				.transition()
				.duration(750)
				.attr("height" , function(d) {
						return innerHeight - yScale(d[scope.yMetric]);
					})
				.attr("y" , function(d) {
					return yScale(d[scope.yMetric]);
				});

			g.select('.y.axis')
				.call(yAxis);
			g.select('.y.axis > text')
				.text(getMetricDisplay(scope.yMetric));

			// Render additional statistics
			overlayAvg();
			overlayQuantile();
		}

		function yScaleDomain(data) {
			
			/*if(data.length > 1) {
				return d3.extent(data, function(d) {
					return d[scope.yMetric];
				});
			} else {*/
				return [0 , d3.max(data, function(d) {
					return d[scope.yMetric];
				})];
			//}
		}

		function overlayAvg() {
			g.selectAll('.avg').remove();

			if(!scope.data || !scope.plotAvg) return;

			// Get average
			var avg = d3.mean(data, function(d) {
					return d[scope.yMetric];
			});

			console.log(avg);

			// Plot average
			g.append('rect')
				.attr("width", innerWidth)
				.attr("height", 0)
				.attr("x", 0 )
				.attr("y", yScale(avg))
				.attr("fill", "coral")
			.transition()
				.attr("height", 2)
				.attr("class", "avg");

			g.append('text')
				.attr("x", innerWidth)
				.attr("y", yScale(avg))
				.attr("text-anchor", "start")
				.attr("fill", "coral")
			.text( function() {
				return num = (avg / 1000) >= 1 ? d3.format(".0f")((avg / 1000)) + 'K' : d3.format(".2n")(avg);
			})
				.attr("class", "avg");
		}

		function overlayQuantile() {
			g.selectAll('.quantile').remove();
			
			if (!scope.data || scope.plotQuantile == 'None') return;

			// Sort array ascending
			var sortedArray = data.map( function(elem) {
				return elem[scope.yMetric];  // New array to prevent mutation of data
			})
			
			sortedArray.sort( ascending )

			function ascending(a, b) {
				if (a > b) {
					return 1;
				} 
				if (a < b) {
					return -1;
				}
				return 0; // equal
			}

			// Get specified quantile
			var quantile = d3.quantile(sortedArray, scope.plotQuantile);

			// PLot quantile
			g.append('rect')
				.attr("width", innerWidth)
				.attr("height", 0)
				.attr("x", 0 )
				.attr("y", yScale(quantile))
				.attr("fill", "darkgreen")
			.transition()
				.attr("height", 2)
				.attr("class", "quantile");

			g.append('text')
				.attr("x", innerWidth)
				.attr("y", yScale(quantile))
				.attr("text-anchor", "start")
				.attr("fill", "darkgreen")
			.text( function() {
				return num = (quantile / 1000) >= 1 ? d3.format(".0f")(quantile / 1000) + 'K' : d3.format(".2n")(quantile);
			})
				.attr("class", "quantile");
		}

		function resize() {
			// Update proportions
			innerWidth = svg[0][0].getBoundingClientRect().width - margin.left - margin.right;
			xScale.rangeRoundBands([0 , innerWidth] , 0.05);
      
      render();
		}

	}

	// Return object
	return {
		restrict: 'E',
		templateUrl: 'js/charts/barchart/barchart.template.html',
		link: link,
		controller: controller,
		scope: {
			data: '=',
			metrics: '='
		},
	}

}]);