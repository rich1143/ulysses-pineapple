'use strict';

angular.module('ulyssesApp')
  .controller('JobCtrl', function ($scope, $state, $stateParams, Job, Slot, Auth, Volunteer, Location, $anchorScroll, $timeout) {
    var self = this;
    self.error = false;
    self.success = false;
    self.readOnly = true;
    self.locations = [];


    // Data validator to express successful upload or data entry
    self.isSuccess = function () {
      return self.success;
    }

    //Data validator to express unsuccessful upload or data entry
    self.isError = function () {
      return self.error;
    }

    // Determines wheter or not to display list of job locations on job creation form
    self.areThereLocations = function() {
      if(self.locations) {
        return !(self.locations.length == 0);
      }
    }

    // Creates locations for for jobs on jobs form, then validates if the data entry was successful
    self.createLocations = function(loc2, callback) {
      var inc = 0;
      var data = [];
      console.log("Loc: " + loc2);
      loc2.forEach(function(location) {
        console.log("New!");
        var loc = new Location({name: location});
        loc.$save(function(item, response) {
          console.log("saved");
          inc++;
          data.push(item);
          if(inc == loc2.length) {
            callback(data);
          }
        });
      });
    }


    //
    if($state.current.name == "job") {

      self.data = [];
      self.data = Job.query();

      self.areThereJobs = function() {
        if(self.data) {
          return !(self.data.length == 0);
        }
      }

      //Enables user to deleted an added job from jobs list, validates whether user actually wants to execute deletion or not.
      self.removeJob = function (job) {
        if(confirm("Are you sure you want to delete? This will delete all time slots associated with this job.")) {
          console.log("Deleting");

          Slot.query({jobID: job._id}, function(results) {
            var slots = results;
            var test = [];
            slots.forEach(function(slot) {
              test.push(slot._id);
            });

            slots.forEach(function(slot) {
              slot.volunteers.forEach(function (volunteer) {
                Volunteer.get({id: volunteer}, function (results2) {
                  var vol = results2;
                  test.forEach(function(slotid) {
                    var index = vol.slots.indexOf(slotid);
                    if (index > -1) {
                      vol.slots.splice(index, 1);
                    }

                    index = -1;
                    var i = 0;
                    vol.locations.forEach(function (location) {
                      if (location.slotID == slotid) {
                        index = i;
                      }
                      i++;
                    });

                    if (index > -1) {
                      vol.locations.splice(index, 1);
                    }
                  });
                  Volunteer.update({id: volunteer}, vol);
                });
              });
              Slot.remove({id: slot._id});
            });
          });

          Job.remove({id: job._id});
          var index = self.data.indexOf(job);
          if(index > - 1) {
            self.data.splice(index, 1);
          }
        }
      }

    } else if($state.current.name == "job-create") {
      self.jobtitle = "";
      self.description = "";
      self.trainingTime = "";

      // Adds possible location to assign a job to take place at
      self.addLocation = function() {
        if(self.location.length >= 1) {
          self.locations.push(self.location);
          self.location = "";
        }
      }

      // Removes a possible location from list, does not validate if user truly wants to execute action
      self.removeLocation = function(index) {
        self.locations.splice(index, 1);
      }

      // Creates a job with the jobs form, with title and description fields, validates a successful submission
      self.createJob = function() {
        if(self.jobtitle.length >= 1 && self.description.length >=1) {
          if(self.locations.length >= 1) {
            console.log("Clicked submit!");

            self.createLocations(self.locations, function(data2) {
              var dt = [];
              data2.forEach(function(data) {
                dt.push(data._id);
              });

              var data = {title: self.jobtitle, description: self.description, createdBy: Auth.getCurrentUser()._id, locations: dt, trainingTime: self.trainingTime};
              Job.save(data);

              self.jobtitle = "";
              self.description = "";
              self.trainingTime = "";
              self.locations = [];
              self.error = false;
              self.success = true;
            });
          } else {

            var data = {title: self.jobtitle, description: self.description, createdBy: Auth.getCurrentUser()._id, locations: [], trainingTime: self.trainingTime};
            Job.save(data, function (jobResponse) {
              var defaultLocID;
              Location.save({name: "Location TBD", jobID: jobResponse._id}, function (locResponse) {
                defaultLocID = locResponse._id;
                Job.update({id: jobResponse._id}, {title: self.jobtitle, description: self.description, createdBy: Auth.getCurrentUser()._id, locations: [defaultLocID], trainingTime: self.trainingTime
                });

                self.jobtitle = "";
                self.description = "";
                self.trainingTime = "";
                self.locations = [];
                self.error = false;
                self.success = true;
              });
            });

            /*self.error = true;
            self.success = false;
            self.errorMessage = "You must enter at least one location for this job."*/
          }
        } else {
          self.error = true;
          self.success = false;
          self.errorMessage = "You must fill out all of the required fields.";
        }

      }

    } else if($state.current.name == "job-detail") {
      self.newLocations = [];
      self.exists = false;
      self.job = Job.get({id: $stateParams.id}, function(results) {
        self.exists = true;
        results.locations.forEach(function(location) {
          Location.get({id: location}, function(results2) {
            self.locations.push(results2);
          });
        });
      });
      Slot.query({jobID: $stateParams.id}, function(response) {
        self.slots = response;
        self.slots.forEach(function(slot) {
          slot["left"] = slot.volunteersNeeded - slot.volunteers.length;
        });
      });

      self.doesJobExist = function() {
        if(self.job) {
          return self.exists;
        }
      }

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

      self.addLocation = function() {
        console.log("Adding location");
        if(self.location.length >= 1) {
          self.locations.push({"name" : self.location});
          self.newLocations.push(self.location);
          self.location = "";
        }
      }

      self.checkForLocationUsage = function(location, callback) {
        var hasCalledBack = false;
        Slot.query({jobID: self.job._id}, function(results) {
          var i = 0;
          results.forEach(function(slot) {
            // for each slot, search its volunteer for this location
            var j = 0;
            slot.volunteers.forEach(function(volunteer) {
              Volunteer.get({id: volunteer}, function(vol) {
                var t = 0;
                vol.locations.forEach(function(loc) {
                  console.log("length1: ", results.length, "length2: ", slot.volunteers.length, "length3: ", vol.locations.length);
                  console.log("i ", i, "j ", j, "t ", t)
                  if(loc.locationID == location._id) {
                    console.log("FOUND A HIT");
                    if(!hasCalledBack) {
                      callback(true);
                    }
                    hasCalledBack = true;
                  }
                  t++;

                  if(i == results.length && j == (slot.volunteers.length - 1) && t == (vol.locations.length)) {
                    if(!hasCalledBack) {
                      callback(false);
                    }
                  }
                });
                j++;
              });
            });
            i++;
          });
        });
      }

      self.removeLocation = function(location) {
        if (self.locations.length > 1) {
          if (location._id) {

            self.checkForLocationUsage(location, function(results) {
              if(results === true) {
                $timeout(function() {
                  alert("You cannot delete a location that has been assigned to a volunteer.");
                })
              } else {
                var index = self.job.locations.indexOf(location._id);
                if (index > -1) {
                  self.job.locations.splice(index, 1);
                }
                Job.update({id: self.job._id}, self.job);

                var index = self.locations.indexOf(location);
                if (index > -1) {
                  self.locations.splice(index, 1);
                }
              }
            });


          } else {
            var index = self.locations.indexOf(location);
            if (index > -1) {
              self.locations.splice(index, 1);
            }

            index = self.newLocations.indexOf(location.name);
            if (index > -1) {
              self.newLocations.splice(index, 1);
            }
          }


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
              Volunteer.update({id: volunteer}, vol);
            });
          });

          Slot.remove({id: slot._id});
          var index = self.slots.indexOf(slot);
          if (index > -1) {
            self.slots.splice(index, 1);
          }
        }
      }

      self.isReadOnly = function() {
        return self.readOnly;
      }

      var temp;

      self.toggleEdit = function () {
        self.readOnly = !self.readOnly;
      }

      self.updateJob = function() {
        console.log("updating");
        console.log(self.newLocations)
        if(self.job.title.length > 1 && self.job.description.length > 1) {
          if(self.newLocations.length >= 1) {
            self.createLocations(self.newLocations, function (data2) {
              console.log("finished");
              data2.forEach(function (loc) {
                var index = -1;
                var i = 0;
                self.locations.forEach(function (location) {
                  if (location.name == loc.name) {
                    index = i;
                  }
                  i++;
                });

                if (index > -1) {
                  self.locations.splice(index, 1);
                }
                self.locations.push(loc);
                self.job.locations.push(loc._id);
              });
              var job = {title: self.job.title, description: self.job.description, locations: self.job.locations, trainingTime: self.job.trainingTime};
              Job.update({id: $stateParams.id}, job);
              self.newLocations = [];
              self.success = true;
              self.error = false;
              self.toggleEdit();
              $anchorScroll();
            });
          } else {
            var job = {title: self.job.title, description: self.job.description, trainingTime: self.job.trainingTime};
            Job.update({id: $stateParams.id}, job);
            self.newLocations = [];
            self.success = true;
            self.error = false;
            self.toggleEdit();
            $anchorScroll();
          }
        } else {
          self.success = false;
          self.error = true;
          $anchorScroll();
        }
      }

      self.cancelUpdates = function() {
        console.log("Cancel");
        self.locations = [];
        self.job = Job.get({id: $stateParams.id}, function(results) {
          self.exists = true;
          results.locations.forEach(function(location) {
            Location.get({id: location}, function(results2) {
              self.locations.push(results2);
            });
          });
        });
        self.newLocations = [];
        self.toggleEdit();
        self.success = false;
        self.error = false;
        $anchorScroll();
      }

      self.areThereSlotsHere = function() {
        if(self.slots && self.slots.length > 0) {
          return true;
        } else {
          return false;
        }
      }
    }
  });
