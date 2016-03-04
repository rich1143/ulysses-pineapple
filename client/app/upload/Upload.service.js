'use strict';

angular.module('ulyssesApp')
  .factory('Upload', function($resource) {
    return new $resource('/api/upload/:id');
  });
