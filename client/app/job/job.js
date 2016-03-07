'use strict';

angular.module('ulyssesApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('job', {
        url: '/jobs',
        templateUrl: 'app/job/job.html',
        controller: 'JobCtrl',
        controllerAs: 'jobCtrl'
      }).state('job-create', {
        url: '/jobs/create',
        templateUrl: 'app/job/job-create.html',
        controller: 'JobCtrl',
        controllerAs: 'jobCtrl'
      });
  });
