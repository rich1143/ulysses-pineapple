'use strict';

angular.module('ulyssesApp')
  .factory('Slot', function($resource) {
    return new $resource('/api/slots/:id');
  });
