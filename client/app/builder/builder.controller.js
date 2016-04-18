'use strict';

angular.module('ulyssesApp')
  .controller('BuilderCtrl', function ($scope, $state, $stateParams, Job, Slot, Auth, Volunteer, Location) {

    var self = this;
    self.error = false;
    self.success = false;
    self.errorMessage = "";
    self.volunteers = Volunteer.query();
    var allowanceBool = false;
    var volNumAdded = 0;
    var failSafe = 0;
    self.endMessage = "";

    var areThereJobs = false;
    var areThereSlots = false;

    var added = false;

    // checks if there are jobs in the database. If the job exists it returns true otherwise it returns false
    Job.query({}, function(results) {
      if(results.length > 0) {
        areThereJobs = true;
      } else {
        areThereJobs = false;
      }
    })

    // checks if there are slots in the database. If the slot exists it returns true otherwise it returns false
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


    // uses self.isConflict to loop through all slots and check for conflicts
    self.conflictLoop = function(slot1, volunteerid, callback) {
      Volunteer.get({id: volunteerid }, function(results) {
        var hasCalledBack = false;
        for(var i = 0; i < results.slots.length; i++)
        {
          Slot.get({id: results.slots[i]}, function(results1) {
            //console.log(results1);
            if(self.isConflict(slot1, results1))
            {
              allowanceBool = true;

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

    //adds a volunteer to a slot
    self.addVolunteer = function (vol, slot) {
      //console.log("in there? " + slot.volunteersNeeded + !slot.volunteers.includes(vol._id))
      if(added == false){
        if (!slot.volunteers.includes(vol._id)) {
          if (slot.volunteers.length < slot.volunteersNeeded) {
            self.conflictLoop(slot, vol._id, function (success) {
              setTimeout( function () {
                if (allowanceBool == false) {
                  if (!slot.volunteers.includes(vol._id)) {
                    console.log("This should only run once");
                    slot.volunteers.push(vol._id);
                    Slot.update({id: slot._id}, slot);
                    //self.slotsToUpdate.push(slot);
                    Job.get({id: slot.jobID}, function (jobitself) {
                      Location.get({id: jobitself.locations[0]}, function (location) {
                        //ignored self.vols.push(volunteers[0]);
                        vol.slots.push(slot._id);
                        vol.locations.push({"locationID": location._id, "slotID": slot._id});
                        Volunteer.update({id: vol._id}, vol);
                        //self.volsToUpdate.push(vol);
                        console.log("Volunteer got added to " + jobitself.title);
                        added = true;
                        volNumAdded++;
                        failSafe++;
                      });
                    });
                  }
                }
              }, 1000);
            });
          }
        }
      }
      allowanceBool = false;
    }

    self.countVolStillNeeded = function(slots) {
      var volNeeded = 0;
      var volAssigned = 0;
      slots.forEach(function(slot) {
        volNeeded += slot.volunteersNeeded;
        volAssigned += slot.volunteers.length;
      });
      return volNeeded - volAssigned;
    }

    // builds a schedule using jobs, slots, and volunteers in the database
    self.buildSchedule = function() {
      document.getElementById("brokenthing").innerHTML = "Build in progress, please remain on this page.";
      self.endMessage = "Build in progress, please remain on this page.";
      self.volunteers = Volunteer.query();
      self.isFinished = false;


      // checks for time slots, no jobs and displays in console
      console.log(areThereJobs);
      console.log("slot", areThereSlots);

      // checks if there are jobs and if there are no jobs it returns true for error
      if(!areThereJobs) {
        self.success = false;
        self.error = true;
        self.errorMessage = "You must create jobs before building a schedule.";
        // checks if there are slots and if there are no slots it returns an true for message
      } else if(!areThereSlots) {
        self.success = false;
        self.error = true;
        self.errorMessage = "You have yet to create time slots for your entered jobs.";
        // if there are jobs and slots it prints "Start creating schedule..." to the console
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
            var toFulfill = self.countVolStillNeeded(slots);
            console.log("toFulfill " + toFulfill);
            slots.sort(function(a, b) {
              return (b.volunteersNeeded - b.volunteers.length) - (a.volunteersNeeded - a.volunteers.length);
            });

            console.log("First Slot " + slots[0].volunteersNeeded);
            console.log("First Volunteer " + volunteers[0].firstName + " " + volunteers[0].lastName);

            console.log("Is he in there?" + slots[0].volunteers.includes(volunteers[0]._id));


            //gets volunteers job preference 1 and job preference 2
            var prefs1 = "No Preference";
            if (volunteers[0].jobPreference1.includes("Non-Judging")) {
              prefs1 = volunteers[0].jobPreference1.substring("Non-Judging".length + 1);
            }
            console.log("Pref 1 " + prefs1);
            var prefs2 = "No Preference";
            if (volunteers[0].jobPreference2.includes("Non-Judging")) {
              prefs2 = volunteers[0].jobPreference2.substring("Non-Judging".length + 1);
            }

            //prints volunteers preferences to the console
            console.log("Pref 2 " + prefs2);


            var i = 0;
            var o = 0;
            var maxInner = slots.length;
            var maxOuter = volunteers.length;
            var delay = 2000;
            function rec()
            {
              console.log("outerloop "+o);
              var inner = setInterval(function(){

                console.log("innerloop "+i);

                console.log("iteration outer: " + o + " iteration inner: " + i + " " + volunteers[o].firstName + " " + volunteers[o].lastName);
                console.log("what is added? " + added);

                self.addVolunteer(volunteers[o], slots[i]);

                i++;

                if(added) {
                  i = maxInner;
                }

                if(i==maxInner)
                {
                  clearTimeout(inner);
                  var outer = setTimeout(function(){

                    if(volNumAdded == toFulfill) {
                      self.endMessage = "Schedule is built.";
                      self.isFinished = true;
                      document.getElementById("brokenthing").innerHTML = "Schedule is built.";
                      console.log("LAKJSDLSAJ");
                      return;
                    }
                    console.log("added" + added);
                    added = false;
                    o++;
                    i=0;
                    if(o==maxOuter)
                    {
                      if(volNumAdded != toFulfill && failSafe != 0)
                      {
                        o = 0;
                        failSafe = 0;

                      } else {
                        self.endMessage = "Schedule is built.";
                        self.isFinished = true;
                        document.getElementById("brokenthing").innerHTML = "Schedule is built.";
                        console.log("LAKJSDLSAJ");
                        return;
                      }


                    }
                    clearTimeout(outer);
                    rec();
                  },delay);
                }
              },delay);
            }
            rec();



            /*
             // checks if a slot needs more volunteers and adds a volunteer to an empty slot
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
             } */


          });

        });

      }

    }
  });


