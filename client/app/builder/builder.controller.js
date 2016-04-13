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

    //checks to see if two time slots overlap
    self.isConflict = function(slot1, slot2) {
      var start1 = parseInt(slot1.start);
      var end1 = parseInt(slot1.end);
      var start2 = parseInt(slot2.start);
      var end2 = parseInt(slot2.end);
      if((start1 <= start2 && start2 <= end1)) {
        console.log("scenario1");
        return true;
      }
      else if(start2 <= start1 && start1 <= end2) {
        console.log("scenario2");
        return true;
      }
      else if(start1 == start2 && end1 == end2)
      {
        console.log("scenario3");
        return true;
      } else {
        console.log("scenario4");
        return false;
      }
    }

    self.conflictLoop = function(slot1, volunteerid, callback) {
      console.log("test");
      Volunteer.get({id: volunteerid }, function(results) {
        var hasCalledBack = false;
        for(var i = 0; i < results.slots.length; i++)
        {
          Slot.get({id: results.slots[i]}, function(results1) {
            console.log(results1);
            if(self.isConflict(slot1, results1))
            {

              callback(true);
              hasCalledBack = true;
            } else if(i == results.slots.length) {
              if(!hasCalledBack) {
                callback(false);
              }
            }
          });
        }

        if(results.slots.length == 0) {
          callback(false);
        }
      });
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

            console.log("Is he in there?" + slots[0].volunteers.includes(volunteers[0]._id));


            if(!slots[0].volunteers.includes(volunteers[0]._id))
            {
              if(slots[0].volunteers.length < slots[0].volunteersNeeded)
              {
                self.conflictLoop(slots[0], volunteers[0]._id, function(success) {
                  if(success === false) {
                    slots[0].volunteers.push(volunteers[0]._id);
                    Slot.update({id: slots[0]._id}, slots[0]);
                    Job.get({id: slots[0].jobID}, function(jobitself) {
                      Location.get({id: jobitself.locations[0]}, function(location) {
                        //ignored self.vols.push(volunteers[0]);
                        console.log("Getting Job Id" + location);
                        volunteers[0].slots.push(slots[0]._id);
                        volunteers[0].locations.push({"locationID" : location._id, "slotID" : slots[0]._id});
                        Volunteer.update({id: volunteers[0]._id}, volunteers[0]);
                        console.log("Volunteer got added");
                      });
                    });
                  }
                });
              }
            }









          });

        });

      }
    }
  });


