// Define the 'api-request' service to wrap API calls
angular.module('apiRequest')
.factory('apiRequest' , ['$http' , 'config', function ($http, config) {

  // Default Params
  var baseURL = config.BASE_URL,
      anonymized = config.ANONYMIZED;
     
  return {

    /* COURSES */
    courses: function() {
      return $http({method: "POST",
        url: baseURL + "database/courses"
      });
    },

    /* and Events */
    eventFilters: function(course) {

      var data = {};
      data.select = "DISTINCT(event)";
      data.where = "course='" + course + "'";
      
      return $http({method: "POST",
        url: baseURL + "query/parts",
        data: data
      });
    },

    /* events */
    events: function(course) {
      return $http({method: "POST",
        url: baseURL + "course/log-concepts",
        data: {course:course , "conceptType":"LearningTask"}})
    },
    
    /* --- STUDENTS / GROUPS / COHORTS --- */
    students: function(course) {
      return $http({method: "POST",
        url: baseURL + "course/active-users",
        data: {course:course}})
    },

    groups: function(course) {
      return $http({method: "POST",
        url: baseURL + "course-instance/groups",
        data: {course:course}})
    },

    cohorts: function(course) {
      return $http({method: "POST",
        url: baseURL + "course-instance/cohorts",
        data: {course:course}})
    },

    groupUsers: function(course, group) {
      return $http({method: "POST",
        url: baseURL + "course-anonymized/group-users",
        data: {course:course , group:group}})
    },

    cohortUsers: function(course, cohort) {
      return $http({method: "POST",
        url: baseURL + "course-anonymized/cohort-users",
        data: {course:course , cohort:cohort}})
    },

    /* --- COURSE DATES --- */
    dates: function(course) {
      return $http({method: "POST",
        url: baseURL + "get-course/dates",
        data: {rcourseID:course}})
    },

    studentDates: function(course, student) {
      return $http({method: "POST",
        url: baseURL + "get-entity-course/dates",
        data: {"rcourseID":course , learnerID:student}})
    },

    /* --- METRICS (STUDENTS) --- */
    courseDuration: function(course, students, periodOne, periodTwo) {
      
      var dataObj = {};
      dataObj['rcourseID'] = course;
      dataObj['learners'] = students;
      dataObj[periodOne.prefix + periodOne.type] = periodOne.value;
      dataObj[periodTwo.prefix + periodTwo.type] = periodTwo.value;
      console.log(dataObj);

      return $http({method:"POST",
        url: baseURL + "get-students/course-duration",
        data: dataObj
      });
    },

    courseLogins: function(course, students, periodOne, periodTwo) {

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

    courseSessions: function(course, students, periodOne, periodTwo) {

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

    courseInteractions: function(course, students, periodOne, periodTwo) {

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

    engagement: function(course, students, periodOne, periodTwo) {

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
    courseDurationGroupCohort: function(course, groupcohort, periodOne, periodTwo) {

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

    courseLoginsGroupCohort: function(course, groupcohort, periodOne, periodTwo) {

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

    courseSessionsGroupCohort: function(course, groupcohort, periodOne, periodTwo) {

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

    courseInteractionsGroupCohort: function(course, groupcohort, periodOne, periodTwo) {

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

    engagementGroupCohort: function(course, groupcohort, periodOne, periodTwo) {

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

    /* ADDITIONAL REQUESTS GO HERE */

  }

}]);