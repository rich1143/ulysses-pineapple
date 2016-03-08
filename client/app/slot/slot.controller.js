'use strict';

angular.module('ulyssesApp')
  .controller('SlotCtrl', function ($scope, $state, Job, Slot) {
    var self = this;

    if($state.current.name == "slot") {



    } else if($state.current.name == "slot-create") {

      // Get jobs
      self.jobs = Job.query();

    }
  });
