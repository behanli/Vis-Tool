// Define main application 
var app = angular.module('myApp' , []);

// Define service to wrap API requests
app.factory('apiRequest' , function ($http) {
  return {
    
    students: function() {
      return $http({method: "POST",
        url: "http://kdeg-vm-10.scss.tcd.ie:9080/amase.services/analytics/course/active-users",
        data: {course:"sql_1"},
        headers: {"content-type":"application/json"}})
    },

    dates: function() {
      return $http({method: "POST",
        url: "http://kdeg-vm-10.scss.tcd.ie:9080/amase.services/analytics/get-course/dates",
        data: {rcourseID:"sql_1"},
        headers: {"content-type":"application/json"}})
    },

    studentDates: function(student) {
      return $http({method: "POST",
        url: "http://kdeg-vm-10.scss.tcd.ie:9080/amase.services/analytics/get-entity-course/dates",
        data: {"rcourseID":"sql_1" , learnerID:student},
        headers: {"content-type":"application/json"}})
    },

    courseDuration: function(student) {
      return $http({method: "POST",
        url: "http://kdeg-vm-10.scss.tcd.ie:9080/amase.services/analytics/get-student/course-duration",
        data: {rcourseID:"sql_1" , learnerID:student},
        headers: {"content-type":"application/json"}})
    }
    // Additional requests go here
  };
});

// Define main controller 
app.controller('mainCtrl' , ['$scope', 'apiRequest', 
  function($scope , apiRequest) {

    $scope.student = "student_15";

    apiRequest.students().then(function(response) {
      $scope.students = response.data;
    })

    apiRequest.dates().then(function(response) {
      $scope.dates = response.data;
    })

    apiRequest.studentDates($scope.student).then(function(response) {
      $scope.studentDates = response.data;
    })


}]);

// Define new bar chart directive
app.directive("myBarChart" , [ function() {

  return {
    restrict: 'E',
    link: function(scope , element , attrs) {

      // Constants
      var margin = {top: 25, right: 25, bottom: 25, left: 25},
          width = element[0].parentElement.offsetWidth, // Scale by width of col-sm-9
          height = 300,
          innerWidth = width - margin.left - margin.right,
          innerHeight = height - margin.top - margin.bottom,
          colour = "blue",
          yHeight = innerHeight;

      scope.$watch('studentDates' , function(newVal, oldVal) {

        if(!newVal) {
          return;
        } else {
          scope.$watch('dates' , function(newVal, oldVal) {

            if(!newVal) {
              return;
            }

            // D3 code

            var barWidth = innerWidth / scope.dates.length;

            // Scales & Axes
            var xScale = d3.time.scale()
                .domain(d3.extent(scope.dates , function(d) {
                  return new Date(d);
                }))
                .range([(barWidth / 2 ), innerWidth - (barWidth / 2 )]);

            var xAxis = d3.svg.axis()
                .scale(xScale)
                .orient('bottom')
                .ticks(d3.time.weeks,1)
                .tickFormat(d3.time.format("%b %d"));
                
            // Chart area
            var canvas = d3.select(element[0])
              .append("svg")
                .attr("width" , width)
                .attr("height" , height)
              .append("g")
                .attr("transform" , "translate(" + margin.left + "," + margin.top + ")");

            // Plot axes
            canvas.append("g")
              .call(xAxis)
              .attr("class" , "axis")
              .attr("transform" , "translate(" + 0 + "," + innerHeight + ")");

            // Plot bars
            var bars = canvas.selectAll('rect')
              .data(scope.studentDates);

            // Enter
            bars.enter().append('rect')
              .attr("x" , function(d) {
                return xScale(new Date(d)) - (barWidth / 2);
              })
              .attr("y" , innerHeight - yHeight)
              .attr("height" , yHeight)
              .attr("width" , barWidth)
              .attr("fill" , colour)
              .style("opacity" , 0.5);

          })
        }
      });
    }
  } 
}]);

