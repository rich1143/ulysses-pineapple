'use strict';

angular.module('ulyssesApp')
  .controller('UploadCtrl', function($http, $scope, socket, Upload, Job, Volunteer, Auth, Location, Slot) {
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

              var jobsToCreate = [];

              var volunteers = Volunteer.query(function() {
                console.log("Got the things of stuff.");

                volunteers.forEach(function(vol) {
                  if (vol.jobPreference1.includes("Non-Judging")) {
                    var title = vol.jobPreference1.substring("Non-Judging".length + 1);
                    if (title != "" && title != null && title != " " && title != "No Preference" && title != "none" && title != "None" &&
                      jobsToCreate.indexOf(title) == -1) {
                      console.log(title);
                      jobsToCreate.push(title);
                    }
                  }
                  if (vol.jobPreference2.includes("Non-Judging")) {
                    var title = vol.jobPreference2.substring("Non-Judging".length + 1);
                    if (title != "" && title != null && title != " " && title != "No Preference" && title != "none" && title != "None" &&
                      jobsToCreate.indexOf(title) == -1) {
                      console.log(title);
                      jobsToCreate.push(title);
                    }
                  }
                });

                jobsToCreate.forEach(function(title) {
                  var data = {title: title, description: "Please give this job a description!", createdBy: Auth.getCurrentUser()._id};
                  Job.save(data, function(jobResponse) {
                    var defaultLocID;
                    Location.save({name: "Location TBD", jobID: jobResponse._id}, function (locResponse) {
                      defaultLocID = locResponse._id;
                      Job.update( {id: jobResponse._id},{title: title, description: "Please give this job a description!", createdBy: Auth.getCurrentUser()._id, locations: [defaultLocID]})
                    });
                  });
                });

                Job.save({title: "Child Team Performing", description: "The volunteer is watching their child!", createdBy: Auth.getCurrentUser()._id}, function(jobResponse) {
                  var defaultLocID;
                  Location.save({name: "Location TBD", jobID: jobResponse._id}, function (locResponse) {
                    defaultLocID = locResponse._id;
                    Job.update( {id: jobResponse._id},{title: title, description: "Please give this job a description!", createdBy: Auth.getCurrentUser()._id, locations: [defaultLocID]})
                  });
                });

              });

            }
          });
        }
      });
    }

    self.uploadTeams = function() {
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
