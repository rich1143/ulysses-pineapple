'use strict';

angular.module('ulyssesApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('builder', {
        url: '/builder',
        templateUrl: 'app/builder/builder.html',
        controller: 'BuilderCtrl',
        controllerAs: 'builderCtrl',
        authenticate: 'organizer'
      });
  });
