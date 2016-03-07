'use strict';

angular.module('ulyssesApp')
  .controller('JobCtrl', function ($scope, $state, Job) {
    var self = this;


    if($state.current.name == "job") {



    } else if($state.current.name == "job-create") {

      self.createJob = function() {
        console.log("Clicked submit!");
        console.log(self.jobtitle);
        var data = { title: self.jobtitle, description: self.description };
        Job.save(data);
        self.jobtitle = "";
        self.description = "";
      }

    }
  });
