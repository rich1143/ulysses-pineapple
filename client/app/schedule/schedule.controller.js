'use strict';

angular.module('ulyssesApp')
  .controller('ScheduleCtrl', function ($scope, $state, $stateParams, Job, Slot, Auth, Volunteer) {
    var self = this;
    self.data = {"times" : []};
    self.times = [800,815,830,845,900,915,930,945,1000,1015,1030,1045,1100,1115,1130,1145,1200,1215,1230,1245,1300,1315,1330,1345,1400,1415,1430,1445,1500,1515,1530,1545,1600,1615,1630,1645,1700,1715,1730,1745,1800];

    self.parseTime = function(time) {
      if(time) {
        var strTime = "";
        if(time >= 1300) {
          time = time - 1200;
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

      self.createSchedule = function() {

        Job.query({}, function(results) {
          var jobs = results;
          console.log("jobs: ", jobs);
          self.times.forEach(function(time) {
            console.log("Time: ", time);
            jobs.forEach(function(job) {
              console.log("job: ", job, "time: ", time);
              Slot.query({jobID: job._id}, function(results2) {
                var slots = results2;
                slots.forEach(function(slot) {
                  if(slot.start <= time && time <= slot.end) {
                    self.data["times"].push(time);
                    //self.data.push({"time" : time,  : true});
                  } else {
                    self.data["times"].push(time);
                    //self.data.push({"time" : time});
                  }
                });
              });
            });

          });
        });
      }

      self.hasTime = function(jobid, time) {
        Slot.query({jobID: jobid}, function(results) {
          var slots = results;
          var slotsInTime = [];

          slots.forEach(function(slot) {
            console.log("Checking slot", slot._id, "Start: ", slot.start, " End:", slot.end);

            if(slot.start <= time && time <= slot.end) {
              slotsInTime.push(slot);
            } else {
              //
            }
          });

          return slotsInTime;
        })

      }


      self.createSchedule();
    }
  });
