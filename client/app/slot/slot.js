'use strict';

angular.module('ulyssesApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('slot', {
        url: '/slot',
        templateUrl: 'app/slot/slot.html',
        controller: 'SlotCtrl'
      });
  });
