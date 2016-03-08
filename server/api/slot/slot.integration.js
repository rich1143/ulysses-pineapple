'use strict';

var app = require('../..');
import request from 'supertest';

var newSlot;

describe('Slot API:', function() {

  describe('GET /api/slots', function() {
    var slots;

    beforeEach(function(done) {
      request(app)
        .get('/api/slots')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          slots = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      slots.should.be.instanceOf(Array);
    });

  });

  describe('POST /api/slots', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/slots')
        .send({
          name: 'New Slot',
          info: 'This is the brand new slot!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          newSlot = res.body;
          done();
        });
    });

    it('should respond with the newly created slot', function() {
      newSlot.name.should.equal('New Slot');
      newSlot.info.should.equal('This is the brand new slot!!!');
    });

  });

  describe('GET /api/slots/:id', function() {
    var slot;

    beforeEach(function(done) {
      request(app)
        .get('/api/slots/' + newSlot._id)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          slot = res.body;
          done();
        });
    });

    afterEach(function() {
      slot = {};
    });

    it('should respond with the requested slot', function() {
      slot.name.should.equal('New Slot');
      slot.info.should.equal('This is the brand new slot!!!');
    });

  });

  describe('PUT /api/slots/:id', function() {
    var updatedSlot;

    beforeEach(function(done) {
      request(app)
        .put('/api/slots/' + newSlot._id)
        .send({
          name: 'Updated Slot',
          info: 'This is the updated slot!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          updatedSlot = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedSlot = {};
    });

    it('should respond with the updated slot', function() {
      updatedSlot.name.should.equal('Updated Slot');
      updatedSlot.info.should.equal('This is the updated slot!!!');
    });

  });

  describe('DELETE /api/slots/:id', function() {

    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete('/api/slots/' + newSlot._id)
        .expect(204)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when slot does not exist', function(done) {
      request(app)
        .delete('/api/slots/' + newSlot._id)
        .expect(404)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });

  });

});
