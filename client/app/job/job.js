'use strict';

angular.module('ulyssesApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('job', {
        url: '/jobs',
        templateUrl: 'app/job/job.html',
        controller: 'JobCtrl'
      });
  });
