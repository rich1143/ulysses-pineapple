'use strict';

describe('Controller: ViewerCtrl', function () {

  // load the controller's module
  beforeEach(module('ulyssesApp'));

  var ViewerCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ViewerCtrl = $controller('ViewerCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
