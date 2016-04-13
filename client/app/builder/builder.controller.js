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
        return true;
      }
      else if(start2 <= start1 && start1 <= end2) {
        return true;
      }
      else if(start1 == start2 && end1 == end2)
      {
        return true;
      } else {
        return false;
      }
    }

    self.conflictLoop = function(slot1, volunteerid, callback) {
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

           /* var skipper = false;

            while(skipper === false)
            {

            } */


            var prefs1 = "No Preference";
            if (volunteers[0].jobPreference1.includes("Non-Judging")) {
              prefs1 = volunteers[0].jobPreference1.substring("Non-Judging".length + 1);
            }
            console.log("Pref 1 " + prefs1);
            var prefs2 = "No Preference";
            if (volunteers[0].jobPreference2.includes("Non-Judging")) {
              prefs2 = volunteers[0].jobPreference2.substring("Non-Judging".length + 1);
            }
            console.log("Pref 2 " + prefs2);
            /*

            var firstRun = true;
            for(var i = 0; i < slots.length; i++) {
              console.log("current " + i);
              Job.get({id: slots[i].jobID}, function(jobitself) {
                console.log("The Job Title: " + jobitself.title + " the iteration " + i + "the slot number" + slots[i].volunteersNeeded);
                if(firstRun === true) {
                  if((jobitself.title === prefs1 || jobitself.title === prefs2) && (jobitself.title !== "Child Team Performing")) {
                    if(!slots[i].volunteers.includes(volunteers[0]._id))
                    {
                      if(slots[i].volunteers.length < slots[i].volunteersNeeded)
                      {
                        self.conflictLoop(slots[i], volunteers[0]._id, function(success) {
                          if(success === false) {
                            slots[i].volunteers.push(volunteers[0]._id);
                            Slot.update({id: slots[i]._id}, slots[i]);
                            Job.get({id: slots[i].jobID}, function(jobitself) {
                              Location.get({id: jobitself.locations[0]}, function(location) {
                                //ignored self.vols.push(volunteers[0]);
                                volunteers[0].slots.push(slots[i]._id);
                                volunteers[0].locations.push({"locationID" : location._id, "slotID" : slots[i]._id});
                                Volunteer.update({id: volunteers[0]._id}, volunteers[0]);
                                console.log("Volunteer got added");
                                i = slots.length;
                              });
                            });
                          }
                        });
                      }
                    }
                  }
                }
                else {
                  if(!slots[i].volunteers.includes(volunteers[0]._id))
                  {
                    if(slots[i].volunteers.length < slots[i].volunteersNeeded)
                    {
                      self.conflictLoop(slots[i], volunteers[0]._id, function(success) {
                        if(success === false) {
                          slots[i].volunteers.push(volunteers[0]._id);
                          Slot.update({id: slots[i]._id}, slots[i]);
                          Job.get({id: slots[i].jobID}, function(jobitself) {
                            Location.get({id: jobitself.locations[0]}, function(location) {
                              //ignored self.vols.push(volunteers[0]);
                              console.log("Getting Job Id" + location);
                              volunteers[0].slots.push(slots[i]._id);
                              volunteers[0].locations.push({"locationID" : location._id, "slotID" : slots[i]._id});
                              Volunteer.update({id: volunteers[0]._id}, volunteers[0]);
                              console.log("Volunteer got added");
                              i = slots.length;
                            });
                          });
                        }
                      });
                    }
                  }
                }
                if(i = (slots.length - 1)) {
                  if(firstRun === true) {
                    i = 0;
                    firstRun = false;
                  }
                }

              });
            } */

            var stopper = false;
            volunteers.forEach(function(vol)
            {
                stopper = false;
                slots.forEach(function(slot) {
                  if(stopper === false) {
                    console.log(vol.firstName + " " + vol.lastName + " " + slot.volunteersNeeded);
                    if (!slot.volunteers.includes(vol._id)) {
                      if (slot.volunteers.length < slot.volunteersNeeded) {
                        self.conflictLoop(slot, vol._id, function (success) {
                          if (success === false) {
                            slot.volunteers.push(vol._id);
                            Slot.update({id: slot._id}, slot);
                            Job.get({id: slot.jobID}, function (jobitself) {
                              Location.get({id: jobitself.locations[0]}, function (location) {
                                //ignored self.vols.push(volunteers[0]);
                                console.log("Getting Job Id" + location);
                                vol.slots.push(slot._id);
                                vol.locations.push({"locationID": location._id, "slotID": slot._id});
                                Volunteer.update({id: vol._id}, vol);
                                console.log("Volunteer got added");
                                stopper = true;
                              });
                            });
                          }
                        });
                      }
                    }
                  }
                });



            });

           /* if(!slots[0].volunteers.includes(volunteers[0]._id))
            {
              console.log("past stage one" + (slots[0].volunteers.length < slots[0].volunteersNeeded));
              if(slots[0].volunteers.length < slots[0].volunteersNeeded)
              {
                console.log("past stage two");
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
            } */


          });

        });

      }
    }
  });


