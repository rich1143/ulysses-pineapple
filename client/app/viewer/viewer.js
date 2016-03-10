'use strict';

angular.module('ulyssesApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('viewer', {
        url: '/view',
        templateUrl: 'app/viewer/viewer.html',
        controller: 'ViewerCtrl',
        controllerAs: 'viewerCtrl',
        authenticate: true
      }).state('viewer-detail', {
        url: '/view/:id',
        templateUrl: 'app/viewer/viewer-detail.html',
        controller: 'ViewerCtrl',
        controllerAs: 'viewerCtrl',
        authenticate: true
      });
  });
