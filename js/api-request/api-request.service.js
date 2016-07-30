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

    /* EVENTS */
    events: function(course, conceptType) {
      return $http({method: "POST",
        url: baseURL + "course/log-concepts",
        data: {course:course , conceptType:conceptType}
      });
    },

    /* eventFilters */
    eventFilters: function(course) {
      return $http({method: "POST",
        url: baseURL + "course/log-events",
        data: {course:course}
      });
    },

    /* ENGAGEMENT OPTIONS */
    engagementOptions: function(course) {
      return $http({method: "POST",
        url: baseURL + "course-engagement/default-options",
        data: {rcourseID:course}
      });
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
        data: {rcourseID:course , learnerID:student}})
    },

    /* --- METRICS (STUDENTS) ---
      TODO: abstract duplicated dataObj logic */
    courseDuration: function(params) {
      
      var dataObj = {};
      dataObj['rcourseID'] = params.course;
      dataObj['learners'] = params.students;
      dataObj[params.periodOne.prefix + params.periodOne.type] = params.periodOne.value;
      dataObj[params.periodTwo.prefix + params.periodTwo.type] = params.periodTwo.value;

      return $http({method:"POST",
        url: baseURL + "get-students/course-duration",
        data: dataObj
      });
    },

    courseLogins: function(params) {

      var dataObj = {};
      dataObj['rcourseID'] = params.course;
      dataObj['learners'] = params.students;
      dataObj[params.periodOne.prefix + params.periodOne.type] = params.periodOne.value;
      dataObj[params.periodTwo.prefix + params.periodTwo.type] = params.periodTwo.value;

      return $http({method:"POST",
        url: baseURL + "get-students/course-logins",
        data: dataObj
      });
    },

    courseSessions: function(params) {

      var dataObj = {};
      dataObj['rcourseID'] = params.course;
      dataObj['learners'] = params.students;
      dataObj[params.periodOne.prefix + params.periodOne.type] = params.periodOne.value;
      dataObj[params.periodTwo.prefix + params.periodTwo.type] = params.periodTwo.value;

      return $http({method:"POST",
        url: baseURL + "get-students/course-sessions",
        data: dataObj
      });
    },

    courseInteractions: function(params) {

      var dataObj = {};
      dataObj['rcourseID'] = params.course;
      dataObj['learners'] = params.students;
      dataObj[params.periodOne.prefix + params.periodOne.type] = params.periodOne.value;
      dataObj[params.periodTwo.prefix + params.periodTwo.type] = params.periodTwo.value;

      return $http({method:"POST",
        url: baseURL + "get-students/course-interactions",
        data: dataObj
      });
    },

    engagement: function(params) {

      var dataObj = {};
      dataObj['rcourseID'] = params.course;
      dataObj['learners'] = params.students;
      dataObj[params.periodOne.prefix + params.periodOne.type] = params.periodOne.value;
      dataObj[params.periodTwo.prefix + params.periodTwo.type] = params.periodTwo.value;

      return $http({method:"POST",
        url: baseURL + "calculate-students/individual-engagement",
        data: dataObj
      });
    },

    /* METRICS (GROUPSCOHORTS) */
    courseDurationGroupCohort: function(params) {

      var dataObj = {};
      dataObj['rcourseID'] = params.course;
      dataObj['group-cohort'] = params.groupCohort;
      dataObj['anonymized'] = anonymized;
      dataObj[params.periodOne.prefix + params.periodOne.type] = params.periodOne.value;
      dataObj[params.periodTwo.prefix + params.periodTwo.type] = params.periodTwo.value;

      return $http({method:"POST",
        url: baseURL + "get-groupcohort/course-duration",
        data: dataObj
      });
    },

    courseLoginsGroupCohort: function(params) {

      var dataObj = {};
      dataObj['rcourseID'] = params.course;
      dataObj['group-cohort'] = params.groupCohort;
      dataObj['anonymized'] = anonymized;
      dataObj[params.periodOne.prefix + params.periodOne.type] = params.periodOne.value;
      dataObj[params.periodTwo.prefix + params.periodTwo.type] = params.periodTwo.value;

      return $http({method:"POST",
        url: baseURL + "get-groupcohort/course-logins",
        data: dataObj
      });
    },

    courseSessionsGroupCohort: function(params) {

      var dataObj = {};
      dataObj['rcourseID'] = params.course;
      dataObj['group-cohort'] = params.groupCohort;
      dataObj['anonymized'] = anonymized;
      dataObj[params.periodOne.prefix + params.periodOne.type] = params.periodOne.value;
      dataObj[params.periodTwo.prefix + params.periodTwo.type] = params.periodTwo.value;

      return $http({method:"POST",
        url: baseURL + "get-groupcohort/course-sessions",
        data: dataObj
      });
    },

    courseInteractionsGroupCohort: function(params) {

      var dataObj = {};
      dataObj['rcourseID'] = params.course;
      dataObj['group-cohort'] = params.groupCohort;
      dataObj['anonymized'] = anonymized;
      dataObj[params.periodOne.prefix + params.periodOne.type] = params.periodOne.value;
      dataObj[params.periodTwo.prefix + params.periodTwo.type] = params.periodTwo.value;

      return $http({method:"POST",
        url: baseURL + "get-groupcohort/course-interactions",
        data: dataObj
      });
    },

    engagementGroupCohort: function(params) {

      var dataObj = {};
      dataObj['rcourseID'] = params.course;
      dataObj['group-cohort'] = params.groupCohort;
      dataObj['anonymized'] = anonymized;
      dataObj[params.periodOne.prefix + params.periodOne.type] = params.periodOne.value;
      dataObj[params.periodTwo.prefix + params.periodTwo.type] = params.periodTwo.value;

      return $http({method:"POST",
        url: baseURL + "calculate-groupcohort/individual-engagement",
        data: dataObj
      });
    },

    /* METRICS (CONCEPTS) */
    engagementConcept: function(params) {

      var dataObj = {};
      dataObj['rcourseID'] = params.course;
      dataObj['learners'] = params.students;
      dataObj['options'] = params.options;
    
      return $http({method: "POST",
        url: baseURL + "calculate-students/specific-individual-engagement",
        data: dataObj
      });
    },

    engagementConceptGroupCohort: function(params) {

      var dataObj = {};
      dataObj['rcourseID'] = params.course;
      dataObj['group-cohort'] = params.groupCohort;
      dataObj['options'] = params.options;
      dataObj['anonymized'] = anonymized;

      return $http({method: "POST",
        url: baseURL + "calculate-groupcohort/specific-individual-engagement",
        data: dataObj
      });
    },

    courseDurationConcept: function(params) {

      var dataObj = {};
      dataObj['rcourseID'] = params.course;
      dataObj['learners'] = params.students;
      dataObj['conceptID'] = params.concept;

      return $http({method: "POST",
        url: baseURL + "get-students/course-concept-duration",
        data: dataObj
      });
    },

    courseDurationConceptGroupCohort: function(params) {

      var dataObj = {};
      dataObj['rcourseID'] = params.course;
      dataObj['group-cohort'] = params.groupCohort;
      dataObj['conceptID'] = params.concept;
      dataObj['anonymized'] = anonymized;

      return $http({method: "POST",
        url: baseURL + "get-groupcohort/course-concept-duration",
        data: dataObj
      }); 
    },

    courseInteractionsConcept: function(params) {

      var dataObj = {};
      dataObj['rcourseID'] = params.course;
      dataObj['learners'] = params.students;
      dataObj['conceptID'] = params.concept;

      return $http({method: "POST",
        url: baseURL + "get-students/course-concept-interactions",
        data: dataObj
      });

    },

    courseInteractionsConceptGroupCohort: function(params) {

      var dataObj = {};
      dataObj['rcourseID'] = params.course;
      dataObj['group-cohort'] = params.groupCohort;
      dataObj['conceptID'] = params.concept;
      dataObj['anonymized'] = anonymized;
 
      return $http({method: "POST",
        url: baseURL + "get-groupcohort/course-concept-interactions",
        data: dataObj
      });
    }

    /* ADDITIONAL REQUESTS HERE */

  }

}]);