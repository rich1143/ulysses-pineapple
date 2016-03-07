'use strict';

angular.module('ulyssesApp')
  .controller('VolunteerCtrl', function ($scope, $state, $stateParams, Volunteer) {
    var self = this;

    self.data = [];
    self.volunteer = {};

    console.log($state.current.name);
    if($state.current.name == "volunteer") {
      self.data = Volunteer.query();
    } else if($state.current.name == "volunteer-details") {
      self.volunteer = Volunteer.get({id: $stateParams.id }, function(response) {
        console.log(response);
      });
    } else if($state.current.name == "volunteer-create") {
      self.addVolunteer = function() {

      }
    }
  });
