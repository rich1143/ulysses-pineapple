'use strict';

angular.module('ulyssesApp')
  .controller('BuilderCtrl', function ($scope, $state, $stateParams, Job, Slot, Auth, Volunteer, Location) {
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


          Slot.query({}, function(results1) {
            var slots = results1;

            slots.sort(function(a, b) {
              return (b.volunteersNeeded - b.volunteers.length) - (a.volunteersNeeded - a.volunteers.length);
            });

          console.log("First Slot " + slots[0].volunteersNeeded);
            console.log("First Volunteer " + volunteers[0].firstName + " " + volunteers[0].lastName);

            slots[0].volunteers.push(volunteers[0]._id);
            Slot.update({id: slots[0]._id}, slots[0]);
            Job.get({id: slots[0].jobID}, function(jobitself) {
              Location.get({id: jobitself.locations[0]}, function(location) {
                //ignored self.vols.push(volunteers[0]);
                console.log("Getting Job Id" + location);
                volunteers[0].slots.push(slots[0]._id);
                volunteers[0].locations.push({"locationID" : location._id, "slotID" : slots[0]._id});
                Volunteer.update({id: volunteers[0]._id}, volunteers[0]);
              });
            });







          });

        });

      }
    }
  });


