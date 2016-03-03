'use strict';

var mongoose = require('bluebird').promisifyAll(require('mongoose'));

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
  workPhone, String,
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
  certP1: String,
  certP2: String,
  certP3: String,
  certP4: String,
  certP5: String,
  certScore: String,
  certSpont: String,
  isJudge: Boolean

});

export default mongoose.model('Volunteer', VolunteerSchema);
