'use strict';

angular.module('ulyssesApp')
  .controller('ViewerCtrl', function ($scope, $state, $stateParams, Volunteer, Slot, Job) {
    var self = this;

    self.data = [];
    self.slots = [];
    self.volunteer = {};

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
      var title;
      self.jobTitles.forEach(function(job) {

        if(job.id == name) {
          title = job.title;
        }

      });
      return title;
    }

    self.areThereVolunteers = function() {
      if(self.data) {
        return !(self.data.length == 0);
      }
    }

    self.areThereSlots = function() {
      if(self.slots) {
        return !(self.slots.length == 0);
      }
    }

    if ($state.current.name == "viewer") {
      self.data = Volunteer.query();
    } else if($state.current.name == "viewer-detail") {
      Volunteer.get({id: $stateParams.id}, function (response) {
        console.log(response);
        self.volunteer = response;

        self.volunteer.slots.forEach(function(data) {
          console.log("id: ", data);
          Slot.get({id: data}).$promise.then(function(results) {
            console.log("async finished");
            self.slots.push(results);
            console.log(self.slots);
          }, function(error) {
            console.log("ERROR");
          });
        });

      });
    }
  });
