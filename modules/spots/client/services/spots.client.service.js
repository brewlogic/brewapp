// Spots service used to communicate Spots REST endpoints
(function () {
  'use strict';

  angular
    .module('spots')
    .factory('SpotsService', SpotsService);

  SpotsService.$inject = ['$resource'];

  function SpotsService($resource) {
    return $resource('api/spots/:spotId', {
      spotId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
