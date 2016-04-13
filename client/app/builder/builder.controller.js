'use strict';

angular.module('ulyssesApp')
  .controller('BuilderCtrl', function ($scope, $state, $stateParams, Job, Slot, Auth, Volunteer) {
    var self = this;
    self.error = false;
    self.success = false;
    self.errorMessage = "";
    self.volunteers = Volunteer.query();

    var areThereJobs = false;
    var areThereSlots = false;
    Job.query({}, function(results) {
      if(results.length > 0) {
        areThereJobs = true;
      } else {
        areThereJobs = false;
      }
    })

    Slot.query({}, function(results) {
      if(results.length > 0) {
        areThereSlots = true;
      } else {
        areThereSlots = false;
      }
    });

    self.isSuccess = function () {
      return self.success;
    }

    self.isError = function () {
      return self.error;
    }


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


          Slot.query({}, function(results) {
            var slots = results;

            slots.sort(function(a, b) {
              return (b.volunteersNeeded - b.volunteers.length) - (a.volunteersNeeded - a.volunteers.length);
            });

          /*  slots.forEach(function(slot){
              console.log("Slots: " + slot.volunteersNeeded);
            });

            console.log(slots[0].volunteersNeeded); */

          volunteers.forEach(function(vol) {
            slots.forEach(function(slot){
              console.log(vol.firstName + slot.volunteersNeeded);

              //console.log("Volunteers in slot" + slot.volunteersNeeded + slot.volunteers[0].firstName);
            });
          });
        });




        });


      }
    }
  });


