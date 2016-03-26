'use strict';

describe('Controller: BuilderCtrl', function () {

  // load the controller's module
  beforeEach(module('ulyssesApp'));

  var BuilderCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    BuilderCtrl = $controller('BuilderCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
