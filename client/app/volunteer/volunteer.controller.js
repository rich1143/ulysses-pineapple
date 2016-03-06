'use strict';

angular.module('ulyssesApp')
  .controller('VolunteerCtrl', function ($scope, Volunteer) {
    var self = this;

    self.data = [];
    self.data = Volunteer.query();
  });
