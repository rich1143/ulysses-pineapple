'use strict';

angular.module('ulyssesApp')
  .controller('SlotCtrl', function ($scope, $state, $stateParams, Volunteer, Job, Slot, Auth) {
    var self = this;
    self.success = false;
    self.error = false;

    console.log($state.current.name)

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
      var strTime = time.toString();
      return strTime.substring(0, strTime.length / 2) + ":" + strTime.substring(strTime.length / 2, strTime.length);
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
        if(self.volunteer) {
          self.slot.volunteers.push(self.volunteer);
          console.log(self.slot);
          Slot.update({ id: $stateParams.id}, self.slot);

          Volunteer.get({id: self.volunteer }).$promise.then(function(results) {
            console.log("async finished");
            var vol = results;
            vol.slots.push(self.slot._id);
            Volunteer.update({id: vol._id}, vol);
          }, function(error) {
            console.log("ERROR");
          });
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

      self.isSuccess = function () {
        return self.success;
      }

      self.isError = function () {
        return self.error;
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
