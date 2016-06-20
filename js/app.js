// Define main application 
var app = angular.module('myApp' , []);

// Define service to wrap API requests
app.factory('apiRequest' , function ($http) {
  return {
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
    var student = "student_1";
  
    apiRequest.courseDuration(student).success(function(data) {
      console.log(data);
    })


}]);
