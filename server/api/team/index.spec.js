'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var teamCtrlStub = {
  index: 'teamCtrl.index',
  show: 'teamCtrl.show',
  create: 'teamCtrl.create',
  update: 'teamCtrl.update',
  destroy: 'teamCtrl.destroy'
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
var teamIndex = proxyquire('./index.js', {
  'express': {
    Router: function() {
      return routerStub;
    }
  },
  './team.controller': teamCtrlStub,
  '../../auth/auth.service': authServiceStub
});

describe('Team API Router:', function() {

  it('should return an express router instance', function() {
    teamIndex.should.equal(routerStub);
  });

  describe('GET /api/teams', function() {

    it('should route to team.controller.index', function() {
      routerStub.get
        .withArgs('/', 'authService.hasRole.organizer', 'teamCtrl.index')
        .should.have.been.calledOnce;
    });

  });

  describe('GET /api/teams/:id', function() {

    it('should route to team.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'authService.hasRole.organizer', 'teamCtrl.show')
        .should.have.been.calledOnce;
    });

  });

  describe('POST /api/teams', function() {

    it('should route to team.controller.create', function() {
      routerStub.post
        .withArgs('/', 'authService.hasRole.organizer', 'teamCtrl.create')
        .should.have.been.calledOnce;
    });

  });

  describe('PUT /api/teams/:id', function() {

    it('should route to team.controller.update', function() {
      routerStub.put
        .withArgs('/:id', 'authService.hasRole.organizer', 'teamCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('PATCH /api/teams/:id', function() {

    it('should route to team.controller.update', function() {
      routerStub.patch
        .withArgs('/:id', 'authService.hasRole.organizer', 'teamCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('DELETE /api/teams/:id', function() {

    it('should route to team.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'authService.hasRole.organizer', 'teamCtrl.destroy')
        .should.have.been.calledOnce;
    });

  });

});
