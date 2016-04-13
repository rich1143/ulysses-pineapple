'use strict';



angular.module('ulyssesApp')
  .controller('SlotCtrl', function ($scope, $state, $stateParams, Volunteer, Job, Slot, Auth, Location) {
    var self = this;
    self.success = false;
    self.error = false;
    self.locations = [];

    self.isSuccess = function () {
      return self.success;
    }

    self.isError = function () {
      return self.error;
    }

    self.jobTitles = [];

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
      if(time) {
        var strTime = "";
        if(time >= 1300) {
          time = time - 1200;
          strTime = time.toString();
          strTime = strTime.substring(0, strTime.length / 2) + ":" + strTime.substring(strTime.length / 2, strTime.length);
          strTime = strTime + " PM";
        } else if(time >= 1200) {
          strTime = time.toString();
          strTime = strTime.substring(0, strTime.length / 2) + ":" + strTime.substring(strTime.length / 2, strTime.length);
          strTime = strTime + " PM";
        } else {
          strTime = time.toString();
          strTime = strTime.substring(0, strTime.length / 2) + ":" + strTime.substring(strTime.length / 2, strTime.length);
          strTime = strTime + " AM";
        }

        return strTime;
      }
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

    /*self.conflictLoop = function(slot1, volunteerid, callback) {
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
    }*/

    self.conflictLoop = function(slot1, volunteerid, callback) {
      console.log("test");
      var errorMsg = " is already assigned to ";
      var counter = 0;
      Volunteer.get({id: volunteerid }, function(results) {
        errorMsg = results.firstName + " " + results.lastName + errorMsg;
        var hasCalledBack = false;

        if(results.slots.length == 0) {
          callback("You have successfully added a volunteer to this time slot.");
          console.log("You have successfully added a volunteer to this time slot.");
        }
        for(var i = 0; i < results.slots.length; i++)
        {
          Slot.get({id: results.slots[i]}, function(results1) {
            console.log(results1);
            if(self.isConflict(slot1, results1))
            {
              Job.get({id: results1.jobID}, function(jobResults) {
                console.log("Printing results1 " + jobResults.title);
                if(counter != 0)
                {
                  errorMsg += " and " + jobResults.title + " from " + self.parseTime(results1.start) + " to " + self.parseTime(results1.end);
                  counter++;

                }
                else {
                  errorMsg += jobResults.title + " from " + self.parseTime(results1.start) + " to " + self.parseTime(results1.end);
                  counter++;
                }
                callback(errorMsg + ".");
                hasCalledBack = true;
              });
            } else if(i == results.slots.length) {
              if(!hasCalledBack) {
                callback("You have successfully added a volunteer to this time slot.");
                hasCalledBack = true;
              }
            }
          });
        }
      });
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

    /*self.getJobID = function(name){
      var id;
      self.jobTitles.forEach(function(job){
        if(job.title == name)
          id = job.id;
      }
      return id;
    }*/

    if($state.current.name == "slot") {

      Slot.query().$promise.then(function(results) {
        self.data = results;
        self.data.forEach(function(slot) {
          slot["jobTitle"] = self.getJobTitle(slot.jobID);
          slot["left"] = slot.volunteersNeeded - slot.volunteers.length;
        })
      }, function (error) {
        console.log("ERROR");
      });

      self.areThereSlots = function() {
        if(self.data) {
          return !(self.data.length == 0);
        }
      }

      self.removeSlot = function (slot) {
        if (confirm("Are you sure you want to delete? This will remove all volunteers from this time slot.")) {
          console.log("Deleting");

          var vols = slot.volunteers;
          vols.forEach(function(volunteer) {
            Volunteer.get({id: volunteer}, function(results) {
              var vol = results;
              var index = vol.slots.indexOf(slot._id);
              if(index > -1) {
                vol.slots.splice(index, 1);
              }
              console.log("updating");

              index = -1;
              var i = 0;
              vol.locations.forEach(function(location) {
                if(location.slotID == slot._id) {
                  console.log("found");
                  index = i;
                }
                i++;
              });

              if(index > -1) {
                vol.locations.splice(index, 1);
              }

              Volunteer.update({id: volunteer}, vol);
            });
          });

          Slot.remove({id: slot._id});
          var index = self.data.indexOf(slot);
          if (index > -1) {
            self.data.splice(index, 1);
          }
        }
      }

    } else if ($state.current.name == "slot-detail") {
      self.vols = [];
      self.exists = false;

      self.getLocations = function(response, callback) {
        Job.get({id: response.jobID}, function(results) {
          var locs = results.locations;
          var inc = 0;
          locs.forEach(function(location) {
            Location.get({id: location}, function(results2) {
              inc++;
              self.locations.push(results2);
              if(inc == locs.length) {
                callback();
              }
            });
          });
        });
      }

      self.slot = Slot.get({id: $stateParams.id}, function (response) {
        self.exists = true;
        self.slot["left"] = self.slot.volunteersNeeded - self.slot.volunteers.length;

        self.getLocations(response, function() {
          var vols = self.slot.volunteers;
          vols.forEach(function(data) {
            Volunteer.get({id: data}).$promise.then(function(results) {
              results.locations.forEach(function(location) {
                if(location.slotID == self.slot._id) {
                  self.locations.forEach(function(location2) {
                    if(location2._id == location.locationID) {
                      results.location = location2;
                    }
                  })
                }
              });
              console.log(results);
              self.vols.push(results);
              console.log(self.vols);
            });
          });
        });
      });


      self.volunteers = Volunteer.query();

      self.doesSlotExist = function () {
        if(self.slot) {
          return self.exists;
        }
      }

      self.areThereAssignees = function() {
        if(self.vols) {
          return !(self.vols.length == 0);
        }
      }

      self.areThereVolunteers = function() {
        if(self.volunteers) {
          return !(self.volunteers.length == 0);
        }
      }


      self.addVolunteer = function() {

        if(self.volunteer) {
          if(!self.slot.volunteers.includes(self.volunteer)) {
            if (self.location) {
              if (self.vols.length >= self.slot.volunteersNeeded) {
                self.error = true;
                self.errorMessage = "You cannot add more volunteers than needed.";
                self.success = false;
              } else {
                self.conflictLoop(self.slot, self.volunteer, function(returnMessage) {
                  if(!(returnMessage === "You have successfully added a volunteer to this time slot.")) {
                    self.error = true;
                    self.success = false;
                    self.errorMessage = returnMessage;//"This person is already assigned to a time slot during this time period.";
                  } else {
                    self.slot.volunteers.push(self.volunteer);
                    Slot.update({id: $stateParams.id}, self.slot);
                    Volunteer.get({id: self.volunteer}).$promise.then(function (results) {
                      Location.get({id: self.location}, function(results2) {
                        results.location = results2;
                        self.vols.push(results);
                        console.log(self.vols);
                        var vol = results;
                        vol.slots.push(self.slot._id);
                        vol.locations.push({"locationID" : self.location, "slotID" : self.slot._id});
                        console.log("Slot Title: " + self.getJobTitle(self.slot.jobID));
                        if (self.getJobTitle(self.slot.jobID) === "Child Team Performing") {
                          vol.teamSlots++;
                          console.log("teamSlots: " + vol.teamSlots);
                        }
                        Volunteer.update({id: vol._id}, vol);
                        self.slot["left"]--;
                        self.success = true;
                        self.error = false;
                        self.volunteer = "";
                        self.location = "";
                      });
                    }, function (error) {
                      console.log("ERROR");
                    });
                  }
                });
              }
            } else {
              self.error = true;
              self.success = false;
              self.errorMessage = "You must choose a location for this volunteer.";
            }
          } else {
            self.error = true;
            self.success = false;
            self.errorMessage = "You have already added this volunteer to this time slot.";
          }
        } else {
          console.log("err");
          self.error = true;
          self.success = false;
          self.errorMessage = "You must choose a volunteer to be added.";
        }
      }

      self.removeVolunteer = function(volunteer) {
        if (confirm("Are you sure you want to delete?")) {
          Slot.get({id: self.slot._id}, function(results) {
            var slot = results;
            var index = slot.volunteers.indexOf(volunteer._id);
            if(index > -1) {
              slot.volunteers.splice(index, 1);
            }
            Slot.update({id: self.slot._id}, slot);
          });

          Volunteer.get({id: volunteer._id}, function (results) {
            var vol = results;
            console.log(vol);
            var index = vol.slots.indexOf(self.slot._id);
            if (index > -1) {
              vol.slots.splice(index, 1);
            }
            console.log("updating");

            index = -1;
            var i = 0;
            vol.locations.forEach(function(location) {
              if(location.slotID == self.slot._id) {
                console.log("found");
                index = i;
              }
              i++;
            });

            if(index > -1) {
              vol.locations.splice(index, 1);
            }

            Volunteer.update({id: volunteer._id}, vol);
          });

          self.slot.left++;

          var index = self.vols.indexOf(volunteer);
          if(index > -1) {
            self.vols.splice(index, 1);
          }

          index = self.slot.volunteers.indexOf(volunteer._id);
          if(index > -1) {
            self.slot.volunteers.splice(index, 1);
          }

        }
      }

    } else if($state.current.name == "slot-create" || $state.current.name == "slot-create-define") {

      self.error = false;
      self.success = false;
      self.singleJob = false;
      self.errorMessage = "";

      // Get jobs
      if($stateParams.id) {
        self.singleJob = true;
        self.job = Job.get({id: $stateParams.id});
        self.jobs = [self.job];
        self.errorMessage = "You cannot create a time slot for a non-existent job.";
      } else {
        self.jobs = Job.query();
        self.errorMessage = "There are currently no entered jobs. To create a time slot, you must first create jobs.";
      }

      self.canCreate = function () {
        if(self.jobs) {
          return !(self.jobs.length == 0);
        }
      }

      self.isSingleJob = function() {
        return self.singleJob;
      }

      self.createSlot = function () {
        console.log("clicked submit!");
        if(self.singleJob) {
          self.jobtitle = self.job._id;
        }
        if (self.start && self.jobtitle && self.end && self.volunteersNeeded) {
          if(parseInt(self.start) < parseInt(self.end)) {
            console.log(self.volunteer);
            Slot.save({
              start: self.start,
              end: self.end,
              volunteers: [],
              volunteersNeeded: self.volunteersNeeded,
              jobID: self.jobtitle,
              createdBy: Auth.getCurrentUser()._id
            });
            self.error = false;
            self.jobtitle = "";
            self.start = "";
            self.end = "";
            self.volunteersNeeded = "";
            self.success = true;
          } else if(parseInt(self.start) == parseInt(self.end)) {
            self.error = true;
            self.success = false;
            self.errorMessage = "Your start time and end time cannot be the same.";
          } else {
            self.error = true;
            self.success = false;
            self.errorMessage = "Your start time and end time are not in chronological order.";
          }
        } else {
          self.error = true;
          self.success = false;
          self.errorMessage = "You must fill out all of the required fields.";
        }

      }
    }
  });
