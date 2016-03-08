'use strict';

describe('Controller: SlotCtrl', function () {

  // load the controller's module
  beforeEach(module('ulyssesApp'));

  var SlotCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    SlotCtrl = $controller('SlotCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
