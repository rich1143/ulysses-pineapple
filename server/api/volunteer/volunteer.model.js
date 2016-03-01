'use strict';

var mongoose = require('bluebird').promisifyAll(require('mongoose'));

var VolunteerSchema = new mongoose.Schema({
  name: String,
  info: String,
  active: Boolean
});

export default mongoose.model('Volunteer', VolunteerSchema);
