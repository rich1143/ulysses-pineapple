'use strict';

angular.module('ulyssesApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('slot', {
        url: '/slot',
        templateUrl: 'app/slot/slot.html',
        controller: 'SlotCtrl',
        controllerAs: 'slotCtrl'
      }).state('slot-create', {
        url: '/slot/create',
        templateUrl: 'app/slot/slot-create.html',
        controller: 'SlotCtrl',
        controllerAs: 'slotCtrl'
      });
  });
