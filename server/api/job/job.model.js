'use strict';

var mongoose = require('bluebird').promisifyAll(require('mongoose'));

var JobSchema = new mongoose.Schema({
  name: String,
  description: String,
  startTime: String,
  endTime: String,
  createdBy: String,
  volunteer: String
});

export default mongoose.model('Job', JobSchema);
