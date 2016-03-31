'use strict';

angular.module('ulyssesApp')
  .factory('Location', function($resource) {
    return new $resource('/api/locations/:id', null, {
      'update': { method: 'PUT'}
    });
  });
