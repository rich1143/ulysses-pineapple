'use strict';

angular.module('ulyssesApp')
  .controller('ScheduleCtrl', function ($scope, $state, $stateParams, Job, Slot, Auth, Volunteer) {
    var self = this;
    self.slotMode = false;
    self.data = {"times" : []};
    self.times = [800,815,830,845,900,915,930,945,1000,1015,1030,1045,1100,1115,1130,1145,1200,1215,1230,1245,1300,1315,1330,1345,1400,1415,1430,1445,1500,1515,1530,1545,1600,1615,1630,1645,1700,1715,1730,1745,1800];
    //self.times = [800, 815, 830, 845, 1700];
    self.width = 10.0;
    //self.times2 = [{"time" : 800, jobs}]
    self.jobs = Job.query({}, function(results) {
      self.width = ((100 / results.length) - (17  / results.length)) + "%";
      console.log(self.width);
    });

    // if jobs exists it returns that the job length is not zero
    self.areThereJobs = function() {
      if(self.jobs) {
        return !(self.jobs.length == 0);
      }
    }

    // returns false
    self.getSlotMode = function() {
      return self.slotMode;
    }

    // returns the opposite of slot mode
    self.toggleSlotMode = function() {
      self.slotMode = !self.slotMode;
      console.log(self.slotMode);
    }

    // returns schedule-container-big if there are jobs and schedule container if there are no jobs
    self.getClass = function() {
      if(self.areThereJobs()) {
        return "schedule-container-big";
      } else {
        return "schedule-container";
      }
    }

    // pushes volunteers in their assigned time slots onto the row corresponding to the time
    self.getRow = function(time) {
      console.log("Run once");
      var result = {"slots" : []};
      Job.query({}, function(results) {
        var jobs = results;
        jobs.forEach(function(job) {
          Slot.query({jobID: job._id}, function(results2) {
            var slots = results2;
            slots.forEach(function(slot) {
              if(slot.start <= time && time < slot.end) {
                //console.log("YES");
                var vols = [];
                slot.volunteers.forEach(function(volunteer) {
                  Volunteer.get({id: volunteer}, function(results3) {
                    vols.push(results3);
                  });
                });
                result["slots"].push({"id" : slot._id, "jobID" : job._id, "volunteers" : vols});
              } else {
                //console.log("NO");
              }
            });
          });
        });
      });
      return result;
    }

    
    // displays volunteers first and last name
    self.displaySlot = function(jobID, data) {
      if(data) {
        var returnData = [];
        data.forEach(function(element) {
          if(element["jobID"] == jobID) {
            element["volunteers"].forEach(function(volunteer) {
              console.log("test");
              var vol = volunteer.firstName + " " + volunteer.lastName;
              returnData.push(vol);
            });
          }
        });

        
        returnData.sort();
        var string = "";
        for(var i = 0; i < returnData.length; i++) {
          if(i == returnData.length - 1) {
            string = string + returnData[i];
          } else {
            string = string + returnData[i] + ", ";
          }
        }
        return string;
      }
    }

    // changes military time to standard time
    self.parseTime = function(time) {
      if(time) {
        var strTime = "";
        if(time >= 1300) {
          time = time - 1200;
          strTime = time.toString();
          strTime = strTime.substring(0, strTime.length / 2) + ":" + strTime.substring(strTime.length / 2, strTime.length);
          strTime = strTime + " PM";
        } else if(time >= 1200) {
          strTime = time.toString();
          strTime = strTime.substring(0, strTime.length / 2) + ":" + strTime.substring(strTime.length / 2, strTime.length);
          strTime = strTime + " PM";
        } else {
          strTime = time.toString();
          strTime = strTime.substring(0, strTime.length / 2) + ":" + strTime.substring(strTime.length / 2, strTime.length);
          strTime = strTime + " AM";
        }

        return strTime;
      }
    }

    //[{"time": 800, "slots": [{jobid: , slotid: ""}]}]


    if($state.current.name == "schedule") {

    }
  });
