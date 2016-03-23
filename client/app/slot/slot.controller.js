'use strict';

angular.module('ulyssesApp')
  .controller('SlotCtrl', function ($scope, $state, $stateParams, Volunteer, Job, Slot, Auth) {
    var self = this;
    self.success = false;
    self.error = false;

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
      if (time) {
        var strTime = time.toString();
        return strTime.substring(0, strTime.length / 2) + ":" + strTime.substring(strTime.length / 2, strTime.length);
      }
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

    if($state.current.name == "slot") {

      Slot.query().$promise.then(function(results) {
        self.data = results;
        self.data.forEach(function(slot) {
          slot["jobTitle"] = self.getJobTitle(slot.jobID);
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
      self.slot = Slot.get({id: $stateParams.id}, function (response) {
        var vols = self.slot.volunteers;
        vols.forEach(function(data) {
          Volunteer.get({id: data}).$promise.then(function(results) {
            self.vols.push(results);
            console.log(self.vols);
          })
        });
      });
      self.volunteers = Volunteer.query();

      self.areThereAssignees = function() {
        if(self.vols) {
          return !(self.vols.length == 0);
        }
      }

      self.addVolunteer = function() {
        if(self.volunteer && !self.slot.volunteers.includes(self.volunteer)) {

          self.slot.volunteers.push(self.volunteer);
          console.log(self.slot);
          Slot.update({ id: $stateParams.id}, self.slot);

          Volunteer.get({id: self.volunteer }).$promise.then(function(results) {
            console.log("async finished");
            self.vols.push(results);
            var vol = results;
            vol.slots.push(self.slot._id);
            Volunteer.update({id: vol._id}, vol);
            self.success = true;
            self.error = false;
          }, function(error) {
            console.log("ERROR");
          });
        } else {
          console.log("err");
          self.error = true;
          self.success = false;
          self.errorMessage = "You have already added this volunteer to this time slot.";
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
            Volunteer.update({id: volunteer._id}, vol);
          });

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

    } else if($state.current.name == "slot-create") {

      // Get jobs
      self.jobs = Job.query();
      self.error = false;
      self.success = false;

      self.canCreate = function () {
        if(self.jobs) {
          return !(self.jobs.length == 0);
        }
      }

      self.createSlot = function () {
        console.log("clicked submit!");

        if(self.start && self.jobtitle && self.end && self.volunteersNeeded) {
          console.log(self.volunteer);
          Slot.save({ start: self.start, end: self.end, volunteers: [], volunteersNeeded: self.volunteersNeeded, jobID: self.jobtitle, createdBy: Auth.getCurrentUser()._id });
          self.error = false;
          self.jobtitle = "";
          self.start = "";
          self.end = "";
          self.volunteersNeeded = "";
          self.success = true;
        } else {
          self.error = true;
          self.success = false;
        }

      }


    }
  });
