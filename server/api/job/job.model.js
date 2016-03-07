'use strict';

var mongoose = require('bluebird').promisifyAll(require('mongoose'));

var JobSchema = new mongoose.Schema({
  title: String,
  description: String,
  createdBy: String,
});

export default mongoose.model('Job', JobSchema);
