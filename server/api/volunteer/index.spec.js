'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var volunteerCtrlStub = {
  index: 'volunteerCtrl.index',
  show: 'volunteerCtrl.show',
  create: 'volunteerCtrl.create',
  update: 'volunteerCtrl.update',
  destroy: 'volunteerCtrl.destroy'
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
var volunteerIndex = proxyquire('./index.js', {
  'express': {
    Router: function() {
      return routerStub;
    }
  },
  './volunteer.controller': volunteerCtrlStub,
  '../../auth/auth.service': authServiceStub
});

describe('Volunteer API Router:', function() {

  it('should return an express router instance', function() {
    volunteerIndex.should.equal(routerStub);
  });

  describe('GET /api/volunteers', function() {

    it('should route to volunteer.controller.index', function() {
      routerStub.get
        .withArgs('/', 'authService.isAuthenticated', 'volunteerCtrl.index')
        .should.have.been.calledOnce;
    });

  });

  describe('GET /api/volunteers/:id', function() {

    it('should route to volunteer.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'authService.isAuthenticated', 'volunteerCtrl.show')
        .should.have.been.calledOnce;
    });

  });

  describe('POST /api/volunteers', function() {

    it('should route to volunteer.controller.create', function() {
      routerStub.post
        .withArgs('/', 'authService.isAuthenticated', 'volunteerCtrl.create')
        .should.have.been.calledOnce;
    });

  });

  describe('PUT /api/volunteers/:id', function() {

    it('should route to volunteer.controller.update', function() {
      routerStub.put
        .withArgs('/:id', 'authService.isAuthenticated', 'volunteerCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('PATCH /api/volunteers/:id', function() {

    it('should route to volunteer.controller.update', function() {
      routerStub.patch
        .withArgs('/:id', 'authService.isAuthenticated', 'volunteerCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('DELETE /api/volunteers/:id', function() {

    it('should route to volunteer.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'authService.isAuthenticated', 'volunteerCtrl.destroy')
        .should.have.been.calledOnce;
    });

  });

});
