'use strict';

var mongoose = require('bluebird').promisifyAll(require('mongoose'));
var Slot = require('../slot/slot.model.js');

var VolunteerSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  assoc: String,
  street1: String,
  street2: String,
  city: String,
  state: String,
  zip: String,
  country: String,
  region: String,
  phone: String,
  workPhone: String,
  email: String,
  fax: String,
  assocExp: Number,
  coachExp: Number,
  memberExp: Number,
  username: String,
  password: String,
  current: String,
  jobPreference1: String,
  jobPreference2: String,
  membershipNumber: Number,
  problem: Number,
  division: Number,
  submitDate: String,
  lastModified: String,
  mName: String,
  mRegion: String,
  childTeam: String,
  coachEmail: String,
  coachName: String,
  tshirtSize: String,
  positionHeld: String,
  comment: String,
  certP1: Boolean,
  certP2: Boolean,
  certP3: Boolean,
  certP4: Boolean,
  certP5: Boolean,
  certScore: Boolean,
  certSpont: Boolean,
  isJudge: Boolean,
  slots: [Slot]
});

export default mongoose.model('Volunteer', VolunteerSchema);
