'use strict';

describe('Controller: VolunteerCtrl', function () {

  // load the controller's module
  beforeEach(module('ulyssesApp'));

  var VolunteerCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    VolunteerCtrl = $controller('VolunteerCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
