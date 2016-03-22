'use strict';

angular.module('ulyssesApp')
  .controller('VolunteerCtrl', function ($scope, $state, $stateParams, Volunteer, $location, $anchorScroll, Job, Slot) {
    var self = this;

    self.data = [];
    self.volunteer = {};
    self.readOnly = true;
    self.success = false;
    self.error = false;
    self.slots = [];
    self.jobTitles = [];


    console.log($state.current.name);
    if ($state.current.name == "volunteer") {
      self.data = Volunteer.query();

      self.areThereVolunteers = function() {
        if(self.data) {
          return !(self.data.length == 0);
        }
      }
    } else if ($state.current.name == "volunteer-details") {

      Job.query().$promise.then(function(results) {
        results.forEach(function(job) {
          console.log("run");
          self.jobTitles.push({title: job.title, id: job._id});
        });
        console.log(self.jobTitles);
      }, function(error) {
        console.log("ERROR");
      });

      self.parseTime = function(time) {
        var strTime = time.toString();
        return strTime.substring(0, strTime.length / 2) + ":" + strTime.substring(strTime.length / 2, strTime.length);
      }

      self.getJobTitle = function(name) {
        var title;
        self.jobTitles.forEach(function(job) {

          if(job.id == name) {
            title = job.title;
          }

        });
        return title;
      }

      self.volunteer = Volunteer.get({id: $stateParams.id}, function (response) {
        self.volunteer.slots.forEach(function(data) {
          console.log("id: ", data);
          Slot.get({id: data}).$promise.then(function(results) {
            console.log("async finished");
            self.slots.push(results);
            console.log(self.slots);
          }, function(error) {
            console.log("ERROR");
          });
        });
      });

      self.areThereSlots = function() {
        if(self.slots) {
          return !(self.slots.length == 0);
        }
      }

      self.isReadOnly = function() {
        return self.readOnly;
      }

      self.toggleEdit = function () {
        console.log("Editing");
        self.readOnly = false;
      }

      self.isSuccess = function () {
        return self.success;
      }

      self.isError = function () {
        return self.error;
      }

      self.updateVolunteer = function() {

        if (self.volunteer.firstName.length >= 1 && self.volunteer.lastName.length >= 1) {
          console.log("Clicked update!");
          var data = { firstName: self.volunteer.firstName, lastName: self.volunteer.lastName, assoc: self.volunteer.assoc, street1: self.volunteer.street1, street2: self.volunteer.street2,
            city: self.volunteer.city, state: self.volunteer.state, zip: self.volunteer.zip, country: self.volunteer.country, region: self.volunteer.region, phone: self.volunteer.phone, workPhone: self.volunteer.workPhone,
            email: self.volunteer.email, fax: self.volunteer.fax, assocExp: self.volunteer.assocExp, coachExp: self.volunteer.coachExp, memberExp: self.volunteer.memberExp, username: self.volunteer.username,
            password: self.volunteer.password, current: self.volunteer.current, jobPreference1: self.volunteer.jobPreference1, jobPreference2: self.volunteer.jobPreference2, membershipNumber: self.volunteer.membershipNumber,
            problem: self.volunteer.problem, division: self.volunteer.division, submitDate: self.volunteer.submitDate, lastModified: self.volunteer.lastModified, mName: self.volunteer.mName, mRegion: self.volunteer.mRegion,
            childTeam: self.volunteer.childTeam, coachName: self.volunteer.coachName, coachEmail: self.volunteer.coachEmail, tshirtSize: self.volunteer.tshirtSize, positionHeld: self.volunteer.positionHeld, comment: self.volunteer.comment, isJudge: self.volunteer.isJudge, slots: []};
          Volunteer.update({id: self.volunteer._id}, data);

          self.readOnly = true;
          self.success = true;
          self.error = false;
          $anchorScroll();

        }
        else {
          console.log("error");
          self.success = false;
          self.error = true;
          $anchorScroll();
        }
      }


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
      self.coachName = "";
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
            childTeam: self.childTeam, coachName: self.coachName, coachEmail: self.coachEmail, tshirtSize: self.tshirtSize, positionHeld: self.positionHeld, comment: self.comment, isJudge: self.isJudge, slots: []};
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
          self.coachName = "";
          self.tshirtSize = "";
          self.positionHeld = "";
          self.comment = "";
          self.isJudge = false;
        }
        else {
          console.log("error");
          alert("Required information is missing!")
        }
      }
    }
  });
