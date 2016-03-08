'use strict';

describe('Service: Slot', function () {

  // load the service's module
  beforeEach(module('ulyssesApp'));

  // instantiate service
  var Slot;
  beforeEach(inject(function (_Slot_) {
    Slot = _Slot_;
  }));

  it('should do something', function () {
    expect(!!Slot).toBe(true);
  });

});
