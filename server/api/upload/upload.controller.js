/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/upload              ->  index
 * POST    /api/upload              ->  create
 * GET     /api/upload/:id          ->  show
 * PUT     /api/upload/:id          ->  update
 * DELETE  /api/upload/:id          ->  destroy
 */

'use strict';

import _ from 'lodash';
import Upload from './upload.model';
import Volunteer from '../volunteer/volunteer.model.js';
import Team from '../team/team.model.js';

function respondWithResult(res, statusCode) {
  statusCode = statusCode || 200;
  return function(entity) {
    if (entity) {
      res.status(statusCode).json(entity);
    }
  };
}

function saveUpdates(updates) {
  return function(entity) {
    var updated = _.merge(entity, updates);
    return updated.saveAsync()
      .spread(updated => {
        return updated;
      });
  };
}

function removeEntity(res) {
  return function(entity) {
    if (entity) {
      return entity.removeAsync()
        .then(() => {
          res.status(204).end();
        });
    }
  };
}

function handleEntityNotFound(res) {
  return function(entity) {
    if (!entity) {
      res.status(404).end();
      return null;
    }
    return entity;
  };
}

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function(err) {
    res.status(statusCode).send(err);
  };
}

// Gets a list of Uploads
export function index(req, res) {
  Upload.findAsync()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single Upload from the DB
export function show(req, res) {
  Upload.findByIdAsync(req.params.id)
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new Upload in the DB
export function create(req, res) {
  if(req.body.type == 1) {
    req.body.data = req.body.results.data;
    for (var i = 0; i < req.body.data.length; i++) {

      var volunteer = new Volunteer({
        firstName: req.body.data[i]['First name'],
        lastName: req.body.data[i]['Last name'],
        assoc: req.body.data[i]['assoc'],
        street1: req.body.data[i]['street1'],
        street2: req.body.data[i]['street2'],
        city: req.body.data[i]['city'],
        state: req.body.data[i]['state'],
        zip: req.body.data[i]['zip'],
        country: req.body.data[i]['country'],
        region: req.body.data[i]['Region'],
        phone: req.body.data[i]['phone'],
        workPhone: req.body.data[i]['workphone'],
        email: req.body.data[i]['E-mail'],
        fax: req.body.data[i]['fax'],
        assocExp: parseInt(req.body.data[i]['assoc_exp']),
        coachExp: parseInt(req.body.data[i]['coach_exp']),
        memberExp: parseInt(req.body.data[i]['member_exp']),
        username: req.body.data[i]['username'],
        password: req.body.data[i]['password'],
        current: req.body.data[i]['current'],
        jobPreference1: req.body.data[i]['Job Preference #1'],
        jobPreference2: req.body.data[i]['Job Preference #2'],
        membershipNumber: parseInt(req.body.data[i]['Membership#']),
        problem: parseInt(req.body.data[i]['Problem']),
        division: parseInt(req.body.data[i]['Division']),
        submitDate: req.body.data[i]['submitdate'],
        lastModified: req.body.data[i]['modify_on'],
        mName: req.body.data[i]['M.name'],
        mRegion: req.body.data[i]['M.region'],
        childTeam: req.body.data[i]['child_team'],
        coachEmail: req.body.data[i]['Coach E-mail'],
        coachName: req.body.data[i]['Coach name'],
        tshirtSize: req.body.data[i]['T-shirt'],
        positionHeld: req.body.data[i]['position_helds'],
        comment: req.body.data[i]['comment'],
        certP1: (req.body.data[i]['cert_p1'] == "yes"),
        certP2: (req.body.data[i]['cert_p2'] == "yes"),
        certP3: (req.body.data[i]['cert_p3'] == "yes"),
        certP4: (req.body.data[i]['cert_p4'] == "yes"),
        certP5: (req.body.data[i]['cert_p5'] == "yes"),
        certScore: (req.body.data[i]['cert_score'] == "yes"),
        certSpont: (req.body.data[i]['cert_spont'] == "yes"),
        isJudge: (req.body.data[i][''] == "AS_JUDGE"),
        slots: []
      });

      volunteer.save()
        .catch(handleError(res));
    }

    res.json({success: true});
  } else if(req.body.type == 2) {
    req.body.data = req.body.results.data;

    for(var i = 0; i < req.body.data.length; i++) {
      var team = new Team({
        problem: req.body.data[i]['Problem'],
        division: req.body.data[i]['Division'],
        teamNumber: req.body.data[i]['Number'],
        teamName: req.body.data[i]['Name'],
        city: req.body.data[i]['City'],
        state: req.body.data[i]['St/Prov'],
        coachFirstName: req.body.data[i]['Coach Fname'],
        coachLastName: req.body.data[i]['Coach Lname'],
        longTime: req.body.data[i]['Longt Time'],
        SponTime: req.body.data[i]['Spont Time']
      });

      team.save()
        .catch(handleError(res));
    }

    res.json({success: true});
  }
}

// Updates an existing Upload in the DB
export function update(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  Upload.findByIdAsync(req.params.id)
    .then(handleEntityNotFound(res))
    .then(saveUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a Upload from the DB
export function destroy(req, res) {
  Upload.findByIdAsync(req.params.id)
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}
