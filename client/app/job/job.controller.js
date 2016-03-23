'use strict';

angular.module('ulyssesApp')
  .controller('JobCtrl', function ($scope, $state, $stateParams, Job, Slot, Auth) {
    var self = this;
    self.error = false;
    self.success = false;

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
              Slot.remove({id: slot._id});
            });
          });

          //Job.remove({id: job._id});
          //var index = self.data.indexOf(job);
          //if(index > - 1) {
           // self.data.splice(index, 1);
          //}
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
        var strTime = time.toString();
        return strTime.substring(0, strTime.length / 2) + ":" + strTime.substring(strTime.length / 2, strTime.length);
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
