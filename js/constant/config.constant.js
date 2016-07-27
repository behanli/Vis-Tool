// Define 'config' constant
angular.module('constant')
.constant('config', { 

	/* API-REQUEST */
	BASE_URL: //"http://kdeg-vm-10.scss.tcd.ie:8080/amase.services/analytics/",
						"http://sweep.scss.tcd.ie/amase.services/analytics/",
	ANONYMIZED: true,

	/* CHARTS */
	CHART_HEIGHT: 400,

	/* GROUPCOHORT / STUDENT CONTROLLER */
	DEFAULT_START_DATE: new Date('Oct 14, 2015'),
	DEFAULT_END_DATE: new Date('Jan 7, 2016')

});