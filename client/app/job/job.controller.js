'use strict';

angular.module('ulyssesApp')
  .controller('JobCtrl', function ($scope, $state, $stateParams, Job, Slot, Auth, Volunteer) {
    var self = this;
    self.error = false;
    self.success = false;
    self.readOnly = true;

    self.isSuccess = function () {
      return self.success;
    }

    self.isError = function () {
      return self.error;
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

      self.createJob = function() {
        if(self.jobtitle.length >= 1 && self.description.length >=1) {
          console.log("Clicked submit!");

          var data = { title: self.jobtitle, description: self.description, createdBy: Auth.getCurrentUser()._id };
          Job.save(data);

          self.jobtitle = "";
          self.description = "";
          self.error = false;
          self.success = true;
        } else {
          self.error = true;
          self.success = false;
        }

      }

    } else if($state.current.name == "job-detail") {
      self.job = Job.get({id: $stateParams.id});
      self.slots = Slot.query({jobID: $stateParams.id});

      self.parseTime = function(time) {
        if(time) {
          var strTime = "";
          if(time >= 1300) {
            time = time - 1200;
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
