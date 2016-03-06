'use strict';

describe('Service: Job', function () {

  // load the service's module
  beforeEach(module('ulyssesApp'));

  // instantiate service
  var Job;
  beforeEach(inject(function (_Job_) {
    Job = _Job_;
  }));

  it('should do something', function () {
    expect(!!Job).toBe(true);
  });

});
