'use strict';

angular.module('ulyssesApp')
  .controller('SlotCtrl', function ($scope, $state, $stateParams, Job, Slot, Auth) {
    var self = this;
    self.success = false;
    self.error = false;

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

    self.getJobTitle = function(name) {
      console.log("Getting title");
      var title;
      self.jobTitles.forEach(function(job) {

        if(job.id == name) {
          console.log("found", job.title);
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



    } else if ($state.current.name == "slot-detail") {
      self.slot = Slot.get({id: $stateParams.id}, function (response) {
        console.log(response);
      });
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

      self.isSuccess = function () {
        return self.success;
      }

      self.isError = function () {
        return self.error;
      }

      self.createSlot = function () {
        console.log("clicked submit!");

        if(self.start && self.jobtitle && self.end && self.volunteersNeeded) {
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
