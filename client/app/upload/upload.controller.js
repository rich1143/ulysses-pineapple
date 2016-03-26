'use strict';

angular.module('ulyssesApp')
  .controller('UploadCtrl', function($http, $scope, socket, Upload) {
    var self = this;
    var uploaded = false;
    var uploaded2 = false;

    self.uploadFile = function() {
      console.log("Clicked submit");
      Papa.parse(this.fileinput, {
        header: true,
        dynamicTyping: true,
        complete: function(results) {

          console.log(results);
          Upload.save({"type" : 1, "results" : results}, function (response) {
            if(response['success']) {
              uploaded = true;
              console.log("Successful upload");
            }
          });
        }
      });
    }

    self.uploadTeams = function() {
      console.log("Clicked submit 2");
      Papa.parse(this.fileinput2, {
        header: true,
        dynamicTyping: true,
        complete: function(results) {

          console.log(results);
          Upload.save({"type" : 2, "results" : results}, function (response) {
            if(response['success']) {
              uploaded2 = true;
              console.log("Successful upload");
            }
          });
        }
      });
    }

    self.isUploaded = function() {
      return uploaded;
    }

    self.isUploaded2 = function() {
      return uploaded2;
    }
});
