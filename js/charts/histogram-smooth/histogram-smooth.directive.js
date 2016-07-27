// Define 'histogram-smooth' directive
angular.module('charts')
.directive('histogramSmooth', ['$window', 'colourGenerator', 'config', 
	function($window, colourGenerator, config) { 

	var controller = ['$scope', function($scope) { 

		// Init
		$scope.init = function() {
			$scope.xMetric = $scope.metrics[0].value;
			$scope.bins = 10;
		}

		$scope.init();

		// Track window resize event
		$window.onresize = function() {
			$scope.$apply();
		}

	}];

	var link = function(scope, elem, attrs) {

		// Init
		var margin = {top: 40, right: 20, bottom: 45, left: 65},
			width = '100%',
			height = config.CHART_HEIGHT,
			innerWidth,
			xScale = d3.scale.linear(),
			yScale = d3.scale.linear(),
			xAxis = d3.svg.axis().scale(xScale).orient("bottom"),
			yAxis = d3.svg.axis().scale(yScale).orient("left"),
			fill,
			line;

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
		scope.$watch('data', render, true);
		scope.$watch('bins', render);
		scope.$watch('xMetric', render);
		scope.$watch('plotAvg', overlayAvg);
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

			fill = colourGenerator.colourScale(scope.data);

			// Scales
			xScale
				.domain( d3.extent(scope.data, function(d) {
					return d[scope.xMetric];
				}))
				.range([0, innerWidth])
				.clamp(true); // Ensure hist tails fall within output range

			// Find groupscohort selected
			var groupscohorts = d3.nest()
				.key( function(d) { return d.groupcohort; })
				.entries(scope.data)
				.map( function(elem) { return elem.key; });

			/* For each groupcohort, draw smooth histogram
			 	NOTE: not a density function!							*/
			groupscohorts.forEach( function(groupcohort) {

				var data = [];

				// Subset data based on groupcohort selected
				d3.nest()
					.key( function(d) { return d.groupcohort; })
					.entries(scope.data)
					.map( function(nest) {
						if (nest.key == groupcohort) {
							data = data.concat(nest.values);
						}
					});

				// Get hist data
				var histData = d3.layout.histogram()
					.value( function(d) {
						return d[scope.xMetric];
					})
					.bins(scope.bins) // Adjust
					.frequency(false) // Relative
					(data);

				var lowerX = histData[0].x,
						upperX = histData[histData.length - 1].x,
						dx = histData[0].dx;

				// Modify data to include lower & upper tails
				var lowBound = (lowerX - dx) < 0 ? 0 : lowerX - dx;
				histData.unshift( {x: lowBound, y: 0 } );
				histData.push( {x: upperX + dx, y: 0 } );

				yScale
				.domain([ 0 , d3.max(histData, function(d) {
					return d.y;
				})]);

				line = d3.svg.line()
					.x( function(d) {
						return xScale(d.x);
					})
					.y( function(d) {
						return yScale(d.y);
					})
					.interpolate("basis"); // Smooth lines

				// Draw line
				g.append('path')
				.datum(histData)
					.attr("d", line)
					.style("fill", fill(groupcohort))
					.style("fill-opacity", 0.2)
					.style("stroke", fill(groupcohort))
					.style("stroke-width", "2px")
				.on("mouseover", function() {
					d3.select(this)
						.style("fill-opacity", 0.8);

					tooltip
						.html("<em>" + groupcohort + "</em>")
						.style("left", (d3.event.pageX + 10) + "px")
						.style("top", (d3.event.pageY - 40) + "px")
						.style("height", "25px")
						.style("opacity", 0.9);
				})
				.on("mouseout", function() {
					d3.select(this)
						.style("fill-opacity", 0.2);

					tooltip
						.style("opacity", 0);
				});

				// Draw average
				var avg = d3.mean(data, function(d) {
					return d[scope.xMetric];
				});

				var xy = [ {x:xScale(avg), y:0}, {x:xScale(avg), y:innerHeight} ];
						avgLine = d3.svg.line()
							.x( function(d) {
								return d.x;
							})
							.y( function(d) {
								return d.y;
							});

				// Line
				g.append("path").datum(xy)
					.attr("class", "avgLine")
					.attr("d", avgLine)
					.style("fill", "none")
					.style("stroke", fill(groupcohort))
					.style("stroke-width", "0px")
					.style("stroke-dasharray", "6,3");

				// Label
				g.append("text")
					.attr("class", "avgText")
					.attr("text-anchor", "start")
					.attr("transform", "translate(" + xScale(avg) + "," + 0 + ")rotate(-45)")
					.attr("dy", -5)
					.attr("fill", fill(groupcohort))
					.style("font-size", "0px")
				.text( (avg / 1000 ) > 1 ? d3.format(",.0f")(avg) : d3.format(".2n")(avg) );

			});
				
			// Axes, labels
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
			.text("Frequency");

			// Render additional statistics
			overlayAvg();

		}

		function getMetricDisplay(metricValue) {
			for(var i = 0; i <  scope.metrics.length; i++) {
				if (scope.metrics[i].value == metricValue) return scope.metrics[i].display; 
			}
		}

		function overlayAvg() {
			if(!scope.data) return;

			d3.selectAll('.avgLine')
				.style("stroke-width", (scope.plotAvg) ? "2px" : "0px" );
			d3.selectAll(".avgText")
				.style("font-size", (scope.plotAvg) ? "14px" : "0px" );
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
		templateUrl: 'js/charts/histogram-smooth/histogram-smooth.template.html',
		controller: controller,
		link: link,
		scope: {
			data: '=',
			metrics: '='
		}
	}

}]);