'use strict';

angular.module('ulyssesApp')
  .controller('VolunteerCtrl', function ($scope, $state, $stateParams, Volunteer) {
    var self = this;

    self.data = [];
    self.volunteer = {};

    console.log($state.current.name);
    if ($state.current.name == "volunteer") {
      self.data = Volunteer.query();
    } else if ($state.current.name == "volunteer-details") {
      self.volunteer = Volunteer.get({id: $stateParams.id}, function (response) {
        console.log(response);
      });
    } else if ($state.current.name == "volunteer-create") {
      // Working on Button Submit still.


      self.firstName = "";
      self.lastName = "";
      self.assoc = "";
      self.street1 = "";
      self.street2 = "";
      self.city = "";
      self.state = "";
      self.zip = "";
      self.country = "";
      self.region = "";
      self.phone = "";
      self.workPhone = "";
      self.email = "";
      self.fax = "";
      self.assocExp = '';
      self.coachExp = '';
      self.memberExp = '';
      self.username = '';
      self.password = '';
      self.current = '';
      self.jobPreference1 = '';
      self.jobPreference2 = '';
      self.membershipNumber = '';
      self.problem = '';
      self.division = '';
      self.submitDate = '';
      self.lastModified = '';
      self.mName = '';
      self.mRegion = '';
      self.childTeam = '';
      self.coachEmail = '';
      self.tshirtSize = '';
      self.positionHeld = '';
      self.comment = '';



      self.addVolunteer = function () {
        console.log(self.firstName)
        if (self.firstName.length >= 1 && self.lastName.length >= 1) {
          console.log(self.firstName);
          console.log("Clicked submit!");
        }
        else {
          console.log("error");
          self.errorMessage = "You must fill out all relevant information!";
        }
      }
    }
  });
