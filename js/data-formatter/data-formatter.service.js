// Define 'dataFormatter' service for use by chart directives
angular.module('dataFormatter')
	.factory('dataFormatter' , ['apiRequest' , '$q', 
		function(apiRequest, $q) {

		return {

			/* Asynchronous Methods */
			students: function(students , metrics, periodOne, periodTwo) {

				// Create parent promise
				var parentDefer = $q.defer();

				// Format period(s)
				periodOne = formatPeriod(periodOne);
				periodTwo = formatPeriod(periodTwo);

				// Create promiseArray for each metric
				var promiseArray = [];
				metrics.forEach( function(metric) {
					var promise = apiRequest[metric](students, periodOne, periodTwo);
					promiseArray.push(promise);
				});

				// Resolve promises in parallel
				$q.all(promiseArray).then( function(resArray) {

					var data = format(students , resArray);
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
								obj[metrics[index]] = metricObj.data[student];
							});

							data.push(obj);
						});

						return data;
					}

				});

				// Return parent promise
				return parentDefer.promise;
			},

			groupsCohorts: function(groupsCohorts , metrics, periodOne, periodTwo) {

				var parentDefer = $q.defer();

				// Format period(s)
				periodOne = formatPeriod(periodOne);
				periodTwo = formatPeriod(periodTwo);

				// Resolve a given groupcohort
				function groupCohortPromise(groupCohort, defer) {

					var promiseArray = [],
						data = [];

					// Create promise for each metric
					metrics.forEach( function(metric) {

						metric = metric + 'GroupCohort'; // Make GroupCohort API Call
						var promise = apiRequest[metric](groupCohort, periodOne, periodTwo);
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
									obj[metrics[i]] = metricValuesArray[i].data[student];
								}

								data.push(obj);
							});	

							return data;
						}

					});

				}

				// Create a promise for each groupcohort
				var promiseArray = [];
				groupsCohorts.forEach( function(groupCohort) {
					var defer = $q.defer();
					var promise = defer.promise;
					groupCohortPromise(groupCohort , defer);
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
				periodObj.value = "concept='" + periodObj.event + "' and event='concept-completed'";
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