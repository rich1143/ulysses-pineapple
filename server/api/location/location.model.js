'use strict';

var mongoose = require('bluebird').promisifyAll(require('mongoose'));

var LocationSchema = new mongoose.Schema({
  name: String,
  jobID: String
});

export default mongoose.model('Location', LocationSchema);
