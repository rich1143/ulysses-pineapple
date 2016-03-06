'use strict';

angular.module('ulyssesApp')
  .controller('UploadCtrl', function($http, $scope, socket, Upload) {
    var self = this;

    self.uploadFile = function() {
      console.log("Clicked submit");
      Papa.parse(this.fileinput, {
        header: true,
        dynamicTyping: true,
        complete: function(results) {
          console.log(results);
          Upload.save(results);
        }
      });
    }
});
