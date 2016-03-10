'use strict';

describe('Directive: file', function () {

  // load the directive's module
  beforeEach(module('ulyssesApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
