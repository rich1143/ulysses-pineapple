'use strict';

angular.module('ulyssesApp')
  .factory('Job', function($resource) {
    return new $resource('/api/jobs/:id');
  });
