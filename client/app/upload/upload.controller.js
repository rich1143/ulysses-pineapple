'use strict';

angular.module('ulyssesApp')
  .controller('UploadCtrl', function ($scope) {


    $scope.uploadFile = function() {
      console.log("Clicked submit");
      console.log("")
      Papa.parse(file, {
        header: true,
        dynamicTyping: true,
        complete: function(results) {
          data = results;
          console.log(data);
        }
      });
    }
  });
