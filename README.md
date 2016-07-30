# Vis-Tool
A dynamic tool for the visualisation of online course data. The tool makes use of the **Angular JS** framework for the filtering of views with the visualisations themselves created using the **D3.js** API. Data for the tool is retrieved in a **RESTful** like manner.

The tool operates on a student, group and course-concept level with an associated tab for each view. The user of the tool can filter over a number of variables before producing the required visualisation. Similarly, the data, of which a given visualisation is comprised, is also presented. Full export options for both the visualisations and data are also available.

----

## Installation Instructions
To run the tool, clone this repository into the directory of your local server. Within your browser, navigate to the following url: *localhost/Vis-Tool/*. By default, the tool will open on the students tab.

----

## Developer Instructions
The following is a high-level overview of the tool grouped by module (sub-directories within *js*). Particular emphasis is given to how the tool operates *i.e.* how the tool retrieves the relevant data, formats the data and plots the associated visualisation.

### api-request
This is an angular service that wraps the API calls made to back-end mySQL database. 

### charts

### colour-generator

### constant

### csv-modal

### data-formatter

### display-data

### export-chart-modal

### json-modal

### navigation

### period-selector

### routing

### tabs