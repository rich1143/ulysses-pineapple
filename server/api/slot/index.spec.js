'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var slotCtrlStub = {
  index: 'slotCtrl.index',
  show: 'slotCtrl.show',
  create: 'slotCtrl.create',
  update: 'slotCtrl.update',
  destroy: 'slotCtrl.destroy'
};

var authServiceStub = {
  isAuthenticated() {
    return 'authService.isAuthenticated';
  },
  hasRole(role) {
    return 'authService.hasRole.' + role;
  }
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var slotIndex = proxyquire('./index.js', {
  'express': {
    Router: function() {
      return routerStub;
    }
  },
  './slot.controller': slotCtrlStub,
  '../../auth/auth.service': authServiceStub
});

describe('Slot API Router:', function() {

  it('should return an express router instance', function() {
    slotIndex.should.equal(routerStub);
  });

  describe('GET /api/slots', function() {

    it('should route to slot.controller.index', function() {
      routerStub.get
        .withArgs('/', 'authService.isAuthenticated', 'slotCtrl.index')
        .should.have.been.calledOnce;
    });

  });

  describe('GET /api/slots/:id', function() {

    it('should route to slot.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'authService.isAuthenticated', 'slotCtrl.show')
        .should.have.been.calledOnce;
    });

  });

  describe('POST /api/slots', function() {

    it('should route to slot.controller.create', function() {
      routerStub.post
        .withArgs('/', 'authService.isAuthenticated', 'slotCtrl.create')
        .should.have.been.calledOnce;
    });

  });

  describe('PUT /api/slots/:id', function() {

    it('should route to slot.controller.update', function() {
      routerStub.put
        .withArgs('/:id', 'authService.isAuthenticated', 'slotCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('PATCH /api/slots/:id', function() {

    it('should route to slot.controller.update', function() {
      routerStub.patch
        .withArgs('/:id', 'authService.isAuthenticated', 'slotCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('DELETE /api/slots/:id', function() {

    it('should route to slot.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'authService.isAuthenticated', 'slotCtrl.destroy')
        .should.have.been.calledOnce;
    });

  });

});
