'use strict';

angular.module('ulyssesApp')
  .controller('JobCtrl', function ($scope, $state, $stateParams, Job, Slot, Auth) {
    var self = this;


    if($state.current.name == "job") {

      self.data = [];
      self.data = Job.query();

      self.areThereJobs = function() {
        if(self.data) {
          return !(self.data.length == 0);
        }
      }

    } else if($state.current.name == "job-create") {
      self.jobtitle = "";
      self.description = "";
      self.error = false;
      self.success = false;

      self.isSuccess = function () {
        return self.success;
      }

      self.isError = function () {
        return self.error;
      }

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
      self.slots = Slot.query();

      self.parseTime = function(time) {
        var strTime = time.toString();
        return strTime.substring(0, strTime.length / 2) + ":" + strTime.substring(strTime.length / 2, strTime.length);
      }

      self.areThereSlotsHere = function() {
        if(self.slots && self.job) {
          var areThere = false;
          self.slots.forEach(function(data) {
            if(data.jobID == self.job._id) {
              areThere = true;
            }
          });

          return areThere;
        }
      }
    }
  });
