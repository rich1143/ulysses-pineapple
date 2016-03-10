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
      self.errorMessage = "";

      self.createJob = function() {
        if(self.jobtitle.length >= 1 && self.description.length >=1) {
          console.log("Clicked submit!");

          var data = { title: self.jobtitle, description: self.description, createdBy: Auth.getCurrentUser()._id };
          Job.save(data);

          self.jobtitle = "";
          self.description = "";
          self.errorMessage = "";
        } else {
          console.log("eror");
          self.errorMessage = "You must fill out all relevant information!";
        }

      }

    }
  });
