'use strict';

(function() {

  class UploadCtrl {

    constructor($http, $scope, socket) {

      self = this;

    }

    uploadFile() {
      console.log("Clicked submit");
      console.log(this.fileinput);
      Papa.parse(this.fileinput, {
        header: true,
        dynamicTyping: true,
        complete: function(results) {
          var data = results;
          console.log(data);
        }
      });
    }
  }

    angular.module('ulyssesApp').controller('UploadCtrl', UploadCtrl);

  })();


