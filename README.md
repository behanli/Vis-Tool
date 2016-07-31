# Vis-Tool
A dynamic tool for the visualisation of online course data. The tool makes use of the **Angular JS** framework for the filtering of views with the visualisations themselves created using the **D3.js** API. Data for the tool is retrieved in a **RESTful** like manner.

The tool operates on a student, group and course-concept level with an associated tab for each view. The user of the tool can filter over a number of variables before producing the required visualisation. Similarly, the data, of which a given visualisation is comprised, is also presented. Full export options for both the visualisations and data are also available.

----

## Installation Instructions
To run the tool, clone this repository into the directory of your local server. Within your browser, navigate to the following url: *localhost/Vis-Tool/*. By default, the tool will open on the students tab.

----

## Developer Instructions
The following is a high-level overview of the tool grouped by module (sub-directories within *js*). Particular emphasis is given to how the tool operates *i.e.* how the tool retrieves the relevant data, formats the data and plots the associated visualisation.

### index.html
The main *html* file with the application. The relevant libraries used by the tool are loaded here via *CDNs*. Similarly, the application specific *js* files are loaded here. This file does not contain any inner body markup with all content injected via routing. The main application module, *app.js*, is inserted into this file via the standard angular *ng-app* directive.

### app.js
The central module upon which each of the sub modules (located within the *js* directory) are injected.

### api-request
A service that wraps the API calls made to the back-end database. 

### charts
The primary charting module. Each chart type is initialised as a directive. 
The following charts are implemented: 
*barchart 
*scatterplot
*histogram
*histogram-smooth (line chart)

While each chart differs in terms of its output and associated controls, they also share a lot of common functionality. They all make use of the same data array passed in via an isolate scope. Similarly, they each contain *watches* upon which to modify the chart *e.g* a change of data, window resize etc.

### colour-generator
A service that returns a scale to generate different colours used by the chart directives. Colouring is processed via groupcohort (see data-formatter). For each groupcohort input there is exactly one colour output.

### constant
A configuration file that hold some constants used throughout the tool. 

### csv-modal
A directive used to display the data array in a *csv* format with the ability to export the data as a csv file.

### data-formatter
An intermediary service that formats the data as returned by the API requests into a usable format for the chart directives. This service contains two functions: **students**(*params*) and **groupsCohorts**(*params*).

The *params* parameter is an object that is passed in via the filter panel on each tab. It contains variables such as the selected course, students / groups, selected metrics and the period of interest.

For each metric selected, the relevant data is retrieved (aysnchronously via *api-request*) before being aggregated into an array of objects with each object representing a student from the filtered selection. Each object also contains the groupcohort of the given student. This value will be *'NA'* for any calls made from the student tab.

Both of the above mentioned functions return a promise that is then resolved on the calling tab controller before being passed to the selected chart directive.

An example of the data format can be seen as follows:

	[
		{
			student: "student_1",
			groupcohort: #
			metric_1: #
			.
			.
			metric_M: #
		},
		.
		.
		{
			student: "student_N"
			groupcohort: #
			metric_1: #
			.
			.
			metric_M: #
		}
	]

### display-data
A directive to display the data in a table with the ability to manipulate the data with any changes made reflected instantaneously in the accompanying chart.

### export-chart-modal
A directive to allow for the export of a chart in either *png* or *svg* format.

### json-modal
A directive to allow for the exportation of the data in *JSON* format.

### navigation
A directive used to handle the top navigation bar used throughout the tool. This directive is passed the 'active' tab via an isolated scope which allows for the special formatting of that tab via *css*.

### period-selector
A directive used to handle the period of interest within each tab filter. Using this directive, a user can filter by date or an event of interest. Period objects (initialised within tab controllers) are passed to this directive via an isolate scope (via two-way binding) with the relevant changes being made on the directive side.

### routing
A routing configuration to allow the tool to function as a *single page application*. This configuration works in conjunction with the *navigation* directive. By default, the tool is initialised to the students tab.

### tabs
The main module within the tool. Bound to this module is a tab representing students, groupscohorts and course-concepts. Each tab comes with its own controller and template.

Each tab controls the logic concerning the selection of variables and the retrieval of data (via their respective controllers). Similarly, each tab also controls the visual aspect of the tool, such as the filter panel and the chart area, (via their respective templates). 

Bound to each controller is the central data array used throughout the tool. This data is formatted via the injected *data-formatter* service.