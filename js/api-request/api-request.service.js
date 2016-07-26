// Define the 'api-request' service to wrap API calls
angular.module('apiRequest')
.factory('apiRequest' , ['$http' , 'config', function ($http, config) {

  // Default Params
  var baseURL = config.BASE_URL,
      course = config.COURSE,
      anonymized = config.ANONYMIZED;
     
  return {
    
    /* --- STUDENTS / GROUPS / COHORTS --- */
    students: function() {
      return $http({method: "POST",
        url: baseURL + "course/active-users",
        data: {course:course}})
    },

    groups: function() {
      return $http({method: "POST",
        url: baseURL + "course-instance/groups",
        data: {course:course}})
    },

    cohorts: function() {
      return $http({method: "POST",
        url: baseURL + "course-instance/cohorts",
        data: {course:course}})
    },

    groupUsers: function(group) {
      return $http({method: "POST",
        url: baseURL + "course-anonymized/group-users",
        data: {course:course , group:group}})
    },

    cohortUsers: function(cohort) {
      return $http({method: "POST",
        url: baseURL + "course-anonymized/cohort-users",
        data: {course:course , cohort:cohort}})
    },

    /* --- COURSE DATES --- */
    dates: function() {
      return $http({method: "POST",
        url: baseURL + "get-course/dates",
        data: {rcourseID:course}})
    },

    studentDates: function(student) {
      return $http({method: "POST",
        url: baseURL + "get-entity-course/dates",
        data: {"rcourseID":course , learnerID:student}})
    },

    /* --- METRICS (STUDENTS) --- */
    courseDuration: function(students, periodOne, periodTwo) {
      
      var dataObj = {};
      dataObj['rcourseID'] = course;
      dataObj['learners'] = students;
      dataObj[periodOne.prefix + periodOne.type] = periodOne.value;
      dataObj[periodTwo.prefix + periodTwo.type] = periodTwo.value;

      return $http({method:"POST",
        url: baseURL + "get-students/course-duration",
        data: dataObj
      });
    },

    courseLogins: function(students, periodOne, periodTwo) {

      var dataObj = {};
      dataObj['rcourseID'] = course;
      dataObj['learners'] = students;
      dataObj[periodOne.prefix + periodOne.type] = periodOne.value;
      dataObj[periodTwo.prefix + periodTwo.type] = periodTwo.value;

      return $http({method:"POST",
        url: baseURL + "get-students/course-logins",
        data: dataObj
      });
    },

    courseSessions: function(students, periodOne, periodTwo) {

      var dataObj = {};
      dataObj['rcourseID'] = course;
      dataObj['learners'] = students;
      dataObj[periodOne.prefix + periodOne.type] = periodOne.value;
      dataObj[periodTwo.prefix + periodTwo.type] = periodTwo.value;

      return $http({method:"POST",
        url: baseURL + "get-students/course-sessions",
        data: dataObj
      });
    },

    courseInteractions: function(students, periodOne, periodTwo) {

      var dataObj = {};
      dataObj['rcourseID'] = course;
      dataObj['learners'] = students;
      dataObj[periodOne.prefix + periodOne.type] = periodOne.value;
      dataObj[periodTwo.prefix + periodTwo.type] = periodTwo.value;

      return $http({method:"POST",
        url: baseURL + "get-students/course-interactions",
        data: dataObj
      });
    },

    engagement: function(students, periodOne, periodTwo) {

      var dataObj = {};
      dataObj['rcourseID'] = course;
      dataObj['learners'] = students;
      dataObj[periodOne.prefix + periodOne.type] = periodOne.value;
      dataObj[periodTwo.prefix + periodTwo.type] = periodTwo.value;

      return $http({method:"POST",
        url: baseURL + "calculate-students/individual-engagement",
        data: dataObj
      });
    },

    /* METRICS (GROUPSCOHORTS) */
    courseDurationGroupCohort: function(groupcohort, periodOne, periodTwo) {

      var dataObj = {};
      dataObj['rcourseID'] = course;
      dataObj['group-cohort'] = groupcohort;
      dataObj['anonymized'] = anonymized;
      dataObj[periodOne.prefix + periodOne.type] = periodOne.value;
      dataObj[periodTwo.prefix + periodTwo.type] = periodTwo.value;

      return $http({method:"POST",
        url: baseURL + "get-groupcohort/course-duration",
        data: dataObj
      });
    },

    courseLoginsGroupCohort: function(groupcohort, periodOne, periodTwo) {

      var dataObj = {};
      dataObj['rcourseID'] = course;
      dataObj['group-cohort'] = groupcohort;
      dataObj['anonymized'] = anonymized;
      dataObj[periodOne.prefix + periodOne.type] = periodOne.value;
      dataObj[periodTwo.prefix + periodTwo.type] = periodTwo.value;

      return $http({method:"POST",
        url: baseURL + "get-groupcohort/course-logins",
        data: dataObj
      });
    },

    courseSessionsGroupCohort: function(groupcohort, periodOne, periodTwo) {

      var dataObj = {};
      dataObj['rcourseID'] = course;
      dataObj['group-cohort'] = groupcohort;
      dataObj['anonymized'] = anonymized;
      dataObj[periodOne.prefix + periodOne.type] = periodOne.value;
      dataObj[periodTwo.prefix + periodTwo.type] = periodTwo.value;

      return $http({method:"POST",
        url: baseURL + "get-groupcohort/course-sessions",
        data: dataObj
      });
    },

    courseInteractionsGroupCohort: function(groupcohort, periodOne, periodTwo) {

      var dataObj = {};
      dataObj['rcourseID'] = course;
      dataObj['group-cohort'] = groupcohort;
      dataObj['anonymized'] = anonymized;
      dataObj[periodOne.prefix + periodOne.type] = periodOne.value;
      dataObj[periodTwo.prefix + periodTwo.type] = periodTwo.value;

      return $http({method:"POST",
        url: baseURL + "get-groupcohort/course-interactions",
        data: dataObj
      });
    },

    engagementGroupCohort: function(groupcohort, periodOne, periodTwo) {

      var dataObj = {};
      dataObj['rcourseID'] = course;
      dataObj['group-cohort'] = groupcohort;
      dataObj['anonymized'] = anonymized;
      dataObj[periodOne.prefix + periodOne.type] = periodOne.value;
      dataObj[periodTwo.prefix + periodTwo.type] = periodTwo.value;

      return $http({method:"POST",
        url: baseURL + "calculate-groupcohort/individual-engagement",
        data: dataObj
      });
    },

    /* CONCEPTS */
    events: function() {
      return $http({method: "POST",
        url: baseURL + "course/log-concepts",
        data: {course:course , "conceptType":"LearningTask"}})
    }

    /* ADDITIONAL REQUESTS GO HERE */

  }

}]);