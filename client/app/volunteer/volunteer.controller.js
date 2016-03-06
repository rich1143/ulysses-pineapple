'use strict';

angular.module('ulyssesApp')
  .controller('VolunteerCtrl', function ($scope, $state, $stateParams, Volunteer) {
    var self = this;

    self.data = [];
    console.log($state.current.name);
    if($state.current.name == "volunteer") {
      self.data = Volunteer.query();
    } else if($state.current.name == "volunteer-details") {
      self.data = [Volunteer.get({id: $stateParams.id }, function(response) {
        console.log(response);
      })]
    }

  });
