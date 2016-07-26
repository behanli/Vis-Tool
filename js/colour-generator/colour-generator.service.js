// Define 'colour-generator' service
angular.module('colourGenerator')
	.factory('colourGenerator' , function() {
		
		return {
			
			colourScale: function(data) {

				// Nest data by groupcohort
				var nested_data = d3.nest()
					.key( function(d) { return d.groupcohort; })
					.entries(data);

				// Use d3 colour scales if no. of groups < 10 (aesthetically better)
				if (nested_data.length <= 10) {
					fill = d3.scale.category10()
						.domain( nested_data.map( function(elem) { return elem.key; }) )
				} else { // Create unique colour for each group cohort
					fill = d3.scale.ordinal()
					.domain(nested_data.map( function(elem) { return elem.key} ))
					.range(rgbScale(nested_data.length));
				}

				return fill;

				function rgbScale(numColours) {
						
						var colours = [];

						for(i=0; i<numColours; i++) {
							colours.push( rgbGen() );
						}

						return colours;

						function rgbGen() {

							var r = Math.round(Math.random() * 254),
								g = Math.round(Math.random() * 254),
								b = Math.round(Math.random() * 254);
							
							return "rgb(" + r + "," + g + "," + b + ")";
						}			
				}
			
			}
		
		}
	});