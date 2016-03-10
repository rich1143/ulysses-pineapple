'use strict';

angular.module('ulyssesApp')
  .controller('JobCtrl', function ($scope, $state, Job, Auth) {
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

    }
  });
