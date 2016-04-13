'use strict';

angular.module('ulyssesApp')
  .controller('BuilderCtrl', function ($scope, $state, $stateParams, Job, Slot, Auth, Volunteer) {
    var self = this;
    self.error = false;
    self.success = false;
    self.errorMessage = "";
    self.volunteers = Volunteer.query();

    // assign variables to booleans
    var areThereJobs = false;
    var areThereSlots = false;

    // checks if there are jobs
    Job.query({}, function(results) {
      if(results.length > 0) {
        areThereJobs = true;
      } else {
        areThereJobs = false;
      }
    })

    // checks if there are slots
    Slot.query({}, function(results) {
      if(results.length > 0) {
        areThereSlots = true;
      } else {
        areThereSlots = false;
      }
    });

    //returns if something is a success or not
    self.isSuccess = function () {
      return self.success;
    }


    self.isError = function () {
      return self.error;
    }


    //builds a schedule when user pushes a button using volunteers and slots already created
    self.buildSchedule = function() {

      self.volunteers = Volunteer.query();

      // check for no time slots, no jobs, etc
      console.log(areThereJobs);
      console.log("slot", areThereSlots);

      if(!areThereJobs) {
        self.success = false;
        self.error = true;
        self.errorMessage = "You must create jobs before building a schedule.";
      } else if(!areThereSlots) {
        self.success = false;
        self.error = true;
        self.errorMessage = "You have yet to create time slots for your entered jobs.";
      } else {
        console.log("Start creating schedule...");

        // sort volunteers by most child teams to watch
        Volunteer.query({}, function(results) {
          var volunteers = results;
          volunteers.sort(function(a, b) {
            return b.teamSlots - a.teamSlots;
          });

          volunteers.forEach(function(vol) {
            console.log(vol.firstName + " " + vol.lastName);
          });
        });
      }
    }
  });
