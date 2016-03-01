'use strict';

angular.module('ulyssesApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('volunteer', {
        url: '/volunteers',
        templateUrl: 'app/volunteer/volunteer.html',
        controller: 'VolunteerCtrl',
        authenticate: 'organizer'
      });
  });
