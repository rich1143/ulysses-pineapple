'use strict';

angular.module('ulyssesApp')
  .factory('Volunteer', function($resource) {
    return new $resource('/api/volunteers/:id', null, {
    'update': { method: 'PUT'}
  });
});
