'use strict';

angular.module('ulyssesApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('volunteer', {
        url: '/volunteers',
        templateUrl: 'app/volunteer/volunteer.html',
        controller: 'VolunteerCtrl',
        controllerAs: 'volunteerCtrl',
        authenticate: 'organizer'
      }).state('volunteer-details', {
        url: '/volunteers/:id',
        templateUrl: 'app/volunteer/volunteer-detail.html',
        controller: 'VolunteerCtrl',
        controllerAs: 'volunteerCtrl',
        authenticate: 'organizer'
      });
  });
