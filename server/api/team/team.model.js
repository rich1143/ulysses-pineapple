'use strict';

var mongoose = require('bluebird').promisifyAll(require('mongoose'));

var TeamSchema = new mongoose.Schema({
  problem: Number,
  division: String,
  teamNumber: Number,
  teamName: String,
  city: String,
  state: String,
  coachFirstName: String,
  coachLastName: String,
  longTime: String,
  SponTime: String
});

export default mongoose.model('Team', TeamSchema);
