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
  for(var i = 0; i < req.body.data.length; i++) {
    if(i == 0) {
      console.log(req.body.data[i]['First name']);
      var volunteer = new Volunteer({
        firstName: req.body.data[i]['First name'],
        lastName: req.body.data[i]['Last name']
      });

      volunteer.save().then(respondWithResult(res))
        .catch(handleError(res));
    }

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
