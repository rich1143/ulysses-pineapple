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

  //describe('tests for time slot conflict', function(){
  //  it('should return true if start time 2 is within start time 1 and end time 1', function() {
  //    slot1 = {start: "1030", end: "1530"};
  //    slot2 = {start: "1230", end: "1530"};
  //    expect(SlotCtrl.isConflict(slot1,slot2)).toBe(true);
  //  });
  //});


});
