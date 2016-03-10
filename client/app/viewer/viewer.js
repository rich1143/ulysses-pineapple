'use strict';

angular.module('ulyssesApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('viewer', {
        url: '/viewer',
        templateUrl: 'app/viewer/viewer.html',
        controller: 'ViewerCtrl',
        controllerAs: 'viewerCtrl',
        authenticate: true
      }).state('viewer-detail', {
        url: '/viewer/:id',
        templateUrl: 'app/viewer/viewer-detail.html',
        controller: 'ViewerCtrl',
        controllerAs: 'viewerCtrl',
        authenticate: true
      });
  });
