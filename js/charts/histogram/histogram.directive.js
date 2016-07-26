// Define 'histogram' directive
angular.module('charts')
.directive('histogram', ['$window', 'colourGenerator', 'config',
 function($window, colourGenerator, config) {

	var controller = [ '$window' , '$scope', 'dataFormatter', 
	function($window, $scope, dataFormatter) {

			// Init
			$scope.init = function() {
				$scope.xMetric = $scope.metrics[0].value;
				$scope.bins = 20;
				$scope.frequencyType = ['Relative', 'Absolute'];
				$scope.frequency = $scope.frequencyType[0]; // Relative frequency
			}

			$scope.init();

			// Populate select
			$scope.$watch('data', function() {
				
				if(!$scope.data) return;

				$scope.groupCohorts = d3.nest()
					.key( function(d) { return d.groupcohort; })
					.entries($scope.data)
					.map( function(elem) { return elem.key; });

				$scope.groupcohort = $scope.groupCohorts[0];

			});

			// Track window resize event
			$window.onresize = function() {
				$scope.$apply();
			}
	}];

	var link = function(scope, elem, attrs) {

		// Init
		var margin = {top: 20, right: 20, bottom: 45, left: 65},
			width = '100%',
			height = config.CHART_HEIGHT,
			innerWidth,
			xScale = d3.scale.linear(),
			yScale = d3.scale.linear(),
			xAxis = d3.svg.axis().scale(xScale).orient("bottom"),
			yAxis = d3.svg.axis().scale(yScale).orient("left"),
			fill,
			barPadding = 1,
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
		yScale
			.range([innerHeight , 0]);

		// Watches
		scope.$watch('data', render);
		scope.$watch('groupcohort', render);
		scope.$watch('xMetric', render);
		scope.$watch('bins', render);
		scope.$watch('frequency', render);
		scope.$watch( function() {
			return angular.element($window)[0].innerWidth;
		}, resize);

		// Functions
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

			// Track colour of groupcohort selected
			fill = colourGenerator.colourScale(scope.data)(scope.groupcohort);
			
			data = [];

			// Subset data based on groupcohort selected
			d3.nest()
				.key( function(d) { return d.groupcohort; })
				.entries(scope.data)
				.map( function(nest) {
					if (nest.key == scope.groupcohort) {
						data = data.concat(nest.values);
					}
				});

			xScale
				.domain( d3.extent(data, function(d) {
					return d[scope.xMetric];
				}))
				.range([0, innerWidth]);

			var histData = d3.layout.histogram()
				.value( function(d) {
					return d[scope.xMetric];
				})
				.bins(scope.bins)
				.frequency(scope.frequency == 'Absolute' ? true: false)
				// Additional histogram properties here
			(data); // Call layout on data

			yScale
				.domain([ 0 , d3.max(histData, function(d) {
					return d.y;
				})]);

			// Selection
			bars = g.selectAll('rect').data(histData);

			// Enter 
			bars.enter()
				.append('rect')
					.attr("height", function(d) {
						return innerHeight - yScale(d.y)
					})
					.attr("y", function(d) {
						return yScale(d.y)
					})
					.attr("x", function(d) {
						return xScale(d.x);
					})
					.attr("width", function(d) {
							return /*xScale(d.dx) - barPadding*/ (innerWidth / scope.bins) - barPadding;
					})
					.attr("fill", fill)
					.on("mouseover", function() {

							// Highlight bin
							d3.select(this)
								.transition()
								.attr("opacity" , 0.5);

							// Display tooltip
							var bin = d3.select(this).datum();
							
							tooltip//.transition()
								.style("opacity", 0.9);
							tooltip
								.html( function() {
									
									var from = (bin.x / 1000) > 1 ? d3.format(",.0f")(bin.x) : d3.format(".3n")(bin.x);
									var to = (bin.x + bin.dx) / 1000 > 1 ? d3.format(",.0f")(bin.x + bin.dx) : d3.format(".3n")(bin.x + bin.dx);
									var freq = d3.format(".3n")(bin.y);

									return "<b>Bin</b><br>" + from + " - " + to +
									"<br> Freq: " + freq;
								})
								.style("left", (d3.event.pageX + 10) + "px")
								.style("top", (d3.event.pageY - 40) + "px");	

					})
					.on("mouseout", function() {

							// Unhighlight bin
							d3.select(this)
								.transition()
								.attr("opacity" , 1);

							// Hide tooltip
							tooltip
								.style("opacity", 0);

					});

			// Axes
			g.append('g')
				.attr("transform", "translate(" + 0 + "," + innerHeight + ")") 
				.attr("class", "x axis")
				.call(xAxis)
			.append('text')
				.style("font-size", "16px")
				.attr("x" , innerWidth)
				.attr("dy" , margin.bottom - 5)
				.attr("text-anchor" , "end")
			.text(getMetricDisplay(scope.xMetric));				

			g.append('g')
				.attr("class" , "y axis")
				.call(yAxis)
			.append('text')
				.style("font-size", "16px")
				.attr("transform" , "rotate(90)")
				.attr("dy", margin.left - 5)
			.text( scope.frequency + " Frequency");

		}

		function getMetricDisplay(metricValue) {
			for(var i = 0; i <  scope.metrics.length; i++) {
				if (scope.metrics[i].value == metricValue) return scope.metrics[i].display; 
			}
		}	

		function resize() {
			// Update proportions
			innerWidth = svg[0][0].getBoundingClientRect().width - margin.left - margin.right;
			xScale.range([0 , innerWidth] , 0.05);

			// Responsive axis ticks
			xAxis.ticks( innerWidth < 630 ? (innerWidth < 400 ? 3 : 6) : 10 );
      
      render();
		}

	}

	return {
		restrict: 'E',
		templateUrl: 'js/charts/histogram/histogram.template.html',
		link: link,
		controller: controller,
		scope: {
			data: '=',
			metrics: '='
		}
	}

}]);