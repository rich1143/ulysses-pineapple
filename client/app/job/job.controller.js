'use strict';

angular.module('ulyssesApp')
  .controller('JobCtrl', function ($scope, $state, $stateParams, Job, Slot, Auth, Volunteer, Location) {
    var self = this;
    self.error = false;
    self.success = false;
    self.readOnly = true;
    self.locations = [];

    self.isSuccess = function () {
      return self.success;
    }

    self.isError = function () {
      return self.error;
    }

    self.addLocation = function() {
      if(self.location.length >= 1) {
        self.locations.push(self.location);
        self.location = "";
      }
    }

    self.areThereLocations = function() {
      if(self.locations) {
        return !(self.locations.length == 0);
      }
    }

    if($state.current.name == "job") {

      self.data = [];
      self.data = Job.query();

      self.areThereJobs = function() {
        if(self.data) {
          return !(self.data.length == 0);
        }
      }

      self.removeJob = function (job) {
        if(confirm("Are you sure you want to delete? This will delete all time slots associated with this job.")) {
          console.log("Deleting");

          Slot.query({jobID: job._id}, function(results) {
            var slots = results;
            slots.forEach(function(slot) {
              console.log("Removing slot...");
              slot.volunteers.forEach(function(volunteer) {
                Volunteer.get({id: volunteer}, function(results2) {
                  var vol = results2;
                  var index = vol.slots.indexOf(slot._id);
                  if(index > -1) {
                    vol.slots.splice(index, 1);
                  }
                  console.log("new", vol.slots);
                  console.log("updating");
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

      self.removeLocation = function(index) {
        self.locations.splice(index, 1);
      }

      self.createLocations = function(callback) {
        var inc = 0;
        var data = [];
        self.locations.forEach(function(location) {
          var loc = new Location({name: location});
          loc.$save(function(item, response) {
            inc++;
            data.push(item._id);
            if(inc == self.locations.length) {
              callback(data);
            }
          });
        });
      }

      self.createJob = function() {
        if(self.jobtitle.length >= 1 && self.description.length >=1) {
          if(self.locations.length >= 1) {
            console.log("Clicked submit!");

            self.createLocations(function(data2) {
              var data = { title: self.jobtitle, description: self.description, createdBy: Auth.getCurrentUser()._id, locations: data2 };
              Job.save(data);

              self.jobtitle = "";
              self.description = "";
              self.locations = [];
              self.error = false;
              self.success = true;
            });
          } else {
            self.error = true;
            self.success = false;
            self.errorMessage = "You must enter at least one location for this job."
          }
        } else {
          self.error = true;
          self.success = false;
          self.errorMessage = "You must fill out all of the required fields.";
        }

      }

    } else if($state.current.name == "job-detail") {
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

      self.removeLocation = function(location) {
        var index = self.job.locations.indexOf(location._id);
        if(index > -1) {
          self.job.locations.splice(index, 1);
        }
        Job.update({id: self.job._id}, self.job);

        var index = self.locations.indexOf(location);
        if(index > -1) {
          self.locations.splice(index, 1);
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

      self.toggleEdit = function () {
        self.readOnly = !self.readOnly;
      }

      self.updateJob = function() {
        console.log("updating");
        if(self.job.title.length > 1 && self.job.description.length > 1) {
          var job = {title: self.job.title, description: self.job.description};
          Job.update({id: $stateParams.id}, job);
          self.success = true;
          self.error = false;
          self.toggleEdit();
        } else {
          self.success = false;
          self.error = true;
        }

      }

      self.cancelUpdates = function() {
        console.log("Cancel");
        self.job = Job.get({id: $stateParams.id});
        self.toggleEdit();
        self.success = false;
        self.error = false;

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
