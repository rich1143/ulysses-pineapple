'use strict';

angular.module('ulyssesApp')
  .controller('SlotCtrl', function ($scope, $state, Job, Slot, Auth) {
    var self = this;

    if($state.current.name == "slot") {

      self.data = Slot.query();


    } else if($state.current.name == "slot-create") {

      // Get jobs
      self.jobs = Job.query();
      self.errorMessage = "";



      self.createSlot = function () {
        console.log("clicked submit!");

        if(self.start && self.jobtitle && self.end && self.volunteersNeeded) {
          Slot.save({ start: self.start, end: self.end, volunteers: [], volunteersNeeded: self.volunteersNeeded, jobID: self.jobtitle, createdBy: Auth.getCurrentUser()._id });
          self.errorMessage = "";
        } else {
          self.errorMessage = "You must fill out all the fields.";
        }

      }


    }
  });
