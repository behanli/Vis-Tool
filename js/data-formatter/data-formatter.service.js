// Define 'dataFormatter' service for use by chart directives
angular.module('dataFormatter')
	.factory('dataFormatter' , ['apiRequest' , '$q', 
		function(apiRequest, $q) {

		return {

			/* Asynchronous Methods */
			students: function(params) {

				// Create parent promise
				var parentDefer = $q.defer();

				// Format period(s) if applicable
				params.periodOne = (params.periodOne) ? formatPeriod(params.periodOne) : null;
				params.periodTwo = (params.periodTwo) ? formatPeriod(params.periodTwo) : null;

				// Create promiseArray for each metric
				var promiseArray = [];
				params.metrics.forEach( function(metric) {
					var promise = apiRequest[metric](params);
					promiseArray.push(promise);
				});

				// Resolve promises in parallel
				$q.all(promiseArray).then( function(resArray) {

					var data = format(params.students , resArray);
					parentDefer.resolve(data);

					// Function to create an array of student objects with
					// keys for each metric
					function format(studentArray, metricValuesArray) {

						var data = [];

						studentArray.forEach( function(student) {
							// New student object
							var obj = {};
							obj.student = student;
							obj.groupcohort = 'NA';

							// Store each metric value in the student object
							metricValuesArray.forEach( function(metricObj , index) {
								obj[params.metrics[index]] = metricObj.data[student];
							});

							data.push(obj);
						});

						return data;
					}

				});

				// Return parent promise
				return parentDefer.promise;
			},

			groupsCohorts: function(params) {

				var parentDefer = $q.defer();

				// Format period(s) if applicable
				params.periodOne = (params.periodOne) ? formatPeriod(params.periodOne) : null;
				params.periodTwo = (params.periodTwo) ? formatPeriod(params.periodTwo) : null;

				// Resolve a given groupcohort
				function groupCohortPromise(groupCohort, defer) {

					params.groupCohort = groupCohort;

					var promiseArray = [],
							data = [];

					// Create promise for each metric
					params.metrics.forEach( function(metric) {

						metric = metric + 'GroupCohort'; // Make GroupCohort API calls
						var promise = apiRequest[metric](params);
						promiseArray.push(promise);
					});

					// Resolve promises in parallel
					$q.all(promiseArray).then( function(resArray) {
						
						defer.resolve( format(groupCohort , resArray) );

						function format(groupCohort , metricValuesArray) {

							var data = [];
							// Get studentarray for each groupcohort
							var studentArray = Object.keys(metricValuesArray[0].data).map(function(key){
								return key;
							});

							studentArray.forEach( function(student) {
								// New student object
								var obj = {};
								obj.student = student;
								obj.groupcohort = groupCohort;

								// Store each metric value in the student object
								for(var i=0; i<metricValuesArray.length; i++) {
									obj[params.metrics[i]] = metricValuesArray[i].data[student];
								}

								data.push(obj);
							});	

							return data;
						}

					});

				}

				// Create a promise for each groupcohort
				var promiseArray = [];

				params.groupsCohorts.forEach( function(groupCohort) {
					var defer = $q.defer();
					var promise = defer.promise;
					groupCohortPromise(groupCohort , defer); // Resolve
					promiseArray.push(promise);
				});

				// Format and resolve total array of students (all groups/cohorts)
				$q.all(promiseArray)
				.then( function(resArray) { // Array of arrays

					var data = [];
					for(var i=0; i<resArray.length; i++) {
						var data = data.concat(resArray[i]);
					}
					
					parentDefer.resolve(data);

				})

				// Return parent promise
				return parentDefer.promise;
			}

		}

		// Function to return formatted periodObj
		function formatPeriod(periodObj) {

			if (periodObj.type == 'Date') {
				periodObj.value = formatDate(periodObj.date);
			} else {
				periodObj.value = "concept='" + periodObj.event + "' and event='" + periodObj.eventFilter +"'";
			}

			// Internal function to return date in 'dd-MM-yyyy H:mm:ss' format
			function formatDate(date) {
				var days = date.getDate() < 10 ? "0" + date.getDate() : date.getDate(),
						month = (date.getMonth() + 1) < 10 ? "0" + (date.getMonth() + 1) : (date.getMonth() + 1),
						year = date.getFullYear(),
						time = "00:00:00"; // Default

				return days + "-" + month + "-" + year + " " + time;
			}

			return periodObj;
		}

	}]);