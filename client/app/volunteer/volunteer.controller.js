'use strict';

angular.module('ulyssesApp')
  .controller('VolunteerCtrl', function ($scope, $state, $stateParams, Volunteer) {
    var self = this;

    self.data = [];
    self.volunteer = {};

    console.log($state.current.name);
    if ($state.current.name == "volunteer") {
      self.data = Volunteer.query();

      self.areThereVolunteers = function() {
        if(self.data) {
          return !(self.data.length == 0);
        }
      }
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
      self.assocExp = "";
      self.coachExp = "";
      self.memberExp = "";
      self.username = "";
      self.password = "";
      self.current = "";
      self.jobPreference1 = "";
      self.jobPreference2 = "";
      self.membershipNumber = "";
      self.problem = "";
      self.division = "";
      self.submitDate = "";
      self.lastModified = "";
      self.mName = "";
      self.mRegion = "";
      self.childTeam = "";
      self.coachEmail = "";
      self.tshirtSize = "";
      self.positionHeld = "";
      self.comment = "";
      self.isJudge = false;
      self.slots = [];




      self.addVolunteer = function () {
        console.log(self.firstName)
        if (self.firstName.length >= 1 && self.lastName.length >= 1) {
          console.log(self.firstName);
          console.log("Clicked submit!");
          var data = { firstName: self.firstName, lastName: self.lastName, assoc: self.assoc, street1: self.street1, street2: self.street2,
            city: self.city, state: self.state, zip: self.zip, country: self.country, region: self.region, phone: self.phone, workPhone: self.workPhone,
            email: self.email, fax: self.fax, assocExp: self.assocExp, coachExp: self.coachExp, memberExp: self.memberExp, username: self.username,
            password: self.password, current: self.current, jobPreference1: self.jobPreference1, jobPreference2: self.jobPreference2, membershipNumber: self.membershipNumber,
            problem: self.problem, division: self.division, submitDate: self.submitDate, lastModified: self.lastModified, mName: self.mName, mRegion: self.mRegion,
            childTeam: self.childTeam, coachEmail: self.coachEmail, tshirtSize: self.tshirtSize, positionHeld: self.positionHeld, comment: self.comment, isJudge: self.isJudge, slots: []};
          Volunteer.save(data);

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
          self.assocExp = "";
          self.coachExp = "";
          self.memberExp = "";
          self.username = "";
          self.password = "";
          self.current = "";
          self.jobPreference1 = "";
          self.jobPreference2 = "";
          self.membershipNumber = "";
          self.problem = "";
          self.division = "";
          self.submitDate = "";
          self.lastModified = "";
          self.mName = "";
          self.mRegion = "";
          self.childTeam = "";
          self.coachEmail = "";
          self.tshirtSize = "";
          self.positionHeld = "";
          self.comment = "";
        }
        else {
          console.log("error");
          self.errorMessage = "You must fill out all relevant information!";
        }
      }
    }
  });
