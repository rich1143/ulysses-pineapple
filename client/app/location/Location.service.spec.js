'use strict';

describe('Service: location', function () {

  // load the service's module
  beforeEach(module('ulyssesApp'));

  // instantiate service
  var Location;
  beforeEach(inject(function (_Location_) {
    Location = _Location_;
  }));

  it('should do something', function () {
    expect(!!Location).toBe(true);
  });

});
