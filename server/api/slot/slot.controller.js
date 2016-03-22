/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/slots              ->  index
 * POST    /api/slots              ->  create
 * GET     /api/slots/:id          ->  show
 * PUT     /api/slots/:id          ->  update
 * DELETE  /api/slots/:id          ->  destroy
 */

'use strict';

import _ from 'lodash';
import Slot from './slot.model';

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
    var updated = _.extend(entity, updates);
    return updated.saveAsync()
      .spread(updated => {
        console.log("updated");
        console.log(updated);
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

// Gets a list of Slots
export function index(req, res) {
  Slot.findAsync(req.query)
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single Slot from the DB
export function show(req, res) {
  Slot.findByIdAsync(req.params.id)
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new Slot in the DB
export function create(req, res) {
  Slot.createAsync(req.body)
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
}

// Updates an existing Slot in the DB
export function update(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  Slot.findByIdAsync(req.params.id)
    .then(handleEntityNotFound(res))
    .then(saveUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a Slot from the DB
export function destroy(req, res) {
  Slot.findByIdAsync(req.params.id)
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}
