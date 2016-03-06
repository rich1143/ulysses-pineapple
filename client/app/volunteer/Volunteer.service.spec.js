'use strict';

describe('Service: Volunteer', function () {

  // load the service's module
  beforeEach(module('ulyssesApp'));

  // instantiate service
  var Volunteer;
  beforeEach(inject(function (_Volunteer_) {
    Volunteer = _Volunteer_;
  }));

  it('should do something', function () {
    expect(!!Volunteer).toBe(true);
  });

});
