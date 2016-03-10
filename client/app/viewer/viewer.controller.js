'use strict';

angular.module('ulyssesApp')
  .controller('ViewerCtrl', function ($scope, $state, $stateParams, Volunteer) {
    var self = this;

    self.data = [];
    self.volunteer = {};

    console.log($state.current.name);
    if ($state.current.name == "viewer") {
      self.data = Volunteer.query();
    } else if($state.current.name == "viewer-detail") {
      self.volunteer = Volunteer.get({id: $stateParams.id}, function (response) {
        console.log(response);
      });
    }
  });
